import type { PrimitiveType } from "@sap-ux/vocabularies-types";
import { type Action, type ActionParameter } from "@sap-ux/vocabularies-types";
import { type PropertyAnnotations_Core } from "@sap-ux/vocabularies-types/vocabularies/Core_Edm";
import Log from "sap/base/Log";
import {
	compileExpression,
	constant,
	equal,
	getExpressionFromAnnotation,
	ifElse,
	not,
	type BindingToolkitExpression
} from "sap/fe/base/BindingToolkit";
import type { ActionParameterInfo } from "sap/fe/core/ActionRuntime";
import ActionRuntime from "sap/fe/core/ActionRuntime";
import type { FEView } from "sap/fe/core/BaseController";
import CommonUtils from "sap/fe/core/CommonUtils";
import type ResourceModel from "sap/fe/core/ResourceModel";
import BusyLocker from "sap/fe/core/controllerextensions/BusyLocker";
import type MessageHandler from "sap/fe/core/controllerextensions/MessageHandler";
import type { OperationResult } from "sap/fe/core/controllerextensions/editFlow/ODataOperation";
import ODataOperation from "sap/fe/core/controllerextensions/editFlow/ODataOperation";
import UiModelConstants from "sap/fe/core/controllerextensions/editFlow/editFlowConstants";
import type { ShowActionDialogParameters } from "sap/fe/core/controllerextensions/editFlow/operations/facade";
import operations from "sap/fe/core/controllerextensions/editFlow/operations/facade";
import type { ShowMessageParameters } from "sap/fe/core/controllerextensions/messageHandler/messageHandling";
import messageHandling from "sap/fe/core/controllerextensions/messageHandler/messageHandling";
import { convertTypes, getInvolvedDataModelObjects } from "sap/fe/core/converters/MetaModelConverter";
import FPMHelper from "sap/fe/core/helpers/FPMHelper";
import { getResourceModel } from "sap/fe/core/helpers/ResourceModelHelper";
import { generate } from "sap/fe/core/helpers/StableIdHelper";
import { isPathAnnotationExpression } from "sap/fe/core/helpers/TypeGuards";
import FELibrary from "sap/fe/core/library";
import type { StrictHandlingUtilities } from "sap/fe/core/operationsHelper";
import { getTargetNavigationPath } from "sap/fe/core/templating/DataModelPathHelper";
import { isActionParameterRequiredExpression, isDisabledExpression, isReadOnlyExpression } from "sap/fe/core/templating/FieldControlHelper";
import { hasValueHelp, isMultiLineText } from "sap/fe/core/templating/PropertyHelper";
import FieldHelper from "sap/fe/macros/field/FieldHelper";
import { requiresValidation, useCaseSensitiveFilterRequests } from "sap/fe/macros/internal/valuehelp/ValueHelpTemplating";
import type ListReportExtensionAPI from "sap/fe/templates/ListReport/ExtensionAPI";
import type ObjectPageExtensionAPI from "sap/fe/templates/ObjectPage/ExtensionAPI";
import Button from "sap/m/Button";
import type { Dialog$AfterCloseEvent, Dialog$BeforeOpenEvent } from "sap/m/Dialog";
import Dialog from "sap/m/Dialog";
import Label from "sap/m/Label";
import MessageBox from "sap/m/MessageBox";
import type Control from "sap/ui/core/Control";
import Messaging from "sap/ui/core/Messaging";
import type Message from "sap/ui/core/message/Message";
import MessageType from "sap/ui/core/message/MessageType";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import type { Field$ChangeEvent } from "sap/ui/mdc/Field";
import Field from "sap/ui/mdc/Field";
import type { MultiValueField$ChangeEvent } from "sap/ui/mdc/MultiValueField";
import MultiValueField from "sap/ui/mdc/MultiValueField";
import ValueHelp from "sap/ui/mdc/ValueHelp";
import FieldEditMode from "sap/ui/mdc/enums/FieldEditMode";
import MultiValueFieldItem from "sap/ui/mdc/field/MultiValueFieldItem";
import VHDialog from "sap/ui/mdc/valuehelp/Dialog";
import Popover from "sap/ui/mdc/valuehelp/Popover";
import MTable from "sap/ui/mdc/valuehelp/content/MTable";
import type Context from "sap/ui/model/Context";
import JSONModel from "sap/ui/model/json/JSONModel";
import AnnotationHelper from "sap/ui/model/odata/v4/AnnotationHelper";
import type { default as ODataV4Context } from "sap/ui/model/odata/v4/Context";
import type ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import type ODataMetaModel from "sap/ui/model/odata/v4/ODataMetaModel";

