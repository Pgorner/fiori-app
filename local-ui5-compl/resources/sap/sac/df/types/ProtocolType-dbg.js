
/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap */
sap.ui.define(
  "sap/sac/df/types/ProtocolType",
  [
  ],
  function(){
    /**
     *  Protocol Type
     *
     * @enum {string}
     * @alias sap.sac.df.types.ProtocolType
     * @private
     */
    var ProtocolType = {
      /**
       * HTTP
       * @public
       **/
      HTTP: "HTTP",
      /**
       * HTTPS
       * @public
       **/
      HTTPS: "HTTPS",
      /**
       * WASABI
       * @public
       **/
      WASABI: "WASABI"
      
      
    };
    return ProtocolType;
  }
);
