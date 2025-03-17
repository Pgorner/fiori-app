/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/zen/dsh/utils/request","sap/sac/df/firefly/library"],function(e,n){"use strict";e.info("Load DSHqueue");n.containsCommand=function(){return true};n.getCommandSequence=function(){return false};n.zenSendCommandArrayWoEventWZenPVT=function(){return""};sap.zen.dsh.buddhaHasSendLock=0;n.que.instance.isSendAllowed=function(){return sap.zen.dsh.buddhaHasSendLock===0};sap.zen.dsh.putInQueue=function(e){var a=function(a){if(sap.zen.dsh.buddhaHasSendLock>0){n.que.instance.insertAtStart(a)}else{sap.zen.dsh.buddhaHasSendLock++;setTimeout(e,0)}};n.que.instance.push({parameterArray:null,bOnlyEmptyDeltaWillReturn:false,funclet:a});n.que.instance.wanderQue(1)}});
//# sourceMappingURL=DSHqueue.js.map