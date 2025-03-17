/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff0060.commons.ext"
],
function(oFF)
{
"use strict";

oFF.JsonFilteringSerializerFactory = function() {};
oFF.JsonFilteringSerializerFactory.prototype = new oFF.XObject();
oFF.JsonFilteringSerializerFactory.prototype._ff_c = "JsonFilteringSerializerFactory";

oFF.JsonFilteringSerializerFactory.s_activeFactory = null;
oFF.JsonFilteringSerializerFactory.newFilteringSerializer = function()
{
	return oFF.JsonFilteringSerializerFactory.s_activeFactory.newInstance();
};
oFF.JsonFilteringSerializerFactory.setActiveFactory = function(activeFactory)
{
	oFF.JsonFilteringSerializerFactory.s_activeFactory = activeFactory;
};
oFF.JsonFilteringSerializerFactory.staticSetup = function()
{
	oFF.JsonFilteringSerializerFactory.setActiveFactory(new oFF.JsonFilteringSerializerFactory());
};
oFF.JsonFilteringSerializerFactory.prototype.newInstance = function()
{
	return oFF.PrUniversalFilteringSerializer.create();
};

oFF.JsonParserErrorCode = {

	JSON_PARSER_ILLEGAL_STATE:2001,
	JSON_PARSER_ROOT_ERROR:2000
};

oFF.JsonParserGenericStackElement = function() {};
oFF.JsonParserGenericStackElement.prototype = new oFF.XObject();
oFF.JsonParserGenericStackElement.prototype._ff_c = "JsonParserGenericStackElement";

oFF.JsonParserGenericStackElement.create = function()
{
	let jsonLevelInfo = new oFF.JsonParserGenericStackElement();
	jsonLevelInfo.reset();
	return jsonLevelInfo;
};
oFF.JsonParserGenericStackElement.prototype.m_element = null;
oFF.JsonParserGenericStackElement.prototype.m_hasElements = false;
oFF.JsonParserGenericStackElement.prototype.m_isPreparedForNextElement = false;
oFF.JsonParserGenericStackElement.prototype.m_name = null;
oFF.JsonParserGenericStackElement.prototype.m_valueSet = false;
oFF.JsonParserGenericStackElement.prototype.addElement = function()
{
	if (this.m_hasElements === false)
	{
		if (this.m_isPreparedForNextElement)
		{
			return false;
		}
		this.m_hasElements = true;
		return true;
	}
	if (this.m_isPreparedForNextElement === false)
	{
		return false;
	}
	this.m_isPreparedForNextElement = false;
	return true;
};
oFF.JsonParserGenericStackElement.prototype.finishElements = function()
{
	if (this.m_isPreparedForNextElement)
	{
		return false;
	}
	return true;
};
oFF.JsonParserGenericStackElement.prototype.getElement = function()
{
	return this.m_element;
};
oFF.JsonParserGenericStackElement.prototype.getName = function()
{
	return this.m_name;
};
oFF.JsonParserGenericStackElement.prototype.isNameSet = function()
{
	return oFF.notNull(this.m_name);
};
oFF.JsonParserGenericStackElement.prototype.isValueSet = function()
{
	return this.m_valueSet;
};
oFF.JsonParserGenericStackElement.prototype.nextElement = function()
{
	if (this.m_isPreparedForNextElement)
	{
		return false;
	}
	if (this.m_hasElements === false)
	{
		return false;
	}
	this.m_isPreparedForNextElement = true;
	return true;
};
oFF.JsonParserGenericStackElement.prototype.reset = function()
{
	this.m_element = null;
	this.m_name = null;
	this.m_valueSet = false;
	this.m_hasElements = false;
	this.m_isPreparedForNextElement = false;
};
oFF.JsonParserGenericStackElement.prototype.setElement = function(element)
{
	this.m_element = element;
};
oFF.JsonParserGenericStackElement.prototype.setName = function(name)
{
	this.m_name = name;
};
oFF.JsonParserGenericStackElement.prototype.setValueSet = function(valueSet)
{
	this.m_valueSet = valueSet;
};

oFF.XJson = function() {};
oFF.XJson.prototype = new oFF.XObject();
oFF.XJson.prototype._ff_c = "XJson";

oFF.XJson.s_extractor = null;
oFF.XJson.extractJsonContent = function(jsonObject)
{
	let element = null;
	if (oFF.notNull(jsonObject))
	{
		if (oFF.notNull(oFF.XJson.s_extractor))
		{
			element = oFF.XJson.s_extractor.extractJsonContent(jsonObject);
		}
		else
		{
			let xjson = jsonObject;
			element = xjson.getElement();
		}
	}
	return element;
};
oFF.XJson.setJsonExtractor = function(extractor)
{
	oFF.XJson.s_extractor = extractor;
};
oFF.XJson.prototype.toString = function()
{
	return this.getElement().toString();
};

oFF.PrSerializerFactory = function() {};
oFF.PrSerializerFactory.prototype = new oFF.XObject();
oFF.PrSerializerFactory.prototype._ff_c = "PrSerializerFactory";

oFF.PrSerializerFactory.s_activeFactory = null;
oFF.PrSerializerFactory.newSerializer = function(sortStructureElements, prettyPrint, indentation, escapeResult)
{
	return oFF.PrSerializerFactory.s_activeFactory.newInstance(sortStructureElements, prettyPrint, indentation, escapeResult);
};
oFF.PrSerializerFactory.setActiveFactory = function(activeFactory)
{
	oFF.PrSerializerFactory.s_activeFactory = activeFactory;
};
oFF.PrSerializerFactory.staticSetup = function()
{
	oFF.PrSerializerFactory.setActiveFactory(new oFF.PrSerializerFactory());
};
oFF.PrSerializerFactory.prototype.newInstance = function(sortStructureElements, prettyPrint, indentation, escape)
{
	return oFF.PrUniversalSerializer.create(sortStructureElements, prettyPrint, indentation, escape);
};

oFF.PrFilter = function() {};
oFF.PrFilter.prototype = new oFF.XObject();
oFF.PrFilter.prototype._ff_c = "PrFilter";

oFF.PrFilter.addJsonPathElementToMap = function(jsonPath, element, existingResult)
{
	if (oFF.isNull(jsonPath))
	{
		return existingResult;
	}
	if (oFF.isNull(element))
	{
		return existingResult;
	}
	let result = existingResult;
	if (oFF.isNull(result))
	{
		result = oFF.XHashMapByString.create();
	}
	result.put(jsonPath, element);
	return result;
};
oFF.PrFilter.create = function()
{
	return new oFF.PrFilter();
};
oFF.PrFilter.prototype.m_withBooleans = false;
oFF.PrFilter.prototype.m_withDoubles = false;
oFF.PrFilter.prototype.m_withIntegers = false;
oFF.PrFilter.prototype.m_withLists = false;
oFF.PrFilter.prototype.m_withLongs = false;
oFF.PrFilter.prototype.m_withNulls = false;
oFF.PrFilter.prototype.m_withNumbers = false;
oFF.PrFilter.prototype.m_withStrings = false;
oFF.PrFilter.prototype.m_withStructures = false;
oFF.PrFilter.prototype.filterJsonPathElements = function(jsonPathElements)
{
	if (oFF.isNull(jsonPathElements) || jsonPathElements.size() < 1)
	{
		return null;
	}
	let result = null;
	let jsonPaths = jsonPathElements.getKeysAsReadOnlyList();
	for (let i = 0; i < jsonPaths.size(); i++)
	{
		let jsonPath = jsonPaths.get(i);
		let element = jsonPathElements.getByKey(jsonPath);
		let filteredElement = this.getElementFiltered(element);
		result = oFF.PrFilter.addJsonPathElementToMap(jsonPath, filteredElement, result);
	}
	return result;
};
oFF.PrFilter.prototype.getElementFiltered = function(element)
{
	if (oFF.isNull(element))
	{
		return null;
	}
	let type = element.getType();
	if (oFF.isNull(type))
	{
		return null;
	}
	if (type === oFF.PrElementType.STRUCTURE && this.m_withStructures)
	{
		return element;
	}
	if (type === oFF.PrElementType.LIST && this.m_withLists)
	{
		return element;
	}
	if (type === oFF.PrElementType.STRING && this.m_withStrings)
	{
		return element;
	}
	if (type === oFF.PrElementType.BOOLEAN && this.m_withBooleans)
	{
		return element;
	}
	if (type === oFF.PrElementType.DOUBLE && (this.m_withDoubles || this.m_withNumbers))
	{
		return element;
	}
	if (type === oFF.PrElementType.LONG && (this.m_withLongs || this.m_withNumbers))
	{
		return element;
	}
	if (type === oFF.PrElementType.INTEGER && (this.m_withIntegers || this.m_withNumbers))
	{
		return element;
	}
	if (type === oFF.PrElementType.THE_NULL && this.m_withNulls)
	{
		return element;
	}
	return null;
};
oFF.PrFilter.prototype.withBooleans = function()
{
	this.m_withBooleans = true;
	return this;
};
oFF.PrFilter.prototype.withDoubles = function()
{
	this.m_withDoubles = true;
	return this;
};
oFF.PrFilter.prototype.withIntegers = function()
{
	this.m_withIntegers = true;
	return this;
};
oFF.PrFilter.prototype.withLists = function()
{
	this.m_withLists = true;
	return this;
};
oFF.PrFilter.prototype.withLongs = function()
{
	this.m_withLongs = true;
	return this;
};
oFF.PrFilter.prototype.withNulls = function()
{
	this.m_withNulls = true;
	return this;
};
oFF.PrFilter.prototype.withNumbers = function()
{
	this.m_withNumbers = true;
	return this;
};
oFF.PrFilter.prototype.withStrings = function()
{
	this.m_withStrings = true;
	return this;
};
oFF.PrFilter.prototype.withStructures = function()
{
	this.m_withStructures = true;
	return this;
};

oFF.PrUniversalFilteringSerializer = function() {};
oFF.PrUniversalFilteringSerializer.prototype = new oFF.XObject();
oFF.PrUniversalFilteringSerializer.prototype._ff_c = "PrUniversalFilteringSerializer";

oFF.PrUniversalFilteringSerializer.create = function()
{
	let serializer = new oFF.PrUniversalFilteringSerializer();
	return serializer;
};
oFF.PrUniversalFilteringSerializer.prototype.m_buffer = null;
oFF.PrUniversalFilteringSerializer.prototype.appendElementBl = function(element, prFilter)
{
	if (oFF.isNull(element))
	{
		this.m_buffer.append("null");
	}
	else
	{
		let type = element.getType();
		if (type === oFF.PrElementType.STRUCTURE)
		{
			this.appendStructureBl(element, prFilter);
		}
		else if (type === oFF.PrElementType.LIST)
		{
			this.appendListBl(element, prFilter);
		}
		else if (type === oFF.PrElementType.STRING)
		{
			let stringValue = element.asString().getString();
			if (oFF.isNull(stringValue))
			{
				this.m_buffer.append("null");
			}
			else
			{
				this.m_buffer.append("\"");
				this.m_buffer.append(oFF.XStringUtils.escapeControlChars(oFF.XHttpUtils.escapeToJsonString(stringValue)));
				this.m_buffer.append("\"");
			}
		}
		else if (type === oFF.PrElementType.DOUBLE)
		{
			this.m_buffer.appendDouble(element.asNumber().getDouble());
		}
		else if (type.isNumber())
		{
			this.m_buffer.appendLong(element.asNumber().getLong());
		}
		else if (type === oFF.PrElementType.BOOLEAN)
		{
			this.m_buffer.appendBoolean(element.asBoolean().getBoolean());
		}
		else if (type === oFF.PrElementType.THE_NULL)
		{
			this.m_buffer.append("null");
		}
	}
};
oFF.PrUniversalFilteringSerializer.prototype.appendListBl = function(element, prFilter)
{
	this.m_buffer.append("[");
	let hasElements = false;
	let list = element;
	let size = list.size();
	let subFilter = oFF.isNull(prFilter) ? null : prFilter.getListSubFilter();
	for (let i = 0; i < size; i++)
	{
		if (hasElements)
		{
			this.m_buffer.append(",");
		}
		hasElements = true;
		let listElement = list.get(i);
		if (oFF.notNull(subFilter))
		{
			subFilter.submitIndex(i, listElement);
		}
		this.appendElementBl(listElement, subFilter);
	}
	this.m_buffer.append("]");
};
oFF.PrUniversalFilteringSerializer.prototype.appendStructureBl = function(element, prFilter)
{
	this.m_buffer.append("{");
	let hasElements = false;
	let structure = element;
	let structureElementNames = structure.getKeysAsReadOnlyList();
	if (oFF.notNull(structureElementNames))
	{
		let structureSize = structureElementNames.size();
		structureElementNames.sortByDirection(oFF.XSortDirection.ASCENDING);
		for (let i = 0; i < structureSize; i++)
		{
			let structureElementName = structureElementNames.get(i);
			let structureElement = structure.getByKey(structureElementName);
			let subFilter = oFF.isNull(prFilter) ? null : prFilter.getSubFilter(structureElementName);
			if (oFF.notNull(subFilter) && subFilter.isIgnore(structureElementName, structureElement))
			{
				continue;
			}
			if (hasElements)
			{
				this.m_buffer.append(",");
			}
			hasElements = true;
			this.m_buffer.append("\"");
			this.m_buffer.append(this.escapeQuote(structureElementName));
			this.m_buffer.append("\":");
			this.appendElementBl(structureElement, subFilter);
		}
	}
	this.m_buffer.append("}");
};
oFF.PrUniversalFilteringSerializer.prototype.escapeQuote = function(name)
{
	return oFF.XString.containsString(name, "\"") ? oFF.XString.replace(name, "\"", "\\\"") : name;
};
oFF.PrUniversalFilteringSerializer.prototype.serializeWithFilter = function(element, prFilter)
{
	this.m_buffer = oFF.XStringBuffer.create();
	this.appendElementBl(element, prFilter);
	let result = this.m_buffer.toString();
	this.m_buffer = oFF.XObjectExt.release(this.m_buffer);
	return result;
};

oFF.PrUniversalSerializer = function() {};
oFF.PrUniversalSerializer.prototype = new oFF.XObject();
oFF.PrUniversalSerializer.prototype._ff_c = "PrUniversalSerializer";

oFF.PrUniversalSerializer.create = function(sortStructureElements, prettyPrint, indentation, escapeResult)
{
	let serializer = new oFF.PrUniversalSerializer();
	serializer.m_indentation = indentation;
	serializer.m_pretty = prettyPrint;
	serializer.m_sort = sortStructureElements;
	serializer.m_escapeResult = escapeResult;
	return serializer;
};
oFF.PrUniversalSerializer.prototype.m_buffer = null;
oFF.PrUniversalSerializer.prototype.m_escapeResult = true;
oFF.PrUniversalSerializer.prototype.m_indentation = 0;
oFF.PrUniversalSerializer.prototype.m_indentationLevel = 0;
oFF.PrUniversalSerializer.prototype.m_pretty = false;
oFF.PrUniversalSerializer.prototype.m_sort = false;
oFF.PrUniversalSerializer.prototype.appendElement = function(element, elementName)
{
	if (this.m_pretty)
	{
		this.appendIndentationString();
	}
	if (oFF.notNull(elementName))
	{
		this.m_buffer.append("\"");
		if (this.m_escapeResult)
		{
			this.m_buffer.append(this.escape(elementName));
		}
		else
		{
			this.m_buffer.append(elementName);
		}
		this.m_buffer.append("\":");
		if (this.m_pretty)
		{
			this.m_buffer.append(" ");
		}
	}
	if (oFF.isNull(element))
	{
		this.m_buffer.append("null");
	}
	else
	{
		let type = element.getType();
		if (type === oFF.PrElementType.STRUCTURE)
		{
			this.appendStructure(element);
		}
		else if (type === oFF.PrElementType.LIST)
		{
			this.appendList(element);
		}
		else if (type === oFF.PrElementType.STRING)
		{
			let stringValue = element.asString().getString();
			if (oFF.isNull(stringValue))
			{
				this.m_buffer.append("null");
			}
			else
			{
				this.m_buffer.append("\"");
				if (this.m_escapeResult)
				{
					this.m_buffer.append(oFF.XStringUtils.escapeControlChars(oFF.XHttpUtils.escapeToJsonString(stringValue)));
				}
				else
				{
					this.m_buffer.append(stringValue);
				}
				this.m_buffer.append("\"");
			}
		}
		else if (type === oFF.PrElementType.DOUBLE)
		{
			this.m_buffer.appendDouble(element.asNumber().getDouble());
		}
		else if (type.isNumber())
		{
			this.m_buffer.appendLong(element.asNumber().getLong());
		}
		else if (type === oFF.PrElementType.BOOLEAN)
		{
			if (element.getBoolean())
			{
				this.m_buffer.append("true");
			}
			else
			{
				this.m_buffer.append("false");
			}
		}
		else if (type === oFF.PrElementType.THE_NULL)
		{
			this.m_buffer.append("null");
		}
	}
};
oFF.PrUniversalSerializer.prototype.appendIndentationString = function()
{
	if (this.m_indentation >= 1 && this.m_indentationLevel >= 1)
	{
		let spaces = this.m_indentation * this.m_indentationLevel;
		for (let i = 0; i < spaces; i++)
		{
			this.m_buffer.append(" ");
		}
	}
};
oFF.PrUniversalSerializer.prototype.appendList = function(element)
{
	this.m_buffer.append("[");
	let hasElements = false;
	let list = element;
	let size = list.size();
	for (let i = 0; i < size; i++)
	{
		if (hasElements)
		{
			this.m_buffer.append(",");
		}
		hasElements = true;
		let listElement = list.get(i);
		if (this.m_pretty)
		{
			this.m_buffer.appendNewLine();
			this.m_indentationLevel++;
			this.appendElement(listElement, null);
			this.m_indentationLevel--;
		}
		else
		{
			this.appendElement(listElement, null);
		}
	}
	if (this.m_pretty && hasElements)
	{
		this.m_buffer.appendNewLine();
		this.appendIndentationString();
	}
	this.m_buffer.append("]");
};
oFF.PrUniversalSerializer.prototype.appendStructure = function(element)
{
	this.m_buffer.append("{");
	let hasElements = false;
	let structure = element;
	let structureElementNames = structure.getKeysAsReadOnlyList();
	if (oFF.notNull(structureElementNames))
	{
		let structureSize = structureElementNames.size();
		if (this.m_sort && structureSize > 1)
		{
			structureElementNames.sortByDirection(oFF.XSortDirection.ASCENDING);
		}
		for (let i = 0; i < structureSize; i++)
		{
			if (hasElements)
			{
				this.m_buffer.append(",");
			}
			hasElements = true;
			let structureElementName = structureElementNames.get(i);
			let structureElement = structure.getByKey(structureElementName);
			if (this.m_pretty)
			{
				this.m_buffer.appendNewLine();
				this.m_indentationLevel++;
				this.appendElement(structureElement, structureElementName);
				this.m_indentationLevel--;
			}
			else
			{
				this.appendElement(structureElement, structureElementName);
			}
		}
	}
	if (this.m_pretty && hasElements)
	{
		this.m_buffer.appendNewLine();
		this.appendIndentationString();
	}
	this.m_buffer.append("}");
};
oFF.PrUniversalSerializer.prototype.escape = function(name)
{
	let result = name;
	result = oFF.XString.replace(result, "\\", "\\\\");
	result = oFF.XString.replace(result, "\"", "\\\"");
	result = oFF.XString.replace(result, "\b", "\\b");
	result = oFF.XString.replace(result, "\f", "\\f");
	result = oFF.XString.replace(result, "\n", "\\n");
	result = oFF.XString.replace(result, "\r", "\\r");
	result = oFF.XString.replace(result, "\t", "\\t");
	return result;
};
oFF.PrUniversalSerializer.prototype.serialize = function(element)
{
	let result = null;
	if (oFF.notNull(element))
	{
		this.m_buffer = oFF.XStringBuffer.create();
		this.appendElement(element, null);
		result = this.m_buffer.toString();
		this.m_buffer = oFF.XObjectExt.release(this.m_buffer);
	}
	return result;
};

oFF.PrUtils = {

	asBoolean:function(element)
	{
			return oFF.PrUtils.isElementValid(element, oFF.PrElementType.BOOLEAN) ? element : null;
	},
	asDouble:function(element)
	{
			return oFF.PrUtils.isElementValid(element, oFF.PrElementType.DOUBLE) ? element : null;
	},
	asInteger:function(element)
	{
			return oFF.PrUtils.isElementValid(element, oFF.PrElementType.INTEGER) ? element : null;
	},
	asList:function(element)
	{
			return oFF.PrUtils.isElementValid(element, oFF.PrElementType.LIST) ? element : null;
	},
	asListOfString:function(list)
	{
			let result = oFF.XList.create();
		if (oFF.PrUtils.isElementValid(list, oFF.PrElementType.LIST))
		{
			let size = list.size();
			for (let i = 0; i < size; i++)
			{
				result.add(oFF.PrUtils.getStringValueElement(list, i, null));
			}
		}
		return result;
	},
	asLong:function(element)
	{
			return oFF.PrUtils.isElementValid(element, oFF.PrElementType.LONG) ? element : null;
	},
	asNumber:function(element)
	{
			let result = null;
		if (oFF.PrUtils.isElementValid(element, oFF.PrElementType.DOUBLE) || oFF.PrUtils.isElementValid(element, oFF.PrElementType.INTEGER) || oFF.PrUtils.isElementValid(element, oFF.PrElementType.LONG))
		{
			result = element.asNumber();
		}
		return result;
	},
	asString:function(element)
	{
			return oFF.PrUtils.isElementValid(element, oFF.PrElementType.STRING) ? element : null;
	},
	asStructure:function(element)
	{
			return oFF.PrUtils.isElementValid(element, oFF.PrElementType.STRUCTURE) ? element : null;
	},
	contains:function(list, element)
	{
			return oFF.PrUtils.indexOf(list, element) > -1;
	},
	convertBoolToString:function(element)
	{
			let booleanElement = element;
		return oFF.XBoolean.convertToString(booleanElement.getBoolean());
	},
	convertDoubleToString:function(element)
	{
			let doubleElement = element;
		return oFF.XDouble.convertToString(doubleElement.getDouble());
	},
	convertElementToBoolean:function(element)
	{
			let result = null;
		let type = oFF.PrUtils.getTypeFromElement(element);
		if (oFF.notNull(type))
		{
			if (type === oFF.PrElementType.BOOLEAN)
			{
				result = element;
			}
			if (type === oFF.PrElementType.STRING)
			{
				try
				{
					let booleanValue = oFF.XBoolean.convertFromString(element.getString());
					result = oFF.PrFactory.createBoolean(booleanValue);
				}
				catch (t)
				{
					result = null;
				}
			}
		}
		return result;
	},
	convertElementToBooleanValue:function(element, defaultValue)
	{
			let elementAsBoolean = oFF.PrUtils.convertElementToBoolean(element);
		return oFF.isNull(elementAsBoolean) ? defaultValue : elementAsBoolean.getBoolean();
	},
	convertElementToDouble:function(element)
	{
			let result = null;
		let type = oFF.PrUtils.getTypeFromElement(element);
		if (oFF.notNull(type))
		{
			if (type === oFF.PrElementType.DOUBLE)
			{
				result = element;
			}
			else if (type.isNumber())
			{
				result = oFF.PrFactory.createDouble(element.asNumber().getDouble());
			}
			else if (type === oFF.PrElementType.STRING)
			{
				try
				{
					let doubleValue = oFF.XDouble.convertFromString(element.getString());
					result = oFF.PrFactory.createDouble(doubleValue);
				}
				catch (t1)
				{
					result = null;
				}
			}
		}
		return result;
	},
	convertElementToDoubleValue:function(element, defaultValue)
	{
			let elementAsDouble = oFF.PrUtils.convertElementToDouble(element);
		return oFF.isNull(elementAsDouble) ? defaultValue : elementAsDouble.getDouble();
	},
	convertElementToInteger:function(element)
	{
			let result = null;
		let type = oFF.PrUtils.getTypeFromElement(element);
		if (oFF.notNull(type))
		{
			if (type === oFF.PrElementType.INTEGER)
			{
				result = element;
			}
			if (type.isNumber())
			{
				result = oFF.PrFactory.createInteger(element.asNumber().getInteger());
			}
			if (type === oFF.PrElementType.STRING)
			{
				try
				{
					let integerValue = oFF.XInteger.convertFromStringWithRadix(element.getString(), 10);
					result = oFF.PrFactory.createInteger(integerValue);
				}
				catch (t1)
				{
					result = null;
				}
			}
		}
		return result;
	},
	convertElementToIntegerValue:function(element, defaultValue)
	{
			let elementAsInteger = oFF.PrUtils.convertElementToInteger(element);
		return oFF.isNull(elementAsInteger) ? defaultValue : elementAsInteger.getInteger();
	},
	convertElementToLong:function(element)
	{
			let result = null;
		let type = oFF.PrUtils.getTypeFromElement(element);
		if (oFF.notNull(type))
		{
			if (type === oFF.PrElementType.LONG)
			{
				result = element;
			}
			if (type.isNumber())
			{
				result = oFF.PrFactory.createLong(element.asNumber().getLong());
			}
			if (type === oFF.PrElementType.STRING)
			{
				try
				{
					let longValue = oFF.XLong.convertFromString(element.getString());
					result = oFF.PrFactory.createLong(longValue);
				}
				catch (t1)
				{
					result = null;
				}
			}
		}
		return result;
	},
	convertElementToLongValue:function(element, defaultValue)
	{
			let elementAsLong = oFF.PrUtils.convertElementToLong(element);
		return oFF.isNull(elementAsLong) ? defaultValue : elementAsLong.getLong();
	},
	convertElementToNumber:function(element)
	{
			let result = null;
		let type = oFF.PrUtils.getTypeFromElement(element);
		if (oFF.notNull(type))
		{
			if (type === oFF.PrElementType.STRING)
			{
				try
				{
					let doubleValue = oFF.XDouble.convertFromString(element.getString());
					result = oFF.PrFactory.createDouble(doubleValue);
				}
				catch (t)
				{
					result = null;
				}
			}
			else if (type.isNumber())
			{
				result = element.asNumber();
			}
		}
		return result;
	},
	convertElementToString:function(element)
	{
			let result = null;
		let type = oFF.PrUtils.getTypeFromElement(element);
		if (oFF.notNull(type))
		{
			if (type === oFF.PrElementType.STRING)
			{
				result = element;
			}
			else
			{
				let stringValue = null;
				if (type === oFF.PrElementType.BOOLEAN)
				{
					stringValue = oFF.PrUtils.convertBoolToString(element);
				}
				else if (type === oFF.PrElementType.INTEGER)
				{
					stringValue = oFF.PrUtils.convertIntegerToString(element);
				}
				else if (type === oFF.PrElementType.DOUBLE)
				{
					stringValue = oFF.PrUtils.convertDoubleToString(element);
				}
				else if (type === oFF.PrElementType.LONG)
				{
					stringValue = oFF.PrUtils.convertLongToString(element);
				}
				result = oFF.PrFactory.createString(stringValue);
			}
		}
		return result;
	},
	convertElementToStringValue:function(element, defaultValue)
	{
			let result = defaultValue;
		if (oFF.notNull(element))
		{
			let prString = oFF.PrUtils.convertElementToString(element);
			result = oFF.isNull(prString) ? defaultValue : prString.getString();
		}
		return result;
	},
	convertIntegerToString:function(element)
	{
			let integerElement = element;
		return oFF.XInteger.convertToString(integerElement.getInteger());
	},
	convertLongToString:function(element)
	{
			let longElement = element;
		return oFF.XLong.convertToString(longElement.getLong());
	},
	convertToList:function(element)
	{
			let result = null;
		if (oFF.notNull(element))
		{
			if (element.isList())
			{
				result = element;
			}
			else
			{
				result = oFF.PrFactory.createList();
				result.add(element);
			}
		}
		return result;
	},
	copyElement:function(element)
	{
			let result = null;
		if (oFF.notNull(element))
		{
			let prElementType = element.getType();
			if (oFF.PrElementType.BOOLEAN === prElementType)
			{
				result = oFF.PrFactory.createBoolean(element.getBoolean());
			}
			else if (oFF.PrElementType.INTEGER === prElementType)
			{
				result = oFF.PrFactory.createInteger(element.asNumber().getInteger());
			}
			else if (oFF.PrElementType.LONG === prElementType)
			{
				result = oFF.PrFactory.createLong(element.asNumber().getLong());
			}
			else if (oFF.PrElementType.DOUBLE === prElementType)
			{
				result = oFF.PrFactory.createDouble(element.asNumber().getDouble());
			}
			else if (oFF.PrElementType.STRING === prElementType)
			{
				result = oFF.PrFactory.createString(element.getString());
			}
			else if (oFF.PrElementType.STRUCTURE === prElementType)
			{
				result = oFF.PrUtils.copyStructure(element);
			}
			else if (oFF.PrElementType.LIST === prElementType)
			{
				result = oFF.PrUtils.copyList(element);
			}
			else if (oFF.PrElementType.THE_NULL !== prElementType)
			{
				throw oFF.XException.createIllegalStateException("unknown type");
			}
		}
		return result;
	},
	copyIntegerValues:function(parameterList, existingArray)
	{
			let size = parameterList.size();
		let localArray;
		if (oFF.isNull(existingArray) || existingArray.size() !== size)
		{
			localArray = oFF.XArrayOfInt.create(size);
		}
		else
		{
			localArray = existingArray;
		}
		for (let i = 0; i < size; i++)
		{
			localArray.set(i, parameterList.getIntegerAt(i));
		}
		return localArray;
	},
	copyList:function(list)
	{
			let listCopy = oFF.PrFactory.createList();
		let listSize = list.size();
		for (let i = 0; i < listSize; i++)
		{
			let listElement = list.get(i);
			let listElementCopy = oFF.PrUtils.copyElement(listElement);
			listCopy.add(listElementCopy);
		}
		return listCopy;
	},
	copyStructure:function(structure)
	{
			let structureCopy = oFF.PrFactory.createStructure();
		let structureElementNames = structure.getKeysAsReadOnlyList();
		let structureElementNamesSize = structureElementNames.size();
		for (let i = 0; i < structureElementNamesSize; i++)
		{
			let structureElementName = structureElementNames.get(i);
			let structureElement = structure.getByKey(structureElementName);
			let structureElementCopy = oFF.PrUtils.copyElement(structureElement);
			structureCopy.put(structureElementName, structureElementCopy);
		}
		return structureCopy;
	},
	createByValue:function(value)
	{
			let element = null;
		if (oFF.notNull(value))
		{
			let valueType = value.getValueType();
			if (valueType === oFF.XValueType.STRING)
			{
				let strVal = value;
				element = oFF.PrString.createWithValue(strVal.getString());
			}
			else if (valueType === oFF.XValueType.BOOLEAN)
			{
				let boolVal = value;
				element = oFF.PrBoolean.createWithValue(boolVal.getBoolean());
			}
			else if (valueType === oFF.XValueType.INTEGER)
			{
				let intVal = value;
				element = oFF.PrInteger.createWithValue(intVal.getInteger());
			}
			else if (valueType === oFF.XValueType.DOUBLE || valueType === oFF.XValueType.NUMBER)
			{
				let doubleVal = value;
				element = oFF.PrDouble.createWithValue(doubleVal.getDouble());
			}
			else if (valueType === oFF.XValueType.LIST)
			{
				let listValue = value;
				element = oFF.PrUtils.deepCopyElement(listValue);
			}
			else if (valueType === oFF.XValueType.STRUCTURE)
			{
				let structValue = value;
				element = oFF.PrUtils.deepCopyElement(structValue);
			}
		}
		return element;
	},
	createDeepCopy:function(element)
	{
			return oFF.PrUtils.createDeepCopyExt(element, null);
	},
	createDeepCopyExt:function(element, target)
	{
			let result = null;
		let type = oFF.PrUtils.getTypeFromElement(element);
		if (oFF.notNull(type))
		{
			let prStruct = oFF.PrElementType.STRUCTURE;
			let prList = oFF.PrElementType.LIST;
			let prBoolean = oFF.PrElementType.BOOLEAN;
			let prString = oFF.PrElementType.STRING;
			let prInt = oFF.PrElementType.INTEGER;
			let prLong = oFF.PrElementType.LONG;
			let prDouble = oFF.PrElementType.DOUBLE;
			let childCopy;
			let originChild;
			if (type === prStruct)
			{
				let originStruct = element;
				let structure = target;
				if (oFF.isNull(structure))
				{
					structure = oFF.PrFactory.createStructure();
				}
				else
				{
					structure.clear();
				}
				let elementNames = originStruct.getKeysAsReadOnlyList();
				let len = elementNames.size();
				for (let i = 0; i < len; i++)
				{
					let name = elementNames.get(i);
					originChild = originStruct.getByKey(name);
					childCopy = oFF.PrUtils.createDeepCopyExt(originChild, null);
					structure.put(name, childCopy);
				}
				result = structure;
			}
			else if (type === prList)
			{
				let originList = element;
				let list = target;
				if (oFF.isNull(list))
				{
					list = oFF.PrFactory.createList();
				}
				else
				{
					list.clear();
				}
				let readOnlyList = originList.getReadOnlyList();
				let size = readOnlyList.size();
				for (let k = 0; k < size; k++)
				{
					originChild = readOnlyList.get(k);
					childCopy = oFF.PrUtils.createDeepCopyExt(originChild, null);
					list.add(childCopy);
				}
				result = list;
			}
			else if (type === prBoolean)
			{
				let originBoolean = element;
				result = oFF.PrFactory.createBoolean(originBoolean.getBoolean());
			}
			else if (type === prString)
			{
				let originString = element;
				result = oFF.PrFactory.createString(originString.getString());
			}
			else if (type === prInt)
			{
				let originInt = element;
				result = oFF.PrFactory.createInteger(originInt.getInteger());
			}
			else if (type === prLong)
			{
				let originLong = element;
				result = oFF.PrFactory.createLong(originLong.getLong());
			}
			else if (type === prDouble)
			{
				let originDouble = element;
				result = oFF.PrFactory.createDouble(originDouble.getDouble());
			}
		}
		return result;
	},
	createElementDeepCopy:function(element)
	{
			return oFF.isNull(element) ? null : oFF.PrUtils.copyElement(element);
	},
	deepCopyElement:function(origin)
	{
			let result = null;
		if (oFF.notNull(origin))
		{
			let type = origin.getType();
			if (type === oFF.PrElementType.STRUCTURE)
			{
				result = oFF.PrStructure.createDeepCopy(origin);
			}
			else if (type === oFF.PrElementType.LIST)
			{
				result = oFF.PrList.createDeepCopy(origin);
			}
			else
			{
				result = origin.getPermaCopy();
			}
		}
		return result;
	},
	deserialize:function(serializedElementStr)
	{
			let parser = oFF.JsonParserFactory.newInstance();
		let tmpElement = parser.parse(serializedElementStr);
		parser = oFF.XObjectExt.release(parser);
		return tmpElement;
	},
	deserializeExt:function(serializedElementStr)
	{
			let parser = oFF.JsonParserFactory.newInstance();
		let tmpElement = parser.parse(serializedElementStr);
		if (parser.hasErrors())
		{
			throw oFF.XException.createRuntimeException(parser.getFirstError().getText());
		}
		parser = oFF.XObjectExt.release(parser);
		return tmpElement;
	},
	getBooleanElement:function(list, index)
	{
			let element = oFF.PrUtils.getElement(list, index);
		return oFF.PrUtils.convertElementToBoolean(element);
	},
	getBooleanProperty:function(structure, name)
	{
			let element = oFF.PrUtils.getProperty(structure, name);
		return oFF.PrUtils.convertElementToBoolean(element);
	},
	getBooleanValueElement:function(list, index, defaultValue)
	{
			let element = oFF.PrUtils.getElement(list, index);
		return oFF.PrUtils.convertElementToBooleanValue(element, defaultValue);
	},
	getBooleanValueProperty:function(structure, name, defaultValue)
	{
			let element = oFF.PrUtils.getProperty(structure, name);
		return oFF.PrUtils.convertElementToBooleanValue(element, defaultValue);
	},
	getDateElement:function(list, index, isSapFormat, defaultValue)
	{
			let result = defaultValue;
		let stringElement = oFF.PrUtils.getStringElement(list, index);
		if (oFF.notNull(stringElement))
		{
			let resultValue = oFF.XDate.createDateFromStringWithFlag(stringElement.getString(), isSapFormat);
			result = oFF.isNull(resultValue) ? defaultValue : resultValue;
		}
		return result;
	},
	getDateProperty:function(structure, name, isSapFormat, defaultValue)
	{
			let result = defaultValue;
		let stringProperty = oFF.PrUtils.getStringProperty(structure, name);
		if (oFF.notNull(stringProperty))
		{
			let resultValue = oFF.XDate.createDateFromStringWithFlag(stringProperty.getString(), isSapFormat);
			result = oFF.isNull(resultValue) ? defaultValue : resultValue;
		}
		return result;
	},
	getDateTimeElement:function(list, index, isSapFormat, defaultValue)
	{
			let result = defaultValue;
		let stringElement = oFF.PrUtils.getStringElement(list, index);
		if (oFF.notNull(stringElement))
		{
			let resultValue = oFF.XDateTime.createDateTimeFromStringWithFlag(stringElement.getString(), isSapFormat);
			result = oFF.isNull(resultValue) ? defaultValue : resultValue;
		}
		return result;
	},
	getDateTimeProperty:function(structure, name, isSapFormat, defaultValue)
	{
			let result = defaultValue;
		let stringProperty = oFF.PrUtils.getStringProperty(structure, name);
		if (oFF.notNull(stringProperty))
		{
			let resultValue = oFF.XDateTime.createDateTimeFromStringWithFlag(stringProperty.getString(), isSapFormat);
			result = oFF.isNull(resultValue) ? defaultValue : resultValue;
		}
		return result;
	},
	getDoubleElement:function(list, index)
	{
			let element = oFF.PrUtils.getElement(list, index);
		return oFF.PrUtils.convertElementToDouble(element);
	},
	getDoubleProperty:function(structure, name)
	{
			let element = oFF.PrUtils.getProperty(structure, name);
		return oFF.PrUtils.convertElementToDouble(element);
	},
	getDoubleValueElement:function(list, index, defaultValue)
	{
			let element = oFF.PrUtils.getElement(list, index);
		return oFF.PrUtils.convertElementToDoubleValue(element, defaultValue);
	},
	getDoubleValueProperty:function(structure, name, defaultValue)
	{
			let element = oFF.PrUtils.getProperty(structure, name);
		return oFF.PrUtils.convertElementToDoubleValue(element, defaultValue);
	},
	getElement:function(list, index)
	{
			let result = null;
		if (oFF.notNull(list) && index >= 0 && index < list.size())
		{
			result = list.get(index);
		}
		return result;
	},
	getIntegerElement:function(list, index)
	{
			let element = oFF.PrUtils.getElement(list, index);
		return oFF.PrUtils.convertElementToInteger(element);
	},
	getIntegerProperty:function(structure, name)
	{
			let element = oFF.PrUtils.getProperty(structure, name);
		return oFF.PrUtils.convertElementToInteger(element);
	},
	getIntegerValueElement:function(list, index, defaultValue)
	{
			let element = oFF.PrUtils.getElement(list, index);
		return oFF.PrUtils.convertElementToIntegerValue(element, defaultValue);
	},
	getIntegerValueProperty:function(structure, name, defaultValue)
	{
			let element = oFF.PrUtils.getProperty(structure, name);
		return oFF.PrUtils.convertElementToIntegerValue(element, defaultValue);
	},
	getKeysAsReadOnlyList:function(element, defaultNames)
	{
			return oFF.PrUtils.isElementValid(element, oFF.PrElementType.STRUCTURE) ? element.getKeysAsReadOnlyList() : defaultNames;
	},
	getListElement:function(list, index)
	{
			let element = oFF.PrUtils.getElement(list, index);
		return oFF.PrUtils.asList(element);
	},
	getListProperty:function(structure, name)
	{
			let element = oFF.PrUtils.getProperty(structure, name);
		return oFF.PrUtils.asList(element);
	},
	getListSize:function(element, defaultSize)
	{
			return oFF.PrUtils.isElementValid(element, oFF.PrElementType.LIST) ? element.size() : defaultSize;
	},
	getLongElement:function(list, index)
	{
			let element = oFF.PrUtils.getElement(list, index);
		return oFF.PrUtils.convertElementToLong(element);
	},
	getLongProperty:function(structure, name)
	{
			let element = oFF.PrUtils.getProperty(structure, name);
		return oFF.PrUtils.convertElementToLong(element);
	},
	getLongValueElement:function(list, index, defaultValue)
	{
			let element = oFF.PrUtils.getElement(list, index);
		return oFF.PrUtils.convertElementToLongValue(element, defaultValue);
	},
	getLongValueProperty:function(structure, name, defaultValue)
	{
			let element = oFF.PrUtils.getProperty(structure, name);
		return oFF.PrUtils.convertElementToLongValue(element, defaultValue);
	},
	getNumberElement:function(list, index)
	{
			let element = oFF.PrUtils.getElement(list, index);
		return oFF.PrUtils.convertElementToNumber(element);
	},
	getNumberProperty:function(structure, name)
	{
			let element = oFF.PrUtils.getProperty(structure, name);
		return oFF.PrUtils.convertElementToNumber(element);
	},
	getProperty:function(structure, name)
	{
			let result = null;
		if (oFF.notNull(structure) && oFF.notNull(name))
		{
			result = structure.getByKey(name);
		}
		return result;
	},
	getPropertyAsList:function(structure, name)
	{
			return oFF.PrUtils.convertToList(oFF.PrUtils.getProperty(structure, name));
	},
	getStringElement:function(list, index)
	{
			let element = oFF.PrUtils.getElement(list, index);
		return oFF.PrUtils.convertElementToString(element);
	},
	getStringProperty:function(structure, name)
	{
			let element = oFF.PrUtils.getProperty(structure, name);
		return oFF.PrUtils.convertElementToString(element);
	},
	getStringValueElement:function(list, index, defaultValue)
	{
			let element = oFF.PrUtils.getElement(list, index);
		return oFF.PrUtils.convertElementToStringValue(element, defaultValue);
	},
	getStringValueProperty:function(structure, name, defaultValue)
	{
			let element = oFF.PrUtils.getProperty(structure, name);
		return oFF.PrUtils.convertElementToStringValue(element, defaultValue);
	},
	getStructureElement:function(list, index)
	{
			let element = oFF.PrUtils.getElement(list, index);
		return oFF.PrUtils.asStructure(element);
	},
	getStructureProperty:function(structure, name)
	{
			let element = oFF.PrUtils.getProperty(structure, name);
		return oFF.PrUtils.asStructure(element);
	},
	getStructureSize:function(element, defaultSize)
	{
			let elementNames = oFF.PrUtils.getKeysAsReadOnlyList(element, null);
		return oFF.isNull(elementNames) ? defaultSize : elementNames.size();
	},
	getStructureWithKeyValuePair:function(list, key, value)
	{
			let result = null;
		if (oFF.XCollectionUtils.hasElements(list) && oFF.XStringUtils.isNotNullAndNotEmpty(key) && oFF.XStringUtils.isNotNullAndNotEmpty(value))
		{
			let size = list.size();
			for (let i = 0; i < size; i++)
			{
				let structure = list.getStructureAt(i);
				if (oFF.XString.isEqual(oFF.PrUtils.getStringValueProperty(structure, key, null), value))
				{
					result = structure;
					break;
				}
			}
		}
		return result;
	},
	getTimeElement:function(list, index, isSapFormat, defaultValue)
	{
			let result = defaultValue;
		let stringElement = oFF.PrUtils.getStringElement(list, index);
		if (oFF.notNull(stringElement))
		{
			let resultValue = oFF.XTime.createTimeFromStringWithFlag(stringElement.getString(), isSapFormat);
			result = oFF.isNull(resultValue) ? defaultValue : resultValue;
		}
		return result;
	},
	getTimeProperty:function(structure, name, isSapFormat, defaultValue)
	{
			let result = defaultValue;
		let stringProperty = oFF.PrUtils.getStringProperty(structure, name);
		if (oFF.notNull(stringProperty))
		{
			let resultValue = oFF.XTime.createTimeFromStringWithFlag(stringProperty.getString(), isSapFormat);
			result = oFF.isNull(resultValue) ? defaultValue : resultValue;
		}
		return result;
	},
	getTypeFromElement:function(element)
	{
			return oFF.isNull(element) ? null : element.getType();
	},
	indexOf:function(list, element)
	{
			let index = -1;
		if (!oFF.PrUtils.isListEmpty(list))
		{
			let size = list.size();
			for (let i = 0; i < size; i++)
			{
				if (oFF.XObjectExt.areEqual(list.get(i), element))
				{
					index = i;
					break;
				}
			}
		}
		return index;
	},
	isElementValid:function(element, type)
	{
			return oFF.notNull(element) && element.getType() === type;
	},
	isListEmpty:function(list)
	{
			return oFF.isNull(list) || list.isEmpty();
	},
	mergeStructures:function(mainStructure, overlayStructure)
	{
			oFF.PrUtils.mergeStructuresExt(mainStructure, overlayStructure, false);
	},
	mergeStructuresExt:function(mainStructure, overlayStructure, deep)
	{
			if (oFF.notNull(mainStructure) && oFF.notNull(overlayStructure))
		{
			let elementNames = overlayStructure.getKeysAsReadOnlyList();
			let len = elementNames.size();
			for (let i = 0; i < len; i++)
			{
				let name = elementNames.get(i);
				let type = overlayStructure.getElementTypeByKey(name);
				if (type === oFF.PrElementType.BOOLEAN)
				{
					mainStructure.putBoolean(name, overlayStructure.getBooleanByKey(name));
				}
				else if (type === oFF.PrElementType.INTEGER)
				{
					mainStructure.putInteger(name, overlayStructure.getIntegerByKey(name));
				}
				else if (type === oFF.PrElementType.LONG)
				{
					mainStructure.putLong(name, overlayStructure.getLongByKey(name));
				}
				else if (type === oFF.PrElementType.DOUBLE)
				{
					mainStructure.putDouble(name, overlayStructure.getDoubleByKey(name));
				}
				else if (type === oFF.PrElementType.STRING)
				{
					mainStructure.putString(name, overlayStructure.getStringByKey(name));
				}
				else if (type === oFF.PrElementType.STRUCTURE || type === oFF.PrElementType.LIST)
				{
					if (deep && type === oFF.PrElementType.STRUCTURE && mainStructure.getStructureByKey(name) !== null)
					{
						let mainStructureStruct = mainStructure.getStructureByKey(name);
						let element = overlayStructure.getByKey(name);
						oFF.PrUtils.mergeStructuresExt(mainStructureStruct, element.asStructure(), deep);
						mainStructure.put(name, mainStructureStruct);
					}
					else
					{
						let element = overlayStructure.getByKey(name);
						let targetElement = oFF.PrUtils.createDeepCopy(element);
						mainStructure.put(name, targetElement);
					}
				}
			}
		}
	},
	removeProperty:function(structure, name)
	{
			let result = null;
		if (oFF.notNull(structure) && oFF.PrUtils.getProperty(structure, name) !== null)
		{
			result = structure.remove(name);
		}
		return result;
	},
	serialize:function(element, sortStructureElements, prettyPrint, indentation)
	{
			let serializer = oFF.PrSerializerFactory.newSerializer(sortStructureElements, prettyPrint, indentation, true);
		let result = serializer.serialize(element);
		oFF.XObjectExt.release(serializer);
		return result;
	},
	serializeUnescaped:function(element, sortStructureElements, prettyPrint, indentation)
	{
			let serializer = oFF.PrSerializerFactory.newSerializer(sortStructureElements, prettyPrint, indentation, false);
		let result = serializer.serialize(element);
		oFF.XObjectExt.release(serializer);
		return result;
	}
};

oFF.PrUtilsJsonPath = {

	addJsonPathElementToMap:function(jsonPath, element, existingResult)
	{
			if (oFF.isNull(jsonPath))
		{
			return existingResult;
		}
		if (oFF.isNull(element))
		{
			return existingResult;
		}
		let result = existingResult;
		if (oFF.isNull(result))
		{
			result = oFF.XHashMapByString.create();
		}
		result.put(jsonPath, element);
		return result;
	},
	addJsonPathElementsRecursive:function(currentJsonPath, element, existingResult, recursive)
	{
			let result = existingResult;
		let structure = oFF.PrUtils.asStructure(element);
		if (oFF.notNull(structure))
		{
			let propertyNames = structure.getKeysAsReadOnlyList();
			if (oFF.notNull(propertyNames))
			{
				for (let structureIndex = 0; structureIndex < propertyNames.size(); structureIndex++)
				{
					let propertyName = propertyNames.get(structureIndex);
					let structureProperty = structure.getByKey(propertyName);
					if (oFF.isNull(structureProperty))
					{
						continue;
					}
					let jsonPathWithProperty = oFF.PrUtilsJsonPath.increaseJsonPath(currentJsonPath, propertyName, -1);
					result = oFF.PrUtilsJsonPath.addJsonPathElementToMap(jsonPathWithProperty, structureProperty, result);
					if (recursive)
					{
						result = oFF.PrUtilsJsonPath.addJsonPathElementsRecursive(jsonPathWithProperty, structureProperty, result, recursive);
					}
				}
			}
		}
		let list = oFF.PrUtils.asList(element);
		if (oFF.notNull(list))
		{
			for (let listIndex = 0; listIndex < oFF.PrUtils.getListSize(list, 0); listIndex++)
			{
				let listElement = oFF.PrUtils.getElement(list, listIndex);
				if (oFF.isNull(listElement))
				{
					continue;
				}
				let jsonPathWithElementIndex = oFF.PrUtilsJsonPath.increaseJsonPath(currentJsonPath, null, listIndex);
				result = oFF.PrUtilsJsonPath.addJsonPathElementToMap(jsonPathWithElementIndex, listElement, result);
				if (recursive)
				{
					result = oFF.PrUtilsJsonPath.addJsonPathElementsRecursive(jsonPathWithElementIndex, listElement, result, recursive);
				}
			}
		}
		return result;
	},
	checkJsonPathConstraints:function(jsonPath)
	{
			let tokens = oFF.PrUtilsJsonPath.getJsonPathTokens(jsonPath);
		if (oFF.isNull(tokens))
		{
			return oFF.XMessage.createError(oFF.OriginLayer.UTILITY, "json path null", null, false, null);
		}
		if (tokens.isEmpty())
		{
			return oFF.XMessage.createError(oFF.OriginLayer.UTILITY, "json path must start with $", null, false, null);
		}
		let isRecursiveSearch = false;
		for (let tokenIndex = 0; tokenIndex < tokens.size(); tokenIndex++)
		{
			let token = tokens.get(tokenIndex);
			if (oFF.isNull(token))
			{
				return oFF.XMessage.createError(oFF.OriginLayer.UTILITY, "json path token must not be null", null, false, null);
			}
			if (!oFF.XString.isEqual(token, oFF.XString.trim(token)))
			{
				return oFF.XMessage.createError(oFF.OriginLayer.UTILITY, "json path token must not contain whitespaces", null, false, null);
			}
			let node;
			let indexOperators = oFF.PrUtilsJsonPath.getJsonPathIndexOperators(token);
			if (oFF.isNull(indexOperators))
			{
				node = token;
			}
			else
			{
				node = oFF.PrUtilsJsonPath.getJsonPathNode(token);
			}
			if (!oFF.XString.isEqual(node, oFF.XString.trim(node)))
			{
				return oFF.XMessage.createError(oFF.OriginLayer.UTILITY, "json path token must not contain whitespaces", null, false, null);
			}
			if (tokenIndex === 0)
			{
				if (!oFF.XString.isEqual(node, "$"))
				{
					return oFF.XMessage.createError(oFF.OriginLayer.UTILITY, "json path must start with $", null, false, null);
				}
			}
			else
			{
				if (oFF.XString.isEqual(node, "$"))
				{
					return oFF.XMessage.createError(oFF.OriginLayer.UTILITY, "$ must only be used at first position", null, false, null);
				}
				else if (oFF.XString.isEqual(token, ""))
				{
					if (isRecursiveSearch)
					{
						return oFF.XMessage.createError(oFF.OriginLayer.UTILITY, "... is not valid, instead use .. for recursive search", null, false, null);
					}
					isRecursiveSearch = true;
				}
				else
				{
					isRecursiveSearch = false;
				}
			}
			if (oFF.notNull(indexOperators))
			{
				for (let operatorsIndex = 0; operatorsIndex < indexOperators.size(); operatorsIndex++)
				{
					let indexOperator = indexOperators.get(operatorsIndex);
					let operatorTokens = oFF.PrUtilsJsonPath.getJsonPathIndexOperatorTokens(indexOperator);
					if (oFF.isNull(operatorTokens))
					{
						return oFF.XMessage.createError(oFF.OriginLayer.UTILITY, "[] empty operator is not valid", null, false, null);
					}
					for (let operatorTokenIndex = 0; operatorTokenIndex < operatorTokens.size(); operatorTokenIndex++)
					{
						let operatorToken = operatorTokens.get(operatorTokenIndex);
						if (oFF.isNull(operatorToken))
						{
							return oFF.XMessage.createError(oFF.OriginLayer.UTILITY, "[] empty operator is not valid", null, false, null);
						}
						if (!oFF.XString.isEqual(operatorToken, oFF.XString.trim(operatorToken)))
						{
							return oFF.XMessage.createError(oFF.OriginLayer.UTILITY, "operator must not contain whitespaces", null, false, null);
						}
						if (oFF.XString.isEqual(operatorToken, ""))
						{
							return oFF.XMessage.createError(oFF.OriginLayer.UTILITY, "[] empty operator is not valid", null, false, null);
						}
						if (oFF.XString.isEqual(operatorToken, "*"))
						{
							if (operatorTokenIndex > 0)
							{
								return oFF.XMessage.createError(oFF.OriginLayer.UTILITY, "[*] operator is not valid in combination with other operators", null, false, null);
							}
							continue;
						}
						let operatorFirst = oFF.PrUtilsJsonPath.getJsonPathIndexOperatorFirst(operatorToken);
						if (operatorFirst < -1)
						{
							return oFF.XMessage.createError(oFF.OriginLayer.UTILITY, oFF.XStringUtils.concatenate3("[", operatorToken, "] invalid first operator, valid is 1 to n"), null, false, null);
						}
						if (operatorFirst > 0)
						{
							continue;
						}
						let operatorLast = oFF.PrUtilsJsonPath.getJsonPathIndexOperatorLast(operatorToken);
						if (operatorLast < -1)
						{
							return oFF.XMessage.createError(oFF.OriginLayer.UTILITY, oFF.XStringUtils.concatenate3("[", operatorToken, "] invalid last operator, valid is -1 to -n"), null, false, null);
						}
						if (operatorLast > 0)
						{
							continue;
						}
						let operatorNumber = oFF.PrUtilsJsonPath.getJsonPathIndexOperatorNumber(operatorToken);
						if (operatorNumber < 0)
						{
							return oFF.XMessage.createError(oFF.OriginLayer.UTILITY, oFF.XStringUtils.concatenate3("[", operatorToken, "] invalid number, valid is 0 to n"), null, false, null);
						}
					}
				}
			}
		}
		return null;
	},
	getFirstElementFromPath:function(element, jsonPath)
	{
			return oFF.PrUtilsJsonPath.getJsonPathSingleElement(oFF.PrUtilsJsonPath.getJsonPathElements(element, jsonPath));
	},
	getJsonPathElements:function(element, jsonPath)
	{
			let tokens = oFF.PrUtilsJsonPath.getJsonPathTokens(jsonPath);
		let pathsToElements = oFF.PrUtilsJsonPath.getJsonPathElementsInternal(element, tokens, 0, null, null);
		return pathsToElements;
	},
	getJsonPathElementsInternal:function(element, tokens, tokenIndex, existingResult, currentJsonPath)
	{
			let tokenSize = tokens.size();
		if (tokenSize <= tokenIndex)
		{
			return null;
		}
		let token = tokens.get(tokenIndex);
		let node;
		let indexOperators = oFF.PrUtilsJsonPath.getJsonPathIndexOperators(token);
		if (oFF.isNull(indexOperators))
		{
			node = token;
		}
		else
		{
			node = oFF.PrUtilsJsonPath.getJsonPathNode(token);
		}
		let navTargets = null;
		if (oFF.XString.isEqual(node, "$"))
		{
			navTargets = oFF.PrUtilsJsonPath.addJsonPathElementToMap(oFF.PrUtilsJsonPath.increaseJsonPath(currentJsonPath, "$", -1), element, navTargets);
		}
		else if (oFF.XString.isEqual(node, "*"))
		{
			navTargets = oFF.PrUtilsJsonPath.addJsonPathElementsRecursive(currentJsonPath, element, navTargets, false);
		}
		else if (oFF.XString.isEqual(node, ""))
		{
			navTargets = oFF.PrUtilsJsonPath.addJsonPathElementToMap(currentJsonPath, element, navTargets);
			navTargets = oFF.PrUtilsJsonPath.addJsonPathElementsRecursive(currentJsonPath, element, navTargets, true);
		}
		else
		{
			let structureProperty = oFF.PrUtils.getProperty(oFF.PrUtils.asStructure(element), node);
			if (oFF.notNull(structureProperty))
			{
				navTargets = oFF.PrUtilsJsonPath.addJsonPathElementToMap(oFF.PrUtilsJsonPath.increaseJsonPath(currentJsonPath, node, -1), structureProperty, navTargets);
			}
		}
		if (oFF.notNull(indexOperators))
		{
			navTargets = oFF.PrFilter.create().withLists().filterJsonPathElements(navTargets);
			if (oFF.notNull(navTargets))
			{
				let navTargetsResolved = null;
				let navTargetPaths = navTargets.getKeysAsReadOnlyList();
				for (let navTargetIndex = 0; navTargetIndex < navTargetPaths.size(); navTargetIndex++)
				{
					let navTargetPath = navTargetPaths.get(navTargetIndex);
					let navTargetList = navTargets.getByKey(navTargetPath);
					navTargetsResolved = oFF.PrUtilsJsonPath.resolveJsonPathIndexOperators(navTargetPath, navTargetList, navTargetsResolved, indexOperators, 0);
				}
				navTargets = navTargetsResolved;
			}
		}
		let result = existingResult;
		if (oFF.notNull(navTargets) && navTargets.size() > 0)
		{
			let isFinalToken = tokenIndex + 1 === tokenSize;
			let navTargetJsonPaths = navTargets.getKeysAsReadOnlyList();
			for (let navTargetIndex2 = 0; navTargetIndex2 < navTargetJsonPaths.size(); navTargetIndex2++)
			{
				let navTargetJsonPath = navTargetJsonPaths.get(navTargetIndex2);
				let navTargetElement = navTargets.getByKey(navTargetJsonPath);
				if (isFinalToken)
				{
					result = oFF.PrUtilsJsonPath.addJsonPathElementToMap(navTargetJsonPath, navTargetElement, result);
				}
				else
				{
					result = oFF.PrUtilsJsonPath.getJsonPathElementsInternal(navTargetElement, tokens, tokenIndex + 1, result, navTargetJsonPath);
				}
			}
		}
		return result;
	},
	getJsonPathIndexOperatorFirst:function(indexOperator)
	{
			if (oFF.isNull(indexOperator))
		{
			return -1;
		}
		if (!oFF.XString.startsWith(indexOperator, ":"))
		{
			return -1;
		}
		let firstString = oFF.XString.substring(indexOperator, 1, oFF.XString.size(indexOperator));
		let first = oFF.XInteger.convertFromStringWithDefault(firstString, 0);
		if (first < 1)
		{
			return -2;
		}
		return first;
	},
	getJsonPathIndexOperatorLast:function(indexOperator)
	{
			if (oFF.isNull(indexOperator))
		{
			return -1;
		}
		if (!oFF.XString.endsWith(indexOperator, ":"))
		{
			return -1;
		}
		let lastString = oFF.XStringUtils.stripRight(indexOperator, 1);
		let last = oFF.XInteger.convertFromStringWithDefault(lastString, 0);
		if (last > -1)
		{
			return -2;
		}
		return last * -1;
	},
	getJsonPathIndexOperatorNumber:function(indexOperator)
	{
			return oFF.XInteger.convertFromStringWithDefault(indexOperator, -1);
	},
	getJsonPathIndexOperatorTokens:function(indexOperator)
	{
			if (oFF.XStringUtils.isNullOrEmpty(indexOperator))
		{
			return null;
		}
		let tokens = oFF.XStringTokenizer.splitString(indexOperator, ",");
		if (oFF.isNull(tokens) || tokens.size() < 1)
		{
			return null;
		}
		return tokens;
	},
	getJsonPathIndexOperators:function(token)
	{
			if (oFF.isNull(token))
		{
			return null;
		}
		if (!oFF.XString.endsWith(token, "]"))
		{
			return null;
		}
		let firstIndex = oFF.XString.indexOf(token, "[");
		if (firstIndex < 0)
		{
			return null;
		}
		let operators = oFF.XString.substring(token, firstIndex + 1, oFF.XString.size(token) - 1);
		return oFF.XStringTokenizer.splitString(operators, "][");
	},
	getJsonPathNode:function(token)
	{
			if (oFF.isNull(token))
		{
			return null;
		}
		if (!oFF.XString.endsWith(token, "]"))
		{
			return token;
		}
		let firstIndex = oFF.XString.indexOf(token, "[");
		if (firstIndex < 0)
		{
			return token;
		}
		return oFF.XString.substring(token, 0, firstIndex);
	},
	getJsonPathSingleElement:function(elements)
	{
			if (oFF.isNull(elements) || elements.size() !== 1)
		{
			return null;
		}
		return elements.getByKey(elements.getKeysAsReadOnlyList().get(0));
	},
	getJsonPathSinglePath:function(elements)
	{
			if (oFF.isNull(elements) || elements.size() !== 1)
		{
			return null;
		}
		return elements.getKeysAsReadOnlyList().get(0);
	},
	getJsonPathTokens:function(jsonPath)
	{
			if (oFF.XStringUtils.isNullOrEmpty(jsonPath))
		{
			return null;
		}
		let startsWithDot = oFF.XString.startsWith(jsonPath, ".");
		let endsWithDot = oFF.XString.endsWith(jsonPath, ".");
		let jsonPathNormalized = jsonPath;
		if (startsWithDot || endsWithDot)
		{
			let sb = oFF.XStringBuffer.create();
			if (startsWithDot)
			{
				sb.append("startsWithDot");
			}
			sb.append(jsonPath);
			if (endsWithDot)
			{
				sb.append("endsWithDot");
			}
			jsonPathNormalized = sb.toString();
		}
		let tokens = oFF.XStringTokenizer.splitString(jsonPathNormalized, ".");
		if (oFF.isNull(tokens) || tokens.size() < 1)
		{
			return null;
		}
		if (startsWithDot || endsWithDot)
		{
			let normalizedTokens = oFF.XList.create();
			for (let tokenIndex = 0; tokenIndex < tokens.size(); tokenIndex++)
			{
				if (tokenIndex === 0 && startsWithDot)
				{
					continue;
				}
				if (tokenIndex + 1 === tokens.size() && endsWithDot)
				{
					continue;
				}
				normalizedTokens.add(tokens.get(tokenIndex));
			}
			tokens = normalizedTokens;
		}
		return tokens;
	},
	increaseJsonPath:function(existingJsonPath, newPathToken, index)
	{
			let sb = oFF.XStringBuffer.create();
		if (oFF.notNull(existingJsonPath))
		{
			sb.append(existingJsonPath);
		}
		if (oFF.notNull(newPathToken))
		{
			if (sb.length() > 0)
			{
				sb.append(".");
			}
			sb.append(newPathToken);
		}
		if (index > -1)
		{
			sb.append("[");
			sb.appendInt(index);
			sb.append("]");
		}
		if (sb.length() === 0)
		{
			return null;
		}
		return sb.toString();
	},
	resolveJsonPathIndexOperators:function(jsonPath, list, existingResults, indexOperators, operatorIndex)
	{
			if (oFF.isNull(list))
		{
			return existingResults;
		}
		if (oFF.isNull(indexOperators))
		{
			return existingResults;
		}
		if (operatorIndex < 0)
		{
			return existingResults;
		}
		let operatorSize = indexOperators.size();
		if (operatorIndex >= operatorSize)
		{
			return existingResults;
		}
		let indexOperator = indexOperators.get(operatorIndex);
		let operatorTokens = oFF.PrUtilsJsonPath.getJsonPathIndexOperatorTokens(indexOperator);
		if (oFF.isNull(operatorTokens))
		{
			return existingResults;
		}
		let navResults = null;
		for (let tokenIndex = 0; tokenIndex < operatorTokens.size(); tokenIndex++)
		{
			let operatorToken = operatorTokens.get(tokenIndex);
			if (oFF.XString.isEqual(operatorToken, "*"))
			{
				navResults = oFF.PrUtilsJsonPath.addJsonPathElementsRecursive(jsonPath, list, navResults, false);
			}
			else
			{
				let listSize = oFF.PrUtils.getListSize(list, 0);
				let operatorFirst = oFF.PrUtilsJsonPath.getJsonPathIndexOperatorFirst(operatorToken);
				if (operatorFirst > 0)
				{
					if (operatorFirst > listSize)
					{
						operatorFirst = listSize;
					}
					for (let firstIndex = 0; firstIndex < operatorFirst; firstIndex++)
					{
						navResults = oFF.PrUtilsJsonPath.addJsonPathElementToMap(oFF.PrUtilsJsonPath.increaseJsonPath(jsonPath, null, firstIndex), oFF.PrUtils.getElement(list, firstIndex), navResults);
					}
				}
				else
				{
					let operatorLast = oFF.PrUtilsJsonPath.getJsonPathIndexOperatorLast(operatorToken);
					if (operatorLast > 0)
					{
						if (operatorLast > listSize)
						{
							operatorLast = listSize;
						}
						let lastIncrement = listSize - operatorLast;
						for (let lastIndex = lastIncrement; lastIndex < operatorLast + lastIncrement; lastIndex++)
						{
							navResults = oFF.PrUtilsJsonPath.addJsonPathElementToMap(oFF.PrUtilsJsonPath.increaseJsonPath(jsonPath, null, lastIndex), oFF.PrUtils.getElement(list, lastIndex), navResults);
						}
					}
					else
					{
						let operatorNumber = oFF.PrUtilsJsonPath.getJsonPathIndexOperatorNumber(operatorToken);
						if (operatorNumber > -1)
						{
							navResults = oFF.PrUtilsJsonPath.addJsonPathElementToMap(oFF.PrUtilsJsonPath.increaseJsonPath(jsonPath, null, operatorNumber), oFF.PrUtils.getElement(list, operatorNumber), navResults);
						}
					}
				}
			}
		}
		let results = existingResults;
		let isFinalOperator = operatorIndex + 1 === operatorSize;
		if (!isFinalOperator)
		{
			navResults = oFF.PrFilter.create().withLists().filterJsonPathElements(navResults);
		}
		if (oFF.notNull(navResults))
		{
			let navResultPaths = navResults.getKeysAsReadOnlyList();
			for (let navResultIndex = 0; navResultIndex < navResultPaths.size(); navResultIndex++)
			{
				let navResultPath = navResultPaths.get(navResultIndex);
				let navResultElement = navResults.getByKey(navResultPath);
				if (isFinalOperator)
				{
					results = oFF.PrUtilsJsonPath.addJsonPathElementToMap(navResultPath, navResultElement, results);
				}
				else
				{
					results = oFF.PrUtilsJsonPath.resolveJsonPathIndexOperators(navResultPath, oFF.PrUtils.asList(navResultElement), results, indexOperators, operatorIndex + 1);
				}
			}
		}
		return results;
	},
	sortJsonPathElements:function(pathsToElements)
	{
			if (oFF.isNull(pathsToElements) || pathsToElements.size() < 1)
		{
			return null;
		}
		let sortedPaths = oFF.PrUtilsJsonPath.sortJsonPaths(pathsToElements.getKeysAsReadOnlyList());
		let result = oFF.XList.create();
		for (let pathIndex = 0; pathIndex < sortedPaths.size(); pathIndex++)
		{
			let element = pathsToElements.getByKey(sortedPaths.get(pathIndex));
			result.add(element);
		}
		return result;
	},
	sortJsonPaths:function(paths)
	{
			if (oFF.isNull(paths) || paths.size() < 1)
		{
			return null;
		}
		let pathsToTokens = oFF.XHashMapByString.create();
		let maxTokenSize = 0;
		for (let pathIndex1 = 0; pathIndex1 < paths.size(); pathIndex1++)
		{
			let path1 = paths.get(pathIndex1);
			let tokens1 = oFF.PrUtilsJsonPath.getJsonPathTokens(path1);
			pathsToTokens.put(path1, tokens1);
			let tokenSize1 = tokens1.size();
			if (tokenSize1 > maxTokenSize)
			{
				maxTokenSize = tokenSize1;
			}
		}
		let tokenIndexMaxChars = oFF.XArrayOfInt.create(maxTokenSize);
		for (let pathIndex2 = 0; pathIndex2 < paths.size(); pathIndex2++)
		{
			let path2 = paths.get(pathIndex2);
			let tokens2 = pathsToTokens.getByKey(path2);
			for (let tokenIndex2 = 0; tokenIndex2 < tokens2.size(); tokenIndex2++)
			{
				let tokenChars2 = oFF.XString.size(tokens2.get(tokenIndex2));
				if (tokenChars2 > tokenIndexMaxChars.get(tokenIndex2))
				{
					tokenIndexMaxChars.set(tokenIndex2, tokenChars2);
				}
			}
		}
		let normalizedPathsToPaths = oFF.XHashMapByString.create();
		for (let pathIndex3 = 0; pathIndex3 < paths.size(); pathIndex3++)
		{
			let path3 = paths.get(pathIndex3);
			let tokens3 = pathsToTokens.getByKey(path3);
			let normalizedPath3 = oFF.XStringBuffer.create();
			for (let tokenIndex3 = 0; tokenIndex3 < tokens3.size(); tokenIndex3++)
			{
				if (tokenIndex3 > 0)
				{
					normalizedPath3.append(".");
				}
				let token3 = tokens3.get(tokenIndex3);
				normalizedPath3.append(token3);
				let actualTokenChars3 = oFF.XString.size(token3);
				let maxTokenChars3 = tokenIndexMaxChars.get(tokenIndex3);
				for (let missingCharsIndex3 = 0; missingCharsIndex3 < maxTokenChars3 - actualTokenChars3; missingCharsIndex3++)
				{
					normalizedPath3.append(" ");
				}
			}
			normalizedPathsToPaths.put(normalizedPath3.toString(), path3);
		}
		let normalizedSortedPaths = oFF.XList.createWithList(normalizedPathsToPaths.getKeysAsReadOnlyList());
		normalizedSortedPaths.sortByDirection(oFF.XSortDirection.ASCENDING);
		let sortedPaths = oFF.XList.create();
		for (let normalizedPathIndex = 0; normalizedPathIndex < normalizedSortedPaths.size(); normalizedPathIndex++)
		{
			let normalizedPath = normalizedSortedPaths.get(normalizedPathIndex);
			let path = normalizedPathsToPaths.getByKey(normalizedPath);
			sortedPaths.add(path);
		}
		return sortedPaths;
	}
};

oFF.ReplaceTagHandler = {

	charDot:46,
	findTagValue:function(startElement, tag)
	{
			let dots = 0;
		let tagLen = oFF.XString.size(tag);
		while (dots < tagLen && oFF.XString.getCharAt(tag, dots) === oFF.ReplaceTagHandler.charDot)
		{
			dots++;
		}
		let current = startElement;
		for (let j = 0; j < dots - 1; j++)
		{
			current = current.getParent();
			if (current.isList())
			{
				current = current.getParent();
			}
		}
		let tagName = oFF.XString.substring(tag, dots, -1);
		return oFF.PrUtils.convertElementToStringValue(current.asStructure().getByKey(tagName), null);
	},
	handle:function(element, value)
	{
			let result = value;
		while (oFF.XString.containsString(result, "<<") || oFF.XString.containsString(result, ">>"))
		{
			result = oFF.ReplaceTagHandler.handleReplaceTags(element, result);
		}
		return result;
	},
	handleReplaceTags:function(element, value)
	{
			let buffer = oFF.XStringBuffer.create();
		let pieces = oFF.XStringTokenizer.splitString(value, "<<");
		let len = pieces.size();
		for (let i = 0; i < len; i++)
		{
			let piece = pieces.get(i);
			if (oFF.XStringUtils.isNullOrEmpty(piece))
			{
				continue;
			}
			let closeIndex = oFF.XString.indexOf(piece, ">>");
			if (closeIndex === -1)
			{
				buffer.append(piece);
				continue;
			}
			let tag = oFF.XString.substring(piece, 0, closeIndex);
			let replaceValue = oFF.ReplaceTagHandler.findTagValue(element, tag);
			if (oFF.isNull(replaceValue))
			{
				return null;
			}
			buffer.append(replaceValue);
			buffer.append(oFF.XString.substring(piece, closeIndex + 2, -1));
		}
		return buffer.toString();
	}
};

oFF.TemplateWalker = {

	TEMPLATES:"templates",
	root:null,
	walk:function(root)
	{
			if (!root.containsKey(oFF.TemplateWalker.TEMPLATES))
		{
			return root;
		}
		let copy = oFF.PrUtils.deepCopyElement(root).asStructure();
		oFF.TemplateWalker.root = copy;
		oFF.TemplateWalker.walkStructure(copy);
		return copy;
	},
	walkList:function(parentList)
	{
			let len = parentList.size();
		for (let i = 0; i < len; i++)
		{
			let childElement = parentList.get(i);
			if (oFF.isNull(childElement))
			{
				continue;
			}
			let childType = childElement.getType();
			if (childType === oFF.PrElementType.STRUCTURE)
			{
				let childStruct = childElement.asStructure();
				if (childStruct.containsKey("$ref"))
				{
					let templateStructure = oFF.PrTemplateStructure.createStructureWrapper(oFF.TemplateWalker.root, parentList, childStruct);
					parentList.set(i, templateStructure);
				}
				else
				{
					oFF.TemplateWalker.walkStructure(childStruct);
				}
			}
			else if (childType === oFF.PrElementType.LIST)
			{
				oFF.TemplateWalker.walkList(childElement.asList());
			}
		}
	},
	walkStructure:function(parentStruct)
	{
			let elementNames = parentStruct.getKeysAsReadOnlyList();
		let len = elementNames.size();
		for (let i = 0; i < len; i++)
		{
			let childName = elementNames.get(i);
			let childElement = parentStruct.getByKey(childName);
			if (oFF.isNull(childElement) || oFF.XString.isEqual(childName, oFF.TemplateWalker.TEMPLATES))
			{
				continue;
			}
			let childType = childElement.getType();
			if (childType === oFF.PrElementType.STRUCTURE)
			{
				let childStruct = childElement.asStructure();
				if (childStruct.containsKey("$ref"))
				{
					let templateStructure = oFF.PrTemplateStructure.createStructureWrapper(oFF.TemplateWalker.root, parentStruct, childStruct);
					parentStruct.put(childName, templateStructure);
				}
				else
				{
					oFF.TemplateWalker.walkStructure(childStruct);
				}
			}
			else if (childType === oFF.PrElementType.LIST)
			{
				oFF.TemplateWalker.walkList(childElement.asList());
			}
		}
	}
};

oFF.XmlDocumentSerializer = function() {};
oFF.XmlDocumentSerializer.prototype = new oFF.XObject();
oFF.XmlDocumentSerializer.prototype._ff_c = "XmlDocumentSerializer";

oFF.XmlDocumentSerializer.create = function()
{
	let object = new oFF.XmlDocumentSerializer();
	object.initialize(false, false, 0);
	return object;
};
oFF.XmlDocumentSerializer.createPretty = function(indentation)
{
	let object = new oFF.XmlDocumentSerializer();
	object.initialize(false, true, indentation);
	return object;
};
oFF.XmlDocumentSerializer.createSort = function()
{
	let object = new oFF.XmlDocumentSerializer();
	object.initialize(true, false, 0);
	return object;
};
oFF.XmlDocumentSerializer.createSortPretty = function(indentation)
{
	let object = new oFF.XmlDocumentSerializer();
	object.initialize(true, true, indentation);
	return object;
};
oFF.XmlDocumentSerializer.prototype.m_buffer = null;
oFF.XmlDocumentSerializer.prototype.m_indentation = 0;
oFF.XmlDocumentSerializer.prototype.m_prettyPrint = false;
oFF.XmlDocumentSerializer.prototype.m_sortStructureElements = false;
oFF.XmlDocumentSerializer.prototype.appendAttribute = function(element, elementName)
{
	this.getBuffer().append(" ");
	if (oFF.isNull(elementName))
	{
		this.getBuffer().append("null");
	}
	else
	{
		this.getBuffer().append(elementName);
	}
	this.getBuffer().append("=\"");
	this.appendTextContent(element, oFF.XmlUtils.ATTRIBUTE_ESCAPE);
	this.getBuffer().append("\"");
};
oFF.XmlDocumentSerializer.prototype.appendElement = function(element, elementName, indentationLevel)
{
	if (this.isPrettyPrint())
	{
		this.appendIndentationString(indentationLevel);
	}
	if (oFF.isNull(element))
	{
		this.getBuffer().append("null");
	}
	else
	{
		if (element.isStructure())
		{
			this.appendStructure(element, elementName, indentationLevel);
		}
		else if (element.isList())
		{
			this.appendList(element, elementName, indentationLevel);
		}
		else
		{
			if (this.isPrettyPrint())
			{
				this.getBuffer().appendNewLine();
				this.appendIndentationString(indentationLevel);
			}
			this.appendTextContent(element, oFF.XmlUtils.TEXT_NODE_ESCAPE);
		}
	}
};
oFF.XmlDocumentSerializer.prototype.appendIndentationString = function(indentationLevel)
{
	if (this.getIndentation() >= 1 && indentationLevel >= 1)
	{
		let spaces = this.getIndentation() * indentationLevel;
		for (let i = 0; i < spaces; i++)
		{
			this.getBuffer().append(" ");
		}
	}
};
oFF.XmlDocumentSerializer.prototype.appendList = function(element, elementName, indentationLevel)
{
	let list = element.asList();
	let size = list.size();
	for (let i = 0; i < size; i++)
	{
		this.appendStructure(list.get(i), elementName, indentationLevel);
	}
};
oFF.XmlDocumentSerializer.prototype.appendPrologElement = function(prologDirective, prologDirectiveName)
{
	if (oFF.notNull(prologDirective))
	{
		this.getBuffer().append("<").append(prologDirectiveName);
		let prologAttributeNames = prologDirective.getKeysAsReadOnlyList();
		for (let i = 0; i < prologAttributeNames.size(); i++)
		{
			let prologAttributeName = prologAttributeNames.get(i);
			let prologElement = prologDirective.getByKey(prologAttributeName);
			if (oFF.XString.startsWith(prologAttributeName, "-") && (prologElement.isString() || prologElement.isDouble() || prologElement.isBoolean() || prologElement.isNumeric() || prologElement.getType() === oFF.PrElementType.THE_NULL))
			{
				this.appendAttribute(prologElement, oFF.XString.substring(prologAttributeName, 1, oFF.XString.size(prologAttributeName)));
			}
			else
			{
				throw oFF.XException.createIllegalArgumentException("INVALID PROLOG RULE");
			}
		}
		this.getBuffer().append("?>");
	}
	else
	{
		throw oFF.XException.createIllegalArgumentException("INVALID PROLOG RULE");
	}
};
oFF.XmlDocumentSerializer.prototype.appendStructure = function(element, elementName, indentationLevel)
{
	let i;
	let structureElementName;
	let structureElement;
	if (this.isPrettyPrint())
	{
		this.getBuffer().appendNewLine();
		this.appendIndentationString(indentationLevel);
	}
	this.getBuffer().append("<");
	this.getBuffer().append(elementName);
	if (element.isString() || element.isDouble() || element.isBoolean() || element.isNumeric() || element.getType() === oFF.PrElementType.THE_NULL)
	{
		this.getBuffer().append(">");
		if (this.isPrettyPrint())
		{
			this.getBuffer().appendNewLine();
			this.appendIndentationString(indentationLevel + 1);
		}
		this.appendTextContent(element, oFF.XmlUtils.TEXT_NODE_ESCAPE);
		if (this.isPrettyPrint())
		{
			this.getBuffer().appendNewLine();
			this.appendIndentationString(indentationLevel);
		}
		this.getBuffer().append("</");
		this.getBuffer().append(elementName);
		this.getBuffer().append(">");
		return;
	}
	let structure = element.asStructure();
	let structureElementNames = oFF.XList.createWithList(structure.getKeysAsReadOnlyList());
	let emptyTag = true;
	if (oFF.notNull(structureElementNames))
	{
		let structureSize = structureElementNames.size();
		if (this.isSortStructureElements() && structureSize > 1)
		{
			structureElementNames.sortByDirection(oFF.XSortDirection.ASCENDING);
		}
		for (i = 0; i < structureSize; i++)
		{
			structureElementName = structureElementNames.get(i);
			structureElement = structure.getByKey(structureElementName);
			if (oFF.XString.startsWith(structureElementName, "-") && (structureElement.isString() || structureElement.isDouble() || structureElement.isBoolean() || structureElement.isNumeric() || structureElement.getType() === oFF.PrElementType.THE_NULL))
			{
				this.appendAttribute(structureElement, oFF.XString.substring(structureElementName, 1, oFF.XString.size(structureElementName)));
			}
			else
			{
				emptyTag = false;
			}
		}
		if (emptyTag)
		{
			this.getBuffer().append("/");
		}
		this.getBuffer().append(">");
		for (i = 0; i < structureSize; i++)
		{
			structureElementName = structureElementNames.get(i);
			structureElement = structure.getByKey(structureElementName);
			if (oFF.XString.startsWith(structureElementName, "-") && (structureElement.isString() || structureElement.isDouble() || structureElement.isBoolean() || structureElement.isNumeric() || structureElement.getType() === oFF.PrElementType.THE_NULL))
			{
				continue;
			}
			this.appendElement(structureElement, structureElementName, indentationLevel + 1);
		}
	}
	else
	{
		this.getBuffer().append("/");
		this.getBuffer().append(">");
	}
	if (!emptyTag)
	{
		if (this.isPrettyPrint())
		{
			this.getBuffer().appendNewLine();
			this.appendIndentationString(indentationLevel);
		}
		this.getBuffer().append("</");
		this.getBuffer().append(elementName);
		this.getBuffer().append(">");
	}
};
oFF.XmlDocumentSerializer.prototype.appendTextContent = function(element, ESCAPE_LEVEL)
{
	if (element.isString())
	{
		let stringValue = element.asString().getString();
		if (oFF.isNull(stringValue))
		{
			this.getBuffer().append("null");
		}
		else
		{
			this.getBuffer().append(oFF.XmlUtils.escapeXml(oFF.XmlUtils.unescapeJson(stringValue), ESCAPE_LEVEL));
		}
	}
	else if (element.isDouble())
	{
		this.getBuffer().appendDouble(element.asNumber().getDouble());
	}
	else if (element.isNumeric())
	{
		this.getBuffer().appendLong(element.asNumber().getLong());
	}
	else if (element.isBoolean())
	{
		if (element.asBoolean().getBoolean())
		{
			this.getBuffer().append("true");
		}
		else
		{
			this.getBuffer().append("false");
		}
	}
	else if (element.getType() === oFF.PrElementType.THE_NULL)
	{
		this.getBuffer().append("null");
	}
};
oFF.XmlDocumentSerializer.prototype.getBuffer = function()
{
	return this.m_buffer;
};
oFF.XmlDocumentSerializer.prototype.getIndentation = function()
{
	return this.m_indentation;
};
oFF.XmlDocumentSerializer.prototype.initialize = function(sortStructureElements, prettyPrint, indentation)
{
	this.setBuffer(oFF.XStringBuffer.create());
	this.setSortStructureElements(sortStructureElements);
	this.setPrettyPrint(prettyPrint);
	this.setIndentation(indentation);
};
oFF.XmlDocumentSerializer.prototype.isPrettyPrint = function()
{
	return this.m_prettyPrint;
};
oFF.XmlDocumentSerializer.prototype.isSortStructureElements = function()
{
	return this.m_sortStructureElements;
};
oFF.XmlDocumentSerializer.prototype.serialize = function(element)
{
	this.getBuffer().clear();
	if (!element.isStructure())
	{
		throw oFF.XException.createIllegalArgumentException("INVALID ROOT ELEMENT: Must be Structure");
	}
	let structure = element.asStructure();
	let elementNames = structure.getKeysAsReadOnlyList();
	if (oFF.isNull(elementNames))
	{
		throw oFF.XException.createIllegalArgumentException("INVALID ROOT ELEMENT: Must be Structure");
	}
	let prologDirectives = oFF.XStream.ofString(elementNames).filter((spr) => {
		return oFF.XString.startsWith(spr.getString(), "?");
	}).collect(oFF.XStreamCollector.toListOfString((ipem) => {
		return ipem.getString();
	}));
	let documentElementNames = oFF.XStream.ofString(elementNames).filter((str) => {
		return !oFF.XString.startsWith(str.getString(), "?");
	}).collect(oFF.XStreamCollector.toListOfString((item) => {
		return item.getString();
	}));
	let structureSize = documentElementNames.size();
	if (structureSize !== 1)
	{
		throw oFF.XException.createIllegalArgumentException("INVALID ROOT ELEMENT: Must be at most one root element");
	}
	for (let i = 0; i < prologDirectives.size(); i++)
	{
		let prologDirectiveName = prologDirectives.get(i);
		this.appendPrologElement(structure.getStructureByKey(prologDirectiveName), prologDirectiveName);
	}
	let structureElementName = documentElementNames.get(0);
	let structureElement = structure.getByKey(structureElementName);
	if (structureElement.isStructure())
	{
		this.appendStructure(structureElement, structureElementName, 0);
	}
	else
	{
		throw oFF.XException.createIllegalArgumentException("INVALID ROOT ELEMENT: Must be Structure");
	}
	return this.getBuffer().toString();
};
oFF.XmlDocumentSerializer.prototype.setBuffer = function(buffer)
{
	this.m_buffer = buffer;
};
oFF.XmlDocumentSerializer.prototype.setIndentation = function(indentation)
{
	this.m_indentation = indentation;
};
oFF.XmlDocumentSerializer.prototype.setPrettyPrint = function(prettyPrint)
{
	this.m_prettyPrint = prettyPrint;
};
oFF.XmlDocumentSerializer.prototype.setSortStructureElements = function(sortStructureElements)
{
	this.m_sortStructureElements = sortStructureElements;
};

oFF.XmlDomPrUtil = {

	appendChildElement:function(baseElement, elementName)
	{
			return oFF.XmlDomPrUtil.appendChildElementWithTextContent(baseElement, elementName, null);
	},
	appendChildElementWithTextContent:function(baseElement, elementName, textNodeContent)
	{
			let baseElementType = baseElement.getElementTypeByKey(elementName);
		let newStructure = null;
		if (baseElementType === oFF.PrElementType.THE_NULL)
		{
			newStructure = baseElement.putNewStructure(elementName);
		}
		else if (baseElementType === oFF.PrElementType.LIST)
		{
			newStructure = baseElement.getListByKey(elementName).addNewStructure();
		}
		else if (baseElementType === oFF.PrElementType.STRUCTURE)
		{
			let existingElement = baseElement.getStructureByKey(elementName);
			let newList = baseElement.putNewList(elementName);
			newList.add(existingElement);
			newStructure = newList.addNewStructure();
		}
		if (oFF.isNull(newStructure))
		{
			throw oFF.XException.createIllegalStateException("Cannot mix element children types");
		}
		else if (oFF.notNull(textNodeContent))
		{
			newStructure.putString(elementName, textNodeContent);
		}
		return newStructure;
	},
	appendPrologElement:function(baseElement, elementName)
	{
			return baseElement.putNewStructure(oFF.XStringUtils.concatenate2("?", elementName));
	},
	createDocument:function()
	{
			return oFF.PrFactory.createStructure();
	},
	getAttribute:function(baseElement, attributeName)
	{
			return baseElement.getStringByKey(oFF.XStringUtils.concatenate2("-", attributeName));
	},
	setAttribute:function(baseElement, attributeName, attributeValue)
	{
			baseElement.putString(oFF.XStringUtils.concatenate2("-", attributeName), attributeValue);
		return baseElement;
	}
};

oFF.XmlUtils = {

	AMP_CHAR:"&",
	AMP_ENTITY:"&amp;",
	APOS_CHAR:"'",
	APOS_ENTITY:"&apos;",
	ATTRIBUTE_ESCAPE:2,
	FULL_ESCAPE:3,
	GT_CHAR:">",
	GT_ENTITY:"&gt;",
	LT_CHAR:"<",
	LT_ENTITY:"&lt;",
	MUST_NOT_ESCAPE:0,
	QUOT_CHAR:"\"",
	QUOT_ENTITY:"&quot;",
	TEXT_NODE_ESCAPE:1,
	entityMappings:null,
	extendedEntityMappings:null,
	escapeXml:function(string, ESCAPE_LEVEL)
	{
			if (oFF.isNull(string))
		{
			return null;
		}
		switch (ESCAPE_LEVEL)
		{
			case oFF.XmlUtils.MUST_NOT_ESCAPE:
				return string;

			case oFF.XmlUtils.TEXT_NODE_ESCAPE:
				return oFF.XmlUtils.escapeXmlTextNodeLazy(string);

			case oFF.XmlUtils.ATTRIBUTE_ESCAPE:
				return oFF.XmlUtils.escapeXmlAttributeLazy(string);

			default:
				return oFF.XmlUtils.escapeXmlString(string);
		}
	},
	escapeXmlAttributeLazy:function(string)
	{
			if (oFF.isNull(string))
		{
			return null;
		}
		let result = oFF.XString.containsString(string, oFF.XmlUtils.AMP_CHAR) ? oFF.XString.replace(string, oFF.XmlUtils.AMP_CHAR, oFF.XmlUtils.AMP_ENTITY) : string;
		result = oFF.XString.containsString(result, oFF.XmlUtils.QUOT_CHAR) ? oFF.XString.replace(result, oFF.XmlUtils.QUOT_CHAR, oFF.XmlUtils.QUOT_ENTITY) : result;
		return oFF.XString.containsString(result, oFF.XmlUtils.LT_CHAR) ? oFF.XString.replace(result, oFF.XmlUtils.LT_CHAR, oFF.XmlUtils.LT_ENTITY) : result;
	},
	escapeXmlString:function(string)
	{
			if (oFF.isNull(string))
		{
			return null;
		}
		let result = oFF.XString.containsString(string, oFF.XmlUtils.AMP_CHAR) ? oFF.XString.replace(string, oFF.XmlUtils.AMP_CHAR, oFF.XmlUtils.AMP_ENTITY) : string;
		result = oFF.XString.containsString(result, oFF.XmlUtils.QUOT_CHAR) ? oFF.XString.replace(result, oFF.XmlUtils.QUOT_CHAR, oFF.XmlUtils.QUOT_ENTITY) : result;
		result = oFF.XString.containsString(result, oFF.XmlUtils.APOS_CHAR) ? oFF.XString.replace(result, oFF.XmlUtils.APOS_CHAR, oFF.XmlUtils.APOS_ENTITY) : result;
		result = oFF.XString.containsString(result, oFF.XmlUtils.LT_CHAR) ? oFF.XString.replace(result, oFF.XmlUtils.LT_CHAR, oFF.XmlUtils.LT_ENTITY) : result;
		return oFF.XString.containsString(result, oFF.XmlUtils.GT_CHAR) ? oFF.XString.replace(result, oFF.XmlUtils.GT_CHAR, oFF.XmlUtils.GT_ENTITY) : result;
	},
	escapeXmlTextNodeLazy:function(string)
	{
			if (oFF.isNull(string))
		{
			return null;
		}
		let result = oFF.XString.containsString(string, oFF.XmlUtils.AMP_CHAR) ? oFF.XString.replace(string, oFF.XmlUtils.AMP_CHAR, oFF.XmlUtils.AMP_ENTITY) : string;
		return oFF.XString.containsString(result, oFF.XmlUtils.LT_CHAR) ? oFF.XString.replace(result, oFF.XmlUtils.LT_CHAR, oFF.XmlUtils.LT_ENTITY) : result;
	},
	staticSetup:function()
	{
			oFF.XmlUtils.entityMappings = oFF.XHashMapByString.create();
		oFF.XmlUtils.extendedEntityMappings = oFF.XHashMapByString.create();
		oFF.XmlUtils.entityMappings.put("&quot;", "\"");
		oFF.XmlUtils.entityMappings.put("&apos;", "'");
		oFF.XmlUtils.entityMappings.put("&amp;", "&");
		oFF.XmlUtils.entityMappings.put("&lt;", "<");
		oFF.XmlUtils.entityMappings.put("&gt;", ">");
		oFF.XmlUtils.extendedEntityMappings.put("&Acirc;", "\u00C2");
		oFF.XmlUtils.extendedEntityMappings.put("&acirc;", "\u00E2");
		oFF.XmlUtils.extendedEntityMappings.put("&acute;", "\u00B4");
		oFF.XmlUtils.extendedEntityMappings.put("&AElig;", "\u00C6");
		oFF.XmlUtils.extendedEntityMappings.put("&aelig;", "\u00E6");
		oFF.XmlUtils.extendedEntityMappings.put("&Agrave;", "\u00C0");
		oFF.XmlUtils.extendedEntityMappings.put("&agrave;", "\u00E0");
		oFF.XmlUtils.extendedEntityMappings.put("&alefsym;", "\u2135");
		oFF.XmlUtils.extendedEntityMappings.put("&Alpha;", "\u0391");
		oFF.XmlUtils.extendedEntityMappings.put("&alpha;", "\u03B1");
		oFF.XmlUtils.extendedEntityMappings.put("&amp;", "&");
		oFF.XmlUtils.extendedEntityMappings.put("&and;", "\u2227");
		oFF.XmlUtils.extendedEntityMappings.put("&ang;", "\u2220");
		oFF.XmlUtils.extendedEntityMappings.put("&apos;", "'");
		oFF.XmlUtils.extendedEntityMappings.put("&Aring;", "\u00C5");
		oFF.XmlUtils.extendedEntityMappings.put("&aring;", "\u00E5");
		oFF.XmlUtils.extendedEntityMappings.put("&asymp;", "\u2248");
		oFF.XmlUtils.extendedEntityMappings.put("&Atilde;", "\u00C3");
		oFF.XmlUtils.extendedEntityMappings.put("&atilde;", "\u00E3");
		oFF.XmlUtils.extendedEntityMappings.put("&Auml;", "\u00C4");
		oFF.XmlUtils.extendedEntityMappings.put("&auml;", "\u00E4");
		oFF.XmlUtils.extendedEntityMappings.put("&bdquo;", "\u201E");
		oFF.XmlUtils.extendedEntityMappings.put("&Beta;", "\u0392");
		oFF.XmlUtils.extendedEntityMappings.put("&beta;", "\u03B2");
		oFF.XmlUtils.extendedEntityMappings.put("&brvbar;", "\u00A6");
		oFF.XmlUtils.extendedEntityMappings.put("&bull;", "\u2022");
		oFF.XmlUtils.extendedEntityMappings.put("&cap;", "\u2229");
		oFF.XmlUtils.extendedEntityMappings.put("&Ccedil;", "\u00C7");
		oFF.XmlUtils.extendedEntityMappings.put("&ccedil;", "\u00E7");
		oFF.XmlUtils.extendedEntityMappings.put("&cedil;", "\u00B8");
		oFF.XmlUtils.extendedEntityMappings.put("&cent;", "\u00A2");
		oFF.XmlUtils.extendedEntityMappings.put("&Chi;", "\u03A7");
		oFF.XmlUtils.extendedEntityMappings.put("&chi;", "\u03C7");
		oFF.XmlUtils.extendedEntityMappings.put("&circ;", "\u02C6");
		oFF.XmlUtils.extendedEntityMappings.put("&clubs;", "\u2663");
		oFF.XmlUtils.extendedEntityMappings.put("&cong;", "\u2245");
		oFF.XmlUtils.extendedEntityMappings.put("&copy;", "\u00A9");
		oFF.XmlUtils.extendedEntityMappings.put("&crarr;", "\u21B5");
		oFF.XmlUtils.extendedEntityMappings.put("&cup;", "\u222A");
		oFF.XmlUtils.extendedEntityMappings.put("&curren;", "\u00A4");
		oFF.XmlUtils.extendedEntityMappings.put("&Dagger;", "\u2021");
		oFF.XmlUtils.extendedEntityMappings.put("&dagger;", "\u2020");
		oFF.XmlUtils.extendedEntityMappings.put("&dArr;", "\u21D3");
		oFF.XmlUtils.extendedEntityMappings.put("&darr;", "\u2193");
		oFF.XmlUtils.extendedEntityMappings.put("&deg;", "\u00B0");
		oFF.XmlUtils.extendedEntityMappings.put("&Delta;", "\u0394");
		oFF.XmlUtils.extendedEntityMappings.put("&delta;", "\u03B4");
		oFF.XmlUtils.extendedEntityMappings.put("&diams;", "\u2666");
		oFF.XmlUtils.extendedEntityMappings.put("&divide;", "\u00F7");
		oFF.XmlUtils.extendedEntityMappings.put("&Eacute;", "\u00C9");
		oFF.XmlUtils.extendedEntityMappings.put("&eacute;", "\u00E9");
		oFF.XmlUtils.extendedEntityMappings.put("&Ecirc;", "\u00CA");
		oFF.XmlUtils.extendedEntityMappings.put("&ecirc;", "\u00EA");
		oFF.XmlUtils.extendedEntityMappings.put("&Egrave;", "\u00C8");
		oFF.XmlUtils.extendedEntityMappings.put("&egrave;", "\u00E8");
		oFF.XmlUtils.extendedEntityMappings.put("&empty;", "\u2205");
		oFF.XmlUtils.extendedEntityMappings.put("&emsp;", "\u2003");
		oFF.XmlUtils.extendedEntityMappings.put("&ensp;", "\u2002");
		oFF.XmlUtils.extendedEntityMappings.put("&Epsilon;", "\u0395");
		oFF.XmlUtils.extendedEntityMappings.put("&epsilon;", "\u03B5");
		oFF.XmlUtils.extendedEntityMappings.put("&equiv;", "\u2261");
		oFF.XmlUtils.extendedEntityMappings.put("&Eta;", "\u0397");
		oFF.XmlUtils.extendedEntityMappings.put("&eta;", "\u03B7");
		oFF.XmlUtils.extendedEntityMappings.put("&ETH;", "\u00D0");
		oFF.XmlUtils.extendedEntityMappings.put("&eth;", "\u00F0");
		oFF.XmlUtils.extendedEntityMappings.put("&Euml;", "\u00CB");
		oFF.XmlUtils.extendedEntityMappings.put("&euml;", "\u00EB");
		oFF.XmlUtils.extendedEntityMappings.put("&euro;", "\u20AC");
		oFF.XmlUtils.extendedEntityMappings.put("&exist;", "\u2203");
		oFF.XmlUtils.extendedEntityMappings.put("&fnof;", "\u0192");
		oFF.XmlUtils.extendedEntityMappings.put("&forall;", "\u2200");
		oFF.XmlUtils.extendedEntityMappings.put("&frac12;", "\u00BD");
		oFF.XmlUtils.extendedEntityMappings.put("&frac14;", "\u00BC");
		oFF.XmlUtils.extendedEntityMappings.put("&frac34;", "\u00BE");
		oFF.XmlUtils.extendedEntityMappings.put("&frasl;", "\u2044");
		oFF.XmlUtils.extendedEntityMappings.put("&Gamma;", "\u0393");
		oFF.XmlUtils.extendedEntityMappings.put("&gamma;", "\u03B3");
		oFF.XmlUtils.extendedEntityMappings.put("&ge;", "\u2265");
		oFF.XmlUtils.extendedEntityMappings.put("&gt;", ">");
		oFF.XmlUtils.extendedEntityMappings.put("&hArr;", "\u21D4");
		oFF.XmlUtils.extendedEntityMappings.put("&harr;", "\u2194");
		oFF.XmlUtils.extendedEntityMappings.put("&hearts;", "\u2665");
		oFF.XmlUtils.extendedEntityMappings.put("&hellip;", "\u2026");
		oFF.XmlUtils.extendedEntityMappings.put("&Iacute;", "\u00CD");
		oFF.XmlUtils.extendedEntityMappings.put("&iacute;", "\u00ED");
		oFF.XmlUtils.extendedEntityMappings.put("&Icirc;", "\u00CE");
		oFF.XmlUtils.extendedEntityMappings.put("&icirc;", "\u00EE");
		oFF.XmlUtils.extendedEntityMappings.put("&iexcl;", "\u00A1");
		oFF.XmlUtils.extendedEntityMappings.put("&Igrave;", "\u00CC");
		oFF.XmlUtils.extendedEntityMappings.put("&igrave;", "\u00EC");
		oFF.XmlUtils.extendedEntityMappings.put("&image;", "\u2111");
		oFF.XmlUtils.extendedEntityMappings.put("&infin;", "\u221E");
		oFF.XmlUtils.extendedEntityMappings.put("&int;", "\u222B");
		oFF.XmlUtils.extendedEntityMappings.put("&Iota;", "\u0399");
		oFF.XmlUtils.extendedEntityMappings.put("&iota;", "\u03B9");
		oFF.XmlUtils.extendedEntityMappings.put("&iquest;", "\u00BF");
		oFF.XmlUtils.extendedEntityMappings.put("&isin;", "\u2208");
		oFF.XmlUtils.extendedEntityMappings.put("&Iuml;", "\u00CF");
		oFF.XmlUtils.extendedEntityMappings.put("&iuml;", "\u00EF");
		oFF.XmlUtils.extendedEntityMappings.put("&Kappa;", "\u039A");
		oFF.XmlUtils.extendedEntityMappings.put("&kappa;", "\u03BA");
		oFF.XmlUtils.extendedEntityMappings.put("&Lambda;", "\u039B");
		oFF.XmlUtils.extendedEntityMappings.put("&lambda;", "\u03BB");
		oFF.XmlUtils.extendedEntityMappings.put("&lang;", "\u27E8");
		oFF.XmlUtils.extendedEntityMappings.put("&laquo;", "\u00AB");
		oFF.XmlUtils.extendedEntityMappings.put("&lArr;", "\u21D0");
		oFF.XmlUtils.extendedEntityMappings.put("&larr;", "\u2190");
		oFF.XmlUtils.extendedEntityMappings.put("&lceil;", "\u2308");
		oFF.XmlUtils.extendedEntityMappings.put("&ldquo;", "\u201C");
		oFF.XmlUtils.extendedEntityMappings.put("&le;", "\u2264");
		oFF.XmlUtils.extendedEntityMappings.put("&lfloor;", "\u230A");
		oFF.XmlUtils.extendedEntityMappings.put("&lowast;", "\u2217");
		oFF.XmlUtils.extendedEntityMappings.put("&loz;", "\u25CA");
		oFF.XmlUtils.extendedEntityMappings.put("&lsaquo;", "\u2039");
		oFF.XmlUtils.extendedEntityMappings.put("&lsquo;", "\u2018");
		oFF.XmlUtils.extendedEntityMappings.put("&lt;", "<");
		oFF.XmlUtils.extendedEntityMappings.put("&macr;", "\u00AF");
		oFF.XmlUtils.extendedEntityMappings.put("&mdash;", "\u2014");
		oFF.XmlUtils.extendedEntityMappings.put("&micro;", "\u00B5");
		oFF.XmlUtils.extendedEntityMappings.put("&middot;", "\u00B7");
		oFF.XmlUtils.extendedEntityMappings.put("&minus;", "\u2212");
		oFF.XmlUtils.extendedEntityMappings.put("&Mu;", "\u039C");
		oFF.XmlUtils.extendedEntityMappings.put("&mu;", "\u03BC");
		oFF.XmlUtils.extendedEntityMappings.put("&nabla;", "\u2207");
		oFF.XmlUtils.extendedEntityMappings.put("&nbsp;", " ");
		oFF.XmlUtils.extendedEntityMappings.put("&ndash;", "\u2013");
		oFF.XmlUtils.extendedEntityMappings.put("&ne;", "\u2260");
		oFF.XmlUtils.extendedEntityMappings.put("&ni;", "\u220B");
		oFF.XmlUtils.extendedEntityMappings.put("&not;", "\u00AC");
		oFF.XmlUtils.extendedEntityMappings.put("&notin;", "\u2209");
		oFF.XmlUtils.extendedEntityMappings.put("&nsub;", "\u2284");
		oFF.XmlUtils.extendedEntityMappings.put("&Ntilde;", "\u00D1");
		oFF.XmlUtils.extendedEntityMappings.put("&ntilde;", "\u00F1");
		oFF.XmlUtils.extendedEntityMappings.put("&Nu;", "\u039D");
		oFF.XmlUtils.extendedEntityMappings.put("&nu;", "\u03BD");
		oFF.XmlUtils.extendedEntityMappings.put("&Oacute;", "\u00D3");
		oFF.XmlUtils.extendedEntityMappings.put("&oacute;", "\u00F3");
		oFF.XmlUtils.extendedEntityMappings.put("&Ocirc;", "\u00D4");
		oFF.XmlUtils.extendedEntityMappings.put("&ocirc;", "\u00F4");
		oFF.XmlUtils.extendedEntityMappings.put("&OElig;", "\u0152");
		oFF.XmlUtils.extendedEntityMappings.put("&oelig;", "\u0153");
		oFF.XmlUtils.extendedEntityMappings.put("&Ograve;", "\u00D2");
		oFF.XmlUtils.extendedEntityMappings.put("&ograve;", "\u00F2");
		oFF.XmlUtils.extendedEntityMappings.put("&oline;", "\u203E");
		oFF.XmlUtils.extendedEntityMappings.put("&Omega;", "\u03A9");
		oFF.XmlUtils.extendedEntityMappings.put("&omega;", "\u03C9");
		oFF.XmlUtils.extendedEntityMappings.put("&Omicron;", "\u039F");
		oFF.XmlUtils.extendedEntityMappings.put("&omicron;", "\u03BF");
		oFF.XmlUtils.extendedEntityMappings.put("&oplus;", "\u2295");
		oFF.XmlUtils.extendedEntityMappings.put("&or;", "\u2228");
		oFF.XmlUtils.extendedEntityMappings.put("&ordf;", "\u00AA");
		oFF.XmlUtils.extendedEntityMappings.put("&ordm;", "\u00BA");
		oFF.XmlUtils.extendedEntityMappings.put("&Oslash;", "\u00D8");
		oFF.XmlUtils.extendedEntityMappings.put("&oslash;", "\u00F8");
		oFF.XmlUtils.extendedEntityMappings.put("&Otilde;", "\u00D5");
		oFF.XmlUtils.extendedEntityMappings.put("&otilde;", "\u00F5");
		oFF.XmlUtils.extendedEntityMappings.put("&otimes;", "\u2297");
		oFF.XmlUtils.extendedEntityMappings.put("&Ouml;", "\u00D6");
		oFF.XmlUtils.extendedEntityMappings.put("&ouml;", "\u00F6");
		oFF.XmlUtils.extendedEntityMappings.put("&para;", "\u00B6");
		oFF.XmlUtils.extendedEntityMappings.put("&part;", "\u2202");
		oFF.XmlUtils.extendedEntityMappings.put("&permil;", "\u2030");
		oFF.XmlUtils.extendedEntityMappings.put("&perp;", "\u22A5");
		oFF.XmlUtils.extendedEntityMappings.put("&Phi;", "\u03A6");
		oFF.XmlUtils.extendedEntityMappings.put("&phi;", "\u03C6");
		oFF.XmlUtils.extendedEntityMappings.put("&Pi;", "\u03A0");
		oFF.XmlUtils.extendedEntityMappings.put("&pi;", "\u03C0");
		oFF.XmlUtils.extendedEntityMappings.put("&piv;", "\u03D6");
		oFF.XmlUtils.extendedEntityMappings.put("&plusmn;", "\u00B1");
		oFF.XmlUtils.extendedEntityMappings.put("&pound;", "\u00A3");
		oFF.XmlUtils.extendedEntityMappings.put("&Prime;", "\u2033");
		oFF.XmlUtils.extendedEntityMappings.put("&prime;", "\u2032");
		oFF.XmlUtils.extendedEntityMappings.put("&prod;", "\u220F");
		oFF.XmlUtils.extendedEntityMappings.put("&prop;", "\u221D");
		oFF.XmlUtils.extendedEntityMappings.put("&Psi;", "\u03A8");
		oFF.XmlUtils.extendedEntityMappings.put("&psi;", "\u03C8");
		oFF.XmlUtils.extendedEntityMappings.put("&quot;", "\"");
		oFF.XmlUtils.extendedEntityMappings.put("&radic;", "\u221A");
		oFF.XmlUtils.extendedEntityMappings.put("&rang;", "\u27E9");
		oFF.XmlUtils.extendedEntityMappings.put("&raquo;", "\u00BB");
		oFF.XmlUtils.extendedEntityMappings.put("&rArr;", "\u21D2");
		oFF.XmlUtils.extendedEntityMappings.put("&rarr;", "\u2192");
		oFF.XmlUtils.extendedEntityMappings.put("&rceil;", "\u2309");
		oFF.XmlUtils.extendedEntityMappings.put("&rdquo;", "\u201D");
		oFF.XmlUtils.extendedEntityMappings.put("&real;", "\u211C");
		oFF.XmlUtils.extendedEntityMappings.put("&reg;", "\u00AE");
		oFF.XmlUtils.extendedEntityMappings.put("&rfloor;", "\u230B");
		oFF.XmlUtils.extendedEntityMappings.put("&Rho;", "\u03A1");
		oFF.XmlUtils.extendedEntityMappings.put("&rho;", "\u03C1");
		oFF.XmlUtils.extendedEntityMappings.put("&rsaquo;", "\u203A");
		oFF.XmlUtils.extendedEntityMappings.put("&rsquo;", "\u2019");
		oFF.XmlUtils.extendedEntityMappings.put("&sbquo;", "\u201A");
		oFF.XmlUtils.extendedEntityMappings.put("&Scaron;", "\u0160");
		oFF.XmlUtils.extendedEntityMappings.put("&scaron;", "\u0161");
		oFF.XmlUtils.extendedEntityMappings.put("&sdot;", "\u22C5");
		oFF.XmlUtils.extendedEntityMappings.put("&sect;", "\u00A7");
		oFF.XmlUtils.extendedEntityMappings.put("&Sigma;", "\u03A3");
		oFF.XmlUtils.extendedEntityMappings.put("&sigma;", "\u03C3");
		oFF.XmlUtils.extendedEntityMappings.put("&sigmaf;", "\u03C2");
		oFF.XmlUtils.extendedEntityMappings.put("&sim;", "\u223C");
		oFF.XmlUtils.extendedEntityMappings.put("&spades;", "\u2660");
		oFF.XmlUtils.extendedEntityMappings.put("&sub;", "\u2282");
		oFF.XmlUtils.extendedEntityMappings.put("&sube;", "\u2286");
		oFF.XmlUtils.extendedEntityMappings.put("&sum;", "\u2211");
		oFF.XmlUtils.extendedEntityMappings.put("&sup;", "\u2283");
		oFF.XmlUtils.extendedEntityMappings.put("&sup1;", "\u00B9");
		oFF.XmlUtils.extendedEntityMappings.put("&sup2;", "\u00B2");
		oFF.XmlUtils.extendedEntityMappings.put("&sup3;", "\u00B3");
		oFF.XmlUtils.extendedEntityMappings.put("&supe;", "\u2287");
		oFF.XmlUtils.extendedEntityMappings.put("&szlig;", "\u00DF");
		oFF.XmlUtils.extendedEntityMappings.put("&Tau;", "\u03A4");
		oFF.XmlUtils.extendedEntityMappings.put("&tau;", "\u03C4");
		oFF.XmlUtils.extendedEntityMappings.put("&there4;", "\u2234");
		oFF.XmlUtils.extendedEntityMappings.put("&Theta;", "\u0398");
		oFF.XmlUtils.extendedEntityMappings.put("&theta;", "\u03B8");
		oFF.XmlUtils.extendedEntityMappings.put("&thetasym;", "\u03D1");
		oFF.XmlUtils.extendedEntityMappings.put("&thinsp;", "\u2009");
		oFF.XmlUtils.extendedEntityMappings.put("&THORN;", "\u00DE");
		oFF.XmlUtils.extendedEntityMappings.put("&thorn;", "\u00FE");
		oFF.XmlUtils.extendedEntityMappings.put("&tilde;", "\u02DC");
		oFF.XmlUtils.extendedEntityMappings.put("&times;", "\u00D7");
		oFF.XmlUtils.extendedEntityMappings.put("&trade;", "\u2122");
		oFF.XmlUtils.extendedEntityMappings.put("&Uacute;", "\u00DA");
		oFF.XmlUtils.extendedEntityMappings.put("&uacute;", "\u00FA");
		oFF.XmlUtils.extendedEntityMappings.put("&uArr;", "\u21D1");
		oFF.XmlUtils.extendedEntityMappings.put("&uarr;", "\u2191");
		oFF.XmlUtils.extendedEntityMappings.put("&Ucirc;", "\u00DB");
		oFF.XmlUtils.extendedEntityMappings.put("&ucirc;", "\u00FB");
		oFF.XmlUtils.extendedEntityMappings.put("&Ugrave;", "\u00D9");
		oFF.XmlUtils.extendedEntityMappings.put("&ugrave;", "\u00F9");
		oFF.XmlUtils.extendedEntityMappings.put("&uml;", "\u00A8");
		oFF.XmlUtils.extendedEntityMappings.put("&upsih;", "\u03D2");
		oFF.XmlUtils.extendedEntityMappings.put("&Upsilon;", "\u03A5");
		oFF.XmlUtils.extendedEntityMappings.put("&upsilon;", "\u03C5");
		oFF.XmlUtils.extendedEntityMappings.put("&Uuml;", "\u00DC");
		oFF.XmlUtils.extendedEntityMappings.put("&uuml;", "\u00FC");
		oFF.XmlUtils.extendedEntityMappings.put("&weierp;", "\u2118");
		oFF.XmlUtils.extendedEntityMappings.put("&Xi;", "\u039E");
		oFF.XmlUtils.extendedEntityMappings.put("&xi;", "\u03BE");
		oFF.XmlUtils.extendedEntityMappings.put("&Yacute;", "\u00DD");
		oFF.XmlUtils.extendedEntityMappings.put("&yacute;", "\u00FD");
		oFF.XmlUtils.extendedEntityMappings.put("&yen;", "\u00A5");
		oFF.XmlUtils.extendedEntityMappings.put("&Yuml;", "\u0178");
		oFF.XmlUtils.extendedEntityMappings.put("&yuml;", "\u00FF");
		oFF.XmlUtils.extendedEntityMappings.put("&Zeta;", "\u0396");
		oFF.XmlUtils.extendedEntityMappings.put("&zeta;", "\u03B6");
	},
	unescapeJson:function(string)
	{
			if (oFF.isNull(string))
		{
			return null;
		}
		let buffer = oFF.XStringBuffer.create();
		oFF.XmlUtils.unescapeJsonToBuffer(string, buffer);
		return buffer.toString();
	},
	unescapeJsonToBuffer:function(string, buffer)
	{
			if (oFF.isNull(string))
		{
			return;
		}
		let startOfUnescaped = 0;
		let escaper = oFF.XString.indexOf(string, "\\");
		while (escaper > -1)
		{
			buffer.append(oFF.XString.substring(string, startOfUnescaped, escaper));
			if (escaper >= oFF.XString.size(string) - 1)
			{
				buffer.append("\\");
				return;
			}
			startOfUnescaped = escaper + 2;
			switch (oFF.XString.getCharAt(string, escaper + 1))
			{
				case 110:
					buffer.append("\n");
					break;

				case 114:
					buffer.append("\r");
					break;

				case 116:
					buffer.append("\t");
					break;

				case 98:
					buffer.append("\b");
					break;

				case 102:
					buffer.append("\f");
					break;

				case 47:
					buffer.append("/");
					break;

				case 92:
					buffer.append("\\");
					break;

				case 34:
					buffer.append("\"");
					break;

				default:
					buffer.append(oFF.XString.substring(string, escaper, escaper + 2));
			}
			if (startOfUnescaped >= oFF.XString.size(string))
			{
				return;
			}
			escaper = oFF.XString.indexOfFrom(string, "\\", startOfUnescaped);
		}
		if (escaper === -1)
		{
			buffer.append(oFF.XString.substring(string, startOfUnescaped, oFF.XString.size(string)));
		}
		else
		{
			buffer.append(oFF.XString.substring(string, startOfUnescaped, escaper));
		}
	},
	unescapeRawXmlString:function(string, extended)
	{
			if (oFF.isNull(string))
		{
			return null;
		}
		let buffer = oFF.XStringBuffer.create();
		oFF.XmlUtils.unescapeRawXmlStringToBuffer(string, buffer, extended);
		return buffer.toString();
	},
	unescapeRawXmlStringToBuffer:function(string, buffer, extended)
	{
			if (oFF.isNull(string))
		{
			return;
		}
		let entityStartIndex = oFF.XString.indexOf(string, "&");
		if (entityStartIndex > -1)
		{
			buffer.append(oFF.XString.substring(string, 0, entityStartIndex));
		}
		else
		{
			buffer.append(string);
			return;
		}
		while (entityStartIndex > -1)
		{
			let entityEndIndex = oFF.XString.indexOfFrom(string, ";", entityStartIndex + 1);
			let entityMatched = false;
			if (entityEndIndex > entityStartIndex + 1)
			{
				let entityDefinition = oFF.XString.substring(string, entityStartIndex, entityEndIndex + 1);
				entityMatched = true;
				if (extended && oFF.XmlUtils.extendedEntityMappings.containsKey(entityDefinition))
				{
					buffer.append(oFF.XmlUtils.extendedEntityMappings.getByKey(entityDefinition));
				}
				else if (!extended && oFF.XmlUtils.entityMappings.containsKey(entityDefinition))
				{
					buffer.append(oFF.XmlUtils.entityMappings.getByKey(entityDefinition));
				}
				else if (oFF.XString.startsWith(entityDefinition, "&#x"))
				{
					try
					{
						buffer.appendChar(oFF.XInteger.convertFromStringWithRadix(oFF.XString.substring(entityDefinition, 3, oFF.XString.size(entityDefinition) - 1), 16));
						entityMatched = true;
					}
					catch (t)
					{
						entityMatched = false;
					}
				}
				else if (oFF.XString.startsWith(entityDefinition, "&#"))
				{
					try
					{
						buffer.appendChar(oFF.XInteger.convertFromStringWithRadix(oFF.XString.substring(entityDefinition, 2, oFF.XString.size(entityDefinition) - 1), 10));
						entityMatched = true;
					}
					catch (t1)
					{
						entityMatched = false;
					}
				}
				else
				{
					entityMatched = false;
				}
			}
			else
			{
				buffer.append(oFF.XString.substring(string, entityStartIndex, oFF.XString.size(string)));
				break;
			}
			if (!entityMatched)
			{
				buffer.append("&");
				entityEndIndex = entityStartIndex;
			}
			if (entityEndIndex >= oFF.XString.size(string))
			{
				break;
			}
			entityStartIndex = oFF.XString.indexOfFrom(string, "&", entityEndIndex + 1);
			if (entityStartIndex === -1)
			{
				buffer.append(oFF.XString.substring(string, entityEndIndex + 1, oFF.XString.size(string)));
				break;
			}
			buffer.append(oFF.XString.substring(string, entityEndIndex + 1, entityStartIndex));
		}
	}
};

oFF.JsonParserFactory = function() {};
oFF.JsonParserFactory.prototype = new oFF.XObject();
oFF.JsonParserFactory.prototype._ff_c = "JsonParserFactory";

oFF.JsonParserFactory.s_jsonParserFactoryGeneric = null;
oFF.JsonParserFactory.s_jsonParserFactoryNative = null;
oFF.JsonParserFactory.createComplexJsonDocument = function(docsMap)
{
	if (oFF.isNull(docsMap) || !docsMap.hasElements())
	{
		return null;
	}
	let inaComplexContent = oFF.PrFactory.createStructure();
	let docsKeyList = docsMap.getKeysAsReadOnlyList();
	let mapSize = docsKeyList.size();
	for (let i = 0; i < mapSize; i++)
	{
		let inAKeyForDoc = docsKeyList.get(i);
		inaComplexContent.put(inAKeyForDoc, oFF.JsonParserFactory.createFromString(docsMap.getByKey(inAKeyForDoc)));
	}
	return inaComplexContent;
};
oFF.JsonParserFactory.createFromSafeString = function(simpleJson)
{
	let parser = oFF.JsonParserFactory.newInstance();
	let rootElement = parser.parseUnsafe(simpleJson);
	if (parser.hasErrors() && oFF.isNull(rootElement))
	{
		throw oFF.XException.createIllegalArgumentException(parser.getSummary());
	}
	oFF.XObjectExt.release(parser);
	return rootElement;
};
oFF.JsonParserFactory.createFromString = function(simpleJson)
{
	return oFF.JsonParserFactory.createFromSafeString(simpleJson);
};
oFF.JsonParserFactory.newInstance = function()
{
	if (oFF.notNull(oFF.JsonParserFactory.s_jsonParserFactoryNative))
	{
		return oFF.JsonParserFactory.s_jsonParserFactoryNative.newParserInstance();
	}
	else if (oFF.notNull(oFF.JsonParserFactory.s_jsonParserFactoryGeneric))
	{
		return oFF.JsonParserFactory.s_jsonParserFactoryGeneric.newParserInstance();
	}
	throw oFF.XException.createRuntimeException("No json parser factory implementation is configured");
};
oFF.JsonParserFactory.setJsonParserFactory = function(jsonParserFactory)
{
	oFF.JsonParserFactory.s_jsonParserFactoryNative = jsonParserFactory;
};
oFF.JsonParserFactory.setJsonParserFactoryGeneric = function(jsonParserFactory)
{
	oFF.JsonParserFactory.s_jsonParserFactoryGeneric = jsonParserFactory;
};
oFF.JsonParserFactory.staticSetupJsonParserFactory = function() {};

oFF.PrFactory = function() {};
oFF.PrFactory.prototype = new oFF.XObject();
oFF.PrFactory.prototype._ff_c = "PrFactory";

oFF.PrFactory.s_activeFactory = null;
oFF.PrFactory.s_nativeFactory = null;
oFF.PrFactory.s_universalFactory = null;
oFF.PrFactory.createBoolean = function(value)
{
	return oFF.PrFactory.s_activeFactory.newBoolean(value);
};
oFF.PrFactory.createDouble = function(number)
{
	return oFF.PrFactory.s_activeFactory.newDouble(number);
};
oFF.PrFactory.createFromValue = function(val)
{
	let result = null;
	if (oFF.notNull(val))
	{
		if (val.getValueType() === oFF.XValueType.STRUCTURE || val.getValueType() === oFF.XValueType.LIST)
		{
			result = oFF.JsonParserFactory.createFromString(oFF.XValueUtil.getString(val));
		}
		else if (val.getValueType() === oFF.XValueType.BOOLEAN)
		{
			result = oFF.PrFactory.createBoolean(oFF.XValueUtil.getBoolean(val, false, false));
		}
		else if (val.getValueType() === oFF.XValueType.INTEGER)
		{
			result = oFF.PrFactory.createInteger(oFF.XValueUtil.getInteger(val, false, false));
		}
		else if (val.getValueType() === oFF.XValueType.LONG)
		{
			result = oFF.PrFactory.createLong(oFF.XValueUtil.getLong(val, false, false));
		}
		else if (val.getValueType() === oFF.XValueType.DOUBLE)
		{
			result = oFF.PrFactory.createDouble(oFF.XValueUtil.getDouble(val, false, false));
		}
		else
		{
			result = oFF.PrFactory.createString(oFF.XValueUtil.getString(val));
		}
	}
	return result;
};
oFF.PrFactory.createInteger = function(number)
{
	return oFF.PrFactory.s_activeFactory.newInteger(number);
};
oFF.PrFactory.createList = function()
{
	return oFF.PrFactory.s_activeFactory.newList();
};
oFF.PrFactory.createListDeepCopy = function(origin)
{
	return oFF.PrFactory.s_activeFactory.newListDeepCopy(origin);
};
oFF.PrFactory.createLong = function(number)
{
	return oFF.PrFactory.s_activeFactory.newLong(number);
};
oFF.PrFactory.createObject = function()
{
	return oFF.PrFactory.s_activeFactory.newObject();
};
oFF.PrFactory.createString = function(string)
{
	return oFF.PrFactory.s_activeFactory.newString(string);
};
oFF.PrFactory.createStructure = function()
{
	return oFF.PrFactory.s_activeFactory.newStructure();
};
oFF.PrFactory.createStructureDeepCopy = function(origin)
{
	return oFF.PrFactory.s_activeFactory.newStructureDeepCopy(origin);
};
oFF.PrFactory.getActiveParameterFactory = function()
{
	return oFF.PrFactory.s_activeFactory;
};
oFF.PrFactory.getNativeParameterFactory = function()
{
	return oFF.PrFactory.s_nativeFactory;
};
oFF.PrFactory.getUniversalParameterFactory = function()
{
	return oFF.PrFactory.s_universalFactory;
};
oFF.PrFactory.setActiveFactory = function(factory)
{
	oFF.PrFactory.s_activeFactory = factory;
};
oFF.PrFactory.setNativeFactory = function(factory)
{
	oFF.PrFactory.s_nativeFactory = factory;
};
oFF.PrFactory.setUniversalFactory = function(factory)
{
	oFF.PrFactory.s_universalFactory = factory;
};
oFF.PrFactory.prototype.newListDeepCopy = function(origin)
{
	return oFF.PrList.createDeepCopy(origin);
};
oFF.PrFactory.prototype.newObject = function()
{
	return oFF.PrObject.create();
};
oFF.PrFactory.prototype.newStructureDeepCopy = function(origin)
{
	return oFF.PrStructure.createDeepCopy(origin);
};

oFF.PrPathFilter = function() {};
oFF.PrPathFilter.prototype = new oFF.XObject();
oFF.PrPathFilter.prototype._ff_c = "PrPathFilter";

oFF.PrPathFilter.create = function(transientPathCollector)
{
	return oFF.PrPathFilter.createReplacerInternal(transientPathCollector, null, null, false, false);
};
oFF.PrPathFilter.createReplacerInternal = function(transientPathCollector, name, parent, ignored, transientAttribute)
{
	let instance = new oFF.PrPathFilter();
	instance.m_transientPathCollector = transientPathCollector;
	instance.m_children = oFF.XHashMapByString.create();
	instance.m_name = name;
	if (oFF.notNull(parent))
	{
		parent.m_children.put(name, instance);
		instance.m_parent = oFF.XWeakReferenceUtil.getWeakRef(parent);
	}
	instance.m_ignored = ignored;
	instance.m_transient = transientAttribute;
	return instance;
};
oFF.PrPathFilter.prototype.m_children = null;
oFF.PrPathFilter.prototype.m_escapeIgnore = false;
oFF.PrPathFilter.prototype.m_ignored = false;
oFF.PrPathFilter.prototype.m_index = -1;
oFF.PrPathFilter.prototype.m_name = null;
oFF.PrPathFilter.prototype.m_parent = null;
oFF.PrPathFilter.prototype.m_path = null;
oFF.PrPathFilter.prototype.m_transient = false;
oFF.PrPathFilter.prototype.m_transientPathCollector = null;
oFF.PrPathFilter.prototype.addChild = function(name, ignored, transientAttribute)
{
	return oFF.PrPathFilter.createReplacerInternal(this.m_transientPathCollector, name, this, ignored, transientAttribute);
};
oFF.PrPathFilter.prototype.addListChild = function()
{
	return this.addChild("*", false, false);
};
oFF.PrPathFilter.prototype.addListFirstElementChild = function()
{
	return this.addChild(".", false, false);
};
oFF.PrPathFilter.prototype.addNoSerializeChild = function(name)
{
	return this.addChild(name, true, false);
};
oFF.PrPathFilter.prototype.addPlainChild = function(name)
{
	return this.addChild(name, false, false);
};
oFF.PrPathFilter.prototype.addTransientChild = function(name)
{
	return this.addChild(name, true, true);
};
oFF.PrPathFilter.prototype.getListSubFilter = function()
{
	return this.hasSubFilter("*") ? this.getSubFilter("*") : this.getSubFilter(".");
};
oFF.PrPathFilter.prototype.getLocalPath = function()
{
	if (oFF.isNull(this.m_name))
	{
		return "$";
	}
	if (oFF.XString.isEqual(this.m_name, "*") || oFF.XString.isEqual(this.m_name, "."))
	{
		return oFF.XStringUtils.concatenate3("[", oFF.XInteger.convertToString(this.m_index), "]");
	}
	return oFF.XStringUtils.concatenate2(".", this.m_name);
};
oFF.PrPathFilter.prototype.getOrCreateChild = function(name)
{
	return this.m_children.containsKey(name) ? this.m_children.getByKey(name) : this.addPlainChild(name);
};
oFF.PrPathFilter.prototype.getOrCreateListChild = function()
{
	return this.m_children.containsKey("*") ? this.m_children.getByKey("*") : this.addListChild();
};
oFF.PrPathFilter.prototype.getOrCreateListFirstElementChild = function()
{
	return this.m_children.containsKey(".") ? this.m_children.getByKey(".") : this.addListFirstElementChild();
};
oFF.PrPathFilter.prototype.getPath = function()
{
	if (oFF.isNull(this.m_path))
	{
		if (oFF.isNull(this.m_parent))
		{
			this.m_path = this.getLocalPath();
		}
		else
		{
			this.m_path = oFF.XStringUtils.concatenate2(oFF.XWeakReferenceUtil.getHardRef(this.m_parent).getPath(), this.getLocalPath());
		}
	}
	return this.m_path;
};
oFF.PrPathFilter.prototype.getSubFilter = function(key)
{
	return this.m_children.getByKey(key);
};
oFF.PrPathFilter.prototype.hasSubFilter = function(key)
{
	return this.m_children.containsKey(key);
};
oFF.PrPathFilter.prototype.isEscapeIgnore = function()
{
	return this.m_escapeIgnore;
};
oFF.PrPathFilter.prototype.isIgnore = function(key, value)
{
	let escapeIgnore = this.isEscapeIgnore();
	if (this.m_transient && !escapeIgnore)
	{
		this.m_transientPathCollector.addTransientPropertyPath(this.getPath(), value.asString().getString());
	}
	return this.m_ignored && !escapeIgnore;
};
oFF.PrPathFilter.prototype.resetPath = function()
{
	this.m_path = null;
	let values = this.m_children.getValuesAsReadOnlyList();
	for (let i = 0; i < values.size(); i++)
	{
		values.get(i).resetPath();
	}
};
oFF.PrPathFilter.prototype.setEscapeIgnore = function(escapeIgnore)
{
	this.m_escapeIgnore = escapeIgnore;
};
oFF.PrPathFilter.prototype.setEscapeIgnoreForChildren = function(ignore)
{
	oFF.XCollectionUtils.forEach(this.m_children, (child) => {
		child.setEscapeIgnore(ignore);
	});
};
oFF.PrPathFilter.prototype.submitIndex = function(index, value)
{
	if (oFF.XString.isEqual(".", this.m_name) && index !== 0)
	{
		this.setEscapeIgnoreForChildren(true);
	}
	else if (oFF.XString.isEqual("*", this.m_name) || oFF.XString.isEqual(".", this.m_name))
	{
		this.setEscapeIgnoreForChildren(false);
		this.m_index = index;
		this.resetPath();
	}
};

oFF.XmlParserFactory = function() {};
oFF.XmlParserFactory.prototype = new oFF.XObject();
oFF.XmlParserFactory.prototype._ff_c = "XmlParserFactory";

oFF.XmlParserFactory.s_xmlParserFactory = null;
oFF.XmlParserFactory.createFromString = function(xml)
{
	let parser = oFF.XmlParserFactory.newInstance();
	let rootElement = parser.parse(xml);
	if (parser.isValid())
	{
		return rootElement;
	}
	throw oFF.XException.createIllegalArgumentException(parser.getSummary());
};
oFF.XmlParserFactory.newInstance = function()
{
	return oFF.XmlParserFactory.s_xmlParserFactory.newParserInstance();
};
oFF.XmlParserFactory.staticSetupXmlParserFactory = function()
{
	oFF.XmlParserFactory.s_xmlParserFactory = new oFF.XmlParserFactory();
};
oFF.XmlParserFactory.prototype.newParserInstance = function()
{
	return oFF.XmlParser.create();
};

oFF.JsonParserGenericFactory = function() {};
oFF.JsonParserGenericFactory.prototype = new oFF.JsonParserFactory();
oFF.JsonParserGenericFactory.prototype._ff_c = "JsonParserGenericFactory";

oFF.JsonParserGenericFactory.staticSetup = function()
{
	let factory = new oFF.JsonParserGenericFactory();
	oFF.JsonParserFactory.setJsonParserFactoryGeneric(factory);
};
oFF.JsonParserGenericFactory.prototype.newParserInstance = function()
{
	return oFF.JsonParserGeneric.create();
};

oFF.PrCleanup = function() {};
oFF.PrCleanup.prototype = new oFF.XObjectExt();
oFF.PrCleanup.prototype._ff_c = "PrCleanup";

oFF.PrCleanup.CDATA_CONTENT = "content";
oFF.PrCleanup.CDATA_CREATE_DATE = "createDate";
oFF.PrCleanup.CDATA_ENTITIES = "entities";
oFF.PrCleanup.CDATA_INA_REPO = "inaRepo";
oFF.PrCleanup.CDATA_MODIFY_DATE = "modifiedDate";
oFF.PrCleanup.INA_REPO_FILTER = "FilterRepo";
oFF.PrCleanup.INA_REPO_ID = "Id";
oFF.PrCleanup.create = function()
{
	let instance = new oFF.PrCleanup();
	instance.m_toRemove = oFF.XHashSetOfString.create();
	return instance;
};
oFF.PrCleanup.prototype.m_cdata = null;
oFF.PrCleanup.prototype.m_ignored = null;
oFF.PrCleanup.prototype.m_toRemove = null;
oFF.PrCleanup.prototype.addCdataTags = function(names)
{
	if (oFF.isNull(this.m_cdata))
	{
		this.m_cdata = oFF.XHashSetOfString.create();
	}
	this.m_cdata.addAll(names);
	return this;
};
oFF.PrCleanup.prototype.addIgnoredTagsValue = function(name, value)
{
	if (oFF.isNull(this.m_ignored))
	{
		this.m_ignored = oFF.XProperties.create();
	}
	this.m_ignored.put(name, value);
	return this;
};
oFF.PrCleanup.prototype.cleanupCData = function(structure, name)
{
	let cdata = structure.getStructureByKey(name);
	if (!oFF.XCollectionUtils.hasElements(cdata))
	{
		return;
	}
	let content = cdata.getStructureByKey(oFF.PrCleanup.CDATA_CONTENT);
	if (!oFF.XCollectionUtils.hasElements(content))
	{
		return;
	}
	let entities = content.getListByKey(oFF.PrCleanup.CDATA_ENTITIES);
	if (!oFF.XCollectionUtils.hasElements(entities))
	{
		return;
	}
	for (let i = 0; i < entities.size(); i++)
	{
		let entity = entities.getStructureAt(i);
		if (oFF.isNull(entity))
		{
			continue;
		}
		entity.remove(oFF.PrCleanup.CDATA_CREATE_DATE);
		entity.remove(oFF.PrCleanup.CDATA_MODIFY_DATE);
		let inaRepo = entity.getStructureByKey(oFF.PrCleanup.CDATA_INA_REPO);
		this.cleanupInaRepoFilter(inaRepo);
	}
};
oFF.PrCleanup.prototype.cleanupInAJson = function(element)
{
	let result = oFF.PrUtils.deepCopyElement(element);
	this.cleanupInAJsonInternal(result);
	return result;
};
oFF.PrCleanup.prototype.cleanupInAJsonInternal = function(element)
{
	if (oFF.isNull(element))
	{
		return null;
	}
	let myElementType = element.getType();
	if (myElementType === oFF.PrElementType.STRUCTURE)
	{
		this.cleanupStructure(element);
	}
	else if (myElementType === oFF.PrElementType.LIST)
	{
		this.cleanupList(element);
	}
	else if (myElementType === oFF.PrElementType.DOUBLE)
	{
		let doubleValue = element.asDouble();
		let value2 = doubleValue.getDouble();
		let asLong2 = oFF.XDouble.convertToLong(value2);
		let backAsDouble2 = asLong2;
		if (backAsDouble2 === value2)
		{
			return oFF.PrFactory.createLong(asLong2);
		}
	}
	return null;
};
oFF.PrCleanup.prototype.cleanupInaRepoFilter = function(inaRepo)
{
	if (!oFF.XCollectionUtils.hasElements(inaRepo))
	{
		return;
	}
	let filterRepo = inaRepo.getStructureByKey(oFF.PrCleanup.INA_REPO_FILTER);
	this.recursiveIdCleanup(filterRepo);
};
oFF.PrCleanup.prototype.cleanupList = function(myElement)
{
	let list = myElement.asList();
	let size = list.size();
	for (let k = 0; k < size; k++)
	{
		let currentListElement = list.get(k);
		let returnListElement = this.cleanupInAJsonInternal(currentListElement);
		if (oFF.notNull(returnListElement))
		{
			list.set(k, returnListElement);
		}
	}
};
oFF.PrCleanup.prototype.cleanupStructure = function(element)
{
	let structure = element.asStructure();
	let names = structure.getKeysAsReadOnlyList();
	let size = names.size();
	for (let i = 0; i < size; i++)
	{
		let name = names.get(i);
		if (oFF.notNull(this.m_ignored) && this.m_ignored.containsKey(name))
		{
			if (!oFF.XString.containsString(structure.getStringByKey(name), this.m_ignored.getByKey(name)))
			{
				structure.remove(name);
				continue;
			}
		}
		else if (oFF.notNull(this.m_cdata) && this.m_cdata.contains(name))
		{
			this.parseAndReplaceCData(structure, name);
			this.cleanupCData(structure, name);
		}
		else if (this.m_toRemove.contains(name))
		{
			structure.remove(name);
			continue;
		}
		let currentStructureElement = structure.getByKey(name);
		let returnStructureElement = this.cleanupInAJsonInternal(currentStructureElement);
		if (oFF.notNull(returnStructureElement))
		{
			structure.put(name, returnStructureElement);
		}
	}
};
oFF.PrCleanup.prototype.parseAndReplaceCData = function(structure, name)
{
	let cdataType = structure.getElementTypeByKey(name);
	if (cdataType === oFF.PrElementType.STRING)
	{
		let value = structure.getStringByKey(name);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(value))
		{
			let parser = oFF.JsonParserFactory.newInstance();
			let rootElement = parser.parse(value);
			if (parser.isValid() && oFF.notNull(rootElement))
			{
				structure.put(name, rootElement);
			}
			else
			{
				structure.putString(name, "PARSER ERROR");
			}
			oFF.XObjectExt.release(parser);
		}
	}
};
oFF.PrCleanup.prototype.recursiveIdCleanup = function(element)
{
	if (oFF.isNull(element))
	{
		return;
	}
	if (element.getType() === oFF.PrElementType.LIST)
	{
		let list = element.asList();
		for (let i = 0; i < list.size(); i++)
		{
			this.recursiveIdCleanup(list.get(i));
		}
	}
	else if (element.getType() === oFF.PrElementType.STRUCTURE)
	{
		let structure = element.asStructure();
		structure.remove(oFF.PrCleanup.INA_REPO_ID);
		let keys = structure.getKeysAsReadOnlyList();
		for (let j = 0; j < keys.size(); j++)
		{
			this.recursiveIdCleanup(structure.getByKey(keys.get(j)));
		}
	}
};
oFF.PrCleanup.prototype.releaseObject = function()
{
	oFF.XObjectExt.prototype.releaseObject.call( this );
	this.m_cdata = oFF.XObjectExt.release(this.m_cdata);
	this.m_ignored = oFF.XObjectExt.release(this.m_ignored);
	this.m_toRemove = oFF.XObjectExt.release(this.m_toRemove);
};
oFF.PrCleanup.prototype.tagsToRemove = function(names)
{
	this.m_toRemove.addAll(names);
	return this;
};

