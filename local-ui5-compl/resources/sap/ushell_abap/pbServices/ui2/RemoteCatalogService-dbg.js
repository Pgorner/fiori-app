// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview A catalog service which is able to read CHIPs from a remote server.
 */
sap.ui.define([
    "sap/ushell_abap/pbServices/ui2/PageBuildingService"
], function (
    PageBuildingService
) {
    "use strict";


    // "public class" ************************************************************

    /**
     * Constructs a remote catalog service which is able to read CHIPs from a remote server.
     *
     * @class
     * @since 1.19.1
     */
    var RemoteCatalogService = function () {
        // "public" methods --------------------------------------------------------

        /**
         * Reads the CHIPs with given IDs from the catalog with the given ID, using the given base URL.
         *
         * @param {string} sBaseUrl
         *   the base URL of the remote catalog
         * @param {string} sCatalogId
         *   the ID of the remote catalog
         * @param {string[]} [aChipIds]
         *   the IDs of the CHIPs to be loaded; if <code>undefined</code>, all CHIPs are loaded
         * @param {function(object)} fnSuccess
         *   a callback function that is executed if the request succeeds, taking the processed data
         * @param {function(string, object=)} [fnFailure]
         *   error handler taking an error message and, since version 1.28.6, an
         *   optional object containing the complete error information as delivered
         *   by the ODataService. See fnFailure parameter of {@link sap.ushell_abap.pbServices.ui2.ODataWrapper#onError}
         *   for more details.
         * @throws Error if <code>aChipIds === []</code>
         * @since 1.19.1
         */
        this.readChips = function (sBaseUrl, sCatalogId, aChipIds, fnSuccess, fnFailure) {
            PageBuildingService.createPageBuildingService(sBaseUrl)
                .readCatalogChips(sCatalogId, aChipIds, fnSuccess, fnFailure);
        };
    };

    return RemoteCatalogService;
});
