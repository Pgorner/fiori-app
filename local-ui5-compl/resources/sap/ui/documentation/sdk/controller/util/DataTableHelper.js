/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./DataTableUtil"],function(t,a){"use strict";function e(){this.aDataTables=[]}e.prototype.addDatatable=function(t){this.aDataTables.push(t)};e.prototype.destroyDatatables=function(){this.aDataTables.forEach(function(t){t.destroy()});this.aDataTables=[]};e.prototype.addMiddlewares=function(){t.fn.dataTable.ext.search.push(function(t,a,e,n,r){var i=true,u=this.aDataTables.find(function(a){return a.sId===t.sTableId});if(u){i=u.handleSearch(t,a,e,n,r)}return i}.bind(this));t.extend(t.fn.dataTableExt.oSort,{"alpha-numeric-asc":function(t,e){return a.sortAlphaNumeric(t,e)},"alpha-numeric-desc":function(t,e){return a.sortAlphaNumeric(e,t)}})};function n(){var t=null;return{getInstance:function(){if(!t){t=new e}return t}}}return n()});
//# sourceMappingURL=DataTableHelper.js.map