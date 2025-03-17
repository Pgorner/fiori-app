/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Lib","sap/ui/rta/command/AppDescriptorCommand"],function(e,r){"use strict";var a=r.extend("sap.ui.rta.command.appDescriptor.AddLibrary",{metadata:{library:"sap.ui.rta",events:{}}});a.prototype.init=function(){this.setChangeType("appdescr_ui5_addLibraries")};a.prototype.execute=function(){var r=[];if(this.getParameters().libraries){var a=Object.keys(this.getParameters().libraries);a.forEach(function(a){r.push(e.load({name:a}))})}return Promise.all(r)};return a},true);
//# sourceMappingURL=AddLibrary.js.map