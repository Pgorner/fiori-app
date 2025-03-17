/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
sap.ui.define(["sap/apf/utils/exportToGlobal"],function(e){"use strict";var r=function(e){this.oCoreApi=e;this.getRepresentationSortInfo=function(e){var r=this;var t=jQuery.Deferred();var o=e.parameter.dimensions.concat(e.parameter.measures);var a=e.parameter.orderby;var i=a.map(function(e){var t;var a=jQuery.Deferred();o.forEach(function(o){if(e.property===o.fieldName&&o.fieldDesc&&r.oCoreApi.getTextNotHtmlEncoded(o.fieldDesc)){t=r.oCoreApi.getTextNotHtmlEncoded(o.fieldDesc);a.resolve(t)}});if(!t){r.oCoreApi.getMetadataFacade().getProperty(e.property).done(function(e){if(e.label||e.name){if(e.label){a.resolve(e.label)}else if(e.name){a.resolve(e.name)}else{a.resolve("")}}})}return a.promise()});t.resolve(i);return t.promise()}};e("sap.apf.ui.utils.Helper",r);return r},true);
//# sourceMappingURL=helper.js.map