oFF.PrFactoryUniversal = function() {};
oFF.PrFactoryUniversal.prototype = new oFF.PrFactory();
oFF.PrFactoryUniversal.prototype._ff_c = "PrFactoryUniversal";

oFF.PrFactoryUniversal.staticSetup = function()
{
	oFF.PrInteger.staticSetup();
	oFF.PrBoolean.staticSetup();
	oFF.PrString.staticSetup();
	oFF.PrDouble.staticSetup();
	let factory = new oFF.PrFactoryUniversal();
	oFF.PrFactory.setUniversalFactory(factory);
	oFF.PrFactory.setActiveFactory(factory);
};
oFF.PrFactoryUniversal.prototype.newBoolean = function(value)
{
	return oFF.PrBoolean.createWithValue(value);
};
oFF.PrFactoryUniversal.prototype.newDouble = function(number)
{
	return oFF.PrDouble.createWithValue(number);
};
oFF.PrFactoryUniversal.prototype.newInteger = function(number)
{
	return oFF.PrInteger.createWithValue(number);
};
oFF.PrFactoryUniversal.prototype.newList = function()
{
	return oFF.PrList.create();
};
oFF.PrFactoryUniversal.prototype.newListDeepCopy = function(origin)
{
	return oFF.PrList.createDeepCopy(origin);
};
oFF.PrFactoryUniversal.prototype.newLong = function(number)
{
	return oFF.PrLong.createWithValue(number);
};
oFF.PrFactoryUniversal.prototype.newNull = function()
{
	return null;
};
oFF.PrFactoryUniversal.prototype.newObject = function()
{
	return oFF.PrObject.create();
};
oFF.PrFactoryUniversal.prototype.newString = function(string)
{
	return oFF.PrString.createWithValue(string);
};
oFF.PrFactoryUniversal.prototype.newStructure = function()
{
	return oFF.PrStructure.create();
};
oFF.PrFactoryUniversal.prototype.newStructureDeepCopy = function(origin)
{
	return oFF.PrStructure.createDeepCopy(origin);
};

