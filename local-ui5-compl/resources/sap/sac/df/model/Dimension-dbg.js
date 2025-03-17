/*!
* SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
*/
/*global sap, Promise */
sap.ui.define(
  "sap/sac/df/model/Dimension",
  [
    "sap/ui/base/Object",
    "sap/sac/df/model/MemberFilter",
    "sap/sac/df/thirdparty/lodash",
    "sap/sac/df/firefly/library",
    "sap/sac/df/utils/ResourceBundle",
    "sap/sac/df/utils/ListHelper",
    "sap/sac/df/types/DisplayType",
    "sap/sac/df/utils/SyncActionHelper",
    "sap/sac/df/types/DimensionType"
  ], /*eslint-disable max-params*/
  function (
    BaseObject,
    MemberFilter,
    _,
    FF,
    ResourceBundle,
    ListHelper,
    DisplayType,
    SyncActionHelper,
    DimensionType
  ) {
    "use strict";
    /*eslint-disable max-statements*/
    /**
     *
     * @class
     * Dimension Object
     *
     * <b>Structure of Exposed Data:</b>
     * <pre><code>
     * "Name": "",
     * "TechName": "",
     * "Description": "",
     * "Axis": "",
     * "Type": "",
     * "HierarchyActive": "",
     * "HasFilter": "",
     * "MemberFilter": [],
     * "SortDirection": "",
     * "Position": "",
     * "LastPosition": "",
     * "IsStructure": "",
     * "IsMeasureStructure": "",
     * "ValueType": "",
     * "SemanticObject": "",
     * "Members": [{
     *   "Key": "",
     *   "Name": "",
     *   "TechName": "",
     *   "Description": "",
     *   "SemanticObject": "
     * }],
     * "SupportedOperators": ["EQ"]
     * </code></pre>
     *
     * @author SAP SE
     * @version 1.132.0
     * @public
     * @hideconstructor
     * @experimental since version 1.119
     * @since 1.119
     * @alias sap.sac.df.model.Dimension
     */

    var Dimension = BaseObject.extend("sap.sac.df.model.Dimension", /** @lends sap.sac.df.model.Dimension.prototype */  {
      constructor: function (oDataProvider, oFFDimension) {
        Object.assign(this, Object.getPrototypeOf(this));
        var that = this;
        /** @private */
        this._DataProvider = oDataProvider;
        /** @private */
        this._FFDimension = oFFDimension;

        var sAxisType = this._FFDimension.getAxisType();
        if (sAxisType !== FF.AxisType.COLUMNS && sAxisType !== FF.AxisType.ROWS && sAxisType !== FF.AxisType.FREE) {
          return null;
        }
        var oAxis = this._FFDimension.getAxis();
        var isMeasureStructure = this._FFDimension.isMeasureStructure();
        var isStructure = this._FFDimension.isStructure();

        if (!this._FFDimension.getExternalName() || this._FFDimension.getExternalName().trim() === "") {
          this._FFDimension.getExternalName = this._FFDimension.getName;
        }

        /** @private */
        this._createMemberFilter = function () {
          this.MemberFilter = [];
          if (this._FFDimension.isStructure() || this._FFDimension.isMeasureStructure()) {
            this.MemberFilter = this._createMemberFilterForStructures();
          } else {
            this.MemberFilter = _.map(this._FFDimension.getFilter() && ListHelper.arrayFromList(this._FFDimension.getFilter()), (oMemberFilter) => {
              return MemberFilter._createFromFFFilter(oMemberFilter, this._FFDimension.getFilter());
            });
          }
        };
        /** @private */
        this._getDisplayType = function (sDisplayType) {
          switch (sDisplayType) {
            case FF.FilterDisplayInfo.ID:
              return DisplayType.Key;
            case FF.FilterDisplayInfo.DESCRIPTION:
              return DisplayType.Text;
            case FF.FilterDisplayInfo.ID_AND_DESCRIPTION:
              return DisplayType.KeyText;
            case FF.FilterDisplayInfo.DESCRIPTION_AND_ID:
              return DisplayType.TextKey;
          }
        };

        /** @private */
        this._createMemberFilterForStructures = function () {
          var aMemberFilter = this._FFDimension.getFilter() && ListHelper.arrayFromList(this._FFDimension.getFilter());
          if (aMemberFilter) {
            return _.map(aMemberFilter, (oMemberFilter) => {
              const oStructureMember = _.find(that.getStructureMembers(), (oMember) => {
                return oMember.Key === oMemberFilter.getLow().getString();
              });
              const sSign = oMemberFilter.getSetSign().getName ? oMemberFilter.getSetSign().getName() : oMemberFilter.getSetSign();
              const sOperator = oMemberFilter.getComparisonOperator().getName();
              const sUI5Operator = MemberFilter.getUI5OperatorFromFFOperator({Sign: sSign, Operator: sOperator});
              return this._createMemberFilterFromStructureMember(oStructureMember, sUI5Operator);
            });
          }
        };

        /** @private */
        this._createMemberFilterFromStructureMember = function (oStructureMember, sUI5Operator) {
          return new MemberFilter(
            [oStructureMember.Key],
            [oStructureMember.Name],
            [oStructureMember.Description],
            sUI5Operator
          );
        };

        if (isMeasureStructure) {
          _createMeasureStructureDimension(this);
          this.Members = _createStructureMembers(this._FFDimension);
        } else if (isStructure && !isMeasureStructure) {
          _createStructureDimension(this);
          this.Members = _createStructureMembers(this._FFDimension);
        }

        var bHasFilter = !!this._FFDimension.getFilter();
        Object.assign(this, {
          Name: this._FFDimension.getExternalName(),
          TechName: this._FFDimension.getName(),
          Description: this._FFDimension.getText(),
          Axis: oAxis.getName(),
          Type: this._FFDimension.getDimensionType().getName(),
          HierarchyActive: this._FFDimension.isHierarchyActive(),
          HasFilter: bHasFilter,
          SortDirection: readSorting(this._FFDimension),
          Position: oAxis.getDimensionIndex(this._FFDimension.getName()),
          LastPosition: oAxis.getDimensionCount() - 1,
          IsStructure: this._FFDimension.isStructure(),
          IsMeasureStructure: this._FFDimension.isMeasureStructure(),
          ValueType: readDimensionValueType(this._FFDimension),
          DisplayType: FF.FilterDisplayInfo.getDimensionDisplayInfo(this._FFDimension),
          FilterDisplayType: null,
          SemanticObject: this._FFDimension.getSemanticObject(),
          MemberFilter: [],
          SupportedOperators: _getSupportedOperators(that._FFDimension).filter(Boolean)
        });

        that._createMemberFilter();
        if (this._FFDimension.getFilter() && this.FilterDisplayType !== this._FFDimension.getFilter().getUiSettings(FF.QContextType.SELECTOR).getDisplayInfo()) {
          this.FilterDisplayType = this._getDisplayType(this._FFDimension.getFilter().getUiSettings(FF.QContextType.SELECTOR).getDisplayInfo());
        } else {
          this.FilterDisplayType = this._getDisplayType(this.DisplayType);
        }

        function _getSupportedOperators(oDimension) {
          if (oDimension && oDimension.getFilterCapabilities()) {
            let oField = oDimension.getFlatKeyField();
            if (!!oField && oDimension.getFilterCapabilities().getFilterCapabilitiesByField(oField)) {
              const aFFOperators = ListHelper.arrayFromList(oDimension.getFilterCapabilities().getFilterCapabilitiesByField(oField).getSupportedComparisonOperators(FF.SetSign.INCLUDING));
              if (aFFOperators) {
                return _.map(aFFOperators, function (oOperator) {
                  if (oOperator && oOperator.getName()) {
                    return MemberFilter.getUI5OperatorFromFFOperator({
                      Sign: "INCLUDING",
                      Operator: oOperator.getName()
                    });
                  }
                });
              }
            }
          }
          return ["EQ"];
        }

        function _createStructureMembers(oDimension) {
          var oKeyField = oDimension.getDisplayKeyField();
          return _.map(
            ListHelper.arrayFromList(oDimension.getAllStructureMembers()),
            function (oMem) {
              return _createStructureMember(oMem, oDimension, oKeyField);
            }
          );
        }

        function _createMeasureStructureDimension(oDimension) {
          oDimension._FFDimension.getExternalName = _.constant(DimensionType.MeasureStructure);

          /**
           * Add a member filter by its key / name
           * @param {string} sStructureMember structure member name
           * @return {this} Reference to this in order to allow method chaining
           * @public
           */
          oDimension.addMemberFilterByKey = function (sStructureMember) {
            var oStructureMember = this.getStructureMember(sStructureMember);
            if(oStructureMember) {
              var oMemberFilter = new MemberFilter(
                [oStructureMember.Key],
                [oStructureMember.Name],
                [oStructureMember.Description]
              );
              return new Promise(resolve => {
                this.addMemberFilter(oMemberFilter);
                resolve();
              });
            }
          };

          /**
           * Remove a member filter by its key / name
           * @param {string} sStructureMember structure member name
           * @return {this} Reference to this in order to allow method chaining
           * @public
           */
          oDimension.removeMemberFilterByKey = function (sStructureMember) {
            var oStructureMember = this.getStructureMember(sStructureMember);
            if(oStructureMember) {
              var oMemberFilter = new MemberFilter(
                [oStructureMember.Key],
                [oStructureMember.Name],
                [oStructureMember.Description]
              );
              return new Promise(resolve => {
                this.removeMemberFilter(oMemberFilter);
                resolve();
              });
            }
          };

          /**
           * Set a member filter by its key / name
           * @param {string} sStructureMember structure member name
           * @return {this} Reference to this in order to allow method chaining
           * @public
           */
          oDimension.setMemberFilterByKey = function (sStructureMember) {
            var oStructureMember = this.getStructureMember(sStructureMember);
            if(oMemberFilter) {
              var oMemberFilter = new MemberFilter(
                [oStructureMember.Key],
                [oStructureMember.Name],
                [oStructureMember.Description]
              );
              var aMemberFilter = [oMemberFilter];
              return new Promise(resolve => {
                this.setMemberFilter(aMemberFilter);
                resolve();
              });
            }
          };

          /**
           * Get structure members
           * @return {Array} array of structure members
           * @public
           */
          oDimension.getStructureMembers = function () {
            return oDimension.Members;
          };

          /**
           * Get a structure member
           * @param {string} sStructureMember structure member name
           * @return {Object} structure member object
           * @public
           */
          oDimension.getStructureMember = function (sStructureMember) {
            return _.find(oDimension.getStructureMembers(), function (oStructureMember) {
              return oStructureMember && oStructureMember.Name === sStructureMember;
            });
          };
          oDimension.setScalingFactor = function (sStructureMember, nFactor) {
            return oDimension._DataProvider.getMeasure(sStructureMember).setScalingFactor(nFactor);
          };
          oDimension.getScalingFactor = function (sStructureMember) {
            return oDimension._DataProvider.getMeasure(sStructureMember).getScalingFactor();
          };
          oDimension.setDecimalPlaces = function (sStructureMember, nNumberOfDecimalPlaces) {
            return oDimension._DataProvider.getMeasure(sStructureMember).setDecimalPlaces(nNumberOfDecimalPlaces);
          };
          oDimension.getDecimalPlaces = function (sStructureMember) {
            return oDimension._DataProvider.getMeasure(sStructureMember).getDecimalPlaces();
          };
        }

        function _createStructureDimension(oDimension) {
          oDimension._FFDimension.getExternalName = _.constant(DimensionType.StructureDimension);

          /**
           * Add a member filter by its key / name
           * @param {string} sStructureMember structure member name
           * @return {Promise<this>} Reference to this in order to allow method chaining
           * @public
           */
          oDimension.addMemberFilterByKey = function (sStructureMember) {
            var oStructureMember = this.getStructureMember(sStructureMember);
            if(oMemberFilter) {
              var oMemberFilter = new MemberFilter(
                [oStructureMember.Key],
                [oStructureMember.Name],
                [oStructureMember.Description]
              );
              return new Promise(resolve => {
                this.addMemberFilter(oMemberFilter);
                resolve();
              });
            }
          };

          /**
           * Remove a member filter by its key / name
           * @param {string} sStructureMember structure member name
           * @return {Promise<this>} Reference to this in order to allow method chaining
           * @public
           */
          oDimension.removeMemberFilterByKey = function (sStructureMember) {
            var oStructureMember = this.getStructureMember(sStructureMember);
            if(oMemberFilter) {
              var oMemberFilter = new MemberFilter(
                [oStructureMember.Key],
                [oStructureMember.Name],
                [oStructureMember.Description]
              );
              return new Promise(resolve => {
                this.removeMemberFilter(oMemberFilter);
                resolve();
              });
            }
          };

          /**
           * Set a member filter by its key / name
           * @param {string} sStructureMember structure member name
           * @return {this} Reference to this in order to allow method chaining
           * @public
           */
          oDimension.setMemberFilterByKey = function (sStructureMember) {
            var oStructureMember = this.getStructureMember(sStructureMember);
            if(oStructureMember) {
              var oMemberFilter = new MemberFilter(
                [oStructureMember.Key],
                [oStructureMember.Name],
                [oStructureMember.Description]
              );
              var aMemberFilter = [oMemberFilter];
              return new Promise(resolve => {
                this.setMemberFilter(aMemberFilter);
                resolve();
              });
            }
          };

          /**
           * Get all structure members
           * @return {Array} array of all structure members
           * @public
           */
          oDimension.getStructureMembers = function () {
            return oDimension.Members;
          };
          /**
           * Get a structure member
           * @param {string} sStructureMember structure member name
           * @return {Object} structure member object
           * @public
           */
          oDimension.getStructureMember = function (sStructureMember) {
            return _.find(oDimension.getStructureMembers(), function (oStructureMember) {
              return oStructureMember.Name === sStructureMember;
            });
          };
          oDimension.setScalingFactor = function () {
          };
          oDimension.getScalingFactor = function () {
          };
          oDimension.setDecimalPlaces = function () {
          };
          oDimension.getDecimalPlaces = function () {
          };
        }

        function _createStructureMember(oMem, oDim, oKeyField) {
          return {
            Key: oMem.getFieldValue(oDim.getKeyField()).getValue().getString(),
            Name: oMem.getFieldValue(oDim.getDisplayKeyField()) ? oMem.getFieldValue(oKeyField).getValue().getString() : oMem.getName(),
            TechName: oMem.getName(),
            Description: oMem.getText(),
            SemanticObject: oMem.getSemanticObject()
          };
        }

        function readSorting(oDimension) {
          var oSortingManager = that._DataProvider._getQueryModel().getSortingManager();
          if (oSortingManager.supportsDimensionSorting(oDimension, null) && oDimension.hasSorting()) {
            return oDimension.getResultSetSorting().getDirection().getName();
          } else {
            return null;
          }
        }

        function readDimensionValueType(oDimension) {
          var valueType = FF.XValueType.STRING;
          var flatKeyField = oDimension.getFlatKeyField();
          if (flatKeyField && (flatKeyField.getValueType().isNumber() || FF.QFilterUtil.supportsDateRangeFilter(flatKeyField))) {
            valueType = flatKeyField.getValueType();
          }
          return valueType.getName();
        }
      }
    });

    /**
     * Performs the search for a given value
     *
     * @param {string} sSearchString string to search for
     * @param {boolean} bFuzzy if a fuzzy search is performed
     * @param {boolean} bText if to search in text/description (default true)
     * @param {boolean} bKey if to search in key/id (default true)
     * @param {int} iMaxNumberOfResults maximal number of search results (default 1)
     * @param {boolean} bRequestParents if to provide the parents of the search result for hierarchical variables (only relevant if iMaxNumberOfResults is set)
     * @return {Promise<sap.sac.df.MemberFilter[]>} array of found member filters
     * @private
     */
    Dimension.prototype.searchMember = function (sSearchString, bFuzzy, bText, bKey, iMaxNumberOfResults, bRequestParents) {
      const that = this;
      // Mimic the defaults
      if (bText === undefined) {
        bText = true;
      }
      if (bKey === undefined) {
        bKey = true;
      }
      if (iMaxNumberOfResults === undefined) {
        bRequestParents = false;
        iMaxNumberOfResults = 1;
      }
      const oDimension = this._FFDimension;
      const searchFields = FF.XList.create();
      const fields = FF.XList.create();
      const oDim = oDimension.getDimension();
      const textField = oDim.getTextField();
      if (textField) {
        fields.add(textField);
        if (bText) {
          searchFields.add(textField);
        }
      }
      if (oDim.getDisplayKeyField() && bKey) {
        searchFields.add(oDim.getDisplayKeyField());
      }
      return FF.QFactory.createDimensionValueHelpWizard(oDimension).withReadMode(FF.QMemberReadMode.BOOKED).withPaging(0, iMaxNumberOfResults).withMainKeyAndTextFields().searchPromise(sSearchString, bKey, bText, bRequestParents, bFuzzy
      ).then(function (oValueHelpResult) {
        const sHierarchyName = oDimension.getHierarchyName();
        return MemberFilter.createFromFFValueHelpNode(oValueHelpResult, sHierarchyName, !bFuzzy ? sSearchString : null);
      }).onCatch(function (oMessages) {
        that._DataProvider.addMessages(oMessages);
      });
    };

    /**
     * Move dimension to the rows axis
     * @return {this} Reference to this in order to allow method chaining
     * @public
     */
    Dimension.prototype.toRows = function () {
      this._DataProvider._executeModelOperation(() => {
        this._DataProvider._FFDataProvider.getActions().getAxisActions().moveDimensionToAxis(this.TechName, FF.AxisType.ROWS);
      });

      return this;
    };

    /**
     * Move dimension to the columns axis
     * @return {this} Reference to this in order to allow method chaining
     * @public
     */
    Dimension.prototype.toColumns = function () {
      this._DataProvider._executeModelOperation(() => {
        this._DataProvider._FFDataProvider.getActions().getAxisActions().moveDimensionToAxis(this.TechName, FF.AxisType.COLUMNS);
      });
      return this;
    };

    /**
     * Move dimension one position up on it's axis
     * @return {this} Reference to this in order to allow method chaining
     * @public
     */
    Dimension.prototype.moveUp = function () {
      this._DataProvider._executeModelOperation(() => {
        var oAxis = this._FFDimension.getAxis();
        var nPosit = oAxis.getDimensionIndex(this._FFDimension.getName()) - 1;
        oAxis.insert(nPosit, this._FFDimension);
      });
      return this;
    };
    /**
     * Move dimension one position down on its axis
     * @return {this} Reference to this in order to allow method chaining
     * @public
     */
    Dimension.prototype.moveDown = function () {
      this._DataProvider._executeModelOperation(() => {
        var oAxis = this._FFDimension.getAxis();
        var nPosit = oAxis.getDimensionIndex(this._FFDimension.getName()) + 1;
        oAxis.insert(nPosit, this._FFDimension);
      });
      return this;
    };

    /**
     * Get effective dimension filters
     * @return {sap.sac.df.model.MemberFilter[]} array of member filters
     * @public
     */
    Dimension.prototype.getMemberFilter = function () {
      return this.MemberFilter;
    };

    /** @private*/
    Dimension.prototype._applyMemberFilter = function (aMemberFilter) {
      const oSelectionList = MemberFilter._condenseDimensionMemberFilter(aMemberFilter, _.clone(this._FFDimension.getFilter()), this._FFDimension);
      this._DataProvider._getQueryModel().queueEventing();
      FF.QFilterUtil.clearSelectionsInContainerByDimension(this.TechName, this._DataProvider._getQueryModel().getFilter().getDynamicFilter());
      FF.FilterDialogValueUtils.updateDynamicFilter(this._FFDimension, oSelectionList);
      this._DataProvider._getQueryModel().resumeEventing();
      this._createMemberFilter();
      this._DataProvider._triggerDataProviderPropertyUpdate();
    };

    /**
     * Set dimension filters
     * @param {sap.sac.df.model.MemberFilter[]} aMemberFilter array of member filters
     * @return {this} Reference to this in order to allow method chaining
     * @public
     */
    Dimension.prototype.setMemberFilter = function (aMemberFilter) {
      return this._applyMemberFilter(aMemberFilter);
    };

    /**
     * Remove the filter of a dimension
     * @param {sap.sac.df.model.MemberFilter} oMemberFilter a member filter object
     * @return {this} Reference to this in order to allow method chaining
     * @public
     */
    Dimension.prototype.removeMemberFilter = function (oMemberFilter) {
      var aNewMemberFilter = _.filter(_.clone(this.getMemberFilter()), function (oExistingMemberFilter) {
        return !_.isEqual(oMemberFilter.InternalKey, oExistingMemberFilter.InternalKey);
      });
      if (aNewMemberFilter.length > 0) {
        return new Promise(resolve => {
          this._applyMemberFilter(aNewMemberFilter);
          resolve();
        });
      } else {
        return new Promise(resolve => {
          this.clearMemberFilter();
          resolve();
        });
      }
    };

    /**
     * Clear the filter of a dimension
     * @return {this} Reference to this in order to allow method chaining
     * @public
     */
    Dimension.prototype.clearMemberFilter = function () {
      return new Promise(resolve => {
        this._applyMemberFilter([]);
        resolve();
      });
    };


    /**
     * Add a member filter by its (internal) key
     * @param {string} sKey (internal) key of a dimension member
     * @return {this} Reference to this in order to allow method chaining
     * @public
     */
    Dimension.prototype.addMemberFilterByKey = function (sKey) {
      var oMemberFilter = new MemberFilter([sKey]);
      return new Promise(resolve => {
        this.addMemberFilter(oMemberFilter);
        resolve();
      });
    };

    /**
     * Set a member filter by its (internal) key
     * @param {string} sKey (internal) key of a dimension member
     * @return {this} Reference to this in order to allow method chaining
     * @public
     */
    Dimension.prototype.setMemberFilterByKey = function (sKey) {
      var aMemberFilter = [new MemberFilter([sKey])];
      return new Promise(resolve => {
        this.setMemberFilter(aMemberFilter);
        resolve();
      });
    };

    /**
     * Remove a member filter by its (internal) key
     * @param {string} sKey (internal) key of a dimension member
     * @return {this} Reference to this in order to allow method chaining
     * @public
     */
    Dimension.prototype.removeMemberFilterByKey = function (sKey) {
      return new Promise(resolve => {
        this.removeMemberFilter(new MemberFilter([sKey]));
        resolve();
      });
    };

    /**
     * Add dimension filters
     * @param {sap.sac.df.model.MemberFilter} oMemberFilter a member filter object
     * @return {this} Reference to this in order to allow method chaining
     * @public
     */
    Dimension.prototype.addMemberFilter = function (oMemberFilter) {
      let aNewMemberFilter = _.clone(this.getMemberFilter()) || [];
      aNewMemberFilter.push(oMemberFilter);
      return new Promise(resolve => {
        this.setMemberFilter(aNewMemberFilter);
        resolve();
      });
    };

    /**
     * Sort the members of a dimension
     * @param {sap.sac.df.types.SortDirection} direction of sorting
     * @param {sap.sac.df.types.SortType} type of sorting
     * @param {string} sMember in case of a structure the measure according to which is sorted
     * @return {this} Reference to this in order to allow method chaining
     * @public
     */
    Dimension.prototype.sort = function (direction, type, sMember) {
      this._DataProvider._executeModelOperation(() => {
        var oDim = this._DataProvider._getQueryModel().getDimensionByName(this.TechName);
        if (this.IsStructure) {
          var oCC = this._DataProvider._getQueryManager().getConvenienceCommands();
          oCC.clearSort(null, null);
          oCC.sortByMeasure(_.find(this.Members, (oMember) => {
            return oMember.Name === sMember;
          }).TechName, FF.XSortDirection[direction]);
        } else {
          oDim.getResultSetSorting().setDirection(FF.XSortDirection[direction]);
          if (type) {
            oDim.getResultSetSorting().setSortType(FF.SortType[type]);
          }
        }
      });
      return this;
    };

    /**
     * Remove a drill operation on a dimension member
     * @return {this} Reference to this in order to allow method chaining
     * @public
     */
    Dimension.prototype.removeDrilldown = function () {
      this._DataProvider._executeModelOperation(() => {
        this._DataProvider._getQueryModel().getAxis(FF.AxisType.FREE).add(this._FFDimension);
      });
      return this;
    };

    /**
     * Set Display Hierarchy
     * @param {boolean} bActive whether the hierarchy should be activated
     * @param {string} sHierarchyName the  name of the hierarchy (optional)
     * @param {string} sVersion the version of the hierarchy (optional)
     * @return {sap.sac.df.model.Dimension} resolving to the <code>Dimension</code> to allow chaining.
     * @public
     */
    Dimension.prototype.setDisplayHierarchy = function (bActive, sHierarchyName, sVersion) {
      this._DataProvider._executeModelOperation(() => {
        if (sHierarchyName) {
          this._FFDimension.setHierarchyName(sHierarchyName);
          if (sVersion) {
            this._FFDimension.setHierarchyVersion(sVersion);
          }
        }
        this._FFDimension.setHierarchyActive(bActive);
      });
      return this;
    };

    /**
     * Set Display Hierarchy
     * @param {int} iLevel level
     * @return {sap.sac.df.model.Dimension} resolving to the <code>Dimension</code> to allow chaining.
     * @public
     */
    Dimension.prototype.readHierarchy = function (iLevel) {
      var that = this;
      var oHelpValueProvider = this._DataProvider._getQueryManager().getValueHelpProvider();
      var nOldLevel = this._FFDimension.getInitialDrillLevel();
      this._FFDimension.setSelectorInitialDrillLevel(iLevel);
      var oProm = new Promise((resolve, reject) => {
        oHelpValueProvider.processValueHelp(that._FFDimension, FF.SyncType.NON_BLOCKING, {
          onValuehelpExecuted: function (oExtResult) {
            return oExtResult.hasErrors() ? reject(SyncActionHelper.reject(oExtResult.getErrors())) : resolve(oExtResult.getData());
          }
        }, null, null);
      });

      return oProm.then((oData) => {
        function prodNode(oNode) {
          if (!oNode) {
            return {};
          }
          var oChildren = oNode.getChildren();
          return {
            Name: oNode.getName(),
            Text: oNode.getDimensionMember().getText() || oNode.getDimensionMember(oNode.getDimension().getHierarchyDisplayKeyField()).getValue().getString(),
            hierNodes: oChildren ? _.map(oChildren.getListFromImplementation(), prodNode) : null
          };
        }

        that._FFDimension.setSelectorInitialDrillLevel(nOldLevel);
        var aRoots = _.filter(
          oData.getListFromImplementation(),
          (oNode) => {
            return !oNode.getParentNode();
          });
        return aRoots.length === 1 ? prodNode(
          aRoots[0]
        ) : {
          Name: "$Root",
          Text: ResourceBundle.getText("ARTIFICIAL_ROOT"),
          hierNodes: _.map(aRoots, prodNode)
        };
      });
    };

    /**
     * Set Display Type of Dimension
     * @param {string} sDisplayType level
     * @return {sap.sac.df.model.Dimension}} resolving to the Dimension to allow chaining.
     * @public
     */
    Dimension.setDimensionDisplay = function (sDisplayType) {
      this._DataProvider._executeModelOperation(() => {
        var oKeyField = this._FFDimension.getDisplayKeyField() || this._FFDimension.getKeyField();
        var oTextField = this._FFDimension.getTextField();
        var oRF = this._FFDimension.getResultSetFields();
        var aField =
          _.filter(
            ListHelper.arrayFromList(oRF).map((o) => {
              return o;
            }),
            (oField) => {
              return oField !== this._FFDimension.getKeyField() && oField !== this._FFDimension.getTextField() && oField !== this._FFDimension.getDisplayKeyField();
            }
          );
        oRF.clear();
        switch (sDisplayType) {
          case DisplayType.Key:
            oRF.add(oKeyField);
            break;
          case DisplayType.Text:
            oRF.add(oTextField);
            break;
          case DisplayType.KeyText:
            oRF.add(oKeyField);
            oRF.add(oTextField);
            break;
          case DisplayType.TextKey:
            oRF.add(oTextField);
            oRF.add(oKeyField);
            break;
        }
        _.forEach(aField, (oField) => {
          oRF.add(oField);
        });
      });

      return this;
    };


    /**
     * Open a dialog to display and change the settings of a dimension of the <code>DataProvider</code>
     * @return {Promise<boolean>} indicator whether the dialog was confirmed or canceled
     * @public
     */
    Dimension.prototype.openPropertyDialog = function () {
      var that = this;
      return new Promise(function (resolve) {
        var runner = FF.ProgramRunner.createRunner(that._DataProvider._Model.getApplication().getProcess(), FF.OuDimensionDialog2.DEFAULT_PROGRAM_NAME);
        runner.setStringArgument(FF.OuDimensionDialog2.PARAM_DIMENSION_NAME, that.TechName);
        var oStartData = FF.ProgramStartData.create();
        oStartData.putXObject(FF.DfOuDialogProgram.PRG_DATA_QUERY_MANAGER, that._DataProvider._getQueryManager());
        oStartData.putXObject(FF.DfOuDialogProgram.PRG_DATA_OK_PROCEDURE, {
          execute: function () {
            resolve(true);
          }
        });
        oStartData.putXObject(FF.DfOuDialogProgram.PRG_DATA_CANCEL_PROCEDURE, {
          execute: function () {
            resolve(false);
          }
        });
        runner.setProgramStartData(oStartData);
        return runner.runProgram();
      }).then(function (bResult) {
        if (bResult) {
          that._DataProvider._executeModelOperation();
        }
      });
    };

    /**
     * Open a dialog to display and change the filter on a dimension
     * @return {Promise} resolving to a boolean which is false when the dialog is cancelled and true if is was closed with Ok and dynamic filters of the given dimension are updated
     * @public
     */
    Dimension.prototype.openValueHelpDialog = function () {
      let that = this;
      let oDisplayType;
      if (!this._DataProvider._getQueryModel().getFilter().getDynamicFilter().isCartesianProduct()) {
        throw new Error("Filter to complex");
      }

      return Promise.resolve().then(() => new Promise(resolve => {
        const runner = FF.FilterDialogProgramRunnerFactory.createForDimensionFilter(this._DataProvider._Model.getApplication().getProcess(), this._DataProvider._getQueryManager(), this._FFDimension.getName(), ResourceBundle.getText("SELECTOR", [this.Description]));
        runner.getProgramStartData().putXObject(FF.FilterDialog.PRG_DATA_DEFAULT_SELECTION, FF.FilterDialogValueFactory.createSelectionFromFilter(this._FFDimension, this._FFDimension.getFilter()));
        runner.getProgramStartData().putXObject(FF.FilterDialog.PRG_DATA_LISTENER_CLOSE, {
          onFilterDialogOk: function (oSel) {
            resolve(oSel);
          },
          onFilterDialogCancel: function () {
            resolve(null);
          }
        });
        runner.getProgramStartData().putXObject(FF.FilterDialog.PRG_DATA_LISTENER_BEFORE_FILTER_CHANGE, {
          onBeforeChange: function (oChange) {
            oDisplayType = oChange.getDisplayInfo();
          }
        });
        runner.runProgram();
      }))
        .then((aSelection) => {
          let oFFFilter = that._FFDimension.getFilter();
          if (oDisplayType) {
            this.FilterDisplayType = this._getDisplayType(oDisplayType);
            if (oFFFilter) {
              oFFFilter.getUiSettings(FF.QContextType.SELECTOR).setDisplayInfo(oDisplayType);
            }
          }
          if (aSelection) {
            this._createMemberFilter();
            this._DataProvider._triggerDataProviderPropertyUpdate();
          }
          return !!aSelection;
        });
    };

    return Dimension;
  }
)
;
