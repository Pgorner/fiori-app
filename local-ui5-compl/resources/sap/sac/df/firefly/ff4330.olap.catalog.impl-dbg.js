/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff4310.olap.impl","sap/sac/df/firefly/ff4220.olap.catalog.api"
],
function(oFF)
{
"use strict";

oFF.OlapCatalogFileSystemDriver = function() {};
oFF.OlapCatalogFileSystemDriver.prototype = new oFF.XObject();
oFF.OlapCatalogFileSystemDriver.prototype._ff_c = "OlapCatalogFileSystemDriver";

oFF.OlapCatalogFileSystemDriver.QUERY = "Query";
oFF.OlapCatalogFileSystemDriver.getSearchAllText = function(textToBeSearched)
{
	return oFF.XStringUtils.concatenate3("*", textToBeSearched, "*");
};
oFF.OlapCatalogFileSystemDriver.prototype.m_catalogManager = null;
oFF.OlapCatalogFileSystemDriver.prototype.m_systemName = null;
oFF.OlapCatalogFileSystemDriver.prototype.createFsObjectsFolderDefinition = function()
{
	let allObjects;
	if (this.getSystemType().isTypeOf(oFF.SystemType.BW))
	{
		let packages = oFF.XList.create();
		packages.add(oFF.XHierarchyElement.createHierarchyElement(oFF.OlapComponentType.CATALOG_TYPE, oFF.OlapCatalogFileSystemDriver.QUERY, oFF.OlapCatalogFileSystemDriver.QUERY));
		allObjects = oFF.ExtResult.create(packages, null);
	}
	else
	{
		allObjects = this.m_catalogManager.getAllTypes();
	}
	return allObjects;
};
oFF.OlapCatalogFileSystemDriver.prototype.getAllChildObjects = function(listener, syncType, fileQueryConfig)
{
	if (oFF.notNull(fileQueryConfig))
	{
		this.setSearchText(fileQueryConfig);
		this.processCartesianFilter(fileQueryConfig);
	}
	let iOlapCatalogResultIExtResult = this.m_catalogManager.processGetResult(syncType, listener, null);
	return iOlapCatalogResultIExtResult;
};
oFF.OlapCatalogFileSystemDriver.prototype.getAllObjectTypes = function()
{
	let allTypes = null;
	if (this.getSystemType().isTypeOf(oFF.SystemType.BW))
	{
		let packages = oFF.XList.create();
		packages.add(oFF.XHierarchyElement.createHierarchyElement(oFF.OlapComponentType.CATALOG_TYPE, oFF.OlapCatalogFileSystemDriver.QUERY, oFF.OlapCatalogFileSystemDriver.QUERY));
		allTypes = oFF.ExtResult.create(packages, null);
	}
	else
	{
		allTypes = this.m_catalogManager.getAllTypes();
	}
	return allTypes;
};
oFF.OlapCatalogFileSystemDriver.prototype.getAllSchemas = function(fileQueryConfig)
{
	if (oFF.notNull(fileQueryConfig))
	{
		this.setSearchText(fileQueryConfig);
		this.processCartesianFilter(fileQueryConfig);
	}
	let allSchemas = this.m_catalogManager.getAllSchemas(null);
	return allSchemas;
};
oFF.OlapCatalogFileSystemDriver.prototype.getObjectByName = function(objectName, listener, syncType)
{
	this.m_catalogManager.setSearchFilter(objectName);
	this.m_catalogManager.setSearchOnName(true);
	let iOlapCatalogResultIExtResult = this.m_catalogManager.processGetResult(syncType, listener, null);
	return iOlapCatalogResultIExtResult;
};
oFF.OlapCatalogFileSystemDriver.prototype.getObjectsBySchema = function(schemaName, listener, syncType, fileQueryConfig)
{
	this.m_catalogManager.setM_schema(oFF.XString.toUpperCase(schemaName));
	return this.getAllChildObjects(listener, syncType, fileQueryConfig);
};
oFF.OlapCatalogFileSystemDriver.prototype.getObjectsByType = function(type, listener, syncType, fileQueryConfig)
{
	if (this.m_catalogManager.supportsCombinedSearch())
	{
		this.m_catalogManager.setSelectedType(type);
		this.m_catalogManager.addSelectedType(type);
	}
	else
	{
		this.m_catalogManager.setSelectedType(type);
	}
	return this.getAllChildObjects(listener, syncType, fileQueryConfig);
};
oFF.OlapCatalogFileSystemDriver.prototype.getSystemName = function()
{
	return this.m_systemName;
};
oFF.OlapCatalogFileSystemDriver.prototype.getSystemType = function()
{
	return this.m_catalogManager.getApplication().getConnectionPool().getConnection(this.getSystemName()).getSystemDescription().getSystemType();
};
oFF.OlapCatalogFileSystemDriver.prototype.getTuplesCountTotal = function()
{
	if (this.getSystemType().isTypeOf(oFF.SystemType.BW))
	{
		return -1;
	}
	return this.m_catalogManager.getQueryManager().getActiveResultSetContainer().getCursorResultSet().getCursorRowsAxis().getTuplesCountTotal();
};
oFF.OlapCatalogFileSystemDriver.prototype.isCatalogManagerInitialised = function()
{
	return oFF.notNull(this.m_catalogManager) ? true : false;
};
oFF.OlapCatalogFileSystemDriver.prototype.isDWCSystem = function()
{
	let idDwcSystem = false;
	if (this.m_catalogManager.getApplication().getConnectionPool().getConnection(this.getSystemName()).getSystemDescription().getProperties().containsKey("CONTEXT_PATH"))
	{
		if (oFF.XString.containsString(this.m_catalogManager.getApplication().getConnectionPool().getConnection(this.getSystemName()).getSystemDescription().getProperties().getByKey("CONTEXT_PATH"), "dwaas-core"))
		{
			idDwcSystem = true;
		}
	}
	return idDwcSystem;
};
oFF.OlapCatalogFileSystemDriver.prototype.processCartesianFilter = function(fileQueryConfig)
{
	let cartesianFilter = fileQueryConfig.getCartesianFilter();
	if (oFF.notNull(cartesianFilter))
	{
		for (let i = 0; i < cartesianFilter.size(); i++)
		{
			let ixFileFilterElement = cartesianFilter.get(i);
			let value = ixFileFilterElement.getValue();
			let name = ixFileFilterElement.getName();
			if (oFF.XString.isEqual(name, oFF.XFileAttribute.DESCRIPTION))
			{
				this.m_catalogManager.setSearchFilter(value);
				this.m_catalogManager.setSearchOnText(true);
			}
			else if (oFF.XString.isEqual(name, oFF.XFileAttribute.OLAP_DATASOURCE_NAME))
			{
				this.m_catalogManager.setSearchFilter(value);
				this.m_catalogManager.setSearchOnName(true);
			}
			else if (oFF.XString.isEqual(name, oFF.XFileAttribute.OLAP_DATASOURCE_SCHEMA))
			{
				this.m_catalogManager.setSearchOnSchema(true);
			}
			else if (oFF.XString.isEqual(name, oFF.XFileAttribute.NODE_SUB_TYPE))
			{
				let subTypes = oFF.XStringTokenizer.splitString(value, ",");
				this.m_catalogManager.setInternalTypeIncludeList(subTypes);
			}
			else if (oFF.XString.isEqual(name, oFF.XFileAttribute.NODE_TYPE) && this.m_catalogManager.supportsCombinedSearch())
			{
				let types = oFF.XStringTokenizer.splitString(value, ",");
				let iterator = types.getIterator();
				while (iterator.hasNext())
				{
					let type = iterator.next();
					let metaObjectType = oFF.MetaObjectType.lookup(type);
					this.m_catalogManager.addSelectedType(metaObjectType);
				}
			}
			else if (oFF.XString.isEqual(name, oFF.XFileAttribute.OLAP_DATA_CATEGORY))
			{
				if (this.m_catalogManager.getQueryManager().getQueryModel().getModelCapabilities().supportsMetadataDataCategory())
				{
					this.m_catalogManager.setDataCategoryFilter(value);
				}
			}
		}
	}
};
oFF.OlapCatalogFileSystemDriver.prototype.resetSearchFlags = function()
{
	if (oFF.notNull(this.m_catalogManager))
	{
		this.m_catalogManager.setSearchOnSchema(false);
		this.m_catalogManager.setInternalTypeIncludeList(oFF.XList.create());
		this.m_catalogManager.setSearchOnPackageExt(false, "", oFF.PresentationSelect.KEY_AND_TEXT, oFF.LogicalBoolOperator.OR, null);
		this.m_catalogManager.setM_schema(null);
	}
};
oFF.OlapCatalogFileSystemDriver.prototype.setCatalogManager = function(m_catalogManager)
{
	this.m_catalogManager = m_catalogManager;
};
oFF.OlapCatalogFileSystemDriver.prototype.setSearchText = function(fileQueryConfig)
{
	let offset = fileQueryConfig.getOffset();
	this.m_catalogManager.setResultOffset(offset);
	let maxItems = fileQueryConfig.getMaxItems();
	this.m_catalogManager.setResultMaxSize(maxItems);
	let searchValue = fileQueryConfig.getSearchValue();
	searchValue = oFF.notNull(searchValue) ? oFF.OlapCatalogFileSystemDriver.getSearchAllText(searchValue) : "*";
	this.m_catalogManager.setSearchFilter(searchValue);
	if (this.m_catalogManager.getM_schema() !== null)
	{
		this.setTextSearch(false, searchValue);
	}
	else
	{
		this.setTextSearch(true, searchValue);
	}
};
oFF.OlapCatalogFileSystemDriver.prototype.setSystemName = function(systemName)
{
	this.m_systemName = systemName;
};
oFF.OlapCatalogFileSystemDriver.prototype.setTextSearch = function(enableSearchOnName, searchValue)
{
	this.m_catalogManager.setSearchOnName(enableSearchOnName);
	if (this.m_catalogManager.supportsCombinedSearch())
	{
		this.m_catalogManager.setSearchOnText(enableSearchOnName);
		this.m_catalogManager.setSearchOnPackageExt(enableSearchOnName, searchValue, oFF.PresentationSelect.KEY_AND_TEXT, oFF.LogicalBoolOperator.OR, null);
	}
};
oFF.OlapCatalogFileSystemDriver.prototype.setupCatalogManager = function(process, systemName, syncType, listener)
{
	let application = oFF.ApplicationFactory.createApplication(process);
	let serviceConfig = oFF.OlapCatalogApiModule.SERVICE_TYPE_OLAP_CATALOG.createServiceConfig(application);
	serviceConfig.setSystemName(systemName);
	this.setSystemName(systemName);
	let iOlapCatalogManagerIExtResult;
	if (!oFF.XString.isEqual(systemName, oFF.SystemType.BPCE.getName()))
	{
		iOlapCatalogManagerIExtResult = serviceConfig.processLightweightOlapCatalogManagerCreation(syncType, listener, null);
	}
	else
	{
		iOlapCatalogManagerIExtResult = serviceConfig.processOlapCatalogManagerCreation(syncType, listener, null);
	}
	this.setCatalogManager(iOlapCatalogManagerIExtResult.getData());
};

oFF.OlapFileRequestListener2 = function() {};
oFF.OlapFileRequestListener2.prototype = new oFF.XObject();
oFF.OlapFileRequestListener2.prototype._ff_c = "OlapFileRequestListener2";

oFF.OlapFileRequestListener2.create = function(callback)
{
	let listener = new oFF.OlapFileRequestListener2();
	listener.callback = callback;
	return listener;
};
oFF.OlapFileRequestListener2.prototype.callback = null;
oFF.OlapFileRequestListener2.prototype.onChildrenFetched = function(extResult)
{
	this.callback(extResult);
};

oFF.OlapFileUtils = {

	HASH:"#",
	INFINITY:"\u221E",
	isBWSystem:function(process, host)
	{
			let connection = process.getConnectionPool().getConnection(host);
		let systemType = connection.getSystemDescription().getSystemType();
		return systemType.isTypeOf(oFF.SystemType.BW);
	},
	isValidModelName:function(objectName)
	{
			return !oFF.XString.containsString(objectName, oFF.OlapFileUtils.INFINITY);
	},
	isValidSchemaName:function(objectName)
	{
			return !oFF.XString.containsString(objectName, oFF.OlapFileUtils.HASH);
	},
	processCatalogResult:function(result, process, olapFs, file, isDWCSystem)
	{
			let childFiles = oFF.XList.create();
		let iterator = result.getObjectsIterator();
		while (iterator.hasNext())
		{
			let item = iterator.next();
			if (oFF.OlapFileUtils.isValidModelName(item.getName()))
			{
				let uri = oFF.XUri.createChildFile(file.getUri(), item.getName());
				let objectAttribute = oFF.XHashMapByString.create();
				objectAttribute.put(oFF.XFileAttribute.NODE_TYPE, item.getDataCategory());
				objectAttribute.put(oFF.XFileAttribute.NODE_SUB_TYPE, item.getInternalType());
				objectAttribute.put(oFF.XFileAttribute.OLAP_DATASOURCE_TYPE, item.getType().getName());
				objectAttribute.put(oFF.XFileAttribute.OLAP_DATASOURCE_SCHEMA, item.getSchemaName());
				objectAttribute.put(oFF.XFileAttribute.OLAP_DATASOURCE_NAME, item.getName());
				objectAttribute.put(oFF.XFileAttribute.OLAP_DATASOURCE_PACKAGE, item.getPackageName());
				objectAttribute.put(oFF.XFileAttribute.OLAP_DATA_CATEGORY, item.getDataCategory());
				let metadata = oFF.PrFactory.createStructure();
				metadata.putString(oFF.XFileAttribute.DESCRIPTION, item.getText());
				objectAttribute.put(oFF.XFileAttribute.DESCRIPTION, item.getText());
				metadata.putString(oFF.XFileAttribute.DISPLAY_NAME, item.getName());
				metadata.putString(oFF.XFileAttribute.FILE_TYPE, item.getType().getName());
				if (isDWCSystem)
				{
					if (oFF.XString.isEqual(item.getType().getName(), "view") && oFF.XString.isEqual(item.getInternalType(), "CALC"))
					{
						objectAttribute.put(oFF.XFileAttribute.ICON, olapFs.getIconByName("CUBE"));
					}
					else if (oFF.XString.isEqual(item.getType().getName(), "inamodel"))
					{
						objectAttribute.put(oFF.XFileAttribute.ICON, olapFs.getIconByName("DATASET"));
					}
					else if (item.isComponentNode())
					{
						objectAttribute.put(oFF.XFileAttribute.ICON, olapFs.getIconByName("SPACE"));
					}
				}
				if (oFF.OlapFileUtils.isBWSystem(process, uri.getHost()))
				{
					metadata.putBoolean(oFF.XFileAttribute.SUPPORTS_PARALLEL_SEARCH, false);
				}
				else
				{
					metadata.putBoolean(oFF.XFileAttribute.SUPPORTS_PARALLEL_SEARCH, true);
				}
				metadata.putBoolean(oFF.XFileAttribute.IS_EXISTING, true);
				if (item.isComponentNode())
				{
					metadata.putBoolean(oFF.XFileAttribute.IS_DIRECTORY, true);
					metadata.putBoolean(oFF.XFileAttribute.IS_FILE, false);
				}
				else
				{
					metadata.putBoolean(oFF.XFileAttribute.IS_DIRECTORY, false);
					metadata.putBoolean(oFF.XFileAttribute.IS_FILE, true);
				}
				metadata.putBoolean(oFF.XFileAttribute.IS_HIDDEN, false);
				metadata.putBoolean(oFF.XFileAttribute.IS_EXECUTABLE, true);
				metadata.putBoolean(oFF.XFileAttribute.IS_READABLE, true);
				metadata.putBoolean(oFF.XFileAttribute.IS_WRITEABLE, false);
				metadata.putBoolean(oFF.XFileAttribute.SUPPORTS_SEARCH, true);
				if (item.getCreatedBy() !== null)
				{
					metadata.putString(oFF.XFileAttribute.CREATED_BY_DISPLAY_NAME, item.getCreatedBy());
				}
				if (item.getCreatedOn() !== null)
				{
					metadata.putString(oFF.XFileAttribute.CREATED_AT, item.getCreatedOn().toIso8601Format());
				}
				if (item.getUpdatedBy() !== null)
				{
					metadata.putString(oFF.XFileAttribute.CHANGED_BY_DISPLAY_NAME, item.getCreatedBy());
				}
				if (item.getUpdatedOn() !== null)
				{
					metadata.putString(oFF.XFileAttribute.CHANGED_AT, item.getCreatedOn().toIso8601Format());
				}
				if (item.isComponentNode())
				{
					metadata.putBoolean(oFF.XFileAttribute.SUPPORTS_MAX_ITEMS, true);
					metadata.putBoolean(oFF.XFileAttribute.SUPPORTS_OFFSET, true);
					metadata.putBoolean(oFF.XFileAttribute.SUPPORTS_SINGLE_SORT, false);
					metadata.putBoolean(oFF.XFileAttribute.SUPPORTS_CARTESIAN_FILTER, true);
					let filterStructure = metadata.putNewStructure(oFF.XFileAttribute.SUPPORTED_FILTERS);
					let dataSourcePackageFilterTypes = filterStructure.putNewStructure(oFF.XFileAttribute.OLAP_DATASOURCE_PACKAGE).putNewList(oFF.XFileAttribute.SUPPORTED_FILTER_TYPES);
					dataSourcePackageFilterTypes.addString(oFF.XFileFilterType.EXACT.getName());
					dataSourcePackageFilterTypes.addString(oFF.XFileFilterType.ASTERISK.getName());
					let dataSourceSchemaFilterTypes = filterStructure.putNewStructure(oFF.XFileAttribute.OLAP_DATASOURCE_SCHEMA).putNewList(oFF.XFileAttribute.SUPPORTED_FILTER_TYPES);
					dataSourceSchemaFilterTypes.addString(oFF.XFileFilterType.EXACT.getName());
					dataSourceSchemaFilterTypes.addString(oFF.XFileFilterType.ASTERISK.getName());
					let nodeSubTypeFilterTypes = filterStructure.putNewStructure(oFF.XFileAttribute.NODE_SUB_TYPE).putNewList(oFF.XFileAttribute.SUPPORTED_FILTER_TYPES);
					nodeSubTypeFilterTypes.addString(oFF.XFileFilterType.EXACT.getName());
					nodeSubTypeFilterTypes.addString(oFF.XFileFilterType.ASTERISK.getName());
					let nodeTypeFilterTypes = filterStructure.putNewStructure(oFF.XFileAttribute.NODE_TYPE).putNewList(oFF.XFileAttribute.SUPPORTED_FILTER_TYPES);
					nodeTypeFilterTypes.addString(oFF.XFileFilterType.EXACT.getName());
					nodeTypeFilterTypes.addString(oFF.XFileFilterType.ASTERISK.getName());
					let olapDataCategoryFilterTypes = filterStructure.putNewStructure(oFF.XFileAttribute.OLAP_DATA_CATEGORY).putNewList(oFF.XFileAttribute.SUPPORTED_FILTER_TYPES);
					olapDataCategoryFilterTypes.addString(oFF.XFileFilterType.EXACT.getName());
					olapDataCategoryFilterTypes.addString(oFF.XFileFilterType.ASTERISK.getName());
				}
				let olapFile = oFF.OlapFile.createFile(process, olapFs, uri, objectAttribute);
				olapFile.setProviderMetadata(metadata);
				childFiles.add(olapFile);
			}
		}
		return childFiles;
	}
};

oFF.OlapCatalogResult = function() {};
oFF.OlapCatalogResult.prototype = new oFF.XObject();
oFF.OlapCatalogResult.prototype._ff_c = "OlapCatalogResult";

oFF.OlapCatalogResult.create = function(resultSet, interestedCurrency)
{
	let object = new oFF.OlapCatalogResult();
	object.setupExt(resultSet, interestedCurrency);
	return object;
};
oFF.OlapCatalogResult.prototype.m_items = null;
oFF.OlapCatalogResult.prototype.getFirstKeyField = function(queryModel, dmensionName)
{
	let dimension = queryModel.getDimensionByName(dmensionName);
	if (oFF.notNull(dimension))
	{
		return dimension.getFirstFieldByType(oFF.PresentationType.KEY);
	}
	return null;
};
oFF.OlapCatalogResult.prototype.getObjectsIterator = function()
{
	return this.m_items.getIterator();
};
oFF.OlapCatalogResult.prototype.getObjectsList = function()
{
	return this.m_items;
};
oFF.OlapCatalogResult.prototype.releaseObject = function()
{
	this.m_items = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_items);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OlapCatalogResult.prototype.setupExt = function(resultSet, interestedCurrency)
{
	this.m_items = oFF.XList.create();
	let queryModel = resultSet.getQueryModel();
	let typeField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_TYPE);
	let schemaNameField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_SCHEMA);
	let baseDataSourceTypeField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_BASEDATASOURCE_TYPE);
	let baseDataSourceKeyField = null;
	let baseDataSourceTextField = null;
	let baseDataSource = queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_BASEDATASOURCE);
	if (oFF.notNull(baseDataSource))
	{
		baseDataSourceKeyField = baseDataSource.getFirstFieldByType(oFF.PresentationType.KEY);
		baseDataSourceTextField = baseDataSource.getFirstFieldByType(oFF.PresentationType.TEXT);
	}
	let dataCategoryField = null;
	let capabilities = queryModel.getModelCapabilities();
	if (capabilities.supportsMetadataDataCategory())
	{
		dataCategoryField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_DATA_CATEGORY);
	}
	let queryAliasField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_QUERY_ALIAS);
	let baseDataSourceSchemaNameField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_BASEDATASOURCE_SCHEMANAME);
	let baseDataSourcePackageNameField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_BASEDATASOURCE_PACKAGENAME);
	let baseDataSourceObjectNameField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_BASEDATASOURCE_OBJECTNAME);
	let planningModelNameField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_PLANNING_MODEL_NAME);
	let planningModelSchemaNameField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_PLANNING_MODEL_SCHEMA_NAME);
	let internalTypeField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_INTERNAL_TYPE);
	let packageNameField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_PACKAGE);
	let dimCnObject = queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_OBJECT);
	let objectIsPlanQueryField = null;
	let objectHasMdxFlag = null;
	let objectNameField = null;
	let objectTextField = null;
	if (oFF.notNull(dimCnObject))
	{
		objectIsPlanQueryField = dimCnObject.getFieldByName(oFF.OlapCatalogManager2.CN_OBJECT_IS_PLANQUERY);
		objectHasMdxFlag = dimCnObject.getFieldByName(oFF.OlapCatalogManager2.CN_OBJECT_MDX_FLAG);
		objectNameField = dimCnObject.getFirstFieldByType(oFF.PresentationType.KEY);
		objectTextField = dimCnObject.getFirstFieldByType(oFF.PresentationType.TEXT);
	}
	let dimCurrency = queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_CURRENCY);
	let currencyKeyField = null;
	let currencyTextField = null;
	if (oFF.notNull(dimCurrency))
	{
		currencyKeyField = dimCurrency.getFirstFieldByType(oFF.PresentationType.KEY);
		currencyTextField = dimCurrency.getFirstFieldByType(oFF.PresentationType.TEXT);
	}
	let dimCurrencyTranslationName = queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_CURRENCY_TRANSLATION_NAME);
	let currencyTranslationNameKeyField = null;
	let currencyTranslationNameTextField = null;
	if (oFF.notNull(dimCurrencyTranslationName))
	{
		currencyTranslationNameKeyField = dimCurrencyTranslationName.getFirstFieldByType(oFF.PresentationType.KEY);
		currencyTranslationNameTextField = dimCurrencyTranslationName.getFirstFieldByType(oFF.PresentationType.TEXT);
	}
	let dimCurrencyTarget = queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_CURRENCY_TARGET);
	let currencyTargetKeyField = null;
	if (oFF.notNull(dimCurrencyTarget))
	{
		currencyTargetKeyField = dimCurrencyTarget.getFirstFieldByType(oFF.PresentationType.KEY);
	}
	let formulaOperators = queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_FORMULA_OPERATORS);
	let formulaOperatorsKeyField = null;
	let formulaOperatorsTextField = null;
	let formulaOperatorsNumOfOperands = null;
	if (oFF.notNull(formulaOperators))
	{
		formulaOperatorsKeyField = formulaOperators.getFirstFieldByType(oFF.PresentationType.KEY);
		formulaOperatorsTextField = formulaOperators.getFirstFieldByType(oFF.PresentationType.TEXT);
		formulaOperatorsNumOfOperands = formulaOperators.getFieldByName(oFF.OlapCatalogManager2.CN_FORMULA_OPERATORS_OPERANDS_NUMBER);
	}
	let rowsAxis = resultSet.getRowsAxis();
	let tuplesCount = rowsAxis.getTuplesCount();
	for (let i = 0; i < tuplesCount; i++)
	{
		let tuple = rowsAxis.getTupleAt(i);
		let item = oFF.OlapCatalogItem.createCatalogItem();
		if (oFF.notNull(dataCategoryField))
		{
			item.setDataCategory(tuple.getStringByField(dataCategoryField));
		}
		if (oFF.notNull(queryAliasField))
		{
			item.setQueryAlias(tuple.getStringByField(queryAliasField));
		}
		if (oFF.notNull(internalTypeField))
		{
			item.setInternalType(tuple.getStringByField(internalTypeField));
		}
		if (oFF.notNull(typeField))
		{
			let typeName = tuple.getStringByField(typeField);
			item.setType(oFF.MetaObjectType.lookupAndCreate(typeName));
		}
		if (oFF.notNull(schemaNameField))
		{
			item.setSchemaName(tuple.getStringByField(schemaNameField));
		}
		if (oFF.notNull(packageNameField))
		{
			item.setPackageName(tuple.getStringByField(packageNameField));
		}
		if (oFF.notNull(objectNameField))
		{
			item.setObjectName(tuple.getStringByField(objectNameField));
		}
		if (oFF.notNull(objectTextField))
		{
			item.setText(tuple.getStringByField(objectTextField));
		}
		if (oFF.isNull(objectIsPlanQueryField))
		{
			item.setPlanQuery(false);
		}
		else
		{
			item.setPlanQuery(tuple.getBooleanByField(objectIsPlanQueryField));
		}
		if (oFF.notNull(objectHasMdxFlag))
		{
			let hasMdx = tuple.getTristateByField(objectHasMdxFlag);
			item.setHasMdxFlag(hasMdx);
		}
		let baseDataSourceIdentifier = oFF.QFactory.createDataSource();
		if (oFF.notNull(baseDataSourceTypeField))
		{
			baseDataSourceIdentifier.setType(oFF.MetaObjectType.lookup(tuple.getStringByField(baseDataSourceTypeField)));
		}
		if (oFF.notNull(baseDataSourceTextField))
		{
			baseDataSourceIdentifier.setText(tuple.getStringByField(baseDataSourceTextField));
		}
		if (oFF.notNull(baseDataSourceKeyField))
		{
			baseDataSourceIdentifier.setName(tuple.getStringByField(baseDataSourceKeyField));
		}
		if (oFF.notNull(baseDataSourceSchemaNameField))
		{
			baseDataSourceIdentifier.setSchemaName(tuple.getStringByField(baseDataSourceSchemaNameField));
		}
		if (oFF.notNull(baseDataSourcePackageNameField))
		{
			baseDataSourceIdentifier.setPackageName(tuple.getStringByField(baseDataSourcePackageNameField));
		}
		if (oFF.notNull(baseDataSourceObjectNameField) && oFF.XString.size(tuple.getStringByField(baseDataSourceObjectNameField)) > 0)
		{
			baseDataSourceIdentifier.setName(tuple.getStringByField(baseDataSourceObjectNameField));
		}
		item.setBaseDataSource(baseDataSourceIdentifier);
		if (oFF.notNull(planningModelNameField))
		{
			item.setPlanningModelName(tuple.getStringByField(planningModelNameField));
		}
		if (oFF.notNull(planningModelSchemaNameField))
		{
			item.setPlanningModelSchemaName(tuple.getStringByField(planningModelSchemaNameField));
		}
		if (oFF.notNull(currencyKeyField))
		{
			item.setCurrencyKey(tuple.getStringByField(currencyKeyField));
		}
		if (oFF.notNull(currencyTextField))
		{
			item.setCurrencyText(tuple.getStringByField(currencyTextField));
		}
		if (oFF.notNull(currencyTranslationNameKeyField))
		{
			item.setCurrencyTranslationNameKey(tuple.getStringByField(currencyTranslationNameKeyField));
		}
		if (oFF.notNull(currencyTranslationNameTextField))
		{
			item.setCurrencyTranslationNameText(tuple.getStringByField(currencyTranslationNameTextField));
		}
		if (oFF.notNull(currencyTargetKeyField))
		{
			item.setCurrencyTargetKey(tuple.getStringByField(currencyTargetKeyField));
		}
		if (oFF.notNull(formulaOperatorsKeyField))
		{
			item.setFormulaOperatorKey(tuple.getStringByField(formulaOperatorsKeyField));
		}
		if (oFF.notNull(formulaOperatorsTextField))
		{
			item.setFormulaOperatorText(tuple.getStringByField(formulaOperatorsTextField));
		}
		if (oFF.notNull(formulaOperatorsNumOfOperands))
		{
			item.setFormulaOperatorNumberOfOperands(tuple.getIntegerByField(formulaOperatorsNumOfOperands));
		}
		let shouldBeAdded = true;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(interestedCurrency))
		{
			let tupleCurrency = tuple.getStringByField(currencyTargetKeyField);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(tupleCurrency) && !oFF.XString.isEqual(tupleCurrency, interestedCurrency))
			{
				shouldBeAdded = false;
			}
		}
		if (shouldBeAdded)
		{
			this.m_items.add(item);
		}
	}
};
oFF.OlapCatalogResult.prototype.toString = function()
{
	let sb = oFF.XStringBuffer.create();
	if (oFF.notNull(this.m_items))
	{
		for (let i = 0; i < this.m_items.size(); i++)
		{
			let item = this.m_items.get(i);
			if (oFF.notNull(item))
			{
				sb.append(item.toString());
			}
			sb.appendNewLine();
		}
	}
	return sb.toString();
};

