/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define([],function(){"use strict";function t(t){let n;return function(...e){if(!n){n=t.apply(this,e)}else{n=n.then(()=>t.apply(this,e),()=>t.apply(this,e))}const i=n;i.finally(()=>{if(i===n){n=null}}).catch(()=>{});return n}}var n={__esModule:true};n.sequentializedExecution=t;return n})})();
//# sourceMappingURL=SearchHelperSequentializeDecorator.js.map