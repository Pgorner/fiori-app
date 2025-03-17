// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for Personalization
 * @deprecated since 1.120
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/Manifest",
    "sap/ui/core/UIComponent",
    "sap/ui/thirdparty/jquery",
    "sap/ui/thirdparty/sinon-4",
    "sap/ushell/services/Personalization",
    "sap/ushell/services/_Personalization/utils",
    "sap/ushell/services/_Personalization/PersonalizationContainer",
    "sap/ushell/services/_Personalization/Variant",
    "sap/ushell/shells/demo/fioriDemoConfig",
    "sap/ushell/test/utils",
    "sap/ushell/test/services/_Personalization/AdapterContainerMock",
    "sap/ushell/test/services/_Personalization/utils",
    "sap/ushell/utils"
], function (
    Log,
    DateFormat,
    Manifest,
    UIComponent,
    jQuery,
    sinon,
    Personalization,
    personalizationUtils,
    PersonalizationContainer,
    Variant,
    fioriDemoConfig,
    testUtils,
    AdapterContainerMock,
    oPersonalizationTestUtils,
    utils
) {
    "use strict";

    /* global QUnit */

    var sandbox = sinon.createSandbox({});

    var sContainerPrefix = "sap.ushell.personalization#";
    var sContainer = "sap.ushell.test.personalization";
    var sItem = "serviceTest";
    var sItemKey = "ItemKey";
    var sABAPTimeSampFormat = "yyyyMMddHHmmss";
    var sVariantKey = "VariantKey";
    var sVariantSetKey = "variantSetKey";
    var sVariantName = "Variant Name";
    var sCachedConfig;
    var sDefaultAppVariantAdapter = "sap.ushell.adapters.AppVariantPersonalizationAdapter";

    // Contains mocked dependencies
    var oMock = { AdapterContainerMock: AdapterContainerMock }; // allows to spy on constructor

    //  ............................................................................
    //
    //             Transient Personalizer
    //
    //  ............................................................................

    QUnit.module("Personalization: TransientPersonalizer", {
        beforeEach: function () {
            this.oItemValue = { v1: "false" };
            this.oTransientPersonalizer = new Personalization(null).getTransientPersonalizer();
        }
    });

    QUnit.test("setValue/getValue", function (assert) {
        this.oTransientPersonalizer.setValue(this.oItemValue);
        assert.equal(this.oItemValue, this.oTransientPersonalizer.getValue(),
            "getValue returned the previous set value correctly");
    });

    QUnit.test("setPersData + getValue", function (assert) {
        return this.oTransientPersonalizer.setPersData(this.oItemValue).done(function () {
            assert.deepEqual(this.oItemValue, this.oTransientPersonalizer.getValue(), "Written data was read");
        }.bind(this));
    });

    QUnit.test("setValue + getPersData", function (assert) {
        this.oTransientPersonalizer.setValue(this.oItemValue);
        return this.oTransientPersonalizer.getPersData().done(function (oReadValue) {
            assert.deepEqual(this.oItemValue, oReadValue, "Written data was read");
        }.bind(this));
    });

    QUnit.test("setPersData, getPersData, delPersData", function (assert) {
        return this.oTransientPersonalizer.setPersData(this.oItemValue).done(function () {
            assert.deepEqual(this.oItemValue, this.oTransientPersonalizer.getValue(), "Pers data was written");
            return this.oTransientPersonalizer.getPersData().done(function (oReadValue) {
                assert.deepEqual(this.oItemValue, oReadValue, "Pers data was read");
                return this.oTransientPersonalizer.delPersData().done(function () {
                    assert.deepEqual(undefined, this.oTransientPersonalizer.getValue(), "Pers data was deleted");
                }.bind(this));
            }.bind(this));
        }.bind(this));
    });

    //  ............................................................................
    //
    //               Personalizer
    //
    //  ............................................................................

    QUnit.module("Personalization: Personalizer", {
        beforeEach: function () {
            oPersonalizationTestUtils.mockGetService();

            var PersonalizationAdapterMock = oPersonalizationTestUtils
                .createPersonalizationAdapterMock(AdapterContainerMock);

            this.oAdapter = new PersonalizationAdapterMock();
            this.oService = new Personalization(this.oAdapter);
            this.oPersId = {
                container: sContainer,
                item: sItem
            };
            this.oPersonalizer = this.oService.getPersonalizer(this.oPersId, { validity: Infinity });
            return this.oPersonalizer.delPersData().then(function () {
                sandbox.stub(sap.ui, "require");
            });
        },
        afterEach: function (assert) {
            var done = assert.async();
            oPersonalizationTestUtils.restoreGetService();
            sandbox.restore();
            done();
        }
    });

    QUnit.test("_configureAppVariantStorage works as expected when empty configuration", function (assert) {
        // Act
        var oAppVariantConfig = this.oService._configureAppVariantStorage({});

        // Assert
        assert.strictEqual(oAppVariantConfig, undefined, "configuration was undefined");
        assert.notOk(sap.ui.require.calledWith([sDefaultAppVariantAdapter]), "sap.ui.require was not called with expected argumemts");
    });

    QUnit.test("_configureAppVariantStorage works as expected when no configuration", function (assert) {
        // Act
        var oAppVariantConfig = this.oService._configureAppVariantStorage();

        // Assert
        assert.ok(oAppVariantConfig, "obtained configuration");
        assert.strictEqual(oAppVariantConfig.hasOwnProperty("lazy"), true, "found lazy property");
        assert.strictEqual(oAppVariantConfig.lazy, true, "lazy property was true");
        assert.strictEqual(typeof oAppVariantConfig.create, "function", "lazy property was true");
        assert.notOk(sap.ui.require.calledWith([sDefaultAppVariantAdapter]), "sap.ui.require was not called with expected argumemts");
    });

    QUnit.test("_configureAppVariantStorage works as expected when adapter disabled by configuration", function (assert) {
        // Act
        var oAppVariantConfig = this.oService._configureAppVariantStorage({ enabled: false });

        // Assert
        assert.strictEqual(oAppVariantConfig, undefined, "configuration was undefined");
        assert.notOk(sap.ui.require.calledWith([sDefaultAppVariantAdapter]), "sap.ui.require was not called with expected argumemts");
    });

    QUnit.test("_configureAppVariantStorage works as expected when adapter enabled by configuration", function (assert) {
        // Act
        var oAppVariantConfig = this.oService._configureAppVariantStorage({
            enabled: true,
            adapter: { module: "some.adapter.Module" }
        });

        // Assert
        assert.ok(oAppVariantConfig, "obtained configuration");
        assert.strictEqual(oAppVariantConfig.hasOwnProperty("lazy"), true, "found lazy property");
        assert.strictEqual(oAppVariantConfig.lazy, true, "lazy property was true");
        assert.strictEqual(typeof oAppVariantConfig.create, "function", "lazy property was true");
        assert.notOk(sap.ui.require.calledWith(["some.adapter.Module"]), "sap.ui.require was not called with expected argumemts");
    });

    QUnit.test("_configureAppVariantStorage works as expected when adapter enabled but no adapter specified", function (assert) {
        // Act
        var oAppVariantConfig = this.oService._configureAppVariantStorage({ enabled: true });

        // Assert
        assert.ok(oAppVariantConfig, "obtained configuration");
        assert.strictEqual(oAppVariantConfig.hasOwnProperty("lazy"), true, "found lazy property");
        assert.strictEqual(oAppVariantConfig.lazy, true, "lazy property was true");
        assert.strictEqual(typeof oAppVariantConfig.create, "function", "lazy property was true");
        assert.notOk(sap.ui.require.calledWith([sDefaultAppVariantAdapter]), "sap.ui.require was not called with expected argumemts");
    });

    QUnit.test("set + get + delete", function (assert) {
        return this.oPersonalizer.setPersData(this.oItemValue)
            .done(function () {
                assert.ok(true, "Personalization data was set");
                return this.oPersonalizer.getPersData()
                    .done(function (oReadValue1) {
                        assert.ok(true, "Personalization data was gotten");
                        assert.deepEqual(oReadValue1, this.oItemValue, "Read value is the written value");
                        return this.oPersonalizer.delPersData()
                            .done(function () {
                                return this.oPersonalizer.getPersData()
                                    .done(function (oReadValue2) {
                                        assert.ok(true, "Personalization data was deleted");
                                        assert.equal(oReadValue2, undefined,
                                            "Personalization data was deleted - value is undefined");
                                    })
                                    .fail(function () {
                                        assert.ok(false, "'Error' fail function of getPersData #2 was triggered");
                                    });
                            }.bind(this))
                            .fail(function () {
                                assert.ok(false, "'Error' fail function of delPersData was triggered");
                            });
                    }.bind(this))
                    .fail(function () {
                        assert.ok(false, "'Error' fail function of getPersData #1 was triggered");
                    });
            }.bind(this))
            .fail(function () {
                assert.ok(false, "'Error' fail function of setPersData was triggered");
            });
    });

    QUnit.test("delete non-existent item", function (assert) {
        return this.oPersonalizer.delPersData().done(function () {
            assert.ok(true, "Deletion of non-existent item did not lead to an error");
        });
    });

    QUnit.test("getPersonalizer with component (empty object)", function (assert) {
        // Arrange
        sandbox.stub(this.oService, "getContainer");
        var oScope = {};
        var oComponent = {};

        // Act
        this.oService.getPersonalizer(this.oPersId, oScope, oComponent)._getContainer("foo");

        // Assert
        assert.ok(this.oService.getContainer.calledOnce);
        assert.deepEqual(this.oService.getContainer.args[0], ["foo", oScope, oComponent]);
    });

    QUnit.test("getPersonalizer with undefined component", function (assert) {
        // Arrange
        sandbox.stub(this.oService, "getContainer");
        var oScope = {};

        sandbox.stub(this.oService, "_getApplicationComponent").returns(undefined);

        // Act
        this.oService.getPersonalizer(this.oPersId, oScope)._getContainer("foo");

        // Assert
        assert.ok(this.oService.getContainer.calledOnce);
        assert.deepEqual(this.oService.getContainer.args[0], ["foo", oScope, undefined]);
    });

    QUnit.test("getPersonalizer with wrong oPersId", function (assert) {
        try {
            new Personalization(this.oAdapter).getPersonalizer({
                wrongContainer: sContainer,
                wrongItem: "DummyNonExisting"
            });
            assert.ok(false, "Wrong oPersId wasn't detected");
        } catch (e1) {
            assert.ok(true, "Wrong oPersId was detected");
        }

        try {
            new Personalization(this.oAdapter).getPersonalizer({
                container: {
                    value1: "value1",
                    value2: "value2"
                },
                item: "DummyNonExisting"
            }).setPersData({ value: "value100" });
            assert.ok(false, "Wrong oPersId wasn't detected");
        } catch (e2) {
            assert.ok(true, "Wrong oPersId was detected");
        }

        try {
            new Personalization(this.oAdapter).getPersonalizer({
                container: sContainer,
                item: {
                    value1: "value1",
                    value2: "value2"
                }
            }).setPersData({ value: "value100" });
            assert.ok(false, "Wrong oPersId wasn't detected");
        } catch (e3) {
            assert.ok(true, "Wrong oPersId was detected");
        }
    });

    //  ............................................................................
    //
    //             Variant Version 2
    //
    //  ............................................................................

    QUnit.module("Personalization: Variant V2", {
        beforeEach: function (assert) {
            this.oItemValue = {
                Item1: "Item 1",
                Item2: "Item 2"
            };

            oPersonalizationTestUtils.mockGetService();

            this.PersonalizationAdapterMock = oPersonalizationTestUtils
                .createPersonalizationAdapterMock(AdapterContainerMock);

            var oAdapter = new this.PersonalizationAdapterMock();
            this.oService = new Personalization(oAdapter);
            return this.oService.createEmptyContainer(sContainer, { validity: Infinity }).done(function (oContainer) {
                this.oContainerVSAdapter = new Personalization.VariantSetAdapter(oContainer);
                this.oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
                this.oVariant1 = this.oVariantSet.addVariant(sVariantName);
                this.oVariant1.setItemValue("Item1", "Item 1");
                this.oVariant1.setItemValue("Item2", "Item 2");
            }.bind(this));
        },
        afterEach: function () {
            this.oService.delContainer(sContainer, { validity: Infinity });
            this.oContainerVSAdapter.delVariantSet(sVariantSetKey);

            oPersonalizationTestUtils.restoreGetService();
        }
    });

    // ........... Variant Tests ...........

    QUnit.test("Variant: create variant and check variant key, name and data", function (assert) {
        // check variant key
        assert.equal("0", this.oVariant1.getVariantKey(),
            "Variant key is correctly stored");

        // check variant name
        assert.equal(sVariantName, this.oVariant1.getVariantName(),
            "Variant name is correctly stored");

        // check variant data
        assert.equal(this.oItemValue.Item1, this.oVariant1.getItemValue("Item1"),
            "Item1 value is correctly stored");
        assert.equal(this.oItemValue.Item2, this.oVariant1.getItemValue("Item2"),
            "Item2 value is correctly stored");
    });

    QUnit.test("Variant: create variant add, change and delete item", function (assert) {
        // add
        this.oVariant1.setItemValue("Item3", "Item 3");
        assert.equal("Item 3", this.oVariant1.getItemValue("Item3"),
            "Item3 value is correctly stored");
        assert.equal(true, this.oVariant1.containsItem("Item3"),
            "containsItem works correctly");

        // change
        this.oVariant1.setItemValue("Item1", "Item 42");
        assert.equal("Item 42", this.oVariant1.getItemValue("Item1"),
            "Item1 value is changed correctly");

        // get keys
        var aItemKeys = this.oVariant1.getItemKeys();
        assert.deepEqual(["Item1", "Item2", "Item3"], aItemKeys,
            "The correct array of item keys is returned by getItemKeys");

        // delete
        this.oVariant1.delItem("Item2");
        assert.equal(false, this.oVariant1.containsItem("Item2"),
            "delItem works correctly");
        assert.equal(undefined, this.oVariant1.getItemValue("Item2"),
            "getItemValue for a non-existant item returns undefined");
    });

    QUnit.test("Variant: create a variant with a non-string key", function (assert) {
        try {
            new Variant(this.oVariantSet, ["0"], sVariantName);
            assert.ok(false, "Error: Non-string key was not detected.");
        } catch (e) {
            assert.ok(true, "Non-string key was was detected.");
        }
    });

    QUnit.test("Variant: create a variant with a non-string name", function (assert) {
        try {
            new Variant(this.oVariantSet, sVariantKey, ["ArrayVariantName"]);
            assert.ok(false, "Error: Non-string name was not detected.");
        } catch (e) {
            assert.ok(true, "Non-string name was was detected.");
        }
    });

    QUnit.test("Variant: create a variant with an exotic name", function (assert) {
        const exoticVariant = this.oVariantSet.addVariant("Exotic Name");
        exoticVariant.setItemValue("exoticItemKey", "未经");
        assert.ok(true, "Variant name 'Exotic Name' was handled with no error during variant creation.");
    });

    QUnit.test("Variant: delete a non-existent item", function (assert) {
        // Act
        this.oVariant1.delItem("NonExistentItemKey...");

        // Assert
        assert.ok(true, "Non-existent item was deleted without error.");
    });

    QUnit.test("Variant: getItemValue for non-existent item", function (assert) {
        // Act
        var oItemValue = this.oVariant1.getItemValue("NonExistentItemKey...");

        // Assert
        assert.equal(undefined, oItemValue, "Correct value undefined was returned.");
    });

    QUnit.test("Variant: serialization", function (assert) {
        // Arrange
        const oVariant = this.oVariantSet.addVariant("Variant 2");
        oVariant.setItemValue("item1", this.oItemValue);
        oVariant.setItemValue("item2", this.oItemValue);
        const oExpectedSerialization = {
            name: "Variant 2",
            variantData: {
                item1: this.oItemValue,
                item2: this.oItemValue
            }
        };

        // Act
        var oSerializationResult = this.oVariantSet._oVariantSetData.variants[1];

        // Assert
        assert.deepEqual(oSerializationResult, oExpectedSerialization, "Serialization of variant works correctly");
    });

    QUnit.test("Variant: set variant name", function (assert) {
        // Arrange
        var sNewVariantName = "New variant name";
        this.oVariant1.setVariantName(sNewVariantName);

        // Act & Assert
        var sVariantKey2 = this.oVariantSet.getVariantKeyByName(sNewVariantName);
        assert.equal(sVariantKey2, this.oVariant1.getVariantKey(),
            "Variant set contains variant with new name '" + sNewVariantName + "'");

        var oVariant2 = this.oVariantSet.getVariant(sVariantKey2);
        assert.deepEqual(oVariant2.getItemValue("Item1"), "Item 1",
            "Renamed variant has same value for Item1");

        oVariant2 = this.oVariantSet.getVariant(sVariantKey2);
        assert.deepEqual(oVariant2.getItemValue("Item1"), "Item 1",
            "Renamed variant has same value for Item1 (after getVariant())");

        this.oVariantSet = this.oContainerVSAdapter.getVariantSet(sVariantSetKey);
        var sVariantKey3 = this.oVariantSet.getVariantKeyByName(sNewVariantName);
        assert.equal(sVariantKey3, this.oVariant1.getVariantKey(),
            "Variant set updated in container");
        var oVariant3 = this.oVariantSet.getVariant(sVariantKey3);
        assert.deepEqual(oVariant3.getItemValue("Item1"), "Item 1",
            "Variant set data updated in container");
    });

    QUnit.test("Variant: set variant name - input validation", function (assert) {
        // Act & Assert
        assert.throws(function () {
            this.oVariant1.setVariantName(0);
        }, /Parameter value of sVariantName is not a string/, "Exception raised if sVariantName not a string ");
    });

    QUnit.test("Variant: set variant name - variant does not exist in variant set", function (assert) {
        // Arrange
        this.oVariantSet.delVariant(this.oVariant1.getVariantKey());
        var sNewVariantName = "New variant name";

        // Act & Assert
        assert.throws(function () {
            this.oVariant1.setVariantName(sNewVariantName);
        }, /Variant does not longer exist/, "Exception raised if variant does not exist anymore");
    });

    QUnit.test("Variant: set variant name - new variant already exists", function (assert) {
        // Arrange
        var sNewVariantName = "New variant name";
        this.oVariantSet.addVariant(sNewVariantName);

        // Act & Assert
        assert.throws(function () {
            this.oVariant1.setVariantName(sNewVariantName);
        }, /Variant with name 'New variant name' already exists in variant set/, "Exception raised if new variant already exists");
    });

    //  ............................................................................
    //
    //               Container Version 2
    //
    //  ............................................................................

    QUnit.module("Personalization: Container V2", {
        beforeEach: function () {
            this.oItemValue = { v1: "false" };

            oPersonalizationTestUtils.mockGetService();

            this.PersonalizationAdapterMock = oPersonalizationTestUtils
                .createPersonalizationAdapterMock(AdapterContainerMock);

            var oAdapter = new this.PersonalizationAdapterMock({} /* oSystem */);
            this.oService = new Personalization(oAdapter);

            return this.oService.createEmptyContainer(sContainer, { validity: Infinity }).done(function (oContainer) {
                this.oContainer = oContainer;
                this.oContainerVSAdapter = new Personalization.VariantSetAdapter(this.oContainer);
                this.oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);

                // spy after initial call to empty container is made
                this.fnContextContainerSpy = sandbox.spy(Personalization.ContextContainer.prototype, "_init");
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();

            return new Promise(function (fnResolve) {
                var aPromises = [
                    this.oService.delContainer(sContainer, { validity: Infinity })
                ];

                if (this.oContainerVSAdapter.delVariantSet) {
                    aPromises.push(this.oContainerVSAdapter.delVariantSet(sVariantSetKey));
                }

                jQuery.when.apply(jQuery, aPromises).always(function () {
                    oPersonalizationTestUtils.restoreGetService();
                    fnResolve();
                });
            }.bind(this));
        }
    });

    // ........... Container Item Tests ...........

    QUnit.test("The service is configured with the expected adapters", function (assert) {
        assert.strictEqual(this.oService._oAdapterWithBackendAdapter.lazy, false,
            "oAdapterWithBackendAdapter is configured to be non-lazy");
        assert.strictEqual(Object.prototype.toString.apply(this.oService._oAdapterWithBackendAdapter.instance), "[object Object]",
            "oAdapterWithBackendAdapter has an Object as the instance member");
        assert.strictEqual(Object.keys(this.oService._oAdapterWithBackendAdapter).length, 2,
            "oAdapterWithBackendAdapter has only 2 members");
        assert.strictEqual(this.oService._oAdapterWindowOnly.lazy, false,
            "oAdapterWindowOnly is configured to be non-lazy");
        assert.strictEqual(Object.prototype.toString.apply(this.oService._oAdapterWindowOnly.instance), "[object Object]",
            "oAdapterWindowOnly has an Object as the instance member");
        assert.strictEqual(Object.keys(this.oService._oAdapterWindowOnly).length, 2,
            "oAdapterWindowOnly has only 2 members");
        assert.strictEqual(this.oService._oAppVariantAdapterWithBackendAdapter.lazy, true,
            "oAppVariantAdapterWithWindowAdapter is configured to be non-lazy");
        assert.strictEqual(typeof this.oService._oAppVariantAdapterWithBackendAdapter.create, "function",
            "oAppVariantAdapterWithBackendAdapter has a function as the instance member");
        assert.strictEqual(Object.keys(this.oService._oAppVariantAdapterWithBackendAdapter).length, 2,
            "oAppVariantAdapterWithBackendAdapter has only 2 members");
    });

    QUnit.test("Lazy AppVariant adapter create function returns a thenable", function (assert) {
        // Arrange
        var done = assert.async();
        sandbox.stub(sap.ui, "require");

        // Act
        var oGotResult = this.oService._oAppVariantAdapterWithBackendAdapter.create();

        // Assert
        assert.strictEqual(typeof oGotResult, "object", "create function returned a result of type 'object'");
        if (typeof oGotResult !== "object") {
            return;
        }

        assert.strictEqual(typeof oGotResult.then, "function", "create function returned an object with a .then method");
        done();
    });

    QUnit.test("Items: set, get and delete undefined value (!) item", function (assert) {
        var oItemValueRead;

        // demonstrate that one can set / get undefined
        assert.equal(false, this.oContainer.containsItem(sItemKey), sItemKey + " is not exisiting");
        this.oContainer.setItemValue(sItemKey, this.oItemValue);
        assert.equal(true, this.oContainer.containsItem(sItemKey), sItemKey + " exisits after setItemValue");
        oItemValueRead = this.oContainer.getItemValue(sItemKey);
        assert.deepEqual(this.oItemValue, oItemValueRead, "getItemValue returns the correct value for " + sItemKey);
        // does not hold ok(oItemValue !== oItemValueRead, "distinct objects");
        assert.equal(true, this.oContainer.containsItem(sItemKey), "containsItem returned true correctly for " + sItemKey);
        this.oContainer.delItem(sItemKey);
        assert.equal(typeof this.oContainer.getItemValue(sItemKey), "undefined", "Item was deleted, getItemValue returned null");
        assert.equal(false, this.oContainer.containsItem(sItemKey), "containsItem returned false correctly");
    });

    QUnit.test("Items: set, get and delete null value (!) item", function (assert) {
        var oItemValueRead;

        // demonstrate that one can set / get undefined
        assert.equal(false, this.oContainer.containsItem(sItemKey), sItemKey + " is not exisiting");
        this.oContainer.setItemValue(sItemKey, this.oItemValue);
        assert.equal(true, this.oContainer.containsItem(sItemKey), sItemKey + " exisits after setItemValue");
        oItemValueRead = this.oContainer.getItemValue(sItemKey);
        assert.deepEqual(this.oItemValue, oItemValueRead, "getItemValue returns the correct value for " + sItemKey);
        // does not hold ok(oItemValue !== oItemValueRead, "distinct objects");
        assert.equal(true, this.oContainer.containsItem(sItemKey), "containsItem returned true correctly for " + sItemKey);
        this.oContainer.delItem(sItemKey);
        assert.equal(typeof this.oContainer.getItemValue(sItemKey), "undefined", "Item was deleted, getItemValue returned null");
        assert.equal(false, this.oContainer.containsItem(sItemKey), "containsItem returned false correctly");
    });

    [
        {},
        { v1: "abc" },
        { v1: "abc", v2: [1, 2], v3: { v1: "abc" } },
        [1, 2, 3],
        []
    ].forEach(function (oFixture2) {
        QUnit.test("Items: set, get and delete value (!) item", function (assert) {
            var oItemValue = oFixture2,
                oItemValueRead;

            assert.equal(false, this.oContainer.containsItem(sItemKey), sItemKey + " is not exisiting");
            this.oContainer.setItemValue(sItemKey, oItemValue);
            assert.equal(true, this.oContainer.containsItem(sItemKey), sItemKey + " exisits after setItemValue");
            oItemValueRead = this.oContainer.getItemValue(sItemKey);
            assert.deepEqual(oItemValue, oItemValueRead, "getItemValue returns the correct value for " + sItemKey);
            assert.ok(oItemValue !== oItemValueRead, "distinct objects");
            assert.equal(true, this.oContainer.containsItem(sItemKey), "containsItem returned true correctly for " + sItemKey);
            this.oContainer.delItem(sItemKey);
            assert.ok(this.oContainer.getItemValue(sItemKey) === undefined, "Item was deleted, getItemValue returned null");
            assert.equal(false, this.oContainer.containsItem(sItemKey), "containsItem returned false correctly");
        });
    });

    [
        { obj: -Infinity, repr: null },
        { obj: /abc/, repr: {} },
        { obj: Number(1234), repr: 1234 },
        { obj: Number(Infinity), repr: null }
    ].forEach(function (oFixture) {
        QUnit.test("Items: set, get and delete mapped value item", function (assert) {
            var oItemValue = oFixture.obj,
                oItemValueRead;

            assert.equal(false, this.oContainer.containsItem(sItemKey), sItemKey + " is not exisiting");
            this.oContainer.setItemValue(sItemKey, oItemValue);
            assert.equal(true, this.oContainer.containsItem(sItemKey), sItemKey + " exisits after setItemValue");
            oItemValueRead = this.oContainer.getItemValue(sItemKey);
            assert.deepEqual(oFixture.repr, oItemValueRead, "getItemValue returns the correct value for " + sItemKey);
            assert.equal(true, this.oContainer.containsItem(sItemKey), "containsItem returned true correctly for " + sItemKey);
            this.oContainer.delItem(sItemKey);
            assert.ok(this.oContainer.getItemValue(sItemKey) === undefined, "Item was deleted, getItemValue returned null");
            assert.equal(false, this.oContainer.containsItem(sItemKey), "containsItem returned false correctly");
        });
    });

    QUnit.test("getKey", function (assert) {
        assert.equal(this.oContainer.getKey(), sContainer, "correct key returned");
    });

    QUnit.test("Items: set, get and delete recursive item", function (assert) {
        var oItemValueRead;

        // create circular object
        this.oItemValue.nested = this.oItemValue;
        assert.equal(this.oContainer.getKey(), sContainer);
        // nested structures are silently converted to undefined
        assert.equal(false, this.oContainer.containsItem(sItemKey), sItemKey + " is not exisiting");
        this.oContainer.setItemValue(sItemKey, "legal");
        try {
            this.oContainer.setItemValue(sItemKey, this.oItemValue);
            assert.ok(false, "no exception");
        } catch (e) {
            assert.ok(true, "had exception");
        }
        assert.equal(true, this.oContainer.containsItem(sItemKey), sItemKey + " exisits after setItemValue");
        oItemValueRead = this.oContainer.getItemValue(sItemKey);
        assert.deepEqual(oItemValueRead, "legal", "getItemValue returns undefined for " + sItemKey);
    });

    QUnit.test("Items: set, get and delete item, check difficult keynames", function (assert) {
        var sITEM_KEY = "hasOwnProperty",
            oItemValueRead;

        this.oContainer.delItem(sITEM_KEY);
        assert.equal(false, this.oContainer.containsItem(sITEM_KEY), "hasOwnProperty is not exisiting");
        this.oContainer.setItemValue(sITEM_KEY, this.oItemValue);
        assert.equal(true, this.oContainer.containsItem(sITEM_KEY), "hasOwnProperty exisits after setItemValue");
        oItemValueRead = this.oContainer.getItemValue(sITEM_KEY);
        assert.deepEqual(this.oItemValue, oItemValueRead, "getItemValue returns the correct value for hasOwnProperty");
        assert.equal(true, this.oContainer.containsItem(sITEM_KEY), "containsItem returned true correctly for hasOwnProperty");
        this.oContainer.delItem(sITEM_KEY);
        assert.equal(null, this.oContainer.getItemValue(sITEM_KEY), "Item was deleted, getItemValue returned null");
        assert.equal(false, this.oContainer.containsItem(sITEM_KEY), "containsItem returned false correctly");
    });

    QUnit.test("Items: add items with and with no prefix, read them", function (assert) {
        var aActItemKeys;
        var done = assert.async();

        // check if the container is empty
        assert.equal(this.oContainer.getItemKeys().length, 0, "Container is empty");
        // add item1 with no item prefix
        // dirty hack
        this.oContainer._setItemValueInternal("item1", "prefix0", this.oItemValue);
        // add item2 with item prefix
        this.oContainer.setItemValue("item2", this.oItemValue);
        // add item 3 with item prefix
        this.oContainer.setItemValue("item3", this.oItemValue);
        aActItemKeys = this.oContainer.getItemKeys();
        assert.equal(aActItemKeys.length, 2, "Container has 3 items: '" + aActItemKeys + "'");
        assert.ok(true, "Internal item keys are: " + this.oContainer._oItemMap.keys() + "'");
        assert.equal(false, this.oContainer.containsItem("item1"), "'item1' is not detected by containsItem due to automatic prefixing!");

        this.oContainer.save()
            .fail(() => {
                assert.ok(false, "Error during container save");
                done();
            })
            .done(() => {
                assert.ok(true, "Successful container save");
                this.oContainer.load()
                    .fail(() => {
                        assert.ok(false, "Error during container reload");
                        done();
                    })
                    .done(() => {
                        assert.ok(true, "Successful container reload");
                        // check if prefix was added to item1
                        assert.equal(false, this.oContainer.containsItem("item1"), "Container contains 'item1'");
                        this.oContainer.delItem("item1");
                        this.oContainer.delItem("item2");
                        this.oContainer.delItem("item3");
                        assert.equal(this.oContainer.getItemKeys().length, 0, "All items are deleted");
                        done();
                    });
            });
    });

    QUnit.test("Items: Delete non-existent item", function (assert) {
        assert.ok(!this.oContainer.containsItem(sItemKey), "Item is not existing");
        try {
            this.oContainer.delItem(sItemKey);
            assert.ok(true, "Non-existent item was deleted without error");
        } catch (e) {
            assert.ok(false, "Error during deletion of non-existing item");
        }
    });

    QUnit.test("Items: Get value of non-existent item", function (assert) {
        var oItemValue;

        assert.ok(!this.oContainer.containsItem(sItemKey), "Item is not existing");
        try {
            oItemValue = this.oContainer.getItemValue(sItemKey);
            assert.ok(oItemValue === undefined, "Value of a non-existing item is undefined");
        } catch (e) {
            assert.ok(false, "Error during getItemvalue of non-existing item");
        }
    });

    QUnit.test("Variant Set: add and delete variant", function (assert) {
        var sVariantKey1,
            sVariantKey2,
            oVariant1,
            oVariant2;

        assert.equal(true, this.oContainerVSAdapter.containsVariantSet(sVariantSetKey),
            "Variant set '" + sVariantSetKey + "' was added");
        oVariant1 = this.oVariantSet.addVariant("Variant number one added");
        sVariantKey1 = oVariant1.getVariantKey();
        assert.equal(true, this.oVariantSet.containsVariant(sVariantKey1),
            "Variant '" + sVariantKey1 + "' was added");
        // add variant 1
        oVariant2 = this.oVariantSet.addVariant("Variant number two");
        sVariantKey2 = oVariant2.getVariantKey();
        assert.equal(true, this.oVariantSet.containsVariant(sVariantKey2),
            "Variant '" + sVariantKey2 + "' was added");
        // delete variant 0
        this.oVariantSet.delVariant(sVariantKey1);
        assert.equal(false, this.oVariantSet.containsVariant(sVariantKey1),
            "Variant '" + sVariantKey1 + "' was deleted");
        // delete variant 1
        this.oVariantSet.delVariant(sVariantKey2);
        assert.equal(false, this.oVariantSet.containsVariant(sVariantKey2),
            "Variant '" + sVariantKey2 + "' was deleted");
        // delete variant set
        this.oContainerVSAdapter.delVariantSet(sVariantSetKey);
        assert.equal(false, this.oContainerVSAdapter.containsVariantSet(sVariantSetKey),
            "Variant set '" + sVariantSetKey + "' was deleted");
    });

    QUnit.test("Variant Set: add existing variant set", function (assert) {
        assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey),
            "Variant set '" + sVariantSetKey + "' was created");
        assert.ok(!this.oVariantSet.getVariantKeyByName(sVariantName),
            "Variant with name '" + sVariantName + "' does not exist");
        this.oVariantSet.addVariant(sVariantName); // add it once
        try {
            this.oVariantSet.addVariant(sVariantName); // add it twice
            assert.ok(false, "Error: adding the same named variant twice was not detected");
        } catch (e) {
            assert.ok(true, "Exception for adding the same variant twice is correct");
        }
    });

    QUnit.test("Variant Set: set current variant and check", function (assert) {
        var oVariant,
            sVariantKeyExp;

        if (this.oContainerVSAdapter.containsVariantSet(sVariantSetKey)) {
            this.oContainerVSAdapter.delVariantSet(sVariantSetKey);
        }

        oVariant = this.oVariantSet.addVariant("V1");
        oVariant.setItemValue("item", this.oItemValue);
        sVariantKeyExp = oVariant.getVariantKey();
        this.oVariantSet.setCurrentVariantKey(sVariantKeyExp);

        assert.deepEqual(this.oVariantSet.getCurrentVariantKey(), sVariantKeyExp,
            "currentVariantKey was set correctly");
    });

    QUnit.test("Variant Set: delete non-existent variant", function (assert) {
        assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey),
            "Variant set '" + sVariantSetKey + "' was created");
        assert.ok(!this.oVariantSet.containsVariant(sVariantKey),
            "Variant '" + sVariantKey + "' does not exist");
        try {
            this.oVariantSet.delVariant(sVariantKey);
            assert.ok(true, "Non-existing variant was deleted without error/exception");
        } catch (e) {
            assert.ok(false, "Error: Exception during deletion of a non-existing variant");
        }
    });

    QUnit.test("Variant Set: get non-existent variant", function (assert) {
        var oVariant;

        assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey),
            "Variant set '" + sVariantSetKey + "' was created");
        assert.ok(!this.oVariantSet.containsVariant(sVariantKey),
            "Variant '" + sVariantKey + "' does not exist");
        try {
            oVariant = this.oVariantSet.getVariant(sVariantKey);
            assert.ok(oVariant === undefined, "getVariant returns undefined for a non-existing variant");
        } catch (e) {
            assert.ok(false, "Error: Exception during getVariant for a non-existing variant");
        }
    });

    QUnit.test("Variant Set: add variant with an exotic name", function (assert) {
        var sVARIANT_EXOTIC_NAME = "未经",
            oVariant;

        assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey),
            "Variant set '" + sVariantSetKey + "' was created");
        assert.ok(!this.oVariantSet.getVariantKeyByName(sVARIANT_EXOTIC_NAME),
            "Variant with name '" + sVARIANT_EXOTIC_NAME + "' does not exist");
        try {
            oVariant = this.oVariantSet.addVariant(sVARIANT_EXOTIC_NAME);
            assert.ok(oVariant instanceof Personalization.Variant, "addVariant returns a variant object");
        } catch (e) {
            assert.ok(false, "Error: Exception during addVariant");
        }
    });

    QUnit.test("Variant Set: add variant to a big max key variant set", function (assert) {
        var sVARIANT_KEY1 = "999999",
            sVARIANT_NAME2 = "VARIANT_1115",
            oVariant2;

        assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey),
            "Variant set '" + sVariantSetKey + "' was created");
        assert.ok(!this.oVariantSet.containsVariant(sVARIANT_KEY1),
            "Variant with key '" + sVARIANT_KEY1 + "' does not exist");
        // add variant manually
        this.oVariantSet._oVariantSetData.variants[sVARIANT_KEY1] = { name: sVariantName, variantData: {} };
        assert.ok(this.oVariantSet.containsVariant(sVARIANT_KEY1),
            "Variant with key '" + sVARIANT_KEY1 + "' and name '" + sVariantName + "' was added");
        oVariant2 = this.oVariantSet.addVariant(sVARIANT_NAME2);
        assert.ok(parseInt(oVariant2.getVariantKey(), 10) === parseInt(sVARIANT_KEY1, 10) + 1, "variant key was increased correctly");
    });

    QUnit.test("Variant Set: getVariantKeyByName standard", function (assert) {
        var oVariant;

        assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey),
            "Variant set '" + sVariantSetKey + "' was created");
        oVariant = this.oVariantSet.addVariant(sVariantName);
        QUnit.assert.equal(this.oVariantSet.getVariantKeyByName(sVariantName), oVariant.getVariantKey(),
            "getVariantKey returns the correct key");
    });

    QUnit.test("Variant Set: getVariantKeyByName with non-existing name", function (assert) {
        assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey),
            "Variant set '" + sVariantSetKey + "' was created");
        assert.equal(this.oVariantSet.getVariantKeyByName(sVariantName), undefined,
            "getVariantKey returns undefined for a non-existing name");
    });

    QUnit.test("Variant Set: getVariantKeyByName with non-string name", function (assert) {
        assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey),
            "Variant set '" + sVariantSetKey + "' was created");
        assert.equal(this.oVariantSet.getVariantKeyByName(this.oVariantSet), undefined,
            "getVariantKey returns undefined for a non-string name");
    });

    QUnit.test("Variant Set: getVariantNamesAndKeys", function (assert) {
        var sVARIANT_NAME1 = "VARIANT_1",
            sVARIANT_NAME2 = "VARIANT_2",
            sVARIANT_NAME3 = "VARIANT_3",
            sVariantKey1,
            sVariantKey2,
            sVariantKey3,
            aVariantNamesAndKeys;

        assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey),
            "Variant set '" + sVariantSetKey + "' was created");
        sVariantKey1 = this.oVariantSet.addVariant(sVARIANT_NAME1).getVariantKey();
        sVariantKey2 = this.oVariantSet.addVariant(sVARIANT_NAME2).getVariantKey();
        sVariantKey3 = this.oVariantSet.addVariant(sVARIANT_NAME3).getVariantKey();
        aVariantNamesAndKeys = this.oVariantSet.getVariantNamesAndKeys();
        assert.equal(aVariantNamesAndKeys[sVARIANT_NAME1], sVariantKey1, "result for variant 1 is correct");
        assert.equal(aVariantNamesAndKeys[sVARIANT_NAME2], sVariantKey2, "result for variant 2 is correct");
        assert.equal(aVariantNamesAndKeys[sVARIANT_NAME3], sVariantKey3, "result for variant 3 is correct");
    });

    QUnit.test("Variant Set: add and delete variant sets", function (assert) {
        var aExpVariantSetKeys = ["variantSetKey", "variantSet1", "variantSet2"];
        this.oContainerVSAdapter.addVariantSet(aExpVariantSetKeys[1], this.oItemValue);
        this.oContainerVSAdapter.addVariantSet(aExpVariantSetKeys[2], this.oItemValue);

        // check variant sets
        var aActVariantSetKeys = this.oContainerVSAdapter.getVariantSetKeys();
        aExpVariantSetKeys.forEach(function (sVariantSetKey, index) {
            assert.deepEqual(aActVariantSetKeys[index], sVariantSetKey,
                "'" + sVariantSetKey + "' exists");
        });
        // delete
        aExpVariantSetKeys.forEach(function (sVariantSetKey) {
            this.oContainerVSAdapter.delVariantSet(sVariantSetKey);
        }.bind(this));
        // check deletion
        aExpVariantSetKeys.forEach(function (sVariantSetKey) {
            assert.equal(false, this.oContainerVSAdapter.containsVariantSet(sVariantSetKey),
                "Container does not have variantSet '" + sVariantSetKey + "'");
        }.bind(this));
    });

    QUnit.test("Variant Set: Delete non-existent variant set", function (assert) {
        assert.ok(!this.oContainerVSAdapter.containsVariantSet("NonExistingVariantSet"), "Variant set is not existing");
        try {
            this.oContainerVSAdapter.delVariantSet("NonExistingVariantSet");
            assert.ok(true, "Non-existent variant set was deleted without error");
        } catch (e) {
            assert.ok(false, "Error during deletion of non-existing variant set");
        }
    });

    QUnit.test("Variant Set: Get non-existent variant set", function (assert) {
        var oVariantSet;

        assert.ok(!this.oContainerVSAdapter.containsVariantSet("NonExistingVariantSet"), "Variant set is not existing");
        try {
            oVariantSet = this.oContainerVSAdapter.getVariantSet("NonExistingVariantSet");
            assert.ok(oVariantSet === undefined, "Non-existent variant set object is undefined");
        } catch (e) {
            assert.ok(false, "Error during getVariantSet for a non-existing variant set");
        }
    });

    QUnit.test("Variant Set: Add variant set that exists", function (assert) {
        try {
            this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            assert.ok(false, "Existence of variant set was not detected");
        } catch (e) {
            assert.ok(true, "Existence of variant set was detected");
        }
    });

    QUnit.test("Container: add items and variant sets, read them separately", function (assert) {
        var oItemValue = {
            part1: "Part 1",
            part2: "Part 2"
        };
        var aExpItemKeys = ["item1", "item2", "item3"];
        var aExpVariantSetKeys = ["variantSet1", "variantSet2"];

        // add items
        aExpItemKeys.forEach(function (sItemKey) {
            this.oContainer.setItemValue(sItemKey, oItemValue);
        }.bind(this));

        // add variant sets
        aExpVariantSetKeys.forEach(function (sVariantSetKey) {
            this.oContainerVSAdapter.addVariantSet(sVariantSetKey, this.oItemValue);
        }.bind(this));

        // check items
        var aActItemKeys = this.oContainer.getItemKeys();
        aExpItemKeys.forEach(function (sItemKey) {
            if (!aActItemKeys.includes(sItemKey)) {
                assert.ok(false, "Container does not contain item '" + sItemKey + "'");
            }
        });
        assert.ok(true, "Item keys are correct: " + aActItemKeys);

        // check variant sets
        var aActVariantSetKeys = this.oContainerVSAdapter.getVariantSetKeys();
        aExpVariantSetKeys.forEach(function (sVariantSetKey) {
            if (!aActVariantSetKeys.includes(sVariantSetKey)) {
                assert.ok(false, "Container does not contain variant set '" + sVariantSetKey + "'");
            }
        });
        assert.ok(true, "Variant set keys are correct: " + aActVariantSetKeys);
    });

    QUnit.test("Container: add and delete variantSets/Items", function (assert) {
        var oVariant,
            that = this;
        var done = assert.async();

        this.oContainer.setItemValue(sItemKey, this.oItemValue);
        this.oContainer.setItemValue("itemKey2", "item2");

        // add variant V1
        oVariant = this.oVariantSet.addVariant("V1");
        oVariant.setItemValue("I1", {
            Val1: "value 1",
            Val2: "value 2"
        });
        oVariant.setItemValue("I2", {
            Filter1: "24",
            Filter2: "1000"
        });
        // add variant V2
        oVariant = this.oVariantSet.addVariant("V2");
        oVariant.setItemValue("I1", {
            Val1: "value 11",
            Val2: "value 12"
        });
        oVariant.setItemValue("I2", {
            Filter1: "48",
            Filter2: "50000"
        });
        // save container
        this.oContainer.save().fail(function () {
            assert.ok(false, "Save failed");
        });
        done();
        this.oContainer.delItem("itemKey2");
        this.oContainerVSAdapter.delVariantSet(sVariantSetKey);
        this.oContainer.setItemValue("itemKey3", "item3");
        this.oContainer.save()
            .done(function () {
                assert.ok(!that.oContainer.containsItem("itemKey2"), "itemKey2 was deleted");
                assert.ok(!that.oContainerVSAdapter.containsVariantSet(that.sVARIANT_SET_KEY),
                    that.sVARIANT_SET_KEY + " was deleted");
                assert.ok(that.oContainer.containsItem("itemKey3"),
                    "itemKey3 was added");
            })
            .fail(function () {
                assert.ok(false, "Save failed");
            });
    });

    var oDummyComponentA = new UIComponent();
    var oDummyComponentB = new UIComponent();

    [{
        testDescription: "component is given", // tests that the given one wins
        oInputComponent: oDummyComponentA,
        oRecoveredComponent: oDummyComponentB,
        expectedComponent: oDummyComponentA
    }, {
        testDescription: "component is undefined and cannot be recovered",
        oInputComponent: undefined,
        oRecoveredComponent: undefined,
        expectedComponent: undefined
    }, {
        testDescription: "component is undefined but can be recovered",
        oInputComponent: undefined,
        oRecoveredComponent: oDummyComponentA,
        expectedComponent: oDummyComponentA
    }].forEach(function (oFixture) {
        QUnit.test("#getContainer when " + oFixture.testDescription, function (assert) {
            var fnCreateContainer = sandbox.spy(this.oService, "_createContainer");
            var oScope = {};

            sandbox.stub(this.oService, "_getApplicationComponent").returns(oFixture.oRecoveredComponent);

            // code under test
            this.oService.getContainer("ContainerKey", oScope, oFixture.oInputComponent);

            // tests
            assert.ok(fnCreateContainer.calledOnce);
            assert.deepEqual(fnCreateContainer.getCall(0).args, ["ContainerKey", oScope, false, oFixture.expectedComponent]);
        });

        QUnit.test("#createEmptyContainer when " + oFixture.testDescription, function (assert) {
            var fnCreateContainer = sandbox.spy(this.oService, "_createContainer");
            var oScope = {};

            sandbox.stub(this.oService, "_getApplicationComponent").returns(oFixture.oRecoveredComponent);

            //code under test
            this.oService.createEmptyContainer("ContainerKey", oScope, oFixture.oInputComponent);

            // tests
            assert.ok(fnCreateContainer.calledOnce);
            assert.deepEqual(fnCreateContainer.getCall(0).args, ["ContainerKey", oScope, true, oFixture.expectedComponent]);
        });
    });

    QUnit.test("_createContainer returns immediately if chosen adapter is lazy but construct function returns immediately", function (assert) {
        var aExpectedResult = ["createContainer", "afterCreateContainer"];
        var aGotResult = [];

        // Arrange
        var oScope = {
            validity: 1,
            keyCategory: "GENERATED_KEY",
            writeFrequency: "HIGH",
            clientStorageAllowed: false
        };

        this.oService._oAdapterWithBackendAdapter = {
            lazy: true,
            create: sandbox.stub().returns(new jQuery.Deferred().resolve(
                new (oPersonalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock))()
            ).promise())
        };

        // Act
        this.oService._createContainer("ContainerKey", oScope, false, this.oComponent).done(function () {
            aGotResult.push("createContainer");
        });
        aGotResult.push("afterCreateContainer");

        // Assert
        assert.deepEqual(aGotResult, aExpectedResult, "got the expected result");
    });

    QUnit.test("_createContainer returns immediately if chosen adapter is not lazy", function (assert) { // see I3be967b0a4e6be48d5b1537207b89a736c7c5f65
        var aExpectedResult = ["createContainer", "afterCreateContainer"];
        var aGotResult = [];

        // Arrange
        var oScope = {
            validity: 1,
            keyCategory: "GENERATED_KEY",
            writeFrequency: "HIGH",
            clientStorageAllowed: false
        };

        this.oService._oAdapterWithBackendAdapter = {
            lazy: false,
            instance: new (oPersonalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock))()
        };

        // Act
        this.oService._createContainer("ContainerKey", oScope, false, this.oComponent).done(function () {
            aGotResult.push("createContainer");
        });
        aGotResult.push("afterCreateContainer");

        // Assert
        assert.deepEqual(aGotResult, aExpectedResult, "got the expected result");
    });

    QUnit.test("_createContainer returns immediately if chosen adapter is lazy but construct function returns a native promise and fails", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oLoadAdapterError = { error: true };
        var oScope = {
            validity: 1,
            keyCategory: "GENERATED_KEY",
            writeFrequency: "HIGH",
            clientStorageAllowed: false
        };

        this.oService._oAdapterWithBackendAdapter = {
            lazy: true,
            create: sandbox.stub().returns(new jQuery.Deferred().resolve(
                new (oPersonalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock))()
            ).promise())
        };

        sandbox.stub(personalizationUtils, "loadAdapter").returns(new jQuery.Deferred().reject(oLoadAdapterError).promise());

        // Act
        this.oService._createContainer("ContainerKey", oScope, false, this.oComponent)
            .done(function () {
                assert.ok(false, "promise was rejected");
            })
            .fail(function (oError) {
                assert.ok(true, "promise was rejected");
                assert.deepEqual(oError, oLoadAdapterError, "promise was rejected with the same error as loadAdapter");
            })
            .always(fnDone);
    });

    QUnit.test("_createContainer rejects if loadAdapter rejects", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oLoadAdapterError = { error: true };
        var oScope = {
            validity: 1,
            keyCategory: "GENERATED_KEY",
            writeFrequency: "HIGH",
            clientStorageAllowed: false
        };

        this.oService._oAdapterWithBackendAdapter = {
            lazy: false,
            instance: new (oPersonalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock))()
        };

        sandbox.stub(personalizationUtils, "loadAdapter").returns(new jQuery.Deferred().reject(oLoadAdapterError).promise());

        // Act
        this.oService._createContainer("ContainerKey", oScope, false, this.oComponent)
            .done(function () {
                assert.ok(false, "promise was rejected");
            })
            .fail(function (oError) {
                assert.ok(true, "promise was rejected");
                assert.deepEqual(oError, oLoadAdapterError, "promise was rejected with the same error as loadAdapter");
            })
            .always(fnDone);
    });

    QUnit.test("_createContainer rejects if lazy adapter promise rejects", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oCreateAdapterError = { error: true };
        var oScope = {
            validity: 1,
            keyCategory: "GENERATED_KEY",
            writeFrequency: "HIGH",
            clientStorageAllowed: false
        };

        this.oService._oAdapterWithBackendAdapter = {
            lazy: true,
            create: sandbox.stub().returns(new jQuery.Deferred().reject(oCreateAdapterError).promise())
        };

        // Act & Assert
        this.oService._createContainer("ContainerKey", oScope, false, this.oComponent)
            .done(function () {
                assert.ok(false, "promise was rejected");
            })
            .fail(function (oError) {
                assert.ok(true, "promise was rejected");
                assert.deepEqual(oError, oCreateAdapterError, "promise was rejected with the same error as loadAdapter");
            })
            .always(fnDone);
    });

    QUnit.test("_createContainer rejects if lazy adapter throws", function (assert) {
        // Arrange
        var oCreateAdapterError = new Error("deliberate failure");
        var oScope = {
            validity: 1,
            keyCategory: "GENERATED_KEY",
            writeFrequency: "HIGH",
            clientStorageAllowed: false
        };
        var fnDone = assert.async();

        this.oService._oAdapterWithBackendAdapter = {
            lazy: true,
            create: function () {
                throw oCreateAdapterError;
            }
        };

        // Act & Assert
        this.oService._createContainer("ContainerKey", oScope, false, this.oComponent)
            .done(function () {
                assert.ok(false, "promise was rejected");
            })
            .fail(function (oError) {
                assert.ok(true, "promise was rejected");
                assert.deepEqual(oError, oCreateAdapterError, "promise was rejected with the same error as loadAdapter");
            })
            .always(fnDone);
    });

    QUnit.test("_createContainer when there is no component", function (assert) {
        var that = this;
        var oScope = {
            validity: 1,
            keyCategory: "GENERATED_KEY",
            writeFrequency: "HIGH",
            clientStorageAllowed: false
        };
        var done = assert.async();

        // add mocked app variant adapter container
        this.oService._oAppVariantAdapterWithBackendAdapter = {
            lazy: false,
            instance: new (oPersonalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock))()
        };

        //code under test
        this.oService._createContainer("ContainerKey", oScope, false, this.oComponent).done(function () {
            // tests
            assert.ok(that.fnContextContainerSpy.calledOnce);
            assert.strictEqual(that.fnContextContainerSpy.firstCall.args[0], that.oService);
            assert.strictEqual(that.fnContextContainerSpy.firstCall.args[1], that.oService._oAdapterWithBackendAdapter.instance);
            assert.strictEqual(that.fnContextContainerSpy.firstCall.args[2], "sap.ushell.personalization#ContainerKey");
            assert.deepEqual(that.fnContextContainerSpy.firstCall.args[3], oScope);
            assert.strictEqual(that.fnContextContainerSpy.firstCall.args[4], that.oComponent);
            done();
        });
    });

    QUnit.test("_createContainer when there is component but no shared scope", function (assert) {
        var oScope = {
            validity: 1,
            keyCategory: "GENERATED_KEY",
            writeFrequency: "HIGH",
            clientStorageAllowed: false
        };
        var done = assert.async();

        var oDescriptor = {
            "sap.app": {
                id: "TestId",
                applicationVersion: { version: "1.2.3" }
            },
            "sap.ui5": {
                componentName: "TestId",
                appVariantId: "AppVarId"
            }
        };

        var oManifest = new Manifest(oDescriptor);
        this.oComponent = new UIComponent();
        sandbox.stub(this.oComponent, "getManifestObject").returns(oManifest);

        // add mocked app variant adapter container
        this.oService._oAppVariantAdapterWithBackendAdapter = {
            lazy: false,
            instance: new (oPersonalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock))()
        };

        //code under test
        this.oService._createContainer("ContainerKey", oScope, false, this.oComponent).always(function () {
            // tests
            assert.ok(this.fnContextContainerSpy.calledOnce);
            assert.deepEqual(this.fnContextContainerSpy.firstCall.args[0], this.oService);
            assert.deepEqual(this.fnContextContainerSpy.firstCall.args[1], this.oService._oAppVariantAdapterWithBackendAdapter.instance);
            assert.strictEqual(this.fnContextContainerSpy.firstCall.args[2], "sap.ushell.personalization#ContainerKey#AppVarId");
            assert.notDeepEqual(this.fnContextContainerSpy.firstCall.args[3], oScope);
            assert.strictEqual(this.fnContextContainerSpy.firstCall.args[3].appVarId, "AppVarId");
            assert.strictEqual(this.fnContextContainerSpy.firstCall.args[3].appVersion, "1.2.3");
            assert.deepEqual(this.fnContextContainerSpy.firstCall.args[4], this.oComponent);
            done();
        }.bind(this));
    });
    // -- lrep tests begin

    QUnit.test("ContextContainer", function (assert) {
        var oAdapter = { getAdapterContainer: sandbox.spy() };
        var oScope = {};
        var aExpectedArguments = [
            [
                "ContainerKey",
                oScope,
                undefined
            ]
        ];

        //code under test
        new Personalization.ContextContainer({}, oAdapter, "ContainerKey", oScope, this.oComponent);

        // Assert
        assert.deepEqual(oAdapter.getAdapterContainer.args, aExpectedArguments);
    });

    QUnit.test("ContextContainer: component parsing", function (assert) {
        var oService = {},
            oAdapter = { getAdapterContainer: sandbox.spy() },
            oScope = {};

        //code under test
        new Personalization.ContextContainer(oService, oAdapter, "ContainerKey", oScope, this.oComponent);
        assert.ok(true, "no error thrown because the right component was passed");

        //code under test
        new Personalization.ContextContainer(oService, oAdapter, "ContainerKey", oScope, undefined);
        assert.ok(true, "no error thrown because the right component was passed");

        [0, 1, [], ["A"], {}].forEach(function (sNoComponent) {
            //code under test
            try {
                new Personalization.ContextContainer(oService, oAdapter, "ContainerKey", oScope, sNoComponent);
                assert.ok(false, "should not get here");
            } catch (ex) {
                assert.equal(ex.message, "oComponent passed must be a UI5 Component or must be undefined", "correct exception thrown");
            }
        });
    });

    QUnit.test("WindowAdapter.getAdapterContainer", function (assert) {
        var oAdapter = { getAdapterContainer: sandbox.spy() };
        var oScope = {};
        var aExpectedArguments = [
            [
                "ContainerKey",
                oScope,
                "testUtils.AppSample"
            ]
        ];

        var oWindowAdapter = new Personalization.WindowAdapter({}, oAdapter);

        // Act
        oWindowAdapter.getAdapterContainer("ContainerKey", oScope, "testUtils.AppSample");

        // Assert
        assert.deepEqual(oAdapter.getAdapterContainer.args, aExpectedArguments);
    });

    QUnit.test("Container: Get container with no scope", function (assert) {
        var done = assert.async();
        try {
            this.oService.getContainer("ABC123", undefined /* oScope */, undefined /* oComponent */)
                .always(function () {
                    assert.ok(true, "No error was thrown");
                    done();
                });
        } catch (e) {
            assert.ok(false, "No error was thrown. DEBUG: " + e);
            done();
        }
    });

    QUnit.test("Container: Get container with non-string key", function (assert) {
        var done = assert.async();

        try {
            this.oService.getContainer(this.oService)
                .done(function () {
                    assert.ok(false, "Error: Container with a non-string key was not prohibited");
                    done();
                })
                .fail(function () {
                    assert.ok(false, "Error: Container with a non-string key was not prohibited");
                    done();
                });
        } catch (e) {
            assert.ok(true, "Non-string sContainerKey led to an exception");
            done();
        }
    });

    QUnit.test("Container: Container constructor with empty key", function (assert) {
        try {
            new Personalization.PersonalizationContainer({}, ""); // oAdapter, sContainerKey
            assert.ok(false, "Error: Container with an empty key was not prohibited");
        } catch (e) {
            assert.ok(true, "Empty sContainerKey led to an exception");
        }
    });

    QUnit.test("Container: Container constructor with non-string key", function (assert) {
        try {
            new PersonalizationContainer({}, {}); // oAdapter, sContainerKey
            assert.ok(false, "Error: Container with a non-string key was not prohibited");
        } catch (e) {
            assert.ok(true, "Non-string sContainerKey led to an exception");
        }
    });

    //  ............................................................................
    //
    //               Container Version 2 - Validity
    //
    //  ............................................................................

    [
        { validity: 0, hasValidityPersistence: false },
        { validity: 30, hasValidityPersistence: true },
        { validity: Infinity, hasValidityPersistence: false }
    ].forEach(function (oFixture) {
        QUnit.module("Personalization  (" + oFixture.validity + "): Container V2 - Validity", {
            beforeEach: function () {
                this.oItemValue = { v1: "false" };
                testUtils.restoreSpies(
                    Log.error
                );

                oPersonalizationTestUtils.mockGetService();

                this.PersonalizationAdapterMock = oPersonalizationTestUtils
                    .createPersonalizationAdapterMock(AdapterContainerMock);

                this.oAdapter = new this.PersonalizationAdapterMock({});
                this.oService = new Personalization(this.oAdapter);

                return this.oService.getContainer(sContainer, { validity: oFixture.validity }).done(function (oContainer) {
                    this.oContainer = oContainer;
                    this.oContainerVSAdapter = new Personalization.VariantSetAdapter(this.oContainer);
                }.bind(this));
            },
            afterEach: function () {
                sandbox.restore();
                this.oService.delContainer(sContainer, { validity: oFixture.validity });
                oPersonalizationTestUtils.restoreGetService();
            }
        });

        QUnit.test("Container (" + oFixture.validity + "): get (new) + save + get + validity expired = clear faked clock!", function (assert) {
            return this.oService.createEmptyContainer(sContainer, { validity: oFixture.validity })
                .done(function (oContainer) {
                    oContainer.setItemValue(sItemKey, this.oItemValue);
                    assert.ok(true, "Personalization data was set");
                    // simulate the clock!
                    this.theFakeTime = new Date("Jan 2 2013 01:50");
                    this.thestub = sandbox.stub(Personalization.ContextContainer.prototype, "_getNow").callsFake(function () {
                        return this.theFakeTime;
                    }.bind(this));
                    var fmt = DateFormat.getDateInstance({ pattern: sABAPTimeSampFormat });
                    this.thetime = fmt.format(this.theFakeTime, true);
                    this.theExpireTime = fmt.format(new Date(this.theFakeTime.getTime() + oFixture.validity * 60000), true);
                    return oContainer.save()
                        .done(function () {
                            this.theFakeTime = new Date("Jan 2 2013 01:55");
                            // obtain the (existing) Container (again)
                            return this.oService.getContainer(sContainer, { validity: oFixture.validity })
                                .done(function (oContainer) {
                                    assert.ok(true, "Personalization data was gotten");
                                    assert.deepEqual(oContainer.getItemValue(sItemKey).v1, "false", "value present!");
                                    assert.deepEqual(oContainer.getItemKeys(), ["ItemKey"], "expired!");
                                    var oReadValue2 = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-scope");
                                    var oReadValueSTO = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-storageUTCTimestamp");
                                    var oReadValueEXP = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-expireUTCTimestamp");
                                    if (oFixture.hasValidityPersistence) {
                                        assert.deepEqual(oReadValue2.validity, oFixture.validity, "scope variable set;");
                                        assert.deepEqual(oReadValueSTO, this.thetime, "storage set;");
                                        assert.deepEqual(oReadValueEXP, this.theExpireTime, "expire set;");
                                    } else {
                                        assert.deepEqual(oReadValueSTO, undefined, "storage not set;");
                                        assert.deepEqual(oReadValueEXP, undefined, "expire not set;");
                                    }
                                    this.theFakeTime = new Date("Jan 2 2013 04:55");
                                    return this.oService.getContainer(sContainer, { validity: oFixture.validity })
                                        .done(function (oContainer) {
                                            if (oFixture.hasValidityPersistence) {
                                                assert.deepEqual(oContainer.getItemKeys(), [], "expired!");
                                                assert.deepEqual(oContainer.getItemValue(sItemKey), undefined, "expired!");
                                            } else {
                                                assert.deepEqual(oContainer.getItemValue(sItemKey).v1, "false", "value present!");
                                            }
                                        })
                                        .fail(function () {
                                            assert.ok(false, "'Error' fail function of getContainer #2 was triggered");
                                        });
                                }.bind(this))
                                .fail(function () {
                                    assert.ok(false, "'Error' fail function of getContainer #1 was triggered");
                                });
                        }.bind(this))
                        .fail(function () {
                            assert.ok(false, "'Error' fail function of save was triggered");
                        });
                }.bind(this))
                .fail(function () {
                    assert.ok(false, "'Error' fail function of createEmptyContainer was triggered");
                });
        });

        QUnit.test("Container (" + oFixture.validity + "): get (new) + save + get + delete", function (assert) {
            var oPromiseCreator,
                oService = this.oService,
                oItemValue = this.oItemValue;
            var done = assert.async(3);

            oPromiseCreator = oService.getContainer(sContainer, { validity: oFixture.validity });
            oPromiseCreator.done(function (oContainer) {
                var oPromiseGetter1,
                    oReadValue,
                    oReadValue2;
                oContainer.setItemValue(sItemKey, oItemValue);
                // not serialized !!!!
                oItemValue.v2 = "true";
                oReadValue = oContainer.getItemValue(sItemKey);
                assert.deepEqual(oReadValue, { v1: "false" },
                    "Read value is the value at time of set");
                assert.ok(oReadValue !== oItemValue,
                    "distinct object from set returned in get");
                oReadValue2 = oContainer.getItemValue(sItemKey);
                assert.ok(oReadValue2 !== oReadValue,
                    "distinct object returned in get");
                assert.ok(true, "Personalization data was set");
                done();

                oContainer.save().done(function () {
                    // obtain the (existing) Container (again)
                    oPromiseGetter1 = oService.getContainer(sContainer, { validity: oFixture.validity });
                    oPromiseGetter1.done(function (oContainer) {
                        var oPromiseDel,
                            oReadValue;

                        assert.ok(true, "Personalization data was gotten");
                        oReadValue = oContainer.getItemValue(sItemKey);
                        assert.deepEqual(oReadValue, { v1: "false" },
                            "Read value is the saved value");

                        oReadValue.v3 = "1111";
                        oReadValue2 = oContainer.getItemValue(sItemKey);
                        assert.deepEqual(oReadValue2.v3, undefined,
                            "Read value is not a live object;");
                        assert.ok(oReadValue !== oReadValue2,
                            "Same object ! the live written value");
                        done();
                        oPromiseDel = oService.delContainer(sContainer, { validity: oFixture.validity });
                        oPromiseDel.done(function () {
                            var oPromiseGetter2;
                            oPromiseGetter2 = oService.getContainer(sContainer, { validity: oFixture.validity });
                            oPromiseGetter2.done(function (oContainer) {
                                oReadValue = oContainer.getItemValue(sItemKey);
                                assert.ok(true, "Personalization data was deleted");
                                assert.equal(oReadValue, undefined,
                                    "Personalization data was deleted - value is undefined");
                                done();
                            });

                            // -- failed operations
                            oPromiseGetter2.fail(function () {
                                assert.ok(false, "'Error' fail function of getter2 was triggered");
                                done();
                            });
                            oPromiseDel.fail(function () {
                                assert.ok(false, "'Error' fail function of deleter was triggered");
                                done();
                            });
                        });
                        oPromiseGetter1.fail(function () {
                            assert.ok(false, "'Error' fail function of getter1 was triggered");
                            done();
                        });
                    });
                    oPromiseCreator.fail(function () {
                        assert.ok(false, "'Error' fail function of setter was triggered");
                        done();
                    });
                }).fail(function () {
                    assert.ok(false, "'Error' fail function of save was triggered");
                    done();
                });
            });
        });

        QUnit.test("Container (" + oFixture.validity + "): get (new) + save + get + validity set?", function (assert) {
            var oPromiseCreator,
                oService = this.oService,
                oItemValue = this.oItemValue;
            var done = assert.async(3);

            oPromiseCreator = oService.getContainer(sContainer, { validity: oFixture.validity });
            oPromiseCreator.done(function (oContainer) {
                var oPromiseGetter1,
                    oReadValue2,
                    fmt,
                    rawTime,
                    thetime,
                    theExpireTime;

                oContainer.setItemValue(sItemKey, oItemValue);
                assert.ok(true, "Personalization data was set");
                fmt = DateFormat.getDateInstance({ pattern: sABAPTimeSampFormat });
                rawTime = new Date();
                thetime = fmt.format(rawTime, true);
                theExpireTime = fmt.format(new Date(rawTime.getTime() + oFixture.validity * 60000), true);
                done();
                oContainer.save().done(function () {
                    var oReadValueSTO,
                        oReadValueEXP,
                        delta;

                    oReadValue2 = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-scope");
                    oReadValueSTO = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-storageUTCTimestamp");
                    oReadValueEXP = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-expireUTCTimestamp");
                    done();

                    if (oFixture.hasValidityPersistence) {
                        assert.deepEqual(oReadValue2.validity, oFixture.validity, "scope variable set;");
                        delta = parseInt(oReadValueSTO, 10) - parseInt(thetime, 10);
                        assert.ok(delta <= 2 && delta >= -2, "storage set;" + oReadValueSTO + "=?=" + thetime);
                        delta = parseInt(oReadValueEXP, 10) - parseInt(theExpireTime, 10);
                        assert.ok(delta <= 2 && delta >= -2, "expire set;" + oReadValueEXP + "=?=" + theExpireTime);
                    } else {
                        assert.deepEqual(oReadValueSTO, undefined, "storage not set;");
                        assert.deepEqual(oReadValueEXP, undefined, "expire not set;");
                    }

                    // obtain the (existing) Container (again)
                    oPromiseGetter1 = oService.getContainer(sContainer, { validity: oFixture.validity });
                    oPromiseGetter1.done(function (oContainer) {
                        var oReadValueSTO,
                            oReadValueEXP;

                        assert.ok(true, "Personalization data was gotten");
                        oReadValueSTO = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-storageUTCTimestamp");
                        oReadValueEXP = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-expireUTCTimestamp");
                        done();

                        if (oFixture.hasValidityPersistence) {
                            assert.deepEqual(oReadValueSTO, thetime, "storage set;");
                            assert.deepEqual(oReadValueEXP, theExpireTime, "expire set;");
                        } else {
                            assert.deepEqual(oReadValueSTO, undefined, "storage not set;");
                            assert.deepEqual(oReadValueEXP, undefined, "expire not set;");
                        }
                        // -- failed operations
                    }).fail(function () {
                        assert.ok(false, "'Error' fail function of getter1 was triggered");
                        done();
                    });
                });
                oPromiseCreator.fail(function () {
                    assert.ok(false, "'Error' fail function of setter was triggered");
                    done();
                });
            });
        });

        QUnit.test("Container (" + oFixture.validity + "): get (new) + nosave,  get + delete", function (assert) {
            var oPromiseCreator,
                oService = this.oService,
                oItemValue = this.oItemValue;
            var done = assert.async(3);

            oPromiseCreator = oService.getContainer(sContainer, { validity: oFixture.validity });
            oPromiseCreator.done(function (oContainer) {
                var oPromiseGetter1,
                    oReadValue,
                    oReadValue2;

                oContainer.setItemValue(sItemKey, oItemValue);
                // not serialized !!!!
                oItemValue.v2 = "true";
                oReadValue = oContainer.getItemValue(sItemKey);
                assert.deepEqual(oReadValue, { v1: "false" }, "Read value is the value at time of set");
                assert.ok(oReadValue !== oItemValue, "distinct object from set returned in get");

                oReadValue2 = oContainer.getItemValue(sItemKey);
                assert.ok(oReadValue2 !== oReadValue, "distinct object returned in get");
                assert.ok(true, "Personalization data was set");
                done();

                // obtain the (existing) Container (again)
                oPromiseGetter1 = oService.getContainer(sContainer, { validity: oFixture.validity });
                oPromiseGetter1.done(function (oContainer) {
                    var oPromiseDel,
                        oReadValue;

                    assert.ok(true, "Personalization data was gotten");
                    oReadValue = oContainer.getItemValue(sItemKey);
                    assert.deepEqual(oReadValue, undefined, "not saved value is initial");
                    done();

                    oPromiseDel = oService.delContainer(sContainer, { validity: oFixture.validity });
                    oPromiseDel.done(function () {
                        var oPromiseGetter2;
                        oPromiseGetter2 = oService.getContainer(sContainer, { validity: oFixture.validity });
                        oPromiseGetter2.done(function (oContainer) {
                            oReadValue = oContainer.getItemValue(sItemKey);
                            assert.ok(true, "Personalization data was deleted");
                            assert.equal(oReadValue, undefined,
                                "Personalization data was deleted - value is undefined");
                            done();
                        });

                        // -- failed operations
                        oPromiseGetter2.fail(function () {
                            assert.ok(false, "'Error' fail function of getter2 was triggered");
                            done();
                        });
                        oPromiseDel.fail(function () {
                            assert.ok(false, "'Error' fail function of deleter was triggered");
                            done();
                        });
                    });
                    oPromiseGetter1.fail(function () {
                        assert.ok(false, "'Error' fail function of getter1 was triggered");
                        done();
                    });
                });
                oPromiseCreator.fail(function () {
                    assert.ok(false, "'Error' fail function of setter was triggered");
                    done();
                });
            });
        });

        QUnit.test("Container (" + oFixture.validity + "): get save, create (empty)!", function (assert) {
            var oPromiseCreator,
                oService = this.oService,
                oItemValue = this.oItemValue;
            var done = assert.async(5);

            oPromiseCreator = oService.getContainer(sContainer, { validity: oFixture.validity });
            oPromiseCreator.done(function (oContainer) {
                oContainer.setItemValue(sItemKey, oItemValue);
                oContainer.setItemValue("Stale", oItemValue);
                // not serialized !!!!
                oItemValue.v2 = "true";
                oContainer.getItemValue(sItemKey);
                assert.ok(true, "Personalization data was set");
                done();

                // save
                oContainer.save().done(function () {
                    var oPromiseGet,
                        oReadValue;

                    assert.ok(true, "Personalization data was gotten");
                    oReadValue = oContainer.getItemValue(sItemKey);
                    assert.deepEqual(oReadValue, { v1: "false" }, "not saved value is initial");
                    done();

                    oPromiseGet = oService.createEmptyContainer(sContainer, { validity: oFixture.validity });
                    oPromiseGet.done(function (oContainer) {
                        oReadValue = oContainer.getItemValue(sItemKey);
                        assert.ok(true, "Personalization data was deleted");
                        assert.equal(oReadValue, undefined,
                            "Personalization data was deleted - value is undefined");
                        assert.equal(oContainer.getItemKeys().length, 0,
                            "Personalization data was deleted - value is undefined");

                        oContainer.setItemValue(sItemKey, { v333: true });
                        done();
                        oContainer.save().done(function () {
                            done();
                            oService.getContainer(sContainer, { validity: oFixture.validity }).done(function (oContainer) {
                                oReadValue = oContainer.getItemValue("Stale");
                                assert.equal(oReadValue, undefined,
                                    "Personalization data was cleared - value is undefined");
                                oReadValue = oContainer.getItemValue(sItemKey);
                                assert.deepEqual(oReadValue, { v333: true }, " new value set after");
                                done();

                                // -- failed operations
                            }).fail(function () {
                                assert.ok(false, "'Error' fail function of getter2 was triggered");
                                done();
                            });
                        }).fail(function () {
                            assert.ok(false, "'Error' fail function of getter2 was triggered");
                            done();
                        });
                    }).fail(function () {
                        assert.ok(false, "'Error' fail function of getter2 was triggered");
                        done();
                    });
                }).fail(function () {
                    assert.ok(false, "'Error' fail function of savewas triggered");
                    done();
                });
                oPromiseCreator.fail(function () {
                    assert.ok(false, "'Error' fail function of setter was triggered");
                    done();
                });
            });
        });

        QUnit.test("Container (" + oFixture.validity + "): reload restores original data", function (assert) {
            return this.oService.getContainer(sContainer, { validity: oFixture.validity }).done(function (oContainer) {
                oContainer.setItemValue(sItemKey, this.oItemValue);
                assert.equal(oContainer.getItemValue(sItemKey).v1, "false", sItemKey + " added");
                return oContainer.save()
                    .done(function () {
                        assert.ok(true, "Data saved");
                        assert.equal(oContainer.getItemValue(sItemKey).v1, "false", sItemKey + " still there after save");
                        oContainer.setItemValue(sItemKey, "item2");
                        assert.equal(oContainer.getItemValue(sItemKey), "item2", sItemKey + " changed to item2 (no save)");
                        return oContainer.load()
                            .done(function () {
                                assert.equal(oContainer.getItemValue(sItemKey).v1, "false",
                                    sItemKey + " loaded with correct value '" + this.oItemValue.v1 + "'");
                            }.bind(this))
                            .fail(function () {
                                assert.ok(false, "Load failed");
                            });
                    }.bind(this))
                    .fail(function () {
                        assert.ok(false, "Save failed");
                    });
            }.bind(this));
        });

        QUnit.test("Container ( " + oFixture.validity + "): get  setItem length warnings", function (assert) {
            var that = this,
                sContainerKey = "AveryLongContainerKeyMoreThan40CharsWithT",
                oSpyAdapterGet = sandbox.spy(Log, "error");
            var done = assert.async();

            this.oService.getContainer(sContainerKey, { validity: oFixture.validity }).done(function (oContainer) {
                assert.deepEqual(Log.error.getCall(0).args[0], "Personalization Service container key "
                    + "(\"AveryLongContainerKeyMoreThan40CharsWithT\") should be less than 40 characters [current :41]");
                that.oItemValue = { v1: "false" };
                oContainer.setItemValue(sContainerKey, that.oItemValue);
                assert.deepEqual(Log.error.getCall(1).args[0],
                    "Personalization Service item key/variant set name (\"AveryLongContainerKeyMoreThan40CharsWithT\") should be less than 40 characters [current :41]");
                assert.deepEqual(Log.error.getCall(1).args[0],
                    "Personalization Service item key/variant set name (\"AveryLongContainerKeyMoreThan40CharsWithT\") should be less than 40 characters [current :41]");
                assert.ok(true, "Personalization data was set");
                oSpyAdapterGet.restore();
                done();
            }).fail(function () {
                assert.ok(false, "'Error' fail function of save was triggered");
                oSpyAdapterGet.restore();
                done();
            });
        });

        QUnit.test("AppContainer ( " + oFixture.validity + "): get setItem length 40 no warnings", function (assert) {
            var that = this,
                sContainerKey = "AveryLongContainerKeyMoreThan40CharsWith",
                oSpyAdapterGet = sandbox.spy(Log, "error");
            var done = assert.async();

            this.oService.createEmptyContainer(sContainerKey, { validity: oFixture.validity }).done(function (oContainer) {
                assert.deepEqual(Log.error.getCall(0), null);
                that.oItemValue = { v1: "false" };
                oContainer.setItemValue(sContainerKey, that.oItemValue);
                assert.deepEqual(Log.error.getCall(0), null);
                assert.ok(true, "Personalization data was set");
                oSpyAdapterGet.restore();
                done();
            }).fail(function () {
                assert.ok(false, "'Error' fail function of save was triggered");
                oSpyAdapterGet.restore();
                done();
            });
        });

        QUnit.test("Container (" + oFixture.validity + "): Error during load inside constructor", function (assert) {
            var that = this;
            var done = assert.async();

            if (oFixture.validity === 0) {
                assert.ok(true, "validity 0, adapter throws no errors, mock not relevant");
                done();
                return;
            }
            //standard setup already filled the windowAdapter. Thus the mock adapter code is not excecuted
            //so we have to delete the window content to simulate the error behaviour
            Personalization.WindowAdapter.prototype.data = {};

            this.oAdapter.setErrorProvocation(sContainer);
            this.oService.getContainer(sContainer, { validity: oFixture.validity })
                .done(function (/*oContainer*/) {
                    assert.ok(false, "Error: Load of container should have failed");
                    done();
                })
                .fail(function (/*oContainer*/) {
                    assert.ok(true, "Load of container failed");
                    that.oAdapter.resetErrorProvocation(sContainer);
                    that.oService._oContainerMap.remove(sContainerPrefix + sContainer);
                    // dirty hack to get a new deferred object during the deletion
                    done();
                    done = assert.async();

                    that.oService.delContainer(sContainer, { validity: oFixture.validity })
                        .done(function () {
                            assert.ok(true, "Deletion of container succeeded");
                            done();
                        })
                        .fail(function () {
                            assert.ok(false, "Deletion of container failed");
                            done();
                        });
                });
        });

        QUnit.test("Container (" + oFixture.validity + "): Error during save", function (assert) {
            var that = this;
            var done = assert.async();

            if (oFixture.validity === 0) {
                assert.ok(true, " validity 0, adapter throws no errors, mock not relevant");
                done();
                return;
            }

            this.oService.getContainer(sContainer, { validity: oFixture.validity })
                .done(function (oContainer) {
                    assert.ok(true, "Load of container succeeded");
                    that.oAdapter.setErrorProvocation(sContainer);
                    done();
                    done = assert.async();
                    oContainer.save()
                        .done(function () {
                            assert.ok(false, "Error: Save of container succeeded");
                            done();
                        })
                        .fail(function () {
                            assert.ok(true, "Save of container failed");
                            done();
                        });
                })
                .fail(function (/*oContainer*/) {
                    assert.ok(false, "Error: Load of container failed");
                    done();
                });
        });

        QUnit.test("Container (" + oFixture.validity + "): Error during deletion", function (assert) {
            var that = this;
            var done = assert.async();

            if (oFixture.validity === 0) {
                assert.ok(true, " validity 0, adapter throws no errors, mock not relevant");
                done();
                return;
            }

            this.oService.getContainer(sContainer, { validity: oFixture.validity })
                .done(function (/*oContainer*/) {
                    assert.ok(true, "Load of container succeeded");
                    that.oAdapter.setErrorProvocation(sContainer);
                    done();
                    done = assert.async();
                    that.oService.delContainer(sContainer, { validity: oFixture.validity })
                        .done(function () {
                            assert.ok(false, "Error: Deletion of container succeeded");
                            done();
                        })
                        .fail(function () {
                            assert.ok(true, "Deletion of container failed");
                            done();
                        });
                })
                .fail(function (/*oContainer*/) {
                    assert.ok(false, "Error: Load of container failed");
                    done();
                });
        });

        QUnit.test("Container (" + oFixture.validity + "): check for container not a singleton", function (assert) {
            var that = this;
            var done = assert.async(2);

            this.oService.getContainer(sContainer, { validity: oFixture.validity })
                .done(function (oContainer1) {
                    assert.ok(true, "Load of container 1 succeeded");
                    done();
                    that.oService.getContainer(sContainer, { validity: oFixture.validity })
                        .done(function (oContainer2) {
                            assert.ok(true, "Load of container 2 succeeded");
                            assert.ok(oContainer1 !== oContainer2, "Container is not a singleton");
                            oContainer1.setItemValue("once", "aValue");
                            oContainer2.setItemValue("once", "anotherInstanceValue");
                            assert.equal("aValue", oContainer1.getItemValue("once"), "Container is not a singleton, distinct storage");
                            assert.equal("anotherInstanceValue", oContainer2.getItemValue("once"), "Container is not a singleton, distinct storage");
                            done();
                        })
                        .fail(function () {
                            assert.ok(false, "Error: Load of container 2  failed");
                            done();
                        });
                })
                .fail(function (/*oContainer*/) {
                    assert.ok(false, "Error: Load of container 1 failed");
                    done();
                });
        });

        QUnit.test("Container (" + oFixture.validity + "): Mix of container and personalizer", function (assert) {
            // Personalizer does reuse of the container
            this.oContainer.setItemValue(sItemKey, this.oItemValue);
            assert.ok(this.oContainer.containsItem(sItemKey), sItemKey + " was added");
            var oPersId = {
                container: sContainer,
                item: sItemKey
            };

            return this.oContainer.save()
                .done(function () {
                    var oPersonalizer = this.oService.getPersonalizer(oPersId);
                    return oPersonalizer.getPersData()
                        .done(function (oReadItemValue) {
                            assert.deepEqual(this.oItemValue, oReadItemValue, "distinct for validity 0");
                        }.bind(this))
                        .fail(function () {
                            assert.ok(false, "Error: getPersData failed");
                        });
                }.bind(this)).fail(function () {
                    assert.ok(false, "Error: save failed");
                });
        });

        QUnit.test("Variant Set (" + oFixture.validity + "): save and simulate browser reload 1", function (assert) {
            this.aVariantExp = [];
            this.oVariantNameAndKeysExp = {};
            var oVariantSet,
                oVariant1,
                oVariant2,
                oItemMap,
                that = this;
            var done = assert.async(2);

            // add variant set
            if (this.oContainerVSAdapter.containsVariantSet(sVariantSetKey)) {
                this.oContainerVSAdapter.delVariantSet(sVariantSetKey);
            }
            assert.ok(!this.oContainerVSAdapter.containsVariantSet(sVariantSetKey),
                "Variant set '" + sVariantSetKey + "' does not exist");
            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            oItemMap = new utils.Map();

            function buildVariantObject (aVariants, sVariantKey, va) {
                aVariants[sVariantKey] = {
                    key: va.getVariantKey(),
                    name: va.getVariantName(),
                    items: {}
                };
                va.getItemKeys().forEach(function (sItemKey) {
                    aVariants[sVariantKey].items[sItemKey] = va.getItemValue(sItemKey);
                });
            }
            oVariant1 = oVariantSet.addVariant("V1");
            oVariant1.setItemValue("I1", {
                Val1: "value 1",
                Val2: "value 2"
            });
            oVariant1.setItemValue("I2", {
                Filter1: "24",
                Filter2: "1000"
            });
            oItemMap.entries = oVariant1;
            this.oVariantNameAndKeysExp.V1 = oVariant1.getVariantKey();
            buildVariantObject(this.aVariantExp, oVariant1.getVariantKey(), oVariant1);
            // add variant V2
            oVariant2 = oVariantSet.addVariant("V2");
            oVariant2.setItemValue("I1", {
                Val1: "value 11",
                Val2: "value 12"
            });
            oVariant2.setItemValue("I2", {
                Filter1: "48",
                Filter2: "50000"
            });
            oItemMap.entries = oVariant2;
            buildVariantObject(this.aVariantExp, oVariant2.getVariantKey(), oVariant2);
            this.oVariantNameAndKeysExp.V2 = oVariant2.getVariantKey();
            // save
            this.oContainer.save().done(function () {
                // simulate browser reload
                delete this.oContainer;
                that.oService._oContainerMap.remove(sContainerPrefix + sContainer);
                done();
                that.oService.getContainer(sContainer, { validity: oFixture.validity }).done(function (oContainer) {
                    var aVariantKeys = [],
                        aVariants = [],
                        oVariantNameAndKeys,
                        oContainerVSAdapter = new Personalization.VariantSetAdapter(oContainer);

                    assert.ok(oContainerVSAdapter.containsVariantSet(sVariantSetKey),
                        "Variant set '" + sVariantSetKey + "' exists after save");
                    oVariantSet = oContainerVSAdapter.getVariantSet(sVariantSetKey);

                    oVariantNameAndKeys = oVariantSet.getVariantNamesAndKeys();
                    assert.deepEqual(oVariantNameAndKeys, that.oVariantNameAndKeysExp,
                        "Variant names and keys are correct");
                    assert.deepEqual(oVariantSet.getVariantKeyByName("V1"), that.oVariantNameAndKeysExp.V1);
                    assert.deepEqual(oVariantSet.getVariantKeyByName("V2"), that.oVariantNameAndKeysExp.V2);
                    aVariantKeys = oVariantSet.getVariantKeys();
                    aVariantKeys.forEach(function (sVariantKey) {
                        var va = oVariantSet.getVariant(sVariantKey);
                        buildVariantObject(aVariants, sVariantKey, va);
                    });
                    assert.deepEqual(aVariants, that.aVariantExp, "Entire variant is correct");
                    oContainerVSAdapter.delVariantSet(sVariantSetKey);
                    assert.ok(!oContainerVSAdapter.containsVariantSet(sVariantSetKey),
                        "Variant set '" + sVariantSetKey + "' was deleted");
                    done();
                });
            }).fail(function () {
                assert.ok(false, "Save failed");
            });
        });

        QUnit.test("Variant Set (" + oFixture.validity + "): save and simulate browser reload 2", function (assert) {
            var oVariantSet,
                oVariant,
                that = this;
            var done = assert.async();

            // add variant set
            if (this.oContainerVSAdapter.containsVariantSet(sVariantSetKey)) {
                this.oContainerVSAdapter.delVariantSet(sVariantSetKey);
            }

            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            // add variant V1
            oVariant = oVariantSet.addVariant("V1");
            oVariant.setItemValue("I1", {
                Val1: "value 1",
                Val2: "value 2"
            });
            oVariant.setItemValue("I2", {
                Filter1: "24",
                Filter2: "1000"
            });
            // add variant V2
            oVariant = oVariantSet.addVariant("V2");
            oVariant.setItemValue("I1", {
                Val1: "value 11",
                Val2: "value 12"
            });
            oVariant.setItemValue("I2", {
                Filter1: "48",
                Filter2: "50000"
            });
            // save container
            this.oContainer.save().done(function () {
                // tabula rasa
                delete that.oContainer;
                that.oService._oContainerMap.remove(sContainer);
                // new container
                that.oService.getContainer(sContainer, { validity: oFixture.validity }).done(function (oContainer) {
                    var aVariantKeys = [],
                        aVariants = [],
                        oVariant,
                        sVariantKey = "",
                        that = this;
                    // !!!!!!!!!!!!!!!!!!!!!!!!!!
                    that.oContainer = oContainer;
                    that.oContainerVSAdapter = new Personalization.VariantSetAdapter(oContainer);
                    oVariantSet = that.oContainerVSAdapter.getVariantSet(sVariantSetKey);
                    oVariant = oVariantSet.addVariant("V3");
                    oVariant.setItemValue("I1", {
                        Val1: "value 111",
                        Val2: "value 123"
                    });
                    oVariant.setItemValue("I2", {
                        Filter1: "489",
                        Filter2: "90000"
                    });
                    sVariantKey = oVariantSet.getVariantKeyByName("V2");
                    oVariantSet.delVariant(sVariantKey);
                    sVariantKey = oVariantSet.getVariantKeyByName("V1");
                    oVariantSet.delVariant(sVariantKey);
                    oVariant = oVariantSet.addVariant("V1");
                    oVariant.setItemValue("I3", {
                        Val1: "value 01",
                        Val2: "value 02"
                    });
                    oVariant.setItemValue("I4", {
                        Filter1: "240",
                        Filter2: "10009"
                    });
                    that.oContainerVSAdapter.save(); // delegates!
                    aVariantKeys = oVariantSet.getVariantKeys();
                    aVariantKeys.forEach(function (sVariantKey) {
                        aVariants.push(oVariantSet.getVariant(sVariantKey));
                    });
                    assert.equal(2, aVariants.length, "Variant Set contains two items");
                    assert.equal("V3", aVariants[0].getVariantName(), "First variant in set is V3");
                    assert.deepEqual(aVariants[0].getItemValue("I1"), {
                        Val1: "value 111",
                        Val2: "value 123"
                    }, "Item value I1 from V3 still exist");
                    assert.deepEqual(aVariants[0].getItemValue("I2"), {
                        Filter1: "489",
                        Filter2: "90000"
                    }, "Item value I2 from V3 still exist");
                    assert.equal("V1", aVariants[1].getVariantName(), "Second variant in set is V1");
                    assert.deepEqual(aVariants[1].getItemValue("I3"), {
                        Val1: "value 01",
                        Val2: "value 02"
                    }, "Item value I3 from V1 still exist");
                    assert.deepEqual(aVariants[1].getItemValue("I4"), {
                        Filter1: "240",
                        Filter2: "10009"
                    }, "Item value I4 from V1  still exist");
                    // delete variant set
                    that.oContainerVSAdapter.delVariantSet(sVariantSetKey);
                    done();
                });
            }).fail(function () {
                assert.ok(false, "Save failed");
            });
        });
    });

    // ............................................................................
    //
    //               Container Version 2 - Validity 0
    //
    // ............................................................................

    QUnit.module("Personalization Container V2 - validity 0", {
        beforeEach: function (assert) {
            // the config has to be reset after the test
            if (!sCachedConfig) {
                sCachedConfig = JSON.stringify(window["sap-ushell-config"]);
            }

            oPersonalizationTestUtils.mockGetService();

            Personalization.WindowAdapter.prototype.data = {};
        },
        afterEach: function () {
            if (oMock.AdapterContainerMock.restore) {
                oMock.AdapterContainerMock.restore();
            }
            if (Personalization.WindowAdapterContainer.restore) {
                Personalization.WindowAdapterContainer.restore();
            }
            delete this.oAdapter;
            delete this.oService;
            window["sap-ushell-config"] = JSON.parse(sCachedConfig);

            oPersonalizationTestUtils.restoreGetService();
        }
    });



    QUnit.test("2 containers with the same name, validity 0 & 1", function (assert) {
        var done = assert.async();
        // With Version 1.28+ the persistence within a window is always identical
        // persistencies.
        var sContainerName = "Container2075",
            sItemKey = "Item2078",
            oItemValue = { test: "test2079" };

        // Arrange
        var oService = oPersonalizationTestUtils.createPersonalizationService({
            adapterContainerConstructor: AdapterContainerMock
        });

        // Act
        oService.getContainer(sContainerName, { validity: 0 })
            .done(function (oVal0Container) {
                oVal0Container.setItemValue(sItemKey, oItemValue);
                oVal0Container.save()
                    .done(function () {
                        oService.getContainer(sContainerName, { validity: 1 })
                            .done(function (oVal1Container) {
                                var oReadItemValue,
                                    nValidity;
                                oReadItemValue = oVal1Container.getItemValue(sItemKey);
                                assert.deepEqual(oReadItemValue, oItemValue, "Same container persistency for validity 0 & 1");
                                nValidity = oVal1Container._getItemValueInternal("ADMIN#", "sap-ushell-container-scope") &&
                                    oVal1Container._getItemValueInternal("ADMIN#", "sap-ushell-container-scope").validity;
                                assert.equal(nValidity, undefined, "no artificial validity set");
                                done();
                            });
                    });
            });
    });

    //  ............................................................................
    //
    //               Container Version 2 - Deferred Sequentialization
    //
    //  ............................................................................

    [
        { validity: 0 },
        { validity: 30 },
        { validity: Infinity }
    ].forEach(function (oFixture) {
        QUnit.module("Personalization Container (" + oFixture.validity + "): Deferred Sequentialization", {
            beforeEach: function () {
                this.oService = {};
                this.oAdapter = {};
                this.oContainer = {};
                var oSystem = {},
                    that = this;

                oPersonalizationTestUtils.mockGetService();
                this.PersonalizationAdapterMock = oPersonalizationTestUtils
                    .createPersonalizationAdapterMock(AdapterContainerMock);

                this.oAdapter = new this.PersonalizationAdapterMock(oSystem);
                this.oService = new Personalization(this.oAdapter);

                return new Promise(function (fnResolve) {
                    that.oService.getContainer(sContainer, { validity: oFixture.validity })
                        .done(function (oContainer) {
                            that.oContainer = oContainer;
                            fnResolve();
                        });
                });
            },
            afterEach: function () {
                this.oService.delContainer(sContainer, { validity: oFixture.validity });
                this.oService.delContainer(sContainer + "2nd", { validity: oFixture.validity });
                delete this.oAdapter;
                delete this.oContainer;
                delete this.oService;

                oPersonalizationTestUtils.restoreGetService();
            }
        });

        QUnit.test("AppContainer (" + oFixture.validity + "): saveDeferred, load, check", function (assert) {
            var that = this;
            var done = assert.async();

            this.oContainer.setItemValue("key1", { v1: "Value1" });
            this.oContainer.saveDeferred(10)
                .done(function (/*sMsg*/) {
                    assert.ok(true, "Save done");
                    done();
                    done = assert.async();
                    that.oService.getContainer(sContainer, { validity: oFixture.validity })
                        .done(function (oReadContainer) {
                            assert.deepEqual(oReadContainer.getItemValue("key1"), { v1: "Value1" }, "Correct save");
                            done();
                        })
                        .fail(function () {
                            assert.ok(false, "getContainer failed");
                            done();
                        });
                })
                .fail(function () {
                    assert.ok(false, "Save failed");
                    done();
                });
        });

        QUnit.test("AppContainer (" + oFixture.validity + "): saveDeferred, saveDeferred, load, check", function (assert) {
            var that = this;
            var done = assert.async();
            var done2 = assert.async();

            this.oContainer.setItemValue("key1", { v1: "Value1" });
            this.oContainer.saveDeferred(1000000)
                .done(function (sMsg) {

                    assert.ok(true, "Dropped save done");
                    assert.equal(sMsg, Personalization.prototype.SAVE_DEFERRED_DROPPED, "saveDeferred was dropped");
                    done();
                    done = assert.async();
                    that.oService.getContainer(sContainer, { validity: oFixture.validity })
                        .done(function (oReadContainer) {
                            assert.deepEqual(oReadContainer.getItemValue("key1"), { v1: "Value1" }, "First saveDeferred - Correct save of key1");
                            assert.deepEqual(oReadContainer.getItemValue("key2"), { v1: "Value1" }, "First saveDeferred - Correct save of key2");
                            done();
                        })
                        .fail(function () {
                            assert.ok(false, "getContainer failed");
                            done();
                        });
                })
                .fail(function () {
                    assert.ok(false, "Save failed");
                    done();
                });
            this.oContainer.setItemValue("key2", { v1: "Value1" });
            this.oContainer.save() //Deferred(1)
                .done(function (/*sMsg*/) {
                    assert.ok(true, "Save done");
                    done2();
                    done2 = assert.async();
                    that.oService.getContainer(sContainer, { validity: oFixture.validity })
                        .done(function (oReadContainer) {
                            assert.deepEqual(oReadContainer.getItemValue("key1"), { v1: "Value1" }, "Second saveDeferred - Correct save of key1");
                            assert.deepEqual(oReadContainer.getItemValue("key2"), { v1: "Value1" }, "Second saveDeferred - Correct save of key2");
                            done2();
                        })
                        .fail(function () {
                            assert.ok(false, "getContainer failed");
                            done2();
                        });
                })
                .fail(function () {
                    assert.ok(false, "Save failed");
                    done2();
                });
        });

        QUnit.test("AppContainer (" + oFixture.validity + "): saveDeferred, flush, load, check", function (assert) {
            var that = this;
            var done = assert.async(2);
            var done2 = assert.async(2);

            this.oContainer.setItemValue("key1", { v1: "Value1" });
            this.oContainer.saveDeferred(1000000)
                .done(function (/*sMsg*/) {
                    assert.ok(true, "Dropped save done");
                    done();
                    that.oService.getContainer(sContainer, { validity: oFixture.validity })
                        .done(function (oReadContainer) {
                            assert.deepEqual(oReadContainer.getItemValue("key1"), { v1: "Value1" }, "First saveDeferred - Correct save of key1");
                            assert.deepEqual(oReadContainer.getItemValue("key2"), { v1: "Value1" }, "First saveDeferred - Correct save of key2");
                            done();
                        })
                        .fail(function () {
                            assert.ok(false, "getContainer failed");
                            done();
                        });
                })
                .fail(function () {
                    assert.ok(false, "Save failed");
                    done();
                });
            this.oContainer.setItemValue("key2", { v1: "Value1" });
            this.oContainer.flush() //Deferred(1)
                .done(function () {
                    assert.ok(true, "Save done");
                    done2();
                    that.oService.getContainer(sContainer, { validity: oFixture.validity })
                        .done(function (oReadContainer) {
                            assert.deepEqual(oReadContainer.getItemValue("key1"), { v1: "Value1" }, "Second saveDeferred - Correct save of key1");
                            assert.deepEqual(oReadContainer.getItemValue("key2"), { v1: "Value1" }, "Second saveDeferred - Correct save of key2");
                            done2();
                        })
                        .fail(function () {
                            assert.ok(false, "getContainer failed");
                            done2();
                        });
                })
                .fail(function () {
                    assert.ok(false, "Save failed");
                    done2();
                });
        });
    });

    // ............................................................................
    //
    // Container Version 2 - Cross Validity
    //
    // cross validity tests
    // test interaction between several validitys!
    //
    // save 30,   get 0 -> new instance ?
    // save 0,  get 30 -> new instance
    //
    // sequence  validity (save) validity2 get, del(validity2)   get validity.
    // zombiepersistence true indicates save() data is retrieved albeit deletion
    //
    // ............................................................................

    [
        { validity: 0, validity2: 30, zombiePersistence: false, distinctValues: false },
        { validity: 30, validity2: 0, zombiePersistence: true, distinctValues: false },
        { validity: 30, validity2: Infinity, zombiePersistence: false, distinctValues: false },
        { validity: Infinity, validity2: 30, zombiePersistence: false, distinctValues: false }
    ].forEach(function (oFixture) {
        QUnit.module("Personalization  Container (" + oFixture.validity + "/" + oFixture.validity2 + "): Cross Validity", {
            beforeEach: function () {
                this.oService = {};
                var oSystem,
                    oAdapter;

                oPersonalizationTestUtils.mockGetService();

                this.PersonalizationAdapterMock = oPersonalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock);

                oAdapter = new this.PersonalizationAdapterMock(oSystem);
                this.oService = new Personalization(oAdapter);
            },
            afterEach: function () {
                this.oService.delContainer(sContainer, { validity: oFixture.validity });
                delete this.oService;

                oPersonalizationTestUtils.restoreGetService();
            }
        });

        QUnit.test("AppContainer (" + oFixture.validity + "/" + oFixture.validity2 + ") : get with different validity gets same data, new instance! get (new) +  get + delete", function (assert) {
            var oPromiseCreator,
                oService = this.oService,
                that = this;
            var done = assert.async(4);

            oPromiseCreator = oService.getContainer(sContainer, { validity: oFixture.validity });
            oPromiseCreator.done(function (oContainer) {
                var oPromiseGetter1 = {};
                that.oItemValue = { v1: false };
                oContainer.setItemValue(sItemKey, that.oItemValue);
                // not serialized !!!!
                that.oItemValue.v2 = true;
                assert.equal(oFixture.validity, oContainer._getValidity(), "first validity");
                assert.ok(true, "Personalization data was set");
                done();
                oContainer.save()
                    .done(function () {
                        assert.ok(true, "save ok");
                        done();
                        // obtain the (existing) Container (again)
                        oPromiseGetter1 = oService.getContainer(sContainer, { validity: oFixture.validity2 });
                        oPromiseGetter1.done(function (oContainer) {
                            var oPromiseDel = {},
                                oReadValueExpected,
                                oReadValue;
                            assert.ok(true, "Personalization data was gotten");
                            oReadValue = oContainer.getItemValue(sItemKey);
                            oReadValueExpected = { v1: false };
                            if (oFixture.distinctValues) {
                                oReadValueExpected = undefined;
                            }
                            assert.deepEqual(oReadValueExpected, oReadValue, "Read value is the saved value!");
                            assert.equal(oFixture.validity2, oContainer._getValidity(), "2nd validity");
                            oPromiseDel = oService.delContainer(sContainer, { validity: oFixture.validity2 });
                            done();
                            oPromiseDel.done(function () {
                                var oPromiseGetter2 = {};
                                assert.equal(oFixture.validity2, oContainer._getValidity(), "2nd validity of stale container");
                                oPromiseGetter2 = oService.getContainer(sContainer, { validity: oFixture.validity });
                                oPromiseGetter2.done(function (oContainer) {
                                    oReadValue = oContainer.getItemValue(sItemKey);
                                    assert.ok(true, "Personalization data deletion successful");
                                    assert.equal(oFixture.validity, oContainer._getValidity(), "validity ok");
                                    done();
                                    if (oFixture.zombiePersistence) {
                                        assert.deepEqual({ v1: false }, oReadValue, " see first persistence !");
                                    } else {
                                        assert.equal(oReadValue, undefined, "Personalization data was deleted - value is undefined");
                                    }
                                });

                                // -- failed operations
                                oPromiseGetter2.fail(function () {
                                    assert.ok(false, "'Error' fail function of getter2 was triggered");
                                    done();
                                });
                            });
                            oPromiseDel.fail(function () {
                                assert.ok(false, "'Error' fail function of deleter was triggered");
                                done();
                            });
                        });
                        oPromiseGetter1.fail(function () {
                            assert.ok(false, "'Error' fail function of getter1 was triggered");
                            done();
                        });
                    })
                    .fail(function () {
                        assert.ok(false, "'Error' fail function of saver was triggered");
                        done();
                    });
            });
            oPromiseCreator.fail(function () {
                assert.ok(false, "'Error' fail function of setter was triggered");
                done();
            });
        });
    });

    [
        { validity: Infinity, effectiveValidity: Infinity, adapterCalled: true },
        { validity: 0, effectiveValidity: 0, adapterCalled: false },
        { validity: 30, effectiveValidity: 30, adapterCalled: true },
        { validity: undefined, effectiveValidity: Infinity, adapterCalled: true }
    ].forEach(function (oFixture) {
        QUnit.module("Personalization  ( " + oFixture.validity + "): test adapter called", {
            beforeEach: function () {
                this.oService = {};
                var oSystem,
                    oAdapter;

                oPersonalizationTestUtils.mockGetService();

                this.PersonalizationAdapterMock = oPersonalizationTestUtils
                    .createPersonalizationAdapterMock(AdapterContainerMock);

                oAdapter = new this.PersonalizationAdapterMock(oSystem);
                this.oSpyAdapterGet = sandbox.spy(this.PersonalizationAdapterMock.prototype, "getAdapterContainer");
                this.oSpyAdapterDelete = sandbox.spy(oAdapter, "delAdapterContainer");
                this.oSpyAdapterSave = sandbox.spy(oMock.AdapterContainerMock.prototype, "save");
                this.oService = new Personalization(oAdapter);
            },
            afterEach: function () {
                this.oSpyAdapterGet.restore();
                this.oSpyAdapterDelete.restore();
                this.oSpyAdapterSave.restore();
                this.oService.delContainer(sContainer, { validity: oFixture.validity });
                this.oService.delContainer(sContainer + "2nd", { validity: oFixture.validity });
                delete this.oService;

                oPersonalizationTestUtils.restoreGetService();
            }
        });

        QUnit.test("AppContainer  ( " + oFixture.validity + ") : test adapter called", function (assert) {
            var oPromiseCreator,
                oService = this.oService,
                that = this;
            var done = assert.async(5);

            oPromiseCreator = oService.getContainer(sContainer, { validity: oFixture.validity });
            oPromiseCreator.done(function (oContainer) {
                var oPromiseGetter1 = {};
                that.oItemValue = { v1: "false" };
                oContainer.setItemValue(sItemKey, that.oItemValue);
                // not serialized !!!!
                that.oItemValue.v2 = "true";
                assert.equal(oFixture.effectiveValidity, oContainer._getValidity(), "first validity");
                assert.ok(true, "Personalization data was set");
                done();
                oContainer.save()
                    .done(function () {
                        assert.ok(true, "save ok");
                        assert.equal(oFixture.adapterCalled, that.oSpyAdapterGet.called, "adapter called");
                        assert.equal(false, that.oSpyAdapterDelete.called, "Del not called ");
                        assert.equal(oFixture.adapterCalled, that.oSpyAdapterSave.called, "Save called");
                        done();
                        // obtain the (existing) Container (again)
                        oPromiseGetter1 = oService.getContainer(sContainer, { validity: oFixture.validity });
                        oPromiseGetter1.done(function (oContainer) {
                            var oPromiseDel = {},
                                oReadValue;
                            assert.ok(true, "Personalization data was gotten");
                            assert.equal(oFixture.adapterCalled, oFixture.adapterCalled && that.oSpyAdapterGet.callCount === 2, "adapter called (0 or two)");
                            assert.equal(false, that.oSpyAdapterDelete.called, "Del not called ");
                            oReadValue = oContainer.getItemValue(sItemKey);
                            assert.deepEqual(oReadValue, { v1: "false" }, "Read value is the saved value");
                            assert.equal(oFixture.effectiveValidity, oContainer._getValidity(), "validity");
                            oReadValue.v3 = false;
                            assert.deepEqual(oContainer.getItemValue(sItemKey), { v1: "false" }, "Read value is not a live read value");
                            assert.ok(oReadValue !== that.oItemValue, "not same object");
                            done();
                            oPromiseDel = oService.delContainer(sContainer, { validity: oFixture.validity });
                            oPromiseDel.done(function () {
                                var oPromiseGetter2 = {};
                                assert.equal(oFixture.adapterCalled, that.oSpyAdapterGet.callCount === 3, "adapter called");
                                assert.equal(oFixture.adapterCalled, that.oSpyAdapterDelete.called, "Del called");
                                assert.equal(oFixture.effectiveValidity, oContainer._getValidity(), "2nd validity of stale container");
                                oPromiseGetter2 = oService.getContainer(sContainer, { validity: oFixture.validity });
                                done();
                                oPromiseGetter2.done(function (oContainer) {
                                    //start();
                                    oReadValue = oContainer.getItemValue(sItemKey);
                                    assert.ok(true, "Personalization data deletion successful");
                                    assert.equal(oFixture.effectiveValidity, oContainer._getValidity(), "validity ok");
                                    // new get!
                                    assert.equal(oFixture.adapterCalled, that.oSpyAdapterGet.callCount === 4, "adapter called");
                                    done();
                                });

                                // -- failed operations
                                oPromiseGetter2.fail(function () {
                                    assert.ok(false, "'Error' fail function of getter2 was triggered");
                                    done();
                                });
                            });
                            oPromiseDel.fail(function () {
                                assert.ok(false, "'Error' fail function of deleter was triggered");
                                done();
                            });
                        });
                        oPromiseGetter1.fail(function () {
                            assert.ok(false, "'Error' fail function of getter1 was triggered");
                            done();
                        });
                    })
                    .fail(function () {
                        assert.ok(false, "'Error' fail function of saver was triggered");
                        done();
                    });
            });
            oPromiseCreator.fail(function () {
                assert.ok(false, "'Error' fail function of setter was triggered");
                done();
            });
        });
    });

    //  ............................................................................
    //
    //             Variant Version 1
    //
    //  ............................................................................

    QUnit.module("Personalization: Variant V1", {
        beforeEach: function () {
            this.oService = {};
            this.oAdapter = {};
            this.oContainer = {};
            this.oContainerVariantAdapter = {};
            var oSystem = {};

            this.PersonalizationAdapterMock = oPersonalizationTestUtils
                .createPersonalizationAdapterMock(AdapterContainerMock);

            this.oAdapter = new this.PersonalizationAdapterMock(oSystem);
            this.oService = new Personalization(this.oAdapter);
            this.oService.getContainer(sContainer)
                .done(function (oContainer) {
                    //start();
                    this.oContainer = oContainer;
                    this.oContainerVariantAdapter = new Personalization.VariantSetAdapter(this.oContainer);
                    this.oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVariantSetKey);
                    this.oVariant = this.oVariantSet.addVariant(sVariantName);
                    this.oVariant.setItemValue("Item1", "Item 1");
                    this.oVariant.setItemValue("Item2", "Item 2");
                }.bind(this));
        },
        afterEach: function () {
            this.oService.delContainer(sContainer);
            delete this.oAdapter;
            delete this.oContainer;
            delete this.oContainerVariantAdapter;
            delete this.oService;
            delete this.oVariantSet;
            delete this.oVariant;
        }
    });

    QUnit.test("Variant: create variant and check variant key, name and data", function (assert) {
        const oVariant = this.oVariantSet.addVariant("Variant2");
        oVariant.setItemValue("ItemV2", "Item V2");
        oVariant.setItemValue("ItemV21", "Item V21");
        // check variant key
        assert.equal("1", oVariant.getVariantKey(),
            "Variant key is correctly stored");
        // check variant name
        assert.equal("Variant2", oVariant.getVariantName(),
            "Variant name is correctly stored");
        // check variant data
        assert.equal("Item V2", oVariant.getItemValue("ItemV2"),
            "ItemV2 value is correctly stored");
        assert.equal("Item V21", oVariant.getItemValue("ItemV21"),
            "ItemV21 value is correctly stored");
    });

    QUnit.test("Variant: create variant add, change and delete item", function (assert) {
        var aItemKeys = [];
        // add
        this.oVariant.setItemValue("Item3", "Item 3");
        assert.equal("Item 3", this.oVariant.getItemValue("Item3"),
            "Item3 value is correctly stored");
        assert.equal(true, this.oVariant.containsItem("Item3"), "containsItem works correctly");
        // change
        this.oVariant.setItemValue("Item1", "Item 42");
        assert.equal("Item 42", this.oVariant.getItemValue("Item1"),
            "Item1 value is changed correctly");
        // get keys
        aItemKeys = this.oVariant.getItemKeys();
        assert.deepEqual(["Item1", "Item2", "Item3"], aItemKeys,
            "The correct array of item keys is returned by getItemKeys");
        // deletem
        this.oVariant.delItem("Item2");
        assert.equal(false, this.oVariant.containsItem("Item2"),
            "delItem works correctly");
        assert.equal(undefined, this.oVariant.getItemValue("Item2"),
            "getItemValue for a non-existant item returns undefined");
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("Variant: create a variant with a non-string key", function (assert) {
        var sVariantKey = "",
            sVariantName = "";

        sVariantKey = ["0"];
        sVariantName = "VariantName";
        try {
            new Variant(this.oVariantSet, sVariantKey, sVariantName);
            assert.ok(false, "Error: Non-string key was not detected.");
        } catch (e) {
            assert.ok(true, "Non-string key was was detected.");
        }
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("Variant: create a variant with a non-string name", function (assert) {
        var sVariantKey = "",
            sVariantName = "";

        sVariantKey = "0";
        sVariantName = ["ArrayVariantName"];
        try {
            new Variant(this.oVariantSet, sVariantKey, sVariantName);
            assert.ok(false, "Error: Non-string name was not detected.");
        } catch (e) {
            assert.ok(true, "Non-string name was was detected.");
        }
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("Variant: create a variant with an exotic name", function (assert) {
        var sVariantKey = "",
            sVariantName = "";

        sVariantKey = "0";
        sVariantName = "未经";
        new Variant(this.oVariantSet, sVariantKey, sVariantName);
        assert.ok(true, "Variant name '" + sVariantName + "' was handled with no error during variant creation.");
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("Variant: delete a non-existent item", function (assert) {
        this.oVariant.delItem("NonExistentItemKey...");

        assert.ok(true, "Non-existent item was deleted without error.");
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("Variant: getItemValue for non-existent item", function (assert) {
        const oItemValue = this.oVariant.getItemValue("NonExistentItemKey...");
        assert.equal(undefined, oItemValue,
            "Correct value undefined was returned.");
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("Variant: serialization", function (assert) {
        // Arrange
        const oVariant = this.oVariantSet.addVariant("Variant 2");
        oVariant.setItemValue("item1", this.oItemValue);
        oVariant.setItemValue("item2", this.oItemValue);
        const oExpectedSerialization = {
            name: "Variant 2",
            variantData: {
                item1: this.oItemValue,
                item2: this.oItemValue
            }
        };

        // Act
        var oSerializationResult = this.oVariantSet._oVariantSetData.variants[1];
        assert.deepEqual(oSerializationResult, oExpectedSerialization,
            "Serialization of variant works correctly");
    });

    // ........... Variant Set Tests ...........

    QUnit.test("Variant Set: add and delete variant", function (assert) {
        var sVARIANT_SET_KEY = "VARIANT_SET_KEY_988",
            sVariantKey1 = "",
            sVariantKey2 = "",
            oVariantSet = {},
            oVariant1 = {},
            oVariant2 = {};

        assert.equal(false, this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
        oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVARIANT_SET_KEY);
        assert.equal(true, this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' was added");
        oVariant1 = oVariantSet.addVariant("Variant number one added");
        sVariantKey1 = oVariant1.getVariantKey();
        assert.equal(true, oVariantSet.containsVariant(sVariantKey1),
            "Variant '" + sVariantKey1 + "' was added");
        // add variant 1
        oVariant2 = oVariantSet.addVariant("Variant number two");
        sVariantKey2 = oVariant2.getVariantKey();
        assert.equal(true, oVariantSet.containsVariant(sVariantKey2),
            "Variant '" + sVariantKey2 + "' was added");
        // delete variant 0
        oVariantSet.delVariant(sVariantKey1);
        assert.equal(false, oVariantSet.containsVariant(sVariantKey1),
            "Variant '" + sVariantKey1 + "' was deleted");
        // delete variant 1
        oVariantSet.delVariant(sVariantKey2);
        assert.equal(false, oVariantSet.containsVariant(sVariantKey2),
            "Variant '" + sVariantKey2 + "' was deleted");
        // delete variant set
        this.oContainerVariantAdapter.delVariantSet(sVARIANT_SET_KEY);
        assert.equal(false, this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' was deleted");
    });

    QUnit.test("Variant Set: add existing variant set", function (assert) {
        var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1025",
            sVARIANT_NAME = "VARIANT_1026",
            oVariantSet = {};

        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
        oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVARIANT_SET_KEY);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' was created");
        assert.ok(!oVariantSet.getVariantKeyByName(sVARIANT_NAME),
            "Variant with name '" + sVARIANT_NAME + "' does not exist");
        oVariantSet.addVariant(sVARIANT_NAME); // add it once
        try {
            oVariantSet.addVariant(sVARIANT_NAME); // add it twice
            assert.ok(false,
                "Error: adding the same named variant twice was not detected");
        } catch (e) {
            assert.ok(true,
                "Exception for adding the same variant twice is correct");
        }
    });

    QUnit.test("Variant Set: set current variant and check", function (assert) {
        this.aVariantExp = [];
        this.oVariantNameAndKeysExp = {};
        var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1027",
            oVariantSet = {},
            oVariant = {},
            sVariantKeyExp;

        if (this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY)) {
            this.oContainerVariantAdapter.delVariantSet(sVARIANT_SET_KEY);
        }

        oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVARIANT_SET_KEY);
        oVariant = oVariantSet.addVariant("V1");
        oVariant.setItemValue("item", this.oItemValue);
        sVariantKeyExp = oVariant.getVariantKey();
        oVariantSet.setCurrentVariantKey(sVariantKeyExp);

        assert.deepEqual(oVariantSet.getCurrentVariantKey(), sVariantKeyExp,
            "currentVariantKey was set correctly");
    });

    QUnit.test("Variant Set: delete non-existent variant", function (assert) {
        var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1050",
            sVARIANT_KEY = "1051",
            oVariantSet = {};

        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
        oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVARIANT_SET_KEY);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' was created");
        assert.ok(!oVariantSet.containsVariant(sVARIANT_KEY),
            "Variant '" + sVARIANT_KEY + "' does not exist");
        try {
            oVariantSet.delVariant(sVARIANT_KEY);
            assert.ok(true,
                "Non-existing variant was deleted without error/exception");
        } catch (e) {
            assert.ok(false,
                "Error: Exception during deletion of a non-existing variant");
        }
    });

    QUnit.test("Variant Set: get non-existent variant", function (assert) {
        var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1070",
            sVARIANT_KEY = "1071",
            oVariantSet = {},
            oVariant = {};

        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
        oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVARIANT_SET_KEY);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' was created");
        assert.ok(!oVariantSet.containsVariant(sVARIANT_KEY),
            "Variant '" + sVARIANT_KEY + "' does not exist");
        try {
            oVariant = oVariantSet.getVariant(sVARIANT_KEY);
            assert.ok(oVariant === undefined,
                "getVariant returns undefined for a non-existing variant");
        } catch (e) {
            assert.ok(false,
                "Error: Exception during getVariant for a non-existing variant");
        }
    });

    QUnit.test("Variant Set: add variant with an exotic name", function (assert) {
        var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1091",
            sVARIANT_NAME = "未经",
            oVariantSet = {},
            oVariant = {};

        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
        oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVARIANT_SET_KEY);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' was created");
        assert.ok(!oVariantSet.getVariantKeyByName(sVARIANT_NAME),
            "Variant with name '" + sVARIANT_NAME + "' does not exist");
        try {
            oVariant = oVariantSet.addVariant(sVARIANT_NAME);
            assert.ok(oVariant instanceof Variant,
                "addVariant returns a variant object");
        } catch (e) {
            assert.ok(false,
                "Error: Exception during addVariant");
        }
    });

    QUnit.test("Variant Set: add variant to a big max key variant set", function (assert) {
        var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1112",
            sVARIANT_NAME1 = "VARIANT_1113",
            sVARIANT_KEY1 = "999999",
            sVARIANT_NAME2 = "VARIANT_1115",
            oVariantSet = {},
            oVariant2 = {};

        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
        oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVARIANT_SET_KEY);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' was created");
        assert.ok(!oVariantSet.containsVariant(sVARIANT_KEY1),
            "Variant with key '" + sVARIANT_KEY1 + "' does not exist");
        // add variant manually
        const oVariant = oVariantSet.addVariant(sVARIANT_NAME1);
        oVariant.setItemValue(sVARIANT_KEY1, sVARIANT_NAME1);
        assert.ok(oVariantSet.getVariant("0").containsItem(sVARIANT_KEY1),
            "Variant with key '" + sVARIANT_KEY1 + "' and name '" + sVARIANT_NAME1 + "' was added");
        oVariant2 = oVariantSet.addVariant(sVARIANT_NAME2);
        assert.ok(parseInt(oVariant2.getVariantKey(), 10) === parseInt(oVariant.getVariantKey(), 10) + 1,
            "variant key was increased correctly");
    });

    QUnit.test("Variant Set: getVariantKeyByName standard", function (assert) {
        var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1138",
            sVARIANT_NAME = "VARIANT_1139",
            oVariantSet = {},
            oVariant = {};

        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
        oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVARIANT_SET_KEY);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' was created");
        oVariant = oVariantSet.addVariant(sVARIANT_NAME);
        assert.equal(oVariantSet.getVariantKeyByName(sVARIANT_NAME), oVariant.getVariantKey(),
            "getVariantKey returns the correct key");
    });

    QUnit.test("Variant Set: getVariantKeyByName with non-existing name", function (assert) {
        var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1154",
            sVARIANT_NAME = "VARIANT_1155",
            oVariantSet = {};

        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
        oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVARIANT_SET_KEY);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' was created");
        assert.equal(oVariantSet.getVariantKeyByName(sVARIANT_NAME), undefined,
            "getVariantKey returns undefined for a non-existing name");
    });

    QUnit.test("Variant Set: getVariantKeyByName with non-string name", function (assert) {
        var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1168",
            oVariantSet = {};

        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
        oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVARIANT_SET_KEY);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' was created");
        assert.equal(oVariantSet.getVariantKeyByName(oVariantSet), undefined,
            "getVariantKey returns undefined for a non-string name");
    });

    QUnit.test("Variant Set: getVariantNamesAndKeys", function (assert) {
        var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1196",
            sVARIANT_NAME1 = "VARIANT_1",
            sVARIANT_NAME2 = "VARIANT_2",
            sVARIANT_NAME3 = "VARIANT_3",
            sVariantKey1 = "",
            sVariantKey2 = "",
            sVariantKey3 = "",
            oVariantSet = {},
            aVariantNamesAndKeys = [];

        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
        oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVARIANT_SET_KEY);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' was created");
        sVariantKey1 = oVariantSet.addVariant(sVARIANT_NAME1).getVariantKey();
        sVariantKey2 = oVariantSet.addVariant(sVARIANT_NAME2).getVariantKey();
        sVariantKey3 = oVariantSet.addVariant(sVARIANT_NAME3).getVariantKey();
        aVariantNamesAndKeys = oVariantSet.getVariantNamesAndKeys();
        assert.equal(aVariantNamesAndKeys[sVARIANT_NAME1], sVariantKey1, "result for variant 1 is correct");
        assert.equal(aVariantNamesAndKeys[sVARIANT_NAME2], sVariantKey2, "result for variant 2 is correct");
        assert.equal(aVariantNamesAndKeys[sVARIANT_NAME3], sVariantKey3, "result for variant 3 is correct");
    });

    QUnit.test("Variant Set: save and simulate browser reload 1", function (assert) {
        this.aVariantExp = [];
        this.oVariantNameAndKeysExp = {};
        var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1052",
            oVariantSet = {},
            oVariant1 = {},
            oVariant2 = {};
        var done = assert.async();

        // add variant set
        if (this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY)) {
            this.oContainerVariantAdapter.delVariantSet(sVARIANT_SET_KEY);
        }
        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
            "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
        oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVARIANT_SET_KEY);


        oVariant1 = oVariantSet.addVariant("V1");
        oVariant1.setItemValue("I1", {
            Val1: "value 1",
            Val2: "value 2"
        });
        oVariant1.setItemValue("I2", {
            Filter1: "24",
            Filter2: "1000"
        });
        this.aVariantExp.push(oVariant1);
        this.oVariantNameAndKeysExp.V1 = oVariant1.getVariantKey();
        // add variant V2
        oVariant2 = oVariantSet.addVariant("V2");
        oVariant2.setItemValue("I1", {
            Val1: "value 11",
            Val2: "value 12"
        });
        oVariant2.setItemValue("I2", {
            Filter1: "48",
            Filter2: "50000"
        });
        this.aVariantExp.push(oVariant2);
        this.oVariantNameAndKeysExp.V2 = oVariant2.getVariantKey();
        // save
        this.oContainer.save().fail(function () {
            assert.ok(false, "Save failed");
        });
        // simulate browser reload
        delete this.oContainer;
        this.oService._oContainerMap.remove(sContainerPrefix + sContainer);
        this.oService.getContainer(sContainer)
            .done(function (oContainer) {
                var aVariantKeys = [],
                    aVariants = [],
                    oVariantNameAndKeys = {};
                assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
                    "Variant set '" + sVARIANT_SET_KEY + "' exists after save");
                this.oVariantSet = this.oContainerVariantAdapter.getVariantSet(sVARIANT_SET_KEY);

                oVariantNameAndKeys = this.oVariantSet.getVariantNamesAndKeys();
                assert.deepEqual(oVariantNameAndKeys, this.oVariantNameAndKeysExp,
                    "Variant names and keys are correct");
                assert.deepEqual(this.oVariantSet.getVariantKeyByName("V1"), this.oVariantNameAndKeysExp.V1);
                assert.deepEqual(this.oVariantSet.getVariantKeyByName("V2"), this.oVariantNameAndKeysExp.V2);
                aVariantKeys = this.oVariantSet.getVariantKeys();

                aVariantKeys.forEach(function (sVariantKey) {
                    aVariants[sVariantKey] = this.oVariantSet.getVariant(sVariantKey);
                }.bind(this));
                assert.deepEqual(aVariants, this.aVariantExp, "Entire variant is correct");
                this.oContainerVariantAdapter.delVariantSet(sVARIANT_SET_KEY);
                assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
                    "Variant set '" + sVARIANT_SET_KEY + "' was deleted");
                done();
            }.bind(this));
    });

    QUnit.test("Variant Set: save and simulate browser reload 2", function (assert) {
        var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1137",
            oVariantSet = {},
            oVariant = {};
        var done = assert.async();

        // add variant set
        if (this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY)) {
            this.oContainerVariantAdapter.delVariantSet(sVARIANT_SET_KEY);
        }

        oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVARIANT_SET_KEY);
        // add variant V1
        oVariant = oVariantSet.addVariant("V1");
        oVariant.setItemValue("I1", {
            Val1: "value 1",
            Val2: "value 2"
        });
        oVariant.setItemValue("I2", {
            Filter1: "24",
            Filter2: "1000"
        });
        // add variant V2
        oVariant = oVariantSet.addVariant("V2");
        oVariant.setItemValue("I1", {
            Val1: "value 11",
            Val2: "value 12"
        });
        oVariant.setItemValue("I2", {
            Filter1: "48",
            Filter2: "50000"
        });

        // save container
        this.oContainer.save().fail(function () {
            assert.ok(false, "Save failed");
        });
        // tabula rasa
        delete this.oContainer;
        this.oService._oContainerMap.remove(sContainer);
        // new container
        this.oService.getContainer(sContainer)
            .done(function (oContainer) {
                var aVariantKeys = [],
                    aVariants = [],
                    oVariant = {},
                    sVariantKey = "";

                this.oContainer = oContainer;
                oVariantSet = this.oContainerVariantAdapter.getVariantSet(sVARIANT_SET_KEY);
                oVariant = oVariantSet.addVariant("V3");
                oVariant.setItemValue("I1", {
                    Val1: "value 111",
                    Val2: "value 123"
                });
                oVariant.setItemValue("I2", {
                    Filter1: "489",
                    Filter2: "90000"
                });
                sVariantKey = oVariantSet.getVariantKeyByName("V2");
                oVariantSet.delVariant(sVariantKey);
                sVariantKey = oVariantSet.getVariantKeyByName("V1");
                oVariantSet.delVariant(sVariantKey);
                oVariant = oVariantSet.addVariant("V1");
                oVariant.setItemValue("I3", {
                    Val1: "value 01",
                    Val2: "value 02"
                });
                oVariant.setItemValue("I4", {
                    Filter1: "240",
                    Filter2: "10009"
                });
                this.oContainer.save();
                aVariantKeys = oVariantSet.getVariantKeys();
                aVariantKeys.forEach(function (sVariantKey) {
                    aVariants.push(oVariantSet.getVariant(sVariantKey));
                });
                assert.equal(2, aVariants.length, "Variant Set contains two items");
                assert.equal("V3", aVariants[0].getVariantName(), "First variant in set is V3");
                assert.deepEqual(aVariants[0].getItemValue("I1"), {
                    Val1: "value 111",
                    Val2: "value 123"
                }, "Item value I1 from V3 still exist");
                assert.deepEqual(aVariants[0].getItemValue("I2"), {
                    Filter1: "489",
                    Filter2: "90000"
                }, "Item value I2 from V3 still exist");
                assert.equal("V1", aVariants[1].getVariantName(), "Second variant in set is V1");
                assert.deepEqual(aVariants[1].getItemValue("I3"), {
                    Val1: "value 01",
                    Val2: "value 02"
                }, "Item value I3 from V1 still exist");
                assert.deepEqual(aVariants[1].getItemValue("I4"), {
                    Filter1: "240",
                    Filter2: "10009"
                }, "Item value I4 from V1  still exist");
                // delete variant set
                this.oContainerVariantAdapter.delVariantSet(sVARIANT_SET_KEY);
                done();
            }.bind(this));
    });

    //  ............................................................................
    //
    //               Container Version 1
    //
    //  ............................................................................

    QUnit.module("Personalization: Container V1", {
        beforeEach: function () {
            oPersonalizationTestUtils.mockGetService();

            this.PersonalizationAdapterMock = oPersonalizationTestUtils
                .createPersonalizationAdapterMock(AdapterContainerMock);

            this.oAdapter = new this.PersonalizationAdapterMock();
            this.oService = new Personalization(this.oAdapter);

            return this.oService.getContainer(sContainer).done(function (oContainer) {
                this.oContainer = oContainer;
                this.oContainerVariantAdapter = new Personalization.VariantSetAdapter(this.oContainer);
            }.bind(this));
        },
        afterEach: function () {
            this.oService.delContainer(sContainer);

            oPersonalizationTestUtils.restoreGetService();
            delete this.oContainer;
            delete this.oContainerVariantAdapter;
            delete this.oService;
            delete this.oAdapter;
        }
    });

    // ........... Container Item Tests ...........

    QUnit.test("Items: set, get and delete item", function (assert) {
        var sITEM_KEY = "ITEM_501",
            oItemValueRead = {};

        assert.equal(false, this.oContainer.containsItem(sITEM_KEY),
            "ITEM_0815 is not exisiting");
        this.oContainer.setItemValue(sITEM_KEY, this.oItemValue);
        assert.equal(true, this.oContainer.containsItem(sITEM_KEY),
            "ITEM_0815 exisits after setItemValue");
        oItemValueRead = this.oContainer.getItemValue(sITEM_KEY);
        assert.deepEqual(this.oItemValue, oItemValueRead,
            "getItemValue returns the correct value for ITEM_0815");
        assert.equal(true, this.oContainer.containsItem(sITEM_KEY),
            "containsItem returned true correctly for ITEM_0815");
        this.oContainer.delItem(sITEM_KEY);
        assert.equal(null, this.oContainer.getItemValue(sITEM_KEY),
            "Item was deleted, getItemValue returned null");
        assert.equal(false, this.oContainer.containsItem(sITEM_KEY),
            "containsItem returned false correctly");
    });

    QUnit.test("Items: set, get and delete item, check difficult keynames", function (assert) {
        var sITEM_KEY = "hasOwnProperty",
            oItemValueRead = {};

        this.oContainer.delItem(sITEM_KEY);
        assert.equal(false, this.oContainer.containsItem(sITEM_KEY),
            "hasOwnProperty is not exisiting");
        this.oContainer.setItemValue(sITEM_KEY, this.oItemValue);
        assert.equal(true, this.oContainer.containsItem(sITEM_KEY),
            "hasOwnProperty exisits after setItemValue");
        oItemValueRead = this.oContainer.getItemValue(sITEM_KEY);
        assert.deepEqual(this.oItemValue, oItemValueRead,
            "getItemValue returns the correct value for hasOwnProperty");
        assert.equal(true, this.oContainer.containsItem(sITEM_KEY),
            "containsItem returned true correctly for hasOwnProperty");
        this.oContainer.delItem(sITEM_KEY);
        assert.equal(null, this.oContainer.getItemValue(sITEM_KEY),
            "Item was deleted, getItemValue returned null");
        assert.equal(false, this.oContainer.containsItem(sITEM_KEY),
            "containsItem returned false correctly");
    });

    QUnit.test("Items: add items with and with no prefix, read them", function (assert) {
        let aActItemKeys = [];
        const done = assert.async();
        const oItemValue = {
            part1: "Part 1",
            part2: "Part 2"
        };
        // check if the container is empty
        assert.equal(this.oContainer.getItemKeys().length, 0, "Container is empty");
        // add item1 with no item prefix
        // dirty hack
        this.oContainer._setItemValueInternal("item1", "prefix0", oItemValue);
        // add item2 with item prefix
        this.oContainer.setItemValue("item2", oItemValue);
        // add item 3 with item prefix
        this.oContainer.setItemValue("item3", oItemValue);
        aActItemKeys = this.oContainer.getItemKeys();
        assert.equal(aActItemKeys.length, 2, "Container has 2 items: '" + aActItemKeys + "'");
        assert.ok(true, "Internal item keys are: " + this.oContainer._oItemMap.keys() + "'");
        assert.equal(false, this.oContainer.containsItem("item1"), "'item1' is not detected by containsItem due to automatic prefixing!");
        this.oContainer.save()
            .fail(() => {
                assert.ok(false, "Error during container save");
                done();
            })
            .done(() => {
                assert.ok(true, "Successful container save");
                this.oContainer.load()
                    .fail(() => {
                        assert.ok(false, "Error during container reload");
                        done();
                    })
                    .done(() => {
                        assert.ok(true, "Successful container reload");
                        // check if prefix was added to item1
                        assert.equal(false, this.oContainer.containsItem("item1"), "Container contains 'item1'");
                        this.oContainer.delItem("item1");
                        this.oContainer.delItem("item2");
                        this.oContainer.delItem("item3");
                        assert.equal(this.oContainer.getItemKeys().length, 0, "All items are deleted");
                        done();
                    });
            });
    });

    QUnit.test("Items: Delete non-existent item", function (assert) {
        var sITEM_KEY = "nonExistingItem";

        assert.ok(!this.oContainer.containsItem(sITEM_KEY), "Item is not existing");
        try {
            this.oContainer.delItem(sITEM_KEY);
            assert.ok(true, "Non-existent item was deleted without error");
        } catch (e) {
            assert.ok(false, "Error during deletion of non-existing item");
        }
    });

    QUnit.test("Items: Get value of non-existent item", function (assert) {
        var sITEM_KEY = "nonExistingItem",
            oItemValue = {};

        assert.ok(!this.oContainer.containsItem(sITEM_KEY), "Item is not existing");
        try {
            oItemValue = this.oContainer.getItemValue(sITEM_KEY);
            assert.ok(oItemValue === undefined, "Value of a non-existing item is undefined");
        } catch (e) {
            assert.ok(false, "Error during getItemvalue of non-existing item");
        }
    });

    // ........... Variant Sets .............

    QUnit.test("Variant Set: add and delete variant sets", function (assert) {
        let aActVariantSetKeys = [];
        const aExpVariantSetKeys = ["variantSet1", "variantSet2"];

        aExpVariantSetKeys.forEach((sVariantSetKey) => {
            this.oContainerVariantAdapter.addVariantSet(sVariantSetKey);
        });
        // check variant sets
        aActVariantSetKeys = this.oContainerVariantAdapter.getVariantSetKeys();
        aExpVariantSetKeys.forEach((sVariantSetKey, index) => {
            assert.deepEqual(aActVariantSetKeys[index], sVariantSetKey,
                "'" + sVariantSetKey + "' exists");
        });
        // delete
        aExpVariantSetKeys.forEach((sVariantSetKey) => {
            this.oContainerVariantAdapter.delVariantSet(sVariantSetKey);
        });
        // check deletion
        aExpVariantSetKeys.forEach((sVariantSetKey) => {
            assert.equal(false, this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey),
                "Container does not have variantSet '" + sVariantSetKey + "'");
        });
    });

    QUnit.test("Variant Set: Delete non-existent variant set", function (assert) {
        var sVARIANT_SET_KEY = "nonExistingVariantset";

        assert.ok(!this.oContainer.containsItem(sVARIANT_SET_KEY), "Variant set is not existing");
        try {
            this.oContainerVariantAdapter.delVariantSet(sVARIANT_SET_KEY);
            assert.ok(true, "Non-existent variant set was deleted without error");
        } catch (e) {
            assert.ok(false, "Error during deletion of non-existing variant set");
        }
    });

    QUnit.test("Variant Set: Get non-existent variant set", function (assert) {
        var sVARIANT_SET_KEY = "nonExistingVariantset",
            oVariantSet = {};

        assert.ok(!this.oContainer.containsItem(sVARIANT_SET_KEY), "Variant set is not existing");
        try {
            oVariantSet = this.oContainerVariantAdapter.getVariantSet(sVARIANT_SET_KEY);
            assert.ok(oVariantSet === undefined, "Non-existent variant set object is undefined");
        } catch (e) {
            assert.ok(false, "Error during getVariantSet for a non-existing variant set");
        }
    });

    QUnit.test("Variant Set: Add variant set that exists", function (assert) {
        var sVariantSetKey = "";

        sVariantSetKey = "variantSetKey_682";
        this.oContainerVariantAdapter.addVariantSet(sVariantSetKey);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was added");
        try {
            this.oContainerVariantAdapter.addVariantSet(sVariantSetKey);
            assert.ok(false, "Existence of variant set was not detected");
        } catch (e) {
            assert.ok(true, "Existence of variant set was detected");
        }
    });

    // ........... Container Tests ...........

    QUnit.test("Container: add items and variant sets, read them separately", function (assert) {
        var oItemValue = {
            part1: "Part 1",
            part2: "Part 2"
        };
        var aExpItemKeys = ["item1", "item2", "item3"];
        var aExpVariantSetKeys = ["variantSet1", "variantSet2"];

        // add items
        aExpItemKeys.forEach(function (sItemKey) {
            this.oContainer.setItemValue(sItemKey, oItemValue);
        }.bind(this));

        // add variant sets
        aExpVariantSetKeys.forEach(function (sVariantSetKey) {
            this.oContainerVariantAdapter.addVariantSet(sVariantSetKey, oItemValue);
        }.bind(this));

        // check items
        var aActItemKeys = this.oContainer.getItemKeys();
        aExpItemKeys.forEach(function (sItemKey) {
            if (!aActItemKeys.includes(sItemKey)) {
                assert.ok(false, "Container does not contain item '" + sItemKey + "'");
            }
        });
        assert.ok(true, "Item keys are correct: " + aActItemKeys);

        // check variant sets
        var aActVariantSetKeys = this.oContainerVariantAdapter.getVariantSetKeys();
        aExpVariantSetKeys.forEach(function (sVariantSetKey) {
            if (!aActVariantSetKeys.includes(sVariantSetKey)) {
                assert.ok(false, "Container does not contain variant set '" + sVariantSetKey + "'");
            }
        });
        assert.ok(true, "Variant set keys are correct: " + aActVariantSetKeys);
    });

    QUnit.test("Container: add and delete variantSets/Items", function (assert) {
        var sVARIANT_SET_KEY = "VARIANT_SET_KEY_738",
            oVariantSet = {},
            oVariant = {},
            that = this;
        var done = assert.async();

        this.oContainer.setItemValue("itemKey1", "item1");
        this.oContainer.setItemValue("itemKey2", "item2");

        // add variant set
        if (this.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY)) {
            this.oContainerVariantAdapter.delVariantSet(sVARIANT_SET_KEY);
        }
        oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVARIANT_SET_KEY);
        // add variant V1
        oVariant = oVariantSet.addVariant("V1");
        oVariant.setItemValue("I1", {
            Val1: "value 1",
            Val2: "value 2"
        });
        oVariant.setItemValue("I2", {
            Filter1: "24",
            Filter2: "1000"
        });
        // add variant V2
        oVariant = oVariantSet.addVariant("V2");
        oVariant.setItemValue("I1", {
            Val1: "value 11",
            Val2: "value 12"
        });
        oVariant.setItemValue("I2", {
            Filter1: "48",
            Filter2: "50000"
        });
        // save container
        this.oContainer.save().fail(function () {
            assert.ok(false, "Save failed");
        });
        done();
        this.oContainer.delItem("itemKey2");
        this.oContainerVariantAdapter.delVariantSet(sVARIANT_SET_KEY);
        this.oContainer.setItemValue("itemKey3", "item3");
        this.oContainer.save()
            .done(function () {
                assert.ok(!that.oContainer.containsItem("itemKey2"), "itemKey2 was deleted");
                assert.ok(!that.oContainerVariantAdapter.containsVariantSet(sVARIANT_SET_KEY),
                    sVARIANT_SET_KEY + " was deleted");
                assert.ok(that.oContainer.containsItem("itemKey3"),
                    "itemKey3 was added");
            })
            .fail(function () {
                assert.ok(false, "Save failed");
            });
    });

    QUnit.test("Container: Get container with non-string key", function (assert) {
        var done = assert.async();
        try {
            this.oService.getContainer(this.oService)
                .done(function () {
                    assert.ok(false, "Error: Container with a non-string key was not prohibited");
                    done();
                })
                .fail(function () {
                    assert.ok(false, "Error: Container with a non-string key was not prohibited");
                    done();
                });
        } catch (e) {
            assert.ok(true, "Non-string sContainerKey led to an exception");
            done();
        }
    });

    QUnit.test("Container: Container constructor with empty key", function (assert) {
        try {
            new PersonalizationContainer({}, ""); // oAdapter, sContainerKey
            assert.ok(false, "Error: Container with an empty key was not prohibited");
        } catch (e) {
            assert.ok(true, "Empty sContainerKey led to an exception");
        }
    });

    QUnit.test("Container: Container constructor with non-string key", function (assert) {
        try {
            new PersonalizationContainer({}, {}); // oAdapter, sContainerKey
            assert.ok(false, "Error: Container with a non-string key was not prohibited");
        } catch (e) {
            assert.ok(true, "Non-string sContainerKey led to an exception");
        }
    });

    QUnit.test("Container: reload restores original data", function (assert) {
        var done = assert.async(2);
        this.oService.getContainer(sContainer)
            .done(function (oContainer) {
                oContainer.setItemValue("key1", "item1");
                assert.equal(oContainer.getItemValue("key1"), "item1", "key1 added");
                done();
                oContainer.save()
                    .done(function () {
                        assert.ok(true, "Data saved");
                        assert.equal(oContainer.getItemValue("key1"), "item1", "key1 still there after save");
                        oContainer.setItemValue("key1", "item2");
                        assert.equal(oContainer.getItemValue("key1"), "item2", "key1 changed to item2 (no save)");
                        done();
                        done = assert.async();
                        oContainer.load()
                            .done(function () {
                                assert.equal(oContainer.getItemValue("key1"), "item1", "key1 loaded with correct value 'item1'");
                                done();
                            })
                            .fail(function () {
                                assert.ok(false, "Load failed");
                                done();
                            });
                    })
                    .fail(function () {
                        assert.ok(false, "Save failed");
                        done();
                    });
            });
    });

    QUnit.test("Container: Error during load inside constructor", function (assert) {
        var sCONTAINER_KEY = "constructorErrorContainer",
            that = this;
        var done = assert.async();

        this.oAdapter.setErrorProvocation(sCONTAINER_KEY);
        this.oService.getContainer(sCONTAINER_KEY)
            .done(function (/*oContainer*/) {
                assert.ok(false, "Error: Load of container should have failed");
                done();
            })
            .fail(function (/*oContainer*/) {
                assert.ok(true, "Load of container failed");
                that.oAdapter.resetErrorProvocation(sCONTAINER_KEY);
                that.oService._oContainerMap.remove(sContainerPrefix + sCONTAINER_KEY);
                done();
                done = assert.async();
                that.oService.delContainer(sCONTAINER_KEY)
                    .done(function () {
                        assert.ok(true, "Deletion of container succeeded");
                        done();
                    })
                    .fail(function () {
                        assert.ok(false, "Deletion of container failed");
                        done();
                    });
            });
    });

    QUnit.test("Container: Error during save", function (assert) {
        var sCONTAINER_KEY = "saveErrorContainer",
            that = this;
        var done = assert.async();

        this.oService.getContainer(sCONTAINER_KEY)
            .done(function (oContainer) {
                assert.ok(true, "Load of container succeeded");
                that.oAdapter.setErrorProvocation(sCONTAINER_KEY);
                done();
                done = assert.async();
                oContainer.save()
                    .done(function () {
                        assert.ok(false, "Error: Save of container succeeded");
                        done();
                    })
                    .fail(function () {
                        assert.ok(true, "Save of container failed");
                        done();
                    });
            })
            .fail(function (/*oContainer*/) {
                assert.ok(false, "Error: Load of container failed");
                done();
            });
    });

    QUnit.test("Container: Error during deletion", function (assert) {
        var sCONTAINER_KEY = "deletionErrorContainer",
            that = this;
        var done = assert.async();

        this.oService.getContainer(sCONTAINER_KEY)
            .done(function (/*oContainer*/) {
                assert.ok(true, "Load of container succeeded");
                that.oAdapter.setErrorProvocation(sCONTAINER_KEY);
                done();
                done = assert.async();
                that.oService.delContainer(sCONTAINER_KEY)
                    .done(function () {
                        assert.ok(false, "Error: Deletion of container succeeded");
                        done();
                    })
                    .fail(function () {
                        assert.ok(true, "Deletion of container failed");
                        done();
                    });
            })
            .fail(function (/*oContainer*/) {
                assert.ok(false, "Error: Load of container failed");
                done();
            });
    });

    QUnit.test("Container: Mix of container and personalizer", function (assert) {
        // Personalizer does reuse of the container
        var oITEM_KEY = "mixItem",
            oItemValue = {},
            oPersId = {},
            oPersonalizer = {},
            oContainer = {};
        var done = assert.async();

        oPersId = {
            container: sContainer,
            item: oITEM_KEY
        };
        oPersonalizer = this.oService.getPersonalizer(oPersId);
        oItemValue = {
            part1: "Part 1",
            part2: "Part 2"
        };
        oPersonalizer.setPersData(oItemValue)
            .done(function (oReadItemValue) {
                oPersonalizer._getContainer(oPersId.container)
                    .done(function (oCntnr) {
                        oContainer = oCntnr;
                        assert.ok(oContainer instanceof Personalization.ContextContainer, "Context container is used");
                        oReadItemValue = oContainer.getItemValue(oITEM_KEY);
                        assert.deepEqual(oReadItemValue, oItemValue, "Value read from container is the one written via personalizer");
                        done();
                    })
                    .fail(function () {
                        assert.ok(false, "Error: Personalizer._getContainer failed");
                        done();
                    });
            })
            .fail(function () {
                assert.ok(false, "Error: setPersData failed");
                done();
            });
    });

    //  ............................................................................
    //
    //             unit tests for the WindowAdapterContainer
    //
    //  ............................................................................

    QUnit.module("unit tests for the Personalization: WindowAdapterContainer", {
        beforeEach: function () {
            this.oItemValue = { v1: "false" };
            this.oTransientPersonalizer = new Personalization(null).getTransientPersonalizer();
        },
        afterEach: function () {
            delete this.oItemValue;
            delete this.oTransientPersonalizer;
        }
    });

    function clone (oObject) {
        if (oObject === undefined) {
            return undefined;
        }
        try {
            return JSON.parse(JSON.stringify(oObject));
        } catch (e) {
            return undefined;
        }
    }

    QUnit.test("load first scenario - found in window cache", function (assert) {
        // Personalizer does reuse of the container
        var oCut,
            oCPreparation,
            oMockContainer;
        var done = assert.async();

        oCPreparation = new Personalization.WindowAdapterContainer("ContainerKey", { validity: 10080 }, oMockContainer, Personalization.WindowAdapter);
        //First test scenario
        //Data is found in the window object and needs to be copied to the backend container
        oCPreparation.setItemValue("itemKey1", "itemValue1");
        oCPreparation.setItemValue("itemKey2", "itemValue2");
        oCPreparation.setItemValue("itemKey3", "itemValue3");

        //Create temporary window functionality
        Personalization.WindowAdapter.prototype.data = {};
        //Save oCPreparation in window object
        Personalization.WindowAdapter.prototype.data.ContainerKey = clone(oCPreparation._oItemMap.entries);

        //Backend Container
        oMockContainer = new AdapterContainerMock("ContainerKey");
        sandbox.spy(oMockContainer, "setItemValue");

        //Class under test
        oCut = new Personalization.WindowAdapterContainer("ContainerKey", { validity: 10080 }, oMockContainer, Personalization.WindowAdapter);
        assert.equal(oCut.getItemValue("itemKey1"), undefined, "itemKey1 is not in container yet");
        assert.equal(oMockContainer.getItemValue("itemKey1"), undefined, "itemKey1 is not in mockcontainer yet");

        //expected data is loaded from the window and copied to the mock adapter container
        oCut.load();
        assert.ok(oMockContainer.setItemValue.calledThrice, "Items were found in the window object and successfully copied to the backend adapter");
        assert.equal(oCut.getItemValue("itemKey1"), "itemValue1", "itemKey1 is in container");
        assert.equal(oMockContainer.getItemValue("itemKey1"), "itemValue1", "itemKey1 is in mockcontainer");
        done();
    });

    QUnit.test("load second scenario - not found in window cache", function (assert) {
        var oCut,
            oMockContainer;
        var done = assert.async();
        //Backend Container
        oMockContainer = new AdapterContainerMock("ContainerKey");

        //Create temporary window functionality
        Personalization.WindowAdapter.prototype.data = {};

        //WindowAdapterContainer
        oCut = new Personalization.WindowAdapterContainer("ContainerKey", undefined, oMockContainer, Personalization.WindowAdapter);

        //Second test scenario
        //Data is found in the backendContainer and not in the window object. Therefor, the data needs to be copied from the backendContainer to the window object
        oMockContainer.setItemValue("itemKey1", "itemValue1");
        oMockContainer.setItemValue("itemKey2", "itemValue2");
        oMockContainer.setItemValue("itemKey3", "itemValue3");

        sandbox.spy(oCut, "setItemValue");

        oCut.load();
        assert.ok(oCut.setItemValue.calledThrice, "Items were found in the backend container and successfully copied to the WindowAdapterContainer");
        assert.ok(Personalization.WindowAdapter.prototype.data.ContainerKey, "Window cache contains items at the end");
        assert.ok(Personalization.WindowAdapter.prototype.data.ContainerKey.hasOwnProperty("itemKey1"), "Window cache contains item for itemKey1");
        assert.ok(Personalization.WindowAdapter.prototype.data.ContainerKey.hasOwnProperty("itemKey2"), "Window cache contains item for itemKey2");
        assert.ok(Personalization.WindowAdapter.prototype.data.ContainerKey.hasOwnProperty("itemKey3"), "Window cache contains item for itemKey3");
        done();
    });

    QUnit.test("save", function (assert) {
        var oCut,
            oMockContainer;
        var done = assert.async();
        oMockContainer = new AdapterContainerMock("ContainerKey");
        oCut = new Personalization.WindowAdapterContainer("ContainerKey", undefined, oMockContainer, Personalization.WindowAdapter);
        sandbox.spy(oMockContainer, "save");
        oCut.save();
        assert.ok(oMockContainer.save.called, "save was called on the backend container");
        done();
    });

    QUnit.test("setItemValue", function (assert) {
        var oITEM_KEY = "mixItem",
            oCut,
            oMockContainer;
        oMockContainer = new AdapterContainerMock("ContainerKey");
        sandbox.spy(oMockContainer, "setItemValue");
        oCut = new Personalization.WindowAdapterContainer("ContainerKey", undefined, oMockContainer, Personalization.WindowAdapter);
        oCut.setItemValue(oITEM_KEY, "v1");
        assert.ok(oMockContainer.setItemValue.calledWith(oITEM_KEY, "v1"), " data set on mock too");
        assert.equal(oCut.getItemValue(oITEM_KEY), "v1", "value can be read again");
    });

    QUnit.test("delItem", function (assert) {
        var oITEM_KEY = "mixItem",
            oCut,
            oMockContainer;
        //prepare
        oMockContainer = new AdapterContainerMock("ContainerKey");
        sandbox.spy(oMockContainer, "delItem");
        oCut = new Personalization.WindowAdapterContainer("ContainerKey", undefined, oMockContainer, Personalization.WindowAdapter);
        oCut.setItemValue(oITEM_KEY, "v1");
        // method under test
        oCut.delItem(oITEM_KEY, "v1");
        // checks
        assert.ok(oMockContainer.delItem.calledWith(oITEM_KEY), " data deleted on mock too");
        assert.equal(oCut.getItemValue(oITEM_KEY), undefined, "value can be read again");
    });

    //  ............................................................................
    //
    //             unit tests for the Personalization.getContainer()
    //             -> Client API
    //
    //  ............................................................................

    QUnit.module("unit tests for the Personalization: getContainer()", {
        beforeEach: function () {
            this.oItemValue = { v1: "false" };
            this.oTransientPersonalizer = new Personalization(null).getTransientPersonalizer();
        },
        afterEach: function () {
            delete this.oItemValue;
            delete this.oTransientPersonalizer;
        }
    });

    QUnit.test("_adjustScope - correction of a wrong defined scope", function (assert) {
        var oConstants,
            oActualScope,
            oExpectedScope;

        //retrieve constants from namespace 'constants' of personalization service
        oConstants = Personalization.prototype.constants;
        //oActualScope should simulate wrong data
        oActualScope = {
            validity: "60", //wrong datatype-> has to be numeric
            keyCategory: oConstants.keyCategory.FIXED_KEY, //correct
            writeFrequency: oConstants.keyCategory.GENERATED_KEY, //wrong constant
            clientStorageAllowed: undefined //has to be filled with default value
        };
        oExpectedScope = {
            validity: Infinity,
            keyCategory: oConstants.keyCategory.FIXED_KEY,
            writeFrequency: oConstants.writeFrequency.HIGH,
            clientStorageAllowed: false
        };

        assert.deepEqual(Personalization.prototype._adjustScope(oActualScope), oExpectedScope, "Scope has been rectified correctly.");
    });

    //  ............................................................................

    QUnit.module("unit tests for the Personalization: Key Generation Function");

    QUnit.test("When a key is generated", function (assert) {
        var service = new Personalization(undefined),
            first = service.getGeneratedKey(),
            second = service.getGeneratedKey();
        assert.ok(typeof first === "string", "then the key is of type string");
        assert.equal(first.length, 40, "then the key has length 40");
        assert.ok(/^[A-Z0-9]{40}$/.test(first), "then the key consists only of capital letters or numbers");
        assert.ok(first !== second, "then the second key and the first one differ");
    });

    QUnit.test("Generated Keys are suitably random in every position 1 to 40", function (assert) {
        var service = new Personalization(undefined),
            sChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            iCharLen = sChars.length,
            iSampleSize = 10000;

        // An object like:
        // {
        //   "1": {     // in position 1 of a key...
        //     "A": 32, // ... 'A' was found 32 times.
        //     "X": 12
        //   },
        //   "2": {
        //     ...
        //   },
        //   ...
        // }
        var oCharInPositionHistogram = {};

        // An object containing randomly-generated keys like: {
        //   "AF4IOGJEEGOE23WGKJOWGK2JRW0OGJWOGWGORWGJ": "AF4IOGJEEGOE23WGKJOWGK2JRW0OGJWOGWGORWGJ",
        //   ...
        // }
        var oGeneratedRandomKeys = {};
        var iGeneratedRandomKeysCollisionCount = 0;

        for (var i = 0; i < iSampleSize; ++i) {
            var sRandomKey = service.getGeneratedKey();
            if (oGeneratedRandomKeys[sRandomKey]) {
                iGeneratedRandomKeysCollisionCount++;
            }
            oGeneratedRandomKeys[sRandomKey] = sRandomKey;

            for (var k = 0; k < iCharLen; ++k) {
                var sChar = sRandomKey.charAt(k);
                oCharInPositionHistogram[k] = oCharInPositionHistogram[k] || {};
                oCharInPositionHistogram[k][sChar] = (oCharInPositionHistogram[k][sChar] || 0) + 1;
            }
        }

        // Count unused characters
        var iUnusedCharCount = 0;

        for (var iPos = 0; iPos < iCharLen; ++iPos) {
            var aCharsAtPos = Object.keys(oCharInPositionHistogram[iPos]);
            var iExpectedMinimumCoverage = iCharLen - 3;

            assert.ok(aCharsAtPos.length <= iCharLen, "maximum " + iCharLen
                + " different characters were generated in a random key at position "
                + iPos + " on a sample of " + iSampleSize + " random keys"); // may fail very very rarely

            assert.ok(aCharsAtPos.length > iExpectedMinimumCoverage, "more than "
                + iExpectedMinimumCoverage + " characters were generated in a random key at position "
                + iPos + " on a sample of " + iSampleSize + " random keys"); // may fail very very rarely

            sChars.split("").forEach(function (sChar) {
                if (!oCharInPositionHistogram[iPos][sChar]) {
                    iUnusedCharCount++;
                }
            });
        }

        assert.equal(iGeneratedRandomKeysCollisionCount, 0,
            "there were 0 collisions over a sample of " + iSampleSize + " random keys");

        assert.strictEqual(iUnusedCharCount, 0,
            "there were no unused characters from '" + sChars + "' in a sample of " + iSampleSize + " random keys");
    });

    //  ............................................................................
    //
    //             Unmodifiable Container
    //
    //  ............................................................................

    QUnit.module("unit tests for the Personalization: Unmodifiable Container", {});

    QUnit.test("all expected functions exist on unmodifiable container", function (assert) {
        var oMockAdapter = {
            getAdapterContainer: function (/*sContainerKey*/) {
                return {};
            }
        },
            oContainer = new Personalization.ContextContainer(undefined, oMockAdapter, "sap.ushell.personalization#mock_pers", { validity: Infinity }),
            oUnmodifiableContainer = oContainer.getUnmodifiableContainer();

        [
            "containsItem", "getItemKeys", "getItemValue", "getUnmodifiableContainer",
            "clear", "delItem", "flush", "load", "save", "saveDeferred", "setItemValue"
        ].forEach(function (sFunctionName) {
            assert.ok(typeof oUnmodifiableContainer[sFunctionName] === "function",
                "function " + sFunctionName + " exists on container");
        });
    });
    QUnit.test("all allowed functions execute correctly", function (assert) {
        var oMockAdapter = {
            getAdapterContainer: function (/*sContainerKey*/) {
                return {};
            }
        },
            oContainer = new Personalization.ContextContainer(undefined, oMockAdapter, "sap.ushell.personalization#mock_pers", { validity: Infinity }),
            oUnmodifiableContainer = oContainer.getUnmodifiableContainer();

        // prepare data
        oContainer.setItemValue("foo", "bar");

        // test access to data
        assert.deepEqual(oUnmodifiableContainer.getItemKeys(), ["foo"], "getItemKeys returns expected value");
        assert.equal(oUnmodifiableContainer.containsItem("foo"), true, "containsItem returns expected value");
        assert.equal(oUnmodifiableContainer.getItemValue("foo"), "bar", "getItemValue returns expected value");
        assert.deepEqual(oUnmodifiableContainer.getUnmodifiableContainer(), oUnmodifiableContainer, "getUnmodifiableContainer returns expected value");

        // modify data
        oContainer.setItemValue("foofoo", "barbar");

        // test access after modification and another getUnmodifiableContainer
        assert.deepEqual(oUnmodifiableContainer.getItemKeys(), ["foo", "foofoo"], "getItemKeys returns expected value");
    });
    QUnit.test("all blocked functions throw an error", function (assert) {
        var oMockAdapter = {
            getAdapterContainer: function (/*sContainerKey*/) {
                return {};
            }
        },
            oContainer = new Personalization.ContextContainer(undefined, oMockAdapter, "sap.ushell.personalization#mock_pers", { validity: Infinity }),
            oUnmodifiableContainer = oContainer.getUnmodifiableContainer();

        [
            "clear",
            "delItem",
            "flush",
            "load",
            "save",
            "saveDeferred",
            "setItemValue"
        ].forEach(function (sFunctionName) {
            assert.throws(oUnmodifiableContainer[sFunctionName],
                function (oError) {
                    return oError.message === "Function " + sFunctionName + " can't be called on unmodifiable container";
                },
                sFunctionName + " throws expected exception");
        });
    });

    //  ............................................................................
    //
    //             Service only tests
    //
    //  ............................................................................

    QUnit.module("Personalization (createEmptyContainer / getContainer): service only tests", {
        beforeEach: function () {
            oPersonalizationTestUtils.mockGetService();

            this.PersonalizationAdapterMock = oPersonalizationTestUtils
                .createPersonalizationAdapterMock(AdapterContainerMock);

            var oAdapter = new this.PersonalizationAdapterMock();
            this.oService = new Personalization(oAdapter);
            return this.oService.delContainer("ACONTAINER");
        },
        afterEach: function () {
            delete this.oService;

            oPersonalizationTestUtils.restoreGetService();
        }
    });

    QUnit.test("createEmptyContainer", function (assert) {
        var vOriginalSubsequentLoadSupport = this.PersonalizationAdapterMock.prototype.supportsGetWithoutSubsequentLoad;
        this.PersonalizationAdapterMock.prototype.supportsGetWithoutSubsequentLoad = true;
        var oAdapter = new this.PersonalizationAdapterMock();
        var oFakeContainer = {
            clear: sandbox.stub(),
            load: sandbox.stub().returns(new jQuery.Deferred().resolve().promise()),
            getItemKeys: sandbox.stub().returns([]),
            delItem: sandbox.stub()
        };
        sandbox.stub(oAdapter, "getAdapterContainer").returns(oFakeContainer);
        var oService = new Personalization(oAdapter);
        return oService.createEmptyContainer("ACONTAINER")
            .done(function () {
                assert.equal(oAdapter.getAdapterContainer.calledOnce, true, "getAdapterContainer called once");
                assert.equal(oFakeContainer.load.calledOnce, false, "load called once ");
            })
            .fail(function () {
                assert.ok(false, "expected done");
            })
            .always(function () {
                this.PersonalizationAdapterMock.prototype.supportsGetWithoutSubsequentLoad = vOriginalSubsequentLoadSupport;
            }.bind(this));
    });

    QUnit.test("createEmptyContainer supportsGetWithoutSubsequentLoad ", function (assert) {
        this.PersonalizationAdapterMock.prototype.supportsGetWithoutSubsequentLoad = false;
        var oAdapter = new this.PersonalizationAdapterMock();
        var oFakeContainer = {
            clear: sandbox.stub(),
            load: sandbox.stub().returns(new jQuery.Deferred().resolve().promise()),
            getItemKeys: sandbox.stub().returns([]),
            delItem: sandbox.stub()
        };
        sandbox.stub(oAdapter, "getAdapterContainer").returns(oFakeContainer);
        var oService = new Personalization(oAdapter);
        return oService.createEmptyContainer("ACONTAINER")
            .done(function () {
                assert.equal(oFakeContainer.load.calledOnce, true, "load called once ");
                assert.equal(oAdapter.getAdapterContainer.calledOnce, true, "getAdapterContainer called once");
            })
            .fail(function () {
                assert.ok(false, "expected done");
            });
    });
});
