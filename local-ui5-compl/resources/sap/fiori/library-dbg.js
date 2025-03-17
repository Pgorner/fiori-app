/*!
 * SAPUI5
 *
 * (c) Copyright 2009-2024 SAP SE. All rights reserved
 */

/**
 * Initialization Code and shared classes of library sap.fiori.
 */
sap.ui.define([
	"sap/base/i18n/Localization",
	"sap/base/i18n/ResourceBundle",
	"sap/ui/core/Lib",
	"sap/ui/core/library" // library dependency
], function(Localization, ResourceBundle, Library) {

	"use strict";

	/**
	 * A hybrid UILibrary, merged from the most common UILibraries that are used in Fiori apps
	 *
	 * @namespace
	 * @alias sap.fiori
	 * @public
	 */
	const thisLib = Library.init({
		name : "sap.fiori",
		apiVersion: 2,
		dependencies : ["sap.ui.core"],
		version: "1.132.1"
	});

	/**
	 * @deprecated As sync loading has been deprecated.
	 */
	(() => {
		let sLanguage = Localization.getLanguage();
		const aDeliveredLanguages = Localization.getLanguagesDeliveredWithCore();
		const aLanguages = ResourceBundle._getFallbackLocales(sLanguage, aDeliveredLanguages);

		// chose the most specific language first
		sLanguage = aLanguages[0];

		// if it is not undefined or the 'raw' language, load the corr. preload file
		if ( sLanguage && !window["sap-ui-debug"] && !sap.ui.loader.config().async ) {
			sap.ui.requireSync("sap/fiori/messagebundle-preload_" + sLanguage);
		}
	})();

	return thisLib;
});
