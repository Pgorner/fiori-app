/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/ui/core/Element",
    "./GanttUtils",
    "sap/gantt/simple/MarkerType"
], function (Element, GanttUtils, MarkerType) {
    "use strict";

    /**
     * Creates and initializes a new AdhocLine class.
     *
     * @param {string} [sId] ID of the new control, generated automatically if no ID is given
     * @param {object} [mSettings] Initial settings for the new control
     *
     * @class
     * The AdhocLine class contains properties to draw an additional vertical line at specific
     * time points in the chart area. You can use this line to mark milestones, such as the
     * start of a project start, and special events, such as holidays.
     *
     * @extends sap.ui.core.Element
     *
     * @author SAP SE
     * @version 1.132.0
     * @since 1.84
     *
     * @constructor
     * @public
     * @alias sap.gantt.simple.AdhocLine
     */
    var AdhocLine = Element.extend("sap.gantt.simple.AdhocLine", /** @lends sap.gantt.simple.AdhocLine.prototype */{
        metadata: {
            library: "sap.gantt",
            properties: {
                /**
                 * Standard SVG 'stroke' attribute.
                 * You can provide the stroke attribute with HTML colors and the URL reference to the paint server.
                 * Paint server definitions usually come from paint servers rendered by {@link sap.gantt.simple.GanttChartContainer},
                 * {@link sap.gantt.simple.GanttChartWithTable}.
                 */
                stroke: {type : "sap.gantt.ValueSVGPaintServer"},

                /**
                 * Standard SVG 'stroke-width' attribute.
                 * @private
                 */
                _strokeWidth: {type: "float", defaultValue: 1, visibility: "hidden"},

                /**
                 * Standard SVG 'stroke-dasharray' attribute.
                 */
                strokeDasharray: {type: "string"},

                /**
                 * Standard SVG 'stroke-opacity' attribute.
                 */
                strokeOpacity: {type: "float", defaultValue: 1},
                //enableDnD: {type: "boolean", defaultValue: false},

                /**
                 * Time stamp of the adhoc line
                 */
                timeStamp: {type: "string"},

                /**
                 * Description of the time stamp
                 */
                description: {type: "string"},

                /**
                 * Visibility of Adhoc Line
                 */
                visible: {type: "boolean", defaultValue: true},

                /**
                 * Marker Type for Adhoc Line
                 */
                markerType: {type: "sap.gantt.simple.MarkerType", defaultValue: MarkerType.None},

                /**
                 * Delay in milliseconds for the marker popover to show up
                 * @deprecated Since version 1.97.
                 * <b>Note:</b>With the new implementation, this property won't have any effect.
                */
                markerPopoverDelay: {type: "int", defaultValue: 300},

                /**
                 * Line Selected
                 * @private
                 */
                _selected: {type: "boolean", defaultValue: false, visibility: "hidden"},

                /**
                 * Level of markers in the header.
                 * @private
                 */
                _level: { type: "int", defaultValue: 1, visibility: "hidden"},

                /**
                 * Specifies whether the adhoc line is draggable.
                 * @since 1.88
                 */
                draggable: {type: "boolean", defaultValue: false}
            },
            events: {
                /**
                * Fires when the adhoc marker is pressed.
                */
                markerPress: {},

                /**
                * Fires when the adhoc marker is hovered.
                */
                markerMouseEnter: {},

                /**
                * Fires when the mouse leaves adhoc marker.
                */
                markerMouseLeave: {},
                /**
                 * Fires during drag and drop of the adhoc line.
                 * @since 1.88
                 */
                adhoclineDrop: {
                    parameters: {
                        newTimeStamp: {type: "string"},
                        oldTimeStamp: {type: "string"}
                        }
                }
            },
            aggregations :{

				/**
                 * Adhoc Line
                 * @private
                 */
                _line: {type: "sap.gantt.simple.BaseLine", multiple : false, visibility: "hidden"},

                /**
                 * Adhoc Marker
                 * @private
                 */
                _marker: {type: "sap.gantt.simple.AdhocDiamond" , multiple : false, visibility: "hidden"},

                /**
                 * Adhoc Header Line
                 * @private
                 */
                _headerLine: {type: "sap.gantt.simple.BaseLine" , multiple : false, visibility: "hidden"}
            },
            designtime: "sap/gantt/designtime/simple/AdhocLine.designtime"
        }
    });

    /**
     * Returns the strokeWidth property of the Adhoc line
     * @returns {float} - Return the strokeWidth property value
     * @private
     */
    AdhocLine.prototype._getStrokeWidth = function(){
        return this.getProperty("_strokeWidth");
    };

    /**
     * Returns the marker object
     * @returns {sap.gantt.simple.AdhocDiamond} Returns the marker object
     * @private
     */
    AdhocLine.prototype._getMarker = function(){
        return this.getAggregation("_marker");
    };

    /**
     * Sets the marker object
     * @param {sap.gantt.simple.AdhocDiamond} val // instance of marker object to be set
     * @private
     */
    AdhocLine.prototype._setMarker = function(val){
        this.setAggregation("_marker", val, true);
    };

    /**
     * Returns the line object
     * @returns {sap.gantt.simple.BaseLine} Returns the line object
     * @private
     */
    AdhocLine.prototype._getLine = function(){
        return this.getAggregation("_line");
    };

    /**
     * Sets the line object
     * @param {sap.gantt.simple.BaseLine} val // instance of line object to be set
     * @private
     */
    AdhocLine.prototype._setLine = function(val){
        this.setAggregation("_line", val, true);
    };

    /**
     * Returns the line object
     * @returns {sap.gantt.simple.BaseLine} Returns the line object
     * @private
     */
    AdhocLine.prototype._getHeaderLine = function(){
        return this.getAggregation("_headerLine");
    };

    /**
     * Sets the line object
     * @param {sap.gantt.simple.BaseLine} val // instance of line object to be set
     * @private
     */
    AdhocLine.prototype._setHeaderLine = function(val){
        this.setAggregation("_headerLine", val, true);
    };

    /**
     * Sets the selected variable
     * @param {Boolean} val // bool value to be set
     * @private
     */
    AdhocLine.prototype._setSelected = function(val){
        this.setProperty("_selected", val, true);
    };

    /**
     * Returns a bool value for selected variable
     * @returns {Boolean} Returns a bool value
     * @private
     */
    AdhocLine.prototype._getSelected = function(){
        return this.getProperty("_selected");
    };

    /**
     * Sets the value of level
     * @param {int} val, integer value to be set
     * @private
     */
    AdhocLine.prototype._setLevel = function (val) {
        this.setProperty("_level", val, true);
    };

    /**
     * Returns a integer value of level
     * @returns {int} Returns a integer value
     * @private
     */
    AdhocLine.prototype._getLevel = function () {
        return this.getProperty("_level");
    };

    /**
     * Triggers when the marker is pressed
     * @param {jQuery.Event} oEvent //Event object
     */
    AdhocLine.prototype.markerPress = function (oEvent) {
        //Reset the stroke dasharray style to the original state
        if (this.getMarkerType() !== sap.gantt.simple.MarkerType.None){
            if (!this._getSelected()){
                GanttUtils.resetStrokeDasharray(this.getParent());
                this._setSelected(true);
            }
            var oLine = this._getLine();
            var oLineSelected = document.getElementById(oLine.sId);
            oLineSelected.style.strokeDasharray = 0;
            oLineSelected.style.strokeWidth = this._getStrokeWidth() + 1;
            var oHeaderLine = this._getHeaderLine();
            var oHeaderLineSelected = document.getElementById(oHeaderLine.sId);
            oHeaderLineSelected.style.strokeDasharray = 0;
            oHeaderLineSelected.style.strokeWidth = this._getStrokeWidth() + 1;
            if (this.getDraggable() && this._getSelected()) {
                //adding Move cursor on hovering dragable adhoc line.
                var oMarker = document.getElementById(this._getMarker().getId());
                oMarker.style.cursor = "move";
            }
        }
    };

    /**
     * Triggers when the marker is hovered
     * @param {jQuery.Event} oEvent //Event object
     */
    AdhocLine.prototype.markerMouseEnter = function (oEvent) {
        if (this.getMarkerType() !== sap.gantt.simple.MarkerType.None){
            // make the Adhoc line solid
            var oLine = this._getLine();
            var oLineSelected = document.getElementById(oLine.sId);
            oLineSelected.style.strokeDasharray = 0;
            oLineSelected.style.strokeWidth = this._getStrokeWidth() + 1;
            var oHeaderLine = this._getHeaderLine();
            var oHeaderLineSelected = document.getElementById(oHeaderLine.sId);
            oHeaderLineSelected.style.strokeDasharray = 0;
            oHeaderLineSelected.style.strokeWidth = this._getStrokeWidth() + 1;

            if (this.getDraggable() && this._getSelected()) {
                //adding Move cursor on hovering dragable adhoc line.
                var oMarker = document.getElementById(this._getMarker().getId());
                oMarker.style.cursor = "move";
            }
        }
    };

    /**
     * Triggers when the mouse leaves the marker
     * @param {jQuery.Event} oEvent //Event object
     */
    AdhocLine.prototype.markerMouseLeave = function (oEvent) {
        if (this.getMarkerType() !== sap.gantt.simple.MarkerType.None){
            // set the stroke daasharray style property to its original value
            // if the marker is not clicked
            var bSelected = this._getSelected();
            if (!bSelected){
                var oLine = this._getLine();
                var oStroke = document.getElementById(oLine.sId);
                var sOriginalStrokeDashArray = this.getStrokeDasharray();
                var sOriginalStrokeWidth = this._getStrokeWidth();
                oStroke.style.strokeDasharray = sOriginalStrokeDashArray;
                oStroke.style.strokeWidth = sOriginalStrokeWidth;
                var oHeaderLine = this._getHeaderLine();
                var oHeaderLineSelected = document.getElementById(oHeaderLine.sId);
                oHeaderLineSelected.style.strokeDasharray = sOriginalStrokeDashArray;
                oHeaderLineSelected.style.strokeWidth = sOriginalStrokeWidth;
            }
        }
    };
    return AdhocLine;
}, true);
