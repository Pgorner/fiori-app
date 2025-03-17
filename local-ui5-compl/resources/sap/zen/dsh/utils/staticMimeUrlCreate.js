/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/sac/df/firefly/library"],function(e){"use strict";e.info("Load staticMimeUrlCreate");sap.zen.createStaticMimeUrl=function(e){var a="";var t=e.lastIndexOf(".");var i=e.lastIndexOf("/");if(i>t){t=-1}if(sap.zen.dsh.doReplaceDots){for(var r=0;r<e.length;r++){var s=e.charAt(r);if(r==t){a+=s}else{if(s=="."){if(e.charAt(r+1)=="."){a+="..";r++}else{a+="_"}}else{a+=s}}}}return sap.zen.dsh.sapbi_page.staticMimeUrlPrefix+a};sap.zen.createStaticSdkMimeUrl=function(e,a){e=e.replace(/\./g,"_");return"/designstudio_extensions/"+e+"/"+a};return sap.zen.createStaticMimeUrl});
//# sourceMappingURL=staticMimeUrlCreate.js.map