import { defineUI5Class, property, type PropertiesOf } from "sap/fe/base/ClassSupport";
import type AppComponent from "sap/fe/core/AppComponent";
import type ResourceModel from "sap/fe/core/ResourceModel";
import BuildingBlock from "sap/fe/core/buildingBlocks/BuildingBlock";
import { ButtonType } from "sap/fe/core/converters/controls/Common/Action";
import { getResourceModel } from "sap/fe/core/helpers/ResourceModelHelper";
import type TableAPI from "sap/fe/macros/table/TableAPI";
import Button from "sap/m/Button";
import Dialog from "sap/m/Dialog";
import Page from "sap/m/Page";
import Panel from "sap/m/Panel";
import Component from "sap/ui/core/Component";
import type Control from "sap/ui/core/Control";
import { JsControlTreeModifier } from "sap/ui/core/util/reflection";
import { type $ControlSettings } from "sap/ui/mdc/Control";
import type GridTableType from "sap/ui/mdc/table/GridTableType";
import type TreeTableType from "sap/ui/mdc/table/TreeTableType";

@defineUI5Class("sap.fe.macros.table.TableFullScreenButton")
export default class TableFullScreenButton extends BuildingBlock<Button> {
	@property({ type: "string" })
	id!: string;

	protected tableAPI?: TableAPI;

	protected fullScreenDialog?: Dialog;

	protected originalTableParent?: Control;

	protected originalAggregationName?: string;

	protected tablePlaceHolderPanel: Panel;

	protected resourceModel!: ResourceModel;

	constructor(properties: $ControlSettings & PropertiesOf<TableFullScreenButton>, others?: $ControlSettings) {
		super(properties, others);

		this.tablePlaceHolderPanel = new Panel();
		this.tablePlaceHolderPanel.data("FullScreenTablePlaceHolder", true);
	}

	protected getTableAPI(): TableAPI {
		if (!this.tableAPI) {
			let currentControl = this.content as Control;
			do {
				currentControl = currentControl.getParent() as Control;
			} while (!currentControl.isA("sap.fe.macros.table.TableAPI"));
			this.tableAPI = currentControl as TableAPI;
			return this.tableAPI;
		} else {
			return this.tableAPI;
		}
	}

	/**
	 * Handler for the onMetadataAvailable event.
	 */
	onMetadataAvailable(): void {
		if (!this.content) {
			this.initializeContent();
		}
	}

	/**
	 * Set the focus back to the full screen button after opening the dialog.
	 */
	private afterDialogOpen(): void {
		this.content?.focus();
	}

	/**
	 * Handle dialog close via Esc, navigation etc.
	 */
	private beforeDialogClose(): void {
		this.getTableAPI().setFullScreenDialog(undefined);
		this.restoreNormalState();
	}

	/**
	 * Some follow up after closing the dialog.
	 */
	private afterDialogClose(): void {
		this.fullScreenDialog?.destroy();
		this.fullScreenDialog = undefined;

		const component = Component.getOwnerComponentFor(this.getTableAPI())!;
		const appComponent = Component.getOwnerComponentFor(component) as AppComponent;
		this.content?.focus();
		// trigger the automatic scroll to the latest navigated row :
		appComponent?.getRootViewController()._scrollTablesToLastNavigatedItems();
	}

	/**
	 * Create the full screen dialog.
	 * @returns The new dialog
	 */
	private createDialog(): Dialog {
		const endButton = (
			<Button
				text={this.resourceModel.getText("M_COMMON_TABLE_FULLSCREEN_CLOSE")}
				type={ButtonType.Transparent}
				press={(): void => {
					// Just close the dialog here, all the needed processing is triggered
					// in beforeClose.
					// This ensures, that we only do it once event if the user presses the
					// ESC key and the Close button simultaneously
					this.fullScreenDialog?.close();
				}}
			/>
		);

		const newDialog = (
			<Dialog
				showHeader={false}
				stretch={true}
				afterOpen={this.afterDialogOpen.bind(this)}
				beforeClose={this.beforeDialogClose.bind(this)}
				afterClose={this.afterDialogClose.bind(this)}
				endButton={endButton}
				content={<Page />}
			/>
		);

		// The below is needed for correctly setting the focus after adding a new row in
		// the table in fullscreen mode
		newDialog.data("FullScreenDialog", true);

		return newDialog;
	}

