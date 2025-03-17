/*!
* SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
*/
/*global sap, Promise */
sap.ui.define(
  "sap/sac/df/model/visualization/Documents",
  [
    "sap/ui/base/Object",
    "sap/sac/df/firefly/library",
    "sap/sac/df/utils/ResourceBundle",
    "sap/sac/df/utils/ListHelper",
    "sap/sac/df/utils/SyncActionHelper",
    "sap/sac/df/types/DocumentsSupportType"
  ], /*eslint-disable max-params*/
  function (
    BaseObject,
    FF,
    ResourceBundle,
    ListHelper,
    SyncActionHelper,
    DocumentsSupportType
  ) {
    "use strict";
    /*eslint-disable max-statements*/

    /**
         * @class
         * Documents manager object
         *
         * <b>Structure of Exposed Data:</b>
         * <pre><code>
         * "ActiveDocumentsDirectory": "",
         * "DocumentsSupportType": ""
         * "IsBasedOnCDSView": ""
         * </code></pre>
         * @author SAP SE
         * @version 1.132.0
         * @public
         * @hideconstructor
         * @experimental since version 1.119
         * @since 1.119
         * @alias sap.sac.df.model.visualization.Documents
         */
    var Document = BaseObject.extend("sap.sac.df.model.visualization.Documents", /** @lends sap.sac.df.model.visualization.Documents.prototype */ {

      constructor: function (oDataProvider) {
        Object.assign(this, Object.getPrototypeOf(this));
        /** @private */
        this._DataProvider = oDataProvider;
        /** @public */
        this.ActiveDocumentsDirectory = this._getDocumentsInfo().getActiveDocumentsDirectory();
        /** @public */
        this.DocumentsSupportType = this.getDocumentsSupportType();
        /** @public */
        this.IsBasedOnCDSView = this._getDocumentsInfo().isBasedOnCDSView();

        /**@private */
        this._extractProperties = (oDocVersion) => {
          if (oDocVersion) {
            var oContent = oDocVersion.getContent();
            let oProperties = oDocVersion.getProperties();
            var oTimestamp = oDocVersion.getTimeStamp();
            return {
              version: oDocVersion.getVersion(),
              owner: oDocVersion.getOwner(),
              timestamp: oTimestamp ? oTimestamp.toString() : null,
              content: oContent ? oContent.getStringContentExt() : null,
              properties: oProperties && oProperties.convertToNative()
            };
          }
          return null;
        };
        /**@private */
        this._updateDocument = (sDocumentId, sContent, oProperties) => {
          if (!sDocumentId) {
            throw new Error("Cannot update document without document ID");
          }
          var oDocumentsInfo = this._getDocumentsInfo();
          if (oDocumentsInfo && this.supportsWrite()) {
            var oDocStoreService = oDocumentsInfo.getOrCreateDocumentsStoreService(false);
            if (oProperties) {
              oDocStoreService.addToPutListWithProperties(sDocumentId, FF.XContent.createStringContent(FF.ContentType.TEXT_PLAIN, sContent), FF.PrUtils.deserialize(JSON.stringify(oProperties)));
            } else {
              oDocStoreService.addToPutList(sDocumentId, FF.XContent.createStringContent(FF.ContentType.TEXT_PLAIN, sContent));
            }
            return SyncActionHelper.syncActionToPromise(
              oDocStoreService.performRequests,
              oDocStoreService,
              [null, null]
            ).then(() => {
              var oContent = oDocStoreService.getContentForFile(sDocumentId);
              return Promise.resolve(oContent ? oContent.getStringContentExt() === sContent : oContent === sContent);
            }).catch((oError) => {
              this._DataProvider._Model._addMessages(oError.getMessages ? oError.getMessages() : []);
              return Promise.reject(oError);
            });
          } else {
            throw new Error("No 'ReadWrite' document support. Unable to update document.");
          }
        };

        /** @private */
        this._retrieveDocuments = (aDocumentIds, sVersion) => {
          if (!aDocumentIds || aDocumentIds.length === 0) {
            throw new Error("Cannot retrieve document without document ID");
          }

          var oDocumentsInfo = this._getDocumentsInfo();
          if (oDocumentsInfo) {
            var oDocSupport = oDocumentsInfo.getSupportsDocuments();
            if (oDocSupport && oDocSupport.getName() !== "None") {
              var oDocStoreService = oDocumentsInfo.getOrCreateDocumentsStoreService(!sVersion);
              aDocumentIds.forEach((sDocumentId) => {
                oDocStoreService.addToFetchList(sDocumentId);
              });

              return SyncActionHelper.syncActionToPromise(
                oDocStoreService.performRequests,
                oDocStoreService,
                [null, null]
              ).then(() => {
                var aDocumentsCollection = [];
                aDocumentIds.forEach((sDocumentId) => {
                  var aDocumentContents = [];
                  var aDocVersions = !sVersion ? oDocStoreService.getDocumentVersionsForFile(sDocumentId) : oDocStoreService.getDocumentVersionForFileAndVersion(sDocumentId, sVersion);
                  if (aDocVersions) {
                    aDocVersions.forEach((oDocVersion) => {
                      var oProperties = this._extractProperties(oDocVersion);
                      if (oProperties) {
                        aDocumentContents.push(oProperties);
                      }
                    });
                  }
                  aDocumentsCollection.push({
                    "documentId": sDocumentId,
                    "versions": aDocumentContents
                  });
                });
                return Promise.resolve(aDocumentIds.length === 1 ? aDocumentsCollection[0] : aDocumentsCollection);
              }).catch((oError) => {
                this._DataProvider._Model._addMessages(oError.getMessages ? oError.getMessages() : []);
                return Promise.reject(oError);
              });
            } else {
              throw new Error("No document support. Unable to retrieve document.");
            }
          }
        };
      }

    });

    /** @private */
    Document.prototype._executeDocumentIDAction = function (nRowIndex, nColumnIndex, sFunctionName) {
      const oDataProvider = this._DataProvider;
      var oDocumentIdManager = oDataProvider._getQueryManager().getResultsetContainer().getDocumentIdManager();
      var oCellIndexInfo = FF.RsCellIndexInfo.create();
      oCellIndexInfo.initialize(nRowIndex, nColumnIndex);
      return SyncActionHelper.syncActionToPromise(
        oDocumentIdManager[sFunctionName],
        oDocumentIdManager,
        oCellIndexInfo
      ).then((oExtResult) => {
        oDataProvider._FFDataProvider.getEventing().notifyExternalVisualizationChange(null);
        oDataProvider._addMessagesToModel(oExtResult);
        return oExtResult;
      }).catch((oError) => {
        oDataProvider._Model._addMessages(oError.getMessages ? oError.getMessages() : []);
        return Promise.reject(oError);
      });
    };

    /**
         * Creates a document ID for a data cell in the result set
         * @param {int} nRowIndex the row index
         * @param {int} nColumnIndex the column index
         * @returns {Promise<String>} a promise which resolves with the newly created document ID
         * @public
         */
    Document.prototype.createDocumentId = function (nRowIndex, nColumnIndex) {
      return this._executeDocumentIDAction(nRowIndex, nColumnIndex, "createCellDocumentId"
      ).then((oExtResult) => {
        return oExtResult.getData().getCellDocumentId();
      });
    };

    /** @private */
    Document.prototype._getDocumentsInfo = function () {
      return this._DataProvider._getQueryManager().getQueryModel().getDocumentsInfo();
    };

    /**
         * Get a document ID of a data cell in the result set
         * @param {int} nRowIndex the row index
         * @param {int} nColumnIndex the column index
         * @returns {Promise<String>} a promise which resolves with the document ID
         * @public
         */
    Document.prototype.getDocumentId = function (nRowIndex, nColumnIndex) {
      return this._executeDocumentIDAction(nRowIndex, nColumnIndex, "getCellDocumentId"
      ).then((oExtResult) => {
        return oExtResult.getData().getCellDocumentId();
      });
    };

    /**
         * Delete a document ID for a data cell in the result set
         * @param {int} nRowIndex the row index
         * @param {int} nColumnIndex the column index
         * @returns {Promise<boolean>} a promise which resolves to true if the delete operation is successful, otherwise false.
         * @public
         */
    Document.prototype.deleteDocumentId = function (nRowIndex, nColumnIndex) {
      return this._executeDocumentIDAction(nRowIndex, nColumnIndex, "deleteCellDocumentId"
      ).then((oExtResult) => {
        return oExtResult.getData().isCellDocumentIdDeleted();
      });
    };
    /**
         * Create a document in the document store
         * @param sDocumentId the document ID
         * @param sContent the content of the document
         * @param oProperties properties (ideally as key-value-pair)
         * @returns {Promise<boolean>} a promise which resolves to true if create operation is successful, otherwise false.
         * @public
         */
    Document.prototype.createDocument = function (sDocumentId, sContent, oProperties) {
      if (!sDocumentId) {
        throw new Error("Cannot create document without document ID");
      }

      try {
        return this._updateDocument(sDocumentId, sContent, oProperties);
      } catch (oError) {
        return Promise.reject(oError);
      }
    };

    /**
         * Create and retrieve document in the document store
         * @param sDocumentId the document ID
         * @param sContent the content of the document
         * @param oProperties properties (ideally as key-value-pair)
         * @returns {Promise<object>} a promise which resolves with the newly created document.
         * @public
         */
    Document.prototype.createAndRetrieveDocument = function (sDocumentId, sContent, oProperties) {
      return new Promise((resolve, reject) => {
        if (!sDocumentId) {
          reject("Cannot create document without document ID");
          return;
        }
        try {
          const oDocumentsInfo = this._getDocumentsInfo();
          if (oDocumentsInfo && this.supportsWrite()) {
            const oDocStoreService = oDocumentsInfo.getOrCreateDocumentsStoreService(true);
            if (oProperties) {
              oDocStoreService.addToPutListWithProperties(sDocumentId, FF.XContent.createStringContent(FF.ContentType.TEXT_PLAIN, sContent), FF.PrUtils.deserialize(JSON.stringify(oProperties)));
            } else {
              oDocStoreService.addToPutList(sDocumentId, FF.XContent.createStringContent(FF.ContentType.TEXT_PLAIN, sContent));
            }
            oDocStoreService.addToFetchList(sDocumentId);

            SyncActionHelper.syncActionToPromise(
              oDocStoreService.performRequests,
              oDocStoreService,
              [null, null]
            ).then(() => {
              const oContent = oDocStoreService.getContentForFile(sDocumentId);
              if (oContent ? oContent.getStringContentExt() === sContent : oContent === sContent) {
                const aDocumentContents = [];
                const aDocVersions = oDocStoreService.getDocumentVersionsForFile(sDocumentId);
                if (aDocVersions) {
                  aDocVersions.forEach((oDocVersion) => {
                    const oProperties = this._extractProperties(oDocVersion);
                    if (oProperties) {
                      aDocumentContents.push(oProperties);
                    }
                  });
                }
                resolve({
                  "documentId": sDocumentId,
                  "versions": aDocumentContents
                });
              } else {
                reject("Failed to create document with specified content.");
              }
            }).catch((oError) => {
              this._DataProvider._Model._addMessages(oError.getMessages ? oError.getMessages() : []);
              reject(oError);
            });
          } else {
            reject("No 'ReadWrite' document support. Unable to create document.");
          }
        } catch (oError) {
          reject(oError);
        }
      });
    };


    /**
         * Retrieves a document from the document store
         * @param sDocumentId the document ID
         * @param sVersion the version of the document - if version is not supplied, returns all versions.
         * @returns {Promise<object>} a promise which resolves with the version(s) of the document.
         * @public
         */
    Document.prototype.retrieveDocument = function (sDocumentId, sVersion) {
      return this._retrieveDocuments([sDocumentId], sVersion);
    };

    /**
         * Retrieve multiple documents from the document store
         * @param aDocumentIds the array of document IDs
         * @returns {Promise<object>} a promise which resolves with all documents and its versions.
         * @public
         */
    Document.prototype.retrieveMultipleDocuments = function (aDocumentIds) {
      return this._retrieveDocuments(aDocumentIds);
    };


    /**
         * Delete a document in the document store
         * @param sDocumentId the document ID
         * @returns {Promise<boolean>} a promise which resolves to true if delete operation is successful, otherwise false.
         * @public
         */
    Document.prototype.deleteDocument = function (sDocumentId) {
      if (!sDocumentId) {
        throw new Error("Cannot delete document without document ID");
      }

      var oDocumentsInfo = this._getDocumentsInfo();
      if (oDocumentsInfo && this.supportsDelete()) {
        var oDocStoreService = oDocumentsInfo.getOrCreateDocumentsStoreService(false);
        oDocStoreService.addToDeleteList(sDocumentId);
        return SyncActionHelper.syncActionToPromise(
          oDocStoreService.performRequests,
          oDocStoreService,
          [null, null]
        ).then(() => {
          oDocStoreService.evictAllDocuments();
          return Promise.resolve(true);
        }).catch((oError) => {
          this._DataProvider._Model._addMessages(oError.getMessages ? oError.getMessages() : []);
          return Promise.reject(oError);
        });
      } else {
        throw new Error("No 'ReadWrite' document support. Unable to delete document.");
      }
    };

    /**
         * Get the type of documents support.
         * @returns {sap.sac.df.types.DocumentsSupportType} documents support type
         * @public
         */
    Document.prototype.getDocumentsSupportType = function () {
      var bSupportsCellDocumentId = this._DataProvider._getQueryModel().getModelCapabilities().supportsCellDocumentId();
      if (bSupportsCellDocumentId) {
        var oSupportsDocuments = this._getDocumentsInfo().getSupportsDocuments();
        if (oSupportsDocuments) {
          switch (oSupportsDocuments) {
            case FF.DocumentsSupportType.READ_WRITE:
              return DocumentsSupportType.ReadWrite;
            case FF.DocumentsSupportType.READ_CREATE_CHANGE:
              return DocumentsSupportType.ReadCreateChange;
            case FF.DocumentsSupportType.READ:
              return DocumentsSupportType.Read;
            case FF.DocumentsSupportType.NONE:
              return DocumentsSupportType.None;
          }
        }
      }
      return DocumentsSupportType.None;
    };

    /**
         * Is document storage supporting read access
         * @returns {boolean} if read access is supported
         * @public
         */
    Document.prototype.supportsRead = function () {
      return this.getDocumentsSupportType() === DocumentsSupportType.ReadWrite
                || this.getDocumentsSupportType() === DocumentsSupportType.ReadCreateChange
                || this.getDocumentsSupportType() === DocumentsSupportType.Read;
    };

    /**
         * Is document storage supporting write (create and change) access
         * @returns {boolean} if write (create and change) access is supported
         * @public
         */
    Document.prototype.supportsWrite = function () {
      return this.getDocumentsSupportType() === DocumentsSupportType.ReadWrite
                || this.getDocumentsSupportType() === DocumentsSupportType.ReadCreateChange;
    };

    /**
         * Is document storage supporting delete access
         * @returns {boolean} if delete access is supported
         * @public
         */
    Document.prototype.supportsDelete = function () {
      return this.getDocumentsSupportType() === DocumentsSupportType.ReadWrite;
    };

    return Document;
  }
);
