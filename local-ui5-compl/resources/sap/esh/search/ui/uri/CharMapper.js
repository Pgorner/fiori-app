/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";class e{charsToReplace;charsToReplaceRegExp;replaceWithChars;replaceWithCharsRegExp;constructor(e){this.charsToReplace=e;if(e.length===0){throw new Error("No characters to replace given")}if(e.length>10){throw new Error("Max number of chars to replace is 10")}this.charsToReplaceRegExp=[];for(const r of e){this.charsToReplaceRegExp.push(new RegExp(r,"g"))}this.replaceWithChars=["0","1","2","3","4","5","6","7","8","9"];this.replaceWithCharsRegExp=[];for(const e of this.replaceWithChars){this.replaceWithCharsRegExp.push(new RegExp(e,"g"))}}map(e){for(let r=0;r<this.charsToReplaceRegExp.length;r++){e=e.replace(this.charsToReplaceRegExp[r],this.replaceWithChars[r])}return e}unmap(e){for(let r=0;r<this.charsToReplaceRegExp.length;r++){e=e.replace(this.replaceWithCharsRegExp[r],this.charsToReplace[r])}return e}}return e})})();
//# sourceMappingURL=CharMapper.js.map