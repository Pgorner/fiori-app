/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { convertToAdaptiveCard } from "@sap-ux/integration-card-converter";
import type { CardManifest } from "sap/ui/integration/widgets/Card";

/**
 * Converts an integration card manifest to an adaptive card manifest.
 *
 * @param {CardManifest} integrationCardManifest - The integration card manifest to be converted.
 * @param {string} appIntent - The application intent to be included in the context.
 * @param {KeyParameter[]} [keyParameters] - Optional array of key parameters to be included in the context.
 * @returns The converted adaptive card manifest.
 */
export const convertIntegrationCardToAdaptive = (
	integrationCardManifest: CardManifest,
	appIntent: string,
	keyParameters: KeyParameter[] = []
) => {
	const context: Record<string, string> = {};
	keyParameters.forEach((parameter) => {
		context[parameter.key] = parameter.formattedValue;
	});

	const converterOptions = {
		context: context,
		serviceUrl: window.location.origin,
		appIntent: appIntent
	};
	return convertToAdaptiveCard(integrationCardManifest, converterOptions);
};
