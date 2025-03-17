/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap, Promise*/
sap.ui.define("sap/sac/df/FlexAnalysis", ["sap/sac/df/types/SystemType", "sap/ui/core/Control", "sap/base/Log", "sap/ui/model/json/JSONModel", "sap/ui/thirdparty/jquery", "sap/sac/df/model/MultiDimModel", "sap/sac/df/firefly/library"], function (SystemType, Control, Log, JSONModel, jQuery, MultiDimModel, FF) {
  "use strict";
  var programName = "GalaxyDataStudio";
  var EMPTY_STYLE = "empty";


  /**
     * Constructor for a new <code>FlexAnalysis</code>.
     * @public
     * @experimental
     * @class
     * Enables users to view, navigate and change multidimensional data exposed via InA.
     *
     * <h3>Overview</h3>
     *
     * The user can view the data in a Table, navigate in the data via a context menu or builder panels
     * The data source that the FlexAnalysis consumes or renders has to be provided as a property value.
     *
     * @extends sap.ui.core.Control
     * @param {string} [sId] ID for the new control, generated automatically if no ID is given
     * @author SAP SE
     * @version 1.132.0
     *
     * @constructor
     * @public
     * @deprecated As of version 1.132. Replaced by {@link sap.sac.df.DataAnalyzer DataAnalyzer} or {@link sap.sac.df.Grid Grid}.
     * @alias sap.sac.df.FlexAnalysis
     **/
  var FA = Control.extend("sap.sac.df.FlexAnalysis", {
    metadata: {
      properties: {
        /**
                 * Sets title to be shown in the control. If not set the name of the corresponding back-end query is used
                 */
        title: {
          type: "string"
        }, /**
                 * Indicates  Flexible Analysis component should display the component title
                 */
        showTitle: {
          type: "boolean", defaultValue: false
        }, /**
                 * Indicates if Flexible Analysis component automatically requests the ResultSet for the shown data source
                 * @deprecated As of version 1.124, the concept has been discarded. Refreshing the data is handled by the data provider.
                 */
        autoUpdate: {
          type: "boolean", defaultValue: true
        }, /**
                 * URI of the advanced configuration to be fetched
                 */
        configurationURI: {
          type: "string"
        }, /**
                 * JSON object containing the configuration (alternative to configurationURI)
                 */
        configObject: {
          type: "object"
        }, /**
                 Configuration Id
                 */
        configId: {
          type: "string"
        }, /**
                 * Width of the component
                 */
        width: {
          type: "sap.ui.core.CSSSize", defaultValue: "100%"
        }, /**
                 * Height of the component
                 */
        height: {
          type: "sap.ui.core.CSSSize", defaultValue: "100%"
        }, /**
                 * Sets if the Design Panel of FlexAnalysis is hidden
                 */
        hideDesignPanel: {
          type: "boolean", defaultValue: true
        }, /**
                 * Sets if the Style Panel of FlexAnalysis is hidden
                 */
        hideStylePanel: {
          type: "boolean", defaultValue: true
        }, /**
                 * Sets if the menu bar of FlexAnalysis is hidden
                 */
        hideMenuBar: {
          type: "boolean", defaultValue: true
        }, /**
                 * Sets if the status bar of FlexAnalysis is hidden
                 */
        hideStatusBar: {
          type: "boolean", defaultValue: true
        }, /**
                 * Sets if the toolbar of FlexAnalysis is hidden
                 */
        hideToolBar: {
          type: "boolean", defaultValue: true
        }, /**
                 * Sets if the filter of FlexAnalysis is hidden
                 */
        hideFilterLine: {
          type: "boolean", defaultValue: false
        }, /**
                 * Sets if the side navigation bar of FlexAnalysis is hidden
                 */
        hideSideNavigation: {
          type: "boolean", defaultValue: false
        }, /**
                 * Sets if the landing page of FlexAnalysis is hidden
                 */
        hideLandingPage: {
          type: "boolean", defaultValue: true
        },

        /**
                 * System to take data from. If not set or set to "local" current url will be used to determine the system
                 * @deprecated As of version 1.124. Replaced by metaPath property and the corresponding data provider definition.
                 */
        systemName: {
          type: "string"
        }, /**
                 * Data source (Query name/ View, InA model etc) to be used to get the data from
                 * @deprecated As of version 1.124. Replaced by metaPath property and the corresponding data provider definition.
                 */
        dataSource: {
          type: "string", defaultValue: "$datasource"
        }, /**
                 * Type the system to connect to get data
                 * @deprecated as of version 1.124. Replaced by metaPath property and the corresponding data provider definition.
                 */
        systemType: {
          type: "sap.sac.df.types.SystemType", defaultValue: SystemType.BW
        }, /**
                 * Interval to keep the InA session alive. values less than 1 deactivates the keep alive handling
                 */
        keepAliveInterval: {
          type: "int", defaultValue: 0
        }, /**
                 * Client Identifier to be used for underlying InA queries
                 * @deprecated As of version 1.124. Replaced by metaPath property and the corresponding data provider definition.
                 */
        clientIdentifier: {
          type: "string"
        }, /**
                 * Name of the Data Provider from the corresponding MultiDimModel to be used
                 * @deprecated As of version 1.124. Replaced by metaPath property and the corresponding data provider definition.
                 */
        dataProvider: {
          type: "any", bindable: true
        }, /**
                 * Id of the MultiDimModel to use
                 * @deprecated As of version 1.124. Replaced by metaPath property and the corresponding data provider definition.
                 */
        multiDimModelId: {
          type: "string", defaultValue: "om"
        },

        /**
                 * Defines the relative path to the data provider in the multidimensional model.
                 **/
        metaPath: {
          type: "string"
        },

        /**
                 * Indicates if the variable are handled internal handling by FlexAnalysis. If set to false it is done via corresponding MultiDimModel
                 */
        implicitVariableHandling: {
          type: "boolean", defaultValue: true, bindable: false
        }, /**
                 * Indicates if the variable are handled internal handling by FlexAnalysis. If set to false it is done via corresponding MultiDimModel
                 */
        styleTemplateName: {
          type: "string"
        }
      }, events: {
        /**
                 * Fires on cell click event
                 */
        onCellClick: {
          parameters: {
            /** Cell context */
            cellContext: {type: "object"}
          }
        }
      }, aggregations: {
        /**
                 * Custom panels for the flexible analysis control
                 * @deprecated As of version 1.132, the concept has been discarded. Refreshing the data is handled by the data provider.
                 */
        customPanels: {
          type: "sap.ui.core.Control", multiple: true
        }
      }, defaultAggregation: "customPanels"
    },
    logActive: false,

    init: function () {
      this.programContainerID = this.getId() + "--program";
      this.programContainer = jQuery("<div id=\"" + this.programContainerID + "\"/>");
      this.log("Created");
    },


    renderer: {
      apiVersion: 2, render: function (oRm, oControl) {
        if (oControl._error) {
          oRm.openStart("span", oControl.getId() + "-error");
          oRm.openEnd();
          oRm.text(oControl._error.toString());
          oRm.close("span");
        } else {
          oRm.openStart("div", oControl);
          oRm.style("flex", "auto");
          oRm.style("width", oControl.getWidth());
          oRm.style("height", oControl.getHeight());
          oRm.attr("data-sap-ui-preserve", oControl.getId());

          oRm.openEnd();
          oRm.close("div");
        }
      }
    },

    onAfterRendering: function () {
      if (Control.prototype.onAfterRendering) {
        Control.prototype.onAfterRendering.apply(this, arguments); //run the super class's method first
      }

      // attached the div the program is using to the ui5 Controls div
      var ui5Div = this.$();
      this.programContainer.appendTo(ui5Div);
      if (this.closed) {
        ui5Div.css("visibility", "hidden");
      }
      this.log("On after rendering");
      if (!this.isProgramRunning) {
        this.runProgram();
      }
      ui5Div.css("position", "relative");
    },

    _getDataProvider: function () {
      return this.getMetaPath() && this.getMetaPath().split(">") && this._getMultiDimModel() && this._getMultiDimModel().getProperty(this.getMetaPath().split(">")[1]);
    },

    _getDataProviderName: function () {
      return this._getDataProvider() && this._getDataProvider().Name;
    },

    _getMultiDimModel: function () {
      return this.getMetaPath() && this.getMetaPath().split(">") && this.getModel(this.getMetaPath().split(">")[0]);
    },

    _getMultiDimModelId: function () {
      return this.getMetaPath() && this.getMetaPath().split(">")[0];
    },

    _getDefaultContextMenuProvider: function () {
      return this._getMultiDimModel().getContextMenuProviderRegistry().getDefaultProvider();
    },

    setMetaPath: function (sPath) {
      this.closed = false;
      return this.setProperty("metaPath", sPath);
    },

    updateProgramSettings: function () {
      this.log("Update program settings");
      var application = this.program.getProcess().getApplication();
      application.setClientInfo(null, this.getClientIdentifier(), null);
      this.program.setShowToolbar(!this.getHideToolBar());

      var activeDocument = this.program.getActiveDocument();
      activeDocument.setFilterLineVisible(!this.getHideFilterLine());
      activeDocument.setDesignerPanelVisible(!this.getHideDesignPanel());
      activeDocument.setStylePanelVisible(!this.getHideStylePanel());
      activeDocument.setSideNavigationVisible(!this.getHideSideNavigation());
      this._setDocumentAutoUpdatesEnabled();
      this.updateStyleTemplate();
      this.updateTitle();
    },

    registerCustomPanels: function () {
      var aCustomPanels = this.getCustomPanels();
      aCustomPanels.forEach(function (oCustomPanel) {
        this.program.registerCustomPanel(oCustomPanel);
      }.bind(this));
    },

    /**
         * The callback invoked upon UiStateChange of the program
         * @param oUiStateStructure the ui state
         */
    onUiStateChange: function (oUiStateStructure) {
      this.log("UI state changed");
      var oUiState = oUiStateStructure.convertToNative();
      if (oUiState) {
        var vOpenPanelTypes = oUiState[FF.AuGdsQbConstants.QD_UI_STATE_OPEN_PANELS];
        if (vOpenPanelTypes) {
          // Design panel
          var sDesignerPanelName = FF.AuGdsPanelType.DESIGNER.getName();
          var bIsDesignPanelOpen = Object.prototype.hasOwnProperty.call(vOpenPanelTypes, sDesignerPanelName) ? vOpenPanelTypes[sDesignerPanelName] : false;
          this.setProperty("hideDesignPanel", !bIsDesignPanelOpen, true);

          // Style panel
          var sStylePanelName = FF.AuGdsPanelType.STYLE.getName();
          var bIsStylePanelOpen = Object.prototype.hasOwnProperty.call(vOpenPanelTypes, sStylePanelName) ? vOpenPanelTypes[sStylePanelName] : false;
          this.setProperty("hideStylePanel", !bIsStylePanelOpen, true);
        }
        // Update autoUpdate status
        if (Object.prototype.hasOwnProperty.call(oUiState, FF.AuGdsQbConstants.QD_UI_STATE_AUTO_UPDATE)) {
          if (this._getDataProvider() && this.program.getActiveDocument().isAutoUpdatesEnabled() !== this._getDataProvider().getAutoFetchEnabled()) {
            this._getDataProvider().setProperty("/AutoFetchEnabled", this.program.getActiveDocument().isAutoUpdatesEnabled());
          }
        }
      }
    },

    /**
         * Registers a callback to the UiStateChange hook on the document
         */
    registerUiStateChange: function () {
      var oActiveDocument = this.program.getActiveDocument();
      if (oActiveDocument && oActiveDocument.addUiStateChangeCallback) {
        oActiveDocument.addUiStateChangeCallback(this.onUiStateChange.bind(this));
      }
    },

    updateTitle: function () {
      if (this.program) {

        var activeDocument = this.program.getActiveDocument();
        if (typeof this.getTitle() == "string") {
          activeDocument.setDocumentTitle(this.getTitle());
        }
        // Move hack into Firefly code
        activeDocument.createQueryDetailsIfNeeded();
        activeDocument.setTableTitleVisible(this.getShowTitle());
      }
    },

    runProgram: async function () {
      this.log("Run UI5 program");
      this.isProgramRunning = true;
      this._error = undefined;
      try {
        await this._initModel();
        const model = this._getMultiDimModel();
        this.oProgramRunner = FF.ProgramRunner.createRunner(model.getSession(), programName);
        await this._processConfigURI();
        this._setClientArgs();
        this.oProgramRunner.setNativeAnchorId(this.programContainerID);
        this.oProgramRunner.runProgram()
          .onThen((oProgram) => {
            this.log("GDS created");
            this.program = oProgram;
            if (this._getDataProvider()?._FFDataProvider) {
              this._setDataProvider();
            }
            this.registerCustomPanels();
            this.registerUiStateChange();
            this.program.registerDynamicMenuActionsProvider("UI5ContextMenuProvider", this._getDefaultContextMenuProvider());
            if (this.program.getActiveDocument().getTableView() && !this.program.getActiveDocument().getTableView().m_onclickConsumer) {
              this.program.getActiveDocument().getTableView().setOnclickConsumer(this._fireOnCellClick.bind(this));
            }
            this.updateTitle();
            this.updateProgramSettings();
          })
          .onCatch((oError) => {
            throw new Error(oError);
          });
      } catch {
        this._handleInitalisationErrors();
      }
    },

    _fireOnCellClick: function (context) {
      this.fireOnCellClick({cellContext: this._getDefaultContextMenuProvider().convertCellClickContext(context)});
    },

    _setDataProvider: function () {
      if (this._getDataProvider() && this.program && this.program.getActiveDocument()) {
        this._setDocumentAutoUpdatesEnabled();
        this.program.getActiveDocument().setExternalDataProvider(this._getDataProvider()._FFDataProvider);
      }
    },

    exit: function () {
      if (this.oProgramRunner) {
        this._cleanUpProgram();
      }
    },

    getProgram: function () {
      return this.program;
    },

    /**
         * Sets the visibility of a panel
         * @param sPanelId the ID of the panel
         * @param bVisible <code>true</code> if panel is to be shown, else <code>false</code>
         */
    setPanelVisible: function (sPanelId, bVisible) {
      if (this.program) {
        var oActiveDocument = this.program.getActiveDocument();
        if (oActiveDocument && oActiveDocument.setPanelVisible) {
          var oPanelType = FF.AuGdsPanelType.lookup(sPanelId);
          if (oPanelType) {
            oActiveDocument.setPanelVisible(oPanelType, bVisible);
          } else {
            throw new Error("Cannot resolve panel type to adjust visibility!");
          }
        }
      }
    },

    setDataProvider: function (sDataProviderName) {
      this.setMetaPath(this.getMultiDimModelId() + ">/DataProviders/" + sDataProviderName);
    }, /**
         * Register a Context Menu extension
         *
         * The extension an object which fulfills following interface
         *
         * extensionDefinition = {
         *           // Returns a Promise which determines  if a given action will be visible in context Menu
         *           isActionVisible: (sActionKey, context): Promise<boolean> => {
         *             return Promise.resolve(checksActionKeyAndContext);
         *           },
         *           isActionEnabled: (sActionKey, context): Promise<boolean>{
         *
         *           },
         *           getActionDescription: (sActionKey, context): Promise<ActionDescription>{
         *            // Return an ActionDescription in following format
         *            {
         *              "Text": "Translatable Text to be used as Menu Entry Label",
         *              "Icon": "Icon to be shown as part of  Menu Entry Label",
         *              "InsertBefore|InsertAfter": "Id of already existing Context Menu Entry to place this Menu Entry before or after",
         *              // Following part is olny relevant for nested submenus
         *              "Type": "Submenu",
         *              "NestedActions": ["Id of the action which will be placed as part of this submenu", "Other id"]
         *              // extenstionDefinition is called recursevely to check visibility and provide corresponding  action definition
         *            }
         *            //or when using
         *            {
         *              builtin: true
         *            }
         *           },
         *           // Executes the action with given sActionKey and context
         *           triggerAction: (sActionKey, context):void => {
         *             alert("Trigger"+ sKey+ ":"+context);
         *           }
         *      }
         *
         *
         *
         * @param sActionId actionId which is then used to be processed via provided extentionDefinition
         * @param extensionDefinition see description above
         */
    addContextMenuAction: function (sActionId, extensionDefinition) {
      this._getDefaultContextMenuProvider().registerAction(sActionId, extensionDefinition);
    },

    /**
         * Set selected data cell
         * @param rowIndex row index
         * @param columnIndex column index
         */
    setSelectedDataCell: function (rowIndex, columnIndex) {
      const oActiveTableContainer = this.program.getActiveDocument().getTableView().getActiveTableContainer();
      try {
        const rowNumber = oActiveTableContainer.getRowIndexForTupleIndex(rowIndex);
        const columnNumber = oActiveTableContainer.getColumnIndexForTupleIndex(columnIndex);
        if (rowNumber >= 0 && columnNumber >= 0) {
          this.program.getActiveDocument().setSelectedCell(rowNumber, columnNumber);
        }
      } catch (oError) {
        console.log(oError.message);
      }
    },

    /**
         * Clear selection of cells
         */
    clearCellSelection: function () {
      this.program.getActiveDocument().clearSelection();
    },

    setHideFilterLine: function (bHideFilterLine) {
      this.setProperty("hideFilterLine", bHideFilterLine, true);
      if (this.program) {
        this.program.getActiveDocument().setFilterLineVisible(!bHideFilterLine);
      }
      return this;
    }, setStyleTemplateName: function (sStyleTemplateName) {
      this.setProperty("styleTemplateName", sStyleTemplateName, true);
      this.updateStyleTemplate();
      return this;
    }, setAutoUpdate: function (bAutoUpdate) {
      if (this._getDataProvider()) {
        this._getDataProvider().setAutoFetchEnabled(bAutoUpdate);
      }
      return this;
    }, setHideToolBar: function (bHideToolBar) {
      this.setProperty("hideToolBar", bHideToolBar, true);
      if (this.program) {
        this.program.setShowToolbar(!bHideToolBar);
      }
      return this;
    }, setTitle: function (sTitle) {
      this.setProperty("title", sTitle, true);
      this.updateTitle();
      return this;
    }, setShowTitle: function (bShowTitle) {
      this.setProperty("showTitle", bShowTitle, true);
      this.updateTitle();
      return this;
    }, setHideSideNavigation: function (bHideSideNavigation) {
      this.setProperty("hideSideNavigation", bHideSideNavigation, true);
      if (this.program) {
        this.program.getActiveDocument().setSideNavigationVisible(!bHideSideNavigation);
      }
      return this;
    }, setHideDesignPanel: function (bHideDesignPanel) {
      this.setProperty("hideDesignPanel", bHideDesignPanel, true);
      if (this.program) {
        this.program.getActiveDocument().setDesignerPanelVisible(!bHideDesignPanel);
      }
      return this;
    }, setHideStylePanel: function (bHideStylePanel) {
      this.setProperty("hideStylePanel", bHideStylePanel, true);
      if (this.program) {
        this.program.getActiveDocument().setStylePanelVisible(!bHideStylePanel);
      }
      return this;
    }, _cleanUpProgram: function () {
      FF.XObjectExt.release(this.oProgramRunner);
      FF.XObjectExt.release(this.program);
      this.oProgramRunner = null;
      this.program = null;
      this.isProgramRunning = false;
    }, _initModel: function () {
      const that = this;
      that.log("Start init model");
      let oReturnedPromise;
      const oMultiDimModel = that._getMultiDimModel();
      if (oMultiDimModel) {
        oMultiDimModel.attachEvent("dataProviderAdded", null, function (evt) {
          const dataProviderName = evt.getParameter("dataProviderName");
          this.log("DP added '" + dataProviderName + "'");
          if (dataProviderName === this._getDataProviderName()) {
            this._setDataProvider();
          }
        }, that);
        oMultiDimModel.attachEvent("dataProviderRemoved", null, function (evt) {
          const dataProviderName = evt.getParameter("dataProviderName");
          that.log("DP removed '" + dataProviderName + "'");
          if (this.program && this.program.getActiveDocument()) {
            this.program.getActiveDocument().getQueryController().reset();
          }
        }, that);
        oMultiDimModel.attachEvent("dataProviderUpdated", null, (evt) => {
          const dataProviderName = evt.getParameter("dataProviderName");
          if (dataProviderName === that._getDataProviderName()) {
            that._setDocumentAutoUpdatesEnabled();
          }
        }, that);
        oMultiDimModel.attachEvent("requestFailed", null, (evt) => {
          const dataProviderName = evt.getParameter("infoObject");
          if (dataProviderName === that._getDataProviderName()) {
            that._requestInError = true;
          }
        }, that);
        oMultiDimModel.attachEvent("requestCompleted", null, (evt) => {
          const dataProviderName = evt.getParameter("infoObject");
          if (dataProviderName === that._getDataProviderName()) {
            if (that._requestInError) {
              that._requestInError = false;
              that.updateStyleTemplate();
            }
          }
        }, that);
        oReturnedPromise = oMultiDimModel.loaded();
      } else {
        that._requestInError = true;
        oReturnedPromise = Promise.reject(`Multidimensional Model <${that._getMultiDimModelId()}> is unknown!`);
      }
      return oReturnedPromise;
    },

    _setDocumentAutoUpdatesEnabled: function () {
      if (this._getDataProvider() && this.program && this.program.getActiveDocument()) {
        if (this.program.getActiveDocument().isAutoUpdatesEnabled() !== this._getDataProvider().getAutoFetchEnabled()) {
          this.program.getActiveDocument().setAutoUpdatesEnabled(!!this._getDataProvider().getAutoFetchEnabled());
        }
      }
    },

    _setClientArgs: function () {
      this.log("setClientArgs");
      this.oProgramRunner.setStringArgument(FF.AuGdsConstants.GDF_FILE_DOC_TYPE, this.getDocType());
      this.oProgramRunner.setStringArgument(FF.AuGdsConstants.PARAM_SYSTEM, this._getSystemName());
      // Disable multi-documents for the moment
      this.oProgramRunner.setBooleanArgument(FF.AuGdsConstants.PARAM_MULTI_DOCUMENTS, false);
      this.oProgramRunner.setBooleanArgument(FF.AuGdsConstants.PARAM_HIDE_STATUS_BAR, this.getHideStatusBar());
      this.oProgramRunner.setBooleanArgument(FF.AuGdsConstants.PARAM_HIDE_MENU_BAR, this.getHideMenuBar());
      this.oProgramRunner.setBooleanArgument(FF.AuGdsConstants.PARAM_HIDE_TOOLBAR, this.getHideToolBar());
      this.oProgramRunner.setBooleanArgument(FF.AuGdsConstants.PARAM_QUERY_BUILDER_MULTI_VIEWS, false);
      this.oProgramRunner.setBooleanArgument(FF.AuGdsConstants.PARAM_QUERY_BUILDER_AUTO_OPEN_DATA_SOURCE_PICKER, false);
      this.oProgramRunner.setBooleanArgument(FF.AuGdsConstants.PARAM_IMPLICIT_VARIABLE_HANDLING, this.getImplicitVariableHandling());
      this.oProgramRunner.setBooleanArgument(FF.AuGdsConstants.PARAM_SUPPRESS_LANDING_PAGE, this.getHideLandingPage());
      this.oProgramRunner.setStringArgument(FF.AuGdsConstants.PARAM_INTEGRATION, "ui5");
      this.oProgramRunner.setStringArgument(FF.AuGdsConstants.PARAM_MODE, FF.AuGdsConstants.VALUE_MODE_SAP_UI5_GA);
    },

    _handleInitalisationErrors: function (e) {
      this._error = e;
      this.invalidate();
    },

    getDocType: function () {
      return "QueryBuilder";
    }, _getSystemName: function () {
      var systemName = this.getSystemName();
      if (systemName && systemName.startsWith("$")) {
        systemName = this.getUrlParams("system");
      }
      return systemName ? systemName : "local" + this.getSystemType();
    },

    _updateSupportedPanelsConfiguration: function (configModel, disableformatingPanel) {
      var aCustomPanels = this.getCustomPanels();
      if (aCustomPanels.length) {
        var aCustomPanelTypes = aCustomPanels.map(function (oCustomPanel) {
            return oCustomPanel.getPanelId();
          }), sConfigModelPath = "/QueryBuilder/SideNavigation/SupportedPanels",
          aSupportedPanelTypes = configModel.getProperty(sConfigModelPath);
        if (aSupportedPanelTypes) {
          aSupportedPanelTypes = aSupportedPanelTypes.concat(aCustomPanelTypes);
        } else {
          aSupportedPanelTypes = aCustomPanelTypes;
        }
        configModel.setProperty(sConfigModelPath, aSupportedPanelTypes);
        if (disableformatingPanel) {
          configModel.setProperty("/QueryBuilder/PanelSettings/StylePanel/ConditionalFormatting", false);
        }
      }
    },

    _processConfigURI: function () {
      const oProgramRunner = this.oProgramRunner;
      return new Promise((resolve) => {
        const configObject = this.getConfigObject();
        if (configObject) {
          resolve(JSON.stringify(configObject));
        } else {
          let configFile = this.getConfigurationURI();
          let configId = this.getConfigId();
          let disableFormatingPanel = false;
          if (configId) {
            if (configId === "reviewbooklet-op") {
              disableFormatingPanel = true;
              configId = "reviewbooklet";
            }
            configFile = sap.ui.require.toUrl("sap/sac/df/fa/configs/" + configId + "-config.json");
          }
          if (!configFile) {
            configFile = sap.ui.require.toUrl("sap/sac/df/fa/configs/sap-ui5-config.json");
          }
          const jsonTemplate = new JSONModel(configFile);
          jsonTemplate.attachRequestCompleted(oEvent => {
            const configModel = oEvent.getSource();
            // Append custom panels to control's supported panels configuration.
            this._updateSupportedPanelsConfiguration(configModel, disableFormatingPanel);
            resolve(JSON.stringify(configModel.getData()));
          });
        }
      }).then(configJson => {
        if (configJson) {
          oProgramRunner.setStringArgument(FF.AuGdsConstants.PARAM_GDS_CONFIGURATION, configJson);
        }
      });
    },

    getUrlParams: function (key) {
      return (window.location.href.split(key + "=")[1] || "").split("&")[0];
    },

    log: function (message) {
      if (this.logActive) {
        console.log(this.getId() + ": " + message);
      }
    }, updateStyleTemplate: function () {
      if (this.program) {
        var activeDocument = this.program.getActiveDocument();
        if (activeDocument.getTableView() && activeDocument.getTableView().getTableDefinition()) {
          var styleTemplateName = this.getStyleTemplateName();
          if (!styleTemplateName) {
            return;
          }
          var tableDefinition = activeDocument.getTableView().getTableDefinition();

          if (styleTemplateName === EMPTY_STYLE) {
            if (tableDefinition.getLinkedDefinition("FA")) {
              tableDefinition.unlinkDefinition("FA");
            }
          } else {
            var styleTemplate = this._getMultiDimModel().getStylingProvider().getTemplate(styleTemplateName);
            if (styleTemplate.getStyleForDataProvider && this._getDataProvider()) {
              styleTemplate = styleTemplate.getStyleForDataProvider(this._getDataProvider());
            }
            var faTableDefinition = FF.QFactory.createTableDefinition();
            faTableDefinition.deserializeFromElementExt(FF.QModelFormat.INA_REPOSITORY, new FF.NativeJsonProxyElement(styleTemplate));
            tableDefinition.putLinkedDefinition("FA", faTableDefinition);
          }
          activeDocument.getTableView().reRenderTableStyling();
        }
      }
    }
  });
  return FA;
});
