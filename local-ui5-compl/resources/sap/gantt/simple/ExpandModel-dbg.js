/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/base/assert",
	"sap/ui/base/ManagedObject",
	"./AggregationUtils",
	"./GanttUtils"
],
	function(jQuery, assert, ManagedObject, AggregationUtils, GanttUtils) {
	"use strict";

	/**
	 * Creates and initializes a new ExpandModel class.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * ExpandModel manages the internal states on expand charts
	 *
	 * @extends sap.ui.base.ManagedObject
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @private
	 * @alias sap.gantt.simple.ExpandModel
	 */
	var ExpandModel = ManagedObject.extend("sap.gantt.simple.ExpandModel", /** @lends sap.gantt.simple.ExpandModel.prototype */ {
		metadata: {
			properties: {
				baseRowHeight: {type : "int", group : "Appearance", defaultValue : null}
			}
		},
		constructor : function() {
			ManagedObject.apply(this, arguments);

			/***
			 * {
			 *   "row_uid_1": [
			 *   	 {scheme: "ac_main", metadata: {rowSpan: 1, main: true, rowSpanSum: 4}},
			 *   	 {scheme: "ac_overlap", metadata: { rowSpan: 1, main: false, numberOfRows: 3}},
			 *   	 {scheme: "ac_utilization", metadata: { rowSpan: 3, main: false, numberOfRows: 1}}
			 *   ]
			 *   ...
			 * }
			 */
			this.mExpanded = {};
		}
	});

	ExpandModel.prototype.isTableRowHeightNeedChange = function(bExpanded, oTable, aSelectedIndices, oPrimaryScheme, aExpandSchemes) {
		var bExpandToggled = false;
		this.rowMaxLevelMap = {};
		var aShapeSchemeKeys = [];
		var oGantt = oTable.getParent();
		Array.isArray(aExpandSchemes) && aExpandSchemes.forEach(function(scheme){
			aShapeSchemeKeys.push(scheme.getKey());
		});
		this.oRowSpanMap = this.oRowSpanMap && Object.keys(this.oRowSpanMap).length ? this.oRowSpanMap : {};
		for (var iIndex = 0; iIndex < aSelectedIndices.length; iIndex++) {
			var iSelectedIndex = aSelectedIndices[iIndex];

			var oRowSettings = GanttUtils.getSelectedTableRowSettings(oTable, iSelectedIndex),overlayAggList;
			if (oRowSettings){
				//fetch overlay aggreagtion shapes
				overlayAggList = AggregationUtils._fetchOverlayAggregation(oRowSettings,false, "", aShapeSchemeKeys);
			}
			var bUseParentShapesOnExpand = oGantt.getUseParentShapeOnExpand();
			if (!oGantt._bExpandRows && (oRowSettings == null)) {
				// possible that the Control haven't been placed At anywhere
				break;
			} else if (oRowSettings != null) {
				var aExpandableShapes = oRowSettings.getAllExpandableShapes(oGantt);
				if (!bExpanded) {
					this.toggle(bExpanded, oRowSettings, oPrimaryScheme, aExpandSchemes, 0);
					bExpandToggled = true;
					return bExpandToggled;
				}
				var aLength = [];
				var aChild = [];
				var childArraay = [];
				var aChildWithLevels = [];
				var childArraayLength = childArraay.length, oInternalRowWithSpan = {};

				aExpandableShapes.forEach(function(oMainshape){ // eslint-disable-line
					if (bUseParentShapesOnExpand) {
						//experimental code
						var aNonMultiActivityShapes = (aShapeSchemeKeys.indexOf(oMainshape.getScheme()) > -1 || aShapeSchemeKeys.length == 0)  ? [oMainshape] : [];
						aChild = oMainshape instanceof sap.gantt.simple.MultiActivityGroup ? AggregationUtils.getNonLazyElementsByScheme(oMainshape, aShapeSchemeKeys) : aNonMultiActivityShapes;
						childArraay = GanttUtils._getExpandedChildArray(aChild, oGantt, aShapeSchemeKeys, childArraay);
						if (childArraayLength != childArraay.length){
							childArraay[childArraay.length - 1].setProperty("childElement", false, true);
							childArraayLength = childArraay.length;
						}

					} else if (oMainshape.mBindingInfos.hasOwnProperty("subTasks") || (typeof oMainshape.getSubTasks === "function" && oMainshape.getSubTasks())) {
						aChild = AggregationUtils.getLazyElementsByScheme(oMainshape, aShapeSchemeKeys);
						childArraay = GanttUtils._getExpandedChildArray(aChild, oGantt, aShapeSchemeKeys, childArraay);
						if (childArraayLength != childArraay.length){
							childArraay[childArraay.length - 1].getParent().setProperty("childElement", false, true);
							childArraayLength = childArraay.length;
						}

					} else if (oMainshape.getScheme() && aShapeSchemeKeys.indexOf(oMainshape.getScheme()) > -1){
						aChild = [oMainshape];
						childArraay = GanttUtils._getExpandedChildArray(aChild, oGantt, aShapeSchemeKeys, childArraay);

						if (childArraayLength != childArraay.length){
							childArraay[childArraay.length - 1].setProperty("childElement", false, true);
							childArraayLength = childArraay.length;
						}
					} else {
						aChild = AggregationUtils.getLazyElementsByScheme(oMainshape, aShapeSchemeKeys);
						var oChildLevelsWithRowSpan = GanttUtils.calculateLevelForShapes(aChild, "time", "endTime", false, oGantt, oInternalRowWithSpan);
						aChildWithLevels = oChildLevelsWithRowSpan.childWithLevels;
						oInternalRowWithSpan = oChildLevelsWithRowSpan.internalRowWithSpan;
						aLength.push(aChildWithLevels.maxLevel);
					}
				});
				if (childArraay.length !== 0) {
					var oChildLevelsWithRowSpan = GanttUtils.calculateLevelForShapes(childArraay, "time", "endTime", false, oGantt, oInternalRowWithSpan);
					aChildWithLevels = oChildLevelsWithRowSpan.childWithLevels;
					oInternalRowWithSpan = oChildLevelsWithRowSpan.internalRowWithSpan;
					aLength.push(aChildWithLevels.maxLevel);
				}
				var oChildLevelsWithRowSpan = GanttUtils.calculateLevelForShapes(childArraay, "time", "endTime", false, oGantt, oInternalRowWithSpan);
				aChildWithLevels = oChildLevelsWithRowSpan.childWithLevels;
				oInternalRowWithSpan = oChildLevelsWithRowSpan.internalRowWithSpan;
				aLength.push(aChildWithLevels.maxLevel);
				var iMaxLength = Math.max.apply(null, aLength);

				var oMaxlenWithRowSpan = AggregationUtils._addLevelAndUpdateMaxLength(overlayAggList, iMaxLength, oRowSettings, oInternalRowWithSpan);
				iMaxLength = oMaxlenWithRowSpan.iMaxLength;
				oInternalRowWithSpan = oMaxlenWithRowSpan.oInternalRowWithSpan;
				if (iMaxLength > 0) {
					this.oRowSpanMap[oRowSettings.getRowUid()] = oInternalRowWithSpan;
					this.toggle(bExpanded, oRowSettings, oPrimaryScheme, aExpandSchemes, iMaxLength, bUseParentShapesOnExpand);
					this.rowMaxLevelMap["row" + iSelectedIndex] = iMaxLength;
					bExpandToggled = true;
				}
			}
		}

		return bExpandToggled;
	};

	ExpandModel.prototype.refreshRowYAxis = function(oTable) {
		if (this.hasExpandedRows() === false) {
			return;
		}
		var oGantt = oTable.getParent();
		var aRows = oTable.getRows();

		var aRowHeight = oTable.getParent().getTableRowHeights();

		var fAccumulateHeight = 0;
		for (var i = 0; i < aRows.length; i++) {
			var oRow = aRows[i],
				oRowSettings = oRow.getAggregation("_settings"),
				sRowUid = oRowSettings.getRowUid();

			fAccumulateHeight += (aRowHeight[i - 1] || 0);

			if (!this.isRowExpanded(sRowUid)) {
				continue;
			}

			var iRowHeight = this.getBaseRowHeight();
			if (oGantt.getExpandedRowHeight()){
			iRowHeight = oGantt.getExpandedRowHeight();
			}

			this.calcExpandRowYAxis({
				uid: oRowSettings.getRowUid(),
				rowIndex: i,
				rowY: fAccumulateHeight,
				baseRowHeight: iRowHeight,
				allRowHeights: aRowHeight
			});
		}

		return this.getBaseRowHeight();
	};

	ExpandModel.prototype.toggle = function(bExpanded, oRowSettings, oMainScheme, aExpandSchemes, iMaxLength, bUseOnlyParentShapesOnExpand) {
		if (bExpanded) {
			this.expand(oRowSettings, oMainScheme, aExpandSchemes, iMaxLength, bUseOnlyParentShapesOnExpand);
		} else {
			this.collapse(oRowSettings, aExpandSchemes);
		}
	};

	ExpandModel.prototype.expand = function(oRowSettings, oMainScheme, aExpandSchemes, iMaxNumberOfDetails, bUseOnlyParentShapesOnExpand) {
		assert(typeof iMaxNumberOfDetails === "number", "iMaxNumberOfDetails must be a number");
		var sUid = oRowSettings.getRowUid(),
			oGantt = oRowSettings.getParentGantt(),
			sMainSchemeKey = oMainScheme.getKey(),
			iMainRowSpan = oMainScheme.getRowSpan();

		var aExpandSchemeKeys = [];
		Array.isArray(aExpandSchemes) && aExpandSchemes.forEach(function(scheme){
			aExpandSchemeKeys.push(scheme.getKey());
		});
		var	aExpandRowSpans = [];
		Array.isArray(aExpandSchemes) && aExpandSchemes.forEach(function(scheme){
			aExpandRowSpans.push(scheme.getRowSpan());
		});
		var updateExpandedData = function(){
			if (bUseOnlyParentShapesOnExpand) {
				//experimental code block
				if (oGantt.oOverlapShapeIds && oGantt.oOverlapShapeIds[oRowSettings.getParent().getIndex()] &&  oGantt.oOverlapShapeIds[oRowSettings.getParent().getIndex()].length > 0){
					if (!aItems || aItems.length === 0) {
						this.mExpanded[sUid] = [{
							scheme: "",
							metadata: {
								rowSpan: iMainRowSpan,
								numberOfRows: iMaxNumberOfDetails,
								main: true
							}
						},{
							expandSchemeShape: true,
							metadata: {
								numberOfRows: iMaxNumberOfDetails,
								rowSpan: iMainRowSpan,
								useParentOnExpand: true
							}
						}
						];
					} else {
						this.mExpanded[sUid][1].metadata.numberOfRows = iMaxNumberOfDetails;
					}
				} else {
					if (!aItems || aItems.length === 0) {
						this.mExpanded[sUid] = [{
							scheme: "",
							metadata: {
								rowSpan: iMainRowSpan,
								numberOfRows: iMaxNumberOfDetails,
								main: true
							}
						}
						];
					}
					if (!this.hasExpandScheme(sUid, aExpandSchemeKeys[index])) {
					this.mExpanded[sUid].push({
						scheme: aExpandSchemeKeys[index],
						metadata: {
							numberOfRows: iMaxNumberOfDetails,
							rowSpan: aExpandRowSpans[index]
						}
					});
					}
					if (!(!aItems || aItems.length === 0)) {
						for (var i = 1; i < this.mExpanded[sUid].length; i++){
							this.mExpanded[sUid][i].metadata.numberOfRows = iMaxNumberOfDetails;
						}
					}
				}
			} else {
				if (!aItems || aItems.length === 0) {
					this.mExpanded[sUid] = [{
						scheme: sMainSchemeKey,
						metadata: {rowSpan: iMainRowSpan, main: true }
						}];
				}

				if (!this.hasExpandScheme(sUid, aExpandSchemeKeys[index])) {
					this.mExpanded[sUid].push({
						scheme: aExpandSchemeKeys[index],
						metadata: {
							numberOfRows: iMaxNumberOfDetails,
							rowSpan: aExpandRowSpans[index]
						}
					});
				}
				if (!this.mExpanded[sUid][1]){
					this.mExpanded[sUid][0].metadata = {numberOfRows: iMaxNumberOfDetails, rowSpan: iMainRowSpan, main: true};
				}
			}
		}.bind(this);
		var aItems = this.mExpanded[sUid];
		if (aExpandSchemeKeys.length){
			for (var index = 0; index < aExpandSchemeKeys.length; index++){
				aItems = this.mExpanded[sUid];
				updateExpandedData();
			}
		} else {
			updateExpandedData();
		}

		this.updateVisibleRowSpan(sUid);
	};

	ExpandModel.prototype.collapse = function(oRowSettings, aExpandSchemes) {
		var sUid = oRowSettings.getRowUid();
		if (!sUid && !this.mExpanded[sUid]) {
			// the row haven't been expanded, thus return immediately
			return;
		}
		var aExpandSchemeKeys = [];
		Array.isArray(aExpandSchemes) && aExpandSchemes.forEach(function(scheme){
			aExpandSchemeKeys.push(scheme.getKey());
		});
		var aItems = this.mExpanded[sUid] || [], length = aItems.length;
		for (var iIndex = length - 1; iIndex > -1; iIndex--) {
			var oItem = aItems[iIndex];
			if (aExpandSchemeKeys.indexOf(oItem.scheme) > -1 || (!oItem.scheme && oItem.expandSchemeShape)) {
				aItems.splice(iIndex, 1);
			}
			if (this.hasNoExpandRows(sUid)) {
				delete this.mExpanded[sUid];
				break;
			} else {
				this.updateVisibleRowSpan(sUid);
			}
		}
	};

	ExpandModel.prototype.hasExpandScheme = function(sUid, sScheme) {
		return this.mExpanded[sUid].filter(function(oItem){
			return oItem.scheme === sScheme;
		}).length > 0;
	};

	ExpandModel.prototype.hasExpandedRows = function() {
		return !jQuery.isEmptyObject(this.mExpanded);
	};

	ExpandModel.prototype.isRowExpanded = function(sUid) {
		return !this.hasNoExpandRows(sUid);
	};

	ExpandModel.prototype.hasNoExpandRows = function(sUid) {
		var aItems = this.mExpanded[sUid] || [];
		return aItems.every(function(oItem){
			return (oItem.metadata.main && !oItem.metadata.useParentOnExpand);
		});
	};

	ExpandModel.prototype.updateVisibleRowSpan = function(sUid) {
		var aItems = this.mExpanded[sUid] || [];

		var sMainKey, oMain, iNumberofSubRows = 0;
		for (var iIndex = 0; iIndex < aItems.length; iIndex++) {
			var oItem = aItems[iIndex];
			var sKey = oItem.scheme;
			var oValue = oItem.metadata;
			if (oValue.main) {
				sMainKey = sKey;
				oMain = oValue;
				if (oValue.useParentOnExpand) {
					iNumberofSubRows = oValue.rowSpan;
				}
			}
		}
		for (var j = 0; j < oValue.numberOfRows; j++) {
			iNumberofSubRows = iNumberofSubRows + (this.oRowSpanMap[sUid] && this.oRowSpanMap[sUid]["level" + j] || 1);
		}
		oMain.numberOfSubRows = iNumberofSubRows || oMain.rowSpan * (oMain.numberOfRows || 1);
		this.mExpanded[sUid][0] = {
			scheme: sMainKey,
			metadata: oMain
		};
	};

	ExpandModel.prototype.getMainRowScheme = function(sUid) {
		var aItems = this.mExpanded[sUid] || [];
		return aItems.filter(function(oItem){
			return oItem.metadata.main;
		}).map(function(oMain){
			return {
				key: oMain.scheme,
				value: oMain.metadata
			};
		})[0];
	};

	ExpandModel.prototype.getExpandSchemeKeys = function(sUid) {
		var aItems = this.mExpanded[sUid] || [];
		return aItems.filter(function(oItem){
			return !oItem.metadata.main;
		}).map(function(oItem){
			return oItem.scheme;
		});
	};

	/**
	 * Calculate the row height based on the row expand scheme and fallback to default row height
	 * if row has not expanded
	 *
	 * @private
	 * @param {@sap.gantt.GanttRowSettings} oRowSettings RowSettings
	 * @param {int} iBaseRowHeight the fallback rowheight if row is not expanded
	 * @param {object} oTable Object of Ganttchart table
	 * @returns {int} return the calculated the row height on expand chart
	 */
ExpandModel.prototype.getCalculatedRowHeight = function(oRowSettings, iBaseRowHeight, oTable) {
		var iResult = iBaseRowHeight;
		var oGantt = oTable.getParent(),
			iExpandedRowHeight = oGantt.getExpandedRowHeight();
		var iRowIndex = oRowSettings.getParent().getIndex(),
		bIncludePseudoShape = oGantt.oOverlapShapeIds && oGantt.oOverlapShapeIds[iRowIndex] && oGantt.oOverlapShapeIds[iRowIndex].length > 0;
		var bShowParentRowOnExpand = (oGantt.getShowParentRowOnExpand() && !oGantt.getUseParentShapeOnExpand()) || (oGantt._aExpandedIndices.indexOf(iRowIndex) > -1 && bIncludePseudoShape );

		if (this.hasExpandedRows()) {
			var sUid = oRowSettings.getRowUid();
			if (!sUid) { return iResult; }

			var aItems = this.mExpanded[sUid];
			if (aItems) {
				var oMain = this.getMainRowScheme(sUid);
				if (!iExpandedRowHeight){
					iResult = bShowParentRowOnExpand ? (iBaseRowHeight * (oMain.value.rowSpan + oMain.value.numberOfSubRows)) : (iBaseRowHeight * (oMain.value.numberOfSubRows));
				} else if (!bShowParentRowOnExpand) {
						//check if row has a single subrow and expanded row height is less than the default row height
						if (iExpandedRowHeight < iBaseRowHeight && oMain.value.numberOfSubRows === 1) {
							iResult = oMain.value.numberOfSubRows * iBaseRowHeight;
						} else {
							iResult = oMain.value.numberOfSubRows * iExpandedRowHeight + 0.5;
						}
					} else {
						iResult = (iBaseRowHeight * oMain.value.rowSpan) + (oMain.value.numberOfSubRows * iExpandedRowHeight) + 0.5;
					}
			}
		}
		return iResult;
	};

	ExpandModel.prototype.getRowHeightByIndex = function(oTable, iIndex, iTableRowHeight) {
		if (oTable == null) {
			return iTableRowHeight;
		}

		var aRows = oTable.getRows(),
			oRowSettings = aRows[iIndex].getAggregation("_settings");
		return this.getCalculatedRowHeight(oRowSettings, iTableRowHeight, oTable);
	};

	ExpandModel.prototype.calcExpandRowYAxis = function(mParam) {
		var sUid = mParam.uid,
			iBaseRowHeight = mParam.baseRowHeight;

		var iFirstStartY = mParam.rowY;

		var oMainRowScheme,
			sMainSchemeKey,
			aExpandSchemeKey = [];

		var aExpandSchemes = [];

		var aItems = this.mExpanded[sUid];
		if (jQuery.isEmptyObject(aItems)) { return; }

		for (var iIndex = 0; iIndex < aItems.length; iIndex++) {
			var oExpandItem = aItems[iIndex],
				sKey = oExpandItem.scheme,
				oValue = oExpandItem.metadata;
			if (oValue.main) {
				oMainRowScheme = oValue;
				sMainSchemeKey = sKey;
				if (oValue.useParentOnExpand) {
					aExpandSchemes.push(oValue);
					aExpandSchemeKey.push(sKey);
				}
			} else {
				aExpandSchemes.push(oValue);
				aExpandSchemeKey.push(sKey);
			}
		}
		var iMainRowSpan = oMainRowScheme ? oMainRowScheme.rowSpan : 1;

		this.oItem = {};
		this.oItem[sMainSchemeKey] = [iMainRowSpan];
		var aRowSpans = [this.oItem];
		var aSpans = [];
		for (var i = 0; i < aExpandSchemes.length; i++) {
			var oExpandScheme = aExpandSchemes[i],
				iMaxLength = oExpandScheme.numberOfRows;
			if (!aSpans.length){
				for (var j = 0; j < iMaxLength; j++) {
					aSpans.push(this.oRowSpanMap[sUid] && this.oRowSpanMap[sUid]["level" + j] || 1);
				}
			}
			this.oItem = {};
			this.oItem[aExpandSchemeKey[i]] = aSpans;
			aRowSpans.push(this.oItem);
		}

		var iRelativeY = iFirstStartY;
		for (var m = 0; m < aRowSpans.length; m++) {
			var oSpanItem = aRowSpans[m],
				sScheme = Object.keys(oSpanItem)[0],
				aSubSpans = oSpanItem[sScheme];

			if (m === 0) {
				this._updateRowYAxis(sUid, sScheme, {
					rowYAxis: [iRelativeY].slice()
				});
			} else if (m === 1) {
				var aSubRowYStart = [];

				if (aSubSpans.length === 1) {
					aSubRowYStart.push(iRelativeY + aRowSpans[m - 1][Object.keys(aRowSpans[m - 1])[0]][0] * this.getBaseRowHeight());
					iRelativeY += (aSubSpans[m - 1] * iBaseRowHeight);
				} else {
					for (var n = 0; n < aSubSpans.length; n++) {
						if (n === 0){
							if (this.getBaseRowHeight() !== iBaseRowHeight){
								iRelativeY = iRelativeY + (this.getBaseRowHeight());
							} else {
								iRelativeY = iRelativeY + (iBaseRowHeight);
							}
						} else {
							iRelativeY = iRelativeY + (aSubSpans[n - 1] * iBaseRowHeight);
						}
						aSubRowYStart.push(iRelativeY);
					}
				}

				//expand row
				this._updateRowYAxis(sUid, sScheme, {
					rowYAxis: aSubRowYStart.slice()
				});
			} else {
				this._updateRowYAxis(sUid, sScheme, {
					rowYAxis: aSubRowYStart.slice()
				});
			}
		}

	};

	ExpandModel.prototype._updateRowYAxis = function(sUid, sSchemeKey, vValue) {
		var aRowYAxis = vValue.rowYAxis;
		var aItems = this.mExpanded[sUid] || [];
		for (var iIndex = 0; iIndex < aItems.length; iIndex++) {
			var oItem = aItems[iIndex];
			if (oItem.scheme === sSchemeKey || (!oItem.scheme && oItem.expandSchemeShape)) {
				oItem.metadata.yAxis = aRowYAxis;
				break;
			}
		}
	};

	ExpandModel.prototype.getRowYCenterByUid = function(sUid, iMainRowYCenter, sSchemeKey, iExpandIndex, oGantt, iRowIndex) {
		var bRowExpanded = this.isRowExpanded(sUid);
		if (bRowExpanded === false) {
			// non expand mode
			return iMainRowYCenter;
		}
		var aItems = this.mExpanded[sUid],
			sScheme = sSchemeKey || this.getMainRowScheme(sUid).key;
		for (var iIndex = 0; iIndex < aItems.length; iIndex++) {
			var oItem = aItems[iIndex];
			if (oItem.scheme === sScheme || (!oItem.scheme && oItem.expandSchemeShape)) {
				var iBaseRowHeight = this.getBaseRowHeight();
				var aYAxis = oItem.metadata.yAxis,
				bIncludePseudoShape = oGantt.oOverlapShapeIds && oGantt.oOverlapShapeIds[iRowIndex] &&  oGantt.oOverlapShapeIds[iRowIndex].length > 0;
				var bShowParentRowOnExpand = (oGantt.getShowParentRowOnExpand() && !oGantt.getUseParentShapeOnExpand()) || (oGantt._aExpandedIndices.indexOf(iRowIndex) > -1 && bIncludePseudoShape),
				iExpandedRowHeight = oGantt.getExpandedRowHeight();

				if (iExpandedRowHeight && !(oItem.metadata.main && !oItem.metadata.useParentOnExpand)) {
					//check if it's a single subrow whose parent row is hidden and expanded row height is less than the default row height
					if (aYAxis.length === 1 && iExpandedRowHeight < iBaseRowHeight && !bShowParentRowOnExpand && oItem.metadata.rowSpan === 1) {
						iBaseRowHeight =  this.getBaseRowHeight();
					} else {
						iBaseRowHeight = iExpandedRowHeight;
					}
				}
				var iShapeHeight = iBaseRowHeight * (oGantt.schemeRowSpanMap && oGantt.schemeRowSpanMap[sSchemeKey] ? oGantt.schemeRowSpanMap[sSchemeKey] : oItem.metadata.rowSpan);
				var aRowYCenters = aYAxis.map(function(iValue) {//eslint-disable-line
					return iValue + (iShapeHeight / 2);
				});

				var i = iExpandIndex === undefined ? 0 : iExpandIndex;
				return aRowYCenters[i];
			}
		}
	};

	ExpandModel.prototype.getExpandShapeHeightByUid = function(sUid, sShapeScheme, iFallbackHeight, oGantt) {
		var aItems = this.mExpanded[sUid];
		var oFoundItem = aItems && aItems.filter(function(oItem){
			return oItem.scheme === sShapeScheme  ||  (!oItem.scheme && oItem.expandSchemeShape);
		})[0];
		return oFoundItem ? oGantt.schemeRowSpanMap[sShapeScheme] * (oGantt.getExpandedRowHeight() ? oGantt.getExpandedRowHeight() : this.getBaseRowHeight()) : iFallbackHeight;
	};

	ExpandModel.prototype.intersectRows = function(aLeft, aRight) {
		return jQuery.grep(aLeft, function(sLeft){
			return jQuery.inArray(sLeft, aRight) > -1;
		});
	};

	ExpandModel.prototype.collectExpandedBgData = function(aRowUid, iExpandedRowHeight, bShowParentRowOnExpand) {
		var aIntersectRows = this.intersectRows(aRowUid, Object.keys(this.mExpanded));
		if (jQuery.isEmptyObject(this.mExpanded)
				|| jQuery.isEmptyObject(aRowUid)
				|| jQuery.isEmptyObject(aIntersectRows)) {
			return [];
		}

		var iRowHeight = this.getBaseRowHeight();
		var aResult = [];
		for (var iIndex = 0; iIndex < aIntersectRows.length; iIndex++) {
			var sUid = aIntersectRows[iIndex],
				aItems = this.mExpanded[sUid] || [];

			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i],
					aYAxis = oItem.metadata.yAxis || [],
					bMain = oItem.metadata.main;
				if (!bMain || oItem.metadata.useParentOnExpand) {
					var aSubResult = [];
					if (iExpandedRowHeight){
						//check if it's a single subrow whose parent row is hidden and expanded row height is less than the default row height
						if (aYAxis.length === 1 && !bShowParentRowOnExpand && (iExpandedRowHeight < this.getBaseRowHeight())) {
							iRowHeight = this.getBaseRowHeight();
						} else {
							iRowHeight = iExpandedRowHeight;
						}
					}
					aYAxis.forEach(function(iY){ //eslint-disable-line
						aSubResult.push({
							x: 0,
							y: iY,
							rowUid: sUid,
							rowHeight: iRowHeight * oItem.metadata.rowSpan
						});
					});

					aResult.push(aSubResult);
				}
			}
		}
		return aResult;
	};

	return ExpandModel;

}, true /**bExport*/);
