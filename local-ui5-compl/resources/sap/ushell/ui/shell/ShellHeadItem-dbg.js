// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ui/core/Control",
    "sap/ui/core/IconPool",
    "sap/ui/core/InvisibleText",
    "sap/ushell/library", // css style dependency
    "sap/ushell/resources"
], function (
    ObjectPath,
    Control,
    IconPool,
    InvisibleText,
    ushellLibrary,
    resources
) {
    "use strict";

    // shortcut for sap.ushell.FloatingNumberType
    var FloatingNumberType = ushellLibrary.FloatingNumberType;

    /**
     * @typedef {object} sap.ushell.ui.shell.ShellHeadItem.Properties
     *
     * @property {sap.ui.core.URI} icon The icon of the item, either defined in the sap.ui.core.IconPool or an URI to a custom image.
     * @property {string} [text] The text of the item. It is either visible as tooltip or as label when the item is rendered as part of an overflow button in a popover.
     * @property {sap.ui.core.URI} [target] Target URI of the item.
     * @property {string} [ariaLabel] The aria-label attribute of the item.
     * @property {boolean} [ariaHidden] Specifies whether the aria-hidden attribute is set to true.
     * @property {sap.ui.core.aria.HasPopup} [ariaHaspopup] Specifies the value of the aria-haspopup attribute
     * @property {function} [press] The press handler function.
     *
     * @public
     */

    /**
     * @alias sap.ushell.ui.shell.ShellHeadItem
     * @class
     * @classdesc Header Action item of the Shell.
     * Constructor for a new ShellHeadItem.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @extends sap.ui.core.Control
     *
     * @since 1.15.1
     * @private
     */
    var ShellHeadItem = Control.extend("sap.ushell.ui.shell.ShellHeadItem", /** @lends sap.ushell.ui.shell.ShellHeadItem.prototype */ {
        metadata: {
            library: "sap.ushell",
            properties: {
                /**
                 * If set to true, a divider is displayed before the item.
                 *
                 * @deprecated since 1.18 Dividers are not supported anymore.
                 */
                startsSection: {
                    type: "boolean",
                    group: "Appearance",
                    defaultValue: false,
                    deprecated: true
                },
                /**
                 * If set to true, a separator is displayed after the item.
                 *
                 * @since 1.22.5
                 * @deprecated since 1.62. Support for the showSeparator property has been discontinued in Fiori 2 and later.
                 */
                showSeparator: {
                    type: "boolean",
                    group: "Appearance",
                    defaultValue: false,
                    deprecated: true
                },
                /**
                 * If set to false, the button isn't clickable and displayed as disabled.
                 *
                 * @since 1.38
                 */
                enabled: {
                    type: "boolean",
                    group: "Appearance",
                    defaultValue: true
                },
                /**
                 * If set to true, the item gets a special design.
                 *
                 */
                selected: {
                    type: "boolean",
                    group: "Appearance",
                    defaultValue: false
                },
                /**
                 * If set to true, a theme dependent marker is shown on the item.
                 *
                 * @deprecated since 1.18. Markers should not be used anymore.
                 */
                showMarker: {
                    type: "boolean",
                    group: "Appearance",
                    defaultValue: false,
                    deprecated: true
                },
                /**
                 * The icon of the item, either defined in the sap.ui.core.IconPool or an URI to a custom image. An icon must be set.
                 *
                 * @public
                 */
                icon: {
                    type: "sap.ui.core.URI",
                    group: "Appearance",
                    defaultValue: null
                },
                /**
                 * Target URI of the item.
                 *
                 * @public
                 */
                target: {
                    type: "sap.ui.core.URI",
                    group: "Appearance",
                    defaultValue: null
                },
                /**
                 * The aria-label attribute of the item.
                 *
                 * @public
                 */
                ariaLabel: {
                    type: "string",
                    group: "Accessibility",
                    defaultValue: null
                },
                /**
                 * Specifies whether the aria-hidden attribute is set to true.
                 *
                 * @public
                 */
                ariaHidden: {
                    type: "boolean",
                    group: "Accessibility",
                    defaultValue: false
                },
                /**
                 * Specifies the value of the aria-haspopup attribute
                 *
                 * @public
                 */
                ariaHaspopup: {
                    type: "string",
                    group: "Accessibility",
                    defaultValue: ""
                },
                /**
                 * The text of the item. It is either visible as tooltip or as label when the
                 * item is rendered as part of an overflow button in a popover.
                 *
                 * @since 1.38
                 * @public
                 */
                text: {
                    type: "string",
                    group: "Appearance",
                    defaultValue: null
                },
                /**
                 * The floating number of the item.
                 */
                floatingNumber: {
                    type: "int",
                    group: "Appearance",
                    defaultValue: null
                },
                /**
                 * The maximum value of the floating number.
                 */
                floatingNumberMaxValue: {
                    type: "int",
                    group: "Appearance",
                    defaultValue: 999
                },
                /**
                 * The type of the floating number.
                 */
                floatingNumberType: {
                    type: "sap.ushell.FloatingNumberType",
                    group: "Appearance",
                    defaultValue: FloatingNumberType.None
                }
            },
            events: {
                /**
                 * Event is fired when the user presses the item.
                 */
                press: {}
            }
        },
        renderer: {
            apiVersion: 2,
            render: function (rm, shellHeadItem) {
                var sTarget = shellHeadItem.getTarget();
                rm.openStart("a", shellHeadItem);
                rm.attr("tabindex", "0");
                if (sTarget) {
                    rm.attr("href", sTarget);
                }
                rm.attr("role", sTarget ? "link" : "button");

                var sAriaLabel = shellHeadItem.getAriaLabel();
                if (sAriaLabel) {
                    rm.attr("aria-label", sAriaLabel);
                }

                var bAriaHidden = shellHeadItem.getAriaHidden();
                if (bAriaHidden) {
                    rm.attr("aria-hidden", bAriaHidden);
                }

                var sAriaHaspopup = shellHeadItem.getAriaHaspopup();
                if (sAriaHaspopup) {
                    rm.attr("aria-haspopup", sAriaHaspopup);
                }

                rm.attr("aria-describedby", shellHeadItem._oAriaDescribedbyText.getId());

                if (shellHeadItem.getTooltip_AsString()) {
                    rm.attr("title", shellHeadItem.getTooltip_AsString());
                }

                if (shellHeadItem.getFloatingNumber() > 0) {
                    rm.attr("data-counter-content", shellHeadItem.floatingNumberFormatter());
                    rm.class("sapUshellShellHeadItmCounter");
                }

                rm.class("sapUshellShellHeadItm");

                if (!shellHeadItem.getEnabled()) {
                    rm.class("sapUshellShellHeadItmDisabled");
                }

                if (shellHeadItem.getSelected()) {
                    rm.class("sapUshellShellHeadItmSel");
                }

                var sText = shellHeadItem.getText();
                var sTooltip = shellHeadItem.getTooltip_AsString();
                if (sText || sTooltip) {
                    rm.attr("title", sTooltip || sText);
                }

                rm.openEnd(); // a - tag

                rm.openStart("span"); // actual icon is placed into the span
                rm.class("sapUshellShellHeadItmCntnt");

                var oIcon = shellHeadItem.getIcon();
                var oIconInfo = IconPool.isIconURI(oIcon) && IconPool.getIconInfo(oIcon);
                if (oIconInfo) {
                    rm.style("font-family", oIconInfo.fontFamily);
                    rm.openEnd(); // span - tag
                    rm.text(oIconInfo.content);
                } else {
                    rm.openEnd(); // span - tag
                    rm.voidStart("img");
                    rm.attr("id", shellHeadItem.getId() + "-img-inner");
                    rm.attr("src", oIcon);
                    rm.voidEnd(); // img - tag
                }

                rm.close("span");
                rm.close("a");
            }
        }
    });

    ShellHeadItem.prototype.init = function () {
        // this method is also called by "sap.ushell.ui.shell.OverflowListItem"
        this._oAriaDescribedbyText = new InvisibleText(this.getId() + "-describedby").toStatic();
        this.addDependent(this._oAriaDescribedbyText);
    };

    ShellHeadItem.prototype.onBeforeRendering = function () {
        // this method is also called by "sap.ushell.ui.shell.OverflowListItem"
        switch (this.getFloatingNumberType()) {
            case FloatingNumberType.None:
                this._oAriaDescribedbyText.setText("");
                break;
            default:
                var count = this.getFloatingNumber();
                if (!count) {
                    this._oAriaDescribedbyText.setText("");
                } else {
                    var maxValue = this.getFloatingNumberMaxValue();
                    this._oAriaDescribedbyText.setText((count > maxValue)
                        ? resources.i18n.getText("NotificationToggleButton.NewNotifications.MaxExceeded", [maxValue])
                        : resources.i18n.getText("NotificationToggleButton.NewNotifications", [count])
                    );
                }
                break;
        }
    };

    /**
     * Returns the final string to be used as the tooltip.
     *
     * @param {int} [floatingNumber] If provided, this argument value will be used instead of "this.getFloatingNumber()".
     *   Providing this argument might be useful, for example, when calling this method from inside of a formatter,
     *   where the value returned from "this.getFloatingNumber()" might still be outdated at that point.
     * @returns {string} The final string to be used as the tooltip.
     */
    ShellHeadItem.prototype.tooltipFormatter = function (floatingNumber) {
        // this method is also called by "sap.ushell.ui.shell.OverflowListItem"
        var count = ((typeof floatingNumber !== "undefined") ? floatingNumber : this.getFloatingNumber());
        var maxValue = this.getFloatingNumberMaxValue();
        switch (this.getFloatingNumberType()) {
            default:
            case FloatingNumberType.None:
                return "";
            case FloatingNumberType.Notifications:
                if (!count) { return resources.i18n.getText("NotificationToggleButton.NoNewNotifications"); }
                return (count > maxValue
                    ? resources.i18n.getText("NotificationToggleButton.NewNotifications.MaxExceeded", [maxValue])
                    : resources.i18n.getText("NotificationToggleButton.NewNotifications", [count]));
            case FloatingNumberType.OverflowButton:
                var sTooltip = resources.i18n.getText("shellHeaderOverflowBtn_tooltip");
                if (!count) { return sTooltip; }
                sTooltip += " (" + (count > maxValue
                    ? resources.i18n.getText("NotificationToggleButton.NewNotifications.MaxExceeded", [maxValue])
                    : resources.i18n.getText("NotificationToggleButton.NewNotifications", [count])) + ")";
                return sTooltip;
        }
    };

    /**
     * Returns the final string to be used as the floating number badge.
     *
     * @param {int} [floatingNumber] If provided, this argument value will be used instead of "this.getFloatingNumber()".
     *   Providing this argument might be useful, for example, when calling this method from inside of a formatter,
     *   where the value returned from "this.getFloatingNumber()" might still be outdated at that point.
     * @returns {string} The final string to be used as the floating number badge.
     */
    ShellHeadItem.prototype.floatingNumberFormatter = function (floatingNumber) {
        // this method is also called by "sap.ushell.ui.shell.OverflowListItem"
        var count = ((typeof floatingNumber !== "undefined") ? floatingNumber : this.getFloatingNumber());
        var maxValue = this.getFloatingNumberMaxValue();
        return (count > maxValue ? maxValue + "+" : count.toString());
    };

    ShellHeadItem.prototype.onclick = function (oEvent) {
        if (this.getEnabled()) {
            this.firePress();
            // IE always interprets a click on an anker as navigation and thus triggers the
            // beforeunload-event on the window. Since a ShellHeadItem never has a valid href-attribute,
            // the default behavior should never be triggered
            if (!this.getTarget()) {
                oEvent.preventDefault();
            }
        }
    };

    ShellHeadItem.prototype.onkeyup = function (oEvent) {
        var oOriginalEvent = oEvent.originalEvent;
        var sKey = oOriginalEvent.key;
        var bShiftKey = oOriginalEvent.shiftKey;

        if (["Enter", " "].includes(sKey) && !bShiftKey) {
            this.onclick(oEvent);
        }
    };

    /**
     * in case someone already using the API sap.ushell.renderers.fiori2.RendererExtensions.addHeaderItem
     * with sap.ui.unified.ShellHeadItem() instance
     * @deprecated since 1.120
     */
    ObjectPath.set("sap.ui.unified.ShellHeadItem", ShellHeadItem);

    return ShellHeadItem;
}, true /* bExport */);
