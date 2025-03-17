// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.PluginManager
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/Device",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container",
    "sap/ushell/utils"
], function (
    Log,
    Device,
    jQuery,
    Container,
    ushellUtils
) {
    "use strict";

    /* global sinon, QUnit */

    var sandbox = sinon.createSandbox();

    QUnit.module("sap.ushell.services.PluginManager", {
        beforeEach: function (assert) {
            var fnDone = assert.async();

            Container.init("local")
                .then(function () {
                    Promise.all([
                        Container.getServiceAsync("PluginManager"),
                        Container.getServiceAsync("Ui5ComponentLoader")
                    ]).then(function (aServices) {
                        this.PluginManager = aServices[0];
                        this.Ui5ComponentLoader = aServices[1];
                        fnDone();
                    }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("constructor, method signatures", function (assert) {
        [
            "registerPlugins",
            "getSupportedPluginCategories",
            "getRegisteredPlugins",
            "loadPlugins",
            "_handlePluginCreation",
            "_instantiateComponent"
        ].forEach(function (sFunctionName) {
            assert.equal(typeof this.PluginManager[sFunctionName], "function", "function " + sFunctionName + " present");
        }.bind(this));
    });

    QUnit.test("registerPlugins: Empty set of plugins", function (assert) {
        this.PluginManager.registerPlugins({});

        assert.deepEqual(this.PluginManager.getRegisteredPlugins(), {
            AppWarmup: {},
            RendererExtensions: {},
            UserDefaults: {},
            UserImage: {}
        }, "Correct plugins registered");
    });

    QUnit.test("registerPlugins: Undefined set of plugins", function (assert) {
        this.PluginManager.registerPlugins(undefined);

        assert.deepEqual(this.PluginManager.getRegisteredPlugins(), {
            AppWarmup: {},
            RendererExtensions: {},
            UserDefaults: {},
            UserImage: {}
        }, "Correct plugins registered");
    });

    QUnit.test("registerPlugins: Only plugins without a configuration", function (assert) {
        this.PluginManager.registerPlugins({
            testPlugin1: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component"
            },

            testPlugin2: {
                component: "sap.test.TestComponent2",
                url: "/sap/test/url/to/Component2"
            }
        });

        var oPluginCollection = {
            AppWarmup: {},

            RendererExtensions: {
                testPlugin1: {
                    component: "sap.test.TestComponent",
                    enabled: true,
                    url: "/sap/test/url/to/Component"
                },
                testPlugin2: {
                    component: "sap.test.TestComponent2",
                    enabled: true,
                    url: "/sap/test/url/to/Component2"
                }
            },

            UserDefaults: {},
            UserImage: {}
        };
        assert.deepEqual(this.PluginManager.getRegisteredPlugins(), oPluginCollection, "Correct plugins registered");
    });

    QUnit.test("registerPlugins: Only plugins having a supported sap-ushell-plugin-type parameter set", function (assert) {
        this.PluginManager.registerPlugins({
            testPlugin1: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component",
                config: { "sap-ushell-plugin-type": "RendererExtensions" }
            },

            testPlugin2: {
                component: "sap.test.TestComponent2",
                url: "/sap/test/url/to/Component2",
                config: { "sap-ushell-plugin-type": "UserDefaults" }
            }
        });

        var oPluginCollection = {
            AppWarmup: {},

            RendererExtensions: {
                testPlugin1: {
                    component: "sap.test.TestComponent",
                    enabled: true,
                    url: "/sap/test/url/to/Component",
                    config: { "sap-ushell-plugin-type": "RendererExtensions" }
                }
            },

            UserDefaults: {
                testPlugin2: {
                    component: "sap.test.TestComponent2",
                    enabled: true,
                    url: "/sap/test/url/to/Component2",
                    config: { "sap-ushell-plugin-type": "UserDefaults" }
                }
            },

            UserImage: {}
        };
        assert.deepEqual(this.PluginManager.getRegisteredPlugins(), oPluginCollection, "Correct plugins registered");
    });

    QUnit.test("registerPlugins: Only plugins having an unsupported sap-ushell-plugin-type parameter set", function (assert) {
        this.PluginManager.registerPlugins({
            testPlugin1: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component",
                config: {
                    "sap-ushell-plugin-type": "AnotherInvalidType"
                }
            },

            testPlugin2: {
                component: "sap.test.TestComponent2",
                url: "/sap/test/url/to/Component2",
                config: {
                    "sap-ushell-plugin-type": "AnotherInvalidType"
                }
            }
        });

        var oPluginCollection = {
            AppWarmup: {},
            RendererExtensions: {},
            UserDefaults: {},
            UserImage: {}
        };

        assert.deepEqual(this.PluginManager.getRegisteredPlugins(), oPluginCollection, "Correct plugins registered");
    });

    QUnit.test("registerPlugins: Mix of plugins with unsupported or supported sap-ushell-plugin-type's", function (assert) {
        this.PluginManager.registerPlugins({
            testPlugin1: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component",
                config: { "sap-ushell-plugin-type": "AnotherInvalidType" }
            },

            testPlugin2: {
                component: "sap.test.TestComponent2",
                url: "/sap/test/url/to/Component2",
                config: { "sap-ushell-plugin-type": "UserDefaults" }
            },

            testPlugin3: {
                component: "sap.test.TestComponent3",
                url: "/sap/test/url/to/Component3",
                config: { "sap-ushell-plugin-type": "RendererExtensions" }
            }
        });

        var oPluginCollection = {
            AppWarmup: {},

            RendererExtensions: {
                testPlugin3: {
                    component: "sap.test.TestComponent3",
                    enabled: true,
                    url: "/sap/test/url/to/Component3",
                    config: { "sap-ushell-plugin-type": "RendererExtensions" }
                }
            },

            UserDefaults: {
                testPlugin2: {
                    component: "sap.test.TestComponent2",
                    enabled: true,
                    url: "/sap/test/url/to/Component2",
                    config: { "sap-ushell-plugin-type": "UserDefaults" }
                }
            },

            UserImage: {}
        };

        assert.deepEqual(this.PluginManager.getRegisteredPlugins(), oPluginCollection, "Correct plugins registered");
    });

    QUnit.test("registerPlugins: Target Mapping overrules the runtime adaptation plugin to be disabled", function (assert) {
        this.PluginManager.registerPlugins({
            testPlugin: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component",
                config: { "sap-ushell-plugin-type": "UserDefaults" }
            },

            testPlugin2: {
                component: "sap.test.TestComponent2",
                url: "/sap/test/url/to/Component2"
            },

            RuntimeAdaptationPlugin: {
                component: "sap.ushell.plugins.rta-personalize",
                enabled: false
            }
        });

        var oPluginCollection = {
            AppWarmup: {},

            RendererExtensions: {
                testPlugin2: {
                    component: "sap.test.TestComponent2",
                    enabled: true,
                    url: "/sap/test/url/to/Component2"
                }
            },

            UserDefaults: {
                testPlugin: {
                    component: "sap.test.TestComponent",
                    enabled: true,
                    url: "/sap/test/url/to/Component",
                    config: { "sap-ushell-plugin-type": "UserDefaults" }
                }
            },

            UserImage: {}
        };

        assert.deepEqual(this.PluginManager.getRegisteredPlugins(), oPluginCollection, "Correct plugins registered");
    });

    QUnit.test("registerPlugins: Runtime adaptation plugin gets configured and attached by the HTML file as it wasn't configured by an admin", function (assert) {
        this.PluginManager.registerPlugins({
            testPlugin: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component",
                config: { "sap-ushell-plugin-type": "UserDefaults" }
            },

            testPlugin2: {
                component: "sap.test.TestComponent2",
                url: "/sap/test/url/to/Component2"
            },

            UiAdaptationPersonalization: { component: "sap.ushell.plugins.rta-personalize" }
        });

        var oPluginCollection = {
            AppWarmup: {},

            RendererExtensions: {
                testPlugin2: {
                    component: "sap.test.TestComponent2",
                    enabled: true,
                    url: "/sap/test/url/to/Component2"
                },
                UiAdaptationPersonalization: {
                    component: "sap.ushell.plugins.rta-personalize",
                    enabled: true
                }
            },

            UserDefaults: {
                testPlugin: {
                    component: "sap.test.TestComponent",
                    enabled: true,
                    url: "/sap/test/url/to/Component",
                    config: { "sap-ushell-plugin-type": "UserDefaults" }
                }
            },

            UserImage: {}
        };

        assert.deepEqual(this.PluginManager.getRegisteredPlugins(), oPluginCollection, "Correct plugins registered");
    });

    QUnit.test("registerPlugins: App Warmup plugin gets registered correctly", function (assert) {
        this.PluginManager.registerPlugins({
            appWarmup: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component",
                config: { "sap-ushell-plugin-type": "AppWarmup" }
            },

            testPlugin2: {
                component: "sap.test.TestComponent2",
                url: "/sap/test/url/to/Component2"
            }
        });

        var oPluginCollection = {
            AppWarmup: {
                appWarmup: {
                    component: "sap.test.TestComponent",
                    enabled: true,
                    url: "/sap/test/url/to/Component",
                    config: { "sap-ushell-plugin-type": "AppWarmup" }
                }
            },

            RendererExtensions: {
                testPlugin2: {
                    component: "sap.test.TestComponent2",
                    enabled: true,
                    url: "/sap/test/url/to/Component2"
                }
            },

            UserDefaults: {},
            UserImage: {}
        };

        assert.deepEqual(this.PluginManager.getRegisteredPlugins(), oPluginCollection, "Correct plugins registered");
    });

    QUnit.test("do not load Plugins if parameter sap-ushell-xx-pluginmode is set to discard: ", function (assert) {
        sandbox.stub(URLSearchParams.prototype, "get").returns("discard");
        sandbox.stub(this.PluginManager, "_handlePluginCreation");
        this.PluginManager.registerPlugins({
            appWarmup: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component",
                config: { "sap-ushell-plugin-type": "AppWarmup" }
            },

            testPlugin2: {
                component: "sap.test.TestComponent2",
                url: "/sap/test/url/to/Component2"
            }
        });

        this.PluginManager.loadPlugins("AppWarmup");
        assert.equal(this.PluginManager._handlePluginCreation.calledOnce, false, "warmup filtered");
    });

    QUnit.test("registerPlugins: Mix of plugins with plugins defined as modules, unsupported or supported sap-ushell-plugin-type's for UI5 components", async function (assert) {
        await this.PluginManager.registerPlugins({
            testPlugin1: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component",
                config: { "sap-ushell-plugin-type": "AnotherInvalidType" }
            },

            testPlugin2: {
                module: "sap.test.TestComponent2",
                url: "/sap/test/url/to/Component2"
            },

            testPlugin3: {
                component: "sap.test.TestComponent3",
                url: "/sap/test/url/to/Component3",
                config: { "sap-ushell-plugin-type": "RendererExtensions" }
            },

            testPlugin4: {
                module: "sap.test.TestComponent4",
                url: "/sap/test/url/to/Component4"
            },

            testPlugin5: {
                component: "sap.test.TestComponent5",
                url: "/sap/test/url/to/Component5",
                config: { "sap-ushell-plugin-type": "UserDefaults" }
            }
        });

        var oPluginCollection = {
            AppWarmup: {},

            RendererExtensions: {
                testPlugin3: {
                    component: "sap.test.TestComponent3",
                    enabled: true,
                    url: "/sap/test/url/to/Component3",
                    config: { "sap-ushell-plugin-type": "RendererExtensions" }
                }
            },

            UserDefaults: {
                testPlugin5: {
                    component: "sap.test.TestComponent5",
                    enabled: true,
                    url: "/sap/test/url/to/Component5",
                    config: { "sap-ushell-plugin-type": "UserDefaults" }
                }
            },

            UserImage: {}
        };

        assert.deepEqual(this.PluginManager.getRegisteredPlugins(), oPluginCollection, "Correct plugins registered");
    });

    QUnit.test("registerPlugins: form factor is considered", function (assert) {
        sandbox.stub(ushellUtils, "getFormFactor").returns(Device.system.SYSTEMTYPE.DESKTOP);

        this.PluginManager.registerPlugins({
            testPlugin0: {
                component: "sap.test.TestComponent0",
                url: "/sap/test/url/to/Component0",
                config: { "sap-ushell-plugin-type": "RendererExtensions" }
            },

            testPlugin1: {
                component: "sap.test.TestComponent1",
                url: "/sap/test/url/to/Component1",
                config: { "sap-ushell-plugin-type": "RendererExtensions" },
                deviceTypes: {
                    desktop: false,
                    tablet: false,
                    phone: true
                }
            },

            testPlugin2: {
                component: "sap.test.TestComponent2",
                url: "/sap/test/url/to/Component2",
                config: { "sap-ushell-plugin-type": "RendererExtensions" },
                deviceTypes: {
                    desktop: true,
                    tablet: true,
                    phone: true
                }
            }
        });

        var oPluginCollection = {
            AppWarmup: {},

            RendererExtensions: {
                testPlugin0: {
                    component: "sap.test.TestComponent0",
                    url: "/sap/test/url/to/Component0",
                    enabled: true,
                    config: { "sap-ushell-plugin-type": "RendererExtensions" }
                },
                testPlugin2: {
                    component: "sap.test.TestComponent2",
                    url: "/sap/test/url/to/Component2",
                    enabled: true,
                    config: { "sap-ushell-plugin-type": "RendererExtensions" },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                }
            },

            UserDefaults: {},

            UserImage: {}
        };

        assert.deepEqual(this.PluginManager.getRegisteredPlugins(), oPluginCollection, "Correct plugins registered");
    });

    QUnit.test("_handlePluginCreation: Plugins have same component (component gets loaded once and initialized thrice)", function (assert) {
        assert.expect(4);
        var fnDone = assert.async();

        var oInstantiateComponentStub;
        var iCount = 0;
        var aPromisesResolveOrder = [];
        var aResolvedPromises = [];

        // slowest promise returned by first call of _instantiateComponent(),
        // because the component first needs to be loaded before it gets initialized.
        aPromisesResolveOrder.push(new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            }, 100);
        }));

        // promise returned by second call of _instantiateComponent().
        // It resolves much faster, because the component is already loaded, and only needs to be instantiated.
        aPromisesResolveOrder.push(new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            }, 50);
        }));

        // promise returned by third call of _instantiateComponent().
        // It resolves much faster, because the component is already loaded, and only needs to be instantiated.
        aPromisesResolveOrder.push(new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            }, 10);
        }));

        // register plugins having the same component
        this.PluginManager.registerPlugins({
            testPlugin1: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component",
                config: { "sap-ushell-plugin-type": "RendererExtensions" }
            },
            testPlugin2: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component",
                config: { "sap-ushell-plugin-type": "RendererExtensions" }
            },
            testPlugin3: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component",
                config: { "sap-ushell-plugin-type": "RendererExtensions" }
            }
        });

        // stub _instantiateComponent to return the respective promise depending
        // on each case defined in a correct resolve order
        oInstantiateComponentStub = sandbox.stub(this.PluginManager, "_instantiateComponent").callsFake(function () {
            iCount++;
            if (iCount === 1) {
                assert.strictEqual(oInstantiateComponentStub.callCount, iCount, "Component gets both loaded and instantiated.");
                aResolvedPromises.push(aPromisesResolveOrder[iCount - 1]);
                return aPromisesResolveOrder[iCount - 1];
            }

            if (iCount === 2) {
                fnDone();
                assert.strictEqual(oInstantiateComponentStub.callCount, iCount, "Component gets only instantiated, because it is already loaded.");
                aResolvedPromises.push(aPromisesResolveOrder[iCount - 1]);
                return aPromisesResolveOrder[iCount - 1];
            }

            if (iCount === 3) {
                assert.strictEqual(oInstantiateComponentStub.callCount, iCount, "Component gets only instantiated, because it is already loaded.");
                aResolvedPromises.push(aPromisesResolveOrder[iCount - 1]);
                assert.deepEqual(aPromisesResolveOrder, aResolvedPromises, "Order of resolving the promises was correct");
                return aPromisesResolveOrder[iCount - 1];
            }
        });

        Object.keys(this.PluginManager.getRegisteredPlugins().RendererExtensions).forEach(function (sPluginName) {
            // function under test
            this.PluginManager._handlePluginCreation("RendererExtensions", sPluginName, new jQuery.Deferred());
        }.bind(this));
    });

    QUnit.test("_instantiateComponent: sap.ui.component resolves, plugin promise resolves", function (assert) {
        var fnDone = assert.async();

        var oDeferredXhrAuthentication = new jQuery.Deferred();
        var oDeferredCreateComponent = new jQuery.Deferred();
        var oDeferredPlugin = new jQuery.Deferred();
        var oFakeErrorXhrAuthentication = {};

        sandbox.stub(this.PluginManager, "_handleXhrAuthentication").returns(oDeferredXhrAuthentication);
        var oSrvcUi5ComponentLoaderStub = sandbox.stub(this.Ui5ComponentLoader, "createComponent").returns(oDeferredCreateComponent.promise());

        this.PluginManager._instantiateComponent({
            component: "sap.test.TestComponent",
            url: "/sap/test/url/to/Component",

            config: {
                "sap-ushell-plugin-type": "RendererExtensions"
            }
        }, oDeferredPlugin);
        oDeferredPlugin.promise()
            .always(function () {
                fnDone();
                assert.strictEqual(oSrvcUi5ComponentLoaderStub.callCount, 1, "createComponent of Ui5ComponentLoader was called once and resolved.");
                assert.strictEqual(this.PluginManager._handleXhrAuthentication.callCount, 1, "_handleXhrAuthentication was called once.");
            }.bind(this))
            .done(function () {
                assert.ok(true, "plugin promise was resolved as expected");
            })
            .fail(function (oError) {
                assert.ok(false, "unexpected reject");
                assert.strictEqual(oError, oFakeErrorXhrAuthentication, "error as expected");
            });

        setTimeout(function () {
            oDeferredCreateComponent.resolve();
        }, 0);

        setTimeout(function () {
            oDeferredXhrAuthentication.resolve();
        }, 0);
    });

    QUnit.test("_instantiateComponent: no config, sap.ui.component resolves, plugin promise resolves", function (assert) {
        var fnDone = assert.async();

        var oDeferredXhrAuthentication = new jQuery.Deferred();
        var oDeferredCreateComponent = new jQuery.Deferred();
        var oDeferredPlugin = new jQuery.Deferred();
        var oFakeErrorXhrAuthentication = {};

        sandbox.stub(this.PluginManager, "_handleXhrAuthentication").returns(oDeferredXhrAuthentication);
        var oSrvcUi5ComponentLoaderStub = sandbox.stub(this.Ui5ComponentLoader, "createComponent").returns(oDeferredCreateComponent.promise());

        this.PluginManager._instantiateComponent({
            component: "sap.test.TestComponent",
            url: "/sap/test/url/to/Component",
            config: null
        }, oDeferredPlugin);
        oDeferredPlugin.promise()
            .always(function () {
                fnDone();
                assert.strictEqual(oSrvcUi5ComponentLoaderStub.callCount, 1, "createComponent of Ui5ComponentLoader was called once and resolved.");
                assert.strictEqual(this.PluginManager._handleXhrAuthentication.callCount, 1, "_handleXhrAuthentication was called once.");
            }.bind(this))
            .done(function () {
                assert.ok(true, "plugin promise was resolved as expected");
            })
            .fail(function (oError) {
                assert.ok(false, "unexpected reject");
                assert.strictEqual(oError, oFakeErrorXhrAuthentication, "error as expected");
            });

        setTimeout(function () {
            oDeferredCreateComponent.resolve();
        }, 0);

        setTimeout(function () {
            oDeferredXhrAuthentication.resolve();
        }, 0);
    });

    QUnit.test("_instantiateComponent: sap.ui.component rejects, plugin promise rejects", function (assert) {
        var fnDone = assert.async();

        var oDeferredXhrAuthentication = new jQuery.Deferred();
        var oDeferredCreateComponent = new jQuery.Deferred();
        var oDeferredPlugin = new jQuery.Deferred();
        var oFakeErrorCreateComponent = {};

        sandbox.stub(this.PluginManager, "_handleXhrAuthentication").returns(oDeferredXhrAuthentication);
        var oSrvcUi5ComponentLoaderStub = sandbox.stub(this.Ui5ComponentLoader, "createComponent").returns(oDeferredCreateComponent.promise());

        this.PluginManager._instantiateComponent({
            component: "sap.test.TestComponent",
            url: "/sap/test/url/to/Component",

            config: {
                "sap-ushell-plugin-type": "RendererExtensions"
            }
        }, oDeferredPlugin);
        oDeferredPlugin.promise()
            .always(function () {
                fnDone();
                assert.strictEqual(oSrvcUi5ComponentLoaderStub.callCount, 1, "createComponent of Ui5ComponentLoader was called once and resolved.");
                assert.strictEqual(this.PluginManager._handleXhrAuthentication.callCount, 1, "_handleXhrAuthentication was called once.");
            }.bind(this))
            .done(function () {
                assert.ok(false, "unexpected resolve");
            })
            .fail(function (oError) {
                assert.ok(true, "plugin promise was rejected as expected");
                assert.strictEqual(oError, oFakeErrorCreateComponent, "error as expected");
            });

        setTimeout(function () {
            oDeferredCreateComponent.reject(oFakeErrorCreateComponent);
        }, 0);

        setTimeout(function () {
            oDeferredXhrAuthentication.resolve();
        }, 0);
    });

    QUnit.test("_instantiateComponent: XHR authentication fails", function (assert) {
        var fnDone = assert.async();

        var oDeferredXhrAuthentication = new jQuery.Deferred();
        var oDeferredCreateComponent = new jQuery.Deferred();
        var oDeferredPlugin = new jQuery.Deferred();
        var oPlugin = {
            component: "sap.test.TestComponent",
            url: "/sap/test/url/to/Component",
            config: undefined
        };
        var oFakeErrorXhrAuthentication = {};

        sandbox.stub(this.PluginManager, "_handleXhrAuthentication").returns(oDeferredXhrAuthentication);
        var oSrvcUi5ComponentLoaderStub = sandbox.stub(this.Ui5ComponentLoader, "createComponent").returns(oDeferredCreateComponent.promise());

        this.PluginManager._instantiateComponent(oPlugin, oDeferredPlugin);
        oDeferredPlugin.promise()
            .always(function () {
                fnDone();
                assert.strictEqual(oSrvcUi5ComponentLoaderStub.callCount, 0, "createComponent of Ui5ComponentLoader was called once and resolved.");
                assert.strictEqual(this.PluginManager._handleXhrAuthentication.callCount, 1, "_handleXhrAuthentication was called once.");
            }.bind(this))
            .done(function () {
                assert.ok(false, "unexpected resolve");
            })
            .fail(function (oError) {
                assert.ok(true, "plugin promise was rejected as expected");
                assert.strictEqual(oError, oFakeErrorXhrAuthentication, "error as expected");
            });

        setTimeout(function () {
            oDeferredCreateComponent.resolve();
        }, 0);

        setTimeout(function () {
            oDeferredXhrAuthentication.reject(oFakeErrorXhrAuthentication);
        }, 0);
    });

    QUnit.test("_handleXhrAuthentication: oApplicationConfiguration is undefined", function (assert) {
        var fnDone = assert.async();

        var oDeferredAjax = new jQuery.Deferred();
        sandbox.stub(jQuery, "ajax").returns(oDeferredAjax);
        sandbox.stub(Log, "error");
        sandbox.stub(Container, "setXhrLogonTimeout");

        this.PluginManager._handleXhrAuthentication(undefined, undefined)
            .always(function () {
                assert.strictEqual(jQuery.ajax.callCount, 0, "XHR call count");
                assert.strictEqual(Container.setXhrLogonTimeout.callCount, 0, "expected that sap.ushell.Container.setXhrLogonTimeout was not called");
                fnDone();
            })
            .done(function () {
                assert.ok(true, "expected promise to be resolved");
            })
            .fail(function () {
                assert.notOk(true, "expected promise to be rejected");
            });

        setTimeout(function () {
            oDeferredAjax.resolve();
        }, 0);
    });

    QUnit.test("_handleXhrAuthentication: sap-ushell-xhr-authentication is undefined", function (assert) {
        var fnDone = assert.async();

        var oDeferredAjax = new jQuery.Deferred();
        sandbox.stub(jQuery, "ajax").returns(oDeferredAjax);
        sandbox.stub(Log, "error");
        sandbox.stub(Container, "setXhrLogonTimeout");

        this.PluginManager._handleXhrAuthentication({}, undefined)
            .always(function () {
                assert.strictEqual(jQuery.ajax.callCount, 0, "XHR call count");
                assert.strictEqual(Container.setXhrLogonTimeout.callCount, 0, "expected that sap.ushell.Container.setXhrLogonTimeout was not called");
                fnDone();
            })
            .done(function () {
                assert.ok(true, "expected promise to be resolved");
            })
            .fail(function () {
                assert.notOk(true, "expected promise to be rejected");
            });

        setTimeout(function () {
            oDeferredAjax.resolve();
        }, 0);
    });

    QUnit.test("_handleXhrAuthentication: sap-ushell-xhr-authentication is 'false'", function (assert) {
        var fnDone = assert.async();

        var oDeferredAjax = new jQuery.Deferred();
        sandbox.stub(jQuery, "ajax").returns(oDeferredAjax);
        sandbox.stub(Log, "error");
        sandbox.stub(Container, "setXhrLogonTimeout");

        this.PluginManager._handleXhrAuthentication({
            "sap-ushell-xhr-authentication": "false"
        }, undefined)
            .always(function () {
                assert.strictEqual(jQuery.ajax.callCount, 0, "XHR call count");
                assert.strictEqual(Container.setXhrLogonTimeout.callCount, 0, "expected that sap.ushell.Container.setXhrLogonTimeout was not called");
                fnDone();
            })
            .done(function () {
                assert.ok(true, "expected promise to be resolved");
            })
            .fail(function () {
                assert.notOk(true, "expected promise to be rejected");
            });

        setTimeout(function () {
            oDeferredAjax.resolve();
        }, 0);
    });

    QUnit.test("_handleXhrAuthentication: sap-ushell-xhr-authentication is false", function (assert) {
        var fnDone = assert.async();

        var oDeferredAjax = new jQuery.Deferred();
        sandbox.stub(jQuery, "ajax").returns(oDeferredAjax);
        sandbox.stub(Log, "error");
        sandbox.stub(Container, "setXhrLogonTimeout");

        this.PluginManager._handleXhrAuthentication({
            "sap-ushell-xhr-authentication": false
        }, undefined)
            .always(function () {
                assert.strictEqual(jQuery.ajax.callCount, 0, "XHR call count");
                assert.strictEqual(Container.setXhrLogonTimeout.callCount, 0, "expected that sap.ushell.Container.setXhrLogonTimeout was not called");
                fnDone();
            })
            .done(function () {
                assert.ok(true, "expected promise to be resolved");
            })
            .fail(function () {
                assert.notOk(true, "expected promise to be rejected");
            });

        setTimeout(function () {
            oDeferredAjax.resolve();
        }, 0);
    });

    QUnit.test("_handleXhrAuthentication: sap-ushell-xhr-authentication is 'true' and ajax call succeeds", function (assert) {
        var fnDone = assert.async();

        var oDeferredAjax = new jQuery.Deferred();
        sandbox.stub(jQuery, "ajax").returns(oDeferredAjax);
        sandbox.stub(Log, "error");
        sandbox.stub(Container, "setXhrLogonTimeout");

        this.PluginManager._handleXhrAuthentication({
            "sap-ushell-xhr-authentication": "true"
        }, "/sap/test/url/to/Component")
            .always(function () {
                assert.strictEqual(jQuery.ajax.callCount, 1, "XHR call count");
                assert.strictEqual(jQuery.ajax.firstCall.args[0], "/sap/test/url/to/Component/Component-preload.js", "XHR URL");
                assert.deepEqual(jQuery.ajax.firstCall.args[1], { dataType: "text" }, "XHR Options");
                assert.strictEqual(Container.setXhrLogonTimeout.callCount, 0, "expected that sap.ushell.Container.setXhrLogonTimeout was not called");
                fnDone();
            })
            .done(function () {
                assert.ok(true, "expected promise to be resolved");
            })
            .fail(function () {
                assert.notOk(true, "expected promise to be rejected");
            });

        setTimeout(function () {
            oDeferredAjax.resolve();
        }, 0);
    });

    QUnit.test("_handleXhrAuthentication: sap-ushell-xhr-authentication is true and ajax call succeeds", function (assert) {
        var fnDone = assert.async();

        var oDeferredAjax = new jQuery.Deferred();
        sandbox.stub(jQuery, "ajax").returns(oDeferredAjax);
        sandbox.stub(Log, "error");
        sandbox.stub(Container, "setXhrLogonTimeout");

        this.PluginManager._handleXhrAuthentication({
            "sap-ushell-xhr-authentication": true
        }, "/sap/test/url/to/Component")
            .always(function () {
                assert.strictEqual(jQuery.ajax.callCount, 1, "XHR call count");
                assert.strictEqual(jQuery.ajax.firstCall.args[0], "/sap/test/url/to/Component/Component-preload.js", "XHR URL");
                assert.deepEqual(jQuery.ajax.firstCall.args[1], { dataType: "text" }, "XHR Options");
                assert.strictEqual(Container.setXhrLogonTimeout.callCount, 0, "expected that sap.ushell.Container.setXhrLogonTimeout was not called");
                fnDone();
            })
            .done(function () {
                assert.ok(true, "expected promise to be resolved");
            })
            .fail(function () {
                assert.notOk(true, "expected promise to be rejected");
            });

        setTimeout(function () {
            oDeferredAjax.resolve();
        }, 0);
    });

    QUnit.test("_handleXhrAuthentication: sap-ushell-xhr-authentication is 'X' and ajax call succeeds", function (assert) {
        var fnDone = assert.async();

        var oDeferredAjax = new jQuery.Deferred();
        sandbox.stub(jQuery, "ajax").returns(oDeferredAjax);
        sandbox.stub(Log, "error");
        sandbox.stub(Container, "setXhrLogonTimeout");

        this.PluginManager._handleXhrAuthentication({
            "sap-ushell-xhr-authentication": "X"
        }, "/sap/test/url/to/Component")
            .always(function () {
                assert.strictEqual(jQuery.ajax.callCount, 1, "XHR call count");
                assert.strictEqual(jQuery.ajax.firstCall.args[0], "/sap/test/url/to/Component/Component-preload.js", "XHR URL");
                assert.deepEqual(jQuery.ajax.firstCall.args[1], { dataType: "text" }, "XHR Options");
                assert.strictEqual(Container.setXhrLogonTimeout.callCount, 0, "expected that sap.ushell.Container.setXhrLogonTimeout was not called");
                fnDone();
            })
            .done(function () {
                assert.ok(true, "expected promise to be resolved");
            })
            .fail(function () {
                assert.notOk(true, "expected promise to be rejected");
            });

        setTimeout(function () {
            oDeferredAjax.resolve();
        }, 0);
    });

    QUnit.test("_handleXhrAuthentication: sap-ushell-xhr-authentication is 'true' and sComponentUrl is undefined", function (assert) {
        var fnDone = assert.async();

        var oDeferredAjax = new jQuery.Deferred();
        sandbox.stub(jQuery, "ajax").returns(oDeferredAjax);
        sandbox.stub(Log, "error");
        sandbox.stub(Container, "setXhrLogonTimeout");

        this.PluginManager._handleXhrAuthentication({
            "sap-ushell-xhr-authentication": "true"
        }, undefined)
            .always(function () {
                assert.strictEqual(jQuery.ajax.callCount, 0, "XHR call count");
                assert.strictEqual(Container.setXhrLogonTimeout.callCount, 0, "expected that sap.ushell.Container.setXhrLogonTimeout was not called");
                assert.strictEqual(Log.error.callCount, 1, "expected that Log.error was called once");
                assert.deepEqual(Log.error.firstCall.args, [
                    "Illegal state: configuration parameter 'sap-ushell-xhr-authentication-timeout' set, but no component URL specified. XHR authentication request will not be sent."
                    + " Please check the target mapping definitions for plug-ins and the application index.",
                    undefined,
                    "sap.ushell.services.PluginManager"
                ], "expected that sap.ushell.Container.setXhrLogonTimeout was called with correct arguments");
                fnDone();
            })
            .done(function () {
                assert.ok(true, "expected promise to be resolved");
            })
            .fail(function () {
                assert.notOk(true, "expected promise to be rejected");
            });

        setTimeout(function () {
            oDeferredAjax.resolve();
        }, 0);
    });

    QUnit.test("_handleXhrAuthentication: sap-ushell-xhr-authentication is 'true' and ajax call fails", function (assert) {
        var fnDone = assert.async();

        var oDeferredAjax = new jQuery.Deferred();
        var oFakeErrorAjax = {};

        sandbox.stub(jQuery, "ajax").returns(oDeferredAjax);
        sandbox.stub(Log, "error");
        sandbox.stub(Container, "setXhrLogonTimeout");

        this.PluginManager._handleXhrAuthentication({
            "sap-ushell-xhr-authentication": "true"
        }, "/sap/test/url/to/Component")
            .always(function () {
                assert.strictEqual(jQuery.ajax.callCount, 1, "XHR call count");
                assert.strictEqual(jQuery.ajax.firstCall.args[0], "/sap/test/url/to/Component/Component-preload.js", "XHR URL");
                assert.strictEqual(Container.setXhrLogonTimeout.callCount, 0, "expected that sap.ushell.Container.setXhrLogonTimeout was not called");
                fnDone();
            })
            .done(function () {
                assert.ok(false, "expected promise to be resolved");
            })
            .fail(function () {
                assert.notOk(false, "expected promise to be rejected");
            });

        setTimeout(function () {
            oDeferredAjax.reject(oFakeErrorAjax);
        }, 0);
    });

    QUnit.test("_handleXhrAuthentication: sap-ushell-xhr-authentication is 'true' and sap-ushell-xhr-authentication-timeout is set as integer", function (assert) {
        var fnDone = assert.async();

        var oDeferredAjax = new jQuery.Deferred();
        sandbox.stub(jQuery, "ajax").returns(oDeferredAjax);
        sandbox.stub(Log, "error");
        sandbox.stub(Container, "setXhrLogonTimeout");

        this.PluginManager._handleXhrAuthentication({
            "sap-ushell-xhr-authentication": "true",
            "sap-ushell-xhr-authentication-timeout": 5000
        }, "/sap/test/url/to/Component")
            .always(function () {
                assert.strictEqual(jQuery.ajax.callCount, 1, "XHR call count");
                assert.strictEqual(jQuery.ajax.firstCall.args[0], "/sap/test/url/to/Component/Component-preload.js", "XHR URL");
                assert.strictEqual(Container.setXhrLogonTimeout.callCount, 1, "expected that sap.ushell.Container.setXhrLogonTimeout was called once");
                assert.deepEqual(Container.setXhrLogonTimeout.firstCall.args, ["/sap/test/url/to/Component", 5000],
                    "expected that sap.ushell.Container.setXhrLogonTimeout was called with correct arguments");
                fnDone();
            })
            .done(function () {
                assert.ok(true, "expected promise to be resolved");
            })
            .fail(function () {
                assert.notOk(true, "expected promise to be rejected");
            });

        setTimeout(function () {
            oDeferredAjax.resolve();
        }, 0);
    });

    QUnit.test("_handleXhrAuthentication: sap-ushell-xhr-authentication is 'true' and sap-ushell-xhr-authentication-timeout is set as string", function (assert) {
        var fnDone = assert.async();

        var oDeferredAjax = new jQuery.Deferred();
        sandbox.stub(jQuery, "ajax").returns(oDeferredAjax);
        sandbox.stub(Log, "error");
        sandbox.stub(Container, "setXhrLogonTimeout");

        this.PluginManager._handleXhrAuthentication({
            // applicationConfiguration values are strings
            "sap-ushell-xhr-authentication": "true",

            "sap-ushell-xhr-authentication-timeout": "5000"
        }, "/sap/test/url/to/Component")
            .always(function () {
                assert.strictEqual(jQuery.ajax.callCount, 1, "XHR call count");
                assert.strictEqual(jQuery.ajax.firstCall.args[0], "/sap/test/url/to/Component/Component-preload.js", "XHR URL");
                assert.strictEqual(Container.setXhrLogonTimeout.callCount, 1, "expected that sap.ushell.Container.setXhrLogonTimeout was called once");
                assert.deepEqual(Container.setXhrLogonTimeout.firstCall.args, ["/sap/test/url/to/Component", 5000],
                    "expected that sap.ushell.Container.setXhrLogonTimeout was called with correct arguments");
                fnDone();
            })
            .done(function () {
                assert.ok(true, "expected promise to be resolved");
            })
            .fail(function () {
                assert.notOk(true, "expected promise to be rejected");
            });

        setTimeout(function () {
            oDeferredAjax.resolve();
        }, 0);
    });

    QUnit.test("_handleXhrAuthentication: sap-ushell-xhr-authentication is 'true' and sap-ushell-xhr-authentication-timeout is set as string which cannot be converted to int", function (assert) {
        var fnDone = assert.async();

        var oDeferredAjax = new jQuery.Deferred();
        sandbox.stub(jQuery, "ajax").returns(oDeferredAjax);
        sandbox.stub(Log, "error");
        sandbox.stub(Container, "setXhrLogonTimeout");

        this.PluginManager._handleXhrAuthentication({
            "sap-ushell-xhr-authentication": "true",
            "sap-ushell-xhr-authentication-timeout": "NOT_AN_INTEGER"
        }, "/sap/test/url/to/Component")
            .always(function () {
                assert.strictEqual(jQuery.ajax.callCount, 1, "XHR call count");
                assert.strictEqual(jQuery.ajax.firstCall.args[0], "/sap/test/url/to/Component/Component-preload.js", "XHR URL");
                assert.strictEqual(Container.setXhrLogonTimeout.callCount, 0, "expected that sap.ushell.Container.setXhrLogonTimeout was not called");
                assert.strictEqual(Log.error.callCount, 1, "expected that Log.error was called once");
                assert.deepEqual(Log.error.firstCall.args, [
                    "Invalid value for configuration parameter 'sap-ushell-xhr-authentication-timeout' for plug-in component with URL '/sap/test/url/to/Component': 'NOT_AN_INTEGER' is not a number."
                    + " Timeout will be ignored.",
                    undefined,
                    "sap.ushell.services.PluginManager"
                ], "expected that sap.ushell.Container.setXhrLogonTimeout was called with correct arguments");
                fnDone();
            })
            .done(function () {
                assert.ok(true, "expected promise to be resolved");
            })
            .fail(function () {
                assert.notOk(true, "expected promise to be rejected");
            });

        setTimeout(function () {
            oDeferredAjax.resolve();
        }, 0);
    });

    QUnit.test("Bootstrap Plugin: use getUserDefaultPluginsPromise - reject second promise but still get 'resolve' after all plugins are loaded", function (assert) {
        var fnDone = assert.async();

        var oTypeError = new TypeError("I fail on purpose!");

        // we want to be able to resolve any promise given at any time
        sandbox.stub(this.Ui5ComponentLoader, "createComponent").callsFake(function (oConfig) {
            var oCreateComponentDeferred = new jQuery.Deferred();
            var oLoadedComponent = { componentHandle: { componentOptions: {} } };

            setTimeout(function () {
                if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample1") {
                    setTimeout(function () {
                        oCreateComponentDeferred.resolve(oLoadedComponent);
                    }, 1000);
                } else if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample2") {
                    oCreateComponentDeferred.reject(oTypeError);
                }
            }, 0);

            return oCreateComponentDeferred.promise();
        });

        this.PluginManager.registerPlugins({
            UserDefaultPlugin1: {
                component: "sap.ushell.services.DummyComponentPluginSample1",
                config: { "sap-ushell-plugin-type": "UserDefaults" }
            },

            UserDefaultPlugin2: {
                component: "sap.ushell.services.DummyComponentPluginSample2",
                config: { "sap-ushell-plugin-type": "UserDefaults" }
            },

            SomeOtherPlugin: { component: "sap.ushell.services.DummyComponentPluginSample3" }
        });

        this.PluginManager.loadPlugins("UserDefaults")
            .done(function (aResults) {
                assert.ok(true, "The promise should resolve even if one of the plugins crached");
                assert.strictEqual(aResults.length, 2, "2 results in resolved array");
                assert.strictEqual(aResults[0].pluginName, "UserDefaultPlugin1");
                assert.strictEqual(aResults[0].success, true);
                assert.strictEqual(aResults[1].pluginName, "UserDefaultPlugin2");
                assert.strictEqual(aResults[1].success, false);
                assert.strictEqual(aResults[1].error.message, "I fail on purpose!");
            }).fail(function () {
                assert.notOk(true, "State of promise should not be 'rejected'");
            })
            .always(fnDone);
    });

    QUnit.test("Bootstrap Plugin: use getUserDefaultPluginsPromise - error thrown", function (assert) {
        var fnDone = assert.async();

        // we want to be able to resolve any promise given at any time
        sandbox.stub(this.Ui5ComponentLoader, "createComponent").callsFake(function (oConfig) {
            var oCreateComponentDeferred = new jQuery.Deferred();
            // special case: throw exception for second entry
            if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample2") {
                throw new TypeError("I fail on purpose!");
            }

            setTimeout(function () {
                oCreateComponentDeferred.resolve();
            }, 1000);
            return oCreateComponentDeferred.promise();
        });

        this.PluginManager.registerPlugins({
            UserDefaultPlugin1: {
                component: "sap.ushell.services.DummyComponentPluginSample1",
                config: { "sap-ushell-plugin-type": "UserDefaults" }
            },

            UserDefaultPlugin2: {
                component: "sap.ushell.services.DummyComponentPluginSample2",
                config: { "sap-ushell-plugin-type": "UserDefaults" }
            },

            SomeOtherPlugin: { component: "sap.ushell.services.DummyComponentPluginSample3" }
        });

        this.PluginManager.loadPlugins("UserDefaults")
            .done(function (aResults) {
                assert.ok(true, "The promise should resolve even if one of the plugins crached");
                assert.strictEqual(aResults.length, 2, "2 results in resolved array");
                assert.strictEqual(aResults[0].pluginName, "UserDefaultPlugin1");
                assert.strictEqual(aResults[0].success, true);
                assert.strictEqual(aResults[1].pluginName, "UserDefaultPlugin2");
                assert.strictEqual(aResults[1].success, false);
                assert.strictEqual(aResults[1].error.message, "I fail on purpose!");
            }).fail(function () {
                assert.notOk(true, "State of promise should not be 'rejected'");
            })
            .always(fnDone);
    });

    QUnit.test("Bootstrap Plugin: use getUserDefaultPluginsPromise to wait for bootstrap promises", function (assert) {
        var fnDone = assert.async();

        var sState = "beforeResolution";

        // we want to be able to resolve any promise given at any time
        sandbox.stub(this.Ui5ComponentLoader, "createComponent").callsFake(function (oConfig) {
            var oCreateComponentDeferred = new jQuery.Deferred();
            var oLoadedComponent = { componentHandle: { componentOptions: {} } };

            setTimeout(function () {
                sState = "duringResolution";
                if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample1") {
                    oCreateComponentDeferred.resolve(oLoadedComponent);
                } else if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample2") {
                    oCreateComponentDeferred.resolve(oLoadedComponent);
                } else if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample3") {
                    oCreateComponentDeferred.reject();
                }
            }, 0);

            return oCreateComponentDeferred.promise();
        });

        this.PluginManager.registerPlugins({
            UserDefaultPlugin1: {
                component: "sap.ushell.services.DummyComponentPluginSample1",
                config: { "sap-ushell-plugin-type": "UserDefaults" }
            },

            UserDefaultPlugin2: {
                component: "sap.ushell.services.DummyComponentPluginSample2",
                config: { "sap-ushell-plugin-type": "UserDefaults" }
            },

            SomeOtherPlugin: { component: "sap.ushell.services.DummyComponentPluginSample3" }
        });

        this.PluginManager.loadPlugins("UserDefaults")
            .done(function () {
                assert.ok(true, "State of UserDefaults promise is 'resolved'!");
                assert.strictEqual(sState, "duringResolution", "Promise was not resolved early");
            })
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                throw error;
            })
            .always(fnDone);

        this.PluginManager.loadPlugins("UserDefaults");
    });

    QUnit.test("Inject extensions of the launchpad in _instantiateComponent method", function (assert) {
        var fnDone = assert.async();

        var oDeferredXhrAuthentication = new jQuery.Deferred();

        oDeferredXhrAuthentication.resolve();
        sandbox.stub(this.PluginManager, "_handleXhrAuthentication").returns(oDeferredXhrAuthentication);
        var oSrvcUi5ComponentLoaderStub = sandbox.stub(this.Ui5ComponentLoader, "createComponent").returns(new jQuery.Deferred().resolve().promise());

        var oPlugin = {
            component: "sap.test.TestComponent",
            url: "/sap/test/url/to/Component",
            config: {}
        };

        // act
        this.PluginManager._instantiateComponent(oPlugin, new jQuery.Deferred())
            .done(function () {
                assert.ok(oSrvcUi5ComponentLoaderStub.calledOnce, "createComponent was called");
                assert.ok(oSrvcUi5ComponentLoaderStub.firstCall.args[0].hasOwnProperty("getExtensions"), "Extensions was added");
                assert.strictEqual(typeof oSrvcUi5ComponentLoaderStub.firstCall.args[0].getExtensions, "function", "getExtensions is a function");
            })
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                throw error;
            })
            .always(fnDone);
    });

    QUnit.test("Bootstrap Plugin: cFLP yellow box", function (assert) {
        var fnDone = assert.async();

        // we want to be able to resolve any promise given at any time
        sandbox.stub(this.Ui5ComponentLoader, "createComponent").callsFake(function (oConfig) {
            var oCreateComponentDeferred = new jQuery.Deferred();
            var oLoadedComponent = { componentHandle: { componentOptions: {} } };

            setTimeout(function () {
                if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample1" ||
                    oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample2" ||
                    oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample3" ||
                    oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample4") {
                    oCreateComponentDeferred.resolve(oLoadedComponent);
                } else {
                    oCreateComponentDeferred.reject();
                }
            }, 0);

            return oCreateComponentDeferred.promise();
        });

        this.PluginManager.registerPlugins({
            Plugin1: {
                component: "sap.ushell.services.DummyComponentPluginSample1"
            },

            Plugin2: {
                component: "sap.ushell.services.DummyComponentPluginSample2",
                config: {}
            },

            Plugin3: {
                component: "sap.ushell.services.DummyComponentPluginSample3",
                config: {
                    "sap-plugin-agent": true,
                    "sap-plugin-agent-id": "MyPlugin3"
                }
            },

            Plugin4: {
                component: "sap.ushell.services.DummyComponentPluginSample4",
                config: {
                    "sap-plugin-agent": true
                }
            },

            Plugin5: {
                component: "sap.ushell.services.DummyComponentPluginSample5",
                enabled: false,
                config: {
                    "sap-plugin-agent": true,
                    "sap-plugin-agent-id": "MyPlugin5"
                }
            }
        });
        this.PluginManager.loadPlugins("RendererExtensions")
            .done(function () {
                assert.strictEqual(this.PluginManager._getNamesOfPluginsWithAgents(), "MyPlugin3,Plugin4", "sap plugins agents name list prepared properly");
            }.bind(this))
            .fail(function () {
                assert.notOk(true, "plugins were not created properly");
            })
            .always(fnDone);
    });

    QUnit.module("cFLP Tests", {
        beforeEach: function () {
            this.oOldConfig = window["sap-ushell-config"];
        },
        afterEach: function () {
            window["sap-ushell-config"] = this.oOldConfig;
            sandbox.restore();
        }
    });

    QUnit.test("Bootstrap Plugin: cFLP blue box", function (assert) {
        var fnDone = assert.async();

        window["sap-ushell-config"] = {
            services: {
                PluginManager: {
                    config: {
                        isBlueBox: true
                    }
                }
            }
        };

        Container.init("local")
            .then(function () {
                Promise.all([
                    Container.getServiceAsync("PluginManager"),
                    Container.getServiceAsync("Ui5ComponentLoader")
                ])
                    .then(function (aServices) {
                        var oPluginManager = aServices[0];
                        var oUi5ComponentLoader = aServices[1];

                        // we want to be able to resolve any promise given at any time
                        sandbox.stub(oUi5ComponentLoader, "createComponent").callsFake(function (oConfig) {
                            var oCreateComponentDeferred = new jQuery.Deferred();
                            var oLoadedComponent = { componentHandle: { componentOptions: {} } };

                            setTimeout(function () {
                                if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample1" ||
                                    oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample2" ||
                                    oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample4" ||
                                    oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample5") {
                                    oCreateComponentDeferred.resolve(oLoadedComponent);
                                } else {
                                    oCreateComponentDeferred.reject();
                                }
                            }, 0);

                            return oCreateComponentDeferred.promise();
                        });

                        sandbox.stub(URLSearchParams.prototype, "get").returns("Plugin4,MyPlugin5");
                        oPluginManager.registerPlugins({
                            Plugin1: {
                                component: "sap.ushell.services.DummyComponentPluginSample1"
                            },

                            Plugin2: {
                                component: "sap.ushell.services.DummyComponentPluginSample2",
                                config: {}
                            },

                            Plugin3: {
                                component: "sap.ushell.services.DummyComponentPluginSample3",
                                config: {
                                    "sap-plugin-agent": true,
                                    "sap-plugin-agent-id": "MyPlugin3"
                                }
                            },

                            Plugin4: {
                                component: "sap.ushell.services.DummyComponentPluginSample4",
                                config: {
                                    "sap-plugin-agent": true
                                }
                            },

                            Plugin5: {
                                component: "sap.ushell.services.DummyComponentPluginSample5",
                                config: {
                                    "sap-plugin-agent": true,
                                    "sap-plugin-agent-id": "MyPlugin5"
                                }
                            }
                        });
                        oPluginManager.loadPlugins("RendererExtensions")
                            .done(function () {
                                assert.strictEqual(oPluginManager._getNamesOfPluginsWithAgents(), "", "must be empty");
                            })
                            .fail(function (error) {
                                assert.notOk(true, "plugins were not created properly");
                                throw error;
                            })
                            .always(fnDone);
                    });
            });
    });
});
