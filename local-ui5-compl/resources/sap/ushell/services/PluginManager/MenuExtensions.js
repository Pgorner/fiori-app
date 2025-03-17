// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/Container"],function(n){"use strict";function e(e){return function r(t){return n.getServiceAsync("Menu").then(function(n){return n.getEntryProvider(e,t)})}}return function(n){return{getMenuEntryProvider:e(n)}}});
//# sourceMappingURL=MenuExtensions.js.map