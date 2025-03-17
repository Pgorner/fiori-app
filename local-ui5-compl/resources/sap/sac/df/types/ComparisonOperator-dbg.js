/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap */
sap.ui.define(
  "sap/sac/df/types/ComparisonOperator",
  [
  ],
  function(){
    /**
     * Comparison Operator used e.g. in the dynamic filter or in a variable value
     *
     * @enum {string}
     * @alias sap.sac.df.types.ComparisonOperator
     * @private
     * @experimental since version 1.89
     */
    var ComparisonOperator = {
      /** @private */
      AGGREGATED: "AGGREGATED",
      /** @private */
      ALL: "ALL",
      /**
       * Between Interval definition
       * @public
       **/
      BETWEEN: "BETWEEN",
      /**
       * Between excluding, complement of an interval
       * @public
       **/
      BETWEEN_EXCLUDING: "BETWEEN_EXCLUDING",
      /**
       * Equal
       * @public
       **/
      EQUAL: "EQUAL",
      /**
       * Fuzzy similar
       * @public
       **/
      FUZZY: "FUZZY",
      /**
       * Greater equal
       * @public
       **/
      GREATER_EQUAL: "GREATER_EQUAL",
      /**
       * Greater than
       * @public
       **/
      GREATER_THAN: "GREATER_THAN",
      /**
       * In
       * @public
       **/
      "IN": "IN",
      /**
       * Is null
       * @public
       **/
      IS_NULL: "IS_NULL",
      /**
       * Less or Equal
       * @public
       **/
      LESS_EQUAL: "LESS_EQUAL",
      /**
       * Less than
       * @public
       **/
      LESS_THAN: "LESS_THAN",
      /**
       * Like (simple pattern matching)
       * @public
       **/
      LIKE: "LIKE",
      /**
       * Match (pattern matching)
       * @public
       **/
      MATCH: "MATCH",
      /** @private */
      "NON-AGGREGATED": "NON-AGGREGATED",
      /**
       * Not Between
       * @public
       **/
      NOT_BETWEEN: "NOT_BETWEEN",
      /**
       * Not between
       * @public
       **/
      NOT_BETWEEN_EXCLUDING: "NOT_BETWEEN_EXCLUDING",
      /**
       * Not equal
       * @public
       **/
      NOT_EQUAL: "NOT_EQUAL",
      /**
       * Not match
       * @public
       **/
      NOT_MATCH: "NOT_MATCH",
      /**
       * Search
       * @public
       **/
      SEARCH: "SEARCH",
      /** @private */
      undefined: "UNDEFINED"
    };
    return ComparisonOperator;
  }
);
