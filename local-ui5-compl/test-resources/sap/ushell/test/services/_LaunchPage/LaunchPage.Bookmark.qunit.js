// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit test for Bookmark functions in services.LaunchPage - sap.ushell
 * @deprecated since 1.120.0
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ushell/services/LaunchPage",
    "sap/ui/thirdparty/jquery"
], function (
    Log,
    LaunchPage,
    jQuery
) {
    "use strict";

    /* global QUnit, sinon*/

    QUnit.dump.maxDepth = 10;

    var sandbox = sinon.createSandbox({});

    QUnit.module("The function addCustomBookmark with the function _hasRequiredBookmarkParameters", {
        beforeEach: function () {
            this.oGroup = {
                id: "myGroupId",
                contentProvider: "myContentProvider"
            };
            this.oParameters = {
                title: "myTitle",
                url: "myUrl"
            };

            this.sGroupTitle = "myGroupTitle";

            this.oLps = new LaunchPage({});
            this.oLogErrorStub = sandbox.stub(Log, "error");
            this.oIsGroupLockedStub = sandbox.stub(this.oLps, "isGroupLocked").withArgs(this.oGroup).returns(false);
            this.oGetGroupTitleStub = sandbox.stub(this.oLps, "getGroupTitle").returns(this.sGroupTitle);
            this.oAddCustomBookmarkStub = sandbox.stub();
            this.oAddCustomBookmarkStub.withArgs(this.oParameters, this.oGroup).returns(new jQuery.Deferred().resolve());
            this.oGetAdapterStub = sandbox.stub(this.oLps, "_getAdapter").returns({
                addCustomBookmark: this.oAddCustomBookmarkStub
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Throws an error if no title is present", function (assert) {
        // Arrange
        delete this.oParameters.title;

        // Act
        try {
            this.oLps.addCustomBookmark(this.oParameters);
        } catch (oError) {
            // Assert
            assert.strictEqual(oError.message, "Title missing in bookmark configuration", "The error message is correct");
            assert.strictEqual(this.oLogErrorStub.callCount, 1, "Log error was called once");
            assert.deepEqual(this.oLogErrorStub.getCall(0).args, ["Add Bookmark - Missing title"], "The correct error was logged");
        }
    });

    QUnit.test("Throws an error if no url is present", function (assert) {
        // Arrange
        delete this.oParameters.url;

        // Act
        try {
            this.oLps.addCustomBookmark(this.oParameters);
        } catch (oError) {
            // Assert
            assert.strictEqual(oError.message, "URL missing in bookmark configuration", "The error message is correct");
            assert.strictEqual(this.oLogErrorStub.callCount, 1, "Log error was called once");
            assert.deepEqual(this.oLogErrorStub.getCall(0).args, ["Add Bookmark - Missing URL"], "The correct error was logged");
        }
    });

    QUnit.test("Rejects if the group is locked", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oIsGroupLockedStub.withArgs(sinon.match.any).returns(true);
        var sExpectedMessage = "Tile cannot be added, target group (" + this.sGroupTitle + ")is locked!";

        // Act
        this.oLps.addCustomBookmark(this.oParameters, this.oGroup)
            .fail(function (sError) {
                // Assert
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "Log error was called once");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, [sExpectedMessage], "The correct error was logged");
                assert.strictEqual(sError, sExpectedMessage, "The promise got rejected with the correct error");
            }.bind(this))
            .always(fnDone);
    });

    QUnit.test("Resolves and calls the right functions", function (assert) {
        // Arrange

        // Act
        return this.oLps.addCustomBookmark(this.oParameters, this.oGroup)
            .then(function () {
                // Assert
                assert.strictEqual(this.oGetAdapterStub.callCount, 1, "getAdapter was called once");
                assert.deepEqual(this.oGetAdapterStub.getCall(0).args, [this.oGroup.contentProvider], "getAdapter was called with the right args");
                assert.strictEqual(this.oAddCustomBookmarkStub.callCount, 1, "addCustomBookmark was called once");
                assert.deepEqual(this.oAddCustomBookmarkStub.getCall(0).args, [this.oParameters, this.oGroup, undefined], "addCustomBookmark was called with the right args");
            }.bind(this));
    });

    QUnit.test("Resolves and calls the right functions", function (assert) {
        // Arrange
        var done = assert.async();
        this.oAddCustomBookmarkStub.withArgs(sinon.match.any, sinon.match.any).returns((new jQuery.Deferred()).reject());
        var sExpectedMessage = "Fail to add bookmark for URL: " + this.oParameters.url + " and Title: " + this.oParameters.title;

        // Act
        this.oLps.addCustomBookmark(this.oParameters, this.oGroup)
            .fail(function () {
                // Assert
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "Log error was called once");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, [sExpectedMessage], "The correct error was logged");
            }.bind(this))
            .always(done);
    });

    QUnit.module("countCustomBookmarks", {
        beforeEach: function () {
            this.oIdentifierMock = {
                url: "someUrl",
                vizType: "someVizType",
                chipId: "someChipId"
            };

            this.oLps = new LaunchPage({});

            this.oCountCustomBookmarksStub = sandbox.stub().resolves();
            this.oGetAdapterStub = sandbox.stub(this.oLps, "_getAdapter").returns({
                countCustomBookmarks: this.oCountCustomBookmarksStub
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls Adapter method countCustomBookmarks", function (assert) {
        // Arrange
        var aExpectedArgs = [
            this.oIdentifierMock
        ];
        // Act
        return this.oLps.countCustomBookmarks(this.oIdentifierMock)
            .then(function () {
                // Assert
                assert.ok(true, "Promise was resolved");
                assert.strictEqual(this.oCountCustomBookmarksStub.callCount, 1, "countCustomBookmarks was called once");
                assert.deepEqual(this.oCountCustomBookmarksStub.getCall(0).args, aExpectedArgs, "countCustomBookmarks was called with correct parameters");
            }.bind(this));
    });

    QUnit.test("Rejects if url is missing", function (assert) {
        // Arrange
        delete this.oIdentifierMock.url;
        var sExpectedMessage = "countCustomBookmarks: Some required parameters are missing.";
        // Act
        return this.oLps.countCustomBookmarks(this.oIdentifierMock)
            .then(function () {
                // Assert
                assert.ok(false, "Promise was resolved");
            })
            .catch(function (sError) {
                assert.ok(true, "Promise was rejected");
                assert.strictEqual(sError, sExpectedMessage, "Rejects with the correct message");
            });
    });

    QUnit.test("Rejects if vizType is missing", function (assert) {
        // Arrange
        delete this.oIdentifierMock.vizType;
        var sExpectedMessage = "countCustomBookmarks: Some required parameters are missing.";
        // Act
        return this.oLps.countCustomBookmarks(this.oIdentifierMock)
            .then(function () {
                // Assert
                assert.ok(false, "Promise was resolved");
            })
            .catch(function (sError) {
                assert.ok(true, "Promise was rejected");
                assert.strictEqual(sError, sExpectedMessage, "Rejects with the correct message");
            });
    });

    QUnit.module("deleteCustomBookmarks", {
        beforeEach: function () {
            this.oIdentifierMock = {
                url: "someUrl",
                vizType: "someVizType",
                chipId: "someChipId"
            };

            this.oLps = new LaunchPage({});

            this.oDeleteCustomBookmarksStub = sandbox.stub().resolves();
            this.oGetAdapterStub = sandbox.stub(this.oLps, "_getAdapter").returns({
                deleteCustomBookmarks: this.oDeleteCustomBookmarksStub
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls Adapter method deleteCustomBookmarks", function (assert) {
        // Arrange
        var aExpectedArgs = [
            this.oIdentifierMock
        ];
        // Act
        return this.oLps.deleteCustomBookmarks(this.oIdentifierMock)
            .then(function () {
                // Assert
                assert.ok(true, "Promise was resolved");
                assert.strictEqual(this.oDeleteCustomBookmarksStub.callCount, 1, "deleteCustomBookmarks was called once");
                assert.deepEqual(this.oDeleteCustomBookmarksStub.getCall(0).args, aExpectedArgs, "deleteCustomBookmarks was called with correct parameters");
            }.bind(this));
    });

    QUnit.test("Rejects if url is missing", function (assert) {
        // Arrange
        delete this.oIdentifierMock.url;
        var sExpectedMessage = "deleteCustomBookmarks: Some required parameters are missing.";
        // Act
        return this.oLps.deleteCustomBookmarks(this.oIdentifierMock)
            .then(function () {
                // Assert
                assert.ok(false, "Promise was resolved");
            })
            .catch(function (sError) {
                assert.ok(true, "Promise was rejected");
                assert.strictEqual(sError, sExpectedMessage, "Rejects with the correct message");
            });
    });

    QUnit.test("Rejects if vizType is missing", function (assert) {
        // Arrange
        delete this.oIdentifierMock.vizType;
        var sExpectedMessage = "deleteCustomBookmarks: Some required parameters are missing.";
        // Act
        return this.oLps.deleteCustomBookmarks(this.oIdentifierMock)
            .then(function () {
                // Assert
                assert.ok(false, "Promise was resolved");
            })
            .catch(function (sError) {
                assert.ok(true, "Promise was rejected");
                assert.strictEqual(sError, sExpectedMessage, "Rejects with the correct message");
            });
    });

    QUnit.module("updateCustomBookmarks", {
        beforeEach: function () {
            this.oConfigMock = {
                chipConfig: {
                    chipId: "someChipId"
                }
            };

            this.oIdentifierMock = {
                url: "someUrl",
                vizType: "someVizType",
                chipId: "someChipId"
            };

            this.oLps = new LaunchPage({});

            this.oUpdateCustomBookmarksStub = sandbox.stub().resolves();
            this.oGetAdapterStub = sandbox.stub(this.oLps, "_getAdapter").returns({
                updateCustomBookmarks: this.oUpdateCustomBookmarksStub
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls Adapter method updateCustomBookmarks", function (assert) {
        // Arrange
        var aExpectedArgs = [
            this.oIdentifierMock,
            this.oConfigMock
        ];
        // Act
        return this.oLps.updateCustomBookmarks(this.oIdentifierMock, this.oConfigMock)
            .then(function () {
                // Assert
                assert.ok(true, "Promise was resolved");
                assert.strictEqual(this.oUpdateCustomBookmarksStub.callCount, 1, "updateCustomBookmarks was called once");
                assert.deepEqual(this.oUpdateCustomBookmarksStub.getCall(0).args, aExpectedArgs, "updateCustomBookmarks was called with correct parameters");
            }.bind(this));
    });

    QUnit.test("Rejects if url is missing", function (assert) {
        // Arrange
        delete this.oIdentifierMock.url;
        var sExpectedMessage = "updateCustomBookmarks: Some required parameters are missing.";
        // Act
        return this.oLps.updateCustomBookmarks(this.oIdentifierMock, this.oConfigMock)
            .then(function () {
                // Assert
                assert.ok(false, "Promise was resolved");
            })
            .catch(function (sError) {
                assert.ok(true, "Promise was rejected");
                assert.strictEqual(sError, sExpectedMessage, "Rejects with the correct message");
            });
    });

    QUnit.test("Rejects if vizType is missing", function (assert) {
        // Arrange
        delete this.oIdentifierMock.vizType;
        var sExpectedMessage = "updateCustomBookmarks: Some required parameters are missing.";
        // Act
        return this.oLps.updateCustomBookmarks(this.oIdentifierMock, this.oConfigMock)
            .then(function () {
                // Assert
                assert.ok(false, "Promise was resolved");
            })
            .catch(function (sError) {
                assert.ok(true, "Promise was rejected");
                assert.strictEqual(sError, sExpectedMessage, "Rejects with the correct message");
            });
    });

    QUnit.test("Rejects if bookmarkConfig is missing", function (assert) {
        // Arrange
        delete this.oIdentifierMock.vizType;
        var sExpectedMessage = "updateCustomBookmarks: Some required parameters are missing.";
        // Act
        return this.oLps.updateCustomBookmarks(this.oIdentifierMock, undefined)
            .then(function () {
                // Assert
                assert.ok(false, "Promise was resolved");
            })
            .catch(function (sError) {
                assert.ok(true, "Promise was rejected");
                assert.strictEqual(sError, sExpectedMessage, "Rejects with the correct message");
            });
    });
});
