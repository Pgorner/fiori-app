/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff4000.protocol.ina"
],
function(oFF)
{
"use strict";

oFF.InAProcessorResult = function() {};
oFF.InAProcessorResult.prototype = new oFF.XObject();
oFF.InAProcessorResult.prototype._ff_c = "InAProcessorResult";

oFF.InAProcessorResult.create = function(structure)
{
	return oFF.InAProcessorResult.createWithContentType(structure, null);
};
oFF.InAProcessorResult.createWithContentType = function(structure, supportedContentType)
{
	let response = new oFF.InAProcessorResult();
	response.m_structure = structure;
	response.m_supportedContentType = supportedContentType;
	return response;
};
oFF.InAProcessorResult.prototype.m_structure = null;
oFF.InAProcessorResult.prototype.m_supportedContentType = null;
oFF.InAProcessorResult.prototype.getStructure = function()
{
	return this.m_structure;
};
oFF.InAProcessorResult.prototype.getSupportedContentType = function()
{
	return this.m_supportedContentType;
};
oFF.InAProcessorResult.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_structure = null;
	this.m_supportedContentType = null;
};

oFF.ProcessorConstants = {

	CUSTOM_DIM:"CustomDimension1",
	CUSTOM_DIM_DESCRIPTION:"Measures",
	CUSTOM_DIM_KEY:"Measures",
	CUSTOM_DIM_KEY_DESCRIPTION:"CustomDimension1 key",
	CUSTOM_DIM_TEXT:"Measures.Description",
	CUSTOM_DIM_TEXT_DESCRIPTION:"CustomDimension1 text",
	MD_PROPERTY_SAP_DISPLAY_FORMAT_UPPERCASE:"UpperCase",
	SD_AGGREGATION:"aggregation",
	SD_ATTRIBUTES:"attributes",
	SD_AXIS_POSITION:"axis_position",
	SD_BEGIN_POS_IN_TUPLE:"begin_position_in_tuple",
	SD_COLUMNS:"Columns",
	SD_COLUMN_NAME_IN_INPUT:"column_name_in_input",
	SD_COMPLEX_UNITS:"complex_units",
	SD_CUBE_AXES:"cube_axes",
	SD_CUBE_UNIT:"cube_unit",
	SD_CUBE_UNIT_HANDLER_KEY:"cube_unit_handler_key",
	SD_CUBE_UNIT_HANDLER_VALUE:"cube_unit_handler_value",
	SD_CURRENT_TYPE:"current_type",
	SD_DATA_SOURCE_KEY:"data_source_key",
	SD_DESCRIPTION:"description",
	SD_DIGITS_SHIFT:"digits_shift",
	SD_DIMENSIONS:"dimensions",
	SD_DIMENSION_MAP:"dimension_map",
	SD_DIMENSION_MEMBERS:"view_dimension_members",
	SD_DIMENSION_TUPLES:"dimension_tuples",
	SD_DIMENSION_TYPE:"dimension_type",
	SD_ENTITIES:"entities",
	SD_EXISTS_RESTRICTION:"exists_restriction",
	SD_EXISTS_UNIT_CONVERSION:"exists_unit_conversion",
	SD_EXPONENT:"exp",
	SD_FRACT_DIGITS:"fract_digits",
	SD_HAS_EXCEPTION_SETTINGS:"EPM_has_exception_settings",
	SD_HIERARCHY_DISPLAYED:"hierarchy_displayed",
	SD_ID:"id",
	SD_IS_AGGREGATABLE:"is_aggregatable",
	SD_IS_DESCRIPTION_COLUMN:"is_description_column",
	SD_IS_DESCRIPTION_FROM_KEY_COLUMN:"is_description_from_key_column",
	SD_IS_DIMENSION_GROUP:"is_dimension_group",
	SD_IS_HIDDEN:"is_hidden",
	SD_IS_KEY_ATTRIBUTE:"is_key_attribute",
	SD_IS_MEASURE:"is_measure",
	SD_IS_MODELED:"is_modeled",
	SD_IS_TEMPORARY:"is_temporary",
	SD_IS_VIRTUAL_DESCRIPTION:"is_virtual_description",
	SD_KEY:"key",
	SD_KEY_COLUMN_NAME:"key_column_name",
	SD_LAST_CHANGED_AT:"last_changed_at",
	SD_MEMBERS:"members",
	SD_MEMBER_COLS:"columns",
	SD_MEMBER_COLS_COLUMN_NAME:"column_name",
	SD_MEMBER_COLS_COLUMN_TYPE:"column_type",
	SD_MEMBER_REF_COLS:"reference_columns",
	SD_MEMBER_REF_COLS_COL_NAME:"column_name",
	SD_MEMBER_REF_COLS_NAME:"reference_name",
	SD_MESSAGE_VERSION:"message_version",
	SD_NAME:"name",
	SD_NAME_IN_VIEW:"name_in_view",
	SD_PART_OF_RESULT_GRID:"is_part_of_result_grid",
	SD_RESULT_STRUCTURE:"result_structure",
	SD_RESULT_STRUCTURE_SEMANTIC_MEMBERS:"RESULT_STRUCTURE_SEMANTIC_MEMBERS",
	SD_ROWS:"Rows",
	SD_SQL_TYPE:"sql_type",
	SD_SQL_TYPE_STRG:"STRING",
	SD_STRING_VALUE:"string_value",
	SD_TUPLE:"tuple",
	SD_TYPE:"type",
	SD_TYPE_INT_DIGITS:"int_digits",
	SD_TYPE_VALUE_CLASS:"value_class",
	SD_UNIQUE_NAME:"unique_name",
	SD_UNIT_INDEX:"unit_index",
	SD_UNIT_TYPE:"unit_type",
	SD_USE_UNIQUE_ATTRIBUTE_NAME:"use_unique_attribute_name",
	SD_VALUE:"value",
	SD_VALUES:"values",
	SD_VALUE_CLASS:"value_class",
	SD_VALUE_CLASS_STRING:"VALUE_CLASS_STRING",
	SD_VALUE_EXCEPTION_NORMAL:"VALUE_EXCEPTION_NORMAL",
	SD_VALUE_EXCEPTION_TYPE:"value_exception_type",
	SD_VIEW_COLUMN:"view_column",
	SD_VIEW_COLUMNS:"view_columns",
	SERVICE_MD_DIM_OBJECT_NAME:"ObjectName",
	SERVICE_MD_DIM_OBJECT_NAME_TEXT:"ObjectName.TEXT",
	SERVICE_MD_TEXT_ATTRIBUTE_SUFFIX:".TEXT"
};

oFF.VirtualRpcIdentifier = function() {};
oFF.VirtualRpcIdentifier.prototype = new oFF.XObject();
oFF.VirtualRpcIdentifier.prototype._ff_c = "VirtualRpcIdentifier";

oFF.VirtualRpcIdentifier.create = function(processName, inaRequestStructure, request, allRequests)
{
	let rpcIdentifier = new oFF.VirtualRpcIdentifier();
	rpcIdentifier.m_processName = processName;
	rpcIdentifier.m_requestStructure = inaRequestStructure;
	rpcIdentifier.m_request = request;
	rpcIdentifier.m_allRequests = allRequests;
	return rpcIdentifier;
};
oFF.VirtualRpcIdentifier.prototype.m_allRequests = null;
oFF.VirtualRpcIdentifier.prototype.m_processName = null;
oFF.VirtualRpcIdentifier.prototype.m_request = null;
oFF.VirtualRpcIdentifier.prototype.m_requestStructure = null;
oFF.VirtualRpcIdentifier.prototype.getAllRequests = function()
{
	return this.m_allRequests;
};
oFF.VirtualRpcIdentifier.prototype.getProcessName = function()
{
	return this.m_processName;
};
oFF.VirtualRpcIdentifier.prototype.getRequest = function()
{
	return this.m_request;
};
oFF.VirtualRpcIdentifier.prototype.getRequestStructure = function()
{
	return this.m_requestStructure;
};
oFF.VirtualRpcIdentifier.prototype.releaseObject = function()
{
	this.m_processName = null;
	this.m_requestStructure = null;
	this.m_request = null;
	this.m_allRequests = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.ProcessorGSAConstants = {

	ATTRIBUTES:"Attributes",
	DEFAULT_VALUE:"DefaultValue",
	DESCRIPTION:"Description",
	DIMENSIONS:"Dimensions",
	IS_DEFAULT_TEXT:"IsDefaultText",
	IS_KEY:"IsKey",
	IS_MANDATORY:"IsMandatory",
	IS_VARIABLE:"IsVariable",
	LENGTH:"Length",
	MEASURES:"Measures",
	NAME:"Name",
	NUMERIC_PRECISION:"NumericPrecision",
	NUMERIC_SCALE:"NumericScale",
	PARAMETERS:"Parameters",
	RESPONSE_PROPERTY:"ResponseProperty",
	TYPE:"Type",
	TYPE_BODY:"Body",
	TYPE_HEADER:"Header",
	TYPE_PATH:"Path",
	TYPE_QUERY:"Query",
	VALUE_TYPE:"ValueType"
};

oFF.GSAMdProperty = function() {};
oFF.GSAMdProperty.prototype = new oFF.XObject();
oFF.GSAMdProperty.prototype._ff_c = "GSAMdProperty";

oFF.GSAMdProperty.create = function(name, description, dataType, maxLength)
{
	let property = new oFF.GSAMdProperty();
	property.m_name = name;
	property.m_description = description;
	property.m_dataType = dataType;
	property.m_maxLength = maxLength;
	return property;
};
oFF.GSAMdProperty.createMeasure = function(name, description, dataType, numericPrecision, numericScale)
{
	let property = new oFF.GSAMdProperty();
	property.m_name = name;
	property.m_description = description;
	property.m_dataType = dataType;
	property.m_precision = numericPrecision > 0 ? oFF.XIntegerValue.create(numericPrecision) : null;
	property.m_scale = numericScale > 0 ? oFF.XIntegerValue.create(numericScale) : null;
	return property;
};
oFF.GSAMdProperty.prototype.m_dataType = null;
oFF.GSAMdProperty.prototype.m_description = null;
oFF.GSAMdProperty.prototype.m_maxLength = 0;
oFF.GSAMdProperty.prototype.m_name = null;
oFF.GSAMdProperty.prototype.m_precision = null;
oFF.GSAMdProperty.prototype.m_scale = null;
oFF.GSAMdProperty.prototype.getDataType = function()
{
	return this.m_dataType;
};
oFF.GSAMdProperty.prototype.getDescription = function()
{
	return this.m_description;
};
oFF.GSAMdProperty.prototype.getDisplayFormat = function()
{
	return null;
};
oFF.GSAMdProperty.prototype.getMaxLength = function()
{
	return this.m_maxLength;
};
oFF.GSAMdProperty.prototype.getName = function()
{
	return this.m_name;
};
oFF.GSAMdProperty.prototype.getNumericPrecision = function()
{
	return this.m_precision;
};
oFF.GSAMdProperty.prototype.getNumericScale = function()
{
	return this.m_scale;
};
oFF.GSAMdProperty.prototype.getUnitPropertyName = function()
{
	return null;
};
oFF.GSAMdProperty.prototype.getUnitTextPropertyName = function()
{
	return null;
};
oFF.GSAMdProperty.prototype.getUnitType = function()
{
	return null;
};
oFF.GSAMdProperty.prototype.isFilterable = function()
{
	return false;
};
oFF.GSAMdProperty.prototype.isSortable = function()
{
	return false;
};
oFF.GSAMdProperty.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_name = null;
	this.m_description = null;
	this.m_dataType = null;
	this.m_precision = oFF.XObjectExt.release(this.m_precision);
	this.m_scale = oFF.XObjectExt.release(this.m_scale);
};

oFF.ProcessorODataConstants = {

	MD_ASSOCIATION:"Association",
	MD_COMPLEX_TYPE:"ComplexType",
	MD_DATA_SERVICES:"edmx:DataServices",
	MD_DEPENDENT:"Dependent",
	MD_END:"End",
	MD_ENTITY_CONTAINER:"EntityContainer",
	MD_ENTITY_DATA_MODEL:"edmx:Edmx",
	MD_ENTITY_SET:"EntitySet",
	MD_ENTITY_TYPE:"EntityType",
	MD_LINK:"link",
	MD_NAVIGATION_PROPERTY:"NavigationProperty",
	MD_PRINCIPAL:"Principal",
	MD_PROPERTY:"Property",
	MD_PROPERTY_DATA_SERVICE_VERSION:"-m:DataServiceVersion",
	MD_PROPERTY_ENTITY_TYPE:"-EntityType",
	MD_PROPERTY_FROM_ROLE:"-FromRole",
	MD_PROPERTY_HREF:"-href",
	MD_PROPERTY_MAX_LENGTH:"-MaxLength",
	MD_PROPERTY_MULTIPLICITY:"-Multiplicity",
	MD_PROPERTY_NAME:"-Name",
	MD_PROPERTY_NAMESPACE:"-Namespace",
	MD_PROPERTY_PRECISION:"-Precision",
	MD_PROPERTY_REF:"PropertyRef",
	MD_PROPERTY_RELATIONSHIP:"-Relationship",
	MD_PROPERTY_ROLE:"-Role",
	MD_PROPERTY_SAP_AGGREGATION_ROLE:"-sap:aggregation-role",
	MD_PROPERTY_SAP_AGGREGATION_ROLE_MEASURE:"measure",
	MD_PROPERTY_SAP_DISPLAY_FORMAT:"-sap:display-format",
	MD_PROPERTY_SAP_FILTERABLE:"-sap:filterable",
	MD_PROPERTY_SAP_LABEL:"-sap:label",
	MD_PROPERTY_SAP_MEMBER_TITLE:"sap:member-title",
	MD_PROPERTY_SAP_QUICKINFO:"-sap:quickinfo",
	MD_PROPERTY_SAP_SEMANTICS:"-sap:semantics",
	MD_PROPERTY_SAP_SORTABLE:"-sap:sortable",
	MD_PROPERTY_SAP_SUPPORTED_FORMATS:"-sap:supported-formats",
	MD_PROPERTY_SAP_TEXT:"-sap:text",
	MD_PROPERTY_SAP_UNIT:"-sap:unit",
	MD_PROPERTY_SCALE:"-Scale",
	MD_PROPERTY_TITLE:"-title",
	MD_PROPERTY_TO_ROLE:"-ToRole",
	MD_PROPERTY_TYPE:"-Type",
	MD_PROPERTY_VERSION:"-Version",
	MD_REFERENTIAL_CONSTRAINT:"ReferentialConstraint",
	MD_SCHEMA:"Schema",
	MD_SEMANTICS_CURRENCY:"currency-code",
	MD_SEMANTICS_UNIT_OF_MEASURE:"unit-of-measure",
	MD_VALUETYPE_BOOLEAN:"Edm.Boolean",
	MD_VALUETYPE_DATETIME:"Edm.DateTime",
	MD_VALUETYPE_DECIMAL:"Edm.Decimal",
	MD_VALUETYPE_DOUBLE:"Edm.Double",
	MD_VALUETYPE_GUID:"Edm.Guid",
	MD_VALUETYPE_INTEGER:"Edm.Int",
	MD_VALUETYPE_SINGLE:"Edm.Single",
	MD_VALUETYPE_STRING:"Edm.String",
	MD_VALUETYPE_TIME:"Edm.Time",
	PARAM_METADATA:"$metadata",
	RS_APP_COLLECTION:"app:collection",
	RS_APP_SERVICE:"app:service",
	RS_APP_WORKSPACE:"app:workspace",
	RS_COLLECTION:"collection",
	RS_CONTENT:"content",
	RS_D:"d",
	RS_ENTITY_SETS:"EntitySets",
	RS_ENTRY:"entry",
	RS_FEED:"feed",
	RS_INLINE:"m:inline",
	RS_METADATA:"__metadata",
	RS_NAME:"name",
	RS_PROPERTIES:"m:properties",
	RS_PROPERTY_PREFIX:"d:",
	RS_RESULTS:"results",
	RS_SERVICE:"service",
	RS_TITLE:"atom:title",
	RS_VALUE:"value",
	RS_WORKSPACE:"workspace",
	URI_FILTER_AND:"and",
	URI_FILTER_BRACKET_CLOSE:")",
	URI_FILTER_BRACKET_OPEN:"(",
	URI_FILTER_EQUAL:"eq",
	URI_FILTER_GREATER:"gt",
	URI_FILTER_GREATER_EQUAL:"ge",
	URI_FILTER_INV_COMMA:"'",
	URI_FILTER_LESS:"lt",
	URI_FILTER_LESS_EQUAL:"le",
	URI_FILTER_NOT:"not",
	URI_FILTER_NOT_EQUAL:"ne",
	URI_FILTER_OR:"or",
	URI_FILTER_SPACE:" ",
	URI_FILTER_SUBSTRING:"substringof({0},{1}) eq true",
	URI_PARAM_EXPAND:"$expand",
	URI_PARAM_FILTER:"$filter",
	URI_PARAM_ORDERBY:"$orderby",
	URI_PARAM_SELECT:"$select",
	URI_PARAM_SKIP:"$skip",
	URI_PARAM_TOP:"$top"
};

oFF.ODataProperty = function() {};
oFF.ODataProperty.prototype = new oFF.XObject();
oFF.ODataProperty.prototype._ff_c = "ODataProperty";

oFF.ODataProperty.create = function(property, allProperties)
{
	return oFF.ODataProperty.createWithPrefix(property, allProperties, null);
};
oFF.ODataProperty.createWithPrefix = function(property, allProperties, namePrefix)
{
	let oDataProperty = new oFF.ODataProperty();
	oDataProperty.setupProperty(property, allProperties, oFF.notNull(namePrefix) ? oFF.XStringUtils.concatenate2(namePrefix, "/") : null);
	return oDataProperty;
};
oFF.ODataProperty.prototype.m_isMeasure = false;
oFF.ODataProperty.prototype.m_namePrefix = null;
oFF.ODataProperty.prototype.m_precision = null;
oFF.ODataProperty.prototype.m_property = null;
oFF.ODataProperty.prototype.m_scale = null;
oFF.ODataProperty.prototype.m_unitPropertyName = null;
oFF.ODataProperty.prototype.m_unitTextPropertyName = null;
oFF.ODataProperty.prototype.m_unitType = null;
oFF.ODataProperty.prototype.getDataType = function()
{
	return this.getDataTypeWithDefault("String");
};
oFF.ODataProperty.prototype.getDataTypeWithDefault = function(defaultValue)
{
	let type = this.getOriginDataType();
	if (oFF.XString.isEqual(type, oFF.ProcessorODataConstants.MD_VALUETYPE_STRING) || oFF.XString.isEqual(type, oFF.ProcessorODataConstants.MD_VALUETYPE_GUID))
	{
		return "String";
	}
	if (oFF.XString.isEqual(type, oFF.ProcessorODataConstants.MD_VALUETYPE_BOOLEAN))
	{
		return "Bool";
	}
	if (oFF.XString.containsString(type, oFF.ProcessorODataConstants.MD_VALUETYPE_INTEGER))
	{
		return "Int";
	}
	if (oFF.XString.isEqual(type, oFF.ProcessorODataConstants.MD_VALUETYPE_DOUBLE))
	{
		return "Double";
	}
	if (oFF.XString.isEqual(type, oFF.ProcessorODataConstants.MD_VALUETYPE_DECIMAL) || oFF.XString.isEqual(type, oFF.ProcessorODataConstants.MD_VALUETYPE_SINGLE))
	{
		return "DecimalFloat";
	}
	if (oFF.XString.isEqual(type, oFF.ProcessorODataConstants.MD_VALUETYPE_TIME))
	{
		return "Time";
	}
	if (oFF.XString.isEqual(type, oFF.ProcessorODataConstants.MD_VALUETYPE_DATETIME))
	{
		return "Timestamp";
	}
	return defaultValue;
};
oFF.ODataProperty.prototype.getDescription = function()
{
	if (this.m_property.hasStringByKey(oFF.ProcessorODataConstants.MD_PROPERTY_SAP_QUICKINFO))
	{
		return this.m_property.getStringByKey(oFF.ProcessorODataConstants.MD_PROPERTY_SAP_QUICKINFO);
	}
	else if (this.m_property.hasStringByKey(oFF.ProcessorODataConstants.MD_PROPERTY_SAP_LABEL))
	{
		return this.m_property.getStringByKey(oFF.ProcessorODataConstants.MD_PROPERTY_SAP_LABEL);
	}
	return this.getNameWithoutPrefix();
};
oFF.ODataProperty.prototype.getDisplayFormat = function()
{
	return oFF.PrUtils.getStringValueProperty(this.m_property, oFF.ProcessorODataConstants.MD_PROPERTY_SAP_DISPLAY_FORMAT, null);
};
oFF.ODataProperty.prototype.getMaxLength = function()
{
	return oFF.XInteger.convertFromStringWithDefault(this.m_property.getStringByKeyExt(oFF.ProcessorODataConstants.MD_PROPERTY_MAX_LENGTH, "-1"), -1);
};
oFF.ODataProperty.prototype.getName = function()
{
	return this.getNameWithPrefix(this.m_property);
};
oFF.ODataProperty.prototype.getNameWithPrefix = function(property)
{
	let name = oFF.PrUtils.getStringValueProperty(property, oFF.ProcessorODataConstants.MD_PROPERTY_NAME, null);
	return oFF.XStringUtils.concatenate2(this.m_namePrefix, name);
};
oFF.ODataProperty.prototype.getNameWithoutPrefix = function()
{
	return oFF.PrUtils.getStringValueProperty(this.m_property, oFF.ProcessorODataConstants.MD_PROPERTY_NAME, null);
};
oFF.ODataProperty.prototype.getNumericPrecision = function()
{
	return this.m_precision;
};
oFF.ODataProperty.prototype.getNumericScale = function()
{
	return this.m_scale;
};
oFF.ODataProperty.prototype.getOriginDataType = function()
{
	return this.m_property.getStringByKey(oFF.ProcessorODataConstants.MD_PROPERTY_TYPE);
};
oFF.ODataProperty.prototype.getUnitPropertyName = function()
{
	return this.m_unitPropertyName;
};
oFF.ODataProperty.prototype.getUnitTextPropertyName = function()
{
	return this.m_unitTextPropertyName;
};
oFF.ODataProperty.prototype.getUnitType = function()
{
	return this.m_unitType;
};
oFF.ODataProperty.prototype.getUnitTypeFromProperty = function(unitProperty)
{
	if (oFF.notNull(unitProperty))
	{
		let semantics = unitProperty.getStringByKey(oFF.ProcessorODataConstants.MD_PROPERTY_SAP_SEMANTICS);
		if (oFF.XString.isEqual(semantics, oFF.ProcessorODataConstants.MD_SEMANTICS_CURRENCY))
		{
			return "CUR";
		}
		if (oFF.XString.isEqual(semantics, oFF.ProcessorODataConstants.MD_SEMANTICS_UNIT_OF_MEASURE))
		{
			return "UNI";
		}
	}
	return "UDF";
};
oFF.ODataProperty.prototype.isComplexDataType = function()
{
	return this.getDataTypeWithDefault(null) === null;
};
oFF.ODataProperty.prototype.isFilterable = function()
{
	return oFF.PrUtils.getBooleanValueProperty(this.m_property, oFF.ProcessorODataConstants.MD_PROPERTY_SAP_FILTERABLE, true);
};
oFF.ODataProperty.prototype.isMeasure = function()
{
	return this.m_isMeasure;
};
oFF.ODataProperty.prototype.isSortable = function()
{
	return oFF.PrUtils.getBooleanValueProperty(this.m_property, oFF.ProcessorODataConstants.MD_PROPERTY_SAP_SORTABLE, true);
};
oFF.ODataProperty.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_property = null;
	this.m_namePrefix = null;
	this.m_unitType = null;
	this.m_unitPropertyName = null;
	this.m_unitTextPropertyName = null;
	this.m_precision = oFF.XObjectExt.release(this.m_precision);
	this.m_scale = oFF.XObjectExt.release(this.m_scale);
};
oFF.ODataProperty.prototype.setupProperty = function(property, allProperties, namePrefix)
{
	this.m_property = property;
	this.m_namePrefix = oFF.XStringUtils.isNotNullAndNotEmpty(namePrefix) ? namePrefix : "";
	let unit = property.getStringByKey(oFF.ProcessorODataConstants.MD_PROPERTY_SAP_UNIT);
	let aggregationRole = property.getStringByKey(oFF.ProcessorODataConstants.MD_PROPERTY_SAP_AGGREGATION_ROLE);
	if (oFF.XString.isEqual(aggregationRole, oFF.ProcessorODataConstants.MD_PROPERTY_SAP_AGGREGATION_ROLE_MEASURE))
	{
		this.m_isMeasure = true;
	}
	else
	{
		let unitType = this.getUnitTypeFromProperty(oFF.PrUtils.getStructureWithKeyValuePair(allProperties, oFF.ProcessorODataConstants.MD_PROPERTY_NAME, unit));
		this.m_isMeasure = !oFF.XString.isEqual(unitType, "UDF");
	}
	if (this.m_isMeasure)
	{
		let unitProperty = oFF.PrUtils.getStructureWithKeyValuePair(allProperties, oFF.ProcessorODataConstants.MD_PROPERTY_NAME, unit);
		this.m_unitType = this.getUnitTypeFromProperty(unitProperty);
		if (oFF.notNull(unitProperty) && !oFF.XString.isEqual(this.m_unitType, "UDF"))
		{
			this.m_unitPropertyName = this.getNameWithPrefix(unitProperty);
			let textPropertyName = unitProperty.getStringByKey(oFF.ProcessorODataConstants.MD_PROPERTY_SAP_TEXT);
			if (oFF.PrUtils.getStructureWithKeyValuePair(allProperties, oFF.ProcessorODataConstants.MD_PROPERTY_NAME, textPropertyName) !== null)
			{
				this.m_unitTextPropertyName = oFF.XStringUtils.concatenate2(this.m_namePrefix, textPropertyName);
			}
		}
		if (property.containsKey(oFF.ProcessorODataConstants.MD_PROPERTY_PRECISION))
		{
			let precision = property.getStringByKey(oFF.ProcessorODataConstants.MD_PROPERTY_PRECISION);
			this.m_precision = oFF.XIntegerValue.create(oFF.XInteger.convertFromString(precision));
		}
		if (property.containsKey(oFF.ProcessorODataConstants.MD_PROPERTY_SCALE))
		{
			let scale = property.getStringByKey(oFF.ProcessorODataConstants.MD_PROPERTY_SCALE);
			this.m_scale = oFF.XIntegerValue.create(oFF.XInteger.convertFromString(scale));
		}
	}
};

oFF.ODataResultEntry = function() {};
oFF.ODataResultEntry.prototype = new oFF.XObject();
oFF.ODataResultEntry.prototype._ff_c = "ODataResultEntry";

oFF.ODataResultEntry.create = function(structure)
{
	let oDataResultEntry = new oFF.ODataResultEntry();
	oDataResultEntry.setupResultEntry(structure);
	return oDataResultEntry;
};
oFF.ODataResultEntry.prototype.m_properties = null;
oFF.ODataResultEntry.prototype.getElement = function(dimensionName, attributeName)
{
	let element = oFF.PrUtils.getProperty(this.m_properties, attributeName);
	if (oFF.isNull(element))
	{
		element = oFF.PrUtils.getProperty(this.m_properties, oFF.XStringUtils.concatenate2(oFF.ProcessorODataConstants.RS_PROPERTY_PREFIX, attributeName));
	}
	return oFF.isNull(element) || element.isStructure() ? null : element;
};
oFF.ODataResultEntry.prototype.isEqualTo = function(other)
{
	if (oFF.isNull(other))
	{
		return false;
	}
	if (other === this)
	{
		return true;
	}
	return oFF.XObjectExt.areEqual(this.m_properties, other.m_properties);
};
oFF.ODataResultEntry.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_properties = null;
};
oFF.ODataResultEntry.prototype.setupResultEntry = function(entryStructure)
{
	let content = oFF.PrUtils.getStructureProperty(entryStructure, oFF.ProcessorODataConstants.RS_CONTENT);
	this.m_properties = oFF.PrUtils.getStructureProperty(content, oFF.ProcessorODataConstants.RS_PROPERTIES);
	if (oFF.isNull(this.m_properties))
	{
		this.m_properties = entryStructure;
	}
	if (oFF.notNull(this.m_properties))
	{
		this.m_properties.remove(oFF.ProcessorODataConstants.RS_METADATA);
	}
};
oFF.ODataResultEntry.prototype.toString = function()
{
	return this.m_properties.toString();
};

oFF.ODataServiceResultEntry = function() {};
oFF.ODataServiceResultEntry.prototype = new oFF.XObject();
oFF.ODataServiceResultEntry.prototype._ff_c = "ODataServiceResultEntry";

oFF.ODataServiceResultEntry.create = function(element)
{
	let oDataResultEntry = new oFF.ODataServiceResultEntry();
	oDataResultEntry.m_entitySet = element;
	return oDataResultEntry;
};
oFF.ODataServiceResultEntry.prototype.m_entitySet = null;
oFF.ODataServiceResultEntry.prototype.getElement = function(dimensionName, attributeName)
{
	if (this.m_entitySet.isString())
	{
		return this.m_entitySet;
	}
	let entitySetStructure = this.m_entitySet.asStructure();
	if (oFF.XString.endsWith(attributeName, oFF.ProcessorConstants.SERVICE_MD_TEXT_ATTRIBUTE_SUFFIX))
	{
		if (entitySetStructure.containsKey(oFF.ProcessorODataConstants.MD_PROPERTY_SAP_MEMBER_TITLE))
		{
			return this.getProperty(entitySetStructure, oFF.ProcessorODataConstants.MD_PROPERTY_SAP_MEMBER_TITLE);
		}
		if (entitySetStructure.containsKey(oFF.ProcessorODataConstants.RS_TITLE))
		{
			return this.getProperty(entitySetStructure, oFF.ProcessorODataConstants.RS_TITLE);
		}
		if (entitySetStructure.containsKey(oFF.ProcessorODataConstants.MD_PROPERTY_SAP_LABEL))
		{
			return this.getProperty(entitySetStructure, oFF.ProcessorODataConstants.MD_PROPERTY_SAP_LABEL);
		}
	}
	if (entitySetStructure.containsKey(oFF.ProcessorODataConstants.MD_PROPERTY_HREF))
	{
		return oFF.PrUtils.getProperty(entitySetStructure, oFF.ProcessorODataConstants.MD_PROPERTY_HREF);
	}
	if (entitySetStructure.containsKey(oFF.ProcessorODataConstants.RS_NAME))
	{
		return oFF.PrUtils.getProperty(entitySetStructure, oFF.ProcessorODataConstants.RS_NAME);
	}
	if (entitySetStructure.containsKey(oFF.ProcessorODataConstants.RS_TITLE))
	{
		return this.getProperty(entitySetStructure, oFF.ProcessorODataConstants.RS_TITLE);
	}
	return null;
};
oFF.ODataServiceResultEntry.prototype.getProperty = function(entitySetStructure, property)
{
	let value = oFF.PrUtils.getProperty(entitySetStructure, property);
	if (oFF.notNull(value) && value.isStructure() && value.asStructure().containsKey(property))
	{
		return oFF.PrUtils.getProperty(value.asStructure(), property);
	}
	return value;
};
oFF.ODataServiceResultEntry.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_entitySet = null;
};
oFF.ODataServiceResultEntry.prototype.toString = function()
{
	return this.m_entitySet.toString();
};

