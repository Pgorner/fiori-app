/*global QUnit*/

sap.ui.define([
    "sap/base/util/isEmptyObject",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/ODataUtils",
    "sap/ui/core/UIComponent",
    "sap/ovp/cards/PersonalizationUtils",
    "sap/ui/core/mvc/View",
    "sap/ui/core/mvc/ViewType",
    "sap/ui/core/Component",
    "sap/m/Button",
    "sap/fe/navigation/SelectionVariant",
    "sap/fe/navigation/library",
    "sap/ovp/cards/generic/Component",
    "sap/ovp/placeholder/placeholderHelper",
    "sap/m/NavContainer",
    "sap/ui/model/Filter"
], function (
    isEmptyObject,
    Device,
    JSONModel,
    Controller,
    ODataUtils,
    UIComponent,
    PersonalizationUtils,
    View,
    ViewType,
    CoreComponent,
    Button,
    SelectionVariant,
    FENavLibrary,
    OvpCardComponent,
    placeholderHelper,
    NavContainer,
    Filter
) {
    "use strict";

    var oController;
    function _mockGlobalFilter() {
        var globalFilter = {
            isFilterLoaded: false,
            variantId: undefined,
            hasRequiredFields: false,
            attachInitialized: sinon.spy(),
            attachSearch: sinon.spy(),
            attachFilterChange: sinon.spy(),
            attachFiltersDialogClosed: sinon.spy(),
            setVisible: sinon.spy(),
            addFieldToAdvancedArea: sinon.spy(),
            clearVariantSelection: sinon.spy(),
            clear: sinon.spy(),
            setUiState: sinon.spy(),
            isDialogOpen: function () {
                return false;
            },
            getCurrentVariantId: function () {
                return this.variantId;
            },
            search: function () {
                return !this.hasRequiredFields;
            },
            getVariantManagement: function () {
                return null;
            },
            validateMandatoryFields: function () {
                return !this.hasRequiredFields;
            },
            determineMandatoryFilterItems: function () {
                return [];
            },
            _checkForValues: function () {
                return false;
            },
            getFilterData: function () {
                return {};
            },
            isCurrentVariantStandard: function () {
                return true;
            },
            isCurrentVariantExecuteOnSelectEnabled: function() {
                return true;
            },
            getSmartVariant: function () {
                return {
                    setExecuteOnStandard: function (param) { },
                    getExecuteOnStandard: function () {
                        return true;
                    },
                };
            },
            getFiltersWithValues: function () {
                return [{}, {}];
            }
        };
        var getGlobalFilterStub = sinon.stub(oController, "getGlobalFilter");
        getGlobalFilterStub.returns(globalFilter);
    
        return globalFilter;
    }

    QUnit.module("sap.ovp.app.Main", {
        beforeEach: function () {
            return Controller.create({
                name: "sap.ovp.app.Main"
            }).then(function(controller) { 
                oController = controller;
                oController.oLoadedComponents = {};
            }); 
        },
        afterEach: function () { },
    });
    QUnit.test("applyFiltersForCustomCards - setRelevantFilters API is called for custom card", function (assert) {
        oController.oGlobalFilter = true;
        oController.oCards = [
            {
                "model": "CATALOG_MODEL_V2",
                "template": "bookshop.ext.simpleV2CustomCard",
                "id": "card201"
            }
        ];
        oController.getView = function () {
            return {
                getId: function () {
                    return "application-browse-books-component---mainView";
                }
            }
        }
        var oViewStub = {
            getModel: sinon.stub(),
            getComponentInstance: sinon.stub().returns({
                getRootControl: sinon.stub().returns({
                    getController: sinon.stub().returns({
                        setRelevantFilters: sinon.stub()
                    })
                })
            })
        };
        var oModelStub = {
            getMetaModel: sinon.stub().returns({
                getODataEntitySet: sinon.stub().returns({
                    "Org.OData.Capabilities.V1.SearchRestrictions": {
                        Searchable: {
                            Bool: "true"
                        }
                    }
                })
            })
        };
        oController.byId = function () {
            return oViewStub;
        }
        oViewStub.getModel.withArgs("CATALOG_MODEL_V2").returns(oModelStub);
        var oExpectedFilterData = new Filter();

        oController.applyFiltersForCustomCards();
        assert.ok(oViewStub.getComponentInstance().getRootControl().getController().setRelevantFilters.calledOnce, "setRelevantFilters API is called for custom card");
        assert.deepEqual(oViewStub.getComponentInstance().getRootControl().getController().setRelevantFilters.getCall(0).args[0], oExpectedFilterData, "Filter data passed to setRelevantFilters matches expected filter data");
    });
    QUnit.test("updateFilterProperties function test", function(assert) {
        var sSelectProperties = "ID,amount";
        var aProperties = [
            
            {
                "name": "ID",
                "type": "Edm.Int32",
                "nullable": "false",
                "com.sap.vocabularies.Common.v1.Label": {
                    "String": "ID"
                },
                "com.sap.vocabularies.Common.v1.ValueListWithFixedValues": {
                    "Bool": "true"
                }
            },
            {
                "name": "amount",
                "type": "Edm.Int32",
                "com.sap.vocabularies.Analytics.v1.Measure": {
                    "Bool": "true"
                },
                "Org.OData.Measures.V1.ISOCurrency": {
                    "Path": "code"
                }
            },
            {
                "name": "DeliveryCalendarYearWeek",
                "type": "Edm.String",
                "com.sap.vocabularies.Analytics.v1.Dimension": {
                    "Bool": "true"
                },
                "com.sap.vocabularies.Common.v1.IsCalendarYearWeek": {
                    "Bool": "true"
                }
            }
        ];
        var expectedFilteredProperties = [
            {
                "name": "ID",
                "type": "Edm.Int32",
                "nullable": "false",
                "com.sap.vocabularies.Common.v1.Label": {
                    "String": "ID"
                },
                "com.sap.vocabularies.Common.v1.ValueListWithFixedValues": {
                    "Bool": "true"
                }
            },
            {
                "name": "amount",
                "type": "Edm.Int32",
                "com.sap.vocabularies.Analytics.v1.Measure": {
                    "Bool": "true"
                },
                "Org.OData.Measures.V1.ISOCurrency": {
                    "Path": "code"
                }
            }
        ];
        var result = oController.updateFilterProperties(sSelectProperties, aProperties);
        assert.deepEqual(result, expectedFilteredProperties, "Filtered properties match expected result");
    });
    QUnit.test("updateFilterFormed function - with basic search value", function(assert) {
        var oFilterData = [];
        var sBasicSearchValue = "Wuthering";
        var aProperties = [
            {
                "name": "ID",
                "type": "Edm.Int32",
                "nullable": "false",
                "com.sap.vocabularies.Common.v1.Label": {
                    "String": "ID"
                },
                "com.sap.vocabularies.Common.v1.ValueListWithFixedValues": {
                    "Bool": "true"
                }
            },
            {
                "name": "title",
                "type": "Edm.String",
                "com.sap.vocabularies.Analytics.v1.Dimension": {
                    "Bool": "true"
                },
                "com.sap.vocabularies.Common.v1.Label": {
                    "String": "Title"
                },
                "com.sap.vocabularies.Common.v1.Text": {
                    "Path": "title"
                }
            }
        ];

        var result = oController.updateFilterFormed(oFilterData, sBasicSearchValue, aProperties);
    
        assert.ok(result.aFilters.length === 1, "Result length matched");
        assert.equal(result.aFilters[0].oValue1, "Wuthering", "Wuthering is filtered for card");
        assert.equal(result.aFilters[0].sOperator, "Contains", "Operator used for basic search is contains");
    });
    
    QUnit.test("view switch breakout test", function (assert) {
        var aCard = {
            id: "card008",
            model: "purchaseOrder",
            template: "sap.ovp.cards.list",
            settings: {
                title: "Overdue Purchase Orders",
                annotationPath: undefined,
                baseUrl: "../../../../../sap/ovp/demo",
                dataPointAnnotationPath: undefined,
                dynamicSubtitleAnnotationPath: undefined,
                entitySet: "Zme_Overdue",
                headerAnnotationPath: undefined,
                identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification",
                imageSupported: true,
                kpiAnnotationPath: undefined,
                listType: "condensed",
                params: undefined,
                presentationAnnotationPath: undefined,
                selectedKey: 2,
                selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#iconD",
                selectionPresentationAnnotationPath: undefined,
                sortBy: "OverdueTime",
                subTitle: "Condensed standard list card with view Switch",
                tabs: [
                    {
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#imageD",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#item2",
                        value: "sap"
                    },
                    {
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#blankD",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification",
                        value: "ABC"
                    }
                ]
            }
        };
        oController._getCardFromManifest = function () {
            return aCard;
        };
        oController._getOriginalCardDescriptorById = function () {
            return null;
        };
        var aOrderedCards = [{
            id: "card008",
            selectedKey: 2,
            visibility: true,
        }];
        this.uiModel = new JSONModel({});
        this.uiModel.setProperty("/aOrderedCards", aOrderedCards);
        var oViewStub = {
            getModel: this.stub().withArgs("ui").returns(this.uiModel)
        };
        oController.getView = this.stub().returns(oViewStub);
        oController.getGlobalFilter = function () {
            return {
                getUiState: function () {
                    return {
                        getSelectionVariant: function () {
                            return {
                                SupplierName: "sap"
                            };
                        }
                    };
                }
            };
        };
        oController.onBeforeRebindPageExtension = function (oCards, oSelectionVariant) {
            var oFilterList = oSelectionVariant;
            var oTabIndexList = {};
            if (oCards && oCards.length > 0) {
                for (var i = 0; i < oCards.length; i++) {
                    if (oCards[i].id == "card008") {
                        if (oFilterList && oFilterList.hasOwnProperty("SupplierName")) {
                            if (oFilterList.SupplierName == "sap") {
                                oTabIndexList["card008"] = 1;
                            } else if (oFilterList.SupplierName == "ABC") {
                                oTabIndexList["card008"] = 2;
                            }
                        }
                    }
                }
            }
            this.setTabIndex(oTabIndexList);
        };
        oController.recreateCard = function () { };
        oController.changeViewSwitchForVisibleCard();
        assert.ok(oController.getTabIndex().card008 == 1, "tabindex is updated as per filter in breakout");
        var aOrderedCards = oController.getView().getModel("ui").getProperty("/aOrderedCards");
        assert.ok(aOrderedCards[0].selectedKey == 1, "aOrderedCards selectedKey is updated as per current view switch");
    });

    QUnit.test("onRequestCompleted and getCustomMessage function test - without custom message in extension function", function (assert) {
        var oVal = {
            d: {
                results: []
            }
        };
        var oResponse = {
            getParameters: function () {
                return {
                    success: true,
                    response: {
                        responseText: JSON.stringify(oVal)
                    }
                };
            },
            getSource: function () {
                return {
                    sServiceUrl: ""
                };
            }
        };
        oController.oCardsModels = {};
        oController.getView = function () {
            return {
                byId: function () {
                    return null;
                },
                getModel: function () {
                    return new JSONModel({
                        aOrderedCards: [
                            {
                                id: "card008",
                                selectedKey: 2,
                                visibility: true
                            }
                        ]
                    });
                }
            };
        };
        oController.onRequestCompleted(oResponse);
        (oController.getCustomMessage = function (oResponse) { }),
            (oController.verifyAndSetErrorCard = function () { });
        var sMessage = oController.getCustomMessage();
        assert.ok(sMessage == undefined, "Custom message should be undefined");
    });

    QUnit.test("onRequestCompleted and getCustomMessage function test - with custom no data message and icon in extension function", function (assert) {
        var oVal = {
            d: {
                results: []
            }
        };
        var oResponse = {
            getParameters: function () {
                return {
                    success: true,
                    response: {
                        responseText: JSON.stringify(oVal)
                    }
                };
            },
            getSource: function () {
                return {
                    sServiceUrl: ""
                };
            }
        };
        oController.oCardsModels = {};
        oController.getView = function () {
            return {
                byId: function () {
                    return null;
                },
                getModel: function () {
                    return new JSONModel({
                        aOrderedCards: [
                            {
                                id: "card008",
                                selectedKey: 2,
                                visibility: true
                            }
                        ]
                    });
                }
            };
        };
        oController.onRequestCompleted(oResponse);
        (oController.getCustomMessage = function (oResponse) {
            return {
                sMessage: "My Custom Message for No Data",
                sIcon: "sap-icon://message-information"
            };
        }),
            (oController.verifyAndSetErrorCard = function () { });
        var oMessage = oController.getCustomMessage();
        assert.ok(oMessage.sMessage == "My Custom Message for No Data", "Custom message for no data case");
        assert.ok(oMessage.sIcon == "sap-icon://message-information", "Custom icon for no data and error case");
    });

    QUnit.test("onRequestCompleted and getCustomMessage function test - with custom error message in extension function", function (assert) {
        var oVal = {
            d: {
                results: [],
            },
        };
        var oResponse = {
            getParameters: function () {
                return {
                    success: true,
                    response: {
                        responseText: JSON.stringify(oVal),
                    },
                };
            },
            getSource: function () {
                return {
                    sServiceUrl: "",
                };
            },
        };
        oController.oCardsModels = {};
        oController.getView = function () {
            return {
                byId: function () {
                    return null;
                },
                getModel: function () {
                    return new JSONModel({
                        aOrderedCards: [
                            {
                                id: "card008",
                                selectedKey: 2,
                                visibility: true,
                            },
                        ],
                    });
                },
            };
        };
        oController.onRequestCompleted(oResponse);
        (oController.getCustomMessage = function (oResponse) {
            return {
                sMessage: "My Custom Message for Error",
            };
        }),
            (oController.verifyAndSetErrorCard = function () { });
        var oMessage = oController.getCustomMessage();
        assert.ok(oMessage.sMessage == "My Custom Message for Error", "Custom message for error case");
    });

    QUnit.test("Read with no filters", function (assert) {
        var fnRead = sinon.spy();
        oController.oCardsModels = {
            model1: {
                refresh: function () {
                    this.read();
                },
                read: fnRead,
            },
        };

        oController.getView = function () {
            return {
                byId: function (str) {
                    if (str === "ovpMain") {
                        return {
                            getHeaderExpanded: function () {
                                return true;
                            },
                        };
                    }
                    return "ovpGlobalFilterID";
                },
                getModel: function () {
                    return {
                        getProperty: function () {
                            return false;
                        },
                    };
                },
            };
        };

        oController.getLayout = function () {
            return {
                setActive: function () { },
            };
        };

        var eventbusStub = sinon.spy();
        oController.globalEventBus = {
            publish: eventbusStub,
        };

        var getGlobalFilterStub = sinon.stub(oController, "getGlobalFilter");
        getGlobalFilterStub.returns({
            getFilters: function () {
                return [{ _bMultiFilter: true, aFilters: [{ sPath: "filterField1" }] }];
            },
            getAllFilterItems: function () {
                return [
                    {
                        name: "filterField1",
                        getName: function () {
                            return name;
                        },
                    },
                ];
            },
            getConsiderAnalyticalParameters: function () {
                return false;
            },
            getAnalyticBindingPath: function () {
                return "entityPath1";
            },
            getEntityType: function () {
                return "GlobalFilters";
            },
            getModel: function (sName) {
                if (sName === 'ui') {
                    return {
                        getProperty: function() {
                            return "GlobalFilters";
                        }
                    };
                }
                return {};
            },
            validateMandatoryFields: function () {
                return true;
            },
            isDialogOpen: function () {
                return false;
            },
            getLiveMode: function () {
                return false;
            },
        });
        var getMacroFilterStub = sinon.stub(oController, "getMacroFilterBar");
        getMacroFilterStub.returns({
            getConditions: function () {
                return {};
            },
        });

        oController.oGlobalFilter = {
            _aFields: {},
            _aFilterBarViewMetadata: {},
        };

        oController.onGlobalFilterSearch();
        assert.ok(eventbusStub.callCount === 0, "Event shhould not be fired if there is no change");
        assert.ok(fnRead.callCount === 0, "Read should not be called if no change in the filters");
        oController.onGlobalFilterChange();
        oController.onGlobalFilterSearch();
        assert.ok(fnRead.calledOnce === true, "Read should be called when changing the filters");
        assert.ok(eventbusStub.calledOnce === true, "Event shhould  be fired if there is  change");
    });
    QUnit.test("Read is overridden", function (assert) {
        var fnRead = sinon.spy();
        var readArgs = [
            "/somepath",
            { error: "", groupId: "", success: "", urlParameters: ["_requestFrom=ovp_internal"], withCredentials: "" },
        ];
        var getGlobalFilterStub = sinon.stub(oController, "getGlobalFilter");

        oController.getLayout = function () {
            return {
                setActive: function () { },
            };
        };
        var eventbusStub = sinon.spy();
        oController.globalEventBus = {
            publish: eventbusStub,
        };

        getGlobalFilterStub.returns({
            getFilters: function () {
                return [{ _bMultiFilter: true, aFilters: [{ sPath: "filterField1" }] }];
            },
            getAllFilterItems: function () {
                return [
                    {
                        name: "filterField1",
                        getName: function () {
                            return name;
                        },
                    },
                ];
            },
            getConsiderAnalyticalParameters: function () {
                return false;
            },
            getAnalyticBindingPath: function () {
                return "entityPath1";
            },
            getEntityType: function () {
                return "GlobalFilters";
            },
            getModel: function (sName) {
                if (sName === 'ui') {
                    return {
                        getProperty: function() {
                            return "GlobalFilters";
                        }
                    };
                }
                return {};
            },
            isDialogOpen: function () {
                return false;
            },
            getParameters: function () {
                return { custom: { search: "searchField1" } };
            },
            getLiveMode: function () {
                return false;
            },
            getFilterData: function () {
                return {};
            },
        });
        oController._getEntityTypeFromPath = function () {
            return { property: [{ name: "filterField1" }, { name: "filterField2" }] };
        };
        oController.getView = function () {
            return {
                getModel: function (modelName) {
                    if (modelName === "ui") {
                        return new JSONModel({
                            refreshIntervalInMinutes: "1.2",
                            cards: { card1: { model: "model1" } },
                        });
                    } else {
                        return {
                            refresh: function () {
                                this.read.apply(this, readArgs);
                            },
                            read: fnRead,
                            setUseBatch: function () { },
                            getMetaModel: function () {
                                return {
                                    getODataEntityType: function () { },
                                };
                            },
                        };
                    }
                },
                byId: function (arg) {
                    if (arg) {
                        if (arg === "card00" || arg === "card01" || arg === "card02") {
                            return {
                                getComponentInstance: function () {
                                    return false;
                                },
                                setHeaderExpanded: function () {
                                    return true;
                                },
                            };
                        } else if (arg === "ovpMain" || arg === "ovpErrorPage") {
                            return {
                                setVisible: function (value) {
                                    return value;
                                },
                            };
                        }
                    } else {
                        return false;
                    }
                },
            };
        };
        oController.oCardsModels = {};
        oController.oLoadedComponents = {};
        oController.errorHandlingObject = {
            atLeastOneRequestSuccess: false,
            errorLoadingTimeout: {},
        };
        sinon.stub(oController, "_checkMandatoryParams").returns(true);
        oController._initCardModel("model1");
        assert.ok(fnRead != oController.oCardsModels["model1"].read, "Read should be overridden");
        oController.onGlobalFilterSearch();
        assert.ok(fnRead.callCount === 0, "Read should not be called if no change in the filters");
        assert.ok(oController._processSearch() === "search=searchField1", "Search is successful");

        sinon.stub(oController, "_getEntitySetFromEntityType").callsFake(function () {
            return {
                entityType: "somepathType",
                name: "somepath",
                "sap:searchable": "true",
            };
        });

        oController.oGlobalFilter = {
            _aFields: {},
            _aFilterBarViewMetadata: {},
        };

        //first scenario - only global filter is defined
        oController.onGlobalFilterChange();
        oController.onGlobalFilterSearch();
        assert.ok(fnRead.calledOnce === true, "Read should be called when changing the filters");
        var args = fnRead.getCall(0).args;
        assert.deepEqual(args[0], "/somepath", "read first arguments should be the path");
        assert.deepEqual(args[1].filters.length, 1, "read first arguments should be the path");

        //second scenario - global filter is defined in addition to card internal filter
        var createFilterParamsStub = sinon.stub(ODataUtils, "createFilterParams").returns("$filter=someotherFilter");

        readArgs[1] = { urlParameters: ["$filter=somefilter"] };
        oController.onGlobalFilterChange();
        oController.onGlobalFilterSearch();
        sinon.assert.callCount(fnRead, 2);
        var args = fnRead.getCall(1).args;
        assert.deepEqual(args[0], "/somepath", "read first arguments should be the path");
        assert.deepEqual(args[1].filters, undefined, "read first arguments should be the path");
        assert.deepEqual(
            args[1].urlParameters[0],
            "$filter=somefilter",
            "read first arguments should be the path"
        );

        oController.nRefreshInterval = "72000";
        oController.oModelRefreshTimestamp = { model1: new Date().getTime() };
        assert.raises(function () {
            fnRead.args[0][1].success();
        }, Error, "Throws an exception that it cannot apply to undefined since the success is not real");
        assert.ok(oController.oRefreshTimer, "refresh timer is set");
        createFilterParamsStub.restore();
    });

    QUnit.test("Test _removeFilter function", function (assert) {
        // All test for cardFilter
        var sFilterParams = "Supplier_Name%20eq%20%27sap%27";
        var sFilterName = "CurrencyCode";
        var sResult = "Supplier_Name%20eq%20%27sap%27";
        assert.ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "cardFilter ---> Case where sFilterName is not found in sFilterParams");

        sFilterParams = "CurrencyCode%20eq%20%27INR%27";
        sResult = "";
        assert.ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "cardFilter ---> Case where sFilterName is the only filter present in sFilterParams");

        sFilterParams = "CurrencyCode%20eq%20%27INR%27%20and%20Supplier_Name%20eq%20%27sap%27";
        sResult = "Supplier_Name%20eq%20%27sap%27";
        assert.ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "cardFilter ---> Case where sFilterName is the first filter in sFilterParams");

        sFilterParams = "Supplier_Name%20eq%20%27sap%27%20and%20CurrencyCode%20eq%20%27INR%27";
        assert.ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "cardFilter ---> Case where sFilterName is the last filter in sFilterParams");

        sFilterParams = "Supplier_Name%20eq%20%27sap%27%20and%20(CurrencyCode%20eq%20%27INR%27%20or%20CurrencyCode%20eq%20%27EUR%27)%20and%20NetAmount%20eq%20100000m";
        sResult = "Supplier_Name%20eq%20%27sap%27%20and%20NetAmount%20eq%20100000m";
        assert.ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "cardFilter ---> Case where sFilterName is present in between other filters in sFilterParams");

        // All test for globalFilter
        sFilterParams = "$filter=(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)";
        sResult = "$filter=(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)";
        assert.ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "globalFilter ---> Case where sFilterName is not found in sFilterParams");

        sFilterParams = "$filter=CurrencyCode%20eq%20%27AUR%27";
        sResult = "$filter=";
        assert.ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "globalFilter ---> Case where sFilterName is the only filter present in sFilterParams");

        sFilterParams = "$filter=(CurrencyCode%20eq%20%27EUR%27%20or%20CurrencyCode%20eq%20%27INR%27%20or%20CurrencyCode%20eq%20%27AUR%27)%20and%20((SalesOrderID%20ge%20%270500000005%27%20and%20SalesOrderID%20le%20%270500000009%27)%20or%20(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27))";
        sResult = "$filter=((SalesOrderID%20ge%20%270500000005%27%20and%20SalesOrderID%20le%20%270500000009%27)%20or%20(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27))";
        assert.ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "globalFilter ---> Case where sFilterName is the first filter in sFilterParams");

        sFilterParams = "$filter=((SalesOrderID%20ge%20%270500000005%27%20and%20SalesOrderID%20le%20%270500000009%27)%20or%20(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27))%20and%20(CurrencyCode%20eq%20%27EUR%27%20or%20CurrencyCode%20eq%20%27INR%27%20or%20CurrencyCode%20eq%20%27AUR%27)";
        sResult = "$filter=((SalesOrderID%20ge%20%270500000005%27%20and%20SalesOrderID%20le%20%270500000009%27)%20or%20(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27))";
        assert.ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "globalFilter ---> Case where sFilterName is the last filter in sFilterParams");

        sFilterParams = "$filter=(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)%20and%20CurrencyCode%20eq%20%27AUR%27%20and%20(NetAmount%20ge%201m%20and%20NetAmount%20le%2010000m)";
        sResult = "$filter=(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)%20and%20(NetAmount%20ge%201m%20and%20NetAmount%20le%2010000m)";
        assert.ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "globalFilter ---> Case where sFilterName is present in between other filters in sFilterParams");
    });

    QUnit.test("Test _removeRelevantFilter function", function (assert) {
        var oResult;
        var aRelevantFilters;
        var sCardFilter = "CurrencyCode";
        assert.ok(!oController._removeRelevantFilter(aRelevantFilters, sCardFilter), "If aRelevantFilters is not defined");

        aRelevantFilters = [];
        oResult = [];
        assert.ok(
            JSON.stringify(oController._removeRelevantFilter(aRelevantFilters, sCardFilter)) ===
            JSON.stringify(oResult),
            "If aRelevantFilters is an empty array"
        );

        aRelevantFilters = JSON.parse(
            '[{"aFilters":[{"sPath":"CurrencyCode","sOperator":"EQ","oValue1":"INR","_bMultiFilter":false}],"bAnd":false,"_bMultiFilter":true}]'
        );
        oResult = undefined;
        assert.ok(
            JSON.stringify(oController._removeRelevantFilter(aRelevantFilters, sCardFilter)) === oResult,
            "If aRelevantFilters has only one filter named sCardFilter"
        );

        aRelevantFilters = JSON.parse(
            '[{"aFilters":[{"aFilters":[{"sPath":"Supplier_Name","sOperator":"EQ","oValue1":"sap","_bMultiFilter":false}],"bAnd":false,"_bMultiFilter":true},{"aFilters":[{"sPath":"CurrencyCode","sOperator":"EQ","oValue1":"EUR","_bMultiFilter":false},{"sPath":"CurrencyCode","sOperator":"EQ","oValue1":"INR","_bMultiFilter":false},{"sPath":"CurrencyCode","sOperator":"EQ","oValue1":"USD","_bMultiFilter":false}],"bAnd":false,"_bMultiFilter":true}],"bAnd":true,"_bMultiFilter":true}]'
        );
        oResult = '[{"aFilters":[{"aFilters":[{"sPath":"Supplier_Name","sOperator":"EQ","oValue1":"sap","_bMultiFilter":false}],"bAnd":false,"_bMultiFilter":true}],"bAnd":true,"_bMultiFilter":true}]';
        assert.ok(
            JSON.stringify(oController._removeRelevantFilter(aRelevantFilters, sCardFilter)) === oResult,
            "If aRelevantFilters has combination of filters"
        );
    });

    QUnit.test("Test _getFilterPreference function", function (assert) {
        var oCard = {
            id: "card_1",
            settings: {},
        };
        var getCardFromManifestStub = sinon.stub(oController, "_getCardFromManifest");
        getCardFromManifestStub.returns(oCard);
        assert.ok(!oController._getFilterPreference("card_1"), "If Card has no Filter Preference");

        oCard.settings = {
            mFilterPreference: "Outside tab level",
        };
        assert.ok(oController._getFilterPreference("card_1") === "Outside tab level", "If Card has Filter Preference Outside tab level");

        oCard.settings["tabs"] = [{
            mFilterPreference: "Inside tab level -> First tab",
        }];
        assert.ok(oController._getFilterPreference("card_1") === "Inside tab level -> First tab", "If Card has Filter Preference Inside tab level -> First tab");

        oCard.settings.selectedKey = 2;
        oCard.settings.tabs.push({
            mFilterPreference: "Inside tab level -> Second tab",
        });
        assert.ok(oController._getFilterPreference("card_1") === "Inside tab level -> Second tab", "If Card has Filter Preference Inside tab level -> Second tab");
        getCardFromManifestStub.restore();
    });

    QUnit.test("Test _getFilterPreferenceFromUrlParams function", function (assert) {
        var oParameters = {};
        var getFilterPreferenceStub = sinon.stub(oController, "_getFilterPreference");
        getFilterPreferenceStub.returns({});
        assert.ok(!oController._getFilterPreferenceFromUrlParams(oParameters), "If there are no url parameters");

        oParameters = {
            urlParameters: [],
        };
        assert.ok(!oController._getFilterPreferenceFromUrlParams(oParameters), "If url parameters are empty");

        oParameters = {
            urlParameters: ["cardId=card_1"],
        };
        oController._getFilterPreferenceFromUrlParams(oParameters);
        assert.ok(JSON.stringify(oParameters.urlParameters) === JSON.stringify([]), "If url parameters has only one custom card id parameter");

        oParameters = {
            urlParameters: ["$filter=lol", "$expand=lol,bol&cardId=card_1"],
        };
        oController._getFilterPreferenceFromUrlParams(oParameters);
        assert.ok(
            JSON.stringify(oParameters.urlParameters) === JSON.stringify(["$filter=lol", "$expand=lol,bol"]),
            "If url parameters has many parameters"
        );
        getFilterPreferenceStub.restore();
    });

    QUnit.test("Test _addRelevantFilters function", function (assert) {
        var oModel = {
            oMetadata: null,
        };
        var oParameters = {
            urlParameters: ["$filter=someOtherFilter"],
        };
        var mFilterPreference = {
            filterAll: "card",
        };
        var createFilterParamsStub = sinon.stub(ODataUtils, "createFilterParams");
        var oResult = {
            urlParameters: ["$filter=someOtherFilter"],
        };
        createFilterParamsStub.returns("$filter=someotherFilter");
        oController.aRelevantFilters = ["lol"];
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        assert.ok(JSON.stringify(oParameters) === JSON.stringify(oResult), "There are relevant global filters ---> Filter preference ---> All card level filters");

        mFilterPreference.filterAll = "global";
        createFilterParamsStub.returns("$filter=newFilter");
        oResult = {
            urlParameters: ["$filter=newFilter"],
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        assert.ok(JSON.stringify(oParameters) === JSON.stringify(oResult), "There are relevant global filters ---> Filter preference ---> All global level filters");

        oParameters.urlParameters = ["$filter=CurrencyCode%20eq%20%27AUR%27"];
        delete mFilterPreference.filterAll;
        mFilterPreference.cardFilter = ["CurrencyCode"];
        mFilterPreference.globalFilter = ["CurrencyCode"];
        createFilterParamsStub.returns("$filter=CurrencyCode%20eq%20%27EUR%27");
        oResult = {
            urlParameters: [],
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        assert.ok(
            JSON.stringify(oParameters) === JSON.stringify(oResult),
            "There are relevant global filters ---> Filter preference ---> Both card or global level filters ---> Case where there are no filters to apply"
        );

        oParameters.urlParameters = [
            "$filter=(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)%20and%20CurrencyCode%20eq%20%27AUR%27%20and%20(NetAmount%20ge%201m%20and%20NetAmount%20le%2010000m)",
        ];
        createFilterParamsStub.returns("$filter=CurrencyCode%20eq%20%27EUR%27");
        oResult = {
            urlParameters: [
                "$filter=(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)%20and%20(NetAmount%20ge%201m%20and%20NetAmount%20le%2010000m)",
            ],
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        assert.ok(
            JSON.stringify(oParameters) === JSON.stringify(oResult),
            "There are relevant global filters ---> Filter preference ---> Both card or global level filters ---> Case where there no global filters"
        );

        oParameters.urlParameters = ["$filter=CurrencyCode%20eq%20%27EUR%27"];
        createFilterParamsStub.returns(
            "$filter=(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)%20and%20CurrencyCode%20eq%20%27AUR%27%20and%20(NetAmount%20ge%201m%20and%20NetAmount%20le%2010000m)"
        );
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        assert.ok(
            JSON.stringify(oParameters) === JSON.stringify(oResult),
            "There are relevant global filters ---> Filter preference ---> Both card or global level filters ---> Case where there are no card filters"
        );

        oParameters.urlParameters = [
            "$filter=Supplier_Name%20eq%20%27sap%27%20and%20CurrencyCode%20eq%20%27EUR%27",
        ];
        oResult = {
            urlParameters: [
                "$filter=(Supplier_Name%20eq%20%27sap%27)%20and%20((SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)%20and%20(NetAmount%20ge%201m%20and%20NetAmount%20le%2010000m))",
            ],
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        assert.ok(
            JSON.stringify(oParameters) === JSON.stringify(oResult),
            "There are relevant global filters ---> Filter preference ---> Both card or global level filters ---> Case where there are both card & global level filters"
        );

        oParameters.urlParameters = [
            "$filter=Supplier_Name%20eq%20%27sap%27%20and%20CurrencyCode%20eq%20%27EUR%27",
        ];
        delete mFilterPreference.cardFilter;
        delete mFilterPreference.globalFilter;
        oResult = {
            urlParameters: [
                "$filter=(Supplier_Name%20eq%20%27sap%27%20and%20CurrencyCode%20eq%20%27EUR%27)%20and%20((SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)%20and%20CurrencyCode%20eq%20%27AUR%27%20and%20(NetAmount%20ge%201m%20and%20NetAmount%20le%2010000m))",
            ],
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        assert.ok(
            JSON.stringify(oParameters) === JSON.stringify(oResult),
            "There are relevant global filters ---> Filter preference ---> Default behavior"
        );

        oParameters.urlParameters = [];
        mFilterPreference.filterAll = "card";
        oResult = {
            filters: undefined,
            urlParameters: [],
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        assert.ok(
            JSON.stringify(oParameters) === JSON.stringify(oResult),
            "There are relevant global filters ---> No card filters ---> Filter preference ---> All card level filters"
        );

        mFilterPreference.filterAll = "global";
        oResult = {
            urlParameters: [],
            filters: ["lol"],
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        assert.ok(
            JSON.stringify(oParameters) === JSON.stringify(oResult),
            "There are relevant global filters ---> No card filters ---> Filter preference ---> All global level filters"
        );

        delete mFilterPreference.filterAll;
        mFilterPreference.cardFilter = ["CurrencyCode"];
        mFilterPreference.globalFilter = ["CurrencyCode"];
        oController.aRelevantFilters = JSON.parse(
            '[{"aFilters":[{"aFilters":[{"sPath":"Supplier_Name","sOperator":"EQ","oValue1":"sap","_bMultiFilter":false}],"bAnd":false,"_bMultiFilter":true},{"aFilters":[{"sPath":"CurrencyCode","sOperator":"EQ","oValue1":"EUR","_bMultiFilter":false},{"sPath":"CurrencyCode","sOperator":"EQ","oValue1":"INR","_bMultiFilter":false},{"sPath":"CurrencyCode","sOperator":"EQ","oValue1":"USD","_bMultiFilter":false}],"bAnd":false,"_bMultiFilter":true}],"bAnd":true,"_bMultiFilter":true}]'
        );
        oResult = {
            urlParameters: [],
            filters: JSON.parse(
                '[{"aFilters":[{"aFilters":[{"sPath":"Supplier_Name","sOperator":"EQ","oValue1":"sap","_bMultiFilter":false}],"bAnd":false,"_bMultiFilter":true}],"bAnd":true,"_bMultiFilter":true}]'
            ),
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        assert.ok(
            JSON.stringify(oParameters) === JSON.stringify(oResult),
            "There are relevant global filters ---> No card filters ---> Filter preference ---> Both card or global level filters"
        );

        delete mFilterPreference.cardFilter;
        delete mFilterPreference.globalFilter;
        oResult.filters = oController.aRelevantFilters;
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        assert.ok(
            JSON.stringify(oParameters) === JSON.stringify(oResult),
            "There are relevant global filters ---> No card filters ---> Filter preference ---> Default behavior"
        );

        delete oController.aRelevantFilters;
        delete oParameters.filters;
        mFilterPreference.filterAll = "card";
        oParameters.urlParameters = ["$filter=someOtherFilter"];
        oResult = {
            urlParameters: ["$filter=someOtherFilter"],
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        assert.ok(
            JSON.stringify(oParameters) === JSON.stringify(oResult),
            "There are no relevant global filters ---> Filter preference ---> All card level filters"
        );

        mFilterPreference.filterAll = "global";
        oResult = {
            urlParameters: [],
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        assert.ok(
            JSON.stringify(oParameters) === JSON.stringify(oResult),
            "There are no relevant global filters ---> Filter preference ---> All global level filters"
        );

        delete mFilterPreference.filterAll;
        mFilterPreference.cardFilter = ["CurrencyCode"];
        mFilterPreference.globalFilter = ["CurrencyCode"];
        oParameters.urlParameters = ["$filter=CurrencyCode%20eq%20%27AUR%27"];
        oResult = {
            urlParameters: [],
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        assert.ok(
            JSON.stringify(oParameters) === JSON.stringify(oResult),
            "There are no relevant global filters ---> Filter preference ---> Global level filters ---> Containing only one global filter matching with filter preference"
        );

        oParameters.urlParameters = [
            "$filter=(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)%20and%20CurrencyCode%20eq%20%27AUR%27",
        ];
        oResult = {
            urlParameters: [
                "$filter=(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)",
            ],
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        assert.ok(
            JSON.stringify(oParameters) === JSON.stringify(oResult),
            "There are no relevant global filters ---> Filter preference ---> Global level filters ---> Combination of filters"
        );

        createFilterParamsStub.restore();
    });

    QUnit.test("Read with different relevant filters", function (assert) {
        var getGlobalFilterStub = sinon.stub(oController, "getGlobalFilter");
        getGlobalFilterStub.returns({
            getFilters: function () {
                return [{ _bMultiFilter: true, aFilters: [{ sPath: "filterField1" }] }];
            },
            getAllFilterItems: function () {
                return [
                    {
                        name: "filterField1",
                        getName: function () {
                            return name;
                        },
                    },
                ];
            },
            getConsiderAnalyticalParameters: function () {
                return false;
            },
            getAnalyticBindingPath: function () {
                return "entityPath1";
            },
            getEntityType: function () {
                return "GlobalFilters";
            },
            getModel: function (sName) {
                if (sName === 'ui') {
                    return {
                        getProperty: function() {
                            return "GlobalFilters";
                        }
                    };
                }
                return {};
            },
            validateMandatoryFields: function () {
                return true;
            },
            isDialogOpen: function () {
                return false;
            },
        });

        var relevantFilters = oController._getEntityRelevantFilters(
            { property: [{ name: "filterField1" }, { name: "filterField2" }] },
            [{ _bMultiFilter: true, aFilters: [{ sPath: "filterField1" }] }]
        );
        assert.ok(relevantFilters[0].aFilters.length === 1, "Relevant filters should be of length 1");
        relevantFilters = oController._getEntityRelevantFilters(
            { property: [{ name: "filterField1" }, { name: "filterField2" }] },
            [{ _bMultiFilter: true, aFilters: [{ sPath: "filterField1" }, { sPath: "filterField2" }] }]
        );
        assert.ok(relevantFilters[0].aFilters.length === 2, "Relevant filters should be of length 2");
    });


    QUnit.test("Store current app state and adjust URL success scenario", function (assert) {
        var selectionVariant = {
            Version: {
                Major: "1",
                Minor: "0",
                Patch: "0",
            },
            SelectionVariantID: "",
            Text: "Selection Variant with ID ",
            ODataFilterExpression: "",
            Parameters: [],
            SelectOptions: [],
        };

        var sSelectionVariant = JSON.stringify(selectionVariant);
        this.dPromise = new Promise(function (resolve, reject) {
            resolve("dummyAppStateKey");
        });
        var oCurrentAppState = {
            appStateKey: "dummyAppStateKey",
            promise: this.dPromise,
        };

        var storeInnerAppStateAsyncStub = function () {
            return oCurrentAppState;
        };
        var replaceHashStub = function () {
            return;
        };

        oController.oNavigationHandler = {
            storeInnerAppStateAsync: storeInnerAppStateAsyncStub,
            replaceHash: replaceHashStub,
        };

        var oEvent = {
            oSource: {
                _bDirtyViaDialog: false,
            },
        };

        oController._storeCurrentAppStateAndAdjustURL(oEvent);

        var oEvent = {
            oSource: {
                _bDirtyViaDialog: true,
            },
        };
        var fnDone = assert.async();
        oController._storeCurrentAppStateAndAdjustURL(oEvent);
        oController.bSFBInitialized = true;
        oController._storeCurrentAppStateAndAdjustURL(oEvent);

        setTimeout(function () {
            assert.ok(true, "iAppState Should be updated");
            fnDone();
        }.bind(this), 0);
    });

    QUnit.test("Store current app state and adjust URL failure scenario with skip", function (assert) {
        var selectionVariant = {
            Version: {
                Major: "1",
                Minor: "0",
                Patch: "0",
            },
            SelectionVariantID: "",
            Text: "Selection Variant with ID ",
            ODataFilterExpression: "",
            Parameters: [],
            SelectOptions: [],
        };
        var sSelectionVariant = JSON.stringify(selectionVariant);
        
        this.dPromise = new Promise(function (resolve, reject) {
            reject("skip");
        });
        var oCurrentAppState = {
            appStateKey: "dummyAppStateKey",
            promise: this.dPromise,
        };
        var storeInnerAppStateAsyncStub = function () {
            return oCurrentAppState;
        };
        var replaceHashStub = function () {
            return;
        };
        oController.oNavigationHandler = {
            storeInnerAppStateAsync: storeInnerAppStateAsyncStub,
            replaceHash: replaceHashStub,
        };
        var oEvent = {
            oSource: {
                _bDirtyViaDialog: true,
            },
        };
        oController.bSFBInitialized = true;
        var fnDone = assert.async();
        oController._storeCurrentAppStateAndAdjustURL(oEvent);

        setTimeout(function () {
            assert.ok(true, "iAppState Should not be updated");
            fnDone();
        }.bind(this), 0);
    });

    QUnit.test("Store current app state and adjust URL failure scenario", function (assert) {
        var selectionVariant = {
            Version: {
                Major: "1",
                Minor: "0",
                Patch: "0",
            },
            SelectionVariantID: "",
            Text: "Selection Variant with ID ",
            ODataFilterExpression: "",
            Parameters: [],
            SelectOptions: [],
        };

        var sSelectionVariant = JSON.stringify(selectionVariant);
        
        this.dPromise = new Promise(function (resolve, reject) {
            reject("TestReason");
        });
        var oCurrentAppState = {
            appStateKey: "dummyAppStateKey",
            promise: this.dPromise,
        };
        var storeInnerAppStateAsyncStub = function () {
            return oCurrentAppState;
        };
        var replaceHashStub = function () {
            return;
        };
        oController.oNavigationHandler = {
            storeInnerAppStateAsync: storeInnerAppStateAsyncStub,
            replaceHash: replaceHashStub,
        };
        var oEvent = {
            oSource: {
                _bDirtyViaDialog: true,
            },
        };
        oController.bSFBInitialized = true;
        var fnDone = assert.async();
        oController._storeCurrentAppStateAndAdjustURL(oEvent);

        setTimeout(function () {
            assert.ok(true, "iAppState Should not be updated");
            fnDone();
        }.bind(this), 0);
    });

    QUnit.test("Card Template Class is not valid", function (assert) {
        assert.deepEqual(
            oController._checkIsCardValid("sap.ovp.test.card"),
            false,
            "wrong Card Template Class should not pass card validation"
        );
    });

    QUnit.test("Card template Class is not typeof sap.ovp.cards.generic.Component", function (assert) {
        var testComponent = UIComponent.extend("sap.ovp.test.card.Component", {});
        assert.deepEqual(
            oController._checkIsCardValid("sap.ovp.test.card", testComponent),
            false,
            "Card Template Class which is not typeof sap.ovp.cards.generic.Component should not pass card validation"
        );
    });

    QUnit.test("Card template Class is exactly sap.ovp.cards.generic.Component", function (assert) {
        assert.deepEqual(
            oController._checkIsCardValid("sap.ovp.cards.generic"),
            true,
            "Card template Class is exactly sap.ovp.cards.generic.Component"
        );
    });

    QUnit.test("Card template Class is typeof sap.ovp.cards.generic.Component", function (assert) {
        var testComponent = OvpCardComponent.extend("sap.ovp.test.card.Component", {});
        assert.deepEqual(
            oController._checkIsCardValid("sap.ovp.test.card", testComponent),
            true,
            "Card template Class is typeof sap.ovp.cards.generic.Component"
        );
    });

    QUnit.test("Card is typeof sap.ovp.cards.generic.Component and contains viewReplacements for sap.ovp.cards.generic.Card", function (assert) {
        var testComponent = OvpCardComponent.extend("sap.ovp.test.card.Component", {
            metadata: {
                customizing: {
                    "sap.ui.viewReplacements": {
                        "sap.ovp.cards.generic.Card": {},
                    },
                },
            },
        });

        assert.deepEqual(
            oController._checkIsCardValid("sap.ovp.test.card", testComponent),
            false,
            "Card is typeof sap.ovp.cards.generic.Component and contains viewReplacements for sap.ovp.cards.generic.Card should not pass card validation"
        );
    });

    QUnit.test("Card is typeof sap.ovp.cards.generic.Component and contains valid viewReplacements", function (assert) {
        var testComponent = OvpCardComponent.extend("sap.ovp.test.card.Component", {
            metadata: {
                customizing: {
                    "sap.ui.viewReplacements": {
                        "sap.ovp.whatever.whatever2": {},
                    },
                },
            },
        });

        assert.deepEqual(
            oController._checkIsCardValid("sap.ovp.test.card", testComponent),
            true,
            "Card is typeof sap.ovp.cards.generic.Component and contains valid viewReplacements should pass card validation"
        );
    });

    QUnit.test("Card is typeof sap.ovp.cards.generic.Component and contains valid viewReplacements", function (assert) {
        var testComponent = OvpCardComponent.extend("sap.ovp.test.card.Component", {
            metadata: {
                customizing: {
                    "sap.ui.viewReplacements": {
                        "sap.ovp.whatever.whatever2": {},
                    },
                },
            },
        });

        assert.deepEqual(
            oController._checkIsCardValid("sap.ovp.test.card", testComponent),
            true,
            "Card is typeof sap.ovp.cards.generic.Component and contains valid viewReplacements should pass card validation"
        );
    });

    QUnit.test("Card is typeof sap.ovp.cards.generic.Component but override createContent function", function (assert) {
        var testComponent = OvpCardComponent.extend("sap.ovp.test.card.Component", {
            createContent: function () { },
        });

        assert.deepEqual(
            oController._checkIsCardValid("sap.ovp.test.card", testComponent),
            false,
            "Card is typeof sap.ovp.cards.generic.Component but override createContent function should not pass card validation"
        );
    });

    QUnit.test("Card is typeof sap.ovp.cards.generic.Component but override getPreprocessors function", function (assert) {
        var testComponent = OvpCardComponent.extend("sap.ovp.test.card.Component", {
            getPreprocessors: function () { },
        });

        assert.deepEqual(
            oController._checkIsCardValid("sap.ovp.test.card", testComponent),
            false,
            "Card is typeof sap.ovp.cards.generic.Component but override getPreprocessors function should not pass card validation"
        );
    });

    QUnit.test("Card implements getCustomPreprocessor method", function (assert) {
        var testComponent = OvpCardComponent.extend("sap.ovp.test.card.Component", {
            metadata: {
                getCustomPreprocessor: function () { },
            },
        });

        assert.deepEqual(
            oController._checkIsCardValid("sap.ovp.test.card", testComponent),
            true,
            "Card implements getCustomPreprocessor method should pass card validation"
        );
    });

    QUnit.test("Init Global Filter - When macro filter bar is not present then global filter loaded state is set to true ", function (assert) {
        oController.getView = function () {
            return {
                byId: function (param) {
                    if (param == "ovpLayout") {
                        return "ovpLayout"
                    } else if (param == "ovpGlobalMacroFilter") {
                        return undefined;
                    } else if (param == "ovpGlobalFilter") {
                        return undefined;
                    }
                }
            };
        };
        oController.getOwnerComponent = function () {
            return {
                oOvpConfig: function () {
                    return {};
                }
            }
        };
        oController._initGlobalFilter();
        assert.ok(oController.bGlobalFilterLoaded === true, "bGlobalFilterLoaded should not stop any normal processing that wait for global filter to be loaded thus when macro filter bar not present");
    });

    QUnit.test("Init Global Filter - For V4 the placeholder is hidden when macro filter bar is present", function (assert) {
        oController.getView = function () {
            return {
                byId: function (param) {
                    if (param == "ovpLayout") {
                        return "ovpLayout"
                    } else if (param == "ovpGlobalMacroFilter") {
                        return {
                            getContent: function () {
                                return {
                                    getPropertyInfo: function () {
                                        return [];
                                    }
                                }
                            },
                            attachEvent: function(param1, param2, param3) {
                                if (param1 === "filterChanged") {
                                    return null;
                                }
                            }
                        };
                    } else if (param == "ovpGlobalFilter") {
                        return undefined;
                    } else if (param == "ovpMain") {
                        return {
                            setHeaderExpanded: function () {
                                return true;
                            }
                        }
                    } else if (param == "ovpFilterNotFulfilledPage") {
                        return {
                            setVisible: function () {
                                return true;
                            }
                        }
                    } else if (param == "ovpCardPage") {
                        return {
                            setVisible: function () {
                                return false;
                            },
                            addStyleClass: function () {
                                return false;
                            },
                            removeStyleClass: function () {
                                return false;
                            }
                        }
                    }

                },
                getModel: function() {
                    return {
                        getProperty: function (sPropertyName) {
                            return undefined;
                        },
                        setProperty: function (sPropertyName, value) {
                            oController.modelData.setProperty(sPropertyName, value);
                        },
                    };
                }
            };
        };
        oController._getCardsModel = function() {
            return {};
        };
        oController.getUIModel = function () {
            return false;
        }
        oController.getOwnerComponent = function () {
            return {
                oOvpConfig: function () {
                    return {};
                },
                inLazyLoadingTestMode: function() {
                    return false;
                }
            }
        };
        placeholderHelper.isPlaceHolderEnabled = function () {
            return true;
        };
        var oNavContainer = new NavContainer();
        placeholderHelper.showPlaceholder(oNavContainer);
        var spy = sinon.spy(placeholderHelper, "hidePlaceholder");
        oController._initGlobalFilter();
        if (oController.fnMacroFilterBarLoaded) {
            assert.ok(!spy.called, "hide placeholder method should not be called in _initGlobalFilter, it should be called in onAfterRendering");
            assert.equal(
                placeholderHelper.hidePlaceholderNeeded(),
                true,
                "The placeholder is visible for V4 when filter bar is present as the view creation happens after the oGlobalFilterLoadedPromise is executed."
            );
        }
        oController.onAfterRendering();
        assert.ok(spy.called, "hide placeholder method should be called in onAfterRendering");
        assert.equal(
            placeholderHelper.hidePlaceholderNeeded(),
            false,
            "The placeholder is not visible for v4 as the hidePlaceholder() is executed in onAfterRendering."
        );
    });

    QUnit.test("Init Global Filter - no variant no required fields", function (assert) {
        var globalFilter = _mockGlobalFilter();
        oController._initGlobalFilter();
        oController.oNavigationHandler = { parseNavigation: function () { } };
        FENavLibrary.NavType = { initial: undefined };
        sinon.assert.callCount(globalFilter.attachFilterChange, 1);
        sinon.assert.callCount(globalFilter.attachInitialized, 1);
        sinon.assert.callCount(globalFilter.attachSearch, 1);

        //call the initialize callback
        globalFilter.attachInitialized.args[0][0].call(globalFilter.attachInitialized.args[0][1]);
        oController.bGlobalFilterLoaded = true;
        oController.getView = function () {
            return {
                byId: function (id) {
                    return {
                        setHeaderExpanded: function () {
                            return true;
                        },
                        setActive: function () {
                            return true;
                        },
                        setVisible: function () { },
                    };
                },
            };
        };

        var uiModel = new JSONModel({
            enableLiveFilter: true,
        });
        oController.getUIModel = function () {
            return uiModel;
        };

        var fnDone = assert.async();
        oController.oGlobalFilterLoadedPromise.then(function () {
            assert.ok(true, "no variant and no required fields - filter should be marked as loaded after initialzed is called");
            fnDone();
        });
    });

    QUnit.test("Init Global Filter - with variant no required fields", function (assert) {
        var globalFilter = _mockGlobalFilter();
        oController._initGlobalFilter();
        FENavLibrary.NavType = { initial: undefined };
        oController.oNavigationHandler = {
            parseNavigation: function () {
                return Promise.resolve();
            },
        };

        sinon.assert.callCount(globalFilter.attachFilterChange, 1);
        sinon.assert.callCount(globalFilter.attachInitialized, 1);
        sinon.assert.callCount(globalFilter.attachSearch, 1);

        oController.bGlobalFilterLoaded = true;
        oController.getView = function () {
            return {
                byId: function (id) {
                    return {
                        setHeaderExpanded: function () {
                            return true;
                        },
                        setActive: function () {
                            return true;
                        },
                        setVisible: function () { },
                    };
                },
            };
        };

        var uiModel = new JSONModel({
            enableLiveFilter: true,
        });
        oController.getUIModel = function () {
            return uiModel;
        };

        var variantLoaded = false;
        var fnDone = assert.async();

        var fnfilterLoaded = function () {
            if (variantLoaded) {
                assert.ok(true, "with variant and with no required fields - filter should be marked as loaded only after variant loaded is called");
            } else {
                assert.ok(false, "with variant and with no required fields - filter should be marked as loaded only after variant loaded is called");
            }
            fnDone();
        };
        oController.oGlobalFilterLoadedPromise.then(fnfilterLoaded);
        //call the initialize callback
        globalFilter.variantId = "someVariantId";
        setTimeout(function () {
            globalFilter.attachInitialized.args[0][0].call(globalFilter.attachInitialized.args[0][1]);
            variantLoaded = true;
        }, 1);
    });

    QUnit.test("Init Global Filter - with variant and with required fields", function (assert) {
        var globalFilter = _mockGlobalFilter();
        oController._initGlobalFilter();
        oController.oNavigationHandler = {
            parseNavigation: function () {
                return Promise.resolve();
            },
        };

        sinon.assert.callCount(globalFilter.attachFilterChange, 1);
        sinon.assert.callCount(globalFilter.attachInitialized, 1);
        sinon.assert.callCount(globalFilter.attachSearch, 1);

        oController.getView = function () {
            return {
                byId: function () {
                    return { setVisible: function () { } };
                },
            };
        };

        var uiModel = new JSONModel({
            enableLiveFilter: true,
        });
        oController.getUIModel = function () {
            return uiModel;
        };

        var searchCalled = false;
        var fnDone = assert.async();
        var fnfilterLoaded = function () {
            if (searchCalled) {
                assert.ok(true, "with variant and with required fields - filter should be marked as loaded only after search called");
            } else {
                assert.ok(false, "with variant and with required fields - filter should be marked as loaded only after search called");
            }
            fnDone();
        };
        oController.oGlobalFilterLoadedPromise.then(fnfilterLoaded);
        oController.getView = function () {
            return {
                byId: function (id) {
                    return {
                        setHeaderExpanded: function () {
                            return true;
                        },
                        setActive: function () {
                            return true;
                        },
                        setVisible: function () { },
                    };
                },
            };
        };

        //call the initialize callback
        globalFilter.variantId = "someVariantId";
        globalFilter.hasRequiredFields = true;
        setTimeout(function () {
            globalFilter.attachInitialized.args[0][0].call(globalFilter.attachInitialized.args[0][1]);
        }, 1);
        setTimeout(function () {
            globalFilter.hasRequiredFields = false;
            globalFilter.attachSearch.args[0][0].call(globalFilter.attachSearch.args[0][1]);
            searchCalled = true;
        }, 3);
    });

    QUnit.test("Init Global Filter - apply automatically is selected", function (assert) {
        var globalFilter = _mockGlobalFilter();
        oController._initGlobalFilter();
        oController.oNavigationHandler = {
            parseNavigation: function () {
                return Promise.resolve();
            },
        };

        sinon.assert.callCount(globalFilter.attachFilterChange, 1);
        sinon.assert.callCount(globalFilter.attachInitialized, 1);
        sinon.assert.callCount(globalFilter.attachSearch, 1);

        oController.getView = function () {
            return {
                byId: function (id) {
                    return {
                        setHeaderExpanded: function () {
                            return true;
                        },
                        setActive: function () {
                            return true;
                        },
                        setVisible: function () { },
                    };
                },
            };
        };
        var uiModel = new JSONModel({
            enableLiveFilter: true,
        });
        oController.getUIModel = function () {
            return uiModel;
        };

        globalFilter.attachInitialized.args[0][0].call(globalFilter.attachInitialized.args[0][1]);
        //when apply automatically is selected, a search event is triggered
        globalFilter.attachSearch.args[0][0].call(globalFilter.attachSearch.args[0][1]);
        //with the search event, bGlobalFilterLoaded will become true, so oGlobalFilterLoadedPromise would resolve
        //and cards will become active
        assert.ok(oController.bGlobalFilterLoaded === true, "oGlobalFilterLoadedPromise will get resolved and cards will be active");
    });

    QUnit.test("Init Global Filter - apply automatically is not selected", function (assert) {
        var globalFilter = _mockGlobalFilter();
        oController._initGlobalFilter();
        oController.oNavigationHandler = {
            parseNavigation: function () {
                return Promise.resolve();
            },
        };

        sinon.assert.callCount(globalFilter.attachFilterChange, 1);
        sinon.assert.callCount(globalFilter.attachInitialized, 1);
        sinon.assert.callCount(globalFilter.attachSearch, 1);

        oController.getView = function () {
            return {
                byId: function () {
                    return { setVisible: function () { } };
                },
            };
        };
        var uiModel = new JSONModel({
            enableLiveFilter: true,
        });
        oController.getUIModel = function () {
            return uiModel;
        };

        globalFilter.attachInitialized.args[0][0].call(globalFilter.attachInitialized.args[0][1]);
        //when apply automatically is not selected, search event is not triggered and bGlobalFilterLoaded will remain undefined
        //so oGlobalFilterLoadedPromise will not resolve and cards will not be active
        assert.ok(oController.bGlobalFilterLoaded === undefined, "oGlobalFilterLoadedPromise will not get resolved and cards will be inactive");
    });

    QUnit.test("validate _getCardId no viewId prefix", function (assert) {
        var cardId = "card00";
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                },
            };
        };
        var res = oController._getCardId(cardId);
        assert.ok(res, cardId);
    });

    QUnit.test("validate _getCardId with viewId prefix", function (assert) {
        var cardId = "mainAppID--card00";
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                },
            };
        };
        var res = oController._getCardId(cardId);
        assert.ok(res, "card00");
    });

    QUnit.test("validate _mergeLREPContent without delta changes", function (assert) {
        var oLayoutCardsArray = [
            { id: "card00", visibility: true },
            { id: "card01", visibility: false },
            { id: "card02", visibility: true },
            { id: "card03", visibility: false },
            { id: "card04", visibility: true },
        ];
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                },
            };
        };
        oController.getLayout = function () {
            return {
                getMetadata: function () {
                    return {
                        getName: function () {
                            return "sap.ovp.ui.EasyScanLayout";
                        },
                    };
                },
            };
        };
        oController.deltaChanges = null;
        var oResult = oController._mergeLREPContent(oLayoutCardsArray, null);
        assert.deepEqual(oResult, oLayoutCardsArray, "should return the same cards from layout array");
    });

    QUnit.test("validate _mergeLREPContent without delta changes and empty layout cards array", function (assert) {
        var oLayoutCardsArray = [];
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                },
            };
        };
        oController.getLayout = function () {
            return {
                getMetadata: function () {
                    return {
                        getName: function () {
                            return "sap.ovp.ui.EasyScanLayout";
                        },
                    };
                },
            };
        };
        oController.deltaChanges = null;
        var oResult = oController._mergeLREPContent(oLayoutCardsArray, null);
        assert.deepEqual(oResult, oLayoutCardsArray, "should return empty cards array");
    });

    QUnit.test("validate _mergeLREPContent without delta changes and without layout cards array", function (assert) {
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                },
            };
        };
        oController.getLayout = function () {
            return {
                getMetadata: function () {
                    return {
                        getName: function () {
                            return "sap.ovp.ui.EasyScanLayout";
                        },
                    };
                },
            };
        };
        oController.deltaChanges = null;
        var oResult = oController._mergeLREPContent(null, null);
        assert.deepEqual(oResult, [], "should return empty cards array");
    });

    QUnit.test("validate _mergeLREPContent card exist in delta changes and not in oLayout", function (assert) {
        var oLayoutCardsArray = [
            { id: "card00", visibility: true },
            { id: "card01", visibility: false },
            { id: "card02", visibility: true },
            { id: "card03", visibility: false },
            { id: "card04", visibility: true },
        ];
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                },
            };
        };
        oController.getLayout = function () {
            return {
                getMetadata: function () {
                    return {
                        getName: function () {
                            return "sap.ovp.ui.EasyScanLayout";
                        },
                    };
                },
            };
        };
        oController.deltaChanges = [
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card00",
                        visibility: true,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card01",
                        visibility: false,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card02",
                        visibility: true,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card03",
                        visibility: false,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card04",
                        visibility: true,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card10",
                        visibility: true,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card11",
                        visibility: false,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card12",
                        visibility: true,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card13",
                        visibility: false,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card14",
                        visibility: true,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
        ];
        var oResult = oController._mergeLREPContent(oLayoutCardsArray, {
            cards: [
                { id: "card00", visibility: true },
                { id: "card01", visibility: false },
                { id: "card02", visibility: true },
                { id: "card03", visibility: false },
                { id: "card04", visibility: true },
                { id: "card10", visibility: true },
                { id: "card11", visibility: false },
                { id: "card12", visibility: true },
                { id: "card13", visibility: false },
                { id: "card14", visibility: true },
            ],
        });

        assert.deepEqual(oResult, oLayoutCardsArray);
    });

    QUnit.test("validate _mergeLREPContent card exist in oVariand and not in oLayout and visibility taken from oVariant", function (assert) {
        var oLayoutCardsArray = [
            { id: "card00", visibility: true },
            { id: "card01", visibility: false },
            { id: "card02", visibility: true },
            { id: "card03", visibility: false },
            { id: "card04", visibility: true },
        ];
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                },
            };
        };
        oController.getLayout = function () {
            return {
                getMetadata: function () {
                    return {
                        getName: function () {
                            return "sap.ovp.ui.EasyScanLayout";
                        },
                    };
                },
            };
        };
        oController.deltaChanges = [
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card00",
                        visibility: true,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card01",
                        visibility: true,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card02",
                        visibility: true,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card03",
                        visibility: true,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card04",
                        visibility: true,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card10",
                        visibility: true,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card11",
                        visibility: false,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card12",
                        visibility: true,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card13",
                        visibility: false,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card14",
                        visibility: true,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
        ];
        var expectedResult = [
            { id: "card00", visibility: true },
            { id: "card01", visibility: true },
            { id: "card02", visibility: true },
            { id: "card03", visibility: true },
            { id: "card04", visibility: true },
        ];
        var oResult = oController._mergeLREPContent(oLayoutCardsArray, {
            cards: expectedResult.concat([
                { id: "card10", visibility: true },
                { id: "card11", visibility: false },
                { id: "card12", visibility: true },
                { id: "card13", visibility: false },
                { id: "card14", visibility: true },
            ]),
        });

        assert.deepEqual(oResult, expectedResult);
    });

    QUnit.test("validate _mergeLREPContent oLayout contains additional cards which not exist in oVariant", function (assert) {
        var oLayoutCardsArray = [
            { id: "card00", visibility: true },
            { id: "card01", visibility: false },
            { id: "card02", visibility: true },
            { id: "card03", visibility: false },
            { id: "card04", visibility: true },
        ];
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                },
            };
        };
        oController.getLayout = function () {
            return {
                getMetadata: function () {
                    return {
                        getName: function () {
                            return "sap.ovp.ui.EasyScanLayout";
                        },
                    };
                },
            };
        };
        oController.deltaChanges = [
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card00",
                        visibility: false,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card01",
                        visibility: true,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card02",
                        visibility: false,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card03",
                        visibility: true,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card04",
                        visibility: false,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card10",
                        visibility: true,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card11",
                        visibility: false,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card12",
                        visibility: true,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card13",
                        visibility: false,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card14",
                        visibility: true,
                    };
                },
                getLayer: function () {
                    return "USER";
                },
            },
        ];
        var oResult = oController._mergeLREPContent(oLayoutCardsArray, {
            cards: [{ id: "card04", visibility: false }],
        });

        var expectedResult = [
            { id: "card00", visibility: false },
            { id: "card01", visibility: true },
            { id: "card02", visibility: false },
            { id: "card03", visibility: true },
            { id: "card04", visibility: false },
        ];
        assert.deepEqual(oResult, expectedResult);
    });

    QUnit.test("validate _mergeLREPContent with delta changes and without layout cards array", function (assert) {
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                },
            };
        };
        oController.getLayout = function () {
            return {
                getMetadata: function () {
                    return {
                        getName: function () {
                            return "sap.ovp.ui.EasyScanLayout";
                        },
                    };
                },
            };
        };
        oController.getLayout = function () {
            return {
                getMetadata: function () {
                    return {
                        getName: function () {
                            return "sap.ovp.ui.EasyScanLayout";
                        },
                    };
                },
            };
        };
        oController.deltaChanges = [
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card00",
                        visibility: true,
                    };
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card01",
                        visibility: false,
                    };
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card02",
                        visibility: true,
                    };
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card03",
                        visibility: false,
                    };
                },
            },
            {
                getChangeType: function () {
                    return "visibility";
                },
                getContent: function () {
                    return {
                        cardId: "card04",
                        visibility: true,
                    };
                },
            },
        ];
        var oResult = oController._mergeLREPContent(null, null);
        assert.deepEqual(oResult, [], "should return empty cards array");
    });

    QUnit.test("validate _getCardArrayAsVariantFormat", function (assert) {
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                },
            };
        };

        var aInput = [
            {
                getId: function () {
                    return "card00";
                },
                getVisible: function () {
                    return false;
                },
            },
            {
                getId: function () {
                    return "card01";
                },
                getVisible: function () {
                    return true;
                },
            },
            {
                getId: function () {
                    return "card02";
                },
                getVisible: function () {
                    return false;
                },
            },
            {
                getId: function () {
                    return "card03";
                },
                getVisible: function () {
                    return true;
                },
            },
        ];
        var aExpexted = [
            { id: "card00", visibility: false },
            { id: "card01", visibility: true },
            { id: "card02", visibility: false },
            { id: "card03", visibility: true },
        ];

        var oResult = oController._getCardArrayAsVariantFormat(aInput);
        assert.deepEqual(oResult, aExpexted);
    });

    QUnit.test("validate _getCardFromManifest card is exist in the array", function (assert) {
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                },
                getModel: function () {
                    return new JSONModel({
                        cards: [{ id: "card00" }, { id: "card01" }, { id: "card02" }, { id: "card03" }],
                    });
                },
            };
        };

        oController.getUIModel = function () {
            return new JSONModel({
                cards: [{ id: "card00" }, { id: "card01" }, { id: "card02" }, { id: "card03" }],
            });
        };

        var cardResult = oController._getCardFromManifest("card03");
        assert.ok(cardResult.id == "card03");
    });

    QUnit.test("validate recreateRTAClonedCard if card doesn't exist", function (assert) {
        var spy = sinon.spy(oController, "performRecreationOfCard");
        oController._getCardFromManifest = function () {
            return undefined;
        };
        oController.recreateRTAClonedCard({ cardId: "card08" });
        assert.ok(spy.notCalled, "performRecreationOfCard function is not called");
    });

    QUnit.test("validate recreateRTAClonedCard if card exist", function (assert) {
        var newCardProperties = {};
        oController._getCardFromManifest = function (cardId) {
            return {};
        };
        oController.performRecreationOfCard = function (oCard) {
            newCardProperties = oCard;
        };
        var spy = sinon.spy(oController, "performRecreationOfCard");
        oController.recreateRTAClonedCard({ cardId: "card08", settings: "lol" });
        assert.ok(spy.called, "performRecreationOfCard function is called");
        assert.ok(newCardProperties.settings === "lol", "Copied new properties to the card from manifest");
    });

    QUnit.test("Function test --> recreateCard ---> Entity Set Change", function (assert) {
        var createSavePersonalizationStub = sinon.stub(PersonalizationUtils, "savePersonalization");
        createSavePersonalizationStub.returns();
        var oCard = {
            settings: {
                entitySet: "lol",
            },
        };
        oController._getCardFromManifest = function () {
            return oCard;
        };
        oController.performRecreationOfCard = function () {
            return null;
        };
        oController.savePersonalization = function () {
            return null;
        };
        oController._getOriginalCardDescriptorById = function () {
            return null;
        };
        oController.recreateCard({});
        assert.ok(oCard.settings.entitySet === "lol", "Entity Set not in tab level");
        oController.recreateCard({
            entitySet: "rofl",
        });
        assert.ok(oCard.settings.entitySet === "rofl", "Entity Set Updated at tab level");
        createSavePersonalizationStub.restore();
    });

    QUnit.test("Function test --> recreateCard ---> Static Parameters", function (assert) {
        var createSavePersonalizationStub = sinon.stub(PersonalizationUtils, "savePersonalization");
        createSavePersonalizationStub.returns();
        var oCard = {
            id: "card008",
            model: "purchaseOrder",
            template: "sap.ovp.cards.list",
            settings: {
                title: "Overdue Purchase Orders",
                subTitle: "Condensed standard list card with view Switch",
                selectedKey: 2,
                staticParameters: {
                    parameterLevel: "card",
                },
                tabs: [
                    {
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#imageD",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#item2",
                        value: "sap",
                        staticParameters: {
                            parameterLevel: "tab1"
                        }
                    },
                    {
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#blankD",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification",
                        value: "ABC"
                    }
                ]
            }
        };
        oController._getOriginalCardDescriptorById = function () {
            return {
                id: "card008",
                model: "purchaseOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    title: "Overdue Purchase Orders",
                    subTitle: "Condensed standard list card with view Switch",
                    staticParameters: {
                        parameterLevel: "card",
                    },
                    tabs: [
                        {
                            selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#imageD",
                            identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#item2",
                            value: "sap",
                            staticParameters: {
                                parameterLevel: "tab1",
                            },
                        },
                        {
                            selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#blankD",
                            identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification",
                            value: "ABC",
                        },
                    ],
                },
            };
        };
        oController._getCardFromManifest = function () {
            return oCard;
        };
        oController.performRecreationOfCard = function () {
            return null;
        };
        oController.savePersonalization = function () {
            return null;
        };
        oController.recreateCard({});
        assert.ok(
            oCard.settings.staticParameters.parameterLevel === "card",
            "Static parameters should be empty for view switch entry 2"
        );
        oController.recreateCard({
            staticParameters: {
                parameterLevel: "tab1",
            },
        });
        assert.ok(
            oCard.settings.staticParameters.parameterLevel === "tab1",
            "Static parameters should be tab1 for view switch entry 1"
        );
        createSavePersonalizationStub.restore();
    });

    QUnit.test("Function test --> initializeTabbedCard ---> Entity Set Change", function (assert) {
        var oCard = {
            settings: {
                tabs: [
                    {
                        entitySet: "lol",
                    },
                ],
                entitySet: "",
            },
        };
        oController.initializeTabbedCard(oCard, 0);
        assert.ok(oCard.settings.entitySet === "lol", "Entity Set Updated at global level");
        oCard.settings.tabs = [{}];
        oController.initializeTabbedCard(oCard, 0);
        assert.ok(oCard.settings.entitySet === "lol", "Entity Set not in tab level");
    });

    QUnit.test("validate _getCardFromManifest card is exist in the array", function (assert) {
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                },
                getModel: function () {
                    return new JSONModel({
                        cards: [{ id: "card00" }, { id: "card01" }, { id: "card02" }, { id: "card03" }],
                    });
                },
            };
        };

        oController.getUIModel = function () {
            return new JSONModel({
                cards: [{ id: "card00" }, { id: "card01" }, { id: "card02" }, { id: "card03" }],
            });
        };

        var cardResult = oController._getCardFromManifest("card03");
        assert.ok(cardResult.id == "card03");
    });

    QUnit.test("validate _getCardFromManifest card does not exist in the array", function (assert) {
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                },
                getModel: function () {
                    return new JSONModel({
                        cards: [{ id: "card00" }, { id: "card01" }, { id: "card02" }, { id: "card03" }],
                    });
                },
            };
        };

        oController.getUIModel = function () {
            return new JSONModel({
                cards: [{ id: "card00" }, { id: "card01" }, { id: "card02" }, { id: "card03" }],
            });
        };

        var cardResult = oController._getCardFromManifest("card07");
        assert.ok(cardResult === null);
    });

    QUnit.test("initialize cards containing tabs", function (assert) {
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                },
                getModel: function () {
                    return new JSONModel({
                        cards: [
                            {
                                id: "card00",
                                settings: {
                                    tabs: [{ annotationPath: "lineitem" }],
                                },
                            },
                            { id: "card01" },
                            { id: "card02" },
                            { id: "card03" },
                        ],
                    });
                },
            };
        };

        oController.getUIModel = function () {
            return new JSONModel({
                cards: [
                    {
                        id: "card00",
                        settings: {
                            tabs: [{ annotationPath: "lineitem" }],
                        },
                    },
                    { id: "card01" },
                    { id: "card02" },
                    { id: "card03" },
                ],
            });
        };

        var cardResult = oController._getCardFromManifest("card00");
        oController.initializeTabbedCard(cardResult, 0);
        assert.ok(cardResult.settings.annotationPath === "lineitem");
    });

    QUnit.test("validate updateLayoutWithOrderedCards", function (assert) {
        var fnRemoveAllContentFunc = new sinon.spy();
        var fnSetVisibleFunc = new sinon.spy();
        var fnAddContentFunc = new sinon.spy();

        oController.getLayout = function () {
            return {
                removeAllContent: fnRemoveAllContentFunc,
                addContent: fnAddContentFunc,
            };
        };
        oController.getView = function () {
            return {
                byId: function (oCard) {
                    return {
                        setVisible: fnSetVisibleFunc,
                    };
                },
                getModel: function () {
                    return new JSONModel({
                        aOrderedCards: [
                            { id: "card00", visibility: true },
                            { id: "card01", visibility: true },
                            { id: "card02", visibility: true },
                            { id: "card03", visibility: true },
                        ],
                    });
                },
            };
        };
        oController.getAllowedNumberOfCards = function () {
            return { 
                numberOfCards: 3, 
                errorMessage: "You have reached the maximum limit of 3 cards. To add a new card, you first have to deselect one from the list or hide a card if you are in key user mode." 
            };
            
        }
        oController.updateLayoutWithOrderedCards();

        assert.ok(fnRemoveAllContentFunc.calledOnce);
        sinon.assert.callCount(fnSetVisibleFunc, 4);
        assert.ok(fnSetVisibleFunc.args[0][0] === true);
        assert.ok(fnSetVisibleFunc.args[1][0] === true);
        assert.ok(fnSetVisibleFunc.args[2][0] === true);
        //validate if visibility for the 4th card is set to false
        assert.ok(fnSetVisibleFunc.args[3][0] === false);
        sinon.assert.callCount(fnAddContentFunc, 4);

        fnRemoveAllContentFunc = new sinon.spy();
        fnSetVisibleFunc = new sinon.spy();
        fnAddContentFunc = new sinon.spy();
        
        oController.getAllowedNumberOfCards = function () {
            return { 
                numberOfCards: 4, 
                errorMessage: "You have reached the maximum limit of 4 cards. To add a new card, you first have to deselect one from the list or hide a card if you are in key user mode." 
            };
        }
        oController.updateLayoutWithOrderedCards();
        //validate if visibility is not changed for any card
        assert.ok(fnSetVisibleFunc.args[0][0] === true);
        assert.ok(fnSetVisibleFunc.args[1][0] === true);
        assert.ok(fnSetVisibleFunc.args[2][0] === true);
        assert.ok(fnSetVisibleFunc.args[3][0] === true);

    });

    QUnit.test("validate _setNavigationVariantToGlobalFilter INITIAL scenario", function (assert) {
        var globalFilter = _mockGlobalFilter();
        FENavLibrary.NavType = { initial: "INITIAL" };
        oController._setNavigationVariantToGlobalFilter(null, null, "INITIAL");

        assert.ok(globalFilter.addFieldToAdvancedArea.notCalled);
        assert.ok(globalFilter.clearVariantSelection.notCalled);
        assert.ok(globalFilter.clear.notCalled);
        assert.ok(globalFilter.setUiState.notCalled);
    });

    QUnit.test("validate _mergeDefaultWithSFBVariant", function (assert) {
        var oDefaultParamsVariant = new SelectionVariant();
        var oSFBSelectionVariant = new SelectionVariant();
        oDefaultParamsVariant.addSelectOption("a", "I", "EQ", "1");
        oDefaultParamsVariant.addSelectOption("b", "I", "EQ", "2");
        oSFBSelectionVariant.addSelectOption("a", "I", "EQ", "3");
        oSFBSelectionVariant.addSelectOption("c", "I", "EQ", "4");
        var mergedVariant = oController._mergeDefaultWithSFBVariant(oDefaultParamsVariant, oSFBSelectionVariant);
        assert.ok(mergedVariant.getSelectOption("a")[0].Low === "1");
        assert.ok(mergedVariant.getSelectOption("b")[0].Low === "2");
        assert.ok(mergedVariant.getSelectOption("c")[0].Low === "4");
    });

    QUnit.test("validate _parseNavigationVariant", function (assert) {        
        oController.oNavigationHandler = {
            parseNavigation: function () {
                return Promise.resolve("test");
            },
        };
        oController._parseNavigationVariant();
        var fnDone = assert.async();

        oController.oParseNavigationPromise.then(function (result) {
            if (oController.oContainer) {
                assert.ok(result == "test");
            } else {
                assert.ok(result == null);
            }
            fnDone();
        });
    });

    /*****------------------------------------------------
     *
     * Test Cases for _getApplicationId Function
     *
     * ***-----------------------------------------------**/

    QUnit.test("validate _getApplicationId", function (assert) {
        var uiModel = new JSONModel({
            applicationId: "applicationID_1",
        });
        oController.getUIModel = function () {
            return uiModel;
        };
        var actual = oController._getApplicationId();
        var expected = "applicationID_1";
        assert.ok(actual == expected, "Returns the Application Id");
    });

    QUnit.test("validate _getApplicationId - when application Id is not present", function (assert) {
        var uiModel = new JSONModel({});
        oController.getUIModel = function () {
            return uiModel;
        };
        var actual = oController._getApplicationId();
        var expected = undefined;
        assert.ok(actual == expected, "Returns null");
    });

    /*****------------------------------------------------
     *
     * Test Cases for _getBaseUrl Function
     *
     * ***-----------------------------------------------**/

    QUnit.test("validate _getBaseUrl", function (assert) {
        var uiModel = new JSONModel({
            baseUrl: "www.google.com",
        });
        oController.getUIModel = function () {
            return uiModel;
        };
        var actual = oController._getBaseUrl();
        var expected = "www.google.com";
        assert.ok(actual == expected, "Returns the Base Url");
    });

    QUnit.test("validate _getBaseUrl - when baseUrl is null", function (assert) {
        var uiModel = new JSONModel({});
        oController.getUIModel = function () {
            return uiModel;
        };
        var actual = oController._getBaseUrl();
        var expected = undefined;
        assert.ok(actual == expected, "Returns null for BaseUrl");
    });

    /*****------------------------------------------------
     *
     * Test Cases for _CreateModelViewMap Function
     *
     * ***-----------------------------------------------**/

    QUnit.test("validate _CreateModelViewMap - oCard is undefined", function (assert) {
        var oCard = undefined;
        var actual = oController._createModelViewMap(oCard);
        var expected = undefined;
        assert.ok(actual == expected, "Returns null when oCard is not defined");
    });

    QUnit.test("validate _CreateModelViewMap - when entity Set is null", function (assert) {
        var oCard = {
            model: "salesShare",
            template: "sap.ovp.cards.charts.analytical",
            settings: {
                dataStep: "11",
                valueSelectionInfo: "value selection info",
                navigation: "noHeaderNav",
            },
            id: "Vcard16_cardchartscolumnstacked",
        };

        var actual = oController._createModelViewMap(oCard);
        var expected = undefined;
        assert.ok(actual == expected, "Returns null when entity set is not defined");
    });

    QUnit.test("validate _CreateModelViewMap - when Template is not sap.ovp", function (assert) {
        var oCard = {
            model: "salesShare",
            template: "analytical",
            settings: {
                dataStep: "11",
                entitySet: "SalesShareColumnStacked",
                valueSelectionInfo: "value selection info",
                navigation: "noHeaderNav",
            },
            id: "Vcard16_cardchartscolumnstacked",
        };

        var actual = oController._createModelViewMap(oCard);
        var expected = undefined;
        assert.ok(actual == expected, "Returns undefined for wrong template");
    });

    QUnit.test("validate _CreateModelViewMap - oCard is defined", function (assert) {
        var oCard = {
            model: "salesShare",
            template: "sap.ovp.cards.charts.analytical",
            settings: {
                dataStep: "11",
                title: "Sales by Country and Region",
                subTitle: "Sales by Country and Region",
                valueSelectionInfo: "value selection info",
                navigation: "noHeaderNav",
                entitySet: "SalesShareColumnStacked",
                selectionAnnotationPath:
                    "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_ColumnStacked",
                chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_ColumnStacked",
                presentationAnnotationPath:
                    "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_ColumnStacked",
                dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency-Generic",
                identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Scatter",
            },
            id: "Vcard16_cardchartscolumnstacked",
        };
        oController.oModelViewMap = {};
        oController._createModelViewMap(oCard);
        assert.ok(oController.oModelViewMap["salesShare"]["Vcard16_cardchartscolumnstacked"] == true);
    });

    /*****------------------------------------------------
     *
     * Test Cases for _gettemplateForChartFromVisualization Function
     *
     * ***-----------------------------------------------**/

    QUnit.test("validate _gettemplateForChartFromVisualization - When chart type is donut", function (assert) {
        var sPresentationPath = "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
            oCard = {
                model: "salesShare",
                template: "sap.ovp.cards.charts.smart.chart",
                settings: {
                    dataStep: "11",
                    title: "(Analytical) Donut Card",
                    subTitle: "Sales by Product",
                    valueSelectionInfo: "value selection info",
                    entitySet: "SalesShareDonut",
                    ChartProperties: {
                        plotArea: {
                            dataLabel: {
                                type: "percentage",
                            },
                        },
                    },
                    selectionPresentationAnnotationPath:
                        "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#BothSelectionAndPresentation",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country-Generic",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                },
                id: "Acard6_cardchartsdonut",
            },
            oModel = new JSONModel({}),
            EntitySet = {
                name: "SalesShareDonut",
                entityType: "sap.smartbusinessdemo.services.SalesShareDonutType",
                "Org.OData.Capabilities.V1.FilterRestrictions": {
                    NonFilterableProperties: [
                        {
                            PropertyPath: "ID",
                        },
                        {
                            PropertyPath: "TotalSales",
                        },
                        {
                            PropertyPath: "TotalSalesForecast",
                        },
                        {
                            PropertyPath: "OverallSales",
                        },
                    ],
                },
            },
            oEntityType = {
                "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency": {
                    Title: {
                        String: "Sales by Product",
                    },
                    ChartType: {
                        EnumMember: "com.sap.vocabularies.UI.v1.ChartType/Donut",
                    },
                    Measures: [
                        {
                            PropertyPath: "Sales",
                        },
                    ],
                    Dimensions: [
                        {
                            PropertyPath: "Product",
                        },
                    ],
                    MeasureAttributes: [
                        {
                            Measure: {
                                PropertyPath: "Sales",
                            },
                            Role: {
                                EnumMember: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1",
                            },
                            DataPoint: {
                                AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country-Generic",
                            },
                            RecordType: "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
                        },
                    ],
                    DimensionAttributes: [
                        {
                            Dimension: {
                                PropertyPath: "Product",
                            },
                            Role: {
                                EnumMember: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category",
                            },
                            RecordType: "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
                        },
                    ],
                    RecordType: "com.sap.vocabularies.UI.v1.ChartDefinitionType",
                },
                "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency": {
                    MaxItems: {
                        Int: "3",
                    },
                    GroupBy: [
                        {
                            PropertyPath: "Country",
                        },
                        {
                            PropertyPath: "Currency",
                        },
                    ],
                    SortOrder: [
                        {
                            Property: {
                                PropertyPath: "Sales",
                            },
                            Descending: {
                                Boolean: "true",
                            },
                        },
                    ],
                    Visualizations: [
                        {
                            AnnotationPath: "@com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                        },
                    ],
                },
            };
        var actual = oController._getTemplateForChartFromVisualization(
            sPresentationPath,
            oCard,
            oModel,
            EntitySet,
            oEntityType
        );
        assert.ok(actual.oCard.template == "sap.ovp.cards.charts.analytical");
        assert.ok(actual.bTemplateUpdated == true);
    });

    QUnit.test("validate _getTemplateForChartFromVisualization - When Visulaization is not defined", function (assert) {
        var sPresentationPath = "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
            oCard = {
                model: "salesShare",
                template: "sap.ovp.cards.charts.smart.chart",
                settings: {
                    dataStep: "11",
                    title: "(Analytical) Donut Card",
                    subTitle: "Sales by Product",
                    valueSelectionInfo: "value selection info",
                    entitySet: "SalesShareDonut",
                    selectionPresentationAnnotationPath:
                        "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#BothSelectionAndPresentation",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country-Generic",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                },
                id: "Acard6_cardchartsdonut",
            },
            oModel = new JSONModel({}),
            EntitySet = {
                name: "SalesShareDonut",
                entityType: "sap.smartbusinessdemo.services.SalesShareDonutType",
            },
            oEntityType = {
                "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency": {
                    MaxItems: {
                        Int: "3",
                    },
                    GroupBy: [
                        {
                            PropertyPath: "Country",
                        },
                        {
                            PropertyPath: "Currency",
                        },
                    ],
                    SortOrder: [
                        {
                            Property: {
                                PropertyPath: "Sales",
                            },
                            Descending: {
                                Boolean: "true",
                            },
                        },
                    ],
                },
            };
        var actual = oController._getTemplateForChartFromVisualization(
            sPresentationPath,
            oCard,
            oModel,
            EntitySet,
            oEntityType
        );
        assert.ok(actual.oCard.template == "sap.ovp.cards.charts.smart.chart");
        assert.ok(actual.bTemplateUpdated == false);
    });

    QUnit.test("validate _getTemplateForChartFromVisualization - When Chart Type is not Donut", function (assert) {
        var sPresentationPath = "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
            oCard = {
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    dataStep: "11",
                    title: "Line Chart",
                    subTitle: "Sales by Product",
                    valueSelectionInfo: "value selection info",
                    entitySet: "SalesShare",
                    selectionPresentationAnnotationPath:
                        "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#BothSelectionAndPresentation",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country-Generic",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                },
                id: "Acard6_cardchartsLine",
            },
            oModel = new JSONModel({}),
            EntitySet = {
                name: "SalesShareLine",
                entityType: "sap.smartbusinessdemo.services.SalesShareLine",
            },
            oEntityType = {
                "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency": {
                    MaxItems: {
                        Int: "3",
                    },
                    GroupBy: [
                        {
                            PropertyPath: "Country",
                        },
                        {
                            PropertyPath: "Currency",
                        },
                    ],
                    Visualizations: [
                        {
                            AnnotationPath: "@com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                        },
                    ],
                },
                "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency": {
                    Title: {
                        String: "Sales by Product",
                    },
                    ChartType: {
                        EnumMember: "com.sap.vocabularies.UI.v1.ChartType/Line",
                    },
                    Measures: [
                        {
                            PropertyPath: "Sales",
                        },
                    ],
                    RecordType: "com.sap.vocabularies.UI.v1.ChartDefinitionType",
                },
            };
        var actual = oController._getTemplateForChartFromVisualization(
            sPresentationPath,
            oCard,
            oModel,
            EntitySet,
            oEntityType
        );
        assert.ok(actual.oCard.template == "sap.ovp.cards.charts.smart.chart");
        assert.ok(actual.bTemplateUpdated == true);
    });

    QUnit.test("Test setTitle function", function (assert) {
        var subtitle = "subtitle";
        var description = "description";
        var title = "apptitle";
        assert.ok(oController.setTitle(subtitle, description, title) === subtitle, "Subtitle takes precedence");

        subtitle = null;
        description = "description";
        title = "apptitle";
        assert.ok(oController.setTitle(subtitle, description, title) === description, "Description takes precedence");

        subtitle = undefined;
        description = null;
        title = "apptitle";
        assert.ok(oController.setTitle(subtitle, description, title) === title, "Title takes precedence");

        subtitle = "subtitle";
        description = null;
        title = "apptitle";
        assert.ok(
            oController.setTitle(subtitle, description, title) !== description,
            "Description will not take precedence"
        );
    });

    QUnit.test("DataLoad behaviour where user sets own variant", function (assert) {
        oController.getView = function () {
            return {
                byId: function (param) {
                    return {
                        setVisible: function (param) { },
                    };
                },
            };
        };
        oController.getUIModel = function () {
            return {
                getProperty: function (params) {
                    if (params == "/smartVariantRequired") {
                        return false;
                    }
                },
            };
        };
        oController.oState = {
            oSmartFilterbar: _mockGlobalFilter()
        };
        var oMessage = oController._fnIsLoadDataOnGoButton(false);
        assert.ok(oMessage == false, "Result will be the setting of variant set by user.");
    });

    QUnit.test("DataLoad behaviour where user disabled the smart variant", function (assert) {
        oController.getView = function () {
            return {
                byId: function (param) {
                    return {
                        setVisible: function (param) { },
                    };
                },
            };
        };
        oController.getUIModel = function () {
            return {
                getProperty: function (params) {
                    if (params == "/smartVariantRequired") {
                        return false;
                    }
                },
            };
        };
        var oMessage = oController._fnIsLoadDataOnGoButton(true);
        assert.ok(oMessage == false, "Result will be OVP cards NOT displayed as the smart variant is disabled");
    });

    QUnit.test("DataLoad behaviour where standard variant and smart variant enabled and has user settings", function (assert) {
        oController.getView = function () {
            return {
                byId: function (param) {
                    return {
                        setVisible: function (param) { },
                    };
                },
            };
        };
        oController.oState = {
            oSmartFilterbar: _mockGlobalFilter()
        };
        oController.getUIModel = function () {
            return {
                getProperty: function (params) {
                    if (params == "/smartVariantRequired") {
                        return true;
                    }
                },
            };
        };
        var oMessage = oController._fnIsLoadDataOnGoButton(false);
        assert.ok(oMessage == false, "Result will be the setting of variant set by user.");
    });

    QUnit.test("DataLoad behaviour where standard variant and smart variant enabled and data load setting as always and manditory filters set", function (assert) {
        oController.getView = function () {
            return {
                byId: function (param) {
                    return {
                        setVisible: function (param) { },
                        setHeaderExpanded: function (params) { },
                    };
                },
            };
        };
        oController.oState = {
            oSmartFilterbar: _mockGlobalFilter()
        };
        oController.getUIModel = function () {
            return {
                getProperty: function (params) {
                    if (params === "/smartVariantRequired") {
                        return true;
                    }
                    if (params === "/dataLoadSettings") {
                        return {
                            loadDataOnAppLaunch: "always",
                        };
                    }
                },
            };
        };
        var bGlobalFilterMandatoryItemsFilled = true;
        var oMessage = oController._fnIsLoadDataOnGoButton(bGlobalFilterMandatoryItemsFilled);
        assert.ok(oMessage == true, "Result will be OVP cards displayed as the manditory filters are set.");
    });

    QUnit.test("DataLoad behaviour where standard variant and smart variant enabled and data load setting as always and manditory filters not set", function (assert) {
        oController.getView = function () {
            return {
                byId: function (param) {
                    return {
                        setVisible: function (param) { },
                        setHeaderExpanded: function (params) { },
                    };
                },
            };
        };
        oController.oState = {
            oSmartFilterbar: _mockGlobalFilter()
        };
        oController.getUIModel = function () {
            return {
                getProperty: function (params) {
                    if (params === "/smartVariantRequired") {
                        return true;
                    }
                    if (params === "/dataLoadSettings") {
                        return {
                            loadDataOnAppLaunch: "always",
                        };
                    }
                },
            };
        };
        var bGlobalFilterMandatoryItemsFilled = false;
        var oMessage = oController._fnIsLoadDataOnGoButton(bGlobalFilterMandatoryItemsFilled);
        assert.ok(oMessage == false, "Result will be OVP cards NOT displayed as the manditory filters are not set.");
    });

    QUnit.test("DataLoad behaviour where standard variant and smart variant enabled and data load setting as never", function (assert) {
        oController.getView = function () {
            return {
                byId: function (param) {
                    return {
                        setVisible: function (param) { },
                        setHeaderExpanded: function (params) { },
                    };
                },
            };
        };
        oController.oState = {
            oSmartFilterbar: _mockGlobalFilter()
        };
        oController.getUIModel = function () {
            return {
                getProperty: function (params) {
                    if (params === "/smartVariantRequired") {
                        return true;
                    }
                    if (params === "/dataLoadSettings") {
                        return {
                            loadDataOnAppLaunch: "never",
                        };
                    }
                },
            };
        };
        var bGlobalFilterMandatoryItemsFilled = true;
        var oMessage = oController._fnIsLoadDataOnGoButton(bGlobalFilterMandatoryItemsFilled);
        assert.ok(oMessage == false, "Result will be OVP cards NOT displayed irrespective of manditory filters are set.");
    });

    QUnit.test("DataLoad behaviour where standard variant and smart variant enabled and data load setting as ifAnyFilterExist with filter settings and manditory fields not set", function (assert) {
        oController.getView = function () {
            return {
                byId: function (param) {
                    return {
                        setVisible: function (param) { },
                        setHeaderExpanded: function (params) { },
                    };
                },
            };
        };
        oController.oState = {
            oSmartFilterbar: _mockGlobalFilter()
        };
        oController.getUIModel = function () {
            return {
                getProperty: function (params) {
                    if (params === "/smartVariantRequired") {
                        return true;
                    }
                    if (params === "/dataLoadSettings") {
                        return {
                            loadDataOnAppLaunch: "ifAnyFilterExist",
                        };
                    }
                },
            };
        };
        var bGlobalFilterMandatoryItemsFilled = false;
        var oMessage = oController._fnIsLoadDataOnGoButton(bGlobalFilterMandatoryItemsFilled);
        assert.ok(oMessage == false, "Result will be OVP cards NOT displayed as manditory filters are not set.");
    });

    QUnit.test("DataLoad behaviour where standard variant and smart variant enabled and data load setting as ifAnyFilterExist with filter settings and manditory fields are set", function (assert) {
        oController.getView = function () {
            return {
                byId: function (param) {
                    return {
                        setVisible: function (param) { },
                        setHeaderExpanded: function (params) { },
                    };
                },
            };
        };
        oController.oState = {
            oSmartFilterbar: _mockGlobalFilter()
        };
        oController.getUIModel = function () {
            return {
                getProperty: function (params) {
                    if (params === "/smartVariantRequired") {
                        return true;
                    }
                    if (params === "/dataLoadSettings") {
                        return {
                            loadDataOnAppLaunch: "ifAnyFilterExist",
                        };
                    }
                },
            };
        };
        var bGlobalFilterMandatoryItemsFilled = true;
        var oMessage = oController._fnIsLoadDataOnGoButton(bGlobalFilterMandatoryItemsFilled);
        assert.ok(oMessage == true, "Result will be OVP cards  displayed as manditory filters are set.");
    });

    QUnit.test("DataLoad behaviour for standard variant when filters are empty", function (assert) {
        oController.getView = function () {
            return {
                byId: function (param) {
                    return {
                        setVisible: function (param) { },
                        setHeaderExpanded: function (params) { },
                    };
                },
            };
        };
        oController.oState = {
            oSmartFilterbar: _mockGlobalFilter()
        };
        oController.oState.oSmartFilterbar.getFiltersWithValues = function () {
            return [];
        };
        oController.getUIModel = function () {
            return {
                getProperty: function (params) {
                    if (params === "/smartVariantRequired") {
                        return true;
                    }
                    if (params === "/dataLoadSettings") {
                        return {
                            loadDataOnAppLaunch: "ifAnyFilterExist",
                        };
                    }
                },
            };
        };
        var bGlobalFilterMandatoryItemsFilled = true;
        var oMessage = oController._fnIsLoadDataOnGoButton(bGlobalFilterMandatoryItemsFilled);
        assert.ok(oMessage == false, "Result will be OVP card will not be loaded.");
    });

    QUnit.test("test onMacroFilterBarSearch Check filter bar conditions model when no filters are applied", function (assert) {
        oController.getView = function () {
            return {
                fnMacroFilterBarLoaded: true,
                byId: function (param) {
                    if (param === "ovpGlobalFilter") {
                        return false;
                    }
                    return {
                        setVisible: function (param) { },
                        setHeaderExpanded: function (params) { },
                        setActive: function (params) { },
                    };
                },
                setModel: function (oData, sModelName) {
                    oController.modelName = sModelName;
                    oController.modelData = oData;
                },
                getModel: function (sModelName) {
                    return {
                        getProperty: function (sPropertyName) {
                            return oController.modelData.getProperty(sPropertyName);
                        },
                        setProperty: function (sPropertyName, value) {
                            oController.modelData.setProperty(sPropertyName, value);
                        },
                    };
                },
            };
        };
        var uiModel = new JSONModel({
            enableLiveFilter: true,
        });
        oController.getUIModel = function () {
            return uiModel;
        };
        oController.oMacroFilterBar = true;
        oController.oGlobalFilter = false;
        oController.globalEventBus = {
            publish: function () { },
        };
        var oEvent = {
            getParameter: function (bName) {
                return [];
            }
        };
        oController.bLoadDataOnMFBSearch = true;
        oController.onMacroFilterBarSearch(oEvent);
        assert.ok(oController.aFilters.length === 0, "Result will be no filters will be applied to macro filter bar.");
    });

    QUnit.test("test onMacroFilterBarSearch Check filter bar conditions model when one filter is applied", function (assert) {
        oController.getView = function () {
            return {
                fnMacroFilterBarLoaded: true,
                byId: function (param) {
                    if (param === "ovpGlobalFilter") {
                        return false;
                    }
                    return {
                        setVisible: function (param) { },
                        setHeaderExpanded: function (params) { },
                        setActive: function (params) { },
                    };
                },
                setModel: function (oData, sModelName) {
                    oController.modelName = sModelName;
                    oController.modelData = oData;
                },
                getModel: function (sModelName) {
                    return {
                        getProperty: function (sPropertyName) {
                            return oController.modelData.getProperty(sPropertyName);
                        },
                        setProperty: function (sPropertyName, value) {
                            oController.modelData.setProperty(sPropertyName, value);
                        },
                    };
                },
            };
        };
        var uiModel = new JSONModel({
            enableLiveFilter: true,
        });
        oController.getUIModel = function () {
            return uiModel;
        };
        oController.oMacroFilterBar = true;
        oController.oGlobalFilter = false;
        oController.globalEventBus = {
            publish: function () { },
        };
        var oEvent = {
            getParameter: function (bName) {
                return [
                    {
                        "aFilters": [
                            {
                                "sPath": "ID",
                                "sOperator": "EQ",
                                "oValue1": 201,
                                "_bMultiFilter": false
                            }
                        ],
                        "_bMultiFilter": true
                    }
                ];
            },
        };
        oController.bLoadDataOnMFBSearch = true;
        oController.onMacroFilterBarSearch(oEvent);
        var sFilterQuery = decodeURIComponent(ODataUtils.createFilterParams(oController.aFilters));
        assert.ok(sFilterQuery === "$filter=ID eq 201", "Result will be one filter applied to macro filter bar.");
        assert.ok(oController.aFilters[0].aFilters.length === 1, "Result will be one filter applied to macro filter bar.");
    });

    QUnit.test("test onMacroFilterBarSearch Check filter bar conditions model when multiple filters are applied", function (assert) {
        oController.getView = function () {
            return {
                fnMacroFilterBarLoaded: true,
                byId: function (param) {
                    if (param === "ovpGlobalFilter") {
                        return false;
                    }
                    return {
                        setVisible: function (param) { },
                        setHeaderExpanded: function (params) { },
                        setActive: function (params) { },
                    };
                },
                setModel: function (oData, sModelName) {
                    oController.modelName = sModelName;
                    oController.modelData = oData;
                },
                getModel: function (sModelName) {
                    return {
                        getProperty: function (sPropertyName) {
                            return oController.modelData.getProperty(sPropertyName);
                        },
                        setProperty: function (sPropertyName, value) {
                            oController.modelData.setProperty(sPropertyName, value);
                        },
                    };
                },
            };
        };
        var uiModel = new JSONModel({
            enableLiveFilter: true,
        });
        oController.getUIModel = function () {
            return uiModel;
        };
        oController.oMacroFilterBar = true;
        oController.oGlobalFilter = false;
        oController.globalEventBus = {
            publish: function () { },
        };
        var oEvent = {
            getParameter: function (bName) {
                return [
                    {
                        "aFilters": [
                            {
                                "sPath": "ID",
                                "sOperator": "EQ",
                                "oValue1": 207,
                                "_bMultiFilter": false
                            },
                            {
                                "sPath": "title",
                                "sOperator": "EQ",
                                "oValue1": "India",
                                "_bMultiFilter": false
                            }
                        ],
                        "bAnd": true,
                        "_bMultiFilter": true
                    }
                ];
            },
        };
        oController.bLoadDataOnMFBSearch = true;
        oController.onMacroFilterBarSearch(oEvent);
        var sFilterQuery = decodeURIComponent(ODataUtils.createFilterParams(oController.aFilters));
        assert.ok(sFilterQuery === "$filter=ID eq 207 and title eq India", "ID field is equal to 201 and title equal to India, different field values are separated by 'and'");
        assert.ok(oController.aFilters[0].aFilters.length === 2, "Result will be 2 filters will be applied to macro filter bar.");
    });

    QUnit.test("test onMacroFilterBarSearch - Validate filters when multiple filters are applied for same property path", function (assert) {
        oController.getView = function () {
            return {
                fnMacroFilterBarLoaded: true,
                byId: function (param) {
                    if (param === "ovpGlobalFilter") {
                        return false;
                    }
                    return {
                        setVisible: function (param) { },
                        setHeaderExpanded: function (params) { },
                        getHeaderExpanded: function (params) { return true },
                        setActive: function (params) { },
                    };
                },
                setModel: function (oData, sModelName) {
                    oController.modelName = sModelName;
                    oController.modelData = oData;
                },
                getModel: function (sModelName) {
                    return {
                        getProperty: function (sPropertyName) {
                            return oController.modelData.getProperty(sPropertyName);
                        },
                        setProperty: function (sPropertyName, value) {
                            oController.modelData.setProperty(sPropertyName, value);
                        },
                    };
                },
            };
        };
        var uiModel = new JSONModel({
            enableLiveFilter: true,
        });
        oController.getUIModel = function () {
            return uiModel;
        };
        oController.oMacroFilterBar = true;
        oController.oGlobalFilter = false;
        oController.globalEventBus = {
            publish: function () { },
        };
        var oEvent = {
            getParameter: function (bName) {
                return [
                    {
                        "aFilters": [
                            {
                                "sPath": "ID",
                                "sOperator": "EQ",
                                "oValue1": 201,
                                "_bMultiFilter": false
                            },
                            {
                                "sPath": "ID",
                                "sOperator": "EQ",
                                "oValue1": 207,
                                "_bMultiFilter": false
                            }
                        ],
                        "_bMultiFilter": true
                    }
                ];
            },
        };
        oController.bLoadDataOnMFBSearch = true;
        oController.onMacroFilterBarSearch(oEvent);
        var sFilterQuery = decodeURIComponent(ODataUtils.createFilterParams(oController.aFilters));
        assert.ok(sFilterQuery === "$filter=ID eq 201 or ID eq 207", "Result will be 2 filters will be applied to macro filter bar.");
        assert.ok(oController.aFilters[0].aFilters.length === 2, "Result will be 2 filters will be applied to macro filter bar.");
    });

    QUnit.test("onMacroFilterBarSearch - filter conditions should be converted correctly into filters, multiple filters, any of the filters having multiple values", function(assert) {
        oController.getView = function () {
            return {
                fnMacroFilterBarLoaded: true,
                byId: function (param) {
                    if (param === "ovpGlobalFilter") {
                        return false;
                    }
                    return {
                        setVisible: function (param) { },
                        setHeaderExpanded: function (params) { },
                        getHeaderExpanded: function (params) { return true },
                        setActive: function (params) { },
                    };
                },
                setModel: function (oData, sModelName) {
                    oController.modelName = sModelName;
                    oController.modelData = oData;
                },
                getModel: function (sModelName) {
                    return {
                        getProperty: function (sPropertyName) {
                            return oController.modelData.getProperty(sPropertyName);
                        },
                        setProperty: function (sPropertyName, value) {
                            oController.modelData.setProperty(sPropertyName, value);
                        },
                    };
                },
            };
        };
        var uiModel = new JSONModel({
            enableLiveFilter: true,
        });
        oController.getUIModel = function () {
            return uiModel;
        };
        oController.oMacroFilterBar = true;
        oController.oGlobalFilter = false;
        oController.globalEventBus = {
            publish: function () { },
        };
        var oEvent = {
            getParameter: function (bName) {
                return [
                    {
                        "aFilters": [
                            {
                                "aFilters": [
                                    {
                                        "sPath": "ID",
                                        "sOperator": "EQ",
                                        "oValue1": 201,
                                        "_bMultiFilter": false
                                    },
                                    {
                                        "sPath": "ID",
                                        "sOperator": "EQ",
                                        "oValue1": 207,
                                        "_bMultiFilter": false
                                    }
                                ],
                                "_bMultiFilter": true
                            },
                            {
                                "sPath": "title",
                                "sOperator": "EQ",
                                "oValue1": "abc",
                                "_bMultiFilter": false
                            }
                        ],
                        "bAnd": true,
                        "_bMultiFilter": true
                    }
                ];    
            },
        };
        oController.bLoadDataOnMFBSearch = true;
        oController.onMacroFilterBarSearch(oEvent);
        var sFilterQuery = decodeURIComponent(ODataUtils.createFilterParams(oController.aFilters));
        assert.ok(sFilterQuery === "$filter=(ID eq 201 or ID eq 207) and title eq abc", "ID field is equal to 201 or 207, different fields are separated by 'and'");
    });

    QUnit.test("onMacroFilterBarSearch - filter conditions should be converted correctly into filters, multiple filters, each filter having multiple values", function(assert) {
        oController.getView = function () {
            return {
                fnMacroFilterBarLoaded: true,
                byId: function (param) {
                    if (param === "ovpGlobalFilter") {
                        return false;
                    }
                    return {
                        setVisible: function (param) { },
                        setHeaderExpanded: function (params) { },
                        getHeaderExpanded: function (params) { return true },
                        setActive: function (params) { },
                    };
                },
                setModel: function (oData, sModelName) {
                    oController.modelName = sModelName;
                    oController.modelData = oData;
                },
                getModel: function (sModelName) {
                    return {
                        getProperty: function (sPropertyName) {
                            return oController.modelData.getProperty(sPropertyName);
                        },
                        setProperty: function (sPropertyName, value) {
                            oController.modelData.setProperty(sPropertyName, value);
                        },
                    };
                },
            };
        };
        var uiModel = new JSONModel({
            enableLiveFilter: true,
        });
        oController.getUIModel = function () {
            return uiModel;
        };
        oController.oMacroFilterBar = true;
        oController.oGlobalFilter = false;
        oController.globalEventBus = {
            publish: function () { },
        };
        var oEvent = {
            getParameter: function (bName) {
                return [
                    {
                        "aFilters": [
                            {
                                "aFilters": [
                                    {
                                        "sPath": "ID",
                                        "sOperator": "EQ",
                                        "oValue1": 207,
                                        "_bMultiFilter": false
                                    },
                                    {
                                        "sPath": "ID",
                                        "sOperator": "EQ",
                                        "oValue1": 201,
                                        "_bMultiFilter": false
                                    }
                                ],
                                "_bMultiFilter": true
                            },
                            {
                                "aFilters": [
                                    {
                                        "sPath": "title",
                                        "sOperator": "EQ",
                                        "oValue1": "India",
                                        "_bMultiFilter": false
                                    },
                                    {
                                        "sPath": "title",
                                        "sOperator": "EQ",
                                        "oValue1": "US",
                                        "_bMultiFilter": false
                                    }
                                ],
                                "_bMultiFilter": true
                            }
                        ],
                        "bAnd": true,
                        "_bMultiFilter": true
                    }
                ];
            }
        };
        oController.bLoadDataOnMFBSearch = true;
        oController.onMacroFilterBarSearch(oEvent);
        var sFilterQuery = decodeURIComponent(ODataUtils.createFilterParams(oController.aFilters));
        assert.ok(sFilterQuery === "$filter=(ID eq 207 or ID eq 201) and (title eq India or title eq US)", "ID field is equal to 201 or 207, different fields are separated by 'and'");
    });
    QUnit.test("fnExecuteOnSelectForCurrentVariant method- To check if Apply automatically is enabled or not", function (assert) {
        var aVariants = [{key: 'variant', executeOnSelect: true}, {key: 'variant2'}];
        var sKey = "variant";
        var sResult = oController.fnExecuteOnSelectForCurrentVariant(aVariants,sKey);
        assert.ok(sResult === true, "Apply automatically is checked");
        var sKey1 = "variant2"
        var sResult1 = oController.fnExecuteOnSelectForCurrentVariant(aVariants,sKey1);
        assert.ok(sResult1 === false, "Apply automatically is not checked");
    });
    QUnit.test("getDataLoadSettings method of an Application", function (assert) {
        var sResult = oController.getDataLoadSettings();
        var sExpected = "ifAnyFilterExist";
        assert.ok(sResult == sExpected, "When no dataLoad setting from manifest then default is ifAnyFilterExist");
    });
    QUnit.test("fnPresetFiltersAppliedInMFB method", function (assert) {
        var oMacroFilter = {
            getFilters: function () {
                return false;
            }
        };
        var sResult = oController.fnPresetFiltersAppliedInMFB(oMacroFilter);
        var sExpected = false;
        assert.ok(sResult == sExpected, "No preset filter set");
    });

    QUnit.test("deactivating iAppState when UI adaptation is active", function (assert) {
        this.dPromise = new Promise(function (resolve, reject) {
            resolve("dummyAppStateKey");
        });
        var oCurrentAppState = {
            appStateKey: "dummyAppStateKey",
            promise: this.dPromise,
        };

        var storeInnerAppStateAsyncStub = function () {
            return oCurrentAppState;
        };
        var replaceHashStub = function () {
            return;
        };
        oController.bGlobalFilterLoaded = true;
        oController.oNavigationHandler = {
            storeInnerAppStateAsync: storeInnerAppStateAsyncStub,
            replaceHash: replaceHashStub,
        };
        oController.getUIModel = function () {
            return new JSONModel({
                bRTAActive: true
            });
        };

        var replaceHashSpy = sinon.spy(oController.oNavigationHandler, "replaceHash");
        var fnDone = assert.async();
        oController._storeCurrentAppStateAndAdjustURL();
        setTimeout(function () {
            assert.ok(replaceHashSpy.notCalled, "iAppState Should not be updated");
            fnDone();
        }.bind(this), 0);
    });

    QUnit.test("onBeforeSFBVariantSave function when there are custom extensions - oCustomData has one or more keys, getBasicSearchControl does not return any value", function(assert) {
        var oMockFilter = {
            getFilterData: this.stub().returns(
                {
                    "$Parameter.P_DisplayCurrency": "EUR",
                    "DeliveryDate": {
                        "conditionTypeInfo": {
                            "name": "sap.ui.comp.config.condition.DateRangeType",
                            "data": {
                                "operation": "LASTQUARTER",
                                "value1": null,
                                "value2": null,
                                "key": "DeliveryDate",
                                "tokenText": "",
                                "calendarType": "Gregorian"
                            }
                        },
                        "ranges": [
                            {
                                "operation": "BT",
                                "value1": "2023-12-31T18:30:00.000Z",
                                "value2": "2024-03-31T18:29:59.999Z"
                            }
                        ],
                        "items": []
                    }
                }
            ),
            getBasicSearchControl: this.stub().returns({}),
            setFilterData: this.spy(),
            fireFilterChange: this.spy()
        };
        this.stub(oController, 'getGlobalFilter').returns(oMockFilter);

        var getAppStateStub = this.stub(oController, '_getCustomAppState');
        getAppStateStub.returns({
            "sap.ovp.app.customData": {
                "ProductID": 1,
                "SalesOrderID": 2
            }
        });

        oController.onBeforeSFBVariantSave();
        assert.ok(oMockFilter.setFilterData.calledOnce, "setFilterData was called");
        assert.ok(oMockFilter.fireFilterChange.calledOnce, "fireFilterChange was called");
    });

    QUnit.test("onBeforeSFBVariantSave function when there are no custom extensions - oCustomData does not have any keys, getBasicSearchControl has value", function(assert) {
        var oMockFilter = {
            getFilterData: this.stub().returns({}),
            getBasicSearchControl: this.stub().returns({ getValue: this.stub().returns("searchText"), setValue: this.stub() }),
            setFilterData: this.spy(),
            fireFilterChange: this.spy()
        };
        this.stub(oController, 'getGlobalFilter').returns(oMockFilter);
        var getAppStateStub = this.stub(oController, '_getCustomAppState');
        getAppStateStub.returns({});

        oController.onBeforeSFBVariantSave();
        assert.ok(oMockFilter.setFilterData.notCalled, "setFilterData was not called");
        assert.ok(oMockFilter.fireFilterChange.calledOnce, "fireFilterChange was called");
    });
    
    QUnit.test("onBeforeSFBVariantSave function when there are no custom extensions - oCustomData does not have any keys, getBasicSearchControl does not return any value", function(assert) {
        var oMockFilter = {
            getFilterData: this.stub().returns({}),
            getBasicSearchControl: this.stub().returns({}),
            setFilterData: this.spy(),
            fireFilterChange: this.spy()
        };
        this.stub(oController, 'getGlobalFilter').returns(oMockFilter);
        var getAppStateStub = this.stub(oController, '_getCustomAppState');
        getAppStateStub.returns({});

        oController.onBeforeSFBVariantSave();
        assert.ok(oMockFilter.setFilterData.notCalled, "setFilterData was not called");
        assert.ok(oMockFilter.fireFilterChange.notCalled, "fireFilterChange was not called");
    });
});
