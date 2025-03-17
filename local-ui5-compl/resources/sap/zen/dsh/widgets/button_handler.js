/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/zen/dsh/utils/BaseHandler"],function(jQuery,t){"use strict";var e=function(){t.apply(this,arguments);var e=t.dispatcher;var n=function(n,i){var a=e.getValue(i,"caption");var s=i.tooltip;var r=i.image;n.setText(a);n.setTooltip(s);n.setEnabled(i.enabled);if(t.dispatcher.isMainMode()){var o=i.buttontype||"Default";n.setType(o)}if(r&&r.length>0){n.setIcon(r);if(i.iconfirst){n.setIconFirst(true)}else{n.setIconFirst(false)}}else{n.setIcon(null)}};this.create=function(t,e){var i=e["id"];var a=this.createButtonWithHeight(i);n(a,e);if(e.onclick){a.attachPress(function(){new Function(e.onclick)()})}return a};this.update=function(t,e){if(e){n(t,e)}};this.getType=function(){return"button"}};var n=new e;t.dispatcher.addHandlers("button",n);return n});
//# sourceMappingURL=button_handler.js.map