/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Icon","sap/ui/core/IconRenderer","./library"],function(jQuery,e,i,s){"use strict";var t=e.extend("sap.ui.vtm.CheckEye",{metadata:{library:"sap.ui.vtm",properties:{visibility:{type:"boolean"}}},onAfterRendering:function(){var e=this.$();e.addClass("sapUiVtmCheckEye")},renderer:i.render,setVisibility:function(e){this.setProperty("visibility",e);switch(e){case true:this.setSrc("sap-icon://show");this.setVisible(true);break;case false:this.setSrc("sap-icon://hide");this.setVisible(true);break;default:this.setVisible(false);break}}});return t},true);
//# sourceMappingURL=CheckEye.js.map