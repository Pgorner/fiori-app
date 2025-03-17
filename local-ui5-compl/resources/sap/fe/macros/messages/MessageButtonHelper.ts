import Dialog from "sap/m/Dialog";
import type ManagedObject from "sap/ui/base/ManagedObject";
import UI5Element from "sap/ui/core/Element";
import ValueHelpDialog from "sap/ui/mdc/valuehelp/Dialog";
import Filter from "sap/ui/model/Filter";

/**
 * Filter function to verify if the control is a part of the current view or not.
 * @param sViewId
 * @returns Filter
 */
function getCheckControlInViewFilter(sViewId: string): Filter {
	const fnTest = function (aControlIds: string[]): boolean {
		if (!aControlIds.length) {
			return false;
		}
		let oControl: ManagedObject | undefined | null = UI5Element.getElementById(aControlIds[0]);
		while (oControl) {
			if (oControl.getId() === sViewId) {
				return true;
			}
			if (oControl instanceof Dialog || oControl instanceof ValueHelpDialog) {
				// messages for sap.m.Dialog should not appear in the message button
				return false;
			}
			oControl = oControl.getParent();
		}
		return false;
	};
	return new Filter({
		path: "controlIds",
		test: fnTest,
		caseSensitive: true
	});
}

const messageButtonHelper = {
	getCheckControlInViewFilter
};

export default messageButtonHelper;
