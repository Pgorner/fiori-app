// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
        "sap/ushell/Config",
        "sap/ui/core/mvc/View",
        "sap/ui/core/mvc/Controller",
        "sap/ushell/Container",
        "sap/ushell/resources"
    ],
    function (Config, View, Controller, Container) {
        "use strict";
        /* eslint-disable */ // TBD: make ESLint conform

        /*global QUnit, asyncTest, jQuery, sap, sinon */

        const sandbox = sinon.createSandbox({});

        QUnit.module("sap.ushell.components.tiles.applauncher.StaticTile", {
            beforeEach: function (assert) {
                this.oController = new Controller(
                    "sap.ushell.components.tiles.applauncher.StaticTile"
                );
                return Container.init("local");
            },
            /**
             * This method is called after each test. Add every restoration code here.
             */
            afterEach: function () {
                sandbox.restore();
            }
        });

        QUnit.test("test sizeBehavior property of the Dynamic tile", function (assert) {
            var done = assert.async();
            var oViewData = {
                chip: {
                    configurationUi: {
                        isEnabled: function () {
                            return false;
                        }
                    },
                    configuration: {
                        getParameterValueAsString: function () {
                            return "";
                        }
                    },
                    bag: {
                        getBag: function () {
                            return {
                                getPropertyNames: function () {
                                    return [];
                                },
                                getTextNames: function () {
                                    return [];
                                }
                            };
                        }
                    },
                    url: {
                        getApplicationSystem: function () {
                            return "";
                        }
                    }
                }
            };

            View.create({
                viewName: "module:sap/ushell/components/tiles/applauncherdynamic/DynamicTile.view",
                viewData: oViewData
            }).then(function (oView) {
                var oModel = oView.getModel();

                if (Config.last("/core/home/sizeBehavior") === "Responsive") {
                    var sSizeBehaviorStart = "Responsive";
                    var sNewSizeBehavior = "Small";
                } else {
                    var sSizeBehaviorStart = "Small";
                    var sNewSizeBehavior = "Responsive";
                }
                // Check if default is set
                assert.ok(oModel.getProperty("/sizeBehavior") === sSizeBehaviorStart, "Size correctly set at startup.");

                // emit new configuration
                Config.emit("/core/home/sizeBehavior", sNewSizeBehavior);

                // check if size property has changed
                Config.once("/core/home/sizeBehavior").do(function () {
                    assert.ok(oModel.getProperty("/sizeBehavior") === sNewSizeBehavior, "Size correctly set after change.");
                    done();
                });
            });
        });
    });
