// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.Menu
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ushell/services/Menu",
    "sap/ushell/services/PersonalizationV2",
    "sap/ushell/Config",
    "sap/ushell/utils",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/resources",
    "sap/ushell/library",
    "sap/ushell/Container"
], function (
    Menu,
    PersonalizationV2,
    Config,
    ushellUtils,
    JSONModel,
    resources,
    ushellLibrary,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    const { KeyCategory, WriteFrequency } = PersonalizationV2.prototype;

    // shortcut for sap.ushell.ContentNodeType
    var ContentNodeType = ushellLibrary.ContentNodeType;

    QUnit.dump.maxDepth = 9;

    var sandbox = sinon.createSandbox({});

    QUnit.module("The function getMenuModel", {
        beforeEach: function () {
            this.oMenuService = new Menu();
            this.oGetMenuEntriesStub = sandbox.stub(this.oMenuService, "getMenuEntries");
            this.oGetMenuEntriesWithPersonalizationDataStub = sandbox.stub(this.oMenuService, "_getMenuEntriesWithPersonalizationData");
            this.oConfigLastStub = sandbox.stub(Config, "last")
                .withArgs("/core/menu/personalization/enabled")
                .returns(false);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the model also if no menu entries are assigned", function (assert) {
        // Arrange
        this.sampleMenuEntries = [];
        this.oGetMenuEntriesStub.resolves(this.sampleMenuEntries);
        // Act
        return this.oMenuService.getMenuModel()
            .then(function (oModel) {
                assert.deepEqual(oModel.getData(), this.sampleMenuEntries, "Empty model is provided");
            }.bind(this));
    });

    QUnit.test("Returns the model without personalization", function (assert) {
        // Arrange
        this.sampleMenuEntries = [{
            id: "standardSpaceA"
        }, {
            id: "standardSpaceB"
        }];
        this.oGetMenuEntriesStub.resolves(this.sampleMenuEntries);
        // Act
        return this.oMenuService.getMenuModel()
            .then(function (oModel) {
                assert.deepEqual(oModel.getData(), this.sampleMenuEntries, "the standard menu entries are set in the model");
            }.bind(this));
    });

    QUnit.test("Returns the model with personalization", function (assert) {
        // Arrange
        this.sampleMenuEntries = [{
            id: "personalizedSpaceA"
        }, {
            id: "personalizedSpaceB"
        }];
        this.oGetMenuEntriesWithPersonalizationDataStub.resolves(this.sampleMenuEntries);
        this.oConfigLastStub.withArgs("/core/menu/personalization/enabled").returns(true);

        // Act
        return this.oMenuService.getMenuModel()
            .then(function (oModel) {
                assert.deepEqual(oModel.getData(), this.sampleMenuEntries, "the personalized menu entries are set in the model");
            }.bind(this));
    });

    QUnit.test("Returns the model correctly if filled", function (assert) {
        // Arrange
        this.sampleMenuEntries = [{
            id: "standardSpaceA"
        }, {
            id: "standardSpaceB"
        }];
        this.oGetMenuEntriesStub.resolves(this.sampleMenuEntries);
        // Act
        return this.oMenuService.getMenuModel()
            .then(function () {
                return this.oMenuService.getMenuModel();
            }.bind(this))
            .then(function (oModel) {
                var oActualDataSecondCall = oModel.getData();
                assert.strictEqual(this.oGetMenuEntriesStub.callCount, 1, "getMenuEntries was only called once");
                assert.deepEqual(oActualDataSecondCall, this.sampleMenuEntries, "the standard menu entries are set in the model");
            }.bind(this));
    });

    QUnit.module("The function getMenuEntries", {
        beforeEach: function () {
            sandbox.stub(resources.i18n, "getText").returnsArg(0);
            this.oConfigLastStub = sandbox.stub(Config, "last");

            this.aMenuEntries = [];
            this.oGetMenuEntriesStub = sandbox.stub().callsFake(function () {
                return Promise.resolve(this.aMenuEntries);
            }.bind(this));
            var oAdapter = {
                getMenuEntries: this.oGetMenuEntriesStub
            };
            this.oMenuService = new Menu(oAdapter);
            this.oGenerateUniqueIdStub = sandbox.stub(ushellUtils, "generateUniqueId");
            this.oGenerateUniqueIdStub.onCall(0).returns("1");
            this.oGenerateUniqueIdStub.onCall(1).returns("2");
            this.oGenerateUniqueIdStub.onCall(2).returns("3");
            this.oGenerateUniqueIdStub.onCall(3).returns("4");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns menu items with added uid", function (assert) {
        // Arrange
        this.aMenuEntries = [{
            title: "ZTest space",
            description: "Testing space",
            icon: "sap-icon://document",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "spaceId", value: "ZTEST_SPACE" },
                    { name: "pageId", value: "ZTEST_PAGE" }
                ],
                innerAppRoute: "&/some/inner/app/route"
            },
            menuEntries: []
        }, {
            title: "UI2 FLP Demo - Test Space",
            description: "Testing space",
            icon: "sap-icon://document",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "spaceId", value: "/UI2/FLP_DEMO_SPACE" },
                    { name: "pageId", value: "/UI2/FLP_DEMO_PAGE" }
                ],
                innerAppRoute: "&/some/inner/app/route"
            },
            menuEntries: []
        }, {
            title: "A Test Space",
            description: "Testing space",
            icon: "sap-icon://document",
            type: "text",
            menuEntries: [{
                title: "Test Page 1",
                description: "Testing page 1",
                icon: "sap-icon://document",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "spaceId", value: "ZTEST_SPACE" },
                        { name: "pageId", value: "ZTEST_PAGE_1" }
                    ],
                    innerAppRoute: "&/some/inner/app/route"
                },
                menuEntries: []
            }]
        }];

        var aExpectedMenuEntries = [{
            uid: "1",
            title: "ZTest space",
            description: "Testing space",
            icon: "sap-icon://document",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "spaceId", value: "ZTEST_SPACE" },
                    { name: "pageId", value: "ZTEST_PAGE" }
                ],
                innerAppRoute: "&/some/inner/app/route"
            },
            menuEntries: []
        }, {
            uid: "2",
            title: "UI2 FLP Demo - Test Space",
            description: "Testing space",
            icon: "sap-icon://document",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "spaceId", value: "/UI2/FLP_DEMO_SPACE" },
                    { name: "pageId", value: "/UI2/FLP_DEMO_PAGE" }
                ],
                innerAppRoute: "&/some/inner/app/route"
            },
            menuEntries: []
        }, {
            uid: "3",
            title: "A Test Space",
            description: "Testing space",
            icon: "sap-icon://document",
            type: "text",
            menuEntries: [{
                uid: "4",
                title: "Test Page 1",
                description: "Testing page 1",
                icon: "sap-icon://document",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "spaceId", value: "ZTEST_SPACE" },
                        { name: "pageId", value: "ZTEST_PAGE_1" }
                    ],
                    innerAppRoute: "&/some/inner/app/route"
                },
                menuEntries: []
            }]
        }];

        // Act
        var oMenuPromise = this.oMenuService.getMenuEntries();

        // Assert
        return oMenuPromise.then(function (aMenuEntries) {
            assert.deepEqual(aMenuEntries, aExpectedMenuEntries, "The menu items are sorted alphabetically.");
        });
    });

    QUnit.test("Adds a \"My Home\" entry in the first position when homeApp is enabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(true);
        this.oConfigLastStub.withArgs("/core/spaces/myHome/myHomeSpaceId").returns("homeSpaceId");

        this.aMenuEntries = [{
            title: "UI2 FLP Demo - Test Space",
            description: "Testing space",
            icon: "sap-icon://document",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "spaceId", value: "/UI2/FLP_DEMO_SPACE" },
                    { name: "pageId", value: "/UI2/FLP_DEMO_PAGE" }
                ],
                innerAppRoute: "&/some/inner/app/route"
            },
            menuEntries: []
        }];

        var aExpectedMenuEntries = [{
            uid: "1",
            id: "homeSpaceId",
            title: "HomeApp.Menu.Title",
            description: "",
            icon: undefined,
            "help-id": "homeApp-menuEntry",
            type: "IBN",
            target: {
                semanticObject: "Shell",
                action: "home",
                parameters: [],
                innerAppRoute: undefined
            },
            isHomeEntry: true,
            menuEntries: []
        }, {
            uid: "2",
            title: "UI2 FLP Demo - Test Space",
            description: "Testing space",
            icon: "sap-icon://document",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "spaceId", value: "/UI2/FLP_DEMO_SPACE" },
                    { name: "pageId", value: "/UI2/FLP_DEMO_PAGE" }
                ],
                innerAppRoute: "&/some/inner/app/route"
            },
            menuEntries: []
        }];

        // Act
        return this.oMenuService.getMenuEntries().then(function (aMenuEntries) {
            // Assert
            assert.deepEqual(aMenuEntries, aExpectedMenuEntries, "Resolved the correct menu items");
        });
    });

    QUnit.module("The function _getMenuEntriesWithPersonalizationData", {
        beforeEach: function () {
            this.oGetMenuPersonalizationStub = sandbox.stub();
            this.oAdapter = {
                getMenuPersonalization: this.oGetMenuPersonalizationStub
            };
            this.oMenuService = new Menu(this.oAdapter);
            this.oGetMenuEntriesStub = sandbox.stub(this.oMenuService, "getMenuEntries");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Works correctly if there is no personalization yet", function (assert) {
        //Arrange
        var oMenuEntries = [
            {
                id: "spaceA"
            },
            {
                id: "spaceB"
            }
        ];
        this.oGetMenuEntriesStub.resolves(oMenuEntries);
        this.oGetMenuPersonalizationStub.resolves(null);

        var oExpectedMenuEntries = [
            {
                type: "separator",
                pinned: true,
                pinnedSortOrder: 0
            },
            {
                id: "spaceA",
                pinned: true,
                pinnedSortOrder: 1
            },
            {
                id: "spaceB",
                pinned: true,
                pinnedSortOrder: 2
            }
        ];

        //Act
        return this.oMenuService._getMenuEntriesWithPersonalizationData()
            .then(function (oMenuEntriesWithPersonalizationData) {
                //Assert
                assert.deepEqual(oMenuEntriesWithPersonalizationData, oExpectedMenuEntries, "The personalization data was added correctly");
            });
    });

    QUnit.test("Works correctly if there is personalization without home entry", function (assert) {
        //Arrange
        var oMenuEntries = [
            {
                id: "spaceA"
            },
            {
                id: "spaceB"
            }
        ];
        this.oGetMenuEntriesStub.resolves(oMenuEntries);

        var oPersonalization = {
            pinnedSpaces: ["spaceB"]
        };
        this.oGetMenuPersonalizationStub.resolves(oPersonalization);

        var oExpectedMenuEntries = [
            {
                type: "separator",
                pinned: true,
                pinnedSortOrder: 0
            },
            {
                id: "spaceA",
                pinned: false,
                pinnedSortOrder: -1
            },
            {
                id: "spaceB",
                pinned: true,
                pinnedSortOrder: 1
            }
        ];

        //Act
        return this.oMenuService._getMenuEntriesWithPersonalizationData()
            .then(function (oMenuEntriesWithPersonalizationData) {
                //Assert
                assert.deepEqual(oMenuEntriesWithPersonalizationData, oExpectedMenuEntries, "The personalization data was added correctly");
            });
    });

    QUnit.test("Works correctly if the user has changed the order of the spaces", function (assert) {
        //Arrange
        var oMenuEntries = [
            {
                id: "spaceA"
            },
            {
                id: "spaceB"
            }
        ];
        this.oGetMenuEntriesStub.resolves(oMenuEntries);

        var oPersonalization = {
            pinnedSpaces: ["spaceB", "spaceA"]
        };
        this.oGetMenuPersonalizationStub.resolves(oPersonalization);

        var oExpectedMenuEntries = [
            {
                type: "separator",
                pinned: true,
                pinnedSortOrder: 0
            },
            {
                id: "spaceA",
                pinned: true,
                pinnedSortOrder: 2
            },
            {
                id: "spaceB",
                pinned: true,
                pinnedSortOrder: 1
            }
        ];

        //Act
        return this.oMenuService._getMenuEntriesWithPersonalizationData()
            .then(function (oMenuEntriesWithPersonalizationData) {
                //Assert
                assert.deepEqual(oMenuEntriesWithPersonalizationData, oExpectedMenuEntries, "The personalization data was added correctly");
            });
    });

    QUnit.test("Works correctly if the user has unpinned all the spaces", function (assert) {
        //Arrange
        var oMenuEntries = [
            {
                id: "spaceB"
            },
            {
                id: "spaceA"
            }
        ];
        this.oGetMenuEntriesStub.resolves(oMenuEntries);

        var oPersonalization = {
            pinnedSpaces: []
        };
        this.oGetMenuPersonalizationStub.resolves(oPersonalization);

        var oExpectedMenuEntries = [
            {
                type: "separator",
                pinned: true,
                pinnedSortOrder: 0
            },
            {
                id: "spaceB",
                pinned: false,
                pinnedSortOrder: -1
            },
            {
                id: "spaceA",
                pinned: false,
                pinnedSortOrder: -1
            }
        ];

        //Act
        return this.oMenuService._getMenuEntriesWithPersonalizationData()
            .then(function (oMenuEntriesWithPersonalizationData) {
                //Assert
                assert.deepEqual(oMenuEntriesWithPersonalizationData, oExpectedMenuEntries, "The personalization data was added correctly");
            });
    });

    QUnit.test("Works correctly if there is personalization with home entry", function (assert) {
        //Arrange
        var oMenuEntries = [
            {
                id: "spaceA",
                isHomeEntry: true
            },
            {
                id: "spaceB"
            }
        ];
        this.oGetMenuEntriesStub.resolves(oMenuEntries);

        var oPersonalization = {
            pinnedSpaces: ["spaceB"]
        };
        this.oGetMenuPersonalizationStub.resolves(oPersonalization);

        var oExpectedMenuEntries = [
            {
                id: "spaceA",
                isHomeEntry: true,
                pinned: true,
                pinnedSortOrder: 0
            },
            {
                type: "separator",
                pinned: true,
                pinnedSortOrder: 1
            },
            {
                id: "spaceB",
                pinned: true,
                pinnedSortOrder: 2
            }
        ];

        //Act
        return this.oMenuService._getMenuEntriesWithPersonalizationData()
            .then(function (oMenuEntriesWithPersonalizationData) {
                //Assert
                assert.deepEqual(oMenuEntriesWithPersonalizationData, oExpectedMenuEntries, "The personalization data was added correctly");
            });
    });

    QUnit.module("The function _extractPersonalization", {
        beforeEach: function () {
            this.oMenuService = new Menu();
        },
        afterEach: function () {

        }
    });

    QUnit.test("Works correctly if some spaces are pinned and some spaces are unpinned", function (assert) {
        //Arrange
        var oMenuEntries = [
            {
                type: "separator",
                pinnedSortOrder: 0
            },
            {
                id: "spaceA",
                pinned: false,
                pinnedSortOrder: -1
            },
            {
                id: "spaceB",
                pinned: true,
                pinnedSortOrder: 1
            }
        ];
        this.oMenuService.oModel.setData(oMenuEntries);

        var oExpectedPersonalizationData = {
            version: "1.0.0",
            pinnedSpaces: [
                "spaceB"
            ]
        };

        //Act
        var oPersonalizationData = this.oMenuService._extractPersonalization();

        //Assert
        assert.deepEqual(oPersonalizationData, oExpectedPersonalizationData, "The personalization data was extracted correctly");
    });

    QUnit.test("Works correctly if the sort order of the spaces is changed", function (assert) {
        //Arrange
        var oMenuEntries = [
            {
                type: "separator",
                pinnedSortOrder: 0
            },
            {
                id: "spaceA",
                pinned: true,
                pinnedSortOrder: 2
            },
            {
                id: "spaceB",
                pinned: true,
                pinnedSortOrder: 1
            }
        ];
        this.oMenuService.oModel.setData(oMenuEntries);

        var oExpectedPersonalizationData = {
            version: "1.0.0",
            pinnedSpaces: [
                "spaceB",
                "spaceA"
            ]
        };

        //Act
        var oPersonalizationData = this.oMenuService._extractPersonalization();

        //Assert
        assert.deepEqual(oPersonalizationData, oExpectedPersonalizationData, "The personalization data was extracted correctly");
    });

    QUnit.test("Works correctly if there is a home entry", function (assert) {
        //Arrange
        var oMenuEntries = [
            {
                id: "spaceA",
                pinned: true,
                pinnedSortOrder: 0,
                isHomeEntry: true
            },
            {
                type: "separator",
                pinnedSortOrder: 1
            },
            {
                id: "spaceB",
                pinned: true,
                pinnedSortOrder: 2
            }
        ];
        this.oMenuService.oModel.setData(oMenuEntries);

        var oExpectedPersonalizationData = {
            version: "1.0.0",
            pinnedSpaces: [
                "spaceB"
            ]
        };

        //Act
        var oPersonalizationData = this.oMenuService._extractPersonalization();

        //Assert
        assert.deepEqual(oPersonalizationData, oExpectedPersonalizationData, "The personalization data was extracted correctly");
    });

    QUnit.test("Works correctly if all the spaces are unpinned", function (assert) {
        //Arrange
        var oMenuEntries = [
            {
                type: "separator",
                pinnedSortOrder: 0
            },
            {
                id: "spaceA",
                pinned: false,
                pinnedSortOrder: -1
            },
            {
                id: "spaceB",
                pinned: false,
                pinnedSortOrder: -1
            }
        ];
        this.oMenuService.oModel.setData(oMenuEntries);

        var oExpectedPersonalizationData = {
            version: "1.0.0",
            pinnedSpaces: []
        };

        //Act
        var oPersonalizationData = this.oMenuService._extractPersonalization();

        //Assert
        assert.deepEqual(oPersonalizationData, oExpectedPersonalizationData, "The personalization data was extracted correctly");
    });

    QUnit.module("The function savePersonalization", {
        beforeEach: function () {
            this.oSetPersDataStub = sandbox.stub().resolves();
            var oPersonalizer = {
                setPersData: this.oSetPersDataStub
            };
            var oPersonalizationService = {
                getPersonalizer: sandbox.stub().resolves(oPersonalizer),
                KeyCategory,
                WriteFrequency
            };
            sandbox.stub(Container, "getServiceAsync").withArgs("PersonalizationV2").resolves(oPersonalizationService);

            this.oMenuService = new Menu();
            this.oPersonalizationData = {
                version: "1.0.0",
                pinnedSpaces: ["spaceA"]
            };
            sandbox.stub(this.oMenuService, "_extractPersonalization").returns(this.oPersonalizationData);

        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Saves the extracted personalization data", function (assert) {
        //Arrange
        var oExpectedPersonalizationData = {
            version: "1.0.0",
            pinnedSpaces: ["spaceA"]
        };

        //Act
        return this.oMenuService.savePersonalization()
            .then(function () {
                //Assert
                assert.deepEqual(this.oSetPersDataStub.args[0][0], oExpectedPersonalizationData, "The personalization data was passed to the personalization service");
            }.bind(this));
    });

    QUnit.test("Rejects the returned promise if the personalization service rejects", function (assert) {
        //Arrange
        this.oSetPersDataStub.rejects();

        //Act
        return this.oMenuService.savePersonalization()
            .catch(function () {
                //Assert
                assert.ok(true, "The promise rejected correctly");
            });
    });

    QUnit.module("The function moveMenuEntry", {
        beforeEach: function () {
            this.oMenuService = new Menu();
            var oMenuEntries = [
                {
                    id: "SAP_BASIS_SP_UI_MYHOME",
                    pinned: true,
                    pinnedSortOrder: 0
                },
                {
                    type: "separator",
                    pinned: true,
                    pinnedSortOrder: 1
                },
                {
                    id: "spaceA",
                    pinned: true,
                    pinnedSortOrder: 2
                },
                {
                    id: "spaceB",
                    pinned: true,
                    pinnedSortOrder: 3
                },
                {
                    id: "spaceC",
                    pinned: true,
                    pinnedSortOrder: 4
                },
                {
                    id: "spaceD",
                    pinned: true,
                    pinnedSortOrder: 5
                }
            ];
            this.oMenuService.oModel.setData(oMenuEntries);
        },
        afterEach: function () {

        }
    });

    QUnit.test("Correctly rearranges the Menu Entries when moving the 4th before the 1st Menu Entry", function (assert) {
        //Arrange
        var oExpectedSortedMenuEntries = [
            {
                id: "SAP_BASIS_SP_UI_MYHOME",
                pinned: true,
                pinnedSortOrder: 0
            },
            {
                type: "separator",
                pinned: true,
                pinnedSortOrder: 1
            },
            {
                id: "spaceA",
                pinned: true,
                pinnedSortOrder: 3
            },
            {
                id: "spaceB",
                pinned: true,
                pinnedSortOrder: 4
            },
            {
                id: "spaceC",
                pinned: true,
                pinnedSortOrder: 5
            },
            {
                id: "spaceD",
                pinned: true,
                pinnedSortOrder: 2
            }
        ];

        //Act
        this.oMenuService.moveMenuEntry(5, 2);

        //Assert
        assert.deepEqual(this.oMenuService.oModel.getData(), oExpectedSortedMenuEntries, "The menu entries have been moved correctly");
    });

    QUnit.test("Correctly rearranges the Menu Entries when moving the 1st before the 1st Menu Entry", function (assert) {
        //Arrange
        var oExpectedSortedMenuEntries = [
            {
                id: "SAP_BASIS_SP_UI_MYHOME",
                pinned: true,
                pinnedSortOrder: 0
            },
            {
                type: "separator",
                pinned: true,
                pinnedSortOrder: 1
            },
            {
                id: "spaceA",
                pinned: true,
                pinnedSortOrder: 2
            },
            {
                id: "spaceB",
                pinned: true,
                pinnedSortOrder: 3
            },
            {
                id: "spaceC",
                pinned: true,
                pinnedSortOrder: 4
            },
            {
                id: "spaceD",
                pinned: true,
                pinnedSortOrder: 5
            }
        ];

        //Act
        this.oMenuService.moveMenuEntry(2, 2);

        //Assert
        assert.deepEqual(this.oMenuService.oModel.getData(), oExpectedSortedMenuEntries, "The menu entries have been moved correctly");
    });

    QUnit.test("Correctly rearranges the Menu Entries when moving the 2nd after the 3rd Menu Entry", function (assert) {
        //Arrange
        var oExpectedSortedMenuEntries = [
            {
                id: "SAP_BASIS_SP_UI_MYHOME",
                pinned: true,
                pinnedSortOrder: 0
            },
            {
                type: "separator",
                pinned: true,
                pinnedSortOrder: 1
            },
            {
                id: "spaceA",
                pinned: true,
                pinnedSortOrder: 3
            },
            {
                id: "spaceB",
                pinned: true,
                pinnedSortOrder: 2
            },
            {
                id: "spaceC",
                pinned: true,
                pinnedSortOrder: 4
            },
            {
                id: "spaceD",
                pinned: true,
                pinnedSortOrder: 5
            }
        ];

        //Act
        this.oMenuService.moveMenuEntry(2, 4);

        //Assert
        assert.deepEqual(this.oMenuService.oModel.getData(), oExpectedSortedMenuEntries, "The menu entries have been moved correctly");
    });

    QUnit.test("Correctly rearranges the Menu Entries when moving a Menu Entry to the end", function (assert) {
        //Arrange
        var oExpectedSortedMenuEntries = [
            {
                id: "SAP_BASIS_SP_UI_MYHOME",
                pinned: true,
                pinnedSortOrder: 0
            },
            {
                type: "separator",
                pinned: true,
                pinnedSortOrder: 1
            },
            {
                id: "spaceA",
                pinned: true,
                pinnedSortOrder: 5
            },
            {
                id: "spaceB",
                pinned: true,
                pinnedSortOrder: 2
            },
            {
                id: "spaceC",
                pinned: true,
                pinnedSortOrder: 3
            },
            {
                id: "spaceD",
                pinned: true,
                pinnedSortOrder: 4
            }
        ];

        //Act
        this.oMenuService.moveMenuEntry(2, 6);

        //Assert
        assert.deepEqual(this.oMenuService.oModel.getData(), oExpectedSortedMenuEntries, "The menu entries have been moved correctly");
    });

    QUnit.test("Correctly rearranges the Menu Entries when there is an unpinned Menu Entry", function (assert) {
        //Arrange
        var oUnpinnedMenuEntry = this.oMenuService.oModel.getData()[4];
        oUnpinnedMenuEntry.pinned = false;
        oUnpinnedMenuEntry.pinnedSortOrder = -1;

        var oExpectedSortedMenuEntries = [
            {
                id: "SAP_BASIS_SP_UI_MYHOME",
                pinned: true,
                pinnedSortOrder: 0
            },
            {
                type: "separator",
                pinned: true,
                pinnedSortOrder: 1
            },
            {
                id: "spaceA",
                pinned: true,
                pinnedSortOrder: 3
            },
            {
                id: "spaceB",
                pinned: true,
                pinnedSortOrder: 2
            },
            {
                id: "spaceC",
                pinned: false,
                pinnedSortOrder: -1
            },
            {
                id: "spaceD",
                pinned: true,
                pinnedSortOrder: 4
            }
        ];

        //Act
        this.oMenuService.moveMenuEntry(2, 4);

        //Assert
        assert.deepEqual(this.oMenuService.oModel.getData(), oExpectedSortedMenuEntries, "The menu entries have been moved correctly");
    });

    QUnit.module("The function isPinned", {
        beforeEach: function () {
            this.oMenuService = new Menu();

            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/menu/personalization/enabled").returns(true);

            this.oMenuModel = new JSONModel([
                {
                    id: "spaceA",
                    pinned: false
                },
                {
                    id: "spaceB",
                    pinned: true
                }
            ]);
            sandbox.stub(this.oMenuService, "getMenuModel").resolves(this.oMenuModel);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves to true if the space is pinned", function (assert) {
        //Arrange

        //Act
        return this.oMenuService.isPinned("spaceB")
            .then(function (bIsPinned) {
                //Assert
                assert.strictEqual(bIsPinned, true, "The space was returned as pinned");
            });
    });

    QUnit.test("Resolves to false if the space is not pinned", function (assert) {
        //Arrange

        //Act
        return this.oMenuService.isPinned("spaceA")
            .then(function (bIsPinned) {
                //Assert
                assert.strictEqual(bIsPinned, false, "The space was returned as unpinned");
            });
    });

    QUnit.test("Resolves to true if the menu personalization is disabled", function (assert) {
        //Arrange
        this.oConfigLastStub.withArgs("/core/menu/personalization/enabled").returns(false);

        //Act
        return this.oMenuService.isPinned("spaceA")
            .then(function (bIsPinned) {
                //Assert
                assert.strictEqual(bIsPinned, true, "The space was returned as pinned");
            });
    });

    /**
     * @deprecated since 1.118.
     */
    QUnit.module("The function getSpacesPagesHierarchy", {
        beforeEach: function () {
            this.aMenuEntries = [];
            this.aContentNodes = [];
            this.oAdapter = {
                getMenuEntries: sandbox.stub().callsFake(function () {
                    return Promise.resolve(this.aMenuEntries);
                }.bind(this))
            };
            this.oMenuService = new Menu(this.oAdapter);
            this.oGenerateUniqueIdStub = sandbox.stub(ushellUtils, "generateUniqueId");
            this.oGenerateUniqueIdStub.onCall(0).returns("1");
            this.oGenerateUniqueIdStub.onCall(1).returns("2");
            this.oGenerateUniqueIdStub.onCall(2).returns("3");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns an object with no spaces if no space exists", function (assert) {
        // Arrange
        this.aMenuEntries = [];
        var oExpected = {
            spaces: []
        };

        // Act
        var oMenuPromise = this.oMenuService.getSpacesPagesHierarchy();

        // Assert
        return oMenuPromise.then(function (oHierarchy) {
            assert.deepEqual(oHierarchy, oExpected, "The Spaces/Pages hierarchy was returned correctly.");
        });
    });

    QUnit.test("Returns the hierarchy if some sample spaces exist", function (assert) {
        // Arrange
        this.aMenuEntries = [{
            title: "ZTest space",
            description: "Testing space",
            icon: "sap-icon://document",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "spaceId", value: "ZTEST_SPACE" },
                    { name: "pageId", value: "ZTEST_PAGE" }
                ],
                innerAppRoute: "&/some/inner/app/route"
            },
            menuEntries: []
        }, {
            title: "UI2 FLP Demo - Test Space",
            description: "Testing space",
            icon: "sap-icon://document",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "pageId", value: "/UI2/FLP_DEMO_PAGE" },
                    { name: "spaceId", value: "/UI2/FLP_DEMO_SPACE" }
                ],
                innerAppRoute: "&/some/inner/app/route"
            },
            menuEntries: []
        }, {
            title: "UI2 FLP Demo - Test Space Multiple Pages",
            description: "Testing space",
            icon: "sap-icon://document",
            type: "text",
            menuEntries: [
                {
                    title: "UI2 FLP Demo - Test Space Page 1",
                    description: "Testing Page 1",
                    icon: "sap-icon://document",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            { name: "pageId", value: "/UI2/FLP_DEMO_PAGE_1" },
                            { name: "spaceId", value: "ZTEST_SPACE_MULTIPLE_PAGES" }
                        ],
                        innerAppRoute: "&/some/inner/app/route_1"
                    },
                    menuEntries: []
                }, {
                    title: "UI2 FLP Demo - Test Space Page 2",
                    description: "Testing Page 2",
                    icon: "sap-icon://document",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            { name: "pageId", value: "/UI2/FLP_DEMO_PAGE_2" },
                            { name: "spaceId", value: "ZTEST_SPACE_MULTIPLE_PAGES" }
                        ],
                        innerAppRoute: "&/some/inner/app/route_2"
                    },
                    menuEntries: []
                }
            ]
        }, {
            title: "UI2 FLP Demo - Test Space without page",
            description: "Testing space",
            icon: "sap-icon://document",
            type: "text",
            menuEntries: []
        }, {
            title: "UI2 FLP Demo - Another Test Space without page",
            description: "Testing space",
            icon: "sap-icon://document",
            type: "text",
            menuEntries: [{
                title: "UI2 FLP Demo - Menu entry which launches URL",
                description: "Calling tagesschau.de",
                icon: "sap-icon://document",
                type: "URL",
                target: { URL: "http://tagesschau.de" },
                menuEntries: []
            }]
        }];

        var oExpected = {
            spaces: [{
                id: "ZTEST_SPACE",
                title: "ZTest space",
                pages: [
                    { id: "ZTEST_PAGE", title: "ZTest space" }
                ]
            }, {
                id: "/UI2/FLP_DEMO_SPACE",
                title: "UI2 FLP Demo - Test Space",
                pages: [
                    { id: "/UI2/FLP_DEMO_PAGE", title: "UI2 FLP Demo - Test Space" }
                ]
            }, {
                id: "ZTEST_SPACE_MULTIPLE_PAGES",
                title: "UI2 FLP Demo - Test Space Multiple Pages",
                pages: [
                    { id: "/UI2/FLP_DEMO_PAGE_1", title: "UI2 FLP Demo - Test Space Page 1" },
                    { id: "/UI2/FLP_DEMO_PAGE_2", title: "UI2 FLP Demo - Test Space Page 2" }
                ]
            }]
        };

        // Act
        var oMenuPromise = this.oMenuService.getSpacesPagesHierarchy();

        // Assert
        return oMenuPromise.then(function (oHierarchy) {
            assert.deepEqual(oHierarchy, oExpected, "The Spaces/Pages hierarchy was returned correctly.");
        });
    });

    QUnit.test("Returns an empty array, if an exception occurs during processing", function (assert) {
        // Arrange
        this.aMenuEntries = [
            {
                title: "ZTest space",
                description: "Testing space",
                icon: "sap-icon://document",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: undefined,
                    innerAppRoute: "&/some/inner/app/route"
                },
                menuEntries: []
            }
        ];

        var oExpected = {
            spaces: []
        };

        // Act
        var oMenuPromise = this.oMenuService.getSpacesPagesHierarchy();

        // Assert
        return oMenuPromise.then(function (oHierarchy) {
            assert.deepEqual(oHierarchy, oExpected, "Returns an empty spaces array, if an exception occurs during processing of invalid menu data.");
        });
    });

    QUnit.test("Returns the hierarchy via getContentNodeEntries if implemented by the adapter", function (assert) {
        // Arrange
        var aContentNodes = [{
            title: "UI2 FLP Demo - Test Space",
            description: "Testing space",
            icon: "sap-icon://document",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "pageId", value: "/UI2/FLP_DEMO_PAGE" },
                    { name: "spaceId", value: "/UI2/FLP_DEMO_SPACE" }
                ],
                innerAppRoute: "&/some/inner/app/route"
            },
            menuEntries: []
        }, {
            title: "UI2 FLP Demo - Test Space Multiple Pages",
            description: "Testing space",
            icon: "sap-icon://document",
            type: "text",
            menuEntries: [
                {
                    title: "UI2 FLP Demo - Test Space Page 1",
                    description: "Testing Page 1",
                    icon: "sap-icon://document",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            { name: "pageId", value: "/UI2/FLP_DEMO_PAGE_1" },
                            { name: "spaceId", value: "ZTEST_SPACE_MULTIPLE_PAGES" }
                        ],
                        innerAppRoute: "&/some/inner/app/route_1"
                    },
                    menuEntries: []
                }, {
                    title: "UI2 FLP Demo - Test Space Page 2",
                    description: "Testing Page 2",
                    icon: "sap-icon://document",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            { name: "pageId", value: "/UI2/FLP_DEMO_PAGE_2" },
                            { name: "spaceId", value: "ZTEST_SPACE_MULTIPLE_PAGES" }
                        ],
                        innerAppRoute: "&/some/inner/app/route_2"
                    },
                    menuEntries: []
                }
            ]
        }, {
            title: "UI2 FLP Demo - Another Test Space without page",
            description: "Testing space",
            icon: "sap-icon://document",
            type: "text",
            menuEntries: [{
                title: "UI2 FLP Demo - Menu entry which launches URL",
                description: "Calling tagesschau.de",
                icon: "sap-icon://document",
                type: "URL",
                target: { URL: "http://tagesschau.de" },
                menuEntries: []
            }]
        }];
        this.oAdapter.getContentNodeEntries = sandbox.stub().resolves(aContentNodes);

        var oExpected = {
            spaces: [{
                id: "/UI2/FLP_DEMO_SPACE",
                title: "UI2 FLP Demo - Test Space",
                pages: [
                    { id: "/UI2/FLP_DEMO_PAGE", title: "UI2 FLP Demo - Test Space" }
                ]
            }, {
                id: "ZTEST_SPACE_MULTIPLE_PAGES",
                title: "UI2 FLP Demo - Test Space Multiple Pages",
                pages: [
                    { id: "/UI2/FLP_DEMO_PAGE_1", title: "UI2 FLP Demo - Test Space Page 1" },
                    { id: "/UI2/FLP_DEMO_PAGE_2", title: "UI2 FLP Demo - Test Space Page 2" }
                ]
            }]
        };

        // Act
        var oMenuPromise = this.oMenuService.getSpacesPagesHierarchy();

        // Assert
        return oMenuPromise.then(function (oHierarchy) {
            assert.strictEqual(this.oAdapter.getMenuEntries.callCount, 0, "getMenuEntries was not called");
            assert.strictEqual(this.oAdapter.getContentNodeEntries.callCount, 1, "getContentNodeEntries was called once");
            assert.deepEqual(oHierarchy, oExpected, "The Spaces/Pages hierarchy was returned correctly.");
        }.bind(this));
    });

    QUnit.module("The function hasMultiplePages", {
        beforeEach: function () {
            var aContentNodes = [{
                id: "ZTEST_SPACE",
                label: "ZTest space",
                type: ContentNodeType.Space,
                isContainer: false,
                children: [{
                    id: "ZTEST_PAGE",
                    label: "ZTest page",
                    type: ContentNodeType.Page,
                    isContainer: true,
                    children: []
                }]
            }, {
                id: "/UI2/FLP_DEMO_SPACE",
                label: "UI2 FLP Demo - Test Space",
                type: ContentNodeType.Space,
                isContainer: false,
                children: [{
                    id: "/UI2/FLP_DEMO_PAGE",
                    label: "UI2 FLP Demo - Test Page",
                    type: ContentNodeType.Page,
                    isContainer: true,
                    children: []
                }]
            }, {
                id: "ZTEST_SPACE_MULTIPLE_PAGES",
                label: "UI2 FLP Demo - Test Space Multiple Pages",
                type: ContentNodeType.Space,
                isContainer: false,
                children: [{
                    id: "/UI2/FLP_DEMO_PAGE_1",
                    label: "UI2 FLP Demo - Test Space Page 1",
                    type: ContentNodeType.Page,
                    isContainer: true,
                    children: []
                }, {
                    id: "/UI2/FLP_DEMO_PAGE_2",
                    label: "UI2 FLP Demo - Test Space Page 2",
                    type: ContentNodeType.Page,
                    isContainer: true,
                    children: []
                }]
            }];

            this.oMenuService = new Menu({});
            this.oGetContentNodesStub = sandbox.stub(this.oMenuService, "getContentNodes").resolves(aContentNodes);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns 'true' if a space has multiple pages assigned", function (assert) {
        return this.oMenuService.hasMultiplePages("ZTEST_SPACE_MULTIPLE_PAGES").then(function (bHasMultiple) {
            assert.ok(bHasMultiple, "The function hasMultiplePages returns 'true' if a space has multiple pages assigned.");
        });
    });

    QUnit.test("Returns 'false' if a space only has one page assigned", function (assert) {
        return this.oMenuService.hasMultiplePages("ZTEST_SPACE").then(function (bHasMultiple) {
            assert.notOk(bHasMultiple, "The function hasMultiplePages returns 'false' if a space has only one page assigned.");
        });
    });

    QUnit.test("Returns 'false' if a space with the specified ID doesn't exist", function (assert) {
        return this.oMenuService.hasMultiplePages("NON_EXISTING_SPACE").then(function (bHasMultiple) {
            assert.notOk(bHasMultiple, "The function hasMultiplePages returns 'false' if the space with the specified ID couldn't be found.");
        });
    });

    QUnit.module("The function getSpaceAndPageTitles", {
        beforeEach: function () {
            var aContentNodes = [{
                id: "ZTEST_SPACE",
                label: "Test space",
                type: ContentNodeType.Space,
                isContainer: false,
                children: [{
                    id: "ZTEST_PAGE",
                    label: "Test page",
                    type: ContentNodeType.Page,
                    isContainer: true,
                    children: []
                }]
            }, {
                id: "/UI2/FLP_DEMO_SPACE",
                label: "UI2 FLP Demo - Test Space",
                type: ContentNodeType.Space,
                isContainer: false,
                children: [{
                    id: "/UI2/FLP_DEMO_PAGE",
                    label: "UI2 FLP Demo - Test Page",
                    type: ContentNodeType.Page,
                    isContainer: true,
                    children: []
                }]
            }, {
                id: "ZTEST_SPACE_MULTIPLE_PAGES",
                label: "UI2 FLP Demo - Test Space Multiple Pages",
                type: ContentNodeType.Space,
                isContainer: false,
                children: [{
                    id: "/UI2/FLP_DEMO_PAGE_1",
                    label: "UI2 FLP Demo - Test Space Page 1",
                    type: ContentNodeType.Page,
                    isContainer: true,
                    children: []
                }, {
                    id: "/UI2/FLP_DEMO_PAGE_2",
                    label: "UI2 FLP Demo - Test Space Page 2",
                    type: ContentNodeType.Page,
                    isContainer: true,
                    children: []
                }]
            }];

            this.oMenuService = new Menu({});
            this.oGetContentNodesStub = sandbox.stub(this.oMenuService, "getContentNodes").resolves(aContentNodes);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns null if the page does not belong to the specified space", function (assert) {
        return this.oMenuService.getSpaceAndPageTitles("ZTEST_SPACE", "ZTEST_SPACE_MULTIPLE_PAGES").then(function (oTitles) {
            assert.strictEqual(oTitles, null, "The returned value is null.");
        });
    });

    QUnit.test("Returns correct space and page titles", function (assert) {
        return this.oMenuService.getSpaceAndPageTitles("ZTEST_SPACE", "ZTEST_PAGE").then(function (oTitles) {
            assert.ok(oTitles, "The function getSpaceAndPageTitles returns an object.");
            assert.strictEqual(oTitles && oTitles.spaceTitle, "Test space", "Correct space title");
            assert.strictEqual(oTitles && oTitles.pageTitle, "Test page", "Correct page title");
        });
    });

    QUnit.module("The function getDefaultSpace with personalization disabled", {
        beforeEach: function () {
            var aContentNodes = [{
                id: "EMPTY_SPACE",
                label: "Empty space",
                type: ContentNodeType.Space,
                isContainer: false,
                children: []
            }, {
                id: "ZTEST_SPACE",
                label: "Test space",
                type: ContentNodeType.Space,
                isContainer: false,
                children: [{
                    id: "ZTEST_PAGE",
                    label: "Test page",
                    type: ContentNodeType.Page,
                    isContainer: true,
                    children: []
                }]
            }];

            this.oMenuService = new Menu({});
            this.oGetContentNodesStub = sandbox.stub(this.oMenuService, "getContentNodes").resolves(aContentNodes);

            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/menu/personalization/enabled").returns(false);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns undefined if there is no space/page", function (assert) {
        // Arrange
        var aContentNodes = [{
            id: "EMPTY_SPACE",
            label: "Empty space",
            type: ContentNodeType.Space,
            isContainer: false,
            children: []
        }];
        this.oGetContentNodesStub.resolves(aContentNodes);
        // Act
        return this.oMenuService.getDefaultSpace().then(function (oSpace) {
            // Assert
            assert.strictEqual(oSpace, undefined, "Resolved undefined");
        });
    });

    QUnit.test("Filters ContentNodes by Space and Page", function (assert) {
        // Arrange
        var aExpectedArgs = [[ContentNodeType.Space, ContentNodeType.Page]];
        // Act
        return this.oMenuService.getDefaultSpace().then(function (oSpace) {
            // Assert
            assert.deepEqual(this.oGetContentNodesStub.getCall(0).args, aExpectedArgs, "Called getContentNodes with correct arguments.");
        }.bind(this));
    });

    QUnit.test("Returns the first space with a page", function (assert) {
        // Arrange
        var oExpectedSpaceWithPage = {
            id: "ZTEST_SPACE",
            label: "Test space",
            type: ContentNodeType.Space,
            isContainer: false,
            children: [{
                id: "ZTEST_PAGE",
                label: "Test page",
                type: ContentNodeType.Page,
                isContainer: true,
                children: []
            }]
        };

        // Act
        return this.oMenuService.getDefaultSpace().then(function (oSpace) {
            // Assert
            assert.deepEqual(oSpace, oExpectedSpaceWithPage, "The right space was returned");
            assert.strictEqual(this.oGetContentNodesStub.callCount, 1, "getContentNodes was called with correct arguments.");
        }.bind(this));
    });

    QUnit.module("The function getDefaultSpace with personalization enabled", {
        beforeEach: function () {
            this.oMenuService = new Menu({});
            this.oModel = new JSONModel();
            sandbox.stub(this.oMenuService, "getMenuModel").returns(this.oModel);
            this.oGetContentNodesStub = sandbox.stub(this.oMenuService, "getContentNodes");

            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/menu/personalization/enabled").returns(true);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the first menu entry", function (assert) {
        //Arrange
        var aContentNodes = [{
            id: "EMPTY_SPACE",
            label: "Empty space",
            type: ContentNodeType.Space,
            isContainer: false,
            children: []
        }, {
            id: "spaceA",
            label: "Test space",
            type: ContentNodeType.Space,
            isContainer: false,
            children: [{
                id: "ZTEST_PAGE",
                label: "Test page",
                type: ContentNodeType.Page,
                isContainer: true,
                children: []
            }]
        }];
        this.oGetContentNodesStub.resolves(aContentNodes);

        var aMenuEntries = [
            {
                type: "separator",
                pinned: true,
                pinnedSortOrder: 0
            },
            {
                id: "spaceA",
                pinned: true,
                pinnedSortOrder: 1
            }
        ];
        this.oModel.setData(aMenuEntries);

        var oExpectedDefaultSpace = {
            id: "spaceA",
            label: "Test space",
            type: ContentNodeType.Space,
            isContainer: false,
            children: [{
                id: "ZTEST_PAGE",
                label: "Test page",
                type: ContentNodeType.Page,
                isContainer: true,
                children: []
            }]
        };

        //Act
        return this.oMenuService.getDefaultSpace()
            .then(function (oDefaultSpace) {
                //Assert
                assert.deepEqual(oDefaultSpace, oExpectedDefaultSpace, "The correct space was returned");
            });
    });

    QUnit.test("Returns the second menu entry if the first one is unpinned", function (assert) {
        //Arrange
        var aContentNodes = [{
            id: "EMPTY_SPACE",
            label: "Empty space",
            type: ContentNodeType.Space,
            isContainer: false,
            children: []
        }, {
            id: "spaceA",
            label: "Test space A",
            type: ContentNodeType.Space,
            isContainer: false,
            children: [{
                id: "ZTEST_PAGE",
                label: "Test page",
                type: ContentNodeType.Page,
                isContainer: true,
                children: []
            }]
        }, {
            id: "spaceB",
            label: "Test space B",
            type: ContentNodeType.Space,
            isContainer: false,
            children: [{
                id: "ZTEST_PAGE",
                label: "Test page",
                type: ContentNodeType.Page,
                isContainer: true,
                children: []
            }]
        }];
        this.oGetContentNodesStub.resolves(aContentNodes);

        var aMenuEntries = [
            {
                type: "separator",
                pinned: true,
                pinnedSortOrder: 0
            },
            {
                id: "spaceA",
                pinned: false,
                pinnedSortOrder: -1
            },
            {
                id: "spaceB",
                pinned: true,
                pinnedSortOrder: 1
            }
        ];
        this.oModel.setData(aMenuEntries);

        var oExpectedDefaultSpace = {
            id: "spaceB",
            label: "Test space B",
            type: ContentNodeType.Space,
            isContainer: false,
            children: [{
                id: "ZTEST_PAGE",
                label: "Test page",
                type: ContentNodeType.Page,
                isContainer: true,
                children: []
            }]
        };

        //Act
        return this.oMenuService.getDefaultSpace()
            .then(function (oDefaultSpace) {
                //Assert
                assert.deepEqual(oDefaultSpace, oExpectedDefaultSpace, "The correct space was returned");
            });
    });

    QUnit.test("Filters out empty spaces", function (assert) {
        //Arrange
        var aContentNodes = [{
            id: "EMPTY_SPACE",
            label: "Empty space",
            type: ContentNodeType.Space,
            isContainer: false,
            children: []
        }, {
            id: "spaceA",
            label: "Test space A",
            type: ContentNodeType.Space,
            isContainer: false,
            children: [{
                id: "ZTEST_PAGE",
                label: "Test page",
                type: ContentNodeType.Page,
                isContainer: true,
                children: []
            }]
        }];
        this.oGetContentNodesStub.resolves(aContentNodes);

        var aMenuEntries = [
            {
                type: "separator",
                pinned: true,
                pinnedSortOrder: 0
            },
            {
                id: "EMPTY_SPACE",
                pinned: true,
                pinnedSortOrder: 1
            },
            {
                id: "spaceA",
                pinned: true,
                pinnedSortOrder: 2
            }
        ];
        this.oModel.setData(aMenuEntries);

        var oExpectedDefaultSpace = {
            id: "spaceA",
            label: "Test space A",
            type: ContentNodeType.Space,
            isContainer: false,
            children: [{
                id: "ZTEST_PAGE",
                label: "Test page",
                type: ContentNodeType.Page,
                isContainer: true,
                children: []
            }]
        };

        //Act
        return this.oMenuService.getDefaultSpace()
            .then(function (oDefaultSpace) {
                //Assert
                assert.deepEqual(oDefaultSpace, oExpectedDefaultSpace, "The correct space was returned");
            });
    });

    QUnit.test("Returns the second menu entry if it has the lowest sort order", function (assert) {
        //Arrange
        var aContentNodes = [{
            id: "EMPTY_SPACE",
            label: "Empty space",
            type: ContentNodeType.Space,
            isContainer: false,
            children: []
        }, {
            id: "spaceA",
            label: "Test space A",
            type: ContentNodeType.Space,
            isContainer: false,
            children: [{
                id: "ZTEST_PAGE",
                label: "Test page",
                type: ContentNodeType.Page,
                isContainer: true,
                children: []
            }]
        }, {
            id: "spaceB",
            label: "Test space B",
            type: ContentNodeType.Space,
            isContainer: false,
            children: [{
                id: "ZTEST_PAGE",
                label: "Test page",
                type: ContentNodeType.Page,
                isContainer: true,
                children: []
            }]
        }];
        this.oGetContentNodesStub.resolves(aContentNodes);

        var aMenuEntries = [
            {
                type: "separator",
                pinned: true,
                pinnedSortOrder: 0
            },
            {
                id: "spaceA",
                pinned: true,
                pinnedSortOrder: 2
            },
            {
                id: "spaceB",
                pinned: true,
                pinnedSortOrder: 1
            }
        ];
        this.oModel.setData(aMenuEntries);

        var oExpectedDefaultSpace = {
            id: "spaceB",
            label: "Test space B",
            type: ContentNodeType.Space,
            isContainer: false,
            children: [{
                id: "ZTEST_PAGE",
                label: "Test page",
                type: ContentNodeType.Page,
                isContainer: true,
                children: []
            }]
        };

        //Act
        return this.oMenuService.getDefaultSpace()
            .then(function (oDefaultSpace) {
                //Assert
                assert.deepEqual(oDefaultSpace, oExpectedDefaultSpace, "The correct space was returned");
            });
    });

    QUnit.test("Returns first valid content node if no spaces are pinned", function (assert) {
        //Arrange
        var aContentNodes = [{
            id: "EMPTY_SPACE",
            label: "Empty space",
            type: ContentNodeType.Space,
            isContainer: false,
            children: []
        }, {
            id: "spaceA",
            label: "Test space A",
            type: ContentNodeType.Space,
            isContainer: false,
            children: [{
                id: "ZTEST_PAGE",
                label: "Test page",
                type: ContentNodeType.Page,
                isContainer: true,
                children: []
            }]
        }];
        this.oGetContentNodesStub.resolves(aContentNodes);

        var aMenuEntries = [
            {
                type: "separator",
                pinned: true,
                pinnedSortOrder: 0
            },
            {
                id: "spaceA",
                pinned: false,
                pinnedSortOrder: -1
            }
        ];
        this.oModel.setData(aMenuEntries);

        //Act
        return this.oMenuService.getDefaultSpace()
            .then(function (oDefaultSpace) {
                //Assert
                assert.deepEqual(oDefaultSpace, aContentNodes[1], "The correct space was returned");
            });
    });

    QUnit.module("The function _updateNode", {
        beforeEach: function () {
            this.oGenerateUniqueIdStub = sandbox.stub(ushellUtils, "generateUniqueId");
            this.oGenerateUniqueIdStub.returns("42");

            this.oMenuService = new Menu({});
            this.aNodes = [{
                id: "space01",
                "help-id": "Space-space01",
                title: "Space 1",
                description: "Description of space 1",
                icon: "sap-icon://syringe",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "pageId", value: "page1" },
                        { name: "spaceId", value: "space01" }
                    ]
                },
                uid: "id-1604069611504-17"
            }, {
                id: "emptySpace",
                "help-id": "Space-emptySpace",
                title: "empty Space",
                description: "Description of empty space",
                icon: "sap-icon://syringe",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "pageId", value: "emptyPage" },
                        { name: "spaceId", value: "emptySpace" }
                    ]
                },
                uid: "id-1604069611505-18"
            }, {
                id: "space02",
                "help-id": "Space-space02",
                title: "Space 2",
                description: "Description of space 2",
                icon: "sap-icon://sonography",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "pageId", value: "page2" },
                        { name: "spaceId", value: "space02" }
                    ]
                },
                uid: "id-1604069611505-19"
            }, {
                id: "space03",
                "help-id": "Space-space03",
                title: "Space 3",
                description: "Description of space 3",
                icon: "sap-icon://nurse",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "pageId", value: "page3" },
                        { name: "spaceId", value: "space03" }
                    ]
                },
                uid: "id-1604069611505-20"
            }, {
                id: "space04",
                "help-id": "Space-space04",
                title: "Space 4 (Page 3)",
                description: "Contains same page as Space 3",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "pageId", value: "page3" },
                        { name: "spaceId", value: "space04" }
                    ]
                },
                uid: "id-1604069611505-21"
            }, {
                id: "space05",
                "help-id": "Space-space05",
                title: "Space 5",
                description: "Description of Space 5",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "pageId", value: "page4" },
                        { name: "spaceId", value: "space05" }
                    ]
                },
                menuEntries: [{
                    id: "space05page4",
                    "help-id": "Page-page4",
                    title: "Page 4",
                    description: "Description of Page 4",
                    icon: "sap-icon://stethoscope",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            { name: "pageId", value: "page4" },
                            { name: "spaceId", value: "space05" }
                        ]
                    },
                    uid: "id-1604069611505-23"
                }, {
                    id: "space05page5",
                    "help-id": "Space-page5",
                    title: "Page 5",
                    description: "Description of Page 5",
                    icon: "sap-icon://stethoscope",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            { name: "pageId", value: "page5" },
                            { name: "spaceId", value: "space05" }
                        ]
                    },
                    uid: "id-1604069611505-24"
                }],
                uid: "id-1604069611505-22"
            }, {
                id: "space06",
                "help-id": "Space-space06",
                title: "Space 6",
                description: "Description of space 6",
                icon: "sap-icon://syringe",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "pageId", value: "page6" },
                        { name: "spaceId", value: "space06" }
                    ]
                },
                uid: "id-1604069611505-25"
            }];
            this.oManagedTree = {
                "help-id": "Space-space05",
                title: "Space 5",
                description: "Description of Space 5",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "pageId", value: "page4" },
                        { name: "spaceId", value: "space05" }
                    ]
                },
                menuEntries: [{
                    title: "Page 4",
                    description: "Description of Page 4",
                    icon: "sap-icon://stethoscope",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            { name: "pageId", value: "page4" },
                            { name: "spaceId", value: "space05" }
                        ]
                    }
                }]
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Works with an empty array of nodes", function (assert) {
        // Act
        var aResult = this.oMenuService._updateNode("test-node-id", [], this.oManagedTree);
        // Assert
        assert.deepEqual(aResult, [], "The result was empty");
    });

    QUnit.test("Leaves the nodes unchanged if no node with the given id is found", function (assert) {
        // Act
        var aResult = this.oMenuService._updateNode("test-node-id", this.aNodes, this.oManagedTree);
        // Assert
        assert.deepEqual(aResult, this.aNodes, "The nodes were not changed");
    });

    QUnit.test("Replaces a root node with the managed tree", function (assert) {
        // Act
        var aResult = this.oMenuService._updateNode("space05", this.aNodes, this.oManagedTree);
        // Assert
        assert.deepEqual(aResult, [{
            id: "space01",
            "help-id": "Space-space01",
            title: "Space 1",
            description: "Description of space 1",
            icon: "sap-icon://syringe",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "pageId", value: "page1" },
                    { name: "spaceId", value: "space01" }
                ]
            },
            uid: "id-1604069611504-17"
        }, {
            id: "emptySpace",
            "help-id": "Space-emptySpace",
            title: "empty Space",
            description: "Description of empty space",
            icon: "sap-icon://syringe",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "pageId", value: "emptyPage" },
                    { name: "spaceId", value: "emptySpace" }
                ]
            },
            uid: "id-1604069611505-18"
        }, {
            id: "space02",
            "help-id": "Space-space02",
            title: "Space 2",
            description: "Description of space 2",
            icon: "sap-icon://sonography",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "pageId", value: "page2" },
                    { name: "spaceId", value: "space02" }
                ]
            },
            uid: "id-1604069611505-19"
        }, {
            id: "space03",
            "help-id": "Space-space03",
            title: "Space 3",
            description: "Description of space 3",
            icon: "sap-icon://nurse",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "pageId", value: "page3" },
                    { name: "spaceId", value: "space03" }
                ]
            },
            uid: "id-1604069611505-20"
        }, {
            id: "space04",
            "help-id": "Space-space04",
            title: "Space 4 (Page 3)",
            description: "Contains same page as Space 3",
            icon: "sap-icon://stethoscope",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "pageId", value: "page3" },
                    { name: "spaceId", value: "space04" }
                ]
            },
            uid: "id-1604069611505-21"
        }, {
            "help-id": "Space-space05",
            title: "Space 5",
            description: "Description of Space 5",
            icon: "sap-icon://stethoscope",
            type: "IBN",
            uid: "42",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "pageId", value: "page4" },
                    { name: "spaceId", value: "space05" }
                ]
            },
            menuEntries: [{
                title: "Page 4",
                description: "Description of Page 4",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                uid: "42",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "pageId", value: "page4" },
                        { name: "spaceId", value: "space05" }
                    ]
                }
            }]
        }, {
            id: "space06",
            "help-id": "Space-space06",
            title: "Space 6",
            description: "Description of space 6",
            icon: "sap-icon://syringe",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "pageId", value: "page6" },
                    { name: "spaceId", value: "space06" }
                ]
            },
            uid: "id-1604069611505-25"
        }], "The nodes were not changed");
    });

    QUnit.test("Replaces a child node with the managed tree", function (assert) {
        // Act
        var aResult = this.oMenuService._updateNode("space05", this.aNodes, this.oManagedTree);
        // Assert
        assert.deepEqual(aResult, [{
            id: "space01",
            "help-id": "Space-space01",
            title: "Space 1",
            description: "Description of space 1",
            icon: "sap-icon://syringe",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "pageId", value: "page1" },
                    { name: "spaceId", value: "space01" }
                ]
            },
            uid: "id-1604069611504-17"
        }, {
            id: "emptySpace",
            "help-id": "Space-emptySpace",
            title: "empty Space",
            description: "Description of empty space",
            icon: "sap-icon://syringe",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "pageId", value: "emptyPage" },
                    { name: "spaceId", value: "emptySpace" }
                ]
            },
            uid: "id-1604069611505-18"
        }, {
            id: "space02",
            "help-id": "Space-space02",
            title: "Space 2",
            description: "Description of space 2",
            icon: "sap-icon://sonography",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "pageId", value: "page2" },
                    { name: "spaceId", value: "space02" }
                ]
            },
            uid: "id-1604069611505-19"
        }, {
            id: "space03",
            "help-id": "Space-space03",
            title: "Space 3",
            description: "Description of space 3",
            icon: "sap-icon://nurse",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "pageId", value: "page3" },
                    { name: "spaceId", value: "space03" }
                ]
            },
            uid: "id-1604069611505-20"
        }, {
            id: "space04",
            "help-id": "Space-space04",
            title: "Space 4 (Page 3)",
            description: "Contains same page as Space 3",
            icon: "sap-icon://stethoscope",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "pageId", value: "page3" },
                    { name: "spaceId", value: "space04" }
                ]
            },
            uid: "id-1604069611505-21"
        }, {
            "help-id": "Space-space05",
            title: "Space 5",
            description: "Description of Space 5",
            icon: "sap-icon://stethoscope",
            type: "IBN",
            uid: "42",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "pageId", value: "page4" },
                    { name: "spaceId", value: "space05" }
                ]
            },
            menuEntries: [{
                title: "Page 4",
                description: "Description of Page 4",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                uid: "42",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "pageId", value: "page4" },
                        { name: "spaceId", value: "space05" }
                    ]
                }
            }]
        }, {
            id: "space06",
            "help-id": "Space-space06",
            title: "Space 6",
            description: "Description of space 6",
            icon: "sap-icon://syringe",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "pageId", value: "page6" },
                    { name: "spaceId", value: "space06" }
                ]
            },
            uid: "id-1604069611505-25"
        }], "The nodes were not changed");
    });

    QUnit.module("The function _getNodeInfo", {
        beforeEach: function () {
            this.oMenuService = new Menu({});
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the managerId if the parent node is the managed node", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "1",
            menuEntries: [{
                id: "2",
                managerId: "test-manager-id",
                menuEntries: [{
                    id: "test-node"
                }]
            }]
        }]);
        // Assert
        assert.strictEqual(oResult.managerId, "test-manager-id", "The managerId was correctly returned");
    });

    QUnit.test("Returns the managerId if the given node is the managed node", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "1",
            menuEntries: [{
                id: "2",
                menuEntries: [{
                    id: "test-node",
                    managerId: "test-manager-id"
                }]
            }]
        }]);
        // Assert
        assert.strictEqual(oResult.managerId, "test-manager-id", "The managerId was correctly returned");
    });

    QUnit.test("Returns the managerId if the root node is the managed node", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "1",
            managerId: "test-manager-id",
            menuEntries: [{
                id: "2",
                menuEntries: [{
                    id: "test-node"
                }]
            }]
        }]);
        // Assert
        assert.strictEqual(oResult.managerId, "test-manager-id", "The managerId was correctly returned");
    });

    QUnit.test("Returns null if the managerId is in a different node", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "x",
            managerId: "test-manager-id",
            menuEntries: [{
                id: "y"
            }]
        }, {
            id: "1",
            menuEntries: [{
                id: "2",
                menuEntries: [{
                    id: "test-node"
                }]
            }]
        }, {
            id: "a",
            managerId: "test-manager-id-2",
            menuEntries: [{
                id: "b"
            }]
        }]);
        // Assert
        assert.strictEqual(oResult.managerId, null, "The managerId was null");
    });

    QUnit.test("Returns null if the manager id is a child of the given nodeId", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "1",
            menuEntries: [{
                id: "2",
                menuEntries: [{
                    id: "test-node",
                    menuEntries: [{
                        id: "4",
                        managerId: "test-manager-id"
                    }]
                }]
            }]
        }]);
        // Assert
        assert.strictEqual(oResult.managerId, null, "The managerId was null");
    });

    QUnit.test("Returns null if no manager id is given", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "1",
            menuEntries: [{
                id: "2",
                menuEntries: [{
                    id: "test-node",
                    menuEntries: [{
                        id: "4"
                    }]
                }]
            }]
        }]);
        // Assert
        assert.strictEqual(oResult.managerId, null, "The managerId was null");
    });

    QUnit.test("Returns isRootNode:false if no nodes are given", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", []);
        // Assert
        assert.notOk(oResult.isRootNode, "The result was false");
    });

    QUnit.test("Returns isRootNode:false the given nodeId is not a root node", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "0",
            menuEntries: [{
                id: "test-node"
            }]
        }, {
            id: "1"
        }, {
            id: "2"
        }]);
        // Assert
        assert.notOk(oResult.isRootNode, "The result was false");
    });

    QUnit.test("Returns isRootNode:true if the given nodeId is a root node", function (assert) {
        // Act
        var bResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "0",
            menuEntries: [{
                id: "0-1"
            }]
        }, {
            id: "test-node"
        }, {
            id: "2"
        }]);
        // Assert
        assert.ok(bResult.isRootNode, "The result was true.");
    });

    QUnit.test("Returns node:null if no nodes are given", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", []);
        // Assert
        assert.strictEqual(null, oResult.node, "The result was null.");
    });

    QUnit.test("Returns null if no node with the given id exists", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "0",
            menuEntries: [{
                id: "0-1"
            }]
        }, {
            id: "1",
            menuEntries: [{
                id: "1-1",
                menuEntries: [{
                    id: "1-2",
                    menuEntries: [{
                        id: "1-3"
                    }]
                }]
            }]
        }, {
            id: "2",
            menuEntries: [{
                id: "2-1"
            }]
        }]);
        // Assert
        assert.strictEqual(oResult.node, null, "The node was found");
    });

    QUnit.test("Finds the node with the given id", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "0",
            menuEntries: [{
                id: "0-1"
            }]
        }, {
            id: "1",
            menuEntries: [{
                id: "1-1",
                menuEntries: [{
                    id: "1-2",
                    menuEntries: [{
                        id: "test-node"
                    }]
                }]
            }]
        }, {
            id: "2",
            menuEntries: [{
                id: "2-1"
            }]
        }]);
        // Assert
        assert.deepEqual(oResult.node, { id: "test-node" }, "The node was found");
    });

    QUnit.module("The function _nodeManagementPermitted", {
        beforeEach: function () {
            this.oMenuService = new Menu({});
            this.oGetNodeInfoStub = sandbox.stub(this.oMenuService, "_getNodeInfo");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns false if node is not found", function (assert) {
        // Arrange
        this.oGetNodeInfoStub.returns({
            node: null,
            managerId: "test",
            isRootNode: true
        });
        // Act
        var bResult = this.oMenuService._nodeManagementPermitted("test-node-id", [], "test-manager-id");
        // Assert
        assert.notOk(bResult, "The result was false.");
    });

    QUnit.test("Returns false if the found managerId is different from the given managerId", function (assert) {
        // Arrange
        this.oGetNodeInfoStub.returns({
            node: { test: "node" },
            managerId: "test-manager-id-2",
            isRootNode: true
        });
        // Act
        var bResult = this.oMenuService._nodeManagementPermitted("test-node-id", [], "test-manager-id");
        // Assert
        assert.notOk(bResult, "The result was fasle.");
    });

    QUnit.test("Returns true if no managerId is found", function (assert) {
        // Arrange
        this.oGetNodeInfoStub.returns({
            node: { test: "node" },
            managerId: null,
            isRootNode: true
        });
        // Act
        var bResult = this.oMenuService._nodeManagementPermitted("test-node-id", [], "test-manager-id");
        // Assert
        assert.ok(bResult, "The result was true.");
    });

    QUnit.test("Returns true if the found managerId is the same as the given managerId", function (assert) {
        // Arrange
        this.oGetNodeInfoStub.returns({
            node: { test: "node" },
            managerId: "test-manager-id",
            isRootNode: true
        });
        // Act
        var bResult = this.oMenuService._nodeManagementPermitted("test-node-id", [], "test-manager-id");
        // Assert
        assert.ok(bResult, "The result was true.");
    });

    QUnit.module("The function getEntryProvider", {
        beforeEach: function () {
            this.oMenuService = new Menu({});
            this.oModel = new JSONModel();
            this.oMenuService.oModel = this.oModel;
            this.oGetMenuEntriesStub = sandbox.stub(this.oMenuService, "getMenuEntries");
            this.oGenerateUniqueIdStub = sandbox.stub(ushellUtils, "generateUniqueId");
            this.oGenerateUniqueIdStub.returns("42");

            this.aNodes = [{
                id: "node-1",
                title: "Node 1",
                description: "Node 1 Description",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "pageId", value: "page1" },
                        { name: "nodeId", value: "node-1" }
                    ]
                },
                menuEntries: [{
                    id: "node-1-1",
                    title: "Node 1 1",
                    description: "Node 1 1 Description",
                    icon: "sap-icon://stethoscope",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            { name: "pageId", value: "page1" },
                            { name: "nodeId", value: "node-1-1" }
                        ]
                    }
                }]
            }, {
                id: "node-2",
                title: "Node 2",
                description: "Node 2 Description",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "pageId", value: "page1" },
                        { name: "nodeId", value: "node-2" }
                    ]
                }
            }, {
                id: "node-3",
                title: "Node 3",
                description: "Node 3 Description",
                icon: "sap-icon://stethoscope",
                managerId: "existing-test-manager-id",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "pageId", value: "page1" },
                        { name: "nodeId", value: "node-3" }
                    ]
                },
                menuEntries: [{
                    id: "node-3-1",
                    title: "Node 3 1",
                    description: "Node 3 1 Description",
                    icon: "sap-icon://stethoscope",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            { name: "pageId", value: "page1" },
                            { name: "nodeId", value: "node-3-1" }
                        ]
                    }
                }]
            }];

            this.oGetMenuEntriesStub.returns(Promise.resolve(this.aNodes));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns empty object for an empty array of nodes", function (assert) {
        // Act
        return this.oMenuService.getEntryProvider("test-manager-id", []).then(function (result) {
            // Assert
            assert.deepEqual(result, {}, "The result was empty object.");
        });
    });

    QUnit.test("Returns empty object if no nodes exist", function (assert) {
        // Arrange
        this.oGetMenuEntriesStub.returns(Promise.resolve([]));
        // Act
        return this.oMenuService.getEntryProvider("test-manager-id", []).then(function (result) {
            // Assert
            assert.deepEqual(result, {}, "The result was empty object.");
        });
    });

    QUnit.test("Does not allow to be called twice by the same plugin", function (assert) {
        // Arrange
        this.oMenuService.getEntryProvider("test-manager-id", []);
        // Act
        return this.oMenuService.getEntryProvider("test-manager-id", []).then(function () {
            // Assert
            assert.notOk(true, "The function could be called twice by the same plugin");
        }).catch(function (e) {
            assert.ok(true, "The promise was rejected.");
        });
    });

    QUnit.test("Returns an object with the update function mapped to the node ID for existing non-root node IDs", function (assert) {
        // Act
        return this.oMenuService.getEntryProvider("test-manager-id", [
            "node-1",
            "my-random-test-node",
            "node-1-1",
            "node-3-1"
        ]).then(function (oMenuEntryProvider) {
            // Assert
            assert.strictEqual(oMenuEntryProvider.hasOwnProperty("my-random-test-node"), false, "The result did not have the inexistent nodeId as property.");
            assert.strictEqual(oMenuEntryProvider.hasOwnProperty("node-3-1"), false, "The result did not have the managed nodeId as property.");
            assert.strictEqual(oMenuEntryProvider.hasOwnProperty("node-1-1"), true, "The result had the expected nodeId as property.");
            assert.strictEqual(typeof oMenuEntryProvider["node-1-1"], "object", "The result node is an object.");

            oMenuEntryProvider["node-1-1"].setData({
                title: "MY Space",
                description: "Description of my space",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "pageId", value: "page4" },
                        { name: "spaceId", value: "space05" }
                    ]
                },
                menuEntries: [{
                    title: "MY Page",
                    description: "Description of my page",
                    icon: "sap-icon://stethoscope",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            { name: "pageId", value: "page4" },
                            { name: "spaceId", value: "space05" }
                        ]
                    }
                }]
            });

            assert.deepEqual(this.oModel.getData(), [{
                id: "node-1",
                title: "Node 1",
                description: "Node 1 Description",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "pageId", value: "page1" },
                        { name: "nodeId", value: "node-1" }
                    ]
                },
                menuEntries: [{
                    title: "MY Space",
                    description: "Description of my space",
                    icon: "sap-icon://stethoscope",
                    type: "IBN",
                    uid: "42",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            { name: "pageId", value: "page4" },
                            { name: "spaceId", value: "space05" }
                        ]
                    },
                    menuEntries: [{
                        title: "MY Page",
                        description: "Description of my page",
                        icon: "sap-icon://stethoscope",
                        type: "IBN",
                        uid: "42",
                        target: {
                            semanticObject: "Launchpad",
                            action: "openFLPPage",
                            parameters: [
                                { name: "pageId", value: "page4" },
                                { name: "spaceId", value: "space05" }
                            ]
                        }
                    }]
                }]
            }, {
                id: "node-2",
                title: "Node 2",
                description: "Node 2 Description",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "pageId", value: "page1" },
                        { name: "nodeId", value: "node-2" }
                    ]
                }
            }, {
                id: "node-3",
                title: "Node 3",
                description: "Node 3 Description",
                icon: "sap-icon://stethoscope",
                managerId: "existing-test-manager-id",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "pageId", value: "page1" },
                        { name: "nodeId", value: "node-3" }
                    ]
                },
                menuEntries: [{
                    id: "node-3-1",
                    title: "Node 3 1",
                    description: "Node 3 1 Description",
                    icon: "sap-icon://stethoscope",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            { name: "pageId", value: "page1" },
                            { name: "nodeId", value: "node-3-1" }
                        ]
                    }
                }]
            }], "The node tree was changed as expected.");
        }.bind(this));
    });

    QUnit.module("The function getMyHomeSpace", {
        beforeEach: function () {
            this.oConfigStub = sandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(true);
            this.oConfigStub.withArgs("/core/spaces/myHome/myHomeSpaceId").returns("MY_HOME_SPACE");

            var aContentNodes = [{
                id: "ZTEST_SPACE",
                label: "Test space",
                type: ContentNodeType.Space,
                isContainer: false,
                children: [{
                    id: "ZTEST_PAGE",
                    label: "Test page",
                    type: ContentNodeType.Page,
                    isContainer: true,
                    children: []
                }]
            }, {
                id: "MY_HOME_SPACE",
                label: "MyHome",
                type: ContentNodeType.Space,
                isContainer: false,
                children: [{
                    id: "MY_HOME_PAGE",
                    label: "MyHome",
                    type: ContentNodeType.Page,
                    isContainer: true,
                    children: []
                }]
            }];

            this.oMenuService = new Menu({});
            this.oGetContentNodesStub = sandbox.stub(this.oMenuService, "getContentNodes").resolves(aContentNodes);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Filters ContentNodes by Space and Page", function (assert) {
        // Arrange
        var aExpectedArgs = [[ContentNodeType.Space, ContentNodeType.Page]];
        // Act
        return this.oMenuService.getMyHomeSpace().then(function (oSpace) {
            // Assert
            assert.deepEqual(this.oGetContentNodesStub.getCall(0).args, aExpectedArgs, "Called getContentNodes with correct arguments.");
        }.bind(this));
    });

    QUnit.test("Returns null if myHome is disabled", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(false);
        // Act
        return this.oMenuService.getMyHomeSpace().then(function (oSpace) {
            // Assert
            assert.strictEqual(oSpace, null, "null should be returned");
            assert.strictEqual(this.oGetContentNodesStub.callCount, 0, "getContentNodes was not called");
        }.bind(this));
    });

    QUnit.test("Returns the MyHome space if myHome is enabled and mySpaceId is correct", function (assert) {
        // Arrange
        var oExpectedSpace = {
            id: "MY_HOME_SPACE",
            label: "MyHome",
            type: ContentNodeType.Space,
            isContainer: false,
            children: [{
                id: "MY_HOME_PAGE",
                label: "MyHome",
                type: ContentNodeType.Page,
                isContainer: true,
                children: []
            }]
        };
        // Act
        return this.oMenuService.getMyHomeSpace().then(function (oSpace) {
            // Assert
            assert.deepEqual(oSpace, oExpectedSpace, "My home space should be returned");
            assert.strictEqual(this.oGetContentNodesStub.callCount, 1, "getContentNodes was not called");
        }.bind(this));
    });

    QUnit.test("Returns null if myHome is enabled and mySpaceId is not found", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/myHome/myHomeSpaceId").returns("NOT_MY_HOME_SPACE");
        // Act
        return this.oMenuService.getMyHomeSpace().then(function (oSpace) {
            // Assert
            assert.strictEqual(oSpace, null, "null should be returned");
            assert.strictEqual(this.oGetContentNodesStub.callCount, 1, "getContentNodes was called");
        }.bind(this));
    });

    QUnit.module("The function isSpacePageAssigned", {
        beforeEach: function () {
            var aContentNodes = [{
                id: "Z_SPACE_1",
                label: "Test space",
                type: ContentNodeType.Space,
                isContainer: false,
                children: [{
                    id: "Z_PAGE_1",
                    label: "Test page",
                    type: ContentNodeType.Page,
                    isContainer: true,
                    children: []
                }]
            }, {
                id: "Z_EMPTY_SPACE",
                label: "Empty Space",
                type: ContentNodeType.Space,
                isContainer: false,
                children: []
            }];

            this.oMenuService = new Menu({});
            this.oGetContentNodesStub = sandbox.stub(this.oMenuService, "getContentNodes").resolves(aContentNodes);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Filters ContentNodes by Space and Page", function (assert) {
        // Arrange
        var aExpectedArgs = [[ContentNodeType.Space, ContentNodeType.Page]];
        // Act
        return this.oMenuService.isSpacePageAssigned("Z_SPACE_1", "Z_PAGE_1")
            .then(function (bResult) {
                // Assert
                assert.deepEqual(this.oGetContentNodesStub.getCall(0).args, aExpectedArgs, "Called getContentNodes with correct arguments.");
            }.bind(this));
    });

    QUnit.test("Resolves \"true\" if the space and page are assigned", function (assert) {
        // Arrange
        // Act
        return this.oMenuService.isSpacePageAssigned("Z_SPACE_1", "Z_PAGE_1")
            .then(function (bResult) {
                // Assert
                assert.strictEqual(bResult, true, "Resolved with the correct result");
            });
    });

    QUnit.test("Resolves \"false\" if the space is assigned and has no pages", function (assert) {
        // Arrange
        // Act
        return this.oMenuService.isSpacePageAssigned("Z_EMPTY_SPACE", "Z_PAGE_1")
            .then(function (bResult) {
                // Assert
                assert.strictEqual(bResult, false, "Resolved with the correct result");
            });
    });

    QUnit.test("Resolves \"false\" if the space is assigned and page is not assigned", function (assert) {
        // Arrange
        // Act
        return this.oMenuService.isSpacePageAssigned("Z_SPACE_1", "Z_PAGE_2")
            .then(function (bResult) {
                // Assert
                assert.strictEqual(bResult, false, "Resolved with the correct result");
            });
    });

    QUnit.test("Resolves \"false\" if the space is not assigned and page is assigned to another space", function (assert) {
        // Arrange
        // Act
        return this.oMenuService.isSpacePageAssigned("Z_UNASSIGNED_SPACE", "Z_PAGE_1")
            .then(function (bResult) {
                // Assert
                assert.strictEqual(bResult, false, "Resolved with the correct result");
            });
    });

    QUnit.module("The function getContentNodes", {
        beforeEach: function () {
            this.aMockContentNodes = [{
                id: "ContentNode1",
                label: "Space 1",
                type: ContentNodeType.Space,
                isContainer: false,
                children: [{
                    id: "ContentNode2",
                    label: "Page 1",
                    type: ContentNodeType.Page,
                    isContainer: true,
                    children: []
                }]
            }, {
                id: "ContentNode3",
                label: "Group 1",
                type: "HomepageGroup",
                isContainer: true,
                children: []
            }, {
                id: "ContentNode4",
                label: "Grouping 1",
                type: "UnsupportedGrouping",
                isContainer: false,
                children: [{
                    id: "ContentNode5",
                    label: "Node 1",
                    type: "UnsupportedNode",
                    isContainer: true,
                    children: []
                }, {
                    id: "ContentNode6",
                    label: "Group 2",
                    type: "HomepageGroup",
                    isContainer: true,
                    children: []
                }]
            }];
            this.oGetContentNodesStub = sandbox.stub().resolves(this.aMockContentNodes);
            this.oMenuService = new Menu({
                getContentNodes: this.oGetContentNodesStub
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves the result of the adapter implementation", function (assert) {
        // Arrange
        var aExpectedContentNodes = [{
            id: "ContentNode1",
            label: "Space 1",
            type: ContentNodeType.Space,
            isContainer: false,
            children: [{
                id: "ContentNode2",
                label: "Page 1",
                type: ContentNodeType.Page,
                isContainer: true,
                children: []
            }]
        }, {
            id: "ContentNode3",
            label: "Group 1",
            type: "HomepageGroup",
            isContainer: true,
            children: []
        }];
        // Act
        return this.oMenuService.getContentNodes().then(function (aContentNodes) {
            // Assert
            assert.deepEqual(aContentNodes, aExpectedContentNodes, "Resolved the correct nodes");
        });
    });

    QUnit.test("Filters ContentNodes", function (assert) {
        // Arrange
        var aExpectedContentNodes = [{
            id: "ContentNode1",
            label: "Space 1",
            type: ContentNodeType.Space,
            isContainer: false,
            children: [{
                id: "ContentNode2",
                label: "Page 1",
                type: ContentNodeType.Page,
                isContainer: true,
                children: []
            }]
        }];
        // Act
        return this.oMenuService.getContentNodes([ContentNodeType.Space, ContentNodeType.Page]).then(function (aContentNodes) {
            // Assert
            assert.deepEqual(aContentNodes, aExpectedContentNodes, "Resolved the correct nodes");
        });
    });

    QUnit.test("Keeps parent nodes with unrequested types, when they have children of the requested type (bKeepUnrequestedParents=true)", function (assert) {
        // Arrange
        var aExpectedContentNodes = [{
            id: "ContentNode3",
            label: "Group 1",
            type: "HomepageGroup",
            isContainer: true,
            children: []
        }, {
            id: "ContentNode4",
            label: "Grouping 1",
            type: "UnsupportedGrouping",
            isContainer: false,
            children: [{
                id: "ContentNode6",
                label: "Group 2",
                type: "HomepageGroup",
                isContainer: true,
                children: []
            }]
        }];
        // Act
        return this.oMenuService.getContentNodes(["HomepageGroup"], true).then(function (aContentNodes) {
            // Assert
            assert.deepEqual(aContentNodes, aExpectedContentNodes, "Resolved the correct nodes");
        });
    });

    QUnit.test("Filters a node, that itself is not of a requested type and that has no requested child either.", function (assert) {
        // Arrange
        this.oGetContentNodesStub.resolves([{
            id: "ContentNode1",
            label: "Grouping 1",
            type: "UnsupportedGrouping",
            isContainer: false,
            children: [{
                id: "ContentNode2",
                label: "Grouping 2",
                type: "UnsupportedGrouping",
                isContainer: false,
                children: []
            }]
        }]);
        var aExpectedContentNodes = [];
        // Act
        return this.oMenuService.getContentNodes(["HomepageGroup"], true).then(function (aContentNodes) {
            // Assert
            assert.deepEqual(aContentNodes, aExpectedContentNodes, "Resolved the correct nodes");
        });
    });

    QUnit.test("Handles missing \"children\" property properly", function (assert) {
        // Arrange
        this.oGetContentNodesStub.resolves([{
            id: "ContentNode1",
            label: "Grouping 1",
            type: "UnsupportedGrouping",
            isContainer: false,
            children: [{
                id: "ContentNode2",
                label: "Grouping 2 w/o children",
                type: "UnsupportedGrouping",
                isContainer: false
            }]
        }]);
        var aExpectedContentNodes = [];
        // Act
        return this.oMenuService.getContentNodes(["HomepageGroup"], true).then(function (aContentNodes) {
            // Assert
            assert.deepEqual(aContentNodes, aExpectedContentNodes, "Resolved the correct nodes");
        });
    });

    QUnit.module("The function isWorkPage", {
        beforeEach: function () {
            this.oMenuService = new Menu();

            this.oIsWorkPageStub = sandbox.stub();
            this.oMenuService.oAdapter = {
                isWorkPage: this.oIsWorkPageStub
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("resolves to false if the adapter does not support this function", function (assert) {
        // Arrange
        this.oMenuService.oAdapter = {};
        return this.oMenuService.isWorkPage("test-page-id").then(function (bResult) {
            assert.strictEqual(bResult, false, "The result was false.");
            assert.ok(this.oIsWorkPageStub.notCalled, "isWorkPage was not called");
        }.bind(this));
    });

    QUnit.test("resolves to false if the adapter function resolves to false", function (assert) {
        // Arrange
        this.oIsWorkPageStub.resolves(false);

        // Act
        return this.oMenuService.isWorkPage("test-page-id").then(function (bResult) {

            // Assert
            assert.ok(this.oIsWorkPageStub.calledOnce, "isWorkPage was called.");
            assert.strictEqual(this.oIsWorkPageStub.firstCall.args[0], "test-page-id", "isWorkPage was called with the expected arguments.");
            assert.strictEqual(bResult, false, "The result was false.");
        }.bind(this));
    });

    QUnit.test("resolves to true if the adapter function resolves to true", function (assert) {
        // Arrange
        this.oIsWorkPageStub.resolves(true);

        // Act
        return this.oMenuService.isWorkPage("test-page-id").then(function (bResult) {

            // Assert
            assert.ok(this.oIsWorkPageStub.calledOnce, "isWorkPage was called.");
            assert.strictEqual(this.oIsWorkPageStub.firstCall.args[0], "test-page-id", "isWorkPage was called with the expected arguments.");
            assert.strictEqual(bResult, true, "The result was true.");
        }.bind(this));
    });
});
