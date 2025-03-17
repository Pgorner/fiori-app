// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview Provides the Unified Shell's container.
 * @deprecated since 1.101. Please use {@link sap.ushell.Container} instead.
 */
sap.ui.define([
    "sap/ushell/Container",
    "sap/base/Log"
], function (
    Container,
    Log
) {
    "use strict";

    /**
     * @alias sap.ushell.services.Container
     * @namespace
     * @description The Unified Shell's container. Manages renderers, services, and adapters.
     *
     * @param {object} oAdapter the platform-specific adapter corresponding to this service
     *
     * @hideconstructor
     *
     * @since 1.15.0
     * @deprecated since 1.101
     * @public
     */

    Log.warning("The use of sap/ushell/services/Container is deprecated. Please use sap/ushell/Container instead!");
    return Container;
});
