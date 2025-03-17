/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../../sina/i18n"], function (____sina_i18n) {
  "use strict";

  const getText = ____sina_i18n["getText"];
  function parseNlqInfo(sina, nlqInfos) {
    // check nlq infos
    if (!nlqInfos || nlqInfos.length === 0) {
      return {
        success: false,
        filterDescription: ""
      };
    }
    // assemble list of filter descriptions
    const filterDescriptionsList = [];
    for (const nlqInfo of nlqInfos) {
      if (nlqInfos.length > 1) {
        const dataSourceId = nlqInfo?.NLQConnectorQueries?.results[0]?.ConnectorID;
        const dataSource = sina.getDataSource(dataSourceId);
        filterDescriptionsList.push(getText("nlqDataSourceAndFilterDescription", [dataSource ? dataSource.label : dataSourceId, nlqInfo.Description]));
      } else {
        filterDescriptionsList.push(nlqInfo.Description);
      }
    }
    // assemble filter description form filter descriptions list
    let filterDescription = "";
    if (filterDescriptionsList.length > 0) {
      filterDescription = "<code>" + filterDescriptionsList.join("<br/>") + "</code>";
    }
    // return nlq result
    return {
      success: true,
      filterDescription: filterDescription
    };
  }
  var __exports = {
    __esModule: true
  };
  __exports.parseNlqInfo = parseNlqInfo;
  return __exports;
});
})();