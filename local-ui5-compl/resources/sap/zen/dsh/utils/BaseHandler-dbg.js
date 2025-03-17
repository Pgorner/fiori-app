/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/base/Log",
    "sap/zen/dsh/utils/dispatcher",
    "sap/m/IconTabBar",
    "sap/m/IconTabFilter",
    "sap/ui/commons/TabStrip",
    "sap/m/Select",
    "sap/m/Panel",
    "sap/ui/commons/Panel",
    "sap/m/Dialog",
    "sap/ui/commons/Dialog",
    "sap/m/Button",
    "sap/ui/commons/Button",
    "sap/m/TextArea",
    "sap/ui/commons/TextArea",
    "sap/m/Label",
    "sap/ui/commons/Label",
    "sap/zen/commons/layout/AbsoluteLayout",
    "sap/ui/unified/Menu",
    "sap/ui/unified/MenuItem",
    "sap/m/CheckBox",
    "sap/ui/commons/CheckBox",
    "sap/sac/df/firefly/library",
    "sap/ui/table/library"
  ],
  function(
    jQuery, Log, dispatcher, IconTabBar, IconTabFilter,
    TabStrip, Select, MPanel, CPanel, MDialog, CDialog,
    MButton, CButton, MTextArea, CTextArea, MLabel, CLabel, AbsoluteLayout, UMenu, UMenuItem, MCheckBox, CCheckBox
  ){
    function BaseHandler() {
      this.styleClasses = [];
      this.createUI5Identifier = function(sId) {
        return sId.replace(/[^-A-Za-z0-9_.:]/g, "_");
      };
      this.remove = function(oControl) {
        if (this.applyForChildren) {
          this.applyForChildren(oControl, function(oChild) {
            dispatcher.dispatchRemove(oChild);
          });
        }
        dispatcher.deregisterResizeHandler(oControl);
        if (oControl.zenMessageControl) {
          dispatcher.removeMessageOverlay(oControl);
          oControl.onAfterRendering = oControl.oldAfterRenderingForDispatching;
          delete oControl.oldAfterRenderingForDispatching;
          delete oControl.showLoadingState;
          delete oControl.showLoadingStateText;
          delete oControl.showLoadingStateIcon;
          delete oControl.zenMessageControl;
        }
        oControl.destroy();
      };
      this.createAndAdd = function(phxObj, controlData, componentData, fInsertIntoParentFunclet, iIndex) {
        var oNewControl = this.create(phxObj, controlData, componentData);
        if(!oNewControl){
          Log.error("Failed to create a new control");
          throw new Error("Failed to create new control");
        }
        if (fInsertIntoParentFunclet) {
          fInsertIntoParentFunclet(oNewControl, iIndex, componentData);
        }
        dispatcher.updateComponentProperties(oNewControl, componentData, fInsertIntoParentFunclet);
        return oNewControl;
      };
      this.updateComponent = function(oControl, oControlProperties, oComponentProperties, fAppendToParentFunclet) {
        this.update(oControl, oControlProperties, oComponentProperties);
        dispatcher.updateComponentProperties(oControl, oComponentProperties, fAppendToParentFunclet);
      };
      this.isNew = function(oComponentProperties) {
        return dispatcher.getRootControlForComponentId(oComponentProperties.id) == null;
      };
      this.updateChildren = function(aChildrenFromJson, oContainer, fInsertIntoParentFunclet, fDeleteFromParentFunclet) {
        var mapAllChildrenComponentIds = this.getAllChildren(oContainer);
        for (var i = 0; i < aChildrenFromJson.length; i++) {
          var jsonChild;
          if (aChildrenFromJson[i].component) {
            jsonChild = aChildrenFromJson[i].component;
          } else {
            jsonChild = {
              id: aChildrenFromJson[i].control.id,
              content: aChildrenFromJson[i]
            };
            var oLayoutProperties = jsonChild.content.control.controlLayoutProperties;
            if (oLayoutProperties) {
              for (var oKey in oLayoutProperties) {
                if (Object.prototype.hasOwnProperty.call(oLayoutProperties, oKey)) {
                  jsonChild[oKey] = oLayoutProperties[oKey];
                }
              }
            }
          }
          var childEntry = mapAllChildrenComponentIds[jsonChild.id];
          if (this.isNew(jsonChild)) {
            dispatcher.dispatchCreateControl(jsonChild, fInsertIntoParentFunclet, i);
          } else if (childEntry) {
            var iChildIndex = childEntry.i;
            if (iChildIndex !== i) {
              var childControl = childEntry.o;
              fDeleteFromParentFunclet(childControl);
              fInsertIntoParentFunclet(childControl, i);
            }
            dispatcher.dispatchUpdateControl(jsonChild);
          } else {
            var phxControl = dispatcher.getTransferControl(jsonChild.id);
            fInsertIntoParentFunclet(phxControl, i);
            dispatcher.dispatchUpdateControl(jsonChild, fInsertIntoParentFunclet);
          }
          delete mapAllChildrenComponentIds[jsonChild.id];
        }
        var mapChildrenAfterUpdate = this.getAllChildren(oContainer);
        for ( var oRemainingComponentId in mapAllChildrenComponentIds) {
          if (mapChildrenAfterUpdate[oRemainingComponentId]) {
            var oControl = mapAllChildrenComponentIds[oRemainingComponentId].o;
            dispatcher.addTransferControl(oControl, fDeleteFromParentFunclet);
          }
        }
      };
      this.getAllChildren = function(oControl) {
        var result = {};
        var iIndex = 0;
        var funclet = function(oChild) {
          var componentId = dispatcher.getComponentIdForControl(oChild);
          if (componentId) {
            result[componentId] = {
              i: iIndex,
              o: oChild
            };
            iIndex++;
          }
        };
        this.applyForChildren(oControl, funclet);
        return result;
      };
      /**
       * Call this function if your handler if you want to send a RIC command via Javascript (PVT). The pattern is that a
       * "template" with a placeholder is passed in. The value is correctly escaped and then put into the placeholder's
       * position.
       */
      this.prepareCommand = function(sTemplate, sPlaceholder, sValue) {
        return dispatcher.prepareCommand(sTemplate, sPlaceholder, sValue);
      };
      this.advancedPropertyCall = function() {
        return null;
      };
      this.getContextMenuAction = function() {
        return null;
      };
      this.getDefaultProxyClass = function(){
        throw new Error("You have to provide a default proxy class! [<MCLASS>,<UI_COMMONS_CLASS>]");
      };
      this.provideFunctionMapping = function(){
        return null;
      };
      var getClassByString = function(sClass){
        Log.info("Dynamically loading class: " + sClass);
        var result = resolvePath(sClass);
        if (result == null)
        {
          jQuery.sap.require(sClass);
          result = resolvePath(sClass);
        }
        if (result == null) {
          throw new Error("Object does not exist! Check your getDefaultProxyClass method!");
        }
        return result;
      };
      var attachNewFunction = function(oControl, uiCommonsFunctionName, mFunctionName){
        oControl[uiCommonsFunctionName] = function(){
          if(mFunctionName !== null){
            return this[mFunctionName].apply(this,arguments);
          }
          return null;
        };
      };
      this.createDefaultProxy = function(sId){
        var sClass, oClass;
        if(dispatcher.isMainMode()){
          sClass = this.getDefaultProxyClass()[0];
          oClass = getClassByString(sClass);
          var oControl = new oClass(sId);
          var functionMappings = this.provideFunctionMapping();
          if(functionMappings != null){
            for (var i = 0; i < functionMappings.length; i++) {
              var uiCommonsFunctionName = functionMappings[i][1];
              var mFunctionName = functionMappings[i][0];
              attachNewFunction(oControl, uiCommonsFunctionName, mFunctionName);
            }
          }
          return oControl;
        } else {
          sClass = this.getDefaultProxyClass()[1];
          oClass = getClassByString(sClass);
          return new oClass(sId);
        }
      };
      function resolvePath(sClass) {
        var aPath = sClass.split(".");
        var oResolvedPath = window;
        for ( var i = 0; i < aPath.length; i++) {
          var sOnePathPart = aPath[i];
          oResolvedPath = oResolvedPath[sOnePathPart];
          if(!oResolvedPath){
            break;
          }
        }
        return oResolvedPath;
      }
      this.createButton = function(sId,oAttr){
        //sId could also be oAttr. Does not matter for this call.
        if(dispatcher.isMainMode()){
          return new MButton(sId, oAttr);
        }else{
          return new CButton(sId, oAttr);
        }
      };
      this.createButtonWithHeight = function(sId){
        //sId could also be oAttr. Does not matter for this call.
        if(dispatcher.isMainMode()){
          this.createZenButtonClassIfNecessary();
          return new sap.zen.ZenButton(sId);
        }else{
          return new CButton(sId);
        }
      };
      this.createZenButtonClassIfNecessary = function(){
        if(dispatcher.isMainMode()){
          MButton.extend("sap.zen.ZenButton", {
            // the control API:
            metadata : {
              properties : {
                height : "sap.ui.core.CSSSize"
              }
            },
            renderer : {},
            // an event handler:
            onAfterRendering : function(evt) { // is called when the Control's area is
              // clicked - no event registration
              // required
              if (MButton.prototype.onAfterRendering) {
                MButton.prototype.onAfterRendering.apply(this, [ evt ]);
              }
              this.addStyleClass("zenSapMBtnFixHeight");
              var height = this.getHeight();
              var jqThis = this.$();
              var firstChild = jQuery(jqThis.children()[0]);
              var firstChildChild = jQuery(firstChild.children()[0]);
              if (height !== "auto") {
                jqThis.css("height",height);
                firstChild.css("height",height);
                firstChildChild.css("line-height",height);
              }
            }
          });
        }
      };
      this.createPanel = function (sId){
        if(dispatcher.isMainMode()){
          return new MPanel(sId);
        }else{
          return new CPanel(sId);
        }
      };
      this.createDropdownBox = function(sId, oAttr){
        if(dispatcher.isMainMode()){
          var oSelect = new Select(sId, oAttr);
          oSelect.setEditable = function(){
          };
          oSelect.getValue = function(){
            return this.getSelectedItem().getKey();
          };
          return oSelect;
        }else{
          return new sap.ui.commons.DropdownBox(sId, oAttr);
        }
      };
      this.createTabStrip = function(sId, oAttr){
        if(dispatcher.isMainMode()){
          var tabStrip = IconTabBar(sId, oAttr);
          tabStrip.createTab = function(sTitle,oObject){
            var oTab = new IconTabFilter();
            oTab.setText(sTitle);
            oTab.addContent(oObject);
            this.addItem(oTab);
          };
          tabStrip.getSelectedIndex = function(){
            var aItems = this.getItems();
            for ( var i = 0; i < aItems.length; i++) {
              if(aItems[i].getId() === this.getSelectedKey()){
                return i;
              }
            }
            return 0;
          };
          tabStrip.setSelectedIndex = function(iTabindex){
            var aItems = this.getItems();
            this.setSelectedKey(aItems[iTabindex].getId());
          };
          return tabStrip;
        }else{
          return new TabStrip(sId, oAttr);
        }
      };
      this.createLabel = function(sId, oAttr){
        if(dispatcher.isMainMode()){
          return new MLabel(sId, oAttr);
        }else{
          return new CLabel(sId, oAttr);
        }
      };
      this.createTree = function(sId){
        if(dispatcher.isMainMode()){
          return new sap.ui.table.TreeTable(sId,{
            columns: [
              new sap.ui.table.Column({label: "Text", template: "text"})
            ]});
        }else{
          return new sap.ui.commons.Tree(sId);
        }
      };
      this.createDialog = function(sId, oParams){
        if(dispatcher.isMainMode()){
          var oDialog = new MDialog(sId);
          oDialog.attachClosed = function(fFunclet){
            this.attachAfterClose(fFunclet);
          };
          oDialog.setResizable = function(){
          };
          oDialog.setMinWidth = function(){
          };
          oDialog.setMinHeight = function(){
          };
          // Newer UI5 versions do not add this any more!
          oDialog.addStyleClass("sapUiPopupWithPadding");
          return oDialog;
        }else{
          return new CDialog(sId, oParams);
        }
      };
      this.createMenu = function(sId, oAttr){
        if(dispatcher.isMainMode()){

          return new UMenu(sId, oAttr);
        }else{
          return new sap.ui.commons.Menu(sId, oAttr);
        }
      };
      this.createMenuItem = function(sId, oParams){
        if(dispatcher.isMainMode()){
          return new UMenuItem(sId,oParams);
        }else{
          return new sap.ui.commons.MenuItem(sId,oParams);
        }
      };
      this.createCheckBox = function(sId, oAttr){
        if(dispatcher.isMainMode()){
          var cb = new MCheckBox(sId, oAttr);
          cb.setChecked = function(cChecked){
            this.setSelected(cChecked);
          };
          cb.getChecked = function(){
            return this.getSelected();
          };
          cb.attachChange = function(fFunclet){
            this.attachSelect(fFunclet);
          };
          return cb;
        }else{
          return new CCheckBox(sId, oAttr);
        }
      };
      this.createTextView = function(sId, oAttr) {
        if (dispatcher.isMainMode()) {
          return new sap.m.Text(sId, oAttr);
        } else {
          return new sap.ui.commons.TextView(sId, oAttr);
        }
      };
      this.createTextField = function(sId, oAttr){
        if(dispatcher.isMainMode()){
          return new sap.m.Input(sId, oAttr);
        }else{
          return new sap.ui.commons.TextField(sId, oAttr);
        }
      };
      this.createTextArea = function(sId, oAttr){
        //sId could also be oAttr. Does not matter for this call.
        if(dispatcher.isMainMode()){
          return new MTextArea(sId, oAttr);
        }else{
          return new CTextArea(sId, oAttr);
        }
      };
      this.useMessageBox = function(){
        if(dispatcher.isMainMode()){
          return sap.m.MessageBox;
        }else{
          return sap.ui.commons.MessageBox;
        }
      };
      this.createTextWithHeight = function(sId, oAttr){
        this.createTextClassWithHeight();
        //sId could also be oAttr. Does not matter for this call.
        return new sap.zen.dsh.ZenTextView(sId, oAttr);
      };
      this.createTextClassWithHeight = function(){
        //This fix is intended for S4HANA. A switch between apps can happen, which use commons and m respectively.
        //In this case we need to recreate the class with a different superclass.
        if(sap.zen.dsh.ZenTextView && sap.zen.dsh.ZenTextView.isMainMode !== dispatcher.isMainMode()){
          delete sap.zen.ZenTextView;
        }
        if(!sap.zen.dsh.ZenTextView){
          var toInheritFrom;
          if(dispatcher.isMainMode()){
            toInheritFrom = sap.m.Text;
          }else{
            toInheritFrom = sap.ui.commons.TextView;
          }
          toInheritFrom.extend("sap.zen.dsh.ZenTextView", {
            // the control API:
            metadata : {
              properties : {
                "height" : "sap.ui.core.CSSSize",
                "cssStyle" : "string"
              }
            },
            renderer : {},
            // an event handler:
            onAfterRendering : function(evt) { // is called when the Control's area is
              // clicked - no event registration
              // required
              if (toInheritFrom.prototype.onAfterRendering) {
                toInheritFrom.prototype.onAfterRendering.apply(this, [ evt ]);
              }
              var height = this.getHeight();
              var jqThis = this.$();
              if (height !== "auto") {
                // set height
                jqThis.height(height);
              }
              var newstyle = jqThis.attr("style");
              newstyle += ";" + this.getCssStyle();
              jqThis.attr("style", newstyle);
            }
          });
          sap.zen.dsh.ZenTextView.isMainMode = dispatcher.isMainMode();
        }
      };
      this.createAbsoluteLayout = function(sId, oParams){
        return new AbsoluteLayout(sId, oParams);
      };
    }
    BaseHandler.dispatcher = dispatcher;
    return BaseHandler;
  }
);
