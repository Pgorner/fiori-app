// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/Manifest",
    "sap/ushell/Container"
], function(
    Log,
    Manifest,
    Container
) {
    "use strict";

    /**
     * Provides the configuration for integration with remote file shares.
     * <p>
     * This is the <em>FileShareSupport</em> strategy implementation for usage in the FLP on the ABAP platform.
     * It uses the <code>NavTargetResolutionInternal</code> service to determine whether the Fiori App for the file integration
     * is assigned to the currently logged on user (controls the enablement) and then reads the data source
     * properties for the file share integration service from the app manifest.
     * </p>
     * <p>
     * This module must not be used directly. Instead, the module name must be retrieved from the SAPUI5 Core
     * configuration (<code>Core.getConfiguration().getFileShareSupport()</code>) and then loaded
     * using <code>sap.ui.require</code> if set. The configuration is done by the FLP during bootstrap.
     * </p>
     *
     * @private
     */
    var NavTargetResolutionFileShareSupport = {};

    var MODULE_NAME = "sap.ushell_abap.integration.fileshares.NavTargetResolutionFileShareSupport";
    var FILE_SHARE_INTENT = "#FileShare-manage";

    /**
     * Get the data source for file share integration
     * <p>
     * This is the implementation of the <em>FileShareSupport</em> interface, i.e.
     * the public contract with the consumers.
     * </p>
     *
     * @returns {Promise<object>} Promise resolving an object for the
     *  data source of the file integration service as defined in the manifest;
     *  if the file share integration is not enabled or an error occurs, the promise is rejected
     */
    NavTargetResolutionFileShareSupport.getDataSource = function () {
        if (!NavTargetResolutionFileShareSupport._getDataSourcePromise) {
            NavTargetResolutionFileShareSupport._getDataSourcePromise = Container.getServiceAsync("NavTargetResolutionInternal").then(function (oNavTargetResolutionService) {
                return oNavTargetResolutionService.resolveHashFragment(FILE_SHARE_INTENT); // jQuery promise is implicitly converted to native
            }).then(function (oResolvedHashFragment) {
                var sManifestUrl = oResolvedHashFragment && oResolvedHashFragment.applicationDependencies && oResolvedHashFragment.applicationDependencies.manifest;
                if (sManifestUrl) {
                    return Manifest.load({
                        manifestUrl: sManifestUrl,
                        async: true
                    });
                }

                var sErrorMessage = ["No manifest URL defined in resolved navigation target:", JSON.stringify(oResolvedHashFragment)].join(" ");
                Log.error(sErrorMessage, null, MODULE_NAME);
                throw new Error(sErrorMessage);
            }).then(function (oManifest) {
                return oManifest.getEntry("/sap.app/dataSources/mainService");
            });
        }

        return NavTargetResolutionFileShareSupport._getDataSourcePromise;
    };

    return NavTargetResolutionFileShareSupport;
});