type ParameterDefaultValue = { paramName: string; value: unknown; latePropertyError?: boolean; noPossibleValue?: boolean };

type FormElementType = [Label, Field | MultiValueField];

type DialogContentTypes = {
	formElements: FormElementType;
	parameter: ActionParameter;
};
export default class ActionParameterDialog {
	private readonly dialogPromise: Promise<PromiseSettledResult<OperationResult>[]>;

	private _fnResolve!: (resolveValue: PromiseSettledResult<OperationResult>[]) => void;

	private _fnReject!: (error: unknown) => void;

	private dialog: Dialog | undefined;

	private readonly actionName: string;

	private buttonLock = false;

	private readonly metaModel: ODataMetaModel;

	private actionParameterInfos: (ActionParameterInfo & { parameter: ActionParameter })[] = [];

	private result: PromiseSettledResult<OperationResult>[] = [];

	private parameterModel: JSONModel = new JSONModel({
		$displayMode: {}
	});

	private readonly resourceModel: ResourceModel;

	constructor(
		private action: Action,
		private actionContext: Context,
		private parameters: ShowActionDialogParameters,
		private parameterValues: Record<string, unknown>[] | undefined,
		private entitySetName: string | undefined,
		private view: FEView | null,
		private messageHandler: MessageHandler,
		private strictHandlingUtilities: StrictHandlingUtilities,
		private callbacks: {
			beforeShowingMessage: (
				mParameters: ShowActionDialogParameters,
				aContexts: ODataV4Context[],
				oDialog: Dialog | undefined,
				messages: Message[],
				showMessageParametersIn: ShowMessageParameters,
				showGenericErrorMessageForChangeSet: boolean,
				isActionSuccessful?: boolean
			) => ShowMessageParameters;
		},

		private ignoreETag?: boolean
	) {
		this.actionName = this.action.isBound
			? this.action.fullyQualifiedName.replace(/\(.*\)$/g, "") // remove the part related to the overlay
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
	private getParameterEditMode(parameter: ActionParameter): BindingToolkitExpression<FieldEditMode> {
		const annotations = parameter.annotations,
			fieldControl = annotations.Common?.FieldControl,
			immutable = (annotations.Core as unknown as PropertyAnnotations_Core)?.Immutable?.valueOf(),
			computed = (annotations.Core as unknown as PropertyAnnotations_Core)?.Computed?.valueOf();

		if (immutable || computed) {
			return constant(FieldEditMode.ReadOnly);
		} else if (fieldControl) {
			return ifElse(
				isReadOnlyExpression(parameter),
				FieldEditMode.ReadOnly,
				ifElse(isDisabledExpression(parameter), FieldEditMode.Disabled, FieldEditMode.Editable)
			);
		}
		return constant(FieldEditMode.Editable);
	}

	/**
	 * Creates the form element control for a parameter.
	 * @param parameter The parameter
	 * @returns The form element control.
	 */
	private async createFormElement(parameter: ActionParameter): Promise<FormElementType> {
		const actionMetaPath = this.metaModel.getMetaPath(this.actionContext.getPath());
		const metaContext = this.metaModel.createBindingContext(CommonUtils.getParameterPath(actionMetaPath, parameter.name))!;
		const field = await (parameter.isCollection
			? this.createMultiField(parameter, metaContext)
			: this.createField(parameter, metaContext));
		return (
			<>
				<Label
					id={generate(["APD_", parameter.name, "Label"])}
					text={
						parameter.annotations.Common?.Label
							? this.resourceModel.getText(parameter.annotations.Common.Label.toString())
							: parameter.name
					}
				/>
				{field}
			</>
		);
	}

	/**
	 * Creates the multi field control for a parameter.
	 * @param parameter The parameter
	 * @param parameterContext The parameter context
	 * @returns The multi value field control.
	 */
	private async createMultiField(parameter: ActionParameter, parameterContext: Context): Promise<MultiValueField> {
		const display = await FieldHelper.getAPDialogDisplayFormat(parameterContext.getObject(), { context: parameterContext });
		return (
			<MultiValueField
				id={generate(["APD_", parameter.name])}
				placeholder={parameter.annotations.UI?.Placeholder}
				items={{ path: `mvfview>/${parameter.name}` }}
				delegate={{ name: "sap/fe/core/controls/MultiValueParameterDelegate" }}
				display={display}
				editMode={this.getParameterEditMode(parameter)}
				width="100%"
				multipleLines={parameter.annotations.UI?.MultiLineText?.valueOf() === true}
				required={compileExpression(isActionParameterRequiredExpression(parameter, this.action, convertTypes(this.metaModel)))}
				valueHelp={hasValueHelp(parameter) ? generate([this.actionName, parameter.name]) : undefined}
				change={async (e): Promise<void> => this.handleFieldChange(e, parameter)}
				visible={compileExpression(not(equal(getExpressionFromAnnotation(parameter.annotations?.UI?.Hidden), true)))}
				ariaLabelledBy={[generate(["APD_", parameter.name, "Label"])]}
				dependents={this.createParameterDialogValueHelp(parameter, parameterContext)}
			>
				<MultiValueFieldItem key="{path: 'mvfview>Key', type:'sap.ui.model.type.String'}" description="{mvfview>Desc}" />
			</MultiValueField>
		);
	}

	/**
	 * Creates the field control for a parameter.
	 * @param parameter The parameter
	 * @param parameterContext The parameter context
	 * @returns The field control.
	 */
	private async createField(parameter: ActionParameter, parameterContext: Context): Promise<Field> {
		const display = await FieldHelper.getAPDialogDisplayFormat(parameterContext.getObject(), { context: parameterContext });
		return (
			<Field
				delegate={{ name: "sap/fe/macros/field/FieldBaseDelegate", payload: { retrieveTextFromValueList: true } }}
				id={generate(["APD_", parameter.name])}
				value={AnnotationHelper.format(parameterContext.getObject(), { context: parameterContext })}
				placeholder={parameter.annotations.UI?.Placeholder}
				display={display}
				editMode={this.getParameterEditMode(parameter)}
				width="100%"
				multipleLines={isMultiLineText(parameter)}
				required={compileExpression(isActionParameterRequiredExpression(parameter, this.action, convertTypes(this.metaModel)))}
				change={async (e): Promise<void> => this.handleFieldChange(e, parameter)}
				valueHelp={hasValueHelp(parameter) ? generate([this.actionName, parameter.name]) : undefined}
				dependents={this.createParameterDialogValueHelp(parameter, parameterContext)}
				visible={compileExpression(
					ifElse(
						parameter.name === "ResultIsActiveEntity",
						false,
						not(equal(getExpressionFromAnnotation(parameter.annotations?.UI?.Hidden), true))
					)
				)}
				ariaLabelledBy={[generate(["APD_", parameter.name, "Label"])]}
			/>
		);
	}

	/**
	 * Creates the valueHelp  for a parameter.
	 * @param parameter The parameter
	 * @param parameterContext The parameter context
	 * @returns A valueHelp if the parameter has a VH, undefined otherwise
	 */
	private createParameterDialogValueHelp(parameter: ActionParameter, parameterContext: Context): ValueHelp | undefined {
		if (!hasValueHelp(parameter)) {
			return undefined;
		}
		return (
			<ValueHelp
				id={generate([this.actionName, parameter.name])}
				delegate={{
					name: "sap/fe/macros/valuehelp/ValueHelpDelegate",
					payload: {
						propertyPath: this.action.isBound
							? `${getTargetNavigationPath(getInvolvedDataModelObjects<ActionParameter>(parameterContext))}/${
									this.actionName
							  }/${parameter.name}`
							: `/${this.action.name.substring(this.action.name.lastIndexOf(".") + 1)}/${parameter.name}`,
						qualifiers: {},
						valueHelpQualifier: ""
					}
				}}
				validateInput={requiresValidation(parameter)}
				typeahead={
					<Popover>
						<MTable
							id={generate([this.actionName, parameter.name, "Popover", "qualifier"])}
							caseSensitive={
								this.action.isBound
									? useCaseSensitiveFilterRequests(
											getInvolvedDataModelObjects<ActionParameter>(parameterContext),
											(convertTypes(this.metaModel).entityContainer.annotations.Capabilities
												?.FilterFunctions as unknown as string[]) ?? []
									  )
									: false
							}
							useAsValueHelp={!!parameter.annotations.Common?.ValueListWithFixedValues}
						/>
					</Popover>
				}
				dialog={this.createFieldVHDialog(parameter)}
			></ValueHelp>
		);
	}

	/**
	 * Creates the ValueHelp dialog for a parameter.
	 * @param parameter The parameter
	 * @returns A dialog if the parameter has a VH, undefined otherwise
	 */
	private createFieldVHDialog(parameter: ActionParameter): VHDialog | undefined {
		if (parameter.annotations.Common?.ValueListWithFixedValues?.valueOf() !== true) {
			return <VHDialog />;
		} else {
			return undefined;
		}
	}

	/**
	 * Handles the field change event for a parameter.
	 * @param event The ui5 event
	 * @param parameter The parameter
	 * @returns Promise.
	 */
	private async handleFieldChange(event: MultiValueField$ChangeEvent | Field$ChangeEvent, parameter: ActionParameter): Promise<void> {
		const fieldPromise = (event as Field$ChangeEvent).getParameter("promise");
		const field = (event as Field$ChangeEvent).getSource() as Field | MultiValueField;
		const parameterInfo = this.actionParameterInfos.find((actionParameterInfo) => actionParameterInfo.field === field);
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
			ActionRuntime._addMessageForActionParameter([
				{
					actionParameterInfo: parameterInfo,
					message: (error as { message: string }).message
				}
			]);
		}
	}

