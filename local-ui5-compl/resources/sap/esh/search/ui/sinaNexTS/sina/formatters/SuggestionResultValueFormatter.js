/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../SuggestionType","./Formatter","./ResultValueFormatter"],function(t,e,r){"use strict";const o=t["SuggestionType"];const s=e["Formatter"];const n=r["ResultValueFormatter"];class u extends s{sina;resultValueFormatter;initAsync(){throw new Error("Method not implemented.")}constructor(t){super();this.resultValueFormatter=new n(t)}format(t){for(const e of t.items){if(e.type=o.Object){this.resultValueFormatter._formatItemInUI5Form(e.object)}}return t}formatAsync(t){t=this.format(t);return Promise.resolve(t)}}var a={__esModule:true};a.SuggestionResultValueFormatter=u;return a})})();
//# sourceMappingURL=SuggestionResultValueFormatter.js.map