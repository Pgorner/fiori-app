// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview Defines the interface for extensions in the Footer ShellArea.
 *
 * This interface does NOT work when called from within a iframe.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ushell/Container"
], function (
    Container
) {
    "use strict";

    /**
     * @alias sap.ushell.services.FrameBoundExtension.Footer
     * @class
     * @classdesc The footer extension point is positioned below the launchpad content.
     * To be instantiated by {@link sap.ushell.services.FrameBoundExtension}.
     *
     * <p><b>Restriction:</b> Does not work when called from within a iframe.
     * The calling function has to be in the 'same frame' as the launchpad itself.</p>
     *
     * @hideconstructor
     *
     * @since 1.124.0
     * @public
     */
    class Footer {
        #renderer = Container.getRendererInternal();
        #control = null;

        constructor (control) {
            this.#control = control;
        }

        /**
         * Returns the related control instance.
         * @returns {Promise<sap.ui.core.Control>} The control.
         *
         * @since 1.124.0
         * @public
         */
        async getControl () {
            return this.#control;
        }

        /**
         * Destroys the footer.
         * @returns {Promise} Resolves once the footer was destroyed.
         *
         * @since 1.124.0
         * @public
         */
        async destroy () {
            this.#renderer.removeFooterById(this.#control.getId());
            this.#control.destroy();
        }
    }

    return Footer;
});
