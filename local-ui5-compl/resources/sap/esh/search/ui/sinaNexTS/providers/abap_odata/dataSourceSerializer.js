/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";function e(e){if(e===e.sina.getAllDataSource()){return[{Id:"<All>",Type:"Category"}]}let a;const s=[];let r;switch(e.type){case e.sina.DataSourceType.Category:a="Category";s.push({Id:e.id,Type:a});break;case e.sina.DataSourceType.BusinessObject:a="View";s.push({Id:e.id,Type:a});break;case e.sina.DataSourceType.UserCategory:r=e;if(!r.subDataSources||Array.isArray(r.subDataSources)===false){break}for(const e of r.subDataSources){switch(e.type){case e.sina.DataSourceType.Category:a="Category";s.push({Id:e.id,Type:a});break;case e.sina.DataSourceType.BusinessObject:a="View";s.push({Id:e.id,Type:a});break}}}return s}var a={__esModule:true};a.serialize=e;return a})})();
//# sourceMappingURL=dataSourceSerializer.js.map