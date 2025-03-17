sap.ui.define([
],function(
){
	"use strict";
	var oUnitTest =  {
		name: "Package 'sap.ui.comp.smartform'",
		defaults: {
			group: "SmartForm",
			qunit: {
				version: 2
			},
			sinon: {
				version: 4
			},
			ui5: {
				language: "en",
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
			"Group": {
				coverage: {
					only: "sap/ui/comp/smartform/Group.js"
				}
			},
			"GroupElement": {
				coverage: {
					only: "sap/ui/comp/smartform/GroupElement.js"
				}
			},
			"SemanticGroupElement": {
				coverage: {
					only: "sap/ui/comp/smartform/SemanticGroupElement.js"
				}
			},
			"SmartForm": {
				coverage: {
					only: "sap/ui/comp/smartform/SmartForm.js"
				}
			},
			"flexibility/AddAndMoveGroupElement": {
				sinon: false,
				coverage: {
					only: [
						"sap/ui/comp/smartform/flexibility/changes"
					]
				}
			},
			"flexibility/AddAndMoveGroups": {
				sinon: false,
				coverage: {
					only: [
						"sap/ui/comp/smartform/flexibility/changes/AddGroup.js",
						"sap/ui/comp/smartform/flexibility/changes/MoveGroups.js"
					]
				}
			},
			"flexibility/AddMultiEditField": {
				sinon: false,
				coverage: {
					only: [
						"sap/ui/comp/smartform/flexibility/changes"
					]
				}
			},
			"flexibility/CombineSplitGroupElement": {
				sinon: false,
				coverage: {
					only: [
						"sap/ui/comp/smartform/flexibility/changes"
					]
				},
				loader: {
					map: {
						"*": {
							"sap/ui/thirdparty/sinon": "sap/ui/thirdparty/sinon-4" // Force MockServer to work with sinon-4
						}
					}
				}
			},
			"flexibility/CreateAndRenameGroup": {
				sinon: false,
				coverage: {
					only: "sap/ui/comp/smartform/flexibility/changes"
				}
			},
			//FIXME: Test is unstable during voter execution. Should be fixed by the responsible team
			// "flexibility/GroupElementFlexibility": {
			// 	sinon: false,
			// 	coverage: {
			// 		only: "sap/ui/comp/smartform/flexibility/changes"
			// 	}
			// },
			"flexibility/MoveAndRemoveGroup": {
				sinon: false,
				coverage: {
					only: "sap/ui/comp/smartform/flexibility/changes"
				}
			},
			"flexibility/RenameGroupElement": {
				sinon: false,
				coverage: {
					only: "sap/ui/comp/smartform/flexibility/changes"
				},
				loader: {
					map: {
						"*": {
							"sap/ui/thirdparty/sinon": "sap/ui/thirdparty/sinon-4" // Force MockServer to work with sinon-4
						}
					}
				}
			},
			"flexibility/RevealAndRemoveGroupElement": {
				sinon: false,
				coverage: {
					only: "sap/ui/comp/smartform/flexibility/changes"
				}
			},
			"opa/SemanticGroupElement.opa": {
				group: "SmartForm",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartform/opa"
				}
			}
		}
	};

	return oUnitTest;
});
