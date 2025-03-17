// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview A factory for wrapper objects corresponding to the four
 * entities of the page building service: catalogs, pages, CHIP instances, and
 * CHIPs.
 */

sap.ui.define([
    "sap/ushell_abap/pbServices/ui2/Chip",
    "sap/ushell_abap/pbServices/ui2/Error",
    "sap/ushell_abap/pbServices/ui2/Catalog",
    "sap/ushell_abap/pbServices/ui2/ChipDefinition",
    "sap/ushell_abap/pbServices/ui2/PageBuildingService",
    "sap/ushell_abap/pbServices/ui2/ChipInstance",
    "sap/ushell_abap/pbServices/ui2/Page",
    "sap/ushell_abap/pbServices/ui2/PageSet",
    "sap/ushell_abap/pbServices/ui2/Utils",
    "sap/base/Log",
    "sap/base/util/LoaderExtensions"
], function (
    Chip,
    SrvcError,
    Catalog,
    ChipDefinition,
    PageBuildingService,
    ChipInstance,
    Page,
    PageSet,
    Utils,
    Log,
    LoaderExtensions
) {
    "use strict";

    // "public class" ************************************************************

    //TODO how could a new page be created via this factory?
    //TODO default error handler, maybe same as PBS?
    /**
     * Constructs a new factory based on the given page building service.
     * A factory for creating wrapper objects corresponding to catalogs, pages,
     * CHIP instances, or CHIPs loaded from a page building service.
     * <p>
     * All factory methods are able to create stubs synchronously. Those stubs
     * need to be loaded asynchronously in order to become complete.
     * <p>
     * Note: All error handlers are optional and default to
     * <code>getPageBuildingService().getDefaultErrorHandler()</code>
     *
     * @param {sap.ushell_abap.pbServices.ui2.PageBuildingService} oPbs
     *  the page building service
     *
     * @see sap.ushell_abap.pbServices.ui2.ODataService#getDefaultErrorHandler
     * @see #getPageBuildingService
     * @class
     * @since 1.2.0
     */
    var Factory = function (oPbs) {
        var mChips = {}, // cache for CHIPs
            mCatalogs = {}, // cache for catalogs
            mChipDefinitions = {}, // cache for CHIP definitions
            oRemoteCatalogServicesByBaseUrl, // mapping from base URL to remote catalog service
            that = this;

        // BEWARE: constructor code below!

        // "private" methods ---------------------------------------------------------

        // "public" methods ----------------------------------------------------------

        /**
         * Registers a remote catalog service for the given base URL.
         *
         * @param {string} sBaseUrl
         *   the base URL
         * @param {sap.ushell_abap.pbServices.ui2.RemoteCatalogService} oRemoteCatalogService
         *   the remote catalog service compatible to {@link sap.ushell_abap.pbServices.ui2.RemoteCatalogService}
         * @throws Error if the base URL is already registered
         * @since 1.19.1
         */
        this.addRemoteCatalogService = function (sBaseUrl, oRemoteCatalogService) {
            if (!sBaseUrl) {
                throw new SrvcError("Invalid base URL", "sap.ushell_abap.pbServices.ui2.Factory");
            }
            if (typeof oRemoteCatalogService.readChips !== "function") {
                throw new SrvcError("Invalid remote catalog service", "sap.ushell_abap.pbServices.ui2.Factory");
            }
            sBaseUrl = sBaseUrl.replace(/\/$/, ""); // ignore trailing '/'
            if (oRemoteCatalogServicesByBaseUrl.containsKey(sBaseUrl)) {
                throw new SrvcError("Base URL '" + sBaseUrl + "' already registered",
                    "sap.ushell_abap.pbServices.ui2.Factory");
            }
            oRemoteCatalogServicesByBaseUrl.put(sBaseUrl, oRemoteCatalogService);
        };

        /**
         * Creates a new catalog with the given ID and returns the stub. If a success
         * handler is given, the catalog will be loaded automatically from the page
         * building service, calling one of the given handlers.
         * <p>
         * Caches the created catalog, so that a subsequent request for a catalog with
         * the same ID will be answered from the cache.
         * <p>
         * Note: All contained CHIPs will typically be stubs only!
         * <p>
         * Note: If the catalog is a remote catalog and a success handler is given,
         * an attempt is made to load the chips. If this load attempts failed, the promise
         * is rejected with the 2nd argument being the (semi-)instantiated catalog with an
         * *empty* chip collection! This catalog is not a stub itself!
         *
         * @param {string|object} vCatalogData
         *   the catalog ID or the raw catalog representation as loaded via the page building service
         * @param {function(sap.ushell_abap.pbServices.ui2.Catalog)} [fnSuccess]
         *   success handler for asynchronous loading
         * @param {function(string, sap.ushell_abap.pbServices.ui2.Catalog=, object=)} fnFailure
         *   error handler, taking an error message, an optional {@link sap.ushell_abap.pbServices.ui2.Catalog}
         *   instance and, since version 1.28.6, an optional object containing the
         *   complete error information.<br />
         *   See fnFailure parameter of {@link sap.ushell_abap.pbServices.ui2.ODataWrapper#onError}
         *   for more details about the complete error information parameter.
         *   If fnFailure is not given
         *   <code>{@link sap.ushell_abap.pbServices.ui2.ODataService#getDefaultErrorHandler}</code> is used.
         *
         * @returns {sap.ushell_abap.pbServices.ui2.Catalog}
         *   the newly created catalog, as a stub
         * @since 1.2.0
         */
        this.createCatalog = function (vCatalogData, fnSuccess, fnFailure) {
            var that = this,
                oCatalog,
                sCatalogId = typeof vCatalogData === "object" ? vCatalogData.id : vCatalogData;

            // call fnFailure but insert oCatalog as second argument
            function fnFailureWithCatalog () {
                var aArgs;
                fnFailure = fnFailure || that.getPageBuildingService().getDefaultErrorHandler(); // both are optional
                if (fnFailure) {
                    // convert a to array and add catalog at index 1
                    aArgs = Array.prototype.slice.call(arguments);
                    aArgs.splice(1, 0, oCatalog);
                    fnFailure.apply(null, aArgs);
                }
            }

            function failWithOriginalArgs () {
                // use same error message and error object of the first failure
                fnFailureWithCatalog.apply(null, oCatalog.getCachedRemoteFailureArguments());
            }

            if (Object.prototype.hasOwnProperty.call(mCatalogs, sCatalogId)) {
                oCatalog = mCatalogs[sCatalogId].catalog;
                if (typeof vCatalogData === "object" && oCatalog.getCatalogData() === undefined) {
                    // re-apply constructor function to existing instance which knows only its ID
                    Catalog.call(oCatalog, this, vCatalogData);
                }
            } else {
                oCatalog = new Catalog(this, vCatalogData);
                mCatalogs[sCatalogId] = {
                    catalog: oCatalog,
                    chips: {}
                };
            }
            if (fnSuccess) {
                // since catalogs are cached it might not be a stub any more
                if (oCatalog.isStub()) {
                    oCatalog.load(fnSuccess.bind(null, oCatalog), fnFailureWithCatalog);
                } else if (oCatalog.getCachedRemoteFailureArguments() !== undefined) {
                    // catalog was already created before, no need to load it again
                    Utils.callHandler(failWithOriginalArgs, failWithOriginalArgs, /*async=*/true);
                } else {
                    Utils.callHandler(fnSuccess.bind(null, oCatalog), fnFailureWithCatalog, /*async=*/true);
                }
            }
            return oCatalog;
        };

        /**
         * Creates a CHIP instance for the given raw CHIP representation as loaded
         * via the page building service. If a success handler is given, the CHIP
         * will be loaded automatically, calling one of the given handlers.
         * <p>
         * Caches the created CHIPs, so that a subsequent request for a CHIP with
         * the same ID will be answered from the cache.
         *
         * @param {object} oRawChip
         *   the raw CHIP representation as loaded via the page building service
         * @param {function(sap.ushell_abap.pbServices.ui2.Chip)} [fnSuccess]
         *   success handler for asynchronous loading
         * @param {function(string, object=)} [fnFailure]
         *   error handler taking an error message and, since version 1.28.6, an
         *   optional object containing the complete error information as delivered
         *   by the ODataService. See fnFailure parameter of {@link sap.ushell_abap.pbServices.ui2.ODataWrapper#onError}
         *   for more details.
         *   If not given
         *   <code>{@link sap.ushell_abap.pbServices.ui2.ODataService#getDefaultErrorHandler}</code> is used
         *
         * @returns {sap.ushell_abap.pbServices.ui2.Chip}
         *   the newly created CHIP, as a stub
         * @since 1.2.0
         */
        this.createChip = function (oRawChip, fnSuccess, fnFailure) {
            var sCatalogId = oRawChip.remoteCatalogId,
                sChipId = oRawChip.id,
                oCache,
                oChip;
            if (sCatalogId) {
                // the catalog is irrelevant, ensure that the cache entry for it exists
                this.createCatalog(sCatalogId);
                oCache = mCatalogs[sCatalogId].chips;
            } else {
                oCache = mChips;
            }
            if (Object.prototype.hasOwnProperty.call(oCache, sChipId)) {
                oChip = oCache[sChipId];
                oChip.update(oRawChip);
            } else {
                oChip = new Chip(oRawChip, this);
                oCache[sChipId] = oChip;
            }
            if (fnSuccess) {
                if (oChip.isStub()) {
                    oChip.load(fnSuccess.bind(null, oChip), fnFailure);
                } else {
                    fnFailure = fnFailure || this.getPageBuildingService().getDefaultErrorHandler();
                    Utils.callHandler(fnSuccess.bind(null, oChip), fnFailure, true);
                }
            }
            return oChip;
        };

        /**
         * Creates a CHIP definition for the given URL. Caches the created objects, making sure that
         * even parallel calls to this function result in a single GET request only.
         * <p> Note: the newly created CHIP definition is returned to the success handler only!
         *
         * @param {string} sUrl
         *   the URL to the CHIP definition XML
         * @param {function(sap.ushell_abap.pbServices.ui2.ChipDefinition)} fnSuccess
         *   success handler for asynchronous loading; a new clone is passed to each handler!
         * @param {function(string)} [fnFailure]
         *   error handler, taking an error message. If not given
         *   <code>{@link sap.ushell_abap.pbServices.ui2.ODataService#getDefaultErrorHandler}</code> is used
         *
         * @since 1.17.0
         * @private
         */
        this.createChipDefinition = function (sUrl, fnSuccess, fnFailure) {
            var oChipDefinition, aLoadHandlers;

            /**
             * Calls the given success handler (a)synchronously with a clone of the given CHIP
             * definition. Errors thrown in the success handler are caught and reported to the error
             * handler.
             *
             * @param {sap.ushell_abap.pbServices.ui2.ChipDefinition} oOriginalChipDefinition
             *   original CHIP definition, will be cloned before it is passed to success handler
             * @param {function} fnSomeSuccess
             *   no-args success handler
             * @param {function(string)} [fnSomeFailure]
             *   error handler, taking an error message; MUST NOT throw any error itself! If not given
             *   <code>{@link sap.ushell_abap.pbServices.ui2.ODataService#getDefaultErrorHandler}</code> is used
             * @param {boolean} [bAsync=false]
             *   whether the call shall be asynchronously
             * @private
             */
            function call (oOriginalChipDefinition, fnSomeSuccess, fnSomeFailure, bAsync) {
                Utils.callHandler(
                    fnSomeSuccess.bind(null, new ChipDefinition(oOriginalChipDefinition)),
                    fnSomeFailure,
                    bAsync
                );
            }

            function successHandler (oXml) {
                var i, n;
                var oChipDefInstance = new ChipDefinition(oXml);
                mChipDefinitions[sUrl] = oChipDefInstance;
                // loading has finished, call all waiting load handlers
                for (i = 0, n = aLoadHandlers.length; i < n; i += 2) {
                    call(oChipDefInstance, aLoadHandlers[i], aLoadHandlers[i + 1], false);
                }
            }

            function errorHandler (vError) {
                var i, n, sMessage;

                if (typeof vError === "string") {
                    // Util.get error handler returns a sting only
                    sMessage = vError;
                } else {
                    // LoaderExtensions.loadResource error handler returns an Error object
                    sMessage = vError.message;
                }

                mChipDefinitions[sUrl] = sMessage; // Note: overwrites load handlers!
                // loading has failed, call all waiting failure handlers
                for (i = 0, n = aLoadHandlers.length; i < n; i += 2) {
                    aLoadHandlers[i + 1](sMessage);
                }
            }

            if (!sUrl) {
                throw new SrvcError("Missing URL", "Factory");
            }
            if (typeof fnSuccess !== "function") {
                throw new SrvcError("Missing success handler", "Factory");
            }
            fnFailure = fnFailure || this.getPageBuildingService().getDefaultErrorHandler();


            sUrl = Utils.addCacheBusterTokenUsingUshellConfig(sUrl);

            if (Object.prototype.hasOwnProperty.call(mChipDefinitions, sUrl)) {
                // cache hit: either array of load handlers, or CHIP definition, or error message
                oChipDefinition = aLoadHandlers = mChipDefinitions[sUrl];

                if (Utils.isArray(aLoadHandlers)) {
                    // wait until loading has finished (one way or the other)
                    aLoadHandlers.push(fnSuccess, fnFailure);
                } else if (oChipDefinition instanceof ChipDefinition) {
                    // already loaded
                    call(oChipDefinition, fnSuccess, fnFailure, true);
                } else {
                    // error message or illegal state
                    Utils.callHandler(fnFailure.bind(null, oChipDefinition), null, true);
                }
                return;
            }

            // loading is in progress
            aLoadHandlers = [fnSuccess, fnFailure];
            mChipDefinitions[sUrl] = aLoadHandlers;

            // Use (private UI5 API) LoaderExtensions.loadResource, as it also looks into preload files.
            // NOTE: the cache buster token was already added to sUrl some lines above.
            // RESTRICTION: CHIP Definition XML files will only be loaded from preload file, if NO cache buster is
            // in use. With cache buster, a request is sent (which most likely is served from browser cache).
            // This is because loadResource matches the URLs and expect the UI5 cache buster token to be used
            // (for Smart Business tiles), but we inject the UI2 token.
            LoaderExtensions.loadResource({ dataType: "xml", url: sUrl, async: true })
                .then(successHandler)
                .catch(errorHandler);
        };

        /**
         * Creates a new CHIP instance instance for the given raw CHIP instance
         * representation as loaded via the page building service. If a success
         * handler is given, the CHIP instance will be loaded automatically, calling
         * one of the given handlers.
         * <p>
         *
         * @param {object} oRawChipInstance
         *   the raw CHIP instance representation as loaded via the page building service
         * @param {function(sap.ushell_abap.pbServices.ui2.ChipInstance)} [fnSuccess]
         *   success handler for asynchronous loading
         * @param {function(string, object=)} [fnFailure]
         *   error handler taking an error message and, since version 1.28.6, an
         *   optional object containing the complete error information as delivered
         *   by the ODataService. See fnFailure parameter of {@link sap.ushell_abap.pbServices.ui2.ODataWrapper#onError}
         *   for more details.
         *   If not given
         *   <code>{@link sap.ushell_abap.pbServices.ui2.ODataService#getDefaultErrorHandler}</code> is used
         * @param {sap.ushell_abap.pbServices.ui2.Page} [oPage]
         *  (since 1.9.0) the page to which this CHIP instance belongs; this is passed on to the CHIP
         *  instance itself, see {@link sap.ushell_abap.pbServices.ui2.ChipInstance#getPage}
         *
         * @returns {sap.ushell_abap.pbServices.ui2.ChipInstance}
         *   the newly created CHIP instance, as a stub
         * @since 1.2.0
         */
        this.createChipInstance = function (oRawChipInstance, fnSuccess, fnFailure, oPage) {
            var oChip,
                oChipInstance;

            // ensure at least a "null object" CHIP that knows its IDs
            oRawChipInstance.Chip = oRawChipInstance.Chip || { $proxy: true };
            oRawChipInstance.Chip.id = oRawChipInstance.Chip.id || oRawChipInstance.chipId;
            oRawChipInstance.Chip.remoteCatalogId = oRawChipInstance.Chip.remoteCatalogId
                || oRawChipInstance.remoteCatalogId;

            if (oRawChipInstance.RemoteCatalog && oRawChipInstance.RemoteCatalog.id) {
                // ensure that we do not lose the information about the remote catalog
                this.createCatalog(oRawChipInstance.RemoteCatalog);
            }

            oChip = this.createChip(oRawChipInstance.Chip);
            oChipInstance = new ChipInstance(this, oRawChipInstance, oChip, oPage);
            if (fnSuccess) {
                oChipInstance.load(fnSuccess.bind(null, oChipInstance), fnFailure);
            }
            return oChipInstance;
        };

        /**
         * Creates a new catalog in the backend based on the given raw data. The success handler is
         * called as soon as the catalog has been created and the {@link sap.ushell_abap.pbServices.ui2.Catalog} is
         * not a stub anymore. Typically, this will be used to create "remote catalogs", i.e. pointers
         * to existing catalogs on a remote server.
         * <p>
         * Creating a remote catalog requires two steps: first the catalog data is created via the
         * factory's page building service, then the catalog's CHIPs are loaded from the appropriate
         * remote catalog service (see {@link sap.ushell_abap.pbServices.ui2.Factory#addRemoteCatalogService}). If the
         * second step fails, the error handler is called with an error message and the new catalog
         * instance (since 1.20). In this case the catalog is still a stub and does not know its CHIPs,
         * but it knows more than just its ID and it can be updated!
         *
         * @param {object} oCatalogData
         *   the raw catalog representation for the page building service (<code>__metadata</code> not
         *   needed!), e.g.
         *   <pre>
         *   {
         *     baseUrl: "/sap/hba/apps/kpi/s/odata/hana_chip_catalog.xsodata/",
         *     domainId: "Z_REMOTE_HANA_CATALOG",
         *     remoteId: "HANA_CATALOG",
         *     systemAlias: "sanssouci",
         *     title: "Remote HANA catalog",
         *     type: "REMOTE"
         *   }
         *   </pre>
         * @param {function(sap.ushell_abap.pbServices.ui2.Catalog)} fnSuccess
         *   success handler for asynchronous creation
         * @param {function(string, sap.ushell_abap.pbServices.ui2.Catalog=, object=)} fnFailure
         *   error handler, taking an error message, an optional {@link sap.ushell_abap.pbServices.ui2.Catalog}
         *   instance and, since version 1.28.6, an optional object containing the
         *   complete error information.<br />
         *   See fnFailure parameter of {@link sap.ushell_abap.pbServices.ui2.ODataWrapper#onError}
         *   for more details about the complete error information parameter.
         *
         * @since 1.19.1
         */
        this.createNewCatalog = function (oCatalogData, fnSuccess, fnFailure) {
            this.getPageBuildingService().createCatalog(oCatalogData,
                function (oRawCatalog) {
                    var oCatalog = that.createCatalog(oRawCatalog);
                    oCatalog.load(fnSuccess.bind(null, oCatalog), function (sErrorMessage, oErrorInformation) {
                        fnFailure(sErrorMessage, oCatalog, oErrorInformation);
                    });
                }, function (sErrorMessage, oMaybeErrorInformation) { // consistent fnFailure
                    fnFailure(sErrorMessage, /* sap.ushell_abap.pbServices.ui2.Catalog */undefined, oMaybeErrorInformation);
                });
        };

        /**
         * Creates a new catalog in the backend, based on a catalog page and using the given domain ID
         * and title. The success handler is called as soon as the catalog has been created and the
         * {@link sap.ushell_abap.pbServices.ui2.Catalog} is not a stub anymore. Access the new catalog in order to
         * learn the resulting ID! Use {@link sap.ushell_abap.pbServices.ui2.Catalog#getCatalogPage} to access the
         * corresponding catalog page which is initially a stub.
         *
         * @param {string} sDomainId
         *   the catalog's domain-specific ID
         * @param {string} [sTitle]
         *   the catalog's title
         * @param {function(sap.ushell_abap.pbServices.ui2.Catalog)} fnSuccess
         *   success handler for asynchronous creation
         * @param {function(string, object=)} [fnFailure]
         *   error handler taking an error message and, since version 1.28.6, an
         *   optional object containing the complete error information as delivered
         *   by the ODataService. See fnFailure parameter of {@link sap.ushell_abap.pbServices.ui2.ODataWrapper#onError}
         *   for more details.
         *   If not given
         *   <code>{@link sap.ushell_abap.pbServices.ui2.ODataService#getDefaultErrorHandler}</code> is used
         *
         * @since 1.19.1
         */
        this.createNewPageBasedCatalog = function (sDomainId, sTitle, fnSuccess, fnFailure) {
            this.getPageBuildingService().createPageBasedCatalog(sDomainId, sTitle,
                function (oRawCatalog) {
                    that.createCatalog(oRawCatalog, fnSuccess, fnFailure);
                }, fnFailure);
        };

        /**
         * Creates a new page with the given ID and returns the stub. If a success
         * handler is given, the page will be loaded automatically from the
         * page building service, calling one of the given handlers.
         *
         * @param {string} sPageId
         *   the page ID
         * @param {function(sap.ushell_abap.pbServices.ui2.Page)} [fnSuccess]
         *   success handler for asynchronous loading
         * @param {function(string, object=)} [fnFailure]
         *   error handler taking an error message and, since version 1.28.6, an
         *   optional object containing the complete error information as delivered
         *   by the ODataService. See fnFailure parameter of {@link sap.ushell_abap.pbServices.ui2.ODataWrapper#onError}
         *   for more details.
         *   If not given
         *   <code>{@link sap.ushell_abap.pbServices.ui2.ODataService#getDefaultErrorHandler}</code> is used
         * @param {boolean} [bPartially=false]
         *   whether to load the page only partially (instead of completely, including its CHIP
         *   instances)
         *
         * @returns {sap.ushell_abap.pbServices.ui2.Page}
         *   the newly created page, as a stub
         * @since 1.2.0
         */
        this.createPage = function (sPageId, fnSuccess, fnFailure, bPartially) {
            var oPage;
            oPage = new Page(this, sPageId);
            if (fnSuccess) {
                oPage.load(fnSuccess.bind(null, oPage), fnFailure, bPartially);
            }
            return oPage;
        };

        /**
         * Creates a new page set with the given ID and returns the stub. If a success
         * handler is given, the page set will be loaded automatically from the
         * page building service, calling one of the given handlers.
         *
         * @param {string} sPageSetId
         *   the page set ID
         * @param {function(sap.ushell_abap.pbServices.ui2.PageSet)} [fnSuccess]
         *   success handler for asynchronous loading
         * @param {function(string, object=)} [fnFailure]
         *   error handler taking an error message and, since version 1.28.6, an
         *   optional object containing the complete error information as delivered
         *   by the ODataService. See fnFailure parameter of {@link sap.ushell_abap.pbServices.ui2.ODataWrapper#onError}
         *   for more details.
         *   If not given
         *   <code>{@link sap.ushell_abap.pbServices.ui2.ODataService#getDefaultErrorHandler}</code> is used
         *
         * @returns {sap.ushell_abap.pbServices.ui2.PageSet}
         *   the newly created page set, as a stub
         * @since 1.11.0
         */
        this.createPageSet = function (sPageSetId, fnSuccess, fnFailure) {
            var oPageSet;
            oPageSet = new PageSet(this, sPageSetId);
            if (fnSuccess) {
                oPageSet.load(fnSuccess.bind(null, oPageSet), fnFailure);
            }
            return oPageSet;
        };

        /**
         * Removes the catalog from the factory internal cache.
         *
         * @param {sap.ui.srvc.Catalog} oCatalog
         *   catalog to be removed from cache
         *
         * @private
         */
        this.forgetCatalog = function (oCatalog) {
            delete mCatalogs[oCatalog.getId()];
        };

        /**
         * Returns this factory's page building service.
         *
         * @returns {sap.ushell_abap.pbServices.ui2.PageBuildingService}
         *   this factory's page building service
         * @since 1.2.0
         */
        this.getPageBuildingService = function () {
            return oPbs;
        };

        /**
         * Gets the remote catalog service that is able to deliver CHIPs for the given remote catalog.
         *
         * @param {object} oRawCatalog
         *   the JSON description of the remote catalog as delivered from
         *   {@link sap.ushell_abap.pbServices.ui2.PageBuildingService#readCatalog}.
         * @returns {sap.ushell_abap.pbServices.ui2.RemoteCatalogService}
         *   the remote catalog service compatible to {@link sap.ushell_abap.pbServices.ui2.RemoteCatalogService} or
         *   <code>undefined</code> if no such service has been added via
         *   {@link #addRemoteCatalogService}
         * @private
         */
        this.getRemoteCatalogService = function (oRawCatalog) {
            var sBaseUrl = oRawCatalog.type === "H"
                ? "/sap/hba/apps/kpi/s/odata/hana_chip_catalog.xsodata"
                : oRawCatalog.baseUrl;

            return sBaseUrl
                ? oRemoteCatalogServicesByBaseUrl.get(sBaseUrl.replace(/\/$/, "")) // ignore trailing '/'
                : undefined;
        };

        /**
         * Returns this factory's string representation.
         *
         * @param {boolean} [bVerbose=false]
         *   flag whether to show all properties
         * @returns {string}
         *   this factory's string representation
         * @since 1.2.0
         */
        this.toString = function (bVerbose) {
            var aResult = [
                "Factory({oPbs:", oPbs.toString(bVerbose)
            ];
            if (bVerbose) {
                aResult.push(",mChips:", JSON.stringify(mChips));
            }
            aResult.push("})");
            return aResult.join("");
        };

        // constructor code -------------------------------------------------------
        oRemoteCatalogServicesByBaseUrl = new Utils.Map();
        if (!oPbs) {
            throw new SrvcError("Missing page building service", "Factory");
        }
        Log.debug("Created: " + this, null, "Factory");
    };

    // public factory function ***************************************************

    /**
     * Constructs a new factory for wrapper objects corresponding to catalogs,
     * pages, CHIP instances, or CHIPs loaded from the page building service with the given base URI.
     *
     * @param {string} sBaseUri
     *   base URI of the page building service
     * @param {function(string, object=)} [fnDefaultFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ushell_abap.pbServices.ui2.ODataWrapper#onError}
     *   for more details.
     * @param {boolean} [bIsPersonalization=false]
     *   defines the return value of {@link sap.ushell_abap.pbServices.ui2.PageBuildingService#isPersonalization} of
     *   the returned factory's page building service facade (since 1.16.1)
     * @param {string} [sCacheId]
     *   Cache ID to read from PAGE_BUILDER_PERS with cache busting.
     * @returns {sap.ushell_abap.pbServices.ui2.Factory}
     *   returns the new factory for the given <code>sBaseUri</code>
     * @since 1.2.0
     *
     * @see sap.ushell_abap.pbServices.ui2.Factory
     * @see sap.ushell_abap.pbServices.ui2.PageBuildingService
     * @see PageBuildingService.createPageBuildingService()
     */
    Factory.createFactory = function (sBaseUri, fnDefaultFailure, bIsPersonalization, sCacheId) {
        return new Factory(
            PageBuildingService.createPageBuildingService(sBaseUri, fnDefaultFailure, bIsPersonalization, sCacheId)
        );
    };

    return Factory;
});