oFF.ProcessorSCPConstants = {

	FIELDS:"fields",
	FIELD_DISPLAY_NAME:"vendorDisplayName",
	FIELD_NATIVE_TYPE:"vendorNativeType",
	FIELD_PATH:"path",
	FIELD_TYPE:"type",
	FIELD_TYPE_BOOLEAN:"boolean",
	FIELD_TYPE_DATE:"date",
	FIELD_TYPE_DATE_TIME:"datetime",
	FIELD_TYPE_NUMBER:"number",
	FIELD_TYPE_STRING:"string",
	FIELD_VENDOR_PATH:"vendorPath",
	GET:"get",
	OPERATION_ID:"operationId",
	PARAMETERS:"parameters",
	PARAMETER_DESCRIPTION:"description",
	PARAMETER_IN:"in",
	PARAMETER_IN_PATH:"path",
	PARAMETER_IN_QUERY:"query",
	PARAMETER_NAME:"name",
	PARAMETER_REQUIRED:"required",
	PARAMETER_TYPE:"type",
	PARAMETER_TYPE_BOOLEAN:"boolean",
	PARAMETER_TYPE_INTEGER:"integer",
	PATHS:"paths",
	SUMMARY:"summary",
	URI_DOCS:"/docs",
	URI_DOCS_PARAM_BASIC:"basic",
	URI_DOCS_PARAM_DISCOVERY:"discovery",
	URI_DOCS_PARAM_REFERENCES:"resolveReferences",
	URI_METADATA:"/metadata",
	URI_OBJECTS:"/objects"
};

oFF.SCPMdProperty = function() {};
oFF.SCPMdProperty.prototype = new oFF.XObject();
oFF.SCPMdProperty.prototype._ff_c = "SCPMdProperty";

oFF.SCPMdProperty.create = function(name, description, dataType)
{
	return oFF.SCPMdProperty.createWithFilterFlag(name, description, dataType, false);
};
oFF.SCPMdProperty.createWithFilterFlag = function(name, description, dataType, filterable)
{
	let scpMdProperty = new oFF.SCPMdProperty();
	scpMdProperty.m_name = name;
	scpMdProperty.m_description = description;
	scpMdProperty.m_dataType = dataType;
	scpMdProperty.m_filterable = filterable;
	return scpMdProperty;
};
oFF.SCPMdProperty.prototype.m_dataType = null;
oFF.SCPMdProperty.prototype.m_description = null;
oFF.SCPMdProperty.prototype.m_filterable = false;
oFF.SCPMdProperty.prototype.m_name = null;
oFF.SCPMdProperty.prototype.getDataType = function()
{
	return this.m_dataType;
};
oFF.SCPMdProperty.prototype.getDescription = function()
{
	return this.m_description;
};
oFF.SCPMdProperty.prototype.getDisplayFormat = function()
{
	return null;
};
oFF.SCPMdProperty.prototype.getMaxLength = function()
{
	return -1;
};
oFF.SCPMdProperty.prototype.getName = function()
{
	return this.m_name;
};
oFF.SCPMdProperty.prototype.getNumericPrecision = function()
{
	return null;
};
oFF.SCPMdProperty.prototype.getNumericScale = function()
{
	return null;
};
oFF.SCPMdProperty.prototype.getUnitPropertyName = function()
{
	return null;
};
oFF.SCPMdProperty.prototype.getUnitTextPropertyName = function()
{
	return null;
};
oFF.SCPMdProperty.prototype.getUnitType = function()
{
	return "UDF";
};
oFF.SCPMdProperty.prototype.isFilterable = function()
{
	return this.m_filterable;
};
oFF.SCPMdProperty.prototype.isSortable = function()
{
	return false;
};
oFF.SCPMdProperty.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_name = null;
	this.m_description = null;
	this.m_dataType = null;
};

oFF.InAServerInfoBuilder = {

	addCapabilityToList:function(capabilityName, capabilityList)
	{
			if (oFF.XStringUtils.isNullOrEmpty(capabilityName))
		{
			return;
		}
		let capability = capabilityList.addNewStructure();
		capability.putString("Capability", capabilityName);
		capability.putInteger("MinVersion", 100);
		capability.putInteger("MaxVersion", 104);
	},
	addServiceToResponse:function(services, serviceName, supportedCapabilities)
	{
			let service = services.addNewStructure();
		service.putString("Service", serviceName);
		let capabilities = service.putNewList("Capabilities");
		if (oFF.notNull(supportedCapabilities))
		{
			let sizeCapabilities = supportedCapabilities.size();
			for (let i = 0; i < sizeCapabilities; i++)
			{
				oFF.InAServerInfoBuilder.addCapabilityToList(supportedCapabilities.get(i), capabilities);
			}
		}
		service.putNewList("CapabilitiesDev");
	},
	buildServerInfoResponse:function(supportedCapabilities, languageCode, systemId)
	{
			let root = oFF.PrFactory.createStructure();
		let serverInfo = root.putNewStructure("ServerInfo");
		serverInfo.putString("Client", "000000000000000000");
		serverInfo.putStringNotNull("UserLanguageCode", languageCode);
		serverInfo.putString("ServerType", "Virtual InA");
		serverInfo.putStringNotNull("SystemId", systemId);
		let inaServices = root.putNewList("Services");
		if (oFF.XCollectionUtils.hasElements(supportedCapabilities))
		{
			let services = supportedCapabilities.getKeysAsIterator();
			while (services.hasNext())
			{
				let service = services.next();
				oFF.InAServerInfoBuilder.addServiceToResponse(inaServices, service, supportedCapabilities.getByKey(service));
			}
		}
		return root;
	}
};

oFF.InAParser = function() {};
oFF.InAParser.prototype = new oFF.XObject();
oFF.InAParser.prototype._ff_c = "InAParser";

oFF.InAParser.getName = function(structure)
{
	return oFF.PrUtils.getStringValueProperty(structure, "Name", null);
};
oFF.InAParser.hasObtainabilityAlways = function(attribute)
{
	return oFF.XString.isEqual(attribute.getStringByKey("Obtainability"), "Always");
};
oFF.InAParser.isKeyAttribute = function(attribute)
{
	return oFF.PrUtils.getBooleanValueProperty(attribute, "IsKey", false);
};
oFF.InAParser.isStructure = function(dimension)
{
	return oFF.XString.isEqual(oFF.InAParser.getName(dimension), oFF.ProcessorConstants.CUSTOM_DIM);
};
oFF.InAParser.prototype.containsMeasureDimension = function(dimensions)
{
	return this.getMeasureDimension(dimensions) !== null;
};
oFF.InAParser.prototype.getMeasureDimension = function(dimensions)
{
	if (oFF.notNull(dimensions))
	{
		let size = dimensions.size();
		for (let i = 0; i < size; i++)
		{
			let dimension = dimensions.getStructureAt(i);
			if (oFF.InAParser.isStructure(dimension))
			{
				return dimension;
			}
		}
	}
	return null;
};

oFF.CatalogResultFilter = function() {};
oFF.CatalogResultFilter.prototype = new oFF.XObject();
oFF.CatalogResultFilter.prototype._ff_c = "CatalogResultFilter";

oFF.CatalogResultFilter.create = function(result, inaFilterSelection)
{
	let catalogResultFilter = new oFF.CatalogResultFilter();
	catalogResultFilter.setupResultFilter(result, inaFilterSelection);
	return catalogResultFilter;
};
oFF.CatalogResultFilter.prototype.m_result = null;
oFF.CatalogResultFilter.prototype.getFilterValues = function(inaFilterSelection)
{
	let subSelections;
	if (inaFilterSelection.containsKey("SetOperand"))
	{
		subSelections = oFF.PrFactory.createList();
		subSelections.add(inaFilterSelection);
	}
	else
	{
		let rootOperator = oFF.PrUtils.getStructureProperty(inaFilterSelection, "Operator");
		let andSubSelection = oFF.PrUtils.getStructureElement(oFF.PrUtils.getListProperty(rootOperator, "SubSelections"), 0);
		let operator = oFF.PrUtils.getStructureProperty(andSubSelection, "Operator");
		subSelections = oFF.PrUtils.getListProperty(operator, "SubSelections");
	}
	let size = oFF.PrUtils.getListSize(subSelections, 0);
	let filterValues = oFF.XList.create();
	for (let i = 0; i < size; i++)
	{
		let subSelection = oFF.PrUtils.getStructureElement(subSelections, i);
		let setOperand = oFF.PrUtils.getStructureProperty(subSelection, "SetOperand");
		let element = oFF.PrUtils.getStructureElement(oFF.PrUtils.getListProperty(setOperand, "Elements"), 0);
		let fieldName = oFF.PrUtils.getStringValueProperty(setOperand, "FieldName", null);
		let filterValue = oFF.PrUtils.getStringValueProperty(element, "Low", null);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(fieldName) && oFF.XStringUtils.isNotNullAndNotEmpty(filterValue))
		{
			filterValues.add(oFF.XNameValuePair.create(fieldName, filterValue));
		}
	}
	return filterValues;
};
oFF.CatalogResultFilter.prototype.getResultEntries = function()
{
	return this.m_result;
};
oFF.CatalogResultFilter.prototype.getResultEntryAt = function(index)
{
	return this.m_result.get(index);
};
oFF.CatalogResultFilter.prototype.matchesFilter = function(entry, filterValues)
{
	let size = filterValues.size();
	for (let i = 0; i < size; i++)
	{
		let filter = filterValues.get(i);
		let element = entry.getElement(filter.getName(), filter.getName());
		if (oFF.notNull(element) && element.isString())
		{
			if (oFF.XPattern.matches(element.asString().getString(), filter.getValue()))
			{
				return true;
			}
		}
	}
	return false;
};
oFF.CatalogResultFilter.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_result = null;
};
oFF.CatalogResultFilter.prototype.setupResultFilter = function(result, inaFilterSelection)
{
	this.m_result = oFF.XList.create();
	let filterValues = this.getFilterValues(inaFilterSelection);
	let filterValid = oFF.XCollectionUtils.hasElements(filterValues);
	let size = result.size();
	for (let i = 0; i < size; i++)
	{
		let resultEntry = result.getResultEntryAt(i);
		if (!filterValid || this.matchesFilter(resultEntry, filterValues))
		{
			this.m_result.add(resultEntry);
		}
	}
};
oFF.CatalogResultFilter.prototype.size = function()
{
	return this.m_result.size();
};

oFF.FlatProcessorResult = function() {};
oFF.FlatProcessorResult.prototype = new oFF.XObject();
oFF.FlatProcessorResult.prototype._ff_c = "FlatProcessorResult";

oFF.FlatProcessorResult.prototype.flattenResult = function(structure, nestedPropertyNames)
{
	let items = oFF.PrFactory.createList();
	items.add(oFF.PrUtils.deepCopyElement(structure));
	let alreadyMerged = oFF.XHashSetOfString.create();
	let iterator = nestedPropertyNames.getIterator();
	while (iterator.hasNext())
	{
		let nestedProperty = iterator.next();
		let firstPropertyLevel = this.getNextPropertyLevel(nestedProperty, null);
		items = this.mergeItemsWithNestedProperties(items, firstPropertyLevel, nestedProperty, alreadyMerged);
	}
	let entries = oFF.XList.create();
	let resultSize = items.size();
	for (let k = 0; k < resultSize; k++)
	{
		entries.add(this.createResultEntry(items.getStructureAt(k)));
	}
	return entries;
};
oFF.FlatProcessorResult.prototype.getNextPropertyLevel = function(fullPropertyPath, currentPropertyPath)
{
	return oFF.XString.isEqual(fullPropertyPath, currentPropertyPath) ? null : fullPropertyPath;
};
oFF.FlatProcessorResult.prototype.mergeItemsWithNestedProperties = function(items, propertyLevel, fullPropertyPath, alreadyMerged)
{
	let result = items;
	if (!alreadyMerged.contains(propertyLevel))
	{
		alreadyMerged.add(propertyLevel);
		result = oFF.PrFactory.createList();
		let resultSize = items.size();
		for (let i = 0; i < resultSize; i++)
		{
			let resultEntry = items.getStructureAt(i);
			let nestedItems = this.getAndRemoveNestedItems(resultEntry, propertyLevel);
			if (!oFF.XCollectionUtils.hasElements(nestedItems))
			{
				result.add(resultEntry);
				continue;
			}
			let navPropertyItemsSize = nestedItems.size();
			for (let k = 0; k < navPropertyItemsSize; k++)
			{
				let structure = result.addNewStructure();
				structure.copyFrom(resultEntry, null);
				this.copyFromStructure(nestedItems.get(k), structure, propertyLevel);
			}
		}
	}
	let nextPropertyLevel = this.getNextPropertyLevel(fullPropertyPath, propertyLevel);
	if (oFF.notNull(nextPropertyLevel))
	{
		result = this.mergeItemsWithNestedProperties(result, nextPropertyLevel, fullPropertyPath, alreadyMerged);
	}
	return result;
};

oFF.GenericResultEntry = function() {};
oFF.GenericResultEntry.prototype = new oFF.XObject();
oFF.GenericResultEntry.prototype._ff_c = "GenericResultEntry";

oFF.GenericResultEntry.create = function(element)
{
	let resultEntry = new oFF.GenericResultEntry();
	resultEntry.setupGenericResultEntry(element);
	return resultEntry;
};
oFF.GenericResultEntry.prototype.m_element = null;
oFF.GenericResultEntry.prototype.addToResult = function(currentResult, nextElement)
{
	if (oFF.isNull(currentResult))
	{
		return nextElement;
	}
	else if (currentResult.isList())
	{
		currentResult.asList().add(nextElement);
		return currentResult;
	}
	let resultList = oFF.PrUtils.convertToList(currentResult);
	resultList.add(nextElement);
	return resultList;
};
oFF.GenericResultEntry.prototype.getElement = function(dimensionName, attributeName)
{
	if (!this.m_element.isStructure())
	{
		return this.m_element;
	}
	let propertyPath = this.getPropertyPath(dimensionName, attributeName);
	if (oFF.XString.containsString(propertyPath, "."))
	{
		let nestedProperties = oFF.XStringTokenizer.splitString(propertyPath, ".");
		return this.getNestedItemValue(this.m_element.asStructure(), nestedProperties, 0, null);
	}
	return oFF.PrUtils.getProperty(this.m_element.asStructure(), propertyPath);
};
oFF.GenericResultEntry.prototype.getNestedItemValue = function(structure, nestedPropertyNames, propertyNamesIndex, result)
{
	let currentStructure = structure;
	let currentResult = result;
	let size = nestedPropertyNames.size();
	for (let i = propertyNamesIndex; i < size; i++)
	{
		let nextElement = oFF.PrUtils.getProperty(currentStructure, nestedPropertyNames.get(i));
		if (oFF.isNull(nextElement))
		{
			return currentResult;
		}
		if (nextElement.isStructure())
		{
			currentStructure = nextElement.asStructure();
		}
		else if (nextElement.isList())
		{
			return this.getValuesFromList(nextElement.asList(), nestedPropertyNames, i + 1, currentResult);
		}
		else
		{
			currentResult = this.addToResult(currentResult, nextElement);
		}
	}
	return currentResult;
};
oFF.GenericResultEntry.prototype.getPropertyPath = function(dimensionName, attributeName)
{
	return attributeName;
};
oFF.GenericResultEntry.prototype.getValuesFromList = function(list, nestedPropertyNames, propertyNamesIndex, result)
{
	let currentResult = result;
	let listSize = list.size();
	for (let i = 0; i < listSize; i++)
	{
		let element = list.get(i);
		if (element.isStructure())
		{
			currentResult = this.getNestedItemValue(list.getStructureAt(i), nestedPropertyNames, propertyNamesIndex, currentResult);
		}
		else
		{
			currentResult = this.addToResult(currentResult, element);
		}
	}
	return currentResult;
};
oFF.GenericResultEntry.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_element = null;
};
oFF.GenericResultEntry.prototype.setupGenericResultEntry = function(element)
{
	this.m_element = element;
};
oFF.GenericResultEntry.prototype.toString = function()
{
	return this.m_element.toString();
};

oFF.OrderedProcessorResult = function() {};
oFF.OrderedProcessorResult.prototype = new oFF.XObject();
oFF.OrderedProcessorResult.prototype._ff_c = "OrderedProcessorResult";

oFF.OrderedProcessorResult.create = function(result, dimensions)
{
	let orderedResult = new oFF.OrderedProcessorResult();
	orderedResult.setupOrderedResult(result, dimensions);
	return orderedResult;
};
oFF.OrderedProcessorResult.prototype.m_dimensions = null;
oFF.OrderedProcessorResult.prototype.m_orderedResult = null;
oFF.OrderedProcessorResult.prototype.m_result = null;
oFF.OrderedProcessorResult.prototype.getAllWithSameKeyValuePair = function(results, dimName, keyAttributeName, value)
{
	let list = oFF.XList.create();
	let size = results.size();
	for (let i = 0; i < size; i++)
	{
		let entry = results.get(i);
		let element = entry.getElement(dimName, keyAttributeName);
		if (oFF.XObjectExt.areEqual(element, value))
		{
			list.add(entry);
		}
	}
	return list;
};
oFF.OrderedProcessorResult.prototype.getKeyAttributeName = function(dimension)
{
	let attributes = dimension.getListByKey("Attributes");
	let attribute = oFF.PrUtils.getStructureWithKeyValuePair(attributes, "IsKey", "true");
	if (oFF.isNull(attribute))
	{
		attribute = attributes.getStructureAt(0);
	}
	return attribute.getStringByKey("Name");
};
oFF.OrderedProcessorResult.prototype.getResultEntries = function()
{
	return this.m_orderedResult;
};
oFF.OrderedProcessorResult.prototype.getResultEntryAt = function(index)
{
	return this.m_orderedResult.get(index);
};
oFF.OrderedProcessorResult.prototype.orderByDimensionMembers = function(list, orderedList, dimIndex)
{
	let dimension = this.m_dimensions.getStructureAt(dimIndex);
	let dimName = dimension.getStringByKey("Name");
	let dimKeyAttributeName = this.getKeyAttributeName(dimension);
	let addedValues = oFF.PrFactory.createList();
	let size = list.size();
	for (let i = 0; i < size; i++)
	{
		let memberElement = list.get(i).getElement(dimName, dimKeyAttributeName);
		if (oFF.PrUtils.contains(addedValues, memberElement))
		{
			continue;
		}
		addedValues.add(memberElement);
		let entriesWithSameMember = this.getAllWithSameKeyValuePair(list, dimName, dimKeyAttributeName, memberElement);
		let nextDimIndex = dimIndex + 1;
		if (this.m_dimensions.size() > nextDimIndex)
		{
			this.orderByDimensionMembers(entriesWithSameMember, orderedList, nextDimIndex);
		}
		else
		{
			orderedList.addAll(entriesWithSameMember);
		}
	}
};
oFF.OrderedProcessorResult.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_result = oFF.XObjectExt.release(this.m_result);
	this.m_dimensions = null;
	this.m_orderedResult = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_orderedResult);
};
oFF.OrderedProcessorResult.prototype.setupOrderedResult = function(result, dimensions)
{
	this.m_result = result;
	this.m_dimensions = dimensions;
	this.m_orderedResult = oFF.XList.create();
	if (this.m_dimensions.hasElements())
	{
		this.orderByDimensionMembers(result.getResultEntries(), this.m_orderedResult, 0);
	}
	else
	{
		this.m_orderedResult.addAll(result.getResultEntries());
	}
};
oFF.OrderedProcessorResult.prototype.size = function()
{
	return this.m_orderedResult.size();
};
oFF.OrderedProcessorResult.prototype.toString = function()
{
	return this.m_orderedResult.toString();
};

oFF.ProcessorDateConverter = {

	convert:function(element, displayFormat)
	{
			if (oFF.notNull(element) && element.isString() && oFF.notNull(displayFormat))
		{
			if (oFF.XString.isEqual(displayFormat, "Date"))
			{
				return oFF.ProcessorDateConverter.convertToIsoDate(element.asString());
			}
			if (oFF.XString.isEqual(displayFormat, "Time"))
			{
				return oFF.ProcessorDateConverter.convertToIsoTime(element.asString());
			}
			if (oFF.XString.isEqual(displayFormat, "DateTime"))
			{
				return oFF.ProcessorDateConverter.convertToIsoDateTime(element.asString());
			}
		}
		return null;
	},
	convertToEdmDateTime:function(dateTimeValue)
	{
			return oFF.XStringUtils.concatenate3("datetime'", dateTimeValue, "'");
	},
	convertToIsoDate:function(dateResponse)
	{
			let value = dateResponse.getString();
		let dateTime = oFF.ProcessorDateConverter.getDateTimeFromEdmDateTime(value);
		if (oFF.notNull(dateTime))
		{
			value = dateTime;
		}
		let dateFromDateTime = oFF.ProcessorDateConverter.getDateFromDateTime(value);
		if (oFF.notNull(dateFromDateTime))
		{
			value = dateFromDateTime;
		}
		else
		{
			let dateTimeFromTimestamp = oFF.ProcessorDateConverter.getDateTimeFromTimestamp(value);
			if (oFF.notNull(dateTimeFromTimestamp))
			{
				value = dateTimeFromTimestamp.getDate().toIsoFormat();
			}
		}
		return oFF.PrFactory.createString(value);
	},
	convertToIsoDateTime:function(dateTimeResponse)
	{
			let value = dateTimeResponse.getString();
		let edmDateTime = oFF.ProcessorDateConverter.getDateTimeFromEdmDateTime(value);
		if (oFF.notNull(edmDateTime))
		{
			value = edmDateTime;
		}
		else
		{
			let dateTimeFromTimestamp = oFF.ProcessorDateConverter.getDateTimeFromTimestamp(value);
			if (oFF.notNull(dateTimeFromTimestamp))
			{
				value = dateTimeFromTimestamp.toIsoFormat();
			}
		}
		return oFF.PrFactory.createString(value);
	},
	convertToIsoTime:function(timeResponse)
	{
			let duration = timeResponse.getString();
		if (oFF.XString.startsWith(duration, "PT"))
		{
			let hourIndex = oFF.XString.indexOf(duration, "H");
			let minutesIndex = oFF.XString.indexOf(duration, "M");
			let secondsIndex = oFF.XString.indexOf(duration, "S");
			let isoTime = oFF.XStringBuffer.create();
			isoTime.append(oFF.ProcessorDateConverter.getNumberAsString(duration, hourIndex - 2));
			isoTime.append(oFF.ProcessorDateConverter.getNumberAsString(duration, hourIndex - 1));
			isoTime.append(":");
			isoTime.append(oFF.ProcessorDateConverter.getNumberAsString(duration, minutesIndex - 2));
			isoTime.append(oFF.ProcessorDateConverter.getNumberAsString(duration, minutesIndex - 1));
			isoTime.append(":");
			isoTime.append(oFF.ProcessorDateConverter.getNumberAsString(duration, secondsIndex - 2));
			isoTime.append(oFF.ProcessorDateConverter.getNumberAsString(duration, secondsIndex - 1));
			duration = isoTime.toString();
		}
		return oFF.PrFactory.createString(duration);
	},
	getDateFromDateTime:function(datetime)
	{
			if (oFF.XString.containsString(datetime, "T"))
		{
			return oFF.XString.substring(datetime, 0, oFF.XString.indexOf(datetime, "T"));
		}
		return null;
	},
	getDateTimeFromEdmDateTime:function(edmDateTime)
	{
			if (oFF.XString.containsString(edmDateTime, "datetime"))
		{
			let dateTimeStart = oFF.XString.indexOf(edmDateTime, "'") + 1;
			let dateTimeEnd = oFF.XString.lastIndexOf(edmDateTime, "'");
			if (dateTimeStart < dateTimeEnd)
			{
				return oFF.XString.substring(edmDateTime, dateTimeStart, dateTimeEnd);
			}
		}
		return null;
	},
	getDateTimeFromTimestamp:function(timestampResponse)
	{
			let timestampValue = timestampResponse;
		if (oFF.XString.containsString(timestampResponse, "Date"))
		{
			let dateStart = oFF.XString.indexOf(timestampResponse, "(") + 1;
			let dateEnd = oFF.XString.lastIndexOf(timestampResponse, ")");
			if (dateStart < dateEnd)
			{
				timestampValue = oFF.XString.substring(timestampResponse, dateStart, dateEnd);
			}
		}
		let milliseconds = oFF.XLong.convertFromStringWithDefault(timestampValue, -1);
		if (milliseconds !== -1 || oFF.XString.isEqual(timestampValue, "-1"))
		{
			return oFF.XDateTime.createWithMilliseconds(milliseconds);
		}
		return null;
	},
	getNumberAsString:function(duration, startIndex)
	{
			if (startIndex >= 0)
		{
			let value = oFF.XString.substring(duration, startIndex, startIndex + 1);
			let intValue = oFF.XInteger.convertFromStringWithDefault(value, -1);
			if (intValue > 0)
			{
				return value;
			}
		}
		return "0";
	}
};

oFF.InAProcessorFunctionFactory = function() {};
oFF.InAProcessorFunctionFactory.prototype = new oFF.RpcFunctionFactory();
oFF.InAProcessorFunctionFactory.prototype._ff_c = "InAProcessorFunctionFactory";

oFF.InAProcessorFunctionFactory.registerGenericServiceAdapterAsInA = function()
{
	let processor = new oFF.InAProcessorFunctionFactory();
	processor.m_activeProcessor = oFF.ProcessorGSA.create();
	oFF.RpcFunctionFactory.registerFactory(null, oFF.SystemType.VIRTUAL_INA_GSA, processor);
};
oFF.InAProcessorFunctionFactory.registerODataAsInA = function()
{
	let processor = new oFF.InAProcessorFunctionFactory();
	processor.m_activeProcessor = oFF.ProcessorODataV2.create();
	oFF.RpcFunctionFactory.registerFactory(null, oFF.SystemType.VIRTUAL_INA_ODATA, processor);
};
oFF.InAProcessorFunctionFactory.registerSCPAsInA = function()
{
	let processor = new oFF.InAProcessorFunctionFactory();
	processor.m_activeProcessor = oFF.ProcessorSCP.create();
	oFF.RpcFunctionFactory.registerFactory(null, oFF.SystemType.VIRTUAL_INA_SCP, processor);
};
oFF.InAProcessorFunctionFactory.prototype.m_activeProcessor = null;
oFF.InAProcessorFunctionFactory.prototype.newRpcFunction = function(context, name, systemType, protocolType)
{
	let relativeUri = oFF.XUri.createFromUrl(name);
	let application = context.getProcess().getApplication();
	this.m_activeProcessor.setApplication(application);
	return oFF.RpcVirtualFunction.create(context, relativeUri, this.m_activeProcessor, protocolType);
};
oFF.InAProcessorFunctionFactory.prototype.releaseObject = function()
{
	this.m_activeProcessor = oFF.XObjectExt.release(this.m_activeProcessor);
	oFF.RpcFunctionFactory.prototype.releaseObject.call( this );
};

oFF.InAProcessorRequest = function() {};
oFF.InAProcessorRequest.prototype = new oFF.XObject();
oFF.InAProcessorRequest.prototype._ff_c = "InAProcessorRequest";

oFF.InAProcessorRequest.create = function(uri, acceptContentType, customIdentifier)
{
	let response = new oFF.InAProcessorRequest();
	response.m_uri = uri;
	response.m_acceptContentType = acceptContentType;
	response.m_customIdentifier = customIdentifier;
	return response;
};
oFF.InAProcessorRequest.prototype.m_acceptContentType = null;
oFF.InAProcessorRequest.prototype.m_customIdentifier = null;
oFF.InAProcessorRequest.prototype.m_hasResponse = false;
oFF.InAProcessorRequest.prototype.m_response = null;
oFF.InAProcessorRequest.prototype.m_responseAsString = null;
oFF.InAProcessorRequest.prototype.m_uri = null;
oFF.InAProcessorRequest.prototype.getAcceptContentType = function()
{
	return this.m_acceptContentType;
};
oFF.InAProcessorRequest.prototype.getCustomIdentifier = function()
{
	return this.m_customIdentifier;
};
oFF.InAProcessorRequest.prototype.getResponse = function()
{
	return this.m_response;
};
oFF.InAProcessorRequest.prototype.getResponseAsString = function()
{
	return this.m_responseAsString;
};
oFF.InAProcessorRequest.prototype.getUri = function()
{
	return this.m_uri;
};
oFF.InAProcessorRequest.prototype.hasResponse = function()
{
	return this.m_hasResponse;
};
oFF.InAProcessorRequest.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_uri = oFF.XObjectExt.release(this.m_uri);
	this.m_acceptContentType = null;
	this.m_customIdentifier = null;
	this.m_response = null;
	this.m_responseAsString = null;
};
oFF.InAProcessorRequest.prototype.setResponse = function(response, responseAsString)
{
	this.m_response = response;
	this.m_responseAsString = responseAsString;
	this.m_hasResponse = true;
};

oFF.GSAResultEntry = function() {};
oFF.GSAResultEntry.prototype = new oFF.GenericResultEntry();
oFF.GSAResultEntry.prototype._ff_c = "GSAResultEntry";

oFF.GSAResultEntry.createGenericServiceResultEntry = function(element, responseProperties)
{
	let resultEntry = new oFF.GSAResultEntry();
	resultEntry.setupGenericResultEntry(element);
	resultEntry.m_responseProperties = responseProperties;
	return resultEntry;
};
oFF.GSAResultEntry.prototype.m_responseProperties = null;
oFF.GSAResultEntry.prototype.getPropertyPath = function(dimensionName, attributeName)
{
	return this.m_responseProperties.getByKey(dimensionName).getByKey(attributeName);
};
oFF.GSAResultEntry.prototype.releaseObject = function()
{
	oFF.GenericResultEntry.prototype.releaseObject.call( this );
	this.m_responseProperties = null;
};

oFF.ODataResult = function() {};
oFF.ODataResult.prototype = new oFF.FlatProcessorResult();
oFF.ODataResult.prototype._ff_c = "ODataResult";

