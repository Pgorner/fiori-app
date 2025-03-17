/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.NotesRenderer");jQuery.sap.require("sap.m.ListRenderer");sap.ca.ui.NotesRenderer={};sap.ca.ui.NotesRenderer.render=function(e,r){e.write("<div");e.writeControlData(r);e.addClass("sapCaUiNotes");e.writeClasses();e.write(">");if(r.getShowNoteInput()){e.write("<div ");e.writeAttributeEscaped("id",r.getId()+"-noteInput");e.addClass("sapCaUiNoteInput");e.writeClasses();e.write(">");if(!jQuery.device.is.phone){e.renderControl(r._getFlexBox())}else{e.renderControl(r._oTextArea);e.renderControl(r._oButton)}e.write("</div>")}sap.m.ListRenderer.render(e,r);e.write("</div>")};
//# sourceMappingURL=NotesRenderer.js.map