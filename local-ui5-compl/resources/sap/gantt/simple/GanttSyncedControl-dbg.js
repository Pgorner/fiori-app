/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

// Provides control sap.gantt.simple.GanttSyncedControl.
sap.ui.define([
	"sap/gantt/library",
	"sap/ui/core/Control",
	"sap/ui/Device",
	"sap/ui/core/Core",
	"./GanttUtils",
	"sap/ui/core/RenderManager"
], function (library, Control, Device, Core, GanttUtils, RenderManager) {
	"use strict";

	var GanttSyncedControl = Control.extend("sap.gantt.simple.GanttSyncedControl", /** @lends sap.gantt.simple.GanttSyncedControl.prototype */ {
		metadata: {
			library: "sap.gantt",
			properties: {
				innerWidth: {type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: "100%"}
			}
		},
		renderer: {
			apiVersion: 2,    // enable in-place DOM patching
			render: function(oRm, oControl) {
				// parent chain -> Splitter -> GanttChartWithTable
				var oGantt = oControl.getParent().getParent();

				oRm.openStart("div", oControl);
				oRm.class("sapGanttBackground");
				oRm.openEnd();

				oRm.openStart("div", oGantt.getId() + "-ganttBGFlexContainer");
				oRm.class("sapGanttBackgroundFlexContainer");
				oRm.openEnd();
				oRm.openStart("div", oGantt.getId() + "-ganttBGContainerWithScrollBar");
				oRm.class("sapGanttBackgroundContainer").class("sapGanttBackgroundScrollbar");
				oRm.openEnd();

				// Table container
				oRm.openStart("div", oGantt.getId() + "-ganttSyncedControlTable");
				oRm.class("sapGanttBackgroundTable");
				oRm.openEnd();

				// Gantt Chart Header
				oControl.renderGanttHeaderPlaceholder(oRm, oGantt);

				// Body SVG
				oControl.renderGanttBodyPlaceholder(oRm, oGantt);

				// render the HSB container, the actual HSB will be rendered in onAfterRendering
				oControl.renderHorizontalScrollbarContainer(oRm, oGantt);

				oRm.close("div"); // Close table container

				oRm.close("div"); // Close gantt background container

				// Vertical scrollbar container
				oControl.renderVerticalScrollbarContainer(oRm, oControl, oGantt);

				oRm.close("div"); // Close flex container
				oRm.close("div"); // Close root node
			}
		}
	});

	GanttSyncedControl.prototype.init = function() {
		this.oSyncInterface = null;
		this.state = {
			rows: [], /* row:{height:int, selected:boolean, hovered:boolean} */
			innerVerticalScrollPosition: 0,
			horizontalScrollPosition: 0,
			layout: {
				top: 0,
				headerHeight: 0,
				contentHeight: 0
			}
		};
		this._bRowsHeightChanged = false;
		this._bAllowContentScroll = true;
	};

	GanttSyncedControl.prototype.onAfterRendering = function() {
		var mDom = this.getDomRefs();

		var oGantt = this.getParent().getParent();

		if (this.oSyncInterface) {
			var oRm = new RenderManager();
			this.oSyncInterface.renderHorizontalScrollbar(oRm, oGantt.getId() + "-hsb", oGantt.getContentWidth());
			oRm.flush(mDom.hsbContainer);
		}

		if (this.oSyncInterface && mDom.content && mDom.vsbContainerContent) {
			this.oSyncInterface.registerVerticalScrolling({
				wheelAreas: [mDom.content],
				touchAreas: [mDom.content]
			});

			this.oSyncInterface.placeVerticalScrollbarAt(mDom.vsbContainerContent);
		}

		this.updateScrollPositions();
		//Updating layoutdata
		if (oGantt.getParent().isA("sap.gantt.simple.GanttChartContainer") && oGantt.getParent().getToolbar()) {
			oGantt.getParent().getToolbar()._oDisplayTypeSegmentedButton.setSelectedKey(oGantt.getDisplayType());
		}
		oGantt._setupDisplayType();
	};

	GanttSyncedControl.prototype.renderGanttHeaderPlaceholder = function(oRm, oGantt) {
		// Gantt Chart Header
		oRm.openStart("div", oGantt.getId() + "-ganttHeader");
		oRm.style("height", (this.state.layout.top + this.state.layout.headerHeight) + "px");
		oRm.attr("data-sap-ui-related", oGantt.getId());
		if (!oGantt.getShowGanttHeader()) {
			oGantt.getTable().destroyExtension();
			oGantt.getTable().setColumnHeaderVisible(false);
		} else {
			oGantt.getTable().setColumnHeaderVisible(true);
		}
		oRm.class("sapGanttChartWithTableHeader");
		oRm.openEnd();
		oRm.close("div");
	};

	GanttSyncedControl.prototype.renderGanttBodyPlaceholder = function(oRm, oGantt) {
		// Content
		oRm.openStart("div", oGantt.getId() + "-sapGanttBackgroundTableContent");
		oRm.class("sapGanttBackgroundTableContent");
		oRm.style("height", this.state.layout.contentHeight + "px");
		oRm.openEnd();
		oRm.openStart("div", oGantt.getId() + "-gantt");
		oRm.attr("data-sap-ui-related", oGantt.getId());
		oRm.class("sapGanttChartContentBody");
		oRm.class("sapGanttBackgroundSVG");
		oRm.openEnd();

		//Render The SVGDefs within the main GanttChartWithTable SVG
		//this.renderSvgDefs(oRm, oGantt);
		this.renderGanttChartCnt(oRm, oGantt);

		oRm.close("div");

		oRm.close("div");
	};

	/**
	 * Vertical scroll container is a DIV placeholder, after rendering, Table/TreeTable will place the actual scroll bar here.
	 *
	 * @param {sap.ui.core.RenderManager} oRm Render manager
	 * @param {sap.gantt.simple.GanttSyncedControl} oControl the replica synced control
	 */
	GanttSyncedControl.prototype.renderVerticalScrollbarContainer = function(oRm, oControl, oGantt) {
		oRm.openStart("div", oGantt.getId() + "-sapGanttVerticalScrollBarContainer");
		oRm.class("sapGanttBackgroundVScrollContainer");
		oRm.openEnd();
		oRm.openStart("div");
		oRm.class("sapGanttBackgroundVScrollContentArea");
		oRm.style("margin-top", (oControl.state.layout.top + oControl.state.layout.headerHeight) + "px");
		oRm.openEnd().close("div");
		oRm.close("div");
	};

	GanttSyncedControl.prototype.syncWith = function (oTable) {
		var oExpandModel = oTable.getParent()._oExpandModel;
		var iheaderHeightPrevious = 0;

		oTable._enableSynchronization().then(function (oSyncInterface) {

			this.oSyncInterface = oSyncInterface;

			oSyncInterface.rowCount = function (iCount) {
				var iOldCount = this.state.rows.length;
				var i;

				if (iOldCount < iCount) {
					for (i = 0; i < iCount - iOldCount; i++) {
						this.state.rows.push({
							height: 0,
							selected: false,
							hovered: false
						});
					}
				} else if (iOldCount > iCount) {
					for (i = iOldCount - 1; i >= iCount; i--) {
						this.state.rows.pop();
					}
				}
			}.bind(this);

			oSyncInterface.rowSelection = function (iIndex, bSelected) {
				if (this.state.rows[iIndex]) {
					this.state.rows[iIndex].selected = bSelected;
					GanttUtils.updateGanttRows(this, this.state.rows, iIndex);
				}
			}.bind(this);

			oSyncInterface.rowHover = function (iIndex, bHovered) {
				if (this.state.rows[iIndex]) {
					this.state.rows[iIndex].hovered = bHovered;
					GanttUtils.updateGanttRows(this, this.state.rows, iIndex);
				}
			}.bind(this);

			oSyncInterface.rowHeights = function (aHeights) {
				var oGantt = this.getParent().getParent();
				var aRows = oGantt.getTable().getRows();

				for (var i = 0; i <= aHeights.length - 1; i++) {
					if (oGantt.oRowsCustomHeight) {
						var sRowId = aRows[i].getAggregation("_settings").getRowId();
						//check and update the row's height with the custom row height if it's given and is more than the default row height
						if (oGantt.oRowsCustomHeight.hasOwnProperty(sRowId) && oGantt.oRowsCustomHeight[sRowId] > aHeights[i]) {
							aHeights[i] = oGantt.oRowsCustomHeight[sRowId];
						}
					}
					aHeights[i] = oExpandModel.getRowHeightByIndex(oTable, i, aHeights[i]);
				}

				this.setRowsHeightChanged(false);
				var iRowYCenter = 0;

				aHeights.forEach(function (iHeight, iIndex) {
					if (!this.state.rows[iIndex]) {
						this.state.rows[iIndex] = {};
					}
					if (this.state.rows[iIndex].height !== iHeight) {
						this.setRowsHeightChanged(true);
					}

					iRowYCenter += iHeight;

					this.state.rows[iIndex].height = iHeight;
					this.state.rows[iIndex].rowYCenter = iRowYCenter - (iHeight / 2);
				}.bind(this));

				if ((this.getRowsHeightChanged() || oGantt._bExpandToggled) && oGantt.getDisplayType() !== library.simple.GanttChartWithTableDisplayType.Table) {
					// invalidate because Table can resize by its ResizeHandler and it doesn't invalidate Gantt nor fire _rowsUpdated event
					oGantt.getInnerGantt().invalidate();
				}

				return aHeights;
			}.bind(this);

			oSyncInterface.innerVerticalScrollPosition = function (iScrollPosition) {
				this.state.innerVerticalScrollPosition = iScrollPosition;
				this.updateScrollPositions();
			}.bind(this);

			oSyncInterface.layout = function (mLayoutData) {
				this.state.layout = mLayoutData;
				this.updateLayout();
				var oGantt = this.getParent().getParent();
				var mDom = this.getDomRefs();
				var isResizing = false;
				/**
				 * disabling header rerendering while resizing
				 * to avoid rerendering of resize container in header.
				 */
				if (oGantt._getResizeExtension) {
					isResizing = oGantt._getResizeExtension().isResizing();
				}
				var iHeaderHeight = mDom.header.style.height.split("px")[0];
				if (oGantt) {
					if (parseInt(iHeaderHeight) !== iheaderHeightPrevious && !isResizing) {
							iheaderHeightPrevious = parseInt(iHeaderHeight);
							oGantt.getAggregation("_header").renderElement();
							// Align chart with header when new variant is selected
							if (oGantt._getScrollExtension && oGantt._getScrollExtension.mOffsetWidth) {
								oGantt._getScrollExtension().scrollGanttChartToVisibleHorizon();
							}
						}
						if (oGantt.getChartOverflowToolbar()) {
							oGantt.getChartOverflowToolbar().setWidth(mDom.header.clientWidth + "px");
						}
					}
				}.bind(this);
			this.invalidate();
		}.bind(this));
	};

	GanttSyncedControl.prototype.renderHorizontalScrollbarContainer = function(oRm, oGantt) {
		oRm.openStart("div", oGantt.getId() + "-horizontalScrollContainer");
		oRm.class("sapGanttHSBContainer");
		if (oGantt.getAxisTimeStrategy().isA("sap.gantt.axistime.FullScreenStrategy")) {
			oRm.class("sapGanttHSbHidden");
		}
		oRm.openEnd();
		oRm.close("div");
	};

	GanttSyncedControl.prototype.renderSvgDefs = function (oRm, oGantt) {
		var oSvgDefs = oGantt.getSvgDefs();
		if (oSvgDefs) {
			oRm.openStart("svg", oGantt.getId() + "-svg-psdef");
			oRm.attr("aria-hidden", "true");
			oRm.style("float", "left");
			oRm.style("width", "0px");
			oRm.style("height", "0px");
			oRm.openEnd();
			oRm.unsafeHtml(oSvgDefs.getDefString());
			oRm.close("svg");
		}
	};

	GanttSyncedControl.prototype.renderGanttChartCnt = function (oRm, oGantt) {
		oRm.openStart("div", oGantt.getId() + "-cnt");
		oRm.class("sapGanttChartCnt");
		oRm.style("height", "100%");
		oRm.style("width", "100%");
		oRm.openEnd();
		oRm.close("div");
	};

	GanttSyncedControl.prototype.setInnerWidth = function(sWidth) {
		this.setProperty("innerWidth", sWidth, true);
		this._toggleHSBVisibility(sWidth);
		return this;
	};

	GanttSyncedControl.prototype._toggleHSBVisibility = function(sWidth) {
		var mDom = this.getDomRefs();
		if (mDom.hsb == null || mDom.hsbContent == null) {
			return;
		}
		var bShowScrollbar = (parseFloat(sWidth) + 2) > jQuery(mDom.contentContainer).width();
		if (bShowScrollbar) {
			// set height to null to prevent inheriting 100% height, which cause hsb is invisible
			mDom.hsbContent.style.height = null;
			mDom.hsbContent.style.width = sWidth;
		} else {
			// remove the style attribute
			mDom.hsbContent.style.cssText = null;
		}
	};

	GanttSyncedControl.prototype.addEventListeners = function() {
		this.addScrollEventListeners();
	};

	GanttSyncedControl.prototype.addScrollEventListeners = function() {
		var that = this;

		this.oHSb.addEventListener("scroll", function(oEvent) {
			that.state.horizontalScrollPosition = oEvent.target.scrollLeft;
		});
	};

	GanttSyncedControl.prototype.updateLayout = function() {
		var mDom = this.getDomRefs();
		if (mDom) {

			mDom.header.style.height = (this.state.layout.top + this.state.layout.headerHeight) + "px";
			mDom.contentContainer.style.height = this.state.layout.contentHeight + "px";
			mDom.vsbContainerContent.style.marginTop = (this.state.layout.top + this.state.layout.headerHeight) + "px";
		}
	};

	GanttSyncedControl.prototype.updateScrollPositions = function() {
		var mDom = this.getDomRefs();
		if ((mDom && this._bAllowContentScroll) || mDom.content.scrollTop !== this.state.innerVerticalScrollPosition) {
			mDom.content.scrollTop = this.state.innerVerticalScrollPosition;
			if (mDom.content.scrollTop !== this.state.innerVerticalScrollPosition) {
				this._bAllowContentScroll = false;
			}
		}
	};

	GanttSyncedControl.prototype.setAllowContentScroll = function(bAllowed) {
		this._bAllowContentScroll = bAllowed;
	};

	GanttSyncedControl.prototype.setRowsHeightChanged = function(bRowsHeightChanged) {
		this._bRowsHeightChanged = bRowsHeightChanged;
	};

	GanttSyncedControl.prototype.getRowsHeightChanged = function(bRowsHeightChanged) {
		return this._bRowsHeightChanged;
	};

	GanttSyncedControl.prototype.scrollContentIfNecessary = function() {
		if (this._bAllowContentScroll === false) {
			this._bAllowContentScroll = true;
			this.updateScrollPositions();
		}
	};

	GanttSyncedControl.prototype.getDomRefs = function() {
		var oDomRef = this.getDomRef();
		if (!oDomRef) {
			return null;
		}

		var oHeader = oDomRef.querySelector(".sapGanttChartWithTableHeader"),
			oContentContainer = oDomRef.querySelector(".sapGanttBackgroundTableContent"),
			oContent = oContentContainer.querySelector(".sapGanttChartContentBody");

		var oVSbContainer = oDomRef.querySelector(".sapGanttBackgroundVScrollContainer"),
			oVSbContainerContent = oVSbContainer.querySelector(".sapGanttBackgroundVScrollContentArea");

		var oHSBContainer = oDomRef.querySelector(".sapGanttHSBContainer");

		var oHsb = oDomRef.querySelector(".sapUiTableHSbExternal"),
			oHsbContent = oDomRef.querySelector(".sapUiTableHSbContent");

		return {
			header              : oHeader,
			contentContainer    : oContentContainer,
			content             : oContent,
			vsbContainer        : oVSbContainer,
			vsbContainerContent : oVSbContainerContent,

			hsbContainer        : oHSBContainer,

			hsb                 : oHsb,
			hsbContent          : oHsbContent
		};
	};

	GanttSyncedControl.prototype.getRowStates = function() {
		return this.state.rows;
	};

	GanttSyncedControl.prototype.getRowHeights = function() {
		return this.state.rows.map(function(row){
			return row.height;
		});
	};

	GanttSyncedControl.prototype.syncRowSelection = function (iIndex) {
		if (iIndex > -1) {
			var bSelected = !this.state.rows[iIndex].selected;
			this.oSyncInterface.syncRowSelection(iIndex, bSelected);
		}
	};

	GanttSyncedControl.prototype.syncRowHover = function (iIndex, bHover) {
		if (iIndex > -1) {
			this.oSyncInterface.syncRowHover(iIndex, bHover);
		}
	};

	return GanttSyncedControl;
});
