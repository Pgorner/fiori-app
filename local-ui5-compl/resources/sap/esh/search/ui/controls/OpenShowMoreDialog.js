/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../SearchFacetDialogModel","./facets/SearchFacetDialog","../eventlogging/UserEvents"],function(e,t,o){"use strict";function n(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}const a=n(e);const s=n(t);const c=o["UserEventType"];async function r(e){const t=new a({searchModel:e.searchModel});await t.initAsync();t.setData(e.searchModel.getData());t.config=e.searchModel.config;t.sinaNext=e.searchModel.sinaNext;t.prepareFacetList();const o={selectedAttribute:e.dimension,selectedTabBarIndex:e.selectedTabBarIndex,tabBarItems:e.tabBarItems};const n=new s(`${e.searchModel.config.id}-SearchFacetDialog`,o);n.setModel(t);n.setModel(e.searchModel,"searchModel");const r=e.searchModel.getSearchCompositeControlInstanceByChildControl(e.sourceControl);if(r){r["oFacetDialog"]=n}n.open();e.searchModel.eventLogger.logEvent({type:c.FACET_SHOW_MORE,referencedAttribute:e.dimension})}var i={__esModule:true};i.openShowMoreDialog=r;return i})})();
//# sourceMappingURL=OpenShowMoreDialog.js.map