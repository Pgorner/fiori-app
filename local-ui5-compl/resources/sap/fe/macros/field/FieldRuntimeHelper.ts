import Log from "sap/base/Log";
import type { EnhanceWithUI5 } from "sap/fe/base/ClassSupport";
import CommonUtils from "sap/fe/core/CommonUtils";
import type ExtensionAPI from "sap/fe/core/ExtensionAPI";
import type PageController from "sap/fe/core/PageController";
import KeepAliveHelper from "sap/fe/core/helpers/KeepAliveHelper";
import ModelHelper from "sap/fe/core/helpers/ModelHelper";
import { getResourceModel } from "sap/fe/core/helpers/ResourceModelHelper";
import type TextLink from "sap/fe/macros/controls/TextLink";
import type { LinkDelegatePayload } from "sap/fe/macros/quickView/QuickViewDelegate";
import type { Button$PressEvent } from "sap/m/Button";
import type { $IllustratedMessageSettings } from "sap/m/IllustratedMessage";
import IllustratedMessage from "sap/m/IllustratedMessage";
import IllustratedMessageType from "sap/m/IllustratedMessageType";
import type Link from "sap/m/Link";
import type ObjectIdentifier from "sap/m/ObjectIdentifier";
import type { $ResponsivePopoverSettings } from "sap/m/ResponsivePopover";
import ResponsivePopover from "sap/m/ResponsivePopover";
import mobilelibrary from "sap/m/library";
import Device from "sap/ui/Device";
import type Event from "sap/ui/base/Event";
import type Control from "sap/ui/core/Control";
import type Element from "sap/ui/core/Element";
import type { default as Field, Field$ChangeEvent, default as MDCField } from "sap/ui/mdc/Field";
import type MdcLink from "sap/ui/mdc/Link";
import type DataState from "sap/ui/model/DataState";
import type PropertyBinding from "sap/ui/model/PropertyBinding";
import type Context from "sap/ui/model/odata/v4/Context";
import openWindow from "sap/ui/util/openWindow";
import FieldWrapper from "../controls/FieldWrapper";
import type TableAPI from "../table/TableAPI";
import type FieldAPI from "./FieldAPI";

