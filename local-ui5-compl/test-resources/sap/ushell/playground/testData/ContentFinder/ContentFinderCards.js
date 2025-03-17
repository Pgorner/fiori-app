// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";


    var oFrequentlyUsedCardManifest = {
        "sap.flp": {
            columns: "4",
            rows: "3"
        },
        "sap.app": {
            id: "FrequentCard",
            type: "card"
        },
        "sap.card": {
            extension: "module:sap/ushell/ui/cards/FrequentActivitiesExtension",
            data: {
                extension: {
                    method: "getData"
                }
            },
            type: "List",
            header: {
                title: "Frequently Used",
                status: {
                    text: "Top 3"
                },
                actions: [{
                    type: "Navigation",
                    parameters: { openUI: "FrequentActivities" }
                }]
            },
            content: {
                maxItems: 3,
                item: {
                    title: {
                        value: "{Name}"
                    },
                    description: {
                        value: "{Description}"
                    },
                    highlight: "{Highlight}",
                    icon: {
                        src: "{= ${Icon} === undefined ? 'sap-icon://product' : ${Icon} }",
                        label: "icon"
                    },
                    actions: [{
                        type: "Navigation",
                        parameters: {
                            title: "{Name}",
                            url: "{Url}",
                            intentSemanticObject: "{Intent/SemanticObject}",
                            intentAction: "{Intent/Action}",
                            intentAppRoute: "{Intent/AppSpecificRoute}",
                            intentParameters: "{Intent/Parameters}"
                        }
                    }]
                }
            }
        }
    };

    var oRecentlyUsedCardManifest = {
        "sap.flp": {
            columns: "4",
            rows: "4"
        },
        "sap.app": {
            id: "RecentCard",
            type: "card"
        },
        "sap.card": {
            extension: "module:sap/ushell/ui/cards/RecentActivitiesExtension",
            type: "List",
            data: {
                extension: {
                    method: "getData"
                }
            },
            header: {
                title: "Recent Activities",
                status: { text: "Top 4" },
                actions: [{
                    type: "Navigation",
                    parameters: { openUI: "RecentActivities" }
                }]
            },
            content: {
                maxItems: 4,
                item: {
                    title: {
                        label: "{{title_label}}",
                        value: "{Name}"
                    },
                    description: {
                        label: "{{description_label}}",
                        value: "{Description}"
                    },
                    icon: {
                        src: "{Icon}",
                        label: "icon"
                    },
                    highlight: "{Highlight}",
                    actions: [{
                        type: "Navigation",
                        parameters: {
                            title: "{Name}",
                            url: "{Url}",
                            intentSemanticObject: "{Intent/SemanticObject}",
                            intentAction: "{Intent/Action}",
                            intentAppRoute: "{Intent/AppSpecificRoute}",
                            intentParameters: "{Intent/Parameters}"
                        }
                    }]
                }
            }
        }
    };

    var aCards = [
        {
            appId: "F123456",
            info: oFrequentlyUsedCardManifest["sap.card"].header.status.text,
            launchUrl: "www.sap.com",
            title: oFrequentlyUsedCardManifest["sap.card"].header.title,
            type: "Dynamic / Static",
            manifest: oFrequentlyUsedCardManifest
        }, {
            appId: "F234567",
            info: oRecentlyUsedCardManifest["sap.card"].header.status.text,
            launchUrl: "www.sap.com",
            subtitle: "Application Subtitle Example With A Very Long Title To Test Line Breaks.",
            title: "Application Title Example With A Very Long Title To Test Line Breaks.",
            type: "Dynamic / Static",
            manifest: oRecentlyUsedCardManifest,
            catalogId: "MyCatalog 5",
            preview: true
        }
    ];

    return aCards;
});
