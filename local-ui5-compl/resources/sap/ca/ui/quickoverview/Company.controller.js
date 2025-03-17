/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("sap.ca.ui.quickoverview.Company",{onTapSMS:function(e){sap.m.URLHelper.triggerSms(this.byId("qvMainContactMobile").getText())},onTapPhone:function(e){sap.m.URLHelper.triggerTel(e.getSource().getText())},onTapEmail:function(e){var t="";var a=this.getView().getModel();if(a&&a.getData()){t=a.getData().maincontactemailsubj?a.getData().maincontactemailsubj:""}sap.m.URLHelper.triggerEmail(e.getSource().getText(),t)},onBeforeRendering:function(){var e=this.byId("qvMainContactSMS");if(e){e.setVisible(this.byId("qvMainContactMobile").getText()!=="")}}});
//# sourceMappingURL=Company.controller.js.map