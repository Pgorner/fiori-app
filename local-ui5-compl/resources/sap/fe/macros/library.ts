import Log from "sap/base/Log";
import "sap/f/library";
import "sap/fe/controls/library";
import AppComponent from "sap/fe/core/AppComponent";
import type ExtensionAPI from "sap/fe/core/ExtensionAPI";
import type PageController from "sap/fe/core/PageController";
import "sap/fe/core/library";
import "sap/fe/macros/coreUI/factory";
import FilterOperatorUtils from "sap/fe/macros/filter/FilterOperatorUtils";
import "sap/fe/macros/filter/type/MultiValue";
import "sap/fe/macros/filter/type/Range";
import "sap/fe/macros/formatters/TableFormatter";
import "sap/fe/macros/macroLibrary";
import type Control from "sap/ui/core/Control";
import CustomData from "sap/ui/core/CustomData";
import Fragment from "sap/ui/core/Fragment";
import Library from "sap/ui/core/Lib";
import "sap/ui/core/XMLTemplateProcessor";
import "sap/ui/core/library";
import type View from "sap/ui/core/mvc/View";
import "sap/ui/mdc/field/ConditionsType";
import "sap/ui/mdc/library";
import "sap/ui/unified/library";

/**
 * Library containing the building blocks for SAP Fiori elements.
 * @namespace
 * @public
 */
export const macrosNamespace = "sap.fe.macros";

// library dependencies
const thisLib = Library.init({
	name: "sap.fe.macros",
	apiVersion: 2,
	dependencies: ["sap.ui.core", "sap.ui.mdc", "sap.ui.unified", "sap.fe.core", "sap.fe.navigation", "sap.fe.controls", "sap.m", "sap.f"],
	types: ["sap.fe.macros.NavigationType"],
	interfaces: [],
	controls: [],
	elements: [],
	// eslint-disable-next-line no-template-curly-in-string
	version: "${version}",
	noLibraryCSS: true,
	extensions: {
		flChangeHandlers: {
			"sap.fe.macros.controls.FilterBar": "sap/ui/mdc/flexibility/FilterBar",
			"sap.fe.macros.controls.Section": "sap/uxap/flexibility/ObjectPageSection"
		}
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

thisLib.NavigationType = {
	/**
	 * For External Navigation
	 * @public
	 */
	External: "External",

	/**
	 * For In-Page Navigation
	 * @public
	 */
	InPage: "InPage",

	/**
	 * For No Navigation
	 * @public
	 */
	None: "None"
};

Fragment.registerType("CUSTOM", {
	load: (Fragment as { getType?: Function }).getType?.("XML").load,
	init: async function (
		mSettings: { containingView: View; id: string; childCustomData: Record<string, string> | undefined },
		...args: unknown[]
	) {
		const currentController = mSettings.containingView.getController() as PageController;
		let targetControllerExtension: PageController | ExtensionAPI = currentController;
		if (currentController && !currentController.isA<ExtensionAPI>("sap.fe.core.ExtensionAPI")) {
			targetControllerExtension = currentController.getExtensionAPI(mSettings.id);
		}
		mSettings.containingView = {
			oController: targetControllerExtension
		} as unknown as View;
		const childCustomData = mSettings.childCustomData ?? undefined;
		delete mSettings.childCustomData;

		const result = await (Fragment as unknown as { getType: Function }).getType("XML").init.apply(this, [mSettings, args]);
		if (childCustomData && result?.isA("sap.ui.core.Control")) {
			for (const customDataKey in childCustomData) {
				// UI5 adds 'bindingString' when its an adaptation project (SNOW: DINC0143515), which results in errors later
				if (customDataKey === "bindingString") {
					delete childCustomData[customDataKey];
					continue;
				}
				(result as Control).addCustomData(new CustomData({ key: customDataKey, value: childCustomData[customDataKey] }));
			}
		}

		return result;
	}
});

Library.load({ name: "sap.fe.macros" })
	.then(() => {
		AppComponent.registerInstanceDependentProcessForStartUp(FilterOperatorUtils.processCustomFilterOperators);
		return;
	})
	.catch((error: unknown) => {
		Log.error(`Error loading 'sap.fe.macros`, error as Error | string);
	});

export default thisLib;
