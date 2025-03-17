// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview Dummy QUnit test that always pass. For CSP scan
 */
sap.ui.require([
    "sap/ui/qunit/qunit-css",
    "sap/ui/thirdparty/qunit"
], function () {
    "use strict";

    /* global QUnit */
    QUnit.test("CSP Dummy Qunit Test", function (assert) {
        assert.strictEqual(1, 1, "1 = 1");
    });
});
