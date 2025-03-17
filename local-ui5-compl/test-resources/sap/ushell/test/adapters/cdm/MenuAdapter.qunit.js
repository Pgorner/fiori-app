// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapter.cdm.MenuAdapter
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ushell/adapters/cdm/MenuAdapter",
    "sap/ushell/Config",
    "sap/ushell/library",
    "sap/ushell/Container"
], function (
    ObjectPath,
    MenuAdapter,
    Config,
    ushellLibrary,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    // shortcut for sap.ushell.ContentNodeType
    var ContentNodeType = ushellLibrary.ContentNodeType;

    var sandbox = sinon.sandbox.create();

    QUnit.module("The function isMenuEnabled", {
        before: function () {
            return Container.init("local");
        },
        beforeEach: function () {
            this.oConfigStub = sandbox.stub(Config, "last");
            this.oGetMenuEntriesStub = sinon.stub();
            this.oGetServiceAsyncStub = sinon.stub();

            this.aMenuEntriesMock = [
                {
                    id: "mockId",
                    title: "mockTitle",
                    description: "mockDescription",
                    icon: "sap-icon://nurse",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            { name: "pageId", value: "page3" },
                            { name: "spaceId", value: "space03" }
                        ]
                    }
                }
            ];
            this.oCdmServiceMock = {
                getMenuEntries: this.oGetMenuEntriesStub
            };

            this.oGetMenuEntriesStub.withArgs("main").resolves(this.aMenuEntriesMock);
            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves(this.oCdmServiceMock);
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);
            this.oMenuAdapter = new MenuAdapter();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns true if the menu is enabled and menu entries are available", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/menu/enabled").returns(true);

        // Act
        return this.oMenuAdapter.isMenuEnabled().then(function (bMenuEnabled) {
            // Assert
            assert.strictEqual(bMenuEnabled, true, "The function returns true.");
        });
    });

    QUnit.test("Returns false if the menu is enabled but no menu entries are available", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/menu/enabled").returns(true);
        this.oGetMenuEntriesStub.withArgs("main").resolves([]);

        // Act
        return this.oMenuAdapter.isMenuEnabled().then(function (bMenuEnabled) {
            // Assert
            assert.strictEqual(bMenuEnabled, false, "The function returns false.");
        });
    });

    QUnit.test("Returns false if the menu is disabled and menu entries are available", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/menu/enabled").returns(false);

        // Act
        return this.oMenuAdapter.isMenuEnabled().then(function (bMenuEnabled) {
            // Assert
            assert.strictEqual(bMenuEnabled, false, "The function returns false.");
        });
    });

    QUnit.module("The function getMenuEntries", {
        before: function () {
            return Container.init("local");
        },
        beforeEach: function () {
            this.oGetMenuEntriesStub = sinon.stub();
            this.oGetServiceAsyncStub = sinon.stub();

            this.aMenuEntriesMock = [{
                id: "mockId",
                title: "mockTitle",
                description: "mockDescription",
                icon: "sap-icon://nurse",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "pageId", value: "page3" },
                        { name: "spaceId", value: "space03" }
                    ]
                }
            }];
            this.oCdmServiceMock = {
                getMenuEntries: this.oGetMenuEntriesStub
            };

            this.oGetMenuEntriesStub.withArgs("main").resolves(this.aMenuEntriesMock);
            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves(this.oCdmServiceMock);
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);
            this.oMenuAdapter = new MenuAdapter();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct menu entries", function (assert) {
        // Act
        return this.oMenuAdapter.getMenuEntries().then(function (aMenuEntries) {
            // Assert
            assert.strictEqual(aMenuEntries, this.aMenuEntriesMock, "The function returns the correct array of menu entries");
        }.bind(this));
    });

    QUnit.module("The function getContentNodes", {
        beofore: function () {
            return Container.init("local");
        },
        beforeEach: function () {
            this.oGetServiceAsyncStub = sinon.stub();
            Container.getServiceAsync = this.oGetServiceAsyncStub;

            this.oGetMenuEntriesStub = sinon.stub();
            this.oCdmServiceMock = {
                getMenuEntries: this.oGetMenuEntriesStub
            };
            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves(this.oCdmServiceMock);

            this.oMenuAdapter = new MenuAdapter();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates a content node hierarchy for a space menu entry with multiple page menu entries", function (assert) {
        //Arrange
        this.oGetMenuEntriesStub.withArgs("main").resolves([
            {
                id: "id-0001-00",
                title: "Space 1",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "spaceId", value: "space01" },
                        { name: "pageId", value: "page01" }
                    ]
                },
                menuEntries: [
                    {
                        id: "id-0001-01",
                        title: "Page 1",
                        type: "IBN",
                        target: {
                            semanticObject: "Launchpad",
                            action: "openFLPPage",
                            parameters: [
                                { name: "spaceId", value: "space01" },
                                { name: "pageId", value: "page01" }
                            ]
                        }
                    },
                    {
                        id: "id-0001-02",
                        title: "Page 2",
                        type: "IBN",
                        target: {
                            semanticObject: "Launchpad",
                            action: "openFLPPage",
                            parameters: [
                                { name: "spaceId", value: "space01" },
                                { name: "pageId", value: "page02" }
                            ]
                        }
                    }
                ]
            }
        ]);

        var aExpectedContentNodes = [
            {
                id: "space01",
                label: "Space 1",
                type: ContentNodeType.Space,
                isContainer: false,
                children: [
                    {
                        id: "page01",
                        label: "Page 1",
                        type: ContentNodeType.Page,
                        isContainer: true,
                        children: []
                    },
                    {
                        id: "page02",
                        label: "Page 2",
                        type: ContentNodeType.Page,
                        isContainer: true,
                        children: []
                    }
                ]
            }
        ];

        //Act
        return this.oMenuAdapter.getContentNodes()
            .then(function (aContentNodes) {
                //Assert
                assert.deepEqual(aContentNodes, aExpectedContentNodes, "The content nodes were returned correctly");
            });
    });

    QUnit.test("Creates a content node hierarchy for menu entries with only one page in a space", function (assert) {
        //Arrange
        this.oGetMenuEntriesStub.withArgs("main").resolves([
            {
                id: "id-0001-00",
                title: "Space 1",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "spaceId", value: "space01" },
                        { name: "pageId", value: "page01" }
                    ]
                }
            },
            {
                id: "id-0002-00",
                title: "Space 2",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "spaceId", value: "space02" },
                        { name: "pageId", value: "page02" }
                    ]
                }
            },
            {
                id: "id-0003-00",
                title: "Space 3",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "spaceId", value: "space03" }
                    ]
                }
            }
        ]);

        var oPage1 = {
            identification: {
                id: "page01",
                title: "Page 1"
            }
        };
        var oPage2 = {
            identification: {
                id: "page02",
                title: "Page 2"
            }
        };
        this.oCdmServiceMock.getPage = sinon.stub();
        this.oCdmServiceMock.getPage.withArgs("page01").resolves(oPage1);
        this.oCdmServiceMock.getPage.withArgs("page02").resolves(oPage2);
        this.oCdmServiceMock.getPage.withArgs(undefined).rejects();

        var aExpectedContentNodes = [
            {
                id: "space01",
                label: "Space 1",
                type: ContentNodeType.Space,
                isContainer: false,
                children: [
                    {
                        id: "page01",
                        label: "Page 1",
                        type: ContentNodeType.Page,
                        isContainer: true,
                        children: []
                    }
                ]
            },
            {
                id: "space02",
                label: "Space 2",
                type: ContentNodeType.Space,
                isContainer: false,
                children: [
                    {
                        id: "page02",
                        label: "Page 2",
                        type: ContentNodeType.Page,
                        isContainer: true,
                        children: []
                    }
                ]
            },
            {
                id: "space03",
                label: "Space 3",
                type: ContentNodeType.Space,
                isContainer: false,
                children: []
            }
        ];

        //Act
        return this.oMenuAdapter.getContentNodes()
            .then(function (aContentNodes) {
                //Assert
                assert.deepEqual(aContentNodes, aExpectedContentNodes, "The content node hierarchy was created correctly");
            });
    });

    QUnit.test("Filters out menu entries that are no space or page from the menu's first level", function (assert) {
        // Apps are currently not covered by the ContentNode definition.
        // For the content nodes there is no other option but to filter out those cases.

        //Arrange
        this.oGetMenuEntriesStub.withArgs("main").resolves([
            {
                id: "id-0001-00",
                title: "App Nav Sample",
                type: "IBN",
                target: {
                    semanticObject: "Action",
                    action: "toappnavsample",
                    parameters: [
                        { name: "a", value: "1" },
                        { name: "b", value: "2" }
                    ]
                }
            }
        ]);

        var aExpectedContentNodes = [];

        //Act
        return this.oMenuAdapter.getContentNodes()
            .then(function (aContentNodes) {
                //Assert
                assert.deepEqual(aContentNodes, aExpectedContentNodes, "The menu entry was filtered out");
            });
    });

    QUnit.test("Filters out menu entries that are no space or page from the menu's second level", function (assert) {
        // Apps are currently not covered by the ContentNode definition.
        // For the content nodes there is no other option but to filter out those cases.

        //Arrange
        this.oGetMenuEntriesStub.withArgs("main").resolves([
            {
                id: "id-0001-00",
                title: "Space 1",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "spaceId", value: "space01" },
                        { name: "pageId", value: "page01" }
                    ]
                },
                menuEntries: [
                    {
                        id: "id-0001-01",
                        title: "Page 1",
                        type: "IBN",
                        target: {
                            semanticObject: "Launchpad",
                            action: "openFLPPage",
                            parameters: [
                                { name: "spaceId", value: "space01" },
                                { name: "pageId", value: "page01" }
                            ]
                        }
                    },
                    {
                        id: "id-0001-02",
                        title: "App Nav Sample",
                        type: "IBN",
                        target: {
                            semanticObject: "Action",
                            action: "toappnavsample",
                            parameters: [
                                { name: "a", value: "1" },
                                { name: "b", value: "2" }
                            ]
                        }
                    }
                ]
            }
        ]);

        var aExpectedContentNodes = [
            {
                id: "space01",
                label: "Space 1",
                type: ContentNodeType.Space,
                isContainer: false,
                children: [
                    {
                        id: "page01",
                        label: "Page 1",
                        type: ContentNodeType.Page,
                        isContainer: true,
                        children: []
                    }
                ]
            }
        ];

        //Act
        return this.oMenuAdapter.getContentNodes()
            .then(function (aContentNodes) {
                //Assert
                assert.deepEqual(aContentNodes, aExpectedContentNodes, "The menu entry was filtered out");
            });
    });

    QUnit.test("Filters out menu entries that have no pageId parameter", function (assert) {
        // Apps are currently not covered by the ContentNode definition.
        // For the content nodes there is no other option but to filter out those cases.

        //Arrange
        this.oGetMenuEntriesStub.withArgs("main").resolves([
            {
                id: "id-0001-00",
                title: "Space 1",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        { name: "spaceId", value: "space01" },
                        { name: "pageId", value: "page01" }
                    ]
                },
                menuEntries: [
                    {
                        id: "id-0001-01",
                        title: "Page 1",
                        type: "IBN",
                        target: {
                            semanticObject: "Launchpad",
                            action: "openFLPPage",
                            parameters: [
                                { name: "spaceId", value: "space01" },
                                { name: "pageId", value: "page01" }
                            ]
                        }
                    },
                    {
                        id: "id-0001-03",
                        title: "Page 3",
                        type: "IBN",
                        target: {
                            semanticObject: "Launchpad",
                            action: "openFLPPage",
                            parameters: [
                                { name: "spaceId", value: "space01" }
                            ]
                        }
                    }
                ]
            }
        ]);

        var aExpectedContentNodes = [
            {
                id: "space01",
                label: "Space 1",
                type: ContentNodeType.Space,
                isContainer: false,
                children: [
                    {
                        id: "page01",
                        label: "Page 1",
                        type: ContentNodeType.Page,
                        isContainer: true,
                        children: []
                    }
                ]
            }
        ];

        //Act
        return this.oMenuAdapter.getContentNodes()
            .then(function (aContentNodes) {
                //Assert
                assert.deepEqual(aContentNodes, aExpectedContentNodes, "The menu entry was filtered out");
            });
    });

    QUnit.test("Filters out menu entries that are no space or page from the menu's second level if the top level is not a space", function (assert) {
        // Apps are currently not covered by the ContentNode definition.
        // For the content nodes there is no other option but to filter out those cases.

        //Arrange
        this.oGetMenuEntriesStub.withArgs("main").resolves([
            {
                id: "id-0001-00",
                title: "App Nav Sample",
                type: "IBN",
                target: {
                    semanticObject: "Action",
                    action: "toappnavsample",
                    parameters: [
                        { name: "a", value: "1" },
                        { name: "b", value: "2" }
                    ]
                },
                menuEntries: [
                    {
                        id: "id-0001-01",
                        title: "App Nav Sample",
                        type: "IBN",
                        target: {
                            semanticObject: "Action",
                            action: "toappnavsample",
                            parameters: [
                                { name: "a", value: "1" },
                                { name: "b", value: "2" }
                            ]
                        }
                    },
                    {
                        id: "id-0001-02",
                        title: "Page 1",
                        type: "IBN",
                        target: {
                            semanticObject: "Launchpad",
                            action: "openFLPPage",
                            parameters: [
                                { name: "spaceId", value: "space01" },
                                { name: "pageId", value: "page01" }
                            ]
                        }
                    }
                ]
            }
        ]);

        var aExpectedContentNodes = [];

        //Act
        return this.oMenuAdapter.getContentNodes()
            .then(function (aContentNodes) {
                //Assert
                assert.deepEqual(aContentNodes, aExpectedContentNodes, "The content nodes were returned correctly");
            });
    });
});
