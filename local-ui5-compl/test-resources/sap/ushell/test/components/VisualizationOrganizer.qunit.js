// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.VisualizationOrganizer.Component
 */
sap.ui.define([
    "sap/ui/core/Element",
    "sap/ushell/ui/appfinder/PinButton",
    "sap/m/library",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/components/visualizationOrganizer/Component",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/resources",
    "sap/ushell/library",
    "sap/ui/qunit/utils/nextUIUpdate"
], function (
    Element,
    PinButton,
    mobileLibrary,
    JSONModel,
    VisualizationOrganizer,
    Config,
    Container,
    resources,
    ushellLibrary,
    nextUIUpdate
) {
    "use strict";

    // shortcut for sap/m.ButtonType
    const ButtonType = mobileLibrary.ButtonType;

    // shortcut for sap.ushell.ContentNodeType
    const ContentNodeType = ushellLibrary.ContentNodeType;

    const sandbox = sinon.createSandbox({});

    /* global QUnit, sinon */

    const aCdmGetAllPagesMock = [{
        identification: {
            id: "page1",
            title: "page1Title"
        },
        payload: {
            sections: {
                page1Section1: {
                    viz: {
                        page1Section1Viz2: {
                            vizId: "vizId2"
                        }
                    }
                }
            }
        }
    }, {
        identification: {
            id: "page2",
            title: "page2Title"
        },
        payload: {
            sections: {
                page2Section1: {
                    viz: {
                        page2Section1Viz1: {
                            vizId: "vizId"
                        },
                        page2Section1Viz2: {
                            vizId: "vizId2"
                        }
                    }
                }
            }
        }
    }];

    const aContentNodeMock = [
        {
            id: "space1",
            label: "space1Title",
            type: "Space",
            isContainer: false,
            children: [{
                id: "page1",
                label: "page1Title",
                type: "Page",
                isContainer: true,
                children: []
            },
            {
                id: "workpage1",
                label: "English Title",
                type: "Page",
                isContainer: false,
                children: []
            }]
        }, {
            id: "space2",
            label: "space2Title",
            type: "Space",
            isContainer: false,
            children: [{
                id: "page2",
                label: "page2Title",
                type: "Page",
                isContainer: true,
                children: []
            }]
        }, {
            id: "space3",
            label: "space3Title",
            type: "Space",
            isContainer: false,
            children: [{
                id: "page1",
                label: "page2Title",
                type: "Page",
                isContainer: true,
                children: []
            }, {
                id: "page2",
                label: "page2Title",
                type: "Page",
                isContainer: true,
                children: []
            }]
        },
        // This space contains an unknown page, this unknown page will not be added to the pageslist
        {
            id: "space4",
            label: "space4Title",
            type: "Space",
            isContainer: false,
            children: [{
                id: "unknownPageId",
                label: "page2Title",
                type: "Page",
                isContainer: true,
                children: []
            }]
        }
    ];

    const oPagesMock = {
        page1: {
            id: "page1",
            title: "page1Title",
            sections: [{
                id: "page1Section1",
                title: "page1Section1Title",
                visualizations: [
                    { vizId: "vizId2" }
                ]
            }]
        },
        page2: {
            id: "page2",
            title: "page2Title",
            sections: [{
                id: "page2Section1",
                title: "page12Section1Title",
                visualizations: [
                    { vizId: "vizId" },
                    { vizId: "vizId2" }
                ]
            }]
        },
        page3: {
            id: "page3",
            title: "emptyPage",
            sections: []
        }
    };

    QUnit.module("init", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("maps and sets are created.", function (assert) {
        // Act
        this.oVisualizationOrganizer = new VisualizationOrganizer();

        // Assert
        assert.notEqual(this.oVisualizationOrganizer.mVizIdInPages, undefined, "Map: mVizIdInPages was created.");
        assert.notEqual(this.oVisualizationOrganizer.stVizIdInSection, undefined, "Set: stVizIdInSection was created.");
    });

    QUnit.module("requestData", {
        beforeEach: function (assert) {

            sandbox.stub(Container, "getServiceAsync").withArgs("CommonDataModel").resolves({
                getAllPages: sandbox.stub().resolves(aCdmGetAllPagesMock)
            });

            this.oConfigStub = sandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("maps and sets are filled correctly.", function (assert) {
        // Arrange
        this.oVisualizationOrganizer = new VisualizationOrganizer();
        const aExpectedPages = [
            { id: "page1", title: "page1Title" },
            { id: "page2", title: "page2Title" }
        ];
        const fnDone = assert.async();

        // Act
        this.oVisualizationOrganizer.requestData().then(() => {
            // Assert
            assert.strictEqual(this.oVisualizationOrganizer.mVizIdInPages.size, 2, "mVizIdInPages has a size of 2.");
            assert.ok(this.oVisualizationOrganizer.mVizIdInPages.has("vizId"), "mVizIdInPages has the key \"vizId\"");
            assert.ok(this.oVisualizationOrganizer.mVizIdInPages.has("vizId2"), "mVizIdInPages has the key \"vizId2\"");
            assert.strictEqual(this.oVisualizationOrganizer.stVizIdInSection.size, 0, "stVizIdInSection has a size of 0.");
            assert.deepEqual(this.oVisualizationOrganizer.aPersonalizablePages, aExpectedPages, "aPersonalizablePages was set correctly");
            fnDone();
        });
    });

    QUnit.test("filter not home page if the personalization is disabled and myHome is enabled", function (assert) {
        // Arrange
        const fnDone = assert.async();
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(true);
        this.oConfigStub.withArgs("/core/spaces/myHome/myHomePageId").returns("page1");
        const aExpectedPages = [{
            id: "page1",
            title: "page1Title"
        }];
        this.oVisualizationOrganizer = new VisualizationOrganizer();

        // Act
        this.oVisualizationOrganizer.requestData().then(() => {
            // Assert
            assert.strictEqual(this.oVisualizationOrganizer.mVizIdInPages.size, 1, "mVizIdInPages has a size of 1.");
            assert.ok(this.oVisualizationOrganizer.mVizIdInPages.has("vizId2"), "mVizIdInPages has the key \"vizId\"");
            assert.strictEqual(this.oVisualizationOrganizer.stVizIdInSection.size, 0, "stVizIdInSection has a size of 0.");
            assert.deepEqual(this.oVisualizationOrganizer.aPersonalizablePages, aExpectedPages, "aPersonalizablePages was set correctly");
            fnDone();
        });
    });

    QUnit.module("onTilePinButtonClick", {
        beforeEach: function (assert) {
            sandbox.stub(Container, "getServiceAsync").withArgs("CommonDataModel").resolves({
                getAllPages: sandbox.stub().resolves(aCdmGetAllPagesMock)
            });

            this.oTileData = {
                id: "vizId",
                title: "vizTitle"
            };
            this.oSetBusyStub = sandbox.stub();
            this.oGetBusyStub = sandbox.stub().returns(false);
            this.oSource = {
                getBindingContext: sandbox.stub().returns({
                    getProperty: sandbox.stub().returns(this.oTileData)
                }),
                setBusy: this.oSetBusyStub,
                getBusy: this.oGetBusyStub
            };
            this.oEvent = {
                getSource: sandbox.stub().returns(this.oSource)
            };

            const fnDone = assert.async();
            this.oVisualizationOrganizer = new VisualizationOrganizer();
            this.oVisualizationOrganizer.requestData().then(() => {
                fnDone();
            });

            this.oApplyOrganizationChangeToSectionStub = sandbox.stub(this.oVisualizationOrganizer, "_applyOrganizationChangeToSection").resolves();
            this.oApplyChangeToPageStub = sandbox.stub(this.oVisualizationOrganizer, "_applyChangeToPage").resolves();
            this.oToggleStub = sandbox.stub(this.oVisualizationOrganizer, "toggle").resolves();
        },
        afterEach: function () {
            sandbox.restore();
            this.oVisualizationOrganizer.exit();
        }
    });

    QUnit.test("skips event handling if pinButton is busy.", function (assert) {
        // Arrange
        this.oGetBusyStub.returns(true);
        // Act
        return this.oVisualizationOrganizer.onTilePinButtonClick(this.oEvent).then(() => {
            // Assert
            assert.strictEqual(this.oApplyOrganizationChangeToSectionStub.callCount, 0, "_applyOrganizationChangeToSection was not called.");
            assert.strictEqual(this.oToggleStub.callCount, 0, "toggle was not called.");
            assert.strictEqual(this.oSetBusyStub.callCount, 0, "setBusy was not called");
        });
    });

    QUnit.test("toggles the popover, if no section context is given.", function (assert) {
        // Act
        return this.oVisualizationOrganizer.onTilePinButtonClick(this.oEvent).then(() => {
            // Assert
            assert.strictEqual(this.oApplyOrganizationChangeToSectionStub.callCount, 0, "_applyOrganizationChangeToSection was not called.");
            assert.strictEqual(this.oToggleStub.callCount, 1, "toggle was called once.");
            assert.deepEqual(this.oToggleStub.args[0][0], this.oSource, "toggle has the correct 1. Parameter.");
            assert.deepEqual(this.oToggleStub.args[0][1], this.oTileData, "toggle has the correct 2. Parameter.");

            assert.strictEqual(this.oSetBusyStub.callCount, 0, "setBusy was not called");
        });
    });

    QUnit.test("applies the organizer change, without opening the popover, if a section context is given.", function (assert) {
        // Arrange
        const oSectionContext = { id: "sectionId" };

        // Act
        return this.oVisualizationOrganizer.onTilePinButtonClick(this.oEvent, oSectionContext).then(() => {
            // Assert
            assert.strictEqual(this.oApplyOrganizationChangeToSectionStub.callCount, 1, "_applyOrganizationChangeToSection was not called.");
            assert.deepEqual(this.oApplyOrganizationChangeToSectionStub.args[0][0], this.oSource, "_applyOrganizationChangeToSection has the correct 1. Parameter.");
            assert.deepEqual(this.oApplyOrganizationChangeToSectionStub.args[0][1], this.oTileData, "_applyOrganizationChangeToSection has the correct 2. Parameter.");
            assert.deepEqual(this.oApplyOrganizationChangeToSectionStub.args[0][2], oSectionContext, "_applyOrganizationChangeToSection has the correct 3. Parameter.");
            assert.strictEqual(this.oToggleStub.callCount, 0, "toggle was called once.");

            assert.strictEqual(this.oSetBusyStub.firstCall.args[0], true, "busyState was set to true");
            assert.strictEqual(this.oSetBusyStub.secondCall.args[0], false, "busyState was set to false");
        });
    });

    QUnit.test("applies the organizer change, without opening the popover, if only 1 page is personalizable.", function (assert) {
        // Arrange
        const oPersonalizablePage = {
            id: "page",
            title: "pageTitle"
        };
        this.oVisualizationOrganizer.aPersonalizablePages = [oPersonalizablePage];

        // Act
        return this.oVisualizationOrganizer.onTilePinButtonClick(this.oEvent).then(() => {
            // Assert
            assert.strictEqual(this.oApplyChangeToPageStub.callCount, 1, "_applyChangeToPageStub was not called.");
            assert.deepEqual(this.oApplyChangeToPageStub.args[0][0], this.oSource, "_applyChangeToPageStub has the correct 1. Parameter.");
            assert.deepEqual(this.oApplyChangeToPageStub.args[0][1], this.oTileData, "_applyChangeToPageStub has the correct 2. Parameter.");
            assert.deepEqual(this.oApplyChangeToPageStub.args[0][2], oPersonalizablePage, "_applyChangeToPageStub has the correct 3. Parameter.");
            assert.strictEqual(this.oToggleStub.callCount, 0, "toggle was called once.");

            assert.strictEqual(this.oSetBusyStub.firstCall.args[0], true, "busyState was set to true");
            assert.strictEqual(this.oSetBusyStub.secondCall.args[0], false, "busyState was set to false");
        });
    });

    QUnit.module("toggle, open, close", {
        beforeEach: async function (assert) {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves({
                getAllPages: sandbox.stub().resolves(aCdmGetAllPagesMock)
            });

            this.oGetServiceAsyncStub.withArgs("Menu").resolves({
                getContentNodes: sandbox.stub().withArgs([ContentNodeType.Space, ContentNodeType.Page]).resolves(aContentNodeMock)
            });

            const oModel = new JSONModel({
                icon: "sap-icon://add",
                type: ButtonType.Emphasized,
                tooltip: "pin me"
            });
            this.oPinButton = new PinButton({
                icon: "{/icon}",
                type: "{/type}",
                tooltip: "{/tooltip}"
            }).setModel(oModel);
            this.oPinButton.placeAt("qunit-fixture");
            await nextUIUpdate();

            this.oVizInfo = {
                id: "vizId",
                title: "vizTitle"
            };

            const fnDone = assert.async();
            this.oVisualizationOrganizer = new VisualizationOrganizer();
            this.oVisualizationOrganizer.requestData().then(() => {
                this.oVisualizationOrganizer.open(this.oPinButton, this.oVizInfo).then(() => {
                    this.oList = Element.getElementById("sapUshellVisualizationOrganizerSpacesList");
                    this.aItems = this.oList.getItems();
                    this.oPopover = Element.getElementById("sapUshellVisualizationOrganizerPopover");
                    fnDone();
                });
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oPinButton.destroy();
            this.oVisualizationOrganizer.exit();
        }
    });

    QUnit.test("toggle once, opens the popover.", function (assert) {
        // Arrange
        const fnDone = assert.async();

        // Act
        this.oVisualizationOrganizer.toggle(this.oPinButton, this.oVizInfo).then(() => {
            // Assert
            const oPopover = Element.getElementById("sapUshellVisualizationOrganizerPopover");
            assert.strictEqual(oPopover.isOpen(), true, "the popover is open.");

            const aPages = oPopover.getModel().getProperty("/pages");

            if (aPages.some(function (oPage) { return oPage.id === "workpage1"; })) {
                assert.ok(false, "The list of pages must not contain workpages.");
            }

            assert.strictEqual(aPages.length, 4, "the model contains 4 pages.");
            assert.ok(oPopover.getContent()[0].isA("sap.m.List"), "the list of pages is at the correct position of the popover.");
            fnDone();
        });
    });

    QUnit.test("preserves the filter state.", function (assert) {
        // Arrange
        const fnDone = assert.async();
        this.oVisualizationOrganizer.setPressed(true);

        // Act
        this.oVisualizationOrganizer.toggle(this.oPinButton, this.oVizInfo).then(() => {
            // Assert
            assert.strictEqual(this.oPopover.isOpen(), true, "the popover is open.");
            assert.strictEqual(this.oPopover.getContent()[0].getSelectedItems().length, 2, "There are two selected items.");
            fnDone();
        });
    });

    QUnit.test("toggle twice, closes the popover.", function (assert) {
        // Arrange
        const fnDone = assert.async();
        this.oVisualizationOrganizer.toggle(this.oPinButton, this.oVizInfo).then(() => {
            const oPopover = Element.getElementById("sapUshellVisualizationOrganizerPopover");

            // Act
            this.oVisualizationOrganizer.toggle(this.oPinButton, this.oVizInfo);

            // Assert
            oPopover.attachAfterClose(() => {
                assert.ok(true, "the popover is closed.");
                fnDone();
            });
        });
    });

    QUnit.test("open, opens the popover.", function (assert) {
        // Arrange
        const fnDone = assert.async();

        // Act
        this.oVisualizationOrganizer.open(this.oPinButton, this.oVizInfo).then(() => {
            // Assert
            const oPopover = Element.getElementById("sapUshellVisualizationOrganizerPopover");
            assert.strictEqual(oPopover.isOpen(), true, "the popover is open.");
            assert.strictEqual(oPopover.getModel().getProperty("/pages").length, 4, "the model contains 4 pages.");
            assert.ok(oPopover.getContent()[0].isA("sap.m.List"), "the list of pages is at the correct position of the popover.");
            fnDone();
        });
    });

    QUnit.test("close, closes the popover.", function (assert) {
        // Arrange
        const fnDone = assert.async();
        this.oVisualizationOrganizer.open(this.oPinButton, this.oVizInfo).then(() => {
            const oPopover = Element.getElementById("sapUshellVisualizationOrganizerPopover");

            // Act
            this.oVisualizationOrganizer.cancel(this.oPinButton, this.oVizInfo);

            // Assert
            oPopover.attachAfterClose(() => {
                assert.ok(true, "the popover is closed.");
                fnDone();
            });
        });
    });

    QUnit.module("loadSectionContext", {
        beforeEach: function (assert) {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves({
                getAllPages: sandbox.stub().resolves(aCdmGetAllPagesMock)
            });

            const oPagesModel = new JSONModel(oPagesMock);
            this.oGetServiceAsyncStub.withArgs("Pages").resolves({
                loadPage: sandbox.stub().callsFake(function (sPageId) {
                    return Promise.resolve("/" + sPageId);
                }),
                getModel: sandbox.stub().returns(oPagesModel)
            });

            const fnDone = assert.async();
            this.oVisualizationOrganizer = new VisualizationOrganizer();
            this.oVisualizationOrganizer.requestData().then(() => {
                fnDone();
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oVisualizationOrganizer.exit();
        }
    });

    QUnit.test("with a known section context", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const oContext = {
            pageID: "page1",
            sectionID: "page1Section1"
        };
        const oExpectedSectionContext = {
            pageID: "page1",
            pageTitle: "page1Title",
            sectionID: "page1Section1",
            sectionTitle: "page1Section1Title"
        };

        // Act
        this.oVisualizationOrganizer.loadSectionContext(oContext).then((oSectionContext) => {
            // Assert
            assert.deepEqual(oSectionContext, oExpectedSectionContext, "The returned section context was correct.");
            fnDone();
        });
    });

    QUnit.test("with an unknown section context", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const oContext = {
            pageID: "page1",
            sectionID: "page1Section2"
        };

        // Act
        this.oVisualizationOrganizer.loadSectionContext(oContext).then((oSectionContext) => {
            // Assert
            assert.deepEqual(oSectionContext, null, "The returned section context was correct.");
            fnDone();
        });
    });

    QUnit.test("without section (empty page)", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const oContext = {
            pageID: "page3"
        };

        const oExpectedSectionContext = {
            pageID: "page3",
            pageTitle: "emptyPage",
            sectionID: ""
        };

        // Act
        this.oVisualizationOrganizer.loadSectionContext(oContext).then((oSectionContext) => {
            // Assert
            assert.deepEqual(oSectionContext, oExpectedSectionContext, "The returned section context was correct.");
            fnDone();
        });
    });

    QUnit.test("with an unknown page context", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const oContext = {
            pageID: "page3",
            sectionID: "page1Section1"
        };

        // Act
        this.oVisualizationOrganizer.loadSectionContext(oContext).then((oSectionContext) => {
            // Assert
            assert.deepEqual(oSectionContext, null, "The returned section context was correct.");
            fnDone();
        });
    });

    QUnit.test("with no section context", function (assert) {
        // Arrange
        const fnDone = assert.async();

        // Act
        this.oVisualizationOrganizer.loadSectionContext().then((oSectionContext) => {
            // Assert
            assert.deepEqual(oSectionContext, null, "The returned section context was correct.");
            fnDone();
        });
    });

    QUnit.module("isVizIdPresent, formatPinButtonIcon, formatPinButtonType, formatPinButtonTooltip, formatBookmarkPinButtonTooltip", {
        beforeEach: function (assert) {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves({
                getAllPages: sandbox.stub().resolves(aCdmGetAllPagesMock)
            });

            const oPagesModel = new JSONModel(oPagesMock);
            this.oGetServiceAsyncStub.withArgs("Pages").resolves({
                loadPage: sandbox.stub().callsFake(function (sPageId) {
                    return Promise.resolve("/" + sPageId);
                }),
                getModel: sandbox.stub().returns(oPagesModel)
            });

            const fnDone = assert.async();
            this.oVisualizationOrganizer = new VisualizationOrganizer();
            this.oVisualizationOrganizer.requestData().then(() => {
                fnDone();
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oVisualizationOrganizer.exit();
        }
    });

    QUnit.test("isVizIdPresent with a know vizId", function (assert) {
        // Act
        const bResult = this.oVisualizationOrganizer.isVizIdPresent("vizId");

        // Assert
        assert.strictEqual(bResult, true, "The vizId \"vizId\" is on a page.");
    });

    QUnit.test("isVizIdPresent with an unknown vizId", function (assert) {
        // Act
        const bResult = this.oVisualizationOrganizer.isVizIdPresent("vizId1");

        // Assert
        assert.strictEqual(bResult, false, "The vizId \"vizId1\" is not on a page.");
    });

    QUnit.test("isVizIdPresent with a known vizId in a section context", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const oContext = {
            pageID: "page1",
            sectionID: "page1Section1"
        };

        this.oVisualizationOrganizer.loadSectionContext(oContext).then((oSectionContext) => {
            // Act
            const bResult = this.oVisualizationOrganizer.isVizIdPresent("vizId2", oSectionContext);

            // Assert
            assert.strictEqual(bResult, true, "The vizId \"vizId2\" is on the page and section in context.");
            fnDone();
        });
    });

    QUnit.test("isVizIdPresent with an unknown vizId in a section context", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const oContext = {
            pageID: "page1",
            sectionID: "page1Section1"
        };

        this.oVisualizationOrganizer.loadSectionContext(oContext).then((oSectionContext) => {
            // Act
            const bResult = this.oVisualizationOrganizer.isVizIdPresent("vizId", oSectionContext);

            // Assert
            assert.strictEqual(bResult, false, "The vizId \"vizId\" is not on the page and section in context.");
            fnDone();
        });
    });

    QUnit.test("formatPinButtonIcon with a know vizId", function (assert) {
        // Act
        const sResult = this.oVisualizationOrganizer.formatPinButtonIcon("vizId");

        // Assert
        assert.strictEqual(sResult, "sap-icon://accept", "The vizId \"vizId\" is on a page so the icon:  \"sap-icon://accept\" is returned.");
    });

    QUnit.test("formatPinButtonIcon with an unknown vizId", function (assert) {
        // Act
        const sResult = this.oVisualizationOrganizer.formatPinButtonIcon("vizId1");

        // Assert
        assert.strictEqual(sResult, "sap-icon://add", "The vizId \"vizId\" is not a page so the icon:  \"sap-icon://add\" is returned.");
    });

    QUnit.test("formatPinButtonType with a know vizId", function (assert) {
        // Act
        const sResult = this.oVisualizationOrganizer.formatPinButtonType("vizId");

        // Assert
        assert.strictEqual(sResult, ButtonType.Emphasized, "The vizId \"vizId\" is on a page so the button type:  \"Emphasized\" is returned.");
    });

    QUnit.test("formatPinButtonType with an unknown vizId", function (assert) {
        // Act
        const sResult = this.oVisualizationOrganizer.formatPinButtonType("vizId1");

        // Assert
        assert.strictEqual(sResult, ButtonType.Default, "The vizId \"vizId\" is not a page so the button type:  \"Default\" is returned.");
    });

    QUnit.test("formatPinButtonTooltip with a know vizId", function (assert) {
        // Arrange
        const sExpectedTooltip = resources.i18n.getText("EasyAccessMenu_PinButton_Toggled_Tooltip");
        // Act
        const sResult = this.oVisualizationOrganizer.formatPinButtonTooltip("vizId");

        // Assert
        assert.strictEqual(sResult, sExpectedTooltip, "The vizId \"vizId\" is on a page so the text for:  \"EasyAccessMenu_PinButton_Toggled_Tooltip\" is returned.");
    });

    QUnit.test("formatPinButtonTooltip with an unknown vizId", function (assert) {
        // Arrange
        const sExpectedTooltip = resources.i18n.getText("EasyAccessMenu_PinButton_UnToggled_Tooltip");
        // Act
        const sResult = this.oVisualizationOrganizer.formatPinButtonTooltip("vizId1");

        // Assert
        assert.strictEqual(sResult, sExpectedTooltip, "The vizId \"vizId\" is not a page so the text for:  \"EasyAccessMenu_PinButton_UnToggled_Tooltip\" is returned.");
    });

    QUnit.test("formatPinButtonTooltip with a known vizId in a section context", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const oContext = {
            pageID: "page1",
            sectionID: "page1Section1"
        };
        const sExpectedTooltip = resources.i18n.getText("VisualizationOrganizer.Button.Tooltip.RemoveFromSection");

        this.oVisualizationOrganizer.loadSectionContext(oContext).then((oSectionContext) => {
            // Act
            const sResult = this.oVisualizationOrganizer.formatPinButtonTooltip("vizId2", oSectionContext);

            // Assert
            assert.strictEqual(sResult, sExpectedTooltip, "The text for:  \"VisualizationOrganizer.Button.Tooltip.RemoveFromSection\" is returned");
            fnDone();
        });
    });

    QUnit.test("formatPinButtonTooltip with an unknown vizId in a section context", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const oContext = {
            pageID: "page1",
            sectionID: "page1Section1"
        };
        const sExpectedTooltip = resources.i18n.getText("VisualizationOrganizer.Button.Tooltip.AddToSection");

        this.oVisualizationOrganizer.loadSectionContext(oContext).then((oSectionContext) => {
            // Act
            const sResult = this.oVisualizationOrganizer.formatPinButtonTooltip("vizId", oSectionContext);

            // Assert
            assert.strictEqual(sResult, sExpectedTooltip, "The text for:  \"VisualizationOrganizer.Button.Tooltip.AddToSection\" is returned");
            fnDone();
        });
    });

    QUnit.test("formatPinButtonTooltip with a known vizId in a section context without sectionID", function (assert) {
        // Arrange
        const oContext = {
            pageID: "page1",
            sectionID: ""
        };
        const sExpectedTooltip = resources.i18n.getText("VisualizationOrganizer.Button.Tooltip.RemoveFromPage", ["page1Title"]);

        return this.oVisualizationOrganizer.loadSectionContext(oContext).then((oSectionContext) => {
            // Act
            const sResult = this.oVisualizationOrganizer.formatPinButtonTooltip("vizId2", oSectionContext);

            // Assert
            assert.strictEqual(sResult, sExpectedTooltip, "The text for:  \"VisualizationOrganizer.Button.Tooltip.RemoveFromPage\" is returned");
        });
    });

    QUnit.test("formatPinButtonTooltip with an unknown vizId in a section context without sectionID", function (assert) {
        // Arrange
        const oContext = {
            pageID: "page1",
            sectionID: ""
        };
        const sExpectedTooltip = resources.i18n.getText("VisualizationOrganizer.Button.Tooltip.AddToPage", ["page1Title"]);

        return this.oVisualizationOrganizer.loadSectionContext(oContext).then((oSectionContext) => {
            // Act
            const sResult = this.oVisualizationOrganizer.formatPinButtonTooltip("vizId", oSectionContext);

            // Assert
            assert.strictEqual(sResult, sExpectedTooltip, "The text for:  \"VisualizationOrganizer.Button.Tooltip.AddToPage\" is returned");
        });
    });

    QUnit.test("formatBookmarkPinButtonTooltip when bookmarkCount > 0", function (assert) {
        // Arrange
        const sExpectedTooltip = resources.i18n.getText("EasyAccessMenu_PinButton_Toggled_Tooltip");
        // Act
        const sResult = this.oVisualizationOrganizer.formatBookmarkPinButtonTooltip(1);

        // Assert
        assert.strictEqual(sResult, sExpectedTooltip, "The vizId \"vizId\" is on a page so the text for:  \"EasyAccessMenu_PinButton_Toggled_Tooltip\" is returned.");
    });

    QUnit.test("formatBookmarkPinButtonTooltip when bookmarkCount === 0", function (assert) {
        // Arrange
        const sExpectedTooltip = resources.i18n.getText("EasyAccessMenu_PinButton_UnToggled_Tooltip");
        // Act
        const sResult = this.oVisualizationOrganizer.formatBookmarkPinButtonTooltip(0);

        // Assert
        assert.strictEqual(sResult, sExpectedTooltip, "The vizId \"vizId\" is not a page so the text for:  \"EasyAccessMenu_PinButton_UnToggled_Tooltip\" is returned.");
    });

    QUnit.test("formatBookmarkPinButtonTooltip when bookmarkCount > 0 in a section context", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const oContext = {
            pageID: "page1",
            sectionID: "page1Section1"
        };
        const sExpectedTooltip = resources.i18n.getText("VisualizationOrganizer.Button.Tooltip.RemoveFromSection");

        this.oVisualizationOrganizer.loadSectionContext(oContext).then((oSectionContext) => {
            // Act
            const sResult = this.oVisualizationOrganizer.formatBookmarkPinButtonTooltip(1, oSectionContext);

            // Assert
            assert.strictEqual(sResult, sExpectedTooltip, "The text for:  \"VisualizationOrganizer.Button.Tooltip.RemoveFromSection\" is returned");
            fnDone();
        });
    });

    QUnit.test("formatBookmarkPinButtonTooltip when bookmarkCount === 0 in a section context", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const oContext = {
            pageID: "page1",
            sectionID: "page1Section1"
        };
        const sExpectedTooltip = resources.i18n.getText("VisualizationOrganizer.Button.Tooltip.AddToSection");

        this.oVisualizationOrganizer.loadSectionContext(oContext).then((oSectionContext) => {
            // Act
            const sResult = this.oVisualizationOrganizer.formatBookmarkPinButtonTooltip(0, oSectionContext);

            // Assert
            assert.strictEqual(sResult, sExpectedTooltip, "The text for:  \"VisualizationOrganizer.Button.Tooltip.AddToSection\" is returned");
            fnDone();
        });
    });

    QUnit.module("_onSearch", {
        beforeEach: async function (assert) {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves({
                getAllPages: sandbox.stub().resolves(aCdmGetAllPagesMock)
            });

            this.oGetServiceAsyncStub.withArgs("Menu").resolves({
                getContentNodes: sandbox.stub().withArgs([ContentNodeType.Space, ContentNodeType.Page]).resolves(aContentNodeMock)
            });

            const oModel = new JSONModel({
                icon: "sap-icon://add",
                type: ButtonType.Emphasized,
                tooltip: "pin me"
            });
            this.oPinButton = new PinButton({
                icon: "{/icon}",
                type: "{/type}",
                tooltip: "{/tooltip}"
            }).setModel(oModel);
            this.oPinButton.placeAt("qunit-fixture");
            await nextUIUpdate();

            this.oVizInfo = {
                id: "vizId",
                title: "vizTitle"
            };

            const fnDone = assert.async();
            this.oVisualizationOrganizer = new VisualizationOrganizer();
            this.oVisualizationOrganizer.setPressed(true);
            this.oVisualizationOrganizer.requestData().then(() => {
                this.oVisualizationOrganizer.open(this.oPinButton, this.oVizInfo).then(() => {
                    fnDone();
                });
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oPinButton.destroy();
            this.oVisualizationOrganizer.exit();
        }
    });

    QUnit.test("no Bindings and no searchTerm", async function (assert) {
        // Arrange
        const oPopover = Element.getElementById("sapUshellVisualizationOrganizerPopover");
        const oPagesList = oPopover.getContent()[0];
        const oSearchField = oPopover.getSubHeader().getItems()[0];

        oPopover.getModel().setProperty("/pages", []);

        // Act
        oSearchField.setValue("");
        oSearchField.fireSearch();
        await nextUIUpdate();

        // Assert
        assert.strictEqual(oPagesList.getNoDataText(), resources.i18n.getText("VisualizationOrganizer.PagesList.NoDataText"), "The correct no data text is shown.");
    });

    QUnit.test("no Bindings with a searchTerm", async function (assert) {
        // Arrange
        const oPopover = Element.getElementById("sapUshellVisualizationOrganizerPopover");
        const oPagesList = oPopover.getContent()[0];
        const oSearchField = oPopover.getSubHeader().getItems()[0];

        // Act
        oSearchField.setValue("searchTerm");
        oSearchField.fireSearch();
        await nextUIUpdate();

        // Assert
        assert.strictEqual(oPagesList.getNoDataText(), resources.i18n.getText("VisualizationOrganizer.PagesList.NoResultsText"), "The no data text is correct");
    });

    QUnit.module("onSelectionChange", {
        beforeEach: async function (assert) {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves({
                getAllPages: sandbox.stub().resolves(aCdmGetAllPagesMock)
            });

            this.oGetServiceAsyncStub.withArgs("Menu").resolves({
                getContentNodes: sandbox.stub().withArgs([ContentNodeType.Space, ContentNodeType.Page]).resolves(aContentNodeMock)
            });

            const oModel = new JSONModel({
                icon: "sap-icon://add",
                type: ButtonType.Emphasized,
                tooltip: "pin me"
            });
            this.oPinButton = new PinButton({
                icon: "{/icon}",
                type: "{/type}",
                tooltip: "{/tooltip}"
            }).setModel(oModel);
            this.oPinButton.placeAt("qunit-fixture");
            await nextUIUpdate();

            this.oVizInfo = {
                id: "vizId",
                title: "vizTitle"
            };

            const fnDone = assert.async();
            this.oVisualizationOrganizer = new VisualizationOrganizer();
            this.oVisualizationOrganizer.requestData().then(() => {
                this.oVisualizationOrganizer.open(this.oPinButton, this.oVizInfo).then(() => {
                    this.oList = Element.getElementById("sapUshellVisualizationOrganizerSpacesList");
                    this.aItems = this.oList.getItems();
                    fnDone();
                });
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oVisualizationOrganizer.exit();
            this.oPinButton.destroy();
        }
    });

    QUnit.test("Page is selected and all pages with the same pageId get selected.", function (assert) {
        // Act
        this.oList.fireSelectionChange({
            listItem: this.aItems[1],
            selected: true
        });

        // Assert
        assert.strictEqual(this.aItems[1].getSelected(), true, "The page was selected.");
        assert.strictEqual(this.aItems[3].getSelected(), true, "The page stays selected.");
        assert.strictEqual(this.aItems[5].getSelected(), true, "The page was selected.");
        assert.strictEqual(this.aItems[6].getSelected(), true, "The page stays selected.");
    });

    QUnit.test("Page is deselected and all pages with the same pageId get deselected.", function (assert) {
        // Act
        this.oList.fireSelectionChange({
            listItem: this.aItems[3],
            selected: false
        });

        // Assert
        assert.strictEqual(this.aItems[1].getSelected(), false, "The page stays deselected.");
        assert.strictEqual(this.aItems[3].getSelected(), false, "The page was deselected.");
        assert.strictEqual(this.aItems[5].getSelected(), false, "The page stays deselected.");
        assert.strictEqual(this.aItems[6].getSelected(), false, "The page was deselected.");
    });

    QUnit.module("Section context - _applyOrganizationChangeToSection", {
        beforeEach: function () {

            this.oPagesService = {
                addVisualization: sandbox.stub().resolves(),
                findVisualization: sandbox.stub().resolves([{ sectionIndex: 0, vizIndexes: [0] }]),
                deleteVisualization: sandbox.stub().resolves(),
                getPageIndex: sandbox.stub().returns(0)
            };
            sandbox.stub(Container, "getServiceAsync").withArgs("Pages").resolves(this.oPagesService);

            this.oBindingStub = {
                refresh: sandbox.stub(),
                getProperty: sandbox.stub()
            };
            this.oSetBusyStub = sandbox.stub();
            this.oSource = {
                getBindingContext: sandbox.stub().returns(this.oBindingStub),
                getBinding: sandbox.stub().returns(this.oBindingStub),
                setBusy: this.oSetBusyStub,
                getBusy: sandbox.stub().returns(false)
            };

            this.oVisualizationOrganizer = new VisualizationOrganizer();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("onTilePinButtonClick call _applyOrganizationChangeToSection when section context is presented", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const sVizId = "vizId1";
        const oProperty = { id: sVizId };
        const oEvent = { getSource: sandbox.stub().returns(this.oSource) };
        const oSectionContext = { pageId: "page_id", sectionID: "section_id" };

        this.oBindingStub.getProperty.returns(oProperty);

        sandbox.spy(this.oVisualizationOrganizer, "toggle");
        sandbox.stub(this.oVisualizationOrganizer, "_applyOrganizationChangeToSection").resolves();

        // Act
        this.oVisualizationOrganizer.onTilePinButtonClick(oEvent, oSectionContext).then(() => {
            // Assert
            assert.ok(this.oVisualizationOrganizer._applyOrganizationChangeToSection.calledWith(
                this.oSource,
                oProperty,
                oSectionContext
            ), "\"_applyOrganizationChangeToSection\" was called with the expected arguments");
            assert.strictEqual(this.oVisualizationOrganizer.toggle.callCount, 0, "\"toggle\" should not be called when section context is defined");

            fnDone();
        });
    });

    QUnit.test("add visualization to specific section", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const oVizInfo = { id: "vizId1", title: "viz title" };

        const oSectionContext = {
            pageID: "page_id",
            pageTitle: "pageTitle",
            sectionID: "section_id",
            sectionTitle: "sectionTitle"
        };

        this.oVisualizationOrganizer.stVizIdInSection.add("fakeId");

        // Act
        this.oVisualizationOrganizer._applyOrganizationChangeToSection(this.oSource, oVizInfo, oSectionContext)
            .then(() => {
                // Assert
                assert.ok(this.oPagesService.addVisualization.calledWith(
                    oSectionContext.pageID,
                    oSectionContext.sectionID,
                    oVizInfo.id
                ), "\"addVisualization\" was called with the expected arguments");
                assert.deepEqual(Array.from(this.oVisualizationOrganizer.stVizIdInSection), ["fakeId", "vizId1"], "\"stVizIdInSection\" is updated");
                assert.ok(this.oBindingStub.refresh.called, "The binding of the toggle button was updated");

                fnDone();
            });
    });

    QUnit.test("Don't execute remove if visualization was not found", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const oVizInfo = { id: "vizId1", title: "viz title" };

        const oSectionContext = {
            pageID: "page_id",
            pageTitle: "pageTitle",
            sectionID: "section_id",
            sectionTitle: "sectionTitle"
        };

        this.oPagesService.findVisualization.resolves([]);
        this.oVisualizationOrganizer.stVizIdInSection.add("fakeId");
        this.oVisualizationOrganizer.stVizIdInSection.add("vizId1");

        // Act
        this.oVisualizationOrganizer._applyOrganizationChangeToSection(this.oSource, oVizInfo, oSectionContext)
            .then(() => {
                // Assert
                assert.strictEqual(this.oPagesService.deleteVisualization.callCount, 0, "\"deleteVisualization\" should not be called");
                assert.deepEqual(Array.from(this.oVisualizationOrganizer.stVizIdInSection), ["fakeId"], "\"stVizIdInSection\" is updated");
                assert.ok(this.oBindingStub.refresh.called, "The binding of the toggle button was updated");

                fnDone();
            });
    });

    QUnit.test("remove only 1 visualization", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const oVizInfo = { id: "vizId1", title: "viz title" };
        const iPageIndex = 1;
        const iSectionIndex = 5;
        const aVizIndexes = [3];

        const oSectionContext = {
            pageID: "page_id",
            pageTitle: "pageTitle",
            sectionID: "section_id",
            sectionTitle: "sectionTitle"
        };

        this.oPagesService.findVisualization.resolves([{
            sectionIndex: iSectionIndex,
            vizIndexes: aVizIndexes
        }]);
        this.oPagesService.getPageIndex.returns(iPageIndex);
        this.oVisualizationOrganizer.stVizIdInSection.add("fakeId");
        this.oVisualizationOrganizer.stVizIdInSection.add("vizId1");

        // Act
        this.oVisualizationOrganizer._applyOrganizationChangeToSection(this.oSource, oVizInfo, oSectionContext).then(() => {
            // Assert
            assert.ok(this.oPagesService.getPageIndex.calledWith("page_id"), " \"getPageIndex\" was called with the correct params");
            assert.ok(this.oPagesService.deleteVisualization.calledWith(
                iPageIndex,
                iSectionIndex,
                aVizIndexes[0]
            ), "\"deleteVisualization\" was called with the expected arguments");
            assert.deepEqual(Array.from(this.oVisualizationOrganizer.stVizIdInSection), ["fakeId"], "\"stVizIdInSection\" is updated");
            assert.ok(this.oBindingStub.refresh.called, "The binding of the toggle button was updated");

            fnDone();
        });
    });

    QUnit.test("remove 1 visualization that is contained in different sections", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const oVizInfo = { id: "vizId1", title: "viz title" };
        const iPageIndex = 1;

        const oSectionContext = {
            pageID: "page_id",
            pageTitle: "pageTitle",
            sectionID: "section_id",
            sectionTitle: "sectionTitle"
        };

        this.oPagesService.findVisualization.resolves([{
            sectionIndex: 1,
            vizIndexes: [2]
        },
        {
            sectionIndex: 3,
            vizIndexes: [5]
        }]);
        this.oPagesService.getPageIndex.returns(iPageIndex);
        this.oVisualizationOrganizer.stVizIdInSection.add("fakeId");
        this.oVisualizationOrganizer.stVizIdInSection.add("vizId1");

        // Act
        this.oVisualizationOrganizer._applyOrganizationChangeToSection(this.oSource, oVizInfo, oSectionContext).then(() => {
            assert.strictEqual(this.oPagesService.deleteVisualization.callCount, 2, "\"deleteVisualization\" was called for all visualization in the section");
            assert.deepEqual(Array.from(this.oVisualizationOrganizer.stVizIdInSection), ["fakeId"], "\"stVizIdInSection\" is updated");
            assert.ok(this.oBindingStub.refresh.called, "The binding of the toggle button was updated");
            fnDone();
        });
    });

    QUnit.test("remove several visualizations", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const oVizInfo = { id: "vizId1", title: "viz title" };
        const iPageIndex = 1;
        const iSectionIndex = 5;
        const aVizIndexes = [1, 3, 5];

        const oSectionContext = {
            pageID: "page_id",
            pageTitle: "pageTitle",
            sectionID: "section_id",
            sectionTitle: "sectionTitle"
        };

        this.oPagesService.findVisualization.resolves([{
            sectionIndex: iSectionIndex,
            vizIndexes: aVizIndexes
        }]);
        this.oPagesService.getPageIndex.returns(iPageIndex);
        this.oVisualizationOrganizer.stVizIdInSection.add("fakeId");
        this.oVisualizationOrganizer.stVizIdInSection.add("vizId1");

        // Act
        this.oVisualizationOrganizer._applyOrganizationChangeToSection(this.oSource, oVizInfo, oSectionContext)
            .then(() => {
                // Assert
                assert.strictEqual(this.oPagesService.deleteVisualization.callCount, 3, "\"deleteVisualization\" was called for all visualization in the section");
                assert.deepEqual(Array.from(this.oVisualizationOrganizer.stVizIdInSection), ["fakeId"], "\"stVizIdInSection\" is updated");
                assert.ok(this.oBindingStub.refresh.called, "The binding of the toggle button was updated");

                fnDone();
            });
    });

    QUnit.module("okay, _organizeVisualizations, _retrieveChangedPageIds, _applyOrganizationChange", {
        beforeEach: async function (assert) {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves({
                getAllPages: sandbox.stub().resolves(aCdmGetAllPagesMock)
            });

            this.oGetServiceAsyncStub.withArgs("Menu").resolves({
                getContentNodes: sandbox.stub().withArgs([ContentNodeType.Space, ContentNodeType.Page]).resolves(aContentNodeMock)
            });

            this.oPagesService = {
                addVisualization: sandbox.stub().resolves(),
                findVisualization: sandbox.stub().resolves([{ sectionIndex: 0, vizIndexes: [0] }]),
                deleteVisualization: sandbox.stub().resolves(),
                getPageIndex: sandbox.stub().returns(0)
            };
            this.oGetServiceAsyncStub.withArgs("Pages").resolves(this.oPagesService);

            const oModel = new JSONModel({
                icon: "sap-icon://add",
                type: ButtonType.Emphasized,
                tooltip: "pin me"
            });
            this.oPinButton = new PinButton({
                icon: "{/icon}",
                type: "{/type}",
                tooltip: "{/tooltip}"
            }).setModel(oModel);
            this.oPinButton.placeAt("qunit-fixture");
            await nextUIUpdate();

            this.oVizInfo = {
                id: "vizId",
                title: "vizTitle"
            };

            const fnDone = assert.async();
            this.oVisualizationOrganizer = new VisualizationOrganizer();
            this.oVisualizationOrganizer.requestData().then(() => {
                this.oVisualizationOrganizer.open(this.oPinButton, this.oVizInfo).then(() => {
                    this.oPopover = Element.getElementById("sapUshellVisualizationOrganizerPopover");
                    this.oPopoverSetBusySpy = sandbox.spy(this.oPopover, "setBusy");
                    this.oOkayButton = Element.getElementById("sapUshellVisualizationOrganizerOKButton");
                    this.oList = Element.getElementById("sapUshellVisualizationOrganizerSpacesList");
                    this.aItems = this.oList.getItems();
                    fnDone();
                });
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oVisualizationOrganizer.exit();
            this.oPinButton.destroy();
        }
    });

    QUnit.test("_retrieveChangedPageIds returns the correct change", function (assert) {
        // Arrange
        const oExpectedResult = {
            addToPageIds: ["page1"],
            deleteFromPageIds: []
        };

        // Act
        this.oList.fireSelectionChange({
            listItem: this.aItems[1],
            selected: true
        });
        const oChangedItems = this.oVisualizationOrganizer._retrieveChangedPageIds();

        // Assert
        assert.deepEqual(oChangedItems, oExpectedResult, "The result is as expected.");
    });

    QUnit.test("add on no page and delete from no page", function (assert) {
        // Arrange
        const fnDone = assert.async();
        this.oPopover.attachAfterClose(() => {
            // Assert
            assert.strictEqual(this.oPagesService.addVisualization.called, false, "addVisualizations was not called.");
            assert.strictEqual(this.oPagesService.findVisualization.called, false, "findVisualizations was not called.");
            assert.strictEqual(this.oPagesService.deleteVisualization.called, false, "deleteVisualizations was not called.");

            assert.strictEqual(this.oPopoverSetBusySpy.firstCall.args[0], true, "busyState was set to true");
            assert.strictEqual(this.oPopoverSetBusySpy.secondCall.args[0], false, "busyState was set to false");

            fnDone();
        });

        // Act
        this.oOkayButton.firePress();
    });

    QUnit.test("add on one page and delete from no page", function (assert) {
        // Arrange
        const fnDone = assert.async();
        this.oPopover.attachAfterClose(() => {
            // Assert
            assert.strictEqual(this.oPagesService.addVisualization.callCount, 1, "addVisualization was called once.");
            assert.deepEqual(this.oPagesService.addVisualization.args[0], ["page1", null, "vizId"], "addVisualization was called with the correct parameters.");
            assert.strictEqual(this.oPagesService.findVisualization.called, false, "findVisualizations was not called.");
            assert.strictEqual(this.oPagesService.deleteVisualization.called, false, "deleteVisualizations was not called.");

            assert.strictEqual(this.oPopoverSetBusySpy.firstCall.args[0], true, "busyState was set to true");
            assert.strictEqual(this.oPopoverSetBusySpy.secondCall.args[0], false, "busyState was set to false");

            fnDone();
        });

        // Act
        this.oList.fireSelectionChange({
            listItem: this.aItems[1],
            selected: true
        });
        this.oOkayButton.firePress();
    });

    QUnit.test("add on no page and delete from one page", function (assert) {
        // Arrange
        const fnDone = assert.async();
        this.oPopover.attachAfterClose(() => {
            // Assert
            assert.strictEqual(this.oPagesService.addVisualization.called, false, "addVisualizations was not called.");
            assert.strictEqual(this.oPagesService.findVisualization.called, true, "findVisualizations was called.");
            assert.strictEqual(this.oPagesService.deleteVisualization.callCount, 1, "deleteVisualization was called once.");
            assert.deepEqual(this.oPagesService.deleteVisualization.args[0], [0, 0, 0], "deleteVisualization was called with the correct parameters.");

            assert.strictEqual(this.oPopoverSetBusySpy.firstCall.args[0], true, "busyState was set to true");
            assert.strictEqual(this.oPopoverSetBusySpy.secondCall.args[0], false, "busyState was set to false");

            fnDone();
        });

        // Act
        this.oList.fireSelectionChange({
            listItem: this.aItems[3],
            selected: false
        });
        this.oOkayButton.firePress();
    });

    QUnit.test("add on no page and delete from one page at tree locations with two in the same group", function (assert) {
        // Arrange
        const fnDone = assert.async();
        this.oPagesService.findVisualization.resolves([
            { sectionIndex: 0, vizIndexes: [0, 1] },
            { sectionIndex: 2, vizIndexes: [4] }
        ]);
        this.oPopover.attachAfterClose(() => {
            // Assert
            assert.strictEqual(this.oPagesService.addVisualization.called, false, "addVisualizations was not called.");
            assert.strictEqual(this.oPagesService.findVisualization.called, true, "findVisualizations was called.");
            assert.strictEqual(this.oPagesService.deleteVisualization.callCount, 3, "deleteVisualization was called once.");
            assert.deepEqual(this.oPagesService.deleteVisualization.args[0], [0, 2, 4], "deleteVisualization was called with the correct parameters.");
            assert.deepEqual(this.oPagesService.deleteVisualization.args[1], [0, 0, 1], "deleteVisualization was called with the correct parameters.");
            assert.deepEqual(this.oPagesService.deleteVisualization.args[2], [0, 0, 0], "deleteVisualization was called with the correct parameters.");

            assert.strictEqual(this.oPopoverSetBusySpy.firstCall.args[0], true, "busyState was set to true");
            assert.strictEqual(this.oPopoverSetBusySpy.secondCall.args[0], false, "busyState was set to false");

            fnDone();
        });

        // Act
        this.oList.fireSelectionChange({
            listItem: this.aItems[3],
            selected: false
        });
        this.oOkayButton.firePress();
    });

    QUnit.test("add on one page and delete from one page", function (assert) {
        // Arrange
        const fnDone = assert.async();
        this.oPopover.attachAfterClose(() => {
            // Assert
            assert.strictEqual(this.oPagesService.addVisualization.callCount, 1, "addVisualization was called once.");
            assert.deepEqual(this.oPagesService.addVisualization.args[0], ["page1", null, "vizId"], "addVisualization was called with the correct parameters.");
            assert.strictEqual(this.oPagesService.findVisualization.called, true, "findVisualizations was called.");
            assert.strictEqual(this.oPagesService.deleteVisualization.callCount, 1, "deleteVisualization was called once.");
            assert.deepEqual(this.oPagesService.deleteVisualization.args[0], [0, 0, 0], "deleteVisualization was called with the correct parameters.");

            assert.strictEqual(this.oPopoverSetBusySpy.firstCall.args[0], true, "busyState was set to true");
            assert.strictEqual(this.oPopoverSetBusySpy.secondCall.args[0], false, "busyState was set to false");

            fnDone();
        });

        // Act
        this.oList.fireSelectionChange({
            listItem: this.aItems[1],
            selected: true
        });
        this.oList.fireSelectionChange({
            listItem: this.aItems[3],
            selected: false
        });
        this.oOkayButton.firePress();
    });

    QUnit.test("Multiple add presses", function (assert) {
        // Arrange
        const fnDone = assert.async();
        this.oPopover.attachAfterClose(() => {
            // Assert
            assert.strictEqual(this.oPagesService.addVisualization.callCount, 0, "addVisualization was not called.");
            assert.strictEqual(this.oPagesService.findVisualization.callCount, 0, "findVisualizations was not called.");
            assert.strictEqual(this.oPagesService.deleteVisualization.callCount, 0, "deleteVisualization was not called.");

            assert.strictEqual(this.oPopoverSetBusySpy.callCount, 2, "Popover busyState was set twice");

            fnDone();
        });

        // Act
        this.oOkayButton.firePress();
        this.oOkayButton.firePress();
    });

    QUnit.module("okay, _organizeVisualizations, _retrieveChangedItemsFromPagesList, _applyOrganizationChange", {
        beforeEach: async function (assert) {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves({
                getAllPages: sandbox.stub().resolves(aCdmGetAllPagesMock)
            });

            this.oGetServiceAsyncStub.withArgs("Menu").resolves({
                getContentNodes: sandbox.stub().withArgs([ContentNodeType.Space, ContentNodeType.Page]).resolves(aContentNodeMock)
            });

            this.oPagesService = {
                addVisualization: sandbox.stub().resolves(),
                findVisualization: sandbox.stub().resolves([{ sectionIndex: 0, vizIndexes: [0] }]),
                deleteVisualization: sandbox.stub().resolves(),
                getPageIndex: sandbox.stub().returns(0)
            };
            this.oGetServiceAsyncStub.withArgs("Pages").resolves(this.oPagesService);

            const oModel = new JSONModel({
                icon: "sap-icon://add",
                type: ButtonType.Emphasized,
                tooltip: "pin me"
            });
            this.oPinButton = new PinButton({
                icon: "{/icon}",
                type: "{/type}",
                tooltip: "{/tooltip}"
            }).setModel(oModel);
            this.oPinButton.placeAt("qunit-fixture");
            await nextUIUpdate();

            this.oVizInfo = {
                id: "vizId2",
                title: "vizTitle"
            };

            const fnDone = assert.async();
            this.oVisualizationOrganizer = new VisualizationOrganizer();
            this.oVisualizationOrganizer.requestData().then(() => {
                this.oVisualizationOrganizer.open(this.oPinButton, this.oVizInfo).then(() => {
                    this.oPopover = Element.getElementById("sapUshellVisualizationOrganizerPopover");
                    this.oOkayButton = Element.getElementById("sapUshellVisualizationOrganizerOKButton");
                    this.oList = Element.getElementById("sapUshellVisualizationOrganizerSpacesList");
                    this.aItems = this.oList.getItems();
                    fnDone();
                });
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oVisualizationOrganizer.exit();
            this.oPinButton.destroy();
        }
    });

    QUnit.test("delete from both pages", function (assert) {
        // Arrange
        const fnDone = assert.async();

        this.oPopover.attachAfterClose(() => {
            // Assert
            assert.strictEqual(this.oPagesService.addVisualization.called, false, "addVisualization was not called.");
            assert.strictEqual(this.oPagesService.findVisualization.called, true, "findVisualizations was called.");
            assert.strictEqual(this.oPagesService.deleteVisualization.callCount, 2, "deleteVisualization was called twice.");
            assert.deepEqual(this.oPagesService.deleteVisualization.args[0], [0, 0, 0], "deleteVisualization was called with the correct parameters the first time.");
            assert.deepEqual(this.oPagesService.deleteVisualization.args[1], [0, 0, 0], "deleteVisualization was called with the correct parameters the second time.");
            fnDone();
        });

        // Act
        this.oList.fireSelectionChange({
            listItem: this.aItems[1],
            selected: false
        });
        this.oList.fireSelectionChange({
            listItem: this.aItems[3],
            selected: false
        });
        this.oOkayButton.firePress();
    });

    QUnit.module("onHierarchyAppsPinButtonClick", {
        beforeEach: function (assert) {

            sandbox.stub(Container, "getServiceAsync").withArgs("CommonDataModel").resolves({
                getAllPages: sandbox.stub().resolves(aCdmGetAllPagesMock)
            });

            const fnDone = assert.async();
            this.oVisualizationOrganizer = new VisualizationOrganizer();
            this.oVisualizationOrganizer.requestData().then(() => {
                fnDone();
            });

            this.oTileData = { id: "vizId", text: "vizTitle" };
            this.oSetBusyStub = sandbox.stub();
            this.oGetBusyStub = sandbox.stub().returns(false);
            this.oSource = {
                getParent: sandbox.stub().returns({
                    getBinding: sandbox.stub().returns({
                        getContext: sandbox.stub().returns({
                            getObject: sandbox.stub().returns(this.oTileData)
                        })
                    })
                }),
                setBusy: this.oSetBusyStub,
                getBusy: this.oGetBusyStub
            };
            this.oEvent = {
                getSource: sandbox.stub().returns(this.oSource)
            };

            this.oApplyBookmarkTileChangeToSectionStub = sandbox.stub(this.oVisualizationOrganizer, "_applyBookmarkTileChangeToSection").resolves();
            this.oApplyChangeToPageStub = sandbox.stub(this.oVisualizationOrganizer, "_applyChangeToPage").resolves();
            this.oToggleStub = sandbox.stub(this.oVisualizationOrganizer, "toggle").resolves();
        },
        afterEach: function () {
            sandbox.restore();
            this.oVisualizationOrganizer.exit();
        }
    });

    QUnit.test("toggles the popover, if no section context is given and more than 1 personalizable page.", function (assert) {
        // Arrange
        const oExpectedAppInfo = {
            id: this.oTileData.id,
            text: this.oTileData.text,
            isBookmark: true,
            title: this.oTileData.text
        };
        // Act
        return this.oVisualizationOrganizer.onHierarchyAppsPinButtonClick(this.oEvent).then((bShouldUpdate) => {
            // Assert
            assert.strictEqual(bShouldUpdate, false, "close the dialog by click");
            assert.strictEqual(this.oApplyBookmarkTileChangeToSectionStub.callCount, 0, "_applyOrganizationChangeToSection was not called.");
            assert.strictEqual(this.oApplyChangeToPageStub.callCount, 0, "_applyChangeToPage was not called.");
            assert.strictEqual(this.oToggleStub.callCount, 1, "toggle was called once.");
            assert.deepEqual(this.oToggleStub.args[0][0], this.oSource, "toggle has the correct 1. Parameter.");
            assert.deepEqual(this.oToggleStub.args[0][1], oExpectedAppInfo, "toggle has the correct 2. Parameter.");

            assert.strictEqual(this.oSetBusyStub.callCount, 0, "setBusy was not called");
        });
    });

    QUnit.test("applies the organizer change, without opening the popover, if a section context is given.", function (assert) {
        // Arrange
        const oExpectedAppInfo = {
            id: this.oTileData.id,
            text: this.oTileData.text,
            isBookmark: true,
            title: this.oTileData.text
        };
        const oSectionContext = { id: "sectionId" };

        // Act
        return this.oVisualizationOrganizer.onHierarchyAppsPinButtonClick(this.oEvent, oSectionContext).then((bShouldUpdate) => {
            // Assert
            assert.strictEqual(bShouldUpdate, true, "Bookmarks should be updated");
            assert.strictEqual(this.oApplyBookmarkTileChangeToSectionStub.callCount, 1, "_applyOrganizationChangeToSection was not called.");
            assert.deepEqual(this.oApplyBookmarkTileChangeToSectionStub.args[0][0], oExpectedAppInfo, "_applyOrganizationChangeToSection has the correct 2. Parameter.");
            assert.deepEqual(this.oApplyBookmarkTileChangeToSectionStub.args[0][1], oSectionContext, "_applyOrganizationChangeToSection has the correct 3. Parameter.");
            assert.strictEqual(this.oToggleStub.callCount, 0, "toggle was called once.");
            assert.strictEqual(this.oApplyChangeToPageStub.callCount, 0, "_applyChangeToPage was called once.");

            assert.strictEqual(this.oSetBusyStub.firstCall.args[0], true, "busyState was set to true");
            assert.strictEqual(this.oSetBusyStub.secondCall.args[0], false, "busyState was set to false");
        });
    });

    QUnit.test("applies the organizer change, without opening the popover, if only 1 page is personalizable.", function (assert) {
        // Arrange
        const oExpectedAppInfo = {
            id: this.oTileData.id,
            text: this.oTileData.text,
            isBookmark: true,
            title: this.oTileData.text
        };
        const oPersonalizablePage = {
            id: "page",
            title: "pageTitle"
        };
        this.oVisualizationOrganizer.aPersonalizablePages = [oPersonalizablePage];

        // Act
        return this.oVisualizationOrganizer.onHierarchyAppsPinButtonClick(this.oEvent).then((bShouldUpdate) => {
            // Assert
            assert.strictEqual(bShouldUpdate, true, "Bookmarks should be updated");
            assert.strictEqual(this.oApplyChangeToPageStub.callCount, 1, "_applyChangeToPageStub was not called.");
            assert.deepEqual(this.oApplyChangeToPageStub.args[0][0], this.oSource, "_applyChangeToPageStub has the correct 1. Parameter.");
            assert.deepEqual(this.oApplyChangeToPageStub.args[0][1], oExpectedAppInfo, "_applyChangeToPageStub has the correct 2. Parameter.");
            assert.deepEqual(this.oApplyChangeToPageStub.args[0][2], oPersonalizablePage, "_applyChangeToPageStub has the correct 3. Parameter.");
            assert.strictEqual(this.oToggleStub.callCount, 0, "toggle was called once.");
            assert.strictEqual(this.oApplyBookmarkTileChangeToSectionStub.callCount, 0, "_applyBookmarkTileChangeToSection was called once.");

            assert.strictEqual(this.oSetBusyStub.firstCall.args[0], true, "busyState was set to true");
            assert.strictEqual(this.oSetBusyStub.secondCall.args[0], false, "busyState was set to false");
        });
    });

    QUnit.module("onHierarchyAppsPinButtonClick: Section context", {
        beforeEach: function () {
            this.oPagesService = {
                deleteBookmarks: sandbox.stub().resolves(),
                addBookmarkToPage: sandbox.stub().resolves()
            };
            sandbox.stub(Container, "getServiceAsync").withArgs("Pages").resolves(this.oPagesService);

            this.oGetObjectStub = sandbox.stub();
            this.oSetBusyStub = sandbox.stub();
            this.oGetBusyStub = sandbox.stub().returns(false);
            this.oSource = {
                getParent: sandbox.stub().returns({
                    getBinding: sandbox.stub().returns({
                        getContext: sandbox.stub().returns({
                            getObject: this.oGetObjectStub
                        })
                    })
                }),
                setBusy: this.oSetBusyStub,
                getBusy: this.oGetBusyStub
            };

            this.oVisualizationOrganizer = new VisualizationOrganizer();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Add bookmark tile to the section", function (assert) {
        // Arrange
        const oAppInfo = {
            icon: "sap-icon://accept",
            url: "https://sap.com",
            text: "SAP",
            subtitle: "website",
            bookmarkCount: 0
        };
        this.oGetObjectStub.returns(oAppInfo);
        const oEvent = { getSource: sandbox.stub().returns(this.oSource) };
        const oSectionContext = { pageID: "page_id", sectionID: "section_id" };

        const oExpectedBookmark = {
            icon: "sap-icon://accept",
            url: "https://sap.com",
            title: "SAP",
            subtitle: "website"
        };

        sandbox.spy(this.oVisualizationOrganizer, "_applyBookmarkTileChangeToSection");
        sandbox.spy(this.oVisualizationOrganizer, "toggle");

        // Act
        return this.oVisualizationOrganizer.onHierarchyAppsPinButtonClick(oEvent, oSectionContext).then((bUpdate) => {
            // Assert
            assert.ok(this.oVisualizationOrganizer._applyBookmarkTileChangeToSection.calledWith(
                oAppInfo,
                oSectionContext
            ), "\"_applyOrganizationChangeToSection\" was called with the expected arguments");
            assert.strictEqual(this.oVisualizationOrganizer.toggle.callCount, 0, "\"toggle\" should not be called when section context is defined");
            assert.strictEqual(this.oPagesService.addBookmarkToPage.callCount, 1, "\"addBookmarkToPage\" was called once");
            const aExpectedArgs = [
                oSectionContext.pageID,
                oExpectedBookmark,
                oSectionContext.sectionID
            ];
            assert.deepEqual(this.oPagesService.addBookmarkToPage.firstCall.args, aExpectedArgs, "\"addBookmarkToPage\" was called with the expected arguments");
            assert.strictEqual(bUpdate, true, "Promise should return true to update pun button status");

            assert.strictEqual(this.oSetBusyStub.firstCall.args[0], true, "busyState was set to true");
            assert.strictEqual(this.oSetBusyStub.secondCall.args[0], false, "busyState was set to false");
        });
    });

    QUnit.test("Remove bookmark tile from the section", function (assert) {
        // Arrange
        const oAppInfo = {
            icon: "sap-icon://accept",
            url: "https://sap.com",
            text: "SAP",
            subtitle: "website",
            bookmarkCount: 1
        };
        this.oGetObjectStub.returns(oAppInfo);
        const oEvent = { getSource: sandbox.stub().returns(this.oSource) };
        const oSectionContext = { pageID: "page_id", sectionID: "section_id" };

        const oExpectedIdentifier = {
            url: "https://sap.com"
        };

        sandbox.spy(this.oVisualizationOrganizer, "_applyBookmarkTileChangeToSection");
        sandbox.spy(this.oVisualizationOrganizer, "toggle");

        // Act
        return this.oVisualizationOrganizer.onHierarchyAppsPinButtonClick(oEvent, oSectionContext).then((bUpdate) => {
            // Assert
            assert.ok(this.oVisualizationOrganizer._applyBookmarkTileChangeToSection.calledWith(
                oAppInfo,
                oSectionContext
            ), "\"_applyOrganizationChangeToSection\" was called with the expected arguments");
            assert.strictEqual(this.oVisualizationOrganizer.toggle.callCount, 0, "\"toggle\" should not be called when section context is defined");
            assert.strictEqual(this.oPagesService.deleteBookmarks.callCount, 1, "\"deleteBookmarks\" was called once");
            const aExpectedArgs = [
                oExpectedIdentifier,
                oSectionContext.pageID,
                oSectionContext.sectionID
            ];
            assert.deepEqual(this.oPagesService.deleteBookmarks.firstCall.args, aExpectedArgs, "\"deleteBookmarks\" was called with the expected arguments");
            assert.strictEqual(bUpdate, true, "Promise should return true to update pun button status");

            assert.strictEqual(this.oSetBusyStub.firstCall.args[0], true, "busyState was set to true");
            assert.strictEqual(this.oSetBusyStub.secondCall.args[0], false, "busyState was set to false");
        });
    });

    QUnit.module("_applyBookmarkOrganizationChange", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oPagesService = {
                deleteBookmarks: sandbox.stub().resolves()
            };
            this.oGetServiceAsyncStub.withArgs("Pages").resolves(this.oPagesService);

            this.oBookmarkService = {
                addBookmark: sandbox.stub().returns(Promise.resolve())
            };
            this.oGetServiceAsyncStub.withArgs("BookmarkV2").resolves(this.oBookmarkService);

            this.oVisualizationOrganizer = new VisualizationOrganizer();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Remove bookmark visualizations", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const oAppInfo = {
            icon: "sap-icon://accept",
            url: "https://sap.com",
            text: "SAP",
            subtitle: "website",
            bookmarkCount: 1
        };

        const oVisualizationChanges = {
            deleteFromPageIds: ["page2"],
            addToPageIds: []
        };
        this.oVisualizationOrganizer.oVizInfo = oAppInfo;

        const oExpectedIdentifier = {
            url: oAppInfo.url
        };

        // Act
        this.oVisualizationOrganizer._applyBookmarkOrganizationChange(oVisualizationChanges).then(() => {
            // Assert
            assert.strictEqual(this.oBookmarkService.addBookmark.callCount, 0, "\"addBookmarks\" should not be called");
            assert.strictEqual(this.oPagesService.deleteBookmarks.callCount, 1, "\"deleteBookmarks\" should be called");
            const aExpectedArgs = [
                oExpectedIdentifier,
                "page2"
            ];
            assert.deepEqual(this.oPagesService.deleteBookmarks.firstCall.args, aExpectedArgs, "\"deleteBookmarks\" was called with the expected arguments");
            fnDone();
        });
    });

    QUnit.test("Add bookmark visualizations", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const oAppInfo = {
            icon: "sap-icon://accept",
            url: "https://sap.com",
            text: "SAP",
            subtitle: "website",
            bookmarkCount: 1
        };

        const oExpectedBookmark = {
            icon: "sap-icon://accept",
            url: "https://sap.com",
            title: "SAP",
            subtitle: "website"
        };
        const oExpectedContainer = {
            type: "Page",
            id: "page2",
            isContainer: true
        };

        const oVisualizationChanges = {
            addToPageIds: ["page2"],
            deleteFromPageIds: []
        };
        this.oVisualizationOrganizer.oVizInfo = oAppInfo;

        // Act
        this.oVisualizationOrganizer._applyBookmarkOrganizationChange(oVisualizationChanges).then(() => {
            // Assert
            assert.strictEqual(this.oBookmarkService.addBookmark.callCount, 1, "\"addBookmarks\" should be called");
            assert.strictEqual(this.oPagesService.deleteBookmarks.callCount, 0, "\"deleteBookmarks\" should not be called");
            assert.deepEqual(this.oBookmarkService.addBookmark.firstCall.args, [
                oExpectedBookmark,
                oExpectedContainer
            ], "\"addBookmarks\" was called with the expected arguments");
            fnDone();
        });
    });

    QUnit.test("Not called services if there is no changes", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const oAppInfo = {
            icon: "sap-icon://accept",
            url: "https://sap.com",
            text: "SAP",
            subtitle: "website",
            bookmarkCount: 0
        };
        this.oVisualizationOrganizer.oVizInfo = oAppInfo;
        const oVisualizationChanges = {
            addToPageIds: [],
            deleteFromPageIds: []
        };

        // Act
        this.oVisualizationOrganizer._applyBookmarkOrganizationChange(oVisualizationChanges).then(() => {
            // Assert
            assert.strictEqual(this.oBookmarkService.addBookmark.callCount, 0, "\"addBookmarks\" should not be called");
            assert.strictEqual(this.oPagesService.deleteBookmarks.callCount, 0, "\"deleteBookmarks\" should not be called");
            fnDone();
        });
    });

    QUnit.module("updateBookmarkCount", {
        beforeEach: function () {
            this.oPagesService = {
                _findBookmarks: sandbox.stub().resolves([])
            };
            sandbox.stub(Container, "getServiceAsync").withArgs("Pages").resolves(this.oPagesService);

            this.oVisualizationOrganizer = new VisualizationOrganizer();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("update bookmark count", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const aApps = [{
            url: "https://sap.com",
            text: "SAP"
        }, {
            url: "https://baz.com",
            text: "foo"
        }];

        this.oPagesService._findBookmarks.withArgs({ url: "https://sap.com" }).resolves([]);
        this.oPagesService._findBookmarks.withArgs({ url: "https://baz.com" }).resolves([{ pageId: "somePage" }]);

        const aExpected = [{
            url: "https://sap.com",
            text: "SAP",
            bookmarkCount: 0
        }, {
            url: "https://baz.com",
            text: "foo",
            bookmarkCount: 1
        }];

        // Act
        this.oVisualizationOrganizer.updateBookmarkCount(aApps).then((aResult) => {
            // Assert
            assert.deepEqual(aResult, aExpected, "bookmarkCount should be updated correctly");
            fnDone();
        });
    });

    QUnit.test("update bookmark count in section context", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const aApps = [{
            url: "https://sap.com",
            text: "SAP"
        }, {
            url: "https://baz.com",
            text: "foo"
        }];

        this.oPagesService._findBookmarks.withArgs({ url: "https://sap.com" }).resolves([{ pageId: "somePage", sectionId: "baz" }]);
        this.oPagesService._findBookmarks.withArgs({ url: "https://baz.com" }).resolves([{ pageId: "somePage", sectionId: "foo" }]);

        const oSectionContext = {
            pageID: "somePage",
            sectionID: "baz"
        };

        const aExpected = [{
            url: "https://sap.com",
            text: "SAP",
            bookmarkCount: 1
        }, {
            url: "https://baz.com",
            text: "foo",
            bookmarkCount: 0
        }];

        // Act
        this.oVisualizationOrganizer.updateBookmarkCount(aApps, oSectionContext).then((aResult) => {
            // Assert
            assert.deepEqual(aResult, aExpected, "bookmarkCount should be updated correctly");
            fnDone();
        });
    });

    QUnit.module("_applyChangeToPage", {
        beforeEach: function () {
            this.oPage = {
                id: "page1",
                title: "page1Title"
            };

            this.oVizInfo = {
                id: "vizId",
                title: "vizTitle"
            };

            this.oSource = {
                getBinding: sandbox.stub().returns({
                    refresh: sandbox.stub()
                })
            };

            this.oVisualizationOrganizer = new VisualizationOrganizer();

            this.oApplyBookmarkOrganizationChangeStub = sandbox.stub(this.oVisualizationOrganizer, "_applyBookmarkOrganizationChange").resolves();
            this.oApplyOrganizationChangeStub = sandbox.stub(this.oVisualizationOrganizer, "_applyOrganizationChange").resolves();
            this.oIsVizIdPresentedStub = sandbox.stub(this.oVisualizationOrganizer, "isVizIdPresent");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("add tile to the page", function (assert) {
        // Arrange
        const fnDone = assert.async();
        this.oIsVizIdPresentedStub.returns(false);
        const oExpectedChanges = {
            addToPageIds: [this.oPage.id],
            deleteFromPageIds: []
        };
        // Act
        this.oVisualizationOrganizer._applyChangeToPage(this.oSource, this.oVizInfo, this.oPage).then(() => {
            // Assert
            assert.deepEqual(this.oVisualizationOrganizer.oVizInfo, this.oVizInfo, "oVizInfo is defined");
            assert.strictEqual(this.oVisualizationOrganizer.sVisualizationId, this.oVizInfo.id, "sVisualizationId is defined");
            assert.strictEqual(this.oApplyBookmarkOrganizationChangeStub.callCount, 0, "_applyBookmarkOrganizationChange was not called");
            assert.strictEqual(this.oApplyOrganizationChangeStub.callCount, 1, "_applyOrganizationChange was called once");
            assert.deepEqual(this.oApplyOrganizationChangeStub.firstCall.args, [oExpectedChanges, false], "_applyOrganizationChange was called with correct parameters");
            assert.strictEqual(this.oIsVizIdPresentedStub.callCount, 1, "isVizIdPresent was called once");
            assert.deepEqual(this.oIsVizIdPresentedStub.firstCall.args, [this.oVizInfo.id], "isVizIdPresent was called with correct parameters");
            fnDone();
        });
    });

    QUnit.test("remove tile to the page", function (assert) {
        // Arrange
        const fnDone = assert.async();
        this.oIsVizIdPresentedStub.returns(true);
        const oExpectedChanges = {
            addToPageIds: [],
            deleteFromPageIds: [this.oPage.id]
        };
        // Act
        this.oVisualizationOrganizer._applyChangeToPage(this.oSource, this.oVizInfo, this.oPage).then(() => {
            // Assert
            assert.deepEqual(this.oVisualizationOrganizer.oVizInfo, this.oVizInfo, "oVizInfo is defined");
            assert.strictEqual(this.oVisualizationOrganizer.sVisualizationId, this.oVizInfo.id, "sVisualizationId is defined");
            assert.strictEqual(this.oApplyBookmarkOrganizationChangeStub.callCount, 0, "_applyBookmarkOrganizationChange was not called");
            assert.strictEqual(this.oApplyOrganizationChangeStub.callCount, 1, "_applyOrganizationChange was called once");
            assert.deepEqual(this.oApplyOrganizationChangeStub.firstCall.args, [oExpectedChanges, false], "_applyOrganizationChange was called with correct parameters");
            assert.strictEqual(this.oIsVizIdPresentedStub.callCount, 1, "isVizIdPresent was called once");
            assert.deepEqual(this.oIsVizIdPresentedStub.firstCall.args, [this.oVizInfo.id], "isVizIdPresent was called with correct parameters");
            fnDone();
        });
    });

    QUnit.test("add bookmark tile to the page", function (assert) {
        // Arrange
        const fnDone = assert.async();
        this.oVizInfo.isBookmark = true;
        this.oVizInfo.bookmarkCount = 0;

        const oExpectedChanges = {
            addToPageIds: [this.oPage.id],
            deleteFromPageIds: []
        };
        // Act
        this.oVisualizationOrganizer._applyChangeToPage(this.oSource, this.oVizInfo, this.oPage).then(() => {
            // Assert
            assert.deepEqual(this.oVisualizationOrganizer.oVizInfo, this.oVizInfo, "oVizInfo is defined");
            assert.strictEqual(this.oVisualizationOrganizer.sVisualizationId, this.oVizInfo.id, "sVisualizationId is defined");
            assert.strictEqual(this.oApplyBookmarkOrganizationChangeStub.callCount, 1, "_applyBookmarkOrganizationChange was not called");
            assert.deepEqual(this.oApplyBookmarkOrganizationChangeStub.firstCall.args, [oExpectedChanges, false], "_applyOrganizationChange was called with correct parameters");
            assert.strictEqual(this.oApplyOrganizationChangeStub.callCount, 0, "_applyOrganizationChange was called once");
            assert.strictEqual(this.oIsVizIdPresentedStub.callCount, 0, "isVizIdPresent was not called");
            fnDone();
        });
    });

    QUnit.test("remove bookmark tile to the page", function (assert) {
        // Arrange
        const fnDone = assert.async();
        this.oVizInfo.isBookmark = true;
        this.oVizInfo.bookmarkCount = 1;

        const oExpectedChanges = {
            addToPageIds: [],
            deleteFromPageIds: [this.oPage.id]
        };
        // Act
        this.oVisualizationOrganizer._applyChangeToPage(this.oSource, this.oVizInfo, this.oPage).then(() => {
            // Assert
            assert.deepEqual(this.oVisualizationOrganizer.oVizInfo, this.oVizInfo, "oVizInfo is defined");
            assert.strictEqual(this.oVisualizationOrganizer.sVisualizationId, this.oVizInfo.id, "sVisualizationId is defined");
            assert.strictEqual(this.oApplyBookmarkOrganizationChangeStub.callCount, 1, "_applyBookmarkOrganizationChange was not called");
            assert.deepEqual(this.oApplyBookmarkOrganizationChangeStub.firstCall.args, [oExpectedChanges, false], "_applyOrganizationChange was called with correct parameters");
            assert.strictEqual(this.oApplyOrganizationChangeStub.callCount, 0, "_applyOrganizationChange was called once");
            assert.strictEqual(this.oIsVizIdPresentedStub.callCount, 0, "isVizIdPresent was not called");
            fnDone();
        });
    });

    QUnit.module("groupBySpace", {
        beforeEach: function () {
            this.oVisualizationOrganizer = new VisualizationOrganizer();
            this.oGetPropertyStub = sandbox.stub();
            this.oGetPropertyStub.withArgs("spaceId").returns("SAP_BASIS_SP_UI_MYHOME");
            this.oGetPropertyStub.withArgs("space").returns("My Home");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns the a map with spaceId and spaceTitle", function (assert) {
        // Act
        const oResult = this.oVisualizationOrganizer.groupBySpace({
            getProperty: this.oGetPropertyStub
        });

        // Assert
        assert.deepEqual(oResult, {
            key: "SAP_BASIS_SP_UI_MYHOME",
            title: "My Home"
        }, "The spaceTitle was returned.");
    });

    QUnit.module("getGroupHeader", {
        beforeEach: function () {
            this.oVisualizationOrganizer = new VisualizationOrganizer();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns a GroupHeaderListItem with the correct title", function (assert) {
        // Act
        const oResult = this.oVisualizationOrganizer.getGroupHeader({
            key: "SAP_BASIS_SP_UI_MYHOME",
            title: "My Home"
        });

        // Assert
        assert.ok(oResult.isA("sap.m.GroupHeaderListItem"), "A GroupHeaderListItem was returned");
        assert.strictEqual(oResult.getTitle(), "My Home", "The title was set correctly");
    });
});
