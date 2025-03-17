// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/m/library",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/library",
    "sap/ushell/playground/controller/BaseController",
    "sap/ushell/ui/launchpad/VizInstanceCdm",
    "sap/ui/core/util/MockServer",
    "sap/ushell/Config",
    "sap/ushell/Container"
], function (
    Localization,
    mobileLibrary,
    JSONModel,
    ushellLibrary,
    BaseController,
    VizInstanceCdm,
    MockServer,
    Config,
    Container
) {
    "use strict";

    // shortcut for sap.m.TileSizeBehavior
    var TileSizeBehavior = mobileLibrary.TileSizeBehavior;

    // shortcut for sap.ushell.DisplayFormat
    var DisplayFormat = ushellLibrary.DisplayFormat;

    /* global sinon */
    const sandbox = sinon.createSandbox({});

    var oModel,
        oSection;

    var oMockServer = new MockServer({
        recordRequests: false
    });

    return BaseController.extend("sap.ushell.playground.controller.DynamicTile", {

        prepareMocks: function () {
            sandbox.restore(); // prepareMocks might be called multiple times

            // Usage in DynamicTileRequest
            sandbox.stub(Container, "getLogonSystem");
            sandbox.stub(Container, "getServiceAsync");

            Container.getServiceAsync.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: async function () { }
            });

            Container.getServiceAsync.withArgs("ReferenceResolver").resolves({
                resolveSemanticDateRanges: async function () {
                    return {
                        url: "/mock/semanticDateRanges",
                        hasSemanticDateRanges: false,
                        invalidSemanticDates: [],
                        ignoredReferences: []
                    };
                },
                resolveUserDefaultParameters: async function () {
                    return {
                        url: "/mock/userDefaultParameters"
                    };
                }
            });

            oMockServer.setRequests([{
                method: "GET",
                path: ".*/mock/.*",
                response: this._handleRequest.bind(this)
            }]);
            oMockServer.start();
        },

        restoreMocks: function () {
            sandbox.restore();

            oMockServer.stop();
        },

        onInit: function () {
            this.prepareMocks();
            oModel = new JSONModel({
                sizeBehaviorOptions: [
                    { key: TileSizeBehavior.Small },
                    { key: TileSizeBehavior.Responsive }
                ],
                currentSizeBehavior: TileSizeBehavior.Responsive,
                icons: [
                    { key: "", text: "none" },
                    { key: "sap-icon://cargo-train", text: "sap-icon://cargo-train" }
                ],
                displayFormats: [
                    { key: DisplayFormat.Standard },
                    { key: DisplayFormat.StandardWide },
                    { key: DisplayFormat.Flat },
                    { key: DisplayFormat.FlatWide }
                ],
                locales: [
                    { key: "de-DE" },
                    { key: "en-US" },
                    { key: "ja-JP" },
                    { key: "he-IL" },
                    { key: "ar-AE" }
                ],
                currentLocale: "de-DE",
                visualizations: [{
                    id: 0,
                    title: "DynamicTile",
                    subtitle: "with Subtitle",
                    info: "",
                    numberUnit: "",
                    icon: "sap-icon://cargo-train",
                    indicatorDataSource: {
                        path: "/mock/count"
                    },
                    displayFormat: DisplayFormat.Standard
                }],
                mockResponse: JSON.stringify({
                    info: "Footer",
                    infoState: "Positive",
                    number: 123456.789,
                    numberDigits: 1,
                    numberState: "Positive",
                    numberUnit: "EUR",
                    stateArrow: "Up"
                }, null, 2)
            });

            oSection = this.getView().byId("playgroundSection");

            Localization.attachChange(this._handleLanguageChange, this);

            this.getView().setModel(oModel);
        },

        _updateLocale: function () {
            Localization.setLanguage(oModel.getProperty("/currentLocale"));
            this._resetTile();
        },

        _handleLanguageChange: function () {
            setTimeout(function () {
                // After the LTR config changes the container gets rendered too small
                oSection.getParent().invalidate();
            }, 1000);
        },

        _refreshTile: function () {
            var oVizInstance = oSection.getVisualizations()[0];
            oVizInstance.refresh();
        },

        _resetTile: function () {
            /* By increasing the id we enforce that the VizInstance gets build from scratch
            This is required since the DynamicTile does not bind and update its properties
            on the VizInstance. */
            var oFirstViz = oModel.getProperty("/visualizations/0");
            oFirstViz.id += 1;
            oModel.refresh();
        },

        _handleRequest: function (oXHR) {
            if (oXHR.readyState > 1) {
                return; // request was already handled
            }
            oXHR.respondJSON(200, null, oModel.getProperty("/mockResponse"));
        },

        _updateSizeBehavior: function () {
            var sSizeBehavior = oModel.getProperty("/currentSizeBehavior");
            Config.emit("/core/home/sizeBehavior", sSizeBehavior);
        },

        _visualizationFactory: function (sId, oContext) {
            var oTileData = oContext.getObject();
            var oVizData = {
                active: true,
                title: oTileData.title,
                subtitle: oTileData.subtitle,
                info: oTileData.info,
                numberUnit: oTileData.numberUnit,
                icon: oTileData.icon,
                displayFormat: oTileData.displayFormat,
                indicatorDataSource: oTileData.indicatorDataSource,
                instantiationData: {
                    vizType: {
                        "sap.ui5": {
                            componentName: "sap.ushell.components.tiles.cdm.applauncherdynamic"
                        }
                    }
                }
            };
            oVizData.indicatorDataSource.ui5object = true;
            var oTile = new VizInstanceCdm(oVizData);
            oTile.load();
            return oTile;
        }
    });
});
