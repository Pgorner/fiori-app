/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */
jQuery.sap.declare("sap.uiext.inbox.InboxConfiguration");sap.ui.base.Object.extend("sap.uiext.inbox.InboxConfiguration",{constructor:function(){sap.ui.base.Object.apply(this);this.iSearchUsersMaxLimit=100}});sap.uiext.inbox.InboxConfiguration.prototype.setSearchUsersMaxLimit=function(i){if(typeof i==="number"){this.iSearchUsersMaxLimit=i}};sap.uiext.inbox.InboxConfiguration.prototype.getSearchUsersMaxLimit=function(){return this.iSearchUsersMaxLimit};
//# sourceMappingURL=InboxConfiguration.js.map