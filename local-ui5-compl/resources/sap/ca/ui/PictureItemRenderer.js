/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.PictureItemRenderer");sap.ca.ui.PictureItemRenderer={};sap.ca.ui.PictureItemRenderer.render=function(e,t){e.write("<div");e.writeControlData(t);e.addClass("sapCaUiPictureItem");e.writeClasses();var r=t._width||t.getWidth();var i=t._height||t.getHeight();e.addStyle("width",r);e.addStyle("height",i);e.writeStyles();e.writeAttribute("tabindex","0");e.write(">");e.renderControl(t._oImage);e.write("</div>")};
//# sourceMappingURL=PictureItemRenderer.js.map