import Log from "sap/base/Log";
import ObjectPath from "sap/base/util/ObjectPath";
import CommonUtils from "sap/fe/core/CommonUtils";
import type PageController from "sap/fe/core/PageController";
import type { UserActivity } from "sap/fe/core/controllerextensions/collaboration/CollaborationCommon";
import { Activity, getActivityKeyFromPath } from "sap/fe/core/controllerextensions/collaboration/CollaborationCommon";
import draft from "sap/fe/core/controllerextensions/editFlow/draft";
import FPMHelper from "sap/fe/core/helpers/FPMHelper";
import ModelHelper from "sap/fe/core/helpers/ModelHelper";
import ResourceModelHelper, { getResourceModel } from "sap/fe/core/helpers/ResourceModelHelper";
import CommonHelper from "sap/fe/macros/CommonHelper";
import type FileWrapper from "sap/fe/macros/controls/FileWrapper";
import FieldAPI from "sap/fe/macros/field/FieldAPI";
import {
	displayMessageForFailedUpload,
	setHeaderFields,
	showFileSizeExceedDialog,
	showTypeMismatchDialog
} from "sap/fe/macros/internal/helpers/Upload";
import type Avatar from "sap/m/Avatar";
import type { CheckBox$SelectEvent } from "sap/m/CheckBox";
import type { $HBoxSettings } from "sap/m/HBox";
import HBox from "sap/m/HBox";
import type { InputBase$ChangeEvent } from "sap/m/InputBase";
import Label from "sap/m/Label";
import type Link from "sap/m/Link";
import MessageBox from "sap/m/MessageBox";
import ResponsivePopover from "sap/m/ResponsivePopover";
import { default as Util } from "sap/m/table/Util";
import type Event from "sap/ui/base/Event";
import type ManagedObject from "sap/ui/base/ManagedObject";
import type Control from "sap/ui/core/Control";
import type { Control$ValidateFieldGroupEvent } from "sap/ui/core/Control";
import Element from "sap/ui/core/Element";
import IconPool from "sap/ui/core/IconPool";
import Library from "sap/ui/core/Lib";
import type View from "sap/ui/core/mvc/View";
import type { default as Field, Field$ChangeEvent } from "sap/ui/mdc/Field";
import type CompositeBinding from "sap/ui/model/CompositeBinding";
import Filter from "sap/ui/model/Filter";
import Sorter from "sap/ui/model/Sorter";
import type JSONModel from "sap/ui/model/json/JSONModel";
import type Context from "sap/ui/model/odata/v4/Context";
import type ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import type ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import type FileUploader from "sap/ui/unified/FileUploader";
import type {
	FileUploader$ChangeEvent,
	FileUploader$FileSizeExceedEvent,
	FileUploader$TypeMissmatchEvent,
	FileUploader$UploadCompleteEvent
} from "sap/ui/unified/FileUploader";
import openWindow from "sap/ui/util/openWindow";
import FieldRuntimeHelper from "./FieldRuntimeHelper";

/**
 * Gets the binding used for collaboration notifications.
 * @param field
 * @returns The binding
 */
function getCollaborationBinding(field: Control): ODataListBinding | ODataContextBinding {
	let binding = (field.getBindingContext() as Context).getBinding();

	if (!binding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
		const oView = CommonUtils.getTargetView(field);
		binding = oView.getBindingContext().getBinding();
	}

	return binding;
}
/**
 * Static class used by "sap.ui.mdc.Field" during runtime
 * @private
 * @experimental This module is only for internal/experimental use!
 */
