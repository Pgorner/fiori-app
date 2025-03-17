sap.ui.define([
	"sap/ui/Device"
],function(
	Device
){
	"use strict";
	var oUnitTest =  {
		name: "Package 'sap.ui.comp.smartvariants'",
		defaults: {
			group: "SmartVariants",
			qunit: {
				version: 2
			},
			sinon: {
				version: 4
			},
			ui5: {
				language: "en-US",
				rtl: false,
				libs: [
					"sap.ui.comp"
				],
				"xx-waitForTheme": true
			},
			coverage: {
				only: "sap/ui/comp",
				branchCoverage: true
			},
			loader: {
				paths: {
					"sap/ui/comp/qunit": "test-resources/sap/ui/comp/qunit/",
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/"
				}
			},
			autostart: true,
			module: "./{name}.qunit"
		},
		tests: {
			"PersonalizableInfo": {
				group: "SmartVariants",
				coverage: {
					only: "sap/ui/comp/smartvariants/PersonalizableInfo.js"
				}
			},
			"SmartVariantManagement": {
				group: "SmartVariants",
				coverage: {
					only: "sap/ui/comp/smartvariants/SmartVariantManagement.js"
				}
			},
			"SmartVariantManagementUi2": {
				group: "SmartVariants",
				coverage: {
					only: "sap/ui/comp/smartvariants/SmartVariantManagementUi2.js"
				}
			},
			"SmartVariantManagementBase": {
				group: "SmartVariants",
				coverage: {
					only: "sap/ui/comp/smartvariants/SmartVariantManagementBase.js"
				}
			},
			"SmartVariantManagementMediator": {
				group: "SmartVariants",
				coverage: {
					only: "sap/ui/comp/smartvariants/SmartVariantManagementMediator.js"
				}
			},
			"SmartVariantManagementModel": {
				group: "SmartVariants",
				coverage: {
					only: "sap/ui/comp/smartvariants/SmartVariantManagementModel.js"
				}
			},
			"opaTests/Opa": {
				group: "SmartVariants"
			}
		}
	};

	return oUnitTest;
});
