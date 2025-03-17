/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./KPICardAPI","sap/fe/test/Utils","sap/fe/test/builder/FEBuilder"],function(e,t,r){"use strict";var i=function(t){return e.call(this,t)};i.prototype=Object.create(e.prototype);i.prototype.constructor=i;i.prototype.isAction=true;i.prototype.iClickHeader=function(){var e=this.getBuilder();return this.prepareResult(e.doClickKPICardHeader().description("Clicking KPI card header").execute())};return i});
//# sourceMappingURL=KPICardActions.js.map