const FieldRuntime = {
	uploadPromises: {} as Record<string, { resolve: Function; reject: Function }>,
	creatingInactiveRow: false,

	/**
	 * Triggers an internal navigation on the link pertaining to DataFieldWithNavigationPath.
	 * @param source Source of the press event
	 * @param controller Instance of the controller
	 * @param navPath The navigation path
	 */
	onDataFieldWithNavigationPath: async function (source: Control, controller: PageController, navPath: string): Promise<void> {
		if (controller._routing) {
			const bindingContext = source.getBindingContext() as Context;

			const view = CommonUtils.getTargetView(source),
				metaModel = bindingContext.getModel().getMetaModel();
			const viewData = view.getViewData();

			const draftRootPath = ModelHelper.getDraftRootPath(bindingContext) ?? bindingContext.getPath();
			let urlNavigation = await controller._routing.getHashForNavigation(bindingContext, navPath);
			const navigateFn = (): void => {
				controller
					.getAppComponent()
					.getRouterProxy()
					.navToHash(
						urlNavigation,
						true,
						false,
						false,
						!ModelHelper.isStickySessionSupported(bindingContext.getModel().getMetaModel())
					);
			};

			// To know if we're navigating on the same OP Entity
			if (!urlNavigation?.startsWith("/")) {
				urlNavigation = `/${urlNavigation}`;
			}
			const sameOPNavigation = urlNavigation.startsWith(draftRootPath);

			// Show draft loss confirmation dialog in case of Object page
			if (viewData.converterType === "ObjectPage" && !ModelHelper.isStickySessionSupported(metaModel) && !sameOPNavigation) {
				draft.processDataLossOrDraftDiscardConfirmation(
					navigateFn,
					Function.prototype,
					bindingContext,
					view.getController(),
					true,
					draft.NavigationType.ForwardNavigation
				);
			} else {
				navigateFn();
			}
		} else {
			Log.error(
				"FieldRuntime: No routing listener controller extension found. Internal navigation aborted.",
				"sap.fe.macros.field.FieldRuntime",
				"onDataFieldWithNavigationPath"
			);
		}
	},
	isDraftIndicatorVisible: function (
		sPropertyPath: string,
		sSemanticKeyHasDraftIndicator: string,
		HasDraftEntity?: boolean,
		IsActiveEntity?: boolean,
		hideDraftInfo?: boolean
	): boolean {
		if (IsActiveEntity !== undefined && HasDraftEntity !== undefined && (!IsActiveEntity || HasDraftEntity) && !hideDraftInfo) {
			return sPropertyPath === sSemanticKeyHasDraftIndicator;
		} else {
			return false;
		}
	},

	/**
	 * Handler for the validateFieldGroup event.
	 * @param oEvent The event object passed by the validateFieldGroup event
	 */
	onValidateFieldGroup: function (oEvent: Control$ValidateFieldGroupEvent): void {
		const oSourceField = oEvent.getSource() as ManagedObject;
		const view = CommonUtils.getTargetView(oSourceField),
			controller = view.getController();

		const oFEController = FieldRuntimeHelper.getExtensionController(controller);
		oFEController._sideEffects.handleFieldGroupChange(oEvent);
	},

	/**
	 * Handler for the change event.
	 * Store field group IDs of this field for requesting side effects when required.
	 * We store them here to ensure there is a change in the value of the field.
	 * @param oController The controller of the page containing the field
	 * @param oEvent The event object passed by the change event
	 */
	//This should be replaced by FieldAPI.handleChange. Currently it is still needed because a pending review of the change handler in MultiValueField
	handleChangeMultiValueField: function (oController: PageController, oEvent: Field$ChangeEvent & Event<{ isValid: boolean }>): void {
		const oSourceField = oEvent.getSource() as Control,
			bIsTransient = oSourceField && (oSourceField.getBindingContext() as unknown as { isTransient: Function }).isTransient(),
			pValueResolved = oEvent.getParameter("promise") || Promise.resolve(),
			oSource = oEvent.getSource(),
			bValid = oEvent.getParameter("valid"),
			fieldValidity = FieldRuntimeHelper.getFieldStateOnChange(oEvent).state["validity"],
			field = oEvent.getSource() as Control,
			fieldAPI = field.getParent()?.getParent() as FieldAPI | undefined,
			customValueBinding = fieldAPI?.customValueBinding;

		if (customValueBinding) {
			let newValue;
			const valueModel = field?.getModel(customValueBinding.model) as JSONModel | undefined;
			if (oSource.isA("sap.m.CheckBox")) {
				newValue = (oEvent as CheckBox$SelectEvent).getParameter("selected");
			} else {
				newValue = (oEvent as InputBase$ChangeEvent).getParameter("value");
			}
			valueModel?.setProperty(customValueBinding.path, newValue);
			valueModel?.updateBindings(true);
		}

		// Use the FE Controller instead of the extensionAPI to access internal FE controllers
		const oFEController = FieldRuntimeHelper.getExtensionController(oController);

		// TODO: currently we have undefined and true... and our creation row implementation relies on this.
		// I would move this logic to this place as it's hard to understand for field consumer
		pValueResolved
			.then(function () {
				// The event is gone. For now we'll just recreate it again
				(oEvent as { oSource?: Field }).oSource = oSource;
				(oEvent as { mParameters?: { valid?: boolean } }).mParameters = {
					valid: bValid
				};
				(FieldAPI as unknown as { handleChange: Function }).handleChange(oEvent, oController);
				if (!bIsTransient) {
					// trigger side effects without registering deferred side effects
					// deferred side effects are already registered by prepareDeferredSideEffectsForField before pValueResolved is resolved.
					oFEController._sideEffects.handleFieldChange(oEvent, !!fieldValidity, pValueResolved, true);
				}
				// Recommendations
				FieldRuntimeHelper.fetchRecommendations(field as Field, oController);
				return;
			})
			.catch(function (/*oError: any*/) {
				// The event is gone. For now we'll just recreate it again
				(oEvent as { oSource?: Field }).oSource = oSource;
				(oEvent as { mParameters?: { valid?: boolean } }).mParameters = {
					valid: false
				};
				Log.debug("Prerequisites on Field for the SideEffects and Recommendations have been rejected");
				// as the UI might need to react on. We could provide a parameter to inform if validation
				// was successful?
				(FieldAPI as unknown as { handleChange: Function }).handleChange(oEvent, oController);
			});

		// For the EditFlow synchronization, we need to wait for the corresponding PATCH request to be sent, otherwise there could be e.g. action invoked in parallel with the PATCH request.
		// This is done with a 0-timeout, to allow for the 'patchSent' event to be sent by the binding (then the internal edit flow synchronization kicks in with EditFlow.handlePatchSent).
		const valueResolvedAndPatchSent = pValueResolved.then(async () => {
			return new Promise<void>((resolve) => {
				setTimeout(resolve, 0);
			});
		});
		oFEController.editFlow.syncTask(valueResolvedAndPatchSent);

		// if the context is transient, it means the request would fail anyway as the record does not exist in reality
		// TODO: should the request be made in future if the context is transient?
		if (bIsTransient) {
			return;
		}

		oFEController._sideEffects.prepareDeferredSideEffectsForField(oEvent, !!fieldValidity, pValueResolved);
		// Collaboration Draft Activity Sync
		const bCollaborationEnabled = oController.collaborativeDraft.isConnected();

		if (bCollaborationEnabled && fieldValidity) {
			const binding = getCollaborationBinding(field);

			const data = [
				...((field.getBindingInfo("value") || field.getBindingInfo("selected"))?.parts || []),
				...(field.getBindingInfo("additionalValue")?.parts || [])
			]
				.filter((part) => {
					return part?.path !== undefined && part.path.indexOf("@@") < 0; // Remove binding parts with @@ that make no sense for collaboration messages
				})
				.map(function (part: { path: string }) {
					return `${field.getBindingContext()?.getPath()}/${part.path}`;
				});

			// From this point, we will always send a collaboration message (UNLOCK or CHANGE), so we retain
			// a potential UNLOCK that would be sent in handleFocusOut, to make sure it's sent after the CHANGE message
			oController.collaborativeDraft.retainAsyncMessages(data);

			const updateCollaboration = (): void => {
				if (binding.hasPendingChanges()) {
					// The value has been changed by the user --> wait until it's sent to the server before sending a notification to other users
					binding.attachEventOnce("patchCompleted", function () {
						oController.collaborativeDraft.send({ action: Activity.Change, content: data });
						oController.collaborativeDraft.releaseAsyncMessages(data);
					});
				} else {
					oController.collaborativeDraft.releaseAsyncMessages(data);
				}
			};
			if (oSourceField.isA("sap.ui.mdc.Field") || (oSourceField as Control).isA("sap.ui.mdc.MultiValueField")) {
				pValueResolved
					.then(() => {
						updateCollaboration();
						return;
					})
					.catch(() => {
						updateCollaboration();
					});
			} else {
				updateCollaboration();
			}
		}
	},

	/**
	 * Method to send collaboration messages from a FileUploader.
	 * @param fileUploader
	 * @param action
	 */
	_sendCollaborationMessageForFileUploader(fileUploader: FileUploader, action: Activity): void {
		const view = CommonUtils.getTargetView(fileUploader);
		const collaborativeDraft = view.getController().collaborativeDraft;
		if (collaborativeDraft.isConnected()) {
			const bindingPath = fileUploader.getParent()?.getProperty("propertyPath");
			const fullPath = `${fileUploader.getBindingContext()?.getPath()}/${bindingPath}`;
			collaborativeDraft.send({ action, content: fullPath });
		}
	},

	/**
	 * Handler when a FileUpload dialog is opened.
	 * @param event
	 */
	handleOpenUploader: function (event: Event<{}, FileUploader>): void {
		const fileUploader = event.getSource();
		FieldRuntime._sendCollaborationMessageForFileUploader(fileUploader, Activity.Lock);
	},

	/**
	 * Handler when a FileUpload dialog is closed.
	 * @param event
	 */
	handleCloseUploader: function (event: Event<{}, FileUploader>): void {
		const fileUploader = event.getSource();
		FieldRuntime._sendCollaborationMessageForFileUploader(fileUploader, Activity.Unlock);
	},

	_fnFixHashQueryString: function (sCurrentHash: string): string {
		if (sCurrentHash?.includes("?")) {
			// sCurrentHash can contain query string, cut it off!
			sCurrentHash = sCurrentHash.split("?")[0];
		}
		return sCurrentHash;
	},
	openExternalLink: function (event: Event<{}, Link>): void {
		const source = event.getSource();
		if (source.data("url") && source.getProperty("text") !== "") {
			// This opens the link in the same tab as the link. It was done to be more consistent with other type of links.
			openWindow(source.data("url"), "_self");
		}
	},

	uploadStream: function (controller: PageController, event: FileUploader$ChangeEvent): void {
		const fileUploader = event.getSource(),
			FEController = FieldRuntimeHelper.getExtensionController(controller),
			fileWrapper = fileUploader.getParent() as unknown as FileWrapper,
			uploadUrl = fileWrapper.getUploadUrl();

		if (uploadUrl !== "") {
			fileWrapper.setUIBusy(true);

			// use uploadUrl from FileWrapper which returns a canonical URL
			fileUploader.setUploadUrl(uploadUrl);

			setHeaderFields(fileUploader);

			// synchronize upload with other requests
			const uploadPromise = new Promise((resolve: Function, reject: Function) => {
				this.uploadPromises = this.uploadPromises || {};
				this.uploadPromises[fileUploader.getId()] = {
					resolve: resolve,
					reject: reject
				};
				fileUploader.upload();
			});
			FEController.editFlow.syncTask(uploadPromise);
		} else {
			MessageBox.error(getResourceModel(controller).getText("M_FIELD_FILEUPLOADER_ABORTED_TEXT"));
		}
	},

	handleUploadComplete: function (
		event: FileUploader$UploadCompleteEvent,
		propertyFileName: { path: string } | undefined,
		propertyPath: string,
		controller: PageController
	): void {
		const status = Number(event.getParameter("status")),
			fileUploader = event.getSource(),
			fileWrapper = fileUploader.getParent() as unknown as FileWrapper;

		fileWrapper.setUIBusy(false);

		const context = fileUploader.getBindingContext() as Context | undefined | null;
		if (status === 0 || status >= 400) {
			const error = (event.getParameter("responseRaw") || event.getParameter("response")) as string;
			displayMessageForFailedUpload(fileUploader, error);
			this.uploadPromises[fileUploader.getId()].reject();
		} else {
			const newETag = (event.getParameter("headers") as Record<string, unknown>)?.etag;

			if (newETag) {
				// set new etag for filename update, but without sending patch request
				context?.setProperty("@odata.etag", newETag, null as unknown as string);
			}

			// set filename for link text
			if (propertyFileName?.path) {
				context?.setProperty(propertyFileName.path, fileUploader.getValue());
			}

			// delete the avatar cache that not gets updated otherwise
			fileWrapper.avatar?.refreshAvatarCacheBusting();

			this._callSideEffectsForStream(event as unknown as Field$ChangeEvent & Event<{ isValid: boolean }>, fileWrapper, controller);

			this.uploadPromises[fileUploader.getId()].resolve();
		}

		delete this.uploadPromises[fileUploader.getId()];

		// Collaboration Draft Activity Sync
		const isCollaborationEnabled = controller.collaborativeDraft.isConnected();
		if (!isCollaborationEnabled || !context) {
			return;
		}

		const notificationData = [`${context.getPath()}/${propertyPath}`];
		if (propertyFileName?.path) {
			notificationData.push(`${context.getPath()}/${propertyFileName.path}`);
		}

		let binding = context.getBinding();
		if (!binding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
			const oView = CommonUtils.getTargetView(fileUploader);
			binding = oView.getBindingContext().getBinding();
		}
		if (binding.hasPendingChanges()) {
			binding.attachEventOnce("patchCompleted", () => {
				controller.collaborativeDraft.send({ action: Activity.Change, content: notificationData });
				controller.collaborativeDraft.send({ action: Activity.Unlock, content: notificationData });
			});
		} else {
			controller.collaborativeDraft.send({ action: Activity.Change, content: notificationData });
			controller.collaborativeDraft.send({ action: Activity.Unlock, content: notificationData });
		}
	},

	removeStream: function (
		event: Field$ChangeEvent & Event<{ isValid: boolean }>,
		propertyFileName: { path: string } | undefined,
		propertyPath: string,
		controller: PageController
	): void {
		const deleteButton = event.getSource();
		const fileWrapper = deleteButton.getParent() as unknown as FileWrapper;
		const context = fileWrapper.getBindingContext() as Context;

		// streams are removed by assigning the null value
		context.setProperty(propertyPath, null);
		// When setting the property to null, the uploadUrl (@@MODEL.format) is set to "" by the model
		//	with that another upload is not possible before refreshing the page
		// (refreshing the page would recreate the URL)
		//	This is the workaround:
		//	We set the property to undefined only on the frontend which will recreate the uploadUrl
		context.setProperty(propertyPath, undefined, null as unknown as string);

		this._callSideEffectsForStream(event, fileWrapper, controller);

		// Collaboration Draft Activity Sync
		const bCollaborationEnabled = controller.collaborativeDraft.isConnected();
		if (bCollaborationEnabled) {
			let binding = context.getBinding();
			if (!binding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
				const oView = CommonUtils.getTargetView(deleteButton);
				binding = oView.getBindingContext().getBinding();
			}

			const data = [`${context.getPath()}/${propertyPath}`];
			if (propertyFileName?.path) {
				data.push(`${context.getPath()}/${propertyFileName.path}`);
			}
			controller.collaborativeDraft.send({ action: Activity.Lock, content: data });

			binding.attachEventOnce("patchCompleted", function () {
				controller.collaborativeDraft.send({ action: Activity.Change, content: data });
				controller.collaborativeDraft.send({ action: Activity.Unlock, content: data });
			});
		}
	},

	_callSideEffectsForStream: function (
		oEvent: Field$ChangeEvent & Event<{ isValid: boolean }>,
		oControl: Control,
		oController: PageController
	): void {
		const oFEController = FieldRuntimeHelper.getExtensionController(oController);
		if (oControl && (oControl.getBindingContext() as unknown as { isTransient: Function }).isTransient()) {
			return;
		}
		if (oControl) {
			(oEvent as unknown as { oSource: Control }).oSource = oControl;
		}
		oFEController._sideEffects.handleFieldChange(oEvent, FieldRuntimeHelper.getFieldStateOnChange(oEvent).state["validity"]);
	},

	getIconForMimeType: function (sMimeType: string): string {
		return IconPool.getIconForMimeType(sMimeType);
	},

	/**
	 * Method to retrieve text from value list for DataField.
	 * @param sPropertyValue The property value of the datafield
	 * @param sPropertyFullPath The property full path's
	 * @param sDisplayFormat The display format for the datafield
	 * @returns The formatted value in corresponding display format.
	 */
	retrieveTextFromValueList: async function (sPropertyValue: string, sPropertyFullPath: string, sDisplayFormat: string): Promise<string> {
		let sTextProperty: string;
		let oMetaModel;
		let sPropertyName: string;
		if (sPropertyValue) {
			oMetaModel = CommonHelper.getMetaModel();
			sPropertyName = oMetaModel.getObject(`${sPropertyFullPath}@sapui.name`);
			return oMetaModel
				.requestValueListInfo(sPropertyFullPath, true)
				.then(function (mValueListInfo) {
					// take the "" one if exists, otherwise take the first one in the object TODO: to be discussed
					const oValueListInfo = mValueListInfo[mValueListInfo[""] ? "" : Object.keys(mValueListInfo)[0]];
					const oValueListModel = oValueListInfo.$model;
					const oMetaModelValueList = oValueListModel.getMetaModel();
					const oParamWithKey = oValueListInfo.Parameters.find(function (oParameter: {
						LocalDataProperty?: { $PropertyPath: string };
					}) {
						return oParameter.LocalDataProperty && oParameter.LocalDataProperty.$PropertyPath === sPropertyName;
					});
					if (oParamWithKey && !oParamWithKey.ValueListProperty) {
						throw new Error(`Inconsistent value help annotation for ${sPropertyName}`);
					}
					const oTextAnnotation = oMetaModelValueList.getObject(
						`/${oValueListInfo.CollectionPath}/${oParamWithKey.ValueListProperty}@com.sap.vocabularies.Common.v1.Text`
					);

					if (oTextAnnotation && oTextAnnotation.$Path) {
						sTextProperty = oTextAnnotation.$Path;
						const oFilter = new Filter({
							path: oParamWithKey.ValueListProperty,
							operator: "EQ",
							value1: sPropertyValue
						});
						const oListBinding = oValueListModel.bindList(`/${oValueListInfo.CollectionPath}`, undefined, undefined, oFilter, {
							$select: sTextProperty
						});
						return oListBinding.requestContexts(0, 2);
					} else {
						sDisplayFormat = "Value";
						return sPropertyValue;
					}
				})
				.then(function (aContexts: Context[]) {
					const sDescription = sTextProperty ? aContexts[0]?.getObject()[sTextProperty] : "";
					switch (sDisplayFormat) {
						case "Description":
							return sDescription;
						case "DescriptionValue":
							return Library.getResourceBundleFor("sap.fe.core")!.getText("C_FORMAT_FOR_TEXT_ARRANGEMENT", [
								sDescription,
								sPropertyValue
							]);
						case "ValueDescription":
							return Library.getResourceBundleFor("sap.fe.core")!.getText("C_FORMAT_FOR_TEXT_ARRANGEMENT", [
								sPropertyValue,
								sDescription
							]);
						default:
							return sPropertyValue;
					}
				})
				.catch(function (oError: unknown) {
					const errorObj = oError as { status: number; message: string };
					const sMsg =
						errorObj.status && errorObj.status === 404
							? `Metadata not found (${errorObj.status}) for value help of property ${sPropertyFullPath}`
							: errorObj.message;
					Log.error(sMsg);
				});
		}
		return sPropertyValue;
	},

	handleTypeMissmatch: function (event: FileUploader$TypeMissmatchEvent): void {
		const fileUploader = event.getSource();
		const givenType = event.getParameter("mimeType");
		const acceptedTypes = fileUploader.getMimeType();
		if (givenType) {
			showTypeMismatchDialog(fileUploader, givenType, acceptedTypes);
		}
	},

	handleFileSizeExceed: function (event: FileUploader$FileSizeExceedEvent): void {
		const fileUploader = event.getSource();
		showFileSizeExceedDialog(fileUploader, fileUploader.getMaximumFileSize().toFixed(3));
	},

	/**
	 * Event handler to create and show who is editing the field popover.
	 * @param source The avatar which is next to the field locked
	 * @param view Current view
	 */
	showCollaborationEditUser: function (source: Avatar, view: View): void {
		const resourceModel = ResourceModelHelper.getResourceModel(view);
		let popover = Element.getElementById(`manageCollaborationDraft--editUser`) as ResponsivePopover;

		if (!popover) {
			popover = new ResponsivePopover("manageCollaborationDraft--editUser", {
				showHeader: false,
				placement: "Bottom"
			});
			popover.addStyleClass("sapUiContentPadding");
			view.addDependent(popover);
		}

		const bindingPath = (source.getBinding("initials") as CompositeBinding | undefined)
			?.getBindings()
			.find((binding) => binding?.getPath()?.startsWith("/collaboration/activities"))
			.getPath();
		const activities = source.getBindingContext("internal")?.getObject(bindingPath);

		let editingActivity: UserActivity | undefined;
		if (activities && activities.length > 0) {
			editingActivity = activities.find((activity: UserActivity) => {
				return activity.key === getActivityKeyFromPath(source.getBindingContext()!.getPath());
			});
		}
		popover.destroyContent();
		popover.addContent(
			new Label({
				text: resourceModel.getText("C_COLLABORATIONAVATAR_USER_EDIT_FIELD", [`${editingActivity?.name}`])
			})
		);
		popover.openBy(source);
	},

	displayAggregateDetails: async function (event: Event, aggregatedPropertyPath: string): Promise<void> {
		const link = event.getSource<Link>();
		const analyticalTable = FPMHelper.getMdcTable(link)!;

		const rowContext = link.getBindingContext() as Context;
		const tableRowBinding = rowContext.getBinding() as ODataListBinding;

		// Get the filters corresponding to the total row
		const rowContextData = rowContext.getObject();
		const rowSpecificFilter: Filter[] = [];
		const rowFilter = rowContext.getFilter();
		if (rowFilter) {
			rowSpecificFilter.push(rowFilter);
		}

		// Add the filters applied to the original table
		const allFilters = rowSpecificFilter.concat(tableRowBinding.getFilters("Application"), tableRowBinding.getFilters("Control"));

		// Calculate $$aggregation parameters for the table in the popover (aggregate amount, group by currency/unit)
		const aggregation = tableRowBinding.getAggregation() as {
			group: Record<string, object>;
			aggregate: Record<string, { unit: string }>;
			search?: string;
		};
		const unitOrCurrencyName = aggregation.aggregate[aggregatedPropertyPath].unit;
		const group: Record<string, object> = {};
		group[unitOrCurrencyName] = {};
		const aggregate: Record<string, object> = {};
		aggregate[aggregatedPropertyPath] = { grandTotal: false, subtotals: false, unit: unitOrCurrencyName };

		// The item displayed in the table in the popover is a copy of the item displayed in the table
		const tableItem = link.getDependents()[0].clone();
		const currencyOrQuantityEnabledLayout = new HBox({
			renderType: "Bare",
			justifyContent: "End",
			items: [tableItem]
		} as $HBoxSettings);

		const aggregationParameters: {
			group: Record<string, object>;
			aggregate: Record<string, object>;
			search?: string;
		} = { group, aggregate };
		if (aggregation.search) {
			aggregationParameters.search = aggregation.search;
		}

		const oItemsBindingInfo = {
			path: tableRowBinding.getResolvedPath(),
			filters: allFilters,
			parameters: {
				$$aggregation: aggregationParameters
			},
			sorter: new Sorter(unitOrCurrencyName, false) // Order by currency
		};

		const isPopoverForGrandTotal = rowContextData["@$ui5.node.level"] === 0;
		const popover: ResponsivePopover = await Util.createOrUpdateMultiUnitPopover(`${analyticalTable.getId()}-multiUnitPopover`, {
			control: analyticalTable,
			grandTotal: isPopoverForGrandTotal,
			itemsBindingInfo: oItemsBindingInfo,
			listItemContentTemplate: currencyOrQuantityEnabledLayout
		});
		analyticalTable.addDependent(popover);

		const fnOnClose = (): void => {
			analyticalTable.removeDependent(popover);
			popover.detachEvent("afterClose", fnOnClose);
			popover.destroy();
		};
		popover.attachEvent("afterClose", fnOnClose);
		popover.openBy(link);
	}
};

ObjectPath.set("sap.fe.macros.field.FieldRuntime", FieldRuntime);

export default FieldRuntime;
