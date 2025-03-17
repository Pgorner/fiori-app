/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Control","sap/m/Text","sap/m/ProgressIndicator"],function(jQuery,e,r,s){"use strict";var t=e.extend("sap.ui.vtm.Progress",{metadata:{aggregations:{progressText:{type:"sap.m.Title",multiple:false},progressBar:{type:"sap.m.ProgressIndicator",multiple:false}}},init:function(){var e=new sap.m.ProgressIndicator({width:"100%"});e.addStyleClass("sapUiVtmProgress_progressBar");this.setProgressBar(e);var r=new sap.m.Title({width:"100%",titleStyle:sap.ui.core.TitleLevel.H3,textAlign:sap.ui.core.TextAlign.Center});r.addStyleClass("sapUiVtmProgress_progressText");this.setProgressText(r);this.addStyleClass("sapUiVtmProgress")},renderer:function(e,r){e.write("<div");e.writeControlData(r);e.addStyle("height","inherit");e.writeStyles();e.writeClasses();e.write(">");e.renderControl(r.getProgressText());e.renderControl(r.getProgressBar());e.write("</div>")}});return t});
//# sourceMappingURL=Progress.js.map