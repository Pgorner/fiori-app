// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.BookmarkV2
 */
sap.ui.define([
    "sap/ui/core/EventBus",
    "sap/ushell/services/BookmarkV2",
    "sap/ushell/Config",
    "sap/ushell/library",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container"
], (
    EventBus,
    Bookmark,
    Config,
    ushellLibrary,
    jQuery,
    Container
) => {
    "use strict";

    /* global QUnit, sinon */

    // shortcut for sap.ushell.ContentNodeType
    const ContentNodeType = ushellLibrary.ContentNodeType;

    const sandbox = sinon.createSandbox({});

    sinon.addBehavior("resolvesDeferred", (oStub, vValue) => {
        return oStub.returns(new jQuery.Deferred().resolve(vValue).promise());
    });
    sinon.addBehavior("rejectsDeferred", (oStub, vValue) => {
        if (typeof vValue === "string") {
            return oStub.returns(new jQuery.Deferred().reject(new Error(vValue)).promise());
        }
        return oStub.returns(new jQuery.Deferred().reject(vValue).promise());
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.module("sap.ushell.services.BookmarkV2", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync");

            this.oLaunchPageService = {
                addBookmark: sandbox.stub().resolvesDeferred(),
                onCatalogTileAdded: sandbox.stub(),
                updateBookmarks: sandbox.stub().returns({}),
                getGroups: sandbox.stub(),
                getGroupId: function (oGroup) {
                    return oGroup.id;
                },
                getGroupTitle: function (oGroup) {
                    return oGroup.title;
                },
                getCatalogData: function (oCatalog) {
                    return oCatalog.getCatalogData();
                },
                getCatalogId: function (oCatalog) {
                    return oCatalog.id;
                }
            };
            Container.getServiceAsync.withArgs("FlpLaunchPage").resolves(this.oLaunchPageService);

            const oAppStateService = {
                getPersistentWhenShared: sandbox.stub().returns(false),
                getSupportedPersistencyMethods: sandbox.stub().returns([])
            };
            Container.getServiceAsync.withArgs("AppState").resolves(oAppStateService);

            const oPagesService = {
                addBookmarkToPage: sandbox.stub()
            };
            Container.getServiceAsync.withArgs("Pages").resolves(oPagesService);

            const oReferenceResolver = {
                resolveSemanticDateRanges: sandbox.stub().returns({ hasSemanticDateRanges: false })
            };
            Container.getServiceAsync.withArgs("ReferenceResolver").resolves(oReferenceResolver);

            this.oBookmarkService = new Bookmark();

            this.oConfigStub = sandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("addBookmarkByGroupId while personalization is disabled", async function (assert) {
        // Arrange
        this.oLaunchPageService.getGroups = sandbox.stub().resolvesDeferred([
            { id: "default" },
            { id: "group_0" }
        ]);
        const oBookmarkConfig = {
            title: "AddedById",
            url: "#FioriToExtAppTarget-Action"
        };

        // Act
        await this.oBookmarkService.addBookmarkByGroupId(oBookmarkConfig, "group_0");

        // Assert
        assert.strictEqual(this.oLaunchPageService.addBookmark.callCount, 0, "The function addBookmark has not been called.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("addBookmarkByGroupId while personalization is enabled", async function (assert) {
        // Arrange
        const oBookmarkConfig = {
            title: "AddedById",
            url: "#FioriToExtAppTarget-Action"
        };
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);

        this.oLaunchPageService.getGroups.resolvesDeferred([
            { id: "default" },
            { id: "group_0" }
        ]);

        // Act
        await this.oBookmarkService.addBookmarkByGroupId(oBookmarkConfig, "group_0");

        // Assert
        assert.strictEqual(this.oLaunchPageService.addBookmark.callCount, 1, "The function addBookmark has been called once.");
        assert.ok(this.oLaunchPageService.addBookmark.calledWith(oBookmarkConfig), "The function addBookmark has been called with the correct configuration.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Passes the contentProviderId when provided", async function (assert) {
        // Arrange
        const oBookmarkConfig = {
            title: "AddedById",
            url: "#FioriToExtAppTarget-Action"
        };
        const aGroups = [
            { id: "default" },
            { id: "group_0" }
        ];
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);

        this.oLaunchPageService.getGroups = sandbox.stub().resolvesDeferred(aGroups);

        // Act
        await this.oBookmarkService.addBookmarkByGroupId(oBookmarkConfig, "group_0", "MyContentProvider");

        // Assert
        assert.strictEqual(this.oLaunchPageService.addBookmark.callCount, 1, "LaunchPageService.addBookmark was called once");
        assert.deepEqual(this.oLaunchPageService.addBookmark.getCall(0).args[0], oBookmarkConfig, "was called with the correct config");
        assert.strictEqual(this.oLaunchPageService.addBookmark.getCall(0).args[1], aGroups[1], "was called with the correct group");
        assert.strictEqual(this.oLaunchPageService.addBookmark.getCall(0).args[2], "MyContentProvider", "was called with the correct contentProviderId");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("getGroupsIdsForBookmarks", async function (assert) {
        this.oLaunchPageService.getGroupsForBookmarks = sandbox.stub().resolvesDeferred([
            { id: "1", title: "group1", object: { id: 1, title: "group1" } },
            { id: "2", title: "group2", object: { id: 2, title: "group2" } },
            { id: "3", title: "group3", object: { id: 3, title: "group3" } }
        ]);

        const aGroups = await this.oBookmarkService.getShellGroupIDs();

        assert.strictEqual(aGroups.length, 3, "groups were filtered correctly");
        assert.deepEqual(aGroups[0], { id: 1, title: "group1" });
        assert.deepEqual(aGroups[1], { id: 2, title: "group2" });
        assert.deepEqual(aGroups[2], { id: 3, title: "group3" });
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("'addBookmarkByGroupId' returns a rejected promise in spaces mode", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);

        // Act
        try {
            await this.oBookmarkService.addBookmarkByGroupId();

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(oError.message, "Bookmark Service: The API 'addBookmarkByGroupId' is not supported in launchpad spaces mode.", "The Promise has been rejected");
        }
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("'getShellGroupIDs' returns a rejected promise in spaces mode", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);

        // Act
        try {
            await this.oBookmarkService.getShellGroupIDs();

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(oError.message, "Bookmark Service: The API 'getShellGroupIDs' is not supported in launchpad spaces mode.", "The Promise has been rejected");
        }
    });

    QUnit.module("The constructor", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync");

            Container.getServiceAsync.withArgs("Pages").resolves();
            Container.getServiceAsync.withArgs("FlpLaunchPage").resolves();

            this.oConfigStub = sandbox.stub(Config, "last");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Requesting the service works", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);

        // Act
        const oService = new Bookmark();

        // Assert
        assert.notStrictEqual(oService, undefined, "The service is there");
    });


    QUnit.module("The function 'addBookmarkToPage'", {
        beforeEach: function () {
            this.oAddBookmarkToPageStub = sandbox.stub();
            sandbox.stub(Container, "getServiceAsync").withArgs("Pages").resolves({
                addBookmarkToPage: this.oAddBookmarkToPageStub
            });

            this.oConfigStub = sandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns a rejected promise in the launchpad home page mode", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);

        // Act
        try {
            await this.oBookmarkService.addBookmarkToPage();

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(oError.message,
                "Bookmark Service: 'addBookmarkToPage' is not valid in launchpad home page mode, use 'addBookmark' instead.",
                "The Promise has been rejected with the predefined error message.");
        }
    });

    QUnit.test("Returns a rejected promise when personalization is not enabled", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);

        // Act
        try {
            await this.oBookmarkService.addBookmarkToPage();

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(oError.message,
                "Bookmark Service: Add bookmark is not allowed as the personalization functionality is not enabled.",
                "The Promise has been rejected with the predefined error message.");
        }
    });

    QUnit.test("Returns a rejected promise when personalization and myHome are not enabled", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(false);
        this.oConfigStub.withArgs("/core/spaces/myHome/myHomePageId").returns("myHomePageId");

        // Act
        try {
            await this.oBookmarkService.addBookmarkToPage({}, "myHomePageId");

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(oError.message,
                "Bookmark Service: Add bookmark is not allowed as the personalization functionality is not enabled.",
                "The Promise has been rejected with the predefined error message.");
        }
    });

    QUnit.test("Returns a rejected promise when personalization is disabled, myHome is enabled and pageId is not myHomePageId", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(true);
        this.oConfigStub.withArgs("/core/spaces/myHome/myHomePageId").returns("myHomePageId");

        // Act
        try {
            await this.oBookmarkService.addBookmarkToPage({}, "notMyHomePageId");

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(oError.message,
                "Bookmark Service: Add bookmark is not allowed as the personalization functionality is not enabled.",
                "The Promise has been rejected with the predefined error message.");
        }
    });

    QUnit.test("Returns a rejected promise if invalid bookmark data is passed", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);

        // Act
        try {
            await this.oBookmarkService.addBookmarkToPage({}, "pageId");

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(oError.message,
                "Bookmark Service - Invalid bookmark data.",
                "The Promise has been rejected with the predefined error message.");
        }
    });

    QUnit.test("Returns a resolved promise when the configurations are correctly set", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);

        const oParams = { title: "bookmark-title", url: "bookmark-url" };
        const sPageId = "pageId";

        // Act
        await this.oBookmarkService.addBookmarkToPage(oParams, sPageId);

        // Assert
        assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 1, "The addBookmarkToPage of the pages service is called once.");
        assert.deepEqual(this.oAddBookmarkToPageStub.firstCall.args, [sPageId, oParams, undefined, undefined],
            "The addBookmarkToPage of the pages service is called with right parameters.");
    });

    QUnit.test("Passes the contentProviderId on when provided", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);

        const oParams = { title: "bookmark-title", url: "bookmark-url" };
        const sPageId = "pageId";

        // Act
        await this.oBookmarkService.addBookmarkToPage(oParams, sPageId, "myContentProvider");

        // Assert
        assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 1, "The addBookmarkToPage of the pages service is called once.");
        assert.deepEqual(this.oAddBookmarkToPageStub.firstCall.args, [sPageId, oParams, undefined, "myContentProvider"],
            "The addBookmarkToPage of the pages service is called with right parameters.");
    });

    QUnit.test("Returns a resolved promise for myHome page if personalization is disabled", async function (assert) {
        // Arrange
        const oParams = { title: "bookmark-title", url: "bookmark-url" };
        const sPageId = "myHomePageId";

        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(true);
        this.oConfigStub.withArgs("/core/spaces/myHome/myHomePageId").returns(sPageId);

        // Act
        await this.oBookmarkService.addBookmarkToPage(oParams, sPageId);

        // Assert
        assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 1, "The addBookmarkToPage of the pages service is called once.");
        assert.deepEqual(this.oAddBookmarkToPageStub.firstCall.args, [sPageId, oParams, undefined, undefined], "The addBookmarkToPage of the pages service is called with right parameters.");
    });

    QUnit.module("The function 'addBookmark'", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync");
            this.oConfigStub = sandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);
            this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);

            this.oGetDefaultSpaceStub = sandbox.stub().resolves({
                children: [{
                    id: "myId",
                    label: "myTitle",
                    type: ContentNodeType.Page,
                    isContainer: true,
                    children: []
                }]
            });

            this.oBookmarkMock = { id: "SomeId", title: "Some Title", url: "#" };

            const oAppStateService = {
                getPersistentWhenShared: sandbox.stub().returns(false),
                getSupportedPersistencyMethods: sandbox.stub().returns([])
            };
            Container.getServiceAsync.withArgs("AppState").resolves(oAppStateService);

            const oMenuService = {
                getDefaultSpace: this.oGetDefaultSpaceStub
            };
            Container.getServiceAsync.withArgs("Menu").resolves(oMenuService);

            this.oReferenceResolverService = {
                hasSemanticDateRanges: sandbox.stub().returns(false)
            };
            Container.getServiceAsync.withArgs("ReferenceResolver").resolves(this.oReferenceResolverService);

            this.oBookmarkService = new Bookmark();

            /**
             * @deprecated As of version 1.120
             */
            this.oAddBookmarkToHomepageGroupStub = sandbox.stub(this.oBookmarkService, "addBookmarkToHomepageGroup").resolves();
            this.oAddBookmarkToContentNodesStub = sandbox.stub(this.oBookmarkService, "_addBookmarkToContentNodes").resolves();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves the promise without adding a bookmark if the personalization is disabled", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);

        // Act
        await this.oBookmarkService.addBookmark();

        // Assert
        /**
         * @deprecated As of version 1.120
         */
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
        assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 0, "'_addBookmarkToContentNodes' wasn't called.");
    });

    QUnit.test("Resolves the promise without adding a bookmark if the personalization is disabled, the space is enabled and myHome is disabled", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);
        this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(false);

        // Act
        await this.oBookmarkService.addBookmark();

        // Assert
        /**
         * @deprecated As of version 1.120
         */
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
        assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 0, "'_addBookmarkToContentNodes' wasn't called.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Adds the bookmark to the default group in classic homepage scenario if container wasn't provided", async function (assert) {
        // Act
        await this.oBookmarkService.addBookmark(this.oBookmarkMock, undefined);

        // Assert
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
        assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 0, "'_addBookmarkToContentNodes' wasn't called.");
        assert.deepEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], undefined, "'addBookmarkToHomepageGroup' was called with the right group.");
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[2], false, "'addBookmarkToHomepageGroup' was called as standard bookmark");
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[3], undefined, "'addBookmarkToHomepageGroup' was called without a contentProviderId.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Adds the bookmark to a classic homepage group if the provided container is a legacy Launchpage group object", async function (assert) {
        // Arrange
        const oLaunchpageGroup = { id: "group1", title: "Group 1" };

        // Act
        await this.oBookmarkService.addBookmark(this.oBookmarkMock, oLaunchpageGroup);

        // Assert
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
        assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 0, "'_addBookmarkToContentNodes' wasn't called.");
        assert.deepEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], oLaunchpageGroup, "'addBookmarkToHomepageGroup' was called with the right group.");
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[2], false, "'addBookmarkToHomepageGroup' was called as standard bookmark");
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[3], undefined, "'addBookmarkToHomepageGroup' was called without a contentProviderId.");
    });

    QUnit.test("Adds the bookmark to the provided content node", async function (assert) {
        // Arrange
        const oContentNode = {
            id: "page1",
            label: "Page 1",
            type: ContentNodeType.Page,
            isContainer: true
        };

        // Act
        await this.oBookmarkService.addBookmark(this.oBookmarkMock, oContentNode);

        // Assert
        /**
         * @deprecated As of version 1.120
         */
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
        assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 1, "'_addBookmarkToContentNodes' was called exactly once.");
        assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[0], this.oBookmarkMock, "'_addBookmarkToContentNodes' was called with the right bookmark.");
        assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[1], [oContentNode], "'_addBookmarkToContentNodes' was called with the right content nodes.");
        assert.strictEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[2], false, "'_addBookmarkToContentNodes' was called as standard bookmark");
        assert.strictEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[3], undefined, "'_addBookmarkToContentNodes' was called without a contentProviderId.");
    });

    QUnit.test("Passes the contentProviderId when provided for a ContentNode", async function (assert) {
        // Arrange
        const oContentNode = {
            id: "page1",
            label: "Page 1",
            type: ContentNodeType.Page,
            isContainer: true
        };

        // Act
        await this.oBookmarkService.addBookmark(this.oBookmarkMock, oContentNode, "MyContentProvider");

        // Assert
        assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 1, "'_addBookmarkToContentNodes' was called exactly once.");
        assert.strictEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[2], false, "'_addBookmarkToContentNodes' was called as standard bookmark");
        assert.strictEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[3], "MyContentProvider", "'_addBookmarkToContentNodes' was called with the provided contentProviderId.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Passes the contentProviderId when provided for the default group in classic homepage", async function (assert) {
        // Act
        await this.oBookmarkService.addBookmark(this.oBookmarkMock, undefined, "MyContentProvider");

        // Assert
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
        assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 0, "'_addBookmarkToContentNodes' wasn't called.");
        assert.deepEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], undefined, "'addBookmarkToHomepageGroup' was called with the right group.");
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[2], false, "'addBookmarkToHomepageGroup' was called as standard bookmark");
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[3], "MyContentProvider", "'addBookmarkToHomepageGroup' was called with the right contentProviderId.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Passes the contentProviderId when provided for the legacy Launchpage group in classic homepage", async function (assert) {
        // Arrange
        const oLaunchpageGroup = { id: "group1", title: "Group 1" };

        // Act
        await this.oBookmarkService.addBookmark(this.oBookmarkMock, oLaunchpageGroup, "MyContentProvider");

        // Assert
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
        assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 0, "'_addBookmarkToContentNodes' wasn't called.");
        assert.deepEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], oLaunchpageGroup, "'addBookmarkToHomepageGroup' was called with the right group.");
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[2], false, "'addBookmarkToHomepageGroup' was called as standard bookmark");
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[3], "MyContentProvider", "'addBookmarkToHomepageGroup' was called with the right contentProviderId.");
    });

    QUnit.test("Adds the bookmark to multiple provided content nodes", async function (assert) {
        // Arrange
        const aContentNodes = [{
            id: "page1",
            label: "Page 1",
            type: ContentNodeType.Page,
            isContainer: true
        }, {
            id: "page2",
            label: "Page 2",
            type: ContentNodeType.Page,
            isContainer: true
        }];

        // Act
        await this.oBookmarkService.addBookmark(this.oBookmarkMock, aContentNodes);

        // Assert
        /**
         * @deprecated As of version 1.120
         */
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
        assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 1, "'_addBookmarkToContentNodes' was called exactly once.");
        assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[0], this.oBookmarkMock, "'_addBookmarkToContentNodes' was called with the right bookmark.");
        assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[1], aContentNodes, "'_addBookmarkToContentNodes' was called with the right content nodes.");
    });

    QUnit.test("Adds the bookmark to the defaultPage if no content node was provided and spaces mode is active", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);
        const oExpectedContentNode = {
            id: "myId",
            label: "myTitle",
            type: ContentNodeType.Page,
            isContainer: true,
            children: []
        };

        // Act
        await this.oBookmarkService.addBookmark(this.oBookmarkMock, undefined);

        // Assert
        /**
         * @deprecated As of version 1.120
         */
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
        assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 1, "'_addBookmarkToContentNodes' was called exactly once.");
        assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[0], this.oBookmarkMock, "'_addBookmarkToContentNodes' was called with the right bookmark.");
        assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[1], [oExpectedContentNode], "'_addBookmarkToContentNodes' was called with the right content nodes.");
    });

    QUnit.test("Adds the bookmark if personalization is disabled, spaces mode and myHome are active", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);
        this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(true);
        const oExpectedContentNode = {
            id: "myId",
            label: "myTitle",
            type: ContentNodeType.Page,
            isContainer: true,
            children: []
        };

        // Act
        await this.oBookmarkService.addBookmark(this.oBookmarkMock, undefined);

        // Assert
        /**
         * @deprecated As of version 1.120
         */
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
        assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 1, "'_addBookmarkToContentNodes' was called exactly once.");
        assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[0], this.oBookmarkMock, "'_addBookmarkToContentNodes' was called with the right bookmark.");
        assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[1], [oExpectedContentNode], "'_addBookmarkToContentNodes' was called with the right content nodes.");
    });

    QUnit.test("Rejects the promise if the bookmark couldn't be added to a content node", async function (assert) {
        // Arrange
        this.oAddBookmarkToContentNodesStub.rejects("ContentNode 'page1' couldn't be saved.");

        const oContentNode = {
            id: "page1",
            label: "Page 1",
            type: ContentNodeType.Page,
            isContainer: true
        };

        // Act
        try {
            await this.oBookmarkService.addBookmark(this.oBookmarkMock, oContentNode);

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            /**
             * @deprecated As of version 1.120
             */
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 1, "'_addBookmarkToContentNodes' was called exactly once.");
            assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[0], this.oBookmarkMock, "'_addBookmarkToContentNodes' was called with the right bookmark.");
            assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[1], [oContentNode], "'_addBookmarkToContentNodes' was called with the right content nodes.");

            assert.strictEqual(oError.toString(), "ContentNode 'page1' couldn't be saved.", "The promise was rejected with the correct error message.");
        }
    });

    QUnit.test("Rejects the promise if no bookmark parameters are provided", async function (assert) {
        // Act
        try {
            await this.oBookmarkService.addBookmark();

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(oError.message, "Invalid Bookmark Data: No bookmark parameters passed.", "The promise was rejected with an error message.");
        }
    });

    QUnit.test("Rejects the promise if a data source with an invalid type is provided in the bookmark parameters", async function (assert) {
        // Arrange
        this.oBookmarkMock.dataSource = {
            type: "AData",
            settings: {
                odataVersion: "4.0"
            }
        };

        // Act
        try {
            await this.oBookmarkService.addBookmark(this.oBookmarkMock);

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(oError.message, "Invalid Bookmark Data: Unknown data source type: AData", "The promise was rejected with an error message.");
        }
    });

    QUnit.test("Rejects the promise if a data source without a type is provided in the bookmark parameters", async function (assert) {
        // Arrange
        this.oBookmarkMock.dataSource = {
            settings: {
                odataVersion: "4.0"
            }
        };

        // Act
        try {
            await this.oBookmarkService.addBookmark(this.oBookmarkMock);

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(oError.message, "Invalid Bookmark Data: Unknown data source type: undefined", "The promise was rejected with an error message.");
        }
    });

    QUnit.test("Rejects the promise if a data source with an invalid OData version is provided in the bookmark parameters", async function (assert) {
        // Arrange
        this.oBookmarkMock.dataSource = {
            type: "OData",
            settings: {
                odataVersion: "3.0"
            }
        };

        // Act
        try {
            await this.oBookmarkService.addBookmark(this.oBookmarkMock);

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(oError.message, "Invalid Bookmark Data: Unknown OData version in the data source: 3.0", "The promise was rejected with an error message.");
        }
    });

    QUnit.test("Rejects the promise if a data source without OData version is provided in the bookmark parameters", async function (assert) {
        // Arrange
        this.oBookmarkMock.dataSource = {
            type: "OData",
            settings: {
            }
        };

        // Act
        try {
            await this.oBookmarkService.addBookmark(this.oBookmarkMock);

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(oError.message, "Invalid Bookmark Data: Unknown OData version in the data source: undefined", "The promise was rejected with an error message.");
        }
    });

    QUnit.test("Rejects the promise if a data source without settings is provided in the bookmark parameters", async function (assert) {
        // Arrange
        this.oBookmarkMock.dataSource = {
            type: "OData"
        };

        // Act
        try {
            await this.oBookmarkService.addBookmark(this.oBookmarkMock);

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(oError.message, "Invalid Bookmark Data: Unknown OData version in the data source: undefined", "The promise was rejected with an error message.");
        }
    });

    QUnit.test("Rejects the promise if a service URL with semantic date ranges but without data source is provided in the bookmark parameters", async function (assert) {
        // Arrange
        this.oBookmarkMock.serviceUrl = "/a/url/$count?&$filter=(testDate eq {Edm.DateTimeOffset%%DynamicDate.YESTERDAY%%})";
        this.oReferenceResolverService.hasSemanticDateRanges.withArgs(this.oBookmarkMock.serviceUrl).returns(true);

        // Act
        try {
            await this.oBookmarkService.addBookmark(this.oBookmarkMock);

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(oError.message, "Invalid Bookmark Data: Provide a data source to use semantic date ranges.", "The promise was rejected with an error message.");
        }
    });

    QUnit.test("Adds the bookmark if a service URL without semantic date ranges and no data source are provided in the bookmark data", async function (assert) {
        // Arrange
        const oContentNode = {
            id: "page1",
            label: "Page 1",
            type: ContentNodeType.Page,
            isContainer: true
        };
        this.oBookmarkMock.serviceUrl = "/a/url/$count";

        // Act
        await this.oBookmarkService.addBookmark(this.oBookmarkMock, oContentNode);

        // Assert
        assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 1, "'_addBookmarkToContentNodes' was called exactly once.");
    });

    QUnit.module("The function '_addBookmarkToContentNodes'", {
        beforeEach: function () {
            this.oMockGroups = {
                group1: { id: "group1", title: "Group One" },
                group2: { id: "group2", title: "Group Two" }
            };

            this.oBookmarkMock = { id: "SomeId", title: "Some Title" };

            this.oGetGroupByIdStub = sandbox.stub().callsFake((sGroupId) => {
                return new jQuery.Deferred().resolve(this.oMockGroups[sGroupId]).promise();
            });

            sandbox.stub(Container, "getServiceAsync").withArgs("FlpLaunchPage").resolves({
                getGroupById: this.oGetGroupByIdStub
            });

            this.oBookmarkService = new Bookmark();

            /**
             * @deprecated As of version 1.120
             */
            this.oAddBookmarkToHomepageGroupStub = sandbox.stub(this.oBookmarkService, "addBookmarkToHomepageGroup").resolves();
            this.oAddBookmarkToPageStub = sandbox.stub(this.oBookmarkService, "addBookmarkToPage").resolves();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Adds the bookmark to a page if the provided content node type is 'Page'", async function (assert) {
        // Arrange
        const oContentNode = {
            id: "page1",
            label: "Page 1",
            type: ContentNodeType.Page,
            isContainer: true
        };

        // Act
        await this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]);

        // Assert
        /**
         * @deprecated As of version 1.120
         */
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
        assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 1, "'addBookmarkToPage' was called exactly once.");
        assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToPage' was called with the right bookmark.");
        assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[1], "page1", "'addBookmarkToPage' was called with the right page id.");
        assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[2], undefined, "'addBookmarkToPage' was called without content provider id.");
    });

    QUnit.test("Passes the contentProviderId param on when provided", async function (assert) {
        // Arrange
        const oContentNode = {
            id: "page1",
            label: "Page 1",
            type: ContentNodeType.Page,
            isContainer: true
        };

        // Act
        await this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode], undefined, "myContentProvider");

        // Assert
        assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[2], "myContentProvider", "'addBookmarkToPage' was called with the content provider id.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Adds the bookmark to a classic homepage group if the provided content node type is 'HomepageGroup'", async function (assert) {
        // Arrange
        const oContentNode = {
            id: "group1",
            label: "Group 1",
            type: ContentNodeType.HomepageGroup,
            isContainer: true
        };

        // Act
        await this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]);

        // Assert
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
        assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 0, "'addBookmarkToPage' wasn't called.");
        assert.strictEqual(this.oGetGroupByIdStub.firstCall.args[0], "group1", "'getGroupById' of the launchpage service was called with the right group id.");
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], this.oMockGroups.group1, "'addBookmarkToHomepageGroup' was called with the right launchpage group.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Adds the bookmark to multiple content nodes if multiple content nodes were provided", async function (assert) {
        // Arrange
        const aContentNodes = [{
            id: "group1",
            label: "Group 1",
            type: ContentNodeType.HomepageGroup,
            isContainer: true
        }, {
            id: "page1",
            label: "Page 1",
            type: ContentNodeType.Page,
            isContainer: true
        }];

        // Act
        await this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, aContentNodes);

        // Assert
        // HomepageGroup (first content node)
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
        assert.strictEqual(this.oGetGroupByIdStub.firstCall.args[0], "group1", "'getGroupById' of the launchpage service was called with the right group id.");
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
        assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], this.oMockGroups.group1, "'addBookmarkToHomepageGroup' was called with the right launchpage group.");

        // Page (second content node)
        assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 1, "'addBookmarkToPage' was called exactly once.");
        assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToPage' was called with the right bookmark.");
        assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[1], "page1", "'addBookmarkToPage' was called with the right page id.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Rejects the promise if a content node of type 'HomepageGroup' couldn't be saved", async function (assert) {
        // Arrange
        this.oAddBookmarkToHomepageGroupStub.rejects("Error while adding content node of type 'HomepageGroup'");

        const oContentNode = {
            id: "group1",
            label: "Group 1",
            type: ContentNodeType.HomepageGroup,
            isContainer: true
        };

        // Act
        try {
            await this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]);

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(oError.toString(), "Error while adding content node of type 'HomepageGroup'", "The promise was rejected with the correct error message.");

            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
            assert.strictEqual(this.oGetGroupByIdStub.firstCall.args[0], "group1", "'getGroupById' of the launchpage service was called with the right group id.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], this.oMockGroups.group1, "'addBookmarkToHomepageGroup' was called with the right launchpage group.");
        }
    });

    QUnit.test("Rejects the promise if a content node of type 'Page' couldn't be saved", async function (assert) {
        // Arrange
        this.oAddBookmarkToPageStub.rejects("Error while adding content node of type 'Page'");

        const oContentNode = {
            id: "page1",
            label: "Page 1",
            type: ContentNodeType.Page,
            isContainer: true
        };

        // Act
        try {
            await this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]);

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(oError.toString(), "Error while adding content node of type 'Page'", "The promise was rejected with the correct error message.");

            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 1, "'addBookmarkToPage' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToPage' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[1], "page1", "'addBookmarkToPage' was called with the right page id.");
        }
    });

    QUnit.test("Rejects the promise if the provided content node type is not supported", async function (assert) {
        // Arrange
        const oContentNode = {
            id: "container",
            label: "Some container",
            type: "UnsupportedType",
            isContainer: true
        };

        // Act
        try {
            await this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]);

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(
                oError.message,
                "Bookmark Service: The API needs to be called with a valid content node type. 'UnsupportedType' is not supported.",
                "The promise was rejected with the correct error message."
            );
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 0, "'addBookmarkToPage' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroupStub' wasn't called.");
        }
    });

    QUnit.test("Rejects the promise if one of the provided content nodes doesn't have a type", async function (assert) {
        // Arrange
        const oContentNode = {
            id: "page1",
            label: "Page 1",
            isContainer: true
        };

        // Act
        try {
            await this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]);

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(oError.message, "Bookmark Service: Not a valid content node.", "The promise was rejected with the correct error message.");
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 0, "'addBookmarkToPage' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroupStub' wasn't called.");
        }
    });

    QUnit.test("Rejects the promise if the provided content node is not a container", async function (assert) {
        // Arrange
        const oContentNode = {
            id: "page1",
            label: "Page 1",
            type: ContentNodeType.Page,
            isContainer: false
        };

        // Act
        try {
            await this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]);

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(oError.message, "Bookmark Service: Not a valid content node.", "The promise was rejected with the correct error message.");
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 0, "'addBookmarkToPage' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroupStub' wasn't called.");
        }
    });

    QUnit.module("The function 'addCustomBookmark'", {
        beforeEach: function () {
            this.oConfigStub = sandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);

            sandbox.stub(Container, "getService");
            sandbox.stub(Container, "getServiceAsync");

            this.oBookmarkService = new Bookmark();
            this.oAddBookmarkToContentNodesStub = sandbox.stub(this.oBookmarkService, "_addBookmarkToContentNodes").resolves();

            this.oMockContentNode = {
                id: "mockContentNode",
                label: "Mock Content Node",
                type: ContentNodeType.Page,
                isContainer: true
            };

            const oAppStateService = {
                getPersistentWhenShared: sandbox.stub().returns(false),
                getSupportedPersistencyMethods: sandbox.stub().returns([])
            };
            Container.getServiceAsync.withArgs("AppState").resolves(oAppStateService);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves with the correct bookmark config if loadManifest='true'", async function (assert) {
        // Arrange
        const oOriginalConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": { title: "Bookmark" }
            },
            chipConfig: { chipId: "chip1" },
            loadManifest: true
        };

        const oBookmarkConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": { title: "Bookmark" }
            },
            chipConfig: { chipId: "chip1" },
            loadManifest: true
        };

        const oEnhancedConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizType: "custom.abap.tile",
            vizConfig: {
                "sap.app": { title: "Bookmark" },
                "sap.flp": { chipConfig: { chipId: "chip1" } },
                "sap.platform.runtime": { includeManifest: false }
            }
        };

        // Act
        await this.oBookmarkService.addCustomBookmark("custom.abap.tile", oBookmarkConfig, this.oMockContentNode, "myContentProvider");

        // Assert
        assert.deepEqual(
            this.oAddBookmarkToContentNodesStub.firstCall.args,
            [oEnhancedConfig, [this.oMockContentNode], true, "myContentProvider"],
            "The function '_addBookmarkToContentNodes' was called with the enhanced config.");
        assert.deepEqual(oBookmarkConfig, oOriginalConfig, "The provided bookmark config was not altered.");
    });

    QUnit.test("Enhances the bookmark config with additional properties without modifying the provided config object", async function (assert) {
        // Arrange
        const oOriginalConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": { title: "Bookmark" }
            },
            chipConfig: { chipId: "chip1" }
        };

        const oBookmarkConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": { title: "Bookmark" }
            },
            chipConfig: { chipId: "chip1" }
        };

        const oEnhancedConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizType: "custom.abap.tile",
            vizConfig: {
                "sap.app": { title: "Bookmark" },
                "sap.flp": { chipConfig: { chipId: "chip1" } },
                "sap.platform.runtime": { includeManifest: true }
            }
        };

        // Act
        await this.oBookmarkService.addCustomBookmark("custom.abap.tile", oBookmarkConfig, this.oMockContentNode);

        // Assert
        assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args,
            [oEnhancedConfig, [this.oMockContentNode], true, undefined],
            "The function '_addBookmarkToContentNodes' was called with the enhanced config.");
        assert.deepEqual(oBookmarkConfig, oOriginalConfig, "The provided bookmark config was not altered.");
    });

    QUnit.module("The function 'getContentNodes'", {
        beforeEach: function () {
            this.oConfigStub = sandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);

            sandbox.stub(Container, "getServiceAsync");

            this.aContentNodeMock = [{
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
                }]
            }];
            this.aGroupsMock = [{
                title: "Group 0",
                object: {
                    id: "group_0",
                    title: "Group 0",
                    isPreset: true,
                    isVisible: true,
                    isDefaultGroup: true,
                    isGroupLocked: false,
                    tiles: []
                }
            }, {
                title: "Group 1",
                object: {
                    id: "group_1",
                    title: "Group 1",
                    isPreset: false,
                    isVisible: true,
                    isGroupLocked: false,
                    tiles: [{
                        id: "tile_0",
                        title: "Long Tile 1",
                        size: "1x2",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLinkPersonalizationSupported: true,
                        chipId: "catalogTile_38",
                        properties: {
                            title: "Long Tile 1",
                            subtitle: "Long Tile 1",
                            infoState: "Neutral",
                            info: "0 days running without bugs",
                            icon: "sap-icon://flight",
                            targetURL: "#Action-todefaultapp"
                        }
                    }]
                }
            }];

            this.oGetContentNodesStub = sandbox.stub().resolves(this.aContentNodeMock);

            this.oGetGroupsForBookmarksStub = sandbox.stub().resolvesDeferred(this.aGroupsMock);

            this.oLaunchPageServiceStub = {
                getGroupsForBookmarks: this.oGetGroupsForBookmarksStub,
                getGroupId: function (oGroup) {
                    return oGroup.id;
                }
            };
            Container.getServiceAsync.withArgs("FlpLaunchPage").resolves(this.oLaunchPageServiceStub);

            const oMenuService = {
                getContentNodes: this.oGetContentNodesStub
            };
            Container.getServiceAsync.withArgs("Menu").resolves(oMenuService);

            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct contentNodes if in spaces mode", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);

        // Act
        const aContentNodes = await this.oBookmarkService.getContentNodes();

        // Assert
        assert.strictEqual(aContentNodes, this.aContentNodeMock, "The right content nodes were returned in spaces mode");
        assert.strictEqual(this.oGetContentNodesStub.callCount, 1, "getContentNodes was called exactly once");
    });

    QUnit.test("Returns the correct contentNodes if in classic home page", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);
        const oExpectedContentNodes = [{
            id: "group_0",
            label: "Group 0",
            type: "HomepageGroup",
            isContainer: true
        }, {
            id: "group_1",
            label: "Group 1",
            type: "HomepageGroup",
            isContainer: true
        }];

        // Act
        const aContentNodes = await this.oBookmarkService.getContentNodes();

        // Assert
        assert.deepEqual(aContentNodes, oExpectedContentNodes, "The right content nodes were returned in classic mode");
        assert.strictEqual(this.oGetGroupsForBookmarksStub.callCount, 1, "getGroupsForBookmarks was called exactly once");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.module("The function 'addBookmarkToHomepageGroup'", {
        beforeEach: function () {
            this.oConfigStub = sandbox.stub(Config, "last");
            this.oTileMock = {
                title: "Tile 1",
                tileType: "sap.ushell.ui.tile.StaticTile",
                id: "tile1"
            };
            this.oAddBookmarkStub = sandbox.stub().resolvesDeferred(this.oTileMock);
            this.oAddCustomBookmarkStub = sandbox.stub().resolvesDeferred(this.oTileMock);

            this.oLaunchPageServiceStub = {
                addBookmark: this.oAddBookmarkStub,
                addCustomBookmark: this.oAddCustomBookmarkStub
            };

            sandbox.stub(Container, "getServiceAsync").withArgs("FlpLaunchPage").resolves(this.oLaunchPageServiceStub);

            this.oBookmarkService = new Bookmark();

            this.oPublishStub = sandbox.stub();
            this.oGetCoreStub = sandbox.stub(EventBus, "getInstance").callsFake(() => {
                return {
                    publish: this.oPublishStub
                };
            });
        },

        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Rejects if in launchpad spaces mode", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);

        // Act
        try {
            await this.oBookmarkService.addBookmarkToHomepageGroup();

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(oError.message, "Bookmark Service: The API is not available in spaces mode.", "The function resolved with the right error");
        }
    });

    QUnit.test("Calls addBookmark on the LaunchPage service and fires the bookmarkTileAdded event", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);
        const oBookmark = { title: "Bookmark Tile", url: "https://sap.com" };
        const oGroup = { id: "group1", title: "Group 1" };

        // Act
        await this.oBookmarkService.addBookmarkToHomepageGroup(oBookmark, oGroup);

        assert.deepEqual(this.oAddBookmarkStub.firstCall.args, [oBookmark, oGroup, undefined], "'addBookmark' of the Launchpage service is called with the correct bookmark parameters & group.");
        assert.deepEqual(
            this.oPublishStub.firstCall.args,
            ["sap.ushell.services.Bookmark", "bookmarkTileAdded", { tile: this.oTileMock, group: oGroup }],
            "'bookmarkTileAdded' event is called with the correct data.");
    });

    QUnit.test("Rejects the promise if 'addBookmark' fails.", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);
        this.oAddBookmarkStub.rejectsDeferred("Error message");

        // Act
        try {
            await this.oBookmarkService.addBookmarkToHomepageGroup();

            // Assert
            assert.ok(false, "The promise wasn't rejected.");
        } catch (oError) {
            assert.strictEqual(this.oAddBookmarkStub.callCount, 1, "'addBookmark' of the Launchpage service is called once.");
            assert.strictEqual(this.oPublishStub.callCount, 0, "'bookmarkTileAdded' event is not fired if 'addBookmark' failed.");
            assert.strictEqual(oError.message, "Error message", "The error message is passed into the rejected promise.");
        }
    });

    QUnit.test("passes the contentProviderId on if provided", async function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);
        const oBookmark = { title: "Bookmark Tile", url: "https://sap.com" };
        const oGroup = { id: "group1", title: "Group 1" };

        // Act
        await this.oBookmarkService.addBookmarkToHomepageGroup(oBookmark, oGroup, true, "myContentProvider");

        // Assert
        assert.deepEqual(this.oAddCustomBookmarkStub.firstCall.args[2], "myContentProvider", "'addCustomBookmark' of the Launchpage service is called with contentProviderId.");
    });

    QUnit.test("Calls addCustomBookmark on the LaunchPage service and fires the bookmarkTileAdded event if bCustom is true", async function (assert) {
        // Arrange
        const oBookmark = { title: "Bookmark Tile", url: "https://sap.com" };
        const oGroup = { id: "group1", title: "Group 1" };

        // Act
        await this.oBookmarkService.addBookmarkToHomepageGroup(oBookmark, oGroup, true);

        // Assert
        assert.deepEqual(this.oAddCustomBookmarkStub.firstCall.args, [oBookmark, oGroup, undefined],
            "'addCustomBookmark' of the Launchpage service is called with the correct bookmark parameters & group.");
        assert.deepEqual(this.oPublishStub.firstCall.args, ["sap.ushell.services.Bookmark", "bookmarkTileAdded", { tile: this.oTileMock, group: oGroup }],
            "'bookmarkTileAdded' event is called with the correct data.");
    });

    QUnit.module("The function countBookmarks", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync");

            this.oPagesServiceStub = {
                countBookmarks: sandbox.stub()
            };
            Container.getServiceAsync.withArgs("Pages").resolves(this.oPagesServiceStub);

            this.oLaunchPageServiceStub = {
                countBookmarks: sandbox.stub()
            };
            Container.getServiceAsync.withArgs("FlpLaunchPage").resolves(this.oLaunchPageServiceStub);

            this.oConfigStub = sandbox.stub(Config, "last").withArgs("/core/spaces/enabled");
            this.oConfigStub.returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the Pages service in spaces mode and returns a promise that resolves to the number of bookmarks", async function (assert) {
        //Arrange
        this.oPagesServiceStub.countBookmarks.withArgs({ url: "http://www.sap.com", contentProviderId: "myContentProviderId" }).resolves(3);

        // Act
        const iCount = await this.oBookmarkService.countBookmarks("http://www.sap.com", "myContentProviderId");

        //Assert
        assert.deepEqual(this.oPagesServiceStub.countBookmarks.args[0][0], { url: "http://www.sap.com", contentProviderId: "myContentProviderId" }, "The URL is passed to the Pages service.");
        assert.strictEqual(iCount, 3, "The deferred resolves to the correct value.");
    });

    QUnit.test("Calls the Pages service in spaces mode and returns a promise that rejects in case of an error", async function (assert) {
        //Arrange
        this.oPagesServiceStub.countBookmarks.withArgs({ url: "http://www.sap.com", contentProviderId: "myContentProviderId" }).rejects("error");

        // Act
        try {
            await this.oBookmarkService.countBookmarks("http://www.sap.com", "myContentProviderId");

            //Assert
            assert.ok(false, "The promise is not rejected.");
        } catch (oError) {
            assert.deepEqual(this.oPagesServiceStub.countBookmarks.args[0][0], { url: "http://www.sap.com", contentProviderId: "myContentProviderId" }, "The URL is passed to the Pages service.");
            assert.strictEqual(oError.toString(), "error", "The deferred rejects with the error.");
        }
    });

    QUnit.test("Calls the Launchpage service in classic homepage mode and resolves to the same value", async function (assert) {
        //Arrange
        this.oConfigStub.returns(false);

        this.oLaunchPageServiceStub.countBookmarks.withArgs("http://www.sap.com").resolvesDeferred(42);

        // Act
        const iCount = await this.oBookmarkService.countBookmarks("http://www.sap.com");

        //Assert
        assert.strictEqual(this.oLaunchPageServiceStub.countBookmarks.callCount, 1, "The function countBookmarks has been called once.");
        assert.strictEqual(this.oLaunchPageServiceStub.countBookmarks.args[0][0], "http://www.sap.com", "The URL is passed to the Launchpage service.");
        assert.strictEqual(iCount, 42, "The Deferred from the Launchpage service is returned");
    });

    QUnit.module("The function deleteBookmarks", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync");

            this.oPagesServiceStub = {
                deleteBookmarks: sandbox.stub()
            };
            Container.getServiceAsync.withArgs("Pages").resolves(this.oPagesServiceStub);

            this.oLaunchPageServiceStub = {
                deleteBookmarks: sandbox.stub()
            };
            Container.getServiceAsync.withArgs("FlpLaunchPage").resolves(this.oLaunchPageServiceStub);

            this.oConfigStub = sandbox.stub(Config, "last").withArgs("/core/spaces/enabled");
            this.oConfigStub.returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the Pages service in spaces mode and returns a promise that resolves to the number of bookmarks", async function (assert) {
        //Arrange
        this.oPagesServiceStub.deleteBookmarks.withArgs({ url: "http://www.sap.com", contentProviderId: "myContentProviderId" }).resolves(3);

        // Act
        const iCount = await this.oBookmarkService.deleteBookmarks("http://www.sap.com", "myContentProviderId");

        //Assert
        assert.deepEqual(this.oPagesServiceStub.deleteBookmarks.args[0][0], { url: "http://www.sap.com", contentProviderId: "myContentProviderId" }, "The URL is passed to the Pages service.");
        assert.strictEqual(iCount, 3, "The promise resolves to the correct value.");
    });

    QUnit.test("Calls the Pages service in spaces mode and returns a promise that rejects in case of an error", async function (assert) {
        //Arrange
        this.oPagesServiceStub.deleteBookmarks.withArgs({ url: "http://www.sap.com", contentProviderId: "myContentProviderId" }).rejects("error");

        // Act
        try {
            await this.oBookmarkService.deleteBookmarks("http://www.sap.com", "myContentProviderId");

            //Assert
            assert.ok(false, "The promise is not rejected.");
        } catch (oError) {
            assert.deepEqual(this.oPagesServiceStub.deleteBookmarks.args[0][0], { url: "http://www.sap.com", contentProviderId: "myContentProviderId" }, "The URL is passed to the Pages service.");
            assert.strictEqual(oError.toString(), "error", "The deferred rejects with the error.");
        }
    });

    QUnit.test("Calls the Launchpage service in classic homepage mode and passes the return value through", async function (assert) {
        // Arrange
        this.oConfigStub.returns(false);

        this.oLaunchPageServiceStub.deleteBookmarks.withArgs("http://www.sap.com").resolvesDeferred(42);

        // Act
        const iCount = await this.oBookmarkService.deleteBookmarks("http://www.sap.com");

        // Assert
        assert.strictEqual(this.oLaunchPageServiceStub.deleteBookmarks.args[0][0], "http://www.sap.com", "The URL is passed to the Launchpage service.");
        assert.strictEqual(iCount, 42, "The correct value from the Launchpage service is returned");
    });

    QUnit.test("Publishes the bookmarkTileDeleted event in classic homepage mode", async function (assert) {
        //Arrange
        this.oConfigStub.returns(false);

        this.oLaunchPageServiceStub.deleteBookmarks.withArgs("http://www.sap.com").resolvesDeferred();
        let oPublishStub;
        const oPublishPromise = new Promise((resolve) => {
            oPublishStub = sandbox.stub(EventBus.getInstance(), "publish").callsFake(resolve);
        });
        const oExpectedEventParameters = [
            "sap.ushell.services.Bookmark",
            "bookmarkTileDeleted",
            "http://www.sap.com"
        ];

        // Act
        this.oBookmarkService.deleteBookmarks("http://www.sap.com");
        await oPublishPromise;

        //Assert
        assert.deepEqual(oPublishStub.args[0], oExpectedEventParameters, "The event is published with the correct parameters.");
    });

    QUnit.module("The function updateBookmarks", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync");

            this.oPagesServiceStub = {
                updateBookmarks: sandbox.stub()
            };
            Container.getServiceAsync.withArgs("Pages").resolves(this.oPagesServiceStub);

            this.oLaunchPageServiceStub = {
                updateBookmarks: sandbox.stub()
            };
            Container.getServiceAsync.withArgs("FlpLaunchPage").resolves(this.oLaunchPageServiceStub);

            const oAppStateService = {
                getPersistentWhenShared: sandbox.stub().returns(false),
                getSupportedPersistencyMethods: sandbox.stub().returns([])
            };
            Container.getServiceAsync.withArgs("AppState").resolves(oAppStateService);

            this.oConfigStub = sandbox.stub(Config, "last").withArgs("/core/spaces/enabled");
            this.oConfigStub.returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the Pages service in spaces mode and returns a Promise", async function (assert) {
        //Arrange
        this.oPagesServiceStub.updateBookmarks.withArgs({ url: "http://www.sap.com", contentProviderId: "myContentProviderId" }).resolves();

        // Act
        await this.oBookmarkService.updateBookmarks("http://www.sap.com", {}, "myContentProviderId");

        //Assert
        assert.deepEqual(this.oPagesServiceStub.updateBookmarks.args[0][0], { url: "http://www.sap.com", contentProviderId: "myContentProviderId" }, "The URL is passed to the Pages service.");
    });

    QUnit.test("Calls the Pages service in spaces mode and returns a Deferred that rejects in case of an error", async function (assert) {
        //Arrange
        this.oPagesServiceStub.updateBookmarks.withArgs({ url: "http://www.sap.com", contentProviderId: "myContentProviderId" }).rejects("error");

        // Act
        try {
            await this.oBookmarkService.updateBookmarks("http://www.sap.com", {}, "myContentProviderId");

            //Assert
            assert.ok(false, "The promise is not rejected.");
        } catch (oError) {
            assert.deepEqual(this.oPagesServiceStub.updateBookmarks.args[0][0], { url: "http://www.sap.com", contentProviderId: "myContentProviderId" }, "The URL is passed to the Pages service.");
            assert.strictEqual(oError.toString(), "error", "The deferred rejects with the error.");
        }
    });

    QUnit.test("Calls the Launchpage service in classic homepage mode and passes the return value through", async function (assert) {

        //Arrange
        this.oConfigStub.returns(false);
        this.oLaunchPageServiceStub.updateBookmarks.withArgs("http://www.sap.com").resolvesDeferred(42);

        // Act
        const iCount = await this.oBookmarkService.updateBookmarks("http://www.sap.com", {});

        //Assert
        assert.strictEqual(this.oLaunchPageServiceStub.updateBookmarks.args[0][0], "http://www.sap.com", "The URL is passed to the Launchpage service.");
        assert.strictEqual(iCount, 42, "The correct value from the Launchpage service is returned");
    });

    QUnit.module("countCustomBookmarks", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync");

            this.oIdentifierMock = {
                url: "someUrl",
                vizType: "someVizType",
                chipId: "someChipId"
            };


            this.oSpacesEnabledStub = sandbox.stub(Config, "last").withArgs("/core/spaces/enabled");

            this.oLaunchPageService = {
                countCustomBookmarks: sandbox.stub().resolves()
            };
            Container.getServiceAsync.withArgs("FlpLaunchPage").resolves(this.oLaunchPageService);

            this.oPagesService = {
                countBookmarks: sandbox.stub().resolves()
            };
            Container.getServiceAsync.withArgs("Pages").resolves(this.oPagesService);

            this.oSpacesEnabledStub.returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls LaunchPage Service if spaces is disabled", async function (assert) {
        // Arrange
        this.oSpacesEnabledStub.returns(false);

        // Act
        await this.oBookmarkService.countCustomBookmarks(this.oIdentifierMock);

        // Assert
        assert.ok(true, "promise was resolved");
        assert.strictEqual(this.oLaunchPageService.countCustomBookmarks.callCount, 1, "countCustomBookmarks was called once");
        assert.deepEqual(this.oLaunchPageService.countCustomBookmarks.getCall(0).args, [this.oIdentifierMock], "countCustomBookmarks was called with correct parameters");
    });

    QUnit.test("Calls Pages Service if spaces is enabled", async function (assert) {
        // Act
        await this.oBookmarkService.countCustomBookmarks(this.oIdentifierMock);

        // Assert
        assert.ok(true, "promise was resolved");
        assert.strictEqual(this.oPagesService.countBookmarks.callCount, 1, "countBookmarks was called exactly once");
        assert.deepEqual(this.oPagesService.countBookmarks.getCall(0).args, [this.oIdentifierMock], "countBookmarks was called with correct parameters");
    });

    QUnit.test("Rejects if no parameters are supplied", async function (assert) {
        // Act
        try {
            await this.oBookmarkService.countCustomBookmarks();

            // Assert
            assert.ok(false, "promise was resolved");
        } catch {
            assert.ok(true, "promise was rejected");
        }
    });

    QUnit.test("Rejects if the URL is not supplied", async function (assert) {
        // Act
        try {
            await this.oBookmarkService.countCustomBookmarks({ vizType: "newstile" });

            // Assert
            assert.ok(false, "promise was resolved");
        } catch {
            assert.ok(true, "promise was rejected");
        }
    });

    QUnit.test("Rejects if the vizType is not supplied", async function (assert) {
        // Act
        try {
            await this.oBookmarkService.countCustomBookmarks({ url: "#Action-toappnavsample" });

            // Assert
            assert.ok(false, "promise was resolved");
        } catch {
            assert.ok(true, "promise was rejected");
        }
    });

    QUnit.module("deleteCustomBookmarks", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync");

            this.oIdentifierMock = {
                url: "someUrl",
                vizType: "someVizType",
                chipId: "someChipId"
            };

            this.oSpacesEnabledStub = sandbox.stub(Config, "last").withArgs("/core/spaces/enabled");

            this.oLaunchPageService = {
                deleteCustomBookmarks: sandbox.stub().resolves()
            };
            Container.getServiceAsync.withArgs("FlpLaunchPage").resolves(this.oLaunchPageService);

            this.oPagesService = {
                deleteBookmarks: sandbox.stub().resolves()
            };
            Container.getServiceAsync.withArgs("Pages").resolves(this.oPagesService);

            this.oPublishStub = sandbox.stub();
            this.oGetCoreStub = sandbox.stub(EventBus, "getInstance").callsFake(() => {
                return {
                    publish: this.oPublishStub
                };
            });

            this.oSpacesEnabledStub.returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls LaunchPage Service if spaces is disabled", async function (assert) {
        // Arrange
        this.oSpacesEnabledStub.returns(false);

        // Act
        await this.oBookmarkService.deleteCustomBookmarks(this.oIdentifierMock);

        // Assert
        assert.ok(true, "promise was resolved");
        assert.strictEqual(this.oLaunchPageService.deleteCustomBookmarks.callCount, 1, "deleteCustomBookmarks was called once");
        assert.deepEqual(this.oLaunchPageService.deleteCustomBookmarks.getCall(0).args, [this.oIdentifierMock], "deleteCustomBookmarks was called with correct parameters");
    });

    QUnit.test("Publishes 'bookmarkTileDeleted' event on the event bus after a successful bookmark update", async function (assert) {
        // Arrange
        this.oSpacesEnabledStub.returns(false);

        // Act
        await this.oBookmarkService.deleteCustomBookmarks(this.oIdentifierMock);

        // Assert
        assert.ok(true, "promise was resolved");
        assert.deepEqual(
            this.oPublishStub.firstCall.args,
            ["sap.ushell.services.Bookmark", "bookmarkTileDeleted", "someUrl"],
            "The event 'bookmarkTileDeleted' was published on channel 'sap.ushell.services.Bookmark' with the bookmark URL."
        );
    });

    QUnit.test("Calls Pages Service if spaces is enabled", async function (assert) {
        // Act
        await this.oBookmarkService.deleteCustomBookmarks(this.oIdentifierMock);

        // Assert
        assert.ok(true, "promise was resolved");
        assert.strictEqual(this.oPagesService.deleteBookmarks.callCount, 1, "deleteBookmarks was called exactly once");
        assert.deepEqual(this.oPagesService.deleteBookmarks.getCall(0).args, [this.oIdentifierMock], "deleteBookmarks was called with correct parameters");
    });

    QUnit.test("Rejects if no parameters are supplied", async function (assert) {
        // Act
        try {
            await this.oBookmarkService.deleteCustomBookmarks();

            // Assert
            assert.ok(false, "promise was resolved");
        } catch {
            assert.ok(true, "promise was rejected");
        }
    });

    QUnit.test("Rejects if the URL is not supplied", async function (assert) {
        // Act
        try {
            await this.oBookmarkService.deleteCustomBookmarks({ vizType: "newstile" });

            // Assert
            assert.ok(false, "promise was resolved");
        } catch {
            assert.ok(true, "promise was rejected");
        }
    });

    QUnit.test("Rejects if the vizType is not supplied", async function (assert) {
        // Act
        try {
            await this.oBookmarkService.deleteCustomBookmarks({ url: "#Action-toappnavsample" });

            // Assert
            assert.ok(false, "promise was resolved");
        } catch {
            assert.ok(true, "promise was rejected");
        }
    });

    QUnit.module("updateCustomBookmarks", {
        beforeEach: function () {
            this.oIdentifierMock = {
                url: "someUrl",
                vizType: "someVizType",
                chipId: "someChipId"
            };

            sandbox.stub(Container, "getServiceAsync");

            this.oSpacesEnabledStub = sandbox.stub(Config, "last").withArgs("/core/spaces/enabled");

            this.oLaunchPageService = {
                updateCustomBookmarks: sandbox.stub().resolves()
            };
            Container.getServiceAsync.withArgs("FlpLaunchPage").resolves(this.oLaunchPageService);

            this.oPagesService = {
                updateBookmarks: sandbox.stub().resolves()
            };
            Container.getServiceAsync.withArgs("Pages").resolves(this.oPagesService);

            const oAppStateService = {
                getPersistentWhenShared: sandbox.stub().returns(false),
                getSupportedPersistencyMethods: sandbox.stub().returns([])
            };
            Container.getServiceAsync.withArgs("AppState").resolves(oAppStateService);

            this.oSpacesEnabledStub.returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls LaunchPage Service if spaces is disabled", async function (assert) {
        // Arrange
        this.oSpacesEnabledStub.returns(false);

        const oExpectedConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": { title: "Bookmark" },
                "sap.flp": {
                    chipConfig: { chipId: "chip1" }
                },
                "sap.platform.runtime": {
                    includeManifest: false
                }
            }
        };

        const oBookmark = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": { title: "Bookmark" }
            },
            chipConfig: { chipId: "chip1" },
            loadManifest: true
        };

        // Act
        await this.oBookmarkService.updateCustomBookmarks(this.oIdentifierMock, oBookmark);

        // Assert
        assert.ok(true, "promise was resolved");
        assert.strictEqual(this.oLaunchPageService.updateCustomBookmarks.callCount, 1, "updateCustomBookmarks was called once");
        assert.deepEqual(this.oLaunchPageService.updateCustomBookmarks.getCall(0).args, [this.oIdentifierMock, oExpectedConfig], "updateCustomBookmarks was called with correct parameters");
    });

    QUnit.test("Calls Pages Service if spaces is enabled", async function (assert) {
        const oExpectedConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": { title: "Bookmark" },
                "sap.flp": {
                    chipConfig: { chipId: "chip1" }
                },
                "sap.platform.runtime": {
                    includeManifest: false
                }
            }
        };

        const oBookmark = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": { title: "Bookmark" }
            },
            chipConfig: { chipId: "chip1" },
            loadManifest: true
        };

        //Act
        await this.oBookmarkService.updateCustomBookmarks(this.oIdentifierMock, oBookmark);

        // Assert
        assert.ok(true, "promise was resolved");
        assert.strictEqual(this.oPagesService.updateBookmarks.callCount, 1, "updateCustomBookmarks was called exactly once");
        assert.deepEqual(this.oPagesService.updateBookmarks.getCall(0).args, [this.oIdentifierMock, oExpectedConfig], "updateCustomBookmarks was called with correct parameters");
    });

    QUnit.test("Rejects if mandatory parameters are not supplied", async function (assert) {
        // Arrange
        const oBookmark = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": { title: "Bookmark" }
            },
            chipConfig: { chipId: "chip1" },
            loadManifest: true
        };

        // Act
        try {
            await this.oBookmarkService.updateCustomBookmarks({}, oBookmark);

            // Assert
            assert.ok(false, "promise was resolved");
        } catch {
            assert.ok(true, "promise was rejected");
        }
    });

    QUnit.module("Bookmarking with transient urls", {
        beforeEach: async function () {
            sandbox.stub(Config, "last");
            Config.last.withArgs("/core/spaces/enabled").returns(true);
            Config.last.withArgs("/core/shell/enablePersonalization").returns(true);

            sandbox.stub(Container, "getServiceAsync");

            this.oAppStateService = {
                getPersistentWhenShared: sandbox.stub().returns(true),
                getSupportedPersistencyMethods: sandbox.stub().returns([]),
                setAppStateToPublic: sandbox.stub().callsFake((sUrl) => {
                    const sPersistentUrl = sUrl.replace("transient", "persistent");
                    return new jQuery.Deferred().resolve(sPersistentUrl).promise();
                })
            };
            Container.getServiceAsync.withArgs("AppState").resolves(this.oAppStateService);

            this.oLaunchPageService = {
                getGroupById: sandbox.stub().resolvesDeferred(),
                addBookmark: sandbox.stub().resolvesDeferred(),
                updateBookmarks: sandbox.stub().resolvesDeferred(),
                addCustomBookmark: sandbox.stub().resolvesDeferred(),
                updateCustomBookmarks: sandbox.stub().resolves()
            };
            Container.getServiceAsync.withArgs("FlpLaunchPage").resolves(this.oLaunchPageService);

            this.oPagesService = {
                addBookmarkToPage: sandbox.stub().resolves(),
                updateBookmarks: sandbox.stub().resolves()
            };
            Container.getServiceAsync.withArgs("Pages").resolves(this.oPagesService);

            this.oDefaultPage = {
                id: "page1",
                type: ContentNodeType.Page,
                isContainer: true
            };

            this.oDefaultGroup = {
                id: "group1",
                type: ContentNodeType.HomepageGroup,
                isContainer: true
            };

            this.oBookmarkService = new Bookmark();
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Makes AppState persistent for 'addBookmark'", async function (assert) {
        // Arrange
        const oBookmarkConfig = {
            title: "Bookmark",
            url: "https://sap.com?appState=transient"
        };

        // Act
        await this.oBookmarkService.addBookmark(oBookmarkConfig, this.oDefaultPage, "myContentProvider");

        // Assert
        assert.strictEqual(this.oAppStateService.setAppStateToPublic.callCount, 1, "setAppStateToPublic was called once");
        const aExpectedArgs = [
            this.oDefaultPage.id,
            {
                title: "Bookmark",
                url: "https://sap.com?appState=persistent"
            },
            undefined,
            "myContentProvider"
        ];
        assert.deepEqual(this.oPagesService.addBookmarkToPage.getCall(0).args, aExpectedArgs, "addBookmarkToPage was called correctly");
    });

    QUnit.test("Makes AppState persistent for 'addBookmark' in classic mode", async function (assert) {
        // Arrange
        Config.last.withArgs("/core/spaces/enabled").returns(false);
        const oBookmarkConfig = {
            title: "Bookmark",
            url: "https://sap.com?appState=transient"
        };

        // Act
        await this.oBookmarkService.addBookmark(oBookmarkConfig, this.oDefaultGroup, "myContentProvider");

        // Assert
        assert.strictEqual(this.oAppStateService.setAppStateToPublic.callCount, 1, "setAppStateToPublic was called once");
        const aExpectedArgs = [
            {
                title: "Bookmark",
                url: "https://sap.com?appState=persistent"
            },
            undefined,
            "myContentProvider"
        ];
        assert.deepEqual(this.oLaunchPageService.addBookmark.getCall(0).args, aExpectedArgs, "addBookmark was called correctly");
    });

    QUnit.test("Makes AppState persistent for 'updateBookmarks'", async function (assert) {
        // Arrange
        const oBookmarkConfig = {
            title: "Bookmark",
            url: "https://sap.com?appState=transient"
        };

        // Act
        await this.oBookmarkService.updateBookmarks("https://sap.com", oBookmarkConfig, "myContentProvider");

        // Assert
        assert.strictEqual(this.oAppStateService.setAppStateToPublic.callCount, 1, "setAppStateToPublic was called once");
        const aExpectedArgs = [
            {
                url: "https://sap.com",
                contentProviderId: "myContentProvider"
            },
            {
                title: "Bookmark",
                url: "https://sap.com?appState=persistent"
            }
        ];
        assert.deepEqual(this.oPagesService.updateBookmarks.getCall(0).args, aExpectedArgs, "updateBookmarks was called correctly");
    });

    QUnit.test("Makes AppState persistent for 'updateBookmarks' in classic mode", async function (assert) {
        // Arrange
        Config.last.withArgs("/core/spaces/enabled").returns(false);
        const oBookmarkConfig = {
            title: "Bookmark",
            url: "https://sap.com?appState=transient"
        };

        // Act
        await this.oBookmarkService.updateBookmarks("https://sap.com", oBookmarkConfig, "myContentProvider");

        // Assert
        assert.strictEqual(this.oAppStateService.setAppStateToPublic.callCount, 1, "setAppStateToPublic was called once");
        const aExpectedArgs = [
            "https://sap.com",
            {
                title: "Bookmark",
                url: "https://sap.com?appState=persistent"
            },
            "myContentProvider"
        ];
        assert.deepEqual(this.oLaunchPageService.updateBookmarks.getCall(0).args, aExpectedArgs, "updateBookmarks was called correctly");
    });

    QUnit.test("Makes AppState persistent for 'addCustomBookmark' in pages mode", async function (assert) {
        // Arrange
        const oBookmarkConfig = {
            title: "Bookmark",
            url: "https://sap.com?appState=transient"
        };

        // Act
        await this.oBookmarkService.addCustomBookmark("some.viz.type", oBookmarkConfig, this.oDefaultPage, "myContentProvider");

        // Assert
        assert.strictEqual(this.oAppStateService.setAppStateToPublic.callCount, 1, "setAppStateToPublic was called once");
        const aExpectedArgs = [
            this.oDefaultPage.id,
            {
                title: "Bookmark",
                url: "https://sap.com?appState=persistent",
                vizType: "some.viz.type",
                vizConfig: {
                    "sap.flp": {},
                    "sap.platform.runtime": { includeManifest: true }
                }
            },
            undefined,
            "myContentProvider"
        ];
        assert.deepEqual(this.oPagesService.addBookmarkToPage.getCall(0).args, aExpectedArgs, "addBookmarkToPage was called correctly");
    });

    QUnit.test("Makes AppState persistent for 'addCustomBookmark' in classic mode", async function (assert) {
        // Arrange
        Config.last.withArgs("/core/spaces/enabled").returns(false);
        const oBookmarkConfig = {
            title: "Bookmark",
            url: "https://sap.com?appState=transient"
        };

        // Act
        await this.oBookmarkService.addCustomBookmark("some.viz.type", oBookmarkConfig, this.oDefaultGroup, "myContentProvider");

        // Assert
        assert.strictEqual(this.oAppStateService.setAppStateToPublic.callCount, 1, "setAppStateToPublic was called once");
        const aExpectedArgs = [
            {
                title: "Bookmark",
                url: "https://sap.com?appState=persistent",
                vizType: "some.viz.type",
                vizConfig: {
                    "sap.flp": {},
                    "sap.platform.runtime": { includeManifest: true }
                }
            },
            undefined,
            "myContentProvider"
        ];
        assert.deepEqual(this.oLaunchPageService.addCustomBookmark.getCall(0).args, aExpectedArgs, "addCustomBookmark was called correctly");
    });

    QUnit.test("Makes AppState persistent for 'updateCustomBookmarks' in pages mode", async function (assert) {
        // Arrange
        const oIdentifier = {
            url: "https://sap.com",
            vizType: "some.viz.type"
        };
        const oBookmarkConfig = {
            title: "Bookmark",
            url: "https://sap.com?appState=transient"
        };

        // Act
        await this.oBookmarkService.updateCustomBookmarks(oIdentifier, oBookmarkConfig);

        // Assert
        assert.strictEqual(this.oAppStateService.setAppStateToPublic.callCount, 1, "setAppStateToPublic was called once");
        const aExpectedArgs = [
            oIdentifier,
            {
                title: "Bookmark",
                url: "https://sap.com?appState=persistent",
                vizConfig: {
                    "sap.flp": {},
                    "sap.platform.runtime": { includeManifest: true }
                }
            }
        ];
        assert.deepEqual(this.oPagesService.updateBookmarks.getCall(0).args, aExpectedArgs, "updateBookmarks was called correctly");
    });

    QUnit.test("Makes AppState persistent for 'updateCustomBookmarks' in classic mode", async function (assert) {
        // Arrange
        Config.last.withArgs("/core/spaces/enabled").returns(false);
        const oIdentifier = {
            url: "https://sap.com",
            vizType: "some.viz.type"
        };
        const oBookmarkConfig = {
            title: "Bookmark",
            url: "https://sap.com?appState=transient"
        };

        // Act
        await this.oBookmarkService.updateCustomBookmarks(oIdentifier, oBookmarkConfig);

        // Assert
        assert.strictEqual(this.oAppStateService.setAppStateToPublic.callCount, 1, "setAppStateToPublic was called once");
        const aExpectedArgs = [
            oIdentifier,
            {
                title: "Bookmark",
                url: "https://sap.com?appState=persistent",
                vizConfig: {
                    "sap.flp": {},
                    "sap.platform.runtime": { includeManifest: true }
                }
            }
        ];
        assert.deepEqual(this.oLaunchPageService.updateCustomBookmarks.getCall(0).args, aExpectedArgs, "updateCustomBookmarks was called correctly");
    });
});
