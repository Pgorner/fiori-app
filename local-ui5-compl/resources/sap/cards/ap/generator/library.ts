/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import "sap/cards/ap/common/library";
import "sap/cards/ap/transpiler/library";
import "sap/m/library";
import "sap/tnt/library";
import CoreLib from "sap/ui/core/Lib";
import "sap/ui/core/library";
import "sap/ui/integration/library";

const thisLib = CoreLib.init({
	name: "sap.cards.ap.generator",
	version: "${version}",
	apiVersion: 2,
	dependencies: ["sap.ui.core", "sap.m", "sap.tnt", "sap.ui.integration", "sap.cards.ap.common", "sap.cards.ap.transpiler"],
	types: [],
	interfaces: [],
	controls: [],
	elements: [],
	noLibraryCSS: true
});

export default thisLib;
