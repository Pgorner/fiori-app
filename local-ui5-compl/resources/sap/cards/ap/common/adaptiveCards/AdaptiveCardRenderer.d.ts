declare module "sap/cards/ap/common/adaptiveCards/AdaptiveCardRenderer" {
    import { themeConfig } from "sap/cards/ap/common/adaptiveCards/config/ThemeConfig";
    /**
     * Get the Adaptive Card for rendering
     *
     * @param {string} colorScheme - Light theme or Dark theme.
     * @param {IAdaptiveCard} adaptiveCardManifest
     * @returns {HTMLElement}
     */
    const getAdaptiveCardForRendering: (colorScheme: keyof typeof themeConfig, adaptiveCardManifest: IAdaptiveCard) => HTMLElement | undefined;
}
//# sourceMappingURL=AdaptiveCardRenderer.d.ts.map