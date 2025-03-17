/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */
jQuery.sap.declare("sap.uiext.inbox.InboxLaunchPadRenderer");sap.uiext.inbox.InboxLaunchPadRenderer={};sap.uiext.inbox.InboxLaunchPadRenderer.render=function(e,a){e.write('<div style="height:100%; width:100%;"');e.writeControlData(a);e.addClass("sapUiextInboxInboxLaunchPadRfct");e.writeClasses();e.write(">");e.renderControl(a.getAggregation("launchPadHeader"));e.write('<div style="height:90%; width:100%;"');e.addClass("sapUiextInboxTileContainer");e.writeClasses();e.write(">");e.renderControl(a.getAggregation("launchPadTileContainer"));e.write("</div>");e.write("</div>")};
//# sourceMappingURL=InboxLaunchPadRenderer.js.map