/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/merge","sap/ui/fl/initial/_internal/connectors/LrepConnector","sap/ui/fl/initial/_internal/connectors/Utils"],function(e,t,n){"use strict";var s={SETTINGS:"/flex/settings"};return e({},t,{loadFeatures(e){if(this.settings){return Promise.resolve(this.settings)}var t={};var i=n.getUrl(s.SETTINGS,e,t);return n.sendRequest(i,"GET",{initialConnector:this}).then(function(e){e.response.isContextSharingEnabled=false;return e.response})},loadVariantsAuthors(){return Promise.reject("loadVariantsAuthors is not implemented")}})});
//# sourceMappingURL=NeoLrepConnector.js.map