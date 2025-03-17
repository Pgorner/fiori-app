// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview Test User Activity Log
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/Element",
    "sap/ui/core/EventBus",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/Container",
    "sap/ushell/EventHub",
    "sap/ushell/UserActivityLog",
    "sap/ui/thirdparty/jquery"
], function (
    Log,
    Element,
    EventBus,
    hasher,
    Container,
    EventHub,
    UserActivityLog,
    jQuery
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    QUnit.module("sap.ushell.test.components.userActivity.userActivityLog", {
        beforeEach: function (assert) {
            var done = assert.async();
            this.oStorage = {
                "sap.ushell.UserActivityLog.loggingQueue": "",
                "sap.ushell.UserActivityLog.lastNavigationActionData": ""
            };

            sandbox.stub(window.sessionStorage, "setItem").callsFake(function (key, value) {
                this.oStorage[key] = value;
            }.bind(this));
            sandbox.stub(window.sessionStorage, "getItem").callsFake(function (key) {
                return this.oStorage[key];
            }.bind(this));

            Container.init("local").then(function () {
                Container.getServiceAsync("MessageInternal").then(function (MessageService) {
                    this.MessageService = MessageService;
                    done();
                }.bind(this));
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();

            UserActivityLog.deactivate();
            EventHub._reset();

            // Reset the session storage for the loggingQueue
            sessionStorage.removeItem("sap.ushell.UserActivityLog.loggingQueue");
        }
    });

    QUnit.test("Activation", function (assert) {
        UserActivityLog.activate(true);

        var userActivityLog = UserActivityLog.getMessageInfo();
        assert.ok(userActivityLog);
    });

    QUnit.test("Checks that User Log size (number of entries) does not exceed the maximum", function (assert) {
        var index,
            userActivityLog,
            firstLogStruct,
            LastLogStruct;
        UserActivityLog.activate(true);

        for (index = 0; index < 60; index++) {
            UserActivityLog.addMessage(UserActivityLog.messageType.ACTION, "message", index);
        }

        userActivityLog = UserActivityLog.getMessageInfo();
        assert.strictEqual(userActivityLog.userLog.length, 50);

        firstLogStruct = userActivityLog.userLog[0];
        LastLogStruct = userActivityLog.userLog[userActivityLog.userLog.length - 1];

        assert.strictEqual(firstLogStruct.messageID, 10);
        assert.strictEqual(LastLogStruct.messageID, 59);
    });

    QUnit.test("Checks that Log.error messages are logged", function (assert) {
        var userActivityLog,
            logStruct,
            iNumLogsAfterActivation;

        UserActivityLog.activate(true);
        iNumLogsAfterActivation = UserActivityLog.getMessageInfo().userLog.length;

        // Create log error messages
        Log.error("0_Error", "Details_0");
        Log.error("1_Error", "Details_1");
        Log.error("2_Error", "Details_2");

        Log.error("3_Error");
        Log.error("4_Error");
        Log.error("5_Error");

        userActivityLog = UserActivityLog.getMessageInfo();
        assert.strictEqual(userActivityLog.userLog.length - iNumLogsAfterActivation, 6);

        logStruct = userActivityLog.userLog[1 + iNumLogsAfterActivation];
        assert.strictEqual(logStruct.messageText, "1_Error, Details_1");

        logStruct = userActivityLog.userLog[3 + iNumLogsAfterActivation];
        assert.strictEqual(logStruct.messageText, "3_Error");
    });

    QUnit.test("Checks that Message Service error messages are logged", function (assert) {
        var userActivityLog,
            logStruct,
            iNumLogsAfterInit;

        UserActivityLog.activate(true);

        // Create error messages using Message service
        this.MessageService.init(sandbox.stub());

        iNumLogsAfterInit = UserActivityLog.getMessageInfo().userLog.length;

        this.MessageService.error("6_Message", "Title_6");
        this.MessageService.error("7_Message", "Title_7");
        this.MessageService.error("8_Message", "Title_8");

        this.MessageService.error("9_Message");
        this.MessageService.error("10_Message");
        this.MessageService.error("11_Message");

        userActivityLog = UserActivityLog.getMessageInfo();
        assert.strictEqual(userActivityLog.userLog.length - iNumLogsAfterInit, 6);

        logStruct = userActivityLog.userLog[1 + iNumLogsAfterInit];
        assert.strictEqual(logStruct.messageText, "7_Message");

        logStruct = userActivityLog.userLog[4 + iNumLogsAfterInit];
        assert.strictEqual(logStruct.messageText, "10_Message");
    });

    QUnit.test("Checks UserActivityLog.addMessage API", function (assert) {
        var userActivityLog,
            logStruct,
            str = "",
            strLength = 0,
            index,
            iNumLogsAfterActivation;

        UserActivityLog.activate(true);
        iNumLogsAfterActivation = UserActivityLog.getMessageInfo().userLog.length;

        // Use UserActivityLog addMessage API
        UserActivityLog.addMessage(UserActivityLog.messageType.ACTION, "12_Action", "12__Action_ID");
        UserActivityLog.addMessage(UserActivityLog.messageType.ACTION, "13_Action", "13__Action_ID");
        UserActivityLog.addMessage(UserActivityLog.messageType.ACTION, "14_Action");
        UserActivityLog.addMessage(UserActivityLog.messageType.ACTION, "15_Action");
        UserActivityLog.addMessage(UserActivityLog.messageType.ERROR, "16_Error", "16_Error_ID");
        UserActivityLog.addMessage(UserActivityLog.messageType.ERROR, "17_Error", "17_Error_ID");
        UserActivityLog.addMessage(UserActivityLog.messageType.ERROR, "18_Error");

        // Test addMessage with large message text
        for (index = 0; index < 250; index = index + 1) {
            str = str + "1234567890";
            strLength = strLength + 10;
        }
        UserActivityLog.addMessage(UserActivityLog.messageType.ERROR, str);

        // Test addMessage with non-existing message type
        UserActivityLog.addMessage("NonExistingType", "20_Error");

        userActivityLog = UserActivityLog.getMessageInfo();
        assert.strictEqual(userActivityLog.userLog.length - iNumLogsAfterActivation, 8);

        logStruct = userActivityLog.userLog[iNumLogsAfterActivation];
        assert.strictEqual(logStruct.messageText, "12_Action");
        assert.strictEqual(logStruct.messageID, "12__Action_ID");

        logStruct = userActivityLog.userLog[4 + iNumLogsAfterActivation];
        assert.strictEqual(logStruct.messageText, "16_Error");
        assert.strictEqual(logStruct.messageID, "16_Error_ID");

        logStruct = userActivityLog.userLog[6 + iNumLogsAfterActivation];
        assert.strictEqual(logStruct.messageText, "18_Error");
        assert.notOk(logStruct.messageID);

        logStruct = userActivityLog.userLog[7 + iNumLogsAfterActivation];
        assert.strictEqual(logStruct.messageText.length, strLength);
    });

    QUnit.test("Checks that LPD events (i.e. user actions) are logged as 'Actions'", function (assert) {
        UserActivityLog.activate(true);
        var iNumLogsAfterActivation = UserActivityLog.getMessageInfo().userLog.length;

        EventBus.getInstance().publish("launchpad", "createGroupAt");
        var userActivityLog = UserActivityLog.getMessageInfo();
        var logStruct = userActivityLog.userLog[iNumLogsAfterActivation];
        assert.strictEqual(logStruct.type, "ACTION");
        var indexOfActionName = logStruct.messageText.indexOf("Create Group");
        assert.notStrictEqual(indexOfActionName, -1);

        EventBus.getInstance().publish("launchpad", "addBookmarkTile", { title: "bookmarkTitle", url: "bookmarkUrl" });
        userActivityLog = UserActivityLog.getMessageInfo();
        logStruct = userActivityLog.userLog[1 + iNumLogsAfterActivation];
        assert.strictEqual(logStruct.type, "ACTION");
        indexOfActionName = logStruct.messageText.indexOf("Add Bookmark");
        assert.notStrictEqual(indexOfActionName, -1);

        assert.strictEqual(userActivityLog.userLog.length - iNumLogsAfterActivation, 2);
    });

    QUnit.test("Checks if the received form factor is one of general form factor types of UI5", function (assert) {
        UserActivityLog.activate(true);
        var userActivityLog = UserActivityLog.getMessageInfo();

        assert.ok(["phone", "tablet", "desktop"].indexOf(userActivityLog.formFactor) >= 0, "form factor valid");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Checks that LaunchPage service functions failures are logged", function (assert) {
        var done = assert.async();

        // Arrange
        UserActivityLog.activate(true);

        sandbox.useFakeTimers({
            now: 1,
            toFake: [ "Date" ]
        });

        Container.getServiceAsync("FlpLaunchPage")
            .then(function (oLaunchPageService) {
                var oUserActivityLogLaunchPageAdapter = {
                    addBookmark: sandbox.stub().returns(new jQuery.Deferred().reject().promise())
                };
                sandbox.stub(oLaunchPageService, "_getAdapter").returns(oUserActivityLogLaunchPageAdapter);

                // Act
                oLaunchPageService.addBookmark({ title: "bookmarkTitle", url: "bookmarkUrl" })
                    .fail(function () {
                        // Assert
                        var oUserActivityLog = UserActivityLog.getMessageInfo();
                        assert.deepEqual(oUserActivityLog, {
                            userDetails: {
                                fullName: "Default User",
                                userId: "DEFAULT_USER",
                                eMail: "",
                                Language: "en"
                            },
                            shellState: "default-home",
                            navigationData: {},
                            userLog: [
                                {
                                    type: "ERROR",
                                    messageText: "Fail to add bookmark for URL: bookmarkUrl and Title: bookmarkTitle",
                                    time: "1970-01-01T00:00:00.001Z"
                                }
                            ],
                            formFactor: "desktop"
                        }, "The correct activity log structure has been found.");
                        done();
                    })
                    .done(function () {
                        assert.ok(false, "The promise should have been rejected.");
                        done();
                    });
            });
    });

    QUnit.test("Navigation Hash is stored after pressing on tile", function (assert) {
        var orignHash = "origin-hash";
        var emptyFunction = function () { };

        var oTile = {
            isA: sandbox.stub(),
            getDebugInfo: sandbox.stub(),
            getId: sandbox.stub(),
            getBindingContext: sandbox.stub().returns({
                getPath: sandbox.stub(),
                getModel: sandbox.stub().returns({
                    getProperty: sandbox.stub().returns({
                        title: "title"
                    })
                })
            }),
            addMessage: sandbox.stub(),
            messageType: {
                ACTION: ""
            },
            _getLastNavActionFromStorage: sandbox.stub().returns({}),
            _putInSessionStorage: sandbox.stub().returns({})
        };

        oTile.isA.withArgs("sap.ushell.ui.launchpad.Tile").returns(true);

        sandbox.stub(Element, "getElementById").returns({
            getModel: sandbox.stub().returns({
                getData: sandbox.stub().returns({
                    title: "title"
                })
            })
        });

        sandbox.stub(hasher, "getHash").returns(orignHash);

        var fnTilePressed = UserActivityLog._tileOnTapDecorator.apply(oTile, [emptyFunction]);

        fnTilePressed.apply(oTile);

        var args = oTile._putInSessionStorage.args[0][1];
        var resultHash = JSON.parse(args).navigationHash;

        assert.strictEqual(resultHash, "#" + orignHash, "hash from url is - " + orignHash + ", and hash returned from function is - " + resultHash);
    });

    /*
     * Test that _handleActionEventHub works correctly.  This can only be
     * tested indirectly, by checking that
     * sap.ushell.UserActivityLog.addMessage was called with the right
     * parameters _and_ the eventbus didn't publish the event (just in case a
     * "subscribe" was forgotten in the code)
     */
    QUnit.test("_handleActionEventHub works properly", function (assert) {
        // Arrange
        var done = assert.async();

        // Stop the EventBus from emitting the "showCatalog" event but still allow
        // it to publish other events.
        var oPublishStub = sinon.stub(EventBus.getInstance(), "publish");
        oPublishStub.callThrough();
        oPublishStub.withArgs("showCatalog").returns();

        UserActivityLog.activate(true);

        var oAddMessageSpy = sinon.spy(UserActivityLog, "addMessage");

        // Act
        EventHub.emit("showCatalog", { sId: "showCatalog", oData: Date.now() });

        // Assert
        EventHub.once("showCatalog").do(function () {
            assert.strictEqual(oAddMessageSpy.callCount, 1, "_handleAction was called");
            assert.strictEqual(oAddMessageSpy.args[0][1], "Show Catalog", "_handleAction was called with the right parameters");

            oAddMessageSpy.restore();
            oPublishStub.restore();
            done();
        });
    });
});
