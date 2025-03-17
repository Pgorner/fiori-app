/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */
jQuery.sap.declare("sap.uiext.inbox.composite.InboxAttachmentsTileContainerRenderer");sap.uiext.inbox.composite.InboxAttachmentsTileContainerRenderer={};sap.uiext.inbox.composite.InboxAttachmentsTileContainerRenderer.render=function(e,t){e.write("<div");e.writeControlData(t);e.write(">");if(t.getShowAddTile())e.renderControl(t.getAggregation("firstTile"));for(var i=0;i<t.getAttachments().length;i++){e.renderControl(t.getAttachments()[i])}e.write("<div");e.addClass("sapUiExtInboxAttachmentHidden");e.writeClasses();e.write(">");e.renderControl(t.oFileUploader);e.write("</div>");e.write("</div>")};
//# sourceMappingURL=InboxAttachmentsTileContainerRenderer.js.map