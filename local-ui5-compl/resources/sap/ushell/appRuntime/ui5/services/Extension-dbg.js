// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The app runtime wrapper for {@link sap.ushell.services.Extension}.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/util/isPlainObject",
    "sap/ushell/appRuntime/ui5/services/Extension/Item",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr"
], function (
    isPlainObject,
    ExtensionItem,
    AppRuntimeService,
    AppCommunicationMgr
) {
    "use strict";

    /**
     * @alias sap.ushell.appRuntime.ui5.services.Extension
     * @class
     * @classdesc The app runtime wrapper for {@link sap.ushell.services.Extension}.
     *
     * @hideconstructor
     *
     * @since 1.124.0
     * @private
     */
    function ExtensionProxy () {
        this._oItemMap = {};

        AppCommunicationMgr.registerCommHandlers({
            "sap.ushell.services.Extension": {
                oServiceCalls: {
                    handleControlEvent: {
                        executeServiceCallFn: async (oServiceParams) => {
                            const { itemId, eventName, eventParameters } = oServiceParams.oMessageData.body;
                            await this._handleControlEvent(itemId, eventName, eventParameters);
                        }
                    }
                }
            }
        });
    }

    /**
     * Separates the properties of a control into primitive, complex and event properties.
     * @param {object} oControlProperties The properties of the control.
     * @returns {{ primitive: Object<string, int|string|boolean|object>, complex: object, events: Object<string, function> }} The separated properties.
     *
     * @since 1.124.0
     * @private
     */
    ExtensionProxy.prototype._extractControlProperties = function (oControlProperties) {
        const oProperties = {
            primitive: {},
            complex: {},
            events: {}
        };
        Object.keys(oControlProperties).forEach((sKey) => {
            const vValue = oControlProperties[sKey];

            if (typeof vValue === "function") {
                oProperties.events[sKey] = vValue;

            } else if (typeof vValue === "object") {
                if (isPlainObject(vValue)) {
                    oProperties.primitive[sKey] = vValue;
                } else {
                    oProperties.complex[sKey] = vValue;
                }

            } else {
                oProperties.primitive[sKey] = vValue;
            }
        });
        return oProperties;
    };

    /**
     * Creates a header item in the shell header.
     * @param {sap.ushell.ui.shell.ShellHeadItem.Properties} controlProperties The properties that will be passed to the created control.
     * @param {object} [parameters] Additional parameters.
     * @param {string} [parameters.position=end] Possible values are <code>begin</code> and <code>end</code>.
     * @returns {Promise<sap.ushell.appRuntime.ui5.services.Extension.Item>} A wrapper for the newly created header item.
     *
     * @see sap.ushell.services.Extension#createHeaderItem
     *
     * @since 1.124.0
     * @private
     */
    ExtensionProxy.prototype.createHeaderItem = async function (controlProperties, parameters = {}) {
        const oProperties = this._extractControlProperties(controlProperties);

        if (Object.keys(oProperties.complex).length > 0) {
            throw new Error("Complex properties (aggregations, controls, non plain objects) are not allowed for header items!");
        }

        const { itemId } = await AppRuntimeService.postMessageToFLP("sap.ushell.services.Extension.createHeaderItem", {
            controlProperties: oProperties.primitive,
            events: Object.keys(oProperties.events),
            parameters
        });

        const oItem = new ExtensionItem(itemId, oProperties.events);
        this._oItemMap[itemId] = oItem;

        return oItem;
    };

    /**
     * Creates a user action in the user action menu.
     * @param {object} controlProperties The properties that will be passed to the created control.
     * <p><b>Restriction:</b> The control properties are only allowed to contain primitive properties and event handlers.
     * Aggregations, controls and types with prototypes are not allowed!</p>
     * @param {object} [parameters] Additional parameters.
     * @param {string} [parameters.controlType=sap.ushell.ui.launchpad.ActionItem] Defines the <code>controlType</code>.
     * @returns {Promise<sap.ushell.appRuntime.ui5.services.Extension.Item>} A wrapper for the newly created user action.
     *
     * @see sap.ushell.services.Extension#createUserAction
     *
     * @since 1.124.0
     * @private
     */
    ExtensionProxy.prototype.createUserAction = async function (controlProperties, parameters = {}) {
        const oProperties = this._extractControlProperties(controlProperties);

        if (Object.keys(oProperties.complex).length > 0) {
            throw new Error("Complex properties (aggregations, controls, non plain objects) are not allowed for user actions!");
        }

        const { itemId } = await AppRuntimeService.postMessageToFLP("sap.ushell.services.Extension.createUserAction", {
            controlProperties: oProperties.primitive,
            events: Object.keys(oProperties.events),
            parameters
        });

        const oItem = new ExtensionItem(itemId, oProperties.events);
        this._oItemMap[itemId] = oItem;

        return oItem;
    };

    /**
     * Handles the event of a control.
     * @param {string} sItemId The ID of the item.
     * @param {string} sEventName The name of the event.
     *
     * @since 1.124.0
     * @private
     */
    ExtensionProxy.prototype._handleControlEvent = function (sItemId, sEventName) {
        const oItem = this._oItemMap[sItemId];
        if (oItem) {
            oItem.handleEvent(sEventName);
        }
    };

    /**
     * Sets the second title in the shell header next to the application title.
     * It is displayed indefinitely until a different second title was set.
     * @param {string} sTitle The title.
     * @returns {Promise} A promise that resolves when the title was set.
     *
     * @since 1.125.0
     * @private
     * @experimental since 1.125.0
     */
    ExtensionProxy.prototype.setSecondTitle = function (sTitle) {
        return AppRuntimeService.postMessageToFLP("sap.ushell.services.Extension.setSecondTitle", {
            title: sTitle
        });
    };

    ExtensionProxy.hasNoAdapter = true;

    return ExtensionProxy;
});