oFF.ODataResult.create = function(response, isCatalogServiceResult, requestParser)
{
	let oDataResult = new oFF.ODataResult();
	oDataResult.setupResult(response, isCatalogServiceResult, requestParser);
	return oDataResult;
};
oFF.ODataResult.prototype.isServiceResult = false;
oFF.ODataResult.prototype.m_requestParser = null;
oFF.ODataResult.prototype.m_resultEntries = null;
oFF.ODataResult.prototype.copyFromStructure = function(source, target, nestedPropertyName)
{
	let targetStructure = this.getPropertiesStructure(target);
	let sourceStructure = source.asStructure();
	let keys = sourceStructure.getKeysAsReadOnlyList();
	let size = keys.size();
	for (let i = 0; i < size; i++)
	{
		let key = keys.get(i);
		if (!oFF.XString.isEqual(key, oFF.ProcessorODataConstants.RS_METADATA))
		{
			let cleanedKey = oFF.XString.replace(key, oFF.ProcessorODataConstants.RS_PROPERTY_PREFIX, "");
			targetStructure.put(oFF.XStringUtils.concatenate3(nestedPropertyName, "/", cleanedKey), sourceStructure.getByKey(key));
		}
	}
};
oFF.ODataResult.prototype.createResultEntries = function(result)
{
	let entries = oFF.XList.create();
	if (oFF.notNull(result))
	{
		let size = result.size();
		let navigationProperties = this.getNavigationProperties();
		for (let i = 0; i < size; i++)
		{
			let structure = result.getStructureAt(i);
			if (this.isServiceResult)
			{
				entries.add(oFF.ODataServiceResultEntry.create(structure));
			}
			else
			{
				oFF.XCollectionUtils.addAllIfNotPresent(entries, this.flattenResult(structure, navigationProperties));
			}
		}
	}
	return entries;
};
oFF.ODataResult.prototype.createResultEntry = function(element)
{
	return oFF.ODataResultEntry.create(element.asStructure());
};
oFF.ODataResult.prototype.getAndRemoveNestedItems = function(structure, nestedPropertyName)
{
	let navPropertyStructure = structure.getElementTypeByKey(nestedPropertyName) === oFF.PrElementType.STRUCTURE ? structure.getStructureByKey(nestedPropertyName) : null;
	if (oFF.notNull(navPropertyStructure))
	{
		let navPropertyItems = navPropertyStructure.getListByKey(oFF.ProcessorODataConstants.RS_RESULTS);
		if (oFF.isNull(navPropertyItems))
		{
			navPropertyItems = oFF.PrFactory.createList();
			navPropertyItems.add(navPropertyStructure);
		}
		structure.remove(nestedPropertyName);
		return navPropertyItems;
	}
	let links = oFF.PrUtils.getPropertyAsList(structure, oFF.ProcessorODataConstants.MD_LINK);
	if (oFF.notNull(links))
	{
		let size = links.size();
		for (let i = 0; i < size; i++)
		{
			let link = links.getStructureAt(i);
			let title = link.getStringByKey(oFF.ProcessorODataConstants.MD_PROPERTY_TITLE);
			if (oFF.XString.isEqual(title, nestedPropertyName))
			{
				links.removeAt(i);
				let result = oFF.PrFactory.createList();
				let inline = oFF.PrUtils.getStructureProperty(link, oFF.ProcessorODataConstants.RS_INLINE);
				let feed = oFF.PrUtils.getStructureProperty(inline, oFF.ProcessorODataConstants.RS_FEED);
				let entries = oFF.PrUtils.getPropertyAsList(oFF.notNull(feed) ? feed : inline, oFF.ProcessorODataConstants.RS_ENTRY);
				let entriesCount = entries.size();
				for (let k = 0; k < entriesCount; k++)
				{
					let properties = this.getPropertiesStructure(entries.getStructureAt(k));
					if (oFF.notNull(properties))
					{
						result.add(properties);
					}
				}
				return result;
			}
		}
	}
	return null;
};
oFF.ODataResult.prototype.getNavigationProperties = function()
{
	let navProperties = oFF.XHashSetOfString.create();
	let dimensions = this.m_requestParser.getAllDimensions();
	let dimensionCount = oFF.notNull(dimensions) ? dimensions.size() : 0;
	for (let i = 0; i < dimensionCount; i++)
	{
		let attributes = dimensions.getStructureAt(i).getListByKey("Attributes");
		let attributeCount = attributes.size();
		for (let k = 0; k < attributeCount; k++)
		{
			let attributeName = attributes.getStructureAt(k).getStringByKey("Name");
			if (oFF.XString.containsString(attributeName, "/"))
			{
				navProperties.add(attributeName);
			}
		}
	}
	return navProperties;
};
oFF.ODataResult.prototype.getNextPropertyLevel = function(fullPropertyPath, currentPropertyPath)
{
	if (oFF.XString.isEqual(fullPropertyPath, currentPropertyPath))
	{
		return null;
	}
	let currentPropertyPathSize = oFF.notNull(currentPropertyPath) ? oFF.XString.size(currentPropertyPath) + 1 : 0;
	let nextLevelIndex = oFF.XString.indexOfFrom(fullPropertyPath, "/", currentPropertyPathSize);
	if (nextLevelIndex > -1)
	{
		return oFF.XString.substring(fullPropertyPath, 0, nextLevelIndex);
	}
	return fullPropertyPath;
};
oFF.ODataResult.prototype.getPropertiesStructure = function(structure)
{
	let content = oFF.PrUtils.getStructureProperty(structure, oFF.ProcessorODataConstants.RS_CONTENT);
	let properties = oFF.PrUtils.getStructureProperty(content, oFF.ProcessorODataConstants.RS_PROPERTIES);
	return oFF.notNull(properties) ? properties : structure;
};
oFF.ODataResult.prototype.getResultEntries = function()
{
	return this.m_resultEntries;
};
oFF.ODataResult.prototype.getResultEntryAt = function(index)
{
	return this.m_resultEntries.get(index);
};
oFF.ODataResult.prototype.parseCatalogResultObjects = function(response)
{
	if (response.containsKey(oFF.ProcessorODataConstants.RS_VALUE))
	{
		return oFF.PrUtils.getPropertyAsList(response, oFF.ProcessorODataConstants.RS_VALUE);
	}
	if (response.containsKey(oFF.ProcessorODataConstants.RS_D))
	{
		let rsD = oFF.PrUtils.getStructureProperty(response, oFF.ProcessorODataConstants.RS_D);
		return oFF.PrUtils.getPropertyAsList(rsD, oFF.ProcessorODataConstants.RS_ENTITY_SETS);
	}
	let rsService = oFF.PrUtils.getStructureProperty(response, oFF.ProcessorODataConstants.RS_SERVICE);
	let rsWorkspace = oFF.PrUtils.getPropertyAsList(rsService, oFF.ProcessorODataConstants.RS_WORKSPACE);
	if (oFF.isNull(rsWorkspace))
	{
		rsService = oFF.PrUtils.getStructureProperty(response, oFF.ProcessorODataConstants.RS_APP_SERVICE);
		rsWorkspace = oFF.PrUtils.getPropertyAsList(rsService, oFF.ProcessorODataConstants.RS_APP_WORKSPACE);
	}
	let catalogObjects = oFF.PrFactory.createList();
	if (oFF.notNull(rsWorkspace))
	{
		let size = rsWorkspace.size();
		for (let i = 0; i < size; i++)
		{
			let workspace = rsWorkspace.getStructureAt(i);
			catalogObjects.addAll(oFF.PrUtils.getPropertyAsList(workspace, oFF.ProcessorODataConstants.RS_COLLECTION));
			catalogObjects.addAll(oFF.PrUtils.getPropertyAsList(workspace, oFF.ProcessorODataConstants.RS_APP_COLLECTION));
		}
	}
	return catalogObjects;
};
oFF.ODataResult.prototype.parseResult = function(response)
{
	if (this.isServiceResult)
	{
		return this.parseCatalogResultObjects(response);
	}
	if (response.containsKey(oFF.ProcessorODataConstants.RS_D))
	{
		let propertyD = oFF.PrUtils.getProperty(response, oFF.ProcessorODataConstants.RS_D);
		if (propertyD.isList())
		{
			return propertyD.asList();
		}
		else if (propertyD.isStructure())
		{
			return oFF.PrUtils.getPropertyAsList(propertyD.asStructure(), oFF.ProcessorODataConstants.RS_RESULTS);
		}
	}
	else if (response.containsKey(oFF.ProcessorODataConstants.RS_FEED))
	{
		let rsFeed = oFF.PrUtils.getStructureProperty(response, oFF.ProcessorODataConstants.RS_FEED);
		return oFF.PrUtils.getPropertyAsList(rsFeed, oFF.ProcessorODataConstants.RS_ENTRY);
	}
	else
	{
		return oFF.PrUtils.getPropertyAsList(response, oFF.ProcessorODataConstants.RS_VALUE);
	}
	return null;
};
oFF.ODataResult.prototype.releaseObject = function()
{
	oFF.FlatProcessorResult.prototype.releaseObject.call( this );
	this.m_resultEntries = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_resultEntries);
	this.m_requestParser = null;
};
oFF.ODataResult.prototype.setupResult = function(response, isCatalogServiceResult, requestParser)
{
	this.isServiceResult = isCatalogServiceResult;
	this.m_requestParser = requestParser;
	this.m_resultEntries = this.createResultEntries(this.parseResult(response));
};
oFF.ODataResult.prototype.size = function()
{
	return this.m_resultEntries.size();
};
oFF.ODataResult.prototype.toString = function()
{
	return this.m_resultEntries.toString();
};

oFF.InARequestParser = function() {};
oFF.InARequestParser.prototype = new oFF.InAParser();
oFF.InARequestParser.prototype._ff_c = "InARequestParser";

oFF.InARequestParser.CATALOG_VIEW = "CatalogView";
oFF.InARequestParser.create = function(request)
{
	let requestParser = new oFF.InARequestParser();
	requestParser.setupParser(request);
	return requestParser;
};
oFF.InARequestParser.isCatalogServiceRequested = function(inaRequest)
{
	let inARequestParser = oFF.InARequestParser.create(inaRequest);
	let isCatalogServiceRequest = inARequestParser.isCatalogServiceRequest();
	inARequestParser.releaseObject();
	return isCatalogServiceRequest;
};
oFF.InARequestParser.prototype.m_dimensions = null;
oFF.InARequestParser.prototype.m_measureDimension = null;
oFF.InARequestParser.prototype.m_measureMembers = null;
oFF.InARequestParser.prototype.m_request = null;
oFF.InARequestParser.prototype.m_requestDefinition = null;
oFF.InARequestParser.prototype.getAllDimensions = function()
{
	return this.m_dimensions;
};
oFF.InARequestParser.prototype.getCapabilities = function()
{
	return oFF.PrUtils.getStructureProperty(this.m_request, "Capabilities");
};
oFF.InARequestParser.prototype.getColumnDimensions = function()
{
	return this.getDimensions("Columns");
};
oFF.InARequestParser.prototype.getDataSource = function()
{
	return oFF.PrUtils.getStructureProperty(this.m_request, "DataSource");
};
oFF.InARequestParser.prototype.getDimensions = function(axisName)
{
	let dimensions = oFF.PrFactory.createList();
	let requestDimensions = this.getAllDimensions();
	if (oFF.notNull(requestDimensions))
	{
		let size = requestDimensions.size();
		for (let i = 0; i < size; i++)
		{
			let requestDimension = requestDimensions.getStructureAt(i);
			if (oFF.XString.isEqual(axisName, requestDimension.getStringByKey("Axis")))
			{
				dimensions.add(requestDimension);
			}
		}
	}
	return dimensions;
};
oFF.InARequestParser.prototype.getDisplayFormat = function(dimensionName, attributeName)
{
	let dimensionsCount = this.m_dimensions.size();
	for (let i = 0; i < dimensionsCount; i++)
	{
		let dimension = this.m_dimensions.getStructureAt(i);
		if (oFF.isNull(dimensionName) || oFF.XString.isEqual(dimension.getStringByKeyExt("Name", null), dimensionName))
		{
			let attributes = dimension.getListByKey("Attributes");
			let attribute = oFF.PrUtils.getStructureWithKeyValuePair(attributes, "Name", attributeName);
			if (oFF.notNull(attribute))
			{
				return oFF.PrUtils.getStringValueProperty(attribute, "DisplayFormat", null);
			}
		}
	}
	return null;
};
oFF.InARequestParser.prototype.getFilterSelection = function()
{
	let dynamicFilter = oFF.PrUtils.getStructureProperty(this.m_requestDefinition, "DynamicFilter");
	if (oFF.isNull(dynamicFilter))
	{
		dynamicFilter = oFF.PrUtils.getStructureProperty(this.m_requestDefinition, "Filter");
	}
	return oFF.PrUtils.getStructureProperty(dynamicFilter, "Selection");
};
oFF.InARequestParser.prototype.getFilteredStructureMembers = function(includedMembers, excludedMembers, selection)
{
	let operator = oFF.PrUtils.getStructureProperty(selection, "Operator");
	if (oFF.notNull(operator))
	{
		let subSelections = oFF.PrUtils.getListProperty(operator, "SubSelections");
		if (oFF.notNull(subSelections))
		{
			for (let i = 0; i < subSelections.size(); i++)
			{
				this.getFilteredStructureMembers(includedMembers, excludedMembers, subSelections.getStructureAt(i));
			}
		}
	}
	else
	{
		let operand = oFF.PrUtils.getStructureProperty(selection, "SetOperand");
		let fieldName = oFF.PrUtils.getStringValueProperty(operand, "FieldName", null);
		let elements = oFF.PrUtils.getListProperty(operand, "Elements");
		if (oFF.XString.isEqual(fieldName, oFF.ProcessorConstants.CUSTOM_DIM_KEY) && !oFF.PrUtils.isListEmpty(elements))
		{
			for (let k = 0; k < elements.size(); k++)
			{
				let element = elements.getStructureAt(k);
				let filterValue = oFF.PrUtils.getStringValueProperty(element, "Low", "");
				if (oFF.XString.isEqual(element.getStringByKey("Comparison"), "="))
				{
					if (element.getBooleanByKeyExt("IsExcluding", false))
					{
						excludedMembers.add(filterValue);
					}
					else
					{
						includedMembers.add(filterValue);
					}
				}
				else if (oFF.XString.isEqual(element.getStringByKey("Comparison"), "<>"))
				{
					if (element.getBooleanByKeyExt("IsExcluding", false))
					{
						includedMembers.add(filterValue);
					}
					else
					{
						excludedMembers.add(filterValue);
					}
				}
			}
		}
	}
};
oFF.InARequestParser.prototype.getKeyAttribute = function(dimension)
{
	let attributes = dimension.getListByKey("Attributes");
	let attributeCount = attributes.size();
	for (let i = 0; i < attributeCount; i++)
	{
		let attribute = attributes.getStructureAt(i);
		if (oFF.InAParser.isKeyAttribute(attribute))
		{
			return attribute;
		}
	}
	return null;
};
oFF.InARequestParser.prototype.getNonMeasureAxis = function()
{
	let dimensionsRows = this.getRowDimensions();
	let dimensionsCols = this.getColumnDimensions();
	if (this.containsMeasureDimension(dimensionsRows))
	{
		return dimensionsCols;
	}
	if (this.containsMeasureDimension(dimensionsCols))
	{
		return dimensionsRows;
	}
	if (dimensionsRows.isEmpty() && dimensionsCols.hasElements())
	{
		return dimensionsCols;
	}
	return dimensionsRows;
};
oFF.InARequestParser.prototype.getRowDimensions = function()
{
	return this.getDimensions("Rows");
};
oFF.InARequestParser.prototype.getServiceDescription = function()
{
	return oFF.PrUtils.getStructureProperty(this.getDataSource(), "GenericServiceDescription");
};
oFF.InARequestParser.prototype.getSort = function()
{
	return oFF.PrUtils.getListProperty(this.m_requestDefinition, "Sort");
};
oFF.InARequestParser.prototype.getStructureMemberDescription = function(memberStructure)
{
	let memberOperand = oFF.PrUtils.getStructureProperty(memberStructure, "MemberOperand");
	let description = oFF.PrUtils.getStringValueProperty(memberOperand, "Description", null);
	return oFF.notNull(description) ? description : oFF.PrUtils.getStringValueProperty(memberOperand, "Value", null);
};
oFF.InARequestParser.prototype.getStructureMemberName = function(memberStructure)
{
	let memberOperand = oFF.PrUtils.getStructureProperty(memberStructure, "MemberOperand");
	return oFF.PrUtils.getStringValueProperty(memberOperand, "Value", null);
};
oFF.InARequestParser.prototype.getStructureMembers = function()
{
	return this.m_measureMembers;
};
oFF.InARequestParser.prototype.getSubsetDescription = function()
{
	let rsFeatureRequest = oFF.PrUtils.getStructureProperty(this.m_requestDefinition, "ResultSetFeatureRequest");
	return oFF.PrUtils.getStructureProperty(rsFeatureRequest, "SubSetDescription");
};
oFF.InARequestParser.prototype.getVariableValues = function()
{
	let map = oFF.XHashMapByString.create();
	let variables = oFF.PrUtils.getListProperty(this.m_requestDefinition, "Variables");
	if (oFF.notNull(variables))
	{
		let size = variables.size();
		for (let i = 0; i < size; i++)
		{
			let variable = variables.getStructureAt(i);
			let name = variable.getStringByKey("Name");
			let element = oFF.PrUtils.getElement(variable.getListByKey("SimpleStringValues"), 0);
			if (oFF.isNull(element))
			{
				element = oFF.PrUtils.getElement(variable.getListByKey("SimpleNumericValues"), 0);
			}
			let value = null;
			if (oFF.notNull(element))
			{
				value = element.isString() ? element.asString().getString() : element.getStringRepresentation();
			}
			if (oFF.XStringUtils.isNotNullAndNotEmpty(name) && oFF.XStringUtils.isNotNullAndNotEmpty(value))
			{
				map.put(name, value);
			}
		}
	}
	return map;
};
oFF.InARequestParser.prototype.isCatalogServiceRequest = function()
{
	let requestType = oFF.PrUtils.getStringValueProperty(this.getDataSource(), "Type", null);
	return oFF.XString.isEqual(requestType, oFF.InARequestParser.CATALOG_VIEW);
};
oFF.InARequestParser.prototype.isSerializedDataRequested = function()
{
	let rsFeatureRequest = oFF.PrUtils.getStructureProperty(this.m_requestDefinition, "ResultSetFeatureRequest");
	let resultFormat = oFF.PrUtils.getStringValueProperty(rsFeatureRequest, "ResultFormat", null);
	return oFF.XString.isEqual(resultFormat, "SerializedData");
};
oFF.InARequestParser.prototype.isValid = function()
{
	return oFF.notNull(this.m_requestDefinition);
};
oFF.InARequestParser.prototype.parseStructureMembers = function(measureStructure)
{
	let axis = oFF.PrUtils.getStringValueProperty(measureStructure, "Axis", null);
	let members = oFF.PrUtils.getListProperty(measureStructure, "Members");
	if ((oFF.XString.isEqual(axis, "Rows") || oFF.XString.isEqual(axis, "Columns")) && oFF.notNull(members))
	{
		let includedMembers = oFF.XList.create();
		let excludedMembers = oFF.XList.create();
		this.getFilteredStructureMembers(includedMembers, excludedMembers, this.getFilterSelection());
		return oFF.XStream.of(members).map((m1) => {
			return m1.asStructure();
		}).filter((m2) => {
			return this.selectStructureMember(m2.asStructure(), includedMembers, excludedMembers);
		}).collect(oFF.XStreamCollector.toList());
	}
	return oFF.XList.create();
};
oFF.InARequestParser.prototype.releaseObject = function()
{
	oFF.InAParser.prototype.releaseObject.call( this );
	this.m_request = null;
	this.m_requestDefinition = null;
	this.m_dimensions = null;
	this.m_measureDimension = null;
	this.m_measureMembers = oFF.XObjectExt.release(this.m_measureMembers);
};
oFF.InARequestParser.prototype.selectStructureMember = function(member, includedMembers, excludedMembers)
{
	let visibility = member.getStringByKeyExt("Visibility", "Visible");
	if (!oFF.XString.isEqual(visibility, "Visible"))
	{
		return false;
	}
	let memberName = this.getStructureMemberName(member);
	if (oFF.XStringUtils.isNullOrEmpty(memberName))
	{
		return false;
	}
	if (excludedMembers.contains(memberName))
	{
		return false;
	}
	return !excludedMembers.isEmpty() || includedMembers.isEmpty() || includedMembers.contains(memberName);
};
oFF.InARequestParser.prototype.setupParser = function(request)
{
	this.m_request = oFF.PrUtils.getStructureProperty(request, "Metadata");
	if (oFF.isNull(this.m_request))
	{
		this.m_request = oFF.PrUtils.getStructureProperty(request, "Analytics");
	}
	this.m_requestDefinition = oFF.PrUtils.getStructureProperty(this.m_request, "Definition");
	this.m_dimensions = oFF.PrUtils.getListProperty(this.m_requestDefinition, "Dimensions");
	this.m_measureDimension = this.getMeasureDimension(this.m_dimensions);
	this.m_measureMembers = this.parseStructureMembers(this.m_measureDimension);
};

oFF.InAResponseParser = function() {};
oFF.InAResponseParser.prototype = new oFF.InAParser();
oFF.InAResponseParser.prototype._ff_c = "InAResponseParser";

oFF.InAResponseParser.create = function(response)
{
	let responseParser = new oFF.InAResponseParser();
	responseParser.setupParser(response);
	return responseParser;
};
oFF.InAResponseParser.prototype.m_axes = null;
oFF.InAResponseParser.prototype.m_dimensionsCols = null;
oFF.InAResponseParser.prototype.m_dimensionsRows = null;
oFF.InAResponseParser.prototype.m_grid = null;
oFF.InAResponseParser.prototype.getColumnDimensions = function()
{
	return this.m_dimensionsCols;
};
oFF.InAResponseParser.prototype.getMemberIndexesAt = function(axisName, index)
{
	let axis = oFF.PrUtils.getStructureWithKeyValuePair(this.m_axes, "Name", oFF.XString.toUpperCase(axisName));
	if (oFF.notNull(axis))
	{
		let tuples = axis.getListByKey("Tuples");
		let tuple = oFF.PrUtils.getStructureElement(tuples, index);
		let memberIndexes = oFF.PrUtils.getStructureProperty(tuple, "MemberIndexes");
		return oFF.PrUtils.getListProperty(memberIndexes, "Values");
	}
	return null;
};
oFF.InAResponseParser.prototype.getRowDimensions = function()
{
	return this.m_dimensionsRows;
};
oFF.InAResponseParser.prototype.getTupleCountNonMeasureAxis = function()
{
	let cellArraySizes = this.m_grid.getListByKey("CellArraySizes");
	if (oFF.PrUtils.getListSize(cellArraySizes, 0) >= 2)
	{
		if (this.containsMeasureDimension(this.m_dimensionsCols))
		{
			return cellArraySizes.getIntegerAt(0);
		}
		if (this.containsMeasureDimension(this.m_dimensionsRows))
		{
			return cellArraySizes.getIntegerAt(1);
		}
	}
	return -1;
};
oFF.InAResponseParser.prototype.getValues = function(property)
{
	let cells = oFF.PrUtils.getStructureProperty(this.m_grid, "Cells");
	let values = oFF.PrUtils.getStructureProperty(cells, property);
	return oFF.PrUtils.getListProperty(values, "Values");
};
oFF.InAResponseParser.prototype.isValid = function()
{
	return oFF.notNull(this.m_grid) && oFF.notNull(this.m_axes);
};
oFF.InAResponseParser.prototype.releaseObject = function()
{
	oFF.InAParser.prototype.releaseObject.call( this );
	this.m_grid = null;
	this.m_axes = null;
	this.m_dimensionsRows = null;
	this.m_dimensionsCols = null;
};
oFF.InAResponseParser.prototype.setupDimensions = function()
{
	let size = oFF.PrUtils.getListSize(this.m_axes, 0);
	for (let i = 0; i < size; i++)
	{
		let axis = this.m_axes.getStructureAt(i);
		if (oFF.XString.isEqual(oFF.InAParser.getName(axis), oFF.XString.toUpperCase("Rows")))
		{
			this.m_dimensionsRows = oFF.PrUtils.getListProperty(axis, "Dimensions");
		}
		else if (oFF.XString.isEqual(oFF.InAParser.getName(axis), oFF.XString.toUpperCase("Columns")))
		{
			this.m_dimensionsCols = oFF.PrUtils.getListProperty(axis, "Dimensions");
		}
	}
};
oFF.InAResponseParser.prototype.setupParser = function(request)
{
	let grids = oFF.PrUtils.getListProperty(request, "Grids");
	this.m_grid = oFF.PrUtils.getStructureElement(grids, 0);
	this.m_axes = oFF.PrUtils.getListProperty(this.m_grid, "Axes");
	this.setupDimensions();
};

oFF.GenericResult = function() {};
oFF.GenericResult.prototype = new oFF.FlatProcessorResult();
oFF.GenericResult.prototype._ff_c = "GenericResult";

oFF.GenericResult.create = function(response, inARequestParser)
{
	let result = new oFF.GenericResult();
	result.setupResult(response, inARequestParser);
	return result;
};
oFF.GenericResult.prototype.m_requestParser = null;
oFF.GenericResult.prototype.m_resultEntries = null;
oFF.GenericResult.prototype.copyFromStructure = function(source, target, nestedPropertyName)
{
	let targetStructure = target;
	let propertyName = nestedPropertyName;
	if (oFF.XString.containsString(nestedPropertyName, "."))
	{
		let pathParts = oFF.XStringTokenizer.splitString(nestedPropertyName, ".");
		let structuresToAdd = pathParts.size();
		if (!source.isStructure())
		{
			structuresToAdd--;
			propertyName = pathParts.get(structuresToAdd);
		}
		for (let i = 0; i < structuresToAdd; i++)
		{
			targetStructure = this.putStructure(targetStructure, pathParts.get(i));
		}
	}
	else if (source.isStructure())
	{
		targetStructure = this.putStructure(targetStructure, nestedPropertyName);
	}
	if (source.isStructure())
	{
		targetStructure.copyFrom(source, null);
	}
	else
	{
		targetStructure.put(propertyName, source);
	}
};
oFF.GenericResult.prototype.createResultEntry = function(element)
{
	return oFF.GenericResultEntry.create(element);
};
oFF.GenericResult.prototype.getAndRemoveNestedItems = function(structure, nestedPropertyName)
{
	let parentStructure = structure;
	let pathParts = oFF.XStringTokenizer.splitString(nestedPropertyName, ".");
	let size = pathParts.size();
	for (let i = 0; i < size - 1; i++)
	{
		parentStructure = oFF.PrUtils.getStructureProperty(parentStructure, pathParts.get(i));
	}
	let propertyName = size > 1 ? pathParts.get(size - 1) : nestedPropertyName;
	let list = oFF.PrUtils.getListProperty(parentStructure, propertyName);
	if (oFF.notNull(list))
	{
		parentStructure.remove(propertyName);
	}
	return list;
};
oFF.GenericResult.prototype.getNestedPropertyNames = function()
{
	let nestedProperties = oFF.XHashSetOfString.create();
	let dimensions = this.m_requestParser.getAllDimensions();
	let structureMembers = this.m_requestParser.getStructureMembers();
	let dimensionCount = oFF.PrUtils.getListSize(dimensions, 0);
	for (let i = 0; i < dimensionCount; i++)
	{
		let dimension = dimensions.getStructureAt(i);
		let keyAttribute = this.m_requestParser.getKeyAttribute(dimension);
		if (oFF.notNull(keyAttribute) && !oFF.InAParser.isStructure(dimension))
		{
			let attributePath = this.getPropertyPath(oFF.InAParser.getName(dimension), oFF.InAParser.getName(keyAttribute));
			oFF.XCollectionUtils.addIfNotPresent(nestedProperties, attributePath);
		}
	}
	let memberCount = structureMembers.size();
	for (let l = 0; l < memberCount; l++)
	{
		let structureMember = this.m_requestParser.getStructureMemberName(structureMembers.get(l));
		let memberPath = this.getPropertyPath(oFF.ProcessorConstants.CUSTOM_DIM, structureMember);
		oFF.XCollectionUtils.addIfNotPresent(nestedProperties, memberPath);
	}
	return nestedProperties;
};
oFF.GenericResult.prototype.getNextPropertyLevel = function(fullPropertyPath, currentPropertyPath)
{
	if (oFF.XString.isEqual(fullPropertyPath, currentPropertyPath))
	{
		return null;
	}
	let currentPropertyPathSize = oFF.notNull(currentPropertyPath) ? oFF.XString.size(currentPropertyPath) + 1 : 0;
	let nextLevelIndex = oFF.XString.indexOfFrom(fullPropertyPath, ".", currentPropertyPathSize);
	if (nextLevelIndex > -1)
	{
		return oFF.XString.substring(fullPropertyPath, 0, nextLevelIndex);
	}
	return fullPropertyPath;
};
oFF.GenericResult.prototype.getPropertyPath = function(dimensionName, attributeName)
{
	return attributeName;
};
oFF.GenericResult.prototype.getResultEntries = function()
{
	return this.m_resultEntries;
};
oFF.GenericResult.prototype.getResultEntryAt = function(index)
{
	return this.m_resultEntries.get(index);
};
oFF.GenericResult.prototype.putStructure = function(structure, name)
{
	let subStructure = oFF.PrUtils.getStructureProperty(structure, name);
	return oFF.notNull(subStructure) ? subStructure : structure.putNewStructure(name);
};
oFF.GenericResult.prototype.releaseObject = function()
{
	oFF.FlatProcessorResult.prototype.releaseObject.call( this );
	this.m_resultEntries = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_resultEntries);
	this.m_requestParser = null;
};
oFF.GenericResult.prototype.setupResult = function(response, inARequestParser)
{
	this.m_resultEntries = oFF.XList.create();
	this.m_requestParser = inARequestParser;
	let nestedProperties = this.getNestedPropertyNames();
	if (response.isList())
	{
		let list = response.asList();
		let size = list.size();
		for (let i = 0; i < size; i++)
		{
			let element = list.get(i);
			if (element.isStructure())
			{
				this.m_resultEntries.addAll(this.flattenResult(list.getStructureAt(i), nestedProperties));
			}
			else
			{
				this.m_resultEntries.add(this.createResultEntry(element));
			}
		}
	}
	else if (response.isStructure())
	{
		this.m_resultEntries.addAll(this.flattenResult(response.asStructure(), nestedProperties));
	}
	else
	{
		this.m_resultEntries.add(this.createResultEntry(response));
	}
};
oFF.GenericResult.prototype.size = function()
{
	return this.m_resultEntries.size();
};
oFF.GenericResult.prototype.toString = function()
{
	return this.m_resultEntries.toString();
};

oFF.GSAResult = function() {};
oFF.GSAResult.prototype = new oFF.GenericResult();
oFF.GSAResult.prototype._ff_c = "GSAResult";

