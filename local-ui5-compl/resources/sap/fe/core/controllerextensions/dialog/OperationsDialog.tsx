import type { PropertiesOf } from "sap/fe/base/ClassSupport";
import { defineReference, defineUI5Class, property } from "sap/fe/base/ClassSupport";
import type { Ref } from "sap/fe/base/jsx-runtime/jsx";
import BuildingBlock from "sap/fe/core/buildingBlocks/BuildingBlock";
import Bar from "sap/m/Bar";
import Button from "sap/m/Button";
import Dialog from "sap/m/Dialog";
import Title from "sap/m/Title";
import type Control from "sap/ui/core/Control";
import Library from "sap/ui/core/Lib";
import type Message from "sap/ui/core/message/Message";
import type JSONModel from "sap/ui/model/json/JSONModel";
import type ODataModel from "sap/ui/model/odata/v4/ODataModel";
import type MessageHandler from "../MessageHandler";

type StrictHandlingPromise = {
	//TODO: move to somewhere else
	resolve: Function;
	groupId: string;
	requestSideEffects?: Function;
};

export type StrictHandlingUtilities = {
	//TODO: move to somewhere else
	is412Executed: boolean;
	strictHandlingTransitionFails: Object[];
	strictHandlingPromises: StrictHandlingPromise[];
	strictHandlingWarningMessages: Message[];
	delaySuccessMessages: Message[];
	processedMessageIds: Set<string>;
};

const macroResourceBundle = Library.getResourceBundleFor("sap.fe.macros")!;
/**
 * Known limitations for the first tryout as mentioned in git 5806442
 *  - functional block dependency
 * 	- questionable parameters will be refactored
 */
@defineUI5Class("sap.fe.core.controllerextensions.dialog.OperationsDialog")
export default class OperationsDialog extends BuildingBlock {
	/*
	 * The 'id' property of the dialog
	 */
	@property({ type: "string", required: true })
	public id!: string;

	/**
	 * The 'title' property of the Dialog;
	 */
	@property({ type: "string" })
	public title?: string = "Dialog Standard Title";

	/**
	 * The message object that is provided to this dialog
	 */
	@property({ type: "object", required: true }) //TODO: create the type
	public messageObject!: { messageView: Control; oBackButton: Button };

	@defineReference()
	operationsDialog!: Ref<Dialog>;

	@property({ type: "boolean", required: true })
	public isMultiContext412?: boolean;

	@property({ type: "function" })
	public requestSideEffects?: Function;

	@property({ type: "function" })
	public resolve?: Function;

	@property({ type: "object", required: true })
	public model!: ODataModel;

	@property({ type: "string", required: true })
	public groupId!: string;

	@property({ type: "string", required: true })
	public actionName!: string;

	@property({ type: "string", required: true })
	public cancelButtonTxt!: string;

	@property({ type: "object", required: true })
	public strictHandlingPromises!: StrictHandlingPromise[];

	@property({ type: "object" })
	public strictHandlingUtilities?: StrictHandlingUtilities;

	@property({ type: "object" })
	public messageHandler?: MessageHandler;

	@property({ type: "object", required: true })
	public messageDialogModel!: JSONModel;

	@property({ type: "boolean" })
	public isGrouped?: boolean;

	@property({ type: "function" })
	public showMessageInfo?: Function;

	constructor(props: PropertiesOf<OperationsDialog>) {
		super(props);
		this.model = props.model!;
	}

	public open(): void {
		this.createContent();
		this.operationsDialog.current?.open();
	}

	private getBeginButton(): Button {
		return new Button({
			press: (): void => {
				if (!(this.isMultiContext412 ?? false)) {
					this.resolve?.(true);
					this.model.submitBatch(this.groupId);
					if (this.requestSideEffects) {
						this.requestSideEffects();
					}
				} else {
					this.strictHandlingPromises.forEach((strictHandlingPromise: StrictHandlingPromise) => {
						strictHandlingPromise.resolve(true);
						this.model.submitBatch(strictHandlingPromise.groupId);
						if (strictHandlingPromise.requestSideEffects) {
							strictHandlingPromise.requestSideEffects();
						}
					});
					const strictHandlingFails = this.strictHandlingUtilities?.strictHandlingTransitionFails;
					if (strictHandlingFails && strictHandlingFails.length > 0) {
						this.messageHandler?.removeTransitionMessages();
					}
					if (this.strictHandlingUtilities) {
						this.strictHandlingUtilities.strictHandlingWarningMessages = [];
					}
				}
				if (this.strictHandlingUtilities) {
					this.strictHandlingUtilities.is412Executed = true;
				}
				this.messageDialogModel.setData({});
				this.close();
			},
			type: "Emphasized",
			text: this.actionName
		});
	}

	private close(): void {
		this.operationsDialog.current?.close();
	}

	private getTitle(): Title {
		const sTitle = macroResourceBundle.getText("M_WARNINGS");
		return new Title({ text: sTitle });
	}

	private getEndButton(): Button {
		return new Button({
			press: (): void => {
				if (this.strictHandlingUtilities) {
					this.strictHandlingUtilities.strictHandlingWarningMessages = [];
					this.strictHandlingUtilities.is412Executed = false;
				}
				if (!(this.isMultiContext412 ?? false)) {
					this.resolve!(false);
				} else {
					this.strictHandlingPromises.forEach(function (strictHandlingPromise: StrictHandlingPromise) {
						strictHandlingPromise.resolve(false);
					});
				}
				this.messageDialogModel.setData({});
				this.close();
				if (this.isGrouped ?? false) {
					this.showMessageInfo!();
				}
			},
			text: this.cancelButtonTxt
		});
	}

	/**
	 * The building block render function.
	 * @returns An XML-based string with the definition of the field control
	 */
	createContent(): Dialog {
		return (
			<Dialog
				id={this.id}
				ref={this.operationsDialog}
				resizable={true}
				content={this.messageObject.messageView}
				state={"Warning"}
				customHeader={
					new Bar({
						contentLeft: [this.messageObject.oBackButton],
						contentMiddle: [this.getTitle()]
					})
				}
				contentHeight={"50%"}
				contentWidth={"50%"}
				verticalScrolling={false}
				beginButton={this.getBeginButton()}
				endButton={this.getEndButton()}
			></Dialog>
		) as Dialog;
	}
}
