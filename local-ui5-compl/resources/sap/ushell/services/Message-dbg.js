// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The Unified Shell's message service.
 * @version 1.132.1
 * @deprecated since 1.120
 */
sap.ui.define([
    "sap/ushell/services/MessageInternal"
], function (
    MessageInternal
) {
    "use strict";

    /**
     * @name sap.ushell.services.Message
     * @class
     * @classdesc Message service.
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call {@link sap.ushell.Container#getServiceAsync}.
     * <pre>
     *   sap.ui.require(["sap/ushell/Container"], async function (Container) {
     *     const Message = await Container.getServiceAsync("Message");
     *     // do something with the Message service
     *   });
     * </pre>
     *
     * @augments sap.ushell.services.Service
     * @hideconstructor
     *
     * @since 1.16.0
     * @public
     * @deprecated since 1.120
     */

    /**
     * @name info
     * @function
     * @memberof sap.ushell.services.Message#
     *
     * Shows a MessageToast on the screen.
     *
     * @param {string} sMessage the localized message as plain text
     * @param {int} [iDuration=3000] display duration in ms
     *
     * @since 1.16.0
     * @public
     * @deprecated since 1.120
     */

    /**
     * @name error
     * @function
     * @memberof sap.ushell.services.Message#
     *
     * Shows an error message on the screen.
     *
     * @param {string} sMessage the localized message as plain text
     * @param {string} [sTitle] the localized title as plain text
     *
     * @since 1.16.0
     * @public
     * @deprecated since 1.120
     */

    /**
     * @name confirm
     * @function
     * @memberof sap.ushell.services.Message#
     *
     * Shows an confirmation dialog on the screen.
     *
     * The callback is called with the following signature:
     * <code>function(Action)</code> where Action is the action type that the user has tapped.
     * For example, when the user has pressed the close button, a sap.m.MessageBox.Action.Close is returned.
     *
     * If no actions are provided, "OK" and "Cancel" will be shown. In this case Action is set by one of the following three values:
     *   1. sap.m.MessageBox.Action.OK: "OK" (confirmed) button is tapped.
     *   2. sap.m.MessageBox.Action.Cancel: "Cancel" (unconfirmed) button is tapped.
     *   3. null: Confirm dialog is closed by calling sap.m.InstanceManager.closeAllDialogs()
     *
     * @param {string} sMessage the localized message as plain text
     * @param {function(): string} fnCallback callback function
     * @param {string} [sTitle] the localized title as plain text
     * @param {sap.m.MessageBox.Action|sap.m.MessageBox.Action[]|string|string[]} [vActions]
     *   Either a single action, or an array of two actions.
     *   If no action(s) are given, the single action MessageBox.Action.OK is taken as a default for the parameter.
     *   If more than two actions are given, only the first two actions are taken.
     *   Custom action string(s) can be provided, and then the translation of custom action string(s)
     *   needs to be done by the application.
     *
     * @since 1.16.0
     * @public
     * @deprecated since 1.120
     */

    /**
     * @name errorWithDetails
     * @function
     * @memberof sap.ushell.services.Message#
     *
     * Shows an error message with details on the screen.
     * If more than one control should be shown, an {sap.m.VBox} can be used.
     * The default title is "error".
     * If no custom buttons are given, an emphasized "close" button is shown.
     *
     * @param {string} message The localized message as plain text
     * @param {sap.ui.core.Control} [detailControl] The control that should be displayed,
     * once a user presses the "View Details" link
     * @param {string} [title] The localized title as plain text
     * @param {sap.m.Button[]} [buttons] The custom buttons that should be shown on the dialog
     *
     * @returns {sap.m.Dialog} The error dialog, so it can be destroyed by a custom button
     *
     * @since 1.81.0
     * @protected
     * @deprecated since 1.120
     */

    /**
     * @name Type
     * @enum
     * @memberof sap.ushell.services.Message
     * @since 1.16.0
     * @private
     *
     * @deprecated since 1.120
     */

    return MessageInternal;
});
