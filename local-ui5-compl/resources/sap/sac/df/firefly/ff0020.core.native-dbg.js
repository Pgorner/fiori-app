/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff0010.core"
],
function(oFF)
{
"use strict";
Object.keys = Object.keys || (function () {
       var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
        DontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        DontEnumsLength = DontEnums.length;

    return function (o) {
        if (typeof o !== "object" && typeof o !== "function" || o === null) {
            throw new TypeError("Object.keys called on a non-object");
        }

        var result = [];

        for (var name in o)
        {
            if (hasOwnProperty.call(o, name)) {
                result.push(name);
            }
        }

        if (hasDontEnumBug)
        {
            for (var i = 0; i < DontEnumsLength; i++)
            {
                if (hasOwnProperty.call(o, DontEnums[i])) {
                    result.push(DontEnums[i]);
                }
            }
        }

        return result;
    };
})();
oFF.XArrayWrapper = function(copy) {
       if(copy) {
        this.m_list = copy.slice();
    }
    else {
        this.m_list = [];
    }
};

oFF.XArrayWrapper.prototype = new oFF.DfAbstractArray();

oFF.XArrayWrapper.prototype.releaseObject = function() {
    this.m_list = null;
    oFF.XObject.prototype.releaseObject.call(this);
};

oFF.XArrayWrapper.prototype.size = function() {
       return this.m_list.length;
};
Object.defineProperty(oFF.XArrayWrapper.prototype, "length", {
    get: function() {
        return this.m_list.length;
    }
});

oFF.XArrayWrapper.prototype.isEmpty = function() {
       return this.m_list.length === 0;
};

oFF.XArrayWrapper.prototype.hasElements = function() {
       return this.m_list.length !== 0;
};

oFF.XArrayWrapper.prototype.toString = function() {
       return "[" + this.m_list.join(",") + "]";
};

oFF.XArrayWrapper.prototype.set = function(index, element) {
       if(index < 0 || index >= this.m_list.length) {
        throw new Error("Illegal Argument: illegal index");
    }
    this.m_list[index] = element;
};

oFF.XArrayWrapper.prototype.get = function(index) {
       if(index < 0 || index >= this.m_list.length) {
        throw new Error("Illegal Argument: illegal index");
    }
    return this.m_list[index];
};

oFF.XArrayWrapper.prototype.createArrayCopy = function() {
       return new oFF.XArray(-1, this.m_list);
};

/** Used by Orca. */
oFF.XArrayWrapper.prototype.getListFromImplementation = function() {
       return this.m_list;
};

//redirect Array methods
//Array.prototype is not Enumerable so we have to do it manually
oFF.XArrayWrapper.prototype.concat = function() {
       return this.m_list.concat.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.copyWithin = function() {
       return this.m_list.copyWithin.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.entries = function() {
       return this.m_list.entries.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.every = function() {
       return this.m_list.every.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.fill = function() {
       return this.m_list.fill.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.filter = function() {
       return this.m_list.filter.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.find = function() {
       return this.m_list.find.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.findIndex = function() {
       return this.m_list.findIndex.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.forEach = function() {
       return this.m_list.forEach.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.includes = function() {
       return this.m_list.includes.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.indexOf = function() {
       return this.m_list.indexOf.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.map = function() {
       return this.m_list.map.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.pop = function() {
       return this.m_list.pop.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.push = function() {
       return this.m_list.push.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.reduce = function() {
       return this.m_list.reduce.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.reduceRight = function() {
       return this.m_list.reduceRight.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.reverse = function() {
       return this.m_list.reverse.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.shift = function() {
       return this.m_list.shift.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.slice = function() {
       return this.m_list.slice.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.some = function() {
       return this.m_list.some.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.sort = function() {
       return this.m_list.sort.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.splice = function() {
       return this.m_list.splice.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.toLocaleString = function() {
       return this.m_list.toLocaleString.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.unshift = function() {
       return this.m_list.unshift.apply(this.m_list, arguments);
};
oFF.XArrayWrapper.prototype.values = function() {
       return this.m_list.values.apply(this.m_list, arguments);
};
oFF.QueuedCallbackProcessorHandle = function(nativeCallback, isErrorCallback) {
       if (nativeCallback === null)
    {
        throw new Error("Illegal State: illegal native callback");
    }
    this.m_nativeCallback = nativeCallback;
    this.m_isErrorCallback = isErrorCallback;
    this._ff_c = "QueuedCallbackProcessorHandle";
};
oFF.QueuedCallbackProcessorHandle.prototype = {
    releaseObject: function()
    {
               this.m_nativeCallback = null;
        oFF.QueuedCallbackProcessorHandle.$superclass.releaseObject.call(this);
    },

    processCallback: function()
    {
               this.m_nativeCallback();
    },

    isErrorCallback: function()
    {
               return this.m_isErrorCallback;
    }
};
oFF.QueuedCallbackProcessorHandle.create = function(nativeCallback, isErrorCallback) {
       return new oFF.QueuedCallbackProcessorHandle(nativeCallback, isErrorCallback);
};

oFF.XHashMapByString = function() {
       oFF.DfAbstractMapByString.call(this);
    this._ff_c = "XHashMapByString";
    this.m_native = {};
};

oFF.XHashMapByString.prototype = new oFF.DfAbstractMapByString();

oFF.XHashMapByString.create = function()
{
       return new oFF.XHashMapByString();
};

oFF.XHashMapByString.createWithMap = function(map)
{
       if(!map){
		return oFF.XHashMapByString.create();
	}
    return map.createMapByStringCopy();
};

oFF.XHashMapByString.prototype.createMapByStringCopy = function()
{
       var hashMap = new oFF.XHashMapByString();
    hashMap.m_native = this.createMapCopyInternal();
    return hashMap;
};

oFF.XHashMapByString.prototype.releaseObject = function() {
       this.m_native = null;
    oFF.DfAbstractKeyBagOfString.prototype.releaseObject.call(this);
};

oFF.XHashMapByString.prototype.createMapCopyInternal = function()
{
       var newMap = {};
    for(var prop in this.m_native) {
        if(this.m_native.hasOwnProperty(prop)) {
            newMap[prop] = this.m_native[prop];
        }
    }

    return newMap;
};

oFF.XHashMapByString.prototype.clear = function()
{
       this.m_native = {};
};

oFF.XHashMapByString.prototype.size = function()
{
       return Object.keys(this.m_native).length;
};

oFF.XHashMapByString.prototype.hasElements = function()
{
       //http://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
    //faster than Object.keys(this.m_native).length !== 0;
    for(var key in this.m_native) {
        if(this.m_native.hasOwnProperty(key)) {
            return true;
        }
    }
    return false;
};

/*
oFF.XHashMapByString.prototype.isEqualTo = function(other) {
       if(other === null) {
        return false;
    }
    if(this === other) {
        return true;
    }

    for(var thisKey in this.m_native) {
        if(this.m_native.hasOwnProperty(thisKey)) {
            //compare keys
            if(other.m_native.hasOwnProperty(thisKey) === false) {
                return false;
            }

            var thisValue = this.m_native[thisKey];
            var thatValue = other.m_native[thisKey];

            //compare values
            if(thisValue !== thatValue) {
                if(thisValue === null) {
                    return false;
                }
                if(thisValue.isEqualTo(thatValue) === false) {
                    return false;
                }
            }
        }
    }
    for(var thatKey in other.m_native) {
        if(other.m_native.hasOwnProperty(thatKey)) {
            //compare keys
            if(this.m_native.hasOwnProperty(thatKey) === false) {
                return false;
            }
        }
    }
    return true;
};
*/

oFF.XHashMapByString.prototype.containsKey = function(key)
{
       if(key === null || key === undefined) {
        return false;
    }

    return this.m_native.hasOwnProperty(key);
};

oFF.XHashMapByString.prototype.contains = function(value)
{
           for(var key in this.m_native) {
        if(this.m_native.hasOwnProperty(key)) {
            var element = this.m_native[key];
            if(oFF.XObject.areObjectsEqual(element, value)) {
                return true;
            }
        }
    }

    return false;
    //return Object.values(this.m_native).indexOf(value) > -1;  // breaks PrStructure tests, but is potentially more faster, investigate?
};

oFF.XHashMapByString.prototype.getByKey = function(key)
{
       var value = this.m_native[key];
    if(value === undefined) {
        return null;
    }
    return value;
};

/*
oFF.XHashMapByString.prototype.putIfNotNull = function(key, element)
{
       if(element !== null && element !== undefined) {
        this.put(key, element);
    }
};
*/

oFF.XHashMapByString.prototype.put = function(key, value)
{
       if(key === null || key === undefined) {
        throw new Error("Illegal Argument: Key is null");
    }

    this.m_native[key] = value;
};

oFF.XHashMapByString.prototype.remove = function(key)
{
       if(key !== null && key !== undefined) {
        var element = this.m_native[key];
        delete this.m_native[key];
        return element === undefined ? null: element;
    }
    return null;
};

oFF.XHashMapByString.prototype.getKeysAsReadOnlyList = function()
{
       var list = new oFF.XList();
    
    for(var key in this.m_native) 
    {
        if(this.m_native.hasOwnProperty(key)) 
        {
            list.add(key);
        }
    }
    
	// ensure deterministic order for reproduceability
	list.sortByDirection( oFF.XSortDirection.ASCENDING );
    
    return list;
};

oFF.XHashMapByString.prototype.getValuesAsReadOnlyList = function()
{
       var list = new oFF.XList();
    for(var key in this.m_native) {
        if(this.m_native.hasOwnProperty(key)) {
            list.add(this.m_native[key]);
        }
    }
    return list;
};

/*
oFF.XHashMapByString.prototype.getIterator = function()
{
       return new oFF.XIterator(this.getValuesAsReadOnlyList());
};
*/

/** Used by Orca. */
oFF.XHashMapByString.prototype.getMapFromImplementation = function()
{
       return this.m_native;
};

oFF.XHashMapByString.prototype.toString = function()
{
       return JSON.stringify(this.m_native);
};

oFF.XHashSetOfString = function() {
       oFF.DfAbstractKeyBagOfString.call(this);
    this.m_native = {};
    this._ff_c = "XHashSetOfString";
};
oFF.XHashSetOfString.prototype = new oFF.DfAbstractSetOfString();

oFF.XHashSetOfString.create = function()
{
       return new oFF.XHashSetOfString();
};

oFF.XHashSetOfString.prototype.createSetOfStringCopy = function() {
       var hashSet = new oFF.XHashSetOfString();
    for(var key in this.m_native) {
        if(this.m_native.hasOwnProperty(key)) {
            hashSet.m_native[key] = this.m_native[key];
        }
    }
    return hashSet;
};

oFF.XHashSetOfString.prototype.releaseObject = function() {
       this.m_native = null;
    oFF.XObject.prototype.releaseObject.call(this);
};

oFF.XHashSetOfString.prototype.clear = function()
{
       for (var key in this.m_native) {
        if (this.m_native.hasOwnProperty(key)) {
            delete this.m_native[key];
        }
    }
};

oFF.XHashSetOfString.prototype.size = function()
{
       return Object.keys(this.m_native).length;
};

oFF.XHashSetOfString.prototype.hasElements = function()
{
       //http://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
    //faster than Object.keys(this.m_native).length !== 0;
    
    for(var key in this.m_native) 
    {
        if(this.m_native.hasOwnProperty(key)) 
        {
            return true;
        }
    }
    
    return false;
};

oFF.XHashSetOfString.prototype.contains = function(key)
{
       if (key === null) {
        return false;
    }

    return this.m_native.hasOwnProperty(key);
};

oFF.XHashSetOfString.prototype.add = function(key)
{
       if (key === null) {
        throw oFF.XException.createIllegalArgumentException("XHashSetOfString doesn't support null values");
    }

    this.m_native[key] = true;
};

oFF.XHashSetOfString.prototype.removeElement = function(key)
{
       if (key !== null)
    {
        delete this.m_native[key];
    }
    return key;
};

oFF.XHashSetOfString.prototype.getValuesAsReadOnlyList = function()
{
       var list = new oFF.XList();

    for(var key in this.m_native)
    {
        if(this.m_native.hasOwnProperty(key))
        {
            list.add(key);
        }
    }

	// ensure deterministic order for reproduceability
	list.sortByDirection( oFF.XSortDirection.ASCENDING );
    return list;
};


oFF.XHashSetOfString.prototype.toString = function()
{
       return this.m_native.toString();
};

oFF.XIterator = function(list) {
       this.m_readOnlyValues = list;
    this.m_position = -1;
    this._ff_c = "XIterator";
};
oFF.XIterator.prototype = new oFF.XObject();

oFF.XIterator.createFromList = function(list)
{
       return new oFF.XIterator(list);
};

oFF.XIterator.prototype.releaseObject = function()
{
       this.m_readOnlyValues = null;
    this.m_position = null;
    oFF.XObject.prototype.releaseObject.call(this);
};

oFF.XIterator.prototype.hasNext = function()
{
       return this.m_position + 1 < this.m_readOnlyValues.size();
};

oFF.XIterator.prototype.next = function()
{
       return this.m_readOnlyValues.get(++this.m_position);
};

oFF.XList = function( copy )
{
	oFF.XArrayWrapper.call( this, copy );
	this._ff_c = "XList";
};
oFF.XList.prototype = new oFF.XArrayWrapper();

oFF.XList.create = function()
{
	return new oFF.XList();
};


oFF.XList.createWithNativeList = function( list )
{
	if( list == null )
	{
		return null;
	}
	// check if list is an array


	if(!Array.isArray(list)){
		throw oFF.XException.createIllegalArgumentException("createWithNativeList parameter must be an array");
	}
	return new oFF.XList(list);
};

oFF.XList.createWithList = function(list) {
       if(!list){
		return oFF.XList.create();
	}
    return list.createListCopy();
};

oFF.XList.nativeSort = function( o1, o2 )
{
	if( o1 == null|| o2 == null )
	{
		throw new Error( "cannot compare null" );
	}

	if( o1.compareTo && o2.compareTo )
	{
		return o1.compareTo( o2 );
	}
	else if( oFF.XString.isString(o1) && oFF.XString.isString(o2) )
	{
		// for string sorting, prioritize uppercase strings first (default .sort() works like that)
	    if( o1 < o2 ) return -1;
	    if( o1 > o2 ) return 1;
	    return 0;
	}
	
	return String(o1).localeCompare(String(o2));
};


oFF.XList.nativeSortAscending = function( a, b )
{
	return oFF.XList.nativeSort(a,b);
};

oFF.XList.nativeSortDescending = function( a, b )
{
	return oFF.XList.nativeSort(b,a);
};

oFF.XList.prototype.createListCopy = function()
{
	return new oFF.XList( this.m_list );
};

oFF.XList.prototype.sublist = function( beginIndex, endIndex )
{
	var end = endIndex === -1 ? this.m_list.length : endIndex;
	return new oFF.XList( this.m_list.slice( beginIndex, end ) );
};

oFF.XList.prototype.addAll = function( elements )
{
	 oFF.XListUtils.addAllObjects( elements, this );
};

oFF.XList.prototype.add = function( oElement )
{
	this.m_list[this.m_list.length] = oElement;
};

oFF.XList.prototype.isEqualTo = function( other )
{
	if( other === null )
	{
		return false;
	}

	if( this === other )
	{
		return true;
	}

	var size = this.m_list.length;
	if( size !== other.m_list.length )
	{
		return false;
	}

	var thisEntry, thatEntry;
	for( var idx = 0; idx < size; idx++ )
	{
		thisEntry = this.m_list[idx];
		thatEntry = other.m_list[idx];

		if( !oFF.XObject.areObjectsEqual( thisEntry, thatEntry ) )
		{
			return false;
		}
	}

	return true;
};

oFF.XList.prototype.insert = function( index, element )
{
	var i = this.m_list.length;
	if( index < 0 || index > i )
	{
		throw new Error( "Illegal Argument: illegal index" );
	}

	// Be somewhat splice compliant, Orca is passing null
	index = index || 0;

	// shift right after index
	while (i > index)
	{
		this.m_list[i] = this.m_list[--i];
	}
	this.m_list[index] = element;
};

oFF.XList.prototype.clear = function()
{
	this.m_list.length = 0;
};

oFF.XList.prototype.getIndex = function( element )
{
	return oFF.XListUtils.getIndexOf( this, element );
};

oFF.XList.prototype.contains = function( element )
{
	var len = this.m_list.length;
	var i;
	var thisElement;

	for( i = 0; i < len; i++ )
	{
		thisElement = this.m_list[i];

		if( oFF.XObject.areObjectsEqual( thisElement, element ) )
		{
			return true;
		}
	}

	return false;
};

oFF.XList.prototype.moveElement = function( fromIndex, toIndex )
{
	var size = this.m_list.length;
	if( fromIndex < 0 || fromIndex >= size )
	{
		throw new Error( "Illegal Argument: illegal fromIndex" );
	}
	if( toIndex < 0 || toIndex >= size )
	{
		throw new Error( "Illegal Argument: illegal toIndex" );
	}
	if( toIndex !== fromIndex )
	{
		// Be somewhat splice compliant, Orca is passing null
		fromIndex = fromIndex || 0;
		toIndex = toIndex || 0;
		var oElement = this.m_list[fromIndex];
		// shift left after FromIndex
		while (fromIndex < size)
		{
			this.m_list[fromIndex] = this.m_list[++fromIndex];
		}

		--size;
		// shift right after toIndex
		while (size > toIndex)
		{
			this.m_list[size] = this.m_list[--size];
		}
		this.m_list[toIndex] = oElement;
	}
};

oFF.XList.prototype.removeAt = function( index )
{
	var size = this.m_list.length;
	if( index < 0 || index >= size )
	{
		throw new Error( "Illegal Argument: illegal index" );
	}

	// Be somewhat splice compliant, Orca is passing null
	index = index || 0;
	var oElement = this.m_list[index];
	// shift left after index
	while (index < size)
	{
		this.m_list[index] = this.m_list[++index];
	}
	--this.m_list.length;

	return oElement;
};

oFF.XList.prototype.removeElement = function( element )
{
	var i;
	var len = this.m_list.length;
	var thisElement;

	// iterate to the position of the element
	for( i = 0; i < len; i++ )
	{
		thisElement = this.m_list[i];

		if( oFF.XObject.areObjectsEqual( thisElement, element ) )
		{
			break;
		}
	}

	// if we found the element shift left after its position
	if( i < len )
	{
		while (i < len)
		{
			this.m_list[i] = this.m_list[++i];
		}

		--this.m_list.length;
	}

	return element;
};

oFF.XList.prototype.getIterator = function()
{
	return new oFF.XIterator( this );
};

oFF.XList.prototype.getValuesAsReadOnlyList = function()
{
	return this;
};

oFF.XList.prototype.sortByDirection = function( sortDirection )
{
	var oFirefly = oFF;
	if( sortDirection === oFirefly.XSortDirection.ASCENDING )
	{
		this.m_list.sort( oFirefly.XList.nativeSortAscending );
	}
	else if( sortDirection === oFirefly.XSortDirection.DESCENDING )
	{
		this.m_list.sort( oFirefly.XList.nativeSortDescending );
	}
	else
	{
		throw new Error( "Illegal Argument: illegal sort direction" );
	}
};

oFF.XList.prototype.sortByComparator = function( sortComparator )
{
	this.m_list.sort( function( a, b )
	{
		return sortComparator.compare( a, b );
	} );
};

oFF.XList.prototype.toString = function()
{
	return "[" + this.m_list.join( ", " ) + "]";
};

oFF.XArray = function(size, copy) {
       this._ff_c = "XArray";
    oFF.XArrayWrapper.call(this, copy);
    var i;
    if(copy === undefined && size)
    {
        this.m_list.length = size;
        for(i = 0; i < size; i++)
        {
            this.m_list[i] = null;
        }
    }
};

oFF.XArray.prototype = new oFF.XArrayWrapper();

oFF.XArray.create = function(size) {
       return new oFF.XArray(size);
};

oFF.XArray.prototype.assertIndexIsValid = function(index) {
       if(index >= this.m_list.length)
    {
        throw new Error("Illegal Argument: Index exceeds size of this array");
    }
};

oFF.XArray.prototype.clear = function() {
       var len = this.m_list.length;
    var i;

    for(i = 0; i < len; i++)
    {
        this.m_list[i] = null;
    }
};

oFF.XArrayOfInt = function(size, copy) {
       oFF.XArray.call(this, size, copy);
    this._ff_c = "XArrayOfInt";
    var i;
    if(copy === undefined && size)
    {
        this.m_list.length = size;
        for(i = 0; i < size; i++)
        {
            this.m_list[i] = 0;
        }
    }
};
oFF.XArrayOfInt.prototype = new oFF.XArray();

oFF.XArrayOfInt.create = function(size) {
       return new oFF.XArrayOfInt(size);
};

oFF.XArrayOfInt.prototype.clear = function()
{
       var len = this.m_list.length;
    var i;
    for(i = 0; i < len; i++)
    {
        this.m_list[i] = 0;
    }
};

oFF.XArrayOfInt.prototype.copyFromExt = function(source, sourceIndex, destinationIndex, length)
{
       if(sourceIndex < 0 || destinationIndex < 0 || length < 0)
    {
        throw new Error("Illegal Argument: Index must be >= 0");
    }

    if(destinationIndex + length > this.m_list.length)
    {
        throw new Error("Illegal Argument: DestinationIndex will exceed size of this array");
    }

    if(sourceIndex + length > source.m_list.length)
    {
        throw new Error("Illegal Argument: SourceIndex will exceed size of source array");
    }
    var i;
    for(i = 0; i < length; i++)
    {
        this.m_list[i + destinationIndex] = source.m_list[i + sourceIndex];
    }
};

oFF.XArrayOfInt.prototype.clone = function()
{
       return new oFF.XArrayOfInt(-1, this.m_list);
};

oFF.XArrayOfInt.prototype.createCopyByIndex = function(sourceIndex, length)
{
       var copy = new oFF.XArrayOfInt(length);
    copy.copyFromExt(this, sourceIndex, 0, length);
    return copy;
};

oFF.PlatformModule = function() 
{
       oFF.DfModule.call(this);
    this._ff_c = "PlatformModule";
};

oFF.PlatformModule.prototype = new oFF.DfModule();

oFF.PlatformModule.s_module = null;

oFF.PlatformModule.getInstance = function() 
{
       if ( oFF.PlatformModule.s_module === null)
    {
        if ( oFF.CoreModule.getInstance() === null)
        {
            throw new Error("Initialization Exception");
        }

		oFF.PlatformModule.s_module = oFF.DfModule.startExt(new oFF.PlatformModule());
		
        oFF.XLanguage.setLanguage(oFF.XLanguage.JAVASCRIPT);
        oFF.XPlatform.setPlatform(oFF.XPlatform.BROWSER);
        oFF.XSyncEnv.setSyncEnv( oFF.XSyncEnv.EXTERNAL_MAIN_LOOP);

		oFF.DfModule.stopExt(oFF.PlatformModule.s_module);
    }

    return  oFF.PlatformModule.s_module;
};

oFF.PlatformModule.prototype.getName = function()
{
	return "ff0020.core.native";
};

oFF.PlatformModule.getInstance();


return oFF;
} );