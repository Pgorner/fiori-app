/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { convertIntegrationCardToAdaptive } from "sap/cards/ap/transpiler/cardTranspiler/Transpile";
import SelectionVariant from "sap/fe/navigation/SelectionVariant";
import Component from "sap/ui/core/Component";
import type { CardManifest } from "sap/ui/integration/widgets/Card";
import { AppManifest, ApplicationInfo, ODataModelVersion, fetchApplicationInfo } from "../helpers/ApplicationInfo";
import { resolvei18nTextsForIntegrationCard } from "../helpers/I18nHelper";
import { createContextParameter } from "../odata/ODataUtils";
/**
 * The card types
 *
 * @alias sap.cards.ap.common.services.RetrieveCard.CardTypes
 * @private
 * @restricted sap.fe, sap.ui.generic.app
 */
export enum CardTypes {
	/**
	 * Integration card
	 * @restricted sap.fe, sap.ui.generic.app
	 */
	INTEGRATION = "integration",
	/**
	 * Adaptive card
	 * @restricted sap.fe, sap.ui.generic.app
	 */
	ADAPTIVE = "adaptive"
}
type CardHostParam = {
	componentName: string;
	entitySet: string;
	cardType?: CardTypes;
};
type SelectionVariantJSON = {
	SelectionVariantID?: string;
	PresentationVariantID?: string;
	Text?: string;
	ODataFilterExpression?: string;
	Version?: string;
	FilterContextUrl?: string;
	ParameterContextUrl?: string;
};
/**
 * The options for fetching the card manifest
 *
 * @alias sap.cards.ap.common.services.RetrieveCard.CardManifestFetchOptions
 * @private
 * @restricted sap.fe, sap.ui.generic.app
 */
type CardManifestFetchOptions = {
	/**
	 * Defines the card type
	 * @restricted sap.fe, sap.ui.generic.app
	 */
	cardType?: CardTypes;
	/**
	 * Defines include actions
	 * @restricted sap.fe, sap.ui.generic.app
	 */
	includeActions?: boolean;
	/**
	 * Defines the hide Actions
	 */
	hideActions?: boolean;
	/**
	 * Checks whether the app is running in design mode or not will be used to invalidate resource bundle cache and for other design time specific operations
	 */
	isDesignMode?: boolean;
};

type KeyParameter = {
	key: string;
	formattedValue: string;
};

/**
 * Fetches the card path from the application manifest
 *
 * @param {CardType} type - The type of card
 * @param {string} entitySet - The entity set
 * @param {AppManifest} applicationManifest - The application manifest
 * @returns The card path
 */
export const getCardPath = (type: CardTypes, entitySet: string, applicationManifest: AppManifest) => {
	const manifest = type === CardTypes.INTEGRATION ? "manifest.json" : "adaptive-manifest.json";
	const sapCardsAP = applicationManifest["sap.cards.ap"];

	if (sapCardsAP === undefined || Object.keys(sapCardsAP).length === 0) {
		return "";
	}

	const cardsConfig = sapCardsAP["embeds"]["ObjectPage"];
	if (cardsConfig === undefined || Object.keys(cardsConfig["manifests"]).length === 0) {
		return "";
	}

	const defaultCard = cardsConfig["manifests"][entitySet || cardsConfig.default][0];
	const localUri = defaultCard.localUri.endsWith("/") ? defaultCard.localUri : defaultCard.localUri + "/";
	return "/" + localUri + manifest;
};

/**
 * clean up the unnecessary variant information
 *
 * @param selectionVariant
 * @returns
 */
const cleanupVariantInformation = (selectionVariant: SelectionVariantJSON) => {
	if (selectionVariant.hasOwnProperty("SelectionVariantID")) {
		delete selectionVariant.SelectionVariantID;
	} else if (selectionVariant.hasOwnProperty("PresentationVariantID")) {
		delete selectionVariant.PresentationVariantID;
	}
	delete selectionVariant.Text;
	delete selectionVariant.ODataFilterExpression;
	delete selectionVariant.Version;
	delete selectionVariant.FilterContextUrl;
	delete selectionVariant.ParameterContextUrl;

	return selectionVariant;
};

/**
 * Fetches the manifest from the given url
 *
 * @param {string} url - The url of the manifest
 * @returns The manifest
 */
