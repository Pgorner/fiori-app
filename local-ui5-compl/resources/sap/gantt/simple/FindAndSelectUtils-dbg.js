/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "./GanttUtils",
    "sap/gantt/misc/Format",
    "sap/gantt/misc/Utility",
    "sap/gantt/simple/AggregationUtils",
    "sap/ui/core/Element",
	"sap/ui/core/Lib"
],  function(GanttUtils, Format, Utility, AggregationUtils, Element, Lib) {
    'use strict';


    var oResourceBundle = Lib.getResourceBundleFor("sap.gantt");
    var FindAndSelectUtils = {
        /**
         * Scroll to the highlighted/selected shape in the chart area upon navigation
         * @param {Object} ofindAndSelectData Find and Select data
         * @param {Object} oGantt Gantt Chart Object.
         * @public
         * @since 1.100
         */
        scrollToShape: function(ofindAndSelectData, oGantt) {
            var that = this;
            var oRowDetails = null, shapeIds = [], oRowDomRef;

            function _getShapeFromShapeId (oShape, oGantt, ofindAndSelectData, sShapeId) {
				if (!oShape || oShape.isA("sap.gantt.simple.Relationship")) {
                    return;
                }
                if (oShape.isA("sap.gantt.simple.BaseConditionalShape")) {
                    oShape = oShape._getActiveShapeElement();
                }
                if (oShape.isPseudoShape) {
                    var aShapeIDs = oShape.aShapeIds;
                    var aRows = oGantt.getTable().getRows();
                    var iRowIndex = oShape.getParentRowSettings().getParent().getIndex() - aRows[0].getIndex();
                    var oRow = aRows[iRowIndex];
                    oGantt.oOverlapShapeIds = oGantt.oOverlapShapeIds ? oGantt.oOverlapShapeIds : {};
                    var oOverlapShapeIdsInRow = oGantt.oOverlapShapeIds[oRow.getIndex()] ? oGantt.oOverlapShapeIds[oRow.getIndex()] : [];
                    var bIsExpandRequired = (aShapeIDs.length > 0 && (oOverlapShapeIdsInRow.length == 0  || oOverlapShapeIdsInRow.indexOf(aShapeIDs[0]) == -1));

					if (bIsExpandRequired) {
						for (var i = 0; i < aShapeIDs.length && !that._oFoundShape; i++) {
							if (aShapeIDs[i] === ofindAndSelectData.shapeID[0]) {
								that._bExpandPseudoShape = true;
								that._oFoundShape = oShape;
							}
						}
					}
                }
                if (oShape && oShape.getShapeId && ((oShape.getShapeId() === ofindAndSelectData.shapeID[0] || sShapeId === ofindAndSelectData.shapeID[0]) && oShape.getTime())) {
                    that._oFoundShape = oShape;

					oGantt.getParent().fireSearchSelectionChanged({
						shape: oShape,
						rowIndex: that.shapeInRowIndex
					});
                } else if (oShape instanceof sap.gantt.simple.BaseGroup && !that._oFoundShape) {
                    if (oGantt.getSelectOnlyGraphicalShape()) {
                        oShape._eachChildOfGroup(oShape, function (labelGroup, nonLabelGroup) {
                            nonLabelGroup.forEach(function(oChild) {
                                if (!that._oFoundShape) {
                                    _getShapeFromShapeId(oChild, oGantt, ofindAndSelectData, oShape.getShapeId());
                                }
                            });
                        });
                    } else {
                        oShape._eachChildOfGroup(oShape, function (oChild) {
                            if (!that._oFoundShape) {
                                _getShapeFromShapeId(oChild, oGantt, ofindAndSelectData, oShape.getShapeId());
                            }
                        });
                    }
                }
			}

            function _findShapeInRow () {
                that._oFoundShape = null;
                that._bExpandPseudoShape = false;
                var oRowSetting = Element.getElementById(oRowDomRef.parentElement.id);
                if (oRowSetting) {
					that.shapeInRowIndex = oRowSetting.getParent().getIndex();

                    var mAggregations = AggregationUtils.getAllNonLazyAggregations(oRowSetting);
                    var aShapesInRow = Object.keys(mAggregations).filter(function(sName){
                        return (sName.indexOf("calendars") === -1) && sName !== "relationships";
                    }).map(function(sName){
                        return oRowSetting.getAggregation(sName) || [];
                    });

                    aShapesInRow.forEach(function(aShapes) {
                        if (aShapes && aShapes.length > 0 && !that._oFoundShape) {
                            var iIndex = 0;
                            while (iIndex < aShapes.length && !that._oFoundShape) {
                                _getShapeFromShapeId(aShapes[iIndex], oGantt, ofindAndSelectData);
                                iIndex++;
                            }
                        }
                    });
                }
            }

            function _selectFoundShape () {
                var sStartTime = (that._oFoundShape && that._oFoundShape.getTime()) || ofindAndSelectData.startTime;
                oGantt.jumpToPosition(Format.abapTimestampToDate(sStartTime));

                GanttUtils.getShapeByShapeId(oGantt.getId(), ofindAndSelectData.shapeID).forEach(function(oShape){
                    if (!oRowDetails) {
                        oRowDetails = Utility.parseUid(oShape.getShapeUid());
                        if (that.rowIndex !== parseInt(oRowDetails.rowIndex)) {
                            that.rowIndex = parseInt(oRowDetails.rowIndex);
                            if (oGantt){
                                if (!oGantt.pseudoShapeSpecificData){
                                    oGantt.pseudoShapeSpecificData = {};
                                }
                                oGantt.pseudoShapeSpecificData.needUpdateForTasksInAggr = true;
                            }
                            oGantt.getTable().setFirstVisibleRow(that.rowIndex);
                        }
                    }

                    if (oShape.getHighlightable()) {
                        that.isShapeHighlightable = true;
                        shapeIds.push({ShapeId: oShape.getShapeId(), Highlighted: true});
                    } else {
                        that.isShapeHighlightable = false;
                        shapeIds.push({ShapeId: oShape.getShapeId(), Selected: true});
                    }
                });

                if (that.isShapeHighlightable) {
                    oGantt.oHighlight.clearAllHighlightedShapeIds();
                    oGantt.oHighlight.updateHighlightedShapes(shapeIds);
                } else {
                    oGantt.oSelection.clearAllSelectedShapeIds();
                    oGantt.oSelection.updateSelectedShapes(shapeIds, null, oGantt.getId());
                }
            }

            var oGanttDomRef = document.getElementById(oGantt.getId());
            oRowDomRef = oGanttDomRef ? oGanttDomRef.querySelector("[data-sap-gantt-row-id=" + "'" + ofindAndSelectData.rowID + "'" + "]") : document.querySelector("[data-sap-gantt-row-id=" + "'" + ofindAndSelectData.rowID + "'" + "]");
            if (oRowDomRef) {
                _findShapeInRow();
                if (this._bExpandPseudoShape) {
                    this._oFoundShape.onclick();
                    oGantt.getInnerGantt().resolveWhenReady(true).then(function () {
                        _findShapeInRow();
                        _selectFoundShape();
                    });
                } else {
                    _selectFoundShape();
                }
            } else {
                var oTable = oGantt.getTable(),
                    tableNodes = oTable.isA("sap.ui.table.TreeTable") ? oTable.getBinding().getNodes(0, oGantt._iNodesLength, 0) : oTable.getBinding().getContexts(0, oGantt._iNodesLength, 0),
                    timeoutFn = function () {
                        var dummyRowDomRef = oGanttDomRef ? oGanttDomRef.querySelector("[data-sap-gantt-row-id='" + ofindAndSelectData.rowID + "']") : document.querySelector("[data-sap-gantt-row-id='" + ofindAndSelectData.rowID + "']");
                        if (dummyRowDomRef) {
                            clearInterval(this.setTime);
                            this.setTime = null;
                            this.scrollToShape(ofindAndSelectData, oGantt);
                        }
                    };

                for (var rowIndex = 0; rowIndex < tableNodes.length; rowIndex++) {
                    var sRowIDPath = oGantt._getRowIdPath();
                    var sRowId = (tableNodes[rowIndex].context || tableNodes[rowIndex]).getObject()[sRowIDPath];
                    if (sRowId === ofindAndSelectData.rowID) {
                        this.rowIndex = rowIndex;
                        oTable.setFirstVisibleRow(rowIndex);
                        this.setTime = setInterval(timeoutFn.bind(this), 100);
                        break;
                    }
                }
            }
        },

        /**
         * Navigate to search results on Forward/Backward navigation
         * @param {Array} aGanttCharts Collection of Gantt Charts.
         * @param {Object} oControl Control Object.
         * @private
         * @since 1.100
         */
        navigateToSearchResult: function(aGanttCharts, oControl) {
            if (oControl.isA("sap.gantt.simple.GanttSearchSidePanel")) {
                oControl._oSearchSidePanel.getItems()[3].getContent()[0].setSelectedItem("listItem" + this._selectedIndex);
                oControl._oSearchSidePanel.getItems()[3].getContent()[0].getSelectedItem().focus();
            }

            this.updateShapeSelectionANDHighlight(aGanttCharts, this.previousGanttID);
            var selectedRowInfo = this._ganttSearchResults[this._selectedIndex],
                oGantt = null;

            if (selectedRowInfo) {
                if (this.previousGanttID !== selectedRowInfo.ganttID) {
                    this.previousGanttID = selectedRowInfo.ganttID;
                    oGantt = aGanttCharts[this.previousGanttID];
                } else {
                    oGantt = aGanttCharts[this.previousGanttID];
                }
                if (oControl.isA("sap.gantt.simple.GanttSearchSidePanel")) {
                    oControl.setContainerHeight();
                }
                this.scrollToShape(selectedRowInfo, oGantt);
                if (!oControl.isA("sap.gantt.simple.GanttSearchSidePanel")) {
                    this.toggleNavigationState(
                        oControl._searchFlexBox.getItems()[1],
                        oControl._searchFlexBox.getItems()[3]);
                } else {
                    this.toggleNavigationState(
                        oControl._oSearchSidePanel.getItems()[2].getContent()[0].getItems()[1].getItems()[0],
                        oControl._oSearchSidePanel.getItems()[2].getContent()[0].getItems()[1].getItems()[1], true);
                }
            }
        },

        /**
         * Update Shape Selection or Shape Highlight based on the Highlightable property
         * @param {Array} aGanttCharts Array of gantt charts inside the gantt container.
         * @param {number} iGanttIndex Index of the active gantt chart.
         * @private
         * @since 1.100
         */
        updateShapeSelectionANDHighlight: function(aGanttCharts, iGanttIndex) {
            if (aGanttCharts.length > 0) {
                var oGantt = aGanttCharts[iGanttIndex] ? aGanttCharts[iGanttIndex] : aGanttCharts[0];
                if (this.isShapeHighlightable) {
                    var oHighlightModel = oGantt.getHighlight();
                    oHighlightModel.clearAllHighlightedShapeIds();
                    oHighlightModel.updateShape(null, {
                        highlighted: false,
                        ctrl: false
                    });
                } else {
                    var oSelectionModel = oGantt.getSelection();
                    oSelectionModel.clearAllSelectedShapeIds();
                    oSelectionModel.updateShape(null, {
                        selected: false,
                        ctrl: false
                    });
                }
            }
        },

        /**
         * Trigger the search event in Gantt Chart Area and update the results using findAll method
         * @param {String} sSearchValue search value passed by user.
         * @param {Array} aGanttCharts collection of Gantt Charts.
         * @param {Boolean} bSidePanel flag to check if side panel exists.
         * @param {Object} oToolBar Container Toolbar Object.
         * @param {Object} oSearchSidePanel Search side panel Object.
         * @public
         * @since 1.100
         */
        triggerSearchEvent: function(sSearchValue, aGanttCharts, bSidePanel, oToolBar, oSearchSidePanel) {
            var oContainer = aGanttCharts[0].getParent();
            this._bEnableAutoSelectOnFind = oContainer.getEnableAutoSelectOnFind();

            var createSearchResults = function() {
                var aList = [], bTreeTable, bTreeTableNode;
                aGanttCharts.forEach(function(oGantt, iIndex) {
                    oGantt._bTimeContinuousShapes = false;
                    oGantt._hasTimeContinuousShapes(oGantt.getTable().getRowSettingsTemplate());
                    if (!oGantt._bTimeContinuousShapes) {
                        var aPropertyNames = oGantt.getFindBy(),
                            sRowIDPath = oGantt._getRowIdPath();

                        aList = oGantt.findAll(sSearchValue, aPropertyNames);
                        aList.forEach(function(oFirstItem) {
                            oFirstItem.ganttID = iIndex;
                            this.aSearchData.push(oFirstItem);
                        }.bind(this));

                        //Checking for Collapsed and Expanded state data
                        var aGanttNodes = (oGantt.getTable().getBinding().getNodes && oGantt.getTable().getBinding().getNodes(0, oGantt._iNodesLength, 0)) || (oGantt.getTable().getBinding().getContexts && oGantt.getTable().getBinding().getContexts(0, oGantt._iNodesLength, 0)),
                            aOrderedNodeArr = [],
                            aExapandedShapesData = Object.keys(oGantt._oExpandModel.mExpanded),
                            isRowExist = false,
                            isRowVisible = false,
                            checkShapeRowExist = function(sRowUId, sExpandedShapeUId) {
                                if (sExpandedShapeUId.includes(sRowUId)) {
                                    isRowExist = true;
                                    if (oGantt._oExpandModel.mExpanded[sExpandedShapeUId].length <= 1) {
                                        isRowVisible = true;
                                    }
                                }
                            };

                        bTreeTable = oGantt.getTable().isA("sap.ui.table.TreeTable") ? false : true;
                        for (var i = 0; i < aGanttNodes.length; i++) {
                            for (var j = 0; j < aList.length; j++) {
                                bTreeTableNode = bTreeTable || aGanttNodes[i].nodeState;
                                if (bTreeTableNode && ((aGanttNodes[i].context || aGanttNodes[i]).getObject()[sRowIDPath] === aList[j].rowID)) {
                                    var sRowUId = "PATH:" + aList[j].rowID + "|SCHEME:" + oGantt.getPrimaryShapeScheme().getKey();

                                    isRowExist = false;
                                    aExapandedShapesData.forEach(checkShapeRowExist.bind(null, sRowUId));

                                    if (isRowExist) {
                                        if (aList[j].isExpandable) {
                                            if (aList[j].hasOwnProperty("isParent")) {
                                                if (aList[j].isParent || isRowVisible || oGantt.getUseParentShapeOnExpand()) {
                                                    aOrderedNodeArr.push(aList[j]);
                                                }
                                            } else if (!oGantt.getUseParentShapeOnExpand()) {
                                                aOrderedNodeArr.push(aList[j]);
                                            }
                                        }
                                    } else if (aList[j].hasOwnProperty("isParent")) {
                                        aOrderedNodeArr.push(aList[j]);
                                    }
                                }
                            }
                        }
                        this._ganttSearchResults = this._ganttSearchResults.concat(aOrderedNodeArr);
                    }
                }.bind(this));

                oContainer.setProperty("customSearchResults", this._ganttSearchResults, true);
                oContainer.fireCustomGanttSearchResult({
                    searchResults: this._ganttSearchResults
                });
                this._ganttSearchResults = oContainer.getCustomSearchResults();

                if (bSidePanel) {
                    if (oSearchSidePanel.list) {
                        oSearchSidePanel.list.destroyItems();
                    }
                    oSearchSidePanel.getParent().fireGanttSearchSidePanelList({
                        searchResults: this._ganttSearchResults
                    });
                    oSearchSidePanel._updateContent();
                }
                oContainer.setBusy(false);

                this._searchResultsCount = this._ganttSearchResults.length;
                for (var j = 0; j < this._ganttSearchResults.length; j++) {
                    if (document.querySelector("[data-sap-gantt-shape-id='" + this._ganttSearchResults[j].shapeID[0] + "']")) {
                        this._selectedIndex = j;
                        break;
                    }
                }
                if (this._selectedIndex < 0) {
                    this._selectedIndex = 0;
                }
                var oList = bSidePanel && oSearchSidePanel._oSearchSidePanel.getItems()[3].getContent()[0];
                if (bSidePanel && this._bEnableAutoSelectOnFind && oList.getItems().length) {    // select list item and set focus
                    oList.setSelectedItem("listItem" + this._selectedIndex);
                    if (oList.getSelectedItem()) {
                        setTimeout(function() {
                            oList.getSelectedItem().focus();
                        }, 0);
                    }
                }

                if (!oContainer._bPreventShapeScroll) {    // clear selected/highlighted shapes
                    this.updateShapeSelectionANDHighlight(aGanttCharts, this.previousGanttID);
                }
                var firstRowInfo = this._ganttSearchResults[this._selectedIndex],
                    oGantt = null;
                if (firstRowInfo) {
                    oToolBar._searchFlexBox.getItems()[2].setText("(" + (this._selectedIndex + 1) + "/" + this._searchResultsCount + ")");
                    if (this.previousGanttID !== firstRowInfo.ganttID) {
                        this.previousGanttID = firstRowInfo.ganttID;
                        oGantt = aGanttCharts[this.previousGanttID];
                    } else {
                        oGantt = aGanttCharts[this.previousGanttID];
                    }
                    if (!oContainer._bPreventShapeScroll && this._bEnableAutoSelectOnFind) {    // scroll to found shape
                        FindAndSelectUtils.scrollToShape(firstRowInfo, oGantt);
                    }
                    this._toggleNavigationStateUtil(bSidePanel, oToolBar, oSearchSidePanel, true);
                } else {
                    if (bSidePanel) {
                        oSearchSidePanel.setEmptyListInfo(false);
                    }
                    this._toggleNavigationStateUtil(bSidePanel, oToolBar, oSearchSidePanel, true);
                }
                oContainer._bPreventShapeScroll = false;
            }.bind(this);

            this._ganttSearchResults = [];
            this._selectedIndex = 0;
            this._searchResultsCount = 0;
            oToolBar._searchFlexBox.getItems()[0].setValue(sSearchValue);
            oToolBar._searchFlexBox.getItems()[2].setText(oResourceBundle.getText("GNT_EMPTY_RESULT_INFO_TOOLBAR"));

            if (sSearchValue) {
                this.aSearchData = [];
                oContainer.setBusyIndicatorDelay(0);
                oContainer.setBusy(true);
                setTimeout(function() {
                    createSearchResults();
                }, oContainer.getBusyIndicatorDelay());
            } else {
                if (!oContainer._bPreventShapeScroll) {
                    this.updateShapeSelectionANDHighlight(aGanttCharts, this.previousGanttID);
                }
                if (bSidePanel) {
                    oSearchSidePanel._updateContent();
                    oSearchSidePanel.setEmptyListInfo(true);
                }
                this._toggleNavigationStateUtil(bSidePanel, oToolBar, oSearchSidePanel, true);
                oContainer._bPreventShapeScroll = false;
            }
            if (!bSidePanel || !this._bEnableAutoSelectOnFind) {    // set focus on navigation buttons
                setTimeout(function() {
                    var oForwardButton = bSidePanel ? oSearchSidePanel._oSearchSidePanel.getItems()[2].getContent()[0].getItems()[1].getItems()[1] : oToolBar._searchFlexBox.getItems()[3];
                    var oBackwardButton = bSidePanel ? oSearchSidePanel._oSearchSidePanel.getItems()[2].getContent()[0].getItems()[1].getItems()[0] : oToolBar._searchFlexBox.getItems()[1];
                    if (oForwardButton.getEnabled()) {
                        oForwardButton.focus();
                    } else if (oBackwardButton.getEnabled()) {
                        oBackwardButton.focus();
                    }
                }, 0);
            }
        },

        _toggleNavigationStateUtil: function(bSidePanel, oToolBar, oSearchSidePanel, bTrigger) {
            if (!bSidePanel) {
                this.toggleNavigationState(
                    oToolBar._searchFlexBox.getItems()[1],
                    oToolBar._searchFlexBox.getItems()[3], null, null, bTrigger);
            } else {
                this.toggleNavigationState(
                    oSearchSidePanel._oSearchSidePanel.getItems()[2].getContent()[0].getItems()[1].getItems()[0],
                    oSearchSidePanel._oSearchSidePanel.getItems()[2].getContent()[0].getItems()[1].getItems()[1], true, null, bTrigger);
            }
        },

        /**
         * Toggle state of forward and backward navigation buttons based on the count of search result
         * @param {Object} oNavigateBackControl Control for forward Navigation
         * @param {Object} oNavigateForwardControl Control for backward Navigation
         * @param {Boolean} bSidePanel true if side panel is open
         * @param {Boolean} bFindPopup true if find popup button was clicked
         * @param {Boolean} bTrigger true if search is triggered
         * @public
         * @since 1.100
         */
        toggleNavigationState: function(oNavigateBackControl, oNavigateForwardControl, bSidePanel, bFindPopup, bTrigger) {
            var oFocusControl;
            if (this._selectedIndex === 0 && this._searchResultsCount > 1) {
                oNavigateBackControl.setEnabled(false);
                oNavigateForwardControl.setEnabled(true);
                if (!bSidePanel || bTrigger) {
                    oFocusControl = oNavigateForwardControl;
                }
            } else if (this._selectedIndex === this._searchResultsCount - 1 && this._selectedIndex > 0) {
                oNavigateForwardControl.setEnabled(false);
                oNavigateBackControl.setEnabled(true);
                if (!bSidePanel || bTrigger) {
                    oFocusControl = oNavigateBackControl;
                }
            } else if ((this._selectedIndex === 0 && this._searchResultsCount === 0) || (this._selectedIndex === this._searchResultsCount - 1)) {
                oNavigateBackControl.setEnabled(false);
                oNavigateForwardControl.setEnabled(false);
            } else {
                oNavigateBackControl.setEnabled(true);
                oNavigateForwardControl.setEnabled(true);
                if (bFindPopup || bTrigger) {
                    oFocusControl = oNavigateForwardControl;
                }
            }
            if (oFocusControl && (!bSidePanel || !this._bEnableAutoSelectOnFind)) {
                setTimeout(function() {
                    oFocusControl.focus();
                }, 0);
            }
        },

        /**
         * Enable/Disable Find and Select Search operation at ContainerToolbar
         * @param {Object} oToolBar Container Toolbar Object.
         * @param {Object} bAddSearchBox Flag to Enable/Disable Find and Select Search operation
         * @param {Boolean} bFindPopup true if find popup button was clicked
         * @public
         * @since 1.100
         */
        updateToolbarItems: function(oToolBar, bAddSearchBox, bFindPopup) {
            var aAllItems = oToolBar.getAllToolbarItems(),
                bSearchFlexbox = false,
                iToolbarSpacerIndex = -1;

            aAllItems.forEach(function(oToolBarItem, index) {
                if (oToolBarItem.isA("sap.m.ToolbarSpacer")) { iToolbarSpacerIndex = index; }
                if (oToolBarItem.getId().includes("findAndSelectSearchButton")) {
                    oToolBarItem.setVisible(!bAddSearchBox);
                }
                if (oToolBarItem.getId().includes("findAndSelectFlexBox")) {
                    bSearchFlexbox = true;
                    oToolBarItem.setVisible(bAddSearchBox);
                }
            });
            if (!bSearchFlexbox) {
                if (iToolbarSpacerIndex > -1) {
                    oToolBar.insertContent(oToolBar._searchFlexBox, iToolbarSpacerIndex + 1);
                } else {
                    oToolBar.insertContent(oToolBar._searchFlexBox, 1);
                }
            }

            setTimeout(function() {
                var oInputField = oToolBar._searchFlexBox.getItems()[0];
                if (bFindPopup && this._searchResultsCount > 1) {
                    this.toggleNavigationState(oToolBar._searchFlexBox.getItems()[1], oToolBar._searchFlexBox.getItems()[3], false, true);
                } else if (oInputField.getDomRef()) {
                    var iInputLength = oInputField.getValue().length;
                    var oSearchTextDom = oInputField.getDomRef().getElementsByTagName("input")[0];
                    oInputField.focus();
                    var iStartIndex = bFindPopup ? iInputLength : 0;
                    oSearchTextDom.setSelectionRange(iStartIndex, iInputLength);
                } else if (!bAddSearchBox) {
                    var oFindButtonDom = oToolBar._oSearchButton.getDomRef();
                    if (oFindButtonDom) {
                        oFindButtonDom.focus();
                    }
                }
            }.bind(this), 0);
        }
    };

    return FindAndSelectUtils;
});
