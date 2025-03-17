// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

// This control replaces the Fiori2 ViewPortContainer for the no-viewports scenario.
sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/core/Element",
    "sap/ui/Device",
    "sap/base/Log",
    "./AppContainerRenderer",
    "sap/ui/core/RenderManager",
    "sap/ushell/Container"
], function (
    Control,
    Element,
    Device,
    Log,
    AppContainerRenderer,
    RenderManager,
    Container
) {
    "use strict";

    /**
     * @alias sap.ushell.ui.launchpad.AppContainer
     * @class
     * @classdesc Application container.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @extends sap.ui.core.Control
     * @private
     */
    var AppContainer = Control.extend("sap.ushell.ui.AppContainer", /** @lends sap.ushell.ui.AppContainer.prototype */ {
        metadata: {
            library: "sap.ushell",
            properties: { visible: { type: "boolean", group: "Appearance", defaultValue: true } },
            aggregations: { pages: { type: "sap.ui.core.Control", multiple: true, singularName: "pages" } },
            events: {
                beforeNavigate: {
                    parameters: {
                        fromId: { type: "string" },
                        from: { type: "sap.ui.core.Control" },
                        toId: { type: "string" },
                        to: { type: "sap.ui.core.Control" }
                    }
                },
                afterNavigate: {
                    parameters: {
                        fromId: { type: "string" },
                        from: { type: "sap.ui.core.Control" },
                        toId: { type: "string" },
                        to: { type: "sap.ui.core.Control" }
                    }
                }
            }
        },

        renderer: AppContainerRenderer
    });

    // Override addAggregation("pages", _): a newly added page must be hidden; suppress re-rendering
    AppContainer.prototype.addPages = function (oControl) {
        if (this.getPages().indexOf(oControl) > -1) {
            return; // the control is already added
        }

        if (oControl.hasStyleClass("sapUShellApplicationContainerShiftedIframe")) {
            oControl.toggleStyleClass("sapUShellApplicationContainerIframeHidden", true);
        } else {
            oControl.toggleStyleClass("hidden", true);
        }
        this.addAggregation("pages", oControl, true);

        var oDomRef = this.getDomRef();
        if (oDomRef) {
            var oRendererManager = new RenderManager().getInterface();
            oRendererManager.render(oControl, oDomRef);
            oRendererManager.destroy();
        }
    };

    /* Fiori2 API */
    AppContainer.prototype.addCenterViewPort = AppContainer.prototype.addPages;
    AppContainer.prototype.removeCenterViewPort = function (sId) {
        this.removeAggregation("pages", sId, true); // never re-render the AppContainer
    };

    AppContainer.prototype.getCurrentCenterPage = function () {
        return this.getPages().reduce(function (sCurrentPageId, oPage) {
            if (oPage && oPage.hasStyleClass("sapUShellApplicationContainerShiftedIframe")) {
                return (!oPage.hasStyleClass("sapUShellApplicationContainerIframeHidden")) ? oPage.getId() : sCurrentPageId;
            }

            return (oPage && !oPage.hasStyleClass("hidden")) ? oPage.getId() : sCurrentPageId;
        }, null);
    };

    /* Navigate to a given page. The viewPortId is a Fiori2 parameter and should be always "centerViewPort" */
    AppContainer.prototype.navTo = function (viewPortId, pageId) {
        var oTargetPage = Element.getElementById(pageId),
            sCurrentPageId = this.getCurrentCenterPage(),
            oCurrentPage = Element.getElementById(sCurrentPageId) || null,
            oHomeContainer = Container.getRendererInternal("fiori2").byId("Shell-home-component-container"),
            sHomeContainerId = oHomeContainer && oHomeContainer.getId(),
            bNavFromHome = sCurrentPageId && (sHomeContainerId === sCurrentPageId),
            bNavToHome = sHomeContainerId === pageId;

        if (viewPortId !== "centerViewPort") {
            Log.error("Navigation to " + viewPortId + " is not allowed in Fiori3");
            return;
        }
        if (this.getPages().indexOf(oTargetPage) === -1) {
            Log.error("AppContainer: invalid navigation target");
            return;
        }

        // TBD: _saveFocus and _restoreFocus should be moved to the dashboard container
        if (Device.system.desktop && bNavFromHome) {
            this._saveFocus();
        }

        if (sCurrentPageId !== pageId) {
            this.fireBeforeNavigate({
                toId: pageId,
                to: oTargetPage,
                fromId: sCurrentPageId,
                from: oCurrentPage
            });
        }

        // The navigation is simple: hide the current page and show the target
        // Note that the .hidden CSS class rules are defined in Search.less !!
        this.getPages().forEach(function (oPage) {
            if (oPage) {
                if (oPage.hasStyleClass("sapUShellApplicationContainerShiftedIframe")) {
                    oPage.toggleStyleClass("sapUShellApplicationContainerIframeHidden", oPage.getId() !== pageId);
                } else {
                    oPage.toggleStyleClass("hidden", oPage.getId() !== pageId);
                }
            }
        });

        if (Device.system.desktop && bNavToHome) {
            this._restoreFocus();
        }

        if (sCurrentPageId !== pageId) {
            this.fireAfterNavigate({
                toId: pageId,
                to: oTargetPage,
                fromId: sCurrentPageId,
                from: oCurrentPage
            });
        }
    };

    AppContainer.prototype._restoreFocus = function () {
        sap.ui.require(["sap/ushell/renderer/AccessKeysHandler"], function (AccessKeysHandler) {
            var oControl;
            // Note: as in Fiori2, register key handler only if the last focused element exists. See ViewPortContainer
            if (this.sLastFocusId) {
                AccessKeysHandler.registerAppKeysHandler(this.fnLastAppKeyHandler);
                oControl = Element.getElementById(this.sLastFocusId);
                if (oControl) {
                    oControl.focus();
                }
            }
        }.bind(this));
    };

    AppContainer.prototype._saveFocus = function () {
        sap.ui.require(["sap/ushell/renderer/AccessKeysHandler"], function (AccessKeysHandler) {
            var oActiveControl = Element.closestTo(document.activeElement);
            this.sLastFocusId = oActiveControl ? oActiveControl.getId() : null;
            this.fnLastAppKeyHandler = AccessKeysHandler.getAppKeysHandler();
        }.bind(this));
    };

    /**
     * If there is a page with a given ID, return the page, else null
     * sViewPortId is a Fiori2 parameter and should be always "centerViewPort"
     */
    AppContainer.prototype.getViewPortControl = function (sViewPortId, sControlId) {
        return this.getPages().reduce(function (oControl, oPage) {
            return (sViewPortId === "centerViewPort" && oPage && oPage.getId() === sControlId) ? oPage : oControl;
        }, null);
    };

    // Stubs for Fiori2 API - these methods are noop in Fiori3
    var noop = function () { };
    /**
     * @deprecated since 1.120 The ViewPortState is related to Fiori2 and not used anymore.
     */
    AppContainer.prototype.switchState = noop;

    /**
     * @deprecated since 1.120 The ViewPortState is related to Fiori2 and not used anymore.
     */
    AppContainer.prototype._handleSizeChange = noop;

    /**
     * @deprecated since 1.120 The ViewPortState is related to Fiori2 and not used anymore.
     */
    AppContainer.prototype.shiftCenterTransitionEnabled = noop;

    /**
     * @deprecated since 1.120 The ViewPortState is related to Fiori2 and not used anymore.
     */
    AppContainer.prototype.shiftCenterTransition = noop;

    /**
     * @deprecated since 1.120 The ViewPortState is related to Fiori2 and not used anymore.
     */
    AppContainer.prototype.addLeftViewPort = noop;

    /**
     * @deprecated since 1.120 The ViewPortState is related to Fiori2 and not used anymore.
     */
    AppContainer.prototype.addRightViewPort = noop;

    /**
     * @deprecated since 1.120 The ViewPortState is related to Fiori2 and not used anymore.
     */
    AppContainer.prototype.attachAfterSwitchState = noop;

    /**
     * @deprecated since 1.120 The ViewPortState is related to Fiori2 and not used anymore.
     */
    AppContainer.prototype.detachAfterSwitchState = noop;

    /**
     * @deprecated since 1.120 The ViewPortState is related to Fiori2 and not used anymore.
     */
    AppContainer.prototype.attachAfterSwitchStateAnimationFinished = noop;

    /**
     * @deprecated since 1.120 The ViewPortState is related to Fiori2 and not used anymore.
     */
    AppContainer.prototype.detachAfterSwitchStateAnimationFinished = noop;

    /**
     * @returns {string} The current ViewPort State
     * @deprecated since 1.120 The ViewPortState is related to Fiori2 and not used anymore.
     */
    AppContainer.prototype.getCurrentState = function () {
        return "Center";
    };

    return AppContainer;
});
