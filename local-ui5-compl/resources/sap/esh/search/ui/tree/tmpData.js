/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define([],function(){"use strict";let t=0;const e={};function n(){const n={};n.tmpDataId=""+ ++t;e[n.tmpDataId]=n;return n}function a(t){const n=e[t];if(!n){throw"no tmp data"}return n}function u(t){delete e[t]}function r(){return Object.keys(e).length}function c(){return Object.keys(e).length===0}var o={__esModule:true};o.createTmpData=n;o.getTmpData=a;o.deleteTmpData=u;o.getCountTmpData=r;o.isEmptyTmpData=c;return o})})();
//# sourceMappingURL=tmpData.js.map