/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Log from "sap/base/Log";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ComboBox from "sap/m/ComboBox";
import Dialog from "sap/m/Dialog";
import MessageBox from "sap/m/MessageBox";
import Text from "sap/m/Text";
import TextArea from "sap/m/TextArea";
import { ButtonType } from "sap/m/library";
import Event from "sap/ui/base/Event";
import BaseObject from "sap/ui/base/Object";
import Control from "sap/ui/core/Control";
import Element from "sap/ui/core/Element";
import Fragment from "sap/ui/core/Fragment";
import { ValueState } from "sap/ui/core/library";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import { Task } from "../TaskPanel";
import { Response, TaskPriority } from "../ToDoPanel";
import DataFormatUtils from "./DataFormatUtils";

enum ReasonRequired {
	Required = "REQUIRED",
	Optional = "OPTIONAL"
}

export interface DecisionOption {
	SAP__Origin: string;
	InstanceID: string;
	Nature: ButtonType;
	DecisionKey: string;
	CommentMandatory: boolean;
	DecisionText: string;
	ReasonRequired: ReasonRequired;
}

interface ReasonOption {
	[key: string]: string;
}

interface ReasonOptionSettings {
	show: boolean;
	required: boolean;
	reasonOptions?: ReasonOption[];
}

interface DecisionDialogSettings {
	badgeIcon: string;
	badgeValueState: string;
	showNote: boolean;
	noteMandatory: boolean;
	question: string;
	title: string;
	confirmButtonLabel: string;
	textAreaLabel: string;
	priorityText: string;
	showFeedbackMessage: boolean;
	reasonOptionsSettings: ReasonOptionSettings;
	confirmActionHandler: (note: string, reasonCode: string) => void;
	cancelActionHandler: () => void;
}

interface IDecisionDialog extends Dialog {
	_bClosedViaButton: boolean;
}

interface DialogSettings {
	dialogSettings: DecisionDialogSettings;
	submitButtonEnabled: boolean;
}

interface ODataError {
	response: {
		body: string;
	};
	responseText: string;
	error: {
		message: {
			value: string;
		};
	};
}

interface MultiSelectDecisionResult {
	[key: string]: DecisionOption[];
}

export interface ActionButton {
	type: ButtonType;
	text: string;
	pressHandler: (refresh: Refresh) => Promise<void> | void;
}

interface Refresh {
	(forceRefresh: boolean): void;
}

const decideButtonNature = (decisionOption: DecisionOption): ButtonType => {
	switch (decisionOption.Nature?.toUpperCase()) {
		case "POSITIVE":
			return ButtonType.Accept;
		case "NEGATIVE":
			return ButtonType.Reject;
		case "NEUTRAL":
			return ButtonType.Neutral;
		default:
			return ButtonType.Default;
	}
};

const getActionButton = (decisionOption: DecisionOption, i18nBundle: ResourceBundle, task: Task, baseUrl: string): ActionButton => {
	return {
		text: decisionOption.DecisionText,
		type: decideButtonNature(decisionOption) || ButtonType.Default,
		pressHandler: DecisionDialog.decisionDialogMethod.bind(null, decisionOption, i18nBundle, task, baseUrl)
	};
};

/**
 * Gets the icon frame badge based on the task priority.
 *
 * This method returns a specific badge string for tasks with high or very high priority.
 * For tasks with lower priorities, it returns an empty string.
 *
 * @param {TaskPriority} priority - The priority level of the task.
 * @returns {string} The badge string for high priority tasks, or an empty string for others.
 */
export function getIconFrameBadge(priority: TaskPriority): string {
	let iconBadge = "";
	if (priority === TaskPriority.VERY_HIGH || priority === TaskPriority.HIGH) {
		iconBadge = "sap-icon://high-priority";
	}

	return iconBadge;
}

/**
 * Converts a priority string to a Priority enum value.
 * If the priority string is not recognized, it returns the default value "None".
 *
 * @param {TaskPriority} priority - The priority string to convert.
 * @returns {ValueState} The corresponding Priority enum value.
 */
export function getIconFrameBadgeValueState(priority: TaskPriority): ValueState {
	return priority === TaskPriority.VERY_HIGH || priority === TaskPriority.HIGH ? ValueState.Error : ValueState.None;
}

