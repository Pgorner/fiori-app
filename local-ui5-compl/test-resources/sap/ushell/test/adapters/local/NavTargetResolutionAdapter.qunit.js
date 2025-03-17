// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap/ushell/bootstrap/sandbox.js
 * @deprecated As of version 1.120
 */
sap.ui.define([
    "sap/base/util/deepExtend",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/adapters/local/NavTargetResolutionAdapter",
    "sap/ushell/Container",
    "sap/ushell/test/utils",
    "sap/ushell/utils"
], function (
    deepExtend,
    jQuery,
    NavTargetResolutionAdapter,
    Container,
    testUtils,
    utils
) {
    "use strict";

    /* global QUnit, sinon */

    var oNavTargetResolutionAdapterConfig = {
        config: {
            applications: {
                "Foo-bar": {
                    _comment: "Commenting the world famous foobar application!",
                    additionalInformation: "SAPUI5.Component=sap.foo.bar.FooBarApplication",
                    applicationType: "URL",
                    url: "/foo/bar/application",
                    description: "The world famous foobar application!",
                    text: "Foo-bar title",
                    fullWidth: true,
                    navigationMode: "embedded"
                },
                "Foo-bar2": {
                    _comment: "Commenting why the sequel is better than the original.",
                    additionalInformation: "SAPUI5.Component=sap.foo.bar.FooBar2Application",
                    applicationType: "URL",
                    url: "/foo/bar2/application",
                    description: "Second edition of the world famous foobar application!",
                    text: "Foo-bar2 title",
                    fullWidth: true,
                    navigationMode: "embedded"
                }
            }
        }
    };

    /*
     * Create clone object
     */
    function createClone (oObjectToClone) {
        return deepExtend({}, oObjectToClone);
    }

    QUnit.module("sap.ushell.adapters.local.NavTargetResolutionAdapter - config tests", {
        beforeEach: function (assert) {
            var done = assert.async();
            Container.init("local").then(done);
        }
    });

    [{
        configDescription: "undefined",
        config: undefined
    }, {
        configDescription: "[]",
        config: []
    }].forEach(function (oFixture) {
        QUnit.test("part 1: config = " + oFixture.configDescription, function (assert) {
            var done = assert.async();
            // Purpose: Test if odd configurations will lead to some error.
            // As the constructor is empty we use both methods to test for those errors.
            var oService;
            oService = new NavTargetResolutionAdapter(undefined, undefined, /*config = */oFixture.config);
            oService.resolveHashFragment("#Foo-bar")
                .fail(function () {
                    assert.ok(true, "resolveHashFragment threw no exception");
                    done();
                });
        });

        QUnit.test("part 2: config = " + oFixture.configDescription, function (assert) {
            var done = assert.async();
            // Purpose: Test if odd configurations will lead to some error.
            // As the constructor is empty we use both methods to test for those errors.
            var oService;
            oService = new NavTargetResolutionAdapter(undefined, undefined, /*config = */oFixture.config);
            oService.getSemanticObjectLinks("Foo")
                .done(function (aSemanticObjectLinks) {
                    assert.ok(aSemanticObjectLinks.length === 0, "getSemanticObjectLinks returned an empty array");
                    done();
                });
        });
    });

    QUnit.module("sap.ushell.adapters.local.NavTargetResolutionAdapter", {
        beforeEach: function (assert) {
            var done = assert.async();
            this.oService = new NavTargetResolutionAdapter(undefined, undefined, createClone(oNavTargetResolutionAdapterConfig));
            Container.init("local").then(done);
        },
        afterEach: function () {
            this.oService = undefined;
        }
    });

    QUnit.test("resolveHashFragment: invalid hash", function (assert) {
        assert.throws(this.oService.resolveHashFragment.bind(undefined, "invalid-hash"),
            utils.Error("Hash fragment expected",
                "sap.ushell.renderers.minimal.Shell"), "expected exception was thrown");
    });

    [{
        sIntent: "#Foo-bar",
        expectedResult: {
            url: oNavTargetResolutionAdapterConfig.config.applications["Foo-bar"].url,
            applicationType: oNavTargetResolutionAdapterConfig.config.applications["Foo-bar"].applicationType,
            additionalInformation: oNavTargetResolutionAdapterConfig.config.applications["Foo-bar"].additionalInformation,
            text: oNavTargetResolutionAdapterConfig.config.applications["Foo-bar"].text,
            fullWidth: oNavTargetResolutionAdapterConfig.config.applications["Foo-bar"].fullWidth,
            navigationMode: oNavTargetResolutionAdapterConfig.config.applications["Foo-bar"].navigationMode
        }
    }, {
        sIntent: "#Action-search",
        expectedResult: {
            additionalInformation: "SAPUI5.Component=sap.ushell.renderer.search.searchComponent",
            applicationType: "SAPUI5",
            fullWidth: undefined,
            text: undefined,
            url: "resources/sap/ushell/renderer/search/searchComponent",
            navigationMode: "embedded"
        }
    }, {
        sIntent: "#Action-search?p1=A&p2=B",
        expectedResult: {
            additionalInformation: "SAPUI5.Component=sap.ushell.renderer.search.searchComponent",
            applicationType: "SAPUI5",
            fullWidth: undefined,
            text: undefined,
            url: "resources/sap/ushell/renderer/search/searchComponent?p1=A&p2=B",
            navigationMode: "embedded"
        }
    }, {
        sIntent: "#Action-search?p1=A&p2=B&/My/Inner/App/Route",
        expectedResult: {
            additionalInformation: "SAPUI5.Component=sap.ushell.renderer.search.searchComponent",
            applicationType: "SAPUI5",
            fullWidth: undefined,
            text: undefined,
            url: "resources/sap/ushell/renderer/search/searchComponent?p1=A&p2=B",
            navigationMode: "embedded"
        }
    }, {
        sIntent: "#Action-search&/My/Inner/App/Route",
        expectedResult: {
            additionalInformation: "SAPUI5.Component=sap.ushell.renderer.search.searchComponent",
            applicationType: "SAPUI5",
            fullWidth: undefined,
            text: undefined,
            url: "resources/sap/ushell/renderer/search/searchComponent",
            navigationMode: "embedded"
        }
    }].forEach(function (oFixture) {
        QUnit.test("resolveHashFragment: resolves '" + oFixture.sIntent + "'", function (assert) {
            var done = assert.async();
            this.oService.resolveHashFragment(oFixture.sIntent)
                .done(function (oResult) {
                    assert.deepEqual(oResult, oFixture.expectedResult, "resolved to the expected result");
                    done();
                })
                .fail(function (oResult) {
                    assert.ok(false, "failed to resolve");
                    done();
                });
        });
    });

    QUnit.test("resolveHashFragment: resolve '#'", function (assert) {
        var done = assert.async();

        this.oService.resolveHashFragment("#")
            .done(function (oResult) {
                assert.deepEqual(oResult, undefined, "'#' correctly resolved");
                done();
            })
            .fail(function (oResult) {
                assert.ok(false, "failed to resolve");
                done();
            });
    });

    QUnit.test("resolveHashFragment: resolve '#unknown-hash'", function (assert) {
        var done = assert.async();
        this.oService.resolveHashFragment("#unknown-hash")
            .done(function (oResult) {
                assert.ok(false, "should not be able to resolve");
            })
            .fail(function (oResult) {
                assert.equal(oResult, "Could not resolve link 'unknown-hash'", "resolve rejected as expected");
            })
            .always(function () {
                done();
            });
    });

    QUnit.test("resolveHashFragment: resolve with parameter '#Foo-bar?param1=value1&param2=value2'", function (assert) {
        var done = assert.async();
        var oClone = createClone(oNavTargetResolutionAdapterConfig).config.applications["Foo-bar"],
            oExpected = {
                additionalInformation: oClone.additionalInformation,
                url: oClone.url + "?param1=value1&param2=value2",
                applicationType: oClone.applicationType,
                text: oClone.text,
                fullWidth: oClone.fullWidth,
                navigationMode: oClone.navigationMode
            };
        this.oService.resolveHashFragment("#Foo-bar?param1=value1&param2=value2")
            .done(function (oResult) {
                assert.deepEqual(oResult, oExpected, "correctly resolved and parameter treated as expected");
            })
            .fail(function (oResult) {
                assert.ok(false, "should not be able to resolve");
            })
            .always(function () {
                done();
            });
    });

    [
        "",
        "Foo",
        "Muh"
    ].forEach(function (sFixture) {
        QUnit.test("getSemanticObjectLinks: resolves '" + sFixture + "'", function (assert) {
            var done = assert.async();
            var sSemanticObject,
                oApplications,
                oExpectedLink,
                aExpectedLinks,
                sIntent;
            // Arrange
            sSemanticObject = sFixture;
            aExpectedLinks = [];
            oApplications = oNavTargetResolutionAdapterConfig.config.applications;
            for (sIntent in oApplications) {
                if (oApplications.hasOwnProperty(sIntent) && sIntent.substring(0, sIntent.indexOf("-")) === sSemanticObject) {
                    oExpectedLink = createClone(oApplications[sIntent]);
                    oExpectedLink.id = sIntent;
                    oExpectedLink.intent = "#" + sIntent;
                    aExpectedLinks.push(oExpectedLink);
                }
            }
            // Act
            this.oService.getSemanticObjectLinks(sSemanticObject)
                .done(function (aResult) {
                    // Assert
                    assert.deepEqual(aResult, aExpectedLinks, "Resolves the semantic object to the expected array");
                })
                .fail(function (sError) {
                    // Assert
                    assert.ok(false, "Resolves the semantic object");
                })
                .always(function () {
                    done();
                });
        });
    });

    [
        { description: "empty", So: "Foo", params: { A: ["B1", "B2"] }, result: [{ intent: "#Foo-bar?A=B1&A=B2" }] }
    ].forEach(function (oFixture) {
        QUnit.test("getSemanticObjectLinks: resolves '" + oFixture.description + "' with parameters", function (assert) {
            var done = assert.async();
            var sSemanticObject;

            // Arrange
            sSemanticObject = oFixture.So;

            // Act
            this.oService.getSemanticObjectLinks(sSemanticObject, oFixture.params)
                .done(function (aResult) {
                    // Assert
                    assert.deepEqual(aResult[0].intent, oFixture.result[0].intent, "intent is proper");
                })
                .fail(function (sError) {
                    // Assert
                    assert.ok(false, "Resolves the semantic object");
                })
                .always(function () {
                    done();
                });
        });
    });

    QUnit.test("isIntentSupported: success", function (assert) {
        var done = assert.async();

        var oAdapter,
            aDeferreds = [],
            mExpectedResult = {},
            aIntents = ["#fo'o-b ar", "#AccessControlRole", "#foo", "#bar"],
            bResolved = false;

        oAdapter = new NavTargetResolutionAdapter();
        sinon.stub(oAdapter, "resolveHashFragment").callsFake(function (sHashFragment) {
            var oDeferred = new jQuery.Deferred();
            aDeferreds.push(oDeferred);
            return oDeferred.promise();
        });

        // code under test
        oAdapter.isIntentSupported(aIntents).fail(testUtils.onError)
            .done(function (mSupportedByIntent) {
                bResolved = true;
                assert.deepEqual(mSupportedByIntent, mExpectedResult, " expected result");
                assert.deepEqual(Object.keys(mSupportedByIntent), aIntents, "keys ok");
                done();
            });

        assert.strictEqual(oAdapter.resolveHashFragment.callCount, aIntents.length);
        aIntents.forEach(function (sIntent, i) {
            var bSupported = (i % 2) === 1;

            assert.ok(oAdapter.resolveHashFragment.calledWith(sIntent), "resolved: " + sIntent);
            mExpectedResult[sIntent] = { supported: bSupported };
            if (bSupported) {
                aDeferreds[i].resolve({/*don't care*/ });
            } else {
                aDeferreds[i].reject("don't care");
            }
        });

        assert.strictEqual(bResolved, true, "isIntentSupported's promise now resolved");
    });

    QUnit.test("isIntentSupported: when resolveHashFragment promises are not resolved", function (assert) {
        var oAdapter,
            mExpectedResult = {},
            aDeferreds = [],
            aIntents = ["#fo'o-b ar", "#AccessControlRole", "#foo", "#bar"],
            bResolved = false;

        oAdapter = new NavTargetResolutionAdapter();
        sinon.stub(oAdapter, "resolveHashFragment").callsFake(function (sHashFragment) {
            var oDeferred = new jQuery.Deferred();
            aDeferreds.push(oDeferred);
            return oDeferred.promise();
        });
        // code under test
        oAdapter.isIntentSupported(aIntents).fail(testUtils.onError)
            .done(function (mSupportedByIntent) {
                bResolved = true;
                assert.deepEqual(mSupportedByIntent, mExpectedResult, "Expected result");
                assert.deepEqual(Object.keys(mSupportedByIntent), aIntents, "keys and intents");
            });
        assert.strictEqual(oAdapter.resolveHashFragment.callCount, aIntents.length, "call count ok");
        aIntents.forEach(function (sIntent, i) {
            assert.ok(oAdapter.resolveHashFragment.calledWith(sIntent), "resolved: " + sIntent);
        });
        assert.strictEqual(bResolved, false, "isIntentSupported's promise will not get resolved");

        aIntents.forEach(function (sIntent, i) {
            var bSupported = (i % 2) === 1;

            assert.ok(oAdapter.resolveHashFragment.calledWith(sIntent), "resolved: " + sIntent);
            mExpectedResult[sIntent] = { supported: bSupported };
            if (bSupported) {
                aDeferreds[i].resolve({/*don't care*/ });
            } else {
                aDeferreds[i].reject("don't care");
            }
        });
        assert.strictEqual(bResolved, true, "isIntentSupported's promise got resolved");
    });

    QUnit.test("isIntentSupported: failure", function (assert) {
        var done = assert.async();

        var oAdapter,
            aIntents = ["#foo", "#bar"];

        oAdapter = new NavTargetResolutionAdapter();
        sinon.stub(oAdapter, "resolveHashFragment").callsFake(function (sHashFragment) {
            return (new jQuery.Deferred()).reject().promise();
        });

        // code under test
        oAdapter.isIntentSupported(aIntents).done(function (oRes) {
            assert.deepEqual(oRes, { "#foo": { supported: false }, "#bar": { supported: false } }, " ok");
            done();
        });
    });

    QUnit.test("isIntentSupported: single intent", function (assert) {
        var oAdapter,
            oDeferred = new jQuery.Deferred(),
            mExpectedResult = {},
            sIntent = "#foo",
            bResolved = false;

        oAdapter = new NavTargetResolutionAdapter();
        sinon.stub(oAdapter, "resolveHashFragment").callsFake(function (sHashFragment) {
            return oDeferred.promise();
        });

        // code under test
        oAdapter.isIntentSupported([sIntent]).fail(testUtils.onError)
            .done(function (mSupportedByIntent) {
                bResolved = true;
                assert.deepEqual(Object.keys(mSupportedByIntent), [sIntent]);
                assert.deepEqual(mSupportedByIntent, mExpectedResult);
            });

        assert.strictEqual(bResolved, false, "isIntentSupported's promise not yet resolved");
        assert.strictEqual(oAdapter.resolveHashFragment.callCount, 1);
        assert.ok(oAdapter.resolveHashFragment.calledWith(sIntent), "resolved: " + sIntent);
        mExpectedResult[sIntent] = { supported: true };
        oDeferred.resolve({/*don't care*/ });
        assert.strictEqual(bResolved, true, "isIntentSupported's promise now resolved");
    });

    QUnit.test("isIntentSupported: zero intents ([])", function (assert) {
        var done = assert.async();
        var oAdapter = new NavTargetResolutionAdapter();

        sinon.stub(oAdapter, "resolveHashFragment").callsFake(testUtils.onError);

        // code under test
        oAdapter.isIntentSupported([]).fail(testUtils.onError)
            .done(function (mSupportedByIntent) {
                assert.deepEqual(mSupportedByIntent, {});
                done();
            });
    });
});
