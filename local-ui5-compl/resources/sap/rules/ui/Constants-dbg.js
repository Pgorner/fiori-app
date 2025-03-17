/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

/************************************************************************
 ******************************* Constants ******************************
 ************************************************************************/

sap.ui.define(function() {
	"use strict";

	var Constants = {};

	// Statements type
	Constants.EDITABLE = "Editable";
	Constants.HIDDEN = "Hidden";
	Constants.KEY_EDITABLE = "editableAccess";
	Constants.KEY_HIDDEN = "hiddenAccess";
	Constants.NO_RESULT = "NO_RESULT";
	Constants.KEY_ACCESSMODE = "AccessMode";
	Constants.PREDEFINED_RESULT = "PredefinedResult";
	Constants.DATE_BUSINESS_TYPE = "Date";
	Constants.TIMESTAMP_BUSINESS_TYPE = "Timestamp";
	Constants.BOOLEAN_BUSINESS_TYPE = "Boolean";
	Constants.BOOLEAN_ENHANCED_BUSINESS_TYPE = "BooleanEnhanced";
	Constants.GEOMETRY_BUSINESS_TYPE = "Geometry";
	Constants.NUMBER = "Number";
	Constants.STRING = "String";
	Constants.PROPERTY_VALUE = "Value";
	Constants.PROPERTY_DESCRIPTION = "Description";
	Constants.IS_EQUAL_TO = "is equal to";
	Constants.MARKER_STRING = "gggg";
	Constants.MAX_LABEL_LENGTH = 50;
	Constants.UP = "UP";
	Constants.DOWN = "DOWN";
	Constants.CONDITION = "CONDITION";
	Constants.OPERATOR_MAPPING = [{valueHelpType:"U",operator:"EQ",exclude:false,supported:true,message:"equal to"},
		{valueHelpType:"O",operator:"EQ",exclude:false,supported:true,message:"equal to"},
		{valueHelpType:"U",operator:"Contains",exclude:false,supported:true,message:"contains"},
		{valueHelpType:"O",operator:"Contains",exclude:false,supported:true,message:"contains"},
		{valueHelpType:"U",operator:"EQ",exclude:true,supported:true,message:"equal to"},
		{valueHelpType:"O",operator:"EQ",exclude:true,supported:true,message:"equal to"},
		{valueHelpType:"U",operator:"Contains",exclude:true,supported:false,message:"does not contain"},
		{valueHelpType:"O",operator:"Contains",exclude:true,supported:false,message:"does not contain"},
		{valueHelpType:"U",operator:"BT",exclude:false,supported:true,message:"between"},
		{valueHelpType:"O",operator:"BT",exclude:false,supported:false,message:"between"},
		{valueHelpType:"U",operator:"BT",exclude:true,supported:false,message:"not between"},
		{valueHelpType:"O",operator:"BT",exclude:true,supported:false,message:"not between"},
		{valueHelpType:"U",operator:"StartsWith",exclude:false,supported:false,message:"starts with"},
		{valueHelpType:"O",operator:"StartsWith",exclude:false,supported:false,message:"starts with"},
		{valueHelpType:"U",operator:"StartsWith",exclude:true,supported:false,message:"does not start with"},
		{valueHelpType:"O",operator:"StartsWith",exclude:true,supported:false,message:"does not start with"},
		{valueHelpType:"U",operator:"EndsWith",exclude:false,supported:false,message:"ends with"},
		{valueHelpType:"O",operator:"EndsWith",exclude:false,supported:false,message:"ends with"},
		{valueHelpType:"U",operator:"EndsWith",exclude:true,supported:false,message:"does not end with"},
		{valueHelpType:"O",operator:"EndsWith",exclude:true,supported:false,message:"does not end with"},
		{valueHelpType:"U",operator:"LT",exclude:false,supported:true,message:"less than"},
		{valueHelpType:"O",operator:"LT",exclude:false,supported:false,message:"less than"},
		{valueHelpType:"U",operator:"LT",exclude:true,supported:true,message:"not less than"},
		{valueHelpType:"O",operator:"LT",exclude:true,supported:false,message:"not less than"},
		{valueHelpType:"U",operator:"LE",exclude:false,supported:true,message:"less than equal to"},
		{valueHelpType:"O",operator:"LE",exclude:false,supported:false,message:"less than equal to"},
		{valueHelpType:"U",operator:"LE",exclude:true,supported:true,message:"not less than equal to"},
		{valueHelpType:"O",operator:"LE",exclude:true,supported:false,message:"not less than equal to"},
		{valueHelpType:"U",operator:"GT",exclude:false,supported:true,message:"greater than"},
		{valueHelpType:"O",operator:"GT",exclude:false,supported:false,message:"greater than"},
		{valueHelpType:"U",operator:"GT",exclude:true,supported:true,message:"not greater than"},
		{valueHelpType:"O",operator:"GT",exclude:true,supported:false,message:"not greater than"},
		{valueHelpType:"U",operator:"GE",exclude:false,supported:true,message:"greater than equal to"},
		{valueHelpType:"O",operator:"GE",exclude:false,supported:false,message:"greater than equal to"},
		{valueHelpType:"U",operator:"GE",exclude:true,supported:true,message:"not greater than equal to"},
		{valueHelpType:"O",operator:"GE",exclude:true,supported:false,message:"not greater than equal to"},
		{valueHelpType:"U",operator:"Empty",exclude:false,supported:false,message:"empty"},
		{valueHelpType:"O",operator:"Empty",exclude:false,supported:false,message:"empty"},
		{valueHelpType:"U",operator:"Empty",exclude:true,supported:false,message:"not empty"},
		{valueHelpType:"O",operator:"Empty",exclude:true,supported:false,message:"not empty"}];
	return Constants;
	
}, true);