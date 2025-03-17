/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control"],function(t){"use strict";return t.extend("sap.ui.documentation.BorrowedList",{metadata:{library:"sap.ui.documentation",properties:{list:{type:"array"}}},renderer:{apiVersion:2,render:function(t,e){var a=e.getList(),n,r,i;t.openStart("div",e);t.openEnd();for(i=0,r=a.length;i<r;i++){n=a[i];t.openStart("a");t.attr("href",n.link).attr("role","link").attr("tabindex","0").class("sapMLnk").class("sapMLnkMaxWidth").class("sapUiTinyMargin").openEnd().text(n.name).close("a")}t.close("div")}}})});
//# sourceMappingURL=BorrowedList.js.map