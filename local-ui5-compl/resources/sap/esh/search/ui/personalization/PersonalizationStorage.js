/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./Personalizer"],function(e){"use strict";function t(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}const r=t(e);class s{constructor(e,t,r="default"){this.keyValueStore=e;this.searchModel=t;this.prefix=r}isStorageOfPersonalDataAllowed(){return this.keyValueStore.isStorageOfPersonalDataAllowed({searchModel:this.searchModel})}saveNotDelayed(){return Promise.resolve()}save(){return this.keyValueStore.save({searchModel:this.searchModel})}getPersonalizer(e){return new r(e,this)}deleteItem(e){this.keyValueStore.deleteItem(e,{searchModel:this.searchModel})}getItem(e){return this.keyValueStore.getItem(e,{searchModel:this.searchModel})}setItem(e,t){return this.keyValueStore.setItem(e,t,{searchModel:this.searchModel})}}return s})})();
//# sourceMappingURL=PersonalizationStorage.js.map