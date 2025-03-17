/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Control",
	"sap/ui/core/Lib",
	"sap/m/NavContainer",
	"sap/m/Page",
	"sap/m/List",
	"sap/m/StandardListItem",
	"../control/AssociateContainer"
], function (Control, Lib, NavContainer, Page, List, StandardListItem, AssociateContainer) {
	"use strict";

	/**
	 * Creates and initializes a new legend container.
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * <p>
	 *    The LegendContainer control uses the NavContainer control to handle hierarchical navigation between legend sections. The LegendContainer control
	 *    contains an initial navigation page. Both the initial navigation page and legend sections are Page controls, We put the List Legend control inside the Page control internally.
	 * </p>
	 * <p>
	 *    If you only add one legend, the initial navigation page won't display. Whenever you open legend container, the legend container will restore the page last time you quit with.
	 * </p>
	 *
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.LegendContainer
	 */
	var LegendContainer = Control.extend("sap.gantt.simple.LegendContainer", /** @lends sap.gantt.simple.LegendContainer.prototype */ {
		metadata: {
			library: "sap.gantt",
			properties: {

				/**
				 * Width of the legend navigation. When the width specified is smaller than a section content, a horizontal scroll bar appears.width of the legend navigation. When the width specified is smaller than a section content, a horizontal scroll bar appears.
				 */
				width: {type : "sap.ui.core.CSSSize", group: "Misc", defaultValue: "200px"},

				/**
				 * Height of the legend navigation. When the height specified is smaller than a section content, a vertical scroll bar appears.
				 */
				height: {type : "sap.ui.core.CSSSize", group: "Misc", defaultValue: "200px"},

				/**
				 * shows all the list legends in flat structure instead of navigation list.
				 * restriction - will work only with list legends.
				 * @since 1.92
				 */
				 enableFlatLegends: {type: "boolean", defaultValue: false}
			},
			defaultAggregation : "legends",
			aggregations : {

				/**
				 * Legends inside the container, they could be instances of List Legend or Dimension Legend.
				 */
				legends : {type: "sap.ui.core.Control", multiple: true, visibility: "public", singularName: "legend"}
			}
		}
	});

	/**
	 * Creates a control instance of NavContainer for the legend
	 *
	 * @private
	 */
	LegendContainer.prototype.init =  function(){
		this.initNavContainer();
		this._sCurrentPageTitle = null;

		this.oRb = Lib.getResourceBundleFor("sap.gantt");
	};

	LegendContainer.prototype.initNavContainer = function() {
		/**
		 * clearing container on every rerender,
		 * so that any changes applied on dynamically is reflected.
		 */
		this._oNavContainer = null;
		this._sCurrentPageTitle = null;

		this._oNavContainer = new NavContainer({
			autoFocus: false,
			afterNavigate: function(oEvent) {
				this._sCurrentPageTitle = oEvent.getParameter("to").getTitle();
			}.bind(this)
		});
	};

	LegendContainer.prototype.onBeforeRendering = function(oEvent) {
		this.initNavContainer();

		// delegate the size from legend container to NavContainer
		this._updateNavContainerSize();

		// add an initial page if more than one legend
		this._addInitialPageIfNecessary();

		// convert legend to pages for navigation
		this._addLegendsToNavContainer();

	};

	LegendContainer.prototype._updateNavContainerSize = function(){
		this._oNavContainer.setWidth(this.getWidth());
		this._oNavContainer.setHeight(this.getHeight());
	};

	/**
	 * checks if flat legend structure should be rendered or not based on enableFlatLegends flag.
	 * Also checking if the all the legends are listLegends.
	 * falt legend structure is only applicable for listLegends.
	 * @returns boolean
	 */
	LegendContainer.prototype._shouldRenderFlatLegendList = function() {
		var isListLegend = true;
		this.getLegends().forEach(function(oLegend) {
			isListLegend = isListLegend && oLegend.isA("sap.gantt.simple.ListLegend");
		});
		return isListLegend && this.getEnableFlatLegends();
	};

	/**
	 * checks if only single ListLegend is visible.
	 * @returns boolean
	 */
	LegendContainer.prototype._isSingleVisibleList = function() {
		var VisibleListCount = 0;
		this.getLegends().forEach(function(oLegend) {
			if (oLegend.getVisible()) {
				VisibleListCount++;
			}
		});
		return VisibleListCount <= 1;
	};

	/**
	 * Adds List Legends/Dimension legends to Container.
	 * Creates 2step navigation/single list based on enableFlatLegends Flag.
	 */
	LegendContainer.prototype._addLegendsToNavContainer = function() {
		if (!this._shouldRenderFlatLegendList() || this.getLegends().length === 1 || this._isSingleVisibleList()) {
			this.getLegends().forEach(function(oLegend, _, aLegends) {
				if (oLegend.getVisible()) {
					var oPage = new Page({
						title: oLegend.getTitle(),
						backgroundDesign: sap.m.PageBackgroundDesign.Solid,
						enableScrolling: true,
						showNavButton: aLegends.length > 1 && !this._isSingleVisibleList(),
						content: new AssociateContainer({
							content: oLegend
						}),
						navButtonPress: function(oEvent) {
							// page parent is the navigation container
							this.getParent().backToTop();
						}
					});
					this._oNavContainer.addPage(oPage);
					if (this.getLegends().length === 1) {
						this._setInvisibleText(oLegend.getTitle());
					}
				}
			}.bind(this));
		} else {
			var oPage = new Page({
				title: this.oRb.getText("LEGEND_TITLE"),
				backgroundDesign: sap.m.PageBackgroundDesign.Solid,
				enableScrolling: true
			});
			var oLegends = this.getLegends();
			oLegends.forEach(function(listLegend) {
				oPage.addContent(new AssociateContainer({
					content: listLegend
				}));
			 });
			this._oNavContainer.addPage(oPage);
			this._setInvisibleText(oPage.getTitle());
		}
	};

	LegendContainer.prototype._addInitialPageIfNecessary = function() {
		var aLegends = this.getLegends();

		if (aLegends.length > 1 && !this._shouldRenderFlatLegendList() && !this._isSingleVisibleList()){
			var aNavigationItems = aLegends.map(function(oLegend) {
				return new StandardListItem({
					title: oLegend.getTitle(),
					type: sap.m.ListType.Navigation,
					press: this._onInitialPageItemPress.bind(this)
				});
			}.bind(this));

			var oInitNavPage = new Page({
				title: this.oRb.getText("LEGEND_TITLE"),
				content: [new List({
					items: aNavigationItems
				})]
			});
			this._setInvisibleText(oInitNavPage.getTitle());
			this._oNavContainer.addPage(oInitNavPage);
			this._oNavContainer.setInitialPage(oInitNavPage);
		}
	};

	LegendContainer.prototype._onInitialPageItemPress = function(oEvent) {
		var sPageTitle = oEvent.getSource().getTitle();
		this._navToByPageTitle(sPageTitle);
		this._setInvisibleText(sPageTitle);
	};

	LegendContainer.prototype._navToByPageTitle = function(sPageTitle) {
		if (!sPageTitle) { return; }
		this._oNavContainer.setAutoFocus(true);
		var aPages = this._oNavContainer.getPages();
		// look all pages and find the matched legend title then navigate to
		//Section with Title as Legend does not navigate to the correct page since the Initial Legend Page also has Title as Legend.
		//Change of iteration value from 0 to 1 since the first Page is there are more than 1 Legend will always be the Initial Legend Page
		for (var i = 1; i < aPages.length; i++) {
			if (sPageTitle == aPages[i].getTitle()){
				this._oNavContainer.to(aPages[i]);
				break;
			}
		}
	};

	LegendContainer.prototype._setInvisibleText = function(sPageTitle) {
		if (this.getParent() && this.getParent()._oInvisibleLabelText) {
			this.getParent()._oInvisibleLabelText.setText(sPageTitle);
		}
	};

	return LegendContainer;
}, true);
