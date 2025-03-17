/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 * @fileOverview This file handles the resource bundles for ovp framework.
 */
sap.ui.define(["sap/ui/model/resource/ResourceModel","sap/ovp/app/OVPLogger","sap/ui/core/Lib"],function(e,r,o){"use strict";var u={};u.oResourceBundle=null;u.oResourceModel=null;var n=new r("OVP.app.resources");u.pResourcePromise=new Promise(function(r,l){try{var t=o.getResourceBundleFor("sap.ovp");if(!t){return l("Bundle creation failure")}u.oResourceBundle=t;u.oResourceModel=new e({bundleUrl:t.oUrlInfo.url,bundle:t});r(t)}catch(e){n.error("sap.ovp resource library bundle error:"+e);return l("Bundle creation failure")}});u.getText=function(e,r){if(r&&r.length>0){return this.oResourceBundle?this.oResourceBundle.getText(e,r):null}else{return this.oResourceBundle?this.oResourceBundle.getText(e):null}};u.getProperty=function(e){return this.oResourceModel?this.oResourceModel.getProperty(e):null};return u},true);
//# sourceMappingURL=resources.js.map