oFF.PlanningCatalogItem = function() {};
oFF.PlanningCatalogItem.prototype = new oFF.XObject();
oFF.PlanningCatalogItem.prototype._ff_c = "PlanningCatalogItem";

oFF.PlanningCatalogItem.createCatalogItem = function()
{
	return new oFF.PlanningCatalogItem();
};
oFF.PlanningCatalogItem.prototype.m_objectNameKey = null;
oFF.PlanningCatalogItem.prototype.m_objectNameLongText = null;
oFF.PlanningCatalogItem.prototype.m_planningOperationType = null;
oFF.PlanningCatalogItem.prototype.getDataSource = function()
{
	let planningOperationType = this.getType();
	if (planningOperationType === oFF.PlanningOperationType.PLANNING_FUNCTION)
	{
		return oFF.QFactory.createDataSourceWithType(oFF.MetaObjectType.PLANNING_FUNCTION, this.getObjectNameKey());
	}
	else if (planningOperationType === oFF.PlanningOperationType.PLANNING_SEQUENCE)
	{
		return oFF.QFactory.createDataSourceWithType(oFF.MetaObjectType.PLANNING_SEQUENCE, this.getObjectNameKey());
	}
	else
	{
		return null;
	}
};
oFF.PlanningCatalogItem.prototype.getObjectNameKey = function()
{
	return this.m_objectNameKey;
};
oFF.PlanningCatalogItem.prototype.getObjectNameLongText = function()
{
	return this.m_objectNameLongText;
};
oFF.PlanningCatalogItem.prototype.getType = function()
{
	return this.m_planningOperationType;
};
oFF.PlanningCatalogItem.prototype.releaseObject = function()
{
	this.m_objectNameKey = null;
	this.m_objectNameLongText = null;
	this.m_planningOperationType = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.PlanningCatalogItem.prototype.setObjectNameKey = function(objectNameKey)
{
	this.m_objectNameKey = objectNameKey;
};
oFF.PlanningCatalogItem.prototype.setObjectNameLongText = function(objectNameLongText)
{
	this.m_objectNameLongText = objectNameLongText;
};
oFF.PlanningCatalogItem.prototype.setType = function(planningOperationType)
{
	this.m_planningOperationType = planningOperationType;
};
oFF.PlanningCatalogItem.prototype.toString = function()
{
	let sb = oFF.XStringBuffer.create();
	if (oFF.notNull(this.m_planningOperationType))
	{
		sb.append(this.m_planningOperationType.toString());
	}
	sb.append(": ").append(this.m_objectNameKey);
	if (!oFF.XString.isEqual(this.m_objectNameKey, this.m_objectNameLongText))
	{
		sb.append(" description: ").append(this.m_objectNameLongText);
	}
	return sb.toString();
};

oFF.PlanningCatalogResult = function() {};
oFF.PlanningCatalogResult.prototype = new oFF.XObject();
oFF.PlanningCatalogResult.prototype._ff_c = "PlanningCatalogResult";

oFF.PlanningCatalogResult.create = function(resultSet, catalogOptions)
{
	let object = new oFF.PlanningCatalogResult();
	object.setupExt(resultSet, catalogOptions);
	return object;
};
oFF.PlanningCatalogResult.prototype.m_items = null;
oFF.PlanningCatalogResult.prototype.getObjectsIterator = function()
{
	return this.m_items.getIterator();
};
oFF.PlanningCatalogResult.prototype.releaseObject = function()
{
	this.m_items = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_items);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.PlanningCatalogResult.prototype.setupExt = function(resultSet, catalogOptions)
{
	this.m_items = oFF.XList.create();
	let queryModel = resultSet.getQueryModel();
	let objectNameKeyField = queryModel.getDimensionByName(oFF.PlanningCatalogManager.CN_OBJECT_NAME).getFirstFieldByType(oFF.PresentationType.KEY);
	let objectNameKeyLongTextField = queryModel.getDimensionByName(oFF.PlanningCatalogManager.CN_OBJECT_NAME).getFirstFieldByType(oFF.PresentationType.TEXT);
	let planningTypeKeyField = queryModel.getDimensionByName(oFF.PlanningCatalogManager.CN_PLANNING_TYPE).getFirstFieldByType(oFF.PresentationType.KEY);
	let rowsAxis = resultSet.getRowsAxis();
	let tuplesCount = rowsAxis.getTuplesCount();
	for (let i = 0; i < tuplesCount; i++)
	{
		let tuple = rowsAxis.getTupleAt(i);
		let objectNameKey = tuple.getStringByField(objectNameKeyField);
		let objectNameLongText = tuple.getStringByField(objectNameKeyLongTextField);
		let planningTypeKey = tuple.getStringByField(planningTypeKeyField);
		let planningOperationType = oFF.PlanningOperationType.lookup(planningTypeKey);
		oFF.XObjectExt.assertNotNullExt(planningOperationType, "illegal planning type");
		if (planningOperationType === oFF.PlanningOperationType.PLANNING_FUNCTION)
		{
			oFF.XBooleanUtils.checkTrue(catalogOptions.isSearchOnPlanningFunctions(), "illegal planning type");
		}
		if (planningOperationType === oFF.PlanningOperationType.PLANNING_SEQUENCE)
		{
			oFF.XBooleanUtils.checkTrue(catalogOptions.isSearchOnPlanningSequences(), "illegal planning type");
		}
		let item = oFF.PlanningCatalogItem.createCatalogItem();
		item.setType(planningOperationType);
		item.setObjectNameKey(objectNameKey);
		item.setObjectNameLongText(objectNameLongText);
		this.m_items.add(item);
	}
};
oFF.PlanningCatalogResult.prototype.toString = function()
{
	let sb = oFF.XStringBuffer.create();
	if (oFF.notNull(this.m_items))
	{
		for (let i = 0; i < this.m_items.size(); i++)
		{
			let item = this.m_items.get(i);
			if (oFF.notNull(item))
			{
				sb.append(item.toString());
			}
			sb.appendNewLine();
		}
	}
	return sb.toString();
};

oFF.PlanningModelCatalogItem = function() {};
oFF.PlanningModelCatalogItem.prototype = new oFF.XObject();
oFF.PlanningModelCatalogItem.prototype._ff_c = "PlanningModelCatalogItem";

oFF.PlanningModelCatalogItem.createCatalogItem = function()
{
	return new oFF.PlanningModelCatalogItem();
};
oFF.PlanningModelCatalogItem.prototype.m_modelName = null;
oFF.PlanningModelCatalogItem.prototype.m_schemaName = null;
oFF.PlanningModelCatalogItem.prototype.getDataSource = function()
{
	let dataSource = oFF.QFactory.createDataSourceWithType(oFF.MetaObjectType.PLANNING_MODEL, this.getModelName());
	let schemaName = this.getSchemaName();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(schemaName))
	{
		dataSource.setSchemaName(schemaName);
	}
	return dataSource;
};
oFF.PlanningModelCatalogItem.prototype.getModelName = function()
{
	return this.m_modelName;
};
oFF.PlanningModelCatalogItem.prototype.getSchemaName = function()
{
	return this.m_schemaName;
};
oFF.PlanningModelCatalogItem.prototype.releaseObject = function()
{
	this.m_schemaName = null;
	this.m_modelName = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.PlanningModelCatalogItem.prototype.setModelName = function(modelName)
{
	this.m_modelName = modelName;
};
oFF.PlanningModelCatalogItem.prototype.setSchemaName = function(schemaName)
{
	this.m_schemaName = schemaName;
};
oFF.PlanningModelCatalogItem.prototype.toString = function()
{
	return oFF.XStringUtils.concatenate3(this.m_schemaName, " - ", this.m_modelName);
};

oFF.PlanningModelCatalogResult = function() {};
oFF.PlanningModelCatalogResult.prototype = new oFF.XObject();
oFF.PlanningModelCatalogResult.prototype._ff_c = "PlanningModelCatalogResult";

oFF.PlanningModelCatalogResult.prototype.m_customIdentifier = null;
oFF.PlanningModelCatalogResult.prototype.m_items = null;
oFF.PlanningModelCatalogResult.prototype.m_resultListener = null;
oFF.PlanningModelCatalogResult.prototype.getCustomIdentifier = function()
{
	return this.m_customIdentifier;
};
oFF.PlanningModelCatalogResult.prototype.getObjectsIterator = function()
{
	return this.m_items.getIterator();
};
oFF.PlanningModelCatalogResult.prototype.getResponsesReturnCodeStrict = function(responseStructure, messageManager)
{
	if (oFF.isNull(responseStructure) || oFF.isNull(messageManager))
	{
		return -1;
	}
	let returnCode = 0;
	let hasPlanningStructure = false;
	let planningStructure = oFF.PrUtils.getStructureProperty(responseStructure, "Planning");
	if (oFF.isNull(planningStructure))
	{
		let planningList = oFF.PrUtils.getListProperty(responseStructure, "Planning");
		if (oFF.notNull(planningList))
		{
			hasPlanningStructure = true;
			for (let i = 0; i < planningList.size(); i++)
			{
				planningStructure = oFF.PrUtils.getStructureElement(planningList, i);
				if (oFF.notNull(planningStructure))
				{
					let planningReturnCode = this.isValidPlanningStructure(planningStructure, messageManager);
					if (planningReturnCode !== 0)
					{
						returnCode = planningReturnCode;
						break;
					}
				}
			}
		}
	}
	else
	{
		hasPlanningStructure = true;
		return this.isValidPlanningStructure(planningStructure, messageManager);
	}
	if (!hasPlanningStructure)
	{
		messageManager.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.PARSER_ERROR, "Planning structure is missing", responseStructure);
		return 0;
	}
	return returnCode;
};
oFF.PlanningModelCatalogResult.prototype.getResultListener = function()
{
	return this.m_resultListener;
};
oFF.PlanningModelCatalogResult.prototype.isValidPlanningStructure = function(planningStructure, messageManager)
{
	let returnCode = oFF.PrUtils.getIntegerValueProperty(planningStructure, "return_code", 0);
	if (oFF.isNull(planningStructure))
	{
		messageManager.addError(oFF.ErrorCodes.PARSER_ERROR, "Planning structure is missing");
		return returnCode;
	}
	let exceptionText = oFF.PrUtils.getStringValueProperty(planningStructure, "exception_text", null);
	if (oFF.notNull(exceptionText))
	{
		messageManager.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.OTHER_ERROR, exceptionText, planningStructure);
		return returnCode;
	}
	let message = oFF.PrUtils.getStringValueProperty(planningStructure, "message", null);
	if (oFF.notNull(message))
	{
		messageManager.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.OTHER_ERROR, message, planningStructure);
		return returnCode;
	}
	if (returnCode !== 0)
	{
		let sb = oFF.XStringBuffer.create();
		sb.append("Error: return code ").appendInt(returnCode);
		messageManager.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.INVALID_STATE, sb.toString(), planningStructure);
	}
	return returnCode;
};
oFF.PlanningModelCatalogResult.prototype.processResponseStructure = function(responseStructure, messageManager)
{
	let returnCode = this.getResponsesReturnCodeStrict(responseStructure, messageManager);
	if (returnCode !== 0)
	{
		return;
	}
	let planning = oFF.PrUtils.getStructureProperty(responseStructure, "Planning");
	let models = oFF.PrUtils.getListProperty(planning, "models");
	if (oFF.isNull(models))
	{
		messageManager.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.PARSER_ERROR, "error in processing response structure", responseStructure);
		return;
	}
	let items = oFF.XList.create();
	for (let i = 0; i < models.size(); i++)
	{
		let model = oFF.PrUtils.getStructureElement(models, i);
		if (oFF.isNull(model))
		{
			messageManager.addErrorExt(oFF.OriginLayer.DRIVER, 0, "error in processing response structure", responseStructure);
			return;
		}
		let schema = oFF.PrUtils.getStringProperty(model, "schema");
		if (oFF.isNull(schema))
		{
			messageManager.addErrorExt(oFF.OriginLayer.DRIVER, 0, "error in processing response structure", responseStructure);
			return;
		}
		let modelNames = oFF.PrUtils.getListProperty(model, "models");
		if (oFF.isNull(modelNames))
		{
			messageManager.addErrorExt(oFF.OriginLayer.DRIVER, 0, "error in processing response structure", responseStructure);
			return;
		}
		for (let j = 0; j < modelNames.size(); j++)
		{
			let modelName = oFF.PrUtils.getStringElement(modelNames, j);
			if (oFF.isNull(modelName))
			{
				messageManager.addErrorExt(oFF.OriginLayer.DRIVER, 0, "error in processing response structure", responseStructure);
				return;
			}
			let item = oFF.PlanningModelCatalogItem.createCatalogItem();
			item.setSchemaName(schema.getString());
			item.setModelName(modelName.getString());
			items.add(item);
		}
	}
	this.m_items = items;
};
oFF.PlanningModelCatalogResult.prototype.releaseObject = function()
{
	this.m_resultListener = null;
	this.m_customIdentifier = null;
	this.m_items = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_items);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.PlanningModelCatalogResult.prototype.setCustomIdentifier = function(customIdentifier)
{
	this.m_customIdentifier = customIdentifier;
};
oFF.PlanningModelCatalogResult.prototype.setResultListener = function(resultListener)
{
	this.m_resultListener = resultListener;
};
oFF.PlanningModelCatalogResult.prototype.toString = function()
{
	let sb = oFF.XStringBuffer.create();
	if (oFF.notNull(this.m_items))
	{
		for (let i = 0; i < this.m_items.size(); i++)
		{
			let item = this.m_items.get(i);
			if (oFF.notNull(item))
			{
				sb.append(item.toString());
			}
			sb.appendNewLine();
		}
	}
	return sb.toString();
};

