/* global QUnit, sinon */
sap.ui.define([
	"sap/ui/core/library",
	"sap/ui/comp/library",
	"sap/ui/core/Control",
	"sap/m/DateTimePicker",
	"sap/m/Input",
	"sap/m/Text",
	"sap/m/TextArea",
	"sap/m/Select",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/odata/ODataMetaModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/ParseException",
	"sap/ui/model/ValidateException",
	"sap/ui/comp/smartfield/UoMValidateException",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartfield/JSONControlFactory",
	"sap/ui/comp/smartfield/ODataControlFactory",
	"sap/ui/comp/smartfield/type/DateTimeOffset",
	"sap/ui/comp/smartfield/type/String",
	"sap/ui/comp/smartfield/type/TextArrangementString",
	"sap/ui/comp/smartfield/Configuration",
	"sap/ui/qunit/utils/nextUIUpdate",
	"test-resources/sap/ui/comp/qunit/smartfield/data/TestModel.data",
	"sap/ui/comp/smartfield/ODataHelper",
	"sap/ui/comp/smartfield/TextArrangementRead",
	"sap/ui/model/DataState",
	"sap/ui/model/odata/ODataPropertyBinding",
	"sap/ui/model/odata/type/ODataType",
	"sap/ui/core/RenderManager",
	"sap/ui/thirdparty/jquery",
	"sap/m/HBox",
	"sap/ui/base/Event",
	"sap/ui/comp/smartform/GroupElement"
], 	function(
	coreLibrary,
	compLibrary,
	Control,
	DateTimePicker,
	Input,
	Text,
	TextArea,
	Select,
	ODataModel,
	ODataMetaModel,
	JSONModel,
	ParseException,
	ValidateException,
	UoMValidateException,
	SmartField,
	JSONControlFactory,
	ODataControlFactory,
	DateTimeOffset,
	StringType,
	TextArrangementString,
	Configuration,
	nextUIUpdate,
	TestModelDataSet,
	ODataHelper,
	TextArrangementRead,
	DataState,
	ODataPropertyBinding,
	ODataType,
	RenderManager,
	jQuery,
	HBox,
	Event,
	GroupElement
) {
	"use strict";

	var ValueState = coreLibrary.ValueState;
	var Wrapping = coreLibrary.Wrapping;
	var ControlContextType = compLibrary.smartfield.ControlContextType;
	var ControlType = compLibrary.smartfield.ControlType;
	var DisplayBehaviour = compLibrary.smartfield.DisplayBehaviour;
	var TextInEditModeSource = compLibrary.smartfield.TextInEditModeSource;

	var fnPatchSetContentAggregation = function(oControl, fnHandler) {
		oControl.__origSetAggregation = oControl.__origSetAggregation || oControl.setAggregation;
		oControl.setAggregation = function(sAggregation) {
			if (sAggregation === "_content") {
				return fnHandler.call(this);
			} else {
				return this.__origSetAggregation.apply(this, arguments);
			}
		};
	};

	var fnPatchGetContentAggregation = function(oControl, fnHandler) {
		oControl.__origGetAggregation = oControl.__origGetAggregation || oControl.getAggregation;
		oControl.getAggregation = function(sAggregation) {
			if (sAggregation === "_content") {
				return fnHandler.call(this);
			} else {
				return this.__origGetAggregation.apply(this, arguments);
			}
		};
	};

	var oTestEntitySet = {
		"name": "Project",
		"entityType": "ZMEY_SRV.Project_Type",
		"extensions": [{
			"name": "pageable",
			"value": "false",
			"namespace": "http://www.sap.com/Protocols/SAPData"
		},
			{
				"name": "addressable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "content-version",
				"value": "1",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "updatable-path",
				"value": "Properties/EntityUpdatable",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
		"sap:pageable": "false",
		"Org.OData.Capabilities.V1.SkipSupported": {
			"Bool": "false"
		},
		"Org.OData.Capabilities.V1.TopSupported": {
			"Bool": "false"
		},
		"sap:addressable": "false",
		"sap:content-version": "1",
		"sap:updatable-path": "Properties/EntityUpdatable",
		"Org.OData.Capabilities.V1.UpdateRestrictions": {
			"Updatable": {
				"Path": "Properties/EntityUpdatable"
			}
		},
		"Org.OData.Capabilities.V1.SearchRestrictions": {
			"Searchable": {
				"Bool": "false"
			}
		},
		"Org.OData.Capabilities.V1.FilterRestrictions": {
			"NonFilterableProperties": [{
				"PropertyPath": "ID"
			},
				{
					"PropertyPath": "Name"
				},
				{
					"PropertyPath": "Description"
				},
				{
					"PropertyPath": "StartDate"
				},
				{
					"PropertyPath": "StartTime"
				},
				{
					"PropertyPath": "StartDateTime"
				},
				{
					"PropertyPath": "Amount"
				},
				{
					"PropertyPath": "AmountCurrency"
				},
				{
					"PropertyPath": "Quantity"
				},
				{
					"PropertyPath": "QuantityUnit"
				},
				{
					"PropertyPath": "Description_Required"
				},
				{
					"PropertyPath": "Description_ReadOnly"
				},
				{
					"PropertyPath": "Description_Hidden"
				},
				{
					"PropertyPath": "Description_FC"
				},
				{
					"PropertyPath": "StartDate_Required"
				},
				{
					"PropertyPath": "StartDate_ReadOnly"
				},
				{
					"PropertyPath": "StartDate_Hidden"
				},
				{
					"PropertyPath": "StartDate_FC"
				},
				{
					"PropertyPath": "EntityUpdatable_FC"
				},
				{
					"PropertyPath": "Released"
				},
				{
					"PropertyPath": "ReleaseActionEnabled_FC"
				},
				{
					"PropertyPath": "BigInteger"
				}]
		},
		"Org.OData.Capabilities.V1.SortRestrictions": {
			"NonSortableProperties": [{
				"PropertyPath": "ID"
			},
				{
					"PropertyPath": "Name"
				},
				{
					"PropertyPath": "Description"
				},
				{
					"PropertyPath": "StartDate"
				},
				{
					"PropertyPath": "StartTime"
				},
				{
					"PropertyPath": "StartDateTime"
				},
				{
					"PropertyPath": "Amount"
				},
				{
					"PropertyPath": "AmountCurrency"
				},
				{
					"PropertyPath": "Quantity"
				},
				{
					"PropertyPath": "QuantityUnit"
				},
				{
					"PropertyPath": "Description_Required"
				},
				{
					"PropertyPath": "Description_ReadOnly"
				},
				{
					"PropertyPath": "Description_Hidden"
				},
				{
					"PropertyPath": "Description_FC"
				},
				{
					"PropertyPath": "StartDate_Required"
				},
				{
					"PropertyPath": "StartDate_ReadOnly"
				},
				{
					"PropertyPath": "StartDate_Hidden"
				},
				{
					"PropertyPath": "StartDate_FC"
				},
				{
					"PropertyPath": "EntityUpdatable_FC"
				},
				{
					"PropertyPath": "Released"
				},
				{
					"PropertyPath": "ReleaseActionEnabled_FC"
				},
				{
					"PropertyPath": "BigInteger"
				}]
		}
	};

	var oTestEntityType = {
		"name": "Project_Type",
		"key": {
			"propertyRef": [{
				"name": "ID"
			}]
		},
		"property": [{
			"name": "ID",
			"type": "Edm.Int32",
			"nullable": "false",
			"extensions": [{
				"name": "creatable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "updatable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:creatable": "false",
			"sap:updatable": "false",
			"sap:sortable": "false",
			"sap:filterable": "false",
			"Org.OData.Core.V1.Computed": {
				"Bool": "true"
			}
		},
		{
			"name": "Name",
			"type": "Edm.String",
			"nullable": "false",
			"maxLength": "24",
			"extensions": [{
				"name": "field-control",
				"value": "Properties/Name_FC",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "label",
				"value": "Name",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:field-control": "Properties/Name_FC",
			"com.sap.vocabularies.Common.v1.FieldControl": {
				"Path": "Properties/Name_FC"
			},
			"sap:label": "Name",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Name"
			},
			"sap:sortable": "false",
			"sap:filterable": "false"
		},
		{
			"name": "Description",
			"type": "Edm.String",
			"nullable": "false",
			"maxLength": "80",
			"extensions": [{
				"name": "field-control",
				"value": "Description_FC",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "label",
				"value": "Description",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:field-control": "Description_FC",
			"com.sap.vocabularies.Common.v1.FieldControl": {
				"Path": "Description_FC"
			},
			"sap:label": "Description",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Description"
			},
			"sap:sortable": "false",
			"sap:filterable": "false"
		},
			{
				"name": "StartDate",
				"type": "Edm.DateTime",
				"precision": "0",
				"extensions": [{
					"name": "display-format",
					"value": "Date",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "field-control",
					"value": "StartDate_FC",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "label",
					"value": "Start Date",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:display-format": "Date",
				"sap:field-control": "StartDate_FC",
				"com.sap.vocabularies.Common.v1.FieldControl": {
					"Path": "StartDate_FC"
				},
				"sap:label": "Start Date",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Start Date"
				},
				"sap:sortable": "false",
				"sap:filterable": "false"
			},
			{
				"name": "StartTime",
				"type": "Edm.Time",
				"precision": "0",
				"extensions": [{
					"name": "label",
					"value": "Start Time",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Start Time",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Start Time"
				},
				"sap:sortable": "false",
				"sap:filterable": "false",
				"com.sap.vocabularies.Common.v1.FieldControl": {
					"Path": "StartDate_FC"
				}
			},
			{
				"name": "StartDateTime",
				"type": "Edm.DateTimeOffset",
				"precision": "0",
				"documentation": [{
					"text": null,
					"extensions": [{
						"name": "Summary",
						"value": "The UTC timestamp is the date and time relative to the UTC (Universal coordinated time).",
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					},
					{
						"name": "LongDescription",
						"value": "To normalize local times in a UTC time stamp and make them comparable, they must be converted using their time zone and the ABAP command convert.\nAlthough the time zone for the conversion can be fetched from customizing or master data, you should save it redundantly.\nThe internal structure of the UTC time stamp is logically divided into a date and time part in packed number format <YYYYMMDDhhmmss>. There is also a high resolution UTC time stamp (10^-7 seconds).",
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					}]
				}],
				"extensions": [{
					"name": "label",
					"value": "Start Date and Time",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "Time Stamp",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "UTC Time Stamp in Short Form (YYYYMMDDhhmmss)",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Start Date and Time",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Start Date and Time"
				},
				"sap:heading": "Time Stamp",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "Time Stamp"
				},
				"sap:quickinfo": "UTC Time Stamp in Short Form (YYYYMMDDhhmmss)",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "UTC Time Stamp in Short Form (YYYYMMDDhhmmss)"
				},
				"sap:sortable": "false",
				"sap:filterable": "false",
				"com.sap.vocabularies.Common.v1.FieldControl": {
					"If": [{
						"Path": "Released"
					},
					{
						"Int": "1"
					},
					{
						"Int": "3"
					}]
				}
			},
			{
				"name": "StartDateStr",
				"type": "Edm.String",
				"precision": "0",
				"extensions": [{
					"name": "semantics",
					"value": "yearmonthday",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "label",
					"value": "Start Date (via Semantics)",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:semantics": "yearmonthday",
				"sap:label": "Start Date",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Start Date"
				},
				"sap:sortable": "false",
				"sap:filterable": "false"
			},
			{
				"name": "Amount",
				"type": "Edm.Decimal",
				"nullable": "false",
				"precision": "11",
				"scale": "2",
				"documentation": [{
					"text": null,
					"extensions": [{
						"name": "Summary",
						"value": "Price for external processing.",
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					},
					{
						"name": "LongDescription",
						"value": null,
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					}]
				}],
				"extensions": [{
					"name": "unit",
					"value": "AmountCurrency",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
					{
						"name": "label",
						"value": "Price",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
				"sap:unit": "AmountCurrency",
				"sap:label": "Price",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Price"
				},
				"sap:sortable": "false",
				"sap:filterable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "AmountCurrency"
				}
			},
			{
				"name": "AmountCurrency",
				"type": "Edm.String",
				"nullable": "false",
				"maxLength": "5",
				"documentation": [{
					"text": null,
					"extensions": [{
						"name": "Summary",
						"value": "Currency key for amounts in the system.",
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					},
					{
						"name": "LongDescription",
						"value": null,
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					}]
				}],
				"extensions": [{
					"name": "label",
					"value": "Currency",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
					{
						"name": "heading",
						"value": "Crcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Currency Key",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
				"sap:label": "Currency",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Currency"
				},
				"sap:heading": "Crcy",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "Crcy"
				},
				"sap:quickinfo": "Currency Key",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "Currency Key"
				},
				"sap:sortable": "false",
				"sap:filterable": "false",
				"sap:semantics": "currency-code"
			},
			{
				"name": "Quantity",
				"type": "Edm.Decimal",
				"nullable": "false",
				"precision": "13",
				"scale": "3",
				"documentation": [{
					"text": null,
					"extensions": [{
						"name": "Summary",
						"value": "Total quantity (including scrap) to be produced in this order.",
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					},
					{
						"name": "LongDescription",
						"value": null,
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					}]
				}],
				"extensions": [{
					"name": "unit",
					"value": "QuantityUnit",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
					{
						"name": "label",
						"value": "Quantity",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Total order quantity",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Total order quantity",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
				"sap:unit": "QuantityUnit",
				"sap:label": "Quantity",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Quantity"
				},
				"sap:heading": "Total order quantity",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "Total order quantity"
				},
				"sap:quickinfo": "Total order quantity",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "Total order quantity"
				},
				"sap:sortable": "false",
				"sap:filterable": "false",
				"Org.OData.Measures.V1.Unit": {
					"Path": "QuantityUnit"
				}
			},
			{
				"name": "QuantityUnit",
				"type": "Edm.String",
				"nullable": "false",
				"maxLength": "3",
				"documentation": [{
					"text": null,
					"extensions": [{
						"name": "Summary",
						"value": "Unit of measure in which stocks of the material are managed. The system converts all the quantities you enter in other units of measure (alternative units of measure) to the base unit of measure.",
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					},
					{
						"name": "LongDescription",
						"value": "You define the base unit of measure and also alternative units of measure and their conversion factors in the material master record.\nSince all data is updated in the base unit of measure, your entry is particularly important for the conversion of alternative units of measure. A quantity in the alternative unit of measure can only be shown precisely if its value can be shown with the decimal places available. To ensure this, please note the following:\nThe base unit of measure is the unit satisfying the highest necessary requirement for precision.\nThe conversion of alternative units of measure to the base unit should result in simple decimal fractions (not, for example, 1/3 = 0.333...).\nInventory Management\nIn Inventory Management, the base unit of measure is the same as the stockkeeping unit.\nServices\nServices have units of measure of their own, including the following:\nService unit\nUnit of measure at the higher item level. The precise quantities of the individual services are each at the detailed service line level.\nBlanket\nUnit of measure at service line level for services to be provided once only, and for which no precise quantities can or are to be specified.",
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					}]
				}],
				"extensions": [{
					"name": "label",
					"value": "Unit",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "BUn",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "Base Unit of Measure",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "semantics",
					"value": "unit-of-measure",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Unit",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Unit"
				},
				"sap:heading": "BUn",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "BUn"
				},
				"sap:quickinfo": "Base Unit of Measure",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "Base Unit of Measure"
				},
				"sap:sortable": "false",
				"sap:filterable": "false",
				"sap:semantics": "unit-of-measure"
			},
			{
				"name": "Description_Required",
				"type": "Edm.Boolean",
				"nullable": "false",
				"extensions": [{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
				"sap:sortable": "false",
				"sap:filterable": "false"
			},
			{
				"name": "Description_ReadOnly",
				"type": "Edm.Boolean",
				"nullable": "false",
				"extensions": [{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:sortable": "false",
				"sap:filterable": "false"
			},
			{
				"name": "Description_Hidden",
				"type": "Edm.Boolean",
				"nullable": "false",
				"extensions": [{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:sortable": "false",
				"sap:filterable": "false"
			},
			{
				"name": "Description_FC",
				"type": "Edm.Byte",
				"nullable": "false",
				"extensions": [{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:creatable": "false",
				"sap:updatable": "false",
				"sap:sortable": "false",
				"sap:filterable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "StartDate_Required",
				"type": "Edm.Boolean",
				"nullable": "false",
				"extensions": [{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:sortable": "false",
				"sap:filterable": "false"
			},
			{
				"name": "StartDate_ReadOnly",
				"type": "Edm.Boolean",
				"nullable": "false",
				"extensions": [{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:sortable": "false",
				"sap:filterable": "false"
			},
			{
				"name": "StartDate_Hidden",
				"type": "Edm.Boolean",
				"nullable": "false",
				"extensions": [{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:sortable": "false",
				"sap:filterable": "false"
			},
			{
				"name": "StartDate_FC",
				"type": "Edm.Byte",
				"nullable": "false",
				"extensions": [{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:creatable": "false",
				"sap:updatable": "false",
				"sap:sortable": "false",
				"sap:filterable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "EntityUpdatable_FC",
				"type": "Edm.Boolean",
				"nullable": "false",
				"extensions": [{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:creatable": "false",
				"sap:updatable": "false",
				"sap:sortable": "false",
				"sap:filterable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "Released",
				"type": "Edm.Boolean",
				"nullable": "false",
				"extensions": [{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:creatable": "false",
				"sap:updatable": "false",
				"sap:sortable": "false",
				"sap:filterable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "ReleaseActionEnabled_FC",
				"type": "Edm.Boolean",
				"nullable": "false",
				"extensions": [{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:creatable": "false",
				"sap:updatable": "false",
				"sap:sortable": "false",
				"sap:filterable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "BigInteger",
				"type": "Edm.Int64",
				"nullable": "false",
				"extensions": [{
					"name": "label",
					"value": "Big Integer",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Big Integer",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Big Integer"
				},
				"sap:sortable": "false",
				"sap:filterable": "false"
			}],
		"navigationProperty": [{
			"name": "Properties",
			"relationship": "ZMEY_SRV.ProjectProperties",
			"fromRole": "FromRole_ProjectProperties",
			"toRole": "ToRole_ProjectProperties"
		},
		{
			"name": "Tasks",
			"relationship": "ZMEY_SRV.ProjectTask",
			"fromRole": "FromRole_ProjectTask",
			"toRole": "ToRole_ProjectTask"
		}],
		"extensions": [{
			"name": "content-version",
			"value": "1",
			"namespace": "http://www.sap.com/Protocols/SAPData"
		}],
		"sap:content-version": "1",
		"namespace": "ZMEY_SRV",
		"$path": "/dataServices/schema/0/entityType/0"
	};

	var oTestProperty = {
		"property": {
			"name": "Name",
			"type": "Edm.String",
			"nullable": "false",
			"maxLength": "24",
			"extensions": [
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "label",
					"value": "Document Number",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "Accounting Document Number",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}
			]
		},
		"extensions": {
			"sap:label": {
				"name": "label",
				"value": "Document Number",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			"sap:quickinfo": {
				"name": "filterable",
				"value": "Accounting Document Number",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			"sap:sortable": {
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}
		},
		"typePath": "Name"
	};

	QUnit.module("sap.ui.comp.smartfield.SmartField", {
		beforeEach: function() {
			function findIndex(aArray, vExpectedPropertyValue, sPropertyName) {
				var iIndex = -1;

				sPropertyName = sPropertyName || "name";
				jQuery.each(aArray || [], function (i, oObject) {
					if (oObject[sPropertyName] === vExpectedPropertyValue) {
						iIndex = i;
						return false; // break
					}
				});

				return iIndex;
			}

			function getObject1(oModel, sArrayName, sQualifiedName, bAsPath) {
				var vResult = bAsPath ? undefined : null,
					iSeparatorPos,
					sNamespace,
					sName;

				sQualifiedName = sQualifiedName || "";
				iSeparatorPos = sQualifiedName.lastIndexOf(".");
				sNamespace = sQualifiedName.slice(0, iSeparatorPos);
				sName = sQualifiedName.slice(iSeparatorPos + 1);
				jQuery.each(oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
					if (oSchema.namespace === sNamespace) {
						jQuery.each(oSchema[sArrayName] || [], function (j, oThing) {
							if (oThing.name === sName) {
								vResult = bAsPath ? oThing.$path : oThing;
								return false; // break
							}
						});
						return false; // break
					}
				});

				return vResult;
			}

			this.oSmartField = new SmartField();
			this.oSmartField.getModel = function(sName) {
				var oModel;

				if (!sName) {
					oModel = sinon.createStubInstance(ODataModel);
					oModel.getServiceMetadata = function() {
						return TestModelDataSet.TestModel;
					};
					oModel.getMetaModel = function() {
						var oStub = sinon.createStubInstance(ODataMetaModel);
						oStub.oModel = new JSONModel(TestModelDataSet.TestModel);
						oStub.oData = TestModelDataSet.TestModel;
						oStub.getObject = function(sPath) {
							var oNode, aParts = sPath.split("/"), iIndex = 0;
							if (!aParts[0]) {
								// absolute path starting with slash
								oNode = this.oData;
								iIndex++;
							}
							while (oNode && aParts[iIndex]) {
								oNode = oNode[aParts[iIndex]];
								iIndex++;
							}
							return oNode;
						};
						oStub.getODataEntityContainer = function(bAsPath) {
							var vResult = bAsPath ? undefined : null;

							jQuery.each(this.oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
								var j = findIndex(oSchema.entityContainer, "true", "isDefaultEntityContainer");

								if (j >= 0) {
									vResult = bAsPath
										? "/dataServices/schema/" + i + "/entityContainer/" + j
										: oSchema.entityContainer[j];
									return false; //break
								}
							});

							return vResult;
						};
						oStub.getODataEntitySet = function(sName, bAsPath) {
							var k,
							oEntityContainer = this.getODataEntityContainer(),
							vResult = bAsPath ? undefined : null;

							if (oEntityContainer) {
								k = findIndex(oEntityContainer.entitySet, sName);
								if (k >= 0) {
									vResult = bAsPath
										? oEntityContainer.$path + "/entitySet/" + k
										: oEntityContainer.entitySet[k];
								}
							}

							return vResult;
						};
						oStub.getODataEntityType = function (sQualifiedName, bAsPath) {
							return getObject1(this.oModel, "entityType", sQualifiedName, bAsPath);
						};
						oStub.getODataProperty = function (oType, vName, bAsPath) {
							var i,
							aParts = Array.isArray(vName) ? vName : [vName],
							oProperty = null,
							sPropertyPath;

							while (oType && aParts.length) {
								i = findIndex(oType.property, aParts[0]);
								if (i < 0) {
									break;
								}

								aParts.shift();
								oProperty = oType.property[i];
								sPropertyPath = oType.$path + "/property/" + i;

								if (aParts.length) {
									// go to complex type in order to allow drill-down
									oType = this.getODataComplexType(oProperty.type);
								}
							}

							return bAsPath ? sPropertyPath : oProperty;
						};
						oStub.getODataComplexType = function (sQualifiedName, bAsPath) {
							return getObject1(this.oModel, "complexType", sQualifiedName, bAsPath);
						};
						oStub.loaded = function() {
							return Promise.resolve();
						};
						return oStub;
					};
					oModel.bindContext = function() {
						return {
							attachChange : function() {

							},
							attachEvents : function() {

							},
							initialize : function() {

							},
							getContext : function() {
								return null;
							}
						};
					};
					oModel.bindProperty = function() {
						return {
							setType : function() {

							},
							setFormatter : function() {

							},
							setBindingMode : function() {

							},
							attachChange : function() {

							},
							attachEvents : function() {

							},
							initialize : function() {

							},
							updateRequired : function() {
								return false;
							},
							detachChange : function() {

							},
							detachEvents : function() {

							},
							setContext : function() {

							}
						};
					};
					oModel.getId = function() {
						return "dummyId";
					};

					oModel.oMetadata = {
						bLoaded : true
					};
				}

				return oModel;
			};
			this.oSmartField.getBindingContext = function() {
				return {
					sPath : "/Project(71)",
					getPath: function() {
						return "/Project(71)";
					},
					getObject: function() {
						return {};
					},
					getModel: function() {
						return {
							getId: function() {
								return "dummyId";
							}
						};
					},
					getProperty: function(sPropertyName) {
						var sResult;

						if (sPropertyName === "dummyPropertyName") {
							sResult = "DescriptionValue";
						}

						return sResult;
					}
				};
			};
			this.oSmartField.mBindingInfos["value"] = {
				parts : [ {
					model : undefined,
					path : "ID"
				}]
			};
		},
		afterEach: function() {

		}
	});

	QUnit.test("Renderer should not raise exception when no base control is created", function(assert) {
		// Arrange
		var bIsExeptionThrown = false,
			oRenderer = this.oSmartField.getRenderer(),
			oRenderManager = new RenderManager();

		this.oSmartField.setContent(null);

		//Act
		try {
			oRenderer.render(oRenderManager, this.oSmartField);
		} catch (oError) {
			bIsExeptionThrown = true;
		}

		// Assert
		assert.ok(!bIsExeptionThrown, "Rendered is not raising exception");

		// Clean
		oRenderManager.destroy();
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oSmartField);
		assert.ok(!this.oSmartField.isContextTable());
	});

	QUnit.test("_init", function(assert) {
		this.oSmartField._init();
		assert.ok(this.oSmartField);
	});

	QUnit.test("Smartfield test getComputedTextLabel method", function(assert) {

		// Arrange
		var oSmartField = this.oSmartField,
			sCustomTextLabel = "Custom Text Label",
			sTextLabel = "Annotation text label";

		// Act
		oSmartField._sAnnotationLabel = sTextLabel;

		// Assert
		assert.equal(oSmartField.getComputedTextLabel(), sTextLabel, "text label is same as from metadata");

		// Act
		oSmartField.setTextLabel(sCustomTextLabel);

		// Assert
		assert.equal(oSmartField.getComputedTextLabel(), sCustomTextLabel, "text label set manually takes preference over " +
			"the one coming from metadata");
	});

	QUnit.test("Smartfield with textLabel set in xml view", function(assert) {

		// Arrange
		var oSmartField = this.oSmartField,
			sCustomTextLabel = "Custom Text Label";

		// Act
		oSmartField.setTextLabel(sCustomTextLabel);

		// Assert
		assert.equal(oSmartField.getComputedTextLabel(), sCustomTextLabel, "has custom text label");

		// Act
		oSmartField._sAnnotationLabel = "Annotation text label";

		// Assert
		assert.equal(oSmartField.getComputedTextLabel(), sCustomTextLabel, "text label set manually is not overridden by metadata");
	});

	QUnit.test("_createFactory for JSON model", function(assert) {
		var oModel, oInfo, oFactory;

		oModel = sinon.createStubInstance(JSONModel);
		oInfo = {
			parts : [ {
				model : "modelname",
				path : "value"
			}],
			model : "modelname"
		};

		oFactory = this.oSmartField._createFactory(null, oModel, oInfo);
		assert.equal(oFactory instanceof JSONControlFactory, true);

		oFactory.destroy();
	});

	QUnit.test("_createFactory for OData model - without configuration", function(assert) {
		var oModel = this.oSmartField.getModel();
		var sBindingPath = this.oSmartField.getBindingPath("value");
		var oFactory = this.oSmartField._createFactory(null, oModel, sBindingPath);
		assert.equal(oFactory instanceof ODataControlFactory, true);
		oFactory.destroy();
	});

	QUnit.test("_createFactory for OData model - with configuration", function(assert) {
		var oModel = this.oSmartField.getModel();
		var sBindingPath = this.oSmartField.getBindingPath("value");
		var oFactory = this.oSmartField._createFactory(null, oModel, sBindingPath, {
			configdata: {
				model: undefined,
				path: "Description",
				entitySet: "Project"
			}
		});
		assert.equal(oFactory instanceof ODataControlFactory, true);

		oFactory.destroy();
	});

	QUnit.test("_createFactory no params", function(assert) {
		var oModel, oInfo, oFactory;

		this.oSmartField.getBindingContext = function() {
			return null;
		};
		oFactory = this.oSmartField._createFactory(null, oModel, oInfo);
		assert.equal(!oFactory, true);
	});

	QUnit.test("updateBindingContext for JSON model", function(assert) {
		var oModel,
			oFactory,
			done = assert.async();

		oModel = sinon.createStubInstance(JSONModel);
		oFactory = new JSONControlFactory(oModel, this.oSmartField, { model : null, path : "value" });

		this.oSmartField._oFactory = oFactory;
		assert.equal(!this.oSmartField._oControl.current, true);
		this.oSmartField.updateBindingContext();

		this.oSmartField.onBeforeRendering().then(function(){
			// Assert
			assert.equal(this.oSmartField._oControl.current, "edit");
			done();
		}.bind(this));
	});

	QUnit.test("updateBindingContext - only model name", function(assert) {
		this.oSmartField.updateBindingContext(false, false, "model");
		assert.ok(this.oSmartField);
	});

	QUnit.test("BCP: 2170226806 updateBindingContext - named model", function(assert) {
		// Arrange
		var oSpy = this.spy(this.oSmartField, "_init"),
			done = assert.async();

		this.oSmartField.onBeforeRendering().then(function(){
			oSpy.reset();

			// Act
			this.oSmartField.updateBindingContext(undefined, "someModelName", undefined);

			// Assert
			assert.strictEqual(oSpy.callCount, 0,
			"Method execution should end immediately not even calling parent.");
		}.bind(this)).then(function(){
			// Act
			this.oSmartField.updateBindingContext(undefined, undefined, undefined);

			this.oSmartField.onBeforeRendering().then(function(){
				// Assert
				assert.strictEqual(oSpy.callCount, 1,
					"Method execution should call parent.");
				done();
			});
		}.bind(this));
	});

	QUnit.test("SmartField with TextArrangement - changeModelValue should be fired only once when onValidation is triggered with the same parameters", function(assert) {
		// Arrange
		var oFireChangeModelValueSpy = this.spy(this.oSmartField, "fireChangeModelValue"),
			oEventParameters = {
					oldValue: "111111",
					newValue: "1234567",
					mParameters: {
						originSource: this.oSmartField
					}
			},
			oEvent = sinon.createStubInstance(Event),
			oDataModel = this.oSmartField.getModel();

		oDataModel.getDefaultBindingMode.returns("TwoWay");
		sinon.stub(this.oSmartField, "getModel").returns(oDataModel);
		oEvent.getParameters.returns(oEventParameters);
		oEvent.getSource.returns(this.oSmartField);

		// Act
		this.oSmartField.onValidation(oEvent);
		this.oSmartField.onValidation(oEvent);

		// Assert
		assert.strictEqual(oFireChangeModelValueSpy.callCount, 1, 'it should fire a "changeModelValue" event only once');

		// Clean up
		oFireChangeModelValueSpy.reset();
		this.oSmartField.getModel.reset();
	});

	QUnit.test("setVisible", function(assert) {
		var oReturn;

		fnPatchGetContentAggregation(this.oSmartField, function() {
			return {
				setProperty : function(sName, oValue) {
					assert.equal(sName, "visible");
					assert.equal(oValue, true);
				}
			};
		});

		oReturn = this.oSmartField.setVisible(true);
		assert.equal(this.oSmartField.getProperty("visible"), true);
		assert.equal(this.oSmartField, oReturn);
	});

	QUnit.test("setValue", function(assert) {
		var oReturn = this.oSmartField.setValue(true);
		assert.equal(this.oSmartField.getProperty("value"), true);
		assert.equal(this.oSmartField, oReturn);
	});

	QUnit.test("getValue with callback set", function(assert) {
		this.oSmartField._oValue["edit"] = function() {
			return "theValue";
		};
		this.oSmartField.setValue(true);
		assert.equal(this.oSmartField.getValue(), "theValue");

	});

	QUnit.test("getValue without callback set", function(assert) {
		this.oSmartField.setValue(true);
		assert.equal(this.oSmartField.getValue(), true);

	});

	QUnit.test("setEntitySet", function(assert) {
		var oReturn, fFound = function(oParam) {
			assert.equal(oParam.mParameters.entitySet, "Project");
		};
		this.oSmartField.attachEntitySetFound(fFound);
		oReturn = this.oSmartField.setEntitySet("Project");
		assert.equal(this.oSmartField.getProperty("entitySet"), "Project");
		assert.equal(this.oSmartField, oReturn);
	});

	//BCP: 2280180885
	QUnit.test("_calculateCurrentState does not calculate forceTextArrangementFetch to true on mode changed", function(assert) {
		//Arrange
		this.oSmartField._getControlDescriptionPath = function() { return "sMockedPath"; };
		this.oSmartField._oState = {
			isValuePropertyChanged: function() { return false; },
			isValueBindingPathChanged: function() { return false; },
			isModelChanged: function() { return false; },
			isBindingContextChanged: function() { return false; },
			isEntitySetChanged: function() { return false; },
			isModeInitialized: function() { return true; },
			isModeChanged: function() { return true; },
			isEditableChanged: function() { return false; },
			isContextEditableChanged: function() { return false; },
			isTextInEditModeSourceChanged: function() { return false; },
			_getComputedTextInEditModeSource: function() { return false; },
			isVisibleChanged: function() { return false; }
		};

		//Act
		var oMockedCurrentState = this.oSmartField._calculateCurrentState();

		//Assert
		assert.equal(oMockedCurrentState.forceTextArrangementFetch, false);
	});

	QUnit.test("_toggleInnerControlIfRequired - smart field not initialized", function(assert) {
		this.oSmartField._toggleInnerControlIfRequired({mode: this.oSmartField.getMode()});
		assert.equal(!this.oSmartField._oControl["edit"], true);
	});

	QUnit.test("_toggleInnerControlIfRequired with creation and setting of edit control", function(assert) {
		var iContent = 0, oControl, sUOM = "the unit of measure", fCheck1, fCheck2; // eslint-disable-line no-unused-vars

		fCheck1 = function() {};
		fCheck2 = function() {};
		oControl = {
			control : {	},
			params : {
				getValue: function() {
					return "theValue";
				},
				uom: function() {
					return sUOM;
				},
				uomset: function(sValue) {
					sUOM = sValue;
				},
				checks: [ fCheck1, fCheck2 ]
			}
		};

		this.oSmartField._oFactory = {
			createControl : function() {
				return oControl;
			},
			updateControl : function() {}
		};
		fnPatchSetContentAggregation(this.oSmartField, function() {
			iContent++; // eslint-disable-line
		});

		this.oSmartField._toggleInnerControlIfRequired({mode: this.oSmartField.getMode()});
		assert.equal(this.oSmartField._oControl["edit"], oControl.control);
		assert.equal(this.oSmartField._oControl.current, "edit");
		assert.equal(this.oSmartField._oValue["edit"](), "theValue");
		assert.equal(this.oSmartField._oValue.uom(), "the unit of measure");

		// now set the uom.
		this.oSmartField._oValue.uomset("the new unit of measure");
		assert.equal(this.oSmartField._oValue.uom(), "the new unit of measure");
	});

	QUnit.test("_getEntitySet", function(assert) {
		var sSet;

		this.oSmartField.getBindingContext = function() {
			return {
				getPath: function() {
					return "/Project(id1='71' id2='abcd')";
				}
			};
		};
		sSet = this.oSmartField._getEntitySet();
		assert.equal(sSet, "Project");
	});

	QUnit.test("_getEntitySet with entityset", function(assert) {
		var sSet;

		this.oSmartField.getBindingContext = function() {
			return {
				sPath : "/Project(id1='71' id2='abcd')"
			};
		};
		this.oSmartField.setEntitySet("dummy");
		sSet = this.oSmartField._getEntitySet();
		assert.equal(sSet, "dummy");
	});

	QUnit.test("_getEntitySet with nothing specified", function(assert) {
		var sSet;

		this.oSmartField.getBindingContext = function() {
			return {
				getPath: function() {
					return "";
				}
			};
		};

		sSet = this.oSmartField._getEntitySet();
		assert.equal(sSet, "");
	});

	QUnit.test("_getEntitySet with nothing specified", function(assert) {
		var sSet;

		this.oSmartField.getBindingContext = function() {
			return null;
		};

		sSet = this.oSmartField._getEntitySet();
		assert.equal(sSet, "");
	});

	QUnit.test("getDataType for JSON model", function(assert) {
		this.oSmartField._oFactory = null;
		assert.equal(this.oSmartField.getDataType(), null);
	});

	QUnit.test("getDataType for JSON model", function(assert) {
		this.oSmartField._oFactory = {
			getDataProperty: function() {
				return {
					property : {
						type: "Edm.String"
					}
				};
			}
		};

		assert.equal(this.oSmartField.getDataType(), "Edm.String");
	});

	/**
	 * @deprecated Since 1.31.0
	 */
	QUnit.test("getDataType from Property", function(assert) {
		this.oSmartField._oFactory = {};
		this.oSmartField.getJsonType = function() {
			return "JSON.String";
		};

		assert.equal(this.oSmartField.getDataType(), "JSON.String");
	});

	QUnit.test("getDataType no model set", function(assert) {
		this.oSmartField._oFactory = null;
		assert.equal(this.oSmartField.getDataType(), null);
	});

	QUnit.test("getDataProperty getDataProperty not implemented on factory", function(assert) {
		this.oSmartField._oFactory = {
			getDataProperty: function() {
				return {
					"id": "id"
				};
			}
		};

		assert.equal(this.oSmartField.getDataProperty().id, "id");
	});

	QUnit.test("getDataProperty getDataProperty not implemented on factory", function(assert) {
		this.oSmartField._oFactory = {};
		assert.equal(this.oSmartField.getDataProperty(), null);
	});

	QUnit.test("getDataProperty nothing set", function(assert) {
		this.oSmartField._oFactory = null;
		assert.equal(this.oSmartField.getDataProperty().property.name, "ID");
		assert.equal(this.oSmartField.getDataProperty().property.nullable, "false");
		assert.equal(this.oSmartField.getDataProperty().property.type, "Edm.Int32");
	});

	QUnit.test("getDataProperty nothing set with EntitySet from FunctionImport", function(assert) {
		// Arrange
		var oModel = this.oSmartField.getModel(),
			oMetaModel = oModel && oModel.getMetaModel();

		this.oSmartField._oFactory = null;
		this.stub(oMetaModel, "getODataEntitySet").returns(null);
		oMetaModel.getODataFunctionImport.returns({returnType: "ZMEY_SRV.Project_Type"});

		// Assert
		assert.equal(this.oSmartField.getDataProperty().property.name, "ID");
		assert.equal(this.oSmartField.getDataProperty().property.nullable, "false");
		assert.equal(this.oSmartField.getDataProperty().property.type, "Edm.Int32");

		// Clean
		oMetaModel.getODataEntitySet.restore();
		oMetaModel.getODataFunctionImport.restore();
	});

	QUnit.test("getDataProperty nothing set with data 'configdata'", function(assert) {
		// Arrange
		var sID = "ID from configdata";

		this.oSmartField._oFactory = null;
		this.oSmartField.data("configdata", {configdata: {
				"path": sID,
				"entitySetObject": {},
				"annotations": {},
				"additionalAnnotations": [],
				"modelObject": {},
				"entityType": "Edm.String",
				"property": {
					"property": {
						"name": sID,
						"type": "Edm.String"
					}
				}
			}
		});

		// Assert
		assert.equal(this.oSmartField.getDataProperty().property.name, sID);
	});

	QUnit.test("getUnitOfMeasure with unit of measure set.", function(assert) {
		this.oSmartField._oValue.uom = function() {
			return "the unit of measure";
		};

		assert.equal(this.oSmartField.getUnitOfMeasure(), "the unit of measure");
	});

	QUnit.test("getUnitOfMeasure no unit of measure set.", function(assert) {
		this.oSmartField._oValue.uom = null;
		assert.equal(this.oSmartField.getUnitOfMeasure(), null);
	});

	QUnit.test("setUnitOfMeasure", function(assert) {
		var sValue;

		this.oSmartField._oValue.uomset = function(oValue) {
			sValue = oValue;
		};

		this.oSmartField.setUnitOfMeasure("newValue");
		assert.equal(sValue, "newValue");
	});

	QUnit.test("setUnitOfMeasure - invalid input", function(assert) {
		var sValue = null;

		this.oSmartField._oValue.uomset = function(oValue) {
			sValue = oValue;
		};

		this.oSmartField.setUnitOfMeasure();
		assert.equal(sValue, null);
	});

	QUnit.test("setWidth", function(assert) {
		var fnDone = assert.async();

		this.oSmartField.attachInnerControlsCreated(function () {
			assert.strictEqual(this.oSmartField.getFirstInnerControl().getWidth(), "100px");
			fnDone();
		}.bind(this));

		this.oSmartField.setWidth("100px");
		this.oSmartField._forceInitialise();
	});

	QUnit.test("setSimpleClientError", function(assert) {
		this.oSmartField.setSimpleClientError(true);
		assert.equal(this.oSmartField._oError.bComplex, false);
		assert.equal(this.oSmartField._oError.bFirst, true);
		assert.equal(this.oSmartField._oError.bSecond, false);
	});

	QUnit.test("setComplexClientErrorFirstOperand", function(assert) {
		this.oSmartField.setComplexClientErrorFirstOperand(true);
		assert.equal(this.oSmartField._oError.bComplex, true);
		assert.equal(this.oSmartField._oError.bFirst, true);
		assert.equal(this.oSmartField._oError.bSecond, false);
	});

	QUnit.test("setComplexClientErrorSecondOperand", function(assert) {
		this.oSmartField.setComplexClientErrorSecondOperand(true);
		assert.equal(this.oSmartField._oError.bComplex, true);
		assert.equal(this.oSmartField._oError.bFirst, false);
		assert.equal(this.oSmartField._oError.bSecond, true);
	});

	QUnit.test("setComplexClientErrorSecondOperand", function(assert) {
		var oParent = {
			_oError: {
				bComplex: false,
				bFirst: false,
				bSecond: true
			},
			setComplexClientErrorSecondOperand: function(bError) {
				this._oError.bComplex = true;
				this._oError.bSecond = bError;
			}
		};

		this.oSmartField.getParent = function() {
			return {
				getParent: function() {
					return oParent;
				}
			};
		};

		this.oSmartField.setComplexClientErrorSecondOperandNested(true);
		assert.equal(oParent._oError.bComplex, true);
		assert.equal(oParent._oError.bFirst, false);
		assert.equal(oParent._oError.bSecond, true);
	});

	QUnit.test("_hasClientError", function(assert) {
		this.oSmartField._oError.bComplex = true;
		this.oSmartField._oError.bSecond = true;
		assert.equal(this.oSmartField._hasClientError(), true);

		this.oSmartField._oError.bComplex = false;
		assert.equal(this.oSmartField._hasClientError(), false);
	});

	QUnit.test("getFocusDomRef for empty Smartfield", function(assert) {
		var oRef = this.oSmartField.getFocusDomRef();
		assert.ok(!oRef);
	});

	QUnit.test("getFocusDomRef hosting another control", function(assert) {
		var oRef, oControl = {
			getMetadata: function() {
				return {
					_sClassName: "test"
				};
			},
			getFocusDomRef: function() {
				return "dummy-focus";
			}
		};

		fnPatchGetContentAggregation(this.oSmartField, function() {
			return oControl;
		});
		oRef = this.oSmartField.getFocusDomRef();

		assert.equal(oRef, "dummy-focus");
	});

	QUnit.test("getInnerControls", function(assert) {
		var aControls, oControl = {
			getMetadata: function() {
				return {
					_sClassName: "test"
				};
			}
		};

		fnPatchGetContentAggregation(this.oSmartField, function() {
			return oControl;
		});

		// test simple control.
		aControls = this.oSmartField.getInnerControls();
		assert.ok(aControls[0] === oControl);

		//test complex control.
		fnPatchGetContentAggregation(this.oSmartField, function() {
			return {
				getMetadata: function() {
					return {
						_sClassName: "sap.m.HBox"
					};
				},
				getItems: function() {
					return [];
				}
			};
		});

		aControls = this.oSmartField.getInnerControls();
		assert.strictEqual(aControls.length, 0);

		fnPatchGetContentAggregation(this.oSmartField, function() {
			return {
				getMetadata: function() {
					return {
						_sClassName: "sap.m.HBox"
					};
				},
				getItems: function() {
					return [ {} ];
				}
			};
		});

		aControls = this.oSmartField.getInnerControls();
		assert.strictEqual(aControls.length, 1);

		fnPatchGetContentAggregation(this.oSmartField, function() {
			return {
				getMetadata: function() {
					return {
						_sClassName: "sap.m.HBox"
					};
				},
				getItems: function() {
					return [ {}, {
						getAggregation: function() {
							return 1;
						},
						getContent: function() {
							return 1;
						}
					} ];
				}
			};
		});

		aControls = this.oSmartField.getInnerControls();
		assert.equal(aControls.length, 2);
		assert.equal(aControls[1], 1);

		fnPatchGetContentAggregation(this.oSmartField, function() {
			return {
				getMetadata: function() {
					return {
						_sClassName: "sap.m.HBox"
					};
				},
				getItems: function() {
					return [ {}, {
						getAggregation: function() {
							return null;
						},
						getContent: function() {
							return null;
						}
					} ];
				}
			};
		});

		aControls = this.oSmartField.getInnerControls();
		assert.equal(aControls.length, 1);
	});

	QUnit.test("_getInnerControls for SmartLink", function(assert) {
		var aControls, oControl = {
			getMetadata: function() {
				return {
					_sClassName: "sap.ui.comp.navpopover.SmartLink"
				};
			},
			getAggregation: function() {
				return "test";
			}
		};

		fnPatchGetContentAggregation(this.oSmartField, function() {
			return oControl;
		});

		// test existing nested control.
		aControls = this.oSmartField.getInnerControls();
		assert.equal(aControls[0], "test");

		oControl.getAggregation = function() {
			return null;
		};
		aControls = this.oSmartField.getInnerControls();
		assert.equal(aControls.length, 1);
		assert.equal(aControls[0], oControl);
	});

	QUnit.test("_checkErrors", function(assert) {
		var bParse = false;
		var bValidate = false;
		var oInput1 = {
			getMetadata: function() {
				return {
					getName: function() {
						return "test";
					}
				};
			}
		};

		//check unknown control
		this.oSmartField._checkErrors(oInput1, { checkClientErrorsOnly: true });
		assert.strictEqual(bParse, false);

		// check sap.m.Input: no exception
		var oInput2 = {
			getMetadata: function() {
				return {
					getName: function() {
						return "sap.m.Input";
					}
				};
			},
			getValue: function() {

			},
			getBinding: function() {
				return {
					setExternalValue: function() {

					},
					getValue: function() {
						return "";
					},
					getType: function() {

					},
					hasValidation: function(){
						return true;
					}
				};
			},
			fireValidationSuccess: function() {}
		};

		var oInput2FireValidationSuccessSpy = this.spy(oInput2, "fireValidationSuccess");

		this.oSmartField._checkErrors(oInput2, { checkClientErrorsOnly: true });
		assert.strictEqual(bParse, false);
		assert.strictEqual(bValidate, false);
		assert.strictEqual(oInput2FireValidationSuccessSpy.callCount, 1, 'it should fire a "validationSuccess" event');


		// check sap.m.Input: ParseException
		var oInput3 = {
			getMetadata: function() {
				return {
					getName: function() {
						return "sap.m.Input";
					}
				};
			},
			getValue: function() {

			},
			getBinding: function() {
				return {
					sInternalType: "string",
					getType: function() {
						return {
							parseValue: function(){
								throw new ParseException();
							},
							validateValue: function() {
								throw new ValidateException();
							},
							isA: function() {
								return false;
							}
						};
					},
					getValue: function() {
						return "";
					}
				};
			},
			fireParseError: function() {
				bParse = true;
			},
			fireValidationSuccess: function() {}
		};
		var oInput3FireValidationSuccessSpy = this.spy(oInput3, "fireValidationSuccess");


		this.oSmartField._checkErrors(oInput3, { checkClientErrorsOnly: true });
		assert.equal(bParse, true);
		assert.equal(bValidate, false);
		assert.strictEqual(oInput3FireValidationSuccessSpy.callCount, 0, 'it should not fire a "validationSuccess" event');

		//check sap.m.Input: ValidationException
		bParse = false;
		var oInput4 = {
			getMetadata: function() {
				return {
					getName: function() {
						return "sap.m.Input";
					}
				};
			},
			getValue: function() {

			},
			getBinding: function() {
				return {
					sInternalType: "string",
					getType: function() {
						return {
							parseValue: function(){
							},
							validateValue: function() {
								throw new ValidateException();
							},
							isA: function() {
								return false;
							}
						};
					},
					getValue: function() {
						return "";
					}
				};
			},
			fireValidationError: function() {
				bValidate = true;
			},
			fireValidationSuccess: function() {}
		};
		var oInput4FireValidationSuccessSpy = this.spy(oInput4, "fireValidationSuccess");
		this.oSmartField._checkErrors(oInput4, { checkClientErrorsOnly: true });
		assert.equal(bValidate, true);
		assert.equal(bParse, false);
		assert.strictEqual(oInput4FireValidationSuccessSpy.callCount, 0, 'it should not fire a "validationSuccess" event');
	});

	QUnit.test("_checkErrors: UoM Validate Exception", function(assert) {
		// Arrange
		var oControl = sinon.createStubInstance(Input),
			oUoMControl = sinon.createStubInstance(Input),
			oBinding = sinon.createStubInstance(ODataPropertyBinding),
			oType = sinon.createStubInstance(ODataType),
			oException = new UoMValidateException();

		oType.parseValue = function(){};
		oType.formatValue = function(){};
		oType.validateValue = function(){
			throw oException;
		};
		oBinding.getType.returns(oType);
		oBinding.sInternalType = "fakeInternalType";
		oControl.getBinding.returns(oBinding);
		oControl.getMetadata.returns({getName: function(){
			return "";
		}});
		sinon.stub(this.oSmartField, "_getEmbeddedSmartField").returns({
			getFirstInnerControl: function(){
				return oUoMControl;
			}
		});
		sinon.stub(ODataControlFactory, "getBoundPropertiesMapInfoForControl").returns(["value"]);

		// Act
		this.oSmartField._checkErrors(oControl);

		// Assert
		assert.ok(oControl.fireValidationError.calledWith({
			element: oControl,
			exception: oException,
			message: undefined,
			newValue: undefined,
			oldValue: undefined,
			property: "value",
			targetControl: oUoMControl,
			type: oType
		}));

		// Clean
		oControl = null;
		oUoMControl = null;
		oBinding = null;
		oType = null;
		oException = null;
		this.oSmartField._getEmbeddedSmartField.restore();
		ODataControlFactory.getBoundPropertiesMapInfoForControl.restore();
	});

	// BCP: 1880161112
	QUnit.test("it should parse and validate the value of the underlying DateTimePicker control", function(assert) {

		// system under test
		var oDateTimePicker = new DateTimePicker();
		var oType = new DateTimeOffset();

		// arrange
		var oParseValueFunctionSpy = this.spy(oType, "parseValue");
		var oValidateValueFunctionSpy = this.spy(oType, "validateValue");
		this.stub(oDateTimePicker, "getBinding").returns({
			getType: function() {
				return oType;
			},
			getValue: function() {},
			hasValidation: function(){
				return true;
			},
			sInternalType: "string"
		});

		// act
		this.oSmartField._checkErrors(oDateTimePicker, { checkClientErrorsOnly: true });

		// assert
		assert.strictEqual(oParseValueFunctionSpy.callCount, 1);
		assert.strictEqual(oValidateValueFunctionSpy.callCount, 1);

		// cleanup
		oDateTimePicker.destroy();
	});

	// BCP: 1880414348
	QUnit.test("it should parse and validate the value of the underlying Select control", function(assert) {

		// system under test
		var oSelect = new Select();
		var oType = new StringType();

		// arrange
		var oParseValueFunctionSpy = this.spy(oType, "parseValue");
		var oValidateValueFunctionSpy = this.spy(oType, "validateValue");
		this.stub(oSelect, "getBinding").returns({
			getType: function() {
				return oType;
			},
			getValue: function() {},
			hasValidation: function(){
				return true;
			},
			sInternalType: "string"
		});

		// act
		this.oSmartField._checkErrors(oSelect, { checkClientErrorsOnly: true });

		// assert
		assert.strictEqual(oParseValueFunctionSpy.callCount, 1);
		assert.strictEqual(oValidateValueFunctionSpy.callCount, 1);

		// cleanup
		oSelect.destroy();
	});

	// BCP: 1880176672
	QUnit.test('calling the checkClientError() method should fire the "parseError" event with the expected parameters', function(assert) {

		// system under test
		var oInput = new Input({
			value: ""
		});
		var oType = new StringType();

		// arrange
		this.stub(oType, "parseValue").callsFake(function(sValue, sSourceType) {
			throw new ParseException("Parse exception");
		});
		this.stub(oInput, "getBinding").returns({
			getType: function() {
				return oType;
			},
			getValue: function() {
				return "previous value";
			},
			sInternalType: "string"
		});

		var oFireValidateErrorSpy = this.spy(oInput, "fireParseError");

		// act
		this.oSmartField._checkErrors(oInput, { checkClientErrorsOnly: true });

		// assert
		var mParameters = oFireValidateErrorSpy.args[0][0] || {};
		assert.ok(mParameters.element === oInput);
		assert.ok(mParameters.type === oType);
		assert.strictEqual(mParameters.property, "value");
		assert.strictEqual(mParameters.newValue, "");
		assert.strictEqual(mParameters.oldValue, "previous value");
		assert.strictEqual(mParameters.exception.name, "ParseException");
		assert.strictEqual(mParameters.message, "Parse exception");

		// cleanup
		oInput.destroy();
		oType.destroy();
	});

	// BCP: 1880176672
	QUnit.test('calling the checkClientError() method should fire the "validateError" event with the expected parameters', function(assert) {

		// system under test
		var oInput = new Input({
			value: ""
		});
		var oType = new StringType();

		// arrange
		this.stub(oType, "validateValue").callsFake(function(sValue, sSourceType) {
			throw new ValidateException("Validate exception");
		});
		this.stub(oInput, "getBinding").returns({
			getType: function() {
				return oType;
			},
			getValue: function() {
				return "previous value";
			},
			sInternalType: "string"
		});

		var oFireValidateErrorSpy = this.spy(oInput, "fireValidationError");

		// act
		this.oSmartField._checkErrors(oInput, { checkClientErrorsOnly: true });

		// assert
		var mParameters = oFireValidateErrorSpy.args[0][0] || {};
		assert.ok(mParameters.element === oInput);
		assert.ok(mParameters.type === oType);
		assert.strictEqual(mParameters.property, "value");
		assert.strictEqual(mParameters.newValue, "");
		assert.strictEqual(mParameters.oldValue, "previous value");
		assert.strictEqual(mParameters.exception.name, "ValidateException");
		assert.strictEqual(mParameters.message, "Validate exception");

		// cleanup
		oInput.destroy();
		oType.destroy();
	});

	/**
	 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
	 */
	QUnit.test("it should skip the validation of the text input field value if the type is async and checkClientErrorsOnly=true", function(assert) {

		// arrange
		var oTextInput = new Input();
		var oFormatOptions = {
			textArrangement: "idAndDescription"
		};
		var oConstraints = {
			nullable: true
		};
		var oSettings = {
			keyField: "ID",
			descriptionField: "Text",
			onBeforeValidateValue: function(sValue, mSettings) {
				var aData = [{
					ID: "SS",
					Text: "Soundstation"
				}];
				mSettings.success(aData);
			}
		};
		var oType = new TextArrangementString(oFormatOptions, oConstraints, oSettings);
		var oParseSpy = this.spy(oType, "parseValue");
		var oValidateSpy = this.spy(oType, "validateValue");
		this.stub(oTextInput, "getBinding").returns({
			getType: function() {
				return oType;
			},
			sInternalType: "string"
		});

		// act
		this.oSmartField._checkErrors(oTextInput, { checkClientErrorsOnly: true });

		// assert
		assert.strictEqual(oParseSpy.callCount, 0);
		assert.strictEqual(oValidateSpy.callCount, 0);
		assert.strictEqual(this.oSmartField._oError.bFirst, true);

		// cleanup
		oType.destroy();
		oTextInput.destroy();
	});

	/**
	 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
	 */
	QUnit.test("checkClientError", function(assert) {
		var that = this;

		var oControl = {
			getMetadata: function() {
				return {
					getName: function() {
						return "sap.m.Input";
					}
				};
			},
			getBinding: function() {
				return {
					sInternalType: "string",
					getType: function() {
						return {
							parseValue: function() {},
							validateValue: function() {
								that.oSmartField._oError.bFirst = true;
								throw new ValidateException();
							},
							isA: function() {
								return false;
							}
						};
					},
					getValue: function() {
						return "";
					}
				};
			},
			getValue: function() {
				return null;
			},
			fireValidationError: function() {}
		};

		fnPatchGetContentAggregation(this.oSmartField, function() {
			return {
				getMetadata: function() {
					return {
						_sClassName: "sap.m.HBox"
					};
				},
				getItems: function() {
					return [
						oControl
					];
				}
			};
		});

		// no errors in display mode
		this.oSmartField.setEditable(false);
		var bError = this.oSmartField.checkClientError();
		assert.equal(bError, false);

		// we already have found an error.
		this.oSmartField.setEditable(true);
		this.oSmartField._oError.bFirst = true;
		bError = this.oSmartField.checkClientError();
		assert.equal(bError, true);

		// simulate finding an error.
		this.oSmartField._oError.bFirst = false;
		bError = this.oSmartField.checkClientError();
		assert.equal(bError, true);
	});

	/**
	 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
	 */
	QUnit.test("checkClientError with handleSuccess", function(assert) {
		// arrange
		var that = this;
		var oControl = {
			getMetadata: function() {
				return {
					getName: function() {
						return "sap.m.Input";
					}
				};
			},
			getBinding: function() {
				return {
					sInternalType: "string",
					getType: function() {
						return {
							parseValue: function() {},
							validateValue: function() {},
							isA: function() {
								return false;
							}
						};
					},
					getValue: function() {
						return "";
					},
					hasValidation: function(){
						return true;
					}
				};
			},
			getValue: function() {
				return null;
			},
			fireValidationError: function() {},
			fireValidationSuccess: function() {
				that.oSmartField._oError.bFirst = false;
			}
		};

		fnPatchGetContentAggregation(this.oSmartField, function() {
			return {
				getMetadata: function() {
					return {
						_sClassName: "sap.m.HBox"
					};
				},
				getItems: function() {
					return [
						oControl
					];
				}
			};
		});

		this.oSmartField._oError.bFirst = true;

		// act
		var bError = this.oSmartField.checkClientError();
		// assert
		assert.equal(bError, true);

		// act
		bError = this.oSmartField.checkClientError({});
		// assert
		assert.equal(bError, true);

		// act
		bError = this.oSmartField.checkClientError({handleSuccess: false});
		// assert
		assert.equal(bError, true);

		// act
		bError = this.oSmartField.checkClientError({handleSuccess: true});
		// assert
		assert.equal(bError, false);

		// arrange
		var fnFireValidationSuccessSpy = this.spy(Control.prototype, "fireValidationSuccess");
		// act
		bError = this.oSmartField.checkClientError({handleSuccess: false});
		// assert
		assert.equal(bError, false);
		assert.strictEqual(fnFireValidationSuccessSpy.callCount, 0);
	});

	QUnit.test("attachVisibleChanged", function(assert) {
		var bVisible = true, fChange = function(oParam) {
			bVisible = oParam.getParameter("visible");
		};

		this.oSmartField.attachVisibleChanged(fChange);
		this.oSmartField.setVisible(false);
		assert.equal(bVisible, false);
	});

	QUnit.test("_getMaxSeverity", function(assert) {
		var oChild1, oChild2, iMax;

		oChild1 = {
			getValueState: function() {
				return "Success";
			}
		};
		oChild2 = {
			getValueState: function() {
				return "Error";
			}
		};

		iMax = this.oSmartField._getMaxSeverity([ oChild1, {}, oChild2, {} ]);
		assert.equal(iMax, 2);
	});

	QUnit.test("getValueStateText", function(assert) {
		var oChild1, oChild2;

		oChild1 = {
			getValueState: function() {
				return "Success";
			},
			getValueStateText: function() {
				return "SuccessText";
			}
		};
		oChild2 = {
			getValueState: function() {
				return "Error";
			},
			getValueStateText: function() {
				return "ErrorText";
			}
		};
		this.oSmartField.getInnerControls = function() {
			return [ oChild1, oChild2 ];
		};

		assert.equal(this.oSmartField.getValueStateText(), "ErrorText");

		this.oSmartField.setValueStateText("test");
		this.oSmartField.getInnerControls = function() {
			return [];
		};
		assert.equal(this.oSmartField.getValueStateText(), "test");
	});

	QUnit.test("getValueState", function(assert) {
		var oChild1, oChild2;

		oChild1 = {
			getValueState: function() {
				return "Success";
			}
		};
		oChild2 = {
			getValueState: function() {
				return "Error";
			}
		};
		this.oSmartField.getInnerControls = function() {
			return [ oChild1, oChild2 ];
		};
		assert.equal(this.oSmartField.getValueState(), "Error");

		this.oSmartField.getInnerControls = function() {
			return [];
		};
		assert.equal(this.oSmartField.getValueState(), "None");
	});

	/**
	 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
	 */
	QUnit.test("setValueState", function(assert) {
		var oState;

		var oChild1 = {
			getValueState: function() {
				return "Success";
			},
			setValueState: function(sState) {
				oState = sState;
			}
		};
		var oChild2 = {
			getValueState: function() {
				return "Error";
			}
		};
		this.oSmartField.getInnerControls = function() {
			return [ oChild1, oChild2 ];
		};

		this.oSmartField.setValueState(ValueState.Error);
		assert.strictEqual(oState, ValueState.Error);
		assert.strictEqual(this.oSmartField.checkClientError(), true);
		assert.strictEqual(this.oSmartField.getValueState(), ValueState.Error);
	});

	/**
	 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
	 */
	QUnit.test("setValueStateText", function(assert) {
		var oState;

		var oChild1 = {
			getValueState: function() {
				return "Success";
			},
			setValueStateText: function(sState) {
				oState = sState;
			},
			getMetadata: function() {
				return {
					getName: function() {
						return "";
					}
				};
			}
		};
		var oChild2 = {
			getValueState: function() {
				return "Error";
			},
			getMetadata: function() {
				return {
					getName: function() {
						return "";
					}
				};
			}
		};
		this.oSmartField.getInnerControls = function() {
			return [ oChild1, oChild2 ];
		};

		this.oSmartField.setValueStateText("Error");
		assert.equal(oState, "Error");
		assert.equal(this.oSmartField.checkClientError(), false);
	});

	QUnit.test("exit method", function(assert) {
		var bDestroy = false;
		this.oSmartField._oFactory = {
			destroy: function() {
				bDestroy = true;
			}
		};

		this.oSmartField.exit();
		assert.ok(this.oSmartField);
		assert.equal(bDestroy, true);
	});

	QUnit.test("exit method destroys inner edit control in display mode", function(assert) {
		var bEditControlDestroyed = false;
		var bDisplayControlDestroyed = false;

		this.oSmartField._oControl.edit = {
			destroy: function() {
				bEditControlDestroyed = true;
			}
		};
		this.oSmartField._oControl.display = {
			destroy: function() {
				bDisplayControlDestroyed = true;
			}
		};

		this.oSmartField.setEditable(false);
		this.oSmartField.exit();

		assert.ok(bEditControlDestroyed, "in display mode, inner edit control has to be destroyed explicitly");
		assert.ok(!bDisplayControlDestroyed, "in display mode, inner display control should only be destroyed via content aggregation");
	});

	QUnit.test("exit method destroys inner edit control in display mode", function(assert) {
		var bEditControlDestroyed = false;
		var bDisplayControlDestroyed = false;

		this.oSmartField._oControl.edit = {
			destroy: function() {
				bEditControlDestroyed = true;
			}
		};

		this.oSmartField._oControl.display = {
			destroy: function() {
				bDisplayControlDestroyed = true;
			}
		};

		this.oSmartField.setEditable(false);
		this.oSmartField.exit();

		assert.ok(bEditControlDestroyed, "in display mode, inner edit control has to be destroyed explicitly");
		assert.ok(!bDisplayControlDestroyed, "in display mode, inner display control should only be destroyed via content aggregation");
	});

	QUnit.test("exit method destroys inner display control in edit mode", function(assert) {
		var bEditControlDestroyed = false;
		var bDisplayControlDestroyed = false;

		this.oSmartField._oControl.edit = {
			destroy: function() {
				bEditControlDestroyed = true;
			},
			getParent: function() {
				return {};
			}
		};

		this.oSmartField._oControl.display = {
			destroy: function() {
				bDisplayControlDestroyed = true;
			}
		};

		this.oSmartField._oControl.current = "edit";
		this.oSmartField.destroy();

		assert.ok(!bEditControlDestroyed, "in edit mode, inner edit control should only be destroyed via content aggregation");
		assert.ok(bDisplayControlDestroyed, "in edit mode, inner display control has to be destroyed explicitly");
	});

	QUnit.test("Can be destroyed", function(assert) {
		var bDestroy = false;
		this.oSmartField._oFactory = {
			destroy: function() {
				bDestroy = true;
			}
		};

		this.oSmartField.destroy();
		assert.ok(this.oSmartField);
		assert.equal(bDestroy, true);
	});

	QUnit.test("create control", function(assert) {
		// Arrange
		var done = assert.async(2);
		this.stub(this.oSmartField, "_createControlIfRequired");
		this.oSmartField.setEditable(true);

		// Action
		this.oSmartField.onBeforeRendering().then(function(){
			// Assert
			assert.ok(this.oSmartField._createControlIfRequired.calledOnce, "SmartField is editable, create control should have been called");
			done();
		}.bind(this)).then(function(){
			// Clean
			this.oSmartField._createControlIfRequired.reset();

			// Arrange
			this.oSmartField.data("configdata", { configdata: true });
			this.oSmartField.setEditable(false);

			// Action
			this.oSmartField.onBeforeRendering().then(function(){
				// Assert
				assert.ok(!this.oSmartField._createControlIfRequired.calledOnce, "SmartField is not editable, create control should not have been called");
				assert.equal(this.oSmartField._oControl.current, "display");
				done();

				// Clean
				this.oSmartField._createControlIfRequired.reset();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("TextInEditModeSource should not destroy control factory on its own", function(assert) {
		// Arrange
		var done = assert.async();
		this.stub(this.oSmartField, "_createControlIfRequired");
		this.stub(ODataControlFactory.prototype, "triggerCreationOfControls").returns();
		this.stub(ODataControlFactory.prototype, "bind").callsFake(function(){
			return ODataControlFactory.prototype.bind.wrappedMethod.apply(this, arguments).then(function(oResult){
				this._oParent.setTextInEditModeSource("ValueList");

				return oResult;
			}.bind(this));
		});

		// Action
		this.oSmartField.onBeforeRendering().then(function(){
			// Assert
			assert.ok(this.oSmartField.getControlFactory().triggerCreationOfControls.calledOnce, "SmartField's bindings and Label have been set");
		}.bind(this)).catch(function(oException){
			// Assert
			assert.ok(false, "SmartField's bindings and Label have not been set, because the factory was destroyed by the SmartField's textInEditModeSource setter");
		}).finally(function(){
			// Clean
			ODataControlFactory.prototype.bind.restore();
			ODataControlFactory.prototype.triggerCreationOfControls.restore();

			done();
		});

	});

	QUnit.test("set FieldGroupIds", function(assert) {
		// Arrange
		var done = assert.async();
		var sFieldGroupID = "dummyID";
		this.stub(this.oSmartField, "_getView").returns(true);
		this.stub(this.oSmartField._oSideEffects, "getFieldGroupIDs").returns([ sFieldGroupID ]);
		this.oSmartField.setEditable(true);

		// Action
		this.oSmartField.onBeforeRendering().then(function(){
			// Assert
			assert.equal(this.oSmartField.getFirstInnerControl().getFieldGroupIds()[0], sFieldGroupID);
			done();

			// Clean
			this.oSmartField._getView.reset();
			this.oSmartField._oSideEffects.getFieldGroupIDs.reset();
		}.bind(this));
	});

	QUnit.test("set FieldGroupIds only when base control for edit mode is available and set as content aggragation - 1", function(assert) {
		// Arrange
		var done = assert.async(),
			sFieldGroupID = "dummyID",
			oInnerInput = new Input();

		this.stub(this.oSmartField, "_getView").returns(true);
		this.stub(this.oSmartField._oSideEffects, "getFieldGroupIDs").returns([ sFieldGroupID ]);
		this.stub(this.oSmartField, "_toggleInnerControlIfRequired").returns();
		this.stub(this.oSmartField, "_oControl").value({edit: oInnerInput});

		this.oSmartField.onBeforeRendering().then(function(){
			// Assert
			assert.notEqual(this.oSmartField._oControl.edit.getFieldGroupIds()[0], sFieldGroupID);
			done();

			// Clean
			this.oSmartField._getView.reset();
			this.oSmartField._oSideEffects.getFieldGroupIDs.reset();
			oInnerInput.destroy();
			oInnerInput = null;
		}.bind(this));

		// Action
		this.oSmartField.setEditable(true);
	});

	QUnit.test("set FieldGroupIds only when base control for edit mode is available and set as content aggragation - 2", function(assert) {
		// Arrange
		var done = assert.async(),
			sFieldGroupID = "dummyID",
			oInnerInput = new Input();

		this.stub(this.oSmartField, "_getView").returns(true);
		this.stub(this.oSmartField._oSideEffects, "getFieldGroupIDs").returns([ sFieldGroupID ]);
		this.stub(this.oSmartField, "_toggleInnerControlIfRequired").returns();
		this.stub(this.oSmartField, "getContent").returns(oInnerInput);

		this.oSmartField.onBeforeRendering().then(function(){
			// Assert
			assert.notEqual(this.oSmartField.getFirstInnerControl().getFieldGroupIds()[0], sFieldGroupID);
			done();

			// Clean
			this.oSmartField._getView.reset();
			this.oSmartField._oSideEffects.getFieldGroupIDs.reset();
			oInnerInput.destroy();
			oInnerInput = null;
		}.bind(this));

		// Action
		this.oSmartField.setEditable(true);
	});

	QUnit.test("reset FieldGroupIds when binding context has changed", function(assert) {
		// Arrange
		var done = assert.async();
		var bFieldGroupIdsAreSet = true;
		var sFieldGroupID = "dummyID";
		this.stub(this.oSmartField, "_getView").returns(true);
		this.stub(this.oSmartField._oSideEffects, "getFieldGroupIDs").returns([ sFieldGroupID ]);

		// Action
		// We change the mode to Display
		this.oSmartField.setEditable(false);

		// We simulate that the fieldGroups are already set
		this.oSmartField._bSideEffects = bFieldGroupIdsAreSet;

		// Action
		this.oSmartField.onBeforeRendering().then(function(){
			// Assert
			// We do not expect that the fieldGroups will be set while in Display mode
			assert.equal(this.oSmartField.getFirstInnerControl().getFieldGroupIds()[0], undefined);

			// Action
			// We change the mode to Edit
			this.oSmartField.setEditable(true);

			this.oSmartField.onBeforeRendering().then(function(){
				// Assert
				// We expect that the groups will be set
				assert.equal(this.oSmartField.getFirstInnerControl().getFieldGroupIds()[0], sFieldGroupID);
				done();

				// Clean
				this.oSmartField._getView.reset();
				this.oSmartField._oSideEffects.getFieldGroupIDs.reset();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("refreshDataState shall set _checkCreated to true", function(assert) {
		var oState = {
			isLaundering: function() {
				return true;
			},
			getChanges: function() {
				return {};
			}
		};

		var oMessageMixinRefreshDataStateCalledGetChangesSpy = sinon.spy(oState, "getChanges");

		this.oSmartField.getBindingContext = function() {
			return {
				getObject: function() {
					return {
						__metadata: {
							created: true
						}
					};
				}
			};
		};

		this.oSmartField.refreshDataState("value", oState);
		assert.ok(this.oSmartField._checkCreated);
		assert.ok(oMessageMixinRefreshDataStateCalledGetChangesSpy.called, "MessageMixin refreshDataState should be called");
	});

	QUnit.test("refreshDataState shall set _oLastValidated to null", function(assert) {
		var oState = {
				isLaundering: function() {
					return true;
				},
				getChanges: function() {
					return {
						value: {
							value: "sDummyNewValue",
							oldValue: "sDummyOldValue"
						}
					};
				}
			};

		// Arrange
		this.oSmartField._oLastValidated = {
			sourceId: "sDummySourceId",
			sNewValue: "sDummyValue"
		};
		this.oSmartField.getBindingContext = function() {
			return {
				getObject: function() {
					return {
						__metadata: {
							created: true
						}
					};
				}
			};
		};

		// Act
		this.oSmartField.refreshDataState("value", oState);

		// Assert
		assert.equal(this.oSmartField._oLastValidated, null, "_oLastValidated reset to null");
	});

	QUnit.test("refreshDataState shall remove _checkCreated", function(assert) {
		var oState = {
			isLaundering: function() {
				return false;
			},
			isDirty: function() {
				return false;
			},
			getChanges: function() {
				return {};
			}
		};

		this.oSmartField.getBindingContext = function() {
			return {
				getObject: function() {
					return {
						__metadata: {
							created: true
						}
					};
				}
			};
		};
		this.oSmartField._checkCreated = true;
		this.oSmartField._oFactory = {
			rebindOnCreated : function() {

			}
		};
		var oMessageMixinRefreshDataStateCalledGetChangesSpy = sinon.spy(oState, "getChanges");

		this.oSmartField.refreshDataState("value", oState);
		assert.ok(!this.oSmartField._checkCreated);
		assert.ok(oMessageMixinRefreshDataStateCalledGetChangesSpy.called, "MessageMixin refreshDataState should be called");

	});

	QUnit.test("refreshDataState should not throw and error when no factory is created", function(assert) {
		// Arrange
		var oSmartField = new SmartField(),
			oState = {
				isLaundering: function() {
					return false;
				},
				isDirty: function() {
					return false;
				},
				getChanges: function() {
					return {};
				}
			};

		oSmartField._checkCreated = true;
		assert.expect(2); // We make sure only 2 assertions are triggered

		// Act
		try {
			oSmartField.refreshDataState("value", oState);
		} catch (oError) {
			// Catch possible failure
			assert.ok(false, "The method should not fail when no internal factory is available");
		}

		// Assert
		assert.ok(!oSmartField.getControlFactory(), "No control factory was available");
		assert.strictEqual(oSmartField._checkCreated, false, "_checkCreated flag set to false");

		// Cleanup
		oSmartField.destroy();
	});

	QUnit.test("toggle between edit/display, with value and without value", function(assert) {
		// Arrange
		var fnStubGetControlFactory,
			done = assert.async(5),
			oEditControl = new Input(),
			oDisplayControl = new Text();

		this.oSmartField._init();
		fnStubGetControlFactory = this.stub(this.oSmartField.getControlFactory(), "createControl");
		this.stub(this.oSmartField, "_destroyFactory").returns();
		this.oSmartField.data("configdata", { configdata: true});

		fnStubGetControlFactory.returns({
			control: oDisplayControl
		});
		this.oSmartField.setEditable(false);
		this.oSmartField.setValue("");
		// Action
		this.oSmartField.onBeforeRendering().then(function(){
			// Assert
			assert.ok(!this.oSmartField.getContent(), "empty value, not editable => smartField's content has to be empty");
			assert.equal(this.oSmartField._oControl.current, "display");
			done();
		}.bind(this)).then(function(){
			// Arrange
			fnStubGetControlFactory.returns({
				control: oEditControl
			});
			this.oSmartField.setEditable(true);
			this.oSmartField.setValue("dummy");

			// Action
			return this.oSmartField.onBeforeRendering().then(function(){
				// Assert
				assert.ok(this.oSmartField.getContent() === oEditControl, "contains value, editable => smartField's content has to contain editControl");
				assert.equal(this.oSmartField._oControl.current, "edit");
				done();
			}.bind(this));
		}.bind(this)).then(function(){
			// Arrange
			fnStubGetControlFactory.returns({
				control: oDisplayControl
			});
			this.oSmartField.setEditable(false);

			// Action
			return this.oSmartField.onBeforeRendering().then(function(){
				// Assert
				assert.ok(this.oSmartField.getContent() === oDisplayControl, "contains value, not editable => smartField's content has to contain display control");
				assert.equal(this.oSmartField._oControl.current, "display");
				done();
			}.bind(this));
		}.bind(this)).then(function(){
			// Arrange
			this.oSmartField.setValue("");

			// Action
			return this.oSmartField.onBeforeRendering().then(function(){
				// Assert
				assert.ok(!this.oSmartField.getContent(), "empty value, not editable => smartField's content has to be empty");
				done();
			}.bind(this));
		}.bind(this)).then(function(){
			// Arrange
			fnStubGetControlFactory.returns({
				control: oEditControl
			});
			this.oSmartField.setEditable(true);

			// Action
			return this.oSmartField.onBeforeRendering().then(function(){
				// Assert
				assert.ok(this.oSmartField.getContent() === oEditControl, "empty value, editable => smartField's content has to contain edit control");
				assert.equal(this.oSmartField._oControl.current, "edit");
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("create display control in Table when empty string has a corresponding description", function(assert) {
		// Arrange
		var oFactory,
			done = assert.async(),
			oDisplayControl = new Text();

		this.oSmartField._init();

		oFactory = this.oSmartField.getControlFactory();

		this.stub(oFactory, "createControl").returns({
			control: oDisplayControl
		});
		this.stub(oFactory, "getLocalTextPropertyName").returns("dummyPropertyName");
		this.stub(this.oSmartField, "_destroyFactory").returns();
		this.oSmartField.data("configdata", { configdata: true});

		this.oSmartField.setEditable(false);
		this.oSmartField.setValue("");

		// Action
		this.oSmartField.onBeforeRendering().then(function(){
			// Assert
			assert.ok(this.oSmartField.getContent() === oDisplayControl, "contains value, not editable => smartField's content has to contain display control");
			assert.equal(this.oSmartField._oControl.current, "display");
			done();
		}.bind(this));
	});

	// BCP: 1770145312
	QUnit.test("it should destroy the inner control", function(assert) {

		// arrange
		this.oSmartField._oControl.display = new Control();
		this.oSmartField._oControl.edit = new Control();
		var oDestroySpy = this.spy(Control.prototype, "destroy");

		// act
		this.oSmartField._destroyFactory();

		// assert
		assert.strictEqual(oDestroySpy.callCount, 2);
		assert.strictEqual(this.oSmartField._oControl.display, null);
		assert.strictEqual(this.oSmartField._oControl.edit, null);
	});

	QUnit.test("it should return base control binding for complex types", function(assert) {
		// Arrange
		var oPropertyBinding,
			oInnerControlPropertyBinding = sinon.createStubInstance(ODataPropertyBinding),
			oInputMetaData = {
				getName: function() {
					return "sap.m.Input";
				}
			},
			oHBoxMetaData = {
				_sClassName: "sap.m.HBox"
			},
			sMode = "edit",
			oInput = sinon.createStubInstance(Input),
			oHBox = sinon.createStubInstance(HBox);

		oInput.getBinding.withArgs("value").returns(oInnerControlPropertyBinding);
		oInput.getMetadata.returns(oInputMetaData);

		oHBox.getMetadata.returns(oHBoxMetaData);
		oHBox.getItems.returns([oInput]);

		this.oSmartField._oControl[sMode] = oHBox;

		// Act
		oPropertyBinding = this.oSmartField._getInnerControlPropertyBinding(sMode);

		// Assert
		assert.strictEqual(oPropertyBinding, oInnerControlPropertyBinding, "The binding is returned and no errors are raised.");

		// Clean
		oHBoxMetaData = null;
		oHBox = null;
		oPropertyBinding = null;
		oInnerControlPropertyBinding = null;
		oInput = null;
	});

	QUnit.test("getSupportedAnnotationPaths shall return complete paths", function(assert) {
		var oModel, aResult;

		oModel = sinon.createStubInstance(ODataMetaModel);
		oModel.getODataEntityType = function() {
			return oTestEntityType;
		};
		oModel.getODataProperty = function() {
			return oTestProperty;
		};

		aResult = SmartField.getSupportedAnnotationPaths(oModel, oTestEntitySet, "Description");
		assert.equal(aResult[0], "Properties/EntityUpdatable");
	});

	QUnit.test("getSupportedAnnotationPaths shall return only navigation properties", function(assert) {
		var oModel, aResult, oPropertiesSet, oPropertiesType;
		oPropertiesSet = {"name":"ProjectFC","entityType":"ZMEY_SRV.ProjectFC_Type","extensions":[{"name":"creatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"updatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"deletable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"pageable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"addressable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"content-version","value":"1","namespace":"http://www.sap.com/Protocols/SAPData"}],"sap:creatable":"false","Org.OData.Capabilities.V1.InsertRestrictions":{"Insertable":{"Bool":"false"}},"sap:updatable":"false","Org.OData.Capabilities.V1.UpdateRestrictions":{"Updatable":{"Bool":"false"}},"sap:deletable":"false","Org.OData.Capabilities.V1.DeleteRestrictions":{"Deletable":{"Bool":"false"}},"sap:pageable":"false","Org.OData.Capabilities.V1.SkipSupported":{"Bool":"false"},"Org.OData.Capabilities.V1.TopSupported":{"Bool":"false"},"sap:addressable":"false","sap:content-version":"1","Org.OData.Capabilities.V1.SearchRestrictions":{"Searchable":{"Bool":"false"}},"Org.OData.Capabilities.V1.FilterRestrictions":{"NonFilterableProperties":[{"PropertyPath":"ID"},{"PropertyPath":"Description_FC"},{"PropertyPath":"Name_FC"},{"PropertyPath":"StartDate_FC"},{"PropertyPath":"EntityUpdatable"}]},"Org.OData.Capabilities.V1.SortRestrictions":{"NonSortableProperties":[{"PropertyPath":"ID"},{"PropertyPath":"Description_FC"},{"PropertyPath":"Name_FC"},{"PropertyPath":"StartDate_FC"},{"PropertyPath":"EntityUpdatable"}]}};
		oPropertiesType = {"name":"ProjectFC_Type","key":{"propertyRef":[{"name":"ID"}]},"property":[{"name":"ID","type":"Edm.Int32","nullable":"false","extensions":[{"name":"creatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"updatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"sortable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"filterable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"}],"sap:creatable":"false","sap:updatable":"false","sap:sortable":"false","sap:filterable":"false","Org.OData.Core.V1.Computed":{"Bool":"true"}},{"name":"Description_FC","type":"Edm.Byte","nullable":"false","extensions":[{"name":"creatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"updatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"sortable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"filterable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"}],"sap:creatable":"false","sap:updatable":"false","sap:sortable":"false","sap:filterable":"false","Org.OData.Core.V1.Computed":{"Bool":"true"}},{"name":"Name_FC","type":"Edm.Byte","nullable":"false","extensions":[{"name":"creatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"updatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"sortable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"filterable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"}],"sap:creatable":"false","sap:updatable":"false","sap:sortable":"false","sap:filterable":"false","Org.OData.Core.V1.Computed":{"Bool":"true"}},{"name":"StartDate_FC","type":"Edm.Byte","nullable":"false","extensions":[{"name":"creatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"updatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"sortable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"filterable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"}],"sap:creatable":"false","sap:updatable":"false","sap:sortable":"false","sap:filterable":"false","Org.OData.Core.V1.Computed":{"Bool":"true"}},{"name":"EntityUpdatable","type":"Edm.Boolean","nullable":"false","extensions":[{"name":"creatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"updatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"sortable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"filterable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"}],"sap:creatable":"false","sap:updatable":"false","sap:sortable":"false","sap:filterable":"false","Org.OData.Core.V1.Computed":{"Bool":"true"}}],"extensions":[{"name":"content-version","value":"1","namespace":"http://www.sap.com/Protocols/SAPData"}],"sap:content-version":"1","namespace":"ZMEY_SRV","$path":"/dataServices/schema/0/entityType/2"};

		oModel = sinon.createStubInstance(ODataMetaModel);
		oModel.getODataEntityType = function(sType) {
			if (sType === "ZMEY_SRV.Project_Type") {
				return oTestEntityType;
			}

			return oPropertiesType;
		};
		oModel.getODataEntitySet = function() {
			return oPropertiesSet;
		};
		oModel.getODataProperty = function() {
			return oTestProperty;
		};
		oModel.getODataAssociationSetEnd = function() {
			return {"entitySet":"ProjectFC","role":"ToRole_ProjectProperties"};
		};
		aResult = SmartField.getSupportedAnnotationPaths(oModel, oTestEntitySet, "Description", true);

		assert.equal(aResult[0], "Properties");
	});

	QUnit.test("addAssociation shall propagate aria label and aria described to inner controls", function(assert) {
		var sLabel,
			sDescription;

		this.oSmartField.getInnerControls = function() {
			var oInnerControl = {
				addAriaLabelledBy: function(sId){
					sLabel = sId;
				},
				addAriaDescribedBy: function(sId){
					sDescription = sId;
				}
			};
			return [oInnerControl];
		};

		this.oSmartField.addAssociation("ariaLabelledBy", "textXYZ");
		assert.equal(sLabel, "textXYZ");
		this.oSmartField.addAssociation("ariaDescribedBy", "textQWE");
		assert.equal(sDescription, "textQWE");
	});

	QUnit.test("removeAssociation shall remove the  aria label/aria described from inner controls", function(assert) {
		var sLabel,
			sDescription;

			this.oSmartField.addAriaDescribedBy("textQWE");
			this.oSmartField.addAriaLabelledBy("textXYZ");

		this.oSmartField.getInnerControls = function() {
			var oInnerControl = {
				removeAriaLabelledBy: function(sId){
					sLabel = sId;
				},
				removeAriaDescribedBy: function(sId){
					sDescription = sId;
				}
			};
			return [oInnerControl];
		};

		this.oSmartField.removeAssociation("ariaLabelledBy", "textXYZ");
		assert.equal(sLabel, "textXYZ");
		this.oSmartField.removeAssociation("ariaDescribedBy", "textQWE");
		assert.equal(sDescription, "textQWE");
		assert.equal(this.oSmartField.getAssociation("ariaLabelledBy").length, 0);
		assert.equal(this.oSmartField.getAssociation("ariaDescribedBy").length, 0);
	});

	QUnit.test("BCP:2180199456 test propagating of table header to inner controls when UoM in SmartTable scenario and check SmartTable header Id to be the first ariaLabelledBy association", function(assert) {
		var done = assert.async(),
			oControl1 = new Input("control1Id"),
			oUOMCurrencyField = new SmartField("uoMSF"),
			oControl2 = new Text("control2Id"),
			oTableHeader = new Text("tableHeaderId");

		oUOMCurrencyField.data("configdata", {
			configdata: {
				isUOM: true
			}
		});

		// Mock some inner methods
		this.stub(this.oSmartField, "getControlContext").returns("responsiveTable");

		this.stub(this.oSmartField, "getAriaLabelledBy").returns([oTableHeader]);

		this.stub(this.oSmartField, "getInnerControls").returns([
			oControl1, oControl2
		]);

		this.stub(oUOMCurrencyField, "getEditable").returns(false);

		//Act
		this.oSmartField._handleAriaLabelledByInSmartTable(oUOMCurrencyField);

		this.oSmartField.onBeforeRendering().then(function(){
			// Assert
			assert.equal(this.oSmartField.getInnerControls()[0].mAssociations["ariaLabelledBy"][0], oTableHeader.sId, "First value of association AriaLabelledBy array is the table header id");

			// cleanup
			oControl1.destroy();
			oControl2.destroy();
			oUOMCurrencyField.destroy();
			oTableHeader.destroy();

			done();
		}.bind(this));
	});

	QUnit.test("Test propagating of table header to inner controls when UoM in SmartTable scenario and check SmartTable header Id to be the first ariaLabelledBy association", function(assert) {
		var done = assert.async(),
			oControl1 = new Input("control1Id"),
			oUOMCurrencyField = new SmartField("uoMSF"),
			sTableHeaderId = "tableHeaderId";

		oUOMCurrencyField.data("configdata", {
			configdata: {
				isInnerControl: true
			}
		});

		// Mock some inner methods
		this.stub(this.oSmartField, "getControlContext").returns("responsiveTable");

		this.stub(this.oSmartField, "getAriaLabelledBy").returns([sTableHeaderId]);

		this.stub(this.oSmartField, "getInnerControls").returns([
			oControl1, oUOMCurrencyField
		]);

		oUOMCurrencyField.addAriaLabelledBy("sId");

		//Act
		this.oSmartField._handleAriaLabelledByInSmartTable(oUOMCurrencyField);

		this.oSmartField.onBeforeRendering().then(function(){
			var aAriaLabelledBy = oUOMCurrencyField.getAriaLabelledBy();

			// Assert
			assert.equal(aAriaLabelledBy.length, 2, "UoM field has correct number ot ariaLabelledBy associations");
			assert.equal(aAriaLabelledBy[0], "sId", "UoM field has correct first ariaLabelledBy association");
			assert.equal(aAriaLabelledBy[1], sTableHeaderId, "UoM field has correct second ariaLabelledBy association");

			// cleanup
			oControl1.destroy();
			oUOMCurrencyField.destroy();

			done();
		});
	});

	QUnit.test("it should not throw an error when the .destroy() method is called twice", function(assert) {
		this.oSmartField.destroy();
		this.oSmartField.destroy();
		assert.ok(true);
	});

	// BCP: 1680344532
	QUnit.test("it should propagate the value of the wrapping property to the inner control in display mode", function(assert) {
		// Arrange
		var fnDone = assert.async();
		this.oSmartField.setWrapping(true);
		this.oSmartField.setEditable(false);

		this.oSmartField.attachInitialise(function () {
			// Assert
			assert.strictEqual(this.oSmartField.getFirstInnerControl().getWrapping(), false);
			fnDone();
		}.bind(this));

		// Act
		this.oSmartField.setWrapping(false);
		this.oSmartField._forceInitialise();
	});

	// BCP 1780008081
	QUnit.test("it should not throw an exception when the value of the wrapping property is propagated to a " +
				"sap.m.TextArea inner control in display mode (test case 2)", function(assert) {

		// system under test
		var oTextArea = new TextArea();
		var oSmartField = new SmartField({
			wrapping: false
		});

		// arrange
		oSmartField.setContent(oTextArea);

		// act
		oSmartField.setWrapping(true);
		oSmartField._propagateToInnerControls();

		// assert
		assert.strictEqual(oSmartField.getWrapping(), true);
		assert.strictEqual(oTextArea.getWrapping(), Wrapping.Soft);

		// cleanup
		oSmartField.destroy();
	});

	QUnit.test("_propagateToInnerControls should invoke _propagateFieldGroupIDs even in Display mode", function(assert) {
		// system under test
		var oSmartField = new SmartField(),
			fnPropagateFieldGroupIDsSpy = sinon.spy(oSmartField, "_propagateFieldGroupIDs");

		// act
		oSmartField._onInnerControlToggled({mode: "display"});

		// assert
		assert.ok(fnPropagateFieldGroupIDsSpy.calledOnce, "_propagateFieldGroupIDs was invoked in Display mode");

		// act
		fnPropagateFieldGroupIDsSpy.reset();
		oSmartField._onInnerControlToggled({mode: "edit"});

		// assert
		assert.ok(fnPropagateFieldGroupIDsSpy.calledOnce, "_propagateFieldGroupIDs was invoked in Edit mode");

		// cleanup
		oSmartField.destroy();
	});

	QUnit.test("it should fire the visibleChanged event", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			visible: true
		});

		// arrange
		var fnFireVisibleChangedSpy = this.spy(oSmartField, "fireVisibleChanged");

		// act
		oSmartField.setVisible(false);

		// assert
		assert.strictEqual(fnFireVisibleChangedSpy.callCount, 1);
		assert.strictEqual(fnFireVisibleChangedSpy.args[0][0].visible, false);

		// cleanup
		oSmartField.destroy();
	});

	QUnit.test("it should fire the editableChanged event", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = this.oSmartField;

		// arrange
		var fnFireEditableChangedSpy = this.spy(oSmartField, "fireEditableChanged");

		// act
		oSmartField.setEditable(false);

		oSmartField.onBeforeRendering().then(function(){
			// assert
			assert.strictEqual(fnFireEditableChangedSpy.callCount, 1);
			assert.strictEqual(fnFireEditableChangedSpy.args[0][0].editable, false);

			// cleanup
			oSmartField.destroy();
			done();
		});
	});

	QUnit.test("it should fire the editableChanged event only once", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = this.oSmartField;

		// arrange
		var fnFireEditableChangedSpy = this.spy(oSmartField, "fireEditableChanged");

		// act
		oSmartField.setEditable(false);
		oSmartField.setEditable(false);

		oSmartField.onBeforeRendering().then(function(){
			// Assert
			assert.strictEqual(fnFireEditableChangedSpy.callCount, 1);
			assert.strictEqual(fnFireEditableChangedSpy.args[0][0].editable, false);

			fnFireEditableChangedSpy.reset();

			oSmartField.setEditable(false);

			oSmartField.onBeforeRendering().then(function(){
				// Assert
				assert.strictEqual(fnFireEditableChangedSpy.callCount, 0);

				// cleanup
				oSmartField.destroy();
				done();
			});
		});
	});

	QUnit.test("it should fire the contextEditable event", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = this.oSmartField;

		// arrange
		var fnFireContextEditableChangedSpy = this.spy(oSmartField, "fireContextEditableChanged");

		// act
		oSmartField.setContextEditable(false);

		oSmartField.onBeforeRendering().then(function(){
			// assert
			assert.strictEqual(fnFireContextEditableChangedSpy.callCount, 1);
			assert.strictEqual(fnFireContextEditableChangedSpy.args[0][0].editable, false);

			// cleanup
			oSmartField.destroy();
			done();
		});
	});

	QUnit.test("it should fire the contextEditable event only once", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = this.oSmartField;

		// arrange
		var fnFireContextEditableChangedSpy = this.spy(oSmartField, "fireContextEditableChanged");

		// act
		oSmartField.setContextEditable(false);
		oSmartField.setContextEditable(false);

		oSmartField.onBeforeRendering().then(function(){
			// assert
			assert.strictEqual(fnFireContextEditableChangedSpy.callCount, 1);
			assert.strictEqual(fnFireContextEditableChangedSpy.args[0][0].editable, false);

			fnFireContextEditableChangedSpy.reset();

			oSmartField.setContextEditable(false);

			oSmartField.onBeforeRendering().then(function(){
				// assert
				assert.strictEqual(fnFireContextEditableChangedSpy.callCount, 0);

				// cleanup
				oSmartField.destroy();
				done();
			});
		});
	});

	// BCP: 1780147285
	QUnit.test("it should propagate the value of the showSuggestion property to the inner control in edit mode", function(assert) {

		// arrange
		var oInput = new Input();
		this.oSmartField._init();
		this.stub(this.oSmartField.getControlFactory(), "_createValueHelp").returns(undefined);
		this.oSmartField.setShowSuggestion(false);
		this.oSmartField.setContent(oInput);

		// act
		this.oSmartField.setShowSuggestion(true);

		// assert
		assert.strictEqual(oInput.getShowSuggestion(), true);

		// cleanup
		this.oSmartField.destroy();
	});

	// BCP: 1780147285
	QUnit.test("it should propagate the value of the showValueHelp property to the inner control in edit mode", function(assert) {

		// arrange
		var oInput = new Input();
		this.oSmartField._init();
		this.stub(this.oSmartField.getControlFactory(), "_createValueHelp").returns(undefined);
		this.oSmartField.setShowValueHelp(false);
		this.oSmartField.setContent(oInput);

		// act
		this.oSmartField.setShowValueHelp(true);

		// assert
		assert.strictEqual(oInput.getShowValueHelp(), true);

		// cleanup
		this.oSmartField.destroy();
	});

	// BCP: 0020751295 0000236582 2017
	QUnit.test('it should map the "mandatory" property to the hosted inner control as "required"', function(assert) {
		// Arrange
		var fnDone = assert.async();

		this.oSmartField.attachInitialise(function () {
			// Assert
			assert.strictEqual(this.oSmartField.getFirstInnerControl().getRequired(), true);
			fnDone();
		}.bind(this));

		// Act
		this.oSmartField.setMandatory(true);
		this.oSmartField._forceInitialise();
	});

	// BCP: 1880222106
	QUnit.test("it should propagate the value of the required property to the underlying text input controls" , function(assert) {

		// system under test
		var oInput1 = new Input({
			required: false
		});
		var oInput2 = new Input({
			required: false
		});

		// arrange
		this.stub(this.oSmartField, "getInnerControls").returns([
			oInput1, oInput2
		]);

		// act
		this.oSmartField._setPropertyOnControls("required" , true);

		// assert
		assert.strictEqual(oInput1.getRequired(), true);
		assert.strictEqual(oInput2.getRequired(), true);

		// cleanup
		oInput1.destroy();
		oInput2.destroy();
	});

	QUnit.test("it should propagate the value of the textAlign property to the underlying text input controls" , function(assert) {

		// system under test
		var oInput = new Input();
		this.spy(oInput, "setTextAlign");

		// arrange
		this.oSmartField.setContent(oInput);
		this.stub(this.oSmartField, "getInnerControls").returns([
			oInput
		]);

		var oMetadata = oInput.getMetadata();
		this.stub(oMetadata, "getProperty").returns("setTextAlign");

		// act
		this.oSmartField.setTextAlign("End");
		this.oSmartField._propagateToInnerControls();

		// assert
		assert.ok(oInput.setTextAlign.calledWith("End"));

		// cleanup
		oInput = null;
		this.oSmartField.getInnerControls.reset();
	});

	QUnit.test("it should return true when the control is displayed in the form context", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			controlContext: ControlContextType.Form
		});

		// assert
		assert.strictEqual(oSmartField.isFormContextType(), true);

		// cleanup
		oSmartField.destroy();
	});

	QUnit.test("it should return false when the control is not displayed in the form context", function(assert) {

		// system under test
		var oSmartField = new SmartField();

		// assert
		assert.strictEqual(oSmartField.isFormContextType(), false);

		// cleanup
		oSmartField.destroy();
	});

	QUnit.test("it should propagate the value of the tooltip aggregation to the underlying control", function(assert) {

		// arrange
		var oInput = new Input();
		this.oSmartField.setContent(oInput);
		var sTooltip = "lorem ipsum";

		// act
		this.oSmartField.setTooltip(sTooltip);

		// assert
		assert.strictEqual(oInput.getTooltip(), sTooltip);

		// cleanup
		this.oSmartField.destroy();
	});

	QUnit.test("it should forward .bindProperty() function call to Control.prototype.bindProperty() (test case 1)", function(assert) {

		// arrange
		var oSmartField = new SmartField();
		var oBindingInfo = { path: "ProductID" };
		var oBindPropertySpy = this.spy(Control.prototype, "bindProperty");

		// act
		var oReturn = oSmartField.bindProperty("placeholder", oBindingInfo);

		// assert
		assert.ok(oBindPropertySpy.calledOnce);
		assert.ok(oReturn === oSmartField, "it should return this to allow method chaining");

		// cleanup
		oSmartField.destroy();
	});

	QUnit.test("it should forward .bindProperty() function call to Control.prototype.bindProperty() (test case 2)", function(assert) {

		// arrange
		var oSmartField = new SmartField();
		var oBindingInfo = { path: "ProductID" };
		var oBindPropertySpy = this.spy(Control.prototype, "bindProperty");
		this.stub(oSmartField, "isPropertyInitial").withArgs("value").returns(true);

		// act
		var oReturn = oSmartField.bindProperty("value", oBindingInfo);

		// assert
		assert.ok(oBindPropertySpy.calledOnce);
		assert.ok(oReturn === oSmartField, "it should return this to allow method chaining");

		// cleanup
		oSmartField.destroy();
	});

	// BCP: 1880503798
	QUnit.test("it should destroy the control factory, inner controls and create a new inner control when the " +
	           "binding path changes (test case 1)", function(assert) {

		// arrange
		var done = assert.async();
		var oSmartField = new SmartField();
		var oBindingInfo = { path: "ProductID" };
		var oFactory = sinon.createStubInstance(ODataControlFactory);
		var oDestroyFactorySpy = this.stub(oSmartField, "_destroyFactory").returns();
		var oInitSpy = this.stub(oSmartField, "_init").callsFake(function(){
			oSmartField._oFactory = oFactory;
		});

		oFactory.bind.returns(Promise.resolve());
		this.stub(oSmartField, "_hasDefaultModel").returns(true);
		this.stub(oSmartField, "_createControlIfRequired");
		this.stub(oSmartField, "isPropertyInitial").withArgs("value").returns(false);
		this.stub(oSmartField, "getBindingPath").withArgs("value").returns("CategoryID");
		this.stub(oSmartField, "_oFactory").value({});
		this.stub(Control.prototype, "bindProperty").callsFake(function(sPropertyName, oBindingInfo) {
			oSmartField.getBindingPath.restore();
			this.stub(oSmartField, "getBindingPath").withArgs("value").returns("ProductID");

			// assert
			assert.strictEqual(sPropertyName, "value");
			assert.strictEqual(oBindingInfo.path, "ProductID");
		}.bind(this));

		// act
		oSmartField.bindProperty("value", oBindingInfo);
		oSmartField.onBeforeRendering().then(function(){
			// assert
			assert.ok(oDestroyFactorySpy.calledOnce);
			assert.ok(oInitSpy.calledOnce);

			// cleanup
			oSmartField.destroy();
			done();
		});
	});

	QUnit.test("it should destroy the control factory, inner controls and create a new inner control when the " +
	           "binding context changes (test case 2)", function(assert) {

		// arrange
		var done = assert.async();
		var oSmartField = new SmartField();
		var oBindingInfo = { path: "SalesOrderID" };
		var oFactory = sinon.createStubInstance(ODataControlFactory);
		var oDestroyFactorySpy = this.stub(oSmartField, "_destroyFactory").returns();
		var oInitSpy =  this.stub(oSmartField, "_init").callsFake(function(){
			oSmartField._oFactory = oFactory;
		});

		oFactory.bind.returns(Promise.resolve());
		this.stub(oSmartField, "_hasDefaultModel").returns(true);
		this.stub(oSmartField, "_createControlIfRequired");
		this.stub(oSmartField, "isPropertyInitial").withArgs("value").returns(false);
		this.stub(oSmartField, "getBindingPath").withArgs("value").returns("SalesOrderID");
		this.stub(oSmartField, "_oFactory").value({});
		this.stub(oSmartField, "getBindingContext").returns({
			getPath: function() {
				return "/SalesOrderSet('0500000000')";
			}
		});
		this.stub(Control.prototype, "bindProperty").callsFake(function(sPropertyName, oBindingInfo) {
			oSmartField.getBindingContext.restore();
			this.stub(oSmartField, "getBindingContext").returns({
				getPath: function() {
					return "/SalesOrderSet('0500000001')";
				}
			});

			// assert
			assert.strictEqual(sPropertyName, "value");
			assert.strictEqual(oBindingInfo.path, "SalesOrderID");
		}.bind(this));

		// act
		oSmartField.bindProperty("value", oBindingInfo);
		oSmartField.onBeforeRendering().then(function(){
			// assert
			assert.ok(oDestroyFactorySpy.calledOnce);
			assert.ok(oInitSpy.calledOnce);

			// cleanup
			oSmartField.destroy();
			done();
		});
	});

	QUnit.test("it should forward function calls to .unBindProperty() to inner controls", function(assert) {

		// system under test
		var oInput = new Input();
		var oText = new Text();

		// arrange
		var oInputUnbindPropertySpy = this.spy(oInput, "unbindProperty");
		var oTextUnbindPropertySpy = this.spy(oText, "unbindProperty");
		this.stub(this.oSmartField, "getAllInnerControls").returns([
			oInput, oText
		]);

		// act
		var oReturn = this.oSmartField.unbindProperty("value");

		// assert
		assert.ok(oInputUnbindPropertySpy.calledOnceWithExactly("value", undefined));
		assert.ok(oTextUnbindPropertySpy.calledOnceWithExactly("text", undefined));
		assert.ok(oReturn === this.oSmartField, "It should return this to allow method chaining");

		// cleanup
		oInput.destroy();
		oText.destroy();
	});

	QUnit.test("it should return all inner controls", function(assert) {

		// arrange
		var oText = new Text();
		var oInput = new Input();
		this.oSmartField._oControl = { // mimic the SmartField control internal data structure
			current: "display",
			display: oText,
			edit: oInput
		};

		// act
		var aControls = this.oSmartField.getAllInnerControls();

		// assert
		assert.strictEqual(aControls.length, 2);
		assert.ok(aControls[0] === oText);
		assert.ok(aControls[1] === oInput);

		// cleanup
		oText.destroy();
		oInput.destroy();
	});

	QUnit.test('it should toggle the inner UOM field when calling the "setUomEditable" method and the "uomEditable" ' +
				'property is not bound', function(assert) {

		// system under test
		var oSmartField = new SmartField({
			uomEditable: true
		});
		var oUomSmartField = new SmartField({
			editable: true
		});

		// arrange
		this.stub(oSmartField, "_getEmbeddedSmartField").returns(oUomSmartField);

		// act
		var oReturn = oSmartField.setUomEditable(false);
		oSmartField._propagateToInnerControls();

		// assert
		assert.strictEqual(oSmartField.getUomEditable(), false);
		assert.ok(oSmartField === oReturn);
		assert.strictEqual(oUomSmartField.getEditable(), false);

		// cleanup
		oSmartField.destroy();
		oUomSmartField.destroy();
	});

	QUnit.test('it should toggle the inner UOM field when calling the "setUomEnabled" method and the "uomEnabled" ' +
				'property is not bound', function(assert) {

		// system under test
		var oSmartField = new SmartField({
			uomEnabled: true
		});
		var oUomSmartField = new SmartField({
			enabled: true
		});

		// arrange
		this.stub(oSmartField, "_getEmbeddedSmartField").returns(oUomSmartField);

		// act
		var oReturn = oSmartField.setUomEnabled(false);
		oSmartField._propagateToInnerControls();

		// assert
		assert.strictEqual(oSmartField.getUomEnabled(), false);
		assert.ok(oSmartField === oReturn);
		assert.strictEqual(oUomSmartField.getEnabled(), false);

		// cleanup
		oSmartField.destroy();
		oUomSmartField.destroy();
	});

	// BCP: 1870386724
	QUnit.test('it should show/hide the inner UOM field when calling the "setUomVisible" method and the "uomVisible" ' +
				'property is not bound', function(assert) {

		// system under test
		var oSmartField = new SmartField({
			uomVisible: true
		});
		var oUomSmartField = new SmartField({
			visible: true
		});

		// arrange
		this.stub(oSmartField, "_getEmbeddedSmartField").returns(oUomSmartField);

		// act
		var oReturn = oSmartField.setUomVisible(false);
		oSmartField._propagateToInnerControls();

		// assert
		assert.strictEqual(oSmartField.getUomVisible(), false);
		assert.ok(oSmartField === oReturn);
		assert.strictEqual(oUomSmartField.getVisible(), false);

		// cleanup
		oSmartField.destroy();
		oUomSmartField.destroy();
	});

	// BCP: 1880664737
	QUnit.test('it should toggle the "smartFieldPaddingRight" CSS style class of the amount field when ' +
	           'the currency field is set to invisible', function(assert) {

		// system under test
		var oSmartField = new SmartField({
			uomVisible: true
		});

		var oUomSmartField = new SmartField({
			visible: true
		});

		var oMeasureField = new Input();

		// arrange
		this.stub(oSmartField, "_getEmbeddedSmartField").returns(oUomSmartField);
		this.stub(oUomSmartField, "getFirstInnerControl").returns(oMeasureField);

		oSmartField._oFactory = sinon.createStubInstance(ODataControlFactory);
		oSmartField._oFactory.oMeasureField = oMeasureField;

		// act + assert
		oSmartField.setUomVisible(false);
		oSmartField._propagateToInnerControls();
		assert.notOk(oMeasureField.hasStyleClass("smartFieldPaddingRight"));
		oSmartField.setUomVisible(true);
		oSmartField._propagateToInnerControls();
		assert.ok(oMeasureField.hasStyleClass("smartFieldPaddingRight"));

		// cleanup
		oSmartField.destroy();
		oUomSmartField.destroy();
	});

	QUnit.test("setEnabled", function(assert) {
		var oReturn = this.oSmartField.setEnabled(true);
		assert.equal(this.oSmartField.getProperty("enabled"), true);
		assert.equal(this.oSmartField, oReturn);
	});

	QUnit.test("setEditable", function(assert) {
		var oReturn = this.oSmartField.setEditable(true);
		assert.equal(this.oSmartField.getProperty("editable"), true);
		assert.equal(this.oSmartField, oReturn);
	});

	QUnit.test("setContextEditable", function(assert) {
		var oReturn = this.oSmartField.setContextEditable(true);
		assert.equal(this.oSmartField.getProperty("contextEditable"), true);
		assert.equal(this.oSmartField, oReturn);
	});

	QUnit.test("_initialStateApplied deferred object", function (assert) {
		// Arrange
		var fnDone = assert.async();
		assert.expect(2);

		// Assert
		assert.strictEqual(typeof this.oSmartField._initialStateApplied, "object", "Object is created on init");
		this.oSmartField._initialStateApplied.promise.then(function () {
			assert.ok(true, "Deferred promise is resolved");
			fnDone();
		});

		// Act - force the control
		this.oSmartField._forceInitialise();
	});

	// BCP: 1780483007
	QUnit.module("toggling inner controls via .setEditable() and .setContextEditable()", {
		beforeEach: function() {

			// system under test
			this.oSmartField = new SmartField({
				editable: true,
				contextEditable: true,
				enabled: true
			});

			this.oText = new Text();

			// arrange to mimic an SmartField control internal data structure
			this.oSmartField._oControl = {
				current: "display",
				display: this.oText,
				edit: null
			};

			this.oSmartField.mBindingInfos = {
				editable: {},
				contextEditable: {}
			};
		},
		afterEach: function() {

			// cleanup
			this.oText.destroy();
			this.oSmartField.destroy();
			this.oText = null;
			this.oSmartField = null;
		}
	});

	QUnit.test("it should not toggle the current displayed inner control when the bound entity is deleted (test case 1)", function(assert) {
		// by default the editable property is set to true

		// arrange
		this.stub(this.oSmartField, "getBindingContext").returns(null);
		this.stub(this.oSmartField, "getBindingInfo").withArgs("editable").returns({
			skipModelUpdate: 1
		});
		var oToggleControlSpy = this.spy(this.oSmartField, "_toggleInnerControlIfRequired");

		// act mimic a model update
		this.oSmartField.setEditable(false);

		// assert
		assert.strictEqual(oToggleControlSpy.callCount, 0, "it should not toggle the inner control");
	});

	QUnit.test("it should not toggle the current displayed inner control when the bound entity is deleted (test case 2)", function(assert) {
		// by default the contextEditable property is set to true

		// arrange
		this.stub(this.oSmartField, "getBindingContext").returns({
			getObject: function() {
				return; // return undefined to simulate a deleted entity
			}
		});

		this.stub(this.oSmartField, "getBindingInfo").withArgs("contextEditable").returns({
			skipModelUpdate: 1
		});
		var oToggleControlSpy = this.spy(this.oSmartField, "_toggleInnerControlIfRequired");

		// act mimic a model update
		this.oSmartField.setContextEditable(false);

		// assert
		assert.strictEqual(oToggleControlSpy.callCount, 0, "it should not toggle the inner control");
	});

	QUnit.test("it should toggle the current displayed inner control (test case 1)", function(assert) {
		// by default the editable property is set to true

		// arrange
		var done = assert.async();
		var oFactory = sinon.createStubInstance(ODataControlFactory);
		oFactory.bind.returns(Promise.resolve());

		this.oSmartField._oControl = {
			current: undefined,
			display: undefined,
			edit: undefined
		};

		var oToggleControlSpy = this.stub(this.oSmartField, "_toggleInnerControlIfRequired");
		this.stub(this.oSmartField, "_hasDefaultModel").returns(true);
		this.stub(this.oSmartField, "_init").callsFake(function(){
			this.oSmartField._oFactory = oFactory;
		}.bind(this));

		// act
		this.oSmartField.setEditable(false);
		this.oSmartField.onBeforeRendering().then(function(){
			// assert
			assert.strictEqual(oToggleControlSpy.callCount, 1, "it should toggle the inner control");
			done();
		});
	});

	QUnit.test("it should toggle the current displayed inner control (test case 2)", function(assert) {

		// arrange
		var done = assert.async();
		var oFactory = sinon.createStubInstance(ODataControlFactory);
		oFactory.bind.returns(Promise.resolve());

		this.stub(this.oSmartField, "getBindingInfo").withArgs("contextEditable").returns({
			skipModelUpdate: 0
		});
		this.stub(this.oSmartField, "_hasDefaultModel").returns(true);
		this.stub(this.oSmartField, "_destroyFactory").returns();
		this.stub(this.oSmartField, "_init").callsFake(function(){
			this.oSmartField._oFactory = oFactory;
		}.bind(this));

		var oToggleControlSpy = this.spy(this.oSmartField, "_toggleInnerControlIfRequired");

		// act
		this.oSmartField.setEditable(false);
		this.oSmartField.onBeforeRendering().then(function(){
			// assert
			assert.strictEqual(oToggleControlSpy.callCount, 1, "it should toggle the inner control");
			done();
		});
	});

	QUnit.test("in the context of smarttable, changing to editable should clear the ValueState errors", function(assert) {

		// Arrange
		var done = assert.async();
		var oEditControl = new Input({
			valueState: ValueState.Error
		});
		var oFactory = sinon.createStubInstance(ODataControlFactory);
		oFactory.bind.returns(Promise.resolve());

		this.stub(this.oSmartField, "_oControl").value({edit : oEditControl});
		this.stub(this.oSmartField, "getControlContext").returns("responsiveTable");
		this.stub(this.oSmartField, "_hasDefaultModel").returns(true);
		this.stub(this.oSmartField, "_destroyFactory").returns();
		this.stub(this.oSmartField, "_init").callsFake(function(){
			this.oSmartField._oFactory = oFactory;
		}.bind(this));

		// Act
		this.oSmartField.setEditable(false);
		this.oSmartField.onBeforeRendering().then(function(){
			this.oSmartField.setEditable(true);
			this.oSmartField.onBeforeRendering().then(function(){
				// Assert
				assert.equal(oEditControl.getValueState(), ValueState.None, "ValueState is reset to none after switching the table from display to edit");
				done();
			});
		}.bind(this));
	});

	QUnit.module("checkValuesValidity", {
		beforeEach: function() {

			// system under test
			this.oSmartField = new SmartField();

			// arrange
			this.oInnerInput = new Input();
			this.oType = new StringType();
			this.stub(this.oSmartField, "getInnerControls").returns([
				this.oInnerInput
			]);
			this.stub(this.oInnerInput, "getValue").returns("Lorem");
			this.stub(this.oInnerInput, "getBinding").withArgs("value").returns({
				getType: function() {
					return this.oType;
				}.bind(this),
				getValue: function() {
					return "Lorem";
				},
				getDataState: function() {
					return {
						getValue: function() {
							return "Lorem";
						},
						isControlDirty: function() {
							return false;
						}
					};
				},
				hasValidation: function(){
					return true;
				},
				sInternalType: "string"
			});

			// Return test EDM property name
			this.stub(this.oSmartField, "getControlFactory").returns({
				getEdmProperty: function () {
					return {
						name: "testEdmPropertyName"
					};
				}
			});
		},
		afterEach: function() {

			// cleanup
			this.oType.destroy();
			this.oInnerInput.destroy();
			this.oSmartField.destroy();
			this.oType = null;
			this.oInnerInput = null;
			this.oSmartField = null;
		}
	});

	QUnit.test("checkValuesValidity should return a fulfilled promise object when the control is in display", function(assert) {
		var done = assert.async();

		// arrange
		this.stub(this.oSmartField, "getMode").returns("display");
		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(true);
		}).catch(function() {
			assert.ok(false);
		}).finally(function() {
			assert.strictEqual(oFireValidationErrorSpy.callCount, 0, 'it should not fire a "validationError" event');
			assert.strictEqual(oFireParseErrorSpy.callCount, 0, 'it should not fire a "parseError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 0, 'it should not fire a "validationSuccess" event');
			done();
		});
	});

	QUnit.test("checkValuesValidity should return a fulfilled Promise object (test case 1)", function(assert) {
		var done = assert.async();

		// arrange
		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(true);
		}).catch(function() {
			assert.ok(false);
		}).finally(function() {
			assert.strictEqual(oFireValidationErrorSpy.callCount, 0, 'it should not fire a "validationError" event');
			assert.strictEqual(oFireParseErrorSpy.callCount, 0, 'it should not fire a "parseError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 1, 'it should fire a "validationSuccess" event');
			done();
		});
	});

	QUnit.test("checkValuesValidity should return a fulfilled Promise object (test case 2)", function(assert) {
		var done = assert.async();

		// arrange
		this.stub(this.oType, "parseValue").callsFake(function(vValue, sSourceType) {
			return new Promise(function(fnResolve, fnReject) {
				fnResolve("Ipsum");
			});
		});
		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(true);
		}).catch(function() {
			assert.ok(false);
		}).then(function() {
			assert.strictEqual(oFireValidationErrorSpy.callCount, 0, 'it should not fire a "validationError" event');
			assert.strictEqual(oFireParseErrorSpy.callCount, 0, 'it should not fire a "parseError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 1, 'it should fire a "validationSuccess" event');
			done();
		});
	});

	QUnit.test("checkValuesValidity should return a fulfilled Promise object (test case 3)", function(assert) {
		var done = assert.async();

		// arrange
		this.stub(this.oType, "parseValue").callsFake(function(vValue, sSourceType) {
			return new Promise(function(fnResolve, fnReject) {
				setTimeout(function() {
					fnResolve("Ipsum");
				}, 100);
			});
		});
		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(true);
		}).catch(function() {
			assert.ok(false);
		}).then(function() {
			assert.strictEqual(oFireValidationErrorSpy.callCount, 0, 'it should not fire a "validationError" event');
			assert.strictEqual(oFireParseErrorSpy.callCount, 0, 'it should not fire a "parseError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 1, 'it should fire a "validationSuccess" event');
			done();
		});
	});

	QUnit.test("checkValuesValidity should return a fulfilled Promise object (test case 4)", function(assert) {
		var done = assert.async();

		// arrange
		this.stub(this.oType, "parseValue").callsFake(function(vValue, sSourceType) {
			return new Promise(function(fnResolve, fnReject) {
				fnResolve();
			});
		});

		this.stub(this.oType, "validateValue").callsFake(function(aValue) {
			return new Promise(function(fnResolve, fnReject) {
				fnResolve();
			});
		});

		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(true);
		}).catch(function() {
			assert.ok(false);
		}).finally(function() {
			assert.strictEqual(oFireValidationErrorSpy.callCount, 0, 'it should not fire a "validationError" event');
			assert.strictEqual(oFireParseErrorSpy.callCount, 0, 'it should not fire a "parseError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 1, 'it should fire a "validationSuccess" event');
			done();
		});
	});

	QUnit.test("checkValuesValidity should return a fulfilled Promise object (test case 5)", function(assert) {
		var done = assert.async();

		// arrange
		this.stub(this.oType, "parseValue").callsFake(function(vValue, sSourceType) {
			return new Promise(function(fnResolve, fnReject) {
				setTimeout(function() {
					fnResolve();
				}, 100);
			});
		});

		this.stub(this.oType, "validateValue").callsFake(function(aValue) {
			return new Promise(function(fnResolve, fnReject) {
				setTimeout(function() {
					fnResolve();
				}, 100);
			});
		});

		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(true);
		}).catch(function() {
			assert.ok(false);
		}).finally(function() {
			assert.strictEqual(oFireValidationErrorSpy.callCount, 0, 'it should not fire a "validationError" event');
			assert.strictEqual(oFireParseErrorSpy.callCount, 0, 'it should not fire a "parseError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 1, 'it should fire a "validationSuccess" event');
			done();
		});
	});

	// BCP: 1970321980
	QUnit.test("checkValuesValidity should return a fulfilled Promise object (test case 6)", function(assert) {
		var done = assert.async();

		// arrange
		this.oType.async = true;
		var oParseValueSpy = this.spy(this.oType, "parseValue");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(true);
		}).catch(function() {
			assert.ok(false);
		}).then(function() {
			assert.strictEqual(oParseValueSpy.callCount, 0, 'it should not unnecessary call the "parseValue" method ' +
            'of an async binding data type to prevent an unnecessary HTTP request to be sent in case the value was already validated (not dirty)');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 1, 'it should fire a "validationSuccess" event');
			done();
		});
	});

	QUnit.test("checkValuesValidity should return a rejected Promise object (test case 1)", function(assert) {
		var done = assert.async();

		// arrange
		this.stub(this.oType, "parseValue").callsFake(function(vValue, sSourceType) {
			return new Promise(function(fnResolve, fnReject) {
				fnReject(new ParseException());
			});
		});
		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(false);
		}).catch(function() {
			assert.ok(true);
		}).finally(function() {
			assert.strictEqual(oFireValidationErrorSpy.callCount, 0, 'it should not fire a "validationError" event');
			assert.strictEqual(oFireParseErrorSpy.callCount, 1, 'it should fire a "parseError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 0, 'it should not fire a "validationSuccess" event');
			done();
		});
	});

	QUnit.test("checkValuesValidity should return a rejected Promise object (test case 2)", function(assert) {
		var done = assert.async();

		// arrange
		this.stub(this.oType, "parseValue").callsFake(function(vValue, sSourceType) {
			return new Promise(function(fnResolve, fnReject) {
				fnResolve();
			});
		});

		this.stub(this.oType, "validateValue").callsFake(function(aValue) {
			return new Promise(function(fnResolve, fnReject) {

				setTimeout(function() {
					fnReject(new ValidateException());
				}, 100);
			});
		});

		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(false);
		}).catch(function() {
			assert.ok(true);
		}).finally(function() {
			assert.strictEqual(oFireValidationErrorSpy.callCount, 1, 'it should fire a "validationError" event');
			assert.strictEqual(oFireParseErrorSpy.callCount, 0, 'it should not fire a "parseError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 0, 'it should not fire a "validationSuccess" event');
			done();
		});
	});

	QUnit.test("checkValuesValidity should return a rejected Promise object (test case 3)", function(assert) {
		var done = assert.async();

		// arrange
		this.stub(this.oType, "validateValue").callsFake(function(aValue) {
			return new Promise(function(fnResolve, fnReject) {

				setTimeout(function() {
					fnReject(new ValidateException());
				}, 100);
			});
		});

		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(false);
		}).catch(function() {
			assert.ok(true);
		}).finally(function() {
			assert.strictEqual(oFireValidationErrorSpy.callCount, 1, 'it should fire a "validationError" event');
			assert.strictEqual(oFireParseErrorSpy.callCount, 0, 'it should not fire a "parseError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 0, 'it should not fire a "validationSuccess" event');
			done();
		});
	});

	QUnit.test("checkValuesValidity should return a rejected Promise object (test case 4)", function(assert) {
		var done = assert.async();

		// arrange
		this.stub(this.oType, "validateValue").callsFake(function(vValue, sSourceType) {
			throw new ValidateException("Lorem Ipsum");
		});
		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(false);
		}).catch(function() {
			assert.ok(true);
		}).finally(function() {
			assert.strictEqual(oFireParseErrorSpy.callCount, 0, 'it should not fire a "parseError" event');
			assert.strictEqual(oFireValidationErrorSpy.callCount, 1, 'it should fire a "validationError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 0, 'it should not fire a "validationSuccess" event');
			done();
		});
	});

	QUnit.test("checkValuesValidity calls internal _updateCurrencyRawValues method when no oSettings object provided", function (assert) {
		// Arrange
		var oSpy = this.spy(this.oSmartField, "_updateCurrencyRawValues");

		// Mock some inner methods
		this.oSmartField.getInnerControls.returns([ // We are in 2 inner controls scenario so we modify the stub
			new Input(), new Input()
		]);

		this.oSmartField._getEmbeddedSmartField = function () {
			return new Input().data("configdata", {
				configdata: {
					isUOM: true
				}
			});
		};

		// Act
		this.oSmartField.checkValuesValidity();

		// Assert
		assert.strictEqual(oSpy.callCount, 1, "Internal method should be called once.");

		// Cleanup
		oSpy.restore();
	});

	QUnit.test("checkValuesValidity should return property name on successful validation", function(assert) {
		// Arrange
		var fnDone = assert.async();
		assert.expect(2);

		// Act
		var oPromise = this.oSmartField.checkValuesValidity();

		// Assert
		oPromise.then(function(oData) {
			assert.strictEqual(oData.property, "testEdmPropertyName", "Key info should match");
			assert.ok(oData.instance === this.oSmartField, "Correct SmartField instance returned");
			fnDone();
		}.bind(this)).catch(function(oData) {
			assert.ok(false, "Promise should succeed");
		});
	});

	QUnit.test("checkValuesValidity should return property name in display mode", function(assert) {
		// Arrange
		var fnDone = assert.async();
		assert.expect(2);

		this.stub(this.oSmartField, "getMode").returns("display");

		// Act
		var oPromise = this.oSmartField.checkValuesValidity();

		// Assert
		oPromise.then(function(oData) {
			assert.strictEqual(oData.property, "testEdmPropertyName", "Key info should match");
			assert.ok(oData.instance === this.oSmartField, "Correct SmartField instance returned");
			fnDone();
		}.bind(this)).catch(function(oData) {
			assert.ok(false, "Promise should succeed");
		});
	});

	QUnit.test("checkValuesValidity should return property name on failed validation", function(assert) {
		// Arrange
		var fnDone = assert.async();
		assert.expect(2);

		this.stub(this.oType, "validateValue").callsFake(function(aValue) {
			return new Promise(function(fnResolve, fnReject) {
				fnReject(new ValidateException());
			});
		});

		// Act
		var oPromise = this.oSmartField.checkValuesValidity();

		// Assert
		oPromise.then(function() {
			assert.ok(false, "Promise should fail");
		}).catch(function(oData) {
			assert.strictEqual(oData.property, "testEdmPropertyName", "Key info should match");
			assert.ok(oData.instance === this.oSmartField, "Correct SmartField instance returned");
			fnDone();
		}.bind(this));
	});

	// BCP: 0020751295 0000179434 2019
	QUnit.module("toggling inner controls via .setConfiguration()", {
		beforeEach: function() {

			// system under test
			this.oSmartField = new SmartField();
			this.oInput = new Input();

			// arrange
			this.oSmartField.setContent(this.oInput);
		},
		afterEach: function() {

			// cleanup
			this.oInput.destroy();
			this.oInput = null;
			this.oSmartField.destroy();
			this.oSmartField = null;
		}
	});

	QUnit.test("it should toggle the inner control when the configuration aggregation changes (test case 1)", function(assert) {

		// arrange
		var oFactory = sinon.createStubInstance(ODataControlFactory);
		var oConfig = new Configuration({
			controlType: ControlType.dropDownList
		});

		var oDestroyInnerControls = this.spy(this.oSmartField, "_destroyControls");
		var oToggleInnerControlsSpy = this.spy(this.oSmartField, "_toggleInnerControlIfRequired");

		sinon.stub(this.oSmartField, "_oFactory").value(oFactory);

		// act
		var oReturn = this.oSmartField.setConfiguration(oConfig);

		// assert
		assert.strictEqual(oDestroyInnerControls.callCount, 1);
		assert.strictEqual(oToggleInnerControlsSpy.callCount, 1);
		assert.ok(oReturn === this.oSmartField);
		assert.ok(oConfig === this.oSmartField.getConfiguration());

		// cleanup
		oConfig.destroy();
	});

	QUnit.test("it should toggle the inner control when the configuration aggregation changes (test case 2)", function(assert) {

		// system under test
		var oConfig = new Configuration({
			controlType: ControlType.dropDownList
		});

		var oSmartField = new SmartField({
			configuration: oConfig
		});

		var oInput = new Input();

		// arrange
		oSmartField.setContent(oInput);
		var oDestroyInnerControls = this.spy(oSmartField, "_destroyControls");
		var oToggleInnerControlsSpy = this.spy(oSmartField, "_toggleInnerControlIfRequired");

		// act
		var oReturn = oSmartField.setConfiguration(null);

		// assert
		assert.strictEqual(oDestroyInnerControls.callCount, 1);
		assert.strictEqual(oToggleInnerControlsSpy.callCount, 1);
		assert.ok(oReturn === oSmartField);
		assert.ok(this.oSmartField.getConfiguration() === null);

		// cleanup
		oConfig.destroy();
		oInput.destroy();
		oSmartField.destroy();
	});

	QUnit.test("it should toggle the inner control when the configuration aggregation changes (test case 3)", function(assert) {

		// arrange
		var oFactory = sinon.createStubInstance(ODataControlFactory);
		var oConfig = new Configuration({
			displayBehaviour: DisplayBehaviour.descriptionOnly
		});

		var oDestroyInnerControls = this.spy(this.oSmartField, "_destroyControls");
		var oToggleInnerControlsSpy = this.spy(this.oSmartField, "_toggleInnerControlIfRequired");

		sinon.stub(this.oSmartField, "_oFactory").value(oFactory);

		// act
		var oReturn = this.oSmartField.setConfiguration(oConfig);

		// assert
		assert.strictEqual(oDestroyInnerControls.callCount, 1);
		assert.strictEqual(oToggleInnerControlsSpy.callCount, 1);
		assert.ok(oConfig === this.oSmartField.getConfiguration());
		assert.ok(oReturn === this.oSmartField);

		// cleanup
		oConfig.destroy();
	});


	QUnit.test("it should toggle the inner control when the configuration aggregation changes (test case 4)", function(assert) {

		// arrange
		var oFactory = sinon.createStubInstance(ODataControlFactory);
		var oConfig = new Configuration({
			displayBehaviour: DisplayBehaviour.descriptionOnly
		});

		var oDestroyInnerControls = this.spy(this.oSmartField, "_destroyControls");
		var oToggleInnerControlsSpy = this.spy(this.oSmartField, "_toggleInnerControlIfRequired");
		sinon.stub(this.oSmartField, "_oFactory").value(oFactory);
		this.oSmartField.setConfiguration(oConfig);

		// act
		var oReturn = this.oSmartField.setConfiguration(oConfig);

		// assert
		assert.strictEqual(oDestroyInnerControls.callCount, 1);
		assert.strictEqual(oToggleInnerControlsSpy.callCount, 1);
		assert.ok(this.oSmartField.getConfiguration() === oConfig);
		assert.ok(oReturn === this.oSmartField);

		// cleanup
		oConfig.destroy();
	});

	QUnit.test("it should NOT toggle the inner control when the configuration aggregation changes", function(assert) {

		// arrange
		var oDestroyInnerControls = this.spy(this.oSmartField, "_destroyControls");
		var oToggleInnerControlsSpy = this.spy(this.oSmartField, "_toggleInnerControlIfRequired");

		// act, notice that the current configuration value before invoking this method is null
		var oReturn = this.oSmartField.setConfiguration(null);

		// assert
		assert.strictEqual(oDestroyInnerControls.callCount, 0);
		assert.strictEqual(oToggleInnerControlsSpy.callCount, 0);
		assert.ok(this.oSmartField.getConfiguration() === null);
		assert.ok(oReturn === this.oSmartField);
	});

	QUnit.test("it should NOT toggle the inner control when the configuration aggregation changes and " +
				"the inner controls are not created", function(assert) {

		// system under test
		var oSmartField = new SmartField();

		// arrange
		var oConfig = new Configuration({
			displayBehaviour: DisplayBehaviour.descriptionOnly
		});
		var oDestroyInnerControls = this.spy(oSmartField, "_destroyControls");
		var oToggleInnerControlsSpy = this.spy(oSmartField, "_toggleInnerControlIfRequired");

		var oReturn = oSmartField.setConfiguration(oConfig);

		// assert
		assert.strictEqual(oDestroyInnerControls.callCount, 0, "inner controls should be created async after the meta model is loaded");
		assert.strictEqual(oToggleInnerControlsSpy.callCount, 0, "inner controls should be created async after the meta model is loaded");
		assert.ok(oSmartField.getConfiguration() === oConfig);
		assert.ok(oReturn === oSmartField);

		// cleanup
		oConfig.destroy();
		oSmartField.destroy();
	});

	QUnit.module("Internal methods", {
		beforeEach: function () {
			this.oSmartField = new SmartField();
		},
		afterEach: function () {
			this.oSmartField.destroy();
		}
	});

	QUnit.test("_updateCurrencyRawValues generates rawValues property", function (assert) {
		// Arrange
		var oSettings = {
			innerControls: [
				new Input({value: "100"}),
				new Input({value: "EUR"})
			]
		};

		// Act
		this.oSmartField._updateCurrencyRawValues(oSettings);

		// Assert
		assert.deepEqual(oSettings.rawValues, ["100", "EUR"], "rawValues property should be generated");
	});

	QUnit.test("_getTextArrangementRead", function (assert) {
		// Arrange
		var oTAR,
			oTAR2;

		// Assert
		assert.strictEqual(this.oSmartField._oTextArrangementRead, undefined,
			"By default TextArrangementRead property is undefined");

		// Act
		oTAR = this.oSmartField._getTextArrangementRead();

		// Assert
		assert.ok(oTAR instanceof TextArrangementRead, "Proper instance created lazily");

		// Act
		oTAR2 = this.oSmartField._getTextArrangementRead();

		// Assert
		assert.strictEqual(oTAR, oTAR2, "Both are the same instance");
	});

	QUnit.test("setEditable should handle JSONControlFactory no reBindIfNecessary method", function (assert) {
		// Arrange
		var oModel;

		assert.expect(1); // If exception is thrown the test will fail with 2 assertions when expected 1

		oModel = sinon.createStubInstance(JSONModel);
		this.oSmartField._oFactory = new JSONControlFactory(oModel, this.oSmartField, { model : null, path : "value" });

		try {
			this.oSmartField.setEditable(false);
		} catch (e) {
			assert.ok(false, e);
		}

		assert.ok(true, "No exception was thrown.");
	});

	QUnit.test("isTextInEditModeSourceNotNone should use _getComputedTextInEditModeSource", function (assert) {
		// Arrange
		var oSmartField = this.oSmartField;
		sinon.spy(oSmartField, "_getComputedTextInEditModeSource");

		// Act
		oSmartField.isTextInEditModeSourceNotNone();

		// Assert
		assert.ok(oSmartField._getComputedTextInEditModeSource.calledOnce);

	});

	QUnit.test("if textInEditSourceMode is not set, _getComputedTextInEditModeSource should return the " +
		"defaultTextInEditSourceMode from the SmartForm's custom data", function (assert) {

		// Arrange
		var sComputedTextInEditSourceMode,
			oSmartField = this.oSmartField,
			sCustomDataTextInEditSourceMode = "ValueList";
		this.stub(oSmartField, "data").returns(sCustomDataTextInEditSourceMode);
		this.stub(oSmartField, "getMode").returns("edit");

		// Act
		sComputedTextInEditSourceMode = oSmartField._getComputedTextInEditModeSource();

		// Assert
		assert.ok(sComputedTextInEditSourceMode);
		assert.equal(sComputedTextInEditSourceMode, sCustomDataTextInEditSourceMode, "textInEditSourceMode is same as " +
			"the one from custom data");
	});

	QUnit.test("checkValuesValidity is robust when Edm.Property no longer exist", function (assert) {
		// Arrange
		var oFactoryStub = this.stub(this.oSmartField, "getControlFactory").returns({
				getEdmProperty: function () {
					return undefined;
				}
			}),
			fnDone = assert.async();

		assert.expect(1);

		try {
			// Act
			this.oSmartField.checkValuesValidity().then(function () {
				// Assert
				assert.ok(true, "There was no exception and the promise resolved");
				fnDone();
			});
		} catch (e) {
			// Assert
			assert.ok(false, "The call should not throw an exception");
		}

		// Cleanup
		oFactoryStub.restore();
	});

	QUnit.test("getDataSourceLabel works as expected", function (assert) {
		// Assert
		assert.strictEqual(typeof this.oSmartField.getDataSourceLabel, "function", "Protected method is available");
		assert.strictEqual(this.oSmartField.getDataSourceLabel(), "", "Method returns initial empty string value");

		// Act - change internal label value
		this.oSmartField._sAnnotationLabel = "MyTestLabel";

		// Assert
		assert.strictEqual(this.oSmartField.getDataSourceLabel(), "MyTestLabel", "Method returns new label value");
	});

	QUnit.test("_getEditableForNotExpandedNavigation prohibits editable for navigation properties", function (assert) {
		assert.ok(SmartField.prototype.hasOwnProperty("_getEditableForNotExpandedNavigation"), "Method is defined");
		assert.strictEqual(this.oSmartField._getEditableForNotExpandedNavigation(), false, "Method returns false");
	});

	QUnit.test("_getComputedMetadata restricted method", function (assert) {
		var fnDone = assert.async();
		assert.expect(2);

		// Arrange
		this.stub(this.oSmartField, "_oFactory").value({
			getMetaData: function () { // NOTE: case is important in method name
				return true; // Mock internal response we use to assert later on
			},
			isA: function () {return true;},
			destroy: function () {}
		});

		// Assert
		assert.ok(SmartField.prototype.hasOwnProperty("_getComputedMetadata"), "method is available");

		this.oSmartField._getComputedMetadata().then(function (oComputedMetadata) {
			assert.ok(oComputedMetadata, "Method calls internal implementation");
			fnDone();
		});

		// Act - we manually resolve the internal deferred object
		this.oSmartField._initialStateApplied.resolve();
	});

	QUnit.test("_calculateFieldGroupIDs restricted method", function (assert) {
		// Assert
		assert.ok(SmartField.prototype.hasOwnProperty("_calculateFieldGroupIDs"), "method is available");
	});

	QUnit.test("_processStateHandler should process the state and create base controls of the embeded SmartFields that corresponds to current mode", function (assert) {
		// Arrange
		var done = assert.async(),
			oSmartField = this.oSmartField,
			oFactory = sinon.createStubInstance(ODataControlFactory),
			oDisplayHBox = sinon.createStubInstance(HBox),
			oEditHBox = sinon.createStubInstance(HBox),
			oEditEmbededSmartField = sinon.createStubInstance(SmartField),
			oDisplayEmbededSmartField = sinon.createStubInstance(SmartField);

		// The tests are run without a real entitySet, so we need to fake the checks for it.
		sinon.stub(oSmartField._oState, "isEntitySetChanged").returns(false);

		oEditEmbededSmartField.isA.returns(true);
		oDisplayEmbededSmartField.isA.returns(true);

		oEditHBox.isA.returns(true);
		oEditHBox.getItems.returns([oEditEmbededSmartField]);

		oDisplayHBox.isA.returns(true);
		oDisplayHBox.getItems.returns([oDisplayEmbededSmartField]);

		oFactory.bind.returns(Promise.resolve());
		sinon.stub(oSmartField, "_oFactory").value(oFactory);

		sinon.stub(oSmartField, "_oControl").value({
			edit: oEditHBox,
			display: oDisplayHBox
		});

		// We want to change the edit/display mode durring the initialization process
		// We want to make sure that
		// eventhough the mode has changed to "display", the embeded SmartField for "edit" mode will process its state
		sinon.stub(SmartField.prototype, "_toggleInnerControlIfRequired").callsFake(function(){
			oSmartField.setContextEditable(false);
		});

		// Act
		oSmartField._processStateHandler().then(function(){
			// Assert
			assert.equal(oSmartField.getMode(), "display", "The mode of the parent SmartField has changed durring its State processing.");
			assert.ok(oEditEmbededSmartField._processState.calledOnce, "The state of the Edit mode embeded SmartField is processed.");
			assert.notOk(oDisplayEmbededSmartField._processState.calledOnce, "The state of the Edit mode embeded SmartField is not processed.");

			// Clean
			SmartField.prototype._toggleInnerControlIfRequired.restore();

			done();
		});
	});

	QUnit.test("enhanceAccessibilityState Should be called on the rendered element, not on the SmartField", function(assert) {
		// Arrange
		var oGroupElement = new GroupElement(),
			oText = new Text(),
			mProps = {},
			fnSpy = sinon.spy(oGroupElement, "enhanceAccessibilityState");

		this.oSmartField.setParent(oGroupElement);

		// Act
		this.oSmartField.enhanceAccessibilityState(oText, mProps);

		// Assert
		assert.ok(fnSpy.calledWith(oText, mProps), "enhanceAccessibilityState is called on the correct control");

		// Cleanup
		oGroupElement.destroy();
		oText.destroy();
		fnSpy.restore();
	});

	QUnit.test("SmartField: _setOnInnerControl should not propagate justifyContent to inner controls if already set", function (assert) {
		// Arrange
		var oSmartField = this.oSmartField,
			oDisplayHBox = sinon.createStubInstance(HBox);

		sinon.stub(oSmartField, "getFirstInnerControl").returns(null);
		sinon.stub(oSmartField, "_setPropertyOnControls").callsFake(function () {});
		sinon.stub(oSmartField, "getContent").returns(oDisplayHBox);

		oDisplayHBox.getJustifyContent.returns("End");
		oDisplayHBox.setJustifyContent.reset();

		// Act
		oSmartField._setOnInnerControl();

		// Assert
		assert.ok(oDisplayHBox.getJustifyContent.calledOnce, "getJustifyContent method was called");
		assert.notOk(oDisplayHBox.setJustifyContent.called, "justifyContent property was not reset");
	});

	QUnit.test("_getComputedMetadata does not throw exception", function (assert) {
		// Arrange
		const fnDone = assert.async();
		assert.expect(1);

		// Mock resolve the deferred object
		this.oSmartField._initialStateApplied.resolve();

		// Assert
		this.oSmartField._getComputedMetadata().then(() => {
			assert.ok(true, "No exception thrown");
			fnDone();
		}).catch((e) => {
			assert.ok(false, "The method should not throw an exception");
			fnDone();
		});
	});

	QUnit.module("Suggestions with history values", {
		beforeEach: function () {
			this.oSmartField = new SmartField();
		},
		afterEach: function () {
			this.oSmartField.destroy();
		}
	});

	QUnit.test("HistoryEnabled default value is true", function (assert) {

		// Arrange
		var oSmartField = this.oSmartField,
			bHistoryEnabled = oSmartField.getHistoryEnabled();

		// Act

		// Assert
		assert.ok(bHistoryEnabled, "HistoryEnabled default value 'true'");
	});

	QUnit.test("HistoryEnabled default value is true", function (assert) {

		// Arrange
		var oSmartField = this.oSmartField,
			bHistoryEnabled;

		// Act
			oSmartField.setHistoryEnabled(false);
			bHistoryEnabled = oSmartField.getHistoryEnabled();

		// Assert
		assert.notOk(bHistoryEnabled, "HistoryEnabled set to 'false'");
	});

	QUnit.test("BCP: 2070359493. Overriding the protected method should ignore default configuration propagated via custom data", function (assert) {
		// Arrange
		var MySmartField,
			oSF;

		// Assert
		assert.ok(
			typeof SmartField.prototype._getComputedTextInEditModeSource === "function",
			"_getComputedTextInEditModeSource should be a function available on the prototype"
		);

		// Arrange -> extend the control and override the method on the prototype.
		MySmartField = SmartField.extend("sap.ui.comp.smartfield.MySmartField");
		MySmartField.prototype._getComputedTextInEditModeSource = function () {
			return TextInEditModeSource.None;
		};

		// Arrange -> create instance of the new control with custom data configuration.
		oSF = new MySmartField();
		oSF.data("defaultTextInEditModeSource", "ValueListNoValidation");

		// Assert
		assert.strictEqual(
			oSF.isTextInEditModeSourceNotNone(),
			false,
			"Text in edit mode source should be `None` despite the custom data provided default"
		);

		// Cleanup
		oSF.destroy();
	});

	QUnit.test("textDirection set to RTL", async function(assert) {

		// Arrange
		var oSmartField = this.oSmartField;

		// Act
		oSmartField.placeAt("qunit-fixture");
		await nextUIUpdate();
		oSmartField.setTextDirection("RTL");
		await nextUIUpdate();

		var sSmartFieldTextDirection = oSmartField.getTextDirection();


		// Assert
		assert.equal(sSmartFieldTextDirection, "RTL", "SmartField TextDirection set to 'RTL'");

		// Cleanup
		oSmartField.destroy();
	});

	QUnit.test("textDirection set to RTL and after that LTR", async function(assert) {

		// Arrange
		var oSmartField = this.oSmartField;

		// Act
		oSmartField.placeAt("qunit-fixture");
		await nextUIUpdate();
		oSmartField.setTextDirection("RTL");
		await nextUIUpdate();
		oSmartField.setTextDirection("LTR");
		await nextUIUpdate();

		var sSmartFieldTextDirection = oSmartField.getTextDirection();

		// Assert
		assert.equal(sSmartFieldTextDirection, "LTR", "SmartField TextDirection set to 'LTR'");

		// Cleanup
		oSmartField.destroy();
	});

	QUnit.test("textDirection set to LTR and after that RTL", async function(assert) {

		// Arrange
		var oSmartField = this.oSmartField;

		// Act
		oSmartField.placeAt("qunit-fixture");
		await nextUIUpdate();
		oSmartField.setTextDirection("LTR");
		await nextUIUpdate();
		oSmartField.setTextDirection("RTL");
		await nextUIUpdate();
		var sSmartFieldTextDirection = oSmartField.getTextDirection();

		// Assert
		assert.equal(sSmartFieldTextDirection, "RTL", "SmartField TextDirection set to 'RTL'");

		// Cleanup
		oSmartField.destroy();
	});

	QUnit.module("Test visibility based on SmartField/SmartForm importance", {
		beforeEach: function () {
			this.oSmartField = new SmartField();
		},
		afterEach: function () {
			this.oSmartField.destroy();
		}
	});

	QUnit.test("If Importance property is set it takes precedence over the annotation", function(assert) {
		// Ararnge
		var oSmartField = this.oSmartField,
			oHelper = new ODataHelper(),
			sFormImportance = "High";
			oSmartField._oFactory = sinon.createStubInstance(ODataControlFactory);

			oSmartField._oFactory.getMetaData.returns({
				property: {
					property: {
						"com.sap.vocabularies.UI.v1.Importance": {
							"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Low"
						}
					}
				}
			});
			oSmartField._oFactory._oHelper = oHelper;

		// Act
		oSmartField.setImportance("High");
		oSmartField._setVisibilityBasedOnImportance(sFormImportance);

		// Assert
		assert.equal(oSmartField.getVisible(), true, "Importance from annotation is ignored");
	});

	QUnit.test("If a SmartField is mandatory or hidden its visibility should not be changed based on importance", function(assert) {
		// Arrange
		var oSmartField = this.oSmartField,
			oHelper = new ODataHelper(),
			fnSpyGetImportance = sinon.spy(oHelper.oAnnotation, "getImportanceAnnotation");

		oSmartField.oParent = {
			isA: function() {return {};},
			getDomRef: function() {
				return {
					style: {}
				};
			}
		};
		oSmartField._oFactory = sinon.createStubInstance(ODataControlFactory);
		oSmartField._oFactory.getMetaData.returns({
			property: {
				property: {
					"com.sap.vocabularies.Common.v1.FieldControl": {
						"EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
					}
				}
			}
		});
		oSmartField._oFactory._oHelper = oHelper;

		// Act
		oSmartField._setVisibilityBasedOnImportance("High");

		// Assert
		assert.equal(fnSpyGetImportance.callCount, 0, "SmartFields visibility is not changed when it is annotated as FieldControlType/Mandatory");

		// Arrange
		oSmartField._oFactory.getMetaData.returns({
			property: {
				property: {
					"com.sap.vocabularies.Common.v1.FieldControl": {
						"EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
					}
				}
			}
		});

		// Act
		oSmartField._setVisibilityBasedOnImportance("High");

		// Assert
		assert.equal(fnSpyGetImportance.callCount, 0, "SmartFields visibility is not changed when it is annotated as FieldControlType/Hidden");

		// Arrange
		oSmartField._oFactory.getMetaData.returns({
			property: {
				property: {
					"nullable": "false"
				}
			}
		});

		// Act
		oSmartField._setVisibilityBasedOnImportance("High");

		// Assert
		assert.equal(fnSpyGetImportance.callCount, 0, "SmartFields visibility is not changed when it is annotated as Mandatory with Nullable='false'");

		// Arrange
		oSmartField._oFactory.getMetaData.returns({
			property: {
				property: {}
			}
		});
		oSmartField._fieldControlValue = 0;

		// Act
		oSmartField._setVisibilityBasedOnImportance("High");

		// Assert
		assert.equal(fnSpyGetImportance.callCount, 0, "SmartFields visibility is not changed when it is annotated as Hidden with dynamic field control");

		// Arrange
		oSmartField._fieldControlValue = 7;

		// Act
		oSmartField._setVisibilityBasedOnImportance("High");

		// Assert
		assert.equal(fnSpyGetImportance.callCount, 0, "SmartFields visibility is not changed when it is annotated as Mandatory with dynamic field control");
	});

	QUnit.test("Parse the right parameter when checkErrors is called from checkValuesValidity", function (assert) {

		// Arrange
		var done = assert.async();
		this.oInnerInput = new Input();
		this.stub(this.oSmartField, "getInnerControls").returns([
			this.oInnerInput
		]);
		var oCheckErrorSpy = this.spy(this.oSmartField, "_checkErrors");

		// Assert
		this.oSmartField.checkValuesValidity()
		.then(function() {
			assert.ok(true);
		}).catch(function() {
			assert.ok(false);
		}).finally(function() {
			assert.strictEqual(oCheckErrorSpy.args[0][1].bCheckValuesValidity,true);
			done();
		});
	});

	QUnit.test("Set the FieldGroups when BindingContext gets available", function (assert) {
		// Arrange
		var oInnerInput = new Input(),
			oSettings = {mode: this.oSmartField.getMode()},
			oModel = sinon.createStubInstance(ODataModel),
			fnSetFieldGroupIds = this.stub(oInnerInput, "setFieldGroupIds"),
			fnGetBindingContext = this.stub(this.oSmartField, "getBindingContext");

		this.stub(this.oSmartField, "getContent").returns(oInnerInput);
		this.stub(this.oSmartField, "_oControl").value({edit: oInnerInput});
		this.stub(this.oSmartField, "getModel").returns(oModel);
		this.stub(this.oSmartField, "getMode").returns("edit");
		this.stub(this.oSmartField, "_getView").returns({});
		this.stub(this.oSmartField._oSideEffects, "getFieldGroupIDs").returns(["textFieldGroupName"]);
		this.oSmartField._oFactory = sinon.createStubInstance(ODataControlFactory);
		this.oSmartField._oFactory.getMetaData.returns({property: {property: {}}});
		this.oSmartField._oFactory.triggerCreationOfControls.returns({});
		fnGetBindingContext.returns(null);

		// Act
		// We assume that _onInnerControlToggled will aways be invoked on bindingContext change.
		// Otherwise the SF won't work properly.
		this.oSmartField._onInnerControlToggled(oSettings);

		// Assert
		assert.equal(fnSetFieldGroupIds.callCount, 0);

		// Arrange
		fnGetBindingContext.returns({});

		// Act
		// We assume that _onInnerControlToggled will aways be invoked on bindingContext change.
		// Otherwise the SF won't work properly.
		this.oSmartField._onInnerControlToggled({mode: this.oSmartField.getMode()});
		assert.equal(fnSetFieldGroupIds.callCount, 1);
	});


	QUnit.test("SNOW DINC0312285: _onInnerControlToggled should not fetch description if {fetchIDAndDescription: false} is passed", function (assert) {
		// Arrange
		var oFactory = sinon.createStubInstance(ODataControlFactory);

		this.stub(this.oSmartField, "_oFactory").value(oFactory);

		// Act
		this.oSmartField._onInnerControlToggled({fetchIDAndDescription: false});

		// Assert
		assert.strictEqual(oFactory.fetchIDAndDescriptionCollectionIfRequired.callCount, 0, "Description is not fetched");
	});

	QUnit.test("BCP: 2170284106 description request triggered on removed binding", function (assert) {
		// Arrange
		var oFactory = sinon.createStubInstance(ODataControlFactory);

		this.stub(this.oSmartField, "_oFactory").value(oFactory);
		this.stub(this.oSmartField, "getModel").returns(true);
		this.stub(this.oSmartField, "getBindingContext").returns(true);
		this.stub(this.oSmartField, "getBinding").returns(false);

		// Act
		this.oSmartField._onInnerControlToggled({fetchIDAndDescription: true, smartFieldControl: this.oSmartField});

		// Assert
		assert.strictEqual(oFactory.fetchIDAndDescriptionCollectionIfRequired.callCount, 0, "Internal method is not triggered when there is no value binding");

		// Arrange
		this.oSmartField.getBinding.returns(true);

		// Act
		this.oSmartField._onInnerControlToggled({fetchIDAndDescription: true,  smartFieldControl: this.oSmartField});

		// Assert
		assert.strictEqual(oFactory.fetchIDAndDescriptionCollectionIfRequired.callCount, 1, "Internal method is triggered when there is value binding");

		// Clean
		this.oSmartField.getModel.restore();
		this.oSmartField.getBindingContext.restore();
		this.oSmartField.getBinding.restore();
	});

	QUnit.test("BCP: 2280005161 description should be recalculated when it is different for display and edit base controls ", function (assert) {
		// Arrange
		var bRECALCULATE_DESCRIPTION_PATH = true,
			done = assert.async(),
			sDescriptionPath = "descriptionPath",
			sChangedDescriptionPath = "changedDescriptionPath",
			oEditControlBindingInfo = {parts: [{}, {path: sDescriptionPath}]},
			oDisplayControlBindingInfo = {parts: [{}, {path: sDescriptionPath}]},
			oFactory = sinon.createStubInstance(ODataControlFactory),
			oInput = sinon.createStubInstance(Input),
			oText = sinon.createStubInstance(Text);

		oFactory.bind.returns(Promise.resolve());
		oInput.getBindingInfo.returns(oEditControlBindingInfo);
		oText.getBindingInfo.returns(oDisplayControlBindingInfo);
		this.stub(this.oSmartField, "_oControl").value({
			current: "display",
			display: oText,
			edit: oInput
		});
		this.stub(this.oSmartField, "getModel").returns({getId: function(){return "fakeId";}});
		this.stub(this.oSmartField, "getBindingContext").returns({getPath: function(){return "fakePath";}});
		this.stub(this.oSmartField, "getBinding").returns(false);
		this.stub(this.oSmartField, "getInnerControls").returns([]);
		this.oSmartField.setEditable(false);

		// Action
		this.oSmartField.onBeforeRendering().then(function(){
			this.stub(this.oSmartField, "_oFactory").value(oFactory);

			return this.oSmartField.onBeforeRendering();
		}.bind(this)).then(function(){
			// Assert
			assert.strictEqual(oFactory.bind.withArgs({mode: 'display', rebind: !bRECALCULATE_DESCRIPTION_PATH}).callCount, 1);

			//Arrange
			oEditControlBindingInfo.parts[1].path = sChangedDescriptionPath;
			this.oSmartField.setEditable(true);

			return this.oSmartField.onBeforeRendering();
		}.bind(this)).then(function(){
			// Assert
			assert.strictEqual(oFactory.bind.withArgs({mode: 'edit', rebind: bRECALCULATE_DESCRIPTION_PATH}).callCount, 1);
			done();

			// Clean
			this.oSmartField.getModel.restore();
			this.oSmartField.getBindingContext.restore();
			this.oSmartField.getBinding.restore();
		}.bind(this));
	});

	QUnit.test("BCP: 2280024367 cloned SmartFields should be ivalidated on modelContextChange event", function (assert) {
		// Arrange
		var oClone;

		// Action
		oClone = this.oSmartField.clone();

		// Assert
		assert.strictEqual(oClone.mEventRegistry.modelContextChange.length, 2, "There are two event listeners. One for the source and one for the clone.");

		// Clean
		oClone.destroy();
		oClone = null;
	});

	QUnit.test("SmartField: _getICRenderedPromise should be ready early for cloned fields", function (assert) {
		// Arrange
		var oSF = this.oSmartField.clone();

		// Assert
		assert.ok(oSF._getICRenderedPromise() instanceof Promise, "Promise is returned.");

		// Cleanup
		oSF.destroy();
	});
});
