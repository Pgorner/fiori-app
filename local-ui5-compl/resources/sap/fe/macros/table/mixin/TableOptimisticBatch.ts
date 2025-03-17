import { type IInterfaceWithMixin } from "sap/fe/base/ClassSupport";
import type PromiseKeeper from "sap/fe/core/helpers/PromiseKeeper";
import type FETableDelegate from "sap/fe/macros/table/delegates/TableDelegate";
import type ListReportController from "sap/fe/templates/ListReport/ListReportController.controller";
import type UI5Event from "sap/ui/base/Event";
import type Control from "sap/ui/core/Control";
import UI5Element from "sap/ui/core/Element";
import { type ITableBlock } from "../TableAPI";

export default class TableOptimisticBatch implements IInterfaceWithMixin {
	private optimisticBatchEnablerPromise?: PromiseKeeper<boolean>;

	setupMixin(_baseClass: Function): void {
		this.optimisticBatchEnablerPromise = undefined;
	}

	async setupOptimisticBatch(this: ITableBlock): Promise<void> {
		const table = this.getContent();
		if (!table) {
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		const tableDelegate = (await table?.awaitControlDelegate()) as typeof FETableDelegate;
		const filterBar = UI5Element.getElementById(table?.getFilter()) as Control | undefined;
		if (filterBar && filterBar.getParent) {
			filterBar.getParent()?.attachEvent("search", (searchEvent: UI5Event<{ reason: string }>) => {
				const tableAPI = table.getParent() as ITableBlock;
				const controller = tableAPI.getPageController()!;
				const controllerExtension = controller.extension;
				if (
					controller &&
					controller.isA("sap.fe.templates.ListReport.ListReportController") &&
					controllerExtension === undefined &&
					!["Go", "Enter"].includes(searchEvent.getParameter("reason"))
				) {
					try {
						tableDelegate?.setOptimisticBatchPromiseForModel(controller as ListReportController, tableAPI);
						tableDelegate?.enableOptimisticBatchMode(controller as ListReportController, table);
					} catch (e) {
						// An exception will be thrown when the user clicks go and the table data has already been loaded
						// (setOptimisticBatchPromiseForModel is not supposed to be called once a batch has already been sent)
						// We just ignore this exception
					}
				}
				const internalBindingContext = table.getBindingContext("internal");
				internalBindingContext?.setProperty("searchFired", true);
			});
		}
	}

	/**
	 * Setter for the optimisticBatchEnablerPromise property.
	 * @param optimisticBatchEnablerPromiseObject The Promise that is to be resolved by the V4 model
	 */
	setOptimisticBatchEnablerPromise(optimisticBatchEnablerPromiseObject: PromiseKeeper<boolean>): void {
		this.optimisticBatchEnablerPromise = optimisticBatchEnablerPromiseObject;
	}

	/**
	 * Getter for the optimisticBatchEnablerPromise property.
	 * @returns The optimisticBatchEnablerPromise property.
	 */
	getOptimisticBatchEnablerPromise(): PromiseKeeper<boolean> | undefined {
		return this.optimisticBatchEnablerPromise;
	}

	/**
	 * Method to know if ListReport is configured with Optimistic batch mode disabled.
	 * @returns Is Optimistic batch mode disabled
	 */
	isOptimisticBatchDisabled(this: ITableBlock): boolean {
		return this.getTableDefinition().control.disableRequestCache || false;
	}
}