oFF.OlapFile = function() {};
oFF.OlapFile.prototype = new oFF.DfXFileProvider();
oFF.OlapFile.prototype._ff_c = "OlapFile";

oFF.OlapFile.createFile = function(process, fileSystem, uri, attributes)
{
	let file = new oFF.OlapFile();
	file.setupOlapFile(process, fileSystem, uri);
	file.setProviderIsExisting(true);
	let targetPath = uri.getPath();
	let isRootDirectory = oFF.XString.isEqual(fileSystem.getRootDirectoryUri().getPath(), uri.getPath());
	if (isRootDirectory || oFF.XString.endsWith(targetPath, "/"))
	{
		file.getProviderAttributes().putString(oFF.XFileAttribute.NODE_TYPE, "Folder");
		let systemType = attributes.getByKey(oFF.XFileAttribute.SYSTEM_TYPE);
		file.getProviderAttributes().putString(oFF.XFileAttribute.SYSTEM_TYPE, systemType);
	}
	else
	{
		if (oFF.notNull(attributes) && attributes.size() > 0)
		{
			let keysAsIteratorOfString = attributes.getKeysAsIterator();
			while (keysAsIteratorOfString.hasNext())
			{
				let key = keysAsIteratorOfString.next();
				file.getProviderAttributes().putString(key, attributes.getByKey(key));
			}
		}
	}
	return file;
};
oFF.OlapFile.prototype.getProviderMetadataAndAttributes = function()
{
	let combined = oFF.PrFactory.createStructure();
	let providerMetadata = this.getProviderMetadata();
	combined.putAll(providerMetadata);
	combined.putAll(this.getProviderAttributes());
	return combined;
};
oFF.OlapFile.prototype.processProviderFetchChildren = function(syncType, listener, customIdentifier, config)
{
	let sync = this.m_fs.processFetchChildren(this, syncType, listener, customIdentifier, config);
	return sync;
};
oFF.OlapFile.prototype.processProviderFetchMetadata = function(syncType, listener, customIdentifier, cachingType)
{
	return this.m_fs.processFetchMetadata(this, syncType, listener, customIdentifier);
};
oFF.OlapFile.prototype.processProviderIsExisting = function(syncType, listener, customIdentifier)
{
	return this.m_fs.processIsExisting(this, syncType, listener, customIdentifier);
};
oFF.OlapFile.prototype.setupOlapFile = function(process, fileSystem, uri)
{
	this.setupFile(process, fileSystem, uri);
};
oFF.OlapFile.prototype.supportsProviderFetchChildren = function()
{
	return true;
};
oFF.OlapFile.prototype.supportsProviderIsExisting = function()
{
	return true;
};
oFF.OlapFile.prototype.supportsProviderParallelRequests = function()
{
	let isBWSystem = oFF.OlapFileUtils.isBWSystem(this.getProcess(), this.getUri().getHost());
	if (isBWSystem)
	{
		return false;
	}
	return true;
};

oFF.OlapCatalogProgramSubSystem = function() {};
oFF.OlapCatalogProgramSubSystem.prototype = new oFF.DfSubSysFilesystem();
oFF.OlapCatalogProgramSubSystem.prototype._ff_c = "OlapCatalogProgramSubSystem";

oFF.OlapCatalogProgramSubSystem.DEFAULT_PROGRAM_NAME = "@SubSys.FileSystem.fsolapcatalog";
oFF.OlapCatalogProgramSubSystem.prototype.m_fs = null;
oFF.OlapCatalogProgramSubSystem.prototype.m_olapFileSystems = null;
oFF.OlapCatalogProgramSubSystem.prototype.getAllInitializedFileSystems = function()
{
	return this.m_olapFileSystems;
};
oFF.OlapCatalogProgramSubSystem.prototype.getFileSystem = function(protocolType)
{
	return this.m_fs;
};
oFF.OlapCatalogProgramSubSystem.prototype.getFileSystemByUri = function(uri)
{
	let host = uri.getHost();
	let olapFs;
	let cachedFs = this.m_olapFileSystems.getByKey(host);
	if (oFF.notNull(cachedFs))
	{
		olapFs = cachedFs;
	}
	else
	{
		if (oFF.notNull(host))
		{
			olapFs = oFF.OlapCatalogFileSystem.createByHost(this.getProcess(), host);
		}
		else
		{
			olapFs = oFF.OlapCatalogFileSystem.create(this.getProcess());
		}
		this.m_olapFileSystems.put(host, olapFs);
	}
	this.m_fs = olapFs;
	return this.m_fs;
};
oFF.OlapCatalogProgramSubSystem.prototype.getProgramName = function()
{
	return oFF.OlapCatalogProgramSubSystem.DEFAULT_PROGRAM_NAME;
};
oFF.OlapCatalogProgramSubSystem.prototype.getProtocolType = function()
{
	return oFF.ProtocolType.FS_OLAP_CATALOG;
};
oFF.OlapCatalogProgramSubSystem.prototype.newProgram = function()
{
	let prg = new oFF.OlapCatalogProgramSubSystem();
	prg.setup();
	return prg;
};
oFF.OlapCatalogProgramSubSystem.prototype.processFetchFileSystem = function(syncType, listener, customIdentifier, uri)
{
	return oFF.XFsOlapCatalogActionFetch.createAndRun(syncType, listener, customIdentifier, this, uri);
};
oFF.OlapCatalogProgramSubSystem.prototype.runProcess = function()
{
	this.m_olapFileSystems = oFF.XHashMapByString.create();
	let process = this.getProcess();
	this.m_fs = oFF.OlapCatalogFileSystem.create(process);
	this.activateSubSystem(null, oFF.SubSystemStatus.ACTIVE);
	return true;
};

oFF.OlapFileFetchAction = function() {};
oFF.OlapFileFetchAction.prototype = new oFF.SyncActionExt();
oFF.OlapFileFetchAction.prototype._ff_c = "OlapFileFetchAction";

