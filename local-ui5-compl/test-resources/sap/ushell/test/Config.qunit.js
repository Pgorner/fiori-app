// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/test/utils",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config"
], async function (
    testUtils,
    JSONModel,
    Config
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox();

    const oInitialNavigationConfig = {
        enableInPlaceForClassicUIs: {
            GUI: true,
            WDA: false,
            WCF: false
        },
        enableWdaCompatibilityMode: false,
        enableWdaLocalResolution: true,
        enableWebguiLocalResolution: true,
        flpURLDetectionPattern: "[/]FioriLaunchpad.html[^#]+#[^-]+?-[^-]+"
    };
    const oUshellConfig = testUtils.overrideObject({}, {
        "/services/ClientSideTargetResolution/config": oInitialNavigationConfig
    });

    window["sap-ushell-config"] = oUshellConfig;
    Config._resetContract();

    QUnit.module("sap/ushell/Config", {
        afterEach: function () {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("Initial contract from sap-ushell-config", (assert) => {
        assert.deepEqual(Config.last("/core/navigation"), oInitialNavigationConfig, "the initial config is set up correctly");
    });

    QUnit.test("register new configuration", (assert) => {
        let bIsThrowException = false;
        const oNewContract = testUtils.overrideObject({}, {
            "/a/b/c": true
        });

        Config.registerConfiguration("core", oNewContract);

        try {
            Config.last("/core/navigation");
        } catch (ex) {
            bIsThrowException = true;
        }

        assert.ok(bIsThrowException, "the old configuration contract should be removed");
        assert.ok(Config.last("/a/b/c"), "the new configuration contract should be applied");
    });

    QUnit.module("createModel", {
        afterEach: function () {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("creates a model when created from configuration", (assert) => {
        // Arrange
        const oConfigurationContract = {
            root: {
                core: {
                    childA: {
                        childB: "value"
                    }
                }
            }
        };
        const oExpectedModelData = {
            childA: {
                childB: "value"
            }
        };

        Config.registerConfiguration(null, oConfigurationContract);

        // Act
        const oModel = Config.createModel("/root/core", JSONModel);

        // Assert
        assert.ok(true, "exception was not thrown");
        assert.deepEqual(oModel.getData(), oExpectedModelData, "obtained the expected data from the model");
    });

    QUnit.test("creates a model when created from configuration and value is changed afterwards via emit", (assert) => {
        // Arrange
        const oConfigurationContract = {
            root: {
                core: {
                    childA: {
                        childB: "value"
                    }
                }
            }
        };
        const oExpectedModelData = {
            childA: {
                childB: "nextValue"
            }
        };

        Config.registerConfiguration(null, oConfigurationContract);

        // Act
        const oModel = Config.createModel("/root/core", JSONModel);

        assert.ok(true, "exception was not thrown");

        return new Promise((fnDone) => {
            Config.emit("/root/core/childA/childB", "nextValue");
            Config.wait("/root/core/childA/childB").then(() => {
                Config.once("/root/core/childA/childB").do(fnDone);
            });
        }).then(() => {
            // Assert
            assert.deepEqual(oModel.getData(), oExpectedModelData, "obtained the expected data from the model");
        });
    });

    QUnit.test("creates a model when called on a leaf node", (assert) => {
        // Arrange
        const oConfigurationContract = {
            root: {
                core: {
                    childA: {
                        childB: "value"
                    }
                }
            }
        };

        Config.registerConfiguration(null, oConfigurationContract);

        // Act & Assert
        assert.throws(() => {
            Config.createModel("/root/core/childA/childB", JSONModel);
        });
    });

    QUnit.test("creates a model when called with an object", (assert) => {
        // Arrange
        const oConfigurationContract = {
            root: {
                childA: {
                    a: 123
                },
                childB: {
                    b: 456
                }
            }
        };
        const oExpectedModelData = {
            prop1: 123,
            prop2: 456
        };

        Config.registerConfiguration(null, oConfigurationContract);

        // Act
        const oModel = Config.createModel({
            prop1: "/root/childA/a",
            prop2: "/root/childB/b"
        }, JSONModel);

        // Assert
        assert.ok(true, "exception was not thrown");
        assert.deepEqual(oModel.getData(), oExpectedModelData, "obtained the expected data from the model");
    });

    QUnit.test("creates a model when called with an object and configuration option is changed", (assert) => {
        // Arrange
        const oConfigurationContract = {
            root: {
                childA: {
                    a: "AAA"
                },
                childB: {
                    b: "BBB"
                }
            }
        };
        const oExpectedModelData = {
            prop1: "nextValue",
            prop2: "BBB"
        };

        Config.registerConfiguration(null, oConfigurationContract);

        // Act
        const oModel = Config.createModel({
            prop1: "/root/childA/a",
            prop2: "/root/childB/b"
        }, JSONModel);

        assert.ok(true, "exception was not thrown");

        return new Promise((fnDone) => {
            Config.emit("/root/childA/a", "nextValue");
            Config.wait("/root/childA/a").then(() => {
                Config.once("/root/childA/a").do(fnDone);
            });
        }).then(() => {
            // Assert
            assert.deepEqual(oModel.getData(), oExpectedModelData, "obtained the expected data from the model");
        });
    });

    QUnit.module("Model setData overwrite", {
        afterEach: function () {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("is called on a defined via single path definition", (assert) => {
        // Arrange
        const oConfigurationContract = {
            a: {
                b: true,
                c: {
                    f: undefined,
                    g: 1,
                    h: false
                }
            }
        };

        Config.registerConfiguration(null, oConfigurationContract);

        const oModel = Config.createModel("/a/c", JSONModel);

        // Act & Assert
        assert.throws(() => {
            oModel.setData("/h", true);
        });
    });

    QUnit.module("Model setProperty overwrite", {
        afterEach: function () {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("is called on a model defined via single path definition", (assert) => {
        // Arrange
        const oConfigurationContract = {
            a: {
                b: true
            }
        };
        const oExpectedModelData = {
            b: false
        };

        Config.registerConfiguration(null, oConfigurationContract);

        const oModel = Config.createModel("/a", JSONModel);

        // Act
        oModel.setProperty("/b", false);

        // Assert
        return new Promise((resolve) => {
            Config.once("/a").do(() => {
                assert.deepEqual(Config.last("/a"), oExpectedModelData, "obtained the expected data from the model");
                resolve();
            });
        });
    });

    QUnit.test("is called on a model created with multi-path definition", (assert) => {
        // Arrange
        const oConfigurationContract = {
            a: {
                b: true,
                c: {
                    f: undefined,
                    g: 1,
                    h: { k: {} }
                }
            }
        };
        const oExpectedModelData = {
            b: true,
            c: {
                f: false,
                g: 1,
                h: { k: [1, 2, 3] }
            }
        };

        Config.registerConfiguration(null, oConfigurationContract);

        const oModel = Config.createModel({
            hello: "/a/c/h",
            hi: "/a"
        }, JSONModel);

        // Act
        oModel.setProperty("/hello", { k: [1, 2, 3] });
        oModel.setProperty("/hi/c/f", false);

        // Assert
        return new Promise((resolve) => {
            Config.once("/a").do(() => {
                assert.deepEqual(Config.last("/a"), oExpectedModelData, "obtained the expected data from the model");
                resolve();
            });
        });
    });

    QUnit.test("is called with relative path and a binding context", (assert) => {
        // Arrange
        const oConfigurationContract = {
            a: {
                b: true,
                c: {
                    f: "123",
                    g: 1,
                    h: false
                }
            }
        };
        const oExpectedModelData = {
            b: true,
            c: {
                f: "123",
                g: 1,
                h: true /* updated */
            }
        };

        Config.registerConfiguration(null, oConfigurationContract);

        const oModel = Config.createModel("/a", JSONModel);

        const oFakeBindingContext = {
            isA: function () { return "sap.ui.model.Context"; },
            getPath: function () { return "/c"; }
        };

        // Act
        oModel.setProperty("h", true, oFakeBindingContext);

        // Assert
        return new Promise((resolve) => {
            Config.once("/a").do(() => {
                assert.deepEqual(Config.last("/a"), oExpectedModelData, "obtained the expected data from the model");
                resolve();
            });
        });
    });

    QUnit.test("is called with no binding context and absolute path that does not fully belong to the contract", (assert) => {
        // Arrange
        const oConfigurationContract = {
            a: {
                b: true,
                c: {
                    f: "123",
                    g: 1,
                    h: false
                }
            }
        };
        const oExpectedModelData = {
            b: true,
            c: {
                f: "123",
                g: 1,
                h: [{ test: "value2" }]
            }
        };

        Config.registerConfiguration(null, oConfigurationContract);

        const oModel = Config.createModel("/a", JSONModel);

        // Act
        oModel.setProperty("/c/h", [{ test: "value1" }]);

        const oDoable = Config.on("/a/c/h");
        oDoable.do((aArray) => {
            if (typeof aArray !== "object") {
                return;
            }
            oDoable.off();

            oModel.setProperty("/c/h/0/test", "value2");
        });

        // Assert
        return new Promise((resolve) => {
            Config.once("/a").do(() => {
                assert.deepEqual(Config.last("/a"), oExpectedModelData, "obtained the expected data from the model");
                resolve();
            });
        });
    });

    QUnit.test("is called with an absolute path and a binding context", (assert) => {
        // Arrange
        const oConfigurationContract = {
            a: {
                b: true,
                c: {
                    f: "123",
                    g: 1,
                    h: false
                }
            }
        };
        const oExpectedModelData = {
            b: "UPDATED",
            c: {
                f: "123",
                g: 1,
                h: false
            }
        };

        Config.registerConfiguration(null, oConfigurationContract);

        const oModel = Config.createModel("/a", JSONModel);

        const oFakeBindingContext = {
            isA: function () { return "sap.ui.model.Context"; },
            getPath: function () { return "/c"; }
        };

        // Act
        // Because the path is absolute, the binding context is ignored.
        oModel.setProperty("/b", "UPDATED", oFakeBindingContext);

        // Assert
        return new Promise((resolve) => {
            Config.once("/a").do(() => {
                assert.deepEqual(Config.last("/a"), oExpectedModelData, "obtained the expected data from the model");
                resolve();
            });
        });
    });

    QUnit.test("is called with a deeper binding context", (assert) => {
        // Arrange
        const oConfigurationContract = {
            a: {
                b: true,
                c: {
                    f: { g: { h: { i: 100 } } },
                    g: 1,
                    h: false
                }
            }
        };
        const oExpectedModelData = {
            b: true,
            c: {
                f: { g: { h: { i: 200 } } },
                g: 1,
                h: false
            }
        };

        Config.registerConfiguration(null, oConfigurationContract);

        const oModel = Config.createModel("/a/c", JSONModel);

        const oFakeBindingContext = {
            isA: function () { return "sap.ui.model.Context"; },
            getPath: function () { return "/f/g/h"; }
        };

        // Act
        oModel.setProperty("i", 200, oFakeBindingContext);

        // Assert
        return new Promise((resolve) => {
            Config.once("/a").do(() => {
                assert.deepEqual(Config.last("/a"), oExpectedModelData, "obtained the expected data from the model");
                resolve();
            });
        });
    });

    QUnit.test("is called with binding context after setting a deep property on the model", (assert) => {
        // Arrange
        const oConfigurationContract = {
            a: {
                b: true,
                c: {
                    f: {},
                    g: 1,
                    h: false
                }
            }
        };
        const oExpectedModelData = {
            b: true,
            c: {
                f: { g: { h: { i: 200 } } },
                g: 1,
                h: false
            }
        };

        Config.registerConfiguration(null, oConfigurationContract);

        const oModel = Config.createModel("/a/c", JSONModel);

        const oFakeBindingContext = {
            isA: function () { return "sap.ui.model.Context"; },
            getPath: function () { return "/f"; }
        };

        // Act
        // set deep property
        oModel.setProperty("/f", { g: { h: { i: 100 } } });
        oModel.setProperty("g/h/i", 200, oFakeBindingContext);

        // Assert
        return new Promise((resolve) => {
            Config.once("/a").do(() => {
                assert.deepEqual(Config.last("/a"), oExpectedModelData, "obtained the expected data from the model");
                resolve();
            });
        });
    });

    QUnit.module("Model getProperty overwrite", {
        afterEach: function () {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("Returns the new value sync for models created with single path definition after emit", async function (assert) {
        // Arrange
        const oConfigurationContract = {
            root: {
                childA: {
                    a: 123
                },
                childB: {
                    b: 456
                }
            }
        };
        const sExpectedModelData = "updatedValue";

        Config.registerConfiguration(null, oConfigurationContract);

        const oModel = Config.createModel({
            prop1: "/root/childA/a",
            prop2: "/root/childB/b"
        }, JSONModel);

        // Act
        Config.emit("/root/childA/a", "updatedValue");

        const sConfigLastValue = Config.last("/root/childA/a");
        const sModelValue = oModel.getProperty("/prop1");

        // Assert
        assert.deepEqual(sConfigLastValue, sExpectedModelData, "obtained the expected data from Config.last");
        assert.deepEqual(sModelValue, sExpectedModelData, "obtained the expected data from the model");
    });

    QUnit.test("Returns the new value sync for models created with multi-path definition after emit", async function (assert) {
        // Arrange
        const oConfigurationContract = {
            a: {
                b: true
            }
        };
        const bExpectedModelData = false;

        Config.registerConfiguration(null, oConfigurationContract);

        const oModel = Config.createModel("/a", JSONModel);

        // Act
        Config.emit("/a/b", false);

        const bConfigLastValue = Config.last("/a/b");
        const bModelValue = oModel.getProperty("/b");

        // Assert
        assert.deepEqual(bConfigLastValue, bExpectedModelData, "obtained the expected data from Config.last");
        assert.deepEqual(bModelValue, bExpectedModelData, "obtained the expected data from the model");
    });


    QUnit.test("Returns the new value sync for models created with single path definition after setProperty", async function (assert) {
        // Arrange
        const oConfigurationContract = {
            root: {
                childA: {
                    a: 123
                },
                childB: {
                    b: 456
                }
            }
        };
        const sExpectedModelData = "updatedValue";

        Config.registerConfiguration(null, oConfigurationContract);

        const oModel = Config.createModel({
            prop1: "/root/childA/a",
            prop2: "/root/childB/b"
        }, JSONModel);

        // Act
        oModel.setProperty("/prop1", "updatedValue");

        const sConfigLastValue = Config.last("/root/childA/a");
        const sModelValue = oModel.getProperty("/prop1");

        // Assert
        assert.deepEqual(sConfigLastValue, sExpectedModelData, "obtained the expected data from Config.last");
        assert.deepEqual(sModelValue, sExpectedModelData, "obtained the expected data from the model");
    });

    QUnit.test("Returns the new value sync for models created with multi-path definition after setProperty", async function (assert) {
        // Arrange
        const oConfigurationContract = {
            a: {
                b: true
            }
        };
        const bExpectedModelData = false;

        Config.registerConfiguration(null, oConfigurationContract);

        const oModel = Config.createModel("/a", JSONModel);

        // Act
        oModel.setProperty("/b", false);

        const bConfigLastValue = Config.last("/a/b");
        const bModelValue = oModel.getProperty("/b");

        // Assert
        assert.deepEqual(bConfigLastValue, bExpectedModelData, "obtained the expected data from Config.last");
        assert.deepEqual(bModelValue, bExpectedModelData, "obtained the expected data from the model");
    });

    QUnit.module("Model getData overwrite", {
        afterEach: function () {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("Returns the new value sync for models created with single path definition after emit", async function (assert) {
        // Arrange
        const oConfigurationContract = {
            root: {
                childA: {
                    a: 123
                },
                childB: {
                    b: 456
                }
            }
        };
        const oExpectedModelData = {
            prop1: "updatedValue",
            prop2: 456
        };

        Config.registerConfiguration(null, oConfigurationContract);

        const oModel = Config.createModel({
            prop1: "/root/childA/a",
            prop2: "/root/childB/b"
        }, JSONModel);

        // Act
        Config.emit("/root/childA/a", "updatedValue");

        const oConfigLastValue = {
            prop1: Config.last("/root/childA/a"),
            prop2: Config.last("/root/childB/b")
        };
        const oModelValue = oModel.getData();

        // Assert
        assert.deepEqual(oConfigLastValue, oExpectedModelData, "obtained the expected data from Config.last");
        assert.deepEqual(oModelValue, oExpectedModelData, "obtained the expected data from the model");
    });

    QUnit.test("Returns the new value sync for models created with multi-path definition after emit", async function (assert) {
        // Arrange
        const oConfigurationContract = {
            a: {
                b: true
            }
        };
        const oExpectedModelData = {
            b: false
        };

        Config.registerConfiguration(null, oConfigurationContract);

        const oModel = Config.createModel("/a", JSONModel);

        // Act
        Config.emit("/a/b", false);

        const oConfigLastValue = Config.last("/a");
        const oModelValue = oModel.getData();

        // Assert
        assert.deepEqual(oConfigLastValue, oExpectedModelData, "obtained the expected data from Config.last");
        assert.deepEqual(oModelValue, oExpectedModelData, "obtained the expected data from the model");
    });


    QUnit.test("Returns the new value sync for models created with single path definition after setProperty", async function (assert) {
        // Arrange
        const oConfigurationContract = {
            root: {
                childA: {
                    a: 123
                },
                childB: {
                    b: 456
                }
            }
        };
        const oExpectedModelData = {
            prop1: "updatedValue",
            prop2: 456
        };

        Config.registerConfiguration(null, oConfigurationContract);

        const oModel = Config.createModel({
            prop1: "/root/childA/a",
            prop2: "/root/childB/b"
        }, JSONModel);

        // Act
        oModel.setProperty("/prop1", "updatedValue");

        const oConfigLastValue = {
            prop1: Config.last("/root/childA/a"),
            prop2: Config.last("/root/childB/b")
        };
        const oModelValue = oModel.getData();

        // Assert
        assert.deepEqual(oConfigLastValue, oExpectedModelData, "obtained the expected data from Config.last");
        assert.deepEqual(oModelValue, oExpectedModelData, "obtained the expected data from the model");
    });

    QUnit.test("Returns the new value sync for models created with multi-path definition after setProperty", async function (assert) {
        // Arrange
        const oConfigurationContract = {
            a: {
                b: true
            }
        };
        const oExpectedModelData = {
            b: false
        };

        Config.registerConfiguration(null, oConfigurationContract);

        const oModel = Config.createModel("/a", JSONModel);

        // Act
        oModel.setProperty("/b", false);

        const oConfigLastValue = Config.last("/a");
        const oModelValue = oModel.getData();

        // Assert
        assert.deepEqual(oConfigLastValue, oExpectedModelData, "obtained the expected data from Config.last");
        assert.deepEqual(oModelValue, oExpectedModelData, "obtained the expected data from the model");
    });

});
