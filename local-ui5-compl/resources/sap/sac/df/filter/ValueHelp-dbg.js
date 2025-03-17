/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap,Promise*/
sap.ui.define([
  "sap/ui/mdc/ValueHelp",
  "sap/ui/mdc/valuehelp/content/FixedList",
  "sap/ui/mdc/valuehelp/content/FixedListItem",
  "sap/ui/mdc/valuehelp/Popover",
  "sap/sac/df/model/MemberFilter",
  "sap/ui/core/library"
], (
  MDCValueHelp,
  FixedList,
  FixedListItem,
  Popover,
  MemberFilter,
  coreLibrary
) => {
  "use strict";

  /**
   * Constructor for a new <code>ValueHelp</code>.
   *
   * @param {string} [sId] ID for the new element, generated automatically if no ID is given
   * @param {object} [mSettings] Initial settings for the new element
   * @class
   * The <code>ValueHelp</code> element can be assigned to the {@link sap.ui.mdc.Field Field}, {@link sap.ui.mdc.MultiValueField MultiValueField},
   * and {@link sap.ui.mdc.FilterField FilterField} controls using the <code>valueHelp</code> association. One <code>ValueHelp</code> element instance can be
   * assigned to multiple fields (like in different table rows). It should be placed in the control tree on the container holding the fields.
   * @extends sap.ui.mdc.ValueHelp
   * @version 1.132.0
   * @constructor
   * @abstract
   * @private
   * @since 1.122
   * @alias sap.sac.df.filter.ValueHelp
   * @experimental As of version 1.122
   */

  // shortcut for sap.ui.core.ValueState
  const ValueState = coreLibrary.ValueState;
  const ValueHelp = MDCValueHelp.extend("sap.sac.df.filter.ValueHelp", /** @lends sap.sac.df.filter.ValueHelp.prototype */ {
    metadata: {
      library: "sap.sac.df"
    },

    init: function () {
      MDCValueHelp.prototype.init.apply(this, arguments);
      this.setDelegate({
        name: "sap/sac/df/filter/delegate/ValueHelpDelegate",
        payload: {
          isDefaultHelp: true
        }
      });
      this.setTypeahead(new Popover(this.getId() + "--TypeAheadPopover", {
        content: [
          new FixedList(this.getId() + "--FixedList", {
            filterList: false,
            useFirstMatch: false
          })
        ]
      }));
      this.attachSelect(null, this._onSelectSuggestedItem.bind(this));
    },

    _onSelectSuggestedItem: function (oEvent) {
      const that = this;
      const aConditions = oEvent.getParameter("conditions");
      if (aConditions.length === 1) {
        const sNewValue = aConditions[0].values[0];
        const sText = aConditions[0].values[1];
        const oControl = this.getControl();
        const oMetaObject = oControl._getMetaObject();
        oControl.setValueState(ValueState.None);
        oControl.setValueStateText();
        const oMemberFilter = new MemberFilter([sNewValue], [sNewValue], [sText]);
        return Promise.resolve().then(function () {
          oControl.getMaxConditions() === 1
            ? oMetaObject.setMemberFilter(oMemberFilter, !oControl._getLiveMode())
            : oMetaObject.addMemberFilter(oMemberFilter, !oControl._getLiveMode());
          oEvent.getSource().setFilterValue(null);
          const oTypeAheadPopover = that.getTypeahead();
          oTypeAheadPopover.close();
          const oFixedList = oTypeAheadPopover.getContent()[0];
          oFixedList.destroyItems();
          oControl.destroyAggregation("valueHelp");
        }).catch(function () {
          that.getControl()._setBusy(false);
        });
      }
    },

    getIcon: function () {
      return "sap-icon://value-help";
    }

  });

  return ValueHelp;

});