oFF.OlapFileFetchAction.createAndRun = function(syncType, olapFile, fileSystem, listener, customIdentifier, metaDataOnly, config)
{
	let action = new oFF.OlapFileFetchAction();
	action.m_file = olapFile;
	action.m_ofs = fileSystem;
	action.m_metaDataOnly = metaDataOnly;
	action.m_FileQueryConfig = config;
	action.setData(olapFile);
	action.setupActionAndRun(syncType, listener, customIdentifier, fileSystem);
	return action;
};
oFF.OlapFileFetchAction.prototype.m_FileQueryConfig = null;
oFF.OlapFileFetchAction.prototype.m_file = null;
oFF.OlapFileFetchAction.prototype.m_metaDataOnly = false;
oFF.OlapFileFetchAction.prototype.m_ofs = null;
oFF.OlapFileFetchAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onChildrenFetched(extResult);
};
oFF.OlapFileFetchAction.prototype.getAndSetObjects = function(result)
{
	let olapDriver = this.getOlapCatalogFileSystemDriverByHost();
	let childFiles = oFF.OlapFileUtils.processCatalogResult(result, this.getProcess(), this.m_ofs, this.m_file, olapDriver.isDWCSystem());
	let targets = oFF.XList.create();
	if (oFF.notNull(childFiles))
	{
		for (let i = 0; i < childFiles.size(); i++)
		{
			targets.add(childFiles.get(i));
		}
	}
	this.m_file.setProviderChildFiles(targets, olapDriver.getTuplesCountTotal());
};
oFF.OlapFileFetchAction.prototype.getAndSetObjectsFolders = function(olapDriver)
{
	let children = oFF.XList.create();
	let olapAttr = oFF.XHashMapByString.create();
	olapAttr.put(oFF.XFileAttribute.NODE_TYPE, oFF.OlapCatalogFileSystem.FOLDER);
	let systemType = olapDriver.getSystemType().getName();
	olapAttr.put(oFF.XFileAttribute.SYSTEM_TYPE, systemType);
	let schemaChildFolderUri = oFF.XUri.createChildDir(this.m_file.getUri(), "Schema");
	let schemaFolder = oFF.OlapFile.createFile(this.getProcess(), this.m_ofs, schemaChildFolderUri, olapAttr);
	let schemaFolderMetadata = this.getFolderMetaData("Schema", false);
	schemaFolder.setProviderMetadata(schemaFolderMetadata);
	children.add(schemaFolder);
	let typesChildFolderUri = oFF.XUri.createChildDir(this.m_file.getUri(), "Type");
	let typesFolder = oFF.OlapFile.createFile(this.getProcess(), this.m_ofs, typesChildFolderUri, olapAttr);
	let typeFolderMetadata = this.getFolderMetaData("Type", false);
	typesFolder.setProviderMetadata(typeFolderMetadata);
	children.add(typesFolder);
	this.m_file.setProviderChildFiles(children, 2);
};
oFF.OlapFileFetchAction.prototype.getFolderMetaData = function(displayName, enableSearch)
{
	let typeFolderMetadata = oFF.PrFactory.createStructure();
	typeFolderMetadata.putBoolean(oFF.XFileAttribute.IS_DIRECTORY, true);
	typeFolderMetadata.putString(oFF.XFileAttribute.DISPLAY_NAME, displayName);
	typeFolderMetadata.putBoolean(oFF.XFileAttribute.IS_HIDDEN, false);
	typeFolderMetadata.putBoolean(oFF.XFileAttribute.IS_EXECUTABLE, false);
	typeFolderMetadata.putBoolean(oFF.XFileAttribute.SUPPORTS_SEARCH, enableSearch);
	typeFolderMetadata.putBoolean(oFF.XFileAttribute.SUPPORTS_MAX_ITEMS, true);
	typeFolderMetadata.putBoolean(oFF.XFileAttribute.SUPPORTS_OFFSET, true);
	typeFolderMetadata.putBoolean(oFF.XFileAttribute.SUPPORTS_SINGLE_SORT, false);
	typeFolderMetadata.putBoolean(oFF.XFileAttribute.SUPPORTS_CARTESIAN_FILTER, true);
	return typeFolderMetadata;
};
oFF.OlapFileFetchAction.prototype.getOlapCatalogFileSystemDriverByHost = function()
{
	let host = this.m_file.getUri().getHost();
	let olapDriver = this.m_ofs.getOlapDrivers().getByKey(host);
	return olapDriver;
};
oFF.OlapFileFetchAction.prototype.onOlapCatalogManagerCreated = function(extResult, olapCatalogManager, customIdentifier)
{
	this.addAllMessages(extResult);
	let targetUriPath = this.m_file.getUri().getPath();
	let host = this.m_file.getUri().getHost();
	let olapDriver = this.m_ofs.getOlapDrivers().getByKey(host);
	if (oFF.notNull(extResult) && !extResult.hasErrors())
	{
		try
		{
			olapDriver.setCatalogManager(extResult.getData());
			if (oFF.XString.isEqual(targetUriPath, oFF.XFile.SLASH))
			{
				this.getAndSetObjectsFolders(olapDriver);
				this.endSync();
			}
			else if (this.m_metaDataOnly)
			{
				let fileName = this.m_file.getName();
				if (oFF.XString.isEqual(fileName, "Schema") || oFF.XString.isEqual(fileName, "Type"))
				{
					let metadata = this.getFolderMetaData(fileName, false);
					this.m_file.setProviderMetadata(metadata);
					this.endSync();
				}
				else
				{
					olapDriver.getObjectByName(this.m_file.getName(), this, oFF.SyncType.NON_BLOCKING);
				}
			}
			else
			{
				let objectType = this.m_file.getName();
				let metaObjectType = oFF.MetaObjectType.lookup(objectType);
				if (oFF.notNull(metaObjectType))
				{
					olapDriver.getObjectsByType(metaObjectType, this, oFF.SyncType.NON_BLOCKING, this.m_FileQueryConfig);
				}
			}
		}
		catch (e2)
		{
			this.addError(oFF.ErrorCodes.OTHER_ERROR, "Error occurred while retrieving files.");
			this.onOlapCatalogResult(null, null, null);
		}
	}
	else
	{
		this.onOlapCatalogResult(null, null, null);
	}
};
oFF.OlapFileFetchAction.prototype.onOlapCatalogResult = function(extResult, result, customIdentifier)
{
	if (oFF.notNull(extResult))
	{
		this.addAllMessages(extResult);
	}
	if (oFF.notNull(result))
	{
		this.getAndSetObjects(result);
	}
	else
	{
		let childFiles = oFF.XList.create();
		this.m_file.setProviderChildFiles(childFiles, -1);
	}
	let olapDriver = this.getOlapCatalogFileSystemDriverByHost();
	olapDriver.resetSearchFlags();
	this.endSync();
};
oFF.OlapFileFetchAction.prototype.processSynchronization = function(syncType)
{
	let host = this.m_file.getUri().getHost();
	let olapDriver = this.m_ofs.getOlapDrivers().getByKey(host);
	let doContinue = true;
	if (oFF.isNull(olapDriver))
	{
		olapDriver = new oFF.OlapCatalogFileSystemDriver();
		this.m_ofs.getOlapDrivers().put(host, olapDriver);
	}
	if (!olapDriver.isCatalogManagerInitialised() || !oFF.XString.isEqual(host, olapDriver.getSystemName()))
	{
		this.setupCatalogManager(syncType, host, olapDriver);
	}
	else
	{
		doContinue = this.processTargetUri(syncType, olapDriver);
	}
	return doContinue;
};
oFF.OlapFileFetchAction.prototype.processTargetUri = function(syncType, olapDriver)
{
	let doContinue = true;
	let targetUriPath = this.m_file.getUri().getPath();
	let fileName = this.m_file.getName();
	try
	{
		if (this.m_metaDataOnly)
		{
			if (oFF.XString.isEqual(fileName, "Schema") || oFF.XString.isEqual(fileName, "Type"))
			{
				let metadata = this.getFolderMetaData(fileName, false);
				this.m_file.setProviderMetadata(metadata);
				doContinue = false;
			}
			else
			{
				olapDriver.getObjectByName(this.m_file.getName(), this, oFF.SyncType.NON_BLOCKING);
			}
		}
		else
		{
			if (oFF.XString.isEqual(targetUriPath, oFF.XFile.SLASH))
			{
				this.getAndSetObjectsFolders(olapDriver);
				doContinue = false;
			}
			else if (oFF.XString.containsString(targetUriPath, "Schema/") && !oFF.XString.isEqual(fileName, "Schema"))
			{
				olapDriver.getObjectsBySchema(fileName, this, syncType, this.m_FileQueryConfig);
			}
			else if (oFF.XString.containsString(targetUriPath, "Type/") && !oFF.XString.isEqual(fileName, "Type"))
			{
				let typeName = this.m_file.getName();
				let metaObjectType = oFF.MetaObjectType.lookup(typeName);
				olapDriver.getObjectsByType(metaObjectType, this, syncType, this.m_FileQueryConfig);
			}
			else if (oFF.XString.isEqual(fileName, "Schema"))
			{
				let allSchemaObjects = olapDriver.getAllSchemas(this.m_FileQueryConfig);
				if (oFF.notNull(allSchemaObjects))
				{
					this.setChildFiles(olapDriver, allSchemaObjects, false);
				}
				doContinue = false;
			}
			else if (oFF.XString.isEqual(fileName, "Type"))
			{
				let allTypeObjects = olapDriver.getAllObjectTypes();
				if (oFF.notNull(allTypeObjects))
				{
					this.setChildFiles(olapDriver, allTypeObjects, false);
				}
				doContinue = false;
			}
			else
			{
				let objectType = oFF.MetaObjectType.lookup(fileName);
				if (oFF.notNull(objectType))
				{
					olapDriver.getObjectsByType(objectType, this, syncType, this.m_FileQueryConfig);
				}
			}
		}
	}
	catch (e)
	{
		this.addError(oFF.ErrorCodes.OTHER_ERROR, "Error occurred while retrieving files.");
		this.onOlapCatalogResult(null, null, null);
	}
	return doContinue;
};
oFF.OlapFileFetchAction.prototype.releaseObjectInternal = function()
{
	this.m_ofs = null;
	this.m_file = null;
};
oFF.OlapFileFetchAction.prototype.setChildFiles = function(olapDriver, allObjects, enableSearch)
{
	let objectTypeIterator = allObjects.getData().getIterator();
	let children = oFF.XList.create();
	while (objectTypeIterator.hasNext())
	{
		let olapAttr = oFF.XHashMapByString.create();
		olapAttr.put(oFF.XFileAttribute.NODE_TYPE, oFF.OlapCatalogFileSystem.FOLDER);
		let systemType = olapDriver.getSystemType().getName();
		olapAttr.put(oFF.XFileAttribute.SYSTEM_TYPE, systemType);
		if (olapDriver.isDWCSystem())
		{
			olapAttr.put(oFF.XFileAttribute.ICON, this.m_ofs.getIconByName("SPACE"));
		}
		let nextObject = objectTypeIterator.next();
		if (oFF.notNull(nextObject) && oFF.XString.size(nextObject.getName()) > 0)
		{
			let objectName = oFF.XString.toLowerCase(nextObject.getName());
			if (oFF.OlapFileUtils.isValidSchemaName(objectName))
			{
				let childFolderUri = oFF.XUri.createChildFile(this.m_file.getUri(), objectName);
				let childFolder = oFF.OlapFile.createFile(this.getProcess(), this.m_ofs, childFolderUri, olapAttr);
				let metadata = this.getFolderMetaData(objectName, enableSearch);
				childFolder.setProviderMetadata(metadata);
				children.add(childFolder);
			}
		}
	}
	this.m_file.setProviderChildFiles(children, olapDriver.getTuplesCountTotal());
};
oFF.OlapFileFetchAction.prototype.setupCatalogManager = function(syncType, host, olapDriver)
{
	try
	{
		olapDriver.setupCatalogManager(this.getProcess(), host, syncType, this);
	}
	catch (e)
	{
		this.addError(oFF.ErrorCodes.OTHER_ERROR, "Error occurred while retrieving files.");
		this.onOlapCatalogResult(null, null, null);
	}
};

oFF.XFsOlapCatalogActionFetch = function() {};
oFF.XFsOlapCatalogActionFetch.prototype = new oFF.SyncActionExt();
oFF.XFsOlapCatalogActionFetch.prototype._ff_c = "XFsOlapCatalogActionFetch";

oFF.XFsOlapCatalogActionFetch.createAndRun = function(syncType, listener, customIdentifier, fsmr, uri)
{
	let object = new oFF.XFsOlapCatalogActionFetch();
	object.m_uri = uri;
	object.setupActionAndRun(syncType, listener, customIdentifier, fsmr);
	return object;
};
oFF.XFsOlapCatalogActionFetch.prototype.m_uri = null;
oFF.XFsOlapCatalogActionFetch.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onFileSystemFetched(extResult, data, customIdentifier);
};
oFF.XFsOlapCatalogActionFetch.prototype.processSynchronization = function(syncType)
{
	let fileSystem = this.getActionContext().getFileSystemByUri(this.m_uri);
	this.setData(fileSystem);
	return false;
};

oFF.OlapCatalogFileSystem = function() {};
oFF.OlapCatalogFileSystem.prototype = new oFF.DfXFileSystem();
oFF.OlapCatalogFileSystem.prototype._ff_c = "OlapCatalogFileSystem";

oFF.OlapCatalogFileSystem.CHILDREN = "children";
oFF.OlapCatalogFileSystem.DIRECTORY_SEPERATOR = "/";
oFF.OlapCatalogFileSystem.FOLDER = "Folder";
oFF.OlapCatalogFileSystem.NAME = "name";
oFF.OlapCatalogFileSystem.create = function(process)
{
	let newObj = new oFF.OlapCatalogFileSystem();
	newObj.setupProcessContext(process);
	newObj.setupIcons();
	return newObj;
};
oFF.OlapCatalogFileSystem.createByHost = function(process, host)
{
	let newObj = new oFF.OlapCatalogFileSystem();
	let olapDriver = new oFF.OlapCatalogFileSystemDriver();
	newObj.m_olapDrivers = oFF.XHashMapByString.create();
	newObj.m_olapDrivers.put(host, olapDriver);
	newObj.setupIcons();
	newObj.setupProcessContext(process);
	return newObj;
};
oFF.OlapCatalogFileSystem.prototype.m_fs = null;
oFF.OlapCatalogFileSystem.prototype.m_iconMap = null;
oFF.OlapCatalogFileSystem.prototype.m_olapDrivers = null;
oFF.OlapCatalogFileSystem.prototype.m_rootFile = null;
oFF.OlapCatalogFileSystem.prototype.getAttributes = function(file)
{
	let result = null;
	let targetPath = file.getTargetUriPath();
	let fileStructure = this.getFileStructure(targetPath);
	if (oFF.notNull(fileStructure))
	{
		result = fileStructure.getStructureByKey("attributes");
	}
	if (oFF.isNull(result))
	{
		result = oFF.DfXFileSystem.prototype.getAttributes.call( this , file);
	}
	return result;
};
oFF.OlapCatalogFileSystem.prototype.getChildren = function(file)
{
	let children = oFF.XList.create();
	let targetPath = file.getTargetUriPath();
	let host = file.getUri().getHost();
	let olapDriver = this.m_olapDrivers.getByKey(host);
	if (oFF.XString.isEqual(targetPath, oFF.OlapCatalogFileSystem.DIRECTORY_SEPERATOR))
	{
		let allObjects = this.m_olapDrivers.getByKey(host).createFsObjectsFolderDefinition();
		let objectTypeIterator = allObjects.getData().getIterator();
		while (objectTypeIterator.hasNext())
		{
			let olapAttr = oFF.XHashMapByString.create();
			olapAttr.put(oFF.XFileAttribute.NODE_TYPE, oFF.OlapCatalogFileSystem.FOLDER);
			let systemType = olapDriver.getSystemType().getName();
			olapAttr.put(oFF.XFileAttribute.SYSTEM_TYPE, systemType);
			let nextType = objectTypeIterator.next();
			let type = oFF.XString.toLowerCase(nextType.getName());
			let childFolderUri = oFF.XUri.createChildFile(file.getTargetUri(), type);
			let childFolder = oFF.OlapFile.createFile(this.getProcess(), this, childFolderUri, olapAttr);
			children.add(childFolder);
		}
	}
	else
	{
		let folderName = file.getName();
		let metaObjectType = oFF.MetaObjectType.lookup(folderName);
		if (oFF.notNull(metaObjectType))
		{
			let result = olapDriver.getObjectsByType(metaObjectType, null, oFF.SyncType.BLOCKING, null);
			children = oFF.OlapFileUtils.processCatalogResult(result.getData(), this.getProcess(), this, file, olapDriver.isDWCSystem());
		}
	}
	return children;
};
oFF.OlapCatalogFileSystem.prototype.getFileStructure = function(targetPath)
{
	let element = null;
	if (oFF.XString.startsWith(targetPath, oFF.OlapCatalogFileSystem.DIRECTORY_SEPERATOR) === true)
	{
		element = this.m_fs;
		let elements = oFF.XStringTokenizer.splitString(targetPath, oFF.OlapCatalogFileSystem.DIRECTORY_SEPERATOR);
		if (oFF.XStringUtils.isNullOrEmpty(elements.get(0)))
		{
			elements.removeAt(0);
		}
		let size = elements.size();
		if (size > 0)
		{
			if (oFF.XStringUtils.isNullOrEmpty(elements.get(size - 1)))
			{
				elements.removeAt(size - 1);
			}
		}
		for (let k = 0; k < elements.size() && oFF.notNull(element); k++)
		{
			let name = elements.get(k);
			let childList = element.getListByKey(oFF.OlapCatalogFileSystem.CHILDREN);
			element = null;
			if (oFF.notNull(childList))
			{
				for (let i = 0; i < childList.size(); i++)
				{
					let currentChild = childList.getStructureAt(i);
					let currentName = currentChild.getStringByKey(oFF.OlapCatalogFileSystem.NAME);
					if (oFF.XString.isEqual(name, currentName))
					{
						element = currentChild;
						break;
					}
				}
			}
		}
	}
	return element;
};
oFF.OlapCatalogFileSystem.prototype.getFileType = function(file)
{
	if (this.isDirectoryExt(file))
	{
		return oFF.XFileType.DIR;
	}
	else
	{
		return oFF.XFileType.FILE;
	}
};
oFF.OlapCatalogFileSystem.prototype.getIconByName = function(key)
{
	return this.m_iconMap.getByKey(key);
};
oFF.OlapCatalogFileSystem.prototype.getOlapDrivers = function()
{
	return this.m_olapDrivers;
};
oFF.OlapCatalogFileSystem.prototype.getProtocolType = function()
{
	return oFF.ProtocolType.FS_OLAP_CATALOG;
};
oFF.OlapCatalogFileSystem.prototype.isDirectoryExt = function(file)
{
	let targetPath = file.getTargetUriPath();
	let fileStructure = this.getFileStructure(targetPath);
	return oFF.notNull(fileStructure) ? fileStructure.containsKey(oFF.OlapCatalogFileSystem.CHILDREN) : false;
};
oFF.OlapCatalogFileSystem.prototype.isExistingExt = function(file)
{
	let targetPath = file.getTargetUriPath();
	let fileStructure = this.getFileStructure(targetPath);
	return oFF.notNull(fileStructure);
};
oFF.OlapCatalogFileSystem.prototype.isFileExt = function(file)
{
	return !this.isDirectoryExt(file);
};
oFF.OlapCatalogFileSystem.prototype.newFile = function(process, uri)
{
	let file = oFF.OlapFile.createFile(process, this, uri, oFF.XHashMapByString.create());
	if (oFF.notNull(this.m_rootFile) && oFF.XString.isEqual(uri.getPath(), oFF.OlapCatalogFileSystem.DIRECTORY_SEPERATOR))
	{
		let host = uri.getHost();
		if (!oFF.XString.isEqual(host, this.m_rootFile.getUri().getHost()))
		{
			this.m_rootFile = file;
		}
		return this.m_rootFile;
	}
	else if (oFF.XString.isEqual(uri.getPath(), oFF.OlapCatalogFileSystem.DIRECTORY_SEPERATOR))
	{
		this.m_rootFile = file;
	}
	return file;
};
oFF.OlapCatalogFileSystem.prototype.processFetchChildren = function(olapFile, syncType, listener, customIdentifier, config)
{
	return oFF.OlapFileFetchAction.createAndRun(syncType, olapFile, this, oFF.OlapFileRequestListener2.create((fileRequestAction) => {
		let data = fileRequestAction.getData();
		if (oFF.notNull(listener))
		{
			listener.onFileProviderChildrenFetched(fileRequestAction, data, data.getProviderChildFiles(), data.getProviderChildrenResultset(), customIdentifier);
		}
	}), customIdentifier, false, config);
};
oFF.OlapCatalogFileSystem.prototype.processFetchMetadata = function(olapFile, syncType, listener, customIdentifier)
{
	let syncAction = oFF.OlapFileFetchAction.createAndRun(syncType, olapFile, this, oFF.OlapFileRequestListener2.create((fileRequestAction) => {
		let data = fileRequestAction.getData();
		if (oFF.notNull(listener))
		{
			listener.onFileProviderFetchMetadata(fileRequestAction, data, data.getProviderMetadataAndAttributes(), customIdentifier);
		}
	}), customIdentifier, true, null);
	return syncAction;
};
oFF.OlapCatalogFileSystem.prototype.processIsExisting = function(olapFile, syncType, listener, customIdentifier)
{
	let syncAction = oFF.OlapFileFetchAction.createAndRun(syncType, olapFile, this, oFF.OlapFileRequestListener2.create((fileRequestAction) => {
		let file = fileRequestAction.getData();
		if (oFF.notNull(listener))
		{
			listener.onFileProviderExistsCheck(fileRequestAction, file, file.getProviderIsExisting(), customIdentifier);
		}
	}), customIdentifier, true, null);
	return syncAction;
};
oFF.OlapCatalogFileSystem.prototype.setupIcons = function()
{
	this.m_iconMap = oFF.XLinkedHashMapByString.create();
	let prefix = "sap-icon://fpa/";
	let prefixNoFpa = "sap-icon://";
	this.m_iconMap.put("CUBE", oFF.XStringUtils.concatenate2(prefix, "live-model"));
	this.m_iconMap.put("DATASET", oFF.XStringUtils.concatenate2(prefix, "fact-view"));
	this.m_iconMap.put("SPACE", oFF.XStringUtils.concatenate2(prefixNoFpa, "curriculum"));
};

