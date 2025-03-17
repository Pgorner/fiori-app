// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.DarkModeSupport
 */
sap.ui.define([
    "sap/ushell/services/DarkModeSupport",
    "sap/ushell/Container"
], function (
    DarkModeSupport,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox();

    QUnit.module("Methods", {
        beforeEach: function () {
            this.oUser = {
                getTheme: sandbox.stub(),
                getDetectDarkMode: sandbox.stub().returns(true),
                applyTheme: sandbox.stub()
            };
            sandbox.stub(Container, "getUser").returns(this.oUser);
            sandbox.stub(Container, "getServiceAsync").resolves();
            this.oDarkModeSupportService = new DarkModeSupport();
        },
        afterEach: function () {
            this.oDarkModeSupportService._toggleMediaListener(false);
            sandbox.restore();
        }
    });

    QUnit.test("init returns instance of DarkModeSupport", function (assert) {
        assert.ok(this.oDarkModeSupportService instanceof DarkModeSupport, "instance returned");
    });

    QUnit.test("deactivate if sap-theme is set in the url", function (assert) {
        const oToggleSystemColorMethodSpy = sandbox.spy(this.oDarkModeSupportService, "_toggleDarkModeBasedOnSystemColorScheme");
        sandbox.stub(URLSearchParams.prototype, "get").returns(true);

        this.oDarkModeSupportService.setup();
        assert.ok(oToggleSystemColorMethodSpy.notCalled, "Does not handle url theme.");
    });

    QUnit.test("toggleDarkModeBasedOnSystemColorScheme change from light theme to dark", async function (assert) {
        sandbox.stub(this.oDarkModeSupportService, "_getCurrentTheme").returns("sap_horizon");
        sandbox.stub(this.oDarkModeSupportService, "prefersDark").returns(true);
        sandbox.stub(this.oDarkModeSupportService, "prefersContrast").returns(false);

        assert.ok(!this.oDarkModeSupportService.fnOnMediaChange, "media listener is not active initially");

        await this.oDarkModeSupportService.enableDarkModeBasedOnSystem();

        const oApplyThemeStub = this.oUser.applyTheme;
        assert.ok(oApplyThemeStub.called, "apply theme was called");
        assert.ok(!!this.oDarkModeSupportService.fnOnMediaChange, "media listener is active");
        assert.deepEqual(oApplyThemeStub.getCall(oApplyThemeStub.callCount - 1).args, ["sap_horizon_dark"], "the dark theme should be applied");
    });

    QUnit.test("toggleDarkModeBasedOnSystemColorScheme change from low contrast to high", async function (assert) {
        sandbox.stub(this.oDarkModeSupportService, "_getCurrentTheme").returns("sap_horizon");
        sandbox.stub(this.oDarkModeSupportService, "prefersDark").returns(false);
        sandbox.stub(this.oDarkModeSupportService, "prefersContrast").returns(true);

        await this.oDarkModeSupportService.enableDarkModeBasedOnSystem();

        const oApplyThemeStub = this.oUser.applyTheme;
        assert.ok(oApplyThemeStub.called, "apply theme was called");
        assert.deepEqual(oApplyThemeStub.getCall(oApplyThemeStub.callCount - 1).args, ["sap_horizon_hcw"], "the hcw theme should be applied");
    });

    QUnit.test("toggleDarkModeBasedOnSystemColorScheme change from hcb contrast to normal", async function (assert) {
        sandbox.stub(this.oDarkModeSupportService, "_getCurrentTheme").returns("sap_horizon_hcb");
        sandbox.stub(this.oDarkModeSupportService, "prefersDark").returns(false);
        sandbox.stub(this.oDarkModeSupportService, "prefersContrast").returns(false);

        await this.oDarkModeSupportService.enableDarkModeBasedOnSystem();

        const oApplyThemeStub = this.oUser.applyTheme;
        assert.ok(oApplyThemeStub.called, "apply theme was called");
        assert.deepEqual(oApplyThemeStub.getCall(oApplyThemeStub.callCount - 1).args, ["sap_horizon"], "the light theme should be applied");
    });

    QUnit.test("toggleDarkModeBasedOnSystemColorScheme - no change if the theme not in a set", async function (assert) {
        sandbox.stub(this.oDarkModeSupportService, "_getCurrentTheme").returns("custom_theme");
        sandbox.stub(this.oDarkModeSupportService, "prefersDark").returns(true);
        sandbox.stub(this.oDarkModeSupportService, "prefersContrast").returns(true);
        this.oDarkModeSupportService.fnOnMediaChange = null;

        await this.oDarkModeSupportService.enableDarkModeBasedOnSystem();

        assert.ok(!!this.oDarkModeSupportService.fnOnMediaChange, "media listener is active even if a theme does not belong to a set");
        assert.ok(this.oUser.applyTheme.notCalled, "apply theme was not called");
    });
});

