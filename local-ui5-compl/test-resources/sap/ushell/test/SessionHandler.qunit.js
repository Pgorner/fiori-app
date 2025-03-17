// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.SessionHandler
 */
sap.ui.define([
    "sap/ui/core/EventBus",
    "sap/ushell/Container",
    "sap/ushell/SessionHandler",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/components/applicationIntegration/application/PostMessageUtils",
    "sap/ui/util/Storage",
    "sap/base/Log",
    "sap/ushell/Config",
    "sap/ushell/EventHub"
], function (
    EventBus,
    Container,
    SessionHandler,
    AppLifeCycle,
    PostMessageUtils,
    Storage,
    Log,
    Config,
    EventHub
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();


    // Configurations for the session handler
    var oSessionHandlerConfigReminderNoSignout = {
        sessionTimeoutIntervalInMinutes: 30,
        sessionTimeoutReminderInMinutes: 5,
        enableAutomaticSignout: false,
        keepSessionAlivePopupText: "XXX The session is about to expire",
        pageReloadPopupText: "XXX The session was terminated, please reload"
    };
    var oSessionHandlerConfigNoReminderNoSignout = {
        sessionTimeoutIntervalInMinutes: 30,
        sessionTimeoutReminderInMinutes: 0,
        enableAutomaticSignout: false
    };

    QUnit.module("init", {
        before: function () {
            return Container.init("local");
        },
        beforeEach: function () {
            this.oRegisterLogoutStub = sandbox.stub();
            this.oGetServiceAsyncStub = sandbox.stub().returns({
                then: function (fnCallback) {
                    fnCallback({});
                }
            });

            sandbox.stub(Container, "registerLogout").callsFake(this.oRegisterLogoutStub);
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);

            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oPutTimestampInStorageStub = sandbox.stub(this.oSessionHandler, "putTimestampInStorage");
            this.oRegisterCommHandlerStub = sandbox.stub(this.oSessionHandler, "_registerCommHandlers");
            this.oAttachUserEventsStub = sandbox.stub(this.oSessionHandler, "attachUserEvents");
            this.oAttachVisibilityEventsStub = sandbox.stub(this.oSessionHandler, "attachVisibilityEvents");
            this.oInitSessionTimeoutStub = sandbox.stub(this.oSessionHandler, "initSessionTimeout");
            this.oInitTileRequestTimeout = sandbox.stub(this.oSessionHandler, "initTileRequestTimeout");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Test if all setup functions are called as expected", function (assert) {
        // Arrange
        var oConfig = {
            sessionTimeoutIntervalInMinutes: 30,
            sessionTimeoutTileStopRefreshIntervalInMinutes: 15
        };
        // Act
        this.oSessionHandler.init(oConfig);
        // Assert
        assert.ok(this.oRegisterLogoutStub.calledOnce, "registerLogout was called");
        assert.ok(this.oGetServiceAsyncStub.calledOnce, "getServiceAsync called once");
        assert.equal(this.oGetServiceAsyncStub.getCall(0).args[0], "AppLifeCycle", "AppLifeCycle service was called");
        assert.ok(!!this.oSessionHandler.oAppLifeCycleService, "oAppLifeCycleService was defined");
        assert.ok(this.oPutTimestampInStorageStub.calledOnce, "putTimestampInStorage was called");
        assert.ok(this.oRegisterCommHandlerStub.calledOnce, "registerCommHandlerStub was called");
        assert.ok(this.oAttachUserEventsStub.calledOnce, "attachUserEventsStub was called");
        assert.ok(this.oAttachVisibilityEventsStub.calledOnce, "attachVisibilityEvents was called");
        assert.ok(this.oInitSessionTimeoutStub.calledOnce, "initSessionTimeoutStub was called");
        assert.ok(this.oInitTileRequestTimeout.calledOnce, "initTileRequestTimeout was called");
    });

    QUnit.test("Test if all setup functions are called as expected except the disabled timeout types", function (assert) {
        // Arrange
        var oConfig = {
            sessionTimeoutReminderInMinutes: -1,
            sessionTimeoutTileStopRefreshIntervalInMinutes: -1
        };
        // Act
        this.oSessionHandler.init(oConfig);
        // Assert
        assert.ok(this.oRegisterLogoutStub.calledOnce, "registerLogout was called");
        assert.ok(this.oPutTimestampInStorageStub.calledOnce, "putTimestampInStorage was called");
        assert.ok(this.oRegisterCommHandlerStub.calledOnce, "registerCommHandlerStub was called");
        assert.ok(this.oAttachUserEventsStub.calledOnce, "attachUserEventsStub was called");
        assert.ok(this.oAttachVisibilityEventsStub.notCalled, "attachVisibilityEvents was not called");
        assert.ok(this.oInitSessionTimeoutStub.notCalled, "initSessionTimeoutStub was not called");
        assert.ok(this.oInitTileRequestTimeout.notCalled, "initTileRequestTimeout was not called");
    });

    QUnit.test("nwbc event 'nwbcUserIsActive' indeed calls userActivityHandler", function (assert) {
        var done = assert.async(),
            oStub = sandbox.stub(this.oSessionHandler, "userActivityHandler");

        this.oSessionHandler.init({});

        EventHub.on("nwbcUserIsActive").do(function () {
            assert.ok(oStub.calledOnce, "userActivityHandler called twice");
            done();
        });

        EventHub.emit("nwbcUserIsActive", Date.now());
    });

    QUnit.test("enableAutomaticSignout, sessionTimeoutReminderInMinutes is written to the config", function (assert) {
        this.oSessionHandler.init({
            enableAutomaticSignout: true,
            sessionTimeoutReminderInMinutes: 5,
            sessionTimeoutIntervalInMinutes: 10
        });

        assert.deepEqual(this.oSessionHandler.oConfig, {
            enableAutomaticSignout: true,
            sessionTimeoutReminderInMinutes: 5,
            sessionTimeoutIntervalInMinutes: 10
        }, "enableAutomaticSignout was set to true");
    });

    QUnit.test("enableAutomaticSignout defaults to false, sessionTimeoutReminderInMinutes defaults to 0", function (assert) {
        this.oSessionHandler.init({});

        assert.strictEqual(this.oSessionHandler.oConfig.enableAutomaticSignout, false, "enableAutomaticSignout was set to false");
        assert.strictEqual(this.oSessionHandler.oConfig.sessionTimeoutReminderInMinutes, 0, "sessionTimeoutReminderInMinutes was set to 0");
    });

    QUnit.test("sessionTimeoutReminderInMinutes is adapted if sessionTimeoutIntervalInMinutes is smaller", function (assert) {
        this.oSessionHandler.init({
            sessionTimeoutReminderInMinutes: 5,
            sessionTimeoutIntervalInMinutes: 1
        });

        assert.strictEqual(this.oSessionHandler.oConfig.sessionTimeoutReminderInMinutes, 4, "sessionTimeoutReminderInMinutes was set to 4");
        assert.strictEqual(this.oSessionHandler.oConfig.sessionTimeoutIntervalInMinutes, 1, "sessionTimeoutIntervalInMinutes was 1");
    });

    QUnit.test("sessionTimeoutReminderInMinutes === 0 is not adapted if sessionTimeoutIntervalInMinutes === 0", function (assert) {
        this.oSessionHandler.init({
            sessionTimeoutReminderInMinutes: 0,
            sessionTimeoutIntervalInMinutes: 0
        });

        assert.strictEqual(this.oSessionHandler.oConfig.sessionTimeoutReminderInMinutes, 0, "sessionTimeoutReminderInMinutes was 0");
        assert.strictEqual(this.oSessionHandler.oConfig.sessionTimeoutIntervalInMinutes, 0, "sessionTimeoutIntervalInMinutes was 0");
    });

    QUnit.test("sessionTimeoutReminderInMinutes === 0 is not adapted if sessionTimeoutIntervalInMinutes === 0", function (assert) {
        this.oSessionHandler.init({
            sessionTimeoutReminderInMinutes: 0,
            sessionTimeoutIntervalInMinutes: 0
        });

        assert.strictEqual(this.oSessionHandler.oConfig.sessionTimeoutReminderInMinutes, 0, "sessionTimeoutReminderInMinutes was 0");
        assert.strictEqual(this.oSessionHandler.oConfig.sessionTimeoutIntervalInMinutes, 0, "sessionTimeoutIntervalInMinutes was 0");
    });

    QUnit.test("sessionTimeoutReminderInMinutes is adapted if sessionTimeoutIntervalInMinutes has the same value", function (assert) {
        this.oSessionHandler.init({
            sessionTimeoutReminderInMinutes: 5,
            sessionTimeoutIntervalInMinutes: 5
        });

        assert.strictEqual(this.oSessionHandler.oConfig.sessionTimeoutReminderInMinutes, 4, "sessionTimeoutReminderInMinutes was set to 4");
        assert.strictEqual(this.oSessionHandler.oConfig.sessionTimeoutIntervalInMinutes, 5, "sessionTimeoutIntervalInMinutes was 5");
    });

    QUnit.module("initSessionTimeout", {
        before: function () {
            return Container.init("local");
        },
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub().returns({
                then: function (fnCallback) {
                    fnCallback({});
                }
            });
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oModelStub = {
                setProperty: sandbox.stub()
            };
            this.oSessionHandler.oModel = this.oModelStub;
            this.oNotifyServerStub = sandbox.stub(this.oSessionHandler, "notifyServer");
            this.oMonitorUserIsInactiveStub = sandbox.stub(this.oSessionHandler, "monitorUserIsInactive");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Test if all setup functions for the session timeout feature are called as expected", function (assert) {
        // Arrange
        var oConfig = {
            enableAutomaticSignout: true,
            sessionTimeoutReminderInMinutes: 20
        };
        this.oSessionHandler.oConfig = oConfig;

        // Act
        this.oSessionHandler.initSessionTimeout();

        // Assert
        assert.ok(this.oNotifyServerStub.calledOnce, "notifyServer was called");
        assert.ok(this.oMonitorUserIsInactiveStub.calledOnce, "monitorUserIsInactive was called");
        assert.ok(this.oModelStub.setProperty.calledOnce, "oModel.setProperty was called");
    });

    QUnit.test("Test if enableAutomaticSignout and sessionTimeoutReminderInMinutes default values are set", function (assert) {
        // Arrange
        var oConfig = {};
        this.oSessionHandler.oConfig = oConfig;

        // Act
        this.oSessionHandler.initSessionTimeout();

        // Assert
        assert.ok(this.oNotifyServerStub.calledOnce, "notifyServer was called");
        assert.ok(this.oMonitorUserIsInactiveStub.calledOnce, "monitorUserIsInactive was called");
        assert.ok(this.oModelStub.setProperty.calledOnce, "oModel.setProperty was called");
    });

    QUnit.module("initTileRequestTimeout", {
        before: function () {
            return Container.init("local");
        },
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub().returns({
                then: function (fnCallback) {
                    fnCallback({});
                }
            });
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.checkStopBackendRequestRemainingTimeStub = sandbox.stub(this.oSessionHandler, "checkStopBackendRequestRemainingTime");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Test if all setup functions for the tile request timeout feature are called as expected", function (assert) {
        // Arrange
        var oConfig = {
            sessionTimeoutTileStopRefreshIntervalInMinutes: 15
        };
        this.oSessionHandler.oConfig = oConfig;

        // Act
        this.oSessionHandler.initTileRequestTimeout();

        // Assert
        assert.ok(this.checkStopBackendRequestRemainingTimeStub.calledOnce, "checkStopBackendRequestRemainingTime was called");
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, true, "bBackendRequestsActive was initialized");
    });

    QUnit.module("checkStopBackendRequestRemainingTime", {
        before: function () {
            return Container.init("local");
        },
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub().returns({
                then: function (fnCallback) {
                    fnCallback({});
                }
            });
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);
            this.oFakeClock = sandbox.useFakeTimers();
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oGetCurrentDateStub = sandbox.stub(this.oSessionHandler, "_getCurrentDate").returns(new Date());
            this.oGetTimestampFromStorageStub = sandbox.stub(this.oSessionHandler, "getTimestampFromStorage");
            this.oSetTileRequestsActiveStub = sandbox.stub(this.oSessionHandler, "_setConnectionActive");
            this.oCheckTileStopRequestRemainingTimeSpy = sandbox.spy(this.oSessionHandler, "checkStopBackendRequestRemainingTime");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Test if checkStopBackendRequestRemainingTime is called in the expected interval", function (assert) {
        // Arrange
        var oConfig = {
            sessionTimeoutTileStopRefreshIntervalInMinutes: 15
        };
        var oDateFromTenMinutesAgo = new Date(),
            oDateFromTwentyMinutesAgo = new Date();

        oDateFromTenMinutesAgo.setMinutes(oDateFromTenMinutesAgo.getMinutes() - 10);
        oDateFromTwentyMinutesAgo.setMinutes(oDateFromTwentyMinutesAgo.getMinutes() - 20);
        this.oSessionHandler.oConfig = oConfig;
        this.oGetTimestampFromStorageStub.returns(oDateFromTenMinutesAgo);
        // Act & Assert
        // Initial call
        this.oSessionHandler.checkStopBackendRequestRemainingTime();
        assert.ok(this.oCheckTileStopRequestRemainingTimeSpy.calledOnce, "checkStopBackendRequestRemainingTime was not called more than once immediately");
        assert.ok(this.oSetTileRequestsActiveStub.notCalled, "_setConnectionActive was not called before the expected time has passed");
        // Advance 5 minutes to trigger the interval and pretend user was inactive for twenty minutes
        this.oGetTimestampFromStorageStub.returns(oDateFromTwentyMinutesAgo);
        this.oFakeClock.tick(5 * 60 * 1000);
        assert.ok(this.oCheckTileStopRequestRemainingTimeSpy.calledTwice, "checkStopBackendRequestRemainingTime was called a second time after the expected time has passed");
        assert.ok(this.oSetTileRequestsActiveStub.calledOnce, "_setConnectionActive was called after the expected amount of time has passed");
    });

    QUnit.module("_setConnectionActive", {
        before: function () {
            return Container.init("local");
        },
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub().returns({
                then: function (fnCallback) {
                    fnCallback({});
                }
            });
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oCheckTileStopRequestRemainingTimeStub = sandbox.stub(this.oSessionHandler, "checkStopBackendRequestRemainingTime");
            /**
             * @deprecated As of version 1.120
             */
            this.oSetTileVisibleOnHomepageStub = sandbox.stub(this.oSessionHandler, "_setTilesVisibleOnHomepage");
            /**
             * @deprecated As of version 1.120
             */
            this.oSetTileInvisibleOnHomepageStub = sandbox.stub(this.oSessionHandler, "_setTilesInvisibleOnHomepage");

            // EventBus
            this.oPublishStub = sandbox.stub();
            this.oGetEventBusStub = sandbox.stub(EventBus, "getInstance").returns({
                publish: this.oPublishStub
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Test if checkTileStopRequestRemainingTime is called asynchronously if parameter true was provided", function (assert) {
        // Arrange
        var oFakeClock = sandbox.useFakeTimers();
        // Act
        this.oSessionHandler._setConnectionActive(true);
        // Assert
        oFakeClock.tick(100);
        assert.ok(this.oCheckTileStopRequestRemainingTimeStub.calledOnce, "checkTileStopRequestRemainingTime was called after a few ms have passed.");
        oFakeClock.restore();
    });

    QUnit.test("Confirm no event is raised if communication to front-end server is already enabled as desired", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = true;
        // Act
        this.oSessionHandler._setConnectionActive(true);
        // Assert
        assert.strictEqual(this.oPublishStub.callCount, 0, "No event was published.");
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, true, "SessionHandler.bBackendRequestsActive has the expected value.");
    });

    QUnit.test("Confirm no event is raised if communication to front-end server is already disabled as desired", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = false;
        // Act
        this.oSessionHandler._setConnectionActive(false);
        // Assert
        assert.strictEqual(this.oPublishStub.callCount, 0, "No event was published.");
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, false, "SessionHandler.bBackendRequestsActive has the expected value.");
    });

    QUnit.test("Confirm an event is raised if communication to front-end server isn't yet disabled as desired", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = true;
        // Act
        this.oSessionHandler._setConnectionActive(false);
        // Assert
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, false, "SessionHandler.bBackendRequestsActive has the expected value.");
        assert.strictEqual(this.oPublishStub.callCount, 1, "One event was published.");
        assert.deepEqual(this.oPublishStub.getCall(0).args, ["launchpad", "setConnectionToServer", { active: false }], "Arguments as expected.");
    });

    QUnit.test("Confirm an event is raised if communication to front-end server isn't yet enabled as desired", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = false;
        // Act
        this.oSessionHandler._setConnectionActive(true);
        // Assert
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, true, "SessionHandler.bBackendRequestsActive has the expected value.");
        assert.strictEqual(this.oPublishStub.callCount, 1, "One event was published.");
        assert.deepEqual(this.oPublishStub.getCall(0).args, ["launchpad", "setConnectionToServer", { active: true }], "Arguments as expected.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Confirm _setTilesInvisibleOnHomepage is called when parameter false was provided in classical homepage mode", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = true;
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(false);
        // Act
        this.oSessionHandler._setConnectionActive(false);
        // Assert
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, false, "SessionHandler.bBackendRequestsActive has the expected value.");
        assert.ok(this.oSetTileInvisibleOnHomepageStub.calledOnce, "_setTilesInvisibleOnHomepage was called once.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Confirm _setTilesVisibleOnHomepage is called when parameter true was provided in classical homepage mode", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = false;
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(false);
        // Act
        this.oSessionHandler._setConnectionActive(true);
        // Assert
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, true, "SessionHandler.bBackendRequestsActive has the expected value.");
        assert.ok(this.oSetTileVisibleOnHomepageStub.calledOnce, "_setTilesVisibleOnHomepage was called once.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Confirm _setTilesVisible/InvisibleOnHomepage is not called when in FLP spaces mode if parameter is true", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = false;
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);
        // Act
        this.oSessionHandler._setConnectionActive(true);
        // Assert
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, true, "SessionHandler.bBackendRequestsActive has the expected value.");
        assert.ok(this.oSetTileVisibleOnHomepageStub.notCalled, "_setTilesVisibleOnHomepage was not called.");
        assert.ok(this.oSetTileInvisibleOnHomepageStub.notCalled, "_setTilesInvisibleOnHomepage was not called.");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Confirm _setTilesVisible/InvisibleOnHomepage is not called when in FLP spaces mode if parameter is false", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = true;
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);
        // Act
        this.oSessionHandler._setConnectionActive(false);
        // Assert
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, false, "SessionHandler.bBackendRequestsActive has the expected value.");
        assert.ok(this.oSetTileVisibleOnHomepageStub.notCalled, "_setTilesVisibleOnHomepage was not called.");
        assert.ok(this.oSetTileInvisibleOnHomepageStub.notCalled, "_setTilesInvisibleOnHomepage was not called.");
    });

    QUnit.module("_setTileVisible", {
        before: function () {
            return Container.init("local");
        },
        beforeEach: function () {
            var that = this;
            this.oGetServiceAsyncStub = sandbox.stub().returns({
                then: function (fnCallback) {
                    fnCallback({});
                }
            });
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);

            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oUtilsStub = {
                handleTilesVisibility: sandbox.stub()
            };
            this.oRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (modules, callback) {
                var aLoadedModules = [];
                if (Array.isArray(modules)) {
                    modules.forEach(function (module) {
                        switch (module) {
                            case "sap/ushell/utils":
                                aLoadedModules.push(that.oUtilsStub);
                                break;
                            default:
                                break;
                        }
                    });
                }
                callback.apply(null, aLoadedModules);
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Test if sap.ushell.utils.handleTilesVisibility is called", function (assert) {
        // Arrange
        // Act
        this.oSessionHandler._setTilesVisibleOnHomepage();
        // Assert
        assert.ok(this.oUtilsStub.handleTilesVisibility.calledOnce, "sap.ushell.utils.handleTilesVisibility was called");
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.module("_setTilesInvisibleOnHomepage", {
        before: function () {
            return Container.init("local");
        },
        beforeEach: function () {
            var that = this;
            // LaunchPageService
            this.oGetGroupsStub = sandbox.stub().resolves([{
                groupTiles: ["tile1", "tile2"]
            }, {
                groupTiles: ["tile3", "tile4"]
            }]);
            this.oGetGroupTilesStub = sandbox.stub().callsFake(function (group) {
                return group.groupTiles;
            });
            this.oSetTileVisibleStub = sandbox.stub();
            this.oGetServiceAsyncStub = sandbox.stub().callsFake(function (service) {
                if (service === "FlpLaunchPage") {
                    return Promise.resolve({
                        getGroups: that.oGetGroupsStub,
                        getGroupTiles: that.oGetGroupTilesStub,
                        setTileVisible: that.oSetTileVisibleStub
                    });
                }
                return null;
            });
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);
            // EventBus
            this.oPublishStub = sandbox.stub();
            this.oGetEventBusStub = sandbox.stub(EventBus, "getInstance").returns({
                publish: this.oPublishStub
            });
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("Test if tiles are set invisible as expected", function (assert) {
        // Arrange
        var done = assert.async(),
            aExpectedPublishParameters = ["launchpad", "visibleTilesChanged", []];
        // Act
        var oSetTilesInvisiblePromise = this.oSessionHandler._setTilesInvisibleOnHomepage();
        // Assert
        oSetTilesInvisiblePromise.then(function () {
            assert.ok(this.oGetServiceAsyncStub.calledOnce, "getServiceAsync was called");
            assert.ok(this.oGetGroupsStub.calledOnce, "LaunchPageService.getGroups was called");
            assert.ok(this.oGetGroupTilesStub.calledTwice, "LaunchPageService.getGroupTiles was called twice");
            assert.strictEqual(this.oSetTileVisibleStub.callCount, 4, "LaunchPageService.setTileVisible was called four times as expected");
            assert.ok(this.oGetEventBusStub.calledOnce, "getEventBus was called");
            assert.deepEqual(this.oPublishStub.firstCall.args, aExpectedPublishParameters, "publish was called with expected arguments");
            done();
        }.bind(this));
    });

    QUnit.module("monitorUserIsInactive", {
        before: function () {
            return Container.init("local");
        },
        beforeEach: function () {
            // Calculate some points in time: Before, at and after the session timeout warning or notification
            // shall appear. Also calculate the point in time the session is over.
            // This is 20 / 25 / 27 and 30 minutes from time of last interaction in case of a session timeout warning
            // and 20 / 30 / 32 and 30 minutes in case of a session timeout notification (without warning)
            this.calculateTimes = function (oSessionHandlerConfig) {
                this.timeLastInteraction = new Date();
                this.iReminderIntervalInMinutes =
                    oSessionHandlerConfig.sessionTimeoutIntervalInMinutes
                    - oSessionHandlerConfig.sessionTimeoutReminderInMinutes;
                this.timeBeforePopup = new Date(this.timeLastInteraction.getTime());
                this.timeBeforePopup.setMinutes(this.timeLastInteraction.getMinutes() + this.iReminderIntervalInMinutes - 10);
                this.timeAtPopup = new Date(this.timeLastInteraction.getTime());
                this.timeAtPopup.setMinutes(this.timeLastInteraction.getMinutes() + this.iReminderIntervalInMinutes);
                this.timeAfterPopup = new Date(this.timeLastInteraction.getTime());
                this.timeAfterPopup.setMinutes(this.timeLastInteraction.getMinutes() + this.iReminderIntervalInMinutes + 2);
                this.timeOver = new Date(this.timeLastInteraction.getTime());
                this.timeOver.setMinutes(this.timeLastInteraction.getMinutes() + oSessionHandlerConfig.sessionTimeoutIntervalInMinutes);
            };

            // Perform a local ushell bootstrap before each test
            return Container.init("local")
                .then(function () {
                    sandbox.stub(Container, "getServiceAsync").returns(Promise.resolve());
                    // Create session handler for testing and sandbox
                    this.oSessionHandler = new SessionHandler(AppLifeCycle);
                    this.oOpenDialogSpy = sandbox.spy();
                }.bind(this));
        },
        afterEach: function () {
            // Clean up
            clearTimeout(this.oSessionHandler.oMonitorUserIsInactiveTimer);
            clearTimeout(this.oSessionHandler.notifyServerTimer);
            clearTimeout(this.oSessionHandler.oUserActivityTimer);
            sandbox.restore();
        }
    });

    QUnit.test("When reminder is enabled and automatic signout is disabled", function (assert) {
        // ===== Use-case 1: Timeout did not yet happen and session timeout warning dialog did appear =====

        // --- Arrange ---
        this.oSessionHandler.init(oSessionHandlerConfigReminderNoSignout);

        // Prepare timing
        // ... this.timeLastInteraction, this.timeBeforePopup, this.timeAtPopup, this.timeAfterPopup
        //     and this.timeOver
        this.calculateTimes(oSessionHandlerConfigReminderNoSignout);

        // Set time of the last user interaction
        sandbox.stub(this.oSessionHandler, "getTimestampFromStorage").returns(this.timeLastInteraction.toString());

        // Set time now and time popup
        sandbox.stub(this.oSessionHandler, "_getCurrentDate").returns(this.timeBeforePopup);
        sandbox.stub(this.oSessionHandler, "timeNow").returns(Math.floor(this.timeBeforePopup.getTime() / 1000));
        sandbox.stub(this.oSessionHandler, "timePopup").returns(Math.floor(this.timeAtPopup.getTime() / 1000));

        // Spy the windows timeout
        sandbox.stub(window, "setTimeout");

        // Stub the session expired dialog and the continue working dialog
        sandbox.stub(this.oSessionHandler, "createSessionExpiredDialog").returns({
            open: this.oOpenDialogSpy
        });
        sandbox.stub(this.oSessionHandler, "createContinueWorkingDialog").returns({
            open: this.oOpenDialogSpy
        });

        // --- Act ---
        this.oSessionHandler.monitorUserIsInactive();

        // --- Assert ---
        assert.strictEqual(window.setTimeout.callCount, 1,
            "setTimeout called once when time since last user action < time to session over reminder");
        assert.strictEqual(window.setTimeout.args[0][1], 10 * 60 * 1000, // Next run in 10 minutes
            "Next run of monitorUserIsInactive() is scheduled in 10 minutes");
        assert.strictEqual(this.oSessionHandler.createContinueWorkingDialog.callCount, 0,
            "Continue working dialog was not yet created");
        assert.strictEqual(this.oSessionHandler.createSessionExpiredDialog.callCount, 0,
            "Session expired dialog was not created");

        // ===== Use-case 2: Timeout did not yet happen, but session timeout warning dialog did appear =====

        // --- Arrange ---
        window.setTimeout.restore();
        sandbox.stub(window, "setTimeout");
        this.oSessionHandler.timeNow.restore();
        sandbox.stub(this.oSessionHandler, "timeNow").returns(Math.floor(this.timeAfterPopup.getTime() / 1000));
        this.oSessionHandler._getCurrentDate.restore();
        sandbox.stub(this.oSessionHandler, "_getCurrentDate").returns(this.timeAfterPopup);
        sandbox.stub(this.oSessionHandler, "detachUserEvents");
        sandbox.stub(this.oSessionHandler, "detachVisibilityEvents");
        sandbox.spy(this.oSessionHandler, "monitorCountdown");

        // --- Act ---
        this.oSessionHandler.monitorUserIsInactive();

        // --- Assert ---
        assert.strictEqual(window.setTimeout.callCount, 1,
            "setTimeout() not called in monitorUserIsInactive() when time since last user action > time to session over reminder");
        assert.strictEqual(window.setTimeout.args[0][1], 500, "... but in monitorCountdown() after 500 msec");
        assert.strictEqual(this.oSessionHandler.detachUserEvents.callCount, 1,
            "detachUserEvents() is called");
        assert.strictEqual(this.oSessionHandler.detachVisibilityEvents.callCount, 1,
            "detachVisibilityEvents() is called");
        assert.strictEqual(this.oSessionHandler.monitorCountdown.callCount, 1,
            "monitorCountdown() is called");
        assert.strictEqual(this.oSessionHandler.monitorCountdown.args[0][0], true,
            "monitorCountdown() is called from outside");
        assert.strictEqual(this.oOpenDialogSpy.callCount, 1,
            "ContinueWorkingDialog opened");

        // ===== Use-case 3: Timeout did happen =====

        // --- Arrange ---
        window.setTimeout.restore();
        sandbox.stub(window, "setTimeout");
        this.oSessionHandler.timeNow.restore();
        sandbox.stub(this.oSessionHandler, "timeNow").returns(Math.floor(this.timeOver.getTime() / 1000));
        this.oSessionHandler._getCurrentDate.restore();
        sandbox.stub(this.oSessionHandler, "_getCurrentDate").returns(this.timeOver);
        sandbox.stub(this.oSessionHandler, "handleSessionOver");
        this.oSessionHandler.monitorCountdown.restore();
        sandbox.spy(this.oSessionHandler, "monitorCountdown");

        // --- Act ---
        this.oSessionHandler.monitorUserIsInactive();

        // --- Assert -----
        assert.strictEqual(window.setTimeout.callCount, 0,
            "setTimeout() is not called when time since last user action > time to session over");
        assert.strictEqual(this.oSessionHandler.monitorCountdown.callCount, 0, "No further countdown");
        assert.strictEqual(this.oSessionHandler.handleSessionOver.callCount, 1,
            "handleSessionOver() is called");
    });

    QUnit.test("When reminder and automatic signout are disabled", function (assert) {
        // ===== Use-case 1: Timeout did not yet happen and session timeout dialog did not appear =====

        // --- Arrange ---
        this.oSessionHandler.init(oSessionHandlerConfigNoReminderNoSignout);

        // Prepare timing
        // ... this.timeLastInteraction, this.timeBeforePopup, this.timeAtPopup, this.timeAfterPopup
        //     and this.timeOver
        this.calculateTimes(oSessionHandlerConfigNoReminderNoSignout);

        // Set time of the last user interaction
        sandbox.stub(this.oSessionHandler, "getTimestampFromStorage").returns(this.timeLastInteraction.toString());

        // Set time now and time popup
        sandbox.stub(this.oSessionHandler, "_getCurrentDate").returns(this.timeBeforePopup);
        sandbox.stub(this.oSessionHandler, "timeNow").returns(Math.floor(this.timeBeforePopup.getTime() / 1000));
        sandbox.stub(this.oSessionHandler, "timePopup").returns(Math.floor(this.timeAtPopup.getTime() / 1000));

        // Spy the windows timeout
        sandbox.stub(window, "setTimeout");

        // Stub the session expired dialog and the continue working dialog
        sandbox.stub(this.oSessionHandler, "createSessionExpiredDialog").returns({
            open: this.oOpenDialogSpy
        });
        sandbox.stub(this.oSessionHandler, "createContinueWorkingDialog").returns({
            open: this.oOpenDialogSpy
        });

        // --- Act ---
        this.oSessionHandler.monitorUserIsInactive();

        // --- Assert ---
        assert.strictEqual(window.setTimeout.callCount, 1,
            "setTimeout called once when time since last interaction < time to session over");
        assert.strictEqual(window.setTimeout.args[0][1], 10 * 60 * 1000, // Next run in 10 minutes
            "Next run of monitorUserIsInactive() is scheduled in 10 minutes");
        assert.strictEqual(this.oSessionHandler.createContinueWorkingDialog.callCount, 0,
            "Continue working dialog was not created");
        assert.strictEqual(this.oSessionHandler.createSessionExpiredDialog.callCount, 0,
            "Session expired dialog was not yet created");

        // ===== Use-case 1a: Timeout did not yet happen and session timeout dialog did not appear - bRescheduleTimer flag is false =====
        // --- Arrange ---
        window.setTimeout.restore();
        sandbox.stub(window, "setTimeout");
        this.oSessionHandler.timeNow.restore();
        sandbox.stub(this.oSessionHandler, "timeNow").returns(Math.floor(this.timeBeforePopup.getTime() / 1000));
        this.oSessionHandler._getCurrentDate.restore();
        sandbox.stub(this.oSessionHandler, "_getCurrentDate").returns(this.timeBeforePopup);

        // --- Act ---
        this.oSessionHandler.monitorUserIsInactive(false);

        // --- Assert ---
        assert.strictEqual(window.setTimeout.callCount, 0,
            "setTimeout is not called when bRescheduleTimer flag is false");
        assert.strictEqual(this.oSessionHandler.createContinueWorkingDialog.callCount, 0,
            "Continue working dialog was not created");
        assert.strictEqual(this.oSessionHandler.createSessionExpiredDialog.callCount, 0,
            "Session expired dialog was not yet created");


        // ===== Use-case 2: Timeout reached and session timeout dialog appeared =====

        // --- Arrange ---
        window.setTimeout.restore();
        sandbox.stub(window, "setTimeout");
        this.oSessionHandler.timeNow.restore();
        sandbox.stub(this.oSessionHandler, "timeNow").returns(Math.floor(this.timeAfterPopup.getTime() / 1000));
        this.oSessionHandler._getCurrentDate.restore();
        sandbox.stub(this.oSessionHandler, "_getCurrentDate").returns(this.timeAfterPopup);
        sandbox.spy(this.oSessionHandler, "monitorCountdown");

        // --- Act ---
        this.oSessionHandler.monitorUserIsInactive();

        // --- Assert ---
        assert.strictEqual(window.setTimeout.callCount, 0,
            "setTimeout() is not called in monitorUserIsInactive() when time since last interaction > time to session over");
        assert.strictEqual(this.oSessionHandler.monitorCountdown.callCount, 0,
            "monitorCountdown() is not called");
        assert.strictEqual(this.oSessionHandler.createSessionExpiredDialog.callCount, 1,
            "Session expired dialog was created");
        assert.strictEqual(this.oOpenDialogSpy.callCount, 1, "... and opened");
        assert.strictEqual(this.oSessionHandler.createContinueWorkingDialog.callCount, 0,
            "Continue working dialog was not created");
    });

    QUnit.module("notifyServer", {
        beforeEach: function () {
            return Container.init("local")
                .then(function () {
                    sandbox.stub(Container, "getServiceAsync").returns(Promise.resolve());

                    // Create session handler for testing
                    this.oSessionHandler = new SessionHandler(AppLifeCycle);
                    this.oSessionHandler.init(oSessionHandlerConfigReminderNoSignout);

                    // Setup timing
                    var dBaseDate = new Date();
                    this.dDate1 = new Date(dBaseDate.getTime());
                    this.dDate2 = new Date(dBaseDate.getTime());
                    this.dDate1.setMinutes(dBaseDate.getMinutes() + oSessionHandlerConfigReminderNoSignout.sessionTimeoutIntervalInMinutes - 2);
                    this.dDate2.setMinutes(dBaseDate.getMinutes() + oSessionHandlerConfigReminderNoSignout.sessionTimeoutIntervalInMinutes + 2);

                    // Some stubs
                    this.oOpenDialogStub = sandbox.stub();
                    sandbox.stub(this.oSessionHandler, "getTimestampFromStorage").returns(dBaseDate.toString());
                    sandbox.stub(Container, "sessionKeepAlive");
                    sandbox.stub(PostMessageUtils, "postMessageToMultipleIframes").returns();
                }.bind(this));
        },
        afterEach: function () {
            clearTimeout(this.oSessionHandler.oMonitorUserIsInactiveTimer);
            clearTimeout(this.oSessionHandler.notifyServerTimer);
            clearTimeout(this.oSessionHandler.oUserActivityTimer);
            sandbox.restore();
        }
    });

    QUnit.test("Confirm session is extended as expected", function (assert) {
        // Arrange
        // Use-case 1: the time since the last action is smaller then sessionTimeoutIntervalInMinutes
        var oCurrentDateStub = sandbox.stub(this.oSessionHandler, "_getCurrentDate").returns(this.dDate1);
        sandbox.stub(window, "setTimeout");

        // Act
        this.oSessionHandler.notifyServer();

        // Assert
        assert.strictEqual(Container.sessionKeepAlive.callCount, 1,
            "Time from last user action is smaller than sessionTimeoutIntervalInMinutes -> sessionKeepAlive called once");
        assert.strictEqual(PostMessageUtils.postMessageToMultipleIframes.callCount, 1,
            "Time from last user action is smaller than sessionTimeoutIntervalInMinutes -> PostMessageUtils.postMessageToMultipleIframes called once");
        assert.strictEqual(window.setTimeout.callCount, 1,
            "Time from last user action is smaller than sessionTimeoutIntervalInMinutes -> setTimeout called");
        assert.strictEqual(window.setTimeout.args[0][1], oSessionHandlerConfigNoReminderNoSignout.sessionTimeoutIntervalInMinutes * 30 * 1000,
            "setTimeout called in order to wait another sessionTimeoutIntervalInMinutes interval");

        // Use-case 2: the time since the last action is bigger then sessionTimeoutIntervalInMinutes
        oCurrentDateStub.returns(this.dDate2);

        // Arrange
        Container.sessionKeepAlive.resetHistory();
        PostMessageUtils.postMessageToMultipleIframes.resetHistory();
        window.setTimeout.resetHistory();

        // Act
        this.oSessionHandler.notifyServer();

        // Assert
        assert.strictEqual(Container.sessionKeepAlive.callCount, 0,
            "Time from last user action is bigger than sessionTimeoutIntervalInMinutes -> sessionKeepAlive is not called");
        assert.strictEqual(PostMessageUtils.postMessageToMultipleIframes.callCount, 0,
            "Time from last user action is smaller than sessionTimeoutIntervalInMinutes -> PostMessageUtils.postMessageToMultipleIframes is not called");
        assert.strictEqual(window.setTimeout.callCount, 1,
            "Time from last user action is smaller than sessionTimeoutIntervalInMinutes -> setTimeout called");
        assert.strictEqual(window.setTimeout.args[0][1], oSessionHandlerConfigReminderNoSignout.sessionTimeoutIntervalInMinutes * 30 * 1000,
            "setTimeout called in order to wait another sessionTimeoutIntervalInMinutes interval");

        // Cleanup
        window.setTimeout.restore();
    });

    QUnit.test("Caps the maximum timeout to 32bit integer", function (assert) {
        // Arrange
        var oSetTimeoutStub = sandbox.stub(window, "setTimeout");
        sandbox.stub(this.oSessionHandler, "_getCurrentDate").returns(this.dDate1);
        this.oSessionHandler.oConfig.sessionTimeoutIntervalInMinutes = 123123;
        var iMaxTimeout = 2147483647; // (2^31 − 1)
        // Act
        this.oSessionHandler.notifyServer();

        // Assert
        assert.strictEqual(oSetTimeoutStub.callCount, 1, "setTimeout was called");
        assert.strictEqual(oSetTimeoutStub.getCall(0).args[1], iMaxTimeout, "setTimeout was called with maximum timeout");

        // Cleanup
        oSetTimeoutStub.restore();
    });

    QUnit.module("monitorCountdown", {
        beforeEach: function (assert) {
            // Perform a local ushell bootstrap before
            return Container.init("local")
                .then(function () {
                    sandbox.stub(Container, "getServiceAsync").returns(Promise.resolve());

                    // Create session handler for testing and sandbox
                    this.oSessionHandler = new SessionHandler(AppLifeCycle);
                }.bind(this));
        },
        afterEach: function () {
            // Clean up
            sandbox.restore();
            clearTimeout(this.oSessionHandler.oMonitorUserIsInactiveTimer);
            clearTimeout(this.oSessionHandler.notifyServerTimer);
            clearTimeout(this.oSessionHandler.oUserActivityTimer);
        }
    });

    QUnit.test("Confirm countdown works", function (assert) {
        // Arrange
        // ... Session handler
        var oSessionHandler = this.oSessionHandler;
        oSessionHandler.init(oSessionHandlerConfigReminderNoSignout);

        // ... Spies and stubs
        sandbox.spy(oSessionHandler, "handleSessionOver");

        var oCloseKeepAliveDialogSpy = sandbox.spy();
        oSessionHandler.oSessionKeepAliveDialog = {
            close: oCloseKeepAliveDialogSpy
        };

        var oSessionExpiredDialogOpenSpy = sandbox.spy();
        sandbox.stub(oSessionHandler, "createSessionExpiredDialog").returns({
            open: oSessionExpiredDialogOpenSpy
        });

        var oSetModelPropertySpy = sandbox.spy();
        oSessionHandler.oModel = {
            setProperty: oSetModelPropertySpy
        };

        oSessionHandler.logout = sandbox.spy();
        var oEventBusPublishStub = sandbox.stub(EventBus.getInstance(), "publish").returns({});

        // ... Prepare timing
        //     Last user interaction happened just now
        var dNowInSeconds = new Date().getTime();
        var oClock = sandbox.useFakeTimers(dNowInSeconds);
        oSessionHandler.putTimestampInStorage(dNowInSeconds); // Set timestamp last user interaction

        //     Advance time to point where pop up should appear
        var timeToPopupInMs = (oSessionHandlerConfigReminderNoSignout.sessionTimeoutIntervalInMinutes
            - oSessionHandlerConfigReminderNoSignout.sessionTimeoutReminderInMinutes) * 60 * 1000;
        oClock.tick(timeToPopupInMs);

        // Act
        oSessionHandler.monitorCountdown(true);

        // Assert
        assert.strictEqual(oSetModelPropertySpy.calledOnce, true, "Monitoring has been started");
        assert.strictEqual(oSetModelPropertySpy.args[0][0], "/SessionRemainingTimeInSeconds", "The Model has been updated");
        assert.strictEqual(oSetModelPropertySpy.args[0][1], 300, "Initially 300 seconds left until timeout");
        assert.strictEqual(oSessionHandler.handleSessionOver.notCalled, true, "Session is still alive");
        assert.strictEqual(oSessionHandler.logout.notCalled, true, "logout() was not called");
        assert.strictEqual(oSessionExpiredDialogOpenSpy.calledOnce, false, "Session timeout dialog not yet opened");

        oClock.tick(500); // 500 msec later
        assert.strictEqual(oSetModelPropertySpy.calledTwice, true, "+ 0.5 sec: 2nd check");
        assert.ok(oSetModelPropertySpy.args[1][1] === 300 || oSetModelPropertySpy.args[1][1] === 299, true, "Still around 300 seconds left");

        oClock.tick(500);
        assert.strictEqual(oSetModelPropertySpy.args[2][1], 299, "+ 1.0 sec: 299 seconds remaining");
        assert.strictEqual(oSessionHandler.handleSessionOver.notCalled, true, "Session is still alive");
        assert.strictEqual(oEventBusPublishStub.notCalled, true, "No event published yet");
        assert.strictEqual(oCloseKeepAliveDialogSpy.notCalled, true, "Keep alive dialog still open");
        assert.strictEqual(oSessionHandler.logout.notCalled, true, "logout() was not called");
        assert.strictEqual(oSessionExpiredDialogOpenSpy.calledOnce, false, "Session timeout dialog not yet opened");

        oClock.tick(5 * 60 * 1000); // 5 minutes later
        assert.strictEqual(oSessionHandler.handleSessionOver.calledOnce, true, "+ 5 min: Session is over");
        assert.strictEqual(oEventBusPublishStub.calledOnce, true, "+ 5 min: An event has been published");
        assert.deepEqual(oEventBusPublishStub.args[0], ["launchpad", "sessionTimeout"], "That was a launchpad/sessionTimeout event");
        assert.strictEqual(oCloseKeepAliveDialogSpy.calledOnce, true, "KeepAlive dialog was closed");
        assert.strictEqual(oSessionHandler.logout.notCalled, true, "logout() was not called");
        assert.strictEqual(oSessionHandler.createSessionExpiredDialog.calledOnce, true, "Session timeout dialog was created");
        assert.strictEqual(oSessionExpiredDialogOpenSpy.calledOnce, true, "Session timeout dialog was opened");
    });

    QUnit.module("handleSessionOver", {
        beforeEach: function (assert) {
            // Perform a local ushell bootstrap before
            return Container.init("local")
                .then(function () {
                    sandbox.stub(Container, "getServiceAsync").returns(Promise.resolve());

                    // Create session handler for testing and sandbox
                    this.oSessionHandler = new SessionHandler(AppLifeCycle);
                }.bind(this));
        },
        afterEach: function () {
            // Clean up
            clearTimeout(this.oSessionHandler.oMonitorUserIsInactiveTimer);
            clearTimeout(this.oSessionHandler.notifyServerTimer);
            clearTimeout(this.oSessionHandler.oUserActivityTimer);
            sandbox.restore();
        }
    });

    QUnit.test("When reminder and automatic signout are disabled", function (assert) {
        // Arrange
        // ... Session handler
        this.oSessionHandler.init(oSessionHandlerConfigNoReminderNoSignout);

        // ... Spies and stubs
        var oSessionExpiredDialogOpenSpy = sandbox.spy();
        var oSessionExpiredDialogStub = sandbox.stub(this.oSessionHandler, "createSessionExpiredDialog").returns({
            open: oSessionExpiredDialogOpenSpy
        });
        var oEventBusPublishStub = sandbox.stub(EventBus.getInstance(), "publish").returns({});
        const oLogoutStub = sandbox.stub(sap.ushell.Container, "defaultLogout");

        // Act
        this.oSessionHandler.handleSessionOver();

        // Assert
        assert.strictEqual(oEventBusPublishStub.calledOnce, true, "An event has been published");
        assert.deepEqual(oEventBusPublishStub.args[0], ["launchpad", "sessionTimeout"], "That was a launchpad/sessionTimeout event");
        assert.strictEqual(oLogoutStub.calledOnce, false, "logout() was not called as an automatic timeout was not configured");
        assert.strictEqual(oSessionExpiredDialogStub.calledOnce, true, "SessionExpiredDialog was opened");
        assert.strictEqual(oSessionExpiredDialogOpenSpy.calledOnce, true, "SessionExpiredDialog was opened");
    });

    QUnit.test("When reminder is disabled and automatic signout is enabled", function (assert) {
        // Arrange

        // ... Session handler
        this.oSessionHandler.init(oSessionHandlerConfigNoReminderNoSignout);
        this.oSessionHandler.oConfig.enableAutomaticSignout = true;

        // ... Some spies and stubs
        var oSessionExpiredDialogOpenSpy = sandbox.spy();
        sandbox.stub(this.oSessionHandler, "createSessionExpiredDialog").returns({
            open: oSessionExpiredDialogOpenSpy
        });
        var oEventBusPublishStub = sandbox.stub(EventBus.getInstance(), "publish").returns({});
        const oLogoutStub = sandbox.stub(sap.ushell.Container, "defaultLogout");

        // Act
        this.oSessionHandler.handleSessionOver();

        // Assert
        assert.strictEqual(oEventBusPublishStub.calledOnce, true, "An event has been published");
        assert.deepEqual(oEventBusPublishStub.args[0], ["launchpad", "sessionTimeout"], "That was a launchpad/sessionTimeout event");
        assert.strictEqual(oLogoutStub.calledOnce, true, "logout() was called as configured");
        assert.strictEqual(this.oSessionHandler.createSessionExpiredDialog.calledOnce, false, "SessionExpiredDialog was opened");
        assert.strictEqual(oSessionExpiredDialogOpenSpy.calledOnce, false, "SessionExpiredDialog was opened");

        // Cleanup
        sandbox.restore();
    });

    QUnit.module("continueWorkingButtonPressHandler", {
        beforeEach: function (assert) {
            // Perform a local ushell bootstrap before
            return Container.init("local")
                .then(function () {
                    sandbox.stub(Container, "getServiceAsync").returns(Promise.resolve());

                    // Create session handler for testing and sandbox
                    this.oSessionHandler = new SessionHandler(AppLifeCycle);
                }.bind(this));
        },
        afterEach: function () {
            // Clean up
            sandbox.restore();
            // resets window's local storage
            this.oSessionHandler.putTimestampInStorage("");
        }
    });

    QUnit.test("Confirm user inactivity monitoring gets restarted properly on user action", function (assert) {
        // Arrange
        var oKeepAliveDialogCloseSpy = sandbox.spy();
        this.oSessionHandler.oSessionKeepAliveDialog = {
            close: oKeepAliveDialogCloseSpy
        };

        sandbox.stub(this.oSessionHandler, "_getCurrentDate").returns("CurrentDate");
        sandbox.spy(this.oSessionHandler, "putTimestampInStorage");
        sandbox.stub(this.oSessionHandler, "monitorUserIsInactive");
        sandbox.stub(this.oSessionHandler, "attachUserEvents");
        sandbox.stub(this.oSessionHandler, "attachVisibilityEvents");
        sandbox.stub(PostMessageUtils, "postMessageToMultipleIframes");

        // Act
        this.oSessionHandler.continueWorkingButtonPressHandler();

        // Assert
        assert.strictEqual(oKeepAliveDialogCloseSpy.calledOnce, true, "Keep alive dialog gets closed.");
        assert.strictEqual(this.oSessionHandler.putTimestampInStorage.calledOnce, true, "Timestamp for user activity gets updated");
        assert.strictEqual(this.oSessionHandler.putTimestampInStorage.args[0][0], "CurrentDate", "... with the current time stamp.");
        assert.strictEqual(this.oSessionHandler.getTimestampFromStorage(), "CurrentDate", "Correct date is stored in LocalStorage.");
        assert.strictEqual(this.oSessionHandler.monitorUserIsInactive.calledOnce, true, "monitorUserIsInactive() is called once.");
        assert.strictEqual(this.oSessionHandler.attachUserEvents.calledOnce, true, "attachUserEvents() is called.");
        assert.strictEqual(this.oSessionHandler.attachVisibilityEvents.calledOnce, true, "attachVisibilityEvents() is called.");
        assert.strictEqual(PostMessageUtils.postMessageToMultipleIframes.calledOnce, true, "The app gets informed.");
    });

    QUnit.test("Confirm user inactivity monitoring gets restarted properly when method was implicitly triggered", function (assert) {
        // Arrange
        var oKeepAliveDialogCloseSpy = sandbox.spy();
        this.oSessionHandler.oSessionKeepAliveDialog = {
            close: oKeepAliveDialogCloseSpy
        };

        this.oSessionHandler.putTimestampInStorage("CurrentDate");
        sandbox.spy(this.oSessionHandler, "putTimestampInStorage");
        sandbox.stub(this.oSessionHandler, "monitorUserIsInactive");
        sandbox.stub(this.oSessionHandler, "attachUserEvents");
        sandbox.stub(this.oSessionHandler, "attachVisibilityEvents");
        sandbox.stub(PostMessageUtils, "postMessageToMultipleIframes");

        // Act
        this.oSessionHandler.continueWorkingButtonPressHandler(true);

        // Assert
        assert.strictEqual(oKeepAliveDialogCloseSpy.calledOnce, true, "Keep alive dialog gets closed.");
        assert.strictEqual(this.oSessionHandler.putTimestampInStorage.callCount, 0, "Timestamp for user activity is not updated");
        assert.strictEqual(this.oSessionHandler.getTimestampFromStorage(), "CurrentDate", "Correct date is stored in LocalStorage.");
        assert.strictEqual(this.oSessionHandler.monitorUserIsInactive.calledOnce, true, "monitorUserIsInactive() is called once.");
        assert.strictEqual(this.oSessionHandler.attachUserEvents.calledOnce, true, "attachUserEvents() is called.");
        assert.strictEqual(this.oSessionHandler.attachVisibilityEvents.calledOnce, true, "attachVisibilityEvents() is called.");
        assert.strictEqual(PostMessageUtils.postMessageToMultipleIframes.calledOnce, true, "The app gets informed.");
    });

    QUnit.module("getLocalStorage", {
        beforeEach: function () {
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oIsLocalStorageSupportedStub = sandbox.stub(this.oSessionHandler, "_isLocalStorageSupported");
        },
        afterEach: function () {
            clearTimeout(this.oSessionHandler.oMonitorUserIsInactiveTimer);
            clearTimeout(this.oSessionHandler.notifyServerTimer);
            clearTimeout(this.oSessionHandler.oUserActivityTimer);
            sandbox.restore();
        }
    });

    QUnit.test("creates a new instance of sap.ui.util.Storage, checks if it is supported by the browser and saves the reference for later use", function (assert) {
        // Arrange
        var oResult,
            oResultOfSecondCall;
        this.oIsLocalStorageSupportedStub.returns(true);

        // Act
        oResult = this.oSessionHandler.getLocalStorage();
        oResultOfSecondCall = this.oSessionHandler.getLocalStorage();

        // Assert
        assert.ok(oResult instanceof Storage, "Returns an instance of sap.ui.util.Storage");
        assert.strictEqual(oResult, oResultOfSecondCall, "Returns the same instance of sap.ui.util.Storage when calling getLocalStorage two times");
    });

    QUnit.test("does not try to create multiple instances of sap.ui.util.Storage when the browser does not support localStorage", function (assert) {
        // Arrange
        var oResult,
            oResultOfSecondCall;
        this.oIsLocalStorageSupportedStub.returns(false);
        // Act
        oResult = this.oSessionHandler.getLocalStorage();
        oResultOfSecondCall = this.oSessionHandler.getLocalStorage();
        // Assert
        assert.strictEqual(oResult, false, "returns an false in case _isLocalStorageSupported fails");
        assert.strictEqual(oResultOfSecondCall, false, "returns false for further calls of _isLocalStorageSupported");
        assert.ok(this.oIsLocalStorageSupportedStub.calledOnce, "_isLocalStorageSupported was only called once");
    });

    QUnit.module("_isLocalStorageSupported", {
        beforeEach: function () {
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oFakeStorage = {
                isSupported: sandbox.stub()
            };
        }
    });

    QUnit.test("returns true if localStorage is supported", function (assert) {
        // Arrange
        var bResult;
        this.oFakeStorage.isSupported.returns(true);
        // Act
        bResult = this.oSessionHandler._isLocalStorageSupported(this.oFakeStorage);
        // Assert
        assert.ok(bResult, "expected result was returned");
    });

    QUnit.test("returns false and logs a warning if sap.ui.util.Storage reports it is not supported", function (assert) {
        // Arrange
        var oWarningStub = sandbox.stub(Log, "warning"),
            bResult;
        this.oFakeStorage.isSupported.returns(false);
        // Act
        bResult = this.oSessionHandler._isLocalStorageSupported(this.oFakeStorage);
        // Assert
        assert.notOk(bResult, "expected result was returned");
        assert.ok(oWarningStub.calledOnce, "warning was logged");
        oWarningStub.restore();
    });

    QUnit.test("returns false and logs a warning if localStorage is not supported by the browser", function (assert) {
        // Arrange
        var oWarningStub = sandbox.stub(Log, "warning"),
            bResult;
        // Act
        bResult = this.oSessionHandler._isLocalStorageSupported({}); // sap.ui.util.Storage.isSupported will throw an exception in this case so lets make it throw!
        // Assert
        assert.notOk(bResult, "expected result was returned");
        assert.ok(oWarningStub.calledOnce, "warning was logged");
        oWarningStub.restore();
    });

    QUnit.module("attachVisibilityEvents", {
        beforeEach: function () {
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oSessionHandler._fnOnVisibilityChange = sandbox.stub();
        },
        afterEach: function () {}
    });

    QUnit.test("attaches event handler to visibilitychange event on document", function (assert) {
        var oEvent = document.createEvent("HTMLEvents");
        oEvent.initEvent("visibilitychange", true, true);
        oEvent.eventName = "visibilitychange";
        this.oSessionHandler.attachVisibilityEvents();
        document.dispatchEvent(oEvent);
        assert.ok(this.oSessionHandler._fnOnVisibilityChange.calledOnce, "onVisibilityChange was called once.");
    });

    QUnit.module("detachVisibilityEvents", {
        beforeEach: function () {
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oSessionHandler._fnOnVisibilityChange = sandbox.stub();
        },
        afterEach: function () {}
    });

    QUnit.test("detaches event handler to visibilitychange event on document", function (assert) {
        var oEvent = document.createEvent("HTMLEvents");
        oEvent.initEvent("visibilitychange", true, true);
        oEvent.eventName = "visibilitychange";
        this.oSessionHandler.attachVisibilityEvents();
        this.oSessionHandler.detachVisibilityEvents();
        document.dispatchEvent(oEvent);
        assert.ok(this.oSessionHandler._fnOnVisibilityChange.notCalled, "onVisibilityChange was not called.");
    });

    QUnit.module("onVisibilityChange", {
        beforeEach: function () {
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oMonitorUserIsInactiveStub = sandbox.stub(this.oSessionHandler, "monitorUserIsInactive");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls monitorUserIsInactive if visibilityState is visible", function (assert) {
        this.oSessionHandler.onVisibilityChange({
            target: {
                visibilityState: "visible"
            }
        });
        assert.ok(this.oMonitorUserIsInactiveStub.calledOnce, "monitorUserIsInactive was called once.");
        assert.strictEqual(this.oMonitorUserIsInactiveStub.firstCall.args[0], false, "monitorUserIsInactive was called with argument false.");
    });

    QUnit.test("does not call monitorUserIsInactive if visibilityState is not visible", function (assert) {
        this.oSessionHandler.onVisibilityChange({
            target: {
                visibilityState: "hidden"
            }
        });
        assert.ok(this.oMonitorUserIsInactiveStub.notCalled, "monitorUserIsInactive was not called.");
    });
});