oFF.DfDocumentParser = function() {};
oFF.DfDocumentParser.prototype = new oFF.MessageManagerSimple();
oFF.DfDocumentParser.prototype._ff_c = "DfDocumentParser";

oFF.DfDocumentParser.prototype.convertFromNative = function(content)
{
	return oFF.XObject.castFromNative(content);
};
oFF.DfDocumentParser.prototype.convertToNative = function(element)
{
	return element;
};
oFF.DfDocumentParser.prototype.parseByteArray = function(byteContent)
{
	let content = oFF.XByteArray.convertToString(byteContent);
	return this.parse(content);
};
oFF.DfDocumentParser.prototype.parseUnsafe = function(content)
{
	return this.parse(content);
};

oFF.DocumentFormatType = function() {};
oFF.DocumentFormatType.prototype = new oFF.XConstant();
oFF.DocumentFormatType.prototype._ff_c = "DocumentFormatType";

oFF.DocumentFormatType.JSON = null;
oFF.DocumentFormatType.XML = null;
oFF.DocumentFormatType.staticSetup = function()
{
	oFF.DocumentFormatType.JSON = oFF.XConstant.setupName(new oFF.DocumentFormatType(), "Json");
	oFF.DocumentFormatType.XML = oFF.XConstant.setupName(new oFF.DocumentFormatType(), "Xml");
};

