/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Core",
	"sap/ui/core/Control",
	"sap/ui/table/library",
	"sap/ui/table/utils/TableUtils",
	"sap/gantt/simple/GanttExtension",
	"sap/ui/table/rowmodes/Fixed",
	'./GanttUtils',
	"sap/ui/core/RenderManager",
	"sap/gantt/simple/InnerGanttChartRenderer"
], function (
	Core,
	Control,
	tableLibrary,
	TableUtils,
	GanttExtension,
	FixedRowMode,
	GanttUtils,
	RenderManager
) {
	"use strict";

	/**
	 * Inner Gantt Chart, the purpose for this class is to decouple the rendering cycle with Table in GanttChartWithTable.
	 * Using it in application is prohibited and not supported.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * Inner Gantt Chart is responsible for rendering the content of gantt chart
	 *
	 * @extend sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @private
	 * @alias sap.gantt.simple.InnerGanttChart
	 */
	var InnerGanttChart = Control.extend("sap.gantt.simple.InnerGanttChart", {
		metadata: {
			library: "sap.gantt",
			events: {
				/**
				 * Fired when gantt gets rendered.
				 */
				ganttReady: {
					parameters: {
						/**
						 * True if there are visible rendered shapes.
						 */
						hasRenderedShapes: {type: "boolean"},
						/**
						 * The total count of rendered shapes.
						 */
						totalRenderedShapes: {type: "int"},
						/**
						 * True if the methods inside this event are to be supressed.
						 */
						supressEvent: {type: "boolean"}
					}
				},
				/**
				 * Fired when gantt is rendered for base group transform calculation
				 * @private
				 */
				 _afterGanttRendered: {}
			}
		}
	});



	InnerGanttChart.prototype.getDomRef = function(sSuffix) {
		var oParent = this.getParent(),
			sDomSuffix;
		if (sSuffix) {
			sDomSuffix = "-" + sSuffix;
		} else {
			sDomSuffix = "-cnt";
		}
		if (oParent) {
			return window.document.getElementById(oParent.getId() + sDomSuffix);
		}
		return null;
	};

	InnerGanttChart.prototype.invalidate = function(){
		//do nothing
		var oGantt = this.getParent();
		oGantt._oInnerGanttRenderPromise.then( function() {
			oGantt._bInnerGanttRenderPromiseResolved = true;
			var oUIArea = this.getUIArea();
			if (oUIArea) {
				oUIArea.addInvalidatedControl(this);
			}
		}.bind(this));
	};

	InnerGanttChart.prototype.hasRenderedShapes = function () {
		return this.$("svg").find(".sapGanttChartShapes").children().length > 0;
	};

	InnerGanttChart.prototype.getTotalRenderedShapes = function () {
		return this.$("svg").find(".sapGanttChartShapes").children().length;
	};

	InnerGanttChart.prototype.resolveWhenReady = function (bWithShapes) {
		return new Promise(function (resolve) {
			var fnHandleEvent = function handleEvent (oEvent) {
				var oGantt = this.getParent(), oTable = oGantt.getTable();
				GanttUtils.setTableRowMode(oTable);
				if (oGantt._enableOptimisation && !oGantt.getTable().getRowMode().isA("sap.ui.table.rowmodes.Fixed")) {
					if (oGantt.getTable().getRowMode() && oGantt.getTable().getRowMode().getRowContentHeight()) {
						oGantt.getTable().setRowMode(new FixedRowMode({
							rowContentHeight: oGantt.getTable().getRowMode().getRowContentHeight()
						}));
					} else {
						oGantt.getTable().setRowMode(new FixedRowMode());
					}
				}
				var bRowMode;
				if (oTable.getRowMode()) {
					bRowMode = oGantt.getTable().getRowMode().isA("sap.ui.table.rowmodes.Auto") && oGantt.getSyncedControl().getRowStates().length < (oGantt.getTable().getRows().length - 1 + TableUtils.getHeaderRowCount(oGantt.getTable()));
				} else {
					/**
					 * @deprecated As of version 1.119
					 */
					bRowMode = oGantt.getTable().getVisibleRowCountMode() === tableLibrary.VisibleRowCountMode.Auto && oGantt.getSyncedControl().getRowStates().length < (oGantt.getTable().getVisibleRowCount() + TableUtils.getHeaderRowCount(oGantt.getTable()));
				}
				if (bWithShapes && !oEvent.getParameter("hasRenderedShapes") ||
					( // in Auto mode table might sync prematurely with header rows only, so wait for the sync of all visible rows
						bRowMode
					)
				) {
					this.attachEventOnce("ganttReady", fnHandleEvent);
				} else {
					resolve();
				}
			}.bind(this);
			var aInvalidatedControlIDs = Object.keys(this.getUIArea().mInvalidatedControls);
			if (aInvalidatedControlIDs.indexOf(this.getParent().getId()) > -1 || aInvalidatedControlIDs.indexOf(this.getParent().getTable().getId()) > -1 ) {
				// Gantt is currently invalidated
				this.attachEventOnce("ganttReady", fnHandleEvent);
			} else if ((!bWithShapes && this.getDomRef("svg")) || (bWithShapes && this.hasRenderedShapes())) {
				resolve();
			} else {
				this.attachEventOnce("ganttReady", fnHandleEvent);
			}
		}.bind(this));
	};

	InnerGanttChart.prototype._updateRowsHoverState = function() {
		var oGantt = this.getParent();

		// update hover on rows that were just rerendered and their event handlers would not catch latest mouseleave event
		// setTimeout is used because otherwise :hover returns zero elements
		setTimeout(function() {
			oGantt.$("svg").find("rect.sapGanttBackgroundSVGRow:hover").each(function() {
				var oExtension = oGantt._getPointerExtension(),
					iIndex = oExtension._getRowIndexFromElement(this);

				oGantt.getSyncedControl().syncRowHover(iIndex, true);
			});
			oGantt.$("svg").find("rect.sapGanttBackgroundSVGRow:not(:hover)").each(function() {
				var oExtension = oGantt._getPointerExtension(),
					iIndex = oExtension._getRowIndexFromElement(this);

				oGantt.getSyncedControl().syncRowHover(iIndex, false);
			});
		}, 0);
	};

	InnerGanttChart.prototype.onBeforeRendering = function (oEvent) {
		performance.mark("InnerGanttChart--start");
		if (!this.getParent()._bPreventInitialRender || this.getParent()._bRenderGanttClone || this.getParent()._bRenderFullScreenGantt) {
			this.getParent()._bRenderFullScreenGantt = false;
			// Visible Horizon Change --> Redraw -> Update scroll width -> Render all shapes -> Scroll Gantt
			this.getParent()._getScrollExtension().jumpToVisibleHorizon("initialRender");
		}
	};

	InnerGanttChart.prototype.onAfterRendering = function (oEvent) {
		var oGantt = this.getParent();

		oGantt._updateVsbContainers();

		oGantt._syncContainerGanttCharts("initialRender", oEvent);

		var oRm = new RenderManager();
		this.getRenderer().renderRelationships(oRm, oGantt);
		oRm.destroy();
		this.fireEvent("_afterGanttRendered");
		// Update shape selections from SelectionModel
		oGantt._updateShapeSelections(oGantt.getSelectedShapeUid(), []);

		//update shape highlights from HighlightModel
		oGantt.updateShapeHighlights(oGantt.getHighlightedShapeUid(), []);

		// update shape connect effect when vertical scroll
		oGantt._getConnectExtension().updateShapeConnectEffect(oGantt);

		this._updateRowsHoverState();
		GanttExtension.attachEvents(oGantt);

		this.fireGanttReady({
			hasRenderedShapes: this.hasRenderedShapes(),
			totalRenderedShapes: this.getTotalRenderedShapes()
		});

		performance.mark("InnerGanttChart--end");
	};

	return InnerGanttChart;

}, true);
