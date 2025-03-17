// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui5service.ShellUIServiceFactory
 */

sap.ui.define([
    "sap/ui/core/Component",
    "sap/ushell/Container",
    "sap/ushell/EventHub",
    "sap/ushell/test/utils",
    "sap/ushell/ui5service/ShellUIService",
    "sap/ushell/ui5service/ShellUIServiceFactory",
    "sap/ushell/utils"
], (
    Component,
    Container,
    EventHub,
    testUtils,
    ShellUIService,
    ShellUIServiceFactory,
    ushellUtils
) => {
    "use strict";
    /* global sinon, QUnit */

    const sandbox = sinon.sandbox.create();

    QUnit.module("init", {
        beforeEach: async function () {
            sandbox.stub(Container, "getServiceAsync");

            this.oAppLifeCycleMock = {
                attachAppLoaded: sandbox.stub(),
                detachAppLoaded: sandbox.stub()
            };
            Container.getServiceAsync.withArgs("AppLifeCycle").resolves(this.oAppLifeCycleMock);
        },
        afterEach: function () {
            ShellUIServiceFactory.reset();
            sandbox.restore();
        }
    });

    QUnit.test("Inits the factory as expected and attaches event handlers", async function (assert) {
        // Act
        await ShellUIServiceFactory.init();
        // Assert
        assert.strictEqual(this.oAppLifeCycleMock.attachAppLoaded.callCount, 1, "AppLoaded event handler is attached");
    });

    QUnit.test("Attaches to the reloadCurrentApp event", async function (assert) {
        // Arrange
        sandbox.spy(EventHub, "on");
        // Act
        await ShellUIServiceFactory.init();
        // Assert
        assert.strictEqual(EventHub.on.withArgs("reloadCurrentApp").callCount, 1, "reloadCurrentApp event handler is attached");
    });

    QUnit.test("Pre creates the global instance", async function (assert) {
        // Arrange
        sandbox.spy(ShellUIServiceFactory, "createInstanceInternal");
        // Act
        await ShellUIServiceFactory.init();
        // Assert
        assert.strictEqual(ShellUIServiceFactory.createInstanceInternal.callCount, 1, "Global instance is created");
    });

    QUnit.module("createInstance", {
        beforeEach: async function () {
            sandbox.stub(Container, "getServiceAsync");

            this.oAppLifeCycleMock = {
                attachAppLoaded: sandbox.stub(),
                detachAppLoaded: sandbox.stub()
            };
            Container.getServiceAsync.withArgs("AppLifeCycle").resolves(this.oAppLifeCycleMock);

            await ShellUIServiceFactory.init();
            const [fnAppLoaded, oScope] = this.oAppLifeCycleMock.attachAppLoaded.getCall(0).args;
            this.fnFireAppLoaded = fnAppLoaded.bind(oScope);
        },
        afterEach: function () {
            ShellUIServiceFactory.reset();
            sandbox.restore();
        }
    });

    QUnit.test("Creates a new instance of ShellUIService with valid context - current app equals scope Object of requested service", async function (assert) {
        // Arrange
        const oComponentInstance = {
            getId: sandbox.stub().returns("componentId")
        };
        const oServiceContext = { scopeObject: oComponentInstance, scopeType: "component" };
        const oEventMock = {
            getParameters: sandbox.stub().returns({
                componentInstance: oComponentInstance
            })
        };
        this.fnFireAppLoaded(oEventMock);

        // Act
        const oService = await ShellUIServiceFactory.createInstance(oServiceContext);

        // Assert
        assert.ok(oService.isA("sap.ushell.ui5service.ShellUIService"), "Service instance is created");
        assert.strictEqual(ShellUIServiceFactory._mServiceInstances.size, 1, "Service instance is created and stored");
    });

    QUnit.test("Creates no new instance of ShellUIService due to missing context", (assert) => {
        // Act
        return ShellUIServiceFactory.createInstance().catch((oError) => {
            // Assert
            assert.ok(oError, "Error is thrown");
            assert.strictEqual(ShellUIServiceFactory._mServiceInstances.size, 0, "Service instance was not created");
        });

    });

    QUnit.test("Creates a new instance of ShellUIService with valid context - requesting app is not current app yet", function (assert) {
        // Arrange
        const done = assert.async();
        const oComponentInstance = {
            getId: sandbox.stub().returns("componentId2")
        };
        const oServiceContext = { scopeObject: oComponentInstance, scopeType: "component" };
        const oEventMock = {
            getParameters: sandbox.stub().returns({
                componentInstance: oComponentInstance
            })
        };

        // Act
        ShellUIServiceFactory.createInstance(oServiceContext).then((oService) => {
            // Assert
            assert.ok(oService.isA("sap.ushell.ui5service.ShellUIService"), "Service instance is created");
            assert.strictEqual(ShellUIServiceFactory._mServiceInstances.size, 1, "Service instance is created and stored");
            done();
        });
        this.fnFireAppLoaded(oEventMock);
    });

    QUnit.test("Handles the back navigation change event", async function (assert) {
        // Arrange
        const done = assert.async();
        function customBack () { }

        const oComponentInstance = {
            getId: sandbox.stub().returns("componentId")
        };
        const oServiceContext = { scopeObject: oComponentInstance, scopeType: "component" };
        const oEventMock = {
            getParameters: sandbox.stub().returns({
                componentInstance: oComponentInstance
            })
        };
        this.fnFireAppLoaded(oEventMock);
        const oService = await ShellUIServiceFactory.createInstance(oServiceContext);

        // Assert
        ShellUIServiceFactory.attachBackNavigationChanged((oEvent) => {
            // Assert
            const fnBack = oEvent.getParameter("data");
            const oComponent = oEvent.getParameter("component");

            assert.strictEqual(fnBack, customBack, "Back navigation is set");
            assert.strictEqual(oComponent.getId(), "componentId", "Returned the component");
            done();
        });

        // Act
        oService.setBackNavigation(customBack);
    });

    QUnit.test("Returns the same service for multiple requests on the same app", async function (assert) {
        // Arrange
        const oComponentInstance = {
            getId: sandbox.stub().returns("componentId")
        };
        const oServiceContext = { scopeObject: oComponentInstance, scopeType: "component" };
        const oEventMock = {
            getParameters: sandbox.stub().returns({
                componentInstance: oComponentInstance
            })
        };
        this.fnFireAppLoaded(oEventMock);
        // Act
        const oPromise1 = ShellUIServiceFactory.createInstance(oServiceContext);
        const oPromise2 = ShellUIServiceFactory.createInstance(oServiceContext);
        // Assert
        return Promise.all([oPromise1, oPromise2]).then((aServices) => {
            assert.strictEqual(aServices[0], aServices[1], "Service instance is the same");
        });
    });

    QUnit.test("Returns the different services for multiple requests when the second comes from deeply nested child components", async function (assert) {
        // Arrange
        const oComponentInstance = {
            getId: sandbox.stub().returns("componentId"),
            isA: sandbox.stub().returns(false)
        };
        const oServiceContext = { scopeObject: oComponentInstance, scopeType: "component" };
        const oChildComponentInstance = {
            getId: sandbox.stub().returns("childComponentId"),
            isA: sandbox.stub().returns(false)
        };
        const oServiceContext2 = { scopeObject: oChildComponentInstance, scopeType: "component" };
        const oNestedChildComponentInstance = {
            getId: sandbox.stub().returns("nestedChildComponentId"),
            isA: sandbox.stub().returns(false)
        };
        const oServiceContext3 = { scopeObject: oNestedChildComponentInstance, scopeType: "component" };
        sandbox.stub(Component, "getOwnerComponentFor");
        Component.getOwnerComponentFor.withArgs(oChildComponentInstance).returns(oComponentInstance);
        Component.getOwnerComponentFor.withArgs(oNestedChildComponentInstance).returns(oChildComponentInstance);
        const oEventMock = {
            getParameters: sandbox.stub().returns({
                componentInstance: oComponentInstance
            })
        };
        this.fnFireAppLoaded(oEventMock);
        // Act
        const oPromise1 = ShellUIServiceFactory.createInstance(oServiceContext);
        const oPromise2 = ShellUIServiceFactory.createInstance(oServiceContext2);
        const oPromise3 = ShellUIServiceFactory.createInstance(oServiceContext3);
        // Assert
        return Promise.all([oPromise1, oPromise2, oPromise3]).then((aServices) => {
            assert.ok(true, "The service of the child component was resolved together with the service of the parent component");
            assert.notStrictEqual(aServices[0], aServices[1], "Service instance is not the same 1-2");
            assert.notStrictEqual(aServices[0], aServices[2], "Service instance is not the same 1-3");
            assert.notStrictEqual(aServices[1], aServices[2], "Service instance is not the same 2-3");

            assert.ok(aServices[0].isA("sap.ushell.ui5service.ShellUIService"), "Service instance is created");
            assert.ok(aServices[1].isA("sap.ushell.ui5service.ShellUIService"), "Service instance is created for child component");
            assert.ok(aServices[2].isA("sap.ushell.ui5service.ShellUIService"), "Service instance is created for nested child component");
        });
    });

    QUnit.test("Resolves a service for appfinder", async function (assert) {
        // Arrange
        const oRendererComponent = {
            getId: sandbox.stub().returns("rendererId"),
            isA: sandbox.stub().returns(true)
        };
        const oAppFinderComponent = {
            getId: sandbox.stub().returns("appFinderId"),
            isA: sandbox.stub().returns(false)
        };
        const oServiceContext = { scopeObject: oAppFinderComponent, scopeType: "component" };

        sandbox.stub(Component, "getOwnerComponentFor");
        Component.getOwnerComponentFor.withArgs(oAppFinderComponent).returns(oRendererComponent);
        const oEventMock = {
            getParameters: sandbox.stub().returns({
                componentInstance: oAppFinderComponent
            })
        };
        this.fnFireAppLoaded(oEventMock);
        // Act
        const oService = await ShellUIServiceFactory.createInstance(oServiceContext);
        // Assert
        assert.ok(oService.isA("sap.ushell.ui5service.ShellUIService"), "Service instance is created");
    });

    QUnit.test("Recreates the service in case it was destroyed", async function (assert) {
        const oComponentInstance = {
            getId: sandbox.stub().returns("componentId")
        };
        const oServiceContext = { scopeObject: oComponentInstance, scopeType: "component" };
        const oEventMock = {
            getParameters: sandbox.stub().returns({
                componentInstance: oComponentInstance
            })
        };
        this.fnFireAppLoaded(oEventMock);
        // Act
        const oService1 = await ShellUIServiceFactory.createInstance(oServiceContext);
        await oService1.destroy();
        const oService2 = await ShellUIServiceFactory.createInstance(oServiceContext);
        // Assert
        assert.notStrictEqual(oService1, oService2, "Service instance is recreated");
    });

    QUnit.test("Initializes the only after appLoaded was fired", async function (assert) {
        // Arrange
        const done = assert.async();
        sandbox.stub(ShellUIService.prototype, "initService");
        const oComponentInstance = {
            getId: sandbox.stub().returns("componentId")
        };
        const oServiceContext = { scopeObject: oComponentInstance, scopeType: "component" };
        const oEventMock = {
            getParameters: sandbox.stub().returns({
                componentInstance: oComponentInstance
            })
        };
        // Act & Assert
        ShellUIServiceFactory.createInstance(oServiceContext).then(() => {
            assert.strictEqual(ShellUIService.prototype.initService.callCount, 1, "Service instance is initialized");
            done();
        });
        assert.strictEqual(ShellUIService.prototype.initService.callCount, 0, "Service instance is not initialized yet");
        this.fnFireAppLoaded(oEventMock);
    });

    QUnit.test("Initializes only once when called for deeply nested child components as well", async function (assert) {
        // Arrange
        sandbox.stub(ShellUIService.prototype, "initService");
        const oComponentInstance = {
            getId: sandbox.stub().returns("componentId"),
            isA: sandbox.stub().returns(false)
        };
        const oServiceContext = { scopeObject: oComponentInstance, scopeType: "component" };
        const oChildComponentInstance = {
            getId: sandbox.stub().returns("childComponentId"),
            isA: sandbox.stub().returns(false)
        };
        const oServiceContext2 = { scopeObject: oChildComponentInstance, scopeType: "component" };
        const oNestedChildComponentInstance = {
            getId: sandbox.stub().returns("nestedChildComponentId"),
            isA: sandbox.stub().returns(false)
        };
        const oServiceContext3 = { scopeObject: oNestedChildComponentInstance, scopeType: "component" };
        sandbox.stub(Component, "getOwnerComponentFor");
        Component.getOwnerComponentFor.withArgs(oChildComponentInstance).returns(oComponentInstance);
        Component.getOwnerComponentFor.withArgs(oNestedChildComponentInstance).returns(oChildComponentInstance);
        const oEventMock = {
            getParameters: sandbox.stub().returns({
                componentInstance: oComponentInstance
            })
        };
        this.fnFireAppLoaded(oEventMock);

        // Act
        await ShellUIServiceFactory.createInstance(oServiceContext);
        await ShellUIServiceFactory.createInstance(oServiceContext2);
        await ShellUIServiceFactory.createInstance(oServiceContext3);

        // Assert
        assert.strictEqual(ShellUIService.prototype.initService.callCount, 3, "Service instance is initialized");
        assert.strictEqual(ShellUIService.prototype.initService.withArgs(true).callCount, 2, "Deep initialization was skipped twice");
    });

    QUnit.module("createInstanceInternal", {
        beforeEach: async function () {
            sandbox.stub(Container, "getServiceAsync");
            sandbox.stub(ushellUtils, "isFlpHomeIntent").returns(false);

            this.oAppLifeCycleMock = {
                attachAppLoaded: sandbox.stub(),
                detachAppLoaded: sandbox.stub()
            };
            Container.getServiceAsync.withArgs("AppLifeCycle").resolves(this.oAppLifeCycleMock);

            await ShellUIServiceFactory.init();
            const [fnAppLoaded, oScope] = this.oAppLifeCycleMock.attachAppLoaded.getCall(0).args;
            this.fnFireAppLoaded = fnAppLoaded.bind(oScope);
        },
        afterEach: function () {
            ShellUIServiceFactory.reset();
            sandbox.restore();
        }
    });

    QUnit.test("Creates a service", async function (assert) {
        // Act
        const oService = await ShellUIServiceFactory.createInstanceInternal();

        // Assert
        assert.ok(oService.isA("sap.ushell.ui5service.ShellUIService"), "Service instance is created");
        assert.strictEqual(ShellUIServiceFactory._mServiceInstances.size, 0, "Service instance was created but not stored in map");
    });

    QUnit.test("Returns the same service instance", async function (assert) {
        // Act
        const oService1 = await ShellUIServiceFactory.createInstanceInternal();
        const oService2 = await ShellUIServiceFactory.createInstanceInternal();

        // Assert
        assert.strictEqual(oService1, oService2, "Service instance is the same");
    });

    QUnit.test("Handles the back navigation change event", async (assert) => {
        // Arrange
        const done = assert.async();
        function customBack () { }

        const oService = await ShellUIServiceFactory.createInstanceInternal();

        // Assert
        ShellUIServiceFactory.attachBackNavigationChanged((oEvent) => {
            // Assert
            const fnBack = oEvent.getParameter("data");
            const oComponent = oEvent.getParameter("component");

            assert.strictEqual(fnBack, customBack, "Back navigation is set");
            assert.strictEqual(oComponent.getId(), "", "Returned the component");
            done();
        });

        // Act
        oService.setBackNavigation(customBack);
    });

    QUnit.test("Updates scope and applies default values on app loaded", async function (assert) {
        // Arrange
        const oService = await ShellUIServiceFactory.createInstanceInternal();
        sandbox.stub(oService, "initService");

        const oComponentInstance = {
            getId: sandbox.stub().returns("componentId")
        };
        const oEventMock = {
            getParameters: sandbox.stub().returns({ componentInstance: oComponentInstance })
        };
        // Act
        this.fnFireAppLoaded(oEventMock);

        // Assert
        assert.strictEqual(oService.initService.callCount, 1, "Service instance is initialized");
        assert.strictEqual(oService.getContext().scopeObject, oComponentInstance, "Scope object is updated");
    });

    QUnit.test("Does not update scope and default values on app loaded for homeIntent", async function (assert) {
        // Arrange
        ushellUtils.isFlpHomeIntent.returns(true);
        const oService = await ShellUIServiceFactory.createInstanceInternal();
        sandbox.stub(oService, "initService");

        const oComponentInstance = {
            getId: sandbox.stub().returns("componentId")
        };
        const oEventMock = {
            getParameters: sandbox.stub().returns({ componentInstance: oComponentInstance })
        };
        // Act
        this.fnFireAppLoaded(oEventMock);

        // Assert
        assert.strictEqual(oService.initService.callCount, 0, "Service instance is not initialized");
        assert.notStrictEqual(oService.getContext().scopeObject, oComponentInstance, "Scope object is updated");
    });

    QUnit.test("Does not update scope and default values on app loaded if there is a local service", async function (assert) {
        // Arrange
        const oComponentInstance = {
            getId: sandbox.stub().returns("componentId")
        };
        const oEventMock = {
            getParameters: sandbox.stub().returns({ componentInstance: oComponentInstance })
        };

        const oServiceContext = { scopeObject: oComponentInstance, scopeType: "component" };
        this.fnFireAppLoaded(oEventMock);
        await ShellUIServiceFactory.createInstance(oServiceContext);

        const oGlobalService = await ShellUIServiceFactory.createInstanceInternal();
        sandbox.stub(oGlobalService, "initService");
        oGlobalService.getContext().scopeObject = { };

        // Act
        this.fnFireAppLoaded(oEventMock);

        // Assert
        assert.strictEqual(oGlobalService.initService.callCount, 0, "Service instance is not initialized");
        assert.notStrictEqual(oGlobalService.getContext().scopeObject, oComponentInstance, "Scope object is updated");
    });

    QUnit.module("Active handling", {
        beforeEach: async function () {
            sandbox.stub(Container, "getServiceAsync");

            this.oAppLifeCycleMock = {
                attachAppLoaded: sandbox.stub(),
                detachAppLoaded: sandbox.stub()
            };
            Container.getServiceAsync.withArgs("AppLifeCycle").resolves(this.oAppLifeCycleMock);

            await ShellUIServiceFactory.init();
            const [fnAppLoaded, oScope] = this.oAppLifeCycleMock.attachAppLoaded.getCall(0).args;
            this.fnFireAppLoaded = fnAppLoaded.bind(oScope);
        },
        afterEach: function () {
            ShellUIServiceFactory.reset();
            sandbox.restore();
        }
    });

    QUnit.test("Resolving a new service with AppOpened deactivates all others", async function (assert) {
        // Arrange
        const oComponentInstance = {
            getId: sandbox.stub().returns("componentId")
        };
        const oServiceContext = { scopeObject: oComponentInstance, scopeType: "component" };
        const oEventMock = {
            getParameters: sandbox.stub().returns({ componentInstance: oComponentInstance })
        };
        this.fnFireAppLoaded(oEventMock);
        const oService1 = await ShellUIServiceFactory.createInstance(oServiceContext);

        assert.strictEqual(oService1.getActive(), true, "Service instance is active");

        // Act
        const oComponentInstance2 = {
            getId: sandbox.stub().returns("componentId2")
        };
        const oServiceContext2 = { scopeObject: oComponentInstance2, scopeType: "component" };
        const oEventMock2 = {
            getParameters: sandbox.stub().returns({ componentInstance: oComponentInstance2, scopeType: "component" })
        };
        this.fnFireAppLoaded(oEventMock2);
        const oService2 = await ShellUIServiceFactory.createInstance(oServiceContext2);

        // Assert
        assert.strictEqual(oService1.getActive(), false, "Service instance is inactive");
        assert.strictEqual(oService2.getActive(), true, "Service 2 instance is active");
    });

    QUnit.test("AppOpened activates all services related to the rootComponent", async function (assert) {
        // Arrange
        const oComponentInstance = {
            getId: sandbox.stub().returns("componentId"),
            isA: sandbox.stub().returns(false)
        };
        const oServiceContext = { scopeObject: oComponentInstance, scopeType: "component" };
        const oChildComponentInstance = {
            getId: sandbox.stub().returns("childComponentId"),
            isA: sandbox.stub().returns(false)
        };
        const oServiceContext2 = { scopeObject: oChildComponentInstance, scopeType: "component" };
        const oNestedChildComponentInstance = {
            getId: sandbox.stub().returns("nestedChildComponentId"),
            isA: sandbox.stub().returns(false)
        };
        const oServiceContext3 = { scopeObject: oNestedChildComponentInstance, scopeType: "component" };
        sandbox.stub(Component, "getOwnerComponentFor");
        Component.getOwnerComponentFor.withArgs(oChildComponentInstance).returns(oComponentInstance);
        Component.getOwnerComponentFor.withArgs(oNestedChildComponentInstance).returns(oChildComponentInstance);
        const oEventMock = {
            getParameters: sandbox.stub().returns({
                componentInstance: oComponentInstance
            })
        };
        this.fnFireAppLoaded(oEventMock);
        // Act
        const oPromise1 = ShellUIServiceFactory.createInstance(oServiceContext);
        const oPromise2 = ShellUIServiceFactory.createInstance(oServiceContext2);
        const oPromise3 = ShellUIServiceFactory.createInstance(oServiceContext3);
        // Assert
        return Promise.all([oPromise1, oPromise2, oPromise3]).then((aServices) => {
            assert.ok(aServices[0].getActive(), "Service instance is active");
            assert.ok(aServices[1].getActive(), "Service instance for child component is active");
            assert.ok(aServices[2].getActive(), "Service instance for nested child component is active");
        });
    });

    QUnit.test("The AppOpened event deactivates all instances when no related instance was found", async function (assert) {
        // Arrange
        const oComponentInstance = {
            getId: sandbox.stub().returns("componentId")
        };
        const oServiceContext = { scopeObject: oComponentInstance, scopeType: "component" };
        const oEventMock = {
            getParameters: sandbox.stub().returns({ componentInstance: oComponentInstance })
        };
        this.fnFireAppLoaded(oEventMock);
        const oService1 = await ShellUIServiceFactory.createInstance(oServiceContext);

        assert.strictEqual(oService1.getActive(), true, "Service instance is active");

        // Act
        const oEventMock2 = {
            getParameters: sandbox.stub().returns({})
        };
        this.fnFireAppLoaded(oEventMock2);

        // Assert
        assert.strictEqual(oService1.getActive(), false, "Service instance is inactive");
    });

    QUnit.test("Restore activates if there is a related service instance", async function (assert) {
        // Arrange
        const oComponentInstance = {
            getId: sandbox.stub().returns("componentId")
        };
        const oServiceContext = { scopeObject: oComponentInstance, scopeType: "component" };
        const oEventMock = {
            getParameters: sandbox.stub().returns({ componentInstance: oComponentInstance })
        };
        this.fnFireAppLoaded(oEventMock);
        const oService1 = await ShellUIServiceFactory.createInstance(oServiceContext);

        assert.strictEqual(oService1.getActive(), true, "Service instance is active");

        // Deactivate service
        const oEventMock2 = {
            getParameters: sandbox.stub().returns({})
        };
        this.fnFireAppLoaded(oEventMock2);
        assert.strictEqual(oService1.getActive(), false, "Service instance is inactive");

        const oStorageEntryMock = {
            app: oComponentInstance
        };

        // Act
        ShellUIServiceFactory.restore(oStorageEntryMock);

        // Assert
        assert.strictEqual(oService1.getActive(), true, "Service instance is active");
    });

    QUnit.test("Restore activates all services related to the rootComponent", async function (assert) {
        // Arrange
        const oComponentInstance = {
            getId: sandbox.stub().returns("componentId"),
            isA: sandbox.stub().returns(false)
        };
        const oServiceContext = { scopeObject: oComponentInstance, scopeType: "component" };
        const oChildComponentInstance = {
            getId: sandbox.stub().returns("childComponentId"),
            isA: sandbox.stub().returns(false)
        };
        const oServiceContext2 = { scopeObject: oChildComponentInstance, scopeType: "component" };
        const oNestedChildComponentInstance = {
            getId: sandbox.stub().returns("nestedChildComponentId"),
            isA: sandbox.stub().returns(false)
        };
        const oServiceContext3 = { scopeObject: oNestedChildComponentInstance, scopeType: "component" };
        sandbox.stub(Component, "getOwnerComponentFor");
        Component.getOwnerComponentFor.withArgs(oChildComponentInstance).returns(oComponentInstance);
        Component.getOwnerComponentFor.withArgs(oNestedChildComponentInstance).returns(oChildComponentInstance);
        const oEventMock = {
            getParameters: sandbox.stub().returns({
                componentInstance: oComponentInstance
            })
        };
        this.fnFireAppLoaded(oEventMock);

        const oService1 = await ShellUIServiceFactory.createInstance(oServiceContext);
        const oService2 = await ShellUIServiceFactory.createInstance(oServiceContext2);
        const oService3 = await ShellUIServiceFactory.createInstance(oServiceContext3);

        // Deactivate service
        const oEventMock2 = {
            getParameters: sandbox.stub().returns({})
        };
        this.fnFireAppLoaded(oEventMock2);

        const oStorageEntryMock = {
            app: oComponentInstance
        };

        // Act
        ShellUIServiceFactory.restore(oStorageEntryMock);

        // Assert
        assert.strictEqual(oService1.getActive(), true, "Service instance is active");
        assert.strictEqual(oService2.getActive(), true, "Service instance for child component is active");
        assert.strictEqual(oService3.getActive(), true, "Service instance for nested child component is active");
    });

    QUnit.test("Restore deactivates all if there is no related service instance", async function (assert) {
        // Arrange
        const oComponentInstance = {
            getId: sandbox.stub().returns("componentId")
        };
        const oServiceContext = { scopeObject: oComponentInstance, scopeType: "component" };
        const oEventMock = {
            getParameters: sandbox.stub().returns({ componentInstance: oComponentInstance })
        };
        this.fnFireAppLoaded(oEventMock);
        const oService1 = await ShellUIServiceFactory.createInstance(oServiceContext);

        assert.strictEqual(oService1.getActive(), true, "Service instance is active");

        const oStorageEntryMock = {
            app: null
        };

        // Act
        ShellUIServiceFactory.restore(oStorageEntryMock);

        // Assert
        assert.strictEqual(oService1.getActive(), false, "Service instance is inactive");
    });

    QUnit.module("Reload application use case", {
        beforeEach: async function () {
            sandbox.stub(Container, "getServiceAsync");

            this.oAppLifeCycleMock = {
                attachAppLoaded: sandbox.stub(),
                detachAppLoaded: sandbox.stub()
            };
            Container.getServiceAsync.withArgs("AppLifeCycle").resolves(this.oAppLifeCycleMock);

            await ShellUIServiceFactory.init();
            const [fnAppLoaded, oScope] = this.oAppLifeCycleMock.attachAppLoaded.getCall(0).args;
            this.fnFireAppLoaded = fnAppLoaded.bind(oScope);
        },
        afterEach: function () {
            ShellUIServiceFactory.reset();
            sandbox.restore();
        }
    });

    QUnit.test("Reload application does only resolve after the application was loaded again", async function (assert) {
        // Arrange
        const done = assert.async();
        const oComponentInstance = {
            getId: sandbox.stub().returns("componentId")
        };
        const oServiceContext = { scopeObject: oComponentInstance, scopeType: "component" };
        const oEventMock = {
            getParameters: sandbox.stub().returns({ componentInstance: oComponentInstance })
        };
        this.fnFireAppLoaded(oEventMock);
        const oService1 = await ShellUIServiceFactory.createInstance(oServiceContext);

        // Act
        // 1) app reload is triggered
        EventHub.emit("reloadCurrentApp", Date.now());
        await testUtils.waitForEventHubEvent("reloadCurrentApp");
        // 2) teardown of app
        oService1.destroy();
        // 3) app is loaded again
        let oService2;
        ShellUIServiceFactory.createInstance(oServiceContext).then((oService) => {
            oService2 = oService;
        });

        // Assert
        // service should not be created yet
        setTimeout(() => {
            assert.notOk(!!oService2, "Service instance was not created");
            done();
        }, 100);
    });
});
