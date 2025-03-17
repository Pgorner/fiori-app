// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/util/deepClone",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/ushell/utils/RestrictedJSONModel"
], function (
    deepClone,
    JSONModel,
    Config,
    RestrictedJSONModel
) {
    "use strict";

    /**
     * @alias sap.ushell.state.ShellModel
     * @namespace
     * @description The model representing the current state of the shell.
     * The model is a read-only model. It is updated by the state manager.
     * The controller can access to bind to this model.
     *
     * @since 1.127.0
     * @private
     */
    class ShellModel {
        /**
         * The model representing the current state of the shell.
         * @type {sap.ushell.utils.RestrictedJSONModel}
         */
        #model = new RestrictedJSONModel();
        /**
         * The model representing the configuration of the shell.
         * References <code>/core/shell/model</code> of the {@link sap.ushell.Config}.
         * @type {sap.ui.model.json.JSONModel}
         */
        #configModel = Config.createModel("/core/shell/model", JSONModel);

        constructor () {
            this.#overwriteModelRefresh(this.#model);
        }

        /**
         * Overwrites the <code>refresh</code> method of the given model
         * to throw an error when <code>bForceUpdate</code> is set.
         * @param {sap.ui.model.Model} oModel The model to overwrite the <code>refresh</code> method of.
         *
         * @since 1.130.0
         * @private
         */
        #overwriteModelRefresh (oModel) {
            const fnOriginalRefresh = oModel.refresh.bind(oModel);

            oModel.refresh = function refresh (bForceUpdate) {
                if (bForceUpdate) {
                    /*
                     * The force update invalidates the shell model and triggers a rerendering of the entire shell.
                     * This leads to issues in stateful extensions like the floating container. This might contain an iframe
                     * which would be reloaded leading to performance regressions.
                     * Instead the refresh should be done based on binding paths via {@link sap.ushell.state.StateManager#refreshState}.
                     */
                    throw new Error("The shell model does not support force update.");
                }
                fnOriginalRefresh();
            };
        }

        /**
         * Updates the model with the given state data.
         * Should only be called by the state manager.
         * @param {object} oStateData The calculated state data.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.ShellModel#updateModel
         */
        updateModel (oStateData) {
            const oClonedState = deepClone(oStateData);
            this.#model._setData(oClonedState);
        }

        /**
         * Returns the model representing the current state of the shell.
         * This model is a read-only model.
         * @returns {sap.ui.model.Model} The model.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.ShellModel#getModel
         */
        getModel () {
            return this.#model;
        }

        /**
         * Returns the model representing the configuration of the shell.
         * The config model is based on {@link sap.ushell.Config}.
         * With this any updates are delayed by a tick.
         * However, the <code>getProperty</code> result is updated immediately.
         * @returns {sap.ui.model.Model} The model.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.ShellModel#getConfigModel
         */
        getConfigModel () {
            return this.#configModel;
        }

        /**
         * ONLY FOR TESTING!
         * Resets the model.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.ShellModel#reset
         */
        reset () {
            this.destroy();

            this.#model = new RestrictedJSONModel();
            this.#configModel = Config.createModel("/core/shell/model", JSONModel);

            this.#overwriteModelRefresh(this.#model);
        }

        /**
         * Destroys the model.
         * Should only be called by the state manager.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.ShellModel#destroy
         */
        destroy () {
            this.#model.destroy();
            this.#configModel.destroy();
        }
    }

    return new ShellModel();

});