oFF.OlapCatalogService = function() {};
oFF.OlapCatalogService.prototype = new oFF.DfService();
oFF.OlapCatalogService.prototype._ff_c = "OlapCatalogService";

oFF.OlapCatalogService.CLAZZ = null;
oFF.OlapCatalogService.staticSetup = function()
{
	oFF.OlapCatalogService.CLAZZ = oFF.XClass.create(oFF.OlapCatalogService);
};
oFF.OlapCatalogService.prototype.m_catalogManager = null;
oFF.OlapCatalogService.prototype.m_queryManager = null;
oFF.OlapCatalogService.prototype.getCatalogManager = function()
{
	if (oFF.isNull(this.m_catalogManager))
	{
		this.m_catalogManager = this.newCatalogManager();
	}
	return this.m_catalogManager;
};
oFF.OlapCatalogService.prototype.newCatalogManager = function()
{
	let catalogManager = oFF.OlapCatalogManager2.create(this.m_queryManager);
	return catalogManager;
};
oFF.OlapCatalogService.prototype.onQueryManagerCreated = function(extResult, queryManager, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		this.m_queryManager = queryManager;
		if (queryManager.getSession().hasFeature(oFF.FeatureToggleOlap.OPTIMIZE_MDS_CATALOG) && queryManager.supportsReturnedDataSelection() && queryManager.getSystemType().isTypeOf(oFF.SystemType.HANA))
		{
			queryManager.queueEventing();
			let queryModel = queryManager.getQueryModel();
			queryModel.toggleReturnedDataSelection(oFF.ReturnedDataSelection.ACTIONS, false);
			queryModel.toggleReturnedDataSelection(oFF.ReturnedDataSelection.CELL_DATA_TYPE, false);
			queryModel.toggleReturnedDataSelection(oFF.ReturnedDataSelection.CELL_FORMAT, false);
			queryModel.toggleReturnedDataSelection(oFF.ReturnedDataSelection.CELL_VALUE_TYPES, false);
			queryModel.toggleReturnedDataSelection(oFF.ReturnedDataSelection.EXCEPTION_SETTINGS, false);
			queryModel.toggleReturnedDataSelection(oFF.ReturnedDataSelection.EXCEPTIONS, false);
			queryModel.toggleReturnedDataSelection(oFF.ReturnedDataSelection.INPUT_READINESS_STATES, false);
			queryModel.toggleReturnedDataSelection(oFF.ReturnedDataSelection.NUMERIC_ROUNDING, false);
			queryModel.toggleReturnedDataSelection(oFF.ReturnedDataSelection.NUMERIC_SHIFT, false);
			queryModel.toggleReturnedDataSelection(oFF.ReturnedDataSelection.UNIT_DESCRIPTIONS, false);
			queryModel.toggleReturnedDataSelection(oFF.ReturnedDataSelection.UNIT_TYPES, false);
			queryModel.toggleReturnedDataSelection(oFF.ReturnedDataSelection.UNITS, false);
			queryModel.toggleReturnedDataSelection(oFF.ReturnedDataSelection.VALUES, false);
			queryModel.toggleReturnedDataSelection(oFF.ReturnedDataSelection.VALUES_FORMATTED, false);
			queryModel.toggleReturnedDataSelection(oFF.ReturnedDataSelection.VALUES_ROUNDED, false);
			queryModel.toggleReturnedDataSelection(oFF.ReturnedDataSelection.TUPLE_DISPLAY_LEVEL, false);
			queryModel.toggleReturnedDataSelection(oFF.ReturnedDataSelection.TUPLE_DRILL_STATE, false);
			queryModel.toggleReturnedDataSelection(oFF.ReturnedDataSelection.TUPLE_LEVEL, false);
			queryModel.toggleReturnedDataSelection(oFF.ReturnedDataSelection.TUPLE_PARENT_INDEXES, false);
			queryManager.resumeEventing();
		}
	}
	this.endSync();
};
oFF.OlapCatalogService.prototype.processSynchronization = function(syncType)
{
	let config = this.getServiceConfig();
	let queryServiceConfig = oFF.QueryServiceConfig.create(this.getApplication());
	queryServiceConfig.setSystemName(config.getSystemName());
	let identifier = oFF.QFactory.createDataSourceWithType(config.getMetaObjectType(), "$$DataSource$$");
	queryServiceConfig.setDataSource(identifier);
	queryServiceConfig.setProviderType(oFF.ProviderType.ANALYTICS);
	queryServiceConfig.setConnectionContainer(this.getConnection());
	queryServiceConfig.processQueryManagerCreation(syncType, this, null);
	return true;
};
oFF.OlapCatalogService.prototype.releaseObjectInternal = function()
{
	this.m_catalogManager = oFF.XObjectExt.release(this.m_catalogManager);
	oFF.DfService.prototype.releaseObjectInternal.call( this );
};

oFF.PlanningCatalogService = function() {};
oFF.PlanningCatalogService.prototype = new oFF.DfService();
oFF.PlanningCatalogService.prototype._ff_c = "PlanningCatalogService";

oFF.PlanningCatalogService.CLAZZ = null;
oFF.PlanningCatalogService.staticSetup = function()
{
	oFF.PlanningCatalogService.CLAZZ = oFF.XClass.create(oFF.PlanningCatalogService);
};
oFF.PlanningCatalogService.prototype.m_catalogManager = null;
oFF.PlanningCatalogService.prototype.getCatalogManager = function()
{
	return this.m_catalogManager;
};
oFF.PlanningCatalogService.prototype.onQueryManagerCreated = function(extResult, queryManager, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		this.m_catalogManager = oFF.PlanningCatalogManager.create(queryManager);
	}
	this.endSync();
};
oFF.PlanningCatalogService.prototype.processSynchronization = function(syncType)
{
	let config = this.getServiceConfig();
	let queryServiceConfig = oFF.QueryServiceConfig.create(this.getApplication());
	queryServiceConfig.setSystemName(config.getSystemName());
	let identifier = oFF.QFactory.createDataSourceWithType(oFF.MetaObjectType.CATALOG_VIEW, "$$DataSource$$");
	queryServiceConfig.setDataSource(identifier);
	queryServiceConfig.setProviderType(oFF.ProviderType.PLANNING);
	queryServiceConfig.setConnectionContainer(this.getConnection());
	queryServiceConfig.processQueryManagerCreation(syncType, this, null);
	return true;
};
oFF.PlanningCatalogService.prototype.releaseObjectInternal = function()
{
	this.m_catalogManager = oFF.XObjectExt.release(this.m_catalogManager);
	oFF.DfService.prototype.releaseObjectInternal.call( this );
};

oFF.PlanningCatalogServiceConfig = function() {};
oFF.PlanningCatalogServiceConfig.prototype = new oFF.DfServiceConfig();
oFF.PlanningCatalogServiceConfig.prototype._ff_c = "PlanningCatalogServiceConfig";

oFF.PlanningCatalogServiceConfig.CLAZZ = null;
oFF.PlanningCatalogServiceConfig.staticSetup = function()
{
	oFF.PlanningCatalogServiceConfig.CLAZZ = oFF.XClass.create(oFF.PlanningCatalogServiceConfig);
};
oFF.PlanningCatalogServiceConfig.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onPlanningCatalogManagerCreated(extResult, data, customIdentifier);
};
oFF.PlanningCatalogServiceConfig.prototype.processPlanningCatalogManagerCreation = function(syncType, listener, customIdentifier)
{
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.PlanningCatalogServiceConfig.prototype.setDataFromService = function(service)
{
	this.setData(service.getCatalogManager());
};

oFF.PlanningModelCatalogService = function() {};
oFF.PlanningModelCatalogService.prototype = new oFF.DfService();
oFF.PlanningModelCatalogService.prototype._ff_c = "PlanningModelCatalogService";

oFF.PlanningModelCatalogService.CLAZZ = null;
oFF.PlanningModelCatalogService.staticSetup = function()
{
	oFF.PlanningModelCatalogService.CLAZZ = oFF.XClass.create(oFF.PlanningModelCatalogService);
};
oFF.PlanningModelCatalogService.prototype.m_catalogManager = null;
oFF.PlanningModelCatalogService.prototype.getCatalogManager = function()
{
	return this.m_catalogManager;
};
oFF.PlanningModelCatalogService.prototype.getOlapEnv = function()
{
	return this.getApplication().getOlapEnvironment();
};
oFF.PlanningModelCatalogService.prototype.isServiceConfigMatching = function(serviceConfig, connection, messages)
{
	let systemType = serviceConfig.getSystemType();
	if (oFF.isNull(systemType))
	{
		this.addError(oFF.ErrorCodes.INVALID_SYSTEM, "illegal system type");
		return false;
	}
	if (!systemType.isTypeOf(oFF.SystemType.HANA))
	{
		this.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.INVALID_SYSTEM, "illegal system type", systemType);
		return false;
	}
	return true;
};
oFF.PlanningModelCatalogService.prototype.processSynchronization = function(syncType)
{
	this.m_catalogManager = oFF.PlanningModelCatalogManager.create(this);
	return false;
};
oFF.PlanningModelCatalogService.prototype.releaseObjectInternal = function()
{
	this.m_catalogManager = oFF.XObjectExt.release(this.m_catalogManager);
	oFF.DfService.prototype.releaseObjectInternal.call( this );
};

oFF.PlanningModelCatalogServiceConfig = function() {};
oFF.PlanningModelCatalogServiceConfig.prototype = new oFF.DfServiceConfig();
oFF.PlanningModelCatalogServiceConfig.prototype._ff_c = "PlanningModelCatalogServiceConfig";

