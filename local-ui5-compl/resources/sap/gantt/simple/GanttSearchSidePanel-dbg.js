/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/core/Core",
    "./FindAndSelectUtils",
    "sap/tnt/NavigationListItem",
    "sap/tnt/NavigationList",
    "sap/ui/core/Element",
    "sap/gantt/library",
	"sap/ui/core/Lib"
], function (Control, Core, FindAndSelectUtils, NavigationListItem, NavigationList, Element, library, Lib) {
    'use strict';
    var GanttSearchSidePanel = Control.extend("sap.gantt.simple.GanttSearchSidePanel", {
        metadata: {
            library: "sap.gantt",
            properties: {
            },
            aggregations: {
                _sidePanel: { type: "sap.m.VBox", multiple: false, visibility: "hidden"}
            }
        }
    });

    /**
	 * Initialize gantt search side panel with initial list data
	 * @since 1.100
	 */
    GanttSearchSidePanel.prototype.initSearchSidePanel =  function () {

		this._oRb = Lib.getResourceBundleFor("sap.gantt");
        this.emptyListAndField = true;

        if (!FindAndSelectUtils._ganttSearchResults) {
            FindAndSelectUtils._ganttSearchResults = [];
        } else {
            this.getParent().fireGanttSearchSidePanelList({
                searchResults: FindAndSelectUtils._ganttSearchResults
            });
            this.list = this.getParent().getSearchSidePanelList();
            if (!this.list) {
                var aSearchResultsList = FindAndSelectUtils._ganttSearchResults.map(function (oData, index) {
                    var listItem = new NavigationListItem({
                        text: ("Gantt " + (oData.ganttID + 1) + ", " + oData.sMatchedValue).substring(0, 200),
                        id: "listItem" + index
                    });
                    return listItem;
                });
                this.list = new NavigationList({
                    items: [aSearchResultsList]
                });
            }
            this.aSidePanelSearchResults = FindAndSelectUtils._ganttSearchResults;
            FindAndSelectUtils._searchResultsCount = this.aSidePanelSearchResults.length;
            // Add event listeners to side panel list
            this.addEventListener();
        }

        var buttonsFlexBoxItems = [];

        var popupButton = new sap.m.Button(this.getId() + "-sidePanelToolbarButton", {
            icon: "sap-icon://drill-up",
            type: "Transparent",
            visible: (this.getParent().getToolbar().getFindMode() === library.config.FindMode.Both),
            tooltip: this._oRb.getText("GNT_FIND_POPUP"),
            press: function () {
                var oToolBar = this.getParent().getToolbar(),
                    oSearchPopover = oToolBar._searchFlexBox;
                oToolBar.fireFindPopupButtonPress();
                oSearchPopover.getItems()[0].setValue(this._oSearchSidePanel.getItems()[1].getContent()[0].getValue());
                if (FindAndSelectUtils._ganttSearchResults.length > 0) {
                    oSearchPopover.getItems()[2].setText("(" + (FindAndSelectUtils._selectedIndex + 1) + "/" + FindAndSelectUtils._searchResultsCount + ")");
                }

                this.getParent().setShowSearchSidePanel(false);
                FindAndSelectUtils.updateToolbarItems(oToolBar, true, true);
                oToolBar.searchResultsCount = FindAndSelectUtils._searchResultsCount;
                FindAndSelectUtils.toggleNavigationState(oSearchPopover.getItems()[1], oSearchPopover.getItems()[3]);
                this._oSearchSidePanel.destroy();
            }.bind(this)
        });

        var declineButton = new sap.m.Button(this.getId() + "-sidePanelCloseButton", {
            text: this._oRb.getText("GNT_FIND_CLOSE"),
            type: "Transparent",
            tooltip: this._oRb.getText("GNT_FIND_CLOSE"),
            press: function () {
                var oToolBar = this.getParent().getToolbar(),
                    oSearchPopover = oToolBar._searchFlexBox;
                oToolBar.fireCloseSidePanelButtonPress();
                oSearchPopover.getItems()[0].setValue(this._oSearchSidePanel.getItems()[1].getContent()[0].getValue());
                this.getParent().setShowSearchSidePanel(false);
                FindAndSelectUtils.updateToolbarItems(oToolBar, false);
                FindAndSelectUtils.updateShapeSelectionANDHighlight(this.getParent().getGanttCharts(), FindAndSelectUtils.previousGanttID);
                if (FindAndSelectUtils._ganttSearchResults.length > 0) {
                    oSearchPopover.getItems()[2].setText("(" + (FindAndSelectUtils._selectedIndex + 1) + "/" + FindAndSelectUtils._searchResultsCount + ")");
                }
                FindAndSelectUtils.toggleNavigationState(
                    this._oSearchSidePanel.getItems()[2].getContent()[0].getItems()[1].getItems()[0],
                    this._oSearchSidePanel.getItems()[2].getContent()[0].getItems()[1].getItems()[1]);
                this._oSearchSidePanel.destroy();
            }.bind(this)
        });

        buttonsFlexBoxItems.push(popupButton);
        buttonsFlexBoxItems.push(declineButton);

        /* Creation of Gantt Search Side Panel */
        this._oSearchSidePanel = new sap.m.VBox(this.getId() + "-ganttSearchSidePanel", {
            items: [
                new sap.m.Panel({
                    content: [
                        new sap.m.FlexBox(this.getId() + "-sidePanelHeader", {
                            justifyContent: "End",
                            items: [
                                new sap.m.Title({
                                    text: this._oRb.getText("GNT_FIND_PLACEHOLDER")
                                }),
                                buttonsFlexBoxItems
                            ]
                        }).addStyleClass("sapUiFindHeader")
                    ]
                }).addStyleClass("sapUiNoContentPadding"),
                new sap.m.Panel(this.getId() + "-sidePanelFindOperation", {
                    content: [
                        new sap.m.SearchField(this.getId() + "-sidePanelFindSearchField", {
                            placeholder: this._oRb.getText("GNT_FIND_PLACEHOLDER"),
                            value: this.getParent().getToolbar()._searchFlexBox.getItems()[0].getValue(),
                            search: function(oEvent) {
                                if (oEvent.getParameter("clearButtonPressed")) {
                                    var aItems = this._oSearchSidePanel.getItems();
                                    FindAndSelectUtils.updateShapeSelectionANDHighlight(this.getParent().getGanttCharts(), FindAndSelectUtils.previousGanttID);
                                    FindAndSelectUtils._selectedIndex = 0;
                                    FindAndSelectUtils._searchResultsCount = 0;
                                    FindAndSelectUtils._ganttSearchResults = [];
                                    aItems[2].getContent()[0].getItems()[0].setText(this._oRb.getText("GNT_EMPTY_RESULT_INFO_SIDE_PANEL"));
                                    aItems[3].getContent()[0].destroyItems();
                                    this.getParent().getToolbar()._searchFlexBox.getItems()[2].setText("(" + (FindAndSelectUtils._selectedIndex) + "/" + FindAndSelectUtils._searchResultsCount + ")");
                                    this.getParent().getToolbar()._searchFlexBox.getItems()[0].setValue("");
                                    this.setEmptyListInfo(this.emptyListAndField);
                                    FindAndSelectUtils.toggleNavigationState(
                                        this._oSearchSidePanel.getItems()[2].getContent()[0].getItems()[1].getItems()[0],
                                        this._oSearchSidePanel.getItems()[2].getContent()[0].getItems()[1].getItems()[1]);
                                } else {
                                    var sidePanelSearchValue = this._oSearchSidePanel.getItems()[1].getContent()[0].getValue();
                                    FindAndSelectUtils.triggerSearchEvent(sidePanelSearchValue, this.getParent().getGanttCharts(), true, this.getParent().getAggregation("toolbar"), this);
                                    this.setContainerHeight();
                                }
                            }.bind(this)
                        })
                    ]
                }),
                new sap.m.Panel(this.getId() + "-sidePanelFindListHeader", {
                    content: [
                        new sap.m.FlexBox(this.getId() + "-sidePanelFindListHeaderBox", {
                            alignItems: "Center",
                            justifyContent: "SpaceBetween",
                            items: [
                                new sap.m.Text(this.getId() + "-sidePanelFindListHeaderTitle", {
                                    text: this._oRb.getText("GNT_RESULT") + " (" + FindAndSelectUtils._searchResultsCount + ")"
                                }),
                                new sap.m.FlexBox({
                                    items: [
                                        new sap.m.Button(this.getId() + "-sidePanelFindListNavigateUp", {
                                            icon: "sap-icon://navigation-up-arrow",
                                            type: "Transparent",
                                            tooltip: this._oRb.getText("GNT_FIND_PREVIOUS"),
                                            press: function () {
                                                if (FindAndSelectUtils._selectedIndex > 0) {
                                                    FindAndSelectUtils._selectedIndex--;
                                                    FindAndSelectUtils.navigateToSearchResult(this.getParent().getGanttCharts(), this);
                                                }
                                            }.bind(this)
                                        }),
                                        new sap.m.Button(this.getId() + "-sidePanelFindListNavigateDown", {
                                            icon: "sap-icon://navigation-down-arrow",
                                            type: "Transparent",
                                            tooltip: this._oRb.getText("GNT_FIND_NEXT"),
                                            press: function () {
                                                if (FindAndSelectUtils._ganttSearchResults.length - 1 > FindAndSelectUtils._selectedIndex) {
                                                    FindAndSelectUtils._selectedIndex++;
                                                    FindAndSelectUtils.navigateToSearchResult(this.getParent().getGanttCharts(), this);
                                                }
                                            }.bind(this)
                                        })
                                    ]
                                })
                            ]
                        }).addStyleClass("sapUiFindResults")
                    ]
                }).addStyleClass("sapUiNoContentPadding"),
                new sap.m.ScrollContainer(this.getId() + "-searchListContainer", {
                    height: "auto",
                    vertical: true,
                    focusable: true,
                    content:[
                        this.list
                    ]
                })
            ]
        });
        this.setAggregation("_sidePanel", this._oSearchSidePanel, true);
        var oItem = "listItem" + FindAndSelectUtils._selectedIndex;
        if (Element.getElementById(oItem)){
            this._oSearchSidePanel.getItems()[3].getContent()[0].setSelectedItem(oItem);
        }
        this._oSearchSidePanel.getItems()[1].getContent()[0].setValue(this.getParent().getToolbar()._searchFlexBox.getItems()[0].getValue());
    };

    GanttSearchSidePanel.prototype.onBeforeRendering = function () {
        if (this._oSearchSidePanel) {
            this._oSearchSidePanel.destroy();
        }
        this.initSearchSidePanel();
    };

    GanttSearchSidePanel.prototype.onAfterRendering = function () {
        // Set empty list information if there are no results to display
        if (this._oSearchSidePanel.getItems()[3].getContent()[0].getItems().length === 0 &&
            this._oSearchSidePanel.getItems()[1].getContent()[0].getValue() === "") {
            this.setEmptyListInfo(this.emptyListAndField);
        } else if (this._oSearchSidePanel.getItems()[3].getContent()[0].getItems().length === 0 &&
            this._oSearchSidePanel.getItems()[1].getContent()[0].getValue() !== "") {
            this.setEmptyListInfo(!this.emptyListAndField);
        }
        // Set dynamic height for scroll container
        this.setContainerHeight();
        // Scroll for the list items as per the navigation
        var listElement = document.getElementById("listItem" + FindAndSelectUtils._selectedIndex);
        var iPageHeight = this.getParent().getUIArea().getContent()[0].getDomRef().getBoundingClientRect().bottom;
        if (listElement) {
            if (listElement.getBoundingClientRect().bottom > iPageHeight) {
                var topPos = listElement.offsetTop;
                document.getElementById(this.getId() + "-searchListContainer").scrollTop = topPos;
            }
        }
        // Toggle Navigation button state as per the search result count
        FindAndSelectUtils.toggleNavigationState(
            this._oSearchSidePanel.getItems()[2].getContent()[0].getItems()[1].getItems()[0],
            this._oSearchSidePanel.getItems()[2].getContent()[0].getItems()[1].getItems()[1], true);
        // Activate Find button at ContainerToolbar once Side Panel is rendered
        var aToolBarItems = this.getParent().getToolbar().getAllToolbarItems();
        aToolBarItems.forEach(function(oToolBarItem) {
            if (oToolBarItem.getId().includes("findAndSelectSearchButton") && oToolBarItem.getDomRef()) {
                Array.from(oToolBarItem.getDomRef().children).forEach(function(oChildNode) {
                    if (oChildNode.id.includes("findAndSelectSearchButton-inner")) {
                        setTimeout(function() {
                            oChildNode.classList.add("sapMBtnEmphasized");
                        });
                    }
                });
            }
        });

        setTimeout(function() {
            var oInputField = this._oSearchSidePanel.getItems()[1].getContent()[0];
            if (listElement) {
                this._oSearchSidePanel.getItems()[3].getContent()[0].getSelectedItem().focus();
            } else if (oInputField.getDomRef()) {
                var iInputLength = oInputField.getValue().length;
                var oSearchTextDom = oInputField.getDomRef().getElementsByTagName("input")[0];
                oInputField.focus();
                oSearchTextDom.setSelectionRange(iInputLength, iInputLength);
            }
        }.bind(this), 0);
    };

    // Display empty list information to user
    GanttSearchSidePanel.prototype.setEmptyListInfo = function (emptyListAndField) {
        if (emptyListAndField) {
            this.list.addItem(new NavigationListItem({
                text: this._oRb.getText("GNT_EMPTY_LIST_FIELD_INFO")
            }));
        } else {
            this.list.addItem(new NavigationListItem({
                text: this._oRb.getText("GNT_EMPTY_LIST_INFO")
            }));
        }
        this.list.getItems()[0].setEnabled(false);
        var oDomRef = this.list.getItems()[0].getDomRef();
        if (oDomRef) {
            var oEmptyListItem = oDomRef.querySelector(".sapTntNavLIText");
            if (oEmptyListItem){
                oEmptyListItem.style.textAlign = "center";
            }
        }
    };

    // Set dynamic height for the Side Panel container as per the window size
    GanttSearchSidePanel.prototype.setContainerHeight = function () {
        var containerTop = this._oSearchSidePanel.getItems()[2].getDomRef().getBoundingClientRect().bottom;
        var iContainerHeight = document.getElementsByClassName("sapGanttContainerCntWithSidePanel")[0].getBoundingClientRect().bottom;
        var containerHeight = iContainerHeight - containerTop;
        this._oSearchSidePanel.getItems()[3].setHeight(containerHeight + "px");
    };

    // Update content of Side Panel as per the updated data from Toolbar or vice-versa
    GanttSearchSidePanel.prototype._updateContent = function () {
        if (this.list) {
            this.list.destroyItems();
        }
        this.list = this.getParent().getSearchSidePanelList();
        if (!this.list) {
            var aSearchResultsList = FindAndSelectUtils._ganttSearchResults.map(function (oData, index) {
                var listItem = new NavigationListItem({
                    text: ("Gantt " + (oData.ganttID + 1) + ", " + oData.sMatchedValue).substring(0, 200),
                    id: "listItem" + index
                });
                return listItem;
            });
            this.list = new NavigationList({
                items: [aSearchResultsList]
            });
        }
        this.aSidePanelSearchResults = FindAndSelectUtils._ganttSearchResults;
        FindAndSelectUtils._searchResultsCount = this.aSidePanelSearchResults.length;
        this._oSearchSidePanel.getItems()[2].getContent()[0].getItems()[0].setText(this._oRb.getText("GNT_RESULT") + "(" + FindAndSelectUtils._searchResultsCount + ")");
        this._oSearchSidePanel.getItems()[3].destroyContent();
        this._oSearchSidePanel.getItems()[3].addContent(this.list);
        this.addEventListener();
    };

    /**
	 * Listen to Keyboard and Mouse events fired on the side panel search list.
	 * @private
	 * @since 1.100
	 */
    GanttSearchSidePanel.prototype.addEventListener = function () {
            var currentElementID = null;
            this.list.onkeydown = function(oEvent) {
                if (oEvent.target.tagName === "DIV") {
                    currentElementID = oEvent.target.parentElement.id;
                } else if (oEvent.target.tagName === "A")  {
                    currentElementID = oEvent.target.parentElement.parentElement.id;
                }
                if (oEvent.code === "ArrowDown") {
                    if (FindAndSelectUtils._selectedIndex === FindAndSelectUtils._searchResultsCount - 1) {
                    FindAndSelectUtils._selectedIndex = parseInt(currentElementID.replace(/\D/g,''));
                } else {
                    FindAndSelectUtils._selectedIndex = parseInt(currentElementID.replace(/\D/g,'')) + 1;
                }
                } else if (oEvent.code === "ArrowUp") {
                if (FindAndSelectUtils._selectedIndex === 0) {
                    FindAndSelectUtils._selectedIndex = parseInt(currentElementID.replace(/\D/g,''));
                } else {
                    FindAndSelectUtils._selectedIndex = parseInt(currentElementID.replace(/\D/g,'')) - 1;
                    }
                }
                FindAndSelectUtils.updateShapeSelectionANDHighlight(this.getParent().getGanttCharts(), FindAndSelectUtils.previousGanttID);
                this._oSearchSidePanel.getItems()[3].getContent()[0].setSelectedItem("listItem" + FindAndSelectUtils._selectedIndex);
                var selectedRowInfo = FindAndSelectUtils._ganttSearchResults[FindAndSelectUtils._selectedIndex];
                if (FindAndSelectUtils.previousGanttID !== selectedRowInfo.ganttID) {
                    FindAndSelectUtils.previousGanttID = selectedRowInfo.ganttID;
                }
                var oGantt = this.getParent().getGanttCharts()[FindAndSelectUtils.previousGanttID];
                FindAndSelectUtils.scrollToShape(selectedRowInfo, oGantt);
                FindAndSelectUtils.toggleNavigationState(
                    this._oSearchSidePanel.getItems()[2].getContent()[0].getItems()[1].getItems()[0],
                    this._oSearchSidePanel.getItems()[2].getContent()[0].getItems()[1].getItems()[1], true);
            }.bind(this);

            this.list.onclick = function() {
            FindAndSelectUtils._selectedIndex = parseInt(document.activeElement.id.replace(/\D/g,''));
                this._oSearchSidePanel.getItems()[3].getContent()[0].setSelectedItem("listItem" + FindAndSelectUtils._selectedIndex);
                this._oSearchSidePanel.getItems()[3].getContent()[0].getSelectedItem().getDomRef().children[0].focus();
                var selectedRowInfo = FindAndSelectUtils._ganttSearchResults[FindAndSelectUtils._selectedIndex];
                FindAndSelectUtils.updateShapeSelectionANDHighlight(this.getParent().getGanttCharts(), FindAndSelectUtils.previousGanttID);
                if (FindAndSelectUtils.previousGanttID !== selectedRowInfo.ganttID) {
                    FindAndSelectUtils.previousGanttID = selectedRowInfo.ganttID;
                }
                var oGantt = this.getParent().getGanttCharts()[FindAndSelectUtils.previousGanttID];
                FindAndSelectUtils.scrollToShape(selectedRowInfo, oGantt);
                FindAndSelectUtils.toggleNavigationState(
                    this._oSearchSidePanel.getItems()[2].getContent()[0].getItems()[1].getItems()[0],
                    this._oSearchSidePanel.getItems()[2].getContent()[0].getItems()[1].getItems()[1], true);
            }.bind(this);
    };

    GanttSearchSidePanel.prototype.exit = function() {
        this._oSearchSidePanel.destroy();
    };

    return GanttSearchSidePanel;
});
