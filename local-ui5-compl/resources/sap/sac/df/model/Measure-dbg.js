/*! SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
   */
/*global sap */
sap.ui.define(
  "sap/sac/df/model/Measure",
  [
    "sap/ui/base/Object"
  ], /*eslint-disable max-params*/
  function (
    BaseObject
  ) {
    "use strict";
    /*eslint-disable max-statements*/
    /**
     *
     * @class
     * Measure
     * @author SAP SE
     * @version 1.132.0
     * @private
     * @hideconstructor
     * @experimental since version 1.119
     * @since 1.119
     * @alias sap.sac.df.model.Measure
     */

    var Measure = BaseObject.extend("sap.sac.df.model.Measure", /** @lends sap.sac.df.model.Measure.prototype */ {
      constructor: function (oDataProvider, oMeasure, oFFMeasure) {
        Object.assign(this,Object.getPrototypeOf(this));
        /** @private */
        this._DataProvider = oDataProvider;
        /** @private */
        this._FFMeasure = oFFMeasure;
        Object.assign(this, oMeasure);
      }
    });

    /**
     * Get Decimal places of a measure
     * @return {int} decimal places
     * @public
     */
    Measure.prototype.getDecimalPlaces = function (){
      return this._FFMeasure.getNumericScale() && this._FFMeasure.getNumericScale().getInteger();
    };


    /**
     * Sets the scaling factor of a measure
     * @return {int} the current decimal places setting
     * @public
     */
    Measure.prototype.setDecimalPlaces = function (nNumberOfDecimalPlaces) {
      var that = this;
      this._DataProvider._executeModelOperation(function () {
        return that._FFMeasure.setNumericScale(nNumberOfDecimalPlaces);
      });
    };

    /**
     * Get scaling factor of a measure
     * @return {int} scaling factor
     * @public
     */
    Measure.prototype.getScalingFactor = function (){
      return this._FFMeasure.getNumericShift() ? -1 * this._FFMeasure.getNumericShift().getInteger() : 0;
    };


    /**
     * Sets the scaling factor of a measure
     * @return {int} the current scaling factor setting
     * @public
     */
    Measure.prototype.setScalingFactor = function (nScalingFactor) {
      var that = this;
      this._DataProvider._executeModelOperation(function () {
        return that._FFMeasure.setNumericShift(-1 * nScalingFactor);
      });
    };


    /*
    /!**
     * Gets the scaling factor of a measure
     * @param {string} sMeasureMember the Member of the Measure Structure
     * @param {string} sNonMeasureMember the Member of the Non Measure Structure
     * @return {int} the exponent of the scaling factor in Base 10
     * @public
     *!/
    Measure.prototype.getScalingFactor = function (sMeasureMember, sNonMeasureMember) {
      var measureStructure = this._DataProvider().getDimension("MeasureStructure");
      if (!measureStructure) {
        throw new Error("No measure Structure");
      }
      var oNonMeasureStructure = sNonMeasureMember ? this._DataProvider().getDimension("NonMeasureStructure") : null;
      var sMeasureDimName = measureStructure.TechName;
      var aMeasureMembers = ListHelper.arrayFromList(
        this._DataProvider._getQueryModel().getDimensionByName(sMeasureDimName).getAllStructureMembers()
      );
      var oMeasureDimDisplayField = this._DataProvider._getQueryModel().getDimensionByName(sMeasureDimName).getDisplayKeyField();
      var oMeasureMember = (function () {
        var oM = _.find(aMeasureMembers, function (o) {
          var oVal = o.getFieldValue(oMeasureDimDisplayField);
          var s = oVal ? oVal.getString() : o.getName();
          return s === sMeasureMember;
        });
        if (!oM) {
          throw new Error("Member " + sMeasureMember + " not found in structure: " + sMeasureDimName);
        }
        return oM;
      }());
      if (!oNonMeasureStructure) {
        return oMeasureMember.getNumericShift() ? -1 * oMeasureMember.getNumericShift().getInteger() : 0;
      } else {
        var sNonMeasureDimName = oNonMeasureStructure.TechName;
        var aNonMeasureMembers = ListHelper.arrayFromList(
          this._DataProvider._getQueryModel().getDimensionByName(sNonMeasureDimName).getAllStructureMembers()
        );
        var oNonMeasureDimDisplayField =  this._DataProvider._getQueryModel().getDimensionByName(sNonMeasureDimName).getDisplayKeyField();
        var oNonMeasureMember = (function () {
          var oM = _.find(aNonMeasureMembers, function (o) {
            var oVal = o.getFieldValue(oNonMeasureDimDisplayField);
            var s = oVal ? oVal.getString() : o.getName();
            return s === sNonMeasureMember;
          });
          if (!oM) {
            throw new Error("Member " + sMeasureMember + " not found in structure: " + sMeasureDimName);
          }
          return oM;
        }());
        var aQC = ListHelper.arrayFromIter(this._DataProvider._getQueryModel().getQueryDataCells().getIterator());
        var oQC = _.find(aQC, function (o) {
          return o.hasMemberReference(oMeasureMember) && o.hasMemberReference(oNonMeasureMember);
        });
        if (!oQC) {
          throw new Error("Invalid Query Cell");
        }
        return oQC.getScalingFactor();
      }
    };
    /!**
     * Sets the scaling factor of a measure/query cell
     * @param {int} nFactor the exponential of the scaling factor
     * @param {string} sMeasureMember the Member of the Measure Structure
     * @param {string} sNonMeasureMember the Member of the Non Measure Structure
     * @return {this} the DataProvider
     * @public
     *!/
    Measure.prototype.setScalingFactor = function (nFactor, sMeasureMember, sNonMeasureMember) {
      var that = this;
      this._DataProvider._executeModelOperation(function () {
        var oMeasureStructure = that.Dimensions.MeasureStructure;
        if (!oMeasureStructure) {
          throw new Error("No measure Structure");
        }
        var oNonMeasureStructure = sNonMeasureMember ? that.Dimensions.NonMeasureStructure : null;
        var sMeasureDimName = oMeasureStructure.TechName;
        var aStructureMembers = ListHelper.arrayFromList(
          that._DataProvider._getQueryModel().getDimensionByName(sMeasureDimName).getAllStructureMembers()
        );
        var oField = that._DataProvider._getQueryModel().getDimensionByName(sMeasureDimName).getDisplayKeyField();
        var oMeasureMember = (function () {
          var oM = _.find(aStructureMembers, function (o) {
            var oVal = o.getFieldValue(oField);
            var s = oVal ? oVal.getString() : o.getName();
            return s === sMeasureMember;
          });
          if (!oM) {
            throw new Error("Member " + sMeasureMember + " not found in structure: " + sMeasureDimName);
          }
          return oM;
        }());
        if (!oNonMeasureStructure) {
          oMeasureMember.setNumericShift(-1 * nFactor);
          return that;
        } else {
          var nonMeasureDimName = oNonMeasureStructure.TechName;
          var aNonMeasureStructureMembers = ListHelper.arrayFromList(
            that._DataProvider._getQueryModel().getDimensionByName(nonMeasureDimName).getAllStructureMembers()
          );
          oField = that._DataProvider._getQueryModel().getDimensionByName(nonMeasureDimName).getDisplayKeyField();
          var oM2 = (function () {
            var oM = _.find(aNonMeasureStructureMembers, function (o) {
              var oVal = o.getFieldValue(oField);
              var s = oVal ? oVal.getString() : o.getName();
              return s === sNonMeasureMember;
            });
            if (!oM) {
              throw new Error("Member " + sNonMeasureMember + " not found in structure: " + nonMeasureDimName);
            }
            return oM;
          }());
          var aQueryCells = ListHelper.arrayFromIter(that._DataProvider._getQueryModel().getQueryDataCells().getIterator());
          aQueryCells = _.filter(aQueryCells, function (o) {
            return o.hasMemberReference(oMeasureMember) && o.hasMemberReference(oM2);
          });
          if (!aQueryCells || aQueryCells.length < 1) {
            throw new Error("Invalid Query Cell");
          }
          return _.forEach(aQueryCells, function (oQueryCell) {
            oQueryCell.setScalingFactor(nFactor);
          });
        }
      });

    };
    /!**
     * Gets the scaling factor of a measure or data cell
     * @param {string} sMeasureMember the Member of the Measure Structure
     * @param {string} sNonMeasureMember the Member of the Non Measure Structure, if this is not given the value for the sMeasureMember is returned
     * @return {int} the current decimal places setting
     * @public
     *!/
    Measure.prototype.setDecimalPlaces = function (nNumberOfDecimalPlaces, sMeasureMember, sNonMeasureMember) {
      var that = this;
      this._DataProvider._executeModelOperation(function () {
        var oMeasureStructure = that.Dimensions.MeasureStructure;
        if (!oMeasureStructure) {
          throw new Error("No measure Structure");
        }
        var oNonMeasureStructure = sNonMeasureMember ? that.Dimensions.NonMeasureStructure : null;
        var sMeasureDimName = oMeasureStructure.TechName;
        var aStructureMembers = ListHelper.arrayFromList(
          that._DataProvider._getQueryModel().getDimensionByName(sMeasureDimName).getAllStructureMembers()
        );
        var oField = that._DataProvider._getQueryModel().getDimensionByName(sMeasureDimName).getDisplayKeyField();
        var oMeasureMember = (function () {
          var oM = _.find(aStructureMembers, function (o) {
            var oVal = o.getFieldValue(oField);
            var s = oVal ? oVal.getString() : o.getName();
            return s === sMeasureMember;
          });
          if (!oM) {
            throw new Error("Member " + sMeasureMember + " not found in structure: " + sMeasureDimName);
          }
          return oM;
        }());
        if (!oNonMeasureStructure) {
          oMeasureMember.setNumericScale(nNumberOfDecimalPlaces);
          return that;
        } else {
          var nonMeasureDimName = oNonMeasureStructure.TechName;
          var aNonMeasureStructureMembers = ListHelper.arrayFromList(
            that._DataProvider._getQueryModel().getDimensionByName(nonMeasureDimName).getAllStructureMembers()
          );
          oField = that._DataProvider._getQueryModel().getDimensionByName(nonMeasureDimName).getDisplayKeyField();
          var oStructureMember = (function () {
            var oM = _.find(aNonMeasureStructureMembers, function (o) {
              var oVal = o.getFieldValue(oField);
              var s = oVal ? oVal.getString() : o.getName();
              return s === sNonMeasureMember;
            });
            if (!oM) {
              throw new Error("Member " + sNonMeasureMember + " not found in structure: " + nonMeasureDimName);
            }
            return oM;
          }());
          var aQueryCells = ListHelper.arrayFromIter(that._DataProvider._getQueryModel().getQueryDataCells().getIterator());
          aQueryCells = _.filter(aQueryCells, function (o) {
            return o.hasMemberReference(oMeasureMember) && o.hasMemberReference(oStructureMember);
          });
          if (!aQueryCells || aQueryCells.length < 1) {
            throw new Error("Invalid Query Cell");
          }
          return _.forEach(aQueryCells, function (oQueryCell) {
            oQueryCell.setDecimalPlaces(nNumberOfDecimalPlaces);
          });
        }
      });

    };
    /!**
     * Sets the number of decimal  of a measure/query cell
     * @param {int} nNumberOfDecimalPlaces number of the decimal palaces to be shown after the separator
     * @param {string} sMeasureMember the Member of the Measure Structure
     * @param {string} the Member of the Non Measure Structure, if this is not given the setting is applied for the whole sMeasureMember
     * @return {this} the DataProvider
     * @public
     *!/
    Measure.prototype.getDecimalPlaces = function (sMeasureMember, sNonMeasureMember) {
      var measureDim = this.Dimensions.MeasureStructure;
      if (!measureDim) {
        throw new Error("No measure Structure");
      }
      var oNonMeasureDim = sNonMeasureMember ? this.Dimensions.NonMeasureStructure : null;
      var sMeasureDimName = measureDim.TechName;
      var aMeasureMembers = ListHelper.arrayFromList(
        this._DataProvider._getQueryModel().getDimensionByName(sMeasureDimName).getAllStructureMembers()
      );
      var oMeasureDisplayField = this._DataProvider._getQueryModel().getDimensionByName(sMeasureDimName).getDisplayKeyField();
      var oMeasureMember = (function () {
        var oM = _.find(aMeasureMembers, function (o) {
          var oVal = o.getFieldValue(oMeasureDisplayField);
          var s = oVal ? oVal.getString() : o.getName();
          return s === sMeasureMember;
        });
        if (!oM) {
          throw new Error("Member " + sMeasureMember + " not found in measureDim: " + sMeasureDimName);
        }
        return oM;
      }());
      if (!oNonMeasureDim) {
        return oMeasureMember.getNumericScale();
      } else {
        var sNonMeasureDimName = oNonMeasureDim.TechName;
        var aNonMeasureMembers = ListHelper.arrayFromList(
          this._DataProvider._getQueryModel().getDimensionByName(sNonMeasureDimName).getAllStructureMembers()
        );
        var oNonMeasureDisplayField = this._DataProvider._getQueryModel().getDimensionByName(sNonMeasureDimName).getDisplayKeyField();
        var oNonMeasureMember = (function () {
          var oM = _.find(aNonMeasureMembers, function (o) {
            var oVal = o.getFieldValue(oNonMeasureDisplayField);
            var s = oVal ? oVal.getString() : o.getName();
            return s === sNonMeasureMember;
          });
          if (!oM) {
            throw new Error("Member " + sNonMeasureMember + " not found in measureDim: " + sNonMeasureDimName);
          }
          return oM;
        }());
        var aQC = ListHelper.arrayFromIter(this._DataProvider._getQueryModel().getQueryDataCells().getIterator());
        var oQC = _.find(aQC, function (o) {
          return o.hasMemberReference(oMeasureMember) && o.hasMemberReference(oNonMeasureMember);
        });
        if (!oQC) {
          throw new Error("Invalid Query Cell");
        }
        return oQC.getDecimalPlaces();
      }
    };

*/




    return Measure;
  }
);
