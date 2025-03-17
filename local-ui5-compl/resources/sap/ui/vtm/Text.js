/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/m/Text","sap/m/TextRenderer","./TextColor"],function(jQuery,e,t,a){"use strict";sap.ui.vtm.Text=e.extend("sap.ui.vtm.Text",{metadata:{properties:{textColor:{type:"sap.ui.vtm.TextColor",defaultValue:a.Default,bindable:true}}},renderer:function(e,r){var s=r.getTextColor();switch(s){case a.Default:break;case a.Grey:case a.Gray:e.addClass("sapUiVtmText_TextColor_Gray");break;default:throw"Unexpected text color: '"+s+"'."}t.render(e,r)}});return sap.ui.vtm.Text});
//# sourceMappingURL=Text.js.map