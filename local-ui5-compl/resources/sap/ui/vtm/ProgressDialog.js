/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Control","sap/m/Dialog","./Progress"],function(jQuery,e,s,r,t){"use strict";var o=s.extend("sap.ui.vtm.ProgressDialog",{metadata:{properties:{progressText:{type:"string"},percentComplete:{type:"int",defaultValue:0},progressBarVisible:{type:"boolean",defaultValue:"true"}}},init:function(){this._oProgress=new sap.ui.vtm.Progress;this._oDialog=new sap.m.Dialog(this.getId()+"-Dialog",{showHeader:false,content:[this._oProgress],verticalScrolling:false,horizontalScrolling:false})},renderer:function(e,s){},open:function(){return this._oDialog.open()},isOpen:function(){return this._oDialog.isOpen()},close:function(){return this._oDialog.close()},setPercentComplete:function(e){this.setProperty("percentComplete",e);this._oProgress.getProgressBar().setPercentValue(e);sap.ui.getCore().applyChanges()},setProgressText:function(e){this.setProperty("progressText",e);this._oProgress.getProgressText().setText(e);sap.ui.getCore().applyChanges()},setProgressBarVisible:function(e){this.setProperty("progressBarVisible",e);this._oProgress.getProgressBar().setVisible(e)}});return o});
//# sourceMappingURL=ProgressDialog.js.map