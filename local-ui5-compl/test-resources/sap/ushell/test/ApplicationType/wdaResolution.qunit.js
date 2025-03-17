// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/ApplicationType/wdaResolution",
    "sap/ushell/Container"
], function (
    oWdaResolution,
    Container
) {
    "use strict";

    /* global QUnit, sinon */
    var sandbox = sinon.createSandbox();

    QUnit.module("sap.ushell.ApplicationType.wdaResolution", {
        beforeEach: function () { },
        afterEach: () => {
            sandbox.restore();
        }
    });

    QUnit.test("module exports an object", (assert) => {
        assert.strictEqual(
            Object.prototype.toString.apply(oWdaResolution),
            "[object Object]",
            "got an object back"
        );
    });

    QUnit.test("resolveEasyAccessMenuIntentWDA: properly handles an Intent without sap-system", (assert) => {
        // Arrange
        var oIntent = {
            params: {
                "sap-ui2-wd-app-id": ["app1"],
                "sap-ui2-tcode": undefined,
                "sap-system": undefined
            }
        };
        var fnDone = assert.async();

        assert.expect(1);

        oWdaResolution.resolveEasyAccessMenuIntentWDA(oIntent, null, null, null, null).then(function () {
            assert.ok(false, "Promise was rejected");
        }, function (oError) {
            assert.ok(true, "Promise was rejected");
            fnDone();
        });
    });

    QUnit.test("constructWDAURLParameters: Convert xapp-state-data to xapp-state", async (assert) => {
        // Arrange
        const oParams = {
            "sap-xapp-state-data": ["{\"foo\":\"bar\"}"]
        };

        sandbox.stub(Container, "getServiceAsync").callsFake((sService) => {
            if (sService === "AppState") {
                return {
                    createEmptyAppState: (oComponent, bTransient) => {
                        assert.equal(oComponent, undefined, "No component given, as expected");
                        assert.equal(bTransient, true, "Transient appstate enforced, as expected");
                        return {
                            setData: (oData) => {
                                assert.deepEqual(oData, {foo: "bar"}, "setData retrieved correct data");
                            },
                            save: () => {},
                            getKey: () => { return "TAS12345678910"; }
                        };
                    }
                };
            } else if (sService === "ShellNavigationInternal") {
                return {
                    compactParams: (oEffectiveParameters) => {
                        return new jQuery.Deferred().resolve(oEffectiveParameters);
                    }
                };
            }
        });

        // Act
        const sParamString = await oWdaResolution.constructWDAURLParameters(oParams, []);

        // Assert
        assert.equal(sParamString, "sap-xapp-state=TAS12345678910", "Created Param string contains correct params");
    });
});
