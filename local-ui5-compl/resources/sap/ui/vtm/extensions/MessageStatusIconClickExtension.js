/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Control","../Extension"],function(jQuery,e,t){"use strict";var s=t.extend("sap.ui.vtm.extensions.MessageStatusIconClickExtension",{metadata:{interfaces:["sap.ui.vtm.interfaces.IMessageStatusIconClickExtension"]},constructor:function(e,s){t.apply(this,arguments)},initialize:function(){this.applyPanelHandler(function(e){var t=e.getTree();var s;t.attachMessageStatusIconClicked(function(e){if(!this.getEnabled()){return}if(s&&s.isOpen()){s.close()}var t=e.getParameter("item");var a=e.getParameter("control");var i=sap.ui.vtm.TreeItemUtilities.getMessages(t);if(i.length){i.sort(sap.ui.core.Message.compareByType).reverse();s=new sap.ui.vtm.MessagesPopover({messages:i,maxHeight:"300px"});s.openBy(a)}}.bind(this))}.bind(this))}});return s});
//# sourceMappingURL=MessageStatusIconClickExtension.js.map