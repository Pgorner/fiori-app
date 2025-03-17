/*
 *Tests for sap.suite.ui.generic.template.lib.insights.InsightsCardHelper
 */
 sap.ui.define(
    ["sap/suite/ui/generic/template/lib/insights/InsightsCardHelper", "sap/ui/model/json/JSONModel"],
    function(InsightsCardHelper, JSONModel) {
        "use strict";

        InsightsCardHelper.getFilterDetails = Function.prototype;
        InsightsCardHelper.getFilterDetails = function() {
            return { filters: {} };
        };
        var oTemplPrivGlobal = new JSONModel();
        oTemplPrivGlobal.setProperty("/generic", {
            "ui5VersionInfo": {
                version: "1.119",
                buildTimestamp: "202310170246"
            }
        });

        QUnit.test("Test LR Card Content Navigation", function(assert) {
            var oCardDefinition = {},
                oSapCard = {
                configuration : {
                    parameters : {}
                },
                header: {},
                content: {
                    row: {}
                }
            },
            oTemplPriv = new JSONModel();

            oCardDefinition['oTemplateUtils'] = {
                oServices : {
                    oApplication: {
                        getNavigationHandler: function() {
                            return {
                                getIAppStateKey: function() {
                                    return "ASRS9XCNWZNY5EVOJUGTSU6QJJYLYQCCS8FWPCV7";
                                }
                            };
                        }
                    }
                }
            };
            oCardDefinition['component'] = {
                getModel: function(sName){
                    if (sName === "_templPriv"){
                        return oTemplPriv;
                    } else if (sName === "_templPrivGlobal") {
                        return oTemplPrivGlobal;
                    }
                    throw new Error("Only _templPriv or _templPrivGlobal models must be accessed");
                }
            };
            oTemplPriv.setProperty("/listReport/", { bSupressCardRowNavigation : true });
            InsightsCardHelper.getCardActions(oCardDefinition, oSapCard);
            assert.ok(!oSapCard.content.row.actions, "Card content Navigation is disabled.");
            oTemplPriv.setProperty("/listReport/", { bSupressCardRowNavigation : undefined });
            InsightsCardHelper.getCardActions(oCardDefinition, oSapCard);
            assert.ok(oSapCard.content.row.actions, "Card content Navigation is enabled.");
        });

        QUnit.test("Test LR Card Preview Creation", function(assert) {
            var oCardDefinition = {},
                oTemplPriv = new JSONModel();

            oCardDefinition['oTemplateUtils'] = {
                oServices : {
                    oApplication: {
                        getNavigationHandler: function() {
                            return {
                                getIAppStateKey: function() {
                                    return "ASRS9XCNWZNY5EVOJUGTSU6QJJYLYQCCS8FWPCV7";
                                }
                            };
                        }
                    }
                },
                oCommonUtils : {
                    isSupportedColumn: function() { return true; }
                }
            };
            oCardDefinition['view'] = {
                getModel: function() { return {}; }
            };
            oCardDefinition['entitySet'] = {
                name: ""
            };
            oCardDefinition["entityType"] = {
                property: [{
                    "name": "Supplier",
                    "type": "Edm.String",
                    "maxLength": "10",
                    "sap:display-format": "UpperCase",
                    "com.sap.vocabularies.Common.v1.IsUpperCase": {
                        "Bool": "true"
                    },
                    "sap:field-control": "Supplier_fc",
                    "com.sap.vocabularies.Common.v1.FieldControl": {
                        "Path": "Supplier_fc"
                    },
                    "sap:text": "SupplierName",
                    "com.sap.vocabularies.Common.v1.Text": {
                        "Path": "SupplierName",
                        "com.sap.vocabularies.UI.v1.TextArrangement": {
                            "EnumMember": "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"
                        }
                    },
                    "sap:label": "Supplier",
                    "com.sap.vocabularies.Common.v1.Label": {
                        "String": "Supplier"
                    }
                },
                {
                    "name": "Plant",
                    "type": "Edm.String",
                    "maxLength": "260",
                    "sap:label": "Plant",
                    "com.sap.vocabularies.Common.v1.Label": {
                        "String": "Plant"
                    },
                    "sap:creatable": "false",
                    "sap:updatable": "false",
                    "sap:sortable": "false",
                    "sap:value-list": "standard",
                    "Org.OData.Core.V1.Computed": {
                        "Bool": "true"
                    }
                },
                {
                    "name": "PurchaseOrderDate",
                    "type": "Edm.DateTime",
                    "precision": "0",
                    "sap:display-format": "Date",
                    "sap:field-control": "PurchaseOrderDate_fc",
                    "com.sap.vocabularies.Common.v1.FieldControl": {
                        "Path": "PurchaseOrderDate_fc"
                    },
                    "sap:label": "Purchase Order Date",
                    "com.sap.vocabularies.Common.v1.Label": {
                        "String": "Purchase Order Date"
                    }
                },
                {
                    "name": "LastChangeDateTime",
                    "type": "Edm.DateTimeOffset",
                    "precision": "7",
                    "sap:filter-restriction": "interval",
                    "sap:label": "Last Changed On",
                    "com.sap.vocabularies.Common.v1.Label": {
                        "String": "Last Changed On"
                    },
                    "sap:creatable": "false",
                    "sap:updatable": "false",
                    "Org.OData.Core.V1.Computed": {
                        "Bool": "true"
                    }
                },
                {
                    "name": "ExpiryOrderDate",
                    "type": "Edm.DateTime",
                    "precision": "0",
                    "sap:field-control": "ExpiryOrderDate_fc",
                    "com.sap.vocabularies.Common.v1.FieldControl": {
                        "Path": "ExpiryOrderDate_fc"
                    },
                    "sap:label": "Expiry Date",
                    "com.sap.vocabularies.Common.v1.Label": {
                        "String": "Expiry Date"
                    }
                }
                ]
            };
            oCardDefinition['component'] = {
                getModel: function(sName){
                    if (sName === "_templPriv"){
                        return oTemplPriv;
                    } else if (sName === "_templPrivGlobal") {
                        return oTemplPrivGlobal;    
                    } else if (sName === "i18n") {
                        return {
                            getResourceBundle: function() { return; }
                        };
                    } else {
                        return { 
                            sServiceUrl: ""
                        };
                    }
                },
                getAppComponent: function() {
                    return {
                        getManifestEntry: function (sKey) {
                            if (sKey === "sap.ui") {
                                return {
                                    "_version": "1.1.0",
                                    "technology": "UI5",
                                    "icons": {
                                        "icon": "",
                                        "favIcon": "",
                                        "phone": "",
                                        "phone@2": "",
                                        "tablet": "",
                                        "tablet@2": ""
                                    },
                                    "deviceTypes": {
                                        "desktop": true,
                                        "tablet": true,
                                        "phone": false
                                    },
                                    "supportedThemes": [
                                        "sap_hcb",
                                        "sap_bluecrystal",
                                        "sap_belize_plus"
                                    ]
                                };
                            }
                            return {};
                        },
                        getMetadata: function () {
                            return {
                                getName: function () { 
                                    return "sap.suite.ui.generic.template.ListReport.Component"; 
                                }
                            };
                        }
                    };
                },
                getMetadata: function() {
                    return {
                        getName: function() { 
                            return "sap.suite.ui.generic.template.ListReport.Component"; 
                        }
                    };
                }
            };
            oCardDefinition["currentControlHandler"] = {
                getControl: function () {
                    return {
                        getCustomData: function () {
                            return [];
                        }
                    };
                },
                getToolbar: function () {
                    return {
                        getTitleControl: function () {
                            return {
                                getText: function() {
                                    return "";
                                }
                            };
                        }
                    };
                },
                getBinding: function() {
                    return {
                        getDownloadUrl: function() {
                            return "";
                        }
                    };
                },
                getModel: function() {
                    return {
                        getMetaModel() {
                            return {
                                getODataProperty: function(oEntityType, sLeadingProp) {
                                    for (var i = 0; i < oEntityType.property.length; i++) {
                                        if (oEntityType.property[i].name === sLeadingProp) {
                                            return oEntityType.property[i];
                                        }
                                    }
                                }
                            };
                        }
                    };
                },
                getVisibleProperties: function() {
                    return [
                        {
                            data: function() {
                                return {
                                    "columnKey": "Plant",
                                    "leadingProperty": "Plant",
                                    "navigationProperty": "",
                                    "filterProperty": "Plant",
                                    "isGroupable": false,
                                    "fullName": "MM_PUR_PO_MAINT_V2_SRV.C_PurchaseOrderTPType/Plant",
                                    "type": "string",
                                    "typeInstance": {
                                        "oConstraints": {
                                            "maxLength": 260
                                        },
                                        "_sParsedEmptyString": null
                                    },
                                    "maxLength": "260",
                                    "edmType": "Edm.String",
                                    "displayBehaviour": "descriptionAndId",
                                    "isDigitSequence": false,
                                    "nullable": true
                                };
                            },
                            getVisible: function() {
                                return true;
                            }
                        },
                        {
                            data: function() {
                                return {
                                    "columnKey": "Supplier",
                                    "leadingProperty": "Supplier",
                                    "additionalProperty": "SupplierName",
                                    "navigationProperty": "",
                                    "sortProperty": "Supplier",
                                    "filterProperty": "Supplier",
                                    "isGroupable": false,
                                    "fullName": "MM_PUR_PO_MAINT_V2_SRV.C_PurchaseOrderTPType/Supplier",
                                    "type": "string",
                                    "typeInstance": {
                                        "oConstraints": {
                                            "maxLength": 10
                                        },
                                        "_sParsedEmptyString": null
                                    },
                                    "maxLength": "10",
                                    "edmType": "Edm.String",
                                    "displayBehaviour": "descriptionAndId",
                                    "description": "SupplierName",
                                    "isDigitSequence": false,
                                    "nullable": true
                                };
                            },
                            getVisible: function() {
                                return true;
                            }
                        },
                        {
                            data: function () {
                                return {
                                    "additionalProperty": "undefined",
                                    "aggregationRole": "undefined",
                                    "align": "Right",
                                    "columnKey": "PurchaseOrderDate",
                                    "description": "undefined",
                                    "displayBehaviour": "descriptionAndId",
                                    "edmType": "Edm.DateTime",
                                    "filterProperty": "PurchaseOrderDate",
                                    "fullName": null,
                                    "isCurrency": "undefined",
                                    "isDigitSequence": false,
                                    "isGroupable": false,
                                    "leadingProperty": "PurchaseOrderDate",
                                    "maxLength": "undefined",
                                    "navigationProperty": "",
                                    "nullable": true,
                                    "precision": "0",
                                    "scale": "undefined",
                                    "sortProperty": "PurchaseOrderDate",
                                    "type": "date",
                                    "typeInstance": {
                                        "oFormat": {
                                            "oFormatOptions": {
                                                "style": "medium",
                                                "relativeScale": "day",
                                                "relativeStyle": "wide",
                                                "strictParsing": true,
                                                "UTC": false,
                                                "calendarType": "Gregorian",
                                                "pattern": "dd.MM.yyyy"
                                            }
                                        }
                                    }
                                };
                            },
                            getVisible: function() {
                                return true;
                            }
                        },
                        {
                            data: function () {
                                return {
                                    "additionalProperty": "undefined",
                                    "aggregationRole": "undefined",
                                    "align": "Right",
                                    "columnKey": "LastChangeDateTime",
                                    "description": "undefined",
                                    "displayBehaviour": "descriptionAndId",
                                    "edmType": "Edm.DateTimeOffset",
                                    "filterProperty": "LastChangeDateTime",
                                    "fullName": null,
                                    "isCurrency": "undefined",
                                    "isDigitSequence": false,
                                    "isGroupable": false,
                                    "leadingProperty": "LastChangeDateTime",
                                    "maxLength": "undefined",
                                    "navigationProperty": "",
                                    "nullable": true,
                                    "precision": "7",
                                    "scale": "undefined",
                                    "sortProperty": "LastChangeDateTime",
                                    "type": "datetime",
                                    "typeInstance": {
                                        "oFormat": {
                                            "oFormatOptions": {
                                                "style": "medium",
                                                "relativeScale": "auto",
                                                "relativeStyle": "wide",
                                                "strictParsing": true,
                                                "calendarType": "Gregorian",
                                                "pattern": "dd.MM.yyyy, HH:mm:ss"
                                            }
                                        }
                                    }
                                };
                            },
                            getVisible: function() {
                                return true;
                            }
                        },
                        {
                            data: function () {
                                return {
                                    "additionalProperty": "undefined",
                                    "aggregationRole": "undefined",
                                    "align": "Right",
                                    "columnKey": "ExpiryOrderDate",
                                    "description": "undefined",
                                    "displayBehaviour": "descriptionAndId",
                                    "edmType": "Edm.DateTime",
                                    "filterProperty": "ExpiryOrderDate",
                                    "fullName": null,
                                    "isCurrency": "undefined",
                                    "isDigitSequence": false,
                                    "isGroupable": false,
                                    "leadingProperty": "ExpiryOrderDate",
                                    "maxLength": "undefined",
                                    "navigationProperty": "",
                                    "nullable": true,
                                    "precision": "7",
                                    "scale": "undefined",
                                    "sortProperty": "ExpiryOrderDate",
                                    "type": "datetime",
                                    "typeInstance": {
                                        "oFormat": {
                                            "oFormatOptions": {
                                                "style": "medium",
                                                "relativeScale": "auto",
                                                "relativeStyle": "wide",
                                                "strictParsing": true,
                                                "calendarType": "Gregorian",
                                                "pattern": "dd.MM.yyyy, HH:mm:ss"
                                            }
                                        }
                                    }
                                };
                            },
                            getVisible: function() {
                                return true;
                            }
                        }
                    ];
                }
            };

            var oManifest = InsightsCardHelper.createCardForPreview(oCardDefinition);

            assert.deepEqual(oManifest["sap.app"], {
                "id" : oManifest["sap.app"].id,
                "type": "card"
            }, "Card manifest contains sap.app");
            
            assert.deepEqual(oManifest["sap.ui"], {
                "_version": "1.1.0",
                "technology": "UI5",
                "icons": {
                    "icon": "",
                    "favIcon": "",
                    "phone": "",
                    "phone@2": "",
                    "tablet": "",
                    "tablet@2": ""
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": false
                },
                "supportedThemes": [
                    "sap_hcb",
                    "sap_bluecrystal",
                    "sap_belize_plus"
                ]
            }, "Card manifest contains sap.ui");

            assert.deepEqual(oManifest["sap.ui5"], {
                _version: "1.1.0",
                contentDensities: { compact: true, cozy: true },
                "dependencies": {
                    "libs": {
                        "sap.insights": {
                            lazy: false
                        }
                    }
                }
            }, "Card manifest contains sap.ui5");

            assert.deepEqual(oManifest["sap.card"], {
                "type": "Table",
                "configuration": {
                    "parameters": {
                        "_entitySet": {
                            "value": ""
                        },
                        "_urlSuffix": {
                            "value": "/Results"
                        },
                        "headerState": {
                            "value": "{\"ibnTarget\":{\"semanticObject\":\"\"},\"sensitiveProps\":[],\"ibnParams\":{\"nhHybridIAppStateKey\":\"ASRS9XCNWZNY5EVOJUGTSU6QJJYLYQCCS8FWPCV7\"}}"
                        },
                        "contentState": {
                            "value": "{\"ibnTarget\":{\"semanticObject\":\"\"},\"sensitiveProps\":[],\"ibnParams\":{\"nhHybridIAppStateKey\":\"ASRS9XCNWZNY5EVOJUGTSU6QJJYLYQCCS8FWPCV7\"}}"
                        }
                    },
                    "destinations": {
                        "service": {
                            "name": "(default)",
                            "defaultUrl": "/"
                        }
                    },
                    "csrfTokens": {
                        "token1": {
                            "data": {
                                "request": {
                                    "url": "{{destinations.service}}",
                                    "method": "HEAD",
                                    "headers": {
                                        "X-CSRF-Token": "Fetch"
                                    }
                                }
                            }
                        }
                    }
                },
                "data": {
                    "request": {
                        "url": "{{destinations.service}}/$batch",
                        "method": "POST",
                        "headers": {
                            "X-CSRF-Token": "{{csrfTokens.token1}}"
                        },
                        "batch": {
                            "content": {
                                "method": "GET",
                                "url": "",
                                "headers": {
                                    "Accept": "application/json"
                                }
                            }
                        }
                    }
                },
                "header": {
                    "title": "",
                    "subTitle": "",
                    "actions": [
                        {
                            "type": "Navigation",
                            "parameters": "{= extension.formatters.getNavigationContext(${parameters>/headerState/value})}"
                        }
                    ],
                    "status": {
                        "text": "{= ${__count} === '0' ? '' : ${__count} }"
                    },
                    "data": {
                        "path": "/content/d"
                    }
                },
                "extension": "module:sap/insights/CardExtension",
                "content": {
                    "data": {
                        "path": "/content/d/results"
                    },
                    "maxItems": 15,
                    "row": {
                        "columns": [
                            {
                                "title": "Plant",
                                "value": "{Plant}"
                            },
                            {
                                "title": "Supplier",
                                "value": "{= ${SupplierName} === '' ? '' : ${SupplierName}}{= ${Supplier} === '' ? '' : ' (' + (${Supplier}) + ')'}"
                            },
                            {
                                "title": "Purchase Order Date",
                                "value": "{=${PurchaseOrderDate} ? format.dateTime(${PurchaseOrderDate}, {'style':'medium','relativeScale':'day','relativeStyle':'wide','strictParsing':true,'UTC':false,'calendarType':'Gregorian','pattern':'dd.MM.yyyy'}) : ''}"
                            },
                            {
                                "title": "Last Changed On",
                                "value": "{=${LastChangeDateTime} ? format.dateTime(${LastChangeDateTime}, {'style':'medium','relativeScale':'auto','relativeStyle':'wide','strictParsing':true,'calendarType':'Gregorian','pattern':'dd.MM.yyyy, HH:mm:ss'}) : ''}"
                            },
                            {
                                "title": "Expiry Date",
                                "value": "{=${ExpiryOrderDate} ? format.dateTime(${ExpiryOrderDate}, {'style':'medium','relativeScale':'auto','relativeStyle':'wide','strictParsing':true,'calendarType':'Gregorian','pattern':'dd.MM.yyyy, HH:mm:ss'}) : ''}"
                            }
                        ],
                        "actions": [
                            {
                                "type": "Navigation",
                                "parameters": "{= extension.formatters.getNavigationContext(${parameters>/contentState/value}, ${})}"
                            }
                        ]
                    }
                }
            },"Card manifest contains sap.card");

            assert.deepEqual(oManifest["sap.insights"], {
                "cardType": "RT",
                "versions": {
                    "ui5": oManifest["sap.insights"].versions.ui5
                },
                "parentAppId": undefined,
                "allowedChartTypes": undefined,
                "filterEntitySet": ""
            }, "Card manifest contains sap.insights");
        });

        QUnit.test("Test ALP Card Preview Creation", function(assert) {
            var oCardDefinition = {},
                oTemplPriv = new JSONModel();

            oCardDefinition['oTemplateUtils'] = {
                oServices : {
                    oApplication: {
                        getNavigationHandler: function() {
                            return {
                                getIAppStateKey: function() {
                                    return "ASRS9XCNWZNY5EVOJUGTSU6QJJYLYQCCS8FWPCV7";
                                }
                            };
                        }
                    }
                }
            };
            oCardDefinition['view'] = {
                getModel: function() { return {}; }
            };
            oCardDefinition['entitySet'] = {
                name: ""
            };
            oCardDefinition['component'] = {
                getModel: function(sName){
                    if (sName === "_templPriv"){
                        return oTemplPriv;
                    } else if (sName === "_templPrivGlobal") {
                        return oTemplPrivGlobal;    
                    } else {
                        return { 
                            sServiceUrl: ""
                        };
                    }
                },
                getAppComponent: function() {
                    return {
                        getManifestEntry: function (sKey) {
                            if (sKey === "sap.ui") {
                                return {
                                    "_version": "1.1.0",
                                    "technology": "UI5",
                                    "icons": {
                                        "icon": "",
                                        "favIcon": "",
                                        "phone": "",
                                        "phone@2": "",
                                        "tablet": "",
                                        "tablet@2": ""
                                    },
                                    "deviceTypes": {
                                        "desktop": true,
                                        "tablet": true,
                                        "phone": false
                                    },
                                    "supportedThemes": [
                                        "sap_hcb",
                                        "sap_bluecrystal",
                                        "sap_belize_plus"
                                    ]
                                };
                            }
                            return {};
                        },
                        getMetadata: function () {
                            return {
                                getName: function () { 
                                    return "sap.suite.ui.generic.template.AnalyticalListPage.Component"; 
                                }
                            };
                        }
                    };
                },
                getMetadata: function() {
                    return {
                        getName: function() { 
                            return "sap.suite.ui.generic.template.AnalyticalListPage.Component"; 
                        }
                    };
                }
            };

            oCardDefinition["currentControlHandler"] = {
                getToolbar: function () {
                    return {
                        getTitleControl: function () {
                            return {
                                getText: function() {
                                    return "";
                                }
                            };
                        }
                    };
                },
                getBinding: function() {
                    return {
                        getDownloadUrl: function() {
                            return "";
                        }
                    };
                },
                getModel: function() {
                    return {
                        getMetaModel() {
                            return {};
                        }
                    };
                },
                getVisibleProperties: function() {
                    return {
                        filter: function() {
                            return [];
                        }
                    };
                },
                getAvailableChartTypes: function() {
                    return [];
                },
                getInnerChart: function() {
                    return {
                        getVisibleDimensions: function() {
                            return [];
                        },
                        getVisibleMeasures: function() {
                            return [];
                        },
                        getInResultDimensions:function() {
                            return [];
                        },
                        getMeasures: function() {
                            return [{
                                getName: function () {},
                                getLabel: function () {}
                            }];
                        },
                        getDimensions: function() {
                            return [{
                                getName: function () {},
                                getLabel: function () {},
                                getTextProperty: function () {return ""; }
                            }];
                        },
                        getChartType: function() {
                            return "";
                        },
                        _getVizFrame: function() {
                            return {
                                getFeeds: function() {
                                   return [];
                                }
                            };
                        },
                        setVizProperties: function(oVizProps) {

                        },
                        getVizProperties: function () {
                            return {};
                        },
                        getProperty: function () {
                            return {};
                        }
                    };
                }
            };

            var oManifest = InsightsCardHelper.createCardForPreview(oCardDefinition);

            assert.deepEqual(oManifest["sap.app"], {
                "id" : oManifest["sap.app"].id,
                "type": "card"
            }, "Card manifest contains sap.app");

            assert.deepEqual(oManifest["sap.ui"], {
                "_version": "1.1.0",
                "technology": "UI5",
                "icons": {
                    "icon": "",
                    "favIcon": "",
                    "phone": "",
                    "phone@2": "",
                    "tablet": "",
                    "tablet@2": ""
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": false
                },
                "supportedThemes": [
                    "sap_hcb",
                    "sap_bluecrystal",
                    "sap_belize_plus"
                ]
            }, "Card manifest contains sap.ui");

            assert.deepEqual(oManifest["sap.ui5"], {
                _version: "1.1.0",
                contentDensities: { compact: true, cozy: true },
                "dependencies": {
                    "libs": {
                        "sap.insights": {
                            lazy: false
                        }
                    }
                }
            }, "Card manifest contains sap.ui5");

            assert.deepEqual(oManifest["sap.card"], {
                "type": "Analytical",
                "configuration": {
                    "parameters": {
                        "_entitySet": {
                            "value": ""
                        },
                        "_urlSuffix": {
                            "value": "/Results"
                        },
                        "headerState": {
                            "value": "{\"ibnTarget\":{\"semanticObject\":\"\"},\"sensitiveProps\":[],\"ibnParams\":{\"nhHybridIAppStateKey\":\"ASRS9XCNWZNY5EVOJUGTSU6QJJYLYQCCS8FWPCV7\"}}"
                        },
                        "contentState": {
                            "value": "{\"ibnTarget\":{\"semanticObject\":\"\"},\"sensitiveProps\":[],\"ibnParams\":{\"nhHybridIAppStateKey\":\"ASRS9XCNWZNY5EVOJUGTSU6QJJYLYQCCS8FWPCV7\"}}"
                        }
                    },
                    "destinations": {
                        "service": {
                            "name": "(default)",
                            "defaultUrl": "/"
                        }
                    },
                    "csrfTokens": {
                        "token1": {
                            "data": {
                                "request": {
                                    "url": "{{destinations.service}}",
                                    "method": "HEAD",
                                    "headers": {
                                        "X-CSRF-Token": "Fetch"
                                    }
                                }
                            }
                        }
                    }
                },
                "content": {
                    "actionableArea": "Chart",
                    "actions": {},
                    "chartProperties": {},
                    "chartType": "",
                    "data": {
                      "path": "/content/d/results"
                    },
                    "dimensions": [],
                    "feeds": [],
                    "measures": []
                },
                "data": {
                    "request": {
                        "url": "{{destinations.service}}/$batch",
                        "method": "POST",
                        "headers": {
                            "X-CSRF-Token": "{{csrfTokens.token1}}"
                        },
                        "batch": {
                            "content": {
                                "method": "GET",
                                "url": "",
                                "headers": {
                                    "Accept": "application/json"
                                }
                            }
                        }
                    }
                },
                "extension": "module:sap/insights/CardExtension",
                "header": {
                    "title": "",
                    "subTitle": "",
                    "actions": [
                        {
                            "type": "Navigation",
                            "parameters": "{= extension.formatters.getNavigationContext(${parameters>/headerState/value})}"
                        }
                    ],
                    "status": {
                        "text": "{= ${__count} === '0' ? '' : ${__count} }"
                    },
                    "data": {
                        "path": "/content/d"
                    }
                }
            }, "Card manifest contains sap.card");

            assert.deepEqual(oManifest["sap.insights"], {
                "cardType": "RT",
                "versions": {
                    "ui5": oManifest["sap.insights"].versions.ui5
                },
                "parentAppId": undefined,
                "filterEntitySet": "",
                "allowedChartTypes": []
            }, "Card manifest contains sap.insights");
        });

        QUnit.test("Test ALP Card Preview Creation for donut", function(assert) {
            var oCardDefinition = {},
                oTemplPriv = new JSONModel();

            oCardDefinition['oTemplateUtils'] = {
                oServices : {
                    oApplication: {
                        getNavigationHandler: function() {
                            return {
                                getIAppStateKey: function() {
                                    return "ASRS9XCNWZNY5EVOJUGTSU6QJJYLYQCCS8FWPCV7";
                                }
                            };
                        }
                    }
                }
            };
            oCardDefinition['view'] = {
                getModel: function() { return {}; }
            };
            oCardDefinition['entitySet'] = {
                name: ""
            };
            oCardDefinition['component'] = {
                getModel: function(sName){
                    if (sName === "_templPriv"){
                        return oTemplPriv;
                    } else if (sName === "_templPrivGlobal") {
                        return oTemplPrivGlobal;    
                    } else {
                        return { 
                            sServiceUrl: ""
                        };
                    }
                },
                getAppComponent: function() {
                    return {
                        getManifestEntry: function (sKey) {
                            if (sKey === "sap.ui") {
                                return {
                                    "_version": "1.1.0",
                                    "technology": "UI5",
                                    "icons": {
                                        "icon": "",
                                        "favIcon": "",
                                        "phone": "",
                                        "phone@2": "",
                                        "tablet": "",
                                        "tablet@2": ""
                                    },
                                    "deviceTypes": {
                                        "desktop": true,
                                        "tablet": true,
                                        "phone": false
                                    },
                                    "supportedThemes": [
                                        "sap_hcb",
                                        "sap_bluecrystal",
                                        "sap_belize_plus"
                                    ]
                                };
                            }
                            return {};
                        },
                        getMetadata: function () {
                            return {
                                getName: function () { 
                                    return "sap.suite.ui.generic.template.AnalyticalListPage.Component"; 
                                }
                            };
                        }
                    };
                },
                getMetadata: function() {
                    return {
                        getName: function() { 
                            return "sap.suite.ui.generic.template.AnalyticalListPage.Component"; 
                        }
                    };
                }
            };

            oCardDefinition["currentControlHandler"] = {
                getToolbar: function () {
                    return {
                        getTitleControl: function () {
                            return {
                                getText: function() {
                                    return "";
                                }
                            };
                        }
                    };
                },
                getBinding: function() {
                    return {
                        getDownloadUrl: function() {
                            return "";
                        }
                    };
                },
                getModel: function() {
                    return {
                        getMetaModel() {
                            return {
                                getODataProperty: function() {
                                    return "";
                                }
                            };
                        }
                    };
                },
                getVisibleProperties: function() {
                    return {
                        filter: function() {
                            return [];
                        }
                    };
                },
                getAvailableChartTypes: function() {
                    return [];
                },
                getInnerChart: function() {
                    return {
                        getVisibleDimensions: function() {
                            return ["CostElement"];
                        },
                        getVisibleMeasures: function() {
                            return ["ActualCosts"];
                        },
                        getInResultDimensions: function() {
                            return [];
                        },
                        getMeasures: function() {
                            //return {'ActualCosts':{name: 'ActualCosts', keyPropertyName: 'ActualCosts', analyticalInfo: {name: 'ActualCosts', grouped: false, inResult: false, visible: true, measurePropertyName: 'ActualCosts'}}}
                            return [{
                                getName: function () {return "ActualCosts";},
                                getLabel: function () {return "ActualCosts";}
                            }];
                        },
                        getDimensions: function() {
                            //return  {'CostElement':{name: 'CostElement', keyPropertyName: 'CostElement', analyticalInfo: {name: 'CostElement', grouped: false, inResult: false, visible: true, dimensionPropertyName: 'CostElement'}}}
                            return [{
                                getName: function () {return "CostElement";},
                                getLabel: function () {return "CostElement";},
                                getTextProperty: function () {return ""; }
                            }];
                        },
                        getChartType: function() {
                            return "Donut";
                        },
                        _getVizFrame: function () {
                            return {
                                getFeeds: function () {
                                    return [{
                                        getUid: function () {
                                            return [];
                                        },
                                        getType: function () {
                                            return "";
                                        },
                                        getValues: function () {
                                            return [1];
                                        },
                                        getProperty: function (param) {
                                            if (param === "values") {
                                                return [
                                                    {
                                                        getProperty: function(param) {
                                                            if (param === "name") {
                                                                return "CostElement";
                                                            } else if (param === "uid") {
                                                                return "CostElement";
                                                            } else if (param === "type") {
                                                                return "Dimension";
                                                            }
                                                        }
                                                    }
                                                ];
                                            } else if (param === "type") {
                                                return "Dimension";
                                            } else if (param === "uid") {
                                                return "categoryAxis";
                                            } else {
                                                return [];
                                            }
                                        }
                                    },{
                                        getUid: function () {
                                            return [];
                                        },
                                        getType: function () {
                                            return "";
                                        },
                                        getValues: function () {
                                            return [1];
                                        },
                                        getProperty: function (param) {
                                            if (param === "values") {
                                                return [
                                                    {
                                                        getProperty: function(param) {
                                                            if (param === "name") {
                                                                return "ActualCosts";
                                                            } else if (param === "uid") {
                                                                return "ActualCosts";
                                                            } else if (param === "type") {
                                                                return "Measure";
                                                            }
                                                        }
                                                    }
                                                ];
                                            } else if (param === "type") {
                                                return "Measure";
                                            } else if (param === "uid") {
                                                return "valueAxis";
                                            } else {
                                                return [];
                                            }
                                        }
                                    }

                                    ];
                                }
                            };
                        },
                        setVizProperties: function() {

                        },
                        getVizProperties: function() {
                            return {};
                        },
                        getProperty: function () {
                            return {};
                        }
                    };
                }
            };

            var oManifest = InsightsCardHelper.createCardForPreview(oCardDefinition);

            assert.deepEqual(oManifest["sap.app"], {
                "id" : oManifest["sap.app"].id,
                "type": "card"
            }, "Card manifest contains sap.app");

            assert.deepEqual(oManifest["sap.ui"], {
                "_version": "1.1.0",
                "technology": "UI5",
                "icons": {
                    "icon": "",
                    "favIcon": "",
                    "phone": "",
                    "phone@2": "",
                    "tablet": "",
                    "tablet@2": ""
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": false
                },
                "supportedThemes": [
                    "sap_hcb",
                    "sap_bluecrystal",
                    "sap_belize_plus"
                ]
            }, "Card manifest contains sap.ui");

            assert.deepEqual(oManifest["sap.ui5"], {
                _version: "1.1.0",
                contentDensities: { compact: true, cozy: true },
                "dependencies": {
                    "libs": {
                        "sap.insights": {
                            lazy: false
                        }
                    }
                }
            }, "Card manifest contains sap.ui5");

            assert.deepEqual(oManifest["sap.card"], {
                "type": "Analytical",
                "configuration": {
                    "parameters": {
                        "_entitySet": {
                            "value": ""
                        },
                        "_urlSuffix": {
                            "value": "/Results"
                        },
                        "headerState": {
                            "value": "{\"ibnTarget\":{\"semanticObject\":\"\"},\"sensitiveProps\":[],\"ibnParams\":{\"nhHybridIAppStateKey\":\"ASRS9XCNWZNY5EVOJUGTSU6QJJYLYQCCS8FWPCV7\"}}"
                        },
                        "contentState": {
                            "value": "{\"ibnTarget\":{\"semanticObject\":\"\"},\"sensitiveProps\":[],\"ibnParams\":{\"nhHybridIAppStateKey\":\"ASRS9XCNWZNY5EVOJUGTSU6QJJYLYQCCS8FWPCV7\"}}"
                        }
                    },
                    "destinations": {
                        "service": {
                            "name": "(default)",
                            "defaultUrl": "/"
                        }
                    },
                    "csrfTokens": {
                        "token1": {
                            "data": {
                                "request": {
                                    "url": "{{destinations.service}}",
                                    "method": "HEAD",
                                    "headers": {
                                        "X-CSRF-Token": "Fetch"
                                    }
                                }
                            }
                        }
                    }
                },
                "content": {
                    "actionableArea": "Chart",
                    "actions": {},
                    "chartProperties": {},
                    "chartType": "Donut",
                    "data": {
                      "path": "/content/d/results"
                    },
                    "dimensions": [
                      {
                        "name": "CostElement",
                        "value": "{CostElement}",
                        "displayValue": "{undefined}"
                      }
                    ],
                    "measures": [
                      {
                        "name": "ActualCosts",
                        "value": "{ActualCosts}"
                      }
                    ],
                    "feeds": [
                        {
                            "type": "Dimension",
                            "uid": "categoryAxis",
                            "values": [
                                "CostElement"
                            ]
                        },
                        {
                            "type": "Measure",
                            "uid": "valueAxis",
                            "values": [
                                "ActualCosts"
                            ]
                        }
                    ]
                },
                "data": {
                    "request": {
                        "url": "{{destinations.service}}/$batch",
                        "method": "POST",
                        "headers": {
                            "X-CSRF-Token": "{{csrfTokens.token1}}"
                        },
                        "batch": {
                            "content": {
                                "method": "GET",
                                "url": "",
                                "headers": {
                                    "Accept": "application/json"
                                }
                            }
                        }
                    }
                },
                "extension": "module:sap/insights/CardExtension",
                "header": {
                    "title": "",
                    "subTitle": "",
                    "actions": [
                        {
                            "type": "Navigation",
                            "parameters": "{= extension.formatters.getNavigationContext(${parameters>/headerState/value})}"
                        }
                    ],
                    "status": {
                        "text": "{= ${__count} === '0' ? '' : ${__count} }"
                    },
                    "data": {
                        "path": "/content/d"
                    }
                }
            }, "Card manifest contains sap.card");

            assert.deepEqual(oManifest["sap.insights"], {
                "cardType": "RT",
                "versions": {
                    "ui5": oManifest["sap.insights"].versions.ui5
                },
                "parentAppId": undefined,
                "filterEntitySet": "",
                "allowedChartTypes": []
            },"Card manifest contains sap.insights");
        });
    }
);