// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/components/shell/Settings/userDefaults/UserDefaultsForm",
    "sap/ui/comp/smartform/SmartForm",
    "sap/ui/model/json/JSONModel"
], function (UserDefaultsForm, SmartForm, JSONModel) {
    "use strict";

    /* global QUnit sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("constructor");

    QUnit.test("creates a new UserDefaultsForm", function (assert) {
        // Act
        var oUserDefaultsForm = new UserDefaultsForm();

        // Assert
        assert.ok(oUserDefaultsForm instanceof UserDefaultsForm, "The UserDefaultsForm instance was created.");
        assert.ok(
            oUserDefaultsForm.getMetadata().getProperty("persistencyKey"),
            "The UserDefaultsForm has the persistencyKey property."
        );
    });

    QUnit.module("init", {
        beforeEach: function () {
            this.oUserDefaultsForm = new UserDefaultsForm();
        }
    });

    QUnit.test("creates a new SmartForm in the _smartForm aggregation", function (assert) {
        // Act
        this.oUserDefaultsForm.init();

        // Assert
        assert.ok(this.oUserDefaultsForm.getAggregation("_smartForm") instanceof SmartForm, "A SmartForm instance was created.");
    });

    QUnit.module("fetchVariant", {
        beforeEach: function () {
            this.oUserDefaultsForm = new UserDefaultsForm();

            this.oGetNameStub = sandbox.stub()
                .onCall(0).returns("parameterA")
                .onCall(1).returns("parameterB")
                .onCall(2).returns("parameterC")
                .onCall(3).returns("parameter D");

            this.oMockInput = {
                getName: this.oGetNameStub
            };

            this.oModel = new JSONModel({
                // extended value and simple value
                parameterA: {
                    valueObject: {
                        extendedValue: {
                            Ranges: [{
                                to: 1,
                                from: 0
                            }]
                        },
                        value: "valueA"
                    }
                },
                // simple value only
                parameterB: {
                    valueObject: {
                        value: "valueB"
                    }
                },
                // extended value only
                parameterC: {
                    valueObject: {
                        extendedValue: {
                            Ranges: [{
                                to: 100,
                                from: 50
                            }]
                        }
                    }
                },
                // simple value and parameter with space
                "parameter D": {
                    valueObject: {
                        value: "value D"
                    }
                }
            });

            sandbox.stub(this.oUserDefaultsForm, "getAggregation").returns({
                getModel: sandbox.stub().returns(this.oModel)
            });

            sandbox.stub(this.oUserDefaultsForm, "_getFieldControls")
                .returns([
                    this.oMockInput,
                    this.oMockInput,
                    this.oMockInput,
                    this.oMockInput,
                    this.oMockInput
                ]);
        },

        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns an object in the expected structure", function (assert) {
        // Act
        var oResult = this.oUserDefaultsForm.fetchVariant();

        // Assert
        assert.deepEqual(
            oResult,
            {
                parameterA: {
                    value: "valueA",
                    additionalValues: {
                        Ranges: [{
                            to: 1,
                            from: 0
                        }]
                    }
                },
                parameterB: {
                    value: "valueB"
                },
                parameterC: {
                    value: undefined,
                    additionalValues: {
                        Ranges: [{
                            to: 100,
                            from: 50
                        }]
                    }
                },
                "parameter D": {
                    value: "value D"
                },
                // only name no value at all
                undefined: {
                    value: undefined
                }
            },
            "The resulting object had the expected structure."
        );
    });

    QUnit.module("applyVariant", {
        beforeEach: function () {
            this.oUserDefaultsForm = new UserDefaultsForm();

            this.oModel = new JSONModel({
                parameterA: {
                    valueObject: {
                        value: ""
                    }
                },
                parameterB: {
                    valueObject: {
                        value: ""
                    }
                },
                parameterC: {
                    valueObject: {
                        value: ""
                    }
                },
                "parameter D": {
                    valueObject: {
                        value: ""
                    }
                },
                parameterE: {
                    valueObject: {
                        value: "",
                        extendedValue: {
                            Ranges: [{
                                to: 10,
                                from: 0
                            }]
                        }
                    }
                },
                parameterF: {
                    valueObject: {
                        value: ""
                    }
                }
            });

            sandbox.stub(this.oUserDefaultsForm, "getAggregation").returns({
                getModel: sandbox.stub().returns(this.oModel)
            });

            this.oGetNameStub = sandbox.stub()
                .onCall(0).returns("parameterA")
                .onCall(1).returns("parameterB")
                .onCall(2).returns("parameterC")
                .onCall(3).returns("parameter D")
                .onCall(4).returns("parameterE")
                .onCall(5).returns("parameterF");

            this.oSetValueStub = sandbox.stub();

            this.oMockInput = {
                getName: this.oGetNameStub,
                setValue: this.oSetValueStub
            };

            sandbox.stub(this.oUserDefaultsForm, "_getFieldControls")
                .returns([
                    this.oMockInput,
                    this.oMockInput,
                    this.oMockInput,
                    this.oMockInput,
                    this.oMockInput
                ]);
        },

        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls setValue with the expected values", function (assert) {
        // Act
        this.oUserDefaultsForm.applyVariant({
            parameterF: undefined,
            parameterB: {
                value: "valueB"
            },
            parameterA: {
                value: "valueA",
                additionalValues: {
                    Ranges: [{
                        to: 1,
                        from: 0
                    }]
                }
            },
            "parameter D": {
                value: "value D"
            },
            parameterC: {
                value: "valueC",
                additionalValues: {
                    Ranges: [{
                        to: 100,
                        from: 50
                    }]
                }
            },
            parameterE: {
                value: "",
                additionalValues: {
                    Ranges: [{
                        to: 300,
                        from: 100
                    }]
                }
            }
        });

        // Assert
        assert.strictEqual(this.oSetValueStub.callCount, 5, "setValue was called 5 times.");
        assert.strictEqual(this.oSetValueStub.getCall(0).args[0], "valueA", "The first call had the expected value.");
        assert.strictEqual(this.oSetValueStub.getCall(1).args[0], "valueB", "The second call had the expected value.");
        assert.strictEqual(this.oSetValueStub.getCall(2).args[0], "valueC", "The third call had the expected value.");
        assert.strictEqual(this.oSetValueStub.getCall(3).args[0], "value D", "The fourth call had the expected value.");
        assert.strictEqual(this.oSetValueStub.getCall(4).args[0], "", "The fifth call had the expected value.");
        assert.deepEqual(this.oModel.getProperty("/parameterE/valueObject/extendedValue/Ranges"), [{
            to: 300,
            from: 100
        }], "The model entry for parameterE was correct");
        assert.deepEqual(this.oModel.getProperty("/parameterC/valueObject/extendedValue/Ranges"), [{
            to: 100,
            from: 50
        }], "The model entry for parameterC was correct");
        assert.deepEqual(this.oModel.getProperty("/parameterA/valueObject/extendedValue/Ranges"), [{
            to: 1,
            from: 0
        }], "The model entry for parameterA was correct");
    });

    QUnit.module("_getFieldControls", {
        beforeEach: function () {
            this.oUserDefaultsForm = new UserDefaultsForm();
            this.oSetValueStub = sandbox.stub();

            this.oMockInput1 = {
                getMetadata: sandbox.stub().returns({
                    getName: sandbox.stub().returns("sap.m.Input")
                })
            };
            this.oMockInput2 = {
                getMetadata: sandbox.stub().returns({
                    getName: sandbox.stub().returns("sap.ui.comp.smartfield.SmartField")
                })
            };
            this.oMockInput3 = {
                getMetadata: sandbox.stub().returns({
                    getName: sandbox.stub().returns("sap.m.Popover")
                })
            };
            this.oMockInput4 = {
                getMetadata: sandbox.stub().returns({
                    getName: sandbox.stub().returns("sap.ui.core.Icon")
                })
            };
            this.oMockInput5 = {
                getMetadata: sandbox.stub().returns({
                    getName: sandbox.stub().returns("sap.m.Input")
                })
            };
            this.oMockInput6 = {
                getMetadata: sandbox.stub().returns({
                    getName: sandbox.stub().returns("sap.m.Popover")
                })
            };

            sandbox.stub(this.oUserDefaultsForm, "getControlsByFieldGroupId")
                .returns([
                    this.oMockInput1,
                    this.oMockInput2,
                    this.oMockInput3,
                    this.oMockInput4,
                    this.oMockInput5,
                    this.oMockInput6
                ]);
        },

        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Filters the non-relevant fields", function (assert) {
        // Act
        var aResults = this.oUserDefaultsForm._getFieldControls();

        // Assert
        assert.equal(aResults.length, 3, "The resulting array had the expected length");
        assert.equal(aResults[0].getMetadata().getName(), "sap.m.Input", "The input was in the first place.");
        assert.equal(aResults[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", "The smart input was in the second place.");
        assert.equal(aResults[2].getMetadata().getName(), "sap.m.Input", "The input was in the third place.");
    });
});
