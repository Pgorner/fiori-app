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

  var FacetTypeUI = /*#__PURE__*/function (FacetTypeUI) {
    FacetTypeUI["DataSource"] = "DataSource";
    FacetTypeUI["Hierarchy"] = "Hierarchy";
    FacetTypeUI["Attribute"] = "Attribute";
    FacetTypeUI["QuickSelectDataSource"] = "QuickSelectDataSource";
    FacetTypeUI["HierarchyStatic"] = "HierarchyStatic";
    return FacetTypeUI;
  }(FacetTypeUI || {});
  /* spread operator not yet supported by Typescript (eslint error)
    import { FacetType } from "../../../sinaNexTS/sina/FacetType";
    export enum FacetTypeUI = {
      ...FacetType,
      Attribute = "Attribute",
      QuickSelectDataSource = "QuickSelectDataSource",
      HierarchyStatic = "HierarchyStatic",
  } */
  var __exports = {
    __esModule: true
  };
  __exports.FacetTypeUI = FacetTypeUI;
  return __exports;
});
})();