oFF.JsonParserGeneric = function() {};
oFF.JsonParserGeneric.prototype = new oFF.DfDocumentParser();
oFF.JsonParserGeneric.prototype._ff_c = "JsonParserGeneric";

oFF.JsonParserGeneric.create = function()
{
	let object = new oFF.JsonParserGeneric();
	object.setupParser(null, false);
	return object;
};
oFF.JsonParserGeneric.createEmbedded = function(source)
{
	let object = new oFF.JsonParserGeneric();
	object.setupParser(source, true);
	return object;
};
oFF.JsonParserGeneric.prototype.m_currentStackIndex = 0;
oFF.JsonParserGeneric.prototype.m_elementStack = null;
oFF.JsonParserGeneric.prototype.m_escapedString = null;
oFF.JsonParserGeneric.prototype.m_isEmbedded = false;
oFF.JsonParserGeneric.prototype.m_isInsideDoubleNumber = false;
oFF.JsonParserGeneric.prototype.m_isInsideEscape = false;
oFF.JsonParserGeneric.prototype.m_isInsideNumber = false;
oFF.JsonParserGeneric.prototype.m_isInsideString = false;
oFF.JsonParserGeneric.prototype.m_isInsideUnicode = false;
oFF.JsonParserGeneric.prototype.m_isInsideVariable = false;
oFF.JsonParserGeneric.prototype.m_numberStartPos = 0;
oFF.JsonParserGeneric.prototype.m_pos = 0;
oFF.JsonParserGeneric.prototype.m_rootElement = null;
oFF.JsonParserGeneric.prototype.m_source = null;
oFF.JsonParserGeneric.prototype.m_stringDelimiter = 0;
oFF.JsonParserGeneric.prototype.m_stringStartPos = 0;
oFF.JsonParserGeneric.prototype.m_structureDepth = 0;
oFF.JsonParserGeneric.prototype.m_unicodePos = 0;
oFF.JsonParserGeneric.prototype.addParserError = function(code, message)
{
	let start = this.m_pos - 10;
	if (start < 0)
	{
		start = 0;
	}
	let end = this.m_pos + 10;
	if (end > oFF.XString.size(this.m_source))
	{
		end = oFF.XString.size(this.m_source);
	}
	let errorValue = oFF.XString.substring(this.m_source, start, end);
	let buffer = oFF.XStringBuffer.create();
	buffer.append("Json Parser Error at position ");
	buffer.appendInt(this.m_pos).append(": ").appendLine(message);
	buffer.append("...").append(errorValue).append("...");
	let messageExt = buffer.toString();
	return oFF.DfDocumentParser.prototype.addErrorExt.call( this , oFF.OriginLayer.IOLAYER, code, messageExt, null);
};
oFF.JsonParserGeneric.prototype.checkList = function(jsonStackElement)
{
	if (jsonStackElement.isNameSet())
	{
		this.raiseError("Name cannot be set in list");
		return false;
	}
	if (jsonStackElement.isValueSet())
	{
		this.raiseError("Value in list is already set");
		return false;
	}
	jsonStackElement.setValueSet(true);
	return true;
};
oFF.JsonParserGeneric.prototype.checkStructure = function(jsonStackElement)
{
	if (!jsonStackElement.isNameSet())
	{
		this.raiseError("Name in structure is not set");
		return false;
	}
	if (jsonStackElement.isValueSet())
	{
		this.raiseError("Value in structure is already set");
		return false;
	}
	jsonStackElement.setValueSet(true);
	return true;
};
oFF.JsonParserGeneric.prototype.endParsing = function()
{
	this.m_escapedString = oFF.XObjectExt.release(this.m_escapedString);
	if (this.m_currentStackIndex === -1)
	{
		return true;
	}
	this.addParserError(oFF.JsonParserErrorCode.JSON_PARSER_ILLEGAL_STATE, "Json does not close correctly");
	return false;
};
oFF.JsonParserGeneric.prototype.enter = function(nextElement)
{
	if (this.m_currentStackIndex === -1)
	{
		this.m_rootElement = nextElement;
	}
	else
	{
		let jsonStackElement = this.getTopStackElement();
		if (!jsonStackElement.addElement())
		{
			this.raiseWrongCommaError();
			return false;
		}
		let element = jsonStackElement.getElement();
		let type = element.getType();
		if (type === oFF.PrElementType.STRUCTURE)
		{
			if (!this.checkStructure(jsonStackElement))
			{
				return false;
			}
			let name = jsonStackElement.getName();
			let structure = element;
			structure.put(name, nextElement);
		}
		else if (type === oFF.PrElementType.LIST)
		{
			if (!this.checkList(jsonStackElement))
			{
				return false;
			}
			let list = element;
			list.add(nextElement);
		}
		else
		{
			this.raiseError("Illegal type");
			return false;
		}
	}
	let nextStackElement;
	if (this.m_currentStackIndex === this.m_elementStack.size() - 1)
	{
		nextStackElement = oFF.JsonParserGenericStackElement.create();
		this.m_elementStack.add(nextStackElement);
	}
	else
	{
		nextStackElement = this.m_elementStack.get(this.m_currentStackIndex + 1);
		nextStackElement.reset();
	}
	nextStackElement.setElement(nextElement);
	this.m_currentStackIndex++;
	return true;
};
oFF.JsonParserGeneric.prototype.enterArray = function()
{
	return this.enter(oFF.PrFactory.createList());
};
oFF.JsonParserGeneric.prototype.enterEscapedString = function(pos)
{
	this.m_isInsideEscape = true;
	if (oFF.isNull(this.m_escapedString))
	{
		this.m_escapedString = oFF.XStringBuffer.create();
	}
	let value = oFF.XString.substring(this.m_source, this.m_stringStartPos, pos);
	this.m_escapedString.append(value);
};
oFF.JsonParserGeneric.prototype.enterNumber = function()
{
	return true;
};
oFF.JsonParserGeneric.prototype.enterStructure = function()
{
	return this.enter(oFF.PrFactory.createStructure());
};
oFF.JsonParserGeneric.prototype.enterValueZone = function()
{
	return true;
};
oFF.JsonParserGeneric.prototype.escapedString = function(c, pos)
{
	if (c === 114)
	{
		this.m_escapedString.append("\r");
	}
	else if (c === 110)
	{
		this.m_escapedString.append("\n");
	}
	else if (c === 116)
	{
		this.m_escapedString.append("\t");
	}
	else if (c === 102)
	{
		this.m_escapedString.append("\f");
	}
	else if (c === 98)
	{
		this.m_escapedString.append("\b");
	}
	else if (c === 34)
	{
		this.m_escapedString.append("\"");
	}
	else if (c === 92)
	{
		this.m_escapedString.append("\\");
	}
	else if (c === 47)
	{
		this.m_escapedString.append("/");
	}
	else
	{
		this.addParserError(oFF.JsonParserErrorCode.JSON_PARSER_ILLEGAL_STATE, "Parser Error");
		return false;
	}
	this.m_isInsideEscape = false;
	this.m_stringStartPos = pos + 1;
	return true;
};
oFF.JsonParserGeneric.prototype.getRootElement = function()
{
	return this.m_rootElement;
};
oFF.JsonParserGeneric.prototype.getTopStackElement = function()
{
	return this.m_elementStack.get(this.m_currentStackIndex);
};
oFF.JsonParserGeneric.prototype.insideDouble = function(value)
{
	try
	{
		let doubleValue = oFF.XDouble.convertFromString(value);
		if (!this.setDouble(doubleValue))
		{
			return false;
		}
	}
	catch (nfe)
	{
		this.addParserError(oFF.JsonParserErrorCode.JSON_PARSER_ILLEGAL_STATE, oFF.XException.getStackTrace(nfe, 0));
		return false;
	}
	return true;
};
oFF.JsonParserGeneric.prototype.insideInt = function(value)
{
	try
	{
		let isInt = true;
		let leni = oFF.XString.size(value);
		let minus = oFF.XString.getCharAt(value, 0);
		if (minus === 45)
		{
			isInt = leni <= 10;
		}
		else
		{
			isInt = leni <= 9;
		}
		if (isInt)
		{
			let intValue = oFF.XInteger.convertFromString(value);
			if (this.setInteger(intValue) === false)
			{
				return false;
			}
		}
		else
		{
			let longValue = oFF.XLong.convertFromString(value);
			if (this.setLong(longValue) === false)
			{
				return false;
			}
		}
	}
	catch (nfe2)
	{
		this.addParserError(oFF.JsonParserErrorCode.JSON_PARSER_ILLEGAL_STATE, oFF.XException.getStackTrace(nfe2, 0));
		return false;
	}
	return true;
};
oFF.JsonParserGeneric.prototype.insideString = function(pos)
{
	let value = oFF.XString.substring(this.m_source, this.m_stringStartPos, pos);
	if (oFF.notNull(this.m_escapedString))
	{
		this.m_escapedString.append(value);
		value = this.m_escapedString.toString();
		this.m_escapedString = oFF.XObjectExt.release(this.m_escapedString);
	}
	if (!this.setString(value))
	{
		return false;
	}
	if (!this.leaveString())
	{
		return false;
	}
	this.m_isInsideString = false;
	return true;
};
oFF.JsonParserGeneric.prototype.isEmbeddedParsingFinished = function()
{
	return this.m_structureDepth === 0;
};
oFF.JsonParserGeneric.prototype.leaveArray = function()
{
	let topStackElement = this.getTopStackElement();
	if (!topStackElement.finishElements())
	{
		this.raiseWrongCommaError();
		return false;
	}
	this.m_currentStackIndex--;
	return true;
};
oFF.JsonParserGeneric.prototype.leaveNumber = function()
{
	return true;
};
oFF.JsonParserGeneric.prototype.leaveString = function()
{
	return true;
};
oFF.JsonParserGeneric.prototype.leaveStructure = function()
{
	let topStackElement = this.getTopStackElement();
	if (!topStackElement.finishElements())
	{
		this.raiseWrongCommaError();
		return false;
	}
	this.m_currentStackIndex--;
	return true;
};
oFF.JsonParserGeneric.prototype.nextItem = function()
{
	let jsonStackElement = this.getTopStackElement();
	jsonStackElement.setName(null);
	jsonStackElement.setValueSet(false);
	if (jsonStackElement.nextElement() === false)
	{
		this.raiseWrongCommaError();
		return false;
	}
	return true;
};
oFF.JsonParserGeneric.prototype.parse = function(content)
{
	this.resetParsing(content);
	if (oFF.notNull(content))
	{
		if (this.runWalker())
		{
			return this.m_rootElement;
		}
	}
	return null;
};
oFF.JsonParserGeneric.prototype.parseSingleCharacter = function(c, pos)
{
	let value;
	let placeHolder = true;
	this.m_pos = pos;
	let shouldContinue = true;
	while (shouldContinue)
	{
		if (this.m_isInsideString)
		{
			if (this.m_isInsideEscape)
			{
				if (this.m_isInsideUnicode)
				{
					this.m_unicodePos++;
					if (this.m_unicodePos === 4)
					{
						if (this.unicode4(pos) === false)
						{
							return false;
						}
					}
				}
				else
				{
					if (c === 117)
					{
						this.m_isInsideUnicode = true;
						this.m_unicodePos = 0;
					}
					else
					{
						if (this.escapedString(c, pos) === false)
						{
							return false;
						}
					}
				}
			}
			else
			{
				if (c === this.m_stringDelimiter)
				{
					if (this.insideString(pos) === false)
					{
						return false;
					}
				}
				else if (c === 92)
				{
					this.enterEscapedString(pos);
				}
			}
		}
		else if (this.m_isInsideNumber)
		{
			if (c >= 48 && c <= 57 || c === 43 || c === 45)
			{
				placeHolder = true;
			}
			else if (c === 46 || c === 101 || c === 69)
			{
				this.m_isInsideDoubleNumber = true;
			}
			else
			{
				value = oFF.XString.substring(this.m_source, this.m_numberStartPos, pos);
				if (this.m_isInsideDoubleNumber)
				{
					if (this.insideDouble(value) === false)
					{
						return false;
					}
				}
				else
				{
					if (this.insideInt(value) === false)
					{
						return false;
					}
				}
				this.m_isInsideNumber = false;
				this.m_isInsideDoubleNumber = false;
				if (this.leaveNumber() === false)
				{
					return false;
				}
				continue;
			}
		}
		else if (this.m_isInsideVariable)
		{
			if (c === 58 || c === 123 || c === 125 || c === 91 || c === 93 || c === 44 || c === 9 || c === 13 || c === 10 || c === 32)
			{
				value = oFF.XString.substring(this.m_source, this.m_stringStartPos, pos);
				if (this.setVariable(value) === false)
				{
					return false;
				}
				this.m_isInsideVariable = false;
				continue;
			}
		}
		else
		{
			if (c >= 48 && c <= 57 || c === 45)
			{
				if (this.enterNumber() === false)
				{
					return false;
				}
				this.m_isInsideNumber = true;
				this.m_numberStartPos = pos;
			}
			else if (c === 46)
			{
				if (this.enterNumber() === false)
				{
					return false;
				}
				this.m_isInsideNumber = true;
				this.m_isInsideDoubleNumber = true;
				this.m_numberStartPos = pos;
			}
			else if (c === 123)
			{
				if (this.enterStructure() === false)
				{
					return false;
				}
				this.m_structureDepth++;
			}
			else if (c === 125)
			{
				if (this.leaveStructure() === false)
				{
					return false;
				}
				this.m_structureDepth--;
			}
			else if (c === 91)
			{
				if (this.enterArray() === false)
				{
					return false;
				}
			}
			else if (c === 93)
			{
				if (this.leaveArray() === false)
				{
					return false;
				}
			}
			else if (c === 58)
			{
				if (this.enterValueZone() === false)
				{
					return false;
				}
			}
			else if (c === 44)
			{
				if (this.nextItem() === false)
				{
					return false;
				}
			}
			else if (c === 32 || c === 9 || c === 10 || c === 13)
			{
				placeHolder = true;
			}
			else if (c === this.m_stringDelimiter)
			{
				this.m_isInsideString = true;
				this.m_stringStartPos = pos + 1;
			}
			else
			{
				this.m_isInsideVariable = true;
				this.m_stringStartPos = pos;
			}
		}
		break;
	}
	return placeHolder;
};
oFF.JsonParserGeneric.prototype.raiseError = function(errorText)
{
	this.addParserError(oFF.JsonParserErrorCode.JSON_PARSER_ILLEGAL_STATE, errorText);
};
oFF.JsonParserGeneric.prototype.raiseWrongCommaError = function()
{
	this.raiseError("Object properties and array items must be separated by single comma.");
};
oFF.JsonParserGeneric.prototype.releaseObject = function()
{
	oFF.DfDocumentParser.prototype.releaseObject.call( this );
	this.resetParsing(null);
};
oFF.JsonParserGeneric.prototype.resetParsing = function(source)
{
	this.m_rootElement = null;
	this.m_elementStack = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_elementStack);
	if (oFF.notNull(source))
	{
		this.m_elementStack = oFF.XList.create();
	}
	this.m_currentStackIndex = -1;
	this.m_pos = 0;
	this.m_isInsideString = false;
	this.m_isInsideVariable = false;
	this.m_isInsideEscape = false;
	this.m_isInsideNumber = false;
	this.m_isInsideDoubleNumber = false;
	this.m_isInsideUnicode = false;
	this.m_unicodePos = 0;
	this.m_stringStartPos = 0;
	this.m_escapedString = oFF.XObjectExt.release(this.m_escapedString);
	this.m_numberStartPos = 0;
	this.m_structureDepth = 0;
	this.m_source = source;
};
oFF.JsonParserGeneric.prototype.runWalker = function()
{
	let len = oFF.XString.size(this.m_source);
	let c;
	let isValid = true;
	for (let pos = 0; pos < len && isValid; )
	{
		c = oFF.XString.getCharAt(this.m_source, pos);
		if (pos === 0 && c === 65279)
		{
			pos++;
		}
		else
		{
			isValid = this.parseSingleCharacter(c, pos);
			pos++;
		}
	}
	if (isValid)
	{
		this.endParsing();
	}
	return isValid;
};
oFF.JsonParserGeneric.prototype.setDouble = function(value)
{
	let jsonStackElement = this.getTopStackElement();
	if (jsonStackElement.addElement() === false)
	{
		this.raiseWrongCommaError();
		return false;
	}
	let element = jsonStackElement.getElement();
	let type = element.getType();
	if (type === oFF.PrElementType.STRUCTURE)
	{
		if (this.checkStructure(jsonStackElement) === false)
		{
			return false;
		}
		let name = jsonStackElement.getName();
		let structure = element;
		structure.putDouble(name, value);
	}
	else if (type === oFF.PrElementType.LIST)
	{
		if (this.checkList(jsonStackElement) === false)
		{
			return false;
		}
		let list = element;
		list.add(oFF.PrFactory.createDouble(value));
	}
	else
	{
		this.raiseError("Illegal type");
		return false;
	}
	return true;
};
oFF.JsonParserGeneric.prototype.setInteger = function(value)
{
	let jsonStackElement = this.getTopStackElement();
	if (jsonStackElement.addElement() === false)
	{
		this.raiseWrongCommaError();
		return false;
	}
	let element = jsonStackElement.getElement();
	let type = element.getType();
	if (type === oFF.PrElementType.STRUCTURE)
	{
		if (this.checkStructure(jsonStackElement) === false)
		{
			return false;
		}
		let name = jsonStackElement.getName();
		let structure = element;
		structure.putInteger(name, value);
	}
	else if (type === oFF.PrElementType.LIST)
	{
		if (this.checkList(jsonStackElement) === false)
		{
			return false;
		}
		let list = element;
		list.add(oFF.PrFactory.createInteger(value));
	}
	else
	{
		this.raiseError("Illegal type");
		return false;
	}
	return true;
};
oFF.JsonParserGeneric.prototype.setLong = function(value)
{
	let jsonStackElement = this.getTopStackElement();
	if (jsonStackElement.addElement() === false)
	{
		this.raiseWrongCommaError();
		return false;
	}
	let element = jsonStackElement.getElement();
	let type = element.getType();
	if (type === oFF.PrElementType.STRUCTURE)
	{
		if (this.checkStructure(jsonStackElement) === false)
		{
			return false;
		}
		let name = jsonStackElement.getName();
		let structure = element;
		structure.putLong(name, value);
	}
	else if (type === oFF.PrElementType.LIST)
	{
		if (this.checkList(jsonStackElement) === false)
		{
			return false;
		}
		let list = element;
		list.add(oFF.PrFactory.createLong(value));
	}
	else
	{
		this.raiseError("Illegal type");
		return false;
	}
	return true;
};
oFF.JsonParserGeneric.prototype.setString = function(value)
{
	let jsonStackElement = this.getTopStackElement();
	let element = jsonStackElement.getElement();
	let type = element.getType();
	if (type === oFF.PrElementType.STRUCTURE)
	{
		if (!jsonStackElement.isNameSet())
		{
			if (jsonStackElement.isValueSet())
			{
				this.raiseError("Name in structure is not set");
				return false;
			}
			jsonStackElement.setName(value);
		}
		else
		{
			if (jsonStackElement.addElement() === false)
			{
				this.raiseWrongCommaError();
				return false;
			}
			if (this.checkStructure(jsonStackElement) === false)
			{
				return false;
			}
			let name = jsonStackElement.getName();
			let structure = element;
			structure.putString(name, value);
		}
	}
	else if (type === oFF.PrElementType.LIST)
	{
		if (jsonStackElement.addElement() === false)
		{
			return false;
		}
		if (this.checkList(jsonStackElement) === false)
		{
			return false;
		}
		let list = element;
		list.add(oFF.PrFactory.createString(value));
	}
	else
	{
		this.raiseError("Illegal type");
		return false;
	}
	return true;
};
oFF.JsonParserGeneric.prototype.setVariable = function(value)
{
	let newElement = null;
	let isKey = false;
	if (oFF.XString.isEqual("true", value))
	{
		newElement = oFF.PrFactory.createBoolean(true);
		isKey = true;
	}
	else if (oFF.XString.isEqual("false", value))
	{
		newElement = oFF.PrFactory.createBoolean(false);
		isKey = true;
	}
	else if (oFF.XString.isEqual("null", value))
	{
		isKey = true;
	}
	if (!isKey)
	{
		if (this.m_isEmbedded)
		{
			return this.setString(value);
		}
		this.raiseError(oFF.XStringUtils.concatenate2("Unknown value: ", value));
		return false;
	}
	let jsonStackElement = this.getTopStackElement();
	if (!jsonStackElement.addElement())
	{
		this.raiseWrongCommaError();
		return false;
	}
	let element = jsonStackElement.getElement();
	let type = element.getType();
	if (type === oFF.PrElementType.STRUCTURE)
	{
		if (!this.checkStructure(jsonStackElement))
		{
			return false;
		}
		let name = jsonStackElement.getName();
		let structure = element;
		structure.put(name, newElement);
	}
	else if (type === oFF.PrElementType.LIST)
	{
		if (!this.checkList(jsonStackElement))
		{
			return false;
		}
		let list = element;
		list.add(newElement);
	}
	else
	{
		this.raiseError("Illegal type");
		return false;
	}
	return true;
};
oFF.JsonParserGeneric.prototype.setupParser = function(source, isEmbedded)
{
	this.setup();
	this.m_isEmbedded = isEmbedded;
	if (this.m_isEmbedded)
	{
		this.m_stringDelimiter = 39;
	}
	else
	{
		this.m_stringDelimiter = 34;
	}
	if (oFF.notNull(source))
	{
		this.resetParsing(source);
	}
};
oFF.JsonParserGeneric.prototype.unicode4 = function(pos)
{
	let value = oFF.XString.substring(this.m_source, pos - 3, pos + 1);
	try
	{
		let intValue = oFF.XInteger.convertFromStringWithRadix(value, 16);
		this.m_escapedString.appendChar(intValue);
	}
	catch (nfe3)
	{
		this.addParserError(oFF.JsonParserErrorCode.JSON_PARSER_ILLEGAL_STATE, oFF.XException.getStackTrace(nfe3, 0));
		return false;
	}
	this.m_isInsideUnicode = false;
	this.m_isInsideEscape = false;
	this.m_stringStartPos = pos + 1;
	return true;
};

