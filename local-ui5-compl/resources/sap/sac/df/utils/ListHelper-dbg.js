/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  "sap/sac/df/utils/ListHelper", [],
  function () {
    "use strict";
    
    function arrayFromIter(oIter) {
      var a = [];
      while (oIter.hasNext()) {
        a.push(oIter.next());
      }
      return a;
    }
    
    function ListHelper() {
      this.arrayFromIter = arrayFromIter;
      this.arrayFromList = function (aList) {
        return arrayFromIter(aList.getIterator());
      };
    }
    
    return new ListHelper();
  }
);
