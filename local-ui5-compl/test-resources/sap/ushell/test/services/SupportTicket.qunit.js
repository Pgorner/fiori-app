// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.SupportTicket and customizable
 * extensions
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ushell/Container",
    "sap/ushell/services/SupportTicket",
    "sap/ushell/test/utils"
], function (
    ObjectPath,
    Container,
    SupportTicket,
    testUtils
) {
    "use strict";

    /* global QUnit */

    QUnit.module("sap.ushell.services.SupportTicket", {
        afterEach: function () {
            ObjectPath.create("sap-ushell-config.services.SupportTicket.config").enabled = false;
            Container.resetServices();
        }
    }
    );

    QUnit.test("service disabled by default - factory instantiation", function (assert) {
        var fnDone = assert.async();
        Container.init("local")
            .then(function () {
                Container.getServiceAsync("SupportTicket").then(function (oService) {
                    assert.equal(oService.isEnabled(), false);
                    fnDone();
                });
            });
});

    QUnit.test("service disabled by default - constructor call", function (assert) {
        var oService = new SupportTicket();

        assert.equal(oService.isEnabled(), false);
    });

    QUnit.test("service enabled if set in bootstrap config", function (assert) {
        var fnDone = assert.async();
        var oUshellConfig = testUtils.overrideObject({}, {
            "/services/SupportTicket/config/enabled": true
        });
        testUtils.resetConfigChannel(oUshellConfig).then(function () {
            Container.init("local")
                .then(function () {
                    Container.getServiceAsync("SupportTicket").then(function (oService) {
                        assert.equal(oService.isEnabled(), true);
                        fnDone();
                    });
                });
        });

    });

    QUnit.test("service disabled if set in bootstrap config", function (assert) {
        var fnDone = assert.async();
        var oUshellConfig = testUtils.overrideObject({}, {
            "/services/SupportTicket/config/enabled": false
        });
        testUtils.resetConfigChannel(oUshellConfig).then(function () {
            Container.init("local")
                .then(function () {
                    Container.getServiceAsync("SupportTicket").then(function (oService) {
                        assert.equal(oService.isEnabled(), false);
                        fnDone();
                    });
                });
        });
    });
});
