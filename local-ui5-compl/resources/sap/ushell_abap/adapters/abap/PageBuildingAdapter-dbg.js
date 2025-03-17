// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The Unified Shell's page building adapter for the ABAP platform.
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/base/Log",
    "sap/ushell_abap/pbServices/ui2/Factory"
], function (
    ObjectPath,
    Log,
    Factory
) {
    "use strict";

    /**
     * @class
     * @classdesc The Unified Shell's page building adapter for the ABAP platform.
     *
     * This method MUST be called by the Unified Shell's container only.
     * Constructs a new instance of the page building adapter for the ABAP platform.
     * <p>
     * The adapter knows the configuration property <code>remoteCatalogServices</code> which may
     * contain a map of remote catalog base URLs to corresponding remote catalog services.
     * Each such service is assumed to be a no-args constructor function.
     * First the module is required and then the constructor is called, passing the result to
     * {@link sap.ushell_abap.pbServices.ui2.Factory#addRemoteCatalogService}.
     * <p>
     * <b>Example:</b>
     *   <pre>
     *   window["sap-ushell-config"] = {
     *     PageBuilding: {
     *       adapter: {
     *         config: {
     *           remoteCatalogServices: {
     *             "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/": "sap.ushell_abap.pbServices.ui2.RemoteCatalogService",
     *             "/foo": "acme.BarService"
     *           }
     *         }
     *       }
     *     }
     *   }
     *   </pre>
     * With the given configuration the adapter registers remote catalog services for two base URLs
     * using <code>sap.ushell_abap.pbServices.ui2.RemoteCatalogService</code> and <code>acme.BarService</code> resp.
     * as remote catalog service constructor functions.
     * <p>
     * If not specified otherwise, <code>sap.ushell_abap.pbServices.ui2.RemoteCatalogService</code> is registered as
     * a remote catalog service for the following base URLs:
     * <ul>
     *   <li> "/sap/hba/apps/kpi/s/odata/hana_chip_catalog.xsodata/" (legacy HANA catalogs)</li>
     *   <li> "/sap/hba/r/sb/core/odata/modeler/SMART_BUSINESS.xsodata/" (SMART BUSINESS catalogs)</li>
     *   <li> "/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodata/" (SMART BUSINESS catalogs)</li>
     *   <li> "/sap/opu/odata/sap/SM_CATALOG_SRV/" (Social Media catalog)</li>
     * </ul>
     *
     * @param {sap.ushell.System} oSystem the system served by the adapter
     * @param {string} [sParameter="PERS"] a parameter "CUST" or "CONF" determining the scope (since 1.11.0)
     * @param {object} [oProperties] The configuration in the property <code>config</code> (since 1.19.1)
     *
     * @hideconstructor
     * @see sap.ushell.services.PageBuilding
     *
     * @since 1.11.0
     * @private
     */
    return function (oSystem, sParameter, oProperties) {
        var oFactory,
            sScope = "PERS",
            sPageBuilderServiceUrl = "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/", // 3rd Priority (fallback)
            mRemoteCatalogServices = oProperties.config.remoteCatalogServices || {},
            sConfigBaseUrl = ObjectPath.get("config.services.pageBuilding.baseUrl", oProperties);

        // BEWARE: constructor code below!

        /**
         * Returns the UI2 page building factory.
         * @returns {sap.ushell_abap.pbServices.ui2.Factory} the page building factory
         */
        this.getFactory = function () {
            return oFactory;
        };

        // constructor code -------------------------------------------------------

        // accept lower case parameter as in FLPD this is set as query parameter the user alters manually
        sParameter = sParameter ? sParameter.toUpperCase() : "";

        if (sParameter === "CONF" || sParameter === "CUST") {
            // 1st priority: sParameter is used by FLP Designer to configure the scope
            sScope = sParameter;
            sPageBuilderServiceUrl = "/sap/opu/odata/UI2/PAGE_BUILDER_" + sScope + "/";
        } else if (sConfigBaseUrl &&
            ObjectPath.get("config.services.pageBuilding.relativeUrl", oProperties)) {
            // 2nd priority: use configured URL from start_up response
            // overwrite default only if relativeUrl is also given. Otherwise here is a different URL used than in the boottask
            sPageBuilderServiceUrl = sConfigBaseUrl;
        }

        // Get CacheId for PAGE_BUILDER_PERS when available
        var sCacheId = ObjectPath.get("sap-ushell-config.services.Container.adapter.config.services.pbFioriHome.cacheId");

        oFactory = Factory.createFactory(
            sPageBuilderServiceUrl,
            undefined,
            sScope === "PERS",
            sCacheId
        );

        /**
         * Remote Catalogs are deprecated
         * @deprecated since 1.120
         */
        (function () {
            [ // predefined remote catalog services
                "/sap/hba/apps/kpi/s/odata/hana_chip_catalog.xsodata/",
                "/sap/hba/r/sb/core/odata/modeler/SMART_BUSINESS.xsodata/",
                "/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodata/",
                "/sap/opu/odata/sap/SM_CATALOG_SRV/"
            ].forEach(function (sBaseUrl) {
                if (!Object.prototype.hasOwnProperty.call(mRemoteCatalogServices, sBaseUrl)) {
                    mRemoteCatalogServices[sBaseUrl] = "sap.ushell_abap.pbServices.ui2.RemoteCatalogService";
                }
            });
            Object.keys(mRemoteCatalogServices).forEach(function (sBaseUrl) {
                var sRemoteCatalogService = mRemoteCatalogServices[sBaseUrl];
                // Convert to new "home" of RemoteCatalogService
                if (sRemoteCatalogService === "sap.ui2.srvc.RemoteCatalogService") {
                    sRemoteCatalogService = "sap.ushell_abap.pbServices.ui2.RemoteCatalogService";
                }
                var sModulePath = (sRemoteCatalogService || "").replace(/\./g, "/");
                var ServiceModule;
                if (!(ServiceModule = sap.ui.require(sModulePath))) {
                    Log.warning("FLP PageBuildingAdapter: remote catalog service " + sModulePath + " must be loaded before use.");
                    ServiceModule = sap.ui.requireSync(sModulePath); // LEGACY API (deprecated)
                }
                oFactory.addRemoteCatalogService(sBaseUrl, new ServiceModule());
            });
        })();
    };
});
