"use strict";

sap.ui.define(["sap/ui/core/Component", "./controller/ControllerFactory", "./ui/ControlFactory"], function (Component, __ControllerFactory, __ControlFactory) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  var ControllerFactory = _interopRequireDefault(__ControllerFactory);
  var ControlFactory = _interopRequireDefault(__ControlFactory);
  /**
   *
   * @namespace sap.feedback.ui.flpplugin
   *
   * @class
   * Enables users to provide feedback in the Fiori Launchpad.
   *
   * @extends sap.ui.core.Component
   * @name sap.feedback.ui.flpplugin.Component
   * @author SAP SE
   * @since 1.90.0
   */
  var MyComponent = Component.extend("sap.feedback.ui.flpplugin.MyComponent", {
    metadata: {
      manifest: 'json',
      properties: {
        /**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
         * Specifies the url for the Web/App Feedback project which should be loaded. This property is mandatory when providing the configuration manually.
         */
        url: {
          name: 'url',
          type: 'string'
        },
        /**
         * Specifies the unique tenant id to map feedback results to this tenant. This property is mandatory when providing the configuration manually.
         */
        tenantId: {
          name: 'tenantId',
          type: 'string'
        },
        /**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
         * The tenant role provides an indicator of the tenant and its purpose (development, test, productive, etc.). Helpful to identify feedback from different source systems.
         */
        tenantRole: {
          name: 'tenantRole',
          type: 'string'
        },
        /**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
         * Enables some new features and changes the data format for the context data collected with the survey to version 2.
         */
        isPushEnabled: {
          name: 'isPushEnabled',
          type: 'boolean'
        },
        /**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
         * Internal usage only
         */
        pushChannelPath: {
          name: 'pushChannelPath',
          type: 'string'
        },
        /**
         * Can be provided with the collected context data to the survey to allow filtering of survey results by product name.
         */
        productName: {
          name: 'productName',
          type: 'string'
        },
        /**
         * Can be provided with the collected context data to the survey to allow filtering of survey results by platform type.
         */
        platformType: {
          name: 'platformType',
          type: 'string'
        },
        /**
         * @deprecated Deprecated with 1.114. Please use 'configIdentifier' property.
         * Optional comma-separated string list of scope items to enable single features.
         */
        scopeSet: {
          name: 'scopeSet',
          type: 'string'
        },
        /**
         * Identification data to select and load respective Central configuration.
         */
        configIdentifier: {
          name: 'configIdentifier',
          type: 'object'
        },
        /**
         * Configuration providing all necessary information to start and run.
         */
        configJson: {
          name: 'configJson',
          type: 'object'
        }
      }
    },
    constructor: function _constructor(id, settings) {
      Component.prototype.constructor.call(this, id, settings);
    },
    init: function _init() {
      var _this = this;
      (function () {
        try {
          var _settings = _this.readFlpSettings();
          var _temp = function () {
            if (_settings) {
              return Promise.resolve(_this.runInitProcess(_settings)).then(function () {});
            }
          }();
          return _temp && _temp.then ? _temp.then(function () {}) : void 0;
        } catch (e) {
          Promise.reject(e);
        }
      })();
    },
    load: function _load() {
      try {
        var _this2 = this;
        var properties = _this2.readProperties();
        var _temp2 = function () {
          if (properties) {
            return Promise.resolve(_this2.runInitProcess(properties)).then(function () {});
          }
        }();
        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    runInitProcess: function _runInitProcess(parameters) {
      try {
        var _this3 = this;
        var pluginInfo = {
          id: _this3.getManifestEntry('/sap.app/id'),
          version: _this3.getManifestEntry('/sap.app/applicationVersion/version')
        };
        var initController = ControllerFactory.createInitController(pluginInfo);
        var invitationDialog = ControlFactory.createSurveyInvitationDialog(_this3.getResourceBundle());
        var showCallback = invitationDialog.surveyInvitationDialogShowCallback.bind(invitationDialog);
        return Promise.resolve(initController.init(parameters, showCallback)).then(function (_initController$init) {
          if (_initController$init) {
            _this3._pxApiWrapper = initController.pxApiWrapper;
            if (_this3._pxApiWrapper) {
              _this3._pxApiWrapper.invitationDialog = invitationDialog;
              _this3.initializePluginController();
            }
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    initializePluginController: function _initializePluginController() {
      try {
        var _this4 = this;
        var pluginController = ControllerFactory.createPluginController(_this4._pxApiWrapper, _this4.getResourceBundle());
        return Promise.resolve(pluginController.initPlugin()).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    },
    getResourceBundle: function _getResourceBundle() {
      var resourceModel = this.getModel('i18n');
      return resourceModel.getResourceBundle();
    },
    // FLP Settings
    readFlpSettings: function _readFlpSettings() {
      var componentData = this.readComponentData();
      if (componentData) {
        if (componentData.qualtricsInternalUri && componentData.tenantId && !componentData.configUrl || !componentData.qualtricsInternalUri && componentData.tenantId && componentData.configUrl && componentData.unitId && componentData.environment) {
          return componentData;
        }
      }
      return undefined;
    },
    readComponentData: function _readComponentData() {
      var componentData = this.getComponentData();
      if (componentData && componentData.config) {
        return componentData.config;
      }
      return undefined;
    },
    // Component Properties
    readProperties: function _readProperties() {
      if ((this.getProperty('url') || this.getProperty('configIdentifier') || this.getProperty('configJson')) && this.getProperty('tenantId')) {
        var properties = {
          tenantId: this.getProperty('tenantId'),
          tenantRole: this.getProperty('tenantRole'),
          qualtricsInternalUri: this.getProperty('url'),
          isPushEnabled: this.getProperty('isPushEnabled'),
          pushChannelPath: this.getProperty('pushChannelPath'),
          platformType: this.getProperty('platformType'),
          productName: this.getProperty('productName'),
          scopeSet: this.getProperty('scopeSet'),
          configJson: this.getProperty('configJson')
        };
        if (this.getProperty('configIdentifier')) {
          var configIdentifier = this.getProperty('configIdentifier');
          properties.configUrl = configIdentifier.configUrl;
          properties.unitId = configIdentifier.unitId;
          properties.environment = configIdentifier.environment;
        }
        return properties;
      }
      return undefined;
    }
  });
  return MyComponent;
});
//# sourceMappingURL=Component-dbg.js.map
