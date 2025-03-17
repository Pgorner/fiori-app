/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff4200.olap.api"
],
function(oFF)
{
"use strict";

oFF.OlapLambdaCatalogManagerCreatedListener = function() {};
oFF.OlapLambdaCatalogManagerCreatedListener.prototype = new oFF.XObject();
oFF.OlapLambdaCatalogManagerCreatedListener.prototype._ff_c = "OlapLambdaCatalogManagerCreatedListener";

oFF.OlapLambdaCatalogManagerCreatedListener.create = function(consumer)
{
	let obj = new oFF.OlapLambdaCatalogManagerCreatedListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.OlapLambdaCatalogManagerCreatedListener.prototype.m_consumer = null;
oFF.OlapLambdaCatalogManagerCreatedListener.prototype.onOlapCatalogManagerCreated = function(extResult, olapCatalogManager, customIdentifier)
{
	this.m_consumer(extResult, olapCatalogManager);
};
oFF.OlapLambdaCatalogManagerCreatedListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.OlapLambdaCatalogResultListener = function() {};
oFF.OlapLambdaCatalogResultListener.prototype = new oFF.XObject();
oFF.OlapLambdaCatalogResultListener.prototype._ff_c = "OlapLambdaCatalogResultListener";

oFF.OlapLambdaCatalogResultListener.create = function(consumer)
{
	let obj = new oFF.OlapLambdaCatalogResultListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.OlapLambdaCatalogResultListener.prototype.m_consumer = null;
oFF.OlapLambdaCatalogResultListener.prototype.onOlapCatalogResult = function(extResult, result, customIdentifier)
{
	this.m_consumer(extResult, result);
};
oFF.OlapLambdaCatalogResultListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.OlapCatalogServiceConfig = function() {};
oFF.OlapCatalogServiceConfig.prototype = new oFF.DfServiceConfig();
oFF.OlapCatalogServiceConfig.prototype._ff_c = "OlapCatalogServiceConfig";

oFF.OlapCatalogServiceConfig.CLAZZ = null;
oFF.OlapCatalogServiceConfig.staticSetup = function()
{
	oFF.OlapCatalogServiceConfig.CLAZZ = oFF.XClass.create(oFF.OlapCatalogServiceConfig);
};
oFF.OlapCatalogServiceConfig.prototype.metaObjectType = null;
oFF.OlapCatalogServiceConfig.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onOlapCatalogManagerCreated(extResult, data, customIdentifier);
};
oFF.OlapCatalogServiceConfig.prototype.getMetaObjectType = function()
{
	return this.metaObjectType;
};
oFF.OlapCatalogServiceConfig.prototype.processCurrencyCatalogManagerCreation = function(syncType, listener, customIdentifier)
{
	this.metaObjectType = oFF.MetaObjectType.CURRENCY;
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.OlapCatalogServiceConfig.prototype.processCurrencyTranslationCatalogManagerCreation = function(syncType, listener, customIdentifier)
{
	this.metaObjectType = oFF.MetaObjectType.CURRENCY_TRANSLATION;
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.OlapCatalogServiceConfig.prototype.processFormulaOperatorsCatalogManagerCreation = function(syncType, listener, customIdentifier)
{
	this.metaObjectType = oFF.MetaObjectType.FORMULA_OPERATORS;
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.OlapCatalogServiceConfig.prototype.processLightweightOlapCatalogManagerCreation = function(syncType, listener, customIdentifier)
{
	this.metaObjectType = oFF.MetaObjectType.CATALOG_VIEW_2;
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.OlapCatalogServiceConfig.prototype.processOlapCatalogManagerCreation = function(syncType, listener, customIdentifier)
{
	this.metaObjectType = oFF.MetaObjectType.CATALOG_VIEW;
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.OlapCatalogServiceConfig.prototype.releaseObjectInternal = function()
{
	this.metaObjectType = null;
	oFF.DfServiceConfig.prototype.releaseObjectInternal.call( this );
};
oFF.OlapCatalogServiceConfig.prototype.setDataFromService = function(service)
{
	this.setData(service.getCatalogManager());
};

oFF.OlapCatalogApiModule = function() {};
oFF.OlapCatalogApiModule.prototype = new oFF.DfModule();
oFF.OlapCatalogApiModule.prototype._ff_c = "OlapCatalogApiModule";

oFF.OlapCatalogApiModule.SERVICE_TYPE_OLAP_CATALOG = null;
oFF.OlapCatalogApiModule.SERVICE_TYPE_PLANNING_CATALOG = null;
oFF.OlapCatalogApiModule.SERVICE_TYPE_PLANNING_MODEL_CATALOG = null;
oFF.OlapCatalogApiModule.XS_OLAP_CATALOG = "OLAP_CATALOG";
oFF.OlapCatalogApiModule.XS_PLANNING_CATALOG = "PLANNING_CATALOG";
oFF.OlapCatalogApiModule.XS_PLANNING_MODEL_CATALOG = "PLANNING_MODEL_CATALOG";
oFF.OlapCatalogApiModule.s_module = null;
oFF.OlapCatalogApiModule.getInstance = function()
{
	if (oFF.isNull(oFF.OlapCatalogApiModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.RuntimeModule.getInstance());
		oFF.OlapCatalogApiModule.s_module = oFF.DfModule.startExt(new oFF.OlapCatalogApiModule());
		oFF.OlapCatalogApiModule.SERVICE_TYPE_PLANNING_CATALOG = oFF.ServiceType.createType(oFF.OlapCatalogApiModule.XS_PLANNING_CATALOG);
		oFF.OlapCatalogApiModule.SERVICE_TYPE_PLANNING_MODEL_CATALOG = oFF.ServiceType.createType(oFF.OlapCatalogApiModule.XS_PLANNING_MODEL_CATALOG);
		oFF.OlapCatalogApiModule.SERVICE_TYPE_OLAP_CATALOG = oFF.ServiceType.createType(oFF.OlapCatalogApiModule.XS_OLAP_CATALOG);
		oFF.OlapCatalogServiceConfig.staticSetup();
		let registrationService = oFF.RegistrationService.getInstance();
		registrationService.addServiceConfig(oFF.OlapCatalogApiModule.XS_OLAP_CATALOG, oFF.OlapCatalogServiceConfig.CLAZZ);
		oFF.DfModule.stopExt(oFF.OlapCatalogApiModule.s_module);
	}
	return oFF.OlapCatalogApiModule.s_module;
};
oFF.OlapCatalogApiModule.prototype.getName = function()
{
	return "ff4220.olap.catalog.api";
};

oFF.OlapCatalogApiModule.getInstance();

return oFF;
} );