/**
 *
 * Helper class for Decision Dialog handling.
 *
 * @extends BaseObject
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @internal
 * @experimental Since 1.121
 * @private
 *
 * @alias sap.cux.home.utils.DecisionDialog
 */
export default class DecisionDialog extends BaseObject {
	private decisionOption: DecisionOption;
	private i18nBundle: ResourceBundle;
	private refreshView: Refresh;
	private task: Task;
	private confirmationDialogPromise!: Promise<IDecisionDialog>;
	private confirmationDialogModel!: JSONModel;
	private dataServiceModel!: ODataModel;
	private baseUrl: string;

	constructor(decisionOption: DecisionOption, i18nBundle: ResourceBundle, task: Task, baseUrl: string, refreshView: Refresh) {
		super();
		this.decisionOption = decisionOption;
		this.i18nBundle = i18nBundle;
		this.baseUrl = baseUrl;
		this.refreshView = refreshView;
		this.task = task;
	}

	/**
	 * Handles the change event of the reason option ComboBox.
	 *
	 * @private
	 * @param {Event} event - The event object.
	 * @returns {void}
	 */
	public handleReasonOptionChange(event: Event): void {
		const comboBox = event.getSource<ComboBox>();
		const comboBoxValue = comboBox.getValue();
		const selectedItem = comboBox.getSelectedItem();

		this.confirmationDialogPromise
			.then((confirmationDialog) => {
				const comboBoxRequired = (this.confirmationDialogModel.getData() as DialogSettings).dialogSettings.reasonOptionsSettings
					.required;
				// Set the tooltip useful when the currently selected item's text is truncated
				comboBox.setTooltip(comboBoxValue);
				comboBox.setValueState(selectedItem === null ? ValueState.Error : ValueState.None);

				// Special case where if reason options is optional and all
				// the text is deleted value state should be none (corner case)
				if (!comboBoxRequired && comboBoxValue === "") {
					comboBox.setValueState(ValueState.None);
				}

				// Special case where if value in combo box gets partially deleted by the user
				// there is no selection yet button is not disabled
				if (!comboBoxRequired && comboBoxValue !== "" && selectedItem === null) {
					confirmationDialog.getBeginButton().setEnabled(false);
					return;
				}

				// Update the submit button state (disabled / enabled)
				this._toggleSubmitButtonState();
			})
			.catch((error: unknown) => {
				Log.error(error instanceof Error ? error.message : String(error));
			});
	}

	/**
	 * Toggles the state of the submit button based on the dialog settings.
	 *
	 * @private
	 * @returns {void}
	 */
	public _toggleSubmitButtonState(): void {
		const dialogData = this.confirmationDialogModel.getData() as DialogSettings;
		const noteRequired = dialogData.dialogSettings.noteMandatory;

		const noteFilled = (Element.getElementById("confirmDialogTextarea") as TextArea).getValue().trim().length > 0;
		const comboBoxRequired = dialogData.dialogSettings.reasonOptionsSettings.required;

		const comboBoxFilled = (Element.getElementById("reasonOptionsSelect") as ComboBox).getSelectedItem() !== null;
		const noteFlag = (noteRequired && noteFilled) || !noteRequired;
		const comboBoxFlag = (comboBoxRequired && comboBoxFilled) || !comboBoxRequired;

		this.confirmationDialogModel.setProperty("/submitButtonEnabled", noteFlag && comboBoxFlag);
	}

	/**
	 * Reads reason options from the backend.
	 *
	 * @private
	 * @param {string} origin - The SAP origin.
	 * @param {string} instance - The instance ID.
	 * @param {string} decisionKey - The decision key.
	 * @param {Function} onSuccess - The success callback function.
	 * @param {Function} onError - The error callback function.
	 * @returns {void}
	 */
	private readReasonOptions(
		origin: string,
		instance: string,
		decisionKey: string,
		onSuccess: (arg: ReasonOption[]) => void,
		onError: (arg: unknown) => void
	): void {
		const sPath = "/ReasonOptions";
		const oUrlParams = {
			SAP__Origin: `'${origin}'`,
			InstanceID: `'${instance}'`,
			DecisionKey: `'${decisionKey}'`
		};
		const fnSuccess = (oData: Response) => {
			if (oData && oData.results) {
				if (onSuccess) {
					onSuccess(oData.results as ReasonOption[]);
				}
			}
		};
		const fnError = (oError: unknown) => {
			if (onError) {
				onError(oError);
			}
		};

		this.dataServiceModel.read(sPath, {
			urlParameters: oUrlParams,
			success: fnSuccess,
			error: fnError,
			groupId: "reasonOptions"
		});
	}

