// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/adapters/local/SupportTicketAdapter"
], function (SupportTicketAdapter) {
    "use strict";

    /* global QUnit */

    QUnit.module("sap.ushell.adapters.local.SupportTicketAdapterTest", {
        beforeEach: function (assert) {
            this.oAdapter = new SupportTicketAdapter();
        },
        afterEach: function () {
        }
    });

    QUnit.test("createTicket returns resolved promise", function (assert) {
        var fnDone = assert.async();
        this.oAdapter.createTicket()
            .then(function (sTicketNumber) {
                assert.ok(sTicketNumber, "the promise should be result with some value");
                fnDone();
            })
            .catch(function () {
                assert.ok("promise should be resolved");
                fnDone();
            });
    });
});
