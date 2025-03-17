/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/apply/_internal/flexObjects/FlexObject"],function(e){"use strict";var t=e.extend("sap.ui.fl.apply._internal.flexObjects.AnnotationChange",{metadata:{properties:{serviceUrl:{type:"string",defaultValue:""}}},constructor:function(...t){e.apply(this,t);this.setFileType("annotation_change")}});t.getMappingInfo=function(){return{...e.getMappingInfo(),serviceUrl:"selector.serviceUrl"}};t.prototype.getMappingInfo=function(){return t.getMappingInfo()};t.prototype.getIdForCondensing=function(){return this.getServiceUrl()};return t});
//# sourceMappingURL=AnnotationChange.js.map