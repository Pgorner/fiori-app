/*!
* SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
*/
/*global sap */
sap.ui.define(
  "sap/sac/df/model/MemberFilter",
  [
    "sap/ui/base/Object",
    "sap/sac/df/firefly/library",
    "sap/sac/df/types/MemberFilterOperator",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/sac/df/utils/ListHelper",
    "sap/sac/df/thirdparty/lodash"
  ], /*eslint-disable max-params*/
  function (
    BaseObject,
    FF,
    MemberFilterOperator,
    sapUiModelFilter,
    sapUiModelFilterOperator,
    ListHelper,
    _
  ) {
    "use strict";
    /*eslint-disable max-statements*/

    /**
     *
     * @class
     * Member Filter
     * <pre><code>
     *  "Key": [],
     *  "InternalKey": [],
     *  "Text": [],
     *  "Operator": "",
     *  "Hierarchy": { }
     * </code></pre>
     * @param {string[]} aInternalKey array of internal keys
     * @param {string[]} aKey array of (display) keys
     * @param {string[]} aText array of texts
     * @param {sap.ui.model.FilterOperator} [sOperator=sap.ui.model.FilterOperator.EQ] filter operator
     * @param {Object} [oHierarchyInfo] hierarchy object
     * @author SAP SE
     * @version 1.132.0
     * @public
     * @experimental since version 1.119
     * @since 1.119
     * @alias sap.sac.df.model.MemberFilter
     */

    /** @private */
    function _transformValueHelpNode(node, hierarchyName, sSearchString) {
      const dimensionMember = node.getDimensionMember();
      const resultNode = new MemberFilter(
        [dimensionMember.getFieldValue(node.getDimension().getKeyField()).getString()],
        [hierarchyName ? dimensionMember.getFieldValue(node.getDimension().getHierarchyDisplayKeyField()).getString() : dimensionMember.getFieldValue(node.getDimension().getDisplayKeyField()).getString()],
        [dimensionMember.getText()]
      );

      if (hierarchyName) {
        const children = node.getChildren();
        if (children && children.hasElements()) {
          const transformedChildren = ListHelper.arrayFromList(children).map(function (childrenNode) {
            return this.transformValueHelpNode(childrenNode, hierarchyName, sSearchString);
          }).filter(function (item) {
            return item !== null;
          });
          if (transformedChildren.length !== 0) {
            resultNode.Children = transformedChildren;
          }
        }
      }
      // Check exactness
      if (sSearchString && !resultNode.Children) {
        if (!resultNode.Key.includes(sSearchString) && !resultNode.Text.includes(sSearchString)) {
          return null;
        }
      }
      return resultNode;
    }

    var MemberFilter = BaseObject.extend("sap.sac.df.model.MemberFilter", /** @lends sap.sac.df.model.MemberFilter.prototype */ {

      constructor: function (aInternalKey, aKey, aText, sOperator, oHierarchyInfo) {
        Object.assign(this, Object.getPrototypeOf(this));
        return {
          InternalKey: aInternalKey && aInternalKey,
          Key: aKey && aKey,
          Text: aText && aText,
          Operator: sOperator ? sOperator : sapUiModelFilterOperator.EQ,
          Hierarchy: oHierarchyInfo
        };
      }
    });

    /** @private */
    MemberFilter._createFFMemberFilter = function (oMemberFilter) {
      const oLowValue = FF.FilterDialogValueFactory.createValueExt(
        (oMemberFilter.InternalKey && oMemberFilter.InternalKey[0]) ? oMemberFilter.InternalKey[0] : null,
        (oMemberFilter.Key && oMemberFilter.Key[0]) ? oMemberFilter.Key[0] : null,
        (oMemberFilter.Text && oMemberFilter.Text[0]) ? oMemberFilter.Text[0] : null,
        oMemberFilter.Hierarchy ? oMemberFilter.Hierarchy.name : null,
        this.getFFOperatorFromUI5Operator(oMemberFilter.Operator));

      if (oMemberFilter.Operator === sapUiModelFilterOperator.BT || oMemberFilter.Operator === sapUiModelFilterOperator.NB) {
        const oHighValue = FF.FilterDialogValueFactory.createValueExt(
          (oMemberFilter.InternalKey && oMemberFilter.InternalKey[1]) ? oMemberFilter.InternalKey[1] : null,
          (oMemberFilter.Key && oMemberFilter.Key[1]) ? oMemberFilter.Key[1] : null,
          (oMemberFilter.Text && oMemberFilter.Text[1]) ? oMemberFilter.Text[1] : null,
          oMemberFilter.Hierarchy ? oMemberFilter.Hierarchy.name : null,
          this.getFFOperatorFromUI5Operator(oMemberFilter.Operator));
        return FF.FilterDialogValueFactory.createRangeValue(oLowValue, oHighValue, oMemberFilter.Operator === sapUiModelFilterOperator.NB);
      }
      return oLowValue;
    };

    /**
     * Create a member filter object from filter
     *
     * @param {sap.ui.model.Filter} oFilter object
     * @return {sap.sac.df.model.MemberFilter} a Member Filter object
     * @public
     */
    MemberFilter.transformFromFilterToMemberFilter = function (oFilter) {
      return new MemberFilter(
        [oFilter.getValue1(), oFilter.getValue2()],
        [oFilter.getValue1(), oFilter.getValue2()],
        [],
        oFilter.getOperator()
      );
    };


    /**
     * Create a member filter object from filter
     *
     * @param {sap.sac.df.model.MemberFilter} oFilter object
     * @param {string} sPath path to object
     * @return {sap.ui.model.Filter} a Member Filter object
     * @public
     */
    MemberFilter.transformFromMemberFilterToFilter = function (oFilter, sPath) {
      return new sapUiModelFilter(
        sPath,
        oFilter.Operator,
        oFilter.Key[0],
        oFilter.Key[1]
      );
    };

    /** @private */
    MemberFilter._createFromFFFilter = function (oFFFilter, aMemberFilterList) {
      const oDim = oFFFilter.getDimension();
      const getText = function (filterValue, aMemberFilterList) {
        if (oDim.isMeasureStructure()) {
          return;
        }
        let text;
        if (filterValue && oDim && oDim.getTextField()) {
          text = filterValue.getFlatOrHierarchicalTextSupplement(aMemberFilterList);
        }
        if (!text) {
          text = filterValue.getString();
        }
        return text;
      };

      const getDisplayKey = function (filterValue, aMemberFilterList) {
        const oDim = oFFFilter.getDimension();
        if (oDim.isMeasureStructure()) {
          return;
        }
        let text;
        if (filterValue && oDim) {
          text = filterValue.getFlatOrHierarchicalDisplayKeySupplement(aMemberFilterList);
          if (!text) {
            text = filterValue.getString();
          }
        }
        return text;
      };

      const oHierarchy = oDim.getHierarchy();
      let hierarchyInfo = {};
      if (oHierarchy && oHierarchy.getName()) {
        hierarchyInfo = {
          name: oHierarchy.getName(),
          version: oFFFilter.getHierarchyVersion(),
          dueDate: oFFFilter.getHierarchyDueDate(),
          levelOffset: oFFFilter.getLevelOffset(),
          depth: oFFFilter.getDepth()
        };
      }
      const oFFOperator = {
        Sign: oFFFilter.getSetSign().getName ? oFFFilter.getSetSign().getName() : oFFFilter.getSetSign(),
        Operator: oFFFilter.getComparisonOperator().getName()
      };
      let aInternalKey = [oFFFilter.getLow().getString()];
      let aKey = [getDisplayKey(oFFFilter.getLow(), aMemberFilterList)];
      let aText = [getText(oFFFilter.getLow(), aMemberFilterList)];
      if (oFFFilter.getHigh() && oFFFilter.getHigh().getString()) {
        aInternalKey.push(oFFFilter.getHigh().getString());
        aKey.push(getDisplayKey(oFFFilter.getHigh(), aMemberFilterList));
        aText.push(getText(oFFFilter.getHigh(), aMemberFilterList));
      }
      const oMemberFilter = new MemberFilter(aInternalKey, aKey, aText, this.getUI5OperatorFromFFOperator(oFFOperator), hierarchyInfo);
      oMemberFilter.UniqueID = oFFFilter.getUniqueId();
      return oMemberFilter;
    };

    /**
     * Create a member filter object from firefly
     *
     * @param {Array} aFFMemberFilter array of firefly member filters
     * @return {sap.sac.df.model.MemberFilter[]} a Member Filter object
     * @public
     */
    MemberFilter.createFromFFMemberFilter = function (aFFMemberFilter) {
      const aMemberFilter = [];
      _.forEach(aFFMemberFilter, oMemberFilter => {
        const memberFilter = new MemberFilter(
          [oMemberFilter.Low, oMemberFilter.High].filter(Boolean),
          [oMemberFilter.Low, oMemberFilter.High].filter(Boolean),
          [oMemberFilter.Text].filter(Boolean),
          this.getUI5OperatorFromFFOperator({
            Sign: oMemberFilter.IsExcluding ? "EXCLUDING" : "INCLUDING",
            Operator: oMemberFilter.ComparisonOperator
          }),
          oMemberFilter.Hierarchy);
        const aKeyComponents = [oMemberFilter.LowExternal, oMemberFilter.HighExternal].filter(Boolean);

        if (aKeyComponents.length > 0) {
          memberFilter.KeyComponents = [];
          _.forEach(aKeyComponents, (aKeyComponent) => {
            const KeyComponents = [];
            memberFilter.KeyComponents.push(KeyComponents);
            _.forEach(aKeyComponent, function (keyComponent) {
              const KeyComponent = {};
              KeyComponents.push(KeyComponent);
              KeyComponent.Dimension = keyComponent.Dimension;
              KeyComponent.Member = keyComponent.Member;
            });
          });
        }
        aMemberFilter.push(memberFilter);
      });
      return aMemberFilter;
    };

    MemberFilter.createFromFFValueHelpNode = function (oValueHelpNode, sHierarchyName, sSearchString) {
      const iterator = oValueHelpNode.getIterator();
      const aResult = [];
      while (iterator.hasNext()) {
        const oNode = iterator.next();
        if (sHierarchyName || oNode.getDisplayLevel() === 0) {
          const transformedNode = _transformValueHelpNode(oNode, sHierarchyName, sSearchString);
          if (transformedNode) {
            aResult.push(transformedNode);
          }
        }
      }
      return aResult;
    };

    MemberFilter._condenseDimensionMemberFilter = function (aNewMemberFilter, aExistingMemberFilter, oFFDimension) {
      var oSelectionList = FF.XList.create();
      if (aNewMemberFilter && aNewMemberFilter.length > 0) {
        const aFFFilterKeys = [];
        const aNewlyCreatedMemberFilter = [];
        _.forEach(aNewMemberFilter, (oMemberFilter) => {
          oMemberFilter.UniqueID ? aFFFilterKeys.push(oMemberFilter.UniqueID) : aNewlyCreatedMemberFilter.push(oMemberFilter);
        });
        if (aExistingMemberFilter && ListHelper.arrayFromList(aExistingMemberFilter).length > 0) {
          if (aFFFilterKeys.length > 0) {
            _.forEach(ListHelper.arrayFromList(aExistingMemberFilter), (oFFilter) => {
              if (!aFFFilterKeys.includes(oFFilter.m_uniqueId)) {
                aExistingMemberFilter.removeElement(oFFilter);
              }
            });
            if (ListHelper.arrayFromList(aExistingMemberFilter).length > 0) {
              oSelectionList = FF.FilterDialogValueUtils.newSelectionFromFilter(oFFDimension, aExistingMemberFilter);
            }
          }
        }

        _.forEach(aNewlyCreatedMemberFilter, (oMemberFilter) => {
          oSelectionList.add(this._createFFMemberFilter(oMemberFilter));
        });
      }
      return oSelectionList;
    };

    MemberFilter.getFFOperatorFromUI5Operator = function (sOperator) {
      return FF.ComparisonOperator[MemberFilterOperator[sOperator][0].Operator];
    };

    MemberFilter.getUI5OperatorFromFFOperator = function (oFFOperator) {
      return _.findKey(MemberFilterOperator, (aMemberFilterOperator) => {
        if (aMemberFilterOperator) {
          return aMemberFilterOperator.find((oMemberFilterOperator) => {
            return oMemberFilterOperator.Operator === oFFOperator.Operator && oMemberFilterOperator.Sign === oFFOperator.Sign;
          });
        }
      });
    };

    return MemberFilter;
  }
);
