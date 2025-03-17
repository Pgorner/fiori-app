/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log"],function(e){"use strict";var n={URL:sap.ui.require.toUrl("sap/ui/documentation/sdk/controller/util/IndexWorker.js"),COMMANDS:{INIT:"fetch",SEARCH:"search"},RESPONSE_FIELDS:{DONE:"bDone",SEARCH_RESULT:"oSearchResult"}},r,t;function a(){if(!r){r=new Promise(function(e,r){t=new window.Worker(n.URL);t.addEventListener("message",function(t){var a=t.data;if(t.data.error){r(t.data.error)}e(a&&a[n.RESPONSE_FIELDS.DONE]===true)},false);t.postMessage({cmd:n.COMMANDS.INIT})})}return r}function o(r,o){return new Promise(function(s,i){a().then(function(){t.addEventListener("message",function(e){var r=e.data;s(r&&r[n.RESPONSE_FIELDS.SEARCH_RESULT])},false);t.postMessage({cmd:n.COMMANDS.SEARCH,query:r,options:o})}).catch(function(n){e.error(n)})})}return{init:a,search:o}});
//# sourceMappingURL=SearchUtil.js.map