oFF.PrElementType = function() {};
oFF.PrElementType.prototype = new oFF.XConstant();
oFF.PrElementType.prototype._ff_c = "PrElementType";

oFF.PrElementType.ANY = null;
oFF.PrElementType.BOOLEAN = null;
oFF.PrElementType.DOUBLE = null;
oFF.PrElementType.INTEGER = null;
oFF.PrElementType.LIST = null;
oFF.PrElementType.LONG = null;
oFF.PrElementType.OBJECT = null;
oFF.PrElementType.STRING = null;
oFF.PrElementType.STRUCTURE = null;
oFF.PrElementType.THE_NULL = null;
oFF.PrElementType.create = function(name, isNumber)
{
	let newConstant = new oFF.PrElementType();
	newConstant._setupInternal(name);
	newConstant.m_isNumber = isNumber;
	return newConstant;
};
oFF.PrElementType.staticSetup = function()
{
	oFF.PrElementType.STRUCTURE = oFF.PrElementType.create("Structure", false);
	oFF.PrElementType.LIST = oFF.PrElementType.create("List", false);
	oFF.PrElementType.STRING = oFF.PrElementType.create("String", false);
	oFF.PrElementType.INTEGER = oFF.PrElementType.create("Integer", true);
	oFF.PrElementType.LONG = oFF.PrElementType.create("Long", true);
	oFF.PrElementType.DOUBLE = oFF.PrElementType.create("Double", true);
	oFF.PrElementType.BOOLEAN = oFF.PrElementType.create("Boolean", false);
	oFF.PrElementType.OBJECT = oFF.PrElementType.create("Object", false);
	oFF.PrElementType.THE_NULL = oFF.PrElementType.create("Null", false);
	oFF.PrElementType.ANY = oFF.PrElementType.create("Any", false);
};
oFF.PrElementType.prototype.m_isNumber = false;
oFF.PrElementType.prototype.isNumber = function()
{
	return this.m_isNumber;
};

