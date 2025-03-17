/**
 * tests for the sap.suite.ui.generic.template.ListReport.Component.js
 */
sap.ui.define(["testUtils/sinonEnhanced",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/generic/template/ListReport/Component",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper"
], function (Sinon, JSONModel, Component, testableHelper) {
		"use strict";

		QUnit.dump.maxDepth = 20;
		
		var oComponentUtils = {
			getControllerExtensions: Function.prototype,
			isDraftEnabled: function () {
				return false;
			},
			getToolbarDataFieldForActionCommandDetails: Function.prototype,
			getToolbarDataFieldForIBNCommandDetails: Function.prototype
		};
		var oAppComponent = {
			getFlexibleColumnLayout: function () { return false; }
		};
		var oComponent = {
			getAppComponent: function () { return oAppComponent; }
		};
		var oSandbox;

		var oDefaultFilterSettings = {
			navigationProperties: "", 
			useProvidedNavigationProperties: true
		};

		QUnit.module("getTemplateSpecificParameters Test Module", {
			beforeEach: function () {
				testableHelper.startTest();
				this.oStubForPrivate = testableHelper.getStaticStub();
				this.oMetaModel = {
					getODataEntitySet: function (entitySet) {
						return {
							entityType: "entityType"
						};
					},
					getODataEntityType: function (entityType) {
						return {
							property: [],
							"com.sap.vocabularies.UI.v1.SelectionFields": []
						};
					},
					getObject: Function.prototype
				};
				this.Device = {
					system: {
						phone: false
					}
				};
				this.sEntitySet = 'sLeadingEntitySet';
				oSandbox = Sinon.sandbox.create();
				var oTemplatePrivateModel = new JSONModel();
				oSandbox.stub(oComponent, "getModel", function(sName){
					return sName === "_templPriv" || sName === "_templPrivGlobal" ? oTemplatePrivateModel : null;
				});
			},
			afterEach: function () {
				oSandbox.restore();
				testableHelper.endTest();
			}
		});

		QUnit.test("getTemplateSpecificParameters without quickVariantSelectionX", function (assert) {
			//Arrange
			var mWidthIncludingColumnHeader = {"*": {"truncateLabel": false}};
			var oSettings = {
				tableSettings: {
					multiEdit: {
						enabled: true
					},
					widthIncludingColumnHeader: true
				}
			};
			var oExpected = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isResponsiveTable: true,
				isIndicatorRequired: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				tableSettings: {
					commandExecution: {
						Create: {
							action: "Create",
							callbackName: "._templateEventHandlers.addEntry",
							enabled: true,
							id: "addEntry",
							isStandardAction: true,
							press: "cmd:Create",
							text: "{i18n>CREATE_OBJECT}"
						},
						CreateWithFilters: {
							action: "CreateWithFilters",
							callbackName: "._templateEventHandlers.addEntryWithFilters",
							enabled: "{_templPriv>/generic/bDataAreShownInTable}",
							id: "template::addEntryWithFilter",
							isStandardAction: true,
							press: "cmd:CreateWithFilters",
							text: "{i18n>ST_CREATE_WITH_FILTERS}"
						},
						Delete: {
							action: "Delete",
							callbackName: "._templateEventHandlers.deleteEntries",
							enabled: "{_templPriv>/listReport/deleteEnabled}",
							id: "deleteEntry",
							isStandardAction: true,
							press: "cmd:Delete",
							text: "{i18n>DELETE}"
						}
					},
					copy: true,
					extensionActions: [],
					multiEdit: {
						enabled: true,
						fields: undefined
					},
					inlineDelete: false,
					multiSelect: false,
					mode: "SingleSelectLeft",
					onlyForDelete: true,
					selectAll: true,
					selectionLimit: 200,
					type: "ResponsiveTable",
					calculateWidthIncludingColumnHeader: mWidthIncludingColumnHeader,
					widthIncludingColumnHeader: true
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				filterSettings: oDefaultFilterSettings
			};

			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
			//Assert
			assert.deepEqual(oResult, oExpected, "fetches correct templateSpecificParameters");
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters without quickVariantSelectionX", function (assert) {
			//Arrange
			var mWidthIncludingColumnHeader = {"*": {"truncateLabel": false}};
			var oSettings = {
				tableSettings: {
					type: "GridTable",
					multiSelect: true,
					widthIncludingColumnHeader: true
				}
			};
			var oExpected = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isResponsiveTable: false,
				isIndicatorRequired: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				tableSettings: {
					commandExecution: {
						Create: {
							action: "Create",
							callbackName: "._templateEventHandlers.addEntry",
							enabled: true,
							id: "addEntry",
							isStandardAction: true,
							press: "cmd:Create",
							text: "{i18n>CREATE_OBJECT}"
						},
						CreateWithFilters: {
							action: "CreateWithFilters",
							callbackName: "._templateEventHandlers.addEntryWithFilters",
							enabled: "{_templPriv>/generic/bDataAreShownInTable}",
							id: "template::addEntryWithFilter",
							isStandardAction: true,
							press: "cmd:CreateWithFilters",
							text: "{i18n>ST_CREATE_WITH_FILTERS}"
						},
						Delete: {
							action: "Delete",
							callbackName: "._templateEventHandlers.deleteEntries",
							enabled: "{_templPriv>/listReport/deleteEnabled}",
							id: "deleteEntry",
							isStandardAction: true,
							press: "cmd:Delete",
							text: "{i18n>DELETE}"
						}
					},
					copy: true,
					extensionActions: [],
					inlineDelete: false,
					multiSelect: true,
					mode: "MultiToggle",
					onlyForDelete: true,
					selectAll: false, // default selectAll is true only for ResponsiveTable
					selectionLimit: 200,
					type: "GridTable",
					calculateWidthIncludingColumnHeader: mWidthIncludingColumnHeader,
					widthIncludingColumnHeader: true
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				filterSettings: oDefaultFilterSettings
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
			//Assert
			assert.deepEqual(oResult, oExpected, "fetches correct templateSpecificParameters");
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters without quickVariantSelectionX", function (assert) {
			//Arrange
			var mWidthIncludingColumnHeader = {"*": {"truncateLabel": false}};
			var oSettings = {
				tableSettings: {
					// table 'Delete' mode
					inlineDelete: true,
					widthIncludingColumnHeader: true
				}
			};
			var oExpected = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isResponsiveTable: true,
				isIndicatorRequired: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				tableSettings: {
					commandExecution: {
						Create: {
							action: "Create",
							callbackName: "._templateEventHandlers.addEntry",
							enabled: true,
							id: "addEntry",
							isStandardAction: true,
							press: "cmd:Create",
							text: "{i18n>CREATE_OBJECT}"
						},
						CreateWithFilters: {
							action: "CreateWithFilters",
							callbackName: "._templateEventHandlers.addEntryWithFilters",
							enabled: "{_templPriv>/generic/bDataAreShownInTable}",
							id: "template::addEntryWithFilter",
							isStandardAction: true,
							press: "cmd:CreateWithFilters",
							text: "{i18n>ST_CREATE_WITH_FILTERS}"
						},
						Delete: {
							action: "Delete",
							callbackName: "._templateEventHandlers.deleteEntries",
							enabled: "{_templPriv>/listReport/deleteEnabled}",
							id: "deleteEntry",
							isStandardAction: true,
							press: "cmd:Delete",
							text: "{i18n>DELETE}"
						}
					},
					copy: true,
					extensionActions: [],
					inlineDelete: true,
					multiSelect: false,
					mode: "Delete",
					onlyForDelete: true,
					selectAll: true,
					selectionLimit: 200,
					type: "ResponsiveTable",
					calculateWidthIncludingColumnHeader: mWidthIncludingColumnHeader,
					widthIncludingColumnHeader: true
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				filterSettings: oDefaultFilterSettings
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
			//Assert
			assert.deepEqual(oResult, oExpected, "fetches correct templateSpecificParameters");
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters without quickVariantSelectionX and updateRestrictions", function (assert) {
			var mWidthIncludingColumnHeader = {"*": {"truncateLabel": false}};
			oSandbox.stub(this.oMetaModel, "getODataEntitySet", function () {
				return {
					"Org.OData.Capabilities.V1.UpdateRestrictions": {
						Updatable: { Bool: "false" }
					},
					entityType: "entityType"
				};
			});
			//Arrange
			var oSettings = {
				tableSettings: {
					multiEdit: {
						enabled: true
					},
					widthIncludingColumnHeader: true
				}
			};
			var oExpected = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isIndicatorRequired: true,
				isResponsiveTable: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				tableSettings: {
					commandExecution: {
						Create: {
							action: "Create",
							callbackName: "._templateEventHandlers.addEntry",
							enabled: true,
							id: "addEntry",
							isStandardAction: true,
							press: "cmd:Create",
							text: "{i18n>CREATE_OBJECT}"
						},
						CreateWithFilters: {
							action: "CreateWithFilters",
							callbackName: "._templateEventHandlers.addEntryWithFilters",
							enabled: "{_templPriv>/generic/bDataAreShownInTable}",
							id: "template::addEntryWithFilter",
							isStandardAction: true,
							press: "cmd:CreateWithFilters",
							text: "{i18n>ST_CREATE_WITH_FILTERS}"
						},
						Delete: {
							action: "Delete",
							callbackName: "._templateEventHandlers.deleteEntries",
							enabled: "{_templPriv>/listReport/deleteEnabled}",
							id: "deleteEntry",
							isStandardAction: true,
							press: "cmd:Delete",
							text: "{i18n>DELETE}"
						}
					},
					copy: true,
					extensionActions: [],
					multiEdit: {
						enabled: false
					},
					inlineDelete: false,
					multiSelect: false,
					mode: "SingleSelectLeft",
					onlyForDelete: true,
					selectAll: true,
					selectionLimit: 200,
					type: "ResponsiveTable",
					calculateWidthIncludingColumnHeader: mWidthIncludingColumnHeader,
					widthIncludingColumnHeader: true
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				filterSettings: oDefaultFilterSettings
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
			//Assert
			assert.deepEqual(oResult, oExpected, "fetches correct templateSpecificParameters");
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters with quickVariantSelectionX", function (assert) {
			//Arrange
			var mWidthIncludingColumnHeader = {"*": {"truncateLabel": false}};
			var oSettings = {
				tableSettings: {
					widthIncludingColumnHeader: true
				},
				quickVariantSelectionX: {
					variants: {
						1: {
							key: "1"
						}
					}
				}
			};
			var oExpectedSettings = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isResponsiveTable: true,
				isIndicatorRequired: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				quickVariantSelectionX: {
					variants: {
						1: {
							key: "1",
							isSmartChart: false,
							tableSettings: {
								commandExecution: {
									Create: {
										action: "Create",
										callbackName: "._templateEventHandlers.addEntry",
										enabled: true,
										id: "addEntry-1",
										isStandardAction: true,
										press: "cmd:Create",
										text: "{i18n>CREATE_OBJECT}"
									},
									CreateWithFilters: {
										action: "CreateWithFilters",
										callbackName: "._templateEventHandlers.addEntryWithFilters",
										enabled: "{_templPriv>/generic/bDataAreShownInTable}",
										id: "template:::ListReportAction:::CreateWithFilter:::sQuickVariantKey::1",
										isStandardAction: true,
										press: "cmd:CreateWithFilters",
										text: "{i18n>ST_CREATE_WITH_FILTERS}"
									},
									Delete: {
										action: "Delete",
										callbackName: "._templateEventHandlers.deleteEntries",
										enabled: "{_templPriv>/listReport/deleteEnabled}",
										id: "deleteEntry-1",
										isStandardAction: true,
										press: "cmd:Delete",
										text: "{i18n>DELETE}"
									}
								},
								copy: true,
								extensionActions: [],
								inlineDelete: false,
								multiSelect: false,
								mode: "SingleSelectLeft",
								onlyForDelete: true,
								selectAll: true,
								selectionLimit: 200,
								type: "ResponsiveTable",
								calculateWidthIncludingColumnHeader: mWidthIncludingColumnHeader,
								widthIncludingColumnHeader: true
							}
						}
					}
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				filterSettings: oDefaultFilterSettings
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
			//Assert
			assert.deepEqual(oResult, oExpectedSettings, "fetches correct templateSpecificParameters");
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters with quickVariantSelectionX2", function (assert) {
			//Arrange
			var mWidthIncludingColumnHeader = {"*": {"truncateLabel": false}};
			var oSettings = {
				tableSettings: {
					type: "GridTable",
					selectAll: true,
					widthIncludingColumnHeader: true
				},
				quickVariantSelectionX: {
					variants: {
						"1": {
							key: "1"
						}
					}
				}
			};
			var oExpectedSettings = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isResponsiveTable: false,
				isIndicatorRequired: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				quickVariantSelectionX: {
					variants: {
						1: {
							key: "1",
							isSmartChart: false,
							tableSettings: {
								commandExecution: {
									Create: {
										action: "Create",
										callbackName: "._templateEventHandlers.addEntry",
										enabled: true,
										id: "addEntry-1",
										isStandardAction: true,
										press: "cmd:Create",
										text: "{i18n>CREATE_OBJECT}"
									},
									CreateWithFilters: {
										action: "CreateWithFilters",
										callbackName: "._templateEventHandlers.addEntryWithFilters",
										enabled: "{_templPriv>/generic/bDataAreShownInTable}",
										id: "template:::ListReportAction:::CreateWithFilter:::sQuickVariantKey::1",
										isStandardAction: true,
										press: "cmd:CreateWithFilters",
										text: "{i18n>ST_CREATE_WITH_FILTERS}"
									},
									Delete: {
										action: "Delete",
										callbackName: "._templateEventHandlers.deleteEntries",
										enabled: "{_templPriv>/listReport/deleteEnabled}",
										id: "deleteEntry-1",
										isStandardAction: true,
										press: "cmd:Delete",
										text: "{i18n>DELETE}"
									}
								},
								copy: true,
								extensionActions: [],
								inlineDelete: false,
								multiSelect: false,
								mode: "Single",
								onlyForDelete: true,
								selectAll: true,
								selectionLimit: 200,
								type: "GridTable",
								calculateWidthIncludingColumnHeader: mWidthIncludingColumnHeader,
								widthIncludingColumnHeader: true
							}
						}
					}
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				filterSettings: oDefaultFilterSettings
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
			//Assert
			assert.deepEqual(oResult, oExpectedSettings, "fetches correct templateSpecificParameters");
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters with quickVariantSelectionX", function (assert) {
			//Arrange
			//var mWidthIncludingColumnHeader = {"*": {"truncateLabel": false}};
			var oSettings = {
				tableSettings: {
					type: "GridTable",
					selectAll: true
				},
				quickVariantSelectionX: {
					variants: {
						1: {
							key: "1",
							tableSettings: {
								type: "TreeTable",
								selectionLimit: 600
							}
						}
					}
				}
			};
			var oExpectedSettings = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isResponsiveTable: false,
				isIndicatorRequired: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				quickVariantSelectionX: {
					variants: {
						1: {
							key: "1",
							isSmartChart: false,
							tableSettings: {
								commandExecution: {
									Create: {
										action: "Create",
										callbackName: "._templateEventHandlers.addEntry",
										enabled: true,
										id: "addEntry-1",
										isStandardAction: true,
										press: "cmd:Create",
										text: "{i18n>CREATE_OBJECT}"
									},
									CreateWithFilters: {
										action: "CreateWithFilters",
										callbackName: "._templateEventHandlers.addEntryWithFilters",
										enabled: "{_templPriv>/generic/bDataAreShownInTable}",
										id: "template:::ListReportAction:::CreateWithFilter:::sQuickVariantKey::1",
										isStandardAction: true,
										press: "cmd:CreateWithFilters",
										text: "{i18n>ST_CREATE_WITH_FILTERS}"
									},
									Delete: {
										action: "Delete",
										callbackName: "._templateEventHandlers.deleteEntries",
										enabled: "{_templPriv>/listReport/deleteEnabled}",
										id: "deleteEntry-1",
										isStandardAction: true,
										press: "cmd:Delete",
										text: "{i18n>DELETE}"
									}
								},
								copy: true,
								extensionActions: [],
								inlineDelete: false,
								multiSelect: false,
								mode: "Single",
								onlyForDelete: true,
								selectAll: false,
								selectionLimit: 600,
								type: "TreeTable",
								calculateWidthIncludingColumnHeader: {}
							}
						}
					}
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				filterSettings: oDefaultFilterSettings
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
			//Assert
			assert.deepEqual(oResult, oExpectedSettings, "fetches correct templateSpecificParameters");
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters with quickVariantSelectionX1", function (assert) {
			//Arrange
			var oSettings = {
				tableSettings: {
					type: "GridTable",
					selectAll: true
				},
				quickVariantSelectionX: {
					variants: {
						1: {
							key: "1",
							tableSettings: {
								type: "AnalyticalTable",
								selectionLimit: 600
							}
						}
					}
				}
			};
			var oExpectedSettings = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isResponsiveTable: false,
				isIndicatorRequired: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				quickVariantSelectionX: {
					variants: {
						1: {
							key: "1",
							isSmartChart: false,
							tableSettings: {
								commandExecution: {
									Create: {
										action: "Create",
										callbackName: "._templateEventHandlers.addEntry",
										enabled: true,
										id: "addEntry-1",
										isStandardAction: true,
										press: "cmd:Create",
										text: "{i18n>CREATE_OBJECT}"
									},
									CreateWithFilters: {
										action: "CreateWithFilters",
										callbackName: "._templateEventHandlers.addEntryWithFilters",
										enabled: "{_templPriv>/generic/bDataAreShownInTable}",
										id: "template:::ListReportAction:::CreateWithFilter:::sQuickVariantKey::1",
										isStandardAction: true,
										press: "cmd:CreateWithFilters",
										text: "{i18n>ST_CREATE_WITH_FILTERS}"
									},
									Delete: {
										action: "Delete",
										callbackName: "._templateEventHandlers.deleteEntries",
										enabled: "{_templPriv>/listReport/deleteEnabled}",
										id: "deleteEntry-1",
										isStandardAction: true,
										press: "cmd:Delete",
										text: "{i18n>DELETE}"
									}
								},
								copy: true,
								extensionActions: [],
								inlineDelete: false,
								multiSelect: false,
								mode: "Single",
								onlyForDelete: true,
								selectAll: false,
								selectionLimit: 600,
								type: "GridTable",
								calculateWidthIncludingColumnHeader: {}
							}
						}
					}
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				filterSettings: oDefaultFilterSettings
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
			//Assert
			assert.deepEqual(oResult, oExpectedSettings, "fetches correct templateSpecificParameters");
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters with quickVariantSelectionX", function (assert) {
			//Arrange
			var oMetaModel = {
				getODataEntitySet: function () {
					return {
						entityType: "entityType"
					};
				},
				getODataEntityType: function () {
					return {
						property: [],
						"sap:semantics": "aggregate",
						"com.sap.vocabularies.UI.v1.SelectionFields": []
					};
				},
				getObject: Function.prototype
			};
			var oSettings = {
				tableSettings: {
					type: "GridTable",
					selectAll: true
				},
				quickVariantSelectionX: {
					variants: {
						"1": {
							key: "1",
							tableSettings: {
								type: "AnalyticalTable",
								selectionLimit: 600
							}
						}
					}
				}
			};
			var oExpectedSettings = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isResponsiveTable: false,
				isIndicatorRequired: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				quickVariantSelectionX: {
					variants: {
						1: {
							key: "1",
							isSmartChart: false,
							tableSettings: {
								commandExecution: {
									Create: {
										action: "Create",
										callbackName: "._templateEventHandlers.addEntry",
										enabled: true,
										id: "addEntry-1",
										isStandardAction: true,
										press: "cmd:Create",
										text: "{i18n>CREATE_OBJECT}"
									},
									CreateWithFilters: {
										action: "CreateWithFilters",
										callbackName: "._templateEventHandlers.addEntryWithFilters",
										enabled: "{_templPriv>/generic/bDataAreShownInTable}",
										id: "template:::ListReportAction:::CreateWithFilter:::sQuickVariantKey::1",
										isStandardAction: true,
										press: "cmd:CreateWithFilters",
										text: "{i18n>ST_CREATE_WITH_FILTERS}"
									},
									Delete: {
										action: "Delete",
										callbackName: "._templateEventHandlers.deleteEntries",
										enabled: "{_templPriv>/listReport/deleteEnabled}",
										id: "deleteEntry-1",
										isStandardAction: true,
										press: "cmd:Delete",
										text: "{i18n>DELETE}"
									}
								},
								copy: true,
								extensionActions: [],
								inlineDelete: false,
								multiSelect: false,
								mode: "Single",
								onlyForDelete: true,
								selectAll: false,
								selectionLimit: 600,
								type: "AnalyticalTable",
								calculateWidthIncludingColumnHeader: {}
							}
						}
					}
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				filterSettings: oDefaultFilterSettings
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(oMetaModel, oSettings, this.Device, this.sEntitySet);
			//Assert
			assert.deepEqual(oResult, oExpectedSettings, "fetches correct templateSpecificParameters");
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters with quickVariantSelectionX", function (assert) {
			//Arrange
			var oSettings = {
				tableSettings: {
					type: "GridTable",
					selectAll: true
				},
				quickVariantSelectionX: {
					variants: {
						1: {
							key: "1",
							tableSettings: {
								type: "GridTable",
								selectionLimit: 600
							}
						},
						2: {
							key: "2",
							tableSettings: {
								type: "TreeTable",
								selectionLimit: 600
							}
						}
					}
				}
			};
			var oExpectedSettings = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isResponsiveTable: false,
				isIndicatorRequired: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				quickVariantSelectionX: {
					variants: {
						1: {
							key: "1",
							isSmartChart: false,
							tableSettings: {
								commandExecution: {
									Create: {
										action: "Create",
										callbackName: "._templateEventHandlers.addEntry",
										enabled: true,
										id: "addEntry-1",
										isStandardAction: true,
										press: "cmd:Create",
										text: "{i18n>CREATE_OBJECT}"
									},
									CreateWithFilters: {
										action: "CreateWithFilters",
										callbackName: "._templateEventHandlers.addEntryWithFilters",
										enabled: "{_templPriv>/generic/bDataAreShownInTable}",
										id: "template:::ListReportAction:::CreateWithFilter:::sQuickVariantKey::1",
										isStandardAction: true,
										press: "cmd:CreateWithFilters",
										text: "{i18n>ST_CREATE_WITH_FILTERS}"
									},
									Delete: {
										action: "Delete",
										callbackName: "._templateEventHandlers.deleteEntries",
										enabled: "{_templPriv>/listReport/deleteEnabled}",
										id: "deleteEntry-1",
										isStandardAction: true,
										press: "cmd:Delete",
										text: "{i18n>DELETE}"
									}
								},
								copy: true,
								extensionActions: [],
								inlineDelete: false,
								multiSelect: false,
								mode: "Single",
								onlyForDelete: true,
								selectAll: false,
								selectionLimit: 600,
								type: "GridTable",
								calculateWidthIncludingColumnHeader: {}
							}
						},
						2: {
							key: "2",
							isSmartChart: false,
							tableSettings: {
								commandExecution: {
									Create: {
										action: "Create",
										callbackName: "._templateEventHandlers.addEntry",
										enabled: true,
										id: "addEntry-2",
										isStandardAction: true,
										press: "cmd:Create",
										text: "{i18n>CREATE_OBJECT}"
									},
									CreateWithFilters: {
										action: "CreateWithFilters",
										callbackName: "._templateEventHandlers.addEntryWithFilters",
										enabled: "{_templPriv>/generic/bDataAreShownInTable}",
										id: "template:::ListReportAction:::CreateWithFilter:::sQuickVariantKey::2",
										isStandardAction: true,
										press: "cmd:CreateWithFilters",
										text: "{i18n>ST_CREATE_WITH_FILTERS}"
									},
									Delete: {
										action: "Delete",
										callbackName: "._templateEventHandlers.deleteEntries",
										enabled: "{_templPriv>/listReport/deleteEnabled}",
										id: "deleteEntry-2",
										isStandardAction: true,
										press: "cmd:Delete",
										text: "{i18n>DELETE}"
									}
								},
								copy: true,
								extensionActions: [],
								inlineDelete: false,
								multiSelect: false,
								mode: "Single",
								onlyForDelete: true,
								selectAll: false,
								selectionLimit: 600,
								type: "TreeTable",
								calculateWidthIncludingColumnHeader: {}
							}
						}
					}
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				filterSettings: oDefaultFilterSettings
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
			//Assert
			assert.deepEqual(oResult, oExpectedSettings, "fetches correct templateSpecificParameters");
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters with quickVariantSelectionX and 1 out of 2 variants is multiEdit enabled", function (assert) {
			//Arrange
			var oSettings = {
				quickVariantSelectionX: {
					variants: {
						1: {
							key: "1"
						},
						2: {
							key: "2",
							tableSettings: {
								multiEdit: {
									enabled: true
								}
							}
						}
					}
				}
			};
			var oExpectedSettings = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isResponsiveTable: true,
				isIndicatorRequired: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				quickVariantSelectionX: {
					variants: {
						1: {
							key: "1",
							isSmartChart: false,
							tableSettings: {
								commandExecution: {
									Create: {
										action: "Create",
										callbackName: "._templateEventHandlers.addEntry",
										enabled: true,
										id: "addEntry-1",
										isStandardAction: true,
										press: "cmd:Create",
										text: "{i18n>CREATE_OBJECT}"
									},
									CreateWithFilters: {
										action: "CreateWithFilters",
										callbackName: "._templateEventHandlers.addEntryWithFilters",
										enabled: "{_templPriv>/generic/bDataAreShownInTable}",
										id: "template:::ListReportAction:::CreateWithFilter:::sQuickVariantKey::1",
										isStandardAction: true,
										press: "cmd:CreateWithFilters",
										text: "{i18n>ST_CREATE_WITH_FILTERS}"
									},
									Delete: {
										action: "Delete",
										callbackName: "._templateEventHandlers.deleteEntries",
										enabled: "{_templPriv>/listReport/deleteEnabled}",
										id: "deleteEntry-1",
										isStandardAction: true,
										press: "cmd:Delete",
										text: "{i18n>DELETE}"
									}
								},
								copy: true,
								extensionActions: [],
								inlineDelete: false,
								multiSelect: false,
								mode: "SingleSelectLeft",
								onlyForDelete: true,
								selectAll: true,
								selectionLimit: 200,
								type: "ResponsiveTable",
								calculateWidthIncludingColumnHeader: {}
							}
						},
						2: {
							key: "2",
							isSmartChart: false,
							tableSettings: {
								commandExecution: {
									Create: {
										action: "Create",
										callbackName: "._templateEventHandlers.addEntry",
										enabled: true,
										id: "addEntry-2",
										isStandardAction: true,
										press: "cmd:Create",
										text: "{i18n>CREATE_OBJECT}"
									},
									CreateWithFilters: {
										action: "CreateWithFilters",
										callbackName: "._templateEventHandlers.addEntryWithFilters",
										enabled: "{_templPriv>/generic/bDataAreShownInTable}",
										id: "template:::ListReportAction:::CreateWithFilter:::sQuickVariantKey::2",
										isStandardAction: true,
										press: "cmd:CreateWithFilters",
										text: "{i18n>ST_CREATE_WITH_FILTERS}"
									},
									Delete: {
										action: "Delete",
										callbackName: "._templateEventHandlers.deleteEntries",
										enabled: "{_templPriv>/listReport/deleteEnabled}",
										id: "deleteEntry-2",
										isStandardAction: true,
										press: "cmd:Delete",
										text: "{i18n>DELETE}"
									}
								},
								copy: true,
								extensionActions: [],
								inlineDelete: false,
								multiSelect: false,
								mode: "SingleSelectLeft",
								onlyForDelete: true,
								selectAll: true,
								selectionLimit: 200,
								type: "ResponsiveTable",
								multiEdit: {
									enabled: true,
									fields: undefined
								},
								calculateWidthIncludingColumnHeader: {}
							}
						}
					}
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				filterSettings: oDefaultFilterSettings
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
			//Assert
			assert.deepEqual(oResult, oExpectedSettings, "fetches correct templateSpecificParameters");
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters with quickVariantSelectionX", function (assert) {
			//Arrange
			var oSettings = {
				tableSettings: {
					type: "GridTable",
					selectAll: true
				},
				quickVariantSelectionX: {
					variants: {
						1: {
							key: "1",
							tableSettings: {
								type: "GridTable",
								selectionLimit: 600
							}
						},
						2: {
							key: "2",
							tableSettings: {
								type: "ResponsiveTable",
								selectionLimit: 600
							}
						}
					}
				}
			};
			var oExpectedError = new Error("ListReport.Component: Variant with key 2 resulted in invalid Table Type combination. Please check documentation and update manifest.json.");
			//Act
			try {
				var oResult = this.oStubForPrivate.Component_getMethods(undefined, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
			} catch (err) {
				//Assert
				assert.deepEqual(err.name, "FioriElements", "Error of type FioriElements thrown");
				assert.deepEqual(err.message, oExpectedError.message, "Invalid Table Type combination error");
			}
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters with quickVariantSelectionX for different tabletype in root vs tabs", function (assert) {
			//Arrange
			var oMetaModel = {
				getODataEntitySet: function (entitySet) {
					return {
						entityType: entitySet === "rootEntitySet" ? "rootEntityType" : "entityType"
					};
				},
				getODataEntityType: function (entityType) {
					return {
						property: [],
						"sap:semantics": entityType === "rootEntityType" ? undefined : "aggregate",
						"com.sap.vocabularies.UI.v1.SelectionFields": []
					};
				},
				getObject: Function.prototype
			};
			var oSettings = {
				quickVariantSelectionX: {
					variants: {
						"1": {
							key: "1",
							entitySet: "entitySet",
							tableSettings: {
								type: "GridTable",
								selectionLimit: 600
							}
						}
					}
				}
			};
			var leadingEntitySet = "rootEntitySet";
			var oExpectedResult = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isResponsiveTable: false,
				isIndicatorRequired: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				quickVariantSelectionX: {
					variants: {
						1: {
							entitySet: "entitySet",
							isSmartChart: false,
							key: "1",
							tableSettings: {
								commandExecution: {
									Create: {
										action: "Create",
										callbackName: "._templateEventHandlers.addEntry",
										enabled: true,
										id: "addEntry-1",
										isStandardAction: true,
										press: "cmd:Create",
										text: "{i18n>CREATE_OBJECT}"
									},
									CreateWithFilters: {
										action: "CreateWithFilters",
										callbackName: "._templateEventHandlers.addEntryWithFilters",
										enabled: "{_templPriv>/generic/bDataAreShownInTable}",
										id: "template:::ListReportAction:::CreateWithFilter:::sQuickVariantKey::1",
										isStandardAction: true,
										press: "cmd:CreateWithFilters",
										text: "{i18n>ST_CREATE_WITH_FILTERS}"
									},
									Delete: {
										action: "Delete",
										callbackName: "._templateEventHandlers.deleteEntries",
										enabled: "{_templPriv>/listReport/deleteEnabled}",
										id: "deleteEntry-1",
										isStandardAction: true,
										press: "cmd:Delete",
										text: "{i18n>DELETE}"
									}
								},
								copy: true,
								extensionActions: [],
								inlineDelete: false,
								multiSelect: false,
								mode: "Single",
								onlyForDelete: true,
								selectAll: false,
								selectionLimit: 600,
								type: "GridTable",
								calculateWidthIncludingColumnHeader: {}
							}
						}
					}
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				filterSettings: oDefaultFilterSettings
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(oMetaModel, oSettings, this.Device, leadingEntitySet);
			//Assert
			assert.deepEqual(oResult, oExpectedResult, "Fetches expected settings");
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters with quickVariantSelectionX for different tabletype in root vs tabs", function (assert) {
			//Arrange
			var oMetaModel = {
				getODataEntitySet: function (entitySet) {
					return {
						entityType: entitySet === "rootEntitySet" ? "rootEntityType" : "entityType"
					};
				},
				getODataEntityType: function (entityType) {
					return {
						property: [],
						"sap:semantics": entityType === "rootEntityType" ? undefined : "aggregate",
						"com.sap.vocabularies.UI.v1.SelectionFields": []
					};
				},
				getObject: Function.prototype
			};
			var oSettings = {
				quickVariantSelectionX: {
					variants: {
						1: {
							key: "1",
							entitySet: "entitySet",
							tableSettings: {
								type: "AnalyticalTable",
								selectionLimit: 600
							}
						}
					}
				}
			};
			var leadingEntitySet = "rootEntitySet";
			var oExpectedResult = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isResponsiveTable: false,
				isIndicatorRequired: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				quickVariantSelectionX: {
					variants: {
						1: {
							entitySet: "entitySet",
							isSmartChart: false,
							key: "1",
							tableSettings: {
								commandExecution: {
									Create: {
										action: "Create",
										callbackName: "._templateEventHandlers.addEntry",
										enabled: true,
										id: "addEntry-1",
										isStandardAction: true,
										press: "cmd:Create",
										text: "{i18n>CREATE_OBJECT}"
									},
									CreateWithFilters: {
										action: "CreateWithFilters",
										callbackName: "._templateEventHandlers.addEntryWithFilters",
										enabled: "{_templPriv>/generic/bDataAreShownInTable}",
										id: "template:::ListReportAction:::CreateWithFilter:::sQuickVariantKey::1",
										isStandardAction: true,
										press: "cmd:CreateWithFilters",
										text: "{i18n>ST_CREATE_WITH_FILTERS}"
									},
									Delete: {
										action: "Delete",
										callbackName: "._templateEventHandlers.deleteEntries",
										enabled: "{_templPriv>/listReport/deleteEnabled}",
										id: "deleteEntry-1",
										isStandardAction: true,
										press: "cmd:Delete",
										text: "{i18n>DELETE}"
									}
								},
								copy: true,
								extensionActions: [],
								inlineDelete: false,
								multiSelect: false,
								mode: "Single",
								onlyForDelete: true,
								selectAll: false,
								selectionLimit: 600,
								type: "AnalyticalTable",
								calculateWidthIncludingColumnHeader: {}
							}
						}
					}
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				filterSettings: oDefaultFilterSettings
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(oMetaModel, oSettings, this.Device, leadingEntitySet);
			//Assert
			assert.deepEqual(oResult, oExpectedResult, "Fetches expected settings");
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters with quickVariantSelectionX for diff tabletype in root vs tabs", function (assert) {
			//Arrange
			var oMetaModel = {
				getODataEntitySet: function (entitySet) {
					return {
						entityType: entitySet === "rootEntitySet" ? "rootEntityType" : "entityType"
					};
				},
				getODataEntityType: function (entityType) {
					return {
						property: [],
						"sap:semantics": entityType === "rootEntityType" ? "aggregate" : undefined,
						"com.sap.vocabularies.UI.v1.SelectionFields": []
					};
				},
				getObject: Function.prototype
			};
			var oSettings = {
				quickVariantSelectionX: {
					variants: {
						1: {
							key: "1",
							entitySet: "entitySet",
							tableSettings: {
								type: "AnalyticalTable",
								selectionLimit: 600
							}
						}
					}
				}
			};
			var leadingEntitySet = "rootEntitySet";
			var oExpectedResult = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isResponsiveTable: false,
				isIndicatorRequired: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				quickVariantSelectionX: {
					variants: {
						1: {
							entitySet: "entitySet",
							isSmartChart: false,
							key: "1",
							tableSettings: {
								commandExecution: {
									Create: {
										action: "Create",
										callbackName: "._templateEventHandlers.addEntry",
										enabled: true,
										id: "addEntry-1",
										isStandardAction: true,
										press: "cmd:Create",
										text: "{i18n>CREATE_OBJECT}"
									},
									CreateWithFilters: {
										action: "CreateWithFilters",
										callbackName: "._templateEventHandlers.addEntryWithFilters",
										enabled: "{_templPriv>/generic/bDataAreShownInTable}",
										id: "template:::ListReportAction:::CreateWithFilter:::sQuickVariantKey::1",
										isStandardAction: true,
										press: "cmd:CreateWithFilters",
										text: "{i18n>ST_CREATE_WITH_FILTERS}"
									},
									Delete: {
										action: "Delete",
										callbackName: "._templateEventHandlers.deleteEntries",
										enabled: "{_templPriv>/listReport/deleteEnabled}",
										id: "deleteEntry-1",
										isStandardAction: true,
										press: "cmd:Delete",
										text: "{i18n>DELETE}"
									}
								},
								copy: true,
								extensionActions: [],
								inlineDelete: false,
								multiSelect: false,
								mode: "Single",
								onlyForDelete: true,
								selectAll: false,
								selectionLimit: 600,
								type: "GridTable",
								calculateWidthIncludingColumnHeader: {}
							}
						}
					}
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				filterSettings: oDefaultFilterSettings
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(oMetaModel, oSettings, this.Device, leadingEntitySet);
			//Assert
			assert.deepEqual(oResult, oExpectedResult, "Fetches expected settings");
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters with quickVariantSelectionX for diff tabletype in root vs tabs", function (assert) {
			//Arrange
			var oMetaModel = {
				getODataEntitySet: function (entitySet) {
					return {
						entityType: entitySet === "rootEntitySet" ? "rootEntityType" : "entityType"
					};
				},
				getODataEntityType: function (entityType) {
					return {
						property: [],
						"sap:semantics": entityType === "rootEntityType" ? "aggregate" : undefined,
						"com.sap.vocabularies.UI.v1.SelectionFields": []
					};
				},
				getObject: Function.prototype
			};
			var oSettings = {
				quickVariantSelectionX: {
					variants: {
						1: {
							key: "1",
							entitySet: "entitySet",
							tableSettings: {
								type: "ResponsiveTable",
								selectionLimit: 600
							}
						}
					}
				}
			};
			var leadingEntitySet = "rootEntitySet";
			var oExpectedResult = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isResponsiveTable: true,
				isIndicatorRequired: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				quickVariantSelectionX: {
					variants: {
						1: {
							entitySet: "entitySet",
							isSmartChart: false,
							key: "1",
							tableSettings: {
								commandExecution: {
									Create: {
										action: "Create",
										callbackName: "._templateEventHandlers.addEntry",
										enabled: true,
										id: "addEntry-1",
										isStandardAction: true,
										press: "cmd:Create",
										text: "{i18n>CREATE_OBJECT}"
									},
									CreateWithFilters: {
										action: "CreateWithFilters",
										callbackName: "._templateEventHandlers.addEntryWithFilters",
										enabled: "{_templPriv>/generic/bDataAreShownInTable}",
										id: "template:::ListReportAction:::CreateWithFilter:::sQuickVariantKey::1",
										isStandardAction: true,
										press: "cmd:CreateWithFilters",
										text: "{i18n>ST_CREATE_WITH_FILTERS}"
									},
									Delete: {
										action: "Delete",
										callbackName: "._templateEventHandlers.deleteEntries",
										enabled: "{_templPriv>/listReport/deleteEnabled}",
										id: "deleteEntry-1",
										isStandardAction: true,
										press: "cmd:Delete",
										text: "{i18n>DELETE}"
									}
								},
								copy: true,
								extensionActions: [],
								inlineDelete: false,
								multiSelect: false,
								mode: "SingleSelectLeft",
								onlyForDelete: true,
								selectAll: true,
								selectionLimit: 600,
								type: "ResponsiveTable",
								calculateWidthIncludingColumnHeader: {}
							}
						}
					}
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				filterSettings: oDefaultFilterSettings
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(oMetaModel, oSettings, this.Device, leadingEntitySet);
			//Assert
			assert.deepEqual(oResult, oExpectedResult, "Fetches expected settings");
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters with quickVariantSelectionX for smartChart", function (assert) {
			//Arrange
			this.oMetaModel.getODataEntityType = function (entityType) {
				return {
					path: {
						PresentationVariant: {
							Visualizations: [
								{
									AnnotationPath: "com.sap.vocabularies.UI.v1.Chart"
								}
							]
						}
					},
					property: [],
					"com.sap.vocabularies.UI.v1.SelectionFields": []
				};
			}

			var oSettings = {
				quickVariantSelectionX: {
					variants: {
						"1": {
							key: "1",
							annotationPath: "path"
						}
					}
				}
			};
			var oExpectedSettings = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isResponsiveTable: true,
				isIndicatorRequired: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				quickVariantSelectionX: {
					variants: {
						1: {
							annotationPath: "path",
							isSmartChart: true,
							key: "1"
						}
					}
				},
				targetEntities: {},
				filterSettings: oDefaultFilterSettings
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
			//Assert
			assert.deepEqual(oResult, oExpectedSettings, "fetches correct templateSpecificParameters");
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters with quickVariantSelectionX for smartChart", function (assert) {
			//Arrange
			this.oMetaModel.getODataEntityType = function (entityType) {
				return {
					path: {
						PresentationVariant: {
							Visualizations: [
								{
									AnnotationPath: "com.sap.vocabularies.UI.v1.Chart"
								}
							]
						}
					},
					property: [],
					"com.sap.vocabularies.UI.v1.SelectionFields": []
				};
			}

			var oSettings = {
				quickVariantSelectionX: {
					variants: {
						1: {
							key: "1",
							annotationPath: "path"
						}
					}
				}
			};
			var oExpectedSettings = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isResponsiveTable: true,
				isIndicatorRequired: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				quickVariantSelectionX: {
					variants: {
						1: {
							annotationPath: "path",
							isSmartChart: true,
							key: "1"
						}
					}
				},
				targetEntities: {},
				filterSettings: oDefaultFilterSettings
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
			//Assert
			assert.deepEqual(oResult, oExpectedSettings, "fetches correct templateSpecificParameters");
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters with quickVariantSelectionX for smartChart", function (assert) {
			//Arrange
			this.oMetaModel.getODataEntityType = function (entityType) {
				return {
					path: {
						Visualizations: [
							{
								AnnotationPath: "com.sap.vocabularies.UI.v1.Chart"
							}
						]
					},
					property: [],
					"com.sap.vocabularies.UI.v1.SelectionFields": []
				};
			}

			var oSettings = {
				quickVariantSelectionX: {
					variants: {
						"1": {
							key: "1",
							annotationPath: "path"
						}
					}
				}
			};
			var oExpectedSettings = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isResponsiveTable: true,
				isIndicatorRequired: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				quickVariantSelectionX: {
					variants: {
						1: {
							annotationPath: "path",
							isSmartChart: true,
							key: "1"
						}
					}
				},
				targetEntities: {},
				filterSettings: oDefaultFilterSettings
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
			//Assert
			assert.deepEqual(oResult, oExpectedSettings, "fetches correct templateSpecificParameters");
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters with useNewActionCreate", function (assert) {
			//Arrange
			this.oMetaModel.getODataEntityType = function (entityType) {
				return {
					path: {
						Visualizations: [
							{
								AnnotationPath: "com.sap.vocabularies.UI.v1.Chart"
							}
						]
					},
					property: [],
					"com.sap.vocabularies.UI.v1.SelectionFields": []
				};
			}
			var oDraftContext = {
				getODataDraftFunctionImportName: function () {
					return "function-import-name";
				}
			}
			var oModel = {};
			var oSettings = {
				useNewActionForCreate: true
			};
			var oExpectedSettings = {
				controlConfigurationSettings: {},
				bNewAction: true,
				isIndicatorRequired: true,
				isResponsiveTable: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				tableSettings: {
					commandExecution: {
						Create: {
							action: "Create",
							callbackName: "._templateEventHandlers.addEntry",
							enabled: true,
							id: "addEntry",
							isStandardAction: true,
							press: "cmd:Create",
							text: "{i18n>CREATE_OBJECT}"
						},
						CreateWithFilters: {
							action: "CreateWithFilters",
							callbackName: "._templateEventHandlers.addEntryWithFilters",
							enabled: "{_templPriv>/generic/bDataAreShownInTable}",
							id: "template::addEntryWithFilter",
							isStandardAction: true,
							press: "cmd:CreateWithFilters",
							text: "{i18n>ST_CREATE_WITH_FILTERS}"
						},
						Delete: {
							action: "Delete",
							callbackName: "._templateEventHandlers.deleteEntries",
							enabled: "{_templPriv>/listReport/deleteEnabled}",
							id: "deleteEntry",
							isStandardAction: true,
							press: "cmd:Delete",
							text: "{i18n>DELETE}"
						}
					},
					copy: true,
					extensionActions: [],
					inlineDelete: false,
					mode: "SingleSelectLeft",
					multiSelect: false,
					onlyForDelete: true,
					selectAll: true,
					selectionLimit: 200,
					type: "ResponsiveTable",
					calculateWidthIncludingColumnHeader: {}
				},
				useNewActionForCreate: true,
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				filterSettings: oDefaultFilterSettings
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet, {}, oModel, oDraftContext);
			//Assert
			assert.deepEqual(oResult, oExpectedSettings, "fetches correct templateSpecificParameters");
			//Clean
		});

		QUnit.test("getTemplateSpecificParameters with custom action (defined via manifest) with command setting", function (assert) {
			oSandbox.stub(oComponentUtils, "getControllerExtensions", function () {
				return {
					Actions: {
						CustomAction: {
							id: "CustomAction",
							command: "CustomActionCommand",
							global: true,
							press: "CustomActionClickHandler"
						}
					}
				};
			});
			var oExpectedSettings = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isIndicatorRequired: true,
				isResponsiveTable: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				tableSettings: {
					commandExecution: {
						Create: {
							action: "Create",
							callbackName: "._templateEventHandlers.addEntry",
							enabled: true,
							id: "addEntry",
							isStandardAction: true,
							press: "cmd:Create",
							text: "{i18n>CREATE_OBJECT}"
						},
						CreateWithFilters: {
							action: "CreateWithFilters",
							callbackName: "._templateEventHandlers.addEntryWithFilters",
							enabled: "{_templPriv>/generic/bDataAreShownInTable}",
							id: "template::addEntryWithFilter",
							isStandardAction: true,
							press: "cmd:CreateWithFilters",
							text: "{i18n>ST_CREATE_WITH_FILTERS}"
						},
						Delete: {
							action: "Delete",
							callbackName: "._templateEventHandlers.deleteEntries",
							enabled: "{_templPriv>/listReport/deleteEnabled}",
							id: "deleteEntry",
							isStandardAction: true,
							press: "cmd:Delete",
							text: "{i18n>DELETE}"
						}
					},
					copy: true,
					extensionActions: [],
					inlineDelete: false,
					mode: "SingleSelectLeft",
					multiSelect: false,
					onlyForDelete: false,
					selectAll: true,
					selectionLimit: 200,
					type: "ResponsiveTable",
					calculateWidthIncludingColumnHeader: {}
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				"filterSettings": oDefaultFilterSettings
			};

			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, {}, this.Device, this.sEntitySet, {}, {});

			assert.deepEqual(oResult, oExpectedSettings, "fetches correct templateSpecificParameters");
		});

		QUnit.test("getTemplateSpecificParameters with quickVariantSelectionX and custom action (defined via manifest) with command setting", function (assert) {
			var oSettings = {
				quickVariantSelectionX: {
					variants: {
						1: {
							key: "tab1",
							entitySet: "tab1EntitySet",
							tableSettings: {
								type: "ResponsiveTable"
							}
						},
						2: {
							key: "tab2",
							entitySet: "tab2entitySet",
							tableSettings: {
								type: "ResponsiveTable"
							}
						}
					}
				}
			};
			oSandbox.stub(oComponentUtils, "getControllerExtensions", function () {
				return {
					Actions: {
						CustomAction: {
							id: "CustomAction",
							command: "CustomActionCommand",
							press: "CustomActionClickHandler"
						}
					}
				};
			});
			var oExpectedSettings = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isResponsiveTable: true,
				isIndicatorRequired: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				quickVariantSelectionX: {
					variants: {
						1: {
							entitySet: "tab1EntitySet",
							key: "tab1",
							isSmartChart: false,
							tableSettings: {
								commandExecution: {
									Create: {
										action: "Create",
										callbackName: "._templateEventHandlers.addEntry",
										enabled: true,
										id: "addEntry-tab1",
										isStandardAction: true,
										press: "cmd:Create",
										text: "{i18n>CREATE_OBJECT}"
									},
									CreateWithFilters: {
										action: "CreateWithFilters",
										callbackName: "._templateEventHandlers.addEntryWithFilters",
										enabled: "{_templPriv>/generic/bDataAreShownInTable}",
										id: "template:::ListReportAction:::CreateWithFilter:::sQuickVariantKey::tab1",
										isStandardAction: true,
										press: "cmd:CreateWithFilters",
										text: "{i18n>ST_CREATE_WITH_FILTERS}"
									},
									Delete: {
										action: "Delete",
										callbackName: "._templateEventHandlers.deleteEntries",
										enabled: "{_templPriv>/listReport/deleteEnabled}",
										id: "deleteEntry-tab1",
										isStandardAction: true,
										press: "cmd:Delete",
										text: "{i18n>DELETE}"
									},
									CustomAction: {
										action: "CustomActionCommand",
										callbackName: "CustomActionClickHandler",
										id: "CustomAction-tab1"
									},
								},
								copy: true,
								extensionActions: [{
									command: "CustomActionCommand",
									enabled: "{_templPriv>/generic/listCommons/breakoutActionsEnabled/CustomAction-tab1/enabled}",
									id: "CustomAction-tab1",
									press: "cmd:CustomActionCommand"
								}
								],
								inlineDelete: false,
								mode: "SingleSelectLeft",
								multiSelect: false,
								onlyForDelete: false,
								selectAll: true,
								selectionLimit: 200,
								type: "ResponsiveTable",
								calculateWidthIncludingColumnHeader: {}
							}
						},
						2: {
							entitySet: "tab2entitySet",
							key: "tab2",
							isSmartChart: false,
							tableSettings: {
								commandExecution: {
									Create: {
										action: "Create",
										callbackName: "._templateEventHandlers.addEntry",
										enabled: true,
										id: "addEntry-tab2",
										isStandardAction: true,
										press: "cmd:Create",
										text: "{i18n>CREATE_OBJECT}"
									},
									CreateWithFilters: {
										action: "CreateWithFilters",
										callbackName: "._templateEventHandlers.addEntryWithFilters",
										enabled: "{_templPriv>/generic/bDataAreShownInTable}",
										id: "template:::ListReportAction:::CreateWithFilter:::sQuickVariantKey::tab2",
										isStandardAction: true,
										press: "cmd:CreateWithFilters",
										text: "{i18n>ST_CREATE_WITH_FILTERS}"
									},
									Delete: {
										action: "Delete",
										callbackName: "._templateEventHandlers.deleteEntries",
										enabled: "{_templPriv>/listReport/deleteEnabled}",
										id: "deleteEntry-tab2",
										isStandardAction: true,
										press: "cmd:Delete",
										text: "{i18n>DELETE}"
									},
									CustomAction: {
										action: "CustomActionCommand",
										callbackName: "CustomActionClickHandler",
										id: "CustomAction-tab2"
									},
								},
								copy: true,
								extensionActions: [{
									command: "CustomActionCommand",
									enabled: "{_templPriv>/generic/listCommons/breakoutActionsEnabled/CustomAction-tab2/enabled}",
									id: "CustomAction-tab2",
									press: "cmd:CustomActionCommand"
								}
								],
								inlineDelete: false,
								mode: "SingleSelectLeft",
								multiSelect: false,
								onlyForDelete: false,
								selectAll: true,
								selectionLimit: 200,
								type: "ResponsiveTable",
								calculateWidthIncludingColumnHeader: {}
							}
						}
					}
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				"filterSettings": oDefaultFilterSettings
			};

			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet, {}, {});

			assert.deepEqual(oResult, oExpectedSettings, "fetches correct templateSpecificParameters");
		});

		QUnit.test("getTemplateSpecificParameters with table toolbar DataFieldForAction which has a command", function (assert) {
			oSandbox.stub(this.oMetaModel, "getODataEntityType").returns({
				"com.sap.vocabularies.UI.v1.LineItem": [{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction"
				}],
				property: [],
				"com.sap.vocabularies.UI.v1.SelectionFields": []
			});
			oSandbox.stub(oComponentUtils, "getToolbarDataFieldForActionCommandDetails").returns({
				action: "SetOpportunityCommand",
				annotatedAction: true,
				callbackName: "._templateEventHandlers.onCallActionFromToolBar",
				id: "ActionId"
			});
			var oExpectedSettings = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isIndicatorRequired: true,
				isResponsiveTable: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				tableSettings: {
					commandExecution: {
						Create: {
							action: "Create",
							callbackName: "._templateEventHandlers.addEntry",
							enabled: true,
							id: "addEntry",
							isStandardAction: true,
							press: "cmd:Create",
							text: "{i18n>CREATE_OBJECT}"
						},
						CreateWithFilters: {
							action: "CreateWithFilters",
							callbackName: "._templateEventHandlers.addEntryWithFilters",
							enabled: "{_templPriv>/generic/bDataAreShownInTable}",
							id: "template::addEntryWithFilter",
							isStandardAction: true,
							press: "cmd:CreateWithFilters",
							text: "{i18n>ST_CREATE_WITH_FILTERS}"
						},
						Delete: {
							action: "Delete",
							callbackName: "._templateEventHandlers.deleteEntries",
							enabled: "{_templPriv>/listReport/deleteEnabled}",
							id: "deleteEntry",
							isStandardAction: true,
							press: "cmd:Delete",
							text: "{i18n>DELETE}"
						},
						ActionId: {
							action: "SetOpportunityCommand",
							annotatedAction: true,
							callbackName: "._templateEventHandlers.onCallActionFromToolBar",
							id: "ActionId"
						}
					},
					copy: true,
					extensionActions: [],
					inlineDelete: false,
					mode: "SingleSelectLeft",
					multiSelect: false,
					onlyForDelete: false,
					selectAll: true,
					selectionLimit: 200,
					type: "ResponsiveTable",
					calculateWidthIncludingColumnHeader: {}
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				"filterSettings": oDefaultFilterSettings
			};

			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, {}, this.Device, this.sEntitySet, {}, {});

			assert.deepEqual(oResult, oExpectedSettings, "fetches correct templateSpecificParameters");
		});

		QUnit.test("getTemplateSpecificParameters with table toolbar DataFieldForIBN which has a command", function (assert) {
			oSandbox.stub(this.oMetaModel, "getODataEntityType").returns({
				"com.sap.vocabularies.UI.v1.LineItem": [{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"
				}],
				property: [],
				"com.sap.vocabularies.UI.v1.SelectionFields": []
			});
			oSandbox.stub(oComponentUtils, "getToolbarDataFieldForIBNCommandDetails").returns({
				id: "ActionId",
				action: "OutboundCommand",
				callbackName: "._templateEventHandlers.onDataFieldForIntentBasedNavigation",
				outboundAction: true
			});
			var oExpectedSettings = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isIndicatorRequired: true,
				isResponsiveTable: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				tableSettings: {
					commandExecution: {
						Create: {
							action: "Create",
							callbackName: "._templateEventHandlers.addEntry",
							enabled: true,
							id: "addEntry",
							isStandardAction: true,
							press: "cmd:Create",
							text: "{i18n>CREATE_OBJECT}"
						},
						CreateWithFilters: {
							action: "CreateWithFilters",
							callbackName: "._templateEventHandlers.addEntryWithFilters",
							enabled: "{_templPriv>/generic/bDataAreShownInTable}",
							id: "template::addEntryWithFilter",
							isStandardAction: true,
							press: "cmd:CreateWithFilters",
							text: "{i18n>ST_CREATE_WITH_FILTERS}"
						},
						Delete: {
							action: "Delete",
							callbackName: "._templateEventHandlers.deleteEntries",
							enabled: "{_templPriv>/listReport/deleteEnabled}",
							id: "deleteEntry",
							isStandardAction: true,
							press: "cmd:Delete",
							text: "{i18n>DELETE}"
						},
						ActionId: {
							id: "ActionId",
							action: "OutboundCommand",
							callbackName: "._templateEventHandlers.onDataFieldForIntentBasedNavigation",
							outboundAction: true
						}
					},
					copy: true,
					extensionActions: [],
					inlineDelete: false,
					mode: "SingleSelectLeft",
					multiSelect: false,
					onlyForDelete: true,
					selectAll: true,
					selectionLimit: 200,
					type: "ResponsiveTable",
					calculateWidthIncludingColumnHeader: {}
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				"filterSettings": oDefaultFilterSettings
			};

			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, {}, this.Device, this.sEntitySet, {}, {});

			assert.deepEqual(oResult, oExpectedSettings, "fetches correct templateSpecificParameters");
		});

		QUnit.test("getTemplateSpecificParameters with table (with lineitem annotation which has a qualifier) toolbar DataFieldForAction which has a command", function (assert) {
			oSandbox.stub(this.oMetaModel, "getODataEntityType").returns({
				"com.sap.vocabularies.UI.v1.LineItem#Items": [{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction"
				}],
				property: [],
				"com.sap.vocabularies.UI.v1.SelectionFields": []
			});
			oSandbox.stub(oComponentUtils, "getToolbarDataFieldForActionCommandDetails").returns({
				action: "SetOpportunityCommand",
				annotatedAction: true,
				callbackName: "._templateEventHandlers.onCallActionFromToolBar",
				id: "ActionId"
			});
			oSandbox.stub(this.oMetaModel, "getObject").returns({
				Visualizations: [{
					AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem#Items"
				}]
			});
			var oExpectedSettings = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isIndicatorRequired: true,
				isResponsiveTable: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				tableSettings: {
					commandExecution: {
						Create: {
							action: "Create",
							callbackName: "._templateEventHandlers.addEntry",
							enabled: true,
							id: "addEntry",
							isStandardAction: true,
							press: "cmd:Create",
							text: "{i18n>CREATE_OBJECT}"
						},
						CreateWithFilters: {
							action: "CreateWithFilters",
							callbackName: "._templateEventHandlers.addEntryWithFilters",
							enabled: "{_templPriv>/generic/bDataAreShownInTable}",
							id: "template::addEntryWithFilter",
							isStandardAction: true,
							press: "cmd:CreateWithFilters",
							text: "{i18n>ST_CREATE_WITH_FILTERS}"
						},
						Delete: {
							action: "Delete",
							callbackName: "._templateEventHandlers.deleteEntries",
							enabled: "{_templPriv>/listReport/deleteEnabled}",
							id: "deleteEntry",
							isStandardAction: true,
							press: "cmd:Delete",
							text: "{i18n>DELETE}"
						},
						ActionId: {
							action: "SetOpportunityCommand",
							annotatedAction: true,
							callbackName: "._templateEventHandlers.onCallActionFromToolBar",
							id: "ActionId"
						}
					},
					copy: true,
					extensionActions: [],
					inlineDelete: false,
					mode: "SingleSelectLeft",
					multiSelect: false,
					onlyForDelete: true,
					selectAll: true,
					selectionLimit: 200,
					type: "ResponsiveTable",
					calculateWidthIncludingColumnHeader: {}
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				"filterSettings": oDefaultFilterSettings
			};

			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, {}, this.Device, this.sEntitySet, {}, {});

			assert.deepEqual(oResult, oExpectedSettings, "fetches correct templateSpecificParameters");
		});

		QUnit.test("getTemplateSpecificParameters with table (with lineitem annotation which has a qualifier) toolbar DataFieldForIBN which has a command", function (assert) {
			oSandbox.stub(this.oMetaModel, "getODataEntityType").returns({
				"com.sap.vocabularies.UI.v1.LineItem#Items": [{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"
				}],
				property: [],
				"com.sap.vocabularies.UI.v1.SelectionFields": []
			});
			oSandbox.stub(oComponentUtils, "getToolbarDataFieldForIBNCommandDetails").returns({
				id: "ActionId",
				action: "OutboundCommand",
				callbackName: "._templateEventHandlers.onDataFieldForIntentBasedNavigation",
				outboundAction: true
			});
			oSandbox.stub(this.oMetaModel, "getObject").returns({
				Visualizations: [{
					AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem#Items"
				}]
			});
			var oExpectedSettings = {
				controlConfigurationSettings: {},
				bNewAction: undefined,
				isIndicatorRequired: true,
				isResponsiveTable: true,
				isSelflinkRequired: true,
				isSemanticallyConnected: false,
				bInsightsEnabled: false,
				tableSettings: {
					commandExecution: {
						Create: {
							action: "Create",
							callbackName: "._templateEventHandlers.addEntry",
							enabled: true,
							id: "addEntry",
							isStandardAction: true,
							press: "cmd:Create",
							text: "{i18n>CREATE_OBJECT}"
						},
						CreateWithFilters: {
							action: "CreateWithFilters",
							callbackName: "._templateEventHandlers.addEntryWithFilters",
							enabled: "{_templPriv>/generic/bDataAreShownInTable}",
							id: "template::addEntryWithFilter",
							isStandardAction: true,
							press: "cmd:CreateWithFilters",
							text: "{i18n>ST_CREATE_WITH_FILTERS}"
						},
						Delete: {
							action: "Delete",
							callbackName: "._templateEventHandlers.deleteEntries",
							enabled: "{_templPriv>/listReport/deleteEnabled}",
							id: "deleteEntry",
							isStandardAction: true,
							press: "cmd:Delete",
							text: "{i18n>DELETE}"
						},
						ActionId: {
							id: "ActionId",
							action: "OutboundCommand",
							callbackName: "._templateEventHandlers.onDataFieldForIntentBasedNavigation",
							outboundAction: true
						}
					},
					copy: true,
					extensionActions: [],
					inlineDelete: false,
					mode: "SingleSelectLeft",
					multiSelect: false,
					onlyForDelete: true,
					selectAll: true,
					selectionLimit: 200,
					type: "ResponsiveTable",
					calculateWidthIncludingColumnHeader: {}
				},
				targetEntities: {
					entityType: {
						mTargetEntities: {},
						sForceLinkRendering: "{}"
					}
				},
				"filterSettings": oDefaultFilterSettings
			};

			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, {}, this.Device, this.sEntitySet, {}, {});

			assert.deepEqual(oResult, oExpectedSettings, "fetches correct templateSpecificParameters");
		});

		QUnit.test("getTemplateSpecificParameters when navigationProperties is an empty array under filter settings", function (assert) {
			//Arrange
			var oSettings = {
				filterSettings: {
					navigationProperties: []
				}
			};

			var oExpectedFilterSettings = {
				navigationProperties: "",
				useProvidedNavigationProperties: true
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
			//Assert
			assert.deepEqual(oResult.filterSettings, oExpectedFilterSettings, "'navigationProperties' should be an empty string in the output");
		});

		QUnit.test("getTemplateSpecificParameters when navigationProperties are specified under filter settings", function (assert) {
			//Arrange
			var oSettings = {
				filterSettings: {
					navigationProperties: ["to_Currency", "to_BillingStatus"]
				}
			};

			var oExpectedFilterSettings = {
				navigationProperties: "to_Currency,to_BillingStatus",
				useProvidedNavigationProperties: true
			};
			//Act
			var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
			//Assert
			assert.deepEqual(oResult.filterSettings, oExpectedFilterSettings, "'navigationProperties' should contain the comma separated list of navigation properties");
		});
	});
