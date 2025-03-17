/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control"],function(e){"use strict";const t=/(\$\{\d+\})/;return e.extend("sap.ui.documentation.JSDocType",{metadata:{library:"sap.ui.documentation",properties:{typeInfo:{type:"object",defaultValue:{}}}},renderer:{apiVersion:2,render:function(e,n){var r=n.getTypeInfo();if(!r?.UI5Types&&!r?.template){return}var i=r.template||"${0}",o=0;e.openStart("div",n);e.class("sapUiJSDocType");e.openEnd();i.split(t).forEach(function(n){if(t.test(n)){this._renderLinkForType(e,r.UI5Types[o++])}else{e.text(n)}},this);e.close("div")},_renderLinkForType:function(e,t){if(!t){return}e.openStart("a");e.class("sapUiJSDocTypeLink");e.attr("href","api/"+t);e.openEnd();e.text(t);e.close("a")}}})});
//# sourceMappingURL=JSDocType.js.map