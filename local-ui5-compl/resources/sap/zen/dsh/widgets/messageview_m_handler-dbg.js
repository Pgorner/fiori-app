/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/zen/dsh/utils/BaseHandler",
    "sap/ui/core/IconPool"
  ],
  function( jQuery, BaseHandler ){
    sap.zen.MessageViewHandler = function() {

      BaseHandler.apply(this, arguments);

      sap.zen.MessageViewHandler.tTexts = {};
      sap.zen.MessageViewHandler.info = "INFO";
      sap.zen.MessageViewHandler.warning = "WARNING";
      sap.zen.MessageViewHandler.error = "ERROR";

      var mainMessageviewId = BaseHandler.dispatcher.dshPrefix + "MESSAGE_messageview1";
      var footerBarId = BaseHandler.dispatcher.dshPrefix + "FOOTERBAR_footerbar";
      var panelBodyId = BaseHandler.dispatcher.dshPrefix + "PANEL_BODY_panel1";
      this.tMessageViews = {};
      this.oldMessagesAfterVarScreen = [];

      /**
       * Set Variable Screen
       */
      sap.zen.MessageViewHandler.setVariableScreen = function(bMode){
        if (bMode){
          if (instance.oMessageView) {
            var loMsgBtn = sap.ui.getCore().byId(
              instance.oMessageView.getMessageButton().getId()
            );
            if (loMsgBtn){
              this.oldMessagesAfterVarScreen = loMsgBtn.oMsgPopover.getModel().getData();
            }
          }
        }
        instance.varScreenMode = bMode;
      };

      /**
       * Create Message
       */
      sap.zen.MessageViewHandler.createMessage = function(level, shortText, longText, logMessage) {
        if (instance.oMessageView) {
          instance.oMessageView.createMessage(level, shortText, longText, logMessage);
        }
      };

      /**
       * Log Message
       */
      sap.zen.MessageViewHandler.logMessage = function(level, shortText, longText) {
        if (instance.oMessageView) {
          instance.oMessageView.logMessage(level, shortText, longText);
        }
      };

      /**
       * Clear Messages
       */
      sap.zen.MessageViewHandler.clearMessages = function() {
        if (instance.oMessageView) {
          instance.oMessageView.clearMessages();
        }
      };

      /**
       * Create Control
       */
      this.createAndAdd = function(phxObj, controlData, componentData, fInsertIntoParentFunclet, iIndex) {
        var loControl = this.create(phxObj, controlData, componentData);

        if (fInsertIntoParentFunclet) {
          fInsertIntoParentFunclet(loControl, iIndex, componentData);
        }
        BaseHandler.dispatcher.updateComponentProperties(loControl, componentData, fInsertIntoParentFunclet);

        return loControl;
      };

      this.create = function(oChainedControl, oControlProperties) {
        this.sLogCommand = oControlProperties.log_command;

        var lId = oControlProperties["id"];

        this.oMessageView = new sap.zen.MessageViewHandler.MessageView(lId, null, _handleMessageView_onAfterUpdate, _handleMessageView_onAfterRendering);
        this.tMessageViews[this.oMessageView.getId()] = this.oMessageView;

        var loMsgBtn = this.oMessageView.getMessageButton();
        this.init(loMsgBtn, oControlProperties);

        return loMsgBtn;
      };

      /**
       * Update Control
       */
      this.update = function(oControl, oControlProperties) {
        if (oControlProperties) {
          this.init(oControl, oControlProperties);
        }
      };

      /**
       * Initialize Control (Create, Update)
       */
      this.init = function(oControl, oControlProperties) {
        var loMessageView = this.oMessageView;

        // ensure initialization is performed on correct MessageView
        var lId = oControlProperties["id"];
        if (loMessageView.getId() !== lId) {
          loMessageView = this.tMessageViews[lId];
        }

        if (oControlProperties.texts) {
          sap.zen.MessageViewHandler.tTexts = oControlProperties.texts;
        }
        loMessageView.init(oControlProperties.messages);
      };

      /**
       * Update FooterBar
       */
      this.updateFooterBar = function(oMsgBtn) {
        if (mainMessageviewId !== oMsgBtn.getId()) {
          return;
        }

        var loFooter = sap.ui.getCore().byId(footerBarId);
        var loPanelBody = sap.ui.getCore().byId(panelBodyId);
        if (loFooter && loPanelBody) {
          var lVisible = oMsgBtn.getVisible();
          loFooter.setHeight(lVisible ? "40px" : "0px");
          var lPosition = loPanelBody.getPositions()[0];
          var lPositionBottom = lPosition.getBottom();
          if (lVisible && lPositionBottom !== "40px") {
            lPosition.setBottom("40px");
            loPanelBody.invalidate();
          }
          if (!lVisible && lPositionBottom !== "0px") {
            lPosition.setBottom("0px");
            loPanelBody.invalidate();
          }
        }
      };

      /**
       * Handle MessageView - OnAfterRendering
       */
      function _handleMessageView_onAfterRendering() {
        if (this.oMessageView.onAfterRenderingOriginal) {
          this.oMessageView.onAfterRenderingOriginal();
        }

        if (!instance.varScreenMode) {
          var oJqUi5BlockLayer = jQuery("#sap-ui-blocklayer-popup");
          var jqMsgBtn = null;//loMsgBtn.$();

          if (oJqUi5BlockLayer && oJqUi5BlockLayer.length > 0
              && oJqUi5BlockLayer.css("visibility") === "visible"
              && oJqUi5BlockLayer.outerWidth() > 0 && oJqUi5BlockLayer.outerHeight() > 0) {

            var sZIndex = oJqUi5BlockLayer.css("z-index");
            if (sZIndex && sZIndex.length > 0) {
              var iZIndex = parseInt(sZIndex, 10);
              jqMsgBtn.css("z-index", "" + (iZIndex + 1));
            }
          } else {
            jqMsgBtn.css("z-index", "auto");
          }
        }
      }

      /**
       * Handle MessageView - OnAfterUpdate
       */
      function _handleMessageView_onAfterUpdate(oMessageView) {
        var loMsgBtn = oMessageView.getMessageButton();
        instance.updateFooterBar(loMsgBtn);
      }

      /**
       * Handle MessageView - OnAfterInitMessages
       */
      window._handleMessageView_onAfterInitMessages = function () {
        if (sap.zen.MessageViewHandler.oldMessagesAfterVarScreen && !instance.varScreenMode) {
          // restoring old messages is only necessary when not on the variable screen
          // this failed when opening a var screen without any messages on the var screen initially,
          // because it still showed the "main app" messages
          var ltResult = sap.zen.MessageViewHandler.oldMessagesAfterVarScreen.slice();
          delete sap.zen.MessageViewHandler.oldMessagesAfterVarScreen;
          return ltResult;
        }
        return null;
      };

      /**
       * Remove
       */
      var super_remove = this.remove;
      this.remove = function(oControl){
        if (oControl.oMsgPopover){
          oControl.oMsgPopover.destroy();
        }
        super_remove.apply(this,arguments);
      };

      /**
       * Get Highest Message Level
       */
      this.getHighestMessageLevel = function(oModel){
        if (instance.oMessageView) {
          instance.oMessageView.getHighestMessageLevel(oModel);
        }
      };

      /**
       * Get Type
       * @returns the Control Type
       */
      this.getType = function(){
        return "messageview";
      };

      /**
       * Utility: Message Button Handling
       */
      sap.zen.MessageViewHandler.MessageView = function(id, tMessages, oFuncOnAfterUpdate, oFuncOnAfterRendering, oFuncOnAfterInitMessages){
        var that = this;

        this.id = id;
        this.oMsgBtn = null;
        this.logCommand;

        /**
         * Get ID
         */
        this.getId = function() {
          return this.id;
        };

        /**
         * Get Message Button Control
         */
        this.getMessageButton = function() {
          return this.oMsgBtn;
        };

        /**
         * Handle: OnAfterUpdate
         */
        this.onAfterUpdate = function() {
          // nothing
        };

        /**
         * Handle: OnAfterRendering
         */
        this.onAfterRendering = function() {
          if (!that.oMsgBtn.oOriginalFuncOnAfterRendering) {
            that.oMsgBtn.oOriginalFuncOnAfterRendering();
          }
        };

        this.onAfterInitMessages = function() {
          // nothing
        };

        /**
         * Create Message Button Control
         */
        function _create(id, tMessages, oFuncOnAfterUpdate, oFuncOnAfterRendering, oFuncOnAfterInitMessages) {
          // destroy old Message Button
          var loOldMsgBtn = sap.ui.getCore().byId(id);
          if (loOldMsgBtn) {
            loOldMsgBtn.destroy();
          }

          // create new Message Button
          var loMsgBtn = new sap.m.Button({
            id: id,
            icon: sap.ui.core.IconPool.getIconURI("message-popup"),
            text: "", //"{/count}",
            type: sap.m.ButtonType.Emphasized,
            press: function () {
              this.oMsgPopover.toggle(this);
            }
          });

          var loMessageTemplate = new sap.m.MessagePopoverItem({
            type: "{type}",
            title: "{title}",
            description: "{description}"
          });

          var loMessageHeaderButton = new sap.m.Button({
            icon: "sap-icon://delete",
            press: function () {
              loMsgBtn.oMsgPopover.getModel().setData([]);
              loMsgBtn.setVisible(false);
              that.onAfterUpdate(that);
            }
          });

          loMsgBtn.oMsgPopover = new sap.m.MessagePopover({
            items: {
              path: "/",
              template: loMessageTemplate
            },
            headerButton: loMessageHeaderButton
          });

          _attachOnAfterUpdate(oFuncOnAfterUpdate);
          _attachOnAfterRendering(loMsgBtn, oFuncOnAfterRendering);
          _attachOnAfterInitMessages(oFuncOnAfterInitMessages);

          that.oMsgBtn = loMsgBtn;

          _init(loMsgBtn, tMessages);

          return loMsgBtn;
        }

        /**
         * Attach OnAfterUpdate
         */
        function _attachOnAfterUpdate(oFunc) {
          if (!that.onAfterUpdateOriginal) {
            that.onAfterUpdateOriginal = that.onAfterUpdate;
          }
          if (oFunc) {
            that.onAfterUpdate = oFunc;
          }
        }

        /**
         * Attach OnAfterRendering
         */
        function _attachOnAfterRendering(oMsgBtn, oFunc) {
          if (!that.onAfterRenderingOriginal) {
            that.onAfterRenderingOriginal = that.onAfterRendering;
          }
          if (oFunc) {
            that.onAfterRendering = oFunc;
          }

          if (!oMsgBtn.oOriginalFuncOnAfterRendering) {
            oMsgBtn.oOriginalFuncOnAfterRendering = oMsgBtn.onAfterRendering;
          }
          oMsgBtn.onAfterRendering = that.onAfterRenderingOriginal;
        }

        /**
         * Attach OnAfterInitMessages
         */
        function _attachOnAfterInitMessages(oFunc) {
          if (!that.onAfterInitMessagesOriginal) {
            that.onAfterInitMessagesOriginal = that.onAfterInitMessages;
          }
          if (oFunc) {
            that.onAfterInitMessages = oFunc;
          }
        }

        /**
         * Initialize Message Button Control
         */
        this.init = function(tMessages) {
          _init(this.oMsgBtn, tMessages);
        };

        function _init(oMsgBtn, tMessages) {
          var loModel, ltPreviousModelData = [];
          if (oMsgBtn.oMsgPopover) {
            loModel = oMsgBtn.oMsgPopover.getModel();
            if (loModel) {
              var loData = loModel.getData();
              if (loData) {
                ltPreviousModelData = loData;
                // we do not want to keep Messages coming from Server!!!
                ltPreviousModelData = [];
              }
            }
          }

          var ltMessages = convertMessageFormatToUi5(ltPreviousModelData, tMessages);
          if (oMsgBtn.oMsgPopover.getModel()) {
            oMsgBtn.oMsgPopover.getModel().setData(ltMessages);
          } else {
            loModel = new sap.ui.model.json.JSONModel();
            loModel.setData(ltMessages);
            oMsgBtn.oMsgPopover.setModel(loModel);
          }

          _update(oMsgBtn);
        }

        /**
         * Update Message Button Control
         */
        this.update = function() {
          _update(this.oMsgBtn);
        };

        function _update(oMsgBtn) {
          var lMessageCount = oMsgBtn.oMsgPopover.getModel().getData() ? oMsgBtn.oMsgPopover.getModel().getData().length : 0;
          var lText = sap.zen.MessageViewHandler.tTexts && sap.zen.MessageViewHandler.tTexts.notification_header ? lMessageCount + " " + sap.zen.MessageViewHandler.tTexts.notification_header : lMessageCount + "";
          oMsgBtn.setText(lMessageCount);
          oMsgBtn.setTooltip(lText);
          oMsgBtn.setVisible(lMessageCount > 0);

          that.onAfterUpdate(that);
        }

        /**
         * Convert Messages
         */
        function convertMessageFormatToUi5(tOldMessages, tNewMessages) {
          var ltMessages = [];
          var lMessageIndex = 0;
          var loMessage = {};

          // Add Old Messages
          if (tOldMessages && tOldMessages.length > 0) {
            for (lMessageIndex = 0; lMessageIndex < tOldMessages.length; lMessageIndex++) {
              var loOldMessage = tOldMessages[lMessageIndex].message;
              loMessage = {};
              if (loOldMessage.level === "ERROR") {
                loMessage.type = "Error";
              } else if (loOldMessage.level === "WARNING") {
                loMessage.type = "Warning";
              } else {
                loMessage.type = "Information";
              }
              loMessage.title = loOldMessage.short_text;
              loMessage.description = loOldMessage.long_text;

              ltMessages.push(loMessage);
            }
          }

          // Add New Messages
          if (tNewMessages && tNewMessages.length > 0) {
            for (lMessageIndex = 0; lMessageIndex < tNewMessages.length; lMessageIndex++) {
              var loNewMessage = tNewMessages[lMessageIndex].message;
              loMessage = {};
              if (loNewMessage.level === "ERROR") {
                loMessage.type = "Error";
              } else if (loNewMessage.level === "WARNING") {
                loMessage.type = "Warning";
              } else {
                loMessage.type = "Information";
              }
              loMessage.title = loNewMessage.short_text;
              loMessage.description = loNewMessage.long_text;

              ltMessages.push(loMessage);
            }
          } else {
            if (_isHanaRuntime()) {
              // the message view in the "main app" is not removed when opening a var screen in the hana runtime
              // therefore, no need to restore messages when closing the var screen
              if (ltMessages) {
                return ltMessages;
              } else {
                return []; // initial rendering
              }
            }

            var lHandled = false;
            var ltResult = that.onAfterInitMessages(that, lHandled);
            if (lHandled) {
              return ltResult;
            }

            return []; //initial rendering
          }

          return ltMessages;
        }

        /**
         * Check if HanaRuntime
         */
        function _isHanaRuntime() {
          if(typeof (sap.zen.dsh.DSH_deployment) !== "undefined"){
            return true;
          } else {
            return false;
          }
        }
        /**
         * Get Highest Message Level
         */
        this.getHighestMessageLevel = function(oModel) {
          var ltMessages = oModel.getData();

          var lWarningFound = false;
          for(var i = 0; i < ltMessages.length; i++){
            var loMessage = ltMessages[i];
            if (loMessage.type === "Error"){
              return "message-error";
            } else if (loMessage.type === "Warning"){
              lWarningFound = true;
            }
          }

          if(lWarningFound){
            return "message-warning";
          }

          return "message-information";
        };

        /**
         * Create Message
         */
        this.createMessage = function(level, shortText, longText, logMessage) {
          if (!this.oMsgBtn) {
            return;
          }

          var loNewMessage = {};
          if (level === "ERROR") {
            loNewMessage.type = "Error";
          } else if (level === "WARNING") {
            loNewMessage.type = "Warning";
          } else {
            loNewMessage.type = "Information";
          }
          loNewMessage.title = shortText;
          loNewMessage.description = longText;

          var loModel;
          if (this.oMsgBtn.oMsgPopover && this.oMsgBtn.oMsgPopover.getModel()) {
            loModel = this.oMsgBtn.oMsgPopover.getModel();
            loModel.setData([ loNewMessage ]);
          } else {
            loModel = new sap.ui.model.json.JSONModel();
            loModel.setData([ loNewMessage ]);
            loModel.oMsgPopover.setModel(loModel);
          }

          this.update();

          if (logMessage) {
            this.logMessage(level, shortText, longText);
          }
        };

        /**
         * Log Message
         */
        this.logMessage = function(level, shortText, longText) {
          if (this.logCommand) {
            var lsCommand = this.logCommand;
            lsCommand = BaseHandler.dispatcher.prepareCommand(lsCommand, "__LEVEL__", level);
            lsCommand = BaseHandler.dispatcher.prepareCommand(lsCommand, "__SHORTTEXT__", shortText);
            lsCommand = BaseHandler.dispatcher.prepareCommand(lsCommand, "__LONGTEXT__", longText);
            var loFuncAction = new Function(lsCommand);
            loFuncAction();
          }
        };

        /**
         * Clear Messages
         */
        this.clearMessages = function() {
          if (!this.oMsgBtn) {
            return;
          }

          if (this.oMsgBtn.oMsgPopover && this.oMsgBtn.oMsgPopover.getModel()) {
            var loModel = this.oMsgBtn.oMsgPopover.getModel();
            loModel.setData([]);

            this.update();
          }
        };

        /**
         * Start Creating the Message Button
         */
        this.oMsgBtn = _create(id, tMessages, oFuncOnAfterUpdate, oFuncOnAfterRendering, oFuncOnAfterInitMessages);
      };
    }; // MessageView Handler

    var instance = new sap.zen.MessageViewHandler();
    BaseHandler.dispatcher.addHandlers(instance.getType(), instance);
    return instance;
  }
);
