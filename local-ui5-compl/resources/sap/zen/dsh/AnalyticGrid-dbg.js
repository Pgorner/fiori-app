/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/AnalyticGrid",
  [
    "jquery.sap.global",
    "sap/base/Log",
    "sap/ui/core/Control",
    "sap/ui/thirdparty/URI",
    "sap/zen/dsh/AnalyticGridRenderer",
    "sap/zen/dsh/library"
  ],
  function (jQuery, Log, Control, URI, AnalyticGridRenderer ) {
    // Provides control sap.zen.dsh.AnalyticGrid.
  /**
    * Constructor for a new AnalyticGrid.
    *
    * @param {string} [sId] id for the new control, generated automatically if no id is given
    * @param {object} [mSettings] initial settings for the new control
    *
    * @class
    * Control for embedding a Design Studio Analytic Grid in an S/4 HANA Fiori application
    * @extends sap.ui.core.Control
    *
    * @constructor
    * @public
    * @since 1.46
    * @deprecated Since version 1.89.0, Please use the WD Grid control instead.
    * @experimental Since version 1.46.
    * API is incomplete and may change incompatibly
    * @alias sap.zen.dsh.AnalyticGrid
    */
    var AnalyticGrid = Control.extend(
      "sap.zen.dsh.AnalyticGrid", /** @lends sap.zen.dsh.AnalyticGrid.prototype */
      {
        metadata : {
          library : "sap.zen.dsh",
          properties : {
            /**
             * Desired width of the AnalyticGrid control
             */
            width : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : null},
            /**
             * Desired width of the AnalyticGrid control
             */
            height : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : null},
            /**
             * A SelectionVariant specifying the initial selection state used by the AnalyticGrid. Depending on the specific query and selection variant state, this will result in setting one or more variables' values and setting one or more filters on the datasource.
             */
            selection : {type : "object", group : "Data", defaultValue : null},
            /**
             * Name of the Query to bind the AnalyticGrid to.
             */
            queryName : {type : "string", group : "Data", defaultValue : null},
            /**
             * Target System alias for data connectivity
             */
            systemAlias : {type : "string", group : "Data", defaultValue : null},
            /**
             * A string representing the current state of the analytic grid, including data selection and navigation state. Intended to be used for saving and recreating inner application state in navigation scenarios, for example.
             */
            state : {type : "string", group : "Data", defaultValue : null}
          },
          events : {
            /**
             * Event is triggered when the state of the AnalyticGrid is changed.
             */
            stateChange : {
              parameters : {
                /**
                 * Serialized state string.
                 */
                state : {type : "string"}
              }
            },
            /**
             * Event is triggered when the selection is changed.
             */
            selectionChange : {
              parameters : {
                /**
                 * A SelectionVariant specifying the current selection state of the AnalyticGrid.
                 */
                selection : {type : "object"}
              }
            }
          }
        },
        renderer: AnalyticGridRenderer
      }
    );
    /**
     * This file defines behavior for the control,
     */
    sap.zen.dsh.DSH_deployment = true;
    var sapbi_ajaxHandler = sapbi_ajaxHandler || {};
    sap.zen.dsh.sapbi_page = sap.zen.dsh.sapbi_page || {};
    sap.zen.dsh.sapbi_page.getParameter = sap.zen.dsh.sapbi_page.getParameter || function(){return "";};
    sap.zen.dsh.sapbi_MIMES_PIXEL = sap.zen.dsh.sapbi_MIMES_PIXEL || "";
    sap.zen.dsh.doReplaceDots = true;
    AnalyticGrid.prototype.init = function() {
      this.parameters = {};

      this.dshBaseUrl = URI(sap.ui.resource("sap.zen.dsh", "rt/")).absoluteTo(document.baseURI).toString();
      this.repositoryUrl = URI(sap.ui.resource("sap.zen.dsh", "applications/")).absoluteTo(document.baseURI).toString();

      sap.zen.dsh.sapbi_page.staticMimeUrlPrefix = this.dshBaseUrl;
    };
    AnalyticGrid.prototype._initializeInternal = function() {
      if(this.initialized) {
        this.page.forceFullNonDeltaRender();
        return;
      }
      this.initialized = true;
      this._addParameter("XQUERY", this.getQueryName());
      if (this.getState()) {
        this._initializeInnerAppState(this.getState());
      } else {
        this._initializeSelectionVariant(this.getSelection());
      }
      var that = this;
      setTimeout(function(){
        that._createPage();
      }, 0);
    };
    AnalyticGrid.prototype._createPage = function() {
      sap.zen.dsh.scriptLoaded= true;
      var that = this;
      var oConfig = sap.ui.getCore().getConfiguration();
      var language = oConfig.getLocale().getSAPLogonLanguage();
      if (!language) {
        language = window.navigator.userLanguage || window.navigator.language;
      }
      var client = "";
      if(window.document.cookie) {
        var match = /(?:sap-usercontext=)*sap-client=(\d{3})/.exec(window.document.cookie);
        if (match && match[1])
        {
          client = match[1];
        }
      }
      var urlParams = sap.firefly.XHashMapByString.create();
      for (var key in this.parameters) {
        urlParams.put(key, this.parameters[key]);
      }
      var designStudio = new sap.zen.DesignStudio();
      designStudio.setHost(window.document.location.hostname);
      designStudio.setPort(window.document.location.port);
      designStudio.setProtocol(window.document.location.protocol.split(":")[0]);
      designStudio.setClient(client);
      designStudio.setLanguage(language);
      if (this.repositoryUrl) {
        designStudio.setRepositoryUrl(this.repositoryUrl);
      }
      designStudio.setApplicationPath(this.repositoryUrl + "0ANALYTIC_GRID");
      designStudio.setApplicationName("0ANALYTIC_GRID");
      designStudio.setUrlParameter(urlParams);
      designStudio.setSdkLoaderPath("");
      designStudio.setHanaMode(true);
      designStudio.setDshControlId(that.getId());
      designStudio.setStaticMimesRootPath(this.dshBaseUrl);
      designStudio.setSystemAlias(this.getSystemAlias());
      designStudio.setNewBW(true);
      this.page = designStudio.createPage();
      if(!sap.zen.dsh.wnd){
        sap.zen.dsh.wnd = {};
      }
      sap.zen.dsh.wnd[that.getId()+"Buddha"] = this.page;
      sap.zen.dsh.sapbi_page = sap.zen.dsh.sapbi_page || {};
      sap.zen.dsh.sapbi_page.staticMimeUrlPrefix = this.dshBaseUrl;
      sap.zen.dsh.sapbi_page.getParameter = function(){return "";};
      sap.zen.dsh.sapbi_MIMES_PIXEL = "";
    };
    AnalyticGrid.prototype.onAfterRendering = function(){
      this._initializeInternal();
    };
    AnalyticGrid.prototype._logoff = function(){
      if (!this.loggedOff) {
        this.loggedOff = true;
        this._executeScript("APPLICATION.logoff();");
      }
    };
    AnalyticGrid.prototype.exit = function(){
      this._logoff();
      var oRootAbsLayout = sap.ui.getCore().byId(this.sId + "ROOT_absolutelayout");
      if (oRootAbsLayout) {
        oRootAbsLayout.destroy();
      }
    };
    AnalyticGrid.prototype._addParameter = function(name, value) {
      this.parameters[name] = value;
    };
    AnalyticGrid.prototype._executeScript = function(script){
      if (this.page) {
        this.page.getWindow().increaseLock();
        this.page.exec && this.page.exec(script);
      }
    };
    AnalyticGrid.prototype.setSelection = function(oSelectionVariant) {
      this.setProperty("selection", oSelectionVariant, true);
      if (this.initialized) {
        var oNavParams = this._buildNavParamObject(oSelectionVariant);
        this.page.navigationParamObject = JSON.stringify(oNavParams);
        this._executeScript("GLOBAL_SCRIPT_ACTIONS.ApplyNavigationParameters();");
      }
      return this;
    };
    AnalyticGrid.prototype.fireSelectionChange = function(mParameters) {
      this.setProperty("selection", mParameters.selection, true);
      return this.fireEvent("selectionChange", mParameters);
    };
    AnalyticGrid.prototype._buildNavParamObject = function(oSelectionVariant) {
      function addValuesToObject(sObject, oValueHolder, sValue) {
        if (!Object.prototype.hasOwnProperty.call(oValueHolder, sObject)) {
          oValueHolder[sObject] = sValue;
        }
      }
      var oNavParams = {};
      if (oSelectionVariant) {
        var aParameters = oSelectionVariant.Parameters;
        var aSelectOptions = oSelectionVariant.SelectOptions;
        //Nav Parameters are NOT mapped <--> semantic objects.
        if (aParameters) {
          for (var parameterNum = 0; parameterNum < aParameters.length; parameterNum++) {
            var oParameter = aParameters[parameterNum];
            oNavParams[oParameter.PropertyName] = oParameter.PropertyValue;
          }
        }
        if (aSelectOptions) {
          for (var i = 0; i < aSelectOptions.length; ++i) {
            var oSelectOption = aSelectOptions[i];
            var aRanges = oSelectOption.Ranges;
            var aFilters = [];
            for (var j = 0; j < aRanges.length; ++j) {
              var filterValue;
              var oRange = aRanges[j];
              //Skip if this value uses an unsupported operation
              if (["EQ","BT","GE","LE","GT","LT"].indexOf(oRange.Option) == -1) {
                continue;
              }
              //For simple equals inclusions, use string instead of object.
              if (oRange.Sign === "I" && oRange.Option === "EQ") {
                filterValue = oRange.Low;
              } else {
                filterValue = {
                  exclude : oRange.Sign === "E" || undefined,
                  operation : oRange.Option,
                  from : oRange.Low,
                  to : oRange.High
                };
              }
              aFilters.push(filterValue);
            }
            if (aFilters.length > 0) {
              addValuesToObject(oSelectOption.PropertyName, oNavParams, aFilters);
            }
          }
        }
      }
      return oNavParams;
    };
    AnalyticGrid.prototype._initializeSelectionVariant = function(oSelectionVariant) {
      var oNavParams = this._buildNavParamObject(oSelectionVariant);
      if (!jQuery.isEmptyObject(oNavParams)) {
        this._addParameter("NAV_PARAMS", JSON.stringify(oNavParams));
      }
    };
    AnalyticGrid.prototype._initializeInnerAppState = function(sState) {
      if (sState) {
        this._addParameter("NAV_INITIAL_STATE", sState);
      }
    };
    AnalyticGrid.prototype.setState = function (sState) {
      this.setProperty("state", sState, true);
      if (this.initialized) {
        this.page.getWindow().getContext("BookmarkInternal").applyApplicationState(sState, true);
        this.page.forceFullNonDeltaRender();
      }
      return this;
    };
    AnalyticGrid.prototype.fireStateChange = function(mParameters) {
      this.setProperty("state", mParameters.state, true);
      return this.fireEvent("stateChange", mParameters);
    };

    return AnalyticGrid;
  }
);
