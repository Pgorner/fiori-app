/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/util/IFrame"],function(){"use strict";return function(e,t,n,a){var i=t.modifier;var r=e.getContent();var s=t.view;var o=t.appComponent;var u={_settings:{}};["url","width","height"].forEach(function(e){var t=r[e];u[e]=t;u._settings[e]=t});if(r?.advancedSettings){u.advancedSettings=r.advancedSettings;u._settings.advancedSettings=r?.advancedSettings}if(a){u.renameInfo=a;u.asContainer=true}return Promise.resolve().then(function(){return i.createControl("sap.ui.fl.util.IFrame",o,s,n,u,false)})}});
//# sourceMappingURL=createIFrame.js.map