oFF.GSAResult.createGenericServiceResult = function(response, inARequestParser)
{
	let result = new oFF.GSAResult();
	result.setupPropertyMappings(inARequestParser);
	result.setupResult(response, inARequestParser);
	return result;
};
oFF.GSAResult.prototype.m_responseProperties = null;
oFF.GSAResult.prototype.createResultEntry = function(element)
{
	return oFF.GSAResultEntry.createGenericServiceResultEntry(element, this.m_responseProperties);
};
oFF.GSAResult.prototype.getPropertyPath = function(dimensionName, attributeName)
{
	return this.m_responseProperties.getByKey(dimensionName).getByKey(attributeName);
};
oFF.GSAResult.prototype.releaseObject = function()
{
	oFF.GenericResult.prototype.releaseObject.call( this );
	this.m_responseProperties = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_responseProperties);
};
oFF.GSAResult.prototype.setupPropertyMappings = function(inARequestParser)
{
	this.m_responseProperties = oFF.XHashMapByString.create();
	let serviceDescription = inARequestParser.getServiceDescription();
	let dimensions = serviceDescription.getListByKey(oFF.ProcessorGSAConstants.DIMENSIONS);
	let measures = serviceDescription.getListByKey(oFF.ProcessorGSAConstants.MEASURES);
	let dimensionsCount = oFF.PrUtils.getListSize(dimensions, 0);
	for (let i = 0; i < dimensionsCount; i++)
	{
		let attributeMappings = oFF.XHashMapByString.create();
		let dimension = dimensions.getStructureAt(i);
		this.m_responseProperties.put(dimension.getStringByKey(oFF.ProcessorGSAConstants.NAME), attributeMappings);
		let dimAttributes = dimension.getListByKey(oFF.ProcessorGSAConstants.ATTRIBUTES);
		let attributesCount = dimAttributes.size();
		for (let k = 0; k < attributesCount; k++)
		{
			let attribute = dimAttributes.getStructureAt(k);
			attributeMappings.put(attribute.getStringByKey(oFF.ProcessorGSAConstants.NAME), attribute.getStringByKey(oFF.ProcessorGSAConstants.RESPONSE_PROPERTY));
		}
	}
	let measureMappings = oFF.XHashMapByString.create();
	this.m_responseProperties.put(oFF.ProcessorConstants.CUSTOM_DIM, measureMappings);
	let measuresCount = oFF.PrUtils.getListSize(measures, 0);
	for (let l = 0; l < measuresCount; l++)
	{
		let measure = measures.getStructureAt(l);
		measureMappings.put(measure.getStringByKey(oFF.ProcessorGSAConstants.NAME), measure.getStringByKey(oFF.ProcessorGSAConstants.RESPONSE_PROPERTY));
	}
};

oFF.DfProcessor = function() {};
oFF.DfProcessor.prototype = new oFF.MessageManager();
oFF.DfProcessor.prototype._ff_c = "DfProcessor";

oFF.DfProcessor.prototype.m_application = null;
oFF.DfProcessor.prototype.addServiceWithCapabilities = function(capabilities, systemName, serviceName, supportedCapabilities, inactiveCapabilities)
{
	if (oFF.notNull(this.m_application))
	{
		let systemDescription = this.getSystemDescription(systemName);
		if (oFF.notNull(systemDescription))
		{
			let whitelist = systemDescription.getIncludedCapabilitiesForService(serviceName);
			let blacklist = systemDescription.getExcludedCapabilitiesForService(serviceName);
			let capabilitiesList = oFF.XList.create();
			capabilitiesList.addAll(this.getCapabilitiesIntersectWithDefault(supportedCapabilities, whitelist));
			capabilitiesList.addAll(this.getCapabilitiesIntersect(inactiveCapabilities, whitelist));
			this.removeBlacklistedCapabilities(capabilitiesList, blacklist);
			capabilities.put(serviceName, capabilitiesList);
			return;
		}
	}
	capabilities.put(serviceName, supportedCapabilities);
};
oFF.DfProcessor.prototype.getApplication = function()
{
	return this.m_application;
};
oFF.DfProcessor.prototype.getCapabilitiesIntersect = function(capabilities, whitelist)
{
	let result = oFF.XList.create();
	if (oFF.notNull(whitelist))
	{
		for (let i = 0; i < whitelist.size(); i++)
		{
			let capability = whitelist.get(i);
			if (capabilities.contains(capability))
			{
				result.add(capability);
			}
		}
	}
	return result;
};
oFF.DfProcessor.prototype.getCapabilitiesIntersectWithDefault = function(supportedCapabilities, whitelist)
{
	let capabilitiesIntersect = this.getCapabilitiesIntersect(supportedCapabilities, whitelist);
	if (capabilitiesIntersect.isEmpty())
	{
		return supportedCapabilities;
	}
	return capabilitiesIntersect;
};
oFF.DfProcessor.prototype.getObjectNameFromRequest = function(inaRequest)
{
	let body = this.getRequestBody(inaRequest);
	let dataSource = body.getStructureByKey("DataSource");
	oFF.XObjectExt.assertNotNullExt(dataSource, "Couldn't extract data source from the request");
	return dataSource.getStringByKey("ObjectName");
};
oFF.DfProcessor.prototype.getPackageNameFromRequest = function(inaRequest)
{
	let body = this.getRequestBody(inaRequest);
	let dataSource = body.getStructureByKey("DataSource");
	oFF.XObjectExt.assertNotNullExt(dataSource, "Couldn't extract data source from the request");
	return dataSource.getStringByKey("PackageName");
};
oFF.DfProcessor.prototype.getProcess = function()
{
	return this.m_application.getProcess();
};
oFF.DfProcessor.prototype.getRequestBody = function(inaRequest)
{
	oFF.XObjectExt.assertNotNullExt(inaRequest, "Request is empty");
	let body = inaRequest.getStructureByKey("Analytics");
	if (oFF.isNull(body))
	{
		body = inaRequest.getStructureByKey("Metadata");
		oFF.XObjectExt.assertNotNullExt(body, "Couldn't extract request body from the request");
	}
	return body;
};
oFF.DfProcessor.prototype.getSystemDescription = function(systemName)
{
	if (oFF.notNull(this.m_application))
	{
		let systemLandscape = this.m_application.getSystemLandscape();
		return systemLandscape.getSystemDescription(systemName);
	}
	return null;
};
oFF.DfProcessor.prototype.getUrl = function(systemName)
{
	let systemDescription = this.getSystemDescription(systemName);
	oFF.XObjectExt.assertNotNullExt(systemDescription, oFF.XStringUtils.concatenate3("System with name '", systemName, "' not found"));
	return systemDescription.getUrl();
};
oFF.DfProcessor.prototype.releaseObject = function()
{
	this.m_application = null;
	oFF.MessageManager.prototype.releaseObject.call( this );
};
oFF.DfProcessor.prototype.removeBlacklistedCapabilities = function(capabilities, blacklist)
{
	if (oFF.notNull(blacklist))
	{
		for (let k = 0; k < blacklist.size(); k++)
		{
			capabilities.removeElement(blacklist.get(k));
		}
	}
};
oFF.DfProcessor.prototype.setApplication = function(application)
{
	this.m_application = application;
};
oFF.DfProcessor.prototype.setupProcessor = function()
{
	oFF.MessageManager.prototype.setupSessionContext.call( this , null);
};

oFF.InAMetadataBuilder = function() {};
oFF.InAMetadataBuilder.prototype = new oFF.MessageManager();
oFF.InAMetadataBuilder.prototype._ff_c = "InAMetadataBuilder";

oFF.InAMetadataBuilder.prototype.m_measureDimension = null;
oFF.InAMetadataBuilder.prototype.addDimensionTextField = function(property, inaDimension, isDefaultTextField)
{
	let name = property.getName();
	let inaField = this.createField(name, property.getDescription(), inaDimension.getStringByKey("Name"), property.getDataType(), property.getMaxLength(), property, false);
	inaField.putString("PresentationType", "Text");
	inaDimension.getListByKey("Attributes").add(inaField);
	let inaAttributeHierarchy = inaDimension.getStructureByKey("AttributeHierarchy");
	inaAttributeHierarchy.getListByKey("AttributeNames").addString(name);
	if (isDefaultTextField)
	{
		inaAttributeHierarchy.putString("DefaultTextAttribute", name);
		inaAttributeHierarchy.getListByKey("DefaultResultSetAttributes").addString(name);
	}
};
oFF.InAMetadataBuilder.prototype.createAttributesHierarchy = function(name, description, keyAttributeName, textAttributeName)
{
	let inaAttributeHierarchy = oFF.PrFactory.createStructure();
	inaAttributeHierarchy.putString("Name", name);
	inaAttributeHierarchy.putString("Description", description);
	inaAttributeHierarchy.putString("DefaultKeyAttribute", keyAttributeName);
	inaAttributeHierarchy.putString("DefaultTextAttribute", oFF.notNull(textAttributeName) ? textAttributeName : keyAttributeName);
	let inaAttributeNames = inaAttributeHierarchy.putNewList("AttributeNames");
	inaAttributeNames.addString(keyAttributeName);
	let inaDfRsAttributes = inaAttributeHierarchy.putNewList("DefaultResultSetAttributes");
	inaDfRsAttributes.addString(keyAttributeName);
	if (oFF.notNull(textAttributeName))
	{
		inaAttributeNames.addString(textAttributeName);
		inaDfRsAttributes.addString(textAttributeName);
	}
	return inaAttributeHierarchy;
};
oFF.InAMetadataBuilder.prototype.createAxisConstraints = function()
{
	let constraints = oFF.PrFactory.createList();
	constraints.addString("Free");
	constraints.addString("Rows");
	constraints.addString("Columns");
	return constraints;
};
oFF.InAMetadataBuilder.prototype.createCatalogServiceDimensions = function()
{
	let objectNameProperty = this.createCatalogServiceDimensionProperty(oFF.ProcessorConstants.SERVICE_MD_DIM_OBJECT_NAME);
	let objectNameTextProperty = this.createCatalogServiceDimensionProperty(oFF.ProcessorConstants.SERVICE_MD_DIM_OBJECT_NAME_TEXT);
	let dimension = this.createDimension(objectNameProperty, objectNameTextProperty);
	let attributes = dimension.getListByKey("Attributes");
	for (let i = 0; i < attributes.size(); i++)
	{
		attributes.getStructureAt(i).remove("FilterCapability");
	}
	dimension.putString("AxisDefault", "Rows");
	let axisConstraints = dimension.putNewList("AxisConstraints");
	axisConstraints.addString("Rows");
	let dimensions = oFF.PrFactory.createList();
	dimensions.add(dimension);
	return dimensions;
};
oFF.InAMetadataBuilder.prototype.createCatalogServiceMetadata = function()
{
	let inaStructure = oFF.PrFactory.createStructure();
	let inaCube = inaStructure.putNewStructure("Cube");
	inaCube.put("Dimensions", this.createCatalogServiceDimensions());
	inaCube.put("Grids", oFF.PrFactory.createList());
	inaCube.put("Description", oFF.PrFactory.createString("Query Catalog"));
	inaCube.put("ResultSetFeatureCapabilities", this.createResultSetFeatureCapabilities());
	return inaStructure;
};
oFF.InAMetadataBuilder.prototype.createComparisonOperators = function()
{
	return null;
};
oFF.InAMetadataBuilder.prototype.createDimension = function(keyProperty, textProperty)
{
	return this.createDimensionExt(keyProperty.getName(), keyProperty.getDescription(), keyProperty, textProperty, null);
};
oFF.InAMetadataBuilder.prototype.createDimensionExt = function(name, description, keyProperty, textProperty, additionalProperties)
{
	let keyPropertyName = keyProperty.getName();
	let inaDimension = oFF.PrFactory.createStructure();
	inaDimension.putString("Name", name);
	inaDimension.putString("Description", description);
	inaDimension.putInteger("DimensionType", 3);
	inaDimension.putString("KeyAttribute", keyPropertyName);
	inaDimension.putString("AxisDefault", "Free");
	inaDimension.put("AxisConstraints", this.createAxisConstraints());
	inaDimension.putBoolean("HierarchiesPossible", false);
	inaDimension.put("AttributeHierarchy", this.createAttributesHierarchy(name, name, keyPropertyName, null));
	inaDimension.getStructureByKey("AttributeHierarchy").putNewList("Children");
	inaDimension.putNewList("DefaultResultSetAttributes");
	inaDimension.putNewList("DefaultResultSetAttributeNodesMd").addString(name);
	inaDimension.putString("ResultSetMemberReadMode", "Booked");
	inaDimension.putString("SelectorReadMode", "Booked");
	inaDimension.putNewList("SupportedResultSetReadModes").addString("Booked");
	inaDimension.putNewList("SupportedSelectorReadModes").addString("Booked");
	inaDimension.putNewList("Attributes").add(this.createDimensionKeyField(keyProperty, name));
	let textPropertySortable = false;
	if (oFF.notNull(textProperty))
	{
		textPropertySortable = textProperty.isSortable();
		this.addDimensionTextField(textProperty, inaDimension, true);
	}
	inaDimension.putIfNotNull("ExtendedSortTypes", this.createExtendedSortTypes(false, keyProperty.isSortable(), textPropertySortable));
	let additionalPropertiesCount = oFF.notNull(additionalProperties) ? additionalProperties.size() : 0;
	for (let i = 0; i < additionalPropertiesCount; i++)
	{
		this.addDimensionTextField(additionalProperties.get(i), inaDimension, false);
	}
	return inaDimension;
};
oFF.InAMetadataBuilder.prototype.createDimensionKeyField = function(property, dimensionName)
{
	let inaField = this.createField(property.getName(), property.getDescription(), dimensionName, property.getDataType(), property.getMaxLength(), property, false);
	inaField.putBoolean("IsKey", true);
	inaField.putString("PresentationType", "Key");
	return inaField;
};
oFF.InAMetadataBuilder.prototype.createExtendedSortTypes = function(measure, key, text)
{
	return null;
};
oFF.InAMetadataBuilder.prototype.createField = function(name, description, dimensionName, dataType, maxLength, property, isMeasure)
{
	let isFilterable = property.isFilterable();
	let displayFormat = this.getDisplayFormat(property, dataType);
	let inaAttribute = oFF.PrFactory.createStructure();
	inaAttribute.putString("Name", name);
	inaAttribute.putString("Description", description);
	inaAttribute.putString("AliasName", name);
	inaAttribute.putString("DataType", dataType);
	inaAttribute.putString("DimensionName", dimensionName);
	inaAttribute.putBoolean("IsFilterable", isFilterable);
	inaAttribute.putBoolean("IsKey", false);
	if (maxLength > -1)
	{
		inaAttribute.putInteger("Length", maxLength);
	}
	inaAttribute.putStringNotNull("DisplayFormat", displayFormat);
	if (oFF.XString.isEqual(oFF.XString.toLowerCase(displayFormat), oFF.XString.toLowerCase(oFF.ProcessorConstants.MD_PROPERTY_SAP_DISPLAY_FORMAT_UPPERCASE)))
	{
		inaAttribute.putString("TextTransformation", "Uppercase");
	}
	if (isFilterable)
	{
		if (isMeasure)
		{
			let inaFilterCapMeasure = inaAttribute.putNewStructure("FilterCapability").putNewStructure("Comparison");
			inaFilterCapMeasure.putNewList("Including").addString("=");
			inaFilterCapMeasure.putNewList("Excluding");
		}
		else
		{
			let comparisonOperators = this.createComparisonOperators();
			if (oFF.notNull(comparisonOperators))
			{
				let inaFilterCapDimension = inaAttribute.putNewStructure("FilterCapability").putNewStructure("Comparison");
				inaFilterCapDimension.put("Including", comparisonOperators);
				inaFilterCapDimension.put("Excluding", comparisonOperators);
			}
		}
	}
	return inaAttribute;
};
oFF.InAMetadataBuilder.prototype.createMeasure = function(property)
{
	if (oFF.notNull(this.m_measureDimension))
	{
		this.m_measureDimension.getListByKey("Members").add(this.createStructureMember(property));
		if (!property.isSortable() && this.m_measureDimension.containsKey("ExtendedSortTypes"))
		{
			this.m_measureDimension.getListByKey("ExtendedSortTypes").clear();
		}
		return this.m_measureDimension;
	}
	this.m_measureDimension = oFF.PrFactory.createStructure();
	this.m_measureDimension.putString("Name", oFF.ProcessorConstants.CUSTOM_DIM);
	this.m_measureDimension.putString("Description", oFF.ProcessorConstants.CUSTOM_DIM_DESCRIPTION);
	this.m_measureDimension.putInteger("DimensionType", 2);
	this.m_measureDimension.putString("KeyAttribute", oFF.ProcessorConstants.CUSTOM_DIM_KEY);
	this.m_measureDimension.putString("TextAttribute", oFF.ProcessorConstants.CUSTOM_DIM_TEXT);
	this.m_measureDimension.put("AttributeHierarchy", this.createAttributesHierarchy(oFF.ProcessorConstants.CUSTOM_DIM, oFF.ProcessorConstants.CUSTOM_DIM, oFF.ProcessorConstants.CUSTOM_DIM_KEY, oFF.ProcessorConstants.CUSTOM_DIM_TEXT));
	this.m_measureDimension.putString("AxisDefault", "Columns");
	this.m_measureDimension.putBoolean("IsDimensionGroup", true);
	this.m_measureDimension.put("AxisConstraints", this.createAxisConstraints());
	this.m_measureDimension.putBoolean("HierarchiesPossible", false);
	this.m_measureDimension.putNewList("DefaultResultSetAttributeNodesMd").addString(oFF.ProcessorConstants.CUSTOM_DIM);
	this.m_measureDimension.putNewList("Members").add(this.createStructureMember(property));
	this.m_measureDimension.putIfNotNull("ExtendedSortTypes", this.createExtendedSortTypes(property.isSortable(), property.isSortable(), false));
	let attributes = this.m_measureDimension.putNewList("Attributes");
	attributes.add(this.createMeasureKeyField(property));
	attributes.add(this.createMeasureTextField(property));
	return this.m_measureDimension;
};
oFF.InAMetadataBuilder.prototype.createMeasureKeyField = function(property)
{
	let inaField = this.createField(oFF.ProcessorConstants.CUSTOM_DIM_KEY, oFF.ProcessorConstants.CUSTOM_DIM_KEY_DESCRIPTION, oFF.ProcessorConstants.CUSTOM_DIM, "String", -1, property, true);
	inaField.putBoolean("IsKey", true);
	inaField.putString("PresentationType", "Key");
	return inaField;
};
oFF.InAMetadataBuilder.prototype.createMeasureTextField = function(property)
{
	let inaField = this.createField(oFF.ProcessorConstants.CUSTOM_DIM_TEXT, oFF.ProcessorConstants.CUSTOM_DIM_TEXT_DESCRIPTION, oFF.ProcessorConstants.CUSTOM_DIM, "String", -1, property, true);
	inaField.putString("PresentationType", "Text");
	return inaField;
};
oFF.InAMetadataBuilder.prototype.createResultSetFeatureCapabilities = function()
{
	let capabilities = oFF.PrFactory.createStructure();
	let resultFormat = capabilities.putNewList("ResultFormat");
	resultFormat.addString("Version2");
	return capabilities;
};
oFF.InAMetadataBuilder.prototype.createStructureMember = function(property)
{
	let member = oFF.PrFactory.createStructure();
	member.putString(oFF.ProcessorConstants.CUSTOM_DIM_KEY, property.getName());
	member.putString(oFF.ProcessorConstants.CUSTOM_DIM_TEXT, property.getDescription());
	member.putString("DataType", property.getDataType());
	let numericPrecision = property.getNumericPrecision();
	let numericScale = property.getNumericScale();
	if (oFF.notNull(numericPrecision))
	{
		member.putInteger("NumericPrecision", numericPrecision.getInteger());
	}
	if (oFF.notNull(numericScale))
	{
		member.putInteger("NumericScale", numericScale.getInteger());
	}
	let unitType = property.getUnitType();
	let unitPropertyName = property.getUnitPropertyName();
	let unitTextPropertyName = property.getUnitTextPropertyName();
	member.putStringNotNullAndNotEmpty("UnitType", unitType);
	if (oFF.notNull(unitPropertyName) && !oFF.XString.isEqual(unitType, "UDF"))
	{
		member.putString("UnitName", unitPropertyName);
		if (oFF.notNull(unitTextPropertyName))
		{
			member.putString("UnitTextName", unitTextPropertyName);
		}
	}
	return member;
};
oFF.InAMetadataBuilder.prototype.createVariable = function(name, description, mandatory, type, defaultValue)
{
	let variable = oFF.PrFactory.createStructure();
	variable.putString("Name", name);
	variable.putString("Description", description);
	variable.putString("InputType", mandatory ? "Mandatory" : "Optional");
	variable.putString("VariableType", "SimpleTypeVariable");
	variable.putString("ValueType", type);
	variable.putBoolean("InputEnabled", true);
	variable.putBoolean("MultipleValues", false);
	let isNumeric = oFF.XString.isEqual(type, "Int") || oFF.XString.isEqual(type, "Double") || oFF.XString.isEqual(type, "Long") || oFF.XString.isEqual(type, "DecimalFloat");
	let values = variable.putNewList(isNumeric ? "SimpleNumericValues" : "SimpleStringValues");
	if (oFF.notNull(defaultValue))
	{
		values.add(defaultValue);
	}
	return variable;
};
oFF.InAMetadataBuilder.prototype.getDisplayFormat = function(property, dataType)
{
	if (oFF.XString.isEqual(property.getName(), oFF.ProcessorConstants.CUSTOM_DIM_TEXT))
	{
		return dataType;
	}
	let displayFormat = property.getDisplayFormat();
	if (oFF.isNull(displayFormat))
	{
		if (oFF.XString.isEqual(dataType, "Date"))
		{
			return "Date";
		}
		if (oFF.XString.isEqual(dataType, "Time"))
		{
			return "Time";
		}
		if (oFF.XString.isEqual(dataType, "Timestamp"))
		{
			return "DateTime";
		}
		return dataType;
	}
	return displayFormat;
};
oFF.InAMetadataBuilder.prototype.releaseObject = function()
{
	oFF.MessageManager.prototype.releaseObject.call( this );
	this.m_measureDimension = null;
};

oFF.InAResponseBuilder = function() {};
oFF.InAResponseBuilder.prototype = new oFF.MessageManager();
oFF.InAResponseBuilder.prototype._ff_c = "InAResponseBuilder";

oFF.InAResponseBuilder.create = function(inARequestParser)
{
	let inAResponseBuilder = new oFF.InAResponseBuilder();
	inAResponseBuilder.m_inARequestParser = inARequestParser;
	inAResponseBuilder.setupSessionContext(null);
	return inAResponseBuilder;
};
oFF.InAResponseBuilder.prototype.m_inARequestParser = null;
oFF.InAResponseBuilder.prototype.addAxesAndCells = function(grid, result)
{
	let dimensionsRows = this.m_inARequestParser.getRowDimensions();
	let dimensionsCols = this.m_inARequestParser.getColumnDimensions();
	let list = grid.putNewList("Axes");
	let totalDimensionCount = dimensionsRows.size() + dimensionsCols.size();
	if (dimensionsRows.hasElements())
	{
		list.add(this.createAxisStructure(dimensionsRows, "Rows", result, totalDimensionCount));
	}
	if (dimensionsCols.hasElements())
	{
		list.add(this.createAxisStructure(dimensionsCols, "Columns", result, totalDimensionCount));
	}
	if (result.size() > 0)
	{
		let cells = this.createCells(result);
		grid.put("Cells", cells);
		let structureMembers = this.m_inARequestParser.getStructureMembers();
		let isMeasureOnRows = this.m_inARequestParser.containsMeasureDimension(dimensionsRows);
		grid.put("CellArraySizes", this.createCellArraySizes(cells, structureMembers, isMeasureOnRows));
	}
};
oFF.InAResponseBuilder.prototype.addValuesToAllAttributes = function(dimName, attributes, resultEntry)
{
	let size = attributes.size();
	for (let i = 0; i < size; i++)
	{
		let attribute = attributes.getStructureAt(i);
		let attributeName = oFF.InAParser.getName(attribute);
		let attributeValues = attribute.getListByKey("Values");
		let attributeDisplayFormat = this.m_inARequestParser.getDisplayFormat(dimName, attributeName);
		let value = this.convertDimensionMember(resultEntry.getElement(dimName, attributeName), attributeDisplayFormat);
		attributeValues.add(value);
	}
};
oFF.InAResponseBuilder.prototype.asString = function(element)
{
	if (element.isString())
	{
		return element.asString().getString();
	}
	return element.getStringRepresentation();
};
oFF.InAResponseBuilder.prototype.convert = function(result)
{
	let inaResponse = oFF.PrFactory.createStructure();
	if (this.m_inARequestParser.isValid() && oFF.notNull(result))
	{
		let grids = inaResponse.putNewList("Grids");
		let grid = grids.addNewStructure();
		this.copyDataSource(inaResponse);
		this.copySubsetDescription(grid);
		grid.putString("ResultFormat", "Version2");
		grid.putString("ResultEncoding", "None");
		grid.putBoolean("InputEnabled", false);
		this.addAxesAndCells(grid, result);
		grid.putInteger("ResultSetState", 0);
	}
	else
	{
		this.addError(oFF.ErrorCodes.PARSER_ERROR, "No valid response/request");
	}
	if (this.isValid() && this.m_inARequestParser.isSerializedDataRequested())
	{
		let inAResponseParser = oFF.InAResponseParser.create(inaResponse);
		let serializer = oFF.InAResponseSerializer.create(inAResponseParser, this.m_inARequestParser);
		let serializedData = serializer.createSerializedData();
		this.copyAllMessages(serializer);
		oFF.XObjectExt.release(serializer);
		oFF.XObjectExt.release(inAResponseParser);
		inaResponse.remove("Grids");
		inaResponse.put("SerializedData", serializedData);
	}
	oFF.XObjectExt.release(result);
	if (this.hasErrors())
	{
		return this.createErrorResponse(this.getErrors());
	}
	return inaResponse;
};
oFF.InAResponseBuilder.prototype.convertDimensionMember = function(element, displayFormat)
{
	if (oFF.isNull(element))
	{
		return this.createEmptyValue(displayFormat);
	}
	let convertedDate = oFF.ProcessorDateConverter.convert(element, displayFormat);
	if (oFF.notNull(convertedDate))
	{
		return convertedDate;
	}
	if (element.isList())
	{
		let list = oFF.PrUtils.asListOfString(element.asList());
		return oFF.PrFactory.createString(oFF.XCollectionUtils.join(list, ","));
	}
	return this.convertToDataType(element, displayFormat);
};
oFF.InAResponseBuilder.prototype.convertToDataType = function(element, dataType)
{
	if (oFF.XString.isEqual(dataType, "String") && !element.isString() || oFF.XString.isEqual(dataType, "Double") && !element.isDouble() || oFF.XString.isEqual(dataType, "DecimalFloat") && !element.isDouble() || oFF.XString.isEqual(dataType, "Int") && !element.isInteger() || oFF.XString.isEqual(dataType, "Long") && !element.isLong() || oFF.XString.isEqual(dataType, "Bool") && !element.isBoolean())
	{
		return this.convertValueToDataType(element, dataType);
	}
	return element;
};
oFF.InAResponseBuilder.prototype.convertValueToDataType = function(element, dataType)
{
	let value = this.asString(element);
	if (oFF.XStringUtils.isNullOrEmpty(value))
	{
		return this.createEmptyValue(dataType);
	}
	switch (dataType)
	{
		case "String":
			return oFF.PrFactory.createString(value);

		case "Double":
			return oFF.PrFactory.createDouble(oFF.XDouble.convertFromString(value));

		case "DecimalFloat":
			return oFF.PrFactory.createDouble(oFF.XDouble.convertFromString(value));

		case "Int":
			return oFF.PrFactory.createInteger(oFF.XInteger.convertFromString(value));

		case "Long":
			return oFF.PrFactory.createLong(oFF.XLong.convertFromString(value));

		case "Bool":
			return oFF.PrFactory.createBoolean(oFF.XBoolean.convertFromString(value));

		default:
			return element;
	}
};
oFF.InAResponseBuilder.prototype.copyDataSource = function(to)
{
	let requestDataSource = this.m_inARequestParser.getDataSource();
	if (oFF.notNull(requestDataSource))
	{
		let dataSource = to.putNewStructure("DataSource");
		dataSource.copyFrom(requestDataSource, null);
	}
};
oFF.InAResponseBuilder.prototype.copySubsetDescription = function(to)
{
	let requestSubsetDescription = this.m_inARequestParser.getSubsetDescription();
	if (oFF.notNull(requestSubsetDescription))
	{
		let subsetDescription = to.putNewStructure("SubSetDescription");
		subsetDescription.copyFrom(requestSubsetDescription, null);
	}
};
oFF.InAResponseBuilder.prototype.createAttribute = function(isKey, requestedAttribute)
{
	let attribute = oFF.PrFactory.createStructure();
	attribute.putString("Name", oFF.InAParser.getName(requestedAttribute));
	attribute.putStringNotNull("Description", requestedAttribute.getStringByKey("Description"));
	attribute.putStringNotNull("Obtainability", requestedAttribute.getStringByKey("Obtainability"));
	attribute.putBoolean("IsKey", isKey);
	attribute.putNewList("Values");
	return attribute;
};
oFF.InAResponseBuilder.prototype.createAttributes = function(requestedDimAttributes, dimension)
{
	let dimensionAttributes = dimension.getListByKey("Attributes");
	let size = requestedDimAttributes.size();
	for (let i = 0; i < size; i++)
	{
		let requestedAttribute = requestedDimAttributes.getStructureAt(i);
		let isKey = oFF.InAParser.isKeyAttribute(requestedAttribute);
		if (isKey || oFF.InAParser.hasObtainabilityAlways(requestedAttribute))
		{
			dimensionAttributes.add(this.createAttribute(isKey, requestedAttribute));
		}
	}
	return dimensionAttributes;
};
oFF.InAResponseBuilder.prototype.createAxis = function(name)
{
	let axis = oFF.PrFactory.createStructure();
	axis.putString("Name", oFF.XString.toUpperCase(name));
	axis.putString("Type", name);
	axis.putNewList("Dimensions");
	axis.putNewList("Tuples");
	return axis;
};
oFF.InAResponseBuilder.prototype.createAxisStructure = function(requestedDimensions, axisName, result, totalDimensionCount)
{
	let axis = this.createAxis(axisName);
	let size = requestedDimensions.size();
	for (let i = 0; i < size; i++)
	{
		let requestedDim = requestedDimensions.getStructureAt(i);
		let tuples = axis.getListByKey("Tuples").addNewStructure();
		let tupleIndexes = this.createValueList(tuples, "MemberIndexes");
		let tupleParentIndexes = this.createValueList(tuples, "ParentIndexes");
		let tupleDisplayLevel = this.createValueList(tuples, "DisplayLevel");
		let tupleDrillState = this.createValueList(tuples, "DrillState");
		let dimension = this.createDimension(requestedDim, axis);
		let memberTypes = this.createValueList(dimension, "MemberTypes");
		let attributes = this.createAttributes(requestedDim.getListByKey("Attributes"), dimension);
		let keyAttribute = this.getFirstAttribute(attributes, true);
		let keyAttributeValues;
		if (oFF.InAParser.isStructure(dimension))
		{
			let textAttribute = this.getFirstAttribute(attributes, false);
			let members = this.m_inARequestParser.getStructureMembers();
			if (oFF.XCollectionUtils.hasElements(members) && oFF.notNull(keyAttribute))
			{
				keyAttributeValues = keyAttribute.getListByKey("Values");
				let textAttributeValues = oFF.notNull(textAttribute) ? textAttribute.getListByKey("Values") : null;
				let membersSize = members.size();
				for (let m = 0; m < membersSize; m++)
				{
					let member = members.get(m);
					keyAttributeValues.addString(this.m_inARequestParser.getStructureMemberName(member));
					if (oFF.notNull(textAttributeValues))
					{
						textAttributeValues.addString(this.m_inARequestParser.getStructureMemberDescription(member));
					}
					memberTypes.addInteger(0);
					tupleIndexes.addInteger(m);
					tupleParentIndexes.addInteger(-1);
					tupleDisplayLevel.addInteger(0);
					tupleDrillState.addInteger(0);
				}
			}
		}
		else
		{
			if (oFF.isNull(keyAttribute))
			{
				this.addError(oFF.ErrorCodes.PARSER_ERROR, oFF.XStringUtils.concatenate2("No key attribute found for dimension ", oFF.InAParser.getName(requestedDim)));
				return null;
			}
			let requestedDimName = oFF.InAParser.getName(requestedDim);
			let keyAttributeName = oFF.InAParser.getName(keyAttribute);
			let keyAttributeDisplayFormat = this.m_inARequestParser.getDisplayFormat(requestedDimName, keyAttributeName);
			keyAttributeValues = keyAttribute.getListByKey("Values");
			let resultSize = result.size();
			for (let r = 0; r < resultSize; r++)
			{
				let resultEntry = result.getResultEntryAt(r);
				let keyValue = this.convertDimensionMember(resultEntry.getElement(requestedDimName, keyAttributeName), keyAttributeDisplayFormat);
				if (oFF.isNull(keyValue))
				{
					this.addError(oFF.ErrorCodes.PARSER_ERROR, oFF.XStringUtils.concatenate2("Property not found in resultset entry: ", keyAttributeName));
					return null;
				}
				if (oFF.PrUtils.contains(keyAttributeValues, keyValue))
				{
					if (totalDimensionCount === 1)
					{
						continue;
					}
				}
				else
				{
					this.addValuesToAllAttributes(requestedDimName, attributes, resultEntry);
					memberTypes.addInteger(0);
				}
				tupleIndexes.addInteger(oFF.PrUtils.indexOf(keyAttributeValues, keyValue));
				tupleParentIndexes.addInteger(-1);
				tupleDisplayLevel.addInteger(0);
				tupleDrillState.addInteger(0);
			}
		}
	}
	axis.putInteger("TupleCount", this.getTupleCount(axis));
	return axis;
};
oFF.InAResponseBuilder.prototype.createCellArraySizes = function(cells, members, isMeasureOnRows)
{
	let valueCount = 0;
	let memberCount = members.size();
	let values = oFF.PrUtils.getListProperty(oFF.PrUtils.getStructureProperty(cells, "Values"), "Values");
	if (!oFF.PrUtils.isListEmpty(values))
	{
		valueCount = values.size() / memberCount;
	}
	let cellArraySizes = oFF.PrFactory.createList();
	if (isMeasureOnRows)
	{
		cellArraySizes.addInteger(memberCount);
		cellArraySizes.addInteger(valueCount);
	}
	else
	{
		cellArraySizes.addInteger(valueCount);
		cellArraySizes.addInteger(memberCount);
	}
	return cellArraySizes;
};
oFF.InAResponseBuilder.prototype.createCells = function(result)
{
	let cells = oFF.PrFactory.createStructure();
	let values = this.createValueList(cells, "Values");
	let valuesFormatted = this.createValueList(cells, "ValuesFormatted");
	let cellDataTypes = this.createValueList(cells, "CellDataType");
	let exceptions = this.createValueList(cells, "Exceptions");
	let cellFormats = this.createValueList(cells, "CellFormat");
	let units = null;
	let unitDescriptions = null;
	let unitTypes = null;
	let unitPositions = null;
	let structureMembers = this.m_inARequestParser.getStructureMembers();
	if (oFF.XCollectionUtils.hasElements(structureMembers))
	{
		let resultSize = result.size();
		let membersSize = structureMembers.size();
		for (let i = 0; i < membersSize; i++)
		{
			if (oFF.XStringUtils.isNotNullAndNotEmpty(structureMembers.get(i).getStringByKey("UnitName")))
			{
				units = this.createValueList(cells, "Units");
				unitDescriptions = this.createValueList(cells, "UnitDescriptions");
				unitTypes = this.createValueList(cells, "UnitTypes");
				unitPositions = this.createValueList(cells, "UnitPositions");
				break;
			}
		}
		for (let k = 0; k < resultSize; k++)
		{
			let resultEntry = result.getResultEntryAt(k);
			for (let m = 0; m < membersSize; m++)
			{
				let memberStructure = structureMembers.get(m);
				let memberName = this.m_inARequestParser.getStructureMemberName(memberStructure);
				let memberValue = this.ensureMeasureNotNull(resultEntry.getElement(oFF.ProcessorConstants.CUSTOM_DIM, memberName));
				let dataType = oFF.PrUtils.getStringValueProperty(memberStructure, "DataType", "DecimalFloat");
				values.add(this.convertToDataType(memberValue, dataType));
				valuesFormatted.addString(this.asString(memberValue));
				cellDataTypes.addString(dataType);
				exceptions.addInteger(0);
				cellFormats.addString("");
				if (oFF.notNull(units))
				{
					let unit = resultEntry.getElement(oFF.ProcessorConstants.CUSTOM_DIM, memberStructure.getStringByKey("UnitName"));
					let unitText = resultEntry.getElement(oFF.ProcessorConstants.CUSTOM_DIM, memberStructure.getStringByKey("UnitTextName"));
					let unitType = memberStructure.getStringByKey("UnitType");
					if (oFF.notNull(unit) && !oFF.XString.isEqual(unitType, "UDF"))
					{
						units.addString(this.asString(unit));
						unitDescriptions.addString(this.getUnitDescription(unitText, unit));
						unitTypes.addInteger(this.getUnitTypeAsInt(unitType));
						unitPositions.addInteger(1);
					}
					else
					{
						units.addString("");
						unitDescriptions.addString("");
						unitTypes.addInteger(0);
						unitPositions.addInteger(0);
					}
				}
			}
		}
	}
	return cells;
};
oFF.InAResponseBuilder.prototype.createDimension = function(requestedDimension, axis)
{
	let dimension = oFF.PrFactory.createStructure();
	axis.getListByKey("Dimensions").add(dimension);
	dimension.putString("Name", oFF.InAParser.getName(requestedDimension));
	dimension.putStringNotNull("Description", requestedDimension.getStringByKey("Description"));
	dimension.putNewList("Attributes");
	return dimension;
};
oFF.InAResponseBuilder.prototype.createEmptyValue = function(displayFormat)
{
	switch (displayFormat)
	{
		case "Int":
			return oFF.PrFactory.createInteger(0);

		case "Double":
			return oFF.PrFactory.createDouble(0);

		case "DecimalFloat":
			return oFF.PrFactory.createDouble(0);

		case "Long":
			return oFF.PrFactory.createLong(0);

		case "Bool":
			return oFF.PrFactory.createBoolean(false);

		default:
			return oFF.PrFactory.createString("");
	}
};
oFF.InAResponseBuilder.prototype.createErrorResponse = function(errors)
{
	let response = oFF.PrFactory.createStructure();
	let messages = response.putNewList("Messages");
	let size = errors.size();
	for (let i = 0; i < size; i++)
	{
		let error = errors.get(i);
		let message = messages.addNewStructure();
		message.putString("Text", error.getText());
		message.putInteger("Type", 2);
		message.putInteger("Number", error.getCode());
		message.putString("MessageClass", "InAResponseBuilder");
	}
	return response;
};
oFF.InAResponseBuilder.prototype.createValueList = function(structure, name)
{
	let tupleValueContainer = structure.putNewStructure(name);
	tupleValueContainer.putString("Encoding", "None");
	return tupleValueContainer.putNewList("Values");
};
oFF.InAResponseBuilder.prototype.ensureMeasureNotNull = function(element)
{
	if (oFF.isNull(element))
	{
		return oFF.PrFactory.createInteger(0);
	}
	return element;
};
oFF.InAResponseBuilder.prototype.getFirstAttribute = function(attributes, seachForKey)
{
	let size = attributes.size();
	for (let i = 0; i < size; i++)
	{
		let attribute = attributes.getStructureAt(i);
		if (attribute.getBooleanByKey("IsKey") === seachForKey)
		{
			return attribute;
		}
	}
	return null;
};
oFF.InAResponseBuilder.prototype.getTupleCount = function(axis)
{
	let tuples = oFF.PrUtils.getListProperty(axis, "Tuples");
	let tuplesFirstDim = oFF.PrUtils.getStructureElement(tuples, 0);
	let memberIndexes = oFF.PrUtils.getStructureProperty(tuplesFirstDim, "MemberIndexes");
	let values = oFF.PrUtils.getListProperty(memberIndexes, "Values");
	if (oFF.notNull(values))
	{
		return values.size();
	}
	return 0;
};
oFF.InAResponseBuilder.prototype.getUnitDescription = function(unitText, unitName)
{
	if (oFF.notNull(unitText))
	{
		return this.asString(unitText);
	}
	return this.asString(unitName);
};
oFF.InAResponseBuilder.prototype.getUnitTypeAsInt = function(unitType)
{
	if (oFF.XString.isEqual(unitType, "CUR"))
	{
		return 1;
	}
	else if (oFF.XString.isEqual(unitType, "UNI"))
	{
		return 2;
	}
	return -1;
};
oFF.InAResponseBuilder.prototype.releaseObject = function()
{
	oFF.MessageManager.prototype.releaseObject.call( this );
	this.m_inARequestParser = oFF.XObjectExt.release(this.m_inARequestParser);
};

