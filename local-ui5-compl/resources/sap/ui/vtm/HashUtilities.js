/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global"],function(jQuery){"use strict";var r={};r.hashString=function(r){var n=3340149426;for(var a=0;a<r.length;a++){n=(n+r.charCodeAt(a))*7|0}return n};r.hashMatrix=function(r){var n=5831;for(var a=0;a<r.length;a++){var t=Math.round(Math.round(r[a]*10)/10);n=(t+n)*7|0}return n};r.normalizeHash=function(r,n){if(!n){n=5e4}return Math.abs(r)%n};r.combineHashes=function(n,a){var t=4063827655;for(var e=0;e<n.length;e++){t=(n[e]+t)*3|0}return r.normalizeHash(t,a)};return r},true);
//# sourceMappingURL=HashUtilities.js.map