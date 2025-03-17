sap.ui.define([
    "sap/ui/core/util/MockServer"
], function (MockServer) {
    "use strict";
    
    var mockservers = {},
        oMockServers = [],
        namespace = "ovp";

    mockservers.loadMockServer = function (sMockServerBaseUri, rootUri, isMockServerForTestRequired) {
        if (!oMockServers[namespace]) {
            oMockServers[namespace] = [];
        }

        var oMockServersNS = oMockServers[namespace];
        //This method has two mockservers, the order which they pushed is important.
        //This mockserver has lower priority
        if (isMockServerForTestRequired) {
            oMockServersNS.push(new MockServer({
                    requests: [
                        {
                            method: "HEAD",
                            // have MockServer fixed and pass just the URL!
                            path: rootUri,
                            response: function (oXHR) {
                                oXHR.respond(200, {}, "");
                            },
                        },
                        {
                            method: "POST",
                            // have MockServer fixed and pass just the URL!
                            path: new RegExp(MockServer.prototype._escapeStringForRegExp(rootUri) + ".*"),
                            response: function (oXHR) {
                                oXHR.respondXML(200, {}, "");
                            },
                        },
                    ],
                })
            );
            oMockServersNS[oMockServersNS.length - 1].start();
        }
        //This mockserver has higher priority
        oMockServersNS.push(new MockServer({ rootUri: rootUri }));
        oMockServersNS[oMockServersNS.length - 1].simulate(/* sServiceUri?!*/ sMockServerBaseUri + "metadata.xml", {
            sMockdataBaseUrl: sMockServerBaseUri,
            bGenerateMissingMockData: true,
        });
        oMockServersNS[oMockServersNS.length - 1].start();
    };
 
    mockservers.close = function (namespace) {
        if (!namespace) {
            namespace = "ovp";
        }
        var oMockServersNS = oMockServers[namespace];

        for (var i = 0, len = oMockServersNS.length; i < len; i++) {
            oMockServersNS[i].destroy();
        }
        oMockServers[namespace] = [];
    };

    return mockservers;
}, true);
