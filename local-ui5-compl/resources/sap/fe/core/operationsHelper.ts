import Log from "sap/base/Log";
import type { InternalModelContext } from "sap/fe/core/helpers/ModelHelper";
import type TableAPI from "sap/fe/macros/table/TableAPI";
import type Dialog from "sap/m/Dialog";
import MessageBox from "sap/m/MessageBox";
import Message from "sap/ui/core/message/Message";
import MessageType from "sap/ui/core/message/MessageType";
import type Control from "sap/ui/mdc/Control";
import JSONModel from "sap/ui/model/json/JSONModel";
import type Context from "sap/ui/model/odata/v4/Context";
import type ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import type ODataModel from "sap/ui/model/odata/v4/ODataModel";
import type AppComponent from "./AppComponent";
import type MessageHandler from "./controllerextensions/MessageHandler";
import OperationsDialog from "./controllerextensions/dialog/OperationsDialog";
import messageHandling from "./controllerextensions/messageHandler/messageHandling";
import ResourceModelHelper from "./helpers/ResourceModelHelper";

type StrictHandlingPromise = {
	resolve: Function;
	groupId: string;
	requestSideEffects?: Function;
};
export type StrictHandlingParameters = {
	appComponent: AppComponent;
	label: string;
	model: ODataModel;
	internalModelContext?: InternalModelContext | null;
	control?: Control;
	requestSideEffects?: Function;
	oDialog?: Dialog;
	bGrouped: boolean;
};
type OperationsHelper = {
	renderMessageView: Function;
	fnOnStrictHandlingFailed: Function;
};

export type StrictHandlingUtilities = {
	is412Executed: boolean;
	strictHandlingTransitionFails: {
		oAction: ODataContextBinding;
		groupId: string;
	}[];
	strictHandlingPromises: StrictHandlingPromise[];
	strictHandlingWarningMessages: Message[];
	delaySuccessMessages: Message[];
	processedMessageIds: Set<string>;
};

function renderMessageView(
	parameters: StrictHandlingParameters,
	messageHandler: MessageHandler | undefined,
	messages: Message[],
	strictHandlingUtilities: StrictHandlingUtilities | undefined,
	isMultiContext412?: boolean,
	resolve?: Function,
	groupId?: string,
	isUnboundAction?: boolean
): void {
	if (!messages.length) {
		return;
	}
	const resourceModel = ResourceModelHelper.getResourceModel(parameters.appComponent);
	const actionName = ResourceModelHelper.getLocalizedText(parameters.label, parameters.appComponent);
	const model = parameters.model;
	const strictHandlingPromises = strictHandlingUtilities?.strictHandlingPromises ?? [];
	let message: string;
	let cancelButtonTxt: string = resourceModel.getText("C_COMMON_DIALOG_CANCEL");
	let warningMessageText = "";
	let genericChangesetMessage = "";
	warningMessageText = parameters.bGrouped
		? resourceModel.getText("C_COMMON_DIALOG_CANCEL_MESSAGE_TEXT", [actionName])
		: resourceModel.getText("C_COMMON_DIALOG_SKIP_SINGLE_MESSAGE_TEXT");
	if (messages.length === 1) {
		const messageText = messages[0].getMessage();
		const identifierText = messages[0].getAdditionalText();
		genericChangesetMessage = resourceModel.getText("C_COMMON_DIALOG_CANCEL_SINGLE_MESSAGE_TEXT");
		if (!isMultiContext412) {
			message = `${messageText}\n${resourceModel.getText("PROCEED")}`;
		} else if (identifierText !== undefined && identifierText !== "") {
			cancelButtonTxt = parameters.bGrouped ? cancelButtonTxt : resourceModel.getText("C_COMMON_DIALOG_SKIP");
			const headerInfoTypeName = (parameters.control?.getParent() as TableAPI | undefined)?.getTableDefinition().headerInfoTypeName;
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
			onClose: (action: string) => {
				if (action === actionName) {
					if (isUnboundAction) {
						// condition is true for unbound as well as static actions
						resolve?.(true);
						model.submitBatch(groupId!);
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
						} as object);
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
		warningMessage = parameters.bGrouped
			? resourceModel.getText("C_COMMON_DIALOG_CANCEL_MESSAGES_WARNING")
			: resourceModel.getText("C_COMMON_DIALOG_SKIP_MESSAGES_WARNING");
		warningDesc = parameters.bGrouped
			? resourceModel.getText("C_COMMON_DIALOG_CANCEL_MESSAGES_TEXT", [actionName])
			: resourceModel.getText("C_COMMON_DIALOG_SKIP_MESSAGES_TEXT", [actionName]);
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
		showMessageInfo: (): void => {
			MessageBox.information(resourceModel.getText("M_CHANGESET_CANCEL_MESSAGES"), {
				contentWidth: "150px"
			} as object);
		}
	}).open();
}

async function fnOnStrictHandlingFailed(
	groupId: string,
	parameters: StrictHandlingParameters,
	currentContextIndex: number | null,
	context: Context | null,
	contextLength: number | null,
	messageHandler: MessageHandler,
	strictHandlingUtilities: StrictHandlingUtilities | undefined,
	internalOperationsPromiseResolve: Function | undefined,
	messages412: Message[] = []
): Promise<boolean> {
	// Find error message in the 412 response and raise warning.
	const filteredErrorMessages = messageHandler.filterErrorMessages(messages412);
	messages412.forEach((message) => {
		if (filteredErrorMessages.includes(message)) {
			Log.warning(
				"Warning: 412 ('Pre-condition Check Failed due to strict-handling') returns messages of type error but only warning messages are appropriate!"
			);
		}
	});

	messageHandler.addWarningMessagesToMessageHandler(messages412);
	let shPromiseParams: StrictHandlingPromise | undefined;

	if ((currentContextIndex === null && contextLength === null) || (currentContextIndex === 1 && contextLength === 1)) {
		return new Promise((resolve) => {
			operationsHelper.renderMessageView(
				parameters,
				messageHandler,
				messages412,
				strictHandlingUtilities,
				false,
				resolve,
				groupId,
				true
			);
		});
	}
	const strictHandlingPromise = new Promise<boolean>(function (resolve) {
		shPromiseParams = {
			requestSideEffects: parameters.requestSideEffects,
			resolve: resolve,
			groupId: groupId
		};
	});

	strictHandlingUtilities?.strictHandlingPromises.push(shPromiseParams as StrictHandlingPromise);

	if (messages412.length && strictHandlingUtilities) {
		// copy existing 412 warning messages
		const strictHandlingWarningMessages: Message[] = strictHandlingUtilities.strictHandlingWarningMessages;
		let value = "";
		// If there is more than one context we need the identifier. This would fix if the action is triggered via table chevron
		if (contextLength && contextLength > 1) {
			const tableAPI = parameters.control?.getParent() as TableAPI;
			const column = tableAPI && tableAPI.isA("sap.fe.macros.table.TableAPI") && (tableAPI.getIdentifierColumn() as string);
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

const operationsHelper: OperationsHelper = {
	renderMessageView: renderMessageView,
	fnOnStrictHandlingFailed: fnOnStrictHandlingFailed
};

export default operationsHelper;
