/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../sina/DataSourceType"],function(e){"use strict";const t=e["DataSourceType"];function a(e){if(e===e.sina.getAllDataSource()){return{Id:"<All>",Type:"Category"}}let a;switch(e.type){case t.Category:a="Category";break;case t.BusinessObject:a="View";break}return{Id:e.id,Type:a}}var r={__esModule:true};r.serialize=a;return r})})();
//# sourceMappingURL=dataSourceSerializer.js.map