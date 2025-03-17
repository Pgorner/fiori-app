sap.ui.define([
    "sap/base/util/isEmptyObject",
    "sap/suite/ui/generic/template/js/AnnotationHelper"
], function (isEmptyObject, AnnotationHelper) {
    "use strict";

     /*
        *  This method is called in the initialization and dataReceived phase of the specified SmartTable.
        *  It handles everything which can be done regarding hiding columns at this point in time.
        *  This is:
        *     - Check for columns which are hidden statically(Bool) or dynamically(Path)
        *     - Immediately hide the columns which are statically hidden at SmartTable init
        *     - Dynamically hide the cells based the Path property at SmartTable dataReceived event
    */
    function fnGetHiddenColumnInfo(oSmartTable) {
        // Initialization which needs the control to be created
        var oMetaModel = oSmartTable.getModel().getMetaModel(); // prepare metadata
        var oEntitySet = oMetaModel.getODataEntitySet(oSmartTable.getEntitySet());
        var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
        var aCustomData = oSmartTable.getCustomData();
        var oCustomDataForLineItemQualifier = aCustomData.find(function(oCustomData){
            return oCustomData.getKey() === "lineItemQualifier";
        });
        var sLineItemSuffix = (oCustomDataForLineItemQualifier && oCustomDataForLineItemQualifier.getValue()) ? ("#" + oCustomDataForLineItemQualifier.getValue()) : "";
        var aDataFields = oEntityType["com.sap.vocabularies.UI.v1.LineItem" + sLineItemSuffix] || [];

        var aStaticHiddenColumns = []; // list of keys of columns that are always hidden
        var mColumnKeyToDynamicHiddenPath = Object.create(null); // map of column keys to pathes that determine whether the column is shown

        aDataFields.forEach(fnAnalyzeColumnHideInfoForDataField.bind(null, aStaticHiddenColumns, mColumnKeyToDynamicHiddenPath, oMetaModel, oEntityType));
        return {
            staticHiddenColumns: aStaticHiddenColumns,
            columnKeyToCellHiddenPath: mColumnKeyToDynamicHiddenPath
        };
    }

    /*
        * Add the information derived from the UI:Hidden annotation for one line item to either
        * aStaticHiddenColumns or mColumnKeyToDynamicHiddenPath, or none.
    */
    function fnAnalyzeColumnHideInfoForDataField(aStaticHiddenColumns, mColumnKeyToDynamicHiddenPath, oMetaModel, oEntityType, oDataField) {
        // regular expression for ?
        var rPath = /[A-Za-z].*[A-Za-z]/;

        var sColumnKey = AnnotationHelper.createP13NColumnKey(oDataField);
        var vExpression = AnnotationHelper.getBindingForHiddenPath(oDataField);
        if (vExpression === "{= !${} }") {
            aStaticHiddenColumns.push(sColumnKey);
        }
        if (typeof (vExpression) === "string") {
            var sPath = vExpression.match(rPath) && vExpression.match(rPath)[0];
            if (sPath && sPath.indexOf("/") === -1) {
                mColumnKeyToDynamicHiddenPath[sColumnKey] = sPath;
            }
        } else if (!vExpression) {
            aStaticHiddenColumns.push(sColumnKey);
        }
    }

    return {
		getHiddenColumnInfo: fnGetHiddenColumnInfo
	};
});