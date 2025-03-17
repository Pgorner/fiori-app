import type { Action } from "@sap-ux/vocabularies-types";
import type AppComponent from "sap/fe/core/AppComponent";
import type Dialog from "sap/m/Dialog";
import type Event from "sap/ui/base/Event";
import type Control from "sap/ui/core/Control";
import type Message from "sap/ui/core/message/Message";
import type { default as Context, default as ODataV4Context } from "sap/ui/model/odata/v4/Context";
import type { FEView } from "./BaseController";
import type MessageHandler from "./controllerextensions/MessageHandler";
import type { OperationResult } from "./controllerextensions/editFlow/ODataOperation";
import type { ShowActionDialogParameters } from "./controllerextensions/editFlow/operations/facade";
import type { ShowMessageParameters } from "./controllerextensions/messageHandler/messageHandling";
import type { StrictHandlingUtilities } from "./operationsHelper";

export type ExitDialogEvent = Event<{
	accept: boolean;
}>;

export interface StandardDialog {
	openDialog(): void;
	closeDialog(): void;
	setBusy(busy: boolean): void;
	attachExitDialog(data: object, handler: (e: ExitDialogEvent) => void, listener?: object): void;
	isOpen(): boolean;
	displayErrorMessages(messages: Message[]): void;
}

export interface StandardParameterDialog {
	createDialog(): Promise<Dialog>;
	openDialog(owner: Control): Promise<PromiseSettledResult<OperationResult>[]>;
}

export interface CoreUIFactory {
	newCreateDialog(
		contextToUpdate: ODataV4Context,
		fieldNames: string[],
		appComponent: AppComponent,
		mode: "Standalone" | "WithNavigation",
		parentControl?: Control
	): StandardDialog;
	newParameterDialog(
		action: Action,
		actionContext: Context,
		parameters: ShowActionDialogParameters,
		parameterValues: Record<string, unknown>[] | undefined,

		entitySetName: string | undefined,
		view: FEView | null,
		messageHandler: MessageHandler,
		strictHandlingUtilities: StrictHandlingUtilities,
		callbacks: {
			beforeShowingMessage: (
				mParameters: ShowActionDialogParameters,
				aContexts: ODataV4Context[],
				oDialog: Dialog | undefined,
				messages: Message[],
				showMessageParametersIn: ShowMessageParameters,
				showGenericErrorMessageForChangeSet: boolean
			) => ShowMessageParameters;
		},
		ignoreETag?: boolean
	): StandardParameterDialog;
}

let currentFactory: CoreUIFactory | undefined;

export function getCoreUIFactory(): CoreUIFactory {
	if (currentFactory === undefined) {
		throw new Error("sap.fe.core UI provider not defined");
	}

	return currentFactory;
}

export function setCoreUIFactory(provider?: CoreUIFactory): void {
	currentFactory = provider;
}
