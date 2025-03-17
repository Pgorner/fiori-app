/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff0040.commons"
],
function(oFF)
{
"use strict";
oFF.NativeXRegex = function () {
       this._ff_c = "NativeXRegex";
};

oFF.NativeXRegex.prototype = new oFF.XRegex();

oFF.NativeXRegex.staticSetup = function () {
       oFF.XRegex.setInstance(new oFF.NativeXRegex());
};

oFF.NativeXRegex.prototype.getFirstGroupOfMatch = function (target, pattern) {
   
    const regex = new RegExp(pattern);
    const result = target.match(regex);

    return result && result[1] ? result[1] : null;
};

oFF.NativeXRegex.prototype.getFirstMatchFrom = function (target, pattern, start) {
   
    if (!target || start >= target.length) {
        return null;
    }

    const regex = new RegExp(pattern);
    const result = target.slice(start).match(regex);

    if (!result || !Array.isArray(result) || !result[0]) {
        return null;
    }

    let matchIndex = result.index + start;
    const groups = oFF.XList.create();
    const groupsStart = oFF.XList.create();
    const groupsEnd = oFF.XList.create();

    groups.add(result[0]);
    groupsStart.add(oFF.XIntegerValue.create(matchIndex));
    groupsEnd.add(oFF.XIntegerValue.create(matchIndex + result[0].length));

    for (let i = 1; i < result.length; i++) {
        if (result[i] != null) {
            groups.add(result[i]);
            groupsStart.add(oFF.XIntegerValue.create(matchIndex));
            groupsEnd.add(oFF.XIntegerValue.create(matchIndex + result[i].length));
            matchIndex = matchIndex + result[i].length;
        } else {
            groups.add(null);
            groupsStart.add(oFF.XIntegerValue.create(-1));
            groupsEnd.add(oFF.XIntegerValue.create((-1)));
        }
    }

    return oFF.XRegexMatch.create(groups, groupsStart, groupsEnd);
};

oFF.NativeXRegex.prototype.getAllGroupsOfMatch = function(target, pattern, caseInsensitive)
{
    const listOfMatches = oFF.XList.create()
    const regexOptions = caseInsensitive ? 'gi' : 'g';
    const regex = new RegExp(pattern, regexOptions);
    let match;

    while ((match = regex.exec(target)) !== null) {
        listOfMatches.add(match[0]);
    }

    return listOfMatches;
};

oFF.NativeXRegex.prototype.replaceMatches = function(target, pattern, replacementPrefix, replacementPostFix, replacement, offset, caseInsensitive) {
    const regexOptions = caseInsensitive ? 'gi' : 'g';
    const regex = new RegExp(pattern, regexOptions);
    const replacedString = [];

    let lastIndex = 0;
    let match;

    while ((match = regex.exec(target)) !== null) {
        const matchStart = match.index;
        const matchEnd = regex.lastIndex;
        const matchLength = match[0].length;

        // Append the part of the string before the match
        replacedString.push(target.substring(lastIndex, matchStart));

        // Calculate the replacement string based on the length of the matched substring + prefix + postfix + offset if any
        const replacementPart = replacementPrefix + replacement.repeat(matchLength - offset) + replacementPostFix;

        // Append the replacement to the replacedString
        replacedString.push(replacementPart);

        // Update the lastIndex
        lastIndex = matchEnd;
    }

    // Append the remaining part of the input string
    replacedString.push(target.substring(lastIndex));

    return replacedString.join('');
};

oFF.NativeXRegex.prototype.replaceAll = function(target, pattern, replacement, caseInsensitive, replaceWithEntireMatchedSubstring) {
    const regexOptions = caseInsensitive ? 'gi' : 'g';
    const regex = new RegExp(pattern, regexOptions);
    let replacedString;
    if( replaceWithEntireMatchedSubstring )
    {
        replacedString = target.replace(regex, '$&');
    }
    else
    {
        replacedString = target.replace(regex, replacement);
    }

    return replacedString;
};


oFF.env = oFF.env || {};

oFF.XSystemUtils = {
    s_environmentProperties: null,
    getSystemTimezoneOffsetInMilliseconds: function () {
               return new Date().getTimezoneOffset() * 60 * 1000 * -1;
    },
    getCurrentTimeInMilliseconds: function () {
               // number of milliseconds since 1 January 1970 00:00:00 UTC
        return new Date().getTime();
    },
    waitMillis: function (waitTimeInMillis) {
       
        if (waitTimeInMillis < 0) {
            throw new Error("Illegal Argument: illegal wait time");
        }

        const startTime = this.getCurrentTimeInMilliseconds();
        let currentTime = startTime;
        while (currentTime - startTime < waitTimeInMillis) {
            currentTime = this.getCurrentTimeInMilliseconds();
        }
    },
    now: function () {
               // high resolution timestamp in milliseconds
        return performance.now();
    },
    processQueuedCallback: function (nativeQueue, callback) {
               if (nativeQueue === null) {
            throw new Error("Illegal Argument: illegal queue");
        }
        if (callback === null) {
            throw new Error("Illegal Argument: illegal callback");
        }
        nativeQueue.call("queued call", function (callbacks) {
            const nativeErrorCallback = callbacks.addErrback(function () {
            });
            const errorCallbackHandle = oFF.QueuedCallbackProcessorHandle.create(nativeErrorCallback, true);

            setTimeout(function () {
                callback.processCallback(errorCallbackHandle);
            }, 0);

            const nativeCallback = callbacks.add(function () {
            });
            const callbackHandle = oFF.QueuedCallbackProcessorHandle.create(nativeCallback, false);

            setTimeout(function () {
                callback.processCallback(callbackHandle);
            }, 0);
        });

        return true;
    },
    sleepMillisNonBlocking: function (sleepTimeInMillis, callback, customIdentifier) {
               if (sleepTimeInMillis < 0) {
            throw new Error("Illegal Argument: illegal sleep time");
        }
        if (callback === null) {
            throw new Error("Illegal Argument: illegal callback");
        }

        setTimeout(function () {
            callback.processCallback(customIdentifier);
        }, sleepTimeInMillis);

        return true;
    },
    getNativeEnvironment: function () {
               const oSystemUtils = oFF.XSystemUtils;
        let map;

        if (oFF.isNode()) {
            // Node.js
            map = oSystemUtils.getNativeEnvironmentNodeJs();
        } else if (this.isBrowser()) {
            // browser
            map = oSystemUtils.getNativeEnvironmentBrowser();
        } else {
            map = oFF.XHashMapByString.create();
        }

        oSystemUtils.addWiredEnvironment(map);
        return map;
    },
    getNativeEnvironmentBrowser: function () {
               const map = oFF.XHashMapByString.create();
        const search = new RegExp("([^&=]+)=?([^&]*)", "g");

        const decode = function (s) {
            return decodeURIComponent(s.replace(/[+]/g, " "));
        };

        const query = window.location.search.substring(1);

        let match;
        const shouldContinue = true;

        while (shouldContinue) {
            match = search.exec(query);
            if (match === null) {
                break;
            }
            map.put(decode(match[1]), decode(match[2]));
        }

        return map;
    },
    getNativeEnvironmentNodeJs: function () {
               const oPrUtils = oFF.PrUtils;
        const parameters = oFF.XHashMapByString.create();

        // eslint-disable-next-line no-undef
        const json = process.env;
        const jsonElementVariables = oFF.XJson.extractJsonContent(json);
        const jsonStructureVariables = oFF.PrStructure.createDeepCopy(jsonElementVariables);
        const variableNames = jsonStructureVariables.getKeysAsReadOnlyList();
        if (variableNames !== null) {
            const len = variableNames.size();
            for (let variableIndex = 0; variableIndex < len; variableIndex++) {
                const variableName = variableNames.get(variableIndex);
                const variableValueString = oPrUtils.getStringProperty(jsonStructureVariables, variableName);
                if (variableValueString !== null) {
                    parameters.put(variableName, variableValueString.getString());
                }
            }
        }

        // eslint-disable-next-line no-undef
        process.argv.forEach(function (val) {
            const argument = val;
            const argumentSeparatorIndex = argument.indexOf("=");

            let argumentName;
            let argumentValue;
            // node arguments
            if (argumentSeparatorIndex > -1) {
                argumentName = argument.substring(0, argumentSeparatorIndex);
                argumentValue = argument.substring(argumentSeparatorIndex + 1, argument.length);
                parameters.put(argumentName, argumentValue);
            }
        });

        return parameters;
    },
    addWiredEnvironment: function (map) {
               const oFireflyEnv = oFF.env;
        for (let key in oFireflyEnv) {
            if (oFireflyEnv.hasOwnProperty(key)) {
                map.put(key, oFireflyEnv[key]);
            }
        }
    },
    isBrowser: function () {
               return ((typeof window !== "undefined") && (window.location !== undefined) && (window.location.search !== undefined));
    },
    isGoogleAppsScript: function () {
               return oFF.GoogleUrlFetchApp !== undefined;
    },
    exit: function (exitCode) {
        if (oFF.isNode()) {
            // eslint-disable-next-line no-undef
            process.exit(exitCode);
        }
    },
    getOsName: function () {
        if (oFF.isNode())
        {
            return require("os").release();
        }
        else if (oFF.isXs())
        {
            return "XS";
        }
        else if (oFF.XSystemUtils.isGoogleAppsScript())
        {
            return "Google Apps";
        }
        let os = "Unknown";
        const userAgent = window.navigator.userAgent;
        if (userAgent.indexOf("Windows NT 10.0") !== -1)
        {
            os = "Windows 10";
        }
        else if (userAgent.indexOf("Mac") !== -1)
        {
            os = "Mac/iOS";
        }
        else if (userAgent.indexOf("Linux") !== -1)
        {
            os = "Linux";
        }
        else if (userAgent.indexOf("X11") !== -1)
        {
            os = "UNIX";
        }
        else if (userAgent.indexOf("Windows NT 5.1") !== -1)
        {
            os = "Windows XP";
        }
        else if (userAgent.indexOf("Windows NT 6.0") !== -1)
        {
            os = "Windows Vista";
        }
        else if (userAgent.indexOf("Windows NT 6.1") !== -1)
        {
            os = "Windows 7";
        }
        else if (userAgent.indexOf("Windows NT 6.2") !== -1)
        {
            os = "Windows 8";
        }
        else
        {
            os = "Other";
        }
        return os;
    }
};

oFF.XErrorHelper = {
    convertToString: function(error)
    {
               var sb = new oFF.XStringBuffer();

        if (error.hasCode())
        {
            sb.append(error.getCode().toString()).appendNewLine();
        }
        var errorText = error.getText();
        if (errorText !== null)
        {
            sb.append(errorText).appendNewLine();
        }
        if (error.hasErrorCause())
        {
            sb.append(error.getErrorCause().toString()).appendNewLine();
        }
        if (error.hasStackTrace())
        {
            sb.append(error.getStackTrace().toString()).appendNewLine();
        }
        if (error.hasExtendedInfo())
        {
            sb.append("Error with extended info").appendNewLine();
        }
        return sb.toString();
    },
    convertExceptionToString: function(throwable)
    {
               var sb = new oFF.XStringBuffer();

        if (throwable !== null)
        {
            if (typeof throwable.toString === "function")
            {
                sb.append(throwable.toString()).appendNewLine();
            }

            var json = JSON.stringify(throwable);
            if ("{}" !== json)
            {
                sb.append(json);
                sb.appendNewLine();
            }
        }

        return sb.toString();
    }
};

oFF.XStackTrace = function() {
    this.m_traces = new oFF.XList();
    this._ff_c = "XStackTrace";
};
oFF.XStackTrace.prototype = new oFF.XObject();

oFF.XStackTrace.create = function(removeLineCount)
{
       var newError = new Error();
    var stackArray = newError.stack.split("\n");
    var len = stackArray.length;
    if(len > 1)
    {
        var newObj = new oFF.XStackTrace();
        if(len -1 - removeLineCount > 0)
        {
            for(var i = 1 + removeLineCount; i < len; i++)
            {
                newObj.m_traces.add(stackArray[i].trim());
            }
        }

        return newObj;
    }
};

oFF.XStackTrace.supportsStackTrace = function()
{
       // Error.prototype.stack does not exist in IE
    return false;
};

oFF.XStackTrace.prototype.releaseObject = function()
{
       this.m_traces = oFF.XObjectExt.release(this.m_traces);
    oFF.XStackTrace.$superclass.releaseObject.call(this);
};

oFF.XStackTrace.prototype.getStackTraceLines = function()
{
       return this.m_traces.getValuesAsReadOnlyList();
};

oFF.XStackTrace.prototype.toString = function()
{
       return "";
};


/**
* Standard i/o.
 */
oFF.XNativeStdio = function() {};
oFF.XNativeStdio.prototype = new oFF.DfStdio();

/**
* Static setup.
 */
oFF.XNativeStdio.staticSetup = function()
{
	oFF.XStdio.setInstance(new oFF.XNativeStdio());
};

oFF.XNativeStdio.prototype.println = function(text) 
{
    if (oFF.isXs())
    {
        // XSJS
        $.trace.debug("Firefly: " + text);
    }
    else if (console)
    {
        // Node.js && Browser
        console.log(text);
    }
};

oFF.XNativeStdio.prototype.print = function(text) 
{
};

oFF.XNativeStdio.prototype.printError = function(errorMsg) 
{
	if (oFF.isXs())
    {
        // XSJS
        $.trace.error("Firefly: " + errorMsg);
    }
    else if (console)
    {
        // Node.js && Browser
        console.error(errorMsg);
    }
};

// @deprecated for removal since 2024-03-08; use oFF.XBase64.getInstance() instead.
oFF.Base64 = {
    s_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(input) {
             console.error("oFF.Base64.encode is deprecated and will be removed soon. Please use oFF.XBase64.getInstance().encodeFromString(input) instead.");
      var win = (typeof window !== "undefined") ? window : {};
      if(typeof win.btoa !== "undefined") {
            //we need to escape for unicode
            return win.btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, function(match, p1) {
                return String.fromCharCode("0x" + p1);
            }));
        }

        //XS-Engine
        var output = "";
        var i = 0;
        var keyStr = oFF.Base64.s_keyStr;

        do
        {
            var chr1 = input.charCodeAt(i++);
            var chr2 = input.charCodeAt(i++);
            var chr3 = input.charCodeAt(i++);

            var enc1 = chr1 >> 2;
            var enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            var enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            var enc4 = chr3 & 63;

            if (isNaN(chr2))
            {
                enc3 = enc4 = 64;
            }
            else if(isNaN(chr3))
            {
                enc4 = 64;
            }

            output += keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);

        } while(i < input.length);

        return output;
    }
};

