/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Core",
	"sap/gantt/library",
	"sap/ui/base/ManagedObjectObserver",
	"sap/ui/core/Item",
	"sap/ui/base/Object",
	"sap/base/Log",
	"sap/m/library",
	"sap/m/OverflowToolbar",
	"sap/m/OverflowToolbarLayoutData",
	"sap/m/ToolbarSpacer",
	"sap/m/FlexBox",
	"sap/m/OverflowToolbarButton",
	"sap/m/SegmentedButton",
	"sap/m/SegmentedButtonItem",
	"sap/m/Select",
	"sap/m/ViewSettingsDialog",
	"sap/m/ViewSettingsCustomTab",
	"sap/m/CheckBox",
	"sap/m/Slider",
	"sap/m/Popover",
	"../control/AssociateContainer",
	"sap/ui/fl/variants/VariantManagement",
	"sap/ui/fl/apply/api/ControlVariantApplyAPI",
	"./GanttSearchSidePanel",
	"./FindAndSelectUtils",
	'sap/ui/core/InvisibleText',
	"sap/ui/core/Element",
	"sap/ui/core/Lib",
	"./GanttUtils"
], function (
	Core,
	library,
	ManagedObjectObserver,
	CoreItem,
	BaseObject,
	Log,
	mLibrary,
	OverflowToolbar,
	OverflowToolbarLayoutData,
	ToolbarSpacer,
	FlexBox,
	OverflowToolbarButton,
	SegmentedButton,
	SegmentedButtonItem,
	Select,
	ViewSettingsDialog,
	ViewSettingsCustomTab,
	CheckBox,
	Slider,
	Popover,
	AssociateContainer,
	VariantManagement,
	ControlVariantApplyAPI,
	GanttSearchSidePanel,
	FindAndSelectUtils,
	InvisibleText,
	Element,
	Lib,
	GanttUtils
) {
	"use strict";

	var GanttChartWithTableDisplayType = library.simple.GanttChartWithTableDisplayType,
		PlaceholderType = library.simple.ContainerToolbarPlaceholderType,
		OverflowToolbarPriority = mLibrary.OverflowToolbarPriority,
		FlexDirection = mLibrary.FlexDirection,
		ButtonType = mLibrary.ButtonType,
		PlacementType = mLibrary.PlacementType;

	/**
	 * Creates and initializes a new ContainerToolbar class
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * ContainerToolbar is be used with GanttChartContainer control. Use this control out of sap.gantt library is not supported.
	 *
	 * It's defined as an aggregation of GanttChartContainer to provide actions to all <code>sap.gantt.simple.GanttChartWithTable</code> instances.
	 * By default, it only shows zooming controls and settings button. You can set properties to true to show more build-in buttons.
	 *
	 * @extends sap.m.OverflowToolbar
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.ContainerToolbar
	 */
	var ContainerToolbar = OverflowToolbar.extend("sap.gantt.simple.ContainerToolbar", /** @lends sap.gantt.simple.ContainerToolbar.prototype */ {
		metadata: {
			library: "sap.gantt",
			properties: {

				/**
				 * Flag to show or hide bird eye button on the toolbar
				 */
				showBirdEyeButton: {type: "boolean", defaultValue: false},

				/**
				 * Flag to show or hide display type menu on the toolbar
				 */
				showDisplayTypeButton: {type: "boolean", defaultValue: false},

				/**
				 * Flag to show or hide legend button
				 */
				showLegendButton: {type: "boolean", defaultValue: false},

				/**
				 * Flag to show or hide setting button
				 */
				showSettingButton: {type: "boolean", defaultValue: true},

				/**
				 * Flag to show or hide zoom buttons
				 */
				showTimeZoomControl: {type: "boolean", defaultValue: true},

				/**
				 * Defines the control type to set the zoom rate.
				 */
				zoomControlType: {type: "sap.gantt.config.ZoomControlType", defaultValue: library.config.ZoomControlType.SliderWithButtons},

				/**
				 * Step count of {@link sap.m.Slider}
				 *
				 * This property only relevant if zoomControlType are:
				 * <ul>
				 *   <li>SliderWithButtons</li>
				 *   <li>SliderOnly</li>
				 * </ul>
				 * @see sap.gantt.config.ZoomControlType
				 */
				stepCountOfSlider: {type: "int", defaultValue: 10},

				/**
				 * Array of plain objects that have "key" and "text" properties,
				 * or array of sap.ui.core.Item used to configure the items in the {@link sap.m.Select} control
				 *
				 * This property is only works if the zoomControlType is Select
				 * @see sap.gantt.config.ZoomControlType
				 */
				infoOfSelectItems: {type: "object[]", defaultValue: []},

				/**
				 * Zoom level of all gantt chart instances in GanttChartContainer
				 */
				zoomLevel:{type: "int", defaultValue: 0},

				/**
				 * Defines how the toolbar custom content is aligned.<br>
				 * If set to <code>true</code>, the custom content in the toolbar is right-aligned. If set to
				 * <code>false</code>, it's left-aligned.<br>
				 * If a {@link sap.gantt.simple.ContainerToolbarPlaceholder} with a <code>Spacer</code> type is used in
				 * the content aggregation, the alignment of the content depends on this spacer.
				 */
				alignCustomContentToRight: {type: "boolean", defaultValue: false},

				/**
				 * Flag to show or hide Find and Select search button
				 * Find operation is not going to work for the stock chart and utilization gantt charts with time continuous shapes.
				 * @since 1.100
				 */
				showSearchButton: {type: "boolean", defaultValue: false},

				/**
				 * Defines where the search box should appear on pressing the find button
				 * @since 1.102
				 */
				findMode: {type: "sap.gantt.config.FindMode", defaultValue: library.config.FindMode.Both}
			},
			aggregations: {
				/**
				 * The additional setting items in Setting Dialog
				 */
				settingItems: {type: "sap.gantt.config.SettingItem", multiple: true},

				/**
				 * The legend container that will show when the legend button is pressed
				 */
				legendContainer: {type: "sap.ui.core.Control", multiple: false, visibility: "public"}
			},
			events: {

				/**
				 * fired when zoom stop changed
				 */
				zoomStopChange: {
					parameters: {
						index: {type: "int"},
						selectedItem: {type: "sap.ui.core.Item"}
					}
				},

				/**
				 * Fired when the bird eye button is pressed
				 */
				birdEyeButtonPress: {},

				/**
				 * Fired when a different display type is selected in the display type menu.
				 */
				displayTypeChange: {
					parameters: {
						displayType: {type: "sap.gantt.simple.GanttChartWithTableDisplayType"}
					}
				},

				/**
				 * Fired to invoke Gantt search side panel
				 * @since 1.100
				 */
				ganttSidePanel: {
					parameters: {
						updateSidePanelState: { type: "object"}
					}
				},

				/**
				 * Gets initiated when the find button is pressed on the toolbar
				 * @since 1.102
				 */
				findButtonPress: {},

				/**
				* Gets initiated when the close find button is pressed on the toolbar
				* @since 1.102
				*/
				closeFindButtonPress: {},

				/**
				* Gets initiated when the find popup button is pressed on the sidepanel
				* @since 1.102
				*/
				findPopupButtonPress: {},

				/**
				* Gets initiated when the close button is pressed on the sidepanel
				* @since 1.102
				*/
				closeSidePanelButtonPress: {}
			}
		}
	});

	ContainerToolbar.prototype.init =  function() {
		OverflowToolbar.prototype.init.apply(this, arguments);
		this.mSettingsConfig = {};

		this._oRb = Lib.getResourceBundleFor("sap.gantt");

		this.oObserver = new ManagedObjectObserver(this.observeChanges.bind(this));
		this.oObserver.observe(this, {
			properties: ["showBirdEyeButton", "showLegendButton", "showTimeZoomControl", "showSettingButton",
				"zoomControlType", "infoOfSelectItems", "showDisplayTypeButton", "alignCustomContentToRight", "showSearchButton", "findMode"],
			aggregations: ["content"]
		});

		this.bShallUpdateContent = true;
		this.bZoomControlTypeChanged = false;
		this.bContentAlignChanged = false;
		this._bSuppressZoomStopChange = false;

		this.oToolbarSpacer = new ToolbarSpacer(this.getId() + "-toolbarSpacer");
	};

	ContainerToolbar.prototype.observeChanges = function(oChanges) {
		if (!this.bShallUpdateContent) {
			this.bShallUpdateContent = true;
			this.bZoomControlTypeChanged = oChanges.name === "zoomControlType";
			this.bContentAlignChanged = oChanges.name === "alignCustomContentToRight";
		}
	};

	ContainerToolbar.prototype.exit = function () {
		this.oObserver.disconnect();
		this._destroyIfExists([
			this._oDisplayTypeSegmentedButton, this._oBirdEyeButton, this._oSelect, this._oTimeZoomFlexBox,
			this._oSettingsDialog, this._oSettingsButton, this._oLegendPop, this._oLegendButton, this._oVariantManagement,
			this._searchFlexBox, this._oSearchButton, this._oZoomSlider, this._oZoomInButton, this._oZoomOutButton, this.oToolbarSpacer
		]);
		OverflowToolbar.prototype.exit.apply(this, arguments);
	};

	ContainerToolbar.prototype.applySettings = function (mSettings, oScope){
		mSettings = mSettings || {};
		if (!mSettings.settingItems) {
			// if and only if no setting items are not setup user, given the default
			mSettings.settingItems = library.config.DEFAULT_TOOLBAR_SETTING_ITEMS.map(function(o) { return o.clone(); });
		}
		var aStandardSettings = ["sap_enableNowLine", "sap_enableStatusBar", "sap_enableCursorLine", "sap_enableVerticalLine", "sap_enableAdhocLine", "sap_enableDeltaLine", "sap_enableNonWorkingTime", "sap_enableTimeScrollSync"];
		mSettings.settingItems.forEach(function (oSettingItem) {
			if (oSettingItem.getKey() && aStandardSettings.indexOf(oSettingItem.getKey()) != -1) {
				oSettingItem.setProperty("_isStandard", true, true);
			}
		});
		OverflowToolbar.prototype.applySettings.apply(this, arguments);
		this._createControlsOnly();
		return this;
	};

	/**
	 * Method to determine whether container toolbar's parent is the Gantt Container
	 * @private
	 */

	 ContainerToolbar.prototype._isParentGanttContainer = function () {
		var oParentContainer = this.getParent();
		if (oParentContainer && oParentContainer.isA("sap.gantt.simple.GanttChartContainer")) {
			return true;
		}
		return false;
	};

	ContainerToolbar.prototype.onBeforeRendering = function() {
		if (this.bShallUpdateContent === true) {
			this.updateToolbarContents();
			this.bShallUpdateContent = false;
			this.bZoomControlTypeChanged = false;
			this.bContentAlignChanged = false;
		}
	};

	ContainerToolbar.prototype.updateToolbarContents = function () {
		var aItems = this.getContent(),
			mPlaceholders = {},
			iSpacerPosition = 0;

		var fnNotExisted = function (oControl) {
			return this.getContent().indexOf(oControl) === -1;
		}.bind(this);

		var fnSetupPlaceholder = function (oPlaceholder, bShow, oControl) {
			if (!oPlaceholder._getControl()) {
				oPlaceholder._setControl(oControl);
			}
			oPlaceholder.setProperty("_show", bShow);
		};

		var fnInsertOrRemove = function (sType, bShow, oControl) {
			var oPlaceholder = mPlaceholders[sType],
				bControlNotExisted = fnNotExisted(oControl);

			if (oPlaceholder) {
				fnSetupPlaceholder(oPlaceholder, bShow, oControl);
			} else if (bShow) {
				iSpacerPosition++;
			}

			if (!bControlNotExisted && (oPlaceholder || !bShow)) {
				this.removeContent(oControl);
			} else if (!oPlaceholder && bShow && bControlNotExisted) {
				if (sType === PlaceholderType.VariantManagement) {
					this.insertContent(oControl, 0);
					// Attach event whenever variant changed to update sort and filter of the table
					var fnCallback = function(){
						var oParent = this.getParent();
						oParent.updateAxisTimeSettings();
						oParent.fireVariantApplied();
					};
					ControlVariantApplyAPI.attachVariantApplied(
						{	selector: this.getParent(),
							vmControlId : this._oVariantManagement.getId(),
							callAfterInitialVariant : true,
							callback : fnCallback.bind(this)
						}
					);
				} else if (sType === PlaceholderType.Spacer) {
					this.insertContent(oControl, this.getAlignCustomContentToRight() ? 0 : this.getContent().length - iSpacerPosition + 1);
				} else {
					this.addContent(oControl);
				}
			}
		}.bind(this);

		aItems.forEach(function (oItem) {
			var sType;

			if (BaseObject.isA(oItem, "sap.gantt.simple.ContainerToolbarPlaceholder")) {
				sType = oItem.getType();
				if (mPlaceholders[sType]) {
					Log.warning("There are more than one sap.gantt.simple.ContainerToolbarPlaceholder of the " + sType + " type.");
				}
				mPlaceholders[sType] = oItem;
			}
		});

		if (this.bContentAlignChanged) {
			this.removeContent(this.oToolbarSpacer);
		}
		fnInsertOrRemove(PlaceholderType.SearchButton, this.getShowSearchButton(), this._genSearch());
		fnInsertOrRemove(PlaceholderType.BirdEyeButton, this.getShowBirdEyeButton(), this._genBirdEyeButton());
		fnInsertOrRemove(PlaceholderType.TimeZoomControl, this.getShowTimeZoomControl(), this._genTimeZoomFlexBox());
		fnInsertOrRemove(PlaceholderType.LegendButton, this.getShowLegendButton(), this._genLegend());
		fnInsertOrRemove(PlaceholderType.SettingButton, this.getShowSettingButton(), this._genSettings());
		fnInsertOrRemove(PlaceholderType.DisplayTypeButton, this.getShowDisplayTypeButton(), this._genDisplayTypeButton());
		fnInsertOrRemove(PlaceholderType.Spacer, true, this.oToolbarSpacer);
		fnInsertOrRemove(PlaceholderType.VariantManagement, (this._isParentGanttContainer() && this.getParent().getEnableVariantManagement()), this._genVariantManagement());
	};

	ContainerToolbar.prototype._createControlsOnly = function() {
		this._genBirdEyeButton();
		this._genTimeZoomGroupControls();
		this._genLegend();
		this._genSettings();
		this._genDisplayTypeButton();
		this._genSearch();
	};

	/**
	 * Destroys provided controls safely.
	 * @param {array} aControls Array of controls to destroy.
	 * @private
	 */
	ContainerToolbar.prototype._destroyIfExists = function (aControls) {
		aControls.forEach(function (oControl) {
			if (oControl) {
				oControl.destroy();
			}
		});
	};

	/**
	 * Generate Find and Select operation at Toolbar level.
	 * @private
	 * @since 1.100
	 */
	ContainerToolbar.prototype._genSearch = function () {
		FindAndSelectUtils._ganttSearchResults = [];
		FindAndSelectUtils._searchResultsCount = 0;
		FindAndSelectUtils.previousGanttID = 0;
		FindAndSelectUtils._selectedIndex = 0;

		if (!this._searchFlexBox) {
			//create search flexbox when search button if pressed
			this._searchFlexBox = new sap.m.FlexBox(this.getId() + "-findAndSelectFlexBox", {
				alignItems: "Center",
				justifyContent: "SpaceBetween",
				items: [
					new sap.m.SearchField(this.getId() + "-findAndSelectSearchField", {
						placeholder: this._oRb.getText("GNT_FIND_PLACEHOLDER"),
						search: function(oEvent) {
							if (oEvent.getParameter("clearButtonPressed")) {
								FindAndSelectUtils.updateShapeSelectionANDHighlight(this.getParent().getGanttCharts(), FindAndSelectUtils.previousGanttID);
								FindAndSelectUtils._ganttSearchResults = [];
								FindAndSelectUtils._searchResultsCount = 0;
								FindAndSelectUtils._selectedIndex = 0;
								this._searchFlexBox.getItems()[2].setText(this._oRb.getText("GNT_EMPTY_RESULT_INFO_TOOLBAR"));
								FindAndSelectUtils.toggleNavigationState(this._searchFlexBox.getItems()[1], this._searchFlexBox.getItems()[3]);
							} else {
								var sSearchValue = this._searchFlexBox.getItems()[0].getValue();
								FindAndSelectUtils.triggerSearchEvent(sSearchValue, this.getParent().getGanttCharts(), false, this);
							}
						}.bind(this)
					}),
					new sap.m.Button(this.getId() + "-findAndSelectNavigateBackward", {
						icon: "sap-icon://nav-back",
						type: "Transparent",
						tooltip: this._oRb.getText("GNT_FIND_PREVIOUS"),
						press: function() {
							if (FindAndSelectUtils._selectedIndex > 0) {
								FindAndSelectUtils._selectedIndex--;
								this._searchFlexBox.getItems()[2].setText("(" + (FindAndSelectUtils._selectedIndex + 1) + "/" + FindAndSelectUtils._searchResultsCount + ")");
								FindAndSelectUtils.navigateToSearchResult(this.getParent().getGanttCharts(), this);
								FindAndSelectUtils.toggleNavigationState(this._searchFlexBox.getItems()[1], this._searchFlexBox.getItems()[3]);
							}
						}.bind(this)
					}),
					new sap.m.Text(this.getId() + "-findAndSelectResultText", {
						text: this._oRb.getText("GNT_EMPTY_RESULT_INFO_TOOLBAR")
					}),
					new sap.m.Button(this.getId() + "-findAndSelectNavigateForward", {
						icon: "sap-icon://navigation-right-arrow",
						type: "Transparent",
						tooltip: this._oRb.getText("GNT_FIND_NEXT"),
						press: function() {
							if (FindAndSelectUtils._searchResultsCount - 1 > FindAndSelectUtils._selectedIndex) {
								FindAndSelectUtils._selectedIndex++;
								this._searchFlexBox.getItems()[2].setText("(" + (FindAndSelectUtils._selectedIndex + 1) + "/" + FindAndSelectUtils._searchResultsCount + ")");
								FindAndSelectUtils.navigateToSearchResult(this.getParent().getGanttCharts(), this);
								FindAndSelectUtils.toggleNavigationState(this._searchFlexBox.getItems()[1], this._searchFlexBox.getItems()[3]);
							}
						}.bind(this)
					}),
					new sap.m.Button(this.getId() + "-findAndSelectNavigateSidePanel", {
						icon: "sap-icon://list",
						type: "Transparent",
						tooltip: this._oRb.getText("GNT_SEARCH_SIDE_PANEL"),
						press: function() {
							if (!this.getParent().getShowSearchSidePanel()) {
								this._openSidePanel();
							}
						}.bind(this)
					}),
					new sap.m.Button(this.getId() + "-findAndSelectClose", {
						text: this._oRb.getText("GNT_FIND_CLOSE"),
						type: "Transparent",
						tooltip: this._oRb.getText("GNT_FIND_CLOSE"),
						press: function () {
							this.fireCloseFindButtonPress();
							FindAndSelectUtils.updateShapeSelectionANDHighlight(this.getParent().getGanttCharts(), FindAndSelectUtils.previousGanttID);
							FindAndSelectUtils.updateToolbarItems(this, false);
							FindAndSelectUtils.toggleNavigationState(this._searchFlexBox.getItems()[1], this._searchFlexBox.getItems()[3]);
						}.bind(this)
					}),
					new sap.m.ToolbarSeparator(this.getId() + "-findAndSelectSeparator", {})
				]
			});
		}

		if (this._oSearchButton) {
			return this._oSearchButton;
		}

		//Create search button on Toolbar
		this._oSearchButton = new OverflowToolbarButton(this.getId() + "-findAndSelectSearchButton", {
			icon: "sap-icon://sys-find",
			type: ButtonType.Transparent,
			text: this._oRb.getText("GNT_FIND"),
			tooltip: this._oRb.getText("GNT_FIND"),
			ariaDescribedBy: this.getId() + "-findAndSelectSearchButton",
			layoutData: new OverflowToolbarLayoutData({priority: OverflowToolbarPriority.High}),
			press: function () {
				if (this.getParent().getShowSearchSidePanel()) {
					var oInputField = this.getParent().getSearchSidePanel()._oSearchSidePanel.getItems()[1].getContent()[0];
					if (oInputField.getDomRef()){
						var iInputLength = oInputField.getValue().length;
						var oSearchTextDom = oInputField.getDomRef().getElementsByTagName("input")[0];
						oInputField.focus();
						oSearchTextDom.setSelectionRange(0, iInputLength);
					}
				} else {
					this.fireFindButtonPress();
					var findMode = library.config.FindMode;
					var sFindMode = this.getFindMode();
					if (sFindMode === findMode.Toolbar || sFindMode === findMode.Both) {
						FindAndSelectUtils.updateToolbarItems(this, true);
						Element.getElementById(this.getId() + "-findAndSelectNavigateSidePanel").setVisible(sFindMode === findMode.Both);
						FindAndSelectUtils.toggleNavigationState(this._searchFlexBox.getItems()[1], this._searchFlexBox.getItems()[3], true);
					} else if (sFindMode === findMode.SidePanel) {
						var aAllItems = this.getAllToolbarItems(),
						bSearchFlexbox = false,
						iToolbarSpacerIndex = -1;

						aAllItems.forEach(function(oToolBarItem, index) {
							if (oToolBarItem.isA("sap.m.ToolbarSpacer")) { iToolbarSpacerIndex = index; }
							if (oToolBarItem.getId().includes("findAndSelectFlexBox")) {
								bSearchFlexbox = true;
							}
						});
						if (!bSearchFlexbox) {
							if (iToolbarSpacerIndex > -1) {
								this.insertContent(this._searchFlexBox, iToolbarSpacerIndex + 1);
							} else {
								this.insertContent(this._searchFlexBox, 1);
							}
						}
						this._openSidePanel();
					}
				}
			}.bind(this)
		});

		return this._oSearchButton;
	};

	/**
	 * Method to open search side panel
	 * @private
	 */
	 ContainerToolbar.prototype._openSidePanel = function() {
		this._sidePanelPromise = new Promise(function(resolve, reject){
			this._resolveSidePanel = resolve;
			this._rejectSidePanel = reject;
		}.bind(this));

		this.fireGanttSidePanel({
			updateSidePanelState: {enable: this._resolveSidePanel, disable: this._rejectSidePanel}
		});

		this._sidePanelPromise.then(function() {
			var aAllItems = this.getAllToolbarItems();
			this.getParent().setShowSearchSidePanel(true);
			if (!this._searchSidePanel) {
				this._searchSidePanel = new GanttSearchSidePanel();
				this.getParent().setSearchSidePanel(this._searchSidePanel);
			}

			aAllItems.forEach(function(oToolBarItem) {
				if (oToolBarItem.getId().includes("findAndSelectFlexBox")) {
					oToolBarItem.setVisible(false);
				} else if (oToolBarItem.getId().includes("findAndSelectSearchButton")) {
					oToolBarItem.setVisible(true);
				}
			});
		}.bind(this));
	};

	/**
	 * Method to generate Variant Management.
	 * @private
	 */
	ContainerToolbar.prototype._genVariantManagement = function() {
		if (this._oVariantManagement == null){

			this._oVariantManagement = new VariantManagement({
				"id": this.getId() + "-variantManagement",
				"for": [
					this.getParent()//container
				 ],
				"executeOnSelectionForStandardDefault" : true
			}).addStyleClass("sapUiCompVarMngmt").addStyleClass("sapMBarChild").addStyleClass("sapUiCompSmartTableToolbarContent");
		}

		return this._oVariantManagement;
	};

	ContainerToolbar.prototype._genDisplayTypeButton = function() {
		if (this._oDisplayTypeSegmentedButton) {
			return this._oDisplayTypeSegmentedButton;
		}

		this._oDisplayTypeSegmentedButton = new SegmentedButton(this.getId() + "-displayTypeSegmentedButton", {
			selectedKey: GanttChartWithTableDisplayType.Both,
			selectionChange: function(oEvent) {
				this.fireDisplayTypeChange({
					displayType: oEvent.getParameter("item").getKey()
				});
			}.bind(this),
			items: [
				new SegmentedButtonItem(this.getId() + "-" + GanttChartWithTableDisplayType.Both + "SegmentedButtonItem", {
					tooltip: this._oRb.getText("TLTP_DISPLAY_TYPE_BUTTON_BOTH"),
					icon: "sap-icon://Chart-Tree-Map",
					key: GanttChartWithTableDisplayType.Both
				}),
				new SegmentedButtonItem(this.getId() + "-" + GanttChartWithTableDisplayType.Chart + "SegmentedButtonItem", {
					tooltip: this._oRb.getText("TLTP_DISPLAY_TYPE_BUTTON_CHART"),
					icon: "sap-icon://along-stacked-chart",
					key: GanttChartWithTableDisplayType.Chart
				}),
				new SegmentedButtonItem(this.getId() + "-" + GanttChartWithTableDisplayType.Table + "SegmentedButtonItem", {
					tooltip: this._oRb.getText("TLTP_DISPLAY_TYPE_BUTTON_TABLE"),
					icon: "sap-icon://table-view",
					key: GanttChartWithTableDisplayType.Table
				})
			]
		});
	};

	/**
	 * Generate a button which show a bird icon for showing all shapes in the visible rows.
	 *
	 * @returns {sap.m.Button} generate a button if not exists yet
	 * @private
	 */
	ContainerToolbar.prototype._genBirdEyeButton = function() {
		if (this._oBirdEyeButton == null){
			var fnBirdEyeTooltip = function(oRb) {
				var sBirdEye = oRb.getText("TXT_BRIDEYE"),
					sTxtVisibleRows = oRb.getText("TXT_BRIDEYE_RANGE_VISIBLE_ROWS"),
					sTooltipVisibleRows = oRb.getText("TLTP_BRIDEYE_ON_VISIBLE_ROWS");

				return sBirdEye + " (" + sTxtVisibleRows + "): " + sTooltipVisibleRows;
			};

			this._oBirdEyeButton = new OverflowToolbarButton(this.getId() + "-birdEyeButton", {
				icon: "sap-icon://show",
				type: ButtonType.Transparent,
				text: this._oRb.getText("TXT_BIRDEYE_BUTTON"),
				tooltip: fnBirdEyeTooltip(this._oRb),
				press: this.fireBirdEyeButtonPress.bind(this)
			});
		}

		return this._oBirdEyeButton;
	};

	ContainerToolbar.prototype._getSelectItems = function() {
		var aSelectItems = [],
			aInfoOfSelectItems = this.getInfoOfSelectItems();

		if (aInfoOfSelectItems.length > 0 ) {
			if (aInfoOfSelectItems[0] instanceof CoreItem) {
				aSelectItems = aInfoOfSelectItems;
			} else {
				for (var i = 0; i < aInfoOfSelectItems.length; i++) {
					aSelectItems.push(new CoreItem({
						key: aInfoOfSelectItems[i].key,
						text: aInfoOfSelectItems[i].text
					}));
				}
			}
		}
		return aSelectItems;
	};

	ContainerToolbar.prototype._focusOnZoom = function(iCurrentZoomLevel, iZoomLevel) {
		var oGanttContainer = this.getParent();
		if (oGanttContainer && oGanttContainer.isA("sap.gantt.simple.GanttChartContainer") && oGanttContainer.getEnableAutoFocusOnZoom() && iCurrentZoomLevel < iZoomLevel) {
			GanttUtils._calculateSelectedShapeMinTime(oGanttContainer);
		}
	};

	ContainerToolbar.prototype._genTimeZoomGroupControls = function() {
		var ZoomControlType = library.config.ZoomControlType;

		var sZoomControlType = this.getZoomControlType();

		var fnUpdateZoomLevel = function(iZoomLevel) {
			clearTimeout(this._iLiveChangeTimer);
			this._iLiveChangeTimer = -1;
			this._focusOnZoom(this.getZoomLevel(), iZoomLevel);
			this.setZoomLevel(iZoomLevel, true);
		};

		this.fireEvent("_zoomControlTypeChange",{zoomControlType: sZoomControlType});
		if (sZoomControlType === ZoomControlType.None){
			return [];
		}
		if (sZoomControlType === ZoomControlType.Select) {
			if (this._oSelect) {
				return [this._oSelect];
			}

			var aSelectItems = this._getSelectItems();
			this._oSelect = new Select(this.getId() + "-zoomSelect", {
				items: aSelectItems,
				selectedItem: aSelectItems[this.getZoomLevel()],
				change: function (oEvent) {
					var oSelect = oEvent.getSource();
					var oSelectedItem = oSelect.getSelectedItem();
					var iSelectItemIndex = oSelect.indexOfItem(oSelectedItem);
					this._iLiveChangeTimer = setTimeout(fnUpdateZoomLevel.bind(this), 200,[iSelectItemIndex, oSelectedItem]);
				}.bind(this)
			});

			return [this._oSelect];

		} else {
			if (!this._oZoomLevelInvisibleText) {
				this._oZoomLevelInvisibleText = new InvisibleText();
				this._oZoomLevelInvisibleText.toStatic(); //Be aware that without a call the screen reader does not read the content.
			}
			if (this._oZoomSlider) {

				this._oZoomSlider.setMax(this.getStepCountOfSlider() - 1);
				if (sZoomControlType === ZoomControlType.SliderOnly) {
					return [this._oZoomSlider];
				} else if (sZoomControlType === ZoomControlType.ButtonsOnly) {
					return [this._oZoomOutButton, this._oZoomInButton];
				} else {
					return [this._oZoomOutButton, this._oZoomSlider, this._oZoomInButton];
				}
			}
			this._oZoomSlider = new Slider(this.getId() + "-zoomSlider", {
				width: "200px",
				max: this.getStepCountOfSlider() - 1,
				value: this.getZoomLevel(),
				min: 0,
				step: 1,
				liveChange: function (oEvent) {
					var iSliderValue = parseInt(oEvent.getParameter("value"));
					// Clear the previous accumulated event
					clearTimeout(this._iLiveChangeTimer);
					this._iLiveChangeTimer = setTimeout(fnUpdateZoomLevel.bind(this), 200, iSliderValue);
					this._oZoomLevelInvisibleText.setText(this._oRb.getText("TLTP_SLIDER_ZOOM_LEVEL") + ": " + iSliderValue);
				}.bind(this)
			});

			var fnZoomButtonPressHandler = function(bZoomIn) {
				return function(oEvent){
					this._iLiveChangeTimer = setTimeout(function () {
						var iSliderStepChangeValue = parseInt(bZoomIn ? this._oZoomSlider.stepUp(1).getValue() :
							this._oZoomSlider.stepDown(1).getValue());
						fnUpdateZoomLevel.call(this, iSliderStepChangeValue);
						var iMax = this._oZoomSlider.getMax(),
							iMin = this._oZoomSlider.getMin();
						this._oZoomLevelInvisibleText.setText(this._oRb.getText("TLTP_SLIDER_ZOOM_LEVEL") + ": " + iSliderStepChangeValue);
						if (iSliderStepChangeValue === iMax) {
							this._oZoomOutButton.focus();
						} else if (iSliderStepChangeValue === iMin) {
							this._oZoomInButton.focus();
						}
					}.bind(this), 200);
				};
			};

			this._oZoomInButton = new OverflowToolbarButton(this.getId() + "-zoomInButton", {
				icon: "sap-icon://zoom-in",
				type: ButtonType.Transparent,
				tooltip: this._oRb.getText("TLTP_SLIDER_ZOOM_IN"),
				ariaDescribedBy: [this._oZoomLevelInvisibleText.getId()],
				press: fnZoomButtonPressHandler(true /**bZoomIn*/).bind(this)
			});

			this._oZoomOutButton = new OverflowToolbarButton(this.getId() + "-zoomOutButton", {
				icon: "sap-icon://zoom-out",
				type: ButtonType.Transparent,
				tooltip: this._oRb.getText("TLTP_SLIDER_ZOOM_OUT"),
				ariaDescribedBy: [this._oZoomLevelInvisibleText.getId()],
				press: fnZoomButtonPressHandler(false /**bZoomIn*/).bind(this)
			});
			return [this._oZoomOutButton, this._oZoomSlider, this._oZoomInButton];
		}

	};

	ContainerToolbar.prototype._genTimeZoomFlexBox = function () {
		if (this._oTimeZoomFlexBox) {
			if (this.bZoomControlTypeChanged) {
				this._oTimeZoomFlexBox.removeAllItems();

				this._genTimeZoomGroupControls().forEach(function (oItem) {
					this._oTimeZoomFlexBox.addItem(oItem);
				}.bind(this));
			}

			return this._oTimeZoomFlexBox;
		}

		this._oTimeZoomFlexBox = new FlexBox(this.getId() + "-timeZoomFlexBox", {
			items: this._genTimeZoomGroupControls(),
			layoutData: new OverflowToolbarLayoutData({
				priority: OverflowToolbarPriority.NeverOverflow
			})
		});
		return this._oTimeZoomFlexBox;
	};

	ContainerToolbar.prototype._genSettingItems = function () {
		return this.getSettingItems().map(function (oSettingItem) {
			var oCheckBox = new CheckBox(this.getId() + "-" + oSettingItem.getKey() + "CheckBox", {
				name: oSettingItem.getKey(),
				text: oSettingItem.getDisplayText(),
				tooltip: oSettingItem.getTooltip(),
				selected: oSettingItem.getChecked()
			}).addStyleClass("sapUiSettingBoxItem");
			oCheckBox.isStandard = oSettingItem._getIsStandard();
			return oCheckBox;
		}.bind(this));
	};

	ContainerToolbar.prototype._genSettings = function () {
		if (this._oSettingsButton) {
			if (this._oSettingsBox && (this._oSettingsBox.getItems().length === this.getSettingItems().length)) {
				var oSettingItems = this.getSettingItems();

				if (this._aOriginalSettings) {
					var aSettingItemsUniqueKeys = {};
					var aOriginalSettingsUniqueKeys = {};
					oSettingItems.forEach(function(item){
						if (!aSettingItemsUniqueKeys[item.getKey()]) {
							aSettingItemsUniqueKeys[item.getKey()] = true;
						}
					});

					// removing setting item if it is removed from aggregation;
					for (var j = this._aOriginalSettings.length - 1; j >=  0; j--) {
						if (!aSettingItemsUniqueKeys[this._aOriginalSettings[j].getKey()]) {
							this._aOriginalSettings.splice(j,1);
						} else {
							aOriginalSettingsUniqueKeys[this._aOriginalSettings[j].getKey()] = true;
						}
					}

					//adding setting item if added back to aggregation;
					oSettingItems.forEach(function(item){
						if (!aOriginalSettingsUniqueKeys[item.getKey()]) {
							this._aOriginalSettings.push(item.clone());
						}
					}.bind(this));

				}
				var aCheckBoxes = this._oSettingsBox.getItems(),
					aSettingItems = this._aOriginalSettings ? this._aOriginalSettings : this.getSettingItems();

				for (var i = 0; i < aCheckBoxes.length; i++) {
					var oCheckBox = aCheckBoxes[i],
						oSettingItem = aSettingItems[i];

					oCheckBox.setName(oSettingItem.getKey());
					oCheckBox.setText(oSettingItem.getDisplayText());
					oCheckBox.setTooltip(oSettingItem.getTooltip());
					oCheckBox.setSelected(oSettingItem.getChecked());
				}

			} else {
				this._oSettingsBox.destroyItems();

				this._genSettingItems().forEach(function (oSettingItem) {
					this._oSettingsBox.addItem(oSettingItem);
				}.bind(this));
			}

			return this._oSettingsButton;
		}

		this._oSettingsBox = new FlexBox(this.getId() + "-settingsFlexBox", {
			direction: FlexDirection.Column,
			items: this._genSettingItems()
		}).addStyleClass("sapUiSettingBox");

		this._oSettingsDialog = new ViewSettingsDialog(this.getId() + "-settingsDialog", {
			title: this._oRb.getText("SETTINGS_DIALOG_TITLE"),
			customTabs: [new ViewSettingsCustomTab({content: this._oSettingsBox})],
            confirm: function() {
				this._fireSettingItemChangedEvent();
                if (this._isParentGanttContainer()) {
					this.getParent()._onSplitterResize();
                }
            }.bind(this),
			cancel: function() {
				// when cancel, the selected state should be restored when reopen
				this.updateSettingItems(this.mSettingsConfig);
			}.bind(this),
			reset: function() {
				this._genSettings();
			}.bind(this)
		});

		this._oSettingsButton = new OverflowToolbarButton(this.getId() + "-settingsButton", {
			icon: "sap-icon://action-settings",
			type: ButtonType.Transparent,
			text: this._oRb.getText("TXT_SETTING_BUTTON"),
			tooltip: this._oRb.getText("TXT_SETTING_BUTTON"),
			layoutData: new OverflowToolbarLayoutData({priority: OverflowToolbarPriority.High}),
			press: function (oEvent) {
				this._oSettingsDialog.open();
			}.bind(this)
		});

		return this._oSettingsButton;
	};

	ContainerToolbar.prototype._genLegend = function () {
		if (this._oLegendButton) {
			return this._oLegendButton;
		}

		if (!this._oLegendPop) {
			this._oLegendPop = new Popover(this.getId() + "-legendPopover", {
				placement: PlacementType.Bottom,
				showArrow: false,
				showHeader: false
			});
		}

		this._oLegendButton = new OverflowToolbarButton(this.getId() + "-legendButton", {
			icon: "sap-icon://legend",
			type: ButtonType.Transparent,
			text: this._oRb.getText("TXT_LEGEND_BUTTON"),
			tooltip: this._oRb.getText("TLTP_SHOW_LEGEND"),
			layoutData: new OverflowToolbarLayoutData({
				priority: OverflowToolbarPriority.High,
				closeOverflowOnInteraction: false
			}),
			press: function (oEvent) {
				var oLegendPop = this._oLegendPop;
				if (oLegendPop.isOpen()){
					oLegendPop.close();
				} else {
					oLegendPop.openBy(this._oLegendButton);
					this._oLegendButton.setTooltip(this._oRb.getText("TLTP_HIDE_LEGEND"));
				}
			}.bind(this)
		});
		return this._oLegendButton;
	};

	ContainerToolbar.prototype.updateZoomLevel = function(iZoomLevel){
		this._bSuppressZoomStopChange = true;
		this.setZoomLevel(iZoomLevel);
	};

	ContainerToolbar.prototype.setZoomLevel = function (iZoomLevel, bInvalidate) {
		if (!isNaN(iZoomLevel)) {

			var iCurrentZoomLevel = this.getZoomLevel();

			if (this._oZoomSlider && this._oZoomOutButton && this._oZoomInButton) {
				var iMax = this._oZoomSlider.getMax(),
					iMin = this._oZoomSlider.getMin();

				if (iZoomLevel === iMax) {
					this._oZoomInButton.setEnabled(false);
					this._oZoomOutButton.setEnabled(true);
				} else if (iZoomLevel === iMin) {
					this._oZoomInButton.setEnabled(true);
					this._oZoomOutButton.setEnabled(false);
				} else {
					this._oZoomInButton.setEnabled(true);
					this._oZoomOutButton.setEnabled(true);
				}
			}

			if (iCurrentZoomLevel !== iZoomLevel){
				this.setProperty("zoomLevel", iZoomLevel, bInvalidate);

				if (this._oZoomSlider) {
					this._oZoomSlider.setValue(iZoomLevel);
					if (!this._bSuppressZoomStopChange){
						this.fireZoomStopChange({index: iZoomLevel});
					}
				}

				if (this._oSelect) {
					this._oSelect.setSelectedItem(this._oSelect.getItems()[iZoomLevel]);
					if (!this._bSuppressZoomStopChange){
						this.fireZoomStopChange({index: iZoomLevel, selectedItem: this._oSelect.getSelectedItem()});
					}
				}
			}
		}

		this._bSuppressZoomStopChange = false;
		return this;
	};

	ContainerToolbar.prototype.setLegendContainer = function (oLegendContainer){
		this.setAggregation("legendContainer", oLegendContainer);

		if (!this._oLegendPop) {
			this._oInvisibleLabelText = new InvisibleText();
			this._oInvisibleLabelText .toStatic(); //Be aware that without a call the screen reader does not read the content.
			this.addDependent(this._oInvisibleLabelText);
			this._oLegendPop = new Popover(this.getId() + "-legendPopover", {
				placement: PlacementType.Bottom,
				showArrow: false,
				showHeader: false,
				ariaLabelledBy: this._oInvisibleLabelText.getId(),
				afterClose: function(oEvent){
					this._oLegendButton.setTooltip(this._oRb.getText("TLTP_SHOW_LEGEND"));
				}.bind(this)
			});
		}
		//legend function invoked by view parser
		if (oLegendContainer) {
			this._oLegendPop.removeAllContent();
			this._oLegendPop.addContent(new AssociateContainer({
				content: oLegendContainer
				})
			);
		}
	};

	ContainerToolbar.prototype._fireSettingItemChangedEvent = function(){
		var aSettingItems = this._oSettingsBox.getItems();
		var mChangedParams = [];
		for (var i = 0; i < aSettingItems.length; i++) {
			var sSettingName = aSettingItems[i].getName(),
				sPropName = sSettingName.substr(4), // remove sap_
				bOldValue = "",
				bNewValue = aSettingItems[i].getSelected();
				// Check the setting item is custom or standard and get the old value
				if (aSettingItems[i].isStandard) {
					bOldValue = this.mSettingsConfig[sPropName];
				} else {
					bOldValue = this.mSettingsConfig[sSettingName];
				}
			if (bOldValue !== bNewValue) {
				mChangedParams.push({
					name: sSettingName,
					value: bNewValue,
					isStandard: aSettingItems[i].isStandard
				});
				if (!aSettingItems[i].isStandard) {
					this.mSettingsConfig[sSettingName] = bNewValue;
				}
			}
		}

		// DO not fire if nothing changed
		if (mChangedParams.length > 0) {
			this.fireEvent("_settingsChange", mChangedParams);
		}
	};

	/**
	 * Update the setting items selection state
	 *
	 * @param {object} mChanges delta settings configuration change
	 */
	ContainerToolbar.prototype.updateSettingsConfig = function(mChanges, bInitialUpdate) {
		var aSettingItems = this.getSettingItems();

		Object.keys(mChanges).forEach(function(property){
			this.mSettingsConfig[property] = mChanges[property];
			var oSettingItem = aSettingItems.filter(function(oItem){
				return oItem.getKey().endsWith(property);
			})[0];
			if (oSettingItem) {
				oSettingItem.setChecked(mChanges[property]);
			}
		}.bind(this));

		this.updateSettingItems(mChanges);
		// update mSettingsConfig with custom settings on initial loading
		this._updateMSettingsConfigWithCustom(aSettingItems);

		if (bInitialUpdate && !this._aOriginalSettings) {
			this._aOriginalSettings = [];
			this.getSettingItems().forEach(function (oSettingItem) {
				this._aOriginalSettings.push(oSettingItem.clone());
			}.bind(this));
		}
	};

	/**
	 * Update custom setting items selection state
	 */
	ContainerToolbar.prototype.updateCustomSettingsConfig = function() {
		var oChanges = {};
		var aSettingItems = this.getSettingItems();
		this._updateMSettingsConfigWithCustom(aSettingItems, oChanges);

		this.updateSettingItems(oChanges);
	};

	/**
	 * Update custom setting items when variant management is disabled
	 * @param {array} aCustomSettings custom setting item
	 */
	ContainerToolbar.prototype.updateCustomSettings = function(aCustomSettings) {
		var aSettingItems = this.getSettingItems();
		aCustomSettings.forEach(function(oCustomSetting) {
			this.mSettingsConfig[oCustomSetting.name] = oCustomSetting.value;
			var oSettingItem = aSettingItems.filter(function(oItem){
				return oItem.getKey().endsWith(oCustomSetting.name);
			})[0];
			if (oSettingItem) {
				oSettingItem.setChecked(oCustomSetting.value);
			}
		}.bind(this));
	};

	/**
	 * Update mSettingsConfig custom settings
	 * @param {array} aSettingItems settings items
	 * @param {object} oChanges delta settings configuration change
	 */
	ContainerToolbar.prototype._updateMSettingsConfigWithCustom = function(aSettingItems, oChanges) {
		aSettingItems.forEach(function(oItem) {
			var sKey = oItem.getKey();
			var bSettingValue = oItem.getChecked();
			if (!oItem._getIsStandard() && this.mSettingsConfig[sKey] !== bSettingValue) {
				if (oChanges) {
					oChanges[sKey] = bSettingValue;
				}
				this.mSettingsConfig[sKey] = oItem.getChecked();
			}
		}.bind(this));
	};

	ContainerToolbar.prototype.updateSettingItems = function(mChanges) {
		var aSettingItems = this._oSettingsBox.getItems();
		Object.keys(mChanges).forEach(function(property){
			var oSettingItem = aSettingItems.filter(function(oCheckBox){
				return oCheckBox.getName().endsWith(property);
			})[0];

			if (oSettingItem) {
				oSettingItem.setSelected(mChanges[property]);
			}
		});
	};

	ContainerToolbar.prototype.getAllToolbarItems = function () {
		return this.getContent();
	};

	ContainerToolbar.prototype.setInfoOfSelectItems = function(aItems, bSuppressInvalidate) {
		this.setProperty("infoOfSelectItems", aItems, bSuppressInvalidate);
		var that = this;
		if (this._oSelect) {
			var aSelectItems = this._getSelectItems();
			this._oSelect.removeAllItems();
			aSelectItems.forEach(function(item) {
				that._oSelect.addItem(item);
			});
		}
	};

	return ContainerToolbar;
}, true);
