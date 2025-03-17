/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";sap.ui.define(["./BaseApp"],function(e){"use strict";function t(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}const r=t(e);const s=r.extend("sap.cux.home.Group",{metadata:{library:"sap.cux.home",properties:{number:{type:"string",group:"Misc",defaultValue:""},groupId:{type:"string",group:"Misc",defaultValue:""}},aggregations:{apps:{type:"sap.cux.home.App",multiple:true,singularName:"app"}},events:{press:{parameters:{groupId:{type:"string"}}}}},constructor:function e(t,s){r.prototype.constructor.call(this,t,s)},_handlePress:function e(){this.firePress({groupId:this.getGroupId()})}});return s});
//# sourceMappingURL=Group.js.map