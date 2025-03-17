/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([], function () {
  "use strict";

  class CharMapper {
    charsToReplace;
    charsToReplaceRegExp;
    replaceWithChars;
    replaceWithCharsRegExp;
    /**
     *
     * @param {string[]} charsToReplace - List of characters which will be encoded and decoded.
     * The same list of characters will make sure that the decoded string was mapped to the same
     * characters as the to be encoded string. This is needed for ui components which would interpret
     * encoded # or % characters as part of the url instead of an encoded search term.
     */
    constructor(charsToReplace) {
      this.charsToReplace = charsToReplace;
      if (charsToReplace.length === 0) {
        throw new Error("No characters to replace given");
      }
      if (charsToReplace.length > 10) {
        throw new Error("Max number of chars to replace is 10");
      }
      this.charsToReplaceRegExp = [];
      for (const charToReplace of charsToReplace) {
        this.charsToReplaceRegExp.push(new RegExp(charToReplace, "g"));
      }
      // private UTF-8 characters:
      this.replaceWithChars = ["\uF0000", "\uF0001", "\uF0002", "\uF0003", "\uF0004", "\uF0005", "\uF0006", "\uF0007", "\uF0008", "\uF0009"];
      this.replaceWithCharsRegExp = [];
      for (const replaceWithChar of this.replaceWithChars) {
        this.replaceWithCharsRegExp.push(new RegExp(replaceWithChar, "g"));
      }
    }
    /**
     * @param {string} str - the string component which shall be scanned for chars to replace
     * @returns {string} - the same string without the replaced chars but with placeholders
     */
    map(str) {
      for (let index = 0; index < this.charsToReplaceRegExp.length; index++) {
        str = str.replace(this.charsToReplaceRegExp[index], this.replaceWithChars[index]);
      }
      return str;
    }
    /**
     * @param {string} str - the string which contains placeholders
     * @returns {string} - the the same string without placeholders but with the original characters
     */
    unmap(str) {
      for (let index = 0; index < this.charsToReplaceRegExp.length; index++) {
        str = str.replace(this.replaceWithCharsRegExp[index], this.charsToReplace[index]);
      }
      return str;
    }
  }
  return CharMapper;
});
})();