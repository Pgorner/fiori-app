/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/ui/core/CustomData"
], function (CustomData) {
    'use strict';

    /**
     * Constructor for a new <code>CustomData</code> element of Gantt Chart with Table
	 *
	 * @param {string} [sId] ID for the new control, unique ID should be provided by the application
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * Contains a single key/value pair of custom data attached to Gantt Chart with Table.
	 *
	 * @extend sap.ui.core.CustomData
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 * @since 1.90
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.GanttAdaptationData
	 */

    var GanttAdaptationData = CustomData.extend("sap.gantt.simple.GanttAdaptationData");

    return GanttAdaptationData;
});