oFF.PlanningModelCatalogServiceConfig.CLAZZ = null;
oFF.PlanningModelCatalogServiceConfig.staticSetup = function()
{
	oFF.PlanningModelCatalogServiceConfig.CLAZZ = oFF.XClass.create(oFF.PlanningModelCatalogServiceConfig);
};
oFF.PlanningModelCatalogServiceConfig.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onPlanningModelCatalogManagerCreated(extResult, data, customIdentifier);
};
oFF.PlanningModelCatalogServiceConfig.prototype.processPlanningModelCatalogManagerCreation = function(syncType, listener, customIdentifier)
{
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.PlanningModelCatalogServiceConfig.prototype.setDataFromService = function(service)
{
	this.setData(service.getCatalogManager());
};

oFF.OlapCatalogManager2 = function() {};
oFF.OlapCatalogManager2.prototype = new oFF.QOlapSyncAction();
oFF.OlapCatalogManager2.prototype._ff_c = "OlapCatalogManager2";

oFF.OlapCatalogManager2.CN_BASEDATASOURCE = "BaseDataSource";
oFF.OlapCatalogManager2.CN_BASEDATASOURCE_OBJECTNAME = "BaseDataSourceObjectName";
oFF.OlapCatalogManager2.CN_BASEDATASOURCE_PACKAGENAME = "BaseDataSourcePackageName";
oFF.OlapCatalogManager2.CN_BASEDATASOURCE_SCHEMANAME = "BaseDataSourceSchemaName";
oFF.OlapCatalogManager2.CN_BASEDATASOURCE_TYPE = "BaseDataSourceType";
oFF.OlapCatalogManager2.CN_CURRENCY = "Currency";
oFF.OlapCatalogManager2.CN_CURRENCY_TARGET = "Target";
oFF.OlapCatalogManager2.CN_CURRENCY_TRANSLATION_NAME = "Name";
oFF.OlapCatalogManager2.CN_DATA_CATEGORY = "DataCategory";
oFF.OlapCatalogManager2.CN_FORMULA_OPERATORS = "FormulaOperators";
oFF.OlapCatalogManager2.CN_FORMULA_OPERATORS_OPERANDS_NUMBER = "FormulaOperators.OPERANDS_NUMBER";
oFF.OlapCatalogManager2.CN_INTERNAL_TYPE = "InternalType";
oFF.OlapCatalogManager2.CN_OBJECT = "ObjectName";
oFF.OlapCatalogManager2.CN_OBJECT_IS_PLANQUERY = "ObjectName.IS_PLANQUERY";
oFF.OlapCatalogManager2.CN_OBJECT_MDX_FLAG = "ObjectName.MDX_FLAG";
oFF.OlapCatalogManager2.CN_PACKAGE = "PackageName";
oFF.OlapCatalogManager2.CN_PLANNING_MODEL_NAME = "ModelName";
oFF.OlapCatalogManager2.CN_PLANNING_MODEL_SCHEMA_NAME = "ModelSchemaName";
oFF.OlapCatalogManager2.CN_QUERY_ALIAS = "QueryAlias";
oFF.OlapCatalogManager2.CN_SCHEMA = "SchemaName";
oFF.OlapCatalogManager2.CN_TYPE = "Type";
oFF.OlapCatalogManager2.create = function(queryManager)
{
	let object = new oFF.OlapCatalogManager2();
	object.setupCatalogManager(queryManager);
	return object;
};
oFF.OlapCatalogManager2.prototype.m_baseDataSourceFilter = null;
oFF.OlapCatalogManager2.prototype.m_baseDataSourceFilterList = null;
oFF.OlapCatalogManager2.prototype.m_baseDataSourceTypeFilter = null;
oFF.OlapCatalogManager2.prototype.m_catalogResult = null;
oFF.OlapCatalogManager2.prototype.m_categoryFilter = null;
oFF.OlapCatalogManager2.prototype.m_interestedCurrency = null;
oFF.OlapCatalogManager2.prototype.m_internalTypeExcludeList = null;
oFF.OlapCatalogManager2.prototype.m_internalTypeIncludeList = null;
oFF.OlapCatalogManager2.prototype.m_isSearchOnName = false;
oFF.OlapCatalogManager2.prototype.m_isSearchOnPackage = false;
oFF.OlapCatalogManager2.prototype.m_isSearchOnSchema = false;
oFF.OlapCatalogManager2.prototype.m_isSearchOnText = false;
oFF.OlapCatalogManager2.prototype.m_isTransientInfoProvidersIncluded = false;
oFF.OlapCatalogManager2.prototype.m_packageComparisonOperator = null;
oFF.OlapCatalogManager2.prototype.m_packageFilter = null;
oFF.OlapCatalogManager2.prototype.m_planQueryFilter = null;
oFF.OlapCatalogManager2.prototype.m_schema = null;
oFF.OlapCatalogManager2.prototype.m_textFilter = null;
oFF.OlapCatalogManager2.prototype.m_type = null;
oFF.OlapCatalogManager2.prototype.m_types = null;
oFF.OlapCatalogManager2.prototype.m_withOtherFiltersPackage = null;
oFF.OlapCatalogManager2.prototype.addFilterToRoot = function(rootFilterAnd, filter)
{
	if (filter.hasElements())
	{
		rootFilterAnd.add(filter);
	}
};
oFF.OlapCatalogManager2.prototype.addSelectedType = function(type)
{
	if (!this.supportsCombinedSearch())
	{
		throw oFF.XException.createIllegalArgumentException("More than 1 Metaobject types not supported");
	}
	this.ensureTypeIsSelectable(type);
	this.m_types.add(type);
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onOlapCatalogResult(extResult, data, customIdentifier);
};
oFF.OlapCatalogManager2.prototype.clearSearchFlags = function()
{
	this.m_isSearchOnName = false;
	this.m_isSearchOnText = false;
	this.m_isSearchOnSchema = false;
	this.m_isSearchOnPackage = false;
};
oFF.OlapCatalogManager2.prototype.createAndAddFilterOp = function(textFilter, mainOrRootFilter, comparisonOperator, objectType, pType)
{
	let queryModel = this.getQueryManager().getQueryModel();
	let selectionStateContainer = queryModel.getFilter().getDynamicFilter();
	let dimensionByNameCNObject = null;
	if (oFF.notNull(objectType))
	{
		dimensionByNameCNObject = queryModel.getDimensionByName(objectType);
	}
	if (oFF.notNull(dimensionByNameCNObject))
	{
		let fieldByType = dimensionByNameCNObject.getFirstFieldByType(pType);
		let filterOperation = oFF.QFactory.createFilterOperationWithOperator(selectionStateContainer, fieldByType, comparisonOperator);
		filterOperation.setLowString(textFilter);
		mainOrRootFilter.add(filterOperation);
	}
};
oFF.OlapCatalogManager2.prototype.createFilterElementsInCartesianList = function(numberOfMetadataObjectTypes, systemTypes, mainOrRootFilter)
{
	let queryModel = this.getQueryManager().getQueryModel();
	let dynamicFilter = queryModel.getFilter().getDynamicFilter();
	let dimensionCnType = queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_TYPE);
	let keyField = dimensionCnType.getFirstFieldByType(oFF.PresentationType.KEY);
	let cartesianList = oFF.QFactory.createFilterCartesianListWithField(dynamicFilter, keyField);
	mainOrRootFilter.add(cartesianList);
	for (let i = 0; i < numberOfMetadataObjectTypes; i++)
	{
		let textFilter = systemTypes.get(i).getCamelCaseName();
		let filterName = cartesianList.addNewCartesianElement();
		filterName.setComparisonOperator(oFF.ComparisonOperator.EQUAL);
		filterName.setLowString(textFilter);
	}
};
oFF.OlapCatalogManager2.prototype.determineComparisonOperator = function(op, text)
{
	if (oFF.notNull(op))
	{
		return op;
	}
	if (oFF.XString.containsString(text, "*"))
	{
		return oFF.ComparisonOperator.MATCH;
	}
	return oFF.ComparisonOperator.EQUAL;
};
oFF.OlapCatalogManager2.prototype.ensureTypeIsSelectable = function(type)
{
	if (this.isLightweightSearch())
	{
		if (type !== oFF.MetaObjectType.QUERY && type !== oFF.MetaObjectType.DEFAULT_REPORT_QUERY && type !== oFF.MetaObjectType.DEFAULT_PLAN_QUERY && type !== oFF.MetaObjectType.FILTER && type !== oFF.MetaObjectType.INFOPROVIDER && type !== oFF.MetaObjectType.ALVL && type !== oFF.MetaObjectType.INFOOBJECT && type !== oFF.MetaObjectType.PLANNING_SEQUENCE && type !== oFF.MetaObjectType.PLANNING_FUNCTION && type !== oFF.MetaObjectType.QUERY_VIEW && type !== oFF.MetaObjectType.CDS_PROJECTION_VIEW)
		{
			throw oFF.XException.createIllegalArgumentException("Only these types are supported when using the lightweight catalog manager: QUERY, DEFAULT_REPORT_QUERY, DEFAULT_PLAN_QUERY, FILTER, INFOPROVIDER, ALVL, INFOOBJECT, PLANNING_SEQUENCE, PLANNING_FUNCTION, QUERY_VIEW");
		}
	}
};
oFF.OlapCatalogManager2.prototype.getAllMember = function(componentType, dimensionName, metaObjectType, schema, packageName)
{
	let queryModel = this.getQueryManager().getQueryModel();
	let convenienceCommands = queryModel.getConvenienceCommands();
	convenienceCommands.resetToDefault();
	if (oFF.notNull(metaObjectType))
	{
		convenienceCommands.addSingleMemberFilterByDimensionName(oFF.OlapCatalogManager2.CN_TYPE, metaObjectType.getCamelCaseName(), oFF.ComparisonOperator.EQUAL);
	}
	if (oFF.notNull(schema))
	{
		convenienceCommands.addSingleMemberFilterByDimensionName(oFF.OlapCatalogManager2.CN_SCHEMA, schema, oFF.ComparisonOperator.EQUAL);
	}
	if (oFF.notNull(packageName))
	{
		convenienceCommands.addSingleMemberFilterByDimensionName(oFF.OlapCatalogManager2.CN_PACKAGE, packageName, oFF.ComparisonOperator.EQUAL);
	}
	convenienceCommands.clearAxis(oFF.AxisType.ROWS);
	convenienceCommands.moveDimensionOnAxisTo(dimensionName, oFF.AxisType.ROWS, 0);
	convenienceCommands.addFieldByTypeToResultSet(dimensionName, oFF.PresentationType.KEY);
	convenienceCommands.addFieldByTypeToResultSet(dimensionName, oFF.PresentationType.TEXT);
	let extResult = this.getQueryManager().processQueryExecution(oFF.SyncType.BLOCKING, null, null);
	let packages = oFF.XList.create();
	let packageDim = queryModel.getDimensionByName(dimensionName);
	if (extResult.isValid() && oFF.notNull(packageDim))
	{
		let packageNameField = packageDim.getKeyField();
		let packageTextField = packageDim.getTextField();
		let rs = extResult.getData().getClassicResultSet();
		let rowsAxis = rs.getRowsAxis();
		let tuplesCount = rowsAxis.getTuplesCount();
		for (let i = 0; i < tuplesCount; i++)
		{
			let tuple = rowsAxis.getTupleAt(i);
			let theName = tuple.getStringByField(packageNameField);
			let theText = theName;
			if (oFF.notNull(packageTextField))
			{
				theText = tuple.getStringByField(packageTextField);
			}
			packages.add(oFF.XHierarchyElement.createHierarchyElement(componentType, theName, theText));
		}
	}
	return oFF.ExtResult.create(packages, extResult);
};
oFF.OlapCatalogManager2.prototype.getAllObjects = function(type, schema, packageName)
{
	return this.getAllMember(oFF.OlapComponentType.CATALOG_OBJECT, oFF.OlapCatalogManager2.CN_OBJECT, type, schema, packageName);
};
oFF.OlapCatalogManager2.prototype.getAllPackages = function(type, schema)
{
	return this.getAllMember(oFF.OlapComponentType.CATALOG_PACKAGE, oFF.OlapCatalogManager2.CN_PACKAGE, type, schema, null);
};
oFF.OlapCatalogManager2.prototype.getAllSchemas = function(type)
{
	return this.getAllMember(oFF.OlapComponentType.CATALOG_SCHEMA, oFF.OlapCatalogManager2.CN_SCHEMA, type, null, null);
};
oFF.OlapCatalogManager2.prototype.getAllTypes = function()
{
	return this.getAllMember(oFF.OlapComponentType.CATALOG_TYPE, oFF.OlapCatalogManager2.CN_TYPE, null, null, null);
};
oFF.OlapCatalogManager2.prototype.getBaseDataSourceFilter = function()
{
	return this.m_baseDataSourceFilter;
};
oFF.OlapCatalogManager2.prototype.getBaseDataSourceFilterList = function()
{
	return this.m_baseDataSourceFilterList;
};
oFF.OlapCatalogManager2.prototype.getBaseDataSourceTypeFilterList = function()
{
	return this.m_baseDataSourceTypeFilter;
};
oFF.OlapCatalogManager2.prototype.getDataCategoryFilter = function()
{
	return this.m_categoryFilter;
};
oFF.OlapCatalogManager2.prototype.getInternalTypeExcludeList = function()
{
	return this.m_internalTypeExcludeList;
};
oFF.OlapCatalogManager2.prototype.getInternalTypeIncludeList = function()
{
	return this.m_internalTypeIncludeList;
};
oFF.OlapCatalogManager2.prototype.getM_schema = function()
{
	return this.m_schema;
};
oFF.OlapCatalogManager2.prototype.getPackageFilter = function()
{
	return this.m_packageFilter;
};
oFF.OlapCatalogManager2.prototype.getPlanQueryFilter = function()
{
	return this.m_planQueryFilter;
};
oFF.OlapCatalogManager2.prototype.getResultMaxSize = function()
{
	return this.getQueryManager().getMaxRows();
};
oFF.OlapCatalogManager2.prototype.getResultOffset = function()
{
	return this.getQueryManager().getOffsetRows();
};
oFF.OlapCatalogManager2.prototype.getSearchFilter = function()
{
	return this.m_textFilter;
};
oFF.OlapCatalogManager2.prototype.getSelectedType = function()
{
	return this.m_type;
};
oFF.OlapCatalogManager2.prototype.getSelectedTypes = function()
{
	return this.m_types;
};
oFF.OlapCatalogManager2.prototype.getSystemType = function()
{
	let queryManager = this.getQueryManagerBase();
	if (oFF.isNull(queryManager))
	{
		return null;
	}
	let systemType = queryManager.getSystemType();
	return systemType;
};
oFF.OlapCatalogManager2.prototype.isLightweightSearch = function()
{
	let queryManager = this.getQueryManagerBase();
	return oFF.notNull(queryManager) && queryManager.isLightweightSearch();
};
oFF.OlapCatalogManager2.prototype.isSearchOnName = function()
{
	return this.m_isSearchOnName;
};
oFF.OlapCatalogManager2.prototype.isSearchOnPackage = function()
{
	return this.m_isSearchOnPackage;
};
oFF.OlapCatalogManager2.prototype.isSearchOnSchema = function()
{
	return this.m_isSearchOnSchema;
};
oFF.OlapCatalogManager2.prototype.isSearchOnText = function()
{
	return this.m_isSearchOnText;
};
oFF.OlapCatalogManager2.prototype.isTransientInfoProvidersIncluded = function()
{
	return this.m_isTransientInfoProvidersIncluded;
};
oFF.OlapCatalogManager2.prototype.onQueryExecuted = function(extResult, resultSetContainer, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		let classicResultSet = resultSetContainer.getClassicResultSet();
		this.m_catalogResult = oFF.OlapCatalogResult.create(classicResultSet, this.m_interestedCurrency);
		this.setData(this.m_catalogResult);
	}
	this.endSync();
};
oFF.OlapCatalogManager2.prototype.processGetResult = function(syncType, listener, customIdentifier)
{
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.OlapCatalogManager2.prototype.processSynchronization = function(syncType)
{
	let dimList = oFF.XList.create();
	dimList.add(oFF.OlapCatalogManager2.CN_TYPE);
	dimList.add(oFF.OlapCatalogManager2.CN_SCHEMA);
	dimList.add(oFF.OlapCatalogManager2.CN_PACKAGE);
	dimList.add(oFF.OlapCatalogManager2.CN_OBJECT);
	dimList.add(oFF.OlapCatalogManager2.CN_BASEDATASOURCE);
	let queryManager = this.getQueryManager();
	let queryModel = queryManager.getQueryModel();
	let capabilities = queryModel.getModelCapabilities();
	if (capabilities.supportsMetadataDataCategory())
	{
		dimList.add(oFF.OlapCatalogManager2.CN_DATA_CATEGORY);
	}
	if (this.getSession().hasFeature(oFF.FeatureToggleOlap.QUERY_ALIAS_FROM_CATALOG))
	{
		dimList.add(oFF.OlapCatalogManager2.CN_QUERY_ALIAS);
	}
	dimList.add(oFF.OlapCatalogManager2.CN_INTERNAL_TYPE);
	dimList.add(oFF.OlapCatalogManager2.CN_BASEDATASOURCE_TYPE);
	dimList.add(oFF.OlapCatalogManager2.CN_BASEDATASOURCE_SCHEMANAME);
	dimList.add(oFF.OlapCatalogManager2.CN_BASEDATASOURCE_PACKAGENAME);
	dimList.add(oFF.OlapCatalogManager2.CN_BASEDATASOURCE_OBJECTNAME);
	dimList.add(oFF.OlapCatalogManager2.CN_PLANNING_MODEL_NAME);
	dimList.add(oFF.OlapCatalogManager2.CN_PLANNING_MODEL_SCHEMA_NAME);
	let cmds = queryModel.getConvenienceCommands();
	cmds.resetToDefault();
	if (oFF.notNull(this.m_schema))
	{
		cmds.addSingleMemberFilterByDimensionName(oFF.OlapCatalogManager2.CN_SCHEMA, this.m_schema, oFF.ComparisonOperator.EQUAL);
	}
	cmds.clearAxis(oFF.AxisType.ROWS);
	for (let i = 0; i < dimList.size(); i++)
	{
		let dim = dimList.get(i);
		if (queryModel.getDimensionByName(dim) !== null)
		{
			cmds.moveDimensionToAxis(dim, oFF.AxisType.ROWS);
			cmds.addFieldByTypeToResultSet(dim, oFF.PresentationType.KEY);
			cmds.addFieldByTypeToResultSet(dim, oFF.PresentationType.TEXT);
		}
	}
	cmds.addFieldToResultSet(oFF.OlapCatalogManager2.CN_OBJECT, oFF.OlapCatalogManager2.CN_OBJECT_IS_PLANQUERY);
	cmds.addFieldToResultSet(oFF.OlapCatalogManager2.CN_OBJECT, oFF.OlapCatalogManager2.CN_OBJECT_MDX_FLAG);
	if (this.supportsCombinedSearch())
	{
		this.setupFilterComplex();
	}
	else
	{
		this.setupFilterSimple();
	}
	queryManager.processQueryExecution(syncType, this, null);
	return true;
};
oFF.OlapCatalogManager2.prototype.releaseObjectInternal = function()
{
	this.m_type = null;
	this.m_textFilter = null;
	this.m_categoryFilter = null;
	this.m_packageFilter = null;
	this.m_baseDataSourceFilter = null;
	this.m_baseDataSourceFilterList = oFF.XObjectExt.release(this.m_baseDataSourceFilterList);
	this.m_internalTypeIncludeList = oFF.XObjectExt.release(this.m_internalTypeIncludeList);
	this.m_internalTypeExcludeList = oFF.XObjectExt.release(this.m_internalTypeExcludeList);
	this.m_baseDataSourceTypeFilter = oFF.XObjectExt.release(this.m_baseDataSourceTypeFilter);
	this.m_planQueryFilter = null;
	this.m_catalogResult = oFF.XObjectExt.release(this.m_catalogResult);
	this.m_withOtherFiltersPackage = null;
	this.m_packageComparisonOperator = null;
	this.m_types = oFF.XObjectExt.release(this.m_types);
	this.m_interestedCurrency = null;
	this.m_schema = null;
	oFF.QOlapSyncAction.prototype.releaseObjectInternal.call( this );
};
oFF.OlapCatalogManager2.prototype.setBaseDataSourceFilter = function(baseDataSourceFilter)
{
	if (this.isLightweightSearch())
	{
		return;
	}
	if (oFF.isNull(baseDataSourceFilter))
	{
		this.m_baseDataSourceFilter = null;
	}
	else
	{
		this.setBaseDataSourceFilterList(null);
		this.m_baseDataSourceFilter = baseDataSourceFilter;
	}
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.setBaseDataSourceFilterList = function(baseDataSourceFilterList)
{
	if (this.isLightweightSearch())
	{
		return;
	}
	if (oFF.isNull(baseDataSourceFilterList))
	{
		this.m_baseDataSourceFilterList = oFF.XObjectExt.release(this.m_baseDataSourceFilterList);
	}
	else
	{
		this.setBaseDataSourceFilter(null);
		this.m_baseDataSourceFilterList = oFF.XList.createWithList(baseDataSourceFilterList);
	}
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.setBaseDataSourceTypeFilterList = function(baseDataSourceTypeFilter)
{
	if (this.isLightweightSearch())
	{
		return;
	}
	this.m_baseDataSourceTypeFilter = baseDataSourceTypeFilter;
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.setDataCategoryFilter = function(dataCategory)
{
	if (!this.getQueryManager().getQueryModel().getModelCapabilities().supportsMetadataDataCategory())
	{
		oFF.noSupport();
	}
	this.m_categoryFilter = dataCategory;
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.setFixedCurrency = function(interestedCurrency)
{
	this.m_interestedCurrency = interestedCurrency;
};
oFF.OlapCatalogManager2.prototype.setInternalTypeExcludeList = function(internalTypeExcludeList)
{
	if (this.isLightweightSearch())
	{
		return;
	}
	if (oFF.XCollectionUtils.hasElements(internalTypeExcludeList))
	{
		this.m_internalTypeExcludeList = oFF.XList.createWithList(internalTypeExcludeList);
	}
	else
	{
		this.m_internalTypeExcludeList = oFF.XObjectExt.release(this.m_internalTypeExcludeList);
	}
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.setInternalTypeIncludeList = function(internalTypeIncludeList)
{
	if (this.isLightweightSearch())
	{
		return;
	}
	if (oFF.XCollectionUtils.hasElements(internalTypeIncludeList))
	{
		this.m_internalTypeIncludeList = oFF.XList.createWithList(internalTypeIncludeList);
	}
	else
	{
		this.m_internalTypeIncludeList = oFF.XObjectExt.release(this.m_internalTypeIncludeList);
	}
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.setM_schema = function(m_schema)
{
	this.m_schema = m_schema;
};
oFF.OlapCatalogManager2.prototype.setPlanQueryFilter = function(filter)
{
	this.m_planQueryFilter = filter;
};
oFF.OlapCatalogManager2.prototype.setResultMaxSize = function(maxSize)
{
	this.getQueryManager().setMaxRows(maxSize);
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.setResultOffset = function(offset)
{
	this.getQueryManager().setOffsetRows(offset);
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.setSearchFilter = function(filter)
{
	this.m_textFilter = filter;
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.setSearchOnName = function(enableSearchOnName)
{
	if (this.m_isSearchOnName !== enableSearchOnName)
	{
		if (!this.supportsCombinedSearch())
		{
			this.clearSearchFlags();
			this.m_isSearchOnText = !enableSearchOnName;
		}
		this.m_isSearchOnName = enableSearchOnName;
		this.resetSyncState();
	}
};
oFF.OlapCatalogManager2.prototype.setSearchOnPackageExt = function(enableSearchOnPackage, text, presentationSelect, withOtherFilters, op)
{
	if (withOtherFilters === oFF.LogicalBoolOperator.NOT)
	{
		throw oFF.XException.createIllegalArgumentException("Only AND or OR are allowed.");
	}
	if (this.m_isSearchOnPackage !== enableSearchOnPackage)
	{
		if (this.isLightweightSearch())
		{
			return;
		}
		if (!this.supportsCombinedSearch())
		{
			this.clearSearchFlags();
		}
		this.m_isSearchOnPackage = enableSearchOnPackage;
		this.m_packageFilter = text;
		this.m_packageComparisonOperator = op;
		this.m_withOtherFiltersPackage = withOtherFilters;
		this.resetSyncState();
	}
};
oFF.OlapCatalogManager2.prototype.setSearchOnSchema = function(enableSearchOnSchema)
{
	if (this.m_isSearchOnSchema !== enableSearchOnSchema)
	{
		if (this.isLightweightSearch() || !this.supportsCombinedSearch())
		{
			return;
		}
		this.m_isSearchOnSchema = enableSearchOnSchema;
		this.resetSyncState();
	}
};
oFF.OlapCatalogManager2.prototype.setSearchOnText = function(enableSearchOnText)
{
	if (this.m_isSearchOnText !== enableSearchOnText)
	{
		if (!this.supportsCombinedSearch())
		{
			this.clearSearchFlags();
			this.m_isSearchOnName = !enableSearchOnText;
		}
		this.m_isSearchOnText = enableSearchOnText;
		this.resetSyncState();
	}
};
oFF.OlapCatalogManager2.prototype.setSelectedType = function(type)
{
	this.ensureTypeIsSelectable(type);
	this.m_type = type;
	this.m_types.clear();
	this.m_types.add(type);
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.setTransientInfoProvidersIncluded = function(isIncluded)
{
	this.m_isTransientInfoProvidersIncluded = isIncluded;
};
oFF.OlapCatalogManager2.prototype.setupCatalogManager = function(queryManager)
{
	this.setupAction(null, null, null, queryManager);
	this.m_planQueryFilter = oFF.TriStateBool._DEFAULT;
	this.m_isTransientInfoProvidersIncluded = true;
	this.m_types = oFF.XList.create();
};
oFF.OlapCatalogManager2.prototype.setupFilterComplex = function()
{
	let queryModel = this.getQueryManager().getQueryModel();
	let rootFilterAnd = oFF.QFactory.createFilterAnd(queryModel);
	let selectedTypes = this.getSelectedTypes();
	if (oFF.notNull(selectedTypes) && selectedTypes.hasElements() && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_TYPE) !== null)
	{
		let numberOfMetadataObjectTypes = selectedTypes.size();
		if (numberOfMetadataObjectTypes === 1)
		{
			this.createAndAddFilterOp(selectedTypes.get(0).getCamelCaseName(), rootFilterAnd, oFF.ComparisonOperator.EQUAL, oFF.OlapCatalogManager2.CN_TYPE, oFF.PresentationType.KEY);
		}
		else
		{
			this.createFilterElementsInCartesianList(numberOfMetadataObjectTypes, selectedTypes, rootFilterAnd);
		}
	}
	let textFilter = this.getSearchFilter();
	let mainOrFilter = oFF.QFactory.createFilterOr(rootFilterAnd);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(textFilter))
	{
		if (this.isSearchOnName() && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_OBJECT) !== null)
		{
			this.createAndAddFilterOp(textFilter, mainOrFilter, oFF.ComparisonOperator.MATCH, oFF.OlapCatalogManager2.CN_OBJECT, oFF.PresentationType.KEY);
		}
		if (this.isSearchOnText() && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_OBJECT) !== null)
		{
			this.createAndAddFilterOp(textFilter, mainOrFilter, oFF.ComparisonOperator.MATCH, oFF.OlapCatalogManager2.CN_OBJECT, oFF.PresentationType.TEXT);
		}
		if (this.isSearchOnSchema() && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_SCHEMA) !== null)
		{
			this.createAndAddFilterOp(textFilter, mainOrFilter, oFF.ComparisonOperator.MATCH, oFF.OlapCatalogManager2.CN_SCHEMA, oFF.PresentationType.KEY);
		}
	}
	if (this.isSearchOnPackage() && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_PACKAGE) !== null)
	{
		let mainOrRootFilter;
		if (this.m_withOtherFiltersPackage === oFF.LogicalBoolOperator.OR)
		{
			mainOrRootFilter = mainOrFilter;
		}
		else
		{
			mainOrRootFilter = rootFilterAnd;
		}
		this.createAndAddFilterOp(this.m_packageFilter, mainOrRootFilter, this.determineComparisonOperator(this.m_packageComparisonOperator, this.m_packageFilter), oFF.OlapCatalogManager2.CN_PACKAGE, oFF.PresentationType.KEY);
	}
	this.addFilterToRoot(rootFilterAnd, mainOrFilter);
	let capabilities = queryModel.getModelCapabilities();
	if (capabilities.supportsMetadataDataCategory() && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_categoryFilter) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_DATA_CATEGORY) !== null)
	{
		this.createAndAddFilterOp(this.m_categoryFilter, rootFilterAnd, oFF.ComparisonOperator.MATCH, oFF.OlapCatalogManager2.CN_DATA_CATEGORY, oFF.PresentationType.KEY);
	}
	if (oFF.notNull(this.m_baseDataSourceFilter) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_BASEDATASOURCE) !== null)
	{
		this.createAndAddFilterOp(this.m_baseDataSourceFilter, rootFilterAnd, oFF.ComparisonOperator.MATCH, oFF.OlapCatalogManager2.CN_BASEDATASOURCE, oFF.PresentationType.KEY);
	}
	if (oFF.XCollectionUtils.hasElements(this.m_baseDataSourceFilterList) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_BASEDATASOURCE) !== null)
	{
		let baseDataSourceOperator = oFF.ComparisonOperator.EQUAL;
		for (let i = 0; i < this.m_baseDataSourceFilterList.size(); i++)
		{
			let baseDataSourceElement = this.m_baseDataSourceFilterList.get(i);
			if (oFF.XString.containsString(baseDataSourceElement, "*"))
			{
				baseDataSourceOperator = oFF.ComparisonOperator.MATCH;
				break;
			}
		}
		let baseDataSourceFilterOr = oFF.QFactory.createFilterOr(rootFilterAnd);
		for (let j = 0; j < this.m_baseDataSourceFilterList.size(); j++)
		{
			this.createAndAddFilterOp(this.m_baseDataSourceFilterList.get(j), baseDataSourceFilterOr, baseDataSourceOperator, oFF.OlapCatalogManager2.CN_BASEDATASOURCE, oFF.PresentationType.KEY);
		}
		this.addFilterToRoot(rootFilterAnd, baseDataSourceFilterOr);
	}
	if (oFF.XCollectionUtils.hasElements(this.m_baseDataSourceTypeFilter) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_BASEDATASOURCE_TYPE) !== null)
	{
		let baseDataSourceTypeOrFilter = oFF.QFactory.createFilterOr(rootFilterAnd);
		for (let k = 0; k < this.m_baseDataSourceTypeFilter.size(); k++)
		{
			this.createAndAddFilterOp(oFF.XString.toUpperCase(this.m_baseDataSourceTypeFilter.get(k).getName()), baseDataSourceTypeOrFilter, oFF.ComparisonOperator.EQUAL, null, null);
		}
		this.addFilterToRoot(rootFilterAnd, baseDataSourceTypeOrFilter);
	}
	if (oFF.XCollectionUtils.hasElements(this.m_internalTypeIncludeList) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_INTERNAL_TYPE) !== null)
	{
		let internalTypeIncludeOperator = oFF.ComparisonOperator.EQUAL;
		for (let l = 0; l < this.m_internalTypeIncludeList.size(); l++)
		{
			let internalTypeIncludeElement = this.m_internalTypeIncludeList.get(l);
			if (oFF.XString.containsString(internalTypeIncludeElement, "*"))
			{
				internalTypeIncludeOperator = oFF.ComparisonOperator.MATCH;
				break;
			}
		}
		let internalTypeIncludeFilterOr = oFF.QFactory.createFilterOr(rootFilterAnd);
		for (let m = 0; m < this.m_internalTypeIncludeList.size(); m++)
		{
			this.createAndAddFilterOp(this.m_internalTypeIncludeList.get(m), internalTypeIncludeFilterOr, internalTypeIncludeOperator, oFF.OlapCatalogManager2.CN_INTERNAL_TYPE, oFF.PresentationType.KEY);
		}
		this.addFilterToRoot(rootFilterAnd, internalTypeIncludeFilterOr);
	}
	if (oFF.XCollectionUtils.hasElements(this.m_internalTypeExcludeList) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_INTERNAL_TYPE) !== null)
	{
		let internalTypeExcludeOperator = oFF.ComparisonOperator.NOT_EQUAL;
		for (let n = 0; n < this.m_internalTypeExcludeList.size(); n++)
		{
			let internalTypeExcludeElement = this.m_internalTypeExcludeList.get(n);
			if (oFF.XString.containsString(internalTypeExcludeElement, "*"))
			{
				internalTypeExcludeOperator = oFF.ComparisonOperator.NOT_MATCH;
				break;
			}
		}
		let internalTypeExcludeFilterAnd = oFF.QFactory.createFilterAnd(rootFilterAnd);
		for (let o = 0; o < this.m_internalTypeExcludeList.size(); o++)
		{
			this.createAndAddFilterOp(this.m_internalTypeExcludeList.get(o), internalTypeExcludeFilterAnd, internalTypeExcludeOperator, oFF.OlapCatalogManager2.CN_INTERNAL_TYPE, oFF.PresentationType.KEY);
		}
		this.addFilterToRoot(rootFilterAnd, internalTypeExcludeFilterAnd);
	}
	if (this.m_planQueryFilter !== oFF.TriStateBool._DEFAULT && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_OBJECT_IS_PLANQUERY) !== null)
	{
		if (this.m_planQueryFilter !== oFF.TriStateBool._TRUE)
		{
			this.createAndAddFilterOp("true", rootFilterAnd, oFF.ComparisonOperator.MATCH, oFF.OlapCatalogManager2.CN_OBJECT_IS_PLANQUERY, oFF.PresentationType.KEY);
		}
		else if (this.m_planQueryFilter !== oFF.TriStateBool._FALSE)
		{
			this.createAndAddFilterOp("false", rootFilterAnd, oFF.ComparisonOperator.MATCH, oFF.OlapCatalogManager2.CN_OBJECT_IS_PLANQUERY, oFF.PresentationType.KEY);
		}
	}
	if (rootFilterAnd.hasElements())
	{
		queryModel.getFilter().getDynamicFilter().setComplexRoot(rootFilterAnd);
	}
};
oFF.OlapCatalogManager2.prototype.setupFilterSimple = function()
{
	let queryModel = this.getQueryManager().getQueryModel();
	let convenienceCommands = queryModel.getConvenienceCommands();
	let selectedType = this.getSelectedType();
	if (oFF.notNull(selectedType) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_TYPE) !== null)
	{
		convenienceCommands.addSingleMemberFilterByDimensionName(oFF.OlapCatalogManager2.CN_TYPE, selectedType.getCamelCaseName(), oFF.ComparisonOperator.EQUAL);
	}
	let textFilter = this.getSearchFilter();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(textFilter) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_OBJECT) !== null)
	{
		if (this.isSearchOnName())
		{
			convenienceCommands.addStringFilterByPresentation(oFF.OlapCatalogManager2.CN_OBJECT, oFF.PresentationType.KEY, textFilter, oFF.ComparisonOperator.MATCH);
		}
		else if (this.isSearchOnText())
		{
			convenienceCommands.addStringFilterByPresentation(oFF.OlapCatalogManager2.CN_OBJECT, oFF.PresentationType.TEXT, textFilter, oFF.ComparisonOperator.MATCH);
		}
	}
	let packageFilter = this.getPackageFilter();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(packageFilter) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_PACKAGE) !== null)
	{
		if (this.isSearchOnPackage())
		{
			convenienceCommands.addStringFilterByPresentation(oFF.OlapCatalogManager2.CN_PACKAGE, oFF.PresentationType.KEY, packageFilter, oFF.ComparisonOperator.EQUAL);
		}
	}
	let capabilities = queryModel.getModelCapabilities();
	if (capabilities.supportsMetadataDataCategory() && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_categoryFilter) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_DATA_CATEGORY) !== null)
	{
		convenienceCommands.addStringFilterByPresentation(oFF.OlapCatalogManager2.CN_DATA_CATEGORY, oFF.PresentationType.KEY, this.m_categoryFilter, oFF.ComparisonOperator.MATCH);
	}
	if (queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_BASEDATASOURCE) !== null)
	{
		if (oFF.notNull(this.m_baseDataSourceFilter))
		{
			convenienceCommands.addStringFilterByPresentation(oFF.OlapCatalogManager2.CN_BASEDATASOURCE, oFF.PresentationType.KEY, this.m_baseDataSourceFilter, oFF.ComparisonOperator.MATCH);
		}
	}
	if (oFF.XCollectionUtils.hasElements(this.m_baseDataSourceFilterList) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_BASEDATASOURCE) !== null)
	{
		let baseDataSourceOperator = oFF.ComparisonOperator.EQUAL;
		for (let k = 0; k < this.m_baseDataSourceFilterList.size(); k++)
		{
			let baseDataSourceElement = this.m_baseDataSourceFilterList.get(k);
			if (oFF.XString.containsString(baseDataSourceElement, "*"))
			{
				baseDataSourceOperator = oFF.ComparisonOperator.MATCH;
				break;
			}
		}
		for (let i = 0; i < this.m_baseDataSourceFilterList.size(); i++)
		{
			convenienceCommands.addSingleMemberFilterByDimensionName(oFF.OlapCatalogManager2.CN_BASEDATASOURCE, this.m_baseDataSourceFilterList.get(i), baseDataSourceOperator);
		}
	}
	if (queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_BASEDATASOURCE_TYPE) !== null)
	{
		if (oFF.XCollectionUtils.hasElements(this.m_baseDataSourceTypeFilter))
		{
			let size = this.m_baseDataSourceTypeFilter.size();
			for (let j = 0; j < size; j++)
			{
				convenienceCommands.addStringFilterByPresentation(oFF.OlapCatalogManager2.CN_BASEDATASOURCE_TYPE, oFF.PresentationType.KEY, oFF.XString.toUpperCase(this.m_baseDataSourceTypeFilter.get(j).getName()), oFF.ComparisonOperator.EQUAL);
			}
		}
		if (!this.m_isTransientInfoProvidersIncluded)
		{
			convenienceCommands.addStringFilterByPresentation(oFF.OlapCatalogManager2.CN_BASEDATASOURCE_TYPE, oFF.PresentationType.KEY, "TRPR", oFF.ComparisonOperator.NOT_EQUAL);
		}
	}
	if (this.m_planQueryFilter !== oFF.TriStateBool._DEFAULT && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_OBJECT_IS_PLANQUERY) !== null)
	{
		if (this.m_planQueryFilter !== oFF.TriStateBool._TRUE)
		{
			convenienceCommands.addStringFilterByPresentation(oFF.OlapCatalogManager2.CN_OBJECT_IS_PLANQUERY, oFF.PresentationType.KEY, "true", oFF.ComparisonOperator.MATCH);
		}
		else if (this.m_planQueryFilter !== oFF.TriStateBool._FALSE)
		{
			convenienceCommands.addStringFilterByPresentation(oFF.OlapCatalogManager2.CN_OBJECT_IS_PLANQUERY, oFF.PresentationType.KEY, "false", oFF.ComparisonOperator.MATCH);
		}
	}
};
oFF.OlapCatalogManager2.prototype.supportsCombinedSearch = function()
{
	let systemType = this.getSystemType();
	if (oFF.isNull(systemType))
	{
		return false;
	}
	return systemType.isTypeOf(oFF.SystemType.HANA) || this.isLightweightSearch() || systemType.isTypeOf(oFF.SystemType.VIRTUAL_INA_ODATA);
};

