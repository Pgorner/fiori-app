/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/controllerextensions/collaboration/CollaborationCommon", "sap/fe/test/api/CollaborationAPI", "sap/ui/test/OpaBuilder"], function (CollaborationCommon, CollaborationAPI, OpaBuilder) {
  "use strict";

  var Activity = CollaborationCommon.Activity;
  function CollaborationClient(oPageDefinition) {
    const sAppId = oPageDefinition.appId,
      sComponentId = oPageDefinition.componentId,
      viewId = `${sAppId}::${sComponentId}`;
    return {
      actions: {
        iEnterDraft: function (userID, userName) {
          return OpaBuilder.create(this).hasId(viewId).do(function (view) {
            const oContext = view.getBindingContext();
            CollaborationAPI.enterDraft(oContext, userID, userName);
          }).viewId("").description("Remote session entering draft").execute();
        },
        iLeaveDraft: function () {
          return OpaBuilder.create(this).do(function () {
            CollaborationAPI.leaveDraft();
          }).description("Remote session leaving draft").execute();
        },
        iLockPropertyForEdition: function (sPropertyPath) {
          return OpaBuilder.create(this).do(function () {
            CollaborationAPI.lockField(sPropertyPath);
          }).description(`Remote session locking property ${sPropertyPath}`).execute();
        },
        iUnlockPropertyForEdition: function () {
          return OpaBuilder.create(this).do(function () {
            CollaborationAPI.unlockField();
          }).description("Remote session unlocking property ").execute();
        },
        iUpdatePropertyValue: function (sPropertyPath, value) {
          return OpaBuilder.create(this).do(function () {
            CollaborationAPI.updatePropertyValue(sPropertyPath, value);
          }).description(`Remote session updating property ${sPropertyPath} with ${value}`).execute();
        },
        iDiscardDraft: function () {
          return OpaBuilder.create(this).do(function () {
            CollaborationAPI.discardDraft();
          }).description("Remote session discarding draft").execute();
        },
        iDeleteObject: function (objectPath) {
          return OpaBuilder.create(this).do(function () {
            CollaborationAPI.deleteObject(objectPath);
          }).description(`Remote session deleting object ${objectPath}`).execute();
        }
      },
      assertions: {
        iCheckDefaultUserChangedValue: function (sPropertyPath) {
          return OpaBuilder.create(this).check(function () {
            return CollaborationAPI.checkReceived({
              userID: "DEFAULT_USER",
              userAction: Activity.Change,
              clientContent: sPropertyPath
            });
          }).description(`Remote session received change notification for${sPropertyPath} changed`).execute();
        },
        iCheckDefaultUserRemovedLock: function (sPropertyPath) {
          return OpaBuilder.create(this).check(function () {
            // Check that we have received an UNLOCK without a CHANGE
            return !CollaborationAPI.checkReceived({
              userID: "DEFAULT_USER",
              userAction: Activity.Change,
              clientContent: sPropertyPath
            }, false) && CollaborationAPI.checkReceived({
              userID: "DEFAULT_USER",
              userAction: Activity.Unlock,
              clientContent: sPropertyPath
            });
          }).description(`Remote session received unlock without change notification for${sPropertyPath}`).execute();
        },
        iCheckValueIsLockedByDefaultUser: function (sPropertyPath) {
          return OpaBuilder.create(this).check(function () {
            return CollaborationAPI.checkLockedByOther(sPropertyPath);
          }).description(`On remote session, property ${sPropertyPath} is currently locked by another user`).execute();
        },
        iCheckValueIsNotLockedByDefaultUser: function (sPropertyPath) {
          return OpaBuilder.create(this).check(function () {
            return !CollaborationAPI.checkLockedByOther(sPropertyPath);
          }).description(`On remote session, property ${sPropertyPath} is not locked by another user`).execute();
        },
        iCheckDefaultUserLeftDraft: function () {
          return OpaBuilder.create(this).check(function () {
            return CollaborationAPI.checkReceived({
              userID: "DEFAULT_USER",
              userAction: Activity.Leave
            });
          }).description("Remote session received notification on default user leaving the draft session").execute();
        },
        iCheckDefaultUserEnteredDraft: function () {
          return OpaBuilder.create(this).check(function () {
            return CollaborationAPI.checkReceived({
              userID: "DEFAULT_USER",
              userAction: Activity.Join
            });
          }).description("Remote session received notification on default user entering the draft session").execute();
        },
        iCheckDefaultUserCreatedDocument: function (sDocumentPath) {
          return OpaBuilder.create(this).check(function () {
            return CollaborationAPI.checkReceived({
              userID: "DEFAULT_USER",
              userAction: Activity.Create,
              clientContent: sDocumentPath
            });
          }).description(sDocumentPath ? `Remote session received create notification for ${sDocumentPath}` : "Remote session received create notification").execute();
        }
      }
    };
  }
  return CollaborationClient;
}, false);
//# sourceMappingURL=CollaborationClient-dbg.js.map
