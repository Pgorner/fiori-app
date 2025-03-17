// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.homepage.Component
 *
 * @deprecated since 1.112
 */
sap.ui.define([
    "sap/ui/core/Component",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/hasher",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/bootstrap/common/common.load.model",
    "sap/ushell/components/SharedComponentUtils",
    "sap/ushell/Config",
    "sap/ushell/Container"
], function (
    Component,
    JSONModel,
    hasher,
    jQuery,
    oModelWrapper,
    SharedComponentUtils,
    Config,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    var sComponentName = "sap.ushell.components.homepage";
    var oComponent,
        oExpectedModel,
        oModelWrapperStub;

    // Strip all functionality from localStorage in order to not read any value from local testing
    Object.defineProperty(window, "localStorage", {
        value: {}
    });

    QUnit.module("sap.ushell.components.homepage.Component", {
        beforeEach: function (assert) {
            var done = assert.async();

            sinon.stub(hasher, "getHash");

            Container.init("local")
                .then(function () {
                    sap.ushell.Container.getRendererInternal = function () {
                        return {
                            setNavigationBar: function () { },
                            createExtendedShellState: function () { },
                            applyExtendedShellState: function () { },
                            getModelConfiguration: function () {
                                return { enableNotificationsUI: true };
                            },
                            getCurrentViewportState: function () {
                                return "Center";
                            },
                            addUserPreferencesEntry: function () { },
                            getRouter: sinon.stub().returns({
                                getRoute: sinon.stub().returns({
                                    attachMatched: sinon.stub()
                                })
                            }),
                            getShellConfig: sinon.stub().returns({
                                rootIntent: "Shell-home"
                            })
                        };
                    };

                    oExpectedModel = new JSONModel({
                        data1: "test1",
                        data2: "test2"
                    });
                    oModelWrapperStub = sinon.stub(oModelWrapper, "getModel").returns(oExpectedModel);

                    Component.create({
                        id: "applicationsap-ushell-components-homepage-component",
                        name: sComponentName
                    })
                        .then(function (component) {
                            oComponent = component;
                            return oComponent.rootControlLoaded();
                        })
                        .then(done);
                });
        },
        afterEach: function (assert) {
            delete sap.ushell.Container;
            oComponent.destroy();

            hasher.getHash.restore();
            var oHideGroupsBtn = sap.ui.getCore().byId("hideGroupsBtn");
            if (oHideGroupsBtn) {
                oHideGroupsBtn.destroy();
            }

            oModelWrapperStub.restore();
            Config._reset();
        }
    });

    QUnit.test("The component instance was created", function (assert) {
        assert.ok(oComponent, "Instance was created");
    });

    QUnit.test("The configuration originates from the model wrapper", function (assert) {
        assert.deepEqual(oComponent.getModel().getData(), oExpectedModel.getData(), "The model data comes from the model wrapper.");
    });

    QUnit.test("The dashboard view was created successfully", function (assert) {
        assert.ok(oComponent.getRootControl().getContent().length > 0, "The dashboard view was created successfully.");
    });

    QUnit.test("The configuration for homePageGroupDisplay - when nothing is defined in personalization or by admin", function (assert) {
        var sHomePageGroupDisplay = oComponent.getModel().getProperty("/homePageGroupDisplay");

        assert.strictEqual(sHomePageGroupDisplay, "scroll", "The correct value has been found.");
    });

    QUnit.test("The configuration for homePageGroupDisplay - when disabled by admin", function (assert) {
        // Arrange
        var done = assert.async(),
            oPersonalizer,
            oGetPersonalizerStub,
            oGetPersonalizationSpy;

        oPersonalizer = {
            getPersData: function () {
                return new jQuery.Deferred().resolve();
            }
        };
        oGetPersonalizerStub = sinon.stub(SharedComponentUtils, "getPersonalizer").returns(Promise.resolve(oPersonalizer));
        oGetPersonalizationSpy = sinon.spy(SharedComponentUtils, "_getPersonalization");

        Config.emit("/core/home/enableHomePageSettings", false);
        Config.emit("/core/home/homePageGroupDisplay", "tabs");

        // Act
        SharedComponentUtils.getEffectiveHomepageSetting("/core/home/homePageGroupDisplay", "/core/home/enableHomePageSettings");

        // Assert
        Config.once("/core/home/homePageGroupDisplay").do(function () {
            var sHomePageGroupDisplay = oComponent.getModel().getProperty("/homePageGroupDisplay");

            assert.strictEqual(oGetPersonalizationSpy.callCount, 0, "The function getPersonalization has not been called.");
            assert.strictEqual(sHomePageGroupDisplay, "tabs", "The correct value has been found.");

            oGetPersonalizerStub.restore();
            oGetPersonalizationSpy.restore();
            done();
        });
    });

    QUnit.test("The configuration for homePageGroupDisplay - when defined in personalization, and enabled by configuration", function (assert) {
        // Arrange
        var done = assert.async(),
            oPersonalizer,
            oGetPersonalizerStub;

        oPersonalizer = {
            getPersData: function () {
                return new jQuery.Deferred().resolve("tabs");
            }
        };
        oGetPersonalizerStub = sinon.stub(SharedComponentUtils, "getPersonalizer").returns(Promise.resolve(oPersonalizer));

        Config.emit("/core/home/enableHomePageSettings", true);
        Config.emit("/core/home/homePageGroupDisplay", undefined);

        // Act
        SharedComponentUtils.getEffectiveHomepageSetting("/core/home/homePageGroupDisplay", "/core/home/enableHomePageSettings");

        // Assert
        Config.once("/core/home/homePageGroupDisplay").do(function () {
            var sHomePageGroupDisplay = oComponent.getModel().getProperty("/homePageGroupDisplay");

            assert.equal(sHomePageGroupDisplay, "tabs", "The correct value has been found.");

            oGetPersonalizerStub.restore();
            done();
        });
    });

    QUnit.test("The configuration for homePageGroupDisplay - when defined in personalization, but disabled by configuration", function (assert) {
        // Arrange
        var done = assert.async(),
            oPersonalizer,
            oGetPersonalizerStub;

        oPersonalizer = {
            getPersData: function () {
                return new jQuery.Deferred().resolve("tabs");
            }
        };
        oGetPersonalizerStub = sinon.stub(SharedComponentUtils, "getPersonalizer").returns(Promise.resolve(oPersonalizer));

        Config.emit("/core/home/enableHomePageSettings", false);

        // Act
        SharedComponentUtils.getEffectiveHomepageSetting("/core/home/homePageGroupDisplay", "/core/home/enableHomePageSettings");

        // Assert
        Config.once("/core/home/homePageGroupDisplay").do(function () {
            var sHomePageGroupDisplay = oComponent.getModel().getProperty("/homePageGroupDisplay");

            assert.equal(sHomePageGroupDisplay, "scroll", "The correct value has been found.");

            oGetPersonalizerStub.restore();
            done();
        });
    });

    QUnit.test("The configuration for sizeBehavior - when nothing is defined in personalization or by admin", function (assert) {
        var sHomePageGroupDisplay = oComponent.getModel().getProperty("/sizeBehavior");

        assert.strictEqual(sHomePageGroupDisplay, "Responsive", "The correct value has been found.");
    });

    QUnit.test("The configuration for sizeBehavior - when disabled by admin", function (assert) {
        // Arrange
        var done = assert.async(),
            oPersonalizer,
            oGetPersonalizerStub,
            oGetPersonalizationSpy;

        oPersonalizer = {
            getPersData: function () {
                return new jQuery.Deferred().resolve();
            }
        };
        oGetPersonalizerStub = sinon.stub(SharedComponentUtils, "getPersonalizer").returns(Promise.resolve(oPersonalizer));
        oGetPersonalizationSpy = sinon.spy(SharedComponentUtils, "_getPersonalization");

        Config.emit("/core/home/sizeBehaviorConfigurable", false);
        Config.emit("/core/home/sizeBehavior", "Small");

        // Act
        SharedComponentUtils.getEffectiveHomepageSetting("/core/home/sizeBehavior", "/core/home/sizeBehaviorConfigurable");

        // Assert
        Config.once("/core/home/sizeBehavior").do(function () {
            var sHomePageGroupDisplay = oComponent.getModel().getProperty("/sizeBehavior");

            assert.strictEqual(oGetPersonalizationSpy.callCount, 0, "The function getPersonalization has not been called.");
            assert.strictEqual(sHomePageGroupDisplay, "Small", "The correct value has been found.");

            oGetPersonalizerStub.restore();
            oGetPersonalizationSpy.restore();
            done();
        });
    });

    QUnit.test("The configuration for sizeBehavior - when defined in personalization, and enabled by configuration", function (assert) {
        // Arrange
        var done = assert.async(),
            oPersonalizer,
            oGetPersonalizerStub;

        oPersonalizer = {
            getPersData: function () {
                return new jQuery.Deferred().resolve("Small");
            }
        };
        oGetPersonalizerStub = sinon.stub(SharedComponentUtils, "getPersonalizer").returns(Promise.resolve(oPersonalizer));

        Config.emit("/core/home/sizeBehavior", undefined);
        Config.emit("/core/home/sizeBehaviorConfigurable", true);

        // Act
        SharedComponentUtils.getEffectiveHomepageSetting("/core/home/sizeBehavior", "/core/home/sizeBehaviorConfigurable");

        // Assert
        Config.once("/core/home/sizeBehavior").do(function () {
            var sHomePageGroupDisplay = oComponent.getModel().getProperty("/sizeBehavior");

            assert.equal(sHomePageGroupDisplay, "Small", "The correct value has been found.");

            oGetPersonalizerStub.restore();
            done();
        });
    });

    QUnit.test("The configuration for sizeBehavior - when defined in personalization, but disabled by configuration", function (assert) {
        // Arrange
        var done = assert.async(),
            oPersonalizer,
            oGetPersonalizerStub;

        oPersonalizer = {
            getPersData: function () {
                return new jQuery.Deferred().resolve("Small");
            }
        };
        oGetPersonalizerStub = sinon.stub(SharedComponentUtils, "getPersonalizer").returns(oPersonalizer);

        Config.emit("/core/home/sizeBehaviorConfigurable", false);

        // Act
        SharedComponentUtils.getEffectiveHomepageSetting("/core/home/sizeBehavior", "/core/home/sizeBehaviorConfigurable");

        // Assert
        Config.once("/core/home/sizeBehavior").do(function () {
            var sHomePageGroupDisplay = oComponent.getModel().getProperty("/sizeBehavior");

            assert.equal(sHomePageGroupDisplay, "Responsive", "The correct value has been found.");

            oGetPersonalizerStub.restore();
            done();
        });
    });
});
