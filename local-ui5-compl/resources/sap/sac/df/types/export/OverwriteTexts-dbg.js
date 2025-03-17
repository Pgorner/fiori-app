/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  "sap/sac/df/types/export/OverwriteTexts",
  [
    "sap/sac/df/firefly/library",
    "sap/sac/df/utils/ResourceBundle"
  ],
  function (FF, ResourceBundle) {
    "use strict";

    var OverwriteTexts = {
      MEASURE_DIMENSION: FF.OlapUiCommonI18n.COMMON_MEASURES,
      STRUCTURE_DIMENSION: FF.OlapUiCommonI18n.COMMON_STRUCTURE,
      EXCEPTION_ERROR: FF.AuGdsQueryBuilderI18n.VALUE_EXCEPTION_ERROR,
      EXCEPTION_NO_VALUE: FF.AuGdsQueryBuilderI18n.VALUE_EXCEPTION_NO_VALUE,
      EXCEPTION_NULL: FF.AuGdsQueryBuilderI18n.VALUE_EXCEPTION_NULL,
      EXCEPTION_OTHER: FF.AuGdsQueryBuilderI18n.VALUE_EXCEPTION_OTHER,
      EXCEPTION_UNDEFINED: FF.AuGdsQueryBuilderI18n.VALUE_EXCEPTION_UNDEFINED,
      SCALE_LONG_BILLION: FF.OuNumberFormattingI18n.STYLE_SCALE_LONG_BILLION,
      SCALE_LONG_MILLION: FF.OuNumberFormattingI18n.STYLE_SCALE_LONG_MILLION,
      SCALE_LONG_THOUSAND: FF.OuNumberFormattingI18n.STYLE_SCALE_LONG_THOUSAND,
      SCALE_SHORT_BILLION: FF.OuNumberFormattingI18n.STYLE_SCALE_SHORT_BILLION,
      SCALE_SHORT_MILLION: FF.OuNumberFormattingI18n.STYLE_SCALE_SHORT_MILLION,
      SCALE_SHORT_THOUSAND: FF.OuNumberFormattingI18n.STYLE_SCALE_SHORT_THOUSAND,
      TOTAL_INCLUDING_MEMBER: FF.AuGdsQueryBuilderI18n.TOTALS_INCLUDING,
      TOTAL_MEMBER: FF.AuGdsQueryBuilderI18n.TOTALS,
      TOTAL_REMAINING_MEMBER: FF.AuGdsQueryBuilderI18n.TOTALS_REMAINING,
      OVERWRITE_APPENDIX_CREATED_BY: FF.DataExportHelper.OVERWRITE_APPENDIX_CREATED_BY,
      OVERWRITE_APPENDIX_CREATED_ON_TIMESTAMP: FF.DataExportHelper.OVERWRITE_APPENDIX_CREATED_ON_TIMESTAMP,

      getDefault: function () {
        var texts = FF.XHashMapByString.create();
        var keys = Object.keys(this);
        var that = this;
        keys.forEach(function (key) {
          if (typeof that[key] !== "function") {
            var value = ResourceBundle.getText(that[key], undefined, true);
            if(value){
              texts.put(that[key], value);
            }
          }
        });
        return texts;
      }
    };
    return OverwriteTexts;
  });
