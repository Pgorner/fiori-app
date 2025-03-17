declare module "sap/cards/ap/common/helpers/I18nHelper" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import ResourceBundle from "sap/base/i18n/ResourceBundle";
    import type { Group } from "sap/ui/integration/widgets/Card";
    /**
     *  Resolves i18n text for a given key.
     *
     *  @param {string} i18nKey  having unresolved i18n keys
     *  @param {ResourceBundle} resourceBundle - The resource bundle containing i18n values.
     *  @return {string} - The resolved i18n text.
     */
    const resolvei18nText: (i18nKey: string, resourceBundle: ResourceBundle) => string;
    /**
     * Updates groups with resolved i18n texts.
     *
     * @param {Array<Group>} groups - The groups to update.
     * @param {ResourceBundle} resourceBundle - The resource bundle containing i18n values.
     */
    const updateGroups: (groups: Array<Group>, resourceBundle: ResourceBundle) => void;
    /**
     * Resolves i18n texts for an integration card manifest.
     *
     * @param {CardManifest} cardManifest - The manifest with unresolved i18n keys.
     * @param {ResourceBundle} resourceBundle - The resource bundle containing i18n values.
     * @return {CardManifest} - The updated manifest with resolved i18n keys.
     */
    const resolvei18nTextsForIntegrationCard: (cardManifest: CardManifest, resourceBundle: ResourceBundle) => CardManifest;
}
//# sourceMappingURL=I18nHelper.d.ts.map