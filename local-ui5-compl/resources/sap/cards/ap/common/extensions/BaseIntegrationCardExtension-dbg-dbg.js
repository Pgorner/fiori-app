/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/ui/integration/Extension", "../formatters/CardFormatters"], function (Extension, CardFormatters) {
  "use strict";

  class BaseIntegrationCardExtension extends Extension {
    constructor(id, extensionSettings) {
      super(id, extensionSettings);
      this.setFormatters(CardFormatters.getFormatters());
    }
  }
  return BaseIntegrationCardExtension;
});
//# sourceMappingURL=BaseIntegrationCardExtension-dbg-dbg.js.map
