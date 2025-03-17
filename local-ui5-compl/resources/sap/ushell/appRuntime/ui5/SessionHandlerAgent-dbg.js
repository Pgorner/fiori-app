// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/appRuntime/ui5/services/Container",
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ui/thirdparty/URI",
    "sap/base/Log"
], function (Container, AppCommunicationMgr, AppRuntimeService, URI, Log) {
    "use strict";

    var _that;
    function SessionHandlerAgent () {

        this.init = function () {
            //register for logout event from the shell
            AppCommunicationMgr.registerCommHandlers({
                "sap.ushell.sessionHandler": {
                    oServiceCalls: {
                        beforeApplicationHide: {
                            executeServiceCallFn: function (oMessageData) {
                                return Promise.resolve();
                            }
                        },
                        afterApplicationShow: {
                            executeServiceCallFn: function (oMessageData) {
                                return Promise.resolve();
                            }
                        },
                        logout: {
                            executeServiceCallFn: function (oMessageData) {
                                return _that.handleLogoutEvent(oMessageData);
                            }
                        },
                        extendSessionEvent: {
                            executeServiceCallFn: function (oMessageData) {
                                return _that.handleExtendSessionEvent(oMessageData);
                            }
                        }
                    }
                }
            });

            this.attachUserEvents();
            this.userActivityHandler();
        };

        this.handleLogoutEvent = function () {
            return new Promise((fnResolve, fnReject) => {
                _that.detachUserEvents();
                Container.getFLPUrlAsync(true).then(function (sFlpURL) {
                    if (_that.isSameDomain(sFlpURL, document.URL) === false) {
                        Container.logout().then(fnResolve, fnReject);
                    } else {
                        fnResolve();
                    }
                });
            });
        };

        this.isSameDomain = function (sURL1, sURL2) {
            var oUri1,
                oUri2,
                bSame = false;

            if (sURL1 === undefined || sURL2 === undefined) {
                return false;
            }

            try {
                oUri1 = new URI(sURL1);
                oUri2 = new URI(sURL2);
                if (oUri1.origin() === oUri2.origin()) {
                    bSame = true;
                }
            } catch (ex) {
                Log.error(
                    "Check for same domain of iframe and FLP failed: " + sURL1 + " " + sURL2,
                    ex,
                    "sap.ushell.appRuntime.ui5.SessionHandlerAgent"
                );
            }

            return bSame;
        };

        this.handleExtendSessionEvent = function () {
            //send extend session  to the app
            Container.sessionKeepAlive();
            return Promise.resolve();
        };

        this.attachUserEvents = function () {
            document.addEventListener("mousedown", this.userActivityHandler);
            document.addEventListener("mousemove", this.userActivityHandler);
            document.addEventListener("keyup", this.userActivityHandler);
            document.addEventListener("touchstart", this.userActivityHandler);
        };

        this.detachUserEvents = function () {
            document.removeEventListener("mousedown", this.userActivityHandler);
            document.removeEventListener("mousemove", this.userActivityHandler);
            document.removeEventListener("keyup", this.userActivityHandler);
            document.removeEventListener("touchstart", this.userActivityHandler);
        };

        this.userActivityHandler = function (oEventData) {
            if (_that.oUserActivityTimer !== undefined) {
                return;
            }

            _that.oUserActivityTimer = setTimeout(function () {
                //send notify extend session to the Shell
                AppRuntimeService.postMessageToFLP("sap.ushell.sessionHandler.notifyUserActive", {});
                _that.oUserActivityTimer = undefined;
            }, 10000);
        };
    }

    var sessionHandlerAgent = new SessionHandlerAgent();
    _that = sessionHandlerAgent;
    return sessionHandlerAgent;
});