/** HTTP utilities. */
oFF.XHttpUtils = {
    s_reg1: new RegExp("[\\\\]", "g"), // .replace(/[\\]/g, "\\\\")
    s_reg2: new RegExp("[\\\"]", "g"), // .replace(/[\"]/g, "\\\"")
    s_reg3: new RegExp("[\\/]", "g"), // .replace(/[\/]/g, "\\/")
    s_reg4: new RegExp("[\\b]", "g"), // .replace(/[\b]/g, "\\b")
    s_reg5: new RegExp("[\\f]", "g"), // .replace(/[\f]/g, "\\f")
    s_reg6: new RegExp("[\\n]", "g"), // .replace(/[\n]/g, "\\n")
    s_reg7: new RegExp("[\\r]", "g"), // .replace(/[\r]/g, "\\r")
    s_reg8: new RegExp("[\\t]", "g"), // .replace(/[\t]/g, "\\t");
    /**
     * Escape a URL.
     * @param unescaped the non-escaped URL.
     * @return the escaped URL.
     */
    encodeURIComponent: function(unescaped)
    {
               return encodeURIComponent(unescaped);
    },

    /**
     * Unescape a URL.
     * @param escaped the escaped URL.
     * @return the non-escaped URL.
     */
    decodeURIComponent: function(escaped)
    {
               return decodeURIComponent(escaped);
    },

    /**
     * Encode byte array to base 64 string.
     * @param byteArray a byte array.
     * @return the base 64 encoded string.
     */
    encodeByteArrayToBase64: function(byteArray)
    {
               var nativeString = oFF.XByteArray.convertToString(byteArray);
        var encodedString;

        // eslint-disable-next-line no-undef
        if (typeof Buffer !== "undefined" && typeof module !== "undefined" && this.module !== module && module.exports)
        {
            // Node.js
            // eslint-disable-next-line no-undef
            encodedString = new Buffer(nativeString, "utf8").toString("base64");
        }
        else if (typeof window !== "undefined")
        {
            // browser
            encodedString =  window.btoa(oFF.XString.utf8Encode(nativeString));
        }

        return encodedString;
    },

    /**
     * Decode base 64 string to byte array.
     * @param base64 a base 64 encoded string.
     * @return the byte array.
     */
    decodeBase64ToByteArray: function(base64)
    {
               var decodedString = "";

        // eslint-disable-next-line no-undef
        if (typeof Buffer !== "undefined" && typeof module !== "undefined" && this.module !== module && module.exports)
        {
            // Node.js
            // eslint-disable-next-line no-undef
            decodedString = new Buffer(base64 , "base64").toString();
        }
        else if (typeof window !== "undefined")
        {
            // browser
            decodedString = oFF.XString.utf8Decode(window.atob(base64));
        }

        return oFF.XByteArray.convertFromString(decodedString);
    },

    /**
     * Escape the json string
     * @param value the unescape json string
     * @return the escaped json string
     */
    escapeToJsonString: function(value)
    {
               var ref = oFF.XHttpUtils;

        if(value.indexOf("\\") !== -1) {
            value = value.replace(ref.s_reg1, "\\\\");
        }
        if(value.indexOf("\"") !== -1) {
            value = value.replace(ref.s_reg2, "\\\"");
        }
        if(value.indexOf("/") !== -1) {
            value = value.replace(ref.s_reg3, "\\/");
        }
        if(value.indexOf("\b") !== -1) {
            value = value.replace(ref.s_reg4, "\\b");
        }
        if(value.indexOf("\f") !== -1) {
            value = value.replace(ref.s_reg5, "\\f");
        }
        if(value.indexOf("\n") !== -1) {
            value = value.replace(ref.s_reg6, "\\n");
        }
        if(value.indexOf("\r") !== -1) {
            value = value.replace(ref.s_reg7, "\\r");
        }
        if(value.indexOf("\t") !== -1) {
            value = value.replace(ref.s_reg8, "\\t");
        }
        return value;
    }
};

