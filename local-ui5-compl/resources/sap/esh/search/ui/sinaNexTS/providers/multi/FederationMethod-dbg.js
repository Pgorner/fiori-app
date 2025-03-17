/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([], function () {
  "use strict";

  class Ranking {
    //sorting method according ranking
    sort(resultSetItemList) {
      let results = [];
      for (let j = 0; j < resultSetItemList.length; j++) {
        results = results.concat(resultSetItemList[j]);
      }
      results.sort(function (a, b) {
        const ret = b.score - a.score; //high score is first
        return ret;
      });
      return results;
    }
  }
  class RoundRobin {
    //simple round robin method
    sort(resultSetItemList) {
      let sortedResults = [];
      for (let i = 0; i < resultSetItemList.length; i++) {
        sortedResults = this.mergeMultiResults(sortedResults, resultSetItemList[i], i + 1);
      }
      return sortedResults;
    }
    mergeMultiResults(firstResults, secondResults, mergeIndex) {
      if (mergeIndex < 1) {
        return [];
      }
      if (mergeIndex === 1) {
        return secondResults;
      }
      const firstLength = firstResults.length;
      const secondLength = secondResults.length;
      let results = [];
      for (let k = 0; k < firstLength; k++) {
        results.push(firstResults[k]);
      }
      for (let i = 0; i < firstLength; i++) {
        if (i >= secondLength) {
          break;
        }
        results.splice(mergeIndex * (i + 1) - 1, 0, secondResults[i]);
      }
      if (secondLength > firstLength) {
        results = results.concat(secondResults.slice(firstLength - secondLength));
      }
      return results;
    }
  }
  class AdvancedRoundRobin {
    //advanced round robin method
    sort(resultSetItemList) {
      let results = [];
      for (let j = 0; j < resultSetItemList.length; j++) {
        results = results.concat(resultSetItemList[j]);
      }
      let dataSourceId;

      //result list map, key: dataSourceId, value: array list of resultlist
      const dataSourceIdMap = {};
      for (let i = 0; i < results.length; i++) {
        dataSourceId = results[i].dataSource.id;
        if (!dataSourceIdMap[dataSourceId]) {
          dataSourceIdMap[dataSourceId] = [];
        }
        dataSourceIdMap[dataSourceId].push(results[i]);
      }

      //array of objects: dataSouceId, high score, original index
      const dataSourceScoreArray = [];
      let index = 0;
      for (const key in dataSourceIdMap) {
        const item = dataSourceIdMap[key][0];
        dataSourceId = item.dataSource.id;
        const score = item.score;
        dataSourceScoreArray.push({
          dataSourceId: dataSourceId,
          score: score,
          index: index
        });
        index++;
      }

      //sort dataSourceScoreArray
      dataSourceScoreArray.sort(function (a, b) {
        let ret = b.score - a.score; //high score is first
        if (ret === 0) {
          ret = a.index - b.index; //low index is first
        }
        return ret;
      });

      //rebuild the results
      const sortedResults = [];
      let dsIndex = 0;
      for (let r = 0; r < results.length;) {
        const selectDs = dataSourceScoreArray[dsIndex];
        const selectRs = dataSourceIdMap[selectDs.dataSourceId];
        if (selectRs.length > 0) {
          sortedResults.push(selectRs.shift());
          r++;
        }
        dsIndex = (dsIndex + 1) % dataSourceScoreArray.length;
      }
      return sortedResults;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.Ranking = Ranking;
  __exports.RoundRobin = RoundRobin;
  __exports.AdvancedRoundRobin = AdvancedRoundRobin;
  return __exports;
});
})();