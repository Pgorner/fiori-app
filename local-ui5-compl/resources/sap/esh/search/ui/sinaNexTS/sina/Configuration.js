/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./SinaObject","../providers/abap_odata/Provider","../providers/inav2/Provider"],function(e,i,r){"use strict";const s=e["SinaObject"];const a=i["Provider"];const n=r["Provider"];class t extends s{personalizedSearch;isPersonalizedSearchEditable;setPersonalizedSearch(e){this.personalizedSearch=e}constructor(e){super(e);this.personalizedSearch=e.personalizedSearch??this.personalizedSearch;this.isPersonalizedSearchEditable=e.isPersonalizedSearchEditable??this.isPersonalizedSearchEditable}async resetPersonalizedSearchDataAsync(){if(this.sina.provider instanceof n||this.sina.provider instanceof a){return this.sina.provider.resetPersonalizedSearchDataAsync()}}async saveAsync(){if(this.sina.provider instanceof n||this.sina.provider instanceof a){return this.sina.provider.saveConfigurationAsync(this)}}}var o={__esModule:true};o.Configuration=t;return o})})();
//# sourceMappingURL=Configuration.js.map