/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
(function(){"use strict";window.addEventListener("message",function(t){if(t.origin!==window.location.protocol+"//"+window.location.host){return}var o=t.data,i,r;if(!o||!o.src||!o.moduleNameToRequire){return}n();e(o);sap.ui.require(["sap/ui/core/Theming"],function(e){i=e.getTheme();r=o.activeTheme;if(i!==r){e.setTheme(r)}})});function e(e){sap.ui.require.preload(e.src);sap.ui.require([e.moduleNameToRequire])}function n(){window.addEventListener("error",function(e){e.preventDefault();var n=document.createElement("span");n.innerText=e.message;n.style.cssText="position:absolute; top:1rem; left:1rem";if(!document.body){document.write("<span></span>")}document.body.appendChild(n)});window.addEventListener("unhandledrejection",function(e){e.preventDefault();var n=document.createElement("span");n.innerText=e.reason&&e.reason.message;n.style.cssText="position:absolute; top:1rem; left:1rem";if(!document.body){document.write("<span></span>")}document.body.appendChild(n)})}})();
//# sourceMappingURL=LiveEditorOutput.js.map