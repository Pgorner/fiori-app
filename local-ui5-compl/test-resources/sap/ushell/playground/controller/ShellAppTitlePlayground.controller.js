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

    return BaseController.extend("sap.ushell.playground.controller.ShellAppTitlePlayground", {

        prepareMocks: function () {
            sandbox.restore(); // prepareMocks might be called multiple times

            sandbox.stub(Container, "getServiceAsync");

            Container.getServiceAsync.withArgs("AllMyApps").resolves({
                isEnabled: function () {
                    return true;
                },
                isCatalogAppsEnabled: function () {
                    return false;
                },
                isExternalProviderAppsEnabled: function () {
                    return false;
                },
                isHomePageAppsEnabled: function () {
                    return false;
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
