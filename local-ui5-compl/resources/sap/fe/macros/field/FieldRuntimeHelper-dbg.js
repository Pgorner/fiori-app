/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/CommonUtils", "sap/fe/core/helpers/KeepAliveHelper", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/helpers/ResourceModelHelper", "sap/m/IllustratedMessage", "sap/m/IllustratedMessageType", "sap/m/ResponsivePopover", "sap/m/library", "sap/ui/Device", "sap/ui/util/openWindow", "../controls/FieldWrapper"], function (Log, CommonUtils, KeepAliveHelper, ModelHelper, ResourceModelHelper, IllustratedMessage, IllustratedMessageType, ResponsivePopover, mobilelibrary, Device, openWindow, FieldWrapper) {
  "use strict";

  var getResourceModel = ResourceModelHelper.getResourceModel;
  const FieldRuntimeHelper = {
    fetchRecommendations: function (field, controller) {
      const view = CommonUtils.getTargetView(field);
      const fieldBindingContext = field.getBindingContext();
      let recommendationsContext;

      // determine recommendation context to use
      const fieldBinding = fieldBindingContext?.getBinding();
      if (fieldBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
        // inside a table, use the row
        recommendationsContext = fieldBindingContext;
      } else {
        // inside a form now
        // can have 1-1 navigation property/direct property - use view context
        recommendationsContext = view.getBindingContext();
      }
      const feController = FieldRuntimeHelper.getExtensionController(controller);
      const valueHelpId = field.getValueHelp();
      // update telemetry data as per user selection
      const metaPath = ModelHelper.getMetaPathForContext(field.getBindingContext());
      const propertyPath = field.data("sourcePath").replace(metaPath, "");
      const fieldPath = `${field.getBindingContext()?.getPath()}${propertyPath}`;
      const selectedValue = field.getValue();
      feController.recommendations.updateTelemetryDataBasedOnUserSelection(fieldPath, selectedValue);
      if (valueHelpId && valueHelpId.includes("::TableValueHelp::")) {
        const tableId = valueHelpId.substring(0, valueHelpId.indexOf("::TableValueHelp::"));
        const table = view.byId(tableId);
        const contextIdentifier = table?.getParent()?.getIdentifierColumn();
        feController.recommendations.fetchAndApplyRecommendationsOnFieldChange(field, {
          context: recommendationsContext,
          contextIdentifier
        });
      } else {
        feController.recommendations.fetchAndApplyRecommendationsOnFieldChange(field, {
          context: recommendationsContext
        });
      }
    },
    getExtensionController: function (oController) {
      return oController.isA("sap.fe.core.ExtensionAPI") ? oController._controller : oController;
    },
    /**
     * Gets the field value and validity on a change event.
     * @param oEvent The event object passed by the change event
     * @returns Field value and validity
     */
    getFieldStateOnChange: function (oEvent) {
      let oSourceField = oEvent.getSource(),
        mFieldState;
      const _isBindingStateMessages = function (oBinding) {
        return oBinding && oBinding.getDataState() ? oBinding.getDataState().getInvalidValue() === undefined : true;
      };
      if (oSourceField.isA("sap.fe.macros.field.Field")) {
        oSourceField = oSourceField.getContent();
      }
      if (oSourceField.isA("sap.fe.macros.field.FieldAPI")) {
        oSourceField = oSourceField.getContent();
      }
      if (oSourceField.isA(FieldWrapper.getMetadata().getName()) && oSourceField.getEditMode() === "Editable") {
        oSourceField = oSourceField.getContentEdit()[0];
      }
      if (oSourceField.isA("sap.ui.mdc.Field")) {
        let bIsValid = oEvent.getParameter("valid") || oEvent.getParameter("isValid");
        if (bIsValid === undefined) {
          if (oSourceField.getMaxConditions() === 1) {
            const oValueBindingInfo = oSourceField.getBindingInfo("value");
            bIsValid = _isBindingStateMessages(oValueBindingInfo && oValueBindingInfo.binding);
          }
          if (oSourceField.getValue() === "" && !oSourceField.getProperty("required")) {
            bIsValid = true;
          }
        }
        mFieldState = {
          fieldValue: oSourceField.getValue(),
          validity: !!bIsValid
        };
      } else {
        // oSourceField extends from a FileUploader || Input || is a CheckBox
        const oBinding = oSourceField.getBinding("uploadUrl") || oSourceField.getBinding("value") || oSourceField.getBinding("selected");
        mFieldState = {
          fieldValue: oBinding && oBinding.getValue(),
          validity: _isBindingStateMessages(oBinding)
        };
      }
      return {
        field: oSourceField,
        state: mFieldState
      };
    },
    /**
     * Handles the press event for a link.
     * @param oEvent The press event
     * @returns The pressed link
     */
    pressLink: async function (oEvent) {
      const oSource = oEvent.getSource();
      let sapmLink = oSource.isA("sap.m.ObjectIdentifier") ? oSource.findElements(false, elem => {
        return elem.isA("sap.m.Link");
      })[0] : oSource;
      if (oSource?.isA("sap.fe.macros.controls.TextLink")) {
        //when the link is inside a TextLink control, the dependent will be on the TextLink
        sapmLink = oSource.getContent();
      }
      if (oSource.getDependents() && oSource.getDependents().length > 0 && sapmLink.getProperty("text") !== "") {
        const oFieldInfo = oSource.getDependents()[0];
        if (oFieldInfo && oFieldInfo.isA("sap.ui.mdc.Link")) {
          await FieldRuntimeHelper.openLink(oFieldInfo, sapmLink);
        }
      }
      return sapmLink;
    },
    openLink: async function (mdcLink, sapmLink) {
      try {
        const hRef = await mdcLink.getTriggerHref();
        if (!hRef) {
          try {
            await mdcLink._useDelegateItems();
            const linkItems = await mdcLink.retrieveLinkItems();
            if (linkItems?.length === 0 && mdcLink.getPayload().hasQuickViewFacets === "false") {
              const popover = FieldRuntimeHelper.createPopoverWithNoTargets(mdcLink);
              mdcLink.addDependent(popover);
              popover.openBy(sapmLink);
            } else {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              await mdcLink.open(sapmLink);
            }
          } catch (error) {
            Log.error(`Cannot retrieve the QuickView Popover dialog: ${error}`);
          }
        } else {
          const view = CommonUtils.getTargetView(sapmLink);
          const appComponent = CommonUtils.getAppComponent(view);
          const shellService = appComponent.getShellServices();
          const shellHash = shellService.parseShellHash(hRef);
          const navArgs = {
            target: {
              semanticObject: shellHash.semanticObject,
              action: shellHash.action
            },
            params: shellHash.params
          };
          KeepAliveHelper.storeControlRefreshStrategyForHash(view, shellHash);
          if (CommonUtils.isStickyEditMode(sapmLink) !== true) {
            //URL params and xappState has been generated earlier hence using navigate
            await shellService.navigate(navArgs, appComponent);
          } else {
            try {
              const newHref = await shellService.hrefForExternal(navArgs, appComponent);
              openWindow(newHref);
            } catch (error) {
              Log.error(`Error while retireving hrefForExternal : ${error}`);
            }
          }
        }
      } catch (error) {
        Log.error(`Error triggering link Href: ${error}`);
      }
    },
    createPopoverWithNoTargets: function (mdcLink) {
      const mdcLinkId = mdcLink.getId();
      const illustratedMessageSettings = {
        title: getResourceModel(mdcLink).getText("M_ILLUSTRATEDMESSAGE_TITLE"),
        description: getResourceModel(mdcLink).getText("M_ILLUSTRATEDMESSAGE_DESCRIPTION"),
        enableFormattedText: true,
        illustrationSize: "Dot",
        // IllustratedMessageSize.Dot not available in "@types/openui5": "1.107.0"
        illustrationType: IllustratedMessageType.Tent
      };
      const illustratedMessage = new IllustratedMessage(`${mdcLinkId}-illustratedmessage`, illustratedMessageSettings);
      const popoverSettings = {
        horizontalScrolling: false,
        showHeader: Device.system.phone,
        placement: mobilelibrary.PlacementType.Auto,
        content: [illustratedMessage],
        afterClose: function (event) {
          if (event.getSource()) {
            event.getSource().destroy();
          }
        }
      };
      return new ResponsivePopover(`${mdcLinkId}-popover`, popoverSettings);
    }
  };
  return FieldRuntimeHelper;
}, false);
//# sourceMappingURL=FieldRuntimeHelper-dbg.js.map
