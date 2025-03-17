/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.define("sap/sac/df/utils/SyncActionHelper",["sap/base/Log","sap/sac/df/utils/ListHelper","sap/sac/df/thirdparty/lodash","sap/sac/df/firefly/library"],function(e,t,s,n){e.info("Load SyncAction Helper");function a(){const e=this;function a(e){const n=new Error(e.getSummary());n.getMessages=s.constant(t.arrayFromList(e.getMessages()).map(function(e){let t=e.getSeverity().getName();if(t==="Info"){t="Information"}return{Text:e.getText(),Severity:t,Code:e.getCode(),MessageClass:e.getMessageClass(),LongTextUri:e.getMessageClass()?["/sap/opu/odata/iwbep/message_text;message=LOCAL/T100_longtexts(MSGID='",encodeURIComponent(e.getMessageClass()),"',MSGNO='",encodeURIComponent(e.getCode()),"',MESSAGE_V1='',MESSAGE_V2='',MESSAGE_V3='',MESSAGE_V4='')/$value"].join(""):null}}));return n}e.reject=a;e.syncActionToPromise=function(e,t,o){let r,i;function c(e,t){r=e;i=t}function g(e){if(e.hasErrors()){i(a(e))}else{r(e.getData())}}const l=new Promise(c);e.apply(t,s.concat([n.SyncType.NON_BLOCKING,g],o));return l}}return new a});
//# sourceMappingURL=SyncActionHelper.js.map