/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.DatePickerRenderer");jQuery.sap.require("sap.m.InputBaseRenderer");jQuery.sap.require("sap.ui.core.Renderer");sap.ca.ui.DatePickerRenderer=sap.ui.core.Renderer.extend(sap.m.InputBaseRenderer);sap.ca.ui.DatePickerRenderer.addOuterClasses=function(e){e.addClass("sapCaUiDatePicker");e.addClass("sapMInput");e.addClass("sapMInputVH")};sap.ca.ui.DatePickerRenderer.writeInnerContent=function(e,a){e.write('<div class="sapMInputValHelp sapCaUi5Workaround_sapMInputBaseDynamicContent">');e.renderControl(a._getCalendarIcon());e.write("</div>")};
//# sourceMappingURL=DatePickerRenderer.js.map