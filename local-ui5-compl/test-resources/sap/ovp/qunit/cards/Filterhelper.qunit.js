sap.ui.define([
    "sap/ovp/cards/Filterhelper",
    "test-resources/sap/ovp/qunit/cards/utils"
], function (
    Filterhelper,
    utils
) {
    "use strict";

    QUnit.test("Filterhelper - getFilters, with multiple filters with EQ and I", function (assert) {
        var oSelectionVariant = {
            SelectOptions: [
                {
                    PropertyName: { PropertyPath: "ID" },
                    Ranges: [
                        {
                            Low: { String: "201" },
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                    ],
                },
                {
                    PropertyName: { PropertyPath: "GrossAmount" },
                    Ranges: [
                        {
                            Low: {String: "70000"},
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                    ],
                },
                {
                    PropertyName: { PropertyPath: "CityName" },
                    Ranges: [
                        {
                            Low: { String: "BLR" },
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                    ],
                }
            ],
        };
        var oContext = new utils.ContextMock({
            ovpCardProperties: {},
        });
        var ovpCardProperties = oContext.getSetting("ovpCardProperties");
        var aExpectedResult = [
            {
                operator: "EQ",
                path: "ID",
                sign: "I",
                value1: "201",
                value2: undefined
            },
            {
                operator: "EQ",
                path: "GrossAmount",
                sign: "I",
                value1: "70000",
                value2: undefined
            },
            {
                operator: "EQ",
                path: "CityName",
                sign: "I",
                value1: "BLR",
                value2: undefined
            }
        ];
        var aResult = Filterhelper.getFilters(ovpCardProperties, oSelectionVariant);
        assert.deepEqual(aExpectedResult, aResult, "Filters are generated correctly for multiple filters with EQ and I");
    });
    
    QUnit.test("Filterhelper - getFilters, with multiple filters with EQ and I and multiple ranges", function (assert) {
        var oSelectionVariant = {
            SelectOptions: [
                {
                    PropertyName: { PropertyPath: "ID" },
                    Ranges: [
                        {
                            Low: { String: "201" },
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                    ],
                },
                {
                    PropertyName: { PropertyPath: "GrossAmount" },
                    Ranges: [
                        {
                            Low: {String: "70000"},
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                        {
                            Low: {String: "50000"},
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                    ],
                },
                {
                    PropertyName: { PropertyPath: "CityName" },
                    Ranges: [
                        {
                            Low: { String: "BLR" },
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                    ],
                }
            ],
        };
        var oContext = new utils.ContextMock({
            ovpCardProperties: {},
        });
        var ovpCardProperties = oContext.getSetting("ovpCardProperties");
        var aExpectedResult = [
            {
                operator: "EQ",
                path: "ID",
                sign: "I",
                value1: "201",
                value2: undefined
            },
            {
                operator: "EQ",
                path: "GrossAmount",
                sign: "I",
                value1: "70000",
                value2: undefined
            },
            {
                path: "GrossAmount",
                operator: "EQ",
                value1: "50000",
                sign: "I",
                value2: undefined
            },
            {
                operator: "EQ",
                path: "CityName",
                sign: "I",
                value1: "BLR",
                value2: undefined
            }
        ];
        var aResult = Filterhelper.getFilters(ovpCardProperties, oSelectionVariant);
        assert.deepEqual(aExpectedResult, aResult, "Filters are generated correctly for multiple filters with EQ and I with multiple ranged");
    });
    
    QUnit.test("Filterhelper - getFilters, with multiple filters with single NE / NotContains and I", function (assert) {
        var oSelectionVariant = {
            SelectOptions: [
                {
                    PropertyName: { PropertyPath: "ID" },
                    Ranges: [
                        {
                            Low: { String: "201" },
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NotContains" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                    ],
                },
                {
                    PropertyName: { PropertyPath: "GrossAmount" },
                    Ranges: [
                        {
                            Low: {String: "70000"},
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        }
                    ],
                },
                {
                    PropertyName: { PropertyPath: "CityName" },
                    Ranges: [
                        {
                            Low: { String: "BLR" },
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NE" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                    ],
                }
            ],
        };
        var oContext = new utils.ContextMock({
            ovpCardProperties: {
                "/cardId": "card01"
            },
        });
        var ovpCardProperties = oContext.getSetting("ovpCardProperties");
        var aExpectedResult = [
            {
                "path": "GrossAmount",
                "operator": "EQ",
                "value1": "70000",
                "sign": "I",
                "value2": undefined
            },
            {
                "filters": [
                    {
                        "path": "ID",
                        "operator": "NotContains",
                        "value1": "201",
                        "sign": "I",
                        "value2": undefined
                    },
                    {
                        "path": "CityName",
                        "operator": "NE",
                        "value1": "BLR",
                        "sign": "I",
                        "value2": undefined
                    }
                ],
                "and": true
            }
        ];
        var aResult = Filterhelper.getFilters(ovpCardProperties, oSelectionVariant);
        assert.deepEqual(aExpectedResult, Filterhelper.createExcludeFilters(aResult, ovpCardProperties), "Filters are generated correctly for multiple filters with single NE / NotContains and I");
    });
    
    QUnit.test("Filterhelper - getFilters, combination of NE and BT , multiple NE and NotContains with Include 'I' Sign", function (assert) {
        var oSelectionVariant = {
            SelectOptions: [
                {
                    PropertyName: { PropertyPath: "ID" },
                    Ranges: [
                        {
                            Low: { String: "201" },
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NotContains" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                        {
                            Low: { String: "207" },
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NotContains" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        }
                    ],
                },
                {
                    PropertyName: { PropertyPath: "GrossAmount" },
                    Ranges: [
                        {
                            Low: {String: "70000"},
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NE" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                        {
                            Low: {String: "10000"},
                            High: {String: "40000"},
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/BT" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        }
                    ],
                },
                {
                    PropertyName: { PropertyPath: "CityName" },
                    Ranges: [
                        {
                            Low: { String: "BLR" },
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NE" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                        {
                            Low: { String: "DEL" },
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NE" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        }
                    ],
                }
            ],
        };
        var oContext = new utils.ContextMock({
            ovpCardProperties: {
                "/cardId": "card01"
            },
        });
        var ovpCardProperties = oContext.getSetting("ovpCardProperties");
        var aExpectedResult = [
            {
                "path": "GrossAmount",
                "operator": "BT",
                "value1": "10000",
                "value2": "40000",
                "sign": "I"
            },
            {
                "filters": [
                    {
                        "path": "ID",
                        "operator": "NotContains",
                        "value1": "201",
                        "sign": "I",
                        "value2": undefined
                    },
                    {
                        "path": "ID",
                        "operator": "NotContains",
                        "value1": "207",
                        "sign": "I",
                        "value2": undefined
                    },
                    {
                        "path": "GrossAmount",
                        "operator": "NE",
                        "value1": "70000",
                        "sign": "I",
                        "value2": undefined
                    },
                    {
                        "path": "CityName",
                        "operator": "NE",
                        "value1": "BLR",
                        "sign": "I",
                        "value2": undefined
                    },
                    {
                        "path": "CityName",
                        "operator": "NE",
                        "value1": "DEL",
                        "sign": "I",
                        "value2": undefined
                    }
                ],
                "and": true
            }
        ];
        var aResult = Filterhelper.getFilters(ovpCardProperties, oSelectionVariant);
        assert.deepEqual(aExpectedResult, Filterhelper.createExcludeFilters(aResult, ovpCardProperties), "Filters are generated correctly for multiple filters with multiple operators and 'I' Sign");
    });
    
    QUnit.test("Filterhelper - getFilters, combination of Multiple exclude filters", function (assert) {
        var oSelectionVariant = {
            SelectOptions: [
                {
                    PropertyName: { PropertyPath: "ID" },
                    Ranges: [
                        {
                            Low: { String: "201" },
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/Contains" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/E" }
                        },
                        {
                            Low: { String: "207" },
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NotContains" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" }
                        },
                        {
                            Low: { String: "208" },
                            High: { String: "210" },
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/BT" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/E" }
                        },
                        {
                            Low: { String: "207" },
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NotStartsWith" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" }
                        },
                        {
                            Low: { String: "208" },
                            High: { String: "215" },
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/BT" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" }
                        },
                        {
                            Low: { String: "20" },
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/StartsWith" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" }
                        }
                    ],
                },
                {
                    PropertyName: { PropertyPath: "GrossAmount" },
                    Ranges: [
                        {
                            Low: {String: "70000"},
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NE" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" }
                        },
                        {
                            Low: {String: "5000"},
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/LE" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/E" }
                        },
                        {
                            Low: {String: "500000"},
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/GE" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/E" }
                        },
                        {
                            Low: {String: "10000"},
                            High: {String: "40000"},
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/BT" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" }
                        },
                        {
                            Low: {String: "30000"},
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/LE" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" }
                        },
                        {
                            Low: {String: "15000"},
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/GE" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" }
                        },
                    ],
                },
                {
                    PropertyName: { PropertyPath: "CityName" },
                    Ranges: [
                        {
                            Low: { String: "BLR" },
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NE" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" }
                        },
                        {
                            Low: { String: "DEL" },
                            Option: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ" },
                            Sign: { EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/E" }
                        }
                    ],
                }
            ],
        };
        var oContext = new utils.ContextMock({
            ovpCardProperties: {
                "/cardId": "card01"
            },
        });
        var ovpCardProperties = oContext.getSetting("ovpCardProperties");
        var aExpectedResult = [
            {
                "path": "ID",
                "operator": "BT",
                "value1": "208",
                "value2": "215",
                "sign": "I"
            },
            {
                "path": "ID",
                "operator": "StartsWith",
                "value1": "20",
                "sign": "I",
                "value2": undefined
            },
            {
                "path": "GrossAmount",
                "operator": "BT",
                "value1": "10000",
                "value2": "40000",
                "sign": "I"
            },
            {
                "path": "GrossAmount",
                "operator": "LE",
                "value1": "30000",
                "sign": "I",
                "value2": undefined
            },
            {
                "path": "GrossAmount",
                "operator": "GE",
                "value1": "15000",
                "sign": "I",
                "value2": undefined
            },
            {
                "filters": [
                    {
                        "path": "ID",
                        "operator": "NotContains",
                        "value1": "201",
                        "sign": "I",
                        "value2": undefined
                    },
                    {
                        "path": "ID",
                        "operator": "NotContains",
                        "value1": "207",
                        "sign": "I",
                        "value2": undefined
                    },
                    {
                        "path": "ID",
                        "operator": "NB",
                        "value1": "208",
                        "value2": "210",
                        "sign": "I"
                    },
                    {
                        "path": "ID",
                        "operator": "NotStartsWith",
                        "value1": "207",
                        "sign": "I",
                        "value2": undefined
                    },
                    {
                        "path": "GrossAmount",
                        "operator": "NE",
                        "value1": "70000",
                        "sign": "I",
                        "value2": undefined
                    },
                    {
                        "path": "GrossAmount",
                        "operator": "GT",
                        "value1": "5000",
                        "sign": "I",
                        "value2": undefined
                    },
                    {
                        "path": "GrossAmount",
                        "operator": "LT",
                        "value1": "500000",
                        "sign": "I",
                        "value2": undefined
                    },
                    {
                        "path": "CityName",
                        "operator": "NE",
                        "value1": "BLR",
                        "sign": "I",
                        "value2": undefined
                    },
                    {
                        "path": "CityName",
                        "operator": "NE",
                        "value1": "DEL",
                        "sign": "I",
                        "value2": undefined
                    }
                ],
                "and": true
            }
        ];
        var aResult = Filterhelper.getFilters(ovpCardProperties, oSelectionVariant);
        assert.deepEqual(aExpectedResult, Filterhelper.createExcludeFilters(aResult, ovpCardProperties), "Filters are generated correctly for multiple filters with multiple operators");
    });

    QUnit.test("Filterhelper - getFilters, with multiple filters with EQ and I for V4 card", function (assert) {
        var oSelectionVariant = {
            SelectOptions: [
                {
                    PropertyName: { $PropertyPath: "ID" },
                    Ranges: [
                        {
                            Low:  "201",
                            Option: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ" },
                            Sign: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                    ],
                },
                {
                    PropertyName: { $PropertyPath: "GrossAmount" },
                    Ranges: [
                        {
                            Low: "70000",
                            Option: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ" },
                            Sign: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                    ],
                },
                {
                    PropertyName: { $PropertyPath: "CityName" },
                    Ranges: [
                        {
                            Low:  "BLR",
                            Option: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ" },
                            Sign: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                    ],
                }
            ],
        };
        var oContext = new utils.ContextMock({
            ovpCardProperties: {},
        });
        var oOvpCardProperties = oContext.getSetting("ovpCardProperties");
        var aExpectedResult = [
            {
                operator: "EQ",
                path: "ID",
                sign: "I",
                value1: "201",
                value2: undefined
            },
            {
                operator: "EQ",
                path: "GrossAmount",
                sign: "I",
                value1: "70000",
                value2: undefined
            },
            {
                operator: "EQ",
                path: "CityName",
                sign: "I",
                value1: "BLR",
                value2: undefined
            }
        ];
        var aResult = Filterhelper.getFilters(oOvpCardProperties, oSelectionVariant, true);
        assert.deepEqual(aExpectedResult, aResult, "Filters are generated correctly for multiple filters with EQ and I");
    });

    QUnit.test("Filterhelper - getFilters, with multiple filters with EQ and I and multiple ranges for V4 card", function (assert) {
        var oSelectionVariant = {
            SelectOptions: [
                {
                    PropertyName: { $PropertyPath: "ID" },
                    Ranges: [
                        {
                            Low: "201",
                            Option: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ" },
                            Sign: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                    ],
                },
                {
                    PropertyName: { $PropertyPath: "GrossAmount" },
                    Ranges: [
                        {
                            Low: "70000",
                            Option: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ" },
                            Sign: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                        {
                            Low: "50000",
                            Option: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ" },
                            Sign: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                    ],
                },
                {
                    PropertyName: { $PropertyPath: "CityName" },
                    Ranges: [
                        {
                            Low: "BLR",
                            Option: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ" },
                            Sign: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                    ],
                }
            ],
        };
        var oContext = new utils.ContextMock({
            ovpCardProperties: {},
        });
        var oOvpCardProperties = oContext.getSetting("ovpCardProperties");
        var aExpectedResult = [
            {
                operator: "EQ",
                path: "ID",
                sign: "I",
                value1: "201",
                value2: undefined
            },
            {
                operator: "EQ",
                path: "GrossAmount",
                sign: "I",
                value1: "70000",
                value2: undefined
            },
            {
                path: "GrossAmount",
                operator: "EQ",
                value1: "50000",
                sign: "I",
                value2: undefined
            },
            {
                operator: "EQ",
                path: "CityName",
                sign: "I",
                value1: "BLR",
                value2: undefined
            }
        ];
        var aResult = Filterhelper.getFilters(oOvpCardProperties, oSelectionVariant, true);
        assert.deepEqual(aExpectedResult, aResult, "Filters are generated correctly for multiple filters with EQ and I with multiple ranged");
    });

    QUnit.test("Filterhelper - getFilters, with multiple filters with single NE / NotContains and I for V4 Card", function (assert) {
        var oSelectionVariant = {
            SelectOptions: [
                {
                    PropertyName: { $PropertyPath: "ID" },
                    Ranges: [
                        {
                            Low: "201",
                            Option: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NotContains" },
                            Sign: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                    ],
                },
                {
                    PropertyName: { $PropertyPath: "GrossAmount" },
                    Ranges: [
                        {
                            Low: "70000",
                            Option: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ" },
                            Sign: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        }
                    ],
                },
                {
                    PropertyName: { $PropertyPath: "CityName" },
                    Ranges: [
                        {
                            Low: "BLR",
                            Option: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NE" },
                            Sign: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                    ],
                }
            ],
        };
        var oContext = new utils.ContextMock({
            ovpCardProperties: {
                "/cardId": "card01"
            },
        });
        var oOvpCardProperties = oContext.getSetting("ovpCardProperties");
        var aExpectedResult = [
            {
                "path": "GrossAmount",
                "operator": "EQ",
                "value1": "70000",
                "sign": "I",
                "value2": undefined
            },
            {
                "filters": [
                    {
                        "path": "ID",
                        "operator": "NotContains",
                        "value1": "201",
                        "sign": "I",
                        "value2": undefined
                    },
                    {
                        "path": "CityName",
                        "operator": "NE",
                        "value1": "BLR",
                        "sign": "I",
                        "value2": undefined
                    }
                ],
                "and": true
            }
        ];
        var aResult = Filterhelper.getFilters(oOvpCardProperties, oSelectionVariant, true);
        assert.deepEqual(aExpectedResult, Filterhelper.createExcludeFilters(aResult, oOvpCardProperties), "Filters are generated correctly for multiple filters with single NE / NotContains and I");
    });

    QUnit.test("Filterhelper - getFilters, combination of NE and BT , multiple NE and NotContains with Include 'I' Sign For V4 card", function (assert) {
        var oSelectionVariant = {
            SelectOptions: [
                {
                    PropertyName: { $PropertyPath: "ID" },
                    Ranges: [
                        {
                            Low: "201",
                            Option: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NotContains" },
                            Sign: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                        {
                            Low: "207",
                            Option: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NotContains" },
                            Sign: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        }
                    ],
                },
                {
                    PropertyName: { $PropertyPath: "GrossAmount" },
                    Ranges: [
                        {
                            Low: "70000",
                            Option: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NE" },
                            Sign: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                        {
                            Low: "10000",
                            High: "40000",
                            Option: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/BT" },
                            Sign: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        }
                    ],
                },
                {
                    PropertyName: { $PropertyPath: "CityName" },
                    Ranges: [
                        {
                            Low: "BLR",
                            Option: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NE" },
                            Sign: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        },
                        {
                            Low: "DEL",
                            Option: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/NE" },
                            Sign: { $EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I" },
                        }
                    ],
                }
            ],
        };
        var oContext = new utils.ContextMock({
            ovpCardProperties: {
                "/cardId": "card01"
            },
        });
        var oOvpCardProperties = oContext.getSetting("ovpCardProperties");
        var aExpectedResult = [
            {
                "path": "GrossAmount",
                "operator": "BT",
                "value1": "10000",
                "value2": "40000",
                "sign": "I"
            },
            {
                "filters": [
                    {
                        "path": "ID",
                        "operator": "NotContains",
                        "value1": "201",
                        "sign": "I",
                        "value2": undefined
                    },
                    {
                        "path": "ID",
                        "operator": "NotContains",
                        "value1": "207",
                        "sign": "I",
                        "value2": undefined
                    },
                    {
                        "path": "GrossAmount",
                        "operator": "NE",
                        "value1": "70000",
                        "sign": "I",
                        "value2": undefined
                    },
                    {
                        "path": "CityName",
                        "operator": "NE",
                        "value1": "BLR",
                        "sign": "I",
                        "value2": undefined
                    },
                    {
                        "path": "CityName",
                        "operator": "NE",
                        "value1": "DEL",
                        "sign": "I",
                        "value2": undefined
                    }
                ],
                "and": true
            }
        ];
        var aResult = Filterhelper.getFilters(oOvpCardProperties, oSelectionVariant, true);
        assert.deepEqual(aExpectedResult, Filterhelper.createExcludeFilters(aResult, oOvpCardProperties), "Filters are generated correctly for multiple filters with multiple operators and 'I' Sign");
    });

    QUnit.test("Table function getPrimitiveValue - Filterhelper", function (assert) {
        var Value1 = { String: "test" };
        var oValue2 = {
            Boolean: {
                toLowerCase: function () {
                    return "true";
                },
            },
        };
        var oValue3 = {
            Boolean: {
                toLowerCase: function () {
                    return "false";
                },
            },
        };
        var oValue4 = {
            Bool: {
                toLowerCase: function () {
                    return "false";
                },
            },
        };
        var oValue5 = {
            Bool: {
                toLowerCase: function () {
                    return "true";
                },
            },
        };
        var oValueDateTime = { DateTime: "03/01/1995" };
        var oValueDateTime1 = { DateTimeOffset: "03/01/1995" };

        var oNumberValue1 = { String: "1010" };
        var oNumberValue2 = { Int: 10 };
        var oNumberValue3 = { $Decimal: 10.0 };
        var oNumberValue4 = { Double: 10.12 };
        var oNumberValue5 = { Single: 12 };
        var oNumberValue6 = 123;

        assert.ok(
            Filterhelper.getPrimitiveValue("2,028", true) === "2,028",
            "function getPrimitiveValue called for value string"
        );
        assert.ok(
            Filterhelper.getPrimitiveValue(Value1) === "test",
            "function getPrimitiveValue called for type string"
        );
        assert.ok(
            Filterhelper.getPrimitiveValue(oValue2) === true,
            "function getPrimitiveValue called for type Boolean"
        );
        assert.ok(
            Filterhelper.getPrimitiveValue(oValue3) === false,
            "function getPrimitiveValue called for type Boolean"
        );
        assert.ok(
            Filterhelper.getPrimitiveValue(oValue4) === false,
            "function getPrimitiveValue called for type Boolean"
        );
        assert.ok(
            Filterhelper.getPrimitiveValue(oValue5) === true,
            "function getPrimitiveValue called for type Boolean"
        );
        assert.ok(
            Filterhelper.getPrimitiveValue(oValueDateTime) === "03/01/1995",
            "function getPrimitiveValue called for type DateTime"
        );
        assert.ok(
            Filterhelper.getPrimitiveValue(oValueDateTime1) === "03/01/1995",
            "function getPrimitiveValue called for type DateTimeOffset"
        );
        assert.ok(
            Filterhelper.getPrimitiveValue(oNumberValue1) === "1010",
            "function getPrimitiveValue called for type Number"
        );
        assert.ok(
            Filterhelper.getPrimitiveValue(oNumberValue2) === 10,
            "function getPrimitiveValue called for type Number"
        );
        assert.ok(
            Filterhelper.getPrimitiveValue(oNumberValue3, true) === 10.0,
            "function getPrimitiveValue called for type Number"
        );
        assert.ok(
            Filterhelper.getPrimitiveValue(oNumberValue4) === 10.12,
            "function getPrimitiveValue called for type Number"
        );
        assert.ok(
            Filterhelper.getPrimitiveValue(oNumberValue5) === 12,
            "function getPrimitiveValue called for type Number"
        );
        assert.ok(
            Filterhelper.getPrimitiveValue(oNumberValue6, true) === 123,
            "function getPrimitiveValue called for type Number"
        );
    });
});