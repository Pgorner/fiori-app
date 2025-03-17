/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	[
		"./BaseAPI",
		"sap/fe/test/Utils",
		"sap/ui/test/OpaBuilder",
		"sap/fe/test/builder/FEBuilder",
		"sap/fe/test/builder/OverflowToolbarBuilder",
		"sap/fe/core/helpers/StableIdHelper"
	],
	function (BaseAPI, Utils, OpaBuilder, FEBuilder, OverflowToolbarBuilder, StableIdHelper) {
		"use strict";

		/**
		 * An identifier for the header facet
		 * @typedef {object} HeaderFacetIdentifier
		 * @property {string} facetId The identifier of the facet
		 * @property {boolean} [collection] Defines whether the facet is a collection facet (default: <code>false</code>)
		 * @property {boolean} [custom] Defines whether the facet is a custom header facet (default: <code>false</code>)
		 * @name sap.fe.test.api.HeaderFacetIdentifier
		 * @public
		 */

		/**
		 * Constructs a new HeaderAPI instance.
		 * @param {sap.fe.test.builder.FEBuilder} oHeaderBuilder The {@link sap.fe.test.builder.FEBuilder} instance used to interact with the UI
		 * @param {string} [vHeaderDescription] Description (optional) of the header to be used for logging messages
		 * @returns {sap.fe.test.api.HeaderAPI} The new instance
		 * @hideconstructor
		 * @class
		 * @private
		 */
		var HeaderAPI = function (oHeaderBuilder, vHeaderDescription) {
			if (!Utils.isOfType(oHeaderBuilder, FEBuilder)) {
				throw new Error("oHeaderBuilder parameter must be a FEBuilder instance");
			}
			return BaseAPI.call(this, oHeaderBuilder, vHeaderDescription);
		};
		HeaderAPI.prototype = Object.create(BaseAPI.prototype);
		HeaderAPI.prototype.constructor = HeaderAPI;

		/**
		 * Helper method for creating an OverflowToolbarBuilder for the actions of the title used in the object page header.
		 * @param {string} sObjectPageLayoutId The identifier of <code>sap.uxap.ObjectPageLayout</code> control
		 * @returns {object} OverflowToolbarBuilder object
		 * @ui5-restricted
		 */
		HeaderAPI.prototype.createOverflowToolbarBuilder = function (sObjectPageLayoutId) {
			return OverflowToolbarBuilder.create(this.getOpaInstance())
				.hasType("sap.m.OverflowToolbar")
				.has(function (oOverflowToolbar) {
					return (
						oOverflowToolbar.getParent().getMetadata().getName() === "sap.uxap.ObjectPageDynamicHeaderTitle" &&
						oOverflowToolbar.getParent().getParent().getMetadata().getName() === "sap.uxap.ObjectPageLayout" &&
						oOverflowToolbar.getParent().getParent().getId() === sObjectPageLayoutId
					);
				});
		};

		/**
		 * Helper method for creating an OpaBuilder of the title used in the object page header.
		 * @param {string} sObjectPageLayoutId The identifier of <code>sap.uxap.ObjectPageLayout</code> control
		 * @returns {object} OpaBuilder object
		 * @ui5-restricted
		 */
		HeaderAPI.prototype.getObjectPageDynamicHeaderTitleBuilder = function (sObjectPageLayoutId) {
			return OpaBuilder.create(this.getOpaInstance())
				.hasType("sap.uxap.ObjectPageDynamicHeaderTitle")
				.has(OpaBuilder.Matchers.ancestor(sObjectPageLayoutId, true));
		};

		/**
		 * Helper method to for creating an OpaBuilder for object page header content.
		 * @param {string} sHeaderContentId The id of sap.uxap.ObjectPageDynamicHeaderContent control
		 * @returns {object} OpaBuilder object
		 * @ui5-restricted
		 */
		HeaderAPI.prototype.getObjectPageDynamicHeaderContentBuilder = function (sHeaderContentId) {
			return OpaBuilder.create(this.getOpaInstance()).hasId(sHeaderContentId);
		};

		/**
		 * Helper method for creating an OpaBuilder of the Object Page Layout.
		 * @param {string} sObjectPageLayoutId The identifier of <code>sap.uxap.ObjectPageLayout</code> control
		 * @returns {object} OpaBuilder object
		 * @ui5-restricted
		 */
		HeaderAPI.prototype.getObjectPageLayoutBuilder = function (sObjectPageLayoutId) {
			return FEBuilder.create(this.getOpaInstance()).hasType("sap.uxap.ObjectPageLayout").hasId(sObjectPageLayoutId);
		};

		/**
		 * Helper method for creating an OpaBuilder of the Object Page Header Content Container.
		 * @param {string} sObjectPageHeaderContentContainerId The identifier of <code>sap.m.FlexBox</code> control
		 * @returns {object} OpaBuilder object
		 * @ui5-restricted
		 */
		HeaderAPI.prototype.getObjectPageHeaderContentContainerBuilder = function (sObjectPageHeaderContentContainerId) {
			return FEBuilder.create(this.getOpaInstance()).hasType("sap.m.FlexBox").hasId(sObjectPageHeaderContentContainerId);
		};

		HeaderAPI.prototype.getFieldGroupFieldId = function (vFieldIdentifier, sViewId) {
			var sId = "fe::HeaderFacet";

			sId += "::Form";
			sId += "::" + StableIdHelper.prepareId(vFieldIdentifier.fieldGroup);
			sId += "::DataField";
			sId += "::" + vFieldIdentifier.field;
			sId += "::Field";

			sId = StableIdHelper.prepareId(sId);
			return sViewId ? sViewId + "--" + sId : sId;
		};

		HeaderAPI.prototype.getDataFieldForAnnotationId = function (vFieldIdentifier, sViewId) {
			var sId = "fe::HeaderFacet";

			sId += "::Form";
			sId += "::" + StableIdHelper.prepareId(vFieldIdentifier.fieldGroup);
			sId += "::DataFieldForAnnotation";
			sId += "::" + vFieldIdentifier.field;
			sId += "::" + vFieldIdentifier.targetAnnotation;
			sId += "::Field";

			sId = StableIdHelper.prepareId(sId);
			return sViewId ? sViewId + "--" + sId : sId;
		};

		/**
		 * Helper method to for creating an FEBuilder depending on given matchers and ancestor.
		 * @param {object} oMatcher The matcher-object like paginator icon
		 * @param {string} sAncestor The id of ancestor control
		 * @param {object} [mState] The matcher-object like visibility and enablement
		 * @returns {object} FEBuilder object
		 * @ui5-restricted
		 */
		HeaderAPI.prototype.createPaginatorBuilder = function (oMatcher, sAncestor, mState) {
			return FEBuilder.create(this.getOpaInstance())
				.hasType("sap.uxap.ObjectPageHeaderActionButton")
				.has(oMatcher)
				.hasState(mState)
				.has(OpaBuilder.Matchers.ancestor(sAncestor, false));
		};

		return HeaderAPI;
	}
);
