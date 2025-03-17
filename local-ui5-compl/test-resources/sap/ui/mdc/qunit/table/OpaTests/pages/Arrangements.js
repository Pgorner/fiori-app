/*
 * ! OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/test/Opa5"
], function(
	/** @type sap.ui.test.Opa5 */ Opa5) {
	"use strict";

	/**
	 * @class Arrangements
	 * @extends sap.ui.test.Opa5
	 * @private
	 * @alias sap.ui.mdc.qunit.table.OpaTests.pages.Arrangements
	 */
	const Arrangements = Opa5.extend("sap.ui.mdc.table.OpaTests.pages.Arrangements", {
		iStartMyApp: function(sAppFolderName) {
			return this.iStartMyAppInAFrame({
				source: "test-resources/sap/ui/mdc/qunit/table/OpaTests/" + sAppFolderName + "/index.html",
				autoWait: true,
				width: 1024,
				height: 720
			});
		}
	});

	return Arrangements;
});