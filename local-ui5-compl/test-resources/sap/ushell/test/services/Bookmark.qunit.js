// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.Bookmark
 * @deprecated As of version 1.120
 */
sap.ui.define([
    "sap/ui/core/EventBus",
    "sap/ushell/services/Bookmark",
    "sap/ushell/test/utils",
    "sap/ushell/utils",
    "sap/ushell/Config",
    "sap/ushell/library",
    "sap/ui/thirdparty/jquery"
], function (
    EventBus,
    Bookmark,
    testUtils,
    utils,
    Config,
    ushellLibrary,
    jQuery
) {
    "use strict";

    /* global QUnit, sinon */

    // shortcut for sap.ushell.ContentNodeType
    var ContentNodeType = ushellLibrary.ContentNodeType;

    var sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.services.Bookmark", {
        beforeEach: function () {
            var oAddBookmarkStub = sandbox.stub();
            oAddBookmarkStub.returns(new jQuery.Deferred().resolve().promise());

            var oAppStateService = {
                getPersistentWhenShared: sandbox.stub().returns(false),
                getSupportedPersistencyMethods: sandbox.stub().returns([])
            };
            this.oLaunchPageService = {
                addBookmark: oAddBookmarkStub,
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
            this.oAddBookmarkToPageStub = sandbox.stub();

            var oPagesService = {
                addBookmarkToPage: this.oAddBookmarkToPageStub
            };
            var oReferenceResolver = {
                resolveSemanticDateRanges: sandbox.stub().returns({ hasSemanticDateRanges: false })
            };
            var oGetServiceAsyncStub = sandbox.stub();
            oGetServiceAsyncStub.withArgs("AppState").resolves(oAppStateService);
            oGetServiceAsyncStub.withArgs("FlpLaunchPage").resolves(this.oLaunchPageService);
            oGetServiceAsyncStub.withArgs("Pages").resolves(oPagesService);
            oGetServiceAsyncStub.withArgs("ReferenceResolver").resolves(oReferenceResolver);

            sap.ushell.Container = {
                getServiceAsync: oGetServiceAsyncStub
            };
            this.oBookmarkService = new Bookmark();

            this.oConfigStub = sandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        },
        afterEach: function () {
            delete sap.ushell.Container;

            sandbox.restore();
        }
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("addBookmarkByGroupId while personalization is disabled", function (assert) {
        var done = assert.async();

        // Arrange
        this.oLaunchPageService.getGroups = function () {
            return (new jQuery.Deferred()).resolve([{ id: "default" }, { id: "group_0" }]).promise();
        };
        var oBookmarkConfig = {
            title: "AddedById",
            url: "#FioriToExtAppTarget-Action"
        };

        // Act
        this.oBookmarkService.addBookmarkByGroupId(oBookmarkConfig, "group_0")
            .done(function () {
                // Assert
                assert.strictEqual(this.oLaunchPageService.addBookmark.callCount, 0, "The function addBookmark has not been called.");
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                throw error;
            })
            .always(done);
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("addBookmarkByGroupId while personalization is enabled", function (assert) {
        var done = assert.async();

        // Arrange
        var oBookmarkConfig = {
            title: "AddedById",
            url: "#FioriToExtAppTarget-Action"
        };
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);

        this.oLaunchPageService.getGroups.returns((new jQuery.Deferred()).resolve([
            { id: "default" },
            { id: "group_0" }
        ]).promise());

        // Act
        this.oBookmarkService.addBookmarkByGroupId(oBookmarkConfig, "group_0")
            .done(function () {
                // Assert
                assert.strictEqual(this.oLaunchPageService.addBookmark.callCount, 1, "The function addBookmark has been called once.");
                assert.ok(this.oLaunchPageService.addBookmark.calledWith(oBookmarkConfig), "The function addBookmark has been called with the correct configuration.");
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                throw error;
            })
            .always(done);
    });

    QUnit.test("Passes the contentProviderId when provided", function (assert) {
        var done = assert.async();

        // Arrange
        var oBookmarkConfig = {
            title: "AddedById",
            url: "#FioriToExtAppTarget-Action"
        };
        var aGroups = [
            { id: "default" },
            { id: "group_0" }
        ];
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);

        this.oLaunchPageService.getGroups = function () {
            return (new jQuery.Deferred()).resolve(aGroups).promise();
        };

        // Act
        this.oBookmarkService.addBookmarkByGroupId(oBookmarkConfig, "group_0", "MyContentProvider")
            .done(function () {
                // Assert
                assert.strictEqual(this.oLaunchPageService.addBookmark.callCount, 1, "LaunchPageService.addBookmark was called once");
                assert.strictEqual(this.oLaunchPageService.addBookmark.getCall(0).args[0], oBookmarkConfig, "was called with the correct config");
                assert.strictEqual(this.oLaunchPageService.addBookmark.getCall(0).args[1], aGroups[1], "was called with the correct group");
                assert.strictEqual(this.oLaunchPageService.addBookmark.getCall(0).args[2], "MyContentProvider", "was called with the correct contentProviderId");
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                throw error;
            })
            .always(done);
    });

    QUnit.test("getGroupsIdsForBookmarks", function (assert) {
        this.oLaunchPageService.getGroupsForBookmarks = function () {
            return (new jQuery.Deferred()).resolve([
                { id: "1", title: "group1", object: { id: 1, title: "group1" } },
                { id: "2", title: "group2", object: { id: 2, title: "group2" } },
                { id: "3", title: "group3", object: { id: 3, title: "group3" } }
            ]).promise();
        };

        return this.oBookmarkService.getShellGroupIDs()
            .done(function (aGroups) {
                assert.strictEqual(aGroups.length, 3, "groups were filtered correctly");
                assert.deepEqual(aGroups[0], { id: 1, title: "group1" });
                assert.deepEqual(aGroups[1], { id: 2, title: "group2" });
                assert.deepEqual(aGroups[2], { id: 3, title: "group3" });
            });
    });

    QUnit.test("_isMatchingRemoteCatalog: Returns false if the remoteId of the catalog does not match", function (assert) {
        var oCatalog = {
            getCatalogData: sandbox.stub().returns({
                remoteId: "foo",
                baseUrl: "/bar"
            })
        };

        var bResult = this.oBookmarkService._isMatchingRemoteCatalog(oCatalog, {
            remoteId: "bar",
            baseUrl: "/bar"
        }, this.oLaunchPageService);

        assert.strictEqual(bResult, false, "The correct values has been returned.");
    });

    QUnit.test("_isMatchingRemoteCatalog: Returns false if neither the remoteId of the catalog nor the baseUrl matches", function (assert) {
        var oCatalog = {
            getCatalogData: sandbox.stub().returns({
                remoteId: "foo",
                baseUrl: "/bar"
            })
        };

        var bResult = this.oBookmarkService._isMatchingRemoteCatalog(oCatalog, {
            remoteId: "foo",
            baseUrl: "/baz"
        }, this.oLaunchPageService);

        assert.strictEqual(bResult, false, "The correct values has been returned.");
    });

    QUnit.test("_isMatchingRemoteCatalog: Returns true if both the remoteId of the catalog and the baseUrl match", function (assert) {
        var oCatalog = {
            getCatalogData: sandbox.stub().returns({
                remoteId: "foo",
                baseUrl: "/bar"
            })
        };

        var bResult = this.oBookmarkService._isMatchingRemoteCatalog(oCatalog, {
            remoteId: "foo",
            baseUrl: "/bar"
        }, this.oLaunchPageService);

        assert.strictEqual(bResult, true, "The correct values has been returned.");
    });

    QUnit.test("_isMatchingRemoteCatalog: Returns true if the passed baseUrl matches ignoring trailing slashes", function (assert) {
        var oCatalog = {
            getCatalogData: sandbox.stub().returns({
                remoteId: "foo",
                baseUrl: "/bar"
            })
        };

        var bResult = this.oBookmarkService._isMatchingRemoteCatalog(oCatalog, {
            remoteId: "foo",
            baseUrl: "/bar/"
        }, this.oLaunchPageService);

        assert.strictEqual(bResult, true, "The correct values has been returned.");
    });

    QUnit.test("_isMatchingRemoteCatalog: Returns true if the catalog's baseUrl matches ignoring trailing slashes", function (assert) {
        var oCatalog = {
            getCatalogData: sandbox.stub().returns({
                remoteId: "foo",
                baseUrl: "/bar/"
            })
        };

        var bResult = this.oBookmarkService._isMatchingRemoteCatalog(oCatalog, {
            remoteId: "foo",
            baseUrl: "/bar"
        }, this.oLaunchPageService);

        assert.strictEqual(bResult, true, "The correct values has been returned.");
    });

    /*
     * Resolve the promise with the given index and result or fail if it is bound to fail
     * currently.
     *
     * @param {int} iFailAtPromiseNo
     *   the index for which to fail
     * @param {int} iIndex
     *   the index of the current resolution
     * @param {object} oResult
     *   argument to jQuery.Deferred#resolve
     * @returns the given deferred object's promise
     */
    function resolveOrFail (iFailAtPromiseNo, iIndex, oResult) {
        var oDeferred = new jQuery.Deferred();

        setTimeout(function () {
            if (iFailAtPromiseNo === iIndex) {
                oDeferred.reject("Fail at promise #" + iFailAtPromiseNo);
            } else {
                if (utils.isArray(oResult)) {
                    oResult.forEach(function (oSingleResult) {
                        oDeferred.notify(oSingleResult);
                    });
                }
                oDeferred.resolve(oResult);
            }
        }, 0);

        return oDeferred.promise();
    }

    function testDoAddCatalogTileToGroup (iFailAtPromiseNo, sGroupId, bCatalogTileSuffix) {
        var bAddTileCalled = false;
        var oCatalog = {};
        var sCatalogTileId = "foo";
        var fnResolveOrFail = resolveOrFail.bind(null, iFailAtPromiseNo);

        // stubs and tests
        this.oLaunchPageService.addTile = function (oCatalogTile, oGroup) {
            QUnit.assert.deepEqual(oCatalogTile, { id: sCatalogTileId });
            QUnit.assert.deepEqual(oGroup, { id: sGroupId });
            QUnit.assert.strictEqual(bAddTileCalled, false, "addTile() not yet called!");
            bAddTileCalled = true;
            return fnResolveOrFail(1);
        };
        this.oLaunchPageService.getCatalogId = function () {
            return "bar";
        };
        this.oLaunchPageService.getCatalogTileId = function (oCatalogTile) {
            if (bCatalogTileSuffix) {
                // see BCP 0020751295 0000142292 2017
                return oCatalogTile.id + "_SYS.ALIAS";
            }
            return oCatalogTile.id;
        };
        this.oLaunchPageService.getCatalogTiles = function (oCatalog0) {
            QUnit.assert.strictEqual(oCatalog0, oCatalog);
            return fnResolveOrFail(2,
                // simulate broken HANA catalog with duplicate CHIP IDs
                [{}, { id: sCatalogTileId }, { id: sCatalogTileId }]);
        };
        this.oLaunchPageService.getDefaultGroup = function () {
            return fnResolveOrFail(3, { id: undefined });
        };
        this.oLaunchPageService.getGroups = function () {
            return fnResolveOrFail(3, [{}, { id: sGroupId }]);
        };
        this.oLaunchPageService.getGroupId = function (oGroup) {
            return oGroup.id;
        };

        // code under test
        return new Promise(function (resolve) {
            this.oBookmarkService._doAddCatalogTileToGroup(new jQuery.Deferred(), sCatalogTileId, oCatalog,
                sGroupId)
                .fail(function (sMessage) {
                    QUnit.assert.strictEqual(sMessage, "Fail at promise #" + iFailAtPromiseNo);
                    resolve();
                })
                .done(function () {
                    QUnit.assert.strictEqual(iFailAtPromiseNo, 0, "Success");
                    resolve();
                });
        }.bind(this));
    }

    [true, false].forEach(function (bCatalogTileSuffix) {
        [0, 1, 2, 3].forEach(function (iFailAtPromiseNo) {
            var sTitle = "catalog tile ID " + (bCatalogTileSuffix ? "with" : "without") + " suffix; ";
            sTitle += (iFailAtPromiseNo > 0) ? "fail at #" + iFailAtPromiseNo : "success";
            QUnit.test("_doAddCatalogTileToGroup (default); " + sTitle, function () {
                return testDoAddCatalogTileToGroup.call(this, iFailAtPromiseNo, undefined, bCatalogTileSuffix);
            });
            QUnit.test("_doAddCatalogTileToGroup (given); " + sTitle, function () {
                return testDoAddCatalogTileToGroup.call(this, iFailAtPromiseNo, {}, bCatalogTileSuffix);
            });
        });
    });

    QUnit.test("_doAddCatalogTileToGroup (missing group)", function (assert) {
        var oLogMock = testUtils.createLogMock()
            .filterComponent("sap.ushell.services.Bookmark")
            .error("Group 'unknown' is unknown", null, "sap.ushell.services.Bookmark");

        this.oLaunchPageService.getGroups = function () {
            return (new jQuery.Deferred()).resolve([{ id: "default" }, { id: "bar" }]).promise();
        };
        this.oLaunchPageService.getGroupId = function (oGroup) {
            return oGroup.id;
        };

        // code under test
        this.oBookmarkService._doAddCatalogTileToGroup(new jQuery.Deferred(), "foo", {}, "unknown")
            .fail(function (sMessage) {
                assert.strictEqual(sMessage, "Group 'unknown' is unknown");
                oLogMock.verify();
            })
            .done(function () {
                testUtils.onError();
            })
            .always(assert.async());
    });

    QUnit.test("_doAddCatalogTileToGroup (missing tile)", function (assert) {
        var sError = "No tile 'foo' in catalog 'bar'";
        var oLogMock = testUtils.createLogMock()
            .filterComponent("sap.ushell.services.Bookmark")
            .error(sError, null, "sap.ushell.services.Bookmark");

        this.oLaunchPageService.getDefaultGroup = function () {
            return (new jQuery.Deferred()).resolve({}).promise();
        };
        this.oLaunchPageService.getCatalogTiles = function () {
            return (new jQuery.Deferred()).resolve([{}, {}]).promise();
        };
        this.oLaunchPageService.getCatalogId = function () {
            return "bar";
        };
        this.oLaunchPageService.getCatalogTileId = function () {
            return "";
        };
        this.oLaunchPageService.getGroupId = function () {
            return "testGroupId";
        };

        // code under test
        this.oBookmarkService._doAddCatalogTileToGroup(new jQuery.Deferred(), "foo", {})
            .fail(function (sMessage) {
                assert.strictEqual(sMessage, sError);
                oLogMock.verify();
            })
            .done(function () {
                testUtils.onError();
            })
            .always(assert.async());
    });

    /**
     * @deprecated since 1.112
     */
    function testAddCatalogTileToGroup (iFailAtPromiseNo, oTargetCatalog, oCatalogData) {
        var sCatalogTileId = "foo";
        var oTestGroup = {};
        var oSecondMatchingCatalog = JSON.parse(JSON.stringify(oTargetCatalog));
        var fnResolveOrFail = resolveOrFail.bind(null, iFailAtPromiseNo);

        // preparation
        sandbox.stub(this.oBookmarkService, "_doAddCatalogTileToGroup").callsFake(function (oDeferred, sTileId, oCatalog, oGroup) {
            QUnit.assert.strictEqual(sTileId, sCatalogTileId);
            QUnit.assert.strictEqual(oCatalog, oTargetCatalog);
            QUnit.assert.strictEqual(oGroup, oTestGroup);
            if (iFailAtPromiseNo === 2) {
                oDeferred.reject("Fail at #" + iFailAtPromiseNo);
            } else {
                oDeferred.resolve();
            }
        });
        this.oLaunchPageService.getCatalogs = function () {
            QUnit.assert.ok(this.oLaunchPageService.onCatalogTileAdded.calledWith(sCatalogTileId));
            return fnResolveOrFail(1, [{}, oTargetCatalog, oSecondMatchingCatalog]);
        }.bind(this);

        // code under test
        var oResultDeferred = new jQuery.Deferred();

        this.oBookmarkService.addCatalogTileToGroup(sCatalogTileId, oTestGroup, oCatalogData)
            .fail(function (sMessage) {
                QUnit.assert.strictEqual(sMessage, "Fail at promise #" + iFailAtPromiseNo);
            })
            .done(function () {
                QUnit.assert.strictEqual(iFailAtPromiseNo, 0, "Success");
            })
            .always(oResultDeferred.resolve);

        return oResultDeferred.promise();
        //TODO catalog refresh call with catalog ID
        //TODO enhance LPA.onCatalogTileAdded by optional sCatalogId parameter
    }

    /**
     * @deprecated since 1.112
     */
    QUnit.test("addCatalogTileToGroup (HANA legacy catalog), success", function (assert) {
        var done = assert.async();

        testAddCatalogTileToGroup.call(this, 0, { id: "X-SAP-UI2-HANA:hana?remoteId=HANA_CATALOG" })
            .done(done);
    });

    /**
     * @deprecated since 1.112
     */
    QUnit.test("addCatalogTileToGroup (HANA legacy catalog), fail at #1", function (assert) {
        var done = assert.async();

        testAddCatalogTileToGroup.call(this, 1, { id: "X-SAP-UI2-HANA:hana?remoteId=HANA_CATALOG" })
            .done(done);
    });

    /**
     * @deprecated since 1.112
     */
    QUnit.test("addCatalogTileToGroup (remote catalog), success", function (assert) {
        var done = assert.async();

        var oCatalogData = {};
        var oLogMock = testUtils.createLogMock()
            .filterComponent("sap.ushell.services.Bookmark")
            .warning("More than one matching catalog: " + JSON.stringify(oCatalogData), null, "sap.ushell.services.Bookmark");

        this.oBookmarkService._isMatchingRemoteCatalog = function (oCatalog) {
            return oCatalog.remoteId === "foo";
        };

        testAddCatalogTileToGroup.call(this, 0, { remoteId: "foo" }, oCatalogData)
            .done(function () {
                oLogMock.verify();
                done();
            });
    });

    /**
     * @deprecated since 1.112
     */
    QUnit.test("addCatalogTileToGroup (remote catalog), fail at #1", function (assert) {
        var done = assert.async();

        var oCatalogData = {};
        var oLogMock = testUtils.createLogMock()
            .filterComponent("sap.ushell.services.Bookmark")
            .warning("More than one matching catalog: " + JSON.stringify(oCatalogData), null, "sap.ushell.services.Bookmark");

        this.oBookmarkService._isMatchingRemoteCatalog = function (oCatalog) {
            return oCatalog.remoteId === "foo";
        };

        testAddCatalogTileToGroup.call(this, 1, { remoteId: "foo" }, oCatalogData)
            .done(function () {
                oLogMock.verify();
                done();
            });
    });

    /**
     * @deprecated since 1.112
     */
    QUnit.test("addCatalogTileToGroup (missing remote catalog)", function (assert) {
        var sError = "No matching catalog found: {}";
        var oLogMock = testUtils.createLogMock()
            .filterComponent("sap.ushell.services.Bookmark")
            .error(sError, null, "sap.ushell.services.Bookmark");

        this.oBookmarkService._isMatchingRemoteCatalog = function () {
            return false;
        };

        this.oLaunchPageService.getCatalogs = function () {
            return (new jQuery.Deferred()).resolve([{ id: "default" }, { id: "bar" }]).promise();
        };

        // code under test
        this.oBookmarkService.addCatalogTileToGroup("foo", "groupId", {})
            .done(function () {
                testUtils.onError();
            })
            .fail(function (sMessage) {
                assert.strictEqual(sMessage, sError);
                oLogMock.verify();
            })
            .always(assert.async());
    });

    /**
     * @deprecated since 1.112
     */
    QUnit.test("addCatalogTileToGroup (missing legacy HANA catalog)", function (assert) {
        var sError = "No matching catalog found: "
            + "{\"id\":\"X-SAP-UI2-HANA:hana?remoteId=HANA_CATALOG\"}";
        var oLogMock = testUtils.createLogMock()
            .filterComponent("sap.ushell.services.Bookmark")
            .error(sError, null, "sap.ushell.services.Bookmark");

        this.oLaunchPageService.getCatalogs = function () {
            return (new jQuery.Deferred()).resolve([{ id: "default" }, { id: "bar" }]).promise();
        };
        this.oLaunchPageService.getCatalogId = function (oCatalog) {
            return oCatalog.id;
        };

        // code under test
        this.oBookmarkService.addCatalogTileToGroup("foo", "groupId")
            .done(function () {
                testUtils.onError();
            })
            .fail(function (sMessage) {
                assert.strictEqual(sMessage, sError);
                oLogMock.verify();
            })
            .always(assert.async());
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("'addBookmarkByGroupId' returns a rejected promise in spaces mode", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);

        // Act
        var oResult = this.oBookmarkService.addBookmarkByGroupId();

        oResult
            .done(function () {
                assert.ok(false, "The promise resolved.");
            })
            .fail(function (sError) {
                // Assert
                assert.strictEqual(sError, "Bookmark Service: The API 'addBookmarkByGroupId' is not supported in launchpad spaces mode.", "The Promise has been rejected with defined error message");
            })
            .always(assert.async());
    });

    QUnit.test("'getShellGroupIDs' returns a rejected promise in spaces mode", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);

        // Act
        var oResult = this.oBookmarkService.getShellGroupIDs();

        oResult
            .done(function () {
                assert.ok(false, "The promise resolved.");
            })
            .fail(function (sError) {
                // Assert
                assert.strictEqual(sError, "Bookmark Service: The API 'getShellGroupIDs' is not supported in launchpad spaces mode.", "The Promise has been rejected with defined error message");
            })
            .always(assert.async());
    });

    /**
     * @deprecated since 1.112
     */
    QUnit.test("'addCatalogTileToGroup' returns a rejected promise in spaces mode", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);

        // Act
        var oResult = this.oBookmarkService.addCatalogTileToGroup();

        oResult
            .done(function () {
                assert.ok(false, "The promise resolved.");
            })
            .fail(function (sError) {
                // Assert
                assert.strictEqual(sError, "Bookmark Service: The API 'addCatalogTileToGroup' is not supported in launchpad spaces mode.", "The Promise has been rejected with defined error message");
            })
            .always(assert.async());
    });

    QUnit.module("The constructor", {
        beforeEach: function () {
            var oGetServiceAsyncStub = sandbox.stub();
            this.oGetServiceStub = sandbox.stub();

            this.oGetPagesServiceStub = oGetServiceAsyncStub.withArgs("Pages").resolves("Pages");
            this.oGetLaunchPageServiceStub = oGetServiceAsyncStub.withArgs("FlpLaunchPage").returns("FlpLaunchPage");

            sap.ushell.Container = {
                getServiceAsync: oGetServiceAsyncStub,
                getService: this.oGetServiceStub
            };

            this.oConfigStub = sandbox.stub(Config, "last");
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("Does not request any services synchronously if spaces mode is off", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);

        // Act
        var oService = new Bookmark();

        // Assert
        assert.strictEqual(this.oGetServiceStub.callCount, 0, "The function getService has not been called.");
        assert.notStrictEqual(oService, undefined, "The service is there");
    });

    QUnit.test("Initializes the required services correctly if spaces mode is on", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);

        // Act
        var oService = new Bookmark();

        // Assert
        return oService._oPagesServicePromise.then(function (sServiceName) {
            assert.strictEqual(this.oGetServiceStub.callCount, 0, "The function getService has not been called.");
            assert.strictEqual(sServiceName, "Pages", "The function requested the Pages service.");
        }.bind(this));
    });

    QUnit.module("The function 'addBookmarkToPage'", {
        beforeEach: function () {
            this.oAddBookmarkToPageStub = sinon.stub();
            sap.ushell.Container = {
                getServiceAsync: sinon.stub().withArgs("Pages").resolves({
                    addBookmarkToPage: this.oAddBookmarkToPageStub
                }),
                getService: function () { }
            };

            this.oConfigStub = sinon.stub(Config, "last");
            this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            this.oConfigStub.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns a rejected promise in the launchpad home page mode", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);

        // Act
        var oResult = this.oBookmarkService.addBookmarkToPage();

        return oResult.catch(function (sError) {
            // Assert
            assert.strictEqual(sError,
                "Bookmark Service: 'addBookmarkToPage' is not valid in launchpad home page mode, use 'addBookmark' instead.",
                "The Promise has been rejected with the predefined error message.");
        });
    });

    QUnit.test("Returns a rejected promise when personalization is not enabled", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);

        // Act
        var oResult = this.oBookmarkService.addBookmarkToPage();

        return oResult.catch(function (sError) {
            // Assert
            assert.strictEqual(sError,
                "Bookmark Service: Add bookmark is not allowed as the personalization functionality is not enabled.",
                "The Promise has been rejected with the predefined error message.");
        });
    });

    QUnit.test("Returns a rejected promise when personalization and myHome are not enabled", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(false);
        this.oConfigStub.withArgs("/core/spaces/myHome/myHomePageId").returns("myHomePageId");

        // Act
        var oResult = this.oBookmarkService.addBookmarkToPage({}, "myHomePageId");

        return oResult.catch(function (sError) {
            // Assert
            assert.strictEqual(sError,
                "Bookmark Service: Add bookmark is not allowed as the personalization functionality is not enabled.",
                "The Promise has been rejected with the predefined error message.");
        });
    });

    QUnit.test("Returns a rejected promise when personalization is disabled, myHome is enabled and pageId is not myHomePageId", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(true);
        this.oConfigStub.withArgs("/core/spaces/myHome/myHomePageId").returns("myHomePageId");

        // Act
        var oResult = this.oBookmarkService.addBookmarkToPage({}, "notMyHomePageId");

        return oResult.catch(function (sError) {
            // Assert
            assert.strictEqual(sError,
                "Bookmark Service: Add bookmark is not allowed as the personalization functionality is not enabled.",
                "The Promise has been rejected with the predefined error message.");
        });
    });

    QUnit.test("Returns a rejected promise if invalid bookmark data is passed", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);

        // Act
        var oResult = this.oBookmarkService.addBookmarkToPage({}, "pageId");

        return oResult.catch(function (sError) {
            // Assert
            assert.strictEqual(sError,
                "Bookmark Service - Invalid bookmark data.",
                "The Promise has been rejected with the predefined error message.");
        });
    });

    QUnit.test("Returns a resolved promise when the configurations are correctly set", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);

        var oParams = { title: "bookmark-title", url: "bookmark-url" };
        var sPageId = "pageId";

        // Act
        var oResult = this.oBookmarkService.addBookmarkToPage(oParams, sPageId);

        return oResult.then(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 1, "The addBookmarkToPage of the pages service is called once.");
            assert.deepEqual(this.oAddBookmarkToPageStub.firstCall.args, [sPageId, oParams, undefined, undefined],
                "The addBookmarkToPage of the pages service is called with right parameters.");
        }.bind(this));
    });

    QUnit.test("Passes the contentProviderId on when provided", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);

        var oParams = { title: "bookmark-title", url: "bookmark-url" };
        var sPageId = "pageId";

        // Act
        var oResult = this.oBookmarkService.addBookmarkToPage(oParams, sPageId, "myContentProvider");

        return oResult.then(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 1, "The addBookmarkToPage of the pages service is called once.");
            assert.deepEqual(this.oAddBookmarkToPageStub.firstCall.args, [sPageId, oParams, undefined, "myContentProvider"],
                "The addBookmarkToPage of the pages service is called with right parameters.");
        }.bind(this));
    });

    QUnit.test("Returns a resolved promise for myHome page if personalization is disabled", function (assert) {
        // Arrange
        var oParams = { title: "bookmark-title", url: "bookmark-url" };
        var sPageId = "myHomePageId";

        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(true);
        this.oConfigStub.withArgs("/core/spaces/myHome/myHomePageId").returns(sPageId);

        // Act
        var oResult = this.oBookmarkService.addBookmarkToPage(oParams, sPageId);

        return oResult.then(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 1, "The addBookmarkToPage of the pages service is called once.");
            assert.deepEqual(this.oAddBookmarkToPageStub.firstCall.args, [sPageId, oParams, undefined, undefined], "The addBookmarkToPage of the pages service is called with right parameters.");
        }.bind(this));
    });

    QUnit.module("The function 'addBookmark'", {
        beforeEach: function () {
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

            this.oBookmarkMock = { id: "SomeId", title: "Some Title" };

            var oGetServiceAsyncStub = sandbox.stub();
            oGetServiceAsyncStub.withArgs("Menu").resolves({
                getDefaultSpace: this.oGetDefaultSpaceStub
            });
            this.oHasSemanticDateRangesStub = sandbox.stub().returns(false);
            oGetServiceAsyncStub.withArgs("ReferenceResolver").resolves({
                hasSemanticDateRanges: this.oHasSemanticDateRangesStub
            });
            oGetServiceAsyncStub.withArgs("AppState").resolves({
                getPersistentWhenShared: sandbox.stub().returns(false),
                getSupportedPersistencyMethods: sandbox.stub().returns([])
            });
            sap.ushell.Container = {
                getService: function () { },
                getServiceAsync: oGetServiceAsyncStub
            };

            this.oBookmarkService = new Bookmark();

            this.oAddBookmarkToHomepageGroupStub = sandbox.stub(this.oBookmarkService, "addBookmarkToHomepageGroup").resolves();
            this.oAddBookmarkToContentNodesStub = sandbox.stub(this.oBookmarkService, "_addBookmarkToContentNodes").resolves();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Resolves the promise without adding a bookmark if the personalization is disabled", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);

        // Act
        return this.oBookmarkService.addBookmark().done(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 0, "'_addBookmarkToContentNodes' wasn't called.");
        }.bind(this));
    });

    QUnit.test("Resolves the promise without adding a bookmark if the personalization is disabled, the space is enabled and myHome is disabled", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);
        this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(false);
        // Act
        return this.oBookmarkService.addBookmark().done(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 0, "'_addBookmarkToContentNodes' wasn't called.");
        }.bind(this));
    });

    QUnit.test("Adds the bookmark to the default group in classic homepage scenario if container wasn't provided", function (assert) {
        // Act
        return this.oBookmarkService.addBookmark(this.oBookmarkMock, undefined).done(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 0, "'_addBookmarkToContentNodes' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], undefined, "'addBookmarkToHomepageGroup' was called with the right group.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[2], false, "'addBookmarkToHomepageGroup' was called as standard bookmark");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[3], undefined, "'addBookmarkToHomepageGroup' was called without a contentProviderId.");
        }.bind(this));
    });

    QUnit.test("Adds the bookmark to a classic homepage group if the provided container is a legacy Launchpage group object", function (assert) {
        // Arrange
        var oLaunchpageGroup = { id: "group1", title: "Group 1" };

        // Act
        return this.oBookmarkService.addBookmark(this.oBookmarkMock, oLaunchpageGroup).done(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 0, "'_addBookmarkToContentNodes' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], oLaunchpageGroup, "'addBookmarkToHomepageGroup' was called with the right group.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[2], false, "'addBookmarkToHomepageGroup' was called as standard bookmark");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[3], undefined, "'addBookmarkToHomepageGroup' was called without a contentProviderId.");
        }.bind(this));
    });

    QUnit.test("Adds the bookmark to the provided content node", function (assert) {
        // Arrange
        var oContentNode = {
            id: "page1",
            label: "Page 1",
            type: ContentNodeType.Page,
            isContainer: true
        };

        // Act
        return this.oBookmarkService.addBookmark(this.oBookmarkMock, oContentNode).done(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 1, "'_addBookmarkToContentNodes' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[0], this.oBookmarkMock, "'_addBookmarkToContentNodes' was called with the right bookmark.");
            assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[1], [oContentNode], "'_addBookmarkToContentNodes' was called with the right content nodes.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[2], false, "'_addBookmarkToContentNodes' was called as standard bookmark");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[3], undefined, "'_addBookmarkToContentNodes' was called without a contentProviderId.");
        }.bind(this));
    });

    QUnit.test("Passes the contentProviderId when provided for a ContentNode", function (assert) {
        // Arrange
        var oContentNode = {
            id: "page1",
            label: "Page 1",
            type: ContentNodeType.Page,
            isContainer: true
        };

        // Act
        return this.oBookmarkService.addBookmark(this.oBookmarkMock, oContentNode, "MyContentProvider").done(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 1, "'_addBookmarkToContentNodes' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[2], false, "'_addBookmarkToContentNodes' was called as standard bookmark");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[3], "MyContentProvider", "'_addBookmarkToContentNodes' was called with the provided contentProviderId.");
        }.bind(this));
    });

    QUnit.test("Passes the contentProviderId when provided for the default group in classic homepage", function (assert) {
        // Act
        return this.oBookmarkService.addBookmark(this.oBookmarkMock, undefined, "MyContentProvider").done(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 0, "'_addBookmarkToContentNodes' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], undefined, "'addBookmarkToHomepageGroup' was called with the right group.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[2], false, "'addBookmarkToHomepageGroup' was called as standard bookmark");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[3], "MyContentProvider", "'addBookmarkToHomepageGroup' was called with the right contentProviderId.");
        }.bind(this));
    });

    QUnit.test("Passes the contentProviderId when provided for the legacy Launchpage group in classic homepage", function (assert) {
        // Arrange
        var oLaunchpageGroup = { id: "group1", title: "Group 1" };

        // Act
        return this.oBookmarkService.addBookmark(this.oBookmarkMock, oLaunchpageGroup, "MyContentProvider").done(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 0, "'_addBookmarkToContentNodes' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], oLaunchpageGroup, "'addBookmarkToHomepageGroup' was called with the right group.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[2], false, "'addBookmarkToHomepageGroup' was called as standard bookmark");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[3], "MyContentProvider", "'addBookmarkToHomepageGroup' was called with the right contentProviderId.");
        }.bind(this));
    });

    QUnit.test("Adds the bookmark to multiple provided content nodes", function (assert) {
        // Arrange
        var aContentNodes = [{
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
        return this.oBookmarkService.addBookmark(this.oBookmarkMock, aContentNodes).done(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 1, "'_addBookmarkToContentNodes' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[0], this.oBookmarkMock, "'_addBookmarkToContentNodes' was called with the right bookmark.");
            assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[1], aContentNodes, "'_addBookmarkToContentNodes' was called with the right content nodes.");
        }.bind(this));
    });

    QUnit.test("Adds the bookmark to the defaultPage if no content node was provided and spaces mode is active", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);
        var oExpectedContentNode = {
            id: "myId",
            label: "myTitle",
            type: ContentNodeType.Page,
            isContainer: true,
            children: []
        };

        // Act
        return this.oBookmarkService.addBookmark(this.oBookmarkMock, undefined).done(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 1, "'_addBookmarkToContentNodes' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[0], this.oBookmarkMock, "'_addBookmarkToContentNodes' was called with the right bookmark.");
            assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[1], [oExpectedContentNode], "'_addBookmarkToContentNodes' was called with the right content nodes.");
        }.bind(this));
    });

    QUnit.test("Adds the bookmark if personalization is disabled, spaces mode and myHome are active", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);
        this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(true);
        var oExpectedContentNode = {
            id: "myId",
            label: "myTitle",
            type: ContentNodeType.Page,
            isContainer: true,
            children: []
        };

        // Act
        return this.oBookmarkService.addBookmark(this.oBookmarkMock, undefined).done(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 1, "'_addBookmarkToContentNodes' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[0], this.oBookmarkMock, "'_addBookmarkToContentNodes' was called with the right bookmark.");
            assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[1], [oExpectedContentNode], "'_addBookmarkToContentNodes' was called with the right content nodes.");
        }.bind(this));
    });

    QUnit.test("Rejects the promise if the bookmark couldn't be added to a content node", function (assert) {
        // Arrange
        this.oAddBookmarkToContentNodesStub.rejects("ContentNode 'page1' couldn't be saved.");

        var oContentNode = {
            id: "page1",
            label: "Page 1",
            type: ContentNodeType.Page,
            isContainer: true
        };

        // Act
        this.oBookmarkService.addBookmark(this.oBookmarkMock, oContentNode)
            .done(function () {
                assert.ok(false, "The promise wasn't rejected.");
            })
            .fail(function (oError) {
                // Assert
                assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
                assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 1, "'_addBookmarkToContentNodes' was called exactly once.");
                assert.strictEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[0], this.oBookmarkMock, "'_addBookmarkToContentNodes' was called with the right bookmark.");
                assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[1], [oContentNode], "'_addBookmarkToContentNodes' was called with the right content nodes.");

                assert.strictEqual(oError.toString(), "ContentNode 'page1' couldn't be saved.", "The promise was rejected with the correct error message.");
            }.bind(this))
            .always(assert.async());
    });

    QUnit.test("Rejects the promise if no bookmark parameters are provided", function (assert) {
        // Arrange

        // Act
        this.oBookmarkService.addBookmark()
            .done(function () {
                assert.ok(false, "The promise wasn't rejected.");
            })
            .fail(function (oError) {
                // Assert
                assert.strictEqual(oError.toString(), "Error: Invalid Bookmark Data: No bookmark parameters passed.", "The promise was rejected with an error message.");
            })
            .always(assert.async());
    });

    QUnit.test("Rejects the promise if a data source with an invalid type is provided in the bookmark parameters", function (assert) {
        // Arrange
        this.oBookmarkMock.dataSource = {
            type: "AData",
            settings: {
                odataVersion: "4.0"
            }
        };

        // Act
        this.oBookmarkService.addBookmark(this.oBookmarkMock)
            .done(function () {
                assert.ok(false, "The promise wasn't rejected.");
            })
            .fail(function (oError) {
                // Assert
                assert.strictEqual(oError.toString(), "Error: Invalid Bookmark Data: Unknown data source type: AData", "The promise was rejected with an error message.");
            })
            .always(assert.async());
    });

    QUnit.test("Rejects the promise if a data source without a type is provided in the bookmark parameters", function (assert) {
        // Arrange
        this.oBookmarkMock.dataSource = {
            settings: {
                odataVersion: "4.0"
            }
        };

        // Act
        this.oBookmarkService.addBookmark(this.oBookmarkMock)
            .done(function () {
                assert.ok(false, "The promise wasn't rejected.");
            })
            .fail(function (oError) {
                // Assert
                assert.strictEqual(oError.toString(), "Error: Invalid Bookmark Data: Unknown data source type: undefined", "The promise was rejected with an error message.");
            })
            .always(assert.async());
    });

    QUnit.test("Rejects the promise if a data source with an invalid OData version is provided in the bookmark parameters", function (assert) {
        // Arrange
        this.oBookmarkMock.dataSource = {
            type: "OData",
            settings: {
                odataVersion: "3.0"
            }
        };

        // Act
        this.oBookmarkService.addBookmark(this.oBookmarkMock)
            .done(function () {
                assert.ok(false, "The promise wasn't rejected.");
            })
            .fail(function (oError) {
                // Assert
                assert.strictEqual(oError.toString(), "Error: Invalid Bookmark Data: Unknown OData version in the data source: 3.0", "The promise was rejected with an error message.");
            })
            .always(assert.async());
    });

    QUnit.test("Rejects the promise if a data source without OData version is provided in the bookmark parameters", function (assert) {
        // Arrange
        this.oBookmarkMock.dataSource = {
            type: "OData",
            settings: {
            }
        };

        // Act
        this.oBookmarkService.addBookmark(this.oBookmarkMock)
            .done(function () {
                assert.ok(false, "The promise wasn't rejected.");
            })
            .fail(function (oError) {
                // Assert
                assert.strictEqual(oError.toString(), "Error: Invalid Bookmark Data: Unknown OData version in the data source: undefined", "The promise was rejected with an error message.");
            })
            .always(assert.async());
    });

    QUnit.test("Rejects the promise if a data source without settings is provided in the bookmark parameters", function (assert) {
        // Arrange
        this.oBookmarkMock.dataSource = {
            type: "OData"
        };

        // Act
        this.oBookmarkService.addBookmark(this.oBookmarkMock)
            .done(function () {
                assert.ok(false, "The promise wasn't rejected.");
            })
            .fail(function (oError) {
                // Assert
                assert.strictEqual(oError.toString(), "Error: Invalid Bookmark Data: Unknown OData version in the data source: undefined", "The promise was rejected with an error message.");
            })
            .always(assert.async());
    });

    QUnit.test("Rejects the promise if a service URL with semantic date ranges but without data source is provided in the bookmark parameters", function (assert) {
        // Arrange
        this.oBookmarkMock.serviceUrl = "/a/url/$count?&$filter=(testDate eq {Edm.DateTimeOffset%%DynamicDate.YESTERDAY%%})";
        this.oHasSemanticDateRangesStub.withArgs(this.oBookmarkMock.serviceUrl).returns(true);

        // Act
        this.oBookmarkService.addBookmark(this.oBookmarkMock)
            .done(function () {
                assert.ok(false, "The promise wasn't rejected.");
            })
            .fail(function (oError) {
                // Assert
                assert.strictEqual(oError.toString(), "Error: Invalid Bookmark Data: Provide a data source to use semantic date ranges.", "The promise was rejected with an error message.");
            })
            .always(assert.async());
    });

    QUnit.test("Adds the bookmark if a service URL without semantic date ranges and no data source are provided in the bookmark data", function (assert) {
        // Arrange
        var oContentNode = {
            id: "page1",
            label: "Page 1",
            type: ContentNodeType.Page,
            isContainer: true
        };
        this.oBookmarkMock.serviceUrl = "/a/url/$count";

        // Act
        return this.oBookmarkService.addBookmark(this.oBookmarkMock, oContentNode).done(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 1, "'_addBookmarkToContentNodes' was called exactly once.");
        }.bind(this));
    });

    QUnit.module("The function '_addBookmarkToContentNodes'", {
        beforeEach: function () {
            this.oMockGroups = {
                group1: { id: "group1", title: "Group One" },
                group2: { id: "group2", title: "Group Two" }
            };

            this.oBookmarkMock = { id: "SomeId", title: "Some Title" };

            this.oGetGroupByIdStub = sandbox.stub().callsFake(function (sGroupId) {
                return new jQuery.Deferred().resolve(this.oMockGroups[sGroupId]).promise();
            }.bind(this));

            sap.ushell.Container = {
                getServiceAsync: sandbox.stub().withArgs("FlpLaunchPage").resolves({
                    getGroupById: this.oGetGroupByIdStub
                })
            };

            this.oBookmarkService = new Bookmark();

            this.oAddBookmarkToHomepageGroupStub = sandbox.stub(this.oBookmarkService, "addBookmarkToHomepageGroup").resolves();
            this.oAddBookmarkToPageStub = sandbox.stub(this.oBookmarkService, "addBookmarkToPage").resolves();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Adds the bookmark to a page if the provided content node type is 'Page'", function (assert) {
        // Arrange
        var oContentNode = {
            id: "page1",
            label: "Page 1",
            type: ContentNodeType.Page,
            isContainer: true
        };

        // Act
        return this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]).then(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 1, "'addBookmarkToPage' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToPage' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[1], "page1", "'addBookmarkToPage' was called with the right page id.");
            assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[2], undefined, "'addBookmarkToPage' was called without content provider id.");
        }.bind(this));
    });

    QUnit.test("Passes the contentProviderId param on when provided", function (assert) {
        // Arrange
        var oContentNode = {
            id: "page1",
            label: "Page 1",
            type: ContentNodeType.Page,
            isContainer: true
        };
        // Act
        return this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode], undefined, "myContentProvider").then(function () {
            // Assert´
            assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[2], "myContentProvider", "'addBookmarkToPage' was called with the content provider id.");
        }.bind(this));
    });

    QUnit.test("Adds the bookmark to a classic homepage group if the provided content node type is 'HomepageGroup'", function (assert) {
        // Arrange
        var oContentNode = {
            id: "group1",
            label: "Group 1",
            type: ContentNodeType.HomepageGroup,
            isContainer: true
        };

        // Act
        return this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]).then(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 0, "'addBookmarkToPage' wasn't called.");
            assert.strictEqual(this.oGetGroupByIdStub.firstCall.args[0], "group1", "'getGroupById' of the launchpage service was called with the right group id.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], this.oMockGroups.group1, "'addBookmarkToHomepageGroup' was called with the right launchpage group.");
        }.bind(this));
    });

    QUnit.test("Adds the bookmark to multiple content nodes if multiple content nodes were provided", function (assert) {
        // Arrange
        var aContentNodes = [{
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
        return this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, aContentNodes).then(function () {
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
        }.bind(this));
    });

    QUnit.test("Rejects the promise if one of the multiple content nodes couldn't be saved", function (assert) {
        // Arrange
        this.oAddBookmarkToPageStub.rejects("Error while adding content node of type 'Page'");

        var aContentNodes = [{
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
        return this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, aContentNodes).catch(function (oError) {
            // Assert
            assert.strictEqual(oError.toString(), "Error while adding content node of type 'Page'", "The promise was rejected with the correct error message.");

            // HomepageGroup (first content node)
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
            assert.strictEqual(this.oGetGroupByIdStub.firstCall.args[0], "group1", "'getGroupById' of the launchpage service was called with the right group id.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], this.oMockGroups.group1, "'addBookmarkToHomepageGroup' was called with the right launchpage group.");

            // Page (second content node)
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 1, "'addBookmarkToPage' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToPage' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[1], "page1", "'addBookmarkToPage' was called with the right page id.");
        }.bind(this));
    });

    QUnit.test("Rejects the promise if a content node of type 'HomepageGroup' couldn't be saved", function (assert) {
        // Arrange
        this.oAddBookmarkToHomepageGroupStub.rejects("Error while adding content node of type 'HomepageGroup'");

        var oContentNode = {
            id: "group1",
            label: "Group 1",
            type: ContentNodeType.HomepageGroup,
            isContainer: true
        };

        // Act
        return this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]).catch(function (oError) {
            // Assert
            assert.strictEqual(oError.toString(), "Error while adding content node of type 'HomepageGroup'", "The promise was rejected with the correct error message.");

            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
            assert.strictEqual(this.oGetGroupByIdStub.firstCall.args[0], "group1", "'getGroupById' of the launchpage service was called with the right group id.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], this.oMockGroups.group1, "'addBookmarkToHomepageGroup' was called with the right launchpage group.");
        }.bind(this));
    });

    QUnit.test("Rejects the promise if a content node of type 'Page' couldn't be saved", function (assert) {
        // Arrange
        this.oAddBookmarkToPageStub.rejects("Error while adding content node of type 'Page'");

        var oContentNode = {
            id: "page1",
            label: "Page 1",
            type: ContentNodeType.Page,
            isContainer: true
        };

        // Act
        return this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]).catch(function (oError) {
            // Assert
            assert.strictEqual(oError.toString(), "Error while adding content node of type 'Page'", "The promise was rejected with the correct error message.");

            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 1, "'addBookmarkToPage' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToPage' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[1], "page1", "'addBookmarkToPage' was called with the right page id.");
        }.bind(this));
    });

    QUnit.test("Rejects the promise if the provided content node type is not supported", function (assert) {
        // Arrange
        var oContentNode = {
            id: "container",
            label: "Some container",
            type: "UnsupportedType",
            isContainer: true
        };

        // Act
        return this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]).catch(function (oError) {
            // Assert
            assert.strictEqual(
                oError.toString(),
                "Bookmark Service: The API needs to be called with a valid content node type. 'UnsupportedType' is not supported.",
                "The promise was rejected with the correct error message."
            );
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 0, "'addBookmarkToPage' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroupStub' wasn't called.");
        }.bind(this));
    });

    QUnit.test("Rejects the promise if one of the provided content nodes doesn't have a type", function (assert) {
        // Arrange
        var oContentNode = {
            id: "page1",
            label: "Page 1",
            isContainer: true
        };

        // Act
        return this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]).catch(function (oError) {
            // Assert
            assert.strictEqual(oError.toString(), "Bookmark Service: Not a valid content node.", "The promise was rejected with the correct error message.");
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 0, "'addBookmarkToPage' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroupStub' wasn't called.");
        }.bind(this));
    });

    QUnit.test("Rejects the promise if the provided content node is not a container", function (assert) {
        // Arrange
        var oContentNode = {
            id: "page1",
            label: "Page 1",
            type: ContentNodeType.Page,
            isContainer: false
        };

        // Act
        return this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]).catch(function (oError) {
            // Assert
            assert.strictEqual(oError.toString(), "Bookmark Service: Not a valid content node.", "The promise was rejected with the correct error message.");
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 0, "'addBookmarkToPage' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroupStub' wasn't called.");
        }.bind(this));
    });

    QUnit.module("The function 'addCustomBookmark'", {
        beforeEach: function () {
            this.oConfigStub = sandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);

            sap.ushell.Container = {
                getService: sandbox.stub(),
                getServiceAsync: sandbox.stub()
            };

            sap.ushell.Container.getServiceAsync.withArgs("AppState").resolves({
                getPersistentWhenShared: sandbox.stub().returns(false),
                getSupportedPersistencyMethods: sandbox.stub().returns([])
            });

            this.oBookmarkService = new Bookmark();
            this.oAddBookmarkToContentNodesStub = sandbox.stub(this.oBookmarkService, "_addBookmarkToContentNodes").resolves();

            this.oMockContentNode = {
                id: "mockContentNode",
                label: "Mock Content Node",
                type: ContentNodeType.Page,
                isContainer: true
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves with the correct bookmark config if loadManifest='true'", function (assert) {
        // Arrange
        var oOriginalConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": { title: "Bookmark" }
            },
            chipConfig: { chipId: "chip1" },
            loadManifest: true
        };

        var oBookmarkConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": { title: "Bookmark" }
            },
            chipConfig: { chipId: "chip1" },
            loadManifest: true
        };

        var oEnhancedConfig = {
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
        return this.oBookmarkService.addCustomBookmark("custom.abap.tile", oBookmarkConfig, this.oMockContentNode, "myContentProvider").then(function () {
            assert.deepEqual(
                this.oAddBookmarkToContentNodesStub.firstCall.args,
                [oEnhancedConfig, [this.oMockContentNode], true, "myContentProvider"],
                "The function '_addBookmarkToContentNodes' was called with the enhanced config.");
            assert.deepEqual(oBookmarkConfig, oOriginalConfig, "The provided bookmark config was not altered.");
        }.bind(this));
    });

    QUnit.test("Enhances the bookmark config with additional properties without modifying the provided config object", function (assert) {
        // Arrange
        var oOriginalConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": { title: "Bookmark" }
            },
            chipConfig: { chipId: "chip1" }
        };

        var oBookmarkConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": { title: "Bookmark" }
            },
            chipConfig: { chipId: "chip1" }
        };

        var oEnhancedConfig = {
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
        return this.oBookmarkService.addCustomBookmark("custom.abap.tile", oBookmarkConfig, this.oMockContentNode).then(function () {
            assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args,
                [oEnhancedConfig, [this.oMockContentNode], true, undefined],
                "The function '_addBookmarkToContentNodes' was called with the enhanced config.");
            assert.deepEqual(oBookmarkConfig, oOriginalConfig, "The provided bookmark config was not altered.");
        }.bind(this));
    });

    QUnit.module("The function 'getContentNodes'", {
        beforeEach: function () {
            this.oConfigStub = sandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);

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

            this.oGetGroupsForBookmarksStub = sandbox.stub().callsFake(function () {
                return new jQuery.Deferred().resolve(this.aGroupsMock).promise();
            }.bind(this));

            this.oLaunchPageServiceStub = {
                getGroupsForBookmarks: this.oGetGroupsForBookmarksStub,
                getGroupId: function (oGroup) {
                    return oGroup.id;
                }
            };

            var oGetServiceAsyncStub = sandbox.stub();

            oGetServiceAsyncStub.withArgs("Menu").resolves({
                getContentNodes: this.oGetContentNodesStub
            });

            oGetServiceAsyncStub.withArgs("FlpLaunchPage").resolves(this.oLaunchPageServiceStub);

            sap.ushell.Container = {
                getServiceAsync: oGetServiceAsyncStub
            };

            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns the correct contentNodes if in spaces mode", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);

        // Act
        return this.oBookmarkService.getContentNodes().then(function (aContentNodes) {
            // Assert
            assert.strictEqual(aContentNodes, this.aContentNodeMock, "The right content nodes were returned in spaces mode");
            assert.strictEqual(this.oGetContentNodesStub.callCount, 1, "getContentNodes was called exactly once");
        }.bind(this));
    });

    QUnit.test("Returns the correct contentNodes if in classic home page", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);
        var oExpectedContentNodes = [{
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
        return this.oBookmarkService.getContentNodes().then(function (aContentNodes) {
            // Assert
            assert.deepEqual(aContentNodes, oExpectedContentNodes, "The right content nodes were returned in classic mode");
            assert.strictEqual(this.oGetGroupsForBookmarksStub.callCount, 1, "getGroupsForBookmarks was called exactly once");
        }.bind(this));
    });

    QUnit.module("The function 'addBookmarkToHomepageGroup'", {
        beforeEach: function () {
            this.oConfigStub = sandbox.stub(Config, "last");
            this.oTileMock = {
                title: "Tile 1",
                tileType: "sap.ushell.ui.tile.StaticTile",
                id: "tile1"
            };
            this.oAddBookmarkStub = sandbox.stub().returns(new jQuery.Deferred().resolve(this.oTileMock).promise());
            this.oAddCustomBookmarkStub = sandbox.stub().returns(new jQuery.Deferred().resolve(this.oTileMock).promise());

            this.oLaunchPageServiceStub = {
                addBookmark: this.oAddBookmarkStub,
                addCustomBookmark: this.oAddCustomBookmarkStub
            };

            sap.ushell.Container = {
                getServiceAsync: sandbox.stub().withArgs("FlpLaunchPage").resolves(this.oLaunchPageServiceStub)
            };

            this.oBookmarkService = new Bookmark();

            this.oPublishStub = sandbox.stub();
            sandbox.stub(EventBus, "getInstance").returns({
                publish: this.oPublishStub
            });
        },

        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Rejects if in launchpad spaces mode", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);

        // Act
        return this.oBookmarkService.addBookmarkToHomepageGroup().catch(function (oReturn) {
            assert.strictEqual(oReturn, "Bookmark Service: The API is not available in spaces mode.", "The function resolved with the right error");
        });
    });

    QUnit.test("Calls addBookmark on the LaunchPage service and fires the bookmarkTileAdded event", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);
        var oBookmark = { title: "Bookmark Tile", url: "https://sap.com" };
        var oGroup = { id: "group1", title: "Group 1" };

        // Act
        return this.oBookmarkService.addBookmarkToHomepageGroup(oBookmark, oGroup).then(() => {
            assert.deepEqual(this.oAddBookmarkStub.firstCall.args, [oBookmark, oGroup, undefined], "'addBookmark' of the Launchpage service is called with the correct bookmark parameters & group.");
            assert.deepEqual(
                this.oPublishStub.firstCall.args,
                ["sap.ushell.services.Bookmark", "bookmarkTileAdded", { tile: this.oTileMock, group: oGroup }],
                "'bookmarkTileAdded' event is called with the correct data.");
        });
    });

    QUnit.test("Rejects the promise if 'addBookmark' fails.", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);
        this.oAddBookmarkStub.returns(new jQuery.Deferred().reject("Error message").promise());

        // Act
        return this.oBookmarkService.addBookmarkToHomepageGroup().catch(function (sError) {
            assert.strictEqual(this.oAddBookmarkStub.callCount, 1, "'addBookmark' of the Launchpage service is called once.");
            assert.strictEqual(this.oPublishStub.callCount, 0, "'bookmarkTileAdded' event is not fired if 'addBookmark' failed.");
            assert.strictEqual(sError, "Error message", "The error message is passed into the rejected promise.");
        }.bind(this));
    });

    QUnit.test("passes the contentProviderId on if provided", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);
        var oBookmark = { title: "Bookmark Tile", url: "https://sap.com" };
        var oGroup = { id: "group1", title: "Group 1" };

        // Act
        return this.oBookmarkService.addBookmarkToHomepageGroup(oBookmark, oGroup, true, "myContentProvider").then(function () {
            assert.deepEqual(this.oAddCustomBookmarkStub.firstCall.args[2], "myContentProvider", "'addCustomBookmark' of the Launchpage service is called with contentProviderId.");
        }.bind(this));
    });

    QUnit.test("Calls addCustomBookmark on the LaunchPage service and fires the bookmarkTileAdded event if bCustom is true", function (assert) {
        // Arrange
        var oBookmark = { title: "Bookmark Tile", url: "https://sap.com" };
        var oGroup = { id: "group1", title: "Group 1" };

        // Act
        return this.oBookmarkService.addBookmarkToHomepageGroup(oBookmark, oGroup, true).then(function () {
            assert.deepEqual(this.oAddCustomBookmarkStub.firstCall.args, [oBookmark, oGroup, undefined],
                "'addCustomBookmark' of the Launchpage service is called with the correct bookmark parameters & group.");
            assert.deepEqual(this.oPublishStub.firstCall.args, ["sap.ushell.services.Bookmark", "bookmarkTileAdded", { tile: this.oTileMock, group: oGroup }],
                "'bookmarkTileAdded' event is called with the correct data.");
        }.bind(this));
    });

    QUnit.module("The function countBookmarks", {
        beforeEach: function () {
            this.oPagesServiceStub = {
                countBookmarks: sandbox.stub()
            };
            this.oLaunchPageServiceStub = {
                countBookmarks: sandbox.stub()
            };

            var oGetServiceAsyncStub = sandbox.stub();

            oGetServiceAsyncStub.withArgs("FlpLaunchPage").resolves(this.oLaunchPageServiceStub);
            oGetServiceAsyncStub.withArgs("Pages").resolves(this.oPagesServiceStub);

            sap.ushell.Container = {
                getServiceAsync: oGetServiceAsyncStub
            };
            this.oConfigStub = sandbox.stub(Config, "last").withArgs("/core/spaces/enabled");
            this.oConfigStub.returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Calls the Pages service in spaces mode and returns a Deferred that resolves to the number of bookmarks", function (assert) {
        //Arrange
        this.oPagesServiceStub.countBookmarks.withArgs({ url: "http://www.sap.com", contentProviderId: "myContentProviderId" }).returns(Promise.resolve(3));

        // Act
        var oCountDeferred = this.oBookmarkService.countBookmarks("http://www.sap.com", "myContentProviderId");

        //Assert
        oCountDeferred
            .done(function (iCount) {
                assert.deepEqual(this.oPagesServiceStub.countBookmarks.args[0][0], { url: "http://www.sap.com", contentProviderId: "myContentProviderId" }, "The URL is passed to the Pages service.");
                assert.strictEqual(iCount, 3, "The deferred resolves to the correct value.");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "The promise is not rejected.");
            })
            .always(assert.async());
    });

    QUnit.test("Calls the Pages service in spaces mode and returns a Deferred that rejects in case of an error", function (assert) {
        //Arrange
        this.oPagesServiceStub.countBookmarks.withArgs({ url: "http://www.sap.com", contentProviderId: "myContentProviderId" }).returns(Promise.reject("error"));

        // Act
        var oCountDeferred = this.oBookmarkService.countBookmarks("http://www.sap.com", "myContentProviderId");

        //Assert
        oCountDeferred
            .done(function () {
                assert.ok(false, "The promise is not resolved.");
            })
            .fail(function (sError) {
                assert.deepEqual(this.oPagesServiceStub.countBookmarks.args[0][0], { url: "http://www.sap.com", contentProviderId: "myContentProviderId" }, "The URL is passed to the Pages service.");
                assert.strictEqual(sError, "error", "The deferred rejects with the error.");
            }.bind(this))
            .always(assert.async());
    });

    QUnit.test("Calls the Launchpage service in classic homepage mode and resolves to the same value", function (assert) {
        var done = assert.async();

        //Arrange
        this.oConfigStub.returns(false);
        var oDeferred = new jQuery.Deferred();
        var oReturnValue = {};

        oDeferred.resolve(oReturnValue);
        this.oLaunchPageServiceStub.countBookmarks.withArgs("http://www.sap.com").returns(oDeferred.promise());

        // Act
        this.oBookmarkService.countBookmarks("http://www.sap.com")
            .done(function (oCountValue) {
                //Assert
                assert.strictEqual(this.oLaunchPageServiceStub.countBookmarks.callCount, 1, "The function countBookmarks has been called once.");
                assert.strictEqual(this.oLaunchPageServiceStub.countBookmarks.args[0][0], "http://www.sap.com", "The URL is passed to the Launchpage service.");
                assert.strictEqual(oCountValue, oReturnValue, "The Deferred from the Launchpage service is returned");
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                throw error;
            })
            .always(done);
    });

    QUnit.module("The function deleteBookmarks", {
        beforeEach: function () {
            this.oPagesServiceStub = {
                deleteBookmarks: sandbox.stub()
            };
            this.oLaunchPageServiceStub = {
                deleteBookmarks: sandbox.stub()
            };

            var oGetServiceAsyncStub = sandbox.stub();

            oGetServiceAsyncStub.withArgs("FlpLaunchPage").resolves(this.oLaunchPageServiceStub);
            oGetServiceAsyncStub.withArgs("Pages").resolves(this.oPagesServiceStub);

            sap.ushell.Container = {
                getServiceAsync: oGetServiceAsyncStub
            };
            this.oConfigStub = sandbox.stub(Config, "last").withArgs("/core/spaces/enabled");
            this.oConfigStub.returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Calls the Pages service in spaces mode and returns a Deferred that resolves to the number of bookmarks", function (assert) {
        //Arrange
        this.oPagesServiceStub.deleteBookmarks.withArgs({ url: "http://www.sap.com", contentProviderId: "myContentProviderId" }).returns(Promise.resolve(3));

        // Act
        var oDeleteDeferred = this.oBookmarkService.deleteBookmarks("http://www.sap.com", "myContentProviderId");

        //Assert
        oDeleteDeferred
            .done(function (iCount) {
                assert.deepEqual(this.oPagesServiceStub.deleteBookmarks.args[0][0], { url: "http://www.sap.com", contentProviderId: "myContentProviderId" }, "The URL is passed to the Pages service.");
                assert.strictEqual(iCount, 3, "The deferred resolves to the correct value.");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "The promise is not rejected.");
            })
            .always(assert.async());
    });

    QUnit.test("Calls the Pages service in spaces mode and returns a Deferred that rejects in case of an error", function (assert) {
        //Arrange
        this.oPagesServiceStub.deleteBookmarks.withArgs({ url: "http://www.sap.com", contentProviderId: "myContentProviderId" }).returns(Promise.reject("error"));

        // Act
        var oDeleteDeferred = this.oBookmarkService.deleteBookmarks("http://www.sap.com", "myContentProviderId");

        //Assert
        oDeleteDeferred
            .done(function () {
                assert.ok(false, "The promise is not resolved.");
            })
            .fail(function (sError) {
                assert.deepEqual(this.oPagesServiceStub.deleteBookmarks.args[0][0], { url: "http://www.sap.com", contentProviderId: "myContentProviderId" }, "The URL is passed to the Pages service.");
                assert.strictEqual(sError, "error", "The deferred rejects with the error.");
            }.bind(this))
            .always(assert.async());
    });

    QUnit.test("Calls the Launchpage service in classic homepage mode and passes the return value through", function (assert) {
        var done = assert.async();

        // Arrange
        this.oConfigStub.returns(false);
        var oReturnValue = {};
        var oDeferred = new jQuery.Deferred().resolve(oReturnValue);
        this.oLaunchPageServiceStub.deleteBookmarks.withArgs("http://www.sap.com").returns(oDeferred.promise());

        // Act
        this.oBookmarkService.deleteBookmarks("http://www.sap.com")
            .done(function (oResult) {
                // Assert
                assert.strictEqual(this.oLaunchPageServiceStub.deleteBookmarks.args[0][0], "http://www.sap.com", "The URL is passed to the Launchpage service.");
                assert.strictEqual(oResult, oReturnValue, "The correct value from the Launchpage service is returned");
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                throw error;
            })
            .always(done);
    });

    QUnit.test("Publishes the bookmarkTileDeleted event in classic homepage mode", function (assert) {
        //Arrange
        this.oConfigStub.returns(false);
        var oDeferred = new jQuery.Deferred();
        oDeferred.resolve();
        var oPromise = oDeferred.promise();
        this.oLaunchPageServiceStub.deleteBookmarks.withArgs("http://www.sap.com").returns(oPromise);
        var oPublishStub;
        var oPublishPromise = new Promise(function (resolve) {
            oPublishStub = sandbox.stub(EventBus.getInstance(), "publish").callsFake(resolve);
        });
        var oExpectedEventParameters = [
            "sap.ushell.services.Bookmark",
            "bookmarkTileDeleted",
            "http://www.sap.com"
        ];

        // Act
        this.oBookmarkService.deleteBookmarks("http://www.sap.com");

        //Assert
        return oPublishPromise.
            then(function () {
                assert.deepEqual(oPublishStub.args[0], oExpectedEventParameters, "The event is published with the correct parameters.");
            });
    });

    QUnit.module("The function updateBookmarks", {
        beforeEach: function () {
            var oAppStateService = {
                getPersistentWhenShared: sandbox.stub().returns(false),
                getSupportedPersistencyMethods: sandbox.stub().returns([])
            };
            this.oPagesServiceStub = {
                updateBookmarks: sandbox.stub()
            };
            this.oLaunchPageServiceStub = {
                updateBookmarks: sandbox.stub()
            };

            var oGetServiceAsyncStub = sandbox.stub();

            oGetServiceAsyncStub.withArgs("AppState").resolves(oAppStateService);
            oGetServiceAsyncStub.withArgs("FlpLaunchPage").resolves(this.oLaunchPageServiceStub);
            oGetServiceAsyncStub.withArgs("Pages").resolves(this.oPagesServiceStub);

            sap.ushell.Container = {
                getServiceAsync: oGetServiceAsyncStub
            };
            this.oConfigStub = sandbox.stub(Config, "last").withArgs("/core/spaces/enabled");
            this.oConfigStub.returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the Pages service in spaces mode and returns a Deferred", function (assert) {
        //Arrange
        this.oPagesServiceStub.updateBookmarks.withArgs({ url: "http://www.sap.com", contentProviderId: "myContentProviderId" }).returns(Promise.resolve());

        // Act
        var oUpdateDeferred = this.oBookmarkService.updateBookmarks("http://www.sap.com", {}, "myContentProviderId");

        //Assert
        oUpdateDeferred
            .done(function () {
                assert.deepEqual(this.oPagesServiceStub.updateBookmarks.args[0][0], { url: "http://www.sap.com", contentProviderId: "myContentProviderId" }, "The URL is passed to the Pages service.");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "The promise is not rejected.");
            })
            .always(assert.async());
    });

    QUnit.test("Calls the Pages service in spaces mode and returns a Deferred that rejects in case of an error", function (assert) {
        //Arrange
        this.oPagesServiceStub.updateBookmarks.withArgs({ url: "http://www.sap.com", contentProviderId: "myContentProviderId" }).returns(Promise.reject("error"));

        // Act
        var oUpdateDeferred = this.oBookmarkService.updateBookmarks("http://www.sap.com", {}, "myContentProviderId");

        //Assert
        oUpdateDeferred
            .done(function () {
                assert.ok(false, "The promise is not resolved.");
            })
            .fail(function (sError) {
                assert.deepEqual(this.oPagesServiceStub.updateBookmarks.args[0][0], { url: "http://www.sap.com", contentProviderId: "myContentProviderId" }, "The URL is passed to the Pages service.");
                assert.strictEqual(sError, "error", "The deferred rejects with the error.");
            }.bind(this))
            .always(assert.async());
    });

    QUnit.test("Calls the Launchpage service in classic homepage mode and passes the return value through", function (assert) {
        var done = assert.async();

        //Arrange
        this.oConfigStub.returns(false);
        var oReturnValue = {};
        var oDeferred = new jQuery.Deferred().resolve(oReturnValue);
        var oPromise = oDeferred.promise();
        this.oLaunchPageServiceStub.updateBookmarks.withArgs("http://www.sap.com").returns(oPromise);

        // Act
        this.oBookmarkService.updateBookmarks("http://www.sap.com", {})
            .done(function (oResult) {
                //Assert
                assert.strictEqual(this.oLaunchPageServiceStub.updateBookmarks.args[0][0], "http://www.sap.com", "The URL is passed to the Launchpage service.");
                assert.strictEqual(oResult, oReturnValue, "The correct value from the Launchpage service is returned");
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                throw error;
            })
            .always(done);
    });

    QUnit.module("countCustomBookmarks", {
        beforeEach: function () {
            this.oIdentifierMock = {
                url: "someUrl",
                vizType: "someVizType",
                chipId: "someChipId"
            };

            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oSpacesEnabledStub = sandbox.stub(Config, "last").withArgs("/core/spaces/enabled");

            this.oCountCustomBookmarksStub = sandbox.stub().resolves();
            this.oGetServiceAsyncStub.withArgs("FlpLaunchPage").resolves({
                countCustomBookmarks: this.oCountCustomBookmarksStub
            });
            this.oCountBookmarksPagesStub = sandbox.stub().resolves();
            this.oGetServiceAsyncStub.withArgs("Pages").resolves({
                countBookmarks: this.oCountBookmarksPagesStub
            });

            this.oSpacesEnabledStub.returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Calls LaunchPage Service if spaces is disabled", function (assert) {
        // Arrange
        this.oSpacesEnabledStub.returns(false);

        // Act
        return this.oBookmarkService.countCustomBookmarks(this.oIdentifierMock)
            .then(function () {
                // Assert
                assert.ok(true, "promise was resolved");
                assert.strictEqual(this.oCountCustomBookmarksStub.callCount, 1, "countCustomBookmarks was called once");
                assert.deepEqual(this.oCountCustomBookmarksStub.getCall(0).args, [this.oIdentifierMock], "countCustomBookmarks was called with correct parameters");
            }.bind(this));
    });

    QUnit.test("Calls Pages Service if spaces is enabled", function (assert) {
        // Act
        return this.oBookmarkService.countCustomBookmarks(this.oIdentifierMock)
            .then(function () {
                // Assert
                assert.ok(true, "promise was resolved");
                assert.strictEqual(this.oCountBookmarksPagesStub.callCount, 1, "countCustomBookmarks was called exactly once");
                assert.deepEqual(this.oCountBookmarksPagesStub.getCall(0).args, [this.oIdentifierMock], "countCustomBookmarks was called with correct parameters");
            }.bind(this));
    });

    QUnit.test("Rejects if no parameters are supplied", function (assert) {
        // Act
        return this.oBookmarkService.countCustomBookmarks()
            .then(function () {
                // Assert
                assert.ok(false, "promise was resolved");
            })
            .catch(function () {
                assert.ok(true, "promise was rejected");
            });
    });

    QUnit.test("Rejects if the URL is not supplied", function (assert) {
        // Act
        return this.oBookmarkService.countCustomBookmarks({ vizType: "newstile" })
            .then(function () {
                // Assert
                assert.ok(false, "promise was resolved");
            })
            .catch(function () {
                assert.ok(true, "promise was rejected");
            });
    });

    QUnit.test("Rejects if the vizType is not supplied", function (assert) {
        // Act
        return this.oBookmarkService.countCustomBookmarks({ url: "#Action-toappnavsample" })
            .then(function () {
                // Assert
                assert.ok(false, "promise was resolved");
            })
            .catch(function () {
                assert.ok(true, "promise was rejected");
            });
    });

    QUnit.module("deleteCustomBookmarks", {
        beforeEach: function () {
            this.oIdentifierMock = {
                url: "someUrl",
                vizType: "someVizType",
                chipId: "someChipId"
            };

            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oSpacesEnabledStub = sandbox.stub(Config, "last").withArgs("/core/spaces/enabled");

            this.oDeleteCustomBookmarksStub = sandbox.stub().resolves();
            this.oGetServiceAsyncStub.withArgs("FlpLaunchPage").resolves({
                deleteCustomBookmarks: this.oDeleteCustomBookmarksStub
            });
            this.oDeleteBookmarksPagesStub = sandbox.stub().resolves();
            this.oGetServiceAsyncStub.withArgs("Pages").resolves({
                deleteBookmarks: this.oDeleteBookmarksPagesStub
            });

            this.oPublishStub = sandbox.stub();
            sandbox.stub(EventBus, "getInstance").returns({
                publish: this.oPublishStub
            });

            this.oSpacesEnabledStub.returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Calls LaunchPage Service if spaces is disabled", function (assert) {
        // Arrange
        this.oSpacesEnabledStub.returns(false);

        // Act
        return this.oBookmarkService.deleteCustomBookmarks(this.oIdentifierMock)
            .then(function () {
                // Assert
                assert.ok(true, "promise was resolved");
                assert.strictEqual(this.oDeleteCustomBookmarksStub.callCount, 1, "deleteCustomBookmarks was called once");
                assert.deepEqual(this.oDeleteCustomBookmarksStub.getCall(0).args, [this.oIdentifierMock], "deleteCustomBookmarks was called with correct parameters");
            }.bind(this));
    });

    QUnit.test("Publishes 'bookmarkTileDeleted' event on the event bus after a successful bookmark update", function (assert) {
        // Arrange
        this.oSpacesEnabledStub.returns(false);

        // Act
        return this.oBookmarkService.deleteCustomBookmarks(this.oIdentifierMock)
            .then(function () {
                // Assert
                assert.ok(true, "promise was resolved");
                assert.deepEqual(
                    this.oPublishStub.firstCall.args,
                    ["sap.ushell.services.Bookmark", "bookmarkTileDeleted", "someUrl"],
                    "The event 'bookmarkTileDeleted' was published on channel 'sap.ushell.services.Bookmark' with the bookmark URL."
                );
            }.bind(this));
    });

    QUnit.test("Calls Pages Service if spaces is enabled", function (assert) {
        // Act
        return this.oBookmarkService.deleteCustomBookmarks(this.oIdentifierMock)
            .then(function () {
                // Assert
                assert.ok(true, "promise was resolved");
                assert.strictEqual(this.oDeleteBookmarksPagesStub.callCount, 1, "deleteCustomBookmarks was called exactly once");
                assert.deepEqual(this.oDeleteBookmarksPagesStub.getCall(0).args, [this.oIdentifierMock], "deleteCustomBookmarks was called with correct parameters");
            }.bind(this));
    });

    QUnit.test("Rejects if no parameters are supplied", function (assert) {
        // Act
        return this.oBookmarkService.deleteCustomBookmarks()
            .then(function () {
                // Assert
                assert.ok(false, "promise was resolved");
            })
            .catch(function () {
                assert.ok(true, "promise was rejected");
            });
    });

    QUnit.test("Rejects if the URL is not supplied", function (assert) {
        // Act
        return this.oBookmarkService.deleteCustomBookmarks({ vizType: "newstile" })
            .then(function () {
                // Assert
                assert.ok(false, "promise was resolved");
            })
            .catch(function () {
                assert.ok(true, "promise was rejected");
            });
    });

    QUnit.test("Rejects if the vizType is not supplied", function (assert) {
        // Act
        return this.oBookmarkService.deleteCustomBookmarks({ url: "#Action-toappnavsample" })
            .then(function () {
                // Assert
                assert.ok(false, "promise was resolved");
            })
            .catch(function () {
                assert.ok(true, "promise was rejected");
            });
    });

    QUnit.module("updateCustomBookmarks", {
        beforeEach: function () {
            this.oIdentifierMock = {
                url: "someUrl",
                vizType: "someVizType",
                chipId: "someChipId"
            };

            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oSpacesEnabledStub = sandbox.stub(Config, "last").withArgs("/core/spaces/enabled");

            this.oUpdateCustomBookmarksStub = sandbox.stub().resolves();
            this.oGetServiceAsyncStub.withArgs("FlpLaunchPage").resolves({
                updateCustomBookmarks: this.oUpdateCustomBookmarksStub
            });
            this.oUpdateBookmarksPagesStub = sandbox.stub().resolves();
            this.oGetServiceAsyncStub.withArgs("Pages").resolves({
                updateBookmarks: this.oUpdateBookmarksPagesStub
            });
            this.oGetServiceAsyncStub.withArgs("AppState").resolves({
                getPersistentWhenShared: sandbox.stub().returns(false),
                getSupportedPersistencyMethods: sandbox.stub().returns([])
            });

            this.oSpacesEnabledStub.returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Calls LaunchPage Service if spaces is disabled", function (assert) {
        // Arrange
        this.oSpacesEnabledStub.returns(false);

        var oExpectedConfig = {
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

        var oBookmark = {
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
        return this.oBookmarkService.updateCustomBookmarks(this.oIdentifierMock, oBookmark)
            .then(function () {
                // Assert
                assert.ok(true, "promise was resolved");
                assert.strictEqual(this.oUpdateCustomBookmarksStub.callCount, 1, "updateCustomBookmarks was called once");
                assert.deepEqual(this.oUpdateCustomBookmarksStub.getCall(0).args, [this.oIdentifierMock, oExpectedConfig], "updateCustomBookmarks was called with correct parameters");
            }.bind(this));
    });

    QUnit.test("Calls Pages Service if spaces is enabled", function (assert) {
        var oExpectedConfig = {
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

        var oBookmark = {
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
        return this.oBookmarkService.updateCustomBookmarks(this.oIdentifierMock, oBookmark)
            .then(function () {
                // Assert
                assert.ok(true, "promise was resolved");
                assert.strictEqual(this.oUpdateBookmarksPagesStub.callCount, 1, "updateCustomBookmarks was called exactly once");
                assert.deepEqual(this.oUpdateBookmarksPagesStub.getCall(0).args, [this.oIdentifierMock, oExpectedConfig], "updateCustomBookmarks was called with correct parameters");
            }.bind(this));
    });

    QUnit.test("Rejects if mandatory parameters are not supplied", function (assert) {
        // Arrange
        var oBookmark = {
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
        return this.oBookmarkService.updateCustomBookmarks({}, oBookmark)
            .then(function () {
                // Assert
                assert.ok(false, "promise was resolved");
            })
            .catch(function () {
                assert.ok(true, "promise was rejected");
            });
    });

    QUnit.module("Bookmarking with transient urls", {
        beforeEach: async function () {
            sandbox.stub(Config, "last");
            Config.last.withArgs("/core/spaces/enabled").returns(true);
            Config.last.withArgs("/core/shell/enablePersonalization").returns(true);

            sap.ushell.Container = {
                getServiceAsync: sandbox.stub()
            };

            this.oAppStateService = {
                getPersistentWhenShared: sandbox.stub().returns(true),
                getSupportedPersistencyMethods: sandbox.stub().returns([]),
                setAppStateToPublic: sandbox.stub().callsFake((sUrl) => {
                    const sPersistentUrl = sUrl.replace("transient", "persistent");
                    return new jQuery.Deferred().resolve(sPersistentUrl).promise();
                })
            };
            sap.ushell.Container.getServiceAsync.withArgs("AppState").resolves(this.oAppStateService);

            this.oLaunchPageService = {
                getGroupById: sandbox.stub().returns(new jQuery.Deferred().resolve().promise()),
                addBookmark: sandbox.stub().returns(new jQuery.Deferred().resolve().promise()),
                updateBookmarks: sandbox.stub().returns(new jQuery.Deferred().resolve().promise()),
                addCustomBookmark: sandbox.stub().returns(new jQuery.Deferred().resolve().promise()),
                updateCustomBookmarks: sandbox.stub().resolves()
            };
            sap.ushell.Container.getServiceAsync.withArgs("FlpLaunchPage").resolves(this.oLaunchPageService);

            this.oPagesService = {
                addBookmarkToPage: sandbox.stub().resolves(),
                updateBookmarks: sandbox.stub().resolves()
            };
            sap.ushell.Container.getServiceAsync.withArgs("Pages").resolves(this.oPagesService);

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
            delete sap.ushell.Container;
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
