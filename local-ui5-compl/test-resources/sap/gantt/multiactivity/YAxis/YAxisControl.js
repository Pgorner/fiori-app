sap.ui.define([
	"sap/ui/core/Control"
], function (Control) {
	"use strict";

	var yAxisControlAlignment = {
		/**
		 * The Control is aligned at the top.
		 *  @public
		 */
		Top: "Top",
		/**
		 * The Control is aligned at the center.
		 *  @public
		 */
		Middle: "Middle",
		/**
		 * The Control  is aligned at the bottom.
		 *  @public
		 */
		Bottom: "Bottom"
	};

	/* global ResizeObserver */
	return Control.extend("sap.YAxisControl", {
		metadata : {
            properties : {
				/**
				 * Minimum value of the Control.
				*/
                minValue:   {type: "float", group: "Misc", defaultValue: null},
				/**
				 * Maximum value of the Control.
				*/
                maxValue:   {type: "float", group: "Misc", defaultValue: null},
				/**
				 * Measurement value of the Control.
				*/
				measurement:   {type: "String", group: "Misc", defaultValue: ""},
				/**
				 * Property to display only the Threshold Value.
				*/
                showOnlyThreshold: 	{type: "boolean", defaultValue : true},
				/**
				 * Height of the Control.
				*/
				height: {type: "float", defaultValue: 100},
				/**
				 * Alignment of the Control.
				*/
				alignControl:  {type: "String", defaultValue: yAxisControlAlignment.Top}
			},
            aggregations: {
                thresholds: {type: "sap.YAxisControl.YAxisControlThresholdData", multiple: true}
            },
			defaultAggregation : "thresholds"
		},
		init : function () {
			if (typeof ResizeObserver === "function") {
				if (!this._oResizeObserver) {
					this._oResizeObserver = new ResizeObserver(this.handleResize.bind(this));
				}
			}
		},
		onAfterRendering: function() {
			setTimeout(function() {
				var threshold = {};
				var iDelta = 5; //Delta value between Ticks.
				var iWidthPaddingPixel = 2;
				var isRTL = sap.ui.getCore().getConfiguration().getRTL();
				var sOrientation = isRTL ? "right" : "left";
				var iCountOfLargerTick = 3;
				var iUOMPadding = 4;
				var iLargerTickWidth = 8;
				var iSmallerTickWidth = 4;
				var iContainerHeight;

				//get The Thresholds
				var thresholdsArray = this.getThresholds();

				//Get Height/Width of the Contianer whcih holds the Control
				// var iContainerWidth = document.getElementById(this.getId()+ "-yAxisControl").parentElement.offsetWidth;
				// var iContainerHeight = document.getElementById(this.getId()+ "-yAxisControl").parentElement.offsetHeight;
				if (jQuery("#" + this.getId() + "-yAxisControlSvg").children().length > 0) {
					jQuery("#" + this.getId() + "-yAxisControlSvg").empty();
				}
				var iParentContainerHeight =  jQuery("#" + this.getId() + "-yAxisControl").parent().outerHeight();
				var iContainerWidth = parseInt(jQuery("#" + this.getId() + "-yAxisControl").parent().outerWidth() - iWidthPaddingPixel);
				if (!this.mProperties.hasOwnProperty("height")) {
					iContainerHeight =  iParentContainerHeight;
				} else {
					iContainerHeight = this.getHeight() > iParentContainerHeight ? iParentContainerHeight : this.getHeight();
				}
				if (iContainerHeight > 0 && iContainerWidth > 0) {
					//CreateData based on Min/Max Value
					var data = [this.getMinValue() , this.getMaxValue()];
					//Crete scale absed on Min/Max Value
					var scale = d3.scale.linear()
								.domain([d3.min(data), d3.max(data)])
								.range([iContainerHeight, 0]);
					//Calculate Number of Ticks based ContainerHeight/iDelta/Thresholds
					var iNoOfTicks = parseInt((iContainerHeight / iDelta) - thresholdsArray.length);
					//Generate number of ticks.
					var aTicks = scale.ticks(iNoOfTicks);
					var initialTicksLength = aTicks.length;
					//Create threshold and add threshold to Ticks
					for (var i = 0; i < thresholdsArray.length; i++){
						if (thresholdsArray[i].getLabel() == "") {
							threshold[thresholdsArray[i].getValue()] = thresholdsArray[i].getValue();
						} else {
							threshold[thresholdsArray[i].getLabel()] = thresholdsArray[i].getValue();
						}
						if (!(aTicks.indexOf(thresholdsArray[i].getValue()) > -1)){
							aTicks.push(thresholdsArray[i].getValue());
						}
					}
					//Calculate svg translation based on alignControl Property
					var bHeightsSame = iContainerHeight === iParentContainerHeight;
					var iTranslatepx = 0;
					if (this.getAlignControl() == yAxisControlAlignment.Bottom) {
						iTranslatepx = bHeightsSame ? 0 : ((iParentContainerHeight - iContainerHeight)) ;
					} else if (this.getAlignControl() == yAxisControlAlignment.Middle) {
						iTranslatepx = bHeightsSame ? 0 : ((iParentContainerHeight - iContainerHeight) / 2) ;
					}
					//Get the svg Container
					var svg = d3.select("#" + this.getId() + "-yAxisControlSvg")
								.attr("width", iContainerWidth)
								.attr("height", iContainerHeight)
								.attr("transform", "translate(0," + iTranslatepx + ")");
					//Generate the yScale
					var y_axis = d3.svg.axis().scale(scale)
								.orient(sOrientation)
								.tickSize(iLargerTickWidth).tickValues(aTicks).tickFormat(function (d, index) {
									//Create only Thresholds based on property  ShowOnlyThreshold
									var sLabel = this.getLabel(threshold, d);
									if (this.getShowOnlyThreshold()) {
										if (sLabel) {
											return sLabel == d ? d : (this._processTextForTruncation(sLabel, isRTL) + " " + d);
										}
									} else if (!this.getShowOnlyThreshold() ) { //Create Thresholds and TimeScale
										if (sLabel) {
											return sLabel == d ? d : (this._processTextForTruncation(sLabel, isRTL) + " " + d);
										} else if ( index != 0 && index != (initialTicksLength - 1) && index % iCountOfLargerTick === 0 ) {
											return d;
										}
									}
								}.bind(this));
					//Append created axis to Svg
					svg.append("g")
						.attr("transform", "translate(" + (isRTL ? 0 : iContainerWidth) + " ,0)")
						.attr("class", "y axis")
						.attr("id", this.getId() + "-yAxisSvgG")
						.call(y_axis);
					var svgGTag = d3.select("#" + this.getId() + "-yAxisSvgG");
					//Add Measurement text to Svg
					var sUOMText = this.getMeasurement();
					sUOMText = this._processTextForTruncation(sUOMText, isRTL);
					svgGTag.append("text")
						.text(sUOMText)
						.attr("id", this.getId() + "-yAxisSvgUOMText")
						.attr("transform", "translate(" + (isRTL ? (iContainerWidth - iUOMPadding) : (-(iContainerWidth - iUOMPadding))) + "," + iUOMPadding + ")")
						.attr("class","y axis sapUiHintText sapGanttTimeHeaderSvgText")
						.attr("style","text-align: left; dominant-baseline: text-before-edge; line-height: 0rem; padding: 0");
					//Set class of the ticks
					svg.selectAll("g.tick line")
						.attr("style", "fill: none")
						.attr("class", "yAxisSvgTick sapGanttTimeHeaderSvgPath");
					//Set class of the Domain Path
					svg.selectAll(".domain")
						.attr("class", "yAxisSvgDomainTick sapGanttTimeHeaderSvgPath");

					//Set right padding to the Threshold text
					svg.selectAll("g.tick text").attr("dx", isRTL ? "0.25rem" : "-0.25rem");

					//Set  the Threshold text
					svg.selectAll("g.tick text").attr("style", "text-anchor: end; text-align: right");

					//Set StrokeWidth of the Domain
					svg.selectAll(".yAxisSvgDomainTick").attr("style", "stroke-width: 3px; fill: none");

					//Set width of the ticks for every Third Element
					svg.selectAll("g.tick line")
						.attr("x2", function(d,index){
							if ( this.getLabel(threshold, d) || index % iCountOfLargerTick == 0){
								return isRTL ? iLargerTickWidth : -iLargerTickWidth;
							} else {
								return isRTL ? iSmallerTickWidth : -iSmallerTickWidth;
							}
						}.bind(this));

					//Set StrokeWidth of the ticks for every Third Element and Thresholds
					svg.selectAll("g.tick line")
						.style("stroke-width", function(d, index){
							if ( this.getLabel(threshold, d) ||  index % iCountOfLargerTick == 0){
								return "1.5px";
							} else {
								return "1px";
							}
						}.bind(this));

					//Set respective classes based on threshold and inner Ticks
					svg.selectAll("g.tick text")
						.attr("class", function(d, index){
							if (this.getLabel(threshold, d)){
								return "sapUiHintText sapGanttTimeHeaderSvgText";
							} else if ( index % iCountOfLargerTick == 0) {
								return "sapUiHintText sapGanttTimeHeaderSvgText";
							}
						}.bind(this));

					//Hide the Domain tick
					// svg.selectAll(".yAxisSvgDomainTick")
					// .attr("d", function(d, index){
					// 	return d3.select(this).attr("d").replaceAll(iLargerTickWidth,0);
					// });

					//Hide the First/Last tick
					// svg.selectAll("g.tick")
					// .style("opacity", function(d, index){
					// 	var sTranfsorm = d3.select(this).attr("transform");
					// 	if (sTranfsorm.includes("0,"+iContainerHeight) || sTranfsorm.includes("0,0")) {
					// 		return 0;
					// 	} else {
					// 		return d3.select(this).style("opacity");
					// 	}
					// });

					//Resize Observer to detect f there has been any resize on the parent Container of the Control
					//this._oResizeObserver.observe(jQuery("#"+this.getId()+ "-yAxisControl").parent()[0]);
				}
			}.bind(this), 0);
		},
		exit: function () {
			if (this.oResizeObserver) {
				this.oResizeObserver.disconnect();
			}
			this.oResizeObserver = null;
		},
		renderer : function (oRM, oControl) {
            oRM.openStart("div" , oControl.getId() + "-yAxisControl");
			oRM.addClass("yAxisControl");
			oRM.openEnd();

			oRM.openStart("svg", oControl.getId() + "-yAxisControlSvg");
			oRM.style("vertical-align", "top");
			oRM.openEnd();

			oRM.close("svg");
			oRM.close("div");

		},//Update the threshold aggregation.
		updateThresholds : function () {
			this.updateAggregation("thresholds");
			this.getParent().invalidate();
		},//Function to handle resize of the Cell
		handleResize: function() {
			this.getParent().invalidate();
		},//Process text for truncating
		_processTextForTruncation: function(sSourceText,isRTL) {
			var iTextLength = 12;
			if (iTextLength == 0) {
				return;
			}
			var bSourceTextLenMore = (isRTL
				? ("..." + sSourceText.slice(0, iTextLength).trim())
				: (sSourceText.slice(0, iTextLength).trim() + "..."));
			return (sSourceText.length > iTextLength)
						? bSourceTextLenMore
						: sSourceText;
		},//Function to return label of the threshold
		getLabel: function(threshold, d) {
			return Object.keys(threshold).find(function(label) {
				return threshold[label] === d;
			});
		}
	});
});