/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff4305.olap.model"
],
function(oFF)
{
"use strict";

oFF.OuDataProviderFactory = function() {};
oFF.OuDataProviderFactory.prototype = new oFF.XObject();
oFF.OuDataProviderFactory.prototype._ff_c = "OuDataProviderFactory";

oFF.OuDataProviderFactory.CONTENT_LIB_CDATA = "cdata";
oFF.OuDataProviderFactory.CONTENT_LIB_CONTENT = "content";
oFF.OuDataProviderFactory.CONTENT_LIB_ENTITIES = "entities";
oFF.OuDataProviderFactory.DATA_SOURCE_KEY = "dataSource";
oFF.OuDataProviderFactory.INA_REPO_KEY = "inaRepo";
oFF.OuDataProviderFactory.SYSTEM_NAME_ALT_KEY = "system";
oFF.OuDataProviderFactory.SYSTEM_NAME_KEY = "systemName";
oFF.OuDataProviderFactory._getApplicationFromProcess = function(process)
{
	let currentProcess = process;
	let app = currentProcess.getApplication();
	while (oFF.isNull(app) && currentProcess.getParentProcess() !== null)
	{
		currentProcess = currentProcess.getParentProcess();
		app = currentProcess.getApplication();
	}
	let application = oFF.ApplicationFactory.createApplication(currentProcess);
	application.setSystemLandscape(process.getSystemLandscape());
	return application;
};
oFF.OuDataProviderFactory._getInsightContent = function(insightContent)
{
	if (oFF.notNull(insightContent))
	{
		if (oFF.OuDataProviderFactory._isContentLibJson(insightContent))
		{
			return oFF.OuDataProviderFactory._getInsightContentFromContentLibJson(insightContent);
		}
		else
		{
			return insightContent;
		}
	}
	return null;
};
oFF.OuDataProviderFactory._getInsightContentFromContentLibJson = function(insightContent)
{
	let cdataStruct = insightContent.containsKey(oFF.OuDataProviderFactory.CONTENT_LIB_CDATA) ? insightContent.getStructureByKey(oFF.OuDataProviderFactory.CONTENT_LIB_CDATA) : insightContent;
	if (cdataStruct.containsKey(oFF.OuDataProviderFactory.CONTENT_LIB_CONTENT))
	{
		let contentStruct = cdataStruct.getStructureByKey(oFF.OuDataProviderFactory.CONTENT_LIB_CONTENT);
		if (contentStruct.containsKey(oFF.OuDataProviderFactory.CONTENT_LIB_ENTITIES))
		{
			let entitiesList = contentStruct.getListByKey(oFF.OuDataProviderFactory.CONTENT_LIB_ENTITIES);
			if (entitiesList.hasElements())
			{
				return entitiesList.getStructureAt(0);
			}
		}
	}
	return null;
};
oFF.OuDataProviderFactory._isContentLibJson = function(insightContent)
{
	return oFF.XCollectionUtils.hasElements(insightContent) && insightContent.containsKey(oFF.OuDataProviderFactory.CONTENT_LIB_CDATA) || insightContent.containsKey(oFF.OuDataProviderFactory.CONTENT_LIB_CONTENT);
};
oFF.OuDataProviderFactory._loadActionManifests = function(config, process)
{
	if (!config.isLoadingActionManifests())
	{
		return oFF.XPromise.resolve(null);
	}
	return oFF.OuDataProviderActionManifestLoader.loadActionManifests(process).onThenExt((result) => {
		let empty = null;
		return empty;
	}).onCatchExt((err) => {
		oFF.XLogger.println(err.getText());
		return null;
	});
};
oFF.OuDataProviderFactory.createDataProviderFromFile = function(process, dpName, filePath, dpConfig)
{
	if (oFF.isNull(process))
	{
		return oFF.XPromise.reject(oFF.XError.create("Missing process!"));
	}
	let fileToLoad = oFF.XFile.create(process, filePath);
	let loadStructurePromise = oFF.XFilePromise.loadJsonStructure(fileToLoad);
	return loadStructurePromise.onThenPromise((fileStructure) => {
		return oFF.OuDataProviderFactory.createDataProviderFromFileContent(process, dpName, fileStructure);
	});
};
oFF.OuDataProviderFactory.createDataProviderFromFileContent = function(process, dpName, fileStructure)
{
	let contentStructure = oFF.OuDataProviderFactory._getInsightContent(fileStructure);
	if (oFF.isNull(contentStructure))
	{
		throw oFF.XException.createException("Missing file structure!");
	}
	let systemName;
	let fullQualifiedDataSourceName;
	let inaRepoJson;
	systemName = contentStructure.getStringByKey(oFF.OuDataProviderFactory.SYSTEM_NAME_KEY);
	if (oFF.XStringUtils.isNullOrEmpty(systemName))
	{
		systemName = contentStructure.getStringByKey(oFF.OuDataProviderFactory.SYSTEM_NAME_ALT_KEY);
	}
	fullQualifiedDataSourceName = contentStructure.getStringByKey(oFF.OuDataProviderFactory.DATA_SOURCE_KEY);
	inaRepoJson = contentStructure.getStructureByKey(oFF.OuDataProviderFactory.INA_REPO_KEY);
	if (oFF.XStringUtils.isNullOrEmpty(systemName))
	{
		throw oFF.XException.createException("Missing system name!");
	}
	if (oFF.XStringUtils.isNullOrEmpty(fullQualifiedDataSourceName))
	{
		throw oFF.XException.createException("Missing data source!");
	}
	let application = oFF.OuDataProviderFactory._getApplicationFromProcess(process);
	let dataSource = oFF.QFactory.createDataSource();
	dataSource.setSystemName(systemName);
	dataSource.setFullQualifiedName(fullQualifiedDataSourceName);
	let dpCreateConfiguration = oFF.OuDataProviderConfiguration.createConfig(application, dataSource);
	dpCreateConfiguration.setDataProviderName(dpName);
	dpCreateConfiguration.setLoadingActionManifests(false);
	dpCreateConfiguration.setStartAsConnected(true);
	dpCreateConfiguration.setRepoDeltaEnabled(true);
	dpCreateConfiguration.getStartConnection().setRepoJson(inaRepoJson);
	dpCreateConfiguration.getStartConnection().setStartWithAutoFetch(true);
	return oFF.OuDataProviderFactory.createDataProviderFromSource(dpCreateConfiguration);
};
oFF.OuDataProviderFactory.createDataProviderFromQueryManager = function(queryManager, configuration)
{
	return oFF.OuDataProviderFactory._loadActionManifests(configuration, queryManager.getProcess()).onThenExt((empty) => {
		return oFF.OuDataProvider.createDataProviderWithQueryManager(queryManager, configuration);
	});
};
oFF.OuDataProviderFactory.createDataProviderFromSource = function(configuration)
{
	return oFF.OuDataProviderFactory._loadActionManifests(configuration, configuration.getApplication().getProcess()).onThenPromise((result) => {
		let dataProvider = oFF.OuDataProvider.createDataProvider(configuration);
		if (!configuration.isStartAsConnected())
		{
			return oFF.XPromise.resolve(dataProvider);
		}
		let lifecycleActions = dataProvider.getActions().getLifecycleActions();
		return lifecycleActions.reconnectDataProvider(false).onThenExt((empty) => {
			return dataProvider;
		});
	});
};
oFF.OuDataProviderFactory.staticSetup = function()
{
	oFF.DataProviderFactoryDelegate.getInstance().registerFactory(new oFF.OuDataProviderFactory());
};
oFF.OuDataProviderFactory.prototype.createDataProviderFromProcess = function(process, dpName, systemName, fullQualifiedDataSourceName, dpConfig)
{
	let app = oFF.OuDataProviderFactory._getApplicationFromProcess(process);
	let config = oFF.OuDataProviderConfiguration.createConfigFromJson(app, dpConfig);
	config.setDataProviderName(dpName);
	config.setForceLoggingEnabled(true);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(systemName) && oFF.XStringUtils.isNotNullAndNotEmpty(fullQualifiedDataSourceName))
	{
		config.getStartConnection().setSystemName(systemName);
		config.getStartConnection().setDataSourceName(fullQualifiedDataSourceName);
	}
	return oFF.OuDataProviderFactory._loadActionManifests(config, process).onThenPromise((result) => {
		let dataProvider = oFF.OuDataProvider.createDataProvider(config);
		if (!config.isStartAsConnected())
		{
			return oFF.XPromise.resolve(dataProvider);
		}
		let lifecycleActions = dataProvider.getActions().getLifecycleActions();
		return lifecycleActions.connectDataProvider(null, false).onThenExt((empty) => {
			return dataProvider;
		});
	});
};

oFF.OuDataProviderOlapAccess = {

	getOlapInterface:function(dataProvider)
	{
			return dataProvider;
	}
};

oFF.OuDataProviderActionConstants = {

	PARAM_AXIS_TYPE_NAME:"axisTypeName",
	PARAM_CHART_TYPE_NAME:"chartTypeName",
	PARAM_COMPARISON_OPERATOR:"comparisonOperator",
	PARAM_DIMENSION_NAME:"dimensionName",
	PARAM_MEMBER_NAME:"memberName",
	PARAM_PROTOCOL_BINDING_TYPE:"protocolBindingType",
	PARAM_VIZ_NAME:"vizName",
	PARAM_VIZ_TYPE_NAME:"vizTypeName"
};

oFF.OdpActionParameterConverter = function() {};
oFF.OdpActionParameterConverter.prototype = new oFF.XObject();
oFF.OdpActionParameterConverter.prototype._ff_c = "OdpActionParameterConverter";

oFF.OdpActionParameterConverter.create = function(dataProvider)
{
	let obj = new oFF.OdpActionParameterConverter();
	obj.setupExt(dataProvider);
	return obj;
};
oFF.OdpActionParameterConverter.prototype.m_dataProvider = null;
oFF.OdpActionParameterConverter.prototype.fromAxisType = function(value)
{
	return oFF.DfNameObject.getSafeName(value);
};
oFF.OdpActionParameterConverter.prototype.fromBoolean = function(value)
{
	return oFF.XBoolean.convertToString(value);
};
oFF.OdpActionParameterConverter.prototype.fromChartType = function(value)
{
	return oFF.DfNameObject.getSafeName(value);
};
oFF.OdpActionParameterConverter.prototype.fromComparisonOperator = function(value)
{
	return oFF.DfNameObject.getSafeName(value);
};
oFF.OdpActionParameterConverter.prototype.fromDimension = function(value)
{
	return oFF.DfNameObject.getSafeName(value);
};
oFF.OdpActionParameterConverter.prototype.fromFieldContainerDisplay = function(value)
{
	return oFF.DfNameObject.getSafeName(value);
};
oFF.OdpActionParameterConverter.prototype.fromFieldContainerKeyDisplay = function(value)
{
	return oFF.DfNameObject.getSafeName(value);
};
oFF.OdpActionParameterConverter.prototype.fromMemberReadMode = function(memberReadMode)
{
	return oFF.DfNameObject.getSafeName(memberReadMode);
};
oFF.OdpActionParameterConverter.prototype.fromModelLevel = function(value)
{
	return oFF.DfNameObject.getSafeName(value);
};
oFF.OdpActionParameterConverter.prototype.fromPresentationType = function(value)
{
	return oFF.DfNameObject.getSafeName(value);
};
oFF.OdpActionParameterConverter.prototype.fromProtocolBindingType = function(value)
{
	return oFF.DfNameObject.getSafeName(value);
};
oFF.OdpActionParameterConverter.prototype.fromResultAlignment = function(value)
{
	return oFF.DfNameObject.getSafeName(value);
};
oFF.OdpActionParameterConverter.prototype.fromResultStructureElement = function(value)
{
	return oFF.DfNameObject.getSafeName(value);
};
oFF.OdpActionParameterConverter.prototype.fromResultVisibility = function(value)
{
	return oFF.DfNameObject.getSafeName(value);
};
oFF.OdpActionParameterConverter.prototype.fromStructure = function(value)
{
	return oFF.PrUtils.serialize(value, false, false, 0);
};
oFF.OdpActionParameterConverter.prototype.fromVisualizationType = function(value)
{
	return oFF.DfNameObject.getSafeName(value);
};
oFF.OdpActionParameterConverter.prototype.fromZeroSuppressionType = function(value)
{
	return oFF.DfNameObject.getSafeName(value);
};
oFF.OdpActionParameterConverter.prototype.releaseObject = function()
{
	this.m_dataProvider = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OdpActionParameterConverter.prototype.setupExt = function(dataProvider)
{
	this.m_dataProvider = dataProvider;
};
oFF.OdpActionParameterConverter.prototype.toAxisType = function(stringValue)
{
	return oFF.notNull(stringValue) ? oFF.AxisType.lookup(stringValue) : null;
};
oFF.OdpActionParameterConverter.prototype.toBoolean = function(stringValue, defaultValue)
{
	return oFF.notNull(stringValue) ? oFF.XBoolean.convertFromString(stringValue) : defaultValue;
};
oFF.OdpActionParameterConverter.prototype.toChartType = function(stringValue)
{
	return oFF.notNull(stringValue) ? oFF.ChartType.lookup(stringValue) : null;
};
oFF.OdpActionParameterConverter.prototype.toComparisonOperator = function(stringValue)
{
	return oFF.notNull(stringValue) ? oFF.ComparisonOperator.lookup(stringValue) : null;
};
oFF.OdpActionParameterConverter.prototype.toDimension = function(stringValue)
{
	if (oFF.isNull(stringValue) || this.m_dataProvider.getQueryManager() === null)
	{
		return null;
	}
	return this.m_dataProvider.getQueryManager().getQueryModel().getDimensionByName(stringValue);
};
oFF.OdpActionParameterConverter.prototype.toFieldContainerDisplay = function(stringValue)
{
	return oFF.notNull(stringValue) ? oFF.FieldContainerDisplay.lookup(stringValue) : null;
};
oFF.OdpActionParameterConverter.prototype.toFieldContainerKeyDisplay = function(stringValue)
{
	return oFF.notNull(stringValue) ? oFF.FieldContainerKeyDisplay.lookup(stringValue) : null;
};
oFF.OdpActionParameterConverter.prototype.toMemberReadMode = function(stringValue)
{
	return oFF.notNull(stringValue) ? oFF.QMemberReadMode.lookup(stringValue) : null;
};
oFF.OdpActionParameterConverter.prototype.toModelLevel = function(stringValue)
{
	return oFF.notNull(stringValue) ? oFF.QModelLevel.lookup(stringValue) : null;
};
oFF.OdpActionParameterConverter.prototype.toPresentationType = function(stringValue)
{
	return oFF.notNull(stringValue) ? oFF.PresentationType.lookup(stringValue) : null;
};
oFF.OdpActionParameterConverter.prototype.toProtocolBindingType = function(stringValue)
{
	return oFF.notNull(stringValue) ? oFF.ProtocolBindingType.lookup(stringValue) : null;
};
oFF.OdpActionParameterConverter.prototype.toResultAlignment = function(stringValue)
{
	return oFF.notNull(stringValue) ? oFF.ResultAlignment.lookup(stringValue) : null;
};
oFF.OdpActionParameterConverter.prototype.toResultStructureElement = function(stringValue)
{
	return oFF.notNull(stringValue) ? oFF.ResultStructureElement.lookup(stringValue) : null;
};
oFF.OdpActionParameterConverter.prototype.toResultVisibility = function(stringValue)
{
	return oFF.notNull(stringValue) ? oFF.ResultVisibility.lookup(stringValue) : null;
};
oFF.OdpActionParameterConverter.prototype.toStructure = function(stringValue)
{
	return oFF.notNull(stringValue) ? oFF.PrUtils.deserialize(stringValue).asStructure() : null;
};
oFF.OdpActionParameterConverter.prototype.toVisualizationType = function(stringValue)
{
	return oFF.notNull(stringValue) ? oFF.VisualizationType.lookup(stringValue) : null;
};
oFF.OdpActionParameterConverter.prototype.toZeroSuppressionType = function(stringValue)
{
	return oFF.notNull(stringValue) ? oFF.ZeroSuppressionType.lookup(stringValue) : null;
};

oFF.OuDpQueryMetadataAnalyzer = function() {};
oFF.OuDpQueryMetadataAnalyzer.prototype = new oFF.XObject();
oFF.OuDpQueryMetadataAnalyzer.prototype._ff_c = "OuDpQueryMetadataAnalyzer";

oFF.OuDpQueryMetadataAnalyzer.ACCOUNT_DIMENSION = "Account dimension";
oFF.OuDpQueryMetadataAnalyzer.AFFECTED_VARIABLES = "affectedVariables";
oFF.OuDpQueryMetadataAnalyzer.BOOKED_READ_MODE = "bookedReadMode";
oFF.OuDpQueryMetadataAnalyzer.CONDITIONS = "Conditions";
oFF.OuDpQueryMetadataAnalyzer.CUSTOM_VARIABLE = "customVariable";
oFF.OuDpQueryMetadataAnalyzer.DEPENDENT_VARIABLE_NAMES = "dependentVariableNames";
oFF.OuDpQueryMetadataAnalyzer.DIMENSIONS = "Dimensions";
oFF.OuDpQueryMetadataAnalyzer.DIMENSION_NAMES = "Dimension names";
oFF.OuDpQueryMetadataAnalyzer.DIMENSION_TYPES = "Dimension types";
oFF.OuDpQueryMetadataAnalyzer.DIM_MEMBER_VARIABLES = "Dimension member variables";
oFF.OuDpQueryMetadataAnalyzer.DIM_WITH_ACTIVE_HIERARCHY = "Dimensions with active hierarchy";
oFF.OuDpQueryMetadataAnalyzer.DIM_WITH_BOOKED_READ_MODE = "Dimensions with booked read mode";
oFF.OuDpQueryMetadataAnalyzer.DIM_WITH_MASTER_READ_MODE = "Dimensions with master read mode";
oFF.OuDpQueryMetadataAnalyzer.DIM_WITH_TIME_DEPENDENT_HIERARCHY = "Dimensions with time dependent hierarchy";
oFF.OuDpQueryMetadataAnalyzer.DIM_WITH_VERSION_DEPENDENT_HIERARCHY = "Dimensions with version dependent hierarchy";
oFF.OuDpQueryMetadataAnalyzer.DYNAMIC_FILTER = "Dynamic filter";
oFF.OuDpQueryMetadataAnalyzer.DYNAMIC_OR_EXIT_VARIABLE = "dynamicOrExitVariable";
oFF.OuDpQueryMetadataAnalyzer.EXCEPTIONS = "Exceptions";
oFF.OuDpQueryMetadataAnalyzer.EXIT_VARIABLES = "Exit variables";
oFF.OuDpQueryMetadataAnalyzer.FIXED_FILTER = "Fixed filter";
oFF.OuDpQueryMetadataAnalyzer.FORMULA_VARIABLES = "Formula variables";
oFF.OuDpQueryMetadataAnalyzer.FULL_QUERY_NAME = "Full query name";
oFF.OuDpQueryMetadataAnalyzer.HIERARCHY_ACTIVE = "hierarchyActive";
oFF.OuDpQueryMetadataAnalyzer.HIERARCHY_NAME = "hierarchyName";
oFF.OuDpQueryMetadataAnalyzer.HIERARCHY_NAME_VARIABLES = "Hierarchy name variables";
oFF.OuDpQueryMetadataAnalyzer.HIERARCHY_TIME_DEPENDENT = "hierarchyTimeDependent";
oFF.OuDpQueryMetadataAnalyzer.HIERARCHY_VERSION_DEPENDENT = "hierarchyVersionDependent";
oFF.OuDpQueryMetadataAnalyzer.INITIAL_VALUE_ALLOWED = "initialValueAllowed";
oFF.OuDpQueryMetadataAnalyzer.KEY_FIELD = "keyField";
oFF.OuDpQueryMetadataAnalyzer.MANDATORY = "mandatory";
oFF.OuDpQueryMetadataAnalyzer.MASTER_READ_MODE = "masterReadMode";
oFF.OuDpQueryMetadataAnalyzer.MEASURE_MEMBER_TYPES = "Measure member types";
oFF.OuDpQueryMetadataAnalyzer.NAME = "name";
oFF.OuDpQueryMetadataAnalyzer.OPTION_LIST_VARIABLES = "Option list variables";
oFF.OuDpQueryMetadataAnalyzer.PLANNING_QUERY = "Planning query";
oFF.OuDpQueryMetadataAnalyzer.READ_MODES = "Read modes";
oFF.OuDpQueryMetadataAnalyzer.SECONDARY_STRUCTURE = "Secondary structure";
oFF.OuDpQueryMetadataAnalyzer.SIMPLE_TYPE_VARIABLES = "Simple type variables";
oFF.OuDpQueryMetadataAnalyzer.SYSTEM = "System";
oFF.OuDpQueryMetadataAnalyzer.TEXT = "text";
oFF.OuDpQueryMetadataAnalyzer.TEXT_VARIABLES = "Text variables";
oFF.OuDpQueryMetadataAnalyzer.VARIABLES = "Variables";
oFF.OuDpQueryMetadataAnalyzer.VARIABLE_TYPE = "variableType";
oFF.OuDpQueryMetadataAnalyzer.create = function()
{
	return new oFF.OuDpQueryMetadataAnalyzer();
};
oFF.OuDpQueryMetadataAnalyzer.prototype._getDimensionInfo = function(dimension)
{
	let properties = oFF.PrStructure.create();
	properties.putString(oFF.OuDpQueryMetadataAnalyzer.NAME, dimension.getName());
	properties.putString(oFF.OuDpQueryMetadataAnalyzer.TEXT, oFF.XStringUtils.escapeCodeString(dimension.getText()));
	properties.putString(oFF.OuDpQueryMetadataAnalyzer.KEY_FIELD, dimension.getKeyField() === null ? "null" : dimension.getKeyField().getName());
	properties.putString(oFF.OuDpQueryMetadataAnalyzer.HIERARCHY_NAME, dimension.getHierarchyName());
	properties.putBoolean(oFF.OuDpQueryMetadataAnalyzer.HIERARCHY_ACTIVE, dimension.isHierarchyActive());
	properties.putBoolean(oFF.OuDpQueryMetadataAnalyzer.HIERARCHY_TIME_DEPENDENT, dimension.hasTimeDependentHierarchies());
	properties.putBoolean(oFF.OuDpQueryMetadataAnalyzer.HIERARCHY_VERSION_DEPENDENT, dimension.hasVersionDependentHierarchies());
	properties.putBoolean(oFF.OuDpQueryMetadataAnalyzer.MASTER_READ_MODE, dimension.supportsReadMode(oFF.QContextType.RESULT_SET, oFF.QMemberReadMode.MASTER));
	properties.putBoolean(oFF.OuDpQueryMetadataAnalyzer.BOOKED_READ_MODE, dimension.supportsReadMode(oFF.QContextType.RESULT_SET, oFF.QMemberReadMode.BOOKED) || dimension.supportsReadMode(oFF.QContextType.RESULT_SET, oFF.QMemberReadMode.BOOKED_AND_SPACE) || dimension.supportsReadMode(oFF.QContextType.RESULT_SET, oFF.QMemberReadMode.BOOKED_AND_SPACE_AND_STATE));
	return properties;
};
oFF.OuDpQueryMetadataAnalyzer.prototype._getVariableInfo = function(variable)
{
	let properties = oFF.PrStructure.create();
	properties.putString(oFF.OuDpQueryMetadataAnalyzer.NAME, variable.getName());
	properties.putString(oFF.OuDpQueryMetadataAnalyzer.TEXT, oFF.XStringUtils.escapeCodeString(variable.getText()));
	let affectedVars = oFF.PrFactory.createList().addAllStrings(oFF.XCollectionUtils.map(variable.getAffectedVariables(), (_var) => {
		return _var.getName();
	}));
	properties.put(oFF.OuDpQueryMetadataAnalyzer.AFFECTED_VARIABLES, affectedVars);
	properties.putString(oFF.OuDpQueryMetadataAnalyzer.DEPENDENT_VARIABLE_NAMES, oFF.XCollectionUtils.join(variable.getDependentVariablesNames(), ", "));
	properties.putString(oFF.OuDpQueryMetadataAnalyzer.VARIABLE_TYPE, variable.getVariableType().toString());
	properties.putBoolean(oFF.OuDpQueryMetadataAnalyzer.INITIAL_VALUE_ALLOWED, variable.isInitialValueAllowed());
	properties.putBoolean(oFF.OuDpQueryMetadataAnalyzer.CUSTOM_VARIABLE, variable.isCustomVariable());
	properties.putBoolean(oFF.OuDpQueryMetadataAnalyzer.DYNAMIC_OR_EXIT_VARIABLE, variable.isDynamicOrExitVariable());
	properties.putBoolean(oFF.OuDpQueryMetadataAnalyzer.MANDATORY, variable.isMandatory());
	return properties;
};
oFF.OuDpQueryMetadataAnalyzer.prototype.analyze = function(queryModel)
{
	if (oFF.isNull(queryModel))
	{
		throw oFF.XException.createIllegalStateException("Query model is not available for analysis");
	}
	let result = oFF.PrFactory.createStructure();
	let dataSource = queryModel.getDataSource();
	let variables = queryModel.getVariables();
	let variableTypes = oFF.XStream.of(variables).map((variable) => {
		return variable.getVariableType();
	}).distinct().collect(oFF.XStreamCollector.toList());
	let dimensions = queryModel.getDimensions();
	let memberTypes = oFF.PrFactory.createList().addAllStrings(oFF.XStream.of(dimensions).filter((dim1) => {
		return dim1.getKeyField() !== null;
	}).map((dim2) => {
		return dim2.getKeyField().getValueType();
	}).distinct().collect(oFF.XStreamCollector.toListOfString((valueType) => {
		return valueType.toString();
	})));
	let dimWithActiveHierarchy = oFF.PrFactory.createList().addAllStrings(oFF.XStream.of(dimensions).filter((dim3) => {
		return dim3.isHierarchyActive() && oFF.XStringUtils.isNotNullAndNotEmpty(dim3.getHierarchyName());
	}).collect(oFF.XStreamCollector.toListOfString((dim4) => {
		return dim4.getName();
	})));
	let readModeTypes = oFF.PrFactory.createList().addAllStrings(oFF.XStream.of(dimensions).map((dim5) => {
		return dim5.getSupportedReadModes(oFF.QContextType.RESULT_SET);
	}).flatMap((readModes) => {
		return oFF.XStream.of(readModes);
	}).distinct().collect(oFF.XStreamCollector.toListOfString((readMode) => {
		return readMode.getName();
	})));
	let measureDimension = queryModel.getMeasureDimension();
	let measureMemberTypes = oFF.PrFactory.createList().addAllStrings(oFF.XStream.of(oFF.notNull(measureDimension) ? measureDimension.getAllStructureMembers() : null).map((member1) => {
		return member1.getMemberType();
	}).distinct().collect(oFF.XStreamCollector.toListOfString((member2) => {
		return member2.getName();
	})));
	result.putString(oFF.OuDpQueryMetadataAnalyzer.FULL_QUERY_NAME, dataSource.getFullQualifiedName());
	result.putString(oFF.OuDpQueryMetadataAnalyzer.SYSTEM, dataSource.getSystemName());
	result.putBoolean(oFF.OuDpQueryMetadataAnalyzer.VARIABLES, variableTypes.hasElements());
	result.putBoolean(oFF.OuDpQueryMetadataAnalyzer.DIM_MEMBER_VARIABLES, oFF.XCollectionUtils.contains(variableTypes, (vt1) => {
		return vt1.isTypeOf(oFF.VariableType.DIMENSION_MEMBER_VARIABLE);
	}));
	result.putBoolean(oFF.OuDpQueryMetadataAnalyzer.HIERARCHY_NAME_VARIABLES, oFF.XCollectionUtils.contains(variableTypes, (vt2) => {
		return vt2.isTypeOf(oFF.VariableType.HIERARCHY_NAME_VARIABLE);
	}));
	result.putBoolean(oFF.OuDpQueryMetadataAnalyzer.SIMPLE_TYPE_VARIABLES, oFF.XCollectionUtils.contains(variableTypes, (vt3) => {
		return vt3.isTypeOf(oFF.VariableType.SIMPLE_TYPE_VARIABLE);
	}));
	result.putBoolean(oFF.OuDpQueryMetadataAnalyzer.TEXT_VARIABLES, oFF.XCollectionUtils.contains(variableTypes, (vt4) => {
		return vt4.isTypeOf(oFF.VariableType.TEXT_VARIABLE);
	}));
	result.putBoolean(oFF.OuDpQueryMetadataAnalyzer.FORMULA_VARIABLES, oFF.XCollectionUtils.contains(variableTypes, (vt5) => {
		return vt5.isTypeOf(oFF.VariableType.FORMULA_VARIABLE);
	}));
	result.putBoolean(oFF.OuDpQueryMetadataAnalyzer.OPTION_LIST_VARIABLES, oFF.XCollectionUtils.contains(variableTypes, (vt6) => {
		return vt6.isTypeOf(oFF.VariableType.OPTION_LIST_VARIABLE);
	}));
	result.putBoolean(oFF.OuDpQueryMetadataAnalyzer.DYNAMIC_FILTER, queryModel.getFilter().getDynamicFilter().getFilterRootElement() !== null);
	result.putBoolean(oFF.OuDpQueryMetadataAnalyzer.FIXED_FILTER, queryModel.getFilter().getFixedFilter().getFilterRootElement() !== null);
	result.put(oFF.OuDpQueryMetadataAnalyzer.DIMENSION_TYPES, memberTypes);
	result.put(oFF.OuDpQueryMetadataAnalyzer.DIM_WITH_ACTIVE_HIERARCHY, dimWithActiveHierarchy);
	result.putBoolean(oFF.OuDpQueryMetadataAnalyzer.DIM_WITH_ACTIVE_HIERARCHY, oFF.XCollectionUtils.contains(dimensions, (dimension) => {
		return dimension.isHierarchyActive() && oFF.XStringUtils.isNotNullAndNotEmpty(dimension.getHierarchyName());
	}));
	result.put(oFF.OuDpQueryMetadataAnalyzer.READ_MODES, readModeTypes);
	result.put(oFF.OuDpQueryMetadataAnalyzer.MEASURE_MEMBER_TYPES, measureMemberTypes);
	result.putBoolean(oFF.OuDpQueryMetadataAnalyzer.ACCOUNT_DIMENSION, queryModel.getAccountDimension() !== null);
	result.putBoolean(oFF.OuDpQueryMetadataAnalyzer.SECONDARY_STRUCTURE, queryModel.getNonMeasureDimension() !== null);
	result.putBoolean(oFF.OuDpQueryMetadataAnalyzer.CONDITIONS, queryModel.getConditionManager().hasConditions());
	result.putBoolean(oFF.OuDpQueryMetadataAnalyzer.EXCEPTIONS, queryModel.getExceptionManager().hasElements());
	result.putBoolean(oFF.OuDpQueryMetadataAnalyzer.PLANNING_QUERY, queryModel.isPlanning() || queryModel.getQueryManager().isDataEntryEnabled());
	result.putBoolean(oFF.OuDpQueryMetadataAnalyzer.EXIT_VARIABLES, oFF.XCollectionUtils.contains(variables, (_var) => {
		return _var.isDynamicOrExitVariable();
	}));
	let dimTimeDepHierarchy = oFF.PrFactory.createList().addAllStrings(oFF.XStream.of(dimensions).filter((dim6) => {
		return dim6.hasTimeDependentHierarchies();
	}).collect(oFF.XStreamCollector.toListOfString((dim7) => {
		return dim7.getName();
	})));
	let dimVersionDepHierarchy = oFF.PrFactory.createList().addAllStrings(oFF.XStream.of(dimensions).filter((dim8) => {
		return dim8.hasVersionDependentHierarchies();
	}).collect(oFF.XStreamCollector.toListOfString((dim9) => {
		return dim9.getName();
	})));
	let dimReadModeMaster = oFF.PrFactory.createList().addAllStrings(oFF.XStream.of(dimensions).filter((dim10) => {
		return dim10.supportsReadMode(oFF.QContextType.RESULT_SET, oFF.QMemberReadMode.MASTER);
	}).collect(oFF.XStreamCollector.toListOfString((dim11) => {
		return dim11.getName();
	})));
	let dimReadModeBooked = oFF.PrFactory.createList().addAllStrings(oFF.XStream.of(dimensions).filter((dim12) => {
		return dim12.supportsReadMode(oFF.QContextType.RESULT_SET, oFF.QMemberReadMode.BOOKED) || dim12.supportsReadMode(oFF.QContextType.RESULT_SET, oFF.QMemberReadMode.BOOKED_AND_SPACE) || dim12.supportsReadMode(oFF.QContextType.RESULT_SET, oFF.QMemberReadMode.BOOKED_AND_SPACE_AND_STATE);
	}).collect(oFF.XStreamCollector.toListOfString((dim13) => {
		return dim13.getName();
	})));
	result.put(oFF.OuDpQueryMetadataAnalyzer.DIMENSION_NAMES, oFF.PrFactory.createList().addAllStrings(queryModel.getDimensionNames()));
	result.put(oFF.OuDpQueryMetadataAnalyzer.DIM_WITH_TIME_DEPENDENT_HIERARCHY, dimTimeDepHierarchy);
	result.put(oFF.OuDpQueryMetadataAnalyzer.DIM_WITH_VERSION_DEPENDENT_HIERARCHY, dimVersionDepHierarchy);
	result.put(oFF.OuDpQueryMetadataAnalyzer.DIM_WITH_MASTER_READ_MODE, dimReadModeMaster);
	result.put(oFF.OuDpQueryMetadataAnalyzer.DIM_WITH_BOOKED_READ_MODE, dimReadModeBooked);
	let dimensionsInfo = oFF.PrFactory.createList();
	dimensionsInfo.addAll(oFF.XCollectionUtils.map(dimensions, this._getDimensionInfo.bind(this)));
	result.put(oFF.OuDpQueryMetadataAnalyzer.DIMENSIONS, dimensionsInfo);
	let variablesInfo = oFF.PrFactory.createList();
	variablesInfo.addAll(oFF.XCollectionUtils.map(variables, this._getVariableInfo.bind(this)));
	result.put(oFF.OuDpQueryMetadataAnalyzer.VARIABLES, variablesInfo);
	return oFF.XStringValue.create(result.getStringRepresentation());
};

oFF.OuDataProviderLifecycleUtils = {

};

oFF.OuDpVizActionVizDefinition = function() {};
oFF.OuDpVizActionVizDefinition.prototype = new oFF.XObject();
oFF.OuDpVizActionVizDefinition.prototype._ff_c = "OuDpVizActionVizDefinition";

oFF.OuDpVizActionVizDefinition.createDefinition = function(vizName, vizType, protocolType, chartType)
{
	let obj = new oFF.OuDpVizActionVizDefinition();
	obj.setupExt(vizName, vizType, protocolType, chartType);
	return obj;
};
oFF.OuDpVizActionVizDefinition.createDefinitionFromParameterList = function(dataProvider, parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(dataProvider);
	let vizName = parameters.get(0);
	let vizType = converter.toVisualizationType(parameters.get(1));
	let protocolBindingType = parameters.size() >= 3 ? converter.toProtocolBindingType(parameters.get(2)) : null;
	let chartType = parameters.size() >= 4 ? converter.toChartType(parameters.get(3)) : null;
	return oFF.OuDpVizActionVizDefinition.createDefinition(vizName, vizType, protocolBindingType, chartType);
};
oFF.OuDpVizActionVizDefinition.prototype.m_chartType = null;
oFF.OuDpVizActionVizDefinition.prototype.m_protocolType = null;
oFF.OuDpVizActionVizDefinition.prototype.m_vizName = null;
oFF.OuDpVizActionVizDefinition.prototype.m_vizType = null;
oFF.OuDpVizActionVizDefinition.prototype._applyChartType = function(definition, vizType, chartType)
{
	if (oFF.notNull(chartType) && vizType === oFF.VisualizationType.CHART && oFF.notNull(definition))
	{
		let chartDefinition = definition;
		chartDefinition.getChartSetting().setChartType(chartType);
	}
};
oFF.OuDpVizActionVizDefinition.prototype.convertToFireflyDefinition = function(vizManager)
{
	let definition = vizManager.getOrCreateVisualisationDefinition(this.m_vizName, this.m_protocolType, this.m_vizType.getSemanticBindingType());
	this._applyChartType(definition, this.m_vizType, this.m_chartType);
	return definition;
};
oFF.OuDpVizActionVizDefinition.prototype.convertToParameterList = function(dataProvider)
{
	let converter = oFF.OdpActionParameterConverter.create(dataProvider);
	let parameters = oFF.XList.create();
	parameters.add(this.m_vizName);
	parameters.add(converter.fromVisualizationType(this.m_vizType));
	parameters.add(converter.fromProtocolBindingType(this.m_protocolType));
	parameters.add(converter.fromChartType(this.m_chartType));
	return parameters;
};
oFF.OuDpVizActionVizDefinition.prototype.convertToStructure = function()
{
	let vizJson = oFF.PrFactory.createStructure();
	vizJson.putString(oFF.OuDataProviderConfiguration.VIZ_NAME, this.m_vizName);
	vizJson.putStringNotNull(oFF.OuDataProviderConfiguration.VIZ_TYPE, oFF.DfNameObject.getSafeName(this.m_vizType));
	vizJson.putStringNotNull(oFF.OuDataProviderConfiguration.VIZ_PROTOCOL, oFF.DfNameObject.getSafeName(this.m_protocolType));
	vizJson.putStringNotNull(oFF.OuDataProviderConfiguration.VIZ_CHART_TYPE, oFF.DfNameObject.getSafeName(this.m_chartType));
	return vizJson;
};
oFF.OuDpVizActionVizDefinition.prototype.getChartType = function()
{
	return this.m_chartType;
};
oFF.OuDpVizActionVizDefinition.prototype.getProtocolType = function()
{
	return this.m_protocolType;
};
oFF.OuDpVizActionVizDefinition.prototype.getVizName = function()
{
	return this.m_vizName;
};
oFF.OuDpVizActionVizDefinition.prototype.getVizType = function()
{
	return this.m_vizType;
};
oFF.OuDpVizActionVizDefinition.prototype.setupExt = function(vizName, vizType, protocolType, chartType)
{
	this.m_vizName = vizName;
	this.m_vizType = vizType;
	this.m_protocolType = oFF.notNull(protocolType) ? protocolType : (oFF.notNull(this.m_vizType) ? this.m_vizType.getDefaultProtocolBindingType() : null);
	this.m_chartType = oFF.notNull(chartType) ? chartType : (oFF.notNull(this.m_vizType) ? this.m_vizType.getDefaultChartType() : null);
};

oFF.OuDataProviderEventLoop = function() {};
oFF.OuDataProviderEventLoop.prototype = new oFF.XObject();
oFF.OuDataProviderEventLoop.prototype._ff_c = "OuDataProviderEventLoop";

oFF.OuDataProviderEventLoop.create = function(dataProvider)
{
	let obj = new oFF.OuDataProviderEventLoop();
	obj.setupExt(dataProvider);
	return obj;
};
oFF.OuDataProviderEventLoop.prototype.m_dataProvider = null;
oFF.OuDataProviderEventLoop.prototype.m_events = null;
oFF.OuDataProviderEventLoop.prototype.m_loopExecuted = null;
oFF.OuDataProviderEventLoop.prototype.m_paused = false;
oFF.OuDataProviderEventLoop.prototype.m_timeoutId = null;
oFF.OuDataProviderEventLoop.prototype.flush = function()
{
	oFF.XTimeout.clear(this.m_timeoutId);
	this.triggerExecution();
};
oFF.OuDataProviderEventLoop.prototype.getEventByType = function(eventType)
{
	return oFF.XCollectionUtils.findFirst(this.m_events, (evt) => {
		return evt.getEventType() === eventType;
	});
};
oFF.OuDataProviderEventLoop.prototype.getPendingEvents = function()
{
	return this.m_events;
};
oFF.OuDataProviderEventLoop.prototype.queueEvent = function(event)
{
	if (!this.m_paused && !event.isBuffered())
	{
		this.triggerExecutionWithEvents(oFF.XCollectionUtils.singletonList(event));
		return;
	}
	this.queueEventInternal(event);
	if (this.m_paused)
	{
		return;
	}
	let eventBufferTimeout = this.m_dataProvider.getConfig().getEventBufferTimeout();
	if (eventBufferTimeout <= 0)
	{
		this.triggerExecution();
		return;
	}
	oFF.XTimeout.clear(this.m_timeoutId);
	this.m_timeoutId = oFF.XTimeout.timeout(eventBufferTimeout, this.triggerExecution.bind(this));
};
oFF.OuDataProviderEventLoop.prototype.queueEventInternal = function(event)
{
	let oldEvent = this.getEventByType(event.getEventType());
	if (oFF.notNull(oldEvent) && oldEvent.canMerge())
	{
		oldEvent.merge(event);
	}
	else
	{
		this.m_events.add(event);
	}
};
oFF.OuDataProviderEventLoop.prototype.releaseObject = function()
{
	oFF.XTimeout.clear(this.m_timeoutId);
	this.m_timeoutId = null;
	this.m_dataProvider = null;
	this.m_events = oFF.XObjectExt.release(this.m_events);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuDataProviderEventLoop.prototype.setLoopExecuted = function(loopExecuted)
{
	this.m_loopExecuted = loopExecuted;
};
oFF.OuDataProviderEventLoop.prototype.setPaused = function(paused)
{
	if (this.m_paused !== paused)
	{
		this.m_paused = paused;
		if (this.m_paused)
		{
			oFF.XTimeout.clear(this.m_timeoutId);
		}
	}
	if (!paused)
	{
		this.flush();
	}
};
oFF.OuDataProviderEventLoop.prototype.setupExt = function(dataProvider)
{
	this.m_dataProvider = dataProvider;
	this.m_events = oFF.XList.create();
};
oFF.OuDataProviderEventLoop.prototype.triggerExecution = function()
{
	let events = this.m_events.createListCopy();
	this.m_events.clear();
	this.triggerExecutionWithEvents(events);
};
oFF.OuDataProviderEventLoop.prototype.triggerExecutionWithEvents = function(events)
{
	if (!oFF.XCollectionUtils.hasElements(events))
	{
		return;
	}
	let allEmitter = this.m_dataProvider.getEventing().getEmitterForAll();
	let allEvent = allEmitter.newTypedEvent();
	for (let i = 0; i < events.size(); i++)
	{
		let event = events.get(i);
		this.m_dataProvider.getLoggerBase().logEvent(event);
		this.m_dataProvider.getEventingBase().getListenerCollectionBaseForEventType(event.getEventType()).callListener(event);
		allEvent.addSubEvent(event);
	}
	this.m_dataProvider.getEventingBase().getListenerCollectionBaseForEventType(allEvent.getEventType()).callListener(allEvent);
	if (oFF.notNull(this.m_loopExecuted))
	{
		this.m_loopExecuted(events);
	}
};

oFF.OuDataProviderAction = function() {};
oFF.OuDataProviderAction.prototype = new oFF.XObject();
oFF.OuDataProviderAction.prototype._ff_c = "OuDataProviderAction";

oFF.OuDataProviderAction.prototype.m_parameters = null;
oFF.OuDataProviderAction.prototype.getParameters = function()
{
	if (oFF.isNull(this.m_parameters))
	{
		this.m_parameters = oFF.XList.create();
	}
	return this.m_parameters;
};
oFF.OuDataProviderAction.prototype.releaseObject = function()
{
	oFF.XObjectExt.release(this.m_parameters);
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.OuDataProviderActionCollectionRegistry = {

	s_actionCollectionClasses:null,
	getActionCollectionClass:function(actionName)
	{
			return oFF.OuDataProviderActionCollectionRegistry.s_actionCollectionClasses.getByKey(actionName);
	},
	getAllActionCollectionClasses:function()
	{
			return oFF.OuDataProviderActionCollectionRegistry.s_actionCollectionClasses.getValuesAsReadOnlyList();
	},
	registerCollectionByClass:function(pluginClass)
	{
			if (oFF.notNull(pluginClass))
		{
			try
			{
				let tmpInstance = pluginClass.newInstance(null);
				let actionName = tmpInstance.getName();
				if (!oFF.OuDataProviderActionCollectionRegistry.s_actionCollectionClasses.containsKey(actionName))
				{
					oFF.OuDataProviderActionCollectionRegistry.s_actionCollectionClasses.put(actionName, pluginClass);
				}
			}
			catch (e)
			{
				throw oFF.XException.createRuntimeException("Failed to register action class! Class might be invalid!");
			}
		}
	},
	staticSetup:function()
	{
			oFF.OuDataProviderActionCollectionRegistry.s_actionCollectionClasses = oFF.XLinkedHashMapByString.create();
	}
};

oFF.OuDataProviderActionContext = function() {};
oFF.OuDataProviderActionContext.prototype = new oFF.XObject();
oFF.OuDataProviderActionContext.prototype._ff_c = "OuDataProviderActionContext";

oFF.OuDataProviderActionContext.create = function(env, collection)
{
	let obj = new oFF.OuDataProviderActionContext();
	obj.m_environment = oFF.XEnvironment.createCopy(env);
	obj.m_collection = collection;
	return obj;
};
oFF.OuDataProviderActionContext.prototype.m_answers = 0;
oFF.OuDataProviderActionContext.prototype.m_collection = null;
oFF.OuDataProviderActionContext.prototype.m_environment = null;
oFF.OuDataProviderActionContext.prototype.getActions = function()
{
	return this.m_collection;
};
oFF.OuDataProviderActionContext.prototype.getEnvironment = function()
{
	return this.m_environment;
};
oFF.OuDataProviderActionContext.prototype.pushResult = function(sres)
{
	for (let i = this.m_answers; i > 0; i--)
	{
		this.m_environment.setVariable(oFF.XStringUtils.concatenateWithInt("ans", i), this.m_environment.getVariable(oFF.XStringUtils.concatenateWithInt("ans", i - 1)));
	}
	this.m_environment.setVariable("ans0", sres);
	this.m_environment.setVariable("ans", sres);
	if (this.m_answers < 10)
	{
		this.m_answers++;
	}
};
oFF.OuDataProviderActionContext.prototype.releaseObject = function()
{
	oFF.XObjectExt.release(this.m_environment);
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.OuDataProviderActionJsonParser = function() {};
oFF.OuDataProviderActionJsonParser.prototype = new oFF.XObject();
oFF.OuDataProviderActionJsonParser.prototype._ff_c = "OuDataProviderActionJsonParser";

oFF.OuDataProviderActionJsonParser.prototype.parse = function(source, contexts)
{
	let rcontexts = source.getStructureByKey("contexts");
	let i;
	let j;
	if (oFF.notNull(rcontexts))
	{
		let keys = rcontexts.getKeysAsReadOnlyList();
		for (i = 0; i < keys.size(); i++)
		{
			let rdps = rcontexts.getListByKey(keys.get(i));
			let dps = oFF.XList.create();
			for (j = 0; j < rdps.size(); j++)
			{
				dps.add(contexts.getByKey(rdps.getStringAt(j)));
			}
			contexts.put(keys.get(i), oFF.OuDataProviderCollection.create(dps));
		}
	}
	let commands = oFF.OuDataProviderActionSequence.create();
	let rcommands = source.getListByKey("commands");
	for (i = 0; i < rcommands.size(); i++)
	{
		let rcommand = rcommands.getStructureAt(i);
		let rname = rcommand.getStringByKey("name");
		let rparameters = rcommand.getListByKey("parameters");
		let dot = oFF.XString.indexOf(rname, ".");
		let command = oFF.OuDataProviderActionCall.createActionCall(dot !== -1 ? oFF.XString.substring(rname, 0, dot) : "default", dot !== -1 ? oFF.XString.substring(rname, dot + 1, -1) : rname);
		for (j = 0; j < rparameters.size(); j++)
		{
			command.getParameters().add(oFF.OuDataProviderActionStringLiteral.create(rparameters.getStringAt(j)));
		}
		commands.getParameters().add(command);
	}
	return commands;
};

oFF.OuDataProviderActionParser = function() {};
oFF.OuDataProviderActionParser.prototype = new oFF.XObject();
oFF.OuDataProviderActionParser.prototype._ff_c = "OuDataProviderActionParser";

oFF.OuDataProviderActionParser.prototype.autoComplete = function(source, cursor, fcompletion, scompletion)
{
	let pos = 0;
	let symbol = "";
	let symbols = "(,);\"' \n\r\t";
	let inDoubleQuotes = false;
	let inSingleQuotes = false;
	let seq = oFF.OuDataProviderActionSequence.create();
	let actions = oFF.XList.create();
	let ops = oFF.XList.create();
	for (pos = 0; pos < oFF.XString.size(source); pos++)
	{
		let next = this.indexOfAnyFrom(source, inDoubleQuotes ? "\"" : inSingleQuotes ? "'" : symbols, pos);
		if (next !== pos)
		{
			if (!inDoubleQuotes && !inSingleQuotes)
			{
				symbol = oFF.XString.substring(source, pos, next);
				if (pos <= cursor && (cursor <= next || next === -1))
				{
					fcompletion(ops, oFF.XStringValue.create(symbol));
					return;
				}
			}
			else
			{
				symbol = oFF.XStringUtils.concatenate2(symbol, oFF.XString.substring(source, pos, next));
				if (pos <= cursor && (cursor <= next || next === -1))
				{
					scompletion(ops, oFF.XStringValue.create(symbol), oFF.XBooleanValue.create(inSingleQuotes));
					return;
				}
			}
		}
		if (next === -1)
		{
			break;
		}
		pos = next;
		let c = oFF.XString.getCharAt(source, pos);
		if (c === oFF.XString.getCharAt(symbols, 4))
		{
			if (inDoubleQuotes && pos + 1 < oFF.XString.size(source) && c === oFF.XString.getCharAt(source, pos + 1))
			{
				symbol = oFF.XStringUtils.concatenate2(symbol, "\"");
			}
			else
			{
				inDoubleQuotes = !inDoubleQuotes;
				if (inDoubleQuotes)
				{
					symbol = "";
				}
				else
				{
					actions.add(oFF.OuDataProviderActionStringLiteral.create(symbol));
				}
			}
		}
		else if (c === oFF.XString.getCharAt(symbols, 5))
		{
			if (inSingleQuotes && pos + 1 < oFF.XString.size(source) && c === oFF.XString.getCharAt(source, pos + 1))
			{
				symbol = oFF.XStringUtils.concatenate2(symbol, "'");
			}
			else
			{
				inSingleQuotes = !inSingleQuotes;
				if (inSingleQuotes)
				{
					symbol = "";
				}
				else
				{
					actions.add(oFF.OuDataProviderActionStringLiteral.create(symbol));
				}
			}
		}
		else if (c === oFF.XString.getCharAt(symbols, 0))
		{
			let dot = oFF.XString.indexOf(symbol, ".");
			actions.add(null);
			ops.add(oFF.OuDataProviderActionCall.createActionCall(dot !== -1 ? oFF.XString.substring(symbol, 0, dot) : "default", dot !== -1 ? oFF.XString.substring(symbol, dot + 1, -1) : symbol));
		}
		else if (c === oFF.XString.getCharAt(symbols, 1))
		{
			if (actions.size() === 0 || ops.size() === 0)
			{
				continue;
			}
			ops.get(ops.size() - 1).getParameters().add(actions.get(actions.size() - 1));
			actions.removeAt(actions.size() - 1);
		}
		else if (c === oFF.XString.getCharAt(symbols, 2))
		{
			if (actions.size() === 0 || ops.size() === 0)
			{
				continue;
			}
			if (actions.get(actions.size() - 1) !== null)
			{
				ops.get(ops.size() - 1).getParameters().add(actions.get(actions.size() - 1));
				actions.removeAt(actions.size() - 1);
				if (actions.size() === 0)
				{
					continue;
				}
			}
			actions.removeAt(actions.size() - 1);
			actions.add(ops.get(ops.size() - 1));
			ops.removeAt(ops.size() - 1);
		}
		else if (c === oFF.XString.getCharAt(symbols, 3))
		{
			if (ops.size() > 0)
			{
				ops.clear();
				actions.clear();
				continue;
			}
			if (actions.size() > 0)
			{
				seq.getParameters().add(actions.get(actions.size() - 1));
				actions.removeAt(actions.size() - 1);
			}
		}
	}
	if (actions.size() > 0)
	{
		seq.getParameters().add(actions.get(actions.size() - 1));
		actions.removeAt(actions.size() - 1);
	}
	if (pos <= cursor && cursor <= pos + 1)
	{
		if (inDoubleQuotes || inSingleQuotes)
		{
			scompletion(ops, oFF.XStringValue.create(symbol), oFF.XBooleanValue.create(inSingleQuotes));
		}
		else if (pos === 0 || oFF.XString.getCharAt(source, pos - 1) !== oFF.XString.getCharAt(symbols, 2) && oFF.XString.getCharAt(source, pos - 1) !== oFF.XString.getCharAt(symbols, 4) && oFF.XString.getCharAt(source, pos - 1) !== oFF.XString.getCharAt(symbols, 5))
		{
			fcompletion(ops, oFF.XStringValue.create(""));
			scompletion(ops, oFF.XStringValue.create(""), null);
		}
	}
};
oFF.OuDataProviderActionParser.prototype.indexOfAnyFrom = function(source, chars, offset)
{
	for (let i = offset; i < oFF.XString.size(source); i++)
	{
		for (let j = 0; j < oFF.XString.size(chars); j++)
		{
			if (oFF.XString.getCharAt(source, i) === oFF.XString.getCharAt(chars, j))
			{
				return i;
			}
		}
	}
	return -1;
};
oFF.OuDataProviderActionParser.prototype.parse = function(source)
{
	let errors = oFF.XList.create();
	let ret = this.parseWithError(source, errors);
	oFF.XObjectExt.release(errors);
	return ret;
};
oFF.OuDataProviderActionParser.prototype.parseWithError = function(source, errors)
{
	let pos = 0;
	let symbol = "";
	let symbols = "(,);\"' \n\r\t";
	let inDoubleQuotes = false;
	let inSingleQuotes = false;
	let seq = oFF.OuDataProviderActionSequence.create();
	let actions = oFF.XList.create();
	let ops = oFF.XList.create();
	for (pos = 0; pos < oFF.XString.size(source); pos++)
	{
		let next = this.indexOfAnyFrom(source, inDoubleQuotes ? "\"" : inSingleQuotes ? "'" : symbols, pos);
		if (next !== pos)
		{
			if (!inDoubleQuotes && !inSingleQuotes)
			{
				symbol = oFF.XString.substring(source, pos, next);
			}
			else
			{
				symbol = oFF.XStringUtils.concatenate2(symbol, oFF.XString.substring(source, pos, next));
			}
		}
		if (next === -1)
		{
			break;
		}
		pos = next;
		let c = oFF.XString.getCharAt(source, pos);
		if (c === oFF.XString.getCharAt(symbols, 4))
		{
			if (inDoubleQuotes && pos + 1 < oFF.XString.size(source) && c === oFF.XString.getCharAt(source, pos + 1))
			{
				symbol = oFF.XStringUtils.concatenate2(symbol, "\"");
			}
			else
			{
				inDoubleQuotes = !inDoubleQuotes;
				if (inDoubleQuotes)
				{
					symbol = "";
				}
				else
				{
					actions.add(oFF.OuDataProviderActionStringLiteral.create(symbol));
				}
			}
		}
		else if (c === oFF.XString.getCharAt(symbols, 5))
		{
			if (inSingleQuotes && pos + 1 < oFF.XString.size(source) && c === oFF.XString.getCharAt(source, pos + 1))
			{
				symbol = oFF.XStringUtils.concatenate2(symbol, "'");
			}
			else
			{
				inSingleQuotes = !inSingleQuotes;
				if (inSingleQuotes)
				{
					symbol = "";
				}
				else
				{
					actions.add(oFF.OuDataProviderActionStringLiteral.create(symbol));
				}
			}
		}
		else if (c === oFF.XString.getCharAt(symbols, 0))
		{
			if (oFF.XStringUtils.isNullOrEmpty(symbol))
			{
				errors.add(oFF.XError.create(oFF.XStringUtils.concatenateWithInt("Function call without name at pos ", pos)));
				continue;
			}
			let dot = oFF.XString.indexOf(symbol, ".");
			actions.add(null);
			ops.add(oFF.OuDataProviderActionCall.createActionCall(dot !== -1 ? oFF.XString.substring(symbol, 0, dot) : "default", dot !== -1 ? oFF.XString.substring(symbol, dot + 1, -1) : symbol));
		}
		else if (c === oFF.XString.getCharAt(symbols, 1))
		{
			if (actions.get(actions.size() - 1) === null)
			{
				errors.add(oFF.XError.create(oFF.XStringUtils.concatenateWithInt("Closed more brackets than opened at pos ", pos)));
				continue;
			}
			ops.get(ops.size() - 1).getParameters().add(actions.get(actions.size() - 1));
			actions.removeAt(actions.size() - 1);
		}
		else if (c === oFF.XString.getCharAt(symbols, 2))
		{
			if (ops.size() === 0)
			{
				errors.add(oFF.XError.create(oFF.XStringUtils.concatenateWithInt("Closed more brackets than opened at pos ", pos)));
				continue;
			}
			if (actions.get(actions.size() - 1) !== null)
			{
				ops.get(ops.size() - 1).getParameters().add(actions.get(actions.size() - 1));
				actions.removeAt(actions.size() - 1);
			}
			actions.removeAt(actions.size() - 1);
			actions.add(ops.get(ops.size() - 1));
			ops.removeAt(ops.size() - 1);
		}
		else if (c === oFF.XString.getCharAt(symbols, 3))
		{
			if (ops.size() > 0)
			{
				errors.add(oFF.XError.create(oFF.XStringUtils.concatenateWithInt(oFF.XStringUtils.concatenate3("Unclosed function '", ops.get(ops.size() - 1).toString(), "' at pos "), pos)));
				ops.clear();
				actions.clear();
				continue;
			}
			if (actions.size() > 0)
			{
				seq.getParameters().add(actions.get(actions.size() - 1));
				actions.removeAt(actions.size() - 1);
			}
		}
	}
	if (actions.size() > 0)
	{
		seq.getParameters().add(actions.get(actions.size() - 1));
		actions.removeAt(actions.size() - 1);
	}
	if (inSingleQuotes)
	{
		errors.add(oFF.XError.create("Unclosed ' at the end of the script"));
	}
	else if (inDoubleQuotes)
	{
		errors.add(oFF.XError.create("Unclosed \" at the end of the script"));
	}
	if (ops.size() > 0)
	{
		errors.add(oFF.XError.create(oFF.XStringUtils.concatenate3("Unclosed function '", ops.get(ops.size() - 1).toString(), "' at the end of the script")));
	}
	if (errors.size() > 0)
	{
		return oFF.OuDataProviderSyntaxErrorAction.create(errors.get(0));
	}
	return seq;
};

oFF.OuDataProviderActionValidator = function() {};
oFF.OuDataProviderActionValidator.prototype = new oFF.XObject();
oFF.OuDataProviderActionValidator.prototype._ff_c = "OuDataProviderActionValidator";

oFF.OuDataProviderActionValidator.create = function(dataProvider)
{
	let obj = new oFF.OuDataProviderActionValidator();
	obj.setupExt(dataProvider);
	return obj;
};
oFF.OuDataProviderActionValidator.prototype.m_dataProvider = null;
oFF.OuDataProviderActionValidator.prototype.addAllErrors = function(messageManager, errors)
{
	if (!oFF.XCollectionUtils.hasElements(errors))
	{
		return;
	}
	oFF.XCollectionUtils.forEach(errors, (error) => {
		messageManager.addError(oFF.ErrorCodes.OTHER_ERROR, error.getText());
	});
};
oFF.OuDataProviderActionValidator.prototype.applyDefaultValues = function(actionName, incomingParameters)
{
	let actionManifest = this.m_dataProvider.getActions().getActionManifest(actionName);
	if (oFF.isNull(actionManifest))
	{
		return incomingParameters;
	}
	let parametersWithDefaults = oFF.XList.create();
	let parameterDefinitions = actionManifest.getParameterList();
	for (let i = 0; i < parameterDefinitions.size(); i++)
	{
		let parameterDefinition = parameterDefinitions.get(i);
		if (i < incomingParameters.size() && incomingParameters.get(i) !== null)
		{
			parametersWithDefaults.add(incomingParameters.get(i));
		}
		else if (parameterDefinition.getDefaultValue() !== null)
		{
			parametersWithDefaults.add(parameterDefinition.getDefaultValue().getStringRepresentation());
		}
		else
		{
			return incomingParameters;
		}
	}
	return parametersWithDefaults;
};
oFF.OuDataProviderActionValidator.prototype.setupExt = function(dataProvider)
{
	this.m_dataProvider = dataProvider;
};
oFF.OuDataProviderActionValidator.prototype.validateParameters = function(actionName, parameters)
{
	let messageManager = oFF.MessageManagerSimple.createMessageManager();
	let actionManifest = this.m_dataProvider.getActions().getActionManifest(actionName);
	if (oFF.isNull(actionManifest))
	{
		messageManager.addWarning(oFF.ErrorCodes.OTHER_ERROR, oFF.XStringUtils.concatenate2("no manifest exists for action: ", actionName));
		return messageManager;
	}
	let parameterDefinitions = actionManifest.getParameterList();
	for (let i = 0; i < parameters.size(); i++)
	{
		if (i >= parameterDefinitions.size())
		{
			messageManager.addError(oFF.ErrorCodes.OTHER_ERROR, "more parameters provided than defined in the manifest");
			return messageManager;
		}
		let parameter = parameters.get(i);
		let parameterDefinition = parameterDefinitions.get(i);
		let errors = null;
		if (oFF.XObject.isOfClass(parameterDefinition, oFF.XClass.create(oFF.OdpDfActionProperty)))
		{
			let dpParameterDefinition = parameterDefinition;
			errors = dpParameterDefinition.validateWithDataProvider(this.m_dataProvider, parameter);
		}
		else
		{
			try
			{
				let element = oFF.PrUtils.deserialize(parameter);
				errors = parameterDefinition.validate(element);
			}
			catch (t)
			{
				messageManager.addError(oFF.ErrorCodes.OTHER_ERROR, oFF.XException.getMessage(t));
			}
		}
		this.addAllErrors(messageManager, errors);
	}
	return messageManager;
};

oFF.OuDataProviderCollection = function() {};
oFF.OuDataProviderCollection.prototype = new oFF.XObject();
oFF.OuDataProviderCollection.prototype._ff_c = "OuDataProviderCollection";

oFF.OuDataProviderCollection.create = function(dps)
{
	let obj = new oFF.OuDataProviderCollection();
	obj.m_dps = dps;
	return obj;
};
oFF.OuDataProviderCollection.prototype.m_dps = null;
oFF.OuDataProviderCollection.prototype.executeActionByName = function(actionName, parameters)
{
	let list = oFF.XPromiseList.create();
	for (let i = 0; i < this.m_dps.size(); i++)
	{
		list.add(this.m_dps.get(i).executeActionByName(actionName, parameters));
	}
	let all = oFF.XPromise.allSettled(list);
	let retprom = all.onThenExt((res) => {
		let ret = res.size() > 0 ? res.get(res.size() - 1) : null;
		return ret;
	});
	return retprom;
};
oFF.OuDataProviderCollection.prototype.hasAction = function(actionName)
{
	for (let i = 0; i < this.m_dps.size(); i++)
	{
		if (!this.m_dps.get(i).hasAction(actionName))
		{
			return false;
		}
	}
	return true;
};
oFF.OuDataProviderCollection.prototype.releaseObject = function()
{
	oFF.XObjectExt.release(this.m_dps);
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.DataProviderFileRequestAdapter = function() {};
oFF.DataProviderFileRequestAdapter.prototype = new oFF.XObject();
oFF.DataProviderFileRequestAdapter.prototype._ff_c = "DataProviderFileRequestAdapter";

oFF.DataProviderFileRequestAdapter.create = function(callback)
{
	let adapter = new oFF.DataProviderFileRequestAdapter();
	adapter.callback = callback;
	return adapter;
};
oFF.DataProviderFileRequestAdapter.prototype.callback = null;
oFF.DataProviderFileRequestAdapter.prototype.onHttpFileProcessed = function(extResult, data, customIdentifier)
{
	this.callback(extResult);
};

oFF.OuDataProviderActionManifestConstants = {

	DESCRIPTION_KEY:"Description",
	DISPLAY_NAME_KEY:"DisplayName",
	NAME_KEY:"Name",
	PARAMETERS_KEY:"Parameters"
};

oFF.OuDataProviderActionManifestLoader = {

	DEFAULT_MANIFEST_DIRECTORY:"/etc/manifests/dataProvider/actions",
	s_allFilesLoaded:false,
	s_loadingManifest:null,
	loadActionManifest:function(file)
	{
			return oFF.XFilePromise.loadJsonStructure(file).onThenExt((jsonStruct) => {
			let manifest = oFF.OuDataProviderActionManifest.createByStructure(jsonStruct);
			oFF.OuDataProviderActionManifestRegistry.getInstance().registerActionManifest(manifest);
			return oFF.XBooleanValue.create(true);
		});
	},
	loadActionManifests:function(process)
	{
			if (oFF.OuDataProviderActionManifestLoader.s_allFilesLoaded)
		{
			return oFF.XPromise.resolve(oFF.XBooleanValue.create(true));
		}
		if (oFF.notNull(oFF.OuDataProviderActionManifestLoader.s_loadingManifest) && oFF.OuDataProviderActionManifestLoader.s_loadingManifest.getState() !== oFF.XPromiseState.REJECTED)
		{
			return oFF.OuDataProviderActionManifestLoader.s_loadingManifest;
		}
		let manifestDir = oFF.XFile.create(process, oFF.OuDataProviderActionManifestLoader.DEFAULT_MANIFEST_DIRECTORY);
		oFF.OuDataProviderActionManifestLoader.s_loadingManifest = oFF.XFilePromise.isExisting(manifestDir).onThenPromise((isExisting) => {
			if (!isExisting.getBoolean())
			{
				let text = oFF.XStringUtils.concatenate2("Action manifest dir does not exist: ", oFF.OuDataProviderActionManifestLoader.DEFAULT_MANIFEST_DIRECTORY);
				return oFF.XPromise.reject(oFF.XError.create(text));
			}
			return oFF.OuDataProviderActionManifestLoader.loadChildrenRecursive(manifestDir).onThenExt((result) => {
				oFF.OuDataProviderActionManifestLoader.s_allFilesLoaded = true;
				return oFF.XBooleanValue.create(true);
			});
		});
		return oFF.OuDataProviderActionManifestLoader.s_loadingManifest;
	},
	loadChildrenRecursive:function(folder)
	{
			return oFF.XFilePromise.fetchChildren(folder).onThenPromise((children) => {
			let promises = oFF.XPromiseList.create();
			oFF.XCollectionUtils.forEach(children, (file) => {
				if (file.isDirectory())
				{
					promises.add(oFF.OuDataProviderActionManifestLoader.loadChildrenRecursive(file));
				}
				else
				{
					promises.add(oFF.OuDataProviderActionManifestLoader.loadActionManifest(file));
				}
			});
			let all = oFF.XPromise.allSettled(promises);
			return all.onThenExt((result) => {
				return oFF.XBooleanValue.create(true);
			});
		}).onCatchExt((err) => {
			oFF.XLogger.printError(err.getText());
			return oFF.XBooleanValue.create(false);
		});
	}
};

oFF.OuDataProviderActionManifestRegistry = function() {};
oFF.OuDataProviderActionManifestRegistry.prototype = new oFF.XObject();
oFF.OuDataProviderActionManifestRegistry.prototype._ff_c = "OuDataProviderActionManifestRegistry";

oFF.OuDataProviderActionManifestRegistry.s_instance = null;
oFF.OuDataProviderActionManifestRegistry.getInstance = function()
{
	if (oFF.isNull(oFF.OuDataProviderActionManifestRegistry.s_instance))
	{
		oFF.OuDataProviderActionManifestRegistry.s_instance = new oFF.OuDataProviderActionManifestRegistry();
		oFF.OuDataProviderActionManifestRegistry.s_instance.setupRegistry();
	}
	return oFF.OuDataProviderActionManifestRegistry.s_instance;
};
oFF.OuDataProviderActionManifestRegistry.prototype.m_manifests = null;
oFF.OuDataProviderActionManifestRegistry.prototype.getActionManifest = function(name)
{
	return this.m_manifests.getByKey(name);
};
oFF.OuDataProviderActionManifestRegistry.prototype.getActionManifests = function()
{
	return this.m_manifests;
};
oFF.OuDataProviderActionManifestRegistry.prototype.hasActionManifest = function(name)
{
	return this.m_manifests.containsKey(name);
};
oFF.OuDataProviderActionManifestRegistry.prototype.registerActionManifest = function(manifest)
{
	this.m_manifests.put(manifest.getName(), manifest);
};
oFF.OuDataProviderActionManifestRegistry.prototype.setupRegistry = function()
{
	this.m_manifests = oFF.XHashMapByString.create();
};

oFF.OuDataProviderUtils = {

	convertToXObjectPromise:function(promise)
	{
			return promise.then((result) => {
			return result;
		}, null);
	}
};

oFF.OlapDataProviderUtil = {

	getOlapDataProvider:function(dataProvider)
	{
			try
		{
			if (dataProvider.getType() === oFF.DataProviderType.OLAP)
			{
				return dataProvider;
			}
		}
		catch (t)
		{
			return null;
		}
		return null;
	}
};

oFF.DfOuDataProviderAction = function() {};
oFF.DfOuDataProviderAction.prototype = new oFF.XObject();
oFF.DfOuDataProviderAction.prototype._ff_c = "DfOuDataProviderAction";

oFF.DfOuDataProviderAction.prototype.m_actionsBase = null;
oFF.DfOuDataProviderAction.prototype.execute = function(parameters)
{
	return this.doAction(parameters);
};
oFF.DfOuDataProviderAction.prototype.getActionsBase = function()
{
	return this.m_actionsBase;
};
oFF.DfOuDataProviderAction.prototype.getDataProvider = function()
{
	return this.m_actionsBase.getDataProvider();
};
oFF.DfOuDataProviderAction.prototype.isQueryManagerNeeded = function()
{
	return true;
};
oFF.DfOuDataProviderAction.prototype.newActionResult = function(parameters)
{
	let result = oFF.OuDataProviderActionResult.create(this.getName());
	for (let i = 0; i < parameters.size(); i++)
	{
		let name = oFF.XStringUtils.concatenate2("value", oFF.XInteger.convertToString(i));
		let value = parameters.get(i);
		result.addLogParameter(name, value);
	}
	return result;
};
oFF.DfOuDataProviderAction.prototype.releaseObject = function()
{
	this.m_actionsBase = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.DfOuDataProviderAction.prototype.setupAction = function(actionsBase)
{
	this.m_actionsBase = actionsBase;
};
oFF.DfOuDataProviderAction.prototype.toString = function()
{
	return this.getName();
};

oFF.OuDataProviderConnection = function() {};
oFF.OuDataProviderConnection.prototype = new oFF.XObject();
oFF.OuDataProviderConnection.prototype._ff_c = "OuDataProviderConnection";

oFF.OuDataProviderConnection.DATA_SOURCE_FQN = "dataSourceFullQualifiedName";
oFF.OuDataProviderConnection.DATA_SOURCE_REPO = "dataSourceRepo";
oFF.OuDataProviderConnection.REPO = "repo";
oFF.OuDataProviderConnection.SFX = "sfx";
oFF.OuDataProviderConnection.START_WITH_AUTO_FETCH = "startWithAutoFetch";
oFF.OuDataProviderConnection.SYSTEM_NAME = "systemName";
oFF.OuDataProviderConnection.USE_EXIT_VARIABLES_VALUES_FOR_SETUP = "useExitVariableValuesForSetup";
oFF.OuDataProviderConnection.VISUALIZATIONS = "visualizations";
oFF.OuDataProviderConnection.createConnection = function(application)
{
	let obj = new oFF.OuDataProviderConnection();
	obj.setupConfig(application);
	return obj;
};
oFF.OuDataProviderConnection.createConnectionFromJson = function(application, configJson)
{
	let obj = new oFF.OuDataProviderConnection();
	obj.setupConfig(application);
	obj.deserializeJson(configJson);
	return obj;
};
oFF.OuDataProviderConnection.prototype.m_application = null;
oFF.OuDataProviderConnection.prototype.m_connectionJson = null;
oFF.OuDataProviderConnection.prototype.deserializeJson = function(configJson)
{
	this.m_connectionJson.putAll(configJson);
};
oFF.OuDataProviderConnection.prototype.getApplication = function()
{
	return this.m_application;
};
oFF.OuDataProviderConnection.prototype.getDataSource = function()
{
	let dataSourceBase = this.getDataSourceBase();
	if (oFF.isNull(dataSourceBase))
	{
		dataSourceBase = oFF.QFactory.createDataSource();
	}
	let fqn = this.m_connectionJson.getStringByKey(oFF.OuDataProviderConnection.DATA_SOURCE_FQN);
	if (oFF.notNull(fqn))
	{
		dataSourceBase.setFullQualifiedName(fqn);
	}
	let systemName = this.m_connectionJson.getStringByKey(oFF.OuDataProviderConnection.SYSTEM_NAME);
	if (oFF.notNull(systemName))
	{
		dataSourceBase.setSystemName(systemName);
	}
	return dataSourceBase;
};
oFF.OuDataProviderConnection.prototype.getDataSourceBase = function()
{
	let dataSourceRepo = this.m_connectionJson.getStructureByKey(oFF.OuDataProviderConnection.DATA_SOURCE_REPO);
	if (oFF.isNull(dataSourceRepo))
	{
		return null;
	}
	let importer = oFF.QInAImportFactory.createForRepository(this.m_application, null);
	return importer.importDataSource(dataSourceRepo);
};
oFF.OuDataProviderConnection.prototype.getDataSourceName = function()
{
	let fqn = this.m_connectionJson.getStringByKey(oFF.OuDataProviderConnection.DATA_SOURCE_FQN);
	if (oFF.notNull(fqn))
	{
		return fqn;
	}
	let dataSourceBase = this.getDataSourceBase();
	return oFF.notNull(dataSourceBase) ? dataSourceBase.getFullQualifiedName() : null;
};
oFF.OuDataProviderConnection.prototype.getRepoJson = function()
{
	return this.m_connectionJson.getStructureByKey(oFF.OuDataProviderConnection.REPO);
};
oFF.OuDataProviderConnection.prototype.getSfxJson = function()
{
	return this.m_connectionJson.getStructureByKey(oFF.OuDataProviderConnection.SFX);
};
oFF.OuDataProviderConnection.prototype.getSystemName = function()
{
	let systemName = this.m_connectionJson.getStringByKey(oFF.OuDataProviderConnection.SYSTEM_NAME);
	if (oFF.notNull(systemName))
	{
		return systemName;
	}
	let dataSourceBase = this.getDataSourceBase();
	return oFF.notNull(dataSourceBase) ? dataSourceBase.getSystemName() : null;
};
oFF.OuDataProviderConnection.prototype.getVisualizations = function()
{
	return this.m_connectionJson.getListByKey(oFF.OuDataProviderConnection.VISUALIZATIONS);
};
oFF.OuDataProviderConnection.prototype.isStartWithAutoFetch = function()
{
	return this.m_connectionJson.getBooleanByKey(oFF.OuDataProviderConnection.START_WITH_AUTO_FETCH);
};
oFF.OuDataProviderConnection.prototype.isUsingExitVariableValuesForSetup = function()
{
	return this.m_connectionJson.getBooleanByKey(oFF.OuDataProviderConnection.USE_EXIT_VARIABLES_VALUES_FOR_SETUP);
};
oFF.OuDataProviderConnection.prototype.releaseObject = function()
{
	this.m_application = null;
	this.m_connectionJson = oFF.XObjectExt.release(this.m_connectionJson);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuDataProviderConnection.prototype.serializeJson = function()
{
	return oFF.PrUtils.deepCopyElement(this.m_connectionJson).asStructure();
};
oFF.OuDataProviderConnection.prototype.setDataSource = function(dataSource)
{
	this.m_connectionJson.remove(oFF.OuDataProviderConnection.DATA_SOURCE_FQN);
	this.m_connectionJson.remove(oFF.OuDataProviderConnection.SYSTEM_NAME);
	if (oFF.isNull(dataSource))
	{
		this.m_connectionJson.remove(oFF.OuDataProviderConnection.DATA_SOURCE_REPO);
	}
	else
	{
		if (oFF.XStringUtils.isNullOrEmpty(dataSource.getSystemName()))
		{
			throw oFF.XException.createIllegalArgumentException("data provider config has no system name!");
		}
		let exporter = oFF.QInAExportFactory.createForRepository(this.m_application, null);
		let dataSourceJson = exporter.exportDataSource(dataSource, false);
		this.m_connectionJson.put(oFF.OuDataProviderConnection.DATA_SOURCE_REPO, dataSourceJson);
	}
};
oFF.OuDataProviderConnection.prototype.setDataSourceName = function(dataSourceName)
{
	this.m_connectionJson.putString(oFF.OuDataProviderConnection.DATA_SOURCE_FQN, dataSourceName);
};
oFF.OuDataProviderConnection.prototype.setRepoJson = function(repoJson)
{
	let deepCopy = oFF.PrFactory.createStructureDeepCopy(repoJson);
	this.m_connectionJson.put(oFF.OuDataProviderConnection.REPO, deepCopy);
};
oFF.OuDataProviderConnection.prototype.setSfxJson = function(sfxJson)
{
	let deepCopy = oFF.PrFactory.createStructureDeepCopy(sfxJson);
	this.m_connectionJson.put(oFF.OuDataProviderConnection.SFX, deepCopy);
};
oFF.OuDataProviderConnection.prototype.setStartWithAutoFetch = function(startWithAutoFetch)
{
	this.m_connectionJson.putBoolean(oFF.OuDataProviderConnection.START_WITH_AUTO_FETCH, startWithAutoFetch);
};
oFF.OuDataProviderConnection.prototype.setSystemName = function(systemName)
{
	this.m_connectionJson.putString(oFF.OuDataProviderConnection.SYSTEM_NAME, systemName);
};
oFF.OuDataProviderConnection.prototype.setUseExitVariableValuesForSetup = function(useExitVariableValuesForSetup)
{
	this.m_connectionJson.putBoolean(oFF.OuDataProviderConnection.USE_EXIT_VARIABLES_VALUES_FOR_SETUP, useExitVariableValuesForSetup);
};
oFF.OuDataProviderConnection.prototype.setVisualizations = function(visualizations)
{
	let deepCopy = oFF.PrList.createDeepCopy(visualizations);
	this.m_connectionJson.put(oFF.OuDataProviderConnection.VISUALIZATIONS, deepCopy);
};
oFF.OuDataProviderConnection.prototype.setupConfig = function(application)
{
	this.setup();
	this.m_application = application;
	this.m_connectionJson = oFF.PrFactory.createStructure();
	this.setupDefaults();
};
oFF.OuDataProviderConnection.prototype.setupDefaults = function()
{
	this.setVisualizations(oFF.PrFactory.createList());
	this.setStartWithAutoFetch(true);
};

oFF.OuDataProviderEventListenerCollection = function() {};
oFF.OuDataProviderEventListenerCollection.prototype = new oFF.XObject();
oFF.OuDataProviderEventListenerCollection.prototype._ff_c = "OuDataProviderEventListenerCollection";

oFF.OuDataProviderEventListenerCollection.create = function(eventTemplate)
{
	let obj = new oFF.OuDataProviderEventListenerCollection();
	obj.setupExt(eventTemplate);
	return obj;
};
oFF.OuDataProviderEventListenerCollection.prototype.m_eventType = null;
oFF.OuDataProviderEventListenerCollection.prototype.m_listener = null;
oFF.OuDataProviderEventListenerCollection.prototype.callListener = function(event)
{
	this.m_listener.accept(event);
};
oFF.OuDataProviderEventListenerCollection.prototype.getListener = function()
{
	return this.m_listener;
};
oFF.OuDataProviderEventListenerCollection.prototype.getName = function()
{
	return this.m_eventType.getName();
};
oFF.OuDataProviderEventListenerCollection.prototype.releaseObject = function()
{
	this.m_eventType = null;
	this.m_listener = oFF.XObjectExt.release(this.m_listener);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuDataProviderEventListenerCollection.prototype.setupExt = function(eventTemplate)
{
	this.m_eventType = eventTemplate.getEventType();
	this.m_listener = oFF.XConsumerCollection.create();
};

oFF.OuDataProviderHooks = function() {};
oFF.OuDataProviderHooks.prototype = new oFF.XObject();
oFF.OuDataProviderHooks.prototype._ff_c = "OuDataProviderHooks";

oFF.OuDataProviderHooks.createHooks = function()
{
	let obj = new oFF.OuDataProviderHooks();
	obj.setupExt(null);
	return obj;
};
oFF.OuDataProviderHooks.createHooksWithOther = function(otherHooks)
{
	let obj = new oFF.OuDataProviderHooks();
	obj.setupExt(otherHooks);
	return obj;
};
oFF.OuDataProviderHooks.prototype.m_afterRepoLoadHooks = null;
oFF.OuDataProviderHooks.prototype.m_afterSfxLoadHooks = null;
oFF.OuDataProviderHooks.prototype.m_afterVisualizationLoadHooks = null;
oFF.OuDataProviderHooks.prototype.m_beforeRepoLoadHooks = null;
oFF.OuDataProviderHooks.prototype.m_beforeSfxLoadHooks = null;
oFF.OuDataProviderHooks.prototype.m_beforeVisualizationLoadHooks = null;
oFF.OuDataProviderHooks.prototype.m_finalizeQueryManagerHooks = null;
oFF.OuDataProviderHooks.prototype.m_finalizeVariablesHooks = null;
oFF.OuDataProviderHooks.prototype.m_queryManagerCreatedHooks = null;
oFF.OuDataProviderHooks.prototype.m_serviceConfigCreatedHooks = null;
oFF.OuDataProviderHooks.prototype.getAfterRepoLoadHooks = function()
{
	return this.m_afterRepoLoadHooks;
};
oFF.OuDataProviderHooks.prototype.getAfterRepoLoadRegister = function()
{
	return this.m_afterRepoLoadHooks;
};
oFF.OuDataProviderHooks.prototype.getAfterSfxLoadHooks = function()
{
	return this.m_afterSfxLoadHooks;
};
oFF.OuDataProviderHooks.prototype.getAfterSfxLoadRegister = function()
{
	return this.m_afterSfxLoadHooks;
};
oFF.OuDataProviderHooks.prototype.getAfterVisualizationLoadHooks = function()
{
	return this.m_afterVisualizationLoadHooks;
};
oFF.OuDataProviderHooks.prototype.getAfterVisualizationLoadRegister = function()
{
	return this.m_afterVisualizationLoadHooks;
};
oFF.OuDataProviderHooks.prototype.getBeforeRepoLoadHooks = function()
{
	return this.m_beforeRepoLoadHooks;
};
oFF.OuDataProviderHooks.prototype.getBeforeRepoLoadRegister = function()
{
	return this.m_beforeRepoLoadHooks;
};
oFF.OuDataProviderHooks.prototype.getBeforeSfxLoadHooks = function()
{
	return this.m_beforeSfxLoadHooks;
};
oFF.OuDataProviderHooks.prototype.getBeforeSfxLoadRegister = function()
{
	return this.m_beforeSfxLoadHooks;
};
oFF.OuDataProviderHooks.prototype.getBeforeVisualizationLoadHooks = function()
{
	return this.m_beforeVisualizationLoadHooks;
};
oFF.OuDataProviderHooks.prototype.getBeforeVisualizationLoadRegister = function()
{
	return this.m_beforeVisualizationLoadHooks;
};
oFF.OuDataProviderHooks.prototype.getFinalizeQueryManagerHooks = function()
{
	return this.m_finalizeQueryManagerHooks;
};
oFF.OuDataProviderHooks.prototype.getFinalizeQueryManagerRegister = function()
{
	return this.m_finalizeQueryManagerHooks;
};
oFF.OuDataProviderHooks.prototype.getFinalizeVariablesHooks = function()
{
	return this.m_finalizeVariablesHooks;
};
oFF.OuDataProviderHooks.prototype.getFinalizeVariablesRegister = function()
{
	return this.m_finalizeVariablesHooks;
};
oFF.OuDataProviderHooks.prototype.getQueryManagerCreatedHooks = function()
{
	return this.m_queryManagerCreatedHooks;
};
oFF.OuDataProviderHooks.prototype.getQueryManagerCreatedRegister = function()
{
	return this.m_queryManagerCreatedHooks;
};
oFF.OuDataProviderHooks.prototype.getServiceConfigCreatedHooks = function()
{
	return this.m_serviceConfigCreatedHooks;
};
oFF.OuDataProviderHooks.prototype.getServiceConfigCreatedRegister = function()
{
	return this.m_serviceConfigCreatedHooks;
};
oFF.OuDataProviderHooks.prototype.releaseObject = function()
{
	this.m_serviceConfigCreatedHooks = oFF.XObjectExt.release(this.m_serviceConfigCreatedHooks);
	this.m_queryManagerCreatedHooks = oFF.XObjectExt.release(this.m_queryManagerCreatedHooks);
	this.m_beforeSfxLoadHooks = oFF.XObjectExt.release(this.m_beforeSfxLoadHooks);
	this.m_afterSfxLoadHooks = oFF.XObjectExt.release(this.m_afterSfxLoadHooks);
	this.m_beforeRepoLoadHooks = oFF.XObjectExt.release(this.m_beforeRepoLoadHooks);
	this.m_afterRepoLoadHooks = oFF.XObjectExt.release(this.m_afterRepoLoadHooks);
	this.m_beforeVisualizationLoadHooks = oFF.XObjectExt.release(this.m_beforeVisualizationLoadHooks);
	this.m_afterVisualizationLoadHooks = oFF.XObjectExt.release(this.m_afterVisualizationLoadHooks);
	this.m_finalizeVariablesHooks = oFF.XObjectExt.release(this.m_finalizeVariablesHooks);
	this.m_finalizeQueryManagerHooks = oFF.XObjectExt.release(this.m_finalizeQueryManagerHooks);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuDataProviderHooks.prototype.setupExt = function(otherHooks)
{
	this.m_serviceConfigCreatedHooks = oFF.XBiFunctionCollection.create();
	this.m_queryManagerCreatedHooks = oFF.XFunctionCollection.create();
	this.m_beforeSfxLoadHooks = oFF.XBiFunctionCollection.create();
	this.m_afterSfxLoadHooks = oFF.XFunctionCollection.create();
	this.m_beforeRepoLoadHooks = oFF.XBiFunctionCollection.create();
	this.m_afterRepoLoadHooks = oFF.XFunctionCollection.create();
	this.m_beforeVisualizationLoadHooks = oFF.XBiFunctionCollection.create();
	this.m_afterVisualizationLoadHooks = oFF.XBiFunctionCollection.create();
	this.m_finalizeVariablesHooks = oFF.XFunctionCollection.create();
	this.m_finalizeQueryManagerHooks = oFF.XFunctionCollection.create();
	if (oFF.notNull(otherHooks))
	{
		oFF.XCollectionUtils.forEach(otherHooks.getServiceConfigCreatedRegister(), (x) => {
			this.m_serviceConfigCreatedHooks.addBiFunction(x);
		});
		oFF.XCollectionUtils.forEach(otherHooks.getQueryManagerCreatedRegister(), (x) => {
			this.m_queryManagerCreatedHooks.addFunction(x);
		});
		oFF.XCollectionUtils.forEach(otherHooks.getBeforeSfxLoadRegister(), (x) => {
			this.m_beforeSfxLoadHooks.addBiFunction(x);
		});
		oFF.XCollectionUtils.forEach(otherHooks.getAfterSfxLoadRegister(), (x) => {
			this.m_afterSfxLoadHooks.addFunction(x);
		});
		oFF.XCollectionUtils.forEach(otherHooks.getBeforeRepoLoadRegister(), (x) => {
			this.m_beforeRepoLoadHooks.addBiFunction(x);
		});
		oFF.XCollectionUtils.forEach(otherHooks.getAfterRepoLoadRegister(), (x) => {
			this.m_afterRepoLoadHooks.addFunction(x);
		});
		oFF.XCollectionUtils.forEach(otherHooks.getBeforeVisualizationLoadRegister(), (x) => {
			this.m_beforeVisualizationLoadHooks.addBiFunction(x);
		});
		oFF.XCollectionUtils.forEach(otherHooks.getAfterVisualizationLoadRegister(), (x) => {
			this.m_afterVisualizationLoadHooks.addBiFunction(x);
		});
		oFF.XCollectionUtils.forEach(otherHooks.getFinalizeVariablesRegister(), (x) => {
			this.m_finalizeVariablesHooks.addFunction(x);
		});
		oFF.XCollectionUtils.forEach(otherHooks.getFinalizeQueryManagerRegister(), (x) => {
			this.m_finalizeQueryManagerHooks.addFunction(x);
		});
	}
};

oFF.OuDataProviderActionSequence = function() {};
oFF.OuDataProviderActionSequence.prototype = new oFF.OuDataProviderAction();
oFF.OuDataProviderActionSequence.prototype._ff_c = "OuDataProviderActionSequence";

oFF.OuDataProviderActionSequence.create = function()
{
	return new oFF.OuDataProviderActionSequence();
};
oFF.OuDataProviderActionSequence.prototype.evalParameters = function(context, params, i)
{
	if (i >= this.getParameters().size())
	{
		return oFF.XPromise.resolve(params);
	}
	return this.getParameters().get(i).execute(context).onThenPromise((res) => {
		params.add(res);
		return this.evalParameters(context, params, i + 1);
	});
};
oFF.OuDataProviderActionSequence.prototype.execute = function(context)
{
	return this.evalParameters(context, oFF.XList.create(), 0).onThenExt((list) => {
		return context.getEnvironment().resolveString("${ans}");
	});
};

oFF.OuDataProviderActionStringLiteral = function() {};
oFF.OuDataProviderActionStringLiteral.prototype = new oFF.OuDataProviderAction();
oFF.OuDataProviderActionStringLiteral.prototype._ff_c = "OuDataProviderActionStringLiteral";

oFF.OuDataProviderActionStringLiteral.create = function(constant)
{
	let obj = new oFF.OuDataProviderActionStringLiteral();
	obj.m_constant = constant;
	return obj;
};
oFF.OuDataProviderActionStringLiteral.prototype.m_constant = null;
oFF.OuDataProviderActionStringLiteral.prototype.execute = function(context)
{
	return oFF.XPromise.resolve(context.getEnvironment().resolveString(this.m_constant));
};
oFF.OuDataProviderActionStringLiteral.prototype.toString = function()
{
	return this.m_constant;
};

oFF.OuDataProviderConnector = function() {};
oFF.OuDataProviderConnector.prototype = new oFF.XObject();
oFF.OuDataProviderConnector.prototype._ff_c = "OuDataProviderConnector";

oFF.OuDataProviderConnector.create = function(dataProvider)
{
	let obj = new oFF.OuDataProviderConnector();
	obj.setupExt(dataProvider);
	return obj;
};
oFF.OuDataProviderConnector.prototype.m_connection = null;
oFF.OuDataProviderConnector.prototype.m_connectionPromise = null;
oFF.OuDataProviderConnector.prototype.m_dataProvider = null;
oFF.OuDataProviderConnector.prototype.m_defaultFinalizeQueryManagerId = null;
oFF.OuDataProviderConnector.prototype.activateAllDefaultHooks = function()
{
	this.activateDefaultFinalizeQueryManagerHook();
};
oFF.OuDataProviderConnector.prototype.activateDefaultFinalizeQueryManagerHook = function()
{
	this.m_defaultFinalizeQueryManagerId = this.getHooks().getFinalizeQueryManagerHooks().addFunction(this.defaultFinalizeQueryManager.bind(this));
};
oFF.OuDataProviderConnector.prototype.applyFilterFromVariables = function(filters)
{
	let queryModel = this.m_dataProvider.getQueryManager().getQueryModel();
	let dynamicFilter = queryModel.getFilter().getDynamicFilter();
	let keys = filters.getKeysAsIterator();
	while (keys.hasNext())
	{
		let dimName = keys.next();
		let variableFilter = filters.getByKey(dimName);
		let dimension = queryModel.getDimensionByName(dimName);
		let cartesianList = dynamicFilter.getCartesianListWithDefault(dimension);
		cartesianList.deserializeFromElementExt(oFF.QModelFormat.INA_REPOSITORY, variableFilter.serializeToElement(oFF.QModelFormat.INA_REPOSITORY));
	}
};
oFF.OuDataProviderConnector.prototype.createQueryManager = function(queryServiceConfig, correlationId)
{
	return oFF.XPromise.create((resolve, reject) => {
		let config = this.m_dataProvider.getConfig();
		let syncType = config.getApplication().getDefaultSyncType();
		queryServiceConfig.processQueryManagerCreation(syncType, oFF.OuQueryManagerCreationListenerLambda.createSingleUse((result) => {
			if (result.hasErrors())
			{
				reject(oFF.MessageUtil.condenseMessagesToSingleError(result));
				return;
			}
			let queryManager = result.getData();
			this.m_dataProvider.setQueryManager(queryManager);
			this.handleHookWithParam(this.getHooks().getQueryManagerCreatedHooks(), this.m_dataProvider, correlationId).onThen((empty) => {
				resolve(null);
			});
		}), null);
	});
};
oFF.OuDataProviderConnector.prototype.createQueryServiceConfig = function(correlationId)
{
	let config = this.m_dataProvider.getConfig();
	let application = config.getApplication();
	let dataSource = this.m_connection.getDataSource();
	let serviceConfig = oFF.QueryServiceConfig.createWithDataSource(application, dataSource.getSystemName(), dataSource);
	return this.handleHookWithParam2(this.getHooks().getServiceConfigCreatedHooks(), this.m_dataProvider, serviceConfig, correlationId).onThenExt((empty) => {
		return serviceConfig;
	});
};
oFF.OuDataProviderConnector.prototype.createVisualizationFromJson = function(jsonViz)
{
	let vizName = jsonViz.getStringByKey(oFF.OuDataProviderConfiguration.VIZ_NAME);
	let type = jsonViz.getStringByKey(oFF.OuDataProviderConfiguration.VIZ_TYPE);
	let protocol = jsonViz.getStringByKey(oFF.OuDataProviderConfiguration.VIZ_PROTOCOL);
	let defaultChartType = jsonViz.getStringByKey(oFF.OuDataProviderConfiguration.VIZ_CHART_TYPE);
	let active = jsonViz.getBooleanByKey(oFF.OuDataProviderConfiguration.VIZ_ACTIVE);
	if (oFF.XStringUtils.isNullOrEmpty(vizName) || oFF.XStringUtils.isNullOrEmpty(type))
	{
		return null;
	}
	let protocolBindingType = oFF.ProtocolBindingType.lookup(protocol);
	let vizType = oFF.VisualizationType.lookup(type);
	if (oFF.isNull(vizType))
	{
		return null;
	}
	if (oFF.isNull(protocolBindingType))
	{
		protocolBindingType = vizType.getDefaultProtocolBindingType();
	}
	let chartType = oFF.ChartType.lookup(defaultChartType);
	let visualizationManager = this.m_dataProvider.getQueryManager().getQueryModel().getVisualizationManager();
	let definition = visualizationManager.getOrCreateVisualisationDefinition(vizName, protocolBindingType, vizType.getSemanticBindingType());
	if (oFF.notNull(chartType) && vizType === oFF.VisualizationType.CHART)
	{
		let chartDefinition = definition;
		chartDefinition.getChartSetting().setChartType(chartType);
	}
	if (active)
	{
		visualizationManager.setCurrentActiveVisualizationDefinition(definition);
	}
	return definition;
};
oFF.OuDataProviderConnector.prototype.deactivateAllDefaultHooks = function()
{
	this.deactivateDefaultFinalizeQueryManagerHook();
};
oFF.OuDataProviderConnector.prototype.deactivateDefaultFinalizeQueryManagerHook = function()
{
	this.getHooks().getFinalizeQueryManagerHooks().removeFunctionByUuid(this.m_defaultFinalizeQueryManagerId);
	this.m_defaultFinalizeQueryManagerId = null;
};
oFF.OuDataProviderConnector.prototype.defaultFinalizeQueryManager = function(dataProvider)
{
	let cmd = dataProvider.getQueryManager().getConvenienceCommands();
	if (cmd.getModelCapabilities().supportsUniqueAxisProperties())
	{
		let queryModel = cmd.getQueryModel();
		let uniqueAxisProperties = queryModel.getReturnedUniqueAxisProperties();
		let leadingStructure = queryModel.isLeadingStructureAccount() ? queryModel.getAccountDimension() : queryModel.getMeasureDimension();
		if (oFF.notNull(uniqueAxisProperties) && !oFF.XCollectionUtils.hasElements(uniqueAxisProperties.getRowProperties()) && !oFF.XCollectionUtils.hasElements(uniqueAxisProperties.getColumnProperties()) && oFF.notNull(leadingStructure))
		{
			cmd.toggleUniqueAxisProperties(null, oFF.UniqueAxisPropertyType.UNIT_INDEX, true);
			cmd.toggleUniqueAxisProperties(null, oFF.UniqueAxisPropertyType.NUMERIC_SHIFT, true);
			cmd.toggleUniqueAxisProperties(null, oFF.UniqueAxisPropertyType.CELL_VALUE_TYPES, true);
		}
	}
	return null;
};
oFF.OuDataProviderConnector.prototype.finalizeQueryManager = function(correlationId)
{
	return this.handleHookWithParam(this.getHooks().getFinalizeQueryManagerHooks(), this.m_dataProvider, correlationId).onThenPromise((empty) => {
		if (!this.m_connection.isStartWithAutoFetch())
		{
			return oFF.XPromise.resolve(null);
		}
		let usingExitVariableValuesForSetup = this.m_connection.isUsingExitVariableValuesForSetup();
		this.setExitVariablesWinControl(usingExitVariableValuesForSetup);
		let resultingBase = this.m_dataProvider.getResultingBase();
		resultingBase.setAutoFetchActiveInternal(true);
		return resultingBase.fetchNewResultSet(correlationId).onThenExt((result) => {
			this.setExitVariablesWinControl(false);
			return null;
		});
	});
};
oFF.OuDataProviderConnector.prototype.getCurrentConnected = function()
{
	return this.m_connection;
};
oFF.OuDataProviderConnector.prototype.getDimensionMemberExitVariablesForFilters = function()
{
	let queryManager = this.m_dataProvider.getQueryManager();
	return oFF.XStream.of(queryManager.getVariables()).filter((variable) => {
		if (variable.isTechnicalVariable() || !variable.getVariableType().isTypeOf(oFF.VariableType.DIMENSION_MEMBER_VARIABLE))
		{
			return false;
		}
		let dimVar = variable;
		return dimVar.isEnforcedDynamicValue() && dimVar.isUsedInDynamicFilter() || !dimVar.isInputEnabled();
	}).map((variable2) => {
		return variable2;
	}).collect(oFF.XStreamCollector.toList());
};
oFF.OuDataProviderConnector.prototype.getExitAndDynamicVariableUpdatePromise = function(correlationId)
{
	if (!this.m_connection.isUsingExitVariableValuesForSetup())
	{
		return oFF.XPromise.resolve(null);
	}
	return oFF.XPromise.create((resolve, reject) => {
		let queryManager = this.m_dataProvider.getQueryManager();
		let syncType = queryManager.getSession().getDefaultSyncType();
		queryManager.resetExitOrUpdateDynamicVariable(syncType, oFF.OuQueryExecutionListenerLambda.createSingleUse((exitResult) => {
			if (exitResult.hasErrors())
			{
				let errorEvt = this.m_dataProvider.getEventing().getEmitterForError().newTypedEvent();
				errorEvt.addError(oFF.MessageUtil.condenseMessagesToSingleError(exitResult));
				errorEvt.setCorrelationId(correlationId);
				errorEvt.queue();
			}
			resolve(null);
		}), null, true);
	});
};
oFF.OuDataProviderConnector.prototype.getFilterFromVariables = function(variablesHaveBeenChanged)
{
	let filters = oFF.XHashMapByString.create();
	if (!this.m_connection.isUsingExitVariableValuesForSetup() && !variablesHaveBeenChanged)
	{
		return filters;
	}
	let variablesToPreserve = oFF.XList.create();
	if (variablesHaveBeenChanged)
	{
		oFF.XCollectionUtils.addAllIfNotPresent(variablesToPreserve, this.getInputEnabledVarsUsedInFilter());
	}
	if (this.m_connection.isUsingExitVariableValuesForSetup())
	{
		oFF.XCollectionUtils.addAllIfNotPresent(variablesToPreserve, this.getDimensionMemberExitVariablesForFilters());
	}
	let queryModel = this.m_dataProvider.getQueryManager().getQueryModel();
	let dynamicFilter = queryModel.getFilter().getDynamicFilter();
	for (let i = 0; i < variablesToPreserve.size(); i++)
	{
		let dimVar = variablesToPreserve.get(i);
		let dimension = dimVar.getDimension();
		let cartesianList = dynamicFilter.getCartesianList(dimension);
		if (oFF.notNull(cartesianList))
		{
			filters.put(dimension.getName(), cartesianList.cloneOlapComponent(queryModel, null));
		}
	}
	return filters;
};
oFF.OuDataProviderConnector.prototype.getHooks = function()
{
	return this.m_dataProvider.getHooksBase();
};
oFF.OuDataProviderConnector.prototype.getInputEnabledVarsUsedInFilter = function()
{
	let queryManager = this.m_dataProvider.getQueryManager();
	return oFF.XStream.of(queryManager.getInputEnabledAndNonTechnicalVariables()).filter((variable) => {
		if (!variable.getVariableType().isTypeOf(oFF.VariableType.DIMENSION_MEMBER_VARIABLE))
		{
			return false;
		}
		let dimVar = variable;
		return dimVar.isUsedInDynamicFilter();
	}).map((variable2) => {
		return variable2;
	}).collect(oFF.XStreamCollector.toList());
};
oFF.OuDataProviderConnector.prototype.handleHookWithParam = function(hooks, value, correlationId)
{
	return this.handleHookWithResult(hooks, value, null, correlationId).onThenExt((result) => {
		return null;
	});
};
oFF.OuDataProviderConnector.prototype.handleHookWithParam2 = function(hooks, value1, value2, correlationId)
{
	if (!oFF.XCollectionUtils.hasElements(hooks))
	{
		return oFF.XPromise.resolve(null);
	}
	let hookPromise = oFF.XPromise.resolve(null);
	let hookLambdas = hooks.getValuesAsReadOnlyList();
	for (let i = 0; i < hookLambdas.size(); i++)
	{
		let current = hookLambdas.get(i);
		hookPromise = hookPromise.onThenPromise((empty) => {
			return current(value1, value2);
		});
	}
	hookPromise.onCatch((err) => {
		this.queueErrorEvent(err, correlationId);
		throw oFF.XException.createExceptionForRethrowWithDefault(err.getThrowable(), err.getText());
	});
	return hookPromise;
};
oFF.OuDataProviderConnector.prototype.handleHookWithResult = function(hooks, value, defaultValue, correlationId)
{
	if (!oFF.XCollectionUtils.hasElements(hooks))
	{
		return oFF.XPromise.resolve(oFF.XCollectionUtils.singletonList(defaultValue));
	}
	let hookPromise = oFF.XPromise.resolve(defaultValue);
	let allResults = oFF.XList.create();
	let hookLambdas = hooks.getValuesAsReadOnlyList();
	for (let i = 0; i < hookLambdas.size(); i++)
	{
		let current = hookLambdas.get(i);
		hookPromise = hookPromise.onThenPromise((result) => {
			return current(value);
		}).onThen((currentResult) => {
			allResults.add(currentResult);
		});
	}
	hookPromise.onCatch((err) => {
		this.queueErrorEvent(err, correlationId);
		throw oFF.XException.createExceptionForRethrowWithDefault(err.getThrowable(), err.getText());
	});
	return hookPromise.onThenExt((result) => {
		return allResults;
	});
};
oFF.OuDataProviderConnector.prototype.loadRepo = function(repoJson)
{
	this.m_connection.setRepoJson(repoJson);
	let queryManager = this.m_dataProvider.getQueryManager();
	let config = this.m_dataProvider.getConfig();
	let modelFormat = config.isRepoDeltaEnabled() ? oFF.QModelFormat.INA_REPOSITORY_DELTA : oFF.QModelFormat.INA_REPOSITORY;
	let result = queryManager.getQueryModel().deserializeFromElementExt(modelFormat, repoJson);
	if (result.hasErrors())
	{
		return oFF.XPromise.reject(oFF.MessageUtil.condenseMessagesToSingleError(result));
	}
	return oFF.XPromise.resolve(null);
};
oFF.OuDataProviderConnector.prototype.loadRepoAfterClassicSubmit = function(variablesHaveBeenChanged, correlationId)
{
	let repoJson = this.m_connection.getRepoJson() !== null ? this.m_connection.getRepoJson() : oFF.PrFactory.createStructure();
	return this.handleHookWithParam2(this.getHooks().getBeforeRepoLoadHooks(), this.m_dataProvider, repoJson, correlationId).onThenPromise((empty) => {
		let queryManager = this.m_dataProvider.getQueryManager();
		if (!oFF.XCollectionUtils.hasElements(repoJson))
		{
			return this.handleHookWithParam(this.getHooks().getAfterRepoLoadHooks(), this.m_dataProvider, correlationId);
		}
		let config = this.m_dataProvider.getConfig();
		let queryModel = queryManager.getQueryModel();
		let modelFormat = config.isRepoDeltaEnabled() ? oFF.QModelFormat.INA_REPOSITORY_DELTA : oFF.QModelFormat.INA_REPOSITORY;
		let variableValues = queryModel.getVariableContainer().serializeToElement(modelFormat);
		let variablesFilter = this.getFilterFromVariables(variablesHaveBeenChanged);
		return this.loadRepo(repoJson).onThenPromise((empty2) => {
			if (oFF.notNull(variableValues))
			{
				let result = queryModel.getVariableContainer().deserializeFromElementExt(modelFormat, variableValues);
				if (result.hasErrors())
				{
					return oFF.XPromise.reject(oFF.MessageUtil.condenseMessagesToSingleError(result));
				}
			}
			this.applyFilterFromVariables(variablesFilter);
			return this.handleHookWithParam(this.getHooks().getAfterRepoLoadHooks(), this.m_dataProvider, correlationId);
		});
	});
};
oFF.OuDataProviderConnector.prototype.loadRepoBeforeSubmit = function(correlationId)
{
	let repoJson = this.m_connection.getRepoJson() !== null ? this.m_connection.getRepoJson() : oFF.PrFactory.createStructure();
	return this.handleHookWithParam2(this.getHooks().getBeforeRepoLoadHooks(), this.m_dataProvider, repoJson, correlationId).onThenPromise((empty) => {
		let repoLoad;
		let queryManager = this.m_dataProvider.getQueryManager();
		if (!oFF.XCollectionUtils.hasElements(repoJson))
		{
			repoLoad = oFF.XPromise.resolve(null);
		}
		else if (this.m_dataProvider.isAutoSubmitEffective())
		{
			repoLoad = this.loadRepo(repoJson);
		}
		else
		{
			let config = this.m_dataProvider.getConfig();
			let modelFormat = config.isRepoDeltaEnabled() ? oFF.QModelFormat.INA_REPOSITORY_DELTA : oFF.QModelFormat.INA_REPOSITORY;
			queryManager.getQueryModel().getVariableContainer().deserializeFromElementExt(modelFormat, repoJson);
			repoLoad = oFF.XPromise.resolve(null);
		}
		return repoLoad.onThenPromise((empty2) => {
			return this.handleHookWithParam(this.getHooks().getAfterRepoLoadHooks(), this.m_dataProvider, correlationId);
		});
	});
};
oFF.OuDataProviderConnector.prototype.loadSfx = function(correlationId)
{
	let sfxJson = this.m_connection.getSfxJson() !== null ? this.m_connection.getSfxJson() : oFF.PrFactory.createStructure();
	return this.handleHookWithParam2(this.getHooks().getBeforeSfxLoadHooks(), this.m_dataProvider, sfxJson, correlationId).onThenPromise((empty) => {
		let queryManager = this.m_dataProvider.getQueryManager();
		if (oFF.XCollectionUtils.hasElements(sfxJson))
		{
			this.m_connection.setSfxJson(sfxJson);
			let queryModel = queryManager.getQueryModel();
			queryModel.stopEventing();
			let result = queryModel.deserializeFromElementExt(oFF.QModelFormat.INA_REPOSITORY, sfxJson);
			queryModel.resumeEventing();
			if (result.hasErrors())
			{
				return oFF.XPromise.reject(oFF.MessageUtil.condenseMessagesToSingleError(result));
			}
		}
		return this.handleHookWithParam(this.getHooks().getAfterSfxLoadHooks(), this.m_dataProvider, correlationId);
	});
};
oFF.OuDataProviderConnector.prototype.loadVisualizations = function(correlationId)
{
	let visualizationJson = this.m_connection.getVisualizations();
	return this.handleHookWithParam2(this.getHooks().getBeforeVisualizationLoadHooks(), this.m_dataProvider, visualizationJson, correlationId).onThenPromise((empty) => {
		let visualizations = oFF.XList.create();
		for (let index = 0; index < visualizationJson.size(); index++)
		{
			let visualization = visualizationJson.getStructureAt(index);
			oFF.XCollectionUtils.addIfNotNull(visualizations, this.createVisualizationFromJson(visualization));
		}
		return this.handleHookWithParam2(this.getHooks().getAfterVisualizationLoadHooks(), this.m_dataProvider, visualizations, correlationId);
	});
};
oFF.OuDataProviderConnector.prototype.processClassicSubmitIfNecessary = function(correlationId)
{
	let corrId = oFF.notNull(correlationId) ? correlationId : oFF.XGuid.getGuid();
	return this.handleHookWithResult(this.getHooks().getFinalizeVariablesHooks(), this.m_dataProvider, oFF.XBooleanValue.create(false), corrId).onThenPromise((variablesChanged) => {
		if (this.m_dataProvider.isAutoSubmitEffective())
		{
			return oFF.XPromise.resolve(null);
		}
		let variablesHaveBeenChanged = oFF.XCollectionUtils.contains(variablesChanged, (change) => {
			return change.getBoolean();
		});
		return oFF.XPromise.create((resolve, reject) => {
			let queryManager = this.m_dataProvider.getQueryManager();
			let syncType = this.m_dataProvider.getApplication().getDefaultSyncType();
			queryManager.submitVariables(syncType, oFF.VariableProcessorCallbackLambda.createSingleUse((result) => {
				if (result.hasErrors())
				{
					let errorEvt = this.m_dataProvider.getEventing().getEmitterForError().newTypedEvent();
					errorEvt.addError(oFF.MessageUtil.condenseMessagesToSingleError(result));
					errorEvt.setCorrelationId(corrId);
					errorEvt.queue();
					reject(oFF.MessageUtil.condenseMessagesToSingleError(result));
					return;
				}
				this.loadSfx(corrId).onThenPromise((empty1) => {
					return this.loadRepoAfterClassicSubmit(variablesHaveBeenChanged, corrId);
				}).onThen((empty2) => {
					resolve(null);
				}).onCatch(reject);
			}), null);
		});
	});
};
oFF.OuDataProviderConnector.prototype.processConnectionSetup = function(correlationId)
{
	let corrId = oFF.notNull(correlationId) ? correlationId : oFF.XGuid.getGuid();
	if (oFF.isNull(this.m_connection))
	{
		let error = oFF.XError.create("DataProvider Connector has no connection config set");
		let errorEvt = this.m_dataProvider.getEventing().getEmitterForError().newTypedEvent();
		errorEvt.setCorrelationId(corrId);
		errorEvt.addError(error);
		errorEvt.queue();
		return oFF.XPromise.reject(error);
	}
	if (oFF.notNull(this.m_connectionPromise) && this.m_connectionPromise.getState() === oFF.XPromiseState.PENDING)
	{
		return this.m_connectionPromise;
	}
	this.m_dataProvider.getEventingBase().setEventingPaused(true);
	this.m_connectionPromise = this.createQueryServiceConfig(corrId).onThenPromise((serviceConfig) => {
		return this.createQueryManager(serviceConfig, corrId);
	}).onThenPromise((empty0) => {
		return this.loadSfx(corrId);
	}).onThenPromise((empty1) => {
		return this.loadRepoBeforeSubmit(corrId);
	}).onThenPromise((empty2) => {
		return this.loadVisualizations(corrId);
	}).onThenPromise((empty3) => {
		return this.getExitAndDynamicVariableUpdatePromise(corrId);
	}).onThenPromise((empty4) => {
		return this.processClassicSubmitIfNecessary(corrId);
	}).onThenPromise((empty5) => {
		return this.finalizeQueryManager(corrId);
	}).onCatch((err) => {
		let errorEvt = this.m_dataProvider.getEventing().getEmitterForError().newTypedEvent();
		errorEvt.addError(err);
		errorEvt.setCorrelationId(corrId);
		errorEvt.queue();
		throw oFF.XException.createExceptionForRethrowWithDefault(err.getThrowable(), err.getText());
	}).onFinally(() => {
		this.m_dataProvider.getEventingBase().setEventingPaused(false);
		this.m_dataProvider.updateLifecycle(corrId);
		this.m_connectionPromise = null;
	});
	return this.m_connectionPromise;
};
oFF.OuDataProviderConnector.prototype.processDisconnect = function(releaseConnection, correlationId)
{
	let corrId = oFF.notNull(correlationId) ? correlationId : oFF.XGuid.getGuid();
	let queryManager = this.m_dataProvider.getQueryManager();
	if (oFF.isNull(queryManager))
	{
		return oFF.XPromise.resolve(null);
	}
	if (!releaseConnection)
	{
		this.m_dataProvider.setQueryManager(null);
		this.m_dataProvider.updateLifecycle(corrId);
		return oFF.XPromise.resolve(null);
	}
	return oFF.XPromise.create((resolve, reject) => {
		queryManager.processShutdown(queryManager.getSession().getDefaultSyncType(), oFF.OuQueryManagerShutdownListenerLambda.createSingleUse((shutdownResult) => {
			if (shutdownResult.hasErrors())
			{
				reject(oFF.MessageUtil.condenseMessagesToSingleError(shutdownResult));
				return;
			}
			oFF.XObjectExt.release(queryManager);
			this.m_dataProvider.setQueryManager(null);
			this.m_dataProvider.updateLifecycle(corrId);
			resolve(null);
		}), null);
	});
};
oFF.OuDataProviderConnector.prototype.queueErrorEvent = function(error, correlationId)
{
	let errorEvt = this.m_dataProvider.getEventing().getEmitterForError().newTypedEvent();
	errorEvt.addError(error);
	errorEvt.setCorrelationId(correlationId);
	errorEvt.queue();
};
oFF.OuDataProviderConnector.prototype.releaseObject = function()
{
	this.m_dataProvider = null;
	this.m_connection = oFF.XObjectExt.release(this.m_connection);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuDataProviderConnector.prototype.setConnection = function(connection)
{
	this.m_connection = connection;
};
oFF.OuDataProviderConnector.prototype.setExitVariablesWinControl = function(winControl)
{
	let queryManager = this.m_dataProvider.getQueryManager();
	queryManager.stopEventing();
	let variables = queryManager.getVariables();
	oFF.XStream.of(variables).filter((variable) => {
		return variable.getVariableType().isTypeOf(oFF.VariableType.DIMENSION_MEMBER_VARIABLE);
	}).filter((variable2) => {
		return variable2.isDynamicOrExitVariable();
	}).map((normalVar) => {
		return normalVar;
	}).forEach((dimVar) => {
		dimVar.setWinControlInAutoSubmit(winControl);
	});
	queryManager.resumeEventing();
};
oFF.OuDataProviderConnector.prototype.setupExt = function(dataProvider)
{
	this.m_dataProvider = dataProvider;
	if (this.m_dataProvider.getConfig().shouldStartWithDefaultHooks())
	{
		this.activateAllDefaultHooks();
	}
};

oFF.OuDataProviderResulting = function() {};
oFF.OuDataProviderResulting.prototype = new oFF.XObject();
oFF.OuDataProviderResulting.prototype._ff_c = "OuDataProviderResulting";

oFF.OuDataProviderResulting.create = function(dataProviderBase)
{
	let obj = new oFF.OuDataProviderResulting();
	obj.setupExt(dataProviderBase);
	return obj;
};
oFF.OuDataProviderResulting.prototype.m_autoFetch = false;
oFF.OuDataProviderResulting.prototype.m_dataProvider = null;
oFF.OuDataProviderResulting.prototype.autoFetchResultSet = function(correlationId)
{
	if (this.m_autoFetch)
	{
		this.processQuery(correlationId, true);
	}
};
oFF.OuDataProviderResulting.prototype.autoFillVisualizations = function(correlationId)
{
	if (this.m_autoFetch)
	{
		let corrId = oFF.notNull(correlationId) ? correlationId : oFF.XGuid.getGuid();
		let fetchEvt = this.getEventing().getEmitterForResultDataFetch().newTypedEvent();
		fetchEvt.setCorrelationId(corrId);
		fetchEvt.setStep(oFF.OuDataProviderResultDataFetchStep.FETCH_STARTED);
		fetchEvt.queue();
		let messages = oFF.MessageManagerSimple.createMessageManager();
		this.processFillVisualizations(messages, correlationId).onThen((empty) => {
			let doneEvt = this.getEventing().getEmitterForResultDataFetch().newTypedEvent();
			doneEvt.setCorrelationId(corrId);
			doneEvt.setStep(oFF.OuDataProviderResultDataFetchStep.ALL_DONE);
			doneEvt.queue();
		});
	}
};
oFF.OuDataProviderResulting.prototype.fetchNewResultSet = function(correlationId)
{
	return this.processQuery(correlationId, false);
};
oFF.OuDataProviderResulting.prototype.fireAllDoneEvent = function(correlationId)
{
	let doneEvt = this.getEventing().getEmitterForResultDataFetch().newTypedEvent();
	doneEvt.setCorrelationId(correlationId);
	doneEvt.setStep(oFF.OuDataProviderResultDataFetchStep.ALL_DONE);
	doneEvt.queue();
};
oFF.OuDataProviderResulting.prototype.getEventing = function()
{
	return this.m_dataProvider.getEventingBase();
};
oFF.OuDataProviderResulting.prototype.handleGridFillResult = function(result, currentMessages, correlationId)
{
	currentMessages.addAllMessages(result);
	let fetchEvt = this.getEventing().getEmitterForResultDataFetch().newTypedEvent();
	fetchEvt.setCorrelationId(correlationId);
	fetchEvt.setStep(oFF.OuDataProviderResultDataFetchStep.GRID_COLLECTED);
	fetchEvt.addMessages(result);
	fetchEvt.queue();
	if (result.hasErrors())
	{
		let gridError = oFF.MessageUtil.condenseMessagesToSingleError(result);
		let errorEvt = this.getEventing().getEmitterForError().newTypedEvent();
		errorEvt.setCorrelationId(correlationId);
		errorEvt.addError(gridError);
		errorEvt.queue();
	}
};
oFF.OuDataProviderResulting.prototype.handleQueryResult = function(result, currentMessages, correlationId)
{
	currentMessages.addAllMessages(result);
	let fetchEvt = this.getEventing().getEmitterForResultDataFetch().newTypedEvent();
	fetchEvt.setCorrelationId(correlationId);
	fetchEvt.setStep(oFF.OuDataProviderResultDataFetchStep.QUERY_EXECUTED);
	fetchEvt.addMessages(result);
	fetchEvt.queue();
	if (result.hasErrors())
	{
		let error = oFF.MessageUtil.condenseMessagesToSingleError(result);
		let errorEvt = this.getEventing().getEmitterForError().newTypedEvent();
		errorEvt.setCorrelationId(correlationId);
		errorEvt.addError(error);
		errorEvt.queue();
	}
};
oFF.OuDataProviderResulting.prototype.handleVizFill = function(result, definition, currentMessages, correlationId)
{
	currentMessages.addAllMessages(result);
	if (result.hasErrors())
	{
		let vizError = oFF.MessageUtil.condenseMessagesToSingleError(result);
		let errorEvt = this.m_dataProvider.getEventing().getEmitterForError().newTypedEvent();
		errorEvt.setCorrelationId(correlationId);
		errorEvt.addError(vizError);
		errorEvt.queue();
	}
	else
	{
		let fetchEvt = this.getEventing().getEmitterForResultDataFetch().newTypedEvent();
		fetchEvt.setCorrelationId(correlationId);
		fetchEvt.setStep(oFF.OuDataProviderResultDataFetchStep.VISUALIZATION_FILLED);
		fetchEvt.addMessages(result);
		fetchEvt.addFilledVisualizationName(definition.getName());
		fetchEvt.queue();
	}
};
oFF.OuDataProviderResulting.prototype.isAutoFetchActive = function()
{
	return this.m_autoFetch;
};
oFF.OuDataProviderResulting.prototype.processDefinitionExecution = function(application, definition, currentMessages, correlationId)
{
	return oFF.XPromise.create((resolve, reject) => {
		this.timeout(this.m_dataProvider.getConfig().getDefaultWaitTimeout(), () => {
			definition.processExecutionGeneric(application.getDefaultSyncType(), oFF.OuGenericVisualizationObjectFilledListenerLambda.createSingleUse((result) => {
				this.handleVizFill(result, definition, currentMessages, correlationId);
				resolve(null);
			}), null);
		});
	});
};
oFF.OuDataProviderResulting.prototype.processFillVisualizations = function(currentMessages, correlationId)
{
	let queryManager = this.m_dataProvider.getQueryManager();
	let application = this.m_dataProvider.getApplication();
	let vizManager = queryManager.getQueryModel().getVisualizationManager();
	let definitions = vizManager.getVisualizationDefinitions();
	let fillPromise = oFF.XPromise.resolve(null);
	for (let i = 0; i < definitions.size(); i++)
	{
		let definition = definitions.get(i);
		fillPromise = fillPromise.onThenPromise((empty) => {
			return this.processDefinitionExecution(application, definition, currentMessages, correlationId);
		});
	}
	return fillPromise;
};
oFF.OuDataProviderResulting.prototype.processQuery = function(corrId, isAutoFetch)
{
	let queryManager = this.m_dataProvider.getQueryManager();
	if (oFF.isNull(queryManager))
	{
		return oFF.XPromise.resolve(null);
	}
	if (isAutoFetch && queryManager.hasInputEnabledVariables() && !queryManager.isDirectVariableTransferEnabled() && queryManager.getVariableProcessorState() === oFF.VariableProcessorState.CHANGEABLE_STARTUP)
	{
		return oFF.XPromise.resolve(null);
	}
	let correlationId = oFF.notNull(corrId) ? corrId : oFF.XGuid.getGuid();
	let fetchEvt = this.getEventing().getEmitterForResultDataFetch().newTypedEvent();
	fetchEvt.setCorrelationId(correlationId);
	fetchEvt.setStep(oFF.OuDataProviderResultDataFetchStep.FETCH_STARTED);
	fetchEvt.queue();
	let fetchPromise;
	if (queryManager.getQueryModel().getVisualizationManager().getGridCollector() !== null)
	{
		fetchPromise = this.processQueryWithGrid(correlationId);
	}
	else
	{
		fetchPromise = this.processQueryWithoutGrid(correlationId);
	}
	fetchPromise.onCatch((err) => {
		let errorEvt = this.getEventing().getEmitterForError().newTypedEvent();
		errorEvt.setCorrelationId(correlationId);
		errorEvt.addError(err);
		errorEvt.queue();
	});
	fetchPromise.onFinally(() => {
		this.fireAllDoneEvent(correlationId);
	});
	return fetchPromise;
};
oFF.OuDataProviderResulting.prototype.processQueryWithGrid = function(correlationId)
{
	return oFF.XPromise.create((resolve, reject) => {
		let application = this.m_dataProvider.getApplication();
		let messages = oFF.MessageManagerSimple.createMessageManager();
		let gridCollector = this.m_dataProvider.getQueryManager().getQueryModel().getVisualizationManager().getSynchronizedGridCollector();
		let queryListener = oFF.OuQueryExecutionListenerLambda.createSingleUse((result) => {
			this.handleQueryResult(result, messages, correlationId);
		});
		let gridListener = oFF.OuGridCollectorListenerLambda.createSingleUse((result) => {
			this.handleGridFillResult(result, messages, correlationId);
			this.processFillVisualizations(messages, correlationId).onCatch((err) => {
				reject(err);
			}).onThen((empty2) => {
				resolve(messages);
			});
		});
		gridCollector.processExecution(application.getDefaultSyncType(), gridListener, queryListener, null);
	});
};
oFF.OuDataProviderResulting.prototype.processQueryWithoutGrid = function(correlationId)
{
	return oFF.XPromise.create((resolve, reject) => {
		let application = this.m_dataProvider.getApplication();
		let messages = oFF.MessageManagerSimple.createMessageManager();
		let queryManager = this.m_dataProvider.getQueryManager();
		let queryListener = oFF.OuQueryExecutionListenerLambda.createSingleUse((result) => {
			this.handleQueryResult(result, messages, correlationId);
			this.processFillVisualizations(messages, correlationId).onCatch((err) => {
				reject(err);
			}).onThen((empty2) => {
				resolve(messages);
			});
		});
		queryManager.processQueryExecution(application.getDefaultSyncType(), queryListener, null);
	});
};
oFF.OuDataProviderResulting.prototype.releaseObject = function()
{
	this.m_dataProvider = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuDataProviderResulting.prototype.setAutoFetchActive = function(active, correlationId)
{
	if (this.m_autoFetch === active)
	{
		return oFF.XPromise.resolve(oFF.MessageManagerSimple.createMessageManager());
	}
	this.setAutoFetchActiveWithoutNewResult(active, correlationId);
	if (this.m_autoFetch)
	{
		return this.fetchNewResultSet(correlationId);
	}
	return oFF.XPromise.resolve(oFF.MessageManagerSimple.createMessageManager());
};
oFF.OuDataProviderResulting.prototype.setAutoFetchActiveInternal = function(active)
{
	this.m_autoFetch = active;
};
oFF.OuDataProviderResulting.prototype.setAutoFetchActiveWithoutNewResult = function(active, correlationId)
{
	if (this.m_autoFetch === active)
	{
		return;
	}
	this.m_autoFetch = active;
	if (!this.m_autoFetch)
	{
		let fetchEvt = this.getEventing().getEmitterForResultDataFetch().newTypedEvent();
		fetchEvt.setCorrelationId(correlationId);
		fetchEvt.setStep(oFF.OuDataProviderResultDataFetchStep.AUTO_FETCH_DISABLED);
		fetchEvt.queue();
	}
};
oFF.OuDataProviderResulting.prototype.setupExt = function(dataProviderBase)
{
	this.m_dataProvider = dataProviderBase;
};
oFF.OuDataProviderResulting.prototype.timeout = function(duration, procedure)
{
	if (duration <= 0)
	{
		procedure();
	}
	else
	{
		oFF.XTimeout.timeout(duration, procedure);
	}
};

oFF.OuDataProviderSyntaxErrorAction = function() {};
oFF.OuDataProviderSyntaxErrorAction.prototype = new oFF.OuDataProviderAction();
oFF.OuDataProviderSyntaxErrorAction.prototype._ff_c = "OuDataProviderSyntaxErrorAction";

oFF.OuDataProviderSyntaxErrorAction.create = function(err)
{
	let obj = new oFF.OuDataProviderSyntaxErrorAction();
	obj.m_err = err;
	return obj;
};
oFF.OuDataProviderSyntaxErrorAction.prototype.m_err = null;
oFF.OuDataProviderSyntaxErrorAction.prototype.execute = function(context)
{
	return oFF.XPromise.reject(this.m_err);
};

oFF.OuDataProviderLogger = function() {};
oFF.OuDataProviderLogger.prototype = new oFF.XObject();
oFF.OuDataProviderLogger.prototype._ff_c = "OuDataProviderLogger";

oFF.OuDataProviderLogger.COMMAND_NAME = "actionName";
oFF.OuDataProviderLogger.CORRELATION_ID = "correlationId";
oFF.OuDataProviderLogger.EVENT_TYPE = "eventType";
oFF.OuDataProviderLogger.EXTERNAL = "external";
oFF.OuDataProviderLogger.MAX_LOG_COUNT = 1000;
oFF.OuDataProviderLogger.MESSAGE = "message";
oFF.OuDataProviderLogger.MESSAGE_CLASS_ACTION = "Action";
oFF.OuDataProviderLogger.MESSAGE_CLASS_EVENT = "Event";
oFF.OuDataProviderLogger.PARAMETERS = "parameters";
oFF.OuDataProviderLogger.PARAM_PLACEHOLDER = "OuDataProviderActionsLogger.placeholder";
oFF.OuDataProviderLogger.STATE = "state";
oFF.OuDataProviderLogger.STEP = "step";
oFF.OuDataProviderLogger.createActionsLogger = function(session, forceLoggingEnabled)
{
	let obj = new oFF.OuDataProviderLogger();
	obj.setupLogger(session, forceLoggingEnabled);
	return obj;
};
oFF.OuDataProviderLogger.prototype.m_logListener = null;
oFF.OuDataProviderLogger.prototype.m_logging = false;
oFF.OuDataProviderLogger.prototype.m_messages = null;
oFF.OuDataProviderLogger.prototype.addErrorInformation = function(structure, error)
{
	if (error.getMessage() !== null)
	{
		structure.putString(oFF.OuDataProviderLogger.MESSAGE, error.getMessage().getText());
	}
	else
	{
		structure.putString(oFF.OuDataProviderLogger.MESSAGE, error.getText());
	}
};
oFF.OuDataProviderLogger.prototype.addToLogAndNotify = function(message)
{
	this.m_messages.add(message);
	if (this.m_messages.size() > oFF.OuDataProviderLogger.MAX_LOG_COUNT)
	{
		this.m_messages.removeAt(0);
	}
	this.m_logListener.accept(message);
};
oFF.OuDataProviderLogger.prototype.clearAll = function()
{
	this.m_messages.clear();
	this.m_logListener.accept(null);
};
oFF.OuDataProviderLogger.prototype.getDefaultEventStructure = function(evt)
{
	let eventJson = oFF.PrFactory.createStructure();
	eventJson.putString(oFF.OuDataProviderLogger.CORRELATION_ID, evt.getCorrelationId());
	eventJson.putString(oFF.OuDataProviderLogger.EVENT_TYPE, evt.getEventType().getName());
	eventJson.putBoolean(oFF.OuDataProviderLogger.EXTERNAL, evt.isExternal());
	return eventJson;
};
oFF.OuDataProviderLogger.prototype.getLog = function()
{
	return this.m_messages;
};
oFF.OuDataProviderLogger.prototype.getLogListener = function()
{
	return this.m_logListener;
};
oFF.OuDataProviderLogger.prototype.isLoggingEnabled = function()
{
	return this.m_logging || oFF.XCollectionUtils.hasElements(this.m_logListener);
};
oFF.OuDataProviderLogger.prototype.logActionJson = function(actionJson)
{
	let jsonString = oFF.PrUtils.serialize(actionJson, false, false, 0);
	let message = oFF.XMessage.createMessage(oFF.OriginLayer.APPLICATION, oFF.Severity.DEBUG, 0, jsonString, null, false, null);
	message.setMessageClass(oFF.OuDataProviderLogger.MESSAGE_CLASS_ACTION);
	this.addToLogAndNotify(message);
};
oFF.OuDataProviderLogger.prototype.logActionParams = function(correlationId, action, params)
{
	if (!this.isLoggingEnabled())
	{
		return;
	}
	let commandJson = oFF.PrFactory.createStructure();
	commandJson.putString(oFF.OuDataProviderLogger.CORRELATION_ID, correlationId);
	commandJson.putString(oFF.OuDataProviderLogger.COMMAND_NAME, action);
	let parameterList = commandJson.putNewList(oFF.OuDataProviderLogger.PARAMETERS);
	for (let i = 0; i < params.size(); i++)
	{
		let param = params.get(i);
		if (!oFF.XString.isEqual(param, oFF.OuDataProviderLogger.PARAM_PLACEHOLDER))
		{
			parameterList.addString(param);
		}
	}
	this.logActionJson(commandJson);
};
oFF.OuDataProviderLogger.prototype.logError = function(error, external)
{
	if (!this.isLoggingEnabled())
	{
		return;
	}
	let errorJson = oFF.PrStructure.create();
	this.addErrorInformation(errorJson, error);
	errorJson.putBoolean(oFF.OuDataProviderLogger.EXTERNAL, external);
	this.logErrorJson(errorJson);
};
oFF.OuDataProviderLogger.prototype.logErrorEvt = function(errorEvt)
{
	for (let i = 0; i < errorEvt.getErrors().size(); i++)
	{
		let error = errorEvt.getErrors().get(i);
		let errorJson = this.getDefaultEventStructure(errorEvt);
		this.addErrorInformation(errorJson, error);
		this.logErrorJson(errorJson);
	}
};
oFF.OuDataProviderLogger.prototype.logErrorJson = function(errorJson)
{
	let jsonString = oFF.PrUtils.serialize(errorJson, false, false, 0);
	let error = oFF.XMessage.createError(oFF.OriginLayer.APPLICATION, jsonString, null, false, null);
	this.addToLogAndNotify(error);
};
oFF.OuDataProviderLogger.prototype.logEvent = function(event)
{
	if (!this.isLoggingEnabled())
	{
		return;
	}
	if (event.getEventType() === oFF.OuDataProviderEventType.ERROR)
	{
		this.logErrorEvt(event);
	}
	else if (event.getEventType() === oFF.OuDataProviderEventType.RESULT_DATA_FETCH)
	{
		this.logResultFetchEvt(event);
	}
	else if (event.getEventType() === oFF.OuDataProviderEventType.MODEL_STATE)
	{
		this.logModelStateEvt(event);
	}
	else
	{
		let eventJson = this.getDefaultEventStructure(event);
		this.logEventJson(eventJson);
	}
};
oFF.OuDataProviderLogger.prototype.logEventJson = function(eventJson)
{
	let jsonString = oFF.PrUtils.serialize(eventJson, false, false, 0);
	let message = oFF.XMessage.createMessage(oFF.OriginLayer.APPLICATION, oFF.Severity.DEBUG, 0, jsonString, null, false, null);
	message.setMessageClass(oFF.OuDataProviderLogger.MESSAGE_CLASS_EVENT);
	this.addToLogAndNotify(message);
};
oFF.OuDataProviderLogger.prototype.logMessage = function(message)
{
	if (!this.isLoggingEnabled())
	{
		return;
	}
	this.addToLogAndNotify(message);
};
oFF.OuDataProviderLogger.prototype.logModelStateEvt = function(modelStateEvt)
{
	let eventJson = this.getDefaultEventStructure(modelStateEvt);
	eventJson.putString(oFF.OuDataProviderLogger.STATE, modelStateEvt.getNewState().getName());
	this.logEventJson(eventJson);
};
oFF.OuDataProviderLogger.prototype.logResultFetchEvt = function(dataFetchEvt)
{
	let eventJson = this.getDefaultEventStructure(dataFetchEvt);
	eventJson.putString(oFF.OuDataProviderLogger.STEP, dataFetchEvt.getStep().getName());
	this.logEventJson(eventJson);
};
oFF.OuDataProviderLogger.prototype.releaseObject = function()
{
	this.m_messages = oFF.XObjectExt.release(this.m_messages);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuDataProviderLogger.prototype.setupLogger = function(session, forceLoggingEnabled)
{
	this.m_messages = oFF.XList.create();
	this.m_logging = forceLoggingEnabled;
	this.m_logListener = oFF.XConsumerCollection.create();
	if (!forceLoggingEnabled)
	{
		let severityString = session.getEnvironment().getStringByKey(oFF.XEnvironmentConstants.FIREFLY_LOG_SEVERITY);
		let logSeverity = oFF.Severity.fromName(severityString);
		this.m_logging = logSeverity === oFF.Severity.DEBUG;
	}
};

oFF.OuDataProviderActionManifest = function() {};
oFF.OuDataProviderActionManifest.prototype = new oFF.XObject();
oFF.OuDataProviderActionManifest.prototype._ff_c = "OuDataProviderActionManifest";

oFF.OuDataProviderActionManifest.createByStructure = function(manifestStructure)
{
	let newManifest = new oFF.OuDataProviderActionManifest();
	newManifest.setupByStructure(manifestStructure);
	return newManifest;
};
oFF.OuDataProviderActionManifest.prototype.m_description = null;
oFF.OuDataProviderActionManifest.prototype.m_displayName = null;
oFF.OuDataProviderActionManifest.prototype.m_name = null;
oFF.OuDataProviderActionManifest.prototype.m_parameters = null;
oFF.OuDataProviderActionManifest.prototype.getDescription = function()
{
	return this.m_description;
};
oFF.OuDataProviderActionManifest.prototype.getDisplayName = function()
{
	return this.m_displayName;
};
oFF.OuDataProviderActionManifest.prototype.getName = function()
{
	return this.m_name;
};
oFF.OuDataProviderActionManifest.prototype.getParameterList = function()
{
	return this.m_parameters.getValuesAsReadOnlyList();
};
oFF.OuDataProviderActionManifest.prototype.parseStructure = function(manifestStructure)
{
	if (oFF.XStringUtils.isNullOrEmpty(this.m_name))
	{
		this.m_name = manifestStructure.getStringByKey(oFF.OuDataProviderActionManifestConstants.NAME_KEY);
	}
	this.m_displayName = manifestStructure.getStringByKey(oFF.OuDataProviderActionManifestConstants.DISPLAY_NAME_KEY);
	this.m_description = manifestStructure.getStringByKey(oFF.OuDataProviderActionManifestConstants.DESCRIPTION_KEY);
	if (manifestStructure.containsKey(oFF.OuDataProviderActionManifestConstants.PARAMETERS_KEY))
	{
		let propertiesStruct = manifestStructure.getListByKey(oFF.OuDataProviderActionManifestConstants.PARAMETERS_KEY);
		this.m_parameters = oFF.CoPropertyFactory.processAllPropertiesFromList(propertiesStruct).getValuesAsReadOnlyList();
	}
};
oFF.OuDataProviderActionManifest.prototype.setupByStructure = function(struct)
{
	this.setupInternal();
	this.parseStructure(struct);
};
oFF.OuDataProviderActionManifest.prototype.setupInternal = function()
{
	this.m_parameters = oFF.XList.create();
};
oFF.OuDataProviderActionManifest.prototype.toString = function()
{
	return this.m_name;
};

oFF.OuGenericVisualizationObjectFilledListenerLambda = function() {};
oFF.OuGenericVisualizationObjectFilledListenerLambda.prototype = new oFF.XObject();
oFF.OuGenericVisualizationObjectFilledListenerLambda.prototype._ff_c = "OuGenericVisualizationObjectFilledListenerLambda";

oFF.OuGenericVisualizationObjectFilledListenerLambda.createSingleUse = function(callback)
{
	let obj = new oFF.OuGenericVisualizationObjectFilledListenerLambda();
	obj.setupExt(callback);
	return obj;
};
oFF.OuGenericVisualizationObjectFilledListenerLambda.prototype.m_callback = null;
oFF.OuGenericVisualizationObjectFilledListenerLambda.prototype.onVisualizationObjectFilled = function(extResult, visualisationDefinition, customIdentifier)
{
	this.m_callback(extResult);
	this.releaseObject();
};
oFF.OuGenericVisualizationObjectFilledListenerLambda.prototype.releaseObject = function()
{
	this.m_callback = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuGenericVisualizationObjectFilledListenerLambda.prototype.setupExt = function(callback)
{
	this.m_callback = callback;
};

oFF.OuGridCollectorListenerLambda = function() {};
oFF.OuGridCollectorListenerLambda.prototype = new oFF.XObject();
oFF.OuGridCollectorListenerLambda.prototype._ff_c = "OuGridCollectorListenerLambda";

oFF.OuGridCollectorListenerLambda.createSingleUse = function(callback)
{
	let obj = new oFF.OuGridCollectorListenerLambda();
	obj.setupExt(callback);
	return obj;
};
oFF.OuGridCollectorListenerLambda.prototype.m_callback = null;
oFF.OuGridCollectorListenerLambda.prototype.onGridCollectorFilled = function(extResult, gridContainer, customIdentifier)
{
	this.m_callback(extResult);
	this.releaseObject();
};
oFF.OuGridCollectorListenerLambda.prototype.releaseObject = function()
{
	this.m_callback = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuGridCollectorListenerLambda.prototype.setupExt = function(callback)
{
	this.m_callback = callback;
};

oFF.OuQueryExecutionListenerLambda = function() {};
oFF.OuQueryExecutionListenerLambda.prototype = new oFF.XObject();
oFF.OuQueryExecutionListenerLambda.prototype._ff_c = "OuQueryExecutionListenerLambda";

oFF.OuQueryExecutionListenerLambda.create = function(callback)
{
	let obj = new oFF.OuQueryExecutionListenerLambda();
	obj.setupExt(callback);
	return obj;
};
oFF.OuQueryExecutionListenerLambda.createAndAttach = function(queryManager, callback, isSingleUse)
{
	let obj = isSingleUse ? oFF.OuQueryExecutionListenerLambda.createSingleUse(callback) : oFF.OuQueryExecutionListenerLambda.create(callback);
	obj.m_queryManager = oFF.XObjectExt.assertNotNull(queryManager);
	queryManager.attachQueryExecutedListener(obj, null);
	return obj;
};
oFF.OuQueryExecutionListenerLambda.createSingleUse = function(callback)
{
	let obj = oFF.OuQueryExecutionListenerLambda.create(callback);
	obj.setSingleUse();
	return obj;
};
oFF.OuQueryExecutionListenerLambda.prototype.m_callback = null;
oFF.OuQueryExecutionListenerLambda.prototype.m_isSingleUse = false;
oFF.OuQueryExecutionListenerLambda.prototype.m_queryManager = null;
oFF.OuQueryExecutionListenerLambda.prototype.onQueryExecuted = function(extResult, resultSetContainer, customIdentifier)
{
	this.m_callback(extResult);
	if (this.m_isSingleUse)
	{
		this.releaseObject();
	}
};
oFF.OuQueryExecutionListenerLambda.prototype.releaseObject = function()
{
	if (oFF.notNull(this.m_queryManager))
	{
		this.m_queryManager.detachQueryExecutedListener(this);
	}
	this.m_queryManager = null;
	this.m_callback = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuQueryExecutionListenerLambda.prototype.setSingleUse = function()
{
	this.m_isSingleUse = true;
};
oFF.OuQueryExecutionListenerLambda.prototype.setupExt = function(callback)
{
	this.m_callback = callback;
	this.m_isSingleUse = false;
};

oFF.OuQueryManagerCreationListenerLambda = function() {};
oFF.OuQueryManagerCreationListenerLambda.prototype = new oFF.XObject();
oFF.OuQueryManagerCreationListenerLambda.prototype._ff_c = "OuQueryManagerCreationListenerLambda";

oFF.OuQueryManagerCreationListenerLambda.createSingleUse = function(callback)
{
	let obj = new oFF.OuQueryManagerCreationListenerLambda();
	obj.setupExt(callback);
	return obj;
};
oFF.OuQueryManagerCreationListenerLambda.prototype.m_callback = null;
oFF.OuQueryManagerCreationListenerLambda.prototype.onQueryManagerCreated = function(extResult, queryManager, customIdentifier)
{
	this.m_callback(extResult);
	this.releaseObject();
};
oFF.OuQueryManagerCreationListenerLambda.prototype.releaseObject = function()
{
	this.m_callback = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuQueryManagerCreationListenerLambda.prototype.setupExt = function(callback)
{
	this.m_callback = callback;
};

oFF.OuQueryManagerShutdownListenerLambda = function() {};
oFF.OuQueryManagerShutdownListenerLambda.prototype = new oFF.XObject();
oFF.OuQueryManagerShutdownListenerLambda.prototype._ff_c = "OuQueryManagerShutdownListenerLambda";

oFF.OuQueryManagerShutdownListenerLambda.createSingleUse = function(callback)
{
	let obj = new oFF.OuQueryManagerShutdownListenerLambda();
	obj.setupExt(callback);
	return obj;
};
oFF.OuQueryManagerShutdownListenerLambda.prototype.m_callback = null;
oFF.OuQueryManagerShutdownListenerLambda.prototype.onQueryManagerRelease = function(extResult, queryManager, customIdentifier)
{
	this.m_callback(extResult);
};
oFF.OuQueryManagerShutdownListenerLambda.prototype.releaseObject = function()
{
	this.m_callback = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuQueryManagerShutdownListenerLambda.prototype.setupExt = function(callback)
{
	this.m_callback = callback;
};

oFF.OuVisualizationObjectFilledListenerLambda = function() {};
oFF.OuVisualizationObjectFilledListenerLambda.prototype = new oFF.XObject();
oFF.OuVisualizationObjectFilledListenerLambda.prototype._ff_c = "OuVisualizationObjectFilledListenerLambda";

oFF.OuVisualizationObjectFilledListenerLambda.createSingleUse = function(callback)
{
	let obj = new oFF.OuVisualizationObjectFilledListenerLambda();
	obj.setupExt(callback);
	return obj;
};
oFF.OuVisualizationObjectFilledListenerLambda.prototype.m_callback = null;
oFF.OuVisualizationObjectFilledListenerLambda.prototype.onVisualizationObjectFilled = function(extResult, visualisationContainer, customIdentifier)
{
	this.m_callback(extResult);
	this.releaseObject();
};
oFF.OuVisualizationObjectFilledListenerLambda.prototype.releaseObject = function()
{
	this.m_callback = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuVisualizationObjectFilledListenerLambda.prototype.setupExt = function(callback)
{
	this.m_callback = callback;
};

oFF.DfOuDataProviderActionsCollection = function() {};
oFF.DfOuDataProviderActionsCollection.prototype = new oFF.XObject();
oFF.DfOuDataProviderActionsCollection.prototype._ff_c = "DfOuDataProviderActionsCollection";

oFF.DfOuDataProviderActionsCollection.prototype.m_actions = null;
oFF.DfOuDataProviderActionsCollection.prototype.addAction = function(action)
{
	this.m_actions.addStringAction(action);
	return action;
};
oFF.DfOuDataProviderActionsCollection.prototype.getActions = function()
{
	return this.m_actions;
};
oFF.DfOuDataProviderActionsCollection.prototype.releaseObject = function()
{
	this.m_actions = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.DfOuDataProviderActionsCollection.prototype.setupCollection = function(actions)
{
	this.m_actions = actions;
};

oFF.OuDataProviderActionResult = function() {};
oFF.OuDataProviderActionResult.prototype = new oFF.XObject();
oFF.OuDataProviderActionResult.prototype._ff_c = "OuDataProviderActionResult";

oFF.OuDataProviderActionResult.create = function(actionName)
{
	let obj = new oFF.OuDataProviderActionResult();
	obj.setupExt(actionName);
	return obj;
};
oFF.OuDataProviderActionResult.prototype.m_actionName = null;
oFF.OuDataProviderActionResult.prototype.m_changes = null;
oFF.OuDataProviderActionResult.prototype.m_logParamNames = null;
oFF.OuDataProviderActionResult.prototype.m_logParamValues = null;
oFF.OuDataProviderActionResult.prototype.m_returnValue = null;
oFF.OuDataProviderActionResult.prototype.addLogParameter = function(parameterName, parameterValue)
{
	this.m_logParamNames.add(parameterName);
	this.m_logParamValues.add(parameterValue);
};
oFF.OuDataProviderActionResult.prototype.getActionName = function()
{
	return this.m_actionName;
};
oFF.OuDataProviderActionResult.prototype.getChanges = function()
{
	return this.m_changes;
};
oFF.OuDataProviderActionResult.prototype.getChangesBase = function()
{
	return this.m_changes;
};
oFF.OuDataProviderActionResult.prototype.getLogParamsNames = function()
{
	return this.m_logParamNames;
};
oFF.OuDataProviderActionResult.prototype.getLogParamsValues = function()
{
	return this.m_logParamValues;
};
oFF.OuDataProviderActionResult.prototype.getReturnValue = function()
{
	return this.m_returnValue;
};
oFF.OuDataProviderActionResult.prototype.releaseObject = function()
{
	this.m_actionName = null;
	this.m_logParamNames = oFF.XObjectExt.release(this.m_logParamNames);
	this.m_logParamValues = oFF.XObjectExt.release(this.m_logParamValues);
	this.m_changes = oFF.XObjectExt.release(this.m_changes);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuDataProviderActionResult.prototype.setReturnValue = function(returnValue)
{
	this.m_returnValue = returnValue;
};
oFF.OuDataProviderActionResult.prototype.setupExt = function(actionName)
{
	this.m_actionName = actionName;
	this.m_logParamNames = oFF.XList.create();
	this.m_logParamValues = oFF.XList.create();
	this.m_changes = oFF.OuDataProviderActionChanges.create();
};

oFF.OuDpAnalysisActionGetQueryMetadata = function() {};
oFF.OuDpAnalysisActionGetQueryMetadata.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpAnalysisActionGetQueryMetadata.prototype._ff_c = "OuDpAnalysisActionGetQueryMetadata";

oFF.OuDpAnalysisActionGetQueryMetadata.NAME = "getQueryMetadata";
oFF.OuDpAnalysisActionGetQueryMetadata.create = function(actionsBase)
{
	let obj = new oFF.OuDpAnalysisActionGetQueryMetadata();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpAnalysisActionGetQueryMetadata.prototype.m_queryMetadataAnalyzer = null;
oFF.OuDpAnalysisActionGetQueryMetadata.prototype.doAction = function(parameters)
{
	return oFF.XPromise.create((resolve, reject) => {
		try
		{
			let result = this.newActionResult(parameters);
			result.setReturnValue(this.m_queryMetadataAnalyzer.analyze(this.getDataProvider().getQueryManager().getQueryModel()));
			resolve(result);
		}
		catch (e)
		{
			reject(oFF.XError.create(oFF.XException.getMessage(e)));
		}
	});
};
oFF.OuDpAnalysisActionGetQueryMetadata.prototype.getName = function()
{
	return oFF.OuDpAnalysisActionGetQueryMetadata.NAME;
};
oFF.OuDpAnalysisActionGetQueryMetadata.prototype.releaseObject = function()
{
	this.m_queryMetadataAnalyzer = oFF.XObjectExt.release(this.m_queryMetadataAnalyzer);
	oFF.DfOuDataProviderAction.prototype.releaseObject.call( this );
};
oFF.OuDpAnalysisActionGetQueryMetadata.prototype.setupAction = function(actionsBase)
{
	oFF.DfOuDataProviderAction.prototype.setupAction.call( this , actionsBase);
	this.m_queryMetadataAnalyzer = oFF.OuDpQueryMetadataAnalyzer.create();
};

oFF.OuDpAxisActionMoveDimensionAfter = function() {};
oFF.OuDpAxisActionMoveDimensionAfter.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpAxisActionMoveDimensionAfter.prototype._ff_c = "OuDpAxisActionMoveDimensionAfter";

oFF.OuDpAxisActionMoveDimensionAfter.NAME = "moveDimensionAfter";
oFF.OuDpAxisActionMoveDimensionAfter.create = function(actionsBase)
{
	let obj = new oFF.OuDpAxisActionMoveDimensionAfter();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpAxisActionMoveDimensionAfter.prototype.doAction = function(parameters)
{
	return oFF.XPromise.create((resolve, reject) => {
		let dataProvider = this.getDataProvider();
		dataProvider.getCc().moveDimensionAfter(parameters.get(0), parameters.get(1));
		let result = this.newActionResult(parameters);
		result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
		resolve(result);
	});
};
oFF.OuDpAxisActionMoveDimensionAfter.prototype.executeTyped = function(dimension, targetDimension)
{
	let parameters = oFF.XList.create();
	parameters.add(dimension.getName());
	parameters.add(targetDimension.getName());
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpAxisActionMoveDimensionAfter.prototype.getName = function()
{
	return oFF.OuDpAxisActionMoveDimensionAfter.NAME;
};

oFF.OuDpAxisActionMoveDimensionBefore = function() {};
oFF.OuDpAxisActionMoveDimensionBefore.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpAxisActionMoveDimensionBefore.prototype._ff_c = "OuDpAxisActionMoveDimensionBefore";

oFF.OuDpAxisActionMoveDimensionBefore.NAME = "moveDimensionBefore";
oFF.OuDpAxisActionMoveDimensionBefore.create = function(actionsBase)
{
	let obj = new oFF.OuDpAxisActionMoveDimensionBefore();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpAxisActionMoveDimensionBefore.prototype.doAction = function(parameters)
{
	return oFF.XPromise.create((resolve, reject) => {
		let dataProvider = this.getDataProvider();
		dataProvider.getCc().moveDimensionBefore(parameters.get(0), parameters.get(1));
		let result = this.newActionResult(parameters);
		result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
		resolve(result);
	});
};
oFF.OuDpAxisActionMoveDimensionBefore.prototype.executeTyped = function(dimension, targetDimension)
{
	let parameters = oFF.XList.create();
	parameters.add(dimension.getName());
	parameters.add(targetDimension.getName());
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpAxisActionMoveDimensionBefore.prototype.getName = function()
{
	return oFF.OuDpAxisActionMoveDimensionBefore.NAME;
};

oFF.OuDpAxisActionMoveDimensionToAxis = function() {};
oFF.OuDpAxisActionMoveDimensionToAxis.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpAxisActionMoveDimensionToAxis.prototype._ff_c = "OuDpAxisActionMoveDimensionToAxis";

oFF.OuDpAxisActionMoveDimensionToAxis.NAME = "moveDimensionToAxis";
oFF.OuDpAxisActionMoveDimensionToAxis.create = function(actionsBase)
{
	let obj = new oFF.OuDpAxisActionMoveDimensionToAxis();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpAxisActionMoveDimensionToAxis.prototype.doAction = function(parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let queryManager = this.getDataProvider().getQueryManager();
	let dimensionName = parameters.get(0);
	let axisType = converter.toAxisType(parameters.get(1));
	let cmd = queryManager.getConvenienceCommands();
	let isVisible = oFF.AxisType.isAxisVisible(axisType);
	cmd.moveDimensionToAxis(dimensionName, axisType);
	if (!isVisible)
	{
		cmd.clearNonMainFieldsFromResultSet(null, dimensionName);
		cmd.removeInvalidSortOperations();
	}
	else
	{
		cmd.moveSortToPosition(oFF.SortType.ABSTRACT_DIMENSION_SORT, dimensionName, 0);
	}
	let result = this.newActionResult(parameters);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpAxisActionMoveDimensionToAxis.prototype.executeTyped = function(dimensionName, axisType)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(dimensionName);
	parameters.add(converter.fromAxisType(axisType));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpAxisActionMoveDimensionToAxis.prototype.getName = function()
{
	return oFF.OuDpAxisActionMoveDimensionToAxis.NAME;
};

oFF.OuDpAxisActionMoveDimensionToColumns = function() {};
oFF.OuDpAxisActionMoveDimensionToColumns.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpAxisActionMoveDimensionToColumns.prototype._ff_c = "OuDpAxisActionMoveDimensionToColumns";

oFF.OuDpAxisActionMoveDimensionToColumns.NAME = "moveDimensionToColumns";
oFF.OuDpAxisActionMoveDimensionToColumns.create = function(actionsBase)
{
	let obj = new oFF.OuDpAxisActionMoveDimensionToColumns();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpAxisActionMoveDimensionToColumns.prototype.doAction = function(parameters)
{
	let axisActions = this.getDataProvider().getActions().getAxisActions();
	return axisActions.moveDimensionToAxis(parameters.get(0), oFF.AxisType.COLUMNS).onThenExt((empty) => {
		return this.newActionResult(parameters);
	});
};
oFF.OuDpAxisActionMoveDimensionToColumns.prototype.executeTyped = function(dimension)
{
	let parameters = oFF.XList.create();
	parameters.add(dimension.getName());
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpAxisActionMoveDimensionToColumns.prototype.getName = function()
{
	return oFF.OuDpAxisActionMoveDimensionToColumns.NAME;
};

oFF.OuDpAxisActionMoveDimensionToRows = function() {};
oFF.OuDpAxisActionMoveDimensionToRows.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpAxisActionMoveDimensionToRows.prototype._ff_c = "OuDpAxisActionMoveDimensionToRows";

oFF.OuDpAxisActionMoveDimensionToRows.NAME = "moveDimensionToRows";
oFF.OuDpAxisActionMoveDimensionToRows.create = function(actionsBase)
{
	let obj = new oFF.OuDpAxisActionMoveDimensionToRows();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpAxisActionMoveDimensionToRows.prototype.doAction = function(parameters)
{
	let axisActions = this.getDataProvider().getActions().getAxisActions();
	return axisActions.moveDimensionToAxis(parameters.get(0), oFF.AxisType.ROWS).onThenExt((empty) => {
		return this.newActionResult(parameters);
	});
};
oFF.OuDpAxisActionMoveDimensionToRows.prototype.executeTyped = function(dimension)
{
	let parameters = oFF.XList.create();
	parameters.add(dimension.getName());
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpAxisActionMoveDimensionToRows.prototype.getName = function()
{
	return oFF.OuDpAxisActionMoveDimensionToRows.NAME;
};

oFF.OuDpAxisActionRemoveDimension = function() {};
oFF.OuDpAxisActionRemoveDimension.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpAxisActionRemoveDimension.prototype._ff_c = "OuDpAxisActionRemoveDimension";

oFF.OuDpAxisActionRemoveDimension.NAME = "removeDimension";
oFF.OuDpAxisActionRemoveDimension.create = function(actionsBase)
{
	let obj = new oFF.OuDpAxisActionRemoveDimension();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpAxisActionRemoveDimension.prototype.doAction = function(parameters)
{
	let axisActions = this.getDataProvider().getActions().getAxisActions();
	return axisActions.moveDimensionToAxis(parameters.get(0), oFF.AxisType.FREE).onThenExt((empty) => {
		return this.newActionResult(parameters);
	});
};
oFF.OuDpAxisActionRemoveDimension.prototype.executeTyped = function(dimension)
{
	let parameters = oFF.XList.create();
	parameters.add(dimension.getName());
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpAxisActionRemoveDimension.prototype.getName = function()
{
	return oFF.OuDpAxisActionRemoveDimension.NAME;
};

oFF.OuDpAxisActionSwapAxis = function() {};
oFF.OuDpAxisActionSwapAxis.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpAxisActionSwapAxis.prototype._ff_c = "OuDpAxisActionSwapAxis";

oFF.OuDpAxisActionSwapAxis.NAME = "swapAxis";
oFF.OuDpAxisActionSwapAxis.create = function(actionsBase)
{
	let obj = new oFF.OuDpAxisActionSwapAxis();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpAxisActionSwapAxis.prototype.doAction = function(parameters)
{
	let queryManager = this.getDataProvider().getQueryManager();
	queryManager.getConvenienceCommands().switchAxesExt(true);
	let result = this.newActionResult(parameters);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpAxisActionSwapAxis.prototype.getName = function()
{
	return oFF.OuDpAxisActionSwapAxis.NAME;
};

oFF.OuDpAxisActionSwapDimensions = function() {};
oFF.OuDpAxisActionSwapDimensions.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpAxisActionSwapDimensions.prototype._ff_c = "OuDpAxisActionSwapDimensions";

oFF.OuDpAxisActionSwapDimensions.NAME = "swapDimensions";
oFF.OuDpAxisActionSwapDimensions.create = function(actionsBase)
{
	let obj = new oFF.OuDpAxisActionSwapDimensions();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpAxisActionSwapDimensions.prototype.doAction = function(parameters)
{
	return oFF.XPromise.create((resolve, reject) => {
		let dataProvider = this.getDataProvider();
		dataProvider.getCc().swapDimensions(parameters.get(0), parameters.get(1));
		let result = this.newActionResult(parameters);
		result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
		resolve(result);
	});
};
oFF.OuDpAxisActionSwapDimensions.prototype.executeTyped = function(dimension1, dimension2)
{
	let parameters = oFF.XList.create();
	parameters.add(dimension1.getName());
	parameters.add(dimension2.getName());
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpAxisActionSwapDimensions.prototype.getName = function()
{
	return oFF.OuDpAxisActionSwapDimensions.NAME;
};

oFF.OuDpFilterActionAddSingleMemberFilter = function() {};
oFF.OuDpFilterActionAddSingleMemberFilter.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpFilterActionAddSingleMemberFilter.prototype._ff_c = "OuDpFilterActionAddSingleMemberFilter";

oFF.OuDpFilterActionAddSingleMemberFilter.NAME = "addSingleMemberFilter";
oFF.OuDpFilterActionAddSingleMemberFilter.create = function(actionsBase)
{
	let obj = new oFF.OuDpFilterActionAddSingleMemberFilter();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpFilterActionAddSingleMemberFilter.prototype.doAction = function(parameters)
{
	return oFF.XPromise.create((resolve, reject) => {
		let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
		let dimensionName = parameters.get(0);
		if (oFF.XStringUtils.isNullOrEmpty(dimensionName))
		{
			reject(oFF.XError.create("Empty dimension name supplied"));
			return;
		}
		let comparisonOperator = converter.toComparisonOperator(parameters.get(1));
		if (oFF.isNull(comparisonOperator))
		{
			reject(oFF.XError.create("Invalid comparison operator supplied"));
			return;
		}
		let memberName = parameters.get(2);
		if (oFF.XStringUtils.isNullOrEmpty(memberName))
		{
			reject(oFF.XError.create("Empty member name supplied"));
			return;
		}
		let convenienceCommands = this.getDataProvider().getQueryManager().getConvenienceCommands();
		let dimension = convenienceCommands.getDimension(dimensionName);
		if (oFF.isNull(dimension))
		{
			reject(oFF.XError.create(oFF.XStringUtils.concatenate3("Dimension with name '", dimensionName, "' does not exist")));
			return;
		}
		convenienceCommands.addSingleMemberFilterByDimension(dimension, memberName, comparisonOperator);
		let result = this.newActionResult(parameters);
		result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
		resolve(result);
	});
};
oFF.OuDpFilterActionAddSingleMemberFilter.prototype.executeTyped = function(dimensionName, operator, memberName)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(dimensionName);
	parameters.add(converter.fromComparisonOperator(operator));
	parameters.add(memberName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpFilterActionAddSingleMemberFilter.prototype.getName = function()
{
	return oFF.OuDpFilterActionAddSingleMemberFilter.NAME;
};

oFF.OuDpFilterActionRemoveSingleMemberFilter = function() {};
oFF.OuDpFilterActionRemoveSingleMemberFilter.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpFilterActionRemoveSingleMemberFilter.prototype._ff_c = "OuDpFilterActionRemoveSingleMemberFilter";

oFF.OuDpFilterActionRemoveSingleMemberFilter.NAME = "removeSingleMemberFilter";
oFF.OuDpFilterActionRemoveSingleMemberFilter.create = function(actionsBase)
{
	let obj = new oFF.OuDpFilterActionRemoveSingleMemberFilter();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpFilterActionRemoveSingleMemberFilter.prototype.doAction = function(parameters)
{
	return oFF.XPromise.create((resolve, reject) => {
		let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
		let dimensionName = parameters.get(0);
		if (oFF.XStringUtils.isNullOrEmpty(dimensionName))
		{
			reject(oFF.XError.create("Empty dimension name supplied"));
			return;
		}
		let comparisonOperator = converter.toComparisonOperator(parameters.get(1));
		if (oFF.isNull(comparisonOperator))
		{
			reject(oFF.XError.create("Invalid comparison operator supplied"));
			return;
		}
		let memberName = parameters.get(2);
		if (oFF.XStringUtils.isNullOrEmpty(memberName))
		{
			reject(oFF.XError.create("Empty member name supplied"));
			return;
		}
		let convenienceCommands = this.getDataProvider().getQueryManager().getConvenienceCommands();
		let dimension = convenienceCommands.getDimension(dimensionName);
		if (oFF.isNull(dimension))
		{
			reject(oFF.XError.create(oFF.XStringUtils.concatenate3("Dimension with name '", dimensionName, "' does not exist")));
			return;
		}
		convenienceCommands.clearSingleMemberFilterByDimension(dimension, memberName, comparisonOperator);
		let result = this.newActionResult(parameters);
		result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
		resolve(result);
	});
};
oFF.OuDpFilterActionRemoveSingleMemberFilter.prototype.executeTyped = function(dimensionName, operator, memberName)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(dimensionName);
	parameters.add(converter.fromComparisonOperator(operator));
	parameters.add(memberName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpFilterActionRemoveSingleMemberFilter.prototype.getName = function()
{
	return oFF.OuDpFilterActionRemoveSingleMemberFilter.NAME;
};

oFF.OuDpFilterActionSetSimpleEqualFilterList = function() {};
oFF.OuDpFilterActionSetSimpleEqualFilterList.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpFilterActionSetSimpleEqualFilterList.prototype._ff_c = "OuDpFilterActionSetSimpleEqualFilterList";

oFF.OuDpFilterActionSetSimpleEqualFilterList.NAME = "updateFilter";
oFF.OuDpFilterActionSetSimpleEqualFilterList.VALUE_SEPARATOR = ">|<";
oFF.OuDpFilterActionSetSimpleEqualFilterList.create = function(actionsBase)
{
	let obj = new oFF.OuDpFilterActionSetSimpleEqualFilterList();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpFilterActionSetSimpleEqualFilterList.prototype.doAction = function(parameters)
{
	return oFF.XPromise.create((resolve, reject) => {
		let filterIsSet = false;
		let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
		let dimensionName = parameters.get(0);
		if (oFF.XStringUtils.isNullOrEmpty(dimensionName))
		{
			reject(oFF.XError.create("Empty dimension name supplied"));
			return;
		}
		let valueList = oFF.XStringTokenizer.splitString(parameters.get(1), oFF.OuDpFilterActionSetSimpleEqualFilterList.VALUE_SEPARATOR);
		let hierarchyName = parameters.get(2);
		let useExclude = converter.toBoolean(parameters.get(3), false);
		let convenienceCommands = this.getDataProvider().getQueryManager().getConvenienceCommands();
		let dimension = convenienceCommands.getDimension(dimensionName);
		if (oFF.isNull(dimension))
		{
			reject(oFF.XError.create(oFF.XStringUtils.concatenate3("Dimension with name '", dimensionName, "' does not exist")));
			return;
		}
		convenienceCommands.clearFiltersByDimension(dimension);
		if (oFF.notNull(valueList) && valueList.hasElements())
		{
			let dynamicFilter = this.getDataProvider().getQueryManager().getQueryModel().getFilter().getDynamicFilter();
			oFF.XCollectionUtils.forEach(valueList, (value) => {
				let filterOp = dynamicFilter.addSingleMemberFilterByDimension(dimension, value, oFF.ComparisonOperator.EQUAL);
				filterOp.setSetSign(useExclude ? oFF.SetSign.EXCLUDING : oFF.SetSign.INCLUDING);
				if (oFF.notNull(hierarchyName))
				{
					filterOp.setHierarchyName(hierarchyName);
				}
			});
			let cartesianProduct = dynamicFilter.getCartesianProduct();
			if (oFF.notNull(hierarchyName) && oFF.notNull(cartesianProduct))
			{
				let cartesianList = cartesianProduct.getCartesianListByDimensionName(dimensionName);
				if (oFF.notNull(cartesianList))
				{
					cartesianList.setHierarchyName(hierarchyName);
					let fieldMetadata = dimension.getHierarchyKeyField().getMetadata();
					if (oFF.notNull(fieldMetadata))
					{
						cartesianList.setFieldMetadata(fieldMetadata);
					}
				}
			}
			filterIsSet = true;
		}
		let result = this.newActionResult(parameters);
		result.setReturnValue(oFF.XBooleanValue.create(filterIsSet));
		if (filterIsSet)
		{
			result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
		}
		resolve(result);
	});
};
oFF.OuDpFilterActionSetSimpleEqualFilterList.prototype.executeTyped = function(dimensionName, valueList, hierarchyName, useExclude)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(dimensionName);
	parameters.add(oFF.XCollectionUtils.join(valueList, oFF.OuDpFilterActionSetSimpleEqualFilterList.VALUE_SEPARATOR));
	parameters.add(hierarchyName);
	parameters.add(converter.fromBoolean(useExclude));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpFilterActionSetSimpleEqualFilterList.prototype.getName = function()
{
	return oFF.OuDpFilterActionSetSimpleEqualFilterList.NAME;
};

oFF.OuDpHierarchyActionActivateHierarchy = function() {};
oFF.OuDpHierarchyActionActivateHierarchy.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpHierarchyActionActivateHierarchy.prototype._ff_c = "OuDpHierarchyActionActivateHierarchy";

oFF.OuDpHierarchyActionActivateHierarchy.NAME = "activateHierarchy";
oFF.OuDpHierarchyActionActivateHierarchy.create = function(actionsBase)
{
	let obj = new oFF.OuDpHierarchyActionActivateHierarchy();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpHierarchyActionActivateHierarchy.prototype.doAction = function(parameters)
{
	this.getDataProvider().getCc().activateHierarchy(parameters.get(0));
	this.getDataProvider().getCc().refreshFieldContainerDisplayForDimension(parameters.get(0), null);
	let result = this.newActionResult(parameters);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpHierarchyActionActivateHierarchy.prototype.executeTyped = function(dimName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpHierarchyActionActivateHierarchy.prototype.getName = function()
{
	return oFF.OuDpHierarchyActionActivateHierarchy.NAME;
};

oFF.OuDpHierarchyActionAssignHierarchy = function() {};
oFF.OuDpHierarchyActionAssignHierarchy.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpHierarchyActionAssignHierarchy.prototype._ff_c = "OuDpHierarchyActionAssignHierarchy";

oFF.OuDpHierarchyActionAssignHierarchy.NAME = "assignHierarchy";
oFF.OuDpHierarchyActionAssignHierarchy.create = function(actionsBase)
{
	let obj = new oFF.OuDpHierarchyActionAssignHierarchy();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpHierarchyActionAssignHierarchy.prototype.doAction = function(parameters)
{
	this.getDataProvider().getCc().assignHierarchy(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpHierarchyActionAssignHierarchy.prototype.executeTyped = function(dimName, hierarchyName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(hierarchyName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpHierarchyActionAssignHierarchy.prototype.getName = function()
{
	return oFF.OuDpHierarchyActionAssignHierarchy.NAME;
};

oFF.OuDpHierarchyActionDeactivateHierarchy = function() {};
oFF.OuDpHierarchyActionDeactivateHierarchy.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpHierarchyActionDeactivateHierarchy.prototype._ff_c = "OuDpHierarchyActionDeactivateHierarchy";

oFF.OuDpHierarchyActionDeactivateHierarchy.NAME = "deactivateHierarchy";
oFF.OuDpHierarchyActionDeactivateHierarchy.create = function(actionsBase)
{
	let obj = new oFF.OuDpHierarchyActionDeactivateHierarchy();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpHierarchyActionDeactivateHierarchy.prototype.doAction = function(parameters)
{
	this.getDataProvider().getCc().deactivateHierarchy(parameters.get(0));
	this.getDataProvider().getCc().refreshFieldContainerDisplayForDimension(parameters.get(0), null);
	let result = this.newActionResult(parameters);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpHierarchyActionDeactivateHierarchy.prototype.executeTyped = function(dimName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpHierarchyActionDeactivateHierarchy.prototype.getName = function()
{
	return oFF.OuDpHierarchyActionDeactivateHierarchy.NAME;
};

oFF.OuDpHierarchyActionGetAssignedHierarchy = function() {};
oFF.OuDpHierarchyActionGetAssignedHierarchy.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpHierarchyActionGetAssignedHierarchy.prototype._ff_c = "OuDpHierarchyActionGetAssignedHierarchy";

oFF.OuDpHierarchyActionGetAssignedHierarchy.NAME = "getAssignedHierarchy";
oFF.OuDpHierarchyActionGetAssignedHierarchy.create = function(actionsBase)
{
	let obj = new oFF.OuDpHierarchyActionGetAssignedHierarchy();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpHierarchyActionGetAssignedHierarchy.prototype.doAction = function(parameters)
{
	let dimensionName = parameters.get(0);
	let assignedHierarchy = this.getDataProvider().getCc().getAssignedHierarchy(dimensionName);
	let result = this.newActionResult(parameters);
	result.setReturnValue(oFF.XStringValue.create(assignedHierarchy));
	return oFF.XPromise.resolve(result);
};
oFF.OuDpHierarchyActionGetAssignedHierarchy.prototype.executeTyped = function(dimName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpHierarchyActionGetAssignedHierarchy.prototype.getName = function()
{
	return oFF.OuDpHierarchyActionGetAssignedHierarchy.NAME;
};

oFF.OuDpHierarchyActionIsHierarchyActive = function() {};
oFF.OuDpHierarchyActionIsHierarchyActive.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpHierarchyActionIsHierarchyActive.prototype._ff_c = "OuDpHierarchyActionIsHierarchyActive";

oFF.OuDpHierarchyActionIsHierarchyActive.NAME = "isHierarchyActive";
oFF.OuDpHierarchyActionIsHierarchyActive.create = function(actionsBase)
{
	let obj = new oFF.OuDpHierarchyActionIsHierarchyActive();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpHierarchyActionIsHierarchyActive.prototype.doAction = function(parameters)
{
	let dimensionName = parameters.get(0);
	let hierarchyActive = this.getDataProvider().getCc().isHierarchyActive(dimensionName);
	let result = this.newActionResult(parameters);
	result.setReturnValue(oFF.XBooleanValue.create(hierarchyActive));
	return oFF.XPromise.resolve(result);
};
oFF.OuDpHierarchyActionIsHierarchyActive.prototype.executeTyped = function(dimName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpHierarchyActionIsHierarchyActive.prototype.getName = function()
{
	return oFF.OuDpHierarchyActionIsHierarchyActive.NAME;
};

oFF.OuDpHierarchyActionIsHierarchyAssigned = function() {};
oFF.OuDpHierarchyActionIsHierarchyAssigned.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpHierarchyActionIsHierarchyAssigned.prototype._ff_c = "OuDpHierarchyActionIsHierarchyAssigned";

oFF.OuDpHierarchyActionIsHierarchyAssigned.NAME = "isHierarchyAssigned";
oFF.OuDpHierarchyActionIsHierarchyAssigned.create = function(actionsBase)
{
	let obj = new oFF.OuDpHierarchyActionIsHierarchyAssigned();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpHierarchyActionIsHierarchyAssigned.prototype.doAction = function(parameters)
{
	let dimensionName = parameters.get(0);
	let hierarchyAssigned = this.getDataProvider().getCc().isHierarchyAssigned(dimensionName);
	let result = this.newActionResult(parameters);
	result.setReturnValue(oFF.XBooleanValue.create(hierarchyAssigned));
	return oFF.XPromise.resolve(result);
};
oFF.OuDpHierarchyActionIsHierarchyAssigned.prototype.executeTyped = function(dimName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpHierarchyActionIsHierarchyAssigned.prototype.getName = function()
{
	return oFF.OuDpHierarchyActionIsHierarchyAssigned.NAME;
};

oFF.OuDpHierarchyActionUnassignHierarchy = function() {};
oFF.OuDpHierarchyActionUnassignHierarchy.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpHierarchyActionUnassignHierarchy.prototype._ff_c = "OuDpHierarchyActionUnassignHierarchy";

oFF.OuDpHierarchyActionUnassignHierarchy.NAME = "unassignHierarchy";
oFF.OuDpHierarchyActionUnassignHierarchy.create = function(actionsBase)
{
	let obj = new oFF.OuDpHierarchyActionUnassignHierarchy();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpHierarchyActionUnassignHierarchy.prototype.doAction = function(parameters)
{
	this.getDataProvider().getCc().unassignHierarchy(parameters.get(0));
	this.getDataProvider().getCc().refreshFieldContainerDisplayForDimension(parameters.get(0), null);
	let result = this.newActionResult(parameters);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpHierarchyActionUnassignHierarchy.prototype.executeTyped = function(dimName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpHierarchyActionUnassignHierarchy.prototype.getName = function()
{
	return oFF.OuDpHierarchyActionUnassignHierarchy.NAME;
};

oFF.OuDPLifecycleActionConnect = function() {};
oFF.OuDPLifecycleActionConnect.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDPLifecycleActionConnect.prototype._ff_c = "OuDPLifecycleActionConnect";

oFF.OuDPLifecycleActionConnect.NAME = "connectDataProvider";
oFF.OuDPLifecycleActionConnect.create = function(actionsBase)
{
	let obj = new oFF.OuDPLifecycleActionConnect();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDPLifecycleActionConnect.prototype.doAction = function(parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let newConfigJson = converter.toStructure(parameters.get(0));
	let closePreviousConnection = converter.toBoolean(parameters.get(1), true);
	let dataProvider = this.getDataProvider();
	if (oFF.notNull(newConfigJson) && newConfigJson.isStructure())
	{
		let newConnection = oFF.OuDataProviderConnection.createConnectionFromJson(dataProvider.getApplication(), newConfigJson.asStructure());
		dataProvider.setConnection(newConnection);
	}
	let lifecycleActions = this.getDataProvider().getActions().getLifecycleActions();
	return lifecycleActions.reconnectDataProvider(closePreviousConnection).onThenExt((empty) => {
		return this.newActionResult(parameters);
	});
};
oFF.OuDPLifecycleActionConnect.prototype.executeTyped = function(connection, disconnectFromPrevious)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	if (oFF.isNull(connection))
	{
		parameters.add(null);
	}
	else
	{
		let configString = oFF.PrUtils.serialize(connection.serializeJson(), false, false, 0);
		parameters.add(configString);
	}
	parameters.add(converter.fromBoolean(disconnectFromPrevious));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDPLifecycleActionConnect.prototype.getName = function()
{
	return oFF.OuDPLifecycleActionConnect.NAME;
};
oFF.OuDPLifecycleActionConnect.prototype.isQueryManagerNeeded = function()
{
	return false;
};

oFF.OuDPLifecycleActionConnectToSystemSimple = function() {};
oFF.OuDPLifecycleActionConnectToSystemSimple.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDPLifecycleActionConnectToSystemSimple.prototype._ff_c = "OuDPLifecycleActionConnectToSystemSimple";

oFF.OuDPLifecycleActionConnectToSystemSimple.NAME = "connectDataProviderToSystemSimple";
oFF.OuDPLifecycleActionConnectToSystemSimple.create = function(actionsBase)
{
	let obj = new oFF.OuDPLifecycleActionConnectToSystemSimple();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDPLifecycleActionConnectToSystemSimple.prototype.doAction = function(parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let systemName = parameters.get(0);
	let fullQualifiedDataSourceName = parameters.get(1);
	let closePreviousConnection = converter.toBoolean(parameters.get(2), true);
	if (oFF.XStringUtils.isNullOrEmpty(systemName))
	{
		return oFF.XPromise.reject(oFF.XError.create("invalid system name"));
	}
	if (oFF.XStringUtils.isNullOrEmpty(fullQualifiedDataSourceName))
	{
		return oFF.XPromise.reject(oFF.XError.create("invalid data source name"));
	}
	let connection = this.getDataProvider().getConnection();
	let newConnection = oFF.OuDataProviderConnection.createConnectionFromJson(this.getDataProvider().getApplication(), connection.serializeJson());
	let dataSource = oFF.QFactory.createDataSourceWithFqn(fullQualifiedDataSourceName);
	dataSource.setSystemName(systemName);
	newConnection.setDataSource(dataSource);
	let lifecycleActions = this.getDataProvider().getActions().getLifecycleActions();
	return lifecycleActions.connectDataProvider(newConnection, closePreviousConnection).onThenExt((empty2) => {
		return this.newActionResult(parameters);
	});
};
oFF.OuDPLifecycleActionConnectToSystemSimple.prototype.executeTyped = function(systemName, dataSourceFqn, disconnectFromPrevious)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(systemName);
	parameters.add(dataSourceFqn);
	parameters.add(converter.fromBoolean(disconnectFromPrevious));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDPLifecycleActionConnectToSystemSimple.prototype.getName = function()
{
	return oFF.OuDPLifecycleActionConnectToSystemSimple.NAME;
};

oFF.OuDPLifecycleActionDisconnect = function() {};
oFF.OuDPLifecycleActionDisconnect.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDPLifecycleActionDisconnect.prototype._ff_c = "OuDPLifecycleActionDisconnect";

oFF.OuDPLifecycleActionDisconnect.NAME = "disconnectDataProvider";
oFF.OuDPLifecycleActionDisconnect.create = function(actionsBase)
{
	let obj = new oFF.OuDPLifecycleActionDisconnect();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDPLifecycleActionDisconnect.prototype.doAction = function(parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let closeConnection = converter.toBoolean(parameters.get(0), true);
	return this.getDataProvider().getConnectorBase().processDisconnect(closeConnection, null).onThenExt((empty2) => {
		return this.newActionResult(parameters);
	});
};
oFF.OuDPLifecycleActionDisconnect.prototype.executeTyped = function(closeConnection)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(converter.fromBoolean(closeConnection));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDPLifecycleActionDisconnect.prototype.getName = function()
{
	return oFF.OuDPLifecycleActionDisconnect.NAME;
};
oFF.OuDPLifecycleActionDisconnect.prototype.isQueryManagerNeeded = function()
{
	return false;
};

oFF.OuDPLifecycleActionKill = function() {};
oFF.OuDPLifecycleActionKill.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDPLifecycleActionKill.prototype._ff_c = "OuDPLifecycleActionKill";

oFF.OuDPLifecycleActionKill.NAME = "killDataProvider";
oFF.OuDPLifecycleActionKill.PARAM_DISCONNECT = "disconnect";
oFF.OuDPLifecycleActionKill.create = function(actionsBase)
{
	let obj = new oFF.OuDPLifecycleActionKill();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDPLifecycleActionKill.prototype.doAction = function(parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let closeConnection = converter.toBoolean(parameters.get(0), true);
	let disconnectPromise = oFF.XPromise.resolve(null);
	if (closeConnection)
	{
		disconnectPromise = this.getDataProvider().getActions().getLifecycleActions().disconnectDataProvider();
	}
	return disconnectPromise.onThenExt((empty) => {
		let result = this.newActionResult(parameters);
		this.getDataProvider().startRelease();
		return result;
	});
};
oFF.OuDPLifecycleActionKill.prototype.executeTyped = function(disconnectFromPrevious)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(converter.fromBoolean(disconnectFromPrevious));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDPLifecycleActionKill.prototype.getName = function()
{
	return oFF.OuDPLifecycleActionKill.NAME;
};
oFF.OuDPLifecycleActionKill.prototype.isQueryManagerNeeded = function()
{
	return false;
};

oFF.OuDPLifecycleActionReconnect = function() {};
oFF.OuDPLifecycleActionReconnect.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDPLifecycleActionReconnect.prototype._ff_c = "OuDPLifecycleActionReconnect";

oFF.OuDPLifecycleActionReconnect.NAME = "reconnectDataProvider";
oFF.OuDPLifecycleActionReconnect.create = function(actionsBase)
{
	let obj = new oFF.OuDPLifecycleActionReconnect();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDPLifecycleActionReconnect.prototype.doAction = function(parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let closePreviousConnection = converter.toBoolean(parameters.get(0), true);
	let dataProvider = this.getDataProvider();
	let lifecycleActions = this.getDataProvider().getActions().getLifecycleActions();
	let actionPromise = oFF.XPromise.resolve(null);
	if (closePreviousConnection)
	{
		actionPromise = lifecycleActions.disconnectDataProvider();
	}
	return actionPromise.onThenPromise((empty1) => {
		return dataProvider.getConnectorBase().processConnectionSetup(null);
	}).onThenExt((empty2) => {
		return this.newActionResult(parameters);
	});
};
oFF.OuDPLifecycleActionReconnect.prototype.executeTyped = function(closePreviousConnection)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(converter.fromBoolean(closePreviousConnection));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDPLifecycleActionReconnect.prototype.getName = function()
{
	return oFF.OuDPLifecycleActionReconnect.NAME;
};
oFF.OuDPLifecycleActionReconnect.prototype.isQueryManagerNeeded = function()
{
	return false;
};

oFF.OuDpPresentationActionAddResultSetField = function() {};
oFF.OuDpPresentationActionAddResultSetField.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionAddResultSetField.prototype._ff_c = "OuDpPresentationActionAddResultSetField";

oFF.OuDpPresentationActionAddResultSetField.NAME = "addFieldToResultSet";
oFF.OuDpPresentationActionAddResultSetField.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionAddResultSetField();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionAddResultSetField.prototype.doAction = function(parameters)
{
	let field = this.getDataProvider().getCc().getField(parameters.get(0));
	let dimension = oFF.isNull(field) ? null : field.getDimension();
	let attribute = oFF.isNull(field) ? null : field.getAttribute();
	let flt = oFF.isNull(dimension) ? null : dimension.getFieldLayoutType();
	if (flt === oFF.FieldLayoutType.FIELD_BASED)
	{
		this.getDataProvider().getCc().addField(dimension.getDimensionType(), dimension.getName(), field.getPresentationType(), field.getName(), oFF.QContextType.RESULT_SET);
	}
	else if (oFF.notNull(attribute))
	{
		this.getDataProvider().getCc().addAttributeField(dimension.getDimensionType(), dimension.getName(), attribute.getName(), field.getPresentationType(), field.getName(), oFF.QContextType.RESULT_SET);
	}
	let result = this.newActionResult(parameters);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionAddResultSetField.prototype.executeTyped = function(fieldName)
{
	let parameters = oFF.XList.create();
	parameters.add(fieldName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionAddResultSetField.prototype.getName = function()
{
	return oFF.OuDpPresentationActionAddResultSetField.NAME;
};

oFF.OuDpPresentationActionGetAvailableDisplays = function() {};
oFF.OuDpPresentationActionGetAvailableDisplays.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionGetAvailableDisplays.prototype._ff_c = "OuDpPresentationActionGetAvailableDisplays";

oFF.OuDpPresentationActionGetAvailableDisplays.NAME = "getFieldContainerAvailableDisplays";
oFF.OuDpPresentationActionGetAvailableDisplays.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionGetAvailableDisplays();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionGetAvailableDisplays.prototype.doAction = function(parameters)
{
	let value = this.getDataProvider().getCc().getAvailableFieldContainerDisplays(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.setReturnValue(value);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionGetAvailableDisplays.prototype.executeTyped = function(dimName, attrName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionGetAvailableDisplays.prototype.getName = function()
{
	return oFF.OuDpPresentationActionGetAvailableDisplays.NAME;
};

oFF.OuDpPresentationActionGetAvailableKeyDisplays = function() {};
oFF.OuDpPresentationActionGetAvailableKeyDisplays.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionGetAvailableKeyDisplays.prototype._ff_c = "OuDpPresentationActionGetAvailableKeyDisplays";

oFF.OuDpPresentationActionGetAvailableKeyDisplays.NAME = "getFieldContainerAvailableKeyDisplays";
oFF.OuDpPresentationActionGetAvailableKeyDisplays.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionGetAvailableKeyDisplays();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionGetAvailableKeyDisplays.prototype.doAction = function(parameters)
{
	let value = this.getDataProvider().getCc().getAvailableFieldContainerKeyDisplays(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.setReturnValue(value);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionGetAvailableKeyDisplays.prototype.executeTyped = function(dimName, attrName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionGetAvailableKeyDisplays.prototype.getName = function()
{
	return oFF.OuDpPresentationActionGetAvailableKeyDisplays.NAME;
};

oFF.OuDpPresentationActionGetAvailableKeyViews = function() {};
oFF.OuDpPresentationActionGetAvailableKeyViews.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionGetAvailableKeyViews.prototype._ff_c = "OuDpPresentationActionGetAvailableKeyViews";

oFF.OuDpPresentationActionGetAvailableKeyViews.NAME = "getFieldContainerAvailableKeyViews";
oFF.OuDpPresentationActionGetAvailableKeyViews.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionGetAvailableKeyViews();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionGetAvailableKeyViews.prototype.doAction = function(parameters)
{
	let value = this.getDataProvider().getCc().getAvailableFieldContainerKeyViews(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.setReturnValue(value);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionGetAvailableKeyViews.prototype.executeTyped = function(dimName, attrName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionGetAvailableKeyViews.prototype.getName = function()
{
	return oFF.OuDpPresentationActionGetAvailableKeyViews.NAME;
};

oFF.OuDpPresentationActionGetAvailableTextViews = function() {};
oFF.OuDpPresentationActionGetAvailableTextViews.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionGetAvailableTextViews.prototype._ff_c = "OuDpPresentationActionGetAvailableTextViews";

oFF.OuDpPresentationActionGetAvailableTextViews.NAME = "getFieldContainerAvailableTextViews";
oFF.OuDpPresentationActionGetAvailableTextViews.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionGetAvailableTextViews();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionGetAvailableTextViews.prototype.doAction = function(parameters)
{
	let value = this.getDataProvider().getCc().getAvailableFieldContainerTextViews(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.setReturnValue(value);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionGetAvailableTextViews.prototype.executeTyped = function(dimName, attrName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionGetAvailableTextViews.prototype.getName = function()
{
	return oFF.OuDpPresentationActionGetAvailableTextViews.NAME;
};

oFF.OuDpPresentationActionGetDefaultKeyDisplay = function() {};
oFF.OuDpPresentationActionGetDefaultKeyDisplay.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionGetDefaultKeyDisplay.prototype._ff_c = "OuDpPresentationActionGetDefaultKeyDisplay";

oFF.OuDpPresentationActionGetDefaultKeyDisplay.NAME = "getFieldContainerDefaultKeyDisplay";
oFF.OuDpPresentationActionGetDefaultKeyDisplay.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionGetDefaultKeyDisplay();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionGetDefaultKeyDisplay.prototype.doAction = function(parameters)
{
	let value = this.getDataProvider().getCc().getFieldContainerDefaultKeyDisplay(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.setReturnValue(value);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionGetDefaultKeyDisplay.prototype.executeTyped = function(dimName, attrName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionGetDefaultKeyDisplay.prototype.getName = function()
{
	return oFF.OuDpPresentationActionGetDefaultKeyDisplay.NAME;
};

oFF.OuDpPresentationActionGetDefaultKeyView = function() {};
oFF.OuDpPresentationActionGetDefaultKeyView.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionGetDefaultKeyView.prototype._ff_c = "OuDpPresentationActionGetDefaultKeyView";

oFF.OuDpPresentationActionGetDefaultKeyView.NAME = "getFieldContainerDefaultKeyView";
oFF.OuDpPresentationActionGetDefaultKeyView.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionGetDefaultKeyView();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionGetDefaultKeyView.prototype.doAction = function(parameters)
{
	let value = this.getDataProvider().getCc().getFieldContainerDefaultKeyView(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.setReturnValue(value);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionGetDefaultKeyView.prototype.executeTyped = function(dimName, attrName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionGetDefaultKeyView.prototype.getName = function()
{
	return oFF.OuDpPresentationActionGetDefaultKeyView.NAME;
};

oFF.OuDpPresentationActionGetDefaultTextView = function() {};
oFF.OuDpPresentationActionGetDefaultTextView.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionGetDefaultTextView.prototype._ff_c = "OuDpPresentationActionGetDefaultTextView";

oFF.OuDpPresentationActionGetDefaultTextView.NAME = "getFieldContainerDefaultTextView";
oFF.OuDpPresentationActionGetDefaultTextView.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionGetDefaultTextView();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionGetDefaultTextView.prototype.doAction = function(parameters)
{
	let value = this.getDataProvider().getCc().getFieldContainerDefaultTextView(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.setReturnValue(value);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionGetDefaultTextView.prototype.executeTyped = function(dimName, attrName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionGetDefaultTextView.prototype.getName = function()
{
	return oFF.OuDpPresentationActionGetDefaultTextView.NAME;
};

oFF.OuDpPresentationActionGetDisplay = function() {};
oFF.OuDpPresentationActionGetDisplay.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionGetDisplay.prototype._ff_c = "OuDpPresentationActionGetDisplay";

oFF.OuDpPresentationActionGetDisplay.NAME = "getFieldContainerDisplay";
oFF.OuDpPresentationActionGetDisplay.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionGetDisplay();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionGetDisplay.prototype.doAction = function(parameters)
{
	let value = this.getDataProvider().getCc().getFieldContainerDisplay(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.setReturnValue(value);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionGetDisplay.prototype.executeTyped = function(dimName, attrName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionGetDisplay.prototype.getName = function()
{
	return oFF.OuDpPresentationActionGetDisplay.NAME;
};

oFF.OuDpPresentationActionGetKeyDisplay = function() {};
oFF.OuDpPresentationActionGetKeyDisplay.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionGetKeyDisplay.prototype._ff_c = "OuDpPresentationActionGetKeyDisplay";

oFF.OuDpPresentationActionGetKeyDisplay.NAME = "getFieldContainerKeyDisplay";
oFF.OuDpPresentationActionGetKeyDisplay.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionGetKeyDisplay();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionGetKeyDisplay.prototype.doAction = function(parameters)
{
	let value = this.getDataProvider().getCc().getFieldContainerKeyDisplay(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.setReturnValue(value);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionGetKeyDisplay.prototype.executeTyped = function(dimName, attrName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionGetKeyDisplay.prototype.getName = function()
{
	return oFF.OuDpPresentationActionGetKeyDisplay.NAME;
};

oFF.OuDpPresentationActionGetKeyView = function() {};
oFF.OuDpPresentationActionGetKeyView.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionGetKeyView.prototype._ff_c = "OuDpPresentationActionGetKeyView";

oFF.OuDpPresentationActionGetKeyView.NAME = "getFieldContainerKeyView";
oFF.OuDpPresentationActionGetKeyView.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionGetKeyView();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionGetKeyView.prototype.doAction = function(parameters)
{
	let value = this.getDataProvider().getCc().getFieldContainerKeyView(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.setReturnValue(value);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionGetKeyView.prototype.executeTyped = function(dimName, attrName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionGetKeyView.prototype.getName = function()
{
	return oFF.OuDpPresentationActionGetKeyView.NAME;
};

oFF.OuDpPresentationActionGetTextView = function() {};
oFF.OuDpPresentationActionGetTextView.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionGetTextView.prototype._ff_c = "OuDpPresentationActionGetTextView";

oFF.OuDpPresentationActionGetTextView.NAME = "getFieldContainerTextView";
oFF.OuDpPresentationActionGetTextView.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionGetTextView();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionGetTextView.prototype.doAction = function(parameters)
{
	let value = this.getDataProvider().getCc().getFieldContainerTextView(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.setReturnValue(value);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionGetTextView.prototype.executeTyped = function(dimName, attrName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionGetTextView.prototype.getName = function()
{
	return oFF.OuDpPresentationActionGetTextView.NAME;
};

oFF.OuDpPresentationActionIsFieldInResultSet = function() {};
oFF.OuDpPresentationActionIsFieldInResultSet.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionIsFieldInResultSet.prototype._ff_c = "OuDpPresentationActionIsFieldInResultSet";

oFF.OuDpPresentationActionIsFieldInResultSet.NAME = "isFieldInResultSet";
oFF.OuDpPresentationActionIsFieldInResultSet.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionIsFieldInResultSet();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionIsFieldInResultSet.prototype.doAction = function(parameters)
{
	let field = this.getDataProvider().getCc().getField(parameters.get(0));
	let dimension = oFF.isNull(field) ? null : field.getDimension();
	let attribute = oFF.isNull(field) ? null : field.getAttribute();
	let flt = oFF.isNull(dimension) ? null : dimension.getFieldLayoutType();
	let resultSetFields = null;
	if (flt === oFF.FieldLayoutType.FIELD_BASED)
	{
		resultSetFields = dimension.getResultSetFields();
	}
	else if (oFF.notNull(attribute))
	{
		resultSetFields = attribute.getResultSetFields();
	}
	let fieldShown = oFF.notNull(resultSetFields) && (field.getObtainability() === null || field.getObtainability() === oFF.ObtainabilityType.ALWAYS) && resultSetFields.contains(field);
	let result = this.newActionResult(parameters);
	result.setReturnValue(oFF.XBooleanValue.create(fieldShown));
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionIsFieldInResultSet.prototype.executeTyped = function(fieldName)
{
	let parameters = oFF.XList.create();
	parameters.add(fieldName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionIsFieldInResultSet.prototype.getName = function()
{
	return oFF.OuDpPresentationActionIsFieldInResultSet.NAME;
};

oFF.OuDpPresentationActionIsKeyViewActive = function() {};
oFF.OuDpPresentationActionIsKeyViewActive.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionIsKeyViewActive.prototype._ff_c = "OuDpPresentationActionIsKeyViewActive";

oFF.OuDpPresentationActionIsKeyViewActive.NAME = "isFieldContainerKeyViewActive";
oFF.OuDpPresentationActionIsKeyViewActive.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionIsKeyViewActive();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionIsKeyViewActive.prototype.doAction = function(parameters)
{
	let hierarchyActive = this.getDataProvider().getCc().isFieldContainerKeyViewActive(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.setReturnValue(oFF.XBooleanValue.create(hierarchyActive));
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionIsKeyViewActive.prototype.executeTyped = function(dimName, attrName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionIsKeyViewActive.prototype.getName = function()
{
	return oFF.OuDpPresentationActionIsKeyViewActive.NAME;
};

oFF.OuDpPresentationActionIsKeyViewDefault = function() {};
oFF.OuDpPresentationActionIsKeyViewDefault.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionIsKeyViewDefault.prototype._ff_c = "OuDpPresentationActionIsKeyViewDefault";

oFF.OuDpPresentationActionIsKeyViewDefault.NAME = "isFieldContainerKeyViewDefault";
oFF.OuDpPresentationActionIsKeyViewDefault.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionIsKeyViewDefault();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionIsKeyViewDefault.prototype.doAction = function(parameters)
{
	let hierarchyActive = this.getDataProvider().getCc().isFieldContainerKeyViewDefault(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.setReturnValue(oFF.XBooleanValue.create(hierarchyActive));
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionIsKeyViewDefault.prototype.executeTyped = function(dimName, attrName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionIsKeyViewDefault.prototype.getName = function()
{
	return oFF.OuDpPresentationActionIsKeyViewDefault.NAME;
};

oFF.OuDpPresentationActionIsKeyViewSupported = function() {};
oFF.OuDpPresentationActionIsKeyViewSupported.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionIsKeyViewSupported.prototype._ff_c = "OuDpPresentationActionIsKeyViewSupported";

oFF.OuDpPresentationActionIsKeyViewSupported.NAME = "isFieldContainerKeyViewSupported";
oFF.OuDpPresentationActionIsKeyViewSupported.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionIsKeyViewSupported();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionIsKeyViewSupported.prototype.doAction = function(parameters)
{
	let hierarchyActive = this.getDataProvider().getCc().isFieldContainerKeyViewSupported(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.setReturnValue(oFF.XBooleanValue.create(hierarchyActive));
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionIsKeyViewSupported.prototype.executeTyped = function(dimName, attrName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionIsKeyViewSupported.prototype.getName = function()
{
	return oFF.OuDpPresentationActionIsKeyViewSupported.NAME;
};

oFF.OuDpPresentationActionIsTextViewActive = function() {};
oFF.OuDpPresentationActionIsTextViewActive.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionIsTextViewActive.prototype._ff_c = "OuDpPresentationActionIsTextViewActive";

oFF.OuDpPresentationActionIsTextViewActive.NAME = "isFieldContainerTextViewActive";
oFF.OuDpPresentationActionIsTextViewActive.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionIsTextViewActive();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionIsTextViewActive.prototype.doAction = function(parameters)
{
	let hierarchyActive = this.getDataProvider().getCc().isFieldContainerTextViewActive(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.setReturnValue(oFF.XBooleanValue.create(hierarchyActive));
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionIsTextViewActive.prototype.executeTyped = function(dimName, attrName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionIsTextViewActive.prototype.getName = function()
{
	return oFF.OuDpPresentationActionIsTextViewActive.NAME;
};

oFF.OuDpPresentationActionIsTextViewDefault = function() {};
oFF.OuDpPresentationActionIsTextViewDefault.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionIsTextViewDefault.prototype._ff_c = "OuDpPresentationActionIsTextViewDefault";

oFF.OuDpPresentationActionIsTextViewDefault.NAME = "isFieldContainerTextViewDefault";
oFF.OuDpPresentationActionIsTextViewDefault.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionIsTextViewDefault();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionIsTextViewDefault.prototype.doAction = function(parameters)
{
	let hierarchyActive = this.getDataProvider().getCc().isFieldContainerTextViewDefault(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.setReturnValue(oFF.XBooleanValue.create(hierarchyActive));
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionIsTextViewDefault.prototype.executeTyped = function(dimName, attrName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionIsTextViewDefault.prototype.getName = function()
{
	return oFF.OuDpPresentationActionIsTextViewDefault.NAME;
};

oFF.OuDpPresentationActionIsTextViewSupported = function() {};
oFF.OuDpPresentationActionIsTextViewSupported.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionIsTextViewSupported.prototype._ff_c = "OuDpPresentationActionIsTextViewSupported";

oFF.OuDpPresentationActionIsTextViewSupported.NAME = "isFieldContainerTextViewSupported";
oFF.OuDpPresentationActionIsTextViewSupported.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionIsTextViewSupported();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionIsTextViewSupported.prototype.doAction = function(parameters)
{
	let hierarchyActive = this.getDataProvider().getCc().isFieldContainerTextViewSupported(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.setReturnValue(oFF.XBooleanValue.create(hierarchyActive));
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionIsTextViewSupported.prototype.executeTyped = function(dimName, attrName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionIsTextViewSupported.prototype.getName = function()
{
	return oFF.OuDpPresentationActionIsTextViewSupported.NAME;
};

oFF.OuDpPresentationActionRemoveResultSetField = function() {};
oFF.OuDpPresentationActionRemoveResultSetField.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionRemoveResultSetField.prototype._ff_c = "OuDpPresentationActionRemoveResultSetField";

oFF.OuDpPresentationActionRemoveResultSetField.NAME = "removeFieldFromResultSet";
oFF.OuDpPresentationActionRemoveResultSetField.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionRemoveResultSetField();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionRemoveResultSetField.prototype.doAction = function(parameters)
{
	let field = this.getDataProvider().getCc().getField(parameters.get(0));
	let dimension = oFF.isNull(field) ? null : field.getDimension();
	let attribute = oFF.isNull(field) ? null : field.getAttribute();
	let flt = oFF.isNull(dimension) ? null : dimension.getFieldLayoutType();
	if (flt === oFF.FieldLayoutType.FIELD_BASED)
	{
		this.getDataProvider().getCc().removeField(dimension.getDimensionType(), dimension.getName(), field.getPresentationType(), field.getName(), oFF.QContextType.RESULT_SET);
	}
	else if (oFF.notNull(attribute))
	{
		this.getDataProvider().getCc().removeAttributeField(dimension.getDimensionType(), dimension.getName(), attribute.getName(), field.getPresentationType(), field.getName(), oFF.QContextType.RESULT_SET);
	}
	let result = this.newActionResult(parameters);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionRemoveResultSetField.prototype.executeTyped = function(fieldName)
{
	let parameters = oFF.XList.create();
	parameters.add(fieldName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionRemoveResultSetField.prototype.getName = function()
{
	return oFF.OuDpPresentationActionRemoveResultSetField.NAME;
};

oFF.OuDpPresentationActionResetKeyViewToDefault = function() {};
oFF.OuDpPresentationActionResetKeyViewToDefault.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionResetKeyViewToDefault.prototype._ff_c = "OuDpPresentationActionResetKeyViewToDefault";

oFF.OuDpPresentationActionResetKeyViewToDefault.NAME = "resetFieldContainerKeyViewToDefault";
oFF.OuDpPresentationActionResetKeyViewToDefault.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionResetKeyViewToDefault();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionResetKeyViewToDefault.prototype.doAction = function(parameters)
{
	this.getDataProvider().getCc().resetFieldContainerKeyViewToDefault(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionResetKeyViewToDefault.prototype.executeTyped = function(dimName, attrName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionResetKeyViewToDefault.prototype.getName = function()
{
	return oFF.OuDpPresentationActionResetKeyViewToDefault.NAME;
};

oFF.OuDpPresentationActionResetTextViewToDefault = function() {};
oFF.OuDpPresentationActionResetTextViewToDefault.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionResetTextViewToDefault.prototype._ff_c = "OuDpPresentationActionResetTextViewToDefault";

oFF.OuDpPresentationActionResetTextViewToDefault.NAME = "resetFieldContainerTextViewToDefault";
oFF.OuDpPresentationActionResetTextViewToDefault.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionResetTextViewToDefault();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionResetTextViewToDefault.prototype.doAction = function(parameters)
{
	this.getDataProvider().getCc().resetFieldContainerTextViewToDefault(parameters.get(0), parameters.get(1));
	let result = this.newActionResult(parameters);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionResetTextViewToDefault.prototype.executeTyped = function(dimName, attrName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionResetTextViewToDefault.prototype.getName = function()
{
	return oFF.OuDpPresentationActionResetTextViewToDefault.NAME;
};

oFF.OuDpPresentationActionSetDisplay = function() {};
oFF.OuDpPresentationActionSetDisplay.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionSetDisplay.prototype._ff_c = "OuDpPresentationActionSetDisplay";

oFF.OuDpPresentationActionSetDisplay.NAME = "setFieldContainerDisplay";
oFF.OuDpPresentationActionSetDisplay.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionSetDisplay();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionSetDisplay.prototype.doAction = function(parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	this.getDataProvider().getCc().setFieldContainerDisplay(parameters.get(0), parameters.get(1), converter.toFieldContainerDisplay(parameters.get(2)));
	let result = this.newActionResult(parameters);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionSetDisplay.prototype.executeTyped = function(dimName, attrName, fieldContainerDisplay)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	parameters.add(converter.fromFieldContainerDisplay(fieldContainerDisplay));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionSetDisplay.prototype.getName = function()
{
	return oFF.OuDpPresentationActionSetDisplay.NAME;
};

oFF.OuDpPresentationActionSetKeyDisplay = function() {};
oFF.OuDpPresentationActionSetKeyDisplay.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionSetKeyDisplay.prototype._ff_c = "OuDpPresentationActionSetKeyDisplay";

oFF.OuDpPresentationActionSetKeyDisplay.NAME = "setFieldContainerKeyDisplay";
oFF.OuDpPresentationActionSetKeyDisplay.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionSetKeyDisplay();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionSetKeyDisplay.prototype.doAction = function(parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	this.getDataProvider().getCc().setFieldContainerKeyDisplay(parameters.get(0), parameters.get(1), converter.toFieldContainerKeyDisplay(parameters.get(2)));
	let result = this.newActionResult(parameters);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionSetKeyDisplay.prototype.executeTyped = function(dimName, attrName, fieldContainerDisplay)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	parameters.add(converter.fromFieldContainerKeyDisplay(fieldContainerDisplay));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionSetKeyDisplay.prototype.getName = function()
{
	return oFF.OuDpPresentationActionSetKeyDisplay.NAME;
};

oFF.OuDpPresentationActionSetKeyView = function() {};
oFF.OuDpPresentationActionSetKeyView.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionSetKeyView.prototype._ff_c = "OuDpPresentationActionSetKeyView";

oFF.OuDpPresentationActionSetKeyView.NAME = "setFieldContainerKeyView";
oFF.OuDpPresentationActionSetKeyView.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionSetKeyView();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionSetKeyView.prototype.doAction = function(parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	this.getDataProvider().getCc().setFieldContainerKeyView(parameters.get(0), parameters.get(1), converter.toPresentationType(parameters.get(2)));
	let result = this.newActionResult(parameters);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionSetKeyView.prototype.executeTyped = function(dimName, attrName, presentationType)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	parameters.add(converter.fromPresentationType(presentationType));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionSetKeyView.prototype.getName = function()
{
	return oFF.OuDpPresentationActionSetKeyView.NAME;
};

oFF.OuDpPresentationActionSetTextView = function() {};
oFF.OuDpPresentationActionSetTextView.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpPresentationActionSetTextView.prototype._ff_c = "OuDpPresentationActionSetTextView";

oFF.OuDpPresentationActionSetTextView.NAME = "setFieldContainerTextView";
oFF.OuDpPresentationActionSetTextView.create = function(actionsBase)
{
	let obj = new oFF.OuDpPresentationActionSetTextView();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpPresentationActionSetTextView.prototype.doAction = function(parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	this.getDataProvider().getCc().setFieldContainerTextView(parameters.get(0), parameters.get(1), converter.toPresentationType(parameters.get(2)));
	let result = this.newActionResult(parameters);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpPresentationActionSetTextView.prototype.executeTyped = function(dimName, attrName, presentationType)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(attrName);
	parameters.add(converter.fromPresentationType(presentationType));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpPresentationActionSetTextView.prototype.getName = function()
{
	return oFF.OuDpPresentationActionSetTextView.NAME;
};

oFF.OuDPQueryModelSetDataSourceText = function() {};
oFF.OuDPQueryModelSetDataSourceText.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDPQueryModelSetDataSourceText.prototype._ff_c = "OuDPQueryModelSetDataSourceText";

oFF.OuDPQueryModelSetDataSourceText.NAME = "setDataSourceText";
oFF.OuDPQueryModelSetDataSourceText.create = function(actionsBase)
{
	let obj = new oFF.OuDPQueryModelSetDataSourceText();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDPQueryModelSetDataSourceText.prototype.doAction = function(parameters)
{
	return oFF.XPromise.create((resolve, reject) => {
		try
		{
			let queryModel = oFF.XObject.castToAny(this.getDataProvider().getQueryManager().getQueryModel());
			queryModel.setText(parameters.get(0));
			let result = this.newActionResult(parameters);
			result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
			resolve(result);
		}
		catch (e)
		{
			reject(oFF.XError.createWithThrowable(e));
		}
	});
};
oFF.OuDPQueryModelSetDataSourceText.prototype.executeTyped = function(dataSourceName)
{
	let parameters = oFF.XList.create();
	parameters.add(dataSourceName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDPQueryModelSetDataSourceText.prototype.getName = function()
{
	return oFF.OuDPQueryModelSetDataSourceText.NAME;
};

oFF.OuDpGetCurrentResultSetReadMode = function() {};
oFF.OuDpGetCurrentResultSetReadMode.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpGetCurrentResultSetReadMode.prototype._ff_c = "OuDpGetCurrentResultSetReadMode";

oFF.OuDpGetCurrentResultSetReadMode.NAME = "getCurrentResultSetReadMode";
oFF.OuDpGetCurrentResultSetReadMode.create = function(actionsBase)
{
	let obj = new oFF.OuDpGetCurrentResultSetReadMode();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpGetCurrentResultSetReadMode.prototype.doAction = function(parameters)
{
	let dimension = this.getDataProvider().getCc().getDimension(parameters.get(0));
	let result = this.newActionResult(parameters);
	result.setReturnValue(dimension.getReadMode(oFF.QContextType.RESULT_SET));
	return oFF.XPromise.resolve(result);
};
oFF.OuDpGetCurrentResultSetReadMode.prototype.executeTyped = function(dimName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpGetCurrentResultSetReadMode.prototype.getName = function()
{
	return oFF.OuDpGetCurrentResultSetReadMode.NAME;
};

oFF.OuDpGetSupportedResultSetReadModes = function() {};
oFF.OuDpGetSupportedResultSetReadModes.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpGetSupportedResultSetReadModes.prototype._ff_c = "OuDpGetSupportedResultSetReadModes";

oFF.OuDpGetSupportedResultSetReadModes.NAME = "getSupportedResultSetReadModes";
oFF.OuDpGetSupportedResultSetReadModes.create = function(actionsBase)
{
	let obj = new oFF.OuDpGetSupportedResultSetReadModes();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpGetSupportedResultSetReadModes.prototype.doAction = function(parameters)
{
	let dimension = this.getDataProvider().getCc().getDimension(parameters.get(0));
	let result = this.newActionResult(parameters);
	result.setReturnValue(dimension.getSupportedReadModes(oFF.QContextType.RESULT_SET));
	return oFF.XPromise.resolve(result);
};
oFF.OuDpGetSupportedResultSetReadModes.prototype.executeTyped = function(dimName)
{
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpGetSupportedResultSetReadModes.prototype.getName = function()
{
	return oFF.OuDpGetSupportedResultSetReadModes.NAME;
};

oFF.OuDpSetResultSetReadMode = function() {};
oFF.OuDpSetResultSetReadMode.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpSetResultSetReadMode.prototype._ff_c = "OuDpSetResultSetReadMode";

oFF.OuDpSetResultSetReadMode.NAME = "setResultSetReadMode";
oFF.OuDpSetResultSetReadMode.create = function(actionsBase)
{
	let obj = new oFF.OuDpSetResultSetReadMode();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpSetResultSetReadMode.prototype.doAction = function(parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	this.getDataProvider().getCc().setDimensionMemberReadModeGracefulExt(parameters.get(0), oFF.QContextType.RESULT_SET, converter.toMemberReadMode(parameters.get(1)), converter.toBoolean(parameters.get(2), false));
	let result = this.newActionResult(parameters);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpSetResultSetReadMode.prototype.executeTyped = function(dimName, readMode, synchronizeReadModeAndSuppression)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(dimName);
	parameters.add(converter.fromMemberReadMode(readMode));
	parameters.add(converter.fromBoolean(synchronizeReadModeAndSuppression));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpSetResultSetReadMode.prototype.getName = function()
{
	return oFF.OuDpSetResultSetReadMode.NAME;
};

oFF.OuDpResultSetActionFetchNewResultSet = function() {};
oFF.OuDpResultSetActionFetchNewResultSet.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpResultSetActionFetchNewResultSet.prototype._ff_c = "OuDpResultSetActionFetchNewResultSet";

oFF.OuDpResultSetActionFetchNewResultSet.NAME = "fetchNewResultSet";
oFF.OuDpResultSetActionFetchNewResultSet.create = function(actionsBase)
{
	let obj = new oFF.OuDpResultSetActionFetchNewResultSet();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpResultSetActionFetchNewResultSet.prototype.doAction = function(parameters)
{
	return this.getDataProvider().getResulting().fetchNewResultSet(null).onThenExt((messages) => {
		let actionResult = this.newActionResult(parameters);
		actionResult.setReturnValue(messages);
		return actionResult;
	});
};
oFF.OuDpResultSetActionFetchNewResultSet.prototype.executeTyped = function()
{
	return this.getActionsBase().performAction(this, oFF.XList.create());
};
oFF.OuDpResultSetActionFetchNewResultSet.prototype.getName = function()
{
	return oFF.OuDpResultSetActionFetchNewResultSet.NAME;
};

oFF.OuDpResultSetActionGetAscii = function() {};
oFF.OuDpResultSetActionGetAscii.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpResultSetActionGetAscii.prototype._ff_c = "OuDpResultSetActionGetAscii";

oFF.OuDpResultSetActionGetAscii.NAME = "getAsciiResultSet";
oFF.OuDpResultSetActionGetAscii.create = function(actionsBase)
{
	let obj = new oFF.OuDpResultSetActionGetAscii();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpResultSetActionGetAscii.prototype.doAction = function(parameters)
{
	let dataProvider = this.getDataProvider();
	let queryManager = dataProvider.getQueryManager();
	return oFF.XPromise.create((resolve, reject) => {
		let maxRowCount = oFF.XInteger.convertFromString(parameters.get(0));
		let maxColumnCount = oFF.XInteger.convertFromString(parameters.get(1));
		let asciiGrid = queryManager.getConvenienceCommands().getAsciiResultSet(maxRowCount, maxColumnCount);
		let actionResult = this.newActionResult(parameters);
		actionResult.setReturnValue(oFF.XStringValue.create(asciiGrid));
		resolve(actionResult);
	});
};
oFF.OuDpResultSetActionGetAscii.prototype.executeTyped = function(maxRowCount, maxColumnCount)
{
	let parameters = oFF.XList.create();
	parameters.add(oFF.XInteger.convertToString(maxRowCount));
	parameters.add(oFF.XInteger.convertToString(maxColumnCount));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpResultSetActionGetAscii.prototype.getName = function()
{
	return oFF.OuDpResultSetActionGetAscii.NAME;
};

oFF.OuDpResultSetActionGetCsv = function() {};
oFF.OuDpResultSetActionGetCsv.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpResultSetActionGetCsv.prototype._ff_c = "OuDpResultSetActionGetCsv";

oFF.OuDpResultSetActionGetCsv.NAME = "getCsvResultSet";
oFF.OuDpResultSetActionGetCsv.create = function(actionsBase)
{
	let obj = new oFF.OuDpResultSetActionGetCsv();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpResultSetActionGetCsv.prototype.doAction = function(parameters)
{
	let dataProvider = this.getDataProvider();
	let queryManager = dataProvider.getQueryManager();
	return oFF.XPromise.create((resolve, reject) => {
		let maxRowCount = oFF.XInteger.convertFromString(parameters.get(0));
		let maxColumnCount = oFF.XInteger.convertFromString(parameters.get(1));
		let csvGrid = queryManager.getConvenienceCommands().getCsvResultSet(maxRowCount, maxColumnCount);
		let actionResult = this.newActionResult(parameters);
		actionResult.setReturnValue(oFF.XStringValue.create(csvGrid));
		resolve(actionResult);
	});
};
oFF.OuDpResultSetActionGetCsv.prototype.executeTyped = function(maxRowCount, maxColumnCount)
{
	let parameters = oFF.XList.create();
	parameters.add(oFF.XInteger.convertToString(maxRowCount));
	parameters.add(oFF.XInteger.convertToString(maxColumnCount));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpResultSetActionGetCsv.prototype.getName = function()
{
	return oFF.OuDpResultSetActionGetCsv.NAME;
};

oFF.OuDpResultSetActionGetGridTile = function() {};
oFF.OuDpResultSetActionGetGridTile.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpResultSetActionGetGridTile.prototype._ff_c = "OuDpResultSetActionGetGridTile";

oFF.OuDpResultSetActionGetGridTile.NAME = "getGridTile";
oFF.OuDpResultSetActionGetGridTile.create = function(actionsBase)
{
	let obj = new oFF.OuDpResultSetActionGetGridTile();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpResultSetActionGetGridTile.prototype.doAction = function(parameters)
{
	return oFF.XPromise.create((resolve, reject) => {
		let dataProvider = this.getDataProvider();
		if (oFF.notNull(dataProvider))
		{
			let queryManager = dataProvider.getQueryManager();
			let gridCollector = queryManager.getQueryModel().getVisualizationManager().getGridCollector();
			gridCollector.processExecution(oFF.SyncType.NON_BLOCKING, oFF.OuGridCollectorListenerLambda.createSingleUse((result) => {
				if (result.hasErrors())
				{
					reject(oFF.MessageUtil.condenseMessagesToSingleError(result));
					return;
				}
				let actionResult = this.newActionResult(parameters);
				actionResult.setReturnValue(result.getData());
				resolve(actionResult);
			}), null, null);
		}
		else
		{
			reject(oFF.XError.create("No data provider configured to retrieve grid tile"));
		}
	});
};
oFF.OuDpResultSetActionGetGridTile.prototype.getName = function()
{
	return oFF.OuDpResultSetActionGetGridTile.NAME;
};

oFF.OuDpSerializationActionExportRepository = function() {};
oFF.OuDpSerializationActionExportRepository.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpSerializationActionExportRepository.prototype._ff_c = "OuDpSerializationActionExportRepository";

oFF.OuDpSerializationActionExportRepository.NAME = "exportRepository";
oFF.OuDpSerializationActionExportRepository.create = function(actionsBase)
{
	let obj = new oFF.OuDpSerializationActionExportRepository();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpSerializationActionExportRepository.prototype.doAction = function(parameters)
{
	let dataProvider = this.getDataProvider();
	let queryModel = dataProvider.getQueryManager().getQueryModel();
	return oFF.XPromise.create((resolve, reject) => {
		let useDelta = oFF.XBoolean.convertFromString(parameters.get(0));
		let modelFormat = useDelta ? oFF.QModelFormat.INA_REPOSITORY_DELTA : oFF.QModelFormat.INA_REPOSITORY;
		let inaRepo = queryModel.serializeToElement(modelFormat).asStructure();
		let actionResult = this.newActionResult(parameters);
		actionResult.setReturnValue(inaRepo);
		resolve(actionResult);
	});
};
oFF.OuDpSerializationActionExportRepository.prototype.executeTyped = function(useDelta)
{
	let parameters = oFF.XList.create();
	parameters.add(oFF.XBoolean.convertToString(useDelta));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpSerializationActionExportRepository.prototype.getName = function()
{
	return oFF.OuDpSerializationActionExportRepository.NAME;
};

oFF.OuDpSerializationActionImportRepository = function() {};
oFF.OuDpSerializationActionImportRepository.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpSerializationActionImportRepository.prototype._ff_c = "OuDpSerializationActionImportRepository";

oFF.OuDpSerializationActionImportRepository.NAME = "importRepository";
oFF.OuDpSerializationActionImportRepository.create = function(actionsBase)
{
	let obj = new oFF.OuDpSerializationActionImportRepository();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpSerializationActionImportRepository.prototype.doAction = function(parameters)
{
	let dataProvider = this.getDataProvider();
	let queryModel = dataProvider.getQueryManager().getQueryModel();
	return oFF.XPromise.create((resolve, reject) => {
		let inaRepo = parameters.get(0);
		let useDelta = oFF.XBoolean.convertFromString(parameters.get(1));
		let modelFormat = useDelta ? oFF.QModelFormat.INA_REPOSITORY_DELTA : oFF.QModelFormat.INA_REPOSITORY;
		let result = queryModel.deserializeExt(modelFormat, inaRepo);
		if (result.hasErrors())
		{
			reject(oFF.MessageUtil.condenseMessagesToSingleError(result));
			return;
		}
		let actionResult = this.newActionResult(parameters);
		actionResult.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
		resolve(actionResult);
	});
};
oFF.OuDpSerializationActionImportRepository.prototype.executeTyped = function(repository, useDelta)
{
	let parameters = oFF.XList.create();
	parameters.add(oFF.PrUtils.serialize(repository, false, false, 0));
	parameters.add(oFF.XBoolean.convertToString(useDelta));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpSerializationActionImportRepository.prototype.getName = function()
{
	return oFF.OuDpSerializationActionImportRepository.NAME;
};

oFF.OuDpGetCurrentSuppressionType = function() {};
oFF.OuDpGetCurrentSuppressionType.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpGetCurrentSuppressionType.prototype._ff_c = "OuDpGetCurrentSuppressionType";

oFF.OuDpGetCurrentSuppressionType.NAME = "getCurrentSuppressionType";
oFF.OuDpGetCurrentSuppressionType.create = function(actionsBase)
{
	let obj = new oFF.OuDpGetCurrentSuppressionType();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpGetCurrentSuppressionType.prototype.doAction = function(parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let axisType = converter.toAxisType(oFF.XCollectionUtils.getOptionalAtIndex(parameters, 0).orElse(null));
	let axis = oFF.isNull(axisType) ? null : this.getDataProvider().getCc().getQueryModel().getAxis(axisType);
	let result = this.newActionResult(parameters);
	result.setReturnValue(oFF.notNull(axis) ? axis.getZeroSuppressionType() : null);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpGetCurrentSuppressionType.prototype.executeTyped = function(axisType)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(converter.fromAxisType(axisType));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpGetCurrentSuppressionType.prototype.getName = function()
{
	return oFF.OuDpGetCurrentSuppressionType.NAME;
};

oFF.OuDpGetSupportedSuppressionTypes = function() {};
oFF.OuDpGetSupportedSuppressionTypes.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpGetSupportedSuppressionTypes.prototype._ff_c = "OuDpGetSupportedSuppressionTypes";

oFF.OuDpGetSupportedSuppressionTypes.NAME = "getSupportedSuppressionTypes";
oFF.OuDpGetSupportedSuppressionTypes.create = function(actionsBase)
{
	let obj = new oFF.OuDpGetSupportedSuppressionTypes();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpGetSupportedSuppressionTypes.prototype.doAction = function(parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let axisType = converter.toAxisType(oFF.XCollectionUtils.getOptionalAtIndex(parameters, 0).orElse(null));
	let axis = oFF.isNull(axisType) ? null : this.getDataProvider().getCc().getQueryModel().getAxis(axisType);
	let result = this.newActionResult(parameters);
	result.setReturnValue(oFF.isNull(axis) ? null : axis.getAvailableZeroSuppressionTypes());
	return oFF.XPromise.resolve(result);
};
oFF.OuDpGetSupportedSuppressionTypes.prototype.executeTyped = function(axisType)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(converter.fromAxisType(axisType));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpGetSupportedSuppressionTypes.prototype.getName = function()
{
	return oFF.OuDpGetSupportedSuppressionTypes.NAME;
};

oFF.OuDpSetResultSetSuppressionType = function() {};
oFF.OuDpSetResultSetSuppressionType.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpSetResultSetSuppressionType.prototype._ff_c = "OuDpSetResultSetSuppressionType";

oFF.OuDpSetResultSetSuppressionType.NAME = "setSuppressionType";
oFF.OuDpSetResultSetSuppressionType.create = function(actionsBase)
{
	let obj = new oFF.OuDpSetResultSetSuppressionType();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpSetResultSetSuppressionType.prototype.doAction = function(parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	this.getDataProvider().getCc().setAxisZeroSuppressionTypeExt(converter.toAxisType(parameters.get(0)), converter.toZeroSuppressionType(parameters.get(1)), converter.toBoolean(parameters.get(2), false));
	let result = this.newActionResult(parameters);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpSetResultSetSuppressionType.prototype.executeTyped = function(axisType, suppressionType, synchronizeReadModeAndSuppression)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(converter.fromAxisType(axisType));
	parameters.add(converter.fromZeroSuppressionType(suppressionType));
	parameters.add(converter.fromBoolean(synchronizeReadModeAndSuppression));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpSetResultSetSuppressionType.prototype.getName = function()
{
	return oFF.OuDpSetResultSetSuppressionType.NAME;
};

oFF.OuDpTotalsGetPosition = function() {};
oFF.OuDpTotalsGetPosition.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpTotalsGetPosition.prototype._ff_c = "OuDpTotalsGetPosition";

oFF.OuDpTotalsGetPosition.NAME = "getTotalsPosition";
oFF.OuDpTotalsGetPosition.create = function(actionsBase)
{
	let obj = new oFF.OuDpTotalsGetPosition();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpTotalsGetPosition.prototype.doAction = function(parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let modelLevel = converter.toModelLevel(parameters.get(0));
	let value = this.getDataProvider().getCc().getUniqueResultAlignment(modelLevel, parameters.get(1));
	let result = this.newActionResult(parameters);
	result.setReturnValue(value);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpTotalsGetPosition.prototype.executeTyped = function(modelLevel, elementName)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(converter.fromModelLevel(modelLevel));
	parameters.add(elementName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpTotalsGetPosition.prototype.getName = function()
{
	return oFF.OuDpTotalsGetPosition.NAME;
};

oFF.OuDpTotalsGetVisibility = function() {};
oFF.OuDpTotalsGetVisibility.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpTotalsGetVisibility.prototype._ff_c = "OuDpTotalsGetVisibility";

oFF.OuDpTotalsGetVisibility.NAME = "getTotalsVisibility";
oFF.OuDpTotalsGetVisibility.create = function(actionsBase)
{
	let obj = new oFF.OuDpTotalsGetVisibility();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpTotalsGetVisibility.prototype.doAction = function(parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let resultStructureElement = converter.toResultStructureElement(parameters.get(0));
	let modelLevel = converter.toModelLevel(parameters.get(1));
	let value = this.getDataProvider().getCc().getUniqueResultVisibilityByElementAndAlignment(null, resultStructureElement, modelLevel, parameters.get(2));
	let result = this.newActionResult(parameters);
	result.setReturnValue(value);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpTotalsGetVisibility.prototype.executeTyped = function(resultStructureElement, modelLevel, elementName)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(converter.fromResultStructureElement(resultStructureElement));
	parameters.add(converter.fromModelLevel(modelLevel));
	parameters.add(elementName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpTotalsGetVisibility.prototype.getName = function()
{
	return oFF.OuDpTotalsGetVisibility.NAME;
};

oFF.OuDpTotalsSetPosition = function() {};
oFF.OuDpTotalsSetPosition.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpTotalsSetPosition.prototype._ff_c = "OuDpTotalsSetPosition";

oFF.OuDpTotalsSetPosition.NAME = "setTotalsPosition";
oFF.OuDpTotalsSetPosition.create = function(actionsBase)
{
	let obj = new oFF.OuDpTotalsSetPosition();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpTotalsSetPosition.prototype.doAction = function(parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let modelLevel = converter.toModelLevel(parameters.get(0));
	let resultAlignment = this.getDataProvider().getCc().getUniqueResultAlignment(modelLevel, parameters.get(2));
	this.getDataProvider().getCc().alignTotalsWithPriority(modelLevel, parameters.get(1), resultAlignment, 0);
	let result = this.newActionResult(parameters);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpTotalsSetPosition.prototype.executeTyped = function(modelLevel, elementName, position)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(converter.fromModelLevel(modelLevel));
	parameters.add(elementName);
	parameters.add(converter.fromResultAlignment(position));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpTotalsSetPosition.prototype.getName = function()
{
	return oFF.OuDpTotalsSetPosition.NAME;
};

oFF.OuDpTotalsSetVisibility = function() {};
oFF.OuDpTotalsSetVisibility.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpTotalsSetVisibility.prototype._ff_c = "OuDpTotalsSetVisibility";

oFF.OuDpTotalsSetVisibility.NAME = "setTotalsVisibility";
oFF.OuDpTotalsSetVisibility.create = function(actionsBase)
{
	let obj = new oFF.OuDpTotalsSetVisibility();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpTotalsSetVisibility.prototype.doAction = function(parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let resultStructureElement = converter.toResultStructureElement(parameters.get(0));
	let modelLevel = converter.toModelLevel(parameters.get(1));
	let resultVisibility = converter.toResultVisibility(parameters.get(3));
	this.getDataProvider().getCc().setTotalsVisibleByElement(modelLevel, parameters.get(2), resultStructureElement, resultVisibility);
	let result = this.newActionResult(parameters);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpTotalsSetVisibility.prototype.executeTyped = function(resultStructureElement, modelLevel, elementName, resultVisibility)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(converter.fromResultStructureElement(resultStructureElement));
	parameters.add(converter.fromModelLevel(modelLevel));
	parameters.add(elementName);
	parameters.add(converter.fromResultVisibility(resultVisibility));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpTotalsSetVisibility.prototype.getName = function()
{
	return oFF.OuDpTotalsSetVisibility.NAME;
};

oFF.OuDpEndVariableChangeAction = function() {};
oFF.OuDpEndVariableChangeAction.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpEndVariableChangeAction.prototype._ff_c = "OuDpEndVariableChangeAction";

oFF.OuDpEndVariableChangeAction.NAME = "endVariableChangeAction";
oFF.OuDpEndVariableChangeAction.create = function(actionsBase)
{
	let obj = new oFF.OuDpEndVariableChangeAction();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpEndVariableChangeAction.prototype.doAction = function(parameters)
{
	let queryManager = this.getDataProvider().getQueryManager();
	if (!queryManager.isSubmitNeeded())
	{
		return oFF.XPromise.resolve(this.newActionResult(parameters));
	}
	return this.getDataProvider().getConnectorBase().processClassicSubmitIfNecessary(null).onThenExt((empty) => {
		let actionResult = this.newActionResult(parameters);
		actionResult.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
		return actionResult;
	});
};
oFF.OuDpEndVariableChangeAction.prototype.executeTyped = function()
{
	return this.getActionsBase().performAction(this, oFF.XList.create());
};
oFF.OuDpEndVariableChangeAction.prototype.getName = function()
{
	return oFF.OuDpEndVariableChangeAction.NAME;
};

oFF.OuDpStartVariableChangeAction = function() {};
oFF.OuDpStartVariableChangeAction.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpStartVariableChangeAction.prototype._ff_c = "OuDpStartVariableChangeAction";

oFF.OuDpStartVariableChangeAction.NAME = "startVariableChangeAction";
oFF.OuDpStartVariableChangeAction.create = function(actionsBase)
{
	let obj = new oFF.OuDpStartVariableChangeAction();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpStartVariableChangeAction.prototype.doAction = function(parameters)
{
	let queryManager = this.getDataProvider().getQueryManager();
	if (!queryManager.isReinitNeeded())
	{
		return oFF.XPromise.resolve(this.newActionResult(parameters));
	}
	return oFF.XPromise.create((resolve, reject) => {
		let syncType = queryManager.getSession().getDefaultSyncType();
		queryManager.reInitVariablesAfterSubmit(syncType, oFF.VariableProcessorCallbackLambda.createSingleUse((result) => {
			if (result.hasErrors())
			{
				reject(oFF.MessageUtil.condenseMessagesToSingleError(result));
			}
			else
			{
				resolve(this.newActionResult(parameters));
			}
		}), null);
	});
};
oFF.OuDpStartVariableChangeAction.prototype.executeTyped = function()
{
	return this.getActionsBase().performAction(this, oFF.XList.create());
};
oFF.OuDpStartVariableChangeAction.prototype.getName = function()
{
	return oFF.OuDpStartVariableChangeAction.NAME;
};

oFF.OuDpVizActionCreateVizDefinition = function() {};
oFF.OuDpVizActionCreateVizDefinition.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpVizActionCreateVizDefinition.prototype._ff_c = "OuDpVizActionCreateVizDefinition";

oFF.OuDpVizActionCreateVizDefinition.NAME = "createVisualizationDefinition";
oFF.OuDpVizActionCreateVizDefinition.create = function(actionsBase)
{
	let obj = new oFF.OuDpVizActionCreateVizDefinition();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpVizActionCreateVizDefinition.prototype.doAction = function(parameters)
{
	let dataProvider = this.getDataProvider();
	let vizDef = oFF.OuDpVizActionVizDefinition.createDefinitionFromParameterList(dataProvider, parameters);
	let queryManager = dataProvider.getQueryManager();
	let result = this.newActionResult(parameters);
	if (oFF.isNull(queryManager))
	{
		let connection = dataProvider.getConnection();
		let newViz = vizDef.convertToStructure();
		connection.getVisualizations().add(newViz);
		return oFF.XPromise.resolve(result);
	}
	let vizManager = queryManager.getQueryModel().getVisualizationManager();
	let definition = vizDef.convertToFireflyDefinition(vizManager);
	result.setReturnValue(definition);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.VISUALIZATION_CHANGE);
	result.getChangesBase().addChangedVisualizationName(vizDef.getVizName());
	return oFF.XPromise.resolve(result);
};
oFF.OuDpVizActionCreateVizDefinition.prototype.executeTyped = function(vizName, vizType, protocolType, chartType)
{
	let definition = oFF.OuDpVizActionVizDefinition.createDefinition(vizName, vizType, protocolType, chartType);
	return this.getActionsBase().performAction(this, definition.convertToParameterList(this.getDataProvider()));
};
oFF.OuDpVizActionCreateVizDefinition.prototype.getName = function()
{
	return oFF.OuDpVizActionCreateVizDefinition.NAME;
};
oFF.OuDpVizActionCreateVizDefinition.prototype.isQueryManagerNeeded = function()
{
	return false;
};

oFF.OuDpVizActionGetActiveVizDefinition = function() {};
oFF.OuDpVizActionGetActiveVizDefinition.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpVizActionGetActiveVizDefinition.prototype._ff_c = "OuDpVizActionGetActiveVizDefinition";

oFF.OuDpVizActionGetActiveVizDefinition.NAME = "getActiveVisualizationDefinition";
oFF.OuDpVizActionGetActiveVizDefinition.create = function(actionsBase)
{
	let obj = new oFF.OuDpVizActionGetActiveVizDefinition();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpVizActionGetActiveVizDefinition.prototype.doAction = function(parameters)
{
	let queryManager = this.getDataProvider().getQueryManager();
	let vizManager = queryManager.getQueryModel().getVisualizationManager();
	return oFF.XPromise.create((resolve, reject) => {
		let definition = vizManager.getCurrentActiveVisualizationDefinition();
		if (oFF.isNull(definition))
		{
			reject(oFF.XError.create("No active visualization definition found"));
		}
		else
		{
			let result = this.newActionResult(parameters);
			result.setReturnValue(definition);
			resolve(result);
		}
	});
};
oFF.OuDpVizActionGetActiveVizDefinition.prototype.getName = function()
{
	return oFF.OuDpVizActionGetActiveVizDefinition.NAME;
};

oFF.OuDpVizActionGetAllVisualizationNames = function() {};
oFF.OuDpVizActionGetAllVisualizationNames.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpVizActionGetAllVisualizationNames.prototype._ff_c = "OuDpVizActionGetAllVisualizationNames";

oFF.OuDpVizActionGetAllVisualizationNames.NAME = "getAllVisualizationNames";
oFF.OuDpVizActionGetAllVisualizationNames.create = function(actionsBase)
{
	let obj = new oFF.OuDpVizActionGetAllVisualizationNames();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpVizActionGetAllVisualizationNames.prototype.doAction = function(parameters)
{
	let values = oFF.XList.create();
	let vizManager = this.getDataProvider().getQueryManager().getQueryModel().getVisualizationManager();
	let vizDefinitions = vizManager.getVisualizationDefinitions();
	for (let index = 0; index < vizDefinitions.size(); index++)
	{
		values.add(vizDefinitions.get(index).getName());
	}
	let result = this.newActionResult(parameters);
	result.setReturnValue(values);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpVizActionGetAllVisualizationNames.prototype.getName = function()
{
	return oFF.OuDpVizActionGetAllVisualizationNames.NAME;
};

oFF.OuDpVizActionGetAllVisualizations = function() {};
oFF.OuDpVizActionGetAllVisualizations.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpVizActionGetAllVisualizations.prototype._ff_c = "OuDpVizActionGetAllVisualizations";

oFF.OuDpVizActionGetAllVisualizations.NAME = "getAllVisualizations";
oFF.OuDpVizActionGetAllVisualizations.create = function(actionsBase)
{
	let obj = new oFF.OuDpVizActionGetAllVisualizations();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpVizActionGetAllVisualizations.prototype.doAction = function(parameters)
{
	let vizManager = this.getDataProvider().getQueryManager().getQueryModel().getVisualizationManager();
	let vizDefinitions = vizManager.getVisualizationDefinitions();
	let result = this.newActionResult(parameters);
	result.setReturnValue(vizDefinitions);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpVizActionGetAllVisualizations.prototype.getName = function()
{
	return oFF.OuDpVizActionGetAllVisualizations.NAME;
};

oFF.OuDpVizActionGetOrCreateVizDefinition = function() {};
oFF.OuDpVizActionGetOrCreateVizDefinition.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpVizActionGetOrCreateVizDefinition.prototype._ff_c = "OuDpVizActionGetOrCreateVizDefinition";

oFF.OuDpVizActionGetOrCreateVizDefinition.NAME = "getOrCreateVisualizationDefinition";
oFF.OuDpVizActionGetOrCreateVizDefinition.create = function(actionsBase)
{
	let obj = new oFF.OuDpVizActionGetOrCreateVizDefinition();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpVizActionGetOrCreateVizDefinition.prototype._isVizDefinitionUnique = function(definition, protocolBindingType, vizType)
{
	return oFF.notNull(definition) && definition.getProtocolBindingType() === protocolBindingType && definition.getSemanticBindingType() === vizType.getSemanticBindingType();
};
oFF.OuDpVizActionGetOrCreateVizDefinition.prototype.doAction = function(parameters)
{
	let vizDef = oFF.OuDpVizActionVizDefinition.createDefinitionFromParameterList(this.getDataProvider(), parameters);
	let queryManager = this.getDataProvider().getQueryManager();
	let vizManager = queryManager.getQueryModel().getVisualizationManager();
	let result = this.newActionResult(parameters);
	let definition = vizManager.getVisualizationDefinitionByName(vizDef.getVizName());
	if (oFF.notNull(definition))
	{
		if (!this._isVizDefinitionUnique(definition, vizDef.getProtocolType(), vizDef.getVizType()))
		{
			return oFF.XPromise.reject(oFF.XError.create("Visualization name already exists for a different type."));
		}
		result.setReturnValue(definition);
		return oFF.XPromise.resolve(result);
	}
	definition = vizDef.convertToFireflyDefinition(vizManager);
	result.setReturnValue(definition);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.VISUALIZATION_CHANGE);
	result.getChangesBase().addChangedVisualizationName(vizDef.getVizName());
	return oFF.XPromise.resolve(result);
};
oFF.OuDpVizActionGetOrCreateVizDefinition.prototype.executeTyped = function(vizName, vizType, protocolType, chartType)
{
	let definition = oFF.OuDpVizActionVizDefinition.createDefinition(vizName, vizType, protocolType, chartType);
	return this.getActionsBase().performAction(this, definition.convertToParameterList(this.getDataProvider()));
};
oFF.OuDpVizActionGetOrCreateVizDefinition.prototype.getName = function()
{
	return oFF.OuDpVizActionGetOrCreateVizDefinition.NAME;
};

oFF.OuDpVizActionGetVisualizationChartType = function() {};
oFF.OuDpVizActionGetVisualizationChartType.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpVizActionGetVisualizationChartType.prototype._ff_c = "OuDpVizActionGetVisualizationChartType";

oFF.OuDpVizActionGetVisualizationChartType.NAME = "getVisualizationChartType";
oFF.OuDpVizActionGetVisualizationChartType.create = function(actionsBase)
{
	let obj = new oFF.OuDpVizActionGetVisualizationChartType();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpVizActionGetVisualizationChartType.prototype.doAction = function(parameters)
{
	return oFF.XPromise.create((resolve, reject) => {
		let vizName = parameters.get(0);
		let queryManager = this.getDataProvider().getQueryManager();
		let vizManager = queryManager.getQueryModel().getVisualizationManager();
		let definition = vizManager.getVisualizationDefinitionByName(vizName);
		if (oFF.notNull(definition))
		{
			if (definition.getProtocolBindingType() === oFF.ProtocolBindingType.HIGH_CHART_PROTOCOL && definition.getSemanticBindingType() === oFF.SemanticBindingType.CHART)
			{
				let chartType = definition.getChartSetting().getChartType();
				let result = this.newActionResult(parameters);
				result.setReturnValue(chartType);
				resolve(result);
				return;
			}
		}
		reject(oFF.XError.create("No support for charts in visualization definition."));
	});
};
oFF.OuDpVizActionGetVisualizationChartType.prototype.executeTyped = function(vizName)
{
	let parameters = oFF.XList.create();
	parameters.add(vizName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpVizActionGetVisualizationChartType.prototype.getName = function()
{
	return oFF.OuDpVizActionGetVisualizationChartType.NAME;
};

oFF.OuDpVizActionRemoveVizDefinition = function() {};
oFF.OuDpVizActionRemoveVizDefinition.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpVizActionRemoveVizDefinition.prototype._ff_c = "OuDpVizActionRemoveVizDefinition";

oFF.OuDpVizActionRemoveVizDefinition.NAME = "removeVisualizationDefinition";
oFF.OuDpVizActionRemoveVizDefinition.create = function(actionsBase)
{
	let obj = new oFF.OuDpVizActionRemoveVizDefinition();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpVizActionRemoveVizDefinition.prototype.doAction = function(parameters)
{
	let vizName = parameters.get(0);
	let queryManager = this.getDataProvider().getQueryManager();
	let vizManager = queryManager.getQueryModel().getVisualizationManager();
	let result = this.newActionResult(parameters);
	if (vizManager.getVisualizationDefinitionByName(vizName) === null)
	{
		return oFF.XPromise.resolve(result);
	}
	vizManager.removeVisualizationDefinitionByName(vizName);
	result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.VISUALIZATION_CHANGE);
	result.getChangesBase().addChangedVisualizationName(vizName);
	return oFF.XPromise.resolve(result);
};
oFF.OuDpVizActionRemoveVizDefinition.prototype.executeTyped = function(vizName)
{
	return this.getActionsBase().performAction(this, oFF.XCollectionUtils.singletonList(vizName));
};
oFF.OuDpVizActionRemoveVizDefinition.prototype.getName = function()
{
	return oFF.OuDpVizActionRemoveVizDefinition.NAME;
};

oFF.OuDpVizActionSetActiveVizDefinition = function() {};
oFF.OuDpVizActionSetActiveVizDefinition.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpVizActionSetActiveVizDefinition.prototype._ff_c = "OuDpVizActionSetActiveVizDefinition";

oFF.OuDpVizActionSetActiveVizDefinition.NAME = "setActiveVisualizationDefinition";
oFF.OuDpVizActionSetActiveVizDefinition.create = function(actionsBase)
{
	let obj = new oFF.OuDpVizActionSetActiveVizDefinition();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpVizActionSetActiveVizDefinition.prototype.doAction = function(parameters)
{
	let vizName = parameters.get(0);
	let queryManager = this.getDataProvider().getQueryManager();
	let vizManager = queryManager.getQueryModel().getVisualizationManager();
	return oFF.XPromise.create((resolve, reject) => {
		let result = this.newActionResult(parameters);
		let currentActive = vizManager.getCurrentActiveVisualizationDefinition();
		if (oFF.XString.isEqual(currentActive.getName(), vizName))
		{
			resolve(result);
			return;
		}
		let definition = vizManager.getVisualizationDefinitionByName(vizName);
		if (oFF.isNull(definition))
		{
			reject(oFF.XError.create("No visualization definition found"));
			return;
		}
		vizManager.setCurrentActiveVisualizationDefinition(definition);
		result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
		result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.VISUALIZATION_CHANGE);
		result.getChangesBase().addChangedVisualizationName(vizName);
		resolve(result);
	});
};
oFF.OuDpVizActionSetActiveVizDefinition.prototype.executeTyped = function(vizName)
{
	let parameters = oFF.XList.create();
	parameters.add(vizName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpVizActionSetActiveVizDefinition.prototype.getName = function()
{
	return oFF.OuDpVizActionSetActiveVizDefinition.NAME;
};

oFF.OuDpVizActionSetVisualizationChartType = function() {};
oFF.OuDpVizActionSetVisualizationChartType.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpVizActionSetVisualizationChartType.prototype._ff_c = "OuDpVizActionSetVisualizationChartType";

oFF.OuDpVizActionSetVisualizationChartType.NAME = "setVisualizationChartType";
oFF.OuDpVizActionSetVisualizationChartType.create = function(actionsBase)
{
	let obj = new oFF.OuDpVizActionSetVisualizationChartType();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpVizActionSetVisualizationChartType.prototype.doAction = function(parameters)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let vizName = parameters.get(0);
	let chartType = converter.toChartType(parameters.get(1));
	let queryManager = this.getDataProvider().getQueryManager();
	let vizManager = queryManager.getQueryModel().getVisualizationManager();
	return oFF.XPromise.create((resolve, reject) => {
		let result = this.newActionResult(parameters);
		let definition = vizManager.getVisualizationDefinitionByName(vizName);
		if (oFF.notNull(definition))
		{
			if (definition.getSemanticBindingType() === oFF.SemanticBindingType.CHART)
			{
				if (oFF.isNull(chartType))
				{
					reject(oFF.XError.create("No chart type provided."));
					return;
				}
				let chartDefinition = definition;
				chartDefinition.getChartSetting().setChartType(chartType);
				result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.VISUALIZATION_CHANGE);
				result.getChangesBase().addChangedVisualizationName(vizName);
				resolve(result);
			}
			else
			{
				reject(oFF.XError.create("Visualization definition does not support charts."));
			}
		}
		else
		{
			reject(oFF.XError.create(oFF.XStringUtils.concatenate3("No visualization with name '", vizName, "' found. ")));
		}
	});
};
oFF.OuDpVizActionSetVisualizationChartType.prototype.executeTyped = function(vizName, chartType)
{
	let converter = oFF.OdpActionParameterConverter.create(this.getDataProvider());
	let parameters = oFF.XList.create();
	parameters.add(vizName);
	parameters.add(converter.fromChartType(chartType));
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpVizActionSetVisualizationChartType.prototype.getName = function()
{
	return oFF.OuDpVizActionSetVisualizationChartType.NAME;
};

oFF.OuDpVizActionSynchronizeVizDefinition = function() {};
oFF.OuDpVizActionSynchronizeVizDefinition.prototype = new oFF.DfOuDataProviderAction();
oFF.OuDpVizActionSynchronizeVizDefinition.prototype._ff_c = "OuDpVizActionSynchronizeVizDefinition";

oFF.OuDpVizActionSynchronizeVizDefinition.NAME = "synchronizeVisualizationDefinition";
oFF.OuDpVizActionSynchronizeVizDefinition.create = function(actionsBase)
{
	let obj = new oFF.OuDpVizActionSynchronizeVizDefinition();
	obj.setupAction(actionsBase);
	return obj;
};
oFF.OuDpVizActionSynchronizeVizDefinition.prototype.doAction = function(parameters)
{
	let vizName = parameters.get(0);
	let queryManager = this.getDataProvider().getQueryManager();
	let vizManager = queryManager.getQueryModel().getVisualizationManager();
	return oFF.XPromise.create((resolve, reject) => {
		let result = this.newActionResult(parameters);
		let definition = vizManager.getVisualizationDefinitionByName(vizName);
		if (oFF.isNull(definition))
		{
			definition = vizManager.getCurrentActiveVisualizationDefinition();
		}
		if (oFF.isNull(definition))
		{
			reject(oFF.XError.create("No visualization definition found"));
			return;
		}
		if (definition.getSemanticBindingType() === oFF.SemanticBindingType.CHART)
		{
			definition.getChartSetting().synchronizeChartSetting();
			result.getChangesBase().addChangedEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
		}
		resolve(result);
	});
};
oFF.OuDpVizActionSynchronizeVizDefinition.prototype.executeTyped = function(vizName)
{
	let parameters = oFF.XList.create();
	parameters.add(vizName);
	return this.getActionsBase().performAction(this, parameters);
};
oFF.OuDpVizActionSynchronizeVizDefinition.prototype.getName = function()
{
	return oFF.OuDpVizActionSynchronizeVizDefinition.NAME;
};

oFF.OuDataProviderConfiguration = function() {};
oFF.OuDataProviderConfiguration.prototype = new oFF.XObject();
oFF.OuDataProviderConfiguration.prototype._ff_c = "OuDataProviderConfiguration";

oFF.OuDataProviderConfiguration.AUTO_SUBMIT_ENABLED = "autoSubmitEnabled";
oFF.OuDataProviderConfiguration.CONFIG_ADD_TO_DATA_PROVIDER_POOL = "addToDataProviderPool";
oFF.OuDataProviderConfiguration.CONFIG_DATA_PROVIDER_NAME = "dataProviderName";
oFF.OuDataProviderConfiguration.CONFIG_DATA_READ_ONLY = "dataReadOnly";
oFF.OuDataProviderConfiguration.CONFIG_DEFAULT_WAIT_TIMEOUT = "defaultWaitTimeout";
oFF.OuDataProviderConfiguration.CONFIG_EVENT_BUFFER_TIMEOUT = "eventBufferTimeout";
oFF.OuDataProviderConfiguration.CONFIG_FORCE_LOGGING_ENABLED = "forceLoggingEnabled";
oFF.OuDataProviderConfiguration.CONFIG_LOAD_ACTION_MANIFESTS = "loadActionManifests";
oFF.OuDataProviderConfiguration.CONFIG_METADATA_CACHE_ENABLED = "metadataCacheEnabled";
oFF.OuDataProviderConfiguration.CONFIG_REPO_DELTA_FORMAT_ENABLED = "repoDeltaFormatEnabled";
oFF.OuDataProviderConfiguration.CONFIG_START_AS_CONNECTED = "startAsConnected";
oFF.OuDataProviderConfiguration.CONFIG_START_WITH_DEFAULT_HOOKS_ENABLED = "startWithDefaultHooksEnabled";
oFF.OuDataProviderConfiguration.CONNECTION = "connection";
oFF.OuDataProviderConfiguration.VIZ_ACTIVE = "active";
oFF.OuDataProviderConfiguration.VIZ_CHART_TYPE = "chartType";
oFF.OuDataProviderConfiguration.VIZ_NAME = "name";
oFF.OuDataProviderConfiguration.VIZ_PROTOCOL = "protocol";
oFF.OuDataProviderConfiguration.VIZ_TYPE = "type";
oFF.OuDataProviderConfiguration.createConfig = function(application, dataSource)
{
	let obj = new oFF.OuDataProviderConfiguration();
	obj.setupConfig(application, dataSource);
	return obj;
};
oFF.OuDataProviderConfiguration.createConfigForEmptyDataProvider = function(application)
{
	let obj = new oFF.OuDataProviderConfiguration();
	obj.setupConfig(application, null);
	return obj;
};
oFF.OuDataProviderConfiguration.createConfigFromJson = function(application, configJson)
{
	let obj = new oFF.OuDataProviderConfiguration();
	obj.setupConfig(application, null);
	obj.setupWithStructure(configJson);
	return obj;
};
oFF.OuDataProviderConfiguration.prototype.m_application = null;
oFF.OuDataProviderConfiguration.prototype.m_configJson = null;
oFF.OuDataProviderConfiguration.prototype.m_connectionConfig = null;
oFF.OuDataProviderConfiguration.prototype.m_hooks = null;
oFF.OuDataProviderConfiguration.prototype.getApplication = function()
{
	return this.m_application;
};
oFF.OuDataProviderConfiguration.prototype.getDataProviderName = function()
{
	return this.m_configJson.getStringByKey(oFF.OuDataProviderConfiguration.CONFIG_DATA_PROVIDER_NAME);
};
oFF.OuDataProviderConfiguration.prototype.getDefaultWaitTimeout = function()
{
	return this.m_configJson.getIntegerByKey(oFF.OuDataProviderConfiguration.CONFIG_DEFAULT_WAIT_TIMEOUT);
};
oFF.OuDataProviderConfiguration.prototype.getEventBufferTimeout = function()
{
	return this.m_configJson.getIntegerByKey(oFF.OuDataProviderConfiguration.CONFIG_EVENT_BUFFER_TIMEOUT);
};
oFF.OuDataProviderConfiguration.prototype.getHooks = function()
{
	return this.m_hooks;
};
oFF.OuDataProviderConfiguration.prototype.getStartConnection = function()
{
	return this.m_connectionConfig;
};
oFF.OuDataProviderConfiguration.prototype.isAutoSubmitEnabled = function()
{
	return this.m_configJson.getBooleanByKey(oFF.OuDataProviderConfiguration.AUTO_SUBMIT_ENABLED);
};
oFF.OuDataProviderConfiguration.prototype.isDataReadOnly = function()
{
	return this.m_configJson.getBooleanByKey(oFF.OuDataProviderConfiguration.CONFIG_DATA_READ_ONLY);
};
oFF.OuDataProviderConfiguration.prototype.isForceLoggingEnabled = function()
{
	return this.m_configJson.getBooleanByKey(oFF.OuDataProviderConfiguration.CONFIG_FORCE_LOGGING_ENABLED);
};
oFF.OuDataProviderConfiguration.prototype.isLoadingActionManifests = function()
{
	return this.m_configJson.getBooleanByKey(oFF.OuDataProviderConfiguration.CONFIG_LOAD_ACTION_MANIFESTS);
};
oFF.OuDataProviderConfiguration.prototype.isMetadataCacheEnabled = function()
{
	return this.m_configJson.getBooleanByKey(oFF.OuDataProviderConfiguration.CONFIG_METADATA_CACHE_ENABLED);
};
oFF.OuDataProviderConfiguration.prototype.isRepoDeltaEnabled = function()
{
	return this.m_configJson.getBooleanByKey(oFF.OuDataProviderConfiguration.CONFIG_REPO_DELTA_FORMAT_ENABLED);
};
oFF.OuDataProviderConfiguration.prototype.isStartAsConnected = function()
{
	return this.m_configJson.getBooleanByKey(oFF.OuDataProviderConfiguration.CONFIG_START_AS_CONNECTED);
};
oFF.OuDataProviderConfiguration.prototype.isStartWithAutoFetch = function()
{
	return this.m_connectionConfig.isStartWithAutoFetch();
};
oFF.OuDataProviderConfiguration.prototype.releaseObject = function()
{
	this.m_application = null;
	this.m_configJson = oFF.XObjectExt.release(this.m_configJson);
	this.m_connectionConfig = oFF.XObjectExt.release(this.m_connectionConfig);
	this.m_hooks = oFF.XObjectExt.release(this.m_hooks);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuDataProviderConfiguration.prototype.serializeJson = function()
{
	return oFF.PrUtils.deepCopyElement(this.m_configJson).asStructure();
};
oFF.OuDataProviderConfiguration.prototype.setApplication = function(application)
{
	this.m_application = application;
};
oFF.OuDataProviderConfiguration.prototype.setAutoSubmitEnabled = function(autoSubmitEnabled)
{
	this.m_configJson.putBoolean(oFF.OuDataProviderConfiguration.AUTO_SUBMIT_ENABLED, autoSubmitEnabled);
};
oFF.OuDataProviderConfiguration.prototype.setDataProviderName = function(dataProviderName)
{
	this.m_configJson.putString(oFF.OuDataProviderConfiguration.CONFIG_DATA_PROVIDER_NAME, dataProviderName);
};
oFF.OuDataProviderConfiguration.prototype.setDataReadOnly = function(dataReadOnly)
{
	this.m_configJson.putBoolean(oFF.OuDataProviderConfiguration.CONFIG_DATA_READ_ONLY, dataReadOnly);
};
oFF.OuDataProviderConfiguration.prototype.setDefaultWaitTimeout = function(defaultWaitTimeout)
{
	this.m_configJson.putInteger(oFF.OuDataProviderConfiguration.CONFIG_DEFAULT_WAIT_TIMEOUT, defaultWaitTimeout);
};
oFF.OuDataProviderConfiguration.prototype.setEventBufferTimeout = function(eventBufferTimeout)
{
	this.m_configJson.putInteger(oFF.OuDataProviderConfiguration.CONFIG_EVENT_BUFFER_TIMEOUT, eventBufferTimeout);
};
oFF.OuDataProviderConfiguration.prototype.setForceLoggingEnabled = function(forceLoggingEnabled)
{
	this.m_configJson.putBoolean(oFF.OuDataProviderConfiguration.CONFIG_FORCE_LOGGING_ENABLED, forceLoggingEnabled);
};
oFF.OuDataProviderConfiguration.prototype.setLoadingActionManifests = function(loadingActionManifests)
{
	this.m_configJson.putBoolean(oFF.OuDataProviderConfiguration.CONFIG_LOAD_ACTION_MANIFESTS, loadingActionManifests);
};
oFF.OuDataProviderConfiguration.prototype.setMetadataCacheEnabled = function(metadataCacheEnabled)
{
	this.m_configJson.putBoolean(oFF.OuDataProviderConfiguration.CONFIG_METADATA_CACHE_ENABLED, metadataCacheEnabled);
};
oFF.OuDataProviderConfiguration.prototype.setRepoDeltaEnabled = function(repoDeltaEnabled)
{
	this.m_configJson.putBoolean(oFF.OuDataProviderConfiguration.CONFIG_REPO_DELTA_FORMAT_ENABLED, repoDeltaEnabled);
};
oFF.OuDataProviderConfiguration.prototype.setShouldAddToDataProviderPool = function(addedToDataProviderPool)
{
	this.m_configJson.putBoolean(oFF.OuDataProviderConfiguration.CONFIG_ADD_TO_DATA_PROVIDER_POOL, addedToDataProviderPool);
};
oFF.OuDataProviderConfiguration.prototype.setShouldStartWithDefaultHooks = function(startWithDefaultHooks)
{
	this.m_configJson.putBoolean(oFF.OuDataProviderConfiguration.CONFIG_START_WITH_DEFAULT_HOOKS_ENABLED, startWithDefaultHooks);
};
oFF.OuDataProviderConfiguration.prototype.setStartAsConnected = function(startAsConnected)
{
	this.m_configJson.putBoolean(oFF.OuDataProviderConfiguration.CONFIG_START_AS_CONNECTED, startAsConnected);
};
oFF.OuDataProviderConfiguration.prototype.setStartConnection = function(connectionConfig)
{
	this.m_connectionConfig = connectionConfig;
};
oFF.OuDataProviderConfiguration.prototype.setStartWithAutoFetch = function(startWithAutoFetch)
{
	this.m_connectionConfig.setStartWithAutoFetch(startWithAutoFetch);
};
oFF.OuDataProviderConfiguration.prototype.setupConfig = function(application, dataSource)
{
	this.setup();
	this.m_application = application;
	this.m_configJson = oFF.PrFactory.createStructure();
	this.m_connectionConfig = oFF.OuDataProviderConnection.createConnection(application);
	this.m_connectionConfig.setDataSource(dataSource);
	this.m_hooks = oFF.OuDataProviderHooks.createHooks();
	this.setupDefaults();
};
oFF.OuDataProviderConfiguration.prototype.setupDefaults = function()
{
	this.setDataReadOnly(true);
	this.setAutoSubmitEnabled(true);
	this.setStartAsConnected(true);
	this.setEventBufferTimeout(12);
	this.setDefaultWaitTimeout(10);
	this.setShouldAddToDataProviderPool(true);
	this.setShouldStartWithDefaultHooks(true);
};
oFF.OuDataProviderConfiguration.prototype.setupWithStructure = function(configJson)
{
	this.m_configJson.putAll(configJson);
	let connectionStruct = this.m_configJson.getStructureByKey(oFF.OuDataProviderConfiguration.CONNECTION);
	if (oFF.notNull(connectionStruct))
	{
		this.m_connectionConfig.deserializeJson(connectionStruct);
	}
	else
	{
		this.m_connectionConfig.deserializeJson(configJson);
	}
};
oFF.OuDataProviderConfiguration.prototype.shouldAddToDataProviderPool = function()
{
	return this.m_configJson.getBooleanByKey(oFF.OuDataProviderConfiguration.CONFIG_ADD_TO_DATA_PROVIDER_POOL);
};
oFF.OuDataProviderConfiguration.prototype.shouldStartWithDefaultHooks = function()
{
	return this.m_configJson.getBooleanByKey(oFF.OuDataProviderConfiguration.CONFIG_START_WITH_DEFAULT_HOOKS_ENABLED);
};
oFF.OuDataProviderConfiguration.prototype.toString = function()
{
	if (oFF.isNull(this.m_configJson))
	{
		return "null";
	}
	return this.getDataProviderName();
};

oFF.OuDataProviderEventEmitter = function() {};
oFF.OuDataProviderEventEmitter.prototype = new oFF.XObject();
oFF.OuDataProviderEventEmitter.prototype._ff_c = "OuDataProviderEventEmitter";

oFF.OuDataProviderEventEmitter.createEmitter = function(dataProvider, baseEvent)
{
	let obj = new oFF.OuDataProviderEventEmitter();
	obj.setupEmitter(dataProvider, baseEvent);
	return obj;
};
oFF.OuDataProviderEventEmitter.prototype.m_dataProvider = null;
oFF.OuDataProviderEventEmitter.prototype.m_eventTemplate = null;
oFF.OuDataProviderEventEmitter.prototype.m_external = false;
oFF.OuDataProviderEventEmitter.prototype.getDataProvider = function()
{
	return this.m_dataProvider;
};
oFF.OuDataProviderEventEmitter.prototype.getEventType = function()
{
	return this.m_eventTemplate.getEventType();
};
oFF.OuDataProviderEventEmitter.prototype.getEventing = function()
{
	return this.m_dataProvider.getEventingBase();
};
oFF.OuDataProviderEventEmitter.prototype.getListener = function()
{
	return this.m_dataProvider.getEventingBase().getListenerForEventType(this.getEventType());
};
oFF.OuDataProviderEventEmitter.prototype.getName = function()
{
	return this.getEventType().getName();
};
oFF.OuDataProviderEventEmitter.prototype.isExternalEmitter = function()
{
	return this.m_external;
};
oFF.OuDataProviderEventEmitter.prototype.newTypedEvent = function()
{
	let eventClass = oFF.XClass.createByInstance(this.m_eventTemplate);
	let eventBase = eventClass.newInstance(this.m_dataProvider);
	eventBase.setupDataProviderEvent(this.m_dataProvider, this);
	eventBase.setExternalChanges(this.m_external);
	return eventBase;
};
oFF.OuDataProviderEventEmitter.prototype.releaseObject = function()
{
	this.m_dataProvider = null;
	this.m_eventTemplate = oFF.XObjectExt.release(this.m_eventTemplate);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuDataProviderEventEmitter.prototype.setExternalEmitter = function(external)
{
	this.m_external = external;
};
oFF.OuDataProviderEventEmitter.prototype.setupEmitter = function(dataProvider, baseEvent)
{
	this.m_dataProvider = dataProvider;
	this.m_eventTemplate = baseEvent;
};

oFF.OuDataProviderActionChanges = function() {};
oFF.OuDataProviderActionChanges.prototype = new oFF.XObject();
oFF.OuDataProviderActionChanges.prototype._ff_c = "OuDataProviderActionChanges";

oFF.OuDataProviderActionChanges.create = function()
{
	let obj = new oFF.OuDataProviderActionChanges();
	obj.setupExt();
	return obj;
};
oFF.OuDataProviderActionChanges.prototype.m_changedComponentTypes = null;
oFF.OuDataProviderActionChanges.prototype.m_changedEventTypes = null;
oFF.OuDataProviderActionChanges.prototype.m_changedVisualizationNames = null;
oFF.OuDataProviderActionChanges.prototype.m_correlationId = null;
oFF.OuDataProviderActionChanges.prototype.m_external = false;
oFF.OuDataProviderActionChanges.prototype.addChangedEventType = function(eventType)
{
	this.m_changedEventTypes.add(eventType);
};
oFF.OuDataProviderActionChanges.prototype.addChangedOlapComponentTypes = function(olapComponentType)
{
	this.m_changedComponentTypes.add(olapComponentType);
};
oFF.OuDataProviderActionChanges.prototype.addChangedVisualizationName = function(name)
{
	this.m_changedVisualizationNames.add(name);
};
oFF.OuDataProviderActionChanges.prototype.getChangedComponentTypes = function()
{
	return this.m_changedComponentTypes;
};
oFF.OuDataProviderActionChanges.prototype.getChangedEventTypes = function()
{
	return this.m_changedEventTypes;
};
oFF.OuDataProviderActionChanges.prototype.getChangedVisualizationNames = function()
{
	return this.m_changedVisualizationNames;
};
oFF.OuDataProviderActionChanges.prototype.getCorrelationId = function()
{
	return this.m_correlationId;
};
oFF.OuDataProviderActionChanges.prototype.isExternal = function()
{
	return this.m_external;
};
oFF.OuDataProviderActionChanges.prototype.mergeChanges = function(otherChanges)
{
	this.m_external = this.m_external || otherChanges.isExternal();
	this.m_changedEventTypes.addAll(otherChanges.getChangedEventTypes());
	this.m_changedVisualizationNames.addAll(otherChanges.getChangedVisualizationNames());
};
oFF.OuDataProviderActionChanges.prototype.releaseObject = function()
{
	this.m_changedEventTypes = oFF.XObjectExt.release(this.m_changedEventTypes);
	this.m_changedVisualizationNames = oFF.XObjectExt.release(this.m_changedVisualizationNames);
	this.m_changedComponentTypes = oFF.XObjectExt.release(this.m_changedComponentTypes);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuDataProviderActionChanges.prototype.setCorrelationId = function(correlationId)
{
	this.m_correlationId = correlationId;
};
oFF.OuDataProviderActionChanges.prototype.setExternal = function(external)
{
	this.m_external = external;
};
oFF.OuDataProviderActionChanges.prototype.setupExt = function()
{
	this.m_changedEventTypes = oFF.XSetOfNameObject.create();
	this.m_changedVisualizationNames = oFF.XHashSetOfString.create();
	this.m_changedComponentTypes = oFF.XSetOfNameObject.create();
};

oFF.DfOuDataProviderEvent = function() {};
oFF.DfOuDataProviderEvent.prototype = new oFF.XObject();
oFF.DfOuDataProviderEvent.prototype._ff_c = "DfOuDataProviderEvent";

oFF.DfOuDataProviderEvent.prototype.m_correlationId = null;
oFF.DfOuDataProviderEvent.prototype.m_dataProvider = null;
oFF.DfOuDataProviderEvent.prototype.m_emitter = null;
oFF.DfOuDataProviderEvent.prototype.m_externalChanges = false;
oFF.DfOuDataProviderEvent.prototype.canMerge = function()
{
	return true;
};
oFF.DfOuDataProviderEvent.prototype.getCorrelationId = function()
{
	return this.m_correlationId;
};
oFF.DfOuDataProviderEvent.prototype.getDataProvider = function()
{
	return this.m_dataProvider;
};
oFF.DfOuDataProviderEvent.prototype.getEmitterBase = function()
{
	return this.m_emitter;
};
oFF.DfOuDataProviderEvent.prototype.isBuffered = function()
{
	return true;
};
oFF.DfOuDataProviderEvent.prototype.isExternal = function()
{
	return this.m_externalChanges;
};
oFF.DfOuDataProviderEvent.prototype.merge = function(otherEvent)
{
	this.m_externalChanges = otherEvent.isExternal();
	this.mergeInternal(otherEvent);
};
oFF.DfOuDataProviderEvent.prototype.queue = function()
{
	this.m_dataProvider.getEventing().queueEvent(this);
};
oFF.DfOuDataProviderEvent.prototype.releaseObject = function()
{
	this.m_dataProvider = null;
	this.m_emitter = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.DfOuDataProviderEvent.prototype.send = function()
{
	this.queue();
};
oFF.DfOuDataProviderEvent.prototype.setCorrelationId = function(correlationId)
{
	this.m_correlationId = correlationId;
};
oFF.DfOuDataProviderEvent.prototype.setExternalChanges = function(externalChanges)
{
	this.m_externalChanges = externalChanges;
};
oFF.DfOuDataProviderEvent.prototype.setupDataProviderEvent = function(dataProvider, emitter)
{
	this.m_dataProvider = dataProvider;
	this.m_emitter = emitter;
	this.setupDataProviderEventExt();
};
oFF.DfOuDataProviderEvent.prototype.toString = function()
{
	return this.getEventType().getName();
};

oFF.OuDataProviderActionCall = function() {};
oFF.OuDataProviderActionCall.prototype = new oFF.OuDataProviderActionSequence();
oFF.OuDataProviderActionCall.prototype._ff_c = "OuDataProviderActionCall";

oFF.OuDataProviderActionCall.createActionCall = function(context, f)
{
	let obj = new oFF.OuDataProviderActionCall();
	obj.m_context = context;
	obj.m_function = f;
	return obj;
};
oFF.OuDataProviderActionCall.prototype.m_context = null;
oFF.OuDataProviderActionCall.prototype.m_function = null;
oFF.OuDataProviderActionCall.prototype.execute = function(context)
{
	if (!context.getActions().containsKey(this.m_context))
	{
		return oFF.XPromise.reject(oFF.XError.create(oFF.XStringUtils.concatenate3("Unknown Context '", this.m_context, "'")));
	}
	return this.evalParameters(context, oFF.XList.create(), 0).onThenPromise((params) => {
		return context.getActions().getByKey(this.m_context).executeActionByName(this.m_function, params).onThenExt((res) => {
			let sres = oFF.notNull(res) ? res.toString() : "";
			context.pushResult(sres);
			return sres;
		});
	});
};
oFF.OuDataProviderActionCall.prototype.toString = function()
{
	return this.m_function;
};

oFF.DataProviderPool = function() {};
oFF.DataProviderPool.prototype = new oFF.XObject();
oFF.DataProviderPool.prototype._ff_c = "DataProviderPool";

oFF.DataProviderPool.createGlobal = function(process)
{
	let newObj = new oFF.DataProviderPool();
	newObj._setupDpPool(oFF.ProtocolType.FS_DP, process);
	return newObj;
};
oFF.DataProviderPool.createLocal = function(process)
{
	let newObj = new oFF.DataProviderPool();
	newObj._setupDpPool(oFF.ProtocolType.FS_DP, process);
	return newObj;
};
oFF.DataProviderPool.prototype.m_changedConsumers = null;
oFF.DataProviderPool.prototype.m_dataProviders = null;
oFF.DataProviderPool.prototype.m_poolUri = null;
oFF.DataProviderPool.prototype.m_process = null;
oFF.DataProviderPool.prototype._getGlobalPool = function()
{
	let pool;
	if (this.m_poolUri.getProtocolType() === oFF.ProtocolType.FS_DP)
	{
		pool = this;
	}
	else
	{
		pool = this.m_process.getSubSystem(oFF.SubSystemType.DATA_PROVIDER_POOL);
	}
	return pool;
};
oFF.DataProviderPool.prototype._getLocalPool = function(uri)
{
	let pool = null;
	let path = uri.getPath();
	let elements = oFF.XStringTokenizer.splitString(path, oFF.XUri.PATH_SEPARATOR);
	let process = this.m_process.getKernel().getKernelProcess();
	for (let i = 1; i < elements.size() - 1 && oFF.notNull(process); i++)
	{
		let name = elements.get(i);
		if (oFF.XString.startsWith(name, "."))
		{
			name = oFF.XString.substring(name, 1, -1);
			process = process.getChildProcessById(name);
		}
		else
		{
			process = null;
		}
	}
	if (oFF.notNull(process))
	{
		pool = process.getDataProviderPool();
	}
	return pool;
};
oFF.DataProviderPool.prototype._getPool = function(uri)
{
	let pool = null;
	let targetType = uri.getProtocolType();
	if (targetType === oFF.ProtocolType.FS_DP)
	{
		pool = this._getGlobalPool();
	}
	else
	{
		pool = this._getLocalPool(uri);
	}
	return pool;
};
oFF.DataProviderPool.prototype._notifyDataSpaceChanged = function(changedDpName)
{
	this.m_changedConsumers.accept(changedDpName);
};
oFF.DataProviderPool.prototype._setupDpPool = function(protocolType, process)
{
	this.m_process = process;
	let uri = oFF.XUri.create();
	uri.setProtocolType(protocolType);
	this.m_poolUri = uri;
	this.m_dataProviders = oFF.XListOfNameObject.create();
	this.m_changedConsumers = oFF.XConsumerCollection.create();
};
oFF.DataProviderPool.prototype.addChangeConsumer = function(consumer)
{
	return this.m_changedConsumers.addConsumer(consumer);
};
oFF.DataProviderPool.prototype.addDataProvider = function(dataProvider)
{
	this.m_dataProviders.add(dataProvider);
	this._notifyDataSpaceChanged(dataProvider.getName());
};
oFF.DataProviderPool.prototype.getAllDataProviderNames = function()
{
	return this.m_dataProviders.getKeysAsReadOnlyList();
};
oFF.DataProviderPool.prototype.getAllDataProviders = function()
{
	return this.m_dataProviders;
};
oFF.DataProviderPool.prototype.getComponentType = function()
{
	return oFF.IoComponentType.DATA_PROVIDER_POOL;
};
oFF.DataProviderPool.prototype.getDataProviderByName = function(name)
{
	return this.m_dataProviders.getByKey(name);
};
oFF.DataProviderPool.prototype.getDataProviderByUri = function(uri)
{
	let dp = null;
	if (oFF.notNull(uri))
	{
		let fileName = uri.getPathContainer().getFileName();
		dp = this.getDataProviderByName(fileName);
		if (oFF.isNull(dp))
		{
			let pool = this._getPool(uri);
			if (oFF.notNull(pool) && oFF.notNull(fileName))
			{
				dp = pool.getDataProviderByName(fileName);
			}
		}
	}
	return dp;
};
oFF.DataProviderPool.prototype.getPoolUri = function()
{
	return this.m_poolUri;
};
oFF.DataProviderPool.prototype.hasDataProviderByName = function(name)
{
	return this.m_dataProviders.containsKey(name);
};
oFF.DataProviderPool.prototype.releaseObject = function()
{
	this.m_changedConsumers = oFF.XObjectExt.release(this.m_changedConsumers);
	this.m_dataProviders = oFF.XObjectExt.release(this.m_dataProviders);
	this.m_process = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.DataProviderPool.prototype.removeChangeConsumerByUuid = function(consumerUuid)
{
	this.m_changedConsumers.removeConsumerByUuid(consumerUuid);
};
oFF.DataProviderPool.prototype.removeDataProviderByName = function(name)
{
	this.m_dataProviders.removeElement(this.m_dataProviders.getByKey(name));
	this._notifyDataSpaceChanged(name);
};
oFF.DataProviderPool.prototype.removeDataProviderByUri = function(uri)
{
	if (oFF.notNull(uri))
	{
		let fileName = uri.getPathContainer().getFileName();
		this.removeDataProviderByName(fileName);
	}
};

oFF.OuDataProviderAnalysisActionsCollection = function() {};
oFF.OuDataProviderAnalysisActionsCollection.prototype = new oFF.DfOuDataProviderActionsCollection();
oFF.OuDataProviderAnalysisActionsCollection.prototype._ff_c = "OuDataProviderAnalysisActionsCollection";

oFF.OuDataProviderAnalysisActionsCollection.NAME = "AnalysisActions";
oFF.OuDataProviderAnalysisActionsCollection.createCollection = function(actions)
{
	let obj = new oFF.OuDataProviderAnalysisActionsCollection();
	obj.setupCollection(actions);
	return obj;
};
oFF.OuDataProviderAnalysisActionsCollection.prototype.m_getMetadataAction = null;
oFF.OuDataProviderAnalysisActionsCollection.prototype.getName = function()
{
	return oFF.OuDataProviderAnalysisActionsCollection.NAME;
};
oFF.OuDataProviderAnalysisActionsCollection.prototype.getQueryMetadata = function()
{
	return this.getActions().performAction(this.m_getMetadataAction, oFF.XList.create());
};
oFF.OuDataProviderAnalysisActionsCollection.prototype.releaseObject = function()
{
	this.m_getMetadataAction = oFF.XObjectExt.release(this.m_getMetadataAction);
	oFF.DfOuDataProviderActionsCollection.prototype.releaseObject.call( this );
};
oFF.OuDataProviderAnalysisActionsCollection.prototype.setupCollection = function(actions)
{
	oFF.DfOuDataProviderActionsCollection.prototype.setupCollection.call( this , actions);
	this.m_getMetadataAction = this.addAction(oFF.OuDpAnalysisActionGetQueryMetadata.create(this.getActions()));
};

oFF.OuDataProviderAxisActionsCollection = function() {};
oFF.OuDataProviderAxisActionsCollection.prototype = new oFF.DfOuDataProviderActionsCollection();
oFF.OuDataProviderAxisActionsCollection.prototype._ff_c = "OuDataProviderAxisActionsCollection";

oFF.OuDataProviderAxisActionsCollection.NAME = "AxisActions";
oFF.OuDataProviderAxisActionsCollection.createCollection = function(actions)
{
	let obj = new oFF.OuDataProviderAxisActionsCollection();
	obj.setupCollection(actions);
	return obj;
};
oFF.OuDataProviderAxisActionsCollection.prototype.m_moveDimensionAction = null;
oFF.OuDataProviderAxisActionsCollection.prototype.m_moveDimensionAfterAction = null;
oFF.OuDataProviderAxisActionsCollection.prototype.m_moveDimensionBeforeAction = null;
oFF.OuDataProviderAxisActionsCollection.prototype.m_moveDimensionToColsAction = null;
oFF.OuDataProviderAxisActionsCollection.prototype.m_moveDimensionToRowsAction = null;
oFF.OuDataProviderAxisActionsCollection.prototype.m_removeDimension = null;
oFF.OuDataProviderAxisActionsCollection.prototype.m_swapAxisAction = null;
oFF.OuDataProviderAxisActionsCollection.prototype.m_swapDimensions = null;
oFF.OuDataProviderAxisActionsCollection.prototype.getName = function()
{
	return oFF.OuDataProviderAxisActionsCollection.NAME;
};
oFF.OuDataProviderAxisActionsCollection.prototype.moveDimensionAfter = function(dimension, targetDimension)
{
	return this.m_moveDimensionAfterAction.executeTyped(dimension, targetDimension);
};
oFF.OuDataProviderAxisActionsCollection.prototype.moveDimensionBefore = function(dimension, targetDimension)
{
	return this.m_moveDimensionBeforeAction.executeTyped(dimension, targetDimension);
};
oFF.OuDataProviderAxisActionsCollection.prototype.moveDimensionToAxis = function(dimensionName, axisType)
{
	return this.m_moveDimensionAction.executeTyped(dimensionName, axisType);
};
oFF.OuDataProviderAxisActionsCollection.prototype.moveDimensionToColumns = function(dimension)
{
	return this.m_moveDimensionToColsAction.executeTyped(dimension);
};
oFF.OuDataProviderAxisActionsCollection.prototype.moveDimensionToRows = function(dimension)
{
	return this.m_moveDimensionToRowsAction.executeTyped(dimension);
};
oFF.OuDataProviderAxisActionsCollection.prototype.releaseObject = function()
{
	this.m_moveDimensionAction = oFF.XObjectExt.release(this.m_moveDimensionAction);
	this.m_moveDimensionToRowsAction = oFF.XObjectExt.release(this.m_moveDimensionToRowsAction);
	this.m_moveDimensionToColsAction = oFF.XObjectExt.release(this.m_moveDimensionToColsAction);
	this.m_moveDimensionAfterAction = oFF.XObjectExt.release(this.m_moveDimensionAfterAction);
	this.m_moveDimensionBeforeAction = oFF.XObjectExt.release(this.m_moveDimensionBeforeAction);
	this.m_removeDimension = oFF.XObjectExt.release(this.m_removeDimension);
	this.m_swapDimensions = oFF.XObjectExt.release(this.m_swapDimensions);
	this.m_swapAxisAction = oFF.XObjectExt.release(this.m_swapAxisAction);
	oFF.DfOuDataProviderActionsCollection.prototype.releaseObject.call( this );
};
oFF.OuDataProviderAxisActionsCollection.prototype.removeDimension = function(dimension)
{
	return this.m_removeDimension.executeTyped(dimension);
};
oFF.OuDataProviderAxisActionsCollection.prototype.setupCollection = function(actions)
{
	oFF.DfOuDataProviderActionsCollection.prototype.setupCollection.call( this , actions);
	this.m_moveDimensionAction = this.addAction(oFF.OuDpAxisActionMoveDimensionToAxis.create(this.getActions()));
	this.m_moveDimensionToRowsAction = this.addAction(oFF.OuDpAxisActionMoveDimensionToRows.create(this.getActions()));
	this.m_moveDimensionToColsAction = this.addAction(oFF.OuDpAxisActionMoveDimensionToColumns.create(this.getActions()));
	this.m_moveDimensionAfterAction = this.addAction(oFF.OuDpAxisActionMoveDimensionAfter.create(this.getActions()));
	this.m_moveDimensionBeforeAction = this.addAction(oFF.OuDpAxisActionMoveDimensionBefore.create(this.getActions()));
	this.m_removeDimension = this.addAction(oFF.OuDpAxisActionRemoveDimension.create(this.getActions()));
	this.m_swapDimensions = this.addAction(oFF.OuDpAxisActionSwapDimensions.create(this.getActions()));
	this.m_swapAxisAction = this.addAction(oFF.OuDpAxisActionSwapAxis.create(this.getActions()));
};
oFF.OuDataProviderAxisActionsCollection.prototype.swapAxis = function()
{
	return this.getActions().performAction(this.m_swapAxisAction, oFF.XList.create());
};
oFF.OuDataProviderAxisActionsCollection.prototype.swapDimensions = function(dimension1, dimension2)
{
	return this.m_swapDimensions.executeTyped(dimension1, dimension2);
};

oFF.OuDataProviderDimensionActionsCollection = function() {};
oFF.OuDataProviderDimensionActionsCollection.prototype = new oFF.DfOuDataProviderActionsCollection();
oFF.OuDataProviderDimensionActionsCollection.prototype._ff_c = "OuDataProviderDimensionActionsCollection";

oFF.OuDataProviderDimensionActionsCollection.NAME = "DimensionActions";
oFF.OuDataProviderDimensionActionsCollection.createCollection = function(actions)
{
	let obj = new oFF.OuDataProviderDimensionActionsCollection();
	obj.setupCollection(actions);
	return obj;
};
oFF.OuDataProviderDimensionActionsCollection.prototype.getName = function()
{
	return oFF.OuDataProviderDimensionActionsCollection.NAME;
};
oFF.OuDataProviderDimensionActionsCollection.prototype.releaseObject = function()
{
	oFF.DfOuDataProviderActionsCollection.prototype.releaseObject.call( this );
};
oFF.OuDataProviderDimensionActionsCollection.prototype.setupCollection = function(actions)
{
	oFF.DfOuDataProviderActionsCollection.prototype.setupCollection.call( this , actions);
};

oFF.OuDataProviderFilterActionsCollection = function() {};
oFF.OuDataProviderFilterActionsCollection.prototype = new oFF.DfOuDataProviderActionsCollection();
oFF.OuDataProviderFilterActionsCollection.prototype._ff_c = "OuDataProviderFilterActionsCollection";

oFF.OuDataProviderFilterActionsCollection.NAME = "FilterActions";
oFF.OuDataProviderFilterActionsCollection.createCollection = function(actions)
{
	let obj = new oFF.OuDataProviderFilterActionsCollection();
	obj.setupCollection(actions);
	return obj;
};
oFF.OuDataProviderFilterActionsCollection.prototype.m_addSingleMemberFilterAction = null;
oFF.OuDataProviderFilterActionsCollection.prototype.m_removeSingleMemberFilterAction = null;
oFF.OuDataProviderFilterActionsCollection.prototype.m_setSimpleEqualFilterListAction = null;
oFF.OuDataProviderFilterActionsCollection.prototype.addSingleMemberFilter = function(dimensionName, operator, memberName)
{
	return this.m_addSingleMemberFilterAction.executeTyped(dimensionName, operator, memberName);
};
oFF.OuDataProviderFilterActionsCollection.prototype.getName = function()
{
	return oFF.OuDataProviderFilterActionsCollection.NAME;
};
oFF.OuDataProviderFilterActionsCollection.prototype.releaseObject = function()
{
	this.m_addSingleMemberFilterAction = oFF.XObjectExt.release(this.m_addSingleMemberFilterAction);
	this.m_removeSingleMemberFilterAction = oFF.XObjectExt.release(this.m_removeSingleMemberFilterAction);
	this.m_setSimpleEqualFilterListAction = oFF.XObjectExt.release(this.m_setSimpleEqualFilterListAction);
	oFF.DfOuDataProviderActionsCollection.prototype.releaseObject.call( this );
};
oFF.OuDataProviderFilterActionsCollection.prototype.removeSingleMemberFilter = function(dimensionName, operator, memberName)
{
	return this.m_removeSingleMemberFilterAction.executeTyped(dimensionName, operator, memberName);
};
oFF.OuDataProviderFilterActionsCollection.prototype.setSimpleEqualFilterList = function(dimensionName, valueList, hierarchyName, useExclude)
{
	return this.m_setSimpleEqualFilterListAction.executeTyped(dimensionName, valueList, hierarchyName, useExclude);
};
oFF.OuDataProviderFilterActionsCollection.prototype.setupCollection = function(actions)
{
	oFF.DfOuDataProviderActionsCollection.prototype.setupCollection.call( this , actions);
	this.m_addSingleMemberFilterAction = this.addAction(oFF.OuDpFilterActionAddSingleMemberFilter.create(this.getActions()));
	this.m_removeSingleMemberFilterAction = this.addAction(oFF.OuDpFilterActionRemoveSingleMemberFilter.create(this.getActions()));
	this.m_setSimpleEqualFilterListAction = this.addAction(oFF.OuDpFilterActionSetSimpleEqualFilterList.create(this.getActions()));
};

oFF.OuDataProviderHierarchyActionsCollection = function() {};
oFF.OuDataProviderHierarchyActionsCollection.prototype = new oFF.DfOuDataProviderActionsCollection();
oFF.OuDataProviderHierarchyActionsCollection.prototype._ff_c = "OuDataProviderHierarchyActionsCollection";

oFF.OuDataProviderHierarchyActionsCollection.NAME = "HierarchyActions";
oFF.OuDataProviderHierarchyActionsCollection.createCollection = function(actions)
{
	let obj = new oFF.OuDataProviderHierarchyActionsCollection();
	obj.setupCollection(actions);
	return obj;
};
oFF.OuDataProviderHierarchyActionsCollection.prototype.m_activateHierarchy = null;
oFF.OuDataProviderHierarchyActionsCollection.prototype.m_assignHierarchy = null;
oFF.OuDataProviderHierarchyActionsCollection.prototype.m_deactivateHierarchy = null;
oFF.OuDataProviderHierarchyActionsCollection.prototype.m_getAssignedHierarchy = null;
oFF.OuDataProviderHierarchyActionsCollection.prototype.m_isHierarchyActive = null;
oFF.OuDataProviderHierarchyActionsCollection.prototype.m_isHierarchyAssigned = null;
oFF.OuDataProviderHierarchyActionsCollection.prototype.m_unassignHierarchy = null;
oFF.OuDataProviderHierarchyActionsCollection.prototype.activateHierarchy = function(dimName)
{
	return this.m_activateHierarchy.executeTyped(dimName);
};
oFF.OuDataProviderHierarchyActionsCollection.prototype.assignHierarchy = function(dimName, hierarchyName)
{
	return this.m_assignHierarchy.executeTyped(dimName, hierarchyName);
};
oFF.OuDataProviderHierarchyActionsCollection.prototype.deactivateHierarchy = function(dimName)
{
	return this.m_deactivateHierarchy.executeTyped(dimName);
};
oFF.OuDataProviderHierarchyActionsCollection.prototype.getAssignedHierarchy = function(dimName)
{
	return this.m_getAssignedHierarchy.executeTyped(dimName).onThenExt((result) => {
		return oFF.notNull(result) ? result.getString() : null;
	});
};
oFF.OuDataProviderHierarchyActionsCollection.prototype.getName = function()
{
	return oFF.OuDataProviderHierarchyActionsCollection.NAME;
};
oFF.OuDataProviderHierarchyActionsCollection.prototype.isHierarchyActive = function(dimName)
{
	return this.m_isHierarchyActive.executeTyped(dimName);
};
oFF.OuDataProviderHierarchyActionsCollection.prototype.isHierarchyAssigned = function(dimName)
{
	return this.m_isHierarchyAssigned.executeTyped(dimName);
};
oFF.OuDataProviderHierarchyActionsCollection.prototype.releaseObject = function()
{
	this.m_assignHierarchy = oFF.XObjectExt.release(this.m_assignHierarchy);
	this.m_unassignHierarchy = oFF.XObjectExt.release(this.m_unassignHierarchy);
	this.m_getAssignedHierarchy = oFF.XObjectExt.release(this.m_getAssignedHierarchy);
	this.m_isHierarchyAssigned = oFF.XObjectExt.release(this.m_isHierarchyAssigned);
	this.m_isHierarchyActive = oFF.XObjectExt.release(this.m_isHierarchyActive);
	this.m_activateHierarchy = oFF.XObjectExt.release(this.m_activateHierarchy);
	this.m_deactivateHierarchy = oFF.XObjectExt.release(this.m_deactivateHierarchy);
	oFF.DfOuDataProviderActionsCollection.prototype.releaseObject.call( this );
};
oFF.OuDataProviderHierarchyActionsCollection.prototype.setupCollection = function(actions)
{
	oFF.DfOuDataProviderActionsCollection.prototype.setupCollection.call( this , actions);
	this.m_assignHierarchy = this.addAction(oFF.OuDpHierarchyActionAssignHierarchy.create(this.getActions()));
	this.m_unassignHierarchy = this.addAction(oFF.OuDpHierarchyActionUnassignHierarchy.create(this.getActions()));
	this.m_getAssignedHierarchy = this.addAction(oFF.OuDpHierarchyActionGetAssignedHierarchy.create(this.getActions()));
	this.m_isHierarchyAssigned = this.addAction(oFF.OuDpHierarchyActionIsHierarchyAssigned.create(this.getActions()));
	this.m_isHierarchyActive = this.addAction(oFF.OuDpHierarchyActionIsHierarchyActive.create(this.getActions()));
	this.m_activateHierarchy = this.addAction(oFF.OuDpHierarchyActionActivateHierarchy.create(this.getActions()));
	this.m_deactivateHierarchy = this.addAction(oFF.OuDpHierarchyActionDeactivateHierarchy.create(this.getActions()));
};
oFF.OuDataProviderHierarchyActionsCollection.prototype.unassignHierarchy = function(dimName)
{
	return this.m_unassignHierarchy.executeTyped(dimName);
};

oFF.OuDataProviderLifecycleActionsCollection = function() {};
oFF.OuDataProviderLifecycleActionsCollection.prototype = new oFF.DfOuDataProviderActionsCollection();
oFF.OuDataProviderLifecycleActionsCollection.prototype._ff_c = "OuDataProviderLifecycleActionsCollection";

oFF.OuDataProviderLifecycleActionsCollection.NAME = "LifecycleActions";
oFF.OuDataProviderLifecycleActionsCollection.createCollection = function(actions)
{
	let obj = new oFF.OuDataProviderLifecycleActionsCollection();
	obj.setupCollection(actions);
	return obj;
};
oFF.OuDataProviderLifecycleActionsCollection.prototype.m_connectAction = null;
oFF.OuDataProviderLifecycleActionsCollection.prototype.m_connectSystemSimpleAction = null;
oFF.OuDataProviderLifecycleActionsCollection.prototype.m_disconnectAction = null;
oFF.OuDataProviderLifecycleActionsCollection.prototype.m_killAction = null;
oFF.OuDataProviderLifecycleActionsCollection.prototype.m_reconnectAction = null;
oFF.OuDataProviderLifecycleActionsCollection.prototype.connectDataProvider = function(newConnection, closeConnection)
{
	return this.m_connectAction.executeTyped(newConnection, closeConnection);
};
oFF.OuDataProviderLifecycleActionsCollection.prototype.connectDataProviderToSystemSimple = function(systemName, fullQualifiedDataSourceName, closeConnection)
{
	return this.m_connectSystemSimpleAction.executeTyped(systemName, fullQualifiedDataSourceName, closeConnection);
};
oFF.OuDataProviderLifecycleActionsCollection.prototype.disconnectDataProvider = function()
{
	return this.m_disconnectAction.executeTyped(true);
};
oFF.OuDataProviderLifecycleActionsCollection.prototype.getName = function()
{
	return oFF.OuDataProviderLifecycleActionsCollection.NAME;
};
oFF.OuDataProviderLifecycleActionsCollection.prototype.killDataProvider = function(closeConnection)
{
	return this.m_killAction.executeTyped(closeConnection);
};
oFF.OuDataProviderLifecycleActionsCollection.prototype.reconnectDataProvider = function(closeConnection)
{
	return this.m_reconnectAction.executeTyped(closeConnection);
};
oFF.OuDataProviderLifecycleActionsCollection.prototype.releaseObject = function()
{
	this.m_reconnectAction = oFF.XObjectExt.release(this.m_reconnectAction);
	this.m_connectAction = oFF.XObjectExt.release(this.m_connectAction);
	this.m_connectSystemSimpleAction = oFF.XObjectExt.release(this.m_connectSystemSimpleAction);
	this.m_disconnectAction = oFF.XObjectExt.release(this.m_disconnectAction);
	this.m_killAction = oFF.XObjectExt.release(this.m_killAction);
	oFF.DfOuDataProviderActionsCollection.prototype.releaseObject.call( this );
};
oFF.OuDataProviderLifecycleActionsCollection.prototype.setupCollection = function(actions)
{
	oFF.DfOuDataProviderActionsCollection.prototype.setupCollection.call( this , actions);
	this.m_reconnectAction = this.addAction(oFF.OuDPLifecycleActionReconnect.create(actions));
	this.m_connectAction = this.addAction(oFF.OuDPLifecycleActionConnect.create(actions));
	this.m_connectSystemSimpleAction = this.addAction(oFF.OuDPLifecycleActionConnectToSystemSimple.create(actions));
	this.m_disconnectAction = this.addAction(oFF.OuDPLifecycleActionDisconnect.create(actions));
	this.m_killAction = this.addAction(oFF.OuDPLifecycleActionKill.create(actions));
};

oFF.OuDataProviderPresentationActionsCollection = function() {};
oFF.OuDataProviderPresentationActionsCollection.prototype = new oFF.DfOuDataProviderActionsCollection();
oFF.OuDataProviderPresentationActionsCollection.prototype._ff_c = "OuDataProviderPresentationActionsCollection";

oFF.OuDataProviderPresentationActionsCollection.NAME = "PresentationActions";
oFF.OuDataProviderPresentationActionsCollection.createCollection = function(actions)
{
	let obj = new oFF.OuDataProviderPresentationActionsCollection();
	obj.setupCollection(actions);
	return obj;
};
oFF.OuDataProviderPresentationActionsCollection.prototype.m_addResultSetField = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_getAvailableDisplays = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_getAvailableKeyDisplays = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_getAvailableKeyViews = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_getAvailableTextViews = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_getDefaultKeyDisplay = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_getDefaultKeyView = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_getDefaultTextView = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_getDisplay = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_getKeyDisplay = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_getKeyView = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_getTextView = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_isFieldInResultSet = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_isKeyViewActive = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_isKeyViewDefault = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_isKeyViewSupported = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_isTextViewActive = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_isTextViewDefault = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_isTextViewSupported = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_removeResultSetField = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_resetKeyViewToDefault = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_resetTextViewToDefault = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_setDisplay = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_setKeyDisplay = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_setKeyView = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.m_setTextView = null;
oFF.OuDataProviderPresentationActionsCollection.prototype.addFieldToResultSet = function(fieldName)
{
	return this.m_addResultSetField.executeTyped(fieldName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.getAvailableDisplays = function(dimName, attributeName)
{
	return this.m_getAvailableDisplays.executeTyped(dimName, attributeName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.getAvailableKeyDisplays = function(dimName, attributeName)
{
	return this.m_getAvailableKeyDisplays.executeTyped(dimName, attributeName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.getAvailableKeyViews = function(dimName, attributeName)
{
	return this.m_getAvailableKeyViews.executeTyped(dimName, attributeName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.getAvailableTextViews = function(dimName, attributeName)
{
	return this.m_getAvailableTextViews.executeTyped(dimName, attributeName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.getDefaultKeyDisplay = function(dimName, attributeName)
{
	return this.m_getDefaultKeyDisplay.executeTyped(dimName, attributeName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.getDefaultKeyView = function(dimName, attributeName)
{
	return this.m_getDefaultKeyView.executeTyped(dimName, attributeName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.getDefaultTextView = function(dimName, attributeName)
{
	return this.m_getDefaultTextView.executeTyped(dimName, attributeName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.getDisplay = function(dimName, attributeName)
{
	return this.m_getDisplay.executeTyped(dimName, attributeName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.getKeyDisplay = function(dimName, attributeName)
{
	return this.m_getKeyDisplay.executeTyped(dimName, attributeName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.getKeyView = function(dimName, attributeName)
{
	return this.m_getKeyView.executeTyped(dimName, attributeName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.getName = function()
{
	return oFF.OuDataProviderPresentationActionsCollection.NAME;
};
oFF.OuDataProviderPresentationActionsCollection.prototype.getTextView = function(dimName, attributeName)
{
	return this.m_getTextView.executeTyped(dimName, attributeName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.isFieldInResultSet = function(fieldName)
{
	return this.m_isFieldInResultSet.executeTyped(fieldName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.isKeyViewActive = function(dimName, attributeName)
{
	return this.m_isKeyViewActive.executeTyped(dimName, attributeName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.isKeyViewDefault = function(dimName, attributeName)
{
	return this.m_isKeyViewDefault.executeTyped(dimName, attributeName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.isKeyViewSupported = function(dimName, attributeName)
{
	return this.m_isKeyViewSupported.executeTyped(dimName, attributeName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.isTextViewActive = function(dimName, attributeName)
{
	return this.m_isTextViewActive.executeTyped(dimName, attributeName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.isTextViewDefault = function(dimName, attributeName)
{
	return this.m_isTextViewDefault.executeTyped(dimName, attributeName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.isTextViewSupported = function(dimName, attributeName)
{
	return this.m_isTextViewSupported.executeTyped(dimName, attributeName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.releaseObject = function()
{
	this.m_getAvailableDisplays = oFF.XObjectExt.release(this.m_getAvailableDisplays);
	this.m_getAvailableKeyDisplays = oFF.XObjectExt.release(this.m_getAvailableKeyDisplays);
	this.m_getAvailableKeyViews = oFF.XObjectExt.release(this.m_getAvailableKeyViews);
	this.m_getAvailableTextViews = oFF.XObjectExt.release(this.m_getAvailableTextViews);
	this.m_getDefaultKeyDisplay = oFF.XObjectExt.release(this.m_getDefaultKeyDisplay);
	this.m_getDefaultKeyView = oFF.XObjectExt.release(this.m_getDefaultKeyView);
	this.m_getDefaultTextView = oFF.XObjectExt.release(this.m_getDefaultTextView);
	this.m_getDisplay = oFF.XObjectExt.release(this.m_getDisplay);
	this.m_getKeyDisplay = oFF.XObjectExt.release(this.m_getKeyDisplay);
	this.m_getKeyView = oFF.XObjectExt.release(this.m_getKeyView);
	this.m_getTextView = oFF.XObjectExt.release(this.m_getTextView);
	this.m_isKeyViewActive = oFF.XObjectExt.release(this.m_isKeyViewActive);
	this.m_isKeyViewDefault = oFF.XObjectExt.release(this.m_isKeyViewDefault);
	this.m_isKeyViewSupported = oFF.XObjectExt.release(this.m_isKeyViewSupported);
	this.m_isTextViewActive = oFF.XObjectExt.release(this.m_isTextViewActive);
	this.m_isTextViewDefault = oFF.XObjectExt.release(this.m_isTextViewDefault);
	this.m_isTextViewSupported = oFF.XObjectExt.release(this.m_isTextViewSupported);
	this.m_resetKeyViewToDefault = oFF.XObjectExt.release(this.m_resetKeyViewToDefault);
	this.m_resetTextViewToDefault = oFF.XObjectExt.release(this.m_resetTextViewToDefault);
	this.m_setDisplay = oFF.XObjectExt.release(this.m_setDisplay);
	this.m_setKeyDisplay = oFF.XObjectExt.release(this.m_setKeyDisplay);
	this.m_setKeyView = oFF.XObjectExt.release(this.m_setKeyView);
	this.m_setTextView = oFF.XObjectExt.release(this.m_setTextView);
	this.m_isFieldInResultSet = oFF.XObjectExt.release(this.m_isFieldInResultSet);
	this.m_addResultSetField = oFF.XObjectExt.release(this.m_addResultSetField);
	this.m_removeResultSetField = oFF.XObjectExt.release(this.m_removeResultSetField);
	oFF.DfOuDataProviderActionsCollection.prototype.releaseObject.call( this );
};
oFF.OuDataProviderPresentationActionsCollection.prototype.removeFieldFromResultSet = function(fieldName)
{
	return this.m_removeResultSetField.executeTyped(fieldName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.resetKeyViewToDefault = function(dimName, attributeName)
{
	return this.m_resetKeyViewToDefault.executeTyped(dimName, attributeName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.resetTextViewToDefault = function(dimName, attributeName)
{
	return this.m_resetTextViewToDefault.executeTyped(dimName, attributeName);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.setDisplay = function(dimName, attributeName, display)
{
	return this.m_setDisplay.executeTyped(dimName, attributeName, display);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.setKeyDisplay = function(dimName, attributeName, keyDisplay)
{
	return this.m_setKeyDisplay.executeTyped(dimName, attributeName, keyDisplay);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.setKeyView = function(dimName, attributeName, keyView)
{
	return this.m_setKeyView.executeTyped(dimName, attributeName, keyView);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.setTextView = function(dimName, attributeName, textView)
{
	return this.m_setTextView.executeTyped(dimName, attributeName, textView);
};
oFF.OuDataProviderPresentationActionsCollection.prototype.setupCollection = function(actions)
{
	oFF.DfOuDataProviderActionsCollection.prototype.setupCollection.call( this , actions);
	this.m_getAvailableDisplays = this.addAction(oFF.OuDpPresentationActionGetAvailableDisplays.create(this.getActions()));
	this.m_getAvailableKeyDisplays = this.addAction(oFF.OuDpPresentationActionGetAvailableKeyDisplays.create(this.getActions()));
	this.m_getAvailableKeyViews = this.addAction(oFF.OuDpPresentationActionGetAvailableKeyViews.create(this.getActions()));
	this.m_getAvailableTextViews = this.addAction(oFF.OuDpPresentationActionGetAvailableTextViews.create(this.getActions()));
	this.m_getDefaultKeyDisplay = this.addAction(oFF.OuDpPresentationActionGetDefaultKeyDisplay.create(this.getActions()));
	this.m_getDefaultKeyView = this.addAction(oFF.OuDpPresentationActionGetDefaultKeyView.create(this.getActions()));
	this.m_getDefaultTextView = this.addAction(oFF.OuDpPresentationActionGetDefaultTextView.create(this.getActions()));
	this.m_getDisplay = this.addAction(oFF.OuDpPresentationActionGetDisplay.create(this.getActions()));
	this.m_getKeyDisplay = this.addAction(oFF.OuDpPresentationActionGetKeyDisplay.create(this.getActions()));
	this.m_getKeyView = this.addAction(oFF.OuDpPresentationActionGetKeyView.create(this.getActions()));
	this.m_getTextView = this.addAction(oFF.OuDpPresentationActionGetTextView.create(this.getActions()));
	this.m_isKeyViewActive = this.addAction(oFF.OuDpPresentationActionIsKeyViewActive.create(this.getActions()));
	this.m_isKeyViewDefault = this.addAction(oFF.OuDpPresentationActionIsKeyViewDefault.create(this.getActions()));
	this.m_isKeyViewSupported = this.addAction(oFF.OuDpPresentationActionIsKeyViewSupported.create(this.getActions()));
	this.m_isTextViewActive = this.addAction(oFF.OuDpPresentationActionIsTextViewActive.create(this.getActions()));
	this.m_isTextViewDefault = this.addAction(oFF.OuDpPresentationActionIsTextViewDefault.create(this.getActions()));
	this.m_isTextViewSupported = this.addAction(oFF.OuDpPresentationActionIsTextViewSupported.create(this.getActions()));
	this.m_resetKeyViewToDefault = this.addAction(oFF.OuDpPresentationActionResetKeyViewToDefault.create(this.getActions()));
	this.m_resetTextViewToDefault = this.addAction(oFF.OuDpPresentationActionResetTextViewToDefault.create(this.getActions()));
	this.m_setDisplay = this.addAction(oFF.OuDpPresentationActionSetDisplay.create(this.getActions()));
	this.m_setKeyDisplay = this.addAction(oFF.OuDpPresentationActionSetKeyDisplay.create(this.getActions()));
	this.m_setKeyView = this.addAction(oFF.OuDpPresentationActionSetKeyView.create(this.getActions()));
	this.m_setTextView = this.addAction(oFF.OuDpPresentationActionSetTextView.create(this.getActions()));
	this.m_isFieldInResultSet = this.addAction(oFF.OuDpPresentationActionIsFieldInResultSet.create(this.getActions()));
	this.m_addResultSetField = this.addAction(oFF.OuDpPresentationActionAddResultSetField.create(this.getActions()));
	this.m_removeResultSetField = this.addAction(oFF.OuDpPresentationActionRemoveResultSetField.create(this.getActions()));
};

oFF.OuDataProviderQueryModelActionsCollection = function() {};
oFF.OuDataProviderQueryModelActionsCollection.prototype = new oFF.DfOuDataProviderActionsCollection();
oFF.OuDataProviderQueryModelActionsCollection.prototype._ff_c = "OuDataProviderQueryModelActionsCollection";

oFF.OuDataProviderQueryModelActionsCollection.NAME = "QueryModelActions";
oFF.OuDataProviderQueryModelActionsCollection.createCollection = function(actions)
{
	let obj = new oFF.OuDataProviderQueryModelActionsCollection();
	obj.setupCollection(actions);
	return obj;
};
oFF.OuDataProviderQueryModelActionsCollection.prototype.m_setDataSourceTextAction = null;
oFF.OuDataProviderQueryModelActionsCollection.prototype.getName = function()
{
	return oFF.OuDataProviderQueryModelActionsCollection.NAME;
};
oFF.OuDataProviderQueryModelActionsCollection.prototype.releaseObject = function()
{
	this.m_setDataSourceTextAction = oFF.XObjectExt.release(this.m_setDataSourceTextAction);
	oFF.DfOuDataProviderActionsCollection.prototype.releaseObject.call( this );
};
oFF.OuDataProviderQueryModelActionsCollection.prototype.setDataSourceText = function(dataSourceText)
{
	return this.m_setDataSourceTextAction.executeTyped(dataSourceText);
};
oFF.OuDataProviderQueryModelActionsCollection.prototype.setupCollection = function(actions)
{
	oFF.DfOuDataProviderActionsCollection.prototype.setupCollection.call( this , actions);
	this.m_setDataSourceTextAction = this.addAction(oFF.OuDPQueryModelSetDataSourceText.create(actions));
};

oFF.OuDataProviderReadModeActionsCollection = function() {};
oFF.OuDataProviderReadModeActionsCollection.prototype = new oFF.DfOuDataProviderActionsCollection();
oFF.OuDataProviderReadModeActionsCollection.prototype._ff_c = "OuDataProviderReadModeActionsCollection";

oFF.OuDataProviderReadModeActionsCollection.NAME = "ReadModeActions";
oFF.OuDataProviderReadModeActionsCollection.createCollection = function(actions)
{
	let obj = new oFF.OuDataProviderReadModeActionsCollection();
	obj.setupCollection(actions);
	return obj;
};
oFF.OuDataProviderReadModeActionsCollection.prototype.m_getReadMode = null;
oFF.OuDataProviderReadModeActionsCollection.prototype.m_getSupportedReadModes = null;
oFF.OuDataProviderReadModeActionsCollection.prototype.m_setReadMode = null;
oFF.OuDataProviderReadModeActionsCollection.prototype.getName = function()
{
	return oFF.OuDataProviderReadModeActionsCollection.NAME;
};
oFF.OuDataProviderReadModeActionsCollection.prototype.getReadMode = function(dimensionName)
{
	return this.m_getReadMode.executeTyped(dimensionName);
};
oFF.OuDataProviderReadModeActionsCollection.prototype.getSupportedReadModes = function(dimensionName)
{
	return this.m_getSupportedReadModes.executeTyped(dimensionName);
};
oFF.OuDataProviderReadModeActionsCollection.prototype.releaseObject = function()
{
	this.m_getSupportedReadModes = oFF.XObjectExt.release(this.m_getSupportedReadModes);
	this.m_getReadMode = oFF.XObjectExt.release(this.m_getReadMode);
	this.m_setReadMode = oFF.XObjectExt.release(this.m_setReadMode);
	oFF.DfOuDataProviderActionsCollection.prototype.releaseObject.call( this );
};
oFF.OuDataProviderReadModeActionsCollection.prototype.setReadMode = function(dimensionName, readMode, synchronizeReadModesAndSuppression)
{
	return this.m_setReadMode.executeTyped(dimensionName, readMode, synchronizeReadModesAndSuppression);
};
oFF.OuDataProviderReadModeActionsCollection.prototype.setupCollection = function(actions)
{
	oFF.DfOuDataProviderActionsCollection.prototype.setupCollection.call( this , actions);
	this.m_getSupportedReadModes = this.addAction(oFF.OuDpGetSupportedResultSetReadModes.create(this.getActions()));
	this.m_getReadMode = this.addAction(oFF.OuDpGetCurrentResultSetReadMode.create(this.getActions()));
	this.m_setReadMode = this.addAction(oFF.OuDpSetResultSetReadMode.create(this.getActions()));
};

oFF.OuDataProviderResultSetActionsCollection = function() {};
oFF.OuDataProviderResultSetActionsCollection.prototype = new oFF.DfOuDataProviderActionsCollection();
oFF.OuDataProviderResultSetActionsCollection.prototype._ff_c = "OuDataProviderResultSetActionsCollection";

oFF.OuDataProviderResultSetActionsCollection.NAME = "ResultSetActions";
oFF.OuDataProviderResultSetActionsCollection.createCollection = function(actions)
{
	let obj = new oFF.OuDataProviderResultSetActionsCollection();
	obj.setupCollection(actions);
	return obj;
};
oFF.OuDataProviderResultSetActionsCollection.prototype.m_fetchNewResultSet = null;
oFF.OuDataProviderResultSetActionsCollection.prototype.m_getAsciiResultSet = null;
oFF.OuDataProviderResultSetActionsCollection.prototype.m_getCsvResultSet = null;
oFF.OuDataProviderResultSetActionsCollection.prototype.m_getGridTile = null;
oFF.OuDataProviderResultSetActionsCollection.prototype.fetchNewResultSet = function()
{
	return this.m_fetchNewResultSet.executeTyped();
};
oFF.OuDataProviderResultSetActionsCollection.prototype.getAsciiResultSet = function(maxRowCount, maxColumnCount)
{
	return this.m_getAsciiResultSet.executeTyped(maxRowCount, maxColumnCount).onThenExt((result) => {
		return result.toString();
	});
};
oFF.OuDataProviderResultSetActionsCollection.prototype.getCsvResultSet = function(maxRowCount, maxColumnCount)
{
	return this.m_getCsvResultSet.executeTyped(maxRowCount, maxColumnCount).onThenExt((result) => {
		return result.toString();
	});
};
oFF.OuDataProviderResultSetActionsCollection.prototype.getGridTile = function()
{
	return this.getActions().performAction(this.m_getGridTile, oFF.XList.create());
};
oFF.OuDataProviderResultSetActionsCollection.prototype.getName = function()
{
	return oFF.OuDataProviderResultSetActionsCollection.NAME;
};
oFF.OuDataProviderResultSetActionsCollection.prototype.releaseObject = function()
{
	this.m_fetchNewResultSet = oFF.XObjectExt.release(this.m_fetchNewResultSet);
	this.m_getAsciiResultSet = oFF.XObjectExt.release(this.m_getAsciiResultSet);
	this.m_getCsvResultSet = oFF.XObjectExt.release(this.m_getCsvResultSet);
	this.m_getGridTile = oFF.XObjectExt.release(this.m_getGridTile);
	oFF.DfOuDataProviderActionsCollection.prototype.releaseObject.call( this );
};
oFF.OuDataProviderResultSetActionsCollection.prototype.setupCollection = function(actions)
{
	oFF.DfOuDataProviderActionsCollection.prototype.setupCollection.call( this , actions);
	this.m_fetchNewResultSet = this.addAction(oFF.OuDpResultSetActionFetchNewResultSet.create(this.getActions()));
	this.m_getAsciiResultSet = this.addAction(oFF.OuDpResultSetActionGetAscii.create(this.getActions()));
	this.m_getCsvResultSet = this.addAction(oFF.OuDpResultSetActionGetCsv.create(this.getActions()));
	this.m_getGridTile = this.addAction(oFF.OuDpResultSetActionGetGridTile.create(this.getActions()));
};

oFF.OuDataProviderSerializationActionsCollection = function() {};
oFF.OuDataProviderSerializationActionsCollection.prototype = new oFF.DfOuDataProviderActionsCollection();
oFF.OuDataProviderSerializationActionsCollection.prototype._ff_c = "OuDataProviderSerializationActionsCollection";

oFF.OuDataProviderSerializationActionsCollection.NAME = "SerializationActions";
oFF.OuDataProviderSerializationActionsCollection.createCollection = function(actions)
{
	let obj = new oFF.OuDataProviderSerializationActionsCollection();
	obj.setupCollection(actions);
	return obj;
};
oFF.OuDataProviderSerializationActionsCollection.prototype.m_exportRepository = null;
oFF.OuDataProviderSerializationActionsCollection.prototype.m_importRepository = null;
oFF.OuDataProviderSerializationActionsCollection.prototype.exportRepository = function(useDelta)
{
	return this.m_exportRepository.executeTyped(useDelta);
};
oFF.OuDataProviderSerializationActionsCollection.prototype.getName = function()
{
	return oFF.OuDataProviderSerializationActionsCollection.NAME;
};
oFF.OuDataProviderSerializationActionsCollection.prototype.importRepository = function(repository, useDelta)
{
	return this.m_importRepository.executeTyped(repository, useDelta);
};
oFF.OuDataProviderSerializationActionsCollection.prototype.releaseObject = function()
{
	this.m_exportRepository = oFF.XObjectExt.release(this.m_exportRepository);
	this.m_importRepository = oFF.XObjectExt.release(this.m_importRepository);
	oFF.DfOuDataProviderActionsCollection.prototype.releaseObject.call( this );
};
oFF.OuDataProviderSerializationActionsCollection.prototype.setupCollection = function(actions)
{
	oFF.DfOuDataProviderActionsCollection.prototype.setupCollection.call( this , actions);
	this.m_exportRepository = this.addAction(oFF.OuDpSerializationActionExportRepository.create(this.getActions()));
	this.m_importRepository = this.addAction(oFF.OuDpSerializationActionImportRepository.create(this.getActions()));
};

oFF.OuDataProviderSuppressionActionsCollection = function() {};
oFF.OuDataProviderSuppressionActionsCollection.prototype = new oFF.DfOuDataProviderActionsCollection();
oFF.OuDataProviderSuppressionActionsCollection.prototype._ff_c = "OuDataProviderSuppressionActionsCollection";

oFF.OuDataProviderSuppressionActionsCollection.NAME = "SuppressionActions";
oFF.OuDataProviderSuppressionActionsCollection.createCollection = function(actions)
{
	let obj = new oFF.OuDataProviderSuppressionActionsCollection();
	obj.setupCollection(actions);
	return obj;
};
oFF.OuDataProviderSuppressionActionsCollection.prototype.m_getSupportedSuppressionTypes = null;
oFF.OuDataProviderSuppressionActionsCollection.prototype.m_getSuppressionType = null;
oFF.OuDataProviderSuppressionActionsCollection.prototype.m_setSuppressionType = null;
oFF.OuDataProviderSuppressionActionsCollection.prototype.getName = function()
{
	return oFF.OuDataProviderSuppressionActionsCollection.NAME;
};
oFF.OuDataProviderSuppressionActionsCollection.prototype.getSupportedSuppressionTypes = function(axisType)
{
	return this.m_getSupportedSuppressionTypes.executeTyped(axisType);
};
oFF.OuDataProviderSuppressionActionsCollection.prototype.getSuppressionType = function(axisType)
{
	return this.m_getSuppressionType.executeTyped(axisType);
};
oFF.OuDataProviderSuppressionActionsCollection.prototype.releaseObject = function()
{
	this.m_getSupportedSuppressionTypes = oFF.XObjectExt.release(this.m_getSupportedSuppressionTypes);
	this.m_getSuppressionType = oFF.XObjectExt.release(this.m_getSuppressionType);
	this.m_setSuppressionType = oFF.XObjectExt.release(this.m_setSuppressionType);
	oFF.DfOuDataProviderActionsCollection.prototype.releaseObject.call( this );
};
oFF.OuDataProviderSuppressionActionsCollection.prototype.setSuppressionType = function(axisType, suppressionType, synchronizeReadModesAndSuppression)
{
	return this.m_setSuppressionType.executeTyped(axisType, suppressionType, synchronizeReadModesAndSuppression);
};
oFF.OuDataProviderSuppressionActionsCollection.prototype.setupCollection = function(actions)
{
	oFF.DfOuDataProviderActionsCollection.prototype.setupCollection.call( this , actions);
	this.m_getSupportedSuppressionTypes = this.addAction(oFF.OuDpGetSupportedSuppressionTypes.create(this.getActions()));
	this.m_getSuppressionType = this.addAction(oFF.OuDpGetCurrentSuppressionType.create(this.getActions()));
	this.m_setSuppressionType = this.addAction(oFF.OuDpSetResultSetSuppressionType.create(this.getActions()));
};

oFF.OuDataProviderTotalsActionsCollection = function() {};
oFF.OuDataProviderTotalsActionsCollection.prototype = new oFF.DfOuDataProviderActionsCollection();
oFF.OuDataProviderTotalsActionsCollection.prototype._ff_c = "OuDataProviderTotalsActionsCollection";

oFF.OuDataProviderTotalsActionsCollection.NAME = "TotalsActions";
oFF.OuDataProviderTotalsActionsCollection.createCollection = function(actions)
{
	let obj = new oFF.OuDataProviderTotalsActionsCollection();
	obj.setupCollection(actions);
	return obj;
};
oFF.OuDataProviderTotalsActionsCollection.prototype.m_getPosition = null;
oFF.OuDataProviderTotalsActionsCollection.prototype.m_getVisibility = null;
oFF.OuDataProviderTotalsActionsCollection.prototype.m_setPosition = null;
oFF.OuDataProviderTotalsActionsCollection.prototype.m_setVisibility = null;
oFF.OuDataProviderTotalsActionsCollection.prototype.getName = function()
{
	return oFF.OuDataProviderTotalsActionsCollection.NAME;
};
oFF.OuDataProviderTotalsActionsCollection.prototype.getTotalsPosition = function(modelLevel, name)
{
	return this.m_getPosition.executeTyped(modelLevel, name);
};
oFF.OuDataProviderTotalsActionsCollection.prototype.getTotalsVisibility = function(resultStructureElement, modelLevel, name)
{
	return this.m_getVisibility.executeTyped(resultStructureElement, modelLevel, name);
};
oFF.OuDataProviderTotalsActionsCollection.prototype.releaseObject = function()
{
	this.m_getPosition = oFF.XObjectExt.release(this.m_getPosition);
	this.m_setPosition = oFF.XObjectExt.release(this.m_setPosition);
	this.m_getVisibility = oFF.XObjectExt.release(this.m_getVisibility);
	this.m_setVisibility = oFF.XObjectExt.release(this.m_setVisibility);
	oFF.DfOuDataProviderActionsCollection.prototype.releaseObject.call( this );
};
oFF.OuDataProviderTotalsActionsCollection.prototype.setTotalsPosition = function(modelLevel, name, alignment)
{
	return this.m_setPosition.executeTyped(modelLevel, name, alignment);
};
oFF.OuDataProviderTotalsActionsCollection.prototype.setTotalsVisibility = function(resultStructureElement, modelLevel, name, visibility)
{
	return this.m_setVisibility.executeTyped(resultStructureElement, modelLevel, name, visibility);
};
oFF.OuDataProviderTotalsActionsCollection.prototype.setupCollection = function(actions)
{
	oFF.DfOuDataProviderActionsCollection.prototype.setupCollection.call( this , actions);
	this.m_getPosition = this.addAction(oFF.OuDpTotalsGetPosition.create(this.getActions()));
	this.m_setPosition = this.addAction(oFF.OuDpTotalsSetPosition.create(this.getActions()));
	this.m_getVisibility = this.addAction(oFF.OuDpTotalsGetVisibility.create(this.getActions()));
	this.m_setVisibility = this.addAction(oFF.OuDpTotalsSetVisibility.create(this.getActions()));
};

oFF.OuDataProviderVariableActionsCollection = function() {};
oFF.OuDataProviderVariableActionsCollection.prototype = new oFF.DfOuDataProviderActionsCollection();
oFF.OuDataProviderVariableActionsCollection.prototype._ff_c = "OuDataProviderVariableActionsCollection";

oFF.OuDataProviderVariableActionsCollection.NAME = "VariableActions";
oFF.OuDataProviderVariableActionsCollection.createCollection = function(actions)
{
	let obj = new oFF.OuDataProviderVariableActionsCollection();
	obj.setupCollection(actions);
	return obj;
};
oFF.OuDataProviderVariableActionsCollection.prototype.m_endVariableChangeAction = null;
oFF.OuDataProviderVariableActionsCollection.prototype.m_startVariableChangeAction = null;
oFF.OuDataProviderVariableActionsCollection.prototype.endVariableChange = function()
{
	return this.m_endVariableChangeAction.executeTyped();
};
oFF.OuDataProviderVariableActionsCollection.prototype.getName = function()
{
	return oFF.OuDataProviderVariableActionsCollection.NAME;
};
oFF.OuDataProviderVariableActionsCollection.prototype.releaseObject = function()
{
	this.m_startVariableChangeAction = oFF.XObjectExt.release(this.m_startVariableChangeAction);
	this.m_endVariableChangeAction = oFF.XObjectExt.release(this.m_endVariableChangeAction);
	oFF.DfOuDataProviderActionsCollection.prototype.releaseObject.call( this );
};
oFF.OuDataProviderVariableActionsCollection.prototype.setupCollection = function(actions)
{
	oFF.DfOuDataProviderActionsCollection.prototype.setupCollection.call( this , actions);
	this.m_startVariableChangeAction = this.addAction(oFF.OuDpStartVariableChangeAction.create(this.getActions()));
	this.m_endVariableChangeAction = this.addAction(oFF.OuDpEndVariableChangeAction.create(this.getActions()));
};
oFF.OuDataProviderVariableActionsCollection.prototype.startVariableChange = function()
{
	return this.m_startVariableChangeAction.executeTyped();
};

oFF.OuDataProviderVizActionsCollection = function() {};
oFF.OuDataProviderVizActionsCollection.prototype = new oFF.DfOuDataProviderActionsCollection();
oFF.OuDataProviderVizActionsCollection.prototype._ff_c = "OuDataProviderVizActionsCollection";

oFF.OuDataProviderVizActionsCollection.NAME = "VizActions";
oFF.OuDataProviderVizActionsCollection.createCollection = function(actions)
{
	let obj = new oFF.OuDataProviderVizActionsCollection();
	obj.setupCollection(actions);
	return obj;
};
oFF.OuDataProviderVizActionsCollection.prototype.m_createAction = null;
oFF.OuDataProviderVizActionsCollection.prototype.m_getActiveVizAction = null;
oFF.OuDataProviderVizActionsCollection.prototype.m_getAllVisualizationsAction = null;
oFF.OuDataProviderVizActionsCollection.prototype.m_getAllVizNamesAction = null;
oFF.OuDataProviderVizActionsCollection.prototype.m_getOrCreateAction = null;
oFF.OuDataProviderVizActionsCollection.prototype.m_getVizChartTypeAction = null;
oFF.OuDataProviderVizActionsCollection.prototype.m_removeVizAction = null;
oFF.OuDataProviderVizActionsCollection.prototype.m_setActiveVizAction = null;
oFF.OuDataProviderVizActionsCollection.prototype.m_setVizChartTypeAction = null;
oFF.OuDataProviderVizActionsCollection.prototype.m_synchronizeVizAction = null;
oFF.OuDataProviderVizActionsCollection.prototype.createVisualizationDefinition = function(vizName, vizType, protocolBindingType, chartType)
{
	return this.m_createAction.executeTyped(vizName, vizType, protocolBindingType, chartType);
};
oFF.OuDataProviderVizActionsCollection.prototype.getActiveVisualizationDefinition = function()
{
	return this.getActions().performAction(this.m_getActiveVizAction, oFF.XList.create());
};
oFF.OuDataProviderVizActionsCollection.prototype.getAllVisualizationNames = function()
{
	return this.getActions().performAction(this.m_getAllVizNamesAction, oFF.XList.create());
};
oFF.OuDataProviderVizActionsCollection.prototype.getAllVisualizations = function()
{
	return this.getActions().performAction(this.m_getAllVisualizationsAction, oFF.XList.create());
};
oFF.OuDataProviderVizActionsCollection.prototype.getName = function()
{
	return oFF.OuDataProviderVizActionsCollection.NAME;
};
oFF.OuDataProviderVizActionsCollection.prototype.getOrCreateVisualizationDefinition = function(vizName, vizType, protocolBindingType, chartType)
{
	return this.m_getOrCreateAction.executeTyped(vizName, vizType, protocolBindingType, chartType);
};
oFF.OuDataProviderVizActionsCollection.prototype.getVisualizationChartType = function(vizName)
{
	return this.m_getVizChartTypeAction.executeTyped(vizName);
};
oFF.OuDataProviderVizActionsCollection.prototype.releaseObject = function()
{
	this.m_getAllVizNamesAction = oFF.XObjectExt.release(this.m_getAllVizNamesAction);
	this.m_getAllVisualizationsAction = oFF.XObjectExt.release(this.m_getAllVisualizationsAction);
	this.m_getOrCreateAction = oFF.XObjectExt.release(this.m_getOrCreateAction);
	this.m_createAction = oFF.XObjectExt.release(this.m_createAction);
	this.m_getVizChartTypeAction = oFF.XObjectExt.release(this.m_getVizChartTypeAction);
	this.m_setVizChartTypeAction = oFF.XObjectExt.release(this.m_setVizChartTypeAction);
	this.m_getActiveVizAction = oFF.XObjectExt.release(this.m_getActiveVizAction);
	this.m_setActiveVizAction = oFF.XObjectExt.release(this.m_setActiveVizAction);
	this.m_removeVizAction = oFF.XObjectExt.release(this.m_removeVizAction);
	this.m_synchronizeVizAction = oFF.XObjectExt.release(this.m_synchronizeVizAction);
	oFF.DfOuDataProviderActionsCollection.prototype.releaseObject.call( this );
};
oFF.OuDataProviderVizActionsCollection.prototype.removeVisualizationDefinition = function(vizName)
{
	return this.m_removeVizAction.executeTyped(vizName);
};
oFF.OuDataProviderVizActionsCollection.prototype.setActiveVisualizationDefinition = function(vizName)
{
	return this.m_setActiveVizAction.executeTyped(vizName);
};
oFF.OuDataProviderVizActionsCollection.prototype.setVisualizationChartType = function(vizName, chartType)
{
	return this.m_setVizChartTypeAction.executeTyped(vizName, chartType);
};
oFF.OuDataProviderVizActionsCollection.prototype.setupCollection = function(actions)
{
	oFF.DfOuDataProviderActionsCollection.prototype.setupCollection.call( this , actions);
	this.m_getAllVizNamesAction = this.addAction(oFF.OuDpVizActionGetAllVisualizationNames.create(this.getActions()));
	this.m_getAllVisualizationsAction = this.addAction(oFF.OuDpVizActionGetAllVisualizations.create(this.getActions()));
	this.m_getOrCreateAction = this.addAction(oFF.OuDpVizActionGetOrCreateVizDefinition.create(this.getActions()));
	this.m_createAction = this.addAction(oFF.OuDpVizActionCreateVizDefinition.create(this.getActions()));
	this.m_getVizChartTypeAction = this.addAction(oFF.OuDpVizActionGetVisualizationChartType.create(this.getActions()));
	this.m_setVizChartTypeAction = this.addAction(oFF.OuDpVizActionSetVisualizationChartType.create(this.getActions()));
	this.m_getActiveVizAction = this.addAction(oFF.OuDpVizActionGetActiveVizDefinition.create(this.getActions()));
	this.m_setActiveVizAction = this.addAction(oFF.OuDpVizActionSetActiveVizDefinition.create(this.getActions()));
	this.m_removeVizAction = this.addAction(oFF.OuDpVizActionRemoveVizDefinition.create(this.getActions()));
	this.m_synchronizeVizAction = this.addAction(oFF.OuDpVizActionSynchronizeVizDefinition.create(this.getActions()));
};
oFF.OuDataProviderVizActionsCollection.prototype.synchronizeVisualizationDefinition = function(vizName)
{
	return this.m_synchronizeVizAction.executeTyped(vizName);
};

oFF.OuDataProviderAllEvent = function() {};
oFF.OuDataProviderAllEvent.prototype = new oFF.DfOuDataProviderEvent();
oFF.OuDataProviderAllEvent.prototype._ff_c = "OuDataProviderAllEvent";

oFF.OuDataProviderAllEvent.prototype.m_subEvents = null;
oFF.OuDataProviderAllEvent.prototype.addSubEvent = function(event)
{
	this.m_subEvents.add(event);
};
oFF.OuDataProviderAllEvent.prototype.canMerge = function()
{
	return false;
};
oFF.OuDataProviderAllEvent.prototype.getErrorEvent = function()
{
	return this.getEventByType(oFF.OuDataProviderEventType.ERROR);
};
oFF.OuDataProviderAllEvent.prototype.getEventByType = function(eventType)
{
	return oFF.XCollectionUtils.findFirst(this.m_subEvents, (evt) => {
		return evt.getEventType() === eventType;
	});
};
oFF.OuDataProviderAllEvent.prototype.getEventType = function()
{
	return oFF.OuDataProviderEventType.ALL;
};
oFF.OuDataProviderAllEvent.prototype.getLifecycleEvent = function()
{
	return this.getEventByType(oFF.OuDataProviderEventType.LIFECYCLE);
};
oFF.OuDataProviderAllEvent.prototype.getModelChangeEvent = function()
{
	return this.getEventByType(oFF.OuDataProviderEventType.MODEL_CHANGE);
};
oFF.OuDataProviderAllEvent.prototype.getResultDataFetchEvent = function()
{
	return this.getEventByType(oFF.OuDataProviderEventType.RESULT_DATA_FETCH);
};
oFF.OuDataProviderAllEvent.prototype.getSubEvents = function()
{
	return this.m_subEvents;
};
oFF.OuDataProviderAllEvent.prototype.getVisualizationChangeEvent = function()
{
	return this.getEventByType(oFF.OuDataProviderEventType.VISUALIZATION_CHANGE);
};
oFF.OuDataProviderAllEvent.prototype.isExternal = function()
{
	let events = this.m_subEvents.getValuesAsReadOnlyList();
	for (let i = 0; i < events.size(); i++)
	{
		if (events.get(i).isExternal())
		{
			return true;
		}
	}
	return oFF.DfOuDataProviderEvent.prototype.isExternal.call( this );
};
oFF.OuDataProviderAllEvent.prototype.mergeInternal = function(otherEvent) {};
oFF.OuDataProviderAllEvent.prototype.releaseObject = function()
{
	this.m_subEvents = oFF.XObjectExt.release(this.m_subEvents);
	oFF.DfOuDataProviderEvent.prototype.releaseObject.call( this );
};
oFF.OuDataProviderAllEvent.prototype.setupDataProviderEventExt = function()
{
	this.m_subEvents = oFF.XList.create();
};

oFF.OuDataProviderErrorEvent = function() {};
oFF.OuDataProviderErrorEvent.prototype = new oFF.DfOuDataProviderEvent();
oFF.OuDataProviderErrorEvent.prototype._ff_c = "OuDataProviderErrorEvent";

oFF.OuDataProviderErrorEvent.prototype.m_errors = null;
oFF.OuDataProviderErrorEvent.prototype.addError = function(error)
{
	this.m_errors.add(error);
	return this;
};
oFF.OuDataProviderErrorEvent.prototype.addErrors = function(error)
{
	this.m_errors.addAll(error);
	return this;
};
oFF.OuDataProviderErrorEvent.prototype.getErrors = function()
{
	return this.m_errors;
};
oFF.OuDataProviderErrorEvent.prototype.getEventType = function()
{
	return oFF.OuDataProviderEventType.ERROR;
};
oFF.OuDataProviderErrorEvent.prototype.isBuffered = function()
{
	return false;
};
oFF.OuDataProviderErrorEvent.prototype.mergeInternal = function(otherEvent)
{
	if (otherEvent.getEventType() !== this.getEventType())
	{
		return;
	}
	let otherErrorEvent = otherEvent;
	this.m_errors.addAll(otherErrorEvent.getErrors());
};
oFF.OuDataProviderErrorEvent.prototype.releaseObject = function()
{
	this.m_errors = oFF.XObjectExt.release(this.m_errors);
	oFF.DfOuDataProviderEvent.prototype.releaseObject.call( this );
};
oFF.OuDataProviderErrorEvent.prototype.setupDataProviderEventExt = function()
{
	this.m_errors = oFF.XList.create();
};

oFF.OuDataProviderLifecycleEvent = function() {};
oFF.OuDataProviderLifecycleEvent.prototype = new oFF.DfOuDataProviderEvent();
oFF.OuDataProviderLifecycleEvent.prototype._ff_c = "OuDataProviderLifecycleEvent";

oFF.OuDataProviderLifecycleEvent.prototype.m_newState = null;
oFF.OuDataProviderLifecycleEvent.prototype.m_oldState = null;
oFF.OuDataProviderLifecycleEvent.prototype.canMerge = function()
{
	return false;
};
oFF.OuDataProviderLifecycleEvent.prototype.getEventType = function()
{
	return oFF.OuDataProviderEventType.LIFECYCLE;
};
oFF.OuDataProviderLifecycleEvent.prototype.getNewState = function()
{
	return this.m_newState;
};
oFF.OuDataProviderLifecycleEvent.prototype.getOldState = function()
{
	return this.m_oldState;
};
oFF.OuDataProviderLifecycleEvent.prototype.isBuffered = function()
{
	return false;
};
oFF.OuDataProviderLifecycleEvent.prototype.isNewlyConnected = function()
{
	return oFF.notNull(this.m_oldState) && this.m_oldState.isTypeOf(oFF.OuDataProviderLifecycle.DISCONNECTED) && this.m_newState.isTypeOf(oFF.OuDataProviderLifecycle.CONNECTED);
};
oFF.OuDataProviderLifecycleEvent.prototype.mergeInternal = function(otherEvent) {};
oFF.OuDataProviderLifecycleEvent.prototype.releaseObject = function()
{
	oFF.DfOuDataProviderEvent.prototype.releaseObject.call( this );
};
oFF.OuDataProviderLifecycleEvent.prototype.setNewState = function(newState)
{
	this.m_newState = newState;
};
oFF.OuDataProviderLifecycleEvent.prototype.setOldState = function(oldState)
{
	this.m_oldState = oldState;
};
oFF.OuDataProviderLifecycleEvent.prototype.setupDataProviderEventExt = function() {};

oFF.OuDataProviderModelChangeEvent = function() {};
oFF.OuDataProviderModelChangeEvent.prototype = new oFF.DfOuDataProviderEvent();
oFF.OuDataProviderModelChangeEvent.prototype._ff_c = "OuDataProviderModelChangeEvent";

oFF.OuDataProviderModelChangeEvent.prototype.m_changedComponents = null;
oFF.OuDataProviderModelChangeEvent.prototype.addAllChangedComponents = function(changedComponents)
{
	this.m_changedComponents.addAll(changedComponents);
};
oFF.OuDataProviderModelChangeEvent.prototype.addChangedComponent = function(changedComponent)
{
	this.m_changedComponents.add(changedComponent);
};
oFF.OuDataProviderModelChangeEvent.prototype.getChangedComponents = function()
{
	return this.m_changedComponents;
};
oFF.OuDataProviderModelChangeEvent.prototype.getEventType = function()
{
	return oFF.OuDataProviderEventType.MODEL_CHANGE;
};
oFF.OuDataProviderModelChangeEvent.prototype.hasAnyComponentChanged = function()
{
	return this.m_changedComponents.hasElements();
};
oFF.OuDataProviderModelChangeEvent.prototype.hasComponentChanged = function(componentType)
{
	return this.m_changedComponents.contains(componentType);
};
oFF.OuDataProviderModelChangeEvent.prototype.hasComponentOrParentChanged = function(componentType)
{
	return oFF.XCollectionUtils.contains(this.m_changedComponents, (changedComponent) => {
		return changedComponent.isTypeOf(componentType);
	});
};
oFF.OuDataProviderModelChangeEvent.prototype.mergeInternal = function(otherEvent)
{
	if (otherEvent.getEventType() !== this.getEventType())
	{
		return;
	}
	let otherModelEvent = otherEvent;
	this.m_changedComponents.addAll(otherModelEvent.getChangedComponents());
};
oFF.OuDataProviderModelChangeEvent.prototype.releaseObject = function()
{
	this.m_changedComponents = oFF.XObjectExt.release(this.m_changedComponents);
	oFF.DfOuDataProviderEvent.prototype.releaseObject.call( this );
};
oFF.OuDataProviderModelChangeEvent.prototype.setupDataProviderEventExt = function()
{
	this.m_changedComponents = oFF.XSetOfNameObject.create();
};

oFF.OuDataProviderModelStateEvent = function() {};
oFF.OuDataProviderModelStateEvent.prototype = new oFF.DfOuDataProviderEvent();
oFF.OuDataProviderModelStateEvent.prototype._ff_c = "OuDataProviderModelStateEvent";

oFF.OuDataProviderModelStateEvent.prototype.m_newState = null;
oFF.OuDataProviderModelStateEvent.prototype.canMerge = function()
{
	return false;
};
oFF.OuDataProviderModelStateEvent.prototype.getEventType = function()
{
	return oFF.OuDataProviderEventType.MODEL_STATE;
};
oFF.OuDataProviderModelStateEvent.prototype.getNewState = function()
{
	return this.m_newState;
};
oFF.OuDataProviderModelStateEvent.prototype.isBuffered = function()
{
	return false;
};
oFF.OuDataProviderModelStateEvent.prototype.mergeInternal = function(otherEvent) {};
oFF.OuDataProviderModelStateEvent.prototype.releaseObject = function()
{
	this.m_newState = null;
	oFF.DfOuDataProviderEvent.prototype.releaseObject.call( this );
};
oFF.OuDataProviderModelStateEvent.prototype.setNewState = function(state)
{
	this.m_newState = state;
};
oFF.OuDataProviderModelStateEvent.prototype.setupDataProviderEventExt = function() {};

oFF.OuDataProviderResultDataFetchEvent = function() {};
oFF.OuDataProviderResultDataFetchEvent.prototype = new oFF.DfOuDataProviderEvent();
oFF.OuDataProviderResultDataFetchEvent.prototype._ff_c = "OuDataProviderResultDataFetchEvent";

oFF.OuDataProviderResultDataFetchEvent.prototype.m_filledVisualizationNames = null;
oFF.OuDataProviderResultDataFetchEvent.prototype.m_messageManager = null;
oFF.OuDataProviderResultDataFetchEvent.prototype.m_step = null;
oFF.OuDataProviderResultDataFetchEvent.prototype.addFilledVisualizationName = function(vizName)
{
	this.m_filledVisualizationNames.add(vizName);
	return this;
};
oFF.OuDataProviderResultDataFetchEvent.prototype.addFilledVisualizationNames = function(vizNames)
{
	this.m_filledVisualizationNames.addAll(vizNames);
	return this;
};
oFF.OuDataProviderResultDataFetchEvent.prototype.addMessages = function(messages)
{
	this.m_messageManager.addAllMessages(messages);
	return this;
};
oFF.OuDataProviderResultDataFetchEvent.prototype.canMerge = function()
{
	return false;
};
oFF.OuDataProviderResultDataFetchEvent.prototype.getEventType = function()
{
	return oFF.OuDataProviderEventType.RESULT_DATA_FETCH;
};
oFF.OuDataProviderResultDataFetchEvent.prototype.getFilledVisualizationNames = function()
{
	return this.m_filledVisualizationNames;
};
oFF.OuDataProviderResultDataFetchEvent.prototype.getMessages = function()
{
	return this.m_messageManager;
};
oFF.OuDataProviderResultDataFetchEvent.prototype.getStep = function()
{
	return this.m_step;
};
oFF.OuDataProviderResultDataFetchEvent.prototype.isBuffered = function()
{
	return false;
};
oFF.OuDataProviderResultDataFetchEvent.prototype.mergeInternal = function(otherEvent) {};
oFF.OuDataProviderResultDataFetchEvent.prototype.releaseObject = function()
{
	this.m_step = null;
	this.m_messageManager = oFF.XObjectExt.release(this.m_messageManager);
	this.m_filledVisualizationNames = oFF.XObjectExt.release(this.m_filledVisualizationNames);
	oFF.DfOuDataProviderEvent.prototype.releaseObject.call( this );
};
oFF.OuDataProviderResultDataFetchEvent.prototype.setStep = function(step)
{
	this.m_step = step;
	return this;
};
oFF.OuDataProviderResultDataFetchEvent.prototype.setupDataProviderEventExt = function()
{
	this.m_messageManager = oFF.MessageManagerSimple.createMessageManager();
	this.m_filledVisualizationNames = oFF.XList.create();
};

oFF.OuDataProviderVisualizationChangeEvent = function() {};
oFF.OuDataProviderVisualizationChangeEvent.prototype = new oFF.DfOuDataProviderEvent();
oFF.OuDataProviderVisualizationChangeEvent.prototype._ff_c = "OuDataProviderVisualizationChangeEvent";

oFF.OuDataProviderVisualizationChangeEvent.prototype.m_changedVisualizations = null;
oFF.OuDataProviderVisualizationChangeEvent.prototype.addAllChangedVisualizationNames = function(changedVisualizations)
{
	this.m_changedVisualizations.addAll(changedVisualizations);
};
oFF.OuDataProviderVisualizationChangeEvent.prototype.addChangedVisualizationName = function(changedVisualization)
{
	this.m_changedVisualizations.add(changedVisualization);
};
oFF.OuDataProviderVisualizationChangeEvent.prototype.getChangedVisualizationNames = function()
{
	return this.m_changedVisualizations;
};
oFF.OuDataProviderVisualizationChangeEvent.prototype.getEventType = function()
{
	return oFF.OuDataProviderEventType.VISUALIZATION_CHANGE;
};
oFF.OuDataProviderVisualizationChangeEvent.prototype.mergeInternal = function(otherEvent)
{
	if (otherEvent.getEventType() !== this.getEventType())
	{
		return;
	}
	let otherVizEvent = otherEvent;
	this.m_changedVisualizations.addAll(otherVizEvent.getChangedVisualizationNames());
};
oFF.OuDataProviderVisualizationChangeEvent.prototype.releaseObject = function()
{
	this.m_changedVisualizations = oFF.XObjectExt.release(this.m_changedVisualizations);
	oFF.DfOuDataProviderEvent.prototype.releaseObject.call( this );
};
oFF.OuDataProviderVisualizationChangeEvent.prototype.setupDataProviderEventExt = function()
{
	this.m_changedVisualizations = oFF.XHashSetOfString.create();
};

oFF.OuDataProvider = function() {};
oFF.OuDataProvider.prototype = new oFF.XObject();
oFF.OuDataProvider.prototype._ff_c = "OuDataProvider";

oFF.OuDataProvider.createDataProvider = function(config)
{
	let obj = new oFF.OuDataProvider();
	obj.setupDataProvider(null, config);
	return obj;
};
oFF.OuDataProvider.createDataProviderWithQueryManager = function(queryManager, config)
{
	let obj = new oFF.OuDataProvider();
	obj.setupDataProvider(queryManager, config);
	return obj;
};
oFF.OuDataProvider.prototype.m_actions = null;
oFF.OuDataProvider.prototype.m_config = null;
oFF.OuDataProvider.prototype.m_connector = null;
oFF.OuDataProvider.prototype.m_createdAt = 0;
oFF.OuDataProvider.prototype.m_eventing = null;
oFF.OuDataProvider.prototype.m_hooks = null;
oFF.OuDataProvider.prototype.m_isReleasing = false;
oFF.OuDataProvider.prototype.m_lifecycle = null;
oFF.OuDataProvider.prototype.m_logger = null;
oFF.OuDataProvider.prototype.m_name = null;
oFF.OuDataProvider.prototype.m_notificationCenter = null;
oFF.OuDataProvider.prototype.m_queryManager = null;
oFF.OuDataProvider.prototype.m_queryManagerCreationPromise = null;
oFF.OuDataProvider.prototype.m_resulting = null;
oFF.OuDataProvider.prototype.getActions = function()
{
	return this.m_actions;
};
oFF.OuDataProvider.prototype.getApplication = function()
{
	return this.m_config.getApplication();
};
oFF.OuDataProvider.prototype.getBasicActions = function()
{
	return this.m_actions;
};
oFF.OuDataProvider.prototype.getCc = function()
{
	return oFF.notNull(this.m_queryManager) ? this.m_queryManager.getConvenienceCommands() : null;
};
oFF.OuDataProvider.prototype.getConfig = function()
{
	return this.m_config;
};
oFF.OuDataProvider.prototype.getConnection = function()
{
	return this.m_connector.getCurrentConnected();
};
oFF.OuDataProvider.prototype.getConnector = function()
{
	return this.m_connector;
};
oFF.OuDataProvider.prototype.getConnectorBase = function()
{
	return this.m_connector;
};
oFF.OuDataProvider.prototype.getCreatedAt = function()
{
	return this.m_createdAt;
};
oFF.OuDataProvider.prototype.getDataSourceName = function()
{
	let currentlyConnectedConfig = this.m_connector.getCurrentConnected();
	if (oFF.isNull(currentlyConnectedConfig))
	{
		return null;
	}
	return currentlyConnectedConfig.getDataSourceName();
};
oFF.OuDataProvider.prototype.getEventing = function()
{
	return this.m_eventing;
};
oFF.OuDataProvider.prototype.getEventingBase = function()
{
	return this.m_eventing;
};
oFF.OuDataProvider.prototype.getHooks = function()
{
	return this.m_hooks;
};
oFF.OuDataProvider.prototype.getHooksBase = function()
{
	return this.m_hooks;
};
oFF.OuDataProvider.prototype.getLifecycle = function()
{
	return this.m_lifecycle;
};
oFF.OuDataProvider.prototype.getLogger = function()
{
	return this.m_logger;
};
oFF.OuDataProvider.prototype.getLoggerBase = function()
{
	return this.m_logger;
};
oFF.OuDataProvider.prototype.getName = function()
{
	return this.m_name;
};
oFF.OuDataProvider.prototype.getNotificationCenter = function()
{
	return this.m_notificationCenter;
};
oFF.OuDataProvider.prototype.getOrCreateQueryManager = function()
{
	if (oFF.notNull(this.m_queryManager) && !this.m_queryManager.isReleased())
	{
		return oFF.XPromise.resolve(this.m_queryManager);
	}
	if (oFF.notNull(this.m_queryManagerCreationPromise) && this.m_queryManagerCreationPromise.getState() !== oFF.XPromiseState.FULFILLED)
	{
		return this.m_queryManagerCreationPromise;
	}
	this.m_queryManagerCreationPromise = this.getActions().getLifecycleActions().connectDataProvider(null, false).onThenExt((empty) => {
		return this.m_queryManager;
	});
	return this.m_queryManagerCreationPromise;
};
oFF.OuDataProvider.prototype.getQueryManager = function()
{
	if (oFF.isNull(this.m_queryManager) || this.m_queryManager.isReleased())
	{
		return null;
	}
	return this.m_queryManager;
};
oFF.OuDataProvider.prototype.getResulting = function()
{
	return this.m_resulting;
};
oFF.OuDataProvider.prototype.getResultingBase = function()
{
	return this.m_resulting;
};
oFF.OuDataProvider.prototype.getState = function()
{
	if (!this.m_actions.getRunningActionPromises().isEmpty())
	{
		return oFF.OuDataProviderState.PROCESSING;
	}
	return oFF.OuDataProviderState.IN_SYNC;
};
oFF.OuDataProvider.prototype.getStringActions = function()
{
	return this.getActions();
};
oFF.OuDataProvider.prototype.getSystemName = function()
{
	let currentlyConnectedConfig = this.m_connector.getCurrentConnected();
	if (oFF.isNull(currentlyConnectedConfig))
	{
		return null;
	}
	return currentlyConnectedConfig.getSystemName();
};
oFF.OuDataProvider.prototype.getType = function()
{
	return oFF.DataProviderType.OLAP;
};
oFF.OuDataProvider.prototype.isAutoSubmitEffective = function()
{
	let queryManager = this.getQueryManager();
	if (oFF.isNull(this.m_queryManager) || !this.m_config.isAutoSubmitEnabled())
	{
		return false;
	}
	return queryManager.getModelCapabilities().supportsAutoVariableSubmit() || queryManager.isDirectVariableTransferEnabled();
};
oFF.OuDataProvider.prototype.isReleasing = function()
{
	return this.m_isReleasing;
};
oFF.OuDataProvider.prototype.releaseObject = function()
{
	this.m_lifecycle = null;
	this.m_name = null;
	this.m_queryManager = null;
	this.m_config = oFF.XObjectExt.release(this.m_config);
	this.m_createdAt = -1;
	this.m_logger = oFF.XObjectExt.release(this.m_logger);
	this.m_connector = oFF.XObjectExt.release(this.m_connector);
	this.m_eventing = oFF.XObjectExt.release(this.m_eventing);
	this.m_actions = oFF.XObjectExt.release(this.m_actions);
	this.m_resulting = oFF.XObjectExt.release(this.m_resulting);
	this.m_hooks = oFF.XObjectExt.release(this.m_hooks);
	this.m_notificationCenter = oFF.XObjectExt.release(this.m_notificationCenter);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuDataProvider.prototype.setConfig = function(config)
{
	if (oFF.isNull(config))
	{
		this.m_config = oFF.OuDataProviderConfiguration.createConfigForEmptyDataProvider(this.m_config.getApplication());
	}
	else
	{
		this.m_config = config;
	}
};
oFF.OuDataProvider.prototype.setConnection = function(connection)
{
	let newConnection = connection;
	if (oFF.isNull(newConnection))
	{
		newConnection = oFF.OuDataProviderConnection.createConnection(this.m_config.getApplication());
	}
	this.m_connector.setConnection(newConnection);
};
oFF.OuDataProvider.prototype.setLifecycle = function(lifecycle, correlationId)
{
	if (oFF.isNull(lifecycle) || this.m_lifecycle === lifecycle)
	{
		return;
	}
	let oldLifecycle = this.m_lifecycle;
	this.m_lifecycle = lifecycle;
	let lifeEvt = this.m_eventing.getEmitterForLifecycle().newTypedEvent();
	lifeEvt.setCorrelationId(correlationId);
	lifeEvt.setOldState(oldLifecycle);
	lifeEvt.setNewState(this.m_lifecycle);
	lifeEvt.queue();
};
oFF.OuDataProvider.prototype.setQueryManager = function(queryManager)
{
	if (this.m_queryManager === queryManager)
	{
		return;
	}
	this.m_eventing.setQueryManager(queryManager);
	this.m_queryManager = queryManager;
};
oFF.OuDataProvider.prototype.setupDataProvider = function(queryManager, config)
{
	oFF.XObject.prototype.setup.call( this );
	this.m_queryManager = queryManager;
	this.m_config = config;
	this.m_createdAt = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
	this.m_name = this.m_config.getDataProviderName() !== null ? this.m_config.getDataProviderName() : oFF.XGuid.getGuid();
	this.m_hooks = oFF.OuDataProviderHooks.createHooksWithOther(this.m_config.getHooks());
	let startConnectionConfiguration = this.m_config.getStartConnection();
	this.m_connector = oFF.OuDataProviderConnector.create(this);
	this.m_connector.setConnection(startConnectionConfiguration);
	this.m_logger = oFF.OuDataProviderLogger.createActionsLogger(this.m_config.getApplication().getSession(), this.m_config.isForceLoggingEnabled());
	this.m_actions = oFF.OuDataProviderActions.createDataProviderActions(this);
	this.m_eventing = oFF.OuDataProviderEventing.createEventing(this, this.m_queryManager);
	this.m_resulting = oFF.OuDataProviderResulting.create(this);
	this.m_resulting.setAutoFetchActiveInternal(startConnectionConfiguration.isStartWithAutoFetch());
	this.m_notificationCenter = oFF.XNotificationCenter.create();
	this.updateLifecycle(oFF.XGuid.getGuid());
	if (this.m_config.shouldAddToDataProviderPool())
	{
		let dataProviderPool = this.getApplication().getProcess().getDataProviderPool();
		if (oFF.notNull(dataProviderPool))
		{
			dataProviderPool.addDataProvider(this);
		}
	}
};
oFF.OuDataProvider.prototype.startRelease = function()
{
	if (this.m_isReleasing)
	{
		return;
	}
	this.m_isReleasing = true;
	if (this.m_config.shouldAddToDataProviderPool())
	{
		let dataProviderPool = this.getApplication().getProcess().getDataProviderPool();
		if (oFF.notNull(dataProviderPool))
		{
			dataProviderPool.removeDataProviderByName(this.getName());
		}
	}
	oFF.XTimeout.timeout(5, () => {
		let promiseList = oFF.XPromiseList.createFromList(this.m_actions.getRunningActionPromises());
		let allPromise = oFF.XPromise.all(promiseList);
		allPromise.onFinally(() => {
			this.setLifecycle(oFF.OuDataProviderLifecycle.RELEASED, null);
			this.m_eventing.flushEventQueue();
			oFF.XObjectExt.release(this);
		});
	});
};
oFF.OuDataProvider.prototype.toString = function()
{
	if (this.isReleased())
	{
		return "released";
	}
	let buffer = oFF.XStringBuffer.create();
	buffer.append(this.getConnection().getSystemName());
	buffer.append("~");
	buffer.append(this.getConnection().getDataSourceName());
	buffer.append(this.getDataSourceName());
	if (oFF.notNull(this.m_queryManager))
	{
		buffer.append("~").append(this.m_queryManager.getInstanceId());
	}
	buffer.append("~").append(this.getState().getName());
	return buffer.toString();
};
oFF.OuDataProvider.prototype.updateLifecycle = function(correlationId)
{
	if (this.isReleasing() || this.isReleased())
	{
		this.setLifecycle(oFF.OuDataProviderLifecycle.RELEASED, correlationId);
		return;
	}
	let lifecycle = oFF.notNull(this.m_queryManager) ? oFF.OuDataProviderLifecycle.CONNECTED : oFF.OuDataProviderLifecycle.DISCONNECTED;
	this.setLifecycle(lifecycle, correlationId);
};

oFF.OuDataProviderActions = function() {};
oFF.OuDataProviderActions.prototype = new oFF.XObject();
oFF.OuDataProviderActions.prototype._ff_c = "OuDataProviderActions";

oFF.OuDataProviderActions.createDataProviderActions = function(dataProvider)
{
	let obj = new oFF.OuDataProviderActions();
	obj.setupDataProviderActions(dataProvider);
	return obj;
};
oFF.OuDataProviderActions.prototype.m_actionChainActive = false;
oFF.OuDataProviderActions.prototype.m_actionChainId = null;
oFF.OuDataProviderActions.prototype.m_actions = null;
oFF.OuDataProviderActions.prototype.m_actionsCollections = null;
oFF.OuDataProviderActions.prototype.m_dataProvider = null;
oFF.OuDataProviderActions.prototype.m_endActionChainWhenReady = false;
oFF.OuDataProviderActions.prototype.m_runningActionPromises = null;
oFF.OuDataProviderActions.prototype.m_validator = null;
oFF.OuDataProviderActions.prototype.addActionPromise = function(correlationId, promise)
{
	let eventingBase = this.m_dataProvider.getEventingBase();
	promise.onThen((result) => {
		this.handleActionPromiseEnd();
		eventingBase.setActionChanges(correlationId, result.getChanges());
		eventingBase.finalizeActionChanges();
	}).onCatch((err) => {
		this.handleActionPromiseEnd();
		if (oFF.notNull(err) && err.getErrorType() !== oFF.DataProviderErrorType.ACTION_MANIFEST_VALIDATION)
		{
			let errorEvt = eventingBase.getEmitterForError().newTypedEvent();
			errorEvt.setCorrelationId(correlationId);
			errorEvt.addError(err);
			errorEvt.queue();
		}
	});
};
oFF.OuDataProviderActions.prototype.addStringAction = function(action)
{
	let actionName = action.getName();
	if (this.m_actions.containsKey(actionName))
	{
		let errorMessage = oFF.XStringUtils.concatenate2("action already exists with name: ", actionName);
		throw oFF.XException.createIllegalArgumentException(errorMessage);
	}
	this.m_actions.add(action);
};
oFF.OuDataProviderActions.prototype.endActionChain = function()
{
	this.m_actionChainActive = false;
	this.m_actionChainId = null;
	if (this.m_runningActionPromises.hasElements())
	{
		this.m_endActionChainWhenReady = true;
	}
	else
	{
		this.m_dataProvider.getEventingBase().setEventingPaused(false);
	}
};
oFF.OuDataProviderActions.prototype.executeActionByName = function(actionName, parameters)
{
	let action = this.m_actions.getByKey(actionName);
	if (oFF.isNull(action))
	{
		return oFF.XPromise.reject(oFF.XError.create(oFF.XStringUtils.concatenate2("no action found with name: ", actionName)));
	}
	let params = oFF.notNull(parameters) ? parameters : oFF.XList.create();
	return this.performAction(action, params);
};
oFF.OuDataProviderActions.prototype.getActionCollectionByName = function(name)
{
	return this.m_actionsCollections.getByKey(name);
};
oFF.OuDataProviderActions.prototype.getActionManifest = function(name)
{
	return oFF.OuDataProviderActionManifestRegistry.getInstance().getActionManifest(name);
};
oFF.OuDataProviderActions.prototype.getActionManifests = function()
{
	return oFF.OuDataProviderActionManifestRegistry.getInstance().getActionManifests().getValuesAsReadOnlyList();
};
oFF.OuDataProviderActions.prototype.getAnalysisActions = function()
{
	return this.getActionCollectionByName(oFF.OuDataProviderAnalysisActionsCollection.NAME);
};
oFF.OuDataProviderActions.prototype.getAxisActions = function()
{
	return this.getActionCollectionByName(oFF.OuDataProviderAxisActionsCollection.NAME);
};
oFF.OuDataProviderActions.prototype.getBasicLifecycleActions = function()
{
	return this.getActionCollectionByName(oFF.OuDataProviderLifecycleActionsCollection.NAME);
};
oFF.OuDataProviderActions.prototype.getDataProvider = function()
{
	return this.m_dataProvider;
};
oFF.OuDataProviderActions.prototype.getDimensionActions = function()
{
	return this.getActionCollectionByName(oFF.OuDataProviderDimensionActionsCollection.NAME);
};
oFF.OuDataProviderActions.prototype.getFilterActions = function()
{
	return this.getActionCollectionByName(oFF.OuDataProviderFilterActionsCollection.NAME);
};
oFF.OuDataProviderActions.prototype.getHierarchyActions = function()
{
	return this.getActionCollectionByName(oFF.OuDataProviderHierarchyActionsCollection.NAME);
};
oFF.OuDataProviderActions.prototype.getLifecycleActions = function()
{
	return this.getActionCollectionByName(oFF.OuDataProviderLifecycleActionsCollection.NAME);
};
oFF.OuDataProviderActions.prototype.getPresentationActions = function()
{
	return this.getActionCollectionByName(oFF.OuDataProviderPresentationActionsCollection.NAME);
};
oFF.OuDataProviderActions.prototype.getQueryModelActions = function()
{
	return this.getActionCollectionByName(oFF.OuDataProviderQueryModelActionsCollection.NAME);
};
oFF.OuDataProviderActions.prototype.getReadModeActions = function()
{
	return this.getActionCollectionByName(oFF.OuDataProviderReadModeActionsCollection.NAME);
};
oFF.OuDataProviderActions.prototype.getResultSetActions = function()
{
	return this.getActionCollectionByName(oFF.OuDataProviderResultSetActionsCollection.NAME);
};
oFF.OuDataProviderActions.prototype.getRunningActionPromises = function()
{
	return this.m_runningActionPromises;
};
oFF.OuDataProviderActions.prototype.getSerializationActions = function()
{
	return this.getActionCollectionByName(oFF.OuDataProviderSerializationActionsCollection.NAME);
};
oFF.OuDataProviderActions.prototype.getSuppressionActions = function()
{
	return this.getActionCollectionByName(oFF.OuDataProviderSuppressionActionsCollection.NAME);
};
oFF.OuDataProviderActions.prototype.getTotalsActions = function()
{
	return this.getActionCollectionByName(oFF.OuDataProviderTotalsActionsCollection.NAME);
};
oFF.OuDataProviderActions.prototype.getVariableActions = function()
{
	return this.getActionCollectionByName(oFF.OuDataProviderVariableActionsCollection.NAME);
};
oFF.OuDataProviderActions.prototype.getVisualizationActions = function()
{
	return this.getActionCollectionByName(oFF.OuDataProviderVizActionsCollection.NAME);
};
oFF.OuDataProviderActions.prototype.handleActionManifestValidation = function(actionName, parameters)
{
	return oFF.XPromise.create((resolve, reject) => {
		let messageCollection = this.m_validator.validateParameters(actionName, parameters);
		if (messageCollection.hasErrors())
		{
			let errorEvent = this.m_dataProvider.getEventingBase().getEmitterForError().newTypedEvent();
			oFF.XCollectionUtils.forEach(messageCollection.getErrors(), (error) => {
				errorEvent.addError(oFF.XError.createWithMessage(error));
			});
			errorEvent.queue();
			let condensedError = oFF.MessageUtil.condenseMessagesToSingleError(messageCollection);
			condensedError.setErrorType(oFF.DataProviderErrorType.ACTION_MANIFEST_VALIDATION);
			reject(condensedError);
			return;
		}
		let logger = this.m_dataProvider.getLoggerBase();
		let messages = messageCollection.getMessages();
		if (messages.hasElements())
		{
			oFF.XCollectionUtils.forEach(messages, (message) => {
				logger.logMessage(message);
			});
		}
		resolve(oFF.XBooleanValue.create(true));
	});
};
oFF.OuDataProviderActions.prototype.handleActionPromiseEnd = function()
{
	for (let i = this.m_runningActionPromises.size() - 1; i >= 0; i--)
	{
		let actionPromise = this.m_runningActionPromises.get(i);
		if (actionPromise.isSettled())
		{
			this.m_runningActionPromises.removeAt(i);
		}
	}
	if (this.m_runningActionPromises.isEmpty() && this.m_endActionChainWhenReady)
	{
		this.m_endActionChainWhenReady = false;
		this.m_dataProvider.getEventingBase().setEventingPaused(false);
	}
};
oFF.OuDataProviderActions.prototype.handleQmSetup = function(action)
{
	if (action.isQueryManagerNeeded())
	{
		return this.m_dataProvider.getOrCreateQueryManager();
	}
	return oFF.XPromise.resolve(null);
};
oFF.OuDataProviderActions.prototype.hasAction = function(actionName)
{
	return this.m_actions.containsKey(actionName);
};
oFF.OuDataProviderActions.prototype.performAction = function(action, parameters)
{
	if (this.getDataProvider().isReleasing())
	{
		let earlyResult = null;
		return oFF.XPromise.resolve(earlyResult);
	}
	let correlationId = this.m_actionChainActive ? this.m_actionChainId : oFF.XGuid.getGuid();
	let actionName = action.getName();
	this.m_dataProvider.getLoggerBase().logActionParams(correlationId, actionName, parameters.getValuesAsReadOnlyList());
	let parametersWithDefaults = this.m_validator.applyDefaultValues(actionName, parameters);
	let actionPromise = this.handleQmSetup(action).onThenPromise((qm) => {
		return this.handleActionManifestValidation(actionName, parametersWithDefaults);
	}).onThenPromise((valid) => {
		return action.execute(parametersWithDefaults);
	});
	this.addActionPromise(correlationId, actionPromise);
	return actionPromise.onThenExt((result) => {
		return result.getReturnValue();
	});
};
oFF.OuDataProviderActions.prototype.releaseObject = function()
{
	this.m_dataProvider = null;
	this.m_runningActionPromises = oFF.XObjectExt.release(this.m_runningActionPromises);
	this.m_actions = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_actions);
	this.m_actionsCollections = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_actionsCollections);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuDataProviderActions.prototype.setupDataProviderActions = function(dataProvider)
{
	oFF.XObject.prototype.setup.call( this );
	this.m_dataProvider = dataProvider;
	this.m_validator = oFF.OuDataProviderActionValidator.create(this.m_dataProvider);
	this.m_runningActionPromises = oFF.XList.create();
	this.m_actionsCollections = oFF.XListOfNameObject.create();
	this.m_actions = oFF.XListOfNameObject.create();
	this.m_actionsCollections.add(oFF.OuDataProviderLifecycleActionsCollection.createCollection(this));
	this.m_actionsCollections.add(oFF.OuDataProviderAxisActionsCollection.createCollection(this));
	this.m_actionsCollections.add(oFF.OuDataProviderDimensionActionsCollection.createCollection(this));
	this.m_actionsCollections.add(oFF.OuDataProviderVizActionsCollection.createCollection(this));
	this.m_actionsCollections.add(oFF.OuDataProviderResultSetActionsCollection.createCollection(this));
	this.m_actionsCollections.add(oFF.OuDataProviderFilterActionsCollection.createCollection(this));
	this.m_actionsCollections.add(oFF.OuDataProviderAnalysisActionsCollection.createCollection(this));
	this.m_actionsCollections.add(oFF.OuDataProviderHierarchyActionsCollection.createCollection(this));
	this.m_actionsCollections.add(oFF.OuDataProviderPresentationActionsCollection.createCollection(this));
	this.m_actionsCollections.add(oFF.OuDataProviderTotalsActionsCollection.createCollection(this));
	this.m_actionsCollections.add(oFF.OuDataProviderReadModeActionsCollection.createCollection(this));
	this.m_actionsCollections.add(oFF.OuDataProviderSerializationActionsCollection.createCollection(this));
	this.m_actionsCollections.add(oFF.OuDataProviderSuppressionActionsCollection.createCollection(this));
	this.m_actionsCollections.add(oFF.OuDataProviderQueryModelActionsCollection.createCollection(this));
	this.m_actionsCollections.add(oFF.OuDataProviderVariableActionsCollection.createCollection(this));
	let allActionClasses = oFF.OuDataProviderActionCollectionRegistry.getAllActionCollectionClasses();
	oFF.XCollectionUtils.forEach(allActionClasses, (actionClass) => {
		let actionCollection = actionClass.newInstance(null);
		actionCollection.setupCollection(this);
		this.m_actionsCollections.add(actionCollection);
	});
};
oFF.OuDataProviderActions.prototype.startActionChain = function()
{
	this.m_actionChainActive = true;
	this.m_actionChainId = oFF.XGuid.getGuid();
	this.m_dataProvider.getEventingBase().setEventingPaused(true);
};

oFF.OuDataProviderModelState = function() {};
oFF.OuDataProviderModelState.prototype = new oFF.XConstant();
oFF.OuDataProviderModelState.prototype._ff_c = "OuDataProviderModelState";

oFF.OuDataProviderModelState.QUERY = null;
oFF.OuDataProviderModelState.VARIABLE = null;
oFF.OuDataProviderModelState.staticSetup = function()
{
	oFF.OuDataProviderModelState.QUERY = oFF.XConstant.setupName(new oFF.OuDataProviderModelState(), "Query");
	oFF.OuDataProviderModelState.VARIABLE = oFF.XConstant.setupName(new oFF.OuDataProviderModelState(), "Variable");
};

oFF.OuDataProviderState = function() {};
oFF.OuDataProviderState.prototype = new oFF.XConstant();
oFF.OuDataProviderState.prototype._ff_c = "OuDataProviderState";

oFF.OuDataProviderState.IN_SYNC = null;
oFF.OuDataProviderState.IN_SYNC_WITH_ERROR = null;
oFF.OuDataProviderState.PROCESSING = null;
oFF.OuDataProviderState.staticSetup = function()
{
	oFF.OuDataProviderState.IN_SYNC = oFF.XConstant.setupName(new oFF.OuDataProviderState(), "InSync");
	oFF.OuDataProviderState.IN_SYNC_WITH_ERROR = oFF.XConstant.setupName(new oFF.OuDataProviderState(), "InSyncWithError");
	oFF.OuDataProviderState.PROCESSING = oFF.XConstant.setupName(new oFF.OuDataProviderState(), "Processing");
};

oFF.OdpDfActionProperty = function() {};
oFF.OdpDfActionProperty.prototype = new oFF.DfCoProperty();
oFF.OdpDfActionProperty.prototype._ff_c = "OdpDfActionProperty";


oFF.OuDataProviderEventType = function() {};
oFF.OuDataProviderEventType.prototype = new oFF.XConstant();
oFF.OuDataProviderEventType.prototype._ff_c = "OuDataProviderEventType";

oFF.OuDataProviderEventType.ALL = null;
oFF.OuDataProviderEventType.ERROR = null;
oFF.OuDataProviderEventType.LIFECYCLE = null;
oFF.OuDataProviderEventType.MODEL_CHANGE = null;
oFF.OuDataProviderEventType.MODEL_STATE = null;
oFF.OuDataProviderEventType.RESULT_DATA_FETCH = null;
oFF.OuDataProviderEventType.VISUALIZATION_CHANGE = null;
oFF.OuDataProviderEventType.create = function(name)
{
	let object = new oFF.OuDataProviderEventType();
	object.setupConstant(name);
	return object;
};
oFF.OuDataProviderEventType.staticSetup = function()
{
	oFF.OuDataProviderEventType.ALL = oFF.OuDataProviderEventType.create("All");
	oFF.OuDataProviderEventType.ERROR = oFF.OuDataProviderEventType.create("Error");
	oFF.OuDataProviderEventType.LIFECYCLE = oFF.OuDataProviderEventType.create("Lifecycle");
	oFF.OuDataProviderEventType.MODEL_STATE = oFF.OuDataProviderEventType.create("ModelState");
	oFF.OuDataProviderEventType.MODEL_CHANGE = oFF.OuDataProviderEventType.create("ModelChange");
	oFF.OuDataProviderEventType.VISUALIZATION_CHANGE = oFF.OuDataProviderEventType.create("VizChange");
	oFF.OuDataProviderEventType.RESULT_DATA_FETCH = oFF.OuDataProviderEventType.create("ResultDataFetch");
};

oFF.OuDataProviderResultDataFetchStep = function() {};
oFF.OuDataProviderResultDataFetchStep.prototype = new oFF.XConstant();
oFF.OuDataProviderResultDataFetchStep.prototype._ff_c = "OuDataProviderResultDataFetchStep";

oFF.OuDataProviderResultDataFetchStep.ALL_DONE = null;
oFF.OuDataProviderResultDataFetchStep.AUTO_FETCH_DISABLED = null;
oFF.OuDataProviderResultDataFetchStep.FETCH_STARTED = null;
oFF.OuDataProviderResultDataFetchStep.GRID_COLLECTED = null;
oFF.OuDataProviderResultDataFetchStep.QUERY_EXECUTED = null;
oFF.OuDataProviderResultDataFetchStep.VISUALIZATION_FILLED = null;
oFF.OuDataProviderResultDataFetchStep.createStep = function(name)
{
	return oFF.XConstant.setupName(new oFF.OuDataProviderResultDataFetchStep(), name);
};
oFF.OuDataProviderResultDataFetchStep.staticSetup = function()
{
	oFF.OuDataProviderResultDataFetchStep.AUTO_FETCH_DISABLED = oFF.OuDataProviderResultDataFetchStep.createStep("AutoFetchDisabled");
	oFF.OuDataProviderResultDataFetchStep.FETCH_STARTED = oFF.OuDataProviderResultDataFetchStep.createStep("FetchStarted");
	oFF.OuDataProviderResultDataFetchStep.QUERY_EXECUTED = oFF.OuDataProviderResultDataFetchStep.createStep("QueryExecuted");
	oFF.OuDataProviderResultDataFetchStep.GRID_COLLECTED = oFF.OuDataProviderResultDataFetchStep.createStep("GridCollected");
	oFF.OuDataProviderResultDataFetchStep.VISUALIZATION_FILLED = oFF.OuDataProviderResultDataFetchStep.createStep("VisualizationFilled");
	oFF.OuDataProviderResultDataFetchStep.ALL_DONE = oFF.OuDataProviderResultDataFetchStep.createStep("AllDone");
};

oFF.OuDataProviderEventing = function() {};
oFF.OuDataProviderEventing.prototype = new oFF.XObject();
oFF.OuDataProviderEventing.prototype._ff_c = "OuDataProviderEventing";

oFF.OuDataProviderEventing.createEventing = function(dataProvider, queryManager)
{
	let obj = new oFF.OuDataProviderEventing();
	obj.setupExt(dataProvider, queryManager);
	return obj;
};
oFF.OuDataProviderEventing.prototype.m_changes = null;
oFF.OuDataProviderEventing.prototype.m_dataProvider = null;
oFF.OuDataProviderEventing.prototype.m_emitters = null;
oFF.OuDataProviderEventing.prototype.m_eventLoop = null;
oFF.OuDataProviderEventing.prototype.m_listeners = null;
oFF.OuDataProviderEventing.prototype.m_queryManager = null;
oFF.OuDataProviderEventing.prototype.m_triggerResult = false;
oFF.OuDataProviderEventing.prototype.finalizeActionChanges = function()
{
	let changes = this.m_changes;
	this.m_changes = oFF.OuDataProviderActionChanges.create();
	if (changes.getChangedEventTypes().hasElements())
	{
		if (changes.getChangedEventTypes().contains(oFF.OuDataProviderEventType.MODEL_CHANGE))
		{
			let modelEvent = this.getEmitterForModelChanges().newTypedEvent();
			modelEvent.setCorrelationId(changes.getCorrelationId());
			modelEvent.setExternalChanges(changes.isExternal());
			modelEvent.addAllChangedComponents(changes.getChangedComponentTypes());
			modelEvent.queue();
		}
		if (changes.getChangedEventTypes().contains(oFF.OuDataProviderEventType.VISUALIZATION_CHANGE))
		{
			let vizEvent = this.getEmitterForVisualizationChanges().newTypedEvent();
			vizEvent.setCorrelationId(changes.getCorrelationId());
			vizEvent.addAllChangedVisualizationNames(changes.getChangedVisualizationNames());
			vizEvent.queue();
		}
	}
};
oFF.OuDataProviderEventing.prototype.flushEventQueue = function()
{
	this.m_eventLoop.flush();
};
oFF.OuDataProviderEventing.prototype.getCorrelationIdFromEvents = function(modelEvt, lifecycleEvt)
{
	if (oFF.notNull(modelEvt) && modelEvt.getCorrelationId() !== null)
	{
		return modelEvt.getCorrelationId();
	}
	if (oFF.notNull(lifecycleEvt) && lifecycleEvt.getCorrelationId() !== null)
	{
		return lifecycleEvt.getCorrelationId();
	}
	return null;
};
oFF.OuDataProviderEventing.prototype.getEmitterForAll = function()
{
	return this.getEmitterForEventType(oFF.OuDataProviderEventType.ALL);
};
oFF.OuDataProviderEventing.prototype.getEmitterForError = function()
{
	return this.getEmitterForEventType(oFF.OuDataProviderEventType.ERROR);
};
oFF.OuDataProviderEventing.prototype.getEmitterForEventType = function(eventType)
{
	return this.m_emitters.getByKey(eventType.getName());
};
oFF.OuDataProviderEventing.prototype.getEmitterForLifecycle = function()
{
	return this.getEmitterForEventType(oFF.OuDataProviderEventType.LIFECYCLE);
};
oFF.OuDataProviderEventing.prototype.getEmitterForModelChanges = function()
{
	return this.getEmitterForEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
};
oFF.OuDataProviderEventing.prototype.getEmitterForModelState = function()
{
	return this.getEmitterForEventType(oFF.OuDataProviderEventType.MODEL_STATE);
};
oFF.OuDataProviderEventing.prototype.getEmitterForResultDataFetch = function()
{
	return this.getEmitterForEventType(oFF.OuDataProviderEventType.RESULT_DATA_FETCH);
};
oFF.OuDataProviderEventing.prototype.getEmitterForVisualizationChanges = function()
{
	return this.getEmitterForEventType(oFF.OuDataProviderEventType.VISUALIZATION_CHANGE);
};
oFF.OuDataProviderEventing.prototype.getListenerCollectionBaseForEventType = function(eventType)
{
	return this.m_listeners.getByKey(eventType.getName());
};
oFF.OuDataProviderEventing.prototype.getListenerForAll = function()
{
	return this.getListenerForEventType(oFF.OuDataProviderEventType.ALL);
};
oFF.OuDataProviderEventing.prototype.getListenerForError = function()
{
	return this.getListenerForEventType(oFF.OuDataProviderEventType.ERROR);
};
oFF.OuDataProviderEventing.prototype.getListenerForEventType = function(eventType)
{
	return this.m_listeners.getByKey(eventType.getName()).getListener();
};
oFF.OuDataProviderEventing.prototype.getListenerForLifecycle = function()
{
	return this.getListenerForEventType(oFF.OuDataProviderEventType.LIFECYCLE);
};
oFF.OuDataProviderEventing.prototype.getListenerForModelChanges = function()
{
	return this.getListenerForEventType(oFF.OuDataProviderEventType.MODEL_CHANGE);
};
oFF.OuDataProviderEventing.prototype.getListenerForModelState = function()
{
	return this.getListenerForEventType(oFF.OuDataProviderEventType.MODEL_STATE);
};
oFF.OuDataProviderEventing.prototype.getListenerForResultDataFetch = function()
{
	return this.getListenerForEventType(oFF.OuDataProviderEventType.RESULT_DATA_FETCH);
};
oFF.OuDataProviderEventing.prototype.getListenerForVisualizationChanges = function()
{
	return this.getListenerForEventType(oFF.OuDataProviderEventType.VISUALIZATION_CHANGE);
};
oFF.OuDataProviderEventing.prototype.notifyExternalError = function(error)
{
	let errorEvent = this.getEmitterForError().newTypedEvent();
	errorEvent.setExternalChanges(true);
	errorEvent.addError(error);
	errorEvent.queue();
};
oFF.OuDataProviderEventing.prototype.notifyExternalModelChange = function(componentType)
{
	let modelChange = this.getEmitterForModelChanges().newTypedEvent();
	modelChange.setExternalChanges(true);
	modelChange.addChangedComponent(oFF.notNull(componentType) ? componentType : oFF.OlapComponentType.QUERY_MODEL);
	modelChange.queue();
};
oFF.OuDataProviderEventing.prototype.notifyExternalVisualizationChange = function(visualizationName)
{
	let vizChange = this.getEmitterForVisualizationChanges().newTypedEvent();
	vizChange.setExternalChanges(true);
	if (oFF.notNull(visualizationName))
	{
		vizChange.addChangedVisualizationName(visualizationName);
	}
	vizChange.queue();
};
oFF.OuDataProviderEventing.prototype.onLoopExecuted = function(events)
{
	let modelEvt = oFF.XCollectionUtils.findFirst(events, (evt) => {
		return evt.getEventType() === oFF.OuDataProviderEventType.MODEL_CHANGE;
	});
	let vizEvt = oFF.XCollectionUtils.findFirst(events, (evt) => {
		return evt.getEventType() === oFF.OuDataProviderEventType.VISUALIZATION_CHANGE;
	});
	let lifecycleEvt = oFF.XCollectionUtils.findFirst(events, (evt) => {
		return evt.getEventType() === oFF.OuDataProviderEventType.LIFECYCLE;
	});
	if (oFF.notNull(lifecycleEvt) && lifecycleEvt.isNewlyConnected())
	{
		this.m_triggerResult = false;
		if (this.m_dataProvider.getConnector().getCurrentConnected().isStartWithAutoFetch())
		{
			return;
		}
	}
	if (this.m_triggerResult || oFF.notNull(modelEvt))
	{
		if (this.m_eventLoop.getPendingEvents().hasElements())
		{
			this.m_triggerResult = true;
			return;
		}
		this.m_triggerResult = false;
		let correlationId = this.getCorrelationIdFromEvents(modelEvt, lifecycleEvt);
		this.m_dataProvider.getResultingBase().autoFetchResultSet(correlationId);
	}
	else if (oFF.notNull(vizEvt))
	{
		this.m_dataProvider.getResultingBase().autoFillVisualizations(vizEvt.getCorrelationId());
	}
};
oFF.OuDataProviderEventing.prototype.onModelComponentChanged = function(modelComponent, customIdentifier)
{
	if (oFF.notNull(modelComponent))
	{
		this.m_changes.addChangedOlapComponentTypes(modelComponent.getOlapComponentType());
	}
};
oFF.OuDataProviderEventing.prototype.onVariableProcessorStateChanged = function(variableProcessor, customIdentifier)
{
	if (variableProcessor.getVariableProcessorState() === oFF.VariableProcessorState.SUBMITTED || variableProcessor.getVariableProcessorState() === oFF.VariableProcessorState.CHANGEABLE_DIRECT_VALUE_TRANSFER)
	{
		let modelStateEvent = this.getEmitterForModelState().newTypedEvent();
		modelStateEvent.setNewState(oFF.OuDataProviderModelState.QUERY);
		modelStateEvent.queue();
	}
	else if (variableProcessor.getVariableProcessorState().isTypeOf(oFF.VariableProcessorState.CHANGEABLE_STATEFUL))
	{
		let modelStateEvent = this.getEmitterForModelState().newTypedEvent();
		modelStateEvent.setNewState(oFF.OuDataProviderModelState.VARIABLE);
		modelStateEvent.queue();
	}
};
oFF.OuDataProviderEventing.prototype.queueEvent = function(event)
{
	if (event.getCorrelationId() === null)
	{
		event.setCorrelationId(oFF.XGuid.getGuid());
	}
	this.m_eventLoop.queueEvent(event);
};
oFF.OuDataProviderEventing.prototype.registerEvent = function(baseTemplate, eventTemplate)
{
	this.registerEventInternal(baseTemplate, eventTemplate, true);
};
oFF.OuDataProviderEventing.prototype.registerEventInternal = function(baseTemplate, eventTemplate, external)
{
	let emitter = oFF.OuDataProviderEventEmitter.createEmitter(this.m_dataProvider, baseTemplate);
	emitter.setExternalEmitter(external);
	this.m_emitters.add(emitter);
	let listener = oFF.OuDataProviderEventListenerCollection.create(eventTemplate);
	this.m_listeners.add(listener);
};
oFF.OuDataProviderEventing.prototype.releaseObject = function()
{
	this.m_dataProvider = null;
	this.m_queryManager = null;
	this.m_emitters = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_emitters);
	this.m_listeners = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_listeners);
	this.m_changes = oFF.XObjectExt.release(this.m_changes);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OuDataProviderEventing.prototype.setActionChanges = function(correlationId, changes)
{
	if (this.m_changes.getCorrelationId() === null)
	{
		this.m_changes.setCorrelationId(correlationId);
	}
	this.m_changes.mergeChanges(changes);
};
oFF.OuDataProviderEventing.prototype.setEventingPaused = function(paused)
{
	this.m_eventLoop.setPaused(paused);
};
oFF.OuDataProviderEventing.prototype.setQueryManager = function(queryManager)
{
	if (oFF.notNull(this.m_queryManager) && this.m_queryManager.getQueryModel() !== null)
	{
		this.m_queryManager.getQueryModel().unregisterChangedListener(this);
		this.m_queryManager.unregisterVariableProcessorStateChangedListener(this);
	}
	this.m_queryManager = queryManager;
	if (oFF.notNull(this.m_queryManager) && this.m_queryManager.getQueryModel() !== null)
	{
		this.m_queryManager.getQueryModel().registerChangedListener(this, null);
		this.m_queryManager.registerVariableProcessorStateChangedListener(this, null);
	}
};
oFF.OuDataProviderEventing.prototype.setupExt = function(dataProvider, queryManager)
{
	this.m_dataProvider = dataProvider;
	this.m_changes = oFF.OuDataProviderActionChanges.create();
	this.m_eventLoop = oFF.OuDataProviderEventLoop.create(this.m_dataProvider);
	this.m_eventLoop.setLoopExecuted(this.onLoopExecuted.bind(this));
	this.m_emitters = oFF.XSetOfNameObject.create();
	this.m_listeners = oFF.XSetOfNameObject.create();
	this.registerEventInternal(new oFF.OuDataProviderAllEvent(), new oFF.OuDataProviderAllEvent(), false);
	this.registerEventInternal(new oFF.OuDataProviderErrorEvent(), new oFF.OuDataProviderErrorEvent(), false);
	this.registerEventInternal(new oFF.OuDataProviderLifecycleEvent(), new oFF.OuDataProviderLifecycleEvent(), false);
	this.registerEventInternal(new oFF.OuDataProviderModelStateEvent(), new oFF.OuDataProviderModelStateEvent(), false);
	this.registerEventInternal(new oFF.OuDataProviderModelChangeEvent(), new oFF.OuDataProviderModelChangeEvent(), false);
	this.registerEventInternal(new oFF.OuDataProviderVisualizationChangeEvent(), new oFF.OuDataProviderVisualizationChangeEvent(), false);
	this.registerEventInternal(new oFF.OuDataProviderResultDataFetchEvent(), new oFF.OuDataProviderResultDataFetchEvent(), false);
	this.setQueryManager(queryManager);
};

oFF.OuDataProviderLifecycle = function() {};
oFF.OuDataProviderLifecycle.prototype = new oFF.XConstantWithParent();
oFF.OuDataProviderLifecycle.prototype._ff_c = "OuDataProviderLifecycle";

oFF.OuDataProviderLifecycle.CONNECTED = null;
oFF.OuDataProviderLifecycle.DISCONNECTED = null;
oFF.OuDataProviderLifecycle.RELEASED = null;
oFF.OuDataProviderLifecycle.s_instance = null;
oFF.OuDataProviderLifecycle.create = function(name, parent)
{
	let obj = new oFF.OuDataProviderLifecycle();
	obj.setupExt(name, parent);
	oFF.OuDataProviderLifecycle.s_instance.put(name, obj);
	return obj;
};
oFF.OuDataProviderLifecycle.staticSetup = function()
{
	oFF.OuDataProviderLifecycle.s_instance = oFF.XHashMapByString.create();
	oFF.OuDataProviderLifecycle.CONNECTED = oFF.OuDataProviderLifecycle.create("Connected", null);
	oFF.OuDataProviderLifecycle.DISCONNECTED = oFF.OuDataProviderLifecycle.create("Disconnected", null);
	oFF.OuDataProviderLifecycle.RELEASED = oFF.OuDataProviderLifecycle.create("Released", null);
};

oFF.OdpActionParameterAxisType = function() {};
oFF.OdpActionParameterAxisType.prototype = new oFF.OdpDfActionProperty();
oFF.OdpActionParameterAxisType.prototype._ff_c = "OdpActionParameterAxisType";

oFF.OdpActionParameterAxisType.prototype.getPropertyDataType = function()
{
	return oFF.DataProviderActionParameterType.AXIS_TYPE;
};
oFF.OdpActionParameterAxisType.prototype.parseSpecificProperty = function(propertyMetadataStructure) {};
oFF.OdpActionParameterAxisType.prototype.setupSpecificProperty = function() {};
oFF.OdpActionParameterAxisType.prototype.validateSpecificProperty = function(jsonElement)
{
	return oFF.XList.create();
};
oFF.OdpActionParameterAxisType.prototype.validateWithDataProvider = function(dataProvider, value)
{
	let axisType = oFF.AxisType.lookup(value);
	if (oFF.isNull(axisType))
	{
		return oFF.XCollectionUtils.singletonList(oFF.XError.create(oFF.XStringUtils.concatenate2("not a valid axis type: ", value)));
	}
	return oFF.XList.create();
};

oFF.OdpActionParameterChartType = function() {};
oFF.OdpActionParameterChartType.prototype = new oFF.OdpDfActionProperty();
oFF.OdpActionParameterChartType.prototype._ff_c = "OdpActionParameterChartType";

oFF.OdpActionParameterChartType.prototype.getPropertyDataType = function()
{
	return oFF.DataProviderActionParameterType.CHART_TYPE;
};
oFF.OdpActionParameterChartType.prototype.parseSpecificProperty = function(propertyMetadataStructure) {};
oFF.OdpActionParameterChartType.prototype.setupSpecificProperty = function() {};
oFF.OdpActionParameterChartType.prototype.validateSpecificProperty = function(jsonElement)
{
	return oFF.XList.create();
};
oFF.OdpActionParameterChartType.prototype.validateWithDataProvider = function(dataProvider, value)
{
	let chartType = oFF.ChartType.lookup(value);
	if (oFF.isNull(chartType))
	{
		return oFF.XCollectionUtils.singletonList(oFF.XError.create(oFF.XStringUtils.concatenate2("not a valid chart type: ", value)));
	}
	return oFF.XList.create();
};

oFF.OdpActionParameterComparisonOperator = function() {};
oFF.OdpActionParameterComparisonOperator.prototype = new oFF.OdpDfActionProperty();
oFF.OdpActionParameterComparisonOperator.prototype._ff_c = "OdpActionParameterComparisonOperator";

oFF.OdpActionParameterComparisonOperator.prototype.getPropertyDataType = function()
{
	return oFF.DataProviderActionParameterType.COMPARISON_OPERATOR;
};
oFF.OdpActionParameterComparisonOperator.prototype.parseSpecificProperty = function(propertyMetadataStructure) {};
oFF.OdpActionParameterComparisonOperator.prototype.setupSpecificProperty = function() {};
oFF.OdpActionParameterComparisonOperator.prototype.validateSpecificProperty = function(jsonElement)
{
	return oFF.XList.create();
};
oFF.OdpActionParameterComparisonOperator.prototype.validateWithDataProvider = function(dataProvider, value)
{
	let comparisonOperator = oFF.ComparisonOperator.lookup(value);
	if (oFF.isNull(comparisonOperator))
	{
		return oFF.XCollectionUtils.singletonList(oFF.XError.create(oFF.XStringUtils.concatenate2("not a valid comparison operator: ", value)));
	}
	return oFF.XList.create();
};

oFF.OdpActionParameterDimension = function() {};
oFF.OdpActionParameterDimension.prototype = new oFF.OdpDfActionProperty();
oFF.OdpActionParameterDimension.prototype._ff_c = "OdpActionParameterDimension";

oFF.OdpActionParameterDimension.prototype.getPropertyDataType = function()
{
	return oFF.DataProviderActionParameterType.DIMENSION;
};
oFF.OdpActionParameterDimension.prototype.parseSpecificProperty = function(propertyMetadataStructure) {};
oFF.OdpActionParameterDimension.prototype.setupSpecificProperty = function() {};
oFF.OdpActionParameterDimension.prototype.validateSpecificProperty = function(jsonElement)
{
	return oFF.XList.create();
};
oFF.OdpActionParameterDimension.prototype.validateWithDataProvider = function(dataProvider, value)
{
	let olapDataProvider = oFF.OlapDataProviderUtil.getOlapDataProvider(dataProvider);
	if (oFF.isNull(olapDataProvider))
	{
		return oFF.XCollectionUtils.singletonList(oFF.XError.create("not an olap DataProvider"));
	}
	let queryManager = olapDataProvider.getQueryManager();
	if (oFF.isNull(queryManager))
	{
		return oFF.XCollectionUtils.singletonList(oFF.XError.create("no QueryManager available"));
	}
	let dimension = queryManager.getQueryModel().getDimensionByName(value);
	if (oFF.isNull(dimension))
	{
		return oFF.XCollectionUtils.singletonList(oFF.XError.create(oFF.XStringUtils.concatenate2("no dimension exists with name: ", value)));
	}
	return oFF.XList.create();
};

oFF.OdpActionParameterDimensionMember = function() {};
oFF.OdpActionParameterDimensionMember.prototype = new oFF.OdpDfActionProperty();
oFF.OdpActionParameterDimensionMember.prototype._ff_c = "OdpActionParameterDimensionMember";

oFF.OdpActionParameterDimensionMember.prototype.getPropertyDataType = function()
{
	return oFF.DataProviderActionParameterType.DIMENSION_MEMBER;
};
oFF.OdpActionParameterDimensionMember.prototype.parseSpecificProperty = function(propertyMetadataStructure) {};
oFF.OdpActionParameterDimensionMember.prototype.setupSpecificProperty = function() {};
oFF.OdpActionParameterDimensionMember.prototype.validateSpecificProperty = function(jsonElement)
{
	return oFF.XList.create();
};
oFF.OdpActionParameterDimensionMember.prototype.validateWithDataProvider = function(dataProvider, value)
{
	return oFF.XList.create();
};

oFF.OdpActionParameterField = function() {};
oFF.OdpActionParameterField.prototype = new oFF.OdpDfActionProperty();
oFF.OdpActionParameterField.prototype._ff_c = "OdpActionParameterField";

oFF.OdpActionParameterField.prototype.getPropertyDataType = function()
{
	return oFF.DataProviderActionParameterType.FIELD;
};
oFF.OdpActionParameterField.prototype.parseSpecificProperty = function(propertyMetadataStructure) {};
oFF.OdpActionParameterField.prototype.setupSpecificProperty = function() {};
oFF.OdpActionParameterField.prototype.validateSpecificProperty = function(jsonElement)
{
	return oFF.XList.create();
};
oFF.OdpActionParameterField.prototype.validateWithDataProvider = function(dataProvider, value)
{
	let olapDataProvider = oFF.OlapDataProviderUtil.getOlapDataProvider(dataProvider);
	if (oFF.isNull(olapDataProvider))
	{
		return oFF.XCollectionUtils.singletonList(oFF.XError.create("not an olap DataProvider"));
	}
	let queryManager = olapDataProvider.getQueryManager();
	if (oFF.isNull(queryManager))
	{
		return oFF.XCollectionUtils.singletonList(oFF.XError.create("no QueryManager available"));
	}
	let field = queryManager.getQueryModel().getFieldByName(value);
	if (oFF.isNull(field))
	{
		return oFF.XCollectionUtils.singletonList(oFF.XError.create(oFF.XStringUtils.concatenate2("no field exists with name: ", value)));
	}
	return oFF.XList.create();
};

oFF.OdpActionParameterMemberReadMode = function() {};
oFF.OdpActionParameterMemberReadMode.prototype = new oFF.OdpDfActionProperty();
oFF.OdpActionParameterMemberReadMode.prototype._ff_c = "OdpActionParameterMemberReadMode";

oFF.OdpActionParameterMemberReadMode.prototype.getPropertyDataType = function()
{
	return oFF.DataProviderActionParameterType.MEMBER_READ_MODE;
};
oFF.OdpActionParameterMemberReadMode.prototype.parseSpecificProperty = function(propertyMetadataStructure) {};
oFF.OdpActionParameterMemberReadMode.prototype.setupSpecificProperty = function() {};
oFF.OdpActionParameterMemberReadMode.prototype.validateSpecificProperty = function(jsonElement)
{
	return oFF.XList.create();
};
oFF.OdpActionParameterMemberReadMode.prototype.validateWithDataProvider = function(dataProvider, value)
{
	let memberReadMode = oFF.QMemberReadMode.lookup(value);
	if (oFF.isNull(memberReadMode))
	{
		return oFF.XCollectionUtils.singletonList(oFF.XError.create(oFF.XStringUtils.concatenate2("not a valid member read mode: ", value)));
	}
	return oFF.XList.create();
};

oFF.OdpActionParameterProtocolBindingType = function() {};
oFF.OdpActionParameterProtocolBindingType.prototype = new oFF.OdpDfActionProperty();
oFF.OdpActionParameterProtocolBindingType.prototype._ff_c = "OdpActionParameterProtocolBindingType";

oFF.OdpActionParameterProtocolBindingType.prototype.getPropertyDataType = function()
{
	return oFF.DataProviderActionParameterType.PROTOCOL_BINDING_TYPE;
};
oFF.OdpActionParameterProtocolBindingType.prototype.parseSpecificProperty = function(propertyMetadataStructure) {};
oFF.OdpActionParameterProtocolBindingType.prototype.setupSpecificProperty = function() {};
oFF.OdpActionParameterProtocolBindingType.prototype.validateSpecificProperty = function(jsonElement)
{
	return oFF.XList.create();
};
oFF.OdpActionParameterProtocolBindingType.prototype.validateWithDataProvider = function(dataProvider, value)
{
	let protocolType = oFF.ProtocolBindingType.lookup(value);
	if (oFF.isNull(protocolType))
	{
		return oFF.XCollectionUtils.singletonList(oFF.XError.create(oFF.XStringUtils.concatenate2("not a valid protocol binding type: ", value)));
	}
	return oFF.XList.create();
};

oFF.OdpActionParameterVisualizationType = function() {};
oFF.OdpActionParameterVisualizationType.prototype = new oFF.OdpDfActionProperty();
oFF.OdpActionParameterVisualizationType.prototype._ff_c = "OdpActionParameterVisualizationType";

oFF.OdpActionParameterVisualizationType.prototype.getPropertyDataType = function()
{
	return oFF.DataProviderActionParameterType.VISUALIZATION_TYPE;
};
oFF.OdpActionParameterVisualizationType.prototype.parseSpecificProperty = function(propertyMetadataStructure) {};
oFF.OdpActionParameterVisualizationType.prototype.setupSpecificProperty = function() {};
oFF.OdpActionParameterVisualizationType.prototype.validateSpecificProperty = function(jsonElement)
{
	return oFF.XList.create();
};
oFF.OdpActionParameterVisualizationType.prototype.validateWithDataProvider = function(dataProvider, value)
{
	let vizType = oFF.VisualizationType.lookup(value);
	if (oFF.isNull(vizType))
	{
		return oFF.XCollectionUtils.singletonList(oFF.XError.create(oFF.XStringUtils.concatenate2("not a valid visualization type: ", value)));
	}
	return oFF.XList.create();
};

oFF.OdpActionParameterZeroSuppressionType = function() {};
oFF.OdpActionParameterZeroSuppressionType.prototype = new oFF.OdpDfActionProperty();
oFF.OdpActionParameterZeroSuppressionType.prototype._ff_c = "OdpActionParameterZeroSuppressionType";

oFF.OdpActionParameterZeroSuppressionType.prototype.getPropertyDataType = function()
{
	return oFF.DataProviderActionParameterType.ZERO_SUPPRESSION_TYPE;
};
oFF.OdpActionParameterZeroSuppressionType.prototype.parseSpecificProperty = function(propertyMetadataStructure) {};
oFF.OdpActionParameterZeroSuppressionType.prototype.setupSpecificProperty = function() {};
oFF.OdpActionParameterZeroSuppressionType.prototype.validateSpecificProperty = function(jsonElement)
{
	return oFF.XList.create();
};
oFF.OdpActionParameterZeroSuppressionType.prototype.validateWithDataProvider = function(dataProvider, value)
{
	let zeroSuppressionType = oFF.ZeroSuppressionType.lookup(value);
	if (oFF.isNull(zeroSuppressionType))
	{
		return oFF.XCollectionUtils.singletonList(oFF.XError.create(oFF.XStringUtils.concatenate2("not a valid zero suppression type: ", value)));
	}
	return oFF.XList.create();
};

oFF.DataProviderFile = function() {};
oFF.DataProviderFile.prototype = new oFF.DfXFileProvider();
oFF.DataProviderFile.prototype._ff_c = "DataProviderFile";

oFF.DataProviderFile.DIMENSIONS_FILE = "dimensions";
oFF.DataProviderFile.RESULT_SET_FILE = "resultSet";
oFF.DataProviderFile.create = function(dataProvider, process, fs, uri, isFolder)
{
	let obj = new oFF.DataProviderFile();
	obj.setupFolder(dataProvider, process, fs, uri, isFolder);
	return obj;
};
oFF.DataProviderFile.prototype.m_dataProvider = null;
oFF.DataProviderFile.prototype.m_isDpFolder = false;
oFF.DataProviderFile.prototype.getDataProvider = function()
{
	return this.m_dataProvider;
};
oFF.DataProviderFile.prototype.isDataProviderFolder = function()
{
	return this.m_isDpFolder;
};
oFF.DataProviderFile.prototype.processProviderCommand = function(syncType, listener, customIdentifier, type, command)
{
	return oFF.DataProviderFileCommandAction.createAndRun(syncType, this, oFF.DataProviderFileRequestAdapter.create((fileRequestAction) => {
		if (oFF.notNull(listener))
		{
			let data = fileRequestAction.getData();
			listener.onFileProviderCommand(fileRequestAction, data, data.getProviderContent(), customIdentifier);
		}
	}), customIdentifier, type, command);
};
oFF.DataProviderFile.prototype.processProviderFetchChildren = function(syncType, listener, customIdentifier, config)
{
	return oFF.DataProviderFileFetchChildrenAction.createAndRun(syncType, this, oFF.DataProviderFileRequestAdapter.create((fileRequestAction) => {
		if (oFF.notNull(listener))
		{
			let data = fileRequestAction.getData();
			listener.onFileProviderChildrenFetched(fileRequestAction, data, data.getProviderChildFiles(), data.getProviderChildrenResultset(), customIdentifier);
		}
	}), customIdentifier);
};
oFF.DataProviderFile.prototype.processProviderFetchMetadata = function(syncType, listener, customIdentifier, cachingType)
{
	return oFF.DataProviderFileFetchMetadataAction.createAndRun(syncType, this, oFF.DataProviderFileRequestAdapter.create((fileRequestAction) => {
		if (oFF.notNull(listener))
		{
			let data = fileRequestAction.getData();
			listener.onFileProviderFetchMetadata(fileRequestAction, data, data.getProviderMetadataAndAttributes(), customIdentifier);
		}
	}), customIdentifier);
};
oFF.DataProviderFile.prototype.processProviderLoad = function(syncType, listener, customIdentifier, compression)
{
	return oFF.DataProviderFileLoadAction.createAndRun(syncType, this, oFF.DataProviderFileRequestAdapter.create((fileRequestAction) => {
		if (oFF.notNull(listener))
		{
			let data = fileRequestAction.getData();
			listener.onFileProviderLoaded(fileRequestAction, data, data.getProviderContent(), customIdentifier);
		}
	}), customIdentifier);
};
oFF.DataProviderFile.prototype.setupFolder = function(dataProvider, process, fs, uri, isFolder)
{
	this.setupFile(process, fs, uri);
	this.m_dataProvider = dataProvider;
	if (isFolder)
	{
		this.m_isDpFolder = true;
		let content = oFF.XContent.createContent();
		content.setObject(this.m_dataProvider);
		this.setProviderFileContent(content);
	}
	let metadata = oFF.PrStructure.create();
	metadata.putString(oFF.XFileAttribute.NAME, this.m_dataProvider.getName());
	metadata.putBoolean(oFF.XFileAttribute.IS_DIRECTORY, this.isDataProviderFolder());
	metadata.putBoolean(oFF.XFileAttribute.IS_EXISTING, true);
	metadata.putBoolean(oFF.XFileAttribute.SUPPORTS_COMMANDS, this.isDataProviderFolder());
	metadata.putLong(oFF.XFileAttribute.CREATED_AT, this.m_dataProvider.getCreatedAt());
	metadata.putLong(oFF.XFileAttribute.CHANGED_AT, this.m_dataProvider.getCreatedAt());
	metadata.putBoolean(oFF.XFileAttribute.IS_READABLE, true);
	metadata.putBoolean(oFF.XFileAttribute.IS_WRITEABLE, false);
	if (this.m_isDpFolder)
	{
		let actionMdStruct = metadata.putNewStructure(oFF.XFileAttribute.COMMANDS_METADATA);
		let actionList = actionMdStruct.putNewList(oFF.XFileAttribute.COMMANDS_LIST);
		let allActionManifests = dataProvider.getActions().getActionManifests();
		for (let i = 0; i < allActionManifests.size(); i++)
		{
			let actionStruct = actionList.addNewStructure();
			let action = allActionManifests.get(i);
			actionStruct.putString(oFF.XFileAttribute.COMMAND_NAME, action.getName());
			let parameterList = actionStruct.putNewList(oFF.XFileAttribute.COMMAND_ARGS);
			let parameterNames = action.getParameterList();
			for (let j = 0; j < parameterNames.size(); j++)
			{
				let parameterDefinition = parameterNames.get(j);
				let parameterStruct = parameterList.addNewStructure();
				parameterStruct.putString(oFF.XFileAttribute.COMMAND_ARG_NAME, parameterDefinition.getName());
				parameterStruct.putString(oFF.XFileAttribute.COMMAND_ARG_TYPE, parameterDefinition.getType().getName());
			}
		}
	}
	this.setProviderMetadata(metadata);
};
oFF.DataProviderFile.prototype.supportsProviderCommands = function()
{
	return true;
};
oFF.DataProviderFile.prototype.supportsProviderFetchChildren = function()
{
	return true;
};
oFF.DataProviderFile.prototype.supportsProviderLoad = function()
{
	return true;
};

oFF.DataProviderRootFolder = function() {};
oFF.DataProviderRootFolder.prototype = new oFF.DfXFileProvider();
oFF.DataProviderRootFolder.prototype._ff_c = "DataProviderRootFolder";

oFF.DataProviderRootFolder.create = function(process, fs, uri)
{
	let obj = new oFF.DataProviderRootFolder();
	obj.setupFolder(process, fs, uri);
	return obj;
};
oFF.DataProviderRootFolder.prototype.processProviderFetchChildren = function(syncType, listener, customIdentifier, config)
{
	return oFF.DataProviderRootFolderFetchChildrenAction.createAndRun(syncType, this, oFF.DataProviderFileRequestAdapter.create((fileRequestAction) => {
		if (oFF.notNull(listener))
		{
			let data = fileRequestAction.getData();
			listener.onFileProviderChildrenFetched(fileRequestAction, data, data.getProviderChildFiles(), data.getProviderChildrenResultset(), customIdentifier);
		}
	}), customIdentifier);
};
oFF.DataProviderRootFolder.prototype.processProviderFetchMetadata = function(syncType, listener, customIdentifier, cachingType)
{
	return null;
};
oFF.DataProviderRootFolder.prototype.setupFolder = function(process, fs, uri)
{
	this.setupFile(process, fs, uri);
	let metadata = oFF.PrStructure.create();
	metadata.putBoolean(oFF.XFileAttribute.IS_DIRECTORY, true);
	this.setProviderMetadata(metadata);
};
oFF.DataProviderRootFolder.prototype.supportsProviderFetchChildren = function()
{
	return true;
};

oFF.DfDataProviderFile = function() {};
oFF.DfDataProviderFile.prototype = new oFF.DfXFileProvider();
oFF.DfDataProviderFile.prototype._ff_c = "DfDataProviderFile";

oFF.DfDataProviderFile.prototype.isDataProviderFolder = function()
{
	return false;
};

oFF.SubSysDataProviderPool = function() {};
oFF.SubSysDataProviderPool.prototype = new oFF.DfProgramSubSys();
oFF.SubSysDataProviderPool.prototype._ff_c = "SubSysDataProviderPool";

oFF.SubSysDataProviderPool.DEFAULT_PROGRAM_NAME = "@SubSys.DataProviderPool";
oFF.SubSysDataProviderPool.prototype.m_dpPool = null;
oFF.SubSysDataProviderPool.prototype.getAdminApi = function()
{
	return this.m_dpPool;
};
oFF.SubSysDataProviderPool.prototype.getMainApi = function()
{
	return this.m_dpPool;
};
oFF.SubSysDataProviderPool.prototype.getProgramName = function()
{
	return oFF.SubSysDataProviderPool.DEFAULT_PROGRAM_NAME;
};
oFF.SubSysDataProviderPool.prototype.getSubSystemType = function()
{
	return oFF.SubSystemType.DATA_PROVIDER_POOL;
};
oFF.SubSysDataProviderPool.prototype.newProgram = function()
{
	let prg = new oFF.SubSysDataProviderPool();
	prg.setup();
	return prg;
};
oFF.SubSysDataProviderPool.prototype.runProcess = function()
{
	this.m_dpPool = oFF.DataProviderPool.createGlobal(this.getProcess());
	let parentProcess = this.getProcess().getParentProcess();
	let fileSystemManager = parentProcess.getFileSystemManager();
	let activeFileSystem = fileSystemManager.getActiveFileSystem();
	if (activeFileSystem.getProtocolType() === oFF.ProtocolType.VFS)
	{
		let vfs = activeFileSystem;
		vfs.addMountPointByUri("/dp", oFF.XUri.createFromUrl("fsdp:///"));
	}
	this.activateSubSystem(null, oFF.SubSystemStatus.ACTIVE);
	return true;
};

oFF.OuDataProviderProgram = function() {};
oFF.OuDataProviderProgram.prototype = new oFF.DfApplicationProgram();
oFF.OuDataProviderProgram.prototype._ff_c = "OuDataProviderProgram";

oFF.OuDataProviderProgram.PARAM_DATASOURCE_FQN = "dataSourceFqn";
oFF.OuDataProviderProgram.PARAM_DATA_PROVIDER_NAME = "dataProviderName";
oFF.OuDataProviderProgram.PARAM_REPO_FILE_PATH = "repoFilePath";
oFF.OuDataProviderProgram.PARAM_SYSTEM_NAME = "systemName";
oFF.OuDataProviderProgram.PROGRAM_NAME = "DataProvider";
oFF.OuDataProviderProgram.prototype.m_dataProvider = null;
oFF.OuDataProviderProgram.prototype.getDataProvider = function()
{
	return this.m_dataProvider;
};
oFF.OuDataProviderProgram.prototype.getProgramName = function()
{
	return oFF.OuDataProviderProgram.PROGRAM_NAME;
};
oFF.OuDataProviderProgram.prototype.getProgramType = function()
{
	return oFF.ProgramType.BACKGROUND;
};
oFF.OuDataProviderProgram.prototype.loadRepoJson = function()
{
	let repoFilePath = this.getArgumentStructure().getStringByKey(oFF.OuDataProviderProgram.PARAM_REPO_FILE_PATH);
	let repoFile = oFF.XFile.create(this.getProcess(), repoFilePath);
	return oFF.XFilePromise.isExisting(repoFile).onThenPromise((fileExists) => {
		if (!fileExists.getBoolean())
		{
			return oFF.XPromise.resolve(null);
		}
		return oFF.XFilePromise.loadJsonStructure(repoFile);
	}).onCatch((err) => {
		this.logError(err.getText());
	});
};
oFF.OuDataProviderProgram.prototype.newProgram = function()
{
	let program = new oFF.OuDataProviderProgram();
	program.setup();
	return program;
};
oFF.OuDataProviderProgram.prototype.prepareProgramMetadata = function(metadata)
{
	metadata.addParameter(oFF.OuDataProviderProgram.PARAM_DATA_PROVIDER_NAME, "The name of the data provider.");
	metadata.addParameter(oFF.OuDataProviderProgram.PARAM_SYSTEM_NAME, "The name of the backend system.");
	metadata.addParameter(oFF.OuDataProviderProgram.PARAM_DATASOURCE_FQN, "The full qualified data source name.");
	metadata.addParameter(oFF.OuDataProviderProgram.PARAM_REPO_FILE_PATH, "An optional path to a file that contains a repository json to be loaded.");
};
oFF.OuDataProviderProgram.prototype.processArguments = function(args) {};
oFF.OuDataProviderProgram.prototype.processConfiguration = function(configuration) {};
oFF.OuDataProviderProgram.prototype.runProcess = function()
{
	this.loadRepoJson().onThen((repoJson) => {
		let dataProviderName = this.getArgumentStructure().getStringByKey(oFF.OuDataProviderProgram.PARAM_DATA_PROVIDER_NAME);
		let systemName = this.getArgumentStructure().getStringByKey(oFF.OuDataProviderProgram.PARAM_SYSTEM_NAME);
		let dataSourceName = this.getArgumentStructure().getStringByKey(oFF.OuDataProviderProgram.PARAM_DATASOURCE_FQN);
		let application = this.getApplication();
		let config = oFF.OuDataProviderConfiguration.createConfigForEmptyDataProvider(application);
		config.setDataProviderName(dataProviderName);
		config.getStartConnection().setDataSourceName(dataSourceName);
		config.getStartConnection().setSystemName(systemName);
		config.getStartConnection().setRepoJson(repoJson);
		let dpPromise = oFF.OuDataProviderFactory.createDataProviderFromSource(config);
		dpPromise.onThen((dataProvider) => {
			this.m_dataProvider = dataProvider;
		});
	});
	return true;
};

oFF.DataProviderFileSystem = function() {};
oFF.DataProviderFileSystem.prototype = new oFF.DfXFileSystemBasic();
oFF.DataProviderFileSystem.prototype._ff_c = "DataProviderFileSystem";

oFF.DataProviderFileSystem.create = function(process)
{
	let newObj = new oFF.DataProviderFileSystem();
	newObj.setupProcessContext(process);
	return newObj;
};
oFF.DataProviderFileSystem.prototype.getDataProviderFolderName = function(uri)
{
	let previous = null;
	let current = uri;
	while (!oFF.XString.isEqual(current.getPath(), this.getRootDirectoryUri().getPath()))
	{
		previous = current;
		current = oFF.XUri.createParent(current);
	}
	return oFF.notNull(previous) ? previous.getPathContainer().getPathNames().get(0) : null;
};
oFF.DataProviderFileSystem.prototype.getProtocolType = function()
{
	return oFF.ProtocolType.FS_DP;
};
oFF.DataProviderFileSystem.prototype.isDataProviderFolder = function(uri)
{
	let parent = oFF.XUri.createParent(uri);
	return oFF.XString.isEqual(parent.getPath(), this.getRootDirectoryUri().getPath());
};
oFF.DataProviderFileSystem.prototype.newFile = function(process, uri)
{
	let path = uri.getPath();
	if (oFF.XString.isEqual(path, this.getRootDirectoryUri().getPath()))
	{
		return oFF.DataProviderRootFolder.create(process, this, uri);
	}
	let dpName = this.getDataProviderFolderName(uri);
	let isFolder = this.isDataProviderFolder(uri);
	let dp = this.getProcess().getDataProviderPool().getDataProviderByName(dpName);
	if (oFF.isNull(dp))
	{
		throw oFF.XException.createRuntimeException(oFF.XStringUtils.concatenate2("file system could not find data provider under: ", uri.getPath()));
	}
	return oFF.DataProviderFile.create(dp, process, this, uri, isFolder);
};
oFF.DataProviderFileSystem.prototype.setupProcessContext = function(process)
{
	oFF.DfXFileSystemBasic.prototype.setupProcessContext.call( this , process);
};

oFF.SubSysDataProviderFileSystem = function() {};
oFF.SubSysDataProviderFileSystem.prototype = new oFF.DfSubSysFilesystem();
oFF.SubSysDataProviderFileSystem.prototype._ff_c = "SubSysDataProviderFileSystem";

oFF.SubSysDataProviderFileSystem.DEFAULT_PROGRAM_NAME = "@SubSys.FileSystem.fsdp";
oFF.SubSysDataProviderFileSystem.prototype.m_fs = null;
oFF.SubSysDataProviderFileSystem.prototype.getFileSystem = function(protocolType)
{
	return this.m_fs;
};
oFF.SubSysDataProviderFileSystem.prototype.getProgramName = function()
{
	return oFF.SubSysDataProviderFileSystem.DEFAULT_PROGRAM_NAME;
};
oFF.SubSysDataProviderFileSystem.prototype.getProtocolType = function()
{
	return oFF.ProtocolType.FS_DP;
};
oFF.SubSysDataProviderFileSystem.prototype.newProgram = function()
{
	let prg = new oFF.SubSysDataProviderFileSystem();
	prg.setup();
	return prg;
};
oFF.SubSysDataProviderFileSystem.prototype.runProcess = function()
{
	let process = this.getProcess();
	this.m_fs = oFF.DataProviderFileSystem.create(process);
	this.activateSubSystem(null, oFF.SubSystemStatus.ACTIVE);
	return false;
};

oFF.DataProviderRootFolderFetchChildrenAction = function() {};
oFF.DataProviderRootFolderFetchChildrenAction.prototype = new oFF.SyncActionExt();
oFF.DataProviderRootFolderFetchChildrenAction.prototype._ff_c = "DataProviderRootFolderFetchChildrenAction";

oFF.DataProviderRootFolderFetchChildrenAction.createAndRun = function(syncType, dpFile, listener, customIdentifier)
{
	let object = new oFF.DataProviderRootFolderFetchChildrenAction();
	object.setData(dpFile);
	object.setupActionAndRun(syncType, listener, customIdentifier, dpFile);
	return object;
};
oFF.DataProviderRootFolderFetchChildrenAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onHttpFileProcessed(extResult, data, customIdentifier);
};
oFF.DataProviderRootFolderFetchChildrenAction.prototype.getRootFolderChildren = function(file)
{
	let children = oFF.XList.create();
	let dataProviderPool = this.getProcess().getDataProviderPool();
	let rootUri = file.getProviderFileSystem().getRootDirectoryUri();
	let allDataProviderNames = dataProviderPool.getAllDataProviderNames();
	for (let i = 0; i < allDataProviderNames.size(); i++)
	{
		let dataProviderName = allDataProviderNames.get(i);
		let dpUri = oFF.XUri.createChildDir(rootUri, dataProviderName);
		let dp = this.getProcess().getDataProviderPool().getDataProviderByName(dataProviderName);
		let dataProviderFolder = oFF.DataProviderFile.create(dp, this.getProcess(), file.getProviderFileSystem(), dpUri, true);
		children.add(dataProviderFolder);
	}
	return children;
};
oFF.DataProviderRootFolderFetchChildrenAction.prototype.processSynchronization = function(syncType)
{
	let file = this.getActionContext();
	let rootFolderChildren = this.getRootFolderChildren(file);
	file.setProviderChildFiles(rootFolderChildren, rootFolderChildren.size());
	return false;
};

oFF.DfDataProviderFileAction = function() {};
oFF.DfDataProviderFileAction.prototype = new oFF.SyncActionExt();
oFF.DfDataProviderFileAction.prototype._ff_c = "DfDataProviderFileAction";

oFF.DfDataProviderFileAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onHttpFileProcessed(extResult, data, customIdentifier);
};

oFF.OuDataProviderActionParameters = function() {};
oFF.OuDataProviderActionParameters.prototype = new oFF.XProperties();
oFF.OuDataProviderActionParameters.prototype._ff_c = "OuDataProviderActionParameters";

oFF.OuDataProviderActionParameters.createFromExisting = function(properties)
{
	let obj = new oFF.OuDataProviderActionParameters();
	obj.setupExt(null, null);
	obj.putAll(properties);
	return obj;
};
oFF.OuDataProviderActionParameters.createParams = function()
{
	let obj = new oFF.OuDataProviderActionParameters();
	obj.setupExt(null, null);
	return obj;
};
oFF.OuDataProviderActionParameters.prototype.getAxisType = function()
{
	return oFF.AxisType.lookup(this.getStringByKey(oFF.OuDataProviderActionConstants.PARAM_AXIS_TYPE_NAME));
};
oFF.OuDataProviderActionParameters.prototype.getChartType = function()
{
	return oFF.ChartType.lookup(this.getStringByKey(oFF.OuDataProviderActionConstants.PARAM_CHART_TYPE_NAME));
};
oFF.OuDataProviderActionParameters.prototype.getComparisonOperator = function()
{
	let comparisonOperatorString = this.getStringByKey(oFF.OuDataProviderActionConstants.PARAM_COMPARISON_OPERATOR);
	return oFF.notNull(comparisonOperatorString) ? oFF.ComparisonOperator.lookup(comparisonOperatorString) : null;
};
oFF.OuDataProviderActionParameters.prototype.getDimensionName = function()
{
	return this.getStringByKey(oFF.OuDataProviderActionConstants.PARAM_DIMENSION_NAME);
};
oFF.OuDataProviderActionParameters.prototype.getMemberName = function()
{
	return this.getStringByKey(oFF.OuDataProviderActionConstants.PARAM_MEMBER_NAME);
};
oFF.OuDataProviderActionParameters.prototype.getProtocolBindingType = function()
{
	return oFF.ProtocolBindingType.lookup(this.getStringByKey(oFF.OuDataProviderActionConstants.PARAM_PROTOCOL_BINDING_TYPE));
};
oFF.OuDataProviderActionParameters.prototype.getVisualizationName = function()
{
	return this.getStringByKey(oFF.OuDataProviderActionConstants.PARAM_VIZ_NAME);
};
oFF.OuDataProviderActionParameters.prototype.getVisualizationType = function()
{
	return oFF.VisualizationType.lookup(this.getStringByKey(oFF.OuDataProviderActionConstants.PARAM_VIZ_TYPE_NAME));
};
oFF.OuDataProviderActionParameters.prototype.setAxisType = function(axisType)
{
	if (oFF.notNull(axisType))
	{
		this.putString(oFF.OuDataProviderActionConstants.PARAM_AXIS_TYPE_NAME, axisType.getName());
	}
};
oFF.OuDataProviderActionParameters.prototype.setChartType = function(chartType)
{
	if (oFF.notNull(chartType))
	{
		this.putString(oFF.OuDataProviderActionConstants.PARAM_CHART_TYPE_NAME, chartType.getName());
	}
};
oFF.OuDataProviderActionParameters.prototype.setComparisonOperator = function(comparisonOperator)
{
	this.putString(oFF.OuDataProviderActionConstants.PARAM_COMPARISON_OPERATOR, comparisonOperator);
};
oFF.OuDataProviderActionParameters.prototype.setDimensionName = function(dimensionName)
{
	this.putString(oFF.OuDataProviderActionConstants.PARAM_DIMENSION_NAME, dimensionName);
};
oFF.OuDataProviderActionParameters.prototype.setMemberName = function(memberName)
{
	this.putString(oFF.OuDataProviderActionConstants.PARAM_MEMBER_NAME, memberName);
};
oFF.OuDataProviderActionParameters.prototype.setProtocolBindingType = function(bindingType)
{
	if (oFF.notNull(bindingType))
	{
		this.putString(oFF.OuDataProviderActionConstants.PARAM_PROTOCOL_BINDING_TYPE, bindingType.getName());
	}
};
oFF.OuDataProviderActionParameters.prototype.setVisualizationName = function(vizName)
{
	this.putString(oFF.OuDataProviderActionConstants.PARAM_VIZ_NAME, vizName);
};
oFF.OuDataProviderActionParameters.prototype.setVisualizationType = function(vizType)
{
	if (oFF.notNull(vizType))
	{
		this.putString(oFF.OuDataProviderActionConstants.PARAM_VIZ_TYPE_NAME, vizType.getName());
	}
};

oFF.DataProviderFileCommandAction = function() {};
oFF.DataProviderFileCommandAction.prototype = new oFF.DfDataProviderFileAction();
oFF.DataProviderFileCommandAction.prototype._ff_c = "DataProviderFileCommandAction";

oFF.DataProviderFileCommandAction.createAndRun = function(syncType, dpFile, listener, customIdentifier, type, command)
{
	let object = new oFF.DataProviderFileCommandAction();
	object.m_command = command;
	object.setData(dpFile);
	object.setupActionAndRun(syncType, listener, customIdentifier, dpFile);
	return object;
};
oFF.DataProviderFileCommandAction.prototype.m_command = null;
oFF.DataProviderFileCommandAction.prototype.processSynchronization = function(syncType)
{
	let file = this.getActionContext();
	let fileContent = file.getProviderContent();
	if (oFF.isNull(fileContent) || fileContent.getObject() === null)
	{
		this.addError(0, "DataProvider file has no content");
		return false;
	}
	let dataProvider = fileContent.getObject();
	dataProvider.getActions().executeActionByName(this.m_command, oFF.XList.create()).onFinally(this.endSync.bind(this));
	return true;
};

oFF.DataProviderFileFetchChildrenAction = function() {};
oFF.DataProviderFileFetchChildrenAction.prototype = new oFF.DfDataProviderFileAction();
oFF.DataProviderFileFetchChildrenAction.prototype._ff_c = "DataProviderFileFetchChildrenAction";

oFF.DataProviderFileFetchChildrenAction.createAndRun = function(syncType, dpFile, listener, customIdentifier)
{
	let object = new oFF.DataProviderFileFetchChildrenAction();
	object.setData(dpFile);
	object.setupActionAndRun(syncType, listener, customIdentifier, dpFile);
	return object;
};
oFF.DataProviderFileFetchChildrenAction.prototype.processSynchronization = function(syncType)
{
	let file = this.getActionContext();
	let fs = file.getProviderFileSystem();
	if (file.isDataProviderFolder())
	{
		let dataProvider = file.getDataProvider();
		let files = oFF.XList.create();
		files.add(oFF.DataProviderFile.create(dataProvider, this.getProcess(), fs, oFF.XUri.createChildFile(file.getUri(), oFF.DataProviderFile.DIMENSIONS_FILE), false));
		files.add(oFF.DataProviderFile.create(dataProvider, this.getProcess(), fs, oFF.XUri.createChildFile(file.getUri(), oFF.DataProviderFile.RESULT_SET_FILE), false));
		file.setProviderChildFiles(files, files.size());
	}
	return false;
};

oFF.DataProviderFileFetchMetadataAction = function() {};
oFF.DataProviderFileFetchMetadataAction.prototype = new oFF.DfDataProviderFileAction();
oFF.DataProviderFileFetchMetadataAction.prototype._ff_c = "DataProviderFileFetchMetadataAction";

oFF.DataProviderFileFetchMetadataAction.createAndRun = function(syncType, dpFile, listener, customIdentifier)
{
	let object = new oFF.DataProviderFileFetchMetadataAction();
	object.setData(dpFile);
	object.setupActionAndRun(syncType, listener, customIdentifier, dpFile);
	return object;
};
oFF.DataProviderFileFetchMetadataAction.prototype.processSynchronization = function(syncType)
{
	return false;
};

oFF.DataProviderFileLoadAction = function() {};
oFF.DataProviderFileLoadAction.prototype = new oFF.DfDataProviderFileAction();
oFF.DataProviderFileLoadAction.prototype._ff_c = "DataProviderFileLoadAction";

oFF.DataProviderFileLoadAction.createAndRun = function(syncType, dpFile, listener, customIdentifier)
{
	let object = new oFF.DataProviderFileLoadAction();
	object.setData(dpFile);
	object.setupActionAndRun(syncType, listener, customIdentifier, dpFile);
	return object;
};
oFF.DataProviderFileLoadAction.prototype.loadDimensions = function()
{
	let file = this.getActionContext();
	let dp = file.getDataProvider();
	dp.getOrCreateQueryManager().onThen((queryManager) => {
		let dimensionNames = queryManager.getQueryModel().getDimensionNames();
		let buffer = oFF.XStringBuffer.create();
		oFF.XCollectionUtils.forEach(dimensionNames, (name) => {
			buffer.appendLine(name);
		});
		let content = oFF.XContent.createStringContent(oFF.ContentType.TEXT, buffer.toString());
		file.setProviderFileContent(content);
		this.endSync();
	});
};
oFF.DataProviderFileLoadAction.prototype.loadResultSet = function()
{
	let file = this.getActionContext();
	let dp = file.getDataProvider();
	dp.getActions().getResultSetActions().getAsciiResultSet(-1, -1).onThen((asciiRS) => {
		let rsContent = oFF.XContent.createStringContent(oFF.ContentType.TEXT, asciiRS);
		file.setProviderFileContent(rsContent);
		this.endSync();
	});
};
oFF.DataProviderFileLoadAction.prototype.processSynchronization = function(syncType)
{
	let file = this.getActionContext();
	file.setProviderIsExisting(true);
	if (oFF.XString.isEqual(file.getName(), oFF.DataProviderFile.DIMENSIONS_FILE))
	{
		this.loadDimensions();
	}
	else if (oFF.XString.isEqual(file.getName(), oFF.DataProviderFile.RESULT_SET_FILE))
	{
		this.loadResultSet();
	}
	return true;
};

oFF.OlapDataProviderModule = function() {};
oFF.OlapDataProviderModule.prototype = new oFF.DfModule();
oFF.OlapDataProviderModule.prototype._ff_c = "OlapDataProviderModule";

oFF.OlapDataProviderModule.s_module = null;
oFF.OlapDataProviderModule.getInstance = function()
{
	if (oFF.isNull(oFF.OlapDataProviderModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.OlapApiModule.getInstance());
		oFF.OlapDataProviderModule.s_module = oFF.DfModule.startExt(new oFF.OlapDataProviderModule());
		oFF.OuDataProviderState.staticSetup();
		oFF.OuDataProviderEventType.staticSetup();
		oFF.OuDataProviderLifecycle.staticSetup();
		oFF.OuDataProviderResultDataFetchStep.staticSetup();
		oFF.OuDataProviderFactory.staticSetup();
		oFF.OuDataProviderActionCollectionRegistry.staticSetup();
		oFF.OuDataProviderModelState.staticSetup();
		oFF.ProgramRegistry.setProgramFactory(new oFF.SubSysDataProviderPool());
		oFF.ProgramRegistry.setProgramFactory(new oFF.SubSysDataProviderFileSystem());
		oFF.ProgramRegistry.setProgramFactory(new oFF.OuDataProviderProgram());
		oFF.CoPropertyFactory.registerPropertyTypeClass(oFF.DataProviderActionParameterType.AXIS_TYPE, oFF.XClass.create(oFF.OdpActionParameterAxisType));
		oFF.CoPropertyFactory.registerPropertyTypeClass(oFF.DataProviderActionParameterType.CHART_TYPE, oFF.XClass.create(oFF.OdpActionParameterChartType));
		oFF.CoPropertyFactory.registerPropertyTypeClass(oFF.DataProviderActionParameterType.COMPARISON_OPERATOR, oFF.XClass.create(oFF.OdpActionParameterComparisonOperator));
		oFF.CoPropertyFactory.registerPropertyTypeClass(oFF.DataProviderActionParameterType.DIMENSION, oFF.XClass.create(oFF.OdpActionParameterDimension));
		oFF.CoPropertyFactory.registerPropertyTypeClass(oFF.DataProviderActionParameterType.DIMENSION_MEMBER, oFF.XClass.create(oFF.OdpActionParameterDimensionMember));
		oFF.CoPropertyFactory.registerPropertyTypeClass(oFF.DataProviderActionParameterType.FIELD, oFF.XClass.create(oFF.OdpActionParameterField));
		oFF.CoPropertyFactory.registerPropertyTypeClass(oFF.DataProviderActionParameterType.PROTOCOL_BINDING_TYPE, oFF.XClass.create(oFF.OdpActionParameterProtocolBindingType));
		oFF.CoPropertyFactory.registerPropertyTypeClass(oFF.DataProviderActionParameterType.VISUALIZATION_TYPE, oFF.XClass.create(oFF.OdpActionParameterVisualizationType));
		oFF.CoPropertyFactory.registerPropertyTypeClass(oFF.DataProviderActionParameterType.MEMBER_READ_MODE, oFF.XClass.create(oFF.OdpActionParameterMemberReadMode));
		oFF.CoPropertyFactory.registerPropertyTypeClass(oFF.DataProviderActionParameterType.ZERO_SUPPRESSION_TYPE, oFF.XClass.create(oFF.OdpActionParameterZeroSuppressionType));
		oFF.DfModule.stopExt(oFF.OlapDataProviderModule.s_module);
	}
	return oFF.OlapDataProviderModule.s_module;
};
oFF.OlapDataProviderModule.prototype.getName = function()
{
	return "ff5000.olap.dataprovider";
};

oFF.OlapDataProviderModule.getInstance();

return oFF;
} );