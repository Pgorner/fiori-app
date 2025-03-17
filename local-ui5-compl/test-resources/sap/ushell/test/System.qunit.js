// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap/ushell/System.js
 */
sap.ui.define([
    "sap/ushell/System"
], function (
    System
) {
    "use strict";

    /* global QUnit */


    QUnit.module("sap.ushell.System");

    QUnit.test("sap.ushell.System: all getters", function (assert) {
        var oSystem = new System({
            alias: "ALIAS_FOO",
            platform: "platform_foo",
            baseUrl: "/FOO",
            client: "120",
            clientRole: "T",
            system: "XYZ",
            productVersion: "A_B_C",
            productName: "Demo Product Name",
            systemName: "Demo System Name",
            systemRole: "Demo System Role",
            tenantRole: "Demo Tenant Role",
            sysInfoBar: false,
            sysInfoBarColor: "orange",
            sysInfoBarMainText: "Dev",
            sysInfoBarSecondaryText: "U1Y/100",
            sysInfoBarIcon: "sap-icon://begin"
        });

        assert.strictEqual(oSystem.getAlias(), "ALIAS_FOO");
        assert.strictEqual(oSystem.getPlatform(), "platform_foo");
        assert.strictEqual(oSystem.getBaseUrl(), "/FOO");
        assert.strictEqual(oSystem.getClient(), "120");
        assert.strictEqual(oSystem.getProductVersion(), "A_B_C");
        assert.strictEqual(oSystem.getProductName(), "Demo Product Name");
        assert.strictEqual(oSystem.getSystemName(), "Demo System Name");
        assert.strictEqual(oSystem.getSystemRole(), "Demo System Role");
        assert.strictEqual(oSystem.getTenantRole(), "Demo Tenant Role");

        assert.equal(oSystem.getSysInfoBar(), false);
        assert.strictEqual(oSystem.getSysInfoBarColor(), "orange");
        assert.strictEqual(oSystem.getSysInfoBarMainText(), "Dev");
        assert.strictEqual(oSystem.getSysInfoBarSecondaryText(), "U1Y/100");
        assert.strictEqual(oSystem.getSysInfoBarIcon(), "sap-icon://begin");
    });

    /**
     * This QUnit test tests only the deprecated functions of sap.ushell.System.
     *
     * @deprecated since 1.118.
     */
    QUnit.test("sap.ushell.System: deprecated getters", function (assert) {
        var oSystem = new System({
            alias: "ALIAS_FOO",
            platform: "platform_foo",
            baseUrl: "/FOO",
            client: "120",
            clientRole: "T",
            system: "XYZ",
            productVersion: "A_B_C",
            productName: "Demo Product Name",
            systemName: "Demo System Name",
            systemRole: "Demo System Role",
            tenantRole: "Demo Tenant Role",
            sysInfoBar: false,
            sysInfoBarColor: "orange",
            sysInfoBarMainText: "Dev",
            sysInfoBarSecondaryText: "U1Y/100",
            sysInfoBarIcon: "sap-icon://begin"
        });

        assert.strictEqual(oSystem.getName(), "XYZ");
        assert.strictEqual(oSystem.getClientRole(), "T");
    });

    QUnit.test("System.adjustUrl()", function (assert) {
        function testFail (sUrl) {
            assert.throws(function () {
                new System().adjustUrl(sUrl);
            }, /Invalid URL:/, sUrl);
        }

        function testAdjust (sUrl, oData, sExpected) {
            var oSystem = new System(oData);

            assert.strictEqual(oSystem.adjustUrl(sUrl), sExpected, sExpected);
        }

        testFail("../foo");
        testFail("/");
        testFail("http://www.sap.com");
        testAdjust("/sap/my/url", {}, "/sap/my/url");
        testAdjust("/sap/my/url", { baseUrl: "/bar" }, "/bar/sap/my/url");
        testAdjust("/sap/my/url", { baseUrl: "/bar/" }, "/bar/sap/my/url");
        testAdjust("/sap/my/url", { baseUrl: "http://some.other.host:4711/" },
            "http://some.other.host:4711/sap/my/url");
        testAdjust("/sap/my/url", { baseUrl: "http://some.other.host:4711/", client: "120" },
            "http://some.other.host:4711/sap/my/url?sap-client=120");
        testAdjust("/sap/my/url?foo=bar", { baseUrl: "http://some.other.host:4711/", client: "120" },
            "http://some.other.host:4711/sap/my/url?foo=bar&sap-client=120");
        testAdjust("/sap/my/url", { alias: "foo", baseUrl: "/bar/" }, "/bar/sap/my/url");
        testAdjust("/sap/my/url", { alias: "foo", baseUrl: ";o=" }, "/sap/my/url;o=foo");
        testAdjust("/sap/my/url", { baseUrl: ";o=" }, "/sap/my/url");
    });

    [
        {
            description: "default is false",
            config: {},
            expected: false
        }, {
            description: "value from config is true",
            config: {
                isTrialSystem: true
            },
            expected: true
        }, {
            description: "value fron config is false",
            config: {
                isTrialSystem: false
            },
            expected: false
        }
    ].forEach(function (oFixture) {
        QUnit.test("System.isTrial() returns correct value for " + oFixture.description, function (assert) {
            var oSystem = new System(oFixture.config);
            assert.strictEqual(oSystem.isTrial(), oFixture.expected, oFixture.description);
        });
    });
});
