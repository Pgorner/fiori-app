import Lib from "sap/ui/core/Lib";
import "sap/ui/core/XMLTemplateProcessor";
import "sap/ui/core/library";
import "sap/ui/thirdparty/jquery";

/**
 * Library containing the building blocks for SAP Fiori elements.
 * @namespace
 * @public
 */
export const managecache = "sap.fe.plugins.managecache";

// library dependencies
const thisLib = Lib.init({
	apiVersion: 2,
	name: "sap.fe.plugins.managecache",
	dependencies: ["sap.ui.core", "sap.m"],
	types: [],
	interfaces: [],
	controls: [],
	elements: [],
	// eslint-disable-next-line no-template-curly-in-string
	version: "${version}",
	noLibraryCSS: true
});

export default thisLib;
