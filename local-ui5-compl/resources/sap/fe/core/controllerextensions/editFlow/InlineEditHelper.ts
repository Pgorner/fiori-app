import { type FEView } from "sap/fe/core/BaseController";
import type Control from "sap/ui/core/Control";
import Element from "sap/ui/core/Element";
import type JSONModel from "sap/ui/model/json/JSONModel";

const INLINEEDIT_UPDATEGROUPID = "inlineEdit";

/**
 * Toggles the control in local edit mode.
 * @param control The control to toggle
 * @param showInEdit Whether to show the control in edit mode
 */
export function toggleControlLocalEdit(control: Control, showInEdit: boolean): void {
	const uiModel = control.getModel("ui") as JSONModel;
	const registeredBindingContexts = uiModel.getProperty("/registeredBindingContexts") ?? [];
	const controlId = control.getId();
	if (showInEdit) {
		const path = `/${controlId}`;
		uiModel.setProperty(path, { isEditable: true });
		control.bindElement({ path, model: "ui" });
		registeredBindingContexts.push(controlId);
		uiModel.setProperty("/registeredBindingContexts", registeredBindingContexts);
	} else {
		control.unbindElement("ui");
		uiModel.setProperty(
			"/registeredBindingContexts",
			registeredBindingContexts.filter((id: string) => id !== controlId)
		);
	}
}

/**
 * Leaves inline edit mode.
 * @param view The view
 */
export function leaveInlineEdit(view: FEView): void {
	view.getModel().resetChanges(INLINEEDIT_UPDATEGROUPID);
	const uiModel = view.getModel("ui");
	const registeredBindingContexts = uiModel.getProperty("/registeredBindingContexts") ?? [];
	for (const controlId of registeredBindingContexts) {
		const control = Element.getElementById(controlId);
		if (control) {
			control.unbindElement("ui");
		}
	}
	uiModel.setProperty("/registeredBindingContexts", []);
}
