/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";sap.ui.define(["sap/ui/base/Object","sap/ui/core/Component"],function(e,n){"use strict";const t="sap.cux";const o=e.extend("sap.cux.home.utils.PersonalisationUtils",{getPersContainerId:function e(o){return`${n.getOwnerIdFor(o)}--${t}`},getOwnerComponent:function e(t){return n.getOwnerComponentFor(t)}});var r=new o;return r});
//# sourceMappingURL=PersonalisationUtils-dbg.js.map