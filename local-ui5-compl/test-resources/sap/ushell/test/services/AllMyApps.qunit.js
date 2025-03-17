// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/Container"
], function (Container) {
    "use strict";

    /* global QUnit */

    QUnit.module("sap.ushell.services.AllMyApps", {
        afterEach: function () {
            Container.resetServices();
        }
    });

    QUnit.test("test - service configuration", function (assert) {
        var done = assert.async();
        window["sap-ushell-config"] = {
            services: {
                AllMyApps: {
                    config: {
                        enabled: true,
                        showHomePageApps: false,
                        showCatalogApps: true,
                        showExternalProviders: false
                    }
                }
            }
        };

        Container.init("local").then(function () {
            Container.getServiceAsync("AllMyApps").then(function (AllMyAppsService) {
                assert.strictEqual(AllMyAppsService.isEnabled(), true, "The value of isEnabled is according to the configuration");
                assert.strictEqual(AllMyAppsService.isHomePageAppsEnabled(), false, "The value of isShowHomePageApps is according to the configuration");
                assert.strictEqual(AllMyAppsService.isCatalogAppsEnabled(), true, "The value of isCatalogAppsEnabled is according to the configuration");
                assert.strictEqual(AllMyAppsService.isExternalProviderAppsEnabled(), false, "The value of isExternalProviderAppsEnabled is according to the configuration");

                done();
            });
        });
    });

    QUnit.test("test - service disabling by configuration", function (assert) {
        var done = assert.async();
        window["sap-ushell-config"] = {
            services: {
                AllMyApps: {
                    config: {
                        enabled: false
                    }
                }
            }
        };

        Container.init("local").then(function () {
            Container.getServiceAsync("AllMyApps").then(function (AllMyAppsService) {
                assert.strictEqual(AllMyAppsService.isEnabled(), false, "The value of isEnabled is according to the configuration");

                done();
            });
        });
    });

    QUnit.test("test - default configuration 1", function (assert) {
        var done = assert.async();
        window["sap-ushell-config"] = {
            services: {
                AllMyApps: {
                    config: {
                        enabled: true
                    }
                }
            }
        };

        Container.init("local").then(function () {
            Container.getServiceAsync("AllMyApps").then(function (AllMyAppsService) {
                assert.strictEqual(AllMyAppsService.isEnabled(), true, "The value of isEnabled is true by default");
                assert.strictEqual(AllMyAppsService.isHomePageAppsEnabled(), true, "The value of isShowHomePageApps is true by default");
                assert.strictEqual(AllMyAppsService.isCatalogAppsEnabled(), true, "The value of isCatalogAppsEnabled is true by default");
                assert.strictEqual(AllMyAppsService.isExternalProviderAppsEnabled(), true, "The value of isExternalProviderAppsEnabled is true by default");

                done();
            });
        });
    });

    QUnit.test("test - default configuration 2", function (assert) {
        var done = assert.async();
        window["sap-ushell-config"] = {
            services: {}
        };

        Container.init("local").then(function () {
            Container.getServiceAsync("AllMyApps").then(function (AllMyAppsService) {
                assert.strictEqual(AllMyAppsService.isEnabled(), true, "The value of isEnabled is true by default");
                assert.strictEqual(AllMyAppsService.isHomePageAppsEnabled(), true, "The value of isShowHomePageApps is true by default");
                assert.strictEqual(AllMyAppsService.isCatalogAppsEnabled(), true, "The value of isCatalogAppsEnabled is true by default");
                assert.strictEqual(AllMyAppsService.isExternalProviderAppsEnabled(), true, "The value of isExternalProviderAppsEnabled is true by default");

                done();
            });
        });
    });

    QUnit.test("test registerExternalProvider - validation of data_sources/providers registration", function (assert) {
        var done = assert.async();
        Container.init("local").then(function () {
            Container.getServiceAsync("AllMyApps").then(function (AllMyAppsService) {
                var oDataSource1 = {
                    getTitle: function () {
                        return "Title1";
                    }
                };
                var oDataSource2 = {
                    getTitle: function () {
                        return "Title2";
                    },
                    getData: function () {
                        return [];
                    }
                };
                var oDataSource3 = {
                    getData: function () {
                        return [];
                    }
                };
                var oDataSource4 = {
                    getTitle: function () {
                        return "Title4";
                    },
                    getData: function () {
                        return [{ data: "Provider4_Data" }];
                    }
                };

                AllMyAppsService.registerExternalProvider("DataSource1", oDataSource1);
                AllMyAppsService.registerExternalProvider("DataSource2", oDataSource2);
                AllMyAppsService.registerExternalProvider("DataSource3", oDataSource3);
                AllMyAppsService.registerExternalProvider("DataSource4", oDataSource4);

                var oProviders = AllMyAppsService.getDataProviders();
                assert.strictEqual(oProviders.DataSource1, undefined, "DataSource1 does not exists");
                assert.notStrictEqual(oProviders.DataSource2, undefined, "DataSource2 exists");
                assert.strictEqual(oProviders.DataSource3, undefined, "DataSource3 does not exists");
                assert.notStrictEqual(oProviders.DataSource4, undefined, "DataSource4 exists");
                assert.strictEqual(oProviders.DataSource4.getTitle(), "Title4", "DataSource4 getTitle function called");

                done();
            });
        });
    });
});
