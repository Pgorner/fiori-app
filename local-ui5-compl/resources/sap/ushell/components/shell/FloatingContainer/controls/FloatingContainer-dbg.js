// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview An invisible container,
 * located (i.e. floats) at the top right side of the shell and can host any <code>sap.ui.core.Control</code> object.<br>
 * Extends <code>sap.ui.core.Control</code>
 */
sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/Device",
    "sap/ushell/library" // css style dependency
], function (
    Control,
    Device,
    ushellLibrary
) {
    "use strict";

    /**
     * @alias sap.ushell.components.shell.FloatingContainer.controls.FloatingContainer
     * @class
     * @classdesc Wrapper control for the FloatingContainer content. Rerendering is prevented for all properties.
     * Instead a rerenderingPrevented event is fired. This allows the plugins to use an iframe within the
     * FloatingContainer without causing the iframe to reload.
     *
     * @extends sap.ui.core.Control
     *
     * @since 1.129.0
     * @private
     */
    var FloatingContainer = Control.extend("sap.ushell.components.shell.FloatingContainer.controls.FloatingContainer", {
        metadata: {
            library: "sap.ushell",
            properties: {
                visible: { type: "boolean", defaultValue: true },
                fullHeight: { type: "boolean", defaultValue: false }
            },
            aggregations: {
                content: { type: "sap.ui.core.Control", multiple: true }
            },
            events: {
                /**
                 * Event is fired when a rendering was prevented.
                 */
                rerenderingPrevented: {}
            }
        },
        renderer: {
            apiVersion: 2,
            render: function (rm, oContainer) {
                rm.openStart("div", oContainer);
                rm.class("sapUshellFloatingContainer");

                if (Device.system.desktop) {
                    // add tabindex for the floating container so it can be tab/f6
                    rm.attr("tabindex", "-1");
                }

                rm.openEnd();

                if (oContainer.getContent() && oContainer.getContent().length) {
                    rm.renderControl(oContainer.getContent()[0]);
                }
                rm.close("div");
            }
        }
    });

    /**
     * Overrides the default setter and prevents rerendering for property changes.
     * Instead it toggles the fullHeight class on the DOM element.
     * @param {boolean} bFullHeight whether the container should be visible
     * @returns {this} <code>this</code> to allow method chaining
     *
     * @since 1.130.0
     * @private
     */
    FloatingContainer.prototype.setFullHeight = function (bFullHeight) {
        const bShouldRerender = this.getProperty("fullHeight") !== bFullHeight && this.getDomRef();

        if (bFullHeight) {
            this.addStyleClass("sapUshellShellFloatingContainerFullHeight");
        } else {
            this.removeStyleClass("sapUshellShellFloatingContainerFullHeight");
        }

        this.setProperty("fullHeight", bFullHeight, true);

        if (bShouldRerender) {
            this.fireRerenderingPrevented();
        }

        return this;
    };

    /**
     * Overrides the default setter and prevents rerendering for visibility changes.
     * Instead it toggles the visibility class on the DOM element.
     * @param {boolean} bVisible whether the container should be visible
     * @returns {this} <code>this</code> to allow method chaining
     *
     * @since 1.130.0
     * @private
     */
    FloatingContainer.prototype.setVisible = function (bVisible) {
        const bShouldRerender = this.getProperty("visible") !== bVisible && this.getDomRef();

        if (bVisible) {
            this.removeStyleClass("sapUshellShellHidden");
        } else {
            this.addStyleClass("sapUshellShellHidden");
        }

        this.setProperty("visible", bVisible, true);

        if (bShouldRerender) {
            this.fireRerenderingPrevented();
        }

        return this;
    };

    return FloatingContainer;
});
