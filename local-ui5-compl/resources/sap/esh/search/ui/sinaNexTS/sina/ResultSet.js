/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./SinaObject","../core/Log","../core/core"],function(t,r,s){"use strict";const e=t["SinaObject"];const i=r["Log"];class o extends e{id=(()=>s.generateId())();title;items=[];query;log=(()=>new i)();errors=[];constructor(t){super(t);this.id=t.id??this.id;this.title=t.title??this.title;this.setItems(t.items||[]);this.query=t.query??this.query;this.log=t.log??this.log}setItems(t){if(!Array.isArray(t)||t.length<1){return this}this.items=[];for(let r=0;r<t?.length;r++){const s=t[r];s.parent=this;this.items.push(s)}return this}toString(){const t=[];for(let r=0;r<this.items.length;++r){const s=this.items[r];t.push(s.toString())}return t.join("\n")}hasErrors(){return this.errors.length>0}getErrors(){return this.errors}addError(t){this.errors.push(t)}addErrors(t){this.errors.push(...t)}}var n={__esModule:true};n.ResultSet=o;return n})})();
//# sourceMappingURL=ResultSet.js.map