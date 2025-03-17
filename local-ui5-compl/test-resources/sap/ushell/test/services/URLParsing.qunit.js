// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.URLParsing
 */
sap.ui.define([
    "sap/ushell/utils",
    "sap/ui/thirdparty/URI",
    "sap/base/Log",
    "sap/ushell/Container",
    "sap/ui/core/Component"
], function (
    utils,
    URI,
    Log,
    Container,
    Component
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    QUnit.module("sap.ushell.services.URLParsing", {
        beforeEach: function (assert) {
            var fnDone = assert.async();
            Container.init("local")
                .then(function () {
                    Promise.all([
                        Container.getServiceAsync("URLParsing"),
                        Container.getServiceAsync("NavTargetResolutionInternal")
                    ]).then(function (aServices) {
                        this.URLParsing = aServices[0];
                        this.NavTargetResolutionInternal = aServices[1];
                        fnDone();
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

    QUnit.test("removes a Parameter that is null according to URL parsing service and keeps it otherwise", function (assert) {
        // Arrange
        var oParams = {
            someParameter: 1,
            someParameterToBeDeleted: [""],
            someParameterNoToBeDeletedBecauseNotEmpty: ["someValue"],
            someEmptyParameterNotToBeDeletedBecauseNotInArray: [""]
        };
        var oExpectedParams = {
            someParameter: 1,
            someParameterNoToBeDeletedBecauseNotEmpty: ["someValue"],
            someEmptyParameterNotToBeDeletedBecauseNotInArray: [""]
        };
        // Act
        this.URLParsing.removeParametersWithEmptyValue(oParams, ["someParameterToBeDeleted", "someParameterNoToBeDeletedBecauseNotEmpty"]);
        // Assert
        assert.deepEqual(oParams, oExpectedParams, "got the expected array of values for some Parameter back");
    });

    QUnit.test("getServiceURLParser", function (assert) {
        assert.ok(this.URLParsing !== undefined);
    });

    QUnit.test("getShellHash", function (assert) {
        assert.deepEqual(this.URLParsing.getShellHash("http://urlabc#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B"), "SO-ABC~CONTXT?ABC=3&DEF=4", "full qualified URL");
        assert.deepEqual(this.URLParsing.getShellHash("#SO-ABC~CONTXT?ABC=3&DEF=4"), "SO-ABC~CONTXT?ABC=3&DEF=4", "hash incl #");
        assert.deepEqual(this.URLParsing.getShellHash("#-st22~CONTXT?ABC=3&DEF=4"), "-st22~CONTXT?ABC=3&DEF=4", "empty SO"); // real example
    });

    QUnit.test("getShellHash bad", function (assert) {
        assert.deepEqual(this.URLParsing.getShellHash("123445"), undefined, "bad url");
        assert.deepEqual(this.URLParsing.getShellHash("SO-ABC~CONTXT?ABC=3&DEF=4"), undefined, "# missing");
    });

    QUnit.test("getHash", function (assert) {
        // Act
        var sHash = this.URLParsing.getHash("http://urlabc?A=B~DEF#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B");

        // Assert
        assert.deepEqual(sHash, "SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B");
    });

    QUnit.test("getHash", function (assert) {
        // Act
        var sHash = this.URLParsing.getHash("#Sonicht#SO-action");

        // Assert
        assert.deepEqual(sHash, "Sonicht#SO-action");
    });

    // hash parsing functions
    // breakdown a unified shell hash into segments
    // #SO-Action~CONTEXT?a=1&b=2;c=3&/def
    //

    QUnit.test("parseShellHash SO-ABC", function (assert) {
        // Act
        var oShellHash = this.URLParsing.parseShellHash("SO-ABC?");

        // Assert
        assert.deepEqual(oShellHash.semanticObject, "SO");
        assert.deepEqual(oShellHash.action, "ABC");
        assert.deepEqual(Object.hasOwnProperty(oShellHash, "contextRaw"), false);
        assert.deepEqual(oShellHash.contextRaw, undefined);
    });

    QUnit.test("parseShellHash SO-ABC2", function (assert) {
        // Act
        var oShellHash = this.URLParsing.parseShellHash("SO-ABC");

        // Assert
        assert.deepEqual(oShellHash.semanticObject, "SO");
        assert.deepEqual(oShellHash.action, "ABC");
    });

    QUnit.test("parseShellHash AppSpecificOnly", function (assert) {
        // Act
        var oShellHash = this.URLParsing.parseShellHash("&/ABCDEF&/HIJ");

        // Assert
        assert.deepEqual({
            action: undefined,
            appSpecificRoute: "&/ABCDEF&/HIJ",
            semanticObject: undefined,
            contextRaw: undefined,
            params: {}
        }, oShellHash);
    });

    QUnit.test("parseShellHash AppSpecificOnly2", function (assert) {
        // Act
        var oShellHash = this.URLParsing.parseShellHash("#&/ABCDEF&/HIJ");

        // Assert
        assert.deepEqual({
            action: undefined,
            appSpecificRoute: "&/ABCDEF&/HIJ",
            semanticObject: undefined,
            contextRaw: undefined,
            params: {}
        }, oShellHash);
    });

    QUnit.test("parseShellHash #SO-ABC", function (assert) {
        // Act
        var oShellHash = this.URLParsing.parseShellHash("#SO-ABC");

        // Assert
        assert.deepEqual(oShellHash.semanticObject, "SO");
        assert.deepEqual(oShellHash.action, "ABC");
    });

    QUnit.test("parseShellHash full", function (assert) {
        // Act
        var oShellHash = this.URLParsing.parseShellHash("SO-ABC~CONTXT?ABC=3A&DEF=4B&/detail/1?A=B");

        // Assert
        assert.deepEqual(oShellHash.semanticObject, "SO");
        assert.deepEqual(oShellHash.action, "ABC");
        assert.deepEqual(oShellHash.contextRaw, "CONTXT");
        assert.deepEqual(oShellHash.params, { ABC: ["3A"], DEF: ["4B"] });
        assert.deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    QUnit.test("parseShellHash full duplicates", function (assert) {
        // Act
        var oShellHash = this.URLParsing.parseShellHash("/Seman/tic-Action-name~AEFHIJ==?ABC=3&DEF=5&ABC=4&/detail/1?A=B");

        // Assert
        assert.deepEqual(oShellHash.semanticObject, "/Seman/tic");
        assert.deepEqual(oShellHash.action, "Action-name");
        assert.deepEqual(oShellHash.contextRaw, "AEFHIJ==");
        assert.deepEqual(oShellHash.params, { ABC: ["3", "4"], DEF: ["5"] });
        assert.deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    QUnit.test("parseShellHash only SO-ABC", function (assert) {
        // Act
        var oShellHash = this.URLParsing.parseShellHash("SO-ABC~CONTXT");

        // Assert
        assert.deepEqual(oShellHash.semanticObject, "SO");
        assert.deepEqual(oShellHash.action, "ABC");
        assert.deepEqual(oShellHash.contextRaw, "CONTXT");
        assert.deepEqual(oShellHash.params, {});
        assert.deepEqual(oShellHash.appSpecificRoute, undefined);
    });

    QUnit.test("parseShellHash no params", function (assert) {
        // Act
        var oShellHash = this.URLParsing.parseShellHash("SO-ABC~CONTXT&/detail/1?A=B");

        // Assert
        assert.deepEqual(oShellHash.semanticObject, "SO");
        assert.deepEqual(oShellHash.action, "ABC");
        assert.deepEqual(oShellHash.contextRaw, "CONTXT");
        assert.deepEqual(oShellHash.params, {});
        assert.deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    QUnit.test("parseShellHash full no route", function (assert) {
        // Act
        var oShellHash = this.URLParsing.parseShellHash("/Seman/tic-Action-name~AEFHIJ==?ABC=3&DEF=5&ABC=4%205");

        // Assert
        assert.deepEqual(oShellHash.semanticObject, "/Seman/tic");
        assert.deepEqual(oShellHash.action, "Action-name");
        assert.deepEqual(oShellHash.contextRaw, "AEFHIJ==");
        assert.deepEqual(oShellHash.params, { ABC: ["3", "4 5"], DEF: ["5"] });
        assert.deepEqual(oShellHash.hasOwnProperty("appSpecificRoute"), true);
        assert.deepEqual(oShellHash.appSpecificRoute, undefined);
    });

    QUnit.test("parseShellHash full no params", function (assert) {
        // Act
        var oShellHash = this.URLParsing.parseShellHash("/Seman/tic-/Act/ion-name~AEFHIJ==?&/detail/1?A=B");

        // Assert
        assert.deepEqual(oShellHash.semanticObject, "/Seman/tic");
        assert.deepEqual(oShellHash.action, "/Act/ion-name");
        assert.deepEqual(oShellHash.contextRaw, "AEFHIJ==");
        assert.deepEqual(oShellHash.params, {});
        assert.deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    QUnit.test("parseShellHash no context", function (assert) {
        // Act
        var oShellHash = this.URLParsing.parseShellHash("/Seman/tic-/Act/ion-name?&/detail/1?A=B");

        // Assert
        assert.deepEqual(oShellHash.semanticObject, "/Seman/tic");
        assert.deepEqual(oShellHash.action, "/Act/ion-name");
        assert.deepEqual(oShellHash.contextRaw, undefined);
        assert.deepEqual(oShellHash.params, {});
        assert.deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    QUnit.test("parseShellHash only app specific part", function (assert) {
        // Act
        var oShellHash = this.URLParsing.parseShellHash("&/detail/1?A=B");

        // Assert
        assert.deepEqual(oShellHash.semanticObject, undefined);
        assert.deepEqual(oShellHash.action, undefined);
        assert.deepEqual(oShellHash.action, undefined);
        assert.deepEqual(oShellHash.contextRaw, undefined);
        assert.deepEqual(oShellHash.params, {});
        assert.deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    QUnit.test("parseParameters", function (assert) {
        // Act
        var oRes = this.URLParsing.parseParameters("?ABC=3A&DEF=4B");

        // Assert
        assert.deepEqual(oRes, { ABC: ["3A"], DEF: ["4B"] });
    });

    QUnit.test("parseParameters Empty", function (assert) {
        // Act
        var oRes = this.URLParsing.parseParameters("?");

        // Assert
        assert.deepEqual(oRes, {});
    });

    QUnit.test("parseParameters Empty2", function (assert) {
        // Act
        var oRes = this.URLParsing.parseParameters("");

        // Assert
        assert.deepEqual(oRes, {});
    });

    QUnit.test("parseParameters", function (assert) {
        // Act
        var oRes = this.URLParsing.parseParameters("?ABC=3A&DEF=4B");

        // Assert
        assert.deepEqual(oRes, { ABC: ["3A"], DEF: ["4B"] });
    });

    QUnit.test("constructShellHash FullNoRoute", function (assert) {
        // Act
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

        // Assert
        assert.deepEqual("/Seman/tic-Action-name~AEFHIJ==?ABC=3&ABC=4&DEF=5", sShellHash);
    });

    QUnit.test("constructShellHash Param URL encoding", function (assert) {
        // Act
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

        // Assert
        assert.deepEqual(sShellHash, "Semantic-Action-name~AEFHIJ==?%2FAB%2FC=3&%2FAB%2FC=4%205&%2FAB%3DD%2FEF=5", " escaped");
    });

    QUnit.test("constructShellHash Param URL encoding & parseShellHash decode ", function (assert) {
        // Arrange
        var oShellHashInput = {
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
        var sShellHash = this.URLParsing.constructShellHash(oShellHashInput);

        // Assert
        assert.deepEqual(sShellHash, "Semantic-Action-name~AEFHIJ==?AB=Post&AB=P%26G%204711&CD=3&CD=4%205", " escaped");

        // Act
        var oShellHashOutput = this.URLParsing.parseShellHash(sShellHash);

        // Assert
        assert.deepEqual(oShellHashOutput.params, oShellHashInput.params, " parsed");
    });

    QUnit.test("constructShellHash URL encoding", function (assert) {
        // Act
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

        // Assert
        assert.deepEqual("Semantic-Action-name~AEFHIJ==?ABC=3&ABC=4%205&DEF=5", sShellHash);
    });

    QUnit.test("constructShellNoWarnOnNoArray", function (assert) {
        // Arrange
        sandbox.spy(Log, "error");

        // Act
        var sShellHash = this.URLParsing.constructShellHash({
            target: {
                semanticObject: "Semantic",
                action: "Action-name"
            },
            params: {
                DEF: ["5"],
                ABC: ["3"]
            }
        });

        // Assert
        assert.deepEqual("Semantic-Action-name?ABC=3&DEF=5", sShellHash);
        assert.deepEqual(false, Log.error.called, "Error not called");
    });

    QUnit.test("constructShellWarnOnArray", function (assert) {
        // Arrange
        sandbox.spy(Log, "error");

        // Act
        var sShellHash = this.URLParsing.constructShellHash({
            target: {
                semanticObject: "Semantic",
                action: "Action-name"
            },
            params: {
                DEF: ["5"],
                ABC: ["3", "4 5"]
            }
        });

        // Assert
        assert.deepEqual("Semantic-Action-name?ABC=3&ABC=4%205&DEF=5", sShellHash);
        assert.deepEqual(true, Log.error.called, "Error called");
        assert.deepEqual(true, Log.error.calledWith("Array startup parameters violate the designed intent of the Unified Shell Intent, use only single-valued parameters!"), "correct arg");
    });

    QUnit.test("constructShellHashOrder", function (assert) {
        // Act
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

        // Assert
        assert.deepEqual("/Seman/tic-Action-name~AEFHIJ==?ABC=3&ABC=4%205&DEF=5&/soso", sShellHash);
    });

    QUnit.test("constructApp State sap-xapp-state", function (assert) {
        // Act
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

        // Assert
        assert.deepEqual("/Seman/tic-Action-name~AEFHIJ==?ABC=3&ABC=4%205&DEF=5&aaa=4&sap-xapp-state=ODLORIS&zzz=5&/soso", sShellHash);
    });

    QUnit.test("constructShellHashSemiFlat", function (assert) {
        // Act
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

        // Assert
        assert.deepEqual("/Seman/tic-Action-name~AEFHIJ==?ABC=3&ABC=4&DEF=5", sShellHash);
    });

    QUnit.test("constructShellHashSpecified", function (assert) {
        // Act
        var sShellHash = this.URLParsing.constructShellHash({
            target: { shellHash: "#ABC-def?ABC=%2520A" }
        });

        // Assert
        assert.deepEqual("ABC-def?ABC=%2520A", sShellHash);
    });

    QUnit.test("constructShellHashSpecifiedWithIntern", function (assert) {
        // Act
        var sShellHash = this.URLParsing.constructShellHash({
            target: { shellHash: "ABC-def?ABC=%2520A&/ABC/HKL" }
        });

        // Assert
        assert.deepEqual("ABC-def?ABC=%2520A&/ABC/HKL", sShellHash);
    });

    QUnit.test("constructShellWithHash", function (assert) {
        // Act
        var sShellHash = this.URLParsing.constructShellHash({
            target: { shellHash: "#" }
        });

        // Assert
        assert.deepEqual("", sShellHash);
    });

    QUnit.test("constructShellHashEmpty", function (assert) {
        // Act
        var sShellHash = this.URLParsing.constructShellHash({
            target: { shellHash: "" }
        });

        // Assert
        assert.deepEqual("", sShellHash);
    });

    QUnit.test("constructShellHashUNDEF", function (assert) {
        // Act
        var sShellHash = this.URLParsing.constructShellHash({
            target: { shellHash: undefined }
        });

        // Assert
        assert.deepEqual("", sShellHash);
    });

    QUnit.test("constructShellHashAppSpecific", function (assert) {
        // Act
        var sShellHash = this.URLParsing.constructShellHash({
            target: {
                semanticObject: "ABC",
                action: "Hugo"
            },
            appSpecificRoute: "&/EINBAYER"
        });

        // Assert
        assert.deepEqual("ABC-Hugo&/EINBAYER", sShellHash);
    });

    QUnit.test("constructShellHashEmptyAppSpecific", function (assert) {
        // Act
        var sShellHash = this.URLParsing.constructShellHash({
            target: { shellHash: "" },
            appSpecificRoute: "&/EINBAYER"
        });

        // Assert
        assert.deepEqual("&/EINBAYER", sShellHash);
    });

    QUnit.test("constructShellHashEmptyTarget", function (assert) {
        // Act
        var sShellHash = this.URLParsing.constructShellHash({
            target: {}
        });

        // Assert
        assert.deepEqual("", sShellHash);
    });

    QUnit.test("constructShell HashNoParam", function (assert) {
        // Act
        var sShellHash = this.URLParsing.constructShellHash({
            target: {
                semanticObject: "/Seman/tic",
                action: "Action-name"
            }
        });

        // Assert
        assert.deepEqual("/Seman/tic-Action-name", sShellHash);
    });

    QUnit.test("constructShellHash parameter starting with slash", function (assert) {
        // Act
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

        // Assert
        assert.deepEqual(sShellHash, "Action-toTest?%2Fh4screen=0&A=1&AA=2&a=3&b=4", "Returned the correct hash");
    });

    QUnit.test("splitHash", function (assert) {
        // Act
        var oShellHash = this.URLParsing.splitHash(
            "#Object-name~AFE2==?PV1=PV2&PV4=V5&/display/detail/7?UU=HH"
        );

        // Assert
        assert.deepEqual({
            shellPart: "Object-name~AFE2==?PV1=PV2&PV4=V5",
            appSpecificRoute: "&/display/detail/7?UU=HH"
        }, oShellHash);
    });

    QUnit.test("splitHash2", function (assert) {
        // Act
        var oShellHash = this.URLParsing.splitHash(
            "Object-name~AFE2==?PV1=PV2&PV4=V5&/display/detail/7?UU=HH"
        );

        // Assert
        assert.deepEqual({
            shellPart: "Object-name~AFE2==?PV1=PV2&PV4=V5",
            appSpecificRoute: "&/display/detail/7?UU=HH"
        }, oShellHash);
    });

    QUnit.test("splitHash3", function (assert) {
        // Act
        var sShellHash = this.URLParsing.splitHash("Object-name~AFE2==?PV1=PV2&/SOSO?DEF&/IST&k=3");

        // Assert
        assert.deepEqual({
            shellPart: "Object-name~AFE2==?PV1=PV2",
            appSpecificRoute: "&/SOSO?DEF&/IST&k=3"
        }, sShellHash);
    });

    QUnit.test("splitHashOnlyShellPart", function (assert) {
        // Act
        var oShellHash = this.URLParsing.splitHash("shell-Part?DEF=HIJ&K=B");

        // Assert
        assert.deepEqual({
            shellPart: "shell-Part?DEF=HIJ&K=B",
            appSpecificRoute: undefined
        }, oShellHash);
    });

    QUnit.test("splitHashOnlyBadShellPart", function (assert) {
        // Act
        var oShellHash = this.URLParsing.splitHash("shellPart?DEF-ABC");

        // Assert
        assert.deepEqual({}, oShellHash);
    });

    QUnit.test("splitHashOnlyAppSpecific", function (assert) {
        // Act
        var oShellHash = this.URLParsing.splitHash(
            "&/display/detail/7?UU=HH"
        );

        // Assert
        assert.deepEqual({
            shellPart: "",
            appSpecificRoute: "&/display/detail/7?UU=HH"
        }, oShellHash);
    });

    QUnit.test("splitHashRobust", function (assert) {
        // Act
        var oShellHash = this.URLParsing.splitHash("");

        // Assert
        assert.deepEqual({}, oShellHash);
    });

    QUnit.test("splitHashRobust2", function (assert) {
        // Act
        var oShellHash = this.URLParsing.splitHash("#");

        // Assert
        assert.deepEqual({}, oShellHash);
    });

    QUnit.test("splitHashRobust3", function (assert) {
        // Act
        var sShellHash = this.URLParsing.splitHash("#&/HIJ");

        // Assert
        assert.deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "" }, sShellHash);
    });

    QUnit.test("splitHashParamApp", function (assert) {
        // Act
        var sShellHash = this.URLParsing.splitHash("#?HIJ=KLM&/HIJ");

        // Assert
        assert.deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "?HIJ=KLM" }, sShellHash);
    });

    QUnit.test("splitHashRobust3b", function (assert) {
        // Act
        var sShellHash = this.URLParsing.splitHash("&/HIJ");

        // Assert
        assert.deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "" }, sShellHash);
    });

    QUnit.test("splitHashRobust3c", function (assert) {
        // Act
        var sShellHash = this.URLParsing.splitHash("#A-B?&&/HIJ");

        // Assert
        assert.deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "A-B?&" }, sShellHash);
    });

    QUnit.test("splitHashRobustBadc", function (assert) {
        // Act
        var sShellHash = this.URLParsing.splitHash("#A-B&&/HIJ");
        assert.deepEqual({}, sShellHash);
    });

    QUnit.test("splitHashRobustAmp", function (assert) {
        // Act
        var sShellHash = this.URLParsing.splitHash("#A-B?&&/HIJ");

        // Assert
        assert.deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "A-B?&" }, sShellHash);
    });

    QUnit.test("splitHashRobustAmpAmp", function (assert) {
        // Act
        var sShellHash = this.URLParsing.splitHash("#A-B?&&&/HIJ");

        // Assert
        assert.deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "A-B?&&" }, sShellHash);
    });

    QUnit.test("splitHashRobust4", function (assert) {
        // Act
        var sShellHash = this.URLParsing.splitHash("NOTAHASH&/HIJ");

        // Assert
        assert.deepEqual({}, sShellHash);
    });

    QUnit.test("splitHashRobust4b", function (assert) {
        // Act
        var sShellHash = this.URLParsing.splitHash("#YES-AHASH&/HIJ&/KLM");

        // Assert
        assert.deepEqual({ appSpecificRoute: "&/HIJ&/KLM", shellPart: "YES-AHASH" }, sShellHash);
    });

    QUnit.test("splitHashRobust4c", function (assert) {
        // Act
        var sShellHash = this.URLParsing.splitHash("YES-AHASH&/HIJ&/KLM");

        // Assert
        assert.deepEqual({ appSpecificRoute: "&/HIJ&/KLM", shellPart: "YES-AHASH" }, sShellHash);
    });

    QUnit.test("splitHashRobust5", function (assert) {
        // Act
        var sShellHash = this.URLParsing.splitHash("NOTAHASH&/HIJ&/KLM");

        // Assert
        assert.deepEqual({}, sShellHash);
    });

    QUnit.test("parseShellHashBad1", function (assert) {
        // Act
        var oShellHash = this.URLParsing.parseShellHash("SOABC?");

        // Assert
        assert.deepEqual(undefined, oShellHash);
    });

    QUnit.test("parseShellHashAppOnly2", function (assert) {
        // Act
        var oShellHash = this.URLParsing.parseShellHash("&/DEF&/HIJ");

        // Assert
        assert.deepEqual({
            action: undefined,
            appSpecificRoute: "&/DEF&/HIJ",
            contextRaw: undefined,
            params: {},
            semanticObject: undefined
        }, oShellHash);
    });

    QUnit.test("parseShellParamsAndHashOnly2", function (assert) {
        // Act
        var oShellHash = this.URLParsing.parseShellHash("?A=B&E=K&/DEF&/HIJ");

        // Assert
        assert.deepEqual({
            action: undefined,
            appSpecificRoute: "&/DEF&/HIJ",
            contextRaw: undefined,
            params: { A: ["B"], E: ["K"] },
            semanticObject: undefined
        }, oShellHash);
    });

    QUnit.test("parseShellHashBad3", function (assert) {
        // Act
        var oShellHash = this.URLParsing.parseShellHash("NOHASH&/DEF&/HIJ");

        // Assert
        assert.deepEqual(undefined, oShellHash);
    });

    QUnit.test("parseShellHashAppOnly3b", function (assert) {
        // Act
        var oShellHash = this.URLParsing.parseShellHash("#&/DEF&/HIJ");

        // Assert
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
        assert.ok(this.URLParsing !== undefined);

        // extract hash from url

        var sShellHash = this.URLParsing.getShellHash("http://urlabc?A=B~DEF#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B");
        assert.deepEqual("SO-ABC~CONTXT?ABC=3&DEF=4", sShellHash);

        var sHash = this.URLParsing.getHash("http://urlabc?A=B~DEF#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B");
        assert.deepEqual("SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B", sHash);

        // break down hash into parts
        var oShellHash = this.URLParsing.parseShellHash("SO-ABC~CONTXT?ABC=3A&DEF=4B&/detail/1?A=B");
        assert.deepEqual(oShellHash.semanticObject, "SO");
        assert.deepEqual(oShellHash.action, "ABC");
        assert.deepEqual(oShellHash.contextRaw, "CONTXT");
        assert.deepEqual(oShellHash.params, { ABC: ["3A"], DEF: ["4B"] });
        assert.deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    /**
     * @deprecated since 1.118.
     */
    function testAddSystemToServiceUrl (sCurrentResolution, sUrl, sExpectedUrl, vComponentOrSystem) {
        // Arrange
        if (this.NavTargetResolutionInternal.getCurrentResolution.restore) {
            this.NavTargetResolutionInternal.getCurrentResolution.restore();
        }
        sandbox.stub(this.NavTargetResolutionInternal, "getCurrentResolution").returns({ url: sCurrentResolution });

        // Act & Assert
        QUnit.assert.strictEqual(this.URLParsing.addSystemToServiceUrl(sUrl, vComponentOrSystem), sExpectedUrl,
            "[" + sCurrentResolution + "] " + sUrl + " -> " + sExpectedUrl);

        QUnit.assert.ok(Container.addRemoteSystemForServiceUrl.calledWith(sExpectedUrl));
    }


    /**
     * @deprecated since 1.118.
     */
    QUnit.test("addSystemToServiceUrl, success", function (assert) {
        sandbox.spy(Container, "addRemoteSystemForServiceUrl");

        assert.strictEqual(this.URLParsing.addSystemToServiceUrl("/sap/opu/odata/MyService"),
            "/sap/opu/odata/MyService");
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp",
            "/sap/opu/odata/MyService",
            "/sap/opu/odata/MyService");
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp",
            "/sap/opu/odata/MyService;o=/MyEntities",
            "/sap/opu/odata/MyService/MyEntities");

        // see corresponding tests in sap/ushell_abap/pbServices/ui2/catalog.qunit.js
        // URLs without system and without parameters
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/",
            "/;o=SYS");
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap",
            "/sap;o=SYS");
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/hba/foo",
            "/sap/hba/foo;o=SYS");
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/hba;o=quertz/foo",
            "/sap/hba;o=quertz/foo");
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap;bar=baz/hba/foo",
            "/sap;bar=baz/hba/foo;o=SYS");
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/hba/foo;bar=baz",
            "/sap/hba/foo;bar=baz;o=SYS");
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService/",
            "/sap/opu/odata/MyService;o=SYS/");

        // URLs with system (marker) and without parameters
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=",
            "/sap/opu/odata/MyService;o=SYS");
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=/Pages/$count",
            "/sap/opu/odata/MyService;o=SYS/Pages/$count");
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=xyz/Pages/$count",
            "/sap/opu/odata/MyService;o=xyz/Pages/$count");
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=xyz/",
            "/sap/opu/odata/MyService;o=xyz/");
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=;a/",
            "/sap/opu/odata/MyService;o=SYS;a/");

        // URLs with parameters
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService/?p1=v1&p2=v2",
            "/sap/opu/odata/MyService;o=SYS/?p1=v1&p2=v2");
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService?p1=v1&p2=v2",
            "/sap/opu/odata/MyService;o=SYS?p1=v1&p2=v2");
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService?p1=spec/ial&p2=v2",
            "/sap/opu/odata/MyService;o=SYS?p1=spec/ial&p2=v2");
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService?p1=;o=/&p2=v2",
            "/sap/opu/odata/MyService;o=SYS?p1=;o=/&p2=v2");
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService?p1=;o=XYZ&p2=v2",
            "/sap/opu/odata/MyService;o=SYS?p1=;o=XYZ&p2=v2");
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/UI2/PAGE_BUILDER_CUST;o=?p=a/",
            "/sap/opu/odata/UI2/PAGE_BUILDER_CUST;o=SYS?p=a/");

        // system passed as parameter
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService/",
            "/sap/opu/odata/MyService;o=system/",
            "system");
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=/MyEntities",
            "/sap/opu/odata/MyService;o=system/MyEntities",
            "system");
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp",
            "/sap/opu/odata/MyService;o=/MyEntities",
            "/sap/opu/odata/MyService;o=system/MyEntities",
            "system");

        // system is a component with startup parameters
        var oComponent = new Component({ componentData: { startupParameters: { "sap-system": ["SYS1"] } } });
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
            "/sap/opu/odata/MyService/",
            "/sap/opu/odata/MyService;o=SYS1/",
            oComponent);
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=/MyEntities",
            "/sap/opu/odata/MyService;o=SYS1/MyEntities",
            oComponent);
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService",
            "/sap/opu/odata/MyService;o=SYS1",
            oComponent);

        // present segment is *not* overwritten
        testAddSystemToServiceUrl.call(this, "irrelevant",
            "/sap/opu/odata/MyService;o=SYSA/MyEntities",
            "/sap/opu/odata/MyService;o=SYSA/MyEntities",
            oComponent);
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
            "/sap/hana/odata/MyService/",
            "/sap/hana/odata/MyService;o=SYS1/",
            oComponent);
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
            "/cus/srv/",
            "/cus/srv;o=SYS1/",
            oComponent);

        // if an ;mo segment is present, no amendment!
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
            "/sap/hana/odata/MyService;mo/",
            "/sap/hana/odata/MyService;mo/",
            oComponent);
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
            "/sap/hana/odata/MyService;o=SYSX/",
            "/sap/hana/odata/MyService;o=SYSX/",
            oComponent);

        // component without component data, no fallback to use NavTargetResolutionInternal result!
        oComponent = new Component({ componentData: { startupParameters: { nosystem: ["SYS1"] } } });
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
            "/cus/srv/",
            "/cus/srv/",
            oComponent);

        // component without component data function, no fallback to use NavTargetResolutionInternal result!
        oComponent = new Component({ componentData: { startupParameters: { "sap-system": ["SYS1"] } } });
        oComponent.getComponentData = 1234;
        testAddSystemToServiceUrl.call(this, "/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
            "/cus/srv/",
            "/cus/srv/",
            oComponent, "no fallback");
    });

    /**
     * @deprecated since 1.118.
     */
    (function () {
        [
            undefined,
            "",
            "./foo",
            "sap/hba/foo",
            "//foo.com/bar",
            "http://foo.com/bar"
        ].forEach(function (sUrl) {
            QUnit.test("addSystemToServiceUrl, failures", function (assert) {
                // Arrange
                sandbox.spy(utils, "Error");
                sandbox.spy(Container, "addRemoteSystemForServiceUrl");

                // Act & Assert
                assert.throws(function () {
                    this.URLParsing.addSystemToServiceUrl(sUrl);
                }.bind(this), /Invalid URL/, "'" + sUrl + "' fails");
                assert.ok(utils.Error.calledWith("Invalid URL: " + sUrl, "sap.ushell.services.URLParsing"));
                assert.ok(Container.addRemoteSystemForServiceUrl.notCalled);
            });
        });

        var sOurURI = (new URI(window.location.href)).normalize();
        var sOurUriFullResource = sOurURI.protocol() + "://" + sOurURI.host() + sOurURI.pathname();
        [
            { sUrl: "#SO-action?ABC=DEF&HIJ=KKK&/sogehts#doch", bResult: true },
            { sUrl: "#SOnixtion?ABC=DEF&HIJ=KKK&/sogehts#SO-action", bResult: false },
            { sUrl: "http://www.sap.com:8080/some/path#SO-action?ABC=DEF&HIJ=KKK", bResult: false },
            { sUrl: "this:\\:isnourlpath#SO-action?ABC=DEF&HIJ=KKK", bResult: false },
            { sUrl: "http://:8080/nourl/:8080/urlpath#SO-action?ABC=DEF&HIJ=KKK", bResult: false },
            { sUrl: "#", bResult: false },
            { sUrl: {}, bResult: false },
            { sUrl: sOurUriFullResource + "#So-action", bResult: true },
            { sUrl: sOurUriFullResource + "?irr=relevant#So-action", bResult: true },
            { sUrl: sOurUriFullResource + "?irr=relevant#So-action~ctx?abc=def&aaa?=sxx=x&eee&/ddd", bResult: true },
            { sUrl: sOurUriFullResource + "?irr=relevant#Sonicht", bResult: false },
            { sUrl: sOurUriFullResource + "?irr=relevant", bResult: false }
        ].forEach(function (oFixture) {
            QUnit.test("isIntentUrl : " + oFixture.sUrl, function (assert) {
                // Act
                var bResult = this.URLParsing.isIntentUrl(oFixture.sUrl);

                // Assert
                assert.equal(bResult, oFixture.bResult, "expected result");
            });
        });
    })();
});