	/**
	 * Load the reason options which are part of this decision option.
	 *
	 * @private
	 * @returns {Promise<ReasonOptionSettings | null>} - containing resolved array of reason options
	 */
	private async loadReasonOptions(): Promise<ReasonOptionSettings | null> {
		const metaModel = this.dataServiceModel.getMetaModel();
		await metaModel.loaded();

		if (metaModel.getODataFunctionImport("ReasonOptions")) {
			return new Promise((resolve, reject) => {
				this.readReasonOptions(
					this.decisionOption.SAP__Origin,
					this.decisionOption.InstanceID,
					this.decisionOption.DecisionKey,
					(reasonOptions: ReasonOption[]) => {
						const reasonOptionsSettings = {
							show:
								(this.decisionOption.ReasonRequired === ReasonRequired.Required ||
									this.decisionOption.ReasonRequired === ReasonRequired.Optional) &&
								reasonOptions.length > 0,
							required: this.decisionOption.ReasonRequired === ReasonRequired.Required,
							reasonOptions: reasonOptions
						};

						resolve(reasonOptionsSettings);
					},
					(oError) => {
						reject(oError as Error);
					}
				);
			});
		} else {
			return null;
		}
	}

	/**
	 * Open the decision dialog for the inbox task selected.
	 *
	 * @private
	 * @param {DecisionDialogSettings} dialogSettings - contains the settings for the decision dialog
	 */
	private openDecisionDialog(dialogSettings: DecisionDialogSettings) {
		this.confirmationDialogModel = new JSONModel({
			submitButtonEnabled: !dialogSettings?.noteMandatory && !dialogSettings?.reasonOptionsSettings?.required,
			dialogSettings
		});

		this.confirmationDialogPromise = Fragment.load({
			type: "XML",
			name: "sap.cux.home.utils.fragment.showDecisionDialog",
			controller: this
		})
			.then((confirmationDialogFragment: Control | Control[]) => {
				const confirmationDialog = confirmationDialogFragment as IDecisionDialog;
				const i18nModel = new ResourceModel({ bundle: this.i18nBundle });
				const priorityText = Element.getElementById("task-priority-text") as Text;
				priorityText.addStyleClass(this.task.Priority);

				confirmationDialog.setModel(this.confirmationDialogModel);
				confirmationDialog.setModel(i18nModel, "i18n");
				confirmationDialog.open();
				return confirmationDialog;
			})
			.catch((error: unknown) => {
				Log.error(error instanceof Error ? error.message : String(error));
			}) as Promise<IDecisionDialog>;
	}

	/**
	 * Submit handler for the decision dialog
	 *
	 * @private
	 */
	public confirmActionHandler(): void {
		this.confirmationDialogPromise
			.then((confirmationDialog) => {
				const dialogSettings = (confirmationDialog.getModel()?.getProperty("/") as DialogSettings).dialogSettings;
				const reasonOptionsSettings = dialogSettings.reasonOptionsSettings;

				// Get the reason option value from the combo box
				const reasonOptionSelectedItem = reasonOptionsSettings.show
					? (Element.getElementById("reasonOptionsSelect") as ComboBox)?.getSelectedItem()
					: null;
				const reasonCode = (
					reasonOptionSelectedItem !== null && reasonOptionSelectedItem?.getKey() !== "defaultSelectedKey"
						? reasonOptionSelectedItem.getKey()
						: null
				) as string;

				// Get the note value from the text area
				const note = (
					dialogSettings.showNote ? (Element.getElementById("confirmDialogTextarea") as TextArea)?.getValue() : null
				) as string;
				dialogSettings.confirmActionHandler(note, reasonCode);
			})
			.catch((error: unknown) => {
				Log.error(error instanceof Error ? error.message : String(error));
			});
	}

	/**
	 * Handler for cancel action in the decision dialog
	 *
	 * @private
	 */
	public handleCancel() {
		this.confirmationDialogPromise
			.then((confirmationDialog) => {
				const dialogSettings = (confirmationDialog.getModel()?.getProperty("/") as DialogSettings).dialogSettings;
				confirmationDialog._bClosedViaButton = true;
				confirmationDialog.close();
				dialogSettings.cancelActionHandler();

				if (this.confirmationDialogModel.getProperty("/dialogSettings/showFeedbackMessage")) {
					this.dataServiceModel.refresh();
					this.refreshView(true);
				}
			})
			.catch((error: unknown) => {
				Log.error(error instanceof Error ? error.message : String(error));
			});
	}

