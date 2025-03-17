/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/base/security/sanitizeHTML"],function(e,t){"use strict";return e.extend("sap.ui.documentation.JSDocText",{metadata:{library:"sap.ui.documentation",properties:{text:{type:"string",defaultValue:""},sanitizeContent:{type:"boolean",group:"Misc",defaultValue:true}}},renderer:{apiVersion:2,render:function(e,n){var i=n.getText();if(n.getSanitizeContent()){i=t(i)}e.openStart("div",n);e.class("sapUiJSD");e.openEnd();e.unsafeHtml(i);e.close("div")}}})});
//# sourceMappingURL=JSDocText.js.map