/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.utils.resourcebundle");jQuery.sap.require("sap.ui.model.resource.ResourceModel");sap.ca.ui.utils.resourcebundle=function(){var e=new sap.ui.model.resource.ResourceModel({bundleUrl:jQuery.sap.getModulePath("sap.ca.ui.i18n.i18n",".properties")});sap.ui.getCore().setModel(e,"sap.ca.ui.i18n");return e.getResourceBundle()}();
//# sourceMappingURL=resourcebundle.js.map