oFF.PlanningCatalogManager = function() {};
oFF.PlanningCatalogManager.prototype = new oFF.QOlapSyncAction();
oFF.PlanningCatalogManager.prototype._ff_c = "PlanningCatalogManager";

oFF.PlanningCatalogManager.CN_BASE_DATA_SOURCE = "BaseDataSource";
oFF.PlanningCatalogManager.CN_OBJECT_NAME = "ObjectName";
oFF.PlanningCatalogManager.CN_PLANNING_FUNCTION_TYPE = "PlanningFunctionType";
oFF.PlanningCatalogManager.CN_PLANNING_TYPE = "PlanningType";
oFF.PlanningCatalogManager.create = function(queryManager)
{
	let object = new oFF.PlanningCatalogManager();
	object.setupCatalogManager(queryManager);
	return object;
};
oFF.PlanningCatalogManager.prototype.m_isSearchOnName = false;
oFF.PlanningCatalogManager.prototype.m_isSearchOnText = false;
oFF.PlanningCatalogManager.prototype.m_searchOnPlanningFunctions = false;
oFF.PlanningCatalogManager.prototype.m_searchOnPlanningSequences = false;
oFF.PlanningCatalogManager.prototype.m_textFilter = null;
oFF.PlanningCatalogManager.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onPlanningCatalogResult(extResult, data, customIdentifier);
};
oFF.PlanningCatalogManager.prototype.getSearchFilter = function()
{
	return this.m_textFilter;
};
oFF.PlanningCatalogManager.prototype.isSearchOnName = function()
{
	return this.m_isSearchOnName;
};
oFF.PlanningCatalogManager.prototype.isSearchOnPlanningFunctions = function()
{
	return this.m_searchOnPlanningFunctions;
};
oFF.PlanningCatalogManager.prototype.isSearchOnPlanningSequences = function()
{
	return this.m_searchOnPlanningSequences;
};
oFF.PlanningCatalogManager.prototype.isSearchOnText = function()
{
	return this.m_isSearchOnText;
};
oFF.PlanningCatalogManager.prototype.onQueryExecuted = function(extResult, resultSetContainer, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		let classicResultSet = resultSetContainer.getClassicResultSet();
		this.setData(oFF.PlanningCatalogResult.create(classicResultSet, this));
	}
	this.endSync();
};
oFF.PlanningCatalogManager.prototype.processGetResult = function(syncType, listener, customIdentifier)
{
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.PlanningCatalogManager.prototype.processSynchronization = function(syncType)
{
	let queryModel = this.getQueryManager().getQueryModel();
	let convenienceCommands = queryModel.getConvenienceCommands();
	convenienceCommands.resetToDefault();
	convenienceCommands.moveDimensionToAxis(oFF.PlanningCatalogManager.CN_OBJECT_NAME, oFF.AxisType.ROWS);
	convenienceCommands.addAllFieldsToResultSet(oFF.PlanningCatalogManager.CN_OBJECT_NAME);
	convenienceCommands.moveDimensionToAxis(oFF.PlanningCatalogManager.CN_BASE_DATA_SOURCE, oFF.AxisType.ROWS);
	convenienceCommands.addAllFieldsToResultSet(oFF.PlanningCatalogManager.CN_BASE_DATA_SOURCE);
	convenienceCommands.moveDimensionToAxis(oFF.PlanningCatalogManager.CN_PLANNING_TYPE, oFF.AxisType.ROWS);
	convenienceCommands.addAllFieldsToResultSet(oFF.PlanningCatalogManager.CN_PLANNING_TYPE);
	convenienceCommands.moveDimensionToAxis(oFF.PlanningCatalogManager.CN_PLANNING_FUNCTION_TYPE, oFF.AxisType.ROWS);
	convenienceCommands.addAllFieldsToResultSet(oFF.PlanningCatalogManager.CN_PLANNING_FUNCTION_TYPE);
	let textFilter = this.getSearchFilter();
	if (oFF.notNull(textFilter) && oFF.XString.size(textFilter) > 0)
	{
		if (this.isSearchOnName())
		{
			convenienceCommands.addStringFilterByPresentation(oFF.PlanningCatalogManager.CN_OBJECT_NAME, oFF.PresentationType.KEY, textFilter, oFF.ComparisonOperator.MATCH);
		}
		if (this.isSearchOnText())
		{
			convenienceCommands.addStringFilterByPresentation(oFF.PlanningCatalogManager.CN_OBJECT_NAME, oFF.PresentationType.TEXT, textFilter, oFF.ComparisonOperator.MATCH);
		}
	}
	convenienceCommands.clearFiltersByDimensionName(oFF.PlanningCatalogManager.CN_PLANNING_TYPE);
	let searchOnCount = 0;
	if (this.isSearchOnPlanningFunctions())
	{
		searchOnCount++;
	}
	if (this.isSearchOnPlanningSequences())
	{
		searchOnCount++;
	}
	if (searchOnCount === 1)
	{
		if (this.isSearchOnPlanningFunctions())
		{
			convenienceCommands.addSingleMemberFilterByDimensionName(oFF.PlanningCatalogManager.CN_PLANNING_TYPE, oFF.PlanningOperationType.T_PLANNING_FUNCTION, oFF.ComparisonOperator.EQUAL);
		}
		if (this.isSearchOnPlanningSequences())
		{
			convenienceCommands.addSingleMemberFilterByDimensionName(oFF.PlanningCatalogManager.CN_PLANNING_TYPE, oFF.PlanningOperationType.T_PLANNING_SEQUENCE, oFF.ComparisonOperator.EQUAL);
		}
	}
	this.getQueryManager().processQueryExecution(syncType, this, null);
	return true;
};
oFF.PlanningCatalogManager.prototype.releaseObjectInternal = function()
{
	this.m_textFilter = null;
	oFF.QOlapSyncAction.prototype.releaseObjectInternal.call( this );
};
oFF.PlanningCatalogManager.prototype.setSearchFilter = function(filter)
{
	this.m_textFilter = filter;
	this.resetSyncState();
};
oFF.PlanningCatalogManager.prototype.setSearchOnName = function(enableSearchOnName)
{
	this.m_isSearchOnName = enableSearchOnName;
	this.m_isSearchOnText = !this.m_isSearchOnName;
	this.resetSyncState();
};
oFF.PlanningCatalogManager.prototype.setSearchOnPlanningFunctions = function(searchOn)
{
	this.m_searchOnPlanningFunctions = searchOn;
};
oFF.PlanningCatalogManager.prototype.setSearchOnPlanningSequences = function(searchOn)
{
	this.m_searchOnPlanningSequences = searchOn;
};
oFF.PlanningCatalogManager.prototype.setSearchOnText = function(enableSearchOnText)
{
	this.m_isSearchOnText = enableSearchOnText;
	this.m_isSearchOnName = !this.m_isSearchOnText;
	this.resetSyncState();
};
oFF.PlanningCatalogManager.prototype.setupCatalogManager = function(queryManager)
{
	this.setupAction(null, null, null, queryManager);
	this.m_isSearchOnText = false;
	this.m_isSearchOnName = false;
	this.m_searchOnPlanningFunctions = true;
	this.m_searchOnPlanningSequences = false;
};

oFF.PlanningModelCatalogManager = function() {};
oFF.PlanningModelCatalogManager.prototype = new oFF.QOlapSyncAction();
oFF.PlanningModelCatalogManager.prototype._ff_c = "PlanningModelCatalogManager";

oFF.PlanningModelCatalogManager.create = function(service)
{
	let object = new oFF.PlanningModelCatalogManager();
	let systemName = service.getServiceConfig().getSystemName();
	object.setupPlanningModelCatalogManager(service.getOlapEnv(), systemName);
	return object;
};
oFF.PlanningModelCatalogManager.prototype.m_systemName = null;
oFF.PlanningModelCatalogManager.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onPlanningModelCatalogResult(extResult, data, customIdentifier);
};
oFF.PlanningModelCatalogManager.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		let catalogResult = new oFF.PlanningModelCatalogResult();
		let rootStructure = response.getRootElement();
		let responseStructure = oFF.PrFactory.createStructureDeepCopy(rootStructure);
		let messageManager = oFF.MessageManager.createMessageManagerExt(this.getSession());
		catalogResult.processResponseStructure(responseStructure, messageManager);
		this.setData(catalogResult);
	}
	this.endSync();
};
oFF.PlanningModelCatalogManager.prototype.processGetResult = function(syncType, listener, customIdentifier)
{
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.PlanningModelCatalogManager.prototype.processSynchronization = function(syncType)
{
	let connection = this.getApplication().getConnectionPool().getConnection(this.m_systemName);
	let systemDescription = connection.getSystemDescription();
	let systemType = systemDescription.getSystemType();
	if (!systemType.isTypeOf(oFF.SystemType.HANA))
	{
		throw oFF.XException.createIllegalStateException("illegal system type");
	}
	let ocpFunction = connection.newRpcFunction(systemType.getInAPath());
	let request = ocpFunction.getRpcRequest();
	let requestStructure = this.serializeToJson();
	request.setRequestStructure(requestStructure);
	ocpFunction.processFunctionExecution(syncType, this, null);
	return true;
};
oFF.PlanningModelCatalogManager.prototype.releaseObjectInternal = function()
{
	let data = this.getData();
	if (oFF.notNull(data))
	{
		oFF.XObjectExt.release(data);
	}
	this.m_systemName = null;
	oFF.QOlapSyncAction.prototype.releaseObjectInternal.call( this );
};
oFF.PlanningModelCatalogManager.prototype.serializeToJson = function()
{
	let request = oFF.PrFactory.createStructure();
	let planningStructure = request.putNewStructure("Planning");
	planningStructure.putString("command", "get_models");
	return request;
};
oFF.PlanningModelCatalogManager.prototype.setupPlanningModelCatalogManager = function(context, systemName)
{
	this.setupAction(null, null, null, context);
	this.m_systemName = systemName;
};

oFF.OlapCatalogItem = function() {};
oFF.OlapCatalogItem.prototype = new oFF.QDataSource();
oFF.OlapCatalogItem.prototype._ff_c = "OlapCatalogItem";

oFF.OlapCatalogItem.createCatalogItem = function()
{
	let metaObjectId = new oFF.OlapCatalogItem();
	metaObjectId.setupDataSource(null);
	metaObjectId.setText(null);
	metaObjectId.setBaseDataSource(null);
	metaObjectId.setPlanQuery(false);
	metaObjectId.setHasMdxFlag(oFF.TriStateBool._DEFAULT);
	return metaObjectId;
};
oFF.OlapCatalogItem.prototype.m_baseDataSource = null;
oFF.OlapCatalogItem.prototype.m_currencyKey = null;
oFF.OlapCatalogItem.prototype.m_currencyTargetKey = null;
oFF.OlapCatalogItem.prototype.m_currencyText = null;
oFF.OlapCatalogItem.prototype.m_currencyTranslationNameKey = null;
oFF.OlapCatalogItem.prototype.m_currencyTranslationNameText = null;
oFF.OlapCatalogItem.prototype.m_dataCategory = null;
oFF.OlapCatalogItem.prototype.m_formulaOperatorKey = null;
oFF.OlapCatalogItem.prototype.m_formulaOperatorNumberOfOperands = 0;
oFF.OlapCatalogItem.prototype.m_formulaOperatorText = null;
oFF.OlapCatalogItem.prototype.m_hasMdxFlag = null;
oFF.OlapCatalogItem.prototype.m_internalType = null;
oFF.OlapCatalogItem.prototype.m_isPlanQuery = false;
oFF.OlapCatalogItem.prototype.m_planningModelName = null;
oFF.OlapCatalogItem.prototype.m_planningModelSchemaName = null;
oFF.OlapCatalogItem.prototype.m_queryAlias = null;
oFF.OlapCatalogItem.prototype.appendDelimiterIfNotEmpty = function(buffer)
{
	if (buffer.length() > 0)
	{
		buffer.append(" | ");
	}
};
oFF.OlapCatalogItem.prototype.getBaseDataSource = function()
{
	return this.m_baseDataSource;
};
oFF.OlapCatalogItem.prototype.getContentConstant = function()
{
	return null;
};
oFF.OlapCatalogItem.prototype.getContentElement = function()
{
	return this;
};
oFF.OlapCatalogItem.prototype.getCurrencyKey = function()
{
	return this.m_currencyKey;
};
oFF.OlapCatalogItem.prototype.getCurrencyTargetKey = function()
{
	return this.m_currencyTargetKey;
};
oFF.OlapCatalogItem.prototype.getCurrencyText = function()
{
	return this.m_currencyText;
};
oFF.OlapCatalogItem.prototype.getCurrencyTranslationNameKey = function()
{
	return this.m_currencyTranslationNameKey;
};
oFF.OlapCatalogItem.prototype.getCurrencyTranslationNameText = function()
{
	return this.m_currencyTranslationNameText;
};
oFF.OlapCatalogItem.prototype.getDataCategory = function()
{
	return this.m_dataCategory;
};
oFF.OlapCatalogItem.prototype.getFormulaOperatorKey = function()
{
	return this.m_formulaOperatorKey;
};
oFF.OlapCatalogItem.prototype.getFormulaOperatorNumberOfOperands = function()
{
	return this.m_formulaOperatorNumberOfOperands;
};
oFF.OlapCatalogItem.prototype.getFormulaOperatorText = function()
{
	return this.m_formulaOperatorText;
};
oFF.OlapCatalogItem.prototype.getInternalType = function()
{
	return this.m_internalType;
};
oFF.OlapCatalogItem.prototype.getPlanningModelDataSource = function()
{
	if (oFF.XStringUtils.isNullOrEmpty(this.m_planningModelName))
	{
		return null;
	}
	let dataSource = oFF.QFactory.createDataSourceWithType(oFF.MetaObjectType.PLANNING_MODEL, this.m_planningModelName);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_planningModelSchemaName))
	{
		dataSource.setSchemaName(this.m_planningModelSchemaName);
	}
	return dataSource;
};
oFF.OlapCatalogItem.prototype.getPlanningModelName = function()
{
	return this.m_planningModelName;
};
oFF.OlapCatalogItem.prototype.getPlanningModelSchemaName = function()
{
	return this.m_planningModelSchemaName;
};
oFF.OlapCatalogItem.prototype.getQueryAlias = function()
{
	return this.m_queryAlias;
};
oFF.OlapCatalogItem.prototype.getTagValue = function(tagName)
{
	return null;
};
oFF.OlapCatalogItem.prototype.hasMdxFlag = function()
{
	return this.m_hasMdxFlag.getBoolean();
};
oFF.OlapCatalogItem.prototype.hasMdxFlagExt = function()
{
	return this.m_hasMdxFlag;
};
oFF.OlapCatalogItem.prototype.isPlanQuery = function()
{
	return this.m_isPlanQuery;
};
oFF.OlapCatalogItem.prototype.releaseObject = function()
{
	this.m_baseDataSource = null;
	this.m_planningModelName = null;
	this.m_planningModelSchemaName = null;
	this.m_dataCategory = null;
	this.m_internalType = null;
	this.m_currencyKey = null;
	this.m_currencyText = null;
	this.m_currencyTranslationNameKey = null;
	this.m_currencyTranslationNameText = null;
	this.m_currencyTargetKey = null;
	this.m_formulaOperatorKey = null;
	this.m_formulaOperatorText = null;
	this.m_queryAlias = null;
	oFF.QDataSource.prototype.releaseObject.call( this );
};
oFF.OlapCatalogItem.prototype.setBaseDataSource = function(baseDataSource)
{
	this.m_baseDataSource = baseDataSource;
};
oFF.OlapCatalogItem.prototype.setCurrencyKey = function(currencyKey)
{
	this.m_currencyKey = currencyKey;
};
oFF.OlapCatalogItem.prototype.setCurrencyTargetKey = function(currencyTargetKey)
{
	this.m_currencyTargetKey = currencyTargetKey;
};
oFF.OlapCatalogItem.prototype.setCurrencyText = function(currencyText)
{
	this.m_currencyText = currencyText;
};
oFF.OlapCatalogItem.prototype.setCurrencyTranslationNameKey = function(currencyTranslationNameKey)
{
	this.m_currencyTranslationNameKey = currencyTranslationNameKey;
};
oFF.OlapCatalogItem.prototype.setCurrencyTranslationNameText = function(currencyTranslationNameText)
{
	this.m_currencyTranslationNameText = currencyTranslationNameText;
};
oFF.OlapCatalogItem.prototype.setDataCategory = function(dataCategory)
{
	this.m_dataCategory = dataCategory;
};
oFF.OlapCatalogItem.prototype.setFormulaOperatorKey = function(formulaOperatorKey)
{
	this.m_formulaOperatorKey = formulaOperatorKey;
};
oFF.OlapCatalogItem.prototype.setFormulaOperatorNumberOfOperands = function(formulaOperatorNumberOfOperands)
{
	this.m_formulaOperatorNumberOfOperands = formulaOperatorNumberOfOperands;
};
oFF.OlapCatalogItem.prototype.setFormulaOperatorText = function(formulaOperatorText)
{
	this.m_formulaOperatorText = formulaOperatorText;
};
oFF.OlapCatalogItem.prototype.setHasMdxFlag = function(hasMdxFlag)
{
	this.m_hasMdxFlag = hasMdxFlag;
};
oFF.OlapCatalogItem.prototype.setInternalType = function(internalType)
{
	this.m_internalType = internalType;
};
oFF.OlapCatalogItem.prototype.setPlanQuery = function(isPlanQuery)
{
	this.m_isPlanQuery = isPlanQuery;
};
oFF.OlapCatalogItem.prototype.setPlanningModelName = function(planningModelName)
{
	this.m_planningModelName = planningModelName;
};
oFF.OlapCatalogItem.prototype.setPlanningModelSchemaName = function(planningModelSchemaName)
{
	this.m_planningModelSchemaName = planningModelSchemaName;
};
oFF.OlapCatalogItem.prototype.setQueryAlias = function(queryAlias)
{
	this.m_queryAlias = queryAlias;
};
oFF.OlapCatalogItem.prototype.toString = function()
{
	let sb = oFF.XStringBuffer.create();
	let fullQualifiedName = this.getFullQualifiedName();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(fullQualifiedName))
	{
		this.appendDelimiterIfNotEmpty(sb);
		sb.append(fullQualifiedName);
	}
	let text = this.getText();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(text))
	{
		if (oFF.XString.isEqual(text, this.getName()))
		{
			sb.append(" - ");
		}
		else
		{
			sb.append(" + ");
		}
		sb.append(text);
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_internalType))
	{
		this.appendDelimiterIfNotEmpty(sb);
		sb.append("Internal Type: ").append(this.m_internalType);
	}
	if (this.m_isPlanQuery)
	{
		this.appendDelimiterIfNotEmpty(sb);
		sb.append("Is Planning Query");
	}
	let planningModelDataSource = this.getPlanningModelDataSource();
	if (oFF.notNull(planningModelDataSource) && oFF.XStringUtils.isNotNullAndNotEmpty(planningModelDataSource.getFullQualifiedName()))
	{
		this.appendDelimiterIfNotEmpty(sb);
		sb.append(planningModelDataSource.getFullQualifiedName());
	}
	if (oFF.notNull(this.m_baseDataSource) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_baseDataSource.getFullQualifiedName()))
	{
		this.appendDelimiterIfNotEmpty(sb);
		sb.append("Base Data Source: ").append(this.m_baseDataSource.getFullQualifiedName());
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_dataCategory))
	{
		this.appendDelimiterIfNotEmpty(sb);
		sb.append("Data Category: ").append(this.m_dataCategory);
	}
	return sb.toString();
};

