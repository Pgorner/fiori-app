/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[

],
function()
{
"use strict";

const oFF={};
// Google Apps Script

oFF.isNull = function(o)
{
    "use strict";
    return o === null || o === undefined;
};
oFF.notNull = function(o)
{
    "use strict";
    return o !== undefined && o !== null;
};
oFF.noSupport = function() {
    "use strict";
    throw new Error("Unsupported Operation Exception");
};

oFF.isUi5 = function() {return true};
oFF.isXs = function () {return false};

oFF.isNode = function() {
    return false;
}


/** Default implementation for the root object.*/
oFF.XObject = function() {};

oFF.XObject.prototype = {
  _ff_c: "XObject",
  m_isReleased: false,

  setup: function() {
       this.m_isReleased = false;
  },

  releaseObject: function() {
       this.m_isReleased = true;
  },

  destructor: function() {
     },

  isReleaseLocked: function() {
       return false;
  },

  isReleased: function() {
       return this.m_isReleased;
  },

  addOwnership: function() {
     },

  isEqualTo: function(other) {
       return this === other;
  },

  copyFrom: function(other, flags) {
     },

  getObjectId: function() {
       return null;
  },

  getClassName: function() {
       return this._ff_c;
  },

  compareTo: oFF.noSupport,

  cloneExt: function(flags) {
     },

  clone: function() {
       return this.cloneExt(null);
  },

  toString: function() {
       return "[???]";
  }
};

/**
 * Cast the given native object into a Firefly object.
 * @param object the native object.
 * @return the Firefly object.
 */
oFF.XObject.castFromNative = function(nativeObject) {
   return nativeObject;
};

/**
 * Cast the given object into qny other type. Not type safe!
 * @param obj the native object.
 * @return the cast object.
 */
oFF.XObject.castToAny = function(obj) {
   return obj;
};

/**
 * Check whether two generic objects are equal.
 * @param obj1 first object.
 * @param obj2 second object.
 * @return <code>true</code> when both objects are equal.
 */
oFF.XObject.areObjectsEqual = function(obj1, obj2) {
   if (obj1 == null && obj2 == null) {
    return true;
  }

  if (obj1 == null || obj2 == null) {
    return false;
  }

  if (oFF.XObject.isXObject(obj1) && oFF.XObject.isXObject(obj2)) {
    return obj1.isEqualTo(obj2);
  }

  return obj1 === obj2;
};

/**
 * Check whether a generic object is a XObject.
 * @param obj the object.
 * @return <code>true</code> when the object is a XObject.
 */
oFF.XObject.isXObject = function(obj) {
   return obj != null && obj instanceof oFF.XObject;
};

/**
 * Check whether the given object is of the specified class.
 * @param obj the object to check.
 * @param clazz the class.
 * @return <code>true</code> when the object is an instance of the specified class.
 */
oFF.XObject.isOfClass = function(obj, clazz) {
   if (obj != null && clazz != null) {
    const nativeClazz = clazz.getNativeElement();
    if (nativeClazz) {
      return nativeClazz.prototype.isPrototypeOf(obj);
      //  return obj instanceof nativeClazz; // another option?
    }
  }
  return false;
};

/** Weak reference. */
oFF.XWeakReference = function(reference) {
       this.m_reference = reference;
    this._ff_c = "XWeakReference";
};
oFF.XWeakReference.prototype = new oFF.XObject();

/**
 * Create a new weak reference.
 * @param reference a reference.
 * @return the new weak reference.
 */
oFF.XWeakReference.create = function(reference)
{
       return new oFF.XWeakReference(reference);
};

oFF.XWeakReference.prototype.releaseObject = function()
{
       this.m_reference = null;
    oFF.XObject.prototype.releaseObject.call(this);
};

oFF.XWeakReference.prototype.getReference = function()
{
       return this.m_reference;
};

oFF.XWeakReference.prototype.toString = function() {
       return this.m_reference && this.m_reference.toString();
};

/** Runtime Exception. */
oFF.XException = {
    createInitializationException: function () {
               return new Error("Initialization Exception");
    },

    createUnsupportedOperationException: oFF.noSupport,

    createRuntimeException: function (message) {
               return new Error("Runtime Exception: " + message);
    },

    createIllegalStateException: function (message) {
               return new Error("Illegal State: " + message);
    },

    createIllegalArgumentException: function (message) {
               return new Error("Illegal Argument: " + message);
    },

    createException: function (message) {
               if (message == null) {
            return new Error("Exception");
        } else {
            return new Error(message);
        }
    },

    createAssertException: function (message) {
               const excp = new Error("Assert Exception: " + message);
        excp.isAssertException = true;
        return excp;
    },

    isAssertException: function (exception) {
               return exception.isAssertException;
    },

    createExceptionWithCause: function (message, excp) {
               if (message == null && excp == null) {
            return new Error();
        }

        if (message == null) {
            return excp;
        }

        return new Error(message, {cause: excp});
    },

    createExceptionForRethrowWithDefault: function (excp, message) {
               if (excp == null) {
            return new Error(message);
        }

        return excp;
    },

    supportsStackTrace: function () {
               return true;
    },

    getStackTrace: function (excp) {
               if (excp.stack === undefined) {
            return excp.message + "\r\n(No call stack available; please search source code for exception message)";
        }
        return excp.stack;
    },

    getMessage: function (excp) {
               return excp.message;
    }
};

/** String utilities. */
oFF.XString = {
     /**
     * Checks for string equal.
     * @param firstValue the first value.
     * @param secondValue the second value.
     * @return true if both strings are equal
     */
    isEqual: function(firstValue, secondValue)
    {
               return firstValue === secondValue;
    },

    getCharAt: function(value, index)
    {
               return value.charCodeAt(index);
    },

    /**
     * Replace a search pattern with a new replace value
     *
     * Replace a search pattern with a new replace value. Wildcards are not allowed. The replacement
     * starts from the beginning and runs to the end. For example, value="mmm", searchPattern="mm", replaceValue="x"
     * results in "xm".
     * @param value the origin value
     * @param searchPattern the search pattern
     * @param replaceValue the replace value
     * @return the new string
     */
    replace: function(value, searchPattern, replaceValue)
    {
               return value && value.split(searchPattern).join(replaceValue);
    },

    /**
     * Check if one is contained in another string.
     * @param s1 first string
     * @param s2 second string
     * @return true if string1 cointains string 2
     */
    containsString: function(s1, s2)
    {
               if(s1 === null && s2 === null) {
            return true;
        }
        if(s1 === null) {
            return false;
        }
        if(s2 === null) {
            return true;
        }
        return s1.indexOf(s2) !== -1;
    },

    /**
     * Returns true if a string starts with a certain string, false otherwise.
     * @param value the string to check
     * @param startsWithString the starting pattern
     * @return true if a string starts with a certain string, false otherwise.
     */
    startsWith: function(value, startsWithString)
    {
               if (value == null)
        {
            return false;
        }
        return value.indexOf(startsWithString) === 0;
    },

    /**
     * Returns true if a string starts with a certain string, false otherwise.
     * @param value the string to check
     * @param endsWithString the starting pattern
     * @return true if a string ends with a certain string, false otherwise.
     */
    endsWith: function(value, endsWithString)
    {
               if (value == null)
        {
            return false;
        }
        var lastIndexOf = value.lastIndexOf(endsWithString);
        if (lastIndexOf === -1)
        {
            return false;
        }
        if (lastIndexOf + endsWithString.length === value.length)
        {
            return true;
        }

        return false;
    },

    /**
     * Get the size of a string.
     * @param value the string
     * @return the size of a string.
     */
    size: function(value)
    {
               return value.length;
    },

    /**
     * Compare 2 strings.
     * @param value the first string.
     * @param compareTo the second string.
     * @return true if strings are equal, false otherwise.
     */
    compare: function(value, compareTo)
    {
               if (value === compareTo)
        {
            return 0;
        }
        if (value === null)
        {
            return -1;
        }
        if (compareTo === null)
        {
            return 1;
        }
        return (value > compareTo) ? 1 : -1;
    },

    /**
     * Get the index of a pattern in the text or -1, if the pattern cannot be found.
     * @param text the text.
     * @param pattern the pattern.
     * @return the index or -1, if the pattern cannot be found.
     */
    indexOf: function(text, pattern)
    {
               return text.indexOf(pattern);
    },

    /**
     * Get the index of a pattern in the text or -1, if the pattern cannot be found.
     * @param text the text.
     * @param pattern the pattern.
     * @param fromIndex index to start from.
     * @return the index or -1, if the pattern cannot be found.
     */
    indexOfFrom: function(text, pattern, fromIndex)
    {
               return text.indexOf(pattern,fromIndex);
    },

    /**
     * Get the last index of a pattern in the text or -1, if the pattern cannot be found.
     * @param text the text.
     * @param pattern the pattern
     * @return the index or -1, if the pattern cannot be found.
     */
    lastIndexOf: function(text, pattern)
    {
               return text.lastIndexOf(pattern);
    },

    /**
     * Get the last index of a pattern in the text or -1, if the pattern cannot be found.
     * @param text the text
     * @param pattern the pattern
     * @param indexFrom index to start from
     * @return the index or -1, if the pattern cannot be found.
     */
    lastIndexOfFrom: function(text, pattern, indexFrom)
    {
               return text.lastIndexOf(pattern,indexFrom);
    },

    /**
     * Create a substring.
     * @param text the text
     * @param beginIndex the start index
     * @param endIndex the end index. If the rest of the string should be used, the parameter must be set to -1.
     * @return the substring.
     */
    substring: function(text, beginIndex, endIndex)
    {
               if (endIndex === -1)
        {
            return text.substring(beginIndex);
        }
        return text.substring(beginIndex,endIndex);
    },

    /**
     * Convert a string to lower case.
     * @param value the value.
     * @return the lower-case string.
     */
    toLowerCase: function(value)
    {
               return value && value.toLowerCase();
    },

    /**
     * Convert a string to upper case.
     * @param value the value.
     * @return the upper-case string.
     */
    toUpperCase: function(value)
    {
               return value && value.toUpperCase();
    },

    /**
     * Trims a string.
     * @param value the value
     * @return the value without leading and trailing spaces
     */
    trim: function(value)
    {
               return value && value.trim();
    },

    /**
     * Returns whether or not the string matches the given regular expression.
     * @param value the value
     * @param pattern the regular expression
     * @return true if a string matches the regular expression, false otherwise.
     */
    match: function(value, pattern)
    {
               if (value && pattern) {
          var regex = new RegExp(pattern);
          return regex.test(value);
        }
        return false;
    },

    getStringResource: function()
    {
               return null;
    },

    utf8Encode: function(value)
    {
               return unescape(encodeURIComponent(value));
    },
    utf8Decode: function(value)
    {
               return decodeURIComponent(escape(value));
    },
    
    convertToString: function(obj)
	{
			if (obj == null)
		{
			return obj;
		}
		else if (oFF.XString.isString(obj))
		{
			return obj;
		}
		else if (oFF.XObject.isXObject(obj))
		{
			return obj.toString();
		}
		return String(obj);
	 },

     asString: function(obj)
     {
                 if (oFF.XString.isString(obj)){
			 return obj;
		 }
		 throw new Error('Cannot cast to string!');
     },
     
	/**
	 * Check whether a generic object is a String.
	 * @param obj the object.
	 * @return <code>true</code> when the object is a String.
	 */
     isString: function(obj)
     {
	   		return obj != null && typeof obj === "string";
     }
};

/** Boolean utilities. */
oFF.XBoolean = {
    TRUE: "true",
    FALSE: "false",

    convertToString: function(value) {
               if (value === true) {
            return this.TRUE;
        }
        return this.FALSE;
    },
    convertFromString: function(value) {
               if(this.TRUE === value) {
            return true;
        }
        if (this.FALSE === value) {
            return false;
        }
        throw new Error("Illegal Argument:" + value);
    },  
    convertFromStringWithDefault : function(value, defaultValue) {
               if (this.TRUE === value) {
            return true;
        }
        if (this.FALSE === value) {
            return false;
        }
        return defaultValue;
    },
};
/** Integer utilities. */
oFF.XInteger = {
    /**
     * convert an integer value to a string.
     * @param value the value.
     * @returns the integer as string.
     * @exception XIllegalArgumentException if the value cannot be converted.
     */
    convertToString: function(value) {
               if(value === null || value === undefined) {
            return null;
        }
        
        return value.toString();
    },

    /**
     * Convert a string value to an integer.
     * @param value the value.
     * @return the string as integer.
     * @exception XIllegalArgumentException if the value cannot be converted.
     */
    convertFromString: function(value) {
               return oFF.XInteger.convertFromStringWithRadix(value, 10);
    },

    /**
     * Convert a string value to an integer.
     * @param value the value.
     * @return the string as integer
     * @exception XIllegalArgumentException if the value cannot be converted.
     */
    convertFromStringWithRadix: function(value, radix, defaultValue) {
               if(typeof value === "number"){
            return parseInt(value, radix);
        }
        var hasDefault = typeof defaultValue !== "undefined";
        var v = oFF.isNull(value) ? "": value.trim() 	;
        if ("" === v || !/(^[\-+]?\d*\.?\d*$)|(^[0-9a-fA-F]*$)/.test(v)) {
            if (hasDefault) {
                return defaultValue;
            }

            throw new Error("Value is not a number");
        }
        var intValue = parseInt(v, radix);
        if (isNaN(intValue)) {
            if (hasDefault) {
                return defaultValue;
            }
            throw new Error("Value is not a number: " + value);
        }
        return intValue;
    },

    /**
     * Convert a string value to an integer
     * @param value the value
     * @param defaultValue the default value
     * @return the string as integer
     */
    convertFromStringWithDefault: function(value, defaultValue) {
               return oFF.XInteger.convertFromStringWithRadix(value, 10, defaultValue);
    },

    convertToDouble: function(value) {
               return value;
    },

    convertToInt: function(value) {
               return value;
    },

    /**
     * Convert an int value to a uppercase hex string.
     * @param intValue the int value.
     * @return the hex string value.
     */
    convertToHexString: function(value) {
               var hexStr = Number(value).toString(16).toUpperCase();
        return hexStr.length === 1 ? "0" + hexStr : hexStr;
    },

    /**
     * get the Nth least significant byte of this integer.
     * @param intValue the int value to examine.
     * @param bytePosition the nth least significant byte to extract
     * @return the value of the the nth least significant byte.
     */
    getNthLeastSignificantByte: function(intValue, bytePosition )    {
           	return (intValue >> (bytePosition * 8)) & 0x000000FF;
    },

    /**
     * Return Number.MAX_VALUE.
     * @return Number.MAX_VALUE.
     */
    getMaximumValue: function () {
               return Number.MAX_VALUE;
    },

    /**
     * Return Number.MAX_VALUE.
     * @return Number.MAX_VALUE.
     */
    getMinimumValue: function () {
               return Number.MIN_VALUE;
    }
};

/** Long utilities. */
oFF.XLong = oFF.XInteger;
oFF.XDouble = {
    /**
     * Return Number.MAX_VALUE.
     * @return Number.MAX_VALUE.
     */
    getMaxValue: function () {
               return Number.MAX_VALUE;
    },
    /**
     * Return Number.POSITIVE_INFINITY.
     * @return Number.POSITIVE_INFINITY.
     */
    getPositiveInfinity: function () {
               return Number.POSITIVE_INFINITY;
    },
    /**
    * Return Number.NEGATIVE_INFINITY.
    * @return Number.NEGATIVE_INFINITY.
    */
    getNegativeInfinity: function () {
             return Number.NEGATIVE_INFINITY;
   },
    /**
     * Convert a double value to a string.
     * @param value the value.
     * @return the double as string.
     */
    convertToString: function(value) {
               if(value === null || value === undefined) {
            return null;
        }

        return value.toString();
    },
    /**
     * Convert a string value to an double.
     * @param value the value.
     * @return the string as double.
     * @exception XIllegalArgumentException if the value cannot be converted.
     */
    convertFromString: function(value) {
               if (value === null || value.length === 0 || isNaN(value)) {
            throw new Error("Illegal Argument: Value is not a number: " + value);
        }
        var numberValue = parseFloat(value);
        if(isNaN(numberValue)) {
            throw new Error("Illegal Argument: Value is not a number: " + value);
        }
        return numberValue;
    },
    /**
     * Convert a string value to a double with a default value.
     * @param value the value.
     * @param defaultValue the default value.
     * @return the string as double.
     */
    convertFromStringWithDefault: function(value, defaultValue) {
               if (value === null || value.length === 0 || isNaN(value)) {
            return defaultValue;
        }
        var numberValue = parseFloat(value);
        if(isNaN(numberValue)) {
            return defaultValue;
        }
        return numberValue;
    },
    convertToLong: function(value) {
               return value > 0 ? Math.floor(value) : Math.ceil(value);
    },
    convertToInt: function(value) {
               return parseInt(value, 10);
}
};

/** String buffer. */
oFF.XStringBuffer = function() {
       this._ff_c = "XStringBuffer";
    this.m_stringBuffer = "";
};
oFF.XStringBuffer.prototype = new oFF.XObject();

/**
 * Create a string buffer.
 * @return a string buffer.
 */
oFF.XStringBuffer.create = function()
{
       return new oFF.XStringBuffer();
};
oFF.XStringBuffer.prototype.releaseObject = function()
{
       this.m_isReleased = true;
    this.m_stringBuffer = null;
};
oFF.XStringBuffer.prototype.isReleaseLocked = function () {
       return false;
};
oFF.XStringBuffer.prototype.isReleased = function () {
       return this.m_stringBuffer === null;
};
oFF.XStringBuffer.prototype.appendLine = function(value)
{
       return this.append(value).appendNewLine();
};
oFF.XStringBuffer.prototype.append = function(value)
{
       if(value !== null)
    {
        this.m_stringBuffer = this.m_stringBuffer.concat(value);
    }
    return this;
};
oFF.XStringBuffer.prototype.appendChar = function(value)
{
       this.m_stringBuffer = this.m_stringBuffer.concat(String.fromCharCode(value));
    return this;
};
oFF.XStringBuffer.prototype.appendInt = oFF.XStringBuffer.prototype.append;
oFF.XStringBuffer.prototype.appendDouble = oFF.XStringBuffer.prototype.append;
oFF.XStringBuffer.prototype.appendLong = oFF.XStringBuffer.prototype.append;
oFF.XStringBuffer.prototype.appendBoolean = function(value)
{
       return this.append(oFF.XBoolean.convertToString(value));
};
oFF.XStringBuffer.prototype.appendObject = function(value)
{
       if( value !== null )
    {
        this.append( value.toString() );
    }
    else
    {
        this.append( "null" );
    }
};
oFF.XStringBuffer.prototype.appendNewLine = function()
{
       this.append("\n");
    return this;
};
oFF.XStringBuffer.prototype.toString = function()
{
       return this.m_stringBuffer;
};
oFF.XStringBuffer.prototype.length = function()
{
       return this.m_stringBuffer.length;
};
oFF.XStringBuffer.prototype.clear = function()
{
       this.m_stringBuffer = "";
};
oFF.XStringBuffer.prototype.flush = function()
{
   };

oFF.XClass = function( clazzDefinition ) 
{
       this.m_clazzDefinition = clazzDefinition;
    this._ff_c = "XClass";
};

oFF.XClass.prototype = new oFF.XObject();

oFF.XClass.create = function(clazzDefinition) 
{
       return new oFF.XClass( clazzDefinition );
};

oFF.XClass.createByName = function( clazzName ) 
{
       var theNewXClass = null;
    
    if(clazzName !== null && clazzName !== undefined) 
    {
		var myClass = oFF[clazzName];
	
		if( myClass !== null && myClass !== undefined )
		{
    		theNewXClass = this.create( myClass );
		}
    }
    
    return theNewXClass;
};

oFF.XClass.createByInstance = function(obj)
{
       if(obj == null)
    {
        return null;
    }

    var type = oFF[obj.getClassName()];
    return new oFF.XClass(type);
}

/**
 * Get the canonical class name.
 * @param object the object.
 * @return the canonical class name.
 */
oFF.XClass.getCanonicalClassName = function( object ) 
{
       
    if (object === undefined || object._ff_c === undefined) 
    {
        return "[unknown class]";
    }
    
    return object._ff_c;
};

oFF.XClass.isXObjectReleased = function ( targetObject ) 
{
   
    if(targetObject === null) 
    {
        return true;
    }

    return targetObject.isReleased ? targetObject.isReleased() : false;
};

oFF.XClass.callFunction = function( functionObj, param1, param2, param3 ) 
{
       var getType = {};
    var isFunction = functionObj && getType.toString.call(functionObj) === "[object Function]";

    if( isFunction ) 
    {
        if (param1 === null && param2 === null && param3 === null) 
        {
            functionObj();
        } 
        else 
        {
            functionObj(param1, param2, param3);
        }

        return true;
    }
    
    return false;
};

oFF.XClass.initializeClass = function() 
{
       // do nothing, classes are all automatically initialized
};

oFF.XClass.prototype.releaseObject = function() 
{
       this.m_clazzDefinition = null;
    oFF.XObject.prototype.releaseObject.call( this );
};

oFF.XClass.prototype.getNativeName = function() 
{
       return "Prototype";
};

oFF.XClass.prototype.getNativeElement = function() 
{
       return this.m_clazzDefinition;
};

oFF.XClass.prototype.newInstance = function() 
{
       var F = function(){};
    F.prototype = this.m_clazzDefinition.prototype;
    return new F();
};

oFF.XClass.prototype.toString = function() 
{
       return "Prototype";
};

/** The charset */
oFF.XCharset = {
    USASCII: 0,
    _USASCII: "US-ASCII",
    UTF8: 1,
    _UTF8: "UTF-8",

    /**
     * Lookup the native string representation.
     * @param theConstant the constant.
     * @return the string representation.
     */
    lookupCharsetName: function(theConstant) {
               if (theConstant === this.UTF8) {
            return this._UTF8;
        }
        return this._USASCII;
    }
};
/** Byte Array wrapper. */

oFF.XByteArray = function(nativeByteArrayObject) {
   this.m_nativeByteArray = nativeByteArrayObject; // should always be Uint8Array
  this._ff_c = "XByteArray";
};
oFF.XByteArray.prototype = new oFF.XObject();

oFF.XByteArray.create = function(nativeByteArrayObject, size) {
   if (nativeByteArrayObject === null) {
    const buffer = new ArrayBuffer(size);
    return new oFF.XByteArray(new Uint8Array(buffer));
  } else if (!(nativeByteArrayObject instanceof Uint8Array)) {
    return new oFF.XByteArray(new Uint8Array(nativeByteArrayObject));
  }
  return new oFF.XByteArray(nativeByteArrayObject);
};
oFF.XByteArray.copy = function(src, srcPos, dest, destPos, length) {
   const srcBytes = src.getNative();
  const destBytes = dest.getNative();
  let srcIndex = srcPos;
  let destIndex = destPos;
  let count = 0;

  while (count++ < length) {
    destBytes[destIndex++] = srcBytes[srcIndex++];
  }
};
oFF.XByteArray.convertFromString = function(value) {
   return oFF.XByteArray.convertFromStringWithCharset(value, oFF.XCharset.UTF8);
};
oFF.XByteArray.convertFromStringWithCharset = function(value, charset) {
   //US-ASCII strings can be encoded and decoded using UTF-8 without any loss of information or increase in storage.
  if (charset !== oFF.XCharset.UTF8 && charset !== oFF.XCharset.USASCII) {
    throw oFF.XException.createRuntimeException("Unsupported charset");
  }
  const encoder = new TextEncoder(); //always uses 'UTF-8'
  const array = encoder.encode(value);
  return new oFF.XByteArray(array);
};
oFF.XByteArray.convertToString = function(byteArray) {
   return oFF.XByteArray.convertToStringWithCharset(byteArray, oFF.XCharset.UTF8);
};
oFF.XByteArray.convertToStringWithCharset = function(byteArray, charset) {
   //US-ASCII strings can be encoded and decoded using UTF-8 without any loss of information or increase in storage.
  if (charset !== oFF.XCharset.UTF8 && charset !== oFF.XCharset.USASCII) {
    throw oFF.XException.createRuntimeException("Unsupported charset");
  }
  const decoder = new TextDecoder('UTF-8');
  const array = byteArray.getNative();
  return decoder.decode(array);
};
oFF.XByteArray.isEqual = function(firstValue, secondValue) {
   return firstValue === secondValue;
};
oFF.XByteArray.prototype.releaseObject = function() {
   this.m_nativeByteArray = null;
  oFF.XObject.prototype.releaseObject.call(this);
};
oFF.XByteArray.prototype.size = function() {
   if (this.m_nativeByteArray === null) {
    return 0;
  }
  return this.m_nativeByteArray.length;
};
oFF.XByteArray.prototype.getByteAt = function(index) {
   return this.m_nativeByteArray[index];
};
oFF.XByteArray.prototype.setByteAt = function(index, value) {
   this.m_nativeByteArray[index] = value;
};
oFF.XByteArray.prototype.getNative = function() {
   return this.m_nativeByteArray;
};
oFF.XByteArray.prototype.setNative = function(nativeByteArrayObject) {
   this.m_nativeByteArray = nativeByteArrayObject;
};
oFF.XByteArray.prototype.resetValue = oFF.XObject.noSupport;
oFF.XByteArray.prototype.toString = oFF.XObject.noSupport;

oFF.XMath ={
    isNaN: function(value) {
               //isNaN does an implicit Number(value) which will convert null to 0.
        if(value === null || value === undefined)
        {
            return true;
        }
        return isNaN(value);
    },
    abs: function(value) {
               return Math.abs(value);
    },
    mod: function(i1, i2) {
               if (i2 === 0)
        {
            throw new Error("Illegal Argument: division by 0");
        }
        if (i1 === 0)
        {
            return 0;
        }
        return i1 % i2;
    },
    longMod: function(l1, l2) {
               return oFF.XMath.mod(l1,l2);
    },
    doubleMod: function(d1, d2) {
               return oFF.XMath.mod(d1,d2);
    },
    div: function(i1, i2) {
               if (i2 === 0)
        {
            throw new Error("Illegal Argument: division by 0");
        }
        if (i1 === 0)
        {
            return 0;
        }

        //Basically XOR. If only one of the values is negative we round up, else we round down
        if(i1 < 0 !== i2 < 0) {
            return Math.ceil(i1/i2);
        }
        return Math.floor(i1/i2);
    },
    longDiv: function(i1, i2) {
               if (i2 === 0)
        {
            throw new Error("Illegal Argument: division by 0");
        }
        if (i1 === 0)
        {
            return 0;
        }

        //Basically XOR. If only one of the values is negative we round up, else we round down
        if(i1 < 0 !== i2 < 0) {
            return Math.ceil(i1/i2);
        }
        return Math.floor(i1/i2);
    },
    binaryAnd: function(value1, value2) {
               return value1 & value2;
    },
    binaryOr: function(value1, value2) {
               return value1 | value2;
    },
    binaryXOr: function(value1, value2) {
               return value1 ^ value2;
    },
    min: function(firstInteger, secondInteger) {
               if (firstInteger > secondInteger)
        {
            return secondInteger;
        }
        return firstInteger;
    },
    minDouble: function(firstDouble, secondDouble) {
               if (firstDouble > secondDouble)
        {
            return secondDouble;
        }
        return firstDouble;
    },
    max: function(firstInteger, secondInteger) {
               if (firstInteger > secondInteger)
        {
            return firstInteger;
        }
        return secondInteger;
    },
    maxDouble: function(firstDouble, secondDouble) {
               if (firstDouble > secondDouble)
        {
            return firstDouble;
        }
        return secondDouble;
    },
    clamp: function(lowerBound, upperBound, value) {
               var xMath = oFF.XMath;
        var lowerBoundary = xMath.min(lowerBound, upperBound);
        var upperBoundary = xMath.max(lowerBound, upperBound);
        return xMath.max(lowerBoundary, xMath.min(value, upperBoundary));
    },
    pow: function(a, b)
    {
               return Math.pow(a, b);
    },
    random: function(upperBound)
    {
               return Math.floor(Math.random()*upperBound);
    },
    round: function(doubleValue, decPlaces) {
               var pow_10 = Math.pow(10, decPlaces);
        return Math.round(doubleValue * pow_10) / pow_10;
    },
	// Rounds a number up to the next largest integer.
	ceil: function(doubleValue) {
               return Math.ceil(doubleValue);
    },
    // Returns the floating-point number adjacent to the first argument in the direction of the second argument. If both arguments compare as equal the second argument is returned.
    nextAfter: function (value, dir) {
        if (value === dir) {
            return dir;
        }
        if (value < dir) {
            return nextUp(value);
        }
        return -nextUp(-value);
    },
    // Returns the square root of the value
    sqrt: function( value ) {
        return Math.sqrt(value);
    },
    // Returns the logarithm base e of the value
    log: function( value ) {
        return Math.log(value);
    },
    //Returns the log to the base 10 of the value
    log10: function( value ){
        return Math.log10(value);
    },
    // Returns the input number truncated
    trunc: function( value ) {
        return Math.trunc(value);
    },
    // Rounds a number down to the next smallest integer
    floor: function( value ) {
        return Math.floor(value);
    }
};

const EPSILON = Math.pow(2, -52);
const MAX_VALUE = (2 - EPSILON) * Math.pow(2, 1023);
const MIN_VALUE = Math.pow(2, -1022);

function nextUp(x) {
    if (x !== x) {
        return x;
    }
    if (x === -1 / 0) {
        return -MAX_VALUE;
    }
    if (x === +1 / 0) {
        return +1 / 0;
    }
    if (x === +MAX_VALUE) {
        return +1 / 0;
    }
    var y = x * (x < 0 ? 1 - EPSILON / 2 : 1 + EPSILON);
    if (y === x) {
        y = MIN_VALUE * EPSILON > 0 ? x + MIN_VALUE * EPSILON : x + MIN_VALUE;
    }
    if (y === +1 / 0) {
        y = +MAX_VALUE;
    }
    var b = x + (y - x) / 2;
    if (x < b && b < y) {
        y = b;
    }
    var c = (y + x) / 2;
    if (x < c && c < y) {
        y = c;
    }
    return y === 0 ? -0 : y;
};


oFF.XResources = {
    moduleMapping: {},
    resources: {},
    loadString: function(resourceName) {
        const resource = oFF.XResources.resources[resourceName];
        if (resource) {
            return atob(resource);
        }
        return null;
    },
    exists: function(resourceName) {
        return oFF.XResources.resources[resourceName] !== undefined;
    },
    register: function(resource) {
        const resourceClass = oFF.XResources.moduleMapping[resource];
        if (resourceClass) {
            Object.keys(resourceClass).forEach(key => {
                if(!key.startsWith("PATH_")){
                    oFF.XResources.resources["/"+resourceClass["PATH_"+key]] = resourceClass[key];
                }

            });
        }
    },
    registerResourceClass: function(moduleName, resourceClass) {
        oFF.XResources.moduleMapping[moduleName] = resourceClass;
    },

    listResources(resourcePath ){
        if(!resourcePath.endsWith("/")){
            resourcePath = resourcePath+"/";
        }
        return Object.keys(oFF.XResources.resources)
            .filter(key => key.startsWith(resourcePath))
            .map(key => key.replace(resourcePath, ""));
    }
}

oFF.env = oFF.env || {};

oFF.XTimeUtils = 
{
    getSystemTimezoneOffsetInMilliseconds: function () 
    {
               return new Date().getTimezoneOffset() * 60 * 1000 * -1;
    },
    
    getCurrentTimeInMilliseconds: function () 
    {
               // number of milliseconds since 1 January 1970 00:00:00 UTC
        return new Date().getTime();
    },
    
    waitMillis: function (waitTimeInMillis) 
    {
       
        if (waitTimeInMillis < 0) 
        {
            throw new Error("Illegal Argument: illegal wait time");
        }

        const startTime = this.getCurrentTimeInMilliseconds();
        let currentTime = startTime;
        
        while (currentTime - startTime < waitTimeInMillis) 
        {
            currentTime = this.getCurrentTimeInMilliseconds();
        }
    },
    
    now: function () 
    {
               // high resolution timestamp in milliseconds
        return performance.now();
    }
};


return oFF;
} );