sap.ui.define([
    "sap/ui/comp/config/condition/DateRangeType",
    "sap/ui/comp/config/condition/Type",
    "sap/ui/core/date/UniversalDate",
    "sap/ui/core/Fragment"
],
    function (DateRangeType, Type, UniversalDate, Fragment) {
        "use strict";

        var CustomDateRangeType = DateRangeType.extend("SOMULTIENTITY.ext.controller.customDateRangeType");

        var NOWFROMTO = "NOWFROMTO";

        CustomDateRangeType.CustomOperations = {
            [NOWFROMTO]: {
                key: "NOWFROMTO",
                textKey: {
                    key: "nowFromTo",
                    isOwn: true
                },
                singularTextKey: {
                    key: "nowFromTo",
                    isOwn: true
                },
                category: "DYNAMIC.DATE.INT",
                order: 2,
                defaultValues: [1, 1],
                type: "[int,int]",
                display: "int",
                value1: null,
                value2: null,
                descriptionTextKeys: [{
                    key: "hour",
                    isOwn: true
                }, {
                    key: "hours",
                    isOwn: true
                }],
                onChange: DateRangeType._IntFromToOnChangeHandler,
                filterSuggestItem: DateRangeType._IntFromToFilterSuggestItem,
                onItemSelected: DateRangeType._IntOnItemsSelected,
                getControls: DateRangeType.ControlFactory
            }
        };

        CustomDateRangeType.prototype.initialize = function () {
            DateRangeType.prototype.initialize.apply(this, arguments);
        };

        CustomDateRangeType.prototype.getOperations = function () {
            var aOperations = DateRangeType.prototype.getOperations.apply(this, []);
            var aCustomOperations = Object.values(CustomDateRangeType.CustomOperations);
            aCustomOperations.forEach(function (oOperation) {
                aOperations.push(oOperation);
            });

            return aOperations;
        };

        CustomDateRangeType.prototype.getControls = function (oOperation) {
            var aControls = [];
            if (!oOperation) {
                return [];
            }
            switch (oOperation.key) {
                case DateRangeType.Operations.FROM.key:
                case DateRangeType.Operations.TO.key:
                    var oDateFilter = Fragment.load({
                        id: Type._createStableId(this),
                        controller: this
                    }).then(function () {
                        return [oDateFilter];
                    });
                default:
                    break;
            }
            if (oOperation.getControls) {
                oOperation.getControls(this, aControls, oOperation);
            }
            var aControlsWithoutLabels = aControls.filter(function (oControl) {
                return oControl.getMetadata()._sClassName !== 'sap.m.Label';
            });
            return aControlsWithoutLabels;
        };

        CustomDateRangeType.prototype.fireFilterUpdate = function () {
            DateRangeType.prototype.serialize.apply(this, [true, false]);
        };

        CustomDateRangeType.prototype.getFilterRangesForHours = function (oCondition) {
            var iValue1 = oCondition.value1,
                iValue2 = oCondition.value2 || 0;
            var oValue1 = new UniversalDate(),
                oValue2 = new UniversalDate();
            var oStartDate = new UniversalDate();
            oStartDate.getJSDate().setTime(new UniversalDate().getTime());

            var oEndDate = new UniversalDate();
            oEndDate.getJSDate().setTime(new UniversalDate().getTime());
            if (oCondition.operation === NOWFROMTO && !isNaN(iValue1) && !isNaN(iValue2)) {
                oStartDate.setHours(oValue1.getHours() - iValue1);
                oEndDate.setHours(oValue1.getHours() + iValue2);
                oValue1 = oStartDate;
                oValue2 = oEndDate;
            }
            oCondition.value1 = oValue1;
            oCondition.value2 = oValue2;
            if (oCondition.value1 instanceof UniversalDate) {
                oCondition.value1 = oCondition.value1.oDate;
            }
            if (oCondition.value2 instanceof UniversalDate) {
                oCondition.value2 = oCondition.value2.oDate;
            }
            oCondition.operation = "BT";
            oCondition.exclude = false;
            oCondition.keyField = oCondition.key;
            delete oCondition.key;
            var aConditions = [oCondition];
            return aConditions;
        };

        CustomDateRangeType.prototype.getFilterRanges = function () {
            var aConditions = [];
            var oCondition = this.getCondition();
            if (oCondition.operation === NOWFROMTO) {
                aConditions = this.getFilterRangesForHours(oCondition);
            }
            return aConditions;
        };

        return CustomDateRangeType;
    }, true);