/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/simple/BaseGroup"], function (BaseGroup) {
    "use strict";

    /**
     * Creates and initializes a new MultiActivityGroup class.
     *
     * @param {string} [sId] ID of the new control. This is generated automatically, if ID is not provided.
     * @param {object} [mSettings] Initial settings for the new control
     *
     * @class
     * Multi Activity Group class uses SVG tag 'g'. It is a shape container. Any other shapes can be aggregated under this group. This extends from the BaseGroup.
     *
     * @extends sap.gantt.simple.BaseGroup
     *
     * @author SAP SE
     * @version 1.132.0
     * @since 1.85
     *
     * @constructor
     * @public
     * @alias sap.gantt.simple.MultiActivityGroup
     */

    var MultiActivityGroup = BaseGroup.extend("sap.gantt.simple.MultiActivityGroup", {
        metadata: {
            defaultAggregation : "task",
            aggregations: {
                /**
                 * The primary shape of the task
                 */
                task: {
                    type: "sap.gantt.simple.BaseShape",
                    multiple: false,
                    sapGanttOrder: 1
                },

                /**
                 *  Depicts the overlap of subtasks in a task
                 */
                indicators: {
                    type: "sap.gantt.simple.BaseShape",
                    multiple: true,
                    singularName: "indicator",
                    sapGanttOrder: 0
                },

                /**
                 *  The break-up shapes of the task
                 */
                subTasks: {
                    type: "sap.gantt.simple.BaseShape",
                    multiple: true,
                    singularName: "subTask",
                    sapGanttLazy: true
                }
            }
        }
    });

    return MultiActivityGroup;
}, true);