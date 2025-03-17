'use strict';
sap.ui.define([
    'sap/cards/ap/common/thirdparty/adaptivecards',
    'sap/cards/ap/common/thirdparty/adaptivecards-templating',
    'sap/cards/ap/common/thirdparty/markdown-it',
    './config/ThemeConfig'
], function (AdaptiveCards, ACData, Markdown, ___config_ThemeConfig) {
    'use strict';
    const themeConfig = ___config_ThemeConfig['themeConfig'];
    const getAdaptiveCardForRendering = (colorScheme, adaptiveCardManifest) => {
        const markDown = Markdown();
        AdaptiveCards.AdaptiveCard.onProcessMarkdown = (text, result) => {
            result.outputHtml = markDown.render(text);
            result.didProcess = true;
        };
        const themeConfiguration = themeConfig[colorScheme];
        const adaptiveCardInstance = new AdaptiveCards.AdaptiveCard();
        const template = new ACData.Template(adaptiveCardManifest);
        const cardPayload = template.expand({ $root: { name: 'SAPUI5' } });
        adaptiveCardInstance.hostConfig = new AdaptiveCards.HostConfig(themeConfiguration);
        adaptiveCardInstance.parse(cardPayload);
        return adaptiveCardInstance.render();
    };
    var __exports = { __esModule: true };
    __exports.getAdaptiveCardForRendering = getAdaptiveCardForRendering;
    return __exports;
});