	/**
	 * Restores the table to its "normal" state (non fullscreen).
	 * Changes the button icon and text and moves the table back to its original place.
	 */
	private restoreNormalState(): void {
		// change the button icon and text
		this.content?.setIcon("sap-icon://full-screen");
		this.content?.setTooltip(this.resourceModel.getText("M_COMMON_TABLE_FULLSCREEN_MAXIMIZE"));

		//set the rowCountMode to the initial value (if it was set in the manifest)
		if (
			this.getTableAPI().getTableDefinition().control.type === "GridTable" ||
			(this.getTableAPI().getTableDefinition().control.type === "TreeTable" &&
				this.getTableAPI().getTableDefinition().control.rowCountMode)
		) {
			(this.getTableAPI().getContent().getType() as GridTableType).setRowCountMode(
				this.getTableAPI().getTableDefinition().control.rowCountMode
			);
		}

		// Move the table back to the old place and close the dialog
		const aggregation = this.originalTableParent!.getAggregation(this.originalAggregationName!);
		if (Array.isArray(aggregation)) {
			this.originalTableParent!.removeAggregation(this.originalAggregationName!, this.tablePlaceHolderPanel);
			this.originalTableParent!.addAggregation(this.originalAggregationName!, this.getTableAPI());
		} else {
			this.originalTableParent!.setAggregation(this.originalAggregationName!, this.getTableAPI());
		}
	}

	/**
	 * Switches the table between normal display and fullscreen.
	 */
	async onFullScreenToggle(): Promise<void> {
		if (this.fullScreenDialog) {
			// The dialog is open --> close it
			this.fullScreenDialog.close();
		} else {
			// Create a new fullscreen dialog

			// change the button icon and text
			this.content?.setIcon("sap-icon://exit-full-screen");
			this.content?.setTooltip(this.resourceModel.getText("M_COMMON_TABLE_FULLSCREEN_MINIMIZE"));
			this.tablePlaceHolderPanel.data("tableAPIreference", this.getTableAPI());

			// Store the current location of the table to be able to move it back later
			this.originalTableParent = this.getTableAPI().getParent()! as Control;
			this.originalAggregationName = await JsControlTreeModifier.getParentAggregationName(this.getTableAPI());

			// Replace the current position of the table with an empty Panel as a placeholder
			const aggregation = this.originalTableParent.getAggregation(this.originalAggregationName);
			if (Array.isArray(aggregation)) {
				this.originalTableParent.removeAggregation(this.originalAggregationName, this.getTableAPI());
				this.originalTableParent.addAggregation(this.originalAggregationName, this.tablePlaceHolderPanel);
			} else {
				this.originalTableParent.setAggregation(this.originalAggregationName, this.tablePlaceHolderPanel);
			}

			// Create the full screen dialog
			this.fullScreenDialog = this.createDialog();
			// Add the dialog as a dependent to the original parent of the table in order to not lose the context
			this.originalTableParent?.addDependent(this.fullScreenDialog);

			//Ensure that the rowCountMode of the mdc table is set to "Auto" to avoid the table from being cut off in fullscreen mode
			if (
				this.getTableAPI().getTableDefinition().control.type === "GridTable" ||
				this.getTableAPI().getTableDefinition().control.type === "TreeTable"
			) {
				(this.getTableAPI().getContent().getType() as GridTableType | TreeTableType).setRowCountMode("Auto");
			}

			// Move the table over into the content page in the dialog and open the dialog
			(this.fullScreenDialog.getContent()[0] as Page).addContent(this.getTableAPI());
			this.fullScreenDialog.open();
			this.getTableAPI().setFullScreenDialog(this.fullScreenDialog);
		}
	}

	/**
	 * Created the content (i.e. the button).
	 */
	private initializeContent(): void {
		this.resourceModel = getResourceModel(this);
		this.content = (
			<Button
				id={this.createId("_btn")}
				tooltip={this.resourceModel.getText("M_COMMON_TABLE_FULLSCREEN_MAXIMIZE")}
				icon={"sap-icon://full-screen"}
				press={this.onFullScreenToggle.bind(this)}
				type={"Transparent"}
				visible={true}
				enabled={true}
			/>
		);
	}
}
