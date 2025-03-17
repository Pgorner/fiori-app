/*!
 * Copyright (c) 2009-2023 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/base/Log","sap/ushell/appRuntime/ui5/plugins/baseRta/AppLifeCycleUtils"],function(e,n){"use strict";const t={createActionButton:async function(t,i,o){const s=n.getContainer();const c=await s.getServiceAsync("FrameBoundExtension");try{const e=await c.createUserAction({id:t.mConfig.id,text:t.mConfig.i18n.getText(t.mConfig.text),icon:t.mConfig.icon,press:i},{controlType:"sap.ushell.ui.launchpad.ActionItem"});if(o){e.showForAllApps()}else{e.hideForAllApps()}return e}catch(n){e.error(n,undefined,t.mConfig.sComponentName)}},exit:function(){}};return t},true);
//# sourceMappingURL=Renderer.js.map