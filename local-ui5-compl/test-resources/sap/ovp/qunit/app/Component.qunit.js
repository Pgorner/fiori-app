/*global QUnit*/

sap.ui.define([
    "sap/ovp/app/Component",
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ui/thirdparty/jquery",
    "sap/ovp/placeholder/placeholderHelper",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/VBox",
    "sap/ui/core/ComponentContainer",
    "sap/ui/fl/apply/api/FlexRuntimeInfoAPI",
    "sap/suite/ui/commons/collaboration/CollaborationHelper",
    "sap/ui/core/Element",
    "sap/ui/base/DesignTime",
    "sap/ushell/Container"
], function (
    AppComponent,
    CardUtils,
    mockservers,
    jquery,
    placeholderHelper,
    ODataModel,
    VBox,
    ComponentContainer,
    FlexRuntimeInfoAPI,
    CollaborationHelper,
    CoreElement,
    DesignTime,
    UshellContainer
) {
    "use strict";

    var oModel, oComponent;
    
    // Workaround for bypassing expandhash functionality.
    CollaborationHelper.processAndExpandHash = undefined;

    QUnit.module("sap.ovp.app.Component", {
        beforeEach: function () {
            oComponent = new AppComponent();
        },
        afterEach: function () {
            oComponent.destroy();
        }
    });

    function _stubGetOvpConfig() {
        sinon.stub(oComponent, "getOvpConfig", function () {
            return {
                globalFilterModel: "salesOrder",
                globalFilterEntityType: "GlobalFilters",
                showDateInRelativeFormat: false,
                considerAnalyticalParameters: true,
                useDateRangeType: false,
                refreshIntervalInMinutes: 12,
                disableTableCardFlexibility: false,
                cards: {
                    card010_QuickLinks: {
                        model: "salesOrder",
                        template: "sap.ovp.cards.linklist",
                        settings: {
                            title: "Quick Links",
                            subTitle: "Standard Link List With Static Data",
                            listFlavor: "standard",
                            defaultSpan: {
                                rows: 15,
                                cols: 1,
                            },
                            staticContent: [
                                {
                                    title: "Create Purchase Order",
                                    imageUri: "sap-icon://Fiori6/F0865",
                                    imageAltText: "{{card30_icon_prod_man}}",
                                    semanticObject: "procurement",
                                    action: "overview",
                                },
                                {
                                    title: "Create Supplier",
                                    imageUri: "sap-icon://Fiori2/F0246",
                                    imageAltText: "{{card30_icon_so_man}}",
                                    semanticObject: "Action",
                                    action: "toappnavsample",
                                },
                                {
                                    title: "Create Contact",
                                    imageUri: "sap-icon://Fiori6/F0866",
                                    imageAltText: "{{card30_icon_so_man}}",
                                    semanticObject: "Action",
                                    action: "toappnavsample",
                                },
                            ],
                        },
                    },
                },
            };
        });
    }

    QUnit.test("Test setContainer function", function (assert) {
        //TODO: Improve this test case to check different types of manifest inputted to setContainer function
        mockservers.loadMockServer(CardUtils.odataBaseUrl_salesOrder, CardUtils.odataRootUrl_salesOrder);
        oModel = new ODataModel(CardUtils.odataRootUrl_salesOrder, {
            annotationURI: CardUtils.testBaseUrl + "data/annotations.xml",
            json: true,
            loadMetadataAsync: false,
        });
        oComponent.setModel(oModel);
        sinon.stub(oModel.getMetaModel(), "getODataEntityContainer", function () {
            return {
                namespace: "GWSAMPLE_BASIC",
                entitySet: [
                    {
                        name: "Entity_A",
                        entityType: "Demo_CDS.EntityType_A",
                    },
                    {
                        name: "Entity_B",
                        entityType: "Demo_CDS.EntityType_B",
                    },
                ],
            };
        });

        sinon.stub(oComponent, "getModel", function (sModelName) {
            return oModel;
        });

        sinon.stub(FlexRuntimeInfoAPI, "waitForChanges", function() {
            return Promise.resolve([]);
        });

        sinon.stub(oComponent, "getOvpConfig", function () {
            return {
                globalFilterModel: "salesOrder",
                globalFilterEntityType: "GlobalFilters",
                showDateInRelativeFormat: false,
                considerAnalyticalParameters: true,
                useDateRangeType: false,
                refreshIntervalInMinutes: 12,
                disableTableCardFlexibility: false,
                filterSettings: {
                    dateSettings: {
                        selectedValues: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
                        exclude: true,
                        DeliveryDate: {
                            selectedValues: "FROM,TO,DAYS,WEEK,MONTH,DATERANGE,TODAY,TOMORROW,YEAR,YESTERDAY",
                            exclude: true,
                        },
                        CreatedDate: {
                            customDateRangeImplementation: "sap.ovp.demo.ext.customDateRangeType",
                            selectedValues: "FROM, TO",
                            exclude: true,
                        },
                    },
                },
                cards: {
                    card010_QuickLinks: {
                        model: "salesOrder",
                        template: "sap.ovp.cards.linklist",
                        settings: {
                            title: "Quick Links",
                            subTitle: "Standard Link List With Static Data",
                            listFlavor: "standard",
                            defaultSpan: {
                                rows: 15,
                                cols: 1,
                            },
                            staticContent: [
                                {
                                    title: "Create Purchase Order",
                                    imageUri: "sap-icon://Fiori6/F0865",
                                    imageAltText: "{{card30_icon_prod_man}}",
                                    semanticObject: "procurement",
                                    action: "overview",
                                },
                                {
                                    title: "Create Supplier",
                                    imageUri: "sap-icon://Fiori2/F0246",
                                    imageAltText: "{{card30_icon_so_man}}",
                                    semanticObject: "Action",
                                    action: "toappnavsample",
                                },
                                {
                                    title: "Create Contact",
                                    imageUri: "sap-icon://Fiori6/F0866",
                                    imageAltText: "{{card30_icon_so_man}}",
                                    semanticObject: "Action",
                                    action: "toappnavsample",
                                },
                            ],
                        },
                    },
                },
            };
        });

        document.body.insertAdjacentHTML("beforeend", '<div id="testContainer" style="display: none;">');
        var testContainer = document.querySelector("#testContainer");
        var oView = new VBox("TestVBox1");
        oView.setModel(oModel, "salesOrder");
        var oComponentContainer = new ComponentContainer("ovpLayout1");
        oView.addItem(oComponentContainer);
        oView.byId = function (id) {
            return CoreElement.getElementById(id);
        };
        oView.placeAt("testContainer");
        oComponentContainer.setComponent(oComponent);
        var GetServiceAsyncStub = sinon.stub(UshellContainer, "getServiceAsync").returns(
            Promise.resolve({
                isNavigationSupported: function (aList){
                    aList.forEach(function (s) {
                        if (s.target.shellHash !== "#procurement-overview") {
                            s.supported = true;
                        } else {
                            s.supported = false;
                        }
                    });
                    return Promise.resolve(aList);
                }
            })
        );
        oComponent.onServicesStarted();
        var fnDone = assert.async();

        setTimeout(function () {
            assert.ok(true, "Checking if setContainer function for app/component.js is working or not");
            var oUIModel = oComponent.oModels.ui;
            assert.ok(oUIModel.getProperty("/bHeaderExpanded") === true, "Checking bHeaderExpanded is true");
            fnDone();
            GetServiceAsyncStub.restore();
        }.bind(this), 2000);
    });

    QUnit.test("Test page level placeholder", function (assert) {
        placeholderHelper.isPlaceHolderEnabled = function () {
            return true;
        };
        placeholderHelper.getRelatedCaseEnabled = function () {
            return "pageLevel";
        };
        placeholderHelper.showPlaceholder = function (oNavContainer) {
            if (placeholderHelper.isPlaceHolderEnabled() && !placeholderHelper.bPlaceholderShown) {
                placeholderHelper.navContainer = oNavContainer;
                placeholderHelper.bPlaceholderShown = true;
                oNavContainer.showPlaceholder({ placeholder: placeholderHelper.getPlaceholderInfo() });
            }
            assert.ok(placeholderHelper.hidePlaceholderNeeded() === true, "NavContainer called showPlaceholder");
        };

        //TODO: Improve this test case to check different types of manifest inputted to setContainer function
        mockservers.loadMockServer(CardUtils.odataBaseUrl_salesOrder, CardUtils.odataRootUrl_salesOrder);
        oModel = new ODataModel(CardUtils.odataRootUrl_salesOrder, {
            annotationURI: CardUtils.testBaseUrl + "data/annotations.xml",
            json: true,
            loadMetadataAsync: false,
        });
        oComponent.setModel(oModel);
        sinon.stub(oModel.getMetaModel(), "getODataEntityContainer", function () {
            return {
                namespace: "GWSAMPLE_BASIC",
                entitySet: [
                    {
                        name: "Entity_A",
                        entityType: "Demo_CDS.EntityType_A",
                    },
                    {
                        name: "Entity_B",
                        entityType: "Demo_CDS.EntityType_B",
                    },
                ],
            };
        });
        sinon.stub(oComponent, "getModel", function (sModelName) {
            return oModel;
        });
        sinon.stub(oComponent, "getOvpConfig", function () {
            return {
                globalFilterModel: "salesOrder",
                globalFilterEntityType: "GlobalFilters",
                showDateInRelativeFormat: false,
                considerAnalyticalParameters: true,
                useDateRangeType: false,
                refreshIntervalInMinutes: 12,
                disableTableCardFlexibility: false,
                filterSettings: {
                    dateSettings: {
                        selectedValues: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
                        exclude: true,
                        DeliveryDate: {
                            selectedValues: "FROM,TO,DAYS,WEEK,MONTH,DATERANGE,TODAY,TOMORROW,YEAR,YESTERDAY",
                            exclude: true,
                        },
                        CreatedDate: {
                            customDateRangeImplementation: "sap.ovp.demo.ext.customDateRangeType",
                            selectedValues: "FROM, TO",
                            exclude: true,
                        },
                    },
                },
                cards: {
                    card010_QuickLinks: {
                        model: "salesOrder",
                        template: "sap.ovp.cards.linklist",
                        settings: {
                            title: "Quick Links",
                            subTitle: "Standard Link List With Static Data",
                            listFlavor: "standard",
                            defaultSpan: {
                                rows: 15,
                                cols: 1,
                            },
                            staticContent: [
                                {
                                    title: "Create Purchase Order",
                                    imageUri: "sap-icon://Fiori6/F0865",
                                    imageAltText: "{{card30_icon_prod_man}}",
                                    semanticObject: "procurement",
                                    action: "overview",
                                },
                                {
                                    title: "Create Supplier",
                                    imageUri: "sap-icon://Fiori2/F0246",
                                    imageAltText: "{{card30_icon_so_man}}",
                                    semanticObject: "Action",
                                    action: "toappnavsample",
                                },
                                {
                                    title: "Create Contact",
                                    imageUri: "sap-icon://Fiori6/F0866",
                                    imageAltText: "{{card30_icon_so_man}}",
                                    semanticObject: "Action",
                                    action: "toappnavsample",
                                },
                            ],
                        },
                    },
                },
            };
        });

        document.body.insertAdjacentHTML("beforeend", '<div id="testContainer1" style="display: none;">');
        var testContainer = document.querySelector("#testContainer1");
        var oView = new VBox("TestVBox2");
        oView.setModel(oModel, "salesOrder");
        var oComponentContainer = new ComponentContainer("ovpLayout2");
        oView.addItem(oComponentContainer);
        oView.byId = function (id) {
            return CoreElement.getElementById(id);
        };
        oView.placeAt("testContainer1");
        oComponentContainer.setComponent(oComponent);
        oComponent.onServicesStarted();
        var fnDone = assert.async();
        setTimeout(
            function () {
                assert.ok(true, "Checking if placeholder is loaded from component or not");
                fnDone();
            }.bind(this),
            500
        );
    });

    QUnit.test("Authorization for Static Link List card on Line Items --> 1", function (assert) {
        _stubGetOvpConfig();
        var GetServiceAsyncStub = sinon.stub(UshellContainer, "getServiceAsync").returns(
            Promise.resolve({
                isNavigationSupported: function (aList){
                    aList.forEach(function (s) {
                        if (s.target.shellHash !== "#procurement-overview") {
                            s.supported = true;
                        } else {
                            s.supported = false;
                        }
                    });
                    return Promise.resolve(aList);
                }
            })
        );

        oModel = new ODataModel(CardUtils.odataRootUrl_salesOrder, {
            annotationURI: CardUtils.testBaseUrl + "data/annotations.xml",
            json: true,
            loadMetadataAsync: false,
        });
        oComponent.setModel(oModel);
        var oPromise = oComponent._checkForAuthorizationForLineItems();
        var fnDone = assert.async();
        oPromise.then(
            function (oOvpConfig) {
                var aStaticContent = oOvpConfig.cards["card010_QuickLinks"].settings.staticContent;
                assert.ok(
                    aStaticContent.length === 2,
                    "One of the line item is not authorized and hence being removed from OVP Configuration"
                );
                fnDone();
                GetServiceAsyncStub.restore();
            },
            function (oError) {
                assert.ok(false, oError);
                fnDone();
                GetServiceAsyncStub.restore();
            }
        );
    });

    QUnit.test("Authorization for Static Link List card on Line Items --> 2", function (assert) {
        _stubGetOvpConfig();
        var GetServiceAsyncStub = sinon.stub(UshellContainer, "getServiceAsync").returns(
            Promise.resolve({
                isNavigationSupported: function (aList){
                    aList.forEach(function (s) {
                        s.supported = true;
                    });
                    return Promise.resolve(aList);
                }
            })
        );

        oModel = new ODataModel(CardUtils.odataRootUrl_salesOrder, {
            annotationURI: CardUtils.testBaseUrl + "data/annotations.xml",
            json: true,
            loadMetadataAsync: false,
        });
        oComponent.setModel(oModel);
        var oPromise = oComponent._checkForAuthorizationForLineItems();
        var fnDone = assert.async();
        oPromise.then(
            function (oOvpConfig) {
                var aStaticContent = oOvpConfig.cards["card010_QuickLinks"].settings.staticContent;
                assert.ok(aStaticContent.length === 3, "Every Line Item is Authorized");
                fnDone();
                GetServiceAsyncStub.restore();
            },
            function (oError) {
                assert.ok(false, oError);
                fnDone();
                GetServiceAsyncStub.restore();
            }
        );
    });

    QUnit.test("Authorization for Static Link List card on Line Items --> 3", function (assert) {
        _stubGetOvpConfig();
        var GetServiceAsyncStub = sinon.stub(UshellContainer, "getServiceAsync").returns(
            Promise.resolve({
                isNavigationSupported: function (aList){
                    aList.forEach(function (s) {
                        s.supported = false;
                    });
                    return Promise.resolve(aList);
                }
            })
        );

        oModel = new ODataModel(CardUtils.odataRootUrl_salesOrder, {
            annotationURI: CardUtils.testBaseUrl + "data/annotations.xml",
            json: true,
            loadMetadataAsync: false,
        });
        oComponent.setModel(oModel);
        var oPromise = oComponent._checkForAuthorizationForLineItems();
        var fnDone = assert.async();
        oPromise.then(
            function (oOvpConfig) {
                var aStaticContent = oOvpConfig.cards["card010_QuickLinks"].settings.staticContent;
                assert.ok(
                    aStaticContent.length === 0,
                    "No Line Item is Authorized and hence removed from the OVP Configuration"
                );
                fnDone();
                GetServiceAsyncStub.restore();
            },
            function (oError) {
                assert.ok(false, oError);
                fnDone();
                GetServiceAsyncStub.restore();
            }
        );
    });

    QUnit.test("Test _checkForAuthorizationForCards should not update the ovpconfig in design mode", function (assert) {

        mockservers.loadMockServer(CardUtils.odataBaseUrl_salesOrder, CardUtils.odataRootUrl_salesOrder);
        oModel = new ODataModel(CardUtils.odataRootUrl_salesOrder, {
            annotationURI: CardUtils.testBaseUrl + "data/annotations.xml",
            json: true,
            loadMetadataAsync: false,
        });
        oComponent.setModel(oModel);

        sinon.stub(oComponent, "getOvpConfig", function () {
            return {
                cards: {
                    "card15": {
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.stack",
                        "settings": {
                            "itemText": "{{stackCard_itemText}}",
                            "title": "Awaiting Purchase Order Approval",
                            "subTitle": "Sorted by delivery date",
                            "entitySet": "SalesOrderLineItemSet",
                            "annotationPath": "com.sap.vocabularies.UI.v1.FieldGroup#Note/Data,com.sap.vocabularies.UI.v1.FieldGroup#Note1/Data",
                            "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification,com.sap.vocabularies.UI.v1.Identification#Awaiting_Approval",
                            "requireAppAuthorization": "#SalesOrder-analyzeIncoming"
                        }
                    },
                    "card01": {
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.stack",
                        "settings": {
                            "itemText": "{{stackCard_itemText}}",
                            "title": "Awaiting Purchase Order Approval",
                            "subTitle": "Sorted by delivery date",
                            "entitySet": "SalesOrderLineItemSet",
                            "annotationPath": "com.sap.vocabularies.UI.v1.FieldGroup#Note/Data,com.sap.vocabularies.UI.v1.FieldGroup#Note1/Data",
                            "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification,com.sap.vocabularies.UI.v1.Identification#Awaiting_Approval"
                        }
                    }
                }
            };
        });

        var GetServiceAsyncStub = sinon.stub(UshellContainer, "getServiceAsync").returns(
            Promise.resolve({
                isNavigationSupported: function (aList){
                    var o = {};
                    aList.forEach(function (s) {
                        o[s] = { supported: false };
                    });
                    return Promise.resolve([o]);
                }
            })
        );
        
        var ovpConfig = oComponent.getOvpConfig();

        var isDesignModeEnabledStub = sinon.stub(DesignTime, "isDesignModeEnabled").returns(true);
        var fnDone = assert.async();
        assert.ok(ovpConfig.cards["card01"], "card01 is present in ovp config initially");
        assert.ok(ovpConfig.cards["card15"], "card15 is present in ovp config initially");

        oComponent._checkForAuthorizationForCards(ovpConfig).then(function(oResponse) {
            assert.ok(oResponse.cards["card01"], "card01 is present in ovp config as the app is running in design mode");
            assert.ok(oResponse.cards["card15"], "card15 is present in ovp config as the app is running in design mode");
            fnDone();
        });
        isDesignModeEnabledStub.restore();

        assert.ok(ovpConfig.cards["card01"], "card01 is present in ovp config initially");
        assert.ok(ovpConfig.cards["card15"], "card15 is present in ovp config initially");

        var fnDone1 = assert.async();
        oComponent._checkForAuthorizationForCards(ovpConfig).then(function(oResponse) {
            assert.ok(oResponse.cards["card01"], "The supported card is present in the ovp config");
            assert.ok(!oResponse.cards["card15"], "The unsupported card is not in the ovp config");
            fnDone1();
            GetServiceAsyncStub.restore();
        });
    });

    QUnit.test("should define getDashboardLayoutUtil function", function (assert) {
        mockservers.loadMockServer(CardUtils.odataBaseUrl_salesOrder, CardUtils.odataRootUrl_salesOrder);
        oModel = new ODataModel(CardUtils.odataRootUrl_salesOrder, {
            annotationURI: CardUtils.testBaseUrl + "data/annotations.xml",
            json: true,
            loadMetadataAsync: false,
        });
        oComponent.setModel(oModel);

        assert.ok(typeof (oComponent.getDashboardLayoutUtil) === 'function');
    });
});
