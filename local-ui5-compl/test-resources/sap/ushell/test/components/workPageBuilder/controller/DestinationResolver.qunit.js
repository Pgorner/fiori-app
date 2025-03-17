// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.utils.workpage.DestinationResolver
 */
sap.ui.define([
    "sap/ushell/utils/workpage/DestinationResolver",
    "sap/base/i18n/Localization",
    "sap/ui/integration/widgets/Card",
    "sap/ushell/utils/workpage/WorkPageService",
    "sap/ushell/Config"
], function (
    DestinationResolver,
    Localization,
    Card,
    WorkPageService,
    Config
) {
    "use strict";

    /* global QUnit sinon */

    var sandbox = sinon.sandbox.create();

    function createCard () {
        return new Card({
            manifest:
            {
                _version: "1.15.0",
                "sap.app": {
                    id: "card.explorer.table.card",
                    type: "card",
                    title: "Sample of a Table Card",
                    subTitle: "Sample of a Table Card"
                },
                "sap.ui": {
                    technology: "UI5",
                    icons: {
                        icon: "sap-icon://table-view"
                    }
                },
                "sap.card": {
                    type: "Table",
                    data: {
                        request: {
                            url: "./card/tableData.json"
                        }
                    },
                    header: {
                        title: "Project Staffing Watchlist",
                        subTitle: "Today"
                    },
                    content: {
                        row: {
                            columns: [{
                                title: "Project",
                                value: "{salesOrder}",
                                identifier: true
                            },
                            {
                                title: "Customer",
                                value: "{customerName}"
                            },
                            {
                                title: "Staffing",
                                value: "{netAmount}",
                                hAlign: "End"
                            },
                            {
                                title: "Status",
                                value: "{status}",
                                state: "{statusState}"
                            },
                            {
                                title: "Staffing",
                                progressIndicator: {
                                    percent: "{deliveryProgress}",
                                    text: "{= format.percent(${deliveryProgress} / 100)}",
                                    state: "{statusState}"
                                }
                            }
                            ]
                        }
                    }
                }
            },
            referenceId: "cpkg.dest.card",
            baseUrl: sap.ui.require.toUrl("sap/ushell/test/components/workPageBuilder/controller")
        });
    }

    Localization.setLanguage("en");

    QUnit.module("Constructor", {
        beforeEach: function (assert) {
            this.oCardData = createCard();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("instantiation works", function (assert) {
        // Arrange
        var done = assert.async();
        sandbox.stub(WorkPageService.prototype, "loadSiteAndDataDestinationMappings").callsFake(() => {
            const aProvider = {
                data: {
                    site: {
                        providers: {
                            nodes: [
                                {
                                    id: "cpkg.dest.card",
                                    logicalDataDestinationMappings: [
                                        {
                                            logicalDestinationName: "ES5",
                                            resolvedUrl: "/dynamic_dest/NorthwindV2"
                                        },
                                        {
                                            logicalDestinationName: "NorthwindV2",
                                            resolvedUrl: "/dynamic_dest/NorthwindV2"
                                        }
                                    ]
                                },
                                {
                                    id: "cpkg.multi.dest.card",
                                    logicalDataDestinationMappings: [
                                        {
                                            logicalDestinationName: "NorthwindV2",
                                            resolvedUrl: "/dynamic_dest/NorthwindV3"
                                        },
                                        {
                                            logicalDestinationName: "NorthwindV3",
                                            resolvedUrl: "/dynamic_dest/NorthwindV3"
                                        }
                                    ]
                                },
                                {
                                    id: "CXT100",
                                    logicalDataDestinationMappings: []
                                },
                                {
                                    id: "groot.ns.cpkg.sort",
                                    logicalDataDestinationMappings: []
                                },
                                {
                                    id: "groot.ns.cpkg.viz",
                                    logicalDataDestinationMappings: []
                                }
                            ]
                        }
                    }
                }
            };
            return Promise.resolve(aProvider);
        });

        //Act
        this.oDestinationResolver = new DestinationResolver();

        //Assert
        assert.ok(this.oDestinationResolver instanceof DestinationResolver, "The DestinatorResolver was instantiated ");
        done();
    });

    QUnit.module("resolveCardDestination", {
        beforeEach: function (assert) {
            this.configLastStub = sandbox.stub(Config, "last").withArgs("/core/site/siteId");
            this.oCardData = createCard();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });
    QUnit.test("Promise Successful", function (assert) {
        // Arrange
        var done = assert.async();
        sandbox.stub(WorkPageService.prototype, "loadSiteAndDataDestinationMappings").callsFake(() => {
            const aProvider = {
                data: {
                    site: {
                        providers: {
                            nodes: [
                                {
                                    id: "cpkg.dest.card",
                                    logicalDataDestinationMappings: [
                                        {
                                            logicalDestinationName: "ES5",
                                            resolvedUrl: "/dynamic_dest/NorthwindV2"
                                        },
                                        {
                                            logicalDestinationName: "NorthwindV2",
                                            resolvedUrl: "/dynamic_dest/NorthwindV2"
                                        }
                                    ]
                                },
                                {
                                    id: "cpkg.multi.dest.card",
                                    logicalDataDestinationMappings: [
                                        {
                                            logicalDestinationName: "NorthwindV2",
                                            resolvedUrl: "/dynamic_dest/NorthwindV3"
                                        },
                                        {
                                            logicalDestinationName: "NorthwindV3",
                                            resolvedUrl: "/dynamic_dest/NorthwindV3"
                                        }
                                    ]
                                },
                                {
                                    id: "CXT100",
                                    logicalDataDestinationMappings: []
                                },
                                {
                                    id: "groot.ns.cpkg.sort",
                                    logicalDataDestinationMappings: []
                                },
                                {
                                    id: "groot.ns.cpkg.viz",
                                    logicalDataDestinationMappings: []
                                }
                            ]
                        }
                    }
                }
            };
            return Promise.resolve(aProvider);
        });

        // Act
        this.oDestinationResolver = new DestinationResolver();

        this.oDestinationResolver.resolveCardDestination("ES5", this.oCardData)
            .then((oDataResult) => {
                // Assert
                assert.equal(oDataResult, "/dynamic_dest/NorthwindV2");
                done();
            });
    });

    QUnit.test("Promise rejects when the Destination name is not mapped", function (assert) {
        // Arrange
        var done = assert.async();
        sandbox.stub(WorkPageService.prototype, "loadSiteAndDataDestinationMappings").callsFake(() => {
            const aProvider = {
                data: {
                    site: {
                        providers: {
                            nodes: [
                                {
                                    id: "cpkg.dest.card",
                                    logicalDataDestinationMappings: [
                                        {
                                            logicalDestinationName: "ES5",
                                            resolvedUrl: "/dynamic_dest/NorthwindV2"
                                        },
                                        {
                                            logicalDestinationName: "NorthwindV2",
                                            resolvedUrl: "/dynamic_dest/NorthwindV2"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            };
            return Promise.resolve(aProvider);
        });

        // Act
        this.oDestinationResolver = new DestinationResolver();

        this.oDestinationResolver.resolveCardDestination("ABC", this.oCardData)
            .catch((sReason) => {
                // Assert
                assert.equal(sReason, "NO_DESTINATION_FOUND", "Destination name not found in mappings");
                done();
            });
    });

    QUnit.test("Promise rejects when the Destination URL is empty", function (assert) {
        // Arrange
        var done = assert.async();
        sandbox.stub(WorkPageService.prototype, "loadSiteAndDataDestinationMappings").callsFake(() => {
            const aProvider = {
                data: {
                    site: {
                        providers: {
                            nodes: [
                                {
                                    id: "cpkg.dest.card",
                                    logicalDataDestinationMappings: [
                                        {
                                            logicalDestinationName: "EMPTY",
                                            resolvedUrl: ""
                                        },
                                        {
                                            logicalDestinationName: "NorthwindV2",
                                            resolvedUrl: "/dynamic_dest/NorthwindV2"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            };
            return Promise.resolve(aProvider);
        });

        // Act
        this.oDestinationResolver = new DestinationResolver();

        this.oDestinationResolver.resolveCardDestination("EMPTY", this.oCardData)
            .catch((sReason) => {
                // Assert
                assert.equal(sReason, "RESOLVED_URL_EMPTY", "Destination URL empty");
                done();
            });
    });

    QUnit.test("Promise rejects when API is called w/o destination name", function (assert) {
        // Arrange
        var done = assert.async();
        sandbox.stub(WorkPageService.prototype, "loadSiteAndDataDestinationMappings").callsFake(() => {
            const aProvider = {
                data: {
                    site: {
                        providers: {
                            nodes: [
                                {
                                    id: "cpkg.dest.card",
                                    logicalDataDestinationMappings: [
                                        {
                                            logicalDestinationName: "EMPTY",
                                            resolvedUrl: ""
                                        },
                                        {
                                            logicalDestinationName: "NorthwindV2",
                                            resolvedUrl: "/dynamic_dest/NorthwindV2"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            };
            return Promise.resolve(aProvider);
        });

        // Act
        this.oDestinationResolver = new DestinationResolver();

        this.oDestinationResolver.resolveCardDestination("", this.oCardData)
            .catch((sReason) => {
                // Assert
                assert.equal(sReason, "NO_CARD_OR_DESTINATION_NAME", "Destination name is empty");
                done();
            });
    });

    QUnit.test("Promise rejects when API is called w/o card instance", function (assert) {
        // Arrange
        var done = assert.async();
        sandbox.stub(WorkPageService.prototype, "loadSiteAndDataDestinationMappings").callsFake(() => {
            const aProvider = {
                data: {
                    site: {
                        providers: {
                            nodes: [
                                {
                                    id: "cpkg.dest.card",
                                    logicalDataDestinationMappings: [
                                        {
                                            logicalDestinationName: "EMPTY",
                                            resolvedUrl: ""
                                        },
                                        {
                                            logicalDestinationName: "NorthwindV2",
                                            resolvedUrl: "/dynamic_dest/NorthwindV2"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            };
            return Promise.resolve(aProvider);
        });

        // Act
        this.oDestinationResolver = new DestinationResolver();

        this.oDestinationResolver.resolveCardDestination("ABC")
            .catch((sReason) => {
                // Assert
                assert.equal(sReason, "NO_CARD_OR_DESTINATION_NAME", "No card instance given");
                done();
            });
    });

    QUnit.test("Promise rejects when service fails", function (assert) {
        // Arrange
        this.configLastStub.returns("SITE_ID");
        var done = assert.async();
        sandbox.stub(WorkPageService.prototype, "loadSiteAndDataDestinationMappings").callsFake(() => {
            const aProvider = {
                data: {
                }
            };
            return Promise.reject(aProvider);
        });

        // Act
        this.oDestinationResolver = new DestinationResolver();

        this.oDestinationResolver.resolveCardDestination("ABC", this.oCardData)
            .catch((sReason) => {
                // Assert
                assert.equal(sReason, "COULD_NOT_RETRIEVE_DESTINATIONS", "Destination service not available or failed");
                done();
            });
    });

    QUnit.test("Promise returns default value when service fails because of missing site ID", function (assert) {
        // Arrange
        this.configLastStub.returns(undefined);
        var done = assert.async();
        sandbox.stub(WorkPageService.prototype, "loadSiteAndDataDestinationMappings").callsFake(() => {
            const aProvider = {
                data: {
                }
            };
            return Promise.reject(aProvider);
        });

        // Act
        this.oDestinationResolver = new DestinationResolver();

        this.oDestinationResolver.resolveCardDestination("ABC", this.oCardData)
            .then((oDataResult) => {
                // Assert
                assert.equal(oDataResult, `${location.origin}/dynamic_dest/ABC`);
                done();
            });
    });

    QUnit.test("resolveCardDestination- Promise rejected when parameters are not passed correctly", function (assert) {
        // Arrange
        var done = assert.async();
        sandbox.stub(WorkPageService.prototype, "loadSiteAndDataDestinationMappings").callsFake(() => {
            const aProvider = {
                data: {
                    site: {
                        providers: {
                            nodes: [
                                {
                                    id: "cpkg.dest.card",
                                    logicalDataDestinationMappings: [
                                        {
                                            logicalDestinationName: "ES5",
                                            resolvedUrl: "/dynamic_dest/NorthwindV2"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            };
            return Promise.resolve(aProvider);
        });

        // Act
        this.oDestinationResolver = new DestinationResolver();

        this.oDestinationResolver.resolveCardDestination().catch(function () {
            //Assert
            assert.ok(true, "resolveCardDestination empty parameters rejected correctly");
            done();
        });
    });

    QUnit.test("resolveCardDestination- Promise returns default value when Destinationmappings is empty", function (assert) {
        // Arrange
        this.configLastStub.returns("SITE_ID");
        var done = assert.async();
        sandbox.stub(WorkPageService.prototype, "loadSiteAndDataDestinationMappings").callsFake(() => {
            const aProvider = {
                data: {
                    site: {
                        providers: {
                            nodes: [
                                {
                                }
                            ]
                        }
                    }
                }
            };
            return Promise.resolve(aProvider);
        });

        // Act
        this.oDestinationResolver = new DestinationResolver();

        this.oDestinationResolver.resolveCardDestination("ABC", this.oCardData)
            .catch((sReason) => {
                // Assert
                assert.equal(sReason, "COULD_NOT_RETRIEVE_DESTINATIONS", "Destination service not available or failed");
                done();
            });
    });
});

