// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/util/MockServer"
], function (UI5MockServer) {
    "use strict";

    var MockServer = {
        mServers: {}
    };

    /**
    * @typedef SimulationPaths
    * @type {object}
    * @property {string} sMetadataPath The path to the service metadata xml file.
    * @property {string} sMockDataFolderPath The path to the mock data folder.
    */

    /**
     * Creates a new UI5 Mockserver instance for the provided root URI.
     *
     * @param {string} rootUri
     *  The root URI of the request which should be mocked. Must end with a a trailing slash ("/").
     * @param {(object[]|SimulationPaths)} mockedRoutes
     *  Either an array of requests (@see sap.ui.core.util.MockServer#setRequests) or a SimulationPaths object
     *  which is used to simulate an OData service based on the provided metadata.xml.
     * @param {object[]} [simulationOverwrites]
     *  An array of requests which should overwrite the OData service simulation.
     *  (@see sap.ui.core.util.MockServer#setRequests)
     *
     * @returns {sap.ui.core.util.MockServer} The mockserver instance for the provided root URI.
     *
     * @private
     * @since 1.76.0
     */
    MockServer.init = function (rootUri, mockedRoutes, simulationOverwrites) {
        if (this.mServers[rootUri] instanceof UI5MockServer) {
            if (this.mServers[rootUri].isStarted()) {
                this.mServers[rootUri].stop();
                this.mServers[rootUri].destroy();
                delete this.mServers[rootUri];
            }
        }

        // create
        this.mServers[rootUri] = new UI5MockServer({
            rootUri: rootUri
        });

        // configure
        UI5MockServer.config({
            autoRespond: true,
            autoRespondAfter: 0
        });

        if (Array.isArray(mockedRoutes)) {
            this.mServers[rootUri].setRequests(mockedRoutes);
        } else {
            this.mServers[rootUri].simulate(mockedRoutes.sMetadataPath, {
                sMockdataBaseUrl: mockedRoutes.sMockDataFolderPath,
                bGenerateMissingMockData: true
            });

            var aSimulatedRequests = this.mServers[rootUri].getRequests();
            if (simulationOverwrites) {
                simulationOverwrites.forEach(function (oRequest) {
                    aSimulatedRequests.push(oRequest);
                });
                this.mServers[rootUri].setRequests(aSimulatedRequests);
            }
        }

        // start
        this.mServers[rootUri].start();

        return this.mServers[rootUri];
    };

    /**
     * Stops and destroys all Mockserver instances
     */
    MockServer.destroyAll = function () {
        UI5MockServer.stopAll();
        UI5MockServer.destroyAll();
        delete this.mServers;
    };

    return MockServer;
});
