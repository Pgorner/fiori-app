// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.utils.UrlParsing
 */
sap.ui.define([
    "sap/ui/thirdparty/URI",
    "sap/base/Log",
    "sap/ushell/Container",
    "sap/ushell/utils/UrlParsing",
    "sap/ui/core/Component",
    "sap/ui/thirdparty/jquery"
], function (
    URI,
    Log,
    Container,
    UrlParsingUtil,
    Component,
    jQuery
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.services.URLParsing", {
        beforeEach: function (assert) {
            var done = assert.async();
            this.FLPUrlAsyncStub = sandbox.stub(Container, "getFLPUrlAsync");
            Container.init("local")
                .then(function () {
                    Promise.all([
                        Container.getServiceAsync("URLParsing"),
                        Container.getServiceAsync("NavTargetResolutionInternal")
                    ])
                        .then(function (aServices) {
                            this.URLParsing = aServices[0];
                            this.NavTargetResolutionInternal = aServices[1];
                            done();
                        }.bind(this));
                }.bind(this));

        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("getShellHash", function (assert) {
        assert.deepEqual(this.URLParsing.getShellHash("http://urlabc#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B"),
            "SO-ABC~CONTXT?ABC=3&DEF=4", "full qualified URL");
        assert.deepEqual(this.URLParsing.getShellHash("#SO-ABC~CONTXT?ABC=3&DEF=4"),
            "SO-ABC~CONTXT?ABC=3&DEF=4", "hash incl #");
        assert.deepEqual(this.URLParsing.getShellHash("#-st22~CONTXT?ABC=3&DEF=4"),
            "-st22~CONTXT?ABC=3&DEF=4", "empty SO"); // real example
    });

    QUnit.test("getShellHash bad", function (assert) {
        assert.deepEqual(this.URLParsing.getShellHash("123445"), undefined, "bad url");
        assert.deepEqual(this.URLParsing.getShellHash("SO-ABC~CONTXT?ABC=3&DEF=4"), undefined, "# missing");
    });

    QUnit.test("getHash", function (assert) {
        var sHash = this.URLParsing.getHash("http://urlabc?A=B~DEF#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B");
        assert.deepEqual(sHash, "SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B");
    });

    QUnit.test("getHash", function (assert) {
        var sHash = this.URLParsing.getHash("#Sonicht#SO-action");
        assert.deepEqual(sHash, "Sonicht#SO-action");
    });

    // hash parsing functions
    // breakdown a unified shell hash into segments
    // #SO-Action~CONTEXT?a=1&b=2;c=3&/def
    //

    QUnit.test("parseShellHash SO-ABC", function (assert) {
        var oShellHash = this.URLParsing.parseShellHash("SO-ABC?");
        assert.deepEqual(oShellHash.semanticObject, "SO");
        assert.deepEqual(oShellHash.action, "ABC");
        assert.deepEqual(Object.hasOwnProperty(oShellHash, "contextRaw"), false);
        assert.deepEqual(oShellHash.contextRaw, undefined);
    });

    QUnit.test("parseShellHash SO-ABC2", function (assert) {
        var oShellHash = this.URLParsing.parseShellHash("SO-ABC");
        assert.deepEqual(oShellHash.semanticObject, "SO");
        assert.deepEqual(oShellHash.action, "ABC");
    });

    QUnit.test("parseShellHash AppSpecificOnly", function (assert) {
        var oShellHash = this.URLParsing.parseShellHash("&/ABCDEF&/HIJ");
        assert.deepEqual({
            action: undefined,
            appSpecificRoute: "&/ABCDEF&/HIJ",
            semanticObject: undefined,
            contextRaw: undefined,
            params: {}
        }, oShellHash);
    });

    QUnit.test("parseShellHash AppSpecificOnly2", function (assert) {
        var oShellHash = this.URLParsing.parseShellHash("#&/ABCDEF&/HIJ");
        assert.deepEqual({
            action: undefined,
            appSpecificRoute: "&/ABCDEF&/HIJ",
            semanticObject: undefined,
            contextRaw: undefined,
            params: {}
        }, oShellHash);
    });

    QUnit.test("parseShellHash #SO-ABC", function (assert) {
        var oShellHash = this.URLParsing.parseShellHash("#SO-ABC");
        assert.deepEqual(oShellHash.semanticObject, "SO");
        assert.deepEqual(oShellHash.action, "ABC");
    });

    QUnit.test("parseShellHash full", function (assert) {
        var oShellHash = this.URLParsing.parseShellHash("SO-ABC~CONTXT?ABC=3A&DEF=4B&/detail/1?A=B");
        assert.deepEqual(oShellHash.semanticObject, "SO");
        assert.deepEqual(oShellHash.action, "ABC");
        assert.deepEqual(oShellHash.contextRaw, "CONTXT");
        assert.deepEqual(oShellHash.params, { ABC: ["3A"], DEF: ["4B"] });
        assert.deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    QUnit.test("parseShellHash full duplicates", function (assert) {
        var oShellHash = this.URLParsing.parseShellHash("/Seman/tic-Action-name~AEFHIJ==?ABC=3&DEF=5&ABC=4&/detail/1?A=B");
        assert.deepEqual(oShellHash.semanticObject, "/Seman/tic");
        assert.deepEqual(oShellHash.action, "Action-name");
        assert.deepEqual(oShellHash.contextRaw, "AEFHIJ==");
        assert.deepEqual(oShellHash.params, { ABC: ["3", "4"], DEF: ["5"] });
        assert.deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    QUnit.test("parseShellHash only SO-ABC", function (assert) {
        var oShellHash = this.URLParsing.parseShellHash("SO-ABC~CONTXT");
        assert.deepEqual(oShellHash.semanticObject, "SO");
        assert.deepEqual(oShellHash.action, "ABC");
        assert.deepEqual(oShellHash.contextRaw, "CONTXT");
        assert.deepEqual(oShellHash.params, {});
        assert.deepEqual(oShellHash.appSpecificRoute, undefined);
    });

    QUnit.test("parseShellHash no params", function (assert) {
        var oShellHash = this.URLParsing.parseShellHash("SO-ABC~CONTXT&/detail/1?A=B");
        assert.deepEqual(oShellHash.semanticObject, "SO");
        assert.deepEqual(oShellHash.action, "ABC");
        assert.deepEqual(oShellHash.contextRaw, "CONTXT");
        assert.deepEqual(oShellHash.params, {});
        assert.deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    QUnit.test("parseShellHash full no route", function (assert) {
        var oShellHash = this.URLParsing.parseShellHash("/Seman/tic-Action-name~AEFHIJ==?ABC=3&DEF=5&ABC=4%205");
        assert.deepEqual(oShellHash.semanticObject, "/Seman/tic");
        assert.deepEqual(oShellHash.action, "Action-name");
        assert.deepEqual(oShellHash.contextRaw, "AEFHIJ==");
        assert.deepEqual(oShellHash.params, { ABC: ["3", "4 5"], DEF: ["5"] });
        assert.deepEqual(oShellHash.hasOwnProperty("appSpecificRoute"), true);
        assert.deepEqual(oShellHash.appSpecificRoute, undefined);
    });

    QUnit.test("parseShellHash full no params", function (assert) {
        var oShellHash = this.URLParsing.parseShellHash("/Seman/tic-/Act/ion-name~AEFHIJ==?&/detail/1?A=B");
        assert.deepEqual(oShellHash.semanticObject, "/Seman/tic");
        assert.deepEqual(oShellHash.action, "/Act/ion-name");
        assert.deepEqual(oShellHash.contextRaw, "AEFHIJ==");
        assert.deepEqual(oShellHash.params, {});
        assert.deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    QUnit.test("parseShellHash no context", function (assert) {
        var oShellHash = this.URLParsing.parseShellHash("/Seman/tic-/Act/ion-name?&/detail/1?A=B");
        assert.deepEqual(oShellHash.semanticObject, "/Seman/tic");
        assert.deepEqual(oShellHash.action, "/Act/ion-name");
        assert.deepEqual(oShellHash.contextRaw, undefined);
        assert.deepEqual(oShellHash.params, {});
        assert.deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    QUnit.test("parseShellHash only app specific part", function (assert) {
        var oShellHash = this.URLParsing.parseShellHash("&/detail/1?A=B");
        assert.deepEqual(oShellHash.semanticObject, undefined);
        assert.deepEqual(oShellHash.action, undefined);
        assert.deepEqual(oShellHash.action, undefined);
        assert.deepEqual(oShellHash.contextRaw, undefined);
        assert.deepEqual(oShellHash.params, {});
        assert.deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    QUnit.test("parseParameters", function (assert) {
        var oRes = this.URLParsing.parseParameters("?ABC=3A&DEF=4B");
        assert.deepEqual(oRes, { ABC: ["3A"], DEF: ["4B"] });
    });

    QUnit.test('parseParameters - Empty (with "?")', function (assert) {
        var oRes = this.URLParsing.parseParameters("?");
        assert.deepEqual(oRes, {});
    });

    QUnit.test('parseParameters - Empty (without "?")', function (assert) {
        var oRes = this.URLParsing.parseParameters("");
        assert.deepEqual(oRes, {});
    });

    QUnit.test("parseParameters - Encoded key (once)", function (assert) {
        var oRes = this.URLParsing.parseParameters("?%24.basicSearch=hello");
        assert.deepEqual(oRes, { "$.basicSearch": ["hello"] });
    });

    QUnit.test("parseParameters - Encoded key (twice)", function (assert) {
        var oRes = this.URLParsing.parseParameters("?%2524.basicSearch=hello");
        assert.deepEqual(oRes, { "$.basicSearch": ["hello"] });
    });

    QUnit.test("constructShellHash FullNoRoute", function (assert) {
        var sShellHash = this.URLParsing.constructShellHash({
            target: {
                semanticObject: "/Seman/tic",
                action: "Action-name",
                contextRaw: "AEFHIJ=="
            },
            params: {
                ABC: ["3", "4"],
                DEF: ["5"]
            }
        });
        assert.deepEqual("/Seman/tic-Action-name~AEFHIJ==?ABC=3&ABC=4&DEF=5", sShellHash);
    });

    QUnit.test("constructShellHash Param URL encoding", function (assert) {
        var sShellHash = this.URLParsing.constructShellHash({
            target: {
                semanticObject: "Semantic",
                action: "Action-name",
                contextRaw: "AEFHIJ=="
            },
            params: {
                "/AB=D/EF": ["5"],
                "/AB/C": ["3", "4 5"]
            }
        });
        assert.deepEqual(sShellHash, "Semantic-Action-name~AEFHIJ==?%2FAB%2FC=3&%2FAB%2FC=4%205&%2FAB%3DD%2FEF=5", " escaped");
    });

    QUnit.test("constructShellHash Param URL encoding & parseShellHash decode ", function (assert) {
        var oUrlParsingService,
            sShellHash,
            oShellHashInput,
            oShellHashOutput;
        // Arrange
        oUrlParsingService = this.URLParsing;
        oShellHashInput = {
            target: {
                semanticObject: "Semantic",
                action: "Action-name",
                contextRaw: "AEFHIJ=="
            },
            params: {
                AB: ["Post", "P&G 4711"],
                CD: ["3", "4 5"]
            }
        };
        // Act
        sShellHash = oUrlParsingService.constructShellHash(oShellHashInput);
        // Assert
        assert.deepEqual(sShellHash, "Semantic-Action-name~AEFHIJ==?AB=Post&AB=P%26G%204711&CD=3&CD=4%205", " escaped");
        // Act
        oShellHashOutput = oUrlParsingService.parseShellHash(sShellHash);
        // Assert
        assert.deepEqual(oShellHashOutput.params, oShellHashInput.params, " parsed");
    });

    QUnit.test("constructShellHash URL encoding", function (assert) {
        var sShellHash = this.URLParsing.constructShellHash({
            target: {
                semanticObject: "Semantic",
                action: "Action-name",
                contextRaw: "AEFHIJ=="
            },
            params: {
                DEF: ["5"],
                ABC: ["3", "4 5"]
            }
        });
        assert.deepEqual("Semantic-Action-name~AEFHIJ==?ABC=3&ABC=4%205&DEF=5", sShellHash);
    });

    QUnit.test("constructShellNoWarnOnNoArray", function (assert) {
        var oUrlParsing = this.URLParsing;
        var spyjQueryLogError = sandbox.spy(Log, "error");
        var sShellHash = oUrlParsing.constructShellHash({
            target: {
                semanticObject: "Semantic",
                action: "Action-name"
            },
            params: {
                DEF: ["5"],
                ABC: ["3"]
            }
        });
        assert.deepEqual("Semantic-Action-name?ABC=3&DEF=5", sShellHash);
        assert.deepEqual(false, spyjQueryLogError.called, "Error not called");
        spyjQueryLogError.restore();
    });

    QUnit.test("constructShellWarnOnArray", function (assert) {
        var spyjQueryLogError = sandbox.spy(Log, "error"),
            sShellHash = this.URLParsing.constructShellHash({
                target: {
                    semanticObject: "Semantic",
                    action: "Action-name"
                },
                params: {
                    DEF: ["5"],
                    ABC: ["3", "4 5"]
                }
            });
        assert.deepEqual("Semantic-Action-name?ABC=3&ABC=4%205&DEF=5", sShellHash);
        assert.deepEqual(true, spyjQueryLogError.called, "Error called");
        assert.deepEqual(true, spyjQueryLogError.calledWith("Array startup parameters violate the designed intent of the Unified Shell Intent, use only single-valued parameters!"), "correct arg");
        spyjQueryLogError.restore();
    });

    QUnit.test("constructShellHashOrder", function (assert) {
        var sShellHash = this.URLParsing.constructShellHash({
            target: {
                semanticObject: "/Seman/tic",
                action: "Action-name",
                contextRaw: "AEFHIJ=="
            },
            params: {
                DEF: ["5"],
                ABC: ["3", "4 5"]
            },
            appSpecificRoute: "&/soso"
        });
        assert.deepEqual("/Seman/tic-Action-name~AEFHIJ==?ABC=3&ABC=4%205&DEF=5&/soso", sShellHash);
    });

    QUnit.test("constructApp State sap-xapp-state", function (assert) {
        var sShellHash = this.URLParsing.constructShellHash({
            target: {
                semanticObject: "/Seman/tic",
                action: "Action-name",
                contextRaw: "AEFHIJ=="
            },
            params: {
                DEF: ["5"],
                ABC: ["3", "4 5"],
                aaa: 4,
                zzz: 5
            },
            appStateKey: "ODLORIS",
            appSpecificRoute: "&/soso"
        });
        assert.deepEqual("/Seman/tic-Action-name~AEFHIJ==?ABC=3&ABC=4%205&DEF=5&aaa=4&sap-xapp-state=ODLORIS&zzz=5&/soso", sShellHash);
    });

    QUnit.test("constructShellHashSemiFlat", function (assert) {
        var sShellHash = this.URLParsing.constructShellHash({
            target: {
                semanticObject: "/Seman/tic",
                action: "Action-name",
                contextRaw: "AEFHIJ=="
            },
            params: {
                DEF: "5",
                ABC: ["3", "4"]
            }
        });
        assert.deepEqual("/Seman/tic-Action-name~AEFHIJ==?ABC=3&ABC=4&DEF=5", sShellHash);
    });

    QUnit.test("constructShellHashSpecified", function (assert) {
        var sShellHash = this.URLParsing.constructShellHash({
            target: { shellHash: "#ABC-def?ABC=%2520A" }
        });
        assert.deepEqual("ABC-def?ABC=%2520A", sShellHash);
    });

    QUnit.test("constructShellHashSpecifiedWithIntern", function (assert) {
        var sShellHash = this.URLParsing.constructShellHash({
            target: { shellHash: "ABC-def?ABC=%2520A&/ABC/HKL" }
        });
        assert.deepEqual("ABC-def?ABC=%2520A&/ABC/HKL", sShellHash);
    });

    QUnit.test("constructShellWithHash", function (assert) {
        var sShellHash = this.URLParsing.constructShellHash({
            target: { shellHash: "#" }
        });
        assert.deepEqual("", sShellHash);
    });

    QUnit.test("constructShellHashEmpty", function (assert) {
        var sShellHash = this.URLParsing.constructShellHash({
            target: { shellHash: "" }
        });
        assert.deepEqual("", sShellHash);
    });

    QUnit.test("constructShellHashUNDEF", function (assert) {
        var sShellHash = this.URLParsing.constructShellHash({
            target: { shellHash: undefined }
        });
        assert.deepEqual("", sShellHash);
    });

    QUnit.test("constructShellHashAppSpecific", function (assert) {
        var sShellHash = this.URLParsing.constructShellHash({
            target: {
                semanticObject: "ABC",
                action: "Hugo"
            },
            appSpecificRoute: "&/EINBAYER"
        });
        assert.deepEqual("ABC-Hugo&/EINBAYER", sShellHash);
    });

    QUnit.test("constructShellHashEmptyAppSpecific", function (assert) {
        var sShellHash = this.URLParsing.constructShellHash({
            target: { shellHash: "" },
            appSpecificRoute: "&/EINBAYER"
        });
        assert.deepEqual("&/EINBAYER", sShellHash);
    });

    QUnit.test("constructShellHashEmptyTarget", function (assert) {
        var sShellHash = this.URLParsing.constructShellHash({
            target: {}
        });
        assert.deepEqual("", sShellHash);
    });

    QUnit.test("constructShell HashNoParam", function (assert) {
        var sShellHash = this.URLParsing.constructShellHash({
            target: {
                semanticObject: "/Seman/tic",
                action: "Action-name"
            }
        });
        assert.deepEqual("/Seman/tic-Action-name", sShellHash);
    });

    QUnit.test("constructShellHash parameter starting with slash", function (assert) {
        var sShellHash = this.URLParsing.constructShellHash({
            target: {
                semanticObject: "Action",
                action: "toTest"
            },
            params: {
                a: "3",
                b: "4",
                A: "1",
                AA: "2",
                "/h4screen": "0"
            }
        });
        assert.deepEqual(sShellHash, "Action-toTest?%2Fh4screen=0&A=1&AA=2&a=3&b=4", "Returned the correct hash");
    });

    QUnit.test("splitHash", function (assert) {
        var oShellHash = this.URLParsing.splitHash(
            "#Object-name~AFE2==?PV1=PV2&PV4=V5&/display/detail/7?UU=HH"
        );
        assert.deepEqual({
            shellPart: "Object-name~AFE2==?PV1=PV2&PV4=V5",
            appSpecificRoute: "&/display/detail/7?UU=HH"
        }, oShellHash);
    });

    QUnit.test("splitHash2", function (assert) {
        var oShellHash = this.URLParsing.splitHash(
            "Object-name~AFE2==?PV1=PV2&PV4=V5&/display/detail/7?UU=HH"
        );
        assert.deepEqual({
            shellPart: "Object-name~AFE2==?PV1=PV2&PV4=V5",
            appSpecificRoute: "&/display/detail/7?UU=HH"
        }, oShellHash);
    });

    QUnit.test("splitHash3", function (assert) {
        var sShellHash = this.URLParsing.splitHash("Object-name~AFE2==?PV1=PV2&/SOSO?DEF&/IST&k=3");
        assert.deepEqual({
            shellPart: "Object-name~AFE2==?PV1=PV2",
            appSpecificRoute: "&/SOSO?DEF&/IST&k=3"
        }, sShellHash);
    });

    QUnit.test("splitHashOnlyShellPart", function (assert) {
        var oShellHash = this.URLParsing.splitHash("shell-Part?DEF=HIJ&K=B");
        assert.deepEqual({
            shellPart: "shell-Part?DEF=HIJ&K=B",
            appSpecificRoute: undefined
        }, oShellHash);
    });

    QUnit.test("splitHashOnlyBadShellPart", function (assert) {
        var oShellHash = this.URLParsing.splitHash("shellPart?DEF-ABC");
        assert.deepEqual({}, oShellHash);
    });

    QUnit.test("splitHashOnlyAppSpecific", function (assert) {
        var oShellHash = this.URLParsing.splitHash(
            "&/display/detail/7?UU=HH"
        );
        assert.deepEqual({
            shellPart: "",
            appSpecificRoute: "&/display/detail/7?UU=HH"
        }, oShellHash);
    });

    QUnit.test("splitHashRobust", function (assert) {
        var oShellHash = this.URLParsing.splitHash("");
        assert.deepEqual({}, oShellHash);
    });

    QUnit.test("splitHashRobust2", function (assert) {
        var oShellHash = this.URLParsing.splitHash("#");
        assert.deepEqual({}, oShellHash);
    });

    QUnit.test("splitHashRobust3", function (assert) {
        var sShellHash = this.URLParsing.splitHash("#&/HIJ");
        assert.deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "" }, sShellHash);
    });

    QUnit.test("splitHashParamApp", function (assert) {
        var sShellHash = this.URLParsing.splitHash("#?HIJ=KLM&/HIJ");
        assert.deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "?HIJ=KLM" }, sShellHash);
    });

    QUnit.test("splitHashRobust3b", function (assert) {
        var sShellHash = this.URLParsing.splitHash("&/HIJ");
        assert.deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "" }, sShellHash);
    });

    QUnit.test("splitHashRobust3c", function (assert) {
        var sShellHash = this.URLParsing.splitHash("#A-B?&&/HIJ");
        assert.deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "A-B?&" }, sShellHash);
    });

    QUnit.test("splitHashRobustBadc", function (assert) {
        var sShellHash = this.URLParsing.splitHash("#A-B&&/HIJ");
        assert.deepEqual({}, sShellHash);
    });

    QUnit.test("splitHashRobustAmp", function (assert) {
        var sShellHash = this.URLParsing.splitHash("#A-B?&&/HIJ");
        assert.deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "A-B?&" }, sShellHash);
    });

    QUnit.test("splitHashRobustAmpAmp", function (assert) {
        var sShellHash = this.URLParsing.splitHash("#A-B?&&&/HIJ");
        assert.deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "A-B?&&" }, sShellHash);
    });

    QUnit.test("splitHashRobust4", function (assert) {
        var sShellHash = this.URLParsing.splitHash("NOTAHASH&/HIJ");
        assert.deepEqual({}, sShellHash);
    });

    QUnit.test("splitHashRobust4b", function (assert) {
        var sShellHash = this.URLParsing.splitHash("#YES-AHASH&/HIJ&/KLM");
        assert.deepEqual({ appSpecificRoute: "&/HIJ&/KLM", shellPart: "YES-AHASH" }, sShellHash);
    });

    QUnit.test("splitHashRobust4c", function (assert) {
        var sShellHash = this.URLParsing.splitHash("YES-AHASH&/HIJ&/KLM");
        assert.deepEqual({ appSpecificRoute: "&/HIJ&/KLM", shellPart: "YES-AHASH" }, sShellHash);
    });

    QUnit.test("splitHashRobust5", function (assert) {
        var sShellHash = this.URLParsing.splitHash("NOTAHASH&/HIJ&/KLM");
        assert.deepEqual({}, sShellHash);
    });

    QUnit.test("parseShellHashBad1", function (assert) {
        var oShellHash = this.URLParsing.parseShellHash("SOABC?");
        assert.deepEqual(undefined, oShellHash);
    });

    QUnit.test("parseShellHashAppOnly2", function (assert) {
        var oShellHash = this.URLParsing.parseShellHash("&/DEF&/HIJ");
        assert.deepEqual({
            action: undefined,
            appSpecificRoute: "&/DEF&/HIJ",
            contextRaw: undefined,
            params: {},
            semanticObject: undefined
        }, oShellHash);
    });

    QUnit.test("parseShellParamsAndHashOnly2", function (assert) {
        var oShellHash = this.URLParsing.parseShellHash("?A=B&E=K&/DEF&/HIJ");
        assert.deepEqual({
            action: undefined,
            appSpecificRoute: "&/DEF&/HIJ",
            contextRaw: undefined,
            params: { A: ["B"], E: ["K"] },
            semanticObject: undefined
        }, oShellHash);
    });

    QUnit.test("parseShellHashBad3", function (assert) {
        var oShellHash = this.URLParsing.parseShellHash("NOHASH&/DEF&/HIJ");
        assert.deepEqual(undefined, oShellHash);
    });

    QUnit.test("parseShellHashAppOnly3b", function (assert) {
        var oShellHash = this.URLParsing.parseShellHash("#&/DEF&/HIJ");
        assert.deepEqual({
            action: undefined,
            appSpecificRoute: "&/DEF&/HIJ",
            contextRaw: undefined,
            params: {},
            semanticObject: undefined
        }, oShellHash);
    });

    // end of hash breakdown

    // sample usage

    QUnit.test("getServiceURLParser", function (assert) {
        //var oURLParsing = this.URLParsing;
        var oURLParsing = this.URLParsing,
            sShellHash,
            sHash,
            oShellHash;

        assert.ok(oURLParsing !== undefined);

        // extract hash from url

        sShellHash = oURLParsing.getShellHash("http://urlabc?A=B~DEF#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B");
        assert.deepEqual("SO-ABC~CONTXT?ABC=3&DEF=4", sShellHash);

        sHash = oURLParsing.getHash("http://urlabc?A=B~DEF#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B");
        assert.deepEqual("SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B", sHash);

        // break down hash into parts
        oShellHash = oURLParsing.parseShellHash("SO-ABC~CONTXT?ABC=3A&DEF=4B&/detail/1?A=B");
        assert.deepEqual(oShellHash.semanticObject, "SO");
        assert.deepEqual(oShellHash.action, "ABC");
        assert.deepEqual(oShellHash.contextRaw, "CONTXT");
        assert.deepEqual(oShellHash.params, { ABC: ["3A"], DEF: ["4B"] });
        assert.deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    /**
     * @deprecated since 1.118.
     */
    QUnit.test("addSystemToServiceUrl, success", function (assert) {

        var oURLParsing = this.URLParsing;
        var oNTR = this.NavTargetResolutionInternal;
        function testAddSystemToServiceUrl (oAssert, sCurrentResolution, sUrl, sExpectedUrl, vComponentOrSystem) {
            //var oURLParsing = this.URLParsing,
            if (oNTR.getCurrentResolution.restore) {
                oNTR.getCurrentResolution.restore();
            }
            sandbox.stub(oNTR, "getCurrentResolution").returns({ url: sCurrentResolution });
            oAssert.strictEqual(oURLParsing.addSystemToServiceUrl(sUrl, vComponentOrSystem), sExpectedUrl,
                "[" + sCurrentResolution + "] " + sUrl + " -> " + sExpectedUrl);

            oAssert.ok(Container.addRemoteSystemForServiceUrl.calledWith(sExpectedUrl));
        }
        sandbox.spy(Container, "addRemoteSystemForServiceUrl");

        assert.strictEqual(oURLParsing.addSystemToServiceUrl("/sap/opu/odata/MyService"),
            "/sap/opu/odata/MyService");
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp",
            "/sap/opu/odata/MyService",
            "/sap/opu/odata/MyService;o=XYZ", "XYZ");
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp",
            "/sap/opu/odata/MyService;o=/MyEntities",
            "/sap/opu/odata/MyService/MyEntities");

        // see corresponding tests in sap/ushell_abap/pbServices/ui2/Catalog.qunit.js
        // URLs without system and without parameters
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/",
            "/;o=SYS");
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap",
            "/sap;o=SYS");
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/hba/foo",
            "/sap/hba/foo;o=SYS");
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/hba;o=quertz/foo",
            "/sap/hba;o=quertz/foo");
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap;bar=baz/hba/foo",
            "/sap;bar=baz/hba/foo;o=SYS");
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/hba/foo;bar=baz",
            "/sap/hba/foo;bar=baz;o=SYS");
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService/",
            "/sap/opu/odata/MyService;o=SYS/");

        // URLs with system (marker) and without parameters
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=",
            "/sap/opu/odata/MyService;o=SYS");
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=/Pages/$count",
            "/sap/opu/odata/MyService;o=SYS/Pages/$count");
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=xyz/Pages/$count",
            "/sap/opu/odata/MyService;o=xyz/Pages/$count");
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=xyz/",
            "/sap/opu/odata/MyService;o=xyz/");
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=;a/",
            "/sap/opu/odata/MyService;o=SYS;a/");

        // URLs with parameters
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService/?p1=v1&p2=v2",
            "/sap/opu/odata/MyService;o=SYS/?p1=v1&p2=v2");
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService?p1=v1&p2=v2",
            "/sap/opu/odata/MyService;o=SYS?p1=v1&p2=v2");
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService?p1=spec/ial&p2=v2",
            "/sap/opu/odata/MyService;o=SYS?p1=spec/ial&p2=v2");
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService?p1=;o=/&p2=v2",
            "/sap/opu/odata/MyService;o=SYS?p1=;o=/&p2=v2");
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService?p1=;o=XYZ&p2=v2",
            "/sap/opu/odata/MyService;o=SYS?p1=;o=XYZ&p2=v2");
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/UI2/PAGE_BUILDER_CUST;o=?p=a/",
            "/sap/opu/odata/UI2/PAGE_BUILDER_CUST;o=SYS?p=a/");

        // system passed as parameter
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService/",
            "/sap/opu/odata/MyService;o=system/",
            "system");
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=/MyEntities",
            "/sap/opu/odata/MyService;o=system/MyEntities",
            "system");
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp",
            "/sap/opu/odata/MyService;o=/MyEntities",
            "/sap/opu/odata/MyService;o=system/MyEntities",
            "system");

        // system is a component with startup parameters
        var oComponent = new Component({ componentData: { startupParameters: { "sap-system": ["SYS1"] } } });
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
            "/sap/opu/odata/MyService/",
            "/sap/opu/odata/MyService;o=SYS1/",
            oComponent);
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=/MyEntities",
            "/sap/opu/odata/MyService;o=SYS1/MyEntities",
            oComponent);
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService",
            "/sap/opu/odata/MyService;o=SYS1",
            oComponent);

        // present segment is *not* overwritten
        testAddSystemToServiceUrl(assert, "irrelevant",
            "/sap/opu/odata/MyService;o=SYSA/MyEntities",
            "/sap/opu/odata/MyService;o=SYSA/MyEntities",
            oComponent);
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
            "/sap/hana/odata/MyService/",
            "/sap/hana/odata/MyService;o=SYS1/",
            oComponent);
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
            "/cus/srv/",
            "/cus/srv;o=SYS1/",
            oComponent);

        // if an ;mo segment is present, no amendment!
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
            "/sap/hana/odata/MyService;mo/",
            "/sap/hana/odata/MyService;mo/",
            oComponent);
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
            "/sap/hana/odata/MyService;o=SYSX/",
            "/sap/hana/odata/MyService;o=SYSX/",
            oComponent);

        // component without component data, no fallback to use NavTargetResolutionInternal result!
        oComponent = new Component({ componentData: { startupParameters: { nosystem: ["SYS1"] } } });
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
            "/cus/srv/",
            "/cus/srv/",
            oComponent);

        // component without component data function, no fallback to use NavTargetResolutionInternal result!
        oComponent = new Component({ componentData: { startupParameters: { "sap-system": ["SYS1"] } } });
        oComponent.getComponentData = 1234;
        testAddSystemToServiceUrl(assert, "/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
            "/cus/srv/",
            "/cus/srv/",
            oComponent, "no fallback");
    });

    /**
     * @deprecated since 1.118.
     */
    QUnit.test("addSystemToServiceUrl, failures", async function (assert) {
        sap.ui.require([
            "sap/ushell/utils"
        ], function (utils) {
                [
                    undefined,
                    "",
                    "./foo",
                    "sap/hba/foo",
                    "//foo.com/bar",
                    "http://foo.com/bar"
                ].forEach(function (sUrl) {
                    sandbox.spy(utils, "Error");
                    sandbox.spy(Container, "addRemoteSystemForServiceUrl");
                    assert.throws(function () {
                        this.URLParsing.addSystemToServiceUrl(sUrl);
                    }, /Invalid URL/, "'" + sUrl + "' fails");
                    assert.ok(utils.Error.calledWith("Invalid URL: " + sUrl, "sap.ushell.services.URLParsing"));
                    assert.ok(Container.addRemoteSystemForServiceUrl.notCalled);
                    sandbox.restore();
                });
            }
        );
    });

    /**
     * @deprecated since 1.118.
     * Encapsulating tests of the deprecated isIntentUrl function
     */
    (function () {
        var ourURI = (new URI(window.location.href)).normalize();
        var ourUriFullResource = ourURI.protocol() + "://" + ourURI.host() + ourURI.pathname();
        [
            { sUrl: "#SO-action?ABC=DEF&HIJ=KKK&/sogehts#doch", bResult: true },
            { sUrl: "#SOnixtion?ABC=DEF&HIJ=KKK&/sogehts#SO-action", bResult: false },
            { sUrl: "http://www.sap.com:8080/some/path#SO-action?ABC=DEF&HIJ=KKK", bResult: false },
            { sUrl: "this:\\:isnourlpath#SO-action?ABC=DEF&HIJ=KKK", bResult: false },
            { sUrl: "http://:8080/nourl/:8080/urlpath#SO-action?ABC=DEF&HIJ=KKK", bResult: false },
            { sUrl: "#", bResult: false },
            { sUrl: {}, bResult: false },
            { sUrl: ourUriFullResource + "#So-action", bResult: true },
            { sUrl: ourUriFullResource + "?irr=relevant#So-action", bResult: true },
            { sUrl: ourUriFullResource + "?irr=relevant#So-action~ctx?abc=def&aaa?=sxx=x&eee&/ddd", bResult: true },
            { sUrl: ourUriFullResource + "?irr=relevant#Sonicht", bResult: false },
            { sUrl: ourUriFullResource + "?irr=relevant", bResult: false }
        ].forEach(function (oFixture) {
            QUnit.test("isIntentUrl : " + oFixture.sUrl, function (assert) {
                var oURLParsing = this.URLParsing,
                    bResult;
                //Test:
                bResult = oURLParsing.isIntentUrl(oFixture.sUrl);
                //Check:
                assert.equal(bResult, oFixture.bResult, "expected result");
            });
        });
    })();



    QUnit.module("isIntentUrlAsync", {
        beforeEach: function () {
            this.FLPUrlAsyncStub = sandbox.stub(Container, "getFLPUrlAsync");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("gets the FLP URL from the container and uses it", function (assert) {
        //Arrange
        var sIntentUrl = "https://sap.com/flp#some-intent";
        var sFlpUrl = "https://sap.com/flp";
        var oUrlDeferred = new jQuery.Deferred().resolve(sFlpUrl);
        this.FLPUrlAsyncStub.returns(oUrlDeferred.promise());
        var oIsIntentUrlStub = sandbox.stub(UrlParsingUtil, "_isIntentUrl");
        oIsIntentUrlStub.withArgs(sIntentUrl, sFlpUrl).returns(true);

        //Act
        var oIsIntentUrlPromise = UrlParsingUtil.isIntentUrlAsync(sIntentUrl);

        //Assert
        var done = assert.async();
        oIsIntentUrlPromise.then(function (bResult) {
            assert.strictEqual(bResult, true, "the correct result was returned");
            assert.strictEqual(oIsIntentUrlStub.args[0][0], sIntentUrl, "the correct intent URL was used");
            assert.strictEqual(oIsIntentUrlStub.args[0][1], sFlpUrl, "the correct flp URL was used");

            oIsIntentUrlStub.restore();
            done();
        });

    });

    QUnit.test("rejects if the FLP URL could not be retrieved", function (assert) {
        //Arrange
        var oUrlDeferred = new jQuery.Deferred().reject();
        this.FLPUrlAsyncStub.returns(oUrlDeferred.promise());

        //Act
        var sIntentUrl = "https://sap.com/flp#some-intent";
        var oIsIntentUrlPromise = UrlParsingUtil.isIntentUrlAsync(sIntentUrl);

        //Assert
        var done = assert.async();
        oIsIntentUrlPromise.catch(function () {
            assert.ok(true, "the function rejected");
            done();
        });
    });

    QUnit.module("The _removeNonIntentParameters method", {
        beforeEach: function (assert) {
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("The hash parameters is undefined", function (assert) {
        // Arrange
        var oExpectedHashParams = {};

        // Act
        var oResult = UrlParsingUtil._removeNonIntentParameters();

        // Assert
        assert.deepEqual(oResult, oExpectedHashParams,
            "The non intent parameters are getting removed like expected when undefined hash parameters are given");
    });

    QUnit.test("No hash parameters provided", function (assert) {
        // Arrange
        var oExpectedHashParams = {};

        // Act
        var oResult = UrlParsingUtil._removeNonIntentParameters({});

        // Assert
        assert.deepEqual(oResult, oExpectedHashParams,
            "The non intent parameters are getting removed like expected when no hash parameters are given");
    });

    QUnit.test("With intent parameter", function (assert) {
        // Arrange
        var oExpectedHashParams = { x: 4 };

        // Act
        var oResult = UrlParsingUtil._removeNonIntentParameters({ x: 4 });

        // Assert
        assert.deepEqual(oResult, oExpectedHashParams,
            "The non intent parameters are getting removed like expected when an intent parameter is given");
    });

    QUnit.test("With intent parameters and a non intent parameter", function (assert) {
        // Arrange
        var oExpectedHashParams = { x: 4 };

        // Act
        var oResult = UrlParsingUtil._removeNonIntentParameters({
            x: 4,
            "sap-ui-fl-control-variant-id": "xx"
        });

        // Assert
        assert.deepEqual(oResult, oExpectedHashParams,
            "The non intent parameters are getting removed like expected when an intent parameters and a non intent parameter are given");
    });

    QUnit.test("With non intent parameter", function (assert) {
        // Arrange
        var oExpectedHashParams = {};

        // Act
        var oResult = UrlParsingUtil._removeNonIntentParameters({ "sap-ui-fl-control-variant-id": "xx" });

        // Assert
        assert.deepEqual(oResult, oExpectedHashParams,
            "The non intent parameters are getting removed like expected when an intent parameters and a non intent parameter are given");
    });

    QUnit.module("The haveSameIntentParameters method", {
        beforeEach: function (assert) {
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Both sets of parameters are undefined", function (assert) {
        // Act
        var bResult = UrlParsingUtil.haveSameIntentParameters();

        // Assert
        assert.strictEqual(bResult, true, "When no parameters are given, the result should be true.");
    });

    QUnit.test("The given sets of parameters are the same", function (assert) {
        // Arrange
        var oHashObject1 = {
            params: {
                param1: "value1",
                param2: "value2"
            }
        };

        var oHashObject2 = {
            params: {
                param1: "value1",
                param2: "value2"
            }
        };

        // Act
        var bResult = UrlParsingUtil.haveSameIntentParameters(oHashObject1, oHashObject2);

        // Assert
        assert.strictEqual(bResult, true, "The result should be true.");
    });

    QUnit.test("The given sets of parameters are not the same", function (assert) {
        // Arrange
        var oHashObject1 = {
            params: {
                param1: "value1",
                param2: "value2"
            }
        };

        var oHashObject2 = {
            params: {
                param1: "differentValue",
                param2: "value2"
            }
        };

        // Act
        var bResult = UrlParsingUtil.haveSameIntentParameters(oHashObject1, oHashObject2);

        // Assert
        assert.strictEqual(bResult, false, "The result should be false.");
    });

    QUnit.test("One of the sets has additional technical parameters.", function (assert) {
        // Arrange
        var oHashObject1 = {
            params: {
                param1: "value1"
            }
        };

        var oHashObject2 = {
            params: {
                param1: "value1",
                "sap-app-origin": "appOrigin"
            }
        };

        // Act
        var bResult = UrlParsingUtil.haveSameIntentParameters(oHashObject1, oHashObject2);

        // Assert
        assert.strictEqual(bResult, true, "Technical parameters are not intent parameters and therefore the result should be true.");
    });

    QUnit.module("addShellParamsToURL", {
        beforeEach: function () {
            this.FLPUrlAsyncStub = sandbox.stub(Container, "getFLPUrlAsync");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("add Shell parameter to relativ url with hash and app specific route", function (assert) {
        var oAdditionalShellParameters = {
            params: {
                param1: "value1"
            }
        };
        var sNewHash = UrlParsingUtil.addShellParamsToURL(
            "/someRelativeUrl/somePath#SO-action?ABC=DEF&HIJ=KLM&/sometest#more",
            oAdditionalShellParameters
        );
        assert.equal(sNewHash, "/someRelativeUrl/somePath#SO-action?ABC=DEF&HIJ=KLM&param1=value1&/sometest#more", "Url looks as expected");
    });

    QUnit.test("add Shell parameter to hash", function (assert) {
        var oAdditionalShellParameters = {
            params: {
                param1: "value1"
            }
        };
        var sNewHash = UrlParsingUtil.addShellParamsToURL(
            "#SO-action?ABC=DEF&HIJ=KLM",
            oAdditionalShellParameters
        );
        assert.equal(sNewHash, "#SO-action?ABC=DEF&HIJ=KLM&param1=value1", "Url looks as expected");
    });


QUnit.test("add Shell parameter to invalid url", function (assert) {
        var oAdditionalShellParameters = {
            params: {
                param1: "value1"
            }
        };
        try {
        UrlParsingUtil.addShellParamsToURL(
            "/someRelativeUrl/somePath#sdf?ABC=DEF&HIJ=KLM&/sometest#more",
            oAdditionalShellParameters
        );
        assert.notOk(true, "Exception was not thrown");
        } catch (e) {
            assert.ok(true, "Exception was thrown");
        }
    });

    QUnit.module("addParamsToURL", {
        beforeEach: function () {
            this.FLPUrlAsyncStub = sandbox.stub(Container, "getFLPUrlAsync");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("addParamsToUrl", function (assert) {
        var oAdditionalShellParameters = {
                param1: ["value1"]
        };
        var sNewHash = UrlParsingUtil.addParamsToUrl(
            "/SO-action",
            oAdditionalShellParameters
        );
        assert.equal(sNewHash, "/SO-action?param1=value1", "Url looks as expected");
    });

    QUnit.module("The compareHashes method", {
        beforeEach: function (assert) {
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Both hashes are undefined", function (assert) {
        // Arrange
        var oExpectedResult = {
            sameAppSpecificRoute: true,
            sameIntent: true,
            sameParameters: true
        };

        // Act
        var oResult = UrlParsingUtil.compareHashes(undefined, undefined);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "When no hashes are given, the results should be true.");
    });

    QUnit.test("One hash is undefined", function (assert) {
        // Arrange
        var sHash = "#SO-action?ABC=DEF&HIJ=KLM&/sometest#more";
        var oExpectedResult = {
            sameAppSpecificRoute: false,
            sameIntent: false,
            sameParameters: false
        };

        // Act
        var oResult1 = UrlParsingUtil.compareHashes(sHash, undefined);
        var oResult2 = UrlParsingUtil.compareHashes(undefined, sHash);

        // Assert
        assert.deepEqual(oResult1, oExpectedResult, "When one hash is missing, the results should be false.");
        assert.deepEqual(oResult2, oExpectedResult, "When one hash is missing, the results should be false.");
    });

    QUnit.test("Both hashes are the same", function (assert) {
        // Arrange
        var sHash = "#SO-action?ABC=DEF&HIJ=KLM&/sometest#more";
        var oExpectedResult = {
            sameAppSpecificRoute: true,
            sameIntent: true,
            sameParameters: true
        };

        // Act
        var bResult = UrlParsingUtil.compareHashes(sHash, sHash);

        // Assert
        assert.deepEqual(bResult, oExpectedResult, "The hashes should be the same.");
    });

    QUnit.test("Both hashes are the same - parameters are not in the same order", function (assert) {
        // Arrange
        var sHash1 = "#SO-action?HIJ=KLM&ABC=DEF&/sometest#more";
        var sHash2 = "#SO-action?ABC=DEF&HIJ=KLM&/sometest#more";
        var oExpectedResult = {
            sameAppSpecificRoute: true,
            sameIntent: true,
            sameParameters: true
        };

        // Act
        var bResult = UrlParsingUtil.compareHashes(sHash1, sHash2);

        // Assert
        assert.deepEqual(bResult, oExpectedResult, "The hashes should not be the same.");
    });

    QUnit.test("Both hashes are the same - with contextRaw", function (assert) {
        // Arrange
        var sHash1 = "#SO-action~test1?HIJ=KLM&ABC=DEF&/sometest#more";
        var sHash2 = "#SO-action~test1?ABC=DEF&HIJ=KLM&/sometest#more";
        var oExpectedResult = {
            sameAppSpecificRoute: true,
            sameIntent: true,
            sameParameters: true
        };

        // Act
        var bResult = UrlParsingUtil.compareHashes(sHash1, sHash2);

        // Assert
        assert.deepEqual(bResult, oExpectedResult, "The hashes should not be the same.");
    });

    QUnit.test("Both hashes are not the same - appSpecificRoute is different", function (assert) {
        // Arrange
        var sHash1 = "#SO-action?ABC=DEF&HIJ=KLM&/sometest1#more";
        var sHash2 = "#SO-action?ABC=DEF&HIJ=KLM&/sometest2#more";
        var oExpectedResult = {
            sameAppSpecificRoute: false,
            sameIntent: true,
            sameParameters: true
        };

        // Act
        var bResult = UrlParsingUtil.compareHashes(sHash1, sHash2);

        // Assert
        assert.deepEqual(bResult, oExpectedResult, "The hashes should not be the same.");
    });

    QUnit.test("Both hashes are not the same - intent is different", function (assert) {
        // Arrange
        var sHash1 = "#SO-action?ABC=DEF&HIJ=KLM&/sometest#more";
        var sHash2 = "#SO-action2?ABC=DEF&HIJ=KLM&/sometest#more";
        var oExpectedResult = {
            sameAppSpecificRoute: true,
            sameIntent: false,
            sameParameters: true
        };

        // Act
        var bResult = UrlParsingUtil.compareHashes(sHash1, sHash2);

        // Assert
        assert.deepEqual(bResult, oExpectedResult, "The hashes should not be the same.");
    });

    QUnit.test("Both hashes are not the same - appSpecificRoute and intent are different", function (assert) {
        // Arrange
        var sHash1 = "#SO1-action?ABC=DEF&HIJ=KLM&/sometest1#more";
        var sHash2 = "#SO2-action?ABC=DEF&HIJ=KLM&/sometest2#more";
        var oExpectedResult = {
            sameAppSpecificRoute: false,
            sameIntent: false,
            sameParameters: true
        };

        // Act
        var bResult = UrlParsingUtil.compareHashes(sHash1, sHash2);

        // Assert
        assert.deepEqual(bResult, oExpectedResult, "The hashes should not be same.");
    });

    QUnit.test("Both hashes are not the same - appSpecificRoute, intent, and parameters are different", function (assert) {
        // Arrange
        var sHash1 = "#SO1-action?ABC=DEF&HIJ=KLM&/sometest1#more";
        var sHash2 = "#SO2-action?ABC=DEFG&HIJ=KLM&/sometest2#more";
        var oExpectedResult = {
            sameAppSpecificRoute: false,
            sameIntent: false,
            sameParameters: false
        };

        // Act
        var bResult = UrlParsingUtil.compareHashes(sHash1, sHash2);

        // Assert
        assert.deepEqual(bResult, oExpectedResult, "The hashes should not be same.");
    });

    QUnit.test("Both hashes are not the same - contextRaw is different", function (assert) {
        // Arrange
        var sHash1 = "#SO-action~test1?ABC=DEF&HIJ=KLM&/sometest#more";
        var sHash2 = "#SO-action~test2?ABC=DEF&HIJ=KLM&/sometest#more";
        var oExpectedResult = {
            sameAppSpecificRoute: true,
            sameIntent: false,
            sameParameters: true
        };

        // Act
        var bResult = UrlParsingUtil.compareHashes(sHash1, sHash2);

        // Assert
        assert.deepEqual(bResult, oExpectedResult, "The hashes should not be the same.");
    });


    QUnit.module("The haveSameIntent method", {
        beforeEach: function (assert) {
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Both intents are undefined", function (assert) {
        // Act
        var bResult = UrlParsingUtil.haveSameIntent(undefined, undefined);

        // Assert
        assert.strictEqual(bResult, true, "When no intents are given, the result should be true.");
    });

    QUnit.test("The given intents are the same", function (assert) {
        // Arrange
        var oIntent = {
            semanticObject: "SO1",
            action: "action1",
            contextRaw: "contextRaw1"
        };

        // Act
        var bResult = UrlParsingUtil.haveSameIntent(oIntent, oIntent);

        // Assert
        assert.strictEqual(bResult, true, "The intents should be the same.");
    });

    QUnit.test("The given intents are not the same - semantic object is different", function (assert) {
        // Arrange
        var oIntent1 = {
            semanticObject: "SO1",
            action: "action1",
            contextRaw: "contextRaw1"
        };
        var oIntent2 = {
            semanticObject: "SO2",
            action: "action1",
            contextRaw: "contextRaw1"
        };

        // Act
        var bResult = UrlParsingUtil.haveSameIntent(oIntent1, oIntent2);

        // Assert
        assert.strictEqual(bResult, false, "The intents should not be the same.");
    });

    QUnit.test("The given intents are not the same - action is different", function (assert) {
        // Arrange
        var oIntent1 = {
            semanticObject: "SO1",
            action: "action1",
            contextRaw: "contextRaw1"
        };
        var oIntent2 = {
            semanticObject: "SO1",
            action: "action2",
            contextRaw: "contextRaw1"
        };

        // Act
        var bResult = UrlParsingUtil.haveSameIntent(oIntent1, oIntent2);

        // Assert
        assert.strictEqual(bResult, false, "The intents should not be the same.");
    });

    QUnit.test("The given intents are not the same - semantic object and action are different", function (assert) {
        // Arrange
        var oIntent1 = {
            semanticObject: "SO1",
            action: "action1",
            contextRaw: "contextRaw1"
        };
        var oIntent2 = {
            semanticObject: "SO2",
            action: "action2",
            contextRaw: "contextRaw1"
        };

        // Act
        var bResult = UrlParsingUtil.haveSameIntent(oIntent1, oIntent2);

        // Assert
        assert.strictEqual(bResult, false, "The intents should not be the same.");
    });


    QUnit.module("removeParametersWithEmptyValue", {});
    // no effect case
    QUnit.test("Keeps ordinary parameter", function (assert) {
        // Arrange
        var oParams = {
            someParameter: ["someValue"]
        };
        // Act
        UrlParsingUtil.removeParametersWithEmptyValue(oParams, []);
        // Assert
        assert.deepEqual(
            oParams,
            {
                someParameter: ["someValue"]
            },
            "got the expected array of values for some parameters back"
        );
    });
    // effective case
    QUnit.test("Removes some parameter that is null according to URL parsing service", function (assert) {
        // Arrange
        var oParams = {
            someParameter: [""]
        };
        // Act
        UrlParsingUtil.removeParametersWithEmptyValue(oParams, ["someParameter"]);
        // Assert
        assert.deepEqual(oParams, {}, "got the expected array of values for some parameters back");
    });

    // edge case
    QUnit.test("Keeps the combined parameter", function (assert) {
        // Arrange
        var oParams = {
            someParameter: ["", "someValue"]
        };
        // Act
        UrlParsingUtil.removeParametersWithEmptyValue(oParams, ["someParameter"]);
        // Assert
        assert.deepEqual(
            oParams,
            {
                someParameter: ["", "someValue"]
            },
            "got the expected array of values for some parameters back"
        );
    });

    // undefined case
    QUnit.test("Keeps the  parameter", function (assert) {
        // Arrange
        var oParams;
        // Act
        UrlParsingUtil.removeParametersWithEmptyValue(oParams, ["someParameter"]);
        // Assert
        assert.deepEqual(
            oParams, undefined,
            "keeps the object undefined"
        );
    });

    QUnit.module("ensureLeadingHash");

    QUnit.test("Adds '#' if it is missing", async function (assert) {
        // Act
        const sResult = UrlParsingUtil.ensureLeadingHash("abc");
        // Assert
        assert.strictEqual(sResult, "#abc", "The hash was added");
    });

    QUnit.test("Does not add '#' if it is already there", async function (assert) {
        // Act
        const sResult = UrlParsingUtil.ensureLeadingHash("#abc");
        // Assert
        assert.strictEqual(sResult, "#abc", "The hash was added");
    });

    QUnit.test("Returns '#' if undefined was provided", async function (assert) {
        // Act
        const sResult = UrlParsingUtil.ensureLeadingHash();
        // Assert
        assert.strictEqual(sResult, "#", "The correct hash was returned");
    });

    QUnit.module("getBasicHash");

    QUnit.test("Returns the basic hash if full hash was provided", async function (assert) {
        // Act
        const sResult = UrlParsingUtil.getBasicHash("#SemanticObject-action~context?param1=value1&param2=value2");
        // Assert
        assert.strictEqual(sResult, "SemanticObject-action", "The correct hash was returned");
    });

    QUnit.test("Returns the basic hash if full hash without leading # was provided", async function (assert) {
        // Act
        const sResult = UrlParsingUtil.getBasicHash("SemanticObject-action~context?param1=value1&param2=value2");
        // Assert
        assert.strictEqual(sResult, "SemanticObject-action", "The correct hash was returned");
    });

    QUnit.test("Returns empty string if the hash was not parseable", async function (assert) {
        // Act
        const sResult = UrlParsingUtil.getBasicHash("#broken|hash");
        // Assert
        assert.strictEqual(sResult, "", "The correct hash was returned");
    });
});
