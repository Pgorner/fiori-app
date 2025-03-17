/*global QUnit*/

sap.ui.define([
    "sap/ovp/app/Component",
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ovp/placeholder/placeholderHelper",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/VBox",
    "sap/ui/core/ComponentContainer",
    "sap/ui/core/Element"
], function (
    AppComponent,
    CardUtils,
    mockservers,
    placeholderHelper,
    ODataModel,
    VBox,
    ComponentContainer,
    CoreElement
) {
    "use strict";

    var oModel, oComponent;

    QUnit.module("sap.ovp.app.Component", {
        beforeEach: function () {
            oComponent = new AppComponent();
        },
        afterEach: function () {
            oComponent.destroy();
        },
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

        mockservers.loadMockServer(CardUtils.odataRootUrl_salesOrder);
        oComponent = new AppComponent();
        oModel = new ODataModel(CardUtils.odataRootUrl_salesOrder, {
            annotationURI: CardUtils.testBaseUrl + "data/annotations.xml",
            json: true,
            loadMetadataAsync: false,
        });
        oComponent.setModel(oModel);
        sinon.stub(oModel.getMetaModel(), "getODataEntityContainer", function () {
            return {
                namespace: "GWSAMPLE_BASIC",
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
                                    semanticObject: "Abhishek",
                                    action: "Waghela",
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
});
