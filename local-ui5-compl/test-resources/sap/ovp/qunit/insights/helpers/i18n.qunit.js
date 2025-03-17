/*global QUnit*/

sap.ui.define([
    "sap/ovp/insights/helpers/i18n"
], function (i18nhelper) {
    "use strict";

    QUnit.test("Function fnReplacei18nKeysWithText in case if sap.app title, subtitle, header.title, subtitle and header details are path based strinig", function (assert) {
        var oi18nModel = {
            getProperty : function(sKey) {
                switch(sKey) {
                    case "appTitle" :
                        return "Procurement Overview";
                    case "appsubTitle" :
                        return "Procurement Overview Subtitle";
                    case "proc12_title" :
                        return "Procurement Overview Header Title";
                    case "proc12_subtitle" :
                        return "Procurement Overview Header subtitle";
                    case "proc12_header_Details_title" :
                        return "Procurement Overview Header details Title";
                    default :
                        return sKey;
                }
            }
        };
        var oManifest = {
            "sap.card": {
                "extension": "module:sap/insights/CardExtension",
                "type": "Analytical",
                "configuration": {
                    "parameters": {
                        "_detailsString2": {
                            "value": "{{proc12_header_Details_title}}"
                        }
                    }
                },
                "header": {
                    "type": "Numeric",
                    "title": "{{proc12_title}}",
                    "subTitle": "{{proc12_subtitle}}",
                    "data": {
                        "path": "/header/d/results/0"
                    },
                    "details": "{{parameters._detailsString2}}"
                }
            },
            "sap.app": {
                "title": "{{appTitle}}", //Procurement Overview
                "subTitle": "{{appsubTitle}}" // Procurement Overview subtitle
            }
        };

        //before function call check all values

        assert.ok(oManifest["sap.app"].title === "{{appTitle}}", "The app title before function call is i18n key");
        assert.ok(oManifest["sap.app"].subTitle === "{{appsubTitle}}", "The app subtitle before function call is i18n key");
        assert.ok(oManifest["sap.card"]["header"].title === "{{proc12_title}}", "The card header title before function call is i18n key");
        assert.ok(oManifest["sap.card"]["header"].subTitle === "{{proc12_subtitle}}", "The card header subtitle before function call is i18n key");
        assert.ok(oManifest["sap.card"]["header"].details === "{{parameters._detailsString2}}", "The card header details before function call is i18n key");
        assert.ok(oManifest["sap.card"]["configuration"]["parameters"]["_detailsString2"]["value"] === "{{proc12_header_Details_title}}", "The config params details string before function call is i18n key");
        i18nhelper.fnReplacei18nKeysWithText(oManifest, oi18nModel);
        assert.ok(oManifest["sap.app"].title === "Procurement Overview", "The app title after function call is i18n text");
        assert.ok(oManifest["sap.app"].subTitle === "Procurement Overview Subtitle", "The app subtitle after function call is i18n text");
        assert.ok(oManifest["sap.card"]["header"].title === "Procurement Overview Header Title", "The card header title after function call is i18n text");
        assert.ok(oManifest["sap.card"]["header"].subTitle === "Procurement Overview Header subtitle", "The card header subtitle after function call is i18n text");
        assert.ok(oManifest["sap.card"]["header"].details === "{{parameters._detailsString2}}", "The card header details before function call is i18n key");
        assert.ok(oManifest["sap.card"]["configuration"]["parameters"]["_detailsString2"]["value"] === "Procurement Overview Header details Title", "The config params details string after function call is i18n text");

    });

    QUnit.test("Function fnReplacei18nKeysWithText in case if sap.app title, subtitle are a string value and header.title, subtitle and header details are path based strinig", function (assert) {
        var oi18nModel = {
            getProperty : function(sKey) {
                switch(sKey) {
                    case "appTitle" :
                        return "Procurement Overview";
                    case "appsubTitle" :
                        return "Procurement Overview Subtitle";
                    case "proc12_title" :
                        return "Procurement Overview Header Title";
                    case "proc12_subtitle" :
                        return "Procurement Overview Header subtitle";
                    case "proc12_header_Details_title" :
                        return "Procurement Overview Header details Title";
                    default :
                        return sKey;
                }
            }
        };
        var oManifest = {
            "sap.card": {
                "extension": "module:sap/insights/CardExtension",
                "type": "Analytical",
                "configuration": {
                    "parameters": {
                        "_detailsString2": {
                            "value": "{{proc12_header_Details_title}}"
                        }
                    }
                },
                "header": {
                    "type": "Numeric",
                    "title": "{{proc12_title}}",
                    "subTitle": "{{proc12_subtitle}}",
                    "data": {
                        "path": "/header/d/results/0"
                    },
                    "details": "{{parameters._detailsString2}}",
                }
            },
            "sap.app": {
                "title": "Procurement Overview",
                "subTitle": "Procurement Overview Subtitle"
            }
        };

        //before function call check all values

        assert.ok(oManifest["sap.app"].title === "Procurement Overview", "The app title before function call is i18n text");
        assert.ok(oManifest["sap.app"].subTitle === "Procurement Overview Subtitle", "The app subtitle before function call is i18n text");
        assert.ok(oManifest["sap.card"]["header"].title === "{{proc12_title}}", "The card header title before function call is i18n key");
        assert.ok(oManifest["sap.card"]["header"].subTitle === "{{proc12_subtitle}}", "The card header subtitle before function call is i18n key");
        assert.ok(oManifest["sap.card"]["header"].details === "{{parameters._detailsString2}}", "The card header details before function call is i18n key");
        assert.ok(oManifest["sap.card"]["configuration"]["parameters"]["_detailsString2"]["value"] === "{{proc12_header_Details_title}}", "The config params details string before function call is i18n key");
        i18nhelper.fnReplacei18nKeysWithText(oManifest, oi18nModel);
        assert.ok(oManifest["sap.app"].title === "Procurement Overview", "The app title is unchanged");
        assert.ok(oManifest["sap.app"].subTitle === "Procurement Overview Subtitle", "The app subtitle is unchanged");
        assert.ok(oManifest["sap.card"]["header"].title === "Procurement Overview Header Title", "The card header title after function call is i18n text");
        assert.ok(oManifest["sap.card"]["header"].subTitle === "Procurement Overview Header subtitle", "The card header subtitle after function call is i18n text");
        assert.ok(oManifest["sap.card"]["header"].details === "{{parameters._detailsString2}}", "The card header details before function call is i18n key");
        assert.ok(oManifest["sap.card"]["configuration"]["parameters"]["_detailsString2"]["value"] === "Procurement Overview Header details Title", "The config params details string after function call is i18n text");

    });

    QUnit.test("Function fnReplacei18nKeysWithText in case if all values are string values", function (assert) {
        var oi18nModel = {
            getProperty : function(sKey) {
                switch(sKey) {
                    case "appTitle" :
                        return "Procurement Overview";
                    case "appsubTitle" :
                        return "Procurement Overview Subtitle";
                    case "proc12_title" :
                        return "Procurement Overview Header Title";
                    case "proc12_subtitle" :
                        return "Procurement Overview Header subtitle";
                    case "proc12_header_Details_title" :
                        return "Procurement Overview Header details Title";
                    default :
                        return sKey;
                }
            }
        };
        var oManifest = {
            "sap.card": {
                "extension": "module:sap/insights/CardExtension",
                "type": "Analytical",
                "configuration": {
                    "parameters": {
                        "_detailsString2": {
                            "value": "Procurement Overview Header details Title"
                        }
                    }
                },
                "header": {
                    "type": "Numeric",
                    "title": "Procurement Overview Header Title",
                    "subTitle": "Procurement Overview Header subtitle",
                    "data": {
                        "path": "/header/d/results/0"
                    },
                    "details": "{{parameters._detailsString2}}"
                }
            },
            "sap.app": {
                "title": "Procurement Overview",
                "subTitle": "Procurement Overview Subtitle"
            }
        };

        //before function call check all values

        assert.ok(oManifest["sap.app"].title === "Procurement Overview", "The app title before function call is i18n text");
        assert.ok(oManifest["sap.app"].subTitle === "Procurement Overview Subtitle", "The app subtitle before function call is i18n text");
        assert.ok(oManifest["sap.card"]["header"].title === "Procurement Overview Header Title", "The card header title before function call is i18n key");
        assert.ok(oManifest["sap.card"]["header"].subTitle === "Procurement Overview Header subtitle", "The card header subtitle before function call is i18n key");
        assert.ok(oManifest["sap.card"]["header"].details === "{{parameters._detailsString2}}", "The card header details before function call is i18n key");
        assert.ok(oManifest["sap.card"]["configuration"]["parameters"]["_detailsString2"]["value"] === "Procurement Overview Header details Title", "The config params details string before function call is i18n key");
        i18nhelper.fnReplacei18nKeysWithText(oManifest, oi18nModel);
        assert.ok(oManifest["sap.app"].title === "Procurement Overview", "The app title is unchanged");
        assert.ok(oManifest["sap.app"].subTitle === "Procurement Overview Subtitle", "The app subtitle is unchanged");
        assert.ok(oManifest["sap.card"]["header"].title === "Procurement Overview Header Title", "The card header title after function call is i18n text");
        assert.ok(oManifest["sap.card"]["header"].subTitle === "Procurement Overview Header subtitle", "The card header subtitle after function call is i18n text");
        assert.ok(oManifest["sap.card"]["header"].details === "{{parameters._detailsString2}}", "The card header details before function call is i18n key");
        assert.ok(oManifest["sap.card"]["configuration"]["parameters"]["_detailsString2"]["value"] === "Procurement Overview Header details Title", "The config params details string after function call is i18n text");

    });

    QUnit.test("Function fnReplacei18nKeysWithText in case if details is a direct i18n key", function (assert) {
        var oi18nModel = {
            getProperty : function(sKey) {
                switch(sKey) {
                    case "ProductionCostsTrend_Title" :
                        return "Total Production Costs - Trend";
                    case "ProductionCostsTrend_KPI_ValueSelectionInfo" :
                        return "Total actual costs, selected time frame ";
                    default :
                        return sKey;
                }
            }
        };
        var oManifest = {
            "sap.card": {
                "header": {
                    "type": "Numeric",
                    "title": "{{ProductionCostsTrend_Title}}",
                    "data": {
                        "path": "/header/d/results/0"
                    },
                    "details": "{{ProductionCostsTrend_KPI_ValueSelectionInfo}}"
                }
            },
            "sap.app" : {}
        };

        assert.ok(oManifest["sap.card"]["header"].title === "{{ProductionCostsTrend_Title}}", "The card header title before function call is i18n key");
        assert.ok(!oManifest["sap.card"]["header"].subTitle, "The card header subtitle is not present");
        assert.ok(oManifest["sap.card"]["header"].details === "{{ProductionCostsTrend_KPI_ValueSelectionInfo}}", "The card header details before function call is i18n key");
        i18nhelper.fnReplacei18nKeysWithText(oManifest, oi18nModel);
        assert.ok(oManifest["sap.card"]["header"].title === "Total Production Costs - Trend", "The card header title after function call is i18n text");
        assert.ok(!oManifest["sap.card"]["header"].subTitle, "The card header subtitle is not present");
        assert.ok(oManifest["sap.card"]["header"].details === "Total actual costs, selected time frame ", "The card header details before function call is i18n key");
    });

    QUnit.test("Function fnReplacei18nKeysWithText in case if details string is having multiple strings seprated by |, having a value in config params.", function (assert) {
        var oi18nModel = {
            getProperty : function(sKey) {
                switch(sKey) {
                    case "ProductionCostsTrend_Title" :
                        return "Total Production Costs - Trend";
                    case "ProductionCostsTrend_KPI_ValueSelectionInfo" :
                        return "Total actual costs, selected time frame ";
                    default :
                        return sKey;
                }
            }
        };

        var oManifest = {
            "sap.card": {
                "extension": "module:sap/insights/CardExtension",
                "type": "Analytical",
                "configuration": {
                    "parameters": {
                        "_detailsString1": {
                            "value": "Average DSO"
                        },
                        "_detailsString2": {
                            "value": "By Company Code"
                        }
                    }
                },
             
                "header": {
                    "type": "Numeric",
                    "title": "Days Sales Outstanding",
                    "subTitle": "DSO vs Best possible DSO",
                    "data": {
                        "path": "/header/d/results/0"
                    },
                    "details": "{{parameters._detailsString1}} | {{parameters._detailsString2}}",
                }
            },
            "sap.app": {
                "title": "General Ledger Overview",
                "subTitle": "General Ledger Overview"
            }
        };
        
        assert.ok(oManifest["sap.app"]["title"] === "General Ledger Overview", "The sap.app title before function call is i18n key");
        assert.ok(oManifest["sap.app"]["subTitle"] === "General Ledger Overview", "The sap.app subtitle is present");
        assert.ok(oManifest["sap.card"]["header"].details === "{{parameters._detailsString1}} | {{parameters._detailsString2}}", "The card header details before function call is i18n key");
        assert.ok(oManifest["sap.card"]["header"].title === "Days Sales Outstanding", "The card header title before function call is i18n key");
        assert.ok(oManifest["sap.card"]["header"].subTitle === "DSO vs Best possible DSO", "The card header subtitle is present before function call");
        assert.ok(oManifest["sap.card"]["configuration"].parameters._detailsString1.value === "Average DSO", "The first configuration parameter is present before function call");
        assert.ok(oManifest["sap.card"]["configuration"].parameters._detailsString2.value === "By Company Code", "The Second configuration parameter is present before function call");
        i18nhelper.fnReplacei18nKeysWithText(oManifest, oi18nModel);
        assert.ok(oManifest["sap.app"]["title"] === "General Ledger Overview", "The sap.app header title is unchanged.");
        assert.ok(oManifest["sap.app"]["subTitle"] === "General Ledger Overview", "The sap.app subtitle is unchanged.");
        assert.ok(oManifest["sap.card"]["header"].details === "{{parameters._detailsString1}} | {{parameters._detailsString2}}", "The card header details before function call is i18n key");
        assert.ok(oManifest["sap.card"]["header"].title === "Days Sales Outstanding", "The card header title is unchanged.");
        assert.ok(oManifest["sap.card"]["header"].subTitle === "DSO vs Best possible DSO", "The card header subtitle did not change.");
        assert.ok(oManifest["sap.card"]["configuration"].parameters._detailsString1.value === "Average DSO", "The first configuration parameter is same.");
        assert.ok(oManifest["sap.card"]["configuration"].parameters._detailsString2.value === "By Company Code", "The Second configuration parameter is same.");
    });

    QUnit.test("Function fnReplacei18nKeysWithText in case if details string is having multiple strings seprated by |, having i18n key in config params.", function (assert) {
        var oi18nModel = {
            getProperty : function(sKey) {
                switch(sKey) {
                    case "average_DSO" :
                        return "Average DSO";
                    case "By_Company_Code" :
                        return "By Company Code";
                    default :
                        return sKey;
                }
            }
        };

        var oManifest = {
            "sap.card": {
                "extension": "module:sap/insights/CardExtension",
                "type": "Analytical",
                "configuration": {
                    "parameters": {
                        "_detailsString1": {
                            "value": "{{average_DSO}}"
                        },
                        "_detailsString2": {
                            "value": "{{By_Company_Code}}"
                        }
                    }
                },
             
                "header": {
                    "type": "Numeric",
                    "title": "Days Sales Outstanding",
                    "subTitle": "DSO vs Best possible DSO",
                    "data": {
                        "path": "/header/d/results/0"
                    },
                    "details": "{{parameters._detailsString1}} | {{parameters._detailsString2}}",
                }
            },
            "sap.app": {
                "title": "General Ledger Overview",
                "subTitle": "General Ledger Overview"
            }
        };
        
        assert.ok(oManifest["sap.app"]["title"] === "General Ledger Overview", "The sap.app title before function call is i18n key");
        assert.ok(oManifest["sap.app"]["subTitle"] === "General Ledger Overview", "The sap.app subtitle is present");
        assert.ok(oManifest["sap.card"]["header"].details === "{{parameters._detailsString1}} | {{parameters._detailsString2}}", "The card header details before function call is i18n key");
        assert.ok(oManifest["sap.card"]["header"].title === "Days Sales Outstanding", "The card header title before function call is i18n key");
        assert.ok(oManifest["sap.card"]["header"].subTitle === "DSO vs Best possible DSO", "The card header subtitle is present before function call");
        assert.ok(oManifest["sap.card"]["configuration"].parameters._detailsString1.value === "{{average_DSO}}", "The first configuration parameter is present before function call");
        assert.ok(oManifest["sap.card"]["configuration"].parameters._detailsString2.value === "{{By_Company_Code}}", "The Second configuration parameter is present before function call");
        i18nhelper.fnReplacei18nKeysWithText(oManifest, oi18nModel);
        assert.ok(oManifest["sap.app"]["title"] === "General Ledger Overview", "The sap.app header title is unchanged.");
        assert.ok(oManifest["sap.app"]["subTitle"] === "General Ledger Overview", "The sap.app subtitle is unchanged.");
        assert.ok(oManifest["sap.card"]["header"].details === "{{parameters._detailsString1}} | {{parameters._detailsString2}}", "The card header details before function call is i18n key");
        assert.ok(oManifest["sap.card"]["header"].title === "Days Sales Outstanding", "The card header title is unchanged.");
        assert.ok(oManifest["sap.card"]["header"].subTitle === "DSO vs Best possible DSO", "The card header subtitle did not change.");
        assert.ok(oManifest["sap.card"]["configuration"].parameters._detailsString1.value === "Average DSO", "The first configuration parameter is same.");
        assert.ok(oManifest["sap.card"]["configuration"].parameters._detailsString2.value === "By Company Code", "The Second configuration parameter is same.");
    });

    QUnit.test("Function fnReplacei18nKeysWithText in case if details string2 is given for header.", function (assert) {
        var oi18nModel = {
            getProperty : function(sKey) {
                switch(sKey) {
                    case "average_DSO" :
                        return "Average DSO";
                    case "By_Company_Code" :
                        return "By Company Code";
                    default :
                        return sKey;
                }
            }
        };

        var oManifest = {
            "sap.card": {
                "configuration": {
                    "parameters": {
                       
                        "_detailsString2": {
                            "value": "Grouped by Company Code"
                        }
                    }
                },
                "header": {
                    "details": "{{parameters._detailsString2}}"
                }
            },
            "sap.app": {
            }
        };
        
        assert.ok(oManifest["sap.card"]["header"]["details"] === "{{parameters._detailsString2}}", "The sap.card header details before function call.");
        assert.ok(oManifest["sap.card"]["configuration"]["parameters"]["_detailsString2"]["value"] === "Grouped by Company Code", "The configuration parameter _detailsString2 before function call.");
        i18nhelper.fnReplacei18nKeysWithText(oManifest, oi18nModel);
        assert.ok(oManifest["sap.card"]["header"]["details"] === "{{parameters._detailsString2}}", "The sap.card header details should be unchanged after function call.");
        assert.ok(oManifest["sap.card"]["configuration"]["parameters"]["_detailsString2"]["value"] === "Grouped by Company Code", "The configuration parameter _detailsString2 should be same after function call.");
    });
});
