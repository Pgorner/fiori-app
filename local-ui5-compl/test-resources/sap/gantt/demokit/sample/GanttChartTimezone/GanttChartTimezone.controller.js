sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/core/mvc/Controller",
	"sap/gantt/misc/Format",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/date/UI5Date",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/base/i18n/date/TimezoneUtils",
	"sap/gantt/config/Locale",
	"sap/base/util/ObjectPath",
	"sap/gantt/misc/Utility",
	"sap/ui/core/IconPool",
	"sap/gantt/config/TimeHorizon"
], function ($, Controller, Format, JSONModel, UI5Date, GanttChartConfigurationUtils, TimezoneUtils, GanttLocale, ObjectPath, Utility, IconPool, TimeHorizon) {
	"use strict";

	var dayInMilli = 60 * 60 * 24 * 1000;

	var addDays = function (date, days) {
		return new Date(date.getTime() + (days * dayInMilli));
	};

	function getTimezoneOffset(oDate, sTimezone) {
		var oLocalTime = new Date(oDate.toLocaleString("en-US", { timeZone: sTimezone }));
		var UTCTime = new Date(oDate.toLocaleString("en-US", { timeZone: "UTC" }));
		return Math.round((oLocalTime.getTime() - UTCTime.getTime()) / (60 * 1000));
	}

	function hasDST(oDate, sTimezone) {
		var oLocalTime = new Date(oDate.getTime());
		var iYear = oDate.getFullYear();

		var iStart = getTimezoneOffset(new Date(iYear, 0, 1), sTimezone);
		var iEnd = getTimezoneOffset(new Date(iYear, 6, 1), sTimezone);
		var iMid = getTimezoneOffset(oLocalTime, sTimezone);

		return iStart !== iEnd && Math.max(iStart, iEnd) === iMid;
	}

	function compressTicks(ticks) {
		var lastTick = null;

		return ticks.filter(function (_, iIndex) {
			if (iIndex === 0) {
				return true;
			}

			lastTick = lastTick || ticks[iIndex - 1];
			var oSmallTick = ticks[iIndex];

			if ((oSmallTick.value - lastTick.value) > 12) {
				lastTick = null;
				return true;
			}

			return false;
		});
	}


	var horizonStart = new Date();
	horizonStart.setHours(0, 0, 0, 0);

	var offsetDays = 7;

	var tHorizon = {
		start: horizonStart,
		end: addDays(horizonStart, offsetDays)
	};

	var vHorizon = {
		start: tHorizon.start,
		end: addDays(tHorizon.start, offsetDays)
	};

	var children = Array.from(Array(10).keys()).map(function (key, index) {
		return {
			id: "id-" + key,
			name: "Row " + key,
			"chevrons": [{
				id: "shape-" + key + "-1",
				startTime: addDays(tHorizon.start, index),
				endTime: addDays(tHorizon.start, index + 4),
				fill: "#666"
			}, {
				id: "shape-" + key + "-2",
				startTime: addDays(tHorizon.start, index + 6),
				endTime: addDays(tHorizon.start, index + 7),
				fill: "#999"
			}, {
				id: "shape-" + key + "-3",
				startTime: addDays(tHorizon.start, index - 6),
				endTime: addDays(tHorizon.start, index - 7),
				fill: "#333"
			}
			]
		};
	});

	var Timezones = Intl.supportedValuesOf('timeZone').map(function (timezone) {
		return {
			key: timezone,
			text: timezone
		};
	});

	var oData = {
		root: {
			children: children,
			tHorizon: tHorizon,
			currentVHorizon: {
				start: vHorizon.start,
				end: vHorizon.end
			},
			Timezones: Timezones,
			Timezone: null,
			ConfigurationTimezone: GanttChartConfigurationUtils.getTimezone(),
			locale: {
				timezone: null
			}
		}
	};

	var dateInfo = {
		_utc: {
			title: "UTC Timezone",
			timezone: "UTC"
		},
		selected: {
			title: "Selected Timezone (Custom)",
			timezone: null,
			priority: 2
		},
		config: {
			title: "Configuration Timezone (FLP)",
			timezone: GanttChartConfigurationUtils.getTimezone(),
			priority: 1
		},
		local: {
			title: "System Timezone",
			timezone: TimezoneUtils.getLocalTimezone(),
			priority: 0,
			"static": true
		}
	};

	return Controller.extend("sap.gantt.sample.GanttChartTimezone.GanttChartTimezone", {
		onInit: function () {
			var oModel = new JSONModel(oData);
			oModel.setSizeLimit(240000);
			this.getView().setModel(oModel);
			this.oModel = oModel;
			this.oGanttChart = this.getView().byId("gantt");
			this.oChartArea = this.getView().byId("chartArea");
			this.oInnerGantt = this.oGanttChart.getInnerGantt();
			this.oDSTOffsetMap = new Map();

			var oDatesModel = new JSONModel({
				contents: Object.keys(dateInfo)
					.filter(function (key) {
						return !key.startsWith("_");
					})
					.map(function (key) {
						var dateItem = dateInfo[key];

						return {
							id: key,
							title: dateItem.title,
							timezone: dateItem.timezone,
							priority: dateItem.priority,
							"static": dateItem.static
						};
					})
			});

			this.getView().setModel(oDatesModel, "dates");
			this.oDatesModel = oDatesModel;

			this.initLocale("selected", this.oModel.getProperty("/root/Timezone"));

			var oTimezoneInput = this.byId("timezoneInput");
			var oFLPTimezoneInput = this.byId("flpTimezoneInput");

			function timezoneFilterFunction(sTerm, oItem) {
				return oItem.getText().match(new RegExp(sTerm, "i"));
			}

			oTimezoneInput.setFilterFunction(timezoneFilterFunction);
			oFLPTimezoneInput.setFilterFunction(timezoneFilterFunction);

			function selectOnClick(oEvent) {
				if (oEvent.target.select) {
					oEvent.target.select();
				}
			}

			oTimezoneInput.attachBrowserEvent("click", selectOnClick);
			oFLPTimezoneInput.attachBrowserEvent("click", selectOnClick);

			this.oGanttChart.attachEvent("visibleHorizonUpdate", function (oEvent) {
				var oHorizon = oEvent.getParameter("currentRenderedVisibleHorizon");
				var sType = oEvent.getParameter("type");

				this.oModel.setProperty("/root/currentVHorizon", {
					start: Format.abapTimestampToDate(oHorizon.getStartTime()),
					end: Format.abapTimestampToDate(oHorizon.getEndTime())
				});

				if (sType === "InitialRender" || sType === "ZoomLevelChanged") {
					this.rerenderTimeline();
				}
			}.bind(this));

			oTimezoneInput.attachEvent("suggestionItemSelected", function (oEvent) {
				var sTimezone = oEvent.getParameter("selectedItem").getText();

				this.initLocale("selected", sTimezone);
				this.oModel.setProperty("/root/Timezone", sTimezone);
			}.bind(this));

			oFLPTimezoneInput.attachEvent("suggestionItemSelected", function (oEvent) {
				var sTimezone = oEvent.getParameter("selectedItem").getText();

				if (TimezoneUtils.isValidTimezone(sTimezone)) {
					GanttChartConfigurationUtils.setTimezone(sTimezone);
					this.initLocale("config", sTimezone);
					this.oModel.setProperty("/root/ConfigurationTimezone", sTimezone);
				}
			}.bind(this));

			this._oZoomStrategy = this.oGanttChart.getAxisTimeStrategy();
		},
		onTimezoneChange: function (oEvent) {
			var sTimezone = oEvent.getParameter("newValue");

			if (sTimezone.length <= 0) {
				this.initLocale("selected", null);
				this.oModel.setProperty("/root/Timezone", null);
			}
		},
		onFLPTimezoneChange: function (oEvent) {
			var sTimezone = oEvent.getParameter("newValue");

			if (sTimezone.length <= 0) {
				GanttChartConfigurationUtils.setTimezone(null);
				this.initLocale("config", GanttChartConfigurationUtils.getTimezone());
				this.oModel.setProperty("/root/ConfigurationTimezone", null);
			}
		},
		onAfterRendering: function () {
			this.renderTimeline();
		},
		_onTableRowsUpdated: function () {
			//
		},
		dateToAbapTimestamp: function (oTime) {
			return Format.dateToAbapTimestamp(oTime);
		},
		formatFill: function (oInput) {
			return oInput.fill;
		},
		renderTimeline: function () {
			d3.select("#" + this.oChartArea.sId)
				.style({
					"box-sizing": "border-box"
				});

			this.renderVerticalLine();
			this.rerenderTimeline();
		},
		rerenderTimeline: function () {
			this.oInnerGantt.resolveWhenReady(true).then(this.computeD3.bind(this));
		},
		renderVerticalLine: function () {
			var oChartArea = d3.select("#" + this.oChartArea.sId);

			oChartArea.select(".remove").remove();

			this.oVerticalLine = oChartArea
				.style("position", "relative")
				.append("div")
				.attr("class", "remove")
				.style("position", "absolute")
				.style("z-index", "1")
				.style("width", "1px")
				.style("top", "24px")
				.style("left", "0px")
				.style("background", "#40b0f0")
				.style("opacity", 0);

			function updateCursorPosition(iLeft) {
				var oPointerExtension = this.oGanttChart._getPointerExtension();
				var oAxisTime = this.oGanttChart.getAxisTime();

				var iHeaderOffset = jQuery(".sapGanttChartHeaderSvg").offset();
				var oHsbRef = jQuery(this.oGanttChart.getDomRef("hsb"));
				var iWidth = oHsbRef.width();

				var iCurrentLeft = oHsbRef.scrollLeft();
				var iWindow = iWidth + iCurrentLeft;

				var oStartTimestamp = oAxisTime.viewToTime(iCurrentLeft).getTime();
				var oEndTimestamp = oAxisTime.viewToTime(iWindow).getTime();

				var oDate = this.oScale.invert(iLeft);
				var iExpectLeft = oAxisTime.timeToView(oDate);
				var iExpectedTimestamp = oDate.getTime();

				if (oStartTimestamp > iExpectedTimestamp) {
					this._oZoomStrategy.setVisibleHorizon(
						this._oZoomStrategy._completeTimeHorizon(new TimeHorizon({
							startTime: oDate
						}))
					);
				} else if (oEndTimestamp < iExpectedTimestamp) {
					this._oZoomStrategy.setVisibleHorizon(
						this._oZoomStrategy._completeTimeHorizon(new TimeHorizon({
							endTime: oDate
						}))
					);
				} else {
					oPointerExtension.onGanttChartMouseEvent(
						{
							type: "mousemove",
							pageX: iExpectLeft + iHeaderOffset.left,
							pageY: iHeaderOffset.top
						}
					);
				}
			}

			function updateVerticalLinePosition() {
				var iWidth = d3.select(oChartArea.node())
					.select(".domain")
					.node()
					.getBoundingClientRect().width + 24;

				var iMouseX = d3.mouse(oChartArea.node());
				var iLeft = Math.min(iWidth, Math.max(iMouseX[0], 24));

				this.oVerticalLine.style("left", iLeft + "px");
				this.oVerticalLine.style("opacity", 1);

				(updateCursorPosition.bind(this))(iLeft - 24);
			}

			oChartArea
				.on("mousemove", updateVerticalLinePosition.bind(this))
				.on("mouseover", updateVerticalLinePosition.bind(this))
				.on("mouseout", function () {
					var oPointerExtension = this.oGanttChart._getPointerExtension();

					this.oVerticalLine.style("opacity", 0);
					oPointerExtension.onGanttChartMouseEvent({ type: "mouseleave" });
				}.bind(this));
		},
		computeD3: function () {
			var oAxisTime = this._oZoomStrategy.getAxisTime();
			var oLocale = this.oGanttChart.getLocale();
			this.oScale = d3.time.scale().domain([
				oAxisTime.convertToTimezone(this.oModel.getProperty("/root/tHorizon/start")),
				oAxisTime.convertToTimezone(this.oModel.getProperty("/root/tHorizon/end"))
			]).range([0, $("#" + this.oChartArea.sId).innerWidth() - 100]).clamp(false);

			if (this.oSvg) {
				this.oSvg.remove();
			}

			var sTimezone = this.oModel.getProperty("/root/locale/timezone");
			var oTimeLineOption = this._oZoomStrategy.getTimeLineOption();

			var largeInterval = oTimeLineOption.largeInterval || { unit: 'd3.time.day', span: 1 };
			var smallInterval = oTimeLineOption.smallInterval || { unit: 'd3.time.hour', span: 1 };

			var oUpperRowFormatter = this._oZoomStrategy.getUpperRowFormatter(),
				oLowerRowFormatter = this._oZoomStrategy.getLowerRowFormatter();

			var oLargeTicks = compressTicks(this.oScale.ticks(ObjectPath.get(largeInterval.unit).range, largeInterval.span).map(function (oDate) {
				var date = oAxisTime.offsetTimezoneDiff(oDate);

				return {
					date: date,
					label: Utility.getLowerCaseLabel(oLocale.getFormattedDate(oUpperRowFormatter, date)),
					value: this.oScale(date)
				};
			}.bind(this), {}));

			var oSmallTicks = compressTicks(this.oScale.ticks(ObjectPath.get(smallInterval.unit).range, smallInterval.span).map(function (oDate) {
				var date = oAxisTime.offsetTimezoneDiff(oDate);

				return {
					date: date,
					label: Utility.getLowerCaseLabel(oLocale.getFormattedDate(oLowerRowFormatter, date)),
					value: this.oScale(date)
				};
			}.bind(this)));

			this.oSvg = d3.select("#" + this.oChartArea.sId)
				.append("svg")
				.attr("width", "100%")
				.attr("height", "300px");

			this.oVerticalLine
				.style("height", (300 - 56) + "px");

			var oSmallAxis = d3.svg.axis()
				.scale(this.oScale)
				.tickSize(12, 12, 2)
				.tickValues(oSmallTicks.map(function (value) {
					return value.date;
				}))
				.tickFormat(function (_, iIndex) {
					return oSmallTicks[iIndex].label;
				});

			var oLargeAxis = d3.svg.axis()
				.orient("top")
				.scale(this.oScale)
				.tickSize(10, 10, 2)
				.tickValues(oLargeTicks.map(function (value) {
					return value.date;
				}))
				.tickFormat(function (_, iIndex) {
					return oLargeTicks[iIndex].label;
				});

			this.oSvg.append("g")
				.attr("transform", "translate(24,174)")
				.attr("class", "axis s-axis")
				.call(oSmallAxis);

			this.oSvg.append("g")
				.attr("transform", "translate(24,176)")
				.attr("class", "axis l-axis")
				.call(oLargeAxis);

			this.oSvg.selectAll("g.l-axis g.tick line")
				.style("stroke-width", "2px")
				.attr("class", "sapGanttTimeHeaderSvgPath");

			this.oSvg.selectAll("g.s-axis g.tick line")
				.style("stroke-width", "2px")
				.attr("class", "sapGanttTimeHeaderSvgPath");

			this.oSvg.selectAll("g.l-axis .domain")
				.attr("class", "domain sapGanttTimeHeaderSvgTextMedium");

			this.oSvg.selectAll("g.s-axis .domain")
				.attr("class", "domain sapGanttTimeHeaderSvgTextMedium");

			this.oSvg.selectAll("g.l-axis g.tick text")
				.style("text-anchor", "start")
				.style("transform", "rotate(-65deg) translate(20px, 10px)")
				.attr("class", "sapGanttTimeHeaderSvgText");

			this.oSvg.selectAll("g.s-axis g.tick text")
				.style("text-anchor", "end")
				.style("transform", "rotate(-65deg) translate(-20px, -10px)")
				.attr("class", "sapGanttTimeHeaderSvgTextMedium")
				.append("tspan")
				.attr("dx", 6)
				.text(function (_, iIndex) {
					var oSmallTick = oSmallTicks[iIndex];

					if (hasDST(oSmallTick.date, sTimezone)) {
						var oInfo = IconPool.getIconInfo("sap-icon://future");
						return oInfo.content;
					}

					return undefined;
				})
				.style('fill', "#E6600D")
				.style("font-family", IconPool.getIconInfo("sap-icon://future").fontFamily);

		},
		initLocale: function (sKey, sTimezone) {
			var aContents = this.oDatesModel.getProperty("/contents");

			if (!sTimezone || TimezoneUtils.isValidTimezone(sTimezone)) {
				for (var index = 0; index < aContents.length; index++) {
					var content = aContents[index];

					if (content.id === sKey) {
						content.timezone = sTimezone;
					}
				}

				this.oDatesModel.setProperty("/contents", aContents);
				this.computeLocale();
			}
		},
		computeLocale: function () {
			var oContent = this.oDatesModel.getProperty("/contents").filter(function (oContent) {
				return oContent.priority >= 0 && oContent.timezone;
			}).sort(function (oContent, oNextContent) {
				return oNextContent.priority - oContent.priority;
			})[0];

			if (oContent) {
				if (oContent.static) {
					this.oGanttChart.setLocale(
						new GanttLocale({
							timeZone: null
						})
					);
				} else {
					this.oGanttChart.setLocale(
						new GanttLocale({
							timeZone: oContent.timezone
						})
					);
				}

				this.oModel.setProperty("/root/locale/timezone", oContent.timezone);

				if (this.oScale) {
					this.oInnerGantt.resolveWhenReady(false).then(this.computeD3.bind(this));
				}
			}
		},
		getSelectedTimezone: function (sId) {
			var aContents = this.oDatesModel.getProperty("/contents");

			for (var index = 0; index < aContents.length; index++) {
				var oContent = aContents[index];

				if (oContent.id === sId) {
					return oContent.timezone;
				}
			}

			return undefined;
		},
		dateFormatter: function (sTimezone, oDate) {
			if (sTimezone) {
				var oUI5Date = new UI5Date([oDate], sTimezone);

				return oUI5Date.toString();
			}

			return "--";
		},
		highlightFormatter: function (sTimezone) {
			var oLocale = this.oGanttChart.getLocale();
			var sCurrentTimezone = oLocale.getTimeZone();

			return (sTimezone && (sTimezone === sCurrentTimezone)) ? "Success" : "None";
		}
	});
});
