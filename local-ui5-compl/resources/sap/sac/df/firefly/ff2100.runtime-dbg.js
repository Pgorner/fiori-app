/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff2010.binding"
],
function(oFF)
{
"use strict";

oFF.ApplicationFactory = {

	createApplication:function(process)
	{
			let action = oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.BLOCKING, null, null, null, process, 0, null, null, null, null, oFF.ApplicationSystemOption.AUTO, false, null, false);
		let data = action.getData();
		oFF.XObjectExt.release(action);
		return data;
	},
	createApplicationExt:function(syncType, listener, customIdentifier, process, xVersion, systemType, systemName, systemUri, systemLandscapeUrl)
	{
			return oFF.ApplicationFactory.createApplicationExt2(syncType, listener, customIdentifier, null, process, xVersion, systemType, systemName, systemUri, systemLandscapeUrl, oFF.ApplicationSystemOption.AUTO, false, null, false);
	},
	createApplicationExt2:function(syncType, listener, customIdentifier, kernel, process, xVersion, systemType, systemName, systemUri, systemLandscapeUrl, systemOption, useKernelBoot, programName, useSingleKernel)
	{
			let result = oFF.ApplicationFactory.createApplicationInitializeAction(syncType);
		result.setProcess(process);
		result.registerListener(listener, customIdentifier);
		result.setXVersion(xVersion);
		result.setSystemType(systemType);
		result.setSystemName(systemName);
		result.setSystemUri(systemUri);
		result.setSystemLandscapeUrl(systemLandscapeUrl);
		result.setSystemOption(systemOption);
		result.setUseKernelBoot(useKernelBoot);
		result.setKernel(kernel);
		result.setUseSingletonKernel(useSingleKernel);
		result.setProgramName(programName);
		result.process();
		return result;
	},
	createApplicationForDragonfly:function(listener)
	{
			let env = oFF.XEnvironment.getInstance();
		env.setVariable(oFF.XEnvironmentConstants.FIREFLY_FEATURE_TOGGLES, "+Olap.AutoVariableSubmitCapability");
		env.setVariable(oFF.XEnvironmentConstants.FIREFLY_FEATURE_TOGGLES, "+Olap.AutoVariableSubmitFunctionality");
		return oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.NON_BLOCKING, listener, null, null, null, oFF.XVersion.MAX, null, null, null, null, oFF.ApplicationSystemOption.PATH, true, oFF.DragonflyAppProgram.DEFAULT_PROGRAM_NAME, false);
	},
	createApplicationForOrca:function(syncType, listener, customIdentifier, kernel, xVersion, systemLandscapeUrl)
	{
			return oFF.ApplicationFactory.createApplicationExt2(syncType, listener, customIdentifier, kernel, null, xVersion, null, null, null, systemLandscapeUrl, oFF.ApplicationSystemOption.PATH, true, oFF.OrcaAppProgram.DEFAULT_PROGRAM_NAME, true);
	},
	createApplicationFull:function(process, xVersion, systemType, systemName, systemUri, systemLandscapeUrl, syncType, listener)
	{
			return oFF.ApplicationFactory.createApplicationExt2(syncType, listener, null, null, process, xVersion, systemType, systemName, systemUri, systemLandscapeUrl, oFF.ApplicationSystemOption.AUTO, false, null, false);
	},
	createApplicationInitializeAction:function(syncType)
	{
			return oFF.ApplicationInitializeAction.create(syncType);
	},
	createApplicationWithDefaultSystem:function(process, systemType, systemName)
	{
			return oFF.ApplicationFactory.createApplicationWithVersionAndDefaultSystem(process, 0, systemType, systemName);
	},
	createApplicationWithLandscapeBlocking:function(process, systemLandscapeUrl)
	{
			return oFF.ApplicationFactory.createApplicationWithVersionAndLandscape(process, 0, systemLandscapeUrl);
	},
	createApplicationWithUri:function(uri)
	{
			return oFF.ApplicationFactory.createApplicationWithUriAndVersion(uri, 0);
	},
	createApplicationWithUriAndVersion:function(uri, xVersion)
	{
			let sysUri = oFF.XUri.createFromUrl(uri);
		let action = oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.BLOCKING, null, null, null, null, xVersion, null, null, sysUri, null, oFF.ApplicationSystemOption.AUTO, false, null, false);
		let data = action.getData();
		oFF.XObjectExt.release(action);
		return data;
	},
	createApplicationWithVersionAndDefaultSystem:function(process, xVersion, systemType, systemName)
	{
			let action = oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.BLOCKING, null, null, null, process, xVersion, systemType, systemName, null, null, oFF.ApplicationSystemOption.LOCATION_AND_TYPE, false, null, false);
		let data = action.getData();
		oFF.XObjectExt.release(action);
		return data;
	},
	createApplicationWithVersionAndKernelBoot:function(xVersion)
	{
			let action = oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.BLOCKING, null, null, null, null, xVersion, null, null, null, null, oFF.ApplicationSystemOption.AUTO, true, null, false);
		let data = action.getData();
		oFF.XObjectExt.release(action);
		return data;
	},
	createApplicationWithVersionAndLandscape:function(process, xVersion, systemLandscapeUrl)
	{
			return oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.BLOCKING, null, null, null, process, xVersion, null, null, null, systemLandscapeUrl, oFF.ApplicationSystemOption.PATH, false, null, false);
	},
	createDefaultApplication:function()
	{
			return oFF.ApplicationFactory.createDefaultApplicationWithVersion(0);
	},
	createDefaultApplicationWithVersion:function(xVersion)
	{
			let action = oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.BLOCKING, null, null, null, null, xVersion, null, null, null, null, oFF.ApplicationSystemOption.AUTO, false, null, false);
		let data = action.getData();
		oFF.XObjectExt.release(action);
		return data;
	}
};

oFF.QInAClientInfo = {

	exportClientInfo:function(inaStructure, clientInfoContext, supportsClientInfo)
	{
			let clientInfo = clientInfoContext.getClientInfo();
		if (oFF.notNull(inaStructure))
		{
			let storyId = clientInfo.getStoryId();
			let storyName = clientInfo.getStoryName();
			let languageLocale = clientInfo.getLanguageLocale();
			let widgetId = clientInfo.getWidgetId();
			let modelId = clientInfo.getSacModelId();
			let insightId = clientInfo.getInsightId();
			let hasClientContext = oFF.XStringUtils.isNotNullAndNotEmpty(insightId) || oFF.XStringUtils.isNotNullAndNotEmpty(storyId) || oFF.XStringUtils.isNotNullAndNotEmpty(storyName) || oFF.XStringUtils.isNotNullAndNotEmpty(languageLocale) || oFF.XStringUtils.isNotNullAndNotEmpty(widgetId);
			if (!supportsClientInfo && !hasClientContext)
			{
				return;
			}
			let clientIdentifier = clientInfo.getClientIdentifier();
			if (clientInfo.getSession().hasFeature(oFF.FeatureToggleOlap.CLIENT_INFO_METADATA) && oFF.XStringUtils.isNullOrEmpty(clientIdentifier) && !hasClientContext)
			{
				return;
			}
			let inaClientInfo = oFF.PrFactory.createStructure();
			if (supportsClientInfo)
			{
				inaClientInfo.putStringNotNull(oFF.InAConstantsBios.QY_CI_CLIENT_VERSION, clientInfo.getClientVersion());
				inaClientInfo.putStringNotNull(oFF.InAConstantsBios.QY_CI_CLIENT_IDENTIFIER, clientIdentifier);
				inaClientInfo.putStringNotNull(oFF.InAConstantsBios.QY_CI_CLIENT_COMPONENT, clientInfo.getClientComponent());
			}
			let widgetIds = oFF.XList.create();
			let modelIds = oFF.XList.create();
			if (hasClientContext)
			{
				let inaClientContext = inaClientInfo.putNewStructure(oFF.InAConstantsBios.QY_CI_CLIENT_CONTEXT);
				if (oFF.XStringUtils.isNotNullAndNotEmpty(insightId))
				{
					inaClientContext.putString(oFF.InAConstantsBios.QY_CI_STORY_ID, oFF.XStringUtils.concatenate2("InsightId=", insightId));
					widgetId = "Insight";
					storyName = null;
				}
				else
				{
					inaClientContext.putStringNotNull(oFF.InAConstantsBios.QY_CI_STORY_ID, storyId);
				}
				inaClientContext.putStringNotNull(oFF.InAConstantsBios.QY_CI_STORY_NAME, storyName);
				inaClientContext.putStringNotNull(oFF.InAConstantsBios.QY_CI_LANGUAGE_LOCALE, languageLocale);
				if (oFF.XStringUtils.isNotNullAndNotEmpty(widgetId) || oFF.XStringUtils.isNotNullAndNotEmpty(modelId))
				{
					let widgetIdString = widgetId;
					if (oFF.XStringUtils.isNotNullAndNotEmpty(modelId))
					{
						widgetIdString = "";
						if (oFF.XStringUtils.isNotNullAndNotEmpty(widgetId))
						{
							widgetIdString = oFF.XStringUtils.concatenate3("WidgetId=", widgetId, ";");
						}
						widgetIdString = oFF.XStringUtils.concatenate3(widgetIdString, "ModelId=", modelId);
					}
					widgetIds.add(widgetIdString);
				}
			}
			if (inaClientInfo.hasElements())
			{
				inaStructure.put(oFF.InAConstantsBios.QY_CI_CLIENT_INFO, inaClientInfo);
			}
			if (!clientInfo.getSession().hasFeature(oFF.FeatureToggleOlap.PRESERVE_CLIENTINFO_IN_BATCH))
			{
				let inaBatch = inaStructure.getListByKey(oFF.ConnectionConstants.INA_BATCH);
				if (oFF.notNull(inaBatch))
				{
					let size = inaBatch.size();
					for (let i = 0; i < size; i++)
					{
						let inaSubRequest = inaBatch.getStructureAt(i);
						let inaSubClientInfo = inaSubRequest.getStructureByKey(oFF.InAConstantsBios.QY_CI_CLIENT_INFO);
						inaSubRequest.remove(oFF.InAConstantsBios.QY_CI_CLIENT_INFO);
						if (oFF.isNull(inaSubClientInfo))
						{
							continue;
						}
						let inaSubClientContext = inaSubClientInfo.getStructureByKey(oFF.InAConstantsBios.QY_CI_CLIENT_CONTEXT);
						if (oFF.isNull(inaSubClientContext))
						{
							continue;
						}
						let inaSubWidgetIds = inaSubClientContext.getListByKey(oFF.InAConstantsBios.QY_CI_WIDGET_ID);
						if (oFF.notNull(inaSubWidgetIds))
						{
							widgetIds.add(inaSubWidgetIds.getStringAt(0));
						}
						let inaSubModelIds = inaSubClientContext.getListByKey(oFF.InAConstantsBios.QY_CI_SAC_MODEL_ID);
						if (oFF.notNull(inaSubModelIds))
						{
							modelIds.add(inaSubModelIds.getStringAt(0));
						}
					}
				}
			}
			if (widgetIds.hasElements())
			{
				let inaWidgetIds = inaClientInfo.getStructureByKey(oFF.InAConstantsBios.QY_CI_CLIENT_CONTEXT).putNewList(oFF.InAConstantsBios.QY_CI_WIDGET_ID);
				inaWidgetIds.addAllStrings(widgetIds);
			}
			if (modelIds.hasElements())
			{
				let inaModelIds = inaClientInfo.getStructureByKey(oFF.InAConstantsBios.QY_CI_CLIENT_CONTEXT).putNewList(oFF.InAConstantsBios.QY_CI_SAC_MODEL_ID);
				inaModelIds.addAllStrings(modelIds);
			}
		}
	},
	exportFlexibleClientInfo:function(request, clientInfoContext)
	{
			let clientInfo = clientInfoContext.getClientInfo();
		let clientInfoStructure = oFF.PrFactory.createStructure();
		clientInfoStructure.putStringNotNull(oFF.InAConstantsBios.QY_CI_CLIENT_VERSION, clientInfo.getClientVersion());
		clientInfoStructure.putStringNotNull(oFF.InAConstantsBios.QY_CI_CLIENT_IDENTIFIER, clientInfo.getClientIdentifier());
		clientInfoStructure.putStringNotNull(oFF.InAConstantsBios.QY_CI_CLIENT_COMPONENT, clientInfo.getClientComponent());
		let contextId = null;
		let clientContextStructure = oFF.PrFactory.createStructure();
		let insightId = clientInfo.getInsightId();
		if (oFF.notNull(insightId))
		{
			contextId = insightId;
			clientContextStructure.putStringNotNull(oFF.InAConstantsBios.QY_CI_INSIGHT_ID, insightId);
		}
		else
		{
			let storyId = clientInfo.getStoryId();
			if (oFF.notNull(storyId))
			{
				contextId = storyId;
				clientContextStructure.putStringNotNull(oFF.InAConstantsBios.QY_CI_STORY_ID, storyId);
				clientContextStructure.putStringNotNull(oFF.InAConstantsBios.QY_CI_STORY_NAME, clientInfo.getStoryName());
				clientContextStructure.putStringNotNull(oFF.InAConstantsBios.QY_CI_WIDGET_ID, clientInfo.getWidgetId());
			}
		}
		clientContextStructure.putStringNotNull(oFF.InAConstantsBios.QY_CI_SAC_MODEL_ID, clientInfo.getSacModelId());
		let excelWorkbook = clientInfo.getExcelWorkbook();
		if (oFF.notNull(excelWorkbook))
		{
			contextId = excelWorkbook;
			clientContextStructure.putStringNotNull(oFF.InAConstantsBios.QY_CI_EXCEl_WORKBOOK, excelWorkbook);
			clientContextStructure.putStringNotNull(oFF.InAConstantsBios.QY_CI_EXCEL_TABLE, clientInfo.getExcelTable());
			clientContextStructure.putStringNotNull(oFF.InAConstantsBios.QY_CI_EXCEL_FORMULA, clientInfo.getExcelFormula());
		}
		if (oFF.notNull(contextId))
		{
			clientInfoStructure.putStringNotNull(oFF.InAConstantsBios.QY_CI_CLIENT_CONTEXT_ID, contextId);
			clientInfoStructure.put(oFF.InAConstantsBios.QY_CI_CLIENT_CONTEXT, clientContextStructure);
		}
		if (clientInfoStructure.hasElements())
		{
			request.put(oFF.InAConstantsBios.QY_CI_CLIENT_INFO, clientInfoStructure);
		}
	}
};

oFF.BasicInAQuery = function() {};
oFF.BasicInAQuery.prototype = new oFF.XObject();
oFF.BasicInAQuery.prototype._ff_c = "BasicInAQuery";

oFF.BasicInAQuery.prototype.m_connectionContainer = null;
oFF.BasicInAQuery.prototype.m_dimensionsUsedInFilter = null;
oFF.BasicInAQuery.prototype.m_drillDownDimensionNames = null;
oFF.BasicInAQuery.prototype.m_drillDownDimensions = null;
oFF.BasicInAQuery.prototype.m_filter = null;
oFF.BasicInAQuery.prototype.m_groupSignature = null;
oFF.BasicInAQuery.prototype.m_inaElementHashMap = null;
oFF.BasicInAQuery.prototype.m_instanceId = null;
oFF.BasicInAQuery.prototype.m_isInARuntimeDataProvider = false;
oFF.BasicInAQuery.prototype.m_isStandAloneQuery = false;
oFF.BasicInAQuery.prototype.m_measureDimension = null;
oFF.BasicInAQuery.prototype.m_measureDimensionAxisType = null;
oFF.BasicInAQuery.prototype.m_measureDimensionName = null;
oFF.BasicInAQuery.prototype.m_preQueryName = null;
oFF.BasicInAQuery.prototype.m_queryDataCells = null;
oFF.BasicInAQuery.prototype.m_rpcFunction = null;
oFF.BasicInAQuery.prototype.m_secondaryStructureName = null;
oFF.BasicInAQuery.prototype.m_state = null;
oFF.BasicInAQuery.prototype.m_systemType = null;
oFF.BasicInAQuery.prototype.addInaElementSignature = function(elementPath, hashValue)
{
	this.m_inaElementHashMap.put(elementPath, hashValue);
};
oFF.BasicInAQuery.prototype.calculateGroupSignature = function()
{
	let sb = oFF.XStringBuffer.create();
	let signatureValues = oFF.XCollectionUtils.getStringMapValuesSorted(this.m_inaElementHashMap);
	let elementSize = signatureValues.size();
	for (let i = 0; i < elementSize; i++)
	{
		let signatureValue = signatureValues.get(i);
		sb.append(signatureValue);
	}
	this.m_groupSignature = oFF.XSha1.createSHA1(sb.toString());
};
oFF.BasicInAQuery.prototype.getConnectionContainer = function()
{
	return this.m_connectionContainer;
};
oFF.BasicInAQuery.prototype.getDimensionNamesUsedInFilter = function()
{
	return this.m_dimensionsUsedInFilter;
};
oFF.BasicInAQuery.prototype.getDrillDownDimensionNames = function()
{
	return this.m_drillDownDimensionNames;
};
oFF.BasicInAQuery.prototype.getDrillDownDimensions = function()
{
	return this.m_drillDownDimensions;
};
oFF.BasicInAQuery.prototype.getFilter = function()
{
	return this.m_filter;
};
oFF.BasicInAQuery.prototype.getGroupSignature = function()
{
	return this.m_groupSignature;
};
oFF.BasicInAQuery.prototype.getInaElementSignature = function(elementPath)
{
	return this.m_inaElementHashMap.getByKey(elementPath);
};
oFF.BasicInAQuery.prototype.getInstanceId = function()
{
	return this.m_instanceId;
};
oFF.BasicInAQuery.prototype.getMeasureDimension = function()
{
	return this.m_measureDimension;
};
oFF.BasicInAQuery.prototype.getMeasureDimensionAxis = function()
{
	return this.m_measureDimensionAxisType;
};
oFF.BasicInAQuery.prototype.getMeasureDimensionName = function()
{
	return this.m_measureDimensionName;
};
oFF.BasicInAQuery.prototype.getPreQueryName = function()
{
	return this.m_preQueryName;
};
oFF.BasicInAQuery.prototype.getQueryDataCells = function()
{
	return this.m_queryDataCells;
};
oFF.BasicInAQuery.prototype.getRequestStructure = function()
{
	let requestStructure = null;
	let rpcRequest = this.m_rpcFunction.getRpcRequest();
	if (oFF.notNull(rpcRequest))
	{
		requestStructure = rpcRequest.getRequestStructure();
	}
	return requestStructure;
};
oFF.BasicInAQuery.prototype.getRpcFunction = function()
{
	return this.m_rpcFunction;
};
oFF.BasicInAQuery.prototype.getSecondaryStructureName = function()
{
	return this.m_secondaryStructureName;
};
oFF.BasicInAQuery.prototype.getSystemName = function()
{
	return this.m_connectionContainer.getSystemName();
};
oFF.BasicInAQuery.prototype.getSystemType = function()
{
	return this.m_systemType;
};
oFF.BasicInAQuery.prototype.isInARuntimeDataProvider = function()
{
	return this.m_isInARuntimeDataProvider;
};
oFF.BasicInAQuery.prototype.isInitState = function()
{
	return oFF.XString.isEqual(this.m_state, oFF.InAQueryMergeConstants.QUERY_STATE_INIT);
};
oFF.BasicInAQuery.prototype.isMergeChecked = function()
{
	return oFF.XString.isEqual(this.m_state, oFF.InAQueryMergeConstants.QUERY_STATE_MERGE_CHECKED);
};
oFF.BasicInAQuery.prototype.isPendingProcessing = function()
{
	return oFF.XString.isEqual(this.m_state, oFF.InAQueryMergeConstants.QUERY_STATE_PENDING_PROCESSING);
};
oFF.BasicInAQuery.prototype.isStandAloneQuery = function()
{
	return this.m_isStandAloneQuery;
};
oFF.BasicInAQuery.prototype.releaseObject = function()
{
	this.m_instanceId = null;
	this.m_rpcFunction = null;
	this.m_connectionContainer = null;
	this.m_systemType = null;
	this.m_state = null;
	this.m_inaElementHashMap = oFF.XObjectExt.release(this.m_inaElementHashMap);
	this.m_drillDownDimensions = oFF.XObjectExt.release(this.m_drillDownDimensions);
	this.m_drillDownDimensionNames = oFF.XObjectExt.release(this.m_drillDownDimensionNames);
	this.m_dimensionsUsedInFilter = oFF.XObjectExt.release(this.m_dimensionsUsedInFilter);
	this.m_measureDimensionName = null;
	this.m_measureDimensionAxisType = null;
	this.m_measureDimension = oFF.XObjectExt.release(this.m_measureDimension);
	this.m_secondaryStructureName = null;
	this.m_filter = oFF.XObjectExt.release(this.m_filter);
	this.m_queryDataCells = oFF.XObjectExt.release(this.m_queryDataCells);
	this.m_preQueryName = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.BasicInAQuery.prototype.setDimensionNamesUsedInFilter = function(dimensionsUsedInFilter)
{
	this.m_dimensionsUsedInFilter = dimensionsUsedInFilter;
};
oFF.BasicInAQuery.prototype.setDrillDownDimensionNames = function(drillDownDimensionNames)
{
	this.m_drillDownDimensionNames = drillDownDimensionNames;
};
oFF.BasicInAQuery.prototype.setDrillDownDimensions = function(drillDownDimensions)
{
	this.m_drillDownDimensions = drillDownDimensions;
};
oFF.BasicInAQuery.prototype.setFilter = function(filter)
{
	this.m_filter = filter;
};
oFF.BasicInAQuery.prototype.setGroupSignature = function(groupSignature)
{
	this.m_groupSignature = groupSignature;
};
oFF.BasicInAQuery.prototype.setIsInARuntimeDataProvider = function(isInARuntimeDataProvider)
{
	this.m_isInARuntimeDataProvider = isInARuntimeDataProvider;
};
oFF.BasicInAQuery.prototype.setIsStandAloneQuery = function(isStandAloneQuery)
{
	this.m_isStandAloneQuery = isStandAloneQuery;
	if (isStandAloneQuery)
	{
		this.setQueryState(oFF.InAQueryMergeConstants.QUERY_STATE_MERGE_CHECKED);
	}
};
oFF.BasicInAQuery.prototype.setMeasureDimension = function(measureDimension)
{
	this.m_measureDimension = measureDimension;
};
oFF.BasicInAQuery.prototype.setMeasureDimensionAxis = function(axisType)
{
	this.m_measureDimensionAxisType = axisType;
};
oFF.BasicInAQuery.prototype.setMeasureDimensionName = function(measureDimensionName)
{
	this.m_measureDimensionName = measureDimensionName;
};
oFF.BasicInAQuery.prototype.setPreQueryName = function(preQueryName)
{
	this.m_preQueryName = preQueryName;
};
oFF.BasicInAQuery.prototype.setQueryDataCells = function(queryDataCells)
{
	this.m_queryDataCells = queryDataCells;
};
oFF.BasicInAQuery.prototype.setQueryState = function(queryState)
{
	this.m_state = queryState;
};
oFF.BasicInAQuery.prototype.setRpcFunction = function(rpcFunction)
{
	this.m_rpcFunction = rpcFunction;
};
oFF.BasicInAQuery.prototype.setSecondaryStructureName = function(secondaryStructureName)
{
	this.m_secondaryStructureName = secondaryStructureName;
};
oFF.BasicInAQuery.prototype.setupBasicInAQuery = function(instanceId, rpcFunction, connectionContainer, systemType)
{
	this.m_instanceId = instanceId;
	this.m_rpcFunction = rpcFunction;
	this.m_connectionContainer = connectionContainer;
	this.m_systemType = systemType;
	this.m_state = oFF.InAQueryMergeConstants.QUERY_STATE_INIT;
	this.m_isStandAloneQuery = false;
	this.m_isInARuntimeDataProvider = false;
	this.m_inaElementHashMap = oFF.XHashMapByString.create();
};

oFF.InAMergeRegistry = function() {};
oFF.InAMergeRegistry.prototype = new oFF.XObject();
oFF.InAMergeRegistry.prototype._ff_c = "InAMergeRegistry";

oFF.InAMergeRegistry.create = function()
{
	let inaMergeRegistry = new oFF.InAMergeRegistry();
	inaMergeRegistry.setupInAMergeRegistry();
	return inaMergeRegistry;
};
oFF.InAMergeRegistry.prototype.m_dimensionKeyFieldMap = null;
oFF.InAMergeRegistry.prototype.m_fieldDimensionMap = null;
oFF.InAMergeRegistry.prototype.m_inaDataProviderList = null;
oFF.InAMergeRegistry.prototype.m_inaDataProviderRepo = null;
oFF.InAMergeRegistry.prototype.m_inaSourceQueryList = null;
oFF.InAMergeRegistry.prototype.m_inaSourceQueryRepo = null;
oFF.InAMergeRegistry.prototype.m_membersMetadataRepo = null;
oFF.InAMergeRegistry.prototype.m_modelMetadataRepo = null;
oFF.InAMergeRegistry.prototype.m_signatureSourceQueryMap = null;
oFF.InAMergeRegistry.prototype.addToGroup = function(groupSignature, instanceId)
{
	let groupQueries = null;
	if (!this.m_signatureSourceQueryMap.containsKey(groupSignature))
	{
		groupQueries = oFF.XList.create();
		groupQueries.add(instanceId);
		this.m_signatureSourceQueryMap.put(groupSignature, groupQueries);
	}
	else
	{
		groupQueries = this.m_signatureSourceQueryMap.getByKey(groupSignature);
		groupQueries.add(instanceId);
	}
};
oFF.InAMergeRegistry.prototype.clearMetadataRepo = function()
{
	this.m_modelMetadataRepo.clear();
	this.m_membersMetadataRepo.clear();
	this.m_dimensionKeyFieldMap.clear();
	this.m_fieldDimensionMap.clear();
};
oFF.InAMergeRegistry.prototype.getAllMainQueryInADataProviders = function()
{
	let mainQueryInADataProviders = oFF.XList.create();
	let inADataProviders = this.m_inaDataProviderRepo.getValuesAsReadOnlyList();
	oFF.XStream.of(inADataProviders).forEach((basicInAQuery) => {
		let inaDataProvider = basicInAQuery;
		if (inaDataProvider.isMainQuery())
		{
			mainQueryInADataProviders.add(inaDataProvider);
		}
	});
	return mainQueryInADataProviders;
};
oFF.InAMergeRegistry.prototype.getDependentQueryInADataProviders = function(preQueryName)
{
	let mainQueryInADataProviders = oFF.XList.create();
	let inADataProviders = this.m_inaDataProviderRepo.getValuesAsReadOnlyList();
	oFF.XStream.of(inADataProviders).forEach((basicInAQuery) => {
		let inaDataProvider = basicInAQuery;
		let preQueries = inaDataProvider.getPreQueries();
		if (preQueries.contains(preQueryName))
		{
			mainQueryInADataProviders.add(inaDataProvider);
		}
	});
	return mainQueryInADataProviders;
};
oFF.InAMergeRegistry.prototype.getDimensionNameOfField = function(fieldName)
{
	return this.m_fieldDimensionMap.getByKey(fieldName);
};
oFF.InAMergeRegistry.prototype.getGroupSignatures = function()
{
	return this.m_signatureSourceQueryMap.getKeysAsReadOnlyList();
};
oFF.InAMergeRegistry.prototype.getInADataProvider = function(instanceId)
{
	return this.m_inaDataProviderRepo.getByKey(instanceId);
};
oFF.InAMergeRegistry.prototype.getInADataProviders = function()
{
	return this.m_inaDataProviderList.getValuesAsReadOnlyList();
};
oFF.InAMergeRegistry.prototype.getInASourceQuery = function(instanceId)
{
	return this.m_inaSourceQueryRepo.getByKey(instanceId);
};
oFF.InAMergeRegistry.prototype.getKeyFieldOfDimension = function(dimensionName)
{
	return this.m_dimensionKeyFieldMap.getByKey(dimensionName);
};
oFF.InAMergeRegistry.prototype.getMembersMetadata = function(measureDimensionName)
{
	return this.m_membersMetadataRepo.getByKey(measureDimensionName);
};
oFF.InAMergeRegistry.prototype.getMergeableSourceQueries = function()
{
	let inaSourceQueryForMerge = oFF.XList.create();
	for (let i = 0; i < this.m_inaSourceQueryList.size(); i++)
	{
		let sortedSourceId = this.m_inaSourceQueryList.get(i);
		let inaSourceQuery = this.getInASourceQuery(sortedSourceId);
		if (!inaSourceQuery.isStandAloneQuery() && inaSourceQuery.isInitState())
		{
			inaSourceQueryForMerge.add(inaSourceQuery);
		}
	}
	return inaSourceQueryForMerge;
};
oFF.InAMergeRegistry.prototype.getModelMetadata = function(datasourceName)
{
	return this.m_modelMetadataRepo.getByKey(datasourceName);
};
oFF.InAMergeRegistry.prototype.getPreQueryInADataProviderByName = function(preQueryName)
{
	let inADataProviders = this.m_inaDataProviderRepo.getValuesAsReadOnlyList();
	for (let i = 0; i < inADataProviders.size(); i++)
	{
		let inaDataProvider = inADataProviders.get(i);
		if (inaDataProvider.isPreQuery() && oFF.XString.isEqual(inaDataProvider.getPreQueryName(), preQueryName))
		{
			return inaDataProvider;
		}
	}
	return null;
};
oFF.InAMergeRegistry.prototype.getPreQuerySourceByName = function(preQueryName)
{
	let sourceQueries = this.m_inaSourceQueryRepo.getValuesAsReadOnlyList();
	for (let i = 0; i < sourceQueries.size(); i++)
	{
		let sourceQuery = sourceQueries.get(i);
		if (oFF.XString.isEqual(sourceQuery.getPreQueryName(), preQueryName))
		{
			return sourceQuery;
		}
	}
	return null;
};
oFF.InAMergeRegistry.prototype.getSourceIDsBySignature = function(groupSignature)
{
	return this.m_signatureSourceQueryMap.getByKey(groupSignature);
};
oFF.InAMergeRegistry.prototype.groupSourceQueries = function(inaSourceQueries)
{
	this.m_signatureSourceQueryMap.clear();
	for (let i = 0; i < inaSourceQueries.size(); i++)
	{
		let inaSourceQuery = inaSourceQueries.get(i);
		let groupSignature = inaSourceQuery.getGroupSignature();
		let instanceId = inaSourceQuery.getInstanceId();
		if (!inaSourceQuery.isStandAloneQuery() && inaSourceQuery.isInitState())
		{
			this.addToGroup(groupSignature, instanceId);
		}
	}
};
oFF.InAMergeRegistry.prototype.hasMeasureMembersMetadata = function(measureDimensionName)
{
	return this.m_membersMetadataRepo.containsKey(measureDimensionName);
};
oFF.InAMergeRegistry.prototype.hasModelMetadata = function(datasourceName)
{
	return this.m_modelMetadataRepo.containsKey(datasourceName);
};
oFF.InAMergeRegistry.prototype.hasSourceQueries = function()
{
	return this.m_inaSourceQueryRepo.hasElements();
};
oFF.InAMergeRegistry.prototype.registerInADataProvider = function(instanceId, inaDataProvider)
{
	this.m_inaDataProviderRepo.put(instanceId, inaDataProvider);
	if (!this.m_inaDataProviderList.contains(instanceId))
	{
		this.m_inaDataProviderList.add(instanceId);
	}
};
oFF.InAMergeRegistry.prototype.registerInASourceQuery = function(instanceId, inaSourceQuery)
{
	this.m_inaSourceQueryRepo.put(instanceId, inaSourceQuery);
	if (!this.m_inaSourceQueryList.contains(instanceId))
	{
		this.m_inaSourceQueryList.add(instanceId);
	}
};
oFF.InAMergeRegistry.prototype.registerKeyFieldForDimension = function(dimensionName, dimensionMetadata)
{
	if (oFF.notNull(dimensionMetadata) && oFF.XStringUtils.isNotNullAndNotEmpty(dimensionName) && !this.m_dimensionKeyFieldMap.containsKey(dimensionName))
	{
		let keyFieldName = dimensionMetadata.getStringByKey(oFF.InAQueryMergeConstants.QY_KEY_ATTRIBUTE);
		if (oFF.XStringUtils.isNullOrEmpty(keyFieldName))
		{
			keyFieldName = dimensionMetadata.getStringByKey(oFF.InAQueryMergeConstants.QY_DEFAULT_KEY_ATTRIBUTE);
		}
		if (oFF.XStringUtils.isNullOrEmpty(keyFieldName))
		{
			let attributes = dimensionMetadata.getListByKey(oFF.InAQueryMergeConstants.QY_ATTRIBUTES);
			for (let i = 0; i < attributes.size(); i++)
			{
				let attribute = attributes.getStructureAt(i);
				let presentationType = attribute.getStringByKey(oFF.InAQueryMergeConstants.QY_PRESENTATION_TYPE);
				if (oFF.XString.isEqual(presentationType, oFF.InAQueryMergeConstants.QY_KEY))
				{
					keyFieldName = attribute.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
					break;
				}
			}
		}
		this.m_dimensionKeyFieldMap.put(dimensionName, keyFieldName);
		if (!this.m_fieldDimensionMap.containsKey(keyFieldName))
		{
			this.m_fieldDimensionMap.put(keyFieldName, dimensionName);
		}
	}
};
oFF.InAMergeRegistry.prototype.registerMembersMetadata = function(measureDimensionName, measureMetadata)
{
	if (oFF.notNull(measureMetadata) && oFF.XStringUtils.isNotNullAndNotEmpty(measureDimensionName) && !this.m_membersMetadataRepo.containsKey(measureDimensionName))
	{
		let membersMetadata = measureMetadata.getListByKey(oFF.InAQueryMergeConstants.QY_MEMBERS);
		if (!oFF.PrUtils.isListEmpty(membersMetadata))
		{
			this.m_membersMetadataRepo.put(measureDimensionName, membersMetadata);
		}
	}
};
oFF.InAMergeRegistry.prototype.registerModelMetadata = function(datasourceName, modelMetadata)
{
	if (oFF.notNull(modelMetadata) && oFF.XStringUtils.isNotNullAndNotEmpty(datasourceName) && !this.m_modelMetadataRepo.containsKey(datasourceName))
	{
		this.m_modelMetadataRepo.put(datasourceName, modelMetadata);
	}
};
oFF.InAMergeRegistry.prototype.releaseObject = function()
{
	this.m_inaSourceQueryList = oFF.XObjectExt.release(this.m_inaSourceQueryList);
	this.m_inaSourceQueryRepo = oFF.XObjectExt.release(this.m_inaSourceQueryRepo);
	this.m_inaDataProviderList = oFF.XObjectExt.release(this.m_inaDataProviderList);
	this.m_inaDataProviderRepo = oFF.XObjectExt.release(this.m_inaDataProviderRepo);
	this.m_signatureSourceQueryMap = oFF.XObjectExt.release(this.m_signatureSourceQueryMap);
	this.m_modelMetadataRepo = oFF.XObjectExt.release(this.m_modelMetadataRepo);
	this.m_membersMetadataRepo = oFF.XObjectExt.release(this.m_membersMetadataRepo);
	this.m_dimensionKeyFieldMap = oFF.XObjectExt.release(this.m_dimensionKeyFieldMap);
	this.m_fieldDimensionMap = oFF.XObjectExt.release(this.m_fieldDimensionMap);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.InAMergeRegistry.prototype.setupInAMergeRegistry = function()
{
	this.m_inaSourceQueryList = oFF.XList.create();
	this.m_inaSourceQueryRepo = oFF.XHashMapByString.create();
	this.m_inaDataProviderList = oFF.XList.create();
	this.m_inaDataProviderRepo = oFF.XHashMapByString.create();
	this.m_signatureSourceQueryMap = oFF.XLinkedHashMapByString.create();
	this.m_modelMetadataRepo = oFF.XHashMapByString.create();
	this.m_membersMetadataRepo = oFF.XHashMapByString.create();
	this.m_dimensionKeyFieldMap = oFF.XHashMapByString.create();
	this.m_fieldDimensionMap = oFF.XHashMapByString.create();
};
oFF.InAMergeRegistry.prototype.unregisterInADataProvider = function(groupSignature, instanceId)
{
	this.m_inaDataProviderRepo.remove(instanceId);
	this.m_inaDataProviderList.removeElement(instanceId);
	this.m_signatureSourceQueryMap.remove(groupSignature);
	if (!this.hasSourceQueries())
	{
		this.clearMetadataRepo();
	}
};
oFF.InAMergeRegistry.prototype.unregisterInASourceQuery = function(instanceId)
{
	this.m_inaSourceQueryRepo.remove(instanceId);
	this.m_inaSourceQueryList.removeElement(instanceId);
};

oFF.InAMergeRegistryManager = function() {};
oFF.InAMergeRegistryManager.prototype = new oFF.XObject();
oFF.InAMergeRegistryManager.prototype._ff_c = "InAMergeRegistryManager";

oFF.InAMergeRegistryManager.create = function()
{
	let inaMergeRegistryManager = new oFF.InAMergeRegistryManager();
	inaMergeRegistryManager.setupInAMergeRegistry();
	return inaMergeRegistryManager;
};
oFF.InAMergeRegistryManager.prototype.m_elementsPathForMergeBreakers = null;
oFF.InAMergeRegistryManager.prototype.m_inaMergeRegistry = null;
oFF.InAMergeRegistryManager.prototype.m_inaSortingSerializer = null;
oFF.InAMergeRegistryManager.prototype.buildInASourceQueryAndRegister = function(instanceId, rpcFunction, connectionContainer, systemType, datasourceName, modelMetadata, measureDimensionMetadata)
{
	let inaSourceQuery = null;
	if (oFF.notNull(rpcFunction) && oFF.notNull(connectionContainer))
	{
		let sourceRequestStructure = this.getValidInARequest(rpcFunction);
		if (oFF.notNull(sourceRequestStructure))
		{
			let sourceQueryAlreadyRegistered = false;
			let resultSetFeatureRequestStructure = oFF.PrUtilsJsonPath.getFirstElementFromPath(sourceRequestStructure, oFF.InAQueryMergeConstants.PA_RS_FEATURE_REQUEST_PATH);
			let returnEmptyJsonResultSet = resultSetFeatureRequestStructure.getBooleanByKeyExt(oFF.InAQueryMergeConstants.QY_RETURN_EMPTY_JSON_RESULTSET, false);
			if (returnEmptyJsonResultSet)
			{
				let definitionStructure = oFF.PrUtilsJsonPath.getFirstElementFromPath(sourceRequestStructure, oFF.InAQueryMergeConstants.PA_DEFINITION_PATH);
				let preQueryName = definitionStructure.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
				if (this.m_inaMergeRegistry.getPreQuerySourceByName(preQueryName) !== null)
				{
					sourceQueryAlreadyRegistered = true;
				}
			}
			if (!sourceQueryAlreadyRegistered)
			{
				this.collectMeasureMetadataForRegistry(datasourceName, modelMetadata, measureDimensionMetadata);
				inaSourceQuery = oFF.InASourceQuery.create(instanceId, rpcFunction, connectionContainer, systemType);
				this.m_inaMergeRegistry.registerInASourceQuery(instanceId, inaSourceQuery);
				let analytics = sourceRequestStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_ANALYTICS);
				let persistedInA = analytics.containsKey(oFF.InAQueryMergeConstants.QY_STANDALONE_INDICATOR);
				if (persistedInA)
				{
					let isStandAlonePersistedValue = analytics.getBooleanByKey(oFF.InAQueryMergeConstants.QY_STANDALONE_INDICATOR);
					inaSourceQuery.setIsStandAloneQuery(isStandAlonePersistedValue);
					this.collectElementsAndInaSignatures(inaSourceQuery);
					this.collectInitialMeasureMembers(inaSourceQuery);
				}
				else
				{
					let isStandAloneQuery = this.isStandAloneQuery01(sourceRequestStructure);
					if (!isStandAloneQuery)
					{
						this.collectElementsAndInaSignatures(inaSourceQuery);
						this.collectInitialMeasureMembers(inaSourceQuery);
						isStandAloneQuery = this.isStandAloneQuery02(inaSourceQuery, sourceRequestStructure, datasourceName);
					}
					if (isStandAloneQuery)
					{
						inaSourceQuery.setIsStandAloneQuery(true);
					}
				}
			}
		}
	}
	return inaSourceQuery;
};
oFF.InAMergeRegistryManager.prototype.collectDrillDownDimensions = function(inaQuery, inaAllDimensions)
{
	let inaDrillDownDimensions = oFF.PrFactory.createStructure();
	if (!oFF.PrUtils.isListEmpty(inaAllDimensions))
	{
		let inaDrillDownList = oFF.PrFactory.createList();
		for (let i = 0; i < inaAllDimensions.size(); i++)
		{
			let inaDimension = inaAllDimensions.get(i);
			let tag = inaDimension.getStringByKey(oFF.InAQueryMergeConstants.TAG_KEY);
			let axisType = inaDimension.getStringByKey(oFF.InAQueryMergeConstants.QY_AXIS);
			let isCalculatedDimension = inaDimension.getStructureByKey(oFF.InAQueryMergeConstants.QY_DATASOURCE) !== null && inaDimension.containsKey(oFF.InAQueryMergeConstants.QY_JOIN_TYPE);
			if (oFF.XStringUtils.isNullOrEmpty(tag))
			{
				if (!oFF.XString.isEqual(axisType, oFF.InAQueryMergeConstants.QY_FREE) || isCalculatedDimension)
				{
					inaDrillDownList.add(inaDimension);
				}
			}
			else if (oFF.XString.isEqual(tag, oFF.InAQueryMergeConstants.TAG_MEASURE_STRUCTURE))
			{
				this.collectMeasureDimensionInfo(inaQuery, inaDimension, axisType);
			}
			else if (oFF.XString.isEqual(tag, oFF.InAQueryMergeConstants.TAG_SECONDARY_STRUCTURE))
			{
				let secondaryStructureName = inaDimension.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
				inaQuery.setSecondaryStructureName(secondaryStructureName);
				if (!oFF.XString.isEqual(axisType, oFF.InAQueryMergeConstants.QY_FREE))
				{
					inaDrillDownList.add(inaDimension);
				}
			}
		}
		if (!oFF.PrUtils.isListEmpty(inaDrillDownList))
		{
			inaDrillDownDimensions.put(oFF.InAQueryMergeConstants.QY_DIMENSIONS, inaDrillDownList);
		}
	}
	return inaDrillDownDimensions;
};
oFF.InAMergeRegistryManager.prototype.collectElementsAndInaSignatures = function(inaQuery)
{
	let requestStructure = inaQuery.getRequestStructure();
	let calculatingGroupSignature = true;
	let groupSignatureElement = oFF.PrUtilsJsonPath.getFirstElementFromPath(requestStructure, oFF.InAQueryMergeConstants.TAG_GROUP_SIGNATURE_PATH);
	if (oFF.notNull(groupSignatureElement))
	{
		inaQuery.setGroupSignature(groupSignatureElement.getString());
		calculatingGroupSignature = false;
	}
	let elementPathSize = this.m_elementsPathForMergeBreakers.size();
	for (let i = 0; i < elementPathSize; i++)
	{
		let elementPath = this.m_elementsPathForMergeBreakers.get(i);
		let inaElement = oFF.PrUtilsJsonPath.getFirstElementFromPath(requestStructure, elementPath);
		if (oFF.XString.isEqual(elementPath, oFF.InAQueryMergeConstants.PA_DRILLDOWN_DIMENSIONS_VIRTUAL_PATH))
		{
			let tempInaList = oFF.PrUtilsJsonPath.getFirstElementFromPath(requestStructure, oFF.InAQueryMergeConstants.PA_DIMENSIONS_PATH);
			inaElement = this.collectDrillDownDimensions(inaQuery, tempInaList);
			let drillDownDimensions = inaElement.getListByKey(oFF.InAQueryMergeConstants.QY_DIMENSIONS);
			inaQuery.setDrillDownDimensions(drillDownDimensions);
			if (oFF.notNull(drillDownDimensions))
			{
				let drillDownDimensionNames = oFF.XList.create();
				oFF.InAQueryMergeUtils.collectDrillDownDimensionNames(drillDownDimensions, drillDownDimensionNames);
				inaQuery.setDrillDownDimensionNames(drillDownDimensionNames);
			}
		}
		else if (oFF.XString.isEqual(elementPath, oFF.InAQueryMergeConstants.PA_MEASURE_STRUCTURE_WITHOUT_MEMBERS_VIRTUAL_PATH))
		{
			let measureDimension = inaQuery.getMeasureDimension();
			if (oFF.notNull(measureDimension))
			{
				inaElement = this.collectMeasureDimensionWithoutMembers(measureDimension);
			}
		}
		if (calculatingGroupSignature)
		{
			let inaString = this.m_inaSortingSerializer.serialize(inaElement);
			let hashValue = oFF.XSha1.createSHA1(inaString);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(elementPath) && oFF.XStringUtils.isNotNullAndNotEmpty(hashValue))
			{
				inaQuery.addInaElementSignature(elementPath, hashValue);
			}
		}
	}
	let filterStructure = oFF.InAQueryMergeUtils.getFilterStructure(requestStructure);
	inaQuery.setFilter(filterStructure);
	let selection = oFF.isNull(filterStructure) ? null : filterStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_SELECTION);
	if (oFF.notNull(selection))
	{
		let usedFieldNamesInSelection = oFF.XList.create();
		oFF.InAQueryMergeUtils.collectFieldNamesUsedInSelection(selection, usedFieldNamesInSelection);
		let dimensionsUsedInFilter = this.getDimensionNamesForFields(usedFieldNamesInSelection);
		inaQuery.setDimensionNamesUsedInFilter(dimensionsUsedInFilter);
	}
	let inaQueryDataCells = oFF.PrUtilsJsonPath.getFirstElementFromPath(requestStructure, oFF.InAQueryMergeConstants.PA_QUERY_DATACELLS_PATH);
	inaQuery.setQueryDataCells(inaQueryDataCells);
	if (calculatingGroupSignature)
	{
		inaQuery.calculateGroupSignature();
	}
};
oFF.InAMergeRegistryManager.prototype.collectInitialMeasureMembers = function(inaSourceQuery)
{
	let filter = inaSourceQuery.getFilter();
	let measureDimension = inaSourceQuery.getMeasureDimension();
	if (oFF.notNull(filter))
	{
		let selection = filter.getStructureByKey(oFF.InAQueryMergeConstants.QY_SELECTION);
		let measureMemberNames = oFF.InARestrictedMeasureUtils.extractMeasuresFromSelection(selection, null);
		for (let i = 0; i < measureMemberNames.size(); i++)
		{
			let measureMemberName = measureMemberNames.get(i);
			inaSourceQuery.addMeasureMemberName(measureMemberName, false, true, null);
		}
	}
	else if (oFF.notNull(measureDimension))
	{
		let measureDimensionName = measureDimension.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
		let keyFieldName = this.m_inaMergeRegistry.getKeyFieldOfDimension(measureDimensionName);
		let dimensionMembers = measureDimension.getListByKey(oFF.InAQueryMergeConstants.QY_MEMBERS);
		for (let j = 0; j < dimensionMembers.size(); j++)
		{
			let dimensionMember = dimensionMembers.getStructureAt(j);
			let dimensionMemberName = dimensionMember.getStringByKey(keyFieldName);
			if (inaSourceQuery.getSystemType().isTypeOf(oFF.SystemType.HANA))
			{
				let memberName = dimensionMember.getStringByKey(oFF.InAQueryMergeConstants.QY_MEMBER_NAME);
				dimensionMemberName = oFF.XStringUtils.isNotNullAndNotEmpty(memberName) ? memberName : dimensionMember.getStructureByKey(oFF.InAQueryMergeConstants.QY_MEMBER_OPERAND).getStringByKey(oFF.InAQueryMergeConstants.QY_VALUE);
			}
			inaSourceQuery.addMeasureMemberName(dimensionMemberName, false, false, null);
		}
	}
};
oFF.InAMergeRegistryManager.prototype.collectMeasureDimensionInfo = function(inaQuery, inaDimension, axisType)
{
	let measureDimensionName = inaDimension.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
	inaQuery.setMeasureDimensionName(measureDimensionName);
	inaQuery.setMeasureDimension(inaDimension);
	inaQuery.setMeasureDimensionAxis(axisType);
};
oFF.InAMergeRegistryManager.prototype.collectMeasureDimensionWithoutMembers = function(measureDimension)
{
	let measureDimensionWithoutMembers = oFF.PrFactory.createStructureDeepCopy(measureDimension);
	measureDimensionWithoutMembers.remove(oFF.InAQueryMergeConstants.QY_MEMBERS);
	let attributes = measureDimensionWithoutMembers.getListByKey(oFF.InAQueryMergeConstants.QY_ATTRIBUTES);
	let newAttributes = oFF.PrFactory.createList();
	for (let i = 0; i < attributes.size(); i++)
	{
		let field = attributes.get(i);
		let fieldName = field.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
		if (!oFF.XString.endsWith(fieldName, ".ID"))
		{
			newAttributes.add(field);
		}
	}
	measureDimensionWithoutMembers.put(oFF.InAQueryMergeConstants.QY_ATTRIBUTES, newAttributes);
	return measureDimensionWithoutMembers;
};
oFF.InAMergeRegistryManager.prototype.collectMeasureMetadataForRegistry = function(datasourceName, modelMetadata, measureDimensionMetadata)
{
	if (oFF.notNull(measureDimensionMetadata))
	{
		let measureDimensionName = measureDimensionMetadata.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
		this.m_inaMergeRegistry.registerKeyFieldForDimension(measureDimensionName, measureDimensionMetadata);
		this.m_inaMergeRegistry.registerMembersMetadata(measureDimensionName, measureDimensionMetadata);
	}
	this.m_inaMergeRegistry.registerModelMetadata(datasourceName, modelMetadata);
};
oFF.InAMergeRegistryManager.prototype.getAllMainQueryInADataProviders = function()
{
	return this.m_inaMergeRegistry.getAllMainQueryInADataProviders();
};
oFF.InAMergeRegistryManager.prototype.getDependentQueryInADataProviders = function(preQueryName)
{
	return this.m_inaMergeRegistry.getDependentQueryInADataProviders(preQueryName);
};
oFF.InAMergeRegistryManager.prototype.getDimensionNamesForFields = function(fieldNames)
{
	let dimensionNames = oFF.XList.create();
	if (oFF.notNull(fieldNames))
	{
		for (let i = 0; i < fieldNames.size(); i++)
		{
			let fieldName = fieldNames.get(i);
			let dimensionName = this.m_inaMergeRegistry.getDimensionNameOfField(fieldName);
			if (oFF.isNull(dimensionName))
			{
				dimensionName = oFF.InAQueryMergeUtils.getUsedDimensionName(fieldName);
			}
			dimensionNames.add(dimensionName);
		}
	}
	return dimensionNames;
};
oFF.InAMergeRegistryManager.prototype.getGroupSignatures = function()
{
	return this.m_inaMergeRegistry.getGroupSignatures();
};
oFF.InAMergeRegistryManager.prototype.getInADataProvider = function(instanceId)
{
	return this.m_inaMergeRegistry.getInADataProvider(instanceId);
};
oFF.InAMergeRegistryManager.prototype.getInADataProviders = function()
{
	return this.m_inaMergeRegistry.getInADataProviders();
};
oFF.InAMergeRegistryManager.prototype.getInASourceQuery = function(instanceId)
{
	return this.m_inaMergeRegistry.getInASourceQuery(instanceId);
};
oFF.InAMergeRegistryManager.prototype.getKeyFieldOfDimension = function(dimensionName)
{
	return this.m_inaMergeRegistry.getKeyFieldOfDimension(dimensionName);
};
oFF.InAMergeRegistryManager.prototype.getMembersMetadata = function(measureDimensionName)
{
	return this.m_inaMergeRegistry.getMembersMetadata(measureDimensionName);
};
oFF.InAMergeRegistryManager.prototype.getMergeableSourceQueries = function()
{
	return this.m_inaMergeRegistry.getMergeableSourceQueries();
};
oFF.InAMergeRegistryManager.prototype.getModelMetadata = function(datasourceName)
{
	return this.m_inaMergeRegistry.getModelMetadata(datasourceName);
};
oFF.InAMergeRegistryManager.prototype.getPreQueryInADataProviderByName = function(preQueryName)
{
	return this.m_inaMergeRegistry.getPreQueryInADataProviderByName(preQueryName);
};
oFF.InAMergeRegistryManager.prototype.getSourceIDsBySignature = function(groupSignature)
{
	return this.m_inaMergeRegistry.getSourceIDsBySignature(groupSignature);
};
oFF.InAMergeRegistryManager.prototype.getValidInARequest = function(sourceRpcFunction)
{
	let sourceQueryRequest = sourceRpcFunction.getRpcRequest();
	let sourceRequestStructure = oFF.isNull(sourceQueryRequest) ? null : sourceQueryRequest.getRequestStructure();
	if (oFF.isNull(sourceRequestStructure) || sourceRequestStructure.isEmpty())
	{
		sourceRequestStructure = null;
	}
	else
	{
		let analyticsStructure = oFF.PrUtilsJsonPath.getFirstElementFromPath(sourceRequestStructure, oFF.InAQueryMergeConstants.PA_ANALYTICS_SERVICE_TYPE_PATH);
		if (oFF.isNull(analyticsStructure) || analyticsStructure.containsKey(oFF.InAQueryMergeConstants.QY_PROCESSING_DIRECTIVES) || analyticsStructure.containsKey(oFF.InAQueryMergeConstants.QY_PROCESSING_STEP))
		{
			sourceRequestStructure = null;
		}
	}
	return sourceRequestStructure;
};
oFF.InAMergeRegistryManager.prototype.groupSourceQueries = function(inaSourceQueries)
{
	this.m_inaMergeRegistry.groupSourceQueries(inaSourceQueries);
};
oFF.InAMergeRegistryManager.prototype.hasMeasureMembersMetadata = function(measureDimensionName)
{
	return this.m_inaMergeRegistry.hasMeasureMembersMetadata(measureDimensionName);
};
oFF.InAMergeRegistryManager.prototype.hasModelMetadata = function(datasourceName)
{
	return this.m_inaMergeRegistry.hasModelMetadata(datasourceName);
};
oFF.InAMergeRegistryManager.prototype.isStandAloneQuery01 = function(sourceRequestStructure)
{
	try
	{
		let queryType = oFF.InAQueryMergeUtils.getQueryType(sourceRequestStructure);
		if (oFF.XString.isEqual(queryType, oFF.InAQueryMergeConstants.QY_QUERY_VALUE_HELP))
		{
			return true;
		}
		let queryAxes = oFF.PrUtilsJsonPath.getFirstElementFromPath(sourceRequestStructure, oFF.InAQueryMergeConstants.PA_QUERY_AXES_PATH);
		if (!oFF.PrUtils.isListEmpty(queryAxes))
		{
			let axis0Type = queryAxes.get(0).getIntegerByKeyExt(oFF.InAQueryMergeConstants.QY_ZERO_SUPPRESSION_TYPE, -1);
			let axis1Type = queryAxes.get(1).getIntegerByKeyExt(oFF.InAQueryMergeConstants.QY_ZERO_SUPPRESSION_TYPE, -1);
			if (axis0Type !== 0 || axis1Type !== 0)
			{
				return true;
			}
		}
		let resultSetFeatureRequest = oFF.PrUtilsJsonPath.getFirstElementFromPath(sourceRequestStructure, oFF.InAQueryMergeConstants.PA_RS_FEATURE_REQUEST_PATH);
		if (oFF.notNull(resultSetFeatureRequest) && resultSetFeatureRequest.getBooleanByKey(oFF.InAQueryMergeConstants.QY_SUPPRESS_KEYFIGURE_CALCULATION))
		{
			return true;
		}
		if (oFF.notNull(resultSetFeatureRequest) && resultSetFeatureRequest.getBooleanByKeyExt(oFF.InAQueryMergeConstants.QY_RETURN_EMPTY_JSON_RESULTSET, false))
		{
			return true;
		}
		let dimensions = oFF.PrUtilsJsonPath.getFirstElementFromPath(sourceRequestStructure, oFF.InAQueryMergeConstants.PA_DIMENSIONS_PATH);
		if (!oFF.PrUtils.isListEmpty(dimensions) && oFF.InAQueryMergeUtils.hasGeometryDimension(dimensions))
		{
			return true;
		}
		if (!oFF.PrUtils.isListEmpty(dimensions) && oFF.InAQueryMergeUtils.hasAccountDimension(dimensions))
		{
			return true;
		}
		let filterStructure = oFF.InAQueryMergeUtils.getFilterStructure(sourceRequestStructure);
		let selection = oFF.isNull(filterStructure) ? null : filterStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_SELECTION);
		if (oFF.notNull(selection))
		{
			let operator = selection.getStructureByKey(oFF.InAQueryMergeConstants.QY_OPERATOR);
			if (oFF.notNull(operator))
			{
				oFF.InARestrictedMeasureUtils._cleanRedundantOperatorWrapper(operator, operator);
				if (oFF.InAQueryMergeUtils.isComplexFilter(operator))
				{
					return true;
				}
			}
			if (oFF.InAQueryMergeUtils.hasGeometryOperandInFilter(selection))
			{
				return true;
			}
			if (oFF.InAQueryMergeUtils.hasVariablePlaceHolder(selection))
			{
				return true;
			}
			if (oFF.InAQueryMergeUtils.hasFilterTagValue(selection, oFF.InAQueryMergeConstants.TAG_FILTER_SECOND_STRUCTURE))
			{
				return true;
			}
			let selectionString = selection.getStringRepresentation();
			if (oFF.notNull(selectionString) && oFF.XString.containsString(selectionString, oFF.InAQueryMergeConstants.QY_LEVEL_OFFSET_1))
			{
				return true;
			}
		}
	}
	catch (e)
	{
		return true;
	}
	return false;
};
oFF.InAMergeRegistryManager.prototype.isStandAloneQuery02 = function(inaSourceQuery, sourceRequestStructure, datasourceName)
{
	try
	{
		let measureDimensionAxis = inaSourceQuery.getMeasureDimensionAxis();
		let drillDownDiemsnions = inaSourceQuery.getDrillDownDimensions();
		if (oFF.notNull(drillDownDiemsnions) && oFF.InAQueryMergeUtils.hasNonMeasureDimensionOnMeasureAxis(drillDownDiemsnions, measureDimensionAxis))
		{
			return true;
		}
		let filterStructure = oFF.InAQueryMergeUtils.getFilterStructure(sourceRequestStructure);
		let selection = oFF.isNull(filterStructure) ? null : filterStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_SELECTION);
		if (oFF.notNull(selection))
		{
			let drillDownDiemnsions = inaSourceQuery.getDrillDownDimensionNames();
			let dimensionsWithHierarchicalFilter = oFF.XList.create();
			oFF.InAQueryMergeUtils.collectDimensionsWithHierarchicalFilter(selection, dimensionsWithHierarchicalFilter);
			if (oFF.notNull(drillDownDiemnsions) && !dimensionsWithHierarchicalFilter.isEmpty() && oFF.InAQueryMergeUtils.isListsIntersect(dimensionsWithHierarchicalFilter, drillDownDiemnsions))
			{
				return true;
			}
			let measureDimension = inaSourceQuery.getMeasureDimension();
			let measureMembers = oFF.isNull(measureDimension) ? null : measureDimension.getListByKey(oFF.InAQueryMergeConstants.QY_MEMBERS);
			if (!oFF.PrUtils.isListEmpty(measureMembers))
			{
				let measureDimensionName = inaSourceQuery.getMeasureDimensionName();
				let usedDimensionsInSelection = inaSourceQuery.getDimensionNamesUsedInFilter();
				if (oFF.notNull(usedDimensionsInSelection))
				{
					usedDimensionsInSelection.removeElement(measureDimensionName);
					if (!usedDimensionsInSelection.isEmpty())
					{
						let modelMetadata = this.m_inaMergeRegistry.getModelMetadata(datasourceName);
						let inaSourceConditionsSignature = inaSourceQuery.getInaElementSignature(oFF.InAQueryMergeConstants.PA_CONDITIONS_PATH);
						let isConditionsStateChangedByClient = oFF.InAQueryMergeUtils.isConditionsStateChangedByClient(modelMetadata, this.m_inaSortingSerializer, inaSourceConditionsSignature);
						if (isConditionsStateChangedByClient)
						{
							return true;
						}
						let sortsList = oFF.PrUtilsJsonPath.getFirstElementFromPath(sourceRequestStructure, oFF.InAQueryMergeConstants.PA_SORT_PATH);
						let hasMeasureSort = oFF.InAQueryMergeUtils.hasMeasureSort(sortsList);
						if (hasMeasureSort)
						{
							return true;
						}
						let exceptionsList = oFF.PrUtilsJsonPath.getFirstElementFromPath(sourceRequestStructure, oFF.InAQueryMergeConstants.PA_EXCEPTIONS_PATH);
						if (oFF.notNull(exceptionsList))
						{
							return true;
						}
						let usedDimensionsInBackendRestrictedMeasures = oFF.XList.create();
						let membersMetadata = this.m_inaMergeRegistry.getMembersMetadata(measureDimensionName);
						if (oFF.notNull(membersMetadata))
						{
							oFF.InAQueryMergeUtils.collectDimensionsOfBackendRestrictedMeasures(membersMetadata, usedDimensionsInBackendRestrictedMeasures);
							let usedDimensionsInBackendDefinedRestrictedMeasures = oFF.XList.create();
							oFF.InAQueryMergeUtils.collectUsedDimensionsInBackendDefinedRestrictedMeasures(membersMetadata, usedDimensionsInBackendDefinedRestrictedMeasures);
							usedDimensionsInBackendRestrictedMeasures.addAll(usedDimensionsInBackendDefinedRestrictedMeasures);
							if (!usedDimensionsInBackendRestrictedMeasures.isEmpty() && oFF.InAQueryMergeUtils.isListsIntersect(usedDimensionsInBackendRestrictedMeasures, usedDimensionsInSelection))
							{
								return true;
							}
						}
						let usedDimensionsInRestrictedMeasures = oFF.XList.create();
						oFF.InAQueryMergeUtils.collectUsedDimensionsInRestrictedMeasures(measureMembers, usedDimensionsInRestrictedMeasures);
						if (!usedDimensionsInRestrictedMeasures.isEmpty() && oFF.InAQueryMergeUtils.isListsIntersect(usedDimensionsInRestrictedMeasures, usedDimensionsInSelection))
						{
							return true;
						}
						let usedDimensionsInFormulas = oFF.XList.create();
						oFF.InAQueryMergeUtils.collectUsedDimensionsInFormulas(measureMembers, usedDimensionsInFormulas);
						if (!usedDimensionsInFormulas.isEmpty() && oFF.InAQueryMergeUtils.isListsIntersect(usedDimensionsInFormulas, usedDimensionsInSelection))
						{
							return true;
						}
					}
				}
			}
		}
	}
	catch (e)
	{
		return true;
	}
	return false;
};
oFF.InAMergeRegistryManager.prototype.registerInADataProvider = function(instanceId, inaDataProvider)
{
	this.m_inaMergeRegistry.registerInADataProvider(instanceId, inaDataProvider);
};
oFF.InAMergeRegistryManager.prototype.registerInASourceQuery = function(instanceId, inaSourceQuery)
{
	this.m_inaMergeRegistry.registerInASourceQuery(instanceId, inaSourceQuery);
};
oFF.InAMergeRegistryManager.prototype.registerKeyFieldForDimension = function(dimensionName, dimensionMetadata)
{
	this.m_inaMergeRegistry.registerKeyFieldForDimension(dimensionName, dimensionMetadata);
};
oFF.InAMergeRegistryManager.prototype.registerMembersMetadata = function(measureDimensionName, measureMetadata)
{
	this.m_inaMergeRegistry.registerMembersMetadata(measureDimensionName, measureMetadata);
};
oFF.InAMergeRegistryManager.prototype.registerModelMetadata = function(datasourceName, modelMetadata)
{
	this.m_inaMergeRegistry.registerModelMetadata(datasourceName, modelMetadata);
};
oFF.InAMergeRegistryManager.prototype.releaseObject = function()
{
	this.m_inaSortingSerializer = oFF.XObjectExt.release(this.m_inaSortingSerializer);
	this.m_elementsPathForMergeBreakers = oFF.XObjectExt.release(this.m_elementsPathForMergeBreakers);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.InAMergeRegistryManager.prototype.setupElementPathLists = function()
{
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_CAPABILTIES_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_DATASOURCE_OBJECTNAME_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_DATASOURCE_PACKAGE_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_DATASOURCE_SCHEMA_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_DATASOURCE_TYPE_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_LANGUAGE_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_VARIABLES_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_SORT_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_EXCEPTIONS_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_CONDITIONS_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_OPTIONS_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_FIXED_FILTER_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_RS_FEATURE_REQUEST_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_CELL_CONTEXT_REQUESTS_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_CURRENCY_TRANSLATION_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_UDH_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_DRILLDOWN_DIMENSIONS_VIRTUAL_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_MEASURE_STRUCTURE_WITHOUT_MEMBERS_VIRTUAL_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_QUERY_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_VISIBILITY_FILTER_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_HINTS_PATH);
	this.m_elementsPathForMergeBreakers.add(oFF.InAQueryMergeConstants.PA_HIERARCHY_NAVIGATIONS_PATH);
};
oFF.InAMergeRegistryManager.prototype.setupInAMergeRegistry = function()
{
	this.m_inaMergeRegistry = oFF.InAMergeRegistry.create();
	this.m_inaSortingSerializer = oFF.PrSerializerFactory.newSerializer(true, false, 0, true);
	this.m_elementsPathForMergeBreakers = oFF.XList.create();
	this.setupElementPathLists();
};
oFF.InAMergeRegistryManager.prototype.unregisterInADataProvider = function(groupSignature, instanceId)
{
	this.m_inaMergeRegistry.unregisterInADataProvider(groupSignature, instanceId);
};
oFF.InAMergeRegistryManager.prototype.unregisterInASourceQuery = function(instanceId)
{
	this.m_inaMergeRegistry.unregisterInASourceQuery(instanceId);
};

oFF.InAMergeRequestBuilder = function() {};
oFF.InAMergeRequestBuilder.prototype = new oFF.XObject();
oFF.InAMergeRequestBuilder.prototype._ff_c = "InAMergeRequestBuilder";

oFF.InAMergeRequestBuilder.create = function(inaMergeRegistryManager)
{
	let inaMergeRequestBuilder = new oFF.InAMergeRequestBuilder();
	inaMergeRequestBuilder.setupInAMergeRequestBuilder(inaMergeRegistryManager);
	return inaMergeRequestBuilder;
};
oFF.InAMergeRequestBuilder.prototype.m_inaMergeRegistryManager = null;
oFF.InAMergeRequestBuilder.prototype.addElementsToRmFilter = function(rmFilter, filterElements)
{
	let filterSelection = rmFilter.getStructureByKey(oFF.InAQueryMergeConstants.QY_SELECTION);
	let operator = null;
	let subSelection = null;
	let setOperand = null;
	if (oFF.notNull(filterSelection))
	{
		operator = filterSelection.getStructureByKey(oFF.InAQueryMergeConstants.QY_OPERATOR);
		subSelection = operator.getListByKey(oFF.InAQueryMergeConstants.QY_SUB_SELECTIONS);
		setOperand = subSelection.get(0).getStructureByKey(oFF.InAQueryMergeConstants.QY_SET_OPERAND);
	}
	else
	{
		setOperand = rmFilter.getStructureByKey(oFF.InAQueryMergeConstants.QY_SET_OPERAND);
		if (oFF.isNull(setOperand))
		{
			operator = rmFilter.getStructureByKey(oFF.InAQueryMergeConstants.QY_OPERATOR);
			subSelection = operator.getListByKey(oFF.InAQueryMergeConstants.QY_SUB_SELECTIONS);
			setOperand = subSelection.get(0).getStructureByKey(oFF.InAQueryMergeConstants.QY_SET_OPERAND);
		}
	}
	if (oFF.notNull(setOperand))
	{
		let tempElements = setOperand.getListByKey(oFF.InAQueryMergeConstants.QY_ELEMENTS);
		for (let i = 0; i < tempElements.size(); i++)
		{
			let tempElement = tempElements.get(i);
			if (!filterElements.contains(tempElement))
			{
				filterElements.add(tempElement);
			}
		}
	}
};
oFF.InAMergeRequestBuilder.prototype.addIdAttributeIfNeeded = function(sourceMeasureDimension, measureDimension)
{
	let mergedMeasureDimensionAttributes = measureDimension.getListByKey(oFF.InAQueryMergeConstants.QY_ATTRIBUTES);
	let mergeMeasureHasIdAttribute = false;
	for (let i = 0; i < mergedMeasureDimensionAttributes.size(); i++)
	{
		let field = mergedMeasureDimensionAttributes.get(i);
		let fieldName = field.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
		if (oFF.XString.endsWith(fieldName, ".ID"))
		{
			mergeMeasureHasIdAttribute = true;
			break;
		}
	}
	if (!mergeMeasureHasIdAttribute)
	{
		let sourceMeasureDimensionAttributes = sourceMeasureDimension.getListByKey(oFF.InAQueryMergeConstants.QY_ATTRIBUTES);
		for (let j = 0; j < sourceMeasureDimensionAttributes.size(); j++)
		{
			let field2 = sourceMeasureDimensionAttributes.get(j);
			let fieldName2 = field2.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
			if (oFF.XString.endsWith(fieldName2, ".ID"))
			{
				mergedMeasureDimensionAttributes.add(field2);
				break;
			}
		}
	}
};
oFF.InAMergeRequestBuilder.prototype.adjustMeasures = function(measureDimension, sourceSelection, sourceQuery, keyFieldName)
{
	let measureMembers = measureDimension.getListByKey(oFF.InAQueryMergeConstants.QY_MEMBERS);
	let restrictedMeasuresCreatedIfAny = oFF.PrList.create();
	let restrictedMeasureMap = oFF.XHashMapByString.create();
	for (let i = 0; i < measureMembers.size(); i++)
	{
		let measureElement = measureMembers.get(i);
		if (measureElement.getBooleanByKeyExt(oFF.InAQueryMergeConstants.TAG_MEASURE_MEMBER_TOUCHED, false))
		{
			this.createRestrictedMeasure(measureElement, keyFieldName, restrictedMeasuresCreatedIfAny, restrictedMeasureMap, true);
			measureMembers.removeElement(measureElement);
			let measureName = measureElement.getStringByKey(oFF.InAQueryMergeConstants.QY_MEMBER_NAME);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(measureName))
			{
				let newBareMeasure = oFF.PrStructure.create();
				newBareMeasure.putString(oFF.InAQueryMergeConstants.QY_MEMBER_NAME, measureName);
				measureMembers.add(newBareMeasure);
			}
		}
	}
	this.replaceMeasureInSelection(sourceSelection, restrictedMeasureMap);
	this.assignRestrictedMeasureToSourceQuery(sourceQuery, restrictedMeasureMap);
	this.replaceFormulaAndSelectionReferencesWithRMName(restrictedMeasureMap, measureMembers);
	for (let k = 0; k < restrictedMeasuresCreatedIfAny.size(); k++)
	{
		let iPrElement = restrictedMeasuresCreatedIfAny.get(k);
		if (!measureMembers.contains(iPrElement))
		{
			measureMembers.add(iPrElement);
		}
	}
};
oFF.InAMergeRequestBuilder.prototype.assignRestrictedMeasureToSourceQuery = function(inaQuery, restrictedMeasureMap)
{
	if (inaQuery.hasMeasureFilter())
	{
		let restrictedMeasureNames = restrictedMeasureMap.getKeysAsReadOnlyList();
		for (let i = 0; i < restrictedMeasureNames.size(); i++)
		{
			let measureMemberName = restrictedMeasureNames.get(i);
			inaQuery.addMeasureMemberName(measureMemberName, true, false, restrictedMeasureMap.getByKey(measureMemberName));
		}
	}
};
oFF.InAMergeRequestBuilder.prototype.buildSpecialElements = function(instanceIds, systemType)
{
	let specialElements = oFF.PrFactory.createStructure();
	let setOperand = this.createMergeFilter(specialElements);
	let filterElements = null;
	let queryDataCells = systemType.isTypeOf(oFF.SystemType.BW) ? specialElements.putNewList(oFF.InAQueryMergeConstants.QY_QUERY_DATA_CELLS) : null;
	let measureDimension = null;
	let dimensions = specialElements.putNewList(oFF.InAQueryMergeConstants.QY_DIMENSIONS);
	for (let i = 0; i < instanceIds.size(); i++)
	{
		let instanceId = instanceIds.get(i);
		let sourceQuery = this.m_inaMergeRegistryManager.getInASourceQuery(instanceId);
		let sourceMeasureDimension = sourceQuery.getMeasureDimension();
		let sourceSelection = sourceQuery.getFilter() !== null ? sourceQuery.getFilter().getStructureByKey(oFF.InAQueryMergeConstants.QY_SELECTION) : null;
		let measureDimensionName = sourceQuery.getMeasureDimensionName();
		let fieldName = this.m_inaMergeRegistryManager.getKeyFieldOfDimension(measureDimensionName);
		if (i === 0)
		{
			setOperand.putStringNotNullAndNotEmpty(oFF.InAQueryMergeConstants.QY_FIELD_NAME, fieldName);
			filterElements = setOperand.putNewList(oFF.InAQueryMergeConstants.QY_ELEMENTS);
			if (oFF.notNull(queryDataCells))
			{
				queryDataCells.addAll(sourceQuery.getQueryDataCells());
			}
			dimensions.addAll(sourceQuery.getDrillDownDimensions());
			if (oFF.notNull(sourceMeasureDimension))
			{
				measureDimension = oFF.PrFactory.createStructureDeepCopy(sourceMeasureDimension);
				if (oFF.isNull(queryDataCells))
				{
					this.adjustMeasures(measureDimension, sourceSelection, sourceQuery, fieldName);
				}
				dimensions.add(measureDimension);
			}
		}
		else
		{
			if (oFF.notNull(sourceMeasureDimension) && oFF.notNull(measureDimension))
			{
				let mergedElements = measureDimension.getListByKey(oFF.InAQueryMergeConstants.QY_MEMBERS);
				let newMembers = sourceMeasureDimension.getListByKey(oFF.InAQueryMergeConstants.QY_MEMBERS);
				if (oFF.isNull(queryDataCells))
				{
					this.mergeMeasureElements(mergedElements, newMembers, sourceSelection, sourceQuery, fieldName);
				}
				else
				{
					oFF.InAQueryMergeUtils.mergeElementsLists(mergedElements, newMembers);
				}
				this.addIdAttributeIfNeeded(sourceMeasureDimension, measureDimension);
			}
			if (sourceQuery.getQueryDataCells() !== null && oFF.notNull(queryDataCells))
			{
				let newQueryDataCells = sourceQuery.getQueryDataCells();
				oFF.InAQueryMergeUtils.mergeElementsLists(queryDataCells, newQueryDataCells);
			}
		}
		if (oFF.notNull(sourceSelection))
		{
			let sourceMeasureMemberNames = oFF.InARestrictedMeasureUtils.extractMeasuresFromSelection(sourceSelection, null);
			let restrictedMeasureMap = oFF.XHashMapByString.create();
			let rmFilter = this.getRestrictedMeasureFilter(sourceMeasureMemberNames, sourceSelection, measureDimension, queryDataCells, restrictedMeasureMap);
			this.addElementsToRmFilter(rmFilter, filterElements);
			this.assignRestrictedMeasureToSourceQuery(sourceQuery, restrictedMeasureMap);
		}
	}
	if (oFF.PrUtils.isListEmpty(setOperand.getListByKey(oFF.InAQueryMergeConstants.QY_ELEMENTS)))
	{
		specialElements.remove(oFF.InAQueryMergeConstants.QY_FILTER);
	}
	return specialElements;
};
oFF.InAMergeRequestBuilder.prototype.createInADataProviderRequestStructure = function(instanceIds, systemType)
{
	let request = oFF.PrFactory.createStructure();
	if (systemType.isTypeOf(oFF.SystemType.BW))
	{
		request = this.createRequestStructureForBW(instanceIds);
	}
	else if (systemType.isTypeOf(oFF.SystemType.HANA))
	{
		request = this.createRequestStructureForHANA(instanceIds);
	}
	return request;
};
oFF.InAMergeRequestBuilder.prototype.createMergeFilter = function(specialElements)
{
	let filter = specialElements.putNewStructure(oFF.InAQueryMergeConstants.QY_FILTER);
	let filterSelection = filter.putNewStructure(oFF.InAQueryMergeConstants.QY_SELECTION);
	let operator = filterSelection.putNewStructure(oFF.InAQueryMergeConstants.QY_OPERATOR);
	operator.putString(oFF.InAQueryMergeConstants.QY_CODE, oFF.InAQueryMergeConstants.QY_AND);
	let subSelection = operator.putNewList(oFF.InAQueryMergeConstants.QY_SUB_SELECTIONS);
	let setOperand = subSelection.addNewStructure().putNewStructure(oFF.InAQueryMergeConstants.QY_SET_OPERAND);
	return setOperand;
};
oFF.InAMergeRequestBuilder.prototype.createRequestStructureForBW = function(instanceIds)
{
	let request = oFF.PrFactory.createStructure();
	let instanceId0 = instanceIds.get(0);
	let inaQuery0 = this.m_inaMergeRegistryManager.getInASourceQuery(instanceId0);
	let commonStructure = inaQuery0.getRequestStructure();
	let sourceAnalytics = commonStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_ANALYTICS);
	let analytics = request.putNewStructure(oFF.InAQueryMergeConstants.QY_ANALYTICS);
	this.fillAnalyticsElements(sourceAnalytics, analytics, instanceIds, oFF.SystemType.BW);
	request.putIfNotNull(oFF.InAQueryMergeConstants.QY_CLIENT_INFO, commonStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_CLIENT_INFO));
	let options = request.putNewList(oFF.InAQueryMergeConstants.QY_OPTIONS);
	options.addAll(commonStructure.getListByKey(oFF.InAQueryMergeConstants.QY_OPTIONS));
	return request;
};
oFF.InAMergeRequestBuilder.prototype.createRequestStructureForHANA = function(instanceIds)
{
	let request = oFF.PrFactory.createStructure();
	let instanceId0 = instanceIds.get(0);
	let inaQuery0 = this.m_inaMergeRegistryManager.getInASourceQuery(instanceId0);
	let commonStructure = inaQuery0.getRequestStructure();
	let sourceAnalytics = commonStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_ANALYTICS);
	let analytics = request.putNewStructure(oFF.InAQueryMergeConstants.QY_ANALYTICS);
	this.fillAnalyticsElements(sourceAnalytics, analytics, instanceIds, oFF.SystemType.HANA);
	request.putIfNotNull(oFF.InAQueryMergeConstants.QY_CLIENT_INFO, commonStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_CLIENT_INFO));
	let options = request.putNewList(oFF.InAQueryMergeConstants.QY_OPTIONS);
	options.addAll(commonStructure.getListByKey(oFF.InAQueryMergeConstants.QY_OPTIONS));
	return request;
};
oFF.InAMergeRequestBuilder.prototype.createRestrictedMeasure = function(measureElement, keyFieldName, restrictedMeasuresCreatedIfAny, restrictedMeasureMap, addSelectionOnBaseMeasure)
{
	let namedMember = true;
	let measureName = measureElement.getStringByKey(oFF.InAQueryMergeConstants.QY_MEMBER_NAME);
	if (oFF.XStringUtils.isNullOrEmpty(measureName))
	{
		namedMember = false;
		let memberOperand = measureElement.getStructureByKey(oFF.InAQueryMergeConstants.QY_MEMBER_OPERAND);
		if (oFF.notNull(memberOperand))
		{
			measureName = memberOperand.getStringByKey(oFF.InAQueryMergeConstants.QY_VALUE);
		}
		if (oFF.XStringUtils.isNullOrEmpty(measureName))
		{
			measureName = measureElement.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
		}
	}
	let createSHA1 = oFF.XSha1.createSHA1(measureElement.toString());
	let restrictedMeasureName = createSHA1;
	let restrictedMeasure = measureElement.cloneExt(null);
	let removeElement = namedMember ? oFF.InAQueryMergeConstants.QY_MEMBER_NAME : oFF.InAQueryMergeConstants.QY_MEMBER_OPERAND;
	restrictedMeasure.remove(removeElement);
	let restrictedMeasureString = restrictedMeasure.getStringRepresentation();
	let newRMString = oFF.XString.replace(restrictedMeasureString, measureName, restrictedMeasureName);
	restrictedMeasure = oFF.JsonParserFactory.createFromString(newRMString);
	restrictedMeasure.putString(oFF.InAQueryMergeConstants.QY_NAME, restrictedMeasureName);
	restrictedMeasure.putString(oFF.InAQueryMergeConstants.QY_DESCRIPTION, restrictedMeasureName);
	if (addSelectionOnBaseMeasure)
	{
		let selection = restrictedMeasure.putNewStructure(oFF.InAQueryMergeConstants.QY_SELECTION);
		let setOperand = selection.putNewStructure(oFF.InAQueryMergeConstants.QY_SET_OPERAND);
		let operandElements = setOperand.putNewList(oFF.InAQueryMergeConstants.QY_ELEMENTS);
		let baseMeasureReference = operandElements.addNewStructure();
		baseMeasureReference.putString(oFF.InAQueryMergeConstants.QY_COMPARISON, oFF.InAQueryMergeConstants.QY_EQUALS_SIGN);
		baseMeasureReference.putString(oFF.InAQueryMergeConstants.QY_LOW, measureName);
		setOperand.putString(oFF.InAQueryMergeConstants.QY_FIELD_NAME, keyFieldName);
	}
	restrictedMeasuresCreatedIfAny.add(restrictedMeasure);
	restrictedMeasureMap.put(restrictedMeasureName, measureName);
};
oFF.InAMergeRequestBuilder.prototype.fillAnalyticsElements = function(sourceStructure, analytics, instanceIds, systemType)
{
	analytics.put(oFF.InAQueryMergeConstants.QY_CAPABILITIES, sourceStructure.getListByKey(oFF.InAQueryMergeConstants.QY_CAPABILITIES));
	let dataSource = sourceStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_DATASOURCE);
	analytics.put(oFF.InAQueryMergeConstants.QY_DATASOURCE, oFF.PrUtils.deepCopyElement(dataSource));
	let sourceDefinition = sourceStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_DEFINITION);
	let definition = oFF.PrFactory.createStructure();
	analytics.put(oFF.InAQueryMergeConstants.QY_DEFINITION, definition);
	this.fillDefinitionElements(sourceDefinition, definition, instanceIds, systemType);
	analytics.putString(oFF.InAQueryMergeConstants.QY_LANGUAGE, sourceStructure.getStringByKey(oFF.InAQueryMergeConstants.QY_LANGUAGE));
};
oFF.InAMergeRequestBuilder.prototype.fillDefinitionElements = function(sourceStructure, definition, instanceIds, systemType)
{
	let specialElements = this.buildSpecialElements(instanceIds, systemType);
	definition.putIfNotNull(oFF.InAQueryMergeConstants.QY_HINTS, sourceStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_HINTS));
	definition.putIfNotNull(oFF.InAQueryMergeConstants.QY_CONDITIONS, sourceStructure.getListByKey(oFF.InAQueryMergeConstants.QY_CONDITIONS));
	definition.putIfNotNull(oFF.InAQueryMergeConstants.QY_VISIBILITY_FILTER, sourceStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_VISIBILITY_FILTER));
	definition.putIfNotNull(oFF.InAQueryMergeConstants.QY_CELL_CONTEXT_REQUESTS, sourceStructure.getListByKey(oFF.InAQueryMergeConstants.QY_CELL_CONTEXT_REQUESTS));
	definition.putIfNotNull(oFF.InAQueryMergeConstants.QY_CURRENCY_TRANSLATION, sourceStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_CURRENCY_TRANSLATION));
	definition.putIfNotNull(oFF.InAQueryMergeConstants.QY_HIERARCHY_NAVIGATIONS, sourceStructure.getListByKey(oFF.InAQueryMergeConstants.QY_HIERARCHY_NAVIGATIONS));
	let inaDataProviderDimensions = specialElements.getListByKey(oFF.InAQueryMergeConstants.QY_DIMENSIONS);
	definition.put(oFF.InAQueryMergeConstants.QY_DIMENSIONS, inaDataProviderDimensions);
	definition.putIfNotNull(oFF.InAQueryMergeConstants.QY_EXCEPTIONS, sourceStructure.getListByKey(oFF.InAQueryMergeConstants.QY_EXCEPTIONS));
	if (systemType.isTypeOf(oFF.SystemType.HANA))
	{
		definition.putStringNotNullAndNotEmpty(oFF.InAQueryMergeConstants.QY_NAME, sourceStructure.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME));
	}
	let inaDataProviderfilter = specialElements.getStructureByKey(oFF.InAQueryMergeConstants.QY_FILTER);
	let filterKeyWord = systemType.isTypeOf(oFF.SystemType.BW) ? oFF.InAQueryMergeConstants.QY_FILTER : oFF.InAQueryMergeConstants.QY_DYNAMIC_FILTER;
	definition.putIfNotNull(filterKeyWord, inaDataProviderfilter);
	definition.putIfNotNull(oFF.InAQueryMergeConstants.QY_FIXED_FILTER, sourceStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_FIXED_FILTER));
	definition.putIfNotNull(oFF.InAQueryMergeConstants.QY_QUERY, sourceStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_QUERY));
	let inaDataProviderDataCells = specialElements.getListByKey(oFF.InAQueryMergeConstants.QY_QUERY_DATA_CELLS);
	definition.putIfNotNull(oFF.InAQueryMergeConstants.QY_QUERY_DATA_CELLS, inaDataProviderDataCells);
	definition.putIfNotNull(oFF.InAQueryMergeConstants.QY_RS_FEATURE_REQUEST, sourceStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_RS_FEATURE_REQUEST));
	this.setAutoSubmitFlag(definition.getStructureByKey(oFF.InAQueryMergeConstants.QY_RS_FEATURE_REQUEST));
	definition.putIfNotNull(oFF.InAQueryMergeConstants.QY_SORT, sourceStructure.getListByKey(oFF.InAQueryMergeConstants.QY_SORT));
	definition.putIfNotNull(oFF.InAQueryMergeConstants.QY_UNIVERSAL_DISPLAY_HIERARCHIES, sourceStructure.getListByKey(oFF.InAQueryMergeConstants.QY_UNIVERSAL_DISPLAY_HIERARCHIES));
	definition.putIfNotNull(oFF.InAQueryMergeConstants.QY_VARIABLES, sourceStructure.getListByKey(oFF.InAQueryMergeConstants.QY_VARIABLES));
};
oFF.InAMergeRequestBuilder.prototype.getRestrictedMeasureFilter = function(measureMemberNames, filterSelection, measureDimension, queryDataCells, restrictedMeasureMap)
{
	let measureDimensionName = measureDimension.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
	let usedFieldNamesInSelection = oFF.XList.create();
	oFF.InAQueryMergeUtils.collectFieldNamesUsedInSelection(filterSelection, usedFieldNamesInSelection);
	let measureKeyFieldName = this.m_inaMergeRegistryManager.getKeyFieldOfDimension(measureDimensionName);
	if (usedFieldNamesInSelection.contains(measureKeyFieldName) && usedFieldNamesInSelection.size() === 1)
	{
		return filterSelection;
	}
	let rmFilter = oFF.InARestrictedMeasureUtils.processRestrictedMeasures(this.m_inaMergeRegistryManager, measureMemberNames, measureKeyFieldName, measureDimension, filterSelection, queryDataCells, restrictedMeasureMap);
	return rmFilter;
};
oFF.InAMergeRequestBuilder.prototype.mergeMeasureElements = function(originalList, newElements, sourceSelection, sourceQuery, keyFieldName)
{
	let restrictedMeasureMap = oFF.XHashMapByString.create();
	let newlyAddedMeasures = oFF.PrList.create();
	if (oFF.notNull(newElements))
	{
		for (let i = 0; i < newElements.size(); i++)
		{
			let element = newElements.get(i);
			if (!originalList.contains(element))
			{
				let measureElement = element;
				let measureName = measureElement.getStringByKey(oFF.InAQueryMergeConstants.QY_MEMBER_NAME);
				if (oFF.XStringUtils.isNullOrEmpty(measureName))
				{
					let memberOperand = measureElement.getStructureByKey(oFF.InAQueryMergeConstants.QY_MEMBER_OPERAND);
					if (oFF.notNull(memberOperand))
					{
						measureName = memberOperand.getStringByKey(oFF.InAQueryMergeConstants.QY_VALUE);
					}
					if (oFF.XStringUtils.isNullOrEmpty(measureName))
					{
						measureName = measureElement.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
					}
				}
				if (measureElement.getBooleanByKeyExt(oFF.InAQueryMergeConstants.TAG_MEASURE_MEMBER_TOUCHED, false))
				{
					this.createRestrictedMeasure(measureElement, keyFieldName, newlyAddedMeasures, restrictedMeasureMap, true);
				}
				else if (oFF.XStream.of(originalList).find(oFF.InARestrictedMeasureUtils.getMeasureWithName(measureName)).isPresent())
				{
					this.createRestrictedMeasure(measureElement, keyFieldName, newlyAddedMeasures, restrictedMeasureMap, false);
				}
				else
				{
					newlyAddedMeasures.add(measureElement);
				}
			}
		}
	}
	this.replaceMeasureInSelection(sourceSelection, restrictedMeasureMap);
	this.assignRestrictedMeasureToSourceQuery(sourceQuery, restrictedMeasureMap);
	this.replaceFormulaAndSelectionReferencesWithRMName(restrictedMeasureMap, newlyAddedMeasures);
	for (let k = 0; k < newlyAddedMeasures.size(); k++)
	{
		let iPrElement = newlyAddedMeasures.get(k);
		if (!originalList.contains(iPrElement))
		{
			originalList.add(iPrElement);
		}
	}
};
oFF.InAMergeRequestBuilder.prototype.releaseObject = function()
{
	this.m_inaMergeRegistryManager = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.InAMergeRequestBuilder.prototype.replaceFormulaAndSelectionReferencesWithRMName = function(restrictedMeasureMap, measureMembers)
{
	let restrictedMeasureNames = restrictedMeasureMap.getKeysAsReadOnlyList();
	for (let i = 0; i < restrictedMeasureNames.size(); i++)
	{
		let restrictedMeasureName = restrictedMeasureNames.get(i);
		let originalMeasureName = restrictedMeasureMap.getByKey(restrictedMeasureName);
		for (let j = 0; j < measureMembers.size(); j++)
		{
			let measureElement = measureMembers.get(j);
			let measureElementName = measureElement.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
			if (oFF.XString.isEqual(restrictedMeasureName, measureElementName))
			{
				continue;
			}
			let formula = measureElement.getStructureByKey(oFF.InAQueryMergeConstants.QY_FORMULA);
			let selection = measureElement.getStructureByKey(oFF.InAQueryMergeConstants.QY_SELECTION);
			if (oFF.notNull(formula))
			{
				let formulaString = formula.getStringRepresentation();
				let newFormula = oFF.XString.replace(formulaString, originalMeasureName, restrictedMeasureName);
				let newFormulaStructure = oFF.JsonParserFactory.createFromString(newFormula);
				measureElement.put(oFF.InAQueryMergeConstants.QY_FORMULA, newFormulaStructure);
			}
			else if (oFF.notNull(selection))
			{
				oFF.InAQueryMergeUtils.replaceOrRemoveTag(selection, oFF.InAQueryMergeConstants.QY_LOW, originalMeasureName, restrictedMeasureName);
			}
		}
	}
};
oFF.InAMergeRequestBuilder.prototype.replaceMeasureInSelection = function(sourceSelection, restrictedMeasureMap)
{
	let restrictedMeasureNames = restrictedMeasureMap.getKeysAsReadOnlyList();
	for (let i = 0; i < restrictedMeasureNames.size(); i++)
	{
		let restrictedMeasureName = restrictedMeasureNames.get(i);
		let originalMeasureName = restrictedMeasureMap.getByKey(restrictedMeasureName);
		oFF.InARestrictedMeasureUtils.replaceMeasureInSelection(sourceSelection, originalMeasureName, restrictedMeasureName);
	}
};
oFF.InAMergeRequestBuilder.prototype.setAutoSubmitFlag = function(inaResultSetFeatureRequest)
{
	if (inaResultSetFeatureRequest.containsKey(oFF.InAQueryMergeConstants.QY_IGNORE_AUTO_SUBMIT))
	{
		inaResultSetFeatureRequest.remove(oFF.InAQueryMergeConstants.QY_IGNORE_AUTO_SUBMIT);
		inaResultSetFeatureRequest.putBoolean(oFF.InAQueryMergeConstants.QY_IGNORE_AUTO_SUBMIT, false);
	}
};
oFF.InAMergeRequestBuilder.prototype.setupInAMergeRequestBuilder = function(inaMergeRegistryManager)
{
	this.m_inaMergeRegistryManager = inaMergeRegistryManager;
};

oFF.InAMergeResponseDispatcher = function() {};
oFF.InAMergeResponseDispatcher.prototype = new oFF.XObject();
oFF.InAMergeResponseDispatcher.prototype._ff_c = "InAMergeResponseDispatcher";

oFF.InAMergeResponseDispatcher.create = function(inaMergeRegistryManager)
{
	let inaMergeResponseDispatcher = new oFF.InAMergeResponseDispatcher();
	inaMergeResponseDispatcher.setupInAMergeResponseDispatcher(inaMergeRegistryManager);
	return inaMergeResponseDispatcher;
};
oFF.InAMergeResponseDispatcher.prototype.m_inaMergeRegistryManager = null;
oFF.InAMergeResponseDispatcher.prototype.addResponseToAllSourceQueries = function(inaDataProvider, responseRootElement)
{
	let sourceIds = inaDataProvider.getSourceInstanceIds();
	for (let i = 0; i < sourceIds.size(); i++)
	{
		let sourceId = sourceIds.get(i);
		let sourceQuery = this.m_inaMergeRegistryManager.getInASourceQuery(sourceId);
		if (oFF.notNull(sourceQuery))
		{
			this.addResponseToRpcFunction(sourceQuery, responseRootElement);
			sourceQuery.setQueryState(oFF.InAQueryMergeConstants.QUERY_STATE_PROCESSED);
		}
	}
};
oFF.InAMergeResponseDispatcher.prototype.addResponseToRpcFunction = function(sourceQuery, sourceQueryResponseElement)
{
	let sourceFunction = sourceQuery.getRpcFunction();
	sourceFunction.getRpcResponse().setRootElement(sourceQueryResponseElement, null);
};
oFF.InAMergeResponseDispatcher.prototype.buildAllGridElementsForParent = function(systemType, parentElement, newParentElement, gridMemberPosition, tupleCount, gridNewELementsMap)
{
	let keysOfSubElements = parentElement.getKeysAsReadOnlyList();
	for (let j = 0; j < keysOfSubElements.size(); j++)
	{
		let newGridElementName = keysOfSubElements.get(j);
		let elementPath = oFF.XStringUtils.concatenate2(oFF.InAQueryMergeConstants.PA_PATH_PREFIX, newGridElementName);
		let oldSubElement = oFF.PrUtilsJsonPath.getFirstElementFromPath(parentElement, elementPath);
		if (oldSubElement.isStructure())
		{
			let newGridElement = gridNewELementsMap.getByKey(newGridElementName);
			let oldGridElement = oFF.PrUtilsJsonPath.getFirstElementFromPath(parentElement, elementPath);
			if (oFF.notNull(newGridElement) && !newGridElement.containsKey(oFF.InAQueryMergeConstants.QY_ENCODING))
			{
				newGridElement.putString(oFF.InAQueryMergeConstants.QY_ENCODING, oldGridElement.getStringByKey(oFF.InAQueryMergeConstants.QY_ENCODING));
			}
			this.dispatchTupleValues(oldGridElement, newGridElement, gridMemberPosition, tupleCount, null);
			newParentElement.remove(newGridElementName);
			newParentElement.put(newGridElementName, newGridElement);
		}
	}
};
oFF.InAMergeResponseDispatcher.prototype.buildAttributeMembers = function(sourceQuery, measureDimension, gridMembersPositionMap, sourceMemberPositionMap, tupleCount)
{
	let attributes = oFF.PrUtilsJsonPath.getFirstElementFromPath(measureDimension, oFF.InAQueryMergeConstants.PA_ATTRIBUTES_RELATIVE_PATH);
	let newAttributes = oFF.PrFactory.createList();
	let measureDimensionName = sourceQuery.getMeasureDimensionName();
	let membersMetadata = this.m_inaMergeRegistryManager.getMembersMetadata(measureDimensionName);
	for (let i = 0; i < attributes.size(); i++)
	{
		let attribute = attributes.get(i);
		let newAttribute = oFF.PrFactory.createStructureDeepCopy(attribute);
		newAttribute.remove(oFF.InAQueryMergeConstants.QY_VALUES);
		newAttribute.remove(oFF.InAQueryMergeConstants.QY_VALUES_EXCEPTION);
		for (let j = 0; j < sourceMemberPositionMap.size(); j++)
		{
			let measureMemberName = sourceMemberPositionMap.getByKey(oFF.XIntegerValue.create(j));
			let gridMemberPosition = gridMembersPositionMap.getByKey(measureMemberName).getInteger();
			this.dispatchTupleValues(attribute, newAttribute, gridMemberPosition, tupleCount, null);
			this.mapRestrictedMeasureToSourceMember(sourceQuery, newAttribute, membersMetadata, measureDimensionName);
			if (attribute.containsKey(oFF.InAQueryMergeConstants.QY_VALUES_EXCEPTION))
			{
				this.dispatchTupleValues(attribute, newAttribute, gridMemberPosition, tupleCount, oFF.InAQueryMergeConstants.QY_VALUES_EXCEPTION);
			}
		}
		newAttributes.add(newAttribute);
	}
	measureDimension.remove(oFF.InAQueryMergeConstants.QY_ATTRIBUTES);
	measureDimension.put(oFF.InAQueryMergeConstants.QY_ATTRIBUTES, newAttributes);
};
oFF.InAMergeResponseDispatcher.prototype.buildCells = function(rsGrid, gridMembersPositionMap, measureDimensionAxisType, sourceMemberPositionMap)
{
	let sourceMembersCount = sourceMemberPositionMap.size();
	let isMeasureOnColumns = oFF.XString.isEqual(measureDimensionAxisType, oFF.InAQueryMergeConstants.QY_COLUMNS);
	let cellsArraySizes = oFF.PrUtilsJsonPath.getFirstElementFromPath(rsGrid, oFF.InAQueryMergeConstants.PA_CELLS_ARRAY_SIZES_PATH);
	let rowSize = cellsArraySizes.getIntegerAt(0);
	let columnsSize = cellsArraySizes.getIntegerAt(1);
	let tupleCount = isMeasureOnColumns ? rowSize : columnsSize;
	if (isMeasureOnColumns)
	{
		cellsArraySizes.clear();
		cellsArraySizes.addInteger(tupleCount);
		cellsArraySizes.addInteger(sourceMembersCount);
	}
	else
	{
		cellsArraySizes.clear();
		cellsArraySizes.addInteger(sourceMembersCount);
		cellsArraySizes.addInteger(tupleCount);
	}
	let cellsElement = oFF.PrUtilsJsonPath.getFirstElementFromPath(rsGrid, oFF.InAQueryMergeConstants.PA_CELLS_PATH);
	if (oFF.notNull(cellsElement))
	{
		let keysOfSubElements = cellsElement.getKeysAsReadOnlyList();
		for (let j = 0; j < keysOfSubElements.size(); j++)
		{
			let subElementKey = keysOfSubElements.get(j);
			let subElementPath = oFF.XStringUtils.concatenate2(oFF.InAQueryMergeConstants.PA_PATH_PREFIX, subElementKey);
			let cellsSubElement = oFF.PrUtilsJsonPath.getFirstElementFromPath(cellsElement, subElementPath);
			this.dispatchCellValues(cellsSubElement, gridMembersPositionMap, sourceMemberPositionMap, tupleCount);
		}
	}
};
oFF.InAMergeResponseDispatcher.prototype.buildGridElements = function(sourceId, sourceQuery, sourceQueryGrid)
{
	let measureDimension = sourceQuery.getMeasureDimension();
	if (oFF.notNull(measureDimension))
	{
		let measureDimensionAxisType = measureDimension.getStringByKey(oFF.InAQueryMergeConstants.QY_AXIS);
		let measureDimensionName = measureDimension.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
		let gridMembersPositionMap = oFF.XSimpleMap.create();
		let sourceMemberPositionMap = sourceQuery.getMeasureMemberPositionMap();
		this.buildMeasureMembers(sourceQuery, sourceQueryGrid, gridMembersPositionMap, measureDimensionName, measureDimensionAxisType, sourceMemberPositionMap);
		this.buildCells(sourceQueryGrid, gridMembersPositionMap, measureDimensionAxisType, sourceMemberPositionMap);
	}
};
oFF.InAMergeResponseDispatcher.prototype.buildMeasureMembers = function(sourceQuery, rsGrid, gridMembersPositionMap, measureDimensionName, measureDimensionAxisType, sourceMemberPositionMap)
{
	let systemType = sourceQuery.getSystemType();
	let totalMembersSize = sourceMemberPositionMap.size();
	let axes = oFF.PrUtilsJsonPath.getFirstElementFromPath(rsGrid, oFF.InAQueryMergeConstants.PA_AXES_PATH);
	for (let a = 0; a < axes.size(); a++)
	{
		let axis = axes.get(a);
		let axisType = axis.getStringByKey(oFF.InAQueryMergeConstants.QY_TYPE);
		if (oFF.XString.isEqual(axisType, measureDimensionAxisType))
		{
			let measureDimension = null;
			let originalAxis = null;
			let dimensions = oFF.PrUtilsJsonPath.getFirstElementFromPath(axis, oFF.InAQueryMergeConstants.PA_DIMENSIONS_RELATIVE_PATH);
			for (let i = 0; i < dimensions.size(); i++)
			{
				let dimension = dimensions.get(i);
				let dimensionName = dimension.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
				if (oFF.XString.isEqual(measureDimensionName, dimensionName))
				{
					measureDimension = dimension;
					originalAxis = oFF.PrFactory.createStructureDeepCopy(axis);
					break;
				}
			}
			let gridMeasureMembersSize = -1;
			let tupleCount = axis.getIntegerByKey(oFF.InAQueryMergeConstants.QY_TUPLE_COUNT);
			if (oFF.notNull(measureDimension))
			{
				let originalMeasureDimension = oFF.PrFactory.createStructureDeepCopy(measureDimension);
				let gridNewELementsMap = oFF.XHashMapByString.create();
				this.createSubElementsForParentElement(originalMeasureDimension, gridNewELementsMap);
				this.createSubElementsForParentElement(originalAxis, gridNewELementsMap);
				this.getValuesOfKeyAttribute(measureDimension, gridMembersPositionMap);
				gridMeasureMembersSize = gridMeasureMembersSize === -1 ? gridMembersPositionMap.size() : gridMeasureMembersSize;
				for (let m = 0; m < sourceMemberPositionMap.size(); m++)
				{
					let measureMemberName = sourceMemberPositionMap.getByKey(oFF.XIntegerValue.create(m));
					let position = gridMembersPositionMap.getByKey(measureMemberName);
					if (oFF.isNull(position))
					{
						let usedBasicMemberName = sourceQuery.getSourceMemberName(measureMemberName.getString());
						position = gridMembersPositionMap.getByKey(oFF.XStringValue.create(usedBasicMemberName));
					}
					let gridMemberPosition = position.getInteger();
					this.buildAllGridElementsForParent(systemType, originalMeasureDimension, measureDimension, gridMemberPosition, tupleCount, gridNewELementsMap);
					this.buildAllGridElementsForParent(systemType, originalAxis, axis, gridMemberPosition, tupleCount, gridNewELementsMap);
					let tuples = oFF.PrUtilsJsonPath.getFirstElementFromPath(originalAxis, oFF.InAQueryMergeConstants.PA_TUPLES_RELATIVE_PATH);
					for (let k = 0; k < tuples.size(); k++)
					{
						let originalTuple = tuples.get(k);
						this.createSubElementsForParentElement(originalTuple, gridNewELementsMap);
						this.buildAllGridElementsForParent(systemType, originalTuple, measureDimension, gridMemberPosition, tupleCount, gridNewELementsMap);
					}
				}
				this.buildAttributeMembers(sourceQuery, measureDimension, gridMembersPositionMap, sourceMemberPositionMap, tupleCount);
			}
			if (gridMeasureMembersSize !== -1)
			{
				axis.remove(oFF.InAQueryMergeConstants.QY_TUPLE_COUNT);
				axis.putInteger(oFF.InAQueryMergeConstants.QY_TUPLE_COUNT, oFF.XMath.div(tupleCount, gridMeasureMembersSize) * totalMembersSize);
				axis.remove(oFF.InAQueryMergeConstants.QY_TUPLE_COUNT_TOTAL);
				axis.putInteger(oFF.InAQueryMergeConstants.QY_TUPLE_COUNT_TOTAL, oFF.XMath.div(tupleCount, gridMeasureMembersSize) * totalMembersSize);
			}
		}
	}
};
oFF.InAMergeResponseDispatcher.prototype.createSubElementsForParentElement = function(parentElement, gridNewELementsMap)
{
	let keysOfSubElements = parentElement.getKeysAsReadOnlyList();
	for (let j = 0; j < keysOfSubElements.size(); j++)
	{
		let elementKey = keysOfSubElements.get(j);
		let newElement = oFF.PrFactory.createStructure();
		gridNewELementsMap.put(elementKey, newElement);
	}
};
oFF.InAMergeResponseDispatcher.prototype.dispatchCellValues = function(cellsSubElement, gridMembersPositionMap, memberPositionMap, tupleCount)
{
	let valuesListPath = oFF.XStringUtils.concatenate2(oFF.InAQueryMergeConstants.PA_PATH_PREFIX, oFF.InAQueryMergeConstants.QY_VALUES);
	let values = oFF.PrUtilsJsonPath.getFirstElementFromPath(cellsSubElement, valuesListPath);
	if (oFF.notNull(values))
	{
		let memberMembersCountOfSourceQuery = memberPositionMap.size();
		let valuesSize = values.size();
		let hightOfArray = tupleCount;
		let widthOfArray = valuesSize / hightOfArray;
		let newSize = memberMembersCountOfSourceQuery * tupleCount;
		let sizeFromJson = cellsSubElement.getIntegerByKeyExt(oFF.InAQueryMergeConstants.QY_SIZE, -1);
		if (sizeFromJson !== -1)
		{
			cellsSubElement.remove(oFF.InAQueryMergeConstants.QY_SIZE);
			cellsSubElement.putInteger(oFF.InAQueryMergeConstants.QY_SIZE, newSize);
		}
		let newValues = oFF.PrFactory.createList();
		for (let j = 0; j < hightOfArray; j++)
		{
			for (let k = 0; k < memberMembersCountOfSourceQuery; k++)
			{
				for (let i = j * widthOfArray; i < (j + 1) * widthOfArray; i++)
				{
					let measureMemberName = memberPositionMap.getByKey(oFF.XIntegerValue.create(k));
					let memberPosition = gridMembersPositionMap.getByKey(measureMemberName).getInteger();
					if (oFF.XMath.mod(i, widthOfArray) === memberPosition)
					{
						newValues.add(values.get(i));
						break;
					}
				}
			}
		}
		cellsSubElement.remove(oFF.InAQueryMergeConstants.QY_VALUES);
		cellsSubElement.put(oFF.InAQueryMergeConstants.QY_VALUES, newValues);
	}
};
oFF.InAMergeResponseDispatcher.prototype.dispatchInAResponse = function(inaDataProvider, extResult)
{
	this.processInADataProviderResponse(inaDataProvider, extResult);
	this.finalizeFunctionsAndCleanupQueries(inaDataProvider, extResult);
};
oFF.InAMergeResponseDispatcher.prototype.dispatchResponse = function(responseElement, inaDataProvider)
{
	let sourceIds = inaDataProvider.getSourceInstanceIds();
	let sourceId = null;
	let mergeId = null;
	if (inaDataProvider.isStandAloneQuery())
	{
		sourceId = sourceIds.get(0);
		let standAloneSourceQuery = this.m_inaMergeRegistryManager.getInASourceQuery(sourceId);
		if (oFF.notNull(standAloneSourceQuery))
		{
			mergeId = standAloneSourceQuery.getInstanceId();
			this.finalizeResponse(mergeId, standAloneSourceQuery, responseElement);
		}
	}
	else
	{
		mergeId = inaDataProvider.getInstanceId();
		for (let i = 0; i < sourceIds.size(); i++)
		{
			sourceId = sourceIds.get(i);
			let sourceQuery = this.m_inaMergeRegistryManager.getInASourceQuery(sourceId);
			if (oFF.isNull(sourceQuery))
			{
				continue;
			}
			let sourceQueryResponseElement = oFF.PrFactory.createStructureDeepCopy(responseElement);
			let sourceQueryGrid = sourceQueryResponseElement.getListByKey(oFF.InAQueryMergeConstants.QY_GRIDS).get(0);
			let dataSourceStructure = inaDataProvider.getSystemType().isTypeOf(oFF.SystemType.BW) ? sourceQueryGrid : responseElement;
			oFF.InAQueryMergeUtils.overwriteInstanceIdInDataSource(dataSourceStructure, sourceId);
			this.buildGridElements(sourceId, sourceQuery, sourceQueryGrid);
			this.finalizeResponse(mergeId, sourceQuery, sourceQueryResponseElement);
		}
	}
};
oFF.InAMergeResponseDispatcher.prototype.dispatchTupleValues = function(gridElement, newGridElement, memberPosition, tupleCount, listName)
{
	let tempListName = oFF.notNull(listName) ? listName : oFF.InAQueryMergeConstants.QY_VALUES;
	let tempGridElement = oFF.notNull(newGridElement) ? newGridElement : gridElement;
	let listPath = oFF.XStringUtils.concatenate2(oFF.InAQueryMergeConstants.PA_PATH_PREFIX, tempListName);
	let values = oFF.PrUtilsJsonPath.getFirstElementFromPath(gridElement, listPath);
	let indexReference = oFF.XMath.mod(memberPosition, tupleCount);
	if (oFF.notNull(values))
	{
		let valuesSize = values.size();
		if (gridElement.containsKey(oFF.InAQueryMergeConstants.QY_SIZE))
		{
			let size = tempGridElement.getIntegerByKeyExt(oFF.InAQueryMergeConstants.QY_SIZE, -1);
			if (size !== -1)
			{
				tempGridElement.remove(oFF.InAQueryMergeConstants.QY_SIZE);
			}
			let newSize = size !== -1 ? size + 1 : oFF.XMath.div(valuesSize, tupleCount);
			tempGridElement.putInteger(oFF.InAQueryMergeConstants.QY_SIZE, newSize);
		}
		if (gridElement.containsKey(tempListName))
		{
			let newValuesFromNewGridElement = tempGridElement.getListByKey(tempListName);
			let newValues = oFF.notNull(newValuesFromNewGridElement) ? newValuesFromNewGridElement : oFF.PrFactory.createList();
			for (let i = 0; i < valuesSize; i++)
			{
				if (oFF.XMath.mod(i, tupleCount) === indexReference)
				{
					newValues.add(values.get(i));
				}
			}
			if (oFF.isNull(newValuesFromNewGridElement))
			{
				tempGridElement.put(tempListName, newValues);
			}
		}
	}
};
oFF.InAMergeResponseDispatcher.prototype.finalizeFunctionsAndCleanupQueries = function(inaDataProvider, extResult)
{
	let continueUnRegister = true;
	if (inaDataProvider.isPreQuery())
	{
		let preQueryName = inaDataProvider.getPreQueryName();
		let mainQueryInADataProviders = this.m_inaMergeRegistryManager.getDependentQueryInADataProviders(preQueryName);
		for (let mainQueryIndex = 0; mainQueryIndex < mainQueryInADataProviders.size(); mainQueryIndex++)
		{
			let mainQueryDataProvider = mainQueryInADataProviders.get(mainQueryIndex);
			if (mainQueryDataProvider.isMergeChecked())
			{
				continueUnRegister = false;
				break;
			}
		}
	}
	let sourceIds = inaDataProvider.getSourceInstanceIds();
	for (let i = 0; i < sourceIds.size(); i++)
	{
		let sourceId = sourceIds.get(i);
		let inaSourceQuery = this.m_inaMergeRegistryManager.getInASourceQuery(sourceId);
		if (oFF.isNull(inaSourceQuery))
		{
			continue;
		}
		let _function = inaSourceQuery.getRpcFunction();
		_function.addAllMessages(extResult);
		_function.endSync();
		if (continueUnRegister)
		{
			this.m_inaMergeRegistryManager.unregisterInASourceQuery(sourceId);
		}
		else
		{
			inaSourceQuery.setQueryState(oFF.InAQueryMergeConstants.QUERY_STATE_MERGE_CHECKED);
		}
	}
	if (continueUnRegister)
	{
		this.m_inaMergeRegistryManager.unregisterInADataProvider(inaDataProvider.getGroupSignature(), inaDataProvider.getInstanceId());
	}
	else
	{
		inaDataProvider.setQueryState(oFF.InAQueryMergeConstants.QUERY_STATE_MERGE_CHECKED);
	}
};
oFF.InAMergeResponseDispatcher.prototype.finalizeResponse = function(mergeId, sourceQuery, sourceQueryResponseElement)
{
	let sourceQueryGrid = sourceQueryResponseElement.getListByKey(oFF.InAQueryMergeConstants.QY_GRIDS).get(0);
	sourceQueryGrid.putString(oFF.InAQueryMergeConstants.TAG_MERGE_ID, mergeId);
	this.addResponseToRpcFunction(sourceQuery, sourceQueryResponseElement);
	sourceQuery.setQueryState(oFF.InAQueryMergeConstants.QUERY_STATE_PROCESSED);
};
oFF.InAMergeResponseDispatcher.prototype.getAttributeValue = function(attributeName, memberMetadata)
{
	let attributeValue = oFF.isNull(memberMetadata) ? null : memberMetadata.getStringByKey(attributeName);
	return attributeValue;
};
oFF.InAMergeResponseDispatcher.prototype.getMemberMetadata = function(membersMetadata, measureDimensionName, basicMemberName)
{
	if (oFF.notNull(membersMetadata))
	{
		let keyFieldName = this.m_inaMergeRegistryManager.getKeyFieldOfDimension(measureDimensionName);
		for (let i = 0; i < membersMetadata.size(); i++)
		{
			let memberMetadata = membersMetadata.get(i);
			if (oFF.XString.isEqual(memberMetadata.getStringByKey(keyFieldName), basicMemberName))
			{
				return memberMetadata;
			}
		}
	}
	return null;
};
oFF.InAMergeResponseDispatcher.prototype.getSourceMemberName = function(sourceQuery, oldAttributeValue)
{
	let sourceMemberName = sourceQuery.getSourceMemberName(oldAttributeValue);
	if (oFF.isNull(sourceMemberName))
	{
		return oldAttributeValue;
	}
	return this.getSourceMemberName(sourceQuery, sourceMemberName);
};
oFF.InAMergeResponseDispatcher.prototype.getValuesOfKeyAttribute = function(dimension, gridMembersPositionMap)
{
	let attributes = oFF.PrUtilsJsonPath.getFirstElementFromPath(dimension, oFF.InAQueryMergeConstants.PA_ATTRIBUTES_RELATIVE_PATH);
	for (let i = 0; i < attributes.size(); i++)
	{
		let attribute = attributes.get(i);
		if (attribute.getBooleanByKey(oFF.InAQueryMergeConstants.QY_IS_KEY))
		{
			let keyValues = attribute.getListByKey(oFF.InAQueryMergeConstants.QY_VALUES);
			for (let j = 0; j < keyValues.size(); j++)
			{
				let memberName = oFF.XStringValue.create(keyValues.getStringAt(j));
				gridMembersPositionMap.put(memberName, oFF.XIntegerValue.create(j));
			}
		}
	}
};
oFF.InAMergeResponseDispatcher.prototype.mapRestrictedMeasureToSourceMember = function(sourceQuery, attribute, membersMetadata, measureDimensionName)
{
	let newValues = oFF.PrFactory.createList();
	let oldValues = attribute.getListByKey(oFF.InAQueryMergeConstants.QY_VALUES);
	let attributeName = attribute.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
	for (let i = 0; i < oldValues.size(); i++)
	{
		let oldAttributeValue = oldValues.getStringAt(i);
		let sourceMemberName = this.getSourceMemberName(sourceQuery, oldAttributeValue);
		let memberMetadata = this.getMemberMetadata(membersMetadata, measureDimensionName, sourceMemberName);
		let newAttributeValue = null;
		if (oFF.isNull(memberMetadata) && oFF.notNull(sourceMemberName))
		{
			let members = sourceQuery.getMeasureDimension().getListByKey(oFF.InAQueryMergeConstants.QY_MEMBERS);
			for (let j = 0; j < members.size(); j++)
			{
				let member = members.getStructureAt(j);
				if (oFF.XString.isEqual(member.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME), sourceMemberName))
				{
					let isKey = attribute.getBooleanByKey(oFF.InAQueryMergeConstants.QY_IS_KEY);
					newAttributeValue = isKey ? sourceMemberName : member.getStringByKey(oFF.InAQueryMergeConstants.QY_DESCRIPTION);
					break;
				}
			}
		}
		else
		{
			newAttributeValue = oFF.isNull(memberMetadata) ? oldAttributeValue : this.getAttributeValue(attributeName, memberMetadata);
		}
		if (oFF.isNull(newAttributeValue))
		{
			newAttributeValue = sourceMemberName;
		}
		newValues.addString(newAttributeValue);
	}
	attribute.remove(oFF.InAQueryMergeConstants.QY_VALUES);
	attribute.put(oFF.InAQueryMergeConstants.QY_VALUES, newValues);
};
oFF.InAMergeResponseDispatcher.prototype.processInADataProviderResponse = function(inaDataProvider, extResult)
{
	let response = extResult.getData();
	let batchRootElement = response.getRootElement();
	let batchList = batchRootElement.getListByKey(oFF.InAQueryMergeConstants.QY_BATCH);
	let responseRootElement = oFF.notNull(batchList) ? batchList.getStructureAt(0) : batchRootElement;
	let messages = oFF.PrUtilsJsonPath.getFirstElementFromPath(responseRootElement, oFF.InAQueryMergeConstants.PA_MESSAGES_PATH);
	let isResponseWithError = false;
	if (oFF.notNull(messages))
	{
		for (let i = 0; i < messages.size(); i++)
		{
			let message = messages.getStructureAt(i);
			if (message.getIntegerByKeyExt(oFF.InAQueryMergeConstants.QY_TYPE, -1) === 2)
			{
				isResponseWithError = true;
				break;
			}
		}
	}
	if (extResult.isValid() && !isResponseWithError)
	{
		this.dispatchResponse(responseRootElement, inaDataProvider);
	}
	else
	{
		this.addResponseToAllSourceQueries(inaDataProvider, responseRootElement);
	}
	inaDataProvider.setQueryState(oFF.InAQueryMergeConstants.QUERY_STATE_PROCESSED);
};
oFF.InAMergeResponseDispatcher.prototype.releaseObject = function()
{
	this.m_inaMergeRegistryManager = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.InAMergeResponseDispatcher.prototype.setupInAMergeResponseDispatcher = function(inaMergeRegistryManager)
{
	this.m_inaMergeRegistryManager = inaMergeRegistryManager;
};

oFF.InAQueryMergeConstants = {

	PA_ANALYTICS_SERVICE_TYPE_PATH:"$.Analytics",
	PA_ATTRIBUTES_RELATIVE_PATH:"$.Attributes",
	PA_AXES_PATH:"$.Axes",
	PA_CAPABILTIES_PATH:"$.Analytics.Capabilities",
	PA_CELLS_ARRAY_SIZES_PATH:"$.CellArraySizes",
	PA_CELLS_EXCEPTIONS_RELATIVE_PATH:"$.Exceptions",
	PA_CELLS_EXCEPTION_ALERT_LEVEL_RELATIVE_PATH:"$.ExceptionAlertLevel",
	PA_CELLS_EXCEPTION_NAME_RELATIVE_PATH:"$.ExceptionName",
	PA_CELLS_FORMAT_RELATIVE_PATH:"$.CellFormat",
	PA_CELLS_INPUT_ENABLED_RELATIVE_PATH:"$.InputEnabled",
	PA_CELLS_LOCKED_VALUE_RELATIVE_PATH:"$.LockedValue",
	PA_CELLS_NUMERIC_ROUNDING_RELATIVE_PATH:"$.NumericRounding",
	PA_CELLS_NUMERIC_SHIFT_RELATIVE_PATH:"$.NumericShift",
	PA_CELLS_PATH:"$.Cells",
	PA_CELLS_QUERY_DATACELL_REFERENCES_RELATIVE_PATH:"$.QueryDataCellReferences",
	PA_CELLS_UNITS_RELATIVE_PATH:"$.Units",
	PA_CELLS_UNIT_DESCRIPTIONS_RELATIVE_PATH:"$.UnitDescriptions",
	PA_CELLS_UNIT_INDEX_RELATIVE_PATH:"$.UnitIndex",
	PA_CELLS_UNIT_POSITIONS_RELATIVE_PATH:"$.UnitPositions",
	PA_CELLS_UNIT_TYPES_RELATIVE_PATH:"$.UnitTypes",
	PA_CELLS_VALUES_FORMATTED_RELATIVE_PATH:"$.ValuesFormatted",
	PA_CELLS_VALUES_RELATIVE_PATH:"$.Values",
	PA_CELLS_VALUES_ROUNDED_RELATIVE_PATH:"$.ValuesRounded",
	PA_CELLS_VALUE_TYPES_RELATIVE_PATH:"$.CellValueTypes",
	PA_CELL_CONTEXT_REQUESTS_PATH:"$.Analytics.Definition.CellContextRequests",
	PA_CONDITIONS_PATH:"$.Analytics.Definition.Conditions",
	PA_CURRENCY_TRANSLATION_PATH:"$.Analytics.Definition.CurrencyTranslation",
	PA_DATASOURCE_OBJECTNAME_PATH:"$.Analytics.DataSource.ObjectName",
	PA_DATASOURCE_PACKAGE_PATH:"$.Analytics.DataSource.PackageName",
	PA_DATASOURCE_PATH:"$.Analytics.DataSource",
	PA_DATASOURCE_SCHEMA_PATH:"$.Analytics.DataSource.SchemaName",
	PA_DATASOURCE_TYPE_PATH:"$.Analytics.DataSource.Type",
	PA_DEFINITION_PATH:"$.Analytics.Definition",
	PA_DIMENSIONS_PATH:"$.Analytics.Definition.Dimensions",
	PA_DIMENSIONS_RELATIVE_PATH:"$.Dimensions",
	PA_DISPLAY_LEVEL_RELATIVE_PATH:"$.DisplayLevel",
	PA_DRILLDOWN_DIMENSIONS_VIRTUAL_PATH:"$.Analytics.Definition.DrillDown",
	PA_DRILL_STATE_RELATIVE_PATH:"$.DrillState",
	PA_DYNAMIC_FILTER_PATH:"$.Analytics.Definition.DynamicFilter",
	PA_EXCEPTIONS_PATH:"$.Analytics.Definition.Exceptions",
	PA_EXCEPTION_ALERT_LEVEL_RELATIVE_PATH:"$.ExceptionAlertLevel",
	PA_EXCEPTION_NAME_RELATIVE_PATH:"$.ExceptionName",
	PA_FILTER_PATH:"$.Analytics.Definition.Filter",
	PA_FIXED_FILTER_PATH:"$.Analytics.Definition.FixedFilter",
	PA_HIERARCHY_NAVIGATIONS_PATH:"$.Analytics.Definition.HierarchyNavigations",
	PA_HINTS_PATH:"$.Analytics.Definition.Hints",
	PA_LANGUAGE_PATH:"$.Analytics.Language",
	PA_MEASURE_STRUCTURE_WITHOUT_MEMBERS_VIRTUAL_PATH:"$.Analytics.Definition.MeasureStructureWithoutMembers",
	PA_MEMBER_INDEXES_RELATIVE_PATH:"$.MemberIndexes",
	PA_MEMBER_OPERAND_RELATIVE_PATH:"$.MemberOperand",
	PA_MEMBER_TYPES_RELATIVE_PATH:"$.MemberTypes",
	PA_MESSAGES_PATH:"$.Messages",
	PA_OPTIONS_PATH:"$.Options",
	PA_PARENT_INDEXES_RELATIVE_PATH:"$.ParentIndexes",
	PA_PATH_PREFIX:"$.",
	PA_PATH_SPLITER:".",
	PA_PATH_START_KEY:"$",
	PA_QUERY_AXES_PATH:"$.Analytics.Definition.Query.Axes",
	PA_QUERY_DATACELLS_PATH:"$.Analytics.Definition.QueryDataCells",
	PA_QUERY_PATH:"$.Analytics.Definition.Query",
	PA_RS_FEATURE_REQUEST_PATH:"$.Analytics.Definition.ResultSetFeatureRequest",
	PA_SORT_PATH:"$.Analytics.Definition.Sort",
	PA_TUPLES_RELATIVE_PATH:"$.Tuples",
	PA_UDH_PATH:"$.Analytics.Definition.UniversalDisplayHierarchies",
	PA_VARIABLES_PATH:"$.Analytics.Definition.Variables",
	PA_VISIBILITY_FILTER_PATH:"$.Analytics.Definition.VisibilityFilter",
	QUERY_STATE_INIT:"Init",
	QUERY_STATE_MERGE_CHECKED:"Checked",
	QUERY_STATE_PENDING_PROCESSING:"Pending",
	QUERY_STATE_PROCESSED:"Processed",
	QY_ANALYTICS:"Analytics",
	QY_AND:"And",
	QY_ASYNC_RESPONSE_REQUEST:"AsyncResponseRequest",
	QY_ATTRIBUTES:"Attributes",
	QY_ATTRIBUTE_VALUE:"AttributeValue",
	QY_AXIS:"Axis",
	QY_BATCH:"Batch",
	QY_BATCH_ID:"BatchId",
	QY_CALCULATED_MEASURE:"CalculatedMeasure",
	QY_CAPABILITIES:"Capabilities",
	QY_CELL_CONTEXT_REQUESTS:"CellContextRequests",
	QY_CELL_VALUE_TYPE:"CellValueType",
	QY_CLIENT_INFO:"ClientInfo",
	QY_CLUSTER_DEFINITION:"ClusterDefinition",
	QY_CODE:"Code",
	QY_COLUMNS:"Columns",
	QY_COMPARISON:"Comparison",
	QY_CONDITIONS:"Conditions",
	QY_CONVERT_TO_FLAT_SELECTION:"ConvertToFlatSelection",
	QY_CURRENCY_TRANSLATION:"CurrencyTranslation",
	QY_DATASOURCE:"DataSource",
	QY_DEFAULT_KEY_ATTRIBUTE:"DefaultKeyAttribute",
	QY_DEFAULT_SELECTED_DIMENSIONS:"DefaultSelectedDimensions",
	QY_DEFINITION:"Definition",
	QY_DESCRIPTION:"Description",
	QY_DIMENSION:"Dimension",
	QY_DIMENSIONS:"Dimensions",
	QY_DIMENSION_MEMBER_REFERENCES:"DimensionMemberReferences",
	QY_DISPLAY_LEVEL:"DisplayLevel",
	QY_DRILL_STATE:"DrillState",
	QY_DYNAMIC_FILTER:"DynamicFilter",
	QY_ELEMENTS:"Elements",
	QY_ENCODING:"Encoding",
	QY_EQUALS_SIGN:"=",
	QY_EXCEPTIONS:"Exceptions",
	QY_EXCEPTION_ALERT_LEVEL:"ExceptionAlertLevel",
	QY_EXCEPTION_NAME:"ExceptionName",
	QY_FIELD_NAME:"FieldName",
	QY_FILTER:"Filter",
	QY_FIXED_FILTER:"FixedFilter",
	QY_FORMULA:"Formula",
	QY_FREE:"None",
	QY_GEOMETRY_OPERAND:"GeometryOperand",
	QY_GRIDS:"Grids",
	QY_HIERARCHY:"Hierarchy",
	QY_HIERARCHY_NAVIGATIONS:"HierarchyNavigations",
	QY_HINTS:"Hints",
	QY_IGNORE_AUTO_SUBMIT:"IgnoreAutoSubmit",
	QY_INSTANCE_ID:"InstanceId",
	QY_IS_KEY:"IsKey",
	QY_IS_SELECTION_CANDIDATE:"IsSelectionCandidate",
	QY_ITERATION:"Iteration",
	QY_ITERATION_DIMENSIONS:"IterationDimensions",
	QY_JOIN_TYPE:"JoinType",
	QY_KEY:"Key",
	QY_KEY_ATTRIBUTE:"KeyAttribute",
	QY_LANGUAGE:"Language",
	QY_LEVEL_OFFSET_1:"\"LevelOffset\":1",
	QY_LOW:"Low",
	QY_MEASURES_FORMULA:"[Measures].[MemberDetails]",
	QY_MEASURE_DESCRIPTION:"[Measures].[Description]",
	QY_MEMBERS:"Members",
	QY_MEMBER_INDEXES:"MemberIndexes",
	QY_MEMBER_NAME:"MemberName",
	QY_MEMBER_OPERAND:"MemberOperand",
	QY_MEMBER_TYPES:"MemberTypes",
	QY_NAME:"Name",
	QY_OBJECT_NAME:"ObjectName",
	QY_OPERATOR:"Operator",
	QY_OPTIONS:"Options",
	QY_OR_IN_FILTER:"\"Code\":\"Or\"",
	QY_PARENT_INDEXES:"ParentIndexes",
	QY_PLANNING:"Planning",
	QY_PRESENTATION_TYPE:"PresentationType",
	QY_PROCESSING_DIRECTIVES:"ProcessingDirectives",
	QY_PROCESSING_STEP:"ProcessingStep",
	QY_QUERY:"Query",
	QY_QUERY_DATA_CELLS:"QueryDataCells",
	QY_QUERY_INA_MODEL:"InAModel",
	QY_QUERY_VALUE_HELP:"Query/ValueHelp",
	QY_RETURN_EMPTY_JSON_RESULTSET:"ReturnEmptyJsonResultSet",
	QY_ROWS:"Rows",
	QY_RS_FEATURE_REQUEST:"ResultSetFeatureRequest",
	QY_SELECTION:"Selection",
	QY_SET_OPERAND:"SetOperand",
	QY_SIZE:"Size",
	QY_SORT:"Sort",
	QY_SORT_TYPE_MEASURE:"\"SortType\":\"Measure\"",
	QY_STANDALONE_INDICATOR:"isStandAlone",
	QY_SUB_SELECTIONS:"SubSelections",
	QY_SUPPRESS_KEYFIGURE_CALCULATION:"SuppressKeyfigureCalculation",
	QY_TUPLE_COUNT:"TupleCount",
	QY_TUPLE_COUNT_TOTAL:"TupleCountTotal",
	QY_TYPE:"Type",
	QY_UNIVERSAL_DISPLAY_HIERARCHIES:"UniversalDisplayHierarchies",
	QY_VALUE:"Value",
	QY_VALUES:"Values",
	QY_VALUES_EXCEPTION:"ValuesException",
	QY_VARIABLES:"Variables",
	QY_VARIABLE_PLACEHOLDER_IN_FILTER:"\"LowIs\":\"Variable\"",
	QY_VIEW:"View",
	QY_VISIBILITY:"Visibility",
	QY_VISIBILITY_FILTER:"VisibilityFilter",
	QY_VISIBLE:"Visible",
	QY_ZERO_SUPPRESSION_TYPE:"ZeroSuppressionType",
	TAG_ACCOUNT_DIMENSION:"AccountDimension",
	TAG_BACKEND_RESTRICTED_MEASURE:"BackendRestrictedMeasure",
	TAG_FILTER_MEASURE_STRUCTURE:"FilterMeasureStructure",
	TAG_FILTER_SECONDARY_STRUCTURE:"FilterSecondaryStructure",
	TAG_FILTER_SECOND_STRUCTURE:"FilterSecondStructure",
	TAG_GLOBAL_FILTER:"GlobalFilter",
	TAG_GROUP_SIGNATURE:"GroupSignature",
	TAG_GROUP_SIGNATURE_PATH:"$.Analytics.DataSource.GroupSignature",
	TAG_HIERARCHICAL_FILTER:"HierarchicalFilter+",
	TAG_KEY:"InAMergeTag",
	TAG_MEASURE_MD_RESTRICTED_MEASURE_MAP:"RestrictedMeasureSourceMeasureMap",
	TAG_MEASURE_MEMBER_TOUCHED:"MemberModified-CreateRMDuringMerge",
	TAG_MEASURE_METADATA_FOR_PERSISTED_INA:"MetadataForStorage",
	TAG_MEASURE_STRUCTURE:"MeasureStructure",
	TAG_MERGED_QUERY:"MergedQuery",
	TAG_MERGE_ID:"MergeId",
	TAG_MERGE_QUERY_RESPONSE_RECEPIENTS:"CorrespondingRecepients",
	TAG_MULTI_LEVEL_RESTRICTED_MEASURE:"MultiLevelRestrictedMeasure",
	TAG_RESTRICTED_MEASURE:"RestrictedMeasure",
	TAG_SECONDARY_STRUCTURE:"SecondaryStructure",
	TAG_ZERO_SUPPRESSION:"ZeroSuppression"
};

oFF.InAQueryMergeUtils = {

	cleanTagsFromRequest:function(request, modifyRequest)
	{
			let cleanedUpRequest = modifyRequest ? request : oFF.PrUtils.createDeepCopy(request);
		oFF.InAQueryMergeUtils.replaceOrRemoveTag(cleanedUpRequest, oFF.InAQueryMergeConstants.TAG_KEY, null, null);
		oFF.InAQueryMergeUtils.replaceOrRemoveTag(cleanedUpRequest, oFF.InAQueryMergeConstants.TAG_MEASURE_METADATA_FOR_PERSISTED_INA, null, null);
		oFF.InAQueryMergeUtils.replaceOrRemoveTag(cleanedUpRequest, oFF.InAQueryMergeConstants.TAG_MEASURE_MEMBER_TOUCHED, null, null);
		oFF.InAQueryMergeUtils.replaceOrRemoveTag(cleanedUpRequest, oFF.InAQueryMergeConstants.QY_STANDALONE_INDICATOR, null, null);
		oFF.InAQueryMergeUtils.replaceOrRemoveTag(cleanedUpRequest, oFF.InAQueryMergeConstants.TAG_GROUP_SIGNATURE, null, null);
		return cleanedUpRequest;
	},
	collectDimensionsOfBackendRestrictedMeasures:function(membersMetadata, usedDimensionsInBackendRestrictedMeasures)
	{
			for (let i = 0; i < membersMetadata.size(); i++)
		{
			let member = membersMetadata.get(i);
			let defaultSelectedDimensions = member.getListByKey(oFF.InAQueryMergeConstants.QY_DEFAULT_SELECTED_DIMENSIONS);
			if (!oFF.PrUtils.isListEmpty(defaultSelectedDimensions) && member.getBooleanByKeyExt(oFF.InAQueryMergeConstants.QY_IS_SELECTION_CANDIDATE, false))
			{
				for (let j = 0; j < defaultSelectedDimensions.size(); j++)
				{
					usedDimensionsInBackendRestrictedMeasures.add(defaultSelectedDimensions.getStringAt(j));
				}
			}
		}
	},
	collectDimensionsWithHierarchicalFilter:function(selection, dimensionsWithHierarchicalFilter)
	{
			let selectionString = selection.getStringRepresentation();
		oFF.InAQueryMergeUtils.collectUsedDimensions(selectionString, dimensionsWithHierarchicalFilter, oFF.InAQueryMergeConstants.TAG_HIERARCHICAL_FILTER);
	},
	collectDrillDownDimensionNames:function(drillDownDimensions, drillDownDimensionNames)
	{
			for (let i = 0; i < drillDownDimensions.size(); i++)
		{
			let inaDimension = drillDownDimensions.getStructureAt(i);
			let dimensionName = inaDimension.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
			let axisType = inaDimension.getStringByKey(oFF.InAQueryMergeConstants.QY_AXIS);
			let isCalculatedDimension = inaDimension.getStructureByKey(oFF.InAQueryMergeConstants.QY_DATASOURCE) !== null && inaDimension.containsKey(oFF.InAQueryMergeConstants.QY_JOIN_TYPE);
			if (!oFF.XString.isEqual(axisType, oFF.InAQueryMergeConstants.QY_FREE) || isCalculatedDimension)
			{
				drillDownDimensionNames.add(dimensionName);
			}
		}
	},
	collectFieldNames:function(structureAsString, fieldNames, spliterExt)
	{
			let spliter = oFF.XStringUtils.isNotNullAndNotEmpty(spliterExt) ? spliterExt : oFF.XStringUtils.concatenate2(oFF.InAQueryMergeConstants.QY_FIELD_NAME, "\":\"");
		let tokens = oFF.XStringTokenizer.splitString(structureAsString, spliter);
		for (let i = 1; i < tokens.size(); i++)
		{
			let token = tokens.get(i);
			let fieldName = oFF.XString.substring(token, 0, oFF.XString.indexOf(token, "\""));
			fieldNames.add(fieldName);
		}
	},
	collectFieldNamesUsedInSelection:function(selection, fieldNamesInSelection)
	{
			let selectionString = selection.getStringRepresentation();
		oFF.InAQueryMergeUtils.collectFieldNames(selectionString, fieldNamesInSelection, null);
	},
	collectUsedDimensions:function(structureAsString, usedDimensions, spliterExt)
	{
			let spliter = oFF.XStringUtils.isNotNullAndNotEmpty(spliterExt) ? spliterExt : oFF.XStringUtils.concatenate2(oFF.InAQueryMergeConstants.QY_FIELD_NAME, "\":\"");
		let tokens = oFF.XStringTokenizer.splitString(structureAsString, spliter);
		for (let i = 1; i < tokens.size(); i++)
		{
			let token = tokens.get(i);
			let fieldName = oFF.XString.substring(token, 0, oFF.XString.indexOf(token, "\""));
			let dimensionName = oFF.InAQueryMergeUtils.getUsedDimensionName(fieldName);
			usedDimensions.add(dimensionName);
		}
	},
	collectUsedDimensionsInBackendDefinedRestrictedMeasures:function(measureMembersMetadata, usedDimensionsInRestrictedMeasures)
	{
			let spliterExt = null;
		for (let i = 0; i < measureMembersMetadata.size(); i++)
		{
			let measureMember = measureMembersMetadata.get(i);
			let memberDetails = measureMember.getStructureByKey(oFF.InAQueryMergeConstants.QY_MEASURES_FORMULA);
			if (oFF.notNull(memberDetails))
			{
				let measureMemberDetailsString = memberDetails.getStringRepresentation();
				if (oFF.XString.containsString(measureMemberDetailsString, oFF.InAQueryMergeConstants.QY_SELECTION))
				{
					oFF.InAQueryMergeUtils.collectUsedDimensions(measureMemberDetailsString, usedDimensionsInRestrictedMeasures, spliterExt);
				}
			}
		}
	},
	collectUsedDimensionsInFormulas:function(measureMembers, usedDimensionsInFormulas)
	{
			let spliterExt = null;
		for (let i = 0; i < measureMembers.size(); i++)
		{
			let measureMember = measureMembers.get(i);
			let measureMemberString = measureMember.getStringRepresentation();
			if (oFF.XString.containsString(measureMemberString, oFF.InAQueryMergeConstants.QY_FORMULA))
			{
				spliterExt = oFF.XStringUtils.concatenate2(oFF.InAQueryMergeConstants.QY_ATTRIBUTE_VALUE, "\":{\"Name\":\"");
				oFF.InAQueryMergeUtils.collectUsedDimensions(measureMemberString, usedDimensionsInFormulas, spliterExt);
				spliterExt = oFF.XStringUtils.concatenate2(oFF.InAQueryMergeConstants.QY_DIMENSION, "\":\"");
				oFF.InAQueryMergeUtils.collectUsedDimensions(measureMemberString, usedDimensionsInFormulas, spliterExt);
				let structureFormula = measureMember.getStructureByKey(oFF.InAQueryMergeConstants.QY_FORMULA);
				if (oFF.notNull(structureFormula))
				{
					let iteration = structureFormula.getStructureByKey(oFF.InAQueryMergeConstants.QY_ITERATION);
					if (oFF.notNull(iteration))
					{
						let iteratedDimensions = iteration.getListByKey(oFF.InAQueryMergeConstants.QY_ITERATION_DIMENSIONS);
						oFF.XStream.of(iteratedDimensions).forEach((nameDimStructure) => {
							let dimNameStructure = nameDimStructure;
							usedDimensionsInFormulas.add(dimNameStructure.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME));
						});
					}
				}
			}
		}
	},
	collectUsedDimensionsInRestrictedMeasures:function(measureMembers, usedDimensionsInRestrictedMeasures)
	{
			let spliterExt = null;
		for (let i = 0; i < measureMembers.size(); i++)
		{
			let measureMember = measureMembers.get(i);
			let measureMemberString = measureMember.getStringRepresentation();
			if (oFF.XString.containsString(measureMemberString, oFF.InAQueryMergeConstants.QY_SELECTION))
			{
				oFF.InAQueryMergeUtils.collectUsedDimensions(measureMemberString, usedDimensionsInRestrictedMeasures, spliterExt);
			}
		}
	},
	getDataSource:function(structure)
	{
			let structureRootKey = oFF.InAQueryMergeUtils.getStructureRootKey(structure);
		if (oFF.notNull(structureRootKey))
		{
			return structure.getStructureByKey(structureRootKey).getStructureByKey(oFF.InAQueryMergeConstants.QY_DATASOURCE);
		}
		return oFF.notNull(structure) ? structure.getStructureByKey(oFF.InAQueryMergeConstants.QY_DATASOURCE) : null;
	},
	getFilterStructure:function(inaStructure)
	{
			let filterStructure = oFF.PrUtilsJsonPath.getFirstElementFromPath(inaStructure, oFF.InAQueryMergeConstants.PA_FILTER_PATH);
		if (oFF.isNull(filterStructure) || filterStructure.isEmpty())
		{
			filterStructure = oFF.PrUtilsJsonPath.getFirstElementFromPath(inaStructure, oFF.InAQueryMergeConstants.PA_DYNAMIC_FILTER_PATH);
		}
		return filterStructure;
	},
	getInstanceId:function(structure)
	{
			let dataSource = oFF.InAQueryMergeUtils.getDataSource(structure);
		if (oFF.notNull(dataSource))
		{
			return dataSource.getStringByKey(oFF.InAQueryMergeConstants.QY_INSTANCE_ID);
		}
		return null;
	},
	getLastToken:function(value, spliter)
	{
			let token = null;
		let tokens = oFF.XStringTokenizer.splitString(value, spliter);
		if (oFF.notNull(tokens) && tokens.size() > 0)
		{
			token = tokens.get(tokens.size() - 1);
		}
		return token;
	},
	getListsIntersect:function(list01, list02)
	{
			let dimensionNames = oFF.XList.create();
		if (oFF.notNull(list01) && !list01.isEmpty() && oFF.notNull(list02) && !list02.isEmpty())
		{
			for (let i = 0; i < list01.size(); i++)
			{
				if (list02.contains(list01.get(i)))
				{
					dimensionNames.add(list01.get(i));
				}
			}
		}
		return dimensionNames;
	},
	getQueryType:function(structure)
	{
			let dataSource = oFF.InAQueryMergeUtils.getDataSource(structure);
		if (oFF.notNull(dataSource))
		{
			return dataSource.getStringByKey(oFF.InAQueryMergeConstants.QY_TYPE);
		}
		return null;
	},
	getStructureRootKey:function(structure)
	{
			let structureRootKey = oFF.notNull(structure) && structure.containsKey(oFF.InAQueryMergeConstants.QY_ANALYTICS) ? oFF.InAQueryMergeConstants.QY_ANALYTICS : null;
		return structureRootKey;
	},
	getUsedDimensionName:function(fieldName)
	{
			let dimensionName = oFF.XString.substring(fieldName, 0, oFF.XString.indexOf(fieldName, "."));
		if (oFF.XString.startsWith(dimensionName, "["))
		{
			dimensionName = oFF.XString.substring(dimensionName, 1, -1);
		}
		if (oFF.XString.endsWith(dimensionName, "]"))
		{
			dimensionName = oFF.XString.substring(dimensionName, 0, oFF.XString.size(dimensionName) - 1);
		}
		return dimensionName;
	},
	hasAccountDimension:function(dimensions)
	{
			let dimensionsString = dimensions.getStringRepresentation();
		return oFF.XString.containsString(dimensionsString, oFF.InAQueryMergeConstants.TAG_ACCOUNT_DIMENSION);
	},
	hasFilterTagValue:function(filter, tagValue)
	{
			let operator = filter.getStructureByKey(oFF.InAQueryMergeConstants.QY_OPERATOR);
		if (oFF.notNull(operator))
		{
			let subSelections = operator.getListByKey(oFF.InAQueryMergeConstants.QY_SUB_SELECTIONS);
			for (let i = 0; i < subSelections.size(); i++)
			{
				let subSelection = subSelections.getStructureAt(i);
				oFF.InAQueryMergeUtils.hasFilterTagValue(subSelection, tagValue);
			}
		}
		else
		{
			let setOperand = filter.getStructureByKey(oFF.InAQueryMergeConstants.QY_SET_OPERAND);
			let tag = setOperand.getStringByKey(oFF.InAQueryMergeConstants.TAG_KEY);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(tag) && oFF.XString.isEqual(tag, tagValue))
			{
				return true;
			}
		}
		return false;
	},
	hasGeometryDimension:function(dimensions)
	{
			let dimensionsString = dimensions.getStringRepresentation();
		return oFF.XString.containsString(dimensionsString, oFF.InAQueryMergeConstants.QY_CLUSTER_DEFINITION);
	},
	hasGeometryOperandInFilter:function(filter)
	{
			let filterString = filter.getStringRepresentation();
		return oFF.XString.containsString(filterString, oFF.InAQueryMergeConstants.QY_GEOMETRY_OPERAND);
	},
	hasMeasureDimension:function(dimensions)
	{
			let dimensionsString = dimensions.getStringRepresentation();
		return oFF.XString.containsString(dimensionsString, oFF.InAQueryMergeConstants.TAG_MEASURE_STRUCTURE);
	},
	hasMeasureSort:function(sortsList)
	{
			let hasMeasureSort = false;
		if (oFF.notNull(sortsList))
		{
			let sortStructureString = sortsList.getStringRepresentation();
			hasMeasureSort = oFF.XString.containsString(sortStructureString, oFF.InAQueryMergeConstants.QY_SORT_TYPE_MEASURE);
		}
		return hasMeasureSort;
	},
	hasNonMeasureDimensionOnMeasureAxis:function(dimensions, measureDimensionAxis)
	{
			let hasNonMeasureDimensionOnMeasureAxis = false;
		for (let i = 0; i < dimensions.size(); i++)
		{
			let dimension = dimensions.getStructureAt(i);
			let axisType = dimension.getStringByKey(oFF.InAQueryMergeConstants.QY_AXIS);
			if (oFF.XString.isEqual(axisType, measureDimensionAxis))
			{
				hasNonMeasureDimensionOnMeasureAxis = true;
				break;
			}
		}
		return hasNonMeasureDimensionOnMeasureAxis;
	},
	hasVariablePlaceHolder:function(filter)
	{
			let filterString = filter.getStringRepresentation();
		return oFF.XString.containsString(filterString, oFF.InAQueryMergeConstants.QY_VARIABLE_PLACEHOLDER_IN_FILTER);
	},
	isComplexFilter:function(filter)
	{
			let filterString = filter.getStringRepresentation();
		return oFF.XString.containsString(filterString, oFF.InAQueryMergeConstants.QY_OR_IN_FILTER);
	},
	isConditionsStateChangedByClient:function(modelMetadata, inaSortingSerializer, inaSourceConditionsSignature)
	{
			let inaMetadataConditionsSignature = null;
		let inaElement = oFF.PrUtilsJsonPath.getFirstElementFromPath(modelMetadata, oFF.InAQueryMergeConstants.PA_CONDITIONS_PATH);
		if (oFF.notNull(inaElement))
		{
			let inaElementString = inaSortingSerializer.serialize(inaElement);
			inaMetadataConditionsSignature = oFF.XSha1.createSHA1(inaElementString);
		}
		return !oFF.XString.isEqual(inaSourceConditionsSignature, inaMetadataConditionsSignature);
	},
	isListsIntersect:function(list01, list02)
	{
			let dimensionNames = oFF.InAQueryMergeUtils.getListsIntersect(list01, list02);
		return !dimensionNames.isEmpty();
	},
	mergeElementsLists:function(mergedElements, elements)
	{
			if (oFF.notNull(elements))
		{
			for (let i = 0; i < elements.size(); i++)
			{
				let element = elements.get(i);
				if (oFF.notNull(mergedElements) && !mergedElements.contains(element))
				{
					mergedElements.add(element);
				}
			}
		}
	},
	overwriteInstanceIdInDataSource:function(structure, newInstanceID)
	{
			let dataSource = oFF.InAQueryMergeUtils.getDataSource(structure);
		dataSource.remove(oFF.InAQueryMergeConstants.QY_INSTANCE_ID);
		dataSource.putString(oFF.InAQueryMergeConstants.QY_INSTANCE_ID, newInstanceID);
	},
	replaceOrRemoveTag:function(inaElement, tag, oldValue, newValue)
	{
			if (oFF.notNull(inaElement))
		{
			let remove = true;
			if (oFF.XStringUtils.isNotNullAndNotEmpty(oldValue))
			{
				remove = false;
			}
			let elementType = inaElement.getType();
			if (elementType === oFF.PrElementType.STRUCTURE)
			{
				let inaStructure = inaElement;
				let structureNames = inaStructure.getKeysAsReadOnlyList();
				let structureSize = structureNames.size();
				for (let structureNameIndex = 0; structureNameIndex < structureSize; structureNameIndex++)
				{
					let structureName = structureNames.get(structureNameIndex);
					if (oFF.XString.isEqual(structureName, tag))
					{
						if (remove)
						{
							inaStructure.remove(tag);
							continue;
						}
						else
						{
							let lowValue = inaStructure.getStringByKey(tag);
							if (oFF.XString.isEqual(lowValue, oldValue))
							{
								inaStructure.putString(tag, newValue);
								continue;
							}
						}
					}
					oFF.InAQueryMergeUtils.replaceOrRemoveTag(oFF.PrUtils.getProperty(inaStructure, structureName), tag, oldValue, newValue);
				}
			}
			else if (elementType === oFF.PrElementType.LIST)
			{
				let inaList = inaElement;
				let len = oFF.PrUtils.getListSize(inaList, 0);
				for (let inaListIndex = 0; inaListIndex < len; inaListIndex++)
				{
					oFF.InAQueryMergeUtils.replaceOrRemoveTag(oFF.PrUtils.getElement(inaList, inaListIndex), tag, oldValue, newValue);
				}
			}
		}
	}
};

oFF.InARestrictedMeasureUtils = {

	_addConvertToFlatForHierFilters:function(item)
	{
			if (oFF.notNull(item))
		{
			let operator = item.getStructureByKey(oFF.InAQueryMergeConstants.QY_OPERATOR);
			if (oFF.notNull(operator))
			{
				let subSelections = operator.getListByKey(oFF.InAQueryMergeConstants.QY_SUB_SELECTIONS);
				if (oFF.notNull(subSelections))
				{
					for (let i = 0; i < subSelections.size(); i++)
					{
						let subSelection = subSelections.getStructureAt(i);
						let setOperand = subSelection.getStructureByKey(oFF.InAQueryMergeConstants.QY_SET_OPERAND);
						if (oFF.notNull(setOperand))
						{
							let hierarchy = setOperand.getStructureByKey(oFF.InAQueryMergeConstants.QY_HIERARCHY);
							if (oFF.notNull(hierarchy))
							{
								setOperand.putBoolean(oFF.InAQueryMergeConstants.QY_CONVERT_TO_FLAT_SELECTION, true);
							}
							continue;
						}
						let operatorIntern = subSelection.getStructureByKey(oFF.InAQueryMergeConstants.QY_OPERATOR);
						if (oFF.notNull(operatorIntern))
						{
							oFF.InARestrictedMeasureUtils._addConvertToFlatForHierFilters(subSelection);
						}
					}
				}
			}
		}
	},
	_cleanRedundantOperatorWrapper:function(operator, rootOperator)
	{
			if (oFF.notNull(operator) && oFF.notNull(rootOperator))
		{
			let subSelections = operator.getListByKey(oFF.InAQueryMergeConstants.QY_SUB_SELECTIONS);
			if (oFF.notNull(subSelections) && subSelections.size() === 1)
			{
				let firstItem = subSelections.getStructureAt(0);
				let firstItemOperator = firstItem.getStructureByKey(oFF.InAQueryMergeConstants.QY_OPERATOR);
				if (oFF.notNull(firstItemOperator))
				{
					if (!oFF.XString.isEqual(rootOperator.getStringByKey(oFF.InAQueryMergeConstants.QY_CODE), firstItemOperator.getStringByKey(oFF.InAQueryMergeConstants.QY_CODE)))
					{
						return;
					}
					let subSelections2 = firstItemOperator.getListByKey(oFF.InAQueryMergeConstants.QY_SUB_SELECTIONS);
					rootOperator.putNewList(oFF.InAQueryMergeConstants.QY_SUB_SELECTIONS).addAll(subSelections2.getValuesAsReadOnlyList());
					oFF.InARestrictedMeasureUtils._cleanRedundantOperatorWrapper(firstItemOperator, rootOperator);
				}
			}
		}
	},
	_cleanTagsFromDimensions:function(dimensions)
	{
			let dimensionsIterator = dimensions.getIterator();
		while (dimensionsIterator.hasNext())
		{
			let dimension = dimensionsIterator.next();
			if (oFF.notNull(dimension))
			{
				dimension.remove(oFF.InAQueryMergeConstants.TAG_KEY);
			}
		}
	},
	_cleanTagsFromFilter:function(item)
	{
			if (oFF.notNull(item))
		{
			let operator = item.getStructureByKey(oFF.InAQueryMergeConstants.QY_OPERATOR);
			if (oFF.notNull(operator))
			{
				operator.remove(oFF.InAQueryMergeConstants.TAG_KEY);
				let subSelections = operator.getListByKey(oFF.InAQueryMergeConstants.QY_SUB_SELECTIONS);
				for (let i = 0; i < subSelections.size(); i++)
				{
					let subSelection = subSelections.getStructureAt(i);
					oFF.InARestrictedMeasureUtils._cleanTagsFromFilter(subSelection);
				}
			}
			else
			{
				let setOperand = item.getStructureByKey(oFF.InAQueryMergeConstants.QY_SET_OPERAND);
				setOperand.remove(oFF.InAQueryMergeConstants.TAG_KEY);
			}
		}
	},
	_removeAllMeasureMembersExcept:function(measureMemberName, selection)
	{
			let operator = selection.getStructureByKey(oFF.InAQueryMergeConstants.QY_OPERATOR);
		if (oFF.notNull(operator))
		{
			let subSelections = operator.getListByKey(oFF.InAQueryMergeConstants.QY_SUB_SELECTIONS);
			for (let i = 0; i < subSelections.size(); i++)
			{
				let subSelection = subSelections.getStructureAt(i);
				oFF.InARestrictedMeasureUtils._removeAllMeasureMembersExcept(measureMemberName, subSelection);
			}
		}
		else
		{
			let setOperand = selection.getStructureByKey(oFF.InAQueryMergeConstants.QY_SET_OPERAND);
			let tag = setOperand.getStringByKey(oFF.InAQueryMergeConstants.TAG_KEY);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(tag) && oFF.XString.isEqual(tag, oFF.InAQueryMergeConstants.TAG_FILTER_MEASURE_STRUCTURE))
			{
				let elements = setOperand.getListByKey(oFF.InAQueryMergeConstants.QY_ELEMENTS);
				let elementsToRemove = oFF.PrFactory.createList();
				for (let j = 0; j < elements.size(); j++)
				{
					let element = elements.getStructureAt(j);
					if (!oFF.XString.isEqual(element.getStringByKey(oFF.InAQueryMergeConstants.QY_LOW), measureMemberName))
					{
						elementsToRemove.add(element);
					}
				}
				for (let k = 0; k < elementsToRemove.size(); k++)
				{
					let elementToRemove = elementsToRemove.getStructureAt(k);
					elements.removeElement(elementToRemove);
				}
			}
		}
	},
	_removeGlobalFilters:function(item, subSelections)
	{
			if (oFF.notNull(item))
		{
			let operator = item.getStructureByKey(oFF.InAQueryMergeConstants.QY_OPERATOR);
			if (oFF.notNull(operator))
			{
				let tag = operator.getStringByKey(oFF.InAQueryMergeConstants.TAG_KEY);
				if (oFF.XStringUtils.isNotNullAndNotEmpty(tag) && oFF.XString.isEqual(tag, oFF.InAQueryMergeConstants.TAG_GLOBAL_FILTER))
				{
					subSelections.removeElement(item);
				}
				let subSelectionList = operator.getListByKey(oFF.InAQueryMergeConstants.QY_SUB_SELECTIONS);
				for (let i = 0; i < subSelectionList.size(); i++)
				{
					let subSelection = subSelectionList.getStructureAt(i);
					oFF.InARestrictedMeasureUtils._removeGlobalFilters(subSelection, subSelectionList);
				}
			}
		}
	},
	addBaseMeasurePropsToRM:function(measureDimension, measureMemberName, restrictedMeasure)
	{
			let mergedElements = measureDimension.getListByKey(oFF.InAQueryMergeConstants.QY_MEMBERS);
		let measureFound = oFF.XStream.of(mergedElements).find(oFF.InARestrictedMeasureUtils.getMeasureWithName(measureMemberName)).isPresent();
		if (measureFound)
		{
			let restrictedMeasureName = restrictedMeasure.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
			let measureDefinition = oFF.XStream.of(mergedElements).find(oFF.InARestrictedMeasureUtils.getMeasureWithName(measureMemberName)).get();
			let dontCopyPropertyList = oFF.InARestrictedMeasureUtils.getExcludedMeasureProps();
			let measureProps = measureDefinition.getKeysAsReadOnlyList();
			for (let i = 0; i < measureProps.size(); i++)
			{
				let prop = measureProps.get(i);
				if (!dontCopyPropertyList.contains(prop))
				{
					let propOnMeasure = measureDefinition.getByKey(prop);
					if (oFF.XString.isEqual(prop, oFF.InAQueryMergeConstants.QY_EXCEPTIONS))
					{
						let propOnMeasureString = propOnMeasure.getStringRepresentation();
						let newRMString = oFF.XString.replace(propOnMeasureString, measureMemberName, restrictedMeasureName);
						propOnMeasure = oFF.JsonParserFactory.createFromString(newRMString);
					}
					restrictedMeasure.putIfNotNull(prop, propOnMeasure);
				}
			}
		}
	},
	addRestrictedMeasureToMembers:function(restrictedMeasure, measureDimension)
	{
			if (oFF.notNull(measureDimension))
		{
			let members = measureDimension.getListByKey(oFF.InAQueryMergeConstants.QY_MEMBERS);
			if (oFF.notNull(members))
			{
				let restrictedMeasureName = restrictedMeasure.getStringByKey("Name");
				let restrictedMeasureAlreadyPresent = oFF.XStream.of(members).find(oFF.InARestrictedMeasureUtils.getMeasureWithName(restrictedMeasureName)).isPresent();
				if (!restrictedMeasureAlreadyPresent)
				{
					members.add(restrictedMeasure);
				}
			}
			else
			{
				members = measureDimension.putNewList(oFF.InAQueryMergeConstants.QY_MEMBERS);
				members.add(restrictedMeasure);
			}
		}
	},
	cleanTagsFromRequest:function(request)
	{
			let newRequest = oFF.PrFactory.createStructureDeepCopy(request);
		let filterRoot = oFF.InAQueryMergeUtils.getFilterStructure(newRequest);
		let filterSelection = filterRoot.getStructureByKey(oFF.InAQueryMergeConstants.QY_SELECTION);
		if (oFF.isNull(filterSelection))
		{
			filterSelection = filterRoot;
		}
		oFF.InARestrictedMeasureUtils._cleanTagsFromFilter(filterSelection);
		let definitionStructure = oFF.PrUtilsJsonPath.getFirstElementFromPath(newRequest, oFF.InAQueryMergeConstants.PA_DEFINITION_PATH);
		let dimensionsStructure = definitionStructure.getListByKey(oFF.InAQueryMergeConstants.QY_DIMENSIONS);
		oFF.InARestrictedMeasureUtils._cleanTagsFromDimensions(dimensionsStructure);
		return newRequest;
	},
	createQueryDataCellForRestrictedMeasure:function(cellDefintions, restrictedMeasure, measureMemberId, predefinedDataCellName)
	{
			let cellDefintionsSize = cellDefintions.size();
		for (let i = 0; i < cellDefintionsSize; i++)
		{
			let cellDefintion = cellDefintions.getStructureAt(i);
			if (oFF.notNull(cellDefintion))
			{
				let dimensionMemberReference = cellDefintion.getListByKey(oFF.InAQueryMergeConstants.QY_DIMENSION_MEMBER_REFERENCES);
				if (oFF.notNull(dimensionMemberReference) && !oFF.PrUtils.isListEmpty(dimensionMemberReference))
				{
					let memberRef = dimensionMemberReference.getStringAt(0);
					if (oFF.XString.isEqual(memberRef, measureMemberId))
					{
						let qdcName = oFF.XStringUtils.isNullOrEmpty(predefinedDataCellName) ? null : predefinedDataCellName;
						let clonedCell = oFF.PrFactory.createStructureDeepCopy(cellDefintion);
						clonedCell.putInteger(oFF.InAQueryMergeConstants.QY_CELL_VALUE_TYPE, 0);
						clonedCell.putString(oFF.InAQueryMergeConstants.QY_NAME, qdcName);
						let rmName = restrictedMeasure.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
						clonedCell.getListByKey(oFF.InAQueryMergeConstants.QY_DIMENSION_MEMBER_REFERENCES).setStringAt(0, rmName);
						cellDefintions.add(clonedCell);
					}
				}
			}
		}
	},
	createReferenceToRestrictedMeasureFilter:function(measureName, createdRestrictedMeasures)
	{
			let root = oFF.PrFactory.createStructure();
		let selection = root.putNewStructure(oFF.InAQueryMergeConstants.QY_SELECTION);
		let operator = selection.putNewStructure(oFF.InAQueryMergeConstants.QY_OPERATOR);
		operator.putString(oFF.InAQueryMergeConstants.QY_CODE, oFF.InAQueryMergeConstants.QY_AND);
		let subSelections = operator.putNewList(oFF.InAQueryMergeConstants.QY_SUB_SELECTIONS);
		let subSelectionItem = subSelections.addNewStructure();
		let subSelectionItemOperand = subSelectionItem.putNewStructure(oFF.InAQueryMergeConstants.QY_SET_OPERAND);
		subSelectionItemOperand.putString(oFF.InAQueryMergeConstants.QY_FIELD_NAME, measureName);
		let elements = subSelectionItemOperand.putNewList(oFF.InAQueryMergeConstants.QY_ELEMENTS);
		for (let i = 0; i < createdRestrictedMeasures.size(); i++)
		{
			let restrictedMeasureName = createdRestrictedMeasures.get(i).getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
			let element = elements.addNewStructure();
			element.putString(oFF.InAQueryMergeConstants.QY_COMPARISON, oFF.InAQueryMergeConstants.QY_EQUALS_SIGN);
			element.putString(oFF.InAQueryMergeConstants.QY_LOW, restrictedMeasureName);
		}
		return root;
	},
	createSingleRestrictedMeasure:function(measureMemberName, filterRoot, predefinedRmName, restrictedMeasureMap)
	{
			let filterSelection = filterRoot.getStructureByKey(oFF.InAQueryMergeConstants.QY_SELECTION);
		if (oFF.isNull(filterSelection))
		{
			filterSelection = filterRoot;
		}
		let tempFilterSelection = oFF.PrFactory.createStructureDeepCopy(filterSelection);
		oFF.InARestrictedMeasureUtils._removeAllMeasureMembersExcept(measureMemberName, tempFilterSelection);
		oFF.InARestrictedMeasureUtils._removeGlobalFilters(tempFilterSelection, null);
		oFF.InARestrictedMeasureUtils._cleanTagsFromFilter(tempFilterSelection);
		let operator = tempFilterSelection.getStructureByKey(oFF.InAQueryMergeConstants.QY_OPERATOR);
		oFF.InARestrictedMeasureUtils._cleanRedundantOperatorWrapper(operator, operator);
		oFF.InARestrictedMeasureUtils._addConvertToFlatForHierFilters(tempFilterSelection);
		let filterString = tempFilterSelection.getStringRepresentation();
		let rmName = oFF.XStringUtils.isNullOrEmpty(predefinedRmName) ? oFF.XSha1.createSHA1(filterString) : predefinedRmName;
		if (oFF.notNull(restrictedMeasureMap))
		{
			restrictedMeasureMap.put(rmName, measureMemberName);
		}
		let filterStructure = oFF.PrFactory.createStructure();
		filterStructure.putString(oFF.InAQueryMergeConstants.QY_NAME, rmName);
		filterStructure.putString(oFF.InAQueryMergeConstants.QY_DESCRIPTION, rmName);
		filterStructure.put(oFF.InAQueryMergeConstants.QY_SELECTION, tempFilterSelection);
		filterStructure.putString(oFF.InAQueryMergeConstants.QY_VISIBILITY, oFF.InAQueryMergeConstants.QY_VISIBLE);
		return filterStructure;
	},
	extendRequestWithRestrictedMeasure:function(request, predefinedRmName, predefinedDataCellName)
	{
			let newRequest = oFF.PrFactory.createStructureDeepCopy(request);
		let definitionStructure = oFF.PrUtilsJsonPath.getFirstElementFromPath(newRequest, oFF.InAQueryMergeConstants.PA_DEFINITION_PATH);
		let dimensionsStructure = definitionStructure.getListByKey(oFF.InAQueryMergeConstants.QY_DIMENSIONS);
		let cellDefintionStructure = definitionStructure.getListByKey(oFF.InAQueryMergeConstants.QY_QUERY_DATA_CELLS);
		let filterStructure = definitionStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_FILTER);
		let measureStructure = oFF.InARestrictedMeasureUtils.getMeasureStructure(dimensionsStructure);
		let measureIds = oFF.InARestrictedMeasureUtils.extractMeasuresFromSelection(filterStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_SELECTION), null);
		let createdRestrictedMeasures = oFF.PrFactory.createList();
		for (let i = 0; i < measureIds.size(); i++)
		{
			let measureMemberId = measureIds.get(i);
			let restrictedMeasure = oFF.InARestrictedMeasureUtils.createSingleRestrictedMeasure(measureMemberId, filterStructure, predefinedRmName, null);
			createdRestrictedMeasures.add(restrictedMeasure);
			oFF.InARestrictedMeasureUtils.addRestrictedMeasureToMembers(restrictedMeasure, measureStructure);
			oFF.InARestrictedMeasureUtils.createQueryDataCellForRestrictedMeasure(cellDefintionStructure, restrictedMeasure, measureMemberId, predefinedDataCellName);
		}
		let measureName = measureStructure.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
		let newRestrictedMeasures = createdRestrictedMeasures.getValuesAsReadOnlyList();
		let newFilterRoot = oFF.InARestrictedMeasureUtils.createReferenceToRestrictedMeasureFilter(oFF.XStringUtils.concatenate2(measureName, ".KEY"), newRestrictedMeasures);
		definitionStructure.put(oFF.InAQueryMergeConstants.QY_FILTER, newFilterRoot);
		oFF.InARestrictedMeasureUtils._cleanTagsFromDimensions(dimensionsStructure);
		return newRequest;
	},
	extractDimensionMembersFromSelection:function(selectionStructure, dimensionName, extraSubSelectionsMap)
	{
			let tempExtraSubSelectionsMap = extraSubSelectionsMap;
		let operator = selectionStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_OPERATOR);
		if (oFF.notNull(operator))
		{
			let tempSubSelections = operator.getListByKey(oFF.InAQueryMergeConstants.QY_SUB_SELECTIONS);
			for (let i = 0; i < tempSubSelections.size(); i++)
			{
				oFF.InARestrictedMeasureUtils.extractDimensionMembersFromSelection(tempSubSelections.getStructureAt(i), dimensionName, tempExtraSubSelectionsMap);
			}
		}
		else
		{
			let setOperand = selectionStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_SET_OPERAND);
			let fieldName = setOperand.getStringByKey(oFF.InAQueryMergeConstants.QY_FIELD_NAME);
			if (oFF.XString.containsString(fieldName, oFF.XStringUtils.concatenate2(dimensionName, oFF.InAQueryMergeConstants.PA_PATH_SPLITER)))
			{
				let dimensionElements = setOperand.getListByKey(oFF.InAQueryMergeConstants.QY_ELEMENTS);
				if (!oFF.PrUtils.isListEmpty(dimensionElements))
				{
					let xstringFieldName = oFF.XStringValue.create(fieldName);
					if (!extraSubSelectionsMap.containsKey(xstringFieldName))
					{
						extraSubSelectionsMap.put(xstringFieldName, dimensionElements);
					}
					else
					{
						dimensionElements.addAll(extraSubSelectionsMap.getByKey(xstringFieldName));
						extraSubSelectionsMap.put(xstringFieldName, dimensionElements);
					}
				}
			}
		}
	},
	extractMeasuresFromSelection:function(selectionStructure, previousMeasureIds)
	{
			let measureIds = previousMeasureIds;
		if (oFF.isNull(previousMeasureIds))
		{
			measureIds = oFF.XList.create();
		}
		let operator = selectionStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_OPERATOR);
		if (oFF.notNull(operator))
		{
			let subSelections = operator.getListByKey(oFF.InAQueryMergeConstants.QY_SUB_SELECTIONS);
			for (let i = 0; i < subSelections.size(); i++)
			{
				oFF.InARestrictedMeasureUtils.extractMeasuresFromSelection(subSelections.getStructureAt(i), measureIds);
			}
		}
		else
		{
			let setOperand = selectionStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_SET_OPERAND);
			let tag = setOperand.getStringByKey(oFF.InAQueryMergeConstants.TAG_KEY);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(tag) && oFF.XString.isEqual(tag, oFF.InAQueryMergeConstants.TAG_FILTER_MEASURE_STRUCTURE))
			{
				let elements = setOperand.getListByKey(oFF.InAQueryMergeConstants.QY_ELEMENTS);
				for (let j = 0; j < elements.size(); j = j + 1)
				{
					let measureId = elements.getStructureAt(j).getStringByKey(oFF.InAQueryMergeConstants.QY_LOW);
					measureIds.add(measureId);
				}
			}
		}
		return measureIds;
	},
	getExcludedMeasureProps:function()
	{
			let dontCopyPropertyList = oFF.XList.create();
		dontCopyPropertyList.add(oFF.InAQueryMergeConstants.QY_NAME);
		dontCopyPropertyList.add(oFF.InAQueryMergeConstants.QY_MEMBER_NAME);
		dontCopyPropertyList.add(oFF.InAQueryMergeConstants.QY_DESCRIPTION);
		dontCopyPropertyList.add(oFF.InAQueryMergeConstants.QY_SELECTION);
		dontCopyPropertyList.add(oFF.InAQueryMergeConstants.QY_FORMULA);
		return dontCopyPropertyList;
	},
	getMeasureStructure:function(dimensionsStructure)
	{
			let dimensionsIterator = dimensionsStructure.getIterator();
		while (dimensionsIterator.hasNext())
		{
			let dimension = dimensionsIterator.next();
			let tag = dimension.getStringByKey(oFF.InAQueryMergeConstants.TAG_KEY);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(tag) && oFF.XString.isEqual(tag, oFF.InAQueryMergeConstants.TAG_MEASURE_STRUCTURE))
			{
				return dimension;
			}
		}
		return null;
	},
	getMeasureWithName:function(measureMemberName)
	{
			return (measureMember) => {
			let measure = measureMember;
			let measureName = measure.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
			if (oFF.XStringUtils.isNullOrEmpty(measureName))
			{
				measureName = measure.getStringByKey(oFF.InAQueryMergeConstants.QY_MEMBER_NAME);
			}
			if (oFF.XStringUtils.isNullOrEmpty(measureName))
			{
				measureName = measure.getStructureByKey(oFF.InAQueryMergeConstants.QY_MEMBER_OPERAND).getStringByKey(oFF.InAQueryMergeConstants.QY_VALUE);
			}
			return oFF.XString.isEqual(measureName, measureMemberName);
		};
	},
	getMemberMetadata:function(inaMergeRegistryManager, membersMetadata, measureDimensionName, basicMemberName)
	{
			if (oFF.notNull(membersMetadata))
		{
			let keyFieldName = inaMergeRegistryManager.getKeyFieldOfDimension(measureDimensionName);
			for (let i = 0; i < membersMetadata.size(); i++)
			{
				let memberMetadata = membersMetadata.get(i);
				if (oFF.XString.isEqual(memberMetadata.getStringByKey(keyFieldName), basicMemberName))
				{
					return memberMetadata;
				}
			}
		}
		return null;
	},
	hasExpectedSelectionStructure:function(selectionStructure)
	{
			let hasExpectedSelectionStructure = true;
		let operator = selectionStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_OPERATOR);
		if (oFF.notNull(operator))
		{
			let subSelections = operator.getListByKey(oFF.InAQueryMergeConstants.QY_SUB_SELECTIONS);
			if (oFF.isNull(subSelections))
			{
				return false;
			}
			for (let i = 0; i < subSelections.size(); i++)
			{
				oFF.InARestrictedMeasureUtils.hasExpectedSelectionStructure(subSelections.getStructureAt(i));
			}
		}
		else
		{
			let setOperand = selectionStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_SET_OPERAND);
			if (oFF.isNull(setOperand))
			{
				return false;
			}
		}
		return hasExpectedSelectionStructure;
	},
	mergeElementsOfSameFieldAndLevel:function(fieldElementsMap, selection, parentSelection, level)
	{
			let operator = selection.getStructureByKey(oFF.InAQueryMergeConstants.QY_OPERATOR);
		if (oFF.notNull(operator))
		{
			let subSelections = operator.getListByKey(oFF.InAQueryMergeConstants.QY_SUB_SELECTIONS);
			let tempFieldElementsMap = oFF.notNull(fieldElementsMap) ? fieldElementsMap : oFF.XHashMapByString.create();
			for (let i = subSelections.size() - 1; i >= 0; i--)
			{
				let subSelection = subSelections.getStructureAt(i);
				oFF.InARestrictedMeasureUtils.mergeElementsOfSameFieldAndLevel(tempFieldElementsMap, subSelection, subSelections, level + 1);
			}
		}
		else
		{
			let setOperand = selection.getStructureByKey(oFF.InAQueryMergeConstants.QY_SET_OPERAND);
			let tag = setOperand.getStringByKey(oFF.InAQueryMergeConstants.TAG_KEY);
			if (!oFF.XString.isEqual(tag, oFF.InAQueryMergeConstants.TAG_FILTER_MEASURE_STRUCTURE))
			{
				let fieldName = setOperand.getStringByKey(oFF.InAQueryMergeConstants.QY_FIELD_NAME);
				let elements = setOperand.getListByKey(oFF.InAQueryMergeConstants.QY_ELEMENTS);
				let key = oFF.XStringUtils.concatenate3(fieldName, "_", oFF.XInteger.convertToString(level));
				if (!fieldElementsMap.containsKey(key))
				{
					fieldElementsMap.put(key, elements);
				}
				else
				{
					let extendedElements = fieldElementsMap.getByKey(key);
					extendedElements.addAll(elements);
					parentSelection.removeElement(selection);
				}
			}
		}
	},
	processRestrictedMeasures:function(inaMergeRegistryManager, measureMemberNames, fieldName, measureDimension, filterSelection, queryDataCells, restrictedMeasureMap)
	{
			let newFilterRoot = oFF.PrFactory.createStructure();
		let createdRestrictedMeasures = oFF.PrFactory.createList();
		for (let i = 0; i < measureMemberNames.size(); i++)
		{
			let measureMemberName = measureMemberNames.get(i);
			let fieldElementsMap = oFF.XHashMapByString.create();
			oFF.InARestrictedMeasureUtils.mergeElementsOfSameFieldAndLevel(fieldElementsMap, filterSelection, null, 0);
			let restrictedMeasure = oFF.InARestrictedMeasureUtils.createSingleRestrictedMeasure(measureMemberName, filterSelection, null, restrictedMeasureMap);
			createdRestrictedMeasures.add(restrictedMeasure);
			let measureDimensionName = measureDimension.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
			let membersMetadata = inaMergeRegistryManager.getMembersMetadata(measureDimensionName);
			if (oFF.XCollectionUtils.hasElements(membersMetadata))
			{
				let memberMetadata = oFF.InARestrictedMeasureUtils.getMemberMetadata(inaMergeRegistryManager, membersMetadata, measureDimensionName, measureMemberName);
				if (oFF.XCollectionUtils.hasElements(memberMetadata) && memberMetadata.containsKey(oFF.InAQueryMergeConstants.QY_MEASURE_DESCRIPTION))
				{
					let baseMeasureDescription = memberMetadata.getStringByKey(oFF.InAQueryMergeConstants.QY_MEASURE_DESCRIPTION);
					restrictedMeasure.putString(oFF.InAQueryMergeConstants.QY_DESCRIPTION, baseMeasureDescription);
				}
			}
			if (oFF.isNull(queryDataCells))
			{
				oFF.InARestrictedMeasureUtils.addBaseMeasurePropsToRM(measureDimension, measureMemberName, restrictedMeasure);
			}
			oFF.InARestrictedMeasureUtils.addRestrictedMeasureToMembers(restrictedMeasure, measureDimension);
			let newRestrictedMeasures = createdRestrictedMeasures.getValuesAsReadOnlyList();
			newFilterRoot = oFF.InARestrictedMeasureUtils.createReferenceToRestrictedMeasureFilter(fieldName, newRestrictedMeasures);
			if (oFF.notNull(queryDataCells))
			{
				oFF.InARestrictedMeasureUtils.createQueryDataCellForRestrictedMeasure(queryDataCells, restrictedMeasure, measureMemberName, null);
			}
		}
		return newFilterRoot;
	},
	replaceMeasureInSelection:function(selectionStructure, originalMeasureName, restrictedMeasureName)
	{
			let operator = selectionStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_OPERATOR);
		if (oFF.notNull(operator))
		{
			let subSelections = operator.getListByKey(oFF.InAQueryMergeConstants.QY_SUB_SELECTIONS);
			for (let i = 0; i < subSelections.size(); i++)
			{
				oFF.InARestrictedMeasureUtils.replaceMeasureInSelection(subSelections.getStructureAt(i), originalMeasureName, restrictedMeasureName);
			}
		}
		else
		{
			let setOperand = selectionStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_SET_OPERAND);
			let tag = setOperand.getStringByKey(oFF.InAQueryMergeConstants.TAG_KEY);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(tag) && oFF.XString.isEqual(tag, oFF.InAQueryMergeConstants.TAG_FILTER_MEASURE_STRUCTURE))
			{
				let elements = setOperand.getListByKey(oFF.InAQueryMergeConstants.QY_ELEMENTS);
				for (let j = 0; j < elements.size(); j = j + 1)
				{
					let filterEl = elements.getStructureAt(j);
					if (oFF.XString.isEqual(filterEl.getStringByKey(oFF.InAQueryMergeConstants.QY_LOW), originalMeasureName))
					{
						filterEl.putString(oFF.InAQueryMergeConstants.QY_LOW, restrictedMeasureName);
					}
				}
			}
		}
	}
};

oFF.OlapEnvironmentFactory = function() {};
oFF.OlapEnvironmentFactory.prototype = new oFF.XObject();
oFF.OlapEnvironmentFactory.prototype._ff_c = "OlapEnvironmentFactory";

oFF.OlapEnvironmentFactory.s_olapEnvironmentFactory = null;
oFF.OlapEnvironmentFactory.newInstance = function(application)
{
	return oFF.OlapEnvironmentFactory.s_olapEnvironmentFactory.newOlapEnvironmentInstance(application);
};
oFF.OlapEnvironmentFactory.registerFactory = function(olapEnvironmentFactory)
{
	let oldFactory = oFF.OlapEnvironmentFactory.s_olapEnvironmentFactory;
	oFF.OlapEnvironmentFactory.s_olapEnvironmentFactory = olapEnvironmentFactory;
	return oldFactory;
};
oFF.OlapEnvironmentFactory.staticSetup = function()
{
	let defaultFactory = new oFF.OlapEnvironmentFactory();
	oFF.OlapEnvironmentFactory.registerFactory(defaultFactory);
};
oFF.OlapEnvironmentFactory.prototype.newOlapEnvironmentInstance = function(application)
{
	return null;
};

oFF.ServiceTypeInfo = function() {};
oFF.ServiceTypeInfo.prototype = new oFF.XObject();
oFF.ServiceTypeInfo.prototype._ff_c = "ServiceTypeInfo";

oFF.ServiceTypeInfo.prototype.createServiceConfigInternal = function(application)
{
	let serviceConfigReferenceName = this.getServiceConfigReferenceName();
	let regService = oFF.RegistrationService.getInstance();
	let references = regService.getReferences(serviceConfigReferenceName);
	if (references.size() === 1)
	{
		let registeredClass = references.get(0);
		let serviceConfig = registeredClass.newInstance(application);
		serviceConfig.setServiceTypeInfo(this);
		serviceConfig.setupConfig(application);
		return serviceConfig;
	}
	throw oFF.XException.createIllegalStateException("more than one reference for service config");
};

oFF.ServiceUtils = function() {};
oFF.ServiceUtils.prototype = new oFF.XObject();
oFF.ServiceUtils.prototype._ff_c = "ServiceUtils";

oFF.ServiceUtils.getMatchingService = function(config, serviceReferenceName, messageManager)
{
	let regService = oFF.RegistrationService.getInstance();
	let references = regService.getReferences(serviceReferenceName);
	for (let i = 0; i < references.size(); i++)
	{
		let registeredClass = references.get(i);
		let service = registeredClass.newInstance(config);
		if (service.isServiceConfigMatching(config, config.getConnectionContainer(), messageManager))
		{
			service.setupService(config);
			return service;
		}
	}
	return null;
};

oFF.NopUsageTracker = function() {};
oFF.NopUsageTracker.prototype = new oFF.XObject();
oFF.NopUsageTracker.prototype._ff_c = "NopUsageTracker";

oFF.NopUsageTracker.prototype.isEnabled = function()
{
	return false;
};
oFF.NopUsageTracker.prototype.track = function(event) {};
oFF.NopUsageTracker.prototype.trackUsage = function(actionId, parameters, session) {};

oFF.UsageTrackerProvider = {

	instance:null,
	getUsageTracker:function()
	{
			if (oFF.isNull(oFF.UsageTrackerProvider.instance))
		{
			oFF.UsageTrackerProvider.instance = new oFF.NopUsageTracker();
		}
		return oFF.UsageTrackerProvider.instance;
	},
	setUsageTracker:function(instance)
	{
			oFF.UsageTrackerProvider.instance = instance;
	}
};

oFF.InADataProvider = function() {};
oFF.InADataProvider.prototype = new oFF.BasicInAQuery();
oFF.InADataProvider.prototype._ff_c = "InADataProvider";

oFF.InADataProvider.create = function(instanceId, requestStructure, connectionContainer, systemType)
{
	let query = new oFF.InADataProvider();
	query.setupInARuntimeDataProvider(instanceId, requestStructure, connectionContainer, systemType);
	return query;
};
oFF.InADataProvider.prototype.m_isPreQuery = null;
oFF.InADataProvider.prototype.m_preQueries = null;
oFF.InADataProvider.prototype.m_requestStructure = null;
oFF.InADataProvider.prototype.m_sourceInstanceIds = null;
oFF.InADataProvider.prototype.addSourceInstanceId = function(sourceInstanceId)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(sourceInstanceId) && !this.m_sourceInstanceIds.contains(sourceInstanceId))
	{
		this.m_sourceInstanceIds.add(sourceInstanceId);
	}
};
oFF.InADataProvider.prototype.getPreQueries = function()
{
	return this.m_preQueries;
};
oFF.InADataProvider.prototype.getRequestStructure = function()
{
	return oFF.notNull(this.m_requestStructure) ? this.m_requestStructure : oFF.BasicInAQuery.prototype.getRequestStructure.call( this );
};
oFF.InADataProvider.prototype.getSourceInstanceIds = function()
{
	return this.m_sourceInstanceIds;
};
oFF.InADataProvider.prototype.isMainQuery = function()
{
	return this.m_isPreQuery !== oFF.TriStateBool._DEFAULT && this.m_isPreQuery.getBoolean() === false;
};
oFF.InADataProvider.prototype.isPreQuery = function()
{
	return this.m_isPreQuery.getBoolean();
};
oFF.InADataProvider.prototype.releaseObject = function()
{
	this.m_requestStructure = oFF.XObjectExt.release(this.m_requestStructure);
	this.m_sourceInstanceIds = oFF.XObjectExt.release(this.m_sourceInstanceIds);
	this.m_preQueries = oFF.XObjectExt.release(this.m_preQueries);
	oFF.BasicInAQuery.prototype.releaseObject.call( this );
};
oFF.InADataProvider.prototype.setAsMainQuery = function()
{
	this.m_isPreQuery = oFF.TriStateBool.lookup(false);
};
oFF.InADataProvider.prototype.setAsPreQuery = function()
{
	this.m_isPreQuery = oFF.TriStateBool.lookup(true);
};
oFF.InADataProvider.prototype.setPreQueries = function(preQueries)
{
	this.m_preQueries = preQueries;
};
oFF.InADataProvider.prototype.setupInARuntimeDataProvider = function(instanceId, requestStructure, connectionContainer, systemType)
{
	oFF.BasicInAQuery.prototype.setupBasicInAQuery.call( this , instanceId, null, connectionContainer, systemType);
	this.setGroupSignature(instanceId);
	this.setIsInARuntimeDataProvider(true);
	this.m_requestStructure = requestStructure;
	this.m_sourceInstanceIds = oFF.XList.create();
	this.m_isPreQuery = oFF.TriStateBool._DEFAULT;
	this.m_preQueries = oFF.XList.create();
};

oFF.InAMergeProcessor = function() {};
oFF.InAMergeProcessor.prototype = new oFF.XObject();
oFF.InAMergeProcessor.prototype._ff_c = "InAMergeProcessor";

oFF.InAMergeProcessor.create = function(connectionPool)
{
	let inAMergeProcessor = new oFF.InAMergeProcessor();
	inAMergeProcessor.setupInAMergeProcessor(connectionPool);
	return inAMergeProcessor;
};
oFF.InAMergeProcessor.prototype.m_batchFunctionsBySource = null;
oFF.InAMergeProcessor.prototype.m_connectionPool = null;
oFF.InAMergeProcessor.prototype.m_inaMergeRegistryManager = null;
oFF.InAMergeProcessor.prototype.m_inaMergeRequestBuilder = null;
oFF.InAMergeProcessor.prototype.m_inaMergeResponseDispatcher = null;
oFF.InAMergeProcessor.prototype.m_isRequestsProcessed = false;
oFF.InAMergeProcessor.prototype.m_mergedDocumentBySystem = null;
oFF.InAMergeProcessor.prototype.m_processingMode = null;
oFF.InAMergeProcessor.prototype.addInASourceQuery = function(instanceId, rpcFunction, connectionContainer, systemType, datasourceName, modelMetadata, measureDimensionMetadata)
{
	let inaSourceQuery = this.m_inaMergeRegistryManager.buildInASourceQueryAndRegister(instanceId, rpcFunction, connectionContainer, systemType, datasourceName, modelMetadata, measureDimensionMetadata);
	if (oFF.notNull(inaSourceQuery) && inaSourceQuery.isStandAloneQuery())
	{
		this.buildStandAloneQuery(inaSourceQuery, instanceId);
	}
};
oFF.InAMergeProcessor.prototype.addPreQueryExecution = function(syncType, mainQueryInADataProvider, batchFunctions, tempList)
{
	let preQueries = mainQueryInADataProvider.getPreQueries();
	for (let preQueryIndex = 0; preQueryIndex < preQueries.size(); preQueryIndex++)
	{
		let preQueryName = preQueries.get(preQueryIndex);
		let preQueryInADataProvider = this.m_inaMergeRegistryManager.getPreQueryInADataProviderByName(preQueryName);
		if (oFF.notNull(preQueryInADataProvider))
		{
			tempList.removeElement(preQueryInADataProvider.getInstanceId());
			batchFunctions.add(this.executeInADataProvider(preQueryInADataProvider, syncType, true));
		}
		this.addPreQueryExecution(syncType, preQueryInADataProvider, batchFunctions, tempList);
	}
};
oFF.InAMergeProcessor.prototype.addQueriesToRequestList = function(requestList, batchFunctions)
{
	let batchSize = batchFunctions.size();
	for (let i = 0; i < batchSize; i++)
	{
		let rpcBatchFunction = batchFunctions.get(i);
		let request = rpcBatchFunction.getRpcRequest();
		let requestStructure = request.getRequestStructure();
		requestList.add(requestStructure);
	}
};
oFF.InAMergeProcessor.prototype.buildInADataProvidersFromSourceQueries = function(systemName)
{
	let inaSourceQueryForMerge = this.m_inaMergeRegistryManager.getMergeableSourceQueries();
	let inaSourceQueryForMergeForConsideration = oFF.XList.create();
	for (let i = 0; i < inaSourceQueryForMerge.size(); i++)
	{
		let baseQuery = inaSourceQueryForMerge.get(i);
		if (oFF.XString.isEqual(baseQuery.getSystemName(), systemName))
		{
			inaSourceQueryForMergeForConsideration.add(baseQuery);
		}
	}
	this.m_inaMergeRegistryManager.groupSourceQueries(inaSourceQueryForMergeForConsideration);
	this.convertSourceQueriesToInADataProvider(inaSourceQueryForMergeForConsideration, systemName);
};
oFF.InAMergeProcessor.prototype.buildInAMergedQuery = function(instanceIds, groupSignature, inaSourceQueryRepo, systemName)
{
	let systemType = this.getInADataProviderSystemType(instanceIds);
	let mergedInARequest = this.getMergedRequestByGroupSignature(groupSignature, systemName);
	let requestStructure;
	if (this.m_processingMode === oFF.InAMergeProcessingMode.EXECUTE_PERSISTED && oFF.notNull(mergedInARequest))
	{
		requestStructure = mergedInARequest.getStructureByKey(oFF.InAQueryMergeConstants.TAG_MERGED_QUERY);
		let definitionStructure = oFF.PrUtilsJsonPath.getFirstElementFromPath(requestStructure, oFF.InAQueryMergeConstants.PA_DEFINITION_PATH);
		let dimensionsStructure = definitionStructure.getListByKey(oFF.InAQueryMergeConstants.QY_DIMENSIONS);
		let measureDimension = oFF.InARestrictedMeasureUtils.getMeasureStructure(dimensionsStructure);
		let queryDataCells = definitionStructure.getListByKey(oFF.InAQueryMergeConstants.QY_QUERY_DATA_CELLS);
		for (let i = 0; i < instanceIds.size(); i++)
		{
			let instanceId = instanceIds.get(i);
			let sourceQuery = this.m_inaMergeRegistryManager.getInASourceQuery(instanceId);
			let restrictedMeasureMap = oFF.XHashMapByString.create();
			let sourceFilter = sourceQuery.getFilter();
			if (oFF.notNull(sourceFilter))
			{
				let sourceSelection = sourceFilter.getStructureByKey(oFF.InAQueryMergeConstants.QY_SELECTION);
				let sourceMeasureMemberNames = oFF.InARestrictedMeasureUtils.extractMeasuresFromSelection(sourceSelection, null);
				this.m_inaMergeRequestBuilder.getRestrictedMeasureFilter(sourceMeasureMemberNames, sourceSelection, measureDimension, queryDataCells, restrictedMeasureMap);
			}
			let sourceMeasureDimension = sourceQuery.getMeasureDimension();
			if (oFF.notNull(sourceMeasureDimension))
			{
				let restrictedMeasureMapStored = sourceMeasureDimension.getStructureByKey(oFF.InAQueryMergeConstants.TAG_MEASURE_METADATA_FOR_PERSISTED_INA).getStructureByKey(oFF.InAQueryMergeConstants.TAG_MEASURE_MD_RESTRICTED_MEASURE_MAP);
				if (oFF.notNull(restrictedMeasureMapStored))
				{
					let keysAsReadOnlyListOfString = restrictedMeasureMapStored.getKeysAsReadOnlyList();
					for (let k = 0; k < keysAsReadOnlyListOfString.size(); k++)
					{
						let key = keysAsReadOnlyListOfString.get(k);
						let value = restrictedMeasureMapStored.getStringByKey(key);
						restrictedMeasureMap.put(key, value);
					}
				}
			}
			this.m_inaMergeRequestBuilder.assignRestrictedMeasureToSourceQuery(sourceQuery, restrictedMeasureMap);
		}
	}
	else
	{
		requestStructure = this.m_inaMergeRequestBuilder.createInADataProviderRequestStructure(instanceIds, systemType);
	}
	let connectionContainer = this.getInADataProviderConnectionContainer(instanceIds);
	let inaDataProvider = this.createInADataProvider(groupSignature, instanceIds, requestStructure, connectionContainer, systemType);
	oFF.InAQueryMergeUtils.overwriteInstanceIdInDataSource(requestStructure, inaDataProvider.getInstanceId());
	this.maintainSourceQueryState(instanceIds, inaSourceQueryRepo);
	this.registerAndMaintainInADataProvider(inaDataProvider);
};
oFF.InAMergeProcessor.prototype.buildStandAloneQuery = function(inaSourceQuery, groupSignature)
{
	inaSourceQuery.setIsStandAloneQuery(true);
	let instanceId = inaSourceQuery.getInstanceId();
	let sourceInstanceIds = oFF.XList.create();
	sourceInstanceIds.add(instanceId);
	let inaDataProvider = this.createInADataProvider(groupSignature, sourceInstanceIds, inaSourceQuery.getRequestStructure(), inaSourceQuery.getConnectionContainer(), inaSourceQuery.getSystemType());
	inaDataProvider.setIsStandAloneQuery(true);
	this.registerAndMaintainInADataProvider(inaDataProvider);
};
oFF.InAMergeProcessor.prototype.collectProcessingHints = function(_function, sourceIds)
{
	let rpcRequest = _function.getRpcRequest();
	let hint = rpcRequest.getProcessingHint();
	let sourceQuery = this.m_inaMergeRegistryManager.getInASourceQuery(sourceIds.get(0));
	let processingHint = sourceQuery.getRpcFunction().getRpcRequest().getProcessingHint();
	let hintsList = hint.putNewList(oFF.ConnectionConstants.INA_BATCH);
	hintsList.add(processingHint);
	let batchRequest = rpcRequest.getRequestStructure().getListByKey("Batch");
	if (oFF.notNull(batchRequest))
	{
		let batchSize = batchRequest.size();
		for (let i = 1; i < batchSize; i++)
		{
			hintsList.add(processingHint);
		}
	}
};
oFF.InAMergeProcessor.prototype.convertSourceQueriesToInADataProvider = function(inaSourceQueryRepo, systemName)
{
	if (inaSourceQueryRepo.size() > 1)
	{
		let tempGroups = this.m_inaMergeRegistryManager.getGroupSignatures();
		let groupsCount = tempGroups.size();
		for (let i = 0; i < groupsCount; i++)
		{
			let groupSignature = tempGroups.get(i);
			let instanceIds = this.m_inaMergeRegistryManager.getSourceIDsBySignature(groupSignature);
			if (instanceIds.size() > 1)
			{
				this.buildInAMergedQuery(instanceIds, groupSignature, inaSourceQueryRepo, systemName);
			}
			else if (instanceIds.size() === 1)
			{
				let instanceId = instanceIds.get(0);
				let inaSourceQuery = this.m_inaMergeRegistryManager.getInASourceQuery(instanceId);
				this.buildStandAloneQuery(inaSourceQuery, groupSignature);
			}
		}
	}
	else if (inaSourceQueryRepo.size() === 1)
	{
		let inaQuery = inaSourceQueryRepo.get(0);
		this.buildStandAloneQuery(inaQuery, inaQuery.getGroupSignature());
	}
};
oFF.InAMergeProcessor.prototype.createInADataProvider = function(groupSignature, sourceInstanceIds, requestStructure, connectionContainer, systemType)
{
	let inaDataProvider = oFF.InADataProvider.create(groupSignature, requestStructure, connectionContainer, systemType);
	for (let i = 0; i < sourceInstanceIds.size(); i++)
	{
		let sourceInstanceId = sourceInstanceIds.get(i);
		inaDataProvider.addSourceInstanceId(sourceInstanceId);
	}
	return inaDataProvider;
};
oFF.InAMergeProcessor.prototype.createInADataProviderRpcFunction = function(connectionContainer, requestStructure, realBatchRPCFunction)
{
	let batchManager = connectionContainer.getBatchRequestManager();
	let batchModePath = connectionContainer.getBatchModePathExt();
	let _function = realBatchRPCFunction ? connectionContainer.newRpcFunctionByUri(batchModePath) : connectionContainer.newRpcFunctionInternal(batchModePath, false);
	if (realBatchRPCFunction)
	{
		batchManager.removeBatchFunction(_function);
	}
	let request = _function.getRpcRequest();
	request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
	request.setAcceptContentType(oFF.ContentType.APPLICATION_JSON);
	request.setRequestStructure(requestStructure);
	return _function;
};
oFF.InAMergeProcessor.prototype.executeInADataProvider = function(inaDataProvider, syncType, realBatchRPCFunction)
{
	let syncTypeToUse = realBatchRPCFunction ? oFF.SyncType.NON_BLOCKING : syncType;
	let connectionContainer = inaDataProvider.getConnectionContainer();
	let requestStructure = inaDataProvider.getRequestStructure();
	let cleanedRequest = oFF.InAQueryMergeUtils.cleanTagsFromRequest(requestStructure, false);
	let requestStructureToUse = realBatchRPCFunction ? cleanedRequest : this.wrapRequestStructureAsBatch(cleanedRequest);
	let sourceIds = inaDataProvider.getSourceInstanceIds();
	let _function = this.createInADataProviderRpcFunction(connectionContainer, requestStructureToUse, realBatchRPCFunction);
	this.collectProcessingHints(_function, sourceIds);
	inaDataProvider.setRpcFunction(_function);
	this.updateQueryState(inaDataProvider, oFF.InAQueryMergeConstants.QUERY_STATE_PENDING_PROCESSING);
	_function.processFunctionExecution(syncTypeToUse, this, inaDataProvider);
	return _function;
};
oFF.InAMergeProcessor.prototype.getConnectionPool = function()
{
	return this.m_connectionPool;
};
oFF.InAMergeProcessor.prototype.getInADataProviderConnectionContainer = function(instanceIds)
{
	let instanceId = instanceIds.get(0);
	let inaQuery0 = this.m_inaMergeRegistryManager.getInASourceQuery(instanceId);
	let connectionContainer = inaQuery0.getConnectionContainer();
	return connectionContainer;
};
oFF.InAMergeProcessor.prototype.getInADataProviderSystemType = function(instanceIds)
{
	let instanceId = instanceIds.get(0);
	let inaQuery0 = this.m_inaMergeRegistryManager.getInASourceQuery(instanceId);
	let systemType = inaQuery0.getSystemType();
	return systemType;
};
oFF.InAMergeProcessor.prototype.getInAMergeProcessingMode = function()
{
	return this.m_processingMode;
};
oFF.InAMergeProcessor.prototype.getMergedPersistResponse = function(systemName)
{
	return this.m_mergedDocumentBySystem.getByKey(oFF.XStringValue.create(systemName));
};
oFF.InAMergeProcessor.prototype.getMergedRequestByGroupSignature = function(groupSignature, systemName)
{
	let returnGroup = null;
	if (this.m_processingMode === oFF.InAMergeProcessingMode.EXECUTE_PERSISTED)
	{
		let mergedPersistResponse = this.getMergedPersistResponse(systemName);
		let numberOfGroups = mergedPersistResponse.size();
		for (let index = 0; index < numberOfGroups; index++)
		{
			let group = mergedPersistResponse.get(index);
			let mergedQuery = group.getStructureByKey(oFF.InAQueryMergeConstants.TAG_MERGED_QUERY);
			if (oFF.notNull(mergedQuery))
			{
				let groupInstanceId = mergedQuery.getStructureByKey(oFF.InAQueryMergeConstants.QY_ANALYTICS).getStructureByKey(oFF.InAQueryMergeConstants.QY_DATASOURCE).getStringByKey(oFF.InAQueryMergeConstants.QY_INSTANCE_ID);
				if (oFF.XString.isEqual(groupSignature, groupInstanceId))
				{
					returnGroup = group;
					break;
				}
			}
		}
	}
	return returnGroup;
};
oFF.InAMergeProcessor.prototype.hasMeasureMembersMetadata = function(measureDimensionName)
{
	return this.m_inaMergeRegistryManager.hasMeasureMembersMetadata(measureDimensionName);
};
oFF.InAMergeProcessor.prototype.hasModelMetadata = function(datasourceName)
{
	return this.m_inaMergeRegistryManager.hasModelMetadata(datasourceName);
};
oFF.InAMergeProcessor.prototype.isRequestsProcessed = function()
{
	return this.m_isRequestsProcessed;
};
oFF.InAMergeProcessor.prototype.maintainInADataProviderState = function(inaDataProvider)
{
	inaDataProvider.setQueryState(oFF.InAQueryMergeConstants.QUERY_STATE_MERGE_CHECKED);
	let instanceId = inaDataProvider.getInstanceId();
	this.m_inaMergeRegistryManager.registerInADataProvider(instanceId, inaDataProvider);
};
oFF.InAMergeProcessor.prototype.maintainSourceQueryState = function(instanceIds, inaSourceQueryRepo)
{
	for (let i = 0; i < instanceIds.size(); i++)
	{
		let instanceId = instanceIds.get(i);
		let inaQuery = this.m_inaMergeRegistryManager.getInASourceQuery(instanceId);
		inaQuery.setQueryState(oFF.InAQueryMergeConstants.QUERY_STATE_MERGE_CHECKED);
		inaSourceQueryRepo.removeElement(inaQuery);
	}
};
oFF.InAMergeProcessor.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	let inaDataProvider = customIdentifier;
	let targetFunctions = null;
	if (inaDataProvider.isMainQuery())
	{
		targetFunctions = this.m_batchFunctionsBySource.remove(oFF.XStringValue.create(inaDataProvider.getInstanceId()));
	}
	if (inaDataProvider.isMainQuery() && oFF.notNull(targetFunctions))
	{
		this.updateResponsesInBatchFunctions(targetFunctions, extResult);
	}
	else
	{
		this.m_inaMergeResponseDispatcher.dispatchInAResponse(inaDataProvider, extResult);
	}
};
oFF.InAMergeProcessor.prototype.persistInADataProvider = function(inaDataProvider, systemName, mergePersistResponse)
{
	let mergedInA = inaDataProvider.getRequestStructure();
	let sources = inaDataProvider.getSourceInstanceIds();
	let sourcesAndTheirInterestToPersist = oFF.PrFactory.createList();
	oFF.XStream.ofString(sources).forEach((instanceId) => {
		let sourceInstanceId = instanceId.getString();
		let inASourceQuery = this.m_inaMergeRegistryManager.getInASourceQuery(sourceInstanceId);
		let requestStructure = inASourceQuery.getRequestStructure();
		let analytics = requestStructure.getStructureByKey(oFF.InAQueryMergeConstants.QY_ANALYTICS);
		analytics.putBoolean(oFF.InAQueryMergeConstants.QY_STANDALONE_INDICATOR, sources.size() === 1);
		if (!inaDataProvider.isStandAloneQuery())
		{
			analytics.getStructureByKey(oFF.InAQueryMergeConstants.QY_DATASOURCE).putString(oFF.InAQueryMergeConstants.TAG_GROUP_SIGNATURE, inASourceQuery.getGroupSignature());
			let measureDimension = inASourceQuery.getMeasureDimension();
			if (oFF.notNull(measureDimension))
			{
				let measureDimensionName = inASourceQuery.getMeasureDimensionName();
				let measureKey = this.m_inaMergeRegistryManager.getKeyFieldOfDimension(measureDimensionName);
				let measureMetadata = measureDimension.putNewStructure(oFF.InAQueryMergeConstants.TAG_MEASURE_METADATA_FOR_PERSISTED_INA);
				measureMetadata.putString(oFF.InAQueryMergeConstants.QY_NAME, measureDimensionName);
				measureMetadata.putString(oFF.InAQueryMergeConstants.QY_KEY_ATTRIBUTE, measureKey);
				let restrictedMeasureSourceMeasureMap = inASourceQuery.getRestrictedMeasureSourceMeasureMap();
				let restrictMeasuresToOriginalMeasuresMap = measureMetadata.putNewStructure(oFF.InAQueryMergeConstants.TAG_MEASURE_MD_RESTRICTED_MEASURE_MAP);
				let keys = restrictedMeasureSourceMeasureMap.getKeysAsReadOnlyList();
				for (let i = 0; i < keys.size(); i++)
				{
					let key = keys.get(i);
					let value = restrictedMeasureSourceMeasureMap.getByKey(key);
					restrictMeasuresToOriginalMeasuresMap.putString(key, value);
				}
			}
		}
		this.m_inaMergeRegistryManager.unregisterInASourceQuery(sourceInstanceId);
		sourcesAndTheirInterestToPersist.add(requestStructure);
	});
	let requestGroup = oFF.PrFactory.createStructure();
	if (!inaDataProvider.isStandAloneQuery())
	{
		requestGroup.put(oFF.InAQueryMergeConstants.TAG_MERGED_QUERY, mergedInA);
	}
	requestGroup.put(oFF.InAQueryMergeConstants.TAG_MERGE_QUERY_RESPONSE_RECEPIENTS, sourcesAndTheirInterestToPersist);
	this.m_inaMergeRegistryManager.unregisterInADataProvider(inaDataProvider.getGroupSignature(), inaDataProvider.getInstanceId());
	mergePersistResponse.add(requestGroup);
};
oFF.InAMergeProcessor.prototype.processInADataProviders = function(syncType, systemName)
{
	let processingMode = this.m_processingMode;
	let tempList = oFF.XList.create();
	tempList.addAll(this.m_inaMergeRegistryManager.getInADataProviders());
	let mainQueryList = this.m_inaMergeRegistryManager.getAllMainQueryInADataProviders();
	if (oFF.XCollectionUtils.hasElements(mainQueryList) && processingMode !== oFF.InAMergeProcessingMode.MERGE_PERSIST)
	{
		for (let mainQueryIndex = 0; mainQueryIndex < mainQueryList.size(); mainQueryIndex++)
		{
			let mainQueryInADataProvider = mainQueryList.get(mainQueryIndex);
			tempList.removeElement(mainQueryInADataProvider.getInstanceId());
			if (!mainQueryInADataProvider.isPendingProcessing())
			{
				let batchFunctions = oFF.XList.create();
				this.m_batchFunctionsBySource.put(oFF.XStringValue.create(mainQueryInADataProvider.getInstanceId()), batchFunctions);
				batchFunctions.add(this.executeInADataProvider(mainQueryInADataProvider, syncType, true));
				let allsourcesForThisRequest = oFF.XList.create();
				allsourcesForThisRequest.addAll(mainQueryInADataProvider.getSourceInstanceIds());
				this.addPreQueryExecution(syncType, mainQueryInADataProvider, batchFunctions, tempList);
				let batchStructure = oFF.PrFactory.createStructure();
				let requestList = batchStructure.putNewList(oFF.ConnectionConstants.INA_BATCH);
				this.addQueriesToRequestList(requestList, batchFunctions);
				let _function = this.createInADataProviderRpcFunction(mainQueryInADataProvider.getConnectionContainer(), batchStructure, false);
				let request = _function.getRpcRequest();
				request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
				request.setAcceptContentType(oFF.ContentType.APPLICATION_JSON);
				request.setRequestStructure(batchStructure);
				this.collectProcessingHints(_function, allsourcesForThisRequest);
				_function.processFunctionExecution(syncType, this, mainQueryInADataProvider);
			}
		}
	}
	let mergePersistResponse = oFF.XList.create();
	this.m_mergedDocumentBySystem.put(oFF.XStringValue.create(systemName), mergePersistResponse);
	for (let i = 0; i < tempList.size(); i++)
	{
		let instanceId = tempList.get(i);
		let inaDataProvider = this.m_inaMergeRegistryManager.getInADataProvider(instanceId);
		if (!inaDataProvider.isPendingProcessing())
		{
			if (processingMode === oFF.InAMergeProcessingMode.MERGE_PERSIST)
			{
				this.persistInADataProvider(inaDataProvider, systemName, mergePersistResponse);
			}
			else
			{
				let defaultQuery = !inaDataProvider.isPreQuery() && !inaDataProvider.isMainQuery();
				if (defaultQuery)
				{
					this.executeInADataProvider(inaDataProvider, syncType, false);
				}
			}
		}
	}
};
oFF.InAMergeProcessor.prototype.processInAMerge = function(syncType, systemName)
{
	this.buildInADataProvidersFromSourceQueries(systemName);
	this.processInADataProviders(syncType, systemName);
};
oFF.InAMergeProcessor.prototype.registerAndMaintainInADataProvider = function(inaDataProvider)
{
	this.maintainInADataProviderState(inaDataProvider);
	let requestDefinition = inaDataProvider.getRequestStructure().getStructureByKey(oFF.InAQueryMergeConstants.QY_ANALYTICS).getStructureByKey(oFF.InAQueryMergeConstants.QY_DEFINITION);
	let returnEmptyJsonResultSet = requestDefinition.getStructureByKey(oFF.InAQueryMergeConstants.QY_RS_FEATURE_REQUEST).getBooleanByKeyExt(oFF.InAQueryMergeConstants.QY_RETURN_EMPTY_JSON_RESULTSET, false);
	let requestDimensions = requestDefinition.getListByKey(oFF.InAQueryMergeConstants.QY_DIMENSIONS);
	let result = oFF.XStream.of(requestDimensions).filter((dim) => {
		return dim.getStructureByKey(oFF.InAQueryMergeConstants.QY_DATASOURCE) !== null;
	}).mapToString((dim2) => {
		let dimension = dim2;
		return dimension.getStructureByKey(oFF.InAQueryMergeConstants.QY_DATASOURCE).getStringByKey(oFF.InAQueryMergeConstants.QY_OBJECT_NAME);
	}).collect(oFF.XStreamCollector.toListOfString((i1) => {
		return i1.getStringRepresentation();
	}));
	if (returnEmptyJsonResultSet)
	{
		let preQueryName = requestDefinition.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME);
		inaDataProvider.setPreQueryName(preQueryName);
		inaDataProvider.setPreQueries(result);
		inaDataProvider.setAsPreQuery();
	}
	else if (oFF.notNull(result) && result.hasElements())
	{
		inaDataProvider.setPreQueries(result);
		inaDataProvider.setAsMainQuery();
	}
};
oFF.InAMergeProcessor.prototype.releaseObject = function()
{
	this.m_connectionPool = null;
	this.m_processingMode = null;
	this.m_inaMergeRegistryManager = oFF.XObjectExt.release(this.m_inaMergeRegistryManager);
	this.m_inaMergeRequestBuilder = oFF.XObjectExt.release(this.m_inaMergeRequestBuilder);
	this.m_inaMergeResponseDispatcher = oFF.XObjectExt.release(this.m_inaMergeResponseDispatcher);
	this.m_batchFunctionsBySource = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_batchFunctionsBySource);
	this.m_mergedDocumentBySystem = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_mergedDocumentBySystem);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.InAMergeProcessor.prototype.setInAMergeProcessingMode = function(inaMergeProcessingMode)
{
	this.m_processingMode = inaMergeProcessingMode;
};
oFF.InAMergeProcessor.prototype.setIsRequestsProcessed = function(isRequestsProcessed)
{
	this.m_isRequestsProcessed = isRequestsProcessed;
};
oFF.InAMergeProcessor.prototype.setMergedPersistResponse = function(mergedRequest, systemName)
{
	this.m_mergedDocumentBySystem.put(oFF.XStringValue.create(systemName), mergedRequest);
};
oFF.InAMergeProcessor.prototype.setupInAMergeProcessor = function(connectionPool)
{
	this.m_connectionPool = connectionPool;
	this.m_processingMode = oFF.InAMergeProcessingMode.MERGE_EXECUTE;
	this.m_inaMergeRegistryManager = oFF.InAMergeRegistryManager.create();
	this.m_inaMergeRequestBuilder = oFF.InAMergeRequestBuilder.create(this.m_inaMergeRegistryManager);
	this.m_inaMergeResponseDispatcher = oFF.InAMergeResponseDispatcher.create(this.m_inaMergeRegistryManager);
	this.m_isRequestsProcessed = false;
	this.m_batchFunctionsBySource = oFF.XSimpleMap.create();
	this.m_mergedDocumentBySystem = oFF.XSimpleMap.create();
};
oFF.InAMergeProcessor.prototype.updateAllBatchFunctions = function(batchList, rootElement, targetFunctions)
{
	let batchFunctionSize = targetFunctions.size();
	if (oFF.notNull(batchList))
	{
		for (let k = 0; k < batchFunctionSize; k++)
		{
			let batchFunction = targetFunctions.get(k);
			let batchFunctionResponse = batchFunction.getRpcResponse();
			let batchRootElement = batchList.getStructureAt(k);
			batchFunctionResponse.setRootElement(batchRootElement, null);
			batchFunction.endSync();
		}
	}
	else
	{
		for (let i = 0; i < batchFunctionSize; i++)
		{
			targetFunctions.get(i).getRpcResponse().setRootElement(rootElement, null);
		}
	}
};
oFF.InAMergeProcessor.prototype.updateQueryState = function(inaDataProvider, state)
{
	let sourceIds = inaDataProvider.getSourceInstanceIds();
	for (let i = 0; i < sourceIds.size(); i++)
	{
		let sourceId = sourceIds.get(i);
		let sourceQuery = this.m_inaMergeRegistryManager.getInASourceQuery(sourceId);
		sourceQuery.setQueryState(state);
	}
	inaDataProvider.setQueryState(state);
};
oFF.InAMergeProcessor.prototype.updateResponsesInBatchFunctions = function(targetFunctions, extResult)
{
	if (extResult.isValid())
	{
		let response = extResult.getData();
		let rootElement = response.getRootElement();
		let batchList = rootElement.getListByKey(oFF.ConnectionConstants.INA_BATCH);
		this.updateAllBatchFunctions(batchList, rootElement, targetFunctions);
	}
};
oFF.InAMergeProcessor.prototype.wrapRequestStructureAsBatch = function(request)
{
	let requestStructure = oFF.PrFactory.createStructure();
	let batchList = requestStructure.putNewList(oFF.InAQueryMergeConstants.QY_BATCH);
	batchList.add(request);
	return requestStructure;
};

oFF.InAMergeProcessorSetupInitiator = function() {};
oFF.InAMergeProcessorSetupInitiator.prototype = new oFF.InAMergeProcessorFactory();
oFF.InAMergeProcessorSetupInitiator.prototype._ff_c = "InAMergeProcessorSetupInitiator";

oFF.InAMergeProcessorSetupInitiator.staticSetup = function()
{
	oFF.InAMergeProcessorFactory.registerFactory(new oFF.InAMergeProcessorSetupInitiator());
};
oFF.InAMergeProcessorSetupInitiator.prototype.newInAMergeProcessor = function(connectionPool)
{
	return oFF.InAMergeProcessor.create(connectionPool);
};

oFF.InASourceQuery = function() {};
oFF.InASourceQuery.prototype = new oFF.BasicInAQuery();
oFF.InASourceQuery.prototype._ff_c = "InASourceQuery";

oFF.InASourceQuery.create = function(instanceId, rpcFunction, connectionContainer, systemType)
{
	let query = new oFF.InASourceQuery();
	query.setupInASourceQuery(instanceId, rpcFunction, connectionContainer, systemType);
	return query;
};
oFF.InASourceQuery.prototype.m_hasMergeRestrictedMeasure = false;
oFF.InASourceQuery.prototype.m_hasSourceMeasureFilter = false;
oFF.InASourceQuery.prototype.m_measureMemberPositionCounter = 0;
oFF.InASourceQuery.prototype.m_membersPositionMap = null;
oFF.InASourceQuery.prototype.m_restrictedMeasureSourceMeasureMap = null;
oFF.InASourceQuery.prototype.addMeasureMemberName = function(measureMemberName, isMergeRestrictedMeasure, isFromSourceFilter, basicMemberName)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(measureMemberName))
	{
		if (isMergeRestrictedMeasure)
		{
			this.m_hasMergeRestrictedMeasure = true;
		}
		if (isFromSourceFilter)
		{
			this.m_hasSourceMeasureFilter = true;
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(basicMemberName))
		{
			this.m_restrictedMeasureSourceMeasureMap.put(measureMemberName, basicMemberName);
			let basicMemberPosition = -1;
			for (let i = 0; i < this.m_membersPositionMap.size(); i++)
			{
				let expectedMember = this.m_membersPositionMap.getByKey(oFF.XIntegerValue.create(i));
				if (oFF.XString.isEqual(basicMemberName, expectedMember.getString()))
				{
					basicMemberPosition = i;
					break;
				}
			}
			if (basicMemberPosition !== -1)
			{
				this.m_membersPositionMap.put(oFF.XIntegerValue.create(basicMemberPosition), oFF.XStringValue.create(measureMemberName));
			}
		}
		else
		{
			this.m_membersPositionMap.put(oFF.XIntegerValue.create(++this.m_measureMemberPositionCounter), oFF.XStringValue.create(measureMemberName));
		}
	}
};
oFF.InASourceQuery.prototype.getMeasureMemberPositionMap = function()
{
	return this.m_membersPositionMap;
};
oFF.InASourceQuery.prototype.getRestrictedMeasureSourceMeasureMap = function()
{
	return this.m_restrictedMeasureSourceMeasureMap;
};
oFF.InASourceQuery.prototype.getSourceMemberName = function(restrictedMeasureName)
{
	return this.m_restrictedMeasureSourceMeasureMap.getByKey(restrictedMeasureName);
};
oFF.InASourceQuery.prototype.hasMeasureFilter = function()
{
	return this.m_hasSourceMeasureFilter;
};
oFF.InASourceQuery.prototype.hasMergeRestrictedMeasure = function()
{
	return this.m_hasMergeRestrictedMeasure;
};
oFF.InASourceQuery.prototype.releaseObject = function()
{
	oFF.BasicInAQuery.prototype.releaseObject.call( this );
	this.m_membersPositionMap = oFF.XObjectExt.release(this.m_membersPositionMap);
	this.m_restrictedMeasureSourceMeasureMap = oFF.XObjectExt.release(this.m_restrictedMeasureSourceMeasureMap);
};
oFF.InASourceQuery.prototype.setupInASourceQuery = function(instanceId, rpcFunction, connectionContainer, systemType)
{
	oFF.BasicInAQuery.prototype.setupBasicInAQuery.call( this , instanceId, rpcFunction, connectionContainer, systemType);
	this.m_hasSourceMeasureFilter = false;
	this.m_hasMergeRestrictedMeasure = false;
	this.m_measureMemberPositionCounter = -1;
	this.m_membersPositionMap = oFF.XSimpleMap.create();
	this.m_restrictedMeasureSourceMeasureMap = oFF.XHashMapByString.create();
	let requestDefinition = this.getRequestStructure().getStructureByKey(oFF.InAQueryMergeConstants.QY_ANALYTICS).getStructureByKey(oFF.InAQueryMergeConstants.QY_DEFINITION);
	let returnEmptyJsonResultSet = requestDefinition.getStructureByKey(oFF.InAQueryMergeConstants.QY_RS_FEATURE_REQUEST).getBooleanByKeyExt(oFF.InAQueryMergeConstants.QY_RETURN_EMPTY_JSON_RESULTSET, false);
	if (returnEmptyJsonResultSet)
	{
		this.setPreQueryName(requestDefinition.getStringByKey(oFF.InAQueryMergeConstants.QY_NAME));
	}
};

oFF.BatchRequestManager = function() {};
oFF.BatchRequestManager.prototype = new oFF.XObject();
oFF.BatchRequestManager.prototype._ff_c = "BatchRequestManager";

oFF.BatchRequestManager.CONSTANT_ID = null;
oFF.BatchRequestManager.create = function(session)
{
	let batchRequestManager = new oFF.BatchRequestManager();
	batchRequestManager.m_session = session;
	batchRequestManager.m_batchFunctions = oFF.XList.create();
	batchRequestManager.m_preQueryNames = oFF.XHashSetOfString.create();
	batchRequestManager.m_microCubeNames = oFF.XHashSetOfString.create();
	return batchRequestManager;
};
oFF.BatchRequestManager.prototype.m_batchFunctions = null;
oFF.BatchRequestManager.prototype.m_batchFunctionsIdMapping = null;
oFF.BatchRequestManager.prototype.m_batchModePath = null;
oFF.BatchRequestManager.prototype.m_cacheHintsEnabled = false;
oFF.BatchRequestManager.prototype.m_customIdentifier = null;
oFF.BatchRequestManager.prototype.m_functionFactory = null;
oFF.BatchRequestManager.prototype.m_listener = null;
oFF.BatchRequestManager.prototype.m_microCubeNames = null;
oFF.BatchRequestManager.prototype.m_preQueryNames = null;
oFF.BatchRequestManager.prototype.m_session = null;
oFF.BatchRequestManager.prototype.m_streamingGuid = null;
oFF.BatchRequestManager.prototype.m_syncType = null;
oFF.BatchRequestManager.prototype.addBatchFunction = function(_function)
{
	this.m_batchFunctions.add(_function);
};
oFF.BatchRequestManager.prototype.addMainClientInfoIfSupported = function(batchStructure)
{
	let supportsClientInfo = this.m_functionFactory.supportsAnalyticCapability(oFF.InAConstantsBios.QY_CI_CLIENT_INFO);
	let supportsFlexibleClientInfo = this.m_functionFactory.supportsAnalyticCapability(oFF.InAConstantsBios.QY_CI_CLIENT_INFO_WITH_CONTEXT_ID);
	if (!supportsFlexibleClientInfo)
	{
		let application = this.m_functionFactory.getProcess().getApplication();
		oFF.QInAClientInfo.exportClientInfo(batchStructure, application, supportsClientInfo);
	}
};
oFF.BatchRequestManager.prototype.addMicroCubeName = function(name)
{
	this.m_microCubeNames.add(name);
};
oFF.BatchRequestManager.prototype.addPreQueryName = function(preQueryName)
{
	this.m_preQueryNames.add(preQueryName);
};
oFF.BatchRequestManager.prototype.addQueriesToRequestList = function(requestList)
{
	let batchSize = this.m_batchFunctions.size();
	let isStreamingFeasible = batchSize > 1;
	for (let i = 0; i < batchSize; i++)
	{
		let rpcBatchFunction = this.m_batchFunctions.get(i);
		let request = rpcBatchFunction.getRpcRequest();
		let requestStructure = request.getRequestStructure();
		let decorator = oFF.BatchRequestDecoratorFactory.getBatchRequestDecorator(this.m_session, requestStructure);
		if (oFF.isNull(decorator))
		{
			requestList.add(requestStructure);
			if (this.getInstanceId(requestStructure) === null)
			{
				isStreamingFeasible = false;
			}
		}
		else
		{
			isStreamingFeasible = false;
			rpcBatchFunction.setDecorator(decorator);
			let requestStructureFlat = decorator.getRequestItems();
			if (oFF.notNull(requestStructureFlat))
			{
				for (let flatIndex = 0; flatIndex < requestStructureFlat.size(); flatIndex++)
				{
					requestList.add(requestStructureFlat.get(flatIndex));
				}
			}
		}
	}
	return isStreamingFeasible;
};
oFF.BatchRequestManager.prototype.collectProcessingHints = function(_function)
{
	let hint = _function.getRpcRequest().getProcessingHint();
	this.m_cacheHintsEnabled = hint.getBooleanByKeyExt(oFF.ConnectionParameters.CACHE_HINTS_ENABLED, false);
	let hintsList = hint.putNewList(oFF.ConnectionConstants.INA_BATCH);
	let i = 0;
	while (i < this.m_batchFunctions.size())
	{
		let rpcBatchFunction = this.m_batchFunctions.get(i);
		let processingHint = rpcBatchFunction.getRpcRequest().getProcessingHint();
		hintsList.add(processingHint);
		this.m_cacheHintsEnabled = this.m_cacheHintsEnabled || processingHint.getBooleanByKeyExt(oFF.ConnectionParameters.CACHE_HINTS_ENABLED, false);
		i++;
	}
};
oFF.BatchRequestManager.prototype.containsPreQueryName = function(preQueryName)
{
	return this.m_preQueryNames.contains(preQueryName);
};
oFF.BatchRequestManager.prototype.createGuid = function(constantGuidPostfix)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(oFF.BatchRequestManager.CONSTANT_ID))
	{
		return oFF.XStringUtils.concatenate2(oFF.BatchRequestManager.CONSTANT_ID, constantGuidPostfix);
	}
	return oFF.XGuid.getGuid();
};
oFF.BatchRequestManager.prototype.endFunctions = function(executedFunctions, extResult, executedFunctionsResult)
{
	let size = executedFunctions.size();
	for (let i = 0; i < size; i++)
	{
		let _function = executedFunctions.get(i);
		_function.addAllMessages(extResult);
		_function.addAllMessages(executedFunctionsResult);
		_function.endSync();
	}
};
oFF.BatchRequestManager.prototype.ensureUniqueInstanceIds = function()
{
	this.m_batchFunctionsIdMapping = oFF.XHashMapByString.create();
	let size = this.m_batchFunctions.size();
	for (let i = 0; i < size; i++)
	{
		let batchFunction = this.m_batchFunctions.get(i);
		let requestStructure = batchFunction.getRpcRequest().getRequestStructure();
		let instanceId = this.getInstanceId(requestStructure);
		if (this.m_batchFunctionsIdMapping.containsKey(instanceId) || oFF.XStringUtils.isNotNullAndNotEmpty(oFF.BatchRequestManager.CONSTANT_ID))
		{
			instanceId = this.createGuid(oFF.XInteger.convertToString(i));
			this.getDataSource(requestStructure).putString(oFF.ConnectionConstants.INA_INSTANCE_ID, instanceId);
		}
		this.m_batchFunctionsIdMapping.put(instanceId, batchFunction);
	}
};
oFF.BatchRequestManager.prototype.executeBatch = function(syncType, functionFactory, batchModePath, enableRsStreaming, listener, customIdentifier)
{
	this.removeExecutedFunctions();
	this.m_preQueryNames.clear();
	let application = functionFactory.getProcess().getApplication();
	let olapEnvironment = application.getOlapEnvironment();
	olapEnvironment.clearTransientQueryManager();
	this.m_listener = listener;
	this.m_customIdentifier = customIdentifier;
	if (!oFF.XCollectionUtils.hasElements(this.m_batchFunctions))
	{
		this.onBatchFinished();
		return;
	}
	this.m_syncType = syncType;
	this.m_functionFactory = functionFactory;
	this.m_batchModePath = batchModePath;
	let batchStructure = oFF.PrFactory.createStructure();
	let requestList = batchStructure.putNewList(oFF.ConnectionConstants.INA_BATCH);
	let isStreamingFeasible = this.addQueriesToRequestList(requestList);
	this.addMainClientInfoIfSupported(batchStructure);
	if (enableRsStreaming && isStreamingFeasible)
	{
		this.m_streamingGuid = this.createGuid(null);
		this.ensureUniqueInstanceIds();
		let asyncResponseRequest = batchStructure.putNewStructure(oFF.ConnectionConstants.INA_BATCH_ASYNC_RESPONSE_REQUEST);
		asyncResponseRequest.putString(oFF.ConnectionConstants.INA_BATCH_ID, this.m_streamingGuid);
	}
	let _function = functionFactory.newRpcFunctionInternal(batchModePath, false);
	let request = _function.getRpcRequest();
	request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
	request.setAcceptContentType(oFF.ContentType.APPLICATION_JSON);
	request.setRequestStructure(batchStructure);
	this.collectProcessingHints(_function);
	_function.processFunctionExecution(syncType, this, null);
};
oFF.BatchRequestManager.prototype.executeNextStreamingRequest = function()
{
	let batchStructure = oFF.PrFactory.createStructure();
	let analytics = batchStructure.putNewStructure(oFF.ConnectionConstants.INA_ANALYTICS);
	let actions = analytics.putNewList(oFF.ConnectionConstants.INA_ACTIONS);
	let structure = actions.addNewStructure();
	structure.putString(oFF.ConnectionConstants.INA_TYPE, oFF.ConnectionConstants.INA_BATCH_NEXT_ASYNC_RESPONSE);
	structure.putString(oFF.ConnectionConstants.INA_BATCH_ID, this.m_streamingGuid);
	this.addMainClientInfoIfSupported(batchStructure);
	let batch = structure.putNewList(oFF.ConnectionConstants.INA_BATCH);
	oFF.XStream.of(this.m_batchFunctions).map((bf) => {
		return bf.getRpcRequest().getRequestStructure();
	}).filter((rs1) => {
		return this.getDataSource(rs1) !== null;
	}).forEach((rs2) => {
		let batchFunctionStructure = batch.addNewStructure();
		let clientInfo = rs2.getStructureByKey(oFF.InAConstantsBios.QY_CI_CLIENT_INFO);
		if (oFF.notNull(clientInfo))
		{
			batchFunctionStructure.put(oFF.InAConstantsBios.QY_CI_CLIENT_INFO, clientInfo);
		}
		let structureRootKey = this.getStructureRootKey(rs2);
		if (oFF.notNull(structureRootKey))
		{
			batchFunctionStructure = batchFunctionStructure.putNewStructure(structureRootKey);
		}
		batchFunctionStructure.put(oFF.ConnectionConstants.INA_DATA_SOURCE, this.getDataSource(rs2));
	});
	let _function = this.m_functionFactory.newRpcFunctionInternal(this.m_batchModePath, false);
	let request = _function.getRpcRequest();
	request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
	request.setAcceptContentType(oFF.ContentType.APPLICATION_JSON);
	request.setRequestStructure(batchStructure);
	request.getProcessingHint().putBoolean(oFF.ConnectionParameters.CACHE_HINTS_ENABLED, this.m_cacheHintsEnabled);
	_function.processFunctionExecution(this.m_syncType, this, null);
};
oFF.BatchRequestManager.prototype.getBatchFunctions = function()
{
	let batchfunctions = oFF.XList.create();
	for (let i = 0; i < this.m_batchFunctions.size(); i++)
	{
		batchfunctions.add(this.m_batchFunctions.get(i));
	}
	return batchfunctions;
};
oFF.BatchRequestManager.prototype.getDataSource = function(structure)
{
	let structureRootKey = this.getStructureRootKey(structure);
	if (oFF.notNull(structureRootKey))
	{
		return structure.getStructureByKey(structureRootKey).getStructureByKey(oFF.ConnectionConstants.INA_DATA_SOURCE);
	}
	return oFF.notNull(structure) ? structure.getStructureByKey(oFF.ConnectionConstants.INA_DATA_SOURCE) : null;
};
oFF.BatchRequestManager.prototype.getInstanceId = function(structure)
{
	let dataSource = this.getDataSource(structure);
	if (oFF.notNull(dataSource))
	{
		return dataSource.getStringByKey(oFF.ConnectionConstants.INA_INSTANCE_ID);
	}
	return null;
};
oFF.BatchRequestManager.prototype.getMicroCubesNames = function()
{
	return this.m_microCubeNames;
};
oFF.BatchRequestManager.prototype.getStructureRootKey = function(structure)
{
	if (oFF.isNull(structure))
	{
		return null;
	}
	if (structure.containsKey(oFF.ConnectionConstants.INA_ANALYTICS))
	{
		return oFF.ConnectionConstants.INA_ANALYTICS;
	}
	if (structure.containsKey(oFF.ConnectionConstants.INA_LIST_REPORTING))
	{
		return oFF.ConnectionConstants.INA_LIST_REPORTING;
	}
	if (structure.containsKey(oFF.ConnectionConstants.INA_METADATA))
	{
		return oFF.ConnectionConstants.INA_METADATA;
	}
	if (structure.containsKey(oFF.ConnectionConstants.INA_CUBE))
	{
		return oFF.ConnectionConstants.INA_CUBE;
	}
	if (structure.containsKey(oFF.ConnectionConstants.INA_DS_VALIDATION))
	{
		return oFF.ConnectionConstants.INA_DS_VALIDATION;
	}
	return null;
};
oFF.BatchRequestManager.prototype.isRsStreamingEnabled = function()
{
	return oFF.notNull(this.m_streamingGuid);
};
oFF.BatchRequestManager.prototype.isValidBatchStreamingResponse = function(rootElement)
{
	let asyncResponseRequest = rootElement.getStructureByKey(oFF.ConnectionConstants.INA_BATCH_ASYNC_RESPONSE_REQUEST);
	if (oFF.notNull(asyncResponseRequest))
	{
		let batchId = asyncResponseRequest.getStringByKey(oFF.ConnectionConstants.INA_BATCH_ID);
		return oFF.notNull(batchId) && oFF.XString.isEqual(batchId, this.m_streamingGuid);
	}
	return false;
};
oFF.BatchRequestManager.prototype.onBatchFinished = function()
{
	if (oFF.notNull(this.m_listener))
	{
		this.m_listener.onBatchExecuted(this.m_customIdentifier);
	}
	oFF.XObjectExt.release(this);
};
oFF.BatchRequestManager.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	oFF.XBooleanUtils.checkFalse(this.m_batchFunctions.isReleased(), "Fatal error: Batch functions object is not valid anymore");
	let executedFunctionsResult = this.updateResponsesInBatchFunctions(extResult);
	let executedFunctions = executedFunctionsResult.getData();
	this.endFunctions(executedFunctions, extResult, executedFunctionsResult);
	this.removeExecutedFunctions();
	if (this.isRsStreamingEnabled() && this.m_batchFunctions.hasElements())
	{
		if (extResult.isValid() && executedFunctionsResult.isValid())
		{
			this.executeNextStreamingRequest();
		}
		else
		{
			this.endFunctions(this.m_batchFunctions, extResult, executedFunctionsResult);
			this.onBatchFinished();
		}
	}
	else
	{
		this.onBatchFinished();
	}
	oFF.XObjectExt.release(executedFunctions);
};
oFF.BatchRequestManager.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_session = null;
	this.m_batchFunctions = null;
	this.m_batchFunctionsIdMapping = null;
	this.m_streamingGuid = null;
	this.m_functionFactory = null;
	this.m_batchModePath = null;
	this.m_syncType = null;
	this.m_listener = null;
	this.m_customIdentifier = null;
	this.m_microCubeNames = oFF.XObjectExt.release(this.m_microCubeNames);
	this.m_preQueryNames = oFF.XObjectExt.release(this.m_preQueryNames);
};
oFF.BatchRequestManager.prototype.removeBatchFunction = function(_function)
{
	this.m_batchFunctions.removeElement(_function);
};
oFF.BatchRequestManager.prototype.removeExecutedFunctions = function()
{
	let i = 0;
	while (i < this.m_batchFunctions.size())
	{
		let rpcBatchFunction = this.m_batchFunctions.get(i);
		let requestStructure = rpcBatchFunction.getRpcRequest().getRequestStructure();
		if (rpcBatchFunction.getSyncState() !== oFF.SyncState.PROCESSING || oFF.isNull(requestStructure) || requestStructure.isReleased())
		{
			this.m_batchFunctions.removeAt(i);
			continue;
		}
		i++;
	}
};
oFF.BatchRequestManager.prototype.updateAllBatchFunctions = function(batchList, rootElement)
{
	let batchFunctionSize = this.m_batchFunctions.size();
	if (oFF.notNull(batchList))
	{
		let flattenOffset = 0;
		for (let k = 0; k < batchFunctionSize; k++)
		{
			let batchFunction = this.m_batchFunctions.get(k);
			let batchFunctionResponse = batchFunction.getRpcResponse();
			let decorator = batchFunction.getDecorator();
			if (oFF.isNull(decorator))
			{
				let batchRootElement = batchList.getStructureAt(flattenOffset);
				batchFunctionResponse.setRootElement(batchRootElement, null);
				flattenOffset++;
			}
			else
			{
				let flatSize = decorator.getItemsSize();
				let responseStructureFlat = oFF.XList.create();
				for (let flatIndex = 0; flatIndex < flatSize; flatIndex++)
				{
					let batchRootElementFlat = batchList.getStructureAt(flattenOffset + flatIndex);
					responseStructureFlat.add(batchRootElementFlat);
				}
				let responseStructureDeep = decorator.buildResponse(responseStructureFlat);
				batchFunctionResponse.setRootElement(responseStructureDeep, null);
				flattenOffset = flattenOffset + flatSize;
			}
		}
	}
	else
	{
		for (let i = 0; i < batchFunctionSize; i++)
		{
			this.m_batchFunctions.get(i).getRpcResponse().setRootElement(rootElement, null);
		}
	}
};
oFF.BatchRequestManager.prototype.updateRespondedBatchFunctions = function(batchList, rootElement, messageManager)
{
	let executedFunctions = oFF.XList.create();
	if (oFF.notNull(batchList) && batchList.hasElements())
	{
		let size = batchList.size();
		for (let i = 0; i < size; i++)
		{
			let structure = batchList.getStructureAt(i);
			let instanceId = this.getInstanceId(structure);
			let _function = this.m_batchFunctionsIdMapping.getByKey(instanceId);
			if (oFF.notNull(_function))
			{
				_function.getRpcResponse().setRootElement(structure, null);
				executedFunctions.add(_function);
			}
			else
			{
				messageManager.addError(0, "Request not found for response");
			}
		}
	}
	if (!this.isValidBatchStreamingResponse(rootElement))
	{
		messageManager.addError(0, "Response does not contain correct batch id");
	}
	return oFF.ExtResult.create(executedFunctions, messageManager);
};
oFF.BatchRequestManager.prototype.updateResponsesInBatchFunctions = function(extResult)
{
	let messageManager = null;
	if (extResult.isValid())
	{
		let response = extResult.getData();
		let rootElement = response.getRootElement();
		let batchList = rootElement.getListByKey(oFF.ConnectionConstants.INA_BATCH);
		messageManager = oFF.MessageManager.createMessageManagerExt(this.m_session);
		oFF.InAHelper.importMessages(rootElement, messageManager);
		if (this.isRsStreamingEnabled())
		{
			return this.updateRespondedBatchFunctions(batchList, rootElement, messageManager);
		}
		this.updateAllBatchFunctions(batchList, rootElement);
	}
	return oFF.ExtResult.create(this.m_batchFunctions, messageManager);
};

oFF.BatchRequestManagerInAFactory = function() {};
oFF.BatchRequestManagerInAFactory.prototype = new oFF.BatchRequestManagerFactory();
oFF.BatchRequestManagerInAFactory.prototype._ff_c = "BatchRequestManagerInAFactory";

oFF.BatchRequestManagerInAFactory.staticSetupBatchInAFactory = function()
{
	oFF.BatchRequestManagerFactory.registerFactory(new oFF.BatchRequestManagerInAFactory());
};
oFF.BatchRequestManagerInAFactory.prototype.newBatchRequestManager = function(session)
{
	return oFF.BatchRequestManager.create(session);
};

oFF.ServiceType = function() {};
oFF.ServiceType.prototype = new oFF.ServiceTypeInfo();
oFF.ServiceType.prototype._ff_c = "ServiceType";

oFF.ServiceType.createType = function(serviceName)
{
	let st = new oFF.ServiceType();
	let serviceSetupReferenceName = oFF.XStringUtils.concatenate3(oFF.RegistrationService.SERVICE_CONFIG, ".", serviceName);
	let serviceReferenceName = oFF.XStringUtils.concatenate3(oFF.RegistrationService.SERVICE, ".", serviceName);
	st.setupExt(serviceSetupReferenceName, serviceReferenceName);
	return st;
};
oFF.ServiceType.prototype.m_serviceReferenceName = null;
oFF.ServiceType.prototype.m_srvConfigReferenceName = null;
oFF.ServiceType.prototype.createServiceConfig = function(application)
{
	return this.createServiceConfigInternal(application);
};
oFF.ServiceType.prototype.getServiceConfigReferenceName = function()
{
	return this.m_srvConfigReferenceName;
};
oFF.ServiceType.prototype.getServiceReferenceName = function()
{
	return this.m_serviceReferenceName;
};
oFF.ServiceType.prototype.setupExt = function(serviceConfigReferenceName, serviceReferenceName)
{
	this.m_srvConfigReferenceName = serviceConfigReferenceName;
	this.m_serviceReferenceName = serviceReferenceName;
};
oFF.ServiceType.prototype.toString = function()
{
	let sb = oFF.XStringBuffer.create();
	if (oFF.notNull(this.m_srvConfigReferenceName))
	{
		sb.appendLine(this.m_srvConfigReferenceName);
	}
	if (oFF.notNull(this.m_serviceReferenceName))
	{
		sb.appendLine(this.m_serviceReferenceName);
	}
	return sb.toString();
};

oFF.DcsUsageTracker = function() {};
oFF.DcsUsageTracker.prototype = new oFF.XObject();
oFF.DcsUsageTracker.prototype._ff_c = "DcsUsageTracker";

oFF.DcsUsageTracker.MAX_INTERVAL = 600000;
oFF.DcsUsageTracker.create = function()
{
	let dcsUsageTracker = new oFF.DcsUsageTracker();
	dcsUsageTracker.m_interval = 20000;
	dcsUsageTracker.m_enabled = false;
	dcsUsageTracker.m_failedCount = 0;
	dcsUsageTracker.setup();
	return dcsUsageTracker;
};
oFF.DcsUsageTracker.prototype.eventQueue = null;
oFF.DcsUsageTracker.prototype.m_dcsUrl = null;
oFF.DcsUsageTracker.prototype.m_dispatcher = null;
oFF.DcsUsageTracker.prototype.m_enabled = false;
oFF.DcsUsageTracker.prototype.m_failedCount = 0;
oFF.DcsUsageTracker.prototype.m_interval = 0;
oFF.DcsUsageTracker.prototype.m_language = null;
oFF.DcsUsageTracker.prototype.m_productVersion = null;
oFF.DcsUsageTracker.prototype.m_requestRunning = false;
oFF.DcsUsageTracker.prototype.m_session = null;
oFF.DcsUsageTracker.prototype.m_syncType = null;
oFF.DcsUsageTracker.prototype.m_tenantId = null;
oFF.DcsUsageTracker.prototype.m_timerHandle = null;
oFF.DcsUsageTracker.prototype.m_xlang = null;
oFF.DcsUsageTracker.prototype.addCommonFacts = function(content)
{
	content.putString("applicationtype", "service");
	content.putString("applicationname", "firefly");
	content.putString("fireflyversion", oFF.XLibVersionUtil.getLibVersion(this.getSession()));
	content.putString("productversion", this.getProductVersion());
	content.putString("xlang", this.mapXLang());
	content.putString("tenantid", this.getTenantId());
	content.putString("os", oFF.XSystemUtils.getOsName());
	content.putString("language", this.getLanguage());
	content.putString("userid", "");
	let location = oFF.NetworkEnv.getLocation();
	let host = "N/A";
	if (oFF.notNull(location) && oFF.XStringUtils.isNotNullAndNotEmpty(location.getHost()))
	{
		host = location.getHost();
	}
	content.putString("publichost", host);
	content.putNewList("actiondata");
};
oFF.DcsUsageTracker.prototype.addEvent = function(actionId, parameters, session)
{
	let utEvent = new oFF.UTEvent();
	utEvent.setSession(session);
	utEvent.setEventId(actionId);
	utEvent.setEventTime(oFF.XDateTime.createCurrentLocalDateTime());
	utEvent.setFeature(parameters.getByKey("feature"));
	utEvent.setParameters(parameters);
	this.eventQueue.add(utEvent);
};
oFF.DcsUsageTracker.prototype.buildContent = function()
{
	let content = oFF.PrFactory.createStructure();
	this.addCommonFacts(content);
	let actiondata = content.getListByKey("actiondata");
	let size = this.eventQueue.size();
	for (let i = 0; i < size; i++)
	{
		let actionItem = oFF.PrFactory.createStructure();
		actiondata.add(actionItem);
		let event = this.eventQueue.get(i);
		let parameters = event.getParameters();
		actionItem.putString("action", event.getEventId());
		actionItem.putString("feature", event.getFeature());
		let errorSize = event.getErrorSize();
		actionItem.putInteger("numoferrormessages", errorSize);
		if (errorSize > 0)
		{
			let errorBuffer = oFF.XStringBuffer.create();
			let errors = event.getErrors().getKeysAsIterator();
			while (errors.hasNext())
			{
				let errorKey = errors.next();
				errorBuffer.append(errorKey).append(":").append(event.getErrors().getByKey(errorKey)).append(";");
			}
			actionItem.putString("errormessages", errorBuffer.toString());
		}
		let value = event.getEventTime().toIsoFormatWithFractions(3);
		actionItem.putString("actiontimestamp", oFF.XString.replace(value, "T", " "));
		actionItem.putString("sessionid", event.getSession().getSessionGuid());
		actionItem.putInteger("actionduration", 0);
		actionItem.putInteger("xversion", this.getSession().getXVersion());
		let options = actionItem.putNewList("options");
		let paramInter = parameters.getKeysAsIterator();
		while (paramInter.hasNext())
		{
			let param = paramInter.next();
			if (oFF.XString.compare(param, "actionId") !== 0 && oFF.XString.compare(param, "feature") !== 0)
			{
				let option = options.addNewStructure();
				option.putString("param", param);
				option.putString("value", parameters.getByKey(param));
			}
		}
	}
	this.eventQueue.clear();
	return oFF.PrUtils.serialize(content, true, true, 0);
};
oFF.DcsUsageTracker.prototype.cancelTimer = function()
{
	this.m_dispatcher.unregisterInterval(this.m_timerHandle);
	this.m_timerHandle = oFF.XObjectExt.release(this.m_timerHandle);
};
oFF.DcsUsageTracker.prototype.checkTimer = function()
{
	if (this.m_requestRunning)
	{
		return;
	}
	if (oFF.notNull(this.m_timerHandle))
	{
		return;
	}
	let newInterval = oFF.XDouble.convertToInt(this.m_interval * oFF.XMath.pow(2, this.m_failedCount));
	this.m_timerHandle = this.m_dispatcher.registerTimer(oFF.XMath.min(newInterval, oFF.DcsUsageTracker.MAX_INTERVAL), this, null);
};
oFF.DcsUsageTracker.prototype.createHttpRequest = function()
{
	let request = oFF.HttpRequest.create();
	request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
	request.setFromUri(this.getDscUri());
	request.setContentType(oFF.ContentType.APPLICATION_JSON);
	request.setString(this.buildContent());
	return request;
};
oFF.DcsUsageTracker.prototype.getDscUri = function()
{
	if (oFF.isNull(this.m_dcsUrl))
	{
		let location = oFF.NetworkEnv.getLocation();
		if (oFF.isNull(location))
		{
			throw oFF.XException.createIllegalArgumentException("Data Collection Url must be provided");
		}
		this.m_dcsUrl = oFF.XUri.createFromOther(location);
		this.m_dcsUrl.setPath("/datacollection/api/v2/application/data");
		this.m_dcsUrl.setQuery("");
	}
	return this.m_dcsUrl;
};
oFF.DcsUsageTracker.prototype.getLanguage = function()
{
	return oFF.notNull(this.m_language) ? this.m_language : "N/A";
};
oFF.DcsUsageTracker.prototype.getProductVersion = function()
{
	return this.m_productVersion;
};
oFF.DcsUsageTracker.prototype.getSession = function()
{
	if (oFF.isNull(this.m_session))
	{
		this.m_session = oFF.DefaultSession.create();
	}
	return this.m_session;
};
oFF.DcsUsageTracker.prototype.getSyncType = function()
{
	if (oFF.isNull(this.m_syncType))
	{
		this.m_syncType = oFF.SyncType.NON_BLOCKING;
	}
	return this.m_syncType;
};
oFF.DcsUsageTracker.prototype.getTenantId = function()
{
	return this.m_tenantId;
};
oFF.DcsUsageTracker.prototype.isEnabled = function()
{
	return this.m_enabled;
};
oFF.DcsUsageTracker.prototype.mapXLang = function()
{
	if (oFF.isNull(this.m_xlang))
	{
		let xLang = oFF.XLanguage.getLanguage();
		if (xLang === oFF.XLanguage.JAVASCRIPT)
		{
			this.m_xlang = "js";
		}
		else if (xLang === oFF.XLanguage.TYPESCRIPT)
		{
			this.m_xlang = "ts";
		}
		else if (xLang === oFF.XLanguage.JAVA)
		{
			this.m_xlang = "java";
		}
		else if (xLang === oFF.XLanguage.CSHARP)
		{
			this.m_xlang = "csharp";
		}
		else if (xLang === oFF.XLanguage.CPP)
		{
			this.m_xlang = "cpp";
		}
		else if (xLang === oFF.XLanguage.OBJECTIVE_C)
		{
			this.m_xlang = "objc";
		}
	}
	return this.m_xlang;
};
oFF.DcsUsageTracker.prototype.onHttpResponse = function(extResult, response, customIdentifier)
{
	if (response.getStatusCode() !== 202)
	{
		this.m_failedCount = this.m_failedCount === 10 ? 10 : this.m_failedCount + 1;
	}
	else
	{
		this.m_failedCount = 0;
	}
	this.m_requestRunning = false;
	this.cancelTimer();
};
oFF.DcsUsageTracker.prototype.onTimerEvent = function(timerHandle, customIdentifier)
{
	this.process();
};
oFF.DcsUsageTracker.prototype.process = function()
{
	if (this.eventQueue.isEmpty())
	{
		this.cancelTimer();
		return;
	}
	let request = this.createHttpRequest();
	let httpClient = request.newHttpClient(this.getSession());
	this.m_requestRunning = true;
	httpClient.processHttpRequest(this.getSyncType(), this, null);
};
oFF.DcsUsageTracker.prototype.setDcsUrl = function(dcsUrl)
{
	this.m_dcsUrl = oFF.XUri.createFromUrl(dcsUrl);
};
oFF.DcsUsageTracker.prototype.setDispatcher = function(dispatcher)
{
	this.m_dispatcher = dispatcher;
};
oFF.DcsUsageTracker.prototype.setEnabled = function(enabled)
{
	this.m_enabled = enabled;
};
oFF.DcsUsageTracker.prototype.setInterval = function(interval)
{
	this.m_interval = interval;
};
oFF.DcsUsageTracker.prototype.setLanguage = function(language)
{
	this.m_language = language;
};
oFF.DcsUsageTracker.prototype.setProductVersion = function(productVersion)
{
	this.m_productVersion = productVersion;
};
oFF.DcsUsageTracker.prototype.setSyncType = function(syncType)
{
	this.m_syncType = syncType;
};
oFF.DcsUsageTracker.prototype.setTenantId = function(tenantId)
{
	this.m_tenantId = tenantId;
};
oFF.DcsUsageTracker.prototype.setup = function()
{
	this.eventQueue = oFF.XList.create();
	this.m_dispatcher = oFF.Dispatcher.getInstance();
};
oFF.DcsUsageTracker.prototype.track = function(event)
{
	if (!this.isEnabled())
	{
		return;
	}
	if (event.getEventTime() === null)
	{
		event.setEventTime(oFF.XDateTime.createCurrentLocalDateTime());
	}
	this.eventQueue.add(event);
	this.checkTimer();
};
oFF.DcsUsageTracker.prototype.trackUsage = function(actionId, parameters, session)
{
	if (!this.isEnabled())
	{
		return;
	}
	this.addEvent(actionId, parameters, session);
	this.checkTimer();
};

oFF.UTEvent = function() {};
oFF.UTEvent.prototype = new oFF.XObject();
oFF.UTEvent.prototype._ff_c = "UTEvent";

oFF.UTEvent.prototype.errors = null;
oFF.UTEvent.prototype.eventTime = null;
oFF.UTEvent.prototype.host = null;
oFF.UTEvent.prototype.m_eventId = null;
oFF.UTEvent.prototype.m_feature = null;
oFF.UTEvent.prototype.m_parameters = null;
oFF.UTEvent.prototype.session = null;
oFF.UTEvent.prototype.tenantId = null;
oFF.UTEvent.prototype.getErrorSize = function()
{
	if (oFF.notNull(this.errors))
	{
		return this.errors.size();
	}
	return 0;
};
oFF.UTEvent.prototype.getErrors = function()
{
	return this.errors;
};
oFF.UTEvent.prototype.getEventId = function()
{
	return this.m_eventId;
};
oFF.UTEvent.prototype.getEventTime = function()
{
	return this.eventTime;
};
oFF.UTEvent.prototype.getFeature = function()
{
	return this.m_feature;
};
oFF.UTEvent.prototype.getHost = function()
{
	return this.host;
};
oFF.UTEvent.prototype.getParameters = function()
{
	return this.m_parameters;
};
oFF.UTEvent.prototype.getSession = function()
{
	return this.session;
};
oFF.UTEvent.prototype.getTenantId = function()
{
	return this.tenantId;
};
oFF.UTEvent.prototype.setErrors = function(errors)
{
	this.errors = errors;
};
oFF.UTEvent.prototype.setEventId = function(eventId)
{
	this.m_eventId = eventId;
};
oFF.UTEvent.prototype.setEventTime = function(eventTime)
{
	this.eventTime = eventTime;
};
oFF.UTEvent.prototype.setFeature = function(feature)
{
	this.m_feature = feature;
};
oFF.UTEvent.prototype.setHost = function(host)
{
	this.host = host;
};
oFF.UTEvent.prototype.setParameters = function(parameters)
{
	this.m_parameters = parameters;
};
oFF.UTEvent.prototype.setSession = function(session)
{
	this.session = session;
};
oFF.UTEvent.prototype.setTenantId = function(tenantId)
{
	this.tenantId = tenantId;
};

oFF.DfApplicationContext = function() {};
oFF.DfApplicationContext.prototype = new oFF.XObjectExt();
oFF.DfApplicationContext.prototype._ff_c = "DfApplicationContext";

oFF.DfApplicationContext.prototype.m_application = null;
oFF.DfApplicationContext.prototype.getApplication = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_application);
};
oFF.DfApplicationContext.prototype.getLogWriter = function()
{
	let session = this.getSession();
	if (oFF.notNull(session))
	{
		return session.getLogWriter();
	}
	return null;
};
oFF.DfApplicationContext.prototype.getProcess = function()
{
	let application = this.getApplication();
	return oFF.isNull(application) ? null : application.getProcess();
};
oFF.DfApplicationContext.prototype.getSession = function()
{
	let application = this.getApplication();
	return oFF.isNull(application) ? null : application.getSession();
};
oFF.DfApplicationContext.prototype.releaseObject = function()
{
	this.m_application = null;
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.DfApplicationContext.prototype.setApplication = function(application)
{
	this.m_application = oFF.XWeakReferenceUtil.getWeakRef(application);
};
oFF.DfApplicationContext.prototype.setupApplicationContext = function(application)
{
	this.setApplication(application);
};
oFF.DfApplicationContext.prototype.toString = function()
{
	return oFF.isNull(this.m_application) ? "" : this.m_application.toString();
};

oFF.DfApplicationContextHard = function() {};
oFF.DfApplicationContextHard.prototype = new oFF.XObjectExt();
oFF.DfApplicationContextHard.prototype._ff_c = "DfApplicationContextHard";

oFF.DfApplicationContextHard.prototype.m_application = null;
oFF.DfApplicationContextHard.prototype.getApplication = function()
{
	return this.m_application;
};
oFF.DfApplicationContextHard.prototype.getLogWriter = function()
{
	let session = this.getSession();
	if (oFF.notNull(session))
	{
		return session.getLogWriter();
	}
	return null;
};
oFF.DfApplicationContextHard.prototype.getSession = function()
{
	let application = this.getApplication();
	return oFF.isNull(application) ? null : application.getSession();
};
oFF.DfApplicationContextHard.prototype.releaseObject = function()
{
	this.m_application = null;
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.DfApplicationContextHard.prototype.setApplication = function(application)
{
	this.m_application = application;
};
oFF.DfApplicationContextHard.prototype.setupApplicationContext = function(application)
{
	this.setApplication(application);
};
oFF.DfApplicationContextHard.prototype.toString = function()
{
	return oFF.isNull(this.m_application) ? "" : this.m_application.toString();
};

oFF.RepoMountPoint = function() {};
oFF.RepoMountPoint.prototype = new oFF.DfNameObject();
oFF.RepoMountPoint.prototype._ff_c = "RepoMountPoint";

oFF.RepoMountPoint.create = function(type, name, uri)
{
	let newObj = new oFF.RepoMountPoint();
	newObj.setupExt(type, name, uri);
	return newObj;
};
oFF.RepoMountPoint.createConditional = function(session, type, name, url)
{
	let uri = oFF.XUri.createFromFilePath(session, url, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR, null);
	if (oFF.notNull(uri))
	{
		return oFF.RepoMountPoint.create(type, name, uri);
	}
	else
	{
		return null;
	}
};
oFF.RepoMountPoint.prototype.m_type = null;
oFF.RepoMountPoint.prototype.m_uri = null;
oFF.RepoMountPoint.prototype.getMountType = function()
{
	return this.m_type;
};
oFF.RepoMountPoint.prototype.getUri = function()
{
	return this.m_uri;
};
oFF.RepoMountPoint.prototype.setupExt = function(type, name, uri)
{
	this._setupInternal(name);
	this.m_uri = uri;
	this.m_type = type;
};

oFF.ApplicationSystemOption = function() {};
oFF.ApplicationSystemOption.prototype = new oFF.XConstant();
oFF.ApplicationSystemOption.prototype._ff_c = "ApplicationSystemOption";

oFF.ApplicationSystemOption.AUTO = null;
oFF.ApplicationSystemOption.LOCATION_AND_TYPE = null;
oFF.ApplicationSystemOption.NONE = null;
oFF.ApplicationSystemOption.PATH = null;
oFF.ApplicationSystemOption.staticSetup = function()
{
	oFF.ApplicationSystemOption.NONE = oFF.XConstant.setupName(new oFF.ApplicationSystemOption(), "None");
	oFF.ApplicationSystemOption.AUTO = oFF.XConstant.setupName(new oFF.ApplicationSystemOption(), "Auto");
	oFF.ApplicationSystemOption.PATH = oFF.XConstant.setupName(new oFF.ApplicationSystemOption(), "Path");
	oFF.ApplicationSystemOption.LOCATION_AND_TYPE = oFF.XConstant.setupName(new oFF.ApplicationSystemOption(), "LocationAndType");
};

oFF.DfApplicationProgram = function() {};
oFF.DfApplicationProgram.prototype = new oFF.DfProgram();
oFF.DfApplicationProgram.prototype._ff_c = "DfApplicationProgram";

oFF.DfApplicationProgram.PARAM_ENABLE_CACHES = "EnableCaches";
oFF.DfApplicationProgram.PARAM_SYS_USE_MIRRORS = "UseMirrors";
oFF.DfApplicationProgram.PARAM_TRACE_NAME = "TraceName";
oFF.DfApplicationProgram.prototype.m_application = null;
oFF.DfApplicationProgram.prototype.m_masterSystemName = null;
oFF.DfApplicationProgram.prototype.m_releaseApplication = false;
oFF.DfApplicationProgram.prototype.m_systemLandscapePath = null;
oFF.DfApplicationProgram.prototype.m_systemOption = null;
oFF.DfApplicationProgram.prototype.m_traceName = null;
oFF.DfApplicationProgram.prototype.m_useMirrors = false;
oFF.DfApplicationProgram.prototype._doSetupDefaultProgramArguments = function(metadata)
{
	oFF.DfProgram.prototype._doSetupDefaultProgramArguments.call( this , metadata);
	metadata.addOption(oFF.DfApplicationProgram.PARAM_TRACE_NAME, "The trace name", "name", oFF.XValueType.STRING);
	metadata.addOption(oFF.DfApplicationProgram.PARAM_ENABLE_CACHES, "Enables the cache", "true|false", oFF.XValueType.BOOLEAN);
	metadata.addOption(oFF.DfApplicationProgram.PARAM_SYS_USE_MIRRORS, "Using the system mirrors", "true|false", oFF.XValueType.BOOLEAN);
	metadata.addOption(oFF.DfProgram.PARAM_SYS_LANDSCAPE, "The system landscape", "true|false", oFF.XValueType.BOOLEAN);
};
oFF.DfApplicationProgram.prototype._initializeSpecificProgram = function()
{
	oFF.DfProgram.prototype._initializeSpecificProgram.call( this );
	if (this.isShowHelp() === false)
	{
		if (this.getApplication() === null)
		{
			let process = this.getProcess();
			let extResult;
			let systemOption = this.getSystemOption();
			let systemLandscapeUrl = this.getSystemLandscapeUrl();
			let initialSystemType = this.getInitialSystemType();
			if (systemOption === oFF.ApplicationSystemOption.LOCATION_AND_TYPE && oFF.notNull(initialSystemType))
			{
				extResult = oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.BLOCKING, null, null, null, process, oFF.XVersion.MAX, initialSystemType, "master", null, null, systemOption, false, null, false);
				this.setApplicationExt(extResult.getData(), true);
				oFF.XObjectExt.release(extResult);
			}
			else if (systemOption === oFF.ApplicationSystemOption.PATH && oFF.notNull(systemLandscapeUrl))
			{
				extResult = oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.BLOCKING, null, null, null, process, oFF.XVersion.MAX, null, null, null, systemLandscapeUrl, oFF.ApplicationSystemOption.PATH, false, null, false);
				if (extResult.hasErrors())
				{
					this.log("Error during application initialization");
					this.log(extResult.getSummary());
				}
				else
				{
					this.setApplicationExt(extResult.getData(), true);
					let systemLandscape = this.getApplication().getSystemLandscape();
					let masterSystemName = this.getMasterSystemName();
					if (oFF.notNull(masterSystemName))
					{
						systemLandscape.setDefaultSystemName(oFF.SystemRole.MASTER, masterSystemName);
					}
					if (this.useMirrors())
					{
						systemLandscape.replaceOriginsWithMirror();
					}
				}
				oFF.XObjectExt.release(extResult);
			}
			let application2 = this.getApplication();
			if (oFF.isNull(application2))
			{
				extResult = oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.BLOCKING, null, null, null, process, oFF.XVersion.MAX, null, null, null, null, oFF.ApplicationSystemOption.NONE, false, null, false);
				this.setApplicationExt(extResult.getData(), true);
				oFF.XObjectExt.release(extResult);
			}
			if (oFF.notNull(application2))
			{
				if (oFF.notNull(this.m_traceName))
				{
					application2.setApplicationName(this.m_traceName);
					let connectionPool = application2.getConnectionPool();
					let systemNames = application2.getSystemLandscape().getSystemNames();
					for (let t = 0; t < systemNames.size(); t++)
					{
						let traceInfo = oFF.TraceInfo.create();
						traceInfo.setTraceType(oFF.TraceType.URL);
						traceInfo.setTraceName(this.m_traceName);
						connectionPool.setTraceInfo(systemNames.get(t), traceInfo);
					}
				}
			}
		}
	}
};
oFF.DfApplicationProgram.prototype._prepareDefaultArguments = function()
{
	oFF.DfProgram.prototype._prepareDefaultArguments.call( this );
	let prgArgs = this.getArguments();
	this.m_traceName = prgArgs.getStringByKeyExt(oFF.DfApplicationProgram.PARAM_TRACE_NAME, this.m_traceName);
	this.m_useMirrors = prgArgs.getBooleanByKeyExt(oFF.DfApplicationProgram.PARAM_SYS_USE_MIRRORS, this.m_useMirrors);
	this.m_systemLandscapePath = prgArgs.getStringByKeyExt(oFF.DfProgram.PARAM_SYS_LANDSCAPE, this.m_systemLandscapePath);
	if (oFF.isNull(this.m_systemOption))
	{
		if (oFF.notNull(this.m_systemLandscapePath))
		{
			this.m_systemOption = oFF.ApplicationSystemOption.PATH;
		}
		else if (this.getInitialSystemType() !== null)
		{
			this.m_systemOption = oFF.ApplicationSystemOption.LOCATION_AND_TYPE;
		}
		else
		{
			this.m_systemOption = oFF.ApplicationSystemOption.NONE;
		}
	}
};
oFF.DfApplicationProgram.prototype.getApplication = function()
{
	return this.m_application;
};
oFF.DfApplicationProgram.prototype.getComponentType = function()
{
	return oFF.RuntimeComponentType.APPLICATION_PROGRAM;
};
oFF.DfApplicationProgram.prototype.getDefaultContainerType = function()
{
	return oFF.ProgramContainerType.NONE;
};
oFF.DfApplicationProgram.prototype.getMasterSystemName = function()
{
	return this.m_masterSystemName;
};
oFF.DfApplicationProgram.prototype.getProgramType = function()
{
	return oFF.ProgramType.BACKGROUND;
};
oFF.DfApplicationProgram.prototype.getSystemLandscapeUrl = function()
{
	return this.m_systemLandscapePath;
};
oFF.DfApplicationProgram.prototype.getSystemOption = function()
{
	return this.m_systemOption;
};
oFF.DfApplicationProgram.prototype.getTraceName = function()
{
	return this.m_traceName;
};
oFF.DfApplicationProgram.prototype.releaseObject = function()
{
	this.m_traceName = null;
	if (this.m_releaseApplication === true)
	{
		this.m_application = oFF.XObjectExt.release(this.m_application);
	}
	oFF.DfProgram.prototype.releaseObject.call( this );
};
oFF.DfApplicationProgram.prototype.setApplication = function(application)
{
	this.setApplicationExt(application, false);
};
oFF.DfApplicationProgram.prototype.setApplicationExt = function(application, releaseApplication)
{
	if (oFF.notNull(application) && this.getSession() === null)
	{
		this.setProcess(application.getProcess());
	}
	this.m_application = application;
	this.m_releaseApplication = releaseApplication;
};
oFF.DfApplicationProgram.prototype.setMasterSystemName = function(masterSystemName)
{
	this.m_masterSystemName = masterSystemName;
};
oFF.DfApplicationProgram.prototype.setSystemLandscapeUrl = function(url)
{
	this.m_systemLandscapePath = url;
};
oFF.DfApplicationProgram.prototype.setSystemOption = function(option)
{
	this.m_systemOption = option;
};
oFF.DfApplicationProgram.prototype.setTraceName = function(traceName)
{
	this.m_traceName = traceName;
};
oFF.DfApplicationProgram.prototype.setUseMirrors = function(useMirrors)
{
	this.m_useMirrors = useMirrors;
};
oFF.DfApplicationProgram.prototype.setup = function()
{
	oFF.DfProgram.prototype.setup.call( this );
	this.m_useMirrors = false;
	this.m_masterSystemName = "gipsy";
	this.m_systemOption = oFF.ApplicationSystemOption.NONE;
};
oFF.DfApplicationProgram.prototype.useMirrors = function()
{
	return this.m_useMirrors;
};

oFF.RepoMountType = function() {};
oFF.RepoMountType.prototype = new oFF.XConstant();
oFF.RepoMountType.prototype._ff_c = "RepoMountType";

oFF.RepoMountType.FILE = null;
oFF.RepoMountType.staticSetup = function()
{
	oFF.RepoMountType.FILE = oFF.XConstant.setupName(new oFF.RepoMountType(), "File");
};

oFF.RepositoryManager = function() {};
oFF.RepositoryManager.prototype = new oFF.DfApplicationContext();
oFF.RepositoryManager.prototype._ff_c = "RepositoryManager";

oFF.RepositoryManager.create = function(application)
{
	let rm = new oFF.RepositoryManager();
	rm.setupApplicationContext(application);
	return rm;
};
oFF.RepositoryManager.prototype.m_location = null;
oFF.RepositoryManager.prototype.getLocation = function()
{
	return this.m_location;
};
oFF.RepositoryManager.prototype.newRpcFunction = function(uri)
{
	let application = this.getApplication();
	let repositoryManager = application.getRepositoryManager();
	let repositoryLocation = repositoryManager.getLocation();
	let uriObj;
	if (oFF.isNull(repositoryLocation))
	{
		uriObj = oFF.XUri.createFromUrl(uri);
	}
	else
	{
		uriObj = oFF.XUri.createFromParentUriAndRelativeUrl(repositoryLocation, uri, false);
	}
	let systemUriString = uriObj.getUrlExt(true, true, true, true, true, true, false, false, false);
	let systemUri = oFF.XUri.createFromUrl(systemUriString);
	let rpcUriString = uriObj.getUrlExt(false, false, false, false, false, false, true, true, true);
	let systemLandscape = application.getSystemLandscape();
	let tempSystemName = oFF.XStringUtils.concatenate3("##Tmp#", oFF.XGuid.getGuid(), "##");
	systemLandscape.setSystemByUri(tempSystemName, systemUri, oFF.SystemType.GENERIC);
	let connection = application.getConnectionPool().getConnection(tempSystemName);
	let rpcFunction = connection.newRpcFunction(rpcUriString);
	let request = rpcFunction.getRpcRequest();
	request.setMethod(oFF.HttpRequestMethod.HTTP_GET);
	return rpcFunction;
};
oFF.RepositoryManager.prototype.setLocation = function(location)
{
	this.m_location = location;
};
oFF.RepositoryManager.prototype.setupApplicationContext = function(application)
{
	oFF.DfApplicationContext.prototype.setupApplicationContext.call( this , application);
};

oFF.UndoManager = function() {};
oFF.UndoManager.prototype = new oFF.DfApplicationContext();
oFF.UndoManager.prototype._ff_c = "UndoManager";

oFF.UndoManager.create = function(application)
{
	let newObj = new oFF.UndoManager();
	newObj.setupApplicationContext(application);
	application.getSession().registerInterruptStepListener(newObj, oFF.XInterruptPrio.UNDO_REDO, null);
	newObj.m_undoStates = oFF.XList.create();
	newObj.m_redoStates = oFF.XList.create();
	newObj.m_listeners = oFF.XList.create();
	return newObj;
};
oFF.UndoManager.prototype.m_listeners = null;
oFF.UndoManager.prototype.m_redoStates = null;
oFF.UndoManager.prototype.m_undoStates = null;
oFF.UndoManager.prototype.stackSize = 0;
oFF.UndoManager.prototype.clear = function(states)
{
	let iterator = states.getIterator();
	while (iterator.hasNext())
	{
		this.getApplication().getOlapEnvironment().getDocumentStateManager().clearDocumentState(iterator.next());
	}
	states.clear();
};
oFF.UndoManager.prototype.dump = function()
{
	let documentStateManager = this.getApplication().getOlapEnvironment().getDocumentStateManager();
	let state = oFF.PrFactory.createStructure();
	let undoStates = state.putNewList("UndoStates");
	let undoCount = this.m_undoStates.size();
	for (let i = undoCount - 1; i >= 0; i--)
	{
		undoStates.add(documentStateManager.dumpState(this.m_undoStates.get(i)));
	}
	let redoStates = state.putNewList("RedoStates");
	let redoCount = this.m_redoStates.size();
	for (let j = redoCount - 1; j >= 0; j--)
	{
		redoStates.add(documentStateManager.dumpState(this.m_redoStates.get(j)));
	}
	return oFF.PrUtils.serialize(state, false, true, 2);
};
oFF.UndoManager.prototype.getAvailableRedoStepCount = function()
{
	return this.m_redoStates.size();
};
oFF.UndoManager.prototype.getAvailableUndoStepCount = function()
{
	return oFF.XMath.max(this.m_undoStates.size() - 1, 0);
};
oFF.UndoManager.prototype.logStates = function(stateId)
{
	this.getSession().getLogger().log(oFF.XStringUtils.concatenate2("UndoManager: new currentState ->", stateId));
};
oFF.UndoManager.prototype.notifyListener = function()
{
	let size = this.m_listeners.size();
	for (let i = 0; i < size; i++)
	{
		this.m_listeners.get(i).undoManagerStateChanged();
	}
};
oFF.UndoManager.prototype.onInterruptStepEnd = function(step, customIdentifier)
{
	this.clear(this.m_redoStates);
	let newState = this.getApplication().getOlapEnvironment().getDocumentStateManager().recordDocumentState();
	this.m_undoStates.add(newState);
	this.logStates(newState);
	this.updateStack();
	this.notifyListener();
};
oFF.UndoManager.prototype.onInterruptStepStart = function(step, customIdentifier)
{
	if (this.m_undoStates.isEmpty())
	{
		this.onInterruptStepEnd(step, customIdentifier);
	}
	else
	{
		let currentStateId = this.m_undoStates.get(this.m_undoStates.size() - 1);
		this.getApplication().getOlapEnvironment().getDocumentStateManager().updateDocumentState(currentStateId);
	}
};
oFF.UndoManager.prototype.processRedo = function(syncType, listener, customerIdentifier)
{
	let stateId = null;
	let size = this.m_redoStates.size();
	if (size > 0)
	{
		stateId = this.m_redoStates.removeAt(size - 1);
		this.m_undoStates.add(stateId);
	}
	this.logStates(stateId);
	let action = oFF.UndoRedoAction.createAndRun(syncType, this, listener, customerIdentifier, stateId, this.getApplication().getOlapEnvironment());
	this.notifyListener();
	return action;
};
oFF.UndoManager.prototype.processUndo = function(syncType, listener, customerIdentifier)
{
	let stateId = null;
	let size = this.m_undoStates.size();
	if (size > 1)
	{
		this.m_redoStates.add(this.m_undoStates.removeAt(size - 1));
		stateId = this.m_undoStates.get(size - 2);
	}
	this.logStates(stateId);
	let action = oFF.UndoRedoAction.createAndRun(syncType, this, listener, customerIdentifier, stateId, this.getApplication().getOlapEnvironment());
	this.notifyListener();
	return action;
};
oFF.UndoManager.prototype.registerUndoManagerListener = function(listener)
{
	this.m_listeners.add(listener);
};
oFF.UndoManager.prototype.reset = function()
{
	this.clear(this.m_redoStates);
	this.clear(this.m_undoStates);
};
oFF.UndoManager.prototype.setMaxAvailableSteps = function(maxSteps)
{
	this.stackSize = maxSteps;
	this.updateStack();
};
oFF.UndoManager.prototype.unregisterUndoManagerListener = function(listener)
{
	this.m_listeners.removeElement(listener);
};
oFF.UndoManager.prototype.updateStack = function()
{
	if (this.stackSize > 0)
	{
		while (this.m_undoStates.size() - 1 > this.stackSize)
		{
			let stateId = this.m_undoStates.removeAt(0);
			this.getApplication().getOlapEnvironment().getDocumentStateManager().clearDocumentState(stateId);
		}
	}
};

oFF.ApplicationInitializeAction = function() {};
oFF.ApplicationInitializeAction.prototype = new oFF.SyncAction();
oFF.ApplicationInitializeAction.prototype._ff_c = "ApplicationInitializeAction";

oFF.ApplicationInitializeAction.create = function(syncType)
{
	let object = new oFF.ApplicationInitializeAction();
	object.setupActionExt(syncType, null, null, null, oFF.XVersion.MAX, null, null, null, null, oFF.ApplicationSystemOption.AUTO, true);
	return object;
};
oFF.ApplicationInitializeAction.prototype.m_application = null;
oFF.ApplicationInitializeAction.prototype.m_kernel = null;
oFF.ApplicationInitializeAction.prototype.m_kernelBooter = null;
oFF.ApplicationInitializeAction.prototype.m_programName = null;
oFF.ApplicationInitializeAction.prototype.m_systemLandscapeUrl = null;
oFF.ApplicationInitializeAction.prototype.m_systemName = null;
oFF.ApplicationInitializeAction.prototype.m_systemOption = null;
oFF.ApplicationInitializeAction.prototype.m_systemType = null;
oFF.ApplicationInitializeAction.prototype.m_systemUri = null;
oFF.ApplicationInitializeAction.prototype.m_useKernelBoot = false;
oFF.ApplicationInitializeAction.prototype.m_useSingleKernel = false;
oFF.ApplicationInitializeAction.prototype.m_xVersion = 0;
oFF.ApplicationInitializeAction.prototype.addExcludeProxyByUrl = function(url)
{
	this.m_kernelBooter.addExcludeProxyByUrl(url);
};
oFF.ApplicationInitializeAction.prototype.addModule = function(moduleName)
{
	this.m_kernelBooter.addModule(moduleName);
};
oFF.ApplicationInitializeAction.prototype.addProgramStartedListener = function(listener)
{
	this.m_kernelBooter.addProgramStartedListener(listener);
};
oFF.ApplicationInitializeAction.prototype.addStartConfig = function(name)
{
	return this.m_kernelBooter.addStartConfig(name);
};
oFF.ApplicationInitializeAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onApplicationReady(extResult, data, customIdentifier);
};
oFF.ApplicationInitializeAction.prototype.configureLandscape = function()
{
	if (oFF.notNull(this.m_application))
	{
		let location = oFF.NetworkEnv.getLocation();
		let systemLandscape = this.m_application.getSystemLandscape();
		if (this.m_systemOption !== oFF.ApplicationSystemOption.NONE && oFF.notNull(systemLandscape) || oFF.notNull(this.m_systemUri) || oFF.notNull(location) && oFF.notNull(this.m_systemType))
		{
			if (oFF.isNull(systemLandscape))
			{
				systemLandscape = oFF.StandaloneSystemLandscape.create(this.m_application);
				this.m_application.setSystemLandscape(systemLandscape);
			}
			if (systemLandscape.getMasterSystemName() === null)
			{
				let usingMasterName = this.m_systemName;
				if (oFF.isNull(usingMasterName))
				{
					usingMasterName = "master";
				}
				if (oFF.notNull(this.m_systemUri))
				{
					systemLandscape.setSystemByUri(usingMasterName, this.m_systemUri, null);
				}
				else if (oFF.notNull(location) && oFF.notNull(this.m_systemType))
				{
					let system = systemLandscape.createSystem();
					system.setSystemType(this.m_systemType);
					let scheme = location.getScheme();
					if (oFF.notNull(scheme))
					{
						if (oFF.XString.startsWith(scheme, "https"))
						{
							system.setProtocolType(oFF.ProtocolType.HTTPS);
						}
						else
						{
							system.setProtocolType(oFF.ProtocolType.HTTP);
						}
					}
					system.setSystemName(usingMasterName);
					system.setSystemText(usingMasterName);
					system.setHost(location.getHost());
					system.setPort(location.getPort());
					systemLandscape.setSystemByDescription(system);
				}
				else
				{
					let systemNames = systemLandscape.getSystemNames();
					if (systemNames.size() === 1)
					{
						usingMasterName = systemNames.get(0);
					}
					else
					{
						usingMasterName = null;
					}
				}
				if (oFF.notNull(usingMasterName))
				{
					systemLandscape.setMasterSystemName(usingMasterName);
				}
			}
		}
		else
		{
			let systemLandscapeFromKernel = this.m_application.getProcess().getSystemLandscape();
			this.m_application.setSystemLandscape(systemLandscapeFromKernel);
		}
		this.setData(this.m_application);
	}
	this.endSync();
};
oFF.ApplicationInitializeAction.prototype.doMaxDomainRelaxation = function()
{
	this.m_kernelBooter.doMaxDomainRelaxation();
};
oFF.ApplicationInitializeAction.prototype.getCurrentStartConfig = function()
{
	return this.m_kernelBooter.getCurrentStartConfig();
};
oFF.ApplicationInitializeAction.prototype.getDefaultSyncType = function()
{
	return this.m_kernelBooter.getDefaultSyncType();
};
oFF.ApplicationInitializeAction.prototype.getKernel = function()
{
	return this.m_kernel;
};
oFF.ApplicationInitializeAction.prototype.getNativeAnchorId = function()
{
	return this.m_kernelBooter.getNativeAnchorId();
};
oFF.ApplicationInitializeAction.prototype.getNativeAnchorObject = function()
{
	return this.m_kernelBooter.getNativeAnchorObject();
};
oFF.ApplicationInitializeAction.prototype.getProcess = function()
{
	return this.getActionContext();
};
oFF.ApplicationInitializeAction.prototype.getProgramName = function()
{
	return this.m_programName;
};
oFF.ApplicationInitializeAction.prototype.getProxyAuthorization = function()
{
	return this.m_kernelBooter.getProxyAuthorization();
};
oFF.ApplicationInitializeAction.prototype.getProxyHost = function()
{
	return this.m_kernelBooter.getProxyHost();
};
oFF.ApplicationInitializeAction.prototype.getProxyHttpHeaders = function()
{
	return this.m_kernelBooter.getProxyHttpHeaders();
};
oFF.ApplicationInitializeAction.prototype.getProxyPort = function()
{
	return this.m_kernelBooter.getProxyPort();
};
oFF.ApplicationInitializeAction.prototype.getProxyType = function()
{
	return this.m_kernelBooter.getProxyType();
};
oFF.ApplicationInitializeAction.prototype.getSccLocationId = function()
{
	return this.m_kernelBooter.getSccLocationId();
};
oFF.ApplicationInitializeAction.prototype.getSystemLandscapeUrl = function()
{
	return this.m_systemLandscapeUrl;
};
oFF.ApplicationInitializeAction.prototype.getSystemName = function()
{
	return this.m_systemName;
};
oFF.ApplicationInitializeAction.prototype.getSystemOption = function()
{
	return this.m_systemOption;
};
oFF.ApplicationInitializeAction.prototype.getSystemType = function()
{
	return this.m_systemType;
};
oFF.ApplicationInitializeAction.prototype.getSystemUri = function()
{
	return this.m_systemUri;
};
oFF.ApplicationInitializeAction.prototype.getWebdispatcherTemplate = function()
{
	return this.m_kernelBooter.getWebdispatcherTemplate();
};
oFF.ApplicationInitializeAction.prototype.getXVersion = function()
{
	return this.m_xVersion;
};
oFF.ApplicationInitializeAction.prototype.isSingletonKernelUsed = function()
{
	return this.m_kernelBooter.isSingletonKernelUsed();
};
oFF.ApplicationInitializeAction.prototype.isUsingKernelBoot = function()
{
	return this.m_useKernelBoot;
};
oFF.ApplicationInitializeAction.prototype.onLandscapeNodeLoaded = function(extResult, landscape, customIdentifier)
{
	this.addAllMessages(extResult);
	this.configureLandscape();
};
oFF.ApplicationInitializeAction.prototype.onProgramStarted = function(extResult, program, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		let process = program.getProcess();
		this.m_application = process.getApplication();
	}
	this.configureLandscape();
};
oFF.ApplicationInitializeAction.prototype.processSynchronization = function(syncType)
{
	let doCont;
	let process = this.getActionContext();
	if (this.m_useKernelBoot === true)
	{
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_programName))
		{
			this.m_kernelBooter.addStartConfig(this.m_programName);
		}
		this.m_kernelBooter.setDefaultSyncType(syncType);
		this.m_kernelBooter.setXVersion(this.m_xVersion);
		this.m_kernelBooter.addProgramStartedListener(this);
		this.m_kernelBooter.setKernel(this.m_kernel);
		if (oFF.isNull(process))
		{
			if (oFF.notNull(this.m_systemLandscapeUrl))
			{
				this.m_kernelBooter.setSystemLandscapeUrl(this.m_systemLandscapeUrl);
			}
		}
		else
		{
			let kernel = process.getKernel();
			this.m_kernelBooter.setKernel(kernel);
		}
		this.m_kernelBooter.runFull();
		doCont = syncType === oFF.SyncType.NON_BLOCKING;
	}
	else
	{
		if (oFF.isNull(process))
		{
			process = oFF.DefaultSession.createWithVersion(this.m_xVersion);
			if (oFF.notNull(syncType))
			{
				process.setDefaultSyncType(syncType);
			}
		}
		this.m_application = oFF.Application.create(process, process.getXVersion());
		if (this.m_systemOption !== oFF.ApplicationSystemOption.NONE)
		{
			let kernelSystemLandscape = process.getSystemLandscape();
			if (oFF.isNull(kernelSystemLandscape))
			{
				let environment = process.getEnvironment();
				if (oFF.isNull(this.m_systemLandscapeUrl))
				{
					this.m_systemLandscapeUrl = environment.getVariable(oFF.XEnvironmentConstants.SYSTEM_LANDSCAPE_URI);
				}
				if (oFF.isNull(this.m_systemUri) && oFF.isNull(this.m_systemName))
				{
					let masterSysUrl = environment.getVariable(oFF.XEnvironmentConstants.FIREFLY_MASTER_SYSTEM_URI);
					if (oFF.XStringUtils.isNotNullAndNotEmpty(masterSysUrl))
					{
						this.m_systemUri = oFF.XUri.createFromUrl(masterSysUrl);
						if (oFF.XStringUtils.isNullOrEmpty(this.m_systemName))
						{
							this.m_systemName = "master";
						}
					}
				}
			}
		}
		if (this.m_systemOption !== oFF.ApplicationSystemOption.NONE && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_systemLandscapeUrl))
		{
			let systemLandscape = oFF.StandaloneSystemLandscape.create(this.m_application);
			this.m_application.setSystemLandscape(systemLandscape);
			let uri = oFF.XUri.createFromFilePath(process, this.m_systemLandscapeUrl, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR, oFF.ProtocolType.FILE);
			oFF.SystemLandscapeLoadAction.createAndRun(syncType, this, null, this.m_application, systemLandscape, uri);
			doCont = true;
		}
		else
		{
			this.configureLandscape();
			doCont = false;
		}
	}
	return doCont;
};
oFF.ApplicationInitializeAction.prototype.putAllEnvironmentVariables = function(environmentConfig)
{
	this.m_kernelBooter.putAllEnvironmentVariables(environmentConfig);
};
oFF.ApplicationInitializeAction.prototype.registerListener = function(listener, customIdentifier)
{
	if (oFF.notNull(listener))
	{
		this.attachListener(listener, oFF.ListenerType.SPECIFIC, customIdentifier);
	}
};
oFF.ApplicationInitializeAction.prototype.releaseObjectInternal = function()
{
	this.m_systemName = null;
	this.m_systemUri = null;
	this.m_systemType = null;
	this.m_application = null;
	this.m_xVersion = 0;
	this.m_systemOption = null;
	this.m_kernelBooter = null;
};
oFF.ApplicationInitializeAction.prototype.runFull = oFF.noSupport;
oFF.ApplicationInitializeAction.prototype.runFullBlockingMode = oFF.noSupport;
oFF.ApplicationInitializeAction.prototype.setAllArguments = function(structure)
{
	this.m_kernelBooter.setAllArguments(structure);
};
oFF.ApplicationInitializeAction.prototype.setBooleanArgument = function(name, boolValue)
{
	this.m_kernelBooter.setBooleanArgument(name, boolValue);
};
oFF.ApplicationInitializeAction.prototype.setConfigFilePath = function(filePath)
{
	this.m_kernelBooter.setConfigFilePath(filePath);
};
oFF.ApplicationInitializeAction.prototype.setConfigJson = function(natveJson)
{
	this.m_kernelBooter.setConfigJson(natveJson);
};
oFF.ApplicationInitializeAction.prototype.setConfigStructure = function(configStruct)
{
	this.m_kernelBooter.setConfigJson(configStruct);
};
oFF.ApplicationInitializeAction.prototype.setDefaultSyncType = function(syncType)
{
	this.m_kernelBooter.setDefaultSyncType(syncType);
};
oFF.ApplicationInitializeAction.prototype.setEnvironmentVariable = function(name, value)
{
	this.m_kernelBooter.setEnvironmentVariable(name, value);
};
oFF.ApplicationInitializeAction.prototype.setHasPersistentState = function(hasPersistentState)
{
	this.m_kernelBooter.setHasPersistentState(hasPersistentState);
};
oFF.ApplicationInitializeAction.prototype.setInitialSystemType = function(systemType)
{
	this.m_kernelBooter.setInitialSystemType(systemType);
};
oFF.ApplicationInitializeAction.prototype.setIntegerArgument = function(name, intValue)
{
	this.m_kernelBooter.setIntegerArgument(name, intValue);
};
oFF.ApplicationInitializeAction.prototype.setKernel = function(kernel)
{
	this.m_kernel = kernel;
};
oFF.ApplicationInitializeAction.prototype.setKernelReadyConsumer = function(consumer)
{
	this.m_kernelBooter.setKernelReadyConsumer(consumer);
};
oFF.ApplicationInitializeAction.prototype.setListArgument = function(name, list)
{
	this.m_kernelBooter.setListArgument(name, list);
};
oFF.ApplicationInitializeAction.prototype.setModuleLoadUrl = function(moduleGroup, url)
{
	this.m_kernelBooter.setModuleLoadUrl(moduleGroup, url);
};
oFF.ApplicationInitializeAction.prototype.setModuleLoader = function(moduleLoader)
{
	this.m_kernelBooter.setModuleLoader(moduleLoader);
};
oFF.ApplicationInitializeAction.prototype.setNativeAnchorId = function(nativeAnchorId)
{
	this.m_kernelBooter.setNativeAnchorId(nativeAnchorId);
};
oFF.ApplicationInitializeAction.prototype.setNativeAnchorObject = function(nativeAnchorObject)
{
	this.m_kernelBooter.setNativeAnchorObject(nativeAnchorObject);
};
oFF.ApplicationInitializeAction.prototype.setProcess = function(process)
{
	this.setActionContext(process);
	this.setSession(process);
};
oFF.ApplicationInitializeAction.prototype.setProgramName = function(programName)
{
	this.m_programName = programName;
};
oFF.ApplicationInitializeAction.prototype.setProxyAuthorization = function(authorization)
{
	this.m_kernelBooter.setProxyAuthorization(authorization);
};
oFF.ApplicationInitializeAction.prototype.setProxyHost = function(host)
{
	this.m_kernelBooter.setProxyHost(host);
};
oFF.ApplicationInitializeAction.prototype.setProxyHttpHeader = function(name, value)
{
	this.m_kernelBooter.setProxyHttpHeader(name, value);
};
oFF.ApplicationInitializeAction.prototype.setProxyPort = function(port)
{
	this.m_kernelBooter.setProxyPort(port);
};
oFF.ApplicationInitializeAction.prototype.setProxyType = function(type)
{
	this.m_kernelBooter.setProxyType(type);
};
oFF.ApplicationInitializeAction.prototype.setSccLocationId = function(sccLocationId)
{
	this.m_kernelBooter.setSccLocationId(sccLocationId);
};
oFF.ApplicationInitializeAction.prototype.setStringArgument = function(name, value)
{
	this.m_kernelBooter.setStringArgument(name, value);
};
oFF.ApplicationInitializeAction.prototype.setSystemLandscapeUrl = function(url)
{
	this.m_systemLandscapeUrl = url;
};
oFF.ApplicationInitializeAction.prototype.setSystemName = function(systemName)
{
	this.m_systemName = systemName;
};
oFF.ApplicationInitializeAction.prototype.setSystemOption = function(systemOption)
{
	this.m_systemOption = systemOption;
};
oFF.ApplicationInitializeAction.prototype.setSystemType = function(systemType)
{
	this.m_systemType = systemType;
};
oFF.ApplicationInitializeAction.prototype.setSystemUri = function(uri)
{
	this.m_systemUri = uri;
};
oFF.ApplicationInitializeAction.prototype.setUseKernelBoot = function(useKernelBoot)
{
	this.m_useKernelBoot = useKernelBoot;
};
oFF.ApplicationInitializeAction.prototype.setUseSingleKernel = function(useSingleKernel)
{
	this.m_useSingleKernel = useSingleKernel;
};
oFF.ApplicationInitializeAction.prototype.setUseSingletonKernel = function(useSingletonKernel)
{
	this.m_kernelBooter.setUseSingletonKernel(useSingletonKernel);
};
oFF.ApplicationInitializeAction.prototype.setWebdispatcherTemplate = function(template)
{
	this.m_kernelBooter.setWebdispatcherTemplate(template);
};
oFF.ApplicationInitializeAction.prototype.setXVersion = function(xVersion)
{
	this.m_xVersion = xVersion;
};
oFF.ApplicationInitializeAction.prototype.setupActionExt = function(syncType, listener, customIdentifier, process, xVersion, systemType, systemName, systemUri, systemLandscapeUrl, systemOption, useKernelBoot)
{
	this.setupAction(syncType, listener, customIdentifier, process);
	this.m_xVersion = xVersion;
	this.m_systemLandscapeUrl = systemLandscapeUrl;
	this.m_systemName = systemName;
	this.m_systemUri = systemUri;
	this.m_systemType = systemType;
	this.m_systemOption = systemOption;
	this.m_useKernelBoot = useKernelBoot;
	this.m_programName = oFF.StandardAppProgram.DEFAULT_PROGRAM_NAME;
	this.m_kernelBooter = oFF.KernelBoot.create();
};
oFF.ApplicationInitializeAction.prototype.useSingleKernel = function()
{
	return this.m_useSingleKernel;
};

oFF.DfApplication = function() {};
oFF.DfApplication.prototype = new oFF.DfProcessContext();
oFF.DfApplication.prototype._ff_c = "DfApplication";

oFF.DfApplication.prototype.m_bindingManager = null;
oFF.DfApplication.prototype.m_clientInfo = null;
oFF.DfApplication.prototype.m_dataProviders = null;
oFF.DfApplication.prototype.m_olapEnvironment = null;
oFF.DfApplication.prototype.m_releaseProcess = false;
oFF.DfApplication.prototype.m_serviceRegistry = null;
oFF.DfApplication.prototype.m_subApplications = null;
oFF.DfApplication.prototype.m_undoManager = null;
oFF.DfApplication.prototype.clearClientInfo = function()
{
	this.getClientInfo().clearClientInfo();
};
oFF.DfApplication.prototype.createNextInstanceId = function()
{
	return oFF.XGuid.getGuid();
};
oFF.DfApplication.prototype.getBindingManager = function()
{
	return this.m_bindingManager;
};
oFF.DfApplication.prototype.getClientComponent = function()
{
	return this.getClientInfo().getClientComponent();
};
oFF.DfApplication.prototype.getClientIdentifier = function()
{
	return this.getClientInfo().getClientIdentifier();
};
oFF.DfApplication.prototype.getClientInfo = function()
{
	return this.m_clientInfo;
};
oFF.DfApplication.prototype.getClientVersion = function()
{
	return this.getClientInfo().getClientVersion();
};
oFF.DfApplication.prototype.getDataProviders = function()
{
	return this.m_dataProviders;
};
oFF.DfApplication.prototype.getDefaultSyncType = function()
{
	return this.getProcess().getDefaultSyncType();
};
oFF.DfApplication.prototype.getDocument = function(name, type)
{
	if (oFF.isNull(this.m_olapEnvironment))
	{
		this.m_olapEnvironment = oFF.OlapEnvironmentFactory.newInstance(this);
	}
	return this.m_olapEnvironment;
};
oFF.DfApplication.prototype.getHttpExchangeEnhancer = function()
{
	return this.getSession().getHttpExchangeEnhancer();
};
oFF.DfApplication.prototype.getLanguageLocale = function()
{
	return this.getClientInfo().getLanguageLocale();
};
oFF.DfApplication.prototype.getOlapEnvironment = function()
{
	return this.getDocument("DefaultOlapEnvironment", oFF.XComponentType._DATASOURCE);
};
oFF.DfApplication.prototype.getReferenceNameFromService = function(service)
{
	if (oFF.notNull(service))
	{
		let serviceConfig = service.getServiceConfig();
		if (oFF.notNull(serviceConfig))
		{
			let serviceTypeInfo = serviceConfig.getServiceTypeInfo();
			if (oFF.notNull(serviceTypeInfo))
			{
				return serviceTypeInfo.getServiceReferenceName();
			}
		}
	}
	return null;
};
oFF.DfApplication.prototype.getServices = function(serviceType)
{
	if (oFF.notNull(serviceType))
	{
		let serviceName = serviceType.getServiceReferenceName();
		if (oFF.notNull(serviceName))
		{
			if (oFF.notNull(this.m_serviceRegistry))
			{
				let services = this.m_serviceRegistry.getByKey(serviceName);
				if (oFF.notNull(services) && services.size() > 0)
				{
					return services;
				}
			}
		}
	}
	return null;
};
oFF.DfApplication.prototype.getStoryId = function()
{
	return this.getClientInfo().getStoryId();
};
oFF.DfApplication.prototype.getStoryName = function()
{
	return this.getClientInfo().getStoryName();
};
oFF.DfApplication.prototype.getUiManager = function()
{
	return this.getUiManagerExt(true);
};
oFF.DfApplication.prototype.getUndoManager = function()
{
	return this.m_undoManager;
};
oFF.DfApplication.prototype.getWidgetId = function()
{
	return null;
};
oFF.DfApplication.prototype.getXVersion = function()
{
	return this.getProcess().getXVersion();
};
oFF.DfApplication.prototype.newSubApplication = function(process)
{
	let subApplication = oFF.SubApplication.create(this, process);
	this.m_subApplications.add(subApplication);
	return subApplication;
};
oFF.DfApplication.prototype.registerDataProvider = function(dataProvider)
{
	if (oFF.notNull(dataProvider))
	{
		this.m_dataProviders.add(dataProvider);
	}
};
oFF.DfApplication.prototype.registerService = function(service)
{
	let serviceName = this.getReferenceNameFromService(service);
	if (oFF.notNull(serviceName))
	{
		let services = this.m_serviceRegistry.getByKey(serviceName);
		if (oFF.isNull(services))
		{
			services = oFF.XList.create();
			this.m_serviceRegistry.put(serviceName, services);
		}
		for (let i = 0; i < services.size(); i++)
		{
			let existingService = services.get(i);
			if (service === existingService)
			{
				return;
			}
		}
		services.add(service);
	}
};
oFF.DfApplication.prototype.releaseAllSubApplications = function()
{
	if (oFF.notNull(this.m_subApplications))
	{
		while (this.m_subApplications.size() > 0)
		{
			let count = this.m_subApplications.size();
			let subApplication = this.m_subApplications.get(0);
			oFF.XObjectExt.release(subApplication);
			if (count === this.m_subApplications.size())
			{
				throw oFF.XException.createIllegalStateException("DataProvider was not correctly released from storage");
			}
		}
	}
};
oFF.DfApplication.prototype.releaseDataProviders = function()
{
	if (oFF.notNull(this.m_dataProviders))
	{
		while (this.m_dataProviders.size() > 0)
		{
			let count = this.m_dataProviders.size();
			let dataProvider = this.m_dataProviders.get(0);
			oFF.XObjectExt.release(dataProvider);
			if (count === this.m_dataProviders.size())
			{
				throw oFF.XException.createIllegalStateException("DataProvider was not correctly released from storage");
			}
		}
	}
};
oFF.DfApplication.prototype.releaseManagedObjects = function()
{
	if (!this.isReleased())
	{
		this.releaseAllSubApplications();
		this.releaseDataProviders();
		this.releaseServices();
		this.m_dataProviders = oFF.XObjectExt.release(this.m_dataProviders);
		this.m_olapEnvironment = oFF.XObjectExt.release(this.m_olapEnvironment);
	}
};
oFF.DfApplication.prototype.releaseObject = function()
{
	this.m_subApplications = oFF.XObjectExt.release(this.m_subApplications);
	this.m_serviceRegistry = oFF.XObjectExt.release(this.m_serviceRegistry);
	this.m_bindingManager = oFF.XObjectExt.release(this.m_bindingManager);
	this.m_clientInfo = oFF.XObjectExt.release(this.m_clientInfo);
	if (this.m_releaseProcess)
	{
		oFF.XObjectExt.release(this.getProcess());
	}
	oFF.DfProcessContext.prototype.releaseObject.call( this );
};
oFF.DfApplication.prototype.releaseServices = function()
{
	if (oFF.notNull(this.m_serviceRegistry))
	{
		let keys = this.m_serviceRegistry.getKeysAsReadOnlyList();
		for (let idxKey = 0; idxKey < keys.size(); idxKey++)
		{
			let key = keys.get(idxKey);
			let services = this.m_serviceRegistry.getByKey(key);
			if (oFF.notNull(services) && !services.isReleased())
			{
				for (let idxService = services.size() - 1; idxService > -1; idxService--)
				{
					let service = services.get(idxService);
					oFF.XObjectExt.release(service);
				}
				services.clear();
				oFF.XObjectExt.release(services);
			}
		}
		this.m_serviceRegistry.clear();
	}
};
oFF.DfApplication.prototype.selectProviderComponents = function(operation, defaultDomain, contextObject, maximumCount)
{
	let domain = operation.getDomain();
	if (oFF.isNull(domain) || domain === oFF.SigSelDomain.CONTEXT)
	{
		domain = defaultDomain;
	}
	if (domain === oFF.SigSelDomain.DATA)
	{
		let components = oFF.XList.create();
		let operationType = operation.getOperationType();
		let dataProviders = this.getDataProviders();
		if (operationType === oFF.SigSelType.MATCH_NAME)
		{
			let name = operation.getName();
			for (let k = 0; k < dataProviders.size(); k++)
			{
				let dp = dataProviders.get(k);
				let componentType = dp.getComponentType();
				if (oFF.XString.isEqual(name, dp.getDataProviderName()) && componentType.isTypeOf(oFF.IoComponentType.DATA_PROVIDER))
				{
					components.add(dp);
					break;
				}
			}
		}
		else if (operationType === oFF.SigSelType.MATCH)
		{
			let selectedComponentType = operation.getSelectedComponentType();
			if (oFF.notNull(selectedComponentType))
			{
				for (let m = 0; m < dataProviders.size() && (maximumCount === -1 || components.size() < maximumCount); m++)
				{
					let dp2 = dataProviders.get(m);
					let componentType2 = dp2.getComponentType();
					if (componentType2.isTypeOf(selectedComponentType))
					{
						components.add(dp2);
					}
				}
			}
		}
		return components;
	}
	return null;
};
oFF.DfApplication.prototype.setClientInfo = function(version, identifier, component)
{
	this.getClientInfo().setClientInfo(version, identifier, component);
};
oFF.DfApplication.prototype.setDefaultSyncType = function(syncType)
{
	this.getProcess().setDefaultSyncType(syncType);
};
oFF.DfApplication.prototype.setLanguageLocale = function(languageLocale)
{
	this.getClientInfo().setLanguageLocale(languageLocale);
};
oFF.DfApplication.prototype.setProcessExt = function(process, releaseSession)
{
	this.setProcess(process);
	this.m_releaseProcess = releaseSession;
	this.m_clientInfo = oFF.XClientInfo.create(process);
	let selector = process.getSelector();
	selector.registerSelector(oFF.SigSelDomain.DATA, this);
	this.m_undoManager = oFF.UndoManager.create(this);
	this.m_bindingManager = oFF.DpBindingManager.create(process);
	process.setEntity(oFF.ProcessEntity.APPLICATION, this);
};
oFF.DfApplication.prototype.setStoryId = function(storyId)
{
	this.getClientInfo().setStoryId(storyId);
};
oFF.DfApplication.prototype.setStoryName = function(storyName)
{
	this.getClientInfo().setStoryName(storyName);
};
oFF.DfApplication.prototype.setWidgetId = function(widgetId) {};
oFF.DfApplication.prototype.setup = function()
{
	oFF.DfProcessContext.prototype.setup.call( this );
	this.m_dataProviders = oFF.XList.create();
	this.m_subApplications = oFF.XList.create();
	this.m_serviceRegistry = oFF.XHashMapByString.create();
};
oFF.DfApplication.prototype.unregisterDataProvider = function(dataProvider)
{
	if (oFF.notNull(dataProvider))
	{
		this.m_dataProviders.removeElement(dataProvider);
	}
};
oFF.DfApplication.prototype.unregisterService = function(service)
{
	let serviceName = this.getReferenceNameFromService(service);
	if (oFF.notNull(serviceName))
	{
		if (oFF.notNull(this.m_serviceRegistry))
		{
			let services = this.m_serviceRegistry.getByKey(serviceName);
			if (oFF.notNull(services) && !services.isReleased())
			{
				for (let i = 0; i < services.size(); i++)
				{
					let existingService = services.get(i);
					if (service === existingService)
					{
						services.removeAt(i);
						break;
					}
				}
			}
		}
	}
};
oFF.DfApplication.prototype.unregisterSubApplication = function(subApplication)
{
	let index = this.m_subApplications.getIndex(subApplication);
	if (index !== -1)
	{
		this.m_subApplications.removeAt(index);
	}
};

oFF.DfShellProgramWithApplication = function() {};
oFF.DfShellProgramWithApplication.prototype = new oFF.DfApplicationProgram();
oFF.DfShellProgramWithApplication.prototype._ff_c = "DfShellProgramWithApplication";

oFF.DfShellProgramWithApplication.prototype.getComponentType = function()
{
	return oFF.XComponentType._PROGRAM;
};
oFF.DfShellProgramWithApplication.prototype.getDefaultContainerType = function()
{
	return oFF.ProgramContainerType.CONSOLE;
};
oFF.DfShellProgramWithApplication.prototype.getProgramType = function()
{
	return oFF.ProgramType.SHELL;
};
oFF.DfShellProgramWithApplication.prototype.readLine = function(listener)
{
	return null;
};
oFF.DfShellProgramWithApplication.prototype.releaseObject = function()
{
	oFF.DfApplicationProgram.prototype.releaseObject.call( this );
};
oFF.DfShellProgramWithApplication.prototype.runProcess = function()
{
	return this.runMain();
};
oFF.DfShellProgramWithApplication.prototype.setAllowUserInput = function(allowInput)
{
	this.getStdin().setAllowUserInput(allowInput);
};
oFF.DfShellProgramWithApplication.prototype.supportsSyncType = function(syncType)
{
	return false;
};

oFF.DragonflyAppProgram = function() {};
oFF.DragonflyAppProgram.prototype = new oFF.DfApplicationProgram();
oFF.DragonflyAppProgram.prototype._ff_c = "DragonflyAppProgram";

oFF.DragonflyAppProgram.DEFAULT_PROGRAM_NAME = "DragonflyAppProgram";
oFF.DragonflyAppProgram.prototype.getProgramName = function()
{
	return oFF.DragonflyAppProgram.DEFAULT_PROGRAM_NAME;
};
oFF.DragonflyAppProgram.prototype.newProgram = function()
{
	let newPrg = new oFF.DragonflyAppProgram();
	newPrg.setup();
	return newPrg;
};
oFF.DragonflyAppProgram.prototype.prepareProgramMetadata = function(metadata) {};
oFF.DragonflyAppProgram.prototype.processArguments = function(args) {};
oFF.DragonflyAppProgram.prototype.processConfiguration = function(configuration) {};
oFF.DragonflyAppProgram.prototype.runProcess = function()
{
	return true;
};

oFF.GenericAppProgram = function() {};
oFF.GenericAppProgram.prototype = new oFF.DfApplicationProgram();
oFF.GenericAppProgram.prototype._ff_c = "GenericAppProgram";

oFF.GenericAppProgram.DEFAULT_PROGRAM_NAME = "GenericAppProgram";
oFF.GenericAppProgram.DEFAULT_SYSTEM_NAME = "default";
oFF.GenericAppProgram.PATH_KEY = "path";
oFF.GenericAppProgram.SYSTEM_TYPE_KEY = "systemType";
oFF.GenericAppProgram.prototype._addSystemByJson = function(systemName, element)
{
	if (oFF.notNull(element) && element.isStructure())
	{
		let sysStruct = element.asStructure();
		let systemLandscape = this.getProcess().getSystemLandscape();
		if (oFF.isNull(systemLandscape))
		{
			throw oFF.XException.createException("SystemLandscape not loaded!");
		}
		let tmpMap = oFF.XHashMapByString.create();
		oFF.XCollectionUtils.forEach(sysStruct.getKeysAsReadOnlyList(), (key) => {
			let tmpElemnt = sysStruct.getByKey(key);
			tmpMap.put(key, oFF.PrUtils.convertElementToStringValue(tmpElemnt, ""));
		});
		let sysProps = oFF.XProperties.createByMapCopy(tmpMap);
		let tmpSys = oFF.SystemDescription.create(systemLandscape, sysStruct.getStringByKeyExt(oFF.ConnectionParameters.NAME, systemName), sysProps);
		systemLandscape.setSystemByDescription(tmpSys);
		this._getApplication().getConnectionPool().setMaximumSharedConnections(systemName, 4);
	}
	else
	{
		throw oFF.XException.createException("Invalid system json!");
	}
};
oFF.GenericAppProgram.prototype._getApplication = function()
{
	return this.getProcess().getApplication();
};
oFF.GenericAppProgram.prototype._processDefaultSystemJson = function(element)
{
	if (oFF.notNull(element) && element.isStructure())
	{
		let defaultSysStruct = element.asStructure();
		let sysType = oFF.SystemType.lookup(defaultSysStruct.getStringByKey(oFF.GenericAppProgram.SYSTEM_TYPE_KEY));
		let pathStr = defaultSysStruct.getStringByKeyExt(oFF.GenericAppProgram.PATH_KEY, "");
		let systemLandscape = this.getProcess().getSystemLandscape();
		if (oFF.isNull(systemLandscape))
		{
			throw oFF.XException.createException("SystemLandscape not loaded!");
		}
		let defaultSystem = systemLandscape.getSystemDescription(oFF.GenericAppProgram.DEFAULT_SYSTEM_NAME);
		if (oFF.isNull(defaultSystem))
		{
			defaultSystem = systemLandscape.createSystem();
			defaultSystem.setName(oFF.GenericAppProgram.DEFAULT_SYSTEM_NAME);
			systemLandscape.setSystemByDescription(defaultSystem);
		}
		defaultSystem.setTimeout(10000);
		defaultSystem.setAuthenticationType(oFF.AuthenticationType.NONE);
		defaultSystem.setSystemType(sysType);
		defaultSystem.setProtocolType(oFF.NetworkEnv.getLocation().getProtocolType());
		defaultSystem.setHost(oFF.NetworkEnv.getLocation().getHost());
		defaultSystem.setPort(oFF.NetworkEnv.getLocation().getPort());
		defaultSystem.setPath(pathStr);
		if (sysType === oFF.SystemType.BW)
		{
			defaultSystem.setSessionCarrierType(oFF.SessionCarrierType.SAP_CONTEXT_ID_HEADER);
		}
		this._getApplication().getConnectionPool().setMaximumSharedConnections(oFF.GenericAppProgram.DEFAULT_SYSTEM_NAME, 4);
	}
	else
	{
		throw oFF.XException.createException("Invalid default system json!");
	}
};
oFF.GenericAppProgram.prototype.addSystemByNativeJson = function(systemName, nativeJson)
{
	try
	{
		let jsonParser = oFF.JsonParserFactory.newInstance();
		let output = jsonParser.convertFromNative(nativeJson);
		oFF.XObjectExt.release(jsonParser);
		this._addSystemByJson(systemName, output);
	}
	catch (err)
	{
		oFF.XLogger.printError(oFF.XStringUtils.concatenate2("Failed to add system! Error: ", oFF.XException.getMessage(err)));
	}
};
oFF.GenericAppProgram.prototype.addSystemsByNativeJson = function(nativeJson)
{
	try
	{
		let jsonParser = oFF.JsonParserFactory.newInstance();
		let output = jsonParser.convertFromNative(nativeJson);
		oFF.XObjectExt.release(jsonParser);
		if (oFF.notNull(output) && output.isStructure())
		{
			oFF.XCollectionUtils.mapEntries(output.asStructure(), (key, entry) => {
				if (oFF.notNull(entry) && entry.isStructure())
				{
					this._addSystemByJson(key, entry);
				}
			});
		}
	}
	catch (err)
	{
		oFF.XLogger.printError(oFF.XStringUtils.concatenate2("Failed to add system! Error: ", oFF.XException.getMessage(err)));
	}
};
oFF.GenericAppProgram.prototype.getDefaultSystemName = function()
{
	return oFF.GenericAppProgram.DEFAULT_SYSTEM_NAME;
};
oFF.GenericAppProgram.prototype.getProgramName = function()
{
	return oFF.GenericAppProgram.DEFAULT_PROGRAM_NAME;
};
oFF.GenericAppProgram.prototype.newProgram = function()
{
	let newPrg = new oFF.GenericAppProgram();
	newPrg.setup();
	return newPrg;
};
oFF.GenericAppProgram.prototype.prepareProgramMetadata = function(metadata) {};
oFF.GenericAppProgram.prototype.processArguments = function(args) {};
oFF.GenericAppProgram.prototype.processConfiguration = function(configuration) {};
oFF.GenericAppProgram.prototype.releaseObject = function()
{
	oFF.DfApplicationProgram.prototype.releaseObject.call( this );
};
oFF.GenericAppProgram.prototype.runProcess = function()
{
	return true;
};
oFF.GenericAppProgram.prototype.setDefaultSystemByNativeJson = function(nativeJson)
{
	try
	{
		let jsonParser = oFF.JsonParserFactory.newInstance();
		let output = jsonParser.convertFromNative(nativeJson);
		oFF.XObjectExt.release(jsonParser);
		this._processDefaultSystemJson(output);
	}
	catch (err)
	{
		oFF.XLogger.printError(oFF.XStringUtils.concatenate2("Failed to setup default system! Error: ", oFF.XException.getMessage(err)));
	}
};

oFF.OrcaAppProgram = function() {};
oFF.OrcaAppProgram.prototype = new oFF.DfApplicationProgram();
oFF.OrcaAppProgram.prototype._ff_c = "OrcaAppProgram";

oFF.OrcaAppProgram.DEFAULT_PROGRAM_NAME = "OrcaAppProgram";
oFF.OrcaAppProgram.prototype.getProgramName = function()
{
	return oFF.OrcaAppProgram.DEFAULT_PROGRAM_NAME;
};
oFF.OrcaAppProgram.prototype.newProgram = function()
{
	let newPrg = new oFF.OrcaAppProgram();
	newPrg.setup();
	return newPrg;
};
oFF.OrcaAppProgram.prototype.prepareProgramMetadata = function(metadata) {};
oFF.OrcaAppProgram.prototype.processArguments = function(args) {};
oFF.OrcaAppProgram.prototype.processConfiguration = function(configuration) {};
oFF.OrcaAppProgram.prototype.runProcess = function()
{
	let process = this.getProcess();
	let kernel = process.getKernel();
	let credentialsProvider;
	if (process.hasFeature(oFF.FeatureToggleSAC.FF_SAC_FIREFLY_AUTHENTICATION))
	{
		let orcaSubSysContainer;
		let isLiteCredsDefaultEnabled = process.hasFeature(oFF.FeatureToggleSAC.FF_LITE_CREDS_DEFAULT_ENABLED);
		if (isLiteCredsDefaultEnabled)
		{
			orcaSubSysContainer = kernel.getSubSystemContainer(oFF.SubSystemType.CREDENTIALS_PROVIDER_ORCA_LITE);
		}
		else
		{
			orcaSubSysContainer = kernel.getSubSystemContainer(oFF.SubSystemType.CREDENTIALS_PROVIDER_ORCA);
		}
		orcaSubSysContainer.processSubSystemLoad(oFF.SyncType.BLOCKING, null, null);
		credentialsProvider = orcaSubSysContainer.getMainApi();
	}
	else
	{
		let credentialsSubSystemContainer = kernel.getSubSystemContainer(oFF.SubSystemType.CREDENTIALS_PROVIDER);
		let bootstrapSubSystem = credentialsSubSystemContainer.getBootstrapSubSystem();
		credentialsProvider = bootstrapSubSystem.getMainApi();
	}
	process.setEntity(oFF.ProcessEntity.CREDENTIALS_PROVIDER, credentialsProvider);
	return true;
};

oFF.OrcaLiteViewerAppProgram = function() {};
oFF.OrcaLiteViewerAppProgram.prototype = new oFF.DfApplicationProgram();
oFF.OrcaLiteViewerAppProgram.prototype._ff_c = "OrcaLiteViewerAppProgram";

oFF.OrcaLiteViewerAppProgram.DEFAULT_PROGRAM_NAME = "OrcaLiteViewerAppProgram";
oFF.OrcaLiteViewerAppProgram.prototype.getProgramName = function()
{
	return oFF.OrcaLiteViewerAppProgram.DEFAULT_PROGRAM_NAME;
};
oFF.OrcaLiteViewerAppProgram.prototype.newProgram = function()
{
	let newPrg = new oFF.OrcaLiteViewerAppProgram();
	newPrg.setup();
	return newPrg;
};
oFF.OrcaLiteViewerAppProgram.prototype.prepareProgramMetadata = function(metadata) {};
oFF.OrcaLiteViewerAppProgram.prototype.processArguments = function(args) {};
oFF.OrcaLiteViewerAppProgram.prototype.processConfiguration = function(configuration) {};
oFF.OrcaLiteViewerAppProgram.prototype.runProcess = function()
{
	let process = this.getProcess();
	let kernel = process.getKernel();
	let subSysContainer = kernel.getSubSystemContainer(oFF.SubSystemType.CREDENTIALS_PROVIDER_LITE);
	let liteCredProvider = subSysContainer.getMainApi();
	process.setEntity(oFF.ProcessEntity.CREDENTIALS_PROVIDER, liteCredProvider);
	return true;
};

oFF.StandardAppProgram = function() {};
oFF.StandardAppProgram.prototype = new oFF.DfApplicationProgram();
oFF.StandardAppProgram.prototype._ff_c = "StandardAppProgram";

oFF.StandardAppProgram.DEFAULT_PROGRAM_NAME = "StandardAppProgram";
oFF.StandardAppProgram.prototype.getProgramName = function()
{
	return oFF.StandardAppProgram.DEFAULT_PROGRAM_NAME;
};
oFF.StandardAppProgram.prototype.newProgram = function()
{
	let newPrg = new oFF.StandardAppProgram();
	newPrg.setup();
	return newPrg;
};
oFF.StandardAppProgram.prototype.prepareProgramMetadata = function(metadata) {};
oFF.StandardAppProgram.prototype.processArguments = function(args) {};
oFF.StandardAppProgram.prototype.processConfiguration = function(configuration) {};
oFF.StandardAppProgram.prototype.runProcess = function()
{
	return true;
};

oFF.UndoRedoAction = function() {};
oFF.UndoRedoAction.prototype = new oFF.SyncAction();
oFF.UndoRedoAction.prototype._ff_c = "UndoRedoAction";

oFF.UndoRedoAction.createAndRun = function(syncType, context, listener, customIdentifier, stateId, document)
{
	let action = new oFF.UndoRedoAction();
	action.m_stateId = stateId;
	action.m_document = document;
	action.setupActionAndRun(syncType, listener, customIdentifier, context);
	return action;
};
oFF.UndoRedoAction.prototype.m_document = null;
oFF.UndoRedoAction.prototype.m_stateId = null;
oFF.UndoRedoAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.undoRedoActionFinished(extResult, data, customIdentifier);
};
oFF.UndoRedoAction.prototype.documentStateApplied = function(extResult, undoSupport, customIdentifier)
{
	if (extResult.hasErrors())
	{
		this.addAllMessages(extResult);
	}
	this.setData(extResult.getData());
	this.endSync();
};
oFF.UndoRedoAction.prototype.processSynchronization = function(syncType)
{
	if (oFF.isNull(this.m_stateId))
	{
		this.addError(1, "Undo not possible");
		return false;
	}
	else
	{
		let action = this.m_document.getDocumentStateManager().applyDocumentState(syncType, this, null, this.m_stateId);
		if (oFF.isNull(action))
		{
			this.addError(1000, "Undo failed");
			this.endSync();
			return false;
		}
	}
	return true;
};
oFF.UndoRedoAction.prototype.releaseObjectInternal = function() {};

oFF.Application = function() {};
oFF.Application.prototype = new oFF.DfApplication();
oFF.Application.prototype._ff_c = "Application";

oFF.Application.create = function(process, version)
{
	let application = new oFF.Application();
	application.setupApplication(process, version);
	return application;
};
oFF.Application.prototype.m_applicationId = null;
oFF.Application.prototype.m_applicationName = null;
oFF.Application.prototype.m_connectionPool = null;
oFF.Application.prototype.m_messageManager = null;
oFF.Application.prototype.m_repositoryManager = null;
oFF.Application.prototype.m_sendBottleMessages = 0;
oFF.Application.prototype.m_systemLandscape = null;
oFF.Application.prototype.m_uiManager = null;
oFF.Application.prototype.getApplicationName = function()
{
	return this.m_applicationName;
};
oFF.Application.prototype.getConnection = function(systemName)
{
	return this.m_connectionPool.getConnection(systemName);
};
oFF.Application.prototype.getConnectionPool = function()
{
	return this.m_connectionPool;
};
oFF.Application.prototype.getErrorManager = function()
{
	return this.m_messageManager;
};
oFF.Application.prototype.getRepositoryManager = function()
{
	return this.m_repositoryManager;
};
oFF.Application.prototype.getSyncManager = function()
{
	return this;
};
oFF.Application.prototype.getSystemConnect = function(systemName)
{
	return this.m_connectionPool.getSystemConnect(systemName);
};
oFF.Application.prototype.getSystemLandscape = function()
{
	return this.m_systemLandscape;
};
oFF.Application.prototype.getUiManagerExt = function(createIfNotExist)
{
	if (oFF.isNull(this.m_uiManager) && createIfNotExist === true)
	{
		let subSystem = this.getProcess().openSubSystem(oFF.SubSystemType.GUI);
		this.m_uiManager = subSystem.getMainApi();
	}
	if (oFF.isNull(this.m_uiManager))
	{
		let process = this.getProcess();
		while (oFF.notNull(process) && oFF.isNull(this.m_uiManager))
		{
			this.m_uiManager = process.getSubSystem(oFF.SubSystemType.GUI);
			process = process.getParentProcess();
		}
	}
	return this.m_uiManager;
};
oFF.Application.prototype.getUserManager = function()
{
	return this.getProcess().getUserManager();
};
oFF.Application.prototype.isSapStatisticsEnabled = function()
{
	return this.getSession().isSapStatisticsEnabled();
};
oFF.Application.prototype.prepareMessage = function()
{
	let messageElement = oFF.PrFactory.createStructure();
	messageElement.putString("AppId", this.m_applicationId);
	messageElement.putString("Time", oFF.XDateTime.createCurrentLocalDateTime().toIso8601Format());
	messageElement.putInteger("Number", this.m_sendBottleMessages);
	let pool = this.getConnectionPool();
	let activeSystems = pool.getActiveSystems();
	let connList = messageElement.putNewList("Connections");
	for (let i = 0; i < activeSystems.size(); i++)
	{
		let sysName = activeSystems.get(i);
		let openConnections = pool.getOpenConnections(sysName);
		let openConnCount = openConnections.size();
		let sys = connList.addNewStructure();
		sys.putString("SysName", sysName);
		sys.putInteger("OpenConn", openConnCount);
		let shared = sys.putNewList("Shared");
		for (let k = 0; k < openConnCount; k++)
		{
			let currentConnection = openConnections.get(k);
			if (currentConnection.isShared() && currentConnection.useSessionUrlRewrite() && oFF.XStringUtils.isNotNullAndNotEmpty(currentConnection.getSessionUrlRewrite()))
			{
				let element = shared.addNewStructure();
				element.putString("Name", currentConnection.getName());
				element.putString("CsrfToken", currentConnection.getCsrfToken());
				element.putString("SessionUrlRewrite", currentConnection.getSessionUrlRewrite());
			}
		}
	}
	let messageInABottle = oFF.PrUtils.serialize(messageElement, false, false, 0);
	return messageInABottle;
};
oFF.Application.prototype.processBooting = oFF.noSupport;
oFF.Application.prototype.receiveMessage = function(message)
{
	let messageElement = oFF.JsonParserFactory.createFromString(message);
	let pool = this.getConnectionPool();
	let connList = messageElement.getListByKey("Connections");
	for (let i = 0; i < connList.size(); i++)
	{
		let sys = connList.getStructureAt(i);
		let sysName = sys.getStringByKey("SysName");
		let sharedConnections = sys.getListByKey("Shared");
		for (let k = 0; k < sharedConnections.size(); k++)
		{
			let sharedConnInfo = sharedConnections.getStructureAt(k);
			let name = sharedConnInfo.getStringByKey("Name");
			let csrfToken = sharedConnInfo.getStringByKey("CsrfToken");
			let sessionUrlRewrite = sharedConnInfo.getStringByKey("SessionUrlRewrite");
			pool.setExternalSharedConnection(sysName, name, csrfToken, sessionUrlRewrite);
		}
	}
};
oFF.Application.prototype.releaseObject = function()
{
	this.releaseManagedObjects();
	if (this.isReleased() === false)
	{
		this.m_connectionPool = oFF.XObjectExt.release(this.m_connectionPool);
		this.m_messageManager = oFF.XObjectExt.release(this.m_messageManager);
		this.m_systemLandscape = null;
		this.m_uiManager = null;
		this.m_repositoryManager = null;
		this.m_applicationName = null;
	}
	oFF.DfApplication.prototype.releaseObject.call( this );
};
oFF.Application.prototype.setApplicationName = function(name)
{
	this.m_applicationName = name;
	let process = this.getProcess();
	process.setApplicationName(name);
};
oFF.Application.prototype.setErrorManager = function(errorManager)
{
	this.m_messageManager = errorManager;
};
oFF.Application.prototype.setSapStatisticsEnabled = function(enabled)
{
	this.getSession().setSapStatisticsEnabled(enabled);
};
oFF.Application.prototype.setSystemLandscape = function(systemLandscape)
{
	this.m_systemLandscape = systemLandscape;
	let process = this.getProcess();
	process.setEntity(oFF.ProcessEntity.SYSTEM_LANDSCAPE, systemLandscape);
};
oFF.Application.prototype.setUiManager = function(uiManager)
{
	this.m_uiManager = uiManager;
};
oFF.Application.prototype.setupApplication = function(process, version)
{
	this.setup();
	this.setProcessExt(process, false);
	this.setErrorManager(oFF.MessageManager.createMessageManagerExt(process));
	this.m_repositoryManager = oFF.RepositoryManager.create(this);
	this.m_applicationId = oFF.XGuid.getGuid();
	this.m_connectionPool = oFF.ConnectionPool.create(process);
	process.setEntity(oFF.ProcessEntity.CONNECTION_POOL, this.m_connectionPool);
};
oFF.Application.prototype.toString = function()
{
	let sb = oFF.XStringBuffer.create();
	sb.appendLine("Application");
	if (oFF.notNull(this.m_messageManager))
	{
		sb.appendNewLine();
		sb.append(this.m_messageManager.toString());
	}
	return sb.toString();
};

oFF.SubApplication = function() {};
oFF.SubApplication.prototype = new oFF.DfApplication();
oFF.SubApplication.prototype._ff_c = "SubApplication";

oFF.SubApplication.create = function(parentApplication, process)
{
	let application = new oFF.SubApplication();
	application.setupSubApplication(parentApplication, process);
	return application;
};
oFF.SubApplication.prototype.m_parentApplication = null;
oFF.SubApplication.prototype.m_subUiManager = null;
oFF.SubApplication.prototype.getApplicationName = function()
{
	return this.m_parentApplication.getApplicationName();
};
oFF.SubApplication.prototype.getClientComponent = function()
{
	return this.m_parentApplication.getClientComponent();
};
oFF.SubApplication.prototype.getClientIdentifier = function()
{
	return this.m_parentApplication.getClientIdentifier();
};
oFF.SubApplication.prototype.getClientVersion = function()
{
	return this.m_parentApplication.getClientVersion();
};
oFF.SubApplication.prototype.getConnection = function(systemName)
{
	return this.m_parentApplication.getConnection(systemName);
};
oFF.SubApplication.prototype.getConnectionPool = function()
{
	return this.m_parentApplication.getConnectionPool();
};
oFF.SubApplication.prototype.getErrorManager = function()
{
	return this.m_parentApplication.getErrorManager();
};
oFF.SubApplication.prototype.getRepositoryManager = function()
{
	return this.m_parentApplication.getRepositoryManager();
};
oFF.SubApplication.prototype.getSyncManager = function()
{
	return this.m_parentApplication.getSyncManager();
};
oFF.SubApplication.prototype.getSystemConnect = function(systemName)
{
	return this.m_parentApplication.getSystemConnect(systemName);
};
oFF.SubApplication.prototype.getSystemLandscape = function()
{
	return this.m_parentApplication.getSystemLandscape();
};
oFF.SubApplication.prototype.getUiManagerExt = function(createIfNotExist)
{
	if (oFF.isNull(this.m_subUiManager))
	{
		let uiManager = this.m_parentApplication.getUiManagerExt(createIfNotExist);
		this.m_subUiManager = uiManager;
	}
	return this.m_subUiManager;
};
oFF.SubApplication.prototype.getUserManager = function()
{
	return this.m_parentApplication.getUserManager();
};
oFF.SubApplication.prototype.isSapStatisticsEnabled = function()
{
	return this.m_parentApplication.isSapStatisticsEnabled();
};
oFF.SubApplication.prototype.processBooting = oFF.noSupport;
oFF.SubApplication.prototype.releaseObject = function()
{
	this.releaseManagedObjects();
	this.m_subUiManager = null;
	this.m_parentApplication.unregisterSubApplication(this);
	this.m_parentApplication = null;
	oFF.DfApplication.prototype.releaseObject.call( this );
};
oFF.SubApplication.prototype.setApplicationName = function(name)
{
	this.m_parentApplication.setApplicationName(name);
};
oFF.SubApplication.prototype.setErrorManager = function(errorManager)
{
	this.m_parentApplication.setErrorManager(errorManager);
};
oFF.SubApplication.prototype.setSapStatisticsEnabled = function(enabled)
{
	this.m_parentApplication.setSapStatisticsEnabled(enabled);
};
oFF.SubApplication.prototype.setSystemLandscape = function(systemLandscape)
{
	this.m_parentApplication.setSystemLandscape(systemLandscape);
};
oFF.SubApplication.prototype.setUiManager = function(uiManager)
{
	this.m_subUiManager = uiManager;
};
oFF.SubApplication.prototype.setupSubApplication = function(parentApplication, process)
{
	oFF.DfApplication.prototype.setup.call( this );
	let subSession = process;
	if (oFF.isNull(subSession))
	{
		let parentProcess = parentApplication.getProcess();
		subSession = parentProcess.newChildProcess(oFF.ProcessType.SERVICE);
	}
	this.setProcessExt(subSession, true);
	this.m_parentApplication = parentApplication;
};

oFF.RuntimeComponentType = function() {};
oFF.RuntimeComponentType.prototype = new oFF.XComponentType();
oFF.RuntimeComponentType.prototype._ff_c = "RuntimeComponentType";

oFF.RuntimeComponentType.APPLICATION = null;
oFF.RuntimeComponentType.APPLICATION_PROGRAM = null;
oFF.RuntimeComponentType.SERVICE_DATA_PROVIDER = null;
oFF.RuntimeComponentType.SUB_APPLICATION = null;
oFF.RuntimeComponentType.createRuntimeType = function(constant, parent)
{
	let mt = new oFF.RuntimeComponentType();
	if (oFF.isNull(parent))
	{
		mt.setupExt(constant, oFF.XComponentType._ROOT);
	}
	else
	{
		mt.setupExt(constant, parent);
	}
	return mt;
};
oFF.RuntimeComponentType.staticSetupRuntimeComponentTypes = function()
{
	oFF.RuntimeComponentType.APPLICATION = oFF.RuntimeComponentType.createRuntimeType("Application", oFF.XComponentType._ROOT);
	oFF.RuntimeComponentType.SUB_APPLICATION = oFF.RuntimeComponentType.createRuntimeType("SubApplication", oFF.XComponentType._ROOT);
	oFF.RuntimeComponentType.SERVICE_DATA_PROVIDER = oFF.RuntimeComponentType.createRuntimeType("ServiceDataProvider", oFF.IoComponentType.DATA_PROVIDER);
	oFF.RuntimeComponentType.APPLICATION_PROGRAM = oFF.RuntimeComponentType.createRuntimeType("ApplicationProgram", oFF.XComponentType._PROGRAM);
};

oFF.DfService = function() {};
oFF.DfService.prototype = new oFF.SyncActionExt();
oFF.DfService.prototype._ff_c = "DfService";

oFF.DfService.prototype.m_application = null;
oFF.DfService.prototype.m_connectionContainer = null;
oFF.DfService.prototype.m_isServiceInRelease = false;
oFF.DfService.prototype.m_serviceConfig = null;
oFF.DfService.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onServiceInitialized(extResult, data, customIdentifier);
};
oFF.DfService.prototype.getApplication = function()
{
	return this.m_application;
};
oFF.DfService.prototype.getConnection = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_connectionContainer);
};
oFF.DfService.prototype.getServiceConfig = function()
{
	return this.m_serviceConfig;
};
oFF.DfService.prototype.isServiceConfigMatching = function(serviceConfig, connection, messages)
{
	return true;
};
oFF.DfService.prototype.processInitialization = function(syncType, listener, customIdentifier)
{
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.DfService.prototype.processSynchronization = function(syncType)
{
	return false;
};
oFF.DfService.prototype.registerServiceAtApplication = function()
{
	let application = this.getApplication();
	if (oFF.isNull(application))
	{
		return;
	}
	application.registerService(this);
};
oFF.DfService.prototype.releaseObjectInternal = function()
{
	if (!this.m_isServiceInRelease)
	{
		this.m_isServiceInRelease = true;
		this.unregisterServiceAtApplication();
		this.m_connectionContainer = null;
		this.m_application = null;
	}
};
oFF.DfService.prototype.requiresInitialization = function()
{
	return true;
};
oFF.DfService.prototype.setConnection = function(connection)
{
	this.m_connectionContainer = oFF.XWeakReferenceUtil.getWeakRef(connection);
};
oFF.DfService.prototype.setupService = function(serviceConfigInfo)
{
	this.setupAction(null, null, null, serviceConfigInfo);
	this.m_serviceConfig = serviceConfigInfo;
	this.m_application = serviceConfigInfo.getApplication();
	if (serviceConfigInfo.isSystemBoundService())
	{
		this.setConnection(serviceConfigInfo.getConnectionContainer());
	}
	this.registerServiceAtApplication();
};
oFF.DfService.prototype.unregisterServiceAtApplication = function()
{
	let application = this.getApplication();
	if (oFF.notNull(application))
	{
		application.unregisterService(this);
	}
};

oFF.DfServiceConfig = function() {};
oFF.DfServiceConfig.prototype = new oFF.SyncActionExt();
oFF.DfServiceConfig.prototype._ff_c = "DfServiceConfig";

oFF.DfServiceConfig.prototype.m_application = null;
oFF.DfServiceConfig.prototype.m_connectionContainer = null;
oFF.DfServiceConfig.prototype.m_connectionName = null;
oFF.DfServiceConfig.prototype.m_isConfigInRelease = false;
oFF.DfServiceConfig.prototype.m_name = null;
oFF.DfServiceConfig.prototype.m_requestTimeZone = null;
oFF.DfServiceConfig.prototype.m_serverMetadata = null;
oFF.DfServiceConfig.prototype.m_serviceTemporary = null;
oFF.DfServiceConfig.prototype.m_serviceType = null;
oFF.DfServiceConfig.prototype.m_syncTypeForInitialization = null;
oFF.DfServiceConfig.prototype.m_systemName = null;
oFF.DfServiceConfig.prototype.m_tagging = null;
oFF.DfServiceConfig.prototype.m_useAsDataProvider = false;
oFF.DfServiceConfig.prototype.m_usePrivateConnection = false;
oFF.DfServiceConfig.prototype.copyFromInternal = function(other, flags)
{
	let otherConfig = other;
	this.m_systemName = otherConfig.getSystemName();
	this.m_application = otherConfig.getApplication();
	this.m_requestTimeZone = otherConfig.getRequestTimeZone();
	this.m_useAsDataProvider = otherConfig.m_useAsDataProvider;
	this.m_tagging = otherConfig.m_tagging.createMapByStringCopy();
	this.m_syncTypeForInitialization = otherConfig.m_syncTypeForInitialization;
	this.m_serviceType = otherConfig.m_serviceType;
	this.m_connectionContainer = otherConfig.m_connectionContainer;
	this.m_connectionName = otherConfig.m_connectionName;
};
oFF.DfServiceConfig.prototype.endSync = function()
{
	this.m_serviceTemporary = null;
	oFF.SyncActionExt.prototype.endSync.call( this );
};
oFF.DfServiceConfig.prototype.getApplication = function()
{
	return this.m_application;
};
oFF.DfServiceConfig.prototype.getComponentType = function()
{
	return oFF.RuntimeComponentType.SERVICE_DATA_PROVIDER;
};
oFF.DfServiceConfig.prototype.getConnectionContainer = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_connectionContainer);
};
oFF.DfServiceConfig.prototype.getConnectionName = function()
{
	return this.m_connectionName;
};
oFF.DfServiceConfig.prototype.getDataProviderName = function()
{
	return this.m_name;
};
oFF.DfServiceConfig.prototype.getMatchingServiceForServiceName = function(serviceReferenceName)
{
	return oFF.ServiceUtils.getMatchingService(this, serviceReferenceName, this);
};
oFF.DfServiceConfig.prototype.getName = function()
{
	return this.m_name;
};
oFF.DfServiceConfig.prototype.getRequestTimeZone = function()
{
	return this.m_requestTimeZone;
};
oFF.DfServiceConfig.prototype.getServiceTypeInfo = function()
{
	return this.m_serviceType;
};
oFF.DfServiceConfig.prototype.getSystemDescription = function()
{
	let application = this.getActionContext();
	let systemLandscape = application.getSystemLandscape();
	if (oFF.isNull(systemLandscape))
	{
		return null;
	}
	let systemName = this.getSystemName();
	if (oFF.isNull(systemName))
	{
		return systemLandscape.getMasterSystem();
	}
	return systemLandscape.getSystemDescription(systemName);
};
oFF.DfServiceConfig.prototype.getSystemName = function()
{
	if (oFF.isNull(this.m_systemName))
	{
		this.m_systemName = this.getApplication().getSystemLandscape().getMasterSystemName();
	}
	return this.m_systemName;
};
oFF.DfServiceConfig.prototype.getSystemType = function()
{
	return this.getSystemDescription().getSystemType();
};
oFF.DfServiceConfig.prototype.getTagging = function()
{
	return this.m_tagging;
};
oFF.DfServiceConfig.prototype.hasPrivateConnection = function()
{
	return this.m_usePrivateConnection;
};
oFF.DfServiceConfig.prototype.hasSystemNameSet = function()
{
	return oFF.notNull(this.m_systemName);
};
oFF.DfServiceConfig.prototype.isDataProviderUsage = function()
{
	return this.m_useAsDataProvider;
};
oFF.DfServiceConfig.prototype.isRequestTimeZoneSet = function()
{
	return oFF.notNull(this.m_requestTimeZone);
};
oFF.DfServiceConfig.prototype.isSystemBoundService = function()
{
	return true;
};
oFF.DfServiceConfig.prototype.onServerMetadataLoaded = function(extResult, serverMetadata, customIdentifier)
{
	this.addAllMessages(extResult);
	this.m_serverMetadata = extResult;
	if (this.isSystemBoundService() && this.m_serverMetadata.hasErrors())
	{
		this.endSync();
		return;
	}
	let syncType = this.m_syncTypeForInitialization;
	this.m_syncTypeForInitialization = null;
	let serviceTypeInfo = this.getServiceTypeInfo();
	let serviceReferenceName = oFF.isNull(serviceTypeInfo) ? null : serviceTypeInfo.getServiceReferenceName();
	this.m_serviceTemporary = this.getMatchingServiceForServiceName(serviceReferenceName);
	if (oFF.isNull(this.m_serviceTemporary))
	{
		this.addError(oFF.ErrorCodes.SERVICE_NOT_FOUND, serviceReferenceName);
		this.endSync();
		return;
	}
	if (this.m_serviceTemporary.requiresInitialization())
	{
		let syncAction = this.m_serviceTemporary.processInitialization(syncType, this, null);
		if (oFF.isNull(syncAction))
		{
			this.setDataFromService(this.m_serviceTemporary);
			this.endSync();
		}
	}
	else
	{
		this.setDataFromService(this.m_serviceTemporary);
		this.endSync();
	}
};
oFF.DfServiceConfig.prototype.onServiceInitialized = function(extResult, service, customIdentifier)
{
	this.addAllMessages(extResult);
	this.setDataFromService(this.m_serviceTemporary);
	this.endSync();
};
oFF.DfServiceConfig.prototype.prepareDefinition = function() {};
oFF.DfServiceConfig.prototype.processSyncAction = function(syncType, listener, customIdentifier)
{
	if (this.getSyncState().isInSync())
	{
		this.resetSyncState();
	}
	return oFF.SyncActionExt.prototype.processSyncAction.call( this , syncType, listener, customIdentifier);
};
oFF.DfServiceConfig.prototype.processSynchronization = function(syncType)
{
	this.m_syncTypeForInitialization = syncType;
	this.prepareDefinition();
	if (this.isSystemBoundService())
	{
		let systemDescription = this.getSystemDescription();
		if (oFF.isNull(systemDescription))
		{
			this.addError(0, oFF.XStringUtils.concatenate2("Cannot find system description: ", this.getSystemName()));
			return false;
		}
		if (oFF.isNull(this.m_connectionContainer))
		{
			let connectionPool = this.getActionContext().getConnectionPool();
			this.m_connectionContainer = oFF.XWeakReferenceUtil.getWeakRef(connectionPool.getConnectionExt(systemDescription.getSystemName(), this.m_usePrivateConnection, this.m_connectionName));
		}
		let connectionContainer = this.getConnectionContainer();
		if (syncType === oFF.SyncType.BLOCKING)
		{
			let serverMetadataExt = connectionContainer.getSystemConnect().getServerMetadataExt(syncType, null, null);
			this.onServerMetadataLoaded(serverMetadataExt, serverMetadataExt.getData(), null);
		}
		else
		{
			connectionContainer.getSystemConnect().getServerMetadataExt(syncType, this, null);
		}
	}
	else
	{
		this.onServerMetadataLoaded(null, null, null);
	}
	return true;
};
oFF.DfServiceConfig.prototype.releaseObjectInternal = function()
{
	if (!this.m_isConfigInRelease)
	{
		this.m_isConfigInRelease = true;
		if (this.m_useAsDataProvider)
		{
			this.m_application.unregisterDataProvider(this);
			let data = this.getData();
			data = oFF.XObjectExt.release(data);
			this.setData(data);
		}
		this.m_application = null;
		this.m_tagging = null;
		this.m_connectionContainer = null;
		this.m_connectionName = null;
		this.m_serverMetadata = null;
		this.m_serviceTemporary = oFF.XObjectExt.release(this.m_serviceTemporary);
		this.m_serviceType = null;
		this.m_syncTypeForInitialization = null;
		this.m_systemName = null;
		this.m_requestTimeZone = null;
	}
};
oFF.DfServiceConfig.prototype.setConnectionContainer = function(connectionContainer)
{
	this.m_connectionContainer = oFF.XWeakReferenceUtil.getWeakRef(connectionContainer);
};
oFF.DfServiceConfig.prototype.setConnectionName = function(name)
{
	this.m_connectionName = name;
};
oFF.DfServiceConfig.prototype.setDataProviderName = function(name)
{
	this.m_name = name;
};
oFF.DfServiceConfig.prototype.setDefaultTimeZone = function()
{
	this.m_requestTimeZone = oFF.XTimeZone.getCurrentTimeZoneString();
};
oFF.DfServiceConfig.prototype.setName = function(name)
{
	this.m_name = name;
};
oFF.DfServiceConfig.prototype.setRequestTimeZone = function(requestTimeZone)
{
	this.m_requestTimeZone = requestTimeZone;
};
oFF.DfServiceConfig.prototype.setServiceTypeInfo = function(serviceTypeInfo)
{
	this.m_serviceType = serviceTypeInfo;
};
oFF.DfServiceConfig.prototype.setSystemName = function(systemName)
{
	this.m_systemName = systemName;
};
oFF.DfServiceConfig.prototype.setUseAsDataProvider = function(useAsDataProvider)
{
	if (!this.m_useAsDataProvider && useAsDataProvider)
	{
		this.getApplication().registerDataProvider(this);
	}
	if (this.m_useAsDataProvider && !useAsDataProvider)
	{
		this.getApplication().unregisterDataProvider(this);
	}
	this.m_useAsDataProvider = useAsDataProvider;
	this.setAutoConvertDataToWeakRef(!useAsDataProvider);
};
oFF.DfServiceConfig.prototype.setupConfig = function(application)
{
	let listener = null;
	this.setupAction(null, listener, null, application);
	this.m_application = application;
	this.setAutoConvertDataToWeakRef(true);
	this.m_tagging = oFF.XHashMapByString.create();
};
oFF.DfServiceConfig.prototype.usePrivateConnection = function(usePrivateConnection)
{
	this.m_usePrivateConnection = usePrivateConnection;
};

oFF.DfServiceConfigClassic = function() {};
oFF.DfServiceConfigClassic.prototype = new oFF.DfServiceConfig();
oFF.DfServiceConfigClassic.prototype._ff_c = "DfServiceConfigClassic";

oFF.DfServiceConfigClassic.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	let myListener = listener;
	myListener.onServiceCreation(extResult, data, customIdentifier);
};
oFF.DfServiceConfigClassic.prototype.processServiceCreation = function(syncType, listener, customIdentifier)
{
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.DfServiceConfigClassic.prototype.setDataFromService = function(service)
{
	this.setData(service);
};

oFF.RuntimeModule = function() {};
oFF.RuntimeModule.prototype = new oFF.DfModule();
oFF.RuntimeModule.prototype._ff_c = "RuntimeModule";

oFF.RuntimeModule.LISTENER_SERVER_METADATA_VALID = null;
oFF.RuntimeModule.LISTENER_SERVICE_INCUBATOR = null;
oFF.RuntimeModule.XS_REPOSITORY = "REPOSITORY";
oFF.RuntimeModule.s_module = null;
oFF.RuntimeModule.getInstance = function()
{
	if (oFF.isNull(oFF.RuntimeModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.IoExtModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.KernelImplModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.KernelNativeModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.BindingModule.getInstance());
		oFF.RuntimeModule.s_module = oFF.DfModule.startExt(new oFF.RuntimeModule());
		let registrationService = oFF.RegistrationService.getInstance();
		oFF.RuntimeModule.LISTENER_SERVICE_INCUBATOR = oFF.XStringValue.create("IServiceCreationListener");
		oFF.RuntimeModule.LISTENER_SERVER_METADATA_VALID = oFF.XStringValue.create("IServerMetadataListener");
		oFF.RuntimeComponentType.staticSetupRuntimeComponentTypes();
		oFF.OlapEnvironmentFactory.staticSetup();
		oFF.RepoMountType.staticSetup();
		oFF.ApplicationSystemOption.staticSetup();
		oFF.RpcHttpFunctionFactory.staticSetup();
		oFF.BatchRequestManagerInAFactory.staticSetupBatchInAFactory();
		oFF.InAMergeProcessorSetupInitiator.staticSetup();
		oFF.NestedBatchRequestDecoratorProvider.staticSetup();
		registrationService.addReference(oFF.BatchRequestDecoratorFactory.BATCH_REQUEST_DECORATOR_PROVIDER, oFF.NestedBatchRequestDecoratorProvider.CLAZZ);
		oFF.DsrPassportFactory.staticSetup();
		oFF.ProgramRegistry.setProgramFactory(new oFF.StandardAppProgram());
		oFF.ProgramRegistry.setProgramFactory(new oFF.OrcaAppProgram());
		oFF.ProgramRegistry.setProgramFactory(new oFF.DragonflyAppProgram());
		oFF.ProgramRegistry.setProgramFactory(new oFF.OrcaLiteViewerAppProgram());
		oFF.ProgramRegistry.setProgramFactory(new oFF.GenericAppProgram());
		oFF.DfModule.stopExt(oFF.RuntimeModule.s_module);
	}
	return oFF.RuntimeModule.s_module;
};
oFF.RuntimeModule.prototype.getName = function()
{
	return "ff2100.runtime";
};

oFF.RuntimeModule.getInstance();

return oFF;
} );