oFF.XStringTokenizer = {
    splitString: function(string, splitString)
    {
               if (string === null || splitString === null)
        {
            return null;
        }
        var splittedStrings = string.split(splitString);
        if (splittedStrings === null)
        {
            return null;
        }
        return new oFF.XList(splittedStrings);
    }
};
oFF.XGuid = {
    getGuid: function()
    {
               var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };

        return S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4();
    }
};

/** SHA1 utility. */
class NativeXSha1 extends oFF.XSha1 {
    static staticSetup() {
        oFF.XSha1.setInstance(new oFF.NativeXSha1());
    }

    encode(text) {
               if (text === null) {
            return null;
        }

        var blockstart;
        var i;
        var W = [];
        var H0 = 0x67452301;
        var H1 = 0xEFCDAB89;
        var H2 = 0x98BADCFE;
        var H3 = 0x10325476;
        var H4 = 0xC3D2E1F0;
        var A, B, C, D, E;
        var temp;

        var XSha1 = oFF.NativeXSha1;
        var fnRotateLeft = XSha1.rotateLeft;
        var fnCvtHex = XSha1.cvtHex;
        var msg = oFF.XString.utf8Encode(text);
        var msgLen = msg.length;

        var wordArray = [];
        for (i = 0; i < msgLen - 3; i += 4) {
            wordArray.push(msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 | msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3));
        }

