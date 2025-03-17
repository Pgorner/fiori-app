/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/ui/core/Element"
], function (Element) {
    'use strict';

    /**
	 * Creates and initializes the new Custom Variant Handler instance.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Custom variant handler of the <code>sap.gantt.simple.GanttChartContainer</code> instance.
	 *
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.CustomVariantHandler
	 */

    var CustomVariantHandler = Element.extend("sap.gantt.simple.CustomVariantHandler", {
        metadata: {
            properties: {
                data: {
                    type: "object", multiple: false
                },
                dependantControlID: {
                    /**
                     * Pass custom IDs to stop applying variant before controller initialization
                     * @since 1.88
                     */
                    type: "string[]", multiple: false, defaultValue: []
                }
            }
        },
        setData: function (oCustomData) {
            this.setProperty("data", oCustomData);
            this.fireEvent("dataSettingComplete");
        },
        apply: function() {
        },
        revert: function() {
        }
    });

    return CustomVariantHandler;
});