	/**
	 * Removes the messages for a parameter.
	 * @param parameter The parameter
	 */
	private removeMessagesForParameter(parameter: ActionParameter): void {
		const messages = Messaging.getMessageModel().getData();
		const controlId = generate(["APD_", parameter.name]);
		// also remove messages assigned to inner controls, but avoid removing messages for different parameters (with name being substring of another parameter name)
		const relevantMessages = messages.filter((msg: Message) =>
			msg.getControlIds().some((id: string) => controlId.split("-").includes(id))
		);
		Messaging.removeMessages(relevantMessages);
	}

	/**
	 * gets the FormElements along with the array of parameters.
	 * @param parameter The parameter
	 * @returns The parameter information along with the FormElements.
	 */
	private async getFormElements(parameter: ActionParameter): Promise<DialogContentTypes> {
		const formElements = await this.createFormElement(parameter);
		return {
			formElements: formElements,
			parameter: parameter
		};
	}

	/**
	 * Creates the action parameter dialog.
	 * @returns The dialog.
	 */
	async createDialog(): Promise<Dialog> {
		const actionParameters = this.action.isBound ? this.action.parameters.slice(1) : this.action.parameters;
		// In case of deffered create we have no view, so we need to get the resource model from the app component

		const dialogContentsWithParameters = await Promise.all(actionParameters.map(this.getFormElements.bind(this)));
		const dialogContents = dialogContentsWithParameters.map((dialogContent) => {
			return dialogContent.formElements;
		});
		this.registerActionParameterInfo(dialogContentsWithParameters);
		const endButton = (
			<Button
				id={generate(["fe", "APD_", this.actionName, "Action", "Cancel"])}
				text={this.resourceModel.getText("C_COMMON_ACTION_PARAMETER_DIALOG_CANCEL")}
				press={this.close.bind(this)}
			/>
		);
		const dialog = (
			<Dialog
				title={this.getTitleText(this.parameters.label)}
				id={generate(["fe", "APD_", this.actionName])}
				escapeHandler={this.close.bind(this)}
				afterClose={this.afterClose.bind(this)}
				beforeOpen={this.beforeOpen.bind(this)}
				afterOpen={(): void => {
					this.afterOpen();
				}}
				initialFocus={endButton} // The initial focus is set programmatically in afterOpen, to avoid opening the VH dialog
			>
				{{
					beginButton: (
						<Button
							id={generate(["fe", "APD_", this.actionName, "Action", "Ok"])}
							text={
								this.parameters.isCreateAction
									? this.resourceModel.getText("C_TRANSACTION_HELPER_SAPFE_ACTION_CREATE_BUTTON_CONTINUE")
									: this.getBeginButtonLabel(this.parameters.label)
							}
							press={(): void => {
								this.onApply.bind(this)();
							}}
							type="Emphasized"
						/>
					),
					endButton: endButton,
					content: (
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore (unknown property binding)
						<SimpleForm binding={"$Parameter"}>{{ content: dialogContents }}</SimpleForm>
					)
				}}
			</Dialog>
		);
		this.dialog = dialog;
		return dialog;
	}

