/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff0000.language.native"
],
function(oFF)
{
"use strict";

oFF.XApiVersion = {

	API_ACTIVE:0,
	API_DEFAULT:2,
	API_MAX:3,
	API_MIN:2,
	API_V2_COLLECTIONS:2,
	API_V3_SYNC_ACTION:3,
	GIT_COMMIT_ID:"$$GitCommitId$$",
	LIBRARY:16112300
};

oFF.DfIdObject = function() {};
oFF.DfIdObject.prototype = new oFF.XObject();
oFF.DfIdObject.prototype._ff_c = "DfIdObject";

oFF.DfIdObject.prototype.m_id = null;
oFF.DfIdObject.prototype.getId = function()
{
	return this.m_id;
};
oFF.DfIdObject.prototype.releaseObject = function()
{
	this.m_id = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.DfIdObject.prototype.setupExt = function(identifier)
{
	oFF.XObject.prototype.setup.call( this );
	this.m_id = identifier;
};
oFF.DfIdObject.prototype.toString = function()
{
	return this.getId();
};

oFF.XKeyValuePair = function() {};
oFF.XKeyValuePair.prototype = new oFF.XObject();
oFF.XKeyValuePair.prototype._ff_c = "XKeyValuePair";

oFF.XKeyValuePair.create = function()
{
	return new oFF.XKeyValuePair();
};
oFF.XKeyValuePair.prototype.m_key = null;
oFF.XKeyValuePair.prototype.m_value = null;
oFF.XKeyValuePair.prototype.m_valueType = null;
oFF.XKeyValuePair.prototype.cloneExt = function(flags)
{
	let clone = oFF.XKeyValuePair.create();
	clone.setKey(this.m_key);
	clone.setValue(this.m_value);
	clone.setValueType(this.getValueType());
	return clone;
};
oFF.XKeyValuePair.prototype.getKey = function()
{
	return this.m_key;
};
oFF.XKeyValuePair.prototype.getValue = function()
{
	return this.m_value;
};
oFF.XKeyValuePair.prototype.getValueType = function()
{
	return this.m_valueType;
};
oFF.XKeyValuePair.prototype.isEqualTo = function(other)
{
	if (oFF.isNull(other))
	{
		return false;
	}
	if (this === other)
	{
		return true;
	}
	let otherPair = other;
	if (otherPair.getValueType() !== this.getValueType())
	{
		return false;
	}
	if (!otherPair.getKey().isEqualTo(this.m_key))
	{
		return false;
	}
	if (!otherPair.getValue().isEqualTo(this.m_value))
	{
		return false;
	}
	return true;
};
oFF.XKeyValuePair.prototype.releaseObject = function()
{
	this.m_key = null;
	this.m_value = null;
	this.m_valueType = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.XKeyValuePair.prototype.setKey = function(key)
{
	this.m_key = key;
};
oFF.XKeyValuePair.prototype.setKeyValue = function(key, value)
{
	this.m_key = key;
	this.m_value = value;
};
oFF.XKeyValuePair.prototype.setValue = function(value)
{
	this.m_value = value;
};
oFF.XKeyValuePair.prototype.setValueType = function(valueType)
{
	this.m_valueType = valueType;
};
oFF.XKeyValuePair.prototype.toString = function()
{
	let str = oFF.XStringBuffer.create();
	str.append("Key ");
	if (oFF.notNull(this.m_key))
	{
		str.append(this.m_key.toString());
	}
	str.append("Value ");
	if (oFF.notNull(this.m_value))
	{
		str.append(this.m_value.toString());
	}
	return str.toString();
};

oFF.XBiConsumerHolder = function() {};
oFF.XBiConsumerHolder.prototype = new oFF.XObject();
oFF.XBiConsumerHolder.prototype._ff_c = "XBiConsumerHolder";

oFF.XBiConsumerHolder.create = function(consumer)
{
	let holderInstance = new oFF.XBiConsumerHolder();
	holderInstance.m_internalConsumer = consumer;
	return holderInstance;
};
oFF.XBiConsumerHolder.prototype.m_internalConsumer = null;
oFF.XBiConsumerHolder.prototype.accept = function(t, u)
{
	if (oFF.notNull(this.m_internalConsumer))
	{
		this.m_internalConsumer(t, u);
	}
};
oFF.XBiConsumerHolder.prototype.getConsumer = function()
{
	return this.m_internalConsumer;
};
oFF.XBiConsumerHolder.prototype.releaseObject = function()
{
	this.m_internalConsumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.XBiFunctionHolder = function() {};
oFF.XBiFunctionHolder.prototype = new oFF.XObject();
oFF.XBiFunctionHolder.prototype._ff_c = "XBiFunctionHolder";

oFF.XBiFunctionHolder.create = function(_function)
{
	let holderInstance = new oFF.XBiFunctionHolder();
	holderInstance.m_internalFunction = _function;
	return holderInstance;
};
oFF.XBiFunctionHolder.prototype.m_internalFunction = null;
oFF.XBiFunctionHolder.prototype.apply = function(t, u)
{
	if (oFF.notNull(this.m_internalFunction))
	{
		return this.m_internalFunction(t, u);
	}
	return null;
};
oFF.XBiFunctionHolder.prototype.getFunction = function()
{
	return this.m_internalFunction;
};
oFF.XBiFunctionHolder.prototype.releaseObject = function()
{
	this.m_internalFunction = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.XConsumerHolder = function() {};
oFF.XConsumerHolder.prototype = new oFF.XObject();
oFF.XConsumerHolder.prototype._ff_c = "XConsumerHolder";

oFF.XConsumerHolder.create = function(consumer)
{
	let holderInstance = new oFF.XConsumerHolder();
	holderInstance.m_internalConsumer = consumer;
	return holderInstance;
};
oFF.XConsumerHolder.prototype.m_internalConsumer = null;
oFF.XConsumerHolder.prototype.accept = function(t)
{
	if (oFF.notNull(this.m_internalConsumer))
	{
		this.m_internalConsumer(t);
	}
};
oFF.XConsumerHolder.prototype.getConsumer = function()
{
	return this.m_internalConsumer;
};
oFF.XConsumerHolder.prototype.releaseObject = function()
{
	this.m_internalConsumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.XFunctionHolder = function() {};
oFF.XFunctionHolder.prototype = new oFF.XObject();
oFF.XFunctionHolder.prototype._ff_c = "XFunctionHolder";

oFF.XFunctionHolder.create = function(_function)
{
	let holderInstance = new oFF.XFunctionHolder();
	holderInstance.m_internalFunction = _function;
	return holderInstance;
};
oFF.XFunctionHolder.prototype.m_internalFunction = null;
oFF.XFunctionHolder.prototype.apply = function(t)
{
	if (oFF.notNull(this.m_internalFunction))
	{
		return this.m_internalFunction(t);
	}
	return null;
};
oFF.XFunctionHolder.prototype.releaseObject = function()
{
	this.m_internalFunction = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.XProcedureHolder = function() {};
oFF.XProcedureHolder.prototype = new oFF.XObject();
oFF.XProcedureHolder.prototype._ff_c = "XProcedureHolder";

oFF.XProcedureHolder.create = function(procedure)
{
	let holderInstance = new oFF.XProcedureHolder();
	holderInstance.m_internalProcedure = procedure;
	return holderInstance;
};
oFF.XProcedureHolder.prototype.m_internalProcedure = null;
oFF.XProcedureHolder.prototype.execute = function()
{
	if (oFF.notNull(this.m_internalProcedure))
	{
		this.m_internalProcedure();
	}
};
oFF.XProcedureHolder.prototype.getProcedure = function()
{
	return this.m_internalProcedure;
};
oFF.XProcedureHolder.prototype.releaseObject = function()
{
	this.m_internalProcedure = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.XTriConsumerHolder = function() {};
oFF.XTriConsumerHolder.prototype = new oFF.XObject();
oFF.XTriConsumerHolder.prototype._ff_c = "XTriConsumerHolder";

oFF.XTriConsumerHolder.create = function(consumer)
{
	let holderInstance = new oFF.XTriConsumerHolder();
	holderInstance.m_internalConsumer = consumer;
	return holderInstance;
};
oFF.XTriConsumerHolder.prototype.m_internalConsumer = null;
oFF.XTriConsumerHolder.prototype.accept = function(t, u, z)
{
	if (oFF.notNull(this.m_internalConsumer))
	{
		this.m_internalConsumer(t, u, z);
	}
};
oFF.XTriConsumerHolder.prototype.getConsumer = function()
{
	return this.m_internalConsumer;
};
oFF.XTriConsumerHolder.prototype.releaseObject = function()
{
	this.m_internalConsumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.XBooleanUtils = {

	checkFalse:function(value, message)
	{
			if (value)
		{
			throw oFF.XException.createRuntimeException(message);
		}
	},
	checkTrue:function(value, message)
	{
			if (!value)
		{
			throw oFF.XException.createRuntimeException(message);
		}
	}
};

oFF.XByteArrayUtils = {

	isEqual:function(firstValue, secondValue)
	{
			let isIdentical;
		if (firstValue === secondValue)
		{
			isIdentical = true;
		}
		else if (oFF.isNull(firstValue) || oFF.isNull(secondValue))
		{
			isIdentical = false;
		}
		else
		{
			if (firstValue.size() !== secondValue.size())
			{
				isIdentical = false;
			}
			else
			{
				let size = firstValue.size();
				isIdentical = true;
				for (let i = 0; i < size; i++)
				{
					if (firstValue.getByteAt(i) !== secondValue.getByteAt(i))
					{
						isIdentical = false;
						break;
					}
				}
			}
		}
		return isIdentical;
	}
};

oFF.XStringUtils = {

	_convertCamelCase:function(name, seperator)
	{
			let size = oFF.XString.size(name);
		let buffer = oFF.XStringBuffer.create();
		let mode = 0;
		for (let i = 0; i < size; i++)
		{
			let charAt = oFF.XString.getCharAt(name, i);
			let newMode = 0;
			if (charAt >= 48 && charAt <= 57)
			{
				newMode = 1;
			}
			else if (charAt >= 65 && charAt <= 90)
			{
				newMode = 2;
			}
			else if (charAt >= 97 && charAt <= 122)
			{
				newMode = 3;
			}
			if (newMode !== mode && newMode !== 3 && i > 0)
			{
				buffer.append(seperator);
			}
			mode = newMode;
			buffer.appendChar(charAt);
		}
		return buffer.toString();
	},
	abbreviate:function(text, maxLength)
	{
			if (oFF.notNull(text) && maxLength > 3 && oFF.XString.size(text) > maxLength)
		{
			return oFF.XStringUtils.concatenate2(oFF.XString.substring(text, 0, maxLength - 3), "...");
		}
		return text;
	},
	addNumberPadded:function(number, digitSize)
	{
			let buffer = oFF.XStringBuffer.create();
		let numberAsString = oFF.XInteger.convertToString(number);
		let size = oFF.XString.size(numberAsString);
		for (let i = size; i < digitSize; i++)
		{
			buffer.append("0");
		}
		buffer.append(numberAsString);
		return buffer.toString();
	},
	assertNotNullOrEmpty:function(s)
	{
			if (oFF.XStringUtils.isNullOrEmpty(s))
		{
			throw oFF.XException.createRuntimeException("The string must not be null or empty.");
		}
		return s;
	},
	camelCaseToDisplayText:function(name)
	{
			if (oFF.isNull(name))
		{
			return name;
		}
		return oFF.XStringUtils._convertCamelCase(name, " ");
	},
	camelCaseToKebapCase:function(name)
	{
			if (oFF.isNull(name))
		{
			return name;
		}
		return oFF.XStringUtils._convertCamelCase(name, "-");
	},
	camelCaseToUpperCase:function(name)
	{
			if (oFF.isNull(name))
		{
			return name;
		}
		return oFF.XString.toUpperCase(oFF.XStringUtils._convertCamelCase(name, "_"));
	},
	capitalize:function(text)
	{
			if (oFF.XStringUtils.isNullOrEmpty(text))
		{
			return text;
		}
		let capitalizedText = oFF.XString.toLowerCase(text);
		capitalizedText = oFF.XStringUtils.concatenate2(oFF.XString.toUpperCase(oFF.XString.substring(capitalizedText, 0, 1)), oFF.XString.substring(capitalizedText, 1, -1));
		return capitalizedText;
	},
	checkStringNotEmpty:function(value, message)
	{
			if (oFF.XStringUtils.isNullOrEmpty(value))
		{
			if (oFF.isNull(message))
			{
				throw oFF.XException.createIllegalArgumentException("The value must not be null!");
			}
			throw oFF.XException.createIllegalArgumentException(message);
		}
	},
	concatenate2:function(s1, s2)
	{
			let buffer = oFF.XStringBuffer.create().append(s1).append(s2);
		return buffer.toString();
	},
	concatenate3:function(s1, s2, s3)
	{
			let buffer = oFF.XStringBuffer.create().append(s1).append(s2).append(s3);
		return buffer.toString();
	},
	concatenate4:function(s1, s2, s3, s4)
	{
			let buffer = oFF.XStringBuffer.create().append(s1).append(s2).append(s3).append(s4);
		return buffer.toString();
	},
	concatenate5:function(s1, s2, s3, s4, s5)
	{
			let buffer = oFF.XStringBuffer.create().append(s1).append(s2).append(s3).append(s4).append(s5);
		return buffer.toString();
	},
	concatenateWithInt:function(s1, s2)
	{
			let buffer = oFF.XStringBuffer.create().append(s1).appendInt(s2);
		return buffer.toString();
	},
	containsString:function(s1, s2, ignoreCase)
	{
			if (!ignoreCase)
		{
			return oFF.XString.containsString(s1, s2);
		}
		let isS1Empty = oFF.XStringUtils.isNullOrEmpty(s1);
		let isS2Empty = oFF.XStringUtils.isNullOrEmpty(s2);
		if (isS1Empty && isS2Empty)
		{
			return true;
		}
		if (isS1Empty !== isS2Empty)
		{
			return false;
		}
		let s1UC = oFF.XString.toUpperCase(s1);
		let s2UC = oFF.XString.toUpperCase(s2);
		return oFF.XString.containsString(s1UC, s2UC);
	},
	escapeCodeString:function(text)
	{
			let result = oFF.XString.replace(text, "\r", "\\r");
		result = oFF.XString.replace(result, "\n", "\\n");
		result = oFF.XString.replace(result, "\"", "\\\"");
		return result;
	},
	escapeControlChars:function(text)
	{
			let escapedString = text;
		if (oFF.XString.containsString(escapedString, "\u0001"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u0001", "\\u0001");
		}
		if (oFF.XString.containsString(escapedString, "\u0002"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u0002", "\\u0002");
		}
		if (oFF.XString.containsString(escapedString, "\u0003"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u0003", "\\u0003");
		}
		if (oFF.XString.containsString(escapedString, "\u0004"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u0004", "\\u0004");
		}
		if (oFF.XString.containsString(escapedString, "\u0005"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u0005", "\\u0005");
		}
		if (oFF.XString.containsString(escapedString, "\u0006"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u0006", "\\u0006");
		}
		if (oFF.XString.containsString(escapedString, "\u0007"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u0007", "\\u0007");
		}
		if (oFF.XString.containsString(escapedString, "\u000B"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u000B", "\\u000B");
		}
		if (oFF.XString.containsString(escapedString, "\u000E"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u000E", "\\u000E");
		}
		if (oFF.XString.containsString(escapedString, "\u000F"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u000F", "\\u000F");
		}
		if (oFF.XString.containsString(escapedString, "\u0010"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u0010", "\\u0010");
		}
		if (oFF.XString.containsString(escapedString, "\u0011"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u0011", "\\u0011");
		}
		if (oFF.XString.containsString(escapedString, "\u0012"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u0012", "\\u0012");
		}
		if (oFF.XString.containsString(escapedString, "\u0013"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u0013", "\\u0013");
		}
		if (oFF.XString.containsString(escapedString, "\u0014"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u0014", "\\u0014");
		}
		if (oFF.XString.containsString(escapedString, "\u0015"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u0015", "\\u0015");
		}
		if (oFF.XString.containsString(escapedString, "\u0016"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u0016", "\\u0016");
		}
		if (oFF.XString.containsString(escapedString, "\u0017"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u0017", "\\u0017");
		}
		if (oFF.XString.containsString(escapedString, "\u0018"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u0018", "\\u0018");
		}
		if (oFF.XString.containsString(escapedString, "\u0019"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u0019", "\\u0019");
		}
		if (oFF.XString.containsString(escapedString, "\u001A"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u001A", "\\u001A");
		}
		if (oFF.XString.containsString(escapedString, "\u001B"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u001B", "\\u001B");
		}
		if (oFF.XString.containsString(escapedString, "\u001C"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u001C", "\\u001C");
		}
		if (oFF.XString.containsString(escapedString, "\u001D"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u001D", "\\u001D");
		}
		if (oFF.XString.containsString(escapedString, "\u001E"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u001E", "\\u001E");
		}
		if (oFF.XString.containsString(escapedString, "\u001F"))
		{
			escapedString = oFF.XString.replace(escapedString, "\u001F", "\\u001F");
		}
		return escapedString;
	},
	escapeHtml:function(text)
	{
			let result = oFF.XString.replace(text, "&", "&#38;");
		result = oFF.XString.replace(result, "<", "&#60;");
		result = oFF.XString.replace(result, ">", "&#62;");
		result = oFF.XString.replace(result, "\"", "&#34;");
		return result;
	},
	escapeJsonForCode:function(jsonValue)
	{
			let result = oFF.XString.replace(jsonValue, "\\", "\\\\");
		result = oFF.XString.replace(result, "\r", "\\r");
		result = oFF.XString.replace(result, "\n", "\\n");
		result = oFF.XString.replace(result, "\"", "\\\"");
		return result;
	},
	escapeLineEndings:function(text)
	{
			let escapedString = text;
		escapedString = oFF.XString.replace(escapedString, "\n", "&#10;");
		escapedString = oFF.XString.replace(escapedString, "\r", "&#13;");
		return escapedString;
	},
	isAlphaNumeric:function(value)
	{
			if (oFF.XStringUtils.isNullOrEmpty(value))
		{
			return true;
		}
		let isCharPresent = false;
		let isNumPresent = false;
		let safeDefault = -999;
		let len = oFF.XString.size(value);
		for (let i = 0; i < len; i++)
		{
			let s = oFF.XString.substring(value, i, i + 1);
			let convertStringToIntegerWithDefault = oFF.XInteger.convertFromStringWithDefault(s, safeDefault);
			if (convertStringToIntegerWithDefault === safeDefault)
			{
				isCharPresent = true;
			}
			else
			{
				isNumPresent = true;
			}
			if (isNumPresent && isCharPresent)
			{
				return true;
			}
		}
		return false;
	},
	isNotNullAndNotEmpty:function(value)
	{
			return oFF.notNull(value) && !oFF.XString.isEqual(value, "");
	},
	isNullOrEmpty:function(value)
	{
			return oFF.isNull(value) || oFF.XString.isEqual(value, "");
	},
	isNumber:function(inputString)
	{
			try
		{
			oFF.XDouble.convertFromString(inputString);
			return true;
		}
		catch (exception)
		{
			return false;
		}
	},
	isWildcardPatternMatching:function(value, searchPattern)
	{
			let starting = null;
		let matching = true;
		let restPattern = searchPattern;
		let restValue = value;
		let pendingWildcardSkip = false;
		while (matching)
		{
			let pos = oFF.XString.indexOf(restPattern, "*");
			if (pos < 0)
			{
				matching = pendingWildcardSkip ? oFF.XString.size(restPattern) === 0 || oFF.XString.endsWith(restValue, restPattern) : oFF.XString.isEqual(restValue, restPattern);
				break;
			}
			else if (pos === 0)
			{
				pendingWildcardSkip = true;
				restPattern = oFF.XString.substring(restPattern, 1, -1);
			}
			else if (pos > 0)
			{
				starting = oFF.XString.substring(restPattern, 0, pos);
				let matchIndex = oFF.XString.indexOf(restValue, starting);
				matching = pendingWildcardSkip ? matchIndex > -1 : matchIndex === 0;
				if (matching)
				{
					restPattern = oFF.XString.substring(restPattern, pos, -1);
					restValue = oFF.XString.substring(restValue, matchIndex + pos, -1);
					pendingWildcardSkip = false;
				}
			}
		}
		return matching;
	},
	leftPad:function(value, spacer, count)
	{
			let buffer = oFF.XStringBuffer.create();
		for (let i = 0; i < count; i++)
		{
			buffer.append(spacer);
		}
		buffer.append(value);
		return buffer.toString();
	},
	normalizeLineEndings:function(value)
	{
			if (oFF.XStringUtils.isNullOrEmpty(value))
		{
			return value;
		}
		let normalizedString = oFF.XString.replace(value, "\r\n", "\n");
		return oFF.XString.replace(normalizedString, "\r", "\n");
	},
	normalizeLineEndingsToUnix:function(value)
	{
			return oFF.XStringUtils.normalizeLineEndings(value);
	},
	normalizeLineEndingsToWindows:function(value)
	{
			if (oFF.XStringUtils.isNullOrEmpty(value))
		{
			return value;
		}
		let normalizedString = oFF.XString.replace(value, "\r\n", "\n");
		normalizedString = oFF.XString.replace(normalizedString, "\r", "\n");
		return oFF.XString.replace(normalizedString, "\n", "\r\n");
	},
	nullToEmpty:function(value)
	{
			return oFF.isNull(value) ? "" : value;
	},
	repeat:function(value, count)
	{
			let buffer = oFF.XStringBuffer.create();
		for (let i = 0; i < count; i++)
		{
			buffer.append(value);
		}
		return buffer.toString();
	},
	rightPad:function(value, spacer, count)
	{
			let buffer = oFF.XStringBuffer.create().append(value);
		for (let i = 0; i < count; i++)
		{
			buffer.append(spacer);
		}
		return buffer.toString();
	},
	stripChars:function(value, numberOfChars)
	{
			if (numberOfChars < 1)
		{
			return value;
		}
		let size = oFF.XString.size(value);
		if (numberOfChars * 2 > size)
		{
			return "";
		}
		return oFF.XString.substring(value, numberOfChars, size - numberOfChars);
	},
	stripRight:function(value, numberOfChars)
	{
			if (numberOfChars < 1)
		{
			return value;
		}
		let size = oFF.XString.size(value);
		if (numberOfChars > size)
		{
			return "";
		}
		return oFF.XString.substring(value, 0, size - numberOfChars);
	},
	stripStart:function(text, valueToRemove)
	{
			let result = text;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(result) && oFF.XStringUtils.isNotNullAndNotEmpty(valueToRemove))
		{
			while (oFF.XString.startsWith(result, valueToRemove))
			{
				result = oFF.XString.substring(result, oFF.XString.size(valueToRemove), -1);
			}
		}
		return result;
	},
	unescapeLineEndings:function(text)
	{
			let escapedString = text;
		escapedString = oFF.XString.replace(escapedString, "&#10;", "\n");
		escapedString = oFF.XString.replace(escapedString, "&#13;", "\r");
		return escapedString;
	}
};

oFF.XUriUtils = {

	validateUri:function(uri)
	{
			if (oFF.isNull(uri) || oFF.XString.size(uri) === 0)
		{
			throw oFF.XException.createIllegalArgumentException("URL provided is null or empty");
		}
		let HTTP_PREFIX = "http://";
		let HTTPS_PREFIX = "https://";
		let DOUBLE_SLASH = "//";
		let searchIndex = 0;
		if (oFF.XString.startsWith(uri, HTTP_PREFIX))
		{
			searchIndex = 7;
		}
		else if (oFF.XString.startsWith(uri, HTTPS_PREFIX))
		{
			searchIndex = 8;
		}
		let slashSlashIndex = oFF.XString.indexOfFrom(uri, DOUBLE_SLASH, searchIndex);
		if (slashSlashIndex !== -1)
		{
			throw oFF.XException.createIllegalArgumentException("Invalid URL provided");
		}
	}
};

oFF.XLogBufferFlushing = function() {};
oFF.XLogBufferFlushing.prototype = new oFF.XObject();
oFF.XLogBufferFlushing.prototype._ff_c = "XLogBufferFlushing";

oFF.XLogBufferFlushing.create = function(logWriter, layer, severity, code)
{
	let bufferLog = new oFF.XLogBufferFlushing();
	bufferLog.m_logWriter = logWriter;
	bufferLog.m_layer = layer;
	bufferLog.m_severity = severity;
	bufferLog.m_code = code;
	bufferLog.m_buffer = oFF.XStringBuffer.create();
	return bufferLog;
};
oFF.XLogBufferFlushing.prototype.m_buffer = null;
oFF.XLogBufferFlushing.prototype.m_code = 0;
oFF.XLogBufferFlushing.prototype.m_layer = null;
oFF.XLogBufferFlushing.prototype.m_logWriter = null;
oFF.XLogBufferFlushing.prototype.m_severity = null;
oFF.XLogBufferFlushing.prototype.append = function(value)
{
	this.m_buffer.append(value);
	return this;
};
oFF.XLogBufferFlushing.prototype.appendBoolean = function(value)
{
	this.m_buffer.appendBoolean(value);
	return this;
};
oFF.XLogBufferFlushing.prototype.appendChar = function(value)
{
	this.m_buffer.appendChar(value);
	return this;
};
oFF.XLogBufferFlushing.prototype.appendDouble = function(value)
{
	this.m_buffer.appendDouble(value);
	return this;
};
oFF.XLogBufferFlushing.prototype.appendInt = function(value)
{
	this.m_buffer.appendInt(value);
	return this;
};
oFF.XLogBufferFlushing.prototype.appendLine = function(value)
{
	this.m_buffer.appendLine(value);
	return this;
};
oFF.XLogBufferFlushing.prototype.appendLong = function(value)
{
	this.m_buffer.appendLong(value);
	return this;
};
oFF.XLogBufferFlushing.prototype.appendNewLine = function()
{
	this.m_buffer.appendNewLine();
	return this;
};
oFF.XLogBufferFlushing.prototype.appendObject = function(value)
{
	this.m_buffer.appendObject(value);
	return this;
};
oFF.XLogBufferFlushing.prototype.clear = function()
{
	this.m_buffer.clear();
};
oFF.XLogBufferFlushing.prototype.flush = function()
{
	if (oFF.notNull(this.m_logWriter) && this.m_logWriter.isLogWritten(this.m_layer, this.m_severity))
	{
		this.m_logWriter.logExt(this.m_layer, this.m_severity, this.m_code, this.m_buffer.toString());
	}
};
oFF.XLogBufferFlushing.prototype.length = function()
{
	return this.m_buffer.length();
};

oFF.XAutoReleaseManager = function() {};
oFF.XAutoReleaseManager.prototype = new oFF.XObject();
oFF.XAutoReleaseManager.prototype._ff_c = "XAutoReleaseManager";

oFF.XAutoReleaseManager.s_manager = null;
oFF.XAutoReleaseManager.getInstance = function()
{
	return oFF.XAutoReleaseManager.s_manager;
};
oFF.XAutoReleaseManager.setInstance = function(manager)
{
	oFF.XAutoReleaseManager.s_manager = manager;
};
oFF.XAutoReleaseManager.staticSetup = function()
{
	oFF.XAutoReleaseManager.setInstance(new oFF.XAutoReleaseManager());
};
oFF.XAutoReleaseManager.prototype.execute = function(autoReleaseBlock)
{
	autoReleaseBlock.executeAutoReleaseBlock();
};
oFF.XAutoReleaseManager.prototype.getMemoryUsage = function()
{
	return -1;
};

oFF.XWeakReferenceUtil = {

	getHardRef:function(weakReference)
	{
			if (oFF.isNull(weakReference))
		{
			return null;
		}
		let reference = weakReference.getReference();
		if (oFF.isNull(reference) || reference.isReleased())
		{
			return null;
		}
		return reference;
	},
	getWeakRef:function(context)
	{
			if (oFF.isNull(context) || context.isReleased())
		{
			return null;
		}
		return oFF.XWeakReference.create(context);
	}
};

oFF.ErrorCodes = {

	ABAP_PASSWORD_IS_INITIAL:10023,
	ATTRIBUTE_NOT_FOUND:57,
	AUTHENTICATION_CANCELLED:6038,
	AUTOSUBMIT_FAILED:115,
	BASIC_AUTHENTICATION_CANCELED:2503,
	BLENDING_CONDITIONS_NOT_FULFILLED:6000,
	BLENDING_INVALID_MODEL_LINK:6009,
	BLENDING_PRIMARY_CALCULATION_DIMENSION_NOT_IN_DRILL:6010,
	BLEND_CALC_MEASURE_CONTEXT_IGNORED:2704,
	BW_DATE_TIME_DIMENSION_UNSUPPORTED_AS_LINKED_DIMENSION:6006,
	BW_RESOURCE_CONSTRAINTS:126,
	CALCULATED_DIMENSIONS_CAPABILITY_NOT_SUPPORTED:7000,
	CELL_CONTEXT_ACTION_FAILED:4251,
	CELL_DOCUMENT_ID_ACTION_FAILED:4250,
	CHOROPLETH_DRILL_PATH_CHOROPLETH_HIERARCHIES_NOT_LOADED:2872,
	CHOROPLETH_DRILL_PATH_FIELD_NOT_FOUND:2873,
	CHOROPLETH_DRILL_PATH_INVALID_PARAMETERS:2871,
	CURRENCY_VARIABLE_NOT_AVAILABLE_FOR_CURRENT_QUERY_MODEL:2861,
	CUSTOM_HIERARCHY_EXPIRED:333,
	DYNAMIC_TIME_MEASURE_INVALID_DEPENDENCY:2817,
	DYNAMIC_TIME_MEASURE_INVALID_DRILL_LEVEL:2807,
	DYNAMIC_TIME_MEASURE_INVALID_DRILL_PATH_VALUE:2834,
	DYNAMIC_TIME_MEASURE_INVALID_DYNAMIC_TIME_CALCULATION:2833,
	DYNAMIC_TIME_MEASURE_INVALID_FILTER_VALUE:2835,
	DYNAMIC_TIME_MEASURE_INVALID_FINEST_DRILL_LEVEL:2808,
	DYNAMIC_TIME_MEASURE_INVALID_MEMBER_NAVIGATION_WITH_FLAT_AND_HIERARCHICAL_FILTER:2816,
	DYNAMIC_TIME_MEASURE_INVALID_MULTIPLE_TIME_DIMENSION_IN_CARTESIAN_PRODUCT:2809,
	DYNAMIC_TIME_MEASURE_INVALID_PREVIOUS_PERIOD_NOT_DRILLED:2814,
	DYNAMIC_TIME_MEASURE_INVALID_TIME_DIMENSION:2801,
	DYNAMIC_TIME_MEASURE_INVALID_TIME_OPERATION_FUNCTION:2802,
	DYNAMIC_TIME_MEASURE_INVALID_TIME_OPERATION_GRANULARITY:2803,
	DYNAMIC_TIME_MEASURE_INVALID_TIME_OPERATION_GRANULARITY_IS_FINER_THAN_DRILL_LEVEL:2805,
	DYNAMIC_TIME_MEASURE_INVALID_TIME_OPERATION_GRANULARITY_IS_FINER_THAN_FILTER_LEVEL:2813,
	DYNAMIC_TIME_MEASURE_INVALID_TIME_OPERATION_GRANULARITY_NOT_IN_HIERARCHY:2804,
	DYNAMIC_TIME_MEASURE_INVALID_TIME_OPERATION_GRANULARITY_ON_DAY_DRILL_LEVEL:2825,
	DYNAMIC_TIME_MEASURE_INVALID_TIME_OPERATION_GRANULARITY_ON_DAY_FILTER_LEVEL:2826,
	DYNAMIC_TIME_MEASURE_INVALID_TIME_OPERATION_GRANULARITY_ON_WEEK_DAY_DRILL_LEVEL:2811,
	DYNAMIC_TIME_MEASURE_INVALID_TIME_OPERATION_GRANULARITY_ON_WEEK_DAY_FILTER_LEVEL:2812,
	DYNAMIC_TIME_MEASURE_INVALID_TO_DATE_ACROSS_MULTIPLE_VALUES:2820,
	DYNAMIC_TIME_MEASURE_INVALID_TO_DATE_FUNCTION_GRANULARITY:2806,
	DYNAMIC_TIME_MEASURE_INVALID_WEEK_ACROSS_YEAR_SINGLE_VALUE_FILTER:2818,
	DYNAMIC_TIME_MEASURE_NOT_SUPPORTED:2800,
	DYNAMIC_TIME_MEASURE_NO_TIME_IN_AXIS_OR_SINGLE_VALUE_FILTER:2810,
	DYNAMIC_TIME_MEASURE_OUT_OF_BOUND_MEMBER_NAVIGATION_WITH_FLAT_FILTER:2815,
	ET_BLACK_CAP:2605,
	ET_ELEMENT_NOT_FOUND:2602,
	ET_INVALID_CHILDREN:2603,
	ET_INVALID_VALUE:2604,
	ET_WHITE_CAP:2606,
	ET_WRONG_TYPE:2600,
	ET_WRONG_VALUE:2601,
	FAILED_TO_GET_CHOROPLETH_DRILL_PATH:2874,
	FAILED_TO_READ_CHOROPLETH_HIERARCHIES:2870,
	FILTER_ACROSS_MODEL_COMPOUND_PART_KEYS_NON_MATCHING:5015,
	FILTER_ACROSS_MODEL_CREATE_FILTER_FROM_TUPLE_ERROR:5001,
	FILTER_ACROSS_MODEL_DEPENDENT_QUERY_FAILED:5002,
	FILTER_ACROSS_MODEL_DIRECT_BW_RANGE_FILTER_POSSIBLE_QUERY_FAILURE:5012,
	FILTER_ACROSS_MODEL_EMPTY_TARGET_FILTER:5005,
	FILTER_ACROSS_MODEL_FTD_RANGE_FILTER_DIRECT_INCOMPATIBLE_HIERARCHY:5010,
	FILTER_ACROSS_MODEL_INCOMPLETE_RESULT_WARNING:5004,
	FILTER_ACROSS_MODEL_INCOMPLETE_TARGET_RESULT_WARNING:5007,
	FILTER_ACROSS_MODEL_INVALID_DIMENSION_HIERARCHY:5009,
	FILTER_ACROSS_MODEL_INVALID_LINK_DISPLAY_ATTRIBUTE:5023,
	FILTER_ACROSS_MODEL_INVALID_MODEL_LINK:5022,
	FILTER_ACROSS_MODEL_LINK_COMPOUND_FLAT_AND_HIERARCHY:5019,
	FILTER_ACROSS_MODEL_LINK_COMPOUND_INTERNAL_AND_EXTERNAL_HIERARCHY:5020,
	FILTER_ACROSS_MODEL_LINK_COMPOUND_KEY_VALUE_TYPE_MISMATCH:5021,
	FILTER_ACROSS_MODEL_LINK_COMPOUND_NON_COMPOUND:5018,
	FILTER_ACROSS_MODEL_LOV_BASED_FAILED:5003,
	FILTER_ACROSS_MODEL_LOV_INVALID_DRILL_LEVEL_REST_NODE_DOES_NOT_EXIST:5008,
	FILTER_ACROSS_MODEL_MISSING_LOV:5000,
	FILTER_ACROSS_MODEL_TARGET_MISSING_COMPLEX_FILTER_CAPABILITY:5014,
	FILTER_ACROSS_MODEL_TARGET_MISSING_EXCLUDE_FILTER_CAPABILITY:5016,
	FILTER_ACROSS_MODEL_TARGET_RANGE_FILTER_MISSING_RANGE_FILTER_CAPABILITY:5013,
	FILTER_ACROSS_MODEL_TARGET_TIME_HIERARCHY:5006,
	FORMULA_EXCEPTION_INVALID_DISPLAY_MEASURE:2750,
	FORMULA_MEASURE_MISSING_REQUIRED_DIMENSION:2819,
	FREE_PLACEHOLDER_NOT_FOUND:2701,
	GENERAL_VARIABLE_ERROR:90,
	HOST_UNREACHABLE:61,
	IMPORT_EXCEPTION_INACTIVE:40,
	IMPORT_EXCEPTION_INVALID_EVALUATE:42,
	IMPORT_EXCEPTION_NO_THRESHOLDS:41,
	IMPORT_EXTERNAL_FILTER_NOT_FOUND:43,
	IMPORT_FILTER_CAPABILITY_NOT_FOUND:20,
	IMPORT_FILTER_CAPABILITY_UNSUPPORTED_OPERATORS:21,
	IMPORT_VARIABE_NO_DIMENSION:30,
	INA_EXT_ADD_ROW_AUTHORIZATION_ADAPTOR_ERROR:6035,
	INA_EXT_ERROR:6030,
	INA_EXT_NO_ACCESS:6037,
	INA_EXT_UNSUPPORTED_REQUEST_TYPE_ERROR:6032,
	INA_EXT_UNSUPPORTED_RESPONSE_TYPE_ERROR:6033,
	INA_EXT_UPDATE_DATA_SOURCES_ADAPTOR_ERROR:6036,
	INA_EXT_UPDATE_ROW_DIMENSIONS_CATALOG_ADAPTER_ERROR:6034,
	INA_EXT_WARNING:6031,
	INVALID_DATATYPE:51,
	INVALID_DIMENSION:54,
	INVALID_ENCODER_KEY:57,
	INVALID_FIELD:56,
	INVALID_OPERATOR:53,
	INVALID_PARAMETER:55,
	INVALID_SERVER_METADATA_JSON:81,
	INVALID_STATE:50,
	INVALID_SYSTEM:80,
	INVALID_TOKEN:52,
	INVALID_URL:60,
	JOIN_FIELD_SET_AS_IGNORED_EXTERNAL_DIMENSION:2702,
	LINKED_HIERARCHY_DIMENSION_ALL_DATA:6008,
	LINK_DIMENSION_NOT_IN_DRILL:6003,
	MAXIMUM_NUMBER_OF_CURRENCY_TRANSLATIONS_EXCEEDED:2850,
	MEASURE_CONTEXT_RELEASED:3002,
	MEASURE_CYCLICAL_DEPENDENCY:3000,
	MEASURE_INVALID_DEPENDENCY:3004,
	MEASURE_MISSING_DEPENDENT:3001,
	MEASURE_MISSING_REQUIRED_DIMENSION:2822,
	MEASURE_MISSING_REQUIRED_FIELD:2821,
	MEASURE_PREFERRED_HIERARCHY_MISMATCH:3003,
	MISSING_DIMENSION_ON_ROWS_OR_COLUMNS:58,
	MODEL_INFRASTRUCTURE_TERMINATED:300,
	NO_DIMENSION_LINKS:6005,
	NO_VALUE_EXTRACTED_FROM_FRONTEND_CURRENCY_TRANSLATION_VARIABLE:2860,
	NO_VARIABLE_PROCESSOR_AFFECTED:4000,
	OBJECT_RELEASED:11,
	OTHER_ERROR:0,
	PARSER_ERROR:10,
	PARSING_ERROR_BOOLEAN_VALUE:88,
	PARSING_ERROR_COMPLEX_UNITS:100,
	PARSING_ERROR_CONDITIONS_COUNT:99,
	PARSING_ERROR_DATE_TIME_VALUE:91,
	PARSING_ERROR_DATE_VALUE:89,
	PARSING_ERROR_DOUBLE_VALUE:85,
	PARSING_ERROR_INT_VALUE:86,
	PARSING_ERROR_LINESTRING:93,
	PARSING_ERROR_LONG_VALUE:87,
	PARSING_ERROR_MULTILINESTRING:94,
	PARSING_ERROR_MULTI_POINT:96,
	PARSING_ERROR_MULTI_POLYGON:98,
	PARSING_ERROR_POINT:95,
	PARSING_ERROR_POLYGON:97,
	PARSING_ERROR_TIMESPAN:92,
	PARSING_ERROR_TIME_VALUE:90,
	PERSISTED_INA_REMOTE_MODEL_WITH_PREQUERIES_NOT_SUPPORTED:6001,
	PROGRAM_FAILED_TO_START:2504,
	QM_CUBE_ENTRY_NOT_FOUND:2700,
	QUERYMODEL_NOT_IN_USE:6002,
	SAME_DIMENSION_FILTERS_IGNORED:2703,
	SECONDARY_LINK_DIMENSION_IN_DRILL:6004,
	SERVER_METADATA_NOT_FOUND:2502,
	SERVICE_NOT_FOUND:2501,
	SERVICE_ROOT_EXCEPTION:2500,
	SYSTEM_IO:70,
	SYSTEM_IO_HTTP:73,
	SYSTEM_IO_READ_ACCESS:71,
	SYSTEM_IO_WRITE_ACCESS:72,
	THRESHOLD_INVALID_MEASURE_WITH_LINK_FORMULA:2824,
	THRESHOLD_INVALID_REFERENCE_MEASURE:2827,
	THRESHOLD_INVALID_REFERENCE_MEASURE_WITH_HIER_REQ_DIM:2828,
	THRESHOLD_MEASURE_NOT_FOUND:2832,
	THRESHOLD_MISSING_REFERENCE_MEASURE:2823,
	THRESHOLD_STRUCTURE_MEASURE_INVALID:2831,
	TIME_RANGE_FILTER_INVALID_DIMENSION_HIERARCHY:3100,
	TIME_RANGE_FILTER_INVALID_HIERARCHY_LEVEL:3101,
	VARIABLE_PROCESSOR_ALREADY_PROCESSING:4001,
	VERSION_INVALID_NO_VERSION_IN_AXIS_OR_SINGLE_VALUE_FILTER:2829,
	VIRTUAL_VERSION_INVALID_NO_VERSION_IN_AXIS_OR_SINGLE_VALUE_FILTER:2830
};

oFF.MessageCodes = {

	CORRELATION_ID_CODE:99999
};

oFF.XPair = function() {};
oFF.XPair.prototype = new oFF.XObject();
oFF.XPair.prototype._ff_c = "XPair";

oFF.XPair.create = function(firstObject, secondObject)
{
	let newObject = new oFF.XPair();
	newObject.m_firstObject = firstObject;
	newObject.m_secondObject = secondObject;
	return newObject;
};
oFF.XPair.prototype.m_firstObject = null;
oFF.XPair.prototype.m_secondObject = null;
oFF.XPair.prototype.getFirstObject = function()
{
	return this.m_firstObject;
};
oFF.XPair.prototype.getSecondObject = function()
{
	return this.m_secondObject;
};
oFF.XPair.prototype.releaseObject = function()
{
	this.m_firstObject = null;
	this.m_secondObject = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.XPair.prototype.setFirstObject = function(firstObject)
{
	this.m_firstObject = firstObject;
};
oFF.XPair.prototype.setSecondObject = function(secondObject)
{
	this.m_secondObject = secondObject;
};

oFF.XPairOfString = function() {};
oFF.XPairOfString.prototype = new oFF.XObject();
oFF.XPairOfString.prototype._ff_c = "XPairOfString";

oFF.XPairOfString.arePairsEqual = function(thisObject, otherObject)
{
	if (thisObject === otherObject)
	{
		return true;
	}
	if (oFF.isNull(thisObject) || oFF.isNull(otherObject))
	{
		return false;
	}
	return oFF.XObject.areObjectsEqual(thisObject.getFirstString(), otherObject.getFirstString()) && oFF.XObject.areObjectsEqual(thisObject.getSecondString(), otherObject.getSecondString());
};
oFF.XPairOfString.create = function(firstString, secondString)
{
	let newObject = new oFF.XPairOfString();
	newObject.m_firstString = firstString;
	newObject.m_secondString = secondString;
	return newObject;
};
oFF.XPairOfString.prototype.m_firstString = null;
oFF.XPairOfString.prototype.m_secondString = null;
oFF.XPairOfString.prototype.getFirstString = function()
{
	return this.m_firstString;
};
oFF.XPairOfString.prototype.getSecondString = function()
{
	return this.m_secondString;
};
oFF.XPairOfString.prototype.releaseObject = function()
{
	this.m_firstString = null;
	this.m_secondString = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.XPairOfString.prototype.setFirstString = function(firstString)
{
	this.m_firstString = firstString;
};
oFF.XPairOfString.prototype.setSecondString = function(secondString)
{
	this.m_secondString = secondString;
};

oFF.XObjectExt = function() {};
oFF.XObjectExt.prototype = new oFF.XObject();
oFF.XObjectExt.prototype._ff_c = "XObjectExt";

oFF.XObjectExt.s_allocationTracer = null;
oFF.XObjectExt._setAllocationTracer = function(tracer)
{
	oFF.XObjectExt.s_allocationTracer = tracer;
};
oFF.XObjectExt.areEqual = function(o1, o2)
{
	let retValue = false;
	if (oFF.isNull(o1) && oFF.isNull(o2))
	{
		retValue = true;
	}
	else if (oFF.notNull(o1) && oFF.notNull(o2))
	{
		retValue = o1.isEqualTo(o2);
	}
	return retValue;
};
oFF.XObjectExt.assertBool = function(actual, expected)
{
	if (actual !== expected)
	{
		let sb = oFF.XStringBuffer.create();
		sb.append("assertBool failed - actual \"");
		sb.appendBoolean(actual);
		sb.append("\" - expected \"");
		sb.appendBoolean(expected);
		sb.append("\"");
		oFF.XObjectExt.assertBoolExt(actual, expected, sb.toString());
	}
};
oFF.XObjectExt.assertBoolExt = function(actual, expected, message)
{
	if (actual !== expected)
	{
		throw oFF.XException.createAssertException(message);
	}
};
oFF.XObjectExt.assertDouble = function(actual, expected)
{
	let valueAsString = oFF.XDouble.convertToString(actual);
	let compareAsString = oFF.XDouble.convertToString(expected);
	if (!oFF.XString.isEqual(valueAsString, compareAsString))
	{
		let sb = oFF.XStringBuffer.create();
		sb.append("assertDouble failed - actual \"");
		sb.append(valueAsString);
		sb.append("\" - expected \"");
		sb.append(compareAsString);
		sb.append("\"");
		throw oFF.XException.createAssertException(sb.toString());
	}
};
oFF.XObjectExt.assertDoubleWithTolerance = function(actual, expected, tolerance)
{
	let difference = actual - expected;
	if (difference < 0)
	{
		difference = difference * -1;
	}
	if (difference > tolerance)
	{
		let sb = oFF.XStringBuffer.create();
		sb.append("assertDoubleWithTolerance failed - actual \"");
		sb.appendDouble(actual);
		sb.append("\" - expected \"");
		sb.appendDouble(expected);
		sb.append("\" - difference \"");
		sb.appendDouble(difference);
		sb.append("\" larger than expected tolerance \"");
		sb.appendDouble(tolerance);
		sb.append("\"");
		throw oFF.XException.createAssertException(sb.toString());
	}
};
oFF.XObjectExt.assertEquals = function(actual, expected)
{
	let areEqual = oFF.XObjectExt.areEqual(actual, expected);
	if (!areEqual)
	{
		let sb = oFF.XStringBuffer.create();
		sb.append("assertEquals failed - actual \"");
		if (oFF.isNull(actual))
		{
			sb.append("NULL");
		}
		else
		{
			sb.append(actual.toString());
		}
		sb.append("\" - expected \"");
		if (oFF.isNull(expected))
		{
			sb.append("NULL");
		}
		else
		{
			sb.append(expected.toString());
		}
		sb.append("\"");
		throw oFF.XException.createAssertException(sb.toString());
	}
};
oFF.XObjectExt.assertFalse = function(actual)
{
	oFF.XObjectExt.assertFalseExt(actual, "assertFalse failed");
};
oFF.XObjectExt.assertFalseExt = function(actual, message)
{
	if (actual)
	{
		throw oFF.XException.createAssertException(message);
	}
};
oFF.XObjectExt.assertInt = function(actual, expected)
{
	if (actual !== expected)
	{
		let sb = oFF.XStringBuffer.create();
		sb.append("assertInt failed - actual \"");
		sb.appendInt(actual);
		sb.append("\" - expected \"");
		sb.appendInt(expected);
		sb.append("\"");
		throw oFF.XException.createAssertException(sb.toString());
	}
};
oFF.XObjectExt.assertLong = function(actual, expected)
{
	if (actual !== expected)
	{
		let sb = oFF.XStringBuffer.create();
		sb.append("assertLong failed - actual \"");
		sb.appendLong(actual);
		sb.append("\" - expected \"");
		sb.appendLong(expected);
		sb.append("\"");
		throw oFF.XException.createAssertException(sb.toString());
	}
};
oFF.XObjectExt.assertNotEquals = function(actual, expected)
{
	let areEqual = oFF.XObjectExt.areEqual(actual, expected);
	if (areEqual)
	{
		throw oFF.XException.createAssertException("XObjectExt.assertNotEquals failed - Objects are equal");
	}
};
oFF.XObjectExt.assertNotNull = function(actual)
{
	return oFF.XObjectExt.assertNotNullExt(actual, "assertNotNull failed");
};
oFF.XObjectExt.assertNotNullExt = function(o1, message)
{
	if (oFF.isNull(o1))
	{
		let theMessage = message;
		if (oFF.isNull(theMessage))
		{
			theMessage = "The object must not be null!";
		}
		throw oFF.XException.createIllegalArgumentException(theMessage);
	}
	return o1;
};
oFF.XObjectExt.assertNotReleased = function(actual)
{
	if (oFF.isNull(actual))
	{
		throw oFF.XException.createIllegalArgumentException("The object must not be null!");
	}
	else if (actual.isReleased())
	{
		throw oFF.XException.createIllegalArgumentException("The object must not be in a released state!");
	}
};
oFF.XObjectExt.assertNull = function(actual)
{
	if (oFF.notNull(actual))
	{
		throw oFF.XException.createAssertException("assertNull failed");
	}
};
oFF.XObjectExt.assertString = function(actual, expected)
{
	if (!oFF.XString.isEqual(actual, expected))
	{
		let sb = oFF.XStringBuffer.create();
		sb.append("assertString failed - actual ");
		if (oFF.isNull(actual))
		{
			sb.append("is null ");
		}
		else
		{
			sb.append("\"").append(actual).append("\" ");
		}
		sb.append("- expected ");
		if (oFF.isNull(expected))
		{
			sb.append("is null ");
		}
		else
		{
			sb.append("\"").append(expected).append("\"");
		}
		throw oFF.XException.createAssertException(sb.toString());
	}
};
oFF.XObjectExt.assertStringEndsWith = function(actual, expectedSuffix)
{
	if (!oFF.XString.endsWith(actual, expectedSuffix))
	{
		let sb = oFF.XStringBuffer.create();
		sb.append("assertStringEndsWith failed - actual full string ");
		if (oFF.isNull(actual))
		{
			sb.append("is null ");
		}
		else
		{
			sb.append("\"").append(actual).append("\" ");
		}
		sb.append("- expected suffix ");
		if (oFF.isNull(expectedSuffix))
		{
			sb.append("is null ");
		}
		else
		{
			sb.append("\"").append(expectedSuffix).append("\"");
		}
		throw oFF.XException.createAssertException(sb.toString());
	}
};
oFF.XObjectExt.assertStringNotInitial = function(actual)
{
	if (oFF.XString.isEqual(actual, null))
	{
		throw oFF.XException.createAssertException("assertStringNotInitial failed");
	}
};
oFF.XObjectExt.assertStringNotNullAndNotEmpty = function(actual)
{
	oFF.XObjectExt.assertStringNotNullAndNotEmptyExt(actual, "assertStringNotNullAndNotEmpty failed");
};
oFF.XObjectExt.assertStringNotNullAndNotEmptyExt = function(actual, message)
{
	if (oFF.XStringUtils.isNullOrEmpty(actual))
	{
		throw oFF.XException.createAssertException(message);
	}
};
oFF.XObjectExt.assertStringStartsWith = function(actual, expectedPrefix)
{
	if (!oFF.XString.startsWith(actual, expectedPrefix))
	{
		let sb = oFF.XStringBuffer.create();
		sb.append("assertStringStartsWith failed - actual full string ");
		if (oFF.isNull(actual))
		{
			sb.append("is null ");
		}
		else
		{
			sb.append("\"").append(actual).append("\" ");
		}
		sb.append("- expected prefix ");
		if (oFF.isNull(expectedPrefix))
		{
			sb.append("is null ");
		}
		else
		{
			sb.append("\"").append(expectedPrefix).append("\"");
		}
		throw oFF.XException.createAssertException(sb.toString());
	}
};
oFF.XObjectExt.assertTrue = function(actual)
{
	oFF.XObjectExt.assertTrueExt(actual, "assertTrue failed");
};
oFF.XObjectExt.assertTrueExt = function(actual, message)
{
	if (!actual)
	{
		throw oFF.XException.createAssertException(message);
	}
};
oFF.XObjectExt.cloneExtIfNotNull = function(origin, flags)
{
	let result = null;
	if (oFF.notNull(origin))
	{
		result = origin.cloneExt(flags);
	}
	return result;
};
oFF.XObjectExt.cloneIfNotNull = function(origin)
{
	let result = null;
	if (oFF.notNull(origin))
	{
		result = origin.clone();
	}
	return result;
};
oFF.XObjectExt.isValidObject = function(object)
{
	return oFF.notNull(object) && !object.isReleased();
};
oFF.XObjectExt.release = function(theObject)
{
	let ixobject = theObject;
	let xobject = ixobject;
	if (oFF.notNull(xobject) && xobject.isReleaseLocked() === false && xobject.isReleased() === false)
	{
		xobject.releaseObject();
	}
	return null;
};
oFF.XObjectExt.releaseWithAssert = function(theObject)
{
	let ixobject = theObject;
	let xobject = ixobject;
	if (oFF.isNull(xobject))
	{
		throw oFF.XException.createIllegalStateException("Object for release is null");
	}
	if (xobject.isReleaseLocked() === true)
	{
		throw oFF.XException.createIllegalStateException("Object for release is locked");
	}
	if (xobject.isReleased() === true)
	{
		throw oFF.XException.createIllegalStateException("Object for release is already released");
	}
	xobject.releaseObject();
	return null;
};
oFF.XObjectExt.prototype.m_objectId = null;
oFF.XObjectExt.prototype.copyFrom = function(other, flags)
{
	if (this !== other && (this.getComponentType() === null || this.getComponentType() === other.getComponentType()))
	{
		this.copyFromInternal(other, flags);
	}
};
oFF.XObjectExt.prototype.copyFromInternal = function(other, flags) {};
oFF.XObjectExt.prototype.destructor = function()
{
	if (oFF.notNull(oFF.XObjectExt.s_allocationTracer))
	{
		oFF.XObjectExt.s_allocationTracer.dec(this, true);
	}
};
oFF.XObjectExt.prototype.getComponentType = function()
{
	return null;
};
oFF.XObjectExt.prototype.getLogLayer = function()
{
	return oFF.OriginLayer.MISC;
};
oFF.XObjectExt.prototype.getLogSeverity = function()
{
	return oFF.Severity.DEBUG;
};
oFF.XObjectExt.prototype.getLogWriter = function()
{
	return null;
};
oFF.XObjectExt.prototype.getObjectId = function()
{
	return this.m_objectId;
};
oFF.XObjectExt.prototype.isLogWritten = function(layer, severity)
{
	let logger = this.getLogWriter();
	return oFF.isNull(logger) ? false : logger.isLogWritten(layer, severity);
};
oFF.XObjectExt.prototype.log = function(logline)
{
	this.logExt(this.getLogLayer(), this.getLogSeverity(), 0, logline);
};
oFF.XObjectExt.prototype.log2 = function(log1, log2)
{
	let logger = this.getLogWriter();
	if (oFF.notNull(logger))
	{
		oFF.XLogBufferFlushing.create(logger, this.getLogLayer(), this.getLogSeverity(), 0).append(log1).append(log2).flush();
	}
};
oFF.XObjectExt.prototype.log3 = function(log1, log2, log3)
{
	let logger = this.getLogWriter();
	if (oFF.notNull(logger))
	{
		oFF.XLogBufferFlushing.create(logger, this.getLogLayer(), this.getLogSeverity(), 0).append(log1).append(log2).append(log3).flush();
	}
};
oFF.XObjectExt.prototype.log4 = function(log1, log2, log3, log4)
{
	let logger = this.getLogWriter();
	if (oFF.notNull(logger))
	{
		oFF.XLogBufferFlushing.create(logger, this.getLogLayer(), this.getLogSeverity(), 0).append(log1).append(log2).append(log3).append(log4).flush();
	}
};
oFF.XObjectExt.prototype.logBuffer = function(layer, severity, code)
{
	let logger = this.getLogWriter();
	return oFF.XLogBufferFlushing.create(logger, layer, severity, code);
};
oFF.XObjectExt.prototype.logEmpty = function()
{
	this.log(null);
};
oFF.XObjectExt.prototype.logError = function(logline)
{
	this.logExt(this.getLogLayer(), oFF.Severity.ERROR, 0, logline);
};
oFF.XObjectExt.prototype.logError2 = function(log1, log2)
{
	let logger = this.getLogWriter();
	if (oFF.notNull(logger))
	{
		oFF.XLogBufferFlushing.create(logger, this.getLogLayer(), oFF.Severity.ERROR, 0).append(log1).append(log2).flush();
	}
};
oFF.XObjectExt.prototype.logError3 = function(log1, log2, log3)
{
	let logger = this.getLogWriter();
	if (oFF.notNull(logger))
	{
		oFF.XLogBufferFlushing.create(logger, this.getLogLayer(), oFF.Severity.ERROR, 0).append(log1).append(log2).append(log3).flush();
	}
};
oFF.XObjectExt.prototype.logError4 = function(log1, log2, log3, log4)
{
	let logger = this.getLogWriter();
	if (oFF.notNull(logger))
	{
		oFF.XLogBufferFlushing.create(logger, this.getLogLayer(), oFF.Severity.ERROR, 0).append(log1).append(log2).append(log3).append(log4).flush();
	}
};
oFF.XObjectExt.prototype.logErrorMulti = function(logline)
{
	let logger = this.getLogWriter();
	return oFF.XLogBufferFlushing.create(logger, this.getLogLayer(), oFF.Severity.ERROR, 0).append(logline);
};
oFF.XObjectExt.prototype.logExt = function(layer, severity, code, message)
{
	let logger = this.getLogWriter();
	if (oFF.notNull(logger))
	{
		logger.logExt(layer, severity, code, message);
	}
};
oFF.XObjectExt.prototype.logMulti = function(logline)
{
	let logger = this.getLogWriter();
	return oFF.XLogBufferFlushing.create(logger, this.getLogLayer(), this.getLogSeverity(), 0).append(logline);
};
oFF.XObjectExt.prototype.logObj = function(xobject)
{
	if (oFF.notNull(xobject))
	{
		let logger = this.getLogWriter();
		if (oFF.notNull(logger))
		{
			let logSeverity = this.getLogSeverity();
			let logLayer = this.getLogLayer();
			if (logger.isLogWritten(logLayer, logSeverity))
			{
				let logText = xobject.toString();
				this.logExt(logLayer, logSeverity, 0, logText);
			}
		}
	}
};
oFF.XObjectExt.prototype.logWarning = function(logline)
{
	this.logExt(this.getLogLayer(), oFF.Severity.WARNING, 0, logline);
};
oFF.XObjectExt.prototype.logWarning2 = function(log1, log2)
{
	let logger = this.getLogWriter();
	if (oFF.notNull(logger))
	{
		oFF.XLogBufferFlushing.create(logger, this.getLogLayer(), oFF.Severity.WARNING, 0).append(log1).append(log2).flush();
	}
};
oFF.XObjectExt.prototype.logWarning3 = function(log1, log2, log3)
{
	let logger = this.getLogWriter();
	if (oFF.notNull(logger))
	{
		oFF.XLogBufferFlushing.create(logger, this.getLogLayer(), oFF.Severity.WARNING, 0).append(log1).append(log2).append(log3).flush();
	}
};
oFF.XObjectExt.prototype.logWarning4 = function(log1, log2, log3, log4)
{
	let logger = this.getLogWriter();
	if (oFF.notNull(logger))
	{
		oFF.XLogBufferFlushing.create(logger, this.getLogLayer(), oFF.Severity.WARNING, 0).append(log1).append(log2).append(log3).append(log4).flush();
	}
};
oFF.XObjectExt.prototype.logWarningMulti = function(logline)
{
	let logger = this.getLogWriter();
	return oFF.XLogBufferFlushing.create(logger, this.getLogLayer(), oFF.Severity.WARNING, 0).append(logline);
};
oFF.XObjectExt.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	if (oFF.notNull(oFF.XObjectExt.s_allocationTracer))
	{
		oFF.XObjectExt.s_allocationTracer.dec(this, false);
	}
};
oFF.XObjectExt.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	if (oFF.notNull(oFF.XObjectExt.s_allocationTracer))
	{
		this.m_objectId = oFF.XObjectExt.s_allocationTracer.inc(this);
	}
};
oFF.XObjectExt.prototype.toString = function()
{
	let buffer = oFF.XStringBuffer.create();
	let className = this.getClassName();
	if (oFF.notNull(className))
	{
		buffer.append(className);
	}
	else
	{
		buffer.append("[unknown class]");
	}
	let objectId = this.getObjectId();
	if (oFF.notNull(objectId))
	{
		buffer.append(": ").append(objectId);
	}
	return buffer.toString();
};

oFF.DfModule = function() {};
oFF.DfModule.prototype = new oFF.XObject();
oFF.DfModule.prototype._ff_c = "DfModule";

oFF.DfModule.s_allModuleNames = null;
oFF.DfModule.s_firstModule = null;
oFF.DfModule.checkInitialized = function(module)
{
	if (oFF.isNull(module))
	{
		throw oFF.XException.createInitializationException();
	}
};
oFF.DfModule.getFirstModule = function()
{
	return oFF.DfModule.s_firstModule;
};
oFF.DfModule.getLastModule = function()
{
	let current = oFF.DfModule.s_firstModule;
	let last = null;
	while (oFF.notNull(current))
	{
		last = current;
		current = current.getNextModule();
	}
	return last;
};
oFF.DfModule.getLoadedModuleNames = function()
{
	return oFF.DfModule.s_allModuleNames;
};
oFF.DfModule.setLastModule = function(module)
{
	if (oFF.isNull(oFF.DfModule.s_firstModule))
	{
		oFF.DfModule.s_firstModule = module;
	}
	else
	{
		let lastModule = oFF.DfModule.getLastModule();
		lastModule.setNextModule(module);
	}
};
oFF.DfModule.startExt = function(module)
{
	module.startInit();
	return module;
};
oFF.DfModule.stopExt = function(module)
{
	module.stopInit();
};
oFF.DfModule.prototype.m_dynamicInitDuration = 0;
oFF.DfModule.prototype.m_dynamicStartTimestamp = 0;
oFF.DfModule.prototype.m_initPhase = 0;
oFF.DfModule.prototype.m_isValid = false;
oFF.DfModule.prototype.m_listener = null;
oFF.DfModule.prototype.m_message = null;
oFF.DfModule.prototype.m_nextModule = null;
oFF.DfModule.prototype.m_staticInitDuration = 0;
oFF.DfModule.prototype.m_staticStartTimestamp = 0;
oFF.DfModule.prototype.endDynamicInit = function(isValid, message)
{
	this.m_initPhase = 3;
	this.m_isValid = isValid;
	this.m_message = message;
	let endTimestamp = oFF.XTimeUtils.getCurrentTimeInMilliseconds();
	this.m_dynamicInitDuration = endTimestamp - this.m_dynamicStartTimestamp;
	if (oFF.notNull(this.m_listener))
	{
		this.m_listener.onModuleInitialized(this, isValid, message, this.m_dynamicInitDuration);
	}
};
oFF.DfModule.prototype.getDynamicInitDuration = function()
{
	return this.m_dynamicInitDuration;
};
oFF.DfModule.prototype.getInitPhase = function()
{
	return this.m_initPhase;
};
oFF.DfModule.prototype.getMessage = function()
{
	return this.m_message;
};
oFF.DfModule.prototype.getName = function()
{
	return null;
};
oFF.DfModule.prototype.getNextModule = function()
{
	return this.m_nextModule;
};
oFF.DfModule.prototype.getStaticInitDuration = function()
{
	return this.m_staticInitDuration;
};
oFF.DfModule.prototype.hasDynamicInit = function()
{
	return false;
};
oFF.DfModule.prototype.isValid = function()
{
	return this.hasDynamicInit() === false || this.m_isValid;
};
oFF.DfModule.prototype.processDynamicInit = function(kernel, listener)
{
	this.m_dynamicStartTimestamp = oFF.XTimeUtils.getCurrentTimeInMilliseconds();
	this.m_listener = listener;
	this.m_initPhase = 2;
};
oFF.DfModule.prototype.setNextModule = function(next)
{
	this.m_nextModule = next;
};
oFF.DfModule.prototype.startInit = function()
{
	let name = this.getName();
	if (oFF.notNull(name))
	{
		oFF.XResources.register(name);
		if (oFF.isNull(oFF.DfModule.s_allModuleNames))
		{
			oFF.DfModule.s_allModuleNames = "ff0000.language.native";
		}
		oFF.DfModule.s_allModuleNames = oFF.XStringUtils.concatenate3(oFF.DfModule.s_allModuleNames, ",", name);
	}
	oFF.DfModule.setLastModule(this);
	this.m_staticStartTimestamp = oFF.XTimeUtils.getCurrentTimeInMilliseconds();
};
oFF.DfModule.prototype.stopInit = function()
{
	let endTimestamp = oFF.XTimeUtils.getCurrentTimeInMilliseconds();
	this.m_staticInitDuration = endTimestamp - this.m_staticStartTimestamp;
	this.m_initPhase = 1;
};

oFF.LanguageModule = function() {};
oFF.LanguageModule.prototype = new oFF.DfModule();
oFF.LanguageModule.prototype._ff_c = "LanguageModule";

oFF.LanguageModule.s_module = null;
oFF.LanguageModule.getInstance = function()
{
	if (oFF.isNull(oFF.LanguageModule.s_module))
	{
		oFF.LanguageModule.s_module = oFF.DfModule.startExt(new oFF.LanguageModule());
		oFF.DfModule.stopExt(oFF.LanguageModule.s_module);
	}
	return oFF.LanguageModule.s_module;
};
oFF.LanguageModule.prototype.getName = function()
{
	return "ff0000.language";
};

oFF.DfNameObject = function() {};
oFF.DfNameObject.prototype = new oFF.XObjectExt();
oFF.DfNameObject.prototype._ff_c = "DfNameObject";

oFF.DfNameObject.areNamesEqual = function(a, b)
{
	return oFF.XString.isEqual(oFF.DfNameObject.getSafeName(a), oFF.DfNameObject.getSafeName(b));
};
oFF.DfNameObject.compareByNames = function(value, compareTo)
{
	return oFF.XString.compare(oFF.DfNameObject.getSafeName(value), oFF.DfNameObject.getSafeName(compareTo));
};
oFF.DfNameObject.getSafeName = function(element)
{
	return oFF.isNull(element) ? null : element.getName();
};
oFF.DfNameObject.prototype.m_name = null;
oFF.DfNameObject.prototype._setupInternal = function(name)
{
	this.m_name = name;
};
oFF.DfNameObject.prototype.getName = function()
{
	return this.m_name;
};
oFF.DfNameObject.prototype.isEqualTo = function(other)
{
	let theOther = other;
	if (oFF.isNull(other))
	{
		return false;
	}
	let isEqual = oFF.XString.isEqual(this.getName(), theOther.getName());
	return isEqual;
};
oFF.DfNameObject.prototype.releaseObject = function()
{
	this.m_name = null;
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.DfNameObject.prototype.toString = function()
{
	return this.m_name;
};

oFF.XNameGenericPair = function() {};
oFF.XNameGenericPair.prototype = new oFF.XObject();
oFF.XNameGenericPair.prototype._ff_c = "XNameGenericPair";

oFF.XNameGenericPair.create = function(name, object)
{
	let newObject = new oFF.XNameGenericPair();
	newObject.m_name = name;
	newObject.m_object = object;
	return newObject;
};
oFF.XNameGenericPair.prototype.m_name = null;
oFF.XNameGenericPair.prototype.m_object = null;
oFF.XNameGenericPair.prototype.cloneExt = function(flags)
{
	return oFF.XNameGenericPair.create(this.m_name, this.m_object);
};
oFF.XNameGenericPair.prototype.getName = function()
{
	return this.m_name;
};
oFF.XNameGenericPair.prototype.getObject = function()
{
	return this.m_object;
};
oFF.XNameGenericPair.prototype.isEqualTo = function(other)
{
	if (oFF.isNull(other))
	{
		return false;
	}
	if (this === other)
	{
		return true;
	}
	let otherPair;
	try
	{
		otherPair = other;
	}
	catch (t)
	{
		return false;
	}
	if (!oFF.XString.isEqual(this.getName(), otherPair.getName()))
	{
		return false;
	}
	return otherPair.getObject().isEqualTo(this.m_object);
};
oFF.XNameGenericPair.prototype.releaseObject = function()
{
	this.m_name = null;
	this.m_object = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.XNameGenericPair.prototype.setName = function(name)
{
	this.m_name = name;
};
oFF.XNameGenericPair.prototype.setObject = function(object)
{
	this.m_object = object;
};
oFF.XNameGenericPair.prototype.toString = function()
{
	let response = oFF.XStringBuffer.create();
	response.append("Key ").append(this.getName());
	response.append("Value ");
	if (oFF.notNull(this.m_object))
	{
		response.appendObject(this.m_object);
	}
	return response.toString();
};

oFF.XNameWeakGenericPair = function() {};
oFF.XNameWeakGenericPair.prototype = new oFF.XObject();
oFF.XNameWeakGenericPair.prototype._ff_c = "XNameWeakGenericPair";

oFF.XNameWeakGenericPair.create = function(name, object)
{
	let newObject = new oFF.XNameWeakGenericPair();
	newObject.m_name = name;
	newObject.m_object = oFF.XWeakReferenceUtil.getWeakRef(object);
	return newObject;
};
oFF.XNameWeakGenericPair.prototype.m_name = null;
oFF.XNameWeakGenericPair.prototype.m_object = null;
oFF.XNameWeakGenericPair.prototype.getName = function()
{
	return this.m_name;
};
oFF.XNameWeakGenericPair.prototype.getObject = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_object);
};
oFF.XNameWeakGenericPair.prototype.releaseObject = function()
{
	this.m_name = null;
	this.m_object = oFF.XObjectExt.release(this.m_object);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.XNameWeakGenericPair.prototype.setName = function(name)
{
	this.m_name = name;
};
oFF.XNameWeakGenericPair.prototype.setObject = function(object)
{
	this.m_object = oFF.XWeakReferenceUtil.getWeakRef(object);
};

oFF.XConstant = function() {};
oFF.XConstant.prototype = new oFF.DfNameObject();
oFF.XConstant.prototype._ff_c = "XConstant";

oFF.XConstant.setupName = function(a, name)
{
	a.setupConstant(name);
	return a;
};
oFF.XConstant.prototype.isReleaseLocked = function()
{
	return true;
};
oFF.XConstant.prototype.releaseObject = oFF.noSupport;
oFF.XConstant.prototype.setupConstant = function(name)
{
	oFF.DfNameObject.prototype._setupInternal.call( this , name);
};

oFF.DfIdNameObject = function() {};
oFF.DfIdNameObject.prototype = new oFF.DfNameObject();
oFF.DfIdNameObject.prototype._ff_c = "DfIdNameObject";

oFF.DfIdNameObject.prototype.m_id = null;
oFF.DfIdNameObject.prototype.getId = function()
{
	return this.m_id;
};
oFF.DfIdNameObject.prototype.releaseObject = function()
{
	this.m_id = null;
	oFF.DfNameObject.prototype.releaseObject.call( this );
};
oFF.DfIdNameObject.prototype.setupExt = function(identifier, name)
{
	oFF.DfNameObject.prototype._setupInternal.call( this , name);
	this.m_id = identifier;
};
oFF.DfIdNameObject.prototype.toString = function()
{
	let sb = oFF.XStringBuffer.create();
	sb.append(this.getId()).append(": ").append(this.getName());
	return sb.toString();
};

oFF.DfNameTextObject = function() {};
oFF.DfNameTextObject.prototype = new oFF.DfNameObject();
oFF.DfNameTextObject.prototype._ff_c = "DfNameTextObject";

oFF.DfNameTextObject.compareByTextsAndFallbackToNames = function(value, compareTo)
{
	let result = oFF.XString.compare(oFF.DfNameTextObject.getTextOfObject(value), oFF.DfNameTextObject.getTextOfObject(compareTo));
	if (result === 0)
	{
		result = oFF.XString.compare(oFF.DfNameObject.getSafeName(value), oFF.DfNameObject.getSafeName(compareTo));
	}
	return result;
};
oFF.DfNameTextObject.getTextOfObject = function(nameTextObject)
{
	return oFF.isNull(nameTextObject) ? null : nameTextObject.getText();
};
oFF.DfNameTextObject.prototype.m_text = null;
oFF.DfNameTextObject.prototype.getText = function()
{
	return this.m_text;
};
oFF.DfNameTextObject.prototype.isEqualTo = function(other)
{
	let isEqual = oFF.DfNameObject.prototype.isEqualTo.call( this , other);
	let theOther = other;
	isEqual = isEqual && oFF.XString.isEqual(this.getText(), theOther.getText());
	return isEqual;
};
oFF.DfNameTextObject.prototype.releaseObject = function()
{
	this.m_text = null;
	oFF.DfNameObject.prototype.releaseObject.call( this );
};
oFF.DfNameTextObject.prototype.setText = function(text)
{
	this.m_text = text;
};
oFF.DfNameTextObject.prototype.setupWithNameText = function(name, text)
{
	this._setupInternal(name);
	this.m_text = text;
};

oFF.XNameValuePair = function() {};
oFF.XNameValuePair.prototype = new oFF.DfNameObject();
oFF.XNameValuePair.prototype._ff_c = "XNameValuePair";

oFF.XNameValuePair.create = function(name, value)
{
	let xNameValuePair = new oFF.XNameValuePair();
	xNameValuePair.setupWithNameValue(name, value);
	return xNameValuePair;
};
oFF.XNameValuePair.prototype.m_value = null;
oFF.XNameValuePair.prototype.compareTo = function(objectToCompare)
{
	if (oFF.isNull(objectToCompare))
	{
		return -1;
	}
	if (this === objectToCompare)
	{
		return 0;
	}
	let other = objectToCompare;
	let compare = oFF.XString.compare(this.getName(), other.getName());
	if (compare === 0)
	{
		compare = oFF.XString.compare(this.getValue(), other.getValue());
	}
	return compare;
};
oFF.XNameValuePair.prototype.getValue = function()
{
	return this.m_value;
};
oFF.XNameValuePair.prototype.releaseObject = function()
{
	this.m_value = null;
	oFF.DfNameObject.prototype.releaseObject.call( this );
};
oFF.XNameValuePair.prototype.setupWithNameValue = function(name, value)
{
	this._setupInternal(name);
	this.m_value = value;
};
oFF.XNameValuePair.prototype.toString = function()
{
	if (oFF.isNull(this.m_value))
	{
		return this.getName();
	}
	let tmp = oFF.XStringUtils.concatenate2(this.getName(), "=");
	return oFF.XStringUtils.concatenate2(tmp, this.m_value);
};

oFF.XAbstractValue = function() {};
oFF.XAbstractValue.prototype = new oFF.XObject();
oFF.XAbstractValue.prototype._ff_c = "XAbstractValue";

oFF.XAbstractValue.getDoubleValue = function(value)
{
	let valueType = value.getValueType();
	let retValue = 0;
	if (valueType === oFF.XValueType.DOUBLE)
	{
		retValue = value.getDouble();
	}
	else if (valueType === oFF.XValueType.INTEGER)
	{
		retValue = oFF.XInteger.convertToDouble(value.getInteger());
	}
	else if (valueType === oFF.XValueType.LONG)
	{
		retValue = oFF.XLong.convertToDouble(value.getLong());
	}
	else if (valueType === oFF.XValueType.DECIMAL_FLOAT)
	{
		retValue = value.getDouble();
	}
	return retValue;
};
oFF.XAbstractValue.prototype.assertValueType = function(valueType)
{
	if (this.getValueType() !== valueType)
	{
		throw oFF.XException.createIllegalArgumentException("Valuetype missmatch!");
	}
};
oFF.XAbstractValue.prototype.compareTo = function(objectToCompare)
{
	let thisStr = this.toString();
	let otherStr = objectToCompare.toString();
	return oFF.XString.compare(thisStr, otherStr);
};
oFF.XAbstractValue.prototype.getComponentType = function()
{
	return this.getValueType();
};
oFF.XAbstractValue.prototype.getStringRepresentation = function()
{
	return this.toString();
};
oFF.XAbstractValue.prototype.isEqualTo = function(other)
{
	if (oFF.isNull(other))
	{
		return false;
	}
	if (this === other)
	{
		return true;
	}
	let thisValueType = this.getValueType();
	let otherValueType = other.getValueType();
	if (oFF.notNull(thisValueType) && oFF.notNull(otherValueType) && thisValueType.isNumber() && otherValueType.isNumber())
	{
		return this.isEqualToNumber(other);
	}
	return thisValueType === otherValueType;
};
oFF.XAbstractValue.prototype.isEqualToNumber = function(other)
{
	return oFF.XString.isEqual(this.getStringRepresentation(), other.getStringRepresentation()) || oFF.XAbstractValue.getDoubleValue(this) === oFF.XAbstractValue.getDoubleValue(other);
};
oFF.XAbstractValue.prototype.resetValue = function(value)
{
	oFF.XObjectExt.assertNotNullExt(value, "illegal value");
	this.assertValueType(value.getValueType());
};

oFF.XConstantWithParent = function() {};
oFF.XConstantWithParent.prototype = new oFF.XConstant();
oFF.XConstantWithParent.prototype._ff_c = "XConstantWithParent";

oFF.XConstantWithParent.isObjectTypeOf = function(objectToCheck, referenceType)
{
	return oFF.notNull(objectToCheck) && oFF.notNull(referenceType) && objectToCheck.isTypeOf(referenceType);
};
oFF.XConstantWithParent.setupWithNameAndParent = function(a, name, parent)
{
	a.setupExt(name, parent);
	return a;
};
oFF.XConstantWithParent.prototype.m_parent = null;
oFF.XConstantWithParent.prototype.getParent = function()
{
	return this.m_parent;
};
oFF.XConstantWithParent.prototype.isTypeOf = function(type)
{
	if (oFF.isNull(type))
	{
		return false;
	}
	if (this === type)
	{
		return true;
	}
	if (oFF.isNull(this.m_parent))
	{
		return false;
	}
	return this.m_parent.isTypeOf(type);
};
oFF.XConstantWithParent.prototype.setParent = function(type)
{
	this.m_parent = type;
};
oFF.XConstantWithParent.prototype.setupExt = function(name, parent)
{
	this.m_parent = parent;
	this.setupConstant(name);
};

oFF.XLanguage = function() {};
oFF.XLanguage.prototype = new oFF.XConstant();
oFF.XLanguage.prototype._ff_c = "XLanguage";

oFF.XLanguage.ABAP = null;
oFF.XLanguage.CPP = null;
oFF.XLanguage.CSHARP = null;
oFF.XLanguage.JAVA = null;
oFF.XLanguage.JAVASCRIPT = null;
oFF.XLanguage.OBJECTIVE_C = null;
oFF.XLanguage.TYPESCRIPT = null;
oFF.XLanguage.s_language = null;
oFF.XLanguage.getLanguage = function()
{
	return oFF.XLanguage.s_language;
};
oFF.XLanguage.setLanguage = function(language)
{
	if (oFF.isNull(oFF.XLanguage.s_language))
	{
		oFF.XLanguage.s_language = language;
	}
};
oFF.XLanguage.staticSetup = function()
{
	oFF.XLanguage.JAVA = oFF.XConstant.setupName(new oFF.XLanguage(), "JAVA");
	oFF.XLanguage.JAVASCRIPT = oFF.XConstant.setupName(new oFF.XLanguage(), "JAVASCRIPT");
	oFF.XLanguage.TYPESCRIPT = oFF.XConstant.setupName(new oFF.XLanguage(), "TYPESCRIPT");
	oFF.XLanguage.OBJECTIVE_C = oFF.XConstant.setupName(new oFF.XLanguage(), "OBJECTIVE_C");
	oFF.XLanguage.CPP = oFF.XConstant.setupName(new oFF.XLanguage(), "CPP");
	oFF.XLanguage.CSHARP = oFF.XConstant.setupName(new oFF.XLanguage(), "CSHARP");
	oFF.XLanguage.ABAP = oFF.XConstant.setupName(new oFF.XLanguage(), "ABAP");
};

oFF.XSyncEnv = function() {};
oFF.XSyncEnv.prototype = new oFF.XConstant();
oFF.XSyncEnv.prototype._ff_c = "XSyncEnv";

oFF.XSyncEnv.EXTERNAL_MAIN_LOOP = null;
oFF.XSyncEnv.INTERNAL_MAIN_LOOP = null;
oFF.XSyncEnv.s_syncEnv = null;
oFF.XSyncEnv.getSyncEnv = function()
{
	return oFF.XSyncEnv.s_syncEnv;
};
oFF.XSyncEnv.setSyncEnv = function(syncEnv)
{
	if (oFF.isNull(oFF.XSyncEnv.s_syncEnv))
	{
		oFF.XSyncEnv.s_syncEnv = syncEnv;
	}
};
oFF.XSyncEnv.staticSetup = function()
{
	oFF.XSyncEnv.EXTERNAL_MAIN_LOOP = oFF.XConstant.setupName(new oFF.XSyncEnv(), "EXTERNAL");
	oFF.XSyncEnv.INTERNAL_MAIN_LOOP = oFF.XConstant.setupName(new oFF.XSyncEnv(), "INTERNAL");
};

oFF.XNameTextObject = function() {};
oFF.XNameTextObject.prototype = new oFF.DfNameTextObject();
oFF.XNameTextObject.prototype._ff_c = "XNameTextObject";

oFF.XNameTextObject.create = function(name, text)
{
	let loInstance = new oFF.XNameTextObject();
	loInstance.setupWithNameText(name, text);
	return loInstance;
};
oFF.XNameTextObject.prototype.cloneExt = function(flags)
{
	return oFF.XNameTextObject.create(this.m_name, this.m_text);
};

oFF.XAmountValue = function() {};
oFF.XAmountValue.prototype = new oFF.XAbstractValue();
oFF.XAmountValue.prototype._ff_c = "XAmountValue";

oFF.XAmountValue.create = function(value)
{
	let object = new oFF.XAmountValue();
	object.setAmount(value);
	return object;
};
oFF.XAmountValue.prototype.m_amountValue = null;
oFF.XAmountValue.prototype.cloneExt = function(flags)
{
	return oFF.XAmountValue.create(this.m_amountValue);
};
oFF.XAmountValue.prototype.getAmount = function()
{
	return this.m_amountValue;
};
oFF.XAmountValue.prototype.getValueType = function()
{
	return oFF.XValueType.AMOUNT;
};
oFF.XAmountValue.prototype.isEqualTo = function(other)
{
	if (!oFF.XAbstractValue.prototype.isEqualTo.call( this , other))
	{
		return false;
	}
	let otherValue = other;
	return oFF.XString.isEqual(this.m_amountValue, otherValue.m_amountValue);
};
oFF.XAmountValue.prototype.releaseObject = function()
{
	this.m_amountValue = null;
	oFF.XAbstractValue.prototype.releaseObject.call( this );
};
oFF.XAmountValue.prototype.resetValue = function(value)
{
	oFF.XAbstractValue.prototype.resetValue.call( this , value);
	if (this === value)
	{
		return;
	}
	let otherValue = value;
	this.m_amountValue = otherValue.m_amountValue;
};
oFF.XAmountValue.prototype.setAmount = function(value)
{
	this.m_amountValue = value;
};
oFF.XAmountValue.prototype.toString = function()
{
	return this.m_amountValue;
};

oFF.XBooleanValue = function() {};
oFF.XBooleanValue.prototype = new oFF.XAbstractValue();
oFF.XBooleanValue.prototype._ff_c = "XBooleanValue";

oFF.XBooleanValue.create = function(value)
{
	let objectBoolean = new oFF.XBooleanValue();
	objectBoolean.setBoolean(value);
	return objectBoolean;
};
oFF.XBooleanValue.getBooleanExt = function(booleanValue, defaultValue)
{
	return oFF.isNull(booleanValue) ? defaultValue : booleanValue.getBoolean();
};
oFF.XBooleanValue.prototype.m_booleanValue = false;
oFF.XBooleanValue.prototype.cloneExt = function(flags)
{
	return oFF.XBooleanValue.create(this.m_booleanValue);
};
oFF.XBooleanValue.prototype.getBoolean = function()
{
	return this.m_booleanValue;
};
oFF.XBooleanValue.prototype.getValueType = function()
{
	return oFF.XValueType.BOOLEAN;
};
oFF.XBooleanValue.prototype.isEqualTo = function(other)
{
	if (!oFF.XAbstractValue.prototype.isEqualTo.call( this , other))
	{
		return false;
	}
	let otherValue = other;
	return this.m_booleanValue === otherValue.m_booleanValue;
};
oFF.XBooleanValue.prototype.resetValue = function(value)
{
	oFF.XAbstractValue.prototype.resetValue.call( this , value);
	if (this === value)
	{
		return;
	}
	let otherValue = value;
	this.m_booleanValue = otherValue.m_booleanValue;
};
oFF.XBooleanValue.prototype.setBoolean = function(value)
{
	this.m_booleanValue = value;
};
oFF.XBooleanValue.prototype.toString = function()
{
	return oFF.XBoolean.convertToString(this.m_booleanValue);
};

oFF.XDecFloatAbstract = function() {};
oFF.XDecFloatAbstract.prototype = new oFF.XAbstractValue();
oFF.XDecFloatAbstract.prototype._ff_c = "XDecFloatAbstract";

oFF.XDecFloatAbstract.prototype.getComponentType = function()
{
	return this.getValueType();
};
oFF.XDecFloatAbstract.prototype.getValueType = function()
{
	return oFF.XValueType.DECIMAL_FLOAT;
};
oFF.XDecFloatAbstract.prototype.toString = function()
{
	return this.getStringRepresentation();
};

oFF.XDoubleValue = function() {};
oFF.XDoubleValue.prototype = new oFF.XAbstractValue();
oFF.XDoubleValue.prototype._ff_c = "XDoubleValue";

oFF.XDoubleValue.create = function(value)
{
	let objectDouble = new oFF.XDoubleValue();
	objectDouble.setDouble(value);
	return objectDouble;
};
oFF.XDoubleValue.prototype.m_doubleValue = 0.0;
oFF.XDoubleValue.prototype.cloneExt = function(flags)
{
	return oFF.XDoubleValue.create(this.m_doubleValue);
};
oFF.XDoubleValue.prototype.getDouble = function()
{
	return this.m_doubleValue;
};
oFF.XDoubleValue.prototype.getValueType = function()
{
	return oFF.XValueType.DOUBLE;
};
oFF.XDoubleValue.prototype.resetValue = function(value)
{
	oFF.XAbstractValue.prototype.resetValue.call( this , value);
	if (this === value)
	{
		return;
	}
	this.m_doubleValue = value.m_doubleValue;
};
oFF.XDoubleValue.prototype.setDouble = function(value)
{
	this.m_doubleValue = value;
};
oFF.XDoubleValue.prototype.toString = function()
{
	return oFF.XDouble.convertToString(this.m_doubleValue);
};

oFF.XIntegerValue = function() {};
oFF.XIntegerValue.prototype = new oFF.XAbstractValue();
oFF.XIntegerValue.prototype._ff_c = "XIntegerValue";

oFF.XIntegerValue.create = function(value)
{
	let objectInteger = new oFF.XIntegerValue();
	objectInteger.setInteger(value);
	return objectInteger;
};
oFF.XIntegerValue.prototype.m_integerValue = 0;
oFF.XIntegerValue.prototype.cloneExt = function(flags)
{
	return oFF.XIntegerValue.create(this.m_integerValue);
};
oFF.XIntegerValue.prototype.getInteger = function()
{
	return this.m_integerValue;
};
oFF.XIntegerValue.prototype.getValueType = function()
{
	return oFF.XValueType.INTEGER;
};
oFF.XIntegerValue.prototype.resetValue = function(value)
{
	oFF.XAbstractValue.prototype.resetValue.call( this , value);
	if (this === value)
	{
		return;
	}
	this.m_integerValue = value.m_integerValue;
};
oFF.XIntegerValue.prototype.setInteger = function(value)
{
	this.m_integerValue = value;
};
oFF.XIntegerValue.prototype.toString = function()
{
	return oFF.XInteger.convertToString(this.m_integerValue);
};

oFF.XLongValue = function() {};
oFF.XLongValue.prototype = new oFF.XAbstractValue();
oFF.XLongValue.prototype._ff_c = "XLongValue";

oFF.XLongValue.create = function(value)
{
	let objectLong = new oFF.XLongValue();
	objectLong.setLong(value);
	return objectLong;
};
oFF.XLongValue.prototype.m_longValue = 0;
oFF.XLongValue.prototype.cloneExt = function(flags)
{
	return oFF.XLongValue.create(this.m_longValue);
};
oFF.XLongValue.prototype.getLong = function()
{
	return this.m_longValue;
};
oFF.XLongValue.prototype.getValueType = function()
{
	return oFF.XValueType.LONG;
};
oFF.XLongValue.prototype.resetValue = function(value)
{
	oFF.XAbstractValue.prototype.resetValue.call( this , value);
	if (this === value)
	{
		return;
	}
	this.m_longValue = value.m_longValue;
};
oFF.XLongValue.prototype.setLong = function(value)
{
	this.m_longValue = value;
};
oFF.XLongValue.prototype.toString = function()
{
	return oFF.XLong.convertToString(this.m_longValue);
};

oFF.XNumcValue = function() {};
oFF.XNumcValue.prototype = new oFF.XAbstractValue();
oFF.XNumcValue.prototype._ff_c = "XNumcValue";

oFF.XNumcValue.create = function(value)
{
	let object = new oFF.XNumcValue();
	object.setNumc(value);
	return object;
};
oFF.XNumcValue.prototype.m_numcValue = null;
oFF.XNumcValue.prototype.cloneExt = function(flags)
{
	return oFF.XNumcValue.create(this.m_numcValue);
};
oFF.XNumcValue.prototype.getNumc = function()
{
	return this.m_numcValue;
};
oFF.XNumcValue.prototype.getValueType = function()
{
	return oFF.XValueType.NUMC;
};
oFF.XNumcValue.prototype.isEqualTo = function(other)
{
	if (!oFF.XAbstractValue.prototype.isEqualTo.call( this , other))
	{
		return false;
	}
	let otherValue = other;
	return oFF.XString.isEqual(this.m_numcValue, otherValue.m_numcValue);
};
oFF.XNumcValue.prototype.releaseObject = function()
{
	this.m_numcValue = null;
	oFF.XAbstractValue.prototype.releaseObject.call( this );
};
oFF.XNumcValue.prototype.resetValue = function(value)
{
	oFF.XAbstractValue.prototype.resetValue.call( this , value);
	if (this === value)
	{
		return;
	}
	let otherValue = value;
	this.m_numcValue = otherValue.m_numcValue;
};
oFF.XNumcValue.prototype.setNumc = function(value)
{
	this.m_numcValue = value;
};
oFF.XNumcValue.prototype.toString = function()
{
	return this.m_numcValue;
};

oFF.XStringValue = function() {};
oFF.XStringValue.prototype = new oFF.XAbstractValue();
oFF.XStringValue.prototype._ff_c = "XStringValue";

oFF.XStringValue.create = function(value)
{
	let object = new oFF.XStringValue();
	object.setString(value);
	return object;
};
oFF.XStringValue.prototype.m_stringValue = null;
oFF.XStringValue.prototype.cloneExt = function(flags)
{
	return oFF.XStringValue.create(this.m_stringValue);
};
oFF.XStringValue.prototype.getString = function()
{
	return this.m_stringValue;
};
oFF.XStringValue.prototype.getValueType = function()
{
	return oFF.XValueType.STRING;
};
oFF.XStringValue.prototype.isEqualTo = function(other)
{
	if (!oFF.XAbstractValue.prototype.isEqualTo.call( this , other))
	{
		return false;
	}
	let otherValue = other;
	return oFF.XString.isEqual(this.m_stringValue, otherValue.m_stringValue);
};
oFF.XStringValue.prototype.releaseObject = function()
{
	this.m_stringValue = null;
	oFF.XAbstractValue.prototype.releaseObject.call( this );
};
oFF.XStringValue.prototype.resetValue = function(value)
{
	oFF.XAbstractValue.prototype.resetValue.call( this , value);
	if (this === value)
	{
		return;
	}
	let otherValue = value;
	this.m_stringValue = otherValue.m_stringValue;
};
oFF.XStringValue.prototype.setString = function(value)
{
	this.m_stringValue = oFF.XString.convertToString(value);
};
oFF.XStringValue.prototype.toString = function()
{
	return this.m_stringValue;
};

oFF.OriginLayer = function() {};
oFF.OriginLayer.prototype = new oFF.XConstant();
oFF.OriginLayer.prototype._ff_c = "OriginLayer";

oFF.OriginLayer.ALL = "All";
oFF.OriginLayer.APPLICATION = "Application";
oFF.OriginLayer.DRIVER = "Driver";
oFF.OriginLayer.IOLAYER = "IOLayer";
oFF.OriginLayer.KERNEL = "Kernel";
oFF.OriginLayer.MISC = "Misc";
oFF.OriginLayer.NONE = "None";
oFF.OriginLayer.PROTOCOL = "Protocol";
oFF.OriginLayer.SERVER = "Server";
oFF.OriginLayer.SUBSYSTEM = "SubSystem";
oFF.OriginLayer.TEST = "Test";
oFF.OriginLayer.UTILITY = "Utility";

oFF.Severity = function() {};
oFF.Severity.prototype = new oFF.XConstant();
oFF.Severity.prototype._ff_c = "Severity";

oFF.Severity.DEBUG = null;
oFF.Severity.ERROR = null;
oFF.Severity.INFO = null;
oFF.Severity.PRINT = null;
oFF.Severity.SEMANTICAL_ERROR = null;
oFF.Severity.WARNING = null;
oFF.Severity.create = function(name, level)
{
	let newObj = new oFF.Severity();
	newObj._setupInternal(name);
	newObj.m_level = level;
	return newObj;
};
oFF.Severity.fromName = function(name)
{
	let retValue = null;
	let upName = oFF.XString.toUpperCase(name);
	if (oFF.XString.isEqual("DEBUG", upName) || oFF.XString.isEqual("0", upName))
	{
		retValue = oFF.Severity.DEBUG;
	}
	else if (oFF.XString.isEqual("INFO", upName) || oFF.XString.isEqual("1", upName))
	{
		retValue = oFF.Severity.INFO;
	}
	else if (oFF.XString.isEqual("WARNING", upName) || oFF.XString.isEqual("2", upName))
	{
		retValue = oFF.Severity.WARNING;
	}
	else if (oFF.XString.isEqual("ERROR", upName) || oFF.XString.isEqual("3", upName))
	{
		retValue = oFF.Severity.ERROR;
	}
	else if (oFF.XString.isEqual("SEMANTICALERROR", upName))
	{
		retValue = oFF.Severity.SEMANTICAL_ERROR;
	}
	else if (oFF.XString.isEqual("PRINT", upName) || oFF.XString.isEqual("4", upName))
	{
		retValue = oFF.Severity.PRINT;
	}
	return retValue;
};
oFF.Severity.staticSetup = function()
{
	oFF.Severity.DEBUG = oFF.Severity.create("Debug", 0);
	oFF.Severity.INFO = oFF.Severity.create("Info", 1);
	oFF.Severity.WARNING = oFF.Severity.create("Warning", 2);
	oFF.Severity.ERROR = oFF.Severity.create("Error", 3);
	oFF.Severity.SEMANTICAL_ERROR = oFF.Severity.create("SemanticalError", 3);
	oFF.Severity.PRINT = oFF.Severity.create("Print", 4);
};
oFF.Severity.prototype.m_level = 0;
oFF.Severity.prototype.getLevel = function()
{
	return this.m_level;
};

oFF.XPlatform = function() {};
oFF.XPlatform.prototype = new oFF.XConstantWithParent();
oFF.XPlatform.prototype._ff_c = "XPlatform";

oFF.XPlatform.ANDROID = null;
oFF.XPlatform.APPLE = null;
oFF.XPlatform.BROWSER = null;
oFF.XPlatform.FABRIC_REACT = null;
oFF.XPlatform.GENERIC = null;
oFF.XPlatform.HANA = null;
oFF.XPlatform.HTML = null;
oFF.XPlatform.IOS = null;
oFF.XPlatform.IPAD = null;
oFF.XPlatform.IPHONE = null;
oFF.XPlatform.MAC_OS = null;
oFF.XPlatform.MICROSOFT = null;
oFF.XPlatform.ORCA_REACT = null;
oFF.XPlatform.REACT = null;
oFF.XPlatform.SWING = null;
oFF.XPlatform.SWT = null;
oFF.XPlatform.UI5 = null;
oFF.XPlatform.UI5_WEB_COMPONENTS = null;
oFF.XPlatform.WATCH_OS = null;
oFF.XPlatform.WINDOWS = null;
oFF.XPlatform.s_platform = null;
oFF.XPlatform.create = function(name, parent)
{
	let pt = new oFF.XPlatform();
	pt.setupExt(name, parent);
	return pt;
};
oFF.XPlatform.getPlatform = function()
{
	return oFF.XPlatform.s_platform;
};
oFF.XPlatform.lookup = function(name)
{
	if (oFF.XStringUtils.isNullOrEmpty(name))
	{
		return null;
	}
	let adjustedName = oFF.XString.replace(name, " ", "");
	switch (adjustedName)
	{
		case "Generic":
			return oFF.XPlatform.GENERIC;

		case "Hana":
			return oFF.XPlatform.HANA;

		case "Ui5":
			return oFF.XPlatform.UI5;

		case "Ui5WebComponents":
			return oFF.XPlatform.UI5_WEB_COMPONENTS;

		case "Apple":
			return oFF.XPlatform.APPLE;

		case "iOS":
			return oFF.XPlatform.IOS;

		case "iPad":
			return oFF.XPlatform.IPAD;

		case "iPhone":
			return oFF.XPlatform.IPHONE;

		case "MacOS":
			return oFF.XPlatform.MAC_OS;

		case "WatchOS":
			return oFF.XPlatform.WATCH_OS;

		case "Microsoft":
			return oFF.XPlatform.MICROSOFT;

		case "Windows":
			return oFF.XPlatform.WINDOWS;

		case "Swing":
			return oFF.XPlatform.SWING;

		case "Swt":
			return oFF.XPlatform.SWT;

		case "Android":
			return oFF.XPlatform.ANDROID;

		case "Browser":
			return oFF.XPlatform.BROWSER;

		case "React":
			return oFF.XPlatform.REACT;

		case "OrcaReact":
			return oFF.XPlatform.ORCA_REACT;

		case "FabricReact":
			return oFF.XPlatform.FABRIC_REACT;

		default:
			return null;
	}
};
oFF.XPlatform.lookupWithDefault = function(name, defaultPlatform)
{
	let tmpPlatform = oFF.XPlatform.lookup(name);
	if (oFF.notNull(tmpPlatform))
	{
		return tmpPlatform;
	}
	return defaultPlatform;
};
oFF.XPlatform.setPlatform = function(platform)
{
	oFF.XPlatform.s_platform = platform;
};
oFF.XPlatform.staticSetup = function()
{
	oFF.XPlatform.GENERIC = oFF.XPlatform.create("Generic", null);
	oFF.XPlatform.HANA = oFF.XPlatform.create("Hana", oFF.XPlatform.GENERIC);
	oFF.XPlatform.APPLE = oFF.XPlatform.create("Apple", oFF.XPlatform.GENERIC);
	oFF.XPlatform.IOS = oFF.XPlatform.create("iOS", oFF.XPlatform.APPLE);
	oFF.XPlatform.IPAD = oFF.XPlatform.create("iPad", oFF.XPlatform.IOS);
	oFF.XPlatform.IPHONE = oFF.XPlatform.create("iPhone", oFF.XPlatform.IOS);
	oFF.XPlatform.MAC_OS = oFF.XPlatform.create("MacOS", oFF.XPlatform.APPLE);
	oFF.XPlatform.WATCH_OS = oFF.XPlatform.create("WatchOS", oFF.XPlatform.APPLE);
	oFF.XPlatform.MICROSOFT = oFF.XPlatform.create("Microsoft", oFF.XPlatform.GENERIC);
	oFF.XPlatform.WINDOWS = oFF.XPlatform.create("Windows", oFF.XPlatform.MICROSOFT);
	oFF.XPlatform.ANDROID = oFF.XPlatform.create("Android", oFF.XPlatform.GENERIC);
	oFF.XPlatform.BROWSER = oFF.XPlatform.create("Browser", oFF.XPlatform.GENERIC);
	oFF.XPlatform.HTML = oFF.XPlatform.create("Html", oFF.XPlatform.BROWSER);
	oFF.XPlatform.UI5 = oFF.XPlatform.create("Ui5", oFF.XPlatform.BROWSER);
	oFF.XPlatform.UI5_WEB_COMPONENTS = oFF.XPlatform.create("Ui5WebComponents", oFF.XPlatform.BROWSER);
	oFF.XPlatform.REACT = oFF.XPlatform.create("React", oFF.XPlatform.BROWSER);
	oFF.XPlatform.ORCA_REACT = oFF.XPlatform.create("OrcaReact", oFF.XPlatform.REACT);
	oFF.XPlatform.FABRIC_REACT = oFF.XPlatform.create("FabricReact", oFF.XPlatform.REACT);
	oFF.XPlatform.SWING = oFF.XPlatform.create("Swing", oFF.XPlatform.GENERIC);
	oFF.XPlatform.SWT = oFF.XPlatform.create("Swt", oFF.XPlatform.GENERIC);
	oFF.XPlatform.s_platform = oFF.XPlatform.GENERIC;
};

oFF.XDecFloatByDouble = function() {};
oFF.XDecFloatByDouble.prototype = new oFF.XDecFloatAbstract();
oFF.XDecFloatByDouble.prototype._ff_c = "XDecFloatByDouble";

oFF.XDecFloatByDouble.create = function(value)
{
	let objectDecimalFloat = new oFF.XDecFloatByDouble();
	objectDecimalFloat.setupByDouble(value);
	return objectDecimalFloat;
};
oFF.XDecFloatByDouble.prototype.m_decimalFloatValue = 0.0;
oFF.XDecFloatByDouble.prototype.cloneExt = function(flags)
{
	return oFF.XDecFloatByDouble.create(this.m_decimalFloatValue);
};
oFF.XDecFloatByDouble.prototype.getDouble = function()
{
	return this.m_decimalFloatValue;
};
oFF.XDecFloatByDouble.prototype.getStringRepresentation = function()
{
	return oFF.XDouble.convertToString(this.m_decimalFloatValue);
};
oFF.XDecFloatByDouble.prototype.mayLoosePrecision = function()
{
	return true;
};
oFF.XDecFloatByDouble.prototype.setupByDouble = function(value)
{
	this.m_decimalFloatValue = value;
};

oFF.XDecFloatByString = function() {};
oFF.XDecFloatByString.prototype = new oFF.XDecFloatAbstract();
oFF.XDecFloatByString.prototype._ff_c = "XDecFloatByString";

oFF.XDecFloatByString.ZERO_VALUE_STRING = "0";
oFF.XDecFloatByString.create = function(value)
{
	let objectDecimalFloat = new oFF.XDecFloatByString();
	objectDecimalFloat.setupByString(value);
	return objectDecimalFloat;
};
oFF.XDecFloatByString.createZeroValue = function()
{
	return oFF.XDecFloatByString.create(oFF.XDecFloatByString.ZERO_VALUE_STRING);
};
oFF.XDecFloatByString.prototype.m_decimalFloatValue = null;
oFF.XDecFloatByString.prototype.cloneExt = function(flags)
{
	return oFF.XDecFloatByString.create(this.m_decimalFloatValue);
};
oFF.XDecFloatByString.prototype.getDouble = function()
{
	return oFF.XDouble.convertFromString(this.m_decimalFloatValue);
};
oFF.XDecFloatByString.prototype.getStringRepresentation = function()
{
	return this.m_decimalFloatValue;
};
oFF.XDecFloatByString.prototype.mayLoosePrecision = function()
{
	return false;
};
oFF.XDecFloatByString.prototype.setupByString = function(value)
{
	this.m_decimalFloatValue = value;
};

oFF.XValueType = function() {};
oFF.XValueType.prototype = new oFF.XConstantWithParent();
oFF.XValueType.prototype._ff_c = "XValueType";

oFF.XValueType.AMOUNT = null;
oFF.XValueType.ARRAY = null;
oFF.XValueType.BOOLEAN = null;
oFF.XValueType.BYTE_ARRAY = null;
oFF.XValueType.CALENDAR_DATE = null;
oFF.XValueType.CALENDAR_DAY = null;
oFF.XValueType.CHAR = null;
oFF.XValueType.CUKY = null;
oFF.XValueType.CURRENT_MEMBER = null;
oFF.XValueType.DATE = null;
oFF.XValueType.DATE_TIME = null;
oFF.XValueType.DECIMAL_FLOAT = null;
oFF.XValueType.DIMENSION_MEMBER = null;
oFF.XValueType.DOUBLE = null;
oFF.XValueType.ENUM_CONSTANT = null;
oFF.XValueType.ERROR_VALUE = null;
oFF.XValueType.INTEGER = null;
oFF.XValueType.KEY_VALUE = null;
oFF.XValueType.LANGUAGE = null;
oFF.XValueType.LINE_STRING = null;
oFF.XValueType.LIST = null;
oFF.XValueType.LONG = null;
oFF.XValueType.LOWER_CASE_STRING = null;
oFF.XValueType.MULTI_LINE_STRING = null;
oFF.XValueType.MULTI_POINT = null;
oFF.XValueType.MULTI_POLYGON = null;
oFF.XValueType.NUMBER = null;
oFF.XValueType.NUMC = null;
oFF.XValueType.OBJECT = null;
oFF.XValueType.OPTION_LIST = null;
oFF.XValueType.OPTION_VALUE = null;
oFF.XValueType.PERCENT = null;
oFF.XValueType.POINT = null;
oFF.XValueType.POLYGON = null;
oFF.XValueType.PRICE = null;
oFF.XValueType.PROPERTIES = null;
oFF.XValueType.QUANTITY = null;
oFF.XValueType.STRING = null;
oFF.XValueType.STRING_ARRAY = null;
oFF.XValueType.STRUCTURE = null;
oFF.XValueType.STRUCTURE_LIST = null;
oFF.XValueType.TIME = null;
oFF.XValueType.TIMESPAN = null;
oFF.XValueType.UI_COLOR = null;
oFF.XValueType.UI_CONSTANT = null;
oFF.XValueType.UI_CONTROL = null;
oFF.XValueType.UI_CSS_BORDER_STYLE = null;
oFF.XValueType.UI_CSS_BOX_EDGES = null;
oFF.XValueType.UI_CSS_GAP = null;
oFF.XValueType.UI_CSS_LENGTH = null;
oFF.XValueType.UI_CSS_TEXT_DECORATION = null;
oFF.XValueType.UI_CURSOR_POSITION = null;
oFF.XValueType.UI_CUSTOM_COMPLETER = null;
oFF.XValueType.UI_DROP_CONDITION = null;
oFF.XValueType.UI_DROP_INFO = null;
oFF.XValueType.UI_GRID_CONTAINER_SETTINGS = null;
oFF.XValueType.UI_GRID_LAYOUT = null;
oFF.XValueType.UI_KEYBOARD_CONFIGURATION = null;
oFF.XValueType.UI_KEYBOARD_STATE = null;
oFF.XValueType.UI_LAYOUT_DATA = null;
oFF.XValueType.UI_POSITION = null;
oFF.XValueType.UI_ROW_MODE = null;
oFF.XValueType.UI_SERIALIZABLE_OBJECT = null;
oFF.XValueType.UI_SIZE = null;
oFF.XValueType.UNIT = null;
oFF.XValueType.UNSUPPORTED = null;
oFF.XValueType.UPPER_CASE_STRING = null;
oFF.XValueType.URI = null;
oFF.XValueType.VARIABLE = null;
oFF.XValueType.create = function(constant)
{
	return oFF.XValueType.createExt(constant, null, 0, 0);
};
oFF.XValueType.createExt = function(constant, parent, defaultPrecision, defaultDecimals)
{
	let vt = new oFF.XValueType();
	if (oFF.notNull(parent))
	{
		vt.setupExt(constant, parent);
	}
	else
	{
		vt.setupExt(constant, null);
	}
	vt.m_decimals = defaultDecimals;
	vt.m_precision = defaultPrecision;
	return vt;
};
oFF.XValueType.createWithParent = function(constant, parent)
{
	return oFF.XValueType.createExt(constant, parent, 0, 0);
};
oFF.XValueType.getValueTypeOfObject = function(valueTypeContext)
{
	return oFF.isNull(valueTypeContext) ? null : valueTypeContext.getValueType();
};
oFF.XValueType.staticSetup = function()
{
	oFF.XValueType.BOOLEAN = oFF.XValueType.create("Boolean");
	oFF.XValueType.NUMC = oFF.XValueType.create("Numc");
	oFF.XValueType.CHAR = oFF.XValueType.create("Char");
	oFF.XValueType.NUMBER = oFF.XValueType.create("Number");
	oFF.XValueType.INTEGER = oFF.XValueType.createExt("Integer", oFF.XValueType.NUMBER, 0, 0);
	oFF.XValueType.DOUBLE = oFF.XValueType.createExt("Double", oFF.XValueType.NUMBER, 7, 2);
	oFF.XValueType.DECIMAL_FLOAT = oFF.XValueType.createExt("DecimalFloat", oFF.XValueType.DOUBLE, 7, 2);
	oFF.XValueType.LONG = oFF.XValueType.createExt("Long", oFF.XValueType.NUMBER, 0, 0);
	oFF.XValueType.PERCENT = oFF.XValueType.createExt("Percent", oFF.XValueType.NUMBER, 7, 3);
	oFF.XValueType.AMOUNT = oFF.XValueType.createExt("Amount", oFF.XValueType.NUMBER, 7, 2);
	oFF.XValueType.QUANTITY = oFF.XValueType.createExt("Quantity", oFF.XValueType.NUMBER, 7, 2);
	oFF.XValueType.PRICE = oFF.XValueType.createExt("Price", oFF.XValueType.NUMBER, 7, 2);
	oFF.XValueType.STRING = oFF.XValueType.create("String");
	oFF.XValueType.LOWER_CASE_STRING = oFF.XValueType.createExt("LowerCaseString", oFF.XValueType.STRING, 0, 0);
	oFF.XValueType.UPPER_CASE_STRING = oFF.XValueType.createExt("UpperCaseString", oFF.XValueType.STRING, 0, 0);
	oFF.XValueType.DATE = oFF.XValueType.create("Date");
	oFF.XValueType.DATE_TIME = oFF.XValueType.create("DateTime");
	oFF.XValueType.CALENDAR_DAY = oFF.XValueType.create("CalendarDay");
	oFF.XValueType.CALENDAR_DATE = oFF.XValueType.create("CalendarDate");
	oFF.XValueType.TIMESPAN = oFF.XValueType.create("TimeSpan");
	oFF.XValueType.TIME = oFF.XValueType.create("Time");
	oFF.XValueType.DIMENSION_MEMBER = oFF.XValueType.create("DimensionMember");
	oFF.XValueType.LANGUAGE = oFF.XValueType.create("Language");
	oFF.XValueType.PROPERTIES = oFF.XValueType.create("Properties");
	oFF.XValueType.STRUCTURE = oFF.XValueType.create("Structure");
	oFF.XValueType.STRUCTURE_LIST = oFF.XValueType.create("StructureList");
	oFF.XValueType.KEY_VALUE = oFF.XValueType.create("KeyValue");
	oFF.XValueType.BYTE_ARRAY = oFF.XValueType.create("ByteArray");
	oFF.XValueType.URI = oFF.XValueType.create("Uri");
	oFF.XValueType.VARIABLE = oFF.XValueType.create("Variable");
	oFF.XValueType.UNSUPPORTED = oFF.XValueType.create("Unsupported");
	oFF.XValueType.ENUM_CONSTANT = oFF.XValueType.create("EnumConstant");
	oFF.XValueType.POLYGON = oFF.XValueType.create("Polygon");
	oFF.XValueType.MULTI_POLYGON = oFF.XValueType.create("MultiPolygon");
	oFF.XValueType.POINT = oFF.XValueType.create("Point");
	oFF.XValueType.MULTI_POINT = oFF.XValueType.create("MultiPoint");
	oFF.XValueType.LINE_STRING = oFF.XValueType.create("LineString");
	oFF.XValueType.MULTI_LINE_STRING = oFF.XValueType.create("MultiLineString");
	oFF.XValueType.CURRENT_MEMBER = oFF.XValueType.create("CurrentMember");
	oFF.XValueType.ARRAY = oFF.XValueType.create("Array");
	oFF.XValueType.LIST = oFF.XValueType.create("List");
	oFF.XValueType.OPTION_LIST = oFF.XValueType.create("OptionList");
	oFF.XValueType.OPTION_VALUE = oFF.XValueType.create("OptionValue");
	oFF.XValueType.UNIT = oFF.XValueType.create("Unit");
	oFF.XValueType.CUKY = oFF.XValueType.create("Cuky");
	oFF.XValueType.STRING_ARRAY = oFF.XValueType.create("StringArray");
	oFF.XValueType.OBJECT = oFF.XValueType.create("Object");
	oFF.XValueType.UI_CONTROL = oFF.XValueType.create("UiControl");
	oFF.XValueType.UI_SERIALIZABLE_OBJECT = oFF.XValueType.create("UiSerializableObject");
	oFF.XValueType.UI_CONSTANT = oFF.XValueType.create("UiConstant");
	oFF.XValueType.UI_SIZE = oFF.XValueType.create("UiSize");
	oFF.XValueType.UI_POSITION = oFF.XValueType.create("UiPosition");
	oFF.XValueType.UI_COLOR = oFF.XValueType.create("UiColor");
	oFF.XValueType.UI_CSS_LENGTH = oFF.XValueType.create("UiCssLength");
	oFF.XValueType.UI_CSS_BOX_EDGES = oFF.XValueType.create("UiCssBoxEdges");
	oFF.XValueType.UI_CSS_TEXT_DECORATION = oFF.XValueType.create("UiCssTextDecoration");
	oFF.XValueType.UI_CSS_GAP = oFF.XValueType.create("UiCssGap");
	oFF.XValueType.UI_LAYOUT_DATA = oFF.XValueType.createWithParent("UiLayoutData", oFF.XValueType.UI_SERIALIZABLE_OBJECT);
	oFF.XValueType.UI_GRID_LAYOUT = oFF.XValueType.createWithParent("UiGridLayout", oFF.XValueType.UI_SERIALIZABLE_OBJECT);
	oFF.XValueType.UI_DROP_INFO = oFF.XValueType.createWithParent("UiDropInfo", oFF.XValueType.UI_SERIALIZABLE_OBJECT);
	oFF.XValueType.UI_DROP_CONDITION = oFF.XValueType.createWithParent("UiDropCondition", oFF.XValueType.UI_SERIALIZABLE_OBJECT);
	oFF.XValueType.UI_CURSOR_POSITION = oFF.XValueType.createWithParent("UiCursorPosition", oFF.XValueType.UI_SERIALIZABLE_OBJECT);
	oFF.XValueType.UI_CUSTOM_COMPLETER = oFF.XValueType.createWithParent("UiCustomCompleter", oFF.XValueType.UI_SERIALIZABLE_OBJECT);
	oFF.XValueType.UI_KEYBOARD_STATE = oFF.XValueType.createWithParent("UiKeyboardState", oFF.XValueType.UI_SERIALIZABLE_OBJECT);
	oFF.XValueType.UI_KEYBOARD_CONFIGURATION = oFF.XValueType.createWithParent("UiKeyboardConfiguration", oFF.XValueType.UI_SERIALIZABLE_OBJECT);
	oFF.XValueType.UI_GRID_CONTAINER_SETTINGS = oFF.XValueType.createWithParent("UiGridContainerSettings", oFF.XValueType.UI_SERIALIZABLE_OBJECT);
	oFF.XValueType.UI_ROW_MODE = oFF.XValueType.createWithParent("UiRowMode", oFF.XValueType.UI_SERIALIZABLE_OBJECT);
};
oFF.XValueType.prototype.m_decimals = 0;
oFF.XValueType.prototype.m_precision = 0;
oFF.XValueType.prototype.getDefaultDecimalPlaces = function()
{
	return this.m_decimals;
};
oFF.XValueType.prototype.getDefaultPrecision = function()
{
	return this.m_precision;
};
oFF.XValueType.prototype.isBoolean = function()
{
	return this === oFF.XValueType.BOOLEAN;
};
oFF.XValueType.prototype.isDate = function()
{
	return this === oFF.XValueType.DATE;
};
oFF.XValueType.prototype.isDateBased = function()
{
	return this === oFF.XValueType.DATE || this === oFF.XValueType.DATE_TIME || this === oFF.XValueType.CALENDAR_DAY;
};
oFF.XValueType.prototype.isDateTime = function()
{
	return this.isDateBased() || this === oFF.XValueType.TIMESPAN || this === oFF.XValueType.TIME;
};
oFF.XValueType.prototype.isNumber = function()
{
	return this === oFF.XValueType.INTEGER || this === oFF.XValueType.DOUBLE || this === oFF.XValueType.LONG || this === oFF.XValueType.PERCENT || this === oFF.XValueType.NUMC || this === oFF.XValueType.DECIMAL_FLOAT;
};
oFF.XValueType.prototype.isSpatial = function()
{
	return this === oFF.XValueType.POINT || this === oFF.XValueType.MULTI_POINT || this === oFF.XValueType.POLYGON || this === oFF.XValueType.MULTI_POLYGON || this === oFF.XValueType.LINE_STRING || this === oFF.XValueType.MULTI_LINE_STRING;
};
oFF.XValueType.prototype.isString = function()
{
	return this === oFF.XValueType.STRING || this === oFF.XValueType.LOWER_CASE_STRING || this === oFF.XValueType.UPPER_CASE_STRING;
};
oFF.XValueType.prototype.isVariable = function()
{
	return this === oFF.XValueType.VARIABLE;
};

oFF.LanguageExtModule = function() {};
oFF.LanguageExtModule.prototype = new oFF.DfModule();
oFF.LanguageExtModule.prototype._ff_c = "LanguageExtModule";

oFF.LanguageExtModule.s_module = null;
oFF.LanguageExtModule.getInstance = function()
{
	if (oFF.isNull(oFF.LanguageExtModule.s_module))
	{
		oFF.LanguageExtModule.s_module = oFF.DfModule.startExt(new oFF.LanguageExtModule());
		oFF.Severity.staticSetup();
		oFF.XSyncEnv.staticSetup();
		oFF.XLanguage.staticSetup();
		oFF.XPlatform.staticSetup();
		oFF.XAutoReleaseManager.staticSetup();
		oFF.XValueType.staticSetup();
		oFF.DfModule.stopExt(oFF.LanguageExtModule.s_module);
	}
	return oFF.LanguageExtModule.s_module;
};
oFF.LanguageExtModule.prototype.getName = function()
{
	return "ff0005.language.ext";
};

oFF.LanguageModule.getInstance();
oFF.LanguageExtModule.getInstance();

return oFF;
} );