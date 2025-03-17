// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.appfinder.VisualizationOrganizerHelper
 */
sap.ui.define([
    "sap/m/library",
    "sap/ui/core/Element",
    "sap/ushell/components/appfinder/VisualizationOrganizerHelper",
    "sap/ushell/components/visualizationOrganizer/Component",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/EventHub",
    "sap/ushell/Container"
], function (
    mobileLibrary,
    Element,
    VisualizationOrganizerHelper,
    VisualizationOrganizer,
    Config,
    Container,
    EventHub
) {
    "use strict";

    // shortcut for sap.m.ButtonType
    const ButtonType = mobileLibrary.ButtonType;

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox();

    QUnit.module("⚫ Spaces DISABLED", {
        beforeEach: function () {
            Config.emit("/core/spaces/enabled", false);
            this.oEventHubOffStub = sandbox.stub();
            sandbox.stub(EventHub, "on").returns({
                do: sandbox.stub().callsArgWith(0, "Shell-appFinder").returns({
                    off: this.oEventHubOffStub
                })
            });

            this.oAppFinderContextStubs = {
                formatPinButtonTooltip: sandbox.stub(),
                formatPinButtonSelectState: sandbox.stub(),
                formatPinButtonIcon: sandbox.stub(),
                formatPinButtonType: sandbox.stub(),
                getGroupContext: sandbox.stub(),
                getGroupNavigationContext: sandbox.stub(),
                _updateModelWithGroupContext: sandbox.stub(),
                getController_onTilePinButtonClick: sandbox.stub()
            };

            this.oVisualizationOrganizerStubs = {
                requestData: sandbox.stub(VisualizationOrganizer.prototype, "requestData")
            };

            this.oVisualizationOrganizerHelperStubs = {
                getCatalogView: sandbox.stub(Element, "getElementById").returns({ setBusy: sandbox.stub() })
            };
            this.oHierarchyAppContextStub = {
                showGroupListPopover: sandbox.stub(),
                updateBookmarkCount: sandbox.stub(),
                formatPinButtonTooltip: sandbox.stub()
            };
            this.oAppFinderContextStubs.getController = sandbox.stub().returns({
                onTilePinButtonClick: this.oAppFinderContextStubs.getController_onTilePinButtonClick
            });
            this.oVisualizationOrganizerHelper = VisualizationOrganizerHelper.getInstance();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("formatPinButtonTooltip", function (assert) {
        // Arrange
        const aGroupsIDs = [1, 2, 3];
        const oGroupContext = {
            id: "group1",
            path: "/groups/0",
            title: "Group 1"
        };
        const args = [
            aGroupsIDs,
            oGroupContext,
            "someVizId"
        ];

        // Act
        this.oVisualizationOrganizerHelper.formatPinButtonTooltip.apply(this.oAppFinderContextStubs, args);

        // Assert
        assert.deepEqual(this.oAppFinderContextStubs.formatPinButtonTooltip.args[0], [aGroupsIDs, oGroupContext],
            "The original handler was called with the array of group Ids and the group context");
    });

    QUnit.test("formatPinButtonSelectState", function (assert) {
        // Arrange
        const args = [
            [1, 2, 3],
            5,
            "/TEST/CONTEXT/PATH",
            "TEST-CONTEXT-ID"
        ];

        // Act
        this.oVisualizationOrganizerHelper.formatPinButtonSelectState.apply(this.oAppFinderContextStubs, args);

        // Assert
        assert.deepEqual(this.oAppFinderContextStubs.formatPinButtonSelectState.args[0], args,
            "The original handler was called with the original arguments");
    });

    QUnit.test("formatPinButtonIcon", function (assert) {
        // Arrange
        const args = ["vizId"];

        // Act
        const icon = this.oVisualizationOrganizerHelper.formatPinButtonIcon.apply(this.oAppFinderContextStubs, args);

        // Assert
        assert.strictEqual(icon, "sap-icon://pushpin-off", "The handler was called and returned the expected value");
    });

    QUnit.test("formatPinButtonType", function (assert) {
        // Arrange
        const args = ["vizId"];

        // Act
        const type = this.oVisualizationOrganizerHelper.formatPinButtonType.apply(this.oAppFinderContextStubs, args);

        // Assert
        assert.strictEqual(type, ButtonType.Default, "The handler was called and returned the expected value");
    });

    QUnit.test("onTilePinButtonClick", function (assert) {
        // Arrange
        const oEvent = { someEventProperties: "someValue" };

        // Act
        this.oVisualizationOrganizerHelper.onTilePinButtonClick.call(this.oAppFinderContextStubs, oEvent);

        // Assert
        assert.ok(this.oAppFinderContextStubs.getController_onTilePinButtonClick.calledOnceWith(oEvent),
            "The original handler was called with the original arguments");
    });

    QUnit.test("exit", function (assert) {
        // Act
        this.oVisualizationOrganizerHelper.exit();

        // Assert
        assert.notOk(this.oEventHubOffStub.calledOnce, "The EventHub doable \"off\" was NOT called");
    });

    QUnit.test("getNavigationContext", function (assert) {
        // Act
        this.oVisualizationOrganizerHelper.getNavigationContext.call(
            this.oAppFinderContextStubs,
            [1, 2, 3],
            5,
            "/TEST/CONTEXT/PATH",
            "TEST-CONTEXT-ID"
        );

        // Assert
        assert.ok(this.oAppFinderContextStubs.getGroupContext.calledOnce);
        assert.deepEqual(
            this.oAppFinderContextStubs.getGroupContext.firstCall.args,
            [
                [1, 2, 3],
                5,
                "/TEST/CONTEXT/PATH",
                "TEST-CONTEXT-ID"
            ],
            "The arguments should be transfered"
        );
    });

    QUnit.test("getNavigationContextAsText", function (assert) {
        // Act
        this.oVisualizationOrganizerHelper.getNavigationContextAsText.call(
            this.oAppFinderContextStubs,
            [1, 2, 3],
            5,
            "/TEST/CONTEXT/PATH",
            "TEST-CONTEXT-ID"
        );

        // Assert
        assert.ok(this.oAppFinderContextStubs.getGroupNavigationContext.calledOnce);
        assert.deepEqual(
            this.oAppFinderContextStubs.getGroupNavigationContext.firstCall.args,
            [
                [1, 2, 3],
                5,
                "/TEST/CONTEXT/PATH",
                "TEST-CONTEXT-ID"
            ],
            "The arguments should be transfered"
        );
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("updateModelWithContext", function (assert) {
        // Arrange
        const oSectionContext = {
            pageID: "some_page",
            sectionID: "some_section"
        };

        // Act
        this.oVisualizationOrganizerHelper.updateModelWithContext.call(
            this.oAppFinderContextStubs,
            oSectionContext
        );

        // Assert
        assert.ok(this.oAppFinderContextStubs._updateModelWithGroupContext.called);
        assert.deepEqual(this.oAppFinderContextStubs._updateModelWithGroupContext.firstCall.args, [oSectionContext], "The arguments should be transfered");
    });

    QUnit.test("onHierarchyAppsPinButtonClick", function (assert) {
        // Arrange
        const oEvent = { someEventProperties: "someValue" };

        // Act
        return this.oVisualizationOrganizerHelper.onHierarchyAppsPinButtonClick.call(this.oHierarchyAppContextStub, oEvent)
            .then((bUpdate) => {
                // Assert
                assert.ok(this.oHierarchyAppContextStub.showGroupListPopover.calledOnceWith(oEvent),
                    "The original handler was called with the original arguments");
                assert.equal(bUpdate, false, "Don't need aditional update of the pin button status");
            });
    });

    QUnit.test("updateBookmarkCount", function (assert) {
        // Arrange
        const aAppsData = [{ someProperties: "someValue" }];

        // Act
        this.oVisualizationOrganizerHelper.updateBookmarkCount.call(this.oHierarchyAppContextStub, aAppsData);

        // Assert
        assert.ok(this.oHierarchyAppContextStub.updateBookmarkCount.calledOnceWith(aAppsData),
            "The original handler was called with the original arguments");
    });

    QUnit.test("formatBookmarkPinButtonSelectState: return result based on the bookmarkCount", function (assert) {
        // Act
        let bSelectedState = this.oVisualizationOrganizerHelper.formatBookmarkPinButtonSelectState(0);

        // Assert
        assert.equal(bSelectedState, false, "Button is not selected if bookmarkCount is 0");

        // Act
        bSelectedState = this.oVisualizationOrganizerHelper.formatBookmarkPinButtonSelectState(1);

        // Assert
        assert.equal(bSelectedState, true, "Button is selected if bookmarkCount more than 0");
    });

    QUnit.test("formatBookmarkPinButtonIcon", function (assert) {
        // Act
        const sIcon = this.oVisualizationOrganizerHelper.formatBookmarkPinButtonIcon(0);

        // Assert
        assert.equal(sIcon, "sap-icon://pushpin-off", "Correct icon is returned");
    });

    QUnit.test("formatBookmarkPinButtonType", function (assert) {
        // Act
        const sType = this.oVisualizationOrganizerHelper.formatBookmarkPinButtonType(0);

        // Assert
        assert.equal(sType, "Default", "Correct button type is returned");
    });

    QUnit.test("formatBookmarkPinButtonTooltip", function (assert) {
        // Arrange
        const aGroupsIDs = [1, 2, 3];
        const args = [
            aGroupsIDs,
            0
        ];

        // Act
        this.oVisualizationOrganizerHelper.formatPinButtonTooltip.apply(this.oHierarchyAppContextStub, args);

        // Assert
        assert.deepEqual(this.oHierarchyAppContextStub.formatPinButtonTooltip.args[0], [aGroupsIDs, 0],
            "The original handler was called with the array of group Ids and the group context");
    });

    QUnit.test("shouldPinButtonBeVisible: resolves to enablePersonalization for the classic home page (enablePersonalization is false)", function (assert) {
        // Arrange
        Config.emit("/core/shell/enablePersonalization", false);

        // Act
        return this.oVisualizationOrganizerHelper.shouldPinButtonBeVisible().then((bVisible) => {
            // Assert
            assert.equal(bVisible, false, "shouldPinButtonBeVisible returns correct result");
        });
    });

    QUnit.test("shouldPinButtonBeVisible: resolves to enablePersonalization for the classic home page (enablePersonalization is true)", function (assert) {
        // Arrange
        Config.emit("/core/shell/enablePersonalization", true);

        // Act
        return this.oVisualizationOrganizerHelper.shouldPinButtonBeVisible().then((bVisible) => {
            // Assert
            assert.equal(bVisible, true, "shouldPinButtonBeVisible returns correct result");
        });
    });

    QUnit.test("loadAndUpdate: resolves the promise without calling requestData", function (assert) {
        // Act
        return this.oVisualizationOrganizerHelper.loadAndUpdate().then(() => {
            // Assert
            assert.strictEqual(this.oVisualizationOrganizerStubs.requestData.callCount, 0, "The promise was resolved and requestData was not called.");
        });
    });

    QUnit.module("🟢 Spaces ENABLED", {
        beforeEach: function () {
            this.oEventHubOffStub = sandbox.stub();
            sandbox.stub(EventHub, "on").returns({
                do: sandbox.stub().callsArgWith(0, "Shell-appFinder").returns({
                    off: this.oEventHubOffStub
                })
            });

            this.oVisualizationOrganizerStubs = {
                requestData: sandbox.stub(VisualizationOrganizer.prototype, "requestData"),
                setModel: sandbox.stub(VisualizationOrganizer.prototype, "setModel"),
                formatPinButtonTooltip: sandbox.stub(VisualizationOrganizer.prototype, "formatPinButtonTooltip"),
                formatPinButtonIcon: sandbox.stub(VisualizationOrganizer.prototype, "formatPinButtonIcon"),
                formatPinButtonType: sandbox.stub(VisualizationOrganizer.prototype, "formatPinButtonType"),
                onTilePinButtonClick: sandbox.stub(VisualizationOrganizer.prototype, "onTilePinButtonClick"),
                loadSectionContext: sandbox.stub(VisualizationOrganizer.prototype, "loadSectionContext"),
                onHierarchyAppsPinButtonClick: sandbox.stub(VisualizationOrganizer.prototype, "onHierarchyAppsPinButtonClick"),
                updateBookmarkCount: sandbox.stub(VisualizationOrganizer.prototype, "updateBookmarkCount"),
                formatBookmarkPinButtonTooltip: sandbox.stub(VisualizationOrganizer.prototype, "formatBookmarkPinButtonTooltip")
            };
            this.oAppFinderContextStubs = {
                formatPinButtonTooltip: sandbox.stub(),
                formatPinButtonSelectState: sandbox.stub(),
                formatPinButtonIcon: sandbox.stub(),
                formatPinButtonType: sandbox.stub(),
                getController_onTilePinButtonClick: sandbox.stub(),
                _updateShellHeader: sandbox.stub()
            };
            this.oHierarchyAppContextStub = {
                showGroupListPopover: sandbox.stub(),
                updateBookmarkCount: sandbox.stub(),
                formatPinButtonTooltip: sandbox.stub()
            };
            Config.emit("/core/spaces/enabled", true);



            this.oAppFinderContextStubs.getController = sandbox.stub().returns({
                onTilePinButtonClick: this.oAppFinderContextStubs.getController_onTilePinButtonClick
            });
            this.fnUpdateBindingStub = sandbox.stub();
            this.fnSetTitleStub = sandbox.stub();
            this.oAppFinderContextStubs.oView = {
                getModel: sandbox.stub().returns({
                    updateBindings: this.fnUpdateBindingStub
                }),
                oPage: {
                    setTitle: this.fnSetTitleStub
                }
            };
            this.oVisualizationOrganizerStubs.requestData.returns(Promise.resolve());
            this.oVisualizationOrganizerHelperStubs = {
                getCatalogView: sandbox.stub(Element, "getElementById").returns({ setBusy: sandbox.stub() })
            };
            this.oVisualizationOrganizerHelper = VisualizationOrganizerHelper.getInstance();
        },
        afterEach: function () {
            VisualizationOrganizerHelper.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("loadVisualizationOrganizer", function (assert) {
        // Arrange
        const fnDone = assert.async();

        // Act
        this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then((VisualizationOrganizer1) => {
            this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then((VisualizationOrganizer2) => {
                // Assert
                assert.strictEqual(typeof VisualizationOrganizer1, "object", "Resolves to an instance");
                assert.strictEqual(VisualizationOrganizer1, VisualizationOrganizer2, "Always resolves to the same instance");

                fnDone();
            });
        });
    });

    QUnit.test("setModel", function (assert) {
        // Arrange
        const oUpdateBindingsStub = sandbox.stub();
        VisualizationOrganizerHelper.destroy();
        const oHelper = VisualizationOrganizerHelper.getInstance();

        // Act
        oHelper.setModel({ updateBindings: oUpdateBindingsStub });
        return oHelper._loadVisualizationOrganizer()
            .then(this.oVisualizationOrganizerStubs.requestData)
            .then(() => {
                // Assert
                assert.ok(oUpdateBindingsStub.calledOnce, "\"updateBindings\" was called");
            });
    });

    QUnit.test("formatPinButtonTooltip", function (assert) {
        // Arrange
        const aGroupsIDs = [1, 2, 3];
        const oGroupContext = {
            id: "group1",
            path: "/groups/0",
            title: "Group 1"
        };
        const args = [
            aGroupsIDs,
            oGroupContext,
            "someVizId"
        ];

        // Act
        return this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(() => {
            this.oVisualizationOrganizerHelper.formatPinButtonTooltip.apply(this.oAppFinderContextStubs, args);

            // Assert
            assert.strictEqual(this.oAppFinderContextStubs.formatPinButtonTooltip.callCount, 0,
                "The original handler was not called.");
            assert.strictEqual(this.oVisualizationOrganizerStubs.formatPinButtonTooltip.args[0][0], "someVizId",
                "The call was forwarded to the VisualizationOrganizer with the vizId");
        });
    });

    QUnit.test("formatPinButtonSelectState", function (assert) {
        // Arrange
        const args = [
            [1, 2, 3],
            5,
            "/TEST/CONTEXT/PATH",
            "TEST-CONTEXT-ID"
        ];

        // Act
        const bState = this.oVisualizationOrganizerHelper.formatPinButtonSelectState.apply(this.oAppFinderContextStubs, args);

        // Assert
        assert.strictEqual(bState, false, "The handler was called and returned the expected value");
    });

    QUnit.test("formatPinButtonIcon: without section context", function (assert) {
        // Arrange
        const vizId = "VISUALIZATION_ID";

        // Act
        return this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(() => {
            this.oVisualizationOrganizerHelper.formatPinButtonIcon.call(this.oAppFinderContextStubs, vizId);

            // Assert
            assert.ok(this.oVisualizationOrganizerStubs.formatPinButtonIcon.calledOnceWith(vizId),
                "The call was forwarded to the VisualizationOrganizer with the original argument");
        });
    });

    QUnit.test("formatPinButtonIcon: with section context", function (assert) {
        // Arrange
        const vizId = "VISUALIZATION_ID";
        const oSectionContext = { pageId: "test_page" };

        // Act
        return this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(() => {
            this.oVisualizationOrganizerHelper._setSectionContext(oSectionContext);
            this.oVisualizationOrganizerHelper.formatPinButtonIcon.call(this.oAppFinderContextStubs, vizId);

            // Assert
            assert.ok(this.oVisualizationOrganizerStubs.formatPinButtonIcon.calledOnceWith(vizId, true),
                "The call was forwarded to the VisualizationOrganizer with the original argument");
        });
    });

    QUnit.test("formatPinButtonType: without section context", function (assert) {
        // Arrange
        const vizId = "VISUALIZATION_ID";

        // Act
        return this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(() => {
            this.oVisualizationOrganizerHelper.formatPinButtonType.call(this.oAppFinderContextStubs, vizId);

            // Assert
            assert.ok(this.oVisualizationOrganizerStubs.formatPinButtonType.calledOnceWith(vizId, false),
                "The call was forwarded to the VisualizationOrganizer with the original argument");
        });
    });

    QUnit.test("formatPinButtonType: with section context", function (assert) {
        // Arrange
        const vizId = "VISUALIZATION_ID";
        const oSectionContext = { pageId: "test_page" };

        // Act
        return this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(() => {
            this.oVisualizationOrganizerHelper._setSectionContext(oSectionContext);
            this.oVisualizationOrganizerHelper.formatPinButtonType.call(this.oAppFinderContextStubs, vizId);

            // Assert
            assert.ok(this.oVisualizationOrganizerStubs.formatPinButtonType.calledOnceWith(vizId, true),
                "The call was forwarded to the VisualizationOrganizer with the original argument");
        });
    });

    QUnit.test("onTilePinButtonClick: without section context", function (assert) {
        // Arrange
        const oTileData = { someProperty: "someValue" };
        const oProperty = { getProperty: sandbox.stub().returns(oTileData) };
        const oSource = { getBindingContext: sandbox.stub().returns(oProperty) };
        const oEvent = { getSource: sandbox.stub().returns(oSource) };

        // Act
        return this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(() => {
            this.oVisualizationOrganizerHelper.onTilePinButtonClick.call(this.oAppFinderContextStubs, oEvent);

            // Assert
            assert.ok(this.oVisualizationOrganizerStubs.onTilePinButtonClick.calledOnceWith(oEvent, null),
                "The call was forwarded to the VisualizationOrganizer with the original argument");
        });
    });

    QUnit.test("onTilePinButtonClick: with section context", function (assert) {
        // Arrange
        const oTileData = { someProperty: "someValue" };
        const oProperty = { getProperty: sandbox.stub().returns(oTileData) };
        const oSource = { getBindingContext: sandbox.stub().returns(oProperty) };
        const oEvent = { getSource: sandbox.stub().returns(oSource) };
        const oSectionContext = { pageId: "test_page" };

        // Act
        return this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(() => {
            this.oVisualizationOrganizerHelper._setSectionContext(oSectionContext);
            this.oVisualizationOrganizerHelper.onTilePinButtonClick.call(this.oAppFinderContextStubs, oEvent);

            // Assert
            assert.ok(this.oVisualizationOrganizerStubs.onTilePinButtonClick.calledOnceWith(oEvent, oSectionContext),
                "The call was forwarded to the VisualizationOrganizer with the original argument");
        });
    });

    QUnit.test("getNavigationContext returns pageId and sectionID as object", function (assert) {
        // Arrange
        const oContext = {
            pageID: "page_id1",
            pageTitle: "page_title",
            sectionID: "section_id1",
            sectionTitle: "section_title"
        };
        this.oVisualizationOrganizerHelper._setSectionContext(oContext);

        // Act
        const oResult = this.oVisualizationOrganizerHelper.getNavigationContext.call(this.oAppFinderContextStubs);

        // Assert
        assert.deepEqual(oResult, {
            pageID: oContext.pageID,
            sectionID: oContext.sectionID
        }, "Only page and section ids are returned");
    });

    QUnit.test("getNavigationContext returns null when there is no sessionContext", function (assert) {
        // Arrange
        this.oVisualizationOrganizerHelper._setSectionContext(null);

        // Act
        const oResult = this.oVisualizationOrganizerHelper.getNavigationContext.call(this.oAppFinderContextStubs);

        // Assert
        assert.equal(oResult, null, "getNavigationContext returns null when there is no sessionContext");
    });

    QUnit.test("getNavigationContextAsText returns string of pageId and sectionId", function (assert) {
        // Arrange
        const oContext = {
            pageID: "page_id1",
            pageTitle: "page_title",
            sectionID: "section_id1",
            sectionTitle: "section_title"
        };
        this.oVisualizationOrganizerHelper._setSectionContext(oContext);

        // Act
        const oResult = this.oVisualizationOrganizerHelper.getNavigationContextAsText.call(this.oAppFinderContextStubs);

        // Assert
        assert.deepEqual(oResult, JSON.stringify({
            pageID: oContext.pageID,
            sectionID: oContext.sectionID
        }), "Only page and section ids are returned");
    });

    QUnit.test("getNavigationContextAsText returns null when there is no sessionContext", function (assert) {
        // Arrange
        this.oVisualizationOrganizerHelper._setSectionContext(null);

        // Act
        const oResult = this.oVisualizationOrganizerHelper.getNavigationContextAsText.call(this.oAppFinderContextStubs);

        // Assert
        assert.equal(oResult, null, "getNavigationContextAsText returns null when there is no sessionContext");
    });

    QUnit.test("updateModelWithContext update the sectionContext", function (assert) {
        // Arrange
        const oSectionContext = {
            pageID: "some_page",
            pageTitle: "page_title",
            sectionID: "some_section",
            sectionTitle: "Test"
        };

        this.oVisualizationOrganizerStubs.loadSectionContext.returns(Promise.resolve(oSectionContext));

        // Act
        return this.oVisualizationOrganizerHelper.updateModelWithContext.call(this.oAppFinderContextStubs).then(() => {
            // Assert
            try {
                sandbox.assert.callOrder(this.fnUpdateBindingStub, this.fnSetTitleStub, this.oAppFinderContextStubs._updateShellHeader);
                assert.ok(true, "the function call order is correct");
            } catch (error) {
                assert.ok(false, "the function call order is not correct");
            }
            assert.deepEqual(this.oVisualizationOrganizerHelper.getNavigationContext.call(this.oAppFinderContextStubs), {
                pageID: oSectionContext.pageID,
                sectionID: oSectionContext.sectionID
            }, "Section context was updated");
        });
    });

    QUnit.test("updateModelWithContext: not update title, if there is not section context", function (assert) {
        // Arrange
        this.oVisualizationOrganizerStubs.loadSectionContext.returns(Promise.resolve(null));
        this.oVisualizationOrganizerHelper._setSectionContext({});

        // Act
        return this.oVisualizationOrganizerHelper.updateModelWithContext.call(this.oAppFinderContextStubs).then(() => {
            // Assert
            assert.ok(this.fnUpdateBindingStub.calledOnce, "binding should be updated with new context");
            assert.ok(this.fnSetTitleStub.notCalled, "The title should not be updated if context is null");
            assert.deepEqual(this.oVisualizationOrganizerHelper.getNavigationContext.call(this.oAppFinderContextStubs), null, "Section context was updated");
        });
    });

    QUnit.test("onHierarchyAppsPinButtonClick: without section context", function (assert) {
        // Arrange
        const oAppData = { someProperty: "someValue" };
        const oSource = {
            getParent: sandbox.stub().returns({
                getBinding: sandbox.stub().returns({
                    getContext: sandbox.stub().returns({
                        getObject: sandbox.stub().returns(oAppData)
                    })
                })
            })
        };
        const oEvent = { getSource: sandbox.stub().returns(oSource) };

        // Act
        return this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(() => {
            this.oVisualizationOrganizerHelper.onHierarchyAppsPinButtonClick.call(this.oHierarchyAppContextStub, oEvent);

            // Assert
            assert.strictEqual(this.oHierarchyAppContextStub.showGroupListPopover.callCount, 0,
                "The original handler was not called.");
            assert.ok(this.oVisualizationOrganizerStubs.onHierarchyAppsPinButtonClick.calledOnceWith(oEvent, null),
                "The call was forwarded to the VisualizationOrganizer with the original argument");
        });
    });

    QUnit.test("onHierarchyAppsPinButtonClick: with section context", function (assert) {
        // Arrange
        const oAppData = { someProperty: "someValue" };
        const oSource = {
            getParent: sandbox.stub().returns({
                getBinding: sandbox.stub().returns({
                    getContext: sandbox.stub().returns({
                        getObject: sandbox.stub().returns(oAppData)
                    })
                })
            })
        };
        const oEvent = { getSource: sandbox.stub().returns(oSource) };
        const oSectionContext = { pageId: "test_page" };

        // Act
        return this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(() => {
            this.oVisualizationOrganizerHelper._setSectionContext(oSectionContext);
            this.oVisualizationOrganizerHelper.onHierarchyAppsPinButtonClick.call(this.oHierarchyAppContextStub, oEvent);

            // Assert
            assert.strictEqual(this.oHierarchyAppContextStub.showGroupListPopover.callCount, 0,
                "The original handler was not called.");
            assert.ok(this.oVisualizationOrganizerStubs.onHierarchyAppsPinButtonClick.calledOnceWith(oEvent, oSectionContext),
                "The call was forwarded to the VisualizationOrganizer with the original argument");
        });
    });

    QUnit.test("formatBookmarkPinButtonSelectState", function (assert) {
        // Act
        const oResult = this.oVisualizationOrganizerHelper.formatBookmarkPinButtonSelectState(1);

        // Assert
        assert.equal(oResult, false, "formatBookmarkPinButtonSelectState return false for space mode");
    });

    QUnit.test("formatBookmarkPinButtonIcon: not bookmark tiles on pages", function (assert) {
        // Act
        const oResult = this.oVisualizationOrganizerHelper.formatBookmarkPinButtonIcon(0);

        // Assert
        assert.equal(oResult, "sap-icon://add", "return add button if bookmarkCount is 0");
    });

    QUnit.test("formatBookmarkPinButtonIcon: bookmark tiles were found on pages", function (assert) {
        // Act
        const oResult = this.oVisualizationOrganizerHelper.formatBookmarkPinButtonIcon(2);

        // Assert
        assert.equal(oResult, "sap-icon://accept", "return accept button if bookmarkCount is bigger 0");
    });

    QUnit.test("formatBookmarkPinButtonType: not bookmark tiles on pages", function (assert) {
        // Act
        const oResult = this.oVisualizationOrganizerHelper.formatBookmarkPinButtonType(0);

        // Assert
        assert.equal(oResult, "Default", "Default if bookmarkCount is 0");
    });

    QUnit.test("formatBookmarkPinButtonType: bookmark tiles were found on pages", function (assert) {
        // Act
        const oResult = this.oVisualizationOrganizerHelper.formatBookmarkPinButtonType(2);

        // Assert
        assert.equal(oResult, "Emphasized", "return Emphasized if bookmarkCount is bigger 0");
    });

    QUnit.test("updateBookmarkCount: without section context", function (assert) {
        // Arrange
        const aAppsData = [{ someProperty: "someValue" }];

        return this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(() => {
            // Act
            this.oVisualizationOrganizerHelper.updateBookmarkCount.call(this.oHierarchyAppContextStub, aAppsData);

            // Assert
            assert.strictEqual(this.oHierarchyAppContextStub.updateBookmarkCount.callCount, 0,
                "The original handler was not called.");
            assert.ok(this.oVisualizationOrganizerStubs.updateBookmarkCount.calledOnceWith(aAppsData, null),
                "The call was forwarded to the VisualizationOrganizer with the original argument");
        });
    });

    QUnit.test("updateBookmarkCount: with section context", function (assert) {
        // Arrange
        const aAppsData = [{ someProperty: "someValue" }];
        const oSectionContext = { pageId: "test_page" };

        return this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(() => {
            this.oVisualizationOrganizerHelper._setSectionContext(oSectionContext);

            // Act
            this.oVisualizationOrganizerHelper.updateBookmarkCount.call(this.oHierarchyAppContextStub, aAppsData);

            // Assert
            assert.strictEqual(this.oHierarchyAppContextStub.updateBookmarkCount.callCount, 0,
                "The original handler was not called.");
            assert.ok(this.oVisualizationOrganizerStubs.updateBookmarkCount.calledOnceWith(aAppsData, oSectionContext),
                "The call was forwarded to the VisualizationOrganizer with the original argument");
        });
    });

    QUnit.test("formatBookmarkPinButtonTooltip: forward request to component", function (assert) {
        // Act
        return this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(() => {
            this.oVisualizationOrganizerHelper.formatBookmarkPinButtonTooltip.call(this.oHierarchyAppContextStub, [], 3);

            // Assert
            assert.ok(this.oVisualizationOrganizerStubs.formatBookmarkPinButtonTooltip.calledOnceWith(3),
                "The call was forwarded to the VisualizationOrganizer");

        });
    });

    QUnit.test("shouldPinButtonBeVisible: resolves to true when personalization is enabled", function (assert) {
        // Arrange
        Config.emit("/core/shell/enablePersonalization", true);
        Config.emit("/core/spaces/myHome/enabled", false);

        // Act
        return this.oVisualizationOrganizerHelper.shouldPinButtonBeVisible().then((bVisible) => {
            // Assert
            assert.equal(bVisible, true, "shouldPinButtonBeVisible returns correct result");
        });
    });

    QUnit.test("shouldPinButtonBeVisible: resolves to false when personalization is disabled and My Home Space is disabled from admin side but enabled from user side", function (assert) {
        // Arrange
        sandbox.stub(Container, "getServiceAsync").withArgs("UserInfo").resolves({
            getUser: sandbox.stub().returns({
                getShowMyHome: sandbox.stub().returns(true)
            })
        });

        Config.emit("/core/shell/enablePersonalization", false);
        Config.emit("/core/spaces/myHome/enabled", false);
        // Act
        return this.oVisualizationOrganizerHelper.shouldPinButtonBeVisible().then((bVisible) => {
            // Assert
            assert.equal(bVisible, false, "shouldPinButtonBeVisible returns correct result");

        });

    });

    QUnit.test("shouldPinButtonBeVisible: resolves to false when personalization is disabled and My Home Space is disabled from admin and user side", function (assert) {
        // Arrange
        sandbox.stub(Container, "getServiceAsync").withArgs("UserInfo").resolves({
            getUser: sandbox.stub().returns({
                getShowMyHome: sandbox.stub().returns(false)
            })
        });
        Config.emit("/core/shell/enablePersonalization", false);
        Config.emit("/core/spaces/myHome/enabled", false);

        // Act
        return this.oVisualizationOrganizerHelper.shouldPinButtonBeVisible().then((bVisible) => {
            // Assert
            assert.equal(bVisible, false, "shouldPinButtonBeVisible returns correct result");
        });
    });

    QUnit.test("shouldPinButtonBeVisible: resolves to true when personalization is disabled and My Home Space is enabled from admin and user side", function (assert) {
        // Arrange
        sandbox.stub(Container, "getServiceAsync").withArgs("UserInfo").resolves({
            getUser: sandbox.stub().returns({
                getShowMyHome: sandbox.stub().returns(true)
            })
        });
        Config.emit("/core/shell/enablePersonalization", false);
        Config.emit("/core/spaces/myHome/enabled", true);

        // Act
        return this.oVisualizationOrganizerHelper.shouldPinButtonBeVisible().then((bVisible) => {
            // Assert
            assert.equal(bVisible, true, "shouldPinButtonBeVisible returns correct result");
        });
    });

    QUnit.test("shouldPinButtonBeVisible: resolves to false when personalization is disabled and My Home Space is enabled from admin side but disabled from user side", function (assert) {
        // Arrange
        sandbox.stub(Container, "getServiceAsync").withArgs("UserInfo").resolves({
            getUser: sandbox.stub().returns({
                getShowMyHome: sandbox.stub().returns(false)
            })
        });
        Config.emit("/core/shell/enablePersonalization", false);
        Config.emit("/core/spaces/myHome/enabled", true);

        // Act
        return this.oVisualizationOrganizerHelper.shouldPinButtonBeVisible().then((bVisible) => {
            // Assert
            assert.equal(bVisible, false, "shouldPinButtonBeVisible returns correct result");
        });
    });

    QUnit.test("loadAndUpdate: calls requestData", function (assert) {
        // Act
        return this.oVisualizationOrganizerHelper.loadAndUpdate().then(() => {
            // Assert
            assert.strictEqual(this.oVisualizationOrganizerStubs.requestData.callCount, 2, "requestData was called twice.");
        });
    });

    QUnit.test("exit", function (assert) {
        // Act
        VisualizationOrganizerHelper.destroy();

        // Assert
        assert.ok(this.oEventHubOffStub.calledOnce, "The EventHub doable \"off\" was called");
    });
});
