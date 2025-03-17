// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapter.cep.MenuAdapter
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/i18n/Localization",
    "sap/ushell/adapters/cep/MenuAdapter",
    "sap/ushell/Config",
    "sap/ushell/library",
    "sap/ushell/utils/HttpClient"
], function (
    Log,
    Localization,
    MenuAdapter,
    Config,
    ushellLibrary,
    HttpClient
) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.dump.maxDepth = 10;

    // shortcut for sap.ushell.ContentNodeType
    var oContentNodeTypes = ushellLibrary.ContentNodeType;

    var oSandbox = sinon.sandbox.create();
    var fnGetExpectedLogResult = function (sMessage) {
        return [
            sMessage,
            "",
            "sap.ushell.adapters.cep.MenuAdapter"
        ];
    };

    QUnit.module("The Constructor", {
        beforeEach: function () {
            this.oFakeServer = oSandbox.useFakeXMLHttpRequest();
            oSandbox.stub(Log, "error");
            this.aExpectedErrorLogMessage = fnGetExpectedLogResult("Invalid configuration provided.");
        },
        afterEach: function () {
            oSandbox.restore();
        }
    });

    QUnit.test("The constructor reports an error if the adapter configuration is empty", function (assert) {
        // Act
        this.oMenuAdapter = new MenuAdapter(undefined, undefined, {});

        // Assert
        assert.deepEqual(Log.error.args[0], this.aExpectedErrorLogMessage, "An error message was logged.");
    });

    QUnit.test("The constructor reports an error if the adapter configuration is undefined", function (assert) {
        // Act
        this.oMenuAdapter = new MenuAdapter(undefined, undefined, undefined);

        // Assert
        assert.deepEqual(Log.error.args[0], this.aExpectedErrorLogMessage, "An error message was logged.");
    });

    QUnit.test("The constructor reports an error if the adapter configuration values are missing", function (assert) {
        // Act
        this.oMenuAdapter = new MenuAdapter(undefined, undefined, { config: {} });

        // Assert
        assert.deepEqual(Log.error.args[0], this.aExpectedErrorLogMessage, "An error message was logged.");
    });

    QUnit.test("The constructor reports an error if the adapter configuration value 'siteId' is missing", function (assert) {
        // Act
        this.oMenuAdapter = new MenuAdapter(undefined, undefined, { config: { serviceUrl: "some/serviceUrl/" } });

        // Assert
        assert.deepEqual(Log.error.args[0], this.aExpectedErrorLogMessage, "An error message was logged.");
    });

    QUnit.test("The constructor reports an error if the adapter configuration value 'serviceUrl' is missing", function (assert) {
        // Act
        this.oMenuAdapter = new MenuAdapter(undefined, undefined, { config: { siteId: "1234" } });

        // Assert
        assert.deepEqual(Log.error.args[0], this.aExpectedErrorLogMessage, "An error message was logged.");
    });

    QUnit.test("The constructor sets all member variables correctly and requests the site data.", function (assert) {
        // Arrange
        var oMenuAdapterConfiguration = { config: { serviceUrl: "some/serviceUrl", siteId: "1234" } };
        oSandbox.stub(MenuAdapter.prototype, "_doRequest").resolves({});

        // Act
        var oMenuAdapter = new MenuAdapter(undefined, undefined, oMenuAdapterConfiguration);

        // Assert
        assert.strictEqual((typeof oMenuAdapter.httpClient), "object", "HttpClient is available.");
        assert.strictEqual((typeof oMenuAdapter.oSiteDataPromise), "object", "The oSiteDataPromise is available.");
        assert.strictEqual(oMenuAdapter.serviceUrl, oMenuAdapterConfiguration.config.serviceUrl, "The serviceUrl was assigned correctly.");
        assert.strictEqual(oMenuAdapter.siteId, oMenuAdapterConfiguration.config.siteId, "The siteId was assigned correctly.");
        assert.strictEqual(oMenuAdapter._doRequest.calledOnce, true, "The function _doRequest was called once to requests the site data.");
        assert.deepEqual(oMenuAdapter._doRequest.args[0], ["some/serviceUrl", "1234"], "The function _doRequest was called with the provided parameters.");
    });

    QUnit.module("The function isMenuEnabled", {
        beforeEach: function () {
            this.oConfigStub = oSandbox.stub(Config, "last");
            this.oFakeServer = oSandbox.useFakeXMLHttpRequest();
            var oMenuAdapterConfiguration = {
                config: { serviceUrl: "test/path/to/service", siteId: "1234" }
            };
            this.oMenuAdapter = new MenuAdapter(undefined, undefined, oMenuAdapterConfiguration);
        },
        afterEach: function () {
            oSandbox.restore();
        }
    });

    QUnit.test("Returns true if the menu is enabled and menu entries are available", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/menu/enabled").returns(true);
        this.oConfigStub.withArgs("/core/menu/position").returns("Top");
        oSandbox.stub(this.oMenuAdapter, "getMenuEntries").resolves(["menuEntry"]);

        // Act
        return this.oMenuAdapter.isMenuEnabled().then(function (bMenuEnabled) {
            // Assert
            assert.strictEqual(this.oMenuAdapter.getMenuEntries.calledOnce, true, "The function getMenuEntries was called once.");
            assert.strictEqual(bMenuEnabled, true, "The function returns true.");
        }.bind(this));
    });

    QUnit.test("Returns false if the menu is enabled but no menu entries are available", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/menu/enabled").returns(true);
        this.oConfigStub.withArgs("/core/menu/position").returns("Top");
        oSandbox.stub(this.oMenuAdapter, "getMenuEntries").resolves([]);

        // Act
        return this.oMenuAdapter.isMenuEnabled().then(function (bMenuEnabled) {
            // Assert
            assert.strictEqual(this.oMenuAdapter.getMenuEntries.calledOnce, true, "The function getMenuEntries was called once.");
            assert.strictEqual(bMenuEnabled, false, "The function returns false.");
        }.bind(this));
    });

    QUnit.test("Returns false if the menu is disabled and menu entries are available", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/menu/enabled").returns(false);
        oSandbox.stub(this.oMenuAdapter, "getMenuEntries").resolves(["menuEntry"]);

        // Act
        return this.oMenuAdapter.isMenuEnabled().then(function (bMenuEnabled) {
            // Assert
            assert.strictEqual(bMenuEnabled, false, "The function returns false.");
        });
    });

    QUnit.module("The function getContentNodes", {
        beforeEach: function () {
            this.oFakeServer = oSandbox.useFakeXMLHttpRequest();
            this.oMenuAdapterConfiguration = {
                config: { serviceUrl: "test/path/to/service", siteId: "1234" }
            };
            this.oConfigStub = oSandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/menuQueryAvailable").returns(true);
        },
        afterEach: function () {
            oSandbox.restore();
        }
    });

    QUnit.test("Returns content nodes with a single entry.", function (assert) {
        // Arrange
        var aExpectedContentNodes = [
            {
                id: "space1",
                label: "MySpace1",
                type: oContentNodeTypes.Space,
                isContainer: false,
                children: [
                    {
                        id: "page1",
                        label: "MyPageTitle1",
                        type: oContentNodeTypes.Page,
                        isContainer: true,
                        children: []
                    }
                ]
            }
        ];
        var oExpectedSiteData = {
            data: {
                menu: [{
                    id: "space1",
                    type: "space",
                    title: "MySpace1",
                    subMenu: [{
                        id: "page1",
                        type: "workpage",
                        title: "MyPageTitle1",
                        pageType: "page"
                    }]
                }]
            }
        };
        var oResponse = { status: 200, responseText: JSON.stringify(oExpectedSiteData) };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);

        // Act
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
        return oMenuAdapter.getContentNodes().then(function (aContentNodes) {
            // Assert
            assert.deepEqual(aContentNodes, aExpectedContentNodes, "Has expected content nodes.");
        });
    });

    QUnit.test("Returns content nodes with multiple entries.", function (assert) {
        // Arrange
        var aExpectedContentNodes = [
            {
                id: "space1",
                label: "MySpace1",
                type: oContentNodeTypes.Space,
                isContainer: false,
                children: [
                    {
                        id: "page1",
                        label: "MyPageTitle1",
                        type: oContentNodeTypes.Page,
                        isContainer: true,
                        children: []
                    },
                    {
                        id: "page2",
                        label: "MyPageTitle2",
                        type: oContentNodeTypes.Page,
                        isContainer: true,
                        children: []
                    }
                ]
            },
            {
                id: "space2",
                label: "MySpace2",
                type: oContentNodeTypes.Space,
                isContainer: false,
                children: [
                    {
                        id: "page3",
                        label: "MyPageTitle3",
                        type: oContentNodeTypes.Page,
                        isContainer: true,
                        children: []
                    }
                ]
            }
        ];
        const oExpectedSiteData = {
            data: {
                menu: [{
                    id: "space1",
                    type: "space",
                    title: "MySpace1",
                    subMenu: [{
                        id: "page1",
                        type: "workpage",
                        title: "MyPageTitle1",
                        pageType: "page"
                    },
                    {
                        id: "page2",
                        type: "workpage",
                        title: "MyPageTitle2",
                        pageType: "page"
                    }]
                },
                {
                    id: "space2",
                    type: "space",
                    title: "MySpace2",
                    subMenu: [{
                        id: "page3",
                        type: "workpage",
                        title: "MyPageTitle3",
                        pageType: "page"
                    }]
                }]
            }
        };
        var oResponse = { status: 200, responseText: JSON.stringify(oExpectedSiteData) };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);

        // Act
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
        return oMenuAdapter.getContentNodes().then(function (aContentNodes) {
            // Assert
            assert.deepEqual(aContentNodes, aExpectedContentNodes, "Has expected content nodes.");
        });
    });

    QUnit.test("Returns content nodes and filters empty spaces.", function (assert) {
        // Arrange
        const oExpectedSiteData = {
            data: {
                menu: [{
                    // Empty space
                    id: "space0",
                    type: "space",
                    title: "MySpace0",
                    subMenu: []
                },
                {
                    id: "space1",
                    type: "space",
                    title: "MySpace1",
                    subMenu: [{
                        id: "page1",
                        type: "workpage",
                        title: "MyPageTitle1",
                        pageType: "page"
                    }]
                },
                {
                    // Empty space
                    id: "space2",
                    type: "space",
                    title: "MySpace3",
                    subMenu: []
                }]
            }
        };
        var aExpectedContentNodes = [
            {
                id: "space1",
                label: "MySpace1",
                type: oContentNodeTypes.Space,
                isContainer: false,
                children: [
                    {
                        id: "page1",
                        label: "MyPageTitle1",
                        type: oContentNodeTypes.Page,
                        isContainer: true,
                        children: []
                    }
                ]
            }
        ];

        var oResponse = { status: 200, responseText: JSON.stringify(oExpectedSiteData) };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);
        oSandbox.stub(Log, "warning");
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);

        // Act
        return oMenuAdapter.getContentNodes().then(function (aContentNodes) {
            // Assert
            assert.deepEqual(aContentNodes, aExpectedContentNodes, "Has expected content nodes.");
            assert.deepEqual(Log.warning.args[0], fnGetExpectedLogResult("FLP space space0 without sub menu content omitted in content nodes."), "A warning was logged because space0 had no pages.");
            assert.deepEqual(Log.warning.args[1], fnGetExpectedLogResult("FLP space space2 without sub menu content omitted in content nodes."), "A warning was logged because space2 had no pages.");
        });
    });

    QUnit.test("Returns no content nodes because of an empty response.", function (assert) {
        // Arrange
        var oResponse = { status: 200, responseText: undefined };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);

        // Act
        return oMenuAdapter.getContentNodes().then(function (aContentNodes) {
            // Assert
            assert.deepEqual(aContentNodes, [], "Has no content nodes.");
        });
    });

    QUnit.test("Returns a result and the requests aren't sent a second time.", function (assert) {
        // Arrange
        var oResponse = { status: 200, responseText: "{}" };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
        assert.expect(4);

        // Act
        return oMenuAdapter.getContentNodes().then(function (aMenuEntries) {
            // Assert
            assert.deepEqual(aMenuEntries, [], "Has no content nodes.");
            assert.strictEqual(HttpClient.prototype.get.calledOnce, true, "Request is sent first time.");
        }).then(function () {
            return oMenuAdapter.getContentNodes().then(function (aContentNodes) {
                assert.deepEqual(aContentNodes, [], "Has no content nodes.");
                assert.strictEqual(HttpClient.prototype.get.calledTwice, false, "Request is not sent a second time.");
            });
        });
    });

    QUnit.test("Handles 2xx status codes as success", function (assert) {
        // Arrange
        var oResponse = { status: 201, responseText: "{}" };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);

        // Act
        return oMenuAdapter.getContentNodes().then(function (aMenuEntries) {
            // Assert
            assert.deepEqual(aMenuEntries, [], "Has no content nodes.");
            assert.strictEqual(HttpClient.prototype.get.calledOnce, true, "Request is sent first time.");
        });
    });

    QUnit.test("Rejects because the request failed.", function (assert) {
        // Arrange
        var oExpectedResponse = { status: 500, responseText: "someError", statusText: "someStatus" };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oExpectedResponse);
        oSandbox.stub(Log, "error");
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);

        // Act
        return oMenuAdapter.getContentNodes().then(function () {
            assert.notOk(true, "Request should fail.");
        }).catch(function (sError) {
            // Assert
            assert.deepEqual(Log.error.args[0], fnGetExpectedLogResult(oExpectedResponse.responseText), "An error was logged.");
            assert.strictEqual(
                sError,
                "HTTP request to GraphQL service failed with status: 500 - " + oExpectedResponse.statusText,
                "The request failed with an error and the promise was rejected."
            );
        });
    });

    QUnit.test("Returns a content node with property isContainer=false as the property pageType of a given workpage is undefined.", function (assert) {
        // Arrange
        var aExpectedContentNodes = [
            {
                id: "space1",
                label: "MySpace1",
                type: oContentNodeTypes.Space,
                isContainer: false,
                children: [
                    {
                        id: "page1",
                        label: "MyPageTitle1",
                        type: oContentNodeTypes.Page,
                        isContainer: false,
                        children: []
                    }
                ]
            }
        ];
        var oExpectedSiteData = {
            data: {
                menu: [{
                    id: "space1",
                    type: "space",
                    title: "MySpace1",
                    subMenu: [{
                        id: "page1",
                        type: "workpage",
                        title: "MyPageTitle1"
                    }]
                }]
            }
        };
        var oResponse = { status: 200, responseText: JSON.stringify(oExpectedSiteData) };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);

        // Act
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
        return oMenuAdapter.getContentNodes().then(function (aContentNodes) {
            // Assert
            assert.deepEqual(aContentNodes, aExpectedContentNodes, "Has expected content nodes.");
        });
    });

    QUnit.module("The function getMenuEntries", {
        beforeEach: function () {
            this.oFakeServer = oSandbox.useFakeXMLHttpRequest();
            this.oMenuAdapterConfiguration = {
                config: { serviceUrl: "test/path/to/service", siteId: "1234" }
            };
            this.oConfigStub = oSandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/menuQueryAvailable").returns(true);
        },
        afterEach: function () {
            oSandbox.restore();
        }
    });

    QUnit.test("Returns a single menu entry", function (assert) {
        // Arrange
        var aExpectedMenuEntries = [
            {
                description: "",
                "help-id": "Space-space1",
                icon: undefined,
                menuEntries: [],
                target: {
                    action: "openFLPPage",
                    innerAppRoute: undefined,
                    parameters: [
                        {
                            name: "spaceId",
                            value: "space1"
                        },
                        {
                            name: "pageId",
                            value: "page1"
                        }
                    ],
                    semanticObject: "Launchpad"
                },
                title: "MySpace1",
                type: "IBN"
            }
        ];
        var oExpectedSiteData = {
            data: {
                menu: [{
                    id: "space1",
                    type: "space",
                    title: "MySpace1",
                    subMenu: [{
                        id: "page1",
                        type: "workpage",
                        title: "MyPageTitle1"
                    }]
                }]
            }
        };
        var oResponse = { status: 200, responseText: JSON.stringify(oExpectedSiteData) };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);

        // Act
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
        return oMenuAdapter.getMenuEntries().then(function (aMenuEntries) {
            // Assert
            assert.deepEqual(aMenuEntries, aExpectedMenuEntries, "Has expected menu entries.");
        });
    });

    QUnit.test("Returns multiple menu entries.", function (assert) {
        // Arrange
        var aExpectedMenuEntries = [
            {
                title: "MySpaceTitle1",
                "help-id": "Space-spaceId1",
                description: "",
                icon: undefined,
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        {
                            name: "spaceId",
                            value: "spaceId1"
                        },
                        {
                            name: "pageId",
                            value: "pageId1"
                        }
                    ],
                    innerAppRoute: undefined
                },
                menuEntries: [
                    {
                        description: "",
                        "help-id": "Page-pageId1",
                        icon: undefined,
                        menuEntries: [],
                        target: {
                            action: "openFLPPage",
                            innerAppRoute: undefined,
                            parameters: [
                                {
                                    name: "spaceId",
                                    value: "spaceId1"
                                },
                                {
                                    name: "pageId",
                                    value: "pageId1"
                                }
                            ],
                            semanticObject: "Launchpad"
                        },
                        title: "MyPageTitle1",
                        type: "IBN"
                    },
                    {
                        description: "",
                        "help-id": "Page-pageId2",
                        icon: undefined,
                        menuEntries: [],
                        target: {
                            action: "openFLPPage",
                            innerAppRoute: undefined,
                            parameters: [
                                {
                                    name: "spaceId",
                                    value: "spaceId1"
                                },
                                {
                                    name: "pageId",
                                    value: "pageId2"
                                }
                            ],
                            semanticObject: "Launchpad"
                        },
                        title: "MyPageTitle2",
                        type: "IBN"
                    }
                ]
            },
            {
                title: "MySpaceTitle2",
                "help-id": "Space-spaceId2",
                description: "",
                icon: undefined,
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        {
                            name: "spaceId",
                            value: "spaceId2"
                        },
                        {
                            name: "pageId",
                            value: "pageId3"
                        }
                    ],
                    innerAppRoute: undefined
                },
                menuEntries: []
            }
        ];
        const oExpectedSiteData = {
            data: {
                menu: [{
                    id: "spaceId1",
                    type: "space",
                    title: "MySpaceTitle1",
                    subMenu: [{
                        id: "pageId1",
                        type: "workpage",
                        title: "MyPageTitle1"
                    },
                    {
                        id: "pageId2",
                        type: "workpage",
                        title: "MyPageTitle2"
                    }]
                },
                {
                    id: "spaceId2",
                    type: "space",
                    title: "MySpaceTitle2",
                    subMenu: [{
                        id: "pageId3",
                        type: "workpage",
                        title: "MyPageTitle3"
                    }]
                }]
            }
        };
        var oResponse = { status: 200, responseText: JSON.stringify(oExpectedSiteData) };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);

        // Act
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
        return oMenuAdapter.getMenuEntries().then(function (aMenuEntries) {
            // Assert
            aMenuEntries.menuEntries = 123;
            assert.deepEqual(aMenuEntries, aExpectedMenuEntries, "Has expected menu entries.");
        });
    });

    QUnit.test("Returns menu entries and filters empty spaces.", function (assert) {
        // Arrange
        var aExpectedMenuEntries = [
            {
                description: "",
                "help-id": "Space-space1",
                icon: undefined,
                menuEntries: [],
                target: {
                    action: "openFLPPage",
                    innerAppRoute: undefined,
                    parameters: [
                        {
                            name: "spaceId",
                            value: "space1"
                        },
                        {
                            name: "pageId",
                            value: "page1"
                        }
                    ],
                    semanticObject: "Launchpad"
                },
                title: "MySpace1",
                type: "IBN"
            }
        ];
        const oExpectedSiteData = {
            data: {
                menu: [{
                    // Empty space
                    id: "space0",
                    type: "space",
                    title: "MySpace0",
                    subMenu: []
                },
                {
                    id: "space1",
                    type: "space",
                    title: "MySpace1",
                    subMenu: [{
                        id: "page1",
                        type: "workpage",
                        title: "MyPageTitle1"
                    }]
                },
                {
                    // Empty space
                    id: "space2",
                    type: "space",
                    title: "MySpace3",
                    subMenu: []
                }]
            }
        };

        var oResponse = { status: 200, responseText: JSON.stringify(oExpectedSiteData) };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);
        oSandbox.stub(Log, "warning");
        oSandbox.stub(Log, "info");
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);

        // Act
        return oMenuAdapter.getMenuEntries().then(function (aMenuEntries) {
            // Assert
            assert.deepEqual(aMenuEntries, aExpectedMenuEntries, "Has expected content nodes.");
            assert.deepEqual(Log.info.args[0], fnGetExpectedLogResult("No visualizations found for site-id: 1234"), "A info was logged because space0 had no visualizations.");
            assert.deepEqual(Log.warning.args[0], fnGetExpectedLogResult("FLP space space0 without sub menu content omitted in FLP menu."), "A warning was logged because space0 had no content.");
            assert.deepEqual(Log.warning.args[1], fnGetExpectedLogResult("FLP space space2 without sub menu content omitted in FLP menu."), "A warning was logged because space2 had no content.");
        });
    });

    QUnit.test("Returns menu entries.", function (assert) {
        // Arrange
        var aExpectedMenuEntries = [{
            description: "",
            "help-id": "Space-space",
            icon: undefined,
            menuEntries: [
                {
                    description: "",
                    "help-id": "Page-pageId",
                    icon: undefined,
                    menuEntries: [],
                    target: {
                        action: "openFLPPage",
                        innerAppRoute: undefined,
                        parameters: [{
                            name: "spaceId",
                            value: "space"
                        },
                        {
                            name: "pageId",
                            value: "pageId"
                        }],
                        semanticObject: "Launchpad"
                    },
                    title: "MyPageTitle",
                    type: "IBN"
                },
                {
                    description: "",
                    "help-id": "App-appId",
                    icon: undefined,
                    menuEntries: [],
                    target: {
                        action: "toappnavsample",
                        innerAppRoute: undefined,
                        parameters: [{
                            name: "spaceId",
                            value: "space"
                        },
                        {
                            name: "sap-ui-app-id-hint",
                            value: "appId"
                        }],
                        semanticObject: "Action"
                    },
                    title: "MyAppTitle",
                    type: "IBN"
                }
            ],
            target: {
                action: "openFLPPage",
                innerAppRoute: undefined,
                parameters: [
                    {
                        name: "spaceId",
                        value: "space"
                    },
                    {
                        name: "pageId",
                        value: "pageId"
                    }
                ],
                semanticObject: "Launchpad"
            },
            title: "MySpace",
            type: "IBN"
        }];
        const oExpectedSiteData = {
            data: {
                menu: [{
                    id: "space",
                    type: "space",
                    title: "MySpace",
                    subMenu: [{
                        id: "pageId",
                        type: "workpage",
                        title: "MyPageTitle"
                    },
                    {
                        id: "appId",
                        type: "visualization",
                        title: "MyAppTitle"
                    }]
                }]
            }
        };
        const oExpectedVisualizationData = [{
            id: "appId",
            indicatorDataSource: {},
            targetAppIntent: {
                businessAppId: "appId",
                semanticObject: "Action",
                action: "toappnavsample"
            }
        }];

        var oResponse = { status: 200, responseText: JSON.stringify(oExpectedSiteData) };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);
        oSandbox.stub(Log, "warning");
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
        oSandbox.stub(oMenuAdapter, "_getVisualizations").resolves(oExpectedVisualizationData);

        // Act
        return oMenuAdapter.getMenuEntries().then(function (aMenuEntries) {
            // Assert
            assert.deepEqual(aMenuEntries, aExpectedMenuEntries, "Has expected menu entries.");
        });
    });

    QUnit.test("Returns menu entries. - Spaces Query", function (assert) {
        // Arrange
        var aExpectedMenuEntries = [
            {
                description: "",
                "help-id": "Space-space1",
                icon: undefined,
                menuEntries: [],
                target: {
                    action: "openFLPPage",
                    innerAppRoute: undefined,
                    parameters: [
                        {
                            name: "spaceId",
                            value: "space1"
                        },
                        {
                            name: "pageId",
                            value: "page1"
                        }
                    ],
                    semanticObject: "Launchpad"
                },
                title: "MySpace1",
                type: "IBN"
            }
        ];
        var oExpectedSiteData = {
            data: {
                spaces: {
                    nodes: [
                        {
                            // Empty space
                            id: "space0",
                            descriptor: { value: { title: "MySpace0" } },
                            workPages: {
                                nodes: []
                            }
                        },
                        {
                            id: "space1",
                            descriptor: { value: { title: "MySpace1" } },
                            workPages: {
                                nodes: [
                                    {
                                        id: "page1",
                                        contents: {
                                            descriptor: { value: { title: "MyPageTitle1", pageType: "page" } }
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            // Empty space
                            id: "space2",
                            descriptor: { value: { title: "MySpace2" } }
                        }
                    ]
                }
            }
        };
        const oExpectedVisualizationData = [];

        var oResponse = { status: 200, responseText: JSON.stringify(oExpectedSiteData) };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);
        oSandbox.stub(Log, "warning");
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
        oSandbox.stub(oMenuAdapter, "_getVisualizations").resolves(oExpectedVisualizationData);

        this.oConfigStub.withArgs("/core/menuQueryAvailable").returns(false);

        // Act
        return oMenuAdapter.getMenuEntries().then(function (aMenuEntries) {
            // Assert
            assert.deepEqual(aMenuEntries, aExpectedMenuEntries, "Has expected menu entries.");
        });
    });

    QUnit.test("Returns no menu entries if menu has empty sub menu.", function (assert) {
        // Arrange
        var aExpectedMenuEntries = [];
        const oExpectedSiteData = {
            data: {
                menu: [{
                    id: "space",
                    type: "space",
                    title: "MySpace",
                    subMenu: {}
                }]
            }
        };
        const oExpectedVisualizationData = [];

        var oResponse = { status: 200, responseText: JSON.stringify(oExpectedSiteData) };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);
        oSandbox.stub(Log, "warning");
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
        oSandbox.stub(oMenuAdapter, "_getVisualizations").resolves(oExpectedVisualizationData);
        var oExpectedResponse = ["Menu entry space does not contain a sub menu array for site-id: 1234, sap.ushell.adapters.cep.MenuAdapter"];

        // Act
        return oMenuAdapter.getMenuEntries().then(function (aMenuEntries) {
            // Assert
            assert.deepEqual(aMenuEntries, aExpectedMenuEntries, "Has expected no menu entries.");
            assert.deepEqual(Log.warning.args[0], oExpectedResponse, "A warning was logged.");
        });
    });

    QUnit.test("Returns no menu entries if no site data have been returned from the CEP content API.", function (assert) {
        // Arrange
        const oResponse = {
            status: 200,
            responseText: JSON.stringify({
                data: {
                    visualizations: [],
                    totalCount: 0
                }
            })
        };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);

        // Act
        return oMenuAdapter.getMenuEntries().then(function (aMenuEntries) {
            // Assert
            assert.deepEqual(aMenuEntries, [], "Has no menu entries.");
        });
    });

    QUnit.test("Returns a result and the requests aren't sent a second time.", function (assert) {
        // Arrange
        const oResponse = {
            status: 200,
            responseText: JSON.stringify({
                data: {
                    visualizations: [],
                    totalCount: 0
                }
            })
        };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
        assert.expect(4);

        // Act
        return oMenuAdapter.getMenuEntries().then(function (aMenuEntries) {
            // Assert
            assert.deepEqual(aMenuEntries, [], "Has no menu entries.");
            assert.strictEqual(HttpClient.prototype.get.calledOnce, true, "Request is sent first time.");
        }).then(function () {
            return oMenuAdapter.getMenuEntries().then(function (aMenuEntries) {
                assert.deepEqual(aMenuEntries, [], "Has no menu entries.");
                assert.strictEqual(HttpClient.prototype.get.calledTwice, false, "Request is not sent a second time.");
            });
        });
    });

    QUnit.test("Returns a result with a visualization and two requests are sent.", function (assert) {
        // Arrange
        const aExpectedMenuEntries = [
            {
                description: "",
                "help-id": "Space-space1",
                icon: undefined,
                menuEntries: [],
                target: {
                    action: "openFLPPage",
                    innerAppRoute: undefined,
                    parameters: [
                        {
                            name: "spaceId",
                            value: "space1"
                        },
                        {
                            name: "pageId",
                            value: "app1"
                        }
                    ],
                    semanticObject: "Launchpad"
                },
                title: undefined,
                type: "IBN"
            }
        ];
        var oExpectedSiteData = {
            data: {
                menu: [{
                    id: "space1",
                    type: "space",
                    title: "MySpace1",
                    subMenu: [{
                        id: "app1",
                        type: "visualization"
                    }]
                }]
            }
        };
        var oResponse = { status: 200, responseText: JSON.stringify(oExpectedSiteData) };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
        assert.expect(4);

        // Act
        return oMenuAdapter.getMenuEntries().then(function (aMenuEntries) {
            // Assert
            assert.deepEqual(aMenuEntries, aExpectedMenuEntries, "Has expected menu entries.");
            assert.strictEqual(HttpClient.prototype.get.calledTwice, true, "Two Requests are sent first time.");
        }).then(function () {
            return oMenuAdapter.getMenuEntries().then(function (aMenuEntries) {
                // Assert
                assert.deepEqual(aMenuEntries, aExpectedMenuEntries, "Has expected menu entries.");
                assert.strictEqual(HttpClient.prototype.get.calledTwice, true, "Request are not sent a second time.");
            });
        });
    });

    QUnit.test("Icon validation - Valid icon", function (assert) {
        // Arrange
        var aExpectedMenuEntries = [
            {
                description: "",
                "help-id": "Space-space1",
                icon: "sap-icon://home",
                menuEntries: [],
                target: {
                    action: "openFLPPage",
                    innerAppRoute: undefined,
                    parameters: [
                        {
                            name: "spaceId",
                            value: "space1"
                        },
                        {
                            name: "pageId",
                            value: "page1"
                        }
                    ],
                    semanticObject: "Launchpad"
                },
                title: "MySpace1",
                type: "IBN"
            }
        ];
        var oExpectedSiteData = {
            data: {
                menu: [{
                    id: "space1",
                    type: "space",
                    title: "MySpace1",
                    icon: "sap-icon://home",
                    subMenu: [{
                        id: "page1",
                        type: "workpage",
                        title: "MyPageTitle1"
                    }]
                }]
            }
        };
        var oResponse = { status: 200, responseText: JSON.stringify(oExpectedSiteData) };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);

        // Act
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
        return oMenuAdapter.getMenuEntries().then(function (aMenuEntries) {
            // Assert
            assert.deepEqual(aMenuEntries, aExpectedMenuEntries, "Icon was validated correctly. Set to valid icon.");
        });
    });

    QUnit.test("Icon validation - Undefined icon", function (assert) {
        // Arrange
        var aExpectedMenuEntries = [
            {
                description: "",
                "help-id": "Space-space1",
                icon: undefined,
                menuEntries: [],
                target: {
                    action: "openFLPPage",
                    innerAppRoute: undefined,
                    parameters: [
                        {
                            name: "spaceId",
                            value: "space1"
                        },
                        {
                            name: "pageId",
                            value: "page1"
                        }
                    ],
                    semanticObject: "Launchpad"
                },
                title: "MySpace1",
                type: "IBN"
            }
        ];
        var oExpectedSiteData = {
            data: {
                menu: [{
                    id: "space1",
                    type: "space",
                    title: "MySpace1",
                    subMenu: [{
                        id: "page1",
                        type: "workpage",
                        title: "MyPageTitle1"
                    }]
                }]
            }
        };
        var oResponse = { status: 200, responseText: JSON.stringify(oExpectedSiteData) };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);

        // Act
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
        return oMenuAdapter.getMenuEntries().then(function (aMenuEntries) {
            // Assert
            assert.deepEqual(aMenuEntries, aExpectedMenuEntries, "Icon was validated correctly. Set to undefined.");
        });
    });

    QUnit.test("Icon validation - Empty string in icon", function (assert) {
        // Arrange
        var aExpectedMenuEntries = [
            {
                description: "",
                "help-id": "Space-space1",
                icon: undefined,
                menuEntries: [],
                target: {
                    action: "openFLPPage",
                    innerAppRoute: undefined,
                    parameters: [
                        {
                            name: "spaceId",
                            value: "space1"
                        },
                        {
                            name: "pageId",
                            value: "page1"
                        }
                    ],
                    semanticObject: "Launchpad"
                },
                title: "MySpace1",
                type: "IBN"
            }
        ];
        var oExpectedSiteData = {
            data: {
                menu: [{
                    id: "space1",
                    type: "space",
                    title: "MySpace1",
                    subMenu: [{
                        id: "page1",
                        type: "workpage",
                        title: "MyPageTitle1",
                        icon: ""
                    }]
                }]
            }
        };
        var oResponse = { status: 200, responseText: JSON.stringify(oExpectedSiteData) };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);

        // Act
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
        return oMenuAdapter.getMenuEntries().then(function (aMenuEntries) {
            // Assert
            assert.deepEqual(aMenuEntries, aExpectedMenuEntries, "Icon was validated correctly. Set to undefined.");
        });
    });

    QUnit.test("Icon validation - Typo in icon", function (assert) {
        // Arrange
        var aExpectedMenuEntries = [
            {
                description: "",
                "help-id": "Space-space1",
                icon: undefined,
                menuEntries: [],
                target: {
                    action: "openFLPPage",
                    innerAppRoute: undefined,
                    parameters: [
                        {
                            name: "spaceId",
                            value: "space1"
                        },
                        {
                            name: "pageId",
                            value: "page1"
                        }
                    ],
                    semanticObject: "Launchpad"
                },
                title: "MySpace1",
                type: "IBN"
            }
        ];
        var oExpectedSiteData = {
            data: {
                menu: [{
                    id: "space1",
                    type: "space",
                    title: "MySpace1",
                    subMenu: [{
                        id: "page1",
                        type: "workpage",
                        title: "MyPageTitle1",
                        icon: "sap-icon://homee"
                    }]
                }]
            }
        };
        var oResponse = { status: 200, responseText: JSON.stringify(oExpectedSiteData) };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oResponse);

        // Act
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
        return oMenuAdapter.getMenuEntries().then(function (aMenuEntries) {
            // Assert
            assert.deepEqual(aMenuEntries, aExpectedMenuEntries, "Icon was validated correctly. Set to undefined.");
        });
    });

    QUnit.test("Rejects because the request failed.", function (assert) {
        // Arrange
        var oExpectedResponse = { status: 500, responseText: "someError", statusText: "someStatus" };
        oSandbox.stub(HttpClient.prototype, "get").resolves(oExpectedResponse);
        oSandbox.stub(Log, "error");
        var oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);

        // Act
        return oMenuAdapter.getMenuEntries().then(function () {
            assert.notOk(true, "Request should fail.");
        }).catch(function (sError) {
            // Assert
            assert.deepEqual(Log.error.args[0], fnGetExpectedLogResult(oExpectedResponse.responseText), "An error was logged.");
            assert.strictEqual(
                sError,
                "HTTP request to GraphQL service failed with status: 500 - " + oExpectedResponse.statusText,
                "The request failed with an error and the promise was rejected."
            );
        });
    });

    // Private:
    QUnit.module("The function _getMenu", {
        beforeEach: function () {
            this.oFakeServer = oSandbox.useFakeXMLHttpRequest();
            this.oMenuAdapterConfiguration = {
                config: { serviceUrl: "test/path/to/service", siteId: "1234" }
            };
            this.oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
            this.aExpectedWarningLogMessage = fnGetExpectedLogResult("No menu found for site-id: " + this.oMenuAdapterConfiguration.config.siteId);
            oSandbox.stub(Log, "warning");
        },
        afterEach: function () {
            oSandbox.restore();
        }
    });

    QUnit.test("Returns an empty array and logs a warning if spaces parameter is an empty object", async function (assert) {
        // Arrange
        const oSiteData = {};
        this.oMenuAdapter.oSiteDataPromise = Promise.resolve(oSiteData);

        // Act
        const aMenu = await this.oMenuAdapter._getMenu();

        // Assert
        assert.deepEqual(aMenu, [], "The result is an empty array.");
        assert.deepEqual(Log.warning.args[0], this.aExpectedWarningLogMessage, "A warning message was logged to the console");
    });

    QUnit.test("Returns an empty array and logs a warning if spaces parameter has 'data' but no 'menu'", async function (assert) {
        // Arrange
        const oSiteData = { data: {} };
        this.oMenuAdapter.oSiteDataPromise = Promise.resolve(oSiteData);

        // Act
        const aMenu = await this.oMenuAdapter._getMenu();

        // Assert
        assert.deepEqual(aMenu, [], "The result is an empty array.");
        assert.deepEqual(Log.warning.args[0], this.aExpectedWarningLogMessage, "A warning message was logged to the console");
    });

    QUnit.test("Returns an empty array and logs a warning if spaces parameter has 'data' and 'menu' without content", async function (assert) {
        // Arrange
        const oSiteData = { data: { menu: [] } };
        this.oMenuAdapter.oSiteDataPromise = Promise.resolve(oSiteData);

        // Act
        const aMenu = await this.oMenuAdapter._getMenu({ data: { menu: {} } });

        // Assert
        assert.deepEqual(aMenu, [], "The result is an empty array.");
        assert.deepEqual(Log.warning.args[0], this.aExpectedWarningLogMessage, "A warning message was logged to the console");
    });

    QUnit.test("Returns menu", async function (assert) {
        // Arrange
        const oSiteData = { data: { menu: ["someMenu"] } };
        this.oMenuAdapter.oSiteDataPromise = Promise.resolve(oSiteData);
        const aMenuExpected = ["someMenu"];

        // Act
        const aMenu = await this.oMenuAdapter._getMenu();

        // Assert
        assert.deepEqual(aMenu, aMenuExpected, "The result was the expected menu.");
    });

    // Private:
    QUnit.module("The function _getVisualizations", {
        beforeEach: function () {
            this.oFakeServer = oSandbox.useFakeXMLHttpRequest();
            this.oMenuAdapterConfiguration = {
                config: { serviceUrl: "test/path/to/service", siteId: "1234" }
            };
            this.oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
            this.aExpectedInfoLogMessage = fnGetExpectedLogResult("No visualizations found for site-id: " + this.oMenuAdapterConfiguration.config.siteId);
        },
        afterEach: function () {
            oSandbox.restore();
        }
    });

    QUnit.test("Returns an empty array and logs a info if visualizations parameter is an empty object", async function (assert) {
        // Arrange
        const oVisualizationData = {};
        this.oMenuAdapter.oVizDataPromise = Promise.resolve(oVisualizationData);
        oSandbox.stub(Log, "info");

        // Act
        const aMenu = await this.oMenuAdapter._getVisualizations();

        // Assert
        assert.deepEqual(aMenu, [], "The result is an empty array.");
        assert.deepEqual(Log.info.args[0], this.aExpectedInfoLogMessage, "A info message was logged to the console");
    });

    QUnit.test("Returns an empty array and logs a warning if visualizations parameter has empty 'nodes'", async function (assert) {
        // Arrange
        const oVisualizationData = { nodes: {} };
        this.oMenuAdapter.oVizDataPromise = Promise.resolve(oVisualizationData);
        oSandbox.stub(Log, "warning");

        // Act
        const aMenu = await this.oMenuAdapter._getVisualizations();

        // Assert
        assert.deepEqual(aMenu, [], "The result is an empty array.");
        assert.deepEqual(Log.warning.args[0], this.aExpectedWarningLogMessage, "A warning message was logged to the console");
    });

    QUnit.test("Returns visualizations", async function (assert) {
        // Arrange
        const oVisualizationData = { visualizations: { nodes: ["someViz"] } };
        this.oMenuAdapter.oVizDataPromise = Promise.resolve(oVisualizationData);
        const aVisualizationsExpected = ["someViz"];

        // Act
        const aMenu = await this.oMenuAdapter._getVisualizations();

        // Assert
        assert.deepEqual(aMenu, aVisualizationsExpected, "The result were the expected spaces.");
    });

    QUnit.module("The function _doRequest", {
        beforeEach: function () {
            this.oFakeServer = oSandbox.useFakeXMLHttpRequest();
            this.oMenuAdapterConfiguration = {
                config: { serviceUrl: "test/path/to/service", siteId: "1234" }
            };
            this.oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
            this.oConfigStub = oSandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/menuQueryAvailable").returns(true);
        },
        afterEach: function () {
            oSandbox.restore();
        }
    });

    QUnit.test("The request was successful with status 200 and a valid result is returned.", function (assert) {
        // Arrange
        var oExpectedResponse = { someResponse: 1 };
        var sSiteId = "1234";
        var sQuery = `{
            menu(siteId: "${sSiteId}")
        }`;

        var sRequestUrl = this.oMenuAdapterConfiguration.config.serviceUrl + "?query=" + sQuery;
        oSandbox.stub(this.oMenuAdapter.httpClient, "get").resolves({ status: 200, responseText: JSON.stringify(oExpectedResponse) });

        // Act
        return this.oMenuAdapter._doRequest(
            this.oMenuAdapterConfiguration.config.serviceUrl,
            this.oMenuAdapterConfiguration.config.siteId
        ).then(function (oResponse) {
            // Assert
            assert.strictEqual(this.oMenuAdapter.httpClient.get.args[0][0], sRequestUrl, "The service URL with the query.");
            var oHeaders = this.oMenuAdapter.httpClient.get.args[0][1].headers;
            assert.strictEqual(typeof oHeaders, "object", "The options headers was set.");
            assert.strictEqual(oHeaders.Accept, "application/json", "The Accept header was added correctly.");
            assert.strictEqual(oHeaders["Content-Type"], "application/json", "The Content-Type header was added correctly.");
            assert.strictEqual(oHeaders["Accept-Language"], Localization.getLanguageTag().toString(),
                "The Accept-Language header was added correctly.");
            assert.deepEqual(oResponse, oExpectedResponse, "The result was the expected response.");
        }.bind(this)).catch(function () {
            assert.notOk(true, "Request should not fail.");
        });
    });

    QUnit.test("The request was successful with falsy responseText.", function (assert) {
        // Arrange
        oSandbox.stub(this.oMenuAdapter.httpClient, "get").resolves({ status: 200, responseText: undefined });

        // Act
        return this.oMenuAdapter._doRequest(
            this.oMenuAdapterConfiguration.config.serviceUrl,
            this.oMenuAdapterConfiguration.config.siteId
        ).then(function (oSiteData) {
            // Assert
            assert.deepEqual(oSiteData, {}, "The result was an empty response.");
        }).catch(function () {
            assert.notOk(true, "Request should not fail.");
        });
    });

    QUnit.test("The request was not successful with status 500.", function (assert) {
        // Arrange
        var oExpectedResponse = { status: 500, statusText: "someError", responseText: "myError" };
        oSandbox.stub(this.oMenuAdapter.httpClient, "get").resolves(oExpectedResponse);
        oSandbox.stub(Log, "error");

        // Act
        return this.oMenuAdapter._doRequest(
            this.oMenuAdapterConfiguration.config.serviceUrl,
            this.oMenuAdapterConfiguration.config.siteId
        ).then(function () {
            assert.notOk(true, "Request should fail.");
        }).catch(function (sError) {
            // Assert
            assert.deepEqual(Log.error.args[0], fnGetExpectedLogResult(oExpectedResponse.responseText), "An error was logged.");
            assert.strictEqual(sError, "HTTP request to GraphQL service failed with status: 500 - someError", "The request failed with an error and the promise was rejected.");
        });
    });

    QUnit.module("The function _isSpaceNotEmpty", {
        beforeEach: function () {
            this.oFakeServer = oSandbox.useFakeXMLHttpRequest();
            this.oMenuAdapterConfiguration = {
                config: { serviceUrl: "test/path/to/service", siteId: "1234" }
            };
            this.oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
            this.sEnityName = "myEntity";
            this.sSpaceId = "4321";
            this.aExpectedWarningLogMessage = fnGetExpectedLogResult("FLP space " + this.sSpaceId + " without sub menu content omitted in " + this.sEnityName + ".");
        },
        afterEach: function () {
            oSandbox.restore();
        }
    });

    QUnit.test("The space is not empty", function (assert) {
        // Arrange
        const oMenu = {
            id: this.sSpaceId,
            subMenu: ["somePageData"]
        };
        oSandbox.stub(Log, "warning");

        // Act
        const bIsNotEmpty = this.oMenuAdapter._isSpaceNotEmpty(this.sEnityName, oMenu);

        // Assert
        assert.strictEqual(bIsNotEmpty, true, "Space is not empty.");
    });

    QUnit.test("The space is empty", function (assert) {
        // Arrange
        const oSpace = {
            id: this.sSpaceId,
            subMenu: []
        };
        oSandbox.stub(Log, "warning");

        // Act
        const bIsNotEmpty = this.oMenuAdapter._isSpaceNotEmpty(this.sEnityName, oSpace);

        // Assert
        assert.strictEqual(bIsNotEmpty, false, "Space is empty.");
        assert.deepEqual(Log.warning.args[0], this.aExpectedWarningLogMessage, "A warning was logged.");
    });

    QUnit.test("The space has a 'subMenu' but no content", function (assert) {
        // Arrange
        const oSpace = {
            id: this.sSpaceId,
            subMenu: [{}]
        };
        oSandbox.stub(Log, "warning");

        // Act
        const bIsNotEmpty = this.oMenuAdapter._isSpaceNotEmpty(this.sEnityName, oSpace);

        // Assert
        assert.strictEqual(bIsNotEmpty, false, "Space is empty.");
        assert.deepEqual(Log.warning.args[0], this.aExpectedWarningLogMessage, "A warning was logged.");
    });

    QUnit.test("The space has no 'subMenu'", function (assert) {
        // Arrange
        const oSpace = {
            id: this.sSpaceId
        };
        oSandbox.stub(Log, "warning");

        // Act
        const bIsNotEmpty = this.oMenuAdapter._isSpaceNotEmpty(this.sEnityName, oSpace);

        // Assert
        assert.strictEqual(bIsNotEmpty, false, "Space is empty.");
        assert.deepEqual(Log.warning.args[0], this.aExpectedWarningLogMessage, "A warning was logged.");
    });

    QUnit.module("The function isWorkPage", {
        beforeEach: function () {
            this.oFakeServer = oSandbox.useFakeXMLHttpRequest();
            this.oMenuAdapterConfiguration = {
                config: { serviceUrl: "test/path/to/service", siteId: "1234" }
            };
            this.oMenuAdapter = new MenuAdapter(undefined, undefined, this.oMenuAdapterConfiguration);
            this.oMenuAdapter.oSiteDataPromise = Promise.resolve({ data: { menu: [] } });
        },
        afterEach: function () {
            oSandbox.restore();
        }
    });

    QUnit.test("returns false if there are no spaces", function (assert) {
        // Arrange
        this.oMenuAdapter.oSiteDataPromise = Promise.resolve({ data: { menu: [] } });

        // Act
        return this.oMenuAdapter.isWorkPage("test-id").then(function (bResult) {
            // Assert
            assert.strictEqual(bResult, false, "The result was false.");
        });
    });

    QUnit.test("returns false if there are no pages", function (assert) {
        // Arrange
        this.oMenuAdapter.oSiteDataPromise = Promise.resolve({
            data: {
                menu: [{
                    subMenu: []
                }, {
                    subMenu: []
                }]
            }
        });

        // Act
        return this.oMenuAdapter.isWorkPage("test-id").then(function (bResult) {
            // Assert
            assert.strictEqual(bResult, false, "The result was false.");
        });
    });

    QUnit.test("returns false if the page has pageType page", function (assert) {
        // Arrange
        this.oMenuAdapter.oSiteDataPromise = Promise.resolve({
            data: {
                menu: [{
                    subMenu: [{
                        id: "test-id",
                        type: "workpage",
                        pageType: "page"
                    }]
                }]
            }
        });

        // Act
        return this.oMenuAdapter.isWorkPage("test-id").then(function (bResult) {
            // Assert
            assert.strictEqual(bResult, false, "The result was false.");
        });
    });

    QUnit.test("returns true if the page has pageType workpage", function (assert) {
        // Arrange
        this.oMenuAdapter.oSiteDataPromise = Promise.resolve({
            data: {
                menu: [{
                    subMenu: [{
                        id: "test-id",
                        type: "workpage",
                        pageType: "workpage"
                    }]
                }]
            }
        });

        // Act
        return this.oMenuAdapter.isWorkPage("test-id").then(function (bResult) {
            // Assert
            assert.strictEqual(bResult, true, "The result was true.");
        });
    });
});