oFF.InAResponseSerializer = function() {};
oFF.InAResponseSerializer.prototype = new oFF.MessageManager();
oFF.InAResponseSerializer.prototype._ff_c = "InAResponseSerializer";

oFF.InAResponseSerializer.create = function(inaResponse, inARequestParser)
{
	let serializer = new oFF.InAResponseSerializer();
	serializer.m_inaResponse = inaResponse;
	serializer.m_inARequest = inARequestParser;
	serializer.setupSessionContext(null);
	return serializer;
};
oFF.InAResponseSerializer.prototype.m_currentCurrencyId = 0;
oFF.InAResponseSerializer.prototype.m_currentUnitId = 0;
oFF.InAResponseSerializer.prototype.m_inARequest = null;
oFF.InAResponseSerializer.prototype.m_inaResponse = null;
oFF.InAResponseSerializer.prototype.addCubeUnit = function(cube, cubeUnits, globalCubeUnits, entity, unitType, unit)
{
	let cubeUnitId;
	if (globalCubeUnits.containsKey(unit))
	{
		cubeUnitId = globalCubeUnits.getByKey(unit).getInteger();
	}
	else
	{
		if (unitType === 3)
		{
			cubeUnitId = this.m_currentCurrencyId;
			this.m_currentCurrencyId++;
		}
		else
		{
			cubeUnitId = this.m_currentUnitId;
			this.m_currentUnitId++;
		}
		this.addGlobalCubeUnit(cube, globalCubeUnits, unit, cubeUnitId);
	}
	this.addEntityCubeUnit(entity, cubeUnits, unit, cubeUnitId);
};
oFF.InAResponseSerializer.prototype.addEntitiesForDimensions = function(entities, dimensions, axisName)
{
	let dimensionCount = oFF.PrUtils.getListSize(dimensions, 0);
	for (let i = 0; i < dimensionCount; i++)
	{
		let dimension = dimensions.getStructureAt(i);
		let memberIndexes = this.m_inaResponse.getMemberIndexesAt(axisName, i);
		if (oFF.isNull(memberIndexes))
		{
			this.addError(oFF.ErrorCodes.PARSER_ERROR, oFF.XStringUtils.concatenate2("No member indexes found for dimension ", oFF.InAParser.getName(dimension)));
			return;
		}
		if (oFF.InAParser.isStructure(dimension))
		{
			let dimensionTuplesEntity0 = entities.getStructureByKey("0").getListByKey(oFF.ProcessorConstants.SD_DIMENSION_TUPLES);
			let memberCount = memberIndexes.size();
			for (let k = 1; k < memberCount; k++)
			{
				let dimensionTuples = this.setupEntity(entities, k);
				dimensionTuples.copyFrom(dimensionTuplesEntity0, null);
				this.addMeasureTuple(dimensionTuples, memberIndexes.getIntegerAt(k));
			}
			this.addMeasureTuple(dimensionTuplesEntity0, memberIndexes.getIntegerAt(0));
		}
		else
		{
			this.addTupleToAllEntities(entities, memberIndexes);
		}
	}
};
oFF.InAResponseSerializer.prototype.addEntityCubeUnit = function(entity, unitIndexes, unit, unitId)
{
	let complexUnits = entity.getListByKey(oFF.ProcessorConstants.SD_COMPLEX_UNITS);
	if (oFF.isNull(complexUnits))
	{
		complexUnits = entity.putNewList(oFF.ProcessorConstants.SD_COMPLEX_UNITS);
	}
	let complexUnit = complexUnits.addNewStructure();
	let cubeUnit = complexUnit.putNewList(oFF.ProcessorConstants.SD_CUBE_UNIT);
	let unitStructure = cubeUnit.addNewStructure();
	unitStructure.putInteger(oFF.ProcessorConstants.SD_ID, unitId);
	unitStructure.putInteger(oFF.ProcessorConstants.SD_EXPONENT, 1);
	unitIndexes.put(unit, oFF.XIntegerValue.create(complexUnits.size()));
};
oFF.InAResponseSerializer.prototype.addGlobalCubeUnit = function(cube, globalCubeUnits, unit, unitId)
{
	let cubeUnitHandlerKeys = cube.getListByKey(oFF.ProcessorConstants.SD_CUBE_UNIT_HANDLER_KEY);
	if (oFF.isNull(cubeUnitHandlerKeys))
	{
		cubeUnitHandlerKeys = cube.putNewList(oFF.ProcessorConstants.SD_CUBE_UNIT_HANDLER_KEY);
	}
	let cubeUnitHandlerValues = cube.getListByKey(oFF.ProcessorConstants.SD_CUBE_UNIT_HANDLER_VALUE);
	if (oFF.isNull(cubeUnitHandlerValues))
	{
		cubeUnitHandlerValues = cube.putNewList(oFF.ProcessorConstants.SD_CUBE_UNIT_HANDLER_VALUE);
	}
	cubeUnitHandlerKeys.addString(unit);
	let cubeUnit = cubeUnitHandlerValues.addNewStructure();
	cubeUnit.putInteger(oFF.ProcessorConstants.SD_ID, unitId);
	cubeUnit.putInteger(oFF.ProcessorConstants.SD_EXPONENT, 1);
	globalCubeUnits.put(unit, oFF.XIntegerValue.create(cubeUnitHandlerKeys.size()));
};
oFF.InAResponseSerializer.prototype.addMeasureTuple = function(dimensionTuples, memberIndex)
{
	let measureTuple = dimensionTuples.addNewStructure();
	let measureTupleValues = measureTuple.putNewList(oFF.ProcessorConstants.SD_TUPLE);
	let tupleCountNonMeasureAxis = this.m_inaResponse.getTupleCountNonMeasureAxis();
	for (let i = 0; i < tupleCountNonMeasureAxis; i++)
	{
		measureTupleValues.addInteger(memberIndex);
	}
};
oFF.InAResponseSerializer.prototype.addMeasureValuesToEntities = function(entities, cube)
{
	let entityCount = entities.size();
	if (entityCount > 0)
	{
		let inaValues = this.m_inaResponse.getValues("ValuesFormatted");
		let inaUnitTypes = this.m_inaResponse.getValues("UnitTypes");
		let inaUnits = this.m_inaResponse.getValues("Units");
		let hasUnits = !oFF.PrUtils.isListEmpty(inaUnitTypes) && !oFF.PrUtils.isListEmpty(inaUnits);
		this.resetIdCounter();
		let globalCubeUnits = oFF.XHashMapByString.create();
		let valueCount = inaValues.size();
		for (let i = 0; i < entityCount; i++)
		{
			let entity = entities.getStructureByKey(oFF.XInteger.convertToString(i));
			let cubeUnits = oFF.XHashMapByString.create();
			for (let k = i; k < valueCount; k = k + entityCount)
			{
				entity.getListByKey(oFF.ProcessorConstants.SD_STRING_VALUE).addString(inaValues.getStringAt(k));
				let unitType = 0;
				let cubeUnitIndex = 0;
				if (hasUnits && oFF.XStringUtils.isNotNullAndNotEmpty(inaUnits.getStringAt(k)))
				{
					unitType = inaUnitTypes.getIntegerAt(k);
					let unit = inaUnits.getStringAt(k);
					if (!cubeUnits.containsKey(unit))
					{
						this.addCubeUnit(cube, cubeUnits, globalCubeUnits, entity, unitType, unit);
					}
					cubeUnitIndex = cubeUnits.getByKey(unit).getInteger();
				}
				entity.getListByKey(oFF.ProcessorConstants.SD_UNIT_TYPE).addInteger(unitType);
				entity.getListByKey(oFF.ProcessorConstants.SD_UNIT_INDEX).addInteger(cubeUnitIndex);
			}
		}
	}
};
oFF.InAResponseSerializer.prototype.addTupleToAllEntities = function(entities, tupleList)
{
	let entityCount = entities.size();
	for (let i = 0; i < entityCount; i++)
	{
		let entity = entities.getStructureByKey(oFF.XInteger.convertToString(i));
		let dimensionTuples = entity.getListByKey(oFF.ProcessorConstants.SD_DIMENSION_TUPLES);
		let newTuplesStructure = dimensionTuples.addNewStructure();
		newTuplesStructure.put(oFF.ProcessorConstants.SD_TUPLE, tupleList);
	}
};
oFF.InAResponseSerializer.prototype.createAxisStructure = function(axisName, position, inaDimensions)
{
	let axis = oFF.PrFactory.createStructure();
	axis.putString(oFF.ProcessorConstants.SD_NAME, axisName);
	axis.putInteger(oFF.ProcessorConstants.SD_AXIS_POSITION, position);
	axis.putInteger(oFF.ProcessorConstants.SD_BEGIN_POS_IN_TUPLE, 0);
	axis.putBoolean(oFF.ProcessorConstants.SD_PART_OF_RESULT_GRID, true);
	let dimensions = axis.putNewList(oFF.ProcessorConstants.SD_DIMENSIONS);
	let dimensionCount = oFF.PrUtils.getListSize(inaDimensions, 0);
	for (let i = 0; i < dimensionCount; i++)
	{
		let inaDimension = inaDimensions.getStructureAt(i);
		let dimensionName = oFF.InAParser.getName(inaDimension);
		let dimension = dimensions.addNewStructure();
		let members = dimension.putNewStructure(oFF.ProcessorConstants.SD_MEMBERS);
		let memberCols = members.putNewList(oFF.ProcessorConstants.SD_MEMBER_COLS);
		let memberRefCols = members.putNewList(oFF.ProcessorConstants.SD_MEMBER_REF_COLS);
		let attributes = dimension.putNewList(oFF.ProcessorConstants.SD_ATTRIBUTES);
		let inaAttributes = inaDimension.getListByKey("Attributes");
		let inaKeyAttribute = null;
		let attributeCount = inaAttributes.size();
		for (let k = 0; k < attributeCount; k++)
		{
			let inaAttribute = inaAttributes.getStructureAt(k);
			let attributeName = oFF.InAParser.getName(inaAttribute);
			let memberCol = memberCols.addNewStructure();
			memberCol.putString(oFF.ProcessorConstants.SD_MEMBER_COLS_COLUMN_NAME, attributeName);
			memberCol.putInteger(oFF.ProcessorConstants.SD_MEMBER_COLS_COLUMN_TYPE, 83);
			let memberValues = memberCol.putNewList(oFF.ProcessorConstants.SD_VALUES);
			memberValues.copyFrom(inaAttribute.getListByKey("Values"), null);
			let attribute = this.createCubeAttribute(inaDimension, inaAttribute);
			attributes.add(attribute);
			if (attribute.getBooleanByKey(oFF.ProcessorConstants.SD_IS_KEY_ATTRIBUTE))
			{
				inaKeyAttribute = inaAttribute;
				let memberRefCol = memberRefCols.addNewStructure();
				memberRefCol.putString(oFF.ProcessorConstants.SD_MEMBER_REF_COLS_COL_NAME, dimensionName);
				memberRefCol.putString(oFF.ProcessorConstants.SD_MEMBER_REF_COLS_NAME, attributeName);
			}
		}
		if (oFF.isNull(inaKeyAttribute))
		{
			this.addError(oFF.ErrorCodes.PARSER_ERROR, oFF.XStringUtils.concatenate2("No key attribute found for dimension ", dimensionName));
			return null;
		}
		dimension.putString(oFF.ProcessorConstants.SD_NAME, dimensionName);
		dimension.putString(oFF.ProcessorConstants.SD_UNIQUE_NAME, oFF.XStringUtils.concatenate3("[", dimensionName, "]"));
		dimension.put(oFF.ProcessorConstants.SD_CURRENT_TYPE, this.createTypeDefinition());
		dimension.put(oFF.ProcessorConstants.SD_VIEW_COLUMN, this.createViewColumn(inaDimension, inaKeyAttribute));
		dimension.putBoolean(oFF.ProcessorConstants.SD_IS_AGGREGATABLE, !oFF.InAParser.isStructure(inaDimension));
		dimension.putBoolean(oFF.ProcessorConstants.SD_HIERARCHY_DISPLAYED, false);
		dimension.putString(oFF.ProcessorConstants.SD_COLUMN_NAME_IN_INPUT, dimensionName);
	}
	return axis;
};
oFF.InAResponseSerializer.prototype.createCube = function()
{
	let cube = oFF.PrFactory.createStructure();
	cube.putInteger(oFF.ProcessorConstants.SD_MESSAGE_VERSION, 1);
	let cubeAxes = cube.putNewList(oFF.ProcessorConstants.SD_CUBE_AXES);
	cubeAxes.add(this.createAxisStructure(oFF.ProcessorConstants.SD_ROWS, 0, this.m_inaResponse.getRowDimensions()));
	cubeAxes.add(this.createAxisStructure(oFF.ProcessorConstants.SD_COLUMNS, 1, this.m_inaResponse.getColumnDimensions()));
	cube.put(oFF.ProcessorConstants.SD_ENTITIES, this.createEntities(cube));
	return cube.toString();
};
oFF.InAResponseSerializer.prototype.createCubeAttribute = function(inaDimension, inaAttribute)
{
	let attribute = oFF.PrFactory.createStructure();
	let attributeName = oFF.InAParser.getName(inaAttribute);
	attribute.putString(oFF.ProcessorConstants.SD_NAME, attributeName);
	attribute.putString(oFF.ProcessorConstants.SD_COLUMN_NAME_IN_INPUT, attributeName);
	attribute.putBoolean(oFF.ProcessorConstants.SD_IS_KEY_ATTRIBUTE, oFF.PrUtils.getBooleanValueProperty(inaAttribute, "IsKey", false));
	attribute.put(oFF.ProcessorConstants.SD_CURRENT_TYPE, this.createTypeDefinition());
	attribute.put(oFF.ProcessorConstants.SD_VIEW_COLUMN, this.createViewColumn(inaDimension, inaAttribute));
	return attribute;
};
oFF.InAResponseSerializer.prototype.createEntities = function(cube)
{
	let entities = oFF.PrFactory.createStructure();
	this.setupEntity(entities, 0);
	this.addEntitiesForDimensions(entities, this.m_inaResponse.getRowDimensions(), "Rows");
	this.addEntitiesForDimensions(entities, this.m_inaResponse.getColumnDimensions(), "Columns");
	this.addMeasureValuesToEntities(entities, cube);
	return entities;
};
oFF.InAResponseSerializer.prototype.createSerializedData = function()
{
	if (!this.m_inARequest.isValid() || !this.m_inaResponse.isValid())
	{
		this.addError(oFF.ErrorCodes.PARSER_ERROR, "Request or response structure is not valid");
		return null;
	}
	let viewValue = this.createView();
	let cubeValue = this.createCube();
	let leadingBytes = oFF.XByteArray.create(null, 8);
	leadingBytes.setByteAt(5, 1);
	let view = oFF.XCollectionUtils.concatenateByteArrays(leadingBytes, oFF.XByteArray.convertFromString(viewValue));
	let cube = oFF.XCollectionUtils.concatenateByteArrays(leadingBytes, oFF.XByteArray.convertFromString(cubeValue));
	let serializedData = oFF.PrFactory.createStructure();
	serializedData.putString("View", oFF.XHttpUtils.encodeByteArrayToBase64(view));
	serializedData.putString("Cube", oFF.XHttpUtils.encodeByteArrayToBase64(cube));
	return serializedData;
};
oFF.InAResponseSerializer.prototype.createTypeDefinition = function()
{
	let typeDefinition = oFF.PrFactory.createStructure();
	typeDefinition.putInteger(oFF.ProcessorConstants.SD_TYPE_VALUE_CLASS, 83);
	return typeDefinition;
};
oFF.InAResponseSerializer.prototype.createView = function()
{
	let dataSource = this.m_inARequest.getDataSource();
	let view = oFF.PrFactory.createStructure();
	view.putString(oFF.ProcessorConstants.SD_DESCRIPTION, dataSource.getStringByKeyExt("ObjectName", ""));
	view.putInteger(oFF.ProcessorConstants.SD_MESSAGE_VERSION, 1);
	view.putInteger(oFF.ProcessorConstants.SD_LAST_CHANGED_AT, 0);
	let dimensionMap = view.putNewList(oFF.ProcessorConstants.SD_DIMENSION_MAP);
	let viewColumns = view.putNewList(oFF.ProcessorConstants.SD_VIEW_COLUMNS);
	let inaDimensions = this.m_inARequest.getAllDimensions();
	let dimensionCount = inaDimensions.size();
	for (let i = 0; i < dimensionCount; i++)
	{
		let inaDimension = inaDimensions.getStructureAt(i);
		let keyAttributeName = null;
		let inaAttributes = inaDimension.getListByKey("Attributes");
		let attributeCount = inaAttributes.size();
		for (let k = 0; k < attributeCount; k++)
		{
			let inaAttribute = inaAttributes.getStructureAt(k);
			viewColumns.add(this.createViewColumn(inaDimension, inaAttribute));
			if (oFF.isNull(keyAttributeName) || inaAttribute.getBooleanByKeyExt("IsKey", false))
			{
				keyAttributeName = oFF.InAParser.getName(inaAttribute);
			}
		}
		dimensionMap.add(this.createViewDimension(inaDimension, keyAttributeName));
	}
	let dataSourceKey = view.putNewStructure(oFF.ProcessorConstants.SD_DATA_SOURCE_KEY);
	dataSourceKey.copyFrom(dataSource, null);
	dataSourceKey.remove("GenericServiceDescription");
	dataSourceKey.putBoolean(oFF.ProcessorConstants.SD_IS_TEMPORARY, false);
	return view.toString();
};
oFF.InAResponseSerializer.prototype.createViewColumn = function(inaDimension, inaAttribute)
{
	let attributeName = oFF.InAParser.getName(inaAttribute);
	let isMeasure = oFF.InAParser.isStructure(inaDimension);
	let isKeyAttribute = oFF.InAParser.isKeyAttribute(inaAttribute);
	let viewColumn = oFF.PrFactory.createStructure();
	let dimensions = viewColumn.putNewList(oFF.ProcessorConstants.SD_DIMENSIONS);
	dimensions.addString(oFF.InAParser.getName(inaDimension));
	viewColumn.putString(oFF.ProcessorConstants.SD_SQL_TYPE, oFF.ProcessorConstants.SD_SQL_TYPE_STRG);
	viewColumn.putBoolean(oFF.ProcessorConstants.SD_IS_MEASURE, isMeasure);
	viewColumn.put(oFF.ProcessorConstants.SD_TYPE, this.createTypeDefinition());
	viewColumn.putString(oFF.ProcessorConstants.SD_DESCRIPTION, attributeName);
	viewColumn.putString(oFF.ProcessorConstants.SD_NAME_IN_VIEW, attributeName);
	viewColumn.putInteger(oFF.ProcessorConstants.SD_UNIT_TYPE, 0);
	viewColumn.putInteger(oFF.ProcessorConstants.SD_AGGREGATION, 0);
	viewColumn.putBoolean(oFF.ProcessorConstants.SD_IS_VIRTUAL_DESCRIPTION, false);
	viewColumn.putBoolean(oFF.ProcessorConstants.SD_EXISTS_UNIT_CONVERSION, false);
	viewColumn.putBoolean(oFF.ProcessorConstants.SD_EXISTS_RESTRICTION, false);
	viewColumn.putBoolean(oFF.ProcessorConstants.SD_IS_DESCRIPTION_COLUMN, !isKeyAttribute);
	viewColumn.putBoolean(oFF.ProcessorConstants.SD_IS_DESCRIPTION_FROM_KEY_COLUMN, false);
	return viewColumn;
};
oFF.InAResponseSerializer.prototype.createViewDimension = function(inaDimension, keyAttributeName)
{
	let name = oFF.InAParser.getName(inaDimension);
	let dimension = oFF.PrFactory.createStructure();
	dimension.putString(oFF.ProcessorConstants.SD_KEY, name);
	let value = dimension.putNewStructure(oFF.ProcessorConstants.SD_VALUE);
	value.putString(oFF.ProcessorConstants.SD_NAME, name);
	value.putString(oFF.ProcessorConstants.SD_UNIQUE_NAME, oFF.XStringUtils.concatenate3("[", name, "]"));
	value.putString(oFF.ProcessorConstants.SD_DESCRIPTION, name);
	value.putBoolean(oFF.ProcessorConstants.SD_IS_MODELED, true);
	value.putBoolean(oFF.ProcessorConstants.SD_USE_UNIQUE_ATTRIBUTE_NAME, false);
	value.putString(oFF.ProcessorConstants.SD_KEY_COLUMN_NAME, keyAttributeName);
	if (oFF.InAParser.isStructure(inaDimension))
	{
		value.putInteger(oFF.ProcessorConstants.SD_DIMENSION_TYPE, 2);
		value.putBoolean(oFF.ProcessorConstants.SD_IS_DIMENSION_GROUP, true);
		let inaDimMembers = inaDimension.getListByKey("Members");
		let dimMembers = value.putNewList(oFF.ProcessorConstants.SD_DIMENSION_MEMBERS);
		let memberCount = inaDimMembers.size();
		for (let i = 0; i < memberCount; i++)
		{
			let inaDimMember = inaDimMembers.getStructureAt(i);
			let memberName = this.m_inARequest.getStructureMemberName(inaDimMember);
			let memberDescription = this.m_inARequest.getStructureMemberDescription(inaDimMember);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(memberName))
			{
				let dimMember = dimMembers.addNewStructure();
				dimMember.putString(oFF.ProcessorConstants.SD_NAME, memberName);
				dimMember.putString(oFF.ProcessorConstants.SD_DESCRIPTION, memberDescription);
			}
		}
	}
	else
	{
		value.putInteger(oFF.ProcessorConstants.SD_DIMENSION_TYPE, 3);
		value.putBoolean(oFF.ProcessorConstants.SD_IS_DIMENSION_GROUP, false);
	}
	return dimension;
};
oFF.InAResponseSerializer.prototype.releaseObject = function()
{
	oFF.MessageManager.prototype.releaseObject.call( this );
	this.m_inaResponse = null;
	this.m_inARequest = null;
};
oFF.InAResponseSerializer.prototype.resetIdCounter = function()
{
	this.m_currentCurrencyId = 16;
	this.m_currentUnitId = 256;
};
oFF.InAResponseSerializer.prototype.setupEntity = function(entities, index)
{
	let entity = entities.putNewStructure(oFF.XInteger.convertToString(index));
	entity.putNewList(oFF.ProcessorConstants.SD_HAS_EXCEPTION_SETTINGS).addBoolean(false);
	entity.putNewList(oFF.ProcessorConstants.SD_IS_HIDDEN).addBoolean(false);
	entity.putNewList(oFF.ProcessorConstants.SD_AGGREGATION).addInteger(0);
	entity.putNewList(oFF.ProcessorConstants.SD_DIGITS_SHIFT).addInteger(0);
	entity.putNewList(oFF.ProcessorConstants.SD_FRACT_DIGITS).addInteger(0);
	entity.putNewList(oFF.ProcessorConstants.SD_TYPE_INT_DIGITS).addInteger(32);
	entity.putNewList(oFF.ProcessorConstants.SD_RESULT_STRUCTURE).addString(oFF.ProcessorConstants.SD_RESULT_STRUCTURE_SEMANTIC_MEMBERS);
	entity.putNewList(oFF.ProcessorConstants.SD_VALUE_CLASS).addString(oFF.ProcessorConstants.SD_VALUE_CLASS_STRING);
	entity.putNewList(oFF.ProcessorConstants.SD_VALUE_EXCEPTION_TYPE).addString(oFF.ProcessorConstants.SD_VALUE_EXCEPTION_NORMAL);
	entity.putNewList(oFF.ProcessorConstants.SD_STRING_VALUE);
	entity.putNewList(oFF.ProcessorConstants.SD_UNIT_INDEX);
	entity.putNewList(oFF.ProcessorConstants.SD_UNIT_TYPE);
	return entity.putNewList(oFF.ProcessorConstants.SD_DIMENSION_TUPLES);
};

