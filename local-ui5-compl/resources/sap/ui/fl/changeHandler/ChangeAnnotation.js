/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/changeHandler/condenser/Classification"],function(n){"use strict";const t={};t.applyChange=function(n){return{path:n.getContent().annotationPath,value:n.getContent().value}};t.revertChange=function(){};t.completeChangeContent=function(n,t){n.setContent({annotationPath:t.content.annotationPath,value:t.content.value})};t.getCondenserInfo=function(t,e){return{affectedControl:e.appComponent,classification:n.LastOneWins,uniqueKey:`${t.getContent().annotationPath}_${t.getChangeType()}`}};return t});
//# sourceMappingURL=ChangeAnnotation.js.map