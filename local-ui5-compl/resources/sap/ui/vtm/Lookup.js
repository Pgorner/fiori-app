/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Element","./ArrayUtilities"],function(jQuery,e,t){"use strict";var i=e.extend("sap.ui.vtm.Lookup",{init:function(){this.clear()},addValue:function(e,t){var i=this._valuesByKey;var u=i.get(e);if(u){u.push(t)}else{i.set(e,[t])}return this},removeValue:function(e,t,i){if(!i){i=function(e,t){return e===t}}var u=this._valuesByKey.get(e);if(u){var n=sap.ui.vtm.ArrayUtilities.findIndex(u,function(e){return i(t,e)});if(n>=0){u.splice(n,1);if(u.length==0){this._valuesByKey.delete(e)}}}return this},clear:function(){this._valuesByKey=new Map;return this},hasValue:function(e){return this._valuesByKey.has(e)},getValues:function(e){var t=this._valuesByKey.get(e);if(t){t=t.slice()}return t||[]},forEach:function(e){this._valuesByKey.forEach(e);return this}});return i});
//# sourceMappingURL=Lookup.js.map