oFF.GSAMetadataBuilder = function() {};
oFF.GSAMetadataBuilder.prototype = new oFF.InAMetadataBuilder();
oFF.GSAMetadataBuilder.prototype._ff_c = "GSAMetadataBuilder";

oFF.GSAMetadataBuilder.create = function()
{
	let metadataBuilder = new oFF.GSAMetadataBuilder();
	metadataBuilder.setupSessionContext(null);
	return metadataBuilder;
};
oFF.GSAMetadataBuilder.prototype.createCatalogServiceDimensionProperty = function(name)
{
	return null;
};
oFF.GSAMetadataBuilder.prototype.createDimensions = function(serviceDescription)
{
	let inaDimensions = oFF.PrFactory.createList();
	let dimensions = serviceDescription.getListByKey(oFF.ProcessorGSAConstants.DIMENSIONS);
	let dimensionsCount = oFF.PrUtils.getListSize(dimensions, 0);
	for (let i = 0; i < dimensionsCount; i++)
	{
		let dimension = dimensions.getStructureAt(i);
		let dimName = dimension.getStringByKey(oFF.ProcessorGSAConstants.NAME);
		let dimDescription = dimension.getStringByKeyExt(oFF.ProcessorGSAConstants.DESCRIPTION, dimName);
		let keyProperty = null;
		let defaultTextProperty = null;
		let additionalAttributes = oFF.XList.create();
		let attributes = dimension.getListByKey(oFF.ProcessorGSAConstants.ATTRIBUTES);
		let attributesCount = attributes.size();
		for (let k = 0; k < attributesCount; k++)
		{
			let attribute = attributes.getStructureAt(k);
			let name = attribute.getStringByKey(oFF.ProcessorGSAConstants.NAME);
			let description = attribute.getStringByKey(oFF.ProcessorGSAConstants.DESCRIPTION);
			let dataType = attribute.getStringByKey(oFF.ProcessorGSAConstants.TYPE);
			let length = attribute.getIntegerByKeyExt(oFF.ProcessorGSAConstants.LENGTH, 0);
			let property = oFF.GSAMdProperty.create(name, description, dataType, length);
			if (oFF.isNull(keyProperty) && attribute.getBooleanByKeyExt(oFF.ProcessorGSAConstants.IS_KEY, false))
			{
				keyProperty = property;
			}
			else if (oFF.isNull(defaultTextProperty) && attribute.getBooleanByKeyExt(oFF.ProcessorGSAConstants.IS_DEFAULT_TEXT, false))
			{
				defaultTextProperty = property;
			}
			else
			{
				additionalAttributes.add(property);
			}
		}
		inaDimensions.add(this.createDimensionExt(dimName, dimDescription, keyProperty, defaultTextProperty, additionalAttributes));
	}
	let measureDimension = this.createMeasureDimension(serviceDescription);
	if (oFF.notNull(measureDimension))
	{
		inaDimensions.add(measureDimension);
	}
	return inaDimensions;
};
oFF.GSAMetadataBuilder.prototype.createMeasureDimension = function(serviceDescription)
{
	let measureDim = null;
	let measures = serviceDescription.getListByKey(oFF.ProcessorGSAConstants.MEASURES);
	let size = oFF.PrUtils.getListSize(measures, 0);
	for (let i = 0; i < size; i++)
	{
		let measure = measures.getStructureAt(i);
		let name = measure.getStringByKey(oFF.ProcessorGSAConstants.NAME);
		let description = measure.getStringByKey(oFF.ProcessorGSAConstants.DESCRIPTION);
		let dataType = measure.getStringByKey(oFF.ProcessorGSAConstants.TYPE);
		let numericPrecision = measure.getIntegerByKeyExt(oFF.ProcessorGSAConstants.NUMERIC_PRECISION, -1);
		let numericScale = measure.getIntegerByKeyExt(oFF.ProcessorGSAConstants.NUMERIC_SCALE, -1);
		measureDim = this.createMeasure(oFF.GSAMdProperty.createMeasure(name, description, dataType, numericPrecision, numericScale));
	}
	return measureDim;
};
oFF.GSAMetadataBuilder.prototype.createMetadata = function(inaRequest)
{
	let inaRequestStructure = inaRequest.asStructure();
	let requestParser = oFF.InARequestParser.create(inaRequestStructure);
	let serviceDescription = requestParser.getServiceDescription();
	if (oFF.isNull(serviceDescription))
	{
		this.addErrorWithMessage("Service description is missing");
		return null;
	}
	let inaStructure = oFF.PrFactory.createStructure();
	let inaCube = inaStructure.putNewStructure("Cube");
	inaCube.put("Capabilities", oFF.PrUtils.createDeepCopy(requestParser.getCapabilities()));
	inaCube.put("DataSource", oFF.PrUtils.createDeepCopy(requestParser.getDataSource()));
	inaCube.put("Dimensions", this.createDimensions(serviceDescription));
	inaCube.putIfNotNull("Variables", this.createVariables(serviceDescription));
	oFF.XObjectExt.release(requestParser);
	return inaStructure;
};
oFF.GSAMetadataBuilder.prototype.createVariables = function(serviceDescription)
{
	let variables = oFF.PrFactory.createList();
	let parameters = serviceDescription.getListByKey(oFF.ProcessorGSAConstants.PARAMETERS);
	let size = oFF.PrUtils.getListSize(parameters, 0);
	for (let i = 0; i < size; i++)
	{
		let parameter = parameters.getStructureAt(i);
		if (parameter.getBooleanByKeyExt(oFF.ProcessorGSAConstants.IS_VARIABLE, true))
		{
			let name = parameter.getStringByKey(oFF.ProcessorGSAConstants.NAME);
			let description = parameter.getStringByKey(oFF.ProcessorGSAConstants.DESCRIPTION);
			let valueType = parameter.getStringByKey(oFF.ProcessorGSAConstants.VALUE_TYPE);
			let defaultValue = parameter.getByKey(oFF.ProcessorGSAConstants.DEFAULT_VALUE);
			let isMandatory = parameter.getBooleanByKeyExt(oFF.ProcessorGSAConstants.IS_MANDATORY, false);
			variables.add(this.createVariable(name, description, isMandatory, valueType, defaultValue));
		}
	}
	return variables.hasElements() ? variables : null;
};

oFF.ProcessorGSA = function() {};
oFF.ProcessorGSA.prototype = new oFF.DfProcessor();
oFF.ProcessorGSA.prototype._ff_c = "ProcessorGSA";

oFF.ProcessorGSA.create = function()
{
	let processor = new oFF.ProcessorGSA();
	processor.setupProcessor();
	return processor;
};
oFF.ProcessorGSA.prototype.getMetadataUrl = function(systemName, inaRequestStructure)
{
	return null;
};
oFF.ProcessorGSA.prototype.getResultsetUrl = function(systemName, inaRequestStructure)
{
	let baseUri = this.getUrl(systemName);
	let url = oFF.GSAResultSetUrl.createUrl(baseUri, this.getObjectNameFromRequest(inaRequestStructure), inaRequestStructure);
	return oFF.XCollectionUtils.singletonList(oFF.InAProcessorRequest.create(url, oFF.ContentType.APPLICATION_JSON, null));
};
oFF.ProcessorGSA.prototype.parseResonse = function(requests)
{
	let request = requests.get(0);
	let response = request.getResponse();
	if (oFF.notNull(response))
	{
		return response;
	}
	return oFF.PrFactory.createString(request.getResponseAsString());
};
oFF.ProcessorGSA.prototype.processCapabilities = function(systemName)
{
	let supportedCapabilities = oFF.XList.create();
	supportedCapabilities.add(oFF.InACapabilities.C012_ENCODED_RESULTSET);
	supportedCapabilities.add(oFF.InACapabilities.C048_MEMBER_VISIBILITY);
	supportedCapabilities.add(oFF.InACapabilities.C005_OBTAINABILITY);
	supportedCapabilities.add(oFF.InACapabilities.C003_CLIENT_CAPABILITIES);
	supportedCapabilities.add(oFF.InACapabilities.C004_METADATA_SERVICE);
	supportedCapabilities.add(oFF.InACapabilities.C007_RESPONSE_FIXED_ATTRIBUTE_SEQUENCE);
	supportedCapabilities.add(oFF.InACapabilities.C001_DATASOURCE_AT_SERVICE);
	supportedCapabilities.add(oFF.InACapabilities.C091_CUBE_BLENDING);
	supportedCapabilities.add(oFF.InACapabilities.C093_REMOTE_BLENDING);
	let capabilities = oFF.XHashMapByString.create();
	this.addServiceWithCapabilities(capabilities, systemName, "Analytics", supportedCapabilities, oFF.XList.create());
	return oFF.InAServerInfoBuilder.buildServerInfoResponse(capabilities, this.getSystemDescription(systemName).getLanguage(), systemName);
};
oFF.ProcessorGSA.prototype.processMetadata = function(requests, inaRequestStructure)
{
	let metadataBuilder = oFF.GSAMetadataBuilder.create();
	let metadata = metadataBuilder.createMetadata(inaRequestStructure);
	this.copyAllMessages(metadataBuilder);
	oFF.XObjectExt.release(metadataBuilder);
	return oFF.InAProcessorResult.create(metadata);
};
oFF.ProcessorGSA.prototype.processResultset = function(requests, inaRequestStructure)
{
	let inARequestParser = oFF.InARequestParser.create(inaRequestStructure);
	let converter = oFF.InAResponseBuilder.create(inARequestParser);
	let inaResponse = null;
	let serverResponse = this.parseResonse(requests);
	if (oFF.notNull(serverResponse))
	{
		let result = oFF.GSAResult.createGenericServiceResult(serverResponse, inARequestParser);
		let orderedResult = oFF.OrderedProcessorResult.create(result, inARequestParser.getNonMeasureAxis());
		inaResponse = converter.convert(orderedResult);
		this.copyAllMessages(converter);
	}
	else
	{
		this.addError(oFF.ErrorCodes.PARSER_ERROR, "Response from service could not be read");
	}
	if (oFF.isNull(inaResponse))
	{
		inaResponse = converter.createErrorResponse(this.getErrors());
	}
	oFF.XObjectExt.release(converter);
	return oFF.InAProcessorResult.create(inaResponse);
};

oFF.ODataMetadataConverter = function() {};
oFF.ODataMetadataConverter.prototype = new oFF.InAMetadataBuilder();
oFF.ODataMetadataConverter.prototype._ff_c = "ODataMetadataConverter";

oFF.ODataMetadataConverter.create = function()
{
	let converter = new oFF.ODataMetadataConverter();
	converter.setupSessionContext(null);
	return converter;
};
oFF.ODataMetadataConverter.prototype.addDimensionAttribute = function(inaDimension, fieldPrefix, prefixAttributeWithDimName, property)
{
	let dimName = inaDimension.getStringByKey("Name");
	let attributeText = oFF.XStringUtils.concatenate2(fieldPrefix, property.getNameWithoutPrefix());
	let attributeName = oFF.XStringUtils.concatenate2(fieldPrefix, property.getName());
	if (prefixAttributeWithDimName)
	{
		attributeName = oFF.XStringUtils.concatenate3(inaDimension.getStringByKey("Name"), "/", attributeName);
	}
	inaDimension.getStructureByKey("AttributeHierarchy").getListByKey("Children").add(this.createAttributesHierarchy(attributeName, attributeText, attributeName, null));
	inaDimension.getListByKey("Attributes").add(this.createField(attributeName, property.getDescription(), dimName, property.getDataType(), property.getMaxLength(), property, false));
};
oFF.ODataMetadataConverter.prototype.addPropertyToDimension = function(inaDimension, schemas, fieldPrefix, prefixAttributeWithDimName, prop)
{
	if (prop.isComplexDataType())
	{
		this.extendInADimensionByComplexProperty(inaDimension, prop.getOriginDataType(), schemas, oFF.XStringUtils.concatenate3(fieldPrefix, prop.getName(), "/"));
	}
	else
	{
		this.addDimensionAttribute(inaDimension, fieldPrefix, prefixAttributeWithDimName, prop);
	}
};
oFF.ODataMetadataConverter.prototype.checkODataVersion = function(metadataXml, maxSupportedVersion)
{
	let edm = oFF.PrUtils.getStructureProperty(metadataXml, oFF.ProcessorODataConstants.MD_ENTITY_DATA_MODEL);
	let dataServices = oFF.PrUtils.getStructureProperty(edm, oFF.ProcessorODataConstants.MD_DATA_SERVICES);
	let dataServiceVersion = oFF.PrUtils.getStringValueProperty(dataServices, oFF.ProcessorODataConstants.MD_PROPERTY_DATA_SERVICE_VERSION, null);
	if (oFF.isNull(dataServiceVersion))
	{
		dataServiceVersion = oFF.PrUtils.getStringValueProperty(edm, oFF.ProcessorODataConstants.MD_PROPERTY_VERSION, null);
	}
	let odataVersion = this.parseVersion(dataServiceVersion);
	if (odataVersion < 0)
	{
		this.addWarning(oFF.ErrorCodes.PARSER_ERROR, "OData service version could not be parsed");
	}
	if (odataVersion > maxSupportedVersion)
	{
		this.addError(oFF.ErrorCodes.PARSER_ERROR, oFF.XStringUtils.concatenate4("OData Version ", dataServiceVersion, " is not supported, max supported: ", oFF.XInteger.convertToString(maxSupportedVersion)));
	}
};
oFF.ODataMetadataConverter.prototype.createCatalogServiceDimensionProperty = function(name)
{
	let objectNameProperty = oFF.PrFactory.createStructure();
	objectNameProperty.putString(oFF.ProcessorODataConstants.MD_PROPERTY_NAME, name);
	objectNameProperty.putBoolean(oFF.ProcessorODataConstants.MD_PROPERTY_SAP_SORTABLE, false);
	objectNameProperty.putString(oFF.ProcessorODataConstants.MD_PROPERTY_TYPE, oFF.ProcessorODataConstants.MD_VALUETYPE_STRING);
	return oFF.ODataProperty.create(objectNameProperty, oFF.PrFactory.createList());
};
oFF.ODataMetadataConverter.prototype.createComparisonOperators = function()
{
	let list = oFF.PrFactory.createList();
	list.addString("=");
	list.addString(">");
	list.addString(">=");
	list.addString("<");
	list.addString("<=");
	list.addString("<>");
	list.addString("BETWEEN");
	list.addString("BETWEEN_EXCLUDING");
	list.addString("NOTBETWEEN");
	list.addString("NOT_BETWEEN_EXCLUDING");
	list.addString("MATCH");
	return list;
};
oFF.ODataMetadataConverter.prototype.createExtendedSortTypes = function(measure, key, text)
{
	let sortTypes = oFF.PrFactory.createList();
	if (measure)
	{
		sortTypes.addString("Measure");
	}
	if (key)
	{
		sortTypes.addString("MemberKey");
	}
	if (text)
	{
		sortTypes.addString("MemberText");
	}
	return sortTypes;
};
oFF.ODataMetadataConverter.prototype.createInADimensions = function(entityType, schemas)
{
	let properties = oFF.PrUtils.getPropertyAsList(entityType, oFF.ProcessorODataConstants.MD_PROPERTY);
	if (oFF.PrUtils.isListEmpty(properties))
	{
		this.addError(oFF.ErrorCodes.PARSER_ERROR, oFF.XStringUtils.concatenate3("No properties found for entity type '", entityType.toString(), "'"));
		return null;
	}
	let inaDimensions = oFF.PrFactory.createList();
	let propertiesSize = properties.size();
	let propertyNames = oFF.XList.create();
	let textOnlyAttributes = oFF.XList.create();
	for (let i = 0; i < propertiesSize; i++)
	{
		let prop = properties.getStructureAt(i);
		let propertyName = this.getName(prop);
		if (oFF.XStringUtils.isNullOrEmpty(propertyName))
		{
			this.addError(oFF.ErrorCodes.PARSER_ERROR, "Property name not found");
			return null;
		}
		propertyNames.add(propertyName);
		textOnlyAttributes.add(prop.getStringByKey(oFF.ProcessorODataConstants.MD_PROPERTY_SAP_TEXT));
	}
	for (let k = 0; k < propertiesSize; k++)
	{
		let property = properties.getStructureAt(k);
		if (textOnlyAttributes.contains(this.getName(property)))
		{
			continue;
		}
		let textProperty = null;
		let textPropertyIndex = propertyNames.getIndex(property.getStringByKey(oFF.ProcessorODataConstants.MD_PROPERTY_SAP_TEXT));
		if (textPropertyIndex > -1)
		{
			textProperty = oFF.ODataProperty.create(properties.getStructureAt(textPropertyIndex), properties);
		}
		let odataProperty = oFF.ODataProperty.create(property, properties);
		let inaDimension;
		if (odataProperty.isMeasure())
		{
			inaDimension = this.createMeasure(odataProperty);
		}
		else
		{
			if (odataProperty.isComplexDataType())
			{
				property.putBoolean(oFF.ProcessorODataConstants.MD_PROPERTY_SAP_FILTERABLE, false);
				inaDimension = this.createDimension(odataProperty, textProperty);
				this.extendInADimensionByComplexProperty(inaDimension, odataProperty.getOriginDataType(), schemas, "");
			}
			else
			{
				inaDimension = this.createDimension(odataProperty, textProperty);
			}
		}
		if (!inaDimensions.contains(inaDimension))
		{
			inaDimensions.add(inaDimension);
		}
		oFF.XObjectExt.release(odataProperty);
		oFF.XObjectExt.release(textProperty);
	}
	return inaDimensions;
};
oFF.ODataMetadataConverter.prototype.createInADimensionsFromEntity = function(schemas, entityName)
{
	for (let i = 0; i < schemas.size(); i++)
	{
		let schema = schemas.getStructureAt(i);
		let entityContainer = oFF.PrUtils.getStructureProperty(schema, oFF.ProcessorODataConstants.MD_ENTITY_CONTAINER);
		let entitySet = this.getEntitySetByName(entityContainer, entityName);
		if (oFF.notNull(entitySet))
		{
			let entityTypeName = entitySet.getStringByKey(oFF.ProcessorODataConstants.MD_PROPERTY_ENTITY_TYPE);
			let entityType = this.getEntityType(schemas, entityTypeName);
			if (oFF.isNull(entityType))
			{
				this.addError(oFF.ErrorCodes.PARSER_ERROR, oFF.XStringUtils.concatenate3("EntityType '", entityTypeName, "' not found"));
				return null;
			}
			let dimensions = this.createInADimensions(entityType, schemas);
			this.extendInADimensionsByNavigationProperties(dimensions, schemas, entityType);
			return dimensions;
		}
	}
	this.addError(oFF.ErrorCodes.PARSER_ERROR, oFF.XStringUtils.concatenate3("EntitySet with name '", entityName, "' not found"));
	return null;
};
oFF.ODataMetadataConverter.prototype.createSortTypes = function(inaDimensions)
{
	if (oFF.isNull(inaDimensions))
	{
		return null;
	}
	let sortTypes = oFF.XHashSetOfString.create();
	let size = inaDimensions.size();
	for (let i = 0; i < size; i++)
	{
		let dimSortTypes = inaDimensions.getStructureAt(i).getListByKey("ExtendedSortTypes");
		for (let k = 0; k < dimSortTypes.size(); k++)
		{
			sortTypes.add(dimSortTypes.getStringAt(k));
		}
	}
	return oFF.PrFactory.createList().addAllStrings(sortTypes.getValuesAsReadOnlyList());
};
oFF.ODataMetadataConverter.prototype.extendDimensionByEntity = function(dimension, navPropertyEntityType, navPropertyName, referencePropertyName, schemas)
{
	if (oFF.isNull(dimension) || oFF.isNull(navPropertyEntityType) || oFF.isNull(referencePropertyName))
	{
		return;
	}
	let properties = oFF.PrUtils.getPropertyAsList(navPropertyEntityType, oFF.ProcessorODataConstants.MD_PROPERTY);
	let keyProperty = oFF.PrUtils.getStructureWithKeyValuePair(properties, oFF.ProcessorODataConstants.MD_PROPERTY_NAME, referencePropertyName);
	let textPropertyName = oFF.PrUtils.getStringValueProperty(keyProperty, oFF.ProcessorODataConstants.MD_PROPERTY_SAP_TEXT, null);
	let textProperty = oFF.PrUtils.getStructureWithKeyValuePair(properties, oFF.ProcessorODataConstants.MD_PROPERTY_NAME, textPropertyName);
	let attributeHierarchy = dimension.getStructureByKey("AttributeHierarchy");
	if (oFF.notNull(textProperty) && oFF.XString.isEqual(attributeHierarchy.getStringByKey("DefaultKeyAttribute"), attributeHierarchy.getStringByKey("DefaultTextAttribute")))
	{
		this.addDimensionTextField(oFF.ODataProperty.createWithPrefix(textProperty, properties, navPropertyName), dimension, true);
	}
	else
	{
		textProperty = null;
	}
	let size = properties.size();
	for (let i = 0; i < size; i++)
	{
		let property = properties.getStructureAt(i);
		if (property !== keyProperty && property !== textProperty)
		{
			this.addPropertyToDimension(dimension, schemas, "", false, oFF.ODataProperty.createWithPrefix(property, properties, navPropertyName));
		}
	}
};
oFF.ODataMetadataConverter.prototype.extendInADimensionByComplexProperty = function(inaDimension, complexTypeName, schemas, fieldPrefix)
{
	let complexType = this.getComplexType(schemas, complexTypeName);
	let properties = oFF.PrUtils.getListProperty(complexType, oFF.ProcessorODataConstants.MD_PROPERTY);
	if (oFF.notNull(properties))
	{
		oFF.XStream.of(properties).filter((property) => {
			return property.isStructure();
		}).map((structure) => {
			let struct = structure.asStructure();
			struct.putBoolean(oFF.ProcessorODataConstants.MD_PROPERTY_SAP_FILTERABLE, false);
			return oFF.ODataProperty.create(struct, properties);
		}).forEach((prop) => {
			this.addPropertyToDimension(inaDimension, schemas, fieldPrefix, true, prop);
		});
	}
};
oFF.ODataMetadataConverter.prototype.extendInADimensionsByNavigationProperties = function(dimensions, schemas, entityType)
{
	let navProperties = oFF.PrUtils.getPropertyAsList(entityType, oFF.ProcessorODataConstants.MD_NAVIGATION_PROPERTY);
	if (oFF.isNull(navProperties) || oFF.PrUtils.isListEmpty(dimensions))
	{
		return;
	}
	let size = navProperties.size();
	for (let i = 0; i < size; i++)
	{
		let navProperty = navProperties.getStructureAt(i);
		let navPropertyName = oFF.PrUtils.getStringValueProperty(navProperty, oFF.ProcessorODataConstants.MD_PROPERTY_NAME, null);
		let navPropertyRelationship = oFF.PrUtils.getStringValueProperty(navProperty, oFF.ProcessorODataConstants.MD_PROPERTY_RELATIONSHIP, null);
		let navPropertyFromRole = oFF.PrUtils.getStringValueProperty(navProperty, oFF.ProcessorODataConstants.MD_PROPERTY_FROM_ROLE, null);
		let navPropertyToRole = oFF.PrUtils.getStringValueProperty(navProperty, oFF.ProcessorODataConstants.MD_PROPERTY_TO_ROLE, null);
		let navPropertySchema = this.getNavigationPropertySchema(schemas, navPropertyRelationship);
		if (oFF.isNull(navPropertyName) || oFF.isNull(navPropertyRelationship) || oFF.isNull(navPropertyToRole) || oFF.isNull(navPropertyFromRole) || oFF.isNull(navPropertySchema))
		{
			continue;
		}
		let associationName = this.removeNamespace(navPropertySchema, navPropertyRelationship);
		let associations = oFF.PrUtils.getPropertyAsList(navPropertySchema, oFF.ProcessorODataConstants.MD_ASSOCIATION);
		let association = oFF.PrUtils.getStructureWithKeyValuePair(associations, oFF.ProcessorODataConstants.MD_PROPERTY_NAME, associationName);
		let associationEnds = oFF.PrUtils.getPropertyAsList(association, oFF.ProcessorODataConstants.MD_END);
		let associationEnd = oFF.PrUtils.getStructureWithKeyValuePair(associationEnds, oFF.ProcessorODataConstants.MD_PROPERTY_ROLE, navPropertyToRole);
		let multiplicity = oFF.PrUtils.getStringValueProperty(associationEnd, oFF.ProcessorODataConstants.MD_PROPERTY_MULTIPLICITY, null);
		if (!oFF.XString.containsString(multiplicity, "*") && oFF.notNull(association) && association.containsKey(oFF.ProcessorODataConstants.MD_REFERENTIAL_CONSTRAINT))
		{
			let propertyFromRef = this.getPropertyRefByRole(association, navPropertyFromRole);
			let propertyToRef = this.getPropertyRefByRole(association, navPropertyToRole);
			let dimension = oFF.PrUtils.getStructureWithKeyValuePair(dimensions, "Name", propertyFromRef);
			let entityTypeName = oFF.PrUtils.getStringValueProperty(associationEnd, oFF.ProcessorODataConstants.MD_PROPERTY_TYPE, null);
			let navPropertyEntityType = this.getEntityType(schemas, entityTypeName);
			this.extendDimensionByEntity(dimension, navPropertyEntityType, navPropertyName, propertyToRef, schemas);
		}
	}
};
oFF.ODataMetadataConverter.prototype.getComplexType = function(schemas, complexTypeName)
{
	return this.getTypeStructure(schemas, complexTypeName, oFF.ProcessorODataConstants.MD_COMPLEX_TYPE);
};
oFF.ODataMetadataConverter.prototype.getEntitySetByName = function(entityContainer, name)
{
	let entitySets = oFF.PrUtils.getPropertyAsList(entityContainer, oFF.ProcessorODataConstants.MD_ENTITY_SET);
	return oFF.PrUtils.getStructureWithKeyValuePair(entitySets, oFF.ProcessorODataConstants.MD_PROPERTY_NAME, name);
};
oFF.ODataMetadataConverter.prototype.getEntityType = function(schemas, entityTypeName)
{
	return this.getTypeStructure(schemas, entityTypeName, oFF.ProcessorODataConstants.MD_ENTITY_TYPE);
};
oFF.ODataMetadataConverter.prototype.getName = function(structure)
{
	return oFF.PrUtils.getStringValueProperty(structure, oFF.ProcessorODataConstants.MD_PROPERTY_NAME, null);
};
oFF.ODataMetadataConverter.prototype.getNavigationPropertySchema = function(schemas, navPropertyRelationship)
{
	if (oFF.notNull(navPropertyRelationship))
	{
		let size = schemas.size();
		for (let k = 0; k < size; k++)
		{
			let schema = schemas.getStructureAt(k);
			let schemaNamespace = schema.getStringByKey(oFF.ProcessorODataConstants.MD_PROPERTY_NAMESPACE);
			if (oFF.notNull(schemaNamespace) && oFF.XString.startsWith(navPropertyRelationship, schemaNamespace))
			{
				return schema;
			}
		}
	}
	return null;
};
oFF.ODataMetadataConverter.prototype.getPropertyRefByRole = function(association, role)
{
	let constraint = null;
	let referentialConstraint = association.getStructureByKey(oFF.ProcessorODataConstants.MD_REFERENTIAL_CONSTRAINT);
	let principal = referentialConstraint.getStructureByKey(oFF.ProcessorODataConstants.MD_PRINCIPAL);
	let dependent = referentialConstraint.getStructureByKey(oFF.ProcessorODataConstants.MD_DEPENDENT);
	if (oFF.XString.isEqual(role, oFF.PrUtils.getStringValueProperty(principal, oFF.ProcessorODataConstants.MD_PROPERTY_ROLE, null)))
	{
		constraint = principal;
	}
	else if (oFF.XString.isEqual(role, oFF.PrUtils.getStringValueProperty(dependent, oFF.ProcessorODataConstants.MD_PROPERTY_ROLE, null)))
	{
		constraint = dependent;
	}
	let propertyRef = oFF.PrUtils.getStructureProperty(constraint, oFF.ProcessorODataConstants.MD_PROPERTY_REF);
	return oFF.PrUtils.getStringValueProperty(propertyRef, oFF.ProcessorODataConstants.MD_PROPERTY_NAME, null);
};
oFF.ODataMetadataConverter.prototype.getSchemas = function(metadataXml)
{
	let edm = oFF.PrUtils.getStructureProperty(metadataXml, oFF.ProcessorODataConstants.MD_ENTITY_DATA_MODEL);
	let dataServices = oFF.PrUtils.getStructureProperty(edm, oFF.ProcessorODataConstants.MD_DATA_SERVICES);
	let schemas = oFF.PrUtils.getPropertyAsList(dataServices, oFF.ProcessorODataConstants.MD_SCHEMA);
	if (oFF.isNull(schemas))
	{
		this.addError(oFF.ErrorCodes.PARSER_ERROR, "No schemas found in metadata response");
	}
	return schemas;
};
oFF.ODataMetadataConverter.prototype.getSupportedContentType = function(schemas, entityName)
{
	for (let i = 0; i < schemas.size(); i++)
	{
		let entityContainer = oFF.PrUtils.getStructureProperty(schemas.getStructureAt(i), oFF.ProcessorODataConstants.MD_ENTITY_CONTAINER);
		if (this.getEntitySetByName(entityContainer, entityName) !== null)
		{
			let supportedFormats = oFF.XStringTokenizer.splitString(oFF.PrUtils.getStringValueProperty(entityContainer, oFF.ProcessorODataConstants.MD_PROPERTY_SAP_SUPPORTED_FORMATS, null), " ");
			if (oFF.notNull(supportedFormats))
			{
				if (supportedFormats.contains(oFF.ContentType.JSON.getName()))
				{
					return oFF.ContentType.APPLICATION_JSON;
				}
				if (supportedFormats.contains(oFF.ContentType.ATOM.getName()))
				{
					return oFF.ContentType.APPLICATION_XML;
				}
			}
		}
	}
	return oFF.ContentType.APPLICATION_JSON;
};
oFF.ODataMetadataConverter.prototype.getTypeStructure = function(schemas, structureName, tagName)
{
	if (oFF.isNull(schemas) || oFF.isNull(structureName))
	{
		return null;
	}
	let size = schemas.size();
	for (let i = 0; i < size; i++)
	{
		let schema = schemas.getStructureAt(i);
		let nameWithoutNamespace = this.removeNamespace(schema, structureName);
		let entityTypes = oFF.PrUtils.getPropertyAsList(schema, tagName);
		let entityType = oFF.PrUtils.getStructureWithKeyValuePair(entityTypes, oFF.ProcessorODataConstants.MD_PROPERTY_NAME, nameWithoutNamespace);
		if (oFF.notNull(entityType))
		{
			return entityType;
		}
	}
	return null;
};
oFF.ODataMetadataConverter.prototype.parseVersion = function(version)
{
	if (oFF.XStringUtils.isNullOrEmpty(version))
	{
		return -1;
	}
	let majorVersionIndex = oFF.XMath.max(oFF.XString.indexOf(version, "."), 1);
	return oFF.XInteger.convertFromStringWithDefault(oFF.XString.substring(version, 0, majorVersionIndex), -1);
};
oFF.ODataMetadataConverter.prototype.removeNamespace = function(schema, entityTypeName)
{
	if (oFF.notNull(schema) && schema.containsKey(oFF.ProcessorODataConstants.MD_PROPERTY_NAMESPACE))
	{
		let namespace = schema.getStringByKey(oFF.ProcessorODataConstants.MD_PROPERTY_NAMESPACE);
		if (oFF.XString.startsWith(entityTypeName, namespace))
		{
			return oFF.XString.substring(entityTypeName, oFF.XString.size(namespace) + 1, oFF.XString.size(entityTypeName));
		}
	}
	return null;
};

