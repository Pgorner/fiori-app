// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/* global QUnit */

// eslint-disable-next-line no-unused-expressions
window.blanket && window.blanket.options("sap-ui-cover-only", "[sap/ushell/plugins]");

sap.ui.define([
    "sap/ushell/appRuntime/ui5/plugins/baseRta/CheckConditions",
    "sap/ushell/appRuntime/ui5/plugins/baseRta/AppLifeCycleUtils",
    "sap/ushell/plugin/utils/TestUtil",
    "sap/ui/Device",
    "sap/ui/fl/write/api/FeaturesAPI",
    "sap/ui/thirdparty/sinon-4"
], function (
    CheckConditions,
    AppLifeCycleUtils,
    TestUtil,
    Device,
    FeaturesAPI,
    sinon
) {
    "use strict";

    var sandbox = sinon.sandbox.create();

    QUnit.module("Given an application that is not of type UI5", {
        beforeEach: function (assert) {
            var oContainer = TestUtil.createContainerObject.call(this, "notUI5");
            sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("checkUI5App when the plugin gets initialized", function (assert) {
        return CheckConditions.checkUI5App()
            .then(function (bIsUI5App) {
                assert.notOk(bIsUI5App, "checkUI5App returns false");
            });
    });

    QUnit.test("checkRtaPrerequisites when the plugin gets initialized", async function (assert) {
        assert.notOk(
            await CheckConditions.checkRtaPrerequisites(),
            "checkRtaPrerequisites returns false because app is not of type UI5 and key user is not configured"
        );
    });

    QUnit.module("Given an application that is of type UI5 but not application", {
        beforeEach: function (assert) {
            var oContainer = TestUtil.createContainerObject.call(this, "UI5", undefined, undefined, undefined, true/*flexEnabled*/, undefined, true);
            sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("checkUI5App when the plugin gets initialized", function (assert) {
        return CheckConditions.checkUI5App()
            .then(function (bIsUI5App) {
                assert.notOk(bIsUI5App, "checkUI5App returns false");
            });
    });

    QUnit.module("Given a application that is of type UI5", {
        beforeEach: function (assert) {
            this.oContainer = TestUtil.createContainerObject.call(this, "UI5", undefined, undefined, undefined, true/*flexEnabled*/);
            sandbox.stub(AppLifeCycleUtils, "getContainer").returns(this.oContainer);
            sandbox.stub(FeaturesAPI, "isKeyUser").resolves(true);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("checkUI5App when the plugin gets initialized", function (assert) {
        return CheckConditions.checkUI5App()
            .then(function (bIsUI5App) {
                assert.ok(bIsUI5App, "checkUI5App returns true");
            });
    });

    QUnit.test("checkRestartRTA is called and restart is not triggert via session storage", function (assert) {
        var sLayer = "CUSTOMER";
        assert.notOk(CheckConditions.checkRestartRTA(sLayer), "checkFlexEnabledOnStart returns false");
    });

    QUnit.test("checkRestartRTA is called and restart is triggert via session storage", function (assert) {
        var sKey = "sap.ui.rta.restart.CUSTOMER";
        window.sessionStorage.setItem(sKey, true);
        var sLayer = "CUSTOMER";
        assert.ok(CheckConditions.checkRestartRTA(sLayer), "checkFlexEnabledOnStart returns true");
        // Session storage is cleaned up by RTA instance
        window.sessionStorage.removeItem(sKey);
    });

    QUnit.test("When the app is started on a phone", function (assert) {
        //simulate phone
        sandbox.stub(Device.system, "phone").value(true);
        sandbox.stub(Device.system, "desktop").value(false);
        assert.notOk(CheckConditions.checkDesktopDevice(), "checkDesktopDevice returns false");
    });

    QUnit.test("When the app is started on a desktop device", function (assert) {
        //simulate desktop
        sandbox.stub(Device.system, "desktop").value(true);
        sandbox.stub(Device.system, "phone").value(false);
        assert.ok(CheckConditions.checkDesktopDevice(), "checkDesktopDevice returns true");
    });

    QUnit.test("checkRtaPrerequisites when the plugin gets initialized", async function (assert) {
        assert.ok(
            await CheckConditions.checkRtaPrerequisites(),
            "checkRtaPrerequisites returns true because app is of type UI5 and key user is correctly configured"
        );
    });

});
