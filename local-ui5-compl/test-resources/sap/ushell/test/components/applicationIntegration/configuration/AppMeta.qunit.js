// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for "sap.ushell.components.applicationIntegration.configuration.AppMeta"
 */
sap.ui.define([
    "sap/ui/core/theming/Parameters",
    "sap/ui/Device",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Config",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/Container",
    "sap/ushell/components/applicationIntegration/configuration/AppMeta",
    "sap/ui/util/Mobile"
], function (
    ThemingParameters,
    Device,
    jQuery,
    AppLifeCycle,
    Config,
    AppConfiguration,
    Container,
    AppMeta,
    Mobile
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox();

    QUnit.module("sap.ushell.components.applicationIntegration.configuration.AppMeta", {
        beforeEach: function () {
            AppMeta.bIconSet = {};
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    [{
        meta: {
            name: "metaDataObject",
            compactContentDensity: true,
            cozyContentDensity: false
        },
        storeApp: {
            appId: "testAppId1",
            oContainer: {
                setProperty: sandbox.stub()
            },
            oTarget: {},
            oShellHash: {}
        },
        contentDensityCallCount: 1,
        isCompact: true,
        iconCheckDescription: "Test (1) icon validation",
        contentDensityDescription: "Test (1) content density"
    }, {
        meta: {
            name: "metaDataObject",
            favIcon: "testing1",
            compactContentDensity: false,
            cozyContentDensity: true
        },
        storeApp: {
            appId: "testAppId1",
            oContainer: {
                setProperty: sandbox.stub()
            },
            oTarget: {},
            oShellHash: {}
        },
        isCompact: false,
        contentDensityCallCount: 1,
        iconCheckDescription: "Test (2) icon validation",
        contentDensityDescription: "Test (2) content density"
    }].forEach(function (oFixture) {
        QUnit.test("#history back navigation", function (assert) {
            var done = assert.async();

            sandbox.stub(AppConfiguration, "getMetadata").returns(oFixture.meta);
            var contentDensityStub = sandbox.stub(AppMeta, "_applyContentDensityClass").returns({});
            var orgCombiValue = Device.system.combi;

            Container.init("local").then(function () {
                Device.system.combi = false;
                AppLifeCycle.init(oFixture.oViewPortContainer, false);

                AppLifeCycle._storeApp(
                    oFixture.storeApp.appId, // sStorageAppId
                    oFixture.storeApp.oContainer, // oApplicationContainer
                    oFixture.storeApp.oTarget, // oResolvedHashFragment
                    oFixture.storeApp.oShellHash,
                    null // sKeepAliveMode
                );

                AppLifeCycle._store(oFixture.storeApp.appId);
                AppLifeCycle._restore("testAppId1");

                setTimeout(function () {
                    assert.strictEqual(contentDensityStub.callCount, oFixture.contentDensityCallCount, "# of calls: " + oFixture.contentDensityDescription);
                    assert.strictEqual(contentDensityStub.args[0][0], oFixture.isCompact, "call value expected [" + oFixture.isCompact + "]:" + oFixture.contentDensityDescription);
                    Device.system.combi = orgCombiValue;

                    done();
                }, 1000);
            });
        });
    });

    [{
        meta: {
            compactContentDensity: true,
            cozyContentDensity: false
        },
        result: {
            isCompact: true
        },
        isCompactContentDensityByDevice: true,
        contentDensityDescription: "User defines ContentDensity as 'compact'"
    }, {
        meta: {
            compactContentDensity: true,
            cozyContentDensity: false
        },
        result: {
            isCompact: true
        },
        isCompactContentDensityByDevice: false,
        contentDensityDescription: "User defines ContentDensity as 'compact'"
    }, {
        meta: {
            compactContentDensity: false,
            cozyContentDensity: true
        },
        result: {
            isCompact: false
        },
        isCompactContentDensityByDevice: false,
        contentDensityDescription: "User defines ContentDensity as 'cozy'"
    }, {
        meta: {
            compactContentDensity: false,
            cozyContentDensity: true
        },
        result: {
            isCompact: false
        },
        isCompactContentDensityByDevice: true,
        contentDensityDescription: "User defines ContentDensity as 'cozy'"
    }, {
        meta: {
            compactContentDensity: undefined
        },
        result: {
            isCompact: true
        },
        isCompactContentDensityByDevice: true,
        contentDensityDescription: "User defines ContentDensity as 'undefined'"
    }, {
        meta: {
            compactContentDensity: undefined
        },
        result: {
            isCompact: false
        },
        isCompactContentDensityByDevice: false,
        contentDensityDescription: "User defines ContentDensity as 'undefined'"
    }].forEach(function (oFixture) {
        QUnit.test(oFixture.contentDensityDescription, function (assert) {
            const done = assert.async();

            const density = (function (meta) {
                if (meta.compactContentDensity === true) {
                    return "compact";
                } else if (meta.cozyContentDensity === true) {
                    return "cozy";
                }
                return undefined;
            }(oFixture.meta));

            sandbox.stub(AppConfiguration, "getMetadata").returns(oFixture.meta);
            sandbox.stub(AppMeta, "_isCompactContentDensityByDevice").returns(oFixture.isCompactContentDensityByDevice);

            Container.init("local").then(function () {
                sandbox.stub(Container.getUser(), "getContentDensity").returns(density);

                AppMeta._applyContentDensityClass().then(function () {
                    const body = jQuery("body");
                    assert.strictEqual(body.hasClass("sapUiSizeCompact"), oFixture.result.isCompact, `Density mode should ${oFixture.result.isCompact ? "" : "not "}be compact`);
                    assert.strictEqual(body.hasClass("sapUiSizeCozy"), !oFixture.result.isCompact, `Density mode should ${!oFixture.result.isCompact ? "" : "not "}be cozy`);

                    done();
                });
            });
        });
    });

    QUnit.test("#shell configuration favIcon", async function (assert) {
        // Arrange
        const oThemingParametersStub = sandbox.stub(ThemingParameters, "get");
        oThemingParametersStub.callsFake(({callback}) => {
            callback({
                sapUiShellFavicon: null
            });
        });
        sandbox.stub(Config, "last").withArgs("/core/shell/favIcon").returns("shellConfigurationTest");

        // Act
        const oAppMeta = AppMeta;
        const oFavicon = await oAppMeta._getFavicon();

        // Assert
        assert.equal(oFavicon.favicon, "shellConfigurationTest", "favIcon should be 'shellConfigurationTest'");
        assert.equal(oFavicon.isCustomFavicon, true);
    });

    QUnit.test("favIcon is set and request called once when favicon is NOT custom", async function (assert) {
        // Arrange
        const oSetIconsStub = sandbox.stub(Mobile, "setIcons");

        // Act
        const oAppMeta = AppMeta;
        await oAppMeta.setValues();
        await oAppMeta.setValues();

        // Assert
        assert.strictEqual(oSetIconsStub.callCount, 1, "setIcons was called once");

    });

    QUnit.test("favIcon is set and request called once when favicon is custom", async function (assert) {
        // Arrange
        const oSetIconsStub = sandbox.stub(Mobile, "setIcons");
        sandbox.stub(AppMeta, "_getFavicon").returns(Promise.resolve({
            favicon: "testFavIcon",
            isCustomFavicon: true
        }));

        // Act
        const oAppMeta = AppMeta;
        await oAppMeta.setValues();
        await oAppMeta.setValues();

        // Assert
        assert.strictEqual(oSetIconsStub.callCount, 1, "setIcons was called once");

    });
});
