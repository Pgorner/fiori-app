// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.Notifications.Components
 */
sap.ui.define([
    "sap/ui/core/Component",
    "sap/ui/core/Element",
    "sap/ushell/Container",
    "sap/ushell/state/ShellModel"
], function (
    Component,
    Element,
    Container,
    ShellModel
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.components.shell.Notifications, Fiori 3 tests", {
        beforeEach: async function () {
            window["sap-ushell-config"] = {
                services: {
                    Notifications: { config: {
                        enabled: true,
                        serviceUrl: "/sap/opu/odata/Notifications/"
                    } }
                },
                renderers: {
                    fiori2: {
                        componentData: {
                            config: {
                                enableNotificationsUI: true,
                                applications: { "Shell-home": {} },
                                rootIntent: "Shell-home"
                            }
                        }
                    }
                }
            };

            await Container.init("local");

            this.oRendererMock = {
                getModelConfiguration: sandbox.stub().returns({
                    enableNotificationsUI: true
                }),
                getShellConfig: sandbox.stub().returns({
                    enableNotificationsUI: true
                }),
                addShellDanglingControl: sandbox.stub(),
                shellCtrl: {
                    getModel: sandbox.stub().returns({
                        setProperty: sandbox.stub()
                    })
                },
                showHeaderEndItem: sandbox.stub()
            };
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Notification count is preset correctly", function (assert) {
        var done = assert.async();

        // Arrange
        Container.getServiceAsync("NotificationsV2").then(function (NotificationsService) {
            sandbox.stub(NotificationsService, "init").resolves();
            sandbox.stub(NotificationsService, "registerNotificationsUpdateCallback").callsArg(0);
            sandbox.stub(NotificationsService, "getUnseenNotificationsCount").resolves("10");

            // Act
            Component.create({
                id: "sap-ushell-components-Notifications-component",
                name: "sap.ushell.components.shell.Notifications",
                componentData: {}
            }).then(function (oComponent) {

                // Assert
                assert.equal(!!oComponent, true, "Notification component created");

                const oNotificationCountButton = Element.getElementById("NotificationsCountButton");

                const oModel = ShellModel.getConfigModel();
                assert.strictEqual(oModel.getProperty("/notificationsCount"), 10, "expected Notification count returned");
                assert.strictEqual(oNotificationCountButton.getFloatingNumber(), 10, "expected Notification is displayed");

                // clean up
                oNotificationCountButton.destroy();
                oComponent.destroy();

                done();

            });
        });
    });

    QUnit.module("Notification ShellHeader button", {
        beforeEach: function () {
            this.oNotificationServiceStub = {
                isEnabled: sandbox.stub().returns(true),
                init: sandbox.stub(),
                registerDependencyNotificationsUpdateCallback: sandbox.stub(),
                destroy: sandbox.stub()
            };

            this.oRendererMock = {
                getShellConfig: sandbox.stub().returns({
                    rootIntent: "Shell-home"
                }),
                hideHeaderEndItem: sandbox.stub(),
                showHeaderEndItem: sandbox.stub()
            };

            sandbox.stub(Container, "getServiceAsync").withArgs("NotificationsV2").resolves(this.oNotificationServiceStub);
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);

            this.oNotificationComponent = null;
        },
        afterEach: function () {
            sandbox.restore();
            this.oNotificationComponent.destroy();
        }
    });

    QUnit.test("create shell button when server is enabled", function (assert) {
        var fnDone = assert.async();
        // Arrange
        const aExpectedArguments = [
            ["NotificationsCountButton"],
            false,
            ["home", "app"]
        ];

        // Act
        Component.create({
            id: "sap-ushell-components-Notifications-component",
            name: "sap.ushell.components.shell.Notifications",
            componentData: {}
        }).then(function (oNotificationComponent) {
            this.oNotificationComponent = oNotificationComponent;
            assert.ok(Element.getElementById("NotificationsCountButton"), "button was created");
            assert.ok(this.oRendererMock.showHeaderEndItem.calledOnce, "button was added");
            assert.deepEqual(this.oRendererMock.showHeaderEndItem.getCall(0).args, aExpectedArguments, "addHeaderEndItem called with correct parameters");
            fnDone();
        }.bind(this));
    });

    QUnit.test("Don't create a button if notification service is disabled", function (assert) {
        var fnDone = assert.async();
        // Arrange
        this.oNotificationServiceStub.isEnabled.returns(false);
        // Act
        Component.create({
            id: "sap-ushell-components-Notifications-component1",
            name: "sap.ushell.components.shell.Notifications",
            componentData: {}
        }).then(function (oNotificationComponent) {
            this.oNotificationComponent = oNotificationComponent;
            assert.notOk(Element.getElementById("NotificationsCountButton"), "button was not created");
            assert.ok(this.oRendererMock.showHeaderEndItem.notCalled, "button was added");
            fnDone();
        }.bind(this));
    });
});
