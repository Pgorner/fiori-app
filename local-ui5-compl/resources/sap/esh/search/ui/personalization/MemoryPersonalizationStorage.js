/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";class e{static async create(){return Promise.resolve(new e)}dataMap;constructor(){this.dataMap={}}isStorageOfPersonalDataAllowed(){return true}save(){return Promise.resolve()}getItem(e){return this.dataMap[e]}setItem(e,t){this.dataMap[e]=t;return true}deleteItem(e){delete this.dataMap[e]}}return e})})();
//# sourceMappingURL=MemoryPersonalizationStorage.js.map