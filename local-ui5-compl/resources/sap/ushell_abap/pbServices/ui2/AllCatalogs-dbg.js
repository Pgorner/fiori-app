// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview A wrapper for a page's <code>allCatalogs</code> collection loaded from the page
 * building service.
 */

sap.ui.define([
    "sap/ushell_abap/pbServices/ui2/Error",
    "sap/base/Log"
], function (
    SrvcError,
    Log
) {
    "use strict";


    // "public class" ************************************************************

    /**
     * Constructs a new representation (wrapper) for the given page's <code>allCatalogs</code>
     * collection to be loaded from the given factory's page building service. Note that this
     * collection does not contain the page's classic catalog as returned by
     * {@link sap.ushell_abap.pbServices.ui2.Page#getCatalog}).
     *
     * @param {sap.ushell_abap.pbServices.ui2.Factory} oFactory
     *  the factory
     * @param {string} sPageId
     *   ID of the page
     *
     * <p>
     * Initially a stub is created, which can later load its properties and related objects
     * asynchronously.
     * <p>
     * This collection and the contained catalogs are currently read-only and cannot be updated
     * through the page building service.
     * (see {@link sap.ushell_abap.pbServices.ui2.PageBuildingService}, {@link sap.ushell_abap.pbServices.ui2.Catalog})
     *
     * @class
     * @since 1.7.0
     */
    var AllCatalogs = function (oFactory, sPageId) {
        var aCatalogs = [],
            bIsStub = true,
            that = this;

        // BEWARE: constructor code below!

        // "private" methods ---------------------------------------------------------

        /**
         * Makes sure we are not just a stub.
         *
         * @private
         */
        function checkStub () {
            if (bIsStub) {
                throw new SrvcError(that + ": collection is just a stub",
                    "AllCatalogs");
            }
        }

        // "public" methods ----------------------------------------------------------

        /**
         * Returns this collection's catalog instances. Can only be called if the collection itself is
         * not a stub anymore.
         *
         * @returns {sap.ushell_abap.pbServices.ui2.Catalog[]}
         *   this collection's catalog instances
         * @since 1.7.0
         *
         * @see #isStub()
         */
        this.getCatalogs = function () {
            checkStub();
            return aCatalogs.slice();
        };

        /**
         * Tells whether this <code>allCatalogs</code> collection is still only a stub and does not yet
         * know its individual catalogs.
         *
         * @returns {boolean}
         *   whether this <code>allCatalogs</code> collection is still only a stub
         * @since 1.7.0
         *
         * @see #load()
         */
        this.isStub = function () {
            return bIsStub;
        };

        /**
         * Loads this <code>allCatalogs</code> collection including all of its catalogs and their CHIPs.
         * Notifies one of the given handlers.
         *
         * @param {function} fnSuccess
         *   no-args success handler
         * @param {function(string, object=)} [fnFailure]
         *   error handler taking an error message and, since version 1.28.6, an
         *   optional object containing the complete error information as delivered
         *   by the ODataService. See fnFailure parameter of {@link sap.ushell_abap.pbServices.ui2.ODataWrapper#onError}
         *   for more details.
         *   If not given, the default <code>{@link sap.ushell_abap.pbServices.ui2.ODataService#getDefaultErrorHandler}</code> is used
         * @param {string} [sFilter]
         *   filter value as defined by OData specification e.g. "type eq 'H'" for HANA catalogs.
         *   Filter has been introduced with version 1.16.2.
         * @param {boolean} [bPartially=false]
         *   Whether to load the <code>allCatalogs</code> collection only partially instead of making
         *   sure that also remote catalogs are fully loaded (since 1.17.1). Note: Non-remote catalogs
         *   are not affected!
         * @param {string} sSorting
         *   name of the field to be sorted on via $orderby as defined by OData specification.
         *   If not defined the dafault sorting would be on the field id (since 1.44)
         * @param {boolean} bCache use cache when true
         * @since 1.7.0
         */
        this.load = function (fnSuccess, fnFailure, sFilter, bPartially, sSorting, bCache) {
            if (!bIsStub) {
                throw new SrvcError(that + ": collection is not a stub anymore",
                    "AllCatalogs");
            }

            function loadCatalogs () {
                var i, n, oCatalog;

                if (!bPartially) {
                    // Note: If a catalog is still a stub here, it refers to a different system. We don't
                    // expect to have many such catalogs, so we don't mind loading them serialized.
                    for (i = 0, n = aCatalogs.length; i < n; i += 1) {
                        oCatalog = aCatalogs[i];
                        if (oCatalog.isStub()) {
                            oCatalog.load(loadCatalogs, fnFailure);
                            return;
                        }
                    }
                }
                fnSuccess();
            }

            function onSuccess (oAlterEgo) {
                var i, n;

                Log.debug("Loaded: " + that, null, "AllCatalogs");
                bIsStub = false;
                aCatalogs = [];
                for (i = 0, n = oAlterEgo.results.length; i < n; i += 1) {
                    aCatalogs.push(oFactory.createCatalog(oAlterEgo.results[i]));
                }
                Log.debug("Initialized: " + that, null, "AllCatalogs");
                loadCatalogs();
            }

            oFactory.getPageBuildingService().readAllCatalogs(sPageId, onSuccess, fnFailure, sFilter, sSorting, !!bCache /* false is the default */);
        };

        /**
         * Returns this <code>allCatalogs</code> collection's string representation.
         *
         * @param {boolean} [bVerbose=false]
         *   flag whether to show all properties
         * @returns {string}
         *   this <code>allCatalogs</code> collection's string representation
         * @since 1.7.0
         */
        this.toString = function (bVerbose) {
            var aResult = ['AllCatalogs({sPageId:"', sPageId, '",bIsStub:', bIsStub];
            if (bVerbose) {
                aResult.push(",aCatalogs:", JSON.stringify(aCatalogs));
            }
            aResult.push("})");
            return aResult.join("");
        };

        // constructor code -------------------------------------------------------
        if (!sPageId) {
            throw new SrvcError("Missing page ID", "AllCatalogs");
        }
        Log.debug("Created: " + this, null, "AllCatalogs");
    };

    return AllCatalogs;
});
