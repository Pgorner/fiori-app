// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/* eslint max-len: ["error", { "code": 500 }] */

/**
 * @fileOverview QUnit tests for resolveHashFragment method of ClientSideTargetResolution
 */
sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/ui/core/Supportability",
    "sap/ushell/Container",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/test/utils",
    "sap/ushell/utils",
    "sap/ushell/services/ClientSideTargetResolution",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/test/services/ClientSideTargetResolution/TestHelper",
    "sap/ushell/Config",
    "sap/base/Log",
    "sap/base/util/deepExtend",
    "sap/ushell/ApplicationType",
    "sap/base/util/isEmptyObject",
    "sap/ushell/ApplicationType/urlTemplateResolution",
    "sap/ushell/ApplicationType/systemAlias"
], function (
    Localization,
    Supportability,
    Container,
    jQuery,
    testUtils,
    utils,
    ClientSideTargetResolution,
    oAppConfiguration,
    oTestHelper,
    Config,
    Log,
    deepExtend,
    ApplicationType,
    isEmptyObject,
    urlTemplateResolution,
    SystemAlias
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    /*
     * A complete resolveHashFragment test, mocking only AppState.
     * Checks that everything works semantically together (black box).
     */

    /*
     * generate a string of around iCnt characters
     */
    function genStr (sStr, iCnt) {
        var s = sStr;
        while (s.length < iCnt) {
            s = s + sStr;
        }
        return s;
    }

    var O_KNOWN_SYSTEM_ALIASES = {
        LOCAL_SYSTEM: oTestHelper.getLocalSystemAlias(),
        UR3CLNT120: oTestHelper.createSystemAlias({
            client: "120",
            http: oTestHelper.createHttpConnection("example.corp.com", 50055),
            https: oTestHelper.createHttpConnection("example.corp.com", 44355),
            rfc: oTestHelper.createRfcConnection("", "example.corp.com", 3255, "PUBLIC", "p/secude:CN=UR3, O=SAP-AG, C=DE", "8")
        }),
        SYSCONNSTRING: oTestHelper.createSystemAlias({
            https: oTestHelper.createHttpConnection("example.corp.com", 44355),
            rfc: oTestHelper.createRfcConnection("", "/H/Coffee/S/Decaf/G/Roast", 3255, "", "p/secude:CN=UR3, O=SAP-AG, C=DE", "8"),
            client: "120"
        }),
        SYS_RFC_SYSID: oTestHelper.createSystemAlias({
            https: oTestHelper.createHttpConnection("test.example.corp.com", 44355),
            rfc: oTestHelper.createRfcConnection("UR7", "example.corp.com", 3255, "PUBLIC", "p/secude:CN=UR3, O=SAP-AG, C=DE", "8"),
            client: "120"
        }),
        SYS_WITH_PATH: oTestHelper.createSystemAlias({
            https: oTestHelper.createHttpConnection("vmw.example.corp.com", 44335, "/go-to/the/moon"),
            client: "111"
        }),
        SYS_IT_NO_R3: oTestHelper.createSystemAlias({
            https: oTestHelper.createHttpConnection("example.corp.com", 44355),
            rfc: oTestHelper.createRfcConnection("UR3", "ldcsuv2", 32, "SPACE", "", ""),
            client: "815",
            language: "IT"
        }),
        ALIASRFC: oTestHelper.createSystemAlias({
            https: oTestHelper.createHttpConnection("example.corp.com", 1111, "/path"),
            rfc: oTestHelper.createRfcConnection("UV2", "ldcsuv2", 32, "SPACE", "p/secude:CN=UXR, O=SAP-AG, C=DE", "9"),
            client: "220",
            language: ""
        }),
        ALIASRFC_IT: oTestHelper.createSystemAlias({
            https: oTestHelper.createHttpConnection("example.corp.com", 44355),
            rfc: oTestHelper.createRfcConnection("UR3", "ldcsuv2", 32, "SPACE", "p/secude:CN=UXR, O=SAP-AG, C=DE", "9"),
            client: "815",
            language: "IT"
        }),
        // typical system alias defined in HCP
        EMPTY_PORT_PREFIX_RFC: oTestHelper.createSystemAlias({
            http: undefined,
            https: oTestHelper.createHttpConnection("system.our.domain.corp"),
            rfc: {}
        }),
        MULTIPLE_INVALID_FIELDS: oTestHelper.createSystemAlias({
            http: oTestHelper.createHttpConnection(123, "", "/go-to/the/moon"), //not correct host, port as string is ok
            https: {
                port: [44355],
                pathPrefix: 456
            }, //host not provided, port should be string or number, path should be string
            rfc: {}
        }),
        ONLY_RFC: {
            client: "",
            rfc: oTestHelper.createRfcConnection("SYS", "ldcisys", 32, "SPACE", "", "")
        }
    };

    var O_CDM3_TEMPLATE_NOTIONS = {
        _baseUrl: "{join() &_destProtocol,'://',&_destHost,':',&_destPort,&_destPrefix}",
        _destName: "{or sap-system,./sap.app/destination}",
        _destProtocolHttps: "{and /systemAliases/{&_destName}/https,'https'}",
        _destProtocolHttp: "{and /systemAliases/{&_destName}/http,'http'}",
        _destProtocol: "{or &_destProtocolHttps,&_destProtocolHttp}",
        _destHost: "{/systemAliases/{&_destName}/{&_destProtocol}/host}",
        _destPort: "{or /systemAliases/{&_destName}/{&_destProtocol}/port,''}",
        _destHasNoAppRuntime: "{not &appRuntime}",
        _destDefaultToAbapPrefix: "{or &_destHasNoAppRuntime,&isAppRuntimeAbap}",
        _destDefaultPrefix: "{and &_destDefaultToAbapPrefix,'/sap/bc'}",
        _destPrefix: "{if({/systemAliases/{&_destName}/{&_destProtocol}/pathPrefix}) /systemAliases/{&_destName}/{&_destProtocol}/pathPrefix,&_destDefaultPrefix}",
        _destIsLoadBalancing: "{and /systemAliases/{&_destName}/rfc/systemId}",
        _destIsNotLoadBalancing: "{not &_destIsLoadBalancing}",
        _destHostIsConnectString: "{match(^[/][HGMR][/].*) /systemAliases/{&_destName}/rfc/host}",
        _startupParameters: "{*|match(^(?!sap-(system\\|(ushell-navmode))$))}"
    };

    var O_CDM3_SAMPLE_SITE = {
        systemAliases: {
            fiori_blue_box: {
                https: {
                    id: "fiori_blue_box_HTTPS",
                    host: "tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com",
                    pathPrefix: ""
                },
                id: "fiori_blue_box",
                client: "000",
                language: "IT"
            },
            legacy_blue_box: {
                https: {
                    id: "legacy_blue_box_HTTPS",
                    host: "tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com",
                    pathPrefix: ""
                },
                rfc: {
                    id: "legacy_blue_box",
                    systemId: "",
                    host: "example.corp.com",
                    service: "3255",
                    loginGroup: "",
                    sncNameR3: "p/secude:CN=EXAMPLE, O=SAP-AG, C=DE",
                    sncQoPR3: "8"
                },
                id: "legacy_blue_box",
                client: "120",
                language: "DE"
            }
        }
    };

    var O_CDM3_TEMPLATE_FIORI = {
        appPlatform: "{./sap.integration/urlTemplateParams/appPlatform}",
        isAppRuntimeNeo: "{match(^NEO$) &appPlatform}",
        isAppRuntimeAbap: "{match(^ABAP$) &appPlatform}",
        isAppRuntimeCf: "{match(^CF$) &appPlatform}",
        appRuntimeAbap: "{if({&isAppRuntimeAbap}) '/ui2/flp/ui5appruntime.html'}",
        appRuntimeCf: "{if({&isAppRuntimeCf}) '/ui5appruntime.html'}",
        appRuntimeNeo: "{if({&isAppRuntimeNeo}) '/sap/fiori/fioriappruntime'}",
        appRuntime: "{or &appRuntimeAbap,&appRuntimeCf,&appRuntimeNeo}",
        startupParameters: "{*|match(^(?!sap-(system\\|(ushell-navmode))$))|join(&,=)}",
        originalHash: "{url(hash)}",
        hashWithoutInnerRoute: "{replace(&[\\/].*$,) &originalHash}",
        innerAppRouteValue: "{or &innerAppRoute:.,sap-ushell-innerAppRoute}",
        innerAppRouteValuePrefixed: "{join '&/',&innerAppRouteValue}",
        innerAppRoute: "{and &innerAppRouteValue,&innerAppRouteValuePrefixed}",
        appId: {
            value: "{./sap.integration/urlTemplateParams/appId}",
            renameTo: "sap-ui-app-id"
        },
        sapUiDebug: {
            renameTo: "sap-ui-debug",
            value: "{if({&env:isDebugMode}) &env:isDebugMode}"
        },
        _appIdCapability: "{or ./sap.fiori/registrationIds/0,&appId}",
        _technicalAppComponentIdCapability: "{&appId}"
    };

    /*
     * Checks whether the expected warnings and errors were logged on the
     * console, taking the expectations from the given test fixture, which
     * should be defined as follows:
     *
     * {
     *   ... rest of the fixture...
     *
     *   expectedWarningCalls: [
     *      [   // arguments of the first call
     *          "1stArg",
     *          "2ndArg",
     *          "3rdArg"
     *      ],
     *      ... more items if more calls are expected
     *   ],
     *   expectedErrorCalls: []  // 0 calls to Log.error expected
     * }
     *
     * NOTE:
     * - If the given fixture does not specify the 'expectedWarningCalls' and
     *   'expectedErrorCalls' keys, no test will be executed.
     * - Log.error and Log.warning should have been
     *   already stubbed before this function is called.
     */
    function testExpectedErrorAndWarningCalls (assert, oFixture) {
        if (oFixture.hasOwnProperty("expectedErrorCalls")) {
            var aExpectedErrorCalls = (oFixture.expectedErrorCalls || []);

            assert.strictEqual(Log.error.callCount, aExpectedErrorCalls.length, "Log.error was called the expected number of times");

            if (aExpectedErrorCalls.length > 0) {
                assert.deepEqual(Log.error.args, aExpectedErrorCalls, "Log.error logged the expected errors");
            }
        }

        if (oFixture.hasOwnProperty("expectedWarningCalls")) {
            var aExpectedWarningCalls = (oFixture.expectedWarningCalls || []);

            assert.strictEqual(Log.warning.callCount, aExpectedWarningCalls.length, "Log.warning was called the expected number of times");

            if (aExpectedWarningCalls.length > 0) {
                assert.deepEqual(Log.warning.args, aExpectedWarningCalls, "Log.warning logged the expected warnings");
            }
        }
    }

    function createServiceAsync (oArgs) {
        var oConfiguration = (oArgs || {}).configuration;
        var aInbounds = (oArgs || {}).inbounds || [];
        var oAdapter = (oArgs || {}).adapter;

        if (!oAdapter) {
            // create fake adapter
            oAdapter = {
                getInbounds: sandbox.stub().returns(
                    new jQuery.Deferred().resolve(aInbounds).promise()
                )
            };
        }

        var oUshellConfig = testUtils.overrideObject({}, {
            "/services/ClientSideTargetResolution": oConfiguration
        });

        return testUtils.resetConfigChannel(oUshellConfig).then(function () {
            return new ClientSideTargetResolution(
                oAdapter,
                null,
                null,
                oConfiguration
            );
        });
    }

    function generateDefault (sValue, oExtended) {
        return {
            value: sValue,
            extendedValue: oExtended
        };
    }

    function generateEqExtendedDefault (sHighValue) {
        return {
            Ranges: [{
                Sign: "I",
                Option: "EQ",
                Low: sHighValue,
                High: null
            }]
        };
    }

    var aTestCases = [{
        testDescription: "#1 Full local webgui resolution with intent parameters",
        intent: "SpoolRequest-display?JobCount=pYRJlwlG&JobName=FA163E2CC4811ED6BCD8CCCFB7A47242",
        oKnownSapSystemData: {
            // Mocks expansions from ClientSideTargetResolutionAdapter#resolveSystemAlias
            SYSRFCSYSID: O_KNOWN_SYSTEM_ALIASES.SYS_RFC_SYSID
        },
        inbound: {
            semanticObject: "SpoolRequest",
            action: "display",
            title: "Display Spoolrequests",
            resolutionResult: {
                componentProperties: {
                    url: "/sap/bc/gui/sap/its/webgui;~sysid=UXV;~service=3200?%7etransaction=SP01_SIMPLE&%7enosplash=1",
                    siteId: "4fbb8326-f630-497b-83c5-6cf48371715d",
                    appId: "X-SAP-UI2-ADCAT:SAP_NW_BE_APPS:NW:005056AB5B8D1EE5BFAFFCA268719CAF_TM"
                },
                "sap.platform.runtime": {
                    componentProperties: {
                        url: "/sap/bc/gui/sap/its/webgui;~sysid=UXV;~service=3200?%7etransaction=SP01_SIMPLE&%7enosplash=1",
                        siteId: "4fbb8326-f630-497b-83c5-6cf48371715d",
                        appId: "X-SAP-UI2-ADCAT:SAP_NW_BE_APPS:NW:005056AB5B8D1EE5BFAFFCA268719CAF_TM"
                    }
                },
                "sap.gui": {
                    _version: "1.2.0",
                    transaction: "SP01_SIMPLE"
                },
                applicationType: "TR",
                systemAlias: "SYSRFCSYSID",
                text: "Display Spoolrequests",
                url: "https://domain.example.it:44300/sap/bc/gui/sap/its/webgui;?%7etransaction=SP01_SIMPLE&%7enosplash=1&sap-client=910&sap-language=EN"
            },
            deviceTypes: {
                desktop: true,
                tablet: false,
                phone: false
            },
            signature: {
                additionalParameters: "allowed",
                parameters: {
                    DYNP_OKCODE: { required: false, renameTo: "SSCRFIELDS-UCOMM", defaultValue: { value: "ONLI" } },
                    JobCount: { required: true, renameTo: "JOBCOUNT" },
                    JobName: { required: true, renameTo: "JOBNAME" }
                }
            },
            tileResolutionResult: {
                title: "Display Spoolrequests",
                tileComponentLoadInfo: "#Shell-staticTile",
                isCustomTile: false
            }
        },
        expectedUrl: "https://test.example.corp.com:44355/sap/bc/gui/sap/its/webgui;" +
            "~sysid=UR7;~loginGroup=PUBLIC;~messageServer=p%2fsecude%3aCN%3dUR3%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncNameR3=p%2fsecude%3aCN%3dUR3%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=8?" +
            "%7etransaction=*SP01_SIMPLE%20JOBCOUNT%3dpYRJlwlG%3bJOBNAME%3dFA163E2CC4811ED6BCD8CCCFB7A47242%3bSSCRFIELDS-UCOMM%3dONLI%3b&%7enosplash=1&sap-client=120&sap-language=en&sap-iframe-hint=GUI"
    }, {
        // see BCP: 466862 / 2017 .
        testDescription: "#2 URI with sap-system",
        intent: "NZPayroll-display?sap-system=NW", // sap-system is not applied to URIs
        inbound: oTestHelper.createInbound("#NZPayroll-display{<no params><+>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "sap-nwbc://https://some-pt.it.something.net/nwbc/~roletest/ABCDEFGHIL_NWBC_NZ_PAYROLL_MGR",
            systemAlias: ""
        }),
        expectedUrl: "sap-nwbc://https://some-pt.it.something.net/nwbc/~roletest/ABCDEFGHIL_NWBC_NZ_PAYROLL_MGR"
    }, {
        // see BCP: 466862 / 2017 .
        testDescription: "#3 URI without sap-system",
        intent: "NZPayroll-display",
        inbound: oTestHelper.createInbound("#NZPayroll-display{<no params><+>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "sap-nwbc://https://some-pt.it.something.net/nwbc/~roletest/ABCDEFGHIL_NWBC_NZ_PAYROLL_MGR",
            systemAlias: ""
        }),
        expectedUrl: "sap-nwbc://https://some-pt.it.something.net/nwbc/~roletest/ABCDEFGHIL_NWBC_NZ_PAYROLL_MGR"
    }, {
        testDescription: "#4 UI5 with absent URL",
        intent: "Action-toui5absenturl",
        inbound: oTestHelper.createInbound("#Action-toui5absenturl{<no params><+>}", {
            applicationType: "SAPUI5",
            additionalInformation: "",
            text: "UI5 App Without URL",
            // NOTE: "url" is absent
            systemAlias: ""
        }),
        expectedResolve: true,
        expectedUrl: ""
    }, {
        testDescription: "#5 UI5 with empty URL",
        intent: "Action-toui5nourl",
        inbound: oTestHelper.createInbound("#Action-toui5nourl{<no params><+>}", {
            applicationType: "SAPUI5",
            additionalInformation: "",
            text: "UI5 App Without URL",
            url: "", // NOTE: empty URL
            systemAlias: ""
        }),
        expectedResolve: true,
        expectedUrl: ""
    }, {
        testDescription: "#6 UI5 with undefined URL",
        intent: "Action-toui5nourl",
        inbound: oTestHelper.createInbound("#Action-toui5nourl{<no params><+>}", {
            applicationType: "SAPUI5",
            additionalInformation: "",
            text: "UI5 App Without URL",
            url: undefined,
            systemAlias: "",
            applicationDependencies: {
                manifestUrl: "/some/url" // NOTE: url specified here
            }
        }),
        expectedResolve: true,
        expectedUrl: ""
    }, {
        testDescription: "#7 UI5 with no URL and manifestUrl specified in applicationDependencies",
        intent: "Action-toui5nourl",
        inbound: oTestHelper.createInbound("#Action-toui5nourl{<no params><+>}", {
            applicationType: "SAPUI5",
            additionalInformation: "",
            text: "UI5 App Without URL",
            systemAlias: "",
            applicationDependencies: {
                manifestUrl: "/some/url"
            }
        }),
        expectedResolve: true,
        expectedUrl: ""
    }, {
        testDescription: "#8 UI5 with both URL and manifestUrl specified in applicationDependencies",
        intent: "Action-toui5nourl",
        inbound: oTestHelper.createInbound("#Action-toui5nourl{<no params><+>}", {
            applicationType: "SAPUI5",
            additionalInformation: "",
            text: "UI5 App Without URL",
            url: "/some/url/1",
            systemAlias: "",
            applicationDependencies: {
                manifestUrl: "/some/url2"
            }
        }),
        expectedResolve: true,
        expectedUrl: "/some/url/1" // URL is not empty
    }, {
        testDescription: "#9 Transaction SU01 via designer",
        intent: "Action-case1",
        inbound: oTestHelper.createInbound("#Action-case1{[undefined:]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "SU01",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#10 Transaction SU01 via designer with 'sap', '~', and neutral default parameters",
        intent: "Action-case2",
        inbound: oTestHelper.createInbound("#Action-case2{[sap-theme:[sap_hcb]],[~PARAM:[tilde]],[NeutralParam:[neutral]]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "SU01",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01%20NEUTRALPARAM%3dneutral%3b&%7enosplash=1&sap-client=120&sap-language=EN&sap-theme=sap_hcb&%7ePARAM=tilde&sap-iframe-hint=GUI"
    }, {
        testDescription: "#11 Transaction SU01 via LPD_CUST",
        intent: "Action-case3",
        inbound: oTestHelper.createInbound("#Action-case3{[undefined:]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "User Maintenance WebGUI",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#12 Transaction SU01 via LPD_CUST + batch input",
        intent: "Action-case4",
        inbound: oTestHelper.createInbound("#Action-case4{[undefined:]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Test4",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#13 Transaction SU01 via LPD_CUST + batch input + parameter mappings",
        intent: "Action-case5",
        inbound: {
            semanticObject: "Action",
            action: "case5",
            id: "Action-case5~6Nm",
            title: "Test5",
            resolutionResult: {
                applicationType: "TR",
                additionalInformation: "",
                text: "Test5",
                url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                systemAlias: ""
            },
            deviceTypes: {
                desktop: true,
                tablet: true,
                phone: true
            },
            signature: {
                additionalParameters: "allowed",
                parameters: {
                    pfrom: { defaultValue: { value: "pfrom_value", format: "plain" }, required: false },
                    tildefrom: { defaultValue: { value: "tildefrom_value", format: "plain" }, required: false },
                    "sap-from": { defaultValue: { value: "sapfrom_value", format: "plain" }, required: false },
                    PFROM1: { renameTo: "SAP-THEME" },
                    "SAP-FROM": { renameTo: "SAP-TO" },
                    TILDEFROM: { renameTo: "~TILDETO" }
                }
            }
        },
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01%20PFROM%3dpfrom_value%3bTILDEFROM%3dtildefrom_value%3b&%7enosplash=1&sap-client=120&sap-from=sapfrom_value&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#14 Transaction SU01 direct with defaulted DYNP_OKCODE and parameters : with OKCODE",
        intent: "Action-case5?p1=ABC",
        inbound: oTestHelper.createInbound("#Action-case5{DYNP_OKCODE:[STARTME]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Test5",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01%20DYNP_OKCODE%3dSTARTME%3bP1%3dABC%3b&%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#15 Transaction SU01 direct with required DYNP_NO1ST parameter (but default value)",
        intent: "Action-case5",
        inbound: oTestHelper.createInbound("#Action-case5{DYNP_NO1ST:[1]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Test5",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01%20DYNP_NO1ST%3d1%3b&%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#16 Transaction SU01 with default DYNP_NO1ST parameter only",
        intent: "Action-case5",
        inbound: oTestHelper.createInbound("#Action-case5{[DYNP_NO1ST:[1]]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Test5",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#17 Transaction SU01 direct with defaulted DYNP_OKCODE and DYNP_NO1ST parameters : with OKCODE",
        intent: "Action-case5?p1=ABC",
        inbound: oTestHelper.createInbound("#Action-case5{DYNP_OKCODE:[STARTME],[DYNP_NO1ST:[SKIPPMEDURINGBACK]]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Test5",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01%20DYNP_NO1ST%3dSKIPPMEDURINGBACK%3bDYNP_OKCODE%3dSTARTME%3bP1%3dABC%3b&%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#18 Transaction SU01 direct with defaulted DYNP_OKCODE but no parameters: no OKCODE",
        intent: "Action-case5",
        inbound: oTestHelper.createInbound("#Action-case5{[DYNP_OKCODE:[STARTME]]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Test5",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#19 Transaction SU01 direct with defaulted DYNP_OKCODE and DYNP_NO1ST but no parameters: no OKCODE",
        intent: "Action-case5",
        inbound: oTestHelper.createInbound("#Action-case5{[DYNP_OKCODE:[STARTME]],[DYNP_NO1ST:[SKIP_ME]]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Test5",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#20 Transaction SU01 direct with defaulted DYNP_NO1ST but no parameters: no OKCODE",
        intent: "Action-case5",
        inbound: oTestHelper.createInbound("#Action-case5{[DYNP_OKCODE:[STARTME]],[DYNP_NO1ST:[SKIP_ME]]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Test5",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#21 Transaction SU01 direct with defaulted DYNP_NO1ST but no parameters: no OKCODE, wrapped case",
        intent: "Action-case5",
        inbound: oTestHelper.createInbound("#Action-case5{[DYNP_OKCODE:[STARTME]]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Test5",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3dD%25N%3bP_OBJECT%3d%3bP_OKCODE%3dO%3fK%25A%2fI%3bP_PRGRAM%3dPROGRAM%7e1%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?" +
            "%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3dD%25N%3bP_OBJECT%3dDYNP_OKCODE%2521STARTME%3bP_OKCODE%3dO%3fK%25A%2fI%3bP_PRGRAM%3dPROGRAM%7e1%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#22 Transaction SU01 direct with defaulted DYNP_OKCODE but no parameters (only sap- parameters): no OKCODE",
        intent: "Action-case5",
        inbound: oTestHelper.createInbound("#Action-case5{[sap-from:[sapfrom_value]],[DYNP_OKCODE:[STARTME]]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Test5",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-from=sapfrom_value&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#23 Transaction SU01 direct with defaulted DYNP_OKCODE but required : with OKCODE",
        intent: "Action-case5",
        inbound: oTestHelper.createInbound("#Action-case5{DYNP_OKCODE:[STARTME]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Test5",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01%20DYNP_OKCODE%3dSTARTME%3b&%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#24 Transaction SU01 direct with supplied Dynp_OkCode but no parameters: no OKCODE",
        intent: "Action-case5?Dynp_OkCode=GO1234",
        inbound: oTestHelper.createInbound("#Action-case5{<no params><+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Test5",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#25 Transaction SU01 direct with supplied Dynp_OkCode but and parameters: with OKCODE",
        intent: "Action-case5?Dynp_OkCode=GO1234&ABC=DEF",
        inbound: oTestHelper.createInbound("#Action-case5{<no params><+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Test5",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01%20ABC%3dDEF%3bDYNP_OKCODE%3dGO1234%3b&%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#26 Transaction SU01 via LPD_CUST + batch input + parameter mappings + Not completed by COMMIT",
        intent: "Action-case6",
        inbound: {
            semanticObject: "Action",
            action: "case6",
            id: "Action-case6~6Nn",
            title: "Test6",
            resolutionResult: {
                applicationType: "TR",
                additionalInformation: "",
                text: "Test6",
                url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3dD%25N%3bP_OBJECT%3d%3bP_OKCODE%3dO%3fK%25A%2fI%3bP_PRGRAM%3dPROGRAM%7e1%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
                systemAlias: ""
            },
            deviceTypes: {
                desktop: true,
                tablet: true,
                phone: true
            },
            signature: {
                additionalParameters: "allowed",
                parameters: {
                    pfrom: { defaultValue: { value: "pfrom_value", format: "plain" }, required: false },
                    tildefrom: { defaultValue: { value: "tildefrom_value", format: "plain" }, required: false },
                    "sap-from": { defaultValue: { value: "sapfrom_value", format: "plain" }, required: false },
                    PFROM1: { renameTo: "SAP-THEME" },
                    "SAP-FROM": { renameTo: "SAP-TO" },
                    TILDEFROM: { renameTo: "~TILDETO" }
                }
            }
        },
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?" +
            "%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3dD%25N%3bP_OBJECT%3dpfrom%2521pfrom_value%2525sap-from%2521sapfrom_value%2525tildefrom%2521tildefrom_value%3bP_OKCODE%3dO%3fK%25A%2fI%3bP_PRGRAM%3dPROGRAM%7e1%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&" +
            "%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#27 Transaction SU01 via Designer + sap-parameter called with intent sap-parameter with different value.",
        intent: "Action-case7?sap-parameter=valueB",
        inbound: oTestHelper.createInbound("#Action-case7{[sap-parameter:[valueA]]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Case 7",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-parameter=valueB&sap-iframe-hint=GUI"
    }, {
        testDescription: "#28 Transaction SU01 via LPD_CUST + sap- forced parameter in LPD_CUST",
        intent: "Action-case8",
        inbound: oTestHelper.createInbound("#Action-case8{[undefined:]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Test8",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01%20%3d&%7enosplash=1&sap-theme=sap_gemstone&sap-fiori=1&%7eWEBGUI_ICON_TOOLBAR=0&sap-personas-runmode=0&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&%7eWEBGUI_ICON_TOOLBAR=0&sap-client=120&sap-fiori=1&sap-language=EN&sap-personas-runmode=0&sap-theme=sap_gemstone&sap-iframe-hint=GUI"
    }, {
        testDescription: "#29 Transaction SU01 via Designer + forbidden parameters",
        intent: "Action-case8b",
        inbound: oTestHelper.createInbound("#Action-case8b{[sap-Wd-run-SC:[1]],[sap-wd-auTo-detect:[1]],[sap-EP-version:[1.32]],[sap-theme:[sap_hcc]]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Case 8b native url",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-theme=sap_hcc&sap-iframe-hint=GUI"
    }, {
        testDescription: "#30 WebGui transaction via full url generation (sap.gui in resolution result)",
        oKnownSapSystemData: {
            SYSRFCSYSID: O_KNOWN_SYSTEM_ALIASES.SYS_RFC_SYSID
        },
        intent: "Action-case10",
        inbound: oTestHelper.createInbound("#Action-case10{[undefined:]<+>}", {
            applicationType: "TR",
            "sap.gui": {
                transaction: "SU01"
            },
            text: "Test 10",
            systemAlias: "SYSRFCSYSID"
        }),
        expectedUrl:
            "https://test.example.corp.com:44355/sap/bc/gui/sap/its/webgui;~sysid=UR7;~loginGroup=PUBLIC;~messageServer=p%2fsecude%3aCN%3dUR3%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncNameR3=p%2fsecude%3aCN%3dUR3%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=8?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=en&sap-iframe-hint=GUI"
    }, {
        testDescription: "#31 WDA transaction via full url generation",
        intent: "Action-case10",
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        inbound: oTestHelper.createInbound("#Action-case10{[undefined:]<+>}", {
            applicationType: "WDA",
            "sap.wda": {
                applicationId: "WDAONE"
            },
            text: "Test 10",
            systemAlias: "UR3CLNT120"
        }),
        expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDAONE/?sap-client=120&sap-language=en&sap-iframe-hint=NWBC"
    }, {
        testDescription: "#32 WDA Compatibility mode true - generate wrapped NWBC url",
        intent: "Action-case10",
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        inbound: oTestHelper.createInbound("#Action-case10{[undefined:]<+>}", {
            applicationType: "WDA",
            "sap.wda": {
                applicationId: "WDAONE",
                compatibilityMode: true
            },
            text: "Test 10",
            systemAlias: "UR3CLNT120"
        }),
        expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDAONE/?sap-client=120&sap-language=en&sap-iframe-hint=NWBC"
    }, {
        testDescription: "#33 WDA Compatibility mode false - generate standalone WDA url ",
        intent: "Action-case10",
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        inbound: oTestHelper.createInbound("#Action-case10{[undefined:]<+>}", {
            applicationType: "WDA",
            "sap.wda": {
                applicationId: "WDAONE",
                compatibilityMode: false
            },
            text: "Test 10",
            systemAlias: "UR3CLNT120"
        }),
        expectedUrl: "https://example.corp.com:44355/sap/bc/webdynpro/sap/WDAONE?sap-client=120&sap-language=en&sap-iframe-hint=WDA"
    }, {
        testDescription: "#34 WDA Compatibility mode undefined - generate wrapped NWBC url",
        intent: "Action-case10",
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        inbound: oTestHelper.createInbound("#Action-case10{[undefined:]<+>}", {
            applicationType: "WDA",
            "sap.wda": {
                applicationId: "WDAONE"
            },
            text: "Test 10",
            systemAlias: "UR3CLNT120"
        }),
        expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDAONE/?sap-client=120&sap-language=en&sap-iframe-hint=NWBC"
    }, {
        testDescription: "#35 WDA Compatibility mode false with custom namespace  - generate standalone WDA url",
        intent: "Action-case10",
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        inbound: oTestHelper.createInbound("#Action-case10{[undefined:]<+>}", {
            applicationType: "WDA",
            "sap.wda": {
                applicationId: "/ui2/WDAONE",
                compatibilityMode: false
            },
            text: "Test 10",
            systemAlias: "UR3CLNT120"
        }),
        expectedUrl: "https://example.corp.com:44355/sap/bc/webdynpro/ui2/WDAONE?sap-client=120&sap-language=en&sap-iframe-hint=WDA"
    }, {
        testDescription: "#36 Transaction SU01 via LPD_CUST + forbidden parameters",
        intent: "Action-case10",
        inbound: oTestHelper.createInbound("#Action-case10{[undefined:]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Test 10",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01%20%3d&%7enosplash=1&sap-theme=sap_hcd&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-theme=sap_hcd&sap-iframe-hint=GUI"
    }, {
        testDescription: "#37 Transaction SU01 via LPD_CUST + batch input + Not Completed by commit",
        intent: "Action-case11",
        inbound: oTestHelper.createInbound("#Action-case11{[undefined:]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Test11",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?" +
                "%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3d137%3bP_OBJECT%3d%3bP_OKCODE%3dOK%7e1%3bP_PRGRAM%3dPROGRAM%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3d137%3bP_OBJECT%3d%3bP_OKCODE%3dOK%7e1%3bP_PRGRAM%3dPROGRAM%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#38 Transaction SU01 via LPD_CUST + sap- forced parameter in LPD_CUST + Batch input + Not completed by commit",
        intent: "Action-case12",
        inbound: oTestHelper.createInbound("#Action-case12{[undefined:]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Test12",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?" +
                "%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3d012%3bP_OBJECT%3d%2525sap-theme%2521sap_gemstone%2525sap-fiori%25211%2525%257eWEBGUI_ICON_TOOLBAR%25210%2525sap-personas-runmode%25210%3bP_OKCODE%3dOKCODY%21%3bP_PRGRAM%3dTHEPROGRAM%21%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&" +
                "%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?" +
            "%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3d012%3bP_OBJECT%3d%2525sap-theme%2521sap_gemstone%2525sap-fiori%25211%2525%257eWEBGUI_ICON_TOOLBAR%25210%2525sap-personas-runmode%25210%3bP_OKCODE%3dOKCODY%21%3bP_PRGRAM%3dTHEPROGRAM%21%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&" +
            "%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#39 Transaction SU01 via LPD_CUST + forbidden parameters + Batch input + Not completed by commit",
        intent: "Action-case13",
        inbound: oTestHelper.createInbound("#Action-case13{[undefined:]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Test 13",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?" +
                "%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3dDYN%3bP_OBJECT%3d%2525sap-Wd-run-SC%25211%2525sap-wd-auTo-detect%25211%2525sap-EP-version%25211.32%2525sap-theme%2521sap_hcd%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dPROGRAM%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&" +
                "%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?" +
            "%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3dDYN%3bP_OBJECT%3d%2525sap-Wd-run-SC%25211%2525sap-wd-auTo-detect%25211%2525sap-EP-version%25211.32%2525sap-theme%2521sap_hcd%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dPROGRAM%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&" +
            "%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#40 Transaction SU01 with many transaction parameters",
        intent: "Action-case16?param1=1234567890&param2=1234567890&param3=1234567890&param4=1234567890&param5=1234567890&param6=1234567890&param7=1234567890&param8=1234567890&param9=1234567890&param10=123456790&" +
            "param11=1234567890&param12=1234567890&param13=1234567890&param14=1234567890&param15=1234567890&param16=1234567890&param17=1234567890&param18=1234567890&param19=1234567890&param20=123456790&" +
            "param21=1234567890&param22=1234567890&param23=1234567890&param24=1234567890&param25=1234567890&param26=1234567890&param27=1234567890&param28=1234567890&param29=1234567890&param30=123456790",
        inbound: oTestHelper.createInbound("#Action-case16{<no params><+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "DisplayWebguiLongParams",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3d137%3bP_OBJECT%3d%3bP_OKCODE%3dOK%7e1%3bP_PRGRAM%3dPROGRAM%3bP_ROLE%3dZSAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: "",
            "sap.ui": {
                technology: "GUI"
            }
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3d137%3b" +
            "P_OBJ1%3d0%2525param15%25211234567890%2525param16%25211234567890%2525param17%25211234567890%2525param18%25211234567890%2525param19%25211234567890%2525param2%25211234%3b" +
            "P_OBJ2%3d567890%2525param20%2521123456790%2525param21%25211234567890%2525param22%25211234567890%2525param23%25211234567890%2525param24%25211234567890%2525param25%252%3b" +
            "P_OBJ3%3d11234567890%2525param26%25211234567890%2525param27%25211234567890%2525param28%25211234567890%2525param29%25211234567890%2525param3%25211234567890%2525para%3b" +
            "P_OBJ4%3dm30%2521123456790%2525param4%25211234567890%2525param5%25211234567890%2525param6%25211234567890%2525param7%25211234567890%2525param8%25211234567890%2525para%3b" +
            "P_OBJ5%3dm9%25211234567890%3bP_OBJECT%3dparam1%25211234567890%2525param10%2521123456790%2525param11%25211234567890%2525param12%25211234567890%2525param13%25211234567890%2525param14%2521123456789%3b" +
            "P_OKCODE%3dOK%7e1%3bP_PRGRAM%3dPROGRAM%3bP_ROLE%3dZSAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&" +
            "%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#41 Transaction *SU01 via designer (note 'star' in transaction)",
        intent: "Action-case14",
        inbound: oTestHelper.createInbound("#Action-case14{[undefined:]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "*SU01",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#42 Transaction *SU01 via designer (note 'star' in transaction) + parameter",
        intent: "Action-case15",
        inbound: oTestHelper.createInbound("#Action-case15{[Param1:[Value1]]<+>}", {
            applicationType: "TR",
            additionalInformation: "",
            text: "Case15",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=**SU01%20PARAM1%3dValue1%3b&%7enosplash=1&sap-client=120&sap-language=EN&sap-iframe-hint=GUI"
    }, {
        testDescription: "#43 renameTo with additionalParameters = 'ignored'",
        intent: "SO-action?P1=V1",
        inbound: {
            title: "Currency manager",
            semanticObject: "SO",
            action: "action",
            resolutionResult: {
                additionalInformation: "SAPUI5.Component=Currency.Component",
                applicationType: "SAPUI5",
                text: "Currency manager (ignored)", // ignored
                ui5ComponentName: "Currency.Component",
                url: "/url/to/currency",
                "sap.platform.runtime": { everything: "propagated" }
            },
            signature: {
                additionalParameters: "ignored",
                parameters: {
                    P1: { renameTo: "P2" }
                }
            },
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        },
        oOldAppStateData: {
        },
        expectedResolutionResult: {
            "sap.platform.runtime": { everything: "propagated" },
            additionalInformation: "SAPUI5.Component=Currency.Component",
            applicationType: "SAPUI5",
            contentProviderId: undefined,
            "sap-system": undefined,
            text: "Currency manager",
            ui5ComponentName: "Currency.Component",
            url: "/url/to/currency?P2=V1",
            reservedParameters: {},
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
            navigationMode: "embedded",
            explicitNavMode: false,
            extendedInfo: {
                appParams: {
                    P2: [
                        "V1"
                    ]
                },
                system: undefined
            }
        },
        expectedAppStateData: {},
        expectedUrl: "/url/to/currency?P2=V1"
    }, {
        testDescription: "#44 additionalParameters = 'ignored' applies to selection variants stored in an x-app-state",
        intent: "SO-action?P1=v1&sap-xapp-state=ASOLD",
        inbound: oTestHelper.createInbound("#SO-action{P1:<o>}", {
            additionalInformation: "SAPUI5.Component=Currency.Component",
            applicationType: "SAPUI5",
            text: "Currency manager (ignored)",
            ui5ComponentName: "Currency.Component",
            url: "/url/to/currency",
            "sap.platform.runtime": { everything: "propagated" }
        }, {
            title: "Currency manager",
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }),
        oOldAppStateData: {
            selectionVariant: {
                ODataFilterExpression: "",
                Parameters: [{
                    PropertyName: "P2",
                    PropertyValue: "P2Value"
                }],
                SelectOptions: [],
                SelectionVariantID: "",
                Text: "Selection Variant with ID ",
                Version: {
                    Major: "1",
                    Minor: "0",
                    Patch: "0"
                }
            }
        },
        expectedResolutionResult: {
            "sap.platform.runtime": { everything: "propagated" },
            additionalInformation: "SAPUI5.Component=Currency.Component",
            applicationType: "SAPUI5",
            contentProviderId: undefined,
            "sap-system": undefined,
            text: "Currency manager",
            ui5ComponentName: "Currency.Component",
            url: "/url/to/currency?P1=v1&sap-xapp-state=ASNEW",
            reservedParameters: {},
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
            navigationMode: "embedded",
            explicitNavMode: false,
            extendedInfo: {
                appParams: {
                    P1: [
                        "v1"
                    ],
                    "sap-xapp-state": [
                        "ASNEW"
                    ]
                },
                system: undefined
            }
        },
        expectedAppStateData: {
            selectionVariant: {
                ODataFilterExpression: "",
                Parameters: [
                    // P2 is deleted because additionalParameters = 'ignored'
                ],
                SelectOptions: [],
                SelectionVariantID: "",
                Text: "Selection Variant with ID ",
                Version: {
                    Major: "1",
                    Minor: "0",
                    Patch: "0"
                }
            }
        },
        expectedUrl: "/url/to/currency?P1=v1&sap-xapp-state=ASNEW"
    }, {
        testDescription: "#45 resolution result, extended User Defaults, mapping of parameter names",
        // ignore certain fields not needed for the test
        UserDefaultParameters: {
            Pref1: generateDefault("P1refSimple", generateEqExtendedDefault("P1ExtVal")),
            P2: generateDefault("P2Def", generateEqExtendedDefault("P2ExtVal"))
        },
        intent: "SO-action?P1=a&sap-xapp-state=ASOLD",
        inbound: {
            title: "Currency manager (this one)",
            semanticObject: "SO",
            action: "action",
            resolutionResult: {
                additionalInformation: "SAPUI5.Component=Currency.Component",
                applicationType: "SAPUI5",
                text: "Currency manager (ignored )", // ignored
                ui5ComponentName: "Currency.Component",
                url: "/url/to/currency",
                "sap.platform.runtime": { everything: "propagated" }
            },
            signature: {
                additionalParameters: "ignored",
                parameters: {
                    P1: { renameTo: "P1New", defaultValue: { value: "UserDefault.extended.Pref1", format: "reference" } },
                    P2: { renameTo: "P2New", defaultValue: { value: "UserDefault.extended.Pref1", format: "reference" } },
                    P3: { renameTo: "P3New", defaultValue: { value: "UserDefault.extended.Pref1", format: "reference" } },
                    P4: { renameTo: "P4New", defaultValue: { value: "UserDefault.Pref1", format: "reference" } },
                    P5: { renameTo: "P5New", defaultValue: { value: "UserDefault.Pref5", format: "reference" } }
                }
            },
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        },
        oOldAppStateData: {
            selectionVariant: {
                ODataFilterExpression: "",
                Parameters: [{ PropertyName: "P2", PropertyValue: "P2Value" }],
                SelectOptions: [],
                SelectionVariantID: "",
                Text: "Selection Variant with ID ",
                Version: {
                    Major: "1",
                    Minor: "0",
                    Patch: "0"
                }
            }
        },
        expectedResolutionResult: {
            "sap.platform.runtime": { everything: "propagated" },
            additionalInformation: "SAPUI5.Component=Currency.Component",
            applicationType: "SAPUI5",
            contentProviderId: undefined,
            "sap-system": undefined,
            text: "Currency manager (this one)",
            ui5ComponentName: "Currency.Component",
            url: "/url/to/currency?P1New=a&P4New=P1refSimple&sap-ushell-defaultedParameterNames=%5B%22P3New%22%2C%22P4New%22%5D&sap-xapp-state=ASNEW",
            reservedParameters: {},
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
            navigationMode: "embedded",
            explicitNavMode: false,
            extendedInfo: {
                appParams: {
                    P1New: [
                        "a"
                    ],
                    P4New: [
                        "P1refSimple"
                    ],
                    "sap-xapp-state": [
                        "ASNEW"
                    ]
                },
                system: undefined
            }
        },
        expectedAppStateData: {
            selectionVariant: {
                ODataFilterExpression: "",
                Parameters: [{
                    PropertyName: "P2New",
                    PropertyValue: "P2Value"
                }],
                SelectOptions: [{
                    PropertyName: "P3New",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "P1ExtVal",
                        High: null
                    }, {
                        Sign: "I",
                        Option: "EQ",
                        Low: "P1refSimple",
                        High: null
                    }]
                }],
                SelectionVariantID: "",
                Text: "Selection Variant with ID ",
                Version: {
                    Major: "1",
                    Minor: "0",
                    Patch: "0"
                }
            }
        },
        expectedUrl: "/url/to/currency?P1New=a&P4New=P1refSimple&sap-ushell-defaultedParameterNames=%5B%22P3New%22%2C%22P4New%22%5D&sap-xapp-state=ASNEW"
    }, {
        testDescription: "#46 P5 in appstate does not prevent transitivie non-substitution of dominated primitive Parameters (P5 is substituted although present in appstate!)!",
        // ignore certain fields not needed for the test
        UserDefaultParameters: {
            Pref1: generateDefault("P1refSimple", generateEqExtendedDefault("P1ExtVal")),
            Pref5: generateDefault("Pref5Def", generateEqExtendedDefault("P2ExtVal"))
        },
        intent: "SO-action?sap-xapp-state=ASOLD",
        inbound: {
            title: "Currency manager (this one)",
            semanticObject: "SO",
            action: "action",
            resolutionResult: {
                additionalInformation: "SAPUI5.Component=Currency.Component",
                applicationType: "SAPUI5",
                text: "Currency manager (ignored )", // ignored
                ui5ComponentName: "Currency.Component",
                url: "/url/to/currency"
            },
            signature: {
                additionalParameters: "ignored",
                parameters: {
                    P1: { renameTo: "P1New", defaultValue: { value: "UserDefault.Pref1", format: "reference" } },
                    P2: { renameTo: "P1New", defaultValue: { value: "UserDefault.extended.Pref1", format: "reference" } },
                    P3: { renameTo: "P1New", defaultValue: { value: "UserDefault.extended.Pref1", format: "reference" } },
                    P5: { renameTo: "P1New", defaultValue: { value: "UserDefault.Pref5", format: "reference" } }
                }
            },
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        },
        oOldAppStateData: {
            selectionVariant: {
                Parameters: [{ PropertyName: "P5", PropertyValue: "P5Value" }]
            }
        },
        expectedAppStateData: {
            selectionVariant: {
                ODataFilterExpression: "",
                Parameters: [{ PropertyName: "P1New", PropertyValue: "P5Value" }],
                SelectionVariantID: "",
                SelectOptions: [],
                Text: "Selection Variant with ID ",
                Version: {
                    Major: "1",
                    Minor: "0",
                    Patch: "0"
                }
            }
        },
        expectedUrl: "/url/to/currency?P1New=P1refSimple&sap-ushell-defaultedParameterNames=%5B%22P1New%22%5D&sap-xapp-state=ASNEW",
        expectedErrorCalls: [
            [
                "collision of values during parameter mapping : \"P5\" -> \"P1New\""
            ],
            [
                "renaming of defaultedParamNames creates duplicatesP5->P1New"
            ]
        ]
    }, {
        testDescription: "#47 P5 in appstate does not prevent transitive non-substitution of dominated primitive Parameters (P5 is substituted although present in appstate) Note also that for primitive first one is chosen, for complex 2nd one?",
        // ignore certain fields not needed for the test
        UserDefaultParameters: {
            Pref1: generateDefault("P1refSimple", generateEqExtendedDefault("P1ExtVal")),
            Pref5: generateDefault("Pref5Def", generateEqExtendedDefault("P5ExtVal"))
        },
        intent: "SO-action?sap-xapp-state=ASOLD",
        inbound: {
            title: "Currency manager (this one)",
            semanticObject: "SO",
            action: "action",
            resolutionResult: {
                additionalInformation: "SAPUI5.Component=Currency.Component",
                applicationType: "SAPUI5",
                text: "Currency manager (ignored )", // ignored
                ui5ComponentName: "Currency.Component",
                url: "/url/to/currency"
            },
            signature: {
                additionalParameters: "ignored",
                parameters: {
                    P1: { renameTo: "P1New", defaultValue: { value: "UserDefault.Pref1", format: "reference" } },
                    P2: { renameTo: "P2New", defaultValue: { value: "UserDefault.extended.Pref1", format: "reference" } },
                    P3: { renameTo: "P2New", defaultValue: { value: "UserDefault.extended.Pref5", format: "reference" } },
                    P5: { renameTo: "P1New", defaultValue: { value: "UserDefault.Pref5", format: "reference" } }
                }
            },
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        },
        oOldAppStateData: {
            selectionVariant: {
                Parameters: [{
                    PropertyName: "P5",
                    PropertyValue: "P5Value"
                }]
            }
        },
        expectedAppStateData: {
            selectionVariant: {
                Parameters: [{ PropertyName: "P1New", PropertyValue: "P5Value" }],
                SelectOptions: [{
                    PropertyName: "P2New",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "P1ExtVal",
                        High: null
                    }, {
                        Sign: "I",
                        Option: "EQ",
                        Low: "P1refSimple",
                        High: null
                    }]
                }],
                ODataFilterExpression: "",
                SelectionVariantID: "",
                Text: "Selection Variant with ID ",
                Version: {
                    Major: "1",
                    Minor: "0",
                    Patch: "0"
                }
            }
        },
        expectedUrl: "/url/to/currency?P1New=P1refSimple&sap-ushell-defaultedParameterNames=%5B%22P1New%22%2C%22P2New%22%5D&sap-xapp-state=ASNEW"
    }, {
        testDescription: "#48 url compactation in WDA case with appstate and transient test",
        // ignore certain fields not needed for the test
        UserDefaultParameters: {
            Pref1: generateDefault(genStr("ABCD", 2049), generateEqExtendedDefault("P1ExtVal")),
            Pref2: generateDefault("Pref5Def")
        },
        intent: "SO-action?AAA=1234&AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
        inbound: {
            title: "Currency manager (this one)",
            semanticObject: "SO",
            action: "action",
            resolutionResult: {
                additionalInformation: "",
                applicationType: "WDA",
                text: "Currency manager (ignored text)",
                ui5ComponentName: "Currency.Component",
                url: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
            },
            signature: {
                additionalParameters: "allowed",
                parameters: {
                    CostCenter: { renameTo: "BUKR", defaultValue: { value: "UserDefault.Pref1", format: "reference" } },
                    ReceivingCostCenter: { renameTo: "BUKR", defaultValue: { value: "UserDefault.extended.Pref2", format: "reference" } },
                    GLAccount: { renameTo: "KORK", defaultValue: { value: "UserDefault.extended.Pref2", format: "reference" } },
                    ZSOME: { renameTo: "ZZome", defaultValue: { value: "UserDefault.Pref2", format: "reference" } }
                }
            },
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        },
        oOldAppStateData: {
            selectionVariant: {
                Parameters: [{
                    PropertyName: "P5",
                    PropertyValue: "P5Value"
                }]
            }
        },
        expectedAppStateData: {
            selectionVariant: {
                ODataFilterExpression: "",
                SelectionVariantID: "",
                Text: "Selection Variant with ID ",
                Version: {
                    Major: "1",
                    Minor: "0",
                    Patch: "0"
                },
                Parameters: [{
                    PropertyName: "P5",
                    PropertyValue: "P5Value"
                }],
                SelectOptions: [{
                    PropertyName: "BUKR",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "Pref5Def",
                        High: null
                    }]
                }, {
                    PropertyName: "KORK",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "Pref5Def",
                        High: null
                    }]
                }]
            }
        },
        expectedAppStateData2: ("BUKR=" + genStr("ABCD", 2049) + "&ZZZ=444&ZZome=Pref5Def"),
        expectedUrl: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&AAA=1234&AAAA=4321&sap-intent-param=ASNEW2&sap-ushell-defaultedParameterNames=%5B%22BUKR%22%2C%22KORK%22%2C%22ZZome%22%5D&sap-xapp-state=ASNEW&sap-iframe-hint=NWBC",
        expectedTransientCompaction: true
    }, {
        testDescription: "#49 assure long renames paramter names via renameTo are compacted WDA case with appstate",
        // ignore certain fields not needed for the test
        UserDefaultParameters: {
            Pref1: generateDefault("Pref1", generateEqExtendedDefault("P1ExtVal")),
            Pref2: generateDefault("Pref5Def")
        },
        intent: "SO-action?AAA=1234&AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
        inbound: {
            title: "Currency manager (this one)",
            semanticObject: "SO",
            action: "action",
            resolutionResult: {
                additionalInformation: "",
                applicationType: "WDA",
                text: "Currency manager (ignored text)", // ignored
                ui5ComponentName: "Currency.Component",
                url: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
            },
            signature: {
                additionalParameters: "allowed",
                parameters: {
                    CostCenter: { renameTo: "BUKR", defaultValue: { value: "UserDefault.Pref1", format: "reference" } },
                    ReceivingCostCenter: { renameTo: "BUKR", defaultValue: { value: "UserDefault.extended.Pref2", format: "reference" } },
                    GLAccount: { renameTo: "KORK", defaultValue: { value: "UserDefault.extended.Pref2", format: "reference" } },
                    ZSOME: { defaultValue: { value: "UserDefault.Pref2", format: "reference" } },
                    AAA: { renameTo: genStr("XUXU", 2044), defaultValue: { value: "UserDefault.Pref2", format: "reference" } }
                }
            },
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        },
        oOldAppStateData: {
            selectionVariant: {
                Parameters: [{
                    PropertyName: "P5",
                    PropertyValue: "P5Value"
                }]
            }
        },
        expectedAppStateData: {
            selectionVariant: {
                ODataFilterExpression: "",
                SelectionVariantID: "",
                Text: "Selection Variant with ID ",
                Version: {
                    Major: "1",
                    Minor: "0",
                    Patch: "0"
                },
                Parameters: [{
                    PropertyName: "P5",
                    PropertyValue: "P5Value"
                }],
                SelectOptions: [{
                    PropertyName: "BUKR",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "Pref5Def",
                        High: null
                    }]
                }, {
                    PropertyName: "KORK",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "Pref5Def",
                        High: null
                    }]
                }]
            }
        },
        expectedAppStateData2: (genStr("XUXU", 2044) + "=1234&ZSOME=Pref5Def&ZZZ=444"),
        expectedUrl: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&AAAA=4321&BUKR=Pref1&sap-intent-param=ASNEW2&sap-ushell-defaultedParameterNames=%5B%22BUKR%22%2C%22KORK%22%2C%22ZSOME%22%5D&sap-xapp-state=ASNEW&sap-iframe-hint=NWBC"
    }, {
        testDescription: "#50 assure sap-ushell-defaulted-parameter names can be compacted (very long parameter name) url compactation in WDA case with appstate",
        // ignore certain fields not needed for the test
        UserDefaultParameters: {
            Pref1: generateDefault("P1Def", generateEqExtendedDefault("P1ExtVal")),
            Pref2: generateDefault("Pref5Def")
        },
        intent: "SO-action?AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
        inbound: {
            title: "Currency manager (this one)",
            semanticObject: "SO",
            action: "action",
            resolutionResult: {
                additionalInformation: "",
                applicationType: "WDA",
                text: "Currency manager (ignored text)", // ignored
                ui5ComponentName: "Currency.Component",
                url: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
            },
            signature: {
                additionalParameters: "allowed",
                parameters: {
                    CostCenter: { renameTo: "BUKR", defaultValue: { value: "UserDefault.Pref1", format: "reference" } },
                    ReceivingCostCenter: { renameTo: "BUKR", defaultValue: { value: "UserDefault.extended.Pref2", format: "reference" } },
                    GLAccount: { renameTo: "KORK", defaultValue: { value: "UserDefault.extended.Pref2", format: "reference" } },
                    ZSOME: { defaultValue: { value: "UserDefault.Pref2", format: "reference" } },
                    AAA: { renameTo: genStr("XIXI", 2044), defaultValue: { value: "UserDefault.Pref2", format: "reference" } }
                }
            },
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        },
        oOldAppStateData: {
            selectionVariant: {
                Parameters: [{
                    PropertyName: "P5",
                    PropertyValue: "P5Value"
                }]
            }
        },
        expectedAppStateData: {
            selectionVariant: {
                ODataFilterExpression: "",
                SelectionVariantID: "",
                Text: "Selection Variant with ID ",
                Version: {
                    Major: "1",
                    Minor: "0",
                    Patch: "0"
                },
                Parameters: [{
                    PropertyName: "P5",
                    PropertyValue: "P5Value"
                }],
                SelectOptions: [{
                    PropertyName: "BUKR",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "Pref5Def",
                        High: null
                    }]
                }, {
                    PropertyName: "KORK",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "Pref5Def",
                        High: null
                    }]
                }]
            }
        },
        expectedAppStateData2: ("AAAA=4321&BUKR=P1Def" +
            "&" + genStr("XIXI", 2044) + "=Pref5Def&ZSOME=Pref5Def&ZZZ=444") +
            "&sap-ushell-defaultedParameterNames=" + encodeURIComponent(JSON.stringify([
                "BUKR",
                "KORK",
                genStr("XIXI", 2044),
                "ZSOME"
            ])),
        expectedUrl: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&sap-intent-param=ASNEW2&sap-xapp-state=ASNEW&sap-iframe-hint=NWBC"
    }, {
        testDescription: "#51 no extended user default value can be found (parameter should not appear in sap-ushell-defaultedParameterNames",
        // ignore certain fields not needed for the test
        UserDefaultParameters: {
            Pref1: generateDefault()
        },
        intent: "SO-action?sap-xapp-state=ASOLD",
        inbound: oTestHelper.createInbound("#SO-action{[CostCenter:[@UserDefault.extended.Pref1@]]<+>}", {
            additionalInformation: "",
            applicationType: "WDA",
            text: "Currency manager (ignored text)",
            ui5ComponentName: "Currency.Component",
            url: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
        }, {
            title: "Currency manager (this one)",
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }),
        oOldAppStateData: {
            selectionVariant: {
                Parameters: [{
                    PropertyName: "P5",
                    PropertyValue: "P5Value"
                }]
            }
        },
        expectedUrl: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&sap-xapp-state=ASOLD&sap-iframe-hint=NWBC"
    }, {
        testDescription: "#52 extended user default is merged",
        // ignore certain fields not needed for the test
        UserDefaultParameters: {
            Pref1: generateDefault("P1")
        },
        intent: "SO-action?sap-xapp-state=ASOLD",
        inbound: oTestHelper.createInbound("#SO-action{[CostCenter:[@UserDefault.extended.Pref1@]]<+>}", {
            additionalInformation: "",
            applicationType: "WDA",
            text: "Currency manager (ignored text)",
            ui5ComponentName: "Currency.Component",
            url: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
        }, {
            title: "Currency manager (this one)",
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }),
        oOldAppStateData: {
            selectionVariant: {
                Parameters: [{
                    PropertyName: "P5",
                    PropertyValue: "P5Value"
                }]
            }
        },
        expectedAppStateData: {
            selectionVariant: {
                ODataFilterExpression: "",
                SelectionVariantID: "",
                Text: "Selection Variant with ID ",
                Version: {
                    Major: "1",
                    Minor: "0",
                    Patch: "0"
                },
                Parameters: [{
                    PropertyName: "P5",
                    PropertyValue: "P5Value"
                }],
                SelectOptions: [{
                    PropertyName: "CostCenter",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "P1",
                        High: null
                    }]
                }]
            }
        },
        expectedUrl: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&sap-ushell-defaultedParameterNames=%5B%22CostCenter%22%5D&sap-xapp-state=ASNEW&sap-iframe-hint=NWBC"
    }, {
        testDescription: "#53 TR url without wrapped transaction is provided - no parameters compaction, no sap-ushell-defaultedParameterNames",
        // ignore certain fields not needed for the test
        UserDefaultParameters: {
            Pref1: generateDefault("P1Def", generateEqExtendedDefault("P1ExtVal")),
            Pref2: generateDefault("Pref5Def")
        },
        intent: "SO-action?AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
        inbound: {
            title: "Currency manager (this one)",
            semanticObject: "SO",
            action: "action",
            resolutionResult: {
                additionalInformation: "",
                applicationType: "TR",
                text: "Currency manager (ignored text)", // ignored
                ui5ComponentName: "Currency.Component",
                url: "/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN"
            },
            signature: {
                additionalParameters: "allowed",
                parameters: {
                    CostCenter: { renameTo: "BUKR", defaultValue: { value: "UserDefault.Pref1", format: "reference" } },
                    ReceivingCostCenter: { renameTo: "BUKR", defaultValue: { value: "UserDefault.extended.Pref2", format: "reference" } },
                    GLAccount: { renameTo: "KORK", defaultValue: { value: "UserDefault.extended.Pref2", format: "reference" } },
                    ZSOME: { defaultValue: { value: "UserDefault.Pref2", format: "reference" } },
                    AAA: { renameTo: genStr("XIXI", 2044), defaultValue: { value: "UserDefault.Pref2", format: "reference" } }
                }
            },
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        },
        oOldAppStateData: {
            selectionVariant: {
                Parameters: [{
                    PropertyName: "P5",
                    PropertyValue: "P5Value"
                }]
            }
        },
        expectedAppStateData: {
            selectionVariant: {
                ODataFilterExpression: "",
                SelectionVariantID: "",
                Text: "Selection Variant with ID ",
                Version: {
                    Major: "1",
                    Minor: "0",
                    Patch: "0"
                },
                Parameters: [{
                    PropertyName: "P5",
                    PropertyValue: "P5Value"
                }],
                SelectOptions: [{
                    PropertyName: "BUKR",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "Pref5Def",
                        High: null
                    }]
                }, {
                    PropertyName: "KORK",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "Pref5Def",
                        High: null
                    }]
                }]
            }
        },
        expectedAppStateData2: undefined,
        expectedUrl: "/ui2/nwbc/~canvas;window=app/transaction/SU01?" + [
            "sap-client=120",
            "sap-language=EN",
            "AAAA=4321&BUKR=P1Def",
            genStr("XIXI", 2044) + "=Pref5Def&ZSOME=Pref5Def&ZZZ=444",
            "sap-xapp-state=ASNEW&sap-iframe-hint=GUI"
        ].join("&")
    }, {
        testDescription: "#54 TR url with wrapped transaction is provided - no parameters compaction, no sap-ushell-defaultedParametersNames",
        // ignore certain fields not needed for the test
        UserDefaultParameters: {
            Pref1: generateDefault("P1Def", generateEqExtendedDefault("P1ExtVal")),
            Pref2: generateDefault("Pref5Def")
        },
        intent: "SO-action?AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
        inbound: {
            title: "Currency manager (this one)",
            semanticObject: "SO",
            action: "action",
            resolutionResult: {
                additionalInformation: "",
                applicationType: "TR",
                text: "Currency manager (ignored text)", // ignored
                ui5ComponentName: "Currency.Component",
                url: "https://uv2.example.corp.com:44355/ui2/nwbc/~canvas;window=app/transaction/APB_LPD_CALL_B_I_TXN?DYNP_OKCODE=onli&P_APPL=FS2_TEST&P_CTO=EA%20%20X%20X&P_DYNNR=1000&P_OBJECT=&P_OKCODE=OKCODE&P_PRGRAM=FOOS&P_ROLE=FS2SAMAP&P_SELSCR=X&P_TCODE=SU01&sap-client=120&sap-language=EN"
            },
            signature: {
                additionalParameters: "allowed",
                parameters: {
                    CostCenter: { renameTo: "BUKR", defaultValue: { value: "UserDefault.Pref1", format: "reference" } },
                    ReceivingCostCenter: { renameTo: "BUKR", defaultValue: { value: "UserDefault.extended.Pref2", format: "reference" } },
                    GLAccount: { renameTo: "KORK", defaultValue: { value: "UserDefault.extended.Pref2", format: "reference" } },
                    ZSOME: { defaultValue: { value: "UserDefault.Pref2", format: "reference" } },
                    AAA: { renameTo: genStr("XIXI", 2044), defaultValue: { value: "UserDefault.Pref2", format: "reference" } }
                }
            },
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        },
        oOldAppStateData: {
            selectionVariant: {
                Parameters: [{
                    PropertyName: "P5",
                    PropertyValue: "P5Value"
                }]
            }
        },
        expectedAppStateData: {
            selectionVariant: {
                ODataFilterExpression: "",
                SelectionVariantID: "",
                Text: "Selection Variant with ID ",
                Version: {
                    Major: "1",
                    Minor: "0",
                    Patch: "0"
                },
                Parameters: [{
                    PropertyName: "P5",
                    PropertyValue: "P5Value"
                }],
                SelectOptions: [{
                    PropertyName: "BUKR",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "Pref5Def",
                        High: null
                    }]
                }, {
                    PropertyName: "KORK",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "Pref5Def",
                        High: null
                    }]
                }]
            }
        },
        expectedAppStateData2: undefined,
        expectedUrl: "https://uv2.example.corp.com:44355/ui2/nwbc/~canvas;window=app/transaction/APB_LPD_CALL_B_I_TXN?" + [
            "DYNP_OKCODE=onli",
            "P_APPL=FS2_TEST",
            "P_CTO=EA%20%20X%20X",
            "P_DYNNR=1000",
            // This equals the following, but spread over P_OBJECT, P_OBJx parameters:
            // [
            //     "AAAA%25214321",
            //     "BUKR%2521P1Def",
            //     genStr("XIXI", 2044) + "%2521" + "Pref5Def",
            //     "ZSOME%2521Pref5Def",
            //     "ZZZ%2521444",
            //     "sap-xapp-state%2521ASNEW"
            // ].join("%2525"),
            "P_OBJ1=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
            "P_OBJ2=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
            "P_OBJ3=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
            "P_OBJ4=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
            "P_OBJ5=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
            "P_OBJ6=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
            "P_OBJ7=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
            "P_OBJ8=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
            "P_OBJ9=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
            "P_OBJ10=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
            "P_OBJ11=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
            "P_OBJ12=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
            "P_OBJ13=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
            "P_OBJ14=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
            "P_OBJ15=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXI%2521Pref5Def%2525ZSOME%2521Pref5Def%2525ZZZ%2521",
            "P_OBJ16=444%2525sap-xapp-state%2521ASNEW",
            "P_OBJECT=AAAA%25214321%2525BUKR%2521P1Def%2525XIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
            "P_OKCODE=OKCODE",
            "P_PRGRAM=FOOS",
            "P_ROLE=FS2SAMAP",
            "P_SELSCR=X",
            "P_TCODE=SU01",
            "sap-client=120",
            "sap-language=EN",
            "sap-iframe-hint=GUI"
        ].join("&")
    }, { // tests that fallback is used when no resolutionResult section is provided in the inbound.
        testDescription: "#55 no resolutionResult section was provided in the inbound",

        // ignore certain fields not needed for the test
        intent: "Object-action",
        inbound: oTestHelper.createInbound("#Object-action{<no params><o>}"),
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedUrl: "fallback :-({}" // url resolved via fallback
    }, {
        testDescription: "#56 sap-system with multiple errors provided",
        // ignore certain fields not needed for the test
        intent: "Object-action?sap-system=SYS",
        inbound: oTestHelper.createInbound("#Object-action{<no params><o>}", {
            additionalInformation: "",
            applicationType: "TR",
            text: "Sap System Test",
            ui5ComponentName: "",
            url: "https://uv2.example.corp.com:44355/ui2/nwbc/~canvas;window=app/transaction/SU01?SUID_ST_BNAME-BNAME=FORSTMANN&SUID_ST_NODE_LOGONDATA-USERALIAS=&=&sap-client=120&sap-language=en"
        }, {
            title: "Sap System Test",
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }),
        oKnownSapSystemData: { // Optional fixture parameter
            SYS: O_KNOWN_SYSTEM_ALIASES.MULTIPLE_INVALID_FIELDS
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedResolve: false,
        expectedRejectError: "Invalid system alias definition",
        expectedErrorCalls: [
            [
                "Invalid system alias definition: " + JSON.stringify(O_KNOWN_SYSTEM_ALIASES.MULTIPLE_INVALID_FIELDS, null, 3),
                "ERRORS:\n" + [
                    " - https>host field must be a string",
                    " - https>port field must be a number or a string",
                    " - https>pathPrefix field must be a string",
                    " - http>host field must be a string"
                ].join("\n"),
                "sap.ushell.ApplicationType"
            ]
        ]
    }, {
        testDescription: "#57 sap-system provided as intent parameter resolves to alias with blank http/https data",
        // ignore certain fields not needed for the test
        intent: "Object-action?sap-system=SYS",
        inbound: oTestHelper.createInbound("#Object-action{<no params><o>}", {
            additionalInformation: "",
            applicationType: "TR",
            text: "Sap System Test",
            ui5ComponentName: "",
            url: "https://uv2.example.corp.com:44355/ui2/nwbc/~canvas;window=app/transaction/SU01?SUID_ST_BNAME-BNAME=FORSTMANN&SUID_ST_NODE_LOGONDATA-USERALIAS=&=&sap-client=120&sap-language=en"
        }),
        oKnownSapSystemData: { // Optional fixture parameter
            SYS: O_KNOWN_SYSTEM_ALIASES.ONLY_RFC
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedResolve: false,
        expectedRejectError: "Invalid system alias definition",
        expectedErrorCalls: [
            [
                "Invalid system alias definition: " + JSON.stringify(O_KNOWN_SYSTEM_ALIASES.ONLY_RFC, null, 3),
                "ERRORS:\n" +
                " - at least one of 'http' or 'https' fields must be defined",
                "sap.ushell.ApplicationType"
            ]
        ]
    }, {
        testDescription: "#58 sap-system provided as intent parameter",
        // ignore certain fields not needed for the test
        intent: "Object-action?sap-system=UR3CLNT120",
        inbound: oTestHelper.createInbound("#Object-action{<no params><o>}", {
            additionalInformation: "",
            applicationType: "TR",
            text: "Sap System Test",
            ui5ComponentName: "",
            url: "https://uv2.example.corp.com:44355/ui2/nwbc/~canvas;window=app/transaction/SU01?SUID_ST_BNAME-BNAME=FORSTMANN&SUID_ST_NODE_LOGONDATA-USERALIAS=&=&sap-client=120&sap-language=en"
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/transaction/SU01?SUID_ST_BNAME-BNAME=FORSTMANN&SUID_ST_NODE_LOGONDATA-USERALIAS=&=&sap-client=120&sap-language=en&sap-iframe-hint=GUI"
    }, {
        testDescription: "#59 sap-system provided as intent parameter, WDA url with system alias",
        // ignore certain fields not needed for the test
        intent: "Object-action?sap-system=U1YCLNT111",
        inbound: oTestHelper.createInbound("#Object-action{<no params><o>}", {
            additionalInformation: "",
            applicationType: "WDA",
            text: "Sap System Test",
            ui5ComponentName: "",
            url: "https://u1y.example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_PORTAL_NAV_TARGET/?sap-client=000&sap-language=EN",
            systemAlias: "UI2_WDA"
        }),
        oKnownSapSystemData: {
            U1YCLNT111: {
                https: {
                    id: "U1YCLNT111_HTTPS",
                    host: "u1y.example.corp.com",
                    port: 44355,
                    pathPrefix: "" // use local
                },
                id: "U1YCLNT111",
                client: "111",
                language: ""
            },
            UI2_WDA: {
                http: {
                    id: "UI2_WDA",
                    host: "u1y.example.corp.com",
                    port: 44355,
                    pathPrefix: "" // path from local system!
                },
                https: {
                    id: "UI2_WDA",
                    host: "u1y.example.corp.com",
                    port: 44355,
                    pathPrefix: ""
                },
                rfc: {
                    id: "",
                    systemId: "",
                    host: "",
                    service: 32,
                    loginGroup: "",
                    sncNameR3: "",
                    sncQoPR3: ""
                },
                id: "UI2_WDA",
                client: "000",
                language: ""
            }
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedUrl: "https://u1y.example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_PORTAL_NAV_TARGET/?sap-client=111&sap-language=en&sap-iframe-hint=NWBC"
    }, {
        testDescription: "#60 sap-system provided as intent parameter, WDA url, relative path",
        // ignore certain fields not needed for the test
        intent: "Object-action?sap-system=UR3CLNT120",
        inbound: oTestHelper.createInbound("#Object-action{<no params><o>}", {
            additionalInformation: "",
            applicationType: "WDA",
            text: "Sap System Test",
            ui5ComponentName: "",
            url: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=en&sap-iframe-hint=NWBC"
    }, {
        testDescription: "#61 relative app/transaction URL with sap-system=ALIAS111, sap-client and sap-language are provided",
        // ignore certain fields not needed for the test
        intent: "Object-action?sap-system=ALIAS111",
        inbound: oTestHelper.createInbound("#Object-action{<no params><o>}", {
            additionalInformation: "",
            applicationType: "TR",
            text: "Sap System Test",
            ui5ComponentName: "",
            url: "/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN",
            systemAlias: "" // important -> local system!
        }),
        oKnownSapSystemData: {
            "": O_KNOWN_SYSTEM_ALIASES.LOCAL_SYSTEM,
            ALIAS111: O_KNOWN_SYSTEM_ALIASES.SYS_WITH_PATH
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedUrl: "https://vmw.example.corp.com:44335/go-to/the/moon/~canvas;window=app/transaction/SU01?sap-client=111&sap-language=en&sap-iframe-hint=GUI"
    }, {
        testDescription: "#62 GUI Application with system alias having the same path prefix as local system (/sap/bc/)",
        // ignore certain fields not needed for the test
        intent: "Object-action?sap-system=UR3CLNT120",
        inbound: oTestHelper.createInbound("#Object-action{<no params><o>}", {
            additionalInformation: "",
            applicationType: "TR",
            text: "Sap System Test",
            ui5ComponentName: "",
            url: "/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN",
            systemAlias: "" // important -> local system!
        }),
        oKnownSapSystemData: {
            "": O_KNOWN_SYSTEM_ALIASES.LOCAL_SYSTEM,
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=en&sap-iframe-hint=GUI"
    }, {
        testDescription: "#63 relative app/transaction URL with sap-system=QH3CLNT815 (with empty pathPrefix) parameter provided",
        // ignore certain fields not needed for the test
        intent: "Object-action?sap-system=UR3CLNT120",
        inbound: oTestHelper.createInbound("#Object-action{<no params><o>}", {
            additionalInformation: "",
            applicationType: "TR",
            text: "Sap System Test",
            ui5ComponentName: "",
            url: "/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=en&sap-iframe-hint=GUI"
    }, {
        testDescription: "#64 Native Wrapped Webgui URL with load balanced sap-system",
        // ignore certain fields not needed for the test
        intent: "Object-action?sap-system=ALIASRFC",
        inbound: oTestHelper.createInbound("#Object-action{<no params><o>}", {
            additionalInformation: "",
            applicationType: "TR",
            text: "Sap System Test",
            ui5ComponentName: "",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dFS2_TEST%3bP_CTO%3dEA%20%20X%20X%3bP_DYNNR%3d1000%3bP_OBJECT%3d%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dFOOS%3bP_ROLE%3dFS2SAMAP%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        oKnownSapSystemData: {
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.ALIASRFC_IT
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "TR",
        expectedUrl:
            "https://example.corp.com:44355/sap/bc/gui/sap/its/webgui;" + [
                "~sysid=UR3",
                "~loginGroup=SPACE",
                "~messageServer=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE",
                "~sncNameR3=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE",
                "~sncQoPR3=9"
            ].join(";") +
            "?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dFS2_TEST%3bP_CTO%3dEA%20%20X%20X%3bP_DYNNR%3d1000%3bP_OBJECT%3d%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dFOOS%3bP_ROLE%3dFS2SAMAP%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1" +
            "&sap-client=815" +
            "&sap-language=IT" +
            "&sap-iframe-hint=GUI"
    }, {
        testDescription: "#65 Native Wrapped Webgui URL with load balanced sap-system (but missing parameters in rfc)",
        // ignore certain fields not needed for the test
        intent: "Object-action?sap-system=ALIASRFC",
        inbound: oTestHelper.createInbound("#Object-action{<no params><o>}", {
            additionalInformation: "",
            applicationType: "TR",
            text: "Sap System Test",
            ui5ComponentName: "",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dFS2_TEST%3bP_CTO%3dEA%20%20X%20X%3bP_DYNNR%3d1000%3bP_OBJECT%3d%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dFOOS%3bP_ROLE%3dFS2SAMAP%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
            systemAlias: ""
        }),
        oKnownSapSystemData: {
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.SYS_IT_NO_R3
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "TR",
        expectedUrl:
            "https://example.corp.com:44355/sap/bc/gui/sap/its/webgui;" + [
                "~sysid=UR3",
                "~loginGroup=SPACE"
            ].join(";") +
            "?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dFS2_TEST%3bP_CTO%3dEA%20%20X%20X%3bP_DYNNR%3d1000%3bP_OBJECT%3d%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dFOOS%3bP_ROLE%3dFS2SAMAP%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1" +
            "&sap-client=815" +
            "&sap-language=IT" +
            "&sap-iframe-hint=GUI"
    }, {
        testDescription: "#66 Native Wrapped Webgui URL resolution",
        // ignore certain fields not needed for the test
        UserDefaultParameters: {
            Pref1: generateDefault("P1Def", generateEqExtendedDefault("P1ExtVal")),
            Pref2: generateDefault("Pref5Def")
        },
        intent: "Action-towrappedwebgui?AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
        inbound: {
            title: "To Wrapped webgui",
            semanticObject: "Action",
            action: "towrappedwebgui",
            resolutionResult: {
                additionalInformation: "",
                applicationType: "TR",
                url: "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dFS2_TEST%3bP_CTO%3dEA%20%20X%20X%3bP_DYNNR%3d1000%3bP_OBJECT%3d%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dFOOS%3bP_ROLE%3dFS2SAMAP%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
                systemAlias: ""
            },
            signature: {
                additionalParameters: "allowed",
                parameters: {
                    CostCenter: { renameTo: "BUKR", defaultValue: { value: "UserDefault.Pref1", format: "reference" } },
                    ReceivingCostCenter: { renameTo: "BUKR", defaultValue: { value: "UserDefault.extended.Pref2", format: "reference" } },
                    GLAccount: { renameTo: "KORK", defaultValue: { value: "UserDefault.extended.Pref2", format: "reference" } },
                    ZSOME: { defaultValue: { value: "UserDefault.Pref2", format: "reference" } },
                    AAA: { renameTo: genStr("XIXI", 2044), defaultValue: { value: "UserDefault.Pref2", format: "reference" } }
                }
            }
        },
        oOldAppStateData: {
            selectionVariant: {
                Parameters: [{
                    PropertyName: "P5",
                    PropertyValue: "P5Value"
                }]
            }
        },
        expectedAppStateData: {
            selectionVariant: {
                ODataFilterExpression: "",
                SelectionVariantID: "",
                Text: "Selection Variant with ID ",
                Version: {
                    Major: "1",
                    Minor: "0",
                    Patch: "0"
                },
                Parameters: [{
                    PropertyName: "P5",
                    PropertyValue: "P5Value"
                }],
                SelectOptions: [{
                    PropertyName: "BUKR",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "Pref5Def",
                        High: null
                    }]
                }, {
                    PropertyName: "KORK",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "Pref5Def",
                        High: null
                    }]
                }]
            }
        },
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?" +
            "%7etransaction=*APB_LPD_CALL_B_I_TXN%20" + [
                "DYNP_OKCODE%3donli",
                "P_APPL%3dFS2_TEST",
                "P_CTO%3dEA%20%20X%20X",
                "P_DYNNR%3d1000",
                // This equals the following, but spread over P_OBJECT, P_OBJx parameters:
                // [
                //     "AAAA%25214321",
                //     "BUKR%2521P1Def",
                //     genStr("XIXI", 2044) + "%2521" + "Pref5Def",
                //     "ZSOME%2521Pref5Def",
                //     "ZZZ%2521444",
                //     "sap-xapp-state%2521ASNEW"
                // ].join("%2525"),
                "P_OBJ1%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ2%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ3%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ4%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ5%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ6%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ7%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ8%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ9%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ10%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ11%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ12%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ13%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ14%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ15%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXI%2521Pref5Def%2525ZSOME%2521Pref5Def%2525ZZZ%2521",
                "P_OBJ16%3d444%2525sap-xapp-state%2521ASNEW",
                "P_OBJECT%3dAAAA%25214321%2525BUKR%2521P1Def%2525XIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",

                "P_OKCODE%3dOKCODE",
                "P_PRGRAM%3dFOOS",
                "P_ROLE%3dFS2SAMAP",
                "P_SELSCR%3dX",
                "P_TCODE%3dSU01"
            ].join("%3b") + "&" + [
                "%7enosplash=1",
                "sap-client=120",
                "sap-language=EN",
                "sap-iframe-hint=GUI"
            ].join("&")
    }, {
        testDescription: "#67 Native Non-wrapped Webgui URL resolution",
        // ignore certain fields not needed for the test
        UserDefaultParameters: {
            Pref1: generateDefault("P1Def", generateEqExtendedDefault("P1ExtVal")),
            Pref2: generateDefault("Pref5Def")
        },
        intent: "Action-tononwrappedwebgui?AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
        inbound: {
            title: "To Non Native Wrapped webgui",
            semanticObject: "Action",
            action: "tononwrappedwebgui",
            resolutionResult: {
                additionalInformation: "",
                applicationType: "TR",
                url: "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                systemAlias: ""
            },
            signature: {
                additionalParameters: "allowed",
                parameters: {
                    CostCenter: { renameTo: "BUKR", defaultValue: { value: "UserDefault.Pref1", format: "reference" } },
                    ReceivingCostCenter: { renameTo: "BUKR", defaultValue: { value: "UserDefault.extended.Pref2", format: "reference" } },
                    GLAccount: { renameTo: "KORK", defaultValue: { value: "UserDefault.extended.Pref2", format: "reference" } },
                    ZSOME: { defaultValue: { value: "UserDefault.Pref2", format: "reference" } },
                    AAA: { renameTo: genStr("XIXI", 2044), defaultValue: { value: "UserDefault.Pref2", format: "reference" } }
                }
            }
        },
        oOldAppStateData: {
            selectionVariant: {
                Parameters: [{
                    PropertyName: "P5",
                    PropertyValue: "P5Value"
                }]
            }
        },
        expectedApplicationType: "TR",
        expectedAppStateData: {
            selectionVariant: {
                ODataFilterExpression: "",
                SelectionVariantID: "",
                Text: "Selection Variant with ID ",
                Version: {
                    Major: "1",
                    Minor: "0",
                    Patch: "0"
                },
                Parameters: [{
                    PropertyName: "P5",
                    PropertyValue: "P5Value"
                }],
                SelectOptions: [{
                    PropertyName: "BUKR",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "Pref5Def",
                        High: null
                    }]
                }, {
                    PropertyName: "KORK",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "Pref5Def",
                        High: null
                    }]
                }]
            }
        },
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?" +
            "%7etransaction=*SU01%20" + [
                "AAAA%3d4321",
                "BUKR%3dP1Def",
                genStr("XIXI", 2044) + "%3dPref5Def",
                "ZSOME%3dPref5Def",
                "ZZZ%3d444"
            ].join("%3b") + "%3b&" + [
                "%7enosplash=1",
                "sap-client=120",
                "sap-language=EN",
                "sap-xapp-state=ASNEW",
                "sap-iframe-hint=GUI"
            ].join("&")
    }, {
        testDescription: "#68 Long Templated URL",
        appCapabilitiesNames: {
            attribute: "protocol",
            value: "GUI"
        },
        intent: "Action-templated?sap-ushell-navmode=inplace&sap-system=UR3CLNT120&p1=" + genStr("XIXI", 2044) + "&/inner/app",
        inbound: (function (oApplicationSection) {
            return {
                title: "templated",
                semanticObject: "Action",
                action: "templated",
                permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                resolutionResult: {
                    applicationType: "URL",
                    navigationMode: "embedded"
                },
                signature: {
                    additionalParameters: "ignored",
                    parameters: {
                        p1: { required: false, defaultValue: { value: "v1", format: "plain" } }
                    }
                },
                templateContext: {
                    payload: {
                        capabilities: {
                            statefulContainer: {
                                enabled: true,
                                protocol: "GUI"
                            }
                        },
                        urlTemplate: "http://www.google.com/{?query,p1,innerAppRoute}",
                        parameters: {
                            names: { query: "ABC", innerAppRoute: "{&innerAppRoute:.}" }
                        }
                    },
                    site: {
                        some: {
                            kind: {
                                of: {
                                    site: {},
                                    application: oApplicationSection
                                }
                            }
                        }
                    },
                    siteAppSection: oApplicationSection
                }
            };
        })({ // application section
            destination: "UR5",
            inbound: {
                semanticObject: "Action",
                action: "templated"
            }
        }),
        oOldAppStateData: {},
        expectedAppStateData: "p1=" + genStr("XIXI", 2044) + "&query=ABC",
        expectedResolutionResult: {
            applicationType: "URL",
            contentProviderId: "",
            reservedParameters: {},
            systemAlias: "UR5",
            text: "templated",
            url: "http://www.google.com/?innerAppRoute=%26%2Finner%2Fapp&sap-intent-param=ASNEW",
            explicitNavMode: true,
            navigationMode: "embedded",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
            extendedInfo: {
                appParams: {
                    p1: ["XI".repeat(1022)],
                    "sap-system": ["UR3CLNT120"],
                    "sap-ushell-navmode": ["inplace"]
                },
                system: undefined
            }
        }
    }, {
        testDescription: "#69a Templated URL",
        appCapabilitiesNames: {
            attribute: "protocol",
            value: "GUI"
        },
        intent: "Action-templated?sap-ushell-navmode=inplace&sap-system=UR3CLNT120&/inner/app",
        inbound: (function (oApplicationSection) {
            return {
                title: "templated",
                semanticObject: "Action",
                action: "templated",
                permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                resolutionResult: {
                    applicationType: "URL",
                    navigationMode: "embedded"
                },
                signature: {
                    additionalParameters: "ignored",
                    parameters: {
                        p1: { required: false, defaultValue: { value: "v1", format: "plain" } }
                    }
                },
                templateContext: {
                    payload: {
                        capabilities: {
                            statefulContainer: {
                                enabled: true,
                                protocol: "GUI"
                            }
                        },
                        urlTemplate: "http://www.google.com/{?query,p1,innerAppRoute}",
                        parameters: {
                            names: { query: "ABC", innerAppRoute: "{&innerAppRoute:.}" }
                        }
                    },
                    site: {
                        some: {
                            kind: {
                                of: {
                                    site: {
                                    },
                                    application: oApplicationSection
                                }
                            }
                        }
                    },
                    siteAppSection: oApplicationSection
                }
            };
        })({ // application section
            destination: "UR5",
            inbound: {
                semanticObject: "Action",
                action: "templated"
            }
        }),
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedResolutionResult: {
            applicationType: "URL",
            contentProviderId: "",
            reservedParameters: {},
            text: "templated",
            systemAlias: "UR5",
            url: "http://www.google.com/?query=ABC&p1=v1&innerAppRoute=%26%2Finner%2Fapp",
            explicitNavMode: true,
            navigationMode: "embedded",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
            extendedInfo: {
                appParams: {
                    p1: ["v1"],
                    "sap-system": ["UR3CLNT120"],
                    "sap-ushell-navmode": ["inplace"]
                },
                system: undefined
            }
        }
    }, {
        testDescription: "#69b Templated URL with empty system parameter",
        appCapabilitiesNames: {
            attribute: "protocol",
            value: "GUI"
        },
        intent: "Action-templated?sap-ushell-navmode=inplace&sap-system=&/inner/app",
        inbound: (function (oApplicationSection) {
            return {
                title: "templated",
                semanticObject: "Action",
                action: "templated",
                permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                resolutionResult: {
                    applicationType: "URL",
                    navigationMode: "embedded"
                },
                signature: {
                    additionalParameters: "ignored",
                    parameters: {
                        p1: { required: false, defaultValue: { value: "v1", format: "plain" } }
                    }
                },
                templateContext: {
                    payload: {
                        capabilities: {
                            statefulContainer: {
                                enabled: true,
                                protocol: "GUI"
                            }
                        },
                        urlTemplate: "http://www.google.com/{?query,p1,innerAppRoute}",
                        parameters: {
                            names: { query: "ABC", innerAppRoute: "{&innerAppRoute:.}" }
                        }
                    },
                    site: {
                        some: {
                            kind: {
                                of: {
                                    site: {
                                    },
                                    application: oApplicationSection
                                }
                            }
                        }
                    },
                    siteAppSection: oApplicationSection
                }
            };
        })({ // application section
            destination: "UR5",
            inbound: {
                semanticObject: "Action",
                action: "templated"
            }
        }),
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedResolutionResult: {
            applicationType: "URL",
            contentProviderId: "",
            reservedParameters: {},
            text: "templated",
            systemAlias: "UR5",
            url: "http://www.google.com/?query=ABC&p1=v1&innerAppRoute=%26%2Finner%2Fapp",
            explicitNavMode: true,
            navigationMode: "embedded",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
            extendedInfo: {
                appParams: { // no sap-system parameter, not even with a value of an empty string  !
                    p1: ["v1"],
                    "sap-ushell-navmode": ["inplace"]
                },
                system: undefined
            }
        }
    }, {
        testDescription: "#70 CDM 3.0 WDA URL",
        intent: "Product-wdaSearch?parameterName=parameterValue&sap-ushell-navmode=inplace",
        inbound: (function (oApplicationSection) {
            return {
                title: "templated",
                semanticObject: "Product",
                action: "wdaSearch",
                permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                resolutionResult: {
                    applicationType: "URL",
                    navigationMode: "embedded"
                },
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        defaultP1: { required: false, renameTo: "defaultP1Renamed", defaultValue: { value: "v1", format: "plain" } }
                    }
                },
                templateContext: {
                    payload: {
                        urlTemplate: "{+_baseUrl}/ui2/nwbc/~canvas;window=app/wda/{wdaAppId}/{?wdConfigId,_defaultParameterNames,_startupParameters*,sapTheme,sapLanguage,sapInnerAppState,sapSessionTimeout}",
                        parameters: {
                            names: utils.shallowMergeObject(O_CDM3_TEMPLATE_NOTIONS, {
                                wdaAppId: "{./sap.integration/urlTemplateParams/applicationId}",
                                wdConfigId: {
                                    renameTo: "sap-wd-configId",
                                    value: "{./sap.integration/urlTemplateParams/configId}"
                                },
                                wdAppId: {
                                    renameTo: "sap-ui-app-id",
                                    value: "{./sap.integration/urlTemplateParams/appId}"
                                },
                                _defaultParameterNamesPrejoin: "{join(\"\\,\") &defaultParameterNames:.}",
                                _defaultParameterNamesPostjoin: "{join() '[\"',&_defaultParameterNamesPrejoin,'\"]'}",
                                _defaultParameterNames: {
                                    renameTo: "sap-ushell-defaultedParameterNames",
                                    value: "{if({&_defaultParameterNamesPrejoin}) &_defaultParameterNamesPostjoin}"
                                },
                                sapTheme: {
                                    renameTo: "sap-theme",
                                    value: "{&env:theme}"
                                },
                                sapLanguage: {
                                    renameTo: "sap-language",
                                    value: "{&env:logonLanguage}"
                                },
                                sapInnerAppState: {
                                    renameTo: "sap-iapp-state",
                                    value: "{if({&env:innerAppState}) &env:innerAppState}"
                                },
                                sapSessionTimeout: {
                                    renameTo: "sap-ushell-timeout",
                                    value: "{&env:sessionTimeout}"
                                }
                            })
                        },
                        capabilities: {
                            technicalAppComponentId: "{+wdaAppId}",
                            appId: "{+wdAppId}",
                            appFrameworkId: "WDA"
                        }
                    },
                    site: O_CDM3_SAMPLE_SITE,
                    siteAppSection: oApplicationSection
                }
            };
        })({ // application section
            "sap.app": {
                destination: "legacy_blue_box",
                title: "CALL WDA EC Cockpit - Scenario 2",
                crossNavigation: {
                    inbounds: {
                        "AcademicCourse-a5": {
                            semanticObject: "AcademicCourse",
                            action: "a5",
                            signature: {
                                parameters: {},
                                additionalParameters: "allowed"
                            }
                        }
                    }
                }
            },
            "sap.integration": {
                urlTemplateId: "urltemplate.wda",
                urlTemplateParams: {
                    applicationId: "S_EPM_FPM_PD",
                    configId: "s_epm_fpm_pd",
                    appId: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
                }
            },
            "sap.flp": {
                businessApp: "businessapp.urltemplate-wda",
                defaultLauncher: "businessapp.urltemplate-wda#AcademicCourse-a5"
            },
            "sap.ui": {
                technology: "URL"
            }
        }),
        oOldAppStateData: {},
        sHash: "#Semantic-Action?p1=1&p2=2&\\dumm1\\sap-iapp-state=ABCDE",
        iSessionTimeout: 10,
        expectedAppStateData: {},
        expectedResolutionResult: {
            applicationType: "URL",
            appCapabilities: {
                appId: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                appSupportInfo: undefined,
                appFrameworkId: "WDA",
                navigationMode: "newWindow",
                templateNavigationMode: undefined,
                technicalAppComponentId: "S_EPM_FPM_PD"
            },
            reservedParameters: {},
            text: "templated",
            systemAlias: "legacy_blue_box",
            url: "https://tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com/sap/bc/ui2/nwbc/~canvas;window=app/wda/S_EPM_FPM_PD/?" +
                "sap-wd-configId=s_epm_fpm_pd&sap-ushell-defaultedParameterNames=%5B%22defaultP1Renamed%22%5D&defaultP1Renamed=v1&parameterName=parameterValue&sap-theme=sap_belize&sap-language=EN&sap-iapp-state=ABCDE&sap-ushell-timeout=10&sap-iframe-hint=WDA",
            contentProviderId: "",
            explicitNavMode: true,
            navigationMode: "embedded",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
            extendedInfo: {
                appParams: {
                    defaultP1Renamed: [
                        "v1"
                    ],
                    parameterName: [
                        "parameterValue"
                    ],
                    "sap-ushell-navmode": [
                        "inplace"
                    ]
                },
                system: {
                    alias: "legacy_blue_box",
                    client: "120",
                    https: {
                        host: "tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com",
                        id: "legacy_blue_box_HTTPS",
                        pathPrefix: ""
                    },
                    id: "legacy_blue_box",
                    language: "DE",
                    rfc: {
                        host: "example.corp.com",
                        id: "legacy_blue_box",
                        loginGroup: "",
                        service: "3255",
                        sncNameR3: "p/secude:CN=EXAMPLE, O=SAP-AG, C=DE",
                        sncQoPR3: "8",
                        systemId: ""
                    }
                }
            }
        }
    }, {
        testDescription: "#71 CDM 3.0 GUI URL",
        appCapabilitiesNames: {
            attribute: "protocol",
            value: "GUI"
        },
        intent: "Employee-display?parameterName=parameterValue&sap-ushell-navmode=inplace",
        inbound: (function (oApplicationSection) {
            return {
                title: "templated",
                semanticObject: "Employee",
                action: "display",
                permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                resolutionResult: {
                    applicationType: "URL",
                    navigationMode: "embedded"
                },
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        defaultP1: { required: false, defaultValue: { value: "v1", format: "plain" } }
                    }
                },
                templateContext: {
                    payload: {
                        urlTemplate: "{+_baseUrl}/gui/sap/its/webgui{;connectString,service,sysid,loginGroup,messageServer,sncNameR3,sncQoPR3}?%7etransaction={+skipScreenChar}{+transaction}{transactionParams}&%7enosplash=1{&sapTheme,sapLanguage,sapSessionTimeout}",
                        parameters: {
                            names: utils.shallowMergeObject(O_CDM3_TEMPLATE_NOTIONS, {
                                sysid: {
                                    renameTo: "~sysid",
                                    value: "{and _destIsLoadBalancing,/systemAliases/{&_destName}/rfc/systemId}"
                                },
                                loginGroup: {
                                    renameTo: "~loginGroup",
                                    value: "{and _destIsLoadBalancing,/systemAliases/{&_destName}/rfc/loginGroup}"
                                },
                                messageServer: {
                                    renameTo: "~messageServer",
                                    value: "{and _destIsLoadBalancing,/systemAliases/{&_destName}/rfc/sncNameR3}"
                                },
                                sncNameR3: {
                                    renameTo: "~sncNameR3",
                                    value: "{/systemAliases/{&_destName}/rfc/sncNameR3}"
                                },
                                sncQoPR3: {
                                    renameTo: "~sncQoPR3",
                                    value: "{/systemAliases/{&_destName}/rfc/sncQoPR3}"
                                },
                                service: {
                                    renameTo: "~service",
                                    value: "{/systemAliases/{&_destName}/rfc/service}"
                                },
                                rfcHost: "{/systemAliases/{&_destName}/rfc/host}",
                                connectString: {
                                    renameTo: "~connectString",
                                    value: "{and &_destIsNotLoadBalancing,&_destHostIsConnectString,&rfcHost}"
                                },
                                businessParams: "{*|match(^(?!sap-))}",
                                skipScreenChar: "{and({&businessParams}) '*'}",
                                transactionParamsSeparator: "{and({&businessParams}) ' '}",
                                transactionParamsJoined: "{join(;,=) &businessParams}",
                                transaction: "{./sap.integration/urlTemplateParams/transaction}",
                                transactionParams: "{join &transactionParamsSeparator,&transactionParamsJoined}",
                                sapTheme: {
                                    renameTo: "sap-theme",
                                    value: "{&env:theme}"
                                },
                                sapLanguage: {
                                    renameTo: "sap-language",
                                    value: "{&env:logonLanguage}"
                                },
                                sapSessionTimeout: {
                                    renameTo: "sap-ushell-timeout",
                                    value: "{&env:sessionTimeout}"
                                },
                                appId: "{./sap.integration/urlTemplateParams/appId}"
                            })
                        },
                        capabilities: {
                            technicalAppComponentId: "{+transaction}",
                            appFrameworkId: "GUI",
                            appId: "{+appId}"
                        }
                    },
                    site: O_CDM3_SAMPLE_SITE,
                    siteAppSection: oApplicationSection
                }
            };
        })({ // application section
            "sap.app": {
                destination: "legacy_blue_box",
                title: "CALL EC Cockpit - Scenario 1",
                crossNavigation: {
                    inbounds: {
                        "AcademicCourse-a4": {
                            semanticObject: "AcademicCourse",
                            action: "a4",
                            signature: {
                                parameters: {},
                                additionalParameters: "allowed"
                            }
                        }
                    }
                }
            },
            "sap.integration": {
                urlTemplateId: "urltemplate.gui",
                urlTemplateParams: {
                    transaction: "/BAOF/EC_CP_21",
                    appId: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
                }
            },
            "sap.flp": {
                businessApp: "businessapp.urltemplate-gui",
                defaultLauncher: "businessapp.urltemplate-gui#AcademicCourse-a4"
            },
            "sap.ui": {
                technology: "URL"
            }
        }),
        oOldAppStateData: {},
        expectedAppStateData: {},
        iSessionTimeout: -1,
        expectedResolutionResult: {
            appCapabilities: {
                appFrameworkId: "GUI",
                appId: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                appSupportInfo: undefined,
                navigationMode: "newWindow",
                templateNavigationMode: undefined,
                technicalAppComponentId: "/BAOF/EC_CP_21"
            },
            applicationType: "URL",
            contentProviderId: "",
            reservedParameters: {},
            text: "templated",
            systemAlias: "legacy_blue_box",
            url: "https://tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com/sap/bc/gui/sap/its/webgui;~service=3255;~sncNameR3=p%2Fsecude%3ACN%3DEXAMPLE%2C%20O%3DSAP-AG%2C%20C%3DDE;~sncQoPR3=8?" +
                "%7etransaction=*/BAOF/EC_CP_21%20defaultP1%3Dv1%3BparameterName%3DparameterValue&%7enosplash=1&sap-theme=sap_belize&sap-language=EN&sap-ushell-timeout=0&sap-iframe-hint=GUI",
            explicitNavMode: true,
            navigationMode: "embedded",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
            extendedInfo: {
                appParams: {
                    defaultP1: [
                        "v1"
                    ],
                    parameterName: [
                        "parameterValue"
                    ],
                    "sap-ushell-navmode": [
                        "inplace"
                    ]
                },
                system: {
                    alias: "legacy_blue_box",
                    client: "120",
                    https: {
                        host: "tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com",
                        id: "legacy_blue_box_HTTPS",
                        pathPrefix: ""
                    },
                    id: "legacy_blue_box",
                    language: "DE",
                    rfc: {
                        host: "example.corp.com",
                        id: "legacy_blue_box",
                        loginGroup: "",
                        service: "3255",
                        sncNameR3: "p/secude:CN=EXAMPLE, O=SAP-AG, C=DE",
                        sncQoPR3: "8",
                        systemId: ""
                    }
                }
            }
        }
    }, {
        testDescription: "#72 UI5 (cFLP App Runtime)",
        appCapabilitiesNames: {
            attribute: "protocol",
            value: "GUI"
        },
        intent: "Employee-display?parameterName=parameterValue&sap-ushell-navmode=inplace",
        inbound: (function (oApplicationSection) {
            return {
                title: "templated",
                semanticObject: "Employee",
                action: "display",
                permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                resolutionResult: {
                    applicationType: "URL",
                    navigationMode: "embedded"
                },
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        defaultP1: { required: false, defaultValue: { value: "v1", format: "plain" } }
                    }
                },
                templateContext: {
                    payload: {
                        urlTemplate: "{+_baseUrl}{+appRuntime}{?appId,startupParameters,originalHash,sapUiDebug}",
                        parameters: {
                            names: utils.shallowMergeObject(O_CDM3_TEMPLATE_NOTIONS, O_CDM3_TEMPLATE_FIORI)
                        },
                        capabilities: {
                            navigationMode: "embedded",
                            appId: "{+_appIdCapability}",
                            technicalAppComponentId: "{+_technicalAppComponentIdCapability}",
                            appFrameworkId: "UI5"
                        }
                    },
                    site: O_CDM3_SAMPLE_SITE,
                    siteAppSection: oApplicationSection
                }
            };
        })({ // application section
            "sap.app": {
                destination: "fiori_blue_box",
                title: "Invoices",
                crossNavigation: {
                    inbounds: {
                        "InvoiceList-manage": {
                            semanticObject: "InvoiceList",
                            action: "manage",
                            signature: {
                                parameters: {},
                                additionalParameters: "allowed"
                            }
                        }
                    }
                }
            },
            "sap.integration": {
                urlTemplateId: "urltemplate.fiori",
                urlTemplateParams: {
                    appId: "cus.sd.billingdoclist.manages1",
                    appPlatform: "ABAP"
                }
            },
            "sap.flp": {
                businessApp: "businessapp.urltemplate-fiori",
                defaultLauncher: "businessapp.urltemplate-fiori#InvoiceList-manage"
            },
            "sap.ui": {
                technology: "URL"
            }
        }),
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedResolutionResult: {
            appCapabilities: {
                appFrameworkId: "UI5",
                appId: "cus.sd.billingdoclist.manages1",
                appSupportInfo: undefined,
                navigationMode: "embedded",
                templateNavigationMode: "embedded",
                technicalAppComponentId: "cus.sd.billingdoclist.manages1"
            },
            applicationType: "URL",
            contentProviderId: "",
            reservedParameters: {},
            text: "templated",
            systemAlias: "fiori_blue_box",
            url: "https://tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com/sap/bc/ui2/flp/ui5appruntime.html?sap-ui-app-id=cus.sd.billingdoclist.manages1&" +
                "startupParameters=defaultP1%3Dv1%26parameterName%3DparameterValue%26sap-ushell-defaultedParameterNames%3D%5B%22defaultP1%22%5D&originalHash=&sap-iframe-hint=UI5",
            explicitNavMode: true,
            navigationMode: "embedded",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
            extendedInfo: {
                appParams: {
                    defaultP1: [
                        "v1"
                    ],
                    parameterName: [
                        "parameterValue"
                    ],
                    "sap-ushell-defaultedParameterNames": [
                        "[\"defaultP1\"]"
                    ],
                    "sap-ushell-navmode": [
                        "inplace"
                    ]
                },
                system: {
                    alias: "fiori_blue_box",
                    client: "000",
                    https: {
                        host: "tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com",
                        id: "fiori_blue_box_HTTPS",
                        pathPrefix: ""
                    },
                    id: "fiori_blue_box",
                    language: "IT"
                }
            }
        }
    }, {
        testDescription: "#73 UI5 (CLP App Runtime) - app with explace navigation mode",
        intent: "Employee-display",
        inbound: (function (oApplicationSection) {
            return {
                title: "templated",
                semanticObject: "Employee",
                action: "display",
                resolutionResult: {
                    applicationType: "URL",
                    navigationMode: "embedded"
                },
                signature: {
                    additionalParameters: "allowed",
                    parameters: {}
                },
                templateContext: {
                    payload: {
                        urlTemplate: "{+_baseUrl}{+appRuntime}{?appId,startupParameters,originalHash,sapUiDebug}",
                        parameters: {
                            names: utils.shallowMergeObject(O_CDM3_TEMPLATE_NOTIONS, O_CDM3_TEMPLATE_FIORI)
                        },
                        capabilities: {
                            navigationMode: "embedded",
                            appId: "{+_appIdCapability}",
                            technicalAppComponentId: "{+_technicalAppComponentIdCapability}",
                            appFrameworkId: "UI5"
                        }
                    },
                    site: O_CDM3_SAMPLE_SITE,
                    siteAppSection: oApplicationSection
                }
            };
        })({ // application section
            "sap.app": {
                destination: "fiori_blue_box",
                title: "Invoices",
                crossNavigation: {
                    inbounds: {
                        "InvoiceList-manage": {
                            semanticObject: "InvoiceList",
                            action: "manage",
                            signature: {
                                parameters: {},
                                additionalParameters: "allowed"
                            }
                        }
                    }
                }
            },
            "sap.integration": {
                urlTemplateId: "urltemplate.fiori",
                urlTemplateParams: {
                    appId: "cus.sd.billingdoclist.manages1",
                    appPlatform: "ABAP"
                },
                navMode: "explace"
            },
            "sap.flp": {
                businessApp: "businessapp.urltemplate-fiori",
                defaultLauncher: "businessapp.urltemplate-fiori#InvoiceList-manage"
            },
            "sap.ui": {
                technology: "URL"
            }
        }),
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedResolutionResult: {
            appCapabilities: {
                appFrameworkId: "UI5",
                appId: "cus.sd.billingdoclist.manages1",
                appSupportInfo: undefined,
                navigationMode: "newWindowThenEmbedded",
                templateNavigationMode: "embedded",
                technicalAppComponentId: "cus.sd.billingdoclist.manages1"
            },
            applicationType: "URL",
            contentProviderId: "",
            reservedParameters: {},
            text: "templated",
            systemAlias: "fiori_blue_box",
            url: "https://tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com/sap/bc/ui2/flp/ui5appruntime.html?sap-ui-app-id=cus.sd.billingdoclist.manages1&startupParameters=&originalHash=&sap-iframe-hint=UI5",
            explicitNavMode: false,
            navigationMode: "newWindowThenEmbedded",
            extendedInfo: {
                appParams: {},
                system: {
                    alias: "fiori_blue_box",
                    client: "000",
                    https: {
                        host: "tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com",
                        id: "fiori_blue_box_HTTPS",
                        pathPrefix: ""
                    },
                    id: "fiori_blue_box",
                    language: "IT"
                }
            },
            inboundPermanentKey: undefined
        }
    }, {
        testDescription: "#74 Relative target in URL, no system alias, sap-system without path prefix",
        // ignore certain fields not needed for the test
        intent: "Action-aliasToUrl?sap-system=UR3CLNT120",
        inbound: oTestHelper.createInbound("#Action-aliasToUrl{<no params><o>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "/sap/bc/to/the/moon",
            systemAlias: ""
        }, {
            title: "Sap System Test",
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedResolutionResult: {
            applicationType: "URL",
            contentProviderId: undefined,
            reservedParameters: {},
            systemAlias: "",
            url: "https://example.corp.com:44355/sap/bc/to/the/moon?sap-client=120&sap-language=en",
            navigationMode: "newWindow",
            explicitNavMode: false,
            additionalInformation: "",
            "sap-system": "UR3CLNT120",
            text: "Sap System Test",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#75 Relative URL, no system alias, sap-system with path",
        // ignore certain fields not needed for the test
        intent: "Action-aliasToUrl?sap-system=ALIASRFC",
        inbound: oTestHelper.createInbound("#Action-aliasToUrl{<no params><o>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "/sap/bc/to/the/moon",
            systemAlias: ""
        }),
        oKnownSapSystemData: {
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.ALIASRFC
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "URL",
        expectedUrl: "https://example.corp.com:1111/path/sap/bc/to/the/moon?sap-client=220&sap-language=en"
    }, {
        testDescription: "#76 Absolute URL, no system alias, sap-system without path",
        // ignore certain fields not needed for the test
        intent: "Action-aliasToAbsoluteUrl?sap-system=UR3CLNT120",
        inbound: oTestHelper.createInbound("#Action-aliasToAbsoluteUrl{<no params><o>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "http://www.google.com/path/to/the/moon.html",
            systemAlias: ""
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "URL",
        expectedUrl: "http://www.google.com/path/to/the/moon.html"
    }, {
        testDescription: "#77 Absolute URL, no system alias, sap-system with path",
        // ignore certain fields not needed for the test
        intent: "Action-aliasToAbsoluteUrl?sap-system=ALIASRFC",
        inbound: oTestHelper.createInbound("#Action-aliasToAbsoluteUrl{<no params><o>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "http://www.google.com/path/to/the/moon.html",
            systemAlias: ""
        }),
        oKnownSapSystemData: {
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.ALIASRFC
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "URL",
        expectedUrl: "http://www.google.com/path/to/the/moon.html"
    }, {
        testDescription: "#78 Relative URL, system alias with path prefix, sap-system without path prefix",
        // ignore certain fields not needed for the test
        intent: "Action-aliasToUrl?sap-system=UR3CLNT120",
        inbound: oTestHelper.createInbound("#Action-aliasToUrl{<no params><o>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "https://vmw.example.corp.com:44335/go-to/the/moon/sap/bc/to/the/moon?sap-client=111&sap-language=EN",
            systemAlias: "ALIAS111"
        }),
        oKnownSapSystemData: {
            ALIAS111: O_KNOWN_SYSTEM_ALIASES.SYS_WITH_PATH,
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "URL",
        expectedUrl: "https://example.corp.com:44355/sap/bc/to/the/moon?sap-client=120&sap-language=en"
    }, {
        testDescription: "#79 Relative URL, system alias with path prefix, sap-system with path prefix",
        // ignore certain fields not needed for the test
        intent: "Action-aliasToUrl?sap-system=ALIAS111",
        inbound: oTestHelper.createInbound("#Action-aliasToUrl{<no params><o>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "https://example.corp.com:1111/path//sap/bc/to/the/moon?sap-client=220&sap-language=EN",
            systemAlias: "ALIASRFC"
        }),
        oKnownSapSystemData: {
            ALIAS111: O_KNOWN_SYSTEM_ALIASES.SYS_WITH_PATH,
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.ALIASRFC
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "URL",
        expectedUrl: "https://vmw.example.corp.com:44335/go-to/the/moon/sap/bc/to/the/moon?sap-client=111&sap-language=en"
    }, {
        testDescription: "#80 Absolute URL, system alias with path prefix, sap-system without path prefix",
        // ignore certain fields not needed for the test
        intent: "Action-aliasToAbsoluteUrl?sap-system=UR3CLNT120",
        inbound: oTestHelper.createInbound("#Action-aliasToAbsoluteUrl{<no params><o>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "http://www.google.com/sap/bc/to/the/moon.html",
            systemAlias: "ALIASRFC"
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120,
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.ALIASRFC
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "URL",
        expectedUrl: "http://www.google.com/sap/bc/to/the/moon.html"
    }, {
        testDescription: "#81 Relative URL, with apply system alias semantics on relative URL",
        // ignore certain fields not needed for the test
        intent: "Action-toCdmTarget",
        inbound: oTestHelper.createInbound("#Action-toCdmTarget{<no params><o>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "/path/to/some/document.html",
            systemAlias: "UR3CLNT120",
            systemAliasSemantics: "apply"
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "URL",
        expectedUrl: "https://example.corp.com:44355/path/to/some/document.html?sap-client=120&sap-language=en"
    }, {
        testDescription: "#82 Relative URL, with apply system alias semantics and sap system on relative URLs",
        intent: "Action-toCdmTarget?p1=v1&sap-system=ALIASRFC", // NOTE: sap-system wins here
        inbound: oTestHelper.createInbound("#Action-toCdmTarget{<no params><+>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "/path/to/some/document.html",
            systemAlias: "UR3CLNT120",
            systemAliasSemantics: "apply"
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120,
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.ALIASRFC
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "URL",
        expectedUrl: "https://example.corp.com:1111/path/path/to/some/document.html?sap-client=220&sap-language=en&p1=v1"
    }, {
        testDescription: "#83 Relative URL, with no sap system or system alias, but apply semantics",
        intent: "Action-toCdmTarget", // NOTE: sap-system wins here
        inbound: oTestHelper.createInbound("#Action-toCdmTarget{<no params><o>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "/path/to/some/document.html",
            systemAliasSemantics: "apply"
        }),
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "URL",
        expectedUrl: "/path/to/some/document.html"
    }, {
        testDescription: "#84 WebGUI Target, with no sap system or system alias, but apply semantics",
        intent: "Action-toCdmGuiTarget", // NOTE: sap-system wins here
        inbound: oTestHelper.createInbound("#Action-toCdmGuiTarget{<no params><+>}", {
            "sap.gui": {
                _version: "1.2.0",
                transaction: "/SAPSLL/CLSNR_01"
            },
            applicationType: "TR",
            systemAliasSemantics: "apply",
            text: "Manage Commodity Codes"
        }),
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "TR",
        expectedUrl: "/sap/bc/gui/sap/its/webgui;?%7etransaction=%2FSAPSLL%2FCLSNR_01&%7enosplash=1&sap-language=en&sap-iframe-hint=GUI"
    }, {
        testDescription: "#85 WebGUI Target, with sap-system and sap-system-src",
        intent: "Action-toCdmGuiTarget?sap-system=UR3CLNT120&sap-system-src=OTHERSYSTEM",
        inbound: oTestHelper.createInbound("#Action-toCdmGuiTarget{<no params><+>}", {
            applicationType: "TR",
            systemAliasSemantics: "apply",
            text: "Manage Commodity Codes",
            "sap.gui": {
                _version: "1.2.0",
                transaction: "/SAPSLL/CLSNR_01"
            }
        }, {
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        oLocalStorageContent: {
            "sap-system-data#OTHERSYSTEM:UR3CLNT120": (function (oSystemData) {
                oSystemData.https.host = "test." + oSystemData.https.host;
                return JSON.stringify(oSystemData);
            })(deepExtend({}, O_KNOWN_SYSTEM_ALIASES.UR3CLNT120))
        },
        expectedResolutionResult: {
            applicationType: "TR",
            contentProviderId: undefined,
            navigationMode: "newWindowThenEmbedded",
            explicitNavMode: false,
            extendedInfo: {
                appParams: {
                    "sap-system": [
                        "UR3CLNT120"
                    ],
                    "sap-system-src": [
                        "OTHERSYSTEM"
                    ]
                },
                system: undefined
            },
            reservedParameters: {},
            "sap-system": "UR3CLNT120",
            "sap-system-src": "OTHERSYSTEM",
            text: undefined,
            systemAlias: "UR3CLNT120",
            url: "https://test.example.corp.com:44355/sap/bc/gui/sap/its/webgui;~rfcHostName=example.corp.com;~service=3255;~sncNameR3=p%2fsecude%3aCN%3dUR3%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=8?%7etransaction=%2FSAPSLL%2FCLSNR_01&%7enosplash=1&sap-client=120&sap-language=en&sap-system-src=OTHERSYSTEM&sap-iframe-hint=GUI",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#86 WebGUI Target, with connect string in system alias",
        intent: "Action-toCdmGuiTarget?sap-system=SYSCONNSTRING",
        inbound: oTestHelper.createInbound("#Action-toCdmGuiTarget{<no params><+>}", {
            applicationType: "TR",
            systemAliasSemantics: "apply",
            text: "Manage Commodity Codes",
            "sap.gui": {
                _version: "1.2.0",
                transaction: "/SAPSLL/CLSNR_01"
            }
        }, {
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }),
        oKnownSapSystemData: {
            SYSCONNSTRING: O_KNOWN_SYSTEM_ALIASES.SYSCONNSTRING
        },
        oLocalStorageContent: {},
        expectedResolutionResult: {
            applicationType: "TR",
            navigationMode: "newWindowThenEmbedded",
            explicitNavMode: false,
            contentProviderId: undefined,
            extendedInfo: {
                appParams: {
                    "sap-system": [
                        "SYSCONNSTRING"
                    ]
                },
                system: undefined
            },
            reservedParameters: {},
            "sap-system": "SYSCONNSTRING",
            text: undefined,
            systemAlias: "SYSCONNSTRING",
            url: "https://example.corp.com:44355/sap/bc/gui/sap/its/webgui;~connectString=%2fH%2fCoffee%2fS%2fDecaf%2fG%2fRoast;~service=3255;~sncNameR3=p%2fsecude%3aCN%3dUR3%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=8?%7etransaction=%2FSAPSLL%2FCLSNR_01&%7enosplash=1&sap-client=120&sap-language=en&sap-iframe-hint=GUI",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#87 WebGUI Target, with no sap system and local system alias from server, and apply semantics",
        intent: "Action-toCdmGuiTarget", // NOTE: sap-system wins here
        inbound: oTestHelper.createInbound("#Action-toCdmGuiTarget{<no params><+>}", {
            "sap.gui": {
                _version: "1.2.0",
                transaction: "/SAPSLL/CLSNR_01"
            },
            applicationType: "TR",
            systemAliasSemantics: "apply",
            text: "Manage Commodity Codes"
        }),
        oKnownSapSystemData: {
            "": {
                https: {
                    id: "",
                    host: "server.example.com", // NOTE: this causes protocol to be added to the URL.
                    port: 0, // 0: null port
                    pathPrefix: "/sap/bc2/" // pathPrefix always prepended to URL.
                }
            }
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "TR",
        expectedUrl: "https://server.example.com/sap/bc2/gui/sap/its/webgui?%7etransaction=%2FSAPSLL%2FCLSNR_01&%7enosplash=1&sap-language=en&sap-iframe-hint=GUI"
    }, {
        testDescription: "#88 Absolute URL, system alias with path prefix, sap-system with path prefix",
        intent: "Action-aliasToAbsoluteUrl?sap-system=ALIAS111",
        inbound: oTestHelper.createInbound("#Action-aliasToAbsoluteUrl{<no params><o>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "http://www.google.com/sap/bc/to/the/moon.html",
            systemAlias: "ALIASRFC"
        }),
        oKnownSapSystemData: {
            ALIAS111: O_KNOWN_SYSTEM_ALIASES.SYS_WITH_PATH,
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.ALIASRFC
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "URL",
        expectedUrl: "http://www.google.com/sap/bc/to/the/moon.html"
    }, {
        testDescription: "#89 Absolute URL, with user-env parameters added",
        UserEnvParameters: {
            "sap-accessibility": "X",
            "sap-statistics": true,
            "sap-language": "ZH"
        },
        intent: "Action-aliasToAbsoluteUrl?sap-system=ALIAS111&param1=value1&param2=value2",
        inbound: oTestHelper.createInbound("#Action-aliasToAbsoluteUrl{[mylanguage:[@User.env.sap-language@]],[mystatistics:[@User.env.sap-statistics@]],[myaccess:[@User.env.sap-accessibility@]]<+>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "http://www.google.com/sap/bc/to/the/moon.html",
            systemAlias: "ALIASRFC"
        }),
        oKnownSapSystemData: {
            ALIAS111: O_KNOWN_SYSTEM_ALIASES.SYS_WITH_PATH,
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.ALIASRFC
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "URL",
        expectedUrl: "http://www.google.com/sap/bc/to/the/moon.html?myaccess=X&mylanguage=ZH&mystatistics=true&param1=value1&param2=value2"
    }, {
        testDescription: "#90 relative Intent URL with with parameters (default configuration used)",
        intent: "Employee-display?C=E&D=F&E=K",
        inbound: oTestHelper.createInbound("#Employee-display{[C:],[D:]<o>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "/path/to/FioriLaunchpad.html?sap-theme=sap_belize#Action-toappnavsample?p1=v1",
            systemAlias: "ALIASRFC"
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120,
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.ALIASRFC
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "URL",
        expectedUrl: "/path/to/FioriLaunchpad.html?sap-theme=sap_belize#Action-toappnavsample?C=E&D=F&p1=v1"
    }, {
        testDescription: "#91 relative Intent URL with with parameters (non default FLP URL)",
        intent: "Employee-display?C=E&D=F&E=K",
        inbound: oTestHelper.createInbound("#Employee-display{[C:],[D:]<o>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "/path/to/index.html?sap-theme=sap_belize#Action-toappnavsample?p1=v1",
            systemAlias: "ALIASRFC"
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120,
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.ALIASRFC
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "URL",
        expectedUrl: "/path/to/index.html?sap-theme=sap_belize&C=E&D=F#Action-toappnavsample?p1=v1"
    }, {
        testDescription: "#92 relative Intent URL with with parameters (non default FLP URL + configuration)",
        intent: "Employee-display?C=E&D=F&E=K",
        inbound: oTestHelper.createInbound("#Employee-display{[C:],[D:]<o>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "/path/to/index.html?sap-theme=sap_belize#Action-toappnavsample?p1=v1",
            systemAlias: "ALIASRFC"
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120,
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.ALIASRFC
        },
        oCSTRConfig: {
            config: {
                flpURLDetectionPattern: "[/]index.html"
            }
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "URL",
        expectedUrl: "/path/to/index.html?sap-theme=sap_belize#Action-toappnavsample?C=E&D=F&p1=v1"
    }, {
        testDescription: "#93 Absolute URL, with user-env parameters added value accessiblity, statistics turned off!",
        UserEnvParameters: {
            "sap-accessibility": false,
            "sap-statistics": false,
            "sap-language": "ZH"
        },
        intent: "Action-aliasToAbsoluteUrl?sap-system=ALIAS111&param1=value1&param2=value2",
        inbound: oTestHelper.createInbound("#Action-aliasToAbsoluteUrl{[mylanguage:[@User.env.sap-language@]],[mystatistics:[@User.env.sap-statistics@]],[myaccess:[@User.env.sap-accessibility@]]<+>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "http://www.google.com/sap/bc/to/the/moon.html",
            systemAlias: "ALIASRFC"
        }),
        oKnownSapSystemData: {
            ALIAS111: O_KNOWN_SYSTEM_ALIASES.SYS_WITH_PATH,
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.ALIASRFC
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "URL",
        expectedUrl: "http://www.google.com/sap/bc/to/the/moon.html?mylanguage=ZH&param1=value1&param2=value2"
    }, {
        testDescription: "#94 Absolute URL, system alias with path prefix, sap-system with path prefix + intent parameters",
        intent: "Action-aliasToAbsoluteUrl?sap-system=ALIAS111&param1=value1&param2=value2",
        inbound: oTestHelper.createInbound("#Action-aliasToAbsoluteUrl{<no params><+>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "http://www.google.com/sap/bc/to/the/moon.html",
            systemAlias: "ALIASRFC"
        }),
        oKnownSapSystemData: {
            ALIAS111: O_KNOWN_SYSTEM_ALIASES.SYS_WITH_PATH,
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.ALIASRFC
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "URL",
        expectedUrl: "http://www.google.com/sap/bc/to/the/moon.html?param1=value1&param2=value2"
    }, {
        testDescription: "#95 Absolute URL with parameter and hash (no hash parameters) and sap-system",
        // ignore certain fields not needed for the test
        intent: "Action-aliasToAbsoluteUrl?C=E&D=F&sap-system=UR3CLNT120",
        inbound: oTestHelper.createInbound("#Action-aliasToAbsoluteUrl{[C:],[D:]<+>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "http://www.google.com/sap/bc/to/the/moon.html#SoIsses",
            systemAlias: "ALIASRFC"
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120,
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.ALIASRFC
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "URL",
        expectedUrl: "http://www.google.com/sap/bc/to/the/moon.html?C=E&D=F#SoIsses"
    }, {
        testDescription: "#96 relative URL with parameter and hash (no hash parameters) and no sap-system",
        // ignore certain fields not needed for the test
        intent: "Action-aliasToAbsoluteUrl?C=E&D=F&E=K",
        inbound: oTestHelper.createInbound("#Action-aliasToAbsoluteUrl{[C:],[D:]<o>}", {
            additionalInformation: "",
            applicationType: "URL",
            ui5ComponentName: "",
            url: "/sap/bc/to/the/moon.html?A=B#SoIsses",
            systemAlias: "ALIASRFC"
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120,
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.ALIASRFC
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "URL",
        expectedUrl: "/sap/bc/to/the/moon.html?A=B&C=E&D=F#SoIsses"
    }, {
        testDescription: "#97 an Easy User Access Menu transaction is resolved",
        // ignore certain fields not needed for the test
        intent: "Shell-startGUI?sap-system=ALIASRFC&sap-ui2-tcode=SU01",
        inbound: oTestHelper.createInbound("#Shell-startGUI{sap-system:ALIASRFC<+>}", {
            applicationType: "whatever",
            additionalInformation: "whatever",
            text: "System U1Y on current client",
            url: "whatever",
            systemAlias: "whatever"
        }),
        oKnownSapSystemData: {
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.ALIASRFC
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "TR",
        expectedUrl: "https://example.corp.com:1111/path/gui/sap/its/webgui;~sysid=UV2;~loginGroup=SPACE;~messageServer=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncNameR3=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=9?" +
            "%7etransaction=SU01&%7enosplash=1&sap-client=220&sap-language=en&sap-iframe-hint=GUI"
    }, {
        testDescription: "#98 an Easy User Access Menu transaction with parameters (!) is resolved",
        // ignore certain fields not needed for the test
        intent: "Shell-startGUI?sap-system=ALIASRFC&sap-ui2-tcode=SU01&USER=ANTONvonWERNER&QUOTE=MeinLieberAntonWerner%20SieStehnMirEtwasFerner",
        inbound: oTestHelper.createInbound("#Shell-startGUI{sap-system:ALIASRFC<+>}", {
            applicationType: "whatever",
            additionalInformation: "whatever",
            text: "System U1Y on current client",
            url: "whatever",
            systemAlias: "whatever"
        }),
        oKnownSapSystemData: {
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.ALIASRFC
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "TR",
        expectedUrl: "https://example.corp.com:1111/path/gui/sap/its/webgui;~sysid=UV2;~loginGroup=SPACE;~messageServer=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncNameR3=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=9?" +
            "%7etransaction=*SU01%20QUOTE%3dMeinLieberAntonWerner%20SieStehnMirEtwasFerner%3bUSER%3dANTONvonWERNER%3b&%7enosplash=1&sap-client=220&sap-language=en&sap-iframe-hint=GUI"
    }, {
        testDescription: "#99 an Easy User Access Menu WDA target is resolved",
        // ignore certain fields not needed for the test
        intent: "Shell-startWDA?sap-system=UR3CLNT120&sap-ui2-wd-app-id=EPM_POWL",
        inbound: oTestHelper.createInbound("#Shell-startWDA{sap-system:UR3CLNT120<+>}", {
            applicationType: "whatever",
            additionalInformation: "whatever",
            text: "System U1Y on current client",
            url: "whatever",
            systemAlias: "whatever"
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "WDA",
        expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?sap-client=120&sap-language=en&sap-iframe-hint=NWBC"
    }, {
        testDescription: "#100 test WDA EAM navigation from legacy application with inplace WDA navigation configured",
        // This test has a common input with the test above, but aims at testing other aspects
        intent: "Shell-startWDA?sap-system=UR3CLNT120&sap-ui2-wd-app-id=EPM_POWL",
        inbound: oTestHelper.createInbound("#Shell-startWDA{sap-system:UR3CLNT120<+>}", {
            applicationType: "WDA",
            additionalInformation: "whatever",
            text: "System U1Y on current client",
            url: "whatever",
            systemAlias: "whatever"
        }, {
            title: "System U1Y on current client",
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        // --- end of common input
        sCurrentApplicationType: "WDA",
        oCSTRConfig: {
            config: {
                enableInPlaceForClassicUIs: { WDA: true }
            }
        },
        expectedResolutionResult: {
            additionalInformation: "",
            // no navigation mode property added
            applicationType: "WDA",
            navigationMode: "embedded",
            explicitNavMode: false,
            "sap-system": "UR3CLNT120",
            systemAlias: "UR3CLNT120",
            text: "EPM_POWL",
            url: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?sap-client=120&sap-language=en&sap-iframe-hint=NWBC",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#101 test WDA EAM navigation non-legacy application with inplace WDA navigation configured",
        // This test has a common input with the test above, but aims at testing other aspects
        intent: "Shell-startWDA?sap-system=UR3CLNT120&sap-ui2-wd-app-id=EPM_POWL",
        inbound: oTestHelper.createInbound("#Shell-startWDA{sap-system:UR3CLNT120<+>}", {
            applicationType: "WDA",
            additionalInformation: "whatever",
            text: "System U1Y on current client",
            url: "whatever",
            systemAlias: "whatever"
        }, {
            title: "System U1Y on current client",
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        // --- end of common input
        sCurrentApplicationType: "UI5",
        oCSTRConfig: {
            config: {
                enableInPlaceForClassicUIs: { WDA: true }
            }
        },
        expectedResolutionResult: {
            additionalInformation: "",
            applicationType: "WDA",
            navigationMode: "embedded",
            explicitNavMode: false,
            "sap-system": "UR3CLNT120",
            systemAlias: "UR3CLNT120",
            text: "EPM_POWL",
            url: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?sap-client=120&sap-language=en&sap-iframe-hint=NWBC",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#102 an Easy User Access Menu WDA target with configuration is resolved",
        // ignore certain fields not needed for the test
        intent: "Shell-startWDA?sap-system=UR3CLNT120&sap-ui2-wd-app-id=EPM_POWL&sap-ui2-wd-conf-id=CO!@^*()_+\":{}<>NFIG",
        inbound: oTestHelper.createInbound("#Shell-startWDA{sap-system:UR3CLNT120<+>}", {
            applicationType: "whatever",
            additionalInformation: "whatever",
            text: "System U1Y on current client",
            url: "whatever",
            systemAlias: "whatever"
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "WDA",
        expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?sap-wd-configId=CO!%40%5E*()_%20%22%3A%7B%7D%3C%3ENFIG&sap-client=120&sap-language=en&sap-iframe-hint=NWBC"
    }, {
        testDescription: "#103 an Easy User Access Menu WDA target with configuration & application parameters is resolved",
        // ignore certain fields not needed for the test
        intent: "Shell-startWDA?sap-system=UR3CLNT120&sap-ui2-wd-app-id=EPM_POWL&appParam1=appValue1&sap-ui2-wd-conf-id=CO!@^*()_+\":{}<>NFIG&appParam5=appValue5",
        inbound: oTestHelper.createInbound("#Shell-startWDA{sap-system:UR3CLNT120<+>}", {
            "sap.platform.runtime": { anything: "copied" },
            applicationType: "WDA",
            additionalInformation: "whatever",
            text: "System U1Y on current client",
            url: "whatever",
            systemAlias: "whatever"
        }, {
            title: "System U1Y on current client",
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "WDA",
        expectedResolutionResult: {
            additionalInformation: "",
            applicationType: "WDA",
            "sap-system": "UR3CLNT120",
            systemAlias: "UR3CLNT120",
            navigationMode: "newWindowThenEmbedded",
            explicitNavMode: false,
            text: "EPM_POWL",
            url: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?appParam1=appValue1&appParam5=appValue5&sap-wd-configId=CO!%40%5E*()_%20%22%3A%7B%7D%3C%3ENFIG&sap-client=120&sap-language=en&sap-iframe-hint=NWBC",
            "sap.platform.runtime": { anything: "copied" },
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        },
        expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?appParam1=appValue1&appParam5=appValue5&sap-wd-configId=CO!%40%5E*()_%20%22%3A%7B%7D%3C%3ENFIG&sap-client=120&sap-language=en&sap-iframe-hint=NWBC"
    }, {
        testDescription: "#104 an Shell-launchURL record is resolved with parameter stripped!",
        // ignore certain fields not needed for the test
        intent: "Shell-launchURL?sap-external-url=http:%2F%2Fwww.nytimes.com",
        inbound: oTestHelper.createInbound("#Shell-launchURL{sap-external-url:http://www.nytimes.com<+>}", {
            applicationType: "URL",
            text: "System U1Y on current client",
            url: "http://www.nytimes.com"
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "URL",
        expectedUrl: "http://www.nytimes.com"
    }, {
        testDescription: "#105 a system alias is resolved to an object with 'rfc: {}' and '{ https : { port: \"\" }}'",
        // We need to make sure we support that a system alias is resolved
        // in the format specified in EMPTY_PORT_PREFIX_RFC system alias. This
        // is what HCP uses in the end.
        intent: "Flight-lookup",
        inbound: oTestHelper.createInbound("#Flight-lookup{<no params><o>}", {
            componentProperties: {
                html5AppName: "",
                siteId: "28000d99-ce12-4d95-98c2-eb0409d6c6b8",
                appId: "9c3b3414-e26e-46c1-89fa-4022b088097c-1465888775169"
            },
            "sap.platform.runtime": {
                componentProperties: {
                    html5AppName: "",
                    siteId: "28000d99-ce12-4d95-98c2-eb0409d6c6b8",
                    appId: "9c3b3414-e26e-46c1-89fa-4022b088097c-1465888775169"
                }
            },
            "sap.wda": {
                _version: "1.3.0",
                applicationId: "FPM_TEST_SADL_ATTR_FILT_SBOOK",
                configId: ""
            },
            applicationType: "WDA",
            systemAlias: "ABAP_BACKEND_FOR_DEMO",
            text: "Browse Flight Bookings"
        }),
        oKnownSapSystemData: {
            ABAP_BACKEND_FOR_DEMO: O_KNOWN_SYSTEM_ALIASES.EMPTY_PORT_PREFIX_RFC
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "WDA",
        expectedUrl: "https://system.our.domain.corp/sap/bc/ui2/nwbc/~canvas;window=app/wda/FPM_TEST_SADL_ATTR_FILT_SBOOK/?sap-language=en&sap-iframe-hint=NWBC"
    }, {
        // When CSTR is configured to open WDA applications in embedded
        // mode, the navigation mode must be "embedded" in the result.
        testDescription: "#106 embedded navigation mode for WDA is configured, and 'WDA' processor is used",
        intent: "Action-towda",
        inbounds: [oTestHelper.createInbound("#Action-towda", {
            applicationType: "WDA",
            "sap.ui": { technology: "WDA" },
            url: "/some/wda/app"
        }, {
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        })],
        oCSTRConfig: {
            config: {
                enableInPlaceForClassicUIs: { WDA: true }
            }
        },
        expectedResolutionResult: {
            applicationType: "WDA",
            contentProviderId: undefined,
            extendedInfo: {
                appParams: {},
                system: undefined
            },
            navigationMode: "embedded",
            explicitNavMode: false,
            reservedParameters: {},
            "sap-system": undefined,
            text: undefined,
            url: "/some/wda/app?sap-iframe-hint=WDA",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        // Embedded navigation mode should also works for results constructed entirely locally
        testDescription: "#107 embedded navigation mode for WDA when is to be resolved via 'WDA full url construction' processor",
        intent: "Action-towda",
        oKnownSapSystemData: {
            ABAP_BACKEND_FOR_DEMO: O_KNOWN_SYSTEM_ALIASES.EMPTY_PORT_PREFIX_RFC
        },
        inbounds: [oTestHelper.createInbound("#Action-towda", {
            "sap.wda": {
                _version: "1.2.0",
                applicationId: "FIS_FPM_OVP_STKEYFIGITEMCO",
                configId: "FIS_FPM_OVP_STKEYFIGITEMCO"
            },
            applicationType: "WDA",
            systemAlias: "ABAP_BACKEND_FOR_DEMO",
            text: "Statistical Key Figures"
        }, {
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        })],
        oCSTRConfig: {
            config: {
                enableInPlaceForClassicUIs: { WDA: true }
            }
        },
        expectedResolutionResult: {
            applicationType: "WDA",
            contentProviderId: undefined,
            extendedInfo: {
                appParams: {},
                system: undefined
            },
            navigationMode: "embedded",
            explicitNavMode: false,
            reservedParameters: {},
            "sap-system": undefined,
            text: undefined,
            systemAlias: "ABAP_BACKEND_FOR_DEMO",
            url: "https://system.our.domain.corp/sap/bc/ui2/nwbc/~canvas;window=app/wda/FIS_FPM_OVP_STKEYFIGITEMCO/?sap-wd-configId=FIS_FPM_OVP_STKEYFIGITEMCO&sap-language=en&sap-iframe-hint=NWBC",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        // Test that sap-system-src and sap-system are taken into account when when WDA is constructed entirely locally
        testDescription: "#108 'WDA full url construction' processor takes into account sap-system and sap-system-src",
        intent: "Action-towda?sap-system=UR3CLNT120&sap-system-src=OTHERSYSTEM",
        oKnownSapSystemData: {
            ABAP_BACKEND_FOR_DEMO: O_KNOWN_SYSTEM_ALIASES.EMPTY_PORT_PREFIX_RFC,
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        inbounds: [oTestHelper.createInbound("#Action-towda{<no params><+>}", {
            "sap.wda": {
                _version: "1.2.0",
                applicationId: "FIS_FPM_OVP_STKEYFIGITEMCO",
                configId: "FIS_FPM_OVP_STKEYFIGITEMCO"
            },
            applicationType: "WDA",
            systemAlias: "ABAP_BACKEND_FOR_DEMO",
            text: "Statistical Key Figures"
        }, {
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        })],
        oLocalStorageContent: {
            "sap-system-data#OTHERSYSTEM:UR3CLNT120": (function (oSystemData) {
                // stored data are different than the adapter's data
                oSystemData.language = "DE";
                oSystemData.client = "200";
                oSystemData.https.host = "ur3.example.corp.com";
                oSystemData.https.port = 8080;

                return JSON.stringify(oSystemData);
            })(deepExtend({}, O_KNOWN_SYSTEM_ALIASES.UR3CLNT120))
        },
        expectedResolutionResult: {
            applicationType: "WDA",
            contentProviderId: undefined,
            navigationMode: "newWindowThenEmbedded",
            explicitNavMode: false,
            extendedInfo: {
                appParams: {
                    "sap-system": [
                        "UR3CLNT120"
                    ],
                    "sap-system-src": [
                        "OTHERSYSTEM"
                    ]
                },
                system: undefined
            },
            reservedParameters: {},
            "sap-system": "UR3CLNT120",
            "sap-system-src": "OTHERSYSTEM",
            text: undefined,
            systemAlias: "UR3CLNT120",
            url: "https://ur3.example.corp.com:8080/sap/bc/ui2/nwbc/~canvas;window=app/wda/FIS_FPM_OVP_STKEYFIGITEMCO/?sap-wd-configId=FIS_FPM_OVP_STKEYFIGITEMCO&sap-client=200&sap-language=DE&sap-system-src=OTHERSYSTEM&sap-iframe-hint=NWBC",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        // When CSTR is configured to open GUI applications in embedded
        // mode, the navigation mode must be "embedded" in the result.
        testDescription: "#109 embedded navigation mode for GUI is configured",
        intent: "Action-togui",
        inbounds: [oTestHelper.createInbound("#Action-togui", {
            applicationType: "TR",
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN",
            "sap.ui": { technology: "GUI" }
        }, {
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        })],
        oCSTRConfig: {
            config: {
                enableInPlaceForClassicUIs: { GUI: true }
            }
        },
        expectedResolutionResult: {
            applicationType: "TR",
            contentProviderId: undefined,
            extendedInfo: {
                appParams: {},
                system: undefined
            },
            navigationMode: "embedded",
            explicitNavMode: false,
            reservedParameters: {},
            "sap-system": undefined,
            text: undefined,
            url: "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN&sap-iframe-hint=GUI",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#110 an intent matches a virtual target mapping",
        intent: "Action-search",
        inbounds: oTestHelper.getVirtualInbounds(),
        expectedResolutionResult: {
            additionalInformation: "SAPUI5.Component=sap.ushell.renderer.search.searchComponent",
            applicationType: "SAPUI5",
            navigationMode: "embedded",
            explicitNavMode: false,
            extendedInfo: {
                appParams: {},
                system: undefined
            },
            contentProviderId: undefined,
            "sap-system": undefined,
            text: undefined,
            ui5ComponentName: "sap.ushell.renderer.search.searchComponent",
            url: sap.ui.require.toUrl("sap/ushell/renderer/search/searchComponent"),
            reservedParameters: {},
            inboundPermanentKey: undefined
        }
    }, {
        testDescription: "#111 an intent matches a virtual target mapping",
        intent: "Action-search",
        inbounds: [], // note, adapter returns no inbound
        expectedResolutionResult: {
            additionalInformation: "SAPUI5.Component=sap.ushell.renderer.search.searchComponent",
            applicationType: "SAPUI5",
            navigationMode: "embedded",
            explicitNavMode: false,
            extendedInfo: {
                appParams: {},
                system: undefined
            },
            contentProviderId: undefined,
            "sap-system": undefined,
            text: undefined,
            ui5ComponentName: "sap.ushell.renderer.search.searchComponent",
            url: sap.ui.require.toUrl("sap/ushell/renderer/search/searchComponent"),
            reservedParameters: {},
            inboundPermanentKey: undefined
        }
    }, {
        testDescription: "#112 sap-tag parameter is not propagated to the resolved SAPUI5 URL",
        intent: "Object-act1",
        inbounds: [oTestHelper.createInbound("#Object-act1{[sap-tag:[superior]]}", {
            applicationType: "SAPUI5",
            additionalInformation: "SAPUI5.Component=Test.Component",
            "sap.ui": { technology: "UI5" },
            url: "/some/app"
        }, {
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        })],
        expectedResolutionResult: {
            applicationType: "SAPUI5",
            additionalInformation: "SAPUI5.Component=Test.Component",
            navigationMode: "embedded",
            explicitNavMode: false,
            extendedInfo: {
                appParams: {},
                system: undefined
            },
            contentProviderId: undefined,
            "sap-system": undefined,
            text: undefined,
            url: "/some/app",
            reservedParameters: {},
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#113 sap-tag parameter is not propagated to the resolved WDA URL",
        intent: "Object-act1",
        inbounds: [oTestHelper.createInbound("#Object-act1{[sap-tag:[superior]]}", {
            applicationType: "WDA",
            "sap.ui": { technology: "WDA" },
            url: "/some/wda/app"
        }, {
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        })],
        expectedResolutionResult: {
            applicationType: "WDA",
            navigationMode: "newWindowThenEmbedded",
            explicitNavMode: false,
            contentProviderId: undefined,
            extendedInfo: {
                appParams: {},
                system: undefined
            },
            reservedParameters: {},
            "sap-system": undefined,
            text: undefined,
            url: "/some/wda/app?sap-iframe-hint=WDA",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#114 sap-tag parameter is not propagated to the resolved GUI URL",
        intent: "Object-act1",
        inbounds: [oTestHelper.createInbound("#Object-act1{[sap-tag:[superior]]}", {
            applicationType: "TR",
            "sap.ui": { technology: "GUI" },
            url: "/path/gui/sap/its/webgui;"
        }, {
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        })],
        expectedResolutionResult: {
            applicationType: "TR",
            navigationMode: "newWindowThenEmbedded",
            explicitNavMode: false,
            contentProviderId: undefined,
            extendedInfo: {
                appParams: {},
                system: undefined
            },
            reservedParameters: {},
            "sap-system": undefined,
            text: undefined,
            url: "/path/gui/sap/its/webgui;?&&sap-iframe-hint=GUI",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#115 sap-tag and sap-fiori-id parameters are not propagated to the resolved GUI URL",
        intent: "Object-act1?sap-fiori-id=12345",
        inbounds: [oTestHelper.createInbound("#Object-act1{[sap-tag:[superior]]}", {
            applicationType: "TR",
            "sap.ui": { technology: "GUI" },
            url: "/path/gui/sap/its/webgui;"
        }, {
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        })],
        expectedResolutionResult: {
            applicationType: "TR",
            navigationMode: "newWindowThenEmbedded",
            explicitNavMode: false,
            contentProviderId: undefined,
            extendedInfo: {
                appParams: {},
                system: undefined
            },
            reservedParameters: {
                "sap-fiori-id": ["12345"]
            },
            "sap-system": undefined,
            text: undefined,
            url: "/path/gui/sap/its/webgui;?&&sap-iframe-hint=GUI",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#116 sap-ui-fl-max-layer is provided in the inbound as a default parameter for a SAPUI5 target",
        intent: "Object-act1",
        inbounds: [oTestHelper.createInbound("#Object-act1{[sap-ui-fl-max-layer:[TEST]]}", {
            applicationType: "SAPUI5",
            additionalInformation: "SAPUI5.Component=Test.Component",
            "sap.ui": { technology: "UI5" },
            url: "/some/app"
        }, {
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        })],
        expectedResolutionResult: {
            applicationType: "SAPUI5",
            additionalInformation: "SAPUI5.Component=Test.Component",
            navigationMode: "embedded",
            explicitNavMode: false,
            extendedInfo: {
                appParams: {},
                system: undefined
            },
            contentProviderId: undefined,
            reservedParameters: {
                "sap-ui-fl-max-layer": ["TEST"]
            },
            "sap-system": undefined,
            text: undefined,
            url: "/some/app",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#117 sap-ui-fl-max-layer is provided in the intent",
        intent: "Object-act1?sap-ui-fl-max-layer=TEST",
        inbounds: [oTestHelper.createInbound("#Object-act1{<->}", { // <-> : notallowed
            // but sap- parameters
            // ignore additionalParameters.
            applicationType: "SAPUI5",
            additionalInformation: "SAPUI5.Component=Test.Component",
            "sap.ui": { technology: "UI5" },
            url: "/some/app"
        }, {
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        })],
        expectedResolutionResult: {
            applicationType: "SAPUI5",
            additionalInformation: "SAPUI5.Component=Test.Component",
            navigationMode: "embedded",
            explicitNavMode: false,
            extendedInfo: {
                appParams: {},
                system: undefined
            },
            contentProviderId: undefined,
            reservedParameters: {
                "sap-ui-fl-max-layer": ["TEST"] // from intent
            },
            "sap-system": undefined,
            text: undefined,
            url: "/some/app",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#118 sap-ui-fl-max-layer and sap-fiori-id are provided in the intent",
        intent: "Object-act1?sap-ui-fl-max-layer=TEST&sap-fiori-id=12345",
        inbounds: [oTestHelper.createInbound("#Object-act1{<->}", { // <-> : notallowed
            // but sap- parameters
            // ignore additionalParameters.
            applicationType: "SAPUI5",
            additionalInformation: "SAPUI5.Component=Test.Component",
            "sap.ui": { technology: "UI5" },
            url: "/some/app"
        }, {
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        })],
        expectedResolutionResult: {
            applicationType: "SAPUI5",
            additionalInformation: "SAPUI5.Component=Test.Component",
            navigationMode: "embedded",
            explicitNavMode: false,
            extendedInfo: {
                appParams: {},
                system: undefined
            },
            contentProviderId: undefined,
            reservedParameters: {
                "sap-ui-fl-max-layer": ["TEST"], // from intent
                "sap-fiori-id": ["12345"]
            },
            "sap-system": undefined,
            text: undefined,
            url: "/some/app",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#119 sap-system-src is provided in the intent",
        intent: "Object-act1?sap-system=ABC&sap-system-src=DEF",
        inbounds: [oTestHelper.createInbound("#Object-act1{<+>}", {
            applicationType: "SAPUI5",
            additionalInformation: "SAPUI5.Component=Test.Component",
            "sap.ui": { technology: "UI5" },
            url: "/some/app"
        }, {
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        })],
        expectedResolutionResult: {
            applicationType: "SAPUI5",
            additionalInformation: "SAPUI5.Component=Test.Component",
            navigationMode: "embedded",
            explicitNavMode: false,
            extendedInfo: {
                appParams: {
                    "sap-system": [
                        "ABC"
                    ],
                    "sap-system-src": [
                        "DEF"
                    ]
                },
                system: undefined
            },
            contentProviderId: undefined,
            reservedParameters: {},
            "sap-system": "ABC",
            "sap-system-src": "DEF",
            text: undefined,
            url: "/some/app?sap-system=ABC&sap-system-src=DEF",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#120 sap-ui-fl-control-variant-id is provided in the intent",
        intent: "Object-act1?sap-ui-fl-control-variant-id=TEST",
        inbounds: [oTestHelper.createInbound("#Object-act1{<->}", { // <-> : notallowed
            // but sap- parameters
            // ignore additionalParameters.
            applicationType: "SAPUI5",
            additionalInformation: "SAPUI5.Component=Test.Component",
            url: "/some/app"
        }, {
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        })],
        expectedResolutionResult: {
            applicationType: "SAPUI5",
            additionalInformation: "SAPUI5.Component=Test.Component",
            navigationMode: "embedded",
            explicitNavMode: false,
            extendedInfo: {
                appParams: {},
                system: undefined
            },
            contentProviderId: undefined,
            reservedParameters: {
                "sap-ui-fl-control-variant-id": ["TEST"] // from intent
            },
            "sap-system": undefined,
            text: undefined,
            url: "/some/app",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#121 sap-ui-fl-max-layer is a mandatory filter",
        intent: "Object-act1?sap-ui-fl-max-layer=FOO",
        inbounds: [oTestHelper.createInbound("#Object-act1{sap-ui-fl-max-layer:FOO<->}", {
            applicationType: "SAPUI5",
            additionalInformation: "SAPUI5.Component=Test.Component",
            "sap.ui": { technology: "UI5" },
            url: "/some/app"
        }, {
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        })],
        expectedResolutionResult: {
            applicationType: "SAPUI5",
            additionalInformation: "SAPUI5.Component=Test.Component",
            navigationMode: "embedded",
            explicitNavMode: false,
            extendedInfo: {
                appParams: {},
                system: undefined
            },
            contentProviderId: undefined,
            reservedParameters: {
                "sap-ui-fl-max-layer": ["FOO"]
            },
            "sap-system": undefined,
            text: undefined,
            url: "/some/app",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        // sap-ui-tech-hint=WDA can be used to select a WDA target
        testDescription: "#122 sap-ui-tech-hint=WDA specified in intent but not in inbound",
        intent: "Object-action?sap-ui-tech-hint=WDA",
        inbounds: [
            oTestHelper.createInbound("#Object-action{<no params><+>}", {
                applicationType: "SAPUI5",
                "sap.ui": { technology: "UI5" },
                url: "/some/ui5app"
            }),
            oTestHelper.createInbound("#Object-action{<no params><+>}", {
                applicationType: "WDA",
                "sap.ui": { technology: "WDA" },
                url: "/some/wdaApp"
            }, {
                permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            })
        ],
        expectedResolutionResult: {
            applicationType: "WDA",
            navigationMode: "newWindowThenEmbedded",
            explicitNavMode: false,
            contentProviderId: undefined,
            extendedInfo: {
                appParams: {
                    "sap-ui-tech-hint": [
                        "WDA"
                    ]
                },
                system: undefined
            },
            reservedParameters: {},
            "sap-system": undefined,
            text: undefined,
            url: "/some/wdaApp?sap-ui-tech-hint=WDA&sap-iframe-hint=WDA", // sap-ui-tech-hint propagated
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        // sap-ui-tech-hint used as filter
        testDescription: "#123 sap-ui-tech-hint=WDA specified in intent and UI5 inbound with sap-ui-tech-hint=WDA filter",
        intent: "Object-action?sap-ui-tech-hint=WDA",
        inbounds: [
            oTestHelper.createInbound("#Object-action{sap-ui-tech-hint:WDA<+>}", { // generally it's wrong, but this proves tech priority is
                // even more effective than filtering
                applicationType: "SAPUI5",
                "sap.ui": { technology: "UI5" },
                url: "/some/ui5app"
            }),
            oTestHelper.createInbound("#Object-action{<no params><->}", { // still wins
                applicationType: "WDA",
                "sap.ui": { technology: "WDA" },
                url: "/some/wdaApp"
            }, {
                permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            })
        ],
        expectedResolutionResult: {
            applicationType: "WDA",
            navigationMode: "newWindowThenEmbedded",
            explicitNavMode: false,
            contentProviderId: undefined,
            extendedInfo: {
                appParams: {
                    "sap-ui-tech-hint": [
                        "WDA"
                    ]
                },
                system: undefined
            },
            reservedParameters: {},
            "sap-system": undefined,
            text: undefined,
            url: "/some/wdaApp?sap-ui-tech-hint=WDA&sap-iframe-hint=WDA", // sap-ui-tech-hint propagated
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        // sap-ui-app-id-hint=app3 can be used to select the target with id=app3
        testDescription: "#124 sap-ui-app-id-hint=app3 specified in intent but not in inbound",
        intent: "Object-action?sap-ui-app-id-hint=app3",
        inbounds: [
            oTestHelper.createInbound("#Object-action{<no params><+>}", {
                appId: "app1",
                applicationType: "SAPUI5",
                additionalInformation: "SAPUI5.Component=Test1.Component",
                url: ""
            }, {
                title: "app1",
                permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOBB"
            }),
            oTestHelper.createInbound("#Object-action{<no params><+>}", {
                appId: "app2",
                applicationType: "SAPUI5",
                additionalInformation: "SAPUI5.Component=Test2.Component",
                url: ""
            }, {
                title: "app2",
                permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOAA"
            }),
            oTestHelper.createInbound("#Object-action{<no params><+>}", {
                appId: "app3",
                applicationType: "SAPUI5",
                additionalInformation: "SAPUI5.Component=Test3.Component",
                url: ""
            }, {
                title: "app3",
                permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            })
        ],
        expectedResolutionResult: {
            applicationType: "SAPUI5",
            additionalInformation: "SAPUI5.Component=Test3.Component",
            navigationMode: "embedded",
            explicitNavMode: false,
            extendedInfo: {
                appParams: {},
                system: undefined
            },
            contentProviderId: undefined,
            reservedParameters: {
                "sap-ui-app-id-hint": ["app3"]
            },
            "sap-system": undefined,
            text: "app3",
            url: "",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        // sap-ui-app-id-hint=app5 will still navigate to an app although no app with id=app5 exists
        testDescription: "#125 wrong sap-ui-app-id-hint=app5 specified in intent - shouldn't have an effect",
        intent: "Object-action?sap-ui-app-id-hint=app5",
        inbounds: [
            oTestHelper.createInbound("#Object-action{<no params><+>}", {
                appId: "app1",
                applicationType: "SAPUI5",
                additionalInformation: "SAPUI5.Component=Test1.Component",
                url: ""
            }, {
                title: "app1",
                permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOAA"
            }),
            oTestHelper.createInbound("#Object-action{<no params><+>}", {
                appId: "app2",
                applicationType: "SAPUI5",
                additionalInformation: "SAPUI5.Component=Test2.Component",
                url: ""
            }, {
                title: "app2",
                permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOBB"
            }),
            oTestHelper.createInbound("#Object-action{<no params><+>}", {
                appId: "app3",
                applicationType: "SAPUI5",
                additionalInformation: "SAPUI5.Component=Test3.Component",
                url: ""
            }, {
                title: "app3",
                permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            })
        ],
        expectedResolutionResult: {
            applicationType: "SAPUI5",
            additionalInformation: "SAPUI5.Component=Test3.Component",
            navigationMode: "embedded",
            explicitNavMode: false,
            extendedInfo: {
                appParams: {},
                system: undefined
            },
            contentProviderId: undefined,
            reservedParameters: {
                "sap-ui-app-id-hint": ["app5"]
            },
            "sap-system": undefined,
            text: "app3",
            url: "",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#126 a WCF target with system alias is resolved",
        intent: "WCF-displayTarget",
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        inbound: oTestHelper.createInbound("#WCF-displayTarget{<no params><+>}", {
            applicationType: "WCF",
            additionalInformation: "",
            text: "WCF App",
            url: "https://example.corp.com:44335/sap/bc/bsp/sap/crm_ui_start/default.htm?sap-client=120&sap-language=EN&wcf-target-id=SVO_DISP",
            systemAlias: "UR3CLNT120",
            "sap.ui": {
                technology: "WCF"
            }
        }, {
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }),
        oOldAppStateData: {},
        expectedResolutionResult: {
            additionalInformation: "",
            applicationType: "WCF",
            contentProviderId: undefined,
            extendedInfo: {
                appParams: {},
                system: undefined
            },
            fullWidth: true,
            navigationMode: "embedded",
            explicitNavMode: false,
            reservedParameters: {},
            text: "WCF App",
            url: "https://example.corp.com:44335/sap/bc/bsp/sap/crm_ui_start/default.htm?sap-client=120&sap-language=EN&wcf-target-id=SVO_DISP&sap-iframe-hint=WCF",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#127 a WCF target with configuration is resolved",
        intent: "Shell-startWCF?technicalId=MD-BP-OV",
        inbound: {
            semanticObject: "Shell",
            action: "startWCF",
            id: "Shell-startWCF",
            title: "WCF target inbound",
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
            resolutionResult: {
                url: "/bsp/sap/crm_ui_start/default.htm",
                applicationType: "WCF",
                "sap.ui": { technology: "WCF" }
            },
            deviceTypes: { desktop: true, tablet: true, phone: true },
            signature: {
                additionalParameters: "allowed",
                parameters: {
                    "sap-system": { defaultValue: { value: "UR3CLNT120", format: "plain" }, required: false },
                    technicalId: { renameTo: "crm-targetId", required: true }
                }
            }
        },
        oOldAppStateData: {},
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        expectedResolutionResult: {
            applicationType: "WCF",
            contentProviderId: undefined,
            extendedInfo: {
                appParams: {
                    "crm-targetId": [
                        "MD-BP-OV"
                    ],
                    "sap-system": [
                        "UR3CLNT120"
                    ]
                },
                system: undefined
            },
            text: "",
            additionalInformation: "",
            navigationMode: "embedded",
            explicitNavMode: false,
            reservedParameters: {},
            fullWidth: true,
            url: "https://example.corp.com:44355/sap(====)/bc/bsp/sap/crm_ui_start/default.htm?sap-client=120&sap-language=en&crm-targetId=MD-BP-OV&sap-iframe-hint=WCF",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#128 a WCF target with different parameters is resolved",
        intent: "Shell-startWCF?technicalId=MD-BP-OV&saprole=SUPPLIER",
        inbound: {
            semanticObject: "Shell",
            action: "startWCF",
            id: "Shell-startWCF",
            title: "WCF target inbound",
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
            resolutionResult: {
                url: "/bsp/sap/crm_ui_start/default.htm",
                applicationType: "WCF",
                "sap.ui": { technology: "WCF" }
            },
            deviceTypes: { desktop: true, tablet: true, phone: true },
            signature: {
                additionalParameters: "allowed",
                parameters: {
                    "sap-system": { defaultValue: { value: "UR3CLNT120", format: "plain" }, required: false },
                    technicalId: { renameTo: "crm-targetId", required: true }
                }
            }
        },
        oOldAppStateData: {},
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        expectedResolutionResult: {
            applicationType: "WCF",
            contentProviderId: undefined,
            extendedInfo: {
                appParams: {
                    "crm-targetId": [
                        "MD-BP-OV"
                    ],
                    "sap-system": [
                        "UR3CLNT120"
                    ],
                    saprole: [
                        "SUPPLIER"
                    ]
                },
                system: undefined
            },
            text: "",
            additionalInformation: "",
            navigationMode: "embedded",
            explicitNavMode: false,
            reservedParameters: {},
            fullWidth: true,
            url: "https://example.corp.com:44355/sap(====)/bc/bsp/sap/crm_ui_start/default.htm?sap-client=120&sap-language=en&crm-targetId=MD-BP-OV&saprole=SUPPLIER&sap-iframe-hint=WCF",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#129 a WCF target with defined title is resolved",
        intent: "Shell-startWCF?technicalId=MD-BP-OV&saprole=SUPPLIER",
        inbound: {
            semanticObject: "Shell",
            action: "startWCF",
            id: "Shell-startWCF",
            title: "WCF target inbound",
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
            resolutionResult: {
                url: "/bsp/sap/crm_ui_start/default.htm",
                applicationType: "WCF",
                "sap.ui": { technology: "WCF" },
                text: "WCF target inbound"
            },
            deviceTypes: { desktop: true, tablet: true, phone: true },
            signature: {
                additionalParameters: "allowed",
                parameters: {
                    "sap-system": { defaultValue: { value: "UR3CLNT120", format: "plain" }, required: false },
                    technicalId: { renameTo: "crm-targetId", required: true }
                }
            }
        },
        oOldAppStateData: {},
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        expectedResolutionResult: {
            applicationType: "WCF",
            contentProviderId: undefined,
            extendedInfo: {
                appParams: {
                    "crm-targetId": [
                        "MD-BP-OV"
                    ],
                    "sap-system": [
                        "UR3CLNT120"
                    ],
                    saprole: [
                        "SUPPLIER"
                    ]
                },
                system: undefined
            },
            text: "WCF target inbound",
            additionalInformation: "",
            navigationMode: "embedded",
            explicitNavMode: false,
            reservedParameters: {},
            fullWidth: true,
            url: "https://example.corp.com:44355/sap(====)/bc/bsp/sap/crm_ui_start/default.htm?sap-client=120&sap-language=en&crm-targetId=MD-BP-OV&saprole=SUPPLIER&sap-iframe-hint=WCF",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#130 a WCF target is not resolved because technicalId is missing",
        intent: "Shell-startWCF?saprole=SUPPLIER&sap-system=UR3CLNT120",
        inbound: {
            semanticObject: "Shell",
            action: "startWCF",
            id: "Shell-startWCF",
            title: "WDF target inbound",
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
            resolutionResult: {
                url: "/bsp/sap/crm_ui_start/default.htm",
                applicationType: "WCF",
                "sap.ui": { technology: "WCF" }
            },
            deviceTypes: { desktop: true, tablet: true, phone: true },
            signature: {
                additionalParameters: "allowed",
                parameters: {
                    "sap-system": { defaultValue: { value: "UR3CLNT120", format: "plain" }, required: false },
                    technicalId: { renameTo: "crm-targetId", required: true }
                }
            }
        },
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        oOldAppStateData: {},
        expectedResolve: false,
        expectedRejectError: "Could not resolve navigation target"
    }, {
        testDescription: "#131 an Easy Access Menu WDA target is resolved with sap-system-src",
        // ignore certain fields not needed for the test
        intent: "Shell-startWDA?sap-system=UR3CLNT120&sap-system-src=UV2CLNT120&sap-ui2-wd-app-id=EPM_POWL",
        inbound: {
            semanticObject: "Shell",
            action: "startWDA",
            id: "Shell-startWDA~6NM",
            title: "Title",
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
            resolutionResult: {
                applicationType: "whatever",
                additionalInformation: "whatever",
                text: "whatever",
                url: "whatever",
                systemAlias: "whatever"
            },
            deviceTypes: { desktop: true, tablet: true, phone: true },
            signature: {
                additionalParameters: "allowed",
                parameters: {
                    "sap-system": { filter: { value: "UR3CLNT120", format: "plain" }, required: true }
                }
            }
        },
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        oLocalStorageContent: {
            "sap-system-data#UV2CLNT120:UR3CLNT120": (function (oSystemData) {
                // stored data are different than the adapter's data
                oSystemData.language = "DE";
                oSystemData.client = "200";
                oSystemData.https.host = "ur3.example.corp.com";
                oSystemData.https.port = 8080;

                return JSON.stringify(oSystemData);
            })(deepExtend({}, O_KNOWN_SYSTEM_ALIASES.UR3CLNT120))
        },
        oOldAppStateData: {},
        expectedResolve: true,
        expectedResolutionResult: {
            additionalInformation: "",
            applicationType: "WDA",
            navigationMode: "newWindowThenEmbedded",
            explicitNavMode: false,
            "sap-system": "UR3CLNT120",
            systemAlias: "UR3CLNT120",
            "sap-system-src": "UV2CLNT120",
            text: "EPM_POWL",
            url: "https://ur3.example.corp.com:8080/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?sap-client=200&sap-language=DE&sap-iframe-hint=NWBC",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#132 an Easy User Access Menu GUI resolution is rejected dure to missing system data in local storage",
        intent: "Shell-startGUI?sap-system=ALIASRFC&sap-system-src=OTHERSYS&sap-ui2-tcode=SU01",
        inbound: oTestHelper.createInbound("#Shell-startGUI{sap-system:ALIASRFC<+>}", {
            applicationType: "whatever",
            additionalInformation: "whatever",
            text: "whatever",
            url: "whatever",
            systemAlias: "whatever"
        }),
        oLocalStorageContent: {}, // nothing saved in local storage
        oKnownSapSystemData: {
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.ALIASRFC
        },
        expectedResolve: false,
        expectedRejectError: "Cannot find data for system 'ALIASRFC' in local storage using key 'sap-system-data#OTHERSYS:ALIASRFC'"
    }, {
        testDescription: "#133 an Easy Access Menu GUI with sap-system-src",
        intent: "Shell-startGUI?sap-system=ALIASRFC&sap-system-src=OTHERSYS&sap-ui2-tcode=SU01",
        inbound: {
            semanticObject: "Shell",
            action: "startGUI",
            id: "Shell-startGUI~6NM",
            title: "whatever",
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
            resolutionResult: {
                applicationType: "whatever",
                additionalInformation: "whatever",
                text: "whatever",
                url: "whatever",
                systemAlias: "kuku"
            },
            deviceTypes: { desktop: true, tablet: true, phone: true },
            signature: {
                additionalParameters: "allowed",
                parameters: {
                    "sap-system": { filter: { value: "ALIASRFC", format: "plain" }, required: true }
                }
            }
        },
        oKnownSapSystemData: {
            ALIASRFC: O_KNOWN_SYSTEM_ALIASES.ALIASRFC
        },
        oLocalStorageContent: {
            "sap-system-data#OTHERSYS:ALIASRFC": (function (oSystemData) {
                // stored data are different than the adapter's data
                oSystemData.language = "DE";
                oSystemData.client = "200";
                oSystemData.https.host = "othersys.example.corp.com";
                oSystemData.https.port = 8080;
                oSystemData.rfc.systemId = "OTH";

                return JSON.stringify(oSystemData);
            })(deepExtend({}, O_KNOWN_SYSTEM_ALIASES.ALIASRFC))
        },
        expectedResolutionResult: {
            additionalInformation: "whatever",
            applicationType: "TR",
            navigationMode: "newWindowThenEmbedded",
            explicitNavMode: false,
            "sap-system": "ALIASRFC",
            "sap-system-src": "OTHERSYS",
            text: "SU01",
            systemAlias: "ALIASRFC",
            url: "https://othersys.example.corp.com:8080/path/gui/sap/its/webgui;~sysid=OTH;~loginGroup=SPACE;~messageServer=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncNameR3=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=9?%7etransaction=SU01&%7enosplash=1&sap-client=200&sap-language=DE&sap-system-src=OTHERSYS&sap-iframe-hint=GUI",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#134 URL target with sap-system, in the context of sap-system-src",
        intent: "Action-toSomeURL?sap-system=ALIAS111&sap-system-src=SYSTEM2",
        inbound: oTestHelper.createInbound("#Action-toSomeURL{<no params><+>}", {
            applicationType: "URL",
            "sap.ui": { technology: "URL" },
            url: "/some/url"
        }, {
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }),
        oLocalStorageContent: {
            // stored data are different than the adapter's data
            "sap-system-data#SYSTEM2:ALIAS111": JSON.stringify(O_KNOWN_SYSTEM_ALIASES.SYS_IT_NO_R3)
        },
        oKnownSapSystemData: {
            ALIAS111: O_KNOWN_SYSTEM_ALIASES.SYS_WITH_PATH
        },
        expectedResolutionResult: {
            applicationType: "URL",
            navigationMode: "newWindow",
            explicitNavMode: false,
            contentProviderId: undefined,
            reservedParameters: {},
            "sap-system": "ALIAS111",
            "sap-system-src": "SYSTEM2",
            text: undefined,
            url: "https://example.corp.com:44355/some/url?sap-client=815&sap-language=IT",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#135 URL target with sap-system, in the context of sap-system-src and a sap-fiori-id",
        intent: "Action-toSomeURL?sap-system=ALIAS111&sap-system-src=SYSTEM2&sap-fiori-id=12345",
        inbound: oTestHelper.createInbound("#Action-toSomeURL{<no params><+>}", {
            applicationType: "URL",
            "sap.ui": { technology: "URL" },
            url: "/some/url"
        }, {
            permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }),
        oLocalStorageContent: {
            // stored data are different than the adapter's data
            "sap-system-data#SYSTEM2:ALIAS111": JSON.stringify(O_KNOWN_SYSTEM_ALIASES.SYS_IT_NO_R3)
        },
        oKnownSapSystemData: {
            ALIAS111: O_KNOWN_SYSTEM_ALIASES.SYS_WITH_PATH
        },
        expectedResolutionResult: {
            applicationType: "URL",
            navigationMode: "newWindow",
            explicitNavMode: false,
            contentProviderId: undefined,
            reservedParameters: {
                "sap-fiori-id": ["12345"]
            },
            "sap-system": "ALIAS111",
            "sap-system-src": "SYSTEM2",
            text: undefined,
            url: "https://example.corp.com:44355/some/url?sap-client=815&sap-language=IT",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
        }
    }, {
        testDescription: "#136 an Easy Access Menu transaction is resolved as SAPUI5 application is the application type is SAPUI5",
        intent: "Shell-startGUI?sap-ui2-tcode=SU01",
        inbound: oTestHelper.createInbound("#Shell-startGUI{sap-ui2-tcode:SU01<+>}", {
            applicationType: "SAPUI5",
            additionalInformation: "SAPUI5.Component=Test.Component",
            text: "System U1Y on current client",
            url: "http://someurl",
            systemAlias: "whatever"
        }),
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "SAPUI5",
        expectedUrl: "http://someurl?sap-ui2-tcode=SU01"
    }, {
        testDescription: "#137 easy access and permanentKey is not defined in the inbound",
        // ignore certain fields not needed for the test
        intent: "Shell-startWDA?sap-system=UR3CLNT120&sap-ui2-wd-app-id=EPM_POWL",
        inbound: oTestHelper.createInbound("#Shell-startWDA{sap-system:UR3CLNT120<+>}", {
            "sap.platform.runtime": { anything: "copied" },
            applicationType: "whatever",
            additionalInformation: "whatever",
            text: "System U1Y on current client",
            url: "whatever",
            systemAlias: "whatever"
        }, {
            permanentKey: "Shell-startWDA"
        }),
        oKnownSapSystemData: {
            UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
        },
        oOldAppStateData: {},
        expectedAppStateData: {},
        expectedApplicationType: "WDA",
        expectedResolutionResult: {
            additionalInformation: "",
            applicationType: "WDA",
            navigationMode: "newWindowThenEmbedded",
            explicitNavMode: false,
            "sap-system": "UR3CLNT120",
            systemAlias: "UR3CLNT120",
            text: "EPM_POWL",
            url: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?sap-client=120&sap-language=en&sap-iframe-hint=NWBC",
            "sap.platform.runtime": { anything: "copied" },
            inboundPermanentKey: "Shell-startWDA"
        }
    }, {
        testDescription: "#138 standard resolution and permanentKey is not defined in the inbound",
        intent: "Object-action?sap-ui-app-id-hint=app5",
        inbounds: [
            oTestHelper.createInbound("#Object-action{<no params><+>}", {
                appId: "app1",
                applicationType: "SAPUI5",
                additionalInformation: "SAPUI5.Component=Test.Component",
                url: ""
            }, {
                title: "app1",
                id: "testId"
            })
        ],
        expectedResolutionResult: {
            applicationType: "SAPUI5",
            additionalInformation: "SAPUI5.Component=Test.Component",
            navigationMode: "embedded",
            explicitNavMode: false,
            extendedInfo: {
                appParams: {},
                system: undefined
            },
            contentProviderId: undefined,
            reservedParameters: {
                "sap-ui-app-id-hint": ["app5"]
            },
            "sap-system": undefined,
            text: "app1",
            url: "",
            inboundPermanentKey: "testId"
        }
    }, {
        testDescription: "#139 merge parameters",
        intent: "Employee-display?sap-xapp-state=ASOLD",
        inbounds: [{
            semanticObject: "Employee",
            action: "display",
            id: "Employee-display",
            title: "Display an employee",
            resolutionResult: {
                applicationType: "SAPUI5",
                additionalInformation: "SAPUI5.Component=Test.Component",
                text: "System U1Y on current client",
                url: "http://someurl",
                systemAlias: "whatever"
            },
            deviceTypes: {
                desktop: true,
                tablet: true,
                phone: true
            },
            signature: {
                additionalParameters: "allowed",
                parameters: {
                    p1: { defaultValue: { value: "v1", format: "plain" }, required: false, renameTo: "p1Renamed" },
                    p2: { defaultValue: { value: "v2", format: "plain" }, required: false },
                    "sap-prelaunch-operations": {
                        defaultValue: {
                            value: JSON.stringify([{ type: "merge", source: ["p1Renamed", "p2"], target: "pNew" }]),
                            format: "plain"
                        },
                        required: false
                    }
                }
            }
        }],
        oOldAppStateData: {
            selectionVariant: {
                ODataFilterExpression: "",
                SelectionVariantID: "",
                Text: "Selection Variant with ID",
                Version: {
                    Major: "1",
                    Minor: "0",
                    Patch: "0"
                },
                SelectOptions: [{
                    PropertyName: "p1",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "v1",
                        High: null
                    }]
                }, {
                    PropertyName: "p2",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "v2",
                        High: null
                    }]
                }]
            }
        },
        expectedAppStateName: "ASNEW2",
        expectedAppStateData: {
            selectionVariant: {
                ODataFilterExpression: "",
                Parameters: [],
                SelectOptions: [{
                    PropertyName: "p1Renamed",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "v1",
                        High: null
                    }]
                }, {
                    PropertyName: "p2",
                    Ranges: [{
                        Sign: "I",
                        Option: "EQ",
                        Low: "v2",
                        High: null
                    }]
                }, {
                    PropertyName: "pNew",
                    Ranges: [{
                        High: "v2",
                        Low: "v1",
                        Option: "BT",
                        Sign: "I"
                    }]
                }],
                SelectionVariantID: "",
                Text: "Selection Variant with ID",
                Version: {
                    Major: "1",
                    Minor: "0",
                    Patch: "0"
                }
            }
        },
        expectedResolutionResult: {
            applicationType: "SAPUI5",
            additionalInformation: "SAPUI5.Component=Test.Component",
            navigationMode: "embedded",
            explicitNavMode: false,
            extendedInfo: {
                appParams: {
                    p1Renamed: [
                        "v1"
                    ],
                    p2: [
                        "v2"
                    ],
                    "sap-xapp-state": [
                        "ASNEW2"
                    ]
                },
                system: undefined
            },
            contentProviderId: undefined,
            inboundPermanentKey: "Employee-display",
            reservedParameters: {
                "sap-prelaunch-operations": "[{\"type\":\"merge\",\"source\":[\"p1Renamed\",\"p2\"],\"target\":\"pNew\"}]"
            },
            "sap-system": undefined,
            text: "Display an employee",
            url: "http://someurl?p1Renamed=v1&p2=v2&sap-ushell-defaultedParameterNames=%5B%22p1Renamed%22%2C%22p2%22%5D&sap-xapp-state=ASNEW2"
        }
    }, {
        testDescription: "#140 CDM 3.0 WDA URL with sap-cssurl",
        intent: "Product-wdaSearch?parameterName=parameterValue&sap-ushell-navmode=inplace",
        inbound: (function (oApplicationSection) {
            return {
                title: "templated",
                semanticObject: "Product",
                action: "wdaSearch",
                permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                resolutionResult: {
                    applicationType: "URL",
                    navigationMode: "embedded"
                },
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        defaultP1: { required: false, renameTo: "defaultP1Renamed", defaultValue: { value: "v1", format: "plain" } }
                    }
                },
                templateContext: {
                    payload: {
                        urlTemplate: "{+_baseUrl}/ui2/nwbc/~canvas;window=app/wda/{wdaAppId}/{?query*,wdConfigId,_defaultParameterNames,_startupParameters*,sapTheme,sapLanguage,sapInnerAppState,sapSessionTimeout}",
                        parameters: {
                            names: utils.shallowMergeObject(O_CDM3_TEMPLATE_NOTIONS, {
                                query: "{./sap.integration/urlTemplateParams/query}",
                                wdaAppId: "{./sap.integration/urlTemplateParams/applicationId}",
                                wdConfigId: {
                                    renameTo: "sap-wd-configId",
                                    value: "{./sap.integration/urlTemplateParams/configId}"
                                },
                                wdAppId: {
                                    renameTo: "sap-ui-app-id",
                                    value: "{./sap.integration/urlTemplateParams/appId}"
                                },
                                _defaultParameterNamesPrejoin: "{join(\"\\,\") &defaultParameterNames:.}",
                                _defaultParameterNamesPostjoin: "{join() '[\"',&_defaultParameterNamesPrejoin,'\"]'}",
                                _defaultParameterNames: {
                                    renameTo: "sap-ushell-defaultedParameterNames",
                                    value: "{if({&_defaultParameterNamesPrejoin}) &_defaultParameterNamesPostjoin}"
                                },
                                sapTheme: {
                                    renameTo: "sap-theme",
                                    value: "{&env:theme}"
                                },
                                sapLanguage: {
                                    renameTo: "sap-language",
                                    value: "{&env:logonLanguage}"
                                },
                                sapInnerAppState: {
                                    renameTo: "sap-iapp-state",
                                    value: "{if({&env:innerAppState}) &env:innerAppState}"
                                },
                                sapSessionTimeout: {
                                    renameTo: "sap-ushell-timeout",
                                    value: "{&env:sessionTimeout}"
                                }
                            })
                        },
                        capabilities: {
                            technicalAppComponentId: "{+wdaAppId}",
                            appId: "{+wdAppId}",
                            appFrameworkId: "WDA"
                        }
                    },
                    site: O_CDM3_SAMPLE_SITE,
                    siteAppSection: oApplicationSection
                }
            };
        })({ // application section
            "sap.app": {
                destination: "legacy_blue_box",
                title: "CALL WDA EC Cockpit - Scenario 2",
                crossNavigation: {
                    inbounds: {
                        "AcademicCourse-a5": {
                            semanticObject: "AcademicCourse",
                            action: "a5",
                            signature: {
                                parameters: {},
                                additionalParameters: "allowed"
                            }
                        }
                    }
                }
            },
            "sap.integration": {
                urlTemplateId: "urltemplate.wda",
                urlTemplateParams: {
                    query: {
                        "test-param1": "dummy-value1",
                        "sap-cssurl": "https://dest-approuter.cfapps.sap.hana.ondemand.com/testfile.css",
                        "test-param2": "dummy-value2"
                    },
                    applicationId: "S_EPM_FPM_PD",
                    configId: "s_epm_fpm_pd",
                    appId: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
                }
            },
            "sap.flp": {
                businessApp: "businessapp.urltemplate-wda",
                defaultLauncher: "businessapp.urltemplate-wda#AcademicCourse-a5"
            },
            "sap.ui": {
                technology: "URL"
            }
        }),
        oOldAppStateData: {},
        sHash: "#Semantic-Action?p1=1&p2=2&\\dumm1\\sap-iapp-state=ABCDE",
        iSessionTimeout: 10,
        expectedAppStateData: {},
        expectedResolutionResult: {
            applicationType: "URL",
            navigationMode: "embedded",
            explicitNavMode: true,
            appCapabilities: {
                appId: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                appSupportInfo: undefined,
                appFrameworkId: "WDA",
                navigationMode: "newWindow",
                technicalAppComponentId: "S_EPM_FPM_PD",
                templateNavigationMode: undefined
            },
            reservedParameters: {},
            text: "templated",
            systemAlias: "legacy_blue_box",
            url: "https://tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com/sap/bc/ui2/nwbc/~canvas;window=app/wda/S_EPM_FPM_PD/?" +
                "test-param1=dummy-value1&sap-cssurl=https%3A%2F%2Fdest-approuter.cfapps.sap.hana.ondemand.com%2Ftestfile.css&test-param2=dummy-value2&sap-wd-configId=s_epm_fpm_pd&sap-ushell-defaultedParameterNames=" +
                "%5B%22defaultP1Renamed%22%5D&defaultP1Renamed=v1&parameterName=parameterValue&sap-language=EN&sap-iapp-state=ABCDE" +
                "&sap-ushell-timeout=10&sap-iframe-hint=WDA",
            contentProviderId: "",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
            extendedInfo: {
                appParams: {
                    defaultP1Renamed: [
                        "v1"
                    ],
                    parameterName: [
                        "parameterValue"
                    ],
                    "sap-ushell-navmode": [
                        "inplace"
                    ]
                },
                system: {
                    alias: "legacy_blue_box",
                    client: "120",
                    https: {
                        host: "tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com",
                        id: "legacy_blue_box_HTTPS",
                        pathPrefix: ""
                    },
                    id: "legacy_blue_box",
                    language: "DE",
                    rfc: {
                        host: "example.corp.com",
                        id: "legacy_blue_box",
                        loginGroup: "",
                        service: "3255",
                        sncNameR3: "p/secude:CN=EXAMPLE, O=SAP-AG, C=DE",
                        sncQoPR3: "8",
                        systemId: ""
                    }
                }
            }
        }
    }, {
        testDescription: "#141 - Multiple Inner App Route",
        appCapabilitiesNames: {
            attribute: "protocol",
            value: "GUI"
        },
        intent: "Employee-display?parameterName=parameterValue&sap-ushell-navmode=inplace",
        inbound: (function (oApplicationSection) {
            return {
                title: "templated",
                semanticObject: "Employee",
                action: "display",
                permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                resolutionResult: {
                    applicationType: "URL",
                    navigationMode: "embedded"
                },
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        defaultP1: { required: false, defaultValue: { value: "v1", format: "plain" } }
                    }
                },
                templateContext: {
                    payload: {
                        urlTemplate: "{+_baseUrl}{+appRuntime}{?appId,startupParameters,originalHash,sapUiDebug}{+hashWithoutInnerRoute}{+innerAppRoute}",
                        parameters: {
                            names: utils.shallowMergeObject(O_CDM3_TEMPLATE_NOTIONS, O_CDM3_TEMPLATE_FIORI)
                        },
                        capabilities: {
                            navigationMode: "embedded",
                            appId: "{+_appIdCapability}",
                            technicalAppComponentId: "{+_technicalAppComponentIdCapability}",
                            appFrameworkId: "UI5"
                        }
                    },
                    site: O_CDM3_SAMPLE_SITE,
                    siteAppSection: oApplicationSection
                }
            };
        })({ // application section
            "sap.app": {
                destination: "fiori_blue_box",
                title: "Invoices",
                crossNavigation: {
                    inbounds: {
                        "InvoiceList-manage": {
                            semanticObject: "InvoiceList",
                            action: "manage",
                            signature: {
                                parameters: {},
                                additionalParameters: "allowed"
                            }
                        }
                    }
                }
            },
            "sap.integration": {
                urlTemplateId: "urltemplate.fiori",
                urlTemplateParams: {
                    appId: "cus.sd.billingdoclist.manages1",
                    appPlatform: "ABAP"
                }
            },
            "sap.flp": {
                businessApp: "businessapp.urltemplate-fiori",
                defaultLauncher: "businessapp.urltemplate-fiori#InvoiceList-manage"
            },
            "sap.ui": {
                technology: "URL"
            }
        }),
        oOldAppStateData: {},
        sHash: "#Semantic-Action?p1=1&p2=2&/dumm1\\sap-iapp-state=ABCDE&/chiledApp\\childAppView\\1234",
        expectedAppStateData: {},
        expectedResolutionResult: {
            appCapabilities: {
                appFrameworkId: "UI5",
                appId: "cus.sd.billingdoclist.manages1",
                appSupportInfo: undefined,
                navigationMode: "embedded",
                templateNavigationMode: "embedded",
                technicalAppComponentId: "cus.sd.billingdoclist.manages1"
            },
            applicationType: "URL",
            contentProviderId: "",
            reservedParameters: {},
            text: "templated",
            systemAlias: "fiori_blue_box",
            url: "https://tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com/sap/bc/ui2/flp/ui5appruntime.html?sap-ui-app-id=cus.sd.billingdoclist.manages1&" +
                "startupParameters=defaultP1%3Dv1%26parameterName%3DparameterValue%26sap-ushell-defaultedParameterNames%3D%5B%22defaultP1%22%5D&originalHash=&/dumm1%5Csap-iapp-state=ABCDE&/chiledApp%5CchildAppView%5C1234&sap-iframe-hint=UI5#Semantic-Action?p1=1&p2=2&/dumm1\\sap-iapp-state=ABCDE&/chiledApp\\childAppView\\1234",
            explicitNavMode: true,
            navigationMode: "embedded",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
            extendedInfo: {
                appParams: {
                    defaultP1: [
                        "v1"
                    ],
                    parameterName: [
                        "parameterValue"
                    ],
                    "sap-ushell-defaultedParameterNames": [
                        "[\"defaultP1\"]"
                    ],
                    "sap-ushell-navmode": [
                        "inplace"
                    ]
                },
                system: {
                    alias: "fiori_blue_box",
                    client: "000",
                    https: {
                        host: "tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com",
                        id: "fiori_blue_box_HTTPS",
                        pathPrefix: ""
                    },
                    id: "fiori_blue_box",
                    language: "IT"
                }
            }
        }
    }, {
        testDescription: "#142 - One Inner App Route",
        appCapabilitiesNames: {
            attribute: "protocol",
            value: "GUI"
        },
        intent: "Employee-display?parameterName=parameterValue&sap-ushell-navmode=inplace",
        inbound: (function (oApplicationSection) {
            return {
                title: "templated",
                semanticObject: "Employee",
                action: "display",
                permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                resolutionResult: {
                    applicationType: "URL",
                    navigationMode: "embedded"
                },
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        defaultP1: { required: false, defaultValue: { value: "v1", format: "plain" } }
                    }
                },
                templateContext: {
                    payload: {
                        urlTemplate: "{+_baseUrl}{+appRuntime}{?appId,startupParameters,originalHash,sapUiDebug}{+hashWithoutInnerRoute}{+innerAppRoute}",
                        parameters: {
                            names: utils.shallowMergeObject(O_CDM3_TEMPLATE_NOTIONS, O_CDM3_TEMPLATE_FIORI)
                        },
                        capabilities: {
                            navigationMode: "embedded",
                            appId: "{+_appIdCapability}",
                            technicalAppComponentId: "{+_technicalAppComponentIdCapability}",
                            appFrameworkId: "UI5"
                        }
                    },
                    site: O_CDM3_SAMPLE_SITE,
                    siteAppSection: oApplicationSection
                }
            };
        })({ // application section
            "sap.app": {
                destination: "fiori_blue_box",
                title: "Invoices",
                crossNavigation: {
                    inbounds: {
                        "InvoiceList-manage": {
                            semanticObject: "InvoiceList",
                            action: "manage",
                            signature: {
                                parameters: {},
                                additionalParameters: "allowed"
                            }
                        }
                    }
                }
            },
            "sap.integration": {
                urlTemplateId: "urltemplate.fiori",
                urlTemplateParams: {
                    appId: "cus.sd.billingdoclist.manages1",
                    appPlatform: "ABAP"
                }
            },
            "sap.flp": {
                businessApp: "businessapp.urltemplate-fiori",
                defaultLauncher: "businessapp.urltemplate-fiori#InvoiceList-manage"
            },
            "sap.ui": {
                technology: "URL"
            }
        }),
        oOldAppStateData: {},
        sHash: "#Semantic-Action?p1=1&p2=2&/dumm1\\sap-iapp-state=ABCDE",
        expectedAppStateData: {},
        expectedResolutionResult: {
            appCapabilities: {
                appFrameworkId: "UI5",
                appId: "cus.sd.billingdoclist.manages1",
                appSupportInfo: undefined,
                navigationMode: "embedded",
                templateNavigationMode: "embedded",
                technicalAppComponentId: "cus.sd.billingdoclist.manages1"
            },
            applicationType: "URL",
            contentProviderId: "",
            reservedParameters: {},
            text: "templated",
            systemAlias: "fiori_blue_box",
            url: "https://tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com/sap/bc/ui2/flp/ui5appruntime.html?sap-ui-app-id=cus.sd.billingdoclist.manages1&" +
                "startupParameters=defaultP1%3Dv1%26parameterName%3DparameterValue%26sap-ushell-defaultedParameterNames%3D%5B%22defaultP1%22%5D&originalHash=&/dumm1%5Csap-iapp-state=ABCDE&sap-iframe-hint=UI5#Semantic-Action?p1=1&p2=2&/dumm1\\sap-iapp-state=ABCDE",
            explicitNavMode: true,
            navigationMode: "embedded",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
            extendedInfo: {
                appParams: {
                    defaultP1: [
                        "v1"
                    ],
                    parameterName: [
                        "parameterValue"
                    ],
                    "sap-ushell-defaultedParameterNames": [
                        "[\"defaultP1\"]"
                    ],
                    "sap-ushell-navmode": [
                        "inplace"
                    ]
                },
                system: {
                    alias: "fiori_blue_box",
                    client: "000",
                    https: {
                        host: "tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com",
                        id: "fiori_blue_box_HTTPS",
                        pathPrefix: ""
                    },
                    id: "fiori_blue_box",
                    language: "IT"
                }
            }
        }
    }, {
        testDescription: "#143 - complex hash with parameters and inner app route",
        appCapabilitiesNames: {
            attribute: "protocol",
            value: "GUI"
        },
        intent: "Employee-display?parameterName=parameterValue&sap-ushell-navmode=inplace",
        inbound: (function (oApplicationSection) {
            return {
                title: "templated",
                semanticObject: "Employee",
                action: "display",
                permanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                resolutionResult: {
                    applicationType: "URL",
                    navigationMode: "embedded"
                },
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        defaultP1: { required: false, defaultValue: { value: "v1", format: "plain" } }
                    }
                },
                templateContext: {
                    payload: {
                        urlTemplate: "{+_baseUrl}{+appRuntime}{?appId,startupParameters,originalHash,sapUiDebug}{+hashWithoutInnerRoute}{+innerAppRoute}",
                        parameters: {
                            names: utils.shallowMergeObject(O_CDM3_TEMPLATE_NOTIONS, O_CDM3_TEMPLATE_FIORI)
                        },
                        capabilities: {
                            navigationMode: "embedded",
                            appId: "{+_appIdCapability}",
                            technicalAppComponentId: "{+_technicalAppComponentIdCapability}",
                            appFrameworkId: "UI5"
                        }
                    },
                    site: O_CDM3_SAMPLE_SITE,
                    siteAppSection: oApplicationSection
                }
            };
        })({ // application section
            "sap.app": {
                destination: "fiori_blue_box",
                title: "Invoices",
                crossNavigation: {
                    inbounds: {
                        "InvoiceList-manage": {
                            semanticObject: "InvoiceList",
                            action: "manage",
                            signature: {
                                parameters: {},
                                additionalParameters: "allowed"
                            }
                        }
                    }
                }
            },
            "sap.integration": {
                urlTemplateId: "urltemplate.fiori",
                urlTemplateParams: {
                    appId: "cus.sd.billingdoclist.manages1",
                    appPlatform: "ABAP"
                }
            },
            "sap.flp": {
                businessApp: "businessapp.urltemplate-fiori",
                defaultLauncher: "businessapp.urltemplate-fiori#InvoiceList-manage"
            },
            "sap.ui": {
                technology: "URL"
            }
        }),
        oOldAppStateData: {},
        sHash: "#agenda-manage?sap-ui-app-id-hint=saas_approuter_br.com.fsbioenergia.agendamentos&/ZC_GEN_AGENDA_FRETE(CompanyCode='1000',Plant='1001',SalesContract='40007201'," +
            "SalesOrder='20054976',Erdat=datetime'2023-07-25T00%253A00%253A00',Period='202306',Customer='105524',EmailAddress='my-email%2540mail.com')" +
            "/?sap-iapp-state--history=TAS7T6YAO6J4OKKWW65T0BCCAW3R09QEU4CNU9Z37",
        expectedAppStateData: {},
        expectedResolutionResult: {
            appCapabilities: {
                appFrameworkId: "UI5",
                appId: "cus.sd.billingdoclist.manages1",
                appSupportInfo: undefined,
                navigationMode: "embedded",
                templateNavigationMode: "embedded",
                technicalAppComponentId: "cus.sd.billingdoclist.manages1"
            },
            applicationType: "URL",
            contentProviderId: "",
            reservedParameters: {},
            text: "templated",
            systemAlias: "fiori_blue_box",
            url: "https://tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com/sap/bc/ui2/flp/ui5appruntime.html?sap-ui-app-id=cus.sd.billingdoclist.manages1&" +
                "startupParameters=defaultP1%3Dv1%26parameterName%3DparameterValue%26sap-ushell-defaultedParameterNames%3D%5B%22defaultP1%22%5D&originalHash=" +
                "&/ZC_GEN_AGENDA_FRETE(CompanyCode='1000',Plant='1001',SalesContract='40007201'," +
                "SalesOrder='20054976',Erdat=datetime'2023-07-25T00%253A00%253A00',Period='202306',Customer='105524',EmailAddress='my-email%2540mail.com')" +
                "/?sap-iapp-state--history=TAS7T6YAO6J4OKKWW65T0BCCAW3R09QEU4CNU9Z37" +
                "&sap-iframe-hint=UI5" +
                "#agenda-manage?sap-ui-app-id-hint=saas_approuter_br.com.fsbioenergia.agendamentos&/ZC_GEN_AGENDA_FRETE(CompanyCode='1000',Plant='1001',SalesContract='40007201'," +
                "SalesOrder='20054976',Erdat=datetime'2023-07-25T00%253A00%253A00',Period='202306',Customer='105524',EmailAddress='my-email%2540mail.com')" +
                "/?sap-iapp-state--history=TAS7T6YAO6J4OKKWW65T0BCCAW3R09QEU4CNU9Z37",
            explicitNavMode: true,
            navigationMode: "embedded",
            inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
            extendedInfo: {
                appParams: {
                    defaultP1: [
                        "v1"
                    ],
                    parameterName: [
                        "parameterValue"
                    ],
                    "sap-ushell-defaultedParameterNames": [
                        "[\"defaultP1\"]"
                    ],
                    "sap-ushell-navmode": [
                        "inplace"
                    ]
                },
                system: {
                    alias: "fiori_blue_box",
                    client: "000",
                    https: {
                        host: "tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com",
                        id: "fiori_blue_box_HTTPS",
                        pathPrefix: ""
                    },
                    id: "fiori_blue_box",
                    language: "IT"
                }
            }
        }
    }, {
        testDescription: "#144 CDM 3.0 urlTemplate.url - simply case",
        intent: "accountanalyzer-Display?parameterName=parameterValue",
        inbound: (function (oApplicationSection) {
            return {
                title: "templated",
                semanticObject: "accountanalyzer",
                action: "Display",
                permanentKey: "",
                resolutionResult: {
                    applicationType: "URL",
                    navigationMode: "embedded"
                },
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        defaultP1: { required: false, renameTo: "defaultP1Renamed", defaultValue: { value: "v1", format: "plain" } }
                    }
                },
                templateContext: {
                    payload: {
                        urlTemplate: "{+url}{?query*,_startupParameters*,paramSapLocale,paramSapShell}{+paramSapTheme}{+paramSapHash}",
                        parameters: {
                            names: {
                                startupParameters: "{*|match(^(?!sap-(system\\|(ushell-navmode))$))}",
                                sapTheme: {
                                    renameTo: "sap-theme",
                                    value: "{&env:theme}"
                                },
                                sapThemeFull: "{join '&sap-theme=',&sapTheme}",
                                originalHash: "{url(hash)}",
                                url: "{./sap.integration/urlTemplateParams/url}",
                                query: "{./sap.integration/urlTemplateParams/query}",
                                hideSapParams: "{match(^false$) ./sap.integration/urlTemplateParams/enableSapParams}",
                                enableSapParams: "{if({&hideSapParams}) undefined,'true'}",
                                enableIntentParams: "{match(^true$) ./sap.integration/urlTemplateParams/enableIntentParams}",
                                _startupParameters: "{and &enableIntentParams,&startupParameters}",
                                paramSapLocale: {
                                    value: "{if({&enableSapParams}) &sapLocale}",
                                    renameTo: "sap-locale"
                                },
                                paramSapShell: {
                                    value: "{if({&enableSapParams}) &sapShell}",
                                    renameTo: "sap-shell"
                                },
                                paramSapTheme: "{if({&enableSapParams}) &sapThemeFull}",
                                paramSapHash: "{if({&enableSapParams}) &originalHash}",
                                _isInplace: "{match(^inplace$) ./sap.integration/navMode}",
                                sapShell: "{and &_isInplace,'FLP'}"
                            }
                        },
                        capabilities: {
                            navigationMode: "embedded",
                            startMethod: "GET",
                            fullWidth: true
                        }
                    },
                    site: O_CDM3_SAMPLE_SITE,
                    siteAppSection: oApplicationSection
                }
            };
        })({ // application section
            "sap.app": {
                destination: "No System",
                title: "CALL WDA EC Cockpit - Scenario 2",
                crossNavigation: {
                    inbounds: {
                        "AcademicCourse-a5": {
                            semanticObject: "AcademicCourse",
                            action: "a5",
                            signature: {
                                parameters: {},
                                additionalParameters: "allowed"
                            }
                        }
                    }
                }
            },
            "sap.integration": {
                navMode: "inplace",
                urlTemplateId: "urltemplate.url",
                urlTemplateParams: {
                    url: "https://sapit-sales-prod-budgie.launchpad.cfapps.eu10.hana.ondemand.com/a9d65d07-b489-4fb3-a8ce-284a337d2aca.accountanalyzer.accountanalyzer/ui5appwz.html",
                    query: {
                        "sap-ui-app-id": "ABC"
                    },
                    enableSapParams: true,
                    enableIntentParams: false,
                    scenario: "LAUNCHPAD"
                }
            },
            "sap.flp": {
                businessApp: "businessapp.urltemplate-url",
                defaultLauncher: "businessapp.urltemplate-url#AcademicCourse-a5"
            },
            "sap.ui": {
                technology: "URL"
            }
        }),
        oOldAppStateData: {},
        sHash: "#Semantic-Action?p1=1&p2=2&\\dumm1\\sap-iapp-state=ABCDE",
        iSessionTimeout: 10,
        expectedAppStateData: {},
        expectedResolutionResult: {
            applicationType: "URL",
            appCapabilities: {
                appFrameworkId: undefined,
                appId: "",
                appSupportInfo: undefined,
                fullWidth: true,
                navigationMode: "embedded",
                startMethod: "GET",
                technicalAppComponentId: "",
                templateNavigationMode: "embedded"
            },
            reservedParameters: {},
            text: "templated",
            systemAlias: "No System",
            url: "https://sapit-sales-prod-budgie.launchpad.cfapps.eu10.hana.ondemand.com/" +
                "a9d65d07-b489-4fb3-a8ce-284a337d2aca.accountanalyzer.accountanalyzer/ui5appwz.html" +
                "?sap-ui-app-id=ABC&sap-shell=FLP&sap-theme=sap_belize",
            contentProviderId: "",
            explicitNavMode: false,
            navigationMode: "embedded",
            inboundPermanentKey: undefined,
            extendedInfo: {
                appParams: {
                    defaultP1Renamed: [
                        "v1"
                    ],
                    parameterName: [
                        "parameterValue"
                    ]
                },
                system: undefined
            }
        }
    }, {
            testDescription: "#145 CDM 3.0 urlTemplate.url - SAPIT case",
            intent: "accountanalyzer-Display?parameterName=parameterValue",
            inbound: (function (oApplicationSection) {
                return {
                    title: "templated",
                    semanticObject: "accountanalyzer",
                    action: "Display",
                    permanentKey: "",
                    resolutionResult: {
                        applicationType: "URL",
                        navigationMode: "embedded"
                    },
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            defaultP1: { required: false, renameTo: "defaultP1Renamed", defaultValue: { value: "v1", format: "plain" } }
                        }
                    },
                    templateContext: {
                        payload: {
                            urlTemplate: "{+url}{?query*,_startupParameters*,paramSapLocale,paramSapShell}{+paramSapTheme}{+paramSapHash}",
                            parameters: {
                                names: {
                                    startupParameters: "{*|match(^(?!sap-(system\\|(ushell-navmode))$))}",
                                    sapTheme: {
                                        renameTo: "sap-theme",
                                        value: "{&env:theme}"
                                    },
                                    sapThemeFull: "{join '&sap-theme=',&sapTheme}",
                                    originalHash: "{url(hash)}",
                                    url: "{./sap.integration/urlTemplateParams/url}",
                                    query: "{./sap.integration/urlTemplateParams/query}",
                                    hideSapParams: "{match(^false$) ./sap.integration/urlTemplateParams/enableSapParams}",
                                    enableSapParams: "{if({&hideSapParams}) undefined,'true'}",
                                    enableIntentParams: "{match(^true$) ./sap.integration/urlTemplateParams/enableIntentParams}",
                                    _startupParameters: "{and &enableIntentParams,&startupParameters}",
                                    paramSapLocale: {
                                        value: "{if({&enableSapParams}) &sapLocale}",
                                        renameTo: "sap-locale"
                                    },
                                    paramSapShell: {
                                        value: "{if({&enableSapParams}) &sapShell}",
                                        renameTo: "sap-shell"
                                    },
                                    paramSapTheme: "{if({&enableSapParams}) &sapThemeFull}",
                                    paramSapHash: "{if({&enableSapParams}) &originalHash}",
                                    _isInplace: "{match(^inplace$) ./sap.integration/navMode}",
                                    sapShell: "{and &_isInplace,'FLP'}"
                                }
                            },
                            capabilities: {
                                navigationMode: "embedded",
                                startMethod: "GET",
                                fullWidth: true
                            }
                        },
                        site: O_CDM3_SAMPLE_SITE,
                        siteAppSection: oApplicationSection
                    }
                };
            })({ // application section
                "sap.app": {
                    destination: "No System",
                    title: "CALL WDA EC Cockpit - Scenario 2",
                    crossNavigation: {
                        inbounds: {
                            "AcademicCourse-a5": {
                                semanticObject: "AcademicCourse",
                                action: "a5",
                                signature: {
                                    parameters: {},
                                    additionalParameters: "allowed"
                                }
                            }
                        }
                    }
                },
                "sap.integration": {
                    navMode: "inplace",
                    urlTemplateId: "urltemplate.url",
                    urlTemplateParams: {
                        url: "https://sapit-sales-prod-budgie.launchpad.cfapps.eu10.hana.ondemand.com/a9d65d07-b489-4fb3-a8ce-284a337d2aca.accountanalyzer.accountanalyzer/ui5appwz.html",
                        query: {
                            "sapit-external-ui5app": true,
                            "sap-ui-app-id": "ABC"
                        },
                        enableSapParams: true,
                        enableIntentParams: false,
                        scenario: "LAUNCHPAD"
                    }
                },
                "sap.flp": {
                    businessApp: "businessapp.urltemplate-url",
                    defaultLauncher: "businessapp.urltemplate-url#AcademicCourse-a5"
                },
                "sap.ui": {
                    technology: "URL"
                }
            }),
            oOldAppStateData: {},
            sHash: "#Semantic-Action?p1=1&p2=2&\\dumm1\\sap-iapp-state=ABCDE",
            iSessionTimeout: 10,
            expectedAppStateData: {},
            expectedResolutionResult: {
                applicationType: "URL",
                appCapabilities: {
                    appFrameworkId: undefined,
                    appId: "",
                    appSupportInfo: undefined,
                    fullWidth: true,
                    navigationMode: "embedded",
                    startMethod: "GET",
                    technicalAppComponentId: "",
                    templateNavigationMode: "embedded"
                },
                reservedParameters: {},
                text: "templated",
                systemAlias: "No System",
                url: "https://sapit-sales-prod-budgie.launchpad.cfapps.eu10.hana.ondemand.com/" +
                    "a9d65d07-b489-4fb3-a8ce-284a337d2aca.accountanalyzer.accountanalyzer/ui5appwz.html" +
                    "?sapit-external-ui5app=true&sap-ui-app-id=ABC&sap-startup-params=defaultP1Renamed%3Dv1%26parameterName%3DparameterValue&sap-shell=FLP&sap-theme=sap_belize",
                contentProviderId: "",
                explicitNavMode: false,
                navigationMode: "embedded",
                inboundPermanentKey: undefined,
                extendedInfo: {
                    appParams: {
                        defaultP1Renamed: [
                            "v1"
                        ],
                        parameterName: [
                            "parameterValue"
                        ]
                    },
                    system: undefined
                }
            }
        }];

    function test (oFixture) {
        Log.setLevel(5);

        // Fixture Defaulting
        if (!oFixture.hasOwnProperty("expectedResolve")) {
            oFixture.expectedResolve = true;
        }

        QUnit.test("Complete resolveHashFragment for intent " + oFixture.intent + " when " + oFixture.testDescription, function (assert) {
            // Given that we mock some services, here there is an explicit list of the non-mocked ones.
            function FakeAppState (sKey, oData) {
                this.oData = oData;
                this.getKey = function () { return sKey; };
                this.getData = function () { return this.oData; };
                this.setData = function (data) { this.oData = data; };
                this.save = function () { return new jQuery.Deferred().resolve().promise(); };
            }
            var fnDone = assert.async();
            var oNewAppStates = [new FakeAppState("ASNEW", {}), new FakeAppState("ASNEW2", {})];
            var oNewAppState = oFixture.expectedAppStateName === "ASNEW2" ? oNewAppStates[1] : oNewAppStates[0];
            var oAllowedRequireServices = {
                ClientSideTargetResolution: true,
                URLParsing: true,
                ShellNavigationInternal: true,
                ReferenceResolver: true,
                PluginManager: true,
                URLTemplate: true,
                UserInfo: {
                    getUser: sandbox.stub().returns({
                        getTheme: sandbox.stub().returns("sap_belize"),
                        getContentDensity: sandbox.stub().returns("cozy")
                    })
                },
                AppState: (function () {
                    var iCnt = 0;

                    return {
                        getAppState: sandbox.stub().returns(
                            new jQuery.Deferred().resolve(new FakeAppState("ASOLD", oFixture.oOldAppStateData)).promise()
                        ),
                        createEmptyAppState: function () {
                            return oNewAppStates[iCnt++];
                        }
                    };
                })()
            };
            var fHashStub;
            var fLocationHashStub;
            var fConfigStub;

            sandbox.stub(Log, "error");
            sandbox.stub(Log, "warning");
            sandbox.spy(SystemAlias, "getSystemAliasInProvider");
            fConfigStub = sandbox.stub(Config, "last");
            sandbox.stub(ApplicationType.WDA, "enableWdaCompatibilityMode").get(function getterFn () {
                return true;
            });

            if (oFixture.iSessionTimeout) {
                fConfigStub
                .withArgs("/core/shell/sessionTimeoutIntervalInMinutes")
                .callsFake(function () { return oFixture.iSessionTimeout; });

            }
            fConfigStub.callThrough();

            if (oFixture.sCurrentApplicationType) {
                oAppConfiguration.setCurrentApplication({
                    applicationType: oFixture.sCurrentApplicationType
                    // remaining fields of this object are not relevant for this test
                });
            }

            var oMockedLocalStorageContent = oFixture.oLocalStorageContent || {};
            sandbox.stub(utils, "getLocalStorage").returns({
                getItem: function (sKey) {
                    if (!oMockedLocalStorageContent.hasOwnProperty(sKey)) {
                        return null; // localStorage return value when key is not found
                    }
                    return oMockedLocalStorageContent[sKey];
                }
            });

            var aFixtureInbounds = oFixture.inbounds || [oFixture.inbound];
            var aFixtureInboundsClone = aFixtureInbounds.map(function (oInbound) {
                return deepExtend({}, oInbound);
            });
            // for one test case, the inbound.resolutionResult.url has to be undefined
            // we check for this as deepExtend can't handle that.

            if (oFixture.testDescription === "#6 UI5 with undefined URL") {
                aFixtureInboundsClone[0].resolutionResult.url = undefined;
            }

            // WOrk
            var oFakeAdapter = {
                resolveSystemAlias: function (sSystemAlias) {
                    var oDeferred = new jQuery.Deferred();
                    if (oFixture.oKnownSapSystemData && oFixture.oKnownSapSystemData.hasOwnProperty(sSystemAlias)) {
                        return oDeferred.resolve(oFixture.oKnownSapSystemData[sSystemAlias]).promise();
                    }
                    if (sSystemAlias === "") {
                        return oDeferred.resolve(O_KNOWN_SYSTEM_ALIASES.LOCAL_SYSTEM).promise();
                    }
                    return oDeferred.reject("Cannot resolve system alias").promise();
                },
                getInbounds: sandbox.stub().returns(
                    new jQuery.Deferred().resolve(aFixtureInboundsClone).promise()
                ),
                resolveHashFragmentFallback: function (oIntent, oMatchingTarget, oParameters) {
                    var obj = { url: "fallback :-(" + JSON.stringify(oParameters).replace(/["]/g, "").replace(/\\/g, "") };
                    if (oMatchingTarget.resolutionResult && oMatchingTarget.resolutionResult["sap.platform.runtime"]) {
                        obj["sap.platform.runtime"] = oMatchingTarget.resolutionResult["sap.platform.runtime"];
                    }
                    return new jQuery.Deferred().resolve(obj).promise();
                }
            };

            oFixture.UserDefaultParameters = oFixture.UserDefaultParameters || {};

            // mutate the fixture
            Object.keys(oFixture.UserDefaultParameters).forEach(function (sName) {
                var oMember = oFixture.UserDefaultParameters[sName];
                if (oMember.value === "HUGE") {
                    oMember.value = genStr("ABCDEFGHIJKLMN", 2049);
                }
            });

            // Alias
            var _getServiceAsync = Container.getServiceAsync;

            // Access ShellNavigationInternal service
            Container.getServiceAsync("ShellNavigationInternal")
                .then(function (oShellNavigationInternal) {

                    var oUserDefaultParametersMock = {
                        getValue: async function (sName) {
                            return oFixture.UserDefaultParameters[sName] || { value: undefined };
                        }
                    };

                    // Stub services that are fetched asynchronously:
                    // ... Return a promise to a mock, to the real or to the cached service
                    sandbox.stub(Container, "getServiceAsync").callsFake(function (sName) {

                        // Resolve UserDefaultParameters service against mocked version
                        if (sName === "UserDefaultParameters") {
                            return Promise.resolve(oUserDefaultParametersMock);
                        }

                        // Return a promise to real service if service access is expected and service is not cached
                        if (oAllowedRequireServices[sName] === true) {
                            return _getServiceAsync.bind(Container)(sName);
                        }

                        // Report error if service access is not expected
                        if (!oAllowedRequireServices[sName]) {
                            assert.ok(false, "Test is not accessing " + sName);
                        }

                        // Otherwise return a promise to the cached service
                        return Promise.resolve(oAllowedRequireServices[sName]);
                    });

                    sandbox.stub(Container, "getUser").returns({
                        getLanguage: sandbox.stub().returns((oFixture.UserEnvParameters && oFixture.UserEnvParameters["sap-language"]) || "en"),
                        getAccessibilityMode: sandbox.stub().returns((oFixture.UserEnvParameters && oFixture.UserEnvParameters["sap-accessibility"]) || false)
                    });

                    // fake ui5 configuration
                    sandbox.stub(Supportability, "isStatisticsEnabled")
                        .returns((oFixture.UserEnvParameters && oFixture.UserEnvParameters["sap-statistics"]) || false);
                    sandbox.stub(Localization, "getLanguage").returns("en");
                    sandbox.stub(Localization, "getSAPLogonLanguage").returns("EN");

                    sandbox.spy(oShellNavigationInternal, "compactParams");

                    return Promise.all([
                        createServiceAsync({
                            adapter: oFakeAdapter,
                            configuration: oFixture.oCSTRConfig || {}
                        }),
                        oShellNavigationInternal
                    ]);
                }).then(function (aResults) {
                    var oSrvc = aResults[0];
                    var oShellNavigationInternal = aResults[1];

                    var fnOrigSelectSystemAliasDataName = oSrvc._selectSystemAliasDataName;
                    oSrvc._selectSystemAliasDataName = function (oSystemAliasCollection, sBrowserLocationProtocol) {
                        if (sBrowserLocationProtocol === "http") {
                            sBrowserLocationProtocol = "https"; // force https URL
                        }
                        return fnOrigSelectSystemAliasDataName.call(this, oSystemAliasCollection, sBrowserLocationProtocol);
                    };

                    var fnSortByPropertyName = function (a, b) {
                        if (a.PropertyName < b.PropertyName) {
                            return -1;
                        }
                        if (a.PropertyName > b.PropertyName) {
                            return 1;
                        }

                        return 0;
                    };

                    if (oFixture.sHash) {
                        fHashStub = sandbox.stub(window.hasher, "getHash").returns(oFixture.sHash);
                        fLocationHashStub = sandbox.stub(urlTemplateResolution, "getBrowserHash").returns(oFixture.sHash);
                    }



                    // Act
                    oSrvc.resolveHashFragment(oFixture.intent, /*fnBoundFallback*/ function () {
                        assert.ok(false, "fallback function is not called");
                    })
                        .then(function (oResolutionResult) {
                            // Assert
                            if (!oFixture.expectedResolve) {
                                assert.ok(false, "promise was rejected");
                                return;
                            }

                            assert.ok(true, "promise was resolved");

                            if (oFixture.expectedResolutionResult) {
                                if (utils.getMember(oResolutionResult, "appCapabilities.statefulContainer")) {
                                    assert.deepEqual(oResolutionResult.appCapabilities.statefulContainer[oFixture.appCapabilitiesNames.attribute], oFixture.appCapabilitiesNames.value, "correct appCapabilities result");
                                    delete oResolutionResult.appCapabilities;
                                }
                                assert.deepEqual(oResolutionResult, oFixture.expectedResolutionResult, "correct resolution result");
                            }
                            if (oFixture?.inbound?.action === "templated") {
                                assert.equal(SystemAlias.getSystemAliasInProvider.callCount, 1);
                            }
                            if (oFixture.expectedTransientCompaction) {
                                assert.deepEqual(oShellNavigationInternal.compactParams.args[0][3], true, "compactParams invoked with transient indication");
                            }
                            // test the xapp-state key !
                            if (oFixture.expectedUrl) {
                                assert.strictEqual(oResolutionResult.url, oFixture.expectedUrl, "url correct");
                            }

                            if (typeof oFixture.expectedApplicationType !== "undefined") {
                                assert.strictEqual(oResolutionResult.applicationType, oFixture.expectedApplicationType, "application type correct");
                            }

                            var oAppStateData = oNewAppState.getData();
                            if (oFixture.expectedAppStateData && isEmptyObject(oFixture.expectedAppStateData)) {
                                assert.deepEqual(oAppStateData, oFixture.expectedAppStateData, "Appstate data is empty.");
                            } else if (oFixture.expectedAppStateData && oFixture.expectedAppStateData.selectionVariant) {
                                assert.ok(oAppStateData.selectionVariant, "The selectionVariant property is not empty.");
                                assert.ok(oAppStateData.selectionVariant.SelectOptions, "The SelectOptions property is not empty.");

                                // We must not rely on the order of the data in the AppState because it might vary between browsers, esp. IE11.
                                // Sort both arrays to ensure the same order.
                                oAppStateData.selectionVariant.SelectOptions.sort(fnSortByPropertyName);
                                oFixture.expectedAppStateData.selectionVariant.SelectOptions.sort(fnSortByPropertyName);

                                assert.deepEqual(oAppStateData, oFixture.expectedAppStateData, "Appstate data is correct.");
                            }

                            if (oFixture.expectedAppStateData2) {
                                assert.deepEqual(oNewAppStates[1].getData(), oFixture.expectedAppStateData2, "appstate data 2 correct");
                                if (oFixture.expectedAppStateData2 && oNewAppStates[1].getData().length > 2000) {
                                    assert.deepEqual(oNewAppStates[1].getData().substr(2000), oFixture.expectedAppStateData2.substr(2000), "appstate data 2 2nd part correct");
                                }
                            }
                        })
                        .catch(function (sError) {
                            // Assert
                            if (oFixture.expectedResolve) {
                                assert.ok(false, "promise was resolved. Reject ERROR: " + sError);
                                return;
                            }

                            assert.ok(true, "promise was rejected");
                        })
                        .finally(function () {
                            assert.deepEqual(aFixtureInbounds, aFixtureInboundsClone,
                                "inbounds provided by getInbounds are not modified by resolveHashFragment");

                            testExpectedErrorAndWarningCalls(assert, oFixture);

                            oShellNavigationInternal.compactParams.restore();
                            if (fHashStub) {
                                fHashStub.restore();
                                fLocationHashStub.restore();
                            }
                            if (fConfigStub) {
                                fConfigStub.restore();
                            }

                            sandbox.restore();
                            fnDone();
                        });
                });
        });
    }

    return function () {
        // Execute all test cases in here
        aTestCases.forEach(test);
    };
});
