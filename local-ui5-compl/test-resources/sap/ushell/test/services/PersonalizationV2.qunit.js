// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for PersonalizationV2
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/Manifest",
    "sap/ui/core/UIComponent",
    "sap/ui/thirdparty/jquery",
    "sap/ui/thirdparty/sinon-4",
    "sap/ushell/services/PersonalizationV2",
    "sap/ushell/services/PersonalizationV2/utils",
    "sap/ushell/services/PersonalizationV2/Variant",
    "sap/ushell/shells/demo/fioriDemoConfig",
    "sap/ushell/test/utils",
    "sap/ushell/test/services/PersonalizationV2/AdapterContainerMock",
    "sap/ushell/test/services/PersonalizationV2/utils",
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
    Variant,
    fioriDemoConfig,
    testUtils,
    AdapterContainerMock,
    personalizationTestUtils,
    utils
) {
    "use strict";

    /* global QUnit */

    var sandbox = sinon.createSandbox({});

    const sContainerPrefix = "sap.ushell.personalization#";
    const sContainer = "sap.ushell.test.personalization";
    const sItem = "serviceTest";
    const sItemKey = "ItemKey";
    const sABAPTimeSampFormat = "yyyyMMddHHmmss";
    const sVariantKey = "VariantKey";
    const sVariantSetKey = "variantSetKey";
    const sVariantName = "Variant Name";
    const { KeyCategory, WriteFrequency } = Personalization.prototype;
    let sCachedConfig;

    // Contains mocked dependencies
    const oMock = { AdapterContainerMock: AdapterContainerMock }; // allows to spy on constructor

    //  ............................................................................
    //
    //             Transient Personalizer
    //
    //  ............................................................................

    QUnit.module("Personalization: TransientPersonalizer", {
        beforeEach: async function () {
            this.oItemValue = { v1: "false" };
            const oPersonalizationService = new Personalization(null);
            this.oTransientPersonalizer = await oPersonalizationService.getTransientPersonalizer();
        }
    });

    QUnit.test("setPersData + getPersData", async function (assert) {
        await this.oTransientPersonalizer.setPersData(this.oItemValue);
        const oPersData = await this.oTransientPersonalizer.getPersData();
        assert.deepEqual(oPersData, this.oItemValue, "Written data was read");
    });

    QUnit.test("setPersData, getPersData, delPersData", async function (assert) {
        await this.oTransientPersonalizer.setPersData(this.oItemValue);
        const oReadValue = await this.oTransientPersonalizer.getPersData();
        assert.deepEqual(oReadValue, this.oItemValue, "Pers data was read");
        await this.oTransientPersonalizer.deletePersData();
        const oReadValue2 = await this.oTransientPersonalizer.getPersData();
        assert.deepEqual(oReadValue2, undefined, "Pers data was deleted");
    });

    //  ............................................................................
    //
    //               Personalizer
    //
    //  ............................................................................

    QUnit.module("Personalization: Personalizer", {
        beforeEach: async function () {
            personalizationTestUtils.mockGetService();

            var PersonalizationAdapterMock = personalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock);
            this.sDefaultAppVariantAdapter = "sap.ushell.adapters.AppVariantPersonalizationAdapter";

            this.oAdapter = new PersonalizationAdapterMock();
            this.oService = new Personalization(this.oAdapter);
            this.oPersId = {
                container: sContainer,
                item: sItem
            };
            this.oPersonalizer = await this.oService.getPersonalizer(this.oPersId, { validity: Infinity });
            await this.oPersonalizer.deletePersData();
            sandbox.stub(sap.ui, "require");
        },
        afterEach: function () {
            personalizationTestUtils.restoreGetService();
            sandbox.restore();
        }
    });

    QUnit.test("_configureAppVariantStorage works as expected when empty configuration", function (assert) {
        // Act
        var oAppVariantConfig = this.oService._configureAppVariantStorage({});

        // Assert
        assert.strictEqual(oAppVariantConfig, undefined, "configuration was undefined");
        assert.notOk(sap.ui.require.calledWith([this.sDefaultAppVariantAdapter]), "sap.ui.require was not called with default adapter");
    });

    QUnit.test("_configureAppVariantStorage works as expected when no configuration", function (assert) {
        // Act
        var oAppVariantConfig = this.oService._configureAppVariantStorage();

        // Assert
        assert.ok(oAppVariantConfig, "obtained configuration");
        assert.strictEqual(oAppVariantConfig.hasOwnProperty("lazy"), true, "found lazy property");
        assert.strictEqual(oAppVariantConfig.lazy, true, "lazy property was true");
        assert.strictEqual(typeof oAppVariantConfig.create, "function", "lazy property was true");
        assert.notOk(sap.ui.require.calledWith([this.sDefaultAppVariantAdapter]), "sap.ui.require was not called with default adapter");
    });

    QUnit.test("_configureAppVariantStorage works as expected when adapter disabled by configuration", function (assert) {
        // Act
        var oAppVariantConfig = this.oService._configureAppVariantStorage({ enabled: false });

        // Assert
        assert.strictEqual(oAppVariantConfig, undefined, "configuration was undefined");
        assert.notOk(sap.ui.require.calledWith([this.sDefaultAppVariantAdapter]), "sap.ui.require was not called with default adapter");
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
        assert.notOk(sap.ui.require.calledWith([this.sDefaultAppVariantAdapter]), "sap.ui.require was not called with default adapter");
    });

    QUnit.test("_configureAppVariantStorage works as expected when adapter enabled but no adapter specified", function (assert) {
        // Act
        var oAppVariantConfig = this.oService._configureAppVariantStorage({ enabled: true });

        // Assert
        assert.ok(oAppVariantConfig, "obtained configuration");
        assert.strictEqual(oAppVariantConfig.hasOwnProperty("lazy"), true, "found lazy property");
        assert.strictEqual(oAppVariantConfig.lazy, true, "lazy property was true");
        assert.strictEqual(typeof oAppVariantConfig.create, "function", "lazy property was true");
        assert.notOk(sap.ui.require.calledWith([this.sDefaultAppVariantAdapter]), "sap.ui.require was not called with default adapter");
    });

    QUnit.test("set + get + delete", async function (assert) {
        await this.oPersonalizer.setPersData(this.oItemValue);
        assert.ok(true, "Personalization data was set");
        const oReadValue1 = await this.oPersonalizer.getPersData();
        assert.ok(true, "Personalization data was gotten");
        assert.deepEqual(oReadValue1, this.oItemValue, "Read value is the written value");
        await this.oPersonalizer.deletePersData();
        const oReadValue2 = await this.oPersonalizer.getPersData();
        assert.ok(true, "Personalization data was deleted");
        assert.equal(oReadValue2, undefined, "Personalization data was deleted - value is undefined");
    });

    QUnit.test("delete non-existent item", async function (assert) {
        await this.oPersonalizer.deletePersData();
        assert.ok(true, "Deletion of non-existent item did not lead to an error");
    });

    QUnit.test("getPersonalizer with component (empty object)", async function (assert) {
        // Arrange
        sandbox.stub(this.oService, "getContainer").resolves({ getItemValue: sandbox.stub() });
        var oScope = {};
        var oComponent = {};

        // Act
        const oPersonalizer = await this.oService.getPersonalizer(this.oPersId, oScope, oComponent);
        await oPersonalizer.getPersData();

        // Assert
        assert.ok(this.oService.getContainer.calledOnce);
        assert.deepEqual(this.oService.getContainer.args[0], [this.oPersId.container, oScope, oComponent]);
    });

    QUnit.test("getPersonalizer with undefined component", async function (assert) {
        // Arrange
        sandbox.stub(this.oService, "getContainer").resolves({ getItemValue: sandbox.stub() });
        var oScope = {};

        sandbox.stub(this.oService, "_getApplicationComponent").returns(undefined);

        // Act
        const oPersonalizer = await this.oService.getPersonalizer(this.oPersId, oScope);
        await oPersonalizer.getPersData();

        // Assert
        assert.ok(this.oService.getContainer.calledOnce);
        assert.deepEqual(this.oService.getContainer.args[0], [this.oPersId.container, oScope, undefined]);
    });

    QUnit.test("getPersonalizer with wrong oPersId", async function (assert) {
        const oService = new Personalization(this.oAdapter);
        try {
            await oService.getPersonalizer({
                wrongContainer: sContainer,
                wrongItem: "DummyNonExisting"
            });
            assert.ok(false, "Wrong oPersId wasn't detected");
        } catch (e1) {
            assert.ok(true, "Wrong oPersId was detected");
        }

        try {
            await oService.getPersonalizer({
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
            await oService.getPersonalizer({
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
        beforeEach: async function () {
            this.oItemValue = {
                Item1: "Item 1",
                Item2: "Item 2"
            };

            personalizationTestUtils.mockGetService();

            this.PersonalizationAdapterMock = personalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock);

            var oAdapter = new this.PersonalizationAdapterMock();
            this.oService = new Personalization(oAdapter);
            const oContainer = await this.oService.createEmptyContainer(sContainer, { validity: Infinity });
            this.oContainerVSAdapter = new Personalization.VariantSetAdapter(oContainer);
            this.oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            this.oVariant1 = this.oVariantSet.addVariant(sVariantName);
            this.oVariant1.setItemValue("Item1", "Item 1");
            this.oVariant1.setItemValue("Item2", "Item 2");
        },
        afterEach: async function () {
            await this.oService.deleteContainer(sContainer, { validity: Infinity });
            this.oContainerVSAdapter.deleteVariantSet(sVariantSetKey);

            personalizationTestUtils.restoreGetService();
            sandbox.restore();
        }
    });

    // ........... Variant Tests ...........

    QUnit.test("Variant: create variant and check variant key, name and data", function (assert) {
        // check variant key
        assert.equal("0", this.oVariant1.getVariantKey(), "Variant key is correctly stored");

        // check variant name
        assert.equal(sVariantName, this.oVariant1.getVariantName(), "Variant name is correctly stored");

        // check variant data
        assert.equal(this.oItemValue.Item1, this.oVariant1.getItemValue("Item1"), "Item1 value is correctly stored");
        assert.equal(this.oItemValue.Item2, this.oVariant1.getItemValue("Item2"), "Item2 value is correctly stored");
    });

    QUnit.test("Variant: create variant add, change and delete item", function (assert) {
        // add
        this.oVariant1.setItemValue("Item3", "Item 3");
        assert.equal("Item 3", this.oVariant1.getItemValue("Item3"), "Item3 value is correctly stored");
        assert.equal(true, this.oVariant1.containsItem("Item3"), "containsItem works correctly");

        // change
        this.oVariant1.setItemValue("Item1", "Item 42");
        assert.equal("Item 42", this.oVariant1.getItemValue("Item1"), "Item1 value is changed correctly");

        // get keys
        var aItemKeys = this.oVariant1.getItemKeys();
        assert.deepEqual(["Item1", "Item2", "Item3"], aItemKeys, "The correct array of item keys is returned by getItemKeys");

        // delete
        this.oVariant1.deleteItem("Item2");
        assert.equal(false, this.oVariant1.containsItem("Item2"), "deleteItem works correctly");
        assert.equal(undefined, this.oVariant1.getItemValue("Item2"), "getItemValue for a non-existent item returns undefined");
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
        this.oVariant1.deleteItem("NonExistentItemKey...");

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
        assert.equal(sVariantKey2, this.oVariant1.getVariantKey(), "Variant set contains variant with new name '" + sNewVariantName + "'");

        var oVariant2 = this.oVariantSet.getVariant(sVariantKey2);
        assert.deepEqual(oVariant2.getItemValue("Item1"), "Item 1", "Renamed variant has same value for Item1");

        oVariant2 = this.oVariantSet.getVariant(sVariantKey2);
        assert.deepEqual(oVariant2.getItemValue("Item1"), "Item 1", "Renamed variant has same value for Item1 (after getVariant())");

        this.oVariantSet = this.oContainerVSAdapter.getVariantSet(sVariantSetKey);
        var sVariantKey3 = this.oVariantSet.getVariantKeyByName(sNewVariantName);
        assert.equal(sVariantKey3, this.oVariant1.getVariantKey(), "Variant set updated in container");
        var oVariant3 = this.oVariantSet.getVariant(sVariantKey3);
        assert.deepEqual(oVariant3.getItemValue("Item1"), "Item 1", "Variant set data updated in container");
    });

    QUnit.test("Variant: set variant name - input validation", function (assert) {
        // Act & Assert
        assert.throws(function () {
            this.oVariant1.setVariantName(0);
        }, /Parameter value of sVariantName is not a string/, "Exception raised if sVariantName not a string ");
    });

    QUnit.test("Variant: set variant name - variant does not exist in variant set", function (assert) {
        // Arrange
        this.oVariantSet.deleteVariant(this.oVariant1.getVariantKey());
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
        beforeEach: async function () {
            this.oItemValue = { v1: "false" };

            personalizationTestUtils.mockGetService();

            this.PersonalizationAdapterMock = personalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock);

            var oAdapter = new this.PersonalizationAdapterMock({} /* oSystem */);
            this.oService = new Personalization(oAdapter);

            this.oContainer = await this.oService.createEmptyContainer(sContainer, { validity: Infinity });
            this.oContainerVSAdapter = new Personalization.VariantSetAdapter(this.oContainer);
            this.oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);

            // spy after initial call to empty container is made
            this.fnContextContainerSpy = sandbox.spy(Personalization.ContextContainer.prototype, "_init");
        },
        afterEach: async function () {
            sandbox.restore();

            await this.oService.deleteContainer(sContainer, { validity: Infinity }).catch(() => {});
            if (this.oContainerVSAdapter.deleteVariantSet) {
                this.oContainerVSAdapter.deleteVariantSet(sVariantSetKey);
            }

            personalizationTestUtils.restoreGetService();
        }
    });

    // ........... Container Item Tests ...........

    QUnit.test("The service is configured with the expected adapters", function (assert) {
        assert.strictEqual(this.oService._oAdapterWithBackendAdapter.lazy, false, "oAdapterWithBackendAdapter is configured to be non-lazy");
        assert.strictEqual(Object.prototype.toString.apply(this.oService._oAdapterWithBackendAdapter.instance), "[object Object]", "oAdapterWithBackendAdapter has an Object as the instance member");
        assert.strictEqual(Object.keys(this.oService._oAdapterWithBackendAdapter).length, 2, "oAdapterWithBackendAdapter has only 2 members");
        assert.strictEqual(this.oService._oAdapterWindowOnly.lazy, false, "oAdapterWindowOnly is configured to be non-lazy");
        assert.strictEqual(Object.prototype.toString.apply(this.oService._oAdapterWindowOnly.instance), "[object Object]", "oAdapterWindowOnly has an Object as the instance member");
        assert.strictEqual(Object.keys(this.oService._oAdapterWindowOnly).length, 2, "oAdapterWindowOnly has only 2 members");
        assert.strictEqual(this.oService._oAppVariantAdapterWithBackendAdapter.lazy, true, "oAppVariantAdapterWithWindowAdapter is configured to be non-lazy");
        assert.strictEqual(typeof this.oService._oAppVariantAdapterWithBackendAdapter.create, "function", "oAppVariantAdapterWithBackendAdapter has a function as the instance member");
        assert.strictEqual(Object.keys(this.oService._oAppVariantAdapterWithBackendAdapter).length, 2, "oAppVariantAdapterWithBackendAdapter has only 2 members");
    });

    QUnit.test("Lazy AppVariant adapter create function returns a thenable", function (assert) {
        // Arrange
        sandbox.stub(sap.ui, "require");

        // Act
        var oGotResult = this.oService._oAppVariantAdapterWithBackendAdapter.create();

        // Assert
        assert.strictEqual(typeof oGotResult, "object", "create function returned a result of type 'object'");
        if (typeof oGotResult !== "object") {
            return;
        }

        assert.strictEqual(typeof oGotResult.then, "function", "create function returned an object with a .then method");
    });

    QUnit.test("Items: set, get and delete undefined value (!) item", function (assert) {
        // demonstrate that one can set / get undefined
        assert.equal(false, this.oContainer.containsItem(sItemKey), sItemKey + " is not existing");
        this.oContainer.setItemValue(sItemKey, this.oItemValue);
        assert.equal(true, this.oContainer.containsItem(sItemKey), sItemKey + " exists after setItemValue");
        var oItemValueRead = this.oContainer.getItemValue(sItemKey);
        assert.deepEqual(this.oItemValue, oItemValueRead, "getItemValue returns the correct value for " + sItemKey);
        // does not hold ok(oItemValue !== oItemValueRead, "distinct objects");
        assert.equal(true, this.oContainer.containsItem(sItemKey), "containsItem returned true correctly for " + sItemKey);
        this.oContainer.deleteItem(sItemKey);
        assert.equal(typeof this.oContainer.getItemValue(sItemKey), "undefined", "Item was deleted, getItemValue returned null");
        assert.equal(false, this.oContainer.containsItem(sItemKey), "containsItem returned false correctly");
    });

    QUnit.test("Items: set, get and delete null value (!) item", function (assert) {
        // demonstrate that one can set / get undefined
        assert.equal(false, this.oContainer.containsItem(sItemKey), sItemKey + " is not existing");
        this.oContainer.setItemValue(sItemKey, this.oItemValue);
        assert.equal(true, this.oContainer.containsItem(sItemKey), sItemKey + " exists after setItemValue");
        var oItemValueRead = this.oContainer.getItemValue(sItemKey);
        assert.deepEqual(this.oItemValue, oItemValueRead, "getItemValue returns the correct value for " + sItemKey);
        // does not hold ok(oItemValue !== oItemValueRead, "distinct objects");
        assert.equal(true, this.oContainer.containsItem(sItemKey), "containsItem returned true correctly for " + sItemKey);
        this.oContainer.deleteItem(sItemKey);
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
            var oItemValue = oFixture2;

            assert.equal(false, this.oContainer.containsItem(sItemKey), sItemKey + " is not existing");
            this.oContainer.setItemValue(sItemKey, oItemValue);
            assert.equal(true, this.oContainer.containsItem(sItemKey), sItemKey + " exists after setItemValue");
            var oItemValueRead = this.oContainer.getItemValue(sItemKey);
            assert.deepEqual(oItemValue, oItemValueRead, "getItemValue returns the correct value for " + sItemKey);
            assert.ok(oItemValue !== oItemValueRead, "distinct objects");
            assert.equal(true, this.oContainer.containsItem(sItemKey), "containsItem returned true correctly for " + sItemKey);
            this.oContainer.deleteItem(sItemKey);
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
            var oItemValue = oFixture.obj;

            assert.equal(false, this.oContainer.containsItem(sItemKey), sItemKey + " is not existing");
            this.oContainer.setItemValue(sItemKey, oItemValue);
            assert.equal(true, this.oContainer.containsItem(sItemKey), sItemKey + " exists after setItemValue");
            var oItemValueRead = this.oContainer.getItemValue(sItemKey);
            assert.deepEqual(oFixture.repr, oItemValueRead, "getItemValue returns the correct value for " + sItemKey);
            assert.equal(true, this.oContainer.containsItem(sItemKey), "containsItem returned true correctly for " + sItemKey);
            this.oContainer.deleteItem(sItemKey);
            assert.ok(this.oContainer.getItemValue(sItemKey) === undefined, "Item was deleted, getItemValue returned null");
            assert.equal(false, this.oContainer.containsItem(sItemKey), "containsItem returned false correctly");
        });
    });

    QUnit.test("getKey", function (assert) {
        assert.equal(this.oContainer.getKey(), sContainer, "correct key returned");
    });

    QUnit.test("Items: set, get and delete recursive item", function (assert) {
        // create circular object
        this.oItemValue.nested = this.oItemValue;
        assert.equal(this.oContainer.getKey(), sContainer);
        // nested structures are silently converted to undefined
        assert.equal(false, this.oContainer.containsItem(sItemKey), sItemKey + " is not existing");
        this.oContainer.setItemValue(sItemKey, "legal");
        try {
            this.oContainer.setItemValue(sItemKey, this.oItemValue);
            assert.ok(false, "no exception");
        } catch (e) {
            assert.ok(true, "had exception");
        }
        assert.equal(true, this.oContainer.containsItem(sItemKey), sItemKey + " exists after setItemValue");
        var oItemValueRead = this.oContainer.getItemValue(sItemKey);
        assert.deepEqual(oItemValueRead, "legal", "getItemValue returns undefined for " + sItemKey);
    });

    QUnit.test("Items: set, get and delete item, check difficult key names", function (assert) {
        var sItemKey = "hasOwnProperty";

        this.oContainer.deleteItem(sItemKey);
        assert.equal(false, this.oContainer.containsItem(sItemKey), "hasOwnProperty is not existing");
        this.oContainer.setItemValue(sItemKey, this.oItemValue);
        assert.equal(true, this.oContainer.containsItem(sItemKey), "hasOwnProperty exists after setItemValue");
        var oItemValueRead = this.oContainer.getItemValue(sItemKey);
        assert.deepEqual(this.oItemValue, oItemValueRead, "getItemValue returns the correct value for hasOwnProperty");
        assert.equal(true, this.oContainer.containsItem(sItemKey), "containsItem returned true correctly for hasOwnProperty");
        this.oContainer.deleteItem(sItemKey);
        assert.equal(null, this.oContainer.getItemValue(sItemKey), "Item was deleted, getItemValue returned null");
        assert.equal(false, this.oContainer.containsItem(sItemKey), "containsItem returned false correctly");
    });

    QUnit.test("Items: add items with and with no prefix, read them", async function (assert) {
        // check if the container is empty
        assert.equal(this.oContainer.getItemKeys().length, 0, "Container is empty");
        // add item1 with no item prefix
        // dirty hack
        this.oContainer._setItemValueInternal("item1", "prefix0", this.oItemValue);
        // add item2 with item prefix
        this.oContainer.setItemValue("item2", this.oItemValue);
        // add item 3 with item prefix
        this.oContainer.setItemValue("item3", this.oItemValue);
        var aActItemKeys = this.oContainer.getItemKeys();
        assert.equal(aActItemKeys.length, 2, "Container has 3 items: '" + aActItemKeys + "'");
        assert.ok(true, "Internal item keys are: " + this.oContainer._oItemMap.keys() + "'");
        assert.equal(false, this.oContainer.containsItem("item1"), "'item1' is not detected by containsItem due to automatic prefixing!");

        await this.oContainer.save();
        assert.ok(true, "Successful container save");
        await this.oContainer.load();
        assert.ok(true, "Successful container reload");
        // check if prefix was added to item1
        assert.equal(false, this.oContainer.containsItem("item1"), "Container contains 'item1'");
        this.oContainer.deleteItem("item1");
        this.oContainer.deleteItem("item2");
        this.oContainer.deleteItem("item3");
        assert.equal(this.oContainer.getItemKeys().length, 0, "All items are deleted");
    });

    QUnit.test("Items: Delete non-existent item", function (assert) {
        assert.ok(!this.oContainer.containsItem(sItemKey), "Item is not existing");
        try {
            this.oContainer.deleteItem(sItemKey);
            assert.ok(true, "Non-existent item was deleted without error");
        } catch (e) {
            assert.ok(false, "Error during deletion of non-existing item");
        }
    });

    QUnit.test("Items: Get value of non-existent item", function (assert) {
        assert.ok(!this.oContainer.containsItem(sItemKey), "Item is not existing");
        try {
            var oItemValue = this.oContainer.getItemValue(sItemKey);
            assert.ok(oItemValue === undefined, "Value of a non-existing item is undefined");
        } catch (e) {
            assert.ok(false, "Error during getItemValue of non-existing item");
        }
    });

    QUnit.test("Variant Set: add and delete variant", function (assert) {
        assert.equal(true, this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was added");
        var oVariant1 = this.oVariantSet.addVariant("Variant number one added");
        var sVariantKey1 = oVariant1.getVariantKey();
        assert.equal(true, this.oVariantSet.containsVariant(sVariantKey1), "Variant '" + sVariantKey1 + "' was added");
        // add variant 1
        var oVariant2 = this.oVariantSet.addVariant("Variant number two");
        var sVariantKey2 = oVariant2.getVariantKey();
        assert.equal(true, this.oVariantSet.containsVariant(sVariantKey2), "Variant '" + sVariantKey2 + "' was added");
        // delete variant 0
        this.oVariantSet.deleteVariant(sVariantKey1);
        assert.equal(false, this.oVariantSet.containsVariant(sVariantKey1), "Variant '" + sVariantKey1 + "' was deleted");
        // delete variant 1
        this.oVariantSet.deleteVariant(sVariantKey2);
        assert.equal(false, this.oVariantSet.containsVariant(sVariantKey2), "Variant '" + sVariantKey2 + "' was deleted");
        // delete variant set
        this.oContainerVSAdapter.deleteVariantSet(sVariantSetKey);
        assert.equal(false, this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was deleted");
    });

    QUnit.test("Variant Set: add existing variant set", function (assert) {
        assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
        assert.ok(!this.oVariantSet.getVariantKeyByName(sVariantName), "Variant with name '" + sVariantName + "' does not exist");
        this.oVariantSet.addVariant(sVariantName); // add it once
        try {
            this.oVariantSet.addVariant(sVariantName); // add it twice
            assert.ok(false, "Error: adding the same named variant twice was not detected");
        } catch (e) {
            assert.ok(true, "Exception for adding the same variant twice is correct");
        }
    });

    QUnit.test("Variant Set: set current variant and check", function (assert) {
        if (this.oContainerVSAdapter.containsVariantSet(sVariantSetKey)) {
            this.oContainerVSAdapter.deleteVariantSet(sVariantSetKey);
        }

        var oVariant = this.oVariantSet.addVariant("V1");
        oVariant.setItemValue("item", this.oItemValue);
        var sVariantKeyExp = oVariant.getVariantKey();
        this.oVariantSet.setCurrentVariantKey(sVariantKeyExp);

        assert.deepEqual(this.oVariantSet.getCurrentVariantKey(), sVariantKeyExp, "currentVariantKey was set correctly");
    });

    QUnit.test("Variant Set: delete non-existent variant", function (assert) {
        assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
        assert.ok(!this.oVariantSet.containsVariant(sVariantKey), "Variant '" + sVariantKey + "' does not exist");
        try {
            this.oVariantSet.deleteVariant(sVariantKey);
            assert.ok(true, "Non-existing variant was deleted without error/exception");
        } catch (e) {
            assert.ok(false, "Error: Exception during deletion of a non-existing variant");
        }
    });

    QUnit.test("Variant Set: get non-existent variant", function (assert) {
        assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
        assert.ok(!this.oVariantSet.containsVariant(sVariantKey), "Variant '" + sVariantKey + "' does not exist");
        try {
            var oVariant = this.oVariantSet.getVariant(sVariantKey);
            assert.ok(oVariant === undefined, "getVariant returns undefined for a non-existing variant");
        } catch (e) {
            assert.ok(false, "Error: Exception during getVariant for a non-existing variant");
        }
    });

    QUnit.test("Variant Set: add variant with an exotic name", function (assert) {
        var sSpecialCharVariantName = "未经";

        assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
        assert.ok(!this.oVariantSet.getVariantKeyByName(sSpecialCharVariantName), "Variant with name '" + sSpecialCharVariantName + "' does not exist");
        try {
            var oVariant = this.oVariantSet.addVariant(sSpecialCharVariantName);
            assert.ok(oVariant instanceof Personalization.Variant, "addVariant returns a variant object");
        } catch (e) {
            assert.ok(false, "Error: Exception during addVariant");
        }
    });

    QUnit.test("Variant Set: add variant to a big max key variant set", function (assert) {
        var sVariantKey1 = "999999";
        var sVariantName2 = "VARIANT_1115";

        assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
        assert.ok(!this.oVariantSet.containsVariant(sVariantKey1), "Variant with key '" + sVariantKey1 + "' does not exist");
        // add variant manually
        this.oVariantSet._oVariantSetData.variants[sVariantKey1] = { name: sVariantName, variantData: {} };
        assert.ok(this.oVariantSet.containsVariant(sVariantKey1), "Variant with key '" + sVariantKey1 + "' and name '" + sVariantName + "' was added");
        var oVariant2 = this.oVariantSet.addVariant(sVariantName2);
        assert.ok(parseInt(oVariant2.getVariantKey(), 10) === parseInt(sVariantKey1, 10) + 1, "variant key was increased correctly");
    });

    QUnit.test("Variant Set: getVariantKeyByName standard", function (assert) {
        assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
        var oVariant = this.oVariantSet.addVariant(sVariantName);
        assert.equal(this.oVariantSet.getVariantKeyByName(sVariantName), oVariant.getVariantKey(), "getVariantKey returns the correct key");
    });

    QUnit.test("Variant Set: getVariantKeyByName with non-existing name", function (assert) {
        assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
        assert.equal(this.oVariantSet.getVariantKeyByName(sVariantName), undefined, "getVariantKey returns undefined for a non-existing name");
    });

    QUnit.test("Variant Set: getVariantKeyByName with non-string name", function (assert) {
        assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
        assert.equal(this.oVariantSet.getVariantKeyByName(this.oVariantSet), undefined, "getVariantKey returns undefined for a non-string name");
    });

    QUnit.test("Variant Set: getVariantNamesAndKeys", function (assert) {
        var sVariantName1 = "VARIANT_1";
        var sVariantName2 = "VARIANT_2";
        var sVariantName3 = "VARIANT_3";

        assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
        var sVariantKey1 = this.oVariantSet.addVariant(sVariantName1).getVariantKey();
        var sVariantKey2 = this.oVariantSet.addVariant(sVariantName2).getVariantKey();
        var sVariantKey3 = this.oVariantSet.addVariant(sVariantName3).getVariantKey();
        var aVariantNamesAndKeys = this.oVariantSet.getVariantNamesAndKeys();
        assert.equal(aVariantNamesAndKeys[sVariantName1], sVariantKey1, "result for variant 1 is correct");
        assert.equal(aVariantNamesAndKeys[sVariantName2], sVariantKey2, "result for variant 2 is correct");
        assert.equal(aVariantNamesAndKeys[sVariantName3], sVariantKey3, "result for variant 3 is correct");
    });

    QUnit.test("Variant Set: add and delete variant sets", function (assert) {
        var aExpVariantSetKeys = ["variantSetKey", "variantSet1", "variantSet2"];
        this.oContainerVSAdapter.addVariantSet(aExpVariantSetKeys[1], this.oItemValue);
        this.oContainerVSAdapter.addVariantSet(aExpVariantSetKeys[2], this.oItemValue);

        // check variant sets
        var aActVariantSetKeys = this.oContainerVSAdapter.getVariantSetKeys();
        aExpVariantSetKeys.forEach(function (sVariantSetKey, index) {
            assert.deepEqual(aActVariantSetKeys[index], sVariantSetKey, "'" + sVariantSetKey + "' exists");
        });
        // delete
        aExpVariantSetKeys.forEach(function (sVariantSetKey) {
            this.oContainerVSAdapter.deleteVariantSet(sVariantSetKey);
        }.bind(this));
        // check deletion
        aExpVariantSetKeys.forEach(function (sVariantSetKey) {
            assert.equal(false, this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Container does not have variantSet '" + sVariantSetKey + "'");
        }.bind(this));
    });

    QUnit.test("Variant Set: Delete non-existent variant set", function (assert) {
        assert.ok(!this.oContainerVSAdapter.containsVariantSet("NonExistingVariantSet"), "Variant set is not existing");
        try {
            this.oContainerVSAdapter.deleteVariantSet("NonExistingVariantSet");
            assert.ok(true, "Non-existent variant set was deleted without error");
        } catch (e) {
            assert.ok(false, "Error during deletion of non-existing variant set");
        }
    });

    QUnit.test("Variant Set: Get non-existent variant set", function (assert) {
        assert.ok(!this.oContainerVSAdapter.containsVariantSet("NonExistingVariantSet"), "Variant set is not existing");
        try {
            var oVariantSet = this.oContainerVSAdapter.getVariantSet("NonExistingVariantSet");
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

    QUnit.test("Container: add and delete variantSets/Items", async function (assert) {
        this.oContainer.setItemValue(sItemKey, this.oItemValue);
        this.oContainer.setItemValue("itemKey2", "item2");

        // add variant V1
        var oVariant = this.oVariantSet.addVariant("V1");
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
        await this.oContainer.save().catch(function () {
            assert.ok(false, "Save failed");
        });
        this.oContainer.deleteItem("itemKey2");
        this.oContainerVSAdapter.deleteVariantSet(sVariantSetKey);
        this.oContainer.setItemValue("itemKey3", "item3");
        await this.oContainer.save();
        assert.ok(!this.oContainer.containsItem("itemKey2"), "itemKey2 was deleted");
        assert.ok(!this.oContainerVSAdapter.containsVariantSet(this.sVariantSetKey), this.sVariantSetKey + " was deleted");
        assert.ok(this.oContainer.containsItem("itemKey3"), "itemKey3 was added");
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
        QUnit.test("#getContainer when " + oFixture.testDescription, async function (assert) {
            var fnCreateContainer = sandbox.spy(this.oService, "_createContainer");
            var oScope = {};

            sandbox.stub(this.oService, "_getApplicationComponent").returns(oFixture.oRecoveredComponent);

            // code under test
            await this.oService.getContainer("ContainerKey", oScope, oFixture.oInputComponent);

            // tests
            assert.ok(fnCreateContainer.calledOnce);
            assert.deepEqual(fnCreateContainer.getCall(0).args, ["ContainerKey", oScope, false, oFixture.expectedComponent]);
        });

        QUnit.test("#createEmptyContainer when " + oFixture.testDescription, async function (assert) {
            var fnCreateContainer = sandbox.spy(this.oService, "_createContainer");
            var oScope = {};

            sandbox.stub(this.oService, "_getApplicationComponent").returns(oFixture.oRecoveredComponent);

            //code under test
            await this.oService.createEmptyContainer("ContainerKey", oScope, oFixture.oInputComponent);

            // tests
            assert.ok(fnCreateContainer.calledOnce);
            assert.deepEqual(fnCreateContainer.getCall(0).args, ["ContainerKey", oScope, true, oFixture.expectedComponent]);
        });
    });

    QUnit.test("_createContainer returns if chosen adapter is lazy but construct function returns immediately", async function (assert) {
        var aExpectedResult = ["AdapterCreate", "createContainer"];
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
            create: sandbox.stub().callsFake(() => {
                aGotResult.push("AdapterCreate");
                return new jQuery.Deferred().resolve(new (personalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock))()).promise();
            })
        };

        // Act
        await this.oService._createContainer("ContainerKey", oScope, false, this.oComponent).then(() => {
            aGotResult.push("createContainer");
        });

        // Assert
        assert.deepEqual(aGotResult, aExpectedResult, "got the expected result");
    });

    QUnit.test("_createContainer returns immediately if chosen adapter is lazy but construct function returns a native promise and fails", async function (assert) {
        // Arrange
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
                new (personalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock))()
            ).promise())
        };

        sandbox.stub(personalizationUtils, "loadAdapter").returns(new jQuery.Deferred().reject(oLoadAdapterError).promise());

        // Act
        await this.oService._createContainer("ContainerKey", oScope, false, this.oComponent).catch((oError) => {
            assert.ok(true, "promise was rejected");
            assert.deepEqual(oError, oLoadAdapterError, "promise was rejected with the same error as loadAdapter");
        });
    });

    QUnit.test("_createContainer rejects if loadAdapter rejects", async function (assert) {
        // Arrange
        var oLoadAdapterError = { error: true };
        var oScope = {
            validity: 1,
            keyCategory: "GENERATED_KEY",
            writeFrequency: "HIGH",
            clientStorageAllowed: false
        };

        this.oService._oAdapterWithBackendAdapter = {
            lazy: false,
            instance: new (personalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock))()
        };

        sandbox.stub(personalizationUtils, "loadAdapter").returns(new jQuery.Deferred().reject(oLoadAdapterError).promise());

        // Act
        await this.oService._createContainer("ContainerKey", oScope, false, this.oComponent).catch((oError) => {
            assert.ok(true, "promise was rejected");
            assert.deepEqual(oError, oLoadAdapterError, "promise was rejected with the same error as loadAdapter");
        });
    });

    QUnit.test("_createContainer rejects if lazy adapter promise rejects", async function (assert) {
        // Arrange
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
        await this.oService._createContainer("ContainerKey", oScope, false, this.oComponent).catch((oError) => {
            assert.ok(true, "promise was rejected");
            assert.deepEqual(oError, oCreateAdapterError, "promise was rejected with the same error as loadAdapter");
        });
    });

    QUnit.test("_createContainer rejects if lazy adapter throws", async function (assert) {
        // Arrange
        var oCreateAdapterError = new Error("deliberate failure");
        var oScope = {
            validity: 1,
            keyCategory: "GENERATED_KEY",
            writeFrequency: "HIGH",
            clientStorageAllowed: false
        };

        this.oService._oAdapterWithBackendAdapter = {
            lazy: true,
            create: function () {
                throw oCreateAdapterError;
            }
        };

        // Act & Assert
        await this.oService._createContainer("ContainerKey", oScope, false, this.oComponent).catch((oError) => {
            assert.ok(true, "promise was rejected");
            assert.deepEqual(oError, oCreateAdapterError, "promise was rejected with the same error as loadAdapter");
        });
    });

    QUnit.test("_createContainer when there is no component", async function (assert) {
        var oScope = {
            validity: 1,
            keyCategory: "GENERATED_KEY",
            writeFrequency: "HIGH",
            clientStorageAllowed: false
        };

        // add mocked app variant adapter container
        this.oService._oAppVariantAdapterWithBackendAdapter = {
            lazy: false,
            instance: new (personalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock))()
        };

        //code under test
        await this.oService._createContainer("ContainerKey", oScope, false, this.oComponent);
        // tests
        assert.ok(this.fnContextContainerSpy.calledOnce);
        assert.strictEqual(this.fnContextContainerSpy.firstCall.args[0], this.oService);
        assert.strictEqual(this.fnContextContainerSpy.firstCall.args[1], this.oService._oAdapterWithBackendAdapter.instance);
        assert.strictEqual(this.fnContextContainerSpy.firstCall.args[2], "sap.ushell.personalization#ContainerKey");
        assert.deepEqual(this.fnContextContainerSpy.firstCall.args[3], oScope);
        assert.strictEqual(this.fnContextContainerSpy.firstCall.args[4], this.oComponent);
    });

    QUnit.test("_createContainer when there is component but no shared scope", async function (assert) {
        var oScope = {
            validity: 1,
            keyCategory: "GENERATED_KEY",
            writeFrequency: "HIGH",
            clientStorageAllowed: false
        };

        var oDescriptor = { "sap.app": {
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
            instance: new (personalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock))()
        };

        //code under test
        await this.oService._createContainer("ContainerKey", oScope, false, this.oComponent);
        // tests
        assert.ok(this.fnContextContainerSpy.calledOnce);
        assert.deepEqual(this.fnContextContainerSpy.firstCall.args[0], this.oService);
        assert.deepEqual(this.fnContextContainerSpy.firstCall.args[1], this.oService._oAppVariantAdapterWithBackendAdapter.instance);
        assert.strictEqual(this.fnContextContainerSpy.firstCall.args[2], "sap.ushell.personalization#ContainerKey#AppVarId");
        assert.notDeepEqual(this.fnContextContainerSpy.firstCall.args[3], oScope);
        assert.strictEqual(this.fnContextContainerSpy.firstCall.args[3].appVarId, "AppVarId");
        assert.strictEqual(this.fnContextContainerSpy.firstCall.args[3].appVersion, "1.2.3");
        assert.deepEqual(this.fnContextContainerSpy.firstCall.args[4], this.oComponent);
    });
    // -- lrep tests begin

    QUnit.test("ContextContainer", function (assert) {
        var oAdapter = { getAdapterContainer: sandbox.spy() };
        var oScope = {};
        var aExpectedArguments = [
            [ "ContainerKey",
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
        var oService = {};
        var oAdapter = { getAdapterContainer: sandbox.spy() };
        var oScope = {};

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
                assert.equal(ex.message, "oComponent passed is not a UI5 Component and not undefined", "correct exception thrown");
            }
        });
    });

    QUnit.test("WindowAdapter.getAdapterContainer", function (assert) {
        var oAdapter = { getAdapterContainer: sandbox.spy() };
        var oScope = {};
        var aExpectedArguments = [
            [ "ContainerKey",
                oScope, "testUtils.AppSample"
            ]
        ];

        var oWindowAdapter = new Personalization.WindowAdapter({}, oAdapter);

        // Act
        oWindowAdapter.getAdapterContainer("ContainerKey", oScope, "testUtils.AppSample");

        // Assert
        assert.deepEqual(oAdapter.getAdapterContainer.args, aExpectedArguments);
    });

    QUnit.test("Container: Get container with no scope", async function (assert) {
        try {
            await this.oService.getContainer("ABC123", undefined /* oScope */, undefined /* oComponent */);
            assert.ok(true, "No error was thrown");
        } catch (e) {
            assert.ok(false, "No error was thrown. DEBUG: " + e);
        }
    });

    QUnit.test("Container: Get container with non-string key", async function (assert) {
        try {
            await this.oService.getContainer(this.oService);
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
            beforeEach: async function () {
                this.oItemValue = { v1: "false" };
                testUtils.restoreSpies(
                    Log.error
                );

                personalizationTestUtils.mockGetService();

                this.PersonalizationAdapterMock = personalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock);

                this.oAdapter = new this.PersonalizationAdapterMock({});
                this.oService = new Personalization(this.oAdapter);

                this.oContainer = await this.oService.getContainer(sContainer, { validity: oFixture.validity });
                this.oContainerVSAdapter = new Personalization.VariantSetAdapter(this.oContainer);
            },
            afterEach: async function () {
                sandbox.restore();
                await this.oService.deleteContainer(sContainer, { validity: oFixture.validity });
                personalizationTestUtils.restoreGetService();
            }
        });

        QUnit.test("Container (" + oFixture.validity + "): get (new) + save + get + validity expired = clear faked clock!", async function (assert) {
            const oContainer = await this.oService.createEmptyContainer(sContainer, { validity: oFixture.validity });
            oContainer.setItemValue(sItemKey, this.oItemValue);
            assert.ok(true, "Personalization data was set");
            // simulate the clock!
            this.dFakeTime = new Date("Jan 2 2013 01:50");
            var oClock = sinon.useFakeTimers({
                now: this.dFakeTime.getTime(),
                shouldAdvanceTime: true
            });

            var oDateFormatter = DateFormat.getDateInstance({ pattern: sABAPTimeSampFormat });
            this.sFormattedTime = oDateFormatter.format(this.dFakeTime, true);
            this.sFormattedExpireTime = oDateFormatter.format(new Date(this.dFakeTime.getTime() + oFixture.validity * 60000), true);
            await oContainer.save();

            oClock.restore();
            this.dFakeTime = new Date("Jan 2 2013 01:55");
            oClock = sinon.useFakeTimers({
                now: this.dFakeTime.getTime(),
                shouldAdvanceTime: true
            });

            const oContainer2 = await this.oService.getContainer(sContainer, { validity: oFixture.validity });
            assert.ok(true, "Personalization data was gotten");
            assert.deepEqual(oContainer2.getItemValue(sItemKey).v1, "false", "value present!");
            assert.deepEqual(oContainer2.getItemKeys(), ["ItemKey"], "expired!");
            var oReadValue2 = oContainer2._getItemValueInternal("ADMIN#", "sap-ushell-container-scope");
            var oReadValueSTO = oContainer2._getItemValueInternal("ADMIN#", "sap-ushell-container-storageUTCTimestamp");
            var oReadValueEXP = oContainer2._getItemValueInternal("ADMIN#", "sap-ushell-container-expireUTCTimestamp");
            if (oFixture.hasValidityPersistence) {
                assert.deepEqual(oReadValue2.validity, oFixture.validity, "scope variable set;");
                assert.deepEqual(oReadValueSTO, this.sFormattedTime, "storage set;");
                assert.deepEqual(oReadValueEXP, this.sFormattedExpireTime, "expire set;");
            } else {
                assert.deepEqual(oReadValueSTO, undefined, "storage not set;");
                assert.deepEqual(oReadValueEXP, undefined, "expire not set;");
            }

            oClock.restore();
            this.dFakeTime = new Date("Jan 2 2013 04:55");
            oClock = sinon.useFakeTimers({
                now: this.dFakeTime.getTime(),
                shouldAdvanceTime: true
            });

            const oContainer3 = await this.oService.getContainer(sContainer, { validity: oFixture.validity });
            if (oFixture.hasValidityPersistence) {
                assert.deepEqual(oContainer3.getItemKeys(), [], "expired!");
                assert.deepEqual(oContainer3.getItemValue(sItemKey), undefined, "expired!");
            } else {
                assert.deepEqual(oContainer3.getItemValue(sItemKey).v1, "false", "value present!");
            }

            oClock.restore();
        });

        QUnit.test("Container (" + oFixture.validity + "): get (new) + save + get + delete", async function (assert) {
            var oService = this.oService;
            var oItemValue = this.oItemValue;

            const oContainer = await oService.getContainer(sContainer, { validity: oFixture.validity });
            oContainer.setItemValue(sItemKey, oItemValue);
            // not serialized !!!!
            oItemValue.v2 = "true";
            let oReadValue = oContainer.getItemValue(sItemKey);
            assert.deepEqual(oReadValue, { v1: "false" }, "Read value is the value at time of set");
            assert.ok(oReadValue !== oItemValue, "distinct object from set returned in get");
                let oReadValue2 = oContainer.getItemValue(sItemKey);
            assert.ok(oReadValue2 !== oReadValue, "distinct object returned in get");
            assert.ok(true, "Personalization data was set");

            await oContainer.save();
            // obtain the (existing) Container (again)
            const oContainer2 = await oService.getContainer(sContainer, { validity: oFixture.validity });

            assert.ok(true, "Personalization data was gotten");
            oReadValue = oContainer2.getItemValue(sItemKey);
            assert.deepEqual(oReadValue, { v1: "false" }, "Read value is the saved value");

            oReadValue.v3 = "1111";
            oReadValue2 = oContainer2.getItemValue(sItemKey);
            assert.deepEqual(oReadValue2.v3, undefined, "Read value is not a live object;");
            assert.ok(oReadValue !== oReadValue2, "Same object ! the live written value");
            await oService.deleteContainer(sContainer, { validity: oFixture.validity });
            const oContainer3 = await oService.getContainer(sContainer, { validity: oFixture.validity });
            oReadValue = oContainer3.getItemValue(sItemKey);
            assert.ok(true, "Personalization data was deleted");
            assert.equal(oReadValue, undefined, "Personalization data was deleted - value is undefined");
        });

        QUnit.test("Container (" + oFixture.validity + "): get (new) + save + get + validity set?", async function (assert) {
            var oService = this.oService;
            var oItemValue = this.oItemValue;

            const oContainer = await oService.getContainer(sContainer, { validity: oFixture.validity });

            oContainer.setItemValue(sItemKey, oItemValue);
            assert.ok(true, "Personalization data was set");
            var oDateFormatter = DateFormat.getDateInstance({ pattern: sABAPTimeSampFormat });
            var dDate = new Date();
            var sFormattedTime = oDateFormatter.format(dDate, true);
            var sFormattedExpireTime = oDateFormatter.format(new Date(dDate.getTime() + oFixture.validity * 60000), true);
            await oContainer.save();

            var oReadValue2 = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-scope");
            var oReadValueSTO = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-storageUTCTimestamp");
            var oReadValueEXP = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-expireUTCTimestamp");

            if (oFixture.hasValidityPersistence) {
                assert.deepEqual(oReadValue2.validity, oFixture.validity, "scope variable set;");
                var delta = parseInt(oReadValueSTO, 10) - parseInt(sFormattedTime, 10);
                assert.ok(delta <= 2 && delta >= -2, "storage set;" + oReadValueSTO + "=?=" + sFormattedTime);
                delta = parseInt(oReadValueEXP, 10) - parseInt(sFormattedExpireTime, 10);
                assert.ok(delta <= 2 && delta >= -2, "expire set;" + oReadValueEXP + "=?=" + sFormattedExpireTime);
            } else {
                assert.deepEqual(oReadValueSTO, undefined, "storage not set;");
                assert.deepEqual(oReadValueEXP, undefined, "expire not set;");
            }

            // obtain the (existing) Container (again)
            const oContainer2 = await oService.getContainer(sContainer, { validity: oFixture.validity });

            assert.ok(true, "Personalization data was gotten");
            oReadValueSTO = oContainer2._getItemValueInternal("ADMIN#", "sap-ushell-container-storageUTCTimestamp");
            oReadValueEXP = oContainer2._getItemValueInternal("ADMIN#", "sap-ushell-container-expireUTCTimestamp");

            if (oFixture.hasValidityPersistence) {
                assert.deepEqual(oReadValueSTO, sFormattedTime, "storage set;");
                assert.deepEqual(oReadValueEXP, sFormattedExpireTime, "expire set;");
            } else {
                assert.deepEqual(oReadValueSTO, undefined, "storage not set;");
                assert.deepEqual(oReadValueEXP, undefined, "expire not set;");
            }
        });

        QUnit.test("Container (" + oFixture.validity + "): get (new) + nosave,  get + delete", async function (assert) {
            var oService = this.oService;
            var oItemValue = this.oItemValue;

            const oContainer = await oService.getContainer(sContainer, { validity: oFixture.validity });

            oContainer.setItemValue(sItemKey, oItemValue);
            // not serialized !!!!
            oItemValue.v2 = "true";
            var oReadValue = oContainer.getItemValue(sItemKey);
            assert.deepEqual(oReadValue, { v1: "false" }, "Read value is the value at time of set");
            assert.ok(oReadValue !== oItemValue, "distinct object from set returned in get");

            var oReadValue2 = oContainer.getItemValue(sItemKey);
            assert.ok(oReadValue2 !== oReadValue, "distinct object returned in get");
            assert.ok(true, "Personalization data was set");

            // obtain the (existing) Container (again)
            const oContainer2 = await oService.getContainer(sContainer, { validity: oFixture.validity });

            assert.ok(true, "Personalization data was gotten");
            oReadValue = oContainer2.getItemValue(sItemKey);
            assert.deepEqual(oReadValue, undefined, "not saved value is initial");

            await oService.deleteContainer(sContainer, { validity: oFixture.validity });
            const oContainer3 = await oService.getContainer(sContainer, { validity: oFixture.validity });
            oReadValue = oContainer3.getItemValue(sItemKey);
            assert.ok(true, "Personalization data was deleted");
            assert.equal(oReadValue, undefined, "Personalization data was deleted - value is undefined");
        });

        QUnit.test("Container (" + oFixture.validity + "): get save, create (empty)!", async function (assert) {
            var oService = this.oService;
            var oItemValue = this.oItemValue;

            const oContainer = await oService.getContainer(sContainer, { validity: oFixture.validity });
            oContainer.setItemValue(sItemKey, oItemValue);
            oContainer.setItemValue("Stale", oItemValue);
            // not serialized !!!!
            oItemValue.v2 = "true";
            oContainer.getItemValue(sItemKey);
            assert.ok(true, "Personalization data was set");

            // save
            await oContainer.save();

            assert.ok(true, "Personalization data was gotten");
            var oReadValue = oContainer.getItemValue(sItemKey);
            assert.deepEqual(oReadValue, { v1: "false" }, "not saved value is initial");

            const oContainer2 = await oService.createEmptyContainer(sContainer, { validity: oFixture.validity });
            oReadValue = oContainer2.getItemValue(sItemKey);
            assert.ok(true, "Personalization data was deleted");
            assert.equal(oReadValue, undefined, "Personalization data was deleted - value is undefined");
            assert.equal(oContainer2.getItemKeys().length, 0, "Personalization data was deleted - value is undefined");

            oContainer2.setItemValue(sItemKey, { v333: true });
            await oContainer2.save();
            const oContainer3 = await oService.getContainer(sContainer, { validity: oFixture.validity });
            oReadValue = oContainer3.getItemValue("Stale");
            assert.equal(oReadValue, undefined, "Personalization data was cleared - value is undefined");
            oReadValue = oContainer3.getItemValue(sItemKey);
            assert.deepEqual(oReadValue, { v333: true }, " new value set after");
        });

        QUnit.test("Container (" + oFixture.validity + "): reload restores original data", async function (assert) {
            const oContainer = await this.oService.getContainer(sContainer, { validity: oFixture.validity });
            oContainer.setItemValue(sItemKey, this.oItemValue);
            assert.equal(oContainer.getItemValue(sItemKey).v1, "false", sItemKey + " added");
            await oContainer.save();
            assert.ok(true, "Data saved");
            assert.equal(oContainer.getItemValue(sItemKey).v1, "false", sItemKey + " still there after save");
            oContainer.setItemValue(sItemKey, "item2");
            assert.equal(oContainer.getItemValue(sItemKey), "item2", sItemKey + " changed to item2 (no save)");
            await oContainer.load();
            assert.equal(oContainer.getItemValue(sItemKey).v1, "false",
                sItemKey + " loaded with correct value '" + this.oItemValue.v1 + "'");
        });

        QUnit.test("Container ( " + oFixture.validity + "): get  setItem length warnings", async function (assert) {
            var sContainerKey = "AveryLongContainerKeyMoreThan40CharsWithT";
            sandbox.spy(Log, "error");

            const oContainer = await this.oService.getContainer(sContainerKey, { validity: oFixture.validity });
            assert.deepEqual(Log.error.getCall(0).args[0], "Personalization Service container key "
                + "(\"AveryLongContainerKeyMoreThan40CharsWithT\") should be less than 40 characters [current :41]");
            this.oItemValue = { v1: "false" };
            oContainer.setItemValue(sContainerKey, this.oItemValue);
            assert.deepEqual(Log.error.getCall(1).args[0],
                "Personalization Service item key/variant set name (\"AveryLongContainerKeyMoreThan40CharsWithT\") should be less than 40 characters [current :41]");
            assert.deepEqual(Log.error.getCall(1).args[0],
                "Personalization Service item key/variant set name (\"AveryLongContainerKeyMoreThan40CharsWithT\") should be less than 40 characters [current :41]");
            assert.ok(true, "Personalization data was set");
        });

        QUnit.test("AppContainer ( " + oFixture.validity + "): get setItem length 40 no warnings", async function (assert) {
            var sContainerKey = "AveryLongContainerKeyMoreThan40CharsWith";
            sandbox.spy(Log, "error");

            const oContainer = await this.oService.createEmptyContainer(sContainerKey, { validity: oFixture.validity });
            assert.deepEqual(Log.error.getCall(0), null);
            this.oItemValue = { v1: "false" };
            oContainer.setItemValue(sContainerKey, this.oItemValue);
            assert.deepEqual(Log.error.getCall(0), null);
            assert.ok(true, "Personalization data was set");
        });

        QUnit.test("Container (" + oFixture.validity + "): Error during load inside constructor", async function (assert) {
            if (oFixture.validity === 0) {
                assert.ok(true, "validity 0, adapter throws no errors, mock not relevant");
                return;
            }
            //standard setup already filled the windowAdapter. Thus the mock adapter code is not executed
            //so we have to delete the window content to simulate the error behaviour
            Personalization.WindowAdapter.prototype.data = {};

            this.oAdapter.setErrorProvocation(sContainer);
            await this.oService.getContainer(sContainer, { validity: oFixture.validity }).catch(function () {
                assert.ok(true, "Load of container failed");
            });
            this.oAdapter.resetErrorProvocation(sContainer);
            this.oService._oContainerMap.remove(sContainerPrefix + sContainer);
            // dirty hack to get a new deferred object during the deletion

            await this.oService.deleteContainer(sContainer, { validity: oFixture.validity });
            assert.ok(true, "Deletion of container succeeded");
        });

        QUnit.test("Container (" + oFixture.validity + "): Error during save", async function (assert) {
            if (oFixture.validity === 0) {
                assert.ok(true, " validity 0, adapter throws no errors, mock not relevant");
                return;
            }

            const oContainer = await this.oService.getContainer(sContainer, { validity: oFixture.validity });
            assert.ok(true, "Load of container succeeded");
            this.oAdapter.setErrorProvocation(sContainer);
            await oContainer.save().catch(function () {
                assert.ok(true, "Save of container failed");
            });
            this.oAdapter.resetErrorProvocation(sContainer);
        });

        QUnit.test("Container (" + oFixture.validity + "): Error during deletion", async function (assert) {
            if (oFixture.validity === 0) {
                assert.ok(true, " validity 0, adapter throws no errors, mock not relevant");
                return;
            }

            await this.oService.getContainer(sContainer, { validity: oFixture.validity });

            assert.ok(true, "Load of container succeeded");
            this.oAdapter.setErrorProvocation(sContainer);
            await this.oService.deleteContainer(sContainer, { validity: oFixture.validity }).catch(function () {
                assert.ok(true, "Deletion of container failed");
            });
            this.oAdapter.resetErrorProvocation(sContainer);
        });

        QUnit.test("Container (" + oFixture.validity + "): check for container not a singleton", async function (assert) {
            const oContainer1 = await this.oService.getContainer(sContainer, { validity: oFixture.validity });
            assert.ok(true, "Load of container 1 succeeded");
            const oContainer2 = await this.oService.getContainer(sContainer, { validity: oFixture.validity });
            assert.ok(true, "Load of container 2 succeeded");
            assert.ok(oContainer1 !== oContainer2, "Container is not a singleton");
            oContainer1.setItemValue("once", "aValue");
            oContainer2.setItemValue("once", "anotherInstanceValue");
            assert.equal("aValue", oContainer1.getItemValue("once"), "Container is not a singleton, distinct storage");
            assert.equal("anotherInstanceValue", oContainer2.getItemValue("once"), "Container is not a singleton, distinct storage");
        });

        QUnit.test("Container (" + oFixture.validity + "): Mix of container and personalizer", async function (assert) {
            // Personalizer does reuse of the container
            this.oContainer.setItemValue(sItemKey, this.oItemValue);
            assert.ok(this.oContainer.containsItem(sItemKey), sItemKey + " was added");
            var oPersId = {
                container: sContainer,
                item: sItemKey
            };

            await this.oContainer.save();
            var oPersonalizer = await this.oService.getPersonalizer(oPersId);
            const oReadItemValue = await oPersonalizer.getPersData();
            assert.deepEqual(this.oItemValue, oReadItemValue, "distinct for validity 0");
        });

        QUnit.test("Variant Set (" + oFixture.validity + "): save and simulate browser reload 1", async function (assert) {
            this.aVariantExp = [];
            this.oVariantNameAndKeysExp = {};

            // add variant set
            if (this.oContainerVSAdapter.containsVariantSet(sVariantSetKey)) {
                this.oContainerVSAdapter.deleteVariantSet(sVariantSetKey);
            }
            assert.ok(!this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
            var oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            var oItemMap = new utils.Map();

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
            var oVariant1 = oVariantSet.addVariant("V1");
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
            var oVariant2 = oVariantSet.addVariant("V2");
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
            await this.oContainer.save();
            // simulate browser reload
            delete this.oContainer;
            this.oService._oContainerMap.remove(sContainerPrefix + sContainer);
            const oContainer2 = await this.oService.getContainer(sContainer, { validity: oFixture.validity });
            var aVariantKeys = [];
            var aVariants = [];
            var oContainerVSAdapter = new Personalization.VariantSetAdapter(oContainer2);

            assert.ok(oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' exists after save");
            oVariantSet = oContainerVSAdapter.getVariantSet(sVariantSetKey);

            var oVariantNameAndKeys = oVariantSet.getVariantNamesAndKeys();
            assert.deepEqual(oVariantNameAndKeys, this.oVariantNameAndKeysExp, "Variant names and keys are correct");
            assert.deepEqual(oVariantSet.getVariantKeyByName("V1"), this.oVariantNameAndKeysExp.V1);
            assert.deepEqual(oVariantSet.getVariantKeyByName("V2"), this.oVariantNameAndKeysExp.V2);
            aVariantKeys = oVariantSet.getVariantKeys();
            aVariantKeys.forEach(function (sVariantKey) {
                var va = oVariantSet.getVariant(sVariantKey);
                buildVariantObject(aVariants, sVariantKey, va);
            });
            assert.deepEqual(aVariants, this.aVariantExp, "Entire variant is correct");
            oContainerVSAdapter.deleteVariantSet(sVariantSetKey);
            assert.ok(!oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was deleted");
        });

        QUnit.test("Variant Set (" + oFixture.validity + "): save and simulate browser reload 2", async function (assert) {
            // add variant set
            if (this.oContainerVSAdapter.containsVariantSet(sVariantSetKey)) {
                this.oContainerVSAdapter.deleteVariantSet(sVariantSetKey);
            }

            var oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            // add variant V1
            var oVariant = oVariantSet.addVariant("V1");
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
            await this.oContainer.save();
            // tabula rasa
            delete this.oContainer;
            this.oService._oContainerMap.remove(sContainer);
            // new container
            const oContainer2 = await this.oService.getContainer(sContainer, { validity: oFixture.validity });
            var aVariants = [];
            // !!!!!!!!!!!!!!!!!!!!!!!!!!
            this.oContainer = oContainer2;
            this.oContainerVSAdapter = new Personalization.VariantSetAdapter(oContainer2);
            oVariantSet = this.oContainerVSAdapter.getVariantSet(sVariantSetKey);
            oVariant = oVariantSet.addVariant("V3");
            oVariant.setItemValue("I1", {
                Val1: "value 111",
                Val2: "value 123"
            });
            oVariant.setItemValue("I2", {
                Filter1: "489",
                Filter2: "90000"
            });
            var sVariantKey = oVariantSet.getVariantKeyByName("V2");
            oVariantSet.deleteVariant(sVariantKey);
            sVariantKey = oVariantSet.getVariantKeyByName("V1");
            oVariantSet.deleteVariant(sVariantKey);
            oVariant = oVariantSet.addVariant("V1");
            oVariant.setItemValue("I3", {
                Val1: "value 01",
                Val2: "value 02"
            });
            oVariant.setItemValue("I4", {
                Filter1: "240",
                Filter2: "10009"
            });
            this.oContainerVSAdapter.save(); // delegates!
            var aVariantKeys = oVariantSet.getVariantKeys();
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
            this.oContainerVSAdapter.deleteVariantSet(sVariantSetKey);
        });
    });

    // ............................................................................
    //
    //               Container Version 2 - Validity 0
    //
    // ............................................................................

    QUnit.module("Personalization Container V2 - validity 0", {
        beforeEach: function () {
            // the config has to be reset after the test
            if (!sCachedConfig) {
                sCachedConfig = JSON.stringify(window["sap-ushell-config"]);
            }

            personalizationTestUtils.mockGetService();

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

            personalizationTestUtils.restoreGetService();
            sandbox.restore();
        }
    });



    QUnit.test("2 containers with the same name, validity 0 & 1", async function (assert) {
        // With Version 1.28+ the persistence within a window is always identical
        // persistencies.
        var sContainerName = "Container2075";
        var sItemKey = "Item2078";
        var oItemValue = { test: "test2079" };

        // Arrange
        var oService = personalizationTestUtils.createPersonalizationService({
            adapterContainerConstructor: AdapterContainerMock
        });

        // Act
        const oVal0Container = await oService.getContainer(sContainerName, { validity: 0 });
        oVal0Container.setItemValue(sItemKey, oItemValue);
        await oVal0Container.save();
        const oVal1Container = await oService.getContainer(sContainerName, { validity: 1 });
        var oReadItemValue = oVal1Container.getItemValue(sItemKey);
        assert.deepEqual(oReadItemValue, oItemValue, "Same container persistency for validity 0 & 1");
        var nValidity = oVal1Container._getItemValueInternal("ADMIN#", "sap-ushell-container-scope") &&
            oVal1Container._getItemValueInternal("ADMIN#", "sap-ushell-container-scope").validity;
        assert.equal(nValidity, undefined, "no artificial validity set");

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
            beforeEach: async function () {
                var oSystem = {};

                personalizationTestUtils.mockGetService();
                this.PersonalizationAdapterMock = personalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock);

                this.oAdapter = new this.PersonalizationAdapterMock(oSystem);
                this.oService = new Personalization(this.oAdapter);

                this.oContainer = await this.oService.getContainer(sContainer, { validity: oFixture.validity });
            },
            afterEach: async function () {
                await this.oService.deleteContainer(sContainer, { validity: oFixture.validity });
                await this.oService.deleteContainer(sContainer + "2nd", { validity: oFixture.validity });
                delete this.oAdapter;
                delete this.oContainer;
                delete this.oService;

                personalizationTestUtils.restoreGetService();
                sandbox.restore();
            }
        });

        QUnit.test("AppContainer (" + oFixture.validity + "): save, load, check", async function (assert) {

            this.oContainer.setItemValue("key1", { v1: "Value1" });
            await this.oContainer.save(10);
            assert.ok(true, "Save done");
            const oReadContainer = await this.oService.getContainer(sContainer, { validity: oFixture.validity });
            assert.deepEqual(oReadContainer.getItemValue("key1"), { v1: "Value1" }, "Correct save");
        });

        QUnit.test("AppContainer (" + oFixture.validity + "): save, load, check #2", async function (assert) {
            var done = assert.async(2);

            this.oContainer.setItemValue("key1", { v1: "Value1" });
            this.oContainer.save(1000000).then(async (sMsg) => {
                assert.ok(true, "Dropped save done");
                assert.equal(sMsg, Personalization.prototype.SAVE_DEFERRED_DROPPED, "save was dropped");

                const oReadContainer = await this.oService.getContainer(sContainer, { validity: oFixture.validity });
                assert.deepEqual(oReadContainer.getItemValue("key1"), { v1: "Value1" }, "First save - Correct save of key1");
                assert.deepEqual(oReadContainer.getItemValue("key2"), { v1: "Value1" }, "First save - Correct save of key2");
                done();
            });


            this.oContainer.setItemValue("key2", { v1: "Value1" });
            this.oContainer.save().then(async () => {
                assert.ok(true, "Save done");
                const oReadContainer2 = await this.oService.getContainer(sContainer, { validity: oFixture.validity });
                assert.deepEqual(oReadContainer2.getItemValue("key1"), { v1: "Value1" }, "Second save - Correct save of key1");
                assert.deepEqual(oReadContainer2.getItemValue("key2"), { v1: "Value1" }, "Second save - Correct save of key2");
                done();
            });
        });

        QUnit.test("AppContainer (" + oFixture.validity + "): save, flushPendingRequests, load, check", async function (assert) {
            var done = assert.async(2);

            this.oContainer.setItemValue("key1", { v1: "Value1" });
            this.oContainer.save(1000000).then(async () => {
                assert.ok(true, "Save done");

                const oReadContainer = await this.oService.getContainer(sContainer, { validity: oFixture.validity });
                assert.deepEqual(oReadContainer.getItemValue("key1"), { v1: "Value1" }, "save - Correct save of key1");
                assert.deepEqual(oReadContainer.getItemValue("key2"), { v1: "Value1" }, "save - Correct save of key2");
                done();
            });

            this.oContainer.setItemValue("key2", { v1: "Value1" });

            this.oContainer.flushPendingRequests().then(async () => {
                assert.ok(true, "flushPendingRequests done");
                const oReadContainer = await this.oService.getContainer(sContainer, { validity: oFixture.validity });
                assert.deepEqual(oReadContainer.getItemValue("key1"), { v1: "Value1" }, "pre save - Correct key1");
                assert.deepEqual(oReadContainer.getItemValue("key2"), { v1: "Value1" }, "pre save - Correct key2");
                done();
            });
        });
    });

    // ............................................................................
    //
    // Container Version 2 - Cross Validity
    //
    // cross validity tests
    // test interaction between several validity!
    //
    // save 30,   get 0 -> new instance ?
    // save 0,  get 30 -> new instance
    //
    // sequence  validity (save) validity2 get, del(validity2)   get validity.
    // zombie persistence true indicates save() data is retrieved albeit deletion
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
                var oSystem = {};

                personalizationTestUtils.mockGetService();

                this.PersonalizationAdapterMock = personalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock);

                var oAdapter = new this.PersonalizationAdapterMock(oSystem);
                this.oService = new Personalization(oAdapter);
            },
            afterEach: async function () {
                await this.oService.deleteContainer(sContainer, { validity: oFixture.validity });
                delete this.oService;

                personalizationTestUtils.restoreGetService();
                sandbox.restore();
            }
        });

        QUnit.test("AppContainer (" + oFixture.validity + "/" + oFixture.validity2 + ") : get w/ different validity gets same data, new instance! get (new) +  get + delete", async function (assert) {
            var oService = this.oService;

            const oContainer = await oService.getContainer(sContainer, { validity: oFixture.validity });
            this.oItemValue = { v1: false };
            oContainer.setItemValue(sItemKey, this.oItemValue);
            // not serialized !!!!
            this.oItemValue.v2 = true;
            assert.equal(oFixture.validity, oContainer._getValidity(), "first validity");
            assert.ok(true, "Personalization data was set");

            await oContainer.save();
            assert.ok(true, "save ok");

            // obtain the (existing) Container (again)
            const oContainer2 = await oService.getContainer(sContainer, { validity: oFixture.validity2 });
            assert.ok(true, "Personalization data was gotten");
            var oReadValue = oContainer2.getItemValue(sItemKey);
            var oReadValueExpected = { v1: false };
            if (oFixture.distinctValues) {
                oReadValueExpected = undefined;
            }
            assert.deepEqual(oReadValueExpected, oReadValue, "Read value is the saved value!");
            assert.equal(oFixture.validity2, oContainer2._getValidity(), "2nd validity");
            await oService.deleteContainer(sContainer, { validity: oFixture.validity2 });

            assert.equal(oFixture.validity2, oContainer2._getValidity(), "2nd validity of stale container");
            const oContainer3 = await oService.getContainer(sContainer, { validity: oFixture.validity });
            oReadValue = oContainer3.getItemValue(sItemKey);
            assert.ok(true, "Personalization data deletion successful");
            assert.equal(oFixture.validity, oContainer3._getValidity(), "validity ok");
            if (oFixture.zombiePersistence) {
                assert.deepEqual({ v1: false }, oReadValue, " see first persistence !");
            } else {
                assert.equal(oReadValue, undefined, "Personalization data was deleted - value is undefined");
            }
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
                var oSystem = {};

                personalizationTestUtils.mockGetService();

                this.PersonalizationAdapterMock = personalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock);

                var oAdapter = new this.PersonalizationAdapterMock(oSystem);
                this.oSpyAdapterGet = sandbox.spy(this.PersonalizationAdapterMock.prototype, "getAdapterContainer");
                this.oSpyAdapterDelete = sandbox.spy(oAdapter, "delAdapterContainer");
                this.oSpyAdapterSave = sandbox.spy(oMock.AdapterContainerMock.prototype, "save");
                this.oService = new Personalization(oAdapter);
            },
            afterEach: async function () {
                await this.oService.deleteContainer(sContainer, { validity: oFixture.validity });
                await this.oService.deleteContainer(sContainer + "2nd", { validity: oFixture.validity });
                delete this.oService;

                personalizationTestUtils.restoreGetService();
                sandbox.restore();
            }
        });

        QUnit.test("AppContainer  ( " + oFixture.validity + ") : test adapter called", async function (assert) {
            var oService = this.oService;

            const oContainer = await oService.getContainer(sContainer, { validity: oFixture.validity });
            this.oItemValue = { v1: "false" };
            oContainer.setItemValue(sItemKey, this.oItemValue);
            // not serialized !!!!
            this.oItemValue.v2 = "true";
            assert.equal(oFixture.effectiveValidity, oContainer._getValidity(), "first validity");
            assert.ok(true, "Personalization data was set");

            await oContainer.save();
            assert.ok(true, "save ok");
            assert.equal(oFixture.adapterCalled, this.oSpyAdapterGet.called, "adapter called");
            assert.equal(false, this.oSpyAdapterDelete.called, "Del not called ");
            assert.equal(oFixture.adapterCalled, this.oSpyAdapterSave.called, "Save called");

            // obtain the (existing) Container (again)
            const oContainer2 = await oService.getContainer(sContainer, { validity: oFixture.validity });
            assert.ok(true, "Personalization data was gotten");
            assert.equal(oFixture.adapterCalled, oFixture.adapterCalled && this.oSpyAdapterGet.callCount === 2, "adapter called (0 or two)");
            assert.equal(false, this.oSpyAdapterDelete.called, "Del not called ");
            var oReadValue = oContainer2.getItemValue(sItemKey);
            assert.deepEqual(oReadValue, { v1: "false" }, "Read value is the saved value");
            assert.equal(oFixture.effectiveValidity, oContainer2._getValidity(), "validity");
            oReadValue.v3 = false;
            assert.deepEqual(oContainer2.getItemValue(sItemKey), { v1: "false" }, "Read value is not a live read value");
            assert.ok(oReadValue !== this.oItemValue, "not same object");

            await oService.deleteContainer(sContainer, { validity: oFixture.validity });
            assert.equal(oFixture.adapterCalled, this.oSpyAdapterGet.callCount === 3, "adapter called");
            assert.equal(oFixture.adapterCalled, this.oSpyAdapterDelete.called, "Del called");
            assert.equal(oFixture.effectiveValidity, oContainer2._getValidity(), "2nd validity of stale container");
            const oContainer3 = await oService.getContainer(sContainer, { validity: oFixture.validity });
            oReadValue = oContainer3.getItemValue(sItemKey);
            assert.ok(true, "Personalization data deletion successful");
            assert.equal(oFixture.effectiveValidity, oContainer3._getValidity(), "validity ok");
            // new get!
            assert.equal(oFixture.adapterCalled, this.oSpyAdapterGet.callCount === 4, "adapter called");
        });
    });

    //  ............................................................................
    //
    //             Variant Version 1
    //
    //  ............................................................................

    QUnit.module("Personalization: Variant V1", {
        beforeEach: async function () {
            var oSystem = {};

            this.PersonalizationAdapterMock = personalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock);

            this.oAdapter = new this.PersonalizationAdapterMock(oSystem);
            this.oService = new Personalization(this.oAdapter);
            this.oContainer = await this.oService.getContainer(sContainer);
            this.oContainerVariantAdapter = new Personalization.VariantSetAdapter(this.oContainer);
            this.oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVariantSetKey);
            this.oVariant = this.oVariantSet.addVariant(sVariantName);
            this.oVariant.setItemValue("Item1", "Item 1");
            this.oVariant.setItemValue("Item2", "Item 2");
        },
        afterEach: async function () {
            await this.oService.deleteContainer(sContainer);
            delete this.oAdapter;
            delete this.oContainer;
            delete this.oContainerVariantAdapter;
            delete this.oService;
            delete this.oVariantSet;
            delete this.oVariant;
            sandbox.restore();
        }
    });

    QUnit.test("Variant: create variant and check variant key, name and data", function (assert) {
        const oVariant = this.oVariantSet.addVariant("Variant2");
        oVariant.setItemValue("ItemV2", "Item V2");
        oVariant.setItemValue("ItemV21", "Item V21");
        // check variant key
        assert.equal("1", oVariant.getVariantKey(), "Variant key is correctly stored");
        // check variant name
        assert.equal("Variant2", oVariant.getVariantName(), "Variant name is correctly stored");
        // check variant data
        assert.equal("Item V2", oVariant.getItemValue("ItemV2"), "ItemV2 value is correctly stored");
        assert.equal("Item V21", oVariant.getItemValue("ItemV21"), "ItemV21 value is correctly stored");
    });

    QUnit.test("Variant: create variant add, change and delete item", function (assert) {
        var aItemKeys = [];
        // add
        this.oVariant.setItemValue("Item3", "Item 3");
        assert.equal("Item 3", this.oVariant.getItemValue("Item3"), "Item3 value is correctly stored");
        assert.equal(true, this.oVariant.containsItem("Item3"), "containsItem works correctly");
        // change
        this.oVariant.setItemValue("Item1", "Item 42");
        assert.equal("Item 42", this.oVariant.getItemValue("Item1"), "Item1 value is changed correctly");
        // get keys
        aItemKeys = this.oVariant.getItemKeys();
        assert.deepEqual(["Item1", "Item2", "Item3"], aItemKeys, "The correct array of item keys is returned by getItemKeys");
        // delete item
        this.oVariant.deleteItem("Item2");
        assert.equal(false, this.oVariant.containsItem("Item2"), "deleteItem works correctly");
        assert.equal(undefined, this.oVariant.getItemValue("Item2"), "getItemValue for a non-existent item returns undefined");
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("Variant: create a variant with a non-string key", function (assert) {
        var vNonStringVariantKey = ["0"];
        var sVariantName = "VariantName";
        try {
            new Variant(this.oVariantSet, vNonStringVariantKey, sVariantName);
            assert.ok(false, "Error: Non-string key was not detected.");
        } catch (e) {
            assert.ok(true, "Non-string key was was detected.");
        }
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("Variant: create a variant with a non-string name", function (assert) {
        var sVariantKey = "0";
        var vNonStringVariantName = ["ArrayVariantName"];
        try {
            new Variant(this.oVariantSet, sVariantKey, vNonStringVariantName);
            assert.ok(false, "Error: Non-string name was not detected.");
        } catch (e) {
            assert.ok(true, "Non-string name was was detected.");
        }
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("Variant: create a variant with an exotic name", function (assert) {
        var sVariantKey = "0";
        var sVariantName = "未经";
        new Variant(this.oVariantSet, sVariantKey, sVariantName);
        assert.ok(true, "Variant name '" + sVariantName + "' was handled with no error during variant creation.");
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("Variant: delete a non-existent item", function (assert) {
        this.oVariant.deleteItem("NonExistentItemKey...");

        assert.ok(true, "Non-existent item was deleted without error.");
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("Variant: getItemValue for non-existent item", function (assert) {
        const oItemValue = this.oVariant.getItemValue("NonExistentItemKey...");
        assert.equal(undefined, oItemValue, "Correct value undefined was returned.");
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
        assert.deepEqual(oSerializationResult, oExpectedSerialization, "Serialization of variant works correctly");
    });

    // ........... Variant Set Tests ...........

    QUnit.test("Variant Set: add and delete variant", function (assert) {
        var sVariantSetKey = "VARIANT_SET_KEY_988";

        assert.equal(false, this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
        var oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVariantSetKey);
        assert.equal(true, this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was added");
        var oVariant1 = oVariantSet.addVariant("Variant number one added");
        var sVariantKey1 = oVariant1.getVariantKey();
        assert.equal(true, oVariantSet.containsVariant(sVariantKey1), "Variant '" + sVariantKey1 + "' was added");
        // add variant 1
        var oVariant2 = oVariantSet.addVariant("Variant number two");
        var sVariantKey2 = oVariant2.getVariantKey();
        assert.equal(true, oVariantSet.containsVariant(sVariantKey2), "Variant '" + sVariantKey2 + "' was added");
        // delete variant 0
        oVariantSet.deleteVariant(sVariantKey1);
        assert.equal(false, oVariantSet.containsVariant(sVariantKey1), "Variant '" + sVariantKey1 + "' was deleted");
        // delete variant 1
        oVariantSet.deleteVariant(sVariantKey2);
        assert.equal(false, oVariantSet.containsVariant(sVariantKey2), "Variant '" + sVariantKey2 + "' was deleted");
        // delete variant set
        this.oContainerVariantAdapter.deleteVariantSet(sVariantSetKey);
        assert.equal(false, this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was deleted");
    });

    QUnit.test("Variant Set: add existing variant set", function (assert) {
        var sVariantSetKey = "VARIANT_SET_KEY_1025";
        var sVariantName = "VARIANT_1026";

        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
        var oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVariantSetKey);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
        assert.ok(!oVariantSet.getVariantKeyByName(sVariantName), "Variant with name '" + sVariantName + "' does not exist");
        oVariantSet.addVariant(sVariantName); // add it once
        try {
            oVariantSet.addVariant(sVariantName); // add it twice
            assert.ok(false, "Error: adding the same named variant twice was not detected");
        } catch (e) {
            assert.ok(true, "Exception for adding the same variant twice is correct");
        }
    });

    QUnit.test("Variant Set: set current variant and check", function (assert) {
        this.aVariantExp = [];
        this.oVariantNameAndKeysExp = {};
        var sVariantSetKey = "VARIANT_SET_KEY_1027";

        if (this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey)) {
            this.oContainerVariantAdapter.deleteVariantSet(sVariantSetKey);
        }

        var oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVariantSetKey);
        var oVariant = oVariantSet.addVariant("V1");
        oVariant.setItemValue("item", this.oItemValue);
        var sVariantKeyExp = oVariant.getVariantKey();
        oVariantSet.setCurrentVariantKey(sVariantKeyExp);

        assert.deepEqual(oVariantSet.getCurrentVariantKey(), sVariantKeyExp, "currentVariantKey was set correctly");
    });

    QUnit.test("Variant Set: delete non-existent variant", function (assert) {
        var sVariantSetKey = "VARIANT_SET_KEY_1050";
        var sVariantKey = "1051";

        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
        var oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVariantSetKey);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
        assert.ok(!oVariantSet.containsVariant(sVariantKey), "Variant '" + sVariantKey + "' does not exist");
        try {
            oVariantSet.deleteVariant(sVariantKey);
            assert.ok(true, "Non-existing variant was deleted without error/exception");
        } catch (e) {
            assert.ok(false, "Error: Exception during deletion of a non-existing variant");
        }
    });

    QUnit.test("Variant Set: get non-existent variant", function (assert) {
        var sVariantSetKey = "VARIANT_SET_KEY_1070";
        var sVariantKey = "1071";

        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
        var oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVariantSetKey);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
        assert.ok(!oVariantSet.containsVariant(sVariantKey), "Variant '" + sVariantKey + "' does not exist");
        try {
            var oVariant = oVariantSet.getVariant(sVariantKey);
            assert.ok(oVariant === undefined, "getVariant returns undefined for a non-existing variant");
        } catch (e) {
            assert.ok(false, "Error: Exception during getVariant for a non-existing variant");
        }
    });

    QUnit.test("Variant Set: add variant with an exotic name", function (assert) {
        var sVariantSetKey = "VARIANT_SET_KEY_1091";
        var sVariantName = "未经";

        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
        var oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVariantSetKey);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
        assert.ok(!oVariantSet.getVariantKeyByName(sVariantName), "Variant with name '" + sVariantName + "' does not exist");
        try {
            var oVariant = oVariantSet.addVariant(sVariantName);
            assert.ok(oVariant instanceof Variant, "addVariant returns a variant object");
        } catch (e) {
            assert.ok(false, "Error: Exception during addVariant");
        }
    });

    QUnit.test("Variant Set: add variant to a big max key variant set", function (assert) {
        var sVariantSetKey = "VARIANT_SET_KEY_1112";
        var sVariantName1 = "VARIANT_1113";
        var sVariantKey1 = "999999";
        var sVariantName2 = "VARIANT_1115";

        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
        var oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVariantSetKey);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
        assert.ok(!oVariantSet.containsVariant(sVariantKey1), "Variant with key '" + sVariantKey1 + "' does not exist");
        // add variant manually
        const oVariant = oVariantSet.addVariant(sVariantName1);
        oVariant.setItemValue(sVariantKey1, sVariantName1);
        assert.ok(oVariantSet.getVariant("0").containsItem(sVariantKey1), "Variant with key '" + sVariantKey1 + "' and name '" + sVariantName1 + "' was added");
        var oVariant2 = oVariantSet.addVariant(sVariantName2);
        assert.ok(parseInt(oVariant2.getVariantKey(), 10) === parseInt(oVariant.getVariantKey(), 10) + 1, "variant key was increased correctly");
    });

    QUnit.test("Variant Set: getVariantKeyByName standard", function (assert) {
        var sVariantSetKey = "VARIANT_SET_KEY_1138";
        var sVariantName = "VARIANT_1139";

        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
        var oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVariantSetKey);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
        var oVariant = oVariantSet.addVariant(sVariantName);
        assert.equal(oVariantSet.getVariantKeyByName(sVariantName), oVariant.getVariantKey(), "getVariantKey returns the correct key");
    });

    QUnit.test("Variant Set: getVariantKeyByName with non-existing name", function (assert) {
        var sVariantSetKey = "VARIANT_SET_KEY_1154";
        var sVariantName = "VARIANT_1155";

        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
        var oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVariantSetKey);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
        assert.equal(oVariantSet.getVariantKeyByName(sVariantName), undefined, "getVariantKey returns undefined for a non-existing name");
    });

    QUnit.test("Variant Set: getVariantKeyByName with non-string name", function (assert) {
        var sVariantSetKey = "VARIANT_SET_KEY_1168";

        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
        var oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVariantSetKey);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
        assert.equal(oVariantSet.getVariantKeyByName(oVariantSet), undefined, "getVariantKey returns undefined for a non-string name");
    });

    QUnit.test("Variant Set: getVariantNamesAndKeys", function (assert) {
        var sVariantSetKey = "VARIANT_SET_KEY_1196";
        var sVariantName1 = "VARIANT_1";
        var sVariantName2 = "VARIANT_2";
        var sVariantName3 = "VARIANT_3";

        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
        var oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVariantSetKey);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
        var sVariantKey1 = oVariantSet.addVariant(sVariantName1).getVariantKey();
        var sVariantKey2 = oVariantSet.addVariant(sVariantName2).getVariantKey();
        var sVariantKey3 = oVariantSet.addVariant(sVariantName3).getVariantKey();
        var aVariantNamesAndKeys = oVariantSet.getVariantNamesAndKeys();
        assert.equal(aVariantNamesAndKeys[sVariantName1], sVariantKey1, "result for variant 1 is correct");
        assert.equal(aVariantNamesAndKeys[sVariantName2], sVariantKey2, "result for variant 2 is correct");
        assert.equal(aVariantNamesAndKeys[sVariantName3], sVariantKey3, "result for variant 3 is correct");
    });

    QUnit.test("Variant Set: save and simulate browser reload 1", async function (assert) {
        this.aVariantExp = [];
        this.oVariantNameAndKeysExp = {};
        var sVariantSetKey = "VARIANT_SET_KEY_1052";

        // add variant set
        if (this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey)) {
            this.oContainerVariantAdapter.deleteVariantSet(sVariantSetKey);
        }
        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
        var oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVariantSetKey);


        var oVariant1 = oVariantSet.addVariant("V1");
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
        var oVariant2 = oVariantSet.addVariant("V2");
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
        await this.oContainer.save();
        // simulate browser reload
        delete this.oContainer;
        this.oService._oContainerMap.remove(sContainerPrefix + sContainer);
        await this.oService.getContainer(sContainer);
        assert.ok(this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' exists after save");
        this.oVariantSet = this.oContainerVariantAdapter.getVariantSet(sVariantSetKey);

        var oVariantNameAndKeys = this.oVariantSet.getVariantNamesAndKeys();
        assert.deepEqual(oVariantNameAndKeys, this.oVariantNameAndKeysExp, "Variant names and keys are correct");
        assert.deepEqual(this.oVariantSet.getVariantKeyByName("V1"), this.oVariantNameAndKeysExp.V1);
        assert.deepEqual(this.oVariantSet.getVariantKeyByName("V2"), this.oVariantNameAndKeysExp.V2);
        var aVariantKeys = this.oVariantSet.getVariantKeys();

        const aVariants = [];
        aVariantKeys.forEach(function (sVariantKey) {
            aVariants[sVariantKey] = this.oVariantSet.getVariant(sVariantKey);
        }.bind(this));
        assert.deepEqual(aVariants, this.aVariantExp, "Entire variant is correct");
        this.oContainerVariantAdapter.deleteVariantSet(sVariantSetKey);
        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was deleted");
    });

    QUnit.test("Variant Set: save and simulate browser reload 2", async function (assert) {
        var sVariantSetKey = "VARIANT_SET_KEY_1137";

        // add variant set
        if (this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey)) {
            this.oContainerVariantAdapter.deleteVariantSet(sVariantSetKey);
        }

        var oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVariantSetKey);
        // add variant V1
        var oVariant = oVariantSet.addVariant("V1");
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
        await this.oContainer.save();
        // tabula rasa
        delete this.oContainer;
        this.oService._oContainerMap.remove(sContainer);
        // new container
        const oContainer = await this.oService.getContainer(sContainer);
        var aVariants = [];

        this.oContainer = oContainer;
        oVariantSet = this.oContainerVariantAdapter.getVariantSet(sVariantSetKey);
        oVariant = oVariantSet.addVariant("V3");
        oVariant.setItemValue("I1", {
            Val1: "value 111",
            Val2: "value 123"
        });
        oVariant.setItemValue("I2", {
            Filter1: "489",
            Filter2: "90000"
        });
        var sVariantKey = oVariantSet.getVariantKeyByName("V2");
        oVariantSet.deleteVariant(sVariantKey);
        sVariantKey = oVariantSet.getVariantKeyByName("V1");
        oVariantSet.deleteVariant(sVariantKey);
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
        var aVariantKeys = oVariantSet.getVariantKeys();
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
        this.oContainerVariantAdapter.deleteVariantSet(sVariantSetKey);
    });

    //  ............................................................................
    //
    //               Container Version 1
    //
    //  ............................................................................

    QUnit.module("Personalization: Container V1", {
        beforeEach: async function () {
            personalizationTestUtils.mockGetService();

            this.PersonalizationAdapterMock = personalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock);

            this.oAdapter = new this.PersonalizationAdapterMock();
            this.oService = new Personalization(this.oAdapter);

            this.oContainer = await this.oService.getContainer(sContainer);
            this.oContainerVariantAdapter = new Personalization.VariantSetAdapter(this.oContainer);
        },
        afterEach: async function () {
            await this.oService.deleteContainer(sContainer);

            personalizationTestUtils.restoreGetService();
            delete this.oContainer;
            delete this.oContainerVariantAdapter;
            delete this.oService;
            delete this.oAdapter;
            sandbox.restore();
        }
    });

    // ........... Container Item Tests ...........

    QUnit.test("Items: set, get and delete item", function (assert) {
        var sItemKey = "ITEM_501";

        assert.equal(false, this.oContainer.containsItem(sItemKey), "ITEM_0815 is not existing");
        this.oContainer.setItemValue(sItemKey, this.oItemValue);
        assert.equal(true, this.oContainer.containsItem(sItemKey), "ITEM_0815 exists after setItemValue");
        var oItemValueRead = this.oContainer.getItemValue(sItemKey);
        assert.deepEqual(this.oItemValue, oItemValueRead, "getItemValue returns the correct value for ITEM_0815");
        assert.equal(true, this.oContainer.containsItem(sItemKey), "containsItem returned true correctly for ITEM_0815");
        this.oContainer.deleteItem(sItemKey);
        assert.equal(null, this.oContainer.getItemValue(sItemKey), "Item was deleted, getItemValue returned null");
        assert.equal(false, this.oContainer.containsItem(sItemKey), "containsItem returned false correctly");
    });

    QUnit.test("Items: set, get and delete item, check difficult key names", function (assert) {
        var sItemKey = "hasOwnProperty";

        this.oContainer.deleteItem(sItemKey);
        assert.equal(false, this.oContainer.containsItem(sItemKey), "hasOwnProperty is not existing");
        this.oContainer.setItemValue(sItemKey, this.oItemValue);
        assert.equal(true, this.oContainer.containsItem(sItemKey), "hasOwnProperty exists after setItemValue");
        var oItemValueRead = this.oContainer.getItemValue(sItemKey);
        assert.deepEqual(this.oItemValue, oItemValueRead, "getItemValue returns the correct value for hasOwnProperty");
        assert.equal(true, this.oContainer.containsItem(sItemKey), "containsItem returned true correctly for hasOwnProperty");
        this.oContainer.deleteItem(sItemKey);
        assert.equal(null, this.oContainer.getItemValue(sItemKey), "Item was deleted, getItemValue returned null");
        assert.equal(false, this.oContainer.containsItem(sItemKey), "containsItem returned false correctly");
    });

    QUnit.test("Items: add items with and with no prefix, read them", async function (assert) {
        let aActItemKeys = [];
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
        await this.oContainer.save();
        assert.ok(true, "Successful container save");
        await this.oContainer.load();
        assert.ok(true, "Successful container reload");
        // check if prefix was added to item1
        assert.equal(false, this.oContainer.containsItem("item1"), "Container contains 'item1'");
        this.oContainer.deleteItem("item1");
        this.oContainer.deleteItem("item2");
        this.oContainer.deleteItem("item3");
        assert.equal(this.oContainer.getItemKeys().length, 0, "All items are deleted");
    });

    QUnit.test("Items: Delete non-existent item", function (assert) {
        var sItemKey = "nonExistingItem";

        assert.ok(!this.oContainer.containsItem(sItemKey), "Item is not existing");
        try {
            this.oContainer.deleteItem(sItemKey);
            assert.ok(true, "Non-existent item was deleted without error");
        } catch (e) {
            assert.ok(false, "Error during deletion of non-existing item");
        }
    });

    QUnit.test("Items: Get value of non-existent item", function (assert) {
        var sItemKey = "nonExistingItem";

        assert.ok(!this.oContainer.containsItem(sItemKey), "Item is not existing");
        try {
            var oItemValue = this.oContainer.getItemValue(sItemKey);
            assert.ok(oItemValue === undefined, "Value of a non-existing item is undefined");
        } catch (e) {
            assert.ok(false, "Error during getItemValue of non-existing item");
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
            assert.deepEqual(aActVariantSetKeys[index], sVariantSetKey, "'" + sVariantSetKey + "' exists");
        });
        // delete
        aExpVariantSetKeys.forEach((sVariantSetKey) => {
            this.oContainerVariantAdapter.deleteVariantSet(sVariantSetKey);
        });
        // check deletion
        aExpVariantSetKeys.forEach((sVariantSetKey) => {
            assert.equal(false, this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey), "Container does not have variantSet '" + sVariantSetKey + "'");
        });
    });

    QUnit.test("Variant Set: Delete non-existent variant set", function (assert) {
        var sVariantSetKey = "nonExistingVariantSet";

        assert.ok(!this.oContainer.containsItem(sVariantSetKey), "Variant set is not existing");
        try {
            this.oContainerVariantAdapter.deleteVariantSet(sVariantSetKey);
            assert.ok(true, "Non-existent variant set was deleted without error");
        } catch (e) {
            assert.ok(false, "Error during deletion of non-existing variant set");
        }
    });

    QUnit.test("Variant Set: Get non-existent variant set", function (assert) {
        var sVariantSetKey = "nonExistingVariantSet";

        assert.ok(!this.oContainer.containsItem(sVariantSetKey), "Variant set is not existing");
        try {
            var oVariantSet = this.oContainerVariantAdapter.getVariantSet(sVariantSetKey);
            assert.ok(oVariantSet === undefined, "Non-existent variant set object is undefined");
        } catch (e) {
            assert.ok(false, "Error during getVariantSet for a non-existing variant set");
        }
    });

    QUnit.test("Variant Set: Add variant set that exists", function (assert) {
        var sVariantSetKey = "variantSetKey_682";
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

    QUnit.test("Container: add and delete variantSets/Items", async function (assert) {
        var sVariantSetKey = "VARIANT_SET_KEY_738";

        this.oContainer.setItemValue("itemKey1", "item1");
        this.oContainer.setItemValue("itemKey2", "item2");

        // add variant set
        if (this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey)) {
            this.oContainerVariantAdapter.deleteVariantSet(sVariantSetKey);
        }
        var oVariantSet = this.oContainerVariantAdapter.addVariantSet(sVariantSetKey);
        // add variant V1
        var oVariant = oVariantSet.addVariant("V1");
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
        await this.oContainer.save().catch(function () {
            assert.ok(false, "Save failed");
        });
        this.oContainer.deleteItem("itemKey2");
        this.oContainerVariantAdapter.deleteVariantSet(sVariantSetKey);
        this.oContainer.setItemValue("itemKey3", "item3");
        await this.oContainer.save();
        assert.ok(!this.oContainer.containsItem("itemKey2"), "itemKey2 was deleted");
        assert.ok(!this.oContainerVariantAdapter.containsVariantSet(sVariantSetKey),
            sVariantSetKey + " was deleted");
        assert.ok(this.oContainer.containsItem("itemKey3"), "itemKey3 was added");
    });

    QUnit.test("Container: Get container with non-string key", async function (assert) {
        try {
            await this.oService.getContainer(this.oService);
            assert.ok(false, "Error: Container with a non-string key was not prohibited");
        } catch (e) {
            assert.ok(true, "Non-string sContainerKey led to an exception");
        }
    });

    QUnit.test("Container: reload restores original data", async function (assert) {
        const oContainer = await this.oService.getContainer(sContainer);
        oContainer.setItemValue("key1", "item1");
        assert.equal(oContainer.getItemValue("key1"), "item1", "key1 added");
        await oContainer.save();
        assert.ok(true, "Data saved");
        assert.equal(oContainer.getItemValue("key1"), "item1", "key1 still there after save");
        oContainer.setItemValue("key1", "item2");
        assert.equal(oContainer.getItemValue("key1"), "item2", "key1 changed to item2 (no save)");
        await oContainer.load();
        assert.equal(oContainer.getItemValue("key1"), "item1", "key1 loaded with correct value 'item1'");
    });

    QUnit.test("Container: Error during load inside constructor", async function (assert) {
        var sContainerKey = "constructorErrorContainer";

        this.oAdapter.setErrorProvocation(sContainerKey);
        await this.oService.getContainer(sContainerKey).catch(function () {
            assert.ok(true, "Load of container failed");
        });
        this.oAdapter.resetErrorProvocation(sContainerKey);
        this.oService._oContainerMap.remove(sContainerPrefix + sContainerKey);
        await this.oService.deleteContainer(sContainerKey);
        assert.ok(true, "Deletion of container succeeded");
    });

    QUnit.test("Container: Error during save", async function (assert) {
        var sContainerKey = "saveErrorContainer";

        const oContainer = await this.oService.getContainer(sContainerKey);
        assert.ok(true, "Load of container succeeded");
        this.oAdapter.setErrorProvocation(sContainerKey);
        await oContainer.save().catch(function () {
            assert.ok(true, "Save of container failed");
        });
        this.oAdapter.resetErrorProvocation(sContainerKey);
    });

    QUnit.test("Container: Error during deletion", async function (assert) {
        var sContainerKey = "deletionErrorContainer";

        await this.oService.getContainer(sContainerKey);
        assert.ok(true, "Load of container succeeded");
        this.oAdapter.setErrorProvocation(sContainerKey);

        await this.oService.deleteContainer(sContainerKey).catch(function () {
            assert.ok(true, "Deletion of container failed");
        });
        this.oAdapter.resetErrorProvocation(sContainerKey);
    });

    QUnit.test("Container: Mix of container and personalizer", async function (assert) {
        // Personalizer does reuse of the container
        var sItemValue = "mixItem";

        const oPersId = {
            container: sContainer,
            item: sItemValue
        };
        const oPersonalizer = await this.oService.getPersonalizer(oPersId);
        const oItemValue = {
            part1: "Part 1",
            part2: "Part 2"
        };
        let oReadItemValue = await oPersonalizer.setPersData(oItemValue);
        const oContainer = await oPersonalizer._getContainer(oPersId.container);
        assert.ok(oContainer instanceof Personalization.ContextContainer, "Context container is used");
        oReadItemValue = oContainer.getItemValue(sItemValue);
        assert.deepEqual(oReadItemValue, oItemValue, "Value read from container is the one written via personalizer");
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
            sandbox.restore();
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
        var oCPreparation = new Personalization.WindowAdapterContainer("ContainerKey", { validity: 10080 }, undefined, Personalization.WindowAdapter);
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
        var oMockContainer = new AdapterContainerMock("ContainerKey");
        sandbox.spy(oMockContainer, "setItemValue");

        //Class under test
        var oCut = new Personalization.WindowAdapterContainer("ContainerKey", { validity: 10080 }, oMockContainer, Personalization.WindowAdapter);
        assert.equal(oCut.getItemValue("itemKey1"), undefined, "itemKey1 is not in container yet");
        assert.equal(oMockContainer.getItemValue("itemKey1"), undefined, "itemKey1 is not in mockContainer yet");

        //expected data is loaded from the window and copied to the mock adapter container
        oCut.load();
        assert.ok(oMockContainer.setItemValue.calledThrice, "Items were found in the window object and successfully copied to the backend adapter");
        assert.equal(oCut.getItemValue("itemKey1"), "itemValue1", "itemKey1 is in container");
        assert.equal(oMockContainer.getItemValue("itemKey1"), "itemValue1", "itemKey1 is in mockContainer");
    });

    QUnit.test("load second scenario - not found in window cache", function (assert) {
        //Backend Container
        var oMockContainer = new AdapterContainerMock("ContainerKey");

        //Create temporary window functionality
        Personalization.WindowAdapter.prototype.data = {};

        //WindowAdapterContainer
        var oCut = new Personalization.WindowAdapterContainer("ContainerKey", undefined, oMockContainer, Personalization.WindowAdapter);

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
    });

    QUnit.test("save", function (assert) {
        var oMockContainer = new AdapterContainerMock("ContainerKey");
        var oCut = new Personalization.WindowAdapterContainer("ContainerKey", undefined, oMockContainer, Personalization.WindowAdapter);
        sandbox.spy(oMockContainer, "save");
        oCut.save();
        assert.ok(oMockContainer.save.called, "save was called on the backend container");
    });

    QUnit.test("setItemValue", function (assert) {
        var sItemKey = "mixItem";
        var oMockContainer = new AdapterContainerMock("ContainerKey");
        sandbox.spy(oMockContainer, "setItemValue");
        var oCut = new Personalization.WindowAdapterContainer("ContainerKey", undefined, oMockContainer, Personalization.WindowAdapter);
        oCut.setItemValue(sItemKey, "v1");
        assert.ok(oMockContainer.setItemValue.calledWith(sItemKey, "v1"), " data set on mock too");
        assert.equal(oCut.getItemValue(sItemKey), "v1", "value can be read again");
    });

    QUnit.test("deleteItem", function (assert) {
        var sItemKey = "mixItem";
        //prepare
        var oMockContainer = new AdapterContainerMock("ContainerKey");
        sandbox.spy(oMockContainer, "delItem");
        var oCut = new Personalization.WindowAdapterContainer("ContainerKey", undefined, oMockContainer, Personalization.WindowAdapter);
        oCut.setItemValue(sItemKey, "v1");
        // method under test
        oCut.delItem(sItemKey, "v1");
        // checks
        assert.ok(oMockContainer.delItem.calledWith(sItemKey), " data deleted on mock too");
        assert.equal(oCut.getItemValue(sItemKey), undefined, "value can be read again");
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
            sandbox.restore();
        }
    });

    QUnit.test("_adjustScope - correction of a wrong defined scope", function (assert) {
        //oActualScope should simulate wrong data
        var oActualScope = {
            validity: "60", //wrong datatype-> has to be numeric
            keyCategory: KeyCategory.FIXED_KEY, //correct
            writeFrequency: "non existing value", //wrong constant
            clientStorageAllowed: undefined //has to be filled with default value
        };
        var oExpectedScope = {
            validity: Infinity,
            keyCategory: KeyCategory.FIXED_KEY,
            writeFrequency: WriteFrequency.HIGH,
            clientStorageAllowed: false
        };

        assert.deepEqual(Personalization.prototype._adjustScope(oActualScope), oExpectedScope, "Scope has been rectified correctly.");
    });

    //  ............................................................................

    QUnit.module("unit tests for the Personalization: Key Generation Function");

    QUnit.test("When a key is generated", async function (assert) {
        var service = new Personalization(undefined);
        const first = await service.getGeneratedKey();
        const second = await service.getGeneratedKey();
        assert.ok(typeof first === "string", "then the key is of type string");
        assert.equal(first.length, 40, "then the key has length 40");
        assert.ok(/^[A-Z0-9]{40}$/.test(first), "then the key consists only of capital letters or numbers");
        assert.ok(first !== second, "then the second key and the first one differ");
    });

    QUnit.test("Generated Keys are suitably random in every position 1 to 40", async function (assert) {
        var service = new Personalization(undefined);
        var sChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var iCharLen = sChars.length;
        var iSampleSize = 10000;

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
            var sRandomKey = await service.getGeneratedKey();
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

        assert.equal(iGeneratedRandomKeysCollisionCount, 0, "there were 0 collisions over a sample of " + iSampleSize + " random keys");

        assert.strictEqual(iUnusedCharCount, 0, "there were no unused characters from '" + sChars + "' in a sample of " + iSampleSize + " random keys");
    });

    //  ............................................................................
    //
    //             Service only tests
    //
    //  ............................................................................

    QUnit.module("Personalization (createEmptyContainer / getContainer): service only tests", {
        beforeEach: function () {
            personalizationTestUtils.mockGetService();

            this.PersonalizationAdapterMock = personalizationTestUtils.createPersonalizationAdapterMock(AdapterContainerMock);

            var oAdapter = new this.PersonalizationAdapterMock();
            this.oService = new Personalization(oAdapter);
            return this.oService.deleteContainer("ACONTAINER");
        },
        afterEach: function () {
            delete this.oService;

            personalizationTestUtils.restoreGetService();
            sandbox.restore();
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
            .then(function () {
                assert.equal(oAdapter.getAdapterContainer.calledOnce, true, "getAdapterContainer called once");
                assert.equal(oFakeContainer.load.calledOnce, false, "load called once ");
            })
            .catch(function () {
                assert.ok(false, "expected done");
            })
            .finally(function () {
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
            .then(function () {
                assert.equal(oFakeContainer.load.calledOnce, true, "load called once ");
                assert.equal(oAdapter.getAdapterContainer.calledOnce, true, "getAdapterContainer called once");
            })
            .catch(function () {
                assert.ok(false, "expected done");
            });
    });
});
