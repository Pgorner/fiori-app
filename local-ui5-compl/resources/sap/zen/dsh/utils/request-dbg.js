/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
    "sap/zen/dsh/utils/request",
  [
    "jquery.sap.global",
    "sap/base/Log"
  ],
  function( jQuery, Log ){
    "use strict";
 
    var request = {};
    request.zenSendCommandArrayWoEventWZenPVT = function(parameterArray, bOnlyEmptyDeltaWillReturn, useSDKfunclet) {
      var funcletToUse;
      if(useSDKfunclet){
        funcletToUse = function(nextCommand) {
          if (nextCommand) {
            request.ricSendCommand(nextCommand);
          }
        };
      }else{
        funcletToUse = function(nextCommand) {
          if (nextCommand) {
            request.zenSendCommand(nextCommand);
          }
        };
      }
      request.que.instance.push({"parameterArray":parameterArray,"bOnlyEmptyDeltaWillReturn":bOnlyEmptyDeltaWillReturn, "funclet": funcletToUse});
      request.que.instance.wanderQue(1);
    };
    request.getCommandSequence = function(parameterArray){
      var commandSeq;
      var parameterList = sap.zen.dsh.sapbi_createParameterList(parameterArray);
      var isSequence = parameterList.exists(sap.zen.dsh.sapbi_COMMAND);
      if (!isSequence) {
        commandSeq = new sap.zen.dsh.sapbi_CommandSequence();
        commandSeq.addCommand(parameterList);
      } else {
        commandSeq = parameterList;
      }
      return commandSeq;
    };
    request.zenSendCommand = function(parameterObject) {
      if (sap.zen.dsh.sapbi_page.m_hasSendLock) {
        Log.debug("zenSendCommand m_hasSendLock",parameterObject.parameterArray.join(),"bi_command_utils.js");
        request.que.instance.insertAtStart(parameterObject);
      } else {
        var commandSeq = request.getCommandSequence(parameterObject.parameterArray);

        // TODO should check command sequence to only contain paging commands
        if (request.containsCommand(commandSeq, "navigate_by_scrolling") || request.containsCommand(commandSeq, "after_rendering") || parameterObject.bOnlyEmptyDeltaWillReturn) {
          sap.zen.dsh.getLoadingIndicator().disableForNextCall();
        }
        Log.debug("zenSendCommand",parameterObject.parameterArray.join(),"bi_command_utils.js");
        sap.zen.dsh.sapbi_page.sendCommandWoPVTWoServerStateChange(commandSeq);
      }
    };
    request.ricSendCommand = function(command) {
      if (sap.zen.dsh.sapbi_page.m_hasSendLock) {
        Log.debug("zenSendCommand m_hasSendLock",command,"bi_command_utils.js");
        request.que.instance.insertAtStart(command);
      } else {
        Log.debug("zenSendCommand",command,"bi_command_utils.js");
        sap.zen.dsh.sapbi_page.sendCommandWoPVTWoServerStateChange(command.parameterArray);
      }
    };
    request.zenSendUpdateCommand = function(parameterArray) {
      sap.zen.dsh.sapbi_page.m_useSnippets = true;
      request.zenSendCommandArrayWoEventWZenPVT(parameterArray,false);
    };

    request.que = function() {
      var aItems = [];
      var insideQue = false;
      this.push = function(itemToBePushed) {
        if(this.paused) {
          return;
        }
        if (aItems && aItems.push) {
          aItems.push(itemToBePushed);
        }
      };

      this.getFirstElement = function() {
        if (aItems.length > 0) {
          var tempVal = aItems[0];
          aItems.shift();
          return tempVal;
        } else {
          return null;
        }
      };

      this.size = function() {
        return aItems.length;
      };

      this.reset = function(){
        aItems = [];
        insideQue = false;
      };

      this.insertAtStart = function(itemToBeInserted) {
        if(this.paused) {
          return;
        }
        aItems.unshift(itemToBeInserted);
      };
      var that = this;
      this.wanderQue = function(msToTryAgain) {
        if (this.size() > 0) {

          if (!insideQue) {
            if(this.isSendAllowed()){
              var firstElem = request.que.instance.getFirstElement();
              firstElem.funclet(firstElem);
            }
            if (this.size() !== 0) {
              setTimeout(function() {
                Log.debug("wanderQue","in setTimeout","bi_command_utils.js");
                insideQue = false;
                that.wanderQue(msToTryAgain);
              }, msToTryAgain);
              insideQue = true;
            }
          }

        }
      };


      this.isSendAllowed = function(){
        //This can be used by other deployments to prevent command sending in special circumstances.
        //It is currently used by DSH.
        return true;
      };

      this.stopScheduling = function() {
        this.paused = true;
      };
      this.continueScheduling = function() {
        this.paused = false;
      };
    };
    request.que.instance = new request.que();

    request.isPagingCommand = function(command,sCommandTypeValue) {
      var commandType = command.getParameter(sap.zen.dsh.sapbi_COMMAND_TYPE);
      if (commandType != null) {
        var commandTypeValue = commandType.getValue();

        if (commandTypeValue != null) {
          return commandTypeValue.toLowerCase() === sCommandTypeValue;
        }
      }
      return false;
    };
    request.containsCommand = function(parameterList, sCommandTypeValue) {
      if (parameterList.getParameterCount) {
        var cnt = parameterList.getParameterCount(sap.zen.dsh.sapbi_COMMAND);
        if (cnt > 0) {
          var indices = parameterList.getIndices(sap.zen.dsh.sapbi_COMMAND);
          for (var i = 0; i < cnt; i++) {
            var ix = indices[i];
            var command = parameterList.getParameterByIndex(sap.zen.dsh.sapbi_COMMAND, ix);
            if (command) {
              var cl = command.getChildList();

              if (cl != null) {
                if (request.isPagingCommand(cl,sCommandTypeValue)) {
                  return true;
                }
              }
            }
          }
        } else {
          if (request.isPagingCommand(parameterList,sCommandTypeValue)) {
            return true;
          }
        }
      }
      return false;
    };
    return request;
  }
);
