// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/model/json/JSONListBinding"
], function (
    JSONListBinding
) {
    "use strict";

    return JSONListBinding.extend("sap.ushell.components.contentFinder.model.GraphQLListBinding", {


        /**
         * Creates a new GraphQLListBinding.
         *
         * Override to provide the totalCount property path via parameter.
         *
         * @param {sap.ui.model.json.JSONModel} oModel Model instance that this binding is created for and that it belongs to
         * @param {string} sPath Binding path to be used for this binding
         * @param {sap.ui.model.Context} oContext Binding context relative to which a relative binding path will be resolved
         * @param {sap.ui.model.Sorter[]|sap.ui.model.Sorter} [aSorters=[]]
         *   The sorters used initially; call {@link #sort} to replace them
         * @param {sap.ui.model.Filter[]|sap.ui.model.Filter} [aFilters=[]]
         *   The filters to be used initially with type {@link sap.ui.model.FilterType.Application}; call {@link #filter} to
         *   replace them
         * @param {object} [mParameters] Map of optional parameters as defined by subclasses; this class does not introduce any own parameters
         *
         * @augments sap.ui.model.json.JSONListBinding
         * @since 1.131.0
         */
        constructor: function (oModel, sPath, oContext, aSorters, aFilters, mParameters) {
            JSONListBinding.apply(this, arguments);

            if (mParameters?.totalCountPropertyPath !== undefined) {
                this.sTotalCountPropertyPath = mParameters.totalCountPropertyPath;
            }
        },

        /**
         * Override to return the totalCount returned by the server.
         * The amount of items in the model will not represent the total count because the data may be paginated.
         *
         * @since 1.115.0
         * @returns {int} The count.
         */
        getLength: function () {
            // Check if filters have been set. this.aFilters might contain an empty aFilters array
            if (this.aFilters && this.aFilters.length > 0 && this.aFilters[0].getFilters().length > 0) {
                return this.iLength;
            }

            if (this.sTotalCountPropertyPath === undefined) {
                return this.iLength;
            } else {
                return this.getModel().getProperty(this.sTotalCountPropertyPath) || 0;
            }
        },

        /**
         * Override to determine the correct return value:
         * The length is final if the amount of items is the same as the totalCount returned by the server.
         *
         * @since 1.115.0
         * @returns {boolean} True if the condition applies.
         */
        isLengthFinal: function () {
            return this.oList.length >= this.getLength();
        }
    });
});
