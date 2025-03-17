/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  "sap/sac/df/types/DimensionType",
  [
  ],
  function(){
    /**
     * Type of a Dimension
     *
     * @enum {string}
     * @alias sap.sac.df.types.DimensionType
     * @private
     */
    var DimType = {
      /**
       * Abstract Structure
       * @public
       */
      AbstractStructure: "AbstractStructure",
      /**
       * Account Dimension
       * @public
       */
      AccountDimension: "AccountDimension",
      /**
       * Attribute Dimension
       * @public
       */
      AttributeDimension: "AttributeDimension",
      /**
       * Calculated Dimension
       * @public
       */
      CalculatedDimension: "CalculatedDimension",
      /**
       * Container Dimension
       * @public
       */
      ContainerDimension: "ContainerDimension",
      /**
       * Currency Dimension
       * @public
       */
      CurrencyDimension: "CurrencyDimension",
      /**
       * Date Dimension
       * @public
       */
      DateDimension: "DateDimension",
      /**
       * Dimension
       * @public
       */
      Dimension: "Dimension",
      /**
       * Incomplete Dimension
       * @public
       */
      DimensionIncomplete: "DimensionIncomplete",
      /**
       * @private
       */
      FamCalculatedDimension: "FamCalculatedDimension",
      /**
       * @private
       */
      FormulaCalculatedDimension: "FormulaCalculatedDimension",
      /**
       * Geo Dimension
       * @public
       */
      GisDimension: "GisDimension",
      /**
       * Hierarchy Name Dimension
       * @public
       */
      HierarchyNameDimension: "HierarchyNameDimension",
      /**
       * Hierarchy Version Dimension
       * @public
       */
      HierarchyVersionDimension: "HierarchyVersionDimension",
      /**
       * @private
       */
      MbfCalculatedDimension: "MbfCalculatedDimension",
      /**
       * Measure Dimension
       * @public
       */
      MeasureStructure: "MeasureStructure",
      /**
       * Structure Dimension
       * @public
       */
      StructureDimension: "NonMeasureStructure",
      /**
       * Presentation Dimension
       * @public
       */
      PresentationDimension: "PresentationDimension",
      /**
       * Search Dimension
       * @public
       */
      SearchDimension: "SearchDimension",
      /**
       * Search Result Dimension
       * @public
       */
      SearchResultDimension: "SearchResultDimension",
      /**
       * Non Measure Structure
       * @public
       */
      SecondaryStructure: "SecondaryStructure",
      /**
       * @private
       */
      SuggestAttributeDimension: "SuggestAttributeDimension",
      /**
       * @private
       */
      SuggestScopeDimension: "SuggestScopeDimension",
      /**
       * @private
       */
      SuggestTermDimension: "SuggestTermDimension",
      /**
       * Time Dimension
       * @public
       */
      TimeDimension: "TimeDimension",
      /**
       * Unit Dimension
       * @public
       */
      UnitDimension: "UnitDimension",
      /**
       * Version Dimension
       * @public
       */
      VersionDimension: "VersionDimension"
    };
    return DimType;
  }
);
