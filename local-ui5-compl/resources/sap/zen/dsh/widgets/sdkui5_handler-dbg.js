/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/base/Log",
    "sap/sac/df/thirdparty/lodash",
    "sap/zen/dsh/utils/BaseHandler",
    "sap/zen/dsh/utils/request"
  ],
  function(jQuery, Log, _, BaseHandler, Request){
    "use strict";
    var Handler = function() {
      BaseHandler.apply(this, arguments);
      var bIsInPropertyDispatch = false;
      function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      this.updateProperty = function(oControl, sPropName, aProperties) {
        if (sPropName === "type" || sPropName === "handler_name"||sPropName === "id")
          return; // Ignore our technical  properties, they could clash with inherited UI5 properties
        var uppercased = capitaliseFirstLetter(sPropName);
        var setter = oControl["set" + uppercased];
        if (setter) {
          var newVal = aProperties[sPropName];
          try {
            setter.call(oControl, newVal);
          }
          catch(e) {
            Log.error(e);
          }
        }
      };
      this.dispatchProperties = function(oControl, oControlProperties, oComponentProperties) {
        oControl.oComponentProperties = oComponentProperties;
        if (oControlProperties) {
          if (oControl.beforeDesignStudioUpdate) {
            oControl.beforeDesignStudioUpdate();
          }
          bIsInPropertyDispatch = true;
          for (var sPropName in oControlProperties) {
            oControl.oControlProperties[sPropName] = oControlProperties[sPropName];
            this.updateProperty(oControl, sPropName, oControlProperties);
          }
          bIsInPropertyDispatch = false;
          if (oControl.afterDesignStudioUpdate) {
            oControl.afterDesignStudioUpdate();
          }
        }
      };
      function createCommand(aNames) {
        var command = new sap.zen.dsh.sapbi_Command("UPDATE_PROPERTIES");
        command.addParameter(new sap.zen.dsh.sapbi_Parameter("TARGET_ITEM_REF", this.oComponentProperties.id));
        var changes = new sap.zen.dsh.sapbi_Parameter("CHANGES", "");
        var childListChanges = new sap.zen.dsh.sapbi_ParameterList();
        for (var i = 0; i < aNames.length; i++) {
          var propName = aNames[i];
          var value = this["get" + capitaliseFirstLetter(propName)]();
          if (Array.isArray(value) || (typeof value == "object")) {
            value = JSON.stringify(value);
          }
          childListChanges.addParameter(new sap.zen.dsh.sapbi_Parameter(propName, value));
        }
        changes.setChildList(childListChanges);
        command.addParameter(changes);
        return command;
      }
      function resolvePath(sClass) {
        if (!sClass)
          return undefined;
        var aPath = sClass.split(".");
        var oResolvedPath = window;
        for ( var i = 0; i < aPath.length; i++) {
          var sOnePathPart = aPath[i];
          oResolvedPath = oResolvedPath[sOnePathPart];
          if(!oResolvedPath){
            break;
          }
        }
        return oResolvedPath;
      }
      this.create = function(oChainedControl, oControlProperties, oComponentProperties) {
        var id = oControlProperties["id"];
        var controlClass = resolvePath(oControlProperties["handler_name"]);
        if (controlClass) {
          var oControl = new controlClass(id, {dsControlProperties: oControlProperties, dsComponentProperties: oComponentProperties});
          // dsControlProperties and dsComponentPropeties are passed into the constructor to enable controls to do decision from start up.
          // They don't have any other effect
          oControl.oControlProperties = {}; // Will be later filled in dispatchProperties
          oControl.fireDesignStudioEvent = function(sName) {
            if (!bIsInPropertyDispatch) {
              if (typeof (sap.zen.dsh.DSH_deployment) == "undefined") {
                var event = [["EVENT_NAME",sName,0],["BI_COMMAND_TYPE","",0],["COMPONENT_NAME",this.oComponentProperties.id, 0],["COMMAND_INTERPRETER","BIAL",0]];
                Request.zenSendCommandArrayWoEventWZenPVT(event);
              }
              else {
                var idToUse = this.oComponentProperties.id;
                var buddhaId = "Buddha";
                if (this.oControlProperties.pureId) {
                  buddhaId = this.oControlProperties.buddhaId;
                  idToUse = this.oControlProperties.pureId;
                }
                var sCommand = idToUse +  ".runScript\x28\x27" + sName + "\x27\x29\x3b";
                sap.zen.dsh.putInQueue(function(){
                  if(!sap.zen.dsh.wnd){
                    Log.error("No wnd");
                  } else {
                    sap.zen.dsh.wnd[buddhaId].exec(sCommand);
                  }
                });
              }
            }
          };
          oControl.fireDesignStudioPropertiesChanged = function(aNames) {
            if (!bIsInPropertyDispatch) {
              if (typeof (sap.zen.dsh.DSH_deployment) == "undefined") {
                var command = createCommand.call(this, aNames);
                Request.zenSendCommandArrayWoEventWZenPVT(command, false, true);
              } else {
                var tempReturnJSON = [];
                for (var i = 0; i < aNames.length; i++) {
                  var propName = aNames[i];
                  var value = this["get" + capitaliseFirstLetter(propName)]();
                  tempReturnJSON.push(propName);
                  tempReturnJSON.push(value);
                }
                var idToUse = this.oComponentProperties.id;
                var buddhaId = "Buddha";
                if (this.oControlProperties.pureId) {
                  buddhaId = this.oControlProperties.buddhaId;
                  idToUse = this.oControlProperties.pureId;
                }
                sap.zen.dsh.putInQueue(function() {
                  if(!sap.zen.dsh.wnd){
                    Log.error("No wnd");
                  } else {
                    sap.zen.dsh.wnd[buddhaId].exec(idToUse + ".doSDKPVT(" + JSON.stringify(tempReturnJSON) + ");");
                  }
                });
              }
            }
          };
          oControl.fireDesignStudioPropertiesChangedAndEvent = function(aNames, sEvent, bNoUndo) {
            if (!bIsInPropertyDispatch && typeof (sap.zen.dsh.DSH_deployment) == "undefined") {
              var command = createCommand.call(this, aNames);
              if (bNoUndo) {
                command.addParameter(new sap.zen.dsh.sapbi_Parameter("PREVENT_UNDO", "X"));
              }
              var sequence = new sap.zen.dsh.sapbi_CommandSequence();
              sequence.addCommand(command);
              var event = [["EVENT_NAME",sEvent,0],["BI_COMMAND_TYPE","",0],["COMPONENT_NAME",this.oComponentProperties.id, 0],["COMMAND_INTERPRETER","BIAL",0]];
              var eventCommand = sap.zen.dsh.sapbi_createParameterList(event);
              if (bNoUndo) {
                eventCommand.addParameter(new sap.zen.dsh.sapbi_Parameter("PREVENT_UNDO", "X"));
              }
              sequence.addCommand(eventCommand);
              Request.zenSendCommandArrayWoEventWZenPVT(sequence, false, true);
            } else {
              this.fireDesignStudioPropertiesChanged(aNames);
              this.fireDesignStudioEvent(sEvent);
            }
          };
          oControl.getZtlCallFunction = function() {
            return this._ztlFunction;
          };
          oControl.setZtlCallFunction = function(value) {
            this._ztlFunction = value;
            return this;
          };
          oControl.getZtlCallPayload = function() {
            return this._ztlPayload;
          };
          oControl.setZtlCallPayload = function(value) {
            this._ztlPayload = value;
            return this;
          };
          oControl.setZtlCallResult = function(value) {
            if (value !== undefined && this._ztlCallCallback) {
              this._ztlCallCallback.call(this, JSON.parse(value));
              return this;
            }
          };
          oControl.callZTLFunction = function(sName, fCallback) {
            var args = Array.prototype.slice.apply(arguments); // First convert to normal array
            args = args.slice(2); // now cut the non-needed stuff
            this.setZtlCallPayload(JSON.stringify(args)).setZtlCallFunction(sName);
            this._ztlCallCallback = fCallback;
            this.fireDesignStudioPropertiesChangedAndEvent(["ztlCallPayload", "ztlCallFunction"], "onZtlCall");
          };
          oControl.callZTLFunctionNoUndo = function(sName, fCallback) {
            var args = Array.prototype.slice.apply(arguments); // First convert to normal array
            args = args.slice(2); // now cut the non-needed stuff
            this.setZtlCallPayload(JSON.stringify(args)).setZtlCallFunction(sName);
            this._ztlCallCallback = fCallback;
            this.fireDesignStudioPropertiesChangedAndEvent(["ztlCallPayload", "ztlCallFunction"], "onZtlCall", true);
          };
          if (oControl.initDesignStudio) {
            oControl.initDesignStudio();
          }
          this.dispatchProperties(oControl, oControlProperties, oComponentProperties);
          return oControl;
        }
        return null;
      };
      this.update = function(oControl, oControlProperties, oComponentProperties) {
        this.dispatchProperties(oControl, oControlProperties, oComponentProperties);
        return oControl;
      };
      this.advancedPropertyCall = function(oControl) {
        var funcName = arguments[1];
        var func = oControl[funcName];
        if (func) {
          var realArguments = Array.prototype.slice.apply(arguments); // First convert to normal array
          realArguments = realArguments.slice(2); // now cut the non-needed stuff
          return func.apply(oControl, realArguments);
        }
        return null;
      };
      this.getType = function() {
        return "sdkui5";
      };
      this.getDecorator = function() {
        return "SdkControlDecorator";
      };
    };
    var instance = new Handler();
    BaseHandler.dispatcher.addHandlers(instance.getType(), instance);
    return instance;
  }
);
