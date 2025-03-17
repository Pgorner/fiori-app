/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["sap/ui/base/ManagedObject","sap/ui/core/Control"],function(n,e){"use strict";function t(e){return e instanceof n}function o(n){return n instanceof e}function r(n,e){if(n){if(t(n)){if(o(n)){e.renderControl(n)}}else{for(const t of n){if(o(t)){e.renderControl(t)}}}}}var i={__esModule:true};i.isManagedObject=t;i.isControl=o;i.typesafeRender=r;return i})})();
//# sourceMappingURL=TypeGuardForControls.js.map