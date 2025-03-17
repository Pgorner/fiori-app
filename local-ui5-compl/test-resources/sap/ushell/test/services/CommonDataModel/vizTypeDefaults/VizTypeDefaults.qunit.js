// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests sap.ushell.services.CommonDataModel.VizTypeDefaults
 */
sap.ui.define([
    "sap/ushell/services/CommonDataModel/vizTypeDefaults/VizTypeDefaults",
    "sap/ui/core/Manifest",
    "sap/base/util/extend",
    "sap/base/util/ObjectPath"
], function (
    VizTypeDefaults,
    Manifest,
    extend,
    ObjectPath
) {
    "use strict";
    /* global sinon QUnit */

    const sandbox = sinon.createSandbox({});

    function createManifestLoadStub () {
        return sandbox.stub(Manifest, "load").callsFake(function (oProperties) {
            return Promise.resolve({
                getRawJson: function () {
                    return {
                        "sap.app": {
                            url: oProperties.manifestUrl
                        }
                    };
                }
            });
        });
    }

    const oExpectedVizTypes = {
        "sap.ushell.StaticAppLauncher": {
            "sap.app": {
                url: sap.ui.require.toUrl("sap/ushell/components/tiles/cdm/applauncher/manifest.json")
            }
        },
        "sap.ushell.DynamicAppLauncher": {
            "sap.app": {
                url: sap.ui.require.toUrl("sap/ushell/components/tiles/cdm/applauncherdynamic/manifest.json")
            }
        },
        "sap.ushell.Card": {
            "sap.app": {
                url: sap.ui.require.toUrl("sap/ushell/services/CommonDataModel/vizTypeDefaults/cardManifest.json")
            }
        }
    };

    QUnit.module("getAll", {
        beforeEach: function () {
            this.oManifestLoadStub = createManifestLoadStub();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("gets the standard viz types", function (assert) {
        return VizTypeDefaults.getAll().then((oVizTypes) => {
            assert.strictEqual(this.oManifestLoadStub.callCount, 3, "Manifest.load was called 3 times.");
            assert.deepEqual(oVizTypes, oExpectedVizTypes, "Standard vizTypes are loaded correctly.");
        });
    });

    QUnit.module("_getAll", {
        beforeEach: function () {
            this.oVizTypeDefaults = new VizTypeDefaults();
            this.oManifestLoadStub = createManifestLoadStub();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("caches the standard viz types", async function (assert) {
        await this.oVizTypeDefaults._getAll();
        this.oManifestLoadStub.reset();
        return this.oVizTypeDefaults._getAll().then((oVizTypes) => {
            assert.strictEqual(this.oManifestLoadStub.callCount, 0, "Manifest.load was not called.");
            assert.deepEqual(oVizTypes, {
                "sap.ushell.StaticAppLauncher": {
                    "sap.app": {
                        url: sap.ui.require.toUrl("sap/ushell/components/tiles/cdm/applauncher/manifest.json")
                    }
                },
                "sap.ushell.DynamicAppLauncher": {
                    "sap.app": {
                        url: sap.ui.require.toUrl("sap/ushell/components/tiles/cdm/applauncherdynamic/manifest.json")
                    }
                },
                "sap.ushell.Card": {
                    "sap.app": {
                        url: sap.ui.require.toUrl("sap/ushell/services/CommonDataModel/vizTypeDefaults/cardManifest.json")
                    }
                }
            }, "Standard vizTypes are loaded correctly.");
        });
    });

    QUnit.module("_loadManifest", {
        beforeEach: function () {
            this.oVizTypeDefaults = new VizTypeDefaults();
            this.oOriginalManifest = {
                "sap.app": {
                    id: "sap.ushell.components.custom"
                }
            };

            this.oLoadStub = sandbox.stub(Manifest, "load");
            this.oLoadStub.resolves({
                getRawJson: sandbox.stub().returns(this.oOriginalManifest)
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Loads the manifest", function (assert) {
        // Arrange
        var sUrl = "sap/ushell/components/custom/manifest.json";
        var sManifestUrl = "../sap/ushell/components/custom/manifest.json";
        sandbox.stub(sap.ui.require, "toUrl").returns(sManifestUrl);

        var oExpectedArgs = {
            manifestUrl: "../sap/ushell/components/custom/manifest.json",
            async: true
        };

        // Act
        return this.oVizTypeDefaults._loadManifest(sUrl)
            .then(function (oManifest) {
                assert.deepEqual(oManifest, this.oOriginalManifest, "Resolved the correct manifest");
                assert.notStrictEqual(oManifest, this.oOriginalManifest, "Resolved a copy of the original");

                assert.strictEqual(this.oLoadStub.callCount, 1, "Manifest.load was called once");
                assert.deepEqual(this.oLoadStub.getCall(0).args[0], oExpectedArgs, "Manifest.load was called with correct settings");
            }.bind(this));
    });

    // QUnit.test("Caches the manifest", function (assert) {
    //     // Arrange
    //     var sUrl = "sap/ushell/components/custom/manifest.json";

    //     // Act
    //     return Promise.all([
    //         this.oVizTypeDefaults._loadManifest(sUrl),
    //         this.oVizTypeDefaults._loadManifest(sUrl)
    //     ])
    //         .then(function (aManifests) {
    //             assert.deepEqual(aManifests[0], this.oOriginalManifest, "Resolved for the first call the correct manifest");
    //             assert.notStrictEqual(aManifests[0], this.oOriginalManifest, "Resolved for the first call a copy of the original");

    //             assert.deepEqual(aManifests[1], this.oOriginalManifest, "Resolved for the second call the correct manifest");
    //             assert.notStrictEqual(aManifests[1], this.oOriginalManifest, "Resolved for the second call a copy of the original");

    //             assert.notStrictEqual(aManifests[0], aManifests[1], "Resolved individual copies of the original");

    //             assert.strictEqual(this.oLoadStub.callCount, 1, "Manifest.load was called only once");
    //         }.bind(this));
    // });


});
