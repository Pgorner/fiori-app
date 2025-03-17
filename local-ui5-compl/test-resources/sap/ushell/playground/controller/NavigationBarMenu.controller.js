// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/Container",
    "sap/ushell/playground/controller/BaseController",
    "sap/base/Log"
], function (
    Container,
    BaseController,
    Log
) {
    "use strict";

    /* global sinon */
    const sandbox = sinon.createSandbox({});

    return BaseController.extend("sap.ushell.playground.controller.NavigationBarMenu", {

        prepareMocks: function () {
            sandbox.restore(); // prepareMocks might be called multiple times

            sandbox.stub(Container, "getServiceAsync").withArgs("Navigation").resolves({
                navigate: function (oArguments) {
                    Log.info("No navigation in playground: ", JSON.stringify(oArguments));
                }
            });
        },

        restoreMocks: function () {
            sandbox.restore();
        },

        onInit: function () {
            this.prepareMocks();
        }
    });
});
