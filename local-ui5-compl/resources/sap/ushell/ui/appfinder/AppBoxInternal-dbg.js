// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

// Provides control sap.ushell.ui.appfinder.AppBoxInternal.
sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/core/Icon",
    "sap/ui/core/IconPool",
    "sap/ushell/library", // css style dependency
    "sap/ushell/resources",
    "sap/ushell/ui/appfinder/AppBoxInternalRenderer",
    "sap/ushell/Config"
], function (Control, Icon, IconPool, ushellLibrary, resources, AppBoxInternalRenderer, Config) {
    "use strict";

    /**
     * @alias sap.ushell.ui.appfinder.AppBoxInternal
     * @class
     * @classdesc Constructor for a new ui/appfinder/AppBoxInternal.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * Add your documentation for the new ui/appfinder/AppBoxInternal
     * @extends sap.ui.core.Control
     *
     * @private
     */
    const AppBoxInternal = Control.extend("sap.ushell.ui.appfinder.AppBoxInternal", /** @lends sap.ushell.ui.appfinder.AppBoxInternal.prototype */ {
        metadata: {
            library: "sap.ushell",
            properties: {

                /**
                 * Specifies the title of the appBox.
                 */
                title: { type: "string", group: "Misc", defaultValue: null },

                /**
                 * Specifies the subTitle of the appBox.
                 */
                subtitle: { type: "string", group: "Misc", defaultValue: null },

                /**
                 * Specifies the icon url of the appBox.
                 */
                icon: { type: "string", group: "Misc", defaultValue: null },

                /**
                 * Specifies the url of the appBox.
                 */
                url: { type: "string", group: "Misc", defaultValue: null },

                /**
                 * Specifies the navigationMode of the appBox.
                 */
                navigationMode: { type: "string", group: "Misc", defaultValue: null },

                /**
                 * Specifies the contentProviderLabel of the appBox.
                 */
                contentProviderLabel: { type: "string", group: "Misc", defaultValue: "" },
                /**
                 * Specifies the if the contentProviderLabel of the appBox is shown.
                 */
                showContentProviderLabel: { type: "boolean", group: "Misc", defaultValue: false }
            },
            aggregations: {

                /**
                 * The pinButton aggregation that can contain the pin button.
                 */
                pinButton: { type: "sap.m.Button", multiple: false }
            },
            events: {

                /**
                 * Fires when the appBox is pressed.
                 */
                press: {},

                /**
                 * Fires after the appBox is rendered.
                 */
                afterRendering: {}
            }
        },
        renderer: AppBoxInternalRenderer
    });

    /**
     * Provides control sap.ushell.ui.appfinder.AppBoxInternal
     * @private
     */
    AppBoxInternal.prototype.init = function () {
        this._oIcon = new Icon().addStyleClass("sapUshellAppBoxIcon");
        this._oDoable = Config.on("/core/contentProviders/providerInfo/showContentProviderInfoOnVisualizations").do((bShowContentProviderLabel) => {
            this.setProperty("showContentProviderLabel", bShowContentProviderLabel);
        });
    };

    AppBoxInternal.prototype.destroy = function () {
        Control.prototype.destroy.apply(this, arguments);
        this._oIcon.destroy();
        this._oDoable.off();
    };

    AppBoxInternal.prototype.onAfterRendering = function () {
        const jqAppBoxTitle = this.$("title");
        const jqAppBoxSubTitle = this.$("subTitle");
        const iTitleLineHeight = parseInt(jqAppBoxTitle.css("lineHeight"), 10);
        const iTitleHeight = jqAppBoxTitle.height();

        if ((iTitleHeight / iTitleLineHeight) > 1) {
            jqAppBoxTitle.addClass("sapUshellAppBoxHeaderElementTwoLines");
            jqAppBoxSubTitle.addClass("sapUshellAppBoxHeaderElementOneLine");
        } else {
            jqAppBoxTitle.addClass("sapUshellAppBoxHeaderElementOneLine");
            jqAppBoxSubTitle.addClass("sapUshellAppBoxHeaderElementTwoLines");
        }

        this.fireAfterRendering();
    };

    AppBoxInternal.prototype.setIcon = function (sIconUrl) {
        this.setProperty("icon", sIconUrl);
        this._oIcon.setSrc(IconPool.isIconURI(sIconUrl) ? sIconUrl : null);
    };

    AppBoxInternal.prototype._getAriaLabel = function () {
        let sAriaLabel = this.getTitle();
        const sSubTitle = this.getSubtitle();
        const sNavigationMode = this.getNavigationMode();
        const sContentProviderLabel = this.getShowContentProviderLabel() && this.getContentProviderLabel();

        if (sSubTitle) {
            sAriaLabel += " " + sSubTitle;
        }

        if (sNavigationMode) {
            sAriaLabel += " " + resources.i18n.getText(sNavigationMode + "NavigationMode");
        }

        if (sContentProviderLabel) {
            sAriaLabel += " " + sContentProviderLabel;
        }

        return sAriaLabel;
    };

    // browser events
    AppBoxInternal.prototype.onclick = AppBoxInternal.prototype.firePress;

    AppBoxInternal.prototype.onsapspace = function (e) {
        e.preventDefault();
        this.firePress(e);
    };

    AppBoxInternal.prototype.onsapenter = AppBoxInternal.prototype.onsapspace;

    return AppBoxInternal;
});
