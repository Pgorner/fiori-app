// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.UserEnvParameters
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/i18n/Formatting",
    "sap/ui/core/Supportability",
    "sap/ui/core/format/DateFormat",
    "sap/ushell/services/ReferenceResolver",
    "sap/ushell/Container"
], function (
    Log,
    Formatting,
    Supportability,
    DateFormat,
    ReferenceResolver,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.services.ReferenceResolver", {
        beforeEach: function () {
            // Ensure test doesn't rely on other services or the container object (i.e., test is isolated)
            sandbox.stub(Container, "getServiceAsync").resolves();

            this.oService = new ReferenceResolver();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("constructor constructs a service object", function (assert) {
        assert.strictEqual(typeof this.oService, "object", "the service has an object type");
        assert.strictEqual(typeof this.oService.resolveReferences, "function", "the resolveReferences function exists in the service");
        assert.strictEqual(typeof this.oService._getUserEnvReferenceResolver, "function", "the _getUserEnvReferenceResolver function exists in the service");
    });

    QUnit.test("_getUserEnvReferenceResolver", function (assert) {
        // Act
        const oResolver = this.oService._getUserEnvReferenceResolver();

        // Assert
        assert.strictEqual(typeof oResolver, "object", "returns an object");
        assert.strictEqual(typeof oResolver.getValue, "function", "returns an expected function");
    });

    QUnit.test("UserEnvReferenceResolver#getValue: return value", function (assert) {
        const oResolver = this.oService._getUserEnvReferenceResolver();
        const oValue = oResolver.getValue("something");
        assert.strictEqual(typeof oValue, "object", "getValue returned an object");
        assert.strictEqual(typeof oValue.then, "function", "instance returned is thenable");
    });

    const oBaseEnv = {
        /*
            * This is the base environment containing the raw values usually stored deeply in the User object or the UI5 Formatting values,
            * which will be mocked accordingly in the tests.
            */
        configABAPDateFormat: "DATEFORMAT",
        configABAPNumberFormat: "NUMBERFORMAT",
        configABAPTimeFormat: "TIMEFORMAT",
        userLanguage: "LANG",
        userLanguageBcp47: "LANGBCP",
        userAccessibilityMode: "ACCESSIBILITY",
        configStatistics: "STATISTICS",
        userThemeName: "THEME",
        userTheme: "THEME",
        userThemeNWBC: "THEME"
    };

    [{
        testedGetter: "getABAPDateFormat",
        testDescription: "base env is used with sap-ui-legacy-date-format",
        sUserEnvReferenceName: "User.env.sap-ui-legacy-date-format",
        expectedValue: oBaseEnv.configABAPDateFormat,
        expectedGetterCalledWith: []
    }, {
        testedGetter: "getABAPNumberFormat",
        testDescription: "base env is used with sap-ui-legacy-number-format",
        sUserEnvReferenceName: "User.env.sap-ui-legacy-number-format",
        expectedValue: oBaseEnv.configABAPNumberFormat,
        expectedGetterCalledWith: []
    }, {
        testedGetter: "getABAPTimeFormat",
        testDescription: "base env is used with sap-ui-legacy-time-format",
        sUserEnvReferenceName: "User.env.sap-ui-legacy-time-format",
        expectedValue: oBaseEnv.configABAPTimeFormat,
        expectedGetterCalledWith: []
    }, {
        testedGetter: "getLanguage",
        testDescription: "base env is used with sap-language",
        sUserEnvReferenceName: "User.env.sap-language",
        expectedValue: oBaseEnv.userLanguage,
        expectedGetterCalledWith: []
    }, {
        testedGetter: "getLanguageBcp47",
        testDescription: "base env is used with sap-languagebcp47",
        sUserEnvReferenceName: "User.env.sap-languagebcp47",
        expectedValue: oBaseEnv.userLanguageBcp47,
        expectedGetterCalledWith: []
    }, {
        testedGetter: "getAccessibilityMode",
        testDescription: "base env is used with sap-accessibility as true",
        sUserEnvReferenceName: "User.env.sap-accessibility",
        expectedValue: "X",
        expectedGetterCalledWith: []
    }, {
        testedGetter: "getAccessibilityMode",
        testDescription: "base env is used with sap-accessibility as false",
        sUserEnvReferenceName: "User.env.sap-accessibility",
        expectedValue: "X",
        expectedGetterCalledWith: []
    }, {
        testedGetter: "getStatisticsEnabled",
        testDescription: "base env is used with sap-statistics as true",
        sUserEnvReferenceName: "User.env.sap-statistics",
        expectedValue: "true",
        expectedGetterCalledWith: []
    }, {
        testedGetter: "getStatisticsEnabled",
        testDescription: "base env is used with sap-statistics as false",
        sUserEnvReferenceName: "User.env.sap-statistics",
        expectedValue: "true",
        expectedGetterCalledWith: []
    }, {
        testedGetter: "getTheme",
        testDescription: "base env is used with sap-theme",
        sUserEnvReferenceName: "User.env.sap-theme",
        expectedValue: oBaseEnv.userTheme,
        expectedGetterCalledWith: ["N+U"]
    }, {
        testedGetter: "getTheme",
        testDescription: "base env is used with sap-theme-name",
        sUserEnvReferenceName: "User.env.sap-theme-name",
        expectedValue: oBaseEnv.userThemeName,
        expectedGetterCalledWith: []
    }, {
        testedGetter: "getTheme",
        testDescription: "base env is used with sap-theme-NWBC",
        sUserEnvReferenceName: "User.env.sap-theme-NWBC",
        expectedValue: oBaseEnv.userThemeNWBC,
        expectedGetterCalledWith: ["NWBC"]
    }].forEach((oFixture) => {
        QUnit.test(`UserEnvResolver#getValue: expected value for known user env default returned when ${ oFixture.testDescription}`, async function (assert) {
            // Arrange
            const oResolver = this.oService._getUserEnvReferenceResolver();

            const oStubs = {
                getTheme: sandbox.stub().returns(oBaseEnv.userTheme),
                getLanguage: sandbox.stub().returns(oBaseEnv.userLanguage),
                getLanguageBcp47: sandbox.stub().returns(oBaseEnv.userLanguageBcp47),
                getAccessibilityMode: sandbox.stub().returns(oBaseEnv.userAccessibilityMode),
                getABAPDateFormat: sandbox.stub(Formatting, "getABAPDateFormat").returns(oBaseEnv.configABAPDateFormat),
                getABAPNumberFormat: sandbox.stub(Formatting, "getABAPNumberFormat").returns(oBaseEnv.configABAPNumberFormat),
                getABAPTimeFormat: sandbox.stub(Formatting, "getABAPTimeFormat").returns(oBaseEnv.configABAPTimeFormat)
            };

            sandbox.stub(Container, "getUser").returns({
                getTheme: oStubs.getTheme,
                getLanguage: oStubs.getLanguage,
                getLanguageBcp47: oStubs.getLanguageBcp47,
                getAccessibilityMode: oStubs.getAccessibilityMode
            });

            oStubs.getStatisticsEnabled = sandbox.stub(Supportability, "isStatisticsEnabled").returns(oBaseEnv.configStatistics);

            // Act
            const oValue = await oResolver.getValue(oFixture.sUserEnvReferenceName);

            // Assert
            assert.ok(true, "promise was resolved");

            assert.deepEqual(oValue, { value: oFixture.expectedValue }, "the promise was resolved with the expected value");

            const oCalledStub = oStubs[oFixture.testedGetter];
            assert.deepEqual(oCalledStub.getCall(0).args, oFixture.expectedGetterCalledWith, `the ${ oFixture.testedGetter } getter was called with the expected arguments`);
        });
    });

    [{
        testDescription: "not all references could be resolved",
        aReferences: ["UserDefault.name", "UserDefault.surname", "Machine.name"],
        expectedErrorLogCalls: 1,
        expectedErrorLogCallArgs: [
            "'Machine.name' is not a legal reference name",
            null,
            "sap.ushell.services.ReferenceResolver"
        ]
    }].forEach((oFixture) => {
        QUnit.test(`resolveReferences: rejects with error message when ${ oFixture.testDescription}`, async function (assert) {
            const oSrvc = this.oService;
            const oStub = sinon.stub(Log, "error");

            try {
                await oSrvc.resolveReferences(oFixture.aReferences, {});

                assert.ok(false, "promise was rejected");
            } catch (oError) {
                assert.ok(true, "promise was rejected");
                assert.strictEqual(oError.message, "One or more references could not be resolved", "promise was rejected with expected error message");
                assert.strictEqual(oStub.getCalls().length, oFixture.expectedErrorLogCalls, `Log.error was called ${ oFixture.expectedErrorLogCalls } time`);
                assert.deepEqual(oStub.getCall(0).args, oFixture.expectedErrorLogCallArgs, "Log.error was called with the expected arguments");
            }
        });
    });

    [
        { description: "1", input: "UserDefault.extended.A", o1: undefined, o2: "A", o3: "A" },
        { description: "2", input: "UserDefault.A", o1: "A", o2: undefined, o3: "A" },
        { description: "3", input: "UserDefault.extended", o1: "extended", o2: undefined, o3: "extended" },
        { description: "4", input: "UserDefaultA", o1: undefined, o2: undefined, o3: undefined },
        { description: "5", input: "UserDefault.extendedB", o1: "extendedB", o2: undefined, o3: "extendedB" },
        { description: "6", input: "UserDefault.extended.", o1: undefined, o2: "", o3: "" },
        { description: "7", input: "UserDefault.", o1: "", o2: undefined, o3: "" },
        { description: "8", input: "A.UserDefault.extended.AX", o1: undefined, o2: undefined, o3: undefined }
    ].forEach((oFixture) => {
        QUnit.test(`extractExtendUserDefaultName: ${ oFixture.description}`, function (assert) {
            const oSrvc = this.oService;
            const actual1 = oSrvc.extractUserDefaultReferenceName(oFixture.input);
            const actual2 = oSrvc.extractExtendedUserDefaultReferenceName(oFixture.input);
            assert.equal(actual1, oFixture.o1, " extractUserDefaultReferenceName ok");
            assert.equal(actual2, oFixture.o2, " extractExtendedUserDefaultReferenceName ok");
            const actual3 = oSrvc._extractAnyUserDefaultReferenceName(oFixture.input);
            assert.equal(actual3, oFixture.o3, " extractExtendedUserDefaultReferenceName ok");
        });
    });

    // _mergeSimpleAndExtended
    [{
        description: "simple and extended values",
        initialValueObject: {
            value: "0", // numbers also have to be strings as part of a range
            extendedValue: { Ranges: [{ Sign: "I", Option: "EQ", Low: "A", High: "B" }] }
        },
        expectedMergedObject: {
            Ranges: [
                { Sign: "I", Option: "EQ", Low: "A", High: "B" },
                { Sign: "I", Option: "EQ", Low: "0", High: null }
            ]
        }
    }, {
        description: "simple value undefined",
        initialValueObject: {
            value: undefined,
            extendedValue: { Ranges: [{ Sign: "I", Option: "EQ", Low: "A", High: "B" }] }
        },
        expectedMergedObject: { Ranges: [{ Sign: "I", Option: "EQ", Low: "A", High: "B" }] }
    }, {
        description: "simple value empty string",
        initialValueObject: {
            value: "",
            extendedValue: { Ranges: [{ Sign: "I", Option: "EQ", Low: "A", High: "B" }] }
        },
        expectedMergedObject: {
            Ranges: [
                { Sign: "I", Option: "EQ", Low: "A", High: "B" },
                { Sign: "I", Option: "EQ", Low: "", High: null }
            ]
        }
    }, {
        description: "no extended value",
        initialValueObject: {
            value: "0",
            extendedValue: undefined
        },
        expectedMergedObject: { Ranges: [{ Sign: "I", Option: "EQ", Low: "0", High: null }] }
    }, {
        description: "no extended value",
        initialValueObject: {
            value: undefined,
            extendedValue: undefined
        },
        expectedMergedObject: {}
    }].forEach((oFixture) => {
        QUnit.test(`mergeSimpleAndExtended: ${ oFixture}`, function (assert) {
            assert.deepEqual(this.oService.mergeSimpleAndExtended(oFixture.initialValueObject),
                oFixture.expectedMergedObject, "merged as expected");
        });
    });

    [{
        testDescription: "Given URL without any parameters, nothing is replaced",
        input: { sUrl: "/some/url" },
        expected: {
            result: {
                url: "/some/url",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: false,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "Given URL without user default parameters, nothing is replaced",
        input: { sUrl: "/some/url?a=b&c=100" },
        expected: {
            result: {
                url: "/some/url?a=b&c=100",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: false,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "Given URL with wrong reference, nothing is replaced",
        input: { sUrl: "/some/url?a=b&c={Edm.String%%noUserDefault.foo%%}&d={Edm.String%%UserDefault1%%}&e={Edm.String%%UserDefault.%%}" },
        expected: {
            result: {
                url: "/some/url?a=b&c={Edm.String%%noUserDefault.foo%%}&d={Edm.String%%UserDefault1%%}&e={Edm.String%%UserDefault.%%}",
                defaultsWithoutValue: [],
                ignoredReferences: [
                    "noUserDefault.foo",
                    "UserDefault1",
                    "UserDefault."
                ]
            },
            resolvedReferencesCalled: false,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "Given URL with one user default parameters with value (encoding needed)",
        input: {
            sUrl: "/some/url?a=100%25&c={Edm.String%%UserDefault.CompanyCode%%}",
            oResolvedReferences: { "UserDefault.CompanyCode": "hello world?" }
        },
        expected: {
            result: {
                url: "/some/url?a=100%25&c='hello%20world%3F'",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "Given URL with two user default parameters with value",
        input: {
            sUrl: "/some/url?a=b&c={%%UserDefault.CompanyCode%%}&d={Edm.String%%UserDefault.CostCenter%%}",
            oResolvedReferences: {
                "UserDefault.CompanyCode": 1234,
                "UserDefault.CostCenter": "ABC"
            }
        },
        expected: {
            result: {
                url: "/some/url?a=b&c=1234&d='ABC'",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "Given URL with two user default parameters, one with value, one without",
        input: {
            sUrl: "/some/url?a=b&c={%%UserDefault.CompanyCode%%}&d={Edm.String%%UserDefault.CostCenter%%}",
            oResolvedReferences: {
                "UserDefault.CompanyCode": undefined,
                "UserDefault.CostCenter": "ABC"
            }
        },
        expected: {
            result: {
                url: "/some/url?a=b&c=&d='ABC'",
                defaultsWithoutValue: ["UserDefault.CompanyCode"],
                ignoredReferences: []
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "Given URL with two user default parameters, one with value, one without",
        input: {
            sUrl: "/some/url?a=b&c={%%UserDefault.CompanyCode%%}&d={Edm.String%%UserDefault.CostCenter%%}",
            oResolvedReferences: {
                "UserDefault.CompanyCode": 0,
                "UserDefault.CostCenter": "ABC"
            }
        },
        expected: {
            result: {
                url: "/some/url?a=b&c=0&d='ABC'",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "Do not replace invalid parameters",
        input: {
            sUrl: "/some/url?a=b&c={Edm.String%%noUserDefault%%}&d={Edm.String%%UserDefault.CostCenter%%}",
            oResolvedReferences: { "UserDefault.CostCenter": "ABC" }
        },
        expected: {
            result: {
                url: "/some/url?a=b&c={Edm.String%%noUserDefault%%}&d='ABC'",
                defaultsWithoutValue: [],
                ignoredReferences: ["noUserDefault"]
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "skip UserDefault.extended",
        input: {
            sUrl: "/some/url?a=b&c={Edm.String%%UserDefault.extended.CompanyCode%%}&d={Edm.String%%UserDefault.extendedName%%}",
            oResolvedReferences: { "UserDefault.extendedName": "foo" }
        },
        expected: {
            result: {
                url: "/some/url?a=b&c={Edm.String%%UserDefault.extended.CompanyCode%%}&d='foo'",
                defaultsWithoutValue: [],
                ignoredReferences: ["UserDefault.extended.CompanyCode"]
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "skip User.env",
        input: { sUrl: "/some/url?a=b&c={Edm.String%%User.env.sap-theme-name%%}&d=100" },
        expected: {
            result: {
                url: "/some/url?a=b&c={Edm.String%%User.env.sap-theme-name%%}&d=100",
                defaultsWithoutValue: [],
                ignoredReferences: ["User.env.sap-theme-name"]
            },
            resolvedReferencesCalled: false,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "UserDefault and filter",
        input: {
            sUrl: "/some/url/$count?$filter=substring(title, 1) eq {Edm.String%%UserDefault.title%%}",
            oResolvedReferences: { "UserDefault.title": "foo" }
        },
        expected: {
            result: {
                url: "/some/url/$count?$filter=substring(title, 1) eq 'foo'",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "UserDefault in path",
        input: {
            sUrl: "/somepath({Edm.String%%UserDefault.choosenNumber%%})/someurl/$value",
            oResolvedReferences: { "UserDefault.choosenNumber": "2" }
        },
        expected: {
            result: {
                url: "/somepath('2')/someurl/$value",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "UserDefault in wrong place",
        input: {
            sUrl: "some/{Edm.String%%UserDefault.choosenPath%%}/url/$value",
            oResolvedReferences: { "UserDefault.choosenPath": "oData.svc" }
        },
        expected: {
            result: {
                url: "some/{Edm.String%%UserDefault.choosenPath%%}/url/$value",
                defaultsWithoutValue: [],
                ignoredReferences: ["UserDefault.choosenPath"]
            },
            resolvedReferencesCalled: false,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "UserDefault with unknown type",
        input: {
            sUrl: "/some/url/$count?$filter=substring(title, 1) eq '{Edm.Unknown%%UserDefault.title%%}'",
            oResolvedReferences: { "UserDefault.title": "foo" }
        },
        expected: {
            result: {
                url: "/some/url/$count?$filter=substring(title, 1) eq 'foo'",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "UserDefault without type",
        input: {
            sUrl: "/some/url?a=20&sap-client={%%UserDefault.client%%}",
            oResolvedReferences: { "UserDefault.client": 120 }
        },
        expected: {
            result: {
                url: "/some/url?a=20&sap-client=120",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "Same UserDefault in multiple places",
        input: {
            sUrl: "/some/url?a=20&sap-client={%%UserDefault.client%%}&b={%%UserDefault.client%%}",
            oResolvedReferences: { "UserDefault.client": 120 }
        },
        expected: {
            result: {
                url: "/some/url?a=20&sap-client=120&b=120",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: true
        }
    }, {
        testDescription: "Same UserDefault in multiple places, one of them in the wrong place",
        input: {
            sUrl: "some/{Edm.String%%UserDefault.choosenPath%%}/url/$value?a={Edm.String%%UserDefault.choosenPath%%}",
            oResolvedReferences: { "UserDefault.choosenPath": "oData.svc" }
        },
        expected: {
            result: {
                url: "some/'oData.svc'/url/$value?a='oData.svc'",
                defaultsWithoutValue: [],
                ignoredReferences: ["UserDefault.choosenPath"]
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: true
        }
    }].forEach((oFixture) => {
        QUnit.test(`resolveUserDefaultParameters ${ oFixture.testDescription}`, async function (assert) {
            // Arrange
            const fnResolveRefsStub = sinon.stub(this.oService, "resolveReferences").callsFake(async () => {
                return oFixture.input.oResolvedReferences || {}; // fallback to fail properly
            });

            // Act
            const oResult = await this.oService.resolveUserDefaultParameters(oFixture.input.sUrl);

            // Assert
            assert.deepEqual(oResult, oFixture.expected.result, "result");
            assert.strictEqual(fnResolveRefsStub.callCount,
                oFixture.expected.resolvedReferencesCalled ? 1 : 0,
                "resolvedReferences callCount");
            if (oFixture.expected.resolvedReferencesCalled && !oFixture.expected.bSameCallsMultipleTimes) {
                assert.deepEqual(fnResolveRefsStub.firstCall.args[0],
                    Object.keys(oFixture.input.oResolvedReferences),
                    "resolveReferences called with correct User Default Names");
            }
        });
    });

    QUnit.module("sap.ushell.services.ReferenceResolver - 2", {
        beforeEach: function () {
            this.oService = new ReferenceResolver();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    [{
        testDescription: "resolving a user default reference",
        aReferences: ["UserDefault.hometown"],
        oDefaultResolvedReferences: { hometown: { value: "walldorf" } },
        expectedResolution: { "UserDefault.hometown": "walldorf" }
    }, {
        testDescription: "resolving a user env reference",
        aReferences: ["User.env.sap-theme"],
        oDefaultResolvedReferences: { "User.env.sap-theme": { value: "our_theme" } },
        expectedResolution: { "User.env.sap-theme": "our_theme" }
    }, {
        testDescription: "resolving an extended user default reference",
        aReferences: ["UserDefault.extended.hometown"],
        oDefaultResolvedReferences: { hometown: { extendedValue: { Ranges: [{ Sign: "I", Option: "EQ", Low: "A", High: "B" }] } } },
        expectedResolution: {
            "UserDefault.extended.hometown": {
                Ranges: [{
                    High: "B",
                    Low: "A",
                    Option: "EQ",
                    Sign: "I"
                }]
            }
        }
    }, {
        testDescription: "resolving a simple and an extended user default reference",
        aReferences: ["UserDefault.extended.hometown", "UserDefault.hometown"],
        oDefaultResolvedReferences: {
            hometown: {
                value: "walldorf",
                extendedValue: { Ranges: [{ Sign: "I", Option: "EQ", Low: "A", High: "B" }] }
            }
        },
        expectedResolution: {
            "UserDefault.extended.hometown": {
                Ranges: [
                    {
                        High: "B",
                        Low: "A",
                        Option: "EQ",
                        Sign: "I"
                    }, {
                        High: null,
                        Low: "walldorf",
                        Option: "EQ",
                        Sign: "I"
                    }
                ]
            },
            "UserDefault.hometown": "walldorf"
        }
    }].forEach((oFixture) => {
        QUnit.test(`resolveReferences: resolves as expected when ${ oFixture.testDescription}`, async function (assert) {
            // Arrange
            // Stub the UserDefaultParameters service
            const oGetServiceAsyncStub = sinon.stub();
            const fnFakeGetValue = async function (sReferenceName) {
                const oResolvedReference = oFixture.oDefaultResolvedReferences[sReferenceName];
                return oResolvedReference;
            };

            const oFakeUserDefaultParameters = {
                getValue: fnFakeGetValue
            };

            oGetServiceAsyncStub.withArgs("UserDefaultParameters").resolves(oFakeUserDefaultParameters);
            oGetServiceAsyncStub.throws("This test expects that only UserDefaultParameters is passed to getServiceAsync");
            sandbox.stub(Container, "getServiceAsync").callsFake(oGetServiceAsyncStub);

            // Stub the UserEnvResolver object
            sinon.stub(this.oService, "_getUserEnvReferenceResolver").returns({
                getValue: fnFakeGetValue
            });

            // Act
            const oResolvedReferences = await this.oService.resolveReferences(oFixture.aReferences, {});

            // Assert
            assert.ok(true, "the promise was resolved");
            assert.deepEqual(oResolvedReferences, oFixture.expectedResolution, "references were resolved as expected");
        });
    });

    QUnit.module("The method resolveReferences", {
        beforeEach: function () {
            this.oDefaultSystemContextMock = {};
            this.getServiceAsyncStub = sandbox.stub();
            sandbox.stub(Container, "getServiceAsync").callsFake(this.getServiceAsyncStub);

            this.oGetValueStub = sandbox.stub();
            this.oGetValueStub.resolves({ value: "sName" });
            this.getServiceAsyncStub.withArgs("UserDefaultParameters").resolves({
                getValue: this.oGetValueStub
            });

            this.oGetSystemContextStub = sandbox.stub();
            this.oGetSystemContextStub.resolves(this.oDefaultSystemContextMock);
            this.getServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: this.oGetSystemContextStub
            });

            this.oService = new ReferenceResolver();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Processes a systemContext correctly", async function (assert) {
        // Arrange
        const oSystemContext = {};
        const aUserDefault = ["UserDefault.someDefault"];

        // Act
        await this.oService.resolveReferences(aUserDefault, oSystemContext);

        // Assert
        assert.strictEqual(this.oGetValueStub.getCall(0).args[0], "someDefault", "getValue was called with the correct key");
        assert.strictEqual(this.oGetValueStub.getCall(0).args[1], oSystemContext, "getValue was called with the correct systemContext");
        assert.strictEqual(this.oGetSystemContextStub.callCount, 0, "getSystemContext was not called");
    });

    QUnit.test("Processes a defaultSystemContext correctly", async function (assert) {
        // Arrange
        const aUserDefault = ["UserDefault.someDefault"];

        // Act
        await this.oService.resolveReferences(aUserDefault);

        // Assert
        assert.strictEqual(this.oGetValueStub.getCall(0).args[0], "someDefault", "getValue was called with the correct key");
        assert.strictEqual(this.oGetValueStub.getCall(0).args[1], this.oDefaultSystemContextMock, "getValue was called with the correct systemContext");
        assert.strictEqual(this.oGetSystemContextStub.callCount, 1, "getSystemContext was called once");
    });

    QUnit.module("The method resolveUserDefaultParameters", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();
            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);

            this.oService = new ReferenceResolver();
            this.oResolveReferencesStub = sandbox.stub(this.oService, "resolveReferences");
            this.oResolveReferencesStub.resolves({});
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Processes a systemContext correctly", async function (assert) {
        // Arrange
        const oSystemContext = {};
        const sUrl = "* https://some.url/string/with?param={%%UserDefault.someDefault%%}";

        // Act
        await this.oService.resolveUserDefaultParameters(sUrl, oSystemContext);

        // Assert
        assert.deepEqual(this.oResolveReferencesStub.getCall(0).args[0], ["UserDefault.someDefault"], "resolveReferences was called with the correct key");
        assert.strictEqual(this.oResolveReferencesStub.getCall(0).args[1], oSystemContext, "resolveReferences was called with the correct systemContext");
    });

    QUnit.module("The method resolveSemanticDateRanges", {
        before: function () {

            this.getUTCTimestamp = function (iYear, iMonth, iDate, iHours, iMinutes, iSeconds, iMilliseconds) {
                // The test date in local timezone has to be converted into a UTC timestamp dynamically
                // as it is not possible to stub the browser's current timezone.
                // Otherwise the test would only work in the timezone it was developed in.
                let oDate;
                if (iMilliseconds || iMilliseconds === 0) {
                    this.oDateTimeOffsetFormat = DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'" });
                    oDate = new Date(iYear, iMonth, iDate, iHours, iMinutes, iSeconds, iMilliseconds);
                } else {
                    this.oDateTimeOffsetFormat = DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd'T'HH:mm:ss'Z'" });
                    oDate = new Date(iYear, iMonth, iDate, iHours, iMinutes, iSeconds);
                }

                const sUTCTimestamp = this.oDateTimeOffsetFormat.format(oDate, true);
                return encodeURIComponent(sUTCTimestamp);
            };
        },
        beforeEach: function () {
            // The index of the month starts at 0, so the test date is in September
            this.oTestDate = new Date(2022, 8, 29, 10, 53, 17);
            this.clock = sinon.useFakeTimers(this.oTestDate);
            this.oReferenceResolver = new ReferenceResolver();
        },
        afterEach: function () {
            sandbox.restore();
            this.clock.restore();
        }
    });

    QUnit.test("Resolves YESTERDAY as EdmType String in the query", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(BankStatementStatus eq '2' or BankStatementStatus eq '7') and (IsActiveEntity eq true) and (PostingDate eq {Edm.String%%DynamicDate.YESTERDAY%%})";

        const sExpectedUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(BankStatementStatus eq '2' or BankStatementStatus eq '7') and (IsActiveEntity eq true) and (PostingDate eq '20220928')";

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
        .then((oResultObject) => {
            // Assert
            assert.strictEqual(oResultObject.url, sExpectedUrl, "The semantic date range was resolved correctly.");
        });
    });

    QUnit.test("Resolves TODAY as EdmType DateTime in the query", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(BankStatementStatus eq '2' or BankStatementStatus eq '7') and (IsActiveEntity eq true) and (PostingDate eq {Edm.DateTime%%DynamicDate.TODAY%%})";

        const sExpectedUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(BankStatementStatus eq '2' or BankStatementStatus eq '7') and (IsActiveEntity eq true) and (PostingDate eq datetime'2022-09-29T00%3A00%3A00')";

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
        .then((oResultObject) => {
            // Assert
            assert.strictEqual(oResultObject.url, sExpectedUrl, "The semantic date range was resolved correctly.");
        });
    });

    QUnit.test("Resolves YESTERDAY as EdmType String and EdmType DateTime in the query", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(BankStatementStatus eq '2' or BankStatementStatus eq '7') and (IsActiveEntity eq true) and " +
            "(PostingDate eq {Edm.String%%DynamicDate.YESTERDAY%%}) and (ValueDate eq {Edm.DateTime%%DynamicDate.YESTERDAY%%})";

        const sExpectedUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(BankStatementStatus eq '2' or BankStatementStatus eq '7') and " +
            "(IsActiveEntity eq true) and (PostingDate eq '20220928') and (ValueDate eq datetime'2022-09-28T00%3A00%3A00')";

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
        .then((oResultObject) => {
            // Assert
            assert.strictEqual(oResultObject.url, sExpectedUrl, "The semantic date range was resolved correctly.");
        });
    });

    QUnit.test("Resolves TODAY as EdmType String with a parameter", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FINS_TRR_MONITOR_SRV/C_Trrmonitor(P_KeyDate={Edm.String%%DynamicDate.TODAY%%},P_ToFiscalYearPeriod=%2701.2018%27)/Results/$count";

        const sExpectedUrl = "/sap/opu/odata/sap/FINS_TRR_MONITOR_SRV/C_Trrmonitor(P_KeyDate='20220929',P_ToFiscalYearPeriod=%2701.2018%27)/Results/$count";

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
        .then((oResultObject) => {

        // Assert
        assert.strictEqual(oResultObject.url, sExpectedUrl, "The semantic date range was resolved correctly.");
        });
    });

    QUnit.test("Resolves TODAY as EdmType DateTime with a parameter", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FINS_TRR_MONITOR_SRV/C_Trrmonitor(P_KeyDate={Edm.DateTime%%DynamicDate.TODAY%%},P_ToFiscalYearPeriod=%2701.2018%27)/Results/$count";

        const sExpectedUrl = "/sap/opu/odata/sap/FINS_TRR_MONITOR_SRV/C_Trrmonitor(P_KeyDate=datetime'2022-09-29T00%3A00%3A00',P_ToFiscalYearPeriod=%2701.2018%27)/Results/$count";

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
        .then((oResultObject) => {
            // Assert
            assert.strictEqual(oResultObject.url, sExpectedUrl, "The semantic date range was resolved correctly.");
        });
    });

    QUnit.test("Resolves TODAYFROMTO as EdmType DateTime in the query", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(ValidityEndDateForEdit ge {Edm.DateTime%%DynamicDate.TODAYFROMTO.1.5.start%%} and ValidityEndDateForEdit le {Edm.DateTime%%DynamicDate.TODAYFROMTO.1.5.end%%})&$select=";

        const sExpectedUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(ValidityEndDateForEdit ge datetime'2022-09-28T00%3A00%3A00' and ValidityEndDateForEdit le datetime'2022-10-04T00%3A00%3A00')&$select=";

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
        .then((oResultObject) => {

        // Assert
        assert.strictEqual(oResultObject.url, sExpectedUrl, "The semantic date range was resolved correctly.");
        });
    });

    QUnit.test("Resolves NEXTDAYS as EdmType DateTime in the query", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(ValidityEndDateForEdit ge {Edm.DateTime%%DynamicDate.NEXTDAYS.5.start%%} and ValidityEndDateForEdit le {Edm.DateTime%%DynamicDate.NEXTDAYS.5.end%%})&$select=";

        const sExpectedUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(ValidityEndDateForEdit ge datetime'2022-09-30T00%3A00%3A00' and ValidityEndDateForEdit le datetime'2022-10-04T00%3A00%3A00')&$select=";

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
        .then((oResultObject) => {
            // Assert
            assert.strictEqual(oResultObject.url, sExpectedUrl, "The semantic date range was resolved correctly.");
        });
    });

    QUnit.test("Resolves YESTERDAY as EdmType DateTimeOffset in the query (ODATA V2)", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?$filter=" +
            "((ClearingDate ge {Edm.DateTimeOffset%%DynamicDate.YESTERDAY.start%%} and ClearingDate le {Edm.DateTimeOffset%%DynamicDate.YESTERDAY.end%%}) and " +
            "((CompanyCode ge 'F001' and CompanyCode le 'F002') or CompanyCode eq '0001' or CompanyCode eq '1010'))";

        const sTestDateStartUTC = this.getUTCTimestamp(2022, 8, 28, 0, 0, 0);
        const sTestDateEndUTC = this.getUTCTimestamp(2022, 8, 28, 23, 59, 59, 999);

        const sExpectedUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?$filter=" +
            `((ClearingDate ge datetimeoffset'${ sTestDateStartUTC }' and ClearingDate le datetimeoffset'${ sTestDateEndUTC }') and ` +
            "((CompanyCode ge 'F001' and CompanyCode le 'F002') or CompanyCode eq '0001' or CompanyCode eq '1010'))";

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
        .then((oResultObject) => {
            // Assert
            assert.strictEqual(oResultObject.url, sExpectedUrl, "The semantic date range was resolved correctly.");
        });
    });

    QUnit.test("Resolves THISYEAR as EdmType DateTime and THISMONTH as EdmType DateTimeOffset in the query (ODATA V2)", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?$filter=" +
            "((ClearingDate ge {Edm.DateTime%%DynamicDate.THISYEAR.start%%} and ClearingDate le {Edm.DateTime%%DynamicDate.THISYEAR.end%%}) and " +
            "((CompanyCode ge 'F001' and CompanyCode le 'F002') or CompanyCode eq '0001' or CompanyCode eq '1010') and " +
            "(CreationDateTime ge {Edm.DateTimeOffset%%DynamicDate.THISMONTH.start%%} and CreationDateTime le {Edm.DateTimeOffset%%DynamicDate.THISMONTH.end%%}))&$select=";

        const sThisMonthStartUTC = this.getUTCTimestamp(2022, 8, 1, 0, 0, 0);
        const sThisMonthEndUTC = this.getUTCTimestamp(2022, 8, 30, 23, 59, 59, 999);

        const sExpectedUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?$filter=" +
            "((ClearingDate ge datetime'2022-01-01T00%3A00%3A00' and ClearingDate le datetime'2022-12-31T00%3A00%3A00') and " +
            "((CompanyCode ge 'F001' and CompanyCode le 'F002') or CompanyCode eq '0001' or CompanyCode eq '1010') and " +
            `(CreationDateTime ge datetimeoffset'${ sThisMonthStartUTC }' and CreationDateTime le datetimeoffset'${ sThisMonthEndUTC }'))&$select=`;

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
        .then((oResultObject) => {
            // Assert
            assert.strictEqual(oResultObject.url, sExpectedUrl, "The semantic date range was resolved correctly.");
        });
    });

    QUnit.test("Resolves THISYEAR as EdmType DateTimeOffset in the query (ODATA V2)", function (assert) {
        // Arrange
        this.clock = sinon.useFakeTimers(new Date(2022, 0, 1, 3, 0, 0));

        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?$filter=" +
            "((ClearingDate ge {Edm.DateTimeOffset%%DynamicDate.THISYEAR.start%%} and ClearingDate le {Edm.DateTimeOffset%%DynamicDate.THISYEAR.end%%}) and " +
            "((CompanyCode ge 'F001' and CompanyCode le 'F002') or CompanyCode eq '0001' or CompanyCode eq '1010'))";

        const sTestDateStartUTC = this.getUTCTimestamp(2022, 0, 1, 0, 0, 0);
        const sTestDateEndUTC = this.getUTCTimestamp(2022, 11, 31, 23, 59, 59, 999);

        const sExpectedUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?$filter=" +
            `((ClearingDate ge datetimeoffset'${ sTestDateStartUTC }' and ClearingDate le datetimeoffset'${ sTestDateEndUTC }') and ` +
            "((CompanyCode ge 'F001' and CompanyCode le 'F002') or CompanyCode eq '0001' or CompanyCode eq '1010'))";

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
        .then((oResultObject) => {
            // Assert
            assert.strictEqual(oResultObject.url, sExpectedUrl, "The semantic date range was resolved correctly.");
        });
    });

    QUnit.test("Resolves YESTERDAY as EdmType Date in the query (ODATA V4)", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(BankStatementStatus eq '2' or BankStatementStatus eq '7') and (IsActiveEntity eq true) and (PostingDate eq {Edm.Date%%DynamicDate.YESTERDAY%%})";

        const sExpectedUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(BankStatementStatus eq '2' or BankStatementStatus eq '7') and (IsActiveEntity eq true) and (PostingDate eq 2022-09-28)";

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "4.0")
        .then((oResultObject) => {
            // Assert
            assert.strictEqual(oResultObject.url, sExpectedUrl, "The semantic date range was resolved correctly.");
        });
    });

    QUnit.test("Resolves THISYEAR as EdmType Date and THISMONTH as EdmType DateTimeOffset in the query (ODATA V4)", function (assert) {
    // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=((ClearingDate ge {Edm.Date%%DynamicDate.THISYEAR.start%%} and ClearingDate le {Edm.Date%%DynamicDate.THISYEAR.end%%}) and" +
            " ((CompanyCode ge 'F001' and CompanyCode le 'F002') or CompanyCode eq '0001' or CompanyCode eq '1010') and" +
            " (CreationDateTime ge {Edm.DateTimeOffset%%DynamicDate.THISMONTH.start%%} and CreationDateTime le {Edm.DateTimeOffset%%DynamicDate.THISMONTH.end%%}))&$select=";

        const sTestDateStartUTC = this.getUTCTimestamp(2022, 8, 1, 0, 0, 0, 0);
        const sTestDateEndUTC = this.getUTCTimestamp(2022, 8, 30, 23, 59, 59, 999);

        const sExpectedUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=((ClearingDate ge 2022-01-01 and ClearingDate le 2022-12-31) and" +
            " ((CompanyCode ge 'F001' and CompanyCode le 'F002') or CompanyCode eq '0001' or CompanyCode eq '1010') and" +
            ` (CreationDateTime ge ${ sTestDateStartUTC } and CreationDateTime le ${ sTestDateEndUTC }))&$select=`;

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "4.0")
        .then((oResultObject) => {
            // Assert
            assert.strictEqual(oResultObject.url, sExpectedUrl, "The semantic date range was resolved correctly.");
        });
    });

    QUnit.test("Resolves TODAY as EdmType Date and EdmType DateTimeOffset in the query (ODATA V4)", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(ClearingDate eq {Edm.Date%%DynamicDate.TODAY%%} and" +
            " ((CompanyCode ge 'F001' and CompanyCode le 'F002') or CompanyCode eq '0001' or CompanyCode eq '1010') and" +
            " (CreationDateTime ge {Edm.DateTimeOffset%%DynamicDate.TODAY.start%%} and CreationDateTime le {Edm.DateTimeOffset%%DynamicDate.TODAY.end%%}))&$select=";

        const sTestDateStartUTC = this.getUTCTimestamp(2022, 8, 29, 0, 0, 0, 0);
        const sTestDateEndUTC = this.getUTCTimestamp(2022, 8, 29, 23, 59, 59, 999);

        const sExpectedUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(ClearingDate eq 2022-09-29 and" +
            " ((CompanyCode ge 'F001' and CompanyCode le 'F002') or CompanyCode eq '0001' or CompanyCode eq '1010') and" +
            ` (CreationDateTime ge ${ sTestDateStartUTC } and CreationDateTime le ${ sTestDateEndUTC }))&$select=`;

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "4.0")
        .then((oResultObject) => {
            // Assert
            assert.strictEqual(oResultObject.url, sExpectedUrl, "The semantic date range was resolved correctly.");
        });
    });

    QUnit.test("Returns the information that semantic date ranges were found in the URL", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(BankStatementStatus eq '2' or BankStatementStatus eq '7') and (IsActiveEntity eq true) and (PostingDate eq {Edm.String%%DynamicDate.YESTERDAY%%})";

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
            .then((oResultObject) => {
                // Assert
                assert.strictEqual(oResultObject.hasSemanticDateRanges, true, "The flag was returned correctly.");

            });

    });

    QUnit.test("Returns the information that no semantic date ranges were found in the URL", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(BankStatementStatus eq '2' or BankStatementStatus eq '7') and (IsActiveEntity eq true)";

            // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
            .then((oResultObject) => {
                // Assert
                assert.strictEqual(oResultObject.hasSemanticDateRanges, false, "The flag was returned correctly.");

            });
    });

    QUnit.test("Returns unknown placeholders as ignored references", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(PostingDate eq {Edm.String%%Unknown%%})";

        const aExpectedIgnoredReferences = ["Unknown"];

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
            .then((oResultObject) => {

            // Assert
            assert.deepEqual(oResultObject.ignoredReferences, aExpectedIgnoredReferences, "The unknown reference was ignored as expected.");
            });
    });

    QUnit.test("Returns falsely placed placeholders as ignored references", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement{Edm.String%%DynamicDate.TODAY%%}/$count?" +
            "$filter=(PostingDate eq {Edm.String%%DynamicDate.TODAY%%})";

        const aExpectedIgnoredReferences = ["DynamicDate.TODAY"];

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
        .then((oResultObject) => {

            // Assert
            assert.deepEqual(oResultObject.ignoredReferences, aExpectedIgnoredReferences, "The unknown reference was ignored as expected.");
        });
    });

    QUnit.test("Returns placeholders with unknown EdmType as invalid semantic dates", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(PostingDate eq {Edm.Unknown%%DynamicDate.TODAY%%})";

        const aExpectedInvalidSemanticDates = ["DynamicDate.TODAY"];

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
        .then((oResultObject) => {

        // Assert
        assert.deepEqual(oResultObject.invalidSemanticDates, aExpectedInvalidSemanticDates, "The invalid semantic date range was returned correctly.");
        });
    });

    QUnit.test("Returns placeholders with no EdmType as invalid semantic dates", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FINS_TRR_MONITOR_SRV/C_Trrmonitor(P_KeyDate={%%DynamicDate.TODAY%%},P_ToFiscalYearPeriod=%2701.2018%27)/Results/$count";

        const aExpectedInvalidSemanticDates = ["DynamicDate.TODAY"];

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
        .then((oResultObject) => {

        // Assert
        assert.deepEqual(oResultObject.invalidSemanticDates, aExpectedInvalidSemanticDates, "The invalid semantic date range was returned correctly.");
        });
    });

    QUnit.test("Returns placeholders with unknown operator as invalid semantic dates", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(PostingDate eq {Edm.String%%DynamicDate.Unknown%%})";

        const aExpectedInvalidSemanticDates = ["DynamicDate.Unknown"];

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
        .then((oResultObject) => {

            // Assert
        assert.deepEqual(oResultObject.invalidSemanticDates, aExpectedInvalidSemanticDates, "The invalid semantic date range was returned correctly.");
        });
    });

    QUnit.test("Returns placeholders with unknown operator values as invalid semantic dates", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(ValidityEndDateForEdit ge {Edm.DateTime%%DynamicDate.TODAYFROMTO.x.5.start%%} and ValidityEndDateForEdit le {Edm.DateTime%%DynamicDate.TODAYFROMTO.1.end%%})&$select=";

        const aExpectedInvalidSemanticDates = ["DynamicDate.TODAYFROMTO.x.5.start", "DynamicDate.TODAYFROMTO.1.end"];

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
        .then((oResultObject) => {
            // Assert
            assert.deepEqual(oResultObject.invalidSemanticDates, aExpectedInvalidSemanticDates, "The invalid semantic date range was returned correctly.");
        });
    });

    QUnit.test("Returns placeholders with invalid operator positions as invalid semantic dates", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(ValidityEndDateForEdit ge {Edm.DateTime%%DynamicDate.TODAYFROMTO.2.5.ssSart%%} and ValidityEndDateForEdit le {Edm.DateTime%%DynamicDate.TODAYFROMTO.2.5.ed%%})&$select=";

        const aExpectedInvalidSemanticDates = ["DynamicDate.TODAYFROMTO.2.5.ssSart", "DynamicDate.TODAYFROMTO.2.5.ed"];

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
        .then((oResultObject) => {
            // Assert
            assert.deepEqual(oResultObject.invalidSemanticDates, aExpectedInvalidSemanticDates, "The invalid semantic date range was returned correctly.");
        });
    });

    QUnit.test("Rejects the promise if no OData version is provided", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?$filter=(PostingDate eq {Edm.String%%DynamicDate.YESTERDAY%%})";

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl)
            .catch(() => {
                // Assert
                assert.ok(true, "The Promise was rejected");
            });
    });

    QUnit.test("Rejects the promise if an invalid OData version is provided", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?$filter=(PostingDate eq {Edm.String%%DynamicDate.YESTERDAY%%})";

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "3.0")
            .catch(() => {
                // Assert
                assert.ok(true, "The Promise was rejected");
            });
    });

    QUnit.test("Logs some debug messages", function (assert) {
        // Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
        "$filter=(BankStatementStatus eq '2' or BankStatementStatus eq '7') and (IsActiveEntity eq true) and (PostingDate eq {Edm.String%%DynamicDate.YESTERDAY%%})";

        const oLogDebugStub = sandbox.stub(Log, "debug");
        sandbox.stub(Log, "getLevel").returns(Log.Level.DEBUG);

        // Act
        return this.oReferenceResolver.resolveSemanticDateRanges(sUrl, "2.0")
        .then((oResultObject) => {

        // Assert
        assert.ok(oLogDebugStub.args[0][0], "Method 'debug' was called and some logs have been printed");
        });
    });

    QUnit.module("The method hasSemanticDateRanges", {
        beforeEach: function () {
            this.oReferenceResolver = new ReferenceResolver();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns true if the URL contains semantic date ranges", function (assert) {
        //Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
        "$filter=(BankStatementStatus eq '2' or BankStatementStatus eq '7') and (IsActiveEntity eq true) and (PostingDate eq {Edm.String%%DynamicDate.YESTERDAY%%})";

        //Act
        const bResult = this.oReferenceResolver.hasSemanticDateRanges(sUrl);

        //Assert
        assert.strictEqual(bResult, true, "Semantic date ranges were found");
    });

    QUnit.test("Returns true if the URL contains broken semantic date ranges", function (assert) {
        //Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(PostingDate eq {Edm.String%%DynamicDate.Unknown%%})";

        //Act
        const bResult = this.oReferenceResolver.hasSemanticDateRanges(sUrl);

        //Assert
        assert.strictEqual(bResult, true, "Semantic date ranges were found");
    });

    QUnit.test("Returns true if the URL contains semantic date ranges in a valid and an invalid position", function (assert) {
        //Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement{Edm.String%%DynamicDate.TODAY%%}/$count?" +
            "$filter=(PostingDate eq {Edm.String%%DynamicDate.TODAY%%})";

        //Act
        const bResult = this.oReferenceResolver.hasSemanticDateRanges(sUrl);

        //Assert
        assert.strictEqual(bResult, true, "Semantic date ranges were found");
    });

    QUnit.test("Returns false if the URL does not contain semantic date ranges", function (assert) {
        //Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
        "$filter=(BankStatementStatus eq '2' or BankStatementStatus eq '7') and (IsActiveEntity eq true)";

        //Act
        const bResult = this.oReferenceResolver.hasSemanticDateRanges(sUrl);

        //Assert
        assert.strictEqual(bResult, false, "No semantic date ranges were found");
    });

    QUnit.test("Returns false if the URL contains semantic date ranges only in an invalid position", function (assert) {
        //Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement{Edm.String%%TODAY%%}/$count?" +
            "$filter=(BankStatementStatus eq '2' or BankStatementStatus eq '7') and (IsActiveEntity eq true)";

        //Act
        const bResult = this.oReferenceResolver.hasSemanticDateRanges(sUrl);

        //Assert
        assert.strictEqual(bResult, false, "No semantic date ranges were found");
    });

    QUnit.test("Returns false if the URL contains any other unknown placeholders", function (assert) {
        //Arrange
        const sUrl = "/sap/opu/odata/sap/FAR_MANAGE_BS_SRV/C_Arbankstatement/$count?" +
            "$filter=(PostingDate eq {Edm.String%%Unknown%%})";

        //Act
        const bResult = this.oReferenceResolver.hasSemanticDateRanges(sUrl);

        //Assert
        assert.strictEqual(bResult, false, "No semantic date ranges were found");
    });

    QUnit.test("Returns false if the URL is an empty string", function (assert) {
        //Arrange
        const sUrl = "";

        //Act
        const bResult = this.oReferenceResolver.hasSemanticDateRanges(sUrl);

        //Assert
        assert.strictEqual(bResult, false, "No semantic date ranges were found");
    });

    QUnit.test("Returns false if no URL is passed", function (assert) {
        //Arrange
        let sUrl;

        //Act
        const bResult = this.oReferenceResolver.hasSemanticDateRanges(sUrl);

        //Assert
        assert.strictEqual(bResult, false, "No semantic date ranges were found");
    });
});
