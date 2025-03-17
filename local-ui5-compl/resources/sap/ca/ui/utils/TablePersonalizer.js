/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.utils.TablePersonalizer");jQuery.sap.require("sap.ushell.services.Personalization");jQuery.sap.require("sap.m.TablePersoController");sap.ca.ui.utils.TablePersonalizer=function(e,a,r){try{var s=sap.ushell.Container.getService("Personalization").getPersonalizer(r);var l=new sap.m.TablePersoController({table:e,persoService:s});l.activate();a.attachPress(function(){l.openDialog()})}catch(e){jQuery.sap.log.error("TablePersonalizer : cannot load personalization service from ushell "+e.message)}};
//# sourceMappingURL=TablePersonalizer.js.map