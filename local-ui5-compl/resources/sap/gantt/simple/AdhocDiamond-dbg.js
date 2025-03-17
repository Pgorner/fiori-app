/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BaseDiamond"],
function (BaseDiamond) {
    "use strict";

    var AdhocDiamond = BaseDiamond.extend("sap.gantt.simple.AdhocDiamond", /** @lends sap.gantt.AdhocDiaomnd.prototype */ {
        /**
		 * Creates and initializes a new Adhoc Diamond class.
		 *
		 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
		 * @param {object} [mSettings] Initial settings for the new control
		 *
		 * @class
		 * The AdhocDiamond class contains properties to draw an AdhocDimond on the
         * Gantt header for every AdhocLine present in the Gantt chart
		 *
		 * @extends sap.gantt.simple.BaseDiamond
		 *
		 * @author SAP SE
		 * @version 1.132.0
         * @since 1.84
		 *
		 * @constructor
		 * @public
		 * @alias sap.gantt.simple.AdhocDiamond
		 */
        metadata : {
            events :{
                /**
                 * Fires when the adhocdiamond is pressed.
                 */
                press : {},

                /**
                 * Fires when the adhocdiamond is hovered.
                 */
                mouseEnter: {},

                /**
				 * Fires when the mouse leaves adhocdiamond.
                 */
                mouseLeave: {}
            }
        },
        renderer: {
            apiVersion: 2    // enable in-place DOM patching
        }
    });

    /**
	 * Function is called when the AdhocDiamond is clicked
	 * @param {jQuery.Event} oEvent Browser event
	 * @private
	 */
    AdhocDiamond.prototype.onclick = function(oEvent){
       this.firePress(oEvent);
    };

    /**
	 * Function is called when the AdhocDiamond is hovered
	 * @param {jQuery.Event} oEvent Browser event
	 * @private
	 */
     AdhocDiamond.prototype.onmouseover = function(oEvent){
        this.fireMouseEnter(oEvent);
    };

    /**
	 * Function is called when the mouse leaves the AdhocDiamond
	 * @param {jQuery.Event} oEvent Browser event
	 * @private
	 */
    AdhocDiamond.prototype.onmouseout = function(oEvent) {
        this.fireMouseLeave(oEvent);
    };

    /**
	 * Render the AdhocDiamond.
	 *
	 * @protected
	 *
	 * @param {sap.ui.core.RenderManager} oRm Render Manager
	 * @param {sap.gantt.simple.BaseShape} oElement Shape instance
	 */
    AdhocDiamond.prototype.renderElement = function (oRm, oElement){
        BaseDiamond.prototype.renderElement.apply(this, arguments);
    };

    return AdhocDiamond;
}, true);