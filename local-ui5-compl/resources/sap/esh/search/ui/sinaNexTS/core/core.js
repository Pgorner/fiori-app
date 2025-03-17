/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";function n(n){const t=function(){};t.prototype=n;return new t}function t(n,t){for(const e in t){n[e]=t[e]}return n}function e(n,t){if(t){if(n[0]==="_"){n=n.slice(1)}}return n[0].toUpperCase()+n.slice(1)}function r(n){if(Object.prototype.toString.call(n)==="[object Array]"){return true}return false}function u(n){if(r(n)){return false}return typeof n==="object"}function o(n){for(const t in n){if(Object.prototype.hasOwnProperty.call(n,t)){return false}}return JSON.stringify(n)===JSON.stringify({})}function i(n){return typeof n==="function"}function f(n){return typeof n==="string"}function c(n){return typeof n!=="object"&&typeof n!=="function"}function s(n,t,e){if(r(n)){return l(n,t,e)}if(u(n)){return x(n,t,e)}return n===t}function l(n,t,e){if(e===undefined){e=true}if(n.length!==t.length){return false}if(e){for(let r=0;r<n.length;++r){if(!s(n[r],t[r],e)){return false}}return true}const r={};for(let u=0;u<n.length;++u){const o=n[u];let i=false;for(let n=0;n<t.length;++n){const u=t[n];if(r[n]){continue}if(s(o,u,e)){i=true;r[n]=true;break}}if(!i){return false}}return true}function x(n,t,e){if(n.equals){return n.equals(t)}if(!u(t)){return false}for(const r in n){const u=n[r];const o=t[r];if(!s(u,o,e)){return false}}return true}function a(n){if(r(n)){return p(n)}if(u(n)){return y(n)}return n}function p(n){const t=[];for(let e=0;e<n.length;++e){const r=n[e];t.push(a(r))}return t}function y(n){if(n.clone){return n.clone()}const t={};for(const e in n){const r=n[e];t[e]=a(r)}return t}let d=0;function g(){return"#"+ ++d}function h(){return"xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,function(n){const t=Math.random()*16|0,e=n=="x"?t:t&3|8;return e.toString(16).toUpperCase()})}async function b(n,t){if(!n){return Promise.resolve()}const e=function(r){if(r>=n.length){return undefined}const u=n[r];return Promise.resolve().then(function(){if(t){return t(u)}return u()}).then(function(){return e(r+1)})};return e(0)}function j(n,t){let e=n;for(const n of t){e=e[n];if(typeof e==="undefined"){return undefined}}return e}function O(){return typeof window!=="undefined"}var S={__esModule:true};S.object=n;S.extend=t;S.firstCharToUpper=e;S.isList=r;S.isObject=u;S.isEmptyObject=o;S.isFunction=i;S.isString=f;S.isSimple=c;S.equals=s;S._equalsList=l;S._equalsObject=x;S.clone=a;S._cloneList=p;S._cloneObject=y;S.generateId=g;S.generateGuid=h;S.executeSequentialAsync=b;S.getProperty=j;S.isBrowserEnv=O;return S})})();
//# sourceMappingURL=core.js.map