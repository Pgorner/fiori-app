/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/documentation/sdk/util/Resources","sap/ui/documentation/sdk/controller/util/TreeUtil"],function(jQuery,e,t){"use strict";var n;function r(t){if(n){return Promise.resolve(n)}return new Promise(function(r,u){jQuery.ajax({async:true,url:e.getResourceOriginPath(t.docuPath+"index.json"),dataType:"json",success:function(e){n=e;r(e)},error:function(e){u(e)}})})}function u(e,n){return r(n).then(function(n){var r=t.getInstance(t.treeTypes.Documentation,"key","links");var u=r.getNodeById(e,n);return u?.text})}return{getDocuIndexPromise:r,getDocumentTitle:u}});
//# sourceMappingURL=DocuInfo.js.map