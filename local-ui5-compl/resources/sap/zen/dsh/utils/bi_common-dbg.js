/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/* eslint-disable no-undef */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/utils/bi_common",
  [
    "sap/base/Log",
    "jquery.sap.global",
    "sap/zen/dsh/utils/dispatcher",
    "sap/zen/dsh/utils/CssPlugin",
    "sap/sac/df/firefly/library"
  ],
  function( Log,jQuery,Dispatcher ){
    "use strict";
    Log.info("Load bi_common");
    sap.zen.createStaticMimeUrl = function(path) {
      if(path.indexOf("/") !== 0) {
        path = "/" + path;
      }
      return sap.zen.dsh.sapbi_page.staticMimeUrlPrefix + path;
    };
    sap.zen.createStaticSdkMimeUrl = function(sdkExtensionId, path) {
      return "zen/mimes/sdk_include/" + sdkExtensionId + "/" + path;
    };
    var sapbi_keyCode = "";
    var sapbi_radioButtons = null;
    sap.zen.dsh.launch = function (config) {
      jQuery(
        window
      ).unload(
        function() {
          jQuery.ajax(
            {
              type: "POST",
              url: config.urlPrefix,
              data: {"sap-sessioncmd": "USR_ABORT", "sap-ext-sid": config.esid},
              dataType: "json",
              async: false
            }
          );
        }
      );
      sap.zen.dsh.sapbi_page.initializePage();
      var requestHandler = sap.zen.dsh.sapbi_createAjaxHandler(window);
      var commandSequence = new sap.zen.dsh.sapbi_CommandSequence();
      commandSequence.addParameter(new sap.zen.dsh.sapbi_Parameter("ZEN_1STCALL", "X"));
      var additionalParameters = config.urlParameters + "&sap-ext-sid=" + config.esid;
      requestHandler.submit(false, "", config.urlPrefix, "", commandSequence, false, additionalParameters);
    };
    function sapbi_getElementsByAttribute(attrib, value, context_node, tag) {
      var nodes = [];
      if (tag == null)
        tag = "*";
      var elems = context_node.getElementsByTagName(tag);
      for (var i = 0; i < elems.length; i += 1) {
        if (value) {
          if (elems[i].getAttribute(attrib) === value)
            nodes.push(elems[i]);
        } else {
          if (elems[i].hasAttribute(attrib))
            nodes.push(elems[i]);
        }
      }
      return nodes;
    }
    function sapbi_getRadioButtonElements(node) {
      return sapbi_getElementsByAttribute("typ", "RadioButton", node, "uiele");
    }

    function sapbi_acComboBox_getByValue(parameterList, value) {
      var paramNameArray = parameterList.getParameterNames();

      for (var i = 0; i < paramNameArray.length; i++) {
        var currentName = paramNameArray[i];
        var selectedEntry = parameterList.getParameter(currentName);

        if (selectedEntry.getValue() === value)
          return selectedEntry;
      }

      return null;
    }
    // ////////////

    // ////////////////////////

    function sapbi_acComboBox_transfer(in_command) {
      // get the id of the combo box field
      var passiveIdParameter = in_command.getParameter(sapbi_PASSIVE_ID);
      var strPassiveId = passiveIdParameter.getValue();

      // get the value
      var strValue = comboBoxSelectedKey[strPassiveId];

      if (strValue == null) {
        return null;
      }
      // add the value to the command
      var valueParameter = new sapbi_Parameter(sapbi_PASSIVE_VALUE, strValue);
      in_command.addParameter(valueParameter);

      return in_command;
    }

    sap.zen.LoadingIndicator = function(delay) {

      this.delay = delay;
      this.executeShowHide = true;
      this.enabledForNextCall = true;

      this.setDelay = function(iDelay){
        if(this.delay !== -1){
          this.delay = iDelay;
        }
      };

      this.setExecuteShowHide = function(bExecuteShowHide){
        this.executeShowHide = bExecuteShowHide;
      };

      this.show = function() {
        this.executeShowHide && this.enabledForNextCall && sap && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator.show(this.delay);
        this.enabledForNextCall = true;
      };

      this.showImmediately = function() {
        this.executeShowHide && sap && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator.show(0);
      };

      this.hide = function() {
        this.executeShowHide && sap && sap.ui && sap.ui.core && sap.ui.core.BusyIndicator.hide();
      };

      this.hideAsync = function() {
        this.hide();
      };

      this.disableForNextCall = function() {
        this.enabledForNextCall = false;
      };

    };

    sap.zen.loadingIndicator = null;

    sap.zen.dsh.getLoadingIndicator = function() {
      if (!sap.zen.loadingIndicator) {
        sap.zen.loadingIndicator = new sap.zen.LoadingIndicator(0);
      }
      return sap.zen.loadingIndicator;
    };
    function sapbi_focusFirstElementInTemplateDialog() {
    }

    // ////////////////////////

    var comboBoxSelectedKey = {};
    var inputFieldsText = {};
    var checkBoxStates = {};
    var tabStripStates = {};

    function sapbi_setComboBoxSelectedKey(comboBoxId, key) {
      comboBoxSelectedKey[comboBoxId] = key;
    }
    function sapbi_setInputFieldText(textFieldId, text) {
      inputFieldsText[textFieldId] = text;
    }
    function sapbi_setCheckBoxState(checkBoxId, checked) {
      checkBoxStates[checkBoxId] = checked;
    }

    function sapbi_setTabStripState(tabStripId, selected) {
      tabStripStates[tabStripId] = selected;
    }

    function sapbi_acRadioButton_clientToggle(urParam) {
      // convert the arrays into parameter objects
      var urParameterList = sapbi_createParameterList(urParam);
      var id = urParameterList.getParameter(sapbi_CONTROL_ID).getValue();

      sap.zen.dsh.sapbi_page.toggleAssociations(id, null, true);

      var groupId = null, i, radioButton, lid;
      for (i = 0; i < sapbi_radioButtons.length; i++) {
        radioButton = sapbi_radioButtons[i];
        lid = radioButton.getElementsByTagName("Id")[0].text;
        if (lid === id) {
          groupId = radioButton.getElementsByTagName("Name")[0].text;
          sapbi_radioButtonsValues[id] = "true";
          break;
        }
      }

      for (i = 0; i < sapbi_radioButtons.length; i++) {
        radioButton = sapbi_radioButtons[i];
        lid = radioButton.getElementsByTagName("Id")[0].text;
        var lgroupId = radioButton.getElementsByTagName("Name")[0].text;
        if ((groupId === lgroupId) && (id !== lid)) {
          sapbi_radioButtonsValues[lid] = "false";
          sap.zen.dsh.sapbi_page.toggleAssociations(currentRadioId, null, false);
        }
      }

    }

    // ////////////////////////

    function sapbi_donothing() {

    }

    var sapbi_radioButtonsValues = null;

    function sapbi_initRadioButtonValues() {
      sapbi_radioButtonsValues = {};
      for (var i = 0; i < sapbi_radioButtons.length; i++) {
        var radioButton = sapbi_radioButtons[i];
        var id = radioButton.getElementsByTagName("Id")[0].text;
        var checked = radioButton.getElementsByTagName("Checked")[0].text;
        if (checked === "true") {
          sapbi_radioButtonsValues[id] = "true";
        } else {
          sapbi_radioButtonsValues[id] = "false";
        }
      }
    }

    function sapbi_acRadioButton_transfer(in_command) {
      // get the id of the input field
      var passiveIdParameter = in_command.getParameter(sapbi_PASSIVE_ID);
      var strPassiveId = passiveIdParameter.getValue();

      // get the value
      var strValue = sapbi_radioButtonsValues[strPassiveId];
      if (strValue == null) {
        return null;
      }

      // add the value to the command
      var valueParameter = new sapbi_Parameter(sapbi_PASSIVE_VALUE, strValue);
      in_command.addParameter(valueParameter);

      return in_command;
    }

    function sapbi_acCheckBox_transfer(in_command) {
      var passiveIdParameter = in_command.getParameter(sapbi_PASSIVE_ID);
      var strPassiveId = passiveIdParameter.getValue();

      // get the value
      var strValue = checkBoxStates[strPassiveId];
      if (strValue == null) {
        return null;
      }

      // add the value to the command
      var valueParameter = new sapbi_Parameter(sapbi_PASSIVE_VALUE, strValue);
      in_command.addParameter(valueParameter);

      return in_command;
    }

    function sapbi_acInputTransfer(in_command) {
      var passiveIdParameter = in_command.getParameter(sapbi_PASSIVE_ID);
      var strPassiveId = passiveIdParameter.getValue();

      // get the value
      var strValue = inputFieldsText[strPassiveId];
      if (strValue == null) {
        return null;
      }

      // add the value to the command
      var valueParameter = new sapbi_Parameter(sapbi_PASSIVE_VALUE, strValue);
      in_command.addParameter(valueParameter);

      return in_command;
    }

    function sapbi_acUniGrid_selectCell(urParam, localEvent) {
      return sapbi_acUniGrid_selectCellInternal(urParam, localEvent, true, true, false); // a normal cell
    }

    function sapbi_acUniGrid_selectRow(urParam, localEvent) {
      // return sapbi_acUniGrid_selectCellInternal( urParam, localEvent, true, false, true ); // a selection cell
    }

    function sapbi_acUniGrid_selectColumn(urParam, localEvent) {
      // return sapbi_acUniGrid_selectCellInternal( urParam, localEvent, false, true, true ); // a selection cell
    }

    // ///////////////////////////////////////////
    // ///////////////////////////////////////////
    // ///////////////////////////////////////////

    function sapbi_acUniGrid_selectCellInternal(urParam, localEvent, doProcessRows, doProcessColumns, isSelectionCell) {
      // Workaround for internal CSN 1567858 2009. IE8 crashes in case the onclick
      // is caused by a selection.
      // Solution: In case it is IE8 don't handle the onclick event in case some
      // text is selected.
      // Surround with try-catch-block to be as non-destructive as possible
      try {
        var ie8wa_browserType = new sapbi_BrowserCheck();
        // Check the browser type
        if (ie8wa_browserType.getType() === sapbi_BROWSER_TYPE_IE && ie8wa_browserType.getVersion() === 8) {
          // Check if text is selected (check could be perfomrmed in the enclosing
          // if-statement as well, but it is more obvious this way)
          if (document.selection.createRange().text.length > 0) {
            return false;
          }
        }
      } catch (ex) {
        // Do nothing
      }

      // convert the arrays into parameter objects
      var urParameterList = sapbi_createParameterList(urParam);
  
      if (urParameterList.exists("triggercmd")) {
        var cmd = urParameterList.getParameter("triggercmd").getChildList();
        sap.zen.dsh.sapbi_page.sendCommand(cmd);
      }

      localEvent.returnValue = false;
      return false;
    }

    function sapbi_acUniGrid_clearCache() {

    }

    function sapbi_acUniGrid_transfer(in_command) {
      var passiveIdParameter = in_command.getParameter(sapbi_PASSIVE_ID);
      var strPassiveId = passiveIdParameter.getValue();
      var value = sapbi_tableRowSelectedState[strPassiveId];

      value = value + ";;;";

      var valueParameter = new sapbi_Parameter(sapbi_PASSIVE_VALUE, value);
      in_command.addParameter(valueParameter);

      return in_command;
    }

    var sapbi_tableRowSelectedState = {};
    function sapbi_setRowSelectedState(tableId, selectedString) {
      sapbi_tableRowSelectedState[tableId] = selectedString;
    }

    // an array, used as hash, to store all ids
    var sapbi_analysisItemHash = {};
    // constant for the input id
    // var sapbi_analysis_INPUT_ID_NAME = "INPUT_CELL_ID";
    // The id of the item.
    // var sapbi_analysis_ITEM_ID = "ITEM"; //$NON-NLS-1$
    // The id of the advanced ctrl.
    // var sapbi_analysis_ADV_ID = "ADV"; //$NON-NLS-1$

    // handle the change of an input field

    // transfer the value of the input field
    function sapbi_analysisItemInputTransfer(in_command) {
      // get the id of the input field
      var id = in_command.getParameter(sapbi_PASSIVE_ID).getValue();
      // get the value
      var strValue = inputFieldsText[id];
      // set the value
      in_command.addParameter(new sapbi_Parameter(sapbi_PASSIVE_VALUE, strValue));
      // Remove this element from the hash
      sapbi_analysisItemHash[id] = null;

      return in_command;
    }

    function ur_EVT_cancel(event) {

    }

    function sapzen_createPopup(oHostedControl) {
      var oPopup = new sap.ui.core.Popup(oHostedControl, true, true, false);

      sap.zen.dsh.Dispatcher.instance.currentPopup = oPopup;
      oPopup.attachClosed(function() {
        var content = this.getContent();
        if(content.destroy) { // is SAP UI 5 element
          content.destroy();
        }
        this.destroy();
      });
      oPopup.setInitialFocusId("sapbi_snippet_ROOT_DIALOG");
      return oPopup;
    }

    function sapzen_openPopup(dlgHeight, dlgWidth) {
      var oPopup = Dispatcher.currentPopup;
      var eDock = sap.ui.core.Popup.Dock;
      oPopup.setPosition(eDock.CenterCenter, eDock.CenterCenter, window);
      oPopup.open();
    }

    function sapbi_closeDialog() {
      if (Dispatcher.currentPopup) {
        Dispatcher.currentPopup.close();
        delete Dispatcher.currentPopup;
        this.sapbi_dialogStatus = "closing";
      }
      // for "m". Keep the method for compatibility since this is used elsewhere in ZEN
      if ( Dispatcher.oCurrentVarDlg && DispatcherisMainMode()) {
        sap.zen.ZenDialogHandler.closeDialog();
        this.sapbi_dialogStatus = "closing";
      }
    }


    // ('modal',true,'true','true',[['BI_COMMAND',null,0,[['BI_COMMAND_TYPE','UPDATE',0]]]],'false',[]);
    function sapbi_DoDialogReLoaded(displayMode, useLayeredDialogs, closeDialog, updateCaller, parentUpdateCommand,
      hasFollowingCommand, followingCommand) {

      if(typeof sap.zen.dsh.sapbi_updateDialogInDesigner === "function") {
        sapbi_updateDialogInDesigner();
      }
    }

    function sapbi_DoDialogLoaded(displayMode, useLayeredDialogs, closeDialog, updateCaller, parentUpdateCommand,
      hasFollowingCommand, followingCommand) {
    }

    function sapbi_isNotUr() {

    }

    function sapbi_resizeDialog() {
    }

    function sapbi_checkDestroyDialog() {
    }

    /////////////////////////////////////////////////////////////////////////+
  }
);
