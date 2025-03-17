/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./MultiActivityGroup",
	"sap/gantt/simple/BaseRectangle",
	"./GanttUtils",
	"sap/ui/core/theming/Parameters",
	"sap/gantt/simple/BaseImage",
    "sap/gantt/def/gradient/LinearGradient",
    "sap/gantt/misc/Format",
    "sap/gantt/def/gradient/Stop",
    "sap/ui/core/Core",
    "sap/gantt/library",
	"sap/gantt/utils/GanttChartConfigurationUtils"
], function (MultiActivityGroup, BaseRectangle, GanttUtils, Parameters, BaseImage, LinearGradient, Format, Stop, Core, library, GanttChartConfigurationUtils) {
	"use strict";
	/**
	 * Creates and initializes a new BasePseudoShape class.
	 *
	 * @param {string} [sId] This is the ID of the new control. It is generated automatically if an ID is not provided.
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Base PseudoShape class uses SVG tag 'g'. It is a shape container. Any other shapes can be aggregated under this group. This extends from the MultiActivityGroup.
	 *
	 * @extends sap.gantt.simple.MultiActivityGroup
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 * @since 1.109
	 *
	 * @constructor
	 * @private
	 * @alias sap.gantt.simple.BasePseudoShape
	 */
	var BasePseudoShape = MultiActivityGroup.extend("sap.gantt.simple.BasePseudoShape", {
		metadata: {
			properties: {
				/**
				 * The title of pseudo shape when it is expanded
				 * @private since 1.110
				 */
				expandTitle: {
					type: "string",
					defaultValue: "Show Details"
				},

				/**
				 * The title of pseudo shape when it is collapsed
				 * @private since 1.110
				 */
				collapseTitle: {
					type: "string",
					defaultValue: "Show Less"
				},

				/**
				 * The color for overlap indicator/gradient part.
				 * @private since 1.110
				 */
				overlapFill: {
					type: "sap.gantt.ValueSVGPaintServer",
					defaultValue: "@sapChart_OrderedColor_11"
				},
				/**
				 * The color for pseudo shape.
				 * @private since 1.110
				 */
				fill: {
					type: "sap.gantt.ValueSVGPaintServer",
					defaultValue: "@sapChart_OrderedColor_1"
				},

				/**
				 * Explains how the overlapping shapes are indicated, such as in the form of a gradient, indicator or both
				 * @private since 1.110
				 */
				typeOfOverlapIndicator:{
					type: "string", defaultValue: library.simple.typeOfOverlapIndicator.Gradient
				}
			},
			aggregations: {
				/**
				 *  Button to expand or collapse the pseudo shape
				 * @private since 1.110
				 */
				button: {
					type: "sap.gantt.simple.BaseShape",
					sapGanttOrder: 2,
					visibility: "hidden"
				}
			}
		}
	});

	/**
	 * @private
	 */
	BasePseudoShape.prototype.getButton = function() {
		return this.getAggregation("button");
	};

	/**
	 * Handles the expanding and collapsing function when the pseudo shape is clicked
	 *
	 * @param {object} oEvent Pseudo shape click event data
	 * @private
	 */
	BasePseudoShape.prototype.onclick = function (oEvent) {
		if (oEvent && oEvent.target.getAttribute("class").indexOf("pseudoShapeIcon") == -1) {
			return;
		}
		var oGantt = this.getGanttChartBase();
		var oTable = oGantt.getTable();
		var oRowSettingsTemplate = oTable.getRowSettingsTemplate();
		var aRows = oTable.getRows();
		var iRowIndex = this.getParentRowSettings().getParent().getIndex() - aRows[0].getIndex();
		var oRow = aRows[iRowIndex];
		oGantt.oOverlapShapeIds = oGantt.oOverlapShapeIds ? oGantt.oOverlapShapeIds : {};
		var oOverlapShapeIdsInRow = oGantt.oOverlapShapeIds && oGantt.oOverlapShapeIds[oRow.getIndex()] ? oGantt.oOverlapShapeIds && oGantt.oOverlapShapeIds[oRow.getIndex()] : [];
		var bIsExpandRequired = (this.aShapeIds.length > 0 && (oOverlapShapeIdsInRow.length == 0 || this.aShapeIds.indexOf(oOverlapShapeIdsInRow[0]) == -1));
		var iIndex = oRow.getIndex();
		var sScheme;
		if (oOverlapShapeIdsInRow && oGantt._aExpandedIndices.length > 0 && oGantt._aExpandedIndices.indexOf(iIndex) > -1) {
			oGantt._collapse(sScheme, iIndex, true);
		}

		if (bIsExpandRequired) {
			var sModelName = oTable.getBindingInfo("rows").model;
			var oSettings = oRow.getAggregation("_settings");
			oGantt.oOverlapShapeIds[oRow.getIndex()] = [];
			var aPossibleShapes = oGantt._getPossibleShapesInGantt();
			var aBindingInfos = [];
			aPossibleShapes.forEach(function(shape){
				var oBindingInfo = oRowSettingsTemplate.getBindingInfo(shape);
				aBindingInfos.push(oBindingInfo);
			});
			this.aShapeContexts.forEach(function (oContext) {
				var sAggrType = aPossibleShapes.indexOf(oContext.aggrType);
				var oClone = aBindingInfos[sAggrType] && aBindingInfos[sAggrType].template.clone();
				if (oClone){
					oClone.setBindingContext(oContext, sModelName);
					oSettings.addAggregation(oContext.aggrType, oClone, true);
					oGantt.oOverlapShapeIds[iIndex].push(oSettings.getAggregation(oContext.aggrType)[oSettings.getAggregation(oContext.aggrType).length - 1].getShapeId());
					// iCloneIndex++;
				}
			});

			oGantt._expand(sScheme, iIndex, true);
		}
	};
	/**
	 * Formats the time of a shape given according to the formatter provided through template of binding.
	 * @private
	 */
	BasePseudoShape.prototype._timeFormatter = function (oContext, oShapePropertyPath) {
		var startTime = oContext.getProperty(oShapePropertyPath.startTime);
		var endTime = oContext.getProperty(oShapePropertyPath.endTime);
		var oTime = oContext.timeFormatter ? oContext.timeFormatter(startTime) : startTime,
		oEndTime = oContext.endTimeFormatter ? oContext.endTimeFormatter(endTime) : endTime;

		return {
			time: oTime,
			endTime: oEndTime
		};
	};
	/**
	 * Creates a pseudo shape for the provided binding information
	 * @private
	 */
	BasePseudoShape.prototype._createPseudoShape = function (oShapeGroup, oRow, oGantt, expanded) {
		var horizontalTextAlignment = sap.gantt.simple.horizontalTextAlignment,
			oPseudoShapeIcon;
			var obasePseudo = new BasePseudoShape();
		var createIcon = function (sIconSrc, oTask) {
			return new BaseImage({
				height: parseFloat(Parameters.get("sapUiChartAxisTitleFontSize"), 100) * 16,
				fontWeight: Parameters.get("sapUiChartTitleFontWeight"),
				src: sIconSrc,
				fill: Parameters.get("sapUiChartReferenceLineLabelColor"),
				horizontalTextAlignment: oTask.getHorizontalTextAlignment(),
				time: oTask.getTime(),
				endTime: oTask.getEndTime()
			});
		};
		obasePseudo.setAggregation("task", new BaseRectangle({
			time: oShapeGroup.startTime,
			endTime: oShapeGroup.endTime,
			horizontalTextAlignment: horizontalTextAlignment.Start,
			fontSize: parseFloat(Parameters.get("sapUiChartAxisTitleFontSize"), 100) * 16,
			fontWeight: Parameters.get("sapUiChartTitleFontWeight")
		}));
		var oTask = obasePseudo.getTask();
		oShapeGroup.overlaps.forEach(function (overlap) {
			if (obasePseudo.getTypeOfOverlapIndicator() != "Gradient") {
				oTask._iBaseRowHeight = oGantt._oExpandModel.getBaseRowHeight() ? oGantt._oExpandModel.getBaseRowHeight() : oTask._iBaseRowHeight;
				var iShapeHeight = oTask.getHeight();
				obasePseudo.addAggregation("indicators",  new BaseRectangle({
					time: overlap.startTime,
					endTime: overlap.endTime,
					yBias: iShapeHeight + 2
				}).addStyleClass("sapGanttPseudoShapeOverlapIndicatorStyle"));
			}
		});
		if (expanded && oGantt.oOverlapShapeIds && oGantt.oOverlapShapeIds[oRow.getIndex()] && oShapeGroup.aShapeIds && oShapeGroup.aShapeIds.some(function (shapeId) {
				return oGantt.oOverlapShapeIds[oRow.getIndex()].includes(shapeId);
			})) {
			oPseudoShapeIcon = createIcon("sap-icon://collapse", oTask);
			oTask.setTitle(obasePseudo.getCollapseTitle());
		} else {
			oPseudoShapeIcon = createIcon("sap-icon://expand", oTask);
			oTask.setTitle(obasePseudo.getExpandTitle());
		}
		oTask.setTitleColor(Parameters.get("sapUiChartReferenceLineLabelColor"));
		oPseudoShapeIcon.aCustomStyleClasses = ["pseudoShapeIcon"];
		obasePseudo.addAggregation("button", oPseudoShapeIcon);
		return obasePseudo;
	};

	/**
	 * Creates a linear gradient.
	 * @private
	 */
    BasePseudoShape.prototype._fnCreateLinearGradient = function (aPoints, oPseudoShape) {
		var aStops = [], shapeFill = oPseudoShape.shapeFill ? oPseudoShape.shapeFill : "@sapChart_OrderedColor_1",
		overlapIndicatorFill = oPseudoShape.overlapIndicatorFill ? oPseudoShape.overlapIndicatorFill : "@sapChart_OrderedColor_11";
		var bRtl = GanttChartConfigurationUtils.getRTL();
		if (bRtl){
			for (var i = aPoints.length - 1; i >= 0; i--){
				aStops.push(new Stop({
					offSet: String(100 - aPoints[i] + "%"),
					stopColor: (i % 2 == 0) ? overlapIndicatorFill : shapeFill
				}));
				aStops.push(new Stop({
					offSet: String(100 - aPoints[i - 1] + "%"),
					stopColor: (i % 2 == 0) ? overlapIndicatorFill : shapeFill
				}));
			}
		} else {
			for (var i = 0; i < aPoints.length - 1; i++){
				aStops.push(new Stop({
					offSet: String(aPoints[i] + "%"),
					stopColor: (i % 2 == 0) ? shapeFill : overlapIndicatorFill
				}));
				aStops.push(new Stop({
					offSet: String(aPoints[i + 1] + "%"),
					stopColor: (i % 2 == 0) ? shapeFill : overlapIndicatorFill
				}));
			}
		}
		return aStops;
	};
	/**
	 * Create shapes for the provided binding information from the context
	 * @private
	 */
	BasePseudoShape.prototype._createShapesFromContext = function(aContext, oRow, aBindingInfos, oGantt, expanded, index, needGradientCalculations){
		var oSettings = oRow.getAggregation("_settings");
        var oAxisTime = oGantt.getAxisTime(), oShapePropertyPaths = {};
		var oPseudoShapeTemplate = oSettings.getPseudoShapeTemplate && oSettings.getPseudoShapeTemplate();
		var sModelName = oGantt.getTable().getBindingInfo("rows").model;
		var aPossibleShapes = oGantt._getPossibleShapesInGantt();
		// Getting start and end time and indicator binding.
		aBindingInfos.forEach(function(oBindingInfo, index){
			if (oBindingInfo){
				var aShapes = oBindingInfo.template.getAggregation("shapes");
				var oStartTimeBindingInfo = oBindingInfo.template.getBindingInfo("time") || aShapes && aShapes[0] && aShapes[0].getBindingInfo("time"),
				oEndTimeBindingIndo = oBindingInfo.template.getBindingInfo("endTime") || aShapes && aShapes[0] && aShapes[0].getBindingInfo("endTime"),
				oShapeIdBinding = oBindingInfo.template.getBindingInfo("shapeId");
				oShapePropertyPaths[index] = {
					endTime: oEndTimeBindingIndo.parts[0].path || oEndTimeBindingIndo.path,
					startTime: oStartTimeBindingInfo.parts[0].path || oStartTimeBindingInfo.path,
					shapeId: oShapeIdBinding.parts[0].path || oShapeIdBinding.path
				};
			}
		});

		var getIcon = function(sIconSrc, oTask){
			return new BaseImage( {
				height:parseFloat(Parameters.get("sapUiChartAxisTitleFontSize"), 100) * 16,
				fontWeight: Parameters.get("sapUiChartTitleFontWeight"),
				src: sIconSrc,
				fill: Parameters.get("sapUiChartReferenceLineLabelColor"),
				horizontalTextAlignment: oTask.getHorizontalTextAlignment(),
				time: oTask.getTime(),
				endTime: oTask.getEndTime()
			});
		};
		aContext.sort(function(oContext1, oContext2){
			var oContext1StartTimeformatter = oContext1.timeFormatter;
			var oContext2StartTimeformatter = oContext2.timeFormatter;
		var oContext1StartTime = oContext1.getProperty(oShapePropertyPaths[aPossibleShapes.indexOf(oContext1.aggrType)].startTime);
		var oContext2StartTime = oContext2.getProperty(oShapePropertyPaths[aPossibleShapes.indexOf(oContext2.aggrType)].startTime);
		var oTime1 = oContext1StartTimeformatter ? oContext1StartTimeformatter(oContext1StartTime) : oContext1StartTime,
		oTime2 = oContext2StartTimeformatter ? oContext2StartTimeformatter(oContext2StartTime) : oContext2StartTime;

			return oTime1 - oTime2;
		});
		var aFinalShapeGroupArray = this._findPseudoShapeContextArray(aContext, oShapePropertyPaths ,oRow, oGantt, aBindingInfos);
		var title, oTask, oPseudoShapeIcon;
		oRow.aFinalShapeGroupArray = aFinalShapeGroupArray;
		aFinalShapeGroupArray.forEach(function(oShapeGroup) {
			//for each shape group, create the pseudo shape if there are overlaps
			if (oShapeGroup.iShapeCount > 1) {
				var oShapeClone;
				if (oPseudoShapeTemplate){
					oShapeClone = oPseudoShapeTemplate.clone();
					oTask = oShapeClone.getTask();
					oShapeGroup.shapeFill = oTask.getFill() ? oTask.getFill() : oShapeClone.getFill();
					oTask.setTime(oShapeGroup.startTime);
					oTask.setEndTime(oShapeGroup.endTime);
					oTask.setSelectable(true);
					if (expanded && oGantt.oOverlapShapeIds && oGantt.oOverlapShapeIds[oRow.getIndex()] && oShapeGroup.aShapeIds &&  oShapeGroup.aShapeIds.some(function(shapeId){return oGantt.oOverlapShapeIds[oRow.getIndex()].includes(shapeId);})){
							oPseudoShapeIcon = getIcon("sap-icon://collapse", oTask);
							title = oShapeClone.getCollapseTitle() ? oShapeClone.getCollapseTitle() : "Show Less";
					} else {
							oPseudoShapeIcon = getIcon("sap-icon://expand", oTask);
							title = oShapeClone.getExpandTitle() ? oShapeClone.getExpandTitle() : "Show Details";
					}
					oTask.setTitle(title);
					oShapeGroup.overlaps.forEach(function(overlap) {
						var indicator = oShapeClone.getIndicators()[0].clone();
						indicator.addStyleClass("sapGanttPseudoShapeOverlapIndicatorStyle");
						oShapeGroup.overlapIndicatorFill = indicator.getFill() ? indicator.getFill() : oShapeClone.getOverlapFill();
						if (oShapeClone.getTypeOfOverlapIndicator() != "Gradient"){
							indicator.setTime(overlap.startTime);
							indicator.setEndTime(overlap.endTime);
							oShapeClone.addAggregation("indicators",indicator);
						}
					});
					oPseudoShapeIcon.aCustomStyleClasses = ["pseudoShapeIcon"];
					oShapeClone.addAggregation("button",oPseudoShapeIcon);
				} else {
					oShapeClone = this._createPseudoShape(oShapeGroup,oRow,oGantt,expanded);
					oTask = oShapeClone.getTask();
				}
				oShapeClone.isPseudoShape = true;
				oShapeClone.aShapeContexts = oShapeGroup.aShapeContexts;
				oShapeClone.aShapeIds = oShapeGroup.aShapeIds;
				oShapeClone.getTask().addStyleClass("sapGanttPseudoShapeColor");
				if (oShapeClone.getTypeOfOverlapIndicator() != "Indicator"){
					oShapeClone.getTask().setFill('url(#' + oShapeGroup.id + ')');
				}
				oSettings.addAggregation("pseudoShapes", oShapeClone, true);
				oShapeClone._birdEye(aBindingInfos,oGantt,oShapeClone,oRow,index > -1 ? oGantt._aExpandedIndices.indexOf(oRow.getIndex()) == -1 : true, oShapePropertyPaths);
                if (needGradientCalculations){
                    var pseudoShapeStartTime = oShapeGroup.startTime,
                    pseudoShapeEndTime = oShapeGroup.endTime;
                    var pseudoShapeStartTimeSec = pseudoShapeStartTime.getTime(),
                    pseudoShapeEndTimeSec = pseudoShapeEndTime.getTime();
                    var total = pseudoShapeEndTimeSec - pseudoShapeStartTimeSec,
                        aPoints = [0];
                    for (var iIndex = 0; iIndex < oShapeGroup.overlaps.length; iIndex++){
                        var oOverlap = oShapeGroup.overlaps[iIndex];
                        var start = ((oOverlap.startTime.getTime() - pseudoShapeStartTimeSec) / total) * 100;
                        var stop = ((oOverlap.endTime.getTime() - pseudoShapeStartTimeSec) / total) * 100;
                        aPoints.push(start);
                        if ((stop - start) < 1){// If overlap diff is less than 1% then making default shade as 1% of pseudo shape
                            var endTime = oAxisTime.timeToView(Format.abapTimestampToDate(pseudoShapeEndTime)),
                                startTime = oAxisTime.timeToView(Format.abapTimestampToDate(pseudoShapeStartTime));
                            var nRetVal = Math.abs(endTime - startTime);
                            stop = start + ((1 / nRetVal) * 100);
                        }
                        aPoints.push(stop);
                    }
                    aPoints.push(100);
                    var aStops = this._fnCreateLinearGradient(aPoints, oShapeGroup);
					var oDefAlreadyExist = oGantt._oSvgDefs && oGantt._oSvgDefs.getAggregation("defs") && oGantt._oSvgDefs.getAggregation("defs").find(function(def){
						return def.getId() == oShapeGroup.id;
					});
                    if (!oDefAlreadyExist){
                        oGantt._oSvgDefs && oGantt._oSvgDefs.addAggregation("defs", new LinearGradient(oShapeGroup.id, {
                            x1: "0%",
                            y1: "0%",
                            x2: "100%",
                            y2: "0%",
                            stops: aStops
                        }), true);
                    }
                }
            } else {
				//if there are no overlaps, create original shape
				if (oShapeGroup.iShapeCount === 1) {
					var sAggrType = oShapeGroup.aShapeContexts[0].aggrType;
					var oClone = aBindingInfos[aPossibleShapes.indexOf(sAggrType)].template.clone();
					oClone.setBindingContext(oShapeGroup.aShapeContexts[0], sModelName);
					// add back to the rows aggregation
					oSettings.addAggregation(sAggrType, oClone, true);
					var cloneIndex = oSettings.getAggregation(sAggrType).length - 1;
					var iIndex = oRow.getIndex();
					var overlapIndex = oGantt.oOverlapShapeIds && oGantt.oOverlapShapeIds[iIndex] && oGantt.oOverlapShapeIds[iIndex].indexOf(oSettings.getAggregation(sAggrType)[cloneIndex].getShapeId());
					if (overlapIndex > -1){
						if (oGantt.oOverlapShapeIds[iIndex].length > 1){
							oGantt.oOverlapShapeIds[iIndex].splice(overlapIndex,1);
						} else if (oGantt.oOverlapShapeIds) {
							delete oGantt.oOverlapShapeIds[iIndex];
						}
					}

				}
			}
		}.bind(this));

	};

	/**
	 * Creates shape groups for the provided binding information from the context
	 * @private
	 */
	BasePseudoShape.prototype._findPseudoShapeContextArray  = function(aContext, oShapePropertyPaths, oRow, oGantt) {
		var aShapeGroups = [], sAggrType, iGroupIndex = 0, iOverlapIndex = 0, oGanttId = oGantt.getId();
		// Verified that operations are sorted in ascending order of their start time. If not, we need to sort it that way.
		var aPossibleShapes = oGantt._getPossibleShapesInGantt();
		if (aContext[0]){
			sAggrType = aPossibleShapes.indexOf(aContext[0].aggrType);
			aShapeGroups.push({
				id: oGanttId + "_row-" + oRow.getIndex() + "group-" + iGroupIndex,
				iShapeCount: 1, //number of overlapping shapes
				startTime: this._timeFormatter(aContext[0], oShapePropertyPaths[sAggrType], oGantt).time,//start time of pseudo shape
				endTime: this._timeFormatter(aContext[0], oShapePropertyPaths[sAggrType], oGantt).endTime, //end time of pseudo shape
				overlaps: [], //array of overlap start and end time objects
				aShapeContexts: [aContext[0]], //mostly not needed in original implementation, adding so you get all necessary info here
				aShapeIds: [aContext[0].getProperty(oShapePropertyPaths[sAggrType].shapeId)]
			});
		}
		for (var i = 1; i < aContext.length; i++) {
			var oOperation = aContext[i];
			//check for complete overlaps
			//incoming shape's start and end time
			sAggrType = aPossibleShapes.indexOf(oOperation.aggrType);
			var dShapeStartTime = this._timeFormatter(oOperation, oShapePropertyPaths[sAggrType], oGantt).time,
			dShapeEndTime = this._timeFormatter(oOperation, oShapePropertyPaths[sAggrType], oGantt).endTime,
			//Pseudo shape's start and end time
			oShapeGroup = aShapeGroups[iGroupIndex],
			dExistingShapeStartTime = oShapeGroup.startTime,
			dExistingShapeEndTime = oShapeGroup.endTime;
			var dExistingOverlapShapeStartTime = oShapeGroup.overlaps[iOverlapIndex] && oShapeGroup.overlaps[iOverlapIndex].startTime,
					dExistingOverlapShapeEndTime = oShapeGroup.overlaps[iOverlapIndex] && oShapeGroup.overlaps[iOverlapIndex].endTime;
			//when incoming shape is completely coincided by pseudo shape
			if (dShapeStartTime >= dExistingShapeStartTime && dShapeEndTime <= dExistingShapeEndTime) {
				//fully coinciding do nothing to pseudo shape's start and end time
				oShapeGroup.aShapeContexts.push(oOperation);
				oShapeGroup.iShapeCount++;
				oShapeGroup.aShapeIds.push(oOperation.getProperty(oShapePropertyPaths[aPossibleShapes.indexOf(oOperation.aggrType)].shapeId));
				//if overlap are not there yet, add first overlap
				//start time of overlap -> start time of incoming shape, end time of overlap -> end time of incoming shape
				if (oShapeGroup.overlaps.length === 0) {
					oShapeGroup.overlaps.push({
						startTime: dShapeStartTime,
						endTime: dShapeEndTime
					});
				} else {
					//if overlap already exists
					//oexisting verlap's start and end time
					//if incoming shape lies withing the existing overlap, do nothing
					if (dShapeStartTime >= dExistingOverlapShapeStartTime && dShapeEndTime <= dExistingOverlapShapeEndTime) {
						//do nothing
					} else if (dShapeStartTime >= dExistingOverlapShapeStartTime && dShapeStartTime < dExistingOverlapShapeEndTime && dShapeEndTime > dExistingOverlapShapeEndTime) {
						//if incoming shape partially coincide with the overlap,extend the overlap's end time to the endtime of the incoming shape
						oShapeGroup.overlaps[iOverlapIndex].endTime = dShapeEndTime;
					} else if (dShapeStartTime > dExistingOverlapShapeEndTime && dShapeEndTime > dExistingOverlapShapeEndTime) {
						//if incoming shape does not coincide with the existing overlap at all, create a new overlap object
						oShapeGroup.overlaps.push({
							startTime: dShapeStartTime,
							endTime: dShapeEndTime
						});
						iOverlapIndex++;
					}
				}
			} else if (dShapeStartTime >= dExistingShapeStartTime && dShapeStartTime < dExistingShapeEndTime && dShapeEndTime > dExistingShapeEndTime) {
				//when incoming shape partially coincides with pseudo shape
				oShapeGroup.aShapeContexts.push(oOperation);
				oShapeGroup.iShapeCount++;
				oShapeGroup.aShapeIds.push(oOperation.getProperty(oShapePropertyPaths[aPossibleShapes.indexOf(oOperation.aggrType)].shapeId));
				//indicator endtime update
				if (oShapeGroup.overlaps.length === 0) {
					//if overlap are not there yet, add first overlap
					//start time of overlap -> start time of incoming shape, end time of overlap -> end time of pseudo shape

					oShapeGroup.overlaps.push({
						startTime: dShapeStartTime,
						endTime: oShapeGroup.endTime
					});
				} else {
					//if overlap already exists
					//existing verlap's start and end time
					if (dShapeStartTime >= dExistingOverlapShapeStartTime && dExistingShapeEndTime <= dExistingOverlapShapeEndTime) {
						//if incoming shape lies withing the existing overlap, do nothing
						//do nothing
					} else if (dShapeStartTime >= dExistingOverlapShapeStartTime && dShapeStartTime < dExistingOverlapShapeEndTime && dExistingShapeEndTime > dExistingOverlapShapeEndTime) {
						//if incoming shape partially coincides with the overlap
						// if incoming shape starts before overlap ends and the pseudo shape end's after overlap (the new overlap will be till end of pseudo shape)
						// then make the existing overlap's end time as the pseudo shape's end time
						oShapeGroup.overlaps[iOverlapIndex].endTime = oShapeGroup.endTime;
					} else if (dShapeStartTime > dExistingOverlapShapeEndTime && dExistingShapeEndTime > dExistingOverlapShapeEndTime) {
						// for new overlaps, add the corresponding object
						oShapeGroup.overlaps.push({
							startTime: dShapeStartTime,
							endTime: oShapeGroup.endTime
						});
						iOverlapIndex++;
					}
				}
				//update pseudo shape's end time as the incoming shape's end time
				oShapeGroup.endTime = dShapeEndTime;
			} else if (dShapeStartTime >= dExistingShapeEndTime && dShapeEndTime >= dExistingShapeEndTime) {
				//for new pseudo shape, add corresponding object
				iGroupIndex++;
				iOverlapIndex = 0;
				aShapeGroups.push({
					id: oGanttId + "_row-" + oRow.getIndex() + "group-" + iGroupIndex,
					iShapeCount: 1,
					startTime: dShapeStartTime,
					endTime: dShapeEndTime,
					overlaps: [],
					aShapeContexts: [oOperation],
					aShapeIds: [oOperation.getProperty(oShapePropertyPaths[aPossibleShapes.indexOf(oOperation.aggrType)].shapeId)]
				});
			}
		}
		return aShapeGroups;
	};

	/**
	 *Calculates bird eye ranges
	 * @private
	 */
	BasePseudoShape.prototype._birdEye = function (aBindingInfos, oGantt, oShapeClone, oRow, expanded, oShapePropertyPaths) {
		var iRowIndex = oRow.getIndex(),
		oSettings = oRow.getAggregation("_settings");
		var aPossibleShapes = oGantt._getPossibleShapesInGantt();
		var calculateBirdEyeRange = function (oShapePropertyPaths, oPseudoShape) {
			var pseudoCountInBirdEye = false,
				startTime, endTime;
			for (var i = 0; i < oShapeClone.aShapeContexts.length; i++) {
				var oShape = oShapeClone.aShapeContexts[i];
				var sAggrType = aPossibleShapes.indexOf(oShape.aggrType);
				var oShapeBindingInfo = aBindingInfos[sAggrType];
				var countInBirdEyeBindingInfo = oShapeBindingInfo.template.getBindingInfo("countInBirdEye"), countInBirdEyeVal;
				if (countInBirdEyeBindingInfo) {
					countInBirdEyeVal = countInBirdEyeBindingInfo.parts[0].path || countInBirdEyeBindingInfo.path;
				} else {
					countInBirdEyeVal = oShapeBindingInfo.template.getCountInBirdEye();
				}
				if (typeof (countInBirdEyeVal) != "boolean" && oShape.getProperty(countInBirdEyeVal) || countInBirdEyeVal == true) {
					pseudoCountInBirdEye = true;
					var oCurrentStartTime = oPseudoShape._timeFormatter(oShape, oShapePropertyPaths[sAggrType], oGantt).time;
					var oCurrentEndTime = oPseudoShape._timeFormatter(oShape, oShapePropertyPaths[sAggrType], oGantt).endTime;
					if (!startTime || oCurrentStartTime < startTime) {
						startTime = oCurrentStartTime;
					}
					if (!endTime || endTime < oCurrentEndTime) {
						endTime = oCurrentEndTime;
					}
				}
			}
			return {
				startTime: startTime,
				endTime: endTime,
				pseudoCountInBirdEye: pseudoCountInBirdEye
			};
		};
		if (oGantt.oOverlapShapeIds && oGantt.oOverlapShapeIds[iRowIndex] &&
			oShapeClone.aShapeIds.some(function (shapeId) {
				return oGantt.oOverlapShapeIds[iRowIndex].includes(shapeId);
			}) && expanded) {
			var sModelName = oGantt.getTable().getBindingInfo("rows").model;
			var pseudoCountInBirdEye = false,
				startTime, endTime;
			oShapeClone.aShapeContexts.forEach(function (oContext) {
				var sAggrType = aPossibleShapes.indexOf(oContext.aggrType);
				var oShapeBindingInfo = aBindingInfos[sAggrType];
				var countInBirdEyeBindingInfo = oShapeBindingInfo.template.getBindingInfo("countInBirdEye"), countInBirdEyeVal;
				if (countInBirdEyeBindingInfo) {
					countInBirdEyeVal = countInBirdEyeBindingInfo.parts[0].path || countInBirdEyeBindingInfo.path;
				} else {
					countInBirdEyeVal = oShapeBindingInfo.template.getCountInBirdEye();
				}
				if (typeof (countInBirdEyeVal) != "boolean") {
					if (oContext.getProperty(countInBirdEyeVal)) {
						pseudoCountInBirdEye = true;
						var oCurrentStartTime = this._timeFormatter(oContext, oShapePropertyPaths[sAggrType], oGantt).time;
						var oCurrentEndTime = this._timeFormatter(oContext, oShapePropertyPaths[sAggrType], oGantt).endTime;
						if (!startTime || oCurrentStartTime < startTime) {
							startTime = oCurrentStartTime;
						}
						if (!endTime || endTime < oCurrentEndTime) {
							endTime = oCurrentEndTime;
						}
					}
				}
				var oClone;
				var oBindingInfo = aBindingInfos[sAggrType];
					if (oBindingInfo){
						oClone = oBindingInfo.template.clone();
						oClone.setBindingContext(oContext, sModelName);
						// add back to the rows aggregation
						oSettings.addAggregation(oContext.aggrType, oClone, true);
					}
				oSettings.getAggregation(oContext.aggrType)[oSettings.getAggregation(oContext.aggrType).length - 1].isPartOfExpandedPseudoShape = true;
				var index = index > -1 ? index : iRowIndex;
				oGantt.oOverlapShapeIds[index] = oShapeClone.aShapeIds;
			}.bind(this));
			if (typeof (countInBirdEyeVal) != "boolean") {
				oShapeClone.groupBirdEyeRangeStartTime = startTime;
				oShapeClone.groupBirdEyeRangeEndTime = endTime;
				oShapeClone.setCountInBirdEye(pseudoCountInBirdEye);
			}
		} else {
			var oBirdEyeCalculationInfo = calculateBirdEyeRange(oShapePropertyPaths, this);
			oShapeClone.groupBirdEyeRangeStartTime = oBirdEyeCalculationInfo.startTime;
			oShapeClone.groupBirdEyeRangeEndTime = oBirdEyeCalculationInfo.endTime;
			oShapeClone.setCountInBirdEye(oBirdEyeCalculationInfo.pseudoCountInBirdEye);
		}
	};
	return BasePseudoShape;
}, true);