oFF.ProcessorODataBase = function() {};
oFF.ProcessorODataBase.prototype = new oFF.DfProcessor();
oFF.ProcessorODataBase.prototype._ff_c = "ProcessorODataBase";

oFF.ProcessorODataBase.prototype.convertResponseToInA = function(odataResponse, inARequestParser, converter)
{
	if (inARequestParser.isCatalogServiceRequest())
	{
		let result = oFF.ODataResult.create(odataResponse.asStructure(), true, inARequestParser);
		let filterSelection = inARequestParser.getFilterSelection();
		if (oFF.notNull(filterSelection))
		{
			result = oFF.CatalogResultFilter.create(result, filterSelection);
		}
		return converter.convert(result);
	}
	let odataResult = oFF.ODataResult.create(odataResponse.asStructure(), false, inARequestParser);
	let orderedOdataResult = oFF.OrderedProcessorResult.create(odataResult, inARequestParser.getNonMeasureAxis());
	return converter.convert(orderedOdataResult);
};
oFF.ProcessorODataBase.prototype.getMetadataUrl = function(systemName, inaRequestStructure)
{
	if (oFF.InARequestParser.isCatalogServiceRequested(inaRequestStructure))
	{
		return null;
	}
	let uri = oFF.XUri.createFromUrl(oFF.XStringUtils.concatenate3(this.getUrl(systemName), oFF.XUri.PATH_SEPARATOR, oFF.ProcessorODataConstants.PARAM_METADATA));
	return oFF.XCollectionUtils.singletonList(oFF.InAProcessorRequest.create(uri, oFF.ContentType.APPLICATION_XML, null));
};
oFF.ProcessorODataBase.prototype.getResultsetUrl = function(systemName, inaRequestStructure)
{
	if (oFF.InARequestParser.isCatalogServiceRequested(inaRequestStructure))
	{
		let serviceUri = oFF.XUri.createFromUrl(oFF.XStringUtils.concatenate2(this.getUrl(systemName), oFF.XUri.PATH_SEPARATOR));
		return oFF.XCollectionUtils.singletonList(oFF.InAProcessorRequest.create(serviceUri, oFF.ContentType.APPLICATION_XML, null));
	}
	let entity = this.getObjectNameFromRequest(inaRequestStructure);
	let url = oFF.ODataResultSetUrl.createUrl(this.getUrl(systemName), entity, inaRequestStructure);
	return oFF.XCollectionUtils.singletonList(oFF.InAProcessorRequest.create(url, null, null));
};
oFF.ProcessorODataBase.prototype.processCapabilities = function(systemName)
{
	return oFF.InAServerInfoBuilder.buildServerInfoResponse(this.getCapabilities(systemName), this.getSystemDescription(systemName).getLanguage(), systemName);
};
oFF.ProcessorODataBase.prototype.processMetadata = function(requests, inaRequestStructure)
{
	let converter = oFF.ODataMetadataConverter.create();
	if (oFF.InARequestParser.isCatalogServiceRequested(inaRequestStructure))
	{
		let catalogServiceMetadata = converter.createCatalogServiceMetadata();
		oFF.XObjectExt.release(converter);
		return oFF.InAProcessorResult.create(catalogServiceMetadata);
	}
	let result = null;
	let metadataXml = requests.get(0).getResponse();
	if (oFF.notNull(metadataXml))
	{
		let schemas = converter.getSchemas(metadataXml.asStructure());
		converter.checkODataVersion(metadataXml.asStructure(), this.getMaxSupportedODataVersion());
		if (converter.isValid())
		{
			let entitySetName = this.getObjectNameFromRequest(inaRequestStructure);
			let inaDimensions = converter.createInADimensionsFromEntity(schemas, entitySetName);
			let requestMetadata = inaRequestStructure.getStructureByKey("Metadata");
			if (converter.isValid())
			{
				let inaStructure = oFF.PrFactory.createStructure();
				let inaCube = inaStructure.putNewStructure("Cube");
				this.put(inaCube, "Dimensions", inaDimensions);
				this.put(inaCube, "ExtendedSortTypes", converter.createSortTypes(inaDimensions));
				this.put(inaCube, "DataSource", oFF.PrUtils.createDeepCopy(oFF.PrUtils.getStructureProperty(requestMetadata, "DataSource")));
				this.put(inaCube, "Capabilities", oFF.PrUtils.createDeepCopy(oFF.PrUtils.getListProperty(requestMetadata, "Capabilities")));
				result = oFF.InAProcessorResult.createWithContentType(inaStructure, converter.getSupportedContentType(schemas, entitySetName));
			}
		}
		this.copyAllMessages(converter);
		oFF.XObjectExt.release(converter);
	}
	if (this.hasErrors())
	{
		return null;
	}
	return result;
};
oFF.ProcessorODataBase.prototype.processResultset = function(requests, inaRequestStructure)
{
	let inaResponse = null;
	let odataResponse = requests.get(0).getResponse();
	if (oFF.notNull(odataResponse))
	{
		let inARequestParser = oFF.InARequestParser.create(inaRequestStructure);
		let converter = oFF.InAResponseBuilder.create(inARequestParser);
		inaResponse = this.convertResponseToInA(odataResponse, inARequestParser, converter);
		this.copyAllMessages(converter);
		if (oFF.isNull(inaResponse))
		{
			inaResponse = converter.createErrorResponse(this.getErrors());
		}
		oFF.XObjectExt.release(converter);
	}
	else
	{
		this.addError(oFF.ErrorCodes.PARSER_ERROR, "OData response could not be read");
	}
	return oFF.InAProcessorResult.create(inaResponse);
};
oFF.ProcessorODataBase.prototype.put = function(inaCube, name, element)
{
	if (oFF.notNull(element))
	{
		inaCube.put(name, element);
	}
};

oFF.ProcessorSCP = function() {};
oFF.ProcessorSCP.prototype = new oFF.DfProcessor();
oFF.ProcessorSCP.prototype._ff_c = "ProcessorSCP";

oFF.ProcessorSCP.create = function()
{
	let scpProcessor = new oFF.ProcessorSCP();
	scpProcessor.setupProcessor();
	return scpProcessor;
};
oFF.ProcessorSCP.prototype.addQueryParametersToUrl = function(uri, variables)
{
	let keys = variables.getKeysAsReadOnlyList();
	let size = keys.size();
	for (let i = 0; i < size; i++)
	{
		let key = keys.get(i);
		uri.addQueryElement(key, variables.getByKey(key));
	}
};
oFF.ProcessorSCP.prototype.convertToInA = function(inARequestParser, converter, scpResponse)
{
	if (inARequestParser.isCatalogServiceRequest())
	{
		let result = oFF.GenericResult.create(scpResponse, inARequestParser);
		let filterSelection = inARequestParser.getFilterSelection();
		if (oFF.notNull(filterSelection))
		{
			result = oFF.CatalogResultFilter.create(result, filterSelection);
		}
		return converter.convert(result);
	}
	let scpResult = oFF.GenericResult.create(scpResponse, inARequestParser);
	let orderedScpResult = oFF.OrderedProcessorResult.create(scpResult, inARequestParser.getNonMeasureAxis());
	return converter.convert(orderedScpResult);
};
oFF.ProcessorSCP.prototype.getMetadataUrl = function(systemName, inaRequestStructure)
{
	if (oFF.InARequestParser.isCatalogServiceRequested(inaRequestStructure))
	{
		return null;
	}
	let entity = this.getObjectNameFromRequest(inaRequestStructure);
	let entityUri = oFF.XStringUtils.concatenate4(this.getUrl(systemName), oFF.ProcessorSCPConstants.URI_OBJECTS, "/", entity);
	let uriDocs = oFF.XUri.createFromUrl(oFF.XStringUtils.concatenate2(entityUri, oFF.ProcessorSCPConstants.URI_DOCS));
	uriDocs.addQueryElement(oFF.ProcessorSCPConstants.URI_DOCS_PARAM_DISCOVERY, "false");
	uriDocs.addQueryElement(oFF.ProcessorSCPConstants.URI_DOCS_PARAM_REFERENCES, "false");
	uriDocs.addQueryElement(oFF.ProcessorSCPConstants.URI_DOCS_PARAM_BASIC, "true");
	let uriMetadata = oFF.XUri.createFromUrl(oFF.XStringUtils.concatenate2(entityUri, oFF.ProcessorSCPConstants.URI_METADATA));
	let requests = oFF.XList.create();
	requests.add(oFF.InAProcessorRequest.create(uriDocs, oFF.ContentType.APPLICATION_JSON, oFF.ProcessorSCPConstants.URI_DOCS));
	requests.add(oFF.InAProcessorRequest.create(uriMetadata, oFF.ContentType.APPLICATION_JSON, oFF.ProcessorSCPConstants.URI_METADATA));
	return requests;
};
oFF.ProcessorSCP.prototype.getResultsetUrl = function(systemName, inaRequestStructure)
{
	let url = this.getUrl(systemName);
	let uri;
	let inARequestParser = oFF.InARequestParser.create(inaRequestStructure);
	if (inARequestParser.isCatalogServiceRequest())
	{
		uri = oFF.XUri.createFromUrl(oFF.XStringUtils.concatenate2(url, oFF.ProcessorSCPConstants.URI_OBJECTS));
	}
	else
	{
		let variables = inARequestParser.getVariableValues();
		let entityPathWithPlaceholders = this.getPackageNameFromRequest(inaRequestStructure);
		let entityPath = this.replacePathVariables(entityPathWithPlaceholders, variables);
		uri = oFF.XUri.createFromUrl(oFF.XStringUtils.concatenate2(url, entityPath));
		this.addQueryParametersToUrl(uri, variables);
	}
	oFF.XObjectExt.release(inARequestParser);
	return oFF.XCollectionUtils.singletonList(oFF.InAProcessorRequest.create(uri, null, null));
};
oFF.ProcessorSCP.prototype.processCapabilities = function(systemName)
{
	let supportedCapabilities = oFF.XList.create();
	supportedCapabilities.add(oFF.InACapabilities.C012_ENCODED_RESULTSET);
	supportedCapabilities.add(oFF.InACapabilities.C048_MEMBER_VISIBILITY);
	supportedCapabilities.add(oFF.InACapabilities.C005_OBTAINABILITY);
	supportedCapabilities.add(oFF.InACapabilities.C003_CLIENT_CAPABILITIES);
	supportedCapabilities.add(oFF.InACapabilities.C004_METADATA_SERVICE);
	supportedCapabilities.add(oFF.InACapabilities.C007_RESPONSE_FIXED_ATTRIBUTE_SEQUENCE);
	supportedCapabilities.add(oFF.InACapabilities.C011_SET_OPERAND);
	supportedCapabilities.add(oFF.InACapabilities.C001_DATASOURCE_AT_SERVICE);
	supportedCapabilities.add(oFF.InACapabilities.C030_UNIQUE_ATTRIBUTE_NAMES);
	supportedCapabilities.add(oFF.InACapabilities.PAGING);
	supportedCapabilities.add(oFF.InACapabilities.C028_METADATA_DIMENSION_GROUP);
	supportedCapabilities.add(oFF.InACapabilities.C091_CUBE_BLENDING);
	supportedCapabilities.add(oFF.InACapabilities.C093_REMOTE_BLENDING);
	let capabilities = oFF.XHashMapByString.create();
	this.addServiceWithCapabilities(capabilities, systemName, "Analytics", supportedCapabilities, oFF.XList.create());
	return oFF.InAServerInfoBuilder.buildServerInfoResponse(capabilities, this.getSystemDescription(systemName).getLanguage(), systemName);
};
oFF.ProcessorSCP.prototype.processMetadata = function(requests, inaRequestStructure)
{
	let scpMdFactory = oFF.SCPMetadataBuilder.create();
	if (oFF.InARequestParser.isCatalogServiceRequested(inaRequestStructure))
	{
		let catalogServiceMetadata = scpMdFactory.createCatalogServiceMetadata();
		oFF.XObjectExt.release(scpMdFactory);
		return oFF.InAProcessorResult.create(catalogServiceMetadata);
	}
	let docsResponse = null;
	let metadataResponse = null;
	let size = requests.size();
	for (let i = 0; i < size; i++)
	{
		let request = requests.get(i);
		if (oFF.XString.isEqual(request.getCustomIdentifier(), oFF.ProcessorSCPConstants.URI_DOCS))
		{
			docsResponse = request.getResponse();
		}
		else if (oFF.XString.isEqual(request.getCustomIdentifier(), oFF.ProcessorSCPConstants.URI_METADATA))
		{
			metadataResponse = request.getResponse();
		}
	}
	let metadata = scpMdFactory.createMetadata(docsResponse, metadataResponse, inaRequestStructure);
	this.copyAllMessages(scpMdFactory);
	oFF.XObjectExt.release(scpMdFactory);
	if (oFF.isNull(metadata))
	{
		this.addErrorWithMessage(oFF.XStringUtils.concatenate3("Metadata for element '", this.getObjectNameFromRequest(inaRequestStructure), "' could not be read"));
		return null;
	}
	return oFF.InAProcessorResult.createWithContentType(metadata, oFF.ContentType.APPLICATION_JSON);
};
oFF.ProcessorSCP.prototype.processResultset = function(requests, inaRequestStructure)
{
	let inaResponse = null;
	let inARequestParser = oFF.InARequestParser.create(inaRequestStructure);
	let converter = oFF.InAResponseBuilder.create(inARequestParser);
	let scpResponse = requests.get(0).getResponse();
	if (oFF.notNull(scpResponse))
	{
		inaResponse = this.convertToInA(inARequestParser, converter, scpResponse);
		this.copyAllMessages(converter);
	}
	else
	{
		this.addError(oFF.ErrorCodes.PARSER_ERROR, "Response from SAP Cloud Platform Open Connetors could not be read");
	}
	if (oFF.isNull(inaResponse))
	{
		inaResponse = converter.createErrorResponse(this.getErrors());
	}
	oFF.XObjectExt.release(converter);
	return oFF.InAProcessorResult.create(inaResponse);
};
oFF.ProcessorSCP.prototype.replacePathVariables = function(entityPath, variables)
{
	let path = entityPath;
	while (oFF.XString.containsString(path, "{") && oFF.XString.containsString(path, "}"))
	{
		let varStart = oFF.XString.indexOf(path, "{");
		let varEnd = oFF.XString.indexOf(path, "}") + 1;
		let variablePlaceholder = oFF.XString.substring(path, varStart, varEnd);
		let variableName = oFF.XStringUtils.stripChars(variablePlaceholder, 1);
		if (!variables.containsKey(variableName))
		{
			return oFF.XString.substring(path, 0, varStart - 1);
		}
		path = oFF.XString.replace(path, variablePlaceholder, variables.getByKey(variableName));
		variables.remove(variableName);
	}
	return path;
};

oFF.SCPMetadataBuilder = function() {};
oFF.SCPMetadataBuilder.prototype = new oFF.InAMetadataBuilder();
oFF.SCPMetadataBuilder.prototype._ff_c = "SCPMetadataBuilder";

oFF.SCPMetadataBuilder.create = function()
{
	let factory = new oFF.SCPMetadataBuilder();
	factory.setupSessionContext(null);
	return factory;
};
oFF.SCPMetadataBuilder.prototype.addVariables = function(inaCube, parameters, forceOptional)
{
	if (!oFF.PrUtils.isListEmpty(parameters))
	{
		let inaVariables = inaCube.getListByKey("Variables");
		if (oFF.isNull(inaVariables))
		{
			inaVariables = inaCube.putNewList("Variables");
		}
		let size = parameters.size();
		for (let i = 0; i < size; i++)
		{
			let parameter = parameters.getStructureAt(i);
			let _in = parameter.getStringByKey(oFF.ProcessorSCPConstants.PARAMETER_IN);
			if (oFF.XString.isEqual(_in, oFF.ProcessorSCPConstants.PARAMETER_IN_QUERY) || oFF.XString.isEqual(_in, oFF.ProcessorSCPConstants.PARAMETER_IN_PATH))
			{
				let name = parameter.getStringByKey(oFF.ProcessorSCPConstants.PARAMETER_NAME);
				let description = parameter.getStringByKey(oFF.ProcessorSCPConstants.PARAMETER_DESCRIPTION);
				let required = !forceOptional && parameter.getBooleanByKey(oFF.ProcessorSCPConstants.PARAMETER_REQUIRED);
				let type = this.mapParameterType(parameter.getStringByKey(oFF.ProcessorSCPConstants.PARAMETER_TYPE));
				inaVariables.add(this.createVariable(name, description, required, type, null));
			}
		}
	}
};
oFF.SCPMetadataBuilder.prototype.createCatalogServiceDimensionProperty = function(name)
{
	return oFF.SCPMdProperty.createWithFilterFlag(name, name, "String", true);
};
oFF.SCPMetadataBuilder.prototype.createMetadata = function(docsResponse, metadataResponse, metadataRequest)
{
	if (oFF.isNull(docsResponse) || oFF.isNull(metadataResponse) || !docsResponse.isStructure() || !metadataResponse.isStructure())
	{
		this.addError(oFF.ErrorCodes.PARSER_ERROR, "Docs/Metadata response could not be read");
		return null;
	}
	let inaRequestMetadata = metadataRequest.getStructureByKey("Metadata");
	let inaStructure = oFF.PrFactory.createStructure();
	let inaCube = inaStructure.putNewStructure("Cube");
	inaCube.put("Capabilities", oFF.PrUtils.createDeepCopy(oFF.PrUtils.getListProperty(inaRequestMetadata, "Capabilities")));
	inaCube.put("DataSource", oFF.PrUtils.createDeepCopy(oFF.PrUtils.getStructureProperty(inaRequestMetadata, "DataSource")));
	this.extendByDocumentation(inaCube, docsResponse);
	this.extendByMetadata(inaCube, metadataResponse);
	return inaStructure;
};
oFF.SCPMetadataBuilder.prototype.extendByDocumentation = function(inaCube, docsResponse)
{
	let paths = docsResponse.asStructure().getStructureByKey(oFF.ProcessorSCPConstants.PATHS);
	let sortedAPIs = this.getSortedAPIs(paths);
	let mainPathData = null;
	let currentServicePath = null;
	let optionalServiceParameters = null;
	let list = sortedAPIs.getKeysAsReadOnlyList();
	let size = list.size();
	for (let i = 0; i < size; i++)
	{
		let path = list.get(i);
		let data = sortedAPIs.getByKey(path);
		if (oFF.isNull(mainPathData))
		{
			mainPathData = data;
			currentServicePath = path;
			optionalServiceParameters = oFF.PrFactory.createList();
		}
		else if (this.extendsPathWithParameter(currentServicePath, path))
		{
			currentServicePath = path;
			optionalServiceParameters.addAll(data.getListByKey(oFF.ProcessorSCPConstants.PARAMETERS));
		}
	}
	if (oFF.isNull(mainPathData))
	{
		this.addError(oFF.ErrorCodes.PARSER_ERROR, "No valid path value found in documentation response");
		return;
	}
	inaCube.getStructureByKey("DataSource").putString("PackageName", currentServicePath);
	inaCube.putStringNotNullAndNotEmpty("Name", mainPathData.getStringByKey(oFF.ProcessorSCPConstants.OPERATION_ID));
	inaCube.putStringNotNullAndNotEmpty("Description", mainPathData.getStringByKey(oFF.ProcessorSCPConstants.SUMMARY));
	this.addVariables(inaCube, mainPathData.getListByKey(oFF.ProcessorSCPConstants.PARAMETERS), false);
	this.addVariables(inaCube, optionalServiceParameters, true);
};
oFF.SCPMetadataBuilder.prototype.extendByMetadata = function(inaCube, metadataResponse)
{
	let inaDimensions = inaCube.putNewList("Dimensions");
	let fields = metadataResponse.asStructure().getListByKey(oFF.ProcessorSCPConstants.FIELDS);
	if (oFF.PrUtils.isListEmpty(fields))
	{
		return;
	}
	let size = fields.size();
	for (let i = 0; i < size; i++)
	{
		let field = fields.getStructureAt(i);
		let name = this.getValue(field, oFF.ProcessorSCPConstants.FIELD_PATH, oFF.ProcessorSCPConstants.FIELD_VENDOR_PATH);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(name))
		{
			let description = oFF.PrUtils.getStringValueProperty(field, oFF.ProcessorSCPConstants.FIELD_DISPLAY_NAME, name);
			let fieldType = this.getValue(field, oFF.ProcessorSCPConstants.FIELD_TYPE, oFF.ProcessorSCPConstants.FIELD_NATIVE_TYPE);
			let type = this.mapDimensionDataType(fieldType);
			let isMeasure = oFF.XString.isEqual(fieldType, oFF.ProcessorSCPConstants.FIELD_TYPE_NUMBER) && !oFF.XString.endsWith(name, "[*]");
			let metadataProperty = oFF.SCPMdProperty.create(this.removeListIndicator(name), this.removeListIndicator(description), type);
			let dimension = isMeasure ? this.createMeasure(metadataProperty) : this.createDimension(metadataProperty, null);
			if (!inaDimensions.contains(dimension))
			{
				inaDimensions.add(dimension);
			}
		}
	}
};
oFF.SCPMetadataBuilder.prototype.extendsPathWithParameter = function(currentPath, newPath)
{
	if (oFF.XString.startsWith(newPath, currentPath))
	{
		let additionalPath = oFF.XString.substring(newPath, oFF.XString.size(currentPath), oFF.XString.size(newPath));
		return oFF.XString.containsString(additionalPath, "{");
	}
	return false;
};
oFF.SCPMetadataBuilder.prototype.getSortedAPIs = function(paths)
{
	let pathList = oFF.XList.createWithList(oFF.PrUtils.getKeysAsReadOnlyList(paths, null));
	pathList.sortByDirection(oFF.XSortDirection.ASCENDING);
	let apis = oFF.XLinkedHashMapByString.create();
	let size = pathList.size();
	for (let i = 0; i < size; i++)
	{
		let pathValue = pathList.get(i);
		let path = paths.getStructureByKey(pathValue);
		apis.putIfNotNull(pathValue, oFF.PrUtils.getStructureProperty(path, oFF.ProcessorSCPConstants.GET));
	}
	return apis;
};
oFF.SCPMetadataBuilder.prototype.getValue = function(structure, key1, key2)
{
	let value = structure.getStringByKey(key1);
	return oFF.XStringUtils.isNotNullAndNotEmpty(value) ? value : structure.getStringByKey(key2);
};
oFF.SCPMetadataBuilder.prototype.mapDimensionDataType = function(type)
{
	if (oFF.XString.isEqual(type, oFF.ProcessorSCPConstants.FIELD_TYPE_STRING))
	{
		return "String";
	}
	if (oFF.XString.isEqual(type, oFF.ProcessorSCPConstants.FIELD_TYPE_NUMBER))
	{
		return "DecimalFloat";
	}
	if (oFF.XString.isEqual(type, oFF.ProcessorSCPConstants.FIELD_TYPE_DATE))
	{
		return "Date";
	}
	if (oFF.XString.isEqual(type, oFF.ProcessorSCPConstants.FIELD_TYPE_DATE_TIME))
	{
		return "Timestamp";
	}
	if (oFF.XString.isEqual(type, oFF.ProcessorSCPConstants.FIELD_TYPE_BOOLEAN))
	{
		return "Bool";
	}
	return "String";
};
oFF.SCPMetadataBuilder.prototype.mapParameterType = function(type)
{
	if (oFF.XString.isEqual(type, oFF.ProcessorSCPConstants.PARAMETER_TYPE_INTEGER))
	{
		return "Int";
	}
	else if (oFF.XString.isEqual(type, oFF.ProcessorSCPConstants.PARAMETER_TYPE_BOOLEAN))
	{
		return "Bool";
	}
	return "String";
};
oFF.SCPMetadataBuilder.prototype.removeListIndicator = function(value)
{
	return oFF.XString.replace(value, "[*]", "");
};

oFF.RpcVirtualFunction = function() {};
oFF.RpcVirtualFunction.prototype = new oFF.DfRpcFunction();
oFF.RpcVirtualFunction.prototype._ff_c = "RpcVirtualFunction";

