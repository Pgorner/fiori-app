"use strict";

sap.ui.define(["sap/feedback/ui/thirdparty/sap-px/pxapi", "sap/m/library", "./Ui5ControlFactory", "../common/Constants", "../data/AppContextData"], function (___sap_px_pxapi, sap_m_library, __Ui5ControlFactory, __Constants, __AppContextData) {
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
  var PushType = ___sap_px_pxapi["PushType"];
  var ButtonType = sap_m_library["ButtonType"];
  var DialogType = sap_m_library["DialogType"];
  var Ui5ControlFactory = _interopRequireDefault(__Ui5ControlFactory);
  var Constants = _interopRequireDefault(__Constants);
  var AppContextData = _interopRequireDefault(__AppContextData);
  var InvitationDialog = /*#__PURE__*/function () {
    function InvitationDialog(resourceBundle) {
      _classCallCheck(this, InvitationDialog);
      this._resourceBundle = resourceBundle;
    }
    return _createClass(InvitationDialog, [{
      key: "surveyInvitationDialogShowCallback",
      value: function surveyInvitationDialogShowCallback(eventData) {
        try {
          var _this = this;
          var surveyInvitationDialogResponse = new Promise(function (resolve) {
            return _this._resolveSurveyInvitation = resolve;
          });
          var _temp = function () {
            if (eventData.showInvitation) {
              _this.showInvitationDialog(eventData.pushType);
            } else {
              return Promise.resolve(_this.sendInvitationCallbackResponse(true)).then(function () {});
            }
          }();
          return Promise.resolve(_temp && _temp.then ? _temp.then(function () {
            return surveyInvitationDialogResponse;
          }) : surveyInvitationDialogResponse);
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "showInvitationDialog",
      value: function showInvitationDialog(pushType) {
        if (!this._invitationDialog) {
          this._invitationDialog = this.createInvitationDialog();
        }
        if (!this._invitationDialog.isOpen()) {
          this.setDismissButtonText(pushType);
          this._invitationDialog.open();
        }
      }
    }, {
      key: "setDismissButtonText",
      value: function setDismissButtonText(pushType) {
        var dismissButtonText = this.getText('YOUR_OPINION_NOTNOW');
        if (pushType === PushType.timedPush) {
          dismissButtonText = this.getText('YOUR_OPINION_ASKLATERBUTTON');
        }
        this._invitationDialog.getEndButton().setText(dismissButtonText);
      }
    }, {
      key: "onInvitationDialogClose",
      value: function onInvitationDialogClose(willProvideFeedback) {
        try {
          var _this2 = this;
          _this2._invitationDialog.close();
          return Promise.resolve(_this2.sendInvitationCallbackResponse(willProvideFeedback)).then(function () {});
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "sendInvitationCallbackResponse",
      value: function sendInvitationCallbackResponse(willProvideFeedback) {
        try {
          var _this3 = this;
          return Promise.resolve(AppContextData.getData()).then(function (appContextData) {
            _this3._resolveSurveyInvitation({
              appContextData: appContextData,
              surveyUser: willProvideFeedback
            });
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "getText",
      value: function getText(textKey) {
        var _this$_resourceBundle;
        return (_this$_resourceBundle = this._resourceBundle.getText(textKey)) !== null && _this$_resourceBundle !== void 0 ? _this$_resourceBundle : textKey;
      }
    }, {
      key: "createFeedbackButton",
      value: function createFeedbackButton() {
        var _this4 = this;
        return Ui5ControlFactory.createButton({
          type: ButtonType.Emphasized,
          text: this.getText('YOUR_OPINION_PROVIDEBUTTON'),
          press: function press() {
            _this4.onInvitationDialogClose(true);
          }
        });
      }
    }, {
      key: "createDismissButton",
      value: function createDismissButton() {
        var _this5 = this;
        return Ui5ControlFactory.createButton({
          text: this.getText('YOUR_OPINION_NOTNOW'),
          press: function press() {
            _this5.onInvitationDialogClose(false);
          }
        });
      }
    }, {
      key: "createInvitationDialog",
      value: function createInvitationDialog() {
        return Ui5ControlFactory.createDialog({
          type: DialogType.Message,
          title: this.getText('YOUR_OPINION_TITLE'),
          content: Ui5ControlFactory.createFormattedText({
            htmlText: this.getText('YOUR_OPINION_TEXT')
          }),
          beginButton: this.createFeedbackButton(),
          endButton: this.createDismissButton(),
          escapeHandler: this.handleEscape.bind(this)
        }, Constants.SURVEY_INVITATION_DIALOG_ID);
      }
    }, {
      key: "handleEscape",
      value: function handleEscape(promise) {
        promise.resolve();
        this.onInvitationDialogClose(false);
      }
    }]);
  }();
  return InvitationDialog;
});
//# sourceMappingURL=InvitationDialog-dbg.js.map
