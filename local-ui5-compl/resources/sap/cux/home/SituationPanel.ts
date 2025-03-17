/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Log from "sap/base/Log";
import Formatting from "sap/base/i18n/Formatting";
import NavigationHandler from "sap/fe/navigation/NavigationHandler";
import SelectionVariant from "sap/fe/navigation/SelectionVariant";
import GenericTile from "sap/m/GenericTile";
import Text from "sap/m/Text";
import TileContent from "sap/m/TileContent";
import { LoadState, URLHelper, ValueColor } from "sap/m/library";
import Event from "sap/ui/base/Event";
import Component from "sap/ui/core/Component";
import Control from "sap/ui/core/Control";
import DateFormat from "sap/ui/core/format/DateFormat";
import NumberFormat from "sap/ui/core/format/NumberFormat";
import Context from "sap/ui/model/Context";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import S4MyHome from "sap/ushell/api/S4MyHome";
import ToDoPanel, { $ToDoPanelSettings, IToDoPanel } from "./ToDoPanel";
import ToDosContainer from "./ToDosContainer";

interface Situation {
	SitnInstceKey: string;
	SitnInstceCreatedAtDateTime: string;
	SitnEngineType: string;
	_InstanceAttribute: InstanceAttribute[];
	_InstanceText: InstanceText;
	status?: LoadState;
}

interface InstanceAttribute {
	SitnInstceKey: string;
	SitnInstceAttribName: string;
	SitnInstceAttribSource: string;
	SitnInstceAttribEntityType: string;
	_InstanceAttributeValue: InstanceAttributeValue[];
}

interface InstanceAttributeValue {
	SitnInstceKey: string;
	SitnInstceAttribName: string;
	SitnInstceAttribSource: string;
	SitnInstceAttribValue: string;
}

interface InstanceText {
	SituationTitle: string;
	SituationText: string;
}

interface NavigationData {
	SitnInstanceID: string;
	SitnSemanticObject: string;
	SitnSemanticObjectAction: string;
	_NavigationParam: NavigationParam[];
}

interface NavigationParam {
	SituationNotifParamName: string;
	SituationNotifParameterVal: string;
}

class NavigationHelperError {
	public _sErrorCode!: string;
}

/**
 *
 * Panel class for managing and storing Situation cards.
 *
 * @extends ToDoPanel
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @internal
 * @experimental Since 1.121
 * @public
 *
 * @alias sap.cux.home.SituationPanel
 */
export default class SituationPanel extends ToDoPanel implements IToDoPanel {
	private _situationsModel!: ODataModel;
	private _dateFormatter!: DateFormat;
	private _decimalFormatter!: NumberFormat;

	/**
	 * Constructor for a new Situation Panel.
	 *
	 * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
	 * @param {object} [settings] Initial settings for the new control
	 */
	public constructor(id?: string, settings?: $ToDoPanelSettings) {
		super(id, settings);
	}

	/**
	 * Init lifecycle method
	 *
	 * @private
	 * @override
	 */
	public init(): void {
		super.init();

		//Configure Header
		this.setProperty("key", "situations");
		this.setProperty("title", this._i18nBundle.getText("situationsTabTitle"));
	}

	/**
	 * Generates request URLs for fetching data based on the specified card count.
	 * Overridden method to provide situation-specific URLs.
	 *
	 * @private
	 * @override
	 * @param {number} cardCount - The number of cards to retrieve.
	 * @returns {string[]} An array of request URLs.
	 */
	public generateRequestUrls(cardCount: number): string[] {
		const language = Formatting.getLanguageTag().language || "";
		return [
			this.getCountUrl(),
			`${this.getDataUrl()}&$expand=_InstanceAttribute($expand=_InstanceAttributeValue($filter=(Language eq '${language.toUpperCase()}' or Language eq ''))),_InstanceText($filter=(Language eq '${language.toUpperCase()}' or Language eq ''))&$skip=0&$top=${cardCount}`
		];
	}

