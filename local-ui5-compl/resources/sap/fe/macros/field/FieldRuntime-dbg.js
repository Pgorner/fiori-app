/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/ObjectPath", "sap/fe/core/CommonUtils", "sap/fe/core/controllerextensions/collaboration/CollaborationCommon", "sap/fe/core/controllerextensions/editFlow/draft", "sap/fe/core/helpers/FPMHelper", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/helpers/ResourceModelHelper", "sap/fe/macros/CommonHelper", "sap/fe/macros/field/FieldAPI", "sap/fe/macros/internal/helpers/Upload", "sap/m/HBox", "sap/m/Label", "sap/m/MessageBox", "sap/m/ResponsivePopover", "sap/m/table/Util", "sap/ui/core/Element", "sap/ui/core/IconPool", "sap/ui/core/Lib", "sap/ui/model/Filter", "sap/ui/model/Sorter", "sap/ui/util/openWindow", "./FieldRuntimeHelper"], function (Log, ObjectPath, CommonUtils, CollaborationCommon, draft, FPMHelper, ModelHelper, ResourceModelHelper, CommonHelper, FieldAPI, Upload, HBox, Label, MessageBox, ResponsivePopover, Util, Element, IconPool, Library, Filter, Sorter, openWindow, FieldRuntimeHelper) {
  "use strict";

  var showTypeMismatchDialog = Upload.showTypeMismatchDialog;
  var showFileSizeExceedDialog = Upload.showFileSizeExceedDialog;
  var setHeaderFields = Upload.setHeaderFields;
  var displayMessageForFailedUpload = Upload.displayMessageForFailedUpload;
  var getResourceModel = ResourceModelHelper.getResourceModel;
  var getActivityKeyFromPath = CollaborationCommon.getActivityKeyFromPath;
  var Activity = CollaborationCommon.Activity;
  /**
   * Gets the binding used for collaboration notifications.
   * @param field
   * @returns The binding
   */
  function getCollaborationBinding(field) {
    let binding = field.getBindingContext().getBinding();
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
    uploadPromises: {},
    creatingInactiveRow: false,
    /**
     * Triggers an internal navigation on the link pertaining to DataFieldWithNavigationPath.
     * @param source Source of the press event
     * @param controller Instance of the controller
     * @param navPath The navigation path
     */
    onDataFieldWithNavigationPath: async function (source, controller, navPath) {
      if (controller._routing) {
        const bindingContext = source.getBindingContext();
        const view = CommonUtils.getTargetView(source),
          metaModel = bindingContext.getModel().getMetaModel();
        const viewData = view.getViewData();
        const draftRootPath = ModelHelper.getDraftRootPath(bindingContext) ?? bindingContext.getPath();
        let urlNavigation = await controller._routing.getHashForNavigation(bindingContext, navPath);
        const navigateFn = () => {
          controller.getAppComponent().getRouterProxy().navToHash(urlNavigation, true, false, false, !ModelHelper.isStickySessionSupported(bindingContext.getModel().getMetaModel()));
        };

        // To know if we're navigating on the same OP Entity
        if (!urlNavigation?.startsWith("/")) {
          urlNavigation = `/${urlNavigation}`;
        }
        const sameOPNavigation = urlNavigation.startsWith(draftRootPath);

        // Show draft loss confirmation dialog in case of Object page
        if (viewData.converterType === "ObjectPage" && !ModelHelper.isStickySessionSupported(metaModel) && !sameOPNavigation) {
          draft.processDataLossOrDraftDiscardConfirmation(navigateFn, Function.prototype, bindingContext, view.getController(), true, draft.NavigationType.ForwardNavigation);
        } else {
          navigateFn();
        }
      } else {
        Log.error("FieldRuntime: No routing listener controller extension found. Internal navigation aborted.", "sap.fe.macros.field.FieldRuntime", "onDataFieldWithNavigationPath");
      }
    },
    isDraftIndicatorVisible: function (sPropertyPath, sSemanticKeyHasDraftIndicator, HasDraftEntity, IsActiveEntity, hideDraftInfo) {
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
    onValidateFieldGroup: function (oEvent) {
      const oSourceField = oEvent.getSource();
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
    handleChangeMultiValueField: function (oController, oEvent) {
      const oSourceField = oEvent.getSource(),
        bIsTransient = oSourceField && oSourceField.getBindingContext().isTransient(),
        pValueResolved = oEvent.getParameter("promise") || Promise.resolve(),
        oSource = oEvent.getSource(),
        bValid = oEvent.getParameter("valid"),
        fieldValidity = FieldRuntimeHelper.getFieldStateOnChange(oEvent).state["validity"],
        field = oEvent.getSource(),
        fieldAPI = field.getParent()?.getParent(),
        customValueBinding = fieldAPI?.customValueBinding;
      if (customValueBinding) {
        let newValue;
        const valueModel = field?.getModel(customValueBinding.model);
        if (oSource.isA("sap.m.CheckBox")) {
          newValue = oEvent.getParameter("selected");
        } else {
          newValue = oEvent.getParameter("value");
        }
        valueModel?.setProperty(customValueBinding.path, newValue);
        valueModel?.updateBindings(true);
      }

      // Use the FE Controller instead of the extensionAPI to access internal FE controllers
      const oFEController = FieldRuntimeHelper.getExtensionController(oController);

      // TODO: currently we have undefined and true... and our creation row implementation relies on this.
      // I would move this logic to this place as it's hard to understand for field consumer
      pValueResolved.then(function () {
        // The event is gone. For now we'll just recreate it again
        oEvent.oSource = oSource;
        oEvent.mParameters = {
          valid: bValid
        };
        FieldAPI.handleChange(oEvent, oController);
        if (!bIsTransient) {
          // trigger side effects without registering deferred side effects
          // deferred side effects are already registered by prepareDeferredSideEffectsForField before pValueResolved is resolved.
          oFEController._sideEffects.handleFieldChange(oEvent, !!fieldValidity, pValueResolved, true);
        }
        // Recommendations
        FieldRuntimeHelper.fetchRecommendations(field, oController);
        return;
      }).catch(function /*oError: any*/
      () {
        // The event is gone. For now we'll just recreate it again
        oEvent.oSource = oSource;
        oEvent.mParameters = {
          valid: false
        };
        Log.debug("Prerequisites on Field for the SideEffects and Recommendations have been rejected");
        // as the UI might need to react on. We could provide a parameter to inform if validation
        // was successful?
        FieldAPI.handleChange(oEvent, oController);
      });

      // For the EditFlow synchronization, we need to wait for the corresponding PATCH request to be sent, otherwise there could be e.g. action invoked in parallel with the PATCH request.
      // This is done with a 0-timeout, to allow for the 'patchSent' event to be sent by the binding (then the internal edit flow synchronization kicks in with EditFlow.handlePatchSent).
      const valueResolvedAndPatchSent = pValueResolved.then(async () => {
        return new Promise(resolve => {
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
        const data = [...((field.getBindingInfo("value") || field.getBindingInfo("selected"))?.parts || []), ...(field.getBindingInfo("additionalValue")?.parts || [])].filter(part => {
          return part?.path !== undefined && part.path.indexOf("@@") < 0; // Remove binding parts with @@ that make no sense for collaboration messages
        }).map(function (part) {
          return `${field.getBindingContext()?.getPath()}/${part.path}`;
        });

        // From this point, we will always send a collaboration message (UNLOCK or CHANGE), so we retain
        // a potential UNLOCK that would be sent in handleFocusOut, to make sure it's sent after the CHANGE message
        oController.collaborativeDraft.retainAsyncMessages(data);
        const updateCollaboration = () => {
          if (binding.hasPendingChanges()) {
            // The value has been changed by the user --> wait until it's sent to the server before sending a notification to other users
            binding.attachEventOnce("patchCompleted", function () {
              oController.collaborativeDraft.send({
                action: Activity.Change,
                content: data
              });
              oController.collaborativeDraft.releaseAsyncMessages(data);
            });
          } else {
            oController.collaborativeDraft.releaseAsyncMessages(data);
          }
        };
        if (oSourceField.isA("sap.ui.mdc.Field") || oSourceField.isA("sap.ui.mdc.MultiValueField")) {
          pValueResolved.then(() => {
            updateCollaboration();
            return;
          }).catch(() => {
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
    _sendCollaborationMessageForFileUploader(fileUploader, action) {
      const view = CommonUtils.getTargetView(fileUploader);
      const collaborativeDraft = view.getController().collaborativeDraft;
      if (collaborativeDraft.isConnected()) {
        const bindingPath = fileUploader.getParent()?.getProperty("propertyPath");
        const fullPath = `${fileUploader.getBindingContext()?.getPath()}/${bindingPath}`;
        collaborativeDraft.send({
          action,
          content: fullPath
        });
      }
    },
    /**
     * Handler when a FileUpload dialog is opened.
     * @param event
     */
    handleOpenUploader: function (event) {
      const fileUploader = event.getSource();
      FieldRuntime._sendCollaborationMessageForFileUploader(fileUploader, Activity.Lock);
    },
    /**
     * Handler when a FileUpload dialog is closed.
     * @param event
     */
    handleCloseUploader: function (event) {
      const fileUploader = event.getSource();
      FieldRuntime._sendCollaborationMessageForFileUploader(fileUploader, Activity.Unlock);
    },
    _fnFixHashQueryString: function (sCurrentHash) {
      if (sCurrentHash?.includes("?")) {
        // sCurrentHash can contain query string, cut it off!
        sCurrentHash = sCurrentHash.split("?")[0];
      }
      return sCurrentHash;
    },
    openExternalLink: function (event) {
      const source = event.getSource();
      if (source.data("url") && source.getProperty("text") !== "") {
        // This opens the link in the same tab as the link. It was done to be more consistent with other type of links.
        openWindow(source.data("url"), "_self");
      }
    },
    uploadStream: function (controller, event) {
      const fileUploader = event.getSource(),
        FEController = FieldRuntimeHelper.getExtensionController(controller),
        fileWrapper = fileUploader.getParent(),
        uploadUrl = fileWrapper.getUploadUrl();
      if (uploadUrl !== "") {
        fileWrapper.setUIBusy(true);

        // use uploadUrl from FileWrapper which returns a canonical URL
        fileUploader.setUploadUrl(uploadUrl);
        setHeaderFields(fileUploader);

        // synchronize upload with other requests
        const uploadPromise = new Promise((resolve, reject) => {
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
    handleUploadComplete: function (event, propertyFileName, propertyPath, controller) {
      const status = Number(event.getParameter("status")),
        fileUploader = event.getSource(),
        fileWrapper = fileUploader.getParent();
      fileWrapper.setUIBusy(false);
      const context = fileUploader.getBindingContext();
      if (status === 0 || status >= 400) {
        const error = event.getParameter("responseRaw") || event.getParameter("response");
        displayMessageForFailedUpload(fileUploader, error);
        this.uploadPromises[fileUploader.getId()].reject();
      } else {
        const newETag = event.getParameter("headers")?.etag;
        if (newETag) {
          // set new etag for filename update, but without sending patch request
          context?.setProperty("@odata.etag", newETag, null);
        }

        // set filename for link text
        if (propertyFileName?.path) {
          context?.setProperty(propertyFileName.path, fileUploader.getValue());
        }

        // delete the avatar cache that not gets updated otherwise
        fileWrapper.avatar?.refreshAvatarCacheBusting();
        this._callSideEffectsForStream(event, fileWrapper, controller);
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
          controller.collaborativeDraft.send({
            action: Activity.Change,
            content: notificationData
          });
          controller.collaborativeDraft.send({
            action: Activity.Unlock,
            content: notificationData
          });
        });
      } else {
        controller.collaborativeDraft.send({
          action: Activity.Change,
          content: notificationData
        });
        controller.collaborativeDraft.send({
          action: Activity.Unlock,
          content: notificationData
        });
      }
    },
    removeStream: function (event, propertyFileName, propertyPath, controller) {
      const deleteButton = event.getSource();
      const fileWrapper = deleteButton.getParent();
      const context = fileWrapper.getBindingContext();

      // streams are removed by assigning the null value
      context.setProperty(propertyPath, null);
      // When setting the property to null, the uploadUrl (@@MODEL.format) is set to "" by the model
      //	with that another upload is not possible before refreshing the page
      // (refreshing the page would recreate the URL)
      //	This is the workaround:
      //	We set the property to undefined only on the frontend which will recreate the uploadUrl
      context.setProperty(propertyPath, undefined, null);
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
        controller.collaborativeDraft.send({
          action: Activity.Lock,
          content: data
        });
        binding.attachEventOnce("patchCompleted", function () {
          controller.collaborativeDraft.send({
            action: Activity.Change,
            content: data
          });
          controller.collaborativeDraft.send({
            action: Activity.Unlock,
            content: data
          });
        });
      }
    },
    _callSideEffectsForStream: function (oEvent, oControl, oController) {
      const oFEController = FieldRuntimeHelper.getExtensionController(oController);
      if (oControl && oControl.getBindingContext().isTransient()) {
        return;
      }
      if (oControl) {
        oEvent.oSource = oControl;
      }
      oFEController._sideEffects.handleFieldChange(oEvent, FieldRuntimeHelper.getFieldStateOnChange(oEvent).state["validity"]);
    },
    getIconForMimeType: function (sMimeType) {
      return IconPool.getIconForMimeType(sMimeType);
    },
    /**
     * Method to retrieve text from value list for DataField.
     * @param sPropertyValue The property value of the datafield
     * @param sPropertyFullPath The property full path's
     * @param sDisplayFormat The display format for the datafield
     * @returns The formatted value in corresponding display format.
     */
    retrieveTextFromValueList: async function (sPropertyValue, sPropertyFullPath, sDisplayFormat) {
      let sTextProperty;
      let oMetaModel;
      let sPropertyName;
      if (sPropertyValue) {
        oMetaModel = CommonHelper.getMetaModel();
        sPropertyName = oMetaModel.getObject(`${sPropertyFullPath}@sapui.name`);
        return oMetaModel.requestValueListInfo(sPropertyFullPath, true).then(function (mValueListInfo) {
          // take the "" one if exists, otherwise take the first one in the object TODO: to be discussed
          const oValueListInfo = mValueListInfo[mValueListInfo[""] ? "" : Object.keys(mValueListInfo)[0]];
          const oValueListModel = oValueListInfo.$model;
          const oMetaModelValueList = oValueListModel.getMetaModel();
          const oParamWithKey = oValueListInfo.Parameters.find(function (oParameter) {
            return oParameter.LocalDataProperty && oParameter.LocalDataProperty.$PropertyPath === sPropertyName;
          });
          if (oParamWithKey && !oParamWithKey.ValueListProperty) {
            throw new Error(`Inconsistent value help annotation for ${sPropertyName}`);
          }
          const oTextAnnotation = oMetaModelValueList.getObject(`/${oValueListInfo.CollectionPath}/${oParamWithKey.ValueListProperty}@com.sap.vocabularies.Common.v1.Text`);
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
        }).then(function (aContexts) {
          const sDescription = sTextProperty ? aContexts[0]?.getObject()[sTextProperty] : "";
          switch (sDisplayFormat) {
            case "Description":
              return sDescription;
            case "DescriptionValue":
              return Library.getResourceBundleFor("sap.fe.core").getText("C_FORMAT_FOR_TEXT_ARRANGEMENT", [sDescription, sPropertyValue]);
            case "ValueDescription":
              return Library.getResourceBundleFor("sap.fe.core").getText("C_FORMAT_FOR_TEXT_ARRANGEMENT", [sPropertyValue, sDescription]);
            default:
              return sPropertyValue;
          }
        }).catch(function (oError) {
          const errorObj = oError;
          const sMsg = errorObj.status && errorObj.status === 404 ? `Metadata not found (${errorObj.status}) for value help of property ${sPropertyFullPath}` : errorObj.message;
          Log.error(sMsg);
        });
      }
      return sPropertyValue;
    },
    handleTypeMissmatch: function (event) {
      const fileUploader = event.getSource();
      const givenType = event.getParameter("mimeType");
      const acceptedTypes = fileUploader.getMimeType();
      if (givenType) {
        showTypeMismatchDialog(fileUploader, givenType, acceptedTypes);
      }
    },
    handleFileSizeExceed: function (event) {
      const fileUploader = event.getSource();
      showFileSizeExceedDialog(fileUploader, fileUploader.getMaximumFileSize().toFixed(3));
    },
    /**
     * Event handler to create and show who is editing the field popover.
     * @param source The avatar which is next to the field locked
     * @param view Current view
     */
    showCollaborationEditUser: function (source, view) {
      const resourceModel = ResourceModelHelper.getResourceModel(view);
      let popover = Element.getElementById(`manageCollaborationDraft--editUser`);
      if (!popover) {
        popover = new ResponsivePopover("manageCollaborationDraft--editUser", {
          showHeader: false,
          placement: "Bottom"
        });
        popover.addStyleClass("sapUiContentPadding");
        view.addDependent(popover);
      }
      const bindingPath = source.getBinding("initials")?.getBindings().find(binding => binding?.getPath()?.startsWith("/collaboration/activities")).getPath();
      const activities = source.getBindingContext("internal")?.getObject(bindingPath);
      let editingActivity;
      if (activities && activities.length > 0) {
        editingActivity = activities.find(activity => {
          return activity.key === getActivityKeyFromPath(source.getBindingContext().getPath());
        });
      }
      popover.destroyContent();
      popover.addContent(new Label({
        text: resourceModel.getText("C_COLLABORATIONAVATAR_USER_EDIT_FIELD", [`${editingActivity?.name}`])
      }));
      popover.openBy(source);
    },
    displayAggregateDetails: async function (event, aggregatedPropertyPath) {
      const link = event.getSource();
      const analyticalTable = FPMHelper.getMdcTable(link);
      const rowContext = link.getBindingContext();
      const tableRowBinding = rowContext.getBinding();

      // Get the filters corresponding to the total row
      const rowContextData = rowContext.getObject();
      const rowSpecificFilter = [];
      const rowFilter = rowContext.getFilter();
      if (rowFilter) {
        rowSpecificFilter.push(rowFilter);
      }

      // Add the filters applied to the original table
      const allFilters = rowSpecificFilter.concat(tableRowBinding.getFilters("Application"), tableRowBinding.getFilters("Control"));

      // Calculate $$aggregation parameters for the table in the popover (aggregate amount, group by currency/unit)
      const aggregation = tableRowBinding.getAggregation();
      const unitOrCurrencyName = aggregation.aggregate[aggregatedPropertyPath].unit;
      const group = {};
      group[unitOrCurrencyName] = {};
      const aggregate = {};
      aggregate[aggregatedPropertyPath] = {
        grandTotal: false,
        subtotals: false,
        unit: unitOrCurrencyName
      };

      // The item displayed in the table in the popover is a copy of the item displayed in the table
      const tableItem = link.getDependents()[0].clone();
      const currencyOrQuantityEnabledLayout = new HBox({
        renderType: "Bare",
        justifyContent: "End",
        items: [tableItem]
      });
      const aggregationParameters = {
        group,
        aggregate
      };
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
      const popover = await Util.createOrUpdateMultiUnitPopover(`${analyticalTable.getId()}-multiUnitPopover`, {
        control: analyticalTable,
        grandTotal: isPopoverForGrandTotal,
        itemsBindingInfo: oItemsBindingInfo,
        listItemContentTemplate: currencyOrQuantityEnabledLayout
      });
      analyticalTable.addDependent(popover);
      const fnOnClose = () => {
        analyticalTable.removeDependent(popover);
        popover.detachEvent("afterClose", fnOnClose);
        popover.destroy();
      };
      popover.attachEvent("afterClose", fnOnClose);
      popover.openBy(link);
    }
  };
  ObjectPath.set("sap.fe.macros.field.FieldRuntime", FieldRuntime);
  return FieldRuntime;
}, false);
//# sourceMappingURL=FieldRuntime-dbg.js.map
