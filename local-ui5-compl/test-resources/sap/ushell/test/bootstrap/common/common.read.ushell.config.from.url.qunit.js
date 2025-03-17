// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file QUnit tests for "sap/ushell/bootstrap/common/common.read.ushell.config.from.url"
 */
sap.ui.define([
    "sap/ushell/bootstrap/common/common.read.ushell.config.from.url"
], function (oReadConfigFromUrl) {
    "use strict";

    /* global QUnit */

    var S_QUERY_PARAM_NAME = "sap-ushell-xx-overwrite-config";
    var A_BLOCKED = [];

    QUnit.module("common.read.ushell.config.from.url");

    [{
        testDescription: "url query params at all",
        input: { windowLocationSearch: "" },
        expectedConfig: {}
    }, {
        testDescription: "different query parameter",
        input: { windowLocationSearch: "?param=foo" },
        expectedConfig: {}
    }, {
        testDescription: S_QUERY_PARAM_NAME + " with single string value",
        input: { windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa/bbb/ccc/foo:foo" },
        expectedConfig: {
            aaa: { bbb: { ccc: { foo: "foo" } } }
        }
    }, {
        testDescription: S_QUERY_PARAM_NAME + " with 2 string values in different namespace",
        input: {
            windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa/bbb/ccc/foo:foo,xxx/yyy/zzz/bar:bar%20bar"
        },
        expectedConfig: {
            aaa: { bbb: { ccc: { foo: "foo" } } },
            xxx: { yyy: { zzz: { bar: "bar bar" } } }
        }
    }, {
        testDescription: S_QUERY_PARAM_NAME + " with 2 string values in same namespace",
        input: {
            windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa/bbb/ccc/foo:foo,aaa/bbb/ccc/bar:bar%20bar"
        },
        expectedConfig: {
            aaa: {
                bbb: {
                    ccc: {
                        foo: "foo",
                        bar: "bar bar"
                    }
                }
            }
        }
    }, {
        testDescription: S_QUERY_PARAM_NAME + " with 2 boolean values in same namespace",
        input: {
            windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa/bbb/ccc/foo:true,aaa/bbb/ccc/bar:false"
        },
        expectedConfig: {
            aaa: {
                bbb: {
                    ccc: {
                        foo: true,
                        bar: false
                    }
                }
            }
        }
    }, {
        testDescription: S_QUERY_PARAM_NAME + " with 2 string values in partially same namespace",
        input: {
            windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa/bbb/ccc/foo:foo,aaa/bbb/zzz/bar:bar"
        },
        expectedConfig: {
            aaa: {
                bbb: {
                    ccc: { foo: "foo" },
                    zzz: { bar: "bar" }
                }
            }
        }
    }, {
        testDescription: S_QUERY_PARAM_NAME + " with 2 number values in partially same namespace",
        input: {
            windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa/bbb/ccc/foo:0,aaa/bbb/zzz/bar:-1.3"
        },
        expectedConfig: {
            aaa: {
                bbb: {
                    ccc: { foo: 0 },
                    zzz: { bar: -1.3 }
                }
            }
        }
    }, {
        testDescription: S_QUERY_PARAM_NAME + ' with optional leading "/" in namespace (supported e.g. in "sap-ui-debug")',
        input: {
            windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=/aaa/bbb/ccc/foo:foo,/aaa/bbb/zzz/bar:bar"
        },
        expectedConfig: {
            aaa: {
                bbb: {
                    ccc: { foo: "foo" },
                    zzz: { bar: "bar" }
                }
            }
        }
    }, {
        testDescription: S_QUERY_PARAM_NAME + " with encoding of colon",
        input: {
            windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa%2ffoo%3abar"
        },
        expectedConfig: { aaa: { foo: "bar" } }
    }, {
        // To conform with the specification of the query string ("application/x-www-form-urlencoded")
        // see: https://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
        testDescription: S_QUERY_PARAM_NAME + ' with proper encoding of " " (space) as "+"',
        input: { windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa/foo:foo+bar,bbb/bar:bar+foo" },
        expectedConfig: {
            aaa: { foo: "foo bar" },
            bbb: { bar: "bar foo" }
        }
    }, {
        testDescription: S_QUERY_PARAM_NAME + " with proper decoding of the whole query value",
        input: { windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa%2ffoo%3afoo+bar%2cbbb%2fbar%3abar+foo" },
        expectedConfig: {
            aaa: { foo: "foo bar" },
            bbb: { bar: "bar foo" }
        }
    }, {
        testDescription: S_QUERY_PARAM_NAME + " with escaping of commas and colons with backslashes (for properties)",
        input: { windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa/foo\\:foo+bar\\,bbb/bar:bar+foo" },
        expectedConfig: {
            aaa: { "foo:foo bar,bbb": { bar: "bar foo" } }
        }
    }, {
        testDescription: S_QUERY_PARAM_NAME + " with escaping of commas and colons with backslashes (for values)",
        input: { windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa/foo:foo+bar\\,bbb/bar\\:bar+foo" },
        expectedConfig: {
            aaa: { foo: "foo bar,bbb/bar:bar foo" }
        }
    }, {
        testDescription: S_QUERY_PARAM_NAME + " with escaping of commas and colons with backslashes (for properties and values)",
        input: { windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa/foo\\:foo+bar\\,bbb/bar:bar+foo,ccc/foo:foo+bar\\,ddd/bar\\:bar+foo" },
        expectedConfig: {
            aaa: { "foo:foo bar,bbb": { bar: "bar foo" } },
            ccc: { foo: "foo bar,ddd/bar:bar foo" }
        }
    }].forEach(function (oFixture) {
        QUnit.test("getConfigFromWindowLocation when " + oFixture.testDescription, function (assert) {
            var oWindowLocationMock;
            var oActualConfig;

            // Arrange
            oWindowLocationMock = {
                search: oFixture.input.windowLocationSearch
            };

            // Act
            oActualConfig = oReadConfigFromUrl._getConfigFromWindowLocation(oWindowLocationMock);

            // Assert
            assert.deepEqual(oActualConfig, oFixture.expectedConfig, "returned config");
        });
    });

    [{
        testDescription: "no entries in BlockList",
        input: {
            oEntry: {
                namespace: "a/b/c",
                propertyName: "foo",
                value: 123
            },
            oBlockList: {}
        },
        expected: false
    }, {
        testDescription: "different entry in BlockList",
        input: {
            oEntry: {
                namespace: "a/b/c",
                propertyName: "foo",
                value: 123
            },
            oBlockList: { "x/y/z": A_BLOCKED }
        },
        expected: false
    }, {
        testDescription: "entire entry is blocked",
        input: {
            oEntry: {
                namespace: "a/b/c",
                propertyName: "foo",
                value: 123
            },
            oBlockList: { "a/b/c/foo": A_BLOCKED }
        },
        expected: true
    }, {
        testDescription: "concrete entry value is blocked",
        input: {
            oEntry: {
                namespace: "a/b/c",
                propertyName: "foo",
                value: 123
            },
            oBlockList: {
                "a/b/c/foo": [789, 123]
            }
        },
        expected: true
    }, {
        testDescription: "specified value is not blocked",
        input: {
            oEntry: {
                namespace: "a/b/c",
                propertyName: "foo",
                value: "notblocked"
            },
            oBlockList: { "a/b/c/foo": ["bar", "abc"] }
        },
        expected: false
    }].forEach(function (oFixture) {
        QUnit.test("_isBlockListed when " + oFixture.testDescription, function (assert) {
            // Act
            var bResult = oReadConfigFromUrl._isBlockListed(
                oFixture.input.oBlockList,
                oFixture.input.oEntry
            );

            // Assert
            assert.strictEqual(bResult, oFixture.expected, "isBlockListed");
        });
    });
});