        switch (msgLen % 4) {
            case 0: {
                wordArray.push(0x080000000);
                break;
            }
            case 1: {
                wordArray.push(msg.charCodeAt(msgLen - 1) << 24 | 0x0800000);
                break;
            }
            case 2: {
                wordArray.push(msg.charCodeAt(msgLen - 2) << 24 | msg.charCodeAt(msgLen - 1) << 16 | 0x08000);
                break;
            }
            default: {
                wordArray.push(msg.charCodeAt(msgLen - 3) << 24 | msg.charCodeAt(msgLen - 2) << 16 | msg.charCodeAt(msgLen - 1) << 8 | 0x80);
                break;
            }
        }

        while (wordArray.length % 16 !== 14) {
            wordArray.push(0);
        }

        wordArray.push(msgLen >>> 29);
        wordArray.push((msgLen << 3) & 0x0ffffffff);

        var wordArrayLen = wordArray.length;
        for (blockstart = 0; blockstart < wordArrayLen; blockstart += 16) {
            for (i = 0; i < 16; i++) {
                W[i] = wordArray[blockstart + i];
            }

            for (i = 16; i <= 79; i++) {
                W[i] = fnRotateLeft(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
            }

            A = H0;
            B = H1;
            C = H2;
            D = H3;
            E = H4;

            for (i = 0; i <= 19; i++) {
                temp = (fnRotateLeft(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
                E = D;
                D = C;
                C = fnRotateLeft(B, 30);
                B = A;
                A = temp;
            }

            for (i = 20; i <= 39; i++) {
                temp = (fnRotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
                E = D;
                D = C;
                C = fnRotateLeft(B, 30);
                B = A;
                A = temp;
            }

            for (i = 40; i <= 59; i++) {
                temp = (fnRotateLeft(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
                E = D;
                D = C;
                C = fnRotateLeft(B, 30);
                B = A;
                A = temp;
            }

            for (i = 60; i <= 79; i++) {
                temp = (fnRotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
                E = D;
                D = C;
                C = fnRotateLeft(B, 30);
                B = A;
                A = temp;
            }

            H0 = (H0 + A) & 0x0ffffffff;
            H1 = (H1 + B) & 0x0ffffffff;
            H2 = (H2 + C) & 0x0ffffffff;
            H3 = (H3 + D) & 0x0ffffffff;
            H4 = (H4 + E) & 0x0ffffffff;
        }

        return (fnCvtHex(H0) + fnCvtHex(H1) + fnCvtHex(H2) + fnCvtHex(H3) + fnCvtHex(H4)).toLowerCase();
    }

    static cvtHex(val) {
               var str = "";
        var i;
        var v;
        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }

        return str;
    }

    static rotateLeft(n, s) {
               return (n << s) | (n >>> (32 - s));
    }
}

oFF.NativeXSha1 = NativeXSha1;

oFF.XReflection = 
{
	getMethods: function(clazz) 
	{
			var list = oFF.XList.create();
		var currentTarget = clazz.getNativeElement();
		currentTarget = currentTarget.prototype;
		 
		function addFunction(name) 
		{
			// skip restricted property names
			if(name === "caller" || name === "callee" || name === "arguments") 
			{
				return;
			}
	
			if (typeof currentTarget[name] === "function") 
			{
				list.add(oFF.XMethod.create( name, oFF.XAccessModifier.PUBLIC ));
			}
		}

		while(currentTarget) 
		{
			Object.getOwnPropertyNames(currentTarget).forEach(addFunction);
			currentTarget = Object.getPrototypeOf(currentTarget);
		}
	
		return list;
	},

	getMembers: function() 
	{
			return null;
	},

	invokeMethod: function(target, methodName) 
	{
			var result = target[methodName]();
		return this.getBandungObject(result);
	},

	invokeMethodWithArgs: function(target, methodName, args) 
	{
			var paramValues = [];
	
		for (var i = 0; i < args.size(); i++) 
		{
			paramValues.push(this.getNativeObject(args.get(i)));
		}

		var result = target[methodName].apply(target, paramValues);
		return this.getBandungObject(result);
	},

	getNativeObject: function(param) 
	{
			var obj = param.getValue();
	
		if (obj !== null && obj !== undefined && param.isWrapped()) 
		{
			if (obj instanceof oFF.XStringValue) 
			{
				return obj.getString();
			}

			if (obj instanceof oFF.XDoubleValue) 
			{
				return obj.getDouble();
			}

			if (obj instanceof oFF.XIntegerValue) 
			{
				return obj.getInteger();
			}

			if (obj instanceof oFF.XBooleanValue) 
			{
				return obj.getBoolean();
			}

			if (obj instanceof oFF.XLongValue) 
			{
				return obj.getLong();
			}
		}

		return obj;
	},

	getBandungObject: function(obj) 
	{
		
		if (typeof obj === "string") 
		{
			return oFF.XReflectionParam.createString(obj);
		} 
		else if (typeof obj === "boolean") 
		{
			return oFF.XReflectionParam.createBoolean(obj);
		} 
		else if (typeof obj === "number") 
		{
			if (Number.isInteger(obj)) 
			{
				return oFF.XReflectionParam.createInteger(obj);
			} 
			else 
			{
				return oFF.XReflectionParam.createDouble(obj);
			}
		} 
		else 
		{
			return oFF.XReflectionParam.create(obj);
		}
	}
};

class NativeXBase64 extends oFF.XBase64 {
    static staticSetup() {
        oFF.XBase64.setInstance(new oFF.NativeXBase64());
    }

    static convertStringToInt8Array(str) {
        return new Int8Array(str.split("").map(function (ch) {
            return ch.charCodeAt(0);
        }));
    }

    static convertArrayToString(bytes) {
        return new Uint8Array(bytes).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
        }, '');
    }

    decodeToBytes(encoded) {
        let nativeArray = oFF.NativeXBase64.convertStringToInt8Array(atob(encoded));
        return oFF.XByteArray.create(nativeArray, nativeArray.length);
    }

    encodeFromBytes(decoded) {
        return btoa(oFF.NativeXBase64.convertArrayToString(decoded.getNative()));
    }
}

oFF.NativeXBase64 = NativeXBase64;

oFF.CommonsNativeModule = function() 
{
       oFF.DfModule.call(this);
    this._ff_c = "CommonsNativeModule";
};

oFF.CommonsNativeModule.prototype = new oFF.DfModule();

oFF.CommonsNativeModule.s_module = null;

oFF.CommonsNativeModule.getInstance = function() 
{
       if ( oFF.CommonsNativeModule.s_module === null)
    {
        if ( oFF.CommonsModule.getInstance() === null)
        {
            throw new Error("Initialization Exception");
        }

        oFF.CommonsNativeModule.s_module = oFF.DfModule.startExt(new oFF.CommonsNativeModule());

        oFF.XNativeStdio.staticSetup();
        if(oFF.isXs())
        {
            oFF.NativeXBase64Xs.staticSetup();
        }
        else
        {
            oFF.NativeXBase64.staticSetup();
        }
        oFF.NativeXSha1.staticSetup();

        oFF.NativeXRegex.staticSetup();

        if (!oFF.isUi5() && !oFF.isXs()) {
            oFF.NativeXEncoderFactory.staticSetup();
            oFF.NativeXEncoderSecretFactory.staticSetup();
        }

        oFF.DfModule.stopExt(oFF.CommonsNativeModule.s_module);
    }

    return  oFF.CommonsNativeModule.s_module;
};

oFF.CommonsNativeModule.prototype.getName = function()
{
	return "ff0050.commons.native";
};

oFF.CommonsNativeModule.getInstance();


return oFF;
} );