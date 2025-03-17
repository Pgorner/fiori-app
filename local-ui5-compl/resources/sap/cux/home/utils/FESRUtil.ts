/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Control from "sap/ui/core/Control";
import UI5Element from "sap/ui/core/Element";
import FESRHelper from "sap/ui/performance/trace/FESRHelper";

export enum FESR_EVENTS {
	PRESS = "press",
	CHANGE = "change",
	SELECT = "select"
}

export const addFESRId = (control: Control | UI5Element, fesrId: string) => {
	control.data("fesr-id", fesrId);
	return control;
};

export const getFESRId = (control: Control | UI5Element) => {
	return control.data("fesr-id") as string;
};

export const addFESRSemanticStepName = (element: UI5Element, eventName: string, stepName: string) => {
	if (stepName) {
		FESRHelper.setSemanticStepname(element, eventName, stepName);
	}
};
