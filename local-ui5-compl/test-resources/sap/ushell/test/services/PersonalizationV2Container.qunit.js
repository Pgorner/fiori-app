// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.PersonalizationV2
 * This is a 2nd test suite for a new version of the Personalization suite functionality,
 * Note that this uses getContainer / deleteContainer interface(!) which returns objects with a different semantic (!)
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/util/ObjectPath",
    "sap/ui/core/format/DateFormat",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/utils",
    "sap/ushell/services/PersonalizationV2",
    "sap/ushell/services/PersonalizationV2/VariantSetAdapter",
    "sap/ushell/services/PersonalizationV2/Variant"
], function (
    Log,
    ObjectPath,
    DateFormat,
    jQuery,
    utils,
    Personalization,
    VariantSetAdapter,
    Variant
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    ObjectPath.create("PersonalizationMockAdapter");

    var sCONTAINERPREFIX = "sap.ushell.personalization";
    const sCONTAINER = "sap.ushell.test.personalization";
    const sABAPTIMESTAMPFORMAT = "yyyyMMddHHmmss";

    //  ............................................................................
    //
    //             Service only tests
    //
    //  ............................................................................

    QUnit.module("sap.ushell.services.PersonalizationV2 (new): service only tests", {
        beforeEach: function () {
            this.oAdapter = {};
            this.oService = new Personalization(this.oAdapter);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    //  ............................................................................
    //
    //               Service + Mock Adapter tests
    //
    //  ............................................................................

    [
        { validity: 0, hasValiditypersistence: false },
        { validity: 30, hasValiditypersistence: true },
        { validity: Infinity, hasValiditypersistence: false }
    ].forEach(function (oFixture) {
        QUnit.module("sap.ushell.services.PersonalizationV2  ( " + oFixture.validity + "): service + mockAdapter tests", {
            beforeEach: async function () {
                var oSystem = {};
                this.oAdapter = new PersonalizationMockAdapter(oSystem);
                this.oService = new Personalization(this.oAdapter);
                this.oContainer = await this.oService.getContainer(sCONTAINER, { validity: oFixture.validity });
                this.oContainerVSAdapter = new VariantSetAdapter(this.oContainer);
            },
            afterEach: async function () {
                sandbox.restore();
                await this.oService.deleteContainer(sCONTAINER, { validity: oFixture.validity });
                await this.oService.deleteContainer(sCONTAINER + "2nd", { validity: oFixture.validity });
            }
        });

        QUnit.test("AppContainer ( " + oFixture.validity + "): get (new) + save + get + validity expired = clear faked clock!", async function (assert) {
            var oService = this.oService;
            var sItemKey = "ItemKey";
            var sContainerKey = sCONTAINER + "2nd";
            const oContainer = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
            this.oItemValue = { v1: "false" };
            oContainer.setItemValue(sItemKey, this.oItemValue);
            assert.ok(true, "Personalization data was set");
            // simulate the clock!
            this.theFakeTime = new Date("Jan 2 2013 01:50");
            var oClock = sinon.useFakeTimers({
                now: this.theFakeTime.getTime(),
                shouldAdvanceTime: true
            });

            var fmt = DateFormat.getDateInstance({ pattern: sABAPTIMESTAMPFORMAT });
            this.thetime = fmt.format(this.theFakeTime, true);
            this.theExpireTime = fmt.format(new Date(this.theFakeTime.getTime() + oFixture.validity * 60000), true);
            await oContainer.save();

            oClock.restore();
            this.theFakeTime = new Date("Jan 2 2013 01:55");
            oClock = sinon.useFakeTimers({
                now: this.theFakeTime.getTime(),
                shouldAdvanceTime: true
            });

            // obtain the (existing) Container (again)
            const oContainer2 = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
            assert.ok(true, "Personalization data was gotten");
            assert.deepEqual(oContainer2.getItemValue(sItemKey).v1, "false", "value present!");
            assert.deepEqual(oContainer2.getItemKeys(), ["ItemKey"], "expired!");
            var oReadValue2 = oContainer2._getItemValueInternal("ADMIN#", "sap-ushell-container-scope");
            var oReadValueSTO = oContainer2._getItemValueInternal("ADMIN#", "sap-ushell-container-storageUTCTimestamp");
            var oReadValueEXP = oContainer2._getItemValueInternal("ADMIN#", "sap-ushell-container-expireUTCTimestamp");
            if (oFixture.hasValiditypersistence) {
                assert.deepEqual(oReadValue2.validity, oFixture.validity, "scope variable set;");
                assert.deepEqual(oReadValueSTO, this.thetime, "storage set;");
                assert.deepEqual(oReadValueEXP, this.theExpireTime, "expire set;");
            } else {
                assert.deepEqual(oReadValueSTO, undefined, "storage not set;");
                assert.deepEqual(oReadValueEXP, undefined, "expire not set;");
            }

            oClock.restore();
            this.theFakeTime = new Date("Jan 2 2013 04:55");
            oClock = sinon.useFakeTimers({
                now: this.theFakeTime.getTime(),
                shouldAdvanceTime: true
            });

            const oContainer3 = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
            if (oFixture.hasValiditypersistence) {
                assert.deepEqual(oContainer3.getItemKeys(), [], "expired!");
                assert.deepEqual(oContainer3.getItemValue(sItemKey), undefined, "expired!");
            } else {
                assert.deepEqual(oContainer3.getItemValue(sItemKey).v1, "false", "value present!");
            }
        });
    });

    [
        { validity: 0, hasValiditypersistence: false },
        { validity: 30, hasValiditypersistence: true },
        { validity: Infinity, hasValiditypersistence: false }
    ].forEach(function (oFixture) {
        QUnit.module("sap.ushell.services.PersonalizationV2  ( " + oFixture.validity + "): service + mockAdapter tests", {
            beforeEach: async function () {
                var oSystem = {};

                this.oAdapter = new PersonalizationMockAdapter(oSystem);
                this.oService = new Personalization(this.oAdapter);
                this.oContainer = await this.oService.getContainer(sCONTAINER, { validity: oFixture.validity });
                this.oContainerVSAdapter = new VariantSetAdapter(this.oContainer);
            },
            afterEach: async function () {
                sandbox.restore();
                await this.oService.deleteContainer(sCONTAINER, { validity: oFixture.validity });
                await this.oService.deleteContainer(sCONTAINER + "2nd", { validity: oFixture.validity });
            }
        });

        QUnit.test("AppContainer ( " + oFixture.validity + "): get  setItem length warnings", async function (assert) {
            var oService = this.oService;
            var sContainerKey = "AveryLongContainerKeyMoreThan40CharsWithT";
            sandbox.spy(Log, "error");
            const oContainer = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
            assert.deepEqual(Log.error.getCall(0).args[0], "Personalization Service container key (\"AveryLongContainerKeyMoreThan40CharsWithT\") should be less than 40 characters [current :41]");
            this.oItemValue = { v1: "false" };
            oContainer.setItemValue(sContainerKey, this.oItemValue);
            assert.deepEqual(Log.error.getCall(1).args[0],
                "Personalization Service item key/variant set name (\"AveryLongContainerKeyMoreThan40CharsWithT\") should be less than 40 characters [current :41]");
            assert.ok(true, "Personalization data was set");
        });

        QUnit.test("AppContainer ( " + oFixture.validity + "): get  setItem length 40 no warnings", async function (assert) {
            var oService = this.oService;
            var sContainerKey = "AveryLongContainerKeyMoreThan40CharsWith";
            sandbox.spy(Log, "error");
            const oContainer = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
            assert.deepEqual(Log.error.getCall(0), null);
            this.oItemValue = { v1: "false" };
            oContainer.setItemValue(sContainerKey, this.oItemValue);
            assert.deepEqual(Log.error.getCall(0), null);
            assert.ok(true, "Personalization data was set");
        });

        QUnit.test("AppContainer ( " + oFixture.validity + "): get (new) + save + get + delete", async function (assert) {
            var oService = this.oService;
            var sItemKey = "ItemKey";
            var sContainerKey = sCONTAINER + "2nd";

            const oContainer = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
            this.oItemValue = { v1: "false" };
            oContainer.setItemValue(sItemKey, this.oItemValue);
            // not serialized !!!!
            this.oItemValue.v2 = "true";
            var oReadValue = oContainer.getItemValue(sItemKey);
            assert.deepEqual(oReadValue, { v1: "false" }, "Read value is the value at time of set");
            assert.ok(oReadValue !== this.oItemValue, "distinct object from set returned in get");
            var oReadValue2 = oContainer.getItemValue(sItemKey);
            assert.ok(oReadValue2 !== oReadValue, "distinct object returned in get");
            assert.ok(true, "Personalization data was set");

            await oContainer.save();
            // obtain the (existing) Container (again)
            const oContainer2 = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
            assert.ok(true, "Personalization data was gotten");
            oReadValue = oContainer2.getItemValue(sItemKey);
            assert.deepEqual(oReadValue, { v1: "false" }, "Read value is the saved value");
            oReadValue.v3 = "1111";
            oReadValue2 = oContainer2.getItemValue(sItemKey);
            assert.deepEqual(oReadValue2.v3, undefined, "Read value is not a live object;");
            assert.ok(oReadValue !== oReadValue2, "Same object ! the live written value");

            await oService.deleteContainer(sContainerKey, { validity: oFixture.validity });
            const oContainer3 = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
            oReadValue = oContainer3.getItemValue(sItemKey);
            assert.ok(true, "Personalization data was deleted");
            assert.equal(oReadValue, undefined, "Personalization data was deleted - value is undefined");
        });

        QUnit.test("AppContainer ( " + oFixture.validity + "): get (new) + save + get + validity set?", async function (assert) {
            var oService = this.oService;
            var sItemKey = "ItemKey";
            var sContainerKey = sCONTAINER + "2nd";
            const oContainer = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
            this.oItemValue = { v1: "false" };
            oContainer.setItemValue(sItemKey, this.oItemValue);
            assert.ok(true, "Personalization data was set");
            var fmt = DateFormat.getDateInstance({ pattern: sABAPTIMESTAMPFORMAT });
            this.rawTime = new Date();
            this.thetime = fmt.format(this.rawTime, true);
            this.theExpireTime = fmt.format(new Date(this.rawTime.getTime() + oFixture.validity * 60000), true);
            await oContainer.save();
            var oReadValue2 = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-scope");
            var oReadValueSTO = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-storageUTCTimestamp");
            var oReadValueEXP = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-expireUTCTimestamp");
            if (oFixture.hasValiditypersistence) {
                assert.deepEqual(oReadValue2.validity, oFixture.validity, "scope variable set;");
                var delta = parseInt(oReadValueSTO, 10) - parseInt(this.thetime, 10);
                assert.ok(delta <= 2 && delta >= -2, "storage set;" + oReadValueSTO + "=?=" + this.thetime);
                delta = parseInt(oReadValueEXP, 10) - parseInt(this.theExpireTime, 10);
                assert.ok(delta <= 2 && delta >= -2, "expire set;" + oReadValueEXP + "=?=" + this.theExpireTime);
            } else {
                assert.deepEqual(oReadValueSTO, undefined, "storage not set;");
                assert.deepEqual(oReadValueEXP, undefined, "expire not set;");
            }
            // obtain the (existing) Container (again)
            const oContainer2 = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
            assert.ok(true, "Personalization data was gotten");
            oReadValueSTO = oContainer2._getItemValueInternal("ADMIN#", "sap-ushell-container-storageUTCTimestamp");
            oReadValueEXP = oContainer2._getItemValueInternal("ADMIN#", "sap-ushell-container-expireUTCTimestamp");
            if (oFixture.hasValiditypersistence) {
                assert.deepEqual(oReadValueSTO, this.thetime, "storage set;");
                assert.deepEqual(oReadValueEXP, this.theExpireTime, "expire set;");
            } else {
                assert.deepEqual(oReadValueSTO, undefined, "storage not set;");
                assert.deepEqual(oReadValueEXP, undefined, "expire not set;");
            }
        });

        QUnit.test("AppContainer ( " + oFixture.validity + "): get (new) + nosave,  get + delete", async function (assert) {
            var oService = this.oService;
            var sItemKey = "ItemKey";
            var sContainerKey = sCONTAINER + "2nd";

            const oContainer = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
            this.oItemValue = { v1: "false" };
            oContainer.setItemValue(sItemKey, this.oItemValue);
            // not serialized !!!!
            this.oItemValue.v2 = "true";
            var oReadValue = oContainer.getItemValue(sItemKey);
            assert.deepEqual(oReadValue, { v1: "false" }, "Read value is the value at time of set");
            assert.ok(oReadValue !== this.oItemValue, "distinct object from set returned in get");
            var oReadValue2 = oContainer.getItemValue(sItemKey);
            assert.ok(oReadValue2 !== oReadValue, "distinct object returned in get");
            assert.ok(true, "Personalization data was set");
            // obtain the (existing) Container (again)
            const oContainer2 = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
            assert.ok(true, "Personalization data was gotten");
            oReadValue = oContainer2.getItemValue(sItemKey);
            assert.deepEqual(oReadValue, undefined, "not saved value is initial");
            await oService.deleteContainer(sContainerKey, { validity: oFixture.validity });
            const oContainer3 = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
            oReadValue = oContainer3.getItemValue(sItemKey);
            assert.ok(true, "Personalization data was deleted");
            assert.equal(oReadValue, undefined, "Personalization data was deleted - value is undefined");
        });

        QUnit.test("AppContainer ( " + oFixture.validity + "): get save, create (empty)!", async function (assert) {
            var oService = this.oService;
            var sItemKey = "ItemKey";
            var sContainerKey = sCONTAINER + "2nd";

            const oContainer = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
            this.oItemValue = { v1: false };
            oContainer.setItemValue(sItemKey, this.oItemValue);
            oContainer.setItemValue("Stale", this.oItemValue);
            // not serialized !!!!
            this.oItemValue.v2 = "true";
            oContainer.getItemValue(sItemKey);
            assert.ok(true, "Personalization data was set");
            // save
            await oContainer.save();
            assert.ok(true, "Personalization data was gotten");
            var oReadValue = oContainer.getItemValue(sItemKey);
            assert.deepEqual(oReadValue, { v1: false }, "not saved value is initial");
            const oContainer2 = await oService.createEmptyContainer(sContainerKey, { validity: oFixture.validity });
            oReadValue = oContainer2.getItemValue(sItemKey);
            assert.ok(true, "Personalization data was deleted");
            assert.equal(oReadValue, undefined, "Personalization data was deleted - value is undefined");
            assert.equal(oContainer2.getItemKeys().length, 0, "Personalization data was deleted - value is undefined");
            oContainer2.setItemValue(sItemKey, { v333: true });
            await oContainer2.save();
            const oContainer3 = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
            oReadValue = oContainer3.getItemValue("Stale");
            assert.equal(oReadValue, undefined, "Personalization data was cleared - value is undefined");
            oReadValue = oContainer3.getItemValue(sItemKey);
            assert.deepEqual(oReadValue, { v333: true }, " new value set after");
        });

        // ........... Container Item Tests ...........

        QUnit.test("AppContainer (" + oFixture.validity + ") - Items: set, get and delete undefined value (!) item", async function (assert) {
            var sItemKey = "ITEM_501";
            var oItemValue; // !!!
            // demonstrate that one can set / get undefined
            assert.equal(false, this.oContainer.containsItem(sItemKey), "ITEM_0815 is not exisiting");
            this.oContainer.setItemValue(sItemKey, oItemValue);
            assert.equal(true, this.oContainer.containsItem(sItemKey), "ITEM_0815 exisits after setItemValue");
            var oItemValueRead = this.oContainer.getItemValue(sItemKey);
            assert.deepEqual(oItemValue, oItemValueRead, "getItemValue returns the correct value for ITEM_0815");
            // does not hold ok(oItemValue !== oItemValueRead, "distinct objects");
            assert.equal(true, this.oContainer.containsItem(sItemKey), "containsItem returned true correctly for ITEM_0815");
            this.oContainer.deleteItem(sItemKey);
            assert.equal(typeof this.oContainer.getItemValue(sItemKey), "undefined", "Item was deleted, getItemValue returned null");
            assert.equal(false, this.oContainer.containsItem(sItemKey), "containsItem returned false correctly");
        });

        QUnit.test("AppContainer (" + oFixture.validity + ") - Items: set, get and delete null value (!) item", async function (assert) {
            var sItemKey = "ITEM_501";
            var oItemValue = null; // !!!
            // demonstrate that one can set / get undefined
            assert.equal(false, this.oContainer.containsItem(sItemKey), "ITEM_0815 is not exisiting");
            this.oContainer.setItemValue(sItemKey, oItemValue);
            assert.equal(true, this.oContainer.containsItem(sItemKey), "ITEM_0815 exisits after setItemValue");
            var oItemValueRead = this.oContainer.getItemValue(sItemKey);
            assert.deepEqual(oItemValue, oItemValueRead, "getItemValue returns the correct value for ITEM_0815");
            // does not hold ok(oItemValue !== oItemValueRead, "distinct objects");
            assert.equal(true, this.oContainer.containsItem(sItemKey), "containsItem returned true correctly for ITEM_0815");
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
            QUnit.test("AppContainer (" + JSON.stringify(oFixture) + "/" + JSON.stringify(oFixture) + ") - Items: set, get and delete value (!) item", async function (assert) {
                var sItemKey = "ITEM_501";
                var oItemValue = oFixture2;

                assert.equal(false, this.oContainer.containsItem(sItemKey), "ITEM_0815 is not exisiting");
                this.oContainer.setItemValue(sItemKey, oItemValue);
                assert.equal(true, this.oContainer.containsItem(sItemKey), "ITEM_0815 exisits after setItemValue");
                var oItemValueRead = this.oContainer.getItemValue(sItemKey);
                assert.deepEqual(oItemValue, oItemValueRead, "getItemValue returns the correct value for ITEM_0815");
                assert.ok(oItemValue !== oItemValueRead, "distinct objects");
                assert.equal(true, this.oContainer.containsItem(sItemKey), "containsItem returned true correctly for ITEM_0815");
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
            QUnit.test("AppContainer (" + JSON.stringify(oFixture) + ") - Items: set, get and delete mapped value item", async function (assert) {
                var sItemKey = "ITEM_501";
                var oItemValue = oFixture.obj;
                assert.equal(false, this.oContainer.containsItem(sItemKey), "ITEM_0815 is not exisiting");
                this.oContainer.setItemValue(sItemKey, oItemValue);
                assert.equal(true, this.oContainer.containsItem(sItemKey), "ITEM_0815 exisits after setItemValue");
                var oItemValueRead = this.oContainer.getItemValue(sItemKey);
                assert.deepEqual(oFixture.repr, oItemValueRead, "getItemValue returns the correct value for ITEM_0815");
                assert.equal(true, this.oContainer.containsItem(sItemKey), "containsItem returned true correctly for ITEM_0815");
                this.oContainer.deleteItem(sItemKey);
                assert.ok(this.oContainer.getItemValue(sItemKey) === undefined, "Item was deleted, getItemValue returned null");
                assert.equal(false, this.oContainer.containsItem(sItemKey), "containsItem returned false correctly");
            });
        });

        QUnit.test("AppContainer (" + oFixture.validity + ") - Items: set, get and delete recursive item", async function (assert) {
            var sItemKey = "ITEM_501";
            var oItemValue = { a: 1, b: "x" };
            // create circular object
            oItemValue.nested = oItemValue;
            // nested structures are silently converted to undefined
            assert.equal(false, this.oContainer.containsItem(sItemKey), "ITEM_0815 is not exisiting");
            this.oContainer.setItemValue(sItemKey, "legal");
            try {
                this.oContainer.setItemValue(sItemKey, oItemValue);
                assert.ok(false, "no exception");
            } catch (e) {
                assert.ok(true, "had exception");
            }
            assert.equal(true, this.oContainer.containsItem(sItemKey), "ITEM_0815 exisits after setItemValue");
            var oItemValueRead = this.oContainer.getItemValue(sItemKey);
            assert.deepEqual(oItemValueRead, "legal", "getItemValue returns undefined for ITEM_0815");
        });

        QUnit.test("AppContainer (" + oFixture.validity + ") - Items: set, get and delete item, check difficult keynames", async function (assert) {
            var sItemKey = "hasOwnProperty";

            this.oContainer.deleteItem(sItemKey);
            assert.equal(false, this.oContainer.containsItem(sItemKey), "hasOwnProperty is not exisiting");
            this.oContainer.setItemValue(sItemKey, this.oItemValue);
            assert.equal(true, this.oContainer.containsItem(sItemKey), "hasOwnProperty exisits after setItemValue");
            var oItemValueRead = this.oContainer.getItemValue(sItemKey);
            assert.deepEqual(this.oItemValue, oItemValueRead, "getItemValue returns the correct value for hasOwnProperty");
            assert.equal(true, this.oContainer.containsItem(sItemKey), "containsItem returned true correctly for hasOwnProperty");
            this.oContainer.deleteItem(sItemKey);
            assert.equal(null, this.oContainer.getItemValue(sItemKey), "Item was deleted, getItemValue returned null");
            assert.equal(false, this.oContainer.containsItem(sItemKey), "containsItem returned false correctly");
        });

        QUnit.test("AppContainer (" + oFixture.validity + ") - Items: add items with and with no prefix, read them", async function (assert) {
            var oItemValue = {
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
            var aActItemKeys = this.oContainer.getItemKeys();
            assert.equal(aActItemKeys.length, 2, "Container has 3 items: '" + aActItemKeys + "'");
            assert.ok(true, "Internal item keys are: " + this.oContainer._oItemMap.keys() + "'");
            assert.equal(false, this.oContainer.containsItem("item1"), "'item1' is not detected by containsItem due to automatic prefixing!");
            await this.oContainer.save();
            assert.ok(true, "Successful container save");
            await this.oContainer.load();
            assert.ok(true, "Successful container relaod");
            // check if prefix was added to item1
            assert.equal(false, this.oContainer.containsItem("item1"), "Container contains 'item1'");
            this.oContainer.deleteItem("item1");
            this.oContainer.deleteItem("item2");
            this.oContainer.deleteItem("item3");
            assert.equal(this.oContainer.getItemKeys().length, 0, "All items are deleted");
        });

        QUnit.test("AppContainer (" + oFixture.validity + ") - Items: Delete non-existent item", async function (assert) {
            var sItemKey = "nonExistingItem";

            assert.ok(!this.oContainer.containsItem(sItemKey), "Item is not existing");
            try {
                this.oContainer.deleteItem(sItemKey);
                assert.ok(true, "Non-existent item was deleted without error");
            } catch (e) {
                assert.ok(false, "Error during deletion of non-existing item");
            }
        });

        QUnit.test("AppContainer (" + oFixture.validity + ")- Items: Get value of non-existent item", async function (assert) {
            var sItemKey = "nonExistingItem";

            assert.ok(!this.oContainer.containsItem(sItemKey), "Item is not existing");
            try {
                var oItemValue = this.oContainer.getItemValue(sItemKey);
                assert.ok(oItemValue === undefined, "Value of a non-existing item is undefined");
            } catch (e) {
                assert.ok(false, "Error during getItemvalue of non-existing item");
            }
        });

        // ........... Container Tests ...........

        QUnit.test("AppContainer (" + oFixture.validity + ") - Variant Set: add and delete variant sets", async function (assert) {
            var aExpVariantSetKeys = ["variantSet1", "variantSet2"];

            aExpVariantSetKeys.forEach((sVariantSetKey) => {
                this.oContainerVSAdapter.addVariantSet(sVariantSetKey, this.oItemValue);
            });
            // check variant sets
            var aActVariantSetKeys = this.oContainerVSAdapter.getVariantSetKeys();
            aExpVariantSetKeys.forEach((sVariantSetKey, index) => {
                assert.deepEqual(aActVariantSetKeys[index], sVariantSetKey, "'" + sVariantSetKey + "' exists");
            });
            // delete
            aExpVariantSetKeys.forEach((sVariantSetKey) => {
                this.oContainerVSAdapter.deleteVariantSet(sVariantSetKey);
            });
            // check deletion
            aExpVariantSetKeys.forEach((sVariantSetKey) => {
                assert.equal(false, this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Container does not have variantSet '" + sVariantSetKey + "'");
            });
        });

        QUnit.test("AppContainer (" + oFixture.validity + ") - Variant Set: Delete non-existent variant set", async function (assert) {
            var sVariantSetKey = "nonExistingVariantset";

            assert.ok(!this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set is not existing");
            try {
                this.oContainerVSAdapter.deleteVariantSet(sVariantSetKey);
                assert.ok(true, "Non-existent variant set was deleted without error");
            } catch (e) {
                assert.ok(false, "Error during deletion of non-existing variant set");
            }
        });

        QUnit.test("AppContainer (" + oFixture.validity + ") - Variant Set: Get non-existent variant set", async function (assert) {
            var sVariantSetKey = "nonExistingVariantset";

            assert.ok(!this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set is not existing");
            try {
                var oVariantSet = this.oContainerVSAdapter.getVariantSet(sVariantSetKey);
                assert.ok(oVariantSet === undefined, "Non-existent variant set object is undefined");
            } catch (e) {
                assert.ok(false, "Error during getVariantSet for a non-existing variant set");
            }
        });

        QUnit.test("AppContainer (" + oFixture.validity + ") - Variant Set: Add variant set that exists", async function (assert) {
            var sVariantSetKey = "variantSetKey_682";
            this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was added");
            try {
                this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
                assert.ok(false, "Existence of variant set was not detected");
            } catch (e) {
                assert.ok(true, "Existence of variant set was detected");
            }
        });

        QUnit.test("AppContainer (" + oFixture.validity + "): add items and variant sets, read them separately", async function (assert) {
            var oItemValue = {
                part1: "Part 1",
                part2: "Part 2"
            };
            var aExpItemKeys = ["item1", "item2", "item3"];
            var aExpVariantSetKeys = ["variantSet1", "variantSet2"];
            // add items
            aExpItemKeys.forEach((sItemKey) => {
                this.oContainer.setItemValue(sItemKey, oItemValue);
            });
            // add variant sets
            aExpVariantSetKeys.forEach((sVariantSetKey) => {
                this.oContainerVSAdapter.addVariantSet(sVariantSetKey, oItemValue);
            });
            // check items
            var aActItemKeys = this.oContainer.getItemKeys();
            var bOk = true;
            aExpItemKeys.forEach((sItemKey) => {
                if (aActItemKeys.indexOf(sItemKey) === -1) {
                    assert.ok(false, "Container does not contain item '" + sItemKey + "'");
                    bOk = false;
                }
            });
            if (bOk) { assert.ok(true, "Item keys are correct: " + aActItemKeys); }
            // check variant sets
            var aActVariantSetKeys = this.oContainerVSAdapter.getVariantSetKeys();
            bOk = true;
            aExpVariantSetKeys.forEach((sVariantSetKey) => {
                if (aActVariantSetKeys.indexOf(sVariantSetKey) === -1) {
                    assert.ok(false, "Container does not contain variant set '" + sVariantSetKey + "'");
                }
            });
            if (bOk) { assert.ok(true, "Variant set keys are correct: " + aActVariantSetKeys); }
        });

        QUnit.test("AppContainer (" + oFixture.validity + "): add and delete variantSets/Items", async function (assert) {
            var sVariantSetKey = "VARIANT_SET_KEY_738";

            this.oContainer.setItemValue("itemKey1", "item1");
            this.oContainer.setItemValue("itemKey2", "item2");

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
            this.oContainer.deleteItem("itemKey2");
            this.oContainerVSAdapter.deleteVariantSet(sVariantSetKey);
            this.oContainer.setItemValue("itemKey3", "item3");
            await this.oContainer.save();
            assert.ok(!this.oContainer.containsItem("itemKey2"), "itemKey2 was deleted");
            assert.ok(!this.oContainerVSAdapter.containsVariantSet(sVariantSetKey),
                sVariantSetKey + " was deleted");
            assert.ok(this.oContainer.containsItem("itemKey3"), "itemKey3 was added");
        });

        QUnit.test("AppContainer (" + oFixture.validity + "): Get container with non-string key", async function (assert) {
            try {
                await this.oService.getContainer(this.oService);
                assert.ok(false, "Error: Container with a non-string key was not prohibited");
            } catch (e) {
                assert.ok(true, "Non-string sContainerKey led to an exception");
            }
        });

        QUnit.test("AppContainer (" + oFixture.validity + "): reload restores original data", async function (assert) {
            const oContainer = await this.oService.getContainer(sCONTAINER, { validity: oFixture.validity });
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

        QUnit.test("AppContainer (" + oFixture.validity + "): Error during load inside constructor", async function (assert) {
            var sContainerKey = "constructorErrorContainer";
            if (oFixture.validity === 0) {
                assert.ok(true, " validity 0, adapter throws no errors, mock not relevant");
                return;
            }
            this.oAdapter.setErrorProvocation(sContainerKey);
            await this.oService.getContainer(sContainerKey, { validity: oFixture.validity }).catch(() => {
                assert.ok(true, "Load of container failed");
            });
            this.oAdapter.resetErrorProvocation(sContainerKey);
            this.oService._oContainerMap.remove(sCONTAINERPREFIX + sContainerKey);
            // dirty hack to get a new deferred object during the deletion
            await this.oService.deleteContainer(sContainerKey, { validity: oFixture.validity });
            assert.ok(true, "Deletion of container succeeded");
        });

        QUnit.test("AppContainer (" + oFixture.validity + "): Error during save", async function (assert) {
            var sContainerKey = "saveErrorContainer";
            if (oFixture.validity === 0) {
                assert.ok(true, " validity 0, adapter throws no errors, mock not relevant");
                return;
            }
            const oContainer = await this.oService.getContainer(sContainerKey, { validity: oFixture.validity });
            assert.ok(true, "Load of container succeeded");
            this.oAdapter.setErrorProvocation(sContainerKey);
            await oContainer.save().catch(() => {
                assert.ok(true, "Save of container failed");
            });
            this.oAdapter.resetErrorProvocation(sContainerKey);
        });

        QUnit.test("AppContainer (" + oFixture.validity + "): Error during deletion", async function (assert) {
            var sContainerKey = "deletionErrorContainer";
            if (oFixture.validity === 0) {
                assert.ok(true, " validity 0, adapter throws no errors, mock not relevant");
                return;
            }
            await this.oService.getContainer(sContainerKey, { validity: oFixture.validity });
            assert.ok(true, "Load of container succeeded");
            this.oAdapter.setErrorProvocation(sContainerKey);
            await this.oService.deleteContainer(sContainerKey, { validity: oFixture.validity }).catch(() => {
                assert.ok(true, "Deletion of container failed");
            });
            this.oAdapter.resetErrorProvocation(sContainerKey);
        });

        QUnit.test("AppContainer (" + oFixture.validity + "): check for container not a singleton", async function (assert) {
            var sContainerKey = "singletonContainer";

                const oContainer1 = await this.oService.getContainer(sContainerKey, { validity: oFixture.validity });
                assert.ok(true, "Load of container 1 succeeded");
                const oContainer2 = await this.oService.getContainer(sContainerKey, { validity: oFixture.validity });
                assert.ok(true, "Load of container 2 succeeded");
                assert.ok(oContainer1 !== oContainer2, "Container is not a singleton");
                oContainer1.setItemValue("once", "aValue");
                oContainer2.setItemValue("once", "anotherInstanceValue");
                assert.equal("aValue", oContainer1.getItemValue("once"), "Container is not a singleton, distinct storage");
                assert.equal("anotherInstanceValue", oContainer2.getItemValue("once"), "Container is not a singleton, distinct storage");
        });

        QUnit.test("AppContainer (" + oFixture.validity + "): Mix of container and personalizer", async function (assert) {
            // Personalizer does reuse of the container

            var sItemKey = "mixItem";
            var oItemValue = {
                part1: "Part 1",
                part2: "Part 2"
            };
            this.oContainer.setItemValue(sItemKey, oItemValue);
            assert.ok(this.oContainer.containsItem(sItemKey), sItemKey + " was added");
            var oPersId = {
                container: sCONTAINER,
                item: sItemKey
            };
            await this.oContainer.save();
            var oPersonalizer = await this.oService.getPersonalizer(oPersId);
            const oReadItemValue = await oPersonalizer.getPersData();
            assert.deepEqual(oReadItemValue, oItemValue, "Value read via personalizer is the one written in container");
        });

        // ........... Variant Set Tests ...........

        QUnit.test("AppContainerVariantSet (" + oFixture.validity + "): add and delete variant", async function (assert) {
            var sVariantSetKey = "VARIANT_SET_KEY_988";

            assert.equal(false, this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
            var oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            assert.equal(true, this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was added");
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
            this.oContainerVSAdapter.deleteVariantSet(sVariantSetKey);
            assert.equal(false, this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was deleted");
        });

        QUnit.test("AppContainerVariant (" + oFixture.validity + "): set variant name", async function (assert) {
            var sVariantSetKey = "VARIANT_SET_KEY_999";
            var sOriginalVariantName = "Original variant name";
            var sNewVariantName = "New variant name";
            var oItemValue = {
                part1: "Part 1",
                part2: "Part 2"
            };

            // -- prep
            assert.equal(false, this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
            var oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            assert.equal(true, this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was added");
            var oVariant1 = oVariantSet.addVariant(sOriginalVariantName);
            var sVariantKey = oVariant1.getVariantKey();
            assert.equal(true, oVariantSet.containsVariant(sVariantKey), "Variant '" + sVariantKey + "' was added");
            oVariant1.setItemValue("Item_1", oItemValue);

            // -- test
            oVariant1.setVariantName(sNewVariantName);

            // -- QUnit.assertions
            sVariantKey = oVariantSet.getVariantKeyByName(sNewVariantName);
            assert.equal(sVariantKey, oVariant1.getVariantKey(), "Variant set contains variant with new name '" + sNewVariantName + "'");

            var oVariant2 = oVariantSet.getVariant(sVariantKey);
            assert.deepEqual(oVariant2.getItemValue("Item_1"), oItemValue, "Renamed variant has same value for Item_1");

            oVariant2 = oVariantSet.getVariant(sVariantKey);
            assert.deepEqual(oVariant2.getItemValue("Item_1"), oItemValue, "Renamed variant has same value for Item_1 (after getVariant())");

            oVariantSet = this.oContainerVSAdapter.getVariantSet(sVariantSetKey);
            sVariantKey = oVariantSet.getVariantKeyByName(sNewVariantName);
            assert.equal(sVariantKey, oVariant1.getVariantKey(), "Variant set updated in container");
            oVariant2 = oVariantSet.getVariant(sVariantKey);
            assert.deepEqual(oVariant2.getItemValue("Item_1"), oItemValue, "Variant set data updated in container");

            // clean up
            // delete variant set
            this.oContainerVSAdapter.deleteVariantSet(sVariantSetKey);
        });

        QUnit.test("AppContainerVariant (" + oFixture.validity + "): set variant name - input validation", async function (assert) {
            var sVariantSetKey = "VARIANT_SET_KEY_999";
            var sOriginalVariantName = "Original variant name";

            // -- prep
            assert.equal(false, this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
            var oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            assert.equal(true, this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was added");
            var oVariant1 = oVariantSet.addVariant(sOriginalVariantName);
            var sVariantKey = oVariant1.getVariantKey();
            assert.equal(true, oVariantSet.containsVariant(sVariantKey), "Variant '" + sVariantKey + "' was added");

            // -- test
            // -- QUnit.assertions
            assert.throws(function () {
                oVariant1.setVariantName(0);
            }, /Parameter value of sVariantName is not a string/, "Exception raised if sVariantName not a string ");

            // clean up
            // delete variant set
            this.oContainerVSAdapter.deleteVariantSet(sVariantSetKey);
        });

        QUnit.test("AppContainerVariant (" + oFixture.validity + "): set variant name - variant does not exist in variant set", async function (assert) {
            var sVariantSetKey = "VARIANT_SET_KEY_999";
            var sOriginalVariantName = "Original variant name";
            var sNewVariantName = "New variant name";

            // -- prep
            assert.equal(false, this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
            var oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            assert.equal(true, this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was added");
            var oVariant1 = oVariantSet.addVariant(sOriginalVariantName);
            var sVariantKey = oVariant1.getVariantKey();
            oVariantSet.deleteVariant(sVariantKey);

            // -- test
            // -- QUnit.assertions
            assert.throws(function () {
                oVariant1.setVariantName(sNewVariantName);
            }, /Variant does not longer exist/, "Exception raised if variant does not exist anymore");

            // clean up
            // delete variant set
            this.oContainerVSAdapter.deleteVariantSet(sVariantSetKey);
        });

        QUnit.test("AppContainerVariant (" + oFixture.validity + "): set variant name - new variant already exists", async function (assert) {
            var sVariantSetKey = "VARIANT_SET_KEY_999";
            var sOriginalVariantName = "Original variant name";
            var sNewVariantName = "New variant name";

            // -- prep
            assert.equal(false, this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
            var oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            assert.equal(true, this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was added");
            var oVariant1 = oVariantSet.addVariant(sOriginalVariantName);
            oVariantSet.addVariant(sNewVariantName);

            // -- test
            // -- QUnit.assertions
            assert.throws(function () {
                oVariant1.setVariantName(sNewVariantName);
            }, /Variant with name 'New variant name' already exists in variant set/, "Exception raised if new variant already exists");

            // clean up
            // delete variant set
            this.oContainerVSAdapter.deleteVariantSet(sVariantSetKey);
        });

        QUnit.test("AppContainerVariantSet (" + oFixture.validity + "): add existing variant set", async function (assert) {
            var sVariantSetKey = "VARIANT_SET_KEY_1025";
            var sVariantName = "VARIANT_1026";

            assert.ok(!this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
            var oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
            assert.ok(!oVariantSet.getVariantKeyByName(sVariantName), "Variant with name '" + sVariantName + "' does not exist");
            oVariantSet.addVariant(sVariantName); // add it once
            try {
                oVariantSet.addVariant(sVariantName); // add it twice
                assert.ok(false, "Error: adding the same named variant twice was not detected");
            } catch (e) {
                assert.ok(true, "Exception for adding the same variant twice is correct");
            }
        });

        QUnit.test("AppContainerVariantSet (" + oFixture.validity + "): set current variant and check", async function (assert) {
            this.aVariantExp = [];
            this.oVariantNameAndKeysExp = {};
            var sVariantSetKey = "VARIANT_SET_KEY_1027";

            if (this.oContainerVSAdapter.containsVariantSet(sVariantSetKey)) {
                this.oContainerVSAdapter.deleteVariantSet(sVariantSetKey);
            }

            var oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            var oVariant = oVariantSet.addVariant("V1");
            oVariant.setItemValue("item", this.oItemValue);
            var sVariantKeyExp = oVariant.getVariantKey();
            oVariantSet.setCurrentVariantKey(sVariantKeyExp);

            assert.deepEqual(oVariantSet.getCurrentVariantKey(), sVariantKeyExp, "currentVariantKey was set correctly");
        });

        QUnit.test("AppContainerVariantSet (" + oFixture.validity + "): delete non-existent variant", async function (assert) {
            var sVariantSetKey = "VARIANT_SET_KEY_1050";
            var sVariantKey = "1051";

            assert.ok(!this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
            var oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
            assert.ok(!oVariantSet.containsVariant(sVariantKey), "Variant '" + sVariantKey + "' does not exist");
            try {
                oVariantSet.deleteVariant(sVariantKey);
                assert.ok(true, "Non-existing variant was deleted without error/exception");
            } catch (e) {
                assert.ok(false, "Error: Exception during deletion of a non-existing variant");
            }
        });

        QUnit.test("AppContainerVariantSet (" + oFixture.validity + "): get non-existent variant", async function (assert) {
            var sVariantSetKey = "VARIANT_SET_KEY_1070";
            var sVariantKey = "1071";

            assert.ok(!this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
            var oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
            assert.ok(!oVariantSet.containsVariant(sVariantKey), "Variant '" + sVariantKey + "' does not exist");
            try {
                var oVariant = oVariantSet.getVariant(sVariantKey);
                assert.ok(oVariant === undefined, "getVariant returns undefined for a non-existing variant");
            } catch (e) {
                assert.ok(false, "Error: Exception during getVariant for a non-existing variant");
            }
        });

        QUnit.test("AppContainerVariantSet (" + oFixture.validity + "): add variant with an exotic name", async function (assert) {
            var sVariantSetKey = "VARIANT_SET_KEY_1091";
            var sVariantName = "未经";

            assert.ok(!this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
            var oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
            assert.ok(!oVariantSet.getVariantKeyByName(sVariantName), "Variant with name '" + sVariantName + "' does not exist");
            try {
                var oVariant = oVariantSet.addVariant(sVariantName);
                assert.ok(oVariant instanceof Variant, "addVariant returns a variant object");
            } catch (e) {
                assert.ok(false, "Error: Exception during addVariant");
            }
        });

        QUnit.test("AppContainerVariantSet (" + oFixture.validity + "): add variant to a big max key variant set", async function (assert) {
            var sVariantSetKey = "VARIANT_SET_KEY_1112";
            var sVariantName1 = "VARIANT_1113";
            var sVariantKey1 = "999999";
            var sVariantName2 = "VARIANT_1115";

            assert.ok(!this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
            var oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
            assert.ok(!oVariantSet.containsVariant(sVariantKey1), "Variant with key '" + sVariantKey1 + "' does not exist");
            // add variant manually
            oVariantSet._oVariantSetData.variants[sVariantKey1] = { name: sVariantName1, variantData: {} };
            assert.ok(oVariantSet.containsVariant(sVariantKey1), "Variant with key '" + sVariantKey1 + "' and name '" + sVariantName1 + "' was added");
            var oVariant2 = oVariantSet.addVariant(sVariantName2);
            assert.ok(parseInt(oVariant2.getVariantKey(), 10) === parseInt(sVariantKey1, 10) + 1, "variant key was increased correctly");
        });

        QUnit.test("AppContainerVariantSet (" + oFixture.validity + "): getVariantKeyByName standard", async function (assert) {
            var sVariantSetKey = "VARIANT_SET_KEY_1138";
            var sVariantName = "VARIANT_1139";

            assert.ok(!this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
            var oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
            var oVariant = oVariantSet.addVariant(sVariantName);
            assert.equal(oVariantSet.getVariantKeyByName(sVariantName), oVariant.getVariantKey(), "getVariantKey returns the correct key");
        });

        QUnit.test("AppContainerVariantSet (" + oFixture.validity + "): getVariantKeyByName with non-existing name", async function (assert) {
            var sVariantSetKey = "VARIANT_SET_KEY_1154";
            var sVariantName = "VARIANT_1155";

            assert.ok(!this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
            var oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
            assert.equal(oVariantSet.getVariantKeyByName(sVariantName), undefined, "getVariantKey returns undefined for a non-existing name");
        });

        QUnit.test("AppContainerVariantSet (" + oFixture.validity + "): getVariantKeyByName with non-string name", async function (assert) {
            var sVariantSetKey = "VARIANT_SET_KEY_1168";

            assert.ok(!this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
            var oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
            assert.equal(oVariantSet.getVariantKeyByName(oVariantSet), undefined, "getVariantKey returns undefined for a non-string name");
        });

        QUnit.test("AppContainerVariantSet (" + oFixture.validity + "): getVariantNamesAndKeys", async function (assert) {
            var sVariantSetKey = "VARIANT_SET_KEY_1196";
            var sVariantName1 = "VARIANT_1";
            var sVariantName2 = "VARIANT_2";
            var sVariantName3 = "VARIANT_3";

            assert.ok(!this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' does not exist");
            var oVariantSet = this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            assert.ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was created");
            var sVariantKey1 = oVariantSet.addVariant(sVariantName1).getVariantKey();
            var sVariantKey2 = oVariantSet.addVariant(sVariantName2).getVariantKey();
            var sVariantKey3 = oVariantSet.addVariant(sVariantName3).getVariantKey();
            var aVariantNamesAndKeys = oVariantSet.getVariantNamesAndKeys();
            assert.equal(aVariantNamesAndKeys[sVariantName1], sVariantKey1, "result for variant 1 is correct");
            assert.equal(aVariantNamesAndKeys[sVariantName2], sVariantKey2, "result for variant 2 is correct");
            assert.equal(aVariantNamesAndKeys[sVariantName3], sVariantKey3, "result for variant 3 is correct");
        });

        QUnit.test("AppContainerVariantSet (" + oFixture.validity + "): save and simulate browser reload 1", async function (assert) {
            this.aVariantExp = [];
            this.oVariantNameAndKeysExp = {};
            var sVariantSetKey = "VARIANT_SET_KEY_1052";

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
                va.getItemKeys().forEach((sItemKey) => {
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
            this.oService._oContainerMap.remove(sCONTAINERPREFIX + sCONTAINER);
            const oContainer = await this.oService.getContainer(sCONTAINER, { validity: oFixture.validity });
            var oContainerVSAdapter = new VariantSetAdapter(oContainer);

            assert.ok(oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' exists after save");
            oVariantSet = oContainerVSAdapter.getVariantSet(sVariantSetKey);

            var oVariantNameAndKeys = oVariantSet.getVariantNamesAndKeys();
            assert.deepEqual(oVariantNameAndKeys, this.oVariantNameAndKeysExp, "Variant names and keys are correct");
            assert.deepEqual(oVariantSet.getVariantKeyByName("V1"), this.oVariantNameAndKeysExp.V1);
            assert.deepEqual(oVariantSet.getVariantKeyByName("V2"), this.oVariantNameAndKeysExp.V2);
            var aVariantKeys = oVariantSet.getVariantKeys();
            var aVariants = [];
            aVariantKeys.forEach((sVariantKey) => {
                var va = oVariantSet.getVariant(sVariantKey);
                buildVariantObject(aVariants, sVariantKey, va);
            });
            assert.deepEqual(aVariants, this.aVariantExp, "Entire variant is correct");
            oContainerVSAdapter.deleteVariantSet(sVariantSetKey);
            assert.ok(!oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was deleted");
        });

        QUnit.test("AppContainerVariantSet (" + oFixture.validity + "): save and simulate browser reload 2", async function (assert) {
            var sVariantSetKey = "VARIANT_SET_KEY_1137";

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
            this.oContainer.save();
            // tabula rasa
            delete this.oContainer;
            this.oService._oContainerMap.remove(sCONTAINER);
            // new container
            const oContainer2 = await this.oService.getContainer(sCONTAINER, { validity: oFixture.validity });
            this.oContainer = oContainer2;
            this.oContainerVSAdapter = new VariantSetAdapter(oContainer2);
            oVariantSet = this.oContainerVSAdapter
                .getVariantSet(sVariantSetKey);
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
            var aVariants = [];
            aVariantKeys.forEach((sVariantKey) => {
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

    [
        { validity: 0 },
        { validity: 30 },
        { validity: Infinity }
    ].forEach(function (oFixture) {
        QUnit.module("sap.ushell.services.PersonalizationV2 Container ( " + oFixture.validity + "): save deferred", {
            beforeEach: async function () {
                var oSystem = {};

                this.oAdapter = new PersonalizationMockAdapter(oSystem);
                this.oService = new Personalization(this.oAdapter);
                this.oContainer = await this.oService.getContainer(sCONTAINER, { validity: oFixture.validity });
            },
            afterEach: async function () {
                sandbox.restore();
                await this.oService.deleteContainer(sCONTAINER, { validity: oFixture.validity });
                await this.oService.deleteContainer(sCONTAINER + "2nd", { validity: oFixture.validity });
            }
        });

        QUnit.test("AppContainer (" + oFixture.validity + "): save, load, check", async function (assert) {
            this.oContainer.setItemValue("key1", { v1: "Value1" });
            await this.oContainer.save(10);
            assert.ok(true, "Save done");
            const oReadContainer = await this.oService.getContainer(sCONTAINER, { validity: oFixture.validity });
            assert.deepEqual(oReadContainer.getItemValue("key1"), { v1: "Value1" }, "Correct save");
        });

        QUnit.test("AppContainer (" + oFixture.validity + "): save, save, load, check", async function (assert) {
            var done = assert.async(2);

            this.oContainer.setItemValue("key1", { v1: "Value1" });
            this.oContainer.save(1000000).then(async (sMsg) => {
                assert.ok(true, "Dropped save done");
                assert.equal(sMsg, Personalization.prototype.SAVE_DEFERRED_DROPPED, "save was dropped");

                const oReadContainer = await this.oService.getContainer(sCONTAINER, { validity: oFixture.validity });
                assert.deepEqual(oReadContainer.getItemValue("key1"), { v1: "Value1" }, "First save - Correct save of key1");
                assert.deepEqual(oReadContainer.getItemValue("key2"), { v1: "Value1" }, "First save - Correct save of key2");
                done();
            });
            this.oContainer.setItemValue("key2", { v1: "Value1" });
            await this.oContainer.save().then(async (/*sMsg*/) => {
                assert.ok(true, "Save done");
                const oReadContainer = await this.oService.getContainer(sCONTAINER, { validity: oFixture.validity });
                assert.deepEqual(oReadContainer.getItemValue("key1"), { v1: "Value1" }, "Second save - Correct save of key1");
                assert.deepEqual(oReadContainer.getItemValue("key2"), { v1: "Value1" }, "Second save - Correct save of key2");
                done();
            });
        });

        QUnit.test("AppContainer (" + oFixture.validity + "): save, flush, load, check", async function (assert) {
            var done = assert.async(2);

            this.oContainer.setItemValue("key1", { v1: "Value1" });
            this.oContainer.save(1000000).then(async () => {
                    assert.ok(true, "Dropped save done");
                    const oReadContainer = await this.oService.getContainer(sCONTAINER, { validity: oFixture.validity });
                    assert.deepEqual(oReadContainer.getItemValue("key1"), { v1: "Value1" }, "First save - Correct save of key1");
                    assert.deepEqual(oReadContainer.getItemValue("key2"), { v1: "Value1" }, "First save - Correct save of key2");
                    done();
                });
            this.oContainer.setItemValue("key2", { v1: "Value1" });
            this.oContainer.flushPendingRequests().then(async () => {
                    assert.ok(true, "flush done");
                    const oReadContainer = await this.oService.getContainer(sCONTAINER, { validity: oFixture.validity });
                    assert.deepEqual(oReadContainer.getItemValue("key1"), { v1: "Value1" }, "Second save - Correct save of key1");
                    assert.deepEqual(oReadContainer.getItemValue("key2"), { v1: "Value1" }, "Second save - Correct save of key2");
                    done();
                });
        });
    });

    // cross validity tests
    // test interaction between several validitys!

    // save 30,  get 0 -> new instance ?
    // save 0,  get 30 -> new instance

    // sequence validity (save) validity2 get , del(validity2) get validity.
    // zombiepersistence true indicates save() data is retrieved albeit deletion

    [
        { validity: 0, validity2: 30, zombiePersistence: false, distinctValues: false },
        { validity: 30, validity2: 0, zombiePersistence: true, distinctValues: false },
        { validity: 30, validity2: Infinity, zombiePersistence: false, distinctValues: false },
        { validity: Infinity, validity2: 30, zombiePersistence: false, distinctValues: false }
    ].forEach(function (oFixture) {
        QUnit.module("sap.ushell.services.PersonalizationV2  Container ( " + oFixture.validity + "/" + oFixture.validity2 + "): service + cross validity", {
            beforeEach: async function () {
                var oSystem = {};

                this.oAdapter = new PersonalizationMockAdapter(oSystem);
                this.oService = new Personalization(this.oAdapter);
                this.oContainer = await this.oService.getContainer(sCONTAINER, { validity: oFixture.validity });
            },
            afterEach: async function () {
                sandbox.restore();
                await this.oService.deleteContainer(sCONTAINER, { validity: oFixture.validity });
                await this.oService.deleteContainer(sCONTAINER + "2nd", { validity: oFixture.validity });
            }
        });

        QUnit.test("AppContainer  ( " + oFixture.validity + "/" + oFixture.validity2 + ") : get w/ different validity gets same data new instance! get (new) +  get + delete", async function (assert) {
            var oService = this.oService;
            var sItemKey = "ItemKey";
            var sContainerKey = sCONTAINER + "2nd";

            const oContainer = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
            this.oItemValue = { v1: false };
            oContainer.setItemValue(sItemKey, this.oItemValue);
            // not serialized !!!!
            this.oItemValue.v2 = true;
            assert.equal(oFixture.validity, oContainer._getValidity(), "first validity");
            assert.ok(true, "Personalization data was set");
            await oContainer.save();
            assert.ok(true, "save ok");
            // obtain the (existing) Container (again)
            const oContainer2 = await oService.getContainer(sContainerKey, { validity: oFixture.validity2 });
            assert.ok(true, "Personalization data was gotten");
            var oReadValue = oContainer2.getItemValue(sItemKey);
            var oReadValueExpected = { v1: false };
            if (oFixture.distinctValues) {
                oReadValueExpected = undefined;
            }
            assert.deepEqual(oReadValueExpected, oReadValue, "Read value is the saved value!");
            assert.equal(oFixture.validity2, oContainer2._getValidity(), "2nd validity");
            await oService.deleteContainer(sContainerKey, { validity: oFixture.validity2 });
            assert.equal(oFixture.validity2, oContainer2._getValidity(), "2nd validity of stale container");
            const oContainer3 = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
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
        QUnit.module("sap.ushell.services.PersonalizationV2  ( " + oFixture.validity + "): test adapter called", {
            beforeEach: function () {
                var oSystem = {};

                this.oAdapter = new PersonalizationMockAdapter(oSystem);
                this.oSpyAdapterGet = sandbox.spy(PersonalizationMockAdapter.prototype, "getAdapterContainer");
                this.oSpyAdapterDelete = sandbox.spy(this.oAdapter, "delAdapterContainer");
                this.oSpyAdapterSave = sandbox.spy(MockAdapterContainer.prototype, "save");
                this.oService = new Personalization(this.oAdapter);
            },
            afterEach: async function () {
                sandbox.restore();
                await this.oService.deleteContainer(sCONTAINER, { validity: oFixture.validity });
                await this.oService.deleteContainer(sCONTAINER + "2nd", { validity: oFixture.validity });
            }
        });

        QUnit.test("AppContainer  ( " + oFixture.validity + ") : test adapter called", async function (assert) {
            var oService = this.oService;
            var sItemKey = "ItemKey";
            var sContainerKey = sCONTAINER + "2nd";

            const oContainer = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
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
            const oContainer2 = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
            assert.ok(true, "Personalization data was gotten");
            assert.equal(oFixture.adapterCalled, oFixture.adapterCalled && this.oSpyAdapterGet.callCount === 2, "adapter called (0 or two)");
            assert.equal(false, this.oSpyAdapterDelete.called, "Del not called ");
            var oReadValue = oContainer2.getItemValue(sItemKey);
            assert.deepEqual(oReadValue, { v1: "false" }, "Read value is the saved value");
            assert.equal(oFixture.effectiveValidity, oContainer2._getValidity(), "validity");
            oReadValue.v3 = false;
            assert.deepEqual(oContainer2.getItemValue(sItemKey), { v1: "false" }, "Read value is not a live read value");
            assert.ok(oReadValue !== this.oItemValue, "not same object");
            await oService.deleteContainer(sContainerKey, { validity: oFixture.validity });
            assert.equal(oFixture.adapterCalled, this.oSpyAdapterGet.callCount === 3, "adapter called");
            assert.equal(oFixture.adapterCalled, this.oSpyAdapterDelete.called, "Del called");
            assert.equal(oFixture.effectiveValidity, oContainer._getValidity(), "2nd validity of stale container");
            const oContainer3 = await oService.getContainer(sContainerKey, { validity: oFixture.validity });
            oReadValue = oContainer3.getItemValue(sItemKey);
            assert.ok(true, "Personalization data deletion successful");
            assert.equal(oFixture.effectiveValidity, oContainer3._getValidity(), "validity ok");
            // new get!
            assert.equal(oFixture.adapterCalled, this.oSpyAdapterGet.callCount === 4, "adapter called");
        });
    });

    //  ............................................................................
    //
    //                           M O C K   A D A P T E R
    //
    //  ............................................................................

    function PersonalizationMockAdapter () {
        this._sCONTAINER_PREFIX = "sap.ushell.personalization#";
        this._oContainerMap = new utils.Map();
        this._oErrorMap = new utils.Map(); // has to be outside the container
    }

    PersonalizationMockAdapter.prototype.setErrorProvocation = function (sContainerKey) {
        this._oErrorMap.put(this._sCONTAINER_PREFIX + sContainerKey, true);
    };

    PersonalizationMockAdapter.prototype.resetErrorProvocation = function (sContainerKey) {
        this._oErrorMap.put(this._sCONTAINER_PREFIX + sContainerKey, false);
    };

    // ---- Container ----
    PersonalizationMockAdapter.prototype.getAdapterContainer = function (sContainerKey) {
        var oContainer;

        if (this._oContainerMap.containsKey(sContainerKey)) {
            oContainer = this._oContainerMap.get(sContainerKey);
        } else {
            oContainer = new MockAdapterContainer(sContainerKey);
            oContainer._oErrorMap = this._oErrorMap; // dirty injection to keep the API of all adapters the same
            this._oContainerMap.put(sContainerKey, oContainer);
        }
        return oContainer;
    };

    PersonalizationMockAdapter.prototype.delAdapterContainer = function (sContainerKey) {
        var oDeferred = new jQuery.Deferred();

        this._oContainerMap.get(sContainerKey);
        if (this._oErrorMap.get(sContainerKey)) {
            oDeferred.reject();
        } else {
            oDeferred.resolve();
        }
        this._oContainerMap.remove(sContainerKey);
        return oDeferred.promise();
    };

    // --- Adapter Container ---
    function MockAdapterContainer (sContainerKey) {
        this._sContainerKey = sContainerKey;
        this._oItemMap = new utils.Map();
        this._oErrorMap = new utils.Map();
    }

    MockAdapterContainer.prototype.load = function () {
        var oDeferred = new jQuery.Deferred();
        if (typeof this._oErrorMap.get === "function" && this._oErrorMap.get(this._sContainerKey)) {
            oDeferred.reject();
        } else {
            oDeferred.resolve();
        }
        return oDeferred.promise();
    };

    MockAdapterContainer.prototype.save = function () {
        var oDeferred = new jQuery.Deferred();
        if (this._oErrorMap.get(this._sContainerKey)) {
            oDeferred.reject();
        } else {
            oDeferred.resolve();
        }
        return oDeferred.promise();
    };

    MockAdapterContainer.prototype.getItemKeys = function () {
        return this._oItemMap.keys();
    };

    MockAdapterContainer.prototype.containsItem = function (sItemKey) {
        this._oItemMap.containsKey(sItemKey);
    };

    MockAdapterContainer.prototype.getItemValue = function (sItemKey) {
        return this._oItemMap.get(sItemKey);
    };

    MockAdapterContainer.prototype.setItemValue = function (sItemKey, oItemValue) {
        this._oItemMap.put(sItemKey, oItemValue);
    };

    MockAdapterContainer.prototype.delItem = function (sItemKey) {
        this._oItemMap.remove(sItemKey);
    };
});
