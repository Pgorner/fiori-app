// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/playground/controller/BaseController",
    "sap/ushell/Container"
], function (
    BaseController,
    Container
) {
    "use strict";

    /* global sinon */
    const sandbox = sinon.createSandbox({});

    return BaseController.extend("sap.ushell.playground.controller.ShellHeaderPlayground", {

        prepareMocks: function () {
            sandbox.restore(); // prepareMocks might be called multiple times
        },

        restoreMocks: function () {
            sandbox.restore();
        },

        onInit: function () {
            this.prepareMocks();
        }
    });
});
