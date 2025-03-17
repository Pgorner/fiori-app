/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/sac/df/thirdparty/lodash",
    "sap/zen/dsh/utils/BaseHandler",
    "sap/zen/commons/layout/AbsoluteLayout"
  ],
  function(jQuery, _, BaseHandler,AbsoluteLayout) {
    "use strict";
    AbsoluteLayout.extend(
      "sap.zen.ZenAbsLayout", {
        metadata : {
          properties : {
            "cssStyle" : "string",
          }
        },
        renderer : {},
        onAfterRendering : function(evt) { // is called when the Control's area is
          if (sap.zen.commons.layout.AbsoluteLayout.prototype.onAfterRendering) {
            sap.zen.commons.layout.AbsoluteLayout.prototype.onAfterRendering.apply(this, [ evt ]);
          }
          var jqThis = this.$();
          var newstyle = jqThis.attr("style");
          newstyle += ";" + this.getCssStyle();
          jqThis.attr("style", newstyle);
        }
      }
    );
    var PanelHandler = function() {
      BaseHandler.apply(this, arguments);
      var dispatcher = BaseHandler.dispatcher;
      var that = this;
      function init(oControl, oControlProperties) {
        oControl.setCssStyle(oControlProperties.cssStyle);
        var oAbsLayout = oControl;
        var aChildren = oControlProperties.content;
        if (aChildren) {
          that.updateChildren(
            aChildren, oControl,
            function(oNewControl, iIndex, componentData) {
              // workaround: set width & height here
              //otherwise absolute layout container will be renderedd twice
              if(componentData){
                var args = dispatcher.createAbsoluteLayoutInfo(componentData);
                var width = dispatcher.calcWidthUseOrderOfPriority(args.left, args.right, componentData.width);
                var height = dispatcher.calcHeightUseOrderOfPriority(args.top, args.bottom, componentData.height);
                dispatcher.setWidthHeight(oNewControl, width, height);
              }
              dispatcher.insertIntoAbsoluteLayoutContainer(oAbsLayout, oNewControl, iIndex);
            },
            function(oControlToRemove){
              oAbsLayout.removeContent(oControlToRemove);
            }
          );
        }
      }
      this.create = function(oChainedControl, oControlProperties) {
        var controlId = oControlProperties["id"];
        // TODO: Replace with correct control creation and initialization logic
        //              var oControl = new sap.ui.commons.TextView(id);
        var oControl = new sap.zen.ZenAbsLayout(controlId);
        init(oControl, oControlProperties);
        oControl.addStyleClass("zenborder");
        if (oControlProperties.onclick) {
          oControl.addStyleClass("zenClickable");
          oControl.attachBrowserEvent("click",function () {
            var f= new Function(oControlProperties.onclick);
            f();
          });
        }
        return oControl;
      };
      this.update = function(oControl, oControlProperties) {
        if (oControlProperties) {
          init(oControl, oControlProperties);
        }
        return oControl;
      };
      this.applyForChildren = function(absLayout, funclet) {
        if (!absLayout.getPositions) {
          return null;
        }
        var positionContainers = absLayout.getPositions();
        for ( var i = 0; i < positionContainers.length; i++) {
          var oControl = positionContainers[i].getControl();
          if (oControl) {
            var result = funclet(oControl);
            if (result)
              return result;
          }
        }
        return null;
      };
      this.getDecorator = function() {
        return "AbsLayoutDecorator";
      };
      this.getType = function() {
        return "panel";
      };
    };
    var instance = new PanelHandler();
    BaseHandler.dispatcher.addHandlers(instance.getType(), instance);
    return instance;
  }
);
