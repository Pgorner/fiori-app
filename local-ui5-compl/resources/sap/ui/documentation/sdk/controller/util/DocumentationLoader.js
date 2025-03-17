/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/documentation/sdk/controller/util/ResourceDownloadUtil","sap/ui/documentation/sdk/controller/util/XML2JSONUtils"],function(t,n){"use strict";var e={};var r;var u={fetch:function(t){if(!(t in e)){e[t]=this._fetch(t)}return e[t]},_fetch:function(e){return t.fetch(e).then(function(t){return n.XML2JSON(t,r)})}};return{getInstance:function(t){r=t;return u}}},true);
//# sourceMappingURL=DocumentationLoader.js.map