	/**
	 * Generates a card template for situations.
	 * Overridden method from To-Do panel to generate situation-specific card template.
	 *
	 * @private
	 * @override
	 * @param {string} id The ID for the template card.
	 * @param {Context} context The context object.
	 * @returns {Control} The generated card control template.
	 */
	public generateCardTemplate(id: string, context: Context): Control {
		return new GenericTile(`${id}-actionTile`, {
			mode: "ActionMode",
			frameType: "TwoByOne",
			pressEnabled: true,
			header: this._getSituationMessage(
				context.getProperty("_InstanceText/0/SituationTitle") as string,
				context.getProperty("_InstanceAttribute") as InstanceAttribute[]
			),
			headerImage: "sap-icon://alert",
			valueColor: ValueColor.Critical,
			state: context.getProperty("status") as LoadState,
			press: (event: Event) => {
				void this._onPressSituation(event);
			},
			tileContent: [
				new TileContent(`${id}-actionTileContent`, {
					content: new Text(`${id}-text`, {
						text: this._getSituationMessage(
							context.getProperty("_InstanceText/0/SituationText") as string,
							context.getProperty("_InstanceAttribute") as InstanceAttribute[]
						)
					}),
					footer: S4MyHome.formatDate(context.getProperty("SitnInstceCreatedAtDateTime") as string)
				})
			]
		});
	}

	/**
	 * Compose the situation message by replacing placeholders with formatted parameter values.
	 *
	 * @private
	 * @param {string} rawText - The raw text containing placeholders.
	 * @param {InstanceAttribute[]} params - An array of parameters to replace in the text.
	 * @returns {string} The composed text with replaced placeholders.
	 */
	private _getSituationMessage(rawText: string, params: InstanceAttribute[] = []): string {
		if (!rawText?.split) {
			return rawText;
		}

		let composedText = rawText.replaceAll("\n", " ");

		params.forEach((param) => {
			if (param.SitnInstceAttribName?.length > 0) {
				const attributeSource = `0${param.SitnInstceAttribSource}`;
				const paramName = `${attributeSource}.${param.SitnInstceAttribName}`;
				const matchedAttributes = param._InstanceAttributeValue.reduce(function (matchedAttributes, attribute) {
					if (
						attribute.SitnInstceAttribSource === param.SitnInstceAttribSource &&
						attribute.SitnInstceAttribName === param.SitnInstceAttribName
					) {
						matchedAttributes.push(attribute);
					}

					return matchedAttributes;
				}, [] as InstanceAttributeValue[]);

				const formattedValues: string[] = [];
				matchedAttributes.forEach((attributeMatched) => {
					let rawVal = attributeMatched?.SitnInstceAttribValue?.trim() || "";
					let formattedVal;

					switch (param.SitnInstceAttribEntityType) {
						case "Edm.DateTime":
							formattedVal = this._getDateFormatter().format(this._getDateFormatter().parse(rawVal));
							break;
						case "Edm.Decimal":
							// If the parameter string ends with a minus sign, move it to the first position
							if (rawVal.endsWith("-")) {
								rawVal = `-${rawVal.substring(0, rawVal.length - 1)}`;
							}
							formattedVal = this._getNumberFormatter().format(Number(rawVal));
							break;
						default:
							formattedVal = rawVal;
					}

					formattedValues.push(formattedVal);
				});

				// Replace placeholders with formatted values
				composedText = composedText.split(`{${paramName}}`).join(formattedValues.join(", "));
			}
		});

		return composedText;
	}

	/**
	 * Gets the date formatter instance using the medium date pattern.
	 *
	 * @returns {DateFormat} The date formatter instance.
	 */
	private _getDateFormatter(): DateFormat {
		if (!this._dateFormatter) {
			const datePattern = Formatting.getDatePattern("medium") || "dd/MM/yyyy";
			this._dateFormatter = DateFormat.getDateInstance({ pattern: datePattern });
		}

		return this._dateFormatter;
	}

	/**
	 * Gets the number formatter instance using the settings retrieved from Configuration.
	 *
	 * @returns {NumberFormat} The number formatter instance.
	 */
	private _getNumberFormatter(): NumberFormat {
		if (!this._decimalFormatter) {
			this._decimalFormatter = NumberFormat.getFloatInstance({
				decimalSeparator: Formatting.getNumberSymbol("decimal") || ".",
				groupingSeparator: Formatting.getNumberSymbol("group") || ",",
				groupingEnabled: true
			});
		}

		return this._decimalFormatter;
	}