oFF.OlapCatalogImplModule = function() {};
oFF.OlapCatalogImplModule.prototype = new oFF.DfModule();
oFF.OlapCatalogImplModule.prototype._ff_c = "OlapCatalogImplModule";

oFF.OlapCatalogImplModule.s_module = null;
oFF.OlapCatalogImplModule.getInstance = function()
{
	if (oFF.isNull(oFF.OlapCatalogImplModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.OlapImplModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.OlapCatalogApiModule.getInstance());
		oFF.OlapCatalogImplModule.s_module = oFF.DfModule.startExt(new oFF.OlapCatalogImplModule());
		let registrationService = oFF.RegistrationService.getInstance();
		oFF.PlanningCatalogServiceConfig.staticSetup();
		registrationService.addServiceConfig(oFF.OlapCatalogApiModule.XS_PLANNING_CATALOG, oFF.PlanningCatalogServiceConfig.CLAZZ);
		oFF.PlanningCatalogService.staticSetup();
		registrationService.addService(oFF.OlapCatalogApiModule.XS_PLANNING_CATALOG, oFF.PlanningCatalogService.CLAZZ);
		oFF.PlanningModelCatalogServiceConfig.staticSetup();
		registrationService.addServiceConfig(oFF.OlapCatalogApiModule.XS_PLANNING_MODEL_CATALOG, oFF.PlanningModelCatalogServiceConfig.CLAZZ);
		oFF.PlanningModelCatalogService.staticSetup();
		registrationService.addService(oFF.OlapCatalogApiModule.XS_PLANNING_MODEL_CATALOG, oFF.PlanningModelCatalogService.CLAZZ);
		oFF.OlapCatalogService.staticSetup();
		registrationService.addService(oFF.OlapCatalogApiModule.XS_OLAP_CATALOG, oFF.OlapCatalogService.CLAZZ);
		oFF.DfModule.stopExt(oFF.OlapCatalogImplModule.s_module);
		oFF.ProgramRegistry.setProgramFactory(new oFF.OlapCatalogProgramSubSystem());
	}
	return oFF.OlapCatalogImplModule.s_module;
};
oFF.OlapCatalogImplModule.prototype.getName = function()
{
	return "ff4330.olap.catalog.impl";
};

oFF.OlapCatalogImplModule.getInstance();

return oFF;
} );