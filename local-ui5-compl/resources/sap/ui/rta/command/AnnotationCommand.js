/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/write/api/ChangesWriteAPI","sap/ui/rta/command/FlexCommand","sap/ui/rta/library"],function(e,t,n){"use strict";const r=t.extend("sap.ui.rta.command.AnnotationCommand",{metadata:{library:"sap.ui.rta",properties:{changeType:{type:"string"},serviceUrl:{type:"string"},content:{type:"any"}},events:{}}});r.prototype._createChange=function(t,r,a){const o={...this._getChangeSpecificData(),...t,serviceUrl:this.getServiceUrl(),command:a,jsOnly:this.getJsOnly(),generator:t.generator||n.GENERATOR_NAME};return e.create({changeSpecificData:o,annotationChange:true,selector:this.getAppComponent()})};r.prototype.execute=function(){return Promise.resolve()};r.prototype.undo=function(){return Promise.resolve()};r.prototype.needsReload=true;return r});
//# sourceMappingURL=AnnotationCommand.js.map