oFF.RpcVirtualFunction.create = function(connection, functionUri, processor, protocolType)
{
	let rpcFunction = new oFF.RpcVirtualFunction();
	rpcFunction.setupFunction(connection, functionUri);
	rpcFunction.m_processor = oFF.XWeakReferenceUtil.getWeakRef(processor);
	rpcFunction.m_connectionContainer = oFF.XWeakReferenceUtil.getWeakRef(connection);
	return rpcFunction;
};
oFF.RpcVirtualFunction.prototype.m_connectionContainer = null;
oFF.RpcVirtualFunction.prototype.m_processor = null;
oFF.RpcVirtualFunction.prototype.allRequestsFinished = function(requests)
{
	let size = requests.size();
	for (let i = 0; i < size; i++)
	{
		if (!requests.get(i).hasResponse())
		{
			return false;
		}
	}
	return true;
};
oFF.RpcVirtualFunction.prototype.executeFunctions = function(syncType, processName, inaRequestStructure, requests)
{
	if (oFF.notNull(requests))
	{
		let size = requests.size();
		for (let i = 0; i < size; i++)
		{
			let request = requests.get(i);
			let customIdentifier = oFF.VirtualRpcIdentifier.create(processName, inaRequestStructure, request, requests);
			let resultsetFunction = this.newRpcFunction(request.getUri());
			resultsetFunction.getRpcRequest().setAcceptContentType(this.getAcceptContentType(request.getAcceptContentType()));
			resultsetFunction.processFunctionExecution(syncType, this, customIdentifier);
		}
	}
	else
	{
		let response = oFF.RpcResponse.create(null);
		this.onFunctionExecuted(oFF.ExtResult.create(response, null), response, oFF.VirtualRpcIdentifier.create(processName, inaRequestStructure, null, null));
	}
};
oFF.RpcVirtualFunction.prototype.getAcceptContentType = function(preferedContentType)
{
	if (oFF.notNull(preferedContentType))
	{
		return preferedContentType;
	}
	let contentType = oFF.ContentType.lookupByMimeType(this.getSystemDescription().getProperties().getByKey(oFF.ConnectionParameters.CONTENT_TYPE));
	if (oFF.notNull(contentType))
	{
		return contentType;
	}
	return oFF.ContentType.APPLICATION_JSON;
};
oFF.RpcVirtualFunction.prototype.getApplication = function()
{
	return this.getProcess().getApplication();
};
oFF.RpcVirtualFunction.prototype.getConnectionContainer = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_connectionContainer);
};
oFF.RpcVirtualFunction.prototype.getProcess = function()
{
	return this.getSession();
};
oFF.RpcVirtualFunction.prototype.getProcessor = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_processor);
};
oFF.RpcVirtualFunction.prototype.getSystemDescription = function()
{
	return this.getConnectionContainer().getSystemDescription();
};
oFF.RpcVirtualFunction.prototype.getSystemName = function()
{
	return this.m_rpcRequest.getConnectionInfo().getSystemName();
};
oFF.RpcVirtualFunction.prototype.ignoreRequest = function(path, requestStructure)
{
	if (this.isLogonOrLogoffPath(path))
	{
		return true;
	}
	let analytics = oFF.PrUtils.getStructureProperty(requestStructure, "Analytics");
	if (oFF.notNull(analytics))
	{
		let actions = oFF.PrUtils.getListProperty(analytics, "Actions");
		return oFF.PrUtils.getStructureWithKeyValuePair(actions, "Type", "Close") !== null;
	}
	return false;
};
oFF.RpcVirtualFunction.prototype.isGetServerInfoPath = function(path)
{
	return oFF.XString.isEqual(path, oFF.SystemType.VIRTUAL_INA_ODATA.getServerInfoPath()) || oFF.XString.isEqual(path, oFF.SystemType.VIRTUAL_INA_SCP.getServerInfoPath()) || oFF.XString.isEqual(path, oFF.SystemType.VIRTUAL_INA_GSA.getServerInfoPath());
};
oFF.RpcVirtualFunction.prototype.isInaPath = function(path)
{
	return oFF.XString.isEqual(path, oFF.SystemType.VIRTUAL_INA_ODATA.getInAPath()) || oFF.XString.isEqual(path, oFF.SystemType.VIRTUAL_INA_SCP.getInAPath()) || oFF.XString.isEqual(path, oFF.SystemType.VIRTUAL_INA_GSA.getInAPath());
};
oFF.RpcVirtualFunction.prototype.isLogonOrLogoffPath = function(path)
{
	return oFF.XString.isEqual(path, oFF.SystemType.VIRTUAL_INA_ODATA.getLogonPath()) || oFF.XString.isEqual(path, oFF.SystemType.VIRTUAL_INA_ODATA.getLogoffPath()) || oFF.XString.isEqual(path, oFF.SystemType.VIRTUAL_INA_SCP.getLogonPath()) || oFF.XString.isEqual(path, oFF.SystemType.VIRTUAL_INA_SCP.getLogoffPath()) || oFF.XString.isEqual(path, oFF.SystemType.VIRTUAL_INA_GSA.getLogonPath()) || oFF.XString.isEqual(path, oFF.SystemType.VIRTUAL_INA_GSA.getLogoffPath());
};
oFF.RpcVirtualFunction.prototype.newRpcFunction = function(uri)
{
	let rpcUri = uri;
	let uriPath = uri.getPath();
	let connectionContainer = this.getConnectionContainer();
	let systemDescription = connectionContainer.getSystemDescription();
	let sysPath = systemDescription.getPath();
	if (oFF.notNull(sysPath) && oFF.XString.startsWith(uriPath, sysPath))
	{
		let n = oFF.XString.size(sysPath);
		let newPath = oFF.XString.substring(uriPath, n, -1);
		let newUri = oFF.XUri.createFromOther(uri);
		newUri.setPath(newPath);
		rpcUri = newUri;
	}
	let rpcFunction = oFF.RpcHttpFunction.create(connectionContainer, rpcUri);
	let request = rpcFunction.getRpcRequest();
	request.setMethod(oFF.HttpRequestMethod.HTTP_GET);
	return rpcFunction;
};
oFF.RpcVirtualFunction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	let identifier = customIdentifier;
	if (oFF.isNull(identifier) || this.hasErrors())
	{
		oFF.XObjectExt.release(identifier);
		this.endSync();
		return;
	}
	let request = identifier.getRequest();
	let allRequests = identifier.getAllRequests();
	if (oFF.notNull(request))
	{
		request.setResponse(response.getRootElementGeneric(), response.getRootElementAsString());
		if (!this.allRequestsFinished(allRequests))
		{
			oFF.XObjectExt.release(identifier);
			return;
		}
	}
	let inaResponse = null;
	let processor = this.getProcessor();
	if (oFF.XString.isEqual(identifier.getProcessName(), "Metadata"))
	{
		let metadataResponse = processor.processMetadata(allRequests, identifier.getRequestStructure());
		if (oFF.notNull(metadataResponse))
		{
			inaResponse = metadataResponse.getStructure();
			let contentType = metadataResponse.getSupportedContentType();
			if (oFF.notNull(contentType))
			{
				this.getSystemDescription().setProperty(oFF.ConnectionParameters.CONTENT_TYPE, contentType.getName());
			}
		}
	}
	else if (oFF.XString.isEqual(identifier.getProcessName(), "Analytics"))
	{
		inaResponse = processor.processResultset(allRequests, identifier.getRequestStructure()).getStructure();
	}
	this.m_rpcResponse.setRootElement(inaResponse, null);
	this.setData(this.m_rpcResponse);
	this.copyAllMessages(processor);
	oFF.XObjectExt.release(identifier);
	oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(allRequests);
	processor.clearMessages();
	this.endSync();
};
oFF.RpcVirtualFunction.prototype.processAnalytics = function(inaRequestStructure, syncType)
{
	let processor = this.getProcessor();
	if (oFF.isNull(processor))
	{
		this.addError(oFF.ErrorCodes.INVALID_STATE, "No processor provided!");
		this.endSync();
		return;
	}
	let requests = processor.getResultsetUrl(this.getSystemName(), inaRequestStructure);
	this.executeFunctions(syncType, "Analytics", inaRequestStructure, requests);
};
oFF.RpcVirtualFunction.prototype.processGetServerInfo = function()
{
	let processor = this.getProcessor();
	if (oFF.isNull(processor))
	{
		this.addError(oFF.ErrorCodes.INVALID_STATE, "No processor provided!");
	}
	else
	{
		let getServerInfoResponse = processor.processCapabilities(this.getSystemName());
		this.m_rpcResponse.setRootElement(getServerInfoResponse, null);
		this.setData(this.m_rpcResponse);
		this.addAllMessages(this.getProcessor());
	}
	this.endSync();
};
oFF.RpcVirtualFunction.prototype.processMetadata = function(inaRequestStructure, syncType)
{
	let processor = this.getProcessor();
	if (oFF.isNull(processor))
	{
		this.addError(oFF.ErrorCodes.INVALID_STATE, "No processor provided!");
		this.endSync();
		return;
	}
	let requests = processor.getMetadataUrl(this.getSystemName(), inaRequestStructure);
	this.executeFunctions(syncType, "Metadata", inaRequestStructure, requests);
};
oFF.RpcVirtualFunction.prototype.processSynchronization = function(syncType)
{
	let path = this.m_rpcRequest.getUri().getPath();
	if (this.isGetServerInfoPath(path))
	{
		this.processGetServerInfo();
		return true;
	}
	let requestStructure = this.m_rpcRequest.getRequestStructure();
	if (this.ignoreRequest(path, requestStructure))
	{
		this.endSync();
		return true;
	}
	if (this.isInaPath(path))
	{
		if (requestStructure.containsKey("Analytics"))
		{
			this.processAnalytics(requestStructure, syncType);
			return true;
		}
		if (requestStructure.containsKey("Metadata"))
		{
			this.processMetadata(requestStructure, syncType);
			return true;
		}
		this.addErrorExt(oFF.OriginLayer.APPLICATION, oFF.ErrorCodes.INVALID_URL, "Unexpected root element !", this.m_rpcRequest);
		this.endSync();
		return true;
	}
	this.addErrorExt(oFF.OriginLayer.APPLICATION, oFF.ErrorCodes.INVALID_URL, oFF.XStringUtils.concatenate3("Unexpected path '", path, "'!"), this.m_rpcRequest);
	this.endSync();
	return true;
};
oFF.RpcVirtualFunction.prototype.releaseObjectInternal = function()
{
	this.m_processor = oFF.XObjectExt.release(this.m_processor);
	this.m_connectionContainer = oFF.XObjectExt.release(this.m_connectionContainer);
	oFF.DfRpcFunction.prototype.releaseObjectInternal.call( this );
};

oFF.GSAResultSetUrl = function() {};
oFF.GSAResultSetUrl.prototype = new oFF.XUri();
oFF.GSAResultSetUrl.prototype._ff_c = "GSAResultSetUrl";

oFF.GSAResultSetUrl.createUrl = function(baseUrl, entity, inaRequestStructure)
{
	let url = new oFF.GSAResultSetUrl();
	url.setupGenericServiceUrl(baseUrl, entity, inaRequestStructure);
	return url;
};
oFF.GSAResultSetUrl.prototype.getEntityPath = function(entity)
{
	let path = this.getPath();
	let pathEndsWithSeparator = oFF.XString.endsWith(path, "/");
	let entityStartsWithSeparator = oFF.XString.startsWith(entity, "/");
	if (pathEndsWithSeparator && entityStartsWithSeparator)
	{
		return oFF.XStringUtils.concatenate2(oFF.XStringUtils.stripRight(path, 1), entity);
	}
	if (!pathEndsWithSeparator && !entityStartsWithSeparator)
	{
		return oFF.XStringUtils.concatenate3(path, "/", entity);
	}
	return oFF.XStringUtils.concatenate2(path, entity);
};
oFF.GSAResultSetUrl.prototype.getVariableValue = function(parameter, variableValues, name)
{
	if (parameter.getBooleanByKeyExt(oFF.ProcessorGSAConstants.IS_VARIABLE, true))
	{
		return variableValues.getByKey(name);
	}
	let element = parameter.getByKey(oFF.ProcessorGSAConstants.DEFAULT_VALUE);
	if (oFF.isNull(element))
	{
		return null;
	}
	return element.isString() ? element.asString().getString() : element.getStringRepresentation();
};
oFF.GSAResultSetUrl.prototype.setupGenericServiceUrl = function(baseUrl, entity, inaRequestStructure)
{
	this.setup();
	this.setUrl(baseUrl);
	this.setPath(this.getEntityPath(entity));
	let requestParser = oFF.InARequestParser.create(inaRequestStructure);
	let variableValues = requestParser.getVariableValues();
	let serviceDescription = requestParser.getServiceDescription();
	let parameters = serviceDescription.getListByKey(oFF.ProcessorGSAConstants.PARAMETERS);
	let size = oFF.PrUtils.getListSize(parameters, 0);
	for (let i = 0; i < size; i++)
	{
		let parameter = parameters.getStructureAt(i);
		let name = parameter.getStringByKey(oFF.ProcessorGSAConstants.NAME);
		let value = this.getVariableValue(parameter, variableValues, name);
		let type = parameter.getStringByKey(oFF.ProcessorGSAConstants.TYPE);
		if (oFF.XStringUtils.isNullOrEmpty(name) || oFF.XStringUtils.isNullOrEmpty(value) || oFF.XStringUtils.isNullOrEmpty(type))
		{
			continue;
		}
		if (oFF.XString.isEqual(type, oFF.ProcessorGSAConstants.TYPE_QUERY))
		{
			this.addQueryElement(name, value);
		}
		else if (oFF.XString.isEqual(type, oFF.ProcessorGSAConstants.TYPE_PATH))
		{
			this.setPath(oFF.XString.replace(this.getPath(), oFF.XStringUtils.concatenate3("{", name, "}"), value));
		}
	}
	oFF.XObjectExt.release(requestParser);
};

oFF.ODataResultSetUrl = function() {};
oFF.ODataResultSetUrl.prototype = new oFF.XUri();
oFF.ODataResultSetUrl.prototype._ff_c = "ODataResultSetUrl";

oFF.ODataResultSetUrl.addConcatFilterElement = function(filter, isExcluding)
{
	if (filter.length() > 0)
	{
		filter.append(oFF.ProcessorODataConstants.URI_FILTER_SPACE).append(isExcluding ? oFF.ProcessorODataConstants.URI_FILTER_AND : oFF.ProcessorODataConstants.URI_FILTER_OR).append(oFF.ProcessorODataConstants.URI_FILTER_SPACE);
	}
};
oFF.ODataResultSetUrl.createUrl = function(baseUrl, entity, inaRequestStructure)
{
	let url = new oFF.ODataResultSetUrl();
	url.setup();
	url.setUrl(baseUrl);
	url.setupPath(entity);
	let inARequestParser = oFF.InARequestParser.create(inaRequestStructure);
	url.addParameters(inARequestParser);
	oFF.XObjectExt.release(inARequestParser);
	return url;
};
oFF.ODataResultSetUrl.prototype.addDimensionAttributesToSelection = function(selection, dimension)
{
	let attributes = oFF.PrUtils.getListProperty(dimension, "Attributes");
	if (!oFF.PrUtils.isListEmpty(attributes))
	{
		let dimName = dimension.getStringByKey("Name");
		for (let i = 0; i < attributes.size(); i++)
		{
			let attribute = attributes.getStructureAt(i);
			let attributeName = attribute.getStringByKey("Name");
			let isKeyAttribute = oFF.XString.isEqual(dimName, attributeName);
			let obtainability = attribute.getStringByKeyExt("Obtainability", "Always");
			if (isKeyAttribute || oFF.XString.isEqual(obtainability, "Always") && !oFF.XString.startsWith(attributeName, oFF.XStringUtils.concatenate2(dimName, "/")))
			{
				oFF.XCollectionUtils.addIfNotPresent(selection, attributeName);
			}
		}
	}
};
oFF.ODataResultSetUrl.prototype.addExpand = function(selection)
{
	let expand = oFF.XList.create();
	let selectionCount = selection.size();
	for (let i = 0; i < selectionCount; i++)
	{
		let dimensionName = selection.get(i);
		let lastEntitySeperator = oFF.XString.lastIndexOf(dimensionName, "/");
		if (lastEntitySeperator > -1)
		{
			oFF.XCollectionUtils.addIfNotPresent(expand, oFF.XString.substring(dimensionName, 0, lastEntitySeperator));
		}
	}
	if (!expand.isEmpty())
	{
		this.addQueryElement(oFF.ProcessorODataConstants.URI_PARAM_EXPAND, oFF.XCollectionUtils.join(expand, ","));
	}
};
oFF.ODataResultSetUrl.prototype.addFilter = function(inARequestParser)
{
	let selection = inARequestParser.getFilterSelection();
	let filter = this.getFilterForSelection(selection, inARequestParser);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(filter))
	{
		this.addQueryElement(oFF.ProcessorODataConstants.URI_PARAM_FILTER, filter);
	}
};
oFF.ODataResultSetUrl.prototype.addMembersToSelection = function(selection, inARequestParser)
{
	let members = inARequestParser.getStructureMembers();
	let membersSize = members.size();
	for (let i = 0; i < membersSize; i++)
	{
		let member = members.get(i);
		oFF.XCollectionUtils.addIfNotPresent(selection, inARequestParser.getStructureMemberName(member));
		oFF.XCollectionUtils.addIfNotPresent(selection, member.getStringByKey("UnitName"));
		oFF.XCollectionUtils.addIfNotPresent(selection, member.getStringByKey("UnitTextName"));
	}
};
oFF.ODataResultSetUrl.prototype.addOrder = function(inARequestParser)
{
	let inaSortList = inARequestParser.getSort();
	if (!oFF.PrUtils.isListEmpty(inaSortList))
	{
		let orderValues = oFF.XList.create();
		for (let i = 0; i < inaSortList.size(); i++)
		{
			let inaSort = inaSortList.getStructureAt(i);
			let direction = inaSort.getStringByKey("Direction");
			let values = this.getSortValues(inaSort, inARequestParser.getAllDimensions());
			if (values.hasElements())
			{
				for (let k = 0; k < values.size(); k++)
				{
					if (oFF.XString.isEqual(direction, "Asc") || oFF.XString.isEqual(direction, "Desc"))
					{
						orderValues.add(oFF.XStringUtils.concatenate3(values.get(k), " ", oFF.XString.toLowerCase(direction)));
					}
					else
					{
						orderValues.add(values.get(k));
					}
				}
			}
		}
		if (orderValues.hasElements())
		{
			this.addQueryElement(oFF.ProcessorODataConstants.URI_PARAM_ORDERBY, oFF.XCollectionUtils.join(orderValues, ","));
		}
	}
};
oFF.ODataResultSetUrl.prototype.addPaging = function(inARequestParser)
{
	let subsetDescription = inARequestParser.getSubsetDescription();
	if (oFF.notNull(subsetDescription))
	{
		if (!this.addPagingQueryElements(subsetDescription, "RowFrom", "RowTo"))
		{
			this.addPagingQueryElements(subsetDescription, "ColumnFrom", "ColumnTo");
		}
	}
};
oFF.ODataResultSetUrl.prototype.addPagingQueryElements = function(subsetDescription, paramFrom, paramTo)
{
	let from = subsetDescription.getIntegerByKeyExt(paramFrom, 0);
	let to = subsetDescription.getIntegerByKeyExt(paramTo, -1);
	if (from > 0 || to > 0)
	{
		if (from > 0)
		{
			this.addQueryElement(oFF.ProcessorODataConstants.URI_PARAM_SKIP, oFF.XInteger.convertToString(from));
		}
		if (to > 0)
		{
			this.addQueryElement(oFF.ProcessorODataConstants.URI_PARAM_TOP, oFF.XInteger.convertToString(to - from));
		}
		return true;
	}
	return false;
};
oFF.ODataResultSetUrl.prototype.addParameters = function(inARequestParser)
{
	if (!inARequestParser.isValid() || oFF.PrUtils.isListEmpty(inARequestParser.getAllDimensions()) || !this.addSelection(inARequestParser))
	{
		this.addQueryElement(oFF.ProcessorODataConstants.URI_PARAM_TOP, "0");
		return;
	}
	this.addPaging(inARequestParser);
	this.addFilter(inARequestParser);
	this.addOrder(inARequestParser);
};
oFF.ODataResultSetUrl.prototype.addSelection = function(inARequestParser)
{
	let dimensions = inARequestParser.getAllDimensions();
	let selection = oFF.XList.create();
	let size = dimensions.size();
	for (let i = 0; i < size; i++)
	{
		let dimension = dimensions.getStructureAt(i);
		let axis = oFF.PrUtils.getStringValueProperty(dimension, "Axis", "None");
		if (!oFF.XString.isEqual(axis, "Rows") && !oFF.XString.isEqual(axis, "Columns"))
		{
			continue;
		}
		let members = oFF.PrUtils.getListProperty(dimension, "Members");
		if (!oFF.PrUtils.isListEmpty(members))
		{
			this.addMembersToSelection(selection, inARequestParser);
		}
		else
		{
			this.addDimensionAttributesToSelection(selection, dimension);
		}
	}
	if (selection.isEmpty())
	{
		return false;
	}
	this.addQueryElement(oFF.ProcessorODataConstants.URI_PARAM_SELECT, oFF.XCollectionUtils.join(selection, ","));
	this.addExpand(selection);
	return true;
};
oFF.ODataResultSetUrl.prototype.getFilterForOperator = function(operator, inARequestParser)
{
	let filter = oFF.XStringBuffer.create();
	let code = oFF.XString.toLowerCase(operator.getStringByKey("Code"));
	let subSelections = oFF.PrUtils.getListProperty(operator, "SubSelections");
	if (oFF.XStringUtils.isNotNullAndNotEmpty(code) && !oFF.PrUtils.isListEmpty(subSelections))
	{
		for (let i = 0; i < subSelections.size(); i++)
		{
			let selectionFilter = this.getFilterForSelection(subSelections.getStructureAt(i), inARequestParser);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(selectionFilter))
			{
				if (filter.length() > 0)
				{
					filter.append(oFF.ProcessorODataConstants.URI_FILTER_SPACE).append(code).append(oFF.ProcessorODataConstants.URI_FILTER_SPACE);
				}
				filter.append(oFF.ProcessorODataConstants.URI_FILTER_BRACKET_OPEN).append(selectionFilter).append(oFF.ProcessorODataConstants.URI_FILTER_BRACKET_CLOSE);
			}
		}
	}
	return filter.toString();
};
oFF.ODataResultSetUrl.prototype.getFilterForSelection = function(selection, inARequestParser)
{
	let operator = oFF.PrUtils.getStructureProperty(selection, "Operator");
	if (oFF.notNull(operator))
	{
		return this.getFilterForOperator(operator, inARequestParser);
	}
	let filter = oFF.XStringBuffer.create();
	let operand = oFF.PrUtils.getStructureProperty(selection, "SetOperand");
	let fieldName = oFF.PrUtils.getStringValueProperty(operand, "FieldName", null);
	let elements = oFF.PrUtils.getListProperty(operand, "Elements");
	let isMeasureFilter = oFF.XString.isEqual(fieldName, oFF.ProcessorConstants.CUSTOM_DIM_KEY);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(fieldName) && !isMeasureFilter && !oFF.PrUtils.isListEmpty(elements))
	{
		let fieldDisplayFormat = inARequestParser.getDisplayFormat(null, fieldName);
		for (let i = 0; i < elements.size(); i++)
		{
			let element = elements.getStructureAt(i);
			let low = this.mapValue(element.getByKey("Low"), fieldDisplayFormat);
			let high = this.mapValue(element.getByKey("High"), fieldDisplayFormat);
			let comparisonValue = element.getStringByKey("Comparison");
			let comparisonLow = this.mapComparisonOperatorForLowValue(comparisonValue);
			let comparisonHigh = this.mapComparisonOperatorForHighValue(comparisonValue);
			if (oFF.notNull(comparisonLow) && oFF.notNull(low))
			{
				let isExcludingFilter = this.isExcludingFilter(element, comparisonValue);
				oFF.ODataResultSetUrl.addConcatFilterElement(filter, isExcludingFilter);
				if (isExcludingFilter)
				{
					filter.append(oFF.ProcessorODataConstants.URI_FILTER_NOT);
					filter.append(oFF.ProcessorODataConstants.URI_FILTER_BRACKET_OPEN);
				}
				filter.append(fieldName).append(oFF.ProcessorODataConstants.URI_FILTER_SPACE);
				filter.append(comparisonLow).append(oFF.ProcessorODataConstants.URI_FILTER_SPACE);
				filter.append(low);
				if (oFF.notNull(comparisonHigh) && oFF.notNull(high))
				{
					filter.append(oFF.ProcessorODataConstants.URI_FILTER_SPACE).append(oFF.ProcessorODataConstants.URI_FILTER_AND).append(oFF.ProcessorODataConstants.URI_FILTER_SPACE);
					filter.append(fieldName).append(oFF.ProcessorODataConstants.URI_FILTER_SPACE);
					filter.append(comparisonHigh).append(oFF.ProcessorODataConstants.URI_FILTER_SPACE);
					filter.append(high);
				}
				if (isExcludingFilter)
				{
					filter.append(oFF.ProcessorODataConstants.URI_FILTER_BRACKET_CLOSE);
				}
			}
			else if (oFF.XString.isEqual(comparisonValue, "MATCH") && oFF.notNull(low))
			{
				oFF.ODataResultSetUrl.addConcatFilterElement(filter, false);
				let substringFilter = oFF.ProcessorODataConstants.URI_FILTER_SUBSTRING;
				substringFilter = oFF.XString.replace(substringFilter, "{0}", oFF.XString.replace(low, "*", ""));
				substringFilter = oFF.XString.replace(substringFilter, "{1}", fieldName);
				filter.append(substringFilter);
			}
		}
	}
	return filter.toString();
};
oFF.ODataResultSetUrl.prototype.getSortAttributeName = function(inaSort, dimensions)
{
	let dimensionName = inaSort.getStringByKey("Dimension");
	let searchForKey = oFF.XString.isEqual(inaSort.getStringByKey("SortType"), "MemberKey");
	for (let i = 0; i < dimensions.size(); i++)
	{
		let dimension = dimensions.getStructureAt(i);
		if (oFF.XString.isEqual(dimension.getStringByKey("Name"), dimensionName))
		{
			let attributes = oFF.PrUtils.getListProperty(dimension, "Attributes");
			if (oFF.notNull(attributes))
			{
				for (let k = 0; k < attributes.size(); k++)
				{
					let attributeName = attributes.getStructureAt(k).getStringByKey("Name");
					let isKeyAttribute = oFF.XString.isEqual(attributeName, dimensionName);
					if (searchForKey === isKeyAttribute)
					{
						return attributeName;
					}
				}
			}
		}
	}
	return null;
};
oFF.ODataResultSetUrl.prototype.getSortValues = function(inaSort, dimensions)
{
	let list = oFF.XList.create();
	let customSort = inaSort.getListByKey("CustomSort");
	if (!oFF.PrUtils.isListEmpty(customSort))
	{
		for (let i = 0; i < customSort.size(); i++)
		{
			list.add(customSort.getStringAt(i));
		}
	}
	else if (inaSort.hasStringByKey("MeasureName"))
	{
		list.add(inaSort.getStringByKey("MeasureName"));
	}
	else
	{
		let sortAttributeName = this.getSortAttributeName(inaSort, dimensions);
		if (oFF.notNull(sortAttributeName))
		{
			list.add(sortAttributeName);
		}
	}
	return list;
};
oFF.ODataResultSetUrl.prototype.isBetweenExcludingFilter = function(comparison)
{
	return oFF.XString.isEqual(comparison, "BETWEEN_EXCLUDING") || oFF.XString.isEqual(comparison, "NOT_BETWEEN_EXCLUDING");
};
oFF.ODataResultSetUrl.prototype.isBetweenFilter = function(comparison)
{
	return oFF.XString.isEqual(comparison, "BETWEEN") || oFF.XString.isEqual(comparison, "NOTBETWEEN");
};
oFF.ODataResultSetUrl.prototype.isExcludingFilter = function(element, comparison)
{
	let isExcluding = element.getBooleanByKeyExt("IsExcluding", false);
	return isExcluding || oFF.XString.isEqual(comparison, "NOTBETWEEN") || oFF.XString.isEqual(comparison, "NOT_BETWEEN_EXCLUDING");
};
oFF.ODataResultSetUrl.prototype.mapComparisonOperatorForHighValue = function(comparison)
{
	if (this.isBetweenExcludingFilter(comparison))
	{
		return oFF.ProcessorODataConstants.URI_FILTER_LESS;
	}
	if (this.isBetweenFilter(comparison))
	{
		return oFF.ProcessorODataConstants.URI_FILTER_LESS_EQUAL;
	}
	return null;
};
oFF.ODataResultSetUrl.prototype.mapComparisonOperatorForLowValue = function(comparison)
{
	if (oFF.XString.isEqual(comparison, "="))
	{
		return oFF.ProcessorODataConstants.URI_FILTER_EQUAL;
	}
	if (oFF.XString.isEqual(comparison, "<>"))
	{
		return oFF.ProcessorODataConstants.URI_FILTER_NOT_EQUAL;
	}
	if (oFF.XString.isEqual(comparison, ">") || this.isBetweenExcludingFilter(comparison))
	{
		return oFF.ProcessorODataConstants.URI_FILTER_GREATER;
	}
	if (oFF.XString.isEqual(comparison, ">=") || this.isBetweenFilter(comparison))
	{
		return oFF.ProcessorODataConstants.URI_FILTER_GREATER_EQUAL;
	}
	if (oFF.XString.isEqual(comparison, "<"))
	{
		return oFF.ProcessorODataConstants.URI_FILTER_LESS;
	}
	if (oFF.XString.isEqual(comparison, "<="))
	{
		return oFF.ProcessorODataConstants.URI_FILTER_LESS_EQUAL;
	}
	return null;
};
oFF.ODataResultSetUrl.prototype.mapValue = function(element, fieldDisplayFormat)
{
	if (oFF.notNull(element))
	{
		if (element.isString())
		{
			if (oFF.XString.isEqual(fieldDisplayFormat, "Date") || oFF.XString.isEqual(fieldDisplayFormat, "DateTime"))
			{
				return oFF.ProcessorDateConverter.convertToEdmDateTime(element.asString().getString());
			}
			return oFF.XStringUtils.concatenate3(oFF.ProcessorODataConstants.URI_FILTER_INV_COMMA, element.asString().getString(), oFF.ProcessorODataConstants.URI_FILTER_INV_COMMA);
		}
		if (element.isNumeric() || element.isBoolean())
		{
			return element.getStringRepresentation();
		}
	}
	return null;
};
oFF.ODataResultSetUrl.prototype.setupPath = function(entity)
{
	let path = oFF.XStringBuffer.create();
	path.append(this.getPath());
	if (!oFF.XString.endsWith(path.toString(), oFF.XUri.PATH_SEPARATOR))
	{
		path.append(oFF.XUri.PATH_SEPARATOR);
	}
	path.append(entity);
	this.setPath(path.toString());
};

oFF.ProcessorODataV2 = function() {};
oFF.ProcessorODataV2.prototype = new oFF.ProcessorODataBase();
oFF.ProcessorODataV2.prototype._ff_c = "ProcessorODataV2";

oFF.ProcessorODataV2.create = function()
{
	let oDataV2 = new oFF.ProcessorODataV2();
	oDataV2.setupProcessor();
	oDataV2.setupODataV2();
	return oDataV2;
};
oFF.ProcessorODataV2.prototype.m_supportedCapabilities = null;
oFF.ProcessorODataV2.prototype.getCapabilities = function(systemName)
{
	let capabilities = oFF.XHashMapByString.create();
	this.addServiceWithCapabilities(capabilities, systemName, "Analytics", this.m_supportedCapabilities, oFF.XList.create());
	return capabilities;
};
oFF.ProcessorODataV2.prototype.getMaxSupportedODataVersion = function()
{
	return 2;
};
oFF.ProcessorODataV2.prototype.releaseObject = function()
{
	this.m_supportedCapabilities = oFF.XObjectExt.release(this.m_supportedCapabilities);
	oFF.ProcessorODataBase.prototype.releaseObject.call( this );
};
oFF.ProcessorODataV2.prototype.setupODataV2 = function()
{
	this.m_supportedCapabilities = oFF.XList.create();
	this.m_supportedCapabilities.add(oFF.InACapabilities.C012_ENCODED_RESULTSET);
	this.m_supportedCapabilities.add(oFF.InACapabilities.C048_MEMBER_VISIBILITY);
	this.m_supportedCapabilities.add(oFF.InACapabilities.C005_OBTAINABILITY);
	this.m_supportedCapabilities.add(oFF.InACapabilities.C003_CLIENT_CAPABILITIES);
	this.m_supportedCapabilities.add(oFF.InACapabilities.C004_METADATA_SERVICE);
	this.m_supportedCapabilities.add(oFF.InACapabilities.C007_RESPONSE_FIXED_ATTRIBUTE_SEQUENCE);
	this.m_supportedCapabilities.add(oFF.InACapabilities.C011_SET_OPERAND);
	this.m_supportedCapabilities.add(oFF.InACapabilities.C001_DATASOURCE_AT_SERVICE);
	this.m_supportedCapabilities.add(oFF.InACapabilities.C030_UNIQUE_ATTRIBUTE_NAMES);
	this.m_supportedCapabilities.add(oFF.InACapabilities.PAGING);
	this.m_supportedCapabilities.add(oFF.InACapabilities.C028_METADATA_DIMENSION_GROUP);
	this.m_supportedCapabilities.add(oFF.InACapabilities.C044_PAGING_TUPLE_COUNT_TOTAL);
	this.m_supportedCapabilities.add(oFF.InACapabilities.SORT_TYPE);
	this.m_supportedCapabilities.add(oFF.InACapabilities.C054_EXTENDED_SORT);
	this.m_supportedCapabilities.add(oFF.InACapabilities.C148_CUSTOM_MEASURE_SORTORDER);
	this.m_supportedCapabilities.add(oFF.InACapabilities.C013_COMPLEX_FILTERS);
	this.m_supportedCapabilities.add(oFF.InACapabilities.C083_ORDER_BY);
	this.m_supportedCapabilities.add(oFF.InACapabilities.C089_DIMENSION_FILTER);
	this.m_supportedCapabilities.add(oFF.InACapabilities.C091_CUBE_BLENDING);
	this.m_supportedCapabilities.add(oFF.InACapabilities.C093_REMOTE_BLENDING);
};

oFF.ProcessorModule = function() {};
oFF.ProcessorModule.prototype = new oFF.DfModule();
oFF.ProcessorModule.prototype._ff_c = "ProcessorModule";

oFF.ProcessorModule.s_module = null;
oFF.ProcessorModule.getInstance = function()
{
	if (oFF.isNull(oFF.ProcessorModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.ProtocolModule.getInstance());
		oFF.ProcessorModule.s_module = oFF.DfModule.startExt(new oFF.ProcessorModule());
		oFF.InAProcessorFunctionFactory.registerODataAsInA();
		oFF.InAProcessorFunctionFactory.registerSCPAsInA();
		oFF.InAProcessorFunctionFactory.registerGenericServiceAdapterAsInA();
		oFF.DfModule.stopExt(oFF.ProcessorModule.s_module);
	}
	return oFF.ProcessorModule.s_module;
};
oFF.ProcessorModule.prototype.getName = function()
{
	return "ff4050.processor";
};

oFF.ProcessorModule.getInstance();

return oFF;
} );