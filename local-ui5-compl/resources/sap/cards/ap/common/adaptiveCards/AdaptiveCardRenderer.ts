/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import type { IAdaptiveCard } from "adaptivecards";
import * as AdaptiveCards from "adaptivecards";
import * as ACData from "adaptivecards-templating";
import * as Markdown from "markdown-it";
import { themeConfig } from "./config/ThemeConfig";

/**
 * Get the Adaptive Card for rendering
 *
 * @param {string} colorScheme - Light theme or Dark theme.
 * @param {IAdaptiveCard} adaptiveCardManifest
 * @returns {HTMLElement}
 */
export const getAdaptiveCardForRendering = (
	colorScheme: keyof typeof themeConfig,
	adaptiveCardManifest: IAdaptiveCard
): HTMLElement | undefined => {
	const markDown = Markdown();
	AdaptiveCards.AdaptiveCard.onProcessMarkdown = (text, result) => {
		result.outputHtml = markDown.render(text);
		result.didProcess = true;
	};

	const themeConfiguration = themeConfig[colorScheme];
	const adaptiveCardInstance = new AdaptiveCards.AdaptiveCard();
	const template = new ACData.Template(adaptiveCardManifest);
	const cardPayload = template.expand({
		$root: {
			name: "SAPUI5"
		}
	});

	adaptiveCardInstance.hostConfig = new AdaptiveCards.HostConfig(themeConfiguration);
	adaptiveCardInstance.parse(cardPayload);
	return adaptiveCardInstance.render();
};
