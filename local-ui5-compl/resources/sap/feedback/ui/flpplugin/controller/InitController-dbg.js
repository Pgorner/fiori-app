"use strict";

sap.ui.define(["sap/feedback/ui/thirdparty/sap-px/pxapi", "sap/base/Log", "sap/ui/Device", "../common/Constants", "../common/Util", "../embeddedCfg/EmbeddedPxConfig", "../pxapi/PxApiWrapper", "../storage/PushStateMigrator"], function (___sap_px_pxapi, Log, Device, __Constants, __Util, __EmbeddedPxConfig, __PxApiWrapper, __PushStateMigrator) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
  function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
  function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var Environment = ___sap_px_pxapi["Environment"];
  var Constants = _interopRequireDefault(__Constants);
  var Util = _interopRequireDefault(__Util);
  var EmbeddedPxConfig = _interopRequireDefault(__EmbeddedPxConfig);
  var PxApiWrapper = _interopRequireDefault(__PxApiWrapper);
  var PushStateMigrator = _interopRequireDefault(__PushStateMigrator);
  var InitController = /*#__PURE__*/function () {
    function InitController(pluginInfo) {
      _classCallCheck(this, InitController);
      this._pxApiWrapper = new PxApiWrapper(pluginInfo);
    }
    return _createClass(InitController, [{
      key: "pxApiWrapper",
      get: function get() {
        return this._pxApiWrapper;
      }
    }, {
      key: "init",
      value: function init(parameters, surveyInvitationDialogCallback) {
        try {
          var _temp2 = function _temp2(_result) {
            if (_exit) return _result;
            Log.error(Constants.ERROR.INIT_PARAMS_INCONSISTENT, undefined, Constants.COMPONENT.INIT_CONTROLLER);
            return false;
          };
          var _exit = false;
          var _this = this;
          if (!PushStateMigrator.migrate()) {
            Log.error(Constants.ERROR.PUSH_STATE_MIGRATION_FAILED, undefined, Constants.COMPONENT.INIT_CONTROLLER);
            return Promise.resolve(false);
          }
          if (_this.isPhone()) {
            Log.info(Constants.INFO.PHONE_NOT_SUPPORTED, undefined, Constants.COMPONENT.INIT_CONTROLLER);
            return Promise.resolve(false);
          }
          var _temp = function () {
            if (_this.hasOldParameters(parameters)) {
              return Promise.resolve(_this.initWithOldParameters(parameters, surveyInvitationDialogCallback)).then(function (_await$_this$initWith) {
                _exit = true;
                return _await$_this$initWith;
              });
            } else return function () {
              if (_this.hasNewParameters(parameters)) {
                if (_this.hasUrlParameters()) {
                  _this.overwriteWithUrlParameters(parameters);
                }
                return Promise.resolve(_this.initWithNewParameters(parameters, surveyInvitationDialogCallback)).then(function (_await$_this$initWith2) {
                  _exit = true;
                  return _await$_this$initWith2;
                });
              }
            }();
          }();
          return Promise.resolve(_temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp));
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "isPhone",
      value: function isPhone() {
        return Device.system.phone;
      }
    }, {
      key: "hasNewParameters",
      value: function hasNewParameters(parameters) {
        if (parameters.configUrl && parameters.unitId && parameters.environment) {
          Log.debug(Constants.DEBUG.INIT_PARAMS_MANDATORY_FOUND_NEW, undefined, Constants.COMPONENT.INIT_CONTROLLER);
          return true;
        }
        Log.debug(Constants.DEBUG.INIT_PARAMS_MANDATORY_NOT_SET_NEW, undefined, Constants.COMPONENT.INIT_CONTROLLER);
        if (parameters.configJson) {
          Log.debug(Constants.DEBUG.INIT_PARAMS_MANDATORY_FOUND_JSON, undefined, Constants.COMPONENT.INIT_CONTROLLER);
          return true;
        }
        Log.debug(Constants.DEBUG.INIT_PARAMS_MANDATORY_NOT_SET_JSON, undefined, Constants.COMPONENT.INIT_CONTROLLER);
        return false;
      }
    }, {
      key: "hasOldParameters",
      value: function hasOldParameters(parameters) {
        if (parameters.qualtricsInternalUri && parameters.tenantId) {
          Log.debug(Constants.DEBUG.INIT_PARAMS_MANDATORY_FOUND_OLD, undefined, Constants.COMPONENT.INIT_CONTROLLER);
          return true;
        }
        Log.debug(Constants.DEBUG.INIT_PARAMS_MANDATORY_NOT_SET_OLD, undefined, Constants.COMPONENT.INIT_CONTROLLER);
        return false;
      }
    }, {
      key: "hasUrlParameters",
      value: function hasUrlParameters() {
        if (Util.isUnitIdUrlParamSet() && Util.isEnvironmentUrlParamSet()) {
          Log.debug(Constants.DEBUG.INIT_PARAMS_URL_MODIFIED, undefined, Constants.COMPONENT.INIT_CONTROLLER);
          return true;
        }
        return false;
      }
    }, {
      key: "overwriteWithUrlParameters",
      value: function overwriteWithUrlParameters(parameters) {
        var unitId = Util.getUnitIdUrlParamValue();
        if (unitId) {
          parameters.unitId = unitId;
        }
        var env = Util.getEnvironmentUrlParamValue();
        if (env) {
          parameters.environment = env;
        }
      }

      // FLP Settings
    }, {
      key: "initWithNewParameters",
      value: function initWithNewParameters(parameters, surveyInvitationDialogCallback) {
        try {
          var _temp4 = function _temp4(_result3) {
            if (_exit2) return _result3;
            Log.error(Constants.ERROR.INIT_PARAMS_INCONSISTENT, undefined, Constants.COMPONENT.INIT_CONTROLLER);
            return false;
          };
          var _exit2 = false;
          var _this2 = this;
          var _temp3 = function () {
            if (parameters.configUrl && !parameters.configJson) {
              var tenantInfo = {
                tenantId: parameters.tenantId,
                tenantRole: parameters.tenantRole
              };
              var configIdentifier = {
                configUrl: parameters.configUrl,
                unitId: parameters.unitId,
                environment: parameters.environment
              };
              return Promise.resolve(_this2._pxApiWrapper.initialize(tenantInfo, configIdentifier, undefined, surveyInvitationDialogCallback)).then(function (_await$_this2$_pxApiW) {
                _exit2 = true;
                return _await$_this2$_pxApiW;
              });
            } else return function () {
              if (!parameters.configUrl && parameters.configJson) {
                var _tenantInfo = {
                  tenantId: parameters.tenantId,
                  tenantRole: parameters.tenantRole
                };
                var configJson = parameters.configJson;
                return Promise.resolve(_this2._pxApiWrapper.initialize(_tenantInfo, undefined, configJson, surveyInvitationDialogCallback)).then(function (_await$_this2$_pxApiW2) {
                  _exit2 = true;
                  return _await$_this2$_pxApiW2;
                });
              }
            }();
          }();
          //Load PX-API
          return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3));
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "initWithOldParameters",
      value: function initWithOldParameters(parameters, surveyInvitationDialogCallback) {
        try {
          var _this3 = this;
          //Load embedded config
          var configJson = {
            version: '0.4.0',
            unitId: '83cec47d-199c-4fc9-8848-330c6e3ec6bb',
            environment: Environment.prod,
            startupConfig: {
              qualtricsInternalUri: parameters.qualtricsInternalUri,
              productName: parameters.productName,
              platformType: parameters.platformType,
              scopeSet: _this3.convertScopeSet(parameters.scopeSet)
            },
            runtimeConfig: {
              useApi: true
            },
            themingConfig: {
              writeToGlobals: true
            },
            pushConfig: EmbeddedPxConfig.pushConfig()
          };
          var tenantInfo = {
            tenantId: parameters.tenantId,
            tenantRole: parameters.tenantRole
          };
          //Load and init PX-API
          return Promise.resolve(_this3._pxApiWrapper.initialize(tenantInfo, undefined, configJson, surveyInvitationDialogCallback));
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "convertScopeSet",
      value: function convertScopeSet(scopeSetString) {
        var scopeSetMap = {
          featurePush: Constants.SCOPE_SETS.APP_PUSH,
          dynamicPush: Constants.SCOPE_SETS.TIMED_PUSH
        };
        if (scopeSetString) {
          var scopeSetArray = scopeSetString.split(',');
          scopeSetArray = this.appendManualScopeSet(scopeSetArray);
          var scopeSet = scopeSetArray.map(function (scopeItem) {
            return scopeSetMap[scopeItem.trim()] || scopeItem.trim();
          });
          return scopeSet;
        }
        return [Constants.SCOPE_SETS.MANUAL];
      }
    }, {
      key: "appendManualScopeSet",
      value: function appendManualScopeSet(scopeSetArray) {
        if (scopeSetArray.indexOf(Constants.SCOPE_SETS.MANUAL) > -1) {
          return scopeSetArray;
        }
        scopeSetArray.push(Constants.SCOPE_SETS.MANUAL);
        return scopeSetArray;
      }
    }]);
  }();
  return InitController;
});
//# sourceMappingURL=InitController-dbg.js.map
