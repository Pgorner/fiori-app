sap.ui.define([
    "sap/ovp/insights/helpers/Filters"
], function (Filterhelper) {
    "use strict";

    QUnit.test("Function updateRangeValue in case if Low range value is null / undefined / string value and option used is EQ", function (assert) {
        var oFilters = {};
        oFilters["BatchStorageLocation"] = {
            type: "string",
            value: '{"Parameters":[],"SelectOptions":[{"PropertyName":"BatchStorageLocation","Ranges":[{"Sign":"I","Option":"EQ","Low":"","High":null}]}]}',
        };
        oFilters["SalesGroup"] = {
            type: "string",
            value: '{"Parameters":[],"SelectOptions":[{"PropertyName":"SalesGroup","Ranges":[{"Sign":"I","Option":"EQ","Low":null,"High":null}]}]}',
        };
        oFilters["InspectionLot"] = {
            type: "string",
            value: '{"Parameters":[],"SelectOptions":[{"PropertyName":"InspectionLot","Ranges":[{"Sign":"I","Option":"EQ","High":null}]}]}',
        };
        oFilters["Plant"] = {
            type: "string",
            value: '{"Parameters":[],"SelectOptions":[{"PropertyName":"Plant","Ranges":[{"Sign":"I","Option":"EQ","Low":"\'1010\'","High":null}]}]}',
        };
        Filterhelper.updateRangeValue(oFilters);
        assert.ok(
            oFilters.InspectionLot.value ===
                '{"Parameters":[],"SelectOptions":[{"PropertyName":"InspectionLot","Ranges":[]}]}',
            "The value of InspectionLot's Range value is an empty array as the Low value is undefined and EQ option is present."
        );
        assert.ok(
            oFilters.SalesGroup.value ===
                '{"Parameters":[],"SelectOptions":[{"PropertyName":"SalesGroup","Ranges":[]}]}',
            "The value of Ranges will be an empty array as the Low value is null and EQ option is present."
        );
        assert.ok(
            oFilters.Plant.value ===
                '{"Parameters":[],"SelectOptions":[{"PropertyName":"Plant","Ranges":[{"Sign":"I","Option":"EQ","Low":"\'1010\'","High":null}]}]}',
            "The value of Plant is unchanged as that's the value provided in string and the operator is EQ."
        );
        assert.ok(
            oFilters.BatchStorageLocation.value ===
                '{"Parameters":[],"SelectOptions":[{"PropertyName":"BatchStorageLocation","Ranges":[]}]}',
            "The Ranges value is an empty array as the low range value is ''."
        );
    });

    QUnit.test("Function enhanceVariant for a given variant value", function (assert) {
        var oFilters = {};
        oFilters["InspectionLot"] = {
            type: "string",
            value: `{"Version":{"Major":"1","Minor":"0","Patch":"0"},"SelectionVariantID":"","Text":"Selection Variant with ID ","ODataFilterExpression":"","Parameters":[],"SelectOptions":[{"PropertyName":"InspectionLot","Ranges":[{"Sign":"I","Option":"EQ","Low":"''","High":null}]}]}`,
        };
        oFilters["InspectionLot"].value = Filterhelper.enhanceVariant(oFilters["InspectionLot"].value);
        var oResult = JSON.parse(oFilters["InspectionLot"].value);
        assert.ok(!oResult.Version, "Property Version is removed from variant as it was not required.");
        assert.ok(
            !oResult.SelectionVariantID,
            "Property SelectionVariantID is removed from variant as it was not required also it was blank."
        );
        assert.ok(!oResult.Text, "Property Text is removed from variant as it was a static text value.");
        assert.ok(
            !oResult.ODataFilterExpression,
            "Property ODataFilterExpression is removed from variant as it was not a required property."
        );
        assert.ok(Array.isArray(oResult.SelectOptions), "Property SelectOptions Exists in the variant.");
        assert.ok(Array.isArray(oResult.Parameters), "Property Parameters Exists in the variant.");
    });

    QUnit.test("Function updateRangeValue test for multiple variants", function (assert) {
        var oFilters = {};
        oFilters["InspectionLotDynamicLevel"] = {
            type: "string",
            value: [
                '{"Parameters":[],"SelectOptions":[{"PropertyName":"InspectionLotDynamicLevel","Ranges":[{"Sign":"I","Option":"EQ","Low":"\'0\'","High":null}]}]}',
                '{"Parameters":[],"SelectOptions":[{"PropertyName":"InspectionLotDynamicLevel","Ranges":[{"Sign":"I","Option":"EQ","Low":"\'1\'","High":null}]}]}',
            ],
        };
        oFilters["OverallSDProcessStatus"] = {
            type: "string",
            value: [
                '{"Parameters":[],"SelectOptions":[{"PropertyName":"OverallSDProcessStatus","Ranges":[{"Sign":"I","Option":"EQ","Low":"B","High":null}]}]}',
                '{"Parameters":[],"SelectOptions":[{"PropertyName":"OverallSDProcessStatus","Ranges":[{"Sign":"I","Option":"EQ","Low":"A","High":null}]}]}',
                '{"Parameters":[],"SelectOptions":[{"PropertyName":"OverallSDProcessStatus","Ranges":[{"Sign":"I","Option":"EQ","Low":"","High":null}]}]}',
            ],
        };
        oFilters["InspectionLot"] = {
            type: "string",
            value: [
                '{"Parameters":[],"SelectOptions":[{"PropertyName":"InspectionLot","Ranges":[{"Sign":"I","Option":"EQ","Low":"\'0\'","High":null}]}, {"PropertyName":"InspectionLot","Ranges":[{"Sign":"I","Option":"EQ","Low":"\'1\'","High":null}]}]}',
            ],
        };
        oFilters["OverallSDProcessStatus1"] = {
            type: "string",
            value: [
                '{"Parameters":[],"SelectOptions":[{"PropertyName":"OverallSDProcessStatus1","Ranges":[{"Sign":"I","Option":"EQ","Low":"A","High":null}, {"Sign":"I","Option":"EQ","Low":"B","High":null}]}]}',
                '{"Parameters":[],"SelectOptions":[{"PropertyName":"OverallSDProcessStatus1","Ranges":[{"Sign":"I","Option":"EQ","Low":"B","High":null}]}]}',
            ],
        };
        Filterhelper.updateRangeValue(oFilters);
        assert.ok(
            oFilters["InspectionLotDynamicLevel"].value ===
                `{"Parameters":[],"SelectOptions":[{"PropertyName":"InspectionLotDynamicLevel","Ranges":[{"Sign":"I","Option":"EQ","Low":"'0'","High":null},{"Sign":"I","Option":"EQ","Low":"'1'","High":null}]}]}`,
            "InspectionLotDynamicLevel Filter's range values are combined."
        );
        assert.ok(
            oFilters.InspectionLot.value ===
                `{"Parameters":[],"SelectOptions":[{"PropertyName":"InspectionLot","Ranges":[{"Sign":"I","Option":"EQ","Low":"'0'","High":null},{"Sign":"I","Option":"EQ","Low":"'1'","High":null}]}]}`,
            "InspectionLot Filters Properties Ranges are Merged"
        );
        assert.ok(
            oFilters.OverallSDProcessStatus.value ===
                '{"Parameters":[],"SelectOptions":[{"PropertyName":"OverallSDProcessStatus","Ranges":[{"Sign":"I","Option":"EQ","Low":"B","High":null},{"Sign":"I","Option":"EQ","Low":"A","High":null},{"Sign":"I","Option":"EQ","Low":"","High":null}]}]}',
            "All Range values of OverallSDProcessStatus are combined"
        );
        assert.ok(
            oFilters.OverallSDProcessStatus1.value ===
                '{"Parameters":[],"SelectOptions":[{"PropertyName":"OverallSDProcessStatus1","Ranges":[{"Sign":"I","Option":"EQ","Low":"A","High":null},{"Sign":"I","Option":"EQ","Low":"B","High":null}]}]}',
            "Dupliicate values are ignored in range values for property OverallSDProcessStatus1"
        );
    });
   
    QUnit.test("Function getDateRangeValueForParameters for a given parameter", function (assert) {
        var oPosOperation = { conditionTypeInfo: { data: { operation: 'DATE', value1: new Date("2015-03-25"), value2: null }, name: "sap.ui.comp.config.condition.DateRangeType" } };
        var sValue = Filterhelper.getDateRangeValueForParameters(oPosOperation);
        assert.equal(JSON.parse(sValue), "2015-03-25T00:00:00.000Z", "date range is present inside value");

        var oNegOperation = { conditionTypeInfo: { data: { operation: 'DATETIMERANGE', value1: new Date("2015-03-25"), value2: null }, name: "sap.ui.comp.config.condition.DateRangeType" } };
        var sResult = Filterhelper.getDateRangeValueForParameters(oNegOperation);
        assert.equal(sResult, "DATETIMERANGE", "date range is not present so returning operation");
    });

});
