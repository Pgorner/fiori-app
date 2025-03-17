/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */
sap.ui.define([],function(){"use strict";var e={getCustomColumns:function(e){if(!e.isInitialised()){throw new Error("getCustomColumns method called before the SmartTable is initialized - "+e.getId())}return e._aExistingColumns.map(t=>e._getColumnByKey(t))}};return e},true);
//# sourceMappingURL=TableUtil.js.map