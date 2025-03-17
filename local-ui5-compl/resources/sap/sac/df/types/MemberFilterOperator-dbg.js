/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap */
sap.ui.define("sap/sac/df/types/MemberFilterOperator",
  ["sap/sac/df/types/ComparisonOperator"],
  function (ComparisonOperator) {
    "use strict";

    /**
     * Operators for the member filter {@link sap.sac.df.model.MemberFilter}
     *
     * @enum {object}
     * @alias sap.sac.df.types.MemberFilterOperator
     * @private
     */
    var MemberFilterOperator = {
      /**
       * FilterOperator equals
       * @public
       */
      EQ: [
        {
          Operator: ComparisonOperator.EQUAL,
          Sign: "INCLUDING"
        },
        {
          Operator: ComparisonOperator.NOT_EQUAL,
          Sign: "EXCLUDING"
        }
      ],

      /**
       * FilterOperator not equals
       * @public
       */
      NE: [
        {
          Operator: ComparisonOperator.NOT_EQUAL,
          Sign: "INCLUDING"
        },
        {
          Operator: ComparisonOperator.EQUAL,
          Sign: "EXCLUDING"
        }
      ],

      /**
       * FilterOperator less than
       * @public
       */
      LT: [{
        Operator: ComparisonOperator.LESS_THAN,
        Sign: "INCLUDING"
      },
      {
        Operator: ComparisonOperator.GREATER_THAN,
        Sign: "EXCLUDING"
      }],

      /**
       * FilterOperator less or equals
       * @public
       */
      LE: [{
        Operator: ComparisonOperator.LESS_EQUAL,
        Sign: "INCLUDING"
      },
      {
        Operator: ComparisonOperator.GREATER_EQUAL,
        Sign: "EXCLUDING"
      }],

      /**
       * FilterOperator greater than
       * @public
       */
      GT: [{
        Operator: ComparisonOperator.GREATER_THAN,
        Sign: "INCLUDING"
      },
      {
        Operator: ComparisonOperator.LESS_THAN,
        Sign: "EXCLUDING"
      }],

      /**
       * FilterOperator greater or equals
       * @public
       */
      GE: [{
        Operator: ComparisonOperator.GREATER_EQUAL,
        Sign: "INCLUDING"
      },
      {
        Operator: ComparisonOperator.LESS_EQUAL,
        Sign: "EXCLUDING"
      }],

      /**
       * FilterOperator between
       * @public
       */
      BT: [
        {
          Operator: ComparisonOperator.BETWEEN,
          Sign: "INCLUDING"
        },
        {
          Operator: ComparisonOperator.NOT_BETWEEN,
          Sign: "EXCLUDING"
        }
      ],

      /**
       * FilterOperator "Not Between"
       * @public
       */
      NB: [
        {
          Operator: ComparisonOperator.NOT_BETWEEN,
          Sign: "INCLUDING"
        },
        {
          Operator: ComparisonOperator.BETWEEN,
          Sign: "EXCLUDING"
        }
      ],

      /**
       * FilterOperator contains
       * @public
       */
      Contains: [{
        Operator: ComparisonOperator.LIKE,
        Sign: "INCLUDING"
      }],

      /**
       * FilterOperator not contains
       * @public
       */
      NotContains: [{
        Operator: ComparisonOperator.LIKE,
        Sign: "EXCLUDING"
      }],

      /**
       * FilterOperator starts with
       * @public
       */
      StartsWith: [{
        Operator: ComparisonOperator.LIKE,
        Sign: "INCLUDING"
      }],

      /**
       * FilterOperator not starts with
       * @public
       */
      NotStartsWith: [{
        Operator: ComparisonOperator.LIKE,
        Sign: "EXCLUDING"
      }],

      /**
       * FilterOperator ends with
       * @public
       */
      EndsWith:  [{
        Operator: ComparisonOperator.LIKE,
        Sign: "INCLUDING"
      }],

      /**
       * FilterOperator not ends with
       * @public
       */
      NotEndsWith:  [{
        Operator: ComparisonOperator.LIKE,
        Sign: "EXCLUDING"
      }]

    };

    return MemberFilterOperator;

  });
