/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./DataSource"],function(u){"use strict";const e=u["DataSource"];class s extends e{includeApps=false;subDataSources=[];undefinedSubDataSourceIds=[];constructor(u){super(u);this.includeApps=u.includeApps;this.subDataSources=u.subDataSources??this.subDataSources;this.undefinedSubDataSourceIds=u.undefinedSubDataSourceIds??this.undefinedSubDataSourceIds}isIncludeApps(){return this.includeApps}setIncludeApps(u){this.includeApps=u}addSubDataSource(u){this.subDataSources.push(u)}clearSubDataSources(){this.subDataSources=[]}getSubDataSources(){return this.subDataSources}hasSubDataSource(u){for(const e of this.subDataSources){if(e.id===u){return true}}return false}addUndefinedSubDataSourceId(u){this.undefinedSubDataSourceIds.push(u)}clearUndefinedSubDataSourceIds(){this.undefinedSubDataSourceIds=[]}getUndefinedSubDataSourceIds(){return this.undefinedSubDataSourceIds}}var a={__esModule:true};a.UserCategoryDataSource=s;return a})})();
//# sourceMappingURL=UserCategoryDataSource.js.map