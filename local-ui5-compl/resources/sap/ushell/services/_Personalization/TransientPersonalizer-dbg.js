// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileoverview The transient personalizer shall be used in container mode for table personalization.
 * @deprecated since 1.120 Please use {@link sap.ushell.services.PersonalizationV2.TransientPersonalizer} instead
 */
sap.ui.define([
"sap/ui/thirdparty/jquery"
], function (jQuery) {
    "use strict";

    /**
     * @alias sap.ushell.services.Personalization.TransientPersonalizer
     * @class
     * @classdesc The transient personalizer shall be used in container mode for table personalization.
     * To be called by the personalization service getTransientPersonalizer method.
     *
     * @public
     *
     * @since 1.18.0
     * @deprecated since 1.120 Please use {@link sap.ushell.services.PersonalizationV2.TransientPersonalizer} instead
     */
    function TransientPersonalizer () {
        this._oValue = undefined;
    }

    /**
     * Gets a personalization data value.
     *
     * @name sap.ushell.services.TransientPersonalizer#getPersData
     *
     * @returns {jQuery.Promise} Always resolves an object containing the personalization value. If there is no
     *          personalization data for the item, undefined is returned.
     *
     * @public
     * @function
     * @since 1.18.0
     */
    TransientPersonalizer.prototype.getPersData = function () {
        var oDeferred;

        oDeferred = new jQuery.Deferred();
        oDeferred.resolve(this._oValue);
        return oDeferred.promise();
    };

    /**
     * Sets a personalization data value.
     *
     * @name sap.ushell.services.TransientPersonalizer#setPersData
     *
     * @param {object} oValue JSON object containing the personalization value.
     * @returns {jQuery.Promise} Always resolves once the save attempt is done.
     *
     * @public
     * @function
     * @since 1.18.0
     */
    TransientPersonalizer.prototype.setPersData = function (oValue) {
        var oDeferred;

        oDeferred = new jQuery.Deferred();
        this._oValue = oValue;
        oDeferred.resolve();
        return oDeferred.promise();
    };

    /**
     * Deletes a personalization data value.
     *
     * @name sap.ushell.services.TransientPersonalizer#delPersData
     *
     * @returns {jQuery.Promise} Always resolves once the delete attempt is done.
     *
     * @public
     * @function
     * @since 1.18.0
     */
    TransientPersonalizer.prototype.delPersData = function () {
        var oDeferred;

        oDeferred = new jQuery.Deferred();
        this._oValue = undefined;
        oDeferred.resolve();
        return oDeferred.promise();
    };

    /**
     * Synchronously sets a personalization data value.
     *
     * @name sap.ushell.services.TransientPersonalizer#setValue
     *
     * @param {object} oValue JSON object containing the personalization value.
     *
     * @public
     * @function
     * @since 1.18.0
     */
    TransientPersonalizer.prototype.setValue = function (oValue) {
        this._oValue = oValue;
    };

    /**
     * Synchronously gets a personalization data value.
     *
     * @name sap.ushell.services.TransientPersonalizer#getValue
     *
     * @returns {object} JSON object containing the personalization value.
     *
     * @public
     * @function
     * @since 1.18.0
     */
    TransientPersonalizer.prototype.getValue = function () {
        return this._oValue;
    };

    return TransientPersonalizer;

});
