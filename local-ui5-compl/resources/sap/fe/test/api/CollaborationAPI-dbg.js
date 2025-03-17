/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/AppComponent", "sap/fe/core/controllerextensions/MessageHandler", "sap/fe/core/controllerextensions/collaboration/ActivityBase", "sap/fe/core/controllerextensions/collaboration/CollaborationCommon", "sap/fe/core/controllerextensions/editFlow/draft", "sap/ui/model/json/JSONModel"], function (Log, AppComponent, MessageHandler, ActivityBase, CollaborationCommon, draft, JSONModel) {
  "use strict";

  var Activity = CollaborationCommon.Activity;
  var initializeCollaboration = ActivityBase.initializeCollaboration;
  var endCollaboration = ActivityBase.endCollaboration;
  var broadcastCollaborationMessage = ActivityBase.broadcastCollaborationMessage;
  const CollaborationAPI = {
    _lastReceivedMessages: [],
    _rootPath: "",
    _oModel: undefined,
    _lockedPropertyPath: "",
    _internalModel: undefined,
    _receivedLocks: [],
    /**
     * Open an existing collaborative draft with a new user, and creates a 'ghost client' for this user.
     * @param oContext The context of the collaborative draft
     * @param userID The ID of the user
     * @param userName The name of the user
     */
    enterDraft: function (oContext, userID, userName) {
      const webSocketBaseURL = oContext.getModel().getMetaModel().getObject("/@com.sap.vocabularies.Common.v1.WebSocketBaseURL");
      if (!webSocketBaseURL) {
        Log.error("Cannot find WebSocketBaseURL annotation");
        return;
      }
      const sDraftUUID = oContext.getProperty("DraftAdministrativeData/DraftUUID");
      this._internalModel = new JSONModel({});
      const model = oContext.getModel();
      initializeCollaboration({
        id: userID,
        name: userName,
        initialName: userName
      }, sDraftUUID, this._internalModel, this._onMessageReceived.bind(this), {
        getModel: function () {
          return model;
        }
      }, true);
      this._rootPath = oContext.getPath();
      this._oModel = model;
    },
    /**
     * Checks if the ghost client has received a given message.
     * @param message The message content to be looked for
     * @param resetHistory If true, reset history of received messages
     * @returns True if a previously received message matches the content
     */
    checkReceived: function (message) {
      let resetHistory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      if (this._lastReceivedMessages.length === 0) {
        return false;
      }
      const found = this._lastReceivedMessages.some(receivedMessage => {
        return (!message.userID || message.userID === receivedMessage.userID) && (!message.userAction || message.userAction === receivedMessage.userAction) && (!message.clientContent || message.clientContent === receivedMessage.clientContent);
      });
      if (resetHistory) {
        this._lastReceivedMessages = []; // by default, reset history to avoid finding the same message twice
      }
      return found;
    },
    /**
     * Closes the ghost client and removes the user from the collaborative draft.
     */
    leaveDraft: function () {
      if (this._internalModel) {
        endCollaboration(this._internalModel);
        this._internalModel.destroy();
        this._internalModel = undefined;
      }
    },
    /**
     * Simulates that the user starts typing in an input (live change).
     * @param sPropertyPath The path of the property being modified
     */
    lockField: function (sPropertyPath) {
      if (this._internalModel) {
        if (this._lockedPropertyPath) {
          // Unlock previous property path
          this.unlockField();
        }
        this._lockedPropertyPath = sPropertyPath;
        broadcastCollaborationMessage(Activity.Lock, `${this._rootPath}/${sPropertyPath}`, this._internalModel);
      }
    },
    /**
     * Simulates that the user has modified a property.
     * @param sPropertyPath The path of the property being modified
     * @param value The new value of the property being modified
     */
    updatePropertyValue: function (sPropertyPath, value) {
      if (this._internalModel) {
        if (this._lockedPropertyPath !== sPropertyPath) {
          this.lockField(sPropertyPath);
        }
        const oContextBinding = this._oModel.bindContext(this._rootPath, undefined, {
          $$patchWithoutSideEffects: true,
          $$groupId: "$auto",
          $$updateGroupId: "$auto"
        });
        const oPropertyBinding = this._oModel.bindProperty(sPropertyPath, oContextBinding.getBoundContext());
        oPropertyBinding.requestValue().then(() => {
          oPropertyBinding.setValue(value);
          oContextBinding.attachEventOnce("patchCompleted", () => {
            broadcastCollaborationMessage(Activity.Change, `${this._rootPath}/${sPropertyPath}`, this._internalModel);
            this.unlockField();
            this._lockedPropertyPath = "";
          });
        }).catch(function (err) {
          Log.error(err);
        });
      }
    },
    /**
     * Simulates that the user unlocked a field (to be called after lockField).
     */
    unlockField: function () {
      if (this._lockedPropertyPath) {
        broadcastCollaborationMessage(Activity.Unlock, `${this._rootPath}/${this._lockedPropertyPath}`, this._internalModel);
        this._lockedPropertyPath = "";
      }
    },
    /**
     * Simulates that the user has discarded the draft.
     */
    discardDraft: function () {
      if (this._internalModel) {
        const draftContext = this._getDraftContext();
        draftContext.requestProperty("IsActiveEntity").then(() => {
          draft.deleteDraft(draftContext, new MessageHandler(), new AppComponent());
        }).then(() => {
          broadcastCollaborationMessage(Activity.Discard, this._rootPath.replace("IsActiveEntity=false", "IsActiveEntity=true"), this._internalModel);
          this._internalModel.destroy();
          this._internalModel = undefined;
        }).catch(function (err) {
          Log.error(err);
        });
      }
    },
    /**
     * Simulates that the user has deleted an object (child of draft root).
     * @param objectPath The path of the object to delete
     */
    deleteObject: function (objectPath) {
      if (this._internalModel) {
        const objectContext = this._getObjectContext(objectPath);
        objectContext.requestProperty("IsActiveEntity").then(() => {
          objectContext.delete();
          broadcastCollaborationMessage(Activity.Delete, objectPath, this._internalModel);
        }).catch(err => {
          Log.error(err);
        });
      }
    },
    /**
     * Checks if a property has been locked by another user.
     * @param objectPath
     * @returns True if locked
     */
    checkLockedByOther: function (objectPath) {
      return this._receivedLocks.includes(objectPath);
    },
    // /////////////////////////////
    // Private methods

    _getDraftContext: function () {
      return this._getObjectContext(this._rootPath);
    },
    _getObjectContext: function (path) {
      return this._oModel.bindContext(path, undefined, {
        $$patchWithoutSideEffects: true,
        $$groupId: "$auto",
        $$updateGroupId: "$auto"
      }).getBoundContext();
    },
    /**
     * Callback of the ghost client when receiving a message on the web socket.
     * @param message
     */
    _onMessageReceived: function (message) {
      message.userAction = message.userAction || message.clientAction;
      if (!message.clientContent) {
        message.clientContent = "";
      }
      this._lastReceivedMessages.push(message);
      switch (message.userAction) {
        case Activity.Join:
          broadcastCollaborationMessage(Activity.JoinEcho, this._lockedPropertyPath ? `${this._rootPath}/${this._lockedPropertyPath}` : undefined, this._internalModel);
          break;
        case Activity.JoinEcho:
        case Activity.Lock:
          this._receivedLocks.push(...message.clientContent.split("|"));
          break;
        case Activity.Unlock:
          this._receivedLocks = this._receivedLocks.filter(lock => {
            return !message.clientContent.split("|").includes(lock);
          });
          break;
        default:
        // Nothing
      }
    }
  };
  return CollaborationAPI;
}, false);
//# sourceMappingURL=CollaborationAPI-dbg.js.map
