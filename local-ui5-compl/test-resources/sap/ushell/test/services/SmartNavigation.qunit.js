// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.SmartNavigation service.
 *
 * @deprecated since 1.119
 */
sap.ui.define([
    "sap/ushell/services/SmartNavigation",
    "sap/ushell/utils/UrlParsing",
    "sap/ushell/services/AppConfiguration",
    "sap/base/util/ObjectPath",
    "sap/ui/thirdparty/jquery",
    "sap/base/Log",
    "sap/ushell/Container"
], function (SmartNavigation, UrlParsing, AppConfiguration, ObjectPath, jQuery, Log, Container) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    QUnit.module("SmartNavigation with tracking", {
        beforeEach: function () {
            var sCurrentAppHash = "Action-totest" + Date.now();

            this.oToExternalStub = sandbox.stub();
            this.oToExternalStub.returns(new jQuery.Deferred().resolve().promise());

            this.aLinks = [
                { intent: "#SomeSemanticObject-doSomething", text: "Some Sample Intent" },
                { intent: "#SomeSemanticObject2-doSomething", text: "Some Sample Intent 2" },
                { intent: "#SomeSemanticObject-doSomething1", text: "Some Sample Intent 3" }
            ];

            this.oGetLinksStub = sandbox.stub().returns(new jQuery.Deferred().resolve(this.aLinks).promise());
            this.oHrefForExternalStub = sandbox.stub();
            var oCrossApplicationNavigationService = {
                getLinks: this.oGetLinksStub,
                toExternal: this.oToExternalStub,
                hrefForExternal: this.oHrefForExternalStub
            };

            var oContainer = {};
            var oPersonalizationContainer = {
                save: sandbox.stub().returns(new jQuery.Deferred().resolve().promise()),
                getItemKeys: function () {
                    return Object.keys(oContainer);
                },
                getItemValue: function (sKey) {
                    return oContainer[sKey];
                },
                setItemValue: function (sKey, vValue) {
                    oContainer[sKey] = vValue;
                }
            };
            this.oPersonalizationGetContainerStub = sandbox.stub().returns(new jQuery.Deferred().resolve(oPersonalizationContainer).promise());
            var oPersonalizationService = {
                getContainer: this.oPersonalizationGetContainerStub
            };

            ObjectPath.set("constants.keyCategory.FIXED_KEY", "FIXED_KEY", oPersonalizationService);
            ObjectPath.set("constants.writeFrequency.HIGH", "HIGH", oPersonalizationService);

            this.oGetCurrentApplicationStub = sandbox.stub(AppConfiguration, "getCurrentApplication").returns({
                sShellHash: sCurrentAppHash,
                componentHandle: {
                    getInstance: function () {
                        return {};
                    }
                }
            });

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            this.oGetServiceStub = sandbox.stub(Container, "getService");

            this.oCrossAppNavigationServicePromise = Promise.resolve(oCrossApplicationNavigationService);
            this.oGetServiceAsyncStub.withArgs("CrossApplicationNavigation").resolves(this.oCrossAppNavigationServicePromise);
            this.oGetServiceStub.withArgs("CrossApplicationNavigation").returns(oCrossApplicationNavigationService);
            this.oGetServiceAsyncStub.withArgs("Personalization").resolves(oPersonalizationService);

            this.oErrorStub = sandbox.stub(Log, "error");
            this.oWarningStub = sandbox.stub(Log, "warning");

            this.oSmartNavigation = new SmartNavigation(null, null, {
                config: {
                    isTrackingEnabled: true
                }
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("The function getLinks without query", function (assert) {
        // Act
        return this.oSmartNavigation.getLinks(null)
            // Assert
            .done(function (oActualLinks) {
                var aExpectedLinks = [
                    { intent: "#SomeSemanticObject-doSomething", text: "Some Sample Intent" },
                    { intent: "#SomeSemanticObject2-doSomething", text: "Some Sample Intent 2" },
                    { intent: "#SomeSemanticObject-doSomething1", text: "Some Sample Intent 3" }
                ];

                assert.deepEqual(oActualLinks, aExpectedLinks, "When called without a query argument and given that no tracking has ever occurred, " +
                    "returns same items as CrossApplicationNavigation#getLinks() and in same order");
                assert.strictEqual(this.oGetLinksStub.callCount, 1, "The function getLinks of CrossApplicationNavigation has been called once.");
                assert.deepEqual(this.oGetLinksStub.firstCall.args, [null], "The function getLinks of CrossApplicationNavigation has been called with the correct arguments.");
            }.bind(this));
    });

    QUnit.test("The function getLinks with a semantic action in the query", function (assert) {
        var oArguments = { semanticObject: "Action" };

        // Act
        return this.oSmartNavigation.getLinks(oArguments)
            .done(function (oActualLinks) {
                // Assert
                var aExpectedLinks = [
                    { intent: "#SomeSemanticObject-doSomething", text: "Some Sample Intent" },
                    { intent: "#SomeSemanticObject2-doSomething", text: "Some Sample Intent 2" },
                    { intent: "#SomeSemanticObject-doSomething1", text: "Some Sample Intent 3" }
                ];

                assert.deepEqual(oActualLinks, aExpectedLinks, "When called with an oQuery argument and given that no tracking has ever occurred, " +
                    "returns same items as CrossApplicationNavigation#getLinks(oQuery) and in same order");
                assert.strictEqual(this.oGetLinksStub.callCount, 1, "The function getLinks of CrossApplicationNavigation has been called once.");
                assert.deepEqual(this.oGetLinksStub.firstCall.args, [oArguments], "The function getLinks of CrossApplicationNavigation has been called with the correct arguments.");
            }.bind(this));
    });

    QUnit.test("The function toExternal", function (assert) {
        sandbox.stub(this.oSmartNavigation, "_recordNavigationOccurrences").returns(new jQuery.Deferred().resolve());
        var oArguments = {
            target: { shellHash: "#Action-toappcontextsample" }
        };

        // Act
        this.oSmartNavigation.toExternal(oArguments);

        return this.oCrossAppNavigationServicePromise
            // Assert
            .then(function () {
                assert.strictEqual(this.oToExternalStub.callCount, 1, "Call to toExternal() eventually calls CrossApplicationNavigation#toExternal()");
                assert.deepEqual(this.oToExternalStub.firstCall.args, [oArguments], "The function toExternal of CrossApplicationNavigation has been called with the correct arguments.");
            }.bind(this));
    });

    QUnit.test("#toExternal() - Shell hash is not a valid intent", function (assert) {
        this.oSmartNavigation.toExternal({ target: { shellHash: "www.foo.bar" } });

        return this.oCrossAppNavigationServicePromise
            .then(function () {
                assert.strictEqual(this.oWarningStub.callCount, 1, "Logged the warning out as shell hash is not set correctly");
                assert.strictEqual(this.oToExternalStub.callCount, 1, "Still called the CrossAppNav service to handle the error");
            }.bind(this));
    });

    QUnit.test("#toExternal() - Semantic Object only is not a valid intent", function (assert) {
        this.oSmartNavigation.toExternal({ target: { semanticObject: "foo" } });

        return this.oCrossAppNavigationServicePromise
            .then(function () {
                assert.strictEqual(this.oWarningStub.callCount, 1, "Logged the warning out as semantic object only is not set correctly");
                assert.strictEqual(this.oToExternalStub.callCount, 1, "Still called the CrossAppNav service to handle the error");
            }.bind(this));
    });

    QUnit.test("#hrefForExternal()", function (assert) {
        var oArguments = {
            target: {
                shellHash: "#Action-toappcontextsample"
            }
        };
        var sDeprecationMessage = "Deprecated API call of 'sap.ushell.services.SmartNavigation.hrefForExternal'. Please use 'hrefForExternalAsync' instead.";
        var sModule = "sap.ushell.services.SmartNavigation";

        this.oSmartNavigation.hrefForExternal(oArguments);

        assert.strictEqual(this.oHrefForExternalStub.callCount, 1, "The function hrefForExternal has been called once.");
        assert.strictEqual(this.oHrefForExternalStub.firstCall.args[0], oArguments, "The function hrefForExternal has been called with the correct parameters.");
        assert.deepEqual(this.oErrorStub.withArgs(sDeprecationMessage, null, sModule).callCount, 1, "The deprecation error was logged.");
    });

    [{
        testDescription: "destinationShellHash is valid",
        oTarget: { shellHash: "Action-nosysNonwrappedTR" }
    }, {
        testDescription: "destinationShellHash with parameters is valid",
        oTarget: { shellHash: "Action-nosysNonwrappedTR?foo=bar" }
    }, {
        testDescription: "Destination is just a string",
        oTarget: "SomeString",
        expectedErrorMessage: "Navigation not tracked - no valid destination provided"
    }, {
        testDescription: "destinationShellHash is not a valid intent",
        oTarget: { shellHash: "www.google.com" },
        expectedErrorMessage: "Navigation not tracked - no valid destination provided"
    }, {
        testDescription: "there is no destinationShellHash",
        oTarget: undefined,
        expectedErrorMessage: "Navigation not tracked - no valid destination provided"
    }, {
        testDescription: "no shellHash and only SemanticObject provided",
        oTarget: { semanticObject: "notOk" },
        expectedErrorMessage: "Navigation not tracked - no valid destination provided"
    }, {
        testDescription: "no shellHash and only Action provided",
        oTarget: { action: "notOk" },
        expectedErrorMessage: "Navigation not tracked - no valid destination provided"
    }].forEach(function (oFixture) {
        QUnit.test("#trackNavigation() : when " + oFixture.testDescription, function (assert) {
            sandbox.stub(this.oSmartNavigation, "_recordNavigationOccurrences").returns(new jQuery.Deferred().resolve().promise());

            // Act
            return this.oSmartNavigation.trackNavigation({ target: oFixture.oTarget })
                .done(function () {
                    // Assert
                    if (oFixture.expectedErrorMessage) {
                        assert.strictEqual(this.oWarningStub.callCount, 1, "Log.warning was called 1 time");

                        var aExpectedArguments = [
                            oFixture.expectedErrorMessage,
                            null,
                            "sap.ushell.services.SmartNavigation"
                        ];
                        assert.deepEqual(this.oWarningStub.getCall(0).args, aExpectedArguments, "Log.warning was called with the expected arguments");
                    } else {
                        assert.strictEqual(this.oWarningStub.callCount, 0, "Success");
                    }
                }.bind(this));
        });
    });

    QUnit.test("The dependency of #getLinks() & #toExternal() on AppConfiguration#getCurrentApplication()#.sShellHash", function (assert) {
        var done = assert.async();

        // Arrange
        this.oGetCurrentApplicationStub.returns({
            componentHandle: {
                getInstance: function () {
                    return {};
                }
            }
        });

        // Act
        this.oSmartNavigation.toExternal({
            target: {
                semanticObject: "ShellHash",
                action: "test"
            }
        });

        this.oCrossAppNavigationServicePromise
            .then(function () {
                this.oSmartNavigation.getLinks()
                    .done(function (aSmartLinks) {
                        // Assert
                        assert.deepEqual(aSmartLinks, this.aLinks, "When AppConfiguration#getCurrentApplication()#sShellHash"
                            + " is undefined, oSmartNavigation#getLinks() behaves"
                            + " exactly the same as oCrossAppNav#getLinks()");

                        assert.ok(this.oWarningStub.calledTwice, "Each time sShellHash is required but it's undefined, a warning is logged");
                        done();
                    }.bind(this))
                    .fail(function () {
                        assert.notOk(true, "The promise should have been resolved.");
                        done();
                    });
            }.bind(this))
            .catch(function () {
                assert.notOk(true, "The promise should have been resolved.");
                done();
            });
    });

    QUnit.test("The dependency of #getLinks() & #toExternal() on `AppConfiguration().#getCurrentApplication().#componentHandle`", function (assert) {
        var done = assert.async();

        // Arrange
        this.oGetCurrentApplicationStub.returns({
            componentHandle: null
        });

        // Act
        this.oSmartNavigation.toExternal({
            target: {
                semanticObject: "ShellHash",
                action: "test"
            }
        });

        this.oCrossAppNavigationServicePromise
            .then(function () {
                this.oSmartNavigation.getLinks()
                    .done(function () {
                        // Assert
                        assert.ok(true, "All promises have been resolved.");
                        done();
                    })
                    .fail(function () {
                        assert.notOk(true, "The promise should have been resolved.");
                        done();
                    });
            }.bind(this))
            .catch(function () {
                assert.notOk(true, "The promise should have been resolved.");
                done();
            });
    });

    QUnit.test("Links are sorted based on the clickCount of navigation via SmartNavigation#toExternal() to their respective app", function (assert) {
        var done = assert.async();

        var aDestinationTargets = [
            { intent: "#SomeSemanticObject-doSomething", clickCount: 10 },
            { intent: "#SomeSemanticObject-doSomething1", clickCount: 10 },
            { intent: "#SomeSemanticObject2-doSomething?someParam=2/innerAppRoute", clickCount: 1 },
            { intent: "#SomeSemanticObject-doSomething1?someOtherParam=69", clickCount: 2 },
            { intent: "#SomeSemanticObject2-doSomething", clickCount: 10 }
        ];

        var aExpectedOrderOfDestinationTargets = [
            { clickCount: 12, intent: "#SomeSemanticObject-doSomething1", text: "Some Sample Intent 3" },
            { clickCount: 11, intent: "#SomeSemanticObject2-doSomething", text: "Some Sample Intent 2" },
            { clickCount: 10, intent: "#SomeSemanticObject-doSomething", text: "Some Sample Intent" }
        ];

        // Simulate navigation to the destinations defined above by executing toExternal n times.
        // The amount of navigations to a destination is defined by the clickCount property.
        var oNavigationsComplete = aDestinationTargets
            .reduce(function (oAggregateCompletion, oDestinationTarget) {
                var oArg = {
                    target: { shellHash: oDestinationTarget.intent }
                };
                var iClickCount = oDestinationTarget.clickCount;

                while (iClickCount--) {
                    oAggregateCompletion = oAggregateCompletion
                        .then(this.oSmartNavigation.toExternal.bind(this.oSmartNavigation, oArg));
                }

                return oAggregateCompletion;
            }.bind(this), jQuery.when(null));

        oNavigationsComplete
            .done(function () {
                this.oSmartNavigation.getLinks({ semanticObject: "SO" })
                    .done(function (aLinks) {
                        assert.deepEqual(aLinks, aExpectedOrderOfDestinationTargets, "The correct links have been returned.");
                        done();
                    })
                    .fail(function () {
                        assert.notOk(true, "The promise should have been resolved.");
                        done();
                    });
            }.bind(this))
            .fail(function () {
                assert.notOk(true, "The promise should have been resolved.");
                done();
            });
    });

    QUnit.module("SmartNavigation without tracking", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oToExternalStub = sandbox.stub();
            this.oToExternalStub.returns(new jQuery.Deferred().resolve().promise());

            this.aLinks = [
                { intent: "#SomeSemanticObject-doSomething", text: "Some Sample Intent" },
                { intent: "#SomeSemanticObject2-doSomething", text: "Some Sample Intent 2" },
                { intent: "#SomeSemanticObject-doSomething1", text: "Some Sample Intent 3" }
            ];
            this.oGetLinksStub = sandbox.stub().returns(new jQuery.Deferred().resolve(this.aLinks).promise());
            this.oHrefForExternalStub = sandbox.stub().returns(new jQuery.Deferred().resolve().promise());
            var oCrossApplicationNavigationService = {
                getLinks: this.oGetLinksStub,
                toExternal: this.oToExternalStub,
                hrefForExternal: this.oHrefForExternalStub
            };

            this.oCrossAppNavigationServicePromise = Promise.resolve(oCrossApplicationNavigationService);
            this.oGetServiceAsyncStub.withArgs("CrossApplicationNavigation").returns(this.oCrossAppNavigationServicePromise);

            this.oPersonalizationGetContainerStub = sandbox.stub();

            var oPersonalizationService = {
                getContainer: this.oPersonalizationGetContainerStub
            };
            this.oGetServiceAsyncStub.withArgs("Personalization").resolves(oPersonalizationService);

            this.oGetServiceStub = sandbox.stub(Container, "getService");

            this.oSmartNavigation = new SmartNavigation(null, null, {
                config: {
                    isTrackingEnabled: false
                }
            });
        },

        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("GetLinks should not load data from Personalizer", function (assert) {
        // Act
        return this.oSmartNavigation.getLinks({ semanticObject: "foo" })
            .done(function () {
                // Assert
                assert.equal(this.oPersonalizationGetContainerStub.callCount, 0, "The function getContainer of Personalization service has not been called.");
            }.bind(this));
    });

    QUnit.test("toExternal", function (assert) {
        // Arrange
        var oArguments = { semanticObject: "foo", action: "bar" };

        // Act
        this.oSmartNavigation.toExternal(oArguments);

        return this.oCrossAppNavigationServicePromise
            .then(function () {
                // Assert
                assert.strictEqual(this.oPersonalizationGetContainerStub.callCount, 0, "The function getContainer of Personalization service has not been called.");
                assert.strictEqual(this.oToExternalStub.callCount, 1, "CrossAppNavigation.toExternal called exactly once");
                assert.deepEqual(this.oToExternalStub.firstCall.args, [oArguments], "The function toExternal has been called with the correct arguments.");
            }.bind(this));
    });

    QUnit.test("trackNavigation should not write data to Personalizer", function (assert) {
        // Act
        return this.oSmartNavigation.trackNavigation({ semanticObject: "foo" })
            .done(function () {
                // Assert
                assert.equal(this.oPersonalizationGetContainerStub.callCount, 0, "The function getContainer of Personalization service has not been called.");
            }.bind(this));
    });

    QUnit.module("Private parts", {
        beforeEach: function () {
            this.aLinks = [
                { intent: "#SomeSemanticObject-doSomething", text: "Some Sample Intent" },
                { intent: "#SomeSemanticObject2-doSomething", text: "Some Sample Intent 2" },
                { intent: "#SomeSemanticObject-doSomething1", text: "Some Sample Intent 3" }
            ];

            this.oPersonalizationContainerData = {};
            var oPersonalizationContainer = {
                save: sandbox.stub().returns(new jQuery.Deferred().resolve().promise()),
                getItemKeys: function () {
                    return Object.keys(this.oPersonalizationContainerData);
                }.bind(this),
                getItemValue: function (sKey) {
                    return this.oPersonalizationContainerData[sKey];
                }.bind(this),
                setItemValue: function (sKey, vValue) {
                    this.oPersonalizationContainerData[sKey] = vValue;
                }.bind(this)
            };

            this.oPersonalizationGetContainerStub = sandbox.stub().returns(new jQuery.Deferred().resolve(oPersonalizationContainer).promise());
            var oPersonalizationService = {
                getContainer: this.oPersonalizationGetContainerStub
            };

            this.oGetCurrentApplicationStub = sandbox.stub(AppConfiguration, "getCurrentApplication").returns({
                sShellHash: "Action-totest" + Date.now(),
                componentHandle: {
                    getInstance: function () {
                        return {};
                    }
                }
            });

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            this.oGetServiceStub = sandbox.stub(Container, "getService");
            this.oGetServiceAsyncStub.withArgs("Personalization").resolves(oPersonalizationService);

            ObjectPath.set("constants.keyCategory.FIXED_KEY", "FIXED_KEY", oPersonalizationService);
            ObjectPath.set("constants.writeFrequency.HIGH", "HIGH", oPersonalizationService);

            this.oSmartNavigation = new SmartNavigation();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("The function _isTrackingEnabled returns false for the default configuration", function (assert) {
        var bResult = this.oSmartNavigation._isTrackingEnabled();

        assert.strictEqual(bResult, false, "The correct value has been found.");
    });

    QUnit.test("The function _isTrackingEnabled returns true if the configuration is set to true", function (assert) {
        var bResult = this.oSmartNavigation._isTrackingEnabled({ config: { isTrackingEnabled: true } });

        assert.strictEqual(bResult, true, "The correct value has been found.");
    });

    QUnit.test("The function _isTrackingEnabled returns false if isTrackingEnabled is not in the configuration", function (assert) {
        var bResult = this.oSmartNavigation._isTrackingEnabled({ foo: "bar" });

        assert.strictEqual(bResult, false, "The correct value has been found.");
    });

    QUnit.test("The function _getHashCode is deterministic", function (assert) {
        [
            "foo-bar",
            {},
            { foo: "bar" },
            new Date(),
            null,
            Number(498),
            String("foofoo"),
            undefined,
            54658
        ].forEach(function (value) {
            var sFirstResult = this.oSmartNavigation._getHashCode(value);
            var sSecondResult = this.oSmartNavigation._getHashCode(value);

            assert.strictEqual(sFirstResult, sSecondResult, "The correct value has been found.");
        }.bind(this));
    });

    QUnit.test("The function _getHashCode throws a TypeError if the given input cannot be coerced to a string", function (assert) {
        assert.throws(
            function () {
                var oObj = {};
                delete oObj.prototype.toString;

                this.oSmartNavigation._getHashCode(oObj);
            },
            TypeError,
            "Throws a TypeError error when given input cannot be coerced to a string"
        );
    });

    QUnit.test("The function _getHashCode returns different hash codes for inputs of the same length and composed of same characters but which are not equal", function (assert) {
        var sFirstResult = this.oSmartNavigation._getHashCode("foo-bar");
        var sSecondResult = this.oSmartNavigation._getHashCode("bar-foo");

        assert.notStrictEqual(sFirstResult, sSecondResult, "The found values are not equal.");
    });

    QUnit.test("The function _getBaseHashPart correctly parses the value #foo-bar", function (assert) {
        // Arrange
        var oParseShellHashSpy = sandbox.spy(UrlParsing, "parseShellHash");

        // Act
        var sResult = this.oSmartNavigation._getBaseHashPart("#foo-bar");

        // Assert
        assert.strictEqual(sResult, "foo-bar", "The correct value has been returned.");
        assert.strictEqual(oParseShellHashSpy.callCount, 1, "The function parseShellHash of URLParsing has been called once.");
        assert.deepEqual(oParseShellHashSpy.firstCall.args, ["#foo-bar"], "The function parseShellHash of URLParsing has been called with the correct arguments.");
    });

    QUnit.test("The function _getBaseHashPart correctly parses the value #foo-bar?", function (assert) {
        // Arrange
        var oParseShellHashSpy = sandbox.spy(UrlParsing, "parseShellHash");

        // Act
        var sResult = this.oSmartNavigation._getBaseHashPart("#foo-bar?");

        // Assert
        assert.strictEqual(sResult, "foo-bar", "The correct value has been returned.");
        assert.strictEqual(oParseShellHashSpy.callCount, 1, "The function parseShellHash of URLParsing has been called once.");
        assert.deepEqual(oParseShellHashSpy.firstCall.args, ["#foo-bar?"], "The function parseShellHash of URLParsing has been called with the correct arguments.");
    });

    QUnit.test("The function _getBaseHashPart correctly parses the value foo-bar", function (assert) {
        // Arrange
        var oParseShellHashSpy = sandbox.spy(UrlParsing, "parseShellHash");

        // Act
        var sResult = this.oSmartNavigation._getBaseHashPart("foo-bar");

        // Assert
        assert.strictEqual(sResult, "foo-bar", "The correct value has been returned.");
        assert.strictEqual(oParseShellHashSpy.callCount, 1, "The function parseShellHash of URLParsing has been called once.");
        assert.deepEqual(oParseShellHashSpy.firstCall.args, ["foo-bar"], "The function parseShellHash of URLParsing has been called with the correct arguments.");
    });

    QUnit.test("The function _getBaseHashPart correctly throws an error for the value foo", function (assert) {
        // Arrange
        var oParseShellHashSpy = sandbox.spy(UrlParsing, "parseShellHash");

        // Act
        // Assert
        assert.throws(function () {
            this.oSmartNavigation._getBaseHashPart("foo");
        }.bind(this), /Invalid intent/i, "Throws for invalid intent.");
        assert.strictEqual(oParseShellHashSpy.callCount, 1, "The function parseShellHash of URLParsing has been called once.");
        assert.deepEqual(oParseShellHashSpy.firstCall.args, ["foo"], "The function parseShellHash of URLParsing has been called with the correct arguments.");
    });

    QUnit.test("The function _getBaseHashPart correctly throws an error for the value #foo", function (assert) {
        // Arrange
        var oParseShellHashSpy = sandbox.spy(UrlParsing, "parseShellHash");

        // Act
        // Assert
        assert.throws(function () {
            this.oSmartNavigation._getBaseHashPart("#foo");
        }.bind(this), /Invalid intent/i, "Throws for invalid intent.");
        assert.strictEqual(oParseShellHashSpy.callCount, 1, "The function parseShellHash of URLParsing has been called once.");
        assert.deepEqual(oParseShellHashSpy.firstCall.args, ["#foo"], "The function parseShellHash of URLParsing has been called with the correct arguments.");
    });

    QUnit.test("The function _getBaseHashPart correctly throws an error for the value foo?", function (assert) {
        // Arrange
        var oParseShellHashSpy = sandbox.spy(UrlParsing, "parseShellHash");

        // Act
        // Assert
        assert.throws(function () {
            this.oSmartNavigation._getBaseHashPart("foo?");
        }.bind(this), /Invalid intent/i, "Throws for invalid intent.");
        assert.strictEqual(oParseShellHashSpy.callCount, 1, "The function parseShellHash of URLParsing has been called once.");
        assert.deepEqual(oParseShellHashSpy.firstCall.args, ["foo?"], "The function parseShellHash of URLParsing has been called with the correct arguments.");
    });

    QUnit.test("The function _getBaseHashPart correctly throws an error for the value foo-", function (assert) {
        // Arrange
        var oParseShellHashSpy = sandbox.spy(UrlParsing, "parseShellHash");

        // Act
        // Assert
        assert.throws(function () {
            this.oSmartNavigation._getBaseHashPart("foo-");
        }.bind(this), /Invalid intent/i, "Throws for invalid intent.");
        assert.strictEqual(oParseShellHashSpy.callCount, 1, "The function parseShellHash of URLParsing has been called once.");
        assert.deepEqual(oParseShellHashSpy.firstCall.args, ["foo-"], "The function parseShellHash of URLParsing has been called with the correct arguments.");
    });

    QUnit.test("The function _getBaseHashPart correctly throws an error for an empty string", function (assert) {
        // Arrange
        var oParseShellHashSpy = sandbox.spy(UrlParsing, "parseShellHash");

        // Act
        // Assert
        assert.throws(function () {
            this.oSmartNavigation._getBaseHashPart("");
        }.bind(this), /Invalid intent/i, "Throws for invalid intent.");
        assert.strictEqual(oParseShellHashSpy.callCount, 1, "The function parseShellHash of URLParsing has been called once.");
        assert.deepEqual(oParseShellHashSpy.firstCall.args, [""], "The function parseShellHash of URLParsing has been called with the correct arguments.");
    });

    QUnit.test("The function _getBaseHashPart correctly throws an error for null", function (assert) {
        // Arrange
        var oParseShellHashSpy = sandbox.spy(UrlParsing, "parseShellHash");

        // Act
        // Assert
        assert.throws(function () {
            this.oSmartNavigation._getBaseHashPart(null);
        }.bind(this), /Invalid intent/i, "Throws for invalid intent.");
        assert.strictEqual(oParseShellHashSpy.callCount, 1, "The function parseShellHash of URLParsing has been called once.");
        assert.deepEqual(oParseShellHashSpy.firstCall.args, [null], "The function parseShellHash of URLParsing has been called with the correct arguments.");
    });

    QUnit.test("The function _getHashFromOArg returns the correct value for shellHash foo-bar", function (assert) {
        // Arrange
        // Act
        var sResult = this.oSmartNavigation._getHashFromOArgs({
            shellHash: "foo-bar"
        });

        // Assert
        assert.strictEqual(sResult, "foo-bar", "Found the correct value.");
    });

    QUnit.test("The function _getHashFromOArg returns the correct value for semantic object and action foo-bar", function (assert) {
        // Arrange
        // Act
        var sResult = this.oSmartNavigation._getHashFromOArgs({
            action: "bar",
            semanticObject: "foo"
        });

        // Assert
        assert.strictEqual(sResult, "foo-bar", "Found the correct value.");
    });

    QUnit.test("The function _getHashFromOArg returns the correct value for shellHash foo", function (assert) {
        // Arrange
        // Act
        var sResult = this.oSmartNavigation._getHashFromOArgs({
            shellHash: "foo"
        });

        // Assert
        assert.strictEqual(sResult, null, "Found the correct value.");
    });

    QUnit.test("The function _getHashFromOArg returns the correct value for action bar", function (assert) {
        // Arrange
        // Act
        var sResult = this.oSmartNavigation._getHashFromOArgs({
            action: "bar"
        });

        // Assert
        assert.strictEqual(sResult, null, "Found the correct value.");
    });

    QUnit.test("The function _getHashFromOArg returns the correct value for semanticObject foo", function (assert) {
        // Arrange
        // Act
        var sResult = this.oSmartNavigation._getHashFromOArgs({
            semanticObject: "foo"
        });

        // Assert
        assert.strictEqual(sResult, null, "Found the correct value.");
    });

    QUnit.test("The function _getPersContainerKey", function (assert) {
        var sKey = this.oSmartNavigation._getPersContainerKey("foo-bar");

        assert.strictEqual(sKey.indexOf(SmartNavigation.PERS_CONTAINER_KEY_PREFIX), 0, "Container keys begin with `" + this.oSmartNavigation.PERS_CONTAINER_KEY_PREFIX + "`");
    });

    QUnit.test("The function _getNavigationOccurrences", function (assert) {
        this.oPersonalizationGetContainerStub.callsFake(function () {
            var iNow = Date.now();
            // Random times in the near past.
            var fiveSecondsAgo = iNow - 5000;
            var fortySecondsAgo = iNow - 40000;

            var oStorage = {
                foo: {
                    actions: {
                        bar: {
                            latestVisit: iNow,
                            dailyFrequency: [4, 2, 5, 0, 0, 2, 6]
                        },
                        rab: {
                            latestVisit: fortySecondsAgo,
                            dailyFrequency: [3, 56, 4]
                        }
                    },
                    latestVisit: iNow,
                    dailyFrequency: []
                },
                boo: {
                    actions: {
                        tar: {
                            latestVisit: fiveSecondsAgo,
                            dailyFrequency: [8, 3, 5]
                        }
                    },
                    latestVisit: fiveSecondsAgo,
                    dailyFrequency: []
                }
            };

            return jQuery.when({
                getItemKeys: function () {
                    return Object.keys(oStorage);
                },
                getItemValue: function (sKey) {
                    return oStorage[sKey];
                }
            });
        });

        var aExpectedNavOccurrences = [
            { intent: "foo-bar", clickCount: 19 },
            { intent: "foo-rab", clickCount: 63 },
            { intent: "boo-tar", clickCount: 16 }
        ];

        var oComponent = {};

        return this.oSmartNavigation._getNavigationOccurrences("nomatter-causestubbed", {}, oComponent)
            .done(function (aNavigationOccurrences) {
                assert.deepEqual(
                    aNavigationOccurrences,
                    aExpectedNavOccurrences,
                    "Reads and summarises navigation history/statistics"
                );
                assert.strictEqual(this.oPersonalizationGetContainerStub.callCount, 1, "Interacts with Personalization#getContainer");
            }.bind(this));
    });

    QUnit.test("The function _prepareLinksForSorting", function (assert) {
        var aLinks = [
            { intent: "foo-bar" },
            { intent: "fooz-barz" },
            { intent: "foox-barx" },
            { intent: "foov-barv" },
            { intent: "no-history" }
        ];
        var aNavigationOccurrences = [
            { intent: "foo-bar", clickCount: 5 },
            { intent: "fooz-barz", clickCount: 2 },
            { intent: "foox-barx", clickCount: 0 },
            { intent: "foov-barv", clickCount: 21 }
        ];

        this.oSmartNavigation._prepareLinksForSorting(aLinks, aNavigationOccurrences);

        assert.deepEqual(aLinks, [
            { intent: "foo-bar", clickCount: 5 },
            { intent: "fooz-barz", clickCount: 2 },
            { intent: "foox-barx", clickCount: 0 },
            { intent: "foov-barv", clickCount: 21 },
            { intent: "no-history", clickCount: 0 }
        ], "Inserts frequency of inward navigation for the past 30 days to each intent in the link list");
    });

    QUnit.test("The function _updateHistoryEntryWithCurrentUsage", function (assert) {
        var iNow = Date.now();
        var iOneDay = 24 * 60 * 60 * 1000;
        var iOneMonth = 28 * iOneDay;
        var iFiveDaysAgo = iNow - 5 * iOneDay;
        var iFourMonthsAgo = iNow - 4 * iOneMonth;

        [{
            input: {
                historyEntry: {
                    latestVisit: iNow,
                    dailyFrequency: [5, 2, 56, 0, 9]
                }
            },
            expected: {
                historyEntry: {
                    latestVisit: iNow,
                    dailyFrequency: [6, 2, 56, 0, 9]
                }
            },
            description: "Updates history entry accordingly when usage occurs same day"
        }, {
            input: {
                historyEntry: {
                    latestVisit: iFiveDaysAgo,
                    dailyFrequency: [5, 2, 56, 0, 9]
                }
            },
            expected: {
                historyEntry: {
                    latestVisit: iNow,
                    dailyFrequency: [1, 0, 0, 0, 0, 5, 2, 56, 0, 9]
                }
            },
            description: "Updates history entry accordingly when used after 5 days break"
        }, {
            input: {
                historyEntry: {
                    latestVisit: iFourMonthsAgo,
                    dailyFrequency: (function () {
                        // Emulates once-a-day usage for last 90 days.
                        var iIndex = 0;
                        var iCount = 90;
                        var aDailyUsageStat = [];

                        while (iIndex++ < iCount) {
                            aDailyUsageStat.push(1);
                        }

                        return aDailyUsageStat;
                    })()
                }
            },
            expected: {
                historyEntry: {
                    dailyFrequency: (function () {
                        // Emulates break of 4 * 28 days before next
                        // use.
                        var iIndex = 0;
                        var iCount = SmartNavigation.STATISTIC_COLLECTION_WINDOW_DAYS - 1;
                        var aDailyUsageStat = [1];

                        while (iIndex++ < iCount) {
                            aDailyUsageStat.push(0);
                        }

                        return aDailyUsageStat;
                    })()
                }
            },
            description: "Updates history entry accordingly when usage was once-a-day for hundred days, then a 4 * 28 days break before next use"
        }].forEach(function (oFixture) {
            this.oSmartNavigation._updateHistoryEntryWithCurrentUsage(oFixture.input.historyEntry);

            assert.deepEqual(oFixture.input.historyEntry.dailyFrequency, oFixture.expected.historyEntry.dailyFrequency, oFixture.description);
        }.bind(this));
    });

    QUnit.module("The function _recordNavigationOccurrences", {
        beforeEach: function () {
            this.oPersonalizationGetContainerStub = sandbox.stub();

            var oPersonalizationService = {
                getContainer: this.oPersonalizationGetContainerStub
            };

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            this.oGetServiceStub = sandbox.stub(Container, "getService");
            this.oGetServiceAsyncStub.withArgs("Personalization").resolves(oPersonalizationService);

            ObjectPath.set("constants.keyCategory.FIXED_KEY", "FIXED_KEY", oPersonalizationService);
            ObjectPath.set("constants.writeFrequency.HIGH", "HIGH", oPersonalizationService);

            this.oSmartNavigation = new SmartNavigation();

            var oGetHashCodeStub = sandbox.stub(this.oSmartNavigation, "_getHashCode");
            oGetHashCodeStub.withArgs("current-app").returns("current-app");
            oGetHashCodeStub.withArgs("foo-bar").returns("foo-bar");

            var iNow = Date.now();
            this.oContainers = {
                "ushell.smartnav.foo-bar": {},
                "ushell.smartnav.current-app": {
                    destination1: {
                        actions: {
                            app: {
                                latestVisit: iNow,
                                dailyFrequency: [3, 7, 0, 1, 4]
                            }
                        },
                        latestVisit: iNow,
                        dailyFrequency: [3, 7, 0, 1, 4]
                    },
                    destination2: {
                        actions: {
                            app: {
                                latestVisit: iNow,
                                dailyFrequency: [6, 2, 21, 32, 85]
                            }
                        },
                        latestVisit: iNow,
                        dailyFrequency: [6, 2, 21, 32, 85]
                    },
                    destination3: {
                        actions: {
                            app: {
                                latestVisit: iNow,
                                dailyFrequency: [5, 4, 8, 12]
                            }
                        },
                        latestVisit: iNow - SmartNavigation.ONE_DAY_IN_MILLISECOND,
                        dailyFrequency: [5, 4, 8, 12]
                    }
                }
            };

            this.oPersonalizationGetContainerStub.callsFake(function (sPersContainerKey) {
                var oPersContainer = {
                    save: sandbox.stub().returns(new jQuery.Deferred().resolve().promise()),
                    getItemKeys: function () {
                        return Object.keys(this.oContainers[sPersContainerKey]);
                    }.bind(this),
                    getItemValue: function (sKey) {
                        return this.oContainers[sPersContainerKey][sKey];
                    }.bind(this),
                    setItemValue: function (sKey, vValue) {
                        this.oContainers[sPersContainerKey][sKey] = vValue;
                    }.bind(this)
                };

                return new jQuery.Deferred().resolve(oPersContainer).promise();
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Increments navigation frequency to `destination1-app` for today if the destination was previously visited today", function (assert) {
        return this.oSmartNavigation._recordNavigationOccurrences("current-app", "destination1-app", {})
            .done(function () {
                var oContainer = this.oContainers["ushell.smartnav.current-app"];

                // assert
                assert.deepEqual(oContainer.destination1.dailyFrequency, [4, 7, 0, 1, 4], "The correct dailyFrequency has been found.");
            }.bind(this));
    });

    QUnit.test("Increments navigation frequency to `destination2-app` for today if the destination was previously visited today", function (assert) {
        return this.oSmartNavigation._recordNavigationOccurrences("current-app", "destination2-app", {})
            .done(function () {
                var oContainer = this.oContainers["ushell.smartnav.current-app"];

                // assert
                assert.deepEqual(oContainer.destination2.dailyFrequency, [7, 2, 21, 32, 85], "The correct dailyFrequency has been found.");
            }.bind(this));
    });

    QUnit.test("Records new navigation history entry for today if the last time the destination was visited is more than one day ago", function (assert) {
        return this.oSmartNavigation._recordNavigationOccurrences("current-app", "destination3-app", {})
            .done(function () {
                var oContainer = this.oContainers["ushell.smartnav.current-app"];

                // assert
                assert.deepEqual(oContainer.destination3.dailyFrequency, [1, 5, 4, 8, 12], "The correct dailyFrequency has been found.");
            }.bind(this));
    });

    QUnit.test("Records new navigation history entry for today for a destination application that was visited for the first time ever from the current app", function (assert) {
        return this.oSmartNavigation._recordNavigationOccurrences("foo-bar", "first_time-visit_ever", {})
            .done(function () {
                var oContainer = this.oContainers["ushell.smartnav.foo-bar"];

                // assert
                assert.deepEqual(oContainer.first_time.dailyFrequency, [1], "The correct dailyFrequency has been found.");
            }.bind(this));
    });

    QUnit.module("The function hrefForExternalAsync", {
        beforeEach: function () {
            this.oHrefForExternalAsyncStub = sandbox.stub();

            var oCrossApplicationNavigationService = {
                hrefForExternalAsync: this.oHrefForExternalAsyncStub
            };

            var oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            oGetServiceAsyncStub.withArgs("CrossApplicationNavigation").resolves(oCrossApplicationNavigationService);

            this.oSmartNavigation = new SmartNavigation();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the function hrefForExternalAsync of CrossApplicationNavigation with the same parameters", function (assert) {
        // Arrange
        var oHrefResult = {}; // Object to check for reference identity
        var oArg = {};
        this.oHrefForExternalAsyncStub.resolves(oHrefResult);

        // Act
        return this.oSmartNavigation.hrefForExternalAsync(oArg)
            .then(function (oResult) {
                // Assert
                assert.strictEqual(oResult, oHrefResult, "The correct reference has been found.");
                assert.strictEqual(this.oHrefForExternalAsyncStub.callCount, 1, "The function hrefForExternalAsync of CrossApplicationNavigation has been called once.");
                assert.strictEqual(this.oHrefForExternalAsyncStub.firstCall.args[0], oArg, "The function hrefForExternalAsync of CrossApplicationNavigation has been called once.");
            }.bind(this));
    });

    QUnit.test("Rejects with the same value if hrefForExternalAsync of CrossApplicationNavigation rejects", function (assert) {
        assert.expect(3);

        // Arrange
        var oErrorResult = {}; // Object to check for reference identity
        var oArg = {};
        this.oHrefForExternalAsyncStub.rejects(oErrorResult);

        // Act
        return this.oSmartNavigation.hrefForExternalAsync(oArg)
            .catch(function (oResult) {
                // Assert
                assert.strictEqual(oResult, oErrorResult, "The correct reference has been found.");
                assert.strictEqual(this.oHrefForExternalAsyncStub.callCount, 1, "The function hrefForExternalAsync of CrossApplicationNavigation has been called once.");
                assert.strictEqual(this.oHrefForExternalAsyncStub.firstCall.args[0], oArg, "The function hrefForExternalAsync of CrossApplicationNavigation has been called once.");
            }.bind(this));
    });
});