	/**
	 * Gets the label for the begin button of the dialog.
	 * @param actionLabel The label of the action
	 * @returns The label.
	 */
	private getBeginButtonLabel(actionLabel: string | undefined): string {
		const key = "ACTION_PARAMETER_DIALOG_ACTION_NAME";
		const defaultKey = "C_COMMON_DIALOG_OK";
		return this.getOverriddenText(key, defaultKey, actionLabel);
	}

	/**
	 * Gets the title of the dialog.
	 * @param actionLabel The label of the action
	 * @returns The title.
	 */
	private getTitleText(actionLabel: string | undefined): string {
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
	 */
	private getOverriddenText(key: string, defaultKey: string, actionLabel?: string): string {
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
	 */
	private async onApply(): Promise<void> {
		// prevent multiple press events. The BusyLocker is not fast enough. (BCP: 2370130210)
		if (this.buttonLock || !this.dialog) {
			return;
		}
		const dialog = this.dialog;

		const innerParameters = { ...this.parameters };
		const parameterContext = (dialog.getObjectBinding() as ODataContextBinding | undefined)?.getParameterContext();
		const newValuesDictionary = Object.assign(
			{},
			...this.actionParameterInfos.map((actionParameterInfos) => {
				const parameter = actionParameterInfos.parameter;
				const value = parameter.isCollection
					? Object.values((dialog.getModel("mvfview") as JSONModel).getProperty(`/${parameter.name}`) ?? {}).map(
							(value) => (value as { Key?: PrimitiveType })?.Key
					  )
					: parameterContext?.getProperty(parameter.name);
				return { [parameter.name]: value };
			})
		) as Record<string, PrimitiveType>;
		const isNewValue = Object.values(newValuesDictionary).some((value) => !!value);

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

		const { errorOnFirstIteration, failedContexts } = await this.executeActionOnApply(innerParameters);

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
	 */
	updateDialogBindingContextForError(contexts: ODataV4Context[]): void {
		if (contexts.length < 2) {
			// We would need to switch the binding context of the dialog only when we have multiple contexts for executing the action.
			return;
		}

		let warningContext: ODataV4Context | undefined, infoContext: ODataV4Context | undefined;
		const erroneousCtx = contexts.find((ctx) => {
			const messages = ctx.getMessages();
			return messages.some((msg) => {
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
	 */
	private async executeActionOnApply(
		innerParameters: ShowActionDialogParameters
	): Promise<{ errorOnFirstIteration: unknown; failedContexts: ODataV4Context[] }> {
		let errorOnFirstIteration: unknown;
		let failedContexts: ODataV4Context[] = [];
		const dialog = this.dialog!;

		//Execute the action
		try {
			this.result = await this.executeAction(innerParameters, this.parameters.aContexts, false);
			if (this.result.find((result) => result.status === "rejected")) {
				throw new Error("At least one action failed");
			}
			this.close();
		} catch (error: unknown) {
			if (this.strictHandlingUtilities.is412Executed && this.strictHandlingUtilities.strictHandlingTransitionFails.length) {
				this.strictHandlingUtilities.delaySuccessMessages = this.strictHandlingUtilities.delaySuccessMessages.concat(
					Messaging.getMessageModel().getData()
				);
			}
			errorOnFirstIteration = error;
		}

		//Retry the action execution in case of strict handling and if there is at least one failed context (give it another try to succeed)
		if (this.strictHandlingUtilities.is412Executed && this.strictHandlingUtilities.strictHandlingTransitionFails.length) {
			try {
				failedContexts = this.strictHandlingUtilities.strictHandlingTransitionFails.map(
					(fail) => fail.oAction.getContext() as ODataV4Context
				);
				innerParameters.aContexts = failedContexts;
				this.result = await this.executeAction(innerParameters, this.parameters.aContexts, true);
				if (this.result.find((result) => result.status === "rejected")) {
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
					onBeforeShowMessage: (messages: Message[], showMessageParametersIn: ShowMessageParameters) => {
						return this.callbacks.beforeShowingMessage(
							innerParameters,
							this.parameters.aContexts,
							dialog,
							messages,
							showMessageParametersIn,
							!!this.parameters.bGrouped &&
								(!!this.strictHandlingUtilities.strictHandlingPromises.length ||
									messageHandling.hasTransitionErrorsOrWarnings())
						);
					},
					aSelectedContexts: undefined, // not used at all
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
	 */
	private async manageMessageOnApply(failedContexts: ODataV4Context[]): Promise<boolean> {
		const dialog = this.dialog!;
		let isDialogMessage: boolean | undefined = true;
		const showGenericErrorMessageForChangeSet = !!(
			this.parameters.bGrouped &&
			(this.strictHandlingUtilities.strictHandlingPromises.length || messageHandling.hasTransitionErrorsOrWarnings())
		);

		await this.messageHandler.showMessages({
			context: failedContexts[0], // only used in case of failed context to reset in messageHandling showMessagesInUI
			isActionParameterDialogOpen: dialog.isOpen(),
			forceShowUIElement: dialog.isOpen(),
			messagePageNavigationCallback: () => {
				this.close();
			},
			onBeforeShowMessage: (aMessages: Message[], showMessageParametersIn: ShowMessageParameters) => {
				const showMessageParameters = this.callbacks.beforeShowingMessage(
					this.parameters,
					this.parameters.aContexts,
					dialog,
					aMessages,
					showMessageParametersIn,
					showGenericErrorMessageForChangeSet
				);
				isDialogMessage = showMessageParameters.showMessageDialog;
				return showMessageParameters;
			},
			aSelectedContexts: undefined, // not used at all!
			sActionName: this.parameters.label,
			control: dialog.getParent() as Control
		});
		return isDialogMessage;
	}

	/**
	 * Cleans after the execution of the action.
	 *
	 */
	private afterOnApply(): void {
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
	 */
	private async executeAction(
		parameters: ShowActionDialogParameters,
		contexts: ODataV4Context[],
		after412: boolean
	): Promise<PromiseSettledResult<OperationResult>[]> {
		const dialog = this.dialog!;
		const results = await new ODataOperation(this.action, parameters, this.messageHandler, this.strictHandlingUtilities, {
			ignoreETag: this.ignoreETag
		}).execute();
		const modelMessages = Messaging.getMessageModel().getData();
		const failedTransitionsWith412 =
			this.strictHandlingUtilities.is412Executed && this.strictHandlingUtilities.strictHandlingTransitionFails.length;

		const showGenericErrorMessageForChangeSet =
			!!this.parameters.bGrouped &&
			(this.strictHandlingUtilities.strictHandlingPromises.length > 0 || messageHandling.hasTransitionErrorsOrWarnings());
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
					onBeforeShowMessage: (messages: Message[], showMessageParametersIn: ShowMessageParameters) => {
						return this.callbacks.beforeShowingMessage(
							parameters,
							contexts,
							dialog,
							messages,
							showMessageParametersIn,
							showGenericErrorMessageForChangeSet,
							true
						);
					},
					control: dialog.getParent() as Control,
					aSelectedContexts: parameters.aContexts,
					sActionName: parameters.label
				});
			});
		}
		return results;
	}

	/**
	 * Closes the dialog.
	 */
	private close(): void {
		if (this.dialog) {
			this.dialog.close();
		}
	}

	/**
	 * Opens the dialog.
	 * @param owner The owner of the dialog
	 * @returns The promise of the action result.
	 */
	async openDialog(owner: Control): Promise<PromiseSettledResult<OperationResult>[]> {
		if (!this.dialog) {
			throw new Error("Error on opening the dialog");
		}
		await CommonUtils.setUserDefaults(
			this.parameters.appComponent,
			this.actionParameterInfos.map((actionParameterInfo) => actionParameterInfo.parameter),
			this.parameterModel,
			true
		);

		this.setModels(this.dialog);
		owner.addDependent(this.dialog);
		await this.setOperationDefaultValues(this.dialog);
		this.dialog.open();
		return this.dialogPromise;
	}

	/**
	 * Sets the model configuration for the dialog.
	 * @param dialog The owner of the dialog
	 */
	private setModels(dialog: Dialog): void {
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
	 */
	private beforeOpen(_event: Dialog$BeforeOpenEvent): void {
		this.messageHandler.removeTransitionMessages();
	}

	/**
	 * Gets the default values for a parameter.
	 * @param parameter The parameter
	 * @param bindingParameter The binding parameter
	 * @param dialog The dialog
	 * @returns The promise of the default values.
	 */
	private async getParameterDefaultValue(
		parameter: ActionParameter,
		bindingParameter: string,
		dialog: Dialog
	): Promise<ParameterDefaultValue> {
		const operationBinding = dialog.getObjectBinding() as ODataContextBinding;
		const parameterModelData = this.parameterModel.getData();
		const paramName = parameter.name;
		const defaultValue = parameter.annotations.UI?.ParameterDefaultValue;
		// Case 1: There is a ParameterDefaultValue annotation
		if (defaultValue) {
			if (this.parameters.aContexts.length > 0 && isPathAnnotationExpression(defaultValue)) {
				try {
					const pathForContext: string =
						bindingParameter && defaultValue.path.startsWith(`${bindingParameter}/`)
							? defaultValue.path.replace(`${bindingParameter}/`, "")
							: defaultValue.path;
					let paramValue = await CommonUtils.requestSingletonProperty(defaultValue.path, operationBinding.getModel());
					if (paramValue === null) {
						paramValue = await operationBinding.getParameterContext().requestProperty(defaultValue.path);
					}
					if (this.parameters.aContexts.length > 1) {
						// For multi select, need to loop over aContexts (as contexts cannot be retrieved via binding parameter of the operation binding)

						if (this.parameters.aContexts.some((context) => context.getProperty(pathForContext) !== paramValue)) {
							// if the values from the contexts are not all the same, do not prefill
							return {
								paramName,
								value: undefined,
								noPossibleValue: true
							};
						}
					}
					return { paramName, value: paramValue };
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
				return { paramName, value: defaultValue.valueOf() };
			}
		}
		return { paramName, value: parameterModelData[paramName] };
	}

	/**
	 * Gets the manifest values.
	 * @returns The promise of the manifest values.
	 */
	private async getManifestFunctionValues(): Promise<Record<string, unknown>> {
		const bindingContext = this.dialog?.getBindingContext();
		if (!this.view || !this.parameters.defaultValuesExtensionFunction || !bindingContext) {
			return {};
		}

		return FPMHelper.loadModuleAndCallMethod(
			this.parameters.defaultValuesExtensionFunction
				.substring(0, this.parameters.defaultValuesExtensionFunction.lastIndexOf(".") || -1)
				.replace(/\./gi, "/"),
			this.parameters.defaultValuesExtensionFunction.substring(
				this.parameters.defaultValuesExtensionFunction.lastIndexOf(".") + 1,
				this.parameters.defaultValuesExtensionFunction.length
			),
			this.view,
			bindingContext,
			this.parameters.aContexts
		) as Promise<Record<string, unknown>>;
	}

	/**
	 * Gets the predefined values for the parameters.
	 * @param bindingParameter The binding parameter
	 * @param dialog The dialog
	 * @returns The promise containing all predefined values.
	 */
	private async getPreDefinedValues(
		bindingParameter: string,
		dialog: Dialog
	): Promise<{
		contextValues: Record<string, unknown>;
		defaultValues: ParameterDefaultValue[];
		functionValues: ODataV4Context[];
		manifestFunctionValues: Record<string, unknown>;
	}> {
		const boundFunctionName = this.action.annotations.Common?.DefaultValuesFunction?.valueOf();
		let requestContextObject: Promise<Record<string, unknown>> = Promise.resolve({});
		let functionParams: Promise<ODataV4Context>[] = [];
		if (this.action.isBound) {
			if (typeof boundFunctionName === "string") {
				functionParams = this.parameters.aContexts.map(async (context) =>
					operations.callBoundFunction(boundFunctionName, context, context.getModel())
				);
			}
			if (this.parameters.aContexts.length > 0) {
				requestContextObject = this.parameters.aContexts[0].requestObject();
			}
		}

		try {
			const contextValues = await requestContextObject;

			const promises = await Promise.all([
				Promise.all(
					this.actionParameterInfos.map(async (actionParameterInfo) =>
						this.getParameterDefaultValue(actionParameterInfo.parameter, bindingParameter, dialog)
					)
				),
				Promise.all(functionParams),
				this.getManifestFunctionValues()
			]);
			return {
				contextValues,
				defaultValues: promises[0],
				functionValues: promises[1],
				manifestFunctionValues: promises[2]
			};
		} catch (error: unknown) {
			Log.error("Error while retrieving the parameter", error as string);
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
	 */
	private afterOpen(): void {
		const firstVisibleParameter = this.actionParameterInfos.find((parameterInfo) => parameterInfo.field.getVisible());
		if (firstVisibleParameter) {
			const firstField = firstVisibleParameter?.field;
			const focusInfo = firstField?.getFocusInfo() as { targetInfo: object };
			focusInfo.targetInfo = { silent: true };
			firstField?.focus(focusInfo);
		}
	}

	/**
	 * Registers the action parameter info.
	 * @param actionParameters The action parameters
	 * @param fields The fields
	 */
	private registerActionParameterInfo(dialogContents: DialogContentTypes[]): void {
		//Register the field
		dialogContents.forEach((dialogContent) => {
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
	 */
	private async setOperationDefaultValues(dialog: Dialog): Promise<void> {
		const bindingParameter = this.action.isBound ? this.action.parameters[0].name : "";
		const { contextValues, defaultValues, functionValues, manifestFunctionValues } = await this.getPreDefinedValues(
			bindingParameter,
			dialog
		);
		const operationBinding = dialog.getObjectBinding() as ODataContextBinding;

		if (bindingParameter) {
			operationBinding.setParameter(bindingParameter, contextValues);
		}

		for (const i in this.actionParameterInfos) {
			if (this.actionParameterInfos[i].parameter.name !== "ResultIsActiveEntity") {
				const parameterName = this.actionParameterInfos[i].parameter.name;
				// Parameter values provided in the call of invokeAction overrule other sources
				const parameterProvidedValue = this.parameterValues?.find((element) => element.name === parameterName)?.value;
				if (parameterProvidedValue) {
					operationBinding.setParameter(parameterName, parameterProvidedValue);
				} else if (manifestFunctionValues.hasOwnProperty(parameterName)) {
					operationBinding.setParameter(parameterName, manifestFunctionValues[parameterName]);
				} else if (defaultValues[i] && defaultValues[i].value !== undefined) {
					operationBinding.setParameter(parameterName, defaultValues[i].value);
				} else if (this.action.annotations.Common?.DefaultValuesFunction && !defaultValues[i].noPossibleValue) {
					const setOfFunctionValues = new Set<string>(
						this.parameters.aContexts.map((context, index) => functionValues[index].getObject(parameterName))
					);
					if (setOfFunctionValues.size === 1) {
						//param values are all the same:
						operationBinding.setParameter(parameterName, Array.from(setOfFunctionValues)[0]);
					}
				}
			}
		}

		// If at least one Default Property is a Late Property and an eTag error was raised.
		if (defaultValues.some((value) => value.latePropertyError)) {
			const refresh = this.resourceModel.getText("C_COMMON_SAPFE_REFRESH");
			MessageBox.warning(getResourceModel(this.parameters.appComponent).getText("C_APP_COMPONENT_SAPFE_ETAG_LATE_PROPERTY"), {
				actions: [refresh, MessageBox.Action.OK],
				emphasizedAction: refresh,
				onClose: (action: string) => {
					if (action === refresh) {
						const extensionAPI = this.view?.getController().getExtensionAPI();
						(extensionAPI as ListReportExtensionAPI | ObjectPageExtensionAPI).refresh();
					}
				},
				contentWidth: "25em"
			} as object);
		}
	}

	/**
	 * Manages the close of the dialog.
	 * @param event The event
	 */
	private afterClose(event: Dialog$AfterCloseEvent): void {
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
	}
}
