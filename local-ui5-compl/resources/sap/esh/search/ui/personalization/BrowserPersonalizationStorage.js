/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/util/Storage","../error/errors","sap/base/Log"],function(e,r,t){"use strict";const s=r["ESHUIError"];class i{static async create(e){return Promise.resolve(new i(e))}storage;_oLogger=(()=>t.getLogger("sap.esh.search.ui.personalization.BrowserPersonalizationStorage"))();constructor(r="default",t="local"){this.prefix=r;this.prefix=r+".Search.Personalization.";this._oLogger.debug("Using BrowserPersonalizationStorage with prefix: "+this.prefix);this.storage=new e(t);if(!this.storage.isSupported()){throw new Error(`Storage of type ${t} is not supported by UI5 in this environment`)}}isStorageOfPersonalDataAllowed(){return true}save(){return Promise.resolve()}getItem(e){this._oLogger.debug("getItem: "+this.prefix+e);return this.storage.get(this.prefix+e)}setItem(e,r){this._oLogger.debug("setItem: "+this.prefix+e);try{JSON.stringify(r);return this.storage.put(this.prefix+e,r)}catch(r){const t=new s("data with key '"+e+"' is not serializable");t.previous=r;this._oLogger.error(t.message)}}deleteItem(e){this._oLogger.debug("deleteItem: "+this.prefix+e);this.storage.remove(this.prefix+e)}}return i})})();
//# sourceMappingURL=BrowserPersonalizationStorage.js.map