// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/util/isPlainObject",
    "sap/base/util/ObjectPath",
    "sap/ui/thirdparty/datajs",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/ApplicationType",
    "sap/ushell/Container",
    "sap/ushell/URLTemplateProcessor",
    "sap/ushell/ApplicationType/urlTemplateResolution"
], function (
    isPlainObject,
    ObjectPath,
    OData,
    jQuery,
    ApplicationType,
    Container,
    URLTemplateProcessor,
    UrlTemplateResolution
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    var O_LOCAL_SYSTEM_ALIAS = { // local system alias (hardcoded in the adapter for now)
        http: {
            id: "",
            host: "",
            port: 0,
            pathPrefix: "/sap/bc/"
        },
        https: {
            id: "",
            host: "",
            port: 0,
            pathPrefix: "/sap/bc/"
        },
        rfc: {
            id: "",
            systemId: "",
            host: "",
            service: 0,
            loginGroup: "",
            sncNameR3: "",
            sncQoPR3: ""
        },
        id: "",
        client: "",
        language: ""
    };

    var O_KNOWN_SYSTEM_ALIASES = {
        UR3CLNT120: {
            http: {
                id: "UR3CLNT120_HTTP",
                host: "example.corp.com",
                port: "50055", // note: string is also valid for the port
                pathPrefix: ""
            },
            https: {
                id: "UR3CLNT120_HTTPS",
                host: "example.corp.com",
                port: 44355,
                pathPrefix: ""
            },
            rfc: {
                id: "UR3CLNT120",
                systemId: "",
                host: "example.corp.com",
                service: 3255,
                loginGroup: "",
                sncNameR3: "p/secude:CN=UR3, O=SAP-AG, C=DE",
                sncQoPR3: "8"
            },
            id: "UR3CLNT120",
            client: "120",
            language: ""
        },
        SYSCONNSTRING: {
            http: {
                id: "UR3CLNT120_HTTP",
                host: "example.corp.com",
                port: "50055", // note: string is also valid for the port
                pathPrefix: ""
            },
            https: {
                id: "UR3CLNT120_HTTPS",
                host: "example.corp.com",
                port: 44355,
                pathPrefix: ""
            },
            rfc: {
                id: "UR3CLNT120",
                systemId: "",
                host: "/H/Coffee/S/Decaf/G/Roast",
                service: 3255,
                loginGroup: "",
                sncNameR3: "p/secude:CN=UR3, O=SAP-AG, C=DE",
                sncQoPR3: "8"
            },
            id: "UR3CLNT120",
            client: "120",
            language: ""
        },
        ALIASRFC: {
            http: {
                id: "ALIASRFC_HTTP",
                host: "example.corp.com",
                port: 50055,
                pathPrefix: "/aliaspath//"
            },
            https: {
                id: "ALIASRFC_HTTPS",
                host: "example.corp.com",
                port: 1111,
                pathPrefix: "/path/"
            },
            rfc: {
                id: "ALIASRFC",
                systemId: "UV2",
                host: "ldcsuv2",
                service: 32,
                loginGroup: "SPACE",
                sncNameR3: "p/secude:CN=UXR, O=SAP-AG, C=DE",
                sncQoPR3: "9"
            },
            id: "ALIASRFC",
            client: "220",
            language: ""
        },
        ALIAS111: {
            http: {
                id: "ALIAS111",
                host: "vmw.example.corp.com",
                port: 44335,
                pathPrefix: "/go-to/the/moon"
            },
            https: {
                id: "ALIAS111_HTTPS",
                host: "vmw.example.corp.com",
                port: 44335,
                pathPrefix: "/go-to/the/moon"
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
            id: "ALIAS111",
            client: "111",
            language: ""
        },
        EMPTY_PORT_PREFIX_RFC: {
            // typical system alias defined in HCP
            id: "ABAP_BACKEND_FOR_DEMO",
            language: "",
            client: "",
            https: {
                id: "ABAP_BACKEND_FOR_DEMO",
                host: "system.our.domain.corp",
                port: 0, // note: null port
                pathPrefix: "" // note: empty path prefix
            },
            rfc: {} // note: empty RFC
        },
        MULTIPLE_INVALID_FIELDS: {
            http: {
                id: "SYS",
                host: 123, // note: should be a string
                port: "", // note: this is ok: string or number
                pathPrefix: "/go-to/the/moon" // this is correct
            },
            https: {
                id: "SYS",
                // "host": "vmw.example.corp.com",  // no host provided
                port: [44335], // no string or number
                pathPrefix: 456 // note: should be a string
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
            id: "SYS",
            client: "120",
            language: ""
        },
        ONLY_RFC: {
            rfc: {
                id: "SYS",
                systemId: "SYS",
                host: "ldcisys",
                service: 32,
                loginGroup: "SPACE",
                sncNameR3: "",
                sncQoPR3: ""
            },
            id: "SYS",
            client: "120",
            language: ""
        }
    };

    QUnit.module("sap.ushell.ApplicationType", {
        beforeEach: function () {
            return Container.init("local");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("module exports an object", function (assert) {
        assert.strictEqual(
            Object.prototype.toString.apply(ApplicationType),
            "[object Object]",
            "got an object back"
        );
    });

    /*
     * Fixture format
     *
     * - expectSuccess: required boolean
     * - expectedWarnings: optional
     * - expectedResolutionResult: to check for the complete resolution result
     */
    [{
        testDescription: "a valid (transaction) intent is provided",
        oIntent: {
            semanticObject: "Shell",
            action: "startGUI",
            params: {
                "sap-system": ["ALIASRFC"],
                "sap-ui2-tcode": ["SU01"]
            }
        },
        bEnableCompatibilityMode: true,
        expectedResolutionResult: {
            url: "https://example.corp.com:1111/path/gui/sap/its/webgui;~sysid=UV2;~loginGroup=SPACE;~messageServer=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;" +
                "~sncNameR3=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=9?%7etransaction=SU01&%7enosplash=1&sap-client=220&sap-language=EN&sap-iframe-hint=GUI", // see below
            applicationType: "TR", // simply add "TR"
            text: "SU01",
            additionalInformation: "", // leave empty
            "sap-system": "ALIASRFC", // propagate sap-system in here
            systemAlias: ""
        }
    }, {
        testDescription: "a valid (transaction) intent is provided with extra parameters",
        oIntent: {
            semanticObject: "Shell",
            action: "startGUI",
            params: {
                "sap-system": ["ALIASRFC"],
                "sap-ui2-tcode": ["*SU01"],
                "sap-theme": ["sap_hcb"],
                some_parameter: ["some_value"]
            }
        },
        bEnableCompatibilityMode: true,
        /*
         * Note: do not fail anymore here, we
         * just resolve now because the target mapping is assumed to be there
         * in the correct format
         */
        expectedResolutionResult: {
            additionalInformation: "",
            applicationType: "TR",
            "sap-system": "ALIASRFC",
            systemAlias: "",
            text: "*SU01",
            url: "https://example.corp.com:1111/path/gui/sap/its/webgui;~sysid=UV2;~loginGroup=SPACE;~messageServer=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;" +
                "~sncNameR3=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=9?%7etransaction=*SU01&%7enosplash=1&sap-client=220&sap-language=EN&sap-iframe-hint=GUI"
        }
    }, {
        testDescription: "a valid (wda) intent is provided",
        oIntent: {
            semanticObject: "Shell",
            action: "startWDA",
            params: {
                "sap-system": ["UR3CLNT120"],
                "sap-ui2-wd-app-id": ["APPID"]
            }
        },
        bEnableCompatibilityMode: true,
        expectedResolutionResult: {
            url: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/APPID/?sap-client=120&sap-language=EN&sap-iframe-hint=NWBC",
            applicationType: "WDA",
            text: "APPID",
            additionalInformation: "",
            "sap-system": "UR3CLNT120",
            systemAlias: "UR3CLNT120"
        }
    }, {
        testDescription: "a valid (wda) intent with sap-wd-conf-id is provided",
        oIntent: {
            semanticObject: "Shell",
            action: "startWDA",
            params: {
                "sap-system": ["UR3CLNT120"],
                "sap-ui2-wd-app-id": ["APPID"],
                "sap-ui2-wd-conf-id": ["CONFIG_PARAMETER"]
            }
        },
        bEnableCompatibilityMode: true,
        expectedResolutionResult: {
            url: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/APPID/?sap-wd-configId=CONFIG_PARAMETER&sap-client=120&sap-language=EN&sap-iframe-hint=NWBC",
            applicationType: "WDA",
            text: "APPID",
            additionalInformation: "",
            "sap-system": "UR3CLNT120",
            systemAlias: "UR3CLNT120"
        }
    }, {
        testDescription: "a valid (wda) intent with sap-wd-conf-id with special characters is provided",
        oIntent: {
            semanticObject: "Shell",
            action: "startWDA",
            params: {
                "sap-system": ["UR3CLNT120"],
                "sap-ui2-wd-app-id": ["APPID"],
                "sap-ui2-wd-conf-id": ["CO!@^*()_ \":{}<>NFIG"]
            }
        },
        bEnableCompatibilityMode: true,
        expectedResolutionResult: {
            url: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/APPID/" +
                "?sap-wd-configId=CO!%40%5E*()_%20%22%3A%7B%7D%3C%3ENFIG&sap-client=120&sap-language=EN&sap-iframe-hint=NWBC",
            applicationType: "WDA",
            text: "APPID",
            additionalInformation: "",
            "sap-system": "UR3CLNT120",
            systemAlias: "UR3CLNT120"
        }
    }, {
        testDescription: "a valid (wda) intent is provided with extra parameters",
        oIntent: {
            semanticObject: "Shell",
            action: "startWDA",
            params: {
                "sap-system": ["UR3CLNT120"],
                "sap-ui2-wd-app-id": ["APPID"],
                "sap-theme": ["sap_hcb"],
                some_parameter: ["some_value"]
            }
        },
        bEnableCompatibilityMode: true,
        expectedResolutionResult: {
            url: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/APPID/?sap-theme=sap_hcb&some_parameter=some_value&sap-client=120&sap-language=EN&sap-iframe-hint=NWBC",
            applicationType: "WDA",
            text: "APPID",
            additionalInformation: "",
            "sap-system": "UR3CLNT120",
            systemAlias: "UR3CLNT120"
        }
    }].forEach(function (oFixture) {
        QUnit.test("resolveEasyAccessMenuIntent returns the correct resolution result when " + oFixture.testDescription, function (assert) {
            var fnDone = assert.async();

            var oStubGetUser = sinon.stub(Container, "getUser").returns({
                    getLanguage: sinon.stub().returns("EN")
                });

            var fnExternalResolver = function (sSystemAlias) {
                if (sSystemAlias === "") {
                    return new jQuery.Deferred().resolve(O_LOCAL_SYSTEM_ALIAS).promise();
                }
                if (O_KNOWN_SYSTEM_ALIASES.hasOwnProperty(sSystemAlias)) {
                    return new jQuery.Deferred().resolve(O_KNOWN_SYSTEM_ALIASES[sSystemAlias]).promise();
                }
                return new jQuery.Deferred().reject("Cannot resolve unknown system alias").promise();
            };

            // Act
            var sIntent = [oFixture.oIntent.semanticObject, oFixture.oIntent.action].join("-");
            var fnResolver = ApplicationType.getEasyAccessMenuResolver(sIntent);
            if (!fnResolver) {
                assert.ok(false, "resolver was not returned");
                oStubGetUser.restore();
                fnDone();
                return;
            }
            assert.ok(true, "resolver was returned");

            fnResolver(oFixture.oIntent, {
                resolutionResult: {},
                intentParamsPlusAllDefaults: {
                    "sap-system": [oFixture.oIntent["sap-system"]]
                },
                inbound: {
                    semanticObject: "Shell",
                    action: "startGUI",
                    id: "Shell-startGUI~686q",
                    title: "DUMMY",
                    resolutionResult: {
                        applicationType: "TR",
                        additionalInformation: "",
                        text: "DUMMY",
                        url: "/ui2/nwbc/~canvas;window=app/transaction/DUMMY?sap-client=120&sap-language=EN",
                        systemAlias: ""
                    },
                    deviceTypes: {
                        desktop: true,
                        phone: false,
                        tablet: false
                    },
                    signature: {
                        additionalParameters: "ignored",
                        parameters: {
                            "sap-ui2-tcode": {
                                required: true,
                                filter: {
                                    value: ".+",
                                    format: "regexp"
                                }
                            },
                            "sap-system": {
                                required: true,
                                filter: {
                                    value: ".+",
                                    format: "regexp"
                                }
                            }
                        }
                    }
                }
            }, fnExternalResolver, oFixture.bEnableCompatibilityMode)
                .then(function (oResolutionResultGot) {
                    // Assert
                    if (oFixture.expectedError) {
                        assert.ok(false, "promise was rejected");
                    } else {
                        assert.ok(true, "promise was resolved");
                        assert.strictEqual(isPlainObject(oResolutionResultGot), true, "an object was returned");

                        if (oFixture.expectedResolutionResult) {
                            assert.deepEqual(oResolutionResultGot, oFixture.expectedResolutionResult,
                                "obtained the expected resolution result");
                        }
                    }
                }, function (sErrorGot) {
                    // Assert
                    if (oFixture.expectedError) {
                        assert.ok(true, "promise was rejected");
                        assert.strictEqual(sErrorGot, oFixture.expectedError, "expected error was returned");
                    } else {
                        assert.ok(false, "promise was resolved");
                    }
                })
                .then(function () {
                    oStubGetUser.restore();
                    fnDone();
                }, function () {
                    oStubGetUser.restore();
                    fnDone();
                });
        });
    });

    [{
        testDescription: "return null for Shell-startGUI when resolved application type is SAPUI5",
        sIntent: "Shell-startGUI",
        sResolvedApplicationType: "SAPUI5",
        bReturnResolver: false
    }, {
        testDescription: "return null for Shell-startWDA when resolved application type is SAPUI5",
        sIntent: "Shell-startWDA",
        sResolvedApplicationType: "SAPUI5",
        bReturnResolver: false
    }, {
        testDescription: "return resolver for easyaccess intent when resolved application type is not SAPUI5",
        sIntent: "Shell-startGUI",
        sResolvedApplicationType: "TR",
        bReturnResolver: true
    }, {
        testDescription: "return null for not easyaccess intent",
        sIntent: "Acction-foo",
        sResolvedApplicationType: "TR",
        bReturnResolver: false
    }, {
        testDescription: "return resolver for easyaccess intent when application type is not defined",
        sIntent: "Shell-startGUI",
        sResolvedApplicationType: undefined,
        bReturnResolver: true
    }].forEach(function (oFixture) {
        QUnit.test("resolveEasyAccessMenuIntent: " + oFixture.testDescription, function (assert) {
            var oResolved = ApplicationType.getEasyAccessMenuResolver(oFixture.sIntent, oFixture.sResolvedApplicationType);
            assert.equal(!!oResolved, oFixture.bReturnResolver, "Resolver should be returned: " + oFixture.bReturnResolver);
        });
    });

    [{
        testDescription: "No transformation is needed - enabled = false",
        url: "http://example.org/?key1=1&key2=2#A-B?customerID=100&language=EN",
        capabilities: {
            urlTransformation: {
                enabled: false
            }
        },
        siteAppSection: {
            "sap.integration": {
                urlTemplateParams: {
                    domainTransformationId: "DTID1234",
                    domainHandlerSystemAlias: "DHSA5678"
                }
            }
        },
        ODataValue: "",
        transformedURL: "http://example.org/?key1=1&key2=2#A-B?customerID=100&language=EN"
    },
    {
        testDescription: "Transformation is needed - enabled=true. Taking the result from transformAppLaunchQueryString.value",
        url: "http://example.org/?key1=1&key2=2#A-B?customerID=100&language=EN",
        capabilities: {
            urlTransformation: {
                enabled: true,
                transformations: [
                    {
                        sourceURLComponent: "query",
                        service: {
                            uri: {
                                rootPath: "/sap/opu/odata/UI2/INTEROP",
                                resourcePath: "transformAppLaunchIntent",
                                queryOptions: {
                                    $format: "json",
                                    domainTransformationId: "{join ''',./sap.integration/urlTemplateParams/domainTransformationId,'''}",
                                    domainHandlerSystemAlias: "{join ''',./sap.integration/urlTemplateParams/domainHandlerSystemAlias,'''}",
                                    query: "{join ''',&urlComponent:fragment,'''}"
                                }
                            }
                        }
                    }
                ]
            }
        },
        siteAppSection: {
            "sap.integration": {
                urlTemplateParams: {
                    domainTransformationId: "DTID1234",
                    domainHandlerSystemAlias: "DHSA5678"
                }
            }
        },
        oResult: {
            transformAppLaunchQueryString: { value: "key1=100&key2=200" }
        },
        transformedURL: "http://example.org/?key1=100&key2=200#A-B?customerID=100&language=EN"
    },
    {
        testDescription: "Transformation is needed - enabled = true. Taking the result from transformAppLaunchIntent.value",
        url: "http://example.org/?key1=1&key2=2#A-B?customerID=100&language=EN",
        capabilities: {
            "urlTransformation": {
                "enabled": true,
                "transformations": [
                    {
                        "sourceURLComponent": "fragment",
                        "service": {
                            "uri": {
                                "rootPath": "/sap/opu/odata/UI2/INTEROP",
                                "resourcePath": "transformAppLaunchIntent",
                                "queryOptions": {
                                    "$format": "json",
                                    "domainTransformationId": "{join ''',./sap.integration/urlTemplateParams/domainTransformationId,'''}",
                                    "domainHandlerSystemAlias": "{join ''',./sap.integration/urlTemplateParams/domainHandlerSystemAlias,'''}",
                                    "query": "{join ''',&urlComponent:fragment,'''}"
                                }
                            }
                        }
                    }
                ]
            }
        },
        siteAppSection: {
            "sap.integration": {
                urlTemplateParams: {
                    domainTransformationId: "DTID1234",
                    domainHandlerSystemAlias: "DHSA5678"
                }
            }
        },
        oResult: {
            transformAppLaunchIntent: { value: "A-B?customerID=200&language=EN" }
        },
        transformedURL: "http://example.org/?key1=1&key2=2#A-B?customerID=200&language=EN"
    },
    {
        testDescription: "Transformation is needed - enabled = true. Taking the result from transformAppLaunchQueryString.queryString",
        url: "http://example.org/?key1=1&key2=2#A-B?customerID=100&language=EN",
        capabilities: {
            "urlTransformation": {
                "enabled": true,
                "transformations": [
                    {
                        "sourceURLComponent": "fragment",
                        "service": {
                            "uri": {
                                "rootPath": "/sap/opu/odata/UI2/INTEROP",
                                "resourcePath": "transformAppLaunchIntent",
                                "queryOptions": {
                                    "$format": "json",
                                    "domainTransformationId": "{join ''',./sap.integration/urlTemplateParams/domainTransformationId,'''}",
                                    "domainHandlerSystemAlias": "{join ''',./sap.integration/urlTemplateParams/domainHandlerSystemAlias,'''}",
                                    "query": "{join ''',&urlComponent:fragment,'''}"
                                }
                            }
                        }
                    }
                ]
            }
        },
        siteAppSection: {
            "sap.integration": {
                urlTemplateParams: {
                    domainTransformationId: "DTID1234",
                    domainHandlerSystemAlias: "DHSA5678"
                }
            }
        },
        oResult: {
            transformAppLaunchQueryString: { queryString: "A-B?customerID=200&language=EN" }
        },
        transformedURL: "http://example.org/?key1=1&key2=2#A-B?customerID=200&language=EN"
    }].forEach(function (oFixture) {
        QUnit.test("resolveEasyAccessMenuIntent: " + oFixture.testDescription, function (assert) {
            var done = assert.async();

            sandbox.stub(OData, "read").callsFake(function (request, success) {
                // eslint-disable-next-line max-len
                assert.equal(request.requestUri, "/sap/opu/odata/UI2/INTEROP/transformAppLaunchIntent?%24format=json&domainTransformationId=%27%27&domainHandlerSystemAlias=%27%27&query=%27A-B%3FcustomerID%3D100%26language%3DEN%27", "request.requestUri result is not the one expected");
                assert.deepEqual(request.headers, {'Cache-Control': "no-cache, no-store, must-revalidate",
                Expires: "0",
                Pragma: "no-cache"}, "Mismatach in request.header params");
                success(oFixture.oResult, { statusCode: 200 });
            });

            UrlTemplateResolution.handleURLTransformation(URLTemplateProcessor, oFixture.url, oFixture.capabilities, oFixture.siteAppSection)
                .then(function (sTransformedURL) {
                    assert.equal(sTransformedURL, oFixture.transformedURL, "URLs must be simmilar");
                    done();
            });
          });
        });

    QUnit.test("URLTemplateResolutionResult: empty application ID", function (assert) {
        var done = assert.async();
        var oStubURLTemplateProcessor = sinon.stub(URLTemplateProcessor, "expand");
        oStubURLTemplateProcessor.returns({});

        var oStubGetUser = sinon.stub(Container, "getUser").returns({
            getContentDensity: function () { return {}; },
            getTheme: function () { return "sap_theme"; }
        });

        var oMatchingTarget = {
            parsedIntent: ""
        };
        ObjectPath.set(["inbound", "templateContext", "payload", "urlTemplate"], "myTemplate", oMatchingTarget);
        ObjectPath.set(["inbound", "templateContext", "siteAppSection", "sap.app"], "", oMatchingTarget);
        ApplicationType.URL.generateResolutionResult(oMatchingTarget)
            .then(function () {
                // template processor is called with a urlTemplate
                assert.equal("myTemplate", oStubURLTemplateProcessor.getCall(0).args[0].urlTemplate);
                // Processor is called with app id with an empty string and not with undefined.
                assert.equal("", oStubURLTemplateProcessor.getCall(1).args[0].urlTemplate);
                // processor is called with support info
                assert.equal("", oStubURLTemplateProcessor.getCall(2).args[0].urlTemplate);
                done();
                oStubURLTemplateProcessor.restore();
                oStubGetUser.restore();
            });
    });

    QUnit.test("The easyAccess menu definitions of WDA contains the enableWdaCompatibilityMode parameter.", function (assert) {
        // Act
        var aMenuDefinitions = ApplicationType.getEasyAccessMenuDefinitions();

        // Assert
        assert.strictEqual(aMenuDefinitions[1].enableWdaCompatibilityMode, false, "A value is returned.");
    });

    QUnit.test("URLTemplateResolutionResult: long URL. Test compactURLParameters", function (assert) {
        var done = assert.async();
        var oStubURLTemplateProcessor = sinon.stub(URLTemplateProcessor, "expand");
        oStubURLTemplateProcessor.returns(
            "?sap-client=120&sap-language=EN&siteId=12341234&subaccountId=12341234&scenario=12341234" +
            "&sap-ui-app-id=12341234&sap-ui-versionedLibCss=12341234" +
            "&sap-keep-alive=12341234&sap-statistics=12341234&sap-theme=12341234" +
            "&very-long-url-p1=12341234&very-long-url-p2=12341234&very-long-url-p3=12341234" +
            "&very-long-url-p4=12341234&very-long-url-p5=12341234&very-long-url-p6=12341234" +
            "&very-long-url-p7=12341234&very-long-url-p8=12341234&very-long-url-p9=12341234" +
            "&very-long-url-p10=12341234&very-long-url-p11=12341234&very-long-url-p12=12341234" +
            "&very-long-url-p13=12341234&very-long-url-p14=12341234&very-long-url-p15=12341234" +
            "&very-long-url-p16=12341234&very-long-url-p17=12341234&very-long-url-p18=12341234" +
            "&very-long-url-p19=12341234&very-long-url-p20=12341234&very-long-url-p21=12341234" +
            "&very-long-url-p22=12341234&very-long-url-p23=12341234&very-long-url-p24=12341234" +
            "&very-long-url-p25=12341234&very-long-url-p26=12341234&very-long-url-p27=12341234" +
            "&very-long-url-p28=12341234&very-long-url-p29=12341234&very-long-url-p30=12341234" +
            "&very-long-url-p31=12341234&very-long-url-p32=12341234&very-long-url-p33=12341234"
        );
        var oStubGetUser = sinon.stub(Container, "getUser").returns({
            getContentDensity: function () { return {}; },
            getTheme: function () { return "sap_theme"; }
        });

        var oMatchingTarget = {
            parsedIntent: {
                appSpecificRoute: undefined
            },
            inbound: {
                semanticObject: "Shell",
                action: "startGUI",
                id: "Shell-startGUI~686q",
                title: "DUMMY",
                resolutionResult: {
                    applicationType: "URL",
                    additionalInformation: "",
                    text: "DUMMY",
                    systemAlias: ""
                },
                templateContext: {
                    siteAppSection: {
                        "sap.app": {}
                    },
                    payload: {
                        capabilities: {
                            "navigationMode": "embedded",
                            "startMethod": "GET",
                            "fullWidth": true,
                            "statefulContainer": true,
                            "technicalAppComponentId": "{+technicalAppComponentId}",
                            "appFrameworkId": "UI5",
                            "mandatoryUrlParams": "sap-ui-debug,sap-locale,sap-language,sap-ui-version,scenario,sap-ui-theme," +
                                "sap-theme,sap-statistics,siteId,subaccountId,saasApprouter,webassistdebug,edithelp"
                        },
                        urlTemplate: "urltemplate.fiori"
                    }
                }
            }
        };
        ApplicationType.URL.generateResolutionResult(oMatchingTarget)
            .then(function (oResult) {
                var URL_LENGTH_LIMIT = 1023;

                // url contains parameters from URL template (mandatoryUrlParams)
                assert.ok(oResult.url.indexOf("scenario") !== -1);
                assert.ok(oResult.url.indexOf("subaccountId") !== -1);
                assert.ok(oResult.url.indexOf("siteId") !== -1);
                assert.ok(oResult.url.indexOf("sap-statistics") !== -1);

                // url contains parameters from ApplicationType retained parameters list
                assert.ok(oResult.url.indexOf("sap-language") !== -1);
                assert.ok(oResult.url.indexOf("sap-iframe-hint") !== -1);
                assert.ok(oResult.url.indexOf("sap-ui-versionedLibCss") !== -1);
                assert.ok(oResult.url.indexOf("sap-keep-alive") !== -1);

                // url doesn't contains duplicates of parameters
                assert.ok(oResult.url.indexOf("sap-language") !== -1 && (oResult.url.indexOf("sap-language") === oResult.url.lastIndexOf("sap-language")));
                assert.ok(oResult.url.indexOf("sap-theme") !== -1 && (oResult.url.indexOf("sap-theme") === oResult.url.lastIndexOf("sap-theme")));

                // url is in proper length
                assert.ok(oResult.url.length < URL_LENGTH_LIMIT);

                done();
                oStubURLTemplateProcessor.restore();
                oStubGetUser.restore();
            });
    });
});
