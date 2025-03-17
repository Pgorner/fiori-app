/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../core/util","./Formatter"],function(t,e){"use strict";const r=e["Formatter"];class s extends r{initAsync(){return Promise.resolve()}format(t){return t}async formatAsync(e){e=t.addPotentialNavTargets(e);return Promise.resolve(e)}}var n={__esModule:true};n.NavtargetsInResultSetFormatter=s;return n})})();
//# sourceMappingURL=NavtargetsInResultSetFormatter.js.map