	/**
	 * Handle the press event for a situation.
	 *
	 * @private
	 * @param {Event} event - The event object.
	 */
	private async _onPressSituation(event: Event): Promise<void> {
		const control = event.getSource<GenericTile>();
		const context = control.getBindingContext();
		const { status, SitnInstceKey: id, SitnEngineType } = context?.getObject() as Situation;
		const url = this.getTargetAppUrl();

		if (status !== LoadState.Loading) {
			if (id) {
				try {
					const navigationTargetData = (await this._fetchNavigationTargetData(id, SitnEngineType)) as NavigationData;
					await this._executeNavigation(
						navigationTargetData,
						Component.getOwnerComponentFor(this.getParent() as ToDosContainer) as Component
					);
				} catch (error: unknown) {
					if (
						error instanceof NavigationHelperError &&
						SitnEngineType === "1" &&
						error._sErrorCode === "NavigationHandler.isIntentSupported.notSupported"
					) {
						// Navigate to the situations app
						URLHelper.redirect(this.getTargetAppUrl(), false);
					}
				}
			} else {
				URLHelper.redirect(url, false);
			}
		}
	}

	/**
	 * Retrieves the Situations model. If the model does not exist, it creates a new one.
	 *
	 * @private
	 * @returns {ODataModel} The Situations model instance.
	 */
	private _getSituationsModel(): ODataModel {
		if (!this._situationsModel) {
			this._situationsModel = new ODataModel({
				serviceUrl: "/sap/opu/odata4/sap/a_sitn2mblinstce_v4/srvd/sap/a_sitn2mblinstce_srv/0002/"
			});
		}

		return this._situationsModel;
	}

	/**
	 * Fetches navigation target data based on the provided instance ID.
	 *
	 * @private
	 * @async
	 * @param {string} instanceId - The instance ID for which to fetch navigation data.
	 * @param {string} situationEngineType - Situation Engine Type
	 * @returns {Promise<NavigationTargetData>} A promise that resolves with an object containing navigation data.
	 */
	private async _fetchNavigationTargetData(instanceId: string, situationEngineType: string): Promise<NavigationData | undefined> {
		try {
			if (situationEngineType === "1") {
				const oContextBindingNavigation = this._getSituationsModel().bindContext(`/Navigation/${instanceId}`, undefined, {
					$expand: { _NavigationParam: { $select: ["SituationNotifParamName", "SituationNotifParameterVal"] } },
					$select: ["SitnInstanceID", "SitnSemanticObject", "SitnSemanticObjectAction"]
				});
				return (await oContextBindingNavigation.requestObject()) as NavigationData;
			} else {
				return Promise.resolve({
					SitnInstanceID: instanceId,
					SitnSemanticObject: "SituationInstance",
					SitnSemanticObjectAction: "display",
					_NavigationParam: [
						{
							SituationNotifParamName: "ui-type",
							SituationNotifParameterVal: "extended"
						},
						{
							SituationNotifParamName: "SitnInstceKey",
							SituationNotifParameterVal: instanceId
						}
					]
				});
			}
		} catch (error: unknown) {
			Log.error(error instanceof Error ? error.message : "");
		}
	}

	/**
	 * Executes navigation based on provided data.
	 *
	 * @private
	 * @param {NavigationData} oData - Data object containing navigation parameters.
	 * @param {Component} ownerComponent - The owner component initiating the navigation.
	 * @returns {Promise<void>} A promise that resolves or rejects based on the navigation result.
	 */
	private _executeNavigation(oData: NavigationData, ownerComponent: Component): Promise<void> {
		return new Promise((resolve, reject) => {
			//@ts-expect-error: params
			const navigationHandler = new NavigationHandler(ownerComponent);
			const oSelectionVariant = new SelectionVariant();
			oData._NavigationParam?.map(function (param) {
				if (param.SituationNotifParamName) {
					oSelectionVariant.addSelectOption(param.SituationNotifParamName, "I", "EQ", param.SituationNotifParameterVal);
				}
			});
			const sNavigationParameters = oSelectionVariant.toJSONString();
			navigationHandler.navigate(
				oData.SitnSemanticObject,
				oData.SitnSemanticObjectAction,
				sNavigationParameters,
				resolve,
				(error: unknown) => reject(error as Error)
			);
		});
	}

	/**
	 * Get the text for the "No Data" message.
	 *
	 * @private
	 * @returns {string} The text for the "No Data" message.
	 */
	public getNoDataText(): string {
		return this._i18nBundle.getText("noSituationTitle") as string;
	}
}
