/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Dialog from "sap/m/Dialog";
import Control from "sap/ui/core/Control";

class LayoutHandler {
	private keyuserPersDialog!: Dialog;
	private persDialogResolve!: (value: unknown) => void;
	private allChanges: Array<unknown> = [];

	public loadPersonalizationDialog(oWrapperControl: Control, mPropertyBag: Record<string, unknown>) {
		return new Promise((resolve) => {
			this.persDialogResolve = resolve;
			this.keyuserPersDialog = oWrapperControl.getAggregation("keyUserSettingsDialog") as Dialog;
			// Add RTA Class and show dialog
			this.keyuserPersDialog.addStyleClass(mPropertyBag.styleClass as string);

			// Open the dialog
			this.keyuserPersDialog.open();
		});
	}

	public onCancelDialog() {
		this.keyuserPersDialog.close();
	}

	public addChanges(aChanges: Array<unknown>) {
		this.allChanges.push(...aChanges);
	}

	public clearChanges() {
		this.allChanges = [];
	}

	public resolve() {
		this.persDialogResolve(this.allChanges);
	}
}

const layoutHandler = new LayoutHandler();

export default layoutHandler;
