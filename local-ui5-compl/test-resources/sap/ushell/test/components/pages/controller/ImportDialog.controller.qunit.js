// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/* eslint-disable camelcase */
/**
 * @fileOverview QUnit tests for sap.ushell.components.pages.controller.ImportDialog.controller
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/components/pages/controller/ImportDialog.controller",
    "sap/ushell/components/pages/MyHomeImport",
    "sap/ushell/Config",
    "sap/ushell/library",
    "sap/ushell/resources",
    "sap/ushell/services/URLParsing",
    "sap/ushell/utils/HttpClient",
    "sap/ushell/utils/WindowUtils",
    "sap/ushell/Container"
], function (
    Log,
    JSONModel,
    ImportDialogController,
    MyHomeImport,
    Config,
    ushellLibrary,
    resources,
    URLParsing,
    HttpClient,
    WindowUtils,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    window["sap-ushell-config"] = {
        services: {
            PageBuilding: {
                adapter: {
                    config: {
                        services: {
                            pageBuilding: {
                                baseUrl: "MyTestBaseURl"
                            }
                        }
                    }
                }
            }
        }
    };

    var sandbox = sinon.createSandbox({});

    // shortcut for sap.ushell.DisplayFormat
    var DisplayFormat = ushellLibrary.DisplayFormat;

    QUnit.dump.maxDepth = 10;

    var aExpectedPreparedGroups = [{
        id: "groupA",
        title: "Group A Title",
        isLocked: false,
        isDefault: false,
        tileOrder: [
            "tileA1",
            "tileA2"
        ],
        linkOrder: [
            "linkA1"
        ],
        chips: [{
            instanceId: "tileA1",
            chipId: "tileA1VizId",
            configuration: "",
            ChipInstanceBags: {
                results: []
            }
        }, {
            instanceId: "tileA2",
            chipId: "tileA2VizId",
            configuration: "",
            ChipInstanceBags: {
                results: []
            }
        }, {
            instanceId: "linkA1",
            chipId: "linkA1VizId",
            configuration: "",
            ChipInstanceBags: {
                results: []
            }
        }],
        tiles: [
            { vizId: "tileA1VizId", isABookmark: false },
            { vizId: "tileA2VizId", isABookmark: false }
        ],
        links: [{
            vizId: "linkA1VizId",
            isABookmark: false,
            displayFormatHint: DisplayFormat.Compact,
            bUpdateNeeded: true
        }]
    }, {
        id: "/UI2/Fiori2LaunchpadHome",
        title: "My Home",
        isLocked: false,
        isDefault: true,
        tileOrder: [
            "tileH2",
            "tileH1"
        ],
        linkOrder: [
            "linkH1"
        ],
        chips: [{
            instanceId: "tileH1",
            chipId: "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER",
            configuration: "{\"tileConfiguration\":\"{\\\"display_title_text\\\":\\\"Home Bookmark\\\",\\\"display_icon_url\\\":\\\"sap:icon//home\\\"}\"}",
            ChipInstanceBags: {
                results: [{
                    ChipInstanceProperties: {
                        results: [
                            { name: "display_title_text", value: "Bookmark renamed" },
                            { name: "display_info_text", value: "version 1.1" }
                        ]
                    },
                    id: "tileProperties"
                }]
            }
        }, {
            instanceId: "linkH1",
            chipId: "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER",
            configuration: "{\"tileConfiguration\":\"{\\\"display_title_text\\\":\\\"Home Bookmark 2\\\",\\\"display_icon_url\\\":\\\"sap:icon//home\\\"}\"}",
            ChipInstanceBags: {
                results: []
            }
        }, {
            ChipInstanceBags: {
                results: [{
                    ChipInstanceProperties: {
                        results: [
                            { name: "title", translatable: "X", value: "my title" },
                            { name: "description", translatable: "X", value: "my description" },
                            { name: "display_search_keywords", value: "app" }]
                    },
                    id: "sb_tileProperties"
                }]
            },
            chipId: "X-SAP-UI2-CHIP:SSB_NUMERIC",
            configuration: "{\"tileConfiguration\":\"{\\\"display_title_text\\\":\\\"Custom Bookmark\\\",\\\"display_icon_url\\\":\\\"sap:icon//home\\\"," +
                "\\\"TILE_PROPERTIES\\\":\\\"{\\\\\\\"semanticObject\\\\\\\":\\\\\\\"someTestSemanticObject\\\\\\\",\\\\\\\"semanticAction\\\\\\\":\\\\\\\"someTestSemanticAction\\\\\\\"," +
                "\\\\\\\"evaluationId\\\\\\\":\\\\\\\"someTestEvaluationId\\\\\\\"}\\\"}\"}",
            instanceId: "customBookmark"
        }, {
            instanceId: "tileH2",
            chipId: "tileH2VizId",
            configuration: "",
            ChipInstanceBags: {
                results: [{
                    ChipInstanceProperties: {
                        results: [
                            { name: "display_title_text", value: "Tile renamed" },
                            { name: "display_subtitle_text", value: "subtitle changed" },
                            { name: "display_search_keywords", value: "app" }
                        ]
                    },
                    id: "tileProperties"
                }]
            }
        }],
        tiles: [{
            bUpdateNeeded: true,
            vizId: "tileH2VizId",
            isABookmark: false,
            title: "Tile renamed",
            subtitle: "subtitle changed",
            searchKeyword: "app"
        }, {
            bUpdateNeeded: false,
            icon: "sap:icon//home",
            info: "version 1.1",
            isABookmark: true,
            isCustomBookmark: false,
            numberUnit: undefined,
            serviceRefreshInterval: undefined,
            serviceUrl: undefined,
            subtitle: undefined,
            title: "Bookmark renamed",
            url: undefined,
            vizId: "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER"
        }, {
            chipConfig: {
                bags: {
                    sb_tileProperties: {
                        properties: {
                            display_search_keywords: "app"
                        },
                        texts: {
                            description: "my description",
                            title: "my title"
                        }
                    }
                },
                chipId: "X-SAP-UI2-CHIP:SSB_NUMERIC",
                configuration: {
                    tileConfiguration: "{\"display_title_text\":\"Custom Bookmark\",\"display_icon_url\":\"sap:icon//home\"," +
                        "\"TILE_PROPERTIES\":\"{\\\"semanticObject\\\":\\\"someTestSemanticObject\\\",\\\"semanticAction\\\":\\\"someTestSemanticAction\\\"," +
                        "\\\"evaluationId\\\":\\\"someTestEvaluationId\\\"}\"}"
                }
            },
            bUpdateNeeded: false,
            icon: "sap:icon//home",
            info: undefined,
            isABookmark: true,
            isCustomBookmark: true,
            loadManifest: true,
            numberUnit: undefined,
            serviceRefreshInterval: undefined,
            serviceUrl: undefined,
            subtitle: "my description",
            title: "my title",
            url: "#someTestSemanticObject-someTestSemanticAction?EvaluationId=someTestEvaluationId",
            vizConfig: {},
            vizId: "X-SAP-UI2-CHIP:SSB_NUMERIC",
            vizType: "ssuite/smartbusiness/tiles/numeric"
        }],
        links: [{
            bUpdateNeeded: true,
            displayFormatHint: DisplayFormat.Compact,
            icon: "sap:icon//home",
            info: undefined,
            isABookmark: true,
            isCustomBookmark: false,
            numberUnit: undefined,
            serviceRefreshInterval: undefined,
            serviceUrl: undefined,
            subtitle: undefined,
            title: "Home Bookmark 2",
            url: undefined,
            vizId: "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER"
        }]
    }, {
        id: "groupB",
        title: "Group B Title",
        isLocked: false,
        isDefault: false,
        tileOrder: [
            "tileB1"
        ],
        linkOrder: [
            "linkB1",
            "linkB2"
        ],
        chips: [{
            instanceId: "tileB1",
            chipId: "tileB1VizId",
            configuration: "",
            ChipInstanceBags: {
                results: []
            }
        }, {
            instanceId: "linkB2",
            chipId: "linkB2VizId",
            configuration: "",
            ChipInstanceBags: {
                results: []
            }
        }, {
            instanceId: "linkB1",
            chipId: "linkB1VizId",
            configuration: "",
            ChipInstanceBags: {
                results: []
            }
        }],
        tiles: [
            { vizId: "tileB1VizId", isABookmark: false }
        ],
        links: [
            { vizId: "linkB1VizId", isABookmark: false, displayFormatHint: DisplayFormat.Compact, bUpdateNeeded: true },
            { vizId: "linkB2VizId", isABookmark: false, displayFormatHint: DisplayFormat.Compact, bUpdateNeeded: true }
        ]
    }, {
        id: "groupC",
        title: "Group C Title",
        isLocked: false,
        isDefault: false,
        tileOrder: [],
        linkOrder: [],
        chips: [{
            instanceId: "tileC1",
            chipId: "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER",
            // eslint-disable-next-line max-len
            configuration: "{\"tileConfiguration\":\"{\\\"display_title_text\\\":\\\"I am a Bookmark\\\",\\\"navigation_target_url\\\":\\\"www.sap.com\\\",\\\"display_subtitle_text\\\":\\\"special\\\"}\"}",
            ChipInstanceBags: {
                results: []
            }
        }],
        tiles: [{
            icon: undefined,
            info: undefined,
            isABookmark: true,
            isCustomBookmark: false,
            numberUnit: undefined,
            serviceRefreshInterval: undefined,
            serviceUrl: undefined,
            subtitle: "special",
            title: "I am a Bookmark",
            url: "www.sap.com",
            vizId: "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER"
        }],
        links: []
    }];

    QUnit.module("The open method", {
        beforeEach: function () {
            this.oImportDialog = new ImportDialogController();
            this.oGetDataStub = sandbox.stub(MyHomeImport, "getData");
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync").resolves();

        },
        afterEach: function () {
            this.oImportDialog.close();
            sandbox.restore();
        }
    });

    QUnit.test("loads services, the fragment and opens the dialog", function (assert) {
        // Arrange
        this.oGetDataStub.resolves();
        // Act
        return this.oImportDialog.open().then(function (dialog) {
            // Assert
            assert.ok(dialog, "The dialog was returned");
            assert.strictEqual(dialog.isOpen(), true, "The dialog was opened.");
            assert.ok(dialog.getBeginButton(), "The begin button exists.");
            assert.ok(dialog.getEndButton(), "The end button exists");
            assert.strictEqual(this.oGetServiceAsyncStub.callCount, 2, "The oGetServiceAsyncStub was called twice.");
            assert.strictEqual(this.oGetServiceAsyncStub.getCall(0).args[0], "URLParsing", "The URLParsing Service was loaded.");
            assert.strictEqual(this.oGetServiceAsyncStub.getCall(1).args[0], "MessageInternal", "The Message Service was loaded.");
        }.bind(this));
    });

    QUnit.test("sets the model correctly", function (assert) {
        // Arrange
        this.oGetDataStub.resolves();
        var oExpectedModel = {
            busy: true,
            groups: [],
            PersonalizedGroups: []
        };

        // Act
        return this.oImportDialog.open().then(function (dialog) {
            // Assert
            assert.deepEqual(dialog.getModel().getData(), oExpectedModel, "The model is initialized as expected.");
        });
    });

    QUnit.test("results in the correctly mapped model data", function (assert) {
        // Arrange
        this.oGetDataStub.resolves([{
            id: "test-1",
            title: "test-1",
            isLocked: false,
            isDefault: false,
            tileOrder: [],
            linkOrder: [],
            chips: []
        }, {
            id: "test-2",
            title: "test-2",
            isLocked: false,
            isDefault: true,
            tileOrder: [],
            linkOrder: [],
            chips: []
        }, {
            id: "test-3",
            title: "test-3",
            isLocked: false,
            isDefault: false,
            tileOrder: [],
            linkOrder: [],
            chips: []
        }]);
        var oExpectedModel = {
            busy: false,
            groups: [{
                id: "test-1",
                title: "test-1",
                isLocked: false,
                isDefault: false,
                tileOrder: [],
                linkOrder: [],
                chips: []
            }, {
                id: "test-2",
                title: "test-2",
                isLocked: false,
                isDefault: true,
                tileOrder: [],
                linkOrder: [],
                chips: []
            }, {
                id: "test-3",
                title: "test-3",
                isLocked: false,
                isDefault: false,
                tileOrder: [],
                linkOrder: [],
                chips: []
            }],
            PersonalizedGroups: [{
                description: "test-1",
                title: "test-1",
                selected: true
            }, {
                description: "test-2",
                title: resources.i18n.getText("my_group"),
                selected: true
            }, {
                description: "test-3",
                title: "test-3",
                selected: true
            }]
        };

        // Act
        return this.oImportDialog.open().then(function (dialog) {
            // Assert
            assert.deepEqual(dialog.getModel().getData(), oExpectedModel, "The groups data was correctly mapped to the model.");
        });
    });

    QUnit.module("The close method", {
        beforeEach: function () {
            var oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync").withArgs("MessageInternal").resolves({
                info: sandbox.stub(),
                error: sandbox.stub()
            });

            oGetServiceAsyncStub.withArgs("URLParsing").resolves();
            this.oImportDialog = new ImportDialogController();
            sandbox.stub(MyHomeImport, "getData").resolves();
            return this.oImportDialog.open().then(function (dialog) {
                this.oCloseSpy = sandbox.spy(dialog, "close");
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("closes the dialog", function (assert) {
        // Act
        this.oImportDialog.close();

        // Assert
        assert.ok(this.oCloseSpy.calledOnce, "The dialog was closed.");
    });

    QUnit.module("The doImport method", {
        beforeEach: function () {
            var oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync").withArgs("MessageInternal").resolves({
                info: sandbox.stub(),
                error: sandbox.stub()
            });
            oGetServiceAsyncStub.withArgs("URLParsing").resolves();

            this.oImportDialog = new ImportDialogController();
            sandbox.stub(MyHomeImport, "getData").resolves();
            this.aPreparedGroups = [{
                chips: [],
                id: "second_group",
                isDefault: false,
                isLocked: false,
                linkOrder: [],
                links: [],
                tileOrder: [],
                tiles: [],
                title: "second group"
            }, {
                chips: [],
                id: "fourth_group",
                isDefault: false,
                isLocked: false,
                linkOrder: [],
                links: [],
                tileOrder: [],
                tiles: [],
                title: "fourth group"
            }];
            this.oPrepareImportStub = sandbox.stub(this.oImportDialog, "_prepareImport").returns(this.aPreparedGroups);
            this.oSaveImportStub = sandbox.stub(this.oImportDialog, "_saveImport");
            return this.oImportDialog.open().then(function (dialog) {
                dialog.getModel().setProperty("/PersonalizedGroups", [
                    { description: "first group", selected: false },
                    { description: "second group", selected: true },
                    { description: "third group", selected: false },
                    { description: "fourth group", selected: true }
                ]);
            });
        },
        afterEach: function () {
            this.oImportDialog.close();
            sandbox.restore();
        }
    });

    QUnit.test("The selected groups are processed", function (assert) {
        // Arrange
        var aExpectedIds = [
            "second group",
            "fourth group"
        ];

        // Act
        this.oImportDialog.doImport();

        // Assert
        assert.strictEqual(this.oPrepareImportStub.callCount, 1, "prepareImport function was called exactly once.");
        assert.deepEqual(this.oPrepareImportStub.firstCall.args, [aExpectedIds], "prepareImport is called with the expected arguments.");
        assert.strictEqual(this.oSaveImportStub.callCount, 1, "saveImport function was called exactly once.");
        assert.deepEqual(this.oSaveImportStub.firstCall.args, [this.aPreparedGroups], "saveImport is called with the expected arguments.");
    });

    QUnit.module("The _prepareImport method", {
        beforeEach: function () {
            this.oImportDialog = new ImportDialogController();
            this.oImportDialog._oURLParsingService = new URLParsing();
            this.oGetPropertyStub = sandbox.stub().returns([{
                id: "groupA",
                title: "Group A Title",
                isLocked: false,
                isDefault: false,
                tileOrder: [
                    "tileA1",
                    "tileA2"
                ],
                linkOrder: [
                    "linkA1"
                ],
                chips: [
                    { instanceId: "tileA1", chipId: "tileA1VizId", configuration: "", ChipInstanceBags: { results: [] } },
                    { instanceId: "tileA2", chipId: "tileA2VizId", configuration: "", ChipInstanceBags: { results: [] } },
                    { instanceId: "linkA1", chipId: "linkA1VizId", configuration: "", ChipInstanceBags: { results: [] } }
                ]
            }, {
                id: "/UI2/Fiori2LaunchpadHome",
                title: "My Home",
                isLocked: false,
                isDefault: true,
                tileOrder: ["tileH2", "tileH1"],
                linkOrder: ["linkH1"],
                chips: [{
                    instanceId: "tileH1",
                    chipId: "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER",
                    configuration: JSON.stringify({
                        tileConfiguration: JSON.stringify({
                            display_title_text: "Home Bookmark",
                            display_icon_url: "sap:icon//home"
                        })
                    }),
                    ChipInstanceBags: {
                        results: [{
                            ChipInstanceProperties: {
                                results: [
                                    { name: "display_title_text", value: "Bookmark renamed" },
                                    { name: "display_info_text", value: "version 1.1" }
                                ]
                            },
                            id: "tileProperties"
                        }]
                    }
                }, {
                    instanceId: "linkH1",
                    chipId: "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER",
                    configuration: JSON.stringify({
                        tileConfiguration: JSON.stringify({
                            display_title_text: "Home Bookmark 2",
                            display_icon_url: "sap:icon//home"
                        })
                    }),
                    ChipInstanceBags: { results: [] }
                }, {
                    instanceId: "customBookmark",
                    chipId: "X-SAP-UI2-CHIP:SSB_NUMERIC",
                    configuration: JSON.stringify({
                        tileConfiguration: JSON.stringify({
                            display_title_text: "Custom Bookmark",
                            display_icon_url: "sap:icon//home",
                            TILE_PROPERTIES: JSON.stringify({
                                semanticObject: "someTestSemanticObject",
                                semanticAction: "someTestSemanticAction",
                                evaluationId: "someTestEvaluationId"
                            })
                        })
                    }),
                    ChipInstanceBags: {
                        results: [{
                            ChipInstanceProperties: {
                                results: [
                                    { name: "title", value: "my title", translatable: "X" },
                                    { name: "description", value: "my description", translatable: "X" },
                                    { name: "display_search_keywords", value: "app" }
                                ]
                            },
                            id: "sb_tileProperties"
                        }]
                    }
                }, {
                    instanceId: "tileH2",
                    chipId: "tileH2VizId",
                    configuration: "",
                    ChipInstanceBags: {
                        results: [{
                            ChipInstanceProperties: {
                                results: [
                                    { name: "display_title_text", value: "Tile renamed" },
                                    { name: "display_subtitle_text", value: "subtitle changed" },
                                    { name: "display_search_keywords", value: "app" }
                                ]
                            },
                            id: "tileProperties"
                        }]
                    }
                }]
            }, {
                id: "groupB",
                title: "Group B Title",
                isLocked: false,
                isDefault: false,
                tileOrder: [
                    "tileB1"
                ],
                linkOrder: [
                    "linkB1",
                    "linkB2"
                ],
                chips: [
                    { instanceId: "tileB1", chipId: "tileB1VizId", configuration: "", ChipInstanceBags: { results: [] } },
                    { instanceId: "linkB2", chipId: "linkB2VizId", configuration: "", ChipInstanceBags: { results: [] } },
                    { instanceId: "linkB1", chipId: "linkB1VizId", configuration: "", ChipInstanceBags: { results: [] } }
                ]
            }, {
                id: "groupC",
                title: "Group C Title",
                isLocked: false,
                isDefault: false,
                tileOrder: [],
                linkOrder: [],
                chips: [{
                    instanceId: "tileC1",
                    chipId: "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER",
                    configuration: JSON.stringify({
                        tileConfiguration: JSON.stringify({
                            display_title_text: "I am a Bookmark",
                            navigation_target_url: "www.sap.com",
                            display_subtitle_text: "special"
                        })
                    }),
                    ChipInstanceBags: { results: [] }
                }]
            }, {
                id: "stableIdGroup",
                title: "Test Group for stableIds",
                isLocked: false,
                isDefault: false,
                tileOrder: [],
                linkOrder: [],
                chips: [{
                    instanceId: "unstableTile1",
                    chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:Z_DEMO_BC:3WO90XZ14NGN3L4735J4KCEGB",
                    ChipInstanceBags: { results: [] },
                    Chip: {
                        referenceChipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:Z_DEMO_TC:3WO90XZ14NGN3L4735J4KCEGC"
                    }
                }, {
                    instanceId: "unstableTile2",
                    chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:Z_DEMO_BC:3WO90XZ14NGN3L4735J4KCEHB",
                    ChipInstanceBags: { results: [] },
                    Chip: {
                        referenceChipId: "O"
                    }
                }, {
                    instanceId: "unstableTile3",
                    chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:Z_DEMO_BC:3WO90XZ14NGN3L4735J4KCEIB",
                    ChipInstanceBags: { results: [] },
                    Chip: {
                        referenceChipId: ""
                    }
                }]
            }]);
            this.oImportDialog._oDialog = {
                getModel: function () {
                    return {
                        getProperty: this.oGetPropertyStub
                    };
                }.bind(this)
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("has the expected output", function (assert) {
        var aResult = this.oImportDialog._prepareImport([
            "groupA",
            "/UI2/Fiori2LaunchpadHome",
            "groupB",
            "groupC"
        ]);
        assert.deepEqual(aResult, aExpectedPreparedGroups, "The result was as expected.");
    });

    QUnit.test("Uses stableIds", function (assert) {
        // Arrange
        var aExpectedResult = [{
            id: "stableIdGroup",
            title: "Test Group for stableIds",
            isDefault: false,
            isLocked: false,
            linkOrder: [],
            links: [],
            tileOrder: [],
            tiles: [{
                isABookmark: false,
                vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:Z_DEMO_TC:3WO90XZ14NGN3L4735J4KCEGC"
            }, {
                isABookmark: false,
                vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:Z_DEMO_BC:3WO90XZ14NGN3L4735J4KCEHB"
            }, {
                isABookmark: false,
                vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:Z_DEMO_BC:3WO90XZ14NGN3L4735J4KCEIB"
            }],
            chips: [{
                instanceId: "unstableTile1",
                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:Z_DEMO_BC:3WO90XZ14NGN3L4735J4KCEGB",
                ChipInstanceBags: { results: [] },
                Chip: {
                    referenceChipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:Z_DEMO_TC:3WO90XZ14NGN3L4735J4KCEGC"
                }
            }, {
                instanceId: "unstableTile2",
                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:Z_DEMO_BC:3WO90XZ14NGN3L4735J4KCEHB",
                ChipInstanceBags: { results: [] },
                Chip: {
                    referenceChipId: "O"
                }
            }, {
                instanceId: "unstableTile3",
                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:Z_DEMO_BC:3WO90XZ14NGN3L4735J4KCEIB",
                ChipInstanceBags: { results: [] },
                Chip: {
                    referenceChipId: ""
                }
            }]
        }];
        // Act
        var aResult = this.oImportDialog._prepareImport(["stableIdGroup"]);
        // Assert
        assert.deepEqual(aResult, aExpectedResult, "The result was as expected.");
    });

    QUnit.module("The _gatherVizDataObjectFromChipInstance method", {
        beforeEach: function () {
            this.oImportDialog = new ImportDialogController();
            this.oImportDialog._oURLParsingService = new URLParsing();
            this.sExpectedSemanticObject = "someTestSemanticObject";
            this.sExpectedSemanticAction = "someTestSemanticAction";
            this.oChip = {
                instanceId: "someCustomBookmark",
                chipId: "X-SAP-UI2-CHIP:SSB_NUMERIC",
                ChipInstanceBags: {
                    results: [{
                        ChipInstanceProperties: {
                            results: []
                        },
                        id: "sb_tileProperties"
                    }]
                },
                configuration: JSON.stringify({
                    tileConfiguration: JSON.stringify({
                        display_title_text: "title from tileConfiguration",
                        display_subtitle_text: "subtitle from tileConfiguration",
                        display_icon_url: "sap:icon//home",
                        navigation_target_url: "someTestURL",
                        TILE_PROPERTIES: JSON.stringify({
                            semanticObject: this.sExpectedSemanticObject,
                            semanticAction: this.sExpectedSemanticAction
                        })
                    })
                })
            };
            this.oExpectedOutput = {
                bUpdateNeeded: false,
                chipConfig: {
                    bags: {
                        sb_tileProperties: {
                            properties: {},
                            texts: {}
                        }
                    },
                    chipId: "X-SAP-UI2-CHIP:SSB_NUMERIC",
                    configuration: {
                        tileConfiguration: "{\"display_title_text\":\"title from tileConfiguration\"," +
                            "\"display_subtitle_text\":\"subtitle from tileConfiguration\",\"display_icon_url\":\"sap:icon//home\"," +
                            "\"navigation_target_url\":\"someTestURL\"," +
                            "\"TILE_PROPERTIES\":\"{\\\"semanticObject\\\":\\\"someTestSemanticObject\\\"," +
                            "\\\"semanticAction\\\":\\\"someTestSemanticAction\\\"}\"}"
                    }
                },
                icon: "sap:icon//home",
                info: undefined,
                isABookmark: true,
                isCustomBookmark: true,
                loadManifest: true,
                numberUnit: undefined,
                serviceRefreshInterval: undefined,
                serviceUrl: undefined,
                title: "title from tileConfiguration",
                subtitle: "subtitle from tileConfiguration",
                url: "someTestURL",
                vizConfig: {},
                vizId: "X-SAP-UI2-CHIP:SSB_NUMERIC",
                vizType: "ssuite/smartbusiness/tiles/numeric"
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("has the expected output for custom bookmark with url, title and subtitle from tileConfiguration", function (assert) {
        // Arrange
        // Test default values which are set in beforeEach.

        // Act
        var oVizData = this.oImportDialog._gatherVizDataObjectFromChipInstance(this.oChip);

        // Assert
        assert.deepEqual(oVizData, this.oExpectedOutput, "Output is as expected.");
    });

    QUnit.test("has the expected output for custom bookmark with url, title and subtitle from TILE_PROPERTIES", function (assert) {
        // Arrange
        var sExpectedTitle = "MyTitle";
        var sExpectedSubtitle = "MySubtitle";
        var sExpectedSemanticObject = "MySemanticObject";
        var sExpectedSemanticAction = "MySemanticAction";
        var sExpectedEvaluationId = "MyEvaluationId1234";

        // Arrange Chip
        this.oChip.configuration = JSON.stringify({
            tileConfiguration: JSON.stringify({
                display_title_text: "notExpectedTitle",
                display_subtitle_text: "notExpectedSubtitle",
                display_icon_url: "sap:icon//home",
                TILE_PROPERTIES: JSON.stringify({
                    title: sExpectedTitle,
                    subtitle: sExpectedSubtitle,
                    semanticObject: sExpectedSemanticObject,
                    semanticAction: sExpectedSemanticAction,
                    evaluationId: sExpectedEvaluationId
                })
            })
        });
        this.oChip.ChipInstanceBags = {
            results: [{
                ChipInstanceProperties: { results: [] },
                id: "sb_tileProperties"
            }]
        };

        // Arrange expectation
        this.oExpectedOutput.chipConfig.bags.sb_tileProperties.properties = {};
        this.oExpectedOutput.chipConfig.configuration.tileConfiguration = "{\"display_title_text\":\"notExpectedTitle\",\"display_subtitle_text\":\"notExpectedSubtitle\"," +
            "\"display_icon_url\":\"sap:icon//home\",\"TILE_PROPERTIES\":\"{\\\"title\\\":\\\"MyTitle\\\",\\\"subtitle\\\":\\\"MySubtitle\\\"," +
            "\\\"semanticObject\\\":\\\"" + sExpectedSemanticObject + "\\\",\\\"semanticAction\\\":\\\"" + sExpectedSemanticAction + "\\\"," +
            "\\\"evaluationId\\\":\\\"" + sExpectedEvaluationId + "\\\"}\"}";
        this.oExpectedOutput.title = sExpectedTitle;
        this.oExpectedOutput.subtitle = sExpectedSubtitle;
        this.oExpectedOutput.url = "#" + sExpectedSemanticObject + "-" + sExpectedSemanticAction + "?EvaluationId=" + sExpectedEvaluationId;

        // Act
        var oVizData = this.oImportDialog._gatherVizDataObjectFromChipInstance(this.oChip);

        // Assert
        assert.deepEqual(oVizData, this.oExpectedOutput, "Output is as expected.");
    });

    QUnit.test("has the expected output for custom bookmark with title and subtitle from ChipInstanceBags but url from TILE_PROPERTIES", function (assert) {
        // Arrange
        var sExpectedTitle = "title from ChipInstanceBags";
        var sExpectedSubtitle = "subtitle from ChipInstanceBags";
        var sExpectedSemanticObject = "MySemanticObject";
        var sExpectedSemanticAction = "MySemanticAction";
        var sExpectedEvaluationId = "MyEvaluationId1234";

        // Arrange Chip
        this.oChip.configuration = JSON.stringify({
            tileConfiguration: JSON.stringify({
                display_title_text: "not expected title from tileConfiguration",
                display_subtitle_text: "not expected subtitle from tileConfiguration",
                display_icon_url: "sap:icon//home",
                TILE_PROPERTIES: JSON.stringify({
                    title: "not expected title from TILE_PROPERTIES",
                    subtitle: "not expected subtitle from TILE_PROPERTIES",
                    semanticObject: sExpectedSemanticObject,
                    semanticAction: sExpectedSemanticAction,
                    evaluationId: sExpectedEvaluationId
                })
            })
        });
        this.oChip.ChipInstanceBags = {
            results: [{
                ChipInstanceProperties: { results: [
                        { name: "title", value: sExpectedTitle },
                        { name: "description", value: sExpectedSubtitle }
                    ] },
                id: "sb_tileProperties"
            }]
        };

        // Arrange expectation
        this.oExpectedOutput.chipConfig.bags.sb_tileProperties.properties = {
            description: "subtitle from ChipInstanceBags",
            title: "title from ChipInstanceBags"
        };
        this.oExpectedOutput.chipConfig.configuration.tileConfiguration = "{\"display_title_text\":\"not expected title from tileConfiguration\"," +
            "\"display_subtitle_text\":\"not expected subtitle from tileConfiguration\"," +
            "\"display_icon_url\":\"sap:icon//home\",\"TILE_PROPERTIES\":\"{\\\"title\\\":\\\"not expected title from TILE_PROPERTIES\\\"," +
            "\\\"subtitle\\\":\\\"not expected subtitle from TILE_PROPERTIES\\\"," +
            "\\\"semanticObject\\\":\\\"" + sExpectedSemanticObject + "\\\",\\\"semanticAction\\\":\\\"" + sExpectedSemanticAction + "\\\"," +
            "\\\"evaluationId\\\":\\\"" + sExpectedEvaluationId + "\\\"}\"}";
        this.oExpectedOutput.title = sExpectedTitle;
        this.oExpectedOutput.subtitle = sExpectedSubtitle;
        this.oExpectedOutput.url = "#" + sExpectedSemanticObject + "-" + sExpectedSemanticAction + "?EvaluationId=" + sExpectedEvaluationId;

        // Act
        var oVizData = this.oImportDialog._gatherVizDataObjectFromChipInstance(this.oChip);

        // Assert
        assert.deepEqual(oVizData, this.oExpectedOutput, "Output is as expected.");
    });

    QUnit.test("has the expected output for custom bookmark without url and invalid TILE_PROPERTIES", function (assert) {
        // Arrange
        var oLogStub = sandbox.stub(Log, "error");
        this.oChip.configuration = JSON.stringify({
            tileConfiguration: JSON.stringify({
                display_title_text: "title from tileConfiguration",
                display_subtitle_text: "subtitle from tileConfiguration",
                display_icon_url: "sap:icon//home",
                TILE_PROPERTIES: "notValidJsonData"
            })
        });
        this.oExpectedOutput.chipConfig.configuration.tileConfiguration = "{\"display_title_text\":\"title from tileConfiguration\"," +
            "\"display_subtitle_text\":\"subtitle from tileConfiguration\",\"display_icon_url\":\"sap:icon//home\"," +
            "\"TILE_PROPERTIES\":\"notValidJsonData\"}";
        this.oExpectedOutput.url = undefined;

        // Act
        var oVizData = this.oImportDialog._gatherVizDataObjectFromChipInstance(this.oChip);

        // Assert
        assert.deepEqual(oVizData, this.oExpectedOutput, "Output is as expected.");
        assert.strictEqual(oLogStub.callCount, 1, "An error should be logged.");
    });

    QUnit.module("The _gatherVizDataObjectFromChipInstance method for search tiles", {
        beforeEach: function () {
        // Arrange
        this.oImportDialog = new ImportDialogController();
        this.oChip = {
            chipId: "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER",
            ChipInstanceBags: {
                results: [{
                    ChipInstanceProperties: {
                        results: [
                            { name: "display_title_text", value: "" }, // title is missing
                            { name: "display_subtitle_text", value: "" }, // subtitle is missing
                            { name: "display_info_text", value: "" } // info is missing
                        ]
                    },
                    id: "tileProperties"
                }]
            },
            configuration: JSON.stringify({
                tileConfiguration: JSON.stringify({
                    display_title_text: "title from tileConfiguration",
                    display_subtitle_text: "subtitle from tileConfiguration",
                    display_info_text: "info from tileConfiguration",
                    TILE_PROPERTIES: JSON.stringify({
                        title: "title from TILE_PROPERTIES",
                        subtitle: "subtitle from TILE_PROPERTIES",
                        info: "info from TILE_PROPERTIES"
                    })
                })
            })
        };

        }
    });

    QUnit.test("when title is missing in bags TILE_PROPERTIES", function (assert) {

        // Act
        this.oVizData = this.oImportDialog._gatherVizDataObjectFromChipInstance(this.oChip);
        // Assert
        assert.strictEqual(this.oVizData.title, "title from tileConfiguration", "title is taken from tileConfiguration");
        assert.strictEqual(this.oVizData.subtitle, "subtitle from tileConfiguration", "subtitle is taken from tileConfiguration");
        assert.strictEqual(this.oVizData.info, "info from tileConfiguration", "info is taken from tileConfiguration");
    });

    QUnit.module("The _saveImport method", {
        beforeEach: function () {
            var oConfigLastStub = sandbox.stub(Config, "last");
            oConfigLastStub.withArgs("/core/spaces/myHome/myHomePageId").returns("SAP_BASIS_PG_UI_MYHOME");
            oConfigLastStub.withArgs("/core/spaces/myHome/myHomeSpaceId").returns("SAP_BASIS_SP_UI_MYHOME");
            oConfigLastStub.withArgs("/core/spaces/myHome/presetSectionId").returns("firstSectionId");
            oConfigLastStub.withArgs("/core/darkMode/supportedThemes").returns([]);
            this.oRefreshBrowserStub = sandbox.stub(WindowUtils, "refreshBrowser");
            this.oImportDialog = new ImportDialogController();
            sandbox.stub(MyHomeImport, "getData").resolves([]);

            var oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync").resolves();
            return Container.init("local")
                .then(function () {
                    return this.oImportDialog.open();
                }.bind(this))
                .then(function () {
                    this.oAddBookmarkStub = sandbox.stub().resolves();
                    this.oAddCustomBookmarkStub = sandbox.stub().resolves();
                    this.oGetContentNodesStub = sandbox.stub().resolves([
                        { id: "SAP_BASIS_SP_UI_MYHOME", children: [{ id: "SAP_BASIS_PG_UI_MYHOME" }] }
                    ]);
                    oGetServiceAsyncStub.withArgs("BookmarkV2").resolves({
                        addBookmark: this.oAddBookmarkStub,
                        addCustomBookmark: this.oAddCustomBookmarkStub,
                        getContentNodes: this.oGetContentNodesStub
                    });
                    this.oInfoStub = sandbox.stub();
                    oGetServiceAsyncStub.withArgs("MessageInternal").resolves({
                        info: this.oInfoStub,
                        error: function (v) { throw (v); }
                    });
                    this.oAddSectionStub = sandbox.stub().resolves();
                    this.oAddVisualizationStub = sandbox.stub().resolves();
                    this.oMoveVisualizationStub = sandbox.stub().resolves();
                    this.oUpdateVisualizationStub = sandbox.stub().resolves();
                    this.oSavePersonalizationStub = sandbox.stub().resolves();
                    oGetServiceAsyncStub.withArgs("Pages").resolves({
                        addSection: this.oAddSectionStub,
                        addVisualization: this.oAddVisualizationStub,
                        enableImplicitSave: sandbox.stub(),
                        getModel: sandbox.stub().returns(new JSONModel({
                            pages: [{
                                sections: [
                                    { id: "defaultSectionId", default: true, visualizations: [] },
                                    { id: "firstSectionId", preset: true, visualizations: [{}] },
                                    { id: "secondSectionId", visualizations: [] },
                                    { id: "thirdSectionId", visualizations: [] }
                                ]
                            }]
                        })),
                        getPageIndex: sandbox.stub().returns(0),
                        savePersonalization: this.oSavePersonalizationStub,
                        moveVisualization: this.oMoveVisualizationStub,
                        updateVisualization: this.oUpdateVisualizationStub
                    });
                    this.oSetImportBookmarksFlagStub = sandbox.stub();
                    this.oUpdateUserPreferencesStub = sandbox.stub().resolves();
                    oGetServiceAsyncStub.withArgs("UserInfo").resolves({
                        getUser: sandbox.stub().returns({
                            setImportBookmarksFlag: this.oSetImportBookmarksFlagStub
                        }),
                        updateUserPreferences: this.oUpdateUserPreferencesStub
                    });
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("groupA and groupB (tiles and links)", function (assert) {
        // Arrange
        var aExpectedAddBookmarkArguments = [];
        var aExpectedAddCustomBookmarkToPageArguments = [];
        var aExpectedAddSectionArguments = [
            [0, 2, { title: "Group A Title" }],
            [0, 3, { title: "Group B Title" }]
        ];
        var aExpectedAddVisualizationArguments = [
            ["SAP_BASIS_PG_UI_MYHOME", "secondSectionId", "tileA1VizId"],
            ["SAP_BASIS_PG_UI_MYHOME", "secondSectionId", "tileA2VizId"],
            ["SAP_BASIS_PG_UI_MYHOME", "secondSectionId", "linkA1VizId"],
            ["SAP_BASIS_PG_UI_MYHOME", "thirdSectionId", "tileB1VizId"],
            ["SAP_BASIS_PG_UI_MYHOME", "thirdSectionId", "linkB1VizId"],
            ["SAP_BASIS_PG_UI_MYHOME", "thirdSectionId", "linkB2VizId"]
        ];
        var aExpectedMoveVisualizationArguments = [];
        var aExpectedUpdateVisualizationArguments = [
            [0, 2, 2, { displayFormatHint: DisplayFormat.Compact }],
            [0, 3, 1, { displayFormatHint: DisplayFormat.Compact }],
            [0, 3, 2, { displayFormatHint: DisplayFormat.Compact }]
        ];

        // Act
        return this.oImportDialog._saveImport([aExpectedPreparedGroups[0], aExpectedPreparedGroups[2]]).then(function () {
            // Assert
            assert.deepEqual(this.oAddBookmarkStub.args, aExpectedAddBookmarkArguments,
                "The number of calls and the arguments of each addBookmark call is as expected.");
            assert.deepEqual(this.oAddCustomBookmarkStub.args, aExpectedAddCustomBookmarkToPageArguments,
                "The number of calls and the arguments of each addCustomBookmark call is as expected.");
            assert.deepEqual(this.oAddSectionStub.args, aExpectedAddSectionArguments,
                "The number of calls and the arguments of each addSection call is as expected.");
            assert.deepEqual(this.oAddVisualizationStub.args, aExpectedAddVisualizationArguments,
                "The number of calls and the arguments of each addVisualization call is as expected.");
            assert.deepEqual(this.oMoveVisualizationStub.args, aExpectedMoveVisualizationArguments,
                "The number of calls and the arguments of each moveVisualization call is as expected.");
            assert.deepEqual(this.oUpdateVisualizationStub.args, aExpectedUpdateVisualizationArguments,
                "The number of calls and the arguments of each updateVisualization call is as expected.");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "Personalization was saved.");
            assert.strictEqual(this.oRefreshBrowserStub.callCount, 1, "Browser was reloaded");
        }.bind(this));
    });

    QUnit.test("groupC (bookmark tile)", function (assert) {
        // Arrange
        var aExpectedAddBookmarkArguments = [[
            {
                title: "I am a Bookmark",
                url: "www.sap.com",
                subtitle: "special",
                icon: undefined,
                info: undefined,
                numberUnit: undefined,
                serviceRefreshInterval: undefined,
                serviceUrl: undefined
            },
            { id: "SAP_BASIS_PG_UI_MYHOME" }
        ]];
        var aExpectedAddCustomBookmarkToPageArguments = [];
        var aExpectedAddSectionArguments = [
            [0, 2, { title: "Group C Title" }]
        ];
        var aExpectedAddVisualizationArguments = [];
        var aExpectedMoveVisualizationArguments = [
            [0, 0, 0, 2, 0]
        ];
        var aExpectedUpdateVisualizationArguments = [];

        // Act
        return this.oImportDialog._saveImport([aExpectedPreparedGroups[3]]).then(function () {
            // Assert
            assert.deepEqual(this.oAddBookmarkStub.args, aExpectedAddBookmarkArguments,
                "The number of calls and the arguments of each addBookmark call is as expected.");
            assert.deepEqual(this.oAddCustomBookmarkStub.args, aExpectedAddCustomBookmarkToPageArguments,
                "The number of calls and the arguments of each addCustomBookmark call is as expected.");
            assert.deepEqual(this.oAddSectionStub.args, aExpectedAddSectionArguments,
                "The number of calls and the arguments of each addSection call is as expected.");
            assert.deepEqual(this.oAddVisualizationStub.args, aExpectedAddVisualizationArguments,
                "The number of calls and the arguments of each addVisualization call is as expected.");
            assert.deepEqual(this.oMoveVisualizationStub.args, aExpectedMoveVisualizationArguments,
                "The number of calls and the arguments of each moveVisualization call is as expected.");
            assert.deepEqual(this.oUpdateVisualizationStub.args, aExpectedUpdateVisualizationArguments,
                "The number of calls and the arguments of each updateVisualization call is as expected.");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "Personalization was saved.");
            assert.strictEqual(this.oRefreshBrowserStub.callCount, 1, "Browser was reloaded");
        }.bind(this));
    });

    QUnit.test("home group (modified tiles and bookmarks)", function (assert) {
        // Arrange
        var aExpectedAddBookmarkArguments = [[
            {
                title: "Bookmark renamed",
                url: undefined,
                subtitle: undefined,
                icon: "sap:icon//home",
                info: "version 1.1",
                numberUnit: undefined,
                serviceRefreshInterval: undefined,
                serviceUrl: undefined
            },
            { id: "SAP_BASIS_PG_UI_MYHOME" }
        ],
        [
            {
                title: "Home Bookmark 2",
                url: undefined,
                subtitle: undefined,
                icon: "sap:icon//home",
                info: undefined,
                numberUnit: undefined,
                serviceRefreshInterval: undefined,
                serviceUrl: undefined
            },
            { id: "SAP_BASIS_PG_UI_MYHOME" }
        ]];
        var aExpectedAddCustomBookmarkToPageArguments = [[
            "ssuite/smartbusiness/tiles/numeric",
            {
                chipConfig: {
                    bags: {
                        sb_tileProperties: {
                            properties: {
                                display_search_keywords: "app"
                            },
                            texts: {
                                description: "my description",
                                title: "my title"
                            }
                        }
                    },
                    chipId: "X-SAP-UI2-CHIP:SSB_NUMERIC",
                    configuration: {
                        tileConfiguration: "{\"display_title_text\":\"Custom Bookmark\",\"display_icon_url\":\"sap:icon//home\"," +
                            "\"TILE_PROPERTIES\":\"{\\\"semanticObject\\\":\\\"someTestSemanticObject\\\",\\\"semanticAction\\\":\\\"someTestSemanticAction\\\"," +
                            "\\\"evaluationId\\\":\\\"someTestEvaluationId\\\"}\"}"
                    }
                },
                icon: "sap:icon//home",
                info: undefined,
                loadManifest: true,
                subtitle: "my description",
                title: "my title",
                url: "#someTestSemanticObject-someTestSemanticAction?EvaluationId=someTestEvaluationId",
                vizConfig: {}
            },
            { id: "SAP_BASIS_PG_UI_MYHOME" }
        ]];

        var aExpectedAddSectionArguments = [];
        var aExpectedAddVisualizationArguments = [
            ["SAP_BASIS_PG_UI_MYHOME", "firstSectionId", "tileH2VizId"]
        ];
        var aExpectedMoveVisualizationArguments = [
            [0, 0, 0, 1, 2],
            [0, 0, 0, 1, 3],
            [0, 0, 0, 1, 4]
        ];
        var aExpectedUpdateVisualizationArguments = [
            [0, 1, 1, {
                title: "Tile renamed",
                subtitle: "subtitle changed"
            }],
            [0, 1, 4, {
                title: "Home Bookmark 2",
                subtitle: undefined,
                icon: "sap:icon//home",
                info: undefined,
                numberUnit: undefined,
                displayFormatHint: DisplayFormat.Compact
            }]
        ];

        // Act
        return this.oImportDialog._saveImport([aExpectedPreparedGroups[1]]).then(function () {
            // Assert
            assert.deepEqual(this.oAddBookmarkStub.args, aExpectedAddBookmarkArguments,
                "The number of calls and the arguments of each addBookmark call is as expected.");
            assert.deepEqual(this.oAddCustomBookmarkStub.args, aExpectedAddCustomBookmarkToPageArguments,
                "The number of calls and the arguments of each addCustomBookmark call is as expected.");
            assert.deepEqual(this.oAddSectionStub.args, aExpectedAddSectionArguments,
                "The number of calls and the arguments of each addSection call is as expected.");
            assert.deepEqual(this.oAddVisualizationStub.args, aExpectedAddVisualizationArguments,
                "The number of calls and the arguments of each addVisualization call is as expected.");
            assert.deepEqual(this.oMoveVisualizationStub.args, aExpectedMoveVisualizationArguments,
                "The number of calls and the arguments of each moveVisualization call is as expected.");
            assert.deepEqual(this.oUpdateVisualizationStub.args, aExpectedUpdateVisualizationArguments,
                "The number of calls and the arguments of each updateVisualization call is as expected.");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "Personalization was saved.");
            assert.strictEqual(this.oRefreshBrowserStub.callCount, 1, "Browser was reloaded");
        }.bind(this));
    });

    QUnit.test("message toast is shown and browser reload is called after successful import.", function (assert) {
        // Arrange
        var aExpectedInfoArguments = [resources.i18n.getText("MyHome.InitialPage.Message.ImportSuccessful")];

        // Act
        return this.oImportDialog._saveImport([aExpectedPreparedGroups[1]]).then(function () {
            // Assert
            // One section was modified, therefore removeNotIntentSupportedForPage was only called once.
            assert.deepEqual(this.oInfoStub.args, [aExpectedInfoArguments], "Message toast was shown correctly.");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "Personalization was saved.");
            assert.strictEqual(this.oRefreshBrowserStub.callCount, 1, "Browser was reloaded");
        }.bind(this));
    });

    QUnit.module("Integrated scenario", {
        beforeEach: function () {
            var oConfigLastStub = sandbox.stub(Config, "last");
            oConfigLastStub.withArgs("/core/spaces/myHome/myHomePageId").returns("SAP_BASIS_PG_UI_MYHOME");
            oConfigLastStub.withArgs("/core/spaces/myHome/myHomeSpaceId").returns("SAP_BASIS_SP_UI_MYHOME");
            oConfigLastStub.withArgs("/core/spaces/myHome/presetSectionId").returns("firstSectionId");
            oConfigLastStub.withArgs("/core/darkMode/supportedThemes").returns([]);
            this.oRefreshBrowserStub = sandbox.stub(WindowUtils, "refreshBrowser");
            this.oImportDialog = new ImportDialogController();
            var sResponse = JSON.stringify({
                d: {
                    configuration: JSON.stringify({
                        order: [
                            "/UI2/Fiori2LaunchpadHome",
                            "customGroupId",
                            "catalogGroupId",
                            "lockedGroupA",
                            "lockedGroupB",
                            "emptyGroup",
                            "customHiddenGroupId"
                        ],
                        hiddenGroups: [
                            "customHiddenGroupId"
                        ]
                    }),
                    MyPages: {
                        results: [
                            { id: "/UI2/Fiori2LaunchpadHome" },
                            { id: "customGroupId" },
                            { id: "customHiddenGroupId" }
                        ]
                    },
                    Pages: {
                        results: [{
                            PageChipInstances: {
                                results: [{
                                    instanceId: "tileH1",
                                    chipId: "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER",
                                    configuration: JSON.stringify({
                                        tileConfiguration: JSON.stringify({
                                            display_title_text: "Home Bookmark",
                                            display_icon_url: "sap:icon//home"
                                        })
                                    }),
                                    ChipInstanceBags: {
                                        results: [{
                                            ChipInstanceProperties: {
                                                results: [
                                                    { name: "display_title_text", value: "Bookmark renamed" },
                                                    { name: "display_info_text", value: "version 1.1" }
                                                ]
                                            },
                                            id: "tileProperties"
                                        }]
                                    }
                                }, {
                                    instanceId: "linkH1",
                                    chipId: "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER",
                                    configuration: JSON.stringify({
                                        tileConfiguration: JSON.stringify({
                                            display_title_text: "Home Bookmark 2",
                                            display_icon_url: "sap:icon//home"
                                        })
                                    }),
                                    ChipInstanceBags: { results: [] }
                                }, {
                                    instanceId: "tileH2",
                                    chipId: "tileH2VizId",
                                    configuration: "",
                                    ChipInstanceBags: {
                                        results: [{
                                            ChipInstanceProperties: {
                                                results: [
                                                    { name: "display_title_text", value: "Tile renamed" },
                                                    { name: "display_subtitle_text", value: "subtitle changed" },
                                                    { name: "display_search_keywords", value: "app" }
                                                ]
                                            },
                                            id: "tileProperties"
                                        }]
                                    }
                                }]
                            },
                            id: "/UI2/Fiori2LaunchpadHome",
                            title: "My Home",
                            isPersLocked: "",
                            scope: "PERSONALIZATION",
                            layout: JSON.stringify({
                                order: [
                                    "tileH2",
                                    "tileH1"
                                ],
                                linkOrder: [
                                    "linkH1"
                                ]
                            })
                        }, {
                            PageChipInstances: {
                                results: [{
                                    instanceId: "tileC1",
                                    chipId: "tileC1VizId",
                                    configuration: "",
                                    ChipInstanceBags: { results: [] }
                                }, {
                                    instanceId: "tileC2",
                                    chipId: "tileC2VizId",
                                    configuration: "",
                                    ChipInstanceBags: { results: [] }
                                }, {
                                    instanceId: "linkC1",
                                    chipId: "linkC1VizId",
                                    configuration: "",
                                    ChipInstanceBags: { results: [] }
                                }]
                            },
                            id: "customGroupId",
                            title: "Custom group title",
                            isPersLocked: "",
                            scope: "PERSONALIZATION",
                            layout: JSON.stringify({
                                order: [
                                    "tileC1",
                                    "tileC2"
                                ],
                                linkOrder: [
                                    "linkC1"
                                ]
                            })
                        }, {
                            PageChipInstances: {
                                results: [{
                                    instanceId: "tileCH1",
                                    chipId: "tileCH1VizId",
                                    configuration: "",
                                    ChipInstanceBags: { results: [] }
                                }]
                            },
                            id: "customHiddenGroupId",
                            title: "Custom hidden group title",
                            isPersLocked: "",
                            scope: "PERSONALIZATION"
                        }, {
                            PageChipInstances: {
                                results: [{
                                    instanceId: "tileLB1",
                                    chipId: "tileLB1VizId",
                                    configuration: "",
                                    ChipInstanceBags: {
                                        results: [{
                                            ChipInstanceProperties: {
                                                results: [
                                                    { name: "display_title_text", value: "Locked Group B Tile renamed" },
                                                    { name: "display_info_text", value: "some new subtitle" }
                                                ]
                                            },
                                            id: "tileProperties"
                                        }]
                                    }
                                }]
                            },
                            id: "lockedGroupB",
                            title: "Locked group B title",
                            isPersLocked: "X",
                            scope: "PERSONALIZATION"
                        }, {
                            PageChipInstances: {
                                results: [{
                                    instanceId: "tileLA1",
                                    chipId: "tileLA1VizId",
                                    configuration: "",
                                    ChipInstanceBags: { results: [] }
                                }]
                            },
                            id: "lockedGroupA",
                            title: "Locked group A title",
                            isPersLocked: "X",
                            scope: "PERSONALIZATION",
                            layout: JSON.stringify({
                                order: [],
                                linkOrder: [
                                    "tileLA1"
                                ]
                            })
                        }, {
                            PageChipInstances: { results: [] },
                            id: "emptyGroup",
                            title: "Empty Group",
                            isPersLocked: "",
                            scope: "PERSONALIZATION"
                        }, {
                            PageChipInstances: {
                                results: [{
                                    instanceId: "tileCG1",
                                    chipId: "tileCG1VizId",
                                    configuration: "",
                                    ChipInstanceBags: { results: [] }
                                }, {
                                    instanceId: "tileCG2",
                                    chipId: "tileCG2VizId",
                                    configuration: "",
                                    ChipInstanceBags: { results: [] }
                                }]
                            },
                            id: "catalogGroupId",
                            title: "Catalog group title",
                            isPersLocked: "",
                            scope: "CONFIGURATION",
                            layout: JSON.stringify({
                                order: [
                                    "tileCG1",
                                    "tileCG2"
                                ]
                            })
                        }
                        ]
                    }
                }
            });
            var oHttpClientStub = sandbox.stub(HttpClient.prototype, "get");
            oHttpClientStub.resolves({
                responseText: sResponse
            });

            return Container.init("local")
                .then(function () {
                    var oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
                    this.oAddBookmarkStub = sandbox.stub().resolves();
                    this.oAddCustomBookmarkStub = sandbox.stub().resolves();
                    oGetServiceAsyncStub.withArgs("BookmarkV2").resolves({
                        addBookmark: this.oAddBookmarkStub,
                        addCustomBookmark: this.oAddCustomBookmarkStub,
                        getContentNodes: sandbox.stub().resolves([
                            { id: "SAP_BASIS_SP_UI_MYHOME", children: [{ id: "SAP_BASIS_PG_UI_MYHOME" }] }
                        ])
                    });
                    oGetServiceAsyncStub.withArgs("URLParsing").resolves(new URLParsing());
                    oGetServiceAsyncStub.withArgs("MessageInternal").resolves({
                        info: sandbox.stub()
                    });
                    this.oAddSectionStub = sandbox.stub().resolves();
                    this.oAddVisualizationStub = sandbox.stub().resolves();
                    this.oMoveVisualizationStub = sandbox.stub().resolves();
                    this.oUpdateVisualizationStub = sandbox.stub().resolves();
                    this.oSavePersonalizationStub = sandbox.stub().resolves();
                    oGetServiceAsyncStub.withArgs("Pages").resolves({
                        addSection: this.oAddSectionStub,
                        addVisualization: this.oAddVisualizationStub,
                        enableImplicitSave: sandbox.stub(),
                        getModel: sandbox.stub().returns(new JSONModel({
                            pages: [{
                                sections: [
                                    { id: "defaultSectionId", default: true, visualizations: [{}] },
                                    { id: "firstSectionId", preset: true, visualizations: [{}] },
                                    { id: "secondSectionId", visualizations: [] },
                                    { id: "thirdSectionId", visualizations: [] },
                                    { id: "fourthSectionId", visualizations: [] }
                                ]
                            }]
                        })),
                        getPageIndex: sandbox.stub().returns(0),
                        savePersonalization: this.oSavePersonalizationStub,
                        moveVisualization: this.oMoveVisualizationStub,
                        updateVisualization: this.oUpdateVisualizationStub
                    });
                    oGetServiceAsyncStub.withArgs("UserInfo").resolves({
                        getUser: sandbox.stub().returns({
                            setImportBookmarksFlag: sandbox.stub()
                        }),
                        updateUserPreferences: sandbox.stub().resolves()
                    });
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("All groups are selected", function (assert) {
        // Arrange
        var aExpectedAddBookmarkArguments = [[
            {
                title: "Bookmark renamed",
                url: undefined,
                subtitle: undefined,
                icon: "sap:icon//home",
                info: "version 1.1",
                numberUnit: undefined,
                serviceRefreshInterval: undefined,
                serviceUrl: undefined
            },
            { id: "SAP_BASIS_PG_UI_MYHOME" }
        ],
        [
            {
                title: "Home Bookmark 2",
                url: undefined,
                subtitle: undefined,
                icon: "sap:icon//home",
                info: undefined,
                numberUnit: undefined,
                serviceRefreshInterval: undefined,
                serviceUrl: undefined
            },
            { id: "SAP_BASIS_PG_UI_MYHOME" }
        ]];
        var aExpectedAddCustomBookmarkToPageArguments = [];
        var aExpectedAddSectionArguments = [
            [0, 1, { title: "Locked group A title" }],
            [0, 2, { title: "Locked group B title" }],
            [0, 4, { title: "Custom group title" }]
        ];
        var aExpectedAddVisualizationArguments = [
            ["SAP_BASIS_PG_UI_MYHOME", "firstSectionId", "tileLA1VizId"],
            ["SAP_BASIS_PG_UI_MYHOME", "secondSectionId", "tileLB1VizId"],
            ["SAP_BASIS_PG_UI_MYHOME", "thirdSectionId", "tileH2VizId"],
            ["SAP_BASIS_PG_UI_MYHOME", "fourthSectionId", "tileC1VizId"],
            ["SAP_BASIS_PG_UI_MYHOME", "fourthSectionId", "tileC2VizId"],
            ["SAP_BASIS_PG_UI_MYHOME", "fourthSectionId", "linkC1VizId"]
        ];
        var aExpectedMoveVisualizationArguments = [
            [0, 0, 0, 3, 2],
            [0, 0, 0, 3, 3]
        ];
        var aExpectedUpdateVisualizationArguments = [
            [0, 1, 0, { displayFormatHint: DisplayFormat.Compact }],
            [0, 2, 0, {
                title: "Locked Group B Tile renamed",
                info: "some new subtitle"
            }],
            [0, 3, 1, {
                title: "Tile renamed",
                subtitle: "subtitle changed"
            }],
            [0, 3, 3, {
                title: "Home Bookmark 2",
                subtitle: undefined,
                icon: "sap:icon//home",
                info: undefined,
                numberUnit: undefined,
                displayFormatHint: DisplayFormat.Compact
            }],
            [0, 4, 2, {
                displayFormatHint: DisplayFormat.Compact
            }]
        ];

        // Act
        return this.oImportDialog.open().then(function (dialog) {
            return new Promise(function (resolve, reject) {
                window.setTimeout(function () {
                    var oList = dialog.getContent()[1];
                    var aItems = oList.getItems();

                    // Assert
                    assert.strictEqual(aItems.length, 4, "There are four Items in the list.");

                    // Act
                    dialog.getBeginButton().firePress();

                    window.setTimeout(function () {
                        // Assert
                        assert.strictEqual(this.oAddBookmarkStub.callCount, 2, "The call count for addBookmark was correct");
                        assert.deepEqual(this.oAddBookmarkStub.args, aExpectedAddBookmarkArguments,
                            "The number of calls and the arguments of each addBookmark call is as expected.");

                        assert.strictEqual(this.oAddCustomBookmarkStub.callCount, 0, "addCustomBookmark was not called.");
                        assert.deepEqual(this.oAddCustomBookmarkStub.args, aExpectedAddCustomBookmarkToPageArguments,
                            "The number of calls and the arguments of each addCustomBookmark call is as expected.");

                        assert.strictEqual(this.oAddSectionStub.callCount, 3, "The call count for addSection was correct");
                        assert.deepEqual(this.oAddSectionStub.args, aExpectedAddSectionArguments,
                            "The number of calls and the arguments of each addSection call is as expected.");

                        assert.strictEqual(this.oAddVisualizationStub.callCount, 6, "The call count for addVisualization was correct");
                        assert.deepEqual(this.oAddVisualizationStub.args, aExpectedAddVisualizationArguments,
                            "The number of calls and the arguments of each addVisualization call is as expected.");

                        assert.strictEqual(this.oMoveVisualizationStub.callCount, 2, "The call count for moveVisualization was correct");
                        assert.deepEqual(this.oMoveVisualizationStub.args, aExpectedMoveVisualizationArguments,
                            "The number of calls and the arguments of each moveVisualization call is as expected.");

                        assert.strictEqual(this.oUpdateVisualizationStub.callCount, 5, "The call count for updateVisualization was correct");
                        assert.deepEqual(this.oUpdateVisualizationStub.args, aExpectedUpdateVisualizationArguments,
                            "The number of calls and the arguments of each updateVisualization call is as expected.");

                        assert.strictEqual(this.oRefreshBrowserStub.callCount, 1, "Browser was reloaded");

                        resolve();
                    }.bind(this), 300);
                }.bind(this), 300);
            }.bind(this));
        }.bind(this));
    });

    QUnit.module("The _executeSequentially method", {
        beforeEach: function () {
            this.oImportDialog = new ImportDialogController();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("executes the given promises sequentially", function (assert) {
        // Arrange
        var oPromise1Stub = sandbox.stub();
        var oPromise2Stub = sandbox.stub();
        var oPromise3Stub = sandbox.stub();

        var fnPromise1 = function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    oPromise1Stub();
                    resolve();
                }, 50);
            });
        };
        var fnPromise2 = function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    oPromise2Stub();
                    resolve();
                }, 25);
            });
        };
        var fnPromise3 = function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    oPromise3Stub();
                    resolve();
                }, 15);
            });
        };

        // Act
        return this.oImportDialog._executeSequentially([
            fnPromise1,
            fnPromise2,
            fnPromise3
        ]).then(function () {
            // Assert
            assert.strictEqual(oPromise1Stub.callCount, 1, "The first stub was called once.");
            assert.strictEqual(oPromise2Stub.callCount, 1, "The second stub was called once.");
            assert.strictEqual(oPromise3Stub.callCount, 1, "The third stub was called once.");
            sandbox.assert.callOrder(oPromise1Stub, oPromise2Stub, oPromise3Stub);
        });
    });

    QUnit.test("executes the given promises sequentially, catches an error and continues the promise chain", function (assert) {
        // Arrange
        var oLogStub = sandbox.stub(Log, "error");
        var oPromise1Stub = sandbox.stub();
        var oPromise2Stub = sandbox.stub();
        var oPromise3Stub = sandbox.stub();

        var fnPromise1 = function () {
            return new Promise(function (resolve) {
                oPromise1Stub();
                resolve();
            });
        };
        var fnPromise2 = function () {
            return new Promise(function (resolve, reject) {
                oPromise2Stub();
                reject("some error");
            });
        };
        var fnPromise3 = function () {
            return new Promise(function (resolve) {
                oPromise3Stub();
                resolve();
            });
        };

        // Act
        return this.oImportDialog._executeSequentially([
            fnPromise1,
            fnPromise2,
            fnPromise3
        ]).then(function () {
            // Assert
            assert.strictEqual(oLogStub.callCount, 1, "An error should be logged");
            assert.strictEqual(oPromise1Stub.callCount, 1, "The first stub was called once.");
            assert.strictEqual(oPromise2Stub.callCount, 1, "The second stub was called once.");
            assert.strictEqual(oPromise3Stub.callCount, 1, "The third stub was called once.");
            sandbox.assert.callOrder(oPromise1Stub, oPromise2Stub, oPromise3Stub);
        });
    });

    QUnit.module("The _getSectionIndex method", {
        beforeEach: function () {
            this.oImportDialog = new ImportDialogController();
            sandbox.stub(this.oImportDialog, "_getPresetSectionIndex").returns(10);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("retrieves the correct sectionIndex for default:false, locked:false, defaultImported:false", function (assert) {
        var iResult = this.oImportDialog._getSectionIndex(null, {
            isDefault: false,
            isLocked: false
        }, 5, false);

        assert.strictEqual(iResult, 16, "The result was as expected.");
    });

    QUnit.test("retrieves the correct sectionIndex for default:true, locked:false, defaultImported:false", function (assert) {
        var iResult = this.oImportDialog._getSectionIndex(null, {
            isDefault: true,
            isLocked: false
        }, 5, false);

        assert.strictEqual(iResult, 15, "The result was as expected.");
    });

    QUnit.test("retrieves the correct sectionIndex for default:false, locked:true, defaultImported:false", function (assert) {
        var iResult = this.oImportDialog._getSectionIndex(null, {
            isDefault: false,
            isLocked: true
        }, 5, false);

        assert.strictEqual(iResult, 15, "The result was as expected.");
    });

    QUnit.test("retrieves the correct sectionIndex for default:false, locked:false, defaultImported:true", function (assert) {
        var iResult = this.oImportDialog._getSectionIndex(null, {
            isDefault: false,
            isLocked: true
        }, 5, false);

        assert.strictEqual(iResult, 15, "The result was as expected.");
    });

    QUnit.module("The _getPresetSectionIndex method", {
        beforeEach: function () {
            this.oImportDialog = new ImportDialogController();
            sandbox.stub(Config, "last").returns("MYHOME-PRESET-SECTION-ID");
            this.oMockPagesService = {
                getModel: sandbox.stub().returns({
                    getProperty: sandbox.stub().returns([
                        { id: "TEST-1" },
                        { id: "TEST-2" },
                        { id: "MYHOME-PRESET-SECTION-ID" },
                        { id: "TEST-3" },
                        { id: "TEST-4" }
                    ])
                })
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("retrieves the correct index of the preset section", function (assert) {
        var iResult = this.oImportDialog._getPresetSectionIndex(this.oMockPagesService);
        assert.strictEqual(iResult, 2, "The result was as expected.");
    });
});
