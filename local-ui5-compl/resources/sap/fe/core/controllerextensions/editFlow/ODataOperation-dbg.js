/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/library", "sap/ui/core/Messaging", "sap/ui/core/message/MessageType", "sap/ui/model/odata/v4/SubmitMode", "../../ActionRuntime", "../../operationsHelper", "../messageHandler/messageHandling"], function (Log, FELibrary, Messaging, MessageType, SubmitMode, ActionRuntime, operationsHelper, messageHandling) {
  "use strict";

  var _exports = {};
  const Constants = FELibrary.Constants;
  let ODataOperation = /*#__PURE__*/function () {
    function ODataOperation(operation, parameters, messageHandler, strictHandlingUtilities) {
      let operationProperties = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      this.enableStrictHandling = true;
      this.firstIterationOperations = [];
      this.operationParameters = [];
      this.neverSubmitted = true;
      this.apiGroupIdsToSubmit = new Set();
      this.operation = operation;
      this.parameters = parameters;
      this.messageHandler = messageHandler;
      this.strictHandlingUtilities = strictHandlingUtilities;
      this.operationProperties = operationProperties;
      this.enableStrictHandling = this.parameters.disableStrictHandling !== true && !this.operation.isFunction;
      this.defineOperationParameters();
    }

    /**
     * Defines the parameters of the operation.
     */
    _exports = ODataOperation;
    var _proto = ODataOperation.prototype;
    _proto.defineOperationParameters = function defineOperationParameters() {
      if (this.operation._type === "ActionImport") {
        this.operationParameters = this.operation.action.parameters;
      } else {
        //Remove the binding parameters from the parameters list
        this.operationParameters = this.operation.isBound ? this.operation.parameters.slice(1) : this.operation.parameters;
      }
    }

    /**
     * Executes the operation.
     * @returns The promise of the operation
     */;
    _proto.execute = async function execute() {
      let result;
      try {
        if (this.parameters.aContexts.length) {
          result = await (this.parameters.bGrouped === true ? this.executeChangeset() : this.executeSequentially());
        } else {
          result = await Promise.allSettled([this.executeImport()]);
        }
      } catch (error) {
        Log.error("Error while executing operation " + this.parameters.actionName, error);
        throw error;
      } finally {
        this.parameters.fnOnResponse?.();
      }
      return result;
    }

    /**
     * Executes the import operation.
     * @returns The promise of the operation
     */;
    _proto.executeImport = async function executeImport() {
      const operationContext = this.parameters.model.bindContext(`/${this.parameters.actionName}(...)`);
      this.setParametersValue(operationContext);
      const groupId = this.parameters.groupId ?? "actionImport";
      const promises = [this.invoke(operationContext, groupId, null)];
      if (this.parameters.additionalSideEffect) {
        const context = this.parameters.model.bindContext("/unBoundAction").getBoundContext();
        const sideEffect = {
          context: context,
          pathExpressions: this.parameters.additionalSideEffect.pathExpressions,
          triggerActions: this.parameters.additionalSideEffect.triggerActions
        };
        this.requestSideEffects(sideEffect, groupId, promises);
        context.destroy();
      }
      this.defaultSubmit(groupId);
      const currentPromiseValues = await Promise.all(promises);
      return currentPromiseValues[0];
    }

    /**
     * Executes the operations on one changeset.
     * @returns The promise of the operations
     */;
    _proto.executeChangeset = async function executeChangeset() {
      const operationPromises = this.parameters.aContexts.map(async context => this.executeBoundOperation(context, this.parameters.groupId));
      await Promise.allSettled(this.firstIterationOperations);
      await this.manageStrictHandlingFails();
      return Promise.allSettled(operationPromises);
    }

    /**
     * Executes the operations sequentially.
     * @returns The promise of the operations
     */;
    _proto.executeSequentially = async function executeSequentially() {
      const operationPromises = [];

      // serialization: executeBoundOperation to be called for each entry only after the promise returned from the one before has been resolved
      await this.parameters.aContexts.reduce(async (promise, context, id) => {
        await promise;
        operationPromises.push(this.executeBoundOperation(context, this.parameters.groupId ?? `apiMode${id + 1}`));
        await Promise.allSettled(this.firstIterationOperations);
      }, Promise.resolve());
      await this.manageStrictHandlingFails(true);
      return Promise.allSettled(operationPromises);
    }

    /**
     * Executes the bound operation.
     * @param targetContext The target context
     * @param groupId The groupId of the batch
     * @returns The promise of the operation
     */;
    _proto.executeBoundOperation = async function executeBoundOperation(targetContext, groupId) {
      const operationContext = this.parameters.model.bindContext(`${this.parameters.actionName}(...)`, targetContext, this.parameters.mBindingParameters);
      const promises = [];
      this.setParametersValue(operationContext);
      const finalGroupId = groupId ?? operationContext.getUpdateGroupId();

      // Action on the table level is bound on a copy of the oDataListBinding, to execute the SideEffects we need
      // to do it on the original oDataListBinding
      const initialTableContext = this.parameters.control?.getRowBinding?.()?.getHeaderContext();
      const sideEffects = {
        context: initialTableContext?.getPath() === targetContext.getPath() ? initialTableContext : targetContext,
        pathExpressions: this.parameters.additionalSideEffect?.pathExpressions,
        triggerActions: this.parameters.additionalSideEffect?.triggerActions
      };
      //Has to be removed when the refactoring  is done
      this.parameters.requestSideEffects = this.requestSideEffects.bind(this, sideEffects, finalGroupId, promises);
      const operationPromise = this.invoke(operationContext, finalGroupId, this.parameters.aContexts.findIndex(context => context === targetContext) + 1);
      promises.push(operationPromise);
      this.requestSideEffects(sideEffects, finalGroupId, promises);
      this.defaultSubmit(finalGroupId);
      Promise.allSettled(promises);
      return operationPromise;
    }

    /**
     * Invokes the operation on the context.
     * @param operationContextBinding The operation context binding
     * @param groupId The groupId of the batch
     * @param contextIndex The index of the context
     * @returns The promise of the operation
     */;
    _proto.invoke = async function invoke(operationContextBinding, groupId, contextIndex) {
      let returnedContext;
      let firstIterationResolve;
      let firstIterationReject;
      const strictHandlingPromise = new Promise(function (resolve, reject) {
        firstIterationResolve = resolve;
        firstIterationReject = reject;
      });
      this.firstIterationOperations.push(strictHandlingPromise);
      if (groupId && this.isAPIMode(groupId)) {
        this.apiGroupIdsToSubmit.add(groupId);
      }
      try {
        const contextLength = this.parameters.aContexts.length ? this.parameters.aContexts.length : null;
        const operationInvoke = operationContextBinding.invoke(groupId, this.operationProperties.ignoreETag, this.enableStrictHandling ? operationsHelper.fnOnStrictHandlingFailed.bind(this, groupId, this.parameters, contextIndex, operationContextBinding.getContext(), contextLength, this.messageHandler, this.strictHandlingUtilities, firstIterationResolve) : undefined, this.operationProperties.replaceWithRVC);
        await Promise.race([operationInvoke, strictHandlingPromise]);
        returnedContext = await operationInvoke;
        firstIterationResolve();
        if (!this.parameters.bGrouped) {
          //Has to be removed when the refactoring  is done
          this.update412TransitionMessages(operationContextBinding, groupId, true);
        }
      } catch (error) {
        if (!this.parameters.bGrouped) {
          this.update412TransitionMessages(operationContextBinding, groupId);
        }
        firstIterationReject(error);
        throw Constants.ActionExecutionFailed;
      }
      return {
        returnedContext,
        boundContext: operationContextBinding.getBoundContext()
      };
    }

    /**
     * Submits the batch related to the groupId of the operation.
     */;
    _proto.submit = function submit() {
      if (!this.neverSubmitted || this.apiGroupIdsToSubmit.size === 0) {
        return;
      }
      for (const groupId of Array.from(this.apiGroupIdsToSubmit.values())) {
        this.submitOnModel(groupId);
      }
      this.parameters.fnOnSubmitted?.();
    }

    /**
     * Submits the batch at the model level related to the groupId of the operation.
     * @param groupId The groupId of the batch
     */;
    _proto.submitOnModel = function submitOnModel(groupId) {
      this.parameters.model.submitBatch(groupId);
      this.apiGroupIdsToSubmit.delete(groupId);
    }

    /**
     * Is the SubmitMode of the groupId set to API.
     * @param groupId The groupId of the batch
     * @returns True if the SubmitMode is set to API, false otherwise
     */;
    _proto.isAPIMode = function isAPIMode(groupId) {
      if (!groupId) {
        return false;
      }
      if (groupId.startsWith("$auto") || groupId.startsWith("$direct") || groupId.startsWith("$single")) {
        return false;
      }
      const submitMode = this.parameters.appComponent.getManifestEntry("sap.ui5")?.models[""]?.settings?.groupProperties?.[groupId]?.submit;
      if (submitMode === undefined || [SubmitMode.Auto, SubmitMode.Direct].includes(submitMode)) {
        return true;
      }
      return true;
    }

    /**
     * Executes the submit of the operation if the submitMode is on API and deferredSubmit is not set to true
     * The submitBatch is skipped if the groupId is $auto or $direct since done by the model.
     * @param groupId The groupId of the batch
     */;
    _proto.defaultSubmit = function defaultSubmit(groupId) {
      const firstSubmit = this.neverSubmitted;
      const isAPIMode = this.isAPIMode(groupId);
      if (!isAPIMode) {
        // The submitBatch is skipped if the groupId is $auto or $direct since done by the model
        this.neverSubmitted = false;
      } else if (this.operationProperties.deferredSubmit !== true && groupId) {
        this.neverSubmitted = false;
        this.submitOnModel(groupId);
      }
      if (firstSubmit && !this.neverSubmitted) {
        //Trigger the callback only once
        this.parameters.fnOnSubmitted?.();
      }
    }

    /**
     * Manages the strict handling fails.
     * @param displayErrorOrWarning True, if the warning/error messages have to be displayed, false otherwise (default)
     * @returns The promise of the strict handling
     */;
    _proto.manageStrictHandlingFails = async function manageStrictHandlingFails() {
      let displayErrorOrWarning = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (this.strictHandlingUtilities && this.strictHandlingUtilities.strictHandlingPromises.length) {
        try {
          if ((!messageHandling.hasTransitionErrorsOrWarnings() || displayErrorOrWarning) && this.strictHandlingUtilities.strictHandlingWarningMessages.length) {
            await operationsHelper.renderMessageView(this.parameters, this.messageHandler, this.strictHandlingUtilities.strictHandlingWarningMessages, this.strictHandlingUtilities, this.parameters.aContexts.length > 1);
          } else {
            for (const shPromise of this.strictHandlingUtilities.strictHandlingPromises) {
              shPromise.resolve(false);
            }
            const messageModel = Messaging.getMessageModel();
            const messagesInModel = messageModel.getData();
            messageModel.setData(messagesInModel.concat(this.strictHandlingUtilities.strictHandlingWarningMessages));
          }
        } catch {
          Log.error("Re-triggering of strict handling operations failed");
        }
      }
    }

    /**
     * Updates the strictHandling utilities with the failed and successful transition messages.
     * @param operation The operation context binding
     * @param groupId GroupId of the batch
     * @param onlySuccessMessages To update only successful transition messages
     */;
    _proto.update412TransitionMessages = function update412TransitionMessages(operation, groupId) {
      let onlySuccessMessages = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      //Has to be removed  from here when the refactoring  is done
      if (this.enableStrictHandling && this.strictHandlingUtilities) {
        const messages = Messaging.getMessageModel().getData();
        const {
          processedMessageIds,
          delaySuccessMessages,
          strictHandlingTransitionFails
        } = this.strictHandlingUtilities;
        const unProcessedMessages = messages.reduce((acc, message) => {
          if (!processedMessageIds.has(message.getId())) {
            acc.push(message);
          }
          return acc;
        }, []);
        const newTransitionErrorMessagesId = unProcessedMessages.filter(message => message.getPersistent() === true && message.getType() !== MessageType.Success && !processedMessageIds.has(message.getId())).map(message => message.getId());
        if (newTransitionErrorMessagesId.length) {
          this.strictHandlingUtilities.processedMessageIds = new Set([...Array.from(processedMessageIds), ...newTransitionErrorMessagesId]);
          delaySuccessMessages.push(...Object.values(unProcessedMessages).filter(message => message.getType() === MessageType.Success));
          if (!onlySuccessMessages && this.parameters.internalModelContext) {
            strictHandlingTransitionFails.push({
              oAction: operation,
              groupId
            });
          }
        }
      }
    }

    /**
     *  Sets the default values for the parameters of the operation.
     * @param operationContextBinding The operation context binding
     */;
    _proto.setParametersValue = function setParametersValue(operationContextBinding) {
      if (this.operationParameters.length) {
        const defaultValues = this.parameters.defaultParametersValues ?? {};
        for (const parameter of this.operationParameters) {
          const name = parameter.name;
          if (!defaultValues[name]) {
            switch (parameter.type) {
              case "Edm.String":
                defaultValues[name] = "";
                break;
              case "Edm.Boolean":
                defaultValues[name] = false;
                break;
              case "Edm.Byte":
              case "Edm.Int16":
              case "Edm.Int32":
              case "Edm.Int64":
                defaultValues[name] = 0;
                break;
              default:
                break;
            }
          }
          operationContextBinding.setParameter(name, defaultValues[name]);
        }
      }
    }

    /**
     * Requests the side effects for the action.
     * @param sideEffect  The side effect to be executed
     * @param groupId  The groupId of the batch
     * @param localPromise The promise of the invoked action
     * @returns The promise of the side effect
     */;
    _proto.requestSideEffects = async function requestSideEffects(sideEffect, groupId, localPromise) {
      const sideEffectsService = this.parameters.appComponent.getSideEffectsService();
      let promises = localPromise ?? [];
      // trigger actions from side effects
      if (sideEffect) {
        promises = promises.concat((sideEffect.triggerActions ?? []).map(async action => sideEffectsService.executeAction(action, sideEffect.context, groupId)), sideEffect.pathExpressions ? sideEffectsService.requestSideEffects(sideEffect.pathExpressions, sideEffect.context, groupId) : []);
        if (sideEffect.pathExpressions) {
          try {
            await Promise.all(promises);
            if (this.parameters.operationAvailableMap && this.parameters.internalModelContext) {
              ActionRuntime.setActionEnablement(this.parameters.internalModelContext, JSON.parse(this.parameters.operationAvailableMap), this.parameters.selectedItems, "table");
            }
            return;
          } catch (error) {
            Log.error("Error while requesting side effects", error);
          }
        }
      }
    };
    return ODataOperation;
  }();
  _exports = ODataOperation;
  return _exports;
}, false);
//# sourceMappingURL=ODataOperation-dbg.js.map
