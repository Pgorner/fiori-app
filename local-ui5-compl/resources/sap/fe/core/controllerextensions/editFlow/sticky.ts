import { CommonAnnotationTerms } from "@sap-ux/vocabularies-types/vocabularies/Common";
import Log from "sap/base/Log";
import type AppComponent from "sap/fe/core/AppComponent";
import type { FEView } from "sap/fe/core/BaseController";
import CommonUtils from "sap/fe/core/CommonUtils";
import { getResourceModel } from "sap/fe/core/helpers/ResourceModelHelper";
import FELibrary from "sap/fe/core/library";
import MessageBox from "sap/m/MessageBox";
import Library from "sap/ui/core/Lib";
import type Context from "sap/ui/model/odata/v4/Context";
import operationsHelper from "../../operationsHelper";
import type MessageHandler from "../MessageHandler";

const ProgrammingModel = FELibrary.ProgrammingModel;
/**
 * Opens a sticky session to edit a document.
 * @param context Context of the document to be edited
 * @param appComponent The AppComponent
 * @param messageHandler The message handler controller extension
 * @returns A Promise resolved when the sticky session is in edit mode
 */
async function editDocumentInStickySession(context: Context, appComponent: AppComponent, messageHandler: MessageHandler): Promise<Context> {
	const model = context.getModel(),
		metaModel = model.getMetaModel(),
		metaPath = metaModel.getMetaPath(context.getPath()),
		editActionAnnotation = metaModel.getObject(`${metaPath}@com.sap.vocabularies.Session.v1.StickySessionSupported/EditAction`);

	if (!editActionAnnotation) {
		throw new Error(`Edit Action for Sticky Session not found for ${metaPath}`);
	}
	const resourceModel = getResourceModel(appComponent);
	const actionName = resourceModel.getText("C_COMMON_OBJECT_PAGE_EDIT");
	const editAction = model.bindContext(`${editActionAnnotation}(...)`, context, { $$inheritExpandSelect: true });
	const groupId = "direct";
	// If the context has not been loaded yet, we can ignore the ETag (as no previous ETag is available)
	const ignoreETag = context.getObject() === undefined ? true : undefined;

	const editPromise = editAction.execute(
		groupId,
		ignoreETag,
		operationsHelper.fnOnStrictHandlingFailed.bind(
			sticky,
			groupId,
			{ appComponent, label: actionName, model },
			null,
			null,
			null,
			messageHandler,
			undefined,
			undefined
		),
		context.getBinding().isA("sap.ui.model.odata.v4.ODataListBinding")
	);
	model.submitBatch(groupId);

	const newContext: Context = await editPromise;
	const sideEffects = appComponent.getSideEffectsService().getODataActionSideEffects(editActionAnnotation, newContext);
	if (sideEffects?.triggerActions && sideEffects.triggerActions.length) {
		await appComponent.getSideEffectsService().requestSideEffectsForODataAction(sideEffects, newContext);
	}
	return newContext;
}
/**
 * Activates a document and closes the sticky session.
 * @param context Context of the document to be activated
 * @param appComponent Context of the document to be activated
 * @param messageHandler The message handler controller extension
 * @returns A promise resolve when the sticky session is activated
 */
async function activateDocument(context: Context, appComponent: AppComponent, messageHandler: MessageHandler): Promise<Context> {
	const model = context.getModel(),
		metaModel = model.getMetaModel(),
		metaPath = metaModel.getMetaPath(context.getPath()),
		saveActionAnnotation = metaModel.getObject(`${metaPath}@com.sap.vocabularies.Session.v1.StickySessionSupported/SaveAction`);

	if (!saveActionAnnotation) {
		throw new Error(`Save Action for Sticky Session not found for ${metaPath}`);
	}

	const resourceModel = getResourceModel(appComponent);
	const actionName = resourceModel.getText("C_OP_OBJECT_PAGE_SAVE");
	const saveAction = model.bindContext(`${saveActionAnnotation}(...)`, context, { $$inheritExpandSelect: true });
	const groupId = "direct";

	const savePromise = saveAction.execute(
		groupId,
		true,
		operationsHelper.fnOnStrictHandlingFailed.bind(
			sticky,
			groupId,
			{ appComponent, label: actionName, model },
			null,
			null,
			null,
			messageHandler,
			undefined,
			undefined
		),
		context.getBinding().isA("sap.ui.model.odata.v4.ODataListBinding")
	);

	model.submitBatch(groupId);

	try {
		return await savePromise;
	} catch (err) {
		const messagesPath = metaModel.getObject(`${metaPath}/@${CommonAnnotationTerms.Messages}/$Path`) as string | undefined;

		if (messagesPath) {
			try {
				await appComponent.getSideEffectsService().requestSideEffects([messagesPath], context);
			} catch (error: unknown) {
				Log.error("Error while requesting side effects", error as string);
			}
		}
		throw err;
	}
}
/**
 * Discards a document and closes sticky session.
 * @param context Context of the document to be discarded
 * @returns A promise resolved when the document is dicarded
 */
async function discardDocument(context: Context): Promise<Context> {
	const model = context.getModel(),
		metaModel = model.getMetaModel(),
		metaPath = metaModel.getMetaPath(context.getPath()),
		discardActionAnnotation = metaModel.getObject(`${metaPath}@com.sap.vocabularies.Session.v1.StickySessionSupported/DiscardAction`);

	if (!discardActionAnnotation) {
		throw new Error(`Discard Action for Sticky Session not found for ${metaPath}`);
	}

	const discardAction = model.bindContext(`/${discardActionAnnotation}(...)`);
	return discardAction.execute("$single").then(function () {
		return context;
	});
}

/**
 * Process the Data loss confirmation.
 * @param fnProcess Function to execute after confirmation
 * @param view Current view
 * @param programmingModel Programming Model of the current page
 * @returns `void` i think
 */
function processDataLossConfirmation(fnProcess: Function, view: FEView, programmingModel: string): void {
	const uiEditable = CommonUtils.getIsEditable(view),
		resourceBundle = Library.getResourceBundleFor("sap.fe.templates")!,
		warningMsg = resourceBundle.getText("T_COMMON_UTILS_NAVIGATION_AWAY_MSG"),
		confirmButtonTxt = resourceBundle.getText("T_COMMON_UTILS_NAVIGATION_AWAY_CONFIRM_BUTTON"),
		cancelButtonTxt = resourceBundle.getText("T_COMMON_UTILS_NAVIGATION_AWAY_CANCEL_BUTTON");

	if (programmingModel === ProgrammingModel.Sticky && uiEditable) {
		return MessageBox.warning(warningMsg, {
			actions: [confirmButtonTxt, cancelButtonTxt],
			emphasizedAction: confirmButtonTxt,
			onClose: function (actionText: string) {
				if (actionText === confirmButtonTxt) {
					Log.info("Navigation confirmed.");
					fnProcess();
				} else {
					Log.info("Navigation rejected.");
				}
			}
		});
	}
	return fnProcess();
}

/**
 * Static functions for the sticky session programming model
 * @namespace
 * @experimental This module is only for experimental use! <br/><b>This is only a POC and maybe deleted</b>
 * @since 1.54.0
 */
const sticky = {
	editDocumentInStickySession: editDocumentInStickySession,
	activateDocument: activateDocument,
	discardDocument: discardDocument,
	processDataLossConfirmation: processDataLossConfirmation
};

export default sticky;
