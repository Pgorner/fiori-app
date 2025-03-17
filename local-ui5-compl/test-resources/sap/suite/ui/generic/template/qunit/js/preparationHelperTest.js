/**
 * tests for the sap.suite.ui.generic.template.js.preparationHelper
 */

sap.ui.define(["testUtils/sinonEnhanced", "sap/suite/ui/generic/template/js/preparationHelper"], function(sinon, preparationHelper){
	"use strict";

	var sandbox;
	
	QUnit.module("preparationHelper - determine mode",  {
		beforeEach: function() {
			sandbox = sinon.sandbox.create();
		},
		afterEach: function() {
			sandbox.restore();
		}
	}, function(){
		var oMetaModel = {
				getODataEntitySet: function(){return {};},
				getODataEntityType: function(){return {};}
			};

		function fnConfigurableTest(oTestConfiguration){
			QUnit.test("Configurable: " + oTestConfiguration.sTitle, function(assert){
				sandbox.stub(oMetaModel, "getODataEntitySet", function(){
					return {
						"Org.OData.Capabilities.V1.DeleteRestrictions": oTestConfiguration.oDeleteRestrictions
					};
				});
				
				var oResultSettings = preparationHelper.getNormalizedTableSettings(oMetaModel, oTestConfiguration.oOriginalSettings || {}, {system: {}}, "EntitySet", oTestConfiguration.oExtensionActions, oTestConfiguration.aLineItemAnnotation);
				
				assert.equal(oResultSettings.mode, oTestConfiguration.oExpectedResult.sMode, "mode " + oTestConfiguration.oExpectedResult.sMode + " is returned for " + oTestConfiguration.oExpectedResult.sModeText);
				assert.equal(oResultSettings.onlyForDelete, oTestConfiguration.oExpectedResult.bOnlyForDelete, "flag only for delete is returned " + oTestConfiguration.oExpectedResult.bOnlyForDelete.toString() + oTestConfiguration.oExpectedResult.sOnlyForDeleteText);
				
			})
			
		}

		fnConfigurableTest({
			sTitle: "singleselect (default) without actions (only for delete) in responsive table",
			oExpectedResult: {
				sMode: "SingleSelectLeft",
				sModeText: " responsive table without actions (only for delete)",
				bOnlyForDelete: true,
				sOnlyForDeleteText: " without actions"
			}
		});
		
		fnConfigurableTest({
			sTitle: "singleselect (multiselect: false set in manifest) without actions (only for delete) in responsive table",
			oOriginalSettings: {multiSelect: false},
			oExpectedResult: {
				sMode: "SingleSelectLeft",
				sModeText: " responsive table without actions (only for delete)",
				bOnlyForDelete: true,
				sOnlyForDeleteText: " without actions"
			}
		})
		
		fnConfigurableTest({
			sTitle: "multiselect (set in manifest) without actions (only for delete) in responsive table",
			oOriginalSettings: {multiSelect: true},
			oExpectedResult: {
				sMode: "MultiSelect",
				sModeText: " responsive table without actions (only for delete)",
				bOnlyForDelete: true,
				sOnlyForDeleteText: " without actions"
			}
		})
		
		fnConfigurableTest({
			sTitle: "singleselect (default) with annotated action in responsive table",
			aLineItemAnnotation: [{
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction"
			}],
			oExpectedResult: {
				sMode: "SingleSelectLeft",
				sModeText: " responsive table with annotated action",
				bOnlyForDelete: false,
				sOnlyForDeleteText: " with annotated action"
			}
		})
		
		fnConfigurableTest({
			sTitle: "singleselect (default) with annotated inline action in responsive table",
			aLineItemAnnotation: [{
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				Inline: {Bool: true}
			}],
			oExpectedResult: {
				sMode: "SingleSelectLeft",
				sModeText: " responsive table with annotated action",
				bOnlyForDelete: true,
				sOnlyForDeleteText: " if annotated action is inline"
			}
		})
		
		fnConfigurableTest({
			sTitle: "singleselect (default) with annotated navigation action in responsive table",
			aLineItemAnnotation: [{
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"
			}],
			oExpectedResult: {
				sMode: "SingleSelectLeft",
				sModeText: " responsive table with annotated navigation action",
				bOnlyForDelete: true,
				sOnlyForDeleteText: " with annotated navigation action"
			}
		})
		
		fnConfigurableTest({
			sTitle: "singleselect (default) with annotated inline navigation action in responsive table",
			aLineItemAnnotation: [{
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
				Inline: {Bool: true}
			}],
			oExpectedResult: {
				sMode: "SingleSelectLeft",
				sModeText: " responsive table with annotated inline navigation action",
				bOnlyForDelete: true,
				sOnlyForDeleteText: " if annotated navigation action is inline"
			}
		})
		
		fnConfigurableTest({
			sTitle: "singleselect (default) with annotated navigation action in responsive table",
			aLineItemAnnotation: [{
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
				RequiresContext: {Bool: "true" }
			}],
			oExpectedResult: {
				sMode: "SingleSelectLeft",
				sModeText: " responsive table with annotated navigation action",
				bOnlyForDelete: false,
				sOnlyForDeleteText: " if annotated navigation action requires context"
			}
		})
		
		fnConfigurableTest({
			sTitle: "singleselect (default) with extension action in responsive table",
			oExtensionActions: {ActionName: {}},
			oExpectedResult: {
				sMode: "SingleSelectLeft",
				sModeText: " responsive table with extension action",
				bOnlyForDelete: false,
				sOnlyForDeleteText: " with extension action"
			}
		})
		
		fnConfigurableTest({
			sTitle: "singleselect (default) with extension action in responsive table",
			oExtensionActions: {
				ActionName: {requiresSelection: false}
			},
			oExpectedResult: {
				sMode: "SingleSelectLeft",
				sModeText: " responsive table with extension action",
				bOnlyForDelete: true,
				sOnlyForDeleteText: " if extension action does not require context"
			}
		})
		
		fnConfigurableTest({
			sTitle: "no selection in responsive table with entitySet with deletable = false",
			oDeleteRestrictions: {
				Deletable: {Bool: "false"}
			},
			oExpectedResult: {
				sMode: "None",
				sModeText: " responsive table for non-deletable entitySet",
				bOnlyForDelete: false,
				sOnlyForDeleteText: " for non-deletable entitySet"
			}
		});
		
		fnConfigurableTest({
			sTitle: "singleselect (default) in responsive table with entitySet with deletable = true",
			oDeleteRestrictions: {
				Deletable: {Bool: "true"}
			},
			oExpectedResult: {
				sMode: "SingleSelectLeft",
				sModeText: " responsive table for deletable entitySet",
				bOnlyForDelete: true,
				sOnlyForDeleteText: " for deletable entitySet"
			}
		});
		
		fnConfigurableTest({
			sTitle: "singleselect (default) in responsive table with entitySet with deletable path",
			oDeleteRestrictions: {
				Deletable: {Path: "someProperty"}
			},
			oExpectedResult: {
				sMode: "SingleSelectLeft",
				sModeText: " responsive table for entitySet with deletable path",
				bOnlyForDelete: true,
				sOnlyForDeleteText: " for entitySet with deletable path"
			}
		});
		
		fnConfigurableTest({
			sTitle: "singleselect (default) without actions (only for delete) in grid table",
			oOriginalSettings: {
				tableSettings: {type: "GridTable"}
			},
			oExpectedResult: {
				sMode: "Single",
				sModeText: " grid table without actions (only for delete)",
				bOnlyForDelete: true,
				sOnlyForDeleteText: " without actions"
			}
		});
		
		fnConfigurableTest({
			sTitle: "multiselect (set in manifest) without actions (only for delete) in grid table",
			oOriginalSettings: {
				tableSettings: {type: "GridTable"},
				multiSelect: true
			},
			oExpectedResult: {
				sMode: "MultiToggle",
				sModeText: " grid table without actions (only for delete)",
				bOnlyForDelete: true,
				sOnlyForDeleteText: " without actions"
			}
		})
		
		fnConfigurableTest({
			sTitle: "no selection in grid table with entitySet with deletable = false",
			oOriginalSettings: {
				tableSettings: {type: "GridTable"}
			},
			oDeleteRestrictions: {
				Deletable: {Bool: "false"}
			},
			oExpectedResult: {
				sMode: "None",
				sModeText: " grid table for non-deletable entitySet",
				bOnlyForDelete: false,
				sOnlyForDeleteText: " for non-deletable entitySet"
			}
		});
		
		fnConfigurableTest({
			sTitle: "singleselect (default) without actions (only for delete) in analytical table",
			oOriginalSettings: {
				tableSettings: {type: "AnalyticalTable"}
			},
			oExpectedResult: {
				sMode: "Single",
				sModeText: " analytical table without actions (only for delete)",
				bOnlyForDelete: true,
				sOnlyForDeleteText: " without actions"
			}
		});
		
		fnConfigurableTest({
			sTitle: "singleselect (default) without actions (only for delete) in tree table",
			oOriginalSettings: {
				tableSettings: {type: "TreeTable"}
			},
			oExpectedResult: {
				sMode: "Single",
				sModeText: " tree table without actions (only for delete)",
				bOnlyForDelete: true,
				sOnlyForDeleteText: " without actions"
			}
		});
		
		fnConfigurableTest({
			sTitle: "inline delete in responsive table",
			oOriginalSettings: {
				tableSettings: {inlineDelete: true}
			},
			oExpectedResult: {
				sMode: "Delete",
				sModeText: " responsive table",
				bOnlyForDelete: true,
				sOnlyForDeleteText: " for inline delete"
			}
		});
		
	});

	QUnit.module("Test getTargetEntityForQuickView function", {
		beforeEach: function() {
			this.sandbox = sinon.sandbox.create();
			this.oEntitySet = { entityType: "entityType"};
			this.oModel = {
				getODataEntityType: function(){ return {};}
			};
		},
		afterEach: function() {
			this.sandbox.restore();
			this.oEntitySet = null;
			this.oModel = null;
		}
	});
	QUnit.test("No Navigation property", function (assert) {
		//Arrange
		this.sandbox.stub(this.oModel, "getODataEntityType", function(entityType){
			return {};
		});
		var oExpectedResult = {
			mTargetEntities: {},
			sForceLinkRendering: JSON.stringify({}) 
		};
		//Act
		var oResult = preparationHelper.getTargetEntityForQuickView(this.oModel, this.oEntitySet);
		//Assert
		assert.deepEqual(oResult, oExpectedResult, "Fetches no targetEntities");
		//clean
				
	});
	QUnit.test("No property annotated as semanticObject", function (assert) {
		//Arrange
		this.sandbox.stub(this.oModel, "getODataEntityType", function(entityType){
			return {
				navigationProperty: [],
				property: [{
					Currency: {}
				}]
			};
		});
		var oExpectedResult = {
			mTargetEntities: {},
			sForceLinkRendering: JSON.stringify({}) 
		};
		//Act
		var oResult = preparationHelper.getTargetEntityForQuickView(this.oModel, this.oEntitySet);
		//Assert
		assert.deepEqual(oResult, oExpectedResult, "Fetches no targetEntities");
		//clean
				
	});
	QUnit.test("Property Listed in Target quickview entity but no dependent", function (assert) {
		//Arrange
		this.sandbox.stub(this.oModel, "getODataEntityType", function(entityType){
			var entityTypeObj;
			switch(entityType) {
				case "qvEntityType" :
					entityTypeObj = {
						"com.sap.vocabularies.UI.v1.QuickViewFacets" : {},
						namespace: 'ns',
						name: "qvEntityType",
						property: [{
							"com.sap.vocabularies.Common.v1.SemanticObject" : {},
							name: "Currency"
						}]
					};
					break;
				default:
					entityTypeObj = {
						navigationProperty: [
							{
								relationship: "ns.navname"
							}
						],
						property: [{
							"com.sap.vocabularies.Common.v1.SemanticObject" : {},
							name: "Currency"
						}]
					};
				break;
			}
			return entityTypeObj;
		});
		this.sandbox.stub(this.oModel, "getObject", function(path){
			return [{
						namespace: 'ns',
						association: [
							{
								name: "navname"
							}
						]
				}];
		});
		this.sandbox.stub(this.oModel, "getODataEntityContainer", function(path){
			return {
				entitySet: [
							{
								entityType: "qvEntityType"
							}
						]
				};
		});
		var oExpectedResult = {
			mTargetEntities: {},
			sForceLinkRendering: JSON.stringify({}) 
		};
		//Act
		var oResult = preparationHelper.getTargetEntityForQuickView(this.oModel, this.oEntitySet);
		//Assert
		assert.deepEqual(oResult, oExpectedResult, "Fetches no targetEntities");
		//clean
	});
	QUnit.test("Property Listed in Target quickview entity and has dependent", function (assert) {
				//Arrange
				this.sandbox.stub(this.oModel, "getODataEntityType", function(entityType){
					var entityTypeObj;
					switch(entityType) {
						case "qvEntityType" :
							entityTypeObj = {
								"com.sap.vocabularies.UI.v1.QuickViewFacets" : {},
								namespace: 'ns',
								name: "qvEntityType",
								property: [{
									"com.sap.vocabularies.Common.v1.SemanticObject" : {},
									name: "Currency"
								}]
							};
							break;
						default:
							entityTypeObj = {
								navigationProperty: [
									{
										relationship: "ns.navname",
										name: "navname"
									}
								],
								property: [{
									"com.sap.vocabularies.Common.v1.SemanticObject" : {},
									name: "Currency"
								}]
							};
						break;
					}
					return entityTypeObj;
				});
				this.sandbox.stub(this.oModel, "getObject", function(path){
					return [{
								namespace: 'ns',
								association: [
									{
										name: "navname",
										referentialConstraint: {
											dependent: {
												propertyRef: [
													{name: 'Currency'}
												]
											}
										}
									}
								]
						}];
				});
				this.sandbox.stub(this.oModel, "getODataEntityContainer", function(path){
					return {
						entitySet: [
									{
										entityType: "qvEntityType"
									}
								]
						};
				});
				this.sandbox.stub(this.oModel, "getODataAssociationEnd", function(){
					return {
						type: 'qvEntityType'
					}
				});
				var oExpectedResult = {
					mTargetEntities: {
						Currency: {
							entityType: "ns.qvEntityType",
							navName: "navname"
						}
					},
					sForceLinkRendering: JSON.stringify({Currency: true}) 
				};
				//Act
				var oResult = preparationHelper.getTargetEntityForQuickView(this.oModel, this.oEntitySet);
				//Assert
				assert.deepEqual(oResult, oExpectedResult, "Fetches right targetEntities");
				//clean
	});
	QUnit.test("Property not Listed in Target quickview entity  and has dependent", function (assert) {
		//Arrange
		this.sandbox.stub(this.oModel, "getODataEntityType", function(entityType){
			var entityTypeObj;
			switch(entityType) {
				case "qvEntityType" :
					entityTypeObj = {
						"com.sap.vocabularies.UI.v1.QuickViewFacets" : {},
						namespace: 'ns',
						name: "qvEntityType",
						property: [{
							"com.sap.vocabularies.Common.v1.SemanticObject" : {},
							name: "Currency"
						}]
					};
					break;
				default:
					entityTypeObj = {
						navigationProperty: [
							{
								relationship: "ns.navname",
								name: "navname"
							}
						],
						property: [{
							"com.sap.vocabularies.Common.v1.SemanticObject" : {},
							name: "Currency"
						}]
					};
				break;
			}
			return entityTypeObj;
		});
		this.sandbox.stub(this.oModel, "getObject", function(path){
			return [{
						namespace: 'ns',
						association: [
							{
								name: "navname",
								referentialConstraint: {
									dependent: {
										propertyRef: [
											{name: 'Currency'}
										]
									}
								}
							}
						]
				}];
		});
		this.sandbox.stub(this.oModel, "getODataEntityContainer", function(path){
			return {
				entitySet: [
							{
								entityType: "qvEntityType1"
							}
						]
				};
		});
		this.sandbox.stub(this.oModel, "getODataAssociationEnd", function(){
			return {
				type: 'qvEntityType'
			}
		});
		var oExpectedResult = {
			mTargetEntities: {
				Currency: {
					entityType: "ns.qvEntityType",
					navName: "navname"
				}
			},
			sForceLinkRendering: JSON.stringify({Currency: true}) 
		};
		//Act
		var oResult = preparationHelper.getTargetEntityForQuickView(this.oModel, this.oEntitySet);
		//Assert
		assert.deepEqual(oResult, oExpectedResult, "Fetches right targetEntities");
		//clean
			
	});
	QUnit.test("Property not Listed in Target quickview entity and has dependent with both single and multiple dependent propertyref", function (assert) {
				//Arrange
				this.sandbox.stub(this.oModel, "getODataEntityType", function(entityType){
					var entityTypeObj;
					switch(entityType) {
						case "qvEntityType" :
							entityTypeObj = {
								"com.sap.vocabularies.UI.v1.QuickViewFacets" : {},
								namespace: 'ns',
								name: "qvEntityType",
								property: [{
									"com.sap.vocabularies.Common.v1.SemanticObject" : {},
									name: "Currency"
								}]
							};
							break;
						case "qvEntityType1" :
							entityTypeObj = {
								"com.sap.vocabularies.UI.v1.QuickViewFacets" : {},
								namespace: 'ns',
								name: "qvEntityType1"
							};
							break;
						default:
							entityTypeObj = {
								navigationProperty: [
									{
										relationship: "ns.navname",
										name: "navname"
									},
									{
										relationship: "ns.navname1",
										name: "navname1"
									}
								],
								property: [{
									"com.sap.vocabularies.Common.v1.SemanticObject" : {},
									name: "Currency"
								}]
							};
						break;
					}
					return entityTypeObj;
				});
				this.sandbox.stub(this.oModel, "getObject", function(path){
					return [{
								namespace: 'ns',
								association: [
									{
										name: "navname",
										referentialConstraint: {
											dependent: {
												propertyRef: [
													{name: 'Currency'},
													{name: 'Product'}
												]
											}
										}
									},
									{
										name: "navname1",
										referentialConstraint: {
											dependent: {
												propertyRef: [
													{name: 'Currency'}
												]
											}
										}
									}
								]
						}];
				});
				this.sandbox.stub(this.oModel, "getODataEntityContainer", function(path){
					return {
						entitySet: [
									{
										entityType: "qvEntityType1"
									}
								]
						};
				});
				this.sandbox.stub(this.oModel, "getODataAssociationEnd", function(oEntity, navName){
					switch(navName){
						case "navname1":
							return {type: "qvEntityType1"};
						case "navname":
							return {type: "qvEntityType"};
					}
				});
				var oExpectedResult = {
					mTargetEntities: {
						Currency: {
							entityType: "ns.qvEntityType1",
							navName: "navname1"
						}
					},
					sForceLinkRendering: JSON.stringify({Currency: true}) 
				};
				//Act
				var oResult = preparationHelper.getTargetEntityForQuickView(this.oModel, this.oEntitySet);
				//Assert
				assert.deepEqual(oResult, oExpectedResult, "Fetches right targetEntities");
				//clean
	});

	QUnit.module("preparationHelper - determine copy",  {
		beforeEach: function() {
			sandbox = sinon.sandbox.create();
		},
		afterEach: function() {
			sandbox.restore();
		}
	}, function(){
		var oMetaModel = {
				getODataEntitySet: function(){return {};},
				getODataEntityType: function(){return {};}
			};
		function fnCopyTest(oTestConfiguration){
			QUnit.test("Configurable: " + oTestConfiguration.sTitle, function(assert){
				sandbox.stub(oMetaModel, "getODataEntitySet", function(){
					return {
						"Org.OData.Capabilities.V1.DeleteRestrictions": oTestConfiguration.oDeleteRestrictions
					};
				});
				var oResultSettings = preparationHelper.getNormalizedTableSettings(oMetaModel, oTestConfiguration.oOriginalSettings || {}, {system: {}}, "EntitySet", oTestConfiguration.oExtensionActions, oTestConfiguration.aLineItemAnnotation);
				
				assert.equal(oResultSettings.mode, oTestConfiguration.oExpectedResult.sMode, "mode " + oTestConfiguration.oExpectedResult.sMode + " is returned for " + oTestConfiguration.oExpectedResult.sModeText);
				assert.equal(oResultSettings.copy, oTestConfiguration.oExpectedResult.copy, "flag is returned " + oTestConfiguration.oExpectedResult.copy.toString() + oTestConfiguration.oExpectedResult.sCopyText);
			});
		}

		fnCopyTest({
			sTitle: "Copy flag not defined in the manifest",
			oDeleteRestrictions: {
				Deletable: {Bool: "false"}
			},
			oExpectedResult: {
				sMode: "None",
				sModeText: " responsive table",
				sCopyText: " for undefined copy flag",
				copy: true
			}
		});

		fnCopyTest({
			sTitle: "Copy flag set to true in the manifest",
			oOriginalSettings: {
				tableSettings: {copy: true}
			},
			oDeleteRestrictions: {
				Deletable: {Bool: "false"}
			},
			oExpectedResult: {
				sMode: "None",
				sModeText: " responsive table",
				sCopyText: " when copy button is enabled",
				copy: true
			}
		});

		fnCopyTest({
			sTitle: "Copy flag set to false in the manifest",
			oOriginalSettings: {
				tableSettings: {copy: false}
			},
			oDeleteRestrictions: {
				Deletable: {Bool: "false"}
			},
			oExpectedResult: {
				sMode: "None",
				sModeText: " responsive table",
				sCopyText: " when copy button is disabled",
				copy: false
			}
		});
	});

});
