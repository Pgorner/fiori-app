/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/m/MessageBox", "sap/ui/core/message/Message", "sap/ui/core/message/MessageType", "sap/ui/model/json/JSONModel", "./controllerextensions/dialog/OperationsDialog", "./controllerextensions/messageHandler/messageHandling", "./helpers/ResourceModelHelper"], function (Log, MessageBox, Message, MessageType, JSONModel, OperationsDialog, messageHandling, ResourceModelHelper) {
  "use strict";

  function renderMessageView(parameters, messageHandler, messages, strictHandlingUtilities, isMultiContext412, resolve, groupId, isUnboundAction) {
    if (!messages.length) {
      return;
    }
    const resourceModel = ResourceModelHelper.getResourceModel(parameters.appComponent);
    const actionName = ResourceModelHelper.getLocalizedText(parameters.label, parameters.appComponent);
    const model = parameters.model;
    const strictHandlingPromises = strictHandlingUtilities?.strictHandlingPromises ?? [];
    let message;
    let cancelButtonTxt = resourceModel.getText("C_COMMON_DIALOG_CANCEL");
    let warningMessageText = "";
    let genericChangesetMessage = "";
    warningMessageText = parameters.bGrouped ? resourceModel.getText("C_COMMON_DIALOG_CANCEL_MESSAGE_TEXT", [actionName]) : resourceModel.getText("C_COMMON_DIALOG_SKIP_SINGLE_MESSAGE_TEXT");
    if (messages.length === 1) {
      const messageText = messages[0].getMessage();
      const identifierText = messages[0].getAdditionalText();
      genericChangesetMessage = resourceModel.getText("C_COMMON_DIALOG_CANCEL_SINGLE_MESSAGE_TEXT");
      if (!isMultiContext412) {
        message = `${messageText}\n${resourceModel.getText("PROCEED")}`;
      } else if (identifierText !== undefined && identifierText !== "") {
        cancelButtonTxt = parameters.bGrouped ? cancelButtonTxt : resourceModel.getText("C_COMMON_DIALOG_SKIP");
        const headerInfoTypeName = parameters.control?.getParent()?.getTableDefinition().headerInfoTypeName;
        if (headerInfoTypeName) {
          message = `${headerInfoTypeName.toString()} ${identifierText}: ${messageText}\n\n${warningMessageText}`;
        } else {
          message = `${identifierText}: ${messageText}\n\n${warningMessageText}`;
        }
      } else {
        cancelButtonTxt = parameters.bGrouped ? cancelButtonTxt : resourceModel.getText("C_COMMON_DIALOG_SKIP");
        message = `${messageText}\n\n${warningMessageText}`;
      }
      if (isMultiContext412 && parameters.bGrouped) {
        message = `${genericChangesetMessage}\n\n${message}`;
      }
      MessageBox.warning(message, {
        title: resourceModel.getText("WARNING"),
        actions: [actionName, cancelButtonTxt],
        emphasizedAction: actionName,
        onClose: action => {
          if (action === actionName) {
            if (isUnboundAction) {
              // condition is true for unbound as well as static actions
              resolve?.(true);
              model.submitBatch(groupId);
              parameters.requestSideEffects?.();
            } else if (!isMultiContext412) {
              // condition true when multiple contexts are selected but only one strict handling warning is received
              const strictHandlingPromise = strictHandlingPromises[0];
              strictHandlingPromise.resolve(true);
              model.submitBatch(strictHandlingPromise.groupId);
              strictHandlingPromise.requestSideEffects?.();
            } else {
              for (const promises of strictHandlingPromises) {
                promises.resolve(true);
                model.submitBatch(promises.groupId);
                promises.requestSideEffects?.();
              }
              if (strictHandlingUtilities?.strictHandlingTransitionFails?.length) {
                messageHandler?.removeTransitionMessages();
              }
            }
            if (strictHandlingUtilities) {
              strictHandlingUtilities.is412Executed = true;
            }
          } else {
            if (strictHandlingUtilities) {
              strictHandlingUtilities.is412Executed = false;
            }
            if (isUnboundAction) {
              resolve?.(false);
            } else if (!isMultiContext412) {
              strictHandlingPromises[0].resolve(false);
            } else {
              for (const promises of strictHandlingPromises) {
                promises.resolve(false);
              }
            }
            if (parameters.bGrouped) {
              MessageBox.information(resourceModel.getText("M_CHANGESET_CANCEL_MESSAGES"), {
                contentWidth: "150px"
              });
            }
          }
          if (strictHandlingUtilities) {
            strictHandlingUtilities.strictHandlingWarningMessages = [];
          }
        }
      });
      return;
    }
    const messageDialogModel = new JSONModel();
    let warningMessage = "";
    let warningDesc = "";
    if (isMultiContext412) {
      cancelButtonTxt = parameters.bGrouped ? cancelButtonTxt : resourceModel.getText("C_COMMON_DIALOG_SKIP");
      warningMessage = parameters.bGrouped ? resourceModel.getText("C_COMMON_DIALOG_CANCEL_MESSAGES_WARNING") : resourceModel.getText("C_COMMON_DIALOG_SKIP_MESSAGES_WARNING");
      warningDesc = parameters.bGrouped ? resourceModel.getText("C_COMMON_DIALOG_CANCEL_MESSAGES_TEXT", [actionName]) : resourceModel.getText("C_COMMON_DIALOG_SKIP_MESSAGES_TEXT", [actionName]);
    } else {
      warningMessage = resourceModel.getText("C_COMMON_DIALOG_CANCEL_MESSAGES_GENERIC_ACTION_WARNING", [actionName]);
    }
    const genericMessage = new Message({
      message: warningMessage,
      type: MessageType.Information,
      target: undefined,
      persistent: true,
      description: warningDesc.length ? warningDesc : undefined
    });
    messages = [genericMessage].concat(messages);
    messageDialogModel.setData(messages);
    new OperationsDialog({
      messageObject: messageHandling.prepareMessageViewForDialog(messageDialogModel, true, isMultiContext412),
      isMultiContext412,
      isGrouped: parameters.bGrouped,
      requestSideEffects: parameters.requestSideEffects,
      resolve,
      model,
      groupId,
      actionName,
      strictHandlingUtilities,
      strictHandlingPromises,
      messageHandler,
      messageDialogModel,
      cancelButtonTxt,
      showMessageInfo: () => {
        MessageBox.information(resourceModel.getText("M_CHANGESET_CANCEL_MESSAGES"), {
          contentWidth: "150px"
        });
      }
    }).open();
  }
  async function fnOnStrictHandlingFailed(groupId, parameters, currentContextIndex, context, contextLength, messageHandler, strictHandlingUtilities, internalOperationsPromiseResolve) {
    let messages412 = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : [];
    // Find error message in the 412 response and raise warning.
    const filteredErrorMessages = messageHandler.filterErrorMessages(messages412);
    messages412.forEach(message => {
      if (filteredErrorMessages.includes(message)) {
        Log.warning("Warning: 412 ('Pre-condition Check Failed due to strict-handling') returns messages of type error but only warning messages are appropriate!");
      }
    });
    messageHandler.addWarningMessagesToMessageHandler(messages412);
    let shPromiseParams;
    if (currentContextIndex === null && contextLength === null || currentContextIndex === 1 && contextLength === 1) {
      return new Promise(resolve => {
        operationsHelper.renderMessageView(parameters, messageHandler, messages412, strictHandlingUtilities, false, resolve, groupId, true);
      });
    }
    const strictHandlingPromise = new Promise(function (resolve) {
      shPromiseParams = {
        requestSideEffects: parameters.requestSideEffects,
        resolve: resolve,
        groupId: groupId
      };
    });
    strictHandlingUtilities?.strictHandlingPromises.push(shPromiseParams);
    if (messages412.length && strictHandlingUtilities) {
      // copy existing 412 warning messages
      const strictHandlingWarningMessages = strictHandlingUtilities.strictHandlingWarningMessages;
      let value = "";
      // If there is more than one context we need the identifier. This would fix if the action is triggered via table chevron
      if (contextLength && contextLength > 1) {
        const tableAPI = parameters.control?.getParent();
        const column = tableAPI && tableAPI.isA("sap.fe.macros.table.TableAPI") && tableAPI.getIdentifierColumn();
        if (column) {
          value = context?.getObject(column);
        }
      }

      // set type and subtitle for all warning messages
      for (const message of messages412) {
        message.setAdditionalText(value);
        strictHandlingWarningMessages.push(message);
      }
      strictHandlingUtilities.strictHandlingWarningMessages = strictHandlingWarningMessages;
    }
    internalOperationsPromiseResolve?.();
    return strictHandlingPromise;
  }
  const operationsHelper = {
    renderMessageView: renderMessageView,
    fnOnStrictHandlingFailed: fnOnStrictHandlingFailed
  };
  return operationsHelper;
}, false);
//# sourceMappingURL=operationsHelper-dbg.js.map
