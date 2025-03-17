import "sap/fe/core/library";
import Library from "sap/ui/core/Lib";
/**
 * Library providing the integration of INA services into the SAP Fiori elements framework.
 * @namespace
 */
export const feInaNamespace = "sap.fe.ina";

const thisLib = Library.init({
	name: "sap.fe.ina",
	apiVersion: 2,
	dependencies: ["sap.ui.core", "sap.fe.core"],
	types: [],
	interfaces: [],
	controls: [],
	elements: [],
	// eslint-disable-next-line no-template-curly-in-string
	version: "${version}",
	noLibraryCSS: true
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

export default thisLib;
