/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/base/BindingToolkit","sap/fe/core/controls/CommandExecution","sap/fe/base/jsx-runtime/jsx"],function(e,n,i){"use strict";var a={};var s=e.resolveBindingString;function t(e,a,t){let o;let d;const c=a.visible?s(a.visible):undefined;const r=a.enabled?s(a.enabled):undefined;switch(a.type){case"ForAction":o=t.onExecuteAction;d=t.isActionEnabled!==undefined?s(t.isActionEnabled):r;break;case"ForNavigation":o=t.onExecuteIBN;d=t.isIBNEnabled!==undefined?s(t.isIBNEnabled):r;break;default:o=t.onExecuteManifest;d=t.isEnabled!==undefined?s(t.isEnabled):r}return i(n,{"core:require":"{FPM: 'sap/fe/core/helpers/FPMHelper'}",execute:o,enabled:d,visible:t.visible??c,command:e??a.command})}a.getCommandExecutionForAction=t;return a},false);
//# sourceMappingURL=ActionCommand.js.map