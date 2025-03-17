// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview Provides control sap.ushell.ui.appfinder.AppBox.
 * @deprecated since 1.120
 */
sap.ui.define([
    "sap/ushell/ui/appfinder/AppBoxInternal"
], function (AppBoxInternal) {
    "use strict";

    /**
     * @alias sap.ushell.ui.appfinder.AppBox
     * @class
     * @classdesc Constructor for a new ui/appfinder/AppBox.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * Add your documentation for the new ui/appfinder/AppBox
     * @extends sap.ui.core.Control
     *
     * @public
     * @deprecated since 1.120
     */
    const AppBox = AppBoxInternal.extend("sap.ushell.ui.appfinder.AppBox" /** @lends sap.ushell.ui.appfinder.AppBox.prototype */);
    return AppBox;
});