export const fetchManifest = async (url: string) => {
	try {
		const response = await fetch(url);
		return await response.json();
	} catch (error) {
		return null;
	}
};
/**
 * Fetches the card manifest for the object page
 *
 * @param {Component} appComponent
 * @param {CardHostParam} hostOptions
 * @param {Boolean} isDesignMode
 * @returns The card manifest
 * @private
 */
export const _getObjectPageCardManifest = async function (
	appComponent: Component,
	hostOptions: CardHostParam,
	isDesignMode: boolean = false
) {
	const { entitySet, cardType } = hostOptions;
	let applicationManifest = appComponent.getManifest() as AppManifest;
	const sapPlatformAbap = applicationManifest["sap.platform.abap"];
	const applicationUrlOnAbap = sapPlatformAbap?.uri || "";

	if (isDesignMode) {
		applicationManifest = await fetchManifest(applicationUrlOnAbap + "/manifest.json");
	}
	const cardsPath = getCardPath(cardType || CardTypes.INTEGRATION, entitySet, applicationManifest);

	if (cardsPath.length === 0) {
		return Promise.reject("No cards available for this application");
	}

	const cardUrl = applicationUrlOnAbap.endsWith("/")
		? applicationUrlOnAbap.substring(0, applicationUrlOnAbap.length - 1) + cardsPath
		: applicationUrlOnAbap + cardsPath;

	return fetchManifest(cardUrl);
};

/**
 * Add actions to the card header
 *  - ibnTarget contains the semantic object and action
 *  - ibnParams contains the context parameters and sap-xapp-state-data - which is the stringified selection variant of the context parameters
 *
 * @param cardManifest
 * @param applicationInfo
 */
const addActionsToCardHeader = async function (cardManifest: CardManifest, applicationInfo: ApplicationInfo) {
	const { semanticObject, action, entitySetWithObjectContext, appModel, odataModel } = applicationInfo;
	const header = cardManifest["sap.card"]["header"];
	const ibnParams: Record<string, string> = {};
	const selectionVariant = new SelectionVariant();
	const isODataV4 = odataModel === ODataModelVersion.V4;
	const context = await createContextParameter(entitySetWithObjectContext, appModel, isODataV4);

	context.split(",").forEach(function (param) {
		const [key, value] = param.split("=");
		ibnParams[key] = value;
		selectionVariant.addSelectOption(key, "I", "EQ", value);
	});
	ibnParams["sap-xapp-state-data"] = JSON.stringify({
		selectionVariant: cleanupVariantInformation(selectionVariant.toJSONObject())
	});
	header.actions = [
		{
			type: "Navigation",
			parameters: {
				ibnTarget: { semanticObject, action },
				ibnParams
			}
		}
	];
};
/**
 * Checks if the leanDT card exists in the application at runtime or not
 *
 * @param appComponent
 * @param isDesignMode
 * @returns boolean
 */
const checkIfCardExists = (appComponent: Component, isDesignMode: boolean = false): boolean => {
	const mApplicationManifest = appComponent.getManifest() as AppManifest;
	return !(!mApplicationManifest["sap.cards.ap"] && !isDesignMode);
};

/**
 * Function to handle the hide actions for the card
 *
 * @param appComponent
 * @param mManifest
 */
const handleHideActions = function (appComponent: Component, mManifest: CardManifest) {
	const appManifest = appComponent.getManifest() as AppManifest;
	const cardsConfig = appManifest["sap.cards.ap"]?.embeds.ObjectPage;

	if (cardsConfig && Object.keys(cardsConfig["manifests"]).length > 0) {
		const defaultEntitySet = cardsConfig?.["default"];
		const hideActions = (defaultEntitySet && cardsConfig["manifests"][defaultEntitySet]?.[0]?.hideActions) || false;
		const mParameters = mManifest?.["sap.card"]?.configuration?.parameters;

		if (hideActions && mParameters?._adaptiveFooterActionParameters) {
			delete mParameters["_adaptiveFooterActionParameters"];
		}
		if (hideActions && mParameters?.footerActionParameters) {
			delete mParameters["footerActionParameters"];
		}
		if (hideActions && mManifest?.["sap.card"]?.footer) {
			delete mManifest["sap.card"]["footer"];
		}
	}
};

