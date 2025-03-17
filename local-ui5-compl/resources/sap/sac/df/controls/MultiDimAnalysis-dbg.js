/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  "sap/sac/df/controls/MultiDimAnalysis",
  [
    "sap/ui/core/Control",
    "sap/ui/thirdparty/jquery",
    "sap/m/FlexItemData",
    "sap/m/HBox",
    "sap/m/VBox",
    "sap/m/OverflowToolbar",
    "sap/m/OverflowToolbarButton",
    "sap/m/OverflowToolbarToggleButton",
    "sap/ui/model/json/JSONModel",
    "sap/base/Log",
    "sap/sac/df/DesignerPanel",
    "sap/sac/df/controls/MultiDimVizRenderer",
    "sap/sac/df/controls/MultiDimVizSettingsPanel",
    "sap/sac/df/model/MultiDimModel",
    "sap/sac/df/utils/MetaPathHelper",
    "sap/f/SidePanel",
    "sap/f/SidePanelItem"
  ],
  function (Control, jQuery, FlexItemData, HBox, VBox, OverflowToolbar, OverflowToolbarButton, OverflowToolbarToggleButton, JSONModel, Log, MultiDimDesignerPanel, MultiDimVizRenderer, MultiDimVizSettingsPanel, MultiDimModel, MetaPathHelper, SidePanel, SidePanelItem) {
    /**
     * Constructor for a new <code>MultiDimAnalysis</code> control.
     *
     * @class  Control for multidimensional analysis
     * @private
     * @experimental
     * @extends sap.ui.core.Control
     * @abstract
     * @author SAP SE
     * @version 1.132.0
     *
     * @constructor
     * @private
     * @alias sap.sac.df.controls.MultiDimAnalysis
     */
    const MultiDimAnalysis = Control.extend(
      "sap.sac.df.controls.MultiDimAnalysis",
      /** @lends sap.ui.core.Control.prototype */ {
        metadata: {
          library: "sap.sac.df",
          properties: {
            /**
             * Defines the relative path to the visualization of the corresponding data provider in the multidimensional model.
             **/
            metaPath: {
              type: "string"
            },
            /**
             * Height of the plugin loader
             */
            height: {
              type: "sap.ui.core.CSSSize",
              defaultValue: "100%"
            },
            /**
             * Width of the plugin loader
             */
            width: {
              type: "sap.ui.core.CSSSize",
              defaultValue: "100%"
            }
          }
        },

        //##############-------- CONTROL LIFECYCLE METHODS -----------###############

        init: function () {
          this._oMainLayout = new VBox(this.getId() + "--MainLayout", {
            height: "100%"
          });

          this._initHeaderToolbar();
          this._initSidePanel();
        },

        renderer: {
          apiVersion: 2,
          render: function render(oRm, oControl) {
            Log.info("DF: Start - MultiDimAnalysis - render");
            oRm
              .openStart("div", oControl)
              .class("sapUiZenMultiDimAnalysis")
              .style("height", oControl.getHeight())
              .style("width", oControl.getWidth())
              .style("position", "relative")
              .openEnd();

            oRm.renderControl(oControl._oMainLayout);

            oRm.close("div");
            Log.info("DF: End - MultiDimAnalysis - render");
          }
        },

        onAfterRendering: function () {
          Log.info("DF: Start - MultiDimAnalysis - onAfterRendering");

          // FixMe : Panel containers has negligible height and requires this hack to show up.
          const aPanelIds = [this._oDesignerPanel.getId(), this._oVizSettingsPanel.getId()];
          aPanelIds.forEach(function (sPanelId) {
            let oPanelContainerWrapper = jQuery("#" + sPanelId).parent()[0];
            if (oPanelContainerWrapper) {
              oPanelContainerWrapper.style.height = "100%";
            }
          });

          if (Control.prototype.onAfterRendering) {
            Control.prototype.onAfterRendering.apply(this, arguments);
          }
          Log.info("DF: End - MultiDimAnalysis - onAfterRendering");
        },

        exit: function () {
          this._oAutoRefreshButton.destroy(true);
          this._oRefreshButton.destroy(true);
          this._oHeaderToolbar.destroy(true);
          this._oVizRenderer.destroy(true);
          this._oDesignerPanel.destroy(true);
          this._oBuilderSidePanelItem.destroy(true);
          this._oVizSettingsPanel.destroy(true);
          this._oVizSettingsPanelItem.destroy(true);
          this._oStyleSidePanelItem.destroy(true);
          this._oSidePanel.destroy(true);
          this._oMainLayout.destroy(true);
          Control.prototype.exit.apply(this, arguments);
        },

        //##############-------- PUBLIC METHODS -----------###############


        //##############-------- PROPERTY SETTERS -----------###############
        setMetaPath: function (sPath){
          this.setProperty("metaPath", sPath);

          // FixMe : Propagate MDM from parent control to child.
          let sMultiDimModelId = MetaPathHelper.getMultiDimModelName(sPath);
          if(sMultiDimModelId) {
            this._oSidePanel.setModel(this.getModel(sMultiDimModelId), sMultiDimModelId);
          }

          this._oVizRenderer.setMetaPath(sPath);
          this._oDesignerPanel.setMetaPath(sPath);
          this._oVizSettingsPanel.setMetaPath(sPath);
          this._oAutoRefreshButton.setEnabled(!!this._getDataProviderName()).setPressed(true);
          this._oRefreshButton.setEnabled(false);
        },

        //##############-------- PRIVATE METHODS -----------###############

        _initHeaderToolbar: function () {
          this._oHeaderToolbar = new OverflowToolbar(this.getId() + "--OverflowToolbar");

          this._oAutoRefreshButton = new OverflowToolbarToggleButton(this.getId() + "--AutoRefreshBtn", {
            icon: "sap-icon://synchronize",
            tooltip: "Auto Refresh",
            pressed: true,
            enabled: !!this._getDataProvider()
          });
          this._oAutoRefreshButton.attachPress(this._onAutoRefreshToggle.bind(this));
          this._oHeaderToolbar.addContent(this._oAutoRefreshButton);

          this._oRefreshButton = new OverflowToolbarButton(this.getId() + "--RefreshBtn", {
            icon: "sap-icon://refresh",
            tooltip: "Refresh Data from Back-end",
            enabled: !!this._getDataProvider() && !this._oAutoRefreshButton.getPressed()
          });
          this._oRefreshButton.attachPress(this._onRefreshPress.bind(this));
          this._oHeaderToolbar.addContent(this._oRefreshButton);

          this._oMainLayout.addItem(this._oHeaderToolbar);
        },

        _initSidePanel: function () {
          const oLayoutData = {"growFactor": 1};

          this._oSidePanel = new SidePanel(this.getId() + "--SidePanel", {
            sidePanelResizable: true,
            sidePanelMinWidth: "25rem",
            sidePanelWidth: "35rem",
            sidePanelMaxWidth: "60%",
            layoutData: new FlexItemData(oLayoutData)
          });
          this._oSidePanel.attachToggle(function () {
            this.invalidate();
          }.bind(this));

          this._oVizRenderer = new MultiDimVizRenderer(this.getId() + "--VizRenderer");
          this._oSidePanel.addMainContent(this._oVizRenderer);

          this._initInnerPanels();
          this._oMainLayout.addItem(this._oSidePanel);
        },

        _initInnerPanels: function () {
          const oLayoutData = {"growFactor": 1};
          this._oDesignerPanel = new MultiDimDesignerPanel(this.getId() + "--DesignerPanel");
          this._oDesignerPanel.setLayoutData(new FlexItemData(oLayoutData));
          this._oBuilderSidePanelItem = new SidePanelItem(this.getId() + "--BuilderSidePanelItem", {
            "icon": "sap-icon://fpa/customise",
            "text": "Builder"
          });
          this._oBuilderSidePanelItem.addContent(this._oDesignerPanel);
          this._oSidePanel.addItem(this._oBuilderSidePanelItem);

          this._oVizSettingsPanel = new MultiDimVizSettingsPanel(this.getId() + "--VizSettingsPanel");
          this._oVizSettingsPanel.setLayoutData(new FlexItemData(oLayoutData));
          this._oVizSettingsPanelItem = new SidePanelItem(this.getId() + "--VizSettingsSidePanelItem", {
            "icon": "sap-icon://provision",
            "text": "Manage visualizations"
          });
          this._oVizSettingsPanelItem.addContent(this._oVizSettingsPanel);
          this._oSidePanel.addItem(this._oVizSettingsPanelItem);

          this._oStyleSidePanelItem = new SidePanelItem(this.getId() + "--FormattingSidePanelItem", {
            "icon": "sap-icon://fpa/designer",
            "text": "Formatting (WIP)"
          });
          this._oSidePanel.addItem(this._oStyleSidePanelItem);
        },

        _getMultiDimModel: function() {
          var sModelName = MetaPathHelper.getMultiDimModelName(this.getMetaPath());
          return sModelName ? this.getModel(sModelName) : null;
        },

        _getDataProvider: function () {
          const sDataProviderName = this._getDataProviderName();
          return sDataProviderName && this._getMultiDimModel()?.getDataProvider(sDataProviderName);
        },

        _getDataProviderName: function () {
          return MetaPathHelper.getDataProviderName(this.getMetaPath());
        },

        //##############-------- EVENT HANDLERS -----------###############
        _onAutoRefreshToggle: function (oEvent) {
          const oDataProvider = this._getDataProvider();
          if (oDataProvider) {
            const isAutoRefreshEnabled = oEvent.getParameter("pressed");
            // ToDo : Request DataProvider to stop/start fetching new result set.
            this._oRefreshButton.setEnabled(!isAutoRefreshEnabled);
            this.invalidate();
          } else {
            // Data provider not ready. Do not update toggle state of AutoRefresh button
            oEvent.preventDefault();
          }
        },

        _onRefreshPress: function () {
          this._oVizRenderer.refresh();
          this._oDesignerPanel.refresh();
          this._oVizSettingsPanel.refresh();
        }
      }
    );

    return MultiDimAnalysis;
  }
);
