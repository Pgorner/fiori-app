/**
 * tests for the sap.suite.ui.generic.template.genericUtilities.metadataAnalyser
 */

sap.ui.define(["testUtils/sinonEnhanced", "sap/suite/ui/generic/template/genericUtilities/metadataAnalyser"
], function(sinon, metadataAnalyser) {
	"use strict";

	//Main EntitySet
	var oMainEntitySet = {
		entityType: "oMainEntityType",
		type:"oMainEntityType",
		entitySet:"Main Entity Set",
	};
	var oMainEntityType = {
		property: [{
			name: "property1"
		},{
			name: "property2"
		}, {
			name: "property3"
		}],
		navigationProperty:[{
			name: "NavigationEntity1"
		},{
			name: "ParametricEntity1"
		},{
			name: "NavigationEntity2" // Assume the entity is defined as value-help in the backend
		}],
		"com.sap.vocabularies.Common.v1.SideEffects#1": {
			SourceProperties: [{
				PropertyPath: "property2"
			}]
		},
		"com.sap.vocabularies.Common.v1.SideEffects#2": {
			SourceProperties: [{
				PropertyPath: "property1"
			}, {
				PropertyPath: "property3"
			}]
		},
		"com.sap.vocabularies.Common.v1.SideEffects#3": {
			SourceProperties: [{
				PropertyPath: "property3"
			}]
		}
	};

	// Entity Set Containing Parameter
	var oParametricEntitySet = {
		entityType: "oParametricEntityType",
		type: "oParametricEntityType",
		entitySet:"Entity With Parameters"
	};

	var oParametricEntityType = {
			key:{
				propertyRef : [{
						name:"param1"
					}, {
					name: "param2"}]
			},
			navigationProperty:[{
				name: "MainEntitySet"
			}],
			"sap:semantics": "parameters"
	};

	// Navigation Entity Set.
	var oNavigationEntitySet1 = {
		entityType: "RandomEntityType1",
		type: "RandomEntityType1",
		entitySet:"ParametricEntity1"
	};
	var oNavigationEntitySet2 = {
		entityType: "RandomEntityType2",
		type: "RandomEntityType2",
		entitySet:"ParametricEntity1"
	};

	var oNavigationEntity1Type = {
			property:["Nproperty1","Nproperty2","Nproperty3","Nproperty4"],
			navigationProperty:[{
				name: "RandomEntitySet1"
			}]
	};
	// Commenting out the Entity type defention of the navigation property to simulate sap-value-list=none
	/*var oNavigationEntity2Type = {
		property:["Nproperty1","Nproperty2","Nproperty3","Nproperty4"],
		navigationProperty:[{
			name: "RandomEntitySet2"
		}]
	}*/

	var oMetaModel = {
			getODataEntitySet: function(sEntitySet) {
				switch(sEntitySet) {
					case "MainEntitySet":
						return oMainEntitySet;
					case "ParametricEntity1":
						return oParametricEntitySet
					case "NavigationEntity1":
						return oNavigationEntitySet1
					case "NavigationEntity2":
						return oNavigationEntitySet2
				}
			},
			getODataEntityType: function(sEntityType) {
				switch(sEntityType) {
					case "oMainEntityType":
						return oMainEntityType;
					case "oParametricEntityType":
						return oParametricEntityType;
					case "RandomEntityType1":
						return oNavigationEntity1Type;
					//case "RandomEntityType2":
					//	return oNavigationEntity2Type;
				}
			},
			getODataAssociationEnd: function(oEntityType, sNavigationName) {
				return this.getODataEntitySet(sNavigationName);
			},
			getODataAssociationSetEnd: function(oEntityType, sNavigationName) {
				return this.getODataEntitySet(sNavigationName);
			}
	};

	var oController = {
		getOwnerComponent: function() {
			return {
				getAppComponent: function(){
					return {
						getModel: function() {
							return {
								getMetaModel: function() {
									return oMetaModel;
								}
							}
						}
					}
				}
			}
		}
	};
	var oSandbox;


	function fnGeneralSetup(){
		oSandbox = sinon.sandbox.create();
	}

	function fnGeneralTeardown(){
		oSandbox.restore();
	}

	QUnit.module("Test for retrieving parameter by EntitySet name", {
		beforeEach: fnGeneralSetup,
		afterEach: fnGeneralTeardown
	});

	QUnit.test("Test if parameter is returned is correct", function(assert){
		var oComponent = oController.getOwnerComponent();
		var oAppComponent = oComponent.getAppComponent();
		var oResult = metadataAnalyser.getParametersByEntitySet(oAppComponent.getModel(), "MainEntitySet")
		assert.strictEqual(oResult.entitySetName, "Entity With Parameters","Entity Set name is correct");
		assert.strictEqual(oResult.navPropertyName, "MainEntitySet","Navigation Property contains parameters");
		assert.strictEqual(oResult.parameters.length, 2, "Parameters retrieved correctly");
	});

	QUnit.module("Test to get property from EntitySet name", {
		beforeEach: fnGeneralSetup,
		afterEach: fnGeneralTeardown
	});

	QUnit.test("Test if property retrieved from EntitySet is correct", function(assert){
		var oComponent = oController.getOwnerComponent();
		var oAppComponent = oComponent.getAppComponent();
		var aProperty  = metadataAnalyser.getPropertyOfEntitySet(oAppComponent.getModel(), "NavigationEntity1");
		assert.strictEqual(aProperty.length, 4, "All properties retreived.")
	});

	QUnit.module("Test to check whether the given input field side effect source properties type if", {
		beforeEach: fnGeneralSetup,
		afterEach: fnGeneralTeardown
	});

	QUnit.test("the control has only single source property side effect annotation", function(assert) {
		var sFieldSideEffectState = metadataAnalyser.getFieldSourcePropertiesType("property2", oMetaModel, oMainEntitySet.entityType);

		assert.strictEqual(sFieldSideEffectState, "OnlySingleSource", "correct state retrieved");
	});

	QUnit.test("the control does have multiple source property side effect annotation", function(assert) {
		var sFieldSideEffectState = metadataAnalyser.getFieldSourcePropertiesType("property3", oMetaModel, oMainEntitySet.entityType);

		assert.strictEqual(sFieldSideEffectState, "SingleAndMultipleSource", "correct state retrieved");
	});
});