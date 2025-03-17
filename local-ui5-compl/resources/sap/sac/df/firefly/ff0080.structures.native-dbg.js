/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff0070.structures"
],
function(oFF)
{
"use strict";
oFF.NativeJsonParser = function() {
       oFF.DfDocumentParser.call(this);
    this._ff_c = "NativeJsonParser";
    this.setup();
};
oFF.NativeJsonParser.prototype = new oFF.DfDocumentParser();

oFF.NativeJsonParser.prototype.parseUnsafe = function(content)
{
       this.clearMessages();

    if(content === null || content === undefined)
    {
        return null;
    }

    return new oFF.NativeJsonProxyElement(JSON.parse(content));
};

oFF.NativeJsonParser.prototype.parse = function(content)
{
       var jsonRootElement;
    this.clearMessages();

    if(content === null)
    {
        return null;
    }

    //Remove BOM
    var regExpBom = /^\uFEFF?|\u200B?/;
    if(regExpBom.test(content)) {
        content = content.replace(regExpBom, "");
    }
    try
    {
        jsonRootElement = JSON.parse(content);
    }
    catch(e)
    {
        this.addError(oFF.JsonParserErrorCode.JSON_PARSER_ROOT_ERROR, e.message);
        return null;
    }

    if(jsonRootElement === undefined)
    {
        return null;
    }

    return new oFF.NativeJsonProxyElement(jsonRootElement);
};

oFF.NativeJsonParser.prototype.convertFromNative = function(jsonRootElement)
{
       var ocpRootElement;
    this.clearMessages();

    if(jsonRootElement === null || jsonRootElement === undefined)
    {
        return null;
    }
    try
    {
        ocpRootElement = new oFF.NativeJsonProxyElement(jsonRootElement);
    }
    catch(e)
    {
        this.addError(oFF.JsonParserErrorCode.JSON_PARSER_ROOT_ERROR, e.message);
        return null;
    }

    return ocpRootElement;
};

oFF.NativeJsonParser.prototype.convertToNative = function(jsonRootElement)
{
       this.clearMessages();

    if(jsonRootElement === null || jsonRootElement === undefined)
    {
        return null;
    }
    else
    {
	    try
	    {
			var jsonString = oFF.PrUtils.serialize( jsonRootElement, false, false, 0 );
			var nativeModel = JSON.parse( jsonString );
			return nativeModel;
	    }
	    catch(e)
	    {
	        this.addError(oFF.JsonParserErrorCode.JSON_PARSER_ROOT_ERROR, e.message);
	        return null;
	    }
	}
};

oFF.NativeJsonParserFactory = function() {
       oFF.JsonParserFactory.call(this);
    this._ff_c = "NativeJsonParserFactory";
};
oFF.NativeJsonParserFactory.prototype = new oFF.JsonParserFactory();

oFF.NativeJsonParserFactory.staticSetup = function()
{
       oFF.JsonParserFactory.setJsonParserFactory(new oFF.NativeJsonParserFactory());
};

oFF.NativeJsonParserFactory.prototype.newParserInstance = function()
{
       return new oFF.NativeJsonParser();
};

oFF.NativeJsonProxyElement = function (jsonRootElement) {
       oFF.DfPrProxyElement.call(this);
    this.m_jsonRootElement = jsonRootElement;
    this._ff_c = "NativeJsonProxyElement";
};

oFF.NativeJsonProxyElement.prototype = new oFF.DfPrProxyElement();

oFF.NativeJsonProxyElement.prototype.releaseObject = function () {
       this.m_jsonRootElement = null;
    oFF.DfPrProxyElement.prototype.releaseObject.call(this);
};

oFF.NativeJsonProxyElement.prototype.put = function (name, element) {
       if (element === null) {
        delete this.m_jsonRootElement[name];
    }
    else {
        this.m_jsonRootElement[name] = element;
    }
};

oFF.NativeJsonProxyElement.prototype.insert = function (index, element) {
       if (Array.isArray(this.m_jsonRootElement)) {
        this.m_jsonRootElement.splice(index, 0, element);
    }
}

oFF.NativeJsonProxyElement.prototype.put;

oFF.NativeJsonProxyElement.prototype.getIndex = function ( _element ){
       for (var index = 0; index < this.m_jsonRootElement.length; index++) {
        var element = this.getByKey(index);
        if ( element === _element || (element !== null && element.isEqualTo(_element))) {
            return index;
        }
    }
    return -1;
};

oFF.NativeJsonProxyElement.prototype.getKeyInternal = function (_element ){
       if(Array.isArray(this.m_jsonRootElement)) {
        var index = this.getIndex(_element);
        if(index>-1) {
            return index;
        }
        return null;
    }
    for (var attributeName in this.m_jsonRootElement) {
        if (this.m_jsonRootElement.hasOwnProperty(attributeName)) {
            var element = this.getByKey(attributeName);
            if(element === _element || (element !== null && element.isEqualTo(_element))) {
                return attributeName;
            }
        }
    }
    return null;
};

oFF.NativeJsonProxyElement.prototype.putNotNullAndNotEmpty = function (name, element) {
       if (oFF.isNull(element) || element.isList() && element.asList().isEmpty() || element.isStructure() && element.asStructure().isEmpty() || element.isString() && oFF.XStringUtils.isNullOrEmpty(element.asString().getString())) {
        return;
    }
    this.put(name, element);
};

oFF.NativeJsonProxyElement.prototype.remove = function (key) {
       var valueNative = this.m_jsonRootElement[key];

    if (valueNative !== undefined) {
        var element = this.getByKey(key);
        if( typeof key === "number" && Array.isArray(this.m_jsonRootElement)) {
            this.m_jsonRootElement.splice(key, 1);
        }
        else {
            delete this.m_jsonRootElement[key];
        }
        return element;
    }
    return null;
};

oFF.NativeJsonProxyElement.prototype.removeAt = oFF.NativeJsonProxyElement.prototype.remove;

oFF.NativeJsonProxyElement.prototype.removeElement = function (value) {
       var key = this.getKeyInternal(value);
    if (key !== null){
        this.remove(key);
    }
    return value;
};

oFF.NativeJsonProxyElement.prototype.getPermaCopy = function () {
       return new oFF.NativeJsonProxyElement(this.m_jsonRootElement);
};

oFF.NativeJsonProxyElement.prototype.asString = function () {
       return this;
};
oFF.NativeJsonProxyElement.prototype.asNumber = oFF.NativeJsonProxyElement.prototype.asString;
oFF.NativeJsonProxyElement.prototype.asBoolean = oFF.NativeJsonProxyElement.prototype.asString;
oFF.NativeJsonProxyElement.prototype.asNull = oFF.NativeJsonProxyElement.prototype.asString;
oFF.NativeJsonProxyElement.prototype.asInteger = oFF.NativeJsonProxyElement.prototype.asString;
oFF.NativeJsonProxyElement.prototype.asLong = oFF.NativeJsonProxyElement.prototype.asString;
oFF.NativeJsonProxyElement.prototype.asDouble = oFF.NativeJsonProxyElement.prototype.asString;
oFF.NativeJsonProxyElement.prototype.asList = oFF.NativeJsonProxyElement.prototype.asString;
oFF.NativeJsonProxyElement.prototype.asStructure = oFF.NativeJsonProxyElement.prototype.asString;

oFF.NativeJsonProxyElement.prototype.putString = function (name, value) {
       this.m_jsonRootElement[name] = value;
};

oFF.NativeJsonProxyElement.prototype.setStringAt = oFF.NativeJsonProxyElement.prototype.putString;

oFF.NativeJsonProxyElement.prototype.putDouble = function (name, value) {
       if(typeof value === "number" ){
        this.m_jsonRootElement[name]=value;
    }
    else{
        this.m_jsonRootElement[name] = parseFloat(value);
    }
};

oFF.NativeJsonProxyElement.prototype.setDoubleAt = oFF.NativeJsonProxyElement.prototype.putDouble;

oFF.NativeJsonProxyElement.prototype.putBoolean = function(name, value){
       this.m_jsonRootElement[name] = (value === true)||(value === "true");
};

oFF.NativeJsonProxyElement.prototype.setBooleanAt = oFF.NativeJsonProxyElement.prototype.putBoolean;

oFF.NativeJsonProxyElement.prototype.putInteger = oFF.NativeJsonProxyElement.prototype.putDouble;
oFF.NativeJsonProxyElement.prototype.putLong = oFF.NativeJsonProxyElement.prototype.putDouble;

oFF.NativeJsonProxyElement.prototype.setIntegerAt = oFF.NativeJsonProxyElement.prototype.putDouble;
oFF.NativeJsonProxyElement.prototype.setLongAt = oFF.NativeJsonProxyElement.prototype.putDouble;

oFF.NativeJsonProxyElement.prototype.putNull = function (name) {
       this.m_jsonRootElement[name] = null;
};

oFF.NativeJsonProxyElement.prototype.setNullAt = oFF.NativeJsonProxyElement.prototype.putNull;

oFF.NativeJsonProxyElement.prototype.setNullByName = oFF.NativeJsonProxyElement.prototype.putNull;

oFF.NativeJsonProxyElement.prototype.set = function (position, element) {
       this.m_jsonRootElement[position] = element;
};

oFF.NativeJsonProxyElement.prototype.getType = function () {
       return this.getTypeOf(this.m_jsonRootElement);
};

oFF.NativeJsonProxyElement.prototype.hasElements = function () {
       return ! this.isEmpty();
};

oFF.NativeJsonProxyElement.prototype.getElementTypeByKey = function (name) {
       var element = this.m_jsonRootElement[name];
    return element === undefined ? null : this.getTypeOf(element);
};

oFF.NativeJsonProxyElement.prototype.getElementTypeAt = oFF.NativeJsonProxyElement.prototype.getElementTypeByKey;

oFF.NativeJsonProxyElement.prototype.getTypeOf = function (element) {
       if (element === null) {
        return oFF.PrElementType.THE_NULL;
    }

    switch (typeof element) {
        case "string":
            return oFF.PrElementType.STRING;

        case "boolean":
            return oFF.PrElementType.BOOLEAN;

        case "number":
            return oFF.PrElementType.DOUBLE;

        case "object":
            if (Array.isArray(element)) {
                return oFF.PrElementType.LIST;
            }
            if(element instanceof oFF.PrElement){
                return element.getType();
            }
            return oFF.PrElementType.STRUCTURE;

        default:
            return null;
    }
};

oFF.NativeJsonProxyElement.prototype.getString = function () {
   return typeof this.m_jsonRootElement == "string" ? this.m_jsonRootElement : null;
};

oFF.NativeJsonProxyElement.prototype.getDouble = function () {
       if (typeof this.m_jsonRootElement === "number") {
        return this.m_jsonRootElement;
    }
    return parseFloat(this.m_jsonRootElement);
};
oFF.NativeJsonProxyElement.prototype.getStringValue = oFF.NativeJsonProxyElement.prototype.getString;
oFF.NativeJsonProxyElement.prototype.getInteger = oFF.NativeJsonProxyElement.prototype.getDouble;
oFF.NativeJsonProxyElement.prototype.getIntegerValue = oFF.NativeJsonProxyElement.prototype.getDouble;
oFF.NativeJsonProxyElement.prototype.getLong = oFF.NativeJsonProxyElement.prototype.getDouble;
oFF.NativeJsonProxyElement.prototype.getLongValue = oFF.NativeJsonProxyElement.prototype.getDouble;
oFF.NativeJsonProxyElement.prototype.getDoubleValue = oFF.NativeJsonProxyElement.prototype.getDouble;
oFF.NativeJsonProxyElement.prototype.getBoolean = function() {
       return this.m_jsonRootElement === true || this.m_jsonRootElement === "true";
};
oFF.NativeJsonProxyElement.prototype.getBooleanValue = oFF.NativeJsonProxyElement.prototype.getBoolean;

oFF.NativeJsonProxyElement.prototype.setString = function (value) {
       this.m_jsonRootElement = value;
};

oFF.NativeJsonProxyElement.prototype.setDouble = function (value) {
       if(typeof this.m_jsonRootElement === "number"){
        this.m_jsonRootElement=value;
    }
    else{
        this.m_jsonRootElement = parseFloat(value);
    }
};
oFF.NativeJsonProxyElement.prototype.setInteger = oFF.NativeJsonProxyElement.prototype.setDouble;
oFF.NativeJsonProxyElement.prototype.setIntegerValue = oFF.NativeJsonProxyElement.prototype.setDouble;
oFF.NativeJsonProxyElement.prototype.setLong = oFF.NativeJsonProxyElement.prototype.setDouble;
oFF.NativeJsonProxyElement.prototype.setLongValue = oFF.NativeJsonProxyElement.prototype.setDouble;

oFF.NativeJsonProxyElement.prototype.setDoubleValue = oFF.NativeJsonProxyElement.prototype.setDouble;
oFF.NativeJsonProxyElement.prototype.setBoolean = function (value) {
       this.m_jsonRootElement = (value === true)||(value === "true");
};
oFF.NativeJsonProxyElement.prototype.setBooleanValue = oFF.NativeJsonProxyElement.prototype.setBoolean;

oFF.NativeJsonProxyElement.prototype.containsKey = function (name) {
       return this.m_jsonRootElement.hasOwnProperty(name);
};

oFF.NativeJsonProxyElement.prototype.contains = function (element) {
       return this.getKeyInternal(element) !== null;
};

oFF.NativeJsonProxyElement.prototype.getTypeOfElement = function (name) {
       var element = this.m_jsonRootElement[name];
    if (element === undefined) {
        throw new Error("Illegal State: Json Element not available: " + name);
    }
    return this.getTypeOf(element);
};

oFF.NativeJsonProxyElement.prototype.getDoubleByKey = function (name) {
       var element = this.m_jsonRootElement[name];
    if(element == null){
        return null;
    }
    if(typeof element === "number"){
        return element;
    }
    if(element instanceof oFF.PrElement){
        return element.asDouble().getDouble();
    }
    return parseFloat(element);
};

oFF.NativeJsonProxyElement.prototype.getIntegerByKey = oFF.NativeJsonProxyElement.prototype.getDoubleByKey;
oFF.NativeJsonProxyElement.prototype.getLongByKey = oFF.NativeJsonProxyElement.prototype.getDoubleByKey;
oFF.NativeJsonProxyElement.prototype.getBooleanByKey = function (name) {
       var element = this.m_jsonRootElement[name];
    if(element instanceof oFF.PrElement){
        return element.asBoolean().getBoolean();
    }
    return element === true || element === "true";
};

oFF.NativeJsonProxyElement.prototype.getKeysAsReadOnlyList = function () {
       var names = new oFF.XList();
    for (var attributeName in this.m_jsonRootElement) {
        if (this.m_jsonRootElement.hasOwnProperty(attributeName)) {
            names.add(attributeName);
        }
    }

    return names;
};

oFF.NativeJsonProxyElement.prototype.getByKey = function (name) {
       var element = this.m_jsonRootElement[name];
    if (element === null || element === undefined) {
        return null;
    }
	if( element instanceof oFF.PrElement ) {
        return element;
    }
    return new oFF.NativeJsonProxyElement(element);
};
oFF.NativeJsonProxyElement.prototype.getElementByName = oFF.NativeJsonProxyElement.prototype.getByKey;
oFF.NativeJsonProxyElement.prototype.getStructureByKey = oFF.NativeJsonProxyElement.prototype.getByKey;
oFF.NativeJsonProxyElement.prototype.getStructureByName = oFF.NativeJsonProxyElement.prototype.getByKey;
oFF.NativeJsonProxyElement.prototype.getListByKey = oFF.NativeJsonProxyElement.prototype.getByKey;
oFF.NativeJsonProxyElement.prototype.getListByName = oFF.NativeJsonProxyElement.prototype.getByKey;
oFF.NativeJsonProxyElement.prototype.getElementAt = oFF.NativeJsonProxyElement.prototype.getByKey;
oFF.NativeJsonProxyElement.prototype.getListAt = oFF.NativeJsonProxyElement.prototype.getByKey;
oFF.NativeJsonProxyElement.prototype.getStructureAt = oFF.NativeJsonProxyElement.prototype.getByKey;
oFF.NativeJsonProxyElement.prototype.get = oFF.NativeJsonProxyElement.prototype.getByKey;

oFF.NativeJsonProxyElement.prototype.getStringAt = oFF.NativeJsonProxyElement.prototype.getStringByKey;

oFF.NativeJsonProxyElement.prototype.getDoubleAt = function (index) {
       var element = this.m_jsonRootElement[index];
    if (typeof element === "number") {
        return element;
    }
    if(element instanceof oFF.PrElement){
        return element.asDouble().getDouble();
    }
    return parseFloat(element);
};
oFF.NativeJsonProxyElement.prototype.getIntegerAt = function (index) {
           var element = this.m_jsonRootElement[index];
    
    if(element instanceof oFF.PrElement){
        return element.asDouble().getDouble();
    }
    if (typeof element === "number") {
        return element;
    }
    return parseInt(element);
};

oFF.NativeJsonProxyElement.prototype.getLongAt = oFF.NativeJsonProxyElement.prototype.getIntegerAt;

oFF.NativeJsonProxyElement.prototype.getBooleanAt = function(index){
       var element = this.m_jsonRootElement[index];
    if(element instanceof oFF.PrElement){
        return element.asBoolean().getBoolean();
    }
    return element === true || element === "true";
};


oFF.NativeJsonProxyElement.prototype.getStringAtExt = function (index, defaultValue) {
       var result = defaultValue || null;
    if (this.m_jsonRootElement.hasOwnProperty(index)) {
        var element = this.m_jsonRootElement[index];
        if(element instanceof oFF.PrElement){
            result = element.asString().getString();
        }
        else if(typeof element == "string"){
            result = element;
        }
    }
    return result;
};

oFF.NativeJsonProxyElement.prototype.getStringByKey = oFF.NativeJsonProxyElement.prototype.getStringAtExt;
oFF.NativeJsonProxyElement.prototype.getStringAt = oFF.NativeJsonProxyElement.prototype.getStringAtExt;

oFF.NativeJsonProxyElement.prototype.getDoubleAtExt = function (index, defaultValue) {
       if (this.m_jsonRootElement.hasOwnProperty(index)) {
        var element = this.m_jsonRootElement[index];
        if(typeof element === "number"){
            return element;
        }
        if(typeof element === "string"){
            return parseFloat(element);
        }
        if(element instanceof oFF.PrElement){
            return element.asDouble().getDouble();
        }
    }
    return defaultValue;
};

oFF.NativeJsonProxyElement.prototype.getIntegerAtExt = oFF.NativeJsonProxyElement.prototype.getDoubleAtExt;
oFF.NativeJsonProxyElement.prototype.getLongAtExt = oFF.NativeJsonProxyElement.prototype.getDoubleAtExt;
oFF.NativeJsonProxyElement.prototype.getBooleanAtExt = function(index, defaultValue){
       if (this.m_jsonRootElement.hasOwnProperty(index)) {
        var element = this.m_jsonRootElement[index];
        if(element instanceof oFF.PrElement){
            return element.asBoolean().getBoolean();
        }
        else if (element !== undefined && element !== null){
            return element === true || element === "true";
        }
    }
    return defaultValue;
};

oFF.NativeJsonProxyElement.prototype.size = function () {
       if (typeof this.m_jsonRootElement === "object") {
        // LIST
        if (Array.isArray(this.m_jsonRootElement)) {
            return this.m_jsonRootElement.length;
        }
        // STRUCTURE
        var size = 0;
        for (var prop in this.m_jsonRootElement) {
            if (this.m_jsonRootElement.hasOwnProperty(prop)) {
                size ++;
            }
        }
        return size;
    }
    return 0;
};

oFF.NativeJsonProxyElement.prototype.isEmpty = function () {
       if (typeof this.m_jsonRootElement === "object") {
        // LIST
        if (Array.isArray(this.m_jsonRootElement)) {
            return this.m_jsonRootElement.length<1;
        }
        // STRUCTURE
        for (var prop in this.m_jsonRootElement) {
            if (this.m_jsonRootElement.hasOwnProperty(prop)) {
                return false;
            }
        }
    }
    return true;
};

oFF.NativeJsonProxyElement.prototype.getStringByKeyExt = oFF.NativeJsonProxyElement.prototype.getStringAtExt;
oFF.NativeJsonProxyElement.prototype.getBooleanByKeyExt = oFF.NativeJsonProxyElement.prototype.getBooleanAtExt;
oFF.NativeJsonProxyElement.prototype.getIntegerByKeyExt = oFF.NativeJsonProxyElement.prototype.getDoubleAtExt;
oFF.NativeJsonProxyElement.prototype.getLongByKeyExt = oFF.NativeJsonProxyElement.prototype.getDoubleAtExt;
oFF.NativeJsonProxyElement.prototype.getDoubleByKeyExt = oFF.NativeJsonProxyElement.prototype.getDoubleAtExt;
oFF.NativeJsonProxyElement.prototype.getObjectByKeyExt = oFF.NativeJsonProxyElement.prototype.getStringAtExt;

oFF.NativeJsonProxyElement.prototype.putStringNotNull = function (name, value) {
    if (value !== null) {
        this.m_jsonRootElement[name] = value;
    }
};

oFF.NativeJsonProxyElement.prototype.putStringNotNullAndNotEmpty = function (name, value) {
    if (oFF.XStringUtils.isNotNullAndNotEmpty(value)) {
        this.m_jsonRootElement[name] = value;
    }
};

oFF.NativeJsonProxyElement.prototype.putNewList = function (name) {
    this.m_jsonRootElement[name] = [];
    return new oFF.NativeJsonProxyElement(this.m_jsonRootElement[name]);
};
oFF.NativeJsonProxyElement.prototype.setNewListByKey = oFF.NativeJsonProxyElement.prototype.putNewList;

oFF.NativeJsonProxyElement.prototype.addAllStrings = function (listToAdd) {
    if (listToAdd !== undefined && listToAdd !== null) {
        if(listToAdd instanceof oFF.XList){ //performance optimization for native implementation
            for(var i = 0; i < listToAdd.size(); i = i + 10000) {
                Array.prototype.push.apply(this.m_jsonRootElement, listToAdd.m_list.slice(i, i+10000));
            }
        }
        else { // only the interface IXReadOnlyList of String is guaranteed, so we need a fallback
            for(var j = 0; j < listToAdd.size(); j++) {
                this.m_jsonRootElement.push(listToAdd.get(j));
            }
        }
    }
    return this;
};

oFF.NativeJsonProxyElement.prototype.addAll = function (_elements) {
    if(_elements !== undefined && _elements !== null)
    {
        var listToAdd = _elements.getValuesAsReadOnlyList();
        if (listToAdd !== undefined && listToAdd !== null)
        {
            for (var i = 0; i < listToAdd.size(); i++) {
                this.m_jsonRootElement.push(listToAdd.get(i));
            }
        }
    }
    return this;
};


oFF.NativeJsonProxyElement.prototype.putNewStructure = function (name) {
    this.m_jsonRootElement[name] = {};
    return new oFF.NativeJsonProxyElement(this.m_jsonRootElement[name]);
};
oFF.NativeJsonProxyElement.prototype.setNewStructureByKey = oFF.NativeJsonProxyElement.prototype.putNewStructure;

oFF.NativeJsonProxyElement.prototype.hasStringByKey = function (name) {
    if (this.containsKey(name)) {
        return this.getElementTypeByKey(name) === oFF.PrElementType.STRING;
    }
    return false;
};
oFF.NativeJsonProxyElement.prototype.hasStringByName = oFF.NativeJsonProxyElement.prototype.hasStringByKey;
oFF.NativeJsonProxyElement.prototype.getValuesAsReadOnlyList = function () {
    switch (typeof this.m_jsonRootElement) {
        case "object":
            if (Array.isArray(this.m_jsonRootElement )) {
                return this;
            }
            else{
                var resultList = new oFF.XList();
                for (var prop in this.m_jsonRootElement) {
                    if (this.m_jsonRootElement.hasOwnProperty(prop) ) {
                        var type = this.getTypeOf(this.m_jsonRootElement[prop]);
                        if(type.isNumber() || type === oFF.PrElementType.BOOLEAN || type === oFF.PrElementType.STRING ) {
                            resultList.add( this.getByKey(prop) );
                        }
                    }
                }
                return resultList;
            }
    }
    return this;
};

oFF.NativeJsonProxyElement.prototype.getIterator = function() {
	if(typeof this.m_jsonRootElement === "object" && Array.isArray(this.m_jsonRootElement)){
        return oFF.XIterator.createFromList(this);
    }
	return this.getValuesAsReadOnlyList().getIterator();
};

oFF.NativeJsonProxyElement.prototype.addPrimitive = function(value){
    this.m_jsonRootElement.push(value);
};

oFF.NativeJsonProxyElement.prototype.addNumeric = function(value){
    this.m_jsonRootElement.push((typeof value === "number")?value:parseFloat(value));
};

oFF.NativeJsonProxyElement.prototype.addString = oFF.NativeJsonProxyElement.prototype.addPrimitive;

oFF.NativeJsonProxyElement.prototype.addBoolean = function(value){
    this.m_jsonRootElement.push((value === true)||(value === "true"));
};

oFF.NativeJsonProxyElement.prototype.addInteger = oFF.NativeJsonProxyElement.prototype.addNumeric;
oFF.NativeJsonProxyElement.prototype.addLong = oFF.NativeJsonProxyElement.prototype.addNumeric;
oFF.NativeJsonProxyElement.prototype.addDouble = oFF.NativeJsonProxyElement.prototype.addNumeric;

oFF.NativeJsonProxyElement.prototype.addNull = function (name) {
       this.m_jsonRootElement.push(null);
};

oFF.NativeJsonProxyElement.prototype.addNewList = function (){
       var element = [];
    this.m_jsonRootElement.push(element);
    return new oFF.NativeJsonProxyElement(element);
};

oFF.NativeJsonProxyElement.prototype.addNewStructure = function (){
       var element = {};
    this.m_jsonRootElement.push(element);
    return new oFF.NativeJsonProxyElement(element);
};

oFF.NativeJsonProxyElement.prototype.add = function (_element) {
		this.m_jsonRootElement.push(_element);
};

oFF.NativeJsonProxyElement.prototype.clear = function () {
        if (this.m_jsonRootElement === null) {
        return;
    }
    switch (typeof this.m_jsonRootElement) {
        case "object":
            if (Array.isArray(this.m_jsonRootElement )) {
                this.m_jsonRootElement.splice(0,this.m_jsonRootElement.length);
            }
            else if (this.m_jsonRootElement instanceof oFF.PrElement) {
                if (this.getTypeOf(this.m_jsonRootElement) === oFF.PrElementType.STRUCTURE || this.getTypeOf(this.m_jsonRootElement) === oFF.PrElementType.LIST) {
                    this.m_jsonRootElement.clear();
                }
            }
            else{
                for (var prop in this.m_jsonRootElement) {
                    if (this.m_jsonRootElement.hasOwnProperty(prop)) {
                        delete this.m_jsonRootElement[prop];
                     }
                }
            }
            return;

        default :
            return ;
    }
};

oFF.NativeJsonProxyElement.prototype.createArrayCopy = function() {
       if(typeof this.m_jsonRootElement === "object" && Array.isArray(this.m_jsonRootElement)){
        var copyArray = new oFF.XArray(0);
        for(var index=0; index<this.m_jsonRootElement.length; index++){
            copyArray.m_list.push(this.getByKey(index));
        }
        return copyArray;
    }
    return null;
};

oFF.NativeJsonProxyElement.prototype.createMapByStringCopy = function() {
       if(typeof this.m_jsonRootElement === "object" && !Array.isArray(this.m_jsonRootElement )){
        var hashMap = new oFF.XHashMapByString();

        for (var prop in this.m_jsonRootElement) {

            if (this.m_jsonRootElement.hasOwnProperty(prop)) {
               hashMap.getMapFromImplementation()[prop] =  this.getByKey(prop);
            }
        }

        return hashMap;
    }
    return null;
};

oFF.NativePrSerializer = function(sortStructureElements, prettyPrint, indentation, escapeResult) {
   this.m_sort = sortStructureElements;
  this.m_pretty = prettyPrint;
  this.m_indentation = indentation;
  this.m_escapeResult = escapeResult;
};

//Strange hack to make tests work. Is it really necessary to escape slashes?
oFF.NativePrSerializer.escapeSlash = function(value) {
  if (value.indexOf("/") !== -1) {
    // always use the regular expression function to allow correct minification
    var regEx = new RegExp("/", "g");
    return value.replace(regEx, "\\/");
  }

  return value;
};

oFF.NativePrSerializer.prototype = new oFF.XObject();

oFF.NativePrSerializer.prototype.serialize = function(element) {
   var result = null;

  if (element !== null) {
    var wrapper = new oFF.NativeJsonSerializer(element, this.m_sort);

    if (this.m_pretty) {
      result = JSON.stringify(wrapper, null, this.m_indentation);
    } else {
      result = JSON.stringify(wrapper);
    }

    if (this.m_escapeResult) {
      result = oFF.NativePrSerializer.escapeSlash(result);
    }
  }

  return result;
};

oFF.NativePrSerializerFactory = function() {
   oFF.PrSerializerFactory.call(this);
  this._ff_c = "NativePrSerializerFactory";
};
oFF.NativePrSerializerFactory.prototype = new oFF.PrSerializerFactory();

oFF.NativePrSerializerFactory.staticSetup = function() {
   oFF.PrSerializerFactory.setActiveFactory(new oFF.NativePrSerializerFactory());
};

oFF.NativePrSerializerFactory.prototype.newInstance = function(sortStructureElements, prettyPrint, indentation, escapeResult) {
   return new oFF.NativePrSerializer(sortStructureElements, prettyPrint, indentation, escapeResult);
};

oFF.NativeJsonExtractor = function() {
       oFF.DfDocumentParser.call(this);
    this._ff_c = "NativeJsonExtractor";
};
oFF.NativeJsonExtractor.prototype = new oFF.DfDocumentParser();

oFF.NativeJsonExtractor.staticSetup = function()
{
       oFF.XJson.setJsonExtractor(new oFF.NativeJsonExtractor());
};

oFF.NativeJsonExtractor.prototype.extractJsonContent = function(content)
{
       if(content instanceof oFF.XJson)
    {
        return content.getElement();
    }
    return oFF.PrUtils.deepCopyElement(new oFF.NativeJsonProxyElement(content));
};

oFF.NativeJsonSerializer = function (jsonObject, sort) {
       this._ff_c = "NativeJsonSerializer";
    this.m_jsonObject = jsonObject;
    this.m_sort = sort;
};

oFF.NativeJsonSerializer.prototype = new oFF.XObject();

oFF.NativeJsonSerializer.prototype.toJSON = function () {
    if (this.m_jsonObject === null || this.m_jsonObject === undefined) {
        return null;
    }
    switch (typeof this.m_jsonObject) {
        case "object":
            if (this.m_jsonObject instanceof oFF.NativeJsonProxyElement) {
                return new oFF.NativeJsonSerializer(this.m_jsonObject.m_jsonRootElement, this.m_sort).toJSON();
            }
            var wrapperObject;
            var keys;
            var i, num;
            if (this.m_jsonObject instanceof oFF.PrElement) {
                switch (this.m_jsonObject.getType()) {
                    case oFF.PrElementType.LIST:
                        wrapperObject = [];
                        for (i = 0; i < this.m_jsonObject.size(); i++) {
                            wrapperObject.push(new oFF.NativeJsonSerializer(this.m_jsonObject.get(i), this.m_sort));
                        }
                        return wrapperObject;
                    case oFF.PrElementType.STRUCTURE:
                        wrapperObject = {};
                        keys = this.m_sort ? this.m_jsonObject.getKeysAsReadOnlyListSorted() : this.m_jsonObject.getKeysAsReadOnlyList();
                        for (i = 0; i < keys.size(); i++) {
                            wrapperObject[keys.get(i)] = new oFF.NativeJsonSerializer(this.m_jsonObject.getByKey(keys.get(i)), this.m_sort);
                        }
                        return wrapperObject;
                    case oFF.PrElementType.STRING:
                        return this.m_jsonObject.asString().getString();
                    case oFF.PrElementType.BOOLEAN:
                        return this.m_jsonObject.asBoolean().getBoolean();
                    case oFF.PrElementType.THE_NULL:
                        return null;
                    case oFF.PrElementType.INTEGER:
                        num = this.m_jsonObject.asInteger().getInteger();
                        if (typeof num !== "number") {
                            return parseInt(num);
                        }
                        return num;
                    case oFF.PrElementType.LONG:
                        num = this.m_jsonObject.asLong().getLong();
                        if (typeof num !== "number") {
                            return parseInt(num);
                        }
                        return num;
                    case oFF.PrElementType.DOUBLE:
                        num = this.m_jsonObject.asDouble().getDouble();
                        if (typeof num !== "number") {
                            return parseFloat(num);
                        }
                        return num;
                }
            }
            if (Array.isArray(this.m_jsonObject)) {
                wrapperObject = [];
                for (i = 0; i < this.m_jsonObject.length; i++) {
                    wrapperObject.push(new oFF.NativeJsonSerializer(this.m_jsonObject[i], this.m_sort));
                }
                return wrapperObject;
            }
            wrapperObject = {};
            keys = Object.keys(this.m_jsonObject);
            if (this.m_sort) {
                keys = keys.sort();
            }
            for (i = 0; i < keys.length; i++) {
                wrapperObject[keys[i]] = new oFF.NativeJsonSerializer(this.m_jsonObject[keys[i]], this.m_sort);
            }
            return wrapperObject;
    }
    return this.m_jsonObject;
};

oFF.NativePrSerializer = function(sortStructureElements, prettyPrint, indentation, escapeResult) {
   this.m_sort = sortStructureElements;
  this.m_pretty = prettyPrint;
  this.m_indentation = indentation;
  this.m_escapeResult = escapeResult;
};

//Strange hack to make tests work. Is it really necessary to escape slashes?
oFF.NativePrSerializer.escapeSlash = function(value) {
  if (value.indexOf("/") !== -1) {
    // always use the regular expression function to allow correct minification
    var regEx = new RegExp("/", "g");
    return value.replace(regEx, "\\/");
  }

  return value;
};

oFF.NativePrSerializer.prototype = new oFF.XObject();

oFF.NativePrSerializer.prototype.serialize = function(element) {
   var result = null;

  if (element !== null) {
    var wrapper = new oFF.NativeJsonSerializer(element, this.m_sort);

    if (this.m_pretty) {
      result = JSON.stringify(wrapper, null, this.m_indentation);
    } else {
      result = JSON.stringify(wrapper);
    }

    if (this.m_escapeResult) {
      result = oFF.NativePrSerializer.escapeSlash(result);
    }
  }

  return result;
};

oFF.NativePrSerializerFactory = function() {
   oFF.PrSerializerFactory.call(this);
  this._ff_c = "NativePrSerializerFactory";
};
oFF.NativePrSerializerFactory.prototype = new oFF.PrSerializerFactory();

oFF.NativePrSerializerFactory.staticSetup = function() {
   oFF.PrSerializerFactory.setActiveFactory(new oFF.NativePrSerializerFactory());
};

oFF.NativePrSerializerFactory.prototype.newInstance = function(sortStructureElements, prettyPrint, indentation, escapeResult) {
   return new oFF.NativePrSerializer(sortStructureElements, prettyPrint, indentation, escapeResult);
};

oFF.NativeJsonFilteringSerializer = function() {
       this._ff_c = "NativeJsonFilteringSerializer";
};

oFF.NativeJsonFilteringSerializer.prototype = new oFF.XObject();

oFF.NativeJsonFilteringSerializer.prototype.serializeWithFilter = function(element, prFilter)
{
      return JSON.stringify(new oFF.NativeJsonPrFilterWrapper(element, prFilter));
};


oFF.NativeJsonPrFilterWrapper = function (jsonObject, prFilter) {
       this._ff_c = "NativeJsonPrFilterWrapper";
    this.m_jsonObject = jsonObject;
    this.m_prFilter = prFilter;
};

oFF.NativeJsonPrFilterWrapper.prototype = new oFF.XObject();

oFF.NativeJsonPrFilterWrapper.prototype.toJSON = function () {
    var subFilter;
    if (this.m_jsonObject === null || this.m_jsonObject === undefined) {
        return null;
    }
    switch (typeof this.m_jsonObject) {
        case "object":
            if (this.m_jsonObject instanceof oFF.NativeJsonProxyElement) {
                return new oFF.NativeJsonPrFilterWrapper(this.m_jsonObject.m_jsonRootElement, this.m_prFilter).toJSON();
            }
            var sortedKeys;
            var wrapperObject;
            var i;
            if (this.m_jsonObject instanceof oFF.PrElement) {
                switch (this.m_jsonObject.getType()) {
                    case oFF.PrElementType.LIST:
                        subFilter = this.m_prFilter === null ? null : this.m_prFilter.getListSubFilter();
                        wrapperObject = [];
                        if (subFilter) {
                            for (i = 0; i < this.m_jsonObject.size(); i++) {
                                subFilter.submitIndex(i, this.m_jsonObject.get(i));
                                wrapperObject.push(new oFF.NativeJsonPrFilterWrapper(this.m_jsonObject.get(i)), this.m_prFilter);
                            }
                        } else {
                            for (i = 0; i < this.m_jsonObject.size(); i++) {
                                wrapperObject.push(new oFF.NativeJsonSerializer(this.m_jsonObject.get(i), true));
                            }
                        }
                        return wrapperObject;
                    case oFF.PrElementType.STRUCTURE:
                        wrapperObject = {};
                        sortedKeys = this.m_jsonObject.getKeysAsReadOnlyListSorted();
                        for (i = 0; i < sortedKeys.size(); i++) {
                            subFilter = this.m_prFilter === null ? null : this.m_prFilter.getSubFilter(sortedKeys.get(i));
                            if (subFilter === null) {
                                wrapperObject[sortedKeys.get(i)] = new oFF.NativeJsonSerializer(this.m_jsonObject.getByKey(sortedKeys.get(i)), true);
                            } else if (!subFilter.isIgnore(sortedKeys.get(i), this.m_jsonObject.getByKey(sortedKeys.get(i)))) {
                                wrapperObject[sortedKeys.get(i)] = new oFF.NativeJsonPrFilterWrapper(this.m_jsonObject.getByKey(sortedKeys.get(i)), this.m_prFilter);
                            }
                        }
                        return wrapperObject;
                    case oFF.PrElementType.STRING:
                        return this.m_jsonObject.asString().getString();
                    case oFF.PrElementType.INTEGER:
                        return this.m_jsonObject.asInteger().getInteger();
                    case oFF.PrElementType.LONG:
                        return this.m_jsonObject.asLong().getLong();
                    case oFF.PrElementType.DOUBLE:
                        return this.m_jsonObject.asDouble().getDouble();
                    case oFF.PrElementType.BOOLEAN:
                        return this.m_jsonObject.asBoolean().getBoolean();
                    case oFF.PrElementType.THE_NULL:
                        return null;
                }


                return new oFF.NativeJsonPrFilterWrapper(JSON.parse(this.m_jsonObject.toString()), this.m_prFilter).toJSON();
            }
            if (Array.isArray(this.m_jsonObject)) {
                subFilter = this.m_prFilter === null ? null : this.m_prFilter.getListSubFilter();
                wrapperObject = [];
                if (subFilter) {
                    for (i = 0; i < this.m_jsonObject.length; i++) {
                        subFilter.submitIndex(i, new oFF.NativeJsonProxyElement(this.m_jsonObject[i]));
                        wrapperObject.push(new oFF.NativeJsonPrFilterWrapper(this.m_jsonObject[i], subFilter));
                    }
                } else {
                    for (i = 0; i < this.m_jsonObject.length; i++) {
                        wrapperObject.push(new oFF.NativeJsonSerializer(this.m_jsonObject[i], true));
                    }
                }
                return wrapperObject;
            }
            wrapperObject = {};
            sortedKeys = Object.keys(this.m_jsonObject).sort();
            for (i = 0; i < sortedKeys.length; i++) {
                subFilter = this.m_prFilter === null ? null : this.m_prFilter.getSubFilter(sortedKeys[i]);
                if (subFilter === null) {
                    wrapperObject[sortedKeys[i]] = new oFF.NativeJsonSerializer(this.m_jsonObject[sortedKeys[i]], true);
                } else if (!subFilter.isIgnore(sortedKeys[i], new oFF.NativeJsonProxyElement(this.m_jsonObject[sortedKeys[i]]))) {
                    wrapperObject[sortedKeys[i]] = new oFF.NativeJsonPrFilterWrapper(this.m_jsonObject[sortedKeys[i]], subFilter);
                }
            }
            return wrapperObject;
    }
    return this.m_jsonObject;
};

oFF.NativeJsonFilteringSerializerFactory = function() {
       oFF.JsonFilteringSerializerFactory.call(this);
    this._ff_c = "NativeJsonFilteringSerializerFactory";
};

oFF.NativeJsonFilteringSerializerFactory.prototype = new oFF.JsonFilteringSerializerFactory();

oFF.NativeJsonFilteringSerializerFactory.staticSetup = function()
{
       oFF.JsonFilteringSerializerFactory.setActiveFactory(new oFF.NativeJsonFilteringSerializerFactory());
};

oFF.NativeJsonFilteringSerializerFactory.prototype.newInstance = function( ){
    return new oFF.NativeJsonFilteringSerializer( );
};



/// <summary>Initializer for static constants.</summary>
oFF.StructuresNativeModule = function() 
{
       oFF.DfModule.call(this);
    this._ff_c = "StructuresNativeModule";
};
oFF.StructuresNativeModule.prototype = new oFF.DfModule();
oFF.StructuresNativeModule.s_module = null;

oFF.StructuresNativeModule.getInstance = function()
{
       var oNativeModule = oFF.StructuresNativeModule;
    
    if (oNativeModule.s_module === null)
    {
        if ( oFF.StructuresModule.getInstance() === null)
        {
            throw new Error("Initialization Exception");
        }

		oNativeModule.s_module = oFF.DfModule.startExt(new oFF.StructuresNativeModule());

        oFF.NativeJsonParserFactory.staticSetup();
        oFF.NativeJsonExtractor.staticSetup();
        oFF.NativePrSerializerFactory.staticSetup();
        oFF.NativeJsonFilteringSerializerFactory.staticSetup();

        oFF.DfModule.stopExt(oNativeModule.s_module);
    }

    return oNativeModule.s_module;
};

oFF.StructuresNativeModule.prototype.getName = function()
{
	return "ff0080.structures.native";
};

oFF.StructuresNativeModule.getInstance();


return oFF;
} );