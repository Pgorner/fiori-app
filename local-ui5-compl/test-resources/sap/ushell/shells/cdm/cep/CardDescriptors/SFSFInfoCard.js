// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    return {
        "sap.app": {
            id: "successfactors.card.cardservicereuse.infocard",
            i18n: "i18n/i18n.properties",
            info: "Card Service Reuse for Info Card",
            tags: {
                keywords: [
                    "Info Card"
                ]
            },
            type: "card",
            title: "HP4 Info Card",
            subTitle: "Info Card Reuse",
            shortTitle: "HP4 Info Card",
            description: "Card Service Reuse for Info Card",
            applicationVersion: {
                version: "1.0.2"
            }
        },
        "sap.card": {
            data: {
                request: {
                    url: "{{destinations.myDestination}}/rest/experience/cardservice/v1/homepage/itemcollection?category={parameters>/category/value}&forPerson=false&limit=1",
                    parameters: {
                        $format: "json"
                    },
                    withCredentials: true
                }
            },
            type: "Object",
            footer: {
                actionsStrip: [
                    {
                        text: "View All",
                        actions: [
                            {
                                type: "Custom",
                                parameters: {
                                    method: "viewAll",
                                    withFacts: "{= ${items/0/data/content/facts} !== undefined}"
                                }
                            }
                        ],
                        visible: "{= ${totalCount} > 1}",
                        buttonType: "Transparent"
                    },
                    {
                        type: "ToolbarSpacer"
                    },
                    {
                        text: "{items/0/data/actions/0/title}",
                        actions: [
                            {
                                type: "{= ${items/0/data/actions/0/type} === 'Action.OpenUrl' ? 'Navigation' : 'Custom'}",
                                parameters: {
                                    ibnParams: {
                                        "sap-deep-link": "{items/0/data/actions/0/url}"
                                    },
                                    ibnTarget: {
                                        action: "Host",
                                        semanticObject: "SF"
                                    }
                                }
                            }
                        ],
                        visible: "{= ${items/0/data/actions} !== undefined}",
                        overflowPriority: "High"
                    },
                    {
                        text: "Dismiss",
                        actions: [
                            {
                                type: "Custom",
                                parameters: {
                                    method: "dismiss"
                                }
                            }
                        ],
                        buttonType: "Transparent",
                        overflowPriority: "AlwaysOverflow"
                    },
                    {
                        text: "Remind Me Tomorrow",
                        actions: [
                            {
                                type: "Custom",
                                parameters: {
                                    method: "remindTomorrow"
                                }
                            }
                        ],
                        buttonType: "Transparent",
                        overflowPriority: "AlwaysOverflow"
                    }
                ]
            },
            header: {
                icon: {
                    src: "{= ${items}.length > 0 ? 'sap-icon://' + ${items/0/data/card/icon} : '' }"
                },
                title: "{items/0/data/card/title}",
                subTitle: "{items/0/data/content/subtitle}"
            },
            content: {
                data: {
                    path: "/"
                },
                groups: [
                    {
                        items: [
                            {
                                icon: {
                                    text: "{= ${items/0/data/content/facts/0/thumbnail/fullName}.replace(RegExp('(\\\\S)\\\\S*\\\\s?', 'g'), '$1').substr(0, 2)}"
                                },
                                label: "{items/0/data/content/facts/0/title}",
                                value: "{items/0/data/content/facts/0/value}",
                                visible: "{=  ${items/0/data/content/facts}  !== undefined}"
                            },
                            {
                                type: "Status",
                                state: "{= RegExp('(^\\\\[(error)\\\\].*\\\\[\\\\/(error)\\\\]$)', 'g').test(${items/0/data/content/secondaryInfo} " +
                                    "? ${items/0/data/content/secondaryInfo} " +
                                    ": ${items/0/data/content/quaternaryInfo}) ? 'Error' : 'None'}",
                                value: "{= (${items/0/data/content/secondaryInfo} " +
                                    "? ${items/0/data/content/secondaryInfo} " +
                                    ": ${items/0/data/content/quaternaryInfo}).replace(RegExp('(^\\\\[(error|info)\\\\]|\\\\[\\\\/(error|info)\\\\]$)', 'g'), '')}"
                            },
                            {
                                value: "View Detail",
                                actions: [
                                    {
                                        type: "Navigation",
                                        parameters: {
                                            ibnParams: {
                                                "sap-deep-link": "{items/0/data/cardAction/url}"
                                            },
                                            ibnTarget: {
                                                action: "Host",
                                                semanticObject: "SF"
                                            }
                                        }
                                    }
                                ],
                                visible: "{= ${items/0/data/content/links} === undefined}"
                            },
                            {
                                value: "{items/0/data/content/links/0/label}",
                                actions: [
                                    {
                                        type: "Navigation",
                                        parameters: {
                                            url: "{items/0/data/content/links/0/url}"
                                        }
                                    }
                                ],
                                visible: "{= ${items/0/data/content/links/0} !== undefined}"
                            },
                            {
                                value: "{items/0/data/content/links/1/label}",
                                actions: [
                                    {
                                        type: "Navigation",
                                        parameters: {
                                            url: "{items/0/data/content/links/1/url}"
                                        }
                                    }
                                ],
                                visible: "{= ${items/0/data/content/links/1} !== undefined}"
                            }
                        ],
                        title: "{items/0/data/content/contentTitle}"
                    }
                ]
            },
            extension: "./ext/Extension",
            designtime: "./dt/designtime",
            configuration: {
                parameters: {
                    category: {
                        value: "ONBOARDING_MANAGER_TASKS"
                    }
                },
                destinations: {
                    myDestination: {
                        name: "SuccessFactors_API",
                        label: "{{CARD_SF_DESTINATION}}"
                    }
                }
            }
        }
    };
});
