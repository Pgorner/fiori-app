/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/TreeItemBase","./DemokitTreeItemRenderer"],function(e,t){"use strict";return e.extend("sap.ui.documentation.DemokitTreeItem",{metadata:{library:"sap.ui.documentation",properties:{title:{type:"string",defaultValue:""},deprecated:{type:"boolean",defaultValue:false},experimental:{type:"boolean",defaultValue:false},target:{type:"string",defaultValue:""},encodeTarget:{type:"boolean",defaultValue:false},section:{type:"string",defaultValue:"#"},entityType:{type:"string",defaultValue:""}}},renderer:t,setDeprecated:function(e){return this.setProperty("deprecated",!!e)},getHref:function(){return this.getSection()+"/"+(this.getEncodeTarget()?encodeURIComponent(this.getTarget()):this.getTarget())},_getPadding:e.prototype.getLevel})});
//# sourceMappingURL=DemokitTreeItem.js.map