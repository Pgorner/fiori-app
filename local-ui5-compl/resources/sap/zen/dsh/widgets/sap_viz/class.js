/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/zen/dsh/widgets/sap_viz/funcUtils"],function(t,n){t.info("Load Class");var r=/xyz/.test(function(){window.xyz})?/\b_super\b/:/.*/;var e=n.createCallChain;function o(){}function i(t){var n=o.prototype=this.prototype;var c=this.chain?this.chain(t.constructor):e(this,t.constructor);var s=c.prototype=new o;s.constructor=c;delete t.constructor;var a;for(var u in t){a=t[u];s[u]=typeof a==="function"&&typeof n[u]==="function"&&r.test(a)?function(t,r){return function(){this._super=n[t];var e=r.apply(this,arguments);return e}}(u,a):a}c.extend=i;return c}function c(t){if(typeof t==="function"){t.extend=i;return t}else{var n=t.constructor||function(){};var r=n.prototype;for(var e in t){if(Object.prototype.hasOwnProperty.call(t,e)){r[e]=t[e]}}n.extend=i;return n}}return{define:c,extend:i}});
//# sourceMappingURL=class.js.map