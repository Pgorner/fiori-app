/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(function(){"use strict";var e={};e.checkIsNotUndefined=function(e){if(e===undefined){return false}return true};e.checkIsNotNull=function(e){if(e===null){return false}return true};e.checkIsNotBlank=function(e){if(e instanceof Array&&e.length===0){return false}if(e instanceof Object&&Object.keys(e).length===0){return false}if(e===""){return false}return true};e.checkIsNotNullOrBlank=function(e){return this.checkIsNotNull(e)&&this.checkIsNotBlank(e)};e.checkIsNotNullOrUndefined=function(e){return this.checkIsNotNull(e)&&this.checkIsNotUndefined(e)};e.checkIsNotUndefinedOrBlank=function(e){return this.checkIsNotUndefined(e)&&this.checkIsNotBlank(e)};e.checkIsNotNullOrUndefinedOrBlank=function(e){return this.checkIsNotNull(e)&&this.checkIsNotUndefined(e)&&this.checkIsNotBlank(e)};return e},true);
//# sourceMappingURL=nullObjectChecker.js.map