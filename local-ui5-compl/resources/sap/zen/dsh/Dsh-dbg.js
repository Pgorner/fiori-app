/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define("sap/zen/dsh/Dsh",
  [
    "jquery.sap.global",
    "sap/zen/dsh/library",
    "sap/ui/thirdparty/URI",
    "sap/ui/core/Control",
    "sap/zen/dsh/DshRenderer",
    "sap/viz/library"
  ], function (jQuery, dshLib, URI, Control, DshRenderer) {
    "use strict";
    /**
     *
     * @name sap.zen.dsh.Dsh#addParameter
     * @function
     * @param {string} sName the name of the parameter
     * @param {string} sValue the value of the parameter
     * @type string
     * @public
     */

    /**
     *
     * @name sap.zen.dsh.Dsh#executeScript
     * @function
     * @param {string} sScript the content of the script
     * @type void
     * @public
     */

    /**
     *
     * @name sap.zen.dsh.Dsh#getDataSource
     * @function
     * @param {string} sName the namw of the data source
     * @type object
     * @public
     */

    /**
     *
     * @name sap.zen.dsh.Dsh#getComponent
     * @function
     * @param {string} sName the Name of the Component
     * @type object
     * @public
     */

    /**
     *
     * @name sap.zen.dsh.Dsh#getPage
     * @function
     * @type object
     * @public
     */

    /**
     *
     * @name sap.zen.dsh.Dsh#createPage
     * @function
     * @type void
     * @public
     */

    /**
     * Initialize cross-application navigation state directly with AppStateData. e.g., when calculated by sap.ui.generic.app.navigation.service.NavigationHandler
     *
     * @name sap.zen.dsh.Dsh#initializeAppStateData
     * @function
     * @param {object} oOStateData
     *         The AppStateData to apply
     * @param {object} oONavParams
     *         Simple Javascript object containing name-value pairs of additional navigation state to be mixed in
     * @type void
     * @public
     */

    /**
     * Initialize cross-application navigation state with an AppState object
     *
     * @name sap.zen.dsh.Dsh#initializeAppState
     * @function
     * @param {object} oOStartupAppState
     *         The AppState object from which to retrieve and apply Application State.
     * @param {object} oONavParams
     *         Simple Javascript object containing name-value pairs of additional navigation state to be mixed in
     * @type void
     * @public
     */


    /**
     * Constructor for a new Dsh.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     * Control for embedding a Design Studio application full-screen in an S/4 HANA Fiori application
     * @extends sap.ui.core.Control
     *
     * @constructor
     * @public
     * @deprecated Since version 1.89.0, Please use the WD Grid control instead.
     * @since 1.44
     * @name sap.zen.dsh.Dsh
     */
    var Dsh = Control.extend("sap.zen.dsh.Dsh", /** @lends sap.zen.dsh.Dsh.prototype */ {
      metadata: {
        library: "sap.zen.dsh",
        properties: {

          /**
           * Name of the Design Studio application to be opened.
           */
          dshAppName: {
            type: "string",
            group: "Misc",
            defaultValue: "0ANALYSIS"
          },
          /**
           * Path to application specified by dshAppName
           */
          repoPath: { type: "string", group: "Misc", defaultValue: null },

          /**
           * Desired width of the Design Studio Control
           */
          width: { type: "sap.ui.core.CSSSize", group: "Misc", defaultValue: null },

          /**
           * Desired height of the Design Studio Control
           */
          height: { type: "sap.ui.core.CSSSize", group: "Misc", defaultValue: null },

          /**
           * the type of deployment
           */
          deployment: { type: "string", group: "Misc", defaultValue: "bw" },

          /**
           * the protocol
           */
          protocol: { type: "string", group: "Misc", defaultValue: null },

          /**
           * the client
           */
          client: { type: "string", group: "Misc", defaultValue: null },

          /**
           * the language
           */
          language: { type: "string", group: "Misc", defaultValue: null },

          /**
           * the semantic mappings
           */
          semanticMappings: { type: "object", group: "Misc", defaultValue: null },

          /**
           * the application component
           */
          appComponent: { type: "object", group: "Misc", defaultValue: null },

          /**
           * whether to defer the creation
           */
          deferCreation: { type: "boolean", group: "Misc", defaultValue: false },

          /**
           * the system alias
           */
          systemAlias: { type: "string", group: "Misc", defaultValue: null }
        }
      },
      renderer: DshRenderer
    });


    /**
     * This file defines behavior for the control,
     */
    sap.zen.dsh.DSH_deployment = true;
    var sapbi_ajaxHandler = sapbi_ajaxHandler || {};
    sap.zen.dsh.sapbi_page = sap.zen.dsh.sapbi_page || {};
    sap.zen.dsh.sapbi_page.getParameter = sap.zen.dsh.sapbi_page.getParameter || function () { return ""; };
    sap.zen.dsh.sapbi_page.staticMimeUrlPrefix = sap.ui.resource("sap.zen.dsh", "rt/");

    sap.zen.dsh.doReplaceDots = true;
    Dsh.prototype.init = function () {
      this.initial = true;
      this.rendered = false;
      this.parameters = {};

      this.dshBaseAppUrlBW = "/sap/bw/Mime";
      this.dshBaseUrl = URI(sap.ui.resource("sap.zen.dsh", "widgets/")).absoluteTo(document.baseURI).toString();
    };

    /**
     * Create Page
     */
    Dsh.prototype.createPage = function () {
      this.doIt();
    };

    /**
     * DoInit
     */
    Dsh.prototype.doInit = function () {
      //0ANALYSIS will always come from our library for now.  This will be cleaned up later.
      if (this.getDshAppName() === "0ANALYSIS" || this.getDshAppName() === "0ANALYTIC_GRID") {
        this.setRepoPath(URI(sap.ui.resource("sap.zen.dsh", "applications/")).absoluteTo(document.baseURI).toString());
      }

      if (this.getRepoPath() !== "") {
        this.repositoryUrl = this.getRepoPath();
      }

      if (!this.initial) {
        return;
      }
      this.initial = false;

      /*
       * load modules required in Debug Mode
       *       - load jszip synchron
       *       - load xlsx synchron
       */

      var that = this;
      if (!this.getDeferCreation()) {
        setTimeout(function () {
          that.doIt();
        }, 0);
      }
    };

    /**
     * DoIt: create the Page Control
     */
    Dsh.prototype.doIt = function () {
      this.doInit();
      sap.zen.dsh.scriptLoaded = true;

      var that = this;
      {
        var language = that.getLanguage();
        if (!language) {
          var oConfig = sap.ui.getCore().getConfiguration();

          language = oConfig.getSAPLogonLanguage();

          if (!language) {
            language = window.navigator.userLanguage || window.navigator.language;
          }
        }

        var client = that.getClient();
        if (!client && window.document.cookie) {
          var match = /(?:sap-usercontext=)*sap-client=(\d{3})/.exec(window.document.cookie);
          if (match && match[1]) {
            client = match[1];
          }
        }

        var deployment = that.getDeployment();
        if (!deployment || deployment.length === 0) {
          deployment = "bw";
        }

        var app = that.getDshAppName();

        // ensure valid URL parameters are contained within parameters
        var loStartupParameters = this.getStartupParameters();
        if (loStartupParameters) {
          for (var lStartupParameter in loStartupParameters) {
            if (this.isDshParameter(lStartupParameter)) {
              if (!this.doesParameterExist(lStartupParameter)) {
                this.addParameter(lStartupParameter, loStartupParameters[lStartupParameter][0]);
              }
            }
          }
        }
        // add all parameters to urlParams
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
        designStudio.setApplicationPath(this.dshBaseAppUrlBW);
        designStudio.setApplicationName(app);
        designStudio.setUrlParameter(urlParams);
        designStudio.setSdkLoaderPath("");
        designStudio.setHanaMode(true);
        designStudio.setDshControlId(that.getId());
        designStudio.setStaticMimesRootPath(this.dshBaseUrl);
        designStudio.setSystemAlias(this.getSystemAlias());
        if (deployment === "bw2" || deployment === "bw") {
          designStudio.setNewBW(true);
        }
        designStudio.setRightToLeft(sap.ui.getCore().getConfiguration().getRTL());

        this._page = designStudio.createPage();
        if (this.rendered) {
          this._page.handleAfterRenderingOfRootControl();
        }
        if (!sap.zen.dsh.wnd) {
          sap.zen.dsh.wnd = {};
        }
        sap.zen.dsh.wnd[this._page.getPageIdForScripting()] = this._page;

        sap.zen.dsh.sapbi_page = sap.zen.dsh.sapbi_page || {};
        sap.zen.dsh.sapbi_page.staticMimeUrlPrefix = this.dshBaseUrl;
        sap.zen.dsh.sapbi_page.getParameter = function () { return ""; };
        sap.zen.dsh.sapbi_MIMES_PIXEL = "";

        //set appComponent on frontend sapbi_page, in case it is passed in.
        if (this.getAppComponent()) {
          sap.zen.dsh.sapbi_page.appComponent = this.getAppComponent();
        }

        var customCSS = this._page.getApplicationPropertiesComponent().getCustomCSSName();
        if (customCSS) {
          var fileref = window.document.createElement("link");
          fileref.setAttribute("type", "text/css");
          fileref.setAttribute("rel", "stylesheet");
          fileref.setAttribute("href", URI(this._page.getRelativePathToApp() + customCSS).normalize().toString());
          window.document.getElementsByTagName("head")[0].appendChild(fileref);
        }
      }
    };

    /**
     * OnAfterRendering:
     * Rendering of the Base Control is complete
     */
    Dsh.prototype.onAfterRendering = function () {
      this.doInit();
      if (this._page) {
        this._page.handleAfterRenderingOfRootControl();
      }
      this.rendered = true;
    };

    /**
     * Log Off
     */
    Dsh.prototype.logoff = function () {
      if (this._page && !this.loggedOff) {
        this.loggedOff = true;
        sap.zen.dsh.buddhaHasSendLock++;
        this._page.exec("APPLICATION.logoff();");
      }
    };

    /**
     * Exit
     */
    Dsh.prototype.exit = function () {
      this.logoff();

      var oRootAbsLayout = sap.ui.getCore().byId(this.sId + "ROOT_absolutelayout");
      if (oRootAbsLayout) {
        oRootAbsLayout.destroy();
      }

      // Variable Dialog is not able to remove the Message Component (see zendialog_m_handler: not reflected as child)
      var oVariableMessageDialog = sap.ui.getCore().byId(this.sId + "VARIABLEDIALOG_MESSAGE_messageview1");
      if (oVariableMessageDialog) {
        oVariableMessageDialog.destroy();
      }
    };

    /**
     * Add Parameter
     */
    Dsh.prototype.addParameter = function (name, value) {
      this.parameters[name] = value;
    };

    /**
     * Check if Parameter exists
     */
    Dsh.prototype.doesParameterExist = function (name) {
      if (this.parameters[name]) {
        return true;
      }
      return false;
    };

    /**
     * Retrieve StartUp Parameters of Application Component we are called by
     */
    Dsh.prototype.getStartupParameters = function () {
      if (this.getAppComponent()) {
        if (this.getAppComponent().getComponentData()) {
          return this.getAppComponent().getComponentData().startupParameters;
        }
      }
      return null;
    };

    /**
     * Check if Parameter belongs to us
     */
    Dsh.prototype.isDshParameter = function (name) {
      if (name === "XTITLE" || name === "XQUERY" || name === "XDISPLAY" || name === "XCHART_TYPE" || name === "XPROMPT" || name === "XVISIBLEPROMPTS" || name === "XDATALIMIT_ROWS" || name === "XDATALIMIT_COLS" || name == "XEXCEL_VERSION") {
        return true;
      }
      return false;
    };

    /**
     * Execure Script Function
     */
    Dsh.prototype.executeScript = function (script) {
      this.page.exec(script);
    };

    /**
     * Get DataSource
     */
    Dsh.prototype.getDataSource = function (name) {
      return this.page.getDataSource(name);
    };

    /**
     * Get Component
     */
    Dsh.prototype.getComponent = function (name) {
      return this.page.getComponent(name);
    };

    /**
     * Get Page
     */
    Dsh.prototype.getPage = function () {
      return this.page;
    };

    /**
     * Get Semantic Mappings
     */
    Dsh.prototype.getMapping = function (sName) {
      if (this.getSemanticMappings() && this.getSemanticMappings()[sName]) {
        return this.getSemanticMappings()[sName];
      }
      return sName;
    };

    /**
     * Initialize App State Data
     */
    Dsh.prototype.initializeAppStateData = function (oStateData, oNavParams) {
      function addMappedValuesToObject(oMapping, oValueHolder, sValue) {
        if (Array.isArray(oMapping)) {
          for (var entry in oMapping) {
            if (
              !Object.prototype.hasOwnProperty.call(oValueHolder, oMapping[entry])
            ) {
              oValueHolder[oMapping[entry]] = sValue;
            }
          }
        }
        else {
          if (
            !Object.prototype.hasOwnProperty.call(oValueHolder, oMapping)
          ) {
            oValueHolder[oMapping] = sValue;
          }
        }
      }

      oNavParams = oNavParams || {};

      // cleanup navigation parameters
      for (var i = 0; i < Object.keys(oNavParams).length; ++i) {
        var lKey = Object.keys(oNavParams)[i];

        // do not add allowed URL parameters to navigation parameters
        if (this.isDshParameter(lKey)) {
          delete oNavParams[lKey];
        }
      }


      if (oStateData && oStateData.customData && oStateData.customData.bookmarkedAppState) {
        this.addParameter("NAV_INITIAL_STATE", oStateData.customData.bookmarkedAppState);
      }

      if (oStateData && oStateData.selectionVariant) {
        //We either have a real selectionVariant as js object here, or we have
        //it in string format.  If string format, then there is also an oSelectionVariant,
        //see sap.ui.generic.app.navigation.service.SelectionVariant
        var oSelectionVariant = oStateData.selectionVariant;
        if (typeof oSelectionVariant !== "object" && typeof oStateData.oSelectionVariant === "object" && oStateData.oSelectionVariant.toJSONObject) {
          oSelectionVariant = oStateData.oSelectionVariant.toJSONObject();
        }
        var aParameters = oSelectionVariant.Parameters;
        var aSelectOptions = oSelectionVariant.SelectOptions;

        //Nav Parameters are NOT mapped <--> semantic objects.
        if (aParameters) {
          for (var parameterNum = 0; parameterNum < aParameters.length; parameterNum++) {
            var oParameter = aParameters[parameterNum];

            // do not add allowed URL parameters to navigation parameters
            if (this.isDshParameter(oParameter.PropertyName)) {
              continue;
            }

            oNavParams[oParameter.PropertyName] = oParameter.PropertyValue;
          }
        }

        if (aSelectOptions) {
          for (i = 0; i < aSelectOptions.length; ++i) {
            var oSelectOption = aSelectOptions[i];

            // do not add allowed URL parameters to navigation parameters
            if (this.isDshParameter(oSelectOption.PropertyName)) {
              continue;
            }

            var aRanges = oSelectOption.Ranges;
            var aFilters = [];

            for (var j = 0; j < aRanges.length; ++j) {
              var filterValue;
              var oRange = aRanges[j];

              //Skip if this value uses an unsupported operation
              if (["EQ", "BT", "GE", "LE", "GT", "LT"].indexOf(oRange.Option) == -1) {
                continue;
              }

              //For simple equals inclusions, use string instead of object.
              if (oRange.Sign === "I" && oRange.Option === "EQ") {
                filterValue = oRange.Low;
              } else {
                filterValue = {
                  exclude: oRange.Sign === "E" || undefined,
                  operation: oRange.Option,
                  from: oRange.Low,
                  to: oRange.High
                };
              }
              aFilters.push(filterValue);
            }
            if (aFilters.length > 0) {
              addMappedValuesToObject(this.getMapping(oSelectOption.PropertyName), oNavParams, aFilters);
            }
          }
        }
      }
      if (!jQuery.isEmptyObject(oNavParams)) {
        this.addParameter("NAV_PARAMS", JSON.stringify(oNavParams));
      }
    };

    /**
     * Initialize App State
     */
    Dsh.prototype.initializeAppState = function (oStartupAppState, oNavParams) {
      if (oStartupAppState) {
        var oStateData = {};
        //Do stuff with state
        if (oStartupAppState.getData && typeof oStartupAppState.getData === "function") {
          oStateData = oStartupAppState.getData();
        }
        this.initializeAppStateData(oStateData, oNavParams);
      }
    };
    return Dsh;
  }
);
