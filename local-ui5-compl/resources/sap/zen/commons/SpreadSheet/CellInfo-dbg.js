/*!
 * SAPUI5
    (c) Copyright 2009-2020 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  "sap/zen/commons/SpreadSheet/CellInfo",
  [
    "sap/zen/commons/SpreadSheet/CXpDataCellValueType",
    "sap/zen/commons/SpreadSheet/CXpStyle"
  ],
  function (CXpDataCellValueType,CXpStyle ) {
    function CellInfo(){
      var that = this;
      var mValue;
      var mCellValueType;
      var mFormattedValue;
      var mFormatString;
      var mFormula;
      var mStyle;
      var mRowSpan = 0;
      var mColSpan = 0;
      that.setValue = function( value  ){
        mValue = value;
        if( mValue === null ){
          mValue = that.getValue();
        }
      };
      that.setValueType = function( cellValueType ){
        mCellValueType = cellValueType;
        if( that.mCellValueType == null ){
          mCellValueType = that.getValueType();
        }
      };
      that.setFormattedValue = function(  formattedValue ){
        mFormattedValue = formattedValue;
        if( mFormattedValue == null ){
          mFormattedValue = that.getFormattedValue();
        }
      };
      that.setFormatString = function(  formatString ){
        mFormatString = formatString;
        if( mFormatString == null )
        {
          mFormatString = that.getFormatString();
        }
      };
      that.setFormula = function( formula ){
        mFormula = formula;
        if( mFormula == null )
        {
          mFormula = this.getFormula();
        }
      };
      that.setStyle = function( style ){
        mStyle = style;
        if( mStyle == null ){
          mStyle = that.getStyle();
        }
      };
      that.setRowSpan = function(  rowSpan ){
        mRowSpan = rowSpan;
      };
      that.setColSpan = function(colSpan ){
        mColSpan = colSpan;
      };
      that.getValue = function(){
        if( mValue == null ){
          mValue = ""; //$NON-NLS-1$
        }
        return mValue;
      };
      that.getValueType = function(){
        if( mCellValueType == null ){
          mCellValueType = CXpDataCellValueType.STANDARD;
        }
        return mCellValueType;
      };
      that.getFormattedValue = function(){
        if( mFormattedValue == null ){
          mFormattedValue = that.getValue();
        }
        return mFormattedValue;
      };
      that.getFormatString = function(){
        if( mFormatString == null ){
          mFormatString = "";
        }
        return mFormatString;
      };
      that.getFormula = function(){
        return mFormula;
      };
      that.getStyle = function(){
        if( mStyle == null ){
          mStyle = CXpStyle.STANDARD;
        }
        return mStyle;
      };
      that.getRowSpan=function(){
        return mRowSpan;
      };
      that.getColSpan = function(){
        return mColSpan;
      };
    }
    return CellInfo;
  }
);
