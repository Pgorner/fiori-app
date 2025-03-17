/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap */
sap.ui.define("sap/sac/df/types/SortType", [],
  function(){
    /**
     * Sort Type
     *
     * @enum {string}
     * @alias sap.sac.df.types.SortType
     * @public
     * @experimental since version 1.130
     */
    var SortType = {
      /**
       * Sort according to Filter
       * @public
       **/
      Filter: "FILTER",
      /**
       * Sort according to Key
       * @public
       **/
      MemberKey: "MEMBER_KEY",
      /**
       * Sort according to Text
       * @public
       **/
      MemberText: "MEMBER_TEXT",
      /**
       * No sorting
       * @public
       **/
      unset: "unset"
    };
    return SortType;
  }
);
