// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/util/MockServer"
], function (MockServer) {
    "use strict";

    return {
        init: function () {
            var sJsonFilesUrl = sap.ui.require.toUrl("sap/ushell/demo/AppShellUIRouter/localService/mockdata");
            var sMetadataUrl = sap.ui.require.toUrl("sap/ushell/demo/AppShellUIRouter/localService/metadata.xml");

            // create
            var oMockServer = new MockServer({
                rootUri: "/here/goes/your/serviceUrl/"
            });

            // configure
            MockServer.config({
                autoRespond: true,
                autoRespondAfter: 1000
            });

            // simulate
            oMockServer.simulate(sMetadataUrl, {
                sMockdataBaseUrl: sJsonFilesUrl
            });

            // start
            oMockServer.start();
        }
    };
});
