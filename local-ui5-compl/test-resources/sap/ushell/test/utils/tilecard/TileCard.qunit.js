// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.utils.tilecard.TileCard
 *
 * Tests the integration with the WorkPageVizInstantiation and
 * the TileCardExtension for Dynamic Tiles
 */
sap.ui.define([
    "sap/ui/core/Core",
    "sap/ui/integration/widgets/Card",
    "sap/ushell/utils/workpage/WorkPageVizInstantiation",
    "sap/ushell/utils/tilecard/TileCardExtension",
    "sap/ushell/Config"
], function (
    Core,
    Card,
    WorkPageVizInstantiation,
    TileCardExtension,
    Config
) {
    "use strict";
    /* global sinon QUnit */

    const sandbox = sinon.createSandbox({});
    let oCard = null;

    async function wait (ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
    }

    // increase the max depth of the object to be compared
    QUnit.dump.maxDepth = 10;

    const oStaticDataInput = {
        id: "test-viz-id",
        type: "sap.ushell.StaticAppLauncher",
        descriptor: {
            value: {
                "sap.app": {
                    title: "test-title",
                    subTitle: "test-subtitle",
                    info: "test-info",
                    tags: {
                        keywords: ["test-keyword"]
                    }
                },
                "sap.ui": {
                    icons: {
                        icon: "sap-icon://accept"
                    }
                },
                "sap.flp": {
                    numberUnit: "test-numberUnit",
                    indicatorDataSource: {
                        dataSource: "testIndicatorDataSource"
                    },
                    target: {
                        appId: "test-app"
                    },
                    vizOptions: {
                        displayFormats: {
                            default: "standard",
                            supported: [
                                "flat",
                                "standard",
                                "flatWide",
                                "standardWide",
                                "compact"
                            ]
                        }
                    }
                }
            }
        },
        indicatorDataSource: {
            url: "testdata/testurl",
            refreshInterval: 0
        }
    };

    const oDynamicDataInput = {
        id: "test-viz-id",
        type: "sap.ushell.DynamicAppLauncher",
        descriptor: {
            value: {
                "sap.app": {
                    title: "test-title",
                    subTitle: "test-subtitle",
                    info: "test-info",
                    tags: {
                        keywords: ["test-keyword"]
                    }
                },
                "sap.ui": {
                    icons: {
                        icon: "sap-icon://accept"
                    }
                },
                "sap.flp": {
                    numberUnit: "test-numberUnit",
                    indicatorDataSource: {
                        dataSource: "testIndicatorDataSource"
                    },
                    target: {
                        appId: "test-app"
                    },
                    vizOptions: {
                        displayFormats: {
                            default: "standard",
                            supported: [
                                "flat",
                                "standard",
                                "flatWide",
                                "standardWide",
                                "compact"
                            ]
                        }
                    }
                }
            }
        },
        indicatorDataSource: {
            url: "testdata/testurl",
            refreshInterval: 0
        }
    };

    const oStaticTileCardConfiguration = {
        descriptor: {
            value: {
                _version: "1.41.0",
                "sap.app": {
                    id: "test-viz-id",
                    type: "card",
                    tags: {
                        keywords: [
                            "test-keyword"
                        ]
                    },
                    i18n: {
                        bundleName: "sap.ushell.utils.tilecard.resources/resources"
                    }
                },
                "sap.ui": {
                    icons: {
                        icon: "sap-icon://accept"
                    }
                },
                "sap.fiori": {},
                "sap.card": {
                    extension: "",
                    header: {
                        type: "Numeric",
                        title: "test-title",
                        subTitle: "test-subtitle",
                        wrappingType: "Hyphenated",
                        titleMaxLines: 2,
                        subTitleMaxLines: 1,
                        icon: {
                            src: "sap-icon://accept",
                            shape: "Square",
                            visible: true
                        },
                        actions: [],
                        details: {
                            text: "test-info",
                            state: "None"
                        },
                        banner: []
                    },
                    type: "List",
                    configuration: {
                        parameters: {
                            dataPath: {
                                value: "testdata/testurl"
                            }
                        }
                    }
                }
            }
        },
        displayVariant: "TileStandard",
        availableDisplayVariants: [
            "TileFlat",
            "TileStandard",
            "TileFlatWide",
            "TileStandardWide",
            "LinkHeader"
        ],
        error: false
    };

    const oDynamicTileCardConfiguration = {
        descriptor: {
            value: {
                _version: "1.41.0",
                "sap.app": {
                    id: "test-viz-id",
                    type: "card",
                    tags: {
                        keywords: [
                            "test-keyword"
                        ]
                    },
                    i18n: {
                        bundleName: "sap.ushell.utils.tilecard.resources/resources"
                    }
                },
                "sap.ui": {
                    icons: {
                        icon: "sap-icon://accept"
                    }
                },
                "sap.fiori": {},
                "sap.card": {
                    configuration: {
                        parameters: {
                            dataPath: {
                                value: "testdata/testurl"
                            }
                        }
                    },
                    extension: "module:sap/ushell/utils/tilecard/TileCardExtension",
                    header: {
                        actions: [],
                        banner: [],
                        data: {
                            path: "/",
                            request: {
                                method: "GET",
                                retryAfter: 1,
                                url: "{parameters>/dataPath/value}",
                                withCredentials: true
                            },
                            updateInterval: 0
                        },
                        details: {
                            state: "{= ${/_data/details/state} || 'None'}",
                            text: "{= ${/_data/details/text} || 'test-info'}"
                        },
                        icon: {
                            shape: "Square",
                            src: "{= ${/_data/icon} || 'sap-icon://accept'}",
                            visible: "{= !!${/_data/icon}}"
                        },
                        mainIndicator: {
                            number: "{/_data/number}",
                            state: "{/_data/state}",
                            trend: "{/_data/trend}",
                            unit: "{/_data/unit}"
                        },
                        subTitle: "test-subtitle",
                        subTitleMaxLines: 1,
                        title: "test-title",
                        titleMaxLines: 2,
                        type: "Numeric",
                        unitOfMeasurement: "{= ${/numberUnit} || 'test-numberUnit'}",
                        wrappingType: "Hyphenated"
                    },
                    type: "List"
                }
            }
        },
        displayVariant: "TileStandard",
        availableDisplayVariants: [
            "TileFlat",
            "TileStandard",
            "TileFlatWide",
            "TileStandardWide",
            "LinkHeader"
        ],
        error: false
    };

    /**
     * A test renderer of the card, adds to the body
     * @param {object} oConfig The configuration of the card
     * @returns {Promise} The promise of the card resolved after state change
     */
    async function renderCard (oConfig) {
        const mClassMap = {
            TileStandard: "OneByOne",
            TileFlat: "OneByHalf",
            TileStandardWide: "TwoByOne",
            TileFlatWide: "TwoByHalf",
            LinkHeader: "OneByHalf"
        };
        return new Promise(function (resolve) {
            if (oCard) {
                oCard.destroy();
                oCard = null;
            }
            if (!document.getElementById("testArea")) {
                const oStyle = document.createElement("style");
                oStyle.innerHTML = `
                    .TwoByOne { width: 22rem !important; height: 11rem; }
                    .OneByOne { width: 11rem !important; height: 11rem; }
                    .OneByHalf { width: 11rem !important; height: 5rem; }
                    .TwoByHalf { width: 22rem !important; height: 5rem; }
                    #testArea { position: absolute; top: 0; right: 0; width: 25rem; height: 25rem;background-color: #fff; padding: 1rem;}
                `;
                document.body.appendChild(oStyle);
                const oTestArea = document.createElement("div");
                oTestArea.id = "testArea";
                document.body.appendChild(oTestArea);

            } else {
                document.getElementById("testArea").innerHTML = "";
            }

            oCard = new Card({
                manifest: oConfig.descriptor.value,
                dataMode: "Active",
                displayVariant: oConfig.displayVariant,
                stateChanged: function () {
                    Core.applyChanges();
                    resolve(oCard);
                }
            }).addStyleClass(mClassMap[oConfig.displayVariant]);
            oCard.placeAt("testArea");
        });
    }

    /**
     * Test the TileCard creation for Static Tiles
     */
    QUnit.module("Static Tiles", {
        beforeEach: async function (assert) {
            this.oVizInstance = await WorkPageVizInstantiation.getInstance();
            assert.ok(this.oVizInstance, "Instance is created");
        },
        afterEach: function () {
            if (document.getElementById("testArea")) {
                document.getElementById("testArea").remove();
            }
            sandbox.restore();
        }
    });

    QUnit.test("creates Static TileCard configuration and checks standard tile rendering", async function (assert) {

        // Arrange
        const oInput = structuredClone(oStaticDataInput);
        const oOutput = structuredClone(oStaticTileCardConfiguration);
        delete oOutput.descriptor.value["sap.flp"];

        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);
        delete oTileCardConfiguration.descriptor.value["sap.flp"];
        const oRenderedCardInstance = await renderCard(oTileCardConfiguration);
        const oDomRef = oRenderedCardInstance.getDomRef();

        // Assert
        assert.deepEqual(oTileCardConfiguration, oOutput, "TileCard was correctly created");
        assert.ok(oRenderedCardInstance, "Card Instance is created");
        assert.ok(oDomRef, "Card is rendered");
        assert.ok(oDomRef.offsetWidth === 11 * 16, "Card has the correct width");
        assert.ok(oDomRef.offsetHeight === 11 * 16, "Card has the correct height");
    });

    QUnit.test("created Static TileCard and checks flat rendering", async function (assert) {

        // Arrange
        const oInput = structuredClone(oStaticDataInput);
        oInput.descriptor.value["sap.flp"].vizOptions.displayFormats.default = "flat";
        const oOutput = structuredClone(oStaticTileCardConfiguration);
        delete oOutput.descriptor.value["sap.flp"];
        oOutput.displayVariant = "TileFlat";

        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);
        delete oTileCardConfiguration.descriptor.value["sap.flp"];
        const oRenderedCardInstance = await renderCard(oTileCardConfiguration);
        const oDomRef = oRenderedCardInstance.getDomRef();

        // Assert
        assert.deepEqual(oTileCardConfiguration, oOutput, "TileCard was correctly created");
        assert.ok(oRenderedCardInstance, "Card Instance is created");
        assert.ok(oDomRef, "Card is rendered");
        assert.ok(oDomRef.offsetWidth === 11 * 16, "Card has the correct width");
        assert.ok(oDomRef.offsetHeight === 5 * 16, "Card has the correct height");
    });

    QUnit.test("created Static TileCard and checks wide rendering", async function (assert) {

        // Arrange
        const oInput = structuredClone(oStaticDataInput);
        oInput.descriptor.value["sap.flp"].vizOptions.displayFormats.default = "flatWide";
        const oOutput = structuredClone(oStaticTileCardConfiguration);
        delete oOutput.descriptor.value["sap.flp"];
        oOutput.displayVariant = "TileFlatWide";

        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);
        delete oTileCardConfiguration.descriptor.value["sap.flp"];
        const oRenderedCardInstance = await renderCard(oTileCardConfiguration);
        const oDomRef = oRenderedCardInstance.getDomRef();

        // Assert
        assert.deepEqual(oTileCardConfiguration, oOutput, "TileCard was correctly created");
        assert.ok(oRenderedCardInstance, "Card Instance is created");
        assert.ok(oDomRef, "Card is rendered");
        assert.ok(oDomRef.offsetWidth === 22 * 16, "Card has the correct width");
        assert.ok(oDomRef.offsetHeight === 5 * 16, "Card has the correct height");
    });


    QUnit.test("created Static TileCard and checks wide rendering", async function (assert) {

        // Arrange
        const oInput = structuredClone(oStaticDataInput);
        oInput.descriptor.value["sap.flp"].vizOptions.displayFormats.default = "flatWide";
        const oOutput = structuredClone(oStaticTileCardConfiguration);
        delete oOutput.descriptor.value["sap.flp"];
        oOutput.displayVariant = "TileFlatWide";

        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);
        delete oTileCardConfiguration.descriptor.value["sap.flp"];
        const oRenderedCardInstance = await renderCard(oTileCardConfiguration);
        const oDomRef = oRenderedCardInstance.getDomRef();

        // Assert
        assert.deepEqual(oTileCardConfiguration, oOutput, "TileCard was correctly created");
        assert.ok(oRenderedCardInstance, "Card Instance is created");
        assert.ok(oDomRef, "Card is rendered");
        assert.ok(oDomRef.offsetWidth === 22 * 16, "Card has the correct width");
        assert.ok(oDomRef.offsetHeight === 5 * 16, "Card has the correct height");
    });

    QUnit.test("created Static TileCard with system label", async function (assert) {

        // Arrange
        sandbox.stub(Config, "last")
            .withArgs("/core/contentProviders/providerInfo/enabled").returns(true)
            .withArgs("/core/contentProviders/providerInfo/showContentProviderInfoOnVisualizations").returns(true);
        const oInput = structuredClone(oStaticDataInput);
        oInput._siteData = {
            contentProviderId: "test-content-provider",
            contentProviderLabel: "Test Content Provider"
        };
        const oOutput = structuredClone(oStaticTileCardConfiguration);
        delete oOutput.descriptor.value["sap.flp"];
        const oExpectedBanner = [{
            text: "Test Content Provider"
        }];
        oOutput.displayVariant = "TileFlatWide";

        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);
        delete oTileCardConfiguration.descriptor.value["sap.flp"];
        const oRenderedCardInstance = await renderCard(oTileCardConfiguration);
        const oDomRef = oRenderedCardInstance.getDomRef();
        const oCurrentBanner = oTileCardConfiguration.descriptor.value["sap.card"].header.banner;
        const oBannerText = Core.byId(oDomRef.querySelector(".sapFCardHeaderBannerLine").firstElementChild.id);


        // Assert
        assert.deepEqual(oCurrentBanner, oExpectedBanner, "System label was added to the banner");
        assert.ok(oRenderedCardInstance, "Card Instance is created");
        assert.ok(oDomRef, "Card is rendered");
        assert.deepEqual(oBannerText.getText(), "Test Content Provider", "System label has right text");
    });

    QUnit.test("created Static TileCard with navigation from site data", async function (assert) {

        // Arrange
        const oInput = structuredClone(oStaticDataInput);
        oInput._siteData = {
            target: {
                some: "target"
            },
            targetURL: "#Some-hash?with=parameters"
        };
        oInput.descriptor.value["sap.flp"].vizOptions.displayFormats.default = "flatWide";
        const oOutput = structuredClone(oStaticTileCardConfiguration);
        delete oOutput.descriptor.value["sap.flp"];
        const oExpectedNavigationSettings = {
            type: "Navigation",
            parameters: {
                url: "#Some-hash?with=parameters"
            }
        };

        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);
        delete oTileCardConfiguration.descriptor.value["sap.flp"];
        const oRenderedCardInstance = await renderCard(oTileCardConfiguration);
        const oDomRef = oRenderedCardInstance.getDomRef();

        // Assert
        assert.ok(oRenderedCardInstance, "Card Instance is created");
        assert.ok(oDomRef, "Card is rendered");
        assert.deepEqual(oRenderedCardInstance.getManifest()["sap.card"].header.actions[0], oExpectedNavigationSettings, "Navigation action was added");
    });

    QUnit.test("created Static TileCard with empty details (info) from site data", async function (assert) {

        // Arrange
        const oInput = structuredClone(oStaticDataInput);
        const oOutput = structuredClone(oStaticTileCardConfiguration);
        delete oOutput.descriptor.value["sap.flp"];
        // remove the info from the site data
        delete oInput.descriptor.value["sap.app"].info;

        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);
        delete oTileCardConfiguration.descriptor.value["sap.flp"];

        const oRenderedCardInstance = await renderCard(oTileCardConfiguration);
        const oDomRef = oRenderedCardInstance.getDomRef();
        const normalizedInnerText = oDomRef.innerText.replaceAll("\n", "");

        // Assert
        assert.ok(oRenderedCardInstance, "Card Instance is created");
        assert.ok(oDomRef, "Card is rendered");
        assert.ok(normalizedInnerText.indexOf("[object Object]") === -1, "Card detaiils do not contain [Object object]");
    });

    QUnit.test("check display variants", async function (assert) {

        // Arrange
        let oInput = structuredClone(oStaticDataInput);

        // Act
        oInput.descriptor.value["sap.flp"].vizOptions.displayFormats.default = "standard";
        oInput.descriptor.value["sap.flp"].vizOptions.displayFormats.supported = ["standard"];
        let oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);

        // Assert
        assert.ok(oTileCardConfiguration.displayVariant === "TileStandard", "Chosen display variant is correct");
        assert.deepEqual(oTileCardConfiguration.availableDisplayVariants, ["TileStandard"], "availableDisplayVariants display variant is correct");

        // Arrange
        oInput = structuredClone(oStaticDataInput);

        // Act
        oInput.descriptor.value["sap.flp"].vizOptions.displayFormats.default = "";
        oInput.descriptor.value["sap.flp"].vizOptions.displayFormats.supported = [];
        oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);

        // Assert
        assert.ok(oTileCardConfiguration.displayVariant === "TileStandard", "Fallback to standard display variant is correct");
        assert.deepEqual(oTileCardConfiguration.availableDisplayVariants, ["TileStandard"], "Adding fallback availableDisplayVariants display variant is correct");
    });

    QUnit.test("check error case if TileCard creation fails", async function (assert) {

        // Arrange
        const oInput = structuredClone({}); // empty object causes error
        const oExpected = {
            descriptor: {
                value: {
                    _version: "1.41.0",
                    "sap.app": {
                        id: "sap.ushell.utils.tilecard.Error",
                        type: "card",
                        applicationVersion: {
                            version: "1.123.0"
                        },
                        i18n: {
                            bundleName: "sap.ushell.utils.tilecard.resources/resources"
                        }
                    },
                    "sap.card": {
                        type: "List",
                        header: {
                            title: "{{TileCard.Widget.NotAvailable}}",
                            icon: {
                                src: "sap-icon://sys-cancel"
                            }
                        }
                    }
                }
            },
            displayVariant: "TileStandard",
            availableDisplayVariants: [
                "TileStandard"
            ],
            error: true
        };

        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);
        const oRenderedCardInstance = await renderCard(oTileCardConfiguration);


        // Assert
        assert.deepEqual(oTileCardConfiguration, oExpected, "Error TileCard was correctly created");
        assert.deepEqual(oRenderedCardInstance.getCardHeader().getIconSrc(), "sap-icon://sys-cancel", "Error icon is correctly displayed");
    });


    /**
     * Test the TileCard creation for Static Tiles
     */
    QUnit.module("Dynamic Tiles", {
        beforeEach: async function (assert) {
            this.oVizInstance = await WorkPageVizInstantiation.getInstance();
            assert.ok(this.oVizInstance, "Instance is created");
        },
        afterEach: function () {
            if (document.getElementById("testArea")) {
                document.getElementById("testArea").remove();
            }
            sandbox.restore();
        }
    });

    QUnit.test("created Dynamic TileCard and checks standard tile rendering", async function (assert) {

        // Arrange
        const oInput = structuredClone(oDynamicDataInput);
        const oOutput = structuredClone(oDynamicTileCardConfiguration);
        delete oOutput.descriptor.value["sap.flp"];
        TileCardExtension._DynamicTileRequest = function (sResource, fnSuccess, fnError) {
            fnSuccess({ number: "1234" });
        };

        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);
        delete oTileCardConfiguration.descriptor.value["sap.flp"];
        const oRenderedCardInstance = await renderCard(oTileCardConfiguration);
        const oDomRef = oRenderedCardInstance.getDomRef();

        // Assert
        assert.deepEqual(oTileCardConfiguration, oDynamicTileCardConfiguration, "TileCard was correctly created");
        assert.ok(oRenderedCardInstance, "Card Instance is created");
        assert.ok(oDomRef, "Card is rendered");
        assert.ok(oDomRef.offsetWidth === 11 * 16, "Card has the correct width");
        assert.ok(oDomRef.offsetHeight === 11 * 16, "Card has the correct height");
        const normalizedInnerText = oDomRef.innerText.replaceAll("\n", "");
        assert.ok(normalizedInnerText.indexOf("1.23k") > -1, "Card number is contained in rendering");
    });

    QUnit.test("check simple number", async function (assert) {

        // Arrange
        const oInput = structuredClone(oDynamicDataInput);
        const oOutput = structuredClone(oDynamicTileCardConfiguration);
        delete oOutput.descriptor.value["sap.flp"];
        TileCardExtension._DynamicTileRequest = function (sResource, fnSuccess, fnError) {
            fnSuccess(1234);
        };

        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);
        delete oTileCardConfiguration.descriptor.value["sap.flp"];
        const oRenderedCardInstance = await renderCard(oTileCardConfiguration);
        const oDomRef = oRenderedCardInstance.getDomRef();

        // Assert
        const normalizedInnerText = oDomRef.innerText.replaceAll("\n", "");
        assert.ok(normalizedInnerText.indexOf("1.23k") > -1, "Card number is contained in rendering");
    });

    QUnit.test("check simple number object", async function (assert) {

        // Arrange
        const oInput = structuredClone(oDynamicDataInput);
        const oOutput = structuredClone(oDynamicTileCardConfiguration);
        delete oOutput.descriptor.value["sap.flp"];
        TileCardExtension._DynamicTileRequest = function (sResource, fnSuccess, fnError) {
            fnSuccess({ number: "123" });
        };
        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);
        delete oTileCardConfiguration.descriptor.value["sap.flp"];
        const oRenderedCardInstance = await renderCard(oTileCardConfiguration);
        const oDomRef = oRenderedCardInstance.getDomRef();

        // Assert
        const normalizedInnerText = oDomRef.innerText.replaceAll("\n", "");
        assert.ok(normalizedInnerText.indexOf("123") > -1, "Card number is contained in rendering");
    });

    QUnit.test("check that tile request is not send more than once within 2 seconds", async function (assert) {
        const oClock = sinon.useFakeTimers({
            now: Date.now(),
            shouldAdvanceTime: true
        });

        // Arrange
        const oInput = structuredClone(oDynamicDataInput);
        const oOutput = structuredClone(oDynamicTileCardConfiguration);
        delete oOutput.descriptor.value["sap.flp"];
        let iRequestCount = 0;
        TileCardExtension._DynamicTileRequest = function (sResource, fnSuccess, fnError) {
            if (iRequestCount === 0) {
                fnSuccess({ number: "1" });
            } else { // second request should not be sent
                fnSuccess({ number: "2" });
            }
            iRequestCount++;
        };
        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);
        delete oTileCardConfiguration.descriptor.value["sap.flp"];
        const oRenderedCardInstance = await renderCard(oTileCardConfiguration);
        const oDomRef = oRenderedCardInstance.getDomRef();

        // Assert
        let normalizedInnerText = oDomRef.innerText.replaceAll("\n", "");
        assert.ok(normalizedInnerText.indexOf("numberUnit1") > -1, "Card number is contained in rendering" + normalizedInnerText);
        assert.ok(iRequestCount === 1, "Request was not sent more than once");
        await wait(1000);
        assert.ok(iRequestCount === 1, "Request was not sent more than once");
        await wait(1000);
        oRenderedCardInstance.refreshData();
        await wait(100);
        assert.ok(iRequestCount === 2, "Request was sent again after 2 seconds");
        normalizedInnerText = oDomRef.innerText.replaceAll("\n", "");
        assert.ok(normalizedInnerText.indexOf("numberUnit2") > -1, "Card number is contained in rendering" + normalizedInnerText);
        oClock.restore();
    });

    QUnit.test("check complex result object error state", async function (assert) {

        // Arrange
        const oInput = structuredClone(oDynamicDataInput);
        const oOutput = structuredClone(oDynamicTileCardConfiguration);
        delete oOutput.descriptor.value["sap.flp"];
        TileCardExtension._DynamicTileRequest = function (sResource, fnSuccess, fnError) {
            fnSuccess({
                icon: "sap-icon://travel-expense",
                info: "OData v4",
                infoState: "Negative",
                number: 43.333,
                numberDigits: 1,
                numberFactor: "M",
                numberState: "Negative",
                numberUnit: "EUR",
                stateArrow: "Up",
                subtitle: "Quarterly overview",
                title: "Travel Expenses"
            });
        };

        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);
        delete oTileCardConfiguration.descriptor.value["sap.flp"];
        const oRenderedCardInstance = await renderCard(oTileCardConfiguration);
        const oHeader = oRenderedCardInstance.getCardHeader();
        const oIndicator = oHeader._getNumericIndicators();

        // Assert
        assert.ok(oHeader.getIconSrc() === "sap-icon://travel-expense", "Card has the correct icon");
        assert.ok(oIndicator.getNumberVisible(), "Card has a number indicator");
        assert.ok(oIndicator.getNumber() === "43.3", "Card has the correct number");
        assert.ok(oIndicator.getTrend() === "Up", "Card has the correct trend");
        assert.ok(oIndicator.getNumberSize() === "L", "Card has the correct number size");
        assert.ok(oIndicator.getScale() === "M", "Card has the correct number scale");
        assert.ok(oIndicator.getState() === "Error", "Card has the correct number state");
        assert.ok(oHeader.getTitle() === "Travel Expenses", "Card has the correct title");
        assert.ok(oHeader.getSubtitle() === "Quarterly overview", "Card has the correct subtitle");
        assert.ok(oHeader.getDetailsState() === "Error", "Card has the correct details state");
        assert.ok(oHeader.getDetails() === "OData v4", "Card has the correct details text");
    });

    QUnit.test("check complex result object warning state", async function (assert) {

        // Arrange
        const oInput = structuredClone(oDynamicDataInput);
        const oOutput = structuredClone(oDynamicTileCardConfiguration);
        delete oOutput.descriptor.value["sap.flp"];
        TileCardExtension._DynamicTileRequest = function (sResource, fnSuccess, fnError) {
            fnSuccess({
                icon: "sap-icon://travel-expense",
                info: "Critical OData v4",
                infoState: "Critical",
                number: 43.333,
                numberDigits: 1,
                numberFactor: "k",
                numberState: "Critical",
                numberUnit: "EUR",
                stateArrow: "Down",
                subtitle: "Quarterly overview",
                title: "Travel Expenses"
            });
        };

        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);
        delete oTileCardConfiguration.descriptor.value["sap.flp"];
        const oRenderedCardInstance = await renderCard(oTileCardConfiguration);
        const oHeader = oRenderedCardInstance.getCardHeader();

        // Assert
        assert.ok(oHeader.getDetailsState() === "Warning", "Card has the correct details state");
        assert.ok(oHeader.getDetails() === "Critical OData v4", "Card has the correct details text");
    });

    QUnit.test("check complex result object good state", async function (assert) {

        // Arrange
        const oInput = structuredClone(oDynamicDataInput);
        const oOutput = structuredClone(oDynamicTileCardConfiguration);
        delete oOutput.descriptor.value["sap.flp"];
        TileCardExtension._DynamicTileRequest = function (sResource, fnSuccess, fnError) {
            fnSuccess({
                icon: "sap-icon://travel-expense",
                info: "Good OData v4",
                infoState: "Positive",
                number: 43.333,
                numberDigits: 1,
                numberFactor: "k",
                numberState: "Positive",
                numberUnit: "EUR",
                stateArrow: "Down",
                subtitle: "Quarterly overview",
                title: "Travel Expenses"
            });
        };

        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);
        delete oTileCardConfiguration.descriptor.value["sap.flp"];
        const oRenderedCardInstance = await renderCard(oTileCardConfiguration);
        const oHeader = oRenderedCardInstance.getCardHeader();

        // Assert
        assert.ok(oHeader.getDetailsState() === "Success", "Card has the correct details state");
        assert.ok(oHeader.getDetails() === "Good OData v4", "Card has the correct details text");
    });

    QUnit.test("check result for # number error", async function (assert) {

        // Arrange
        const oInput = structuredClone(oDynamicDataInput);
        delete oInput.descriptor.value["sap.app"].info;
        const oOutput = structuredClone(oDynamicTileCardConfiguration);
        delete oOutput.descriptor.value["sap.flp"];
        TileCardExtension._DynamicTileRequest = function (sResource, fnSuccess, fnError) {
            fnSuccess({
                number: "#"
            });
        };

        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);
        delete oTileCardConfiguration.descriptor.value["sap.flp"];
        const oRenderedCardInstance = await renderCard(oTileCardConfiguration);
        const oDomRef = oRenderedCardInstance.getDomRef();

        // Assert
        const normalizedInnerText = oDomRef.innerText.replaceAll("\n", "");
        assert.ok(normalizedInnerText.indexOf("#Error") > -1, "Card has hash and translated error text");
    });

    QUnit.test("check error result for data request (DynamicTileRequest) with translated error text", async function (assert) {

        // Arrange
        const oInput = structuredClone(oDynamicDataInput);
        const oOutput = structuredClone(oDynamicTileCardConfiguration);
        delete oOutput.descriptor.value["sap.flp"];
        TileCardExtension._DynamicTileRequest = function (sResource, fnSuccess, fnError) {
            fnError();
        };

        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);
        delete oTileCardConfiguration.descriptor.value["sap.flp"];
        const oRenderedCardInstance = await renderCard(oTileCardConfiguration);
        const oDomRef = oRenderedCardInstance.getDomRef();

        // Assert
        const normalizedInnerText = oDomRef.innerText.replaceAll("\n", "");
        assert.ok(normalizedInnerText.indexOf("...Error") > -1, "Card has 3 dots and translated error text");
    });

    QUnit.test("check exception in DynamicTileRequest with translated error text", async function (assert) {

        // Arrange
        const oInput = structuredClone(oDynamicDataInput);
        const oOutput = structuredClone(oDynamicTileCardConfiguration);
        delete oOutput.descriptor.value["sap.flp"];
        TileCardExtension._DynamicTileRequest = function () {
            throw new Error();
        };


        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);
        delete oTileCardConfiguration.descriptor.value["sap.flp"];
        const oRenderedCardInstance = await renderCard(oTileCardConfiguration);
        const oDomRef = oRenderedCardInstance.getDomRef();

        // Assert
        const normalizedInnerText = oDomRef.innerText.replaceAll("\n", "");
        assert.ok(normalizedInnerText.indexOf("...Error") > -1, "Card has 3 dots and translated error text");
    });

    QUnit.test("check timeout in DynamicTileRequest with translated timed out text", async function (assert) {

        // Arrange
        const oInput = structuredClone(oDynamicDataInput);
        const oOutput = structuredClone(oDynamicTileCardConfiguration);
        delete oOutput.descriptor.value["sap.flp"];
        TileCardExtension._DynamicTileRequest = function () {
        };
        TileCardExtension._DynamicTileRequestTimeout = 0; // special handling for timeout

        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);
        delete oTileCardConfiguration.descriptor.value["sap.flp"];
        const oRenderedCardInstance = await renderCard(oTileCardConfiguration);
        const oDomRef = oRenderedCardInstance.getDomRef();

        // Assert
        const normalizedInnerText = oDomRef.innerText.replaceAll("\n", "");
        assert.ok(normalizedInnerText.indexOf("...Timed out") > -1, "Card has 3 dots and translated timed out text");

        // Cleanup
        TileCardExtension._DynamicTileRequestTimeout = 30000;
    });

    QUnit.test("created Dynamic TileCard and checks unit of measure setting", async function (assert) {

        // Arrange
        const oInput = structuredClone(oDynamicDataInput);
        oInput.descriptor.value["sap.flp"].numberUnit = "}'EUR";

        // Act
        const oTileCardConfiguration = this.oVizInstance.createTileCardConfiguration(oInput);

        // Assert
        assert.ok(oTileCardConfiguration.descriptor.value["sap.card"].header.unitOfMeasurement === "{= ${/numberUnit} || '}'EUR'}", "Unit of measure is set");
    });
});
