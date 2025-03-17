/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

// Provides control sap.ui.vbm.ContainerLegendItem.
sap.ui.define([
	"sap/m/StandardListItem",
	"./ContainerLegendItemRenderer"
], function(
	StandardListItem,
	ContainerLegendItemRenderer
) {
	"use strict";

	/**
	 * Constructor for a new ContainerLegendItem.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class Legend item control
	 * @extends sap.m.StandardListItem
	 * @constructor
	 * @public
	 * @alias sap.ui.vbm.ContainerLegendItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 * @experimental Since 1.38.0 This class is experimental and might be modified or removed in future versions.
	 */
	var ContainerLegendItem = StandardListItem.extend("sap.ui.vbm.ContainerLegendItem", /** @lends sap.ui.vbm.ContainerLegendItem.prototype */ {
		metadata: {

			library: "sap.ui.vbm",
			properties:
			{
				/**
				 * show color square
				 */
				color: {
					type: "sap.ui.core.CSSColor",
					group: "Appearance",
					defaultValue: null
				},
				/**
				 * The semantic spot type for the legend marker.
				 */
				semanticSpotType: {
					type: "sap.ui.vbm.SemanticType",
					group: "Behavior",
					defaultValue: null
				}
			},
			aggregations: {
			},

			renderer: ContainerLegendItemRenderer
		}
	});

	// /**
	// * This file defines behavior for the control,
	// */
	// ContainerLegendItem.prototype.init = function(){
	// do something for initialization...

	// };

	return ContainerLegendItem;

});
