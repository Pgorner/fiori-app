/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.charts.ChartRenderer");sap.ca.ui.charts.ChartRenderer={render:function(e,t){if(!t.getDataset()){return}e.write("<div");e.writeControlData(t);e.addClass("sapCaUiChart");if(!t.getShowHoverBackground()){e.addClass("sapCaUiChartNoHover")}e.addStyle("width",t.getWidth());e.addStyle("height",t.getHeight());e.writeClasses();e.writeStyles();e.write(">");e.renderControl(t.getAggregation("internalContent"));e.write("</div>")}};
//# sourceMappingURL=ChartRenderer.js.map