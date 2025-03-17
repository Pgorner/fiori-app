/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/base/BindingToolkit", "sap/fe/core/ActionRuntime", "sap/fe/core/CommonUtils", "sap/fe/core/controllerextensions/BusyLocker", "sap/fe/core/controllerextensions/editFlow/ODataOperation", "sap/fe/core/controllerextensions/editFlow/editFlowConstants", "sap/fe/core/controllerextensions/editFlow/operations/facade", "sap/fe/core/controllerextensions/messageHandler/messageHandling", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/helpers/FPMHelper", "sap/fe/core/helpers/ResourceModelHelper", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/helpers/TypeGuards", "sap/fe/core/library", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/templating/FieldControlHelper", "sap/fe/core/templating/PropertyHelper", "sap/fe/macros/field/FieldHelper", "sap/fe/macros/internal/valuehelp/ValueHelpTemplating", "sap/m/Button", "sap/m/Dialog", "sap/m/Label", "sap/m/MessageBox", "sap/ui/core/Messaging", "sap/ui/core/message/MessageType", "sap/ui/layout/form/SimpleForm", "sap/ui/mdc/Field", "sap/ui/mdc/MultiValueField", "sap/ui/mdc/ValueHelp", "sap/ui/mdc/enums/FieldEditMode", "sap/ui/mdc/field/MultiValueFieldItem", "sap/ui/mdc/valuehelp/Dialog", "sap/ui/mdc/valuehelp/Popover", "sap/ui/mdc/valuehelp/content/MTable", "sap/ui/model/json/JSONModel", "sap/ui/model/odata/v4/AnnotationHelper", "sap/fe/base/jsx-runtime/jsx", "sap/fe/base/jsx-runtime/Fragment", "sap/fe/base/jsx-runtime/jsxs"], function (Log, BindingToolkit, ActionRuntime, CommonUtils, BusyLocker, ODataOperation, UiModelConstants, operations, messageHandling, MetaModelConverter, FPMHelper, ResourceModelHelper, StableIdHelper, TypeGuards, FELibrary, DataModelPathHelper, FieldControlHelper, PropertyHelper, FieldHelper, ValueHelpTemplating, Button, Dialog, Label, MessageBox, Messaging, MessageType, SimpleForm, Field, MultiValueField, ValueHelp, FieldEditMode, MultiValueFieldItem, VHDialog, Popover, MTable, JSONModel, AnnotationHelper, _jsx, _Fragment, _jsxs) {
  "use strict";

  var _exports = {};
  var useCaseSensitiveFilterRequests = ValueHelpTemplating.useCaseSensitiveFilterRequests;
  var requiresValidation = ValueHelpTemplating.requiresValidation;
  var isMultiLineText = PropertyHelper.isMultiLineText;
  var hasValueHelp = PropertyHelper.hasValueHelp;
  var isReadOnlyExpression = FieldControlHelper.isReadOnlyExpression;
  var isDisabledExpression = FieldControlHelper.isDisabledExpression;
  var isActionParameterRequiredExpression = FieldControlHelper.isActionParameterRequiredExpression;
  var getTargetNavigationPath = DataModelPathHelper.getTargetNavigationPath;
  var isPathAnnotationExpression = TypeGuards.isPathAnnotationExpression;
  var generate = StableIdHelper.generate;
  var getResourceModel = ResourceModelHelper.getResourceModel;
  var getInvolvedDataModelObjects = MetaModelConverter.getInvolvedDataModelObjects;
  var convertTypes = MetaModelConverter.convertTypes;
  var not = BindingToolkit.not;
  var ifElse = BindingToolkit.ifElse;
  var getExpressionFromAnnotation = BindingToolkit.getExpressionFromAnnotation;
  var equal = BindingToolkit.equal;
  var constant = BindingToolkit.constant;
  var compileExpression = BindingToolkit.compileExpression;
  let ActionParameterDialog = /*#__PURE__*/function () {
    function ActionParameterDialog(action, actionContext, parameters, parameterValues, entitySetName, view, messageHandler, strictHandlingUtilities, callbacks, ignoreETag) {
      this.buttonLock = false;
      this.actionParameterInfos = [];
      this.result = [];
      this.parameterModel = new JSONModel({
        $displayMode: {}
      });
      this.action = action;
      this.actionContext = actionContext;
      this.parameters = parameters;
      this.parameterValues = parameterValues;
      this.entitySetName = entitySetName;
      this.view = view;
      this.messageHandler = messageHandler;
      this.strictHandlingUtilities = strictHandlingUtilities;
      this.callbacks = callbacks;
      this.ignoreETag = ignoreETag;
      this.actionName = this.action.isBound ? this.action.fullyQualifiedName.replace(/\(.*\)$/g, "") // remove the part related to the overlay
      : this.action.name;
      this.metaModel = actionContext.getModel();
      this.dialogPromise = new Promise((resolve, reject) => {
        this._fnResolve = resolve;
        this._fnReject = reject;
      });
      this.resourceModel = this.view ? getResourceModel(this.view) : getResourceModel(this.parameters.appComponent);
    }

    /**
     * Gets binding expression of the edit mode property for a parameter.
     * @param parameter The parameter
     * @returns The binding expression.
     */
    _exports = ActionParameterDialog;
    var _proto = ActionParameterDialog.prototype;
    _proto.getParameterEditMode = function getParameterEditMode(parameter) {
      const annotations = parameter.annotations,
        fieldControl = annotations.Common?.FieldControl,
        immutable = annotations.Core?.Immutable?.valueOf(),
        computed = annotations.Core?.Computed?.valueOf();
      if (immutable || computed) {
        return constant(FieldEditMode.ReadOnly);
      } else if (fieldControl) {
        return ifElse(isReadOnlyExpression(parameter), FieldEditMode.ReadOnly, ifElse(isDisabledExpression(parameter), FieldEditMode.Disabled, FieldEditMode.Editable));
      }
      return constant(FieldEditMode.Editable);
    }

    /**
     * Creates the form element control for a parameter.
     * @param parameter The parameter
     * @returns The form element control.
     */;
    _proto.createFormElement = async function createFormElement(parameter) {
      const actionMetaPath = this.metaModel.getMetaPath(this.actionContext.getPath());
      const metaContext = this.metaModel.createBindingContext(CommonUtils.getParameterPath(actionMetaPath, parameter.name));
      const field = await (parameter.isCollection ? this.createMultiField(parameter, metaContext) : this.createField(parameter, metaContext));
      return _jsxs(_Fragment, {
        children: [_jsx(Label, {
          id: generate(["APD_", parameter.name, "Label"]),
          text: parameter.annotations.Common?.Label ? this.resourceModel.getText(parameter.annotations.Common.Label.toString()) : parameter.name
        }), field]
      });
    }

    /**
     * Creates the multi field control for a parameter.
     * @param parameter The parameter
     * @param parameterContext The parameter context
     * @returns The multi value field control.
     */;
    _proto.createMultiField = async function createMultiField(parameter, parameterContext) {
      const display = await FieldHelper.getAPDialogDisplayFormat(parameterContext.getObject(), {
        context: parameterContext
      });
      return _jsx(MultiValueField, {
        id: generate(["APD_", parameter.name]),
        placeholder: parameter.annotations.UI?.Placeholder,
        items: {
          path: `mvfview>/${parameter.name}`
        },
        delegate: {
          name: "sap/fe/core/controls/MultiValueParameterDelegate"
        },
        display: display,
        editMode: this.getParameterEditMode(parameter),
        width: "100%",
        multipleLines: parameter.annotations.UI?.MultiLineText?.valueOf() === true,
        required: compileExpression(isActionParameterRequiredExpression(parameter, this.action, convertTypes(this.metaModel))),
        valueHelp: hasValueHelp(parameter) ? generate([this.actionName, parameter.name]) : undefined,
        change: async e => this.handleFieldChange(e, parameter),
        visible: compileExpression(not(equal(getExpressionFromAnnotation(parameter.annotations?.UI?.Hidden), true))),
        ariaLabelledBy: [generate(["APD_", parameter.name, "Label"])],
        dependents: this.createParameterDialogValueHelp(parameter, parameterContext),
        children: _jsx(MultiValueFieldItem, {
          description: "{mvfview>Desc}"
        }, "{path: 'mvfview>Key', type:'sap.ui.model.type.String'}")
      });
    }

    /**
     * Creates the field control for a parameter.
     * @param parameter The parameter
     * @param parameterContext The parameter context
     * @returns The field control.
     */;
    _proto.createField = async function createField(parameter, parameterContext) {
      const display = await FieldHelper.getAPDialogDisplayFormat(parameterContext.getObject(), {
        context: parameterContext
      });
      return _jsx(Field, {
        delegate: {
          name: "sap/fe/macros/field/FieldBaseDelegate",
          payload: {
            retrieveTextFromValueList: true
          }
        },
        id: generate(["APD_", parameter.name]),
        value: AnnotationHelper.format(parameterContext.getObject(), {
          context: parameterContext
        }),
        placeholder: parameter.annotations.UI?.Placeholder,
        display: display,
        editMode: this.getParameterEditMode(parameter),
        width: "100%",
        multipleLines: isMultiLineText(parameter),
        required: compileExpression(isActionParameterRequiredExpression(parameter, this.action, convertTypes(this.metaModel))),
        change: async e => this.handleFieldChange(e, parameter),
        valueHelp: hasValueHelp(parameter) ? generate([this.actionName, parameter.name]) : undefined,
        dependents: this.createParameterDialogValueHelp(parameter, parameterContext),
        visible: compileExpression(ifElse(parameter.name === "ResultIsActiveEntity", false, not(equal(getExpressionFromAnnotation(parameter.annotations?.UI?.Hidden), true)))),
        ariaLabelledBy: [generate(["APD_", parameter.name, "Label"])]
      });
    }

    /**
     * Creates the valueHelp  for a parameter.
     * @param parameter The parameter
     * @param parameterContext The parameter context
     * @returns A valueHelp if the parameter has a VH, undefined otherwise
     */;
    _proto.createParameterDialogValueHelp = function createParameterDialogValueHelp(parameter, parameterContext) {
      if (!hasValueHelp(parameter)) {
        return undefined;
      }
      return _jsx(ValueHelp, {
        id: generate([this.actionName, parameter.name]),
        delegate: {
          name: "sap/fe/macros/valuehelp/ValueHelpDelegate",
          payload: {
            propertyPath: this.action.isBound ? `${getTargetNavigationPath(getInvolvedDataModelObjects(parameterContext))}/${this.actionName}/${parameter.name}` : `/${this.action.name.substring(this.action.name.lastIndexOf(".") + 1)}/${parameter.name}`,
            qualifiers: {},
            valueHelpQualifier: ""
          }
        },
        validateInput: requiresValidation(parameter),
        typeahead: _jsx(Popover, {
          children: _jsx(MTable, {
            id: generate([this.actionName, parameter.name, "Popover", "qualifier"]),
            caseSensitive: this.action.isBound ? useCaseSensitiveFilterRequests(getInvolvedDataModelObjects(parameterContext), convertTypes(this.metaModel).entityContainer.annotations.Capabilities?.FilterFunctions ?? []) : false,
            useAsValueHelp: !!parameter.annotations.Common?.ValueListWithFixedValues
          })
        }),
        dialog: this.createFieldVHDialog(parameter)
      });
    }

    /**
     * Creates the ValueHelp dialog for a parameter.
     * @param parameter The parameter
     * @returns A dialog if the parameter has a VH, undefined otherwise
     */;
    _proto.createFieldVHDialog = function createFieldVHDialog(parameter) {
      if (parameter.annotations.Common?.ValueListWithFixedValues?.valueOf() !== true) {
        return _jsx(VHDialog, {});
      } else {
        return undefined;
      }
    }

    /**
     * Handles the field change event for a parameter.
     * @param event The ui5 event
     * @param parameter The parameter
     * @returns Promise.
     */;
    _proto.handleFieldChange = async function handleFieldChange(event, parameter) {
      const fieldPromise = event.getParameter("promise");
      const field = event.getSource();
      const parameterInfo = this.actionParameterInfos.find(actionParameterInfo => actionParameterInfo.field === field);
      if (!parameterInfo) {
        return;
      }
      parameterInfo.validationPromise = fieldPromise;
      // field value is being changed, thus existing messages related to that field are not valid anymore
      this.removeMessagesForParameter(parameter);
      try {
        parameterInfo.value = await fieldPromise;
        this.parameters.defaultParametersValues[parameterInfo.parameter.name] = parameterInfo.value;
        parameterInfo.hasError = false;
      } catch (error) {
        delete parameterInfo.value;
        parameterInfo.hasError = true;
        ActionRuntime._addMessageForActionParameter([{
          actionParameterInfo: parameterInfo,
          message: error.message
        }]);
      }
    }

    /**
     * Removes the messages for a parameter.
     * @param parameter The parameter
     */;
    _proto.removeMessagesForParameter = function removeMessagesForParameter(parameter) {
      const messages = Messaging.getMessageModel().getData();
      const controlId = generate(["APD_", parameter.name]);
      // also remove messages assigned to inner controls, but avoid removing messages for different parameters (with name being substring of another parameter name)
      const relevantMessages = messages.filter(msg => msg.getControlIds().some(id => controlId.split("-").includes(id)));
      Messaging.removeMessages(relevantMessages);
    }

    /**
     * gets the FormElements along with the array of parameters.
     * @param parameter The parameter
     * @returns The parameter information along with the FormElements.
     */;
    _proto.getFormElements = async function getFormElements(parameter) {
      const formElements = await this.createFormElement(parameter);
      return {
        formElements: formElements,
        parameter: parameter
      };
    }

    /**
     * Creates the action parameter dialog.
     * @returns The dialog.
     */;
    _proto.createDialog = async function createDialog() {
      const actionParameters = this.action.isBound ? this.action.parameters.slice(1) : this.action.parameters;
      // In case of deffered create we have no view, so we need to get the resource model from the app component

      const dialogContentsWithParameters = await Promise.all(actionParameters.map(this.getFormElements.bind(this)));
      const dialogContents = dialogContentsWithParameters.map(dialogContent => {
        return dialogContent.formElements;
      });
      this.registerActionParameterInfo(dialogContentsWithParameters);
      const endButton = _jsx(Button, {
        id: generate(["fe", "APD_", this.actionName, "Action", "Cancel"]),
        text: this.resourceModel.getText("C_COMMON_ACTION_PARAMETER_DIALOG_CANCEL"),
        press: this.close.bind(this)
      });
      const dialog = _jsx(Dialog, {
        title: this.getTitleText(this.parameters.label),
        id: generate(["fe", "APD_", this.actionName]),
        escapeHandler: this.close.bind(this),
        afterClose: this.afterClose.bind(this),
        beforeOpen: this.beforeOpen.bind(this),
        afterOpen: () => {
          this.afterOpen();
        },
        initialFocus: endButton // The initial focus is set programmatically in afterOpen, to avoid opening the VH dialog
        ,
        children: {
          beginButton: _jsx(Button, {
            id: generate(["fe", "APD_", this.actionName, "Action", "Ok"]),
            text: this.parameters.isCreateAction ? this.resourceModel.getText("C_TRANSACTION_HELPER_SAPFE_ACTION_CREATE_BUTTON_CONTINUE") : this.getBeginButtonLabel(this.parameters.label),
            press: () => {
              this.onApply.bind(this)();
            },
            type: "Emphasized"
          }),
          endButton: endButton,
          content:
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore (unknown property binding)
          _jsx(SimpleForm, {
            binding: "$Parameter",
            children: {
              content: dialogContents
            }
          })
        }
      });
      this.dialog = dialog;
      return dialog;
    }

    /**
     * Gets the label for the begin button of the dialog.
     * @param actionLabel The label of the action
     * @returns The label.
     */;
    _proto.getBeginButtonLabel = function getBeginButtonLabel(actionLabel) {
      const key = "ACTION_PARAMETER_DIALOG_ACTION_NAME";
      const defaultKey = "C_COMMON_DIALOG_OK";
      return this.getOverriddenText(key, defaultKey, actionLabel);
    }

    /**
     * Gets the title of the dialog.
     * @param actionLabel The label of the action
     * @returns The title.
     */;
    _proto.getTitleText = function getTitleText(actionLabel) {
      const key = "ACTION_PARAMETER_DIALOG_ACTION_TITLE";
      const defaultKey = "C_OPERATIONS_ACTION_PARAMETER_DIALOG_TITLE";
      return this.getOverriddenText(key, defaultKey, actionLabel);
    }

    /**
     * Gets an overridden text.
     * @param key The key for an overridden text
     * @param defaultKey The default key for the text
     * @param actionLabel The label of the action
     * @returns The overridden text or label.
     */;
    _proto.getOverriddenText = function getOverriddenText(key, defaultKey, actionLabel) {
      let boundActionName = this.actionName;
      boundActionName = boundActionName.split(".").pop() ?? boundActionName;
      const suffixResourceKey = boundActionName && this.entitySetName ? `${this.entitySetName}|${boundActionName}` : "";
      if (actionLabel) {
        if (this.resourceModel.checkIfResourceKeyExists(`${key}|${suffixResourceKey}`)) {
          return this.resourceModel.getText(key, undefined, suffixResourceKey);
        } else if (this.resourceModel.checkIfResourceKeyExists(`${key}|${this.entitySetName}`)) {
          return this.resourceModel.getText(key, undefined, `${this.entitySetName}`);
        } else if (this.resourceModel.checkIfResourceKeyExists(`${key}`)) {
          return this.resourceModel.getText(key);
        } else {
          return actionLabel;
        }
      } else {
        return this.resourceModel.getText(defaultKey);
      }
    }

    /**
     * Manages the press event of the begin button of the dialog.
     * @returns The promise.
     */;
    _proto.onApply = async function onApply() {
      // prevent multiple press events. The BusyLocker is not fast enough. (BCP: 2370130210)
      if (this.buttonLock || !this.dialog) {
        return;
      }
      const dialog = this.dialog;
      const innerParameters = {
        ...this.parameters
      };
      const parameterContext = dialog.getObjectBinding()?.getParameterContext();
      const newValuesDictionary = Object.assign({}, ...this.actionParameterInfos.map(actionParameterInfos => {
        const parameter = actionParameterInfos.parameter;
        const value = parameter.isCollection ? Object.values(dialog.getModel("mvfview").getProperty(`/${parameter.name}`) ?? {}).map(value => value?.Key) : parameterContext?.getProperty(parameter.name);
        return {
          [parameter.name]: value
        };
      }));
      const isNewValue = Object.values(newValuesDictionary).some(value => !!value);
      innerParameters.label = this.parameters.label;
      this.buttonLock = true;
      BusyLocker.lock(dialog);

      // validate the action parameters
      if (!(await ActionRuntime.validateProperties(this.actionParameterInfos, this.resourceModel))) {
        BusyLocker.unlock(this.dialog);
        this.buttonLock = false;
        return;
      }
      //Save the values of the parameters
      innerParameters.defaultParametersValues = newValuesDictionary;
      this.parameters.appComponent.getModel("ui").setProperty(UiModelConstants.DocumentModified, isNewValue);
      // Due to using the search and value helps on the action dialog transient messages could appear
      // we need an UX design for those to show them to the user - for now remove them before continuing
      this.messageHandler.removeTransitionMessages();
      const {
        errorOnFirstIteration,
        failedContexts
      } = await this.executeActionOnApply(innerParameters);
      if (errorOnFirstIteration) {
        const isDialogMessage = await this.manageMessageOnApply(failedContexts);
        this.buttonLock = false; //needed if the action fails with an error popup and this one is canceled (Journey: 412WarningHandling)
        // In case of backend validation error(s?), message shall not be shown in message dialog but next to the field on parameter dialog, which should
        // stay open in this case => in this case, we must not resolve or reject the promise controlling the parameter dialog.
        // In all other cases (e.g. other backend errors or user cancellation), the promise controlling the parameter dialog needs to be rejected to allow
        // callers to react. (Example: If creation in backend after navigation to transient context fails, back navigation needs to be triggered)
        if (isDialogMessage) {
          if (dialog.isOpen()) {
            // do nothing, do not reject promise here
            // We do not close the APM dialog if user enters a wrong value in of the fields that results in an error from the backend.
            // The user can close the message dialog and the APM dialog would still be open on which he could enter a new value and trigger the action again.
            // Earlier we were rejecting the promise on error here, and the call stack was destroyed as the promise was rejected and returned to EditFlow invoke action.
            // But since the APM dialog was still open, a new promise was resolved in case the user retried the action and the object was created, but the navigation to object page was not taking place.
            this.updateDialogBindingContextForError(this.parameters.aContexts);
          } else {
            this._fnReject(errorOnFirstIteration);
          }
        }
      }
      this.afterOnApply();
    }

    /**
     * Change the binding context of the dialog to one with priority message.
     *
     * On initial action execution, we might have bound messages with any selected contexts as target apart from the dialog's initial context.
     * We change the binding context of dialog for the parameter fields' to get the valid value state from the priority bound message.
     * @param contexts Array of selected contexts.
     */;
    _proto.updateDialogBindingContextForError = function updateDialogBindingContextForError(contexts) {
      if (contexts.length < 2) {
        // We would need to switch the binding context of the dialog only when we have multiple contexts for executing the action.
        return;
      }
      let warningContext, infoContext;
      const erroneousCtx = contexts.find(ctx => {
        const messages = ctx.getMessages();
        return messages.some(msg => {
          // We hold first context with warning or info messages.
          warningContext = !warningContext && msg.getType() === MessageType.Warning ? ctx : undefined;
          infoContext = !infoContext && msg.getType() === MessageType.Information ? ctx : undefined;
          // Error is found!!! We shall exit.
          return msg.getType() === MessageType.Error;
        });
      });
      const contextToUse = erroneousCtx ?? warningContext ?? infoContext;
      if (contextToUse) {
        this.dialog?.setBindingContext(contextToUse);
      }
    }

    /**
     * Manages the execution(s) of the action.
     * @param innerParameters The parameters of the action
     * @returns The promise.
     */;
    _proto.executeActionOnApply = async function executeActionOnApply(innerParameters) {
      let errorOnFirstIteration;
      let failedContexts = [];
      const dialog = this.dialog;

      //Execute the action
      try {
        this.result = await this.executeAction(innerParameters, this.parameters.aContexts, false);
        if (this.result.find(result => result.status === "rejected")) {
          throw new Error("At least one action failed");
        }
        this.close();
      } catch (error) {
        if (this.strictHandlingUtilities.is412Executed && this.strictHandlingUtilities.strictHandlingTransitionFails.length) {
          this.strictHandlingUtilities.delaySuccessMessages = this.strictHandlingUtilities.delaySuccessMessages.concat(Messaging.getMessageModel().getData());
        }
        errorOnFirstIteration = error;
      }

      //Retry the action execution in case of strict handling and if there is at least one failed context (give it another try to succeed)
      if (this.strictHandlingUtilities.is412Executed && this.strictHandlingUtilities.strictHandlingTransitionFails.length) {
        try {
          failedContexts = this.strictHandlingUtilities.strictHandlingTransitionFails.map(fail => fail.oAction.getContext());
          innerParameters.aContexts = failedContexts;
          this.result = await this.executeAction(innerParameters, this.parameters.aContexts, true);
          if (this.result.find(result => result.status === "rejected")) {
            throw new Error("At least one action failed on the second iteration");
          }
        } catch {
          const isDialogOpen = dialog.isOpen();
          if (this.strictHandlingUtilities.is412Executed && this.strictHandlingUtilities.strictHandlingTransitionFails.length) {
            Messaging.addMessages(this.strictHandlingUtilities.delaySuccessMessages);
          }
          await this.messageHandler.showMessageDialog({
            isActionParameterDialogOpen: isDialogOpen,
            forceShowUIElement: isDialogOpen,
            onBeforeShowMessage: (messages, showMessageParametersIn) => {
              return this.callbacks.beforeShowingMessage(innerParameters, this.parameters.aContexts, dialog, messages, showMessageParametersIn, !!this.parameters.bGrouped && (!!this.strictHandlingUtilities.strictHandlingPromises.length || messageHandling.hasTransitionErrorsOrWarnings()));
            },
            aSelectedContexts: undefined,
            // not used at all
            sActionName: this.parameters.label
          });
        }
      }
      return {
        errorOnFirstIteration,
        failedContexts
      };
    }

    /**
     * Manages the messages of the action.
     * @param failedContexts The contexts of the failed action
     * @returns The promise.
     */;
    _proto.manageMessageOnApply = async function manageMessageOnApply(failedContexts) {
      const dialog = this.dialog;
      let isDialogMessage = true;
      const showGenericErrorMessageForChangeSet = !!(this.parameters.bGrouped && (this.strictHandlingUtilities.strictHandlingPromises.length || messageHandling.hasTransitionErrorsOrWarnings()));
      await this.messageHandler.showMessages({
        context: failedContexts[0],
        // only used in case of failed context to reset in messageHandling showMessagesInUI
        isActionParameterDialogOpen: dialog.isOpen(),
        forceShowUIElement: dialog.isOpen(),
        messagePageNavigationCallback: () => {
          this.close();
        },
        onBeforeShowMessage: (aMessages, showMessageParametersIn) => {
          const showMessageParameters = this.callbacks.beforeShowingMessage(this.parameters, this.parameters.aContexts, dialog, aMessages, showMessageParametersIn, showGenericErrorMessageForChangeSet);
          isDialogMessage = showMessageParameters.showMessageDialog;
          return showMessageParameters;
        },
        aSelectedContexts: undefined,
        // not used at all!
        sActionName: this.parameters.label,
        control: dialog.getParent()
      });
      return isDialogMessage;
    }

    /**
     * Cleans after the execution of the action.
     *
     */;
    _proto.afterOnApply = function afterOnApply() {
      this.messageHandler.clearStrictWarningMessages();
      this.strictHandlingUtilities = {
        is412Executed: false,
        strictHandlingTransitionFails: [],
        strictHandlingPromises: [],
        strictHandlingWarningMessages: [],
        delaySuccessMessages: [],
        processedMessageIds: new Set()
      };
      if (this.dialog && BusyLocker.isLocked(this.dialog)) {
        BusyLocker.unlock(this.dialog);
      }
    }

    /**
     * Manages the execution of the action.
     * @param parameters The parameters of the action
     * @param contexts The contexts of the action
     * @param after412 Flag to indicate if the action is executed after a 412 error
     * @returns The promise.
     */;
    _proto.executeAction = async function executeAction(parameters, contexts, after412) {
      const dialog = this.dialog;
      const results = await new ODataOperation(this.action, parameters, this.messageHandler, this.strictHandlingUtilities, {
        ignoreETag: this.ignoreETag
      }).execute();
      const modelMessages = Messaging.getMessageModel().getData();
      const failedTransitionsWith412 = this.strictHandlingUtilities.is412Executed && this.strictHandlingUtilities.strictHandlingTransitionFails.length;
      const showGenericErrorMessageForChangeSet = !!this.parameters.bGrouped && (this.strictHandlingUtilities.strictHandlingPromises.length > 0 || messageHandling.hasTransitionErrorsOrWarnings());
      let attachEvent = modelMessages.length > 0;
      if (failedTransitionsWith412) {
        if (!after412) {
          this.strictHandlingUtilities.delaySuccessMessages = this.strictHandlingUtilities.delaySuccessMessages.concat(modelMessages);
          attachEvent = false;
        } else {
          Messaging.addMessages(this.strictHandlingUtilities.delaySuccessMessages);
        }
      }
      if (attachEvent) {
        dialog.attachEventOnce("afterClose", () => {
          const isDialogOpen = dialog.isOpen();
          this.messageHandler.showMessageDialog({
            isActionParameterDialogOpen: failedTransitionsWith412 ? undefined : isDialogOpen,
            forceShowUIElement: failedTransitionsWith412 ? undefined : isDialogOpen,
            onBeforeShowMessage: (messages, showMessageParametersIn) => {
              return this.callbacks.beforeShowingMessage(parameters, contexts, dialog, messages, showMessageParametersIn, showGenericErrorMessageForChangeSet, true);
            },
            control: dialog.getParent(),
            aSelectedContexts: parameters.aContexts,
            sActionName: parameters.label
          });
        });
      }
      return results;
    }

    /**
     * Closes the dialog.
     */;
    _proto.close = function close() {
      if (this.dialog) {
        this.dialog.close();
      }
    }

    /**
     * Opens the dialog.
     * @param owner The owner of the dialog
     * @returns The promise of the action result.
     */;
    _proto.openDialog = async function openDialog(owner) {
      if (!this.dialog) {
        throw new Error("Error on opening the dialog");
      }
      await CommonUtils.setUserDefaults(this.parameters.appComponent, this.actionParameterInfos.map(actionParameterInfo => actionParameterInfo.parameter), this.parameterModel, true);
      this.setModels(this.dialog);
      owner.addDependent(this.dialog);
      await this.setOperationDefaultValues(this.dialog);
      this.dialog.open();
      return this.dialogPromise;
    }

    /**
     * Sets the model configuration for the dialog.
     * @param dialog The owner of the dialog
     */;
    _proto.setModels = function setModels(dialog) {
      dialog.setModel(this.parameterModel, "paramsModel");
      dialog.bindElement({
        path: "/",
        model: "paramsModel"
      });
      dialog.setModel(this.parameters.model);
      dialog.bindElement({
        path: `${this.parameters.aContexts.length ? "" : "/"}${this.actionName}(...)`
      });
      if (this.parameters.aContexts.length) {
        dialog.setBindingContext(this.parameters.aContexts[0]); // use context of first selected line item
      }
      // empty model to add elements dynamically depending on number of MVF fields defined on the dialog
      dialog.setModel(new JSONModel({}), "mvfview");
    }

    /**
     * Removes the messages before opening the dialog.
     * @param _event
     */;
    _proto.beforeOpen = function beforeOpen(_event) {
      this.messageHandler.removeTransitionMessages();
    }

    /**
     * Gets the default values for a parameter.
     * @param parameter The parameter
     * @param bindingParameter The binding parameter
     * @param dialog The dialog
     * @returns The promise of the default values.
     */;
    _proto.getParameterDefaultValue = async function getParameterDefaultValue(parameter, bindingParameter, dialog) {
      const operationBinding = dialog.getObjectBinding();
      const parameterModelData = this.parameterModel.getData();
      const paramName = parameter.name;
      const defaultValue = parameter.annotations.UI?.ParameterDefaultValue;
      // Case 1: There is a ParameterDefaultValue annotation
      if (defaultValue) {
        if (this.parameters.aContexts.length > 0 && isPathAnnotationExpression(defaultValue)) {
          try {
            const pathForContext = bindingParameter && defaultValue.path.startsWith(`${bindingParameter}/`) ? defaultValue.path.replace(`${bindingParameter}/`, "") : defaultValue.path;
            let paramValue = await CommonUtils.requestSingletonProperty(defaultValue.path, operationBinding.getModel());
            if (paramValue === null) {
              paramValue = await operationBinding.getParameterContext().requestProperty(defaultValue.path);
            }
            if (this.parameters.aContexts.length > 1) {
              // For multi select, need to loop over aContexts (as contexts cannot be retrieved via binding parameter of the operation binding)

              if (this.parameters.aContexts.some(context => context.getProperty(pathForContext) !== paramValue)) {
                // if the values from the contexts are not all the same, do not prefill
                return {
                  paramName,
                  value: undefined,
                  noPossibleValue: true
                };
              }
            }
            return {
              paramName,
              value: paramValue
            };
          } catch (error) {
            Log.error("Error while reading default action parameter", paramName, this.action.name);
            return {
              paramName,
              value: undefined,
              latePropertyError: true
            };
          }
        } else {
          // Case 1.2: ParameterDefaultValue defines a fixed string value (i.e. vParamDefaultValue = 'someString')
          return {
            paramName,
            value: defaultValue.valueOf()
          };
        }
      }
      return {
        paramName,
        value: parameterModelData[paramName]
      };
    }

    /**
     * Gets the manifest values.
     * @returns The promise of the manifest values.
     */;
    _proto.getManifestFunctionValues = async function getManifestFunctionValues() {
      const bindingContext = this.dialog?.getBindingContext();
      if (!this.view || !this.parameters.defaultValuesExtensionFunction || !bindingContext) {
        return {};
      }
      return FPMHelper.loadModuleAndCallMethod(this.parameters.defaultValuesExtensionFunction.substring(0, this.parameters.defaultValuesExtensionFunction.lastIndexOf(".") || -1).replace(/\./gi, "/"), this.parameters.defaultValuesExtensionFunction.substring(this.parameters.defaultValuesExtensionFunction.lastIndexOf(".") + 1, this.parameters.defaultValuesExtensionFunction.length), this.view, bindingContext, this.parameters.aContexts);
    }

    /**
     * Gets the predefined values for the parameters.
     * @param bindingParameter The binding parameter
     * @param dialog The dialog
     * @returns The promise containing all predefined values.
     */;
    _proto.getPreDefinedValues = async function getPreDefinedValues(bindingParameter, dialog) {
      const boundFunctionName = this.action.annotations.Common?.DefaultValuesFunction?.valueOf();
      let requestContextObject = Promise.resolve({});
      let functionParams = [];
      if (this.action.isBound) {
        if (typeof boundFunctionName === "string") {
          functionParams = this.parameters.aContexts.map(async context => operations.callBoundFunction(boundFunctionName, context, context.getModel()));
        }
        if (this.parameters.aContexts.length > 0) {
          requestContextObject = this.parameters.aContexts[0].requestObject();
        }
      }
      try {
        const contextValues = await requestContextObject;
        const promises = await Promise.all([Promise.all(this.actionParameterInfos.map(async actionParameterInfo => this.getParameterDefaultValue(actionParameterInfo.parameter, bindingParameter, dialog))), Promise.all(functionParams), this.getManifestFunctionValues()]);
        return {
          contextValues,
          defaultValues: promises[0],
          functionValues: promises[1],
          manifestFunctionValues: promises[2]
        };
      } catch (error) {
        Log.error("Error while retrieving the parameter", error);
        // Remove messages relating to the function for default values as they aren't helpful for a user
        this.messageHandler.removeTransitionMessages();
        return {
          contextValues: {},
          defaultValues: [],
          functionValues: [],
          manifestFunctionValues: {}
        };
      }
    }

    /**
     * Callback when the dialog is opened. Sets the focus on the first field without opening the VH dialog.
     */;
    _proto.afterOpen = function afterOpen() {
      const firstVisibleParameter = this.actionParameterInfos.find(parameterInfo => parameterInfo.field.getVisible());
      if (firstVisibleParameter) {
        const firstField = firstVisibleParameter?.field;
        const focusInfo = firstField?.getFocusInfo();
        focusInfo.targetInfo = {
          silent: true
        };
        firstField?.focus(focusInfo);
      }
    }

    /**
     * Registers the action parameter info.
     * @param actionParameters The action parameters
     * @param fields The fields
     */;
    _proto.registerActionParameterInfo = function registerActionParameterInfo(dialogContents) {
      //Register the field
      dialogContents.forEach(dialogContent => {
        const parameter = dialogContent?.parameter;
        const field = dialogContent?.formElements?.[1];
        this.actionParameterInfos.push({
          parameter,
          field,
          isMultiValue: parameter.isCollection,
          hasError: false
        });
      });
    }

    /**
     * Sets the default values for the parameters.
     * @param dialog The dialog
     * @returns The promise.
     */;
    _proto.setOperationDefaultValues = async function setOperationDefaultValues(dialog) {
      const bindingParameter = this.action.isBound ? this.action.parameters[0].name : "";
      const {
        contextValues,
        defaultValues,
        functionValues,
        manifestFunctionValues
      } = await this.getPreDefinedValues(bindingParameter, dialog);
      const operationBinding = dialog.getObjectBinding();
      if (bindingParameter) {
        operationBinding.setParameter(bindingParameter, contextValues);
      }
      for (const i in this.actionParameterInfos) {
        if (this.actionParameterInfos[i].parameter.name !== "ResultIsActiveEntity") {
          const parameterName = this.actionParameterInfos[i].parameter.name;
          // Parameter values provided in the call of invokeAction overrule other sources
          const parameterProvidedValue = this.parameterValues?.find(element => element.name === parameterName)?.value;
          if (parameterProvidedValue) {
            operationBinding.setParameter(parameterName, parameterProvidedValue);
          } else if (manifestFunctionValues.hasOwnProperty(parameterName)) {
            operationBinding.setParameter(parameterName, manifestFunctionValues[parameterName]);
          } else if (defaultValues[i] && defaultValues[i].value !== undefined) {
            operationBinding.setParameter(parameterName, defaultValues[i].value);
          } else if (this.action.annotations.Common?.DefaultValuesFunction && !defaultValues[i].noPossibleValue) {
            const setOfFunctionValues = new Set(this.parameters.aContexts.map((context, index) => functionValues[index].getObject(parameterName)));
            if (setOfFunctionValues.size === 1) {
              //param values are all the same:
              operationBinding.setParameter(parameterName, Array.from(setOfFunctionValues)[0]);
            }
          }
        }
      }

      // If at least one Default Property is a Late Property and an eTag error was raised.
      if (defaultValues.some(value => value.latePropertyError)) {
        const refresh = this.resourceModel.getText("C_COMMON_SAPFE_REFRESH");
        MessageBox.warning(getResourceModel(this.parameters.appComponent).getText("C_APP_COMPONENT_SAPFE_ETAG_LATE_PROPERTY"), {
          actions: [refresh, MessageBox.Action.OK],
          emphasizedAction: refresh,
          onClose: action => {
            if (action === refresh) {
              const extensionAPI = this.view?.getController().getExtensionAPI();
              extensionAPI.refresh();
            }
          },
          contentWidth: "25em"
        });
      }
    }

    /**
     * Manages the close of the dialog.
     * @param event The event
     */;
    _proto.afterClose = function afterClose(event) {
      // when the dialog is cancelled, messages need to be removed in case the same action should be executed again
      const origin = event.getParameter("origin");
      for (const i in this.actionParameterInfos) {
        this.removeMessagesForParameter(this.actionParameterInfos[i].parameter);
      }
      if (origin === null || origin === this.dialog?.getEndButton()) {
        // Escape or Cancel button
        this._fnReject(FELibrary.Constants.CancelActionDialog);
      } else {
        this._fnResolve(this.result);
      }
      this.dialog?.destroy();
      this.buttonLock = false; //needed here, not in the press events finally clause. In case the UI is sluggish, begin button could be pressed again.
    };
    return ActionParameterDialog;
  }();
  _exports = ActionParameterDialog;
  return _exports;
}, false);
//# sourceMappingURL=ParameterDialog-dbg.js.map
