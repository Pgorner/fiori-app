// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    return {
        _version: "1.15.0",
        "sap.app": {
            id: "com.sap.bpm.tc.widget.cards",
            type: "card",
            title: "Task Center Widget",
            subTitle: "Task Center Integration widget based on a Component card",
            applicationVersion: {
                version: "1.1.0"
            },
            i18n: {
                bundleUrl: "i18n/i18n.properties",
                supportedLocales: [
                    "ar",
                    "bg",
                    "ca",
                    "cs",
                    "cy",
                    "da",
                    "de",
                    "el",
                    "en_GB",
                    "en",
                    "es_MX",
                    "es",
                    "et",
                    "fi",
                    "fr_CA",
                    "fr",
                    "he",
                    "hi",
                    "hr",
                    "hu",
                    "id",
                    "it",
                    "ja",
                    "kk",
                    "ko",
                    "lt",
                    "lv",
                    "ms",
                    "nl",
                    "no",
                    "pl",
                    "pt_PT",
                    "pt",
                    "ro",
                    "ru",
                    "sh",
                    "sk",
                    "sl",
                    "sv",
                    "th",
                    "tr",
                    "uk",
                    "vi",
                    "zh_CN",
                    "zh_TW"
                ],
                fallbackLocale: "en"
            },
            shortTitle: "Task Center Widget",
            info: "",
            description: "Task Center integration widget based on a Component card",
            tags: {
                keywords: [
                    "Task Center",
                    "Tasks"
                ]
            }
        },
        "sap.ui": {
            technology: "UI5",
            icons: {
                icon: "sap-icon://technical-object"
            }
        },
        "sap.ui5": {
            rootView: {
                viewName: "com.sap.bpm.tc.widget.cards.View",
                type: "XML",
                async: true,
                id: "app"
            },
            dependencies: {
                minUI5Version: "1.100",
                libs: {
                    "sap.m": {}
                }
            }
        },
        "sap.card": {
            type: "Component",
            configuration: {
                csrfTokens: {
                    token1: {
                        data: {
                            request: {
                                url: "{context>sap.workzone/currentCompany/webHost/value}/{parameters>/taskCenterHTML5BusinessSolution/value}." +
                                    "{parameters>/taskCenterHTML5AppName/value}/task-center-service/v1/tasks/$count",
                                method: "GET",
                                headers: {
                                    "X-CSRF-Token": "Fetch"
                                },
                                withCredentials: true
                            }
                        }
                    }
                },
                parameters: {
                    viewMode: {
                        value: "Line",
                        type: "string"
                    },
                    taskCenterHTML5AppName: {
                        value: "comsapbpmtcinbox",
                        type: "string"
                    },
                    taskCenterHTML5BusinessSolution: {
                        value: "comsapbpminbox-service",
                        type: "string"
                    },
                    workzoneHostname: {
                        value: "{context>sap.workzone/currentCompany/webHost/value}",
                        type: "string"
                    }
                }
            },
            extension: "./CustomFormattersExtension"
        }
    };
});
