// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.Container
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/util/ObjectPath",
    "sap/ui/base/EventProvider",
    "sap/ui/base/Object",
    "sap/ui/core/Control",
    "sap/ui/core/EventBus",
    "sap/ui/core/Icon",
    "sap/ui/core/UIComponent",
    "sap/ui/core/service/ServiceFactoryRegistry",
    "sap/ui/thirdparty/datajs",
    "sap/ui/thirdparty/jquery",
    "sap/ui/thirdparty/URI",
    "sap/ushell/adapters/local/ContainerAdapter",
    "sap/ushell/Container",
    "sap/ushell/renderer/Renderer",
    "sap/ushell/System",
    "sap/ushell/test/utils",
    "sap/ushell/Ui5ServiceFactory",
    "sap/ushell/Ui5NativeServiceFactory",
    "sap/ushell/User",
    "sap/ushell/utils",
    "sap/ushell/library"
], function (
    Log,
    ObjectPath,
    EventProvider,
    BaseObject,
    Control,
    EventBus,
    Icon,
    UIComponent,
    ServiceFactoryRegistry,
    OData,
    jQuery,
    URI,
    ContainerAdapter,
    Container,
    Renderer,
    System,
    testUtils,
    Ui5ServiceFactory,
    Ui5NativeServiceFactory,
    User,
    ushellUtils,
    ushellLibrary
) {
    "use strict";

    /* global acme, QUnit, sinon */

    var fnODataReadOriginal = OData.read,
        fnODataRequestOriginal = OData.request,
        sCachedConfig;

    var sandbox = sinon.createSandbox({});

    /**
     * Stubs the function <code>getLocalStorage</code> to create a mock for the local storage. All
     * functions are spies and work on the given object. Also stubs
     * <code>utils.localStorageSetItem</code> to modify this mock.
     *
     * @param {object} [oItems]
     *    an object giving the initial state.
     * @returns {object}
     *    a mock for the localStorage
     */
    function mockLocalStorage (oItems) {
        var oLocalStorage;

        oItems = oItems || {};
        oLocalStorage = {
            length: Object.keys(oItems).length,
            getItem: sandbox.spy(function (sKey) {
                return oItems[sKey];
            }),
            removeItem: sandbox.spy(function (sKey) {
                delete oItems[sKey];
                this.length = Object.keys(oItems).length;
            }),
            setItem: sandbox.spy(function (sKey, sValue) {
                //TODO ideally all callers would use utils.localStorageSetItem instead!
                oItems[sKey] = sValue;
                this.length = Object.keys(oItems).length;
            }),
            key: sandbox.spy(function (i) {
                return Object.keys(oItems)[i];
            })
        };
        sandbox.stub(ushellUtils, "getLocalStorage").returns(oLocalStorage);
        ushellUtils.localStorageSetItem.restore(); // This was already stubbed in setup.
        sandbox.stub(ushellUtils, "localStorageSetItem").callsFake(function (sKey, sValue) {
            oLocalStorage.setItem(sKey, sValue);
        });
        return oLocalStorage;
    }

    function getRequireStub (ModulePath, FakeModule) {
        var fnOriginalRequire = sap.ui.require;
        return sandbox.stub(sap.ui, "require").callsFake(function (modules, handler) {
            if (Array.isArray(modules) && modules[0] === ModulePath) {
                return handler(FakeModule);
            } else if (modules === ModulePath) {
                return FakeModule;
            }
            return fnOriginalRequire(modules, handler);
        });
    }

    QUnit.module("sap.ushell.Container", {
        beforeEach: function (assert) {
            // the config has to be reset after the test
            if (!sCachedConfig) {
                sCachedConfig = JSON.stringify(window["sap-ushell-config"]);
            }

            // ensure that we do not modify localStorage
            sandbox.stub(Storage.prototype, "removeItem").callsFake(function () {
                assert.ok(false, "localStorage.removeItem called");
            });
            sandbox.stub(Storage.prototype, "setItem").callsFake(function () {
                assert.ok(false, "localStorage.setItem called");
            });
            sandbox.stub(ushellUtils, "localStorageSetItem");
            if (ushellUtils.reload &&
                !ushellUtils.reload.restore) {
                sandbox.stub(ushellUtils, "reload");
            }
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            OData.read = fnODataReadOriginal;
            OData.request = fnODataRequestOriginal;
            sandbox.restore();
            if (sCachedConfig) {
                window["sap-ushell-config"] = JSON.parse(sCachedConfig);
            }
            window.onhashchange = null;
            Container.reset();
        }
    });

    [{
        sTestDescription: " hasFLPReadyNotificationCapability is false",
        bHasFLPReadyNotificationCapability: false,
        bExpectedDoEventFlpReadyCalled: false
    }, {
        sTestDescription: " hasFLPReadyNotificationCapability is true",
        bHasFLPReadyNotificationCapability: true,
        bExpectedDoEventFlpReadyCalled: true
    }].forEach(function (oFixture) {
        QUnit.test("initialize Container >>" + oFixture.sTestDescription, function (assert) {
            var done = assert.async();

            var oSystem = new System({}),
                oAdapter = new ContainerAdapter(oSystem),
                oPromise;

            sandbox.spy(oAdapter, "load");

            sandbox.stub(ushellUtils, "hasFLPReadyNotificationCapability").returns(oFixture.bHasFLPReadyNotificationCapability);
            var bDoEventFlpReadyCalled = false;

            if (!window.external) {
                window.external = {};
            }
            window.external.getPrivateEpcm = function () {
                return {
                    doEventFlpReady: function () {
                        bDoEventFlpReadyCalled = true;
                    }
                };
            };

            // Code under test
            var iContainerAdapterCalled = 0;
            var oContainerAdapterDummy = function ContainerAdapterDummy () {
                iContainerAdapterCalled++;
                return oAdapter;
            };

            var fnRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (module, callback) {
                if (callback) {
                    callback(oContainerAdapterDummy);
                } else {
                    return oContainerAdapterDummy;
                }
                return undefined;
            });

            oPromise = Container.init("local");
            fnRequireStub.restore();

            // tests
            oPromise.then(function () {
                assert.ok(iContainerAdapterCalled === 1, "adapter created once");
                assert.ok(oAdapter.load.calledOnce, "adapter.load() called");
                assert.ok(typeof Container === "object", "Container created");

                // doEventFlpReady is called async as part of Container init, but unrelated to the returned promise
                setTimeout(function () {
                    assert.strictEqual(bDoEventFlpReadyCalled, oFixture.bExpectedDoEventFlpReadyCalled, "doEventFlpReady was called/not called as expected when" + oFixture.sTestDescription);
                    sandbox.restore();
                    done();
                }, 500);
            });
        });
    });

    QUnit.test("test isDirty flag set/get", function (assert) {
        var done = assert.async();
        Container.init("local")
            .then(function () {
                assert.strictEqual(Container.getDirtyFlag(), false, "isDirty default value is false");
                Container.setDirtyFlag(true);
                assert.strictEqual(Container.getDirtyFlag(), true, "isDirty value was set to true");
                Container.setDirtyFlag(false);
                assert.strictEqual(Container.getDirtyFlag(), false, "isDirty value was set to false");
                done();
            });
    });

    QUnit.test("Config: preloadServices to avoid sync request with getService()", function (assert) {
        var done = assert.async();

        // Arrange
        if (!window["sap-ushell-config"]) {
            window["sap-ushell-config"] = {};
        }
        window["sap-ushell-config"].preloadServices = ["UserInfo", "Search", "Foo"];
        var preloadCalls = {};
        var sapUiRequire = sap.ui.require;
        sandbox.stub(sap.ui, "require").callsFake(function (modules, callback) {
            if (Array.isArray(modules)) {
                if (modules[0] === "sap/ushell/adapters/local/ContainerAdapter"
                    || modules[0] === "sap/ushell/services/PluginManager"
                    || modules[0] === "sap/ushell/services/ShellNavigationInternal"
                    || modules[0] === "sap/ushell/Config") {
                    return sapUiRequire(modules, callback);
                }
                preloadCalls[modules[0]] = true;
                var serviceStub = function () {
                };
                serviceStub.hasNoAdapter = true;
                callback(serviceStub);
            } else {
                return sapUiRequire(modules, callback);
            }
        });

        // Act
        Container.init("local")
            .then(function () {
                // Assert
                assert.ok(preloadCalls["sap/ushell/services/UserInfo"] === true, "UserInfo preloaded");
                assert.ok(preloadCalls["sap/ushell/services/Search"] === true, "Search preloaded");
                assert.ok(preloadCalls["sap/ushell/services/Foo"] === true, "Foo preloaded");
                assert.ok(preloadCalls["sap/ushell/services/Bar"] !== true, "Bar preloaded");

                //Restore
                delete window["sap-ushell-config"].preloadServices;
                done();
            });
    });

    QUnit.test("the registered dirty state provider is called with the navigation context when isDirty is set to false", function (assert) {
        var done = assert.async();
        Container.init("local")
            .then(function () {
                // Arrange
                Container.getServiceAsync("ShellNavigationInternal").then(function (oShellNavigationInternal) {
                    var oGetNavigationContextStub = sandbox.stub(oShellNavigationInternal, "getNavigationContext");
                    var oNavigationContext = {
                        status: "Test"
                    };
                    oGetNavigationContextStub.returns(oNavigationContext);
                    var oSetDirtyStub = sandbox.stub().withArgs(oGetNavigationContextStub).returns(true);

                    Container.registerDirtyStateProvider(oSetDirtyStub);

                    // Act
                    Container.setDirtyFlag(false);
                    var bDirty = Container.getDirtyFlag();

                    // Assert
                    assert.ok(oSetDirtyStub.calledWith(oNavigationContext));
                    assert.strictEqual(bDirty, true, "dirty state provider returned the correct value");

                    // Restore
                    Container.deregisterDirtyStateProvider(oSetDirtyStub);

                    done();
                });
            });
    });

    QUnit.test("the registered dirty state provider is not called when isDirty is set to true", function (assert) {
        var done = assert.async();
        Container.init("local")
            .then(function () {
                // Arrange
                Container.getServiceAsync("ShellNavigationInternal").then(function (oShellNavigationInternal) {
                    var oGetNavigationContextStub = sandbox.stub(oShellNavigationInternal, "getNavigationContext");
                    var oNavigationContext = {
                        status: "Test"
                    };
                    oGetNavigationContextStub.returns(oNavigationContext);
                    var oSetDirtyStub = sandbox.stub().withArgs(oGetNavigationContextStub).returns(false);

                    Container.registerDirtyStateProvider(oSetDirtyStub);

                    // Act
                    Container.setDirtyFlag(true);
                    var bDirty = Container.getDirtyFlag();

                    // Assert
                    assert.strictEqual(oSetDirtyStub.callCount, 0, "the registered dirty state provider was not called.");
                    assert.strictEqual(bDirty, true, "dirty state provider returned the correct value");

                    // Restore
                    Container.setDirtyFlag(false);
                    Container.deregisterDirtyStateProvider(oSetDirtyStub);

                    done();
                });
            });
    });

    QUnit.test("test register external dirty methods", function (assert) {
        var done = assert.async();
        Container.init("local")
            .then(function () {
                assert.strictEqual(Container.getDirtyFlag(), false, "isDirty default value is false");
                var fnDirty = function () {
                    return true;
                };
                Container.registerDirtyStateProvider(fnDirty);
                assert.strictEqual(Container.getDirtyFlag(), true, "isDirty value was set to true");

                // Restore
                Container.deregisterDirtyStateProvider(fnDirty);
                done();
            });
    });

    QUnit.test("test registered external dirty methods are executed every time 'getDirtyState' is called", function (assert) {
        var done = assert.async();
        Container.init("local")
            .then(function () {
                assert.strictEqual(Container.getDirtyFlag(), false, "isDirty default value is false");
                var fnDirty = sandbox.stub().returns(true);

                Container.registerDirtyStateProvider(fnDirty);
                assert.strictEqual(Container.getDirtyFlag(), true, "isDirty value was set to true");
                assert.strictEqual(fnDirty.callCount, 1, "The dirty state provider is called once");
                assert.strictEqual(Container.getDirtyFlag(), true, "isDirty value was set to true");
                assert.strictEqual(fnDirty.callCount, 2, "The dirty state provider is called twice");
                // Restore
                Container.deregisterDirtyStateProvider(fnDirty);
                done();
            });
    });

    QUnit.test("test deregister external dirty methods", function (assert) {
        var done = assert.async();
        Container.init("local")
            .then(function () {
                assert.strictEqual(Container.getDirtyFlag(), false, "isDirty default value is false");
                var fnDirty = function () {
                    return true;
                };
                Container.registerDirtyStateProvider(fnDirty);
                Container.deregisterDirtyStateProvider(fnDirty);
                assert.strictEqual(Container.getDirtyFlag(), false, "isDirty value was set to false");

                done();
            });
    });

    QUnit.test("test deregister external dirty methods (in case a function was registered multiple times, only the last should be removed)", function (assert) {
        // Arrange
        var done = assert.async();
        Container.init("local")
            .then(function () {
                assert.strictEqual(Container.getDirtyFlag(), false, "isDirty default value is false");
                var oFunctions = {
                        fnDirty: function () {
                            return true;
                        },
                        fnDirtyOther: function () {
                            return true;
                        }
                    },
                    spyDirtyOther = sandbox.spy(oFunctions, "fnDirtyOther");

                /**
                 * Act:
                 * register functions to produce aRegisteredDirtyMethods=[fnDirty, fnDirtyOther, fnDirty]
                 * deregister fnDirty
                 * calling getDirtyFlag will call the first function in aRegisteredDirtyMethods that returns true
                 */
                Container.registerDirtyStateProvider(oFunctions.fnDirty);
                Container.registerDirtyStateProvider(oFunctions.fnDirtyOther);
                Container.registerDirtyStateProvider(oFunctions.fnDirty);

                Container.deregisterDirtyStateProvider(oFunctions.fnDirty);

                Container.getDirtyFlag();

                /**
                 * Assert:
                 * fnDirtyOther was not called, since deregistering starts at the back,
                 * reducing the register to aRegisteredDirtyMethods=[fnDirty, fnDirtyOther]
                 */
                assert.strictEqual(spyDirtyOther.callCount, 0, "Last registration of nDirty was deregistered");

                Container.deregisterDirtyStateProvider(oFunctions.fnDirtyOther);
                Container.deregisterDirtyStateProvider(oFunctions.fnDirty);
                done();
            });
    });

    QUnit.test("Container.init: adapter package map, configuration", function (assert) {
        var done = assert.async();
        assert.expect(2);
        var oConfig = { bar: "baz" };

        window["sap-ushell-config"] = {
            services: {
                Container: {
                    adapter: {
                        config: oConfig,
                        foo: function () { /*NOP*/
                        }
                    }
                }
            }
        };

        var oFooAdapter = function (oSystem, sParameter, oAdapterConfiguration) {
            assert.ok(true, "foo.ContainerAdapter created");
            assert.deepEqual(oAdapterConfiguration, { config: oConfig }, "foo.ContainerAdapter configured");

            return new ContainerAdapter(oSystem, sParameter, oAdapterConfiguration);
        };

        // new definition for the local ContainerAdapter
        sap.ui.define("sap/ushell_foo/adapters/foo/ContainerAdapter", [], function () {
            return oFooAdapter;
        }, true);

        Container.init("foo", { foo: "sap.ushell_foo.adapters.foo" })
            .then(done);
    });

    QUnit.test("change platform via configuration", function (assert) {
        var done = assert.async();
        window["sap-ushell-config"] = {
            platform: "local"
        };

        var iContainerAdapterCalled = 0;
        var fnOriginalRequire = sap.ui.require;
        var fnRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (module, callback) {
            if (Array.isArray(module) && module[0] === "sap/ushell/adapters/local/ContainerAdapter") {
                iContainerAdapterCalled++;
                callback(ContainerAdapter);
            } else if (module === "sap/ushell/adapters/local/ContainerAdapter") {
                return ContainerAdapter;
            }
            return fnOriginalRequire(module, callback);
        });

        // sandbox.spy(ContainerAdapter);
        Container.init("local")
            .then(function () {
                assert.ok(iContainerAdapterCalled === 1, "local.ContainerAdapter created");
                fnRequireStub.restore();
                done();
            });
    });

    var checkServiceFactoryCall = function (assert, testParams) {
        var aActualFactory = Ui5ServiceFactory.createServiceFactory.getCall(testParams.iCallNumber).args;
        var aExpectedFactory = [testParams.sServiceName, testParams.bExpectedCallProtection];

        assert.deepEqual(aActualFactory, aExpectedFactory,
            "createServiceFactory for the " + testParams.sServiceName + " Service was called with correct arguments.");
    };

    var checkUi5ServiceRegistryCall = function (assert, testParams) {
        var aActualRegistry = ServiceFactoryRegistry.register.getCall(testParams.iCallNumber).args;
        var aExpectedRegistry = [
            "sap.ushell.ui5service." + testParams.sServiceName,
            {
                fakeFactoryFor: testParams.sServiceName
            }
        ];

        assert.deepEqual(aActualRegistry, aExpectedRegistry, "ServiceFactoryRegistry#register was called with the expected " +
            "arguments when registering factory for the " + testParams.sServiceName + " Service");
    };

    QUnit.test("Container.init: creates and registers all factories of injectable services", function (assert) {
        var done = assert.async();
        window["sap-ushell-config"] = { platform: "local" };

        sandbox.stub(Ui5ServiceFactory, "createServiceFactory").callsFake(function (sServiceName) {
            return {
                fakeFactoryFor: sServiceName
            };
        });
        sandbox.stub(Ui5NativeServiceFactory, "createServiceFactory").callsFake(function (sServiceName) {
            return {
                fakeFactoryFor: sServiceName
            };
        });
        sandbox.stub(ServiceFactoryRegistry, "register");

        // Act
        Container.init("local")
            .then(function () {
                // Assert
                var aExpectedInjectableServices = [
                    "Personalization",
                    "URLParsing",
                    "CrossApplicationNavigation",
                    "Configuration"
                ];

                var iExpectedInjectableServices = aExpectedInjectableServices.length;

                assert.strictEqual(Ui5ServiceFactory.createServiceFactory.callCount, iExpectedInjectableServices,
                    "UI5ServiceFactory.createServiceFactory was called the expected number of times");

                checkServiceFactoryCall(assert, { iCallNumber: 0, sServiceName: "Personalization", bExpectedCallProtection: true });
                checkServiceFactoryCall(assert, { iCallNumber: 1, sServiceName: "URLParsing", bExpectedCallProtection: true });
                checkServiceFactoryCall(assert, {
                    iCallNumber: 2,
                    sServiceName: "CrossApplicationNavigation",
                    bExpectedCallProtection: true
                });
                checkServiceFactoryCall(assert, { iCallNumber: 3, sServiceName: "Configuration", bExpectedCallProtection: false });

                checkUi5ServiceRegistryCall(assert, { iCallNumber: 0, sServiceName: "Personalization" });
                checkUi5ServiceRegistryCall(assert, { iCallNumber: 1, sServiceName: "URLParsing" });
                checkUi5ServiceRegistryCall(assert, { iCallNumber: 2, sServiceName: "CrossApplicationNavigation" });
                checkUi5ServiceRegistryCall(assert, { iCallNumber: 3, sServiceName: "Configuration" });
                done();
            });
    });

    QUnit.test("sap.ushell.bootstrap.callback", function (assert) {
        var done = assert.async();
        window["sap.ushell.bootstrap.callback"] = function () { /*NOP*/
        };

        sandbox.spy(window, "setTimeout");

        Container.init("local")
            .then(function () {
                assert.ok(setTimeout.calledWith(window["sap.ushell.bootstrap.callback"]));
                done();
            });
    });


    /**
     * @deprecated since 1.120.0
     */
    function testCreateRenderer (assert, sConfigRenderer, sParamRenderer, bAsync) {
        sandbox.spy(sap.ui, "requireSync");
        sandbox.spy(sap.ui, "require"); // Async

        if (sConfigRenderer) {
            window["sap-ushell-config"] = {
                defaultRenderer: sConfigRenderer
            };
        }

        var done = assert.async();

        return sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oRenderer,
                bPromiseReturned;

            // make sure that renderer does not create real content etc.
            sandbox.stub(Renderer.prototype, "createContent");

            oRenderer = Container.createRenderer(sParamRenderer, bAsync);

            if (bAsync) {
                // check if the call returned a Promise
                bPromiseReturned = Promise.resolve(oRenderer) === oRenderer;

                assert.ok(bPromiseReturned, "Promise returned");

                oRenderer.then(function (oRenderer) {
                    assert.ok(sap.ui.require.calledWithMatch(["sap/ushell/renderer/Renderer", "sap/ui/core/ComponentContainer", "sap/ui/core/UIComponent", "sap/ui/core/routing/Router"]),
                        "The fiori2 renderer has been requested.");
                    assert.ok(BaseObject.isA(oRenderer, "sap.ui.core.Control"));
                    // components are automatically wrapped into a control
                    assert.ok(BaseObject.isA(oRenderer, "sap.ui.core.ComponentContainer"));
                    assert.strictEqual(oRenderer.getHeight(), "100%");
                    assert.strictEqual(oRenderer.getWidth(), "100%");
                    assert.ok(oRenderer.getComponentInstance() instanceof Renderer);

                    assert.ok(oRenderer !== Container.createRenderer(sParamRenderer));

                    var oDestroyResult = oRenderer.destroy();
                    assert.ok(typeof oDestroyResult.then === "function", "Returned a thenable");
                    oDestroyResult.then(done);
                });
            } else {
                assert.ok(sap.ui.requireSync.calledWithExactly("sap/ushell/renderer/Renderer"));
                assert.ok(sap.ui.requireSync.calledWithExactly("sap/ui/core/ComponentContainer"));
                assert.ok(BaseObject.isA(oRenderer, "sap.ui.core.Control"));
                // components are automatically wrapped into a control
                assert.ok(BaseObject.isA(oRenderer, "sap.ui.core.ComponentContainer"));
                assert.strictEqual(oRenderer.getHeight(), "100%");
                assert.strictEqual(oRenderer.getWidth(), "100%");
                assert.ok(oRenderer.getComponentInstance() instanceof Renderer);

                assert.ok(oRenderer !== Container.createRenderer(sParamRenderer));

                var oDestroyResult = oRenderer.destroy();
                assert.ok(typeof oDestroyResult.then === "function", "Returned a thenable");
                oDestroyResult.then(done);
            }
        });
    }

    function testCreateRendererInternal (assert, sConfigRenderer, sParamRenderer) {
        sandbox.spy(sap.ui, "require");

        if (sConfigRenderer) {
            window["sap-ushell-config"] = {
                defaultRenderer: sConfigRenderer
            };
        }

        var done = assert.async();
        const oDeferred = new jQuery.Deferred();

        Container.init("local")
            .then(async function () {
                // make sure that renderer does not create real content etc.
                sandbox.stub(Renderer.prototype, "createContent");

                const oRenderer = await Container.createRendererInternal(sParamRenderer);

                assert.ok(sap.ui.require.calledWithMatch(["sap/ushell/renderer/Renderer", "sap/ui/core/ComponentContainer", "sap/ui/core/UIComponent", "sap/ui/core/routing/Router"]),
                    "The fiori2 renderer has been requested.");
                assert.ok(BaseObject.isObjectA(oRenderer, "sap.ui.core.Control"));
                // components are automatically wrapped into a control
                assert.ok(BaseObject.isObjectA(oRenderer, "sap.ui.core.ComponentContainer"));
                assert.strictEqual(oRenderer.getHeight(), "100%");
                assert.strictEqual(oRenderer.getWidth(), "100%");
                assert.ok(oRenderer.getComponentInstance() instanceof Renderer);

                const oDifferentRenderer = await Container.createRendererInternal(sParamRenderer);
                assert.ok(oRenderer !== oDifferentRenderer);

                var oDestroyResult = oRenderer.destroy();
                assert.ok(typeof oDestroyResult.then === "function", "Returned a thenable");
                oDestroyResult.then(done);

                oDeferred.resolve();
            });

        return oDeferred.promise();
    }

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("createRenderer: from param", function (assert) {
        testCreateRenderer(assert, undefined, "fiori2").fail(testUtils.onError).done(function () {
            assert.throws(function () {
                Container.createRenderer();
            }, /Missing renderer name/);
        });
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("createRenderer: from param - Async", function (assert) {
        testCreateRenderer(assert, undefined, "fiori2", true)
            .fail(testUtils.onError)
            .done(function () {
                assert.throws(function () {
                    Container.createRenderer();
                }, /Missing renderer name/);
            });
    });

    QUnit.test("createRendererInternal: from param", function (assert) {
        var done = assert.async();
        testCreateRendererInternal(assert, undefined, "fiori2")
            .fail(testUtils.onError)
            .done(async function () {
                try {
                    await Container.createRendererInternal();
                } catch (oError) {
                    assert.ok(/Missing renderer name/.test(oError.toString()), "Rejected");
                }

                done();
            });
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("createRenderer: from config", function (assert) {
        testCreateRenderer(assert, "fiori2", undefined);
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("createRenderer: from config - Async", function (assert) {
        testCreateRenderer(assert, "fiori2", undefined, true);
    });

    QUnit.test("createRendererInternal: from config", function (assert) {
        testCreateRendererInternal(assert, "fiori2", undefined);
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("createRenderer: from config and param, conflicting", function (assert) {
        testCreateRenderer(assert, "nonexisting", "fiori2");
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("createRenderer: from config and param, conflicting - Async", function (assert) {
        testCreateRenderer(assert, "nonexisting", "fiori2", true);
    });

    QUnit.test("createRendererInternal: from config and param, conflicting", function (assert) {
        testCreateRendererInternal(assert, "nonexisting", "fiori2");
    });

    sap.ui.define("acme/foo/bar/MyComponent", [], function () {
        return UIComponent.extend("acme.foo.bar.MyComponent", {
            createContent: function () {
                return new Icon();
            },
            metadata: {}
        });
    });

    /**
     * @deprecated since 1.120.0
     */
    function testCreateRendererWithConfiguration (assert, bAsync) {
        var done = assert.async();
        var aPromise = [];

        function testRenderer (sName) {
            var oRenderer = Container.createRenderer(sName, bAsync),
                bPromiseReturned;

            if (bAsync) {
                bPromiseReturned = Promise.resolve(oRenderer) === oRenderer;

                assert.ok(bPromiseReturned, "Promise returned");
                oRenderer.then(function (oRenderer) {
                    assert.ok(BaseObject.isA(oRenderer, "sap.ui.core.ComponentContainer"), "Renderer returns a component container");
                    assert.ok(oRenderer.getComponentInstance() instanceof acme.foo.bar.MyComponent, "Instance correct");
                    assert.deepEqual(oRenderer.getComponentInstance().getComponentData(), {
                        config: { foo: "bar" },
                        async: true
                    }, "Config correct");
                });
                return oRenderer;
            }
            assert.ok(BaseObject.isA(oRenderer, "sap.ui.core.ComponentContainer"));
            assert.ok(oRenderer.getComponentInstance() instanceof acme.foo.bar.MyComponent);
            assert.deepEqual(oRenderer.getComponentInstance().getComponentData(), { config: { foo: "bar" }, async: false });
        }

        window["sap-ushell-config"] = {
            defaultRenderer: "fiori2",
            renderers: {
                fiori2: {
                    module: "acme.foo.bar.MyComponent",
                    componentData: {
                        config: { foo: "bar" },
                        other: "unused"
                    }
                }
            }
        };
        Container.init("local")
            .then(function () {
                if (!bAsync) {
                    testRenderer("fiori2");
                    testRenderer();
                    done();
                } else {
                    aPromise.push(testRenderer("fiori2"));
                    aPromise.push(testRenderer());
                    Promise.all(aPromise).then(function () {
                        done();
                    });
                }
            });
    }

    function testCreateRendererInternalWithConfiguration (assert) {
        var done = assert.async();

        async function testRenderer (sName) {
            var oRenderer = await Container.createRendererInternal(sName);

            assert.ok(BaseObject.isObjectA(oRenderer, "sap.ui.core.ComponentContainer"), "Renderer returns a component container");
            assert.ok(oRenderer.getComponentInstance() instanceof acme.foo.bar.MyComponent, "Instance correct");
            assert.deepEqual(oRenderer.getComponentInstance().getComponentData(), {
                config: { foo: "bar" },
                async: true
            }, "Config correct");
        }

        window["sap-ushell-config"] = {
            defaultRenderer: "fiori2",
            renderers: {
                fiori2: {
                    module: "acme.foo.bar.MyComponent",
                    componentData: {
                        config: { foo: "bar" },
                        other: "unused"
                    }
                }
            }
        };
        Container.init("local")
            .then(function () {
                Promise.all([
                    testRenderer("fiori2"),
                    testRenderer()
                ]).then(function () {
                    done();
                });
            });
    }

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("createRenderer w/ configuration", function (assert) {
        testCreateRendererWithConfiguration(assert);
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("createRenderer w/ configuration - Async", function (assert) {
        testCreateRendererWithConfiguration(assert, true);
    });

    QUnit.test("createRenderer w/ configuration - Async", function (assert) {
        testCreateRendererInternalWithConfiguration(assert);
    });

    sap.ui.define("acme/foo/bar/MyControl", [], function () {
        return Control.extend("acme.foo.bar.MyControl", {});
    }, true);

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("createRenderer custom control", function (assert) {
        var oRenderer;

        sandbox.spy(sap.ui, "requireSync");
        var done = assert.async();

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            oRenderer = Container.createRenderer("acme.foo.bar.MyControl");
            assert.ok(sap.ui.requireSync.calledWithExactly("acme/foo/bar/MyControl"));
            assert.ok(BaseObject.isA(oRenderer, "sap.ui.core.Control"));
            assert.ok(BaseObject.isA(oRenderer, "acme.foo.bar.MyControl"));
            assert.ok(oRenderer !== Container.createRenderer("acme.foo.bar.MyControl"));
            done();
        });
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("createRenderer custom control - Async", function (assert) {
        var oRenderer;
        var done = assert.async();
        var bPromiseReturned;

        sandbox.spy(sap.ui, "require");


        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            oRenderer = Container.createRenderer("acme.foo.bar.MyControl", true);
            bPromiseReturned = Promise.resolve(oRenderer) === oRenderer;
            assert.ok(bPromiseReturned, "Promise returned");
            oRenderer.then(function (oRenderer) {
                assert.ok(sap.ui.require.calledWithMatch(
                        ["acme/foo/bar/MyControl", "sap/ui/core/ComponentContainer", "sap/ui/core/UIComponent", "sap/ui/core/routing/Router"]),
                    "The MyControl module has been requested, together with ComponentContainer and Router."
                );
                assert.ok(BaseObject.isA(oRenderer, "sap.ui.core.Control"), "Renderer is instance of sap.ui.core.Control");
                assert.ok(BaseObject.isA(oRenderer, "acme.foo.bar.MyControl"), "Renderer is acme.foo.bar.MyControl");
                assert.ok(oRenderer !== Container.createRenderer("acme.foo.bar.MyControl"));
                done();
            });
        });
    });

    QUnit.test("createRendererInternal custom control", function (assert) {
        var done = assert.async();

        sandbox.spy(sap.ui, "require");

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(async function () {
            const oRenderer = await Container.createRendererInternal("acme.foo.bar.MyControl");

            assert.ok(sap.ui.require.calledWithMatch(
                    ["acme/foo/bar/MyControl", "sap/ui/core/ComponentContainer", "sap/ui/core/UIComponent", "sap/ui/core/routing/Router"]),
                "The MyControl module has been requested, together with ComponentContainer and Router."
            );
            assert.ok(BaseObject.isObjectA(oRenderer, "sap.ui.core.Control"), "Renderer is instance of sap.ui.core.Control");
            assert.ok(BaseObject.isObjectA(oRenderer, "acme.foo.bar.MyControl"), "Renderer is acme.foo.bar.MyControl");
            const oRenderer2 = await Container.createRendererInternal("acme.foo.bar.MyControl");
            assert.ok(oRenderer !== oRenderer2);
            done();
        });
    });


    sap.ui.define("acme/foo/bar/MyThingy", [], function () {
        return sandbox.spy();
    }, true);

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("createRenderer wrong type", function (assert) {
        sandbox.spy(sap.ui, "requireSync");
        var done = assert.async();

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {

            assert.throws(function () {
                Container.createRenderer("acme.foo.bar.MyThingy");
            }, /Unsupported renderer type for name acme\.foo\.bar\.MyThingy/);

            // object was required nevertheless, even created...
            assert.ok(sap.ui.requireSync.calledWithExactly("acme/foo/bar/MyThingy"));
            assert.ok(acme.foo.bar.MyThingy.calledOnce);
            done();
        });
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("createRenderer wrong type - Async", function (assert) {
        var done = assert.async();
        sandbox.spy(sap.ui, "require");
        acme.foo.bar.MyThingy.reset();

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            Container.createRenderer("acme.foo.bar.MyThingy", true)
                .catch(function (error) {
                    assert.strictEqual("Unsupported renderer type!", error.message);
                    // object was required nevertheless, even created...
                    assert.ok(sap.ui.require.calledWithMatch(["acme/foo/bar/MyThingy", "sap/ui/core/ComponentContainer", "sap/ui/core/UIComponent", "sap/ui/core/routing/Router"]),
                        "The module MyThingy has been requested."
                    );
                    assert.ok(acme.foo.bar.MyThingy.calledOnce);
                    done();
                });
        });
    });

    QUnit.test("createRendererInternal wrong type", function (assert) {
        var done = assert.async();
        sandbox.spy(sap.ui, "require");
        acme.foo.bar.MyThingy.reset();

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            Container.createRendererInternal("acme.foo.bar.MyThingy")
                .catch(function (error) {
                    assert.strictEqual("Unsupported renderer type!", error.message);
                    // object was required nevertheless, even created...
                    assert.ok(sap.ui.require.calledWithMatch(["acme/foo/bar/MyThingy", "sap/ui/core/ComponentContainer", "sap/ui/core/UIComponent", "sap/ui/core/routing/Router"]),
                        "The module MyThingy has been requested."
                    );
                    assert.ok(acme.foo.bar.MyThingy.calledOnce);
                    done();
                });
        });
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("createRenderer fires an event via the event provider when called for a ui5 control", function (assert) {
        var done = assert.async();
        // Mock a control to use as a container

        // Spy event provider
        var oFireEventSpy = sandbox.spy(EventProvider.prototype, "fireEvent");

        sap.ushell.bootstrap("local")
            .fail(testUtils.onError)
            .done(function () {
                var oRenderer = Container.createRenderer("acme.foo.bar.MyControl"),
                    iCallCount;

                assert.strictEqual(iCallCount = oFireEventSpy.callCount, 1, "EventProvider fired 1 event");
                if (iCallCount === 1) {
                    assert.strictEqual(oFireEventSpy.getCall(0).args[0], "rendererCreated", "EventProvider fired rendererCreated event");
                    assert.deepEqual(oFireEventSpy.getCall(0).args[1], {
                        renderer: oRenderer
                    }, "fired event contains renderer instance");
                }
                done();
            });
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("createRenderer fires an event via the event provider when called for a ui5 control - Async", function (assert) {
        // Mock a control to use as a container
        var bPromiseReturned;
        var done = assert.async();


        sap.ushell.bootstrap("local")
            .done(function () {
                // Spy event provider

                function fnRendererCreatedHandler (oEvent) {
                    var oRenderer = oEvent.getParameter("renderer");

                    assert.strictEqual(oRenderer.getMetadata().getComponentName(), "acme.foo.bar", "fired event contains correct component");
                    Container.detachRendererCreatedEvent(fnRendererCreatedHandler);
                    done();
                }

                Container.attachRendererCreatedEvent(fnRendererCreatedHandler);
                var oRenderer = Container.createRenderer("acme.foo.bar.MyComponent", true);

                bPromiseReturned = Promise.resolve(oRenderer) === oRenderer;
                assert.ok(bPromiseReturned, "Promise returned");
            })
            .fail(testUtils.onError);
    });

    QUnit.test("createRendererInternal fires an event via the event provider when called for a ui5 control", function (assert) {
        // Mock a control to use as a container
        var done = assert.async();


        Container.init("local")
            .then(async function () {
                // Spy event provider

                function fnRendererCreatedHandler (oEvent) {
                    var oRenderer = oEvent.getParameter("renderer");

                    assert.strictEqual(oRenderer.getMetadata().getComponentName(), "acme.foo.bar", "fired event contains correct component");
                    Container.detachRendererCreatedEvent(fnRendererCreatedHandler);
                    done();
                }

                Container.attachRendererCreatedEvent(fnRendererCreatedHandler);
                await Container.createRendererInternal("acme.foo.bar.MyComponent");
            });
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("createRenderer fires an event via the event provider when called for a ui5 component", function (assert) {
        var done = assert.async();
        // Spy event provider
        var oFireEventSpy = sandbox.spy(EventProvider.prototype, "fireEvent");

        sap.ushell.bootstrap("local")
            .fail(testUtils.onError)
            .done(function () {
                var oRendererControl = Container.createRenderer("acme.foo.bar.MyComponent"),
                    oRendererComponent,
                    iCallCount;

                assert.ok(BaseObject.isA(oRendererControl, "sap.ui.core.ComponentContainer"), "createRenderer returns sap.ui.core.ComponentContainer instance");
                oRendererComponent = oRendererControl.getComponentInstance(); // event and getter always return the component instance, not the control
                assert.strictEqual(iCallCount = oFireEventSpy.callCount, 1, "EventProvider fired 1 event");
                if (iCallCount === 1) {
                    assert.strictEqual(oFireEventSpy.getCall(0).args[0], "rendererCreated", "EventProvider fired rendererCreated event");
                    assert.deepEqual(oFireEventSpy.getCall(0).args[1], {
                        renderer: oRendererComponent
                    }, "fired event contains renderer component instance");
                }

                done();
            });
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("createRenderer fires an event via the event provider when called for a ui5 component - Async", function (assert) {
        var done = assert.async(),
            bPromiseReturned;

        // Spy event provider
        var oFireEventSpy = sandbox.spy(EventProvider.prototype, "fireEvent");

        sap.ushell.bootstrap("local")
            .fail(testUtils.onError)
            .done(function () {
                var oRendererControl = Container.createRenderer("acme.foo.bar.MyComponent", true),
                    oRendererComponent,
                    iCallCount;

                bPromiseReturned = Promise.resolve(oRendererControl) == oRendererControl;
                assert.ok(bPromiseReturned, "Promise returned");
                oRendererControl.then(function (oRendererControl) {
                    assert.ok(BaseObject.isA(oRendererControl, "sap.ui.core.ComponentContainer"), "createRenderer returns sap.ui.core.ComponentContainer instance");
                    oRendererComponent = oRendererControl.getComponentInstance(); // event and getter always return the component instance, not the control
                    iCallCount = oFireEventSpy.callCount;
                    if (iCallCount === 1) {
                        assert.strictEqual(oFireEventSpy.getCall(0).args[0], "rendererCreated", "EventProvider fired rendererCreated event");
                        assert.deepEqual(oFireEventSpy.getCall(0).args[1], {
                            renderer: oRendererComponent
                        }, "fired event contains renderer component instance");
                    }

                    done();
                });
            });
    });

    QUnit.test("createRendererInternal fires an event via the event provider when called for a ui5 component", function (assert) {
        var done = assert.async();

        // Spy event provider
        var oFireEventSpy = sandbox.spy(EventProvider.prototype, "fireEvent");

        Container.init("local")
            .then(async function () {
                var oRendererControl = await Container.createRendererInternal("acme.foo.bar.MyComponent");

                assert.ok(BaseObject.isObjectA(oRendererControl, "sap.ui.core.ComponentContainer"), "createRenderer returns sap.ui.core.ComponentContainer instance");
                const oRendererComponent = oRendererControl.getComponentInstance(); // event and getter always return the component instance, not the control
                const iCallCount = oFireEventSpy.callCount;
                if (iCallCount === 1) {
                    assert.strictEqual(oFireEventSpy.getCall(0).args[0], "rendererCreated", "EventProvider fired rendererCreated event");
                    assert.deepEqual(oFireEventSpy.getCall(0).args[1], {
                        renderer: oRendererComponent
                    }, "fired event contains renderer component instance");
                }

                done();
            });
    });

    QUnit.test("attachRendererCreatedEvent attaches event correctly to the event provider", function (assert) {
        var done = assert.async();

        Container.init("local")
            .then(function () {
                var iCallLength,
                    fnCallback = function () { /* reacts to rendererCreated event */
                    };

                // Spy event provider
                var oAttachEventSpy = sandbox.spy(EventProvider.prototype, "attachEvent");

                Container.attachRendererCreatedEvent(fnCallback);
                assert.strictEqual(iCallLength = oAttachEventSpy.callCount, 1, "attachEvent method of Event provider was called 1 time");
                if (iCallLength === 1) {
                    assert.deepEqual(oAttachEventSpy.getCall(0).args, ["rendererCreated", fnCallback], "attachEvent method was called with the expected arguments");
                }

                done();
            });
    });

    QUnit.test("detachRendererCreatedEvent detaches event correctly to the event provider", function (assert) {
        var done = assert.async();

        // Spy event provider
        var oDetachEventSpy = sandbox.spy(EventProvider.prototype, "detachEvent");

        Container.init("local")
            .then(function () {
                var iCallLength,
                    fnCallback = function () { /* reacts to rendererCreated event */
                    };

                Container.detachRendererCreatedEvent(fnCallback);
                assert.strictEqual(iCallLength = oDetachEventSpy.callCount, 1, "detachEvent method of Event provider was called 1 time");
                if (iCallLength === 1) {
                    assert.deepEqual(oDetachEventSpy.getCall(0).args, ["rendererCreated", fnCallback], "detachEvent method was called with the expected arguments");
                }

                done();
            });
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("getRenderer with name - fiori2 renderer created", function (assert) {
        var done = assert.async();
        var oRendererControl,
            oActualRenderer;

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(async function () {
            // make sure that renderer does not create real content etc.
            sandbox.stub(Renderer.prototype, "createContent");

            oRendererControl = await sap.ushell.Container.createRendererInternal("fiori2");
            oActualRenderer = Container.getRenderer("fiori2");
            assert.strictEqual(oActualRenderer, oRendererControl.getComponentInstance());
            done();
        });
    });

    QUnit.test("getRendererInternal with name - fiori2 renderer created", function (assert) {
        var done = assert.async();
        var oRendererControl,
            oActualRenderer;

            Container.init("local")
                .then(async function () {
                    // make sure that renderer does not create real content etc.
                    sandbox.stub(Renderer.prototype, "createContent");

                    oRendererControl = await Container.createRendererInternal("fiori2");
                    oActualRenderer = Container.getRendererInternal("fiori2");
                    assert.strictEqual(oActualRenderer, oRendererControl.getComponentInstance());
                    done();
                });
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("getRenderer without name - fallback to default renderer", function (assert) {
        var done = assert.async();
        var oRendererControl,
            oActualRenderer;

        window["sap-ushell-config"] = {
            defaultRenderer: "fiori2"
        };

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(async function () {
            // make sure that renderer does not create real content etc.
            sandbox.stub(Renderer.prototype, "createContent");

            oRendererControl = await sap.ushell.Container.createRendererInternal();
            oActualRenderer = Container.getRenderer();
            assert.strictEqual(oActualRenderer, oRendererControl.getComponentInstance());
            done();
        });
    });

    QUnit.test("getRendererInternal without name - fallback to default renderer", function (assert) {
        var done = assert.async();
        var oRendererControl,
            oActualRenderer;

        window["sap-ushell-config"] = {
            defaultRenderer: "fiori2"
        };

        Container.init("local")
            .then(async function () {
                // make sure that renderer does not create real content etc.
                sandbox.stub(Renderer.prototype, "createContent");

                oRendererControl = await Container.createRendererInternal();
                oActualRenderer = Container.getRendererInternal();
                assert.strictEqual(oActualRenderer, oRendererControl.getComponentInstance());
                done();
            });
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("getRenderer - returns control instance if plain control", function (assert) {
        var done = assert.async();
        var oRendererControl,
            oActualRenderer;

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(async function () {
            oRendererControl = await Container.createRendererInternal("acme.foo.bar.MyControl");

            oActualRenderer = Container.getRenderer();
            assert.strictEqual(oActualRenderer, oRendererControl);
            done();
        });
    });

    QUnit.test("getRendererInternal - returns control instance if plain control", function (assert) {
        var done = assert.async();
        var oRendererControl,
            oActualRenderer;

            Container.init("local")
                .then(async function () {
                    oRendererControl = await Container.createRendererInternal("acme.foo.bar.MyControl");

                    oActualRenderer = Container.getRendererInternal();
                    assert.strictEqual(oActualRenderer, oRendererControl);
                    done();
                });
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("getRenderer without name - fallback to single instance", function (assert) {
        var done = assert.async();
        var oRendererControl,
            oActualRenderer;

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(async function () {
            // make sure that renderer does not create real content etc.
            sandbox.stub(Renderer.prototype, "createContent");

            oRendererControl = await Container.createRendererInternal("fiori2");
            oActualRenderer = Container.getRenderer();
            assert.strictEqual(oActualRenderer, oRendererControl.getComponentInstance());
            done();
        });
    });

    QUnit.test("getRendererInternal without name - fallback to single instance", function (assert) {
        var done = assert.async();
        var oRendererControl,
            oActualRenderer;

            Container.init("local")
                .then(async function () {
                    // make sure that renderer does not create real content etc.
                    sandbox.stub(Renderer.prototype, "createContent");

                    oRendererControl = await Container.createRendererInternal("fiori2");
                    oActualRenderer = Container.getRendererInternal();
                    assert.strictEqual(oActualRenderer, oRendererControl.getComponentInstance());
                    done();
                });
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("getRenderer without name - no fallback if multiple instances", function (assert) {
        var done = assert.async();
        var oActualRenderer,
            sLogMessage = "getRenderer() - cannot determine renderer, because no default renderer is configured and multiple instances exist.",
            bLogFound = false;

        var oLogListener = {
            onLogEntry: function (oLogEntry) {
                if (oLogEntry.message === sLogMessage && oLogEntry.component === "sap.ushell.Container") {
                    bLogFound = true;
                }
            }
        };

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(async function () {
            Log.setLevel(4, "sap.ushell.Container");
            Log.addLogListener(oLogListener);
            // make sure that renderer does not create real content etc.
            sandbox.stub(Renderer.prototype, "createContent");
            await Container.createRendererInternal("fiori2");

            await Container.createRendererInternal("acme.foo.bar.MyComponent");

            oActualRenderer = Container.getRenderer();
            assert.ok(oActualRenderer === undefined, "Renderer without name is not created");
            assert.ok(bLogFound, "Warning was issued");
            Log.removeLogListener(oLogListener);
            done();
        });
    });

    QUnit.test("getRendererInternal without name - no fallback if multiple instances", function (assert) {
        var done = assert.async();
        var oActualRenderer,
            sLogMessage = "getRendererInternal() - cannot determine renderer, because no default renderer is configured and multiple instances exist.",
            bLogFound = false;

        var oLogListener = {
            onLogEntry: function (oLogEntry) {
                if (oLogEntry.message === sLogMessage && oLogEntry.component === "sap.ushell.Container") {
                    bLogFound = true;
                }
            }
        };

        Container.init("local")
            .then(async function () {
                Log.setLevel(4, "sap.ushell.Container");
                Log.addLogListener(oLogListener);
                // make sure that renderer does not create real content etc.
                sandbox.stub(Renderer.prototype, "createContent");
                await Container.createRendererInternal("fiori2");

                await Container.createRendererInternal("acme.foo.bar.MyComponent");

                oActualRenderer = Container.getRendererInternal();
                assert.ok(oActualRenderer === undefined, "Renderer without name is not created");
                assert.ok(bLogFound, "Warning was issued");
                Log.removeLogListener(oLogListener);
                done();
            });
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("getRenderer with name - returns undefined if not yet created", function (assert) {
        var done = assert.async();
        var oActualRenderer;

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            oActualRenderer = Container.getRenderer("notYetCreated");
            assert.ok(oActualRenderer === undefined);
            done();
        });
    });

    QUnit.test("getRendererInternal with name - returns undefined if not yet created", function (assert) {
        var done = assert.async();
        var oActualRenderer;

        Container.init("local")
            .then(function () {
                oActualRenderer = Container.getRendererInternal("notYetCreated");
                assert.ok(oActualRenderer === undefined);
                done();
            });
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("getRenderer with name - returns undefined if other renderer", function (assert) {
        var done = assert.async();
        var oActualRenderer;

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(async function () {
            // make sure that renderer does not create real content etc.
            sandbox.stub(Renderer.prototype, "createContent");

            await Container.createRendererInternal("fiori2");

            oActualRenderer = Container.getRenderer("anotherRenderer");
            assert.ok(oActualRenderer === undefined);
            done();
        });
    });

    QUnit.test("getRendererInternal with name - returns undefined if other renderer", function (assert) {
        var done = assert.async();
        var oActualRenderer;

        Container.init("local")
            .then(async function () {
                // make sure that renderer does not create real content etc.
                sandbox.stub(Renderer.prototype, "createContent");

                await Container.createRendererInternal("fiori2");

                oActualRenderer = Container.getRendererInternal("anotherRenderer");
                assert.ok(oActualRenderer === undefined);
                done();
            });
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("Missing service name", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            assert.throws(function () {
                Container.getService();
            }, /Missing service name/, "getService complains when no service name given");
            done();
        });
    });

    QUnit.test("getServiceAsync", function (assert) {
        var fnDone = assert.async();
        Container.init("local")
            .then(function () {
                var oRequireStub,
                    oBarServicePromise,
                    oBarServiceDouble;


                var fnBarAdapter = function (oSystem, sParameter, oProperties) {
                    // simple check if the given system is the logon system
                    assert.strictEqual(oSystem.getPlatform(), "local");
                    assert.strictEqual(oSystem.getAlias(), "");
                    assert.strictEqual(sParameter, undefined);
                    assert.deepEqual(oProperties, { config: {} });
                };


                var oServiceConstructorStub = sandbox.stub();
                oServiceConstructorStub.hasNoAdapter = false;
                oRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (aLibs, fnHandler) {
                    if (Array.isArray(aLibs) && aLibs[0] === "sap/ushell/services/Bar") {
                        fnHandler(oServiceConstructorStub);
                    } else if (Array.isArray(aLibs) && aLibs[0] === "sap/ushell/adapters/local/BarAdapter") {
                        fnHandler(fnBarAdapter);
                    } else if (aLibs === "sap/ushell/adapters/local/BarAdapter") {
                        return fnBarAdapter;
                    }
                });



                // code under test

                var oLogSpy = sandbox.spy(Log, "error");
                oBarServicePromise = Container.getServiceAsync("Bar", undefined);
                assert.strictEqual(oLogSpy.callCount, 0, "No error has been logged.");

                // we need to test a rapid succession of calls that could potentially generate
                // a race condition.
                oBarServiceDouble = Container.getServiceAsync("Bar", undefined);

                assert.ok(oBarServicePromise instanceof Promise, "Promise returned");

                // assertions
                Promise.all([oBarServicePromise, oBarServiceDouble])
                    .then(function (aServices) {
                        assert.strictEqual(aServices[0], aServices[1], "getServiceAsync returns the same instance even if called several times in rapid succession");
                        var oBarService = aServices[0];
                        assert.ok(oBarService instanceof oServiceConstructorStub, "getServiceAsync returned the created service");
                        assert.ok(oRequireStub.calledWith(["sap/ushell/services/Bar"]), "required the Bar service");
                        assert.ok(oRequireStub.calledWith(["sap/ushell/adapters/local/BarAdapter"]), "required the Bar adapter for local platform");

                        assert.strictEqual(oRequireStub.callCount, 2, "require was called as often as expected");
                        assert.strictEqual(oRequireStub.callCount, 2, "require was not called again");

                        var oServiceAdapter = oServiceConstructorStub.args[0][0];
                        var oContainerInterface = oServiceConstructorStub.args[0][1];
                        var sParameter = oServiceConstructorStub.args[0][2];
                        var oProperties = oServiceConstructorStub.args[0][3];

                        assert.ok(oServiceAdapter instanceof fnBarAdapter, "Service constructor was called with an instance of the adapter as first parameter");
                        assert.strictEqual(typeof oContainerInterface.createAdapter, "function");
                        assert.strictEqual(sParameter, undefined);
                        assert.deepEqual(oProperties, { config: {} });
                        return Promise.all([oBarService, Container.getServiceAsync("Bar")]);
                    })
                    .then(function (aValues) {
                        var oOriginalBarService = aValues[0];
                        var oNewBarService = aValues[1];
                        assert.strictEqual(oOriginalBarService, oNewBarService, "second call delivers the same instance");

                        oRequireStub.restore();
                    }).finally(fnDone);
            });
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("getService", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oBarService;

            var sDeprecationMessage = "Deprecated API call of 'sap.ushell.Container.getService'. Please use 'getServiceAsync' instead";
            var sModule = "sap.ushell.Container";
            var oErrorStub = sandbox.stub(Log, "error");
            var oServiceConstructorStub = sandbox.stub();
            oServiceConstructorStub.hasNoAdapter = false;

            // use virtual Bar service for testing service creation with adapter
            var fakeBarAdapter = function (oSystem, sParameter, oProperties) {
                // simple check if the given system is the logon system
                assert.strictEqual(oSystem.getPlatform(), "local", "The given system has the correct platform");
                assert.strictEqual(oSystem.getAlias(), "", "The given system has the correct alias");
                assert.strictEqual(sParameter, undefined, "The correct parameter was given");
                assert.deepEqual(oProperties, { config: {} }, "The correct config was given");
            };

            var oRequireStub = sandbox.stub(sap.ui, "requireSync").callsFake(function (sModuleName) {
                if (sModuleName === "sap/ushell/services/Bar") {
                    return oServiceConstructorStub;
                } else if (sModuleName === "sap/ushell/adapters/local/BarAdapter") {
                    return fakeBarAdapter;
                }
            });

            // code under test
            oBarService = Container.getService("Bar", undefined);

            // assertions
            assert.ok(oBarService instanceof oServiceConstructorStub, "getService returned the created service");
            assert.ok(oRequireStub.calledWithExactly("sap/ushell/services/Bar"), "required the Bar service");
            assert.strictEqual(Container.getService("Bar"), oBarService, "second call delivers the same instance");

            var oServiceAdapter = oServiceConstructorStub.args[0][0];
            var oContainerInterface = oServiceConstructorStub.args[0][1];
            var sParameter = oServiceConstructorStub.args[0][2];
            var oProperties = oServiceConstructorStub.args[0][3];

            assert.ok(oServiceAdapter instanceof fakeBarAdapter, "Service constructor was called with an instance of the adapter as first parameter");
            assert.strictEqual(typeof oContainerInterface.createAdapter, "function", "createAdapter is a function");
            assert.strictEqual(sParameter, undefined, "Service constructor was called with undefined parameters");
            assert.deepEqual(oProperties, { config: {} }, "Service constructor was called with  correct config");
            assert.strictEqual(oErrorStub.withArgs(sDeprecationMessage, null, sModule).callCount, 1, "The deprecation error was logged");
            oRequireStub.restore();
            done();
        });
    });

    // use virtual Bar service for testing service creation with adapter
    sap.ui.define("sap/ushell/adapters/local/BarAdapter", [], function () {
        return sandbox.stub();
    }, true);

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("calling getServiceAsync after getService returns the correct adapter", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oBarService,
                oBarServicePromise;

            var oServiceConstructorStub = sandbox.stub();
            oServiceConstructorStub.hasNoAdapter = false;
            sandbox.stub(sap.ui, "requireSync").returns(oServiceConstructorStub);

            // code under test
            oBarService = Container.getService("Bar", undefined);
            oBarServicePromise = Container.getServiceAsync("Bar", undefined);

            // assertions
            oBarServicePromise.then(function (oService) {
                assert.strictEqual(oService, oBarService, "getServiceAsync returns the same instance as getService");
                done();
            });
        });
    });

    QUnit.test("getServiceAsync rejects promise if service couldn't be loaded", function (assert) {
        // Arrange
        var done = assert.async();
        Container.init("local")
            .then(function () {
                sandbox.stub(sap.ui, "require").callsFake(function (vModules, fnSuccessCallback, fnErrorCallback) {
                    if (Array.isArray(vModules)) {
                        if (vModules.indexOf("sap/ushell/services/NonExistingService") >= 0) {
                            return fnErrorCallback("Couldn't retrieve service sap/ushell/services/NonExistingService");
                        }
                    }

                    return fnSuccessCallback();
                });

                // Act
                Container.getServiceAsync("NonExistingService")
                    .then(function () {
                        assert.ok(false, "The promise was not rejected.");
                    })
                    .catch(function (sError) {
                        // Assert
                        assert.strictEqual(sError, "Couldn't retrieve service sap/ushell/services/NonExistingService", "The promise was rejected with the correct error.");
                    })
                    .finally(function () {
                        done();
                    });
            });
    });

    QUnit.test("getServiceAsync rejects promise if service adapter couldn't be loaded", function (assert) {
        // Arrange
        var done = assert.async();
        Container.init("local")
            .then(function () {
                sandbox.stub(sap.ui, "require").callsFake(function (vModules, fnSuccessCallback, fnErrorCallback) {
                    if (Array.isArray(vModules)) {
                        if (vModules.indexOf("sap/ushell/services/NonExistingService") >= 0) {
                            return fnSuccessCallback(sandbox.stub());
                        }

                        if (vModules.indexOf("sap/ushell/adapters/local/NonExistingServiceAdapter") >= 0) {
                            return fnErrorCallback("Couldn't retrieve adapter sap/ushell/adapters/local/NonExistingServiceAdapter");
                        }
                    }

                    return undefined;
                });

                // Act
                Container.getServiceAsync("NonExistingService")
                    .then(function () {
                        assert.ok(false, "The promise was not rejected.");
                    })
                    .catch(function (sError) {
                        // Assert
                        assert.strictEqual(sError, "Couldn't retrieve adapter sap/ushell/adapters/local/NonExistingServiceAdapter", "The promise was rejected with the correct error.");
                    })
                    .finally(function () {
                        done();
                    });
            });
    });

    function getServiceWConfig (assert, bAsync) {
        window["sap-ushell-config"] = {
            services: {
                Bar: {
                    module: "acme.foo.Bar",
                    config: { foo: "bar" }
                }
            }
        };
        var done = assert.async();

        Container.init("local")
            .then(function () {
                var oBarService,
                    bPromiseReturned;

                // check that config changes after bootstrap have no effect
                window["sap-ushell-config"] = {
                    services: {
                        Bar: {
                            module: "sap.ushell.services.Bar"
                        }
                    }
                };

                var fnBarAdapter = function (oSystem, sParameter, oProperties) {
                    // simple check if the given system is the logon system
                    assert.strictEqual(oSystem.getPlatform(), "local");
                    assert.strictEqual(oSystem.getAlias(), "");
                    assert.strictEqual(sParameter, undefined);
                };

                var oServiceConstructorStub = sandbox.stub();
                oServiceConstructorStub.hasNoAdapter = false;
                var oRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (aLibs, fnHandler) {
                    if (Array.isArray(aLibs) && aLibs[0] === "acme/foo/Bar") {
                        fnHandler(oServiceConstructorStub);
                    } else if (Array.isArray(aLibs) && aLibs[0] === "sap/ushell/adapters/local/BarAdapter") {
                        fnHandler(fnBarAdapter);
                    } else if (aLibs === "sap/ushell/adapters/local/BarAdapter") {
                        return fnBarAdapter;
                    } else if (aLibs === "acme/foo/Bar") {
                        return oServiceConstructorStub;
                    }
                    return undefined;
                });

                if (!bAsync) {
                    sandbox.stub(sap.ui, "requireSync").callsFake(function (sModuleName) {
                        if (sModuleName === "acme/foo/Bar") {
                            return oServiceConstructorStub;
                        } else if (sModuleName === "sap/ushell/adapters/local/BarAdapter") {
                            return fnBarAdapter;
                        }
                    });
                }

                // code under test
                if (bAsync) {
                    oBarService = Container.getServiceAsync("Bar", undefined);

                    bPromiseReturned = Promise.resolve(oBarService) === oBarService;
                    assert.ok(bPromiseReturned, "Promise returned");
                } else { // if not Async, convert object to Promise
                    oBarService = Promise.resolve(Container.getService("Bar", undefined));
                }
                // assertions
                oBarService.then(function (oBarService) {
                    assert.ok(oBarService instanceof oServiceConstructorStub, "getService returned the created service");

                    var oServiceAdapter = oServiceConstructorStub.args[0][0];
                    var oContainerInterface = oServiceConstructorStub.args[0][1];
                    var sParameter = oServiceConstructorStub.args[0][2];
                    var oProperties = oServiceConstructorStub.args[0][3];
                    assert.ok(oServiceAdapter instanceof fnBarAdapter, "Adapter Instance of correct type");
                    assert.strictEqual(typeof oContainerInterface.createAdapter, "function");
                    assert.strictEqual(sParameter, undefined);
                    assert.deepEqual(oProperties, { config: { foo: "bar" } });
                    oRequireStub.restore();
                    done();
                });
            });
    }

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("getService w/ config", function (assert) {
        getServiceWConfig(assert, false);
    });

    QUnit.test("getServiceAsync w/ config", function (assert) {
        getServiceWConfig(assert, true);
    });

    function getServiceWAdapterConfig (assert, bAsync) {
        var done = assert.async(),
            bPromiseReturned,
            oBarService;

        window["sap-ushell-config"] = {
            services: {
                Bar: {
                    adapter: {
                        module: "sap.ushell.adapters.sandbox.BarAdapter",
                        config: { foo: "bar" }
                    }
                }
            }
        };
        Container.init("local")
            .then(function () {
                var fnBarAdapter = function (oSystem, sParameter, oProperties) {
                    // simple check if the given system is the logon system
                    assert.strictEqual(oSystem.getPlatform(), "local");
                    assert.strictEqual(oSystem.getAlias(), "");
                    assert.strictEqual(sParameter, undefined);
                    assert.deepEqual(oProperties, { config: { foo: "bar" } });
                };

                var oServiceConstructorStub = sandbox.stub();
                oServiceConstructorStub.hasNoAdapter = false;
                var oRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (aLibs, fnHandler) {
                    if (Array.isArray(aLibs) && aLibs[0] === "sap/ushell/services/Bar") {
                        fnHandler(oServiceConstructorStub);
                    } else if (Array.isArray(aLibs) && aLibs[0] === "sap/ushell/adapters/sandbox/BarAdapter") {
                        fnHandler(fnBarAdapter);
                    } else if (aLibs === "sap/ushell/adapters/sandbox/BarAdapter") {
                        return fnBarAdapter;
                    }
                });

                var oRequireSyncStub = sandbox.stub(sap.ui, "requireSync").callsFake(function (ModuleName) {
                    if (ModuleName === "sap/ushell/adapters/sandbox/BarAdapter") {
                        return fnBarAdapter;
                    } else if (ModuleName === "sap/ushell/services/Bar") {
                        return oServiceConstructorStub;
                    }
                });

                // code under test
                if (bAsync) {
                    oBarService = Container.getServiceAsync("Bar", undefined);
                    bPromiseReturned = Promise.resolve(oBarService) === oBarService;
                    assert.ok(bPromiseReturned, "Promise returned");
                } else { // if not Async, convert object to Promise
                    oBarService = Promise.resolve(Container.getService("Bar", undefined));
                }

                oBarService.then(function (oBarService) {
                    var oServiceAdapter = oServiceConstructorStub.args[0][0];
                    var oContainerInterface = oServiceConstructorStub.args[0][1];
                    assert.ok(oServiceAdapter instanceof fnBarAdapter, "ServiceAdapter of correct type.");
                    assert.strictEqual(typeof oContainerInterface.createAdapter, "function");
                    oRequireStub.restore();
                    oRequireSyncStub.restore();
                    done();
                });
            });
    }

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("getService w/ adapter config", function (assert) {
        getServiceWAdapterConfig(assert, false);
    });

    QUnit.test("getServiceAsync w/ adapter config", function (assert) {
        getServiceWAdapterConfig(assert, true);
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("getService without adapter, but with parameter", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oFooService;

            var oServiceConstructorStub = sandbox.stub();
            oServiceConstructorStub.hasNoAdapter = true;
            var oRequireSyncStub = sandbox.stub(sap.ui, "requireSync").returns(
                oServiceConstructorStub
            );

            // code under test
            oFooService = Container.getService("Foo", "bar");

            // assertions
            assert.ok(oFooService instanceof oServiceConstructorStub,
                "getService returned the created service");

            assert.ok(oRequireSyncStub.calledWithExactly("sap/ushell/services/Foo"),
                "required the Foo service");
            assert.ok(oRequireSyncStub.neverCalledWith("sap/ushell/adapters/local/FooAdapter"),
                "did NOT require the Foo adapter for local platform");

            assert.strictEqual(oRequireSyncStub.callCount, 1, "requireSync was called one time");

            var oContainerInterface = oServiceConstructorStub.args[0][0];
            var sParameter = oServiceConstructorStub.args[0][1];

            assert.strictEqual(typeof oContainerInterface.createAdapter, "undefined");
            assert.strictEqual(sParameter, "bar");
            oRequireSyncStub.restore();
            done();
        });
    });

    QUnit.test("getServiceAsync without adapter, but with parameter", function (assert) {
        var done = assert.async(),
            bPromiseReturned;

        Container.init("local")
            .then(function () {
                var oFooService;

                var oServiceConstructorStub = sandbox.stub();
                oServiceConstructorStub.hasNoAdapter = true;
                var oRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (aLibs, fnHandler) {
                    fnHandler(oServiceConstructorStub);
                });

                // code under test
                oFooService = Container.getServiceAsync("Foo", "bar");

                bPromiseReturned = Promise.resolve(oFooService) == oFooService;
                assert.ok(bPromiseReturned, "Promise returned");

                // assertions
                oFooService.then(function (oFooService) {
                    assert.ok(oFooService instanceof oServiceConstructorStub,
                        "getServiceAsync returned the created service");

                    assert.ok(oRequireStub.calledWith(["sap/ushell/services/Foo"]),
                        "required the Foo service");
                    assert.ok(oRequireStub.neverCalledWith(["sap/ushell/adapters/local/FooAdapter"]),
                        "did NOT require the Foo adapter for local platform");

                    assert.strictEqual(oRequireStub.callCount, 1, "require was called one time");

                    var oContainerInterface = oServiceConstructorStub.args[0][0];
                    var sParameter = oServiceConstructorStub.args[0][1];

                    assert.strictEqual(typeof oContainerInterface.createAdapter, "undefined");
                    assert.strictEqual(sParameter, "bar");
                    done();
                });
            });
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("getService without adapter, but with config", function (assert) {
        window["sap-ushell-config"] = {
            services: {
                Bar: {
                    module: "acme.foo.Bar",
                    config: { foo: "bar" }
                }
            }
        };
        var done = assert.async(),
            oRequireStub;

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oServiceConstructorStub = sandbox.stub();
            oServiceConstructorStub.hasNoAdapter = true;
            oRequireStub = sandbox.stub(sap.ui, "requireSync").returns(
                oServiceConstructorStub);

            // code under test
            var oBarService = Promise.resolve(Container.getService("Bar", undefined));

            // assertions
            oBarService.then(function (oBarService) {
                assert.ok(oBarService instanceof oServiceConstructorStub, "getService returned the created service");

                var sParameter = oServiceConstructorStub.args[0][1];
                var oProperties = oServiceConstructorStub.args[0][2];

                assert.strictEqual(oRequireStub.callCount, 1, "requireSync was called one time");
                assert.strictEqual(sParameter, undefined);
                assert.deepEqual(oProperties.config, { foo: "bar" });
                done();
            });
        });
    });

    QUnit.test("getServiceAsync without adapter, but with config", function (assert) {
        window["sap-ushell-config"] = {
            services: {
                Bar: {
                    module: "acme.foo.Bar",
                    config: { foo: "bar" }
                }
            }
        };
        var done = assert.async(),
            oRequireStub,
            bPromiseReturned;

            Container.init("local")
                .then(function () {
                    var oBarService;

                    var oServiceConstructorStub = sandbox.stub();
                    oServiceConstructorStub.hasNoAdapter = true;
                    oRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (aLibs, fnHandler) {
                        fnHandler(oServiceConstructorStub);
                    });

                    // code under test
                    oBarService = Container.getServiceAsync("Bar");
                    bPromiseReturned = Promise.resolve(oBarService) == oBarService;
                    assert.ok(bPromiseReturned, "Promise returned");

                    // assertions
                    oBarService.then(function (oBarService) {
                        assert.ok(oBarService instanceof oServiceConstructorStub, "getService returned the created service");

                        var sParameter = oServiceConstructorStub.args[0][1];
                        var oProperties = oServiceConstructorStub.args[0][2];

                        assert.strictEqual(oRequireStub.callCount, 1, "requireSync was called one time");
                        assert.strictEqual(sParameter, undefined);
                        assert.deepEqual(oProperties.config, { foo: "bar" });
                        done();
                    });
                });
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("getService with parameter", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oBarService;

            var fnBarAdapter = function (oSystem, sParameter) {
                // simple check if the given system is the logon system
                assert.strictEqual(oSystem.getPlatform(), "local");
                assert.strictEqual(oSystem.getAlias(), "");
                assert.strictEqual(sParameter, "parameter");
            };

            var fnOriginalRequire = sap.ui.require;
            var fnReqireStub = sandbox.stub(sap.ui, "require").callsFake(function (Modules, Handler) {
                if (!Array.isArray(Modules) && Modules === "sap/ushell/adapters/local/BarAdapter") {
                    return fnBarAdapter;
                }
                return fnOriginalRequire(Modules, Handler);

            });

            // the service
            var oServiceConstructorStub = sandbox.stub();
            oServiceConstructorStub.hasAdapter = false;
            var oRequireSyncStub = sandbox.stub(sap.ui, "requireSync").returns(
                oServiceConstructorStub
            );

            // ***** code under test
            oBarService = Container.getService("Bar", "parameter");

            // assertions
            assert.ok(oBarService instanceof oServiceConstructorStub,
                "getService returned the created service");

            assert.ok(oRequireSyncStub.calledWithExactly("sap/ushell/services/Bar"),
                "required the Bar service");

            // ***** create it again

            //// delete sap.ushell.services.Bar; // must not be called again
            assert.strictEqual(Container.getService("Bar", "parameter"), oBarService,
                "second call delivers the same instance");

            // ***** create another one
            fnBarAdapter = function (oSystem, sParameter) {
                //start();
                // simple check if the given system is the logon system
                assert.strictEqual(oSystem.getPlatform(), "local");
                assert.strictEqual(oSystem.getAlias(), "");
                assert.strictEqual(sParameter, undefined);
            };

            assert.notStrictEqual(Container.getService("Bar", undefined), oBarService,
                "new instance for different parameter");

            assert.strictEqual(oRequireSyncStub.callCount, 4, "requireSync was called two times");
            fnReqireStub.restore();
            oRequireSyncStub.restore();
            done();
        });
    });

    QUnit.test("getServiceAsync with parameter", function (assert) {
        var done = assert.async();

        Container.init("local")
            .then(function () {
                var oBarService,
                    oBarServiceBackup,
                    oRequireStub,
                    bPromiseReturned;


                var fnBarAdapter = function (oSystem, sParameter) {
                    // simple check if the given system is the logon system
                    assert.strictEqual(oSystem.getPlatform(), "local");
                    assert.strictEqual(oSystem.getAlias(), "");
                    assert.strictEqual(sParameter, "parameter");
                };

                // the service
                var oServiceConstructorStub = sandbox.stub();
                oServiceConstructorStub.hasAdapter = false;
                oRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (aLibs, fnHandler) {
                    if (!Array.isArray(aLibs) && aLibs === "sap/ushell/adapters/local/BarAdapter") {
                        return fnBarAdapter;
                    }
                    return fnHandler(oServiceConstructorStub);
                });

                // ***** code under test
                oBarService = Container.getServiceAsync("Bar", "parameter");

                // assertions
                bPromiseReturned = Promise.resolve(oBarService) === oBarService;
                assert.ok(bPromiseReturned, "Promise returned");

                var oExpectedRequiredDependencies = {
                    "sap/ushell/services/Bar": true,
                    "sap/ushell/adapters/local/BarAdapter": true
                };

                oBarService.then(function (oBarService) {
                    assert.ok(oBarService instanceof oServiceConstructorStub,
                        "getService returned the created service");

                    var iExpectedRequireCalls = getExpectedRequireCalls(oRequireStub, oExpectedRequiredDependencies);
                    assert.strictEqual(iExpectedRequireCalls, 2, "require was called on the desired dependencies");

                    oBarServiceBackup = oBarService;
                    // ***** create it again

                    //// delete sap.ushell.services.Bar; // must not be called again
                    return Container.getServiceAsync("Bar", "parameter");
                }).then(function (oBarService2) {
                    assert.strictEqual(oBarService2, oBarServiceBackup, "second call delivers the same instance");

                    var iExpectedRequireCalls = getExpectedRequireCalls(oRequireStub, oExpectedRequiredDependencies);
                    assert.strictEqual(iExpectedRequireCalls, 2, "require was not called further on the desired dependencies");

                    // ***** create another one
                    fnBarAdapter = function (oSystem, sParameter) {
                        //start();
                        // simple check if the given system is the logon system
                        assert.strictEqual(oSystem.getPlatform(), "local");
                        assert.strictEqual(oSystem.getAlias(), "");
                        assert.strictEqual(sParameter, undefined);
                    };
                    return Container.getServiceAsync("Bar", undefined);
                }).then(function (oBarService3) {
                    assert.notStrictEqual(oBarService3, oBarServiceBackup,
                        "new instance for different parameter");

                    var iExpectedRequireCalls = getExpectedRequireCalls(oRequireStub, oExpectedRequiredDependencies);
                    assert.strictEqual(iExpectedRequireCalls, 4, "require was called four times on the desired dependencies");
                    oRequireStub.restore();
                    done();
                });
            });

        function getExpectedRequireCalls (oRequireStub, oExpectedRequiredDependencies) {
            return oRequireStub.getCalls().filter(function (oCall) {
                var aRequiredDependencies = oCall.args[0];
                if (Array.isArray(aRequiredDependencies)) {
                    return aRequiredDependencies.every(function (sDependency) {
                        return oExpectedRequiredDependencies[sDependency];
                    });
                }
                return oExpectedRequiredDependencies[aRequiredDependencies];
            }).length;
        }
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("getService with custom name", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            assert.throws(function () {
                Container.getService("acme.foo.bar.MyService");
            }, /Unsupported service name/);
            done();
        });
    });

    QUnit.test("getServiceAsync with custom name", function (assert) {
        var done = assert.async();
        Container.init("local")
            .then(function () {
                assert.throws(function () {
                    Container.getServiceAsync("acme.foo.bar.MyService");
                }, /Unsupported service name/);
                done();
            });
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("createAdapter (for remote system)", function (assert) {
        var done = assert.async();

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oFooSystem = new System({ platform: "foo" });

            // use virtual Bar service for testing service creation with remote adapter
            var fnFakeLocalAdapter = function (oSystem, sParameter) {
                // simple check if the given system is the logon system
                assert.strictEqual(oSystem.getPlatform(), "local");
                assert.strictEqual(oSystem.getAlias(), "");
                assert.strictEqual(sParameter, "parameter");
            };

            var fnFakeBarAdapter = function (oSystem, sParameter) {
                assert.strictEqual(oSystem, oFooSystem);
                assert.strictEqual(sParameter, "parameter");
            };

            var fnService = function (oServiceAdapter, oContainerInterface, sParameter) {
                var oPromise;

                // code under test
                assert.throws(function () {
                    oContainerInterface.createAdapter();
                }, /Missing system/);
                oPromise = oContainerInterface.createAdapter(oFooSystem);

                assert.strictEqual(typeof oPromise.done, "function",
                    "createAdapter() returned a jQuery promise");
                assert.strictEqual(oPromise.resolve, undefined,
                    "createAdapter() does not return the jQuery deferred object itself");
            };
            fnService.hasAdapter = false;


            var fnOriginalRequire = sap.ui.require;
            var fnRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (modules, handler) {
                if (Array.isArray(modules) && modules[0] === "sap/ushell/adapters/local/BarAdapter") {
                    return handler(fnFakeLocalAdapter);
                } else if (Array.isArray(modules) && modules[0] === "sap/ushell/adapters/foo/BarAdapter") {
                    return handler(fnFakeBarAdapter);
                } else if (modules === "sap/ushell/adapters/local/BarAdapter") {
                    return fnFakeLocalAdapter;
                } else if (modules === "sap/ushell/adapters/foo/BarAdapter") {
                    return fnFakeBarAdapter;
                }
                return fnOriginalRequire(modules, handler);
            });

            var fnOriginalRequireSync = sap.ui.requireSync;
            var fnRequireSyncStub = sandbox.stub(sap.ui, "requireSync").callsFake(function (modules) {
                if (modules === "sap/ushell/adapters/local/BarAdapter") {
                    return fnFakeLocalAdapter;
                } else if (modules === "sap/ushell/adapters/foo/BarAdapter") {
                    return fnFakeBarAdapter;
                } else if (modules === "sap/ushell/services/Bar") {
                    return fnService;
                }
                return fnOriginalRequireSync(modules);
            });

            Container.getService("Bar", "parameter");
            fnRequireStub.restore();
            fnRequireSyncStub.restore();
            done();
        });
    });

    QUnit.test("getLogonSystem", function (assert) {
        var done = assert.async();
        var oSystem = new System({ alias: "", platform: "local" });

        Container.init(oSystem.getPlatform())
            .then(function () {
                const oSystemAfterBootstrap = Container.getLogonSystem();

                assert.ok(oSystemAfterBootstrap instanceof System);
                assert.strictEqual(oSystem.getAlias(), oSystemAfterBootstrap.getAlias());
                assert.strictEqual(oSystem.getBaseUrl(), oSystemAfterBootstrap.getBaseUrl());
                assert.strictEqual(oSystem.getClient(), oSystemAfterBootstrap.getClient());
                assert.strictEqual(oSystem.getName(), oSystemAfterBootstrap.getName());
                assert.strictEqual(oSystem.getPlatform(), oSystemAfterBootstrap.getPlatform());
                done();
            });
    });

    QUnit.test("getUser", function (assert) {
        var done = assert.async();
        var oSystem = new System({ alias: "", platform: "local" }),
            oUser;

        Container.init(oSystem.getPlatform())
            .then(function () {
                oUser = Container.getUser();
                assert.ok(oUser instanceof User);
                done();
            });
    });

    QUnit.test("addRemoteSystem", function (assert) {
        var done = assert.async();
        Container.init("local")
            .then(function () {
                var oSystem = new System({
                        alias: "test",
                        platform: "dummy",
                        baseUrl: "/baseUrl"
                    }),
                    oChangedSystem = new System({
                        alias: "test",
                        platform: "foo",
                        baseUrl: "/bar"
                    });

                Container.addRemoteSystem(oSystem);
                Container.addRemoteSystem(oSystem);
                assert.ok(ushellUtils.localStorageSetItem.calledOnce, "localStorageSetItem called once");
                assert.ok(ushellUtils.localStorageSetItem.calledWithExactly(
                    "sap.ushell.Container.local.remoteSystem.test",
                    oSystem
                ), "localStorageSetItem called with right arguments");

                ushellUtils.localStorageSetItem.reset();
                Container.addRemoteSystem(oChangedSystem);
                Container.addRemoteSystem(oChangedSystem);
                assert.ok(ushellUtils.localStorageSetItem.calledOnce, "localStorageSetItem called once");
                assert.ok(ushellUtils.localStorageSetItem.calledWithExactly(
                    "sap.ushell.Container.local.remoteSystem.test",
                    oChangedSystem
                ), "localStorageSetItem called with right arguments");

                done();
            });
    });

    QUnit.test("addRemoteSystemForServiceUrl(sServiceUrl)", function (assert) {
        var done = assert.async();

        /**
         * Perform some checks for a valid sample URL.
         *
         * @param {string} sAlias
         *   the expected system alias
         * @param {string} sPlatform
         *   the expected system platform
         * @param {string} sUrl
         *   the valid sample URL
         */
        function check (sAlias, sPlatform, sUrl) {
            var oSystemData = {
                alias: sAlias,
                baseUrl: ";o=",
                platform: sPlatform
            };
            Container.addRemoteSystem.reset();

            // code under test
            Container.addRemoteSystemForServiceUrl(sUrl);

            assert.ok(Container.addRemoteSystem.calledOnce, "valid URL: " + sUrl);
            assert.deepEqual(JSON.parse(Container.addRemoteSystem.args[0][0].toString()),
                oSystemData, "URL: " + sUrl); // test does not rely on order of properties
        }

        Container.init("local")
            .then(function () {
                sandbox.stub(Container, "addRemoteSystem");

                // Note: we assume that OData service URLs do not contain a fragment part!

                // unsupported URLs
                [
                    undefined,
                    "",
                    "http://sap.com:1234/sap/hana",
                    "//sap.com:1234/sap/hana",
                    // missing ;o=
                    "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/Pages/$count",
                    // segment parameter inside URL parameters
                    "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/Pages/$count?$format=json;o=FOO",
                    // platform cannot be detected
                    "/sap/foo/odata/UI2/PAGE_BUILDER_PERS;o=FOO/Pages/$count"
                ].forEach(function (sUrl) {
                    Container.addRemoteSystemForServiceUrl(sUrl);
                    assert.ok(!Container.addRemoteSystem.called,
                        Container.addRemoteSystem.printf("unsupported URL: %*%C", sUrl));
                });

                // valid ABAP sample URLs
                // Dynamic Tile from local catalog pointing to some remote system via its data URL
                check("FOO", "abap", "/sap/opu/odata/UI2/PAGE_BUILDER_PERS;o=FOO/Pages/$count");

                // valid HANA sample URLs
                [
                    // mock Lumira Story List, maybe from a remote catalog
                    "/sap/bi/launchpad/v3.xsodata;o=BAR/Items/$count",
                    // any /sap/hana/... URL
                    "/sap/hana/apps/foo;o=BAR/Items/$count",
                    // segment parameter within "platform prefix"
                    "/sap;o=BAR/hana/apps/foo/Items/$count",
                    // segment parameter within "platform prefix"
                    "/sap/hana;o=BAR/apps/foo/Items/$count",
                    // segment parameter at the end
                    "/sap/hana/apps/foo/Items/$count;o=BAR",
                    // multiple segment parameters
                    "/sap/hana/apps/foo;o=BAR;foo=bar/Items/$count",
                    // segment parameter just before URL parameters
                    "/sap/hana/apps/foo/Items/$count;o=BAR?$format=json",
                    // mock KPI Tile, maybe from a remote catalog
                    "/sap/hba/apps/kpi/s/odata/hana_chip_catalog.xsodata;o=BAR/Catalogs/$count"
                ].forEach(check.bind(null, "BAR", "hana"));

                // legacy HANA support --> system alias "hana" as fallback
                [
                    "/sap/bi/launchpad/v3.xsodata/Items/$count",
                    "/sap/hana/apps/foo/Items/$count",
                    "/sap/hba/apps/kpi/s/odata/hana_chip_catalog.xsodata/Catalogs/$count"
                ].forEach(check.bind(null, "hana", "hana"));
                done();
            });
    });
    //TODO do not overwrite existing system (i.e. do not overwrite "real" platform with a
    //     heuristically detected platform)?

    QUnit.test("sap.ushell.Container#addRemoteSystemForServiceUrl", function (assert) {
        var done = assert.async();
        var sUrl = "/foo";

        Container.init("local")
            .then(function () {
                sandbox.stub(Container, "addRemoteSystemForServiceUrl");

                // simulate published event
                EventBus.getInstance().publish("sap.ushell.Container", "addRemoteSystemForServiceUrl", sUrl);

                assert.ok(Container.addRemoteSystemForServiceUrl.calledWithExactly(sUrl));
                done();
            });
    });

    QUnit.test("addRemoteSystem: don't add local system", function (assert) {
        var done = assert.async();
        Container.init("local")
            .then(function () {
                var sBaseUrl = new URI(window.location.href).origin();
                var oLogonSystem = Container.getLogonSystem();
                var sClient = oLogonSystem.getClient();

                var oSystem = new System({
                    alias: "LOCAL",
                    platform: "dummy",
                    baseUrl: "/baseUrl"
                }),
                oSystemwithLowCase = new System({
                    alias: "local",
                    platform: "dummy",
                    baseUrl: "/baseUrl"
                }),
                oSystemWithAbsoluteUrl = new System({
                    alias: sBaseUrl + "?sap-client=" + sClient,
                    baseUrl: sBaseUrl,
                    platform: "dummy",
                    client: sClient
                });

                Container.addRemoteSystem(oSystem);
                Container.addRemoteSystem(oSystemwithLowCase);
                Container.addRemoteSystem(oSystemWithAbsoluteUrl);

                assert.ok(!ushellUtils.localStorageSetItem.notCalled, "local system should not be added as remote system");
                done();
            });
    });

    QUnit.test("_getRemoteSystems", function (assert) {
        var done = assert.async();
        var oSystemData = {
            alias: "test",
            platform: "dummy",
            baseUrl: "/baseUrl"
        };
        var oSystemData2 = {
                alias: "test2",
                platform: "dummy2",
                baseUrl: "/baseUrl2"
            };

        var oLocalStorage = mockLocalStorage({
                foo: "bar",
                "sap.ushell.Container.local.remoteSystem.test": JSON.stringify(oSystemData),
                bar: "baz",
                "sap.ushell.Container.local.remoteSystem.test2": JSON.stringify(oSystemData2)
            });
        Container.reset();
        Container.init("local")
            .then(function () {
                var mSystems;

                mSystems = Container._getRemoteSystems();

                assert.ok(oLocalStorage.getItem.calledWith("sap.ushell.Container.local.remoteSystem.test"),
                    "checked test in localStorage");
                assert.ok(oLocalStorage.getItem.calledWith("sap.ushell.Container.local.remoteSystem.test2"),
                    "checked test2 in localStorage");

                assert.ok(mSystems, "mSystems defined");
                assert.ok(mSystems[oSystemData.alias], "contains key " + oSystemData.alias);
                assert.strictEqual(mSystems[oSystemData.alias].getAlias(), oSystemData.alias, "same alias");
                assert.strictEqual(mSystems[oSystemData.alias].getPlatform(), oSystemData.platform,
                    "same platform");
                assert.strictEqual(mSystems[oSystemData.alias].getBaseUrl(), oSystemData.baseUrl,
                    "same baseUrl");
                assert.ok(mSystems[oSystemData2.alias], "contains key " + oSystemData2.alias);
                assert.strictEqual(mSystems[oSystemData2.alias].getAlias(), oSystemData2.alias, "same alias");
                assert.strictEqual(mSystems[oSystemData2.alias].getPlatform(), oSystemData2.platform,
                    "same platform");
                assert.strictEqual(mSystems[oSystemData2.alias].getBaseUrl(), oSystemData2.baseUrl,
                    "same baseUrl");
                done();
            });
    });

    QUnit.test("logout(): simple case", function (assert) {
        var done = assert.async();
        var fnLogoutSpy;
        var oContainerAdapter;
        var fakeContainerAdapter = function (system) {
            if (!oContainerAdapter) {
                oContainerAdapter = new ContainerAdapter(system);
            }
            fnLogoutSpy = sandbox.spy(oContainerAdapter, "logout");
            return oContainerAdapter;
        };
        const fnCallRegisteredLogoutHandlersSpy = sandbox.spy(Container, "callRegisteredLogoutHandlers");

        var fnOriginalRequire = sap.ui.require;
        var fnRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (modules, handler) {
            if (Array.isArray(modules) && modules[0] === "sap/ushell/adapters/local/ContainerAdapter") {
                handler(fakeContainerAdapter);
            } else if (modules === "sap/ushell/adapters/local/ContainerAdapter") {
                return fakeContainerAdapter;
            }
            return fnOriginalRequire(modules, handler);
        });
        mockLocalStorage();
        Container.reset();
        Container.init("local")
            .then(function () {
                Container.defaultLogout().done(function () {
                    assert.ok(oContainerAdapter.logout.calledOnce, "Logut was called exactly once on the adapter");
                    assert.ok(oContainerAdapter.logout.calledWith(true), "logout() called with correct arguments on adapter");
                    assert.strictEqual(fnCallRegisteredLogoutHandlersSpy.callCount, 1, "callRegisteredLogoutHandlers was called exactly once");
                    assert.strictEqual(Container.logout, Container.defaultLogout, "logout is redirecting to defaultLogout even after registering a custom logout handler");
                    fnRequireStub.restore();
                    fnLogoutSpy.restore();
                    fnCallRegisteredLogoutHandlersSpy.restore();
                    done();
                });
            });
    });

    QUnit.test("test registerLogout", async (assert) => {
        await Container.init("local");

        const fnCustomLogout = sandbox.spy(async () => {
            return true;
        });

        const bFirstRegisterSuccessful = Container.registerLogout(fnCustomLogout);
        const bSecondRegisterSuccessful = Container.registerLogout(fnCustomLogout);

        assert.strictEqual(bFirstRegisterSuccessful, true, "First register successful");
        assert.strictEqual(bSecondRegisterSuccessful, false, "Second register unsuccessful");

        await Container.callRegisteredLogoutHandlers();
        assert.strictEqual(fnCustomLogout.callCount, 1, "Custom logout handler called once");
    });

    QUnit.test("test deRegisterLogout", async (assert) => {
        await Container.init("local");

        const fnCustomLogout = sandbox.spy(async () => {
            return true;
        });

        const bRegisterLogoutResponse = Container.registerLogout(fnCustomLogout);
        assert.strictEqual(bRegisterLogoutResponse, true, "Logout handler registered successfully");
        assert.strictEqual(Container.isLogoutRegistered(fnCustomLogout), true, "Logout handler is registered");

        const bFirstDeRegisterLogoutResponse = Container.deRegisterLogout(fnCustomLogout);
        const bSecondDeRegisterLogoutResponse = Container.deRegisterLogout(fnCustomLogout);
        assert.strictEqual(bFirstDeRegisterLogoutResponse, true, "Logout handler de-registered successfully");
        assert.strictEqual(bSecondDeRegisterLogoutResponse, false, "Logout handler de-registration unsuccessful because it was already removed");
        assert.strictEqual(Container.isLogoutRegistered(fnCustomLogout), false, "Logout handler is not registered");
    });

    QUnit.test("logout(): simple federated case", function (assert) {
        var done = assert.async();
        var oLocalStorage = mockLocalStorage();

        var oContainerAdapter;
        var fakeLocalContainerAdapter = function (system) {
            if (!oContainerAdapter) {
                oContainerAdapter = new ContainerAdapter(system);
            }
            sandbox.spy(oContainerAdapter, "logout");
            return oContainerAdapter;
        };

        var aFooContainerAdapter = [];
        var fnFooContainerAdapter = function (oSystem, sParameter) {
            aFooContainerAdapter.push(new ContainerAdapter(oSystem));
            sandbox.stub(aFooContainerAdapter[aFooContainerAdapter.length - 1], "logout").callsFake(function () {
                return new jQuery.Deferred().resolve().promise();
            });
            return aFooContainerAdapter[aFooContainerAdapter.length - 1];
        };

        var fnOriginalRequire = sap.ui.require;
        var fnRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (modules, handler) {
            if (Array.isArray(modules) && modules[0] === "sap/ushell/adapters/local/ContainerAdapter") {
                handler(fakeLocalContainerAdapter);
            } else if (Array.isArray(modules) && modules[0] === "sap/ushell/adapters/foo/ContainerAdapter") {
                handler(fnFooContainerAdapter);
            } else if (modules === "sap/ushell/adapters/local/ContainerAdapter") {
                return fakeLocalContainerAdapter;
            } else if (modules === "sap/ushell/adapters/foo/ContainerAdapter") {
                return fnFooContainerAdapter;
            }
            return fnOriginalRequire(modules, handler);
        });

        var fnRequireSyncStub = sandbox.stub(sap.ui, "requireSync").callsFake(function (modules, handler) {
            if (modules === "sap/ushell/adapters/foo/ContainerAdapter") {
                return fnFooContainerAdapter;
            }
        });

        Container.reset();
        Container.init("local")
            .then(function () {
                var oSystemData = {
                    alias: "test",
                    platform: "foo",
                    baseUrl: "/baseUrl"
                };
                var oSystemData2 = {
                    alias: "test2",
                    platform: "foo",
                    baseUrl: "/baseUrl2"
                };

                sandbox.stub(Container, "_getRemoteSystems").callsFake(function () {
                    var mRemoteSystems = {};
                    mRemoteSystems[oSystemData.alias] = new System(oSystemData);
                    mRemoteSystems[oSystemData2.alias] = new System(oSystemData2);
                    return mRemoteSystems;
                });

                // code under test
                Container.logout().done(function () {
                    assert.ok(Container._getRemoteSystems.calledOnce);
                    assert.ok(aFooContainerAdapter[0].logout.calledWith(false), "first foo adapter logged out as remote system");
                    assert.ok(aFooContainerAdapter[1].logout.calledWith(false), "second foo adapter logged out as remote system");
                    assert.ok(oContainerAdapter.logout.calledOnce);
                    assert.ok(oContainerAdapter.logout.calledWith(true));
                    assert.ok(oContainerAdapter.logout.calledAfter(aFooContainerAdapter[0].logout));
                    assert.ok(oContainerAdapter.logout.calledAfter(aFooContainerAdapter[1].logout));
                    assert.ok(oLocalStorage.removeItem.calledWith("sap.ushell.Container.local.remoteSystem.test"));
                    assert.ok(oLocalStorage.removeItem.calledWith("sap.ushell.Container.local.remoteSystem.test2"));
                    assert.ok(oLocalStorage.setItem.calledWith("sap.ushell.Container.local.sessionTermination", "pending"));
                    assert.ok(oLocalStorage.removeItem.calledWith("sap.ushell.Container.local.sessionTermination"));
                    fnRequireStub.restore();
                    fnRequireSyncStub.restore();
                    done();
                });
            });
    });

    QUnit.test("logout(): federated case, addFurtherRemoteSystems success", function (assert) {
        var done = assert.async();
        mockLocalStorage();

        var oContainerAdapter;
        var fakeContainerAdapter = function (system) {
            if (!oContainerAdapter) {
                oContainerAdapter = new ContainerAdapter(system);
            }
            sandbox.spy(oContainerAdapter, "logout");
            return oContainerAdapter;
        };

        var fnOriginalRequire = sap.ui.require;
        var fnRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (modules, handler) {
            if (Array.isArray(modules) && modules[0] === "sap/ushell/adapters/local/ContainerAdapter") {
                handler(fakeContainerAdapter);
            } else if (modules === "sap/ushell/adapters/local/ContainerAdapter") {
                return fakeContainerAdapter;
            }
            return fnOriginalRequire(modules, handler);
        });

        Container.reset();
        Container.init("local")
            .then(function () {
                oContainerAdapter.addFurtherRemoteSystems = sandbox.spy(function () {
                    return new jQuery.Deferred().resolve().promise();
                });
                sandbox.stub(Container, "_getRemoteSystems").returns({});

                // code under test
                Container.logout().done(function () {
                    assert.ok(oContainerAdapter.addFurtherRemoteSystems.calledOnce);
                    assert.ok(oContainerAdapter.addFurtherRemoteSystems.calledBefore(oContainerAdapter.logout));
                    assert.ok(oContainerAdapter.addFurtherRemoteSystems.calledBefore(Container._getRemoteSystems));
                    assert.ok(oContainerAdapter.logout.calledOnce);
                    assert.ok(oContainerAdapter.logout.calledWith(true));

                    fnRequireStub.restore();
                    done();
                });
            });
    });

    QUnit.test("logout(): federated case, error in createAdapter", function (assert) {
        var done = assert.async();
        mockLocalStorage();

        var oContainerAdapter;
        var fakeContainerAdapter = function (system) {
            if (!oContainerAdapter) {
                oContainerAdapter = new ContainerAdapter(system);
            }
            sandbox.spy(oContainerAdapter, "logout");
            return oContainerAdapter;
        };

        var fnOriginalRequire = sap.ui.require;
        var fnRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (modules, handler) {
            if (Array.isArray(modules) && modules[0] === "sap/ushell/adapters/local/ContainerAdapter") {
                handler(fakeContainerAdapter);
            } else if (modules === "sap/ushell/adapters/local/ContainerAdapter") {
                return fakeContainerAdapter;
            }
            return fnOriginalRequire(modules, handler);
        });

        Container.reset();
        Container.init("local")
            .then(function () {
                var oSystem = new System({
                    alias: "test",
                    platform: "bar",
                    baseUrl: "/baseUrl"
                });

                sandbox.stub(Container, "_getRemoteSystems").returns({ test: oSystem });

                // code under test
                Container.logout().done(function () {
                    assert.ok(oContainerAdapter.logout.calledOnce);
                    assert.ok(oContainerAdapter.logout.calledWith(true));
                    fnRequireStub.restore();
                    done();
                });
            });
    });

    QUnit.test("logout(): federated case, addFurtherRemoteSystems failure", function (assert) {
        var done = assert.async();
        mockLocalStorage();

        var oContainerAdapter;
        var fakeContainerAdapter = function (system) {
            if (!oContainerAdapter) {
                oContainerAdapter = new ContainerAdapter(system);
            }
            sandbox.spy(oContainerAdapter, "logout");
            return oContainerAdapter;
        };

        var fnOriginalRequire = sap.ui.require;
        var fnRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (modules, handler) {
            if (Array.isArray(modules) && modules[0] === "sap/ushell/adapters/local/ContainerAdapter") {
                handler(fakeContainerAdapter);
            } else if (modules === "sap/ushell/adapters/local/ContainerAdapter") {
                return fakeContainerAdapter;
            }
            return fnOriginalRequire(modules, handler);
        });

        Container.reset();
        Container.init("local")
            .then(function () {
                oContainerAdapter.addFurtherRemoteSystems = sandbox.spy(function () {
                    return new jQuery.Deferred().reject("oops").promise();
                });

                sandbox.stub(Container, "_getRemoteSystems").returns({});

                // code under test
                Container.logout().done(function () {
                    assert.ok(oContainerAdapter.addFurtherRemoteSystems.calledOnce);
                    assert.ok(oContainerAdapter.addFurtherRemoteSystems
                        .calledBefore(oContainerAdapter.logout));
                    assert.ok(oContainerAdapter.addFurtherRemoteSystems
                        .calledBefore(Container._getRemoteSystems));
                    assert.ok(oContainerAdapter.logout.calledOnce);
                    assert.ok(oContainerAdapter.logout.calledWith(true));
                    fnRequireStub.restore();
                    done();
                });
            });
    });

    function prepareODataSuspend (iSeconds) {
        var sUrl = "/sap/opu/odata/UI2/PAGE_BUILDER_CUST/";
        var oResult = {
            fnRead: sandbox.spy(OData, "read"),
            fnRequest: sandbox.spy(OData, "request"),
            fnError: sandbox.spy(),
            oRead: {},
            oRequest: {},
            sUrl: sUrl
        };
        var oSystemData = {
            alias: "test",
            platform: "foo",
            baseUrl: "/baseUrl"
        };

        var oUshellFoo = ObjectPath.create("sap.ushell.foo");
        oUshellFoo.ContainerAdapter = function () {
            this.logout = sandbox.spy(function () {
                var oFederatedLogout = new jQuery.Deferred();

                function nop () {
                    return;
                }

                // OData requests issued here: AFTER OData is disabled,
                // BEFORE remote logout is resolved
                oResult.oRead = OData.read(sUrl, nop, oResult.fnError);
                oResult.oRequest = OData.request({
                    requestUri: sUrl,
                    method: "GET"
                }, nop, oResult.fnError);
                setTimeout(function () {
                    oFederatedLogout.resolve();
                }, iSeconds * 1000);
                oResult.clock.tick(iSeconds * 1000);
                return oFederatedLogout.promise();
            });
        };

        sandbox.stub(Container, "_getRemoteSystems").callsFake(function () {
            var mRemoteSystems = {};
            mRemoteSystems[oSystemData.alias] = new System(oSystemData);
            return mRemoteSystems;
        });
        oResult.clock = sandbox.useFakeTimers();
        return oResult;
    }

    QUnit.test("logout(): suspend OData.read() .request() + no error handler called", function (assert) {
        var done = assert.async();
        mockLocalStorage();

        var oContainerAdapter;
        var fakeContainerAdapter = function (system) {
            if (!oContainerAdapter) {
                oContainerAdapter = new ContainerAdapter(system);
            }
            sandbox.spy(oContainerAdapter, "logout");
            return oContainerAdapter;
        };

        var fnOriginalRequire = sap.ui.require;
        var fnRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (modules, handler) {
            var oUshellFoo = ObjectPath.get("sap.ushell.foo");
            if (Array.isArray(modules) && modules[0] === "sap/ushell/adapters/local/ContainerAdapter") {
                handler(fakeContainerAdapter);
            } else if (Array.isArray(modules) && modules[0] === "sap/ushell/adapters/foo/ContainerAdapter") {
                handler(oUshellFoo.ContainerAdapter);
            } else if (modules === "sap/ushell/adapters/local/ContainerAdapter") {
                return fakeContainerAdapter;
            } else if (modules === "sap/ushell/adapters/foo/ContainerAdapter") {
                return oUshellFoo.ContainerAdapter;
            }
            return fnOriginalRequire(modules, handler);
        });

        var fnRequireSyncStub = sandbox.stub(sap.ui, "requireSync").callsFake(function (module) {
            var oUshellFoo = ObjectPath.get("sap.ushell.foo");
            if (module === "sap/ushell/adapters/local/ContainerAdapter") {
                return fakeContainerAdapter;
            } else if (module === "sap/ushell/adapters/foo/ContainerAdapter") {
                return oUshellFoo.ContainerAdapter;
            }
            return undefined;
        });

        Container.reset();
        Container.init("local")
            .then(function () {
                var nLogCount = 0;
                var sLogMessage = "disabled during logout processing";
                var oLogListener = {
                    onLogEntry: function (oLogEntry) {
                        if (oLogEntry.message.indexOf(sLogMessage) !== -1 && oLogEntry.component === "sap.ushell.Container") {
                            nLogCount++;
                        }
                    }
                };
                Log.setLevel(4, "sap.ushell.Container");
                Log.addLogListener(oLogListener);

                var oVerify = prepareODataSuspend(1);
                // code under test
                Container.logout().done(function () {
                    oVerify.clock.restore(); // Note: do this BEFORE start()!
                    assert.ok(!oVerify.fnRead.called, "Original OData read not called");
                    assert.ok(!oVerify.fnRequest.called, "Original OData request not called");
                    assert.ok(oVerify.oRead && typeof oVerify.oRead.abort === "function", "OData.read() returns abort function");
                    assert.ok(oVerify.oRequest && typeof oVerify.oRequest.abort === "function", "OData.request() returns abort function");
                    assert.ok(!oVerify.fnError.called, "Error handler NOT called");
                    assert.strictEqual(nLogCount, 2, "Two error messages issued");

                    fnRequireStub.restore();
                    fnRequireSyncStub.restore();
                    Log.removeLogListener(oLogListener);

                    delete sap.ushell.foo;
                    done();
                });
            });
    });

    QUnit.test("logout(): OData.read() .request() error handler called after delay", function (assert) {
        var done = assert.async();

        mockLocalStorage();

        var oContainerAdapter;
        var fakeContainerAdapter = function (system) {
            if (!oContainerAdapter) {
                oContainerAdapter = new ContainerAdapter(system);
            }
            sandbox.spy(oContainerAdapter, "logout");
            return oContainerAdapter;
        };

        var fnOriginalRequire = sap.ui.require;
        var fnRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (modules, handler) {
            var oUshellFoo = ObjectPath.get("sap.ushell.foo");
            if (Array.isArray(modules) && modules[0] === "sap/ushell/adapters/local/ContainerAdapter") {
                handler(fakeContainerAdapter);
            } else if (Array.isArray(modules) && modules[0] === "sap/ushell/adapters/foo/ContainerAdapter") {
                handler(oUshellFoo.ContainerAdapter);
            } else if (modules === "sap/ushell/adapters/local/ContainerAdapter") {
                return fakeContainerAdapter;
            } else if (modules === "sap/ushell/adapters/foo/ContainerAdapter") {
                return oUshellFoo.ContainerAdapter;
            }
            return fnOriginalRequire(modules, handler);
        });

        var fnRequireSyncStub = sandbox.stub(sap.ui, "requireSync").callsFake(function (module) {
            var oUshellFoo = ObjectPath.get("sap.ushell.foo");
            if (module === "sap/ushell/adapters/local/ContainerAdapter") {
                return fakeContainerAdapter;
            } else if (module === "sap/ushell/adapters/foo/ContainerAdapter") {
                return oUshellFoo.ContainerAdapter;
            }
            return undefined;
        });

        Container.reset();
        Container.init("local")
            .then(function () {
                var oVerify = prepareODataSuspend(6);
                // code under test
                Container.logout().done(function () {
                    oVerify.clock.restore(); // Note: do this BEFORE start()!
                    assert.ok(oVerify.fnError.calledWith("OData.read('" + oVerify.sUrl + "') disabled during logout processing"), "Error Handler called the right way.");
                    assert.ok(oVerify.fnError.calledWith("OData.request('" + oVerify.sUrl + "') disabled during logout processing"), "Error Handler called the right way.");
                    fnRequireStub.restore();
                    fnRequireSyncStub.restore();

                    delete sap.ushell.foo;
                    done();
                });
            });
    });

    QUnit.test("logout(): Event Notification: pending + redirect", function (assert) {
        var done = assert.async();

        var oContainerAdapter;
        var fakeContainerAdapter = function (system) {
            if (!oContainerAdapter) {
                oContainerAdapter = new ContainerAdapter(system);
            }
            oContainerAdapter.logoutRedirect = sandbox.stub();
            return oContainerAdapter;
        };

        var fnOriginalRequire = sap.ui.require;
        var fnRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (modules, handler) {
            if (Array.isArray(modules) && modules[0] === "sap/ushell/adapters/local/ContainerAdapter") {
                return handler(fakeContainerAdapter);
            } else if (modules === "sap/ushell/adapters/local/ContainerAdapter") {
                return fakeContainerAdapter;
            }
            return fnOriginalRequire(modules, handler);
        });

        Container.init("local")
            .then(function () {
                var oEvent = document.createEvent("StorageEvent"),
                    sUrl = "/sap/opu/odata/UI2/PAGE_BUILDER_CUST/",
                    fnRead = sandbox.spy(OData, "read"),
                    fnRequest = sandbox.spy(OData, "request"),
                    fnError = sandbox.spy(),
                    bPreventDefault = false,
                    fnListener = sandbox.spy(function (oEvent0) {
                        if (bPreventDefault) {
                            oEvent0.preventDefault();
                        }
                    });

                function nop () {
                    return;
                }

                oEvent.initStorageEvent("storage", false, false,
                    "sap.ushell.Container.local.sessionTermination", "", "pending", "", null);

                sandbox.stub(Container, "_closeWindow");
                sandbox.stub(Container, "_redirectWindow");

                // code under test
                Container.attachLogoutEvent(fnListener);
                dispatchEvent(oEvent);
                OData.read(sUrl, nop, fnError);
                OData.request({
                    requestUri: sUrl,
                    method: "GET"
                }, nop, fnError);
                assert.ok(!fnRead.called, "oData.Read not called");
                assert.ok(!fnRequest.called, "oData.Request not called");
                assert.ok(!fnError.called, "Error handler not called");
                assert.ok(Container._closeWindow.called, "closeWindow called sync. because of missing preventDefault");

                fnListener.reset();
                Container._closeWindow.reset();
                bPreventDefault = true;
                // code under test (with preventDefault)
                dispatchEvent(oEvent);
                window.setTimeout(function () {
                    assert.ok(fnListener.callCount === 1, "listener called once");
                    assert.ok(Container._closeWindow.called, "closeWindow called deferred");
                    assert.ok(Container._redirectWindow.called, "redirectWindow called");
                    fnRequireStub.restore();
                    done();
                }, 2000);
            });
    });

    QUnit.test("logout(): logout event registration", function (assert) {
        var done = assert.async();
        mockLocalStorage();

        var oContainerAdapter;
        var fakeContainerAdapter = function (system) {
            if (!oContainerAdapter) {
                oContainerAdapter = new ContainerAdapter(system);
            }
            return oContainerAdapter;
        };
        var fnOriginalRequire = sap.ui.require;
        var fnRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (modules, handler) {
            if (Array.isArray(modules) && modules[0] === "sap/ushell/adapters/local/ContainerAdapter") {
                return handler(fakeContainerAdapter);
            } else if (modules === "sap/ushell/adapters/local/ContainerAdapter") {
                return fakeContainerAdapter;
            }
            return fnOriginalRequire(modules, handler);
        });

        Container.reset();
        Container.init("local")
            .then(function () {
                var bPreventDefault = false,
                    fnListener = sandbox.spy(function (oEvent0) {
                        if (bPreventDefault) {
                            oEvent0.preventDefault();
                        }
                    });

                // code under test (deregistration)
                Container.attachLogoutEvent(fnListener);
                Container.detachLogoutEvent(fnListener);
                Container.logout().done(function () {
                    assert.ok(fnListener.callCount === 0, "listener not called");
                    Container.attachLogoutEvent(fnListener);
                    // code under test (registration)
                    Container.logout().done(function () {
                        //TODO: use FakeTimers
                        //var clock = sandbox.useFakeTimers();
                        //clock.tick(1000);
                        assert.ok(fnListener.callCount === 1, "listener called once");
                        Container.detachLogoutEvent(fnListener);
                        Container.attachLogoutEvent(fnListener);
                        // code under test (listener called twice )
                        Container.logout().done(function () {
                            assert.ok(fnListener.callCount === 2, "listener called twice");
                            fnRequireStub.restore();
                            done();
                        });
                    });
                });
            });
    });

    QUnit.test("logout(): logout async event registration", function (assert) {
        var done = assert.async();
        mockLocalStorage();

        var oContainerAdapter;
        var fakeContainerAdapter = function (system) {
            if (!oContainerAdapter) {
                oContainerAdapter = new ContainerAdapter(system);
            }
            return oContainerAdapter;
        };
        var fnOriginalRequire = sap.ui.require;
        var fnRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (modules, handler) {
            if (Array.isArray(modules) && modules[0] === "sap/ushell/adapters/local/ContainerAdapter") {
                return handler(fakeContainerAdapter);
            } else if (modules === "sap/ushell/adapters/local/ContainerAdapter") {
                return fakeContainerAdapter;
            }
            return fnOriginalRequire(modules, handler);
        });

        Container.reset();
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var iCounter = 0,
                fnAsyncCallback1 = sandbox.spy(function () {
                    var d = new jQuery.Deferred();
                    setTimeout(function () {
                        iCounter++;
                        d.resolve();
                    }, 550);
                    return d.promise();
                }),
                fnAsyncCallback2 = sandbox.spy(function () {
                    var d = new jQuery.Deferred();
                    setTimeout(function () {
                        iCounter++;
                        d.resolve();
                    }, 1100);
                    return d.promise();
                });

            // code under test (deregistration)
            Container.attachLogoutEvent(fnAsyncCallback1, true);
            Container.detachLogoutEvent(fnAsyncCallback1);
            Container.logout().done(function () {
                assert.ok(fnAsyncCallback1.callCount === 0, "listener not called");
                Container.attachLogoutEvent(fnAsyncCallback1, true);
                // code under test (registration)
                Container.logout().done(function () {
                    assert.ok(fnAsyncCallback1.callCount === 1, "listener called once");
                    Container.detachLogoutEvent(fnAsyncCallback1);
                    Container.attachLogoutEvent(fnAsyncCallback1, true);
                    Container.attachLogoutEvent(fnAsyncCallback2, true);
                    iCounter = 0;
                    Container.logout().done(function () {
                        assert.ok(fnAsyncCallback1.callCount === 2, "listener called twice");
                        assert.ok(fnAsyncCallback2.callCount === 1, "listener called once");
                        assert.strictEqual(iCounter, 2, "counter is 2");
                        Container.detachLogoutEvent(fnAsyncCallback1);
                        Container.detachLogoutEvent(fnAsyncCallback2);
                        fnRequireStub.restore();
                        done();
                    });
                });
            });
        });
    });

    QUnit.test("logout(): logout async event registration default timeout", function (assert) {
        var done = assert.async();
        mockLocalStorage();

        var oContainerAdapter;
        var fakeContainerAdapter = function (system) {
            if (!oContainerAdapter) {
                oContainerAdapter = new ContainerAdapter(system);
            }
            return oContainerAdapter;
        };
        var fnOriginalRequire = sap.ui.require;
        var fnRequireStub = sandbox.stub(sap.ui, "require").callsFake(function (modules, handler) {
            if (Array.isArray(modules) && modules[0] === "sap/ushell/adapters/local/ContainerAdapter") {
                return handler(fakeContainerAdapter);
            } else if (modules === "sap/ushell/adapters/local/ContainerAdapter") {
                return fakeContainerAdapter;
            }
            return fnOriginalRequire(modules, handler);
        });

        Container.reset();
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var fnAsyncCallback = sandbox.spy(function () {
                return new jQuery.Deferred().promise();
            });

            Container.attachLogoutEvent(fnAsyncCallback, true);
            Container.logout().done(function () {
                assert.ok(fnAsyncCallback.callCount === 1, "listener not called");
                Container.detachLogoutEvent(fnAsyncCallback);
                fnRequireStub.restore();
                done();
            });
        });
    });

    function globalDirtyInitialize (oItems) {
        return mockLocalStorage(oItems || {
            foo: "INITIAL",
            "sap.ushell.Container.dirtyState.id-1": "INITIAL",
            bar: "INITIAL",
            "sap.ushell.Container.dirtyState.id-2": "INITIAL",
            "sap.ushell.Container.dirtyState.id-3": "INITIAL"
        });
    }

    QUnit.test("getGlobalDirty() with no NWBC windows", function (assert) {
        var done = assert.async();
        globalDirtyInitialize({});
        Container.reset();
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oDeferred = Container.getGlobalDirty();

            oDeferred.fail(testUtils.onError).done(function (oState) {
                assert.strictEqual(oState, Container.DirtyState.CLEAN, "CLEAN");
                // try again
                Container.getGlobalDirty();
                done();
            });
        });
    });

    function globalDirtyFireEvent (sKey, sValue) {
        var oEvent = document.createEvent("StorageEvent");

        oEvent.initStorageEvent("storage", false, false, sKey, "", sValue, "", null);
        dispatchEvent(oEvent);
    }

    QUnit.test("getGlobalDirty() -> DIRTY", function (assert) {
        var done = assert.async();
        globalDirtyInitialize();
        Container.reset();
        Container.init("local")
            .then(function () {
                var oDeferred = Container.getGlobalDirty();
                globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-1", "CLEAN");
                globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-2", "MAYBE_DIRTY");
                globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-3", "DIRTY");

                oDeferred
                    .fail(testUtils.onError)
                    .done(function (oState) {
                        assert.ok(ushellUtils.localStorageSetItem.calledWith("sap.ushell.Container.dirtyState.id-1",
                            "PENDING"));
                        assert.ok(ushellUtils.localStorageSetItem.calledWith("sap.ushell.Container.dirtyState.id-2",
                            "PENDING"));
                        assert.ok(ushellUtils.localStorageSetItem.calledWith("sap.ushell.Container.dirtyState.id-3",
                            "PENDING"));
                        assert.strictEqual(oState, Container.DirtyState.DIRTY, "DIRTY");
                        done();
                    });
            });
    });

    QUnit.test("getGlobalDirty() -> MAYBE_DIRTY", function (assert) {
        var done = assert.async();
        globalDirtyInitialize();
        Container.reset();
        Container.init("local")
            .then(function () {
                var oDeferred = Container.getGlobalDirty();

                globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-1", "CLEAN");
                globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-2", "MAYBE_DIRTY");
                globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-3", "CLEAN");

                oDeferred
                    .fail(testUtils.onError)
                    .done(function (oState) {
                        assert.strictEqual(oState, Container.DirtyState.MAYBE_DIRTY, "MAYBE_DIRTY");
                        done();
                    });
            });
    });

    QUnit.test("getGlobalDirty() -> CLEAN", function (assert) {
        var done = assert.async();
        globalDirtyInitialize();
        Container.reset();
        sap.ushell.bootstrap("local")
            .fail(testUtils.onError)
            .done(function () {
                var oDeferred = Container.getGlobalDirty();

                globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-1", "CLEAN");
                globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-2", "CLEAN");
                globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-3", "CLEAN");

                oDeferred
                    .fail(testUtils.onError)
                    .done(function (oState) {
                        assert.strictEqual(oState, Container.DirtyState.CLEAN, "CLEAN");
                        done();
                    });
            });
    });

    QUnit.test("getGlobalDirty() -> timeout -> cleanup in 2nd call", function (assert) {
        var done = assert.async();
        var oLocalStorage = globalDirtyInitialize();
        Container.reset();
        Container.init("local")
            .then(function () {
                var oClock = sandbox.useFakeTimers(),
                    oDeferred = Container.getGlobalDirty();

                oClock.tick(60000);
                oDeferred
                    .fail(testUtils.onError)
                    .done(function (oState) {
                        assert.strictEqual(oState, Container.DirtyState.MAYBE_DIRTY, "MAYBE_DIRTY");
                        oDeferred = Container.getGlobalDirty();
                        oClock.tick(60000);
                        oDeferred
                            .fail(testUtils.onError)
                            .done(function (oState1) {
                                assert.strictEqual(oState1, Container.DirtyState.CLEAN, "CLEAN");
                                assert.ok(oLocalStorage.removeItem.calledWith("sap.ushell.Container.dirtyState.id-3"));
                                assert.ok(oLocalStorage.removeItem.calledWith("sap.ushell.Container.dirtyState.id-2"));
                                assert.ok(oLocalStorage.removeItem.calledWith("sap.ushell.Container.dirtyState.id-1"));
                                oClock.restore(); // Note: do this BEFORE start()!
                                done();
                            });
                    });
            });
    });

    QUnit.test("getGlobalDirty() -> timeout -> MAYBE_DIRTY", function (assert) {
        var done = assert.async();
        globalDirtyInitialize();
        Container.reset();
        Container.init("local")
            .then(function () {
                var oClock = sandbox.useFakeTimers(),
                    oDeferred = Container.getGlobalDirty();

                globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-1", "CLEAN");
                globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-2", "CLEAN");
                oClock.tick(60000);

                oDeferred
                    .fail(testUtils.onError)
                    .done(function (oState) {
                        assert.strictEqual(oState, Container.DirtyState.MAYBE_DIRTY, "MAYBE_DIRTY");
                        oClock.restore(); // Note: do this BEFORE start()!
                        done();
                    });
            });
    });

    QUnit.test("getGlobalDirty() -> timeout -> DIRTY", function (assert) {
        var done = assert.async();
        globalDirtyInitialize();
        Container.reset();
        Container.init("local")
            .then(function () {
                var oClock = sandbox.useFakeTimers(),
                    oDeferred = Container.getGlobalDirty();

                globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-1", "CLEAN");
                globalDirtyFireEvent("sap.ushell.Container.dirtyState.id-2", "DIRTY");
                oClock.tick(60000);

                oDeferred
                    .fail(testUtils.onError)
                    .done(function (oState) {
                        assert.strictEqual(oState, Container.DirtyState.DIRTY, "DIRTY");

                        assert.ok(ushellUtils.localStorageSetItem.calledWith(
                            "sap.ushell.Container.dirtyState.id-1",
                            "PENDING",
                            true
                        ), "events are sent to local window!");

                        oClock.restore(); // Note: do this BEFORE start()!
                        done();
                    });
            });
    });

    QUnit.test("getGlobalDirty() called twice", function (assert) {
        var done = assert.async();
        globalDirtyInitialize();

        Container.reset();
        Container.init("local")
            .then(function () {
                done();
                // code under test
                Container.getGlobalDirty();
                assert.throws(function () { Container.getGlobalDirty(); },
                    "getGlobalDirty already called!");
            });
    });

    QUnit.test("getGlobalDirty() -> in Safari private browsing mode", function (assert) {
        var done = assert.async();
        var oLocalStorage = mockLocalStorage();
        oLocalStorage.setItem = sandbox.stub().throws("QUOTA_EXCEEDED_ERR");
        Container.reset();
        Container.init("local")
            .then(function () {
                Container.getGlobalDirty().done(function (sResult) {
                    assert.strictEqual(sResult, "MAYBE_DIRTY", "MAYBE_DIRTY");
                    done();
                });
            });
    });

    [{
        testDescription: " frameLogonManager is not set before bootstrap",
        setFrameLogonManager: false
    }, {
        testDescription: " frameLogonManager is set before bootstrap",
        setFrameLogonManager: true,
        sPath: "/some/path",
        iTimeout: 1000,
        expectedPath: "/some/path",
        expectedTimeout: 1000
    }].forEach(function (oFixture) {
        QUnit.test("setXhrLogonTimeout when " + oFixture.testDescription, function (assert) {
            var fnDone = assert.async(),
                oFrameLogonManagerSpy = {
                    setTimeout: sandbox.spy()
                };

                Container.init("local")
                    .then(function () {
                        if (oFixture.setFrameLogonManager) {
                            Container.oFrameLogonManager = oFrameLogonManagerSpy;
                        } else {
                            assert.expect(0);
                        }

                        Container.setXhrLogonTimeout(oFixture.sPath, oFixture.iTimeout);

                        if (oFixture.expectedPath) {
                            assert.strictEqual(oFrameLogonManagerSpy.setTimeout.callCount, 1, "expected that setTimeout was called once");
                            assert.strictEqual(oFrameLogonManagerSpy.setTimeout.args[0][0], oFixture.expectedPath);
                        }
                        if (oFixture.expectedTimeout) {
                            assert.strictEqual(oFrameLogonManagerSpy.setTimeout.args[0][1], oFixture.expectedTimeout);
                        }
                        fnDone();
                    });
        });
    });

    [{
        testDescription: " when no path, no HashFragment and no parameters are present",
        href: "https://www.some.mock.site.com",
        expectedResult: "https://www.some.mock.site.com"
    }, {
        testDescription: " when a path but no HashFragment and no parameters are present",
        href: "https://www.some.mock.site.com/some/path",
        expectedResult: "https://www.some.mock.site.com/some/path"
    }, {
        testDescription: " when a Hash Fragment but no path and no parameters are present",
        href: "https://www.some.mock.site.com#Hash-Fragment",
        expectedResult: "https://www.some.mock.site.com"
    }, {
        testDescription: " when parameters but not Hash Fragment and no path are present",
        href: "https://www.some.mock.site.com?some-parameter=foo",
        expectedResult: "https://www.some.mock.site.com?some-parameter=foo"
    }, {
        testDescription: " when parameters and a hash fragment but no path are present",
        href: "https://www.some.mock.site.com?some-parameter=foo#Hash-Fragment",
        expectedResult: "https://www.some.mock.site.com?some-parameter=foo"
    }, {
        testDescription: " when parameters, a path and a hash fragment are present",
        href: "https://www.some.mock.site.com/some/path?some-parameter=foo#Hash-Fragment",
        expectedResult: "https://www.some.mock.site.com/some/path?some-parameter=foo"
    }, {
        testDescription: " when no path, no HashFragment and no parameters are present",
        href: "https://www.some.mock.site.com",
        expectedResult: "https://www.some.mock.site.com",
        addHash: false
    }, {
        testDescription: " when a path but no HashFragment and no parameters are present",
        href: "https://www.some.mock.site.com/some/path",
        expectedResult: "https://www.some.mock.site.com/some/path",
        addHash: false
    }, {
        testDescription: " when a Hash Fragment but no path and no parameters are present",
        href: "https://www.some.mock.site.com#Hash-Fragment",
        expectedResult: "https://www.some.mock.site.com",
        addHash: false
    }, {
        testDescription: " when parameters but not Hash Fragment and no path are present",
        href: "https://www.some.mock.site.com?some-parameter=foo",
        expectedResult: "https://www.some.mock.site.com?some-parameter=foo",
        addHash: false
    }, {
        testDescription: " when parameters and a hash fragment but no path are present",
        href: "https://www.some.mock.site.com?some-parameter=foo#Hash-Fragment",
        expectedResult: "https://www.some.mock.site.com?some-parameter=foo",
        addHash: false
    }, {
        testDescription: " when parameters, a path and a hash fragment are present",
        href: "https://www.some.mock.site.com/some/path?some-parameter=foo#Hash-Fragment",
        expectedResult: "https://www.some.mock.site.com/some/path?some-parameter=foo",
        addHash: false
    }, {
        testDescription: " when no path, no HashFragment and no parameters are present",
        href: "https://www.some.mock.site.com",
        expectedResult: "https://www.some.mock.site.com",
        addHash: true
    }, {
        testDescription: " when a path but no HashFragment and no parameters are present",
        href: "https://www.some.mock.site.com/some/path",
        expectedResult: "https://www.some.mock.site.com/some/path",
        addHash: true
    }, {
        testDescription: " when a Hash Fragment but no path and no parameters are present",
        href: "https://www.some.mock.site.com#Hash-Fragment",
        expectedResult: "https://www.some.mock.site.com#Hash-Fragment",
        addHash: true
    }, {
        testDescription: " when parameters but not Hash Fragment and no path are present",
        href: "https://www.some.mock.site.com?some-parameter=foo",
        expectedResult: "https://www.some.mock.site.com?some-parameter=foo",
        addHash: true
    }, {
        testDescription: " when parameters and a hash fragment but no path are present",
        href: "https://www.some.mock.site.com?some-parameter=foo#Hash-Fragment",
        expectedResult: "https://www.some.mock.site.com?some-parameter=foo#Hash-Fragment",
        addHash: true
    }, {
        testDescription: " when parameters, a path and a hash fragment are present",
        href: "https://www.some.mock.site.com/some/path?some-parameter=foo#Hash-Fragment",
        expectedResult: "https://www.some.mock.site.com/some/path?some-parameter=foo#Hash-Fragment",
        addHash: true
    }].forEach(function (oFixture) {
        QUnit.test("getFLPUrl returns the proper URL with filtered Hash Fragment when " + oFixture.testDescription, function (assert) {
            // arrange
            var fnDone = assert.async(),
                getLocationHrefStub = sandbox.stub(ushellUtils, "getLocationHref").returns(oFixture.href);

                Container.init("local")
                    .then(function () {
                        var sResult;

                        if (oFixture.addHash) {
                            sResult = Container.getFLPUrl(oFixture.addHash);
                        } else {
                            sResult = Container.getFLPUrl();
                        }

                        assert.ok(getLocationHrefStub.called);
                        assert.strictEqual(sResult, oFixture.expectedResult, "Result equals Expected Result");
                        fnDone();
                    });
        });
    });

    [
        {
            testDescription: " Simple testing landscape no CDM",
            oExpConf: {}
        }
    ].forEach(function (oFixture) {
        QUnit.test("getFLPConfig returns the FLPO configuration in the scope: " + oFixture.testDescription, function (assert) {
            var fnDone = assert.async();

            Container.init("local")
                .then(function () {
                    oFixture.oExpConf.URL = Container.getFLPUrl();
                    Container.getFLPConfig().then(function (oConfig) {
                        assert.ok(oConfig = oFixture.oExpConf, "Result equals Expected Result");
                        fnDone();
                    });
                });
        });
    });

    QUnit.test("createAdapter - Async", function (assert) {
        // Parameters for createAdapter.
        var done = assert.async(),
            oFooSystem = new System({ platform: "foo" }),
            oResponse;

            Container.init("local")
                .then(function () {
                    var sAdapterName = "bar",
                        bPromiseReturned,
                        oFunctionsToTest,
                        sExpectedAdapterName = "sap/ushell/adapters/foo/barAdapter";


                    var fakeBarAdapter = function (system) {
                        return function () {
                            this.sAdapterName = "bar";
                        };
                    };

                    var fnRequireStub = getRequireStub("sap/ushell/adapters/foo/barAdapter", fakeBarAdapter);

                    // expose function to be tested
                    oFunctionsToTest = Container._getFunctionsForUnitTest();

                    // call function
                    oResponse = oFunctionsToTest.createAdapter(sAdapterName, oFooSystem, "", true);

                    // check if promise returned
                    bPromiseReturned = Promise.resolve(oResponse) == oResponse;
                    assert.ok(bPromiseReturned, "createAdapter returns a promise when asked to");

                    if (bPromiseReturned) {
                        oResponse.then(function () {
                            // Tests after promise is resolved
                            assert.ok(fnRequireStub.calledWith([sExpectedAdapterName]), "createAdapter's promise resolved correctly");
                            assert.strictEqual(fnRequireStub.args[0][0][0], sExpectedAdapterName, "correct module required");
                            fnRequireStub.restore();
                            done();
                        });
                    } else {
                        fnRequireStub.restore();
                        done();
                    }
                });
    });
    [{
        testDescription: " no platform specified in the configuration",
        oExpPlatform: undefined
    }, {
        testDescription: " DEMO platform is specified in configuration",
        oExpPlatform: "DEMO"
    }].forEach(function (oFixture) {
        QUnit.test("getFLPPlatform returns the proper platform when " + oFixture.testDescription, function (assert) {
            var fnDone = assert.async();

            if (oFixture.oExpPlatform !== undefined) {
                window["sap-ushell-config"] = {
                    flpPlatform: oFixture.oExpPlatform
                };
            }
            Container.init("local")
                .then(function () {
                    Container.getFLPPlatform().then(function (sPlatform) {
                        assert.ok(sPlatform === oFixture.oExpPlatform, "Result equals Expected Result");
                        fnDone();
                    });
                });
        });
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("sap.ushell.bootstrap: Does V2 service migration if migration flag is not set", async function (assert) {
        // Arrange
        delete window["sap-ushell-config-migration"];
        const oExpectedConfig = {
            services: {
                Personalization: {
                    adapter: {
                        module: "sap.ushell.adapters.local.PersonalizationAdapter"
                    }
                },
                PersonalizationV2: {
                    adapter: {
                        module: "sap.ushell.adapters.local.PersonalizationAdapter"
                    }
                }
            }
        };
        window["sap-ushell-config"] = {
            services: {
                Personalization: {
                    adapter: {
                        module: "sap.ushell.adapters.local.PersonalizationAdapter"
                    }
                }
            }
        };

        // Act
        await ushellUtils.promisify(sap.ushell.bootstrap("local"));

        // Assert
        assert.deepEqual(window["sap-ushell-config"], oExpectedConfig, "Migrated the ushell services");

        // Cleanup
        delete window["sap-ushell-config"];
    });

    /**
     * @deprecated As of version 1.120
     */
    QUnit.test("sap.ushell.bootstrap: Does not do any V2 service migrations if migration flag is set", async function (assert) {
        // Arrange
        window["sap-ushell-config-migration"] = true;
        const oExpectedConfig = {
            services: {
                Personalization: {
                    adapter: {
                        module: "sap.ushell.adapters.local.PersonalizationAdapter"
                    }
                }
            }
        };
        window["sap-ushell-config"] = {
            services: {
                Personalization: {
                    adapter: {
                        module: "sap.ushell.adapters.local.PersonalizationAdapter"
                    }
                }
            }
        };

        // Act
        await ushellUtils.promisify(sap.ushell.bootstrap("local"));

        // Assert
        assert.deepEqual(window["sap-ushell-config"], oExpectedConfig, "Migrated the ushell services");

        // Cleanup
        delete window["sap-ushell-config"];
    });

    QUnit.module("Integration test - getService and getServiceAsync", {
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
        }
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("The same service instance is returned if it has already been instantiated", function (assert) {
        var done = assert.async();

        // Arrange
        var oContainerAdapterDeferred = new jQuery.Deferred();
        var oFirstServiceInstance;
        var WrappedContainerAdapter = function () {
            var oSystem = {
                getAlias: sandbox.stub(),
                getPlatform: sandbox.stub()
            };

            var oAdapter = new ContainerAdapter(oSystem, undefined, { config: {} });

            sandbox.stub(oAdapter, "load").callsFake(function () {
                oContainerAdapterDeferred.resolve();

                setTimeout(function () {
                    // Retrieve the service the first time, synchronously
                    // This has to be part of the ContainerAdapter to represent the use-case most accurately
                    oFirstServiceInstance = Container.getService("ShellNavigationInternal");
                }, 0);

                return oContainerAdapterDeferred.promise();
            });

            return oAdapter;
        };

        var fnFakeRequire = getRequireStub("sap/ushell/adapters/local/ContainerAdapter", WrappedContainerAdapter);

        // Act
        sap.ushell.bootstrap("local").done(function () {
            oContainerAdapterDeferred.done(function () {
                setTimeout(function () {
                    // Retrieve service again
                    Container.getServiceAsync("ShellNavigationInternal")
                        .then(function (oShellNavigationInternal) {
                            // Assert
                            assert.strictEqual(oFirstServiceInstance, oShellNavigationInternal, "The correct reference has been found.");
                            fnFakeRequire.restore();
                            done();
                        });
                }, 100);
            });
        });


    });

    QUnit.module("isAsyncDirtyStateProviderSet", {
        beforeEach: function () {
            return Container.init("local");
        },
        afterEach: function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("Returns true when provider is set", function (assert) {
        // Arrange
        Container.fnAsyncDirtyStateProvider = function () {
        };
        // Act
        var bResult = Container.isAsyncDirtyStateProviderSet();
        // Assert
        assert.strictEqual(bResult, true, "Returned correct result");
    });

    QUnit.test("Returns false when provider is not set", function (assert) {
        // Arrange
        // Act
        var bResult = Container.isAsyncDirtyStateProviderSet();
        // Assert
        assert.strictEqual(bResult, false, "Returned correct result");
    });

    QUnit.module("getDirtyFlagsAsync", {
        beforeEach: function (assert) {
            var done = assert.async();

            this.oNavigationContextMock = { id: "NavigationContext" };

            Container.init("local")
                .then(async () => {
                    const ShellNavigationInternal = await Container.getServiceAsync("ShellNavigationInternal");
                    this.oGetNavigationContextStub = sandbox.stub(ShellNavigationInternal, "getNavigationContext").returns(this.oNavigationContextMock);
                    done();
                });
        },
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("Calls the Provider with navigation context", function (assert) {
        // Arrange
        var oAsyncDirtyStateProviderStub = sandbox.stub().resolves(true);
        Container.fnAsyncDirtyStateProvider = oAsyncDirtyStateProviderStub;
        sandbox.stub(Container, "getDirtyFlag").returns(true);

        // Act
        return Container.getDirtyFlagsAsync().then(function () {
            assert.strictEqual(oAsyncDirtyStateProviderStub.callCount, 1, "The proivder was called once");
            assert.deepEqual(oAsyncDirtyStateProviderStub.getCall(0).args, [this.oNavigationContextMock], "The proivder was called with the navigation context");
        }.bind(this));
    });

    QUnit.test("Returns true when 'getDirtyFlag=true' and 'provider=true'", function (assert) {
        // Arrange
        Container.fnAsyncDirtyStateProvider = sandbox.stub().resolves(true);
        sandbox.stub(Container, "getDirtyFlag").returns(true);

        // Act
        return Container.getDirtyFlagsAsync().then(function (bIsDirty) {
            assert.strictEqual(bIsDirty, true, "Resolved correct dirtyFlag");
        });
    });

    QUnit.test("Returns true when 'getDirtyFlag=true' and 'provider=false'", function (assert) {
        // Arrange
        Container.fnAsyncDirtyStateProvider = sandbox.stub().resolves(false);
        sandbox.stub(Container, "getDirtyFlag").returns(true);

        // Act
        return Container.getDirtyFlagsAsync().then(function (bIsDirty) {
            assert.strictEqual(bIsDirty, true, "Resolved correct dirtyFlag");
        });
    });

    QUnit.test("Returns true when 'getDirtyFlag=true' and 'provider=null'", function (assert) {
        // Arrange
        sandbox.stub(Container, "getDirtyFlag").returns(true);

        // Act
        return Container.getDirtyFlagsAsync().then(function (bIsDirty) {
            assert.strictEqual(bIsDirty, true, "Resolved correct dirtyFlag");
        });
    });

    QUnit.test("Returns false when 'getDirtyFlag=false' and 'provider=false'", function (assert) {
        // Arrange
        Container.fnAsyncDirtyStateProvider = sandbox.stub().resolves(false);
        sandbox.stub(Container, "getDirtyFlag").returns(false);

        // Act
        return Container.getDirtyFlagsAsync().then(function (bIsDirty) {
            assert.strictEqual(bIsDirty, false, "Resolved correct dirtyFlag");
        });
    });

    QUnit.test("Returns false when 'getDirtyFlag=false' and 'provider=null'", function (assert) {
        // Arrange
        sandbox.stub(Container, "getDirtyFlag").returns(false);

        // Act
        return Container.getDirtyFlagsAsync().then(function (bIsDirty) {
            assert.strictEqual(bIsDirty, false, "Resolved correct dirtyFlag");
        });
    });

    QUnit.test("Returns true when 'getDirtyFlag=false' and 'provider=true'", function (assert) {
        // Arrange
        Container.fnAsyncDirtyStateProvider = sandbox.stub().resolves(true);
        sandbox.stub(Container, "getDirtyFlag").returns(false);

        // Act
        return Container.getDirtyFlagsAsync().then(function (bIsDirty) {
            assert.strictEqual(bIsDirty, true, "Resolved correct dirtyFlag");
        });
    });

    QUnit.module("setAsyncDirtyStateProvider", {
        beforeEach: function () {
            return Container.init("local");
        },
        afterEach: function () {
            Container.resetServices();
            sandbox.restore();
        }
    });

    QUnit.test("Sets the async dirtyStateProvider", function (assert) {
        // Arrange
        var fnAsyncDirtyStateProvider = sandbox.stub();

        // Act
        Container.setAsyncDirtyStateProvider(fnAsyncDirtyStateProvider);

        // Assert
        assert.strictEqual(Container.fnAsyncDirtyStateProvider, fnAsyncDirtyStateProvider, "Saved the correct dirtyStateProvider");
    });

    QUnit.test("Unsets the async dirtyStateProvider", function (assert) {
        // Arrange
        var fnAsyncDirtyStateProvider = sandbox.stub();
        Container.fnAsyncDirtyStateProvider = fnAsyncDirtyStateProvider;

        // Act
        Container.setAsyncDirtyStateProvider(null);

        // Assert
        assert.strictEqual(Container.fnAsyncDirtyStateProvider, null, "Reset the dirtyStateProvider");
    });

    QUnit.module("ready", {
        beforeEach: function () {
            Container.reset();
        }
    });

    QUnit.test("ready() resolves when init is called", function (assert) {
        var done = assert.async();

        Promise.all([
            Container.ready(),
            Container.init("local")
        ])
            .then(() => {
                assert.ok(true, "ready() Promise resolved when init is called");
                done();
            });
    });

    QUnit.test("ready() resolves after delayed init", function (assert) {
        var done = assert.async();
        var bReadyResolved = false;

        Container.ready()
            .then(() => {
                bReadyResolved = true;
            });

        setTimeout(() => {
            assert.ok(!bReadyResolved, "ready Promise not yet resolved!");

            Container.init("local")
                .then(() => {
                    setTimeout(() => {
                        assert.ok(bReadyResolved, "ready Promise is resolved shortly after init!");
                        done();
                    }, 1);
                });
        }, 100);
    });

    QUnit.module("Container.init: Global Export", {
        beforeEach: async function () {
            this._oNamespace = ushellLibrary;
        },
        afterEach: async function () {
            sandbox.restore();
            sap.ushell = this._oNamespace;
        }
    });

    QUnit.test("Adds the ContainerInstance to the global namespace", async function (assert) {
        // Arrange
        delete sap.ushell;
        // Act
        await Container.init("local");
        // Assert
        assert.strictEqual(Container, Container, "Correctly set Container");
    });
});
