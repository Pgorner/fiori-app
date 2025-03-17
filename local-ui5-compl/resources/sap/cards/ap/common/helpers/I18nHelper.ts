/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import type { CardManifest, Group, ObjectContent } from "sap/ui/integration/widgets/Card";

/**
 *  Resolves i18n text for a given key.
 *
 *  @param {string} i18nKey  having unresolved i18n keys
 *  @param {ResourceBundle} resourceBundle - The resource bundle containing i18n values.
 *  @return {string} - The resolved i18n text.
 */
const resolvei18nText = function (i18nKey: string, resourceBundle: ResourceBundle): string {
	if (i18nKey.startsWith("{{") && i18nKey.endsWith("}}")) {
		const key = i18nKey.slice(2, -2); // Remove the leading "{{" and trailing "}}"
		return resourceBundle.getText(key) || key;
	}

	return i18nKey;
};

/**
 * Updates groups with resolved i18n texts.
 *
 * @param {Array<Group>} groups - The groups to update.
 * @param {ResourceBundle} resourceBundle - The resource bundle containing i18n values.
 */
const updateGroups = function (groups: Array<Group>, resourceBundle: ResourceBundle) {
	groups.forEach(function (group) {
		const { title } = group;
		group.title = resolvei18nText(title, resourceBundle);
		group.items.forEach(function (item) {
			const { label, value } = item;

			item.label = resolvei18nText(label, resourceBundle);
			item.value = resolvei18nText(value, resourceBundle);
		});
	});
};

/**
 * Resolves i18n texts for an integration card manifest.
 *
 * @param {CardManifest} cardManifest - The manifest with unresolved i18n keys.
 * @param {ResourceBundle} resourceBundle - The resource bundle containing i18n values.
 * @return {CardManifest} - The updated manifest with resolved i18n keys.
 */
export const resolvei18nTextsForIntegrationCard = function (cardManifest: CardManifest, resourceBundle: ResourceBundle): CardManifest {
	const { "sap.app": sapApp, "sap.card": sapCard } = cardManifest;
	const { title: appTitle, subTitle: appSubTitle } = sapApp;
	const { header } = sapCard;
	const { title: headerTitle, subTitle: headerSubTitle, mainIndicator } = header;
	const groups = (sapCard.content as ObjectContent).groups;

	sapApp.title = resolvei18nText(appTitle, resourceBundle);
	sapApp.subTitle = appSubTitle.includes(" | ")
		? appSubTitle
				.split(" | ")
				.map((part, index) => (index === 0 ? resolvei18nText(part, resourceBundle) : part))
				.join(" | ")
		: resolvei18nText(appSubTitle, resourceBundle);
	header.title = resolvei18nText(headerTitle!, resourceBundle);
	header.subTitle = resolvei18nText(headerSubTitle!, resourceBundle);

	if (mainIndicator) {
		const { unit, number } = mainIndicator;
		if (unit) {
			mainIndicator.unit = resolvei18nText(unit, resourceBundle);
		}
		if (number) {
			mainIndicator.number = resolvei18nText(number, resourceBundle);
		}
	}

	updateGroups(groups, resourceBundle);

	return cardManifest;
};
