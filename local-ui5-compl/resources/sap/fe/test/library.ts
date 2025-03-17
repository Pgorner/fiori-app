import Library from "sap/ui/core/Lib";
import "sap/ui/core/library";

/**
 * Test library for SAP Fiori elements
 * @namespace
 * @name sap.fe.test
 * @public
 */

// library dependencies
const thisLib = Library.init({
	name: "sap.fe.test",
	apiVersion: 2,
	dependencies: ["sap.ui.core"],
	types: [],
	interfaces: [],
	controls: [],
	elements: [],
	// eslint-disable-next-line no-template-curly-in-string
	version: "${version}",
	noLibraryCSS: true
});

export default thisLib;
