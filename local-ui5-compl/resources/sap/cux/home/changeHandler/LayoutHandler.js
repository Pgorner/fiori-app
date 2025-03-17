/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";sap.ui.define([],function(){"use strict";class e{allChanges=[];loadPersonalizationDialog(e,s){return new Promise(a=>{this.persDialogResolve=a;this.keyuserPersDialog=e.getAggregation("keyUserSettingsDialog");this.keyuserPersDialog.addStyleClass(s.styleClass);this.keyuserPersDialog.open()})}onCancelDialog(){this.keyuserPersDialog.close()}addChanges(e){this.allChanges.push(...e)}clearChanges(){this.allChanges=[]}resolve(){this.persDialogResolve(this.allChanges)}}const s=new e;return s});
//# sourceMappingURL=LayoutHandler.js.map