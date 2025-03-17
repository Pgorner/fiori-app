/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Element","sap/ui/commons/Label"],function(jQuery,t,e){"use strict";var i=t.extend("sap.ui.vtm.Column",{metadata:{properties:{type:{type:"sap.ui.vtm.ColumnType"},descriptor:{type:"string"},tooltip:{type:"string",defaultValue:null},hAlign:{type:"sap.ui.core.HorizontalAlign",defaultValue:"Left"},width:{type:"sap.ui.core.CSSSize",defaultValue:"200px"},resizable:{type:"boolean",defaultValue:true},label:{type:"string"},labelControl:{type:"object"},valueFormatter:{type:"any"},tooltipFormatter:{type:"any"},template:{type:"sap.ui.core.Control"}}},constructor:function(e,i){if(jQuery.type(e)=="object"){i=e;e=i.id}t.apply(this,[e,{}]);if(i){if(i.type){this.setType(i.type)}if(i.descriptor){this.setDescriptor(i.descriptor)}if(i.label){this.setLabel(i.label)}if(i.labelControl){this.setLabelControl(i.labelControl)}if(i.tooltip){this.setTooltip(i.tooltip)}if(i.hAlign){this.setHAlign(i.hAlign)}if(i.width){this.setWidth(i.width)}if(i.resizable===true||i.resizable===false){this.setResizable(i.resizable)}if(i.valueFormatter){this.setValueFormatter(i.valueFormatter)}if(i.tooltipFormatter){this.setTooltipFormatter(i.tooltipFormatter)}if(i.template){this.setTemplate(i.template)}}}});return i});
//# sourceMappingURL=Column.js.map