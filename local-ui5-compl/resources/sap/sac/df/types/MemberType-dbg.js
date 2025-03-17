/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap */
sap.ui.define(
  "sap/sac/df/types/MemberType",
  [
  ],
  function(){
    /**
     * Type of a Member
     *
     * @enum {string}
     * @alias sap.sac.df.types.MemberType
     * @private
     */
    var MemberType = {
      /**
       * Abstract Member
       * @private
       */
      AbstractMember: "AbstractMember",
      /**
       * Basic Measure
       * @public
       */
      BasicMeasure: "BasicMeasure",
      /**
       * Condition Others Result
       * @public
       */
      ConditionOthersResult: "ConditionOthersResult",
      /**
       * Condition Result
       * @public
       */
      ConditionResult: "ConditionResult",
      /**
       * Currency Measure
       * @public
       */
      CurrencyMeasure: "CurrencyMeasure",
      /**
       * Drill Path Element
       * @public
       */
      DrillPathElement: "DrillPathElement",
      /**
       * Exception Aggregation
       * @public
       */
      ExceptionAggregation: "ExceptionAggregation",
      /**
       * Field Value
       * @public
       */
      FieldValue: "FieldValue",
      /**
       * Formula Member
       * @public
       */
      FormulaMember: "FormulaMember",
      /**
       * Hierarchy Node
       * @public
       */
      HierarchyNode: "HierarchyNode",
      /**
       * Literal Member
       * @public
       */
      LiteralMember: "LiteralMember",
      /**
       * Measure
       * @public
       */
      Measure: "Measure",
      /**
       * Member
       * @public
       */
      Member: "Member",
      /**
       * Members Exit
       * @public
       */
      MembersExit: "MembersExit",
      /**
       * Restricted Measure
       * @public
       */
      RestrictedMeasure: "RestrictedMeasure",
      /**
       * Result Member
       * @public
       */
      ResultMember: "ResultMember",
      /**
       * Select Value
       * @public
       */
      SelectValue: "SelectValue",
      /**
       * Server Based Formula
       * @public
       */
      ServerBasedFormula: "ServerBasedFormula",
      /**
       * Single Member Exit
       * @public
       */
      SingleMemberExit: "SingleMemberExit",
      /**
       * Tuple Element
       * @public
       */
      TupleElement: "TupleElement",
      /**
       * Tuple Element as Member
       * @public
       */
      TupleElementAsMember: "TupleElementAsMember",
      /**
       * Tuple Element as Node
       * @public
       */
      TupleElementAsNode: "TupleElementAsNode",
      /**
       * Value Help Element
       * @public
       */
      ValueHelpElement: "ValueHelpElement",
      /**
       * Value Help Leaf
       * @public
       */
      ValueHelpLeaf: "ValueHelpLeaf",
      /**
       * Value Help Node
       * @public
       */
      ValueHelpNode: "ValueHelpNode",
      /**
       * Value Help Root Node
       * @public
       */
      ValueHelpRootNode: "ValueHelpRootNode",
      /**
       * Value Help Splitter Node
       * @public
       */
      ValueHelpSplitterNode: "ValueHelpSplitterNode",
      /**
       * Value Help Window Splitter Node
       * @public
       */
      ValueHelpWindowSplitterNode: "ValueHelpWindowSplitterNode",
      /**
       * Variance
       * @public
       */
      Variance: "Variance"
    };
    return MemberType;
  }
);
