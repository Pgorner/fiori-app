/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/changeHandler/condenser/Classification"],function(e){"use strict";var t={};t.applyChange=async function(e,t,n){const a=e.getContent();const i=n.modifier;const o=await i.getStashed(t);e.setRevertData({originalValue:o});const r=await i.setStashed(t,false,n.appComponent)||t;if(a.parentAggregationName){const e=a.parentAggregationName;const t=i.getParent(r);await i.moveAggregation(t,e,t,e,r,a.index,n.view)}return r};t.revertChange=async function(e,t,n){var a=e.getRevertData();await n.modifier.setStashed(t,a.originalValue);e.resetRevertData()};t.completeChangeContent=function(e,t){if(t.content){e.setContent(t.content)}};t.getCondenserInfo=function(t){return{affectedControl:t.getSelector(),classification:e.Reverse,uniqueKey:"stashed"}};return t});
//# sourceMappingURL=UnstashControl.js.map