oFF.PrElement = function() {};
oFF.PrElement.prototype = new oFF.XJson();
oFF.PrElement.prototype._ff_c = "PrElement";

oFF.PrElement.prototype.asBoolean = function()
{
	return null;
};
oFF.PrElement.prototype.asBooleanReadOnly = function()
{
	return this.asBoolean();
};
oFF.PrElement.prototype.asDouble = function()
{
	return null;
};
oFF.PrElement.prototype.asDoubleReadOnly = function()
{
	return this.asDouble();
};
oFF.PrElement.prototype.asInteger = function()
{
	return null;
};
oFF.PrElement.prototype.asIntegerReadOnly = function()
{
	return this.asInteger();
};
oFF.PrElement.prototype.asList = function()
{
	return null;
};
oFF.PrElement.prototype.asListReadOnly = function()
{
	return null;
};
oFF.PrElement.prototype.asLong = function()
{
	return null;
};
oFF.PrElement.prototype.asLongReadOnly = function()
{
	return this.asLong();
};
oFF.PrElement.prototype.asNumber = function()
{
	return null;
};
oFF.PrElement.prototype.asNumberReadOnly = function()
{
	return this.asNumber();
};
oFF.PrElement.prototype.asObject = function()
{
	return null;
};
oFF.PrElement.prototype.asObjectReadOnly = function()
{
	return this.asObject();
};
oFF.PrElement.prototype.asString = function()
{
	return null;
};
oFF.PrElement.prototype.asStringReadOnly = function()
{
	return this.asString();
};
oFF.PrElement.prototype.asStructure = function()
{
	return null;
};
oFF.PrElement.prototype.asStructureReadOnly = function()
{
	return null;
};
oFF.PrElement.prototype.cloneExt = function(flags)
{
	return oFF.PrUtils.createDeepCopyExt(this, null);
};
oFF.PrElement.prototype.convertToNative = function()
{
	let parser = oFF.JsonParserFactory.newInstance();
	let nativeObject = parser.convertToNative(this);
	oFF.XObjectExt.release(parser);
	return nativeObject;
};
oFF.PrElement.prototype.copyAsPrimitiveXValue = function()
{
	let elementType = this.getType();
	let returnValue = null;
	if (elementType === oFF.PrElementType.STRING)
	{
		returnValue = oFF.XStringValue.create(this.asString().getString());
	}
	else if (elementType === oFF.PrElementType.BOOLEAN)
	{
		returnValue = oFF.XBooleanValue.create(this.asBoolean().getBoolean());
	}
	else if (elementType === oFF.PrElementType.DOUBLE)
	{
		returnValue = oFF.XDoubleValue.create(this.asDouble().getDouble());
	}
	else if (elementType === oFF.PrElementType.LONG)
	{
		returnValue = oFF.XLongValue.create(this.asLong().getLong());
	}
	else if (elementType === oFF.PrElementType.INTEGER)
	{
		returnValue = oFF.XIntegerValue.create(this.asInteger().getInteger());
	}
	return returnValue;
};
oFF.PrElement.prototype.copyFrom = function(other, flags)
{
	oFF.PrUtils.createDeepCopyExt(other, this);
};
oFF.PrElement.prototype.getComponentType = function()
{
	return this.getValueType();
};
oFF.PrElement.prototype.getElement = function()
{
	return this;
};
oFF.PrElement.prototype.getPermaCopy = function()
{
	return oFF.PrUtils.deepCopyElement(this);
};
oFF.PrElement.prototype.getStringRepresentation = function()
{
	return oFF.PrUtils.serialize(this, true, false, 0);
};
oFF.PrElement.prototype.getType = function()
{
	return null;
};
oFF.PrElement.prototype.getValueType = function()
{
	let type = this.getType();
	if (type === oFF.PrElementType.STRUCTURE)
	{
		return oFF.XValueType.STRUCTURE;
	}
	else if (type === oFF.PrElementType.LIST)
	{
		return oFF.XValueType.LIST;
	}
	else if (type === oFF.PrElementType.STRING)
	{
		return oFF.XValueType.STRING;
	}
	else if (type === oFF.PrElementType.BOOLEAN)
	{
		return oFF.XValueType.BOOLEAN;
	}
	else if (type === oFF.PrElementType.DOUBLE)
	{
		return oFF.XValueType.DOUBLE;
	}
	else if (type === oFF.PrElementType.LONG)
	{
		return oFF.XValueType.LONG;
	}
	else if (type === oFF.PrElementType.INTEGER)
	{
		return oFF.XValueType.INTEGER;
	}
	return null;
};
oFF.PrElement.prototype.isBoolean = function()
{
	return this.getType() === oFF.PrElementType.BOOLEAN;
};
oFF.PrElement.prototype.isDouble = function()
{
	return this.getType() === oFF.PrElementType.DOUBLE;
};
oFF.PrElement.prototype.isEqualTo = function(other)
{
	let isEqual = false;
	if (oFF.notNull(other))
	{
		let otherElement = other;
		let myType = this.getType();
		let otherType = otherElement.getType();
		if (myType.isNumber() && otherType.isNumber())
		{
			isEqual = this.asNumber().getDouble() === otherElement.asNumber().getDouble();
		}
		else
		{
			if (myType === otherType)
			{
				if (myType === oFF.PrElementType.BOOLEAN)
				{
					isEqual = this.getBoolean() === otherElement.getBoolean();
				}
				else if (myType === oFF.PrElementType.INTEGER)
				{
					isEqual = this.getInteger() === otherElement.getInteger();
				}
				else if (myType === oFF.PrElementType.LONG)
				{
					isEqual = this.getLong() === otherElement.getLong();
				}
				else if (myType === oFF.PrElementType.DOUBLE)
				{
					isEqual = this.getDouble() === otherElement.getDouble();
				}
				else if (myType === oFF.PrElementType.STRING)
				{
					isEqual = oFF.XString.isEqual(this.getString(), otherElement.getString());
				}
				else if (myType === oFF.PrElementType.OBJECT)
				{
					isEqual = this.asObject().getObject() === otherElement.asObject().getObject();
				}
				else if (myType === oFF.PrElementType.THE_NULL)
				{
					isEqual = true;
				}
				else
				{
					if (myType === oFF.PrElementType.LIST)
					{
						let myList = this;
						let otherList = otherElement;
						let sizeList = myList.size();
						if (sizeList === otherList.size())
						{
							isEqual = true;
							let myListElement;
							let otherListElement;
							for (let i = 0; i < sizeList && isEqual === true; i++)
							{
								myListElement = myList.get(i);
								otherListElement = otherList.get(i);
								if (oFF.isNull(myListElement) || oFF.isNull(otherListElement))
								{
									isEqual = myListElement === otherListElement;
								}
								else if (!myListElement.isEqualTo(otherListElement))
								{
									isEqual = false;
								}
							}
						}
					}
					else if (myType === oFF.PrElementType.STRUCTURE)
					{
						let myStructure = this;
						let otherStructure = otherElement;
						let myNames = myStructure.getKeysAsReadOnlyList();
						let otherNames = otherStructure.getKeysAsReadOnlyList();
						let sizeStruct = myNames.size();
						if (sizeStruct === otherNames.size())
						{
							isEqual = true;
							let myStructureElement;
							let otherStructureElement;
							for (let k = 0; k < sizeStruct && isEqual === true; k++)
							{
								let myName = myNames.get(k);
								if (!otherStructure.containsKey(myName))
								{
									isEqual = false;
								}
								else
								{
									myStructureElement = myStructure.getByKey(myName);
									otherStructureElement = otherStructure.getByKey(myName);
									if (oFF.isNull(myStructureElement) && oFF.notNull(otherStructureElement) || oFF.notNull(myStructureElement) && oFF.isNull(otherStructureElement))
									{
										isEqual = false;
									}
									else if (oFF.notNull(myStructureElement))
									{
										if (!myStructureElement.isEqualTo(otherStructureElement))
										{
											isEqual = false;
										}
									}
								}
							}
						}
					}
					else
					{
						throw oFF.XException.createIllegalStateException("Unknown type");
					}
				}
			}
		}
	}
	return isEqual;
};
oFF.PrElement.prototype.isInteger = function()
{
	return this.getType() === oFF.PrElementType.INTEGER;
};
oFF.PrElement.prototype.isList = function()
{
	return this.getType() === oFF.PrElementType.LIST;
};
oFF.PrElement.prototype.isLong = function()
{
	return this.getType() === oFF.PrElementType.LONG;
};
oFF.PrElement.prototype.isNumeric = function()
{
	return this.isLong() || this.isDouble() || this.isInteger();
};
oFF.PrElement.prototype.isObject = function()
{
	return this.getType() === oFF.PrElementType.OBJECT;
};
oFF.PrElement.prototype.isProxy = function()
{
	return false;
};
oFF.PrElement.prototype.isString = function()
{
	return this.getType() === oFF.PrElementType.STRING;
};
oFF.PrElement.prototype.isStructure = function()
{
	return this.getType() === oFF.PrElementType.STRUCTURE;
};
oFF.PrElement.prototype.toString = function()
{
	return oFF.PrUtils.serialize(this, true, false, 0);
};

oFF.XmlParser = function() {};
oFF.XmlParser.prototype = new oFF.DfDocumentParser();
oFF.XmlParser.prototype._ff_c = "XmlParser";

oFF.XmlParser.SLASH = 47;
oFF.XmlParser.create = function()
{
	let xmlParser = new oFF.XmlParser();
	xmlParser.setup();
	return xmlParser;
};
oFF.XmlParser.prototype.getAttributes = function(completeTag)
{
	let posFirstSpace = oFF.XString.indexOf(completeTag, " ");
	if (posFirstSpace === -1)
	{
		return "";
	}
	let attributes = oFF.XString.substring(completeTag, posFirstSpace, -1);
	if (oFF.XString.endsWith(attributes, "/"))
	{
		return oFF.XStringUtils.stripRight(attributes, 1);
	}
	return attributes;
};
oFF.XmlParser.prototype.getClosingTag = function(tagName)
{
	return oFF.XStringUtils.concatenate3("</", tagName, ">");
};
oFF.XmlParser.prototype.getContent = function(xmlContent, endOpeningCurrentTag, endCurrentTag)
{
	if (endCurrentTag === -1)
	{
		return oFF.XString.trim(oFF.XString.substring(xmlContent, endOpeningCurrentTag + 1, -1));
	}
	return oFF.XString.trim(oFF.XString.substring(xmlContent, endOpeningCurrentTag + 1, endCurrentTag));
};
oFF.XmlParser.prototype.getListForElement = function(currentElement, currentTagName)
{
	if (oFF.notNull(currentElement) && currentElement.isStructure() && currentElement.asStructure().containsKey(currentTagName))
	{
		let currentStructure = currentElement.asStructure();
		let existingElement = currentStructure.getByKey(currentTagName);
		let list = oFF.PrUtils.convertToList(existingElement);
		currentStructure.put(currentTagName, list);
		return list;
	}
	return null;
};
oFF.XmlParser.prototype.getTagName = function(completeTag)
{
	let posFirstSpace = oFF.XString.indexOf(completeTag, " ");
	return oFF.XString.substring(completeTag, 0, posFirstSpace);
};
oFF.XmlParser.prototype.handleAttributes = function(currentElement, attributes)
{
	if (currentElement.isList())
	{
		return;
	}
	let currentStructure = currentElement;
	let sizeAttributes = oFF.XString.size(attributes);
	let posAttr = 0;
	while (posAttr < sizeAttributes)
	{
		let posAssign = oFF.XString.indexOfFrom(attributes, "=", posAttr);
		if (posAssign === -1)
		{
			break;
		}
		let posEndAttributeValue;
		let quotationChar = oFF.XString.getCharAt(attributes, posAssign + 1);
		if (quotationChar === 34)
		{
			posEndAttributeValue = oFF.XString.indexOfFrom(attributes, "\"", posAssign + 2);
		}
		else
		{
			posEndAttributeValue = oFF.XString.indexOfFrom(attributes, "'", posAssign + 2);
		}
		let isLastAttribute = oFF.XString.indexOfFrom(attributes, " ", posAssign) === -1;
		let attributeValue;
		if (isLastAttribute)
		{
			attributeValue = oFF.XString.substring(attributes, posAssign + 1, sizeAttributes);
		}
		else
		{
			attributeValue = oFF.XString.substring(attributes, posAssign + 1, posEndAttributeValue + 1);
		}
		let attributeName = oFF.XStringUtils.concatenate2("-", oFF.XString.trim(oFF.XString.substring(attributes, posAttr, posAssign)));
		currentStructure.putString(attributeName, oFF.XStringUtils.stripChars(attributeValue, 1));
		if (isLastAttribute)
		{
			break;
		}
		posAttr = posEndAttributeValue + 1;
	}
};
oFF.XmlParser.prototype.handleContent = function(currentElement, tagContent, tagName)
{
	if (currentElement.isList())
	{
		let currentList = currentElement;
		currentList.addString(tagContent);
		return;
	}
	let currentStructure = currentElement;
	let closingTag = this.getClosingTag(tagName);
	if (oFF.XString.endsWith(tagContent, closingTag))
	{
		currentStructure.putString(tagName, oFF.XStringUtils.stripRight(tagContent, oFF.XString.size(closingTag)));
	}
	else
	{
		currentStructure.putString(tagName, tagContent);
	}
};
oFF.XmlParser.prototype.navigateToParent = function(xmlRoot, path)
{
	let parent = xmlRoot;
	for (let i = 0; i < path.size(); i++)
	{
		if (parent.isStructure())
		{
			parent = parent.getByKey(path.get(i));
			if (parent.isList())
			{
				let parentList = parent.asList();
				parent = parentList.getStructureAt(parentList.size() - 1);
			}
		}
	}
	return parent;
};
oFF.XmlParser.prototype.parse = function(content)
{
	this.clearMessages();
	let xmlContent = oFF.XString.trim(content);
	if (oFF.XString.size(xmlContent) === 0)
	{
		this.addErrorExt(oFF.OriginLayer.PROTOCOL, oFF.ErrorCodes.PARSER_ERROR, "The XML content is empty.", oFF.XStringValue.create(xmlContent));
		return oFF.PrFactory.createStructure();
	}
	return this.parseInternal(xmlContent);
};
oFF.XmlParser.prototype.parseInternal = function(xmlContent)
{
	this.addProfileStep("Parse XML");
	let xmlRoot = oFF.PrFactory.createStructure();
	let currentElement = xmlRoot;
	let currentList;
	let pathToCurrentElement = oFF.XList.create();
	let pos = 0;
	let sizeXml = oFF.XString.size(xmlContent);
	while (pos < sizeXml)
	{
		let startCurrentTag = oFF.XString.indexOfFrom(xmlContent, "<", pos);
		if (startCurrentTag === -1)
		{
			break;
		}
		let endOpeningCurrentTag = oFF.XString.indexOfFrom(xmlContent, ">", startCurrentTag);
		if (this.skipTag(xmlContent, startCurrentTag))
		{
			pos = endOpeningCurrentTag + 1;
			continue;
		}
		let currentCompleteTag = oFF.XString.substring(xmlContent, startCurrentTag + 1, endOpeningCurrentTag);
		let currentTagName = this.getTagName(currentCompleteTag);
		let isCurrentTagClosing = oFF.XString.getCharAt(currentTagName, 0) === oFF.XmlParser.SLASH;
		if (isCurrentTagClosing)
		{
			if (!oFF.XString.endsWith(currentTagName, this.peek(pathToCurrentElement)))
			{
				this.addErrorExt(oFF.OriginLayer.IOLAYER, oFF.ErrorCodes.PARSER_ERROR, oFF.XStringUtils.concatenate3("The tag '", currentTagName, "' is not opened properly."), oFF.XStringValue.create(xmlContent));
				break;
			}
			this.pop(pathToCurrentElement);
			currentElement = this.navigateToParent(xmlRoot, pathToCurrentElement);
			pos = endOpeningCurrentTag + 1;
			continue;
		}
		let currentAttributes = this.getAttributes(currentCompleteTag);
		let hasCurrentTagAttributes = oFF.XStringUtils.isNotNullAndNotEmpty(currentAttributes);
		let currentClosingTag = this.getClosingTag(currentTagName);
		let isCurrentTagSelfClosing = oFF.XString.getCharAt(currentCompleteTag, oFF.XString.size(currentCompleteTag) - 1) === oFF.XmlParser.SLASH;
		let endCurrentTag = oFF.XString.indexOfFrom(xmlContent, currentClosingTag, endOpeningCurrentTag);
		if (isCurrentTagSelfClosing && oFF.notNull(currentElement))
		{
			if (!hasCurrentTagAttributes)
			{
				if (xmlRoot.isEmpty() && currentElement.isStructure())
				{
					currentElement.asStructure().putNull(oFF.XStringUtils.stripRight(currentTagName, 1));
				}
				if (currentElement.isList())
				{
					currentElement.addNewStructure();
				}
				pos = endOpeningCurrentTag + 1;
				continue;
			}
		}
		else if (oFF.XString.indexOf(xmlContent, currentClosingTag) === -1)
		{
			this.addErrorExt(oFF.OriginLayer.IOLAYER, oFF.ErrorCodes.PARSER_ERROR, oFF.XStringUtils.concatenate3("The tag '", currentTagName, "' is not closed properly."), oFF.XStringValue.create(xmlContent));
			break;
		}
		let content = "";
		if (!isCurrentTagSelfClosing)
		{
			content = this.getContent(xmlContent, endOpeningCurrentTag, endCurrentTag);
		}
		let isContentEmpty = oFF.XString.isEqual(content, "");
		let isCurrentTagNested = !isContentEmpty && oFF.XString.getCharAt(content, 0) === 60;
		currentList = this.getListForElement(currentElement, currentTagName);
		if (oFF.notNull(currentList))
		{
			currentElement = currentList;
			if (hasCurrentTagAttributes || isContentEmpty || isCurrentTagNested)
			{
				currentElement = currentList.addNewStructure();
			}
		}
		else if (oFF.notNull(currentElement))
		{
			if (hasCurrentTagAttributes || isCurrentTagNested)
			{
				currentElement = currentElement.putNewStructure(currentTagName);
			}
		}
		if (!isContentEmpty && !isCurrentTagNested && !isCurrentTagSelfClosing && oFF.notNull(currentElement))
		{
			this.handleContent(currentElement, content, currentTagName);
		}
		if (hasCurrentTagAttributes && oFF.notNull(currentElement))
		{
			this.handleAttributes(currentElement, currentAttributes);
		}
		if (isCurrentTagSelfClosing)
		{
			currentElement = this.navigateToParent(xmlRoot, pathToCurrentElement);
		}
		else
		{
			pathToCurrentElement.add(currentTagName);
		}
		pos = endOpeningCurrentTag;
	}
	oFF.XObjectExt.release(pathToCurrentElement);
	this.endProfileStep();
	if (this.hasErrors())
	{
		return oFF.PrFactory.createStructure();
	}
	if (!xmlRoot.hasElements())
	{
		this.addErrorExt(oFF.OriginLayer.IOLAYER, oFF.ErrorCodes.PARSER_ERROR, "The XML contains no tags.", oFF.XStringValue.create(xmlContent));
	}
	return xmlRoot;
};
oFF.XmlParser.prototype.peek = function(path)
{
	if (path.isEmpty())
	{
		return null;
	}
	return path.get(path.size() - 1);
};
oFF.XmlParser.prototype.pop = function(path)
{
	return path.removeAt(path.size() - 1);
};
oFF.XmlParser.prototype.skipTag = function(xmlContent, startCurrentTag)
{
	let firstChar = oFF.XString.getCharAt(xmlContent, startCurrentTag + 1);
	return firstChar === 33 || firstChar === 63;
};

oFF.PrBoolean = function() {};
oFF.PrBoolean.prototype = new oFF.PrElement();
oFF.PrBoolean.prototype._ff_c = "PrBoolean";

oFF.PrBoolean.FALSE = null;
oFF.PrBoolean.TRUE = null;
oFF.PrBoolean.createWithValue = function(value)
{
	return value ? oFF.PrBoolean.TRUE : oFF.PrBoolean.FALSE;
};
oFF.PrBoolean.staticSetup = function()
{
	oFF.PrBoolean.TRUE = new oFF.PrBoolean();
	oFF.PrBoolean.TRUE.m_value = true;
	oFF.PrBoolean.FALSE = new oFF.PrBoolean();
	oFF.PrBoolean.FALSE.m_value = false;
};
oFF.PrBoolean.prototype.m_value = false;
oFF.PrBoolean.prototype.asBoolean = function()
{
	return this;
};
oFF.PrBoolean.prototype.asString = function()
{
	return oFF.PrFactory.createString(oFF.XBoolean.convertToString(this.m_value));
};
oFF.PrBoolean.prototype.getBoolean = function()
{
	return this.m_value;
};
oFF.PrBoolean.prototype.getPermaCopy = function()
{
	return oFF.PrBoolean.createWithValue(this.m_value);
};
oFF.PrBoolean.prototype.getType = function()
{
	return oFF.PrElementType.BOOLEAN;
};

oFF.PrObject = function() {};
oFF.PrObject.prototype = new oFF.PrElement();
oFF.PrObject.prototype._ff_c = "PrObject";

oFF.PrObject.create = function()
{
	return new oFF.PrObject();
};
oFF.PrObject.prototype.m_value = null;
oFF.PrObject.prototype.asObject = function()
{
	return this;
};
oFF.PrObject.prototype.getObject = function()
{
	return this.m_value;
};
oFF.PrObject.prototype.getObjectValue = function()
{
	return this.getObject();
};
oFF.PrObject.prototype.getType = function()
{
	return oFF.PrElementType.OBJECT;
};
oFF.PrObject.prototype.releaseObject = function()
{
	this.m_value = null;
	oFF.PrElement.prototype.releaseObject.call( this );
};
oFF.PrObject.prototype.setObject = function(value)
{
	this.m_value = value;
};

oFF.PrString = function() {};
oFF.PrString.prototype = new oFF.PrElement();
oFF.PrString.prototype._ff_c = "PrString";

oFF.PrString.EMPTY = null;
oFF.PrString.createWithValue = function(value)
{
	if (oFF.isNull(value))
	{
		return null;
	}
	if (oFF.XString.size(value) === 0)
	{
		return oFF.PrString.EMPTY;
	}
	let newObj = new oFF.PrString();
	newObj.m_value = value;
	return newObj;
};
oFF.PrString.staticSetup = function()
{
	oFF.PrString.EMPTY = new oFF.PrString();
	oFF.PrString.EMPTY.m_value = "";
};
oFF.PrString.prototype.m_value = null;
oFF.PrString.prototype.asString = function()
{
	return this;
};
oFF.PrString.prototype.getPermaCopy = function()
{
	return oFF.PrString.createWithValue(this.m_value);
};
oFF.PrString.prototype.getString = function()
{
	return this.m_value;
};
oFF.PrString.prototype.getType = function()
{
	return oFF.PrElementType.STRING;
};
oFF.PrString.prototype.releaseObject = function()
{
	this.m_value = null;
	oFF.PrElement.prototype.releaseObject.call( this );
};

oFF.DfPrProxyElement = function() {};
oFF.DfPrProxyElement.prototype = new oFF.PrElement();
oFF.DfPrProxyElement.prototype._ff_c = "DfPrProxyElement";