	/**
	 * After close dialog handler in the decision dialog
	 *
	 * @private
	 */
	public handleAfterClose() {
		this.confirmationDialogPromise
			.then((confirmationDialog) => {
				if (confirmationDialog._bClosedViaButton) {
					// dialog is closed via button
					confirmationDialog._bClosedViaButton = false;
				} else {
					// dialog is closed by other means (e.g. pressing Escape)
					const dialogSettings = (confirmationDialog.getModel()?.getProperty("/") as DialogSettings).dialogSettings;
					dialogSettings.cancelActionHandler();
				}
				confirmationDialog.destroy();
			})
			.catch((error: unknown) => {
				Log.error(error instanceof Error ? error.message : String(error));
			});
	}

	/**
	 * Creates an OData request with the specified parameters.
	 *
	 * @private
	 * @param {string} path - The path of the OData request.
	 * @param {Record<string, string>} urlParams - The URL parameters of the request.
	 * @param {Function} fnSuccess - The success callback function.
	 * @param {Function} fnError - The error callback function.
	 * @returns {void}
	 */
	private createODataRequest(
		path: string,
		urlParams: Record<string, string>,
		fnSuccess: (data: unknown, response: unknown) => void,
		fnError: (error: ODataError) => void
	): void {
		const settings = {
			success: (data: unknown, response: unknown) => {
				Log.info("successful action");
				fnSuccess?.(data, response);
			},
			error: (error: ODataError) => {
				const message = this.i18nBundle.getText("DataManager.HTTPRequestFailed");
				const details = error.response ? error.response.body : null;
				const parameters = {
					message: message,
					responseText: details as string
				};
				this.dataServiceModel.fireRequestFailed(parameters);
				fnError(error);
			},
			urlParameters: urlParams
		};

		this.dataServiceModel.create(path, {}, settings);
	}

	/**
	 * Sends an action to the backend.
	 *
	 * @private
	 * @param {string} importName - The name of the function import or action.
	 * @param {DecisionOption} decision - The decision option.
	 * @param {string} note - The note to be included with the action.
	 * @param {string} reasonOptionCode - The reason option code.
	 * @param {Task} task - The task associated with the action.
	 * @returns {void}
	 */
	private sendAction(importName: string, decision: DecisionOption, note: string, reasonOptionCode: string, task: Task): void {
		const urlParams: Record<string, string> = {
			SAP__Origin: `'${task.SAP__Origin}'`,
			InstanceID: `'${task.InstanceID}'`
		};

		if (decision.DecisionKey) {
			urlParams.DecisionKey = `'${decision.DecisionKey}'`;
		}

		if (note?.length > 0) {
			urlParams.Comments = `'${note}'`;
		}

		if (reasonOptionCode) {
			urlParams.ReasonCode = `'${reasonOptionCode}'`;
		}

		const onSuccess = () => {
			this.confirmationDialogPromise
				.then((confirmationDialog) => {
					confirmationDialog.setBusy(false);
					this.confirmationDialogModel.setProperty("/dialogSettings/showFeedbackMessage", true);
				})
				.catch((error: unknown) => {
					Log.error(error instanceof Error ? error.message : String(error));
				});
		};

		const onError = (error: ODataError) => {
			if (error.responseText) {
				const oError = JSON.parse(error.responseText) as ODataError;
				MessageBox.error(oError?.error?.message?.value);
			}
			this.handleCancel();
		};

		this.createODataRequest(`/${importName}`, urlParams, onSuccess, onError);
	}

