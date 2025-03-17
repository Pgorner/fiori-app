/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/isEmptyObject","sap/ui/fl/apply/_internal/changes/Utils","sap/ui/fl/apply/_internal/flexObjects/FlexObjectFactory"],function(e,t,n){"use strict";var r="$sap.ui.fl.changes";function a(e){var t=e&&e.getEntry&&e.getEntry(r)&&e.getEntry(r).descriptor||[];return t.map(function(e){return n.createAppDescriptorChange(e)})}var s={async applyChanges(n,r,a){const s=[];for(const e of r){s.push(await t.getChangeHandler({flexObject:e}))}s.forEach(function(t,s){try{const p=r[s];n=t.applyChange(n,p);if(!t.skipPostprocessing&&!e(p.getTexts())){n=a.processTexts(n,p.getTexts())}}catch(e){a.handleError(e)}});return n},applyChangesIncludedInManifest(e,t){var n=a(e);var s=e.getJson();delete s[r];if(n.length>0){return this.applyChanges(s,n,t).then(function(){return})}return Promise.resolve()}};return s});
//# sourceMappingURL=Applier.js.map