oFF.DfPrProxyElement.prototype.addAll = function(other)
{
	oFF.XListUtils.addAllObjects(other, this);
};
oFF.DfPrProxyElement.prototype.createArrayCopy = function()
{
	let theSize = this.size();
	let newArray = oFF.XArray.create(theSize);
	oFF.XArrayUtils.copyFromObjectArray(this, newArray, 0, 0, theSize);
	return newArray;
};
oFF.DfPrProxyElement.prototype.createListCopy = function()
{
	let copy = oFF.XList.create();
	copy.addAll(this);
	return copy;
};
oFF.DfPrProxyElement.prototype.createMapByStringCopy = function()
{
	let copy = oFF.XHashMapByString.create();
	copy.putAll(this);
	return copy;
};
oFF.DfPrProxyElement.prototype.getIterator = function()
{
	return this.getValuesAsReadOnlyList().getIterator();
};
oFF.DfPrProxyElement.prototype.getKeysAsIterator = function()
{
	return this.getKeysAsReadOnlyList().getIterator();
};
oFF.DfPrProxyElement.prototype.getKeysAsReadOnlyListSorted = function()
{
	let structureElementNames = this.getKeysAsReadOnlyList();
	if (!oFF.XCollectionUtils.hasElements(structureElementNames))
	{
		return structureElementNames;
	}
	let sorted = oFF.XList.createWithList(structureElementNames);
	sorted.sortByDirection(oFF.XSortDirection.ASCENDING);
	return sorted;
};
oFF.DfPrProxyElement.prototype.getListReadOnlyByKey = function(name)
{
	return this.getListByKey(name);
};
oFF.DfPrProxyElement.prototype.getReadOnlyList = function()
{
	let readOnly = oFF.XReadOnlyListWrapper.create(this);
	return readOnly;
};
oFF.DfPrProxyElement.prototype.getReadOnlyListAt = function(index)
{
	return this.getListAt(index);
};
oFF.DfPrProxyElement.prototype.getReadOnlyStructureAt = function(index)
{
	return this.getStructureAt(index);
};
oFF.DfPrProxyElement.prototype.getStructureReadOnlyByKey = function(name)
{
	return this.getStructureByKey(name);
};
oFF.DfPrProxyElement.prototype.hasElements = function()
{
	return this.getKeysAsReadOnlyList().size() > 0;
};
oFF.DfPrProxyElement.prototype.hasNullByKey = function(name)
{
	return this.containsKey(name) && this.getByKey(name) === null;
};
oFF.DfPrProxyElement.prototype.isEmpty = function()
{
	return this.getKeysAsReadOnlyList().size() === 0;
};
oFF.DfPrProxyElement.prototype.isProxy = function()
{
	return true;
};
oFF.DfPrProxyElement.prototype.putAll = function(other)
{
	oFF.XMapUtils.putAllObjectsByString(other, this);
};
oFF.DfPrProxyElement.prototype.putIfAbsent = function(key, element)
{
	let existingElement = this.getByKey(key);
	if (oFF.isNull(existingElement))
	{
		this.put(key, element);
	}
};
oFF.DfPrProxyElement.prototype.putIfNotNull = function(key, element)
{
	if (oFF.notNull(element))
	{
		this.put(key, element);
	}
};
oFF.DfPrProxyElement.prototype.size = function()
{
	return this.getKeysAsReadOnlyList().size();
};

oFF.PrDouble = function() {};
oFF.PrDouble.prototype = new oFF.PrElement();
oFF.PrDouble.prototype._ff_c = "PrDouble";

oFF.PrDouble.ZERO = null;
oFF.PrDouble.createWithValue = function(value)
{
	if (value === 0)
	{
		return oFF.PrDouble.ZERO;
	}
	let proxy = new oFF.PrDouble();
	proxy.m_value = value;
	return proxy;
};
oFF.PrDouble.staticSetup = function()
{
	oFF.PrDouble.ZERO = new oFF.PrDouble();
	oFF.PrDouble.ZERO.m_value = 0;
};
oFF.PrDouble.prototype.m_value = 0.0;
oFF.PrDouble.prototype.asDouble = function()
{
	return this;
};
oFF.PrDouble.prototype.asNumber = function()
{
	return this;
};
oFF.PrDouble.prototype.asString = function()
{
	return oFF.PrString.createWithValue(oFF.XDouble.convertToString(this.m_value));
};
oFF.PrDouble.prototype.getDouble = function()
{
	return this.m_value;
};
oFF.PrDouble.prototype.getInteger = function()
{
	return oFF.XDouble.convertToInt(this.m_value);
};
oFF.PrDouble.prototype.getLong = function()
{
	return oFF.XDouble.convertToLong(this.m_value);
};
oFF.PrDouble.prototype.getPermaCopy = function()
{
	return oFF.PrDouble.createWithValue(this.m_value);
};
oFF.PrDouble.prototype.getType = function()
{
	return oFF.PrElementType.DOUBLE;
};

oFF.PrInteger = function() {};
oFF.PrInteger.prototype = new oFF.PrElement();
oFF.PrInteger.prototype._ff_c = "PrInteger";

oFF.PrInteger.ints = null;
oFF.PrInteger.createWithValue = function(value)
{
	if (value >= -63 && value < 64)
	{
		return oFF.PrInteger.ints.get(value + 63);
	}
	let proxy = new oFF.PrInteger();
	proxy.m_value = value;
	return proxy;
};
oFF.PrInteger.staticSetup = function()
{
	oFF.PrInteger.ints = oFF.XArray.create(128);
	for (let i = -63; i < 64; i++)
	{
		let prInteger = new oFF.PrInteger();
		prInteger.m_value = i;
		oFF.PrInteger.ints.set(i + 63, prInteger);
	}
};
oFF.PrInteger.prototype.m_value = 0;
oFF.PrInteger.prototype.asInteger = function()
{
	return this;
};
oFF.PrInteger.prototype.asNumber = function()
{
	return this;
};
oFF.PrInteger.prototype.asString = function()
{
	return oFF.PrString.createWithValue(oFF.XInteger.convertToString(this.m_value));
};
oFF.PrInteger.prototype.getDouble = function()
{
	return this.m_value;
};
oFF.PrInteger.prototype.getInteger = function()
{
	return this.m_value;
};
oFF.PrInteger.prototype.getLong = function()
{
	return this.m_value;
};
oFF.PrInteger.prototype.getPermaCopy = function()
{
	return oFF.PrInteger.createWithValue(this.m_value);
};
oFF.PrInteger.prototype.getType = function()
{
	return oFF.PrElementType.INTEGER;
};

oFF.PrList = function() {};
oFF.PrList.prototype = new oFF.PrElement();
oFF.PrList.prototype._ff_c = "PrList";

oFF.PrList.create = function()
{
	let list = new oFF.PrList();
	list.setup();
	return list;
};
oFF.PrList.createDeepCopy = function(origin)
{
	return oFF.PrUtils.createDeepCopyExt(origin, null);
};
oFF.PrList.prototype.m_list = null;
oFF.PrList.prototype.add = function(element)
{
	this.m_list.add(element);
};
oFF.PrList.prototype.addAll = function(other)
{
	this.m_list.addAll(other);
};
oFF.PrList.prototype.addAllStrings = function(listToAdd)
{
	if (oFF.notNull(listToAdd))
	{
		let size = listToAdd.size();
		for (let i = 0; i < size; i++)
		{
			this.addString(listToAdd.get(i));
		}
	}
	return this;
};
oFF.PrList.prototype.addBoolean = function(booleanValue)
{
	this.m_list.add(oFF.PrBoolean.createWithValue(booleanValue));
};
oFF.PrList.prototype.addDouble = function(doubleValue)
{
	this.m_list.add(oFF.PrDouble.createWithValue(doubleValue));
};
oFF.PrList.prototype.addInteger = function(intValue)
{
	this.m_list.add(oFF.PrInteger.createWithValue(intValue));
};
oFF.PrList.prototype.addLong = function(longValue)
{
	this.m_list.add(oFF.PrLong.createWithValue(longValue));
};
oFF.PrList.prototype.addNewList = function()
{
	let list = oFF.PrList.create();
	this.add(list);
	return list;
};
oFF.PrList.prototype.addNewStructure = function()
{
	let structure = oFF.PrFactory.createStructure();
	this.add(structure);
	return structure;
};
oFF.PrList.prototype.addNull = function()
{
	this.m_list.add(null);
};
oFF.PrList.prototype.addString = function(stringValue)
{
	this.m_list.add(oFF.PrString.createWithValue(stringValue));
};
oFF.PrList.prototype.asList = function()
{
	return this;
};
oFF.PrList.prototype.asListReadOnly = function()
{
	return this;
};
oFF.PrList.prototype.clear = function()
{
	this.m_list.clear();
};
oFF.PrList.prototype.contains = function(element)
{
	return this.m_list.contains(element);
};
oFF.PrList.prototype.createArrayCopy = function()
{
	return this.m_list.createArrayCopy();
};
oFF.PrList.prototype.createListCopy = function()
{
	return this.m_list.createListCopy();
};
oFF.PrList.prototype.get = function(index)
{
	let element = this.m_list.get(index);
	if (oFF.notNull(element) && element.getType() === oFF.PrElementType.THE_NULL)
	{
		return null;
	}
	return element;
};
oFF.PrList.prototype.getBooleanAt = function(index)
{
	return this.m_list.get(index).getBoolean();
};
oFF.PrList.prototype.getBooleanAtExt = function(index, defaultValue)
{
	if (this.isIndexValid(index) && this.getElementTypeAt(index) === oFF.PrElementType.BOOLEAN)
	{
		return this.getBooleanAt(index);
	}
	return defaultValue;
};
oFF.PrList.prototype.getDoubleAt = function(index)
{
	let element = this.m_list.get(index);
	if (oFF.isNull(element) || !element.isNumeric())
	{
		return 0.0;
	}
	return element.getDouble();
};
oFF.PrList.prototype.getDoubleAtExt = function(index, defaultValue)
{
	if (this.isIndexValid(index) && this.getElementTypeAt(index).isNumber())
	{
		return this.getDoubleAt(index);
	}
	return defaultValue;
};
oFF.PrList.prototype.getElementTypeAt = function(index)
{
	let element = this.m_list.get(index);
	return oFF.isNull(element) ? oFF.PrElementType.THE_NULL : element.getType();
};
oFF.PrList.prototype.getIndex = function(element)
{
	return this.m_list.getIndex(element);
};
oFF.PrList.prototype.getIntegerAt = function(index)
{
	let element = this.m_list.get(index);
	if (oFF.isNull(element) || !element.isNumeric())
	{
		return 0;
	}
	return element.getInteger();
};
oFF.PrList.prototype.getIntegerAtExt = function(index, defaultValue)
{
	if (this.isIndexValid(index) && this.getElementTypeAt(index).isNumber())
	{
		return this.getIntegerAt(index);
	}
	return defaultValue;
};
oFF.PrList.prototype.getIterator = function()
{
	return this.m_list.getIterator();
};
oFF.PrList.prototype.getListAt = function(index)
{
	let element = this.m_list.get(index);
	if (oFF.isNull(element) || !element.isList())
	{
		return null;
	}
	return element;
};
oFF.PrList.prototype.getLongAt = function(index)
{
	let element = this.m_list.get(index);
	if (oFF.isNull(element) || !element.isNumeric())
	{
		return 0;
	}
	return element.getLong();
};
oFF.PrList.prototype.getLongAtExt = function(index, defaultValue)
{
	if (this.isIndexValid(index) && this.getElementTypeAt(index).isNumber())
	{
		return this.getLongAt(index);
	}
	return defaultValue;
};
oFF.PrList.prototype.getReadOnlyList = function()
{
	let readOnly = oFF.XReadOnlyListWrapper.create(this);
	return readOnly;
};
oFF.PrList.prototype.getReadOnlyListAt = function(index)
{
	return this.getListAt(index);
};
oFF.PrList.prototype.getReadOnlyStructureAt = function(index)
{
	return this.getStructureAt(index);
};
oFF.PrList.prototype.getStringAt = function(index)
{
	let element = this.m_list.get(index);
	if (oFF.isNull(element) || !element.isString())
	{
		return null;
	}
	return element.getString();
};
oFF.PrList.prototype.getStringAtExt = function(index, defaultValue)
{
	if (this.isIndexValid(index) && this.getElementTypeAt(index) === oFF.PrElementType.STRING)
	{
		return this.getStringAt(index);
	}
	return defaultValue;
};
oFF.PrList.prototype.getStructureAt = function(index)
{
	let element = this.m_list.get(index);
	if (oFF.isNull(element) || !element.isStructure())
	{
		return null;
	}
	return element;
};
oFF.PrList.prototype.getType = function()
{
	return oFF.PrElementType.LIST;
};
oFF.PrList.prototype.getValuesAsReadOnlyList = function()
{
	return this.m_list.getValuesAsReadOnlyList();
};
oFF.PrList.prototype.hasElements = function()
{
	return this.m_list.hasElements();
};
oFF.PrList.prototype.hasNullAt = function(index)
{
	return this.m_list.get(index) === null;
};
oFF.PrList.prototype.insert = function(index, element)
{
	this.m_list.insert(index, element);
};
oFF.PrList.prototype.isEmpty = function()
{
	return this.m_list.isEmpty();
};
oFF.PrList.prototype.isIndexValid = function(index)
{
	return this.size() > index && index >= 0;
};
oFF.PrList.prototype.releaseObject = function()
{
	this.m_list = oFF.XObjectExt.release(this.m_list);
	oFF.PrElement.prototype.releaseObject.call( this );
};
oFF.PrList.prototype.removeAt = function(index)
{
	return this.m_list.removeAt(index);
};
oFF.PrList.prototype.removeElement = function(element)
{
	return this.m_list.removeElement(element);
};
oFF.PrList.prototype.set = function(index, element)
{
	this.m_list.set(index, element);
};
oFF.PrList.prototype.setBooleanAt = function(index, booleanValue)
{
	this.m_list.set(index, oFF.PrBoolean.createWithValue(booleanValue));
};
oFF.PrList.prototype.setDoubleAt = function(index, doubleValue)
{
	this.m_list.set(index, oFF.PrDouble.createWithValue(doubleValue));
};
oFF.PrList.prototype.setIntegerAt = function(index, intValue)
{
	this.m_list.set(index, oFF.PrInteger.createWithValue(intValue));
};
oFF.PrList.prototype.setLongAt = function(index, longValue)
{
	this.m_list.set(index, oFF.PrLong.createWithValue(longValue));
};
oFF.PrList.prototype.setNullAt = function(index)
{
	this.m_list.set(index, null);
};
oFF.PrList.prototype.setStringAt = function(index, stringValue)
{
	this.m_list.set(index, oFF.PrString.createWithValue(stringValue));
};
oFF.PrList.prototype.setup = function()
{
	this.m_list = oFF.XList.create();
};
oFF.PrList.prototype.size = function()
{
	return this.m_list.size();
};

oFF.PrLong = function() {};
oFF.PrLong.prototype = new oFF.PrElement();
oFF.PrLong.prototype._ff_c = "PrLong";

oFF.PrLong.create = function()
{
	return new oFF.PrLong();
};
oFF.PrLong.createWithValue = function(value)
{
	let newObj = new oFF.PrLong();
	newObj.m_value = value;
	return newObj;
};
oFF.PrLong.prototype.m_value = 0;
oFF.PrLong.prototype.asLong = function()
{
	return this;
};
oFF.PrLong.prototype.asNumber = function()
{
	return this;
};
oFF.PrLong.prototype.getDouble = function()
{
	return this.m_value;
};
oFF.PrLong.prototype.getInteger = function()
{
	return oFF.XInteger.convertFromStringWithDefault(oFF.XLong.convertToString(this.m_value), 0);
};
oFF.PrLong.prototype.getLong = function()
{
	return this.m_value;
};
oFF.PrLong.prototype.getPermaCopy = function()
{
	return oFF.PrLong.createWithValue(this.m_value);
};
oFF.PrLong.prototype.getType = function()
{
	return oFF.PrElementType.LONG;
};
oFF.PrLong.prototype.setLong = function(value)
{
	this.m_value = value;
};

oFF.PrStructure = function() {};
oFF.PrStructure.prototype = new oFF.PrElement();
oFF.PrStructure.prototype._ff_c = "PrStructure";

oFF.PrStructure.create = function()
{
	let structure = new oFF.PrStructure();
	structure.setup();
	return structure;
};
oFF.PrStructure.createDeepCopy = function(origin)
{
	return oFF.PrUtils.createDeepCopyExt(origin, null);
};
oFF.PrStructure.prototype.m_elementValueMap = null;
oFF.PrStructure.prototype.asStructure = function()
{
	return this;
};
oFF.PrStructure.prototype.asStructureReadOnly = function()
{
	return this;
};
oFF.PrStructure.prototype.clear = function()
{
	this.m_elementValueMap.clear();
};
oFF.PrStructure.prototype.contains = function(element)
{
	return this.m_elementValueMap.contains(element);
};
oFF.PrStructure.prototype.containsKey = function(key)
{
	return this.m_elementValueMap.containsKey(key);
};
oFF.PrStructure.prototype.createMapByStringCopy = function()
{
	return this.m_elementValueMap.createMapByStringCopy();
};
oFF.PrStructure.prototype.getBooleanByKey = function(name)
{
	return this.getBooleanByKeyExt(name, false);
};
oFF.PrStructure.prototype.getBooleanByKeyExt = function(name, defaultValue)
{
	let element = this.m_elementValueMap.getByKey(name);
	let value = defaultValue;
	if (oFF.notNull(element))
	{
		if (element.isBoolean())
		{
			value = element.getBoolean();
		}
		else if (element.isString())
		{
			let stringValue = element.asString().getString();
			value = oFF.XBoolean.convertFromStringWithDefault(stringValue, defaultValue);
		}
	}
	return value;
};
oFF.PrStructure.prototype.getByKey = function(key)
{
	return this.m_elementValueMap.getByKey(key);
};
oFF.PrStructure.prototype.getDoubleByKey = function(name)
{
	return this.getDoubleByKeyExt(name, 0.0);
};
oFF.PrStructure.prototype.getDoubleByKeyExt = function(name, defaultValue)
{
	let element = this.m_elementValueMap.getByKey(name);
	if (oFF.notNull(element))
	{
		if (element.isDouble())
		{
			return element.getDouble();
		}
		else if (element.isInteger())
		{
			return element.getInteger();
		}
		else if (element.isLong())
		{
			return element.getLong();
		}
	}
	return defaultValue;
};
oFF.PrStructure.prototype.getElementTypeByKey = function(name)
{
	let element = this.m_elementValueMap.getByKey(name);
	return oFF.isNull(element) ? oFF.PrElementType.THE_NULL : element.getType();
};
oFF.PrStructure.prototype.getIntegerByKey = function(name)
{
	return this.getIntegerByKeyExt(name, 0);
};
oFF.PrStructure.prototype.getIntegerByKeyExt = function(name, defaultValue)
{
	let element = this.m_elementValueMap.getByKey(name);
	if (oFF.notNull(element))
	{
		if (element.isInteger())
		{
			return element.getInteger();
		}
		else if (element.isLong())
		{
			return oFF.XLong.convertToInt(element.getLong());
		}
		else if (element.isDouble())
		{
			return oFF.XDouble.convertToInt(element.getDouble());
		}
	}
	return defaultValue;
};
oFF.PrStructure.prototype.getIterator = function()
{
	return this.getValuesAsReadOnlyList().getIterator();
};
oFF.PrStructure.prototype.getKeysAsIterator = function()
{
	return this.m_elementValueMap.getKeysAsIterator();
};
oFF.PrStructure.prototype.getKeysAsReadOnlyList = function()
{
	return this.m_elementValueMap.getKeysAsReadOnlyList();
};
oFF.PrStructure.prototype.getKeysAsReadOnlyListSorted = function()
{
	let structureElementNames = this.getKeysAsReadOnlyList();
	if (!oFF.XCollectionUtils.hasElements(structureElementNames))
	{
		return structureElementNames;
	}
	let sorted = oFF.XList.createWithList(structureElementNames);
	sorted.sortByDirection(oFF.XSortDirection.ASCENDING);
	return sorted;
};
oFF.PrStructure.prototype.getListByKey = function(name)
{
	return this.m_elementValueMap.getByKey(name);
};
oFF.PrStructure.prototype.getListReadOnlyByKey = function(name)
{
	return this.getListByKey(name);
};
oFF.PrStructure.prototype.getLongByKey = function(name)
{
	return this.getLongByKeyExt(name, 0);
};
oFF.PrStructure.prototype.getLongByKeyExt = function(name, defaultValue)
{
	let element = this.m_elementValueMap.getByKey(name);
	if (oFF.notNull(element))
	{
		if (element.isLong())
		{
			return element.getLong();
		}
		else if (element.isInteger())
		{
			return element.getInteger();
		}
		else if (element.isDouble())
		{
			return oFF.XDouble.convertToLong(element.getDouble());
		}
	}
	return defaultValue;
};
oFF.PrStructure.prototype.getStringByKey = function(name)
{
	return this.getStringByKeyExt(name, null);
};
oFF.PrStructure.prototype.getStringByKeyExt = function(name, defaultValue)
{
	if (this.containsKey(name))
	{
		let element = this.m_elementValueMap.getByKey(name);
		if (oFF.notNull(element) && element.isString())
		{
			return element.getString();
		}
		return null;
	}
	return defaultValue;
};
oFF.PrStructure.prototype.getStructureByKey = function(name)
{
	return this.m_elementValueMap.getByKey(name);
};
oFF.PrStructure.prototype.getStructureReadOnlyByKey = function(name)
{
	return this.getStructureByKey(name);
};
oFF.PrStructure.prototype.getType = function()
{
	return oFF.PrElementType.STRUCTURE;
};
oFF.PrStructure.prototype.getValuesAsReadOnlyList = function()
{
	let values = oFF.XList.create();
	let allValues = this.m_elementValueMap.getIterator();
	while (allValues.hasNext())
	{
		let next = allValues.next();
		if (oFF.isNull(next))
		{
			continue;
		}
		let type = next.getType();
		if (type.isNumber() || type === oFF.PrElementType.BOOLEAN || type === oFF.PrElementType.STRING)
		{
			values.add(next);
		}
	}
	return values;
};
oFF.PrStructure.prototype.hasElements = function()
{
	return this.m_elementValueMap.hasElements();
};
oFF.PrStructure.prototype.hasNullByKey = function(name)
{
	return this.m_elementValueMap.containsKey(name) && this.m_elementValueMap.getByKey(name) === null;
};
oFF.PrStructure.prototype.hasStringByKey = function(name)
{
	return this.containsKey(name) && this.getElementTypeByKey(name) === oFF.PrElementType.STRING;
};
oFF.PrStructure.prototype.isEmpty = function()
{
	return this.m_elementValueMap.isEmpty();
};
oFF.PrStructure.prototype.put = function(key, element)
{
	this.m_elementValueMap.put(key, element);
};
oFF.PrStructure.prototype.putAll = function(other)
{
	if (oFF.notNull(other))
	{
		let keys = other.getKeysAsReadOnlyList();
		let size = keys.size();
		for (let i = 0; i < size; i++)
		{
			let key = keys.get(i);
			let value = other.getByKey(key);
			this.put(key, value);
		}
	}
};
oFF.PrStructure.prototype.putBoolean = function(key, booleanValue)
{
	this.m_elementValueMap.put(key, oFF.PrBoolean.createWithValue(booleanValue));
};
oFF.PrStructure.prototype.putDouble = function(name, doubleValue)
{
	if (oFF.XMath.isNaN(doubleValue))
	{
		this.putNull(name);
	}
	else
	{
		this.m_elementValueMap.put(name, oFF.PrDouble.createWithValue(doubleValue));
	}
};
oFF.PrStructure.prototype.putIfAbsent = function(key, element)
{
	this.m_elementValueMap.putIfAbsent(key, element);
};
oFF.PrStructure.prototype.putIfNotNull = function(key, element)
{
	if (oFF.notNull(element))
	{
		this.m_elementValueMap.put(key, element);
	}
};
oFF.PrStructure.prototype.putInteger = function(name, intValue)
{
	if (oFF.XMath.isNaN(intValue))
	{
		this.putNull(name);
	}
	else
	{
		this.m_elementValueMap.put(name, oFF.PrInteger.createWithValue(intValue));
	}
};
oFF.PrStructure.prototype.putLong = function(name, longValue)
{
	if (oFF.XMath.isNaN(longValue))
	{
		this.putNull(name);
	}
	else
	{
		this.m_elementValueMap.put(name, oFF.PrLong.createWithValue(longValue));
	}
};
oFF.PrStructure.prototype.putNewList = function(name)
{
	let list = oFF.PrFactory.createList();
	this.put(name, list);
	return list;
};
oFF.PrStructure.prototype.putNewStructure = function(name)
{
	let structure = oFF.PrStructure.create();
	this.put(name, structure);
	return structure;
};
oFF.PrStructure.prototype.putNotNullAndNotEmpty = function(name, element)
{
	if (oFF.notNull(element) && (!element.isList() || !element.asList().isEmpty()) && (!element.isStructure() || !element.asStructure().isEmpty()) && (!element.isString() || !oFF.XStringUtils.isNullOrEmpty(element.asString().getString())))
	{
		this.put(name, element);
	}
};
oFF.PrStructure.prototype.putNull = function(name)
{
	this.m_elementValueMap.put(name, null);
};
oFF.PrStructure.prototype.putString = function(name, stringValue)
{
	if (oFF.isNull(name))
	{
		throw oFF.XException.createRuntimeException("Missing key");
	}
	this.m_elementValueMap.put(name, oFF.PrString.createWithValue(stringValue));
};
oFF.PrStructure.prototype.putStringNotNull = function(name, stringValue)
{
	if (oFF.notNull(stringValue))
	{
		this.putString(name, stringValue);
	}
};
oFF.PrStructure.prototype.putStringNotNullAndNotEmpty = function(name, stringValue)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(stringValue))
	{
		this.putString(name, stringValue);
	}
};
oFF.PrStructure.prototype.releaseObject = function()
{
	this.m_elementValueMap = oFF.XObjectExt.release(this.m_elementValueMap);
	oFF.PrElement.prototype.releaseObject.call( this );
};
oFF.PrStructure.prototype.remove = function(key)
{
	return this.m_elementValueMap.remove(key);
};
oFF.PrStructure.prototype.setup = function()
{
	this.m_elementValueMap = oFF.XLinkedHashMapByString.create();
};
oFF.PrStructure.prototype.size = function()
{
	return this.m_elementValueMap.size();
};

oFF.PrTemplateList = function() {};
oFF.PrTemplateList.prototype = new oFF.PrElement();
oFF.PrTemplateList.prototype._ff_c = "PrTemplateList";

oFF.PrTemplateList.TEMPLATE_DELETE_NAME = "$delete";
oFF.PrTemplateList.createListWrapper = function(root, parent, list)
{
	let obj = new oFF.PrTemplateList();
	obj.setupListWrapper(root, parent, list, null);
	return obj;
};
oFF.PrTemplateList.createListWrapperWithTemplate = function(root, parent, list, templateList)
{
	let obj = new oFF.PrTemplateList();
	obj.setupListWrapper(root, parent, list, templateList);
	return obj;
};
oFF.PrTemplateList.prototype.m_list = null;
oFF.PrTemplateList.prototype.m_parent = null;
oFF.PrTemplateList.prototype.m_root = null;
oFF.PrTemplateList.prototype.m_size = 0;
oFF.PrTemplateList.prototype.m_template = null;
oFF.PrTemplateList.prototype.add = oFF.noSupport;
oFF.PrTemplateList.prototype.addAll = oFF.noSupport;
oFF.PrTemplateList.prototype.addAllStrings = oFF.noSupport;
oFF.PrTemplateList.prototype.addBoolean = oFF.noSupport;
oFF.PrTemplateList.prototype.addDouble = oFF.noSupport;
oFF.PrTemplateList.prototype.addInteger = oFF.noSupport;
oFF.PrTemplateList.prototype.addLong = oFF.noSupport;
oFF.PrTemplateList.prototype.addNewList = oFF.noSupport;
oFF.PrTemplateList.prototype.addNewStructure = oFF.noSupport;
oFF.PrTemplateList.prototype.addNull = oFF.noSupport;
oFF.PrTemplateList.prototype.addString = oFF.noSupport;
oFF.PrTemplateList.prototype.asList = function()
{
	return this;
};
oFF.PrTemplateList.prototype.asListReadOnly = function()
{
	return this;
};
oFF.PrTemplateList.prototype.clear = oFF.noSupport;
oFF.PrTemplateList.prototype.contains = function(element)
{
	return this.m_list.contains(element);
};
oFF.PrTemplateList.prototype.createArrayCopy = function()
{
	return this.m_list.createArrayCopy();
};
oFF.PrTemplateList.prototype.createListCopy = function()
{
	return this.m_list.createListCopy();
};
oFF.PrTemplateList.prototype.get = function(index)
{
	return this.m_list.get(index);
};
oFF.PrTemplateList.prototype.getBooleanAt = function(index)
{
	return this.m_list.getBooleanAt(index);
};
oFF.PrTemplateList.prototype.getBooleanAtExt = function(index, defaultValue)
{
	return this.m_list.getBooleanAtExt(index, defaultValue);
};
oFF.PrTemplateList.prototype.getComponentType = function()
{
	return this.m_list.getComponentType();
};
oFF.PrTemplateList.prototype.getDoubleAt = function(index)
{
	return this.m_list.getDoubleAt(index);
};
oFF.PrTemplateList.prototype.getDoubleAtExt = function(index, defaultValue)
{
	return this.m_list.getDoubleAtExt(index, defaultValue);
};
oFF.PrTemplateList.prototype.getElementTypeAt = function(index)
{
	return this.m_list.getElementTypeAt(index);
};
oFF.PrTemplateList.prototype.getIndex = function(element)
{
	return this.m_list.getIndex(element);
};
oFF.PrTemplateList.prototype.getIntegerAt = function(index)
{
	return this.m_list.getIntegerAt(index);
};
oFF.PrTemplateList.prototype.getIntegerAtExt = function(index, defaultValue)
{
	return this.m_list.getIntegerAtExt(index, defaultValue);
};
oFF.PrTemplateList.prototype.getIterator = function()
{
	return this.m_list.getIterator();
};
oFF.PrTemplateList.prototype.getListAt = function(index)
{
	return this.m_list.getListAt(index);
};
oFF.PrTemplateList.prototype.getLongAt = function(index)
{
	return this.m_list.getLongAt(index);
};
oFF.PrTemplateList.prototype.getLongAtExt = function(index, defaultValue)
{
	return this.m_list.getLongAtExt(index, defaultValue);
};
oFF.PrTemplateList.prototype.getParent = function()
{
	return this.m_parent;
};
oFF.PrTemplateList.prototype.getPermaCopy = function()
{
	return this.m_list.getPermaCopy();
};
oFF.PrTemplateList.prototype.getReadOnlyList = function()
{
	let readOnly = oFF.XReadOnlyListWrapper.create(this);
	return readOnly;
};
oFF.PrTemplateList.prototype.getReadOnlyListAt = function(index)
{
	return this.getListAt(index);
};
oFF.PrTemplateList.prototype.getReadOnlyStructureAt = function(index)
{
	return this.getStructureAt(index);
};
oFF.PrTemplateList.prototype.getStringAt = function(index)
{
	let result = this.m_list.getStringAt(index);
	return oFF.ReplaceTagHandler.handle(this, result);
};
oFF.PrTemplateList.prototype.getStringAtExt = function(index, defaultValue)
{
	let result = this.getStringAt(index);
	if (oFF.notNull(result))
	{
		return result;
	}
	return defaultValue;
};
oFF.PrTemplateList.prototype.getStringRepresentation = function()
{
	return this.m_list.getStringRepresentation();
};
oFF.PrTemplateList.prototype.getStructureAt = function(index)
{
	if (index >= this.m_size)
	{
		throw oFF.XException.createIllegalArgumentException("Index out of range");
	}
	let isOriginalAvailable = index < this.m_list.size();
	let isTemplateAvailable = oFF.notNull(this.m_template) && index < this.m_template.size();
	if (isOriginalAvailable && isTemplateAvailable)
	{
		let original = this.m_list.getStructureAt(index);
		let templateStruct = oFF.PrTemplateStructure.createStructureWrapper(this.m_root, this, this.m_template.get(index).asStructure());
		return oFF.PrTemplateStructure.createStructureWrapperWithTemplate(this.m_root, this, original, templateStruct);
	}
	if (isTemplateAvailable)
	{
		return oFF.PrTemplateStructure.createStructureWrapper(this.m_root, this, this.m_template.get(index).asStructure());
	}
	if (isOriginalAvailable)
	{
		return oFF.PrTemplateStructure.createStructureWrapper(this.m_root, this, this.m_list.getStructureAt(index));
	}
	return null;
};
oFF.PrTemplateList.prototype.getType = function()
{
	return this.m_list.getType();
};
oFF.PrTemplateList.prototype.getValueType = function()
{
	return this.m_list.getValueType();
};
oFF.PrTemplateList.prototype.getValuesAsReadOnlyList = function()
{
	return this.m_list.getValuesAsReadOnlyList();
};
oFF.PrTemplateList.prototype.hasElements = function()
{
	return this.m_list.hasElements();
};
oFF.PrTemplateList.prototype.hasNullAt = function(index)
{
	return this.m_list.hasNullAt(index);
};
oFF.PrTemplateList.prototype.insert = oFF.noSupport;
oFF.PrTemplateList.prototype.isEmpty = function()
{
	return this.m_list.isEmpty();
};
oFF.PrTemplateList.prototype.isList = function()
{
	return true;
};
oFF.PrTemplateList.prototype.releaseObject = function()
{
	this.m_list = oFF.XObjectExt.release(this.m_list);
	this.m_template = oFF.XObjectExt.release(this.m_template);
	this.m_parent = null;
	this.m_root = null;
	oFF.PrElement.prototype.releaseObject.call( this );
};
oFF.PrTemplateList.prototype.removeAt = oFF.noSupport;
oFF.PrTemplateList.prototype.removeElement = oFF.noSupport;
oFF.PrTemplateList.prototype.set = function(index, element)
{
	this.m_list.set(index, element);
};
oFF.PrTemplateList.prototype.setBooleanAt = oFF.noSupport;
oFF.PrTemplateList.prototype.setDoubleAt = oFF.noSupport;
oFF.PrTemplateList.prototype.setIntegerAt = oFF.noSupport;
oFF.PrTemplateList.prototype.setLongAt = oFF.noSupport;
oFF.PrTemplateList.prototype.setNullAt = oFF.noSupport;
oFF.PrTemplateList.prototype.setParent = function(parent)
{
	this.m_parent = parent;
};
oFF.PrTemplateList.prototype.setStringAt = oFF.noSupport;
oFF.PrTemplateList.prototype.setupListWrapper = function(root, parent, list, templateList)
{
	this.m_parent = parent;
	this.m_list = list;
	this.m_root = root;
	this.m_template = templateList;
	if (oFF.isNull(this.m_template))
	{
		this.m_size = this.m_list.size();
	}
	else
	{
		this.m_size = oFF.XMath.max(this.m_size, this.m_template.size());
		let len = this.m_list.size();
		for (let i = 0; i < len; i++)
		{
			let structure = this.m_list.getStructureAt(i);
			if (oFF.isNull(structure))
			{
				break;
			}
			if (structure.getBooleanByKeyExt(oFF.PrTemplateList.TEMPLATE_DELETE_NAME, false))
			{
				this.m_size = i;
			}
		}
	}
};
oFF.PrTemplateList.prototype.size = function()
{
	return this.m_size;
};
oFF.PrTemplateList.prototype.toString = function()
{
	return this.m_list.toString();
};

