/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["../utils/CardRanking"],function(r){"use strict";function n(n,t,e){if(n<t){return r.reorder(e,n,t+1)}return r.reorder(e,n,t)}function t(r,t,e){var i=n(r,t,e);i=i.map(function(r){var n=JSON.parse(JSON.stringify(r));var t=n.descriptorContent["sap.app"].id;n.descriptorContent["sap.insights"].ranking=n.rank;n.descriptorContent=JSON.stringify(n.descriptorContent);return{id:t,descriptorContent:n.descriptorContent}});return i}return{updateCardsRanking:t}});
//# sourceMappingURL=CardDndConfig.js.map