/**
 * Fetches key parameters for the given application component.
 *
 * @param {Component} appComponent - The application component.
 * @returns {Promise<KeyParameter[]>} - A promise that resolves to an array of key parameters.
 */
export const getKeyParameters = async (appComponent: Component): Promise<KeyParameter[]> => {
	const applicationInfo = await fetchApplicationInfo(appComponent);
	const { entitySetWithObjectContext, appModel, odataModel } = applicationInfo;
	const bODataV4 = odataModel === ODataModelVersion.V4;
	const objectPath = await createContextParameter(entitySetWithObjectContext, appModel, bODataV4);

	return objectPath.split(",").map((parameter) => {
		const [key, value] = parameter.split("=");
		const formattedValue = value.replace("guid", "").replaceAll("'", "");

		return { key, formattedValue };
	});
};

/**
 * Updates the data path of the card header in the provided card manifest by reference.
 *
 * @param {CardManifest} cardManifest - The card manifest object that contains the header data.
 */
function updateHeaderDataPath(cardManifest: CardManifest) {
	const headerData = cardManifest["sap.card"].header.data;

	if (headerData?.path && headerData.path !== "/header/d/") {
		headerData.path = "/header/d/";
	}
}

/**
 * Fetches the card manifest for the object page
 *
 * @param {Component} appComponent The root component of the application
 * @param {CardManifestFetchOptions} fetchOptions The options
 * @returns {Promise<any>} The card manifest
 * @private
 * @since 1.124.0
 * @restricted sap.fe, sap.ui.generic.app
 */
export const getObjectPageCardManifestForPreview = async function (appComponent: Component, fetchOptions?: CardManifestFetchOptions) {
	const isDesignMode = fetchOptions?.isDesignMode;

	if (!checkIfCardExists(appComponent, isDesignMode ?? false)) {
		return Promise.reject("No cards available for this application");
	}

	const applicationInfo = await fetchApplicationInfo(appComponent, { isDesignMode });
	const { componentName, entitySet, context, resourceBundle, semanticObject, action } = applicationInfo;
	const hostOptions = {
		cardType: CardTypes.INTEGRATION,
		componentName: componentName,
		entitySet: entitySet,
		context
	};

	const cardManifest = await _getObjectPageCardManifest(appComponent, hostOptions, fetchOptions?.isDesignMode ?? false);

	if (!cardManifest || Object.keys(cardManifest).length === 0) {
		return Promise.reject("No cards available for this application");
	}

	const keyParameters = await getKeyParameters(appComponent);

	if (fetchOptions?.hideActions ?? true) {
		handleHideActions(appComponent, cardManifest);
	}

	const cardType = fetchOptions?.cardType || CardTypes.INTEGRATION;
	if (cardType === CardTypes.INTEGRATION) {
		cardManifest["sap.card"]["data"]["request"]["headers"]["Accept-Language"] ??= "{{parameters.LOCALE}}";
		const parameters = cardManifest["sap.card"].configuration.parameters;
		const data = cardManifest["sap.card"]["data"];
		const contentUrl = data["request"]["batch"]["content"]["url"];
		if (contentUrl.includes("{{parameters.contextParameters}}")) {
			/**
			 * Replace the contextParameters with the object context
			 * This is required for the integration card to fetch the data until all the manifests are regenerated.
			 */
			cardManifest["sap.card"]["configuration"]["parameters"]["contextParameters"] = {
				type: "string",
				value: hostOptions.context
			};
		}
		keyParameters.forEach((parameter) => {
			if (parameters[parameter.key] !== undefined) {
				parameters[parameter.key]["value"] = parameter.formattedValue;
			}
		});

		if (fetchOptions?.includeActions ?? true) {
			await addActionsToCardHeader(cardManifest, applicationInfo);
		}

		updateHeaderDataPath(cardManifest);
		return resolvei18nTextsForIntegrationCard(cardManifest, resourceBundle);
	} else {
		const cardManifestWithResolvedI18nTexts = resolvei18nTextsForIntegrationCard(cardManifest, resourceBundle);
		return convertIntegrationCardToAdaptive(cardManifestWithResolvedI18nTexts, `${semanticObject}-${action}`, keyParameters);
	}
};
