/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../core/LabelCalculator"], function (____core_LabelCalculator) {
  "use strict";

  const LabelCalculator = ____core_LabelCalculator["LabelCalculator"];
  function createLabelCalculator() {
    return new LabelCalculator({
      key: function (dataSource) {
        return [dataSource.labelPlural, dataSource.system.id];
      },
      data: function (dataSource) {
        return {
          label: dataSource.label,
          labelPlural: dataSource.labelPlural
        };
      },
      setLabel: function (dataSource, labels, data) {
        labels[0] = data.label;
        dataSource.label = labels.join(" ");
        labels[0] = data.labelPlural;
        dataSource.labelPlural = labels.join(" ");
      },
      setFallbackLabel: function (dataSource, data) {
        dataSource.label = data.labelPlural + " duplicate " + dataSource.id;
        dataSource.labelPlural = dataSource.label;
      }
    });
  }
  var __exports = {
    __esModule: true
  };
  __exports.createLabelCalculator = createLabelCalculator;
  return __exports;
});
})();