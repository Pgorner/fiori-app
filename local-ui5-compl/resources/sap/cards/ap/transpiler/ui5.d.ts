/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
type ConverterOptions = {
	context: object;
	serviceUrl: string;
};

type RepeatProperty = {
	propertyName: string;
	source: string;
};

type AdaptiveCardTemplate = {
	items: Array<AdaptiveCardObject>;
};

type InternalProperty = {
	template?: AdaptiveCardTemplate;
	repeat?: RepeatProperty;
	properties?: Array<ValueDef>;
	source?: string;
};

type AdaptiveCardObjects = {
	[key: string]: AdaptiveCardObject;
};

interface AdaptiveCardObject {
	_internal?: InternalProperty;
	columns?: Array<InternalProperty>;
	items?: Array<InternalProperty>;
	type: string;
	actions?: Array<object>;
	[key: string]: any;
}

type AdaptiveBaseStructure = {
	body: Array<AdaptiveCardObjects>;
	metadata: Record<string, unknown>;
	type: string;
	$schema: string;
};

type KeyParameter = {
	key: string;
	formattedValue: string;
};

declare module "sap/cards/ap/transpiler/cardTranspiler/Transpile" {
	export function convertIntegrationCardToAdaptive(
		manifest: CardManifest,
		appIntent: string,
		keyParameters: KeyParameter[] = []
	): AdaptiveBaseStructure;
}
declare module "@sap-ux/integration-card-converter" {
	export function convertToAdaptiveCard(integrationCardManifest: CardManifest, converterOptions: ConverterOptions): AdaptiveBaseStructure;
}
