// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.TileContainer
 */
sap.ui.define([
    "sap/ushell/Container",
    "sap/ushell/ui/launchpad/LoadingDialog"
], function (Container, LoadingDialog) {
    "use strict";

    /*global QUnit sinon */

    var oLoadingDialog,
        demiItemData = {
            id: "testLoadingDialog",
            text: ""
        };

    QUnit.module("sap.ushell.ui.launchpad.TileContainer", {
        beforeEach: function () {
            return Container.init("local")
                .then(function () {
                    oLoadingDialog = new LoadingDialog(demiItemData);
                });
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            oLoadingDialog.destroy();
        }
    });

    QUnit.test("Loading Dialog: Popup.open is called in case it is not yet open", function (assert) {
        var oSpyOpen;

        oSpyOpen = sinon.spy(oLoadingDialog._oPopup, "open");
        oLoadingDialog.openLoadingScreen();
        assert.ok(oSpyOpen.called, "open was called");
        oLoadingDialog.closeLoadingScreen();
    });

    QUnit.test("Loading Dialog: Popup.open is not called in case it is already open", function (assert) {
        var oSpyOpen;

        oLoadingDialog.openLoadingScreen();
        oSpyOpen = sinon.spy(oLoadingDialog._oPopup, "open");
        oLoadingDialog.openLoadingScreen();
        assert.ok(!oSpyOpen.called, "open was not called");
        oLoadingDialog.closeLoadingScreen();
    });
});
