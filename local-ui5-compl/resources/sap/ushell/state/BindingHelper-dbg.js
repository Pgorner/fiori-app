// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Element"
], function (
    Element
) {
    "use strict";

    /**
     * @alias sap.ushell.state.BindingHelper
     * @namespace
     * @description Helper class for bindings on control references
     *
     * @since 1.129.0
     * @private
     */
    class BindingHelper {

        /**
         * Overrides the original updateAggregation method of the control
         * For updates on any aggregation, the aggregation items are removed instead of being destroyed.
         * This allows to bind references to controls which cannot be recreated in a factory.
         * @param {sap.ui.core.Control} oControl The control to override the updateAggregation method
         *
         * @since 1.129.0
         * @private
         */
        overrideUpdateAggregation (oControl) {
            oControl.updateAggregation = this.#updateAggregation;
        }

        /**
         * Custom aggregation update handler.
         * Removes aggregation items instead of destroying them.
         * @param {string} sName Aggregation name.
         *
         * @since 1.129.0
         * @private
         */
        #updateAggregation (sName) {
            const oBindingInfo = this.mBindingInfos[sName];
            const oAggregationInfo = this.getMetadata().getJSONKeys()[sName];
            const fnGet = this[oAggregationInfo._sGetter].bind(this);
            const fnRemove = this[oAggregationInfo._sRemoveMutator].bind(this);
            const fnUpdate = this[oAggregationInfo._sMutator].bind(this);

            const aControls = fnGet() || [];
            // make a shallow copy to avoid issues with iteration on the original array
            [...aControls].forEach((oControlToRemove) => {
                fnRemove(oControlToRemove);
            });

            oBindingInfo.binding.getContexts().forEach((v, i) => {
                const oClone = oBindingInfo.factory(this.getId() + "-" + i, v)
                    ? oBindingInfo.factory(this.getId() + "-" + i, v).setBindingContext(v, oBindingInfo.model)
                    : "";
                fnUpdate(oClone);
            });
        }

        /**
         * Item factory for {@link sap.ushell.state.BindingHelper#overrideUpdateAggregation}.
         * Returns the referenced control.
         * @param {sap.ui.core.ID} sId The Control ID.
         * @param {sap.ui.model.Context} oContext UI5 context.
         * @returns {sap.ui.core.Control} The control.
         *
         * @since 1.129.0
         * @private
         */
        factory (sId, oContext) {
            return Element.getElementById(oContext.getObject());
        }
    }

    return new BindingHelper();

});
