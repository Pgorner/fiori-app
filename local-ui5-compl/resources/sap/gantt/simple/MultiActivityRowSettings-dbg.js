/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
 sap.ui.define([
    "sap/gantt/simple/GanttRowSettings"
], function (GanttRowSettings) {
    "use strict";

    /**
	 * Creates and initializes a new class for multi-activity row settings.
	 *
	 * @param {string} [sId] ID of the new control. This is generated automatically, if ID is not provided.
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * Enables users to define a shape aggregation name of their own. This extends from GanttRowSettings to support multiple activities.
	 *
	 * @extends sap.gantt.simple.GanttRowSettings
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 * @since 1.85
     *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.MultiActivityRowSettings
	 */

    var MultiActivityRowSettings = GanttRowSettings.extend("sap.gantt.simple.MultiActivityRowSettings", {
        metadata: {
			defaultAggregation : "tasks",
            aggregations: {
                /**
				 * The control which holds the shape groups.
				 */
				tasks : {type : "sap.gantt.simple.BaseShape", multiple : true, singularName : "task"}
            }
        }
    });

	MultiActivityRowSettings.prototype.clone = function() {
		var oClone = GanttRowSettings.prototype.clone.call(this);
		if (this.getParentGantt().getEnablePseudoShapes()){
			oClone.unbindAggregation("tasks");
		}
		return oClone;
	};


    return MultiActivityRowSettings;
});