oFF.PrTemplateStructure = function() {};
oFF.PrTemplateStructure.prototype = new oFF.PrElement();
oFF.PrTemplateStructure.prototype._ff_c = "PrTemplateStructure";

oFF.PrTemplateStructure.TEMPLATE_PATH_NAME = "$ref";
oFF.PrTemplateStructure.TEMPLATE_REPLACE_NAME = "$replace";
oFF.PrTemplateStructure.createStructureWrapper = function(root, parent, structure)
{
	let obj = new oFF.PrTemplateStructure();
	obj.setupStructureWrapper(root, parent, structure, null);
	return obj;
};
oFF.PrTemplateStructure.createStructureWrapperWithTemplate = function(root, parent, structure, templateStruct)
{
	let obj = new oFF.PrTemplateStructure();
	obj.setupStructureWrapper(root, parent, structure, templateStruct);
	return obj;
};
oFF.PrTemplateStructure.prototype.m_parent = null;
oFF.PrTemplateStructure.prototype.m_replaceTemplateFields = null;
oFF.PrTemplateStructure.prototype.m_root = null;
oFF.PrTemplateStructure.prototype.m_structure = null;
oFF.PrTemplateStructure.prototype.m_template = null;
oFF.PrTemplateStructure.prototype.asStructure = function()
{
	return this;
};
oFF.PrTemplateStructure.prototype.asStructureReadOnly = function()
{
	return this;
};
oFF.PrTemplateStructure.prototype.clear = oFF.noSupport;
oFF.PrTemplateStructure.prototype.contains = function(element)
{
	let result = this.m_structure.contains(element);
	if (!result && oFF.notNull(this.m_template))
	{
		result = this.m_template.contains(element);
	}
	return result;
};
oFF.PrTemplateStructure.prototype.containsKey = function(key)
{
	let result = this.m_structure.containsKey(key);
	if (!result && this.isTemplateAvailable(key))
	{
		result = this.m_template.containsKey(key);
	}
	return result;
};
oFF.PrTemplateStructure.prototype.createMapByStringCopy = oFF.noSupport;
oFF.PrTemplateStructure.prototype.getBooleanByKey = function(name)
{
	return this.getByKey(name).asBoolean().getBoolean();
};
oFF.PrTemplateStructure.prototype.getBooleanByKeyExt = function(name, defaultValue)
{
	let element = this.getByKey(name);
	return oFF.isNull(element) ? defaultValue : element.asBoolean().getBoolean();
};
oFF.PrTemplateStructure.prototype.getByKey = function(key)
{
	let result = this.m_structure.getByKey(key);
	if (oFF.isNull(result) && this.isTemplateAvailable(key))
	{
		result = this.m_template.getByKey(key);
	}
	return result;
};
oFF.PrTemplateStructure.prototype.getComponentType = function()
{
	return this.m_structure.getComponentType();
};
oFF.PrTemplateStructure.prototype.getCoreStructureElementNames = function()
{
	return this.m_structure.getKeysAsReadOnlyList();
};
oFF.PrTemplateStructure.prototype.getDoubleByKey = function(name)
{
	return this.getByKey(name).asNumber().getDouble();
};
oFF.PrTemplateStructure.prototype.getDoubleByKeyExt = function(name, defaultValue)
{
	let element = this.getByKey(name);
	return oFF.isNull(element) ? defaultValue : element.asNumber().getDouble();
};
oFF.PrTemplateStructure.prototype.getElementTypeByKey = function(name)
{
	let result = this.m_structure.getElementTypeByKey(name);
	if ((oFF.isNull(result) || result === oFF.PrElementType.THE_NULL) && oFF.notNull(this.m_template))
	{
		return this.m_template.getElementTypeByKey(name);
	}
	return result;
};
oFF.PrTemplateStructure.prototype.getIntegerByKey = function(name)
{
	return this.getByKey(name).asNumber().getInteger();
};
oFF.PrTemplateStructure.prototype.getIntegerByKeyExt = function(name, defaultValue)
{
	let element = this.getByKey(name);
	return oFF.isNull(element) ? defaultValue : element.asNumber().getInteger();
};
oFF.PrTemplateStructure.prototype.getIterator = function()
{
	return this.getValuesAsReadOnlyList().getIterator();
};
oFF.PrTemplateStructure.prototype.getKeysAsIterator = function()
{
	return this.getKeysAsReadOnlyList().getIterator();
};
oFF.PrTemplateStructure.prototype.getKeysAsReadOnlyList = function()
{
	let keys = oFF.XList.create();
	keys.addAll(this.m_structure.getKeysAsReadOnlyList());
	if (oFF.notNull(this.m_template))
	{
		keys.addAll(this.m_template.getKeysAsReadOnlyList());
	}
	return keys;
};
oFF.PrTemplateStructure.prototype.getKeysAsReadOnlyListSorted = function()
{
	let sorted = oFF.XList.createWithList(this.getKeysAsReadOnlyList());
	sorted.sortByDirection(oFF.XSortDirection.ASCENDING);
	return sorted;
};
oFF.PrTemplateStructure.prototype.getListByKey = function(name)
{
	let isOriginalAvailable = this.m_structure.containsKey(name);
	let isTemplateAvailable = this.isTemplateAvailable(name);
	if (isOriginalAvailable && isTemplateAvailable)
	{
		let original = this.m_structure.getListByKey(name);
		let templateList = oFF.PrTemplateList.createListWrapper(this.m_root, this, this.m_template.getByKey(name).asList());
		return oFF.PrTemplateList.createListWrapperWithTemplate(this.m_root, this, original, templateList);
	}
	if (isTemplateAvailable)
	{
		return oFF.PrTemplateList.createListWrapper(this.m_root, this, this.m_template.getByKey(name).asList());
	}
	if (isOriginalAvailable)
	{
		return oFF.PrTemplateList.createListWrapper(this.m_root, this, this.m_structure.getListByKey(name));
	}
	return null;
};
oFF.PrTemplateStructure.prototype.getListReadOnlyByKey = function(name)
{
	return this.getListByKey(name);
};
oFF.PrTemplateStructure.prototype.getLongByKey = function(name)
{
	return this.getByKey(name).asNumber().getLong();
};
oFF.PrTemplateStructure.prototype.getLongByKeyExt = function(name, defaultValue)
{
	let element = this.getByKey(name);
	return oFF.isNull(element) ? defaultValue : element.asNumber().getLong();
};
oFF.PrTemplateStructure.prototype.getParent = function()
{
	return this.m_parent;
};
oFF.PrTemplateStructure.prototype.getPermaCopy = oFF.noSupport;
oFF.PrTemplateStructure.prototype.getStringByKey = function(name)
{
	let element = this.getByKey(name);
	if (oFF.isNull(element) || element.getType() !== oFF.PrElementType.STRING)
	{
		return null;
	}
	return oFF.ReplaceTagHandler.handle(this, element.asString().getString());
};
oFF.PrTemplateStructure.prototype.getStringByKeyExt = function(name, defaultValue)
{
	let result = this.getStringByKey(name);
	return oFF.isNull(result) ? defaultValue : result;
};
oFF.PrTemplateStructure.prototype.getStringRepresentation = function()
{
	return this.m_structure.getStringRepresentation();
};
oFF.PrTemplateStructure.prototype.getStructureByKey = function(name)
{
	let isOriginalAvailable = this.m_structure.containsKey(name);
	let isTemplateAvailable = this.isTemplateAvailable(name);
	if (isOriginalAvailable && isTemplateAvailable)
	{
		let original = this.m_structure.getStructureByKey(name);
		let templateStruct = oFF.PrTemplateStructure.createStructureWrapper(this.m_root, this, this.m_template.getByKey(name).asStructure());
		return oFF.PrTemplateStructure.createStructureWrapperWithTemplate(this.m_root, this, original, templateStruct);
	}
	if (isTemplateAvailable)
	{
		return oFF.PrTemplateStructure.createStructureWrapper(this.m_root, this, this.m_template.getByKey(name).asStructure());
	}
	if (isOriginalAvailable)
	{
		return oFF.PrTemplateStructure.createStructureWrapper(this.m_root, this, this.m_structure.getStructureByKey(name));
	}
	return null;
};
oFF.PrTemplateStructure.prototype.getStructureReadOnlyByKey = function(name)
{
	return this.getStructureByKey(name);
};
oFF.PrTemplateStructure.prototype.getType = function()
{
	return this.m_structure.getType();
};
oFF.PrTemplateStructure.prototype.getValueType = function()
{
	return this.m_structure.getValueType();
};
oFF.PrTemplateStructure.prototype.getValuesAsReadOnlyList = function()
{
	let values = oFF.XList.create();
	values.addAll(this.m_structure.getValuesAsReadOnlyList());
	if (oFF.notNull(this.m_template))
	{
		values.addAll(this.m_template.getValuesAsReadOnlyList());
	}
	return values;
};
oFF.PrTemplateStructure.prototype.hasElements = function()
{
	let result = this.m_structure.hasElements();
	if (!result && oFF.notNull(this.m_template))
	{
		result = this.m_template.hasElements();
	}
	return result;
};
oFF.PrTemplateStructure.prototype.hasNullByKey = function(name)
{
	let result = this.m_structure.hasNullByKey(name);
	if (!result && this.isTemplateAvailable(name))
	{
		result = this.m_template.hasNullByKey(name);
	}
	return result;
};
oFF.PrTemplateStructure.prototype.hasStringByKey = function(name)
{
	let result = this.m_structure.hasStringByKey(name);
	if (!result && this.isTemplateAvailable(name))
	{
		return this.m_template.hasStringByKey(name);
	}
	return result;
};
oFF.PrTemplateStructure.prototype.isEmpty = function()
{
	let result = this.m_structure.isEmpty();
	if (!result && oFF.notNull(this.m_template))
	{
		result = this.m_template.isEmpty();
	}
	return result;
};
oFF.PrTemplateStructure.prototype.isStructure = function()
{
	return true;
};
oFF.PrTemplateStructure.prototype.isTemplateAvailable = function(name)
{
	return oFF.notNull(this.m_template) && this.m_template.containsKey(name) && (oFF.isNull(this.m_replaceTemplateFields) || !this.m_replaceTemplateFields.contains(name));
};
oFF.PrTemplateStructure.prototype.put = oFF.noSupport;
oFF.PrTemplateStructure.prototype.putAll = function(other)
{
	let keys = other.getKeysAsReadOnlyList();
	let size = keys.size();
	for (let i = 0; i < size; i++)
	{
		let key = keys.get(i);
		let value = other.getByKey(key);
		this.put(key, value);
	}
};
oFF.PrTemplateStructure.prototype.putBoolean = oFF.noSupport;
oFF.PrTemplateStructure.prototype.putDouble = oFF.noSupport;
oFF.PrTemplateStructure.prototype.putIfAbsent = oFF.noSupport;
oFF.PrTemplateStructure.prototype.putIfNotNull = oFF.noSupport;
oFF.PrTemplateStructure.prototype.putInteger = oFF.noSupport;
oFF.PrTemplateStructure.prototype.putLong = oFF.noSupport;
oFF.PrTemplateStructure.prototype.putNewList = oFF.noSupport;
oFF.PrTemplateStructure.prototype.putNewStructure = oFF.noSupport;
oFF.PrTemplateStructure.prototype.putNotNullAndNotEmpty = function(name, element)
{
	this.m_structure.putNotNullAndNotEmpty(name, element);
};
oFF.PrTemplateStructure.prototype.putNull = oFF.noSupport;
oFF.PrTemplateStructure.prototype.putString = oFF.noSupport;
oFF.PrTemplateStructure.prototype.putStringNotNull = oFF.noSupport;
oFF.PrTemplateStructure.prototype.putStringNotNullAndNotEmpty = oFF.noSupport;
oFF.PrTemplateStructure.prototype.releaseObject = function()
{
	this.m_structure = oFF.XObjectExt.release(this.m_structure);
	this.m_template = oFF.XObjectExt.release(this.m_template);
	this.m_replaceTemplateFields = oFF.XObjectExt.release(this.m_replaceTemplateFields);
	this.m_parent = null;
	this.m_root = null;
	oFF.PrElement.prototype.releaseObject.call( this );
};
oFF.PrTemplateStructure.prototype.remove = oFF.noSupport;
oFF.PrTemplateStructure.prototype.setParent = function(parent)
{
	this.m_parent = parent;
};
oFF.PrTemplateStructure.prototype.setupStructureWrapper = function(root, parent, structure, templateStruct)
{
	this.m_parent = parent;
	this.m_structure = structure;
	let replaceList = this.m_structure.getListByKey(oFF.PrTemplateStructure.TEMPLATE_REPLACE_NAME);
	if (oFF.notNull(replaceList))
	{
		this.m_replaceTemplateFields = oFF.XHashSetOfString.create();
		let len = replaceList.size();
		for (let i = 0; i < len; i++)
		{
			this.m_replaceTemplateFields.add(replaceList.getStringAt(i));
		}
	}
	this.m_root = root;
	this.m_template = templateStruct;
	if (oFF.isNull(this.m_template))
	{
		oFF.XObjectExt.assertNotNullExt(this.m_root, "root shall never be null");
		this.m_template = this.tryGetTemplateFromRoot();
	}
};
oFF.PrTemplateStructure.prototype.size = function()
{
	let result = this.m_structure.size();
	if (oFF.notNull(this.m_template))
	{
		result = result + this.m_template.size();
	}
	return result;
};
oFF.PrTemplateStructure.prototype.tryGetTemplateFromRoot = function()
{
	let templatePath = this.m_structure.getStringByKey(oFF.PrTemplateStructure.TEMPLATE_PATH_NAME);
	if (oFF.XStringUtils.isNullOrEmpty(templatePath) || !oFF.XString.startsWith(templatePath, "#"))
	{
		return null;
	}
	let result = this.m_root;
	let splitPath = oFF.XStringTokenizer.splitString(templatePath, "/");
	let len = splitPath.size();
	for (let i = 1; i < len; i++)
	{
		result = result.getStructureByKey(splitPath.get(i));
	}
	return oFF.PrTemplateStructure.createStructureWrapper(this.m_root, this.getParent(), result);
};

oFF.XProperties = function() {};
oFF.XProperties.prototype = new oFF.DfAbstractMapByString();
oFF.XProperties.prototype._ff_c = "XProperties";

oFF.XProperties.create = function()
{
	let properties = new oFF.XProperties();
	properties.setupExt(null, null);
	return properties;
};
oFF.XProperties.createByMapCopy = function(origin)
{
	let properties = new oFF.XProperties();
	properties.setupExt(origin, null);
	return properties;
};
oFF.XProperties.createWithParent = function(parent)
{
	let properties = new oFF.XProperties();
	properties.setupExt(null, parent);
	return properties;
};
oFF.XProperties.prototype.m_isParentEnabled = false;
oFF.XProperties.prototype.m_parent = null;
oFF.XProperties.prototype.m_storage = null;
oFF.XProperties.prototype.assertNameAndGet = function(name)
{
	let value = this.getByKey(name);
	oFF.XStringUtils.checkStringNotEmpty(value, oFF.XStringUtils.concatenate2("Property cannot be found: ", name));
	return value;
};
oFF.XProperties.prototype.clear = function()
{
	this.m_storage.clear();
};
oFF.XProperties.prototype.cloneExt = function(flags)
{
	let target = oFF.XProperties.createByMapCopy(this);
	if (oFF.notNull(this.m_parent))
	{
		this.setParent(this.m_parent);
		this.setEnableParentProperties(this.m_isParentEnabled);
	}
	return target;
};
oFF.XProperties.prototype.contains = function(element)
{
	let contains = this.m_storage.contains(element);
	if (contains === false && this.m_isParentEnabled === true)
	{
		contains = this.m_parent.contains(element);
	}
	return contains;
};
oFF.XProperties.prototype.containsKey = function(key)
{
	let hasKey = this.m_storage.containsKey(key);
	if (hasKey === false && this.m_isParentEnabled === true)
	{
		hasKey = this.m_parent.containsKey(key);
	}
	return hasKey;
};
oFF.XProperties.prototype.createMapByStringCopy = function()
{
	let copy;
	if (this.m_isParentEnabled === true)
	{
		let keys = this.getKeysAsReadOnlyList();
		copy = oFF.XHashMapByString.create();
		for (let i = 0; i < keys.size(); i++)
		{
			let key = keys.get(i);
			let value = this.getByKey(key);
			copy.put(key, value);
		}
	}
	else
	{
		copy = this.m_storage.createMapByStringCopy();
	}
	return copy;
};
oFF.XProperties.prototype.deserialize = function(content)
{
	let lines = oFF.XStringTokenizer.splitString(content, "\n");
	if (oFF.notNull(lines))
	{
		for (let i = 0; i < lines.size(); i++)
		{
			let escapedLine = lines.get(i);
			let currentLine = oFF.XStringUtils.unescapeLineEndings(escapedLine);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(currentLine))
			{
				if (!oFF.XString.startsWith(currentLine, "#"))
				{
					let index = oFF.XString.indexOf(currentLine, "=");
					if (index !== -1)
					{
						let value = oFF.XString.substring(currentLine, index + 1, -1);
						let name = oFF.XString.trim(oFF.XString.substring(currentLine, 0, index));
						this.put(name, value);
					}
				}
			}
		}
	}
};
oFF.XProperties.prototype.getBooleanByKey = function(name)
{
	return oFF.XBoolean.convertFromString(this.assertNameAndGet(name));
};
oFF.XProperties.prototype.getBooleanByKeyExt = function(name, defaultValue)
{
	let value = this.getByKey(name);
	return oFF.isNull(value) ? defaultValue : oFF.XBoolean.convertFromStringWithDefault(value, defaultValue);
};
oFF.XProperties.prototype.getByKey = function(key)
{
	let value = this.m_storage.getByKey(key);
	if (oFF.isNull(value) && this.m_isParentEnabled === true)
	{
		value = this.m_parent.getByKey(key);
	}
	return value;
};
oFF.XProperties.prototype.getComponentType = function()
{
	return this.getValueType();
};
oFF.XProperties.prototype.getDoubleByKey = function(name)
{
	return oFF.XDouble.convertFromString(this.assertNameAndGet(name));
};
oFF.XProperties.prototype.getDoubleByKeyExt = function(name, defaultValue)
{
	let value = this.getByKey(name);
	return oFF.isNull(value) ? defaultValue : oFF.XDouble.convertFromStringWithDefault(value, defaultValue);
};
oFF.XProperties.prototype.getIntegerByKey = function(name)
{
	return oFF.XInteger.convertFromStringWithRadix(this.assertNameAndGet(name), 10);
};
oFF.XProperties.prototype.getIntegerByKeyExt = function(name, defaultValue)
{
	let value = this.getByKey(name);
	return oFF.isNull(value) ? defaultValue : oFF.XInteger.convertFromStringWithDefault(value, defaultValue);
};
oFF.XProperties.prototype.getKeysAsReadOnlyList = function()
{
	let keys;
	keys = this.m_storage.getKeysAsReadOnlyList();
	if (this.m_isParentEnabled === true)
	{
		let combinedList = oFF.XHashSetOfString.create();
		combinedList.addAll(keys);
		let parentList = this.m_parent.getKeysAsReadOnlyList();
		combinedList.addAll(parentList);
		keys = combinedList.getValuesAsReadOnlyList();
	}
	return keys;
};
oFF.XProperties.prototype.getLongByKey = function(name)
{
	return oFF.XLong.convertFromString(this.assertNameAndGet(name));
};
oFF.XProperties.prototype.getLongByKeyExt = function(name, defaultValue)
{
	let value = this.getByKey(name);
	return oFF.isNull(value) ? defaultValue : oFF.XLong.convertFromStringWithDefault(value, defaultValue);
};
oFF.XProperties.prototype.getParent = function()
{
	return this.m_parent;
};
oFF.XProperties.prototype.getStringByKey = function(name)
{
	return this.getByKey(name);
};
oFF.XProperties.prototype.getStringByKeyExt = function(name, defaultValue)
{
	let value = this.getByKey(name);
	if (oFF.isNull(value))
	{
		value = defaultValue;
	}
	return value;
};
oFF.XProperties.prototype.getStringRepresentation = function()
{
	return this.toString();
};
oFF.XProperties.prototype.getValueType = function()
{
	return oFF.XValueType.PROPERTIES;
};
oFF.XProperties.prototype.getValuesAsReadOnlyList = function()
{
	let values;
	if (this.m_isParentEnabled === true)
	{
		let keys = this.getKeysAsReadOnlyList();
		let target = oFF.XList.create();
		for (let i = 0; i < keys.size(); i++)
		{
			let key = keys.get(i);
			let value = this.getByKey(key);
			target.add(value);
		}
		target.sortByDirection(oFF.XSortDirection.ASCENDING);
		values = target;
	}
	else
	{
		values = this.m_storage.getValuesAsReadOnlyList();
	}
	return values;
};
oFF.XProperties.prototype.hasElements = function()
{
	let hasElements = this.m_storage.hasElements();
	if (hasElements === false && this.m_isParentEnabled === true)
	{
		hasElements = this.m_parent.hasElements();
	}
	return hasElements;
};
oFF.XProperties.prototype.hasNullByKey = function(name)
{
	return this.containsKey(name) && this.getByKey(name) === null;
};
oFF.XProperties.prototype.isParentPropertiesEnabled = function()
{
	return this.m_isParentEnabled;
};
oFF.XProperties.prototype.isValueDefault = function(key)
{
	return !this.isValueDefined(key);
};
oFF.XProperties.prototype.isValueDefined = function(key)
{
	return this.m_storage.containsKey(key);
};
oFF.XProperties.prototype.put = function(key, element)
{
	if (oFF.isNull(element))
	{
		this.m_storage.remove(key);
	}
	else
	{
		this.m_storage.put(key, element);
	}
};
oFF.XProperties.prototype.putBoolean = function(key, booleanValue)
{
	this.put(key, oFF.XBoolean.convertToString(booleanValue));
};
oFF.XProperties.prototype.putDouble = function(name, doubleValue)
{
	this.put(name, oFF.XDouble.convertToString(doubleValue));
};
oFF.XProperties.prototype.putInteger = function(name, intValue)
{
	this.put(name, oFF.XInteger.convertToString(intValue));
};
oFF.XProperties.prototype.putLong = function(name, longValue)
{
	this.put(name, oFF.XLong.convertToString(longValue));
};
oFF.XProperties.prototype.putNull = function(name)
{
	this.m_storage.put(name, null);
};
oFF.XProperties.prototype.putString = function(name, stringValue)
{
	if (oFF.isNull(stringValue))
	{
		this.m_storage.remove(name);
	}
	else
	{
		this.m_storage.put(name, stringValue);
	}
};
oFF.XProperties.prototype.putStringNotNull = function(name, stringValue)
{
	if (oFF.notNull(stringValue))
	{
		this.m_storage.put(name, stringValue);
	}
};
oFF.XProperties.prototype.putStringNotNullAndNotEmpty = function(name, stringValue)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(stringValue))
	{
		this.putString(name, stringValue);
	}
};
oFF.XProperties.prototype.releaseObject = function()
{
	this.m_storage = oFF.XObjectExt.release(this.m_storage);
	this.m_parent = null;
	oFF.DfAbstractMapByString.prototype.releaseObject.call( this );
};
oFF.XProperties.prototype.remove = function(key)
{
	return this.m_storage.remove(key);
};
oFF.XProperties.prototype.serialize = function()
{
	let keys = oFF.XList.create();
	keys.addAll(this.getKeysAsReadOnlyList());
	keys.sortByDirection(oFF.XSortDirection.ASCENDING);
	let buffer = oFF.XStringBuffer.create();
	for (let i = 0; i < keys.size(); i++)
	{
		let key = keys.get(i);
		let value = this.m_storage.getByKey(key);
		let unescapedProp = oFF.XStringUtils.concatenate3(key, "=", value);
		buffer.append(oFF.XStringUtils.escapeLineEndings(unescapedProp)).append("\n");
	}
	return buffer.toString();
};
oFF.XProperties.prototype.setEnableParentProperties = function(enableParentProperties)
{
	this.m_isParentEnabled = enableParentProperties && oFF.notNull(this.m_parent);
};
oFF.XProperties.prototype.setParent = function(parentProperties)
{
	this.m_parent = parentProperties;
	this.m_isParentEnabled = oFF.notNull(parentProperties);
};
oFF.XProperties.prototype.setupExt = function(origin, parent)
{
	if (oFF.isNull(origin))
	{
		this.m_storage = oFF.XHashMapByString.create();
	}
	else
	{
		this.m_storage = oFF.XHashMapByString.createWithMap(origin);
	}
	this.setParent(parent);
};
oFF.XProperties.prototype.size = function()
{
	let size;
	if (this.m_isParentEnabled === true)
	{
		size = this.getKeysAsReadOnlyList().size();
	}
	else
	{
		size = this.m_storage.size();
	}
	return size;
};
oFF.XProperties.prototype.toString = function()
{
	return this.m_storage.toString();
};

oFF.XPropertiesWithCaseInsensitiveKeys = function() {};
oFF.XPropertiesWithCaseInsensitiveKeys.prototype = new oFF.XProperties();
oFF.XPropertiesWithCaseInsensitiveKeys.prototype._ff_c = "XPropertiesWithCaseInsensitiveKeys";

oFF.XPropertiesWithCaseInsensitiveKeys.createExt = function()
{
	let properties = new oFF.XPropertiesWithCaseInsensitiveKeys();
	properties.setupExt(null, null);
	return properties;
};
oFF.XPropertiesWithCaseInsensitiveKeys.prototype.containsKey = function(key)
{
	return oFF.XProperties.prototype.containsKey.call( this , oFF.XString.toLowerCase(key));
};
oFF.XPropertiesWithCaseInsensitiveKeys.prototype.getByKey = function(key)
{
	return oFF.XProperties.prototype.getByKey.call( this , oFF.XString.toLowerCase(key));
};
oFF.XPropertiesWithCaseInsensitiveKeys.prototype.isValueDefined = function(key)
{
	return oFF.XProperties.prototype.isValueDefined.call( this , oFF.XString.toLowerCase(key));
};
oFF.XPropertiesWithCaseInsensitiveKeys.prototype.put = function(key, element)
{
	oFF.XProperties.prototype.put.call( this , oFF.XString.toLowerCase(key), element);
};
oFF.XPropertiesWithCaseInsensitiveKeys.prototype.putNull = function(name)
{
	oFF.XProperties.prototype.putNull.call( this , oFF.XString.toLowerCase(name));
};
oFF.XPropertiesWithCaseInsensitiveKeys.prototype.putString = function(name, stringValue)
{
	oFF.XProperties.prototype.putString.call( this , oFF.XString.toLowerCase(name), stringValue);
};
oFF.XPropertiesWithCaseInsensitiveKeys.prototype.putStringNotNull = function(name, stringValue)
{
	oFF.XProperties.prototype.putStringNotNull.call( this , oFF.XString.toLowerCase(name), stringValue);
};
oFF.XPropertiesWithCaseInsensitiveKeys.prototype.putStringNotNullAndNotEmpty = function(name, stringValue)
{
	oFF.XProperties.prototype.putStringNotNullAndNotEmpty.call( this , oFF.XString.toLowerCase(name), stringValue);
};
oFF.XPropertiesWithCaseInsensitiveKeys.prototype.remove = function(key)
{
	return oFF.XProperties.prototype.remove.call( this , oFF.XString.toLowerCase(key));
};

oFF.StructuresModule = function() {};
oFF.StructuresModule.prototype = new oFF.DfModule();
oFF.StructuresModule.prototype._ff_c = "StructuresModule";

oFF.StructuresModule.s_module = null;
oFF.StructuresModule.getInstance = function()
{
	if (oFF.isNull(oFF.StructuresModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.CommonsExtModule.getInstance());
		oFF.StructuresModule.s_module = oFF.DfModule.startExt(new oFF.StructuresModule());
		oFF.XmlParserFactory.staticSetupXmlParserFactory();
		oFF.JsonParserGenericFactory.staticSetup();
		oFF.DocumentFormatType.staticSetup();
		oFF.XmlUtils.staticSetup();
		oFF.PrElementType.staticSetup();
		oFF.PrFactoryUniversal.staticSetup();
		oFF.PrSerializerFactory.staticSetup();
		oFF.JsonParserFactory.staticSetupJsonParserFactory();
		oFF.JsonFilteringSerializerFactory.staticSetup();
		oFF.DfModule.stopExt(oFF.StructuresModule.s_module);
	}
	return oFF.StructuresModule.s_module;
};
oFF.StructuresModule.prototype.getName = function()
{
	return "ff0070.structures";
};

oFF.StructuresModule.getInstance();

return oFF;
} );