/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/ActionRuntime", "sap/fe/core/CommonUtils", "sap/fe/core/UIProvider", "sap/fe/core/controllerextensions/messageHandler/messageHandling", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/helpers/DeleteHelper", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/helpers/ResourceModelHelper", "sap/fe/core/library", "sap/m/MessageBox", "sap/ui/core/Lib", "sap/ui/core/Messaging", "sap/ui/core/message/Message", "sap/ui/core/message/MessageType", "../ODataOperation"], function (ActionRuntime, CommonUtils, UIProvider, messageHandling, MetaModelConverter, DeleteHelper, ModelHelper, ResourceModelHelper, FELibrary, MessageBox, Library, Messaging, Message, MessageType, ODataOperation) {
  "use strict";

  function __ui5_require_async(path) {
    return new Promise((resolve, reject) => {
      sap.ui.require([path], module => {
        if (!(module && module.__esModule)) {
          module = module === null || !(typeof module === "object" && path.endsWith("/library")) ? {
            default: module
          } : module;
          Object.defineProperty(module, "__esModule", {
            value: true
          });
        }
        resolve(module);
      }, err => {
        reject(err);
      });
    });
  }
  var getResourceModel = ResourceModelHelper.getResourceModel;
  var convertTypes = MetaModelConverter.convertTypes;
  var getCoreUIFactory = UIProvider.getCoreUIFactory;
  const Constants = FELibrary.Constants,
    InvocationGrouping = FELibrary.InvocationGrouping;
  const Action = MessageBox.Action;
  /**
   * Calls a bound action for one or multiple contexts.
   * @param sActionName The name of the action to be called
   * @param contexts Either one context or an array with contexts for which the action is to be be called
   * @param oModel OData Model
   * @param oAppComponent The AppComponent
   * @param [mParameters] Optional, can contain the following attributes:
   * @param [mParameters.parameterValues] A map of action parameter names and provided values
   * @param [mParameters.mBindingParameters] A map of binding parameters that would be part of $select and $expand coming from side effects for bound actions
   * @param [mParameters.additionalSideEffect] Array of property paths to be requested in addition to actual target properties of the side effect
   * @param [mParameters.showActionParameterDialog] If set and if parameters exist the user retrieves a dialog to fill in parameters, if actionParameters are passed they are shown to the user
   * @param [mParameters.label] A human-readable label for the action
   * @param [mParameters.invocationGrouping] Mode how actions are to be called: Changeset to put all action calls into one changeset, Isolated to put them into separate changesets, defaults to Isolated
   * @param [mParameters.onSubmitted] Function which is called once the actions are submitted with an array of promises
   * @param [mParameters.defaultParameters] Can contain default parameters from FLP user defaults
   * @param [mParameters.parentControl] If specified, the dialogs are added as dependent of the parent control
   * @param [mParameters.ignoreETag] If specified, the action is called without ETag handling
   * @returns Promise resolves with an array of response objects
   */
  async function callBoundAction(sActionName, contexts, oModel, oAppComponent, mParameters) {
    if (!contexts || contexts.length === 0) {
      //In Freestyle apps bound actions can have no context
      throw new Error("Bound actions always requires at least one context");
    }
    mParameters.aContexts = Array.isArray(contexts) ? contexts : [contexts];
    const oMetaModel = oModel.getMetaModel(),
      // Analyzing metaModelPath for action only from first context seems weird, but probably works in all existing scenarios - if several contexts are passed, they probably
      // belong to the same metamodelpath. TODO: Check, whether this can be improved / scenarios with different metaModelPaths might exist
      sActionPath = `${oMetaModel.getMetaPath(mParameters.aContexts[0].getPath())}/${sActionName}`,
      oBoundAction = oMetaModel.createBindingContext(`${sActionPath}/@$ui5.overload/0`);
    mParameters.isCriticalAction = await ActionRuntime.getIsActionCritical(oMetaModel, sActionPath, mParameters.aContexts);
    const convertedTypes = convertTypes(oModel.getMetaModel());
    const convertedAction = convertedTypes.resolvePath(oBoundAction.getPath()).target;
    if (!convertedAction) {
      throw new Error("Unknown bound action");
    }
    return callAction(convertedAction, oModel, oBoundAction, oAppComponent, mParameters);
  }
  /**
   * Calls an action import.
   * @param actionName The name of the action import to be called
   * @param model An instance of an OData V4 model
   * @param appComponent The AppComponent
   * @param [parameters] Optional, can contain the following attributes:
   * @param [parameters.parameterValues] A map of action parameter names and provided values
   * @param [parameters.label] A human-readable label for the action
   * @param [parameters.showActionParameterDialog] If set and if parameters exist the user retrieves a dialog to fill in parameters, if actionParameters are passed they are shown to the user
   * @param [parameters.onSubmitted] Function which is called once the actions are submitted with an array of promises
   * @param [parameters.defaultParameters] Can contain default parameters from FLP user defaults
   * @param [parameters.ignoreETag] If specified, the action is called without ETag handling
   * @returns Promise resolves with an array of response objects
   */
  async function callActionImport(actionName, model, appComponent, parameters) {
    const metaModel = model.getMetaModel();
    const actionPath = `/${actionName}`;
    const convertedTypes = convertTypes(metaModel);
    const convertedActionImport = convertedTypes.resolvePath(actionPath).target,
      convertedAction = convertedActionImport?.action;
    if (!convertedAction) {
      throw new Error("Unknown action import");
    }
    const unboundActionIndex = convertedTypes.actions.filter(action => action.name === convertedAction.name).findIndex(action => !action.isBound),
      actionNameFromModel = convertedActionImport.actionName,
      actionImport = metaModel.createBindingContext(`/${actionNameFromModel}/${unboundActionIndex}`);
    parameters.isCriticalAction = await ActionRuntime.getIsActionCritical(metaModel, `${actionPath}/@$ui5.overload`);
    return callAction(convertedActionImport.action, model, actionImport, appComponent, parameters);
  }
  async function callBoundFunction(sFunctionName, context, oModel) {
    if (!context) {
      return Promise.reject("Bound functions always requires a context");
    }
    const oMetaModel = oModel.getMetaModel(),
      sFunctionPath = `${oMetaModel.getMetaPath(context.getPath())}/${sFunctionName}`,
      oBoundFunction = oMetaModel.createBindingContext(sFunctionPath);
    return _executeFunction(sFunctionName, oModel, oBoundFunction, context);
  }

  /**
   * Calls a function import.
   * @param sFunctionName The name of the function to be called
   * @param oModel An instance of an OData v4 model
   * @returns Promise resolves
   */
  async function callFunctionImport(sFunctionName, oModel) {
    const oMetaModel = oModel.getMetaModel(),
      sFunctionPath = oModel.bindContext(`/${sFunctionName}`).getPath(),
      oFunctionImport = oMetaModel.createBindingContext(`/${oMetaModel.createBindingContext(sFunctionPath).getObject("$Function")}/0`);
    return _executeFunction(sFunctionName, oModel, oFunctionImport);
  }
  async function _executeFunction(sFunctionName, oModel, oFunction, context) {
    if (!oFunction?.getObject()) {
      return Promise.reject(new Error(`Function ${sFunctionName} not found`));
    }
    const functionToCall = oModel.bindContext(`${context?.getPath() ?? ""}/${sFunctionName}(...)`);
    const groupId = context ? "functionGroup" : "functionImport";
    const executionPromise = functionToCall.execute(groupId);
    oModel.submitBatch(groupId);
    await executionPromise;
    return functionToCall.getBoundContext();
  }
  async function checkParameterTypeAndReturnConvertedValue(parameter, value) {
    if (value === undefined || value === null) {
      return value;
    }
    const BaseType = (await __ui5_require_async("sap/ui/mdc/enums/BaseType")).default;
    const TypeMap = (await __ui5_require_async("sap/ui/mdc/odata/v4/TypeMap")).default;
    const parameterType = parameter.type ? TypeMap.getBaseType(parameter.type) : BaseType.String;
    const typeInstance = TypeMap.getDataTypeInstance(parameterType);
    return typeInstance.parseValue(value, "string");
  }
  async function callAction(convertedAction, oModel, oAction, oAppComponent, mParameters) {
    let strictHandlingUtilities = {
      is412Executed: false,
      strictHandlingTransitionFails: [],
      strictHandlingPromises: [],
      strictHandlingWarningMessages: [],
      delaySuccessMessages: [],
      processedMessageIds: new Set()
    };
    const sActionName = convertedAction.isBound ? convertedAction.fullyQualifiedName.replace(/\(.*\)$/g, "") // remove the part related to the overlay
    : convertedAction.name;
    mParameters.bGrouped = mParameters.invocationGrouping === InvocationGrouping.ChangeSet;
    return new Promise(async function (resolve, reject) {
      const sActionLabel = mParameters.label;
      let bSkipParameterDialog = mParameters.skipParameterDialog;
      const aContexts = mParameters.aContexts;
      const bIsCreateAction = mParameters.bIsCreateAction;
      const bIsCriticalAction = mParameters.isCriticalAction;
      let oMetaModel;
      let sMessagesPath;
      let iMessageSideEffect;
      let isSameEntity;
      let bValuesProvidedForAllMandatoryParameters;
      const actionDefinition = oAction.getObject();

      //in case of bound actions, ignore the first parameter and consider the rest
      const actionParameters = convertedAction.isBound ? convertedAction.parameters.slice(1) : convertedAction.parameters;

      // Check if the action has parameters and would need a parameter dialog
      // The parameter ResultIsActiveEntity is always hidden in the dialog! Hence if
      // this is the only parameter, this is treated as no parameter here because the
      // dialog would be empty!
      // FIXME: Should only ignore this if this is a 'create' action, otherwise it is just some normal parameter that happens to have this name
      const bActionNeedsParameterDialog = actionParameters.length > 0 && !(actionParameters.length === 1 && actionParameters[0].name === "ResultIsActiveEntity");

      // Provided values for the action parameters from invokeAction call
      const aParameterValues = mParameters.parameterValues;

      // Determine startup parameters if provided
      const oComponentData = oAppComponent.getComponentData();
      const oStartupParameters = oComponentData && oComponentData.startupParameters || {};

      // If all parameters are hidden  and all mandatory parameters values are available, then we skip the dialog.
      bSkipParameterDialog = actionParameters.length && actionParameters.filter(actionParameter => actionParameter.name !== "ResultIsActiveEntity").every(parameter => parameter.annotations.UI?.Hidden?.valueOf() === true) ? true : bSkipParameterDialog;
      // In case an action parameter is needed, and we shall skip the dialog, check if values are provided for all parameters
      if (bActionNeedsParameterDialog && bSkipParameterDialog) {
        bValuesProvidedForAllMandatoryParameters = _valuesProvidedForAllMandatoryParameters(!!bIsCreateAction, actionParameters, aParameterValues, oStartupParameters);
      }

      // Depending on the previously determined data, either set a dialog or leave it empty which
      // will lead to direct execution of the action without a dialog

      const mActionExecutionParameters = {
        defaultParametersValues: {},
        appComponent: oAppComponent,
        fnOnSubmitted: mParameters.onSubmitted,
        fnOnResponse: mParameters.onResponse,
        actionName: sActionName,
        aContexts: [],
        model: oModel,
        aActionParameters: actionParameters,
        defaultValuesExtensionFunction: mParameters.defaultValuesExtensionFunction,
        label: mParameters.label,
        selectedItems: mParameters.selectedItems
      };
      if (convertedAction.isBound) {
        oMetaModel = oModel.getMetaModel();
        const convertedMetaData = convertTypes(oMetaModel);
        const filteredEntitySet = convertedMetaData.entitySets.filter(singleEntitySet => singleEntitySet.entityType === convertedAction.returnEntityType);
        const currentEntitySet = filteredEntitySet.length > 0 ? filteredEntitySet[0] : undefined;
        isSameEntity = !convertedAction.returnCollection && convertedAction.returnEntityType && convertedAction.sourceEntityType === convertedAction.returnEntityType;
        if (isSameEntity && ModelHelper.isDraftRoot(currentEntitySet)) {
          mParameters.mBindingParameters ??= {};
          mParameters.mBindingParameters.$select = mParameters.mBindingParameters.$select ? `${mParameters.mBindingParameters.$select},HasActiveEntity` : "HasActiveEntity";
        }
        if (mParameters.additionalSideEffect?.pathExpressions) {
          sMessagesPath = ModelHelper.getMessagesPath(oMetaModel, aContexts[0].getPath());
          if (sMessagesPath) {
            // '*' effectively includes the messages path if there is one
            iMessageSideEffect = mParameters.additionalSideEffect.pathExpressions.findIndex(exp => typeof exp === "string" && (exp === sMessagesPath || exp === "*"));

            // Add SAP_Messages by default if not annotated by side effects, action does not return a collection and
            // the return type is the same as the bound type
            if (iMessageSideEffect > -1 || isSameEntity) {
              // the message path is annotated as side effect. As there's no binding for it and the model does currently not allow
              // to add it at a later point of time we have to take care it's part of the $select of the POST, therefore moving it.
              mParameters.mBindingParameters ??= {};
              if (convertedAction.returnEntityType?.entityProperties.find(property => property.name === sMessagesPath) && !(mParameters.mBindingParameters.$select ?? "").split(",").includes(sMessagesPath)) {
                mParameters.mBindingParameters.$select = mParameters.mBindingParameters.$select ? `${mParameters.mBindingParameters.$select},${sMessagesPath}` : sMessagesPath;
                // Add side effects at entity level because $select stops these being returned by the action
                // Only if no other side effects were added for Messages
                if (iMessageSideEffect === -1) {
                  mParameters.additionalSideEffect.pathExpressions.push("*");
                }
                if (mParameters.additionalSideEffect.triggerActions?.length === 0 && iMessageSideEffect > -1) {
                  // no trigger action therefore no need to request messages again
                  mParameters.additionalSideEffect.pathExpressions.splice(iMessageSideEffect, 1);
                }
              }
            }
          }
        }
        mActionExecutionParameters.aContexts = aContexts ?? [];
        mActionExecutionParameters.mBindingParameters = mParameters.mBindingParameters;
        mActionExecutionParameters.additionalSideEffect = mParameters.additionalSideEffect;
        mActionExecutionParameters.bGrouped = mParameters.invocationGrouping === InvocationGrouping.ChangeSet;
        mActionExecutionParameters.internalModelContext = mParameters.internalModelContext;
        mActionExecutionParameters.operationAvailableMap = mParameters.operationAvailableMap;
        mActionExecutionParameters.isCreateAction = bIsCreateAction;
        mActionExecutionParameters.bObjectPage = mParameters.bObjectPage;
        mActionExecutionParameters.disableStrictHandling = mParameters.disableStrictHandling;
        mActionExecutionParameters.groupId = mParameters.groupId;
        if (mParameters.controlId) {
          mActionExecutionParameters.control = mParameters.parentControl.byId(mParameters.controlId);
          mParameters.control = mActionExecutionParameters.control;
        } else {
          mActionExecutionParameters.control = mParameters.parentControl;
          mParameters.control = mParameters.parentControl;
        }
      }
      mActionExecutionParameters.additionalSideEffect = mParameters.additionalSideEffect;
      if (bIsCreateAction) {
        mActionExecutionParameters.bIsCreateAction = bIsCreateAction;
      }
      mActionExecutionParameters.isStatic = convertedAction.isBound && !!convertedAction.parameters[0]?.isCollection;
      let operationResult = [];
      let executionWitDialog = false;
      try {
        if (bActionNeedsParameterDialog) {
          if (!(bSkipParameterDialog && bValuesProvidedForAllMandatoryParameters)) {
            executionWitDialog = true;
            const parameterDialog = getCoreUIFactory().newParameterDialog(convertedAction, oAction, mActionExecutionParameters, aParameterValues, mParameters.entitySetName, mParameters.view, mParameters.messageHandler, strictHandlingUtilities, {
              beforeShowingMessage: actionParameterShowMessageCallback
            }, mParameters.ignoreETag);
            await parameterDialog.createDialog();
            operationResult = await parameterDialog.openDialog(mParameters.parentControl);
          }
        } else if (bIsCriticalAction) {
          executionWitDialog = true;
          operationResult = await confirmCriticalAction(convertedAction, sActionName, mActionExecutionParameters, mParameters.parentControl, mParameters.entitySetName, mParameters.messageHandler, strictHandlingUtilities, mParameters.ignoreETag);
        }
      } catch (e) {
        reject(e);
      }
      if (executionWitDialog) {
        afterActionResolution(mParameters, mActionExecutionParameters, actionDefinition);
        resolve(operationResult);
        return;
      }

      // Take over all provided parameter values and call the action.
      // This shall only happen if values are provided for all the parameters, otherwise the parameter dialog shall be shown which is ensured earlier

      if (aParameterValues) {
        for (const i in mActionExecutionParameters.aActionParameters) {
          mActionExecutionParameters.defaultParametersValues[mActionExecutionParameters.aActionParameters[i].name] = aParameterValues?.find(element => element.name === mActionExecutionParameters.aActionParameters[i].name)?.value;
        }
      } else {
        let actionParameter, parameterValueNotConverted;
        for (const i in mActionExecutionParameters.aActionParameters) {
          actionParameter = mActionExecutionParameters.aActionParameters[i];
          parameterValueNotConverted = oStartupParameters[actionParameter.name]?.[0] || actionParameter.annotations?.UI?.ParameterDefaultValue?.valueOf();
          mActionExecutionParameters.defaultParametersValues[actionParameter.name] = parameterValueNotConverted === undefined ? parameterValueNotConverted : await checkParameterTypeAndReturnConvertedValue(actionParameter, parameterValueNotConverted);
        }
      }
      let oOperationResult = [];
      try {
        oOperationResult = await new ODataOperation(convertedAction, mActionExecutionParameters, mParameters.messageHandler, strictHandlingUtilities, {
          ignoreETag: mParameters.ignoreETag
        }).execute();
        const messages = Messaging.getMessageModel().getData();
        if (strictHandlingUtilities && strictHandlingUtilities.is412Executed && strictHandlingUtilities.strictHandlingTransitionFails.length) {
          strictHandlingUtilities.delaySuccessMessages = strictHandlingUtilities.delaySuccessMessages.concat(messages);
        }
        afterActionResolution(mParameters, mActionExecutionParameters, actionDefinition);
        resolve(oOperationResult);
      } catch (e) {
        reject(e);
      } finally {
        if (strictHandlingUtilities && strictHandlingUtilities.is412Executed && strictHandlingUtilities.strictHandlingTransitionFails.length && mParameters.aContexts.length > 1) {
          try {
            const strictHandlingFails = strictHandlingUtilities.strictHandlingTransitionFails;
            const aFailedContexts = [];
            strictHandlingFails.forEach(function (fail) {
              aFailedContexts.push(fail.oAction.getContext());
            });
            mActionExecutionParameters.aContexts = aFailedContexts;
            const oFailedOperationResult = await new ODataOperation(convertedAction, mActionExecutionParameters, mParameters.messageHandler, strictHandlingUtilities, {
              ignoreETag: mParameters.ignoreETag
            }).execute();
            strictHandlingUtilities.strictHandlingTransitionFails = [];
            Messaging.addMessages(strictHandlingUtilities.delaySuccessMessages);
            afterActionResolution(mParameters, mActionExecutionParameters, actionDefinition);
            resolve(oFailedOperationResult);
          } catch (e) {
            reject(e);
          }
        }
        let showGenericErrorMessageForChangeSet = false;
        if (mParameters.bGrouped && strictHandlingUtilities && strictHandlingUtilities.strictHandlingPromises.length || mParameters.bGrouped && messageHandling.hasTransitionErrorsOrWarnings()) {
          showGenericErrorMessageForChangeSet = true;
        }
        mParameters?.messageHandler?.showMessageDialog({
          control: mActionExecutionParameters?.control,
          onBeforeShowMessage: function (aMessages, showMessageParametersIn) {
            return actionParameterShowMessageCallback(mActionExecutionParameters, aContexts, undefined, aMessages, showMessageParametersIn, showGenericErrorMessageForChangeSet, oOperationResult.length > 0 && oOperationResult.every(res => res.status === "fulfilled"));
          },
          aSelectedContexts: mParameters.aContexts,
          sActionName: sActionLabel,
          entitySet: mParameters.entitySetName,
          boundActionName: sActionName
        }).then(() => {
          mParameters.messageHandler.clearStrictWarningMessages();
          return;
        });
        if (strictHandlingUtilities) {
          strictHandlingUtilities = {
            is412Executed: false,
            strictHandlingTransitionFails: [],
            strictHandlingPromises: [],
            strictHandlingWarningMessages: [],
            delaySuccessMessages: [],
            processedMessageIds: new Set()
          };
        }
      }
    });
  }

  /**
   * Reads a title from custom i18n file.
   * @param oParentControl The view where the action is called
   * @param suffixResourceKey The key of the title
   * @returns Title if defined
   */
  function getConfirmTitle(oParentControl, suffixResourceKey) {
    // A title only exists if it has been defined in the extension. Otherwise "Confirmation"
    // is used from the MessageBox control.
    const key = "C_OPERATIONS_ACTION_CONFIRM_TITLE";
    const resourceModel = getResourceModel(oParentControl);
    const titleOverrideExists = resourceModel.checkIfResourceKeyExists(`${key}|${suffixResourceKey}`);
    if (titleOverrideExists) {
      return resourceModel.getText(key, undefined, suffixResourceKey);
    }
  }
  async function confirmCriticalAction(convertedAction, sActionName, mParameters, oParentControl, entitySetName, messageHandler, strictHandlingUtilities, ignoreETag) {
    return new Promise((resolve, reject) => {
      let boundActionName = sActionName;
      boundActionName = boundActionName.includes(".") ? boundActionName.split(".")[boundActionName.split(".").length - 1] : boundActionName;
      const suffixResourceKey = boundActionName && entitySetName ? `${entitySetName}|${boundActionName}` : "";
      const resourceModel = getResourceModel(oParentControl);
      const sConfirmationText = resourceModel.getText("C_OPERATIONS_ACTION_CONFIRM_MESSAGE", undefined, suffixResourceKey);
      MessageBox.confirm(sConfirmationText, {
        title: getConfirmTitle(oParentControl, suffixResourceKey),
        onClose: async function (sAction) {
          if (sAction === Action.OK) {
            try {
              const oOperation = await new ODataOperation(convertedAction, mParameters, messageHandler, strictHandlingUtilities, {
                ignoreETag
              }).execute();
              resolve(oOperation);
            } catch (oError) {
              try {
                await messageHandler.showMessageDialog();
                reject(oError);
              } catch (e) {
                reject(oError);
              }
            }
          } else {
            reject(Constants.CancelActionDialog);
          }
        }
      });
    });
  }
  function afterActionResolution(mParameters, mActionExecutionParameters, actionDefinition) {
    if (mActionExecutionParameters.internalModelContext && mActionExecutionParameters.operationAvailableMap && mActionExecutionParameters.aContexts && mActionExecutionParameters.aContexts.length && actionDefinition.$IsBound) {
      let selectedContexts = [];
      //check for skipping static actions
      const isStatic = mActionExecutionParameters.isStatic;
      if (!isStatic) {
        selectedContexts = mActionExecutionParameters.internalModelContext.getProperty("selectedContexts") || [];
        ActionRuntime.setActionEnablement(mActionExecutionParameters.internalModelContext, JSON.parse(mActionExecutionParameters.operationAvailableMap), selectedContexts, "table");
      } else if (mActionExecutionParameters.control) {
        const control = mActionExecutionParameters.control;
        if (control.isA("sap.ui.mdc.Table")) {
          selectedContexts = control.getSelectedContexts();
          ActionRuntime.setActionEnablement(mActionExecutionParameters.internalModelContext, JSON.parse(mActionExecutionParameters.operationAvailableMap), selectedContexts, "table");
        }
      }
      //update delete button
      DeleteHelper.updateDeleteInfoForSelectedContexts(mActionExecutionParameters.internalModelContext, selectedContexts);
    }
  }

  /**
   * Filters an array of messages based on various conditions and returns an object containing the filtered messages and other properties.
   * @param messages The messages to filter.
   * @param errorTargetsInAPD Indicates whether error targets are in APD.
   * @param contexts An array of contexts.
   * @param unboundMessages An array of unbound messages.
   * @param control A control object.
   * @param isAPDOPen Indicates whether APD is open.
   * @param showMessageDialog Indicates whether to show the message dialog.
   * @returns An object containing a boolean indicating whether the result contains a bound transition, an array of messages to show, and a boolean indicating whether to show the message in a dialog.
   */
  function filterAPDandContextMessages(messages, errorTargetsInAPD, contexts, unboundMessages, control, isAPDOPen, showMessageDialog) {
    if (isAPDOPen && errorTargetsInAPD) {
      /* When APD is open, we need to remove the messages which are related to the objectpage context */
      messageHandling.removeContextMessagesfromModel(messages, contexts);
    }

    // Filter out messages which are not related to the action parameter dialog in the edit mode and display mode
    let containsBoundTransistion;
    if (!(control && CommonUtils.getIsEditable(control))) {
      if (isAPDOPen && errorTargetsInAPD) {
        if (unboundMessages?.length === 0) {
          containsBoundTransistion = false;
          showMessageDialog = false;
        }
        messages = messageHandling.removeMessagesForActionParameterDialog(messages);
      }
    } else {
      if (unboundMessages?.length === 0) {
        containsBoundTransistion = false;
      }
      messages = messageHandling.removeMessagesForActionParameterDialog(messages);
    }
    return {
      messagesToShow: messages,
      containsBoundTransistion: containsBoundTransistion,
      showMessageInDialog: showMessageDialog
    };
  }
  function actionParameterShowMessageCallback(mParameters, aContexts, oDialog, messages, showMessageParametersIn, showGenericErrorMessageForChangeSet, isActionSuccessful) {
    let showMessageBox = showMessageParametersIn.showMessageBox,
      showMessageDialog = showMessageParametersIn.showMessageDialog;
    const oControl = mParameters.control;
    const oResourceBundle = Library.getResourceBundleFor("sap.fe.core");
    const unboundMessages = messages.filter(function (message) {
      return message.getTargets()?.[0] === "";
    });
    const APDmessages = messages.filter(function (message) {
      return message.getTargets && message.getTargets()?.[0].includes(mParameters.actionName) && mParameters?.aActionParameters?.some(function (actionParam) {
        return message.getTargets()?.[0].includes(actionParam.name);
      });
    });
    APDmessages?.forEach(function (APDMessage) {
      APDMessage.isAPDTarget = true;
    });
    const errorTargetsInAPD = APDmessages.length ? true : false;
    //If Action is successful with warnings, dont show the generic error message for changeset in dialog
    if (showGenericErrorMessageForChangeSet && !errorTargetsInAPD && !isActionSuccessful) {
      const messageModel = Messaging.getMessageModel();
      const messagesInModel = messageModel.getData();
      const aBoundMessages = messageHandling.getMessages(true);
      let genericMessage;
      const isEditable = (oControl && CommonUtils.getIsEditable(oControl)) ?? false;
      const nonErrorMessageExistsInDialog = messages.findIndex(function (message) {
        return message.getType() === "Error" || message.getType() === "Warning";
      });
      const nonErrorMessageExistsInModel = messagesInModel.findIndex(function (message) {
        return message.getType() === "Error" || message.getType() === "Warning";
      });
      if (nonErrorMessageExistsInDialog !== 1 && nonErrorMessageExistsInModel !== -1 && mParameters.aContexts && mParameters.aContexts.length > 1) {
        if (messagesInModel.length === 1 && aBoundMessages.length === 1) {
          genericMessage = getGenericMsgForSingleErrorInChangeSet(isEditable, oResourceBundle);
          messages.unshift(genericMessage);
          showMessageBox = true;
          showMessageDialog = false;
        } else {
          const sMessage = oResourceBundle.getText("C_COMMON_DIALOG_CANCEL_ERROR_MESSAGES_TEXT");
          const sDescriptionText = oResourceBundle.getText("C_COMMON_DIALOG_CANCEL_ERROR_MESSAGES_DETAIL_TEXT");
          genericMessage = new Message({
            message: sMessage,
            type: MessageType.Error,
            target: "",
            persistent: true,
            description: sDescriptionText,
            code: "FE_CUSTOM_MESSAGE_CHANGESET_ALL_FAILED"
          });
          messages.unshift(genericMessage);
          if (messages.length === 1) {
            showMessageBox = true;
            showMessageDialog = false;
          } else {
            showMessageDialog = true;
            showMessageBox = false;
          }
        }
      }
    }
    if (oDialog && oDialog.isOpen() && aContexts.length !== 0 && !mParameters.isStatic) {
      if (!mParameters.bGrouped) {
        //isolated
        if (aContexts.length > 1 || !errorTargetsInAPD) {
          // does not matter if error is in APD or not, if there are multiple contexts selected or if the error is not the APD, we close it.
          // TODO: Dilaog handling should not be part of message handling. Refactor accordingly - dialog should not be needed inside this method - neither
          // to ask whether it's open, nor to close/destroy it!
          oDialog.close();
          oDialog.destroy();
        }
      } else if (!errorTargetsInAPD) {
        //changeset
        oDialog.close();
        oDialog.destroy();
      }
    }
    const filteredMessages = [];
    const bIsAPDOpen = oDialog && oDialog.isOpen();
    const {
      messagesToShow,
      containsBoundTransistion,
      showMessageInDialog
    } = filterAPDandContextMessages(messages, errorTargetsInAPD, aContexts, unboundMessages, oControl, bIsAPDOpen);
    messages = messagesToShow;
    showMessageDialog = showMessageInDialog ?? showMessageDialog;
    if (!bIsAPDOpen && errorTargetsInAPD && !mParameters.bGrouped) {
      // If APD is not open and there are messages related to APD, then show in the message dialog. since
      showMessageDialog = true;
      messages = messages.concat(APDmessages);
    }
    let fnGetMessageSubtitle;
    if (oControl && oControl.isA("sap.ui.mdc.Table")) {
      fnGetMessageSubtitle = messageHandling.setMessageSubtitle.bind({}, oControl, aContexts);
    }
    return {
      showMessageBox: showMessageBox,
      showMessageDialog: showMessageDialog,
      filteredMessages: filteredMessages.length ? filteredMessages : messages,
      fnGetMessageSubtitle: fnGetMessageSubtitle,
      showChangeSetErrorDialog: mParameters.bGrouped,
      containsBoundTransistion: containsBoundTransistion
    };
  }
  function _valuesProvidedForAllMandatoryParameters(isCreateAction, actionParameters, parameterValues, startupParameters) {
    const hiddenAnnotationSetOnAllActions = actionParameters.every(parameter => parameter?.annotations?.UI?.Hidden?.valueOf() === true);
    if (parameterValues?.length && !hiddenAnnotationSetOnAllActions) {
      // If showDialog is false but there are parameters from the invokeAction call which need to be checked on existance
      for (const actionParameter of actionParameters) {
        if (actionParameter.name !== "ResultIsActiveEntity" && !parameterValues?.find(element => element.name === actionParameter.name)) {
          // At least for one parameter no value has been provided, so we can't skip the dialog
          return false;
        }
      }
    }
    if (isCreateAction && startupParameters?.length && !hiddenAnnotationSetOnAllActions) {
      // If parameters have been provided during application launch, we need to check if the set is complete
      // If not, the parameter dialog still needs to be shown.
      for (const actionParameter of actionParameters) {
        if (startupParameters && !startupParameters[actionParameter.name]) {
          // At least for one parameter no value has been provided, so we can't skip the dialog
          return false;
        }
      }
    }
    if (actionParameters.length && hiddenAnnotationSetOnAllActions) {
      return actionParameters.every(function (parameter) {
        const fieldControl = parameter.annotations?.Common?.FieldControl;
        const isMandatory = fieldControl?.toString() === "Common.FieldControlType/Mandatory";

        // Possible sources may be startupParameters, parameterValues, defaultValues per annotation (ParameterDefaultValue)
        // If none is found, return false
        return !isMandatory || startupParameters && startupParameters[parameter.name] || parameterValues?.find(parameterValue => parameterValue.name === parameter.name) || parameter?.annotations?.UI?.ParameterDefaultValue?.valueOf();
      });
    }
    return true;
  }
  function getGenericMsgForSingleErrorInChangeSet(isEditable, resourceBundle) {
    const message = isEditable ? resourceBundle.getText("C_COMMON_DIALOG_CANCEL_SINGLE_ERROR_MESSAGE_TEXT_EDIT") : resourceBundle.getText("C_COMMON_DIALOG_CANCEL_SINGLE_ERROR_MESSAGE_TEXT");
    return new Message({
      message,
      type: MessageType.Error,
      target: "",
      persistent: true,
      code: "FE_CUSTOM_MESSAGE_CHANGESET_ALL_FAILED",
      technicalDetails: {
        fe: {
          changeSetPreTextForSingleError: message
        }
      }
    });
  }

  /**
   * Static functions to call OData actions (bound/import) and functions (bound/import)
   * @namespace
   * @experimental This module is only for experimental use! <br/><b>This is only a POC and maybe deleted</b>
   * @since 1.56.0
   */
  const operations = {
    callBoundAction: callBoundAction,
    callActionImport: callActionImport,
    callBoundFunction: callBoundFunction,
    callFunctionImport: callFunctionImport,
    valuesProvidedForAllMandatoryParameters: _valuesProvidedForAllMandatoryParameters,
    actionParameterShowMessageCallback: actionParameterShowMessageCallback,
    afterActionResolution: afterActionResolution,
    checkParameterTypeAndReturnConvertedValue: checkParameterTypeAndReturnConvertedValue,
    getConfirmTitle: getConfirmTitle
  };
  return operations;
}, false);
//# sourceMappingURL=facade-dbg.js.map
