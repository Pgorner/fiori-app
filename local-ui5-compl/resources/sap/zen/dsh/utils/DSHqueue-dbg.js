/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/base/Log",
    "sap/zen/dsh/utils/request",
    "sap/sac/df/firefly/library"
  ],
  function( Log, Request ){
    "use strict";
    Log.info("Load DSHqueue");
    Request.containsCommand = function(){
      return true;
    };
    Request.getCommandSequence = function(){
      return false;
    };
    Request.zenSendCommandArrayWoEventWZenPVT = function() {
      return "";
    };
    sap.zen.dsh.buddhaHasSendLock = 0;
    Request.que.instance.isSendAllowed = function(){
      return sap.zen.dsh.buddhaHasSendLock === 0;
    };
    sap.zen.dsh.putInQueue = function(funcletToExecute){
      var queExecutor = function(elemGiven){
        if(sap.zen.dsh.buddhaHasSendLock > 0){
          Request.que.instance.insertAtStart(elemGiven);
        }else{
          sap.zen.dsh.buddhaHasSendLock++;
          setTimeout(funcletToExecute,0);
          //                      funcletToExecute();
        }
      };
      Request.que.instance.push({"parameterArray":null,"bOnlyEmptyDeltaWillReturn":false, "funclet": queExecutor});
      Request.que.instance.wanderQue(1);
    };
  }
);
