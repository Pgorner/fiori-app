/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap */
sap.ui.define(
  "sap/sac/df/types/DocumentsSupportType",
  [],
  function () {
    /**
     * Documents support type
     *
     * @enum {string}
     * @alias sap.sac.df.types.DocumentsSupportType
     * @experimental since version 1.120
     * @public
     */
    var DocumentsSupportType = {
      /**
       * Documents are not supported.
       * @public
       **/
      None: "NONE",
      /**
       * Read-only documents support.
       * @public
       **/
      Read: "READ",
      /**
       * Read, create, change, delete documents support.
       * @public
       **/
      ReadWrite: "READ_WRITE",
      /**
       * Read, create, change documents support.
       * @public
       **/
      ReadCreateChange: "READ_CREATE_CHANGE"
    };
    return DocumentsSupportType;
  }
);