const FieldRuntimeHelper = {
	fetchRecommendations: function (field: Field, controller: PageController | ExtensionAPI): void {
		const view = CommonUtils.getTargetView(field);
		const fieldBindingContext = field.getBindingContext();
		let recommendationsContext: Context;

		// determine recommendation context to use
		const fieldBinding = (fieldBindingContext as Context)?.getBinding();

		if (fieldBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
			// inside a table, use the row
			recommendationsContext = fieldBindingContext as Context;
		} else {
			// inside a form now
			// can have 1-1 navigation property/direct property - use view context
			recommendationsContext = view.getBindingContext();
		}
		const feController = FieldRuntimeHelper.getExtensionController(controller);
		const valueHelpId = field.getValueHelp();
		// update telemetry data as per user selection
		const metaPath = ModelHelper.getMetaPathForContext(field.getBindingContext() as Context);
		const propertyPath = field.data("sourcePath").replace(metaPath, "");
		const fieldPath = `${field.getBindingContext()?.getPath()}${propertyPath}`;
		const selectedValue = field.getValue();
		feController.recommendations.updateTelemetryDataBasedOnUserSelection(fieldPath, selectedValue);

		if (valueHelpId && valueHelpId.includes("::TableValueHelp::")) {
			const tableId = valueHelpId.substring(0, valueHelpId.indexOf("::TableValueHelp::"));
			const table = view.byId(tableId);
			const contextIdentifier = (table?.getParent() as TableAPI)?.getIdentifierColumn() as string[];
			feController.recommendations.fetchAndApplyRecommendationsOnFieldChange(field, {
				context: recommendationsContext,
				contextIdentifier
			});
		} else {
			feController.recommendations.fetchAndApplyRecommendationsOnFieldChange(field, { context: recommendationsContext });
		}
	},

	getExtensionController: function (oController: PageController | ExtensionAPI): PageController {
		return oController.isA<ExtensionAPI>("sap.fe.core.ExtensionAPI") ? oController._controller : oController;
	},

	/**
	 * Gets the field value and validity on a change event.
	 * @param oEvent The event object passed by the change event
	 * @returns Field value and validity
	 */
	getFieldStateOnChange: function (oEvent: Field$ChangeEvent & Event<{ isValid: boolean }, Control>): {
		field: Field;
		state: {
			fieldValue?: unknown;
			validity: boolean;
		};
	} {
		let oSourceField = oEvent.getSource(),
			mFieldState: {
				fieldValue?: unknown;
				validity: boolean;
			};
		const _isBindingStateMessages = function (oBinding: PropertyBinding & { getDataState: () => DataState }): boolean {
			return oBinding && oBinding.getDataState() ? oBinding.getDataState().getInvalidValue() === undefined : true;
		};
		if (oSourceField.isA<Field>("sap.fe.macros.field.Field")) {
			oSourceField = oSourceField.getContent() as MDCField;
		}
		if (oSourceField.isA<EnhanceWithUI5<FieldAPI>>("sap.fe.macros.field.FieldAPI")) {
			oSourceField = oSourceField.getContent() as MDCField;
		}

		if (
			oSourceField.isA<EnhanceWithUI5<FieldWrapper>>(FieldWrapper.getMetadata().getName()) &&
			oSourceField.getEditMode() === "Editable"
		) {
			oSourceField = (oSourceField as EnhanceWithUI5<FieldWrapper>).getContentEdit()[0] as MDCField;
		}

		if (oSourceField.isA<MDCField>("sap.ui.mdc.Field")) {
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
			const oBinding =
				(oSourceField as Control).getBinding("uploadUrl") ||
				(oSourceField as Control).getBinding("value") ||
				(oSourceField as Control).getBinding("selected");
			mFieldState = {
				fieldValue: oBinding && (oBinding as PropertyBinding).getValue(),
				validity: _isBindingStateMessages(oBinding as PropertyBinding & { getDataState: () => DataState })
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
	pressLink: async function (oEvent: Button$PressEvent): Promise<Link> {
		const oSource = oEvent.getSource();
		let sapmLink = oSource.isA<ObjectIdentifier>("sap.m.ObjectIdentifier")
			? oSource.findElements(false, (elem: Element) => {
					return elem.isA<Link>("sap.m.Link");
			  })[0]
			: oSource;
		if (oSource?.isA<TextLink>("sap.fe.macros.controls.TextLink")) {
			//when the link is inside a TextLink control, the dependent will be on the TextLink
			sapmLink = oSource.getContent() as Link;
		}

		if (oSource.getDependents() && oSource.getDependents().length > 0 && sapmLink.getProperty("text") !== "") {
			const oFieldInfo = oSource.getDependents()[0];
			if (oFieldInfo && oFieldInfo.isA<MdcLink>("sap.ui.mdc.Link")) {
				await FieldRuntimeHelper.openLink(oFieldInfo, sapmLink as Link);
			}
		}
		return sapmLink as Link;
	},

	openLink: async function (mdcLink: MdcLink, sapmLink: Link): Promise<void> {
		try {
			const hRef = await mdcLink.getTriggerHref();
			if (!hRef) {
				try {
					await (mdcLink as unknown as { _useDelegateItems: Function })._useDelegateItems();
					const linkItems = await mdcLink.retrieveLinkItems();
					if (linkItems?.length === 0 && (mdcLink.getPayload() as LinkDelegatePayload).hasQuickViewFacets === "false") {
						const popover: ResponsivePopover = FieldRuntimeHelper.createPopoverWithNoTargets(mdcLink);
						mdcLink.addDependent(popover);
						popover.openBy(sapmLink as unknown as Control);
					} else {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						await mdcLink.open(sapmLink as unknown as Control);
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
				if (CommonUtils.isStickyEditMode(sapmLink as unknown as Control) !== true) {
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

	createPopoverWithNoTargets: function (mdcLink: MdcLink): ResponsivePopover {
		const mdcLinkId = mdcLink.getId();
		const illustratedMessageSettings: $IllustratedMessageSettings = {
			title: getResourceModel(mdcLink as unknown as Control).getText("M_ILLUSTRATEDMESSAGE_TITLE"),
			description: getResourceModel(mdcLink as unknown as Control).getText("M_ILLUSTRATEDMESSAGE_DESCRIPTION"),
			enableFormattedText: true,
			illustrationSize: "Dot", // IllustratedMessageSize.Dot not available in "@types/openui5": "1.107.0"
			illustrationType: IllustratedMessageType.Tent
		};
		const illustratedMessage = new IllustratedMessage(`${mdcLinkId}-illustratedmessage`, illustratedMessageSettings);
		const popoverSettings: $ResponsivePopoverSettings = {
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

export default FieldRuntimeHelper;
