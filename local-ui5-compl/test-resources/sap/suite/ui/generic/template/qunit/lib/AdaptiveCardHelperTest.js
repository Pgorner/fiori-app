/**
 * QUnit tests for the sap.suite.ui.generic.template.lib.AdaptiveCardHelper
 */
sap.ui.define([
    'testUtils/sinonEnhanced',
    "sap/suite/ui/generic/template/genericUtilities/testableHelper",
    "sap/suite/ui/generic/template/lib/AdaptiveCardHelper",
    "sap/suite/ui/generic/template/genericUtilities/AjaxHelper",
    "sap/ui/model/json/JSONModel"
], function(sinon, testableHelper, AdaptiveCardHelper, AjaxHelper, JSONModel) {
    'use strict';

	var oAppRegistryEntry;
	var oStaticStub;
	var oStubForPrivate;
	var oSandbox;
    var oView = {
		byId: function () {
			return {
				focus: Function.prototype,
				setBeforePressHandler: Function.prototype
			}
		},
		hasStyleClass: Function.prototype
	};
    var component = {
        getModel: function() {
            return {
                getSmartVariantManagement: Function.prototype,
				getIsLeaf: Function.prototype,
                getMetaModel: function() {
                    return {
                        getODataEntitySet: function() {
                            return {
                                entityType: "HeaderInfo"
                            }
                        },
                        getODataEntityType: function() {
                            return {
                                property: [
                                    {
                                        name: "appTitle"
                                    },
                                    {
                                        name: "objectTitle"
                                    },
                                    {
                                        name: "objectSubtitle"
                                    },
                                    {
                                        name: "url"
                                    }
                                ]
                            }
                        },
                        getODataProperty: Function.prototype
                    };
                },
                setProperty: Function.prototype,
                getProperty: Function.prototype
            }
        },
        getObjectPageHeaderType: function() {
            return "Dynamic";
        },
        getManifestEntry: function(entry) {
            switch (entry) {
                case "sap.app":
                    return {
                        dataSources: {
                            mainService: {
                                uri: "/sap/opu/odata/sap/ZMM_MATERIAL_SRV/"
                            }
                        }
                    }
                default:
                    return;
            }
        }
    }
    var oController = {
		getView: sinon.stub().returns(oView),
		onSaveAsTileExtension: function () { },
		byId: function (sId) {
			switch (sId) {
				case "template::SmartFilterBar":
					return oSmartFilterBar;
				case "template::Page":
					return {
						getHeader: Function.prototype,
						getTitle: Function.prototype
					};
				case "template::VisualFilterBar":
					return {
						setEntitySet: Function.prototype,
						setSmartFilterId: Function.prototype,
						attachOnFilterItemAdded: Function.prototype,
						setSmartFilterContext: Function.prototype,
						attachFilterChange: Function.prototype,
						addEventDelegate: Function.prototype,
						attachInitialized: Function.prototype
					};
				case "template::FilterText":
					return {
						attachBrowserEvent: Function.prototype
					};
				default:
					return;
			}
		},
		getOwnerComponent: function () {
			return {
				getSmartVariantManagement: Function.prototype,
				getIsLeaf: Function.prototype,
				getModel: function () {
					return component.getModel();
				},
				getHideVisualFilter: Function.prototype,
				getDefaultFilterMode: Function.prototype,
				getDefaultContentView: Function.prototype,
				getAutoHide: Function.prototype,
				getQuickVariantSelectionX: Function.prototype,
				getProperty: Function.prototype,
				getShowGoButtonOnFilterBar: Function.prototype,
				getEntitySet: Function.prototype,
				getRefreshIntervalInMinutes: Function.prototype,
				getFilterSettings: Function.prototype,
                getAppComponent: function(){
					return component;
				},
                getComponentContainer: function(){
                    return {
                        getElementBinding: function(){
                            var sPath = "/ProductSet('HT-1000')";
                            return {
                                getPath: function(){
                                    return sPath;
                                },
                                sPath: sPath,
                                mParameters: {
                                    expand: "to_ProductText",
                                }
                            };
                        }
                    };
                }
			}
		},
        getView: function() {
			return {
                setModel: Function.prototype,
                getModel: function () {
                    return {
                        getProperty: Function.prototype,
                        getResourceBundle: function() {
                            return {
                                getText: function() {
                                    return "Title";
                                }
                            }
                        }
                    }
                }
            }
		},
		onAfterCustomModelCreation: Function.prototype,
	};


    function fnGeneralSetup(){
		oStubForPrivate = testableHelper.startTest();
		oStaticStub = testableHelper.getStaticStub();
		oSandbox = sinon.sandbox.create();
	}

	function fnGeneralTeardown(){
			oAppRegistryEntry = null;
			oSandbox.restore();
			testableHelper.endTest();
	}
    
    QUnit.module('AdaptiveCardHelper', {
        setup: fnGeneralSetup,
        teardown: fnGeneralTeardown
    });

    QUnit.test("Shall be instantiable", function(assert) {
        var oAdaptiveCardJson = AdaptiveCardHelper.createAdaptiveCard("HeaderInfo", {
            "appTitle": "Title",
            "objectTitle": "Subtitle",
            "objectSubtitle": "Text",
            "url": "https://www.host.com",
            "controller": oController,
            "component":oController.getOwnerComponent()

        });
        assert.ok(oAdaptiveCardJson, "AdaptiveCardHelper should be defined");
    });

    QUnit.test("Shall not be instantiable", function(assert) {
        var oAdaptiveCardJson = AdaptiveCardHelper.createAdaptiveCard("SomethingElse", {});
        assert.equal(oAdaptiveCardJson, undefined, "AdaptiveCardHelper should not be defined");
    });
    
});
