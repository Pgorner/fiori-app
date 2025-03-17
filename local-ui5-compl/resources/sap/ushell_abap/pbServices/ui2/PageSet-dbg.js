// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview A wrapper for a page set loaded from the page building service.
 */

sap.ui.define([
    "sap/ushell_abap/pbServices/ui2/Utils",
    "sap/ushell_abap/pbServices/ui2/Page",
    "sap/ushell_abap/pbServices/ui2/Error",
    "sap/base/Log"
], function (
    Utils,
    Page,
    SrvcError,
    Log
) {
    "use strict";

    var O_PAGE_TYPES = {
        // don't start with 0 because it is falsy
        assigned: 1, // contained in AssignedPages and scope is not PERSONALIZATION
        userCreated: 2, // not contained in AssignedPages or DefaultPage
        personalized: 3, // contained in AssignedPages and scope is PERSONALIZATION
        defaultPage: 4 // assigned as DefaultPage
    };

    // "public class" ************************************************************

    /**
     * Constructs for the given ID a new representation (wrapper) of the page set with associated
     * pages (see {@link sap.ushell_abap.pbServices.ui2.Page}).
     * A page set is a mutable object and changes can be persisted by the page building service (see
     * {@link sap.ushell_abap.pbServices.ui2.PageBuildingService}).
     *
     * @param {sap.ushell_abap.pbServices.ui2.Factory} oFactory
     *  the factory
     * @param {string} sPageSetId
     *   the page set's ID
     * @class
     * @since 1.11.0
     * @private
     */
    var PageSet = function (oFactory, sPageSetId) {
        var sId, // the page set ID
            oAlterEgo, // page set's representation with all relations removed
            oDefaultPage,
            aPages = [],
            oPageTypes,
            bIsStub = true,
            that = this;

        /**
         * Makes sure the given page set is not just a stub.
         *
         * @private
         */
        function checkStub () {
            if (bIsStub) {
                throw new SrvcError(that + ": page set is just a stub", "sap.ushell_abap.pbServices.ui2.PageSet");
            }
        }

        /**
         * Returns the type of the given page.
         *
         * @param {sap.ushell_abap.pbServices.ui2.Page} oPage
         *   any page of this page set
         * @returns {int}
         *   the page type as defined privately
         * @private
         */
        this.getPageType = function (oPage) {
            var sId = oPage.getId(),
                iPageType;

            checkStub();
            if (!oPageTypes.containsKey(sId)) {
                throw new SrvcError("Unknown page " + sId, "sap.ushell_abap.pbServices.ui2.PageSet");
            }

            iPageType = oPageTypes.get(sId);
            if (iPageType === O_PAGE_TYPES.assigned && oPage.isPersonalized()) {
                iPageType = O_PAGE_TYPES.personalized;
            }
            return iPageType;
        };

        /**
         * Initializes the page set when the alter ego is known
         * @param {object} oNewAlterEgo
         *  JSON representation of the page set (as received from the OData service)
         * @private
         */
        function initialize (oNewAlterEgo) {
            var sDefaultPageId = oNewAlterEgo.DefaultPage.id,
                aRawAssignedPages = (oNewAlterEgo.AssignedPages && oNewAlterEgo.AssignedPages.results)
                    || [];

            oAlterEgo = oNewAlterEgo;

            // initialize type for assigned pages
            oPageTypes = new Utils.Map();
            aRawAssignedPages.forEach(function (oRawAssignedPage) {
                // assume only ID is present
                oPageTypes.put(oRawAssignedPage.id, O_PAGE_TYPES.assigned);
            });

            // initialize already loaded pages
            oAlterEgo.Pages.results.forEach(function (oRawPage) {
                var oPage = new Page(oFactory, oRawPage),
                    sPageId = oPage.getId();

                aPages.push(oPage);

                if (sDefaultPageId === sPageId) {
                    oDefaultPage = oPage;
                    oPageTypes.put(sPageId, O_PAGE_TYPES.defaultPage);
                } else if (!oPageTypes.containsKey(sPageId)) { // not AssignedPage
                    oPageTypes.put(sPageId, O_PAGE_TYPES.userCreated);
                }
            });

            // remove relations
            delete oAlterEgo.AssignedPages;
            delete oAlterEgo.DefaultPage;
            delete oAlterEgo.Pages;

            bIsStub = false;
            Log.debug("Initialized: " + that, null, "PageSet");
        }

        /**
         * Appends a new page with given title to this page set.
         *
         * @param {string} [sPageTitle]
         *   title for the new page
         * @param {string} sCatalogId
         *   id of the default catalog of the new page
         * @param {function(sap.ushell_abap.pbServices.ui2.Page)} fnSuccess
         *   success handler taking new page that has been appended to this page set
         * @param {function(string, object=)} [fnFailure]
         *   error handler taking an error message and, since version 1.28.6, an
         *   optional object containing the complete error information as delivered
         *   by the ODataService. See fnFailure parameter of {@link sap.ushell_abap.pbServices.ui2.ODataWrapper#onError}
         *   for more details.
         *   If not given
         *   <code>{@link sap.ushell_abap.pbServices.ui2.ODataService#getDefaultErrorHandler}</code> is used
         * @since 1.11.0
         */
        this.appendPage = function (sPageTitle, sCatalogId, fnSuccess, fnFailure) {
            checkStub();
            if (typeof fnSuccess !== "function") {
                throw new SrvcError("Missing success handler", "PageSet");
            }

            oFactory.getPageBuildingService().createPageInPageSet(sId, sPageTitle, sCatalogId,
                function (oNewRawPage) {
                    var oNewPage = new Page(oFactory, oNewRawPage); //TODO oFactory.createPage()
                    aPages.push(oNewPage);
                    // all new pages are user created:
                    oPageTypes.put(oNewPage.getId(), O_PAGE_TYPES.userCreated);
                    Log.debug("Appended new page with ID " + oNewPage.getId() + " to pageset "
                        + that, null, "PageSet");

                    fnSuccess(oNewPage);
                }, fnFailure);
        };

        /**
         * Returns true if oPage can entirely be deleted (without a page shining through afterwards).
         * See also <code>isPageResettable</code>.
         *
         *@param {sap.ushell_abap.pbServices.ui2.Page} oPage
         *   the page to be checked
         * @returns {boolean}
         *   true if page can be removed
         * @since 1.11.0
         *
         * @see #isPageResettable
         * @see #removePage
         */
        this.isPageRemovable = function (oPage) {
            return this.getPageType(oPage) === O_PAGE_TYPES.userCreated;
        };

        /**
         * Returns true if a delete on oPage only has effect like a reset (with a page shining
         * through afterwards). However, check also method <code>isPageRemovable</code>.
         *
         *@param {sap.ushell_abap.pbServices.ui2.Page} oPage
         *   the page to be checked
         * @returns {boolean}
         *   true if page can be reset
         * @since 1.11.0
         *
         * @see #isPageRemovable
         * @see #removePage
         */
        this.isPageResettable = function (oPage) {
            return this.getPageType(oPage) === O_PAGE_TYPES.personalized;
        };

        /**
         * Remove given page from this page set; fails if the page is not removable.
         *
         * @param {sap.ushell_abap.pbServices.ui2.Page} oPage
         *   the page to be removed
         * @param {function} [fnSuccess]
         *   no-args success handler
         * @param {function(string, object=)} [fnFailure]
         *   error handler taking an error message and, since version 1.28.6, an
         *   optional object containing the complete error information as delivered
         *   by the ODataService. See fnFailure parameter of {@link sap.ushell_abap.pbServices.ui2.ODataWrapper#onError}
         *   for more details.
         *   If not given
         *   <code>{@link sap.ushell_abap.pbServices.ui2.ODataService#getDefaultErrorHandler}</code> is used
         * @see #isPageRemovable
         * @since 1.11.0
         */
        this.removePage = function (oPage, fnSuccess, fnFailure) {
            if (!this.isPageRemovable(oPage)) {
                throw new SrvcError("Cannot remove page " + oPage.getId(),
                    "PageSet");
            }

            oPage.remove(function () {
                aPages.splice(aPages.indexOf(oPage), 1);
                oPageTypes.remove(oPage.getId());
                if (fnSuccess) {
                    fnSuccess();
                }
            }, fnFailure);
        };

        /**
         * Reset given page from this page set; fails if the page is not resettable.
         *
         * @param {sap.ushell_abap.pbServices.ui2.Page} oPage
         *   the page to be reset
         * @param {function} [fnSuccess]
         *   no-args success handler
         * @param {function(string, object=)} [fnFailure]
         *   error handler taking an error message and, since version 1.28.6, an
         *   optional object containing the complete error information as delivered
         *   by the ODataService. See fnFailure parameter of {@link sap.ushell_abap.pbServices.ui2.ODataWrapper#onError}
         *   for more details.
         *   If not given
         *   <code>{@link sap.ushell_abap.pbServices.ui2.ODataService#getDefaultErrorHandler}</code> is used
         * @see #isPageResettable
         * @since 1.16.1
         */
        this.resetPage = function (oPage, fnSuccess, fnFailure) {
            if (!this.isPageResettable(oPage)) {
                throw new SrvcError("Cannot reset page " + oPage.getId(),
                    "sap.ushell_abap.pbServices.ui2.PageSet");
            }

            // remove page copy from PERSONALIZATION scope
            oPage.remove(function () {
                // reload page from underlying scope
                oPage.load(fnSuccess, fnFailure, /*bPartially*/true);
            }, fnFailure);
        };

        /**
         * Removes all pages from pageset which does not match given page ID or catalog ID.
         * If the pageset is not loaded an error is thrown.
         *
         * @param {string[]} aPageIds
         *   array of valid page IDs
         * @param {string[]} aCatalogIds
         *   array of valid catalog IDs
         * @since 1.16.2
         *
         * @see #isStub()
         * @private
         */
        this.filter = function (aPageIds, aCatalogIds) {
            var i,
                aResult = [],
                oCurrentPage;

            checkStub();
            aPageIds = aPageIds || [];
            aCatalogIds = aCatalogIds || [];

            for (i = 0; i < aPages.length; i += 1) {
                oCurrentPage = aPages[i];
                if (aPageIds.indexOf(oCurrentPage.getId()) !== -1) {
                    aResult.push(oCurrentPage);
                } else if (oCurrentPage.getCatalog()
                    && aCatalogIds.indexOf(oCurrentPage.getCatalog().getId()) !== -1) {
                    aResult.push(oCurrentPage);
                }
            }
            aPages = aResult;
        };

        /**
         * Returns this page set's configuration.
         *
         * @returns {string}
         *   this page set's configuration
         * @since 1.11.0
         *
         * @see #isStub()
         */
        this.getConfiguration = function () {
            checkStub();
            return oAlterEgo.configuration;
        };

        /**
         * Sets this page set's configuration.
         *
         * @param {string} sConfiguration
         *   new configuration string for this page set
         * @param {function} fnSuccess
         *   no-args success handler
         * @param {function(string, object=)} [fnFailure]
         *   error handler taking an error message and, since version 1.28.6, an
         *   optional object containing the complete error information as delivered
         *   by the ODataService. See fnFailure parameter of {@link sap.ushell_abap.pbServices.ui2.ODataWrapper#onError}
         *   for more details.
         *   If not given
         *   <code>{@link sap.ushell_abap.pbServices.ui2.ODataService#getDefaultErrorHandler}</code> is used
         * @since 1.11.0
         *
         * @see #isStub()
         */
        this.setConfiguration = function (sConfiguration, fnSuccess, fnFailure) {
            checkStub();
            if (typeof fnSuccess !== "function") {
                throw new SrvcError("Missing success handler", "PageSet");
            }

            if (oAlterEgo.configuration === sConfiguration) {
                // no change: call success handler async
                Utils.callHandler(fnSuccess, fnFailure, true);
                return;
            }

            oAlterEgo.configuration = sConfiguration;
            oFactory.getPageBuildingService().updatePageSet(oAlterEgo, function (oNewAlterEgo) {
                fnSuccess();
            }, fnFailure);
        };

        /**
         * Returns this page set's default page. Can only be called if the page set is not a stub
         * anymore.
         *
         * @returns {sap.ushell_abap.pbServices.ui2.Page}
         *   this page set's default page
         * @since 1.11.0
         *
         * @see #isStub()
         */
        this.getDefaultPage = function () {
            checkStub();
            return oDefaultPage;
        };

        /**
         * Returns this page set's ID.
         *
         * @returns {string}
         *   this page set's ID
         * @since 1.11.0
         */
        this.getId = function () {
            return sId;
        };

        /**
         * Returns this page set's pages. Can only be called if the page set is not a stub anymore.
         *
         * @returns {sap.ushell_abap.pbServices.ui2.Page[]}
         *   this page set's pages
         * @since 1.11.0
         *
         * @see #isStub()
         */
        this.getPages = function () {
            checkStub();
            return aPages.slice();
        };

        /**
         * Tells whether this page set is still only a stub and does not yet know its properties or
         * related objects, for example pages.
         *
         * @returns {boolean}
         *   whether this page set is still only a stub
         * @since 1.11.0
         *
         * @see #load()
         */
        this.isStub = function () {
            return bIsStub;
        };

        /**
         * Loads the current page set including its configuration, title and pages (aka groups).
         * Property bags of the pages are not loaded. The function <code>loadBag</code> (see
         * {@link sap.ushell_abap.pbServices.ui2.Page#loadBag}) of the page objects needs to be used to get a property
         * bag.
         * Notifies one of the given handlers.
         *
         * @param {function} fnSuccess
         *   no-args success handler
         * @param {function(string, object=)} [fnFailure]
         *   error handler taking an error message and, since version 1.28.6, an
         *   optional object containing the complete error information as delivered
         *   by the ODataService. See fnFailure parameter of {@link sap.ushell_abap.pbServices.ui2.ODataWrapper#onError}
         *   for more details.
         *   If not given
         *   <code>{@link sap.ushell_abap.pbServices.ui2.ODataService#getDefaultErrorHandler}</code> is used
         * @since 1.11.0
         */
        this.load = function (fnSuccess, fnFailure) {
            if (!bIsStub) {
                throw new SrvcError("Page set is not a stub anymore", "PageSet");
            }

            oFactory.getPageBuildingService().readPageSet(sId,
                function (oNewAlterEgo) {
                    Log.debug("Loaded: " + that, null, "PageSet");
                    initialize(oNewAlterEgo);

                    fnSuccess();
                }, fnFailure, /*bCache*/true);
        };

        /**
         * Returns this page set's string representation.
         *
         * @param {boolean} [bVerbose=false]
         *   flag whether to show all properties
         * @returns {string}
         *   this page set's string representation
         * @since 1.11.0
         */
        this.toString = function (bVerbose) {
            var aResult = ['PageSet({sId:"', sId, '",bIsStub:', bIsStub];
            if (bVerbose) {
                aResult.push(",oAlterEgo:", JSON.stringify(oAlterEgo),
                    ",oFactory:", oFactory.toString(bVerbose),
                    ",aPages:", JSON.stringify(aPages)
                );
            }
            aResult.push("})");
            return aResult.join("");
        };

        // constructor code -------------------------------------------------------
        sId = sPageSetId;
        if (!sId) {
            throw new SrvcError("Missing page set ID", "PageSet");
        }
        Log.debug("Created: " + this, null, "PageSet");
    };

    return PageSet;
});
