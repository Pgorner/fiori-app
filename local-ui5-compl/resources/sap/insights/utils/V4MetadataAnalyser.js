/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";return{_search:function(t,e){return e?e.split("/").reduce(function(t,e){return t&&e?t[e]:t},t):undefined},getAnnotations:function(t,e,n,r){return this._fetchEntitySetName(t,e,n).then(function(e){return Promise.all(r.map(function(r){return this.getMetadataProperty(t,e,n,r)}.bind(this)))}.bind(this))},_fetchEntitySetName:function(t,e,n){var r=this._search(e,"/sap.card/configuration/parameters/_entitySet/value"),i=this._search(e,"/sap.card/configuration/parameters/_relevantODataParameters/value"),a=this._search(e,"/sap.insights/filterEntitySet"),s="";return this.getMetadataProperty(t,r).then(function(e){if(e){if(Object.keys(e).includes(n)){s=r}else if(!i.includes(n)){s=a}else{var u=this._search(e,"/Parameters/$Type"),c=u.split("."),h=c[c.length-1];return this.getMetadataProperty(t,h).then(function(t){return Object.keys(t).includes(n)?h:a})}}return s}.bind(this))},getMetadataProperty:function(t,e,n,r){if(!t||!t.getMetaModel){return false}return t.getMetaModel().requestObject("/"+e+"/"+(n||"")+(r||""))}}});
//# sourceMappingURL=V4MetadataAnalyser.js.map