	/**
	 * Shows the decision dialog.
	 *
	 * @private
	 * @returns {Promise<void>}
	 */
	private async showDecisionDialog(): Promise<void> {
		this.dataServiceModel = this.dataServiceModel || new ODataModel(this.baseUrl);
		const { TaskTitle: title, Priority } = this.task;
		const decisionDialogSettings: DecisionDialogSettings = {
			noteMandatory: this.decisionOption.CommentMandatory,
			question: this.i18nBundle.getText("XMSG_DECISION_QUESTION", [this.decisionOption.DecisionText]) as string,
			title,
			badgeIcon: getIconFrameBadge(Priority),
			badgeValueState: getIconFrameBadgeValueState(Priority),
			priorityText: this.i18nBundle.getText(DataFormatUtils.toTaskPriorityText(Priority)) as string,
			confirmButtonLabel: this.i18nBundle.getText("XBUT_SUBMIT") as string,
			showNote: true,
			showFeedbackMessage: false,
			reasonOptionsSettings: {
				show: false,
				required: false
			},
			textAreaLabel: this.i18nBundle.getText("XFLD_TextArea_Decision") as string,
			confirmActionHandler: (note, reasonOptionKey) => {
				this.sendAction("Decision", this.decisionOption, note, reasonOptionKey, this.task);
			},
			cancelActionHandler: () => {}
		};

		try {
			await this.dataServiceModel.metadataLoaded();
			const reasonOptionsLoadedPromise =
				this.decisionOption?.ReasonRequired === ReasonRequired.Required ||
				this.decisionOption?.ReasonRequired === ReasonRequired.Optional
					? this.loadReasonOptions()
					: null;

			// reason options won't be loaded
			if (!reasonOptionsLoadedPromise) {
				this.openDecisionDialog(decisionDialogSettings);
			} else {
				// based on reasonOptionsLoadedPromise, reason options will be loaded
				reasonOptionsLoadedPromise
					.then((reasonOptionsSettings: ReasonOptionSettings | null) => {
						if (reasonOptionsSettings !== null) {
							decisionDialogSettings.reasonOptionsSettings = reasonOptionsSettings;

							// In case of optional reason option combo box, a (None) option is created as to have a default selection
							if (
								decisionDialogSettings.reasonOptionsSettings?.reasonOptions &&
								!decisionDialogSettings.reasonOptionsSettings?.required
							) {
								const noneText = `(${this.i18nBundle.getText("XSEL_DECISION_REASON_NONE_OPTION")})`;
								decisionDialogSettings.reasonOptionsSettings.reasonOptions.unshift({
									Name: noneText,
									Code: "defaultSelectedKey"
								});
							}

							this.openDecisionDialog(decisionDialogSettings);
						}
					})
					.catch(() => {
						Log.error("Could not load the reason options properly");
					});
			}
		} catch {
			Log.error("Could not load metadata model for inbox");
		}
	}

	/**
	 * Initiates the decisionDialog
	 *
	 * @static
	 * @param {DecisionOption} decisionOption - Decision Option
	 * @param {ResourceModel} i18nBundle - The resource bundle for internationalization.
	 * @param {Task} task - Task Instance
	 * @param {Refresh} refresh - Refresh function
	 */
	static decisionDialogMethod(decisionOption: DecisionOption, i18nBundle: ResourceBundle, task: Task, baseUrl: string, refresh: Refresh) {
		const dialogUtils = new DecisionDialog(decisionOption, i18nBundle, task, baseUrl, refresh);
		return dialogUtils.showDecisionDialog();
	}

	/**
	 * Retrieves task actions based on the task and multi-select decision results.
	 *
	 * @static
	 * @param {Task} task - The task for which actions are retrieved.
	 * @param {string} baseUrl - The base URL.
	 * @param {MultiSelectDecisionResult} multiSelectDecisionResults - The multi-select decision results.
	 * @param {ResourceBundle} i18nBundle - The resource bundle for internationalization.
	 * @returns {ActionButton[]} An array of action buttons.
	 */
	static getTaskActions(
		task: Task,
		baseUrl: string,
		multiSelectDecisionResults: MultiSelectDecisionResult,
		i18nBundle: ResourceBundle
	): ActionButton[] {
		const actions: ActionButton[] = [];
		const displayedTypes = new Set<string>();
		const multiSelectDecisionOptions = multiSelectDecisionResults[task.SAP__Origin + task.TaskDefinitionID];

		if (multiSelectDecisionOptions) {
			for (const decisionOption of multiSelectDecisionOptions) {
				if (!displayedTypes.has(decisionOption.Nature) || !decisionOption.Nature) {
					actions.push(getActionButton(decisionOption, i18nBundle, task, baseUrl));
					displayedTypes.add(decisionOption.Nature);
				} else {
					const action = getActionButton(decisionOption, i18nBundle, task, baseUrl);
					action.type = ButtonType.Default;
					actions.push(action);
				}
			}
		}

		return actions;
	}
}
