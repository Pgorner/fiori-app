/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Element"],function(t){"use strict";var e=t.extend("sap.ui.documentation.WebPageTitleUtil",{metadata:{properties:{title:{type:"string",defaultValue:""}}}});e.prototype.setTitle=function(t){if(t){document.title=t;this.setProperty("title",t,true)}return this};return e});
//# sourceMappingURL=WebPageTitleUtil.js.map