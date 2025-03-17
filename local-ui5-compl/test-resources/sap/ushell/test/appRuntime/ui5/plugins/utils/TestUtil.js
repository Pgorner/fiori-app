// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/* global sinon */

sap.ui.define(["sap/ui/thirdparty/jquery"],
    function (jQuery) {
        "use strict";

        function createRendererMock () {
            return {
                addActionButton: function (sId, mPropertyBag) {
                    this.mAddActionParameters = mPropertyBag;
                }.bind(this),
                LaunchpadState: {
                    App: {}
                }
            };
        }

        function createAppLifeCycleService (sApplicationType, bFlexEnabled, fnAttachAppLoaded, bTypeComponent) {
            return {
                attachAppLoaded: fnAttachAppLoaded || function () { },
                detachAppLoaded: function () { },
                getCurrentApplication: function () {
                    return {
                        applicationType: sApplicationType,
                        componentInstance: {
                            getId: function () { return "root"; },
                            getAggregation: function () { },
                            getManifest: sinon.stub().returns({
                                "sap.ui5": {
                                    flexEnabled: bFlexEnabled
                                },
                                "sap.app": {
                                    type: bTypeComponent ? "component" : "application"
                                }
                            }),
                            getManifestEntry: function (sEntry) {
                                return this.getManifest()[sEntry];
                            }
                        }
                    };
                },
                getHash: function () { }
            };
        }

        function createURLParsingService () {
            return {
                parseShellHash: function () {
                    return {
                        semanticObject: undefined,
                        action: undefined,
                        contextRaw: undefined,
                        params: {},
                        appSpecificRoute: undefined
                    };
                }
            };
        }

        function createContainerObject (sApplicationType, bNoRenderer, bNoRendererAfterCallback, assert, bFlexEnabled, fnAttachAppLoaded, bTypeComponent) {
            var mReturn = {
                getServiceAsync: function (sService) {
                    var oService;
                    if (sService === "AppLifeCycle") {
                        oService = createAppLifeCycleService(sApplicationType, bFlexEnabled, fnAttachAppLoaded, bTypeComponent);
                    } else if (sService === "URLParsing") {
                        oService = createURLParsingService();
                    }
                    return Promise.resolve(oService);
                },
                registerDirtyStateProvider: function () { }
            };
            if (bNoRenderer) {
                mReturn.getRenderer = function () { };
                mReturn.attachRendererCreatedEvent = function (fnCallback, oContext) {
                    this.fnAttachCallback = fnCallback;
                    this.oAttachContext = oContext;
                    fnCallback.call(this, {
                        getParameter: function () {
                            return !bNoRendererAfterCallback ? createRendererMock.call(this) : undefined;
                        }.bind(this)
                    });
                }.bind(this);
                mReturn.detachRendererCreatedEvent = function (fnCallback, oContext) {
                    this.fnDetachCallback = fnCallback;
                    this.oDetachContext = oContext;
                    assert.ok(true, "the event got detached");
                }.bind(this);
            } else {
                mReturn.getRenderer = function () {
                    return createRendererMock.call(this);
                }.bind(this);
            }
            mReturn.getRendererInternal = mReturn.getRenderer;
            return mReturn;
        }

        function createComponentData () {
            var fnEmpty = function (vParam) { return vParam || new jQuery.Deferred().resolve(); };
            return {
                componentData: {
                    oPostMessageInterface: {
                        createPostMessageResult: this.oCreatePostMessageResultStub || fnEmpty,
                        postMessageToFlp: this.oPostMessageToFlpStub || fnEmpty,
                        postMessageToApp: this.oPostMessageToAppStub || fnEmpty,
                        registerPostMessageAPIs: this.oRegisterPostMessageAPIsStub || fnEmpty
                    }
                }
            };
        }

        return {
            createContainerObject: createContainerObject,
            createComponentData: createComponentData,
            createAppLifeCycleService: createAppLifeCycleService
        };
    });
