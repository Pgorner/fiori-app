/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap, Promise*/
sap.ui.define(
  "sap/sac/df/utils/SyncActionHelper",
  [
    "sap/base/Log",
    "sap/sac/df/utils/ListHelper",
    "sap/sac/df/thirdparty/lodash",
    "sap/sac/df/firefly/library"
  ],
  function (Log, ListHelper, _, oFF) {
    Log.info("Load SyncAction Helper");

    function SyncActionHelper() {
      const that = this;

      function reject(oExtResult) {
        const oError = new Error(oExtResult.getSummary());
        oError.getMessages = _.constant(ListHelper.arrayFromList(
          oExtResult.getMessages()
        ).map(function (message) {
          let sSeverity = message.getSeverity().getName();
          if (sSeverity === "Info") {
            sSeverity = "Information";
          }
          return {
            Text: message.getText(),
            Severity: sSeverity,
            Code: message.getCode(),
            MessageClass: message.getMessageClass(),
            LongTextUri: message.getMessageClass() ? [
              "/sap/opu/odata/iwbep/message_text;message=LOCAL/T100_longtexts(MSGID='",
              encodeURIComponent(message.getMessageClass()), "',MSGNO='", encodeURIComponent(message.getCode()), "',MESSAGE_V1='',MESSAGE_V2='',MESSAGE_V3='',MESSAGE_V4='')/$value"
            ].join("") : null
          };
        }));
        return oError;
      }

      that.reject = reject;
      that.syncActionToPromise = function (fSyncAction, that, aParams) {
        let fResolve, fReject;

        function handleDialog(resolve, reject) {
          fResolve = resolve;
          fReject = reject;
        }

        function handle(oSyncAction) {
          if (oSyncAction.hasErrors()) {
            fReject(reject(oSyncAction));
          } else {
            fResolve(oSyncAction.getData());
          }
        }

        const oProm = new Promise(handleDialog);
        fSyncAction.apply(that, _.concat([oFF.SyncType.NON_BLOCKING, handle], aParams));
        return oProm;
      };
    }

    return new SyncActionHelper();
  }
);
