// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/util/MockServer",
    "sap/ui/model/json/JSONModel"
], function (
    Log,
    MockServer,
    JSONModel
) {
    "use strict";

    var oMockServer;
    var _sAppPath = "sap/ushell/demo/worklist/";
    var _sJsonFilesPath = _sAppPath + "localService/mockdata";

    var oMockServerInterface = {
        /**
         * Initializes the mock server asynchronously.
         * You can configure the delay with the URL parameter "serverDelay".
         * The local mock data in this folder is returned instead of the real data for testing.
         * @protected
         * @returns{Promise} a promise that is resolved when the mock server has been started
         */
        init: function (oOptionsParameter) {
            var oOptions = oOptionsParameter || {};

            return new Promise(function (fnResolve) {
                var sManifestUrl = sap.ui.require.toUrl(_sAppPath + "manifest.json"),
                    oManifestModel = new JSONModel(sManifestUrl);

                oManifestModel.attachRequestCompleted(function () {
                    var oUriParameters = new URLSearchParams(window.location.search);
                    // parse manifest for local metadata URI
                    var sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesPath);
                    var oMainDataSource = oManifestModel.getProperty("/sap.app/dataSources/mainService");
                    var sMetadataUrl = sap.ui.require.toUrl(_sAppPath + oMainDataSource.settings.localUri);
                    // ensure there is a trailing slash
                    var sMockServerUrl = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri : oMainDataSource.uri + "/";

                    // create a mock server instance or stop the existing one to reinitialize
                    if (!oMockServer) {
                        oMockServer = new MockServer({
                            rootUri: sMockServerUrl
                        });
                    } else {
                        oMockServer.stop();
                    }

                    // configure mock server with the given options or a default delay of 0.5s
                    MockServer.config({
                        autoRespond: true,
                        autoRespondAfter: (oOptions.delay || oUriParameters.get("serverDelay") || 500)
                    });

                    // simulate all requests using mock data
                    oMockServer.simulate(sMetadataUrl, {
                        sMockdataBaseUrl: sJsonFilesUrl,
                        bGenerateMissingMockData: true
                    });

                    var aRequests = oMockServer.getRequests();

                    // compose an error response for request
                    var fnResponse = function (iErrCode, sMessage, aRequest) {
                        aRequest.response = function (oXhr) {
                            oXhr.respond(iErrCode, { "Content-Type": "text/plain;charset=utf-8" }, sMessage);
                        };
                    };

                    // simulate metadata errors
                    if (oOptions.metadataError || oUriParameters.get("metadataError")) {
                        aRequests.forEach(function (aEntry) {
                            if (aEntry.path.toString().indexOf("$metadata") > -1) {
                                fnResponse(500, "metadata Error", aEntry);
                            }
                        });
                    }

                    // simulate request errors
                    var sErrorParam = oOptions.errorType || oUriParameters.get("errorType"),
                        iErrorCode = sErrorParam === "badRequest" ? 400 : 500;
                    if (sErrorParam) {
                        aRequests.forEach(function (aEntry) {
                            fnResponse(iErrorCode, sErrorParam, aEntry);
                        });
                    }

                    // custom mock behavior may be added here

                    // set requests and start the server
                    oMockServer.setRequests(aRequests);
                    oMockServer.start();

                    Log.info("Running the app with mock data");
                    fnResolve();
                });

                oManifestModel.attachRequestFailed(function () {
                    Log.error("Failed to load application manifest");
                    fnResolve();
                });
            });
        },

        /**
         * @public returns the mockserver of the app, should be used in integration tests
         * @returns {sap.ui.core.util.MockServer} the mockserver instance
         */
        getMockServer: function () {
            return oMockServer;
        }
    };

    return oMockServerInterface;
});
