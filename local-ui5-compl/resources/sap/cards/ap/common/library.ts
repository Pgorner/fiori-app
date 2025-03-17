/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import "sap/cards/ap/transpiler/library";
import "sap/fe/navigation/library";
import CoreLib from "sap/ui/core/Lib";
import "sap/ui/core/library";
import "sap/ui/integration/library";

const thisLib = CoreLib.init({
	name: "sap.cards.ap.common",
	version: "${version}",
	dependencies: ["sap.ui.core", "sap.ui.integration", "sap.fe.navigation", "sap.cards.ap.transpiler"],
	types: [],
	apiVersion: 2,
	interfaces: [],
	controls: [],
	elements: [],
	noLibraryCSS: true
});

export default thisLib;
