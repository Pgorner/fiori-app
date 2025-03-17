/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/zen/dsh/utils/BaseHandler",
    "sap/zen/dsh/widgets/databuffer",
    "sap/ui/model/ClientModel",
    "sap/ui/model/ClientListBinding"
  ],
  function(jQuery, BaseHandler, DataBuffer, ClientModel, ClientListBinding){
    "use strict";
    /**
     * Constructor for a new SDKModel.
     *
     * @class
     * Model implementation for JSON format
     *
     * @extends sap.ui.model.Model
     *
     *
     * @param {object} oData either the URL where to load the JSON from or a JS object
     * @constructor
     * @public
     * @name sap.zen.dsh.widgets.SDKModel
     * @deprecated Since version 1.89.0, Please use the WD Grid control instead.
     */
    var SDKModel = ClientModel.extend(
      "sap.zen.dsh.widgets.SDKModel",  {
        constructor : function(oData) {
          ClientModel.apply(this, arguments);
          if (oData && typeof oData == "object"){
            this.setData(oData);
          }
        },
        metadata : {
          //      publicMethods : ["setJSON", "getJSON"]
        }
      }
    );
    SDKModel.prototype.setData = function(oData){
      this.buffer = new DataBuffer(null, oData);
      this.checkUpdate();
    };
    SDKModel.prototype._getSelections = function (sPath, oContext) {
      var selection = this._getObject(sPath, oContext);
      if (isSelection(selection)) {
        var modifiedSelection = [], i;
        for (i=0; i<selection.length; i++) {
          if (selection[i] === undefined) {
            // Use the first fitting cell - it will be replaced with correct value later
            modifiedSelection[i] = [-1];
          } else {
            modifiedSelection[i] = selection[i];
          }
        }
        var result = this.buffer.fetchData(modifiedSelection, {includeTuples: true, includeResults: true});
        var sSelectionsResult = [];
        for (i=0; i<result.tuples.length; i++) {
          var tuple = result.tuples[i];
          var sNewSelection = [];
          sNewSelection.isSelection = true;
          for (var j=0; j<tuple.length; j++) {
            if (selection[j]===null || selection[j]===false ) { // it was a * or ?
              sNewSelection[j] = [tuple[j]];
            } else {
              sNewSelection[j] = selection[j];
            }
          }
          sSelectionsResult.push(sNewSelection);
        }
        return sSelectionsResult;
      } else {
        // Assume normal array
        return selection;
      }
    };
    function intersectSelections(aParentSel, aCurrentSel) {
      if (!aParentSel)
        return aCurrentSel;
      var aResult = [];
      aResult.isSelection = true;
      for (var i=0; i<aCurrentSel.length; i++) {
        if (aCurrentSel[i] === undefined)
          aResult[i] = aParentSel[i];
        else
          aResult[i] = aCurrentSel[i];
      }
      return aResult;
    }
    SDKModel.prototype._parsePart = function(sPath) {
      if (sPath.indexOf(":") === -1) {
        return null;
      }
      if (sPath.charAt(0) === "/") {
        sPath = sPath.substring(1);
      }
      sPath = sPath.replace(/%2F/g, "/");
      var sel = eval("({" +  sPath + "})");
      var result=this.buffer.getIndexSelection(sel);
      result.isSelection = true;
      return result;
    };
    function isSelection(o) {
      return o && o.isSelection === true;
    }
    SDKModel.prototype._getObject = function(sPath, oContext) {
      if (sPath === "/dimensions") {
        return this.buffer.buffer.dimensions;
      }
      var parentObject = null;
      var iSlashPos = sPath.lastIndexOf("/");
      if (iSlashPos > 0) {
        var prefix = sPath.substring(0, iSlashPos);
        sPath = sPath.substring(iSlashPos+1);
        parentObject = this._getObject(prefix, oContext);
      } else if (iSlashPos === -1 && !oContext) {
        return null;
      } else if (oContext) {
        parentObject = oContext.oSelection;
      }

      var data;
      if (sPath === "value") {
        // Assuming that parentObject is a selection
        data = this.buffer.fetchData(parentObject,  {includeData: true, includeResults: true});
        return data.data[0];
      }
      if (sPath === "formattedValue") {
        // Assuming that parentObject is a selection
        data = this.buffer.fetchData(parentObject,  {includeFormattedData: true, includeResults: true});
        return data.formattedData[0];
      }

      if (sPath === "format") {
        // Assuming that parentObject is a selection
        data = this.buffer.fetchData(parentObject,  {includeConditionalFormats: true, includeResults: true});
        return data.conditionalFormatValues[0];

      }

      var currentSelection = this._parsePart(sPath);
      if (currentSelection != null) {
        // Assuming that parentObject is a selection or null
        return intersectSelections(parentObject, currentSelection);
      }
      if (isSelection(parentObject)) {
        var dim = _findByKey(this.buffer.buffer.dimensions, sPath);
        if (dim  !== -1 && parentObject) {
          return this.buffer.buffer.dimensions[dim].members[parentObject[dim]];
        }
      }

      if (parentObject && !isSelection(parentObject)) {
        // Assuming parentObject is an object or array
        if (Array.isArray(parentObject) && parentObject[sPath] === undefined) {
          sPath = _findByKey(parentObject, sPath);
        }
        return parentObject[sPath];

      }

      return null;
    };

    function _findByKey(array, sKey) {
      sKey = sKey.replace(/%2F/g, "/");
      for (var i=0; i<array.length; i++) {
        var entry = array[i];
        if (entry.key === sKey) {
          return i;
        }
        if (sKey === "(MEASURES_DIMENSION)" && entry.containsMeasures) {
          return i;
        }
      }
      return -1;
    }
    SDKModel.prototype.getProperty = function(sPath, oContext) {
      return this._getObject(sPath, oContext);
    };
    SDKModel.prototype.bindList = function(sPath, oContext, aSorters, aFilters, mParameters) {
      var oBinding = new sap.zen.model.SDKListBinding(this, sPath, oContext, aSorters, aFilters, mParameters);
      return oBinding;
    };
    /**
     * @see sap.ui.model.Model.prototype.bindProperty
     *
     */
    SDKModel.prototype.bindProperty = function(sPath, oContext, mParameters) {
      var oBinding = new sap.zen.model.SDKPropertyBinding(this, sPath, oContext, mParameters);
      return oBinding;
    };

    var SDKListBinding = ClientListBinding.extend("sap.zen.dsh.widgets.SDKListBinding");
    SDKListBinding.prototype.getContexts = function(iStartIndex, iLength) {
      if (!iStartIndex) {
        iStartIndex = 0;
      }
      if (!iLength) {
        iLength = Math.min(this.iLength, this.oModel.iSizeLimit);
      }
      var iEndIndex = Math.min(iStartIndex + iLength, this.aIndices.length);
      var oContext, aContexts = [], sPrefix = this.oModel.resolve(this.sPath, this.oContext);
      if (sPrefix && !jQuery.sap.endsWith(sPrefix, "/")) {
        sPrefix += "/";
      }
      for (var i = iStartIndex; i < iEndIndex; i++) {
        oContext = this.oModel.getContext(sPrefix + this.aIndices[i]);
        oContext.oSelection = this.oList[i];
        aContexts.push(oContext);
      }

      return aContexts;
    };


    /**
     * Update the list, indices array and apply sorting and filtering
     * @private
     */
    SDKListBinding.prototype.update = function(){
      this.oList = this.oModel._getSelections(this.sPath, this.oContext);
      if (!this.oList) {
        this.oList = [];
      }
      this.updateIndices();
      this.applyFilter();
      this.applySort();
      this.iLength = this._getLength();
    };

    /**
     * Check whether this Binding would provide new values and in case it changed,
     * inform interested parties about this.
     *
     * @param {boolean} bForceupdate
     *
     */
    SDKListBinding.prototype.checkUpdate = function(bForceupdate){
      // TODO: Not sure if this implementation is good and efficient.
      var oList = this.oModel._getObject(this.sPath, this.oContext);
      if (!jQuery.sap.equal(this.oList, oList) || bForceupdate) {
        this.update();
        this._fireChange({reason: sap.ui.model.ChangeReason.Change});
      }

    };






    var SDKPropertyBinding = sap.ui.model.ClientPropertyBinding.extend("sap.zen.dsh.widgets.SDKPropertyBinding");

    /**
     * Creates a new subclass of class sap.ui.model.json.JSONPropertyBinding with name <code>sClassName</code>
     * and enriches it with the information contained in <code>oClassInfo</code>.
     *
     * For a detailed description of <code>oClassInfo</code> or <code>FNMetaImpl</code>
     * see {@link sap.ui.base.Object.extend Object.extend}.
     *
     * @param {string} sClassName name of the class to be created
     * @param {object} [oClassInfo] object literal with informations about the class
     * @param {function} [FNMetaImpl] alternative constructor for a metadata object
     * @return {function} the created class / constructor function
     * @public
     * @static
     * @name sap.ui.model.json.JSONPropertyBinding.extend
     * @function
     */
    /**
     * @see sap.ui.model.PropertyBinding.prototype.setValue
     */
    SDKPropertyBinding.prototype.setValue = function(){
      // TODO
    };
    SDKPropertyBinding.prototype.checkUpdate = function(bForceupdate){
      var oValue = this._getValue();
      if(!jQuery.sap.equal(oValue, this.oValue) || bForceupdate) {// optimize for not firing the events when unneeded
        this.oValue = oValue;
        this._fireChange({reason: sap.ui.model.ChangeReason.Change});
      }